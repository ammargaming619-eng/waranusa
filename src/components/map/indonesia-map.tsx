"use client";

/**
 * WaraNusa — Peta sebaran wilayah budaya 38 Provinsi Nusantara (Leaflet / react-leaflet v5).
 *
 * - Multi-provider tile layer: Esri World Topographic (default, relief alam kepulauan tanpa API key),
 *   Esri NatGeo (arsip budaya klasik), dan OSM Standard.
 * - Penanda: CircleMarker Teal (#159D9A) dengan border putih solid tebal (#FFFFFF, weight 3.5),
 *   berubah menjadi Emas (#F2B544) saat terpilih.
 * - Client-only dynamic import untuk mencegah SSR window error.
 */

import * as React from "react";
import "leaflet/dist/leaflet.css";
import { Layers, MapPin, Maximize2, Sparkles } from "lucide-react";

import type { Region } from "@/lib/types";
import { cn } from "@/lib/utils";

void Sparkles;

// ---------- Tipe lokal minimal untuk react-leaflet (tanpa `any`) ----------

interface LeafletMapLike {
  fitBounds(bounds: [[number, number], [number, number]], options?: object): void;
  flyTo(latlng: [number, number], zoom?: number, options?: object): void;
  scrollWheelZoom: { enable(): void; disable(): void };
  on(type: string, fn: () => void): void;
  off(type: string, fn: () => void): void;
  remove(): void;
}

interface MapContainerProps {
  center?: [number, number];
  zoom?: number;
  scrollWheelZoom?: boolean;
  zoomControl?: boolean;
  attributionControl?: boolean;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

interface TileLayerProps {
  url: string;
  attribution?: string;
  maxZoom?: number;
  subdomains?: string | string[];
}

interface CircleMarkerProps {
  center: [number, number];
  radius?: number;
  pathOptions?: {
    color?: string;
    weight?: number;
    fillColor?: string;
    fillOpacity?: number;
    className?: string;
  };
  eventHandlers?: {
    click?: (event?: unknown) => void;
  };
  children?: React.ReactNode;
}

interface TooltipProps {
  direction?: "top" | "bottom" | "left" | "right" | "center" | "auto";
  permanent?: boolean;
  offset?: [number, number];
  className?: string;
  children?: React.ReactNode;
}

type ReactLeafletModule = typeof import("react-leaflet");

interface LeafletComponents {
  MapContainer: React.ForwardRefExoticComponent<
    MapContainerProps & React.RefAttributes<LeafletMapLike>
  >;
  TileLayer: React.FC<TileLayerProps>;
  CircleMarker: React.FC<CircleMarkerProps>;
  Tooltip: React.FC<TooltipProps>;
}

function pickComponents(mod: ReactLeafletModule): LeafletComponents {
  return {
    MapContainer: mod.MapContainer as unknown as LeafletComponents["MapContainer"],
    TileLayer: mod.TileLayer as unknown as LeafletComponents["TileLayer"],
    CircleMarker: mod.CircleMarker as unknown as LeafletComponents["CircleMarker"],
    Tooltip: mod.Tooltip as unknown as LeafletComponents["Tooltip"],
  };
}

// ---------- Konstanta peta ----------

/** Bounds kepulauan Indonesia dari Sabang sampai Merauke */
const INDONESIA_BOUNDS: [[number, number], [number, number]] = [
  [-11.5, 94.5],
  [6.5, 141.5],
];

export type MapStyleKey = "topo" | "natgeo" | "osm";

export const MAP_PROVIDERS: Record<
  MapStyleKey,
  { label: string; shortLabel: string; url: string; subdomains?: string; attribution: string }
> = {
  topo: {
    label: "Topografi Alam (Esri)",
    shortLabel: "Topografi",
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}",
    attribution:
      "Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, USGS, FAO, NPS, NRCAN",
  },
  natgeo: {
    label: "Gaya Budaya Klasik (NatGeo)",
    shortLabel: "NatGeo",
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}",
    attribution:
      "National Geographic, Esri, DeLorme, HERE, UNEP-WCMC, USGS, NASA, ESA, METI, NRCAN, GEBCO, NOAA, increment P Corp.",
  },
  osm: {
    label: "Standar Terbuka (OSM)",
    shortLabel: "OSM",
    url: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  },
};

const COLOR_TEAL = "#159D9A";
const COLOR_GOLD = "#F2B544";

export interface IndonesiaMapProps {
  regions: Region[];
  selectedId?: string | null;
  onSelect: (r: Region) => void;
  className?: string;
}

export default function IndonesiaMap({
  regions,
  selectedId,
  onSelect,
  className,
}: IndonesiaMapProps) {
  const [mounted, setMounted] = React.useState(false);
  const [rl, setRl] = React.useState<ReactLeafletModule | null>(null);
  const [map, setMap] = React.useState<LeafletMapLike | null>(null);
  const [activeStyle, setActiveStyle] = React.useState<MapStyleKey>("topo");
  const [isStyleMenuOpen, setIsStyleMenuOpen] = React.useState(false);

  // Gate mount + import react-leaflet hanya di sisi klien
  React.useEffect(() => {
    let alive = true;
    setMounted(true);
    import("react-leaflet")
      .then((mod) => {
        if (alive) setRl(mod);
      })
      .catch(() => {
        // Fallback jika gagal memuat module
      });
    return () => {
      alive = false;
    };
  }, []);

  // FitBounds Indonesia saat peta siap + kebijakan scroll zoom aman
  React.useEffect(() => {
    if (!map) return;
    map.fitBounds(INDONESIA_BOUNDS, { padding: [20, 20] });
    const enableScroll = () => {
      map.scrollWheelZoom.enable();
    };
    const disableScroll = () => {
      map.scrollWheelZoom.disable();
    };
    map.on("click", enableScroll);
    map.on("mouseout", disableScroll);
    return () => {
      map.off("click", enableScroll);
      map.off("mouseout", disableScroll);
    };
  }, [map]);

  // Terbang halus ke koordinat wilayah terpilih saat berubah
  React.useEffect(() => {
    if (!map || !selectedId) return;
    const target = regions.find((r) => r.id === selectedId);
    if (target && target.lat && target.lng) {
      map.flyTo([target.lat, target.lng], 6, {
        duration: 1.2,
      });
    }
  }, [map, selectedId, regions]);

  const ready = mounted && rl !== null;
  const currentProvider = MAP_PROVIDERS[activeStyle];

  const handleResetView = () => {
    if (map) {
      map.fitBounds(INDONESIA_BOUNDS, { padding: [20, 20] });
    }
  };

  return (
    <div className={cn("w-full relative", className)}>
      <div className="relative z-0 h-[380px] w-full overflow-hidden rounded-2xl border border-stone-200 bg-[#FAF7F2] shadow-sm sm:h-[480px] lg:h-[600px]">
        {/* Floating Controls di sudut kanan atas peta */}
        {ready && (
          <div className="absolute top-3 right-3 z-[1000] flex items-center gap-1.5 bg-white/95 backdrop-blur-md px-2.5 py-1.5 rounded-xl border border-stone-200 shadow-md">
            {/* Tombol Pemilih Gaya Peta */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsStyleMenuOpen((prev) => !prev)}
                className="flex items-center gap-1.5 text-xs font-semibold text-stone-700 hover:text-stone-900 px-2 py-1 rounded-lg hover:bg-stone-100 transition-colors cursor-pointer"
                title="Pilih Tampilan Peta"
              >
                <Layers className="h-3.5 w-3.5 text-[#6E472D]" />
                <span>{currentProvider.shortLabel}</span>
              </button>

              {isStyleMenuOpen && (
                <div className="absolute right-0 top-full mt-1.5 w-52 rounded-xl border border-stone-200 bg-white p-1.5 shadow-xl animate-in fade-in zoom-in-95 duration-150 z-50">
                  <p className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-stone-500">
                    Gaya Peta Dasar
                  </p>
                  {(Object.keys(MAP_PROVIDERS) as MapStyleKey[]).map((key) => {
                    const item = MAP_PROVIDERS[key];
                    const isActive = activeStyle === key;
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => {
                          setActiveStyle(key);
                          setIsStyleMenuOpen(false);
                        }}
                        className={cn(
                          "w-full flex items-center justify-between gap-2 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors text-left cursor-pointer",
                          isActive
                            ? "bg-[#6E472D]/10 text-[#6E472D] font-semibold"
                            : "text-stone-700 hover:bg-stone-100"
                        )}
                      >
                        <span className="truncate">{item.label}</span>
                        {isActive && <span className="h-1.5 w-1.5 rounded-full bg-[#6E472D] shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="h-4 w-px bg-stone-200" />

            {/* Tombol Reset Tampilan Seluruh Indonesia */}
            <button
              type="button"
              onClick={handleResetView}
              className="flex items-center gap-1 text-xs font-semibold text-stone-700 hover:text-stone-900 px-2 py-1 rounded-lg hover:bg-stone-100 transition-colors"
              title="Reset Tampilan Seluruh Nusantara"
            >
              <Maximize2 className="h-3.5 w-3.5 text-stone-500" />
              <span className="hidden sm:inline">Pusatkan</span>
            </button>
          </div>
        )}

        {!ready ? (
          <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-[#FAF7F2]">
            <span className="h-10 w-10 animate-pulse rounded-full bg-[#159D9A]/25" aria-hidden />
            <p className="text-xs font-medium text-stone-600">Menyiapkan peta 38 provinsi Nusantara…</p>
          </div>
        ) : regions.length === 0 ? (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 p-6 text-center">
            <MapPin className="h-8 w-8 text-[#159D9A]/60" aria-hidden />
            <p className="text-sm font-semibold text-stone-800">Belum ada wilayah</p>
            <p className="max-w-xs text-xs text-muted-foreground">
              Data wilayah budaya belum tersedia untuk ditampilkan di peta.
            </p>
          </div>
        ) : (
          (() => {
            const { MapContainer, TileLayer, CircleMarker, Tooltip } = pickComponents(rl);
            return (
              <MapContainer
                center={[-2.5, 118]}
                zoom={5}
                scrollWheelZoom={false}
                zoomControl
                attributionControl
                className="h-full w-full"
                style={{ width: "100%", height: "100%" }}
                ref={(instance) => {
                  setMap(instance);
                }}
              >
                <TileLayer
                  key={activeStyle}
                  url={currentProvider.url}
                  subdomains={currentProvider.subdomains ?? "abc"}
                  attribution={currentProvider.attribution}
                />
                {regions.map((region) => {
                  const isSelected = region.id === selectedId;
                  return (
                    <CircleMarker
                      key={region.id}
                      center={[region.lat, region.lng]}
                      radius={isSelected ? 11 : 7.5}
                      pathOptions={{
                        color: "#FFFFFF",
                        weight: isSelected ? 4 : 3,
                        fillColor: isSelected ? COLOR_GOLD : COLOR_TEAL,
                        fillOpacity: 1.0,
                        className: cn(
                          "transition-all duration-200 cursor-pointer",
                          isSelected && "drop-shadow-[0_0_12px_rgba(242,181,68,0.9)]"
                        ),
                      }}
                      eventHandlers={{
                        click: () => onSelect(region),
                      }}
                    >
                      <Tooltip
                        direction="top"
                        permanent={isSelected}
                        offset={[0, -8]}
                        className={cn(
                          "region-tooltip text-xs font-semibold rounded-lg px-2.5 py-1 border shadow-md",
                          isSelected
                            ? "bg-amber-500 text-white border-amber-600 font-bold"
                            : "bg-white/95 text-stone-800 border-stone-200"
                        )}
                      >
                        {region.name}
                      </Tooltip>
                    </CircleMarker>
                  );
                })}
              </MapContainer>
            );
          })()
        )}
      </div>

      <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2 text-[11px] text-stone-600 px-1">
        <span>
          Klik salah satu dari <strong className="text-[#2D1E12]">38 penanda provinsi</strong> untuk menelaah khazanah arsitektur adat dan tradisinya.
        </span>
        <span className="hidden sm:inline font-mono text-[10px] text-stone-500">
          Peta: {currentProvider.label}
        </span>
      </div>
    </div>
  );
}
