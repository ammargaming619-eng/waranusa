"use client";

/**
 * WaraNusa — ModelViewer 3D.
 *
 * - LAZY MOUNT: Canvas baru dirender setelah kontainer terlihat (IntersectionObserver).
 * - GLB/GLTF: bila item.modelMedia ber-ekstensi .glb/.gltf, model dimuat via drei
 *   useGLTF (Suspense + ErrorBoundary). Gagal → fallback model prosedural + toast.
 * - Tanpa modelMedia → model prosedural sesuai PROCEDURAL_SLUG_MAP.
 * - Hotspot: titik emas + label nomor; klik → panel deskripsi.
 * - Kontrol: reset kamera & toggle rotasi otomatis.
 */

import * as React from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { AlertTriangle, Box, ExternalLink, Pause, Rotate3d, RotateCcw, X } from "lucide-react";
import { toast } from "sonner";

import type { CulturalItem, Hotspot } from "@/lib/types";
import { isEmbedModel, sketchfabPageUrl } from "@/lib/media-embed";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  DEFAULT_PROCEDURAL,
  ProceduralModel,
  PROCEDURAL_SLUG_MAP,
  SpriteLabel,
  type ProceduralKey,
} from "@/components/three/procedural-models";

// ---------- Util ----------

/** Deteksi dukungan WebGL sebelum mencoba membuat Canvas. */
function hasWebGL(): boolean {
  try {
    if (typeof window === "undefined" || typeof document === "undefined") return false;
    const canvas = document.createElement("canvas");
    return Boolean(
      window.WebGLRenderingContext &&
        (canvas.getContext("webgl2") ?? canvas.getContext("webgl")),
    );
  } catch {
    return false;
  }
}

/** Kembalikan URL bila ber-ekstensi .glb/.gltf (abaikan query/hash). */
function asGltfUrl(url: string | undefined | null): string | null {
  if (!url) return null;
  const clean = url.split("?")[0]?.split("#")[0]?.toLowerCase() ?? "";
  return clean.endsWith(".glb") || clean.endsWith(".gltf") ? url : null;
}

function HotspotList(item: CulturalItem): Hotspot[] {
  return (item.hotspots ?? []).filter((h) => h.published);
}

// ---------- Error boundary lokal (dipakai di sekitar GltfModel & Canvas) ----------

interface BoundaryProps {
  onError: (error: unknown) => void;
  children: React.ReactNode;
}

class SilentErrorBoundary extends React.Component<BoundaryProps, { hasError: boolean }> {
  constructor(props: BoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    this.props.onError(error);
  }

  render() {
    if (this.state.hasError) return null;
    return this.props.children;
  }
}

// ---------- Studio Environment (Zero-network procedural IBL) ----------

function StudioEnvironment() {
  const { gl, scene } = useThree();
  React.useEffect(() => {
    // 1. Konfigurasi Renderer (sRGB Color Space & ACES Filmic Tone Mapping)
    gl.outputColorSpace = THREE.SRGBColorSpace;
    gl.toneMapping = THREE.ACESFilmicToneMapping;
    gl.toneMappingExposure = 1.15;

    const pmremGenerator = new THREE.PMREMGenerator(gl);
    pmremGenerator.compileEquirectangularShader();
    const envScene = new RoomEnvironment();
    const envTexture = pmremGenerator.fromScene(envScene).texture;
    scene.environment = envTexture;
    scene.environmentIntensity = 0.45;
    return () => {
      scene.environment = null;
      envTexture.dispose();
      envScene.dispose();
      pmremGenerator.dispose();
    };
  }, [gl, scene]);
  return null;
}

// ---------- Model GLB ----------

function GltfModel({ url }: { url: string }) {
  const { scene } = useGLTF(url);

  const prepared = React.useMemo(() => {
    const clone = scene.clone(true);
    // 3. Traverse pada Material GLB: Pastikan sRGB colorSpace pada texture map & bayangan aktif
    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        const mesh = child as THREE.Mesh;
        if (mesh.material) {
          const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
          materials.forEach((mat) => {
            mat.side = THREE.DoubleSide;
            const stdMat = mat as THREE.MeshStandardMaterial;
            if (stdMat.map) {
              stdMat.map.colorSpace = THREE.SRGBColorSpace;
              stdMat.map.needsUpdate = true;
            }
            if (typeof stdMat.roughness === "number") {
              stdMat.roughness = Math.max(0.35, Math.min(0.7, stdMat.roughness));
            }
            if (typeof stdMat.metalness === "number") {
              stdMat.metalness = Math.min(stdMat.metalness, 0.08);
            }
            mat.needsUpdate = true;
          });
        }
      }
    });
    // Normalisasi: skala agar dimensi terbesar ±2.2 unit, pangkal di y=0, terpusat.
    const box = new THREE.Box3().setFromObject(clone);
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z) || 1;
    clone.scale.setScalar(2.2 / maxDim);
    const box2 = new THREE.Box3().setFromObject(clone);
    const center = box2.getCenter(new THREE.Vector3());
    clone.position.set(-center.x, clone.position.y - box2.min.y, -center.z);
    return clone;
  }, [scene]);

  return <primitive object={prepared} />;
}

// ---------- Invalidate otomatis saat prop/state berubah (frameloop demand) ----------

function AutoInvalidate() {
  const invalidate = useThree((s) => s.invalidate);
  React.useEffect(() => {
    invalidate();
  });
  return null;
}

// ---------- Panel status (placeholder / error / webgl) ----------

function StatusPanel({
  icon,
  title,
  desc,
  action,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-3 p-6 text-center">
      {icon}
      <p className="text-sm font-semibold text-brand-ink">{title}</p>
      <p className="max-w-xs text-xs leading-relaxed text-muted-foreground">{desc}</p>
      {action}
    </div>
  );
}

// ---------- Kamera Responsif (Framing Dekat & Megah, Proporsional di Semua Layar) ----------

function ResponsiveCamera() {
  const { camera, size } = useThree();
  React.useEffect(() => {
    const aspect = size.width / size.height;
    if (camera instanceof THREE.PerspectiveCamera) {
      if (aspect < 1.15) {
        // Layar portrait / mobile: mundurkan kamera proporsional
        const factor = Math.min(Math.max(1.15 / aspect, 1.05), 1.45);
        camera.position.set(2.3 * factor, 1.65 * factor, 2.5 * factor);
      } else {
        camera.position.set(2.3, 1.65, 2.5);
      }
      camera.updateProjectionMatrix();
    }
  }, [camera, size]);
  return null;
}

// ---------- Grup Rotasi Persisten (Tetap Berputar Mulus Saat Scroll Halaman) ----------

function ContinuouslyRotatingGroup({
  spin,
  children,
  speed = 0.55,
}: {
  spin: boolean;
  children: React.ReactNode;
  speed?: number;
}) {
  const groupRef = React.useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (spin && groupRef.current) {
      // Rotasi kontinu mulus yang tidak terputus saat pengguna melakukan scroll pada halaman
      groupRef.current.rotation.y += delta * speed;
    }
  });
  return (
    <group ref={groupRef} position={[0, -0.9, 0]} scale={[1.35, 1.35, 1.35]}>
      {children}
    </group>
  );
}

// ---------- Komponen utama ----------

export interface ModelViewerProps {
  item: CulturalItem;
  height?: number | string;
  showHotspots?: boolean;
  autoRotate?: boolean;
  className?: string;
  hideControls?: boolean;
}

export default function ModelViewer({
  item,
  height = 420,
  showHotspots = true,
  autoRotate = false,
  className,
  hideControls = false,
}: ModelViewerProps) {
  const wrapRef = React.useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = React.useState(false);
  const [webgl] = React.useState<boolean>(() =>
    typeof window === "undefined" ? true : hasWebGL(),
  );
  const [spin, setSpin] = React.useState(autoRotate);
  const [glbFailed, setGlbFailed] = React.useState(false);
  const [fatal, setFatal] = React.useState(false);
  const [renderKey, setRenderKey] = React.useState(0);
  const [openHotspotId, setOpenHotspotId] = React.useState<string | null>(null);
  const glbToastShown = React.useRef(false);
  const controlsRef = React.useRef<React.ComponentRef<typeof OrbitControls> | null>(null);

  const glbUrl = React.useMemo(() => asGltfUrl(item.modelMedia?.url), [item.modelMedia?.url]);
  const embedUrl = isEmbedModel(item.modelMedia) ? item.modelMedia!.embedUrl! : null;
  const embedPageUrl = React.useMemo(() => (embedUrl ? sketchfabPageUrl(embedUrl) : null), [embedUrl]);
  const slugKey: ProceduralKey = PROCEDURAL_SLUG_MAP[item.slug] ?? DEFAULT_PROCEDURAL;
  const hotspots = React.useMemo(() => (showHotspots ? HotspotList(item) : []), [item, showHotspots]);
  const openHotspot = hotspots.find((h) => h.id === openHotspotId) ?? null;

  // Reset state saat berganti item.
  React.useEffect(() => {
    setGlbFailed(false);
    setFatal(false);
    setOpenHotspotId(null);
    glbToastShown.current = false;
  }, [item.id]);

  // Lazy mount: render Canvas hanya setelah kontainer terlihat.
  React.useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            io.disconnect();
            break;
          }
        }
      },
      { rootMargin: "220px", threshold: 0.05 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const handleGlbError = React.useCallback(() => {
    setGlbFailed(true);
    if (!glbToastShown.current) {
      glbToastShown.current = true;
      toast.info("Model GLB gagal dimuat, menampilkan model demo");
    }
  }, []);

  const handleRetry = React.useCallback(() => {
    setFatal(false);
    setGlbFailed(false);
    glbToastShown.current = false;
    setOpenHotspotId(null);
    setRenderKey((k) => k + 1);
  }, []);

  const resetCamera = React.useCallback(() => {
    controlsRef.current?.reset();
    setOpenHotspotId(null);
  }, []);

  return (
    <div
      ref={wrapRef}
      className={cn(
        "relative w-full overflow-hidden rounded-2xl border border-brand-line bg-brand-soft min-h-[300px]",
        embedUrl && "flex flex-col",
        className,
      )}
      style={height !== undefined ? { height } : undefined}
      data-item-slug={item.slug}
    >
      {embedUrl ? (
        <>
          {/* ---- MODE EMBED EKSTERNAL (mis. Sketchfab) ---- */}
          {visible ? (
            <div className="relative min-h-0 flex-1">
              <iframe
                src={embedUrl}
                title={`Model 3D interaktif: ${item.title}`}
                loading="lazy"
                allow="autoplay; fullscreen; xr-spatial-tracking"
                allowFullScreen
                frameBorder={0}
                className="absolute inset-0 h-full w-full"
              />
            </div>
          ) : (
            <div className="flex min-h-0 flex-1 items-center justify-center">
              <StatusPanel
                icon={<Box className="h-9 w-9 text-brand-teal" aria-hidden />}
                title="Viewer 3D siap dimuat"
                desc="Gulir hingga bagian ini terlihat untuk memuat viewer 3D secara hemat."
              />
            </div>
          )}

          {/* Chip bagian (hotspot) — viewer embed punya kontrol sendiri, jadi daftar di bawah */}
          {hotspots.length > 0 && (
            <div className="flex flex-wrap gap-1.5 border-t border-brand-line bg-background/90 px-3 py-2" role="list" aria-label="Bagian model">
              {hotspots.map((h, i) => (
                <button
                  key={h.id}
                  type="button"
                  onClick={() => setOpenHotspotId((cur) => (cur === h.id ? null : h.id))}
                  aria-expanded={openHotspotId === h.id}
                  className={cn(
                    "rounded-full border px-2.5 py-1 text-[11px] font-semibold transition-colors",
                    openHotspotId === h.id
                      ? "border-brand-teal bg-brand-teal text-white"
                      : "border-brand-line bg-secondary text-brand-ink hover:border-brand-teal/50 hover:text-brand-teal"
                  )}
                >
                  {i + 1}. {h.title}
                </button>
              ))}
            </div>
          )}

          {/* Atribusi wajib — sumber model ditampilkan apa adanya */}
          <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 border-t border-brand-line bg-secondary/70 px-3 py-1.5 text-[11px] text-muted-foreground">
            <span className="min-w-0 truncate">
              {item.modelMedia?.attribution ? (
                item.modelMedia.attribution
              ) : (
                `Model 3D: ${item.modelMedia?.name ?? item.title}`
              )}
            </span>
            <a
              href={embedPageUrl ?? embedUrl}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="inline-flex shrink-0 items-center gap-1 font-semibold text-brand-teal underline-offset-2 hover:underline"
            >
              Lihat di Sketchfab <ExternalLink className="h-3 w-3" aria-hidden />
            </a>
          </div>

          {/* Panel detail hotspot (dipicu chip) */}
          {openHotspot && (
            <Card className="absolute bottom-14 left-3 right-3 z-10 gap-2 rounded-xl px-4 py-3 shadow-lg sm:right-auto sm:w-80">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-brand-ink">{openHotspot.title}</p>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{openHotspot.description}</p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label="Tutup panel hotspot"
                  onClick={() => setOpenHotspotId(null)}
                  className="h-7 w-7 shrink-0 rounded-md"
                >
                  <X className="h-4 w-4" aria-hidden />
                </Button>
              </div>
            </Card>
          )}
        </>
      ) : !visible ? (
        <StatusPanel
          icon={<Box className="h-9 w-9 text-brand-teal" aria-hidden />}
          title="Viewer 3D siap dimuat"
          desc="Gulir hingga bagian ini terlihat untuk memuat tampilan 3D secara hemat."
        />
      ) : !webgl ? (
        <StatusPanel
          icon={<AlertTriangle className="h-8 w-8 text-brand-orange" aria-hidden />}
          title="WebGL tidak tersedia"
          desc="Perangkat atau browser ini tidak mendukung WebGL, sehingga penampil 3D tidak dapat dirender. Gunakan browser modern dengan akselerasi grafis aktif."
        />
      ) : fatal ? (
        <StatusPanel
          icon={<AlertTriangle className="h-8 w-8 text-brand-orange" aria-hidden />}
          title="Model 3D tidak dapat dimuat"
          desc="Terjadi kesalahan saat menyiapkan scene 3D. Coba muat ulang bagian ini."
          action={
            <Button size="sm" onClick={handleRetry} aria-label="Coba lagi memuat model 3D">
              Coba lagi
            </Button>
          }
        />
      ) : (
        <>
          <SilentErrorBoundary
            key={`fatal-${renderKey}`}
            onError={() => {
              setFatal(true);
            }}
          >
            <Canvas
              key={renderKey}
              shadows="soft"
              dpr={[1, 2]}
              camera={{ position: [2.3, 1.65, 2.5], fov: 45 }}
              frameloop={spin ? "always" : "demand"}
              gl={{
                outputColorSpace: THREE.SRGBColorSpace,
                toneMapping: THREE.ACESFilmicToneMapping,
                toneMappingExposure: 1.15,
                antialias: true,
              }}
              onPointerMissed={() => setOpenHotspotId(null)}
              style={{ width: "100%", height: "100%" }}
            >
              <ResponsiveCamera />
              <StudioEnvironment />
              
              {/* 1. Ambient Light Krem Hangat (intensity 0.5) */}
              <ambientLight intensity={0.5} color="#fff6e8" />
              
              {/* 2. Hemisphere Light: Sky putih '#ffffff', Ground pantulan kayu/tanah '#593b1d' (intensity 0.6) */}
              <hemisphereLight color="#ffffff" groundColor="#593b1d" intensity={0.6} />
              
              {/* 3. Directional Light Utama (Key Light) */}
              <directionalLight
                position={[5, 10, 7]}
                intensity={1.8}
                color="#fff9ed"
                castShadow
                shadow-mapSize-width={1024}
                shadow-mapSize-height={1024}
                shadow-camera-left={-4}
                shadow-camera-right={4}
                shadow-camera-top={4}
                shadow-camera-bottom={-4}
                shadow-camera-near={0.5}
                shadow-camera-far={20}
                shadow-bias={-0.0004}
              />

              {/* 4. Directional Light Sekunder (Rim/Fill Light dari arah berlawanan untuk garis tegas atap/sisi gelap) */}
              <directionalLight
                position={[-5, 5, -5]}
                intensity={0.6}
                color="#fff9ed"
              />

              <ContinuouslyRotatingGroup spin={spin}>
                {glbUrl && !glbFailed ? (
                  <SilentErrorBoundary key={`glb-${renderKey}-${glbUrl}`} onError={handleGlbError}>
                    <React.Suspense
                      fallback={
                        <mesh position={[0, 1.4, 0]}>
                          <torusGeometry args={[0.28, 0.045, 12, 40]} />
                          <meshBasicMaterial color="#159D9A" />
                        </mesh>
                      }
                    >
                      <GltfModel url={glbUrl} />
                    </React.Suspense>
                  </SilentErrorBoundary>
                ) : (
                  <ProceduralModel slugKey={slugKey} />
                )}

                {/* Hotspot emas + label nomor */}
                {hotspots.map((h, i) => (
                  <group key={h.id} position={[h.x, h.y, h.z]}>
                    <mesh
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenHotspotId(h.id);
                      }}
                      onPointerOver={(e) => {
                        e.stopPropagation();
                        document.body.style.cursor = "pointer";
                      }}
                      onPointerOut={() => {
                        document.body.style.cursor = "";
                      }}
                    >
                      <sphereGeometry args={[0.05, 16, 12]} />
                      <meshStandardMaterial
                        color="#F2B544"
                        emissive="#F2B544"
                        emissiveIntensity={0.85}
                        roughness={0.4}
                      />
                    </mesh>
                    <SpriteLabel
                      text={String(i + 1)}
                      position={[0, 0.16, 0]}
                      scale={0.26}
                      interactive
                      onClick={() => setOpenHotspotId(h.id)}
                    />
                  </group>
                ))}
              </ContinuouslyRotatingGroup>

              {/* Lantai lingkaran */}
              <mesh
                receiveShadow
                rotation={[-Math.PI / 2, 0, 0]}
                position={[0, -0.91, 0]}
              >
                <circleGeometry args={[3.4, 48]} />
                <meshStandardMaterial color="#FAF5EB" roughness={0.85} metalness={0} />
              </mesh>

              <OrbitControls
                ref={controlsRef}
                makeDefault
                enablePan={false}
                enableZoom={false}
                minDistance={1.8}
                maxDistance={8}
                maxPolarAngle={1.45}
                enableDamping
                dampingFactor={0.08}
              />
              <AutoInvalidate />
            </Canvas>
          </SilentErrorBoundary>

          {/* Kontrol overlay */}
          {!hideControls && (
            <div className="absolute right-3 top-3 z-10 flex flex-col gap-2">
              <Button
                type="button"
                variant="outline"
                size="icon"
                aria-label="Reset kamera"
                title="Reset kamera"
                onClick={resetCamera}
                className="h-9 w-9 rounded-lg border-brand-line bg-white/90 text-brand-ink shadow-sm backdrop-blur hover:bg-white"
              >
                <RotateCcw className="h-4 w-4" aria-hidden />
              </Button>
              <Button
                type="button"
                variant="outline"
                size="icon"
                aria-label={spin ? "Matikan rotasi otomatis" : "Aktifkan rotasi otomatis"}
                title={spin ? "Matikan rotasi otomatis" : "Aktifkan rotasi otomatis"}
                onClick={() => setSpin((s) => !s)}
                className={cn(
                  "h-9 w-9 rounded-lg border-brand-line bg-white/90 text-brand-ink shadow-sm backdrop-blur hover:bg-white",
                  spin && "text-brand-teal"
                )}
              >
                {spin ? <Pause className="h-4 w-4" aria-hidden /> : <Rotate3d className="h-4 w-4" aria-hidden />}
              </Button>
            </div>
          )}

          {/* Panel hotspot */}
          {openHotspot && (
            <Card className="absolute bottom-3 left-3 right-3 z-10 gap-2 rounded-xl px-4 py-3 shadow-lg sm:right-auto sm:w-80">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-brand-ink">{openHotspot.title}</p>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    {openHotspot.description}
                  </p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label="Tutup panel hotspot"
                  onClick={() => setOpenHotspotId(null)}
                  className="h-7 w-7 shrink-0 rounded-md"
                >
                  <X className="h-4 w-4" aria-hidden />
                </Button>
              </div>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
