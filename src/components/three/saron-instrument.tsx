"use client";

/**
 * WaraNusa — Saron virtual interaktif (dipakai halaman instrumen publik).
 *
 * Fitur Unggulan:
 * 1. Mode Mouse / Sentuh: klik bilah, seret pandangan 3D, atau tombol angka 1–7.
 * 2. Mode Gerakan Udara (Air Gamelan):
 *    - Deteksi gestur tangan real-time via @mediapipe/tasks-vision.
 *    - Melacak ujung jari telunjuk (Landmark 8: INDEX_FINGER_TIP).
 *    - Kursor bulat emas menyala dengan efek riak gelombang saat menabuh.
 *    - Pemicu tabuh: Gerakan turun cepat (Air Tap) ATAU melayang diam (Hover 0.5s).
 *    - Floating preview webcam dengan garis kerangka sendi tangan di pojok instrumen.
 * 3. Audio via singleton saronAudio (Web Audio API, sintesis metalofon).
 */

import * as React from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import {
  Hand,
  Info,
  MousePointer,
  Play,
  Sparkles,
  Square,
  Volume2,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { ProceduralSaron, SARON_KEY_XS, SpriteLabel } from "@/components/three/procedural-models";
import { saronAudio } from "@/components/three/saron-audio";
import {
  AirGesture3DTracker,
  AirGestureCursorOverlay,
  AirGamelanFloatingPreview,
  useAirGamelanTracking,
} from "@/components/three/air-gamelan";

/** Frekuensi (Hz) 7 nada pelog — pendekatan demo, tidak temperamen sama. */
export const PELOG_FREQUENCIES = [261.63, 293.66, 329.63, 392.0, 440.0, 493.88, 587.33] as const;

/** Label nada 1–7 (notasi kepatihan). */
export const PELOG_LABELS = ["1", "2", "3", "4", "5", "6", "7"] as const;

/** Nama nada tradisional gamelan Jawa pelog (Ji, Ro, Lu, Pat, Mo, Nem, Pi). */
export const PELOG_NAMES = ["Ji", "Ro", "Lu", "Pat", "Mo", "Nem", "Pi"] as const;

/** Urutan nada contoh (indeks 0-based) untuk tombol demo. */
const DEMO_SEQUENCE = [0, 1, 2, 4, 5, 4, 2, 1, 0] as const;
const DEMO_INTERVAL_MS = 350;
const NOTE_HOLD_MS = 250;

function AutoInvalidate() {
  const invalidate = useThree((s) => s.invalidate);
  React.useEffect(() => {
    invalidate();
  });
  return null;
}

export interface SaronInstrumentProps {
  /** Volume awal 0..1 (default 0.7). */
  volume?: number;
}

export function SaronInstrument({ volume = 0.7 }: SaronInstrumentProps) {
  const [vol, setVol] = React.useState(volume);
  const [activeNote, setActiveNote] = React.useState<number | null>(null);
  const [playingDemo, setPlayingDemo] = React.useState(false);
  const [controlMode, setControlMode] = React.useState<"mouse" | "air">("mouse");
  const [hoveredNote, setHoveredNote] = React.useState<number | null>(null);

  const noteTimer = React.useRef<number | null>(null);
  const demoTimer = React.useRef<number | null>(null);
  const volRef = React.useRef(volume);

  // Sinkronkan bila prop volume berubah dari luar
  React.useEffect(() => {
    volRef.current = volume;
    setVol(volume);
    saronAudio.updateVolume(volume);
  }, [volume]);

  const playNote = React.useCallback((index: number) => {
    const freq = PELOG_FREQUENCIES[index];
    if (typeof freq !== "number") return;
    try {
      if (typeof navigator !== "undefined" && typeof navigator.vibrate === "function") {
        navigator.vibrate(20);
      }
    } catch {}
    saronAudio.playNote(freq, volRef.current);
    setActiveNote(index);
    if (noteTimer.current !== null) window.clearTimeout(noteTimer.current);
    noteTimer.current = window.setTimeout(() => setActiveNote(null), NOTE_HOLD_MS);
  }, []);

  const updateVolume = React.useCallback((v: number) => {
    const clamped = Math.min(1, Math.max(0, v));
    volRef.current = clamped;
    setVol(clamped);
    saronAudio.updateVolume(clamped);
  }, []);

  // ---------- Air Gamelan: Penanganan Error Kamera ----------
  const handleAirError = React.useCallback((error: Error) => {
    setControlMode("mouse");
    if (error.name === "NotAllowedError" || error.name === "PermissionDeniedError") {
      toast.error("Izin kamera ditolak. Silakan izinkan akses webcam pada browser.");
    } else if (error.name === "NotFoundError" || error.name === "DevicesNotFoundError") {
      toast.error("Kamera tidak ditemukan pada perangkat Anda.");
    } else {
      toast.error(`Kamera tidak dapat diakses: ${error.message || "Gagal mengaktifkan"}`);
    }
  }, []);

  // ---------- Air Gamelan: Hook Pelacakan Gestur Tangan ----------
  const {
    videoRef,
    canvasRef,
    isLoadingModel,
    handDetected,
    cursor,
    cursorNDC,
    hoverProgress,
    strikeEvent,
  } = useAirGamelanTracking({
    active: controlMode === "air",
    hoveredNote,
    onPlayNote: playNote,
    onError: handleAirError,
  });

  // ---------- Demo melodi ----------
  const stopDemo = React.useCallback(() => {
    if (demoTimer.current !== null) {
      window.clearTimeout(demoTimer.current);
      demoTimer.current = null;
    }
    setPlayingDemo(false);
  }, []);

  const startDemo = React.useCallback(() => {
    if (demoTimer.current !== null) {
      window.clearTimeout(demoTimer.current);
      demoTimer.current = null;
    }
    setPlayingDemo(true);
    let step = 0;
    const tick = () => {
      const idx = DEMO_SEQUENCE[step];
      if (typeof idx === "number") playNote(idx);
      step += 1;
      if (step >= DEMO_SEQUENCE.length) {
        demoTimer.current = window.setTimeout(() => {
          demoTimer.current = null;
          setPlayingDemo(false);
        }, 550);
        return;
      }
      demoTimer.current = window.setTimeout(tick, DEMO_INTERVAL_MS);
    };
    tick();
  }, [playNote]);

  // ---------- Keyboard 1–7 ----------
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.tagName === "SELECT" ||
          target.isContentEditable)
      ) {
        return;
      }
      const idx = PELOG_LABELS.indexOf(e.key as (typeof PELOG_LABELS)[number]);
      if (idx >= 0) playNote(idx);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [playNote]);

  // ---------- Cleanup ----------
  React.useEffect(() => {
    return () => {
      if (noteTimer.current !== null) window.clearTimeout(noteTimer.current);
      if (demoTimer.current !== null) window.clearTimeout(demoTimer.current);
      saronAudio.dispose();
      document.body.style.cursor = "";
    };
  }, []);

  return (
    <section aria-label="Saron virtual" className="w-full">
      {/* Tombol Pemilih Mode Kontrol: Mouse / Sentuh vs Air Gesture */}
      <div className="mb-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div className="grid grid-cols-2 sm:inline-flex items-center rounded-xl border border-brand-line bg-muted/40 p-1 gap-1">
          <Button
            type="button"
            size="sm"
            variant={controlMode === "mouse" ? "default" : "ghost"}
            onClick={() => setControlMode("mouse")}
            className={`h-9 sm:h-8 rounded-lg px-2 sm:px-3 text-xs font-semibold transition-all ${
              controlMode === "mouse"
                ? "bg-brand-ink text-white shadow-sm hover:bg-brand-ink"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <MousePointer className="mr-1.5 h-3.5 w-3.5 shrink-0" aria-hidden />
            <span className="truncate">Mode Sentuh</span>
          </Button>
          <Button
            type="button"
            size="sm"
            variant={controlMode === "air" ? "default" : "ghost"}
            onClick={() => {
              setControlMode("air");
              toast.info("Mengaktifkan Air Gamelan... Mohon izinkan akses webcam.");
            }}
            className={`h-9 sm:h-8 rounded-lg px-2 sm:px-3 text-xs font-semibold transition-all ${
              controlMode === "air"
                ? "bg-brand-gold text-brand-ink shadow-sm hover:bg-brand-gold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Sparkles className="mr-1.5 h-3.5 w-3.5 text-amber-600 shrink-0" aria-hidden />
            <span className="truncate">Air Gesture</span>
            <Badge
              variant="secondary"
              className="ml-1 sm:ml-1.5 px-1 py-0 text-[9px] font-extrabold uppercase bg-amber-100 text-amber-900 border-amber-300"
            >
              AI
            </Badge>
          </Button>
        </div>

        {controlMode === "air" && (
          <div className="flex items-center gap-1.5 text-xs text-brand-teal font-medium">
            <Hand className="h-3.5 w-3.5 animate-pulse text-amber-500" />
            <span className="text-xs">Hand Tracking Vision Aktif</span>
          </div>
        )}
      </div>

      {/* Panggung 3D */}
      <div
        role="application"
        aria-label="Saron virtual — klik bilah atau gunakan gestur udara untuk membunyikan"
        className="relative h-[280px] sm:h-[380px] w-full overflow-hidden rounded-2xl border border-brand-line bg-brand-soft shadow-sm"
      >
        <Canvas
          shadows="soft"
          dpr={[1, 2]}
          camera={{ position: [0, 1.35, 2.9], fov: 40 }}
          frameloop={controlMode === "air" ? "always" : "demand"}
          style={{ width: "100%", height: "100%" }}
        >
          <ambientLight intensity={0.75} />
          <directionalLight
            position={[3, 5, 3]}
            intensity={1.15}
            castShadow
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
            shadow-camera-left={-3}
            shadow-camera-right={3}
            shadow-camera-top={3}
            shadow-camera-bottom={-3}
            shadow-camera-near={0.5}
            shadow-camera-far={15}
            shadow-bias={-0.0004}
          />
          <spotLight position={[-3, 4, -2]} intensity={26} angle={0.6} penumbra={1} color="#FFF3DC" />

          <group position={[0, -0.45, 0]}>
            <ProceduralSaron onNote={playNote} activeNote={activeNote} />
            {/* Label nomor di atas tiap bilah (sprite, non-interaktif) */}
            {SARON_KEY_XS.map((x, i) => (
              <SpriteLabel
                key={`label-${i}`}
                text={PELOG_LABELS[i]}
                position={[x, 0.72, 0]}
                scale={0.2}
                bg={activeNote === i ? "#F2B544" : "#FFFFFF"}
                border={activeNote === i ? "#B08D57" : "#E1EBE8"}
              />
            ))}
          </group>

          {/* Panggung Kayu Melingkar Warm Studio */}
          <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.46, 0]}>
            <circleGeometry args={[4.2, 64]} />
            <meshStandardMaterial color="#EFE8DC" roughness={0.9} metalness={0.05} />
          </mesh>

          {/* Pelacak Sinar Tangan 3D ke Bilah Saron */}
          <AirGesture3DTracker
            cursorNDC={cursorNDC}
            active={controlMode === "air"}
            onHoverNote={setHoveredNote}
          />

          <OrbitControls
            makeDefault
            enableZoom={false}
            enablePan={false}
            minPolarAngle={0.7}
            maxPolarAngle={1.4}
            enableDamping
            dampingFactor={0.08}
          />
          <AutoInvalidate />
        </Canvas>

        {/* Indikator Kursor Penunjuk Emas Virtual di atas Kanvas */}
        {controlMode === "air" && (
          <AirGestureCursorOverlay
            cursor={cursor}
            hoveredNote={hoveredNote}
            hoverProgress={hoverProgress}
            strikeEvent={strikeEvent}
            handDetected={handDetected}
            labels={PELOG_LABELS}
          />
        )}

        {/* Floating Preview Webcam di Pojok Kanan Bawah */}
        {controlMode === "air" && (
          <AirGamelanFloatingPreview
            videoRef={videoRef}
            canvasRef={canvasRef}
            handDetected={handDetected}
            isLoadingModel={isLoadingModel}
            hoveredNote={hoveredNote}
            lastStrike={strikeEvent}
            onClose={() => setControlMode("mouse")}
            labels={PELOG_LABELS}
          />
        )}

        <Badge
          variant="outline"
          className="absolute right-3 top-3 border-stone-200 bg-white/95 text-[11px] font-semibold text-[#6E472D] shadow-xs backdrop-blur"
        >
          {controlMode === "air" ? "Air Gamelan • Vision AI" : "Laras Pelog 7 Nada • Karawitan Tradisional"}
        </Badge>
      </div>

      {/* Pengumuman nada untuk pembaca layar */}
      <span aria-live="polite" className="sr-only">
        {activeNote !== null ? `Nada ${PELOG_LABELS[activeNote]} dibunyikan` : ""}
      </span>

      {/* Petunjuk Interaksi */}
      <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
        <Info className="h-3.5 w-3.5 text-brand-teal shrink-0" aria-hidden />
        {controlMode === "air" ? (
          <span>
            <strong className="text-brand-ink">Mode Gerakan Udara:</strong> Arahkan ujung telunjuk ke
            bilah nada, lalu <strong className="text-amber-700">ketuk cepat ke bawah</strong> atau{" "}
            <strong className="text-amber-700">diamkan selama 0.5 detik</strong> untuk memukul bilah!
          </span>
        ) : (
          <span>Klik bilah 3D, ketuk bilah sentuh di bawah, atau tekan angka 1–7.</span>
        )}
      </p>

      {/* ========================================================================= */}
      {/* PAPAN TABUH SENTUH MOBILE (COMFORTABLE TOUCH-BAR FOR SMARTPHONES)          */}
      {/* ========================================================================= */}
      <div className="mt-3 rounded-2xl border border-stone-200 bg-[#FAF7F2] p-2.5 sm:p-3 shadow-inner">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
            Bilah Saron Sentuh (Tap Layar Sentuh)
          </span>
          <span className="text-[10px] sm:text-[11px] text-stone-500 font-medium">
            Ketuk bilah perunggu dengan jari
          </span>
        </div>

        <div className="grid grid-cols-7 gap-1 sm:gap-2" role="group" aria-label="Bilah tabuh saron sentuh">
          {PELOG_LABELS.map((label, i) => {
            const isActive = activeNote === i;
            return (
              <button
                key={`touch-bar-${label}`}
                type="button"
                onPointerDown={(e) => {
                  e.preventDefault();
                  playNote(i);
                }}
                className={cn(
                  "relative flex flex-col items-center justify-between rounded-xl sm:rounded-2xl py-2 sm:py-3 transition-all duration-75 select-none touch-manipulation cursor-pointer",
                  "border min-h-[64px] sm:min-h-[80px] shadow-sm",
                  isActive
                    ? "bg-gradient-to-b from-[#FDE047] via-[#D4AF37] to-[#B45309] border-amber-500 text-stone-900 scale-[0.96] shadow-inner ring-2 ring-amber-400"
                    : "bg-gradient-to-b from-[#FFFDF9] via-[#F5EFEB] to-[#E5DACD] border-stone-300 text-stone-800 hover:border-amber-500/60 active:scale-95"
                )}
                aria-label={`Tabuh nada ${label} (${PELOG_NAMES[i]})`}
              >
                {/* Paku Penahan Bilah Saron */}
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-stone-400/80 shadow-xs shrink-0" />

                <div className="flex flex-col items-center my-0.5 sm:my-1">
                  <span className="font-serif text-base sm:text-xl font-black leading-none drop-shadow-xs">
                    {label}
                  </span>
                  <span className="text-[9px] sm:text-[10px] font-bold text-stone-600 uppercase mt-0.5 leading-none">
                    {PELOG_NAMES[i]}
                  </span>
                </div>

                {/* Paku Penahan Bawah */}
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-stone-400/80 shadow-xs shrink-0" />
              </button>
            );
          })}
        </div>
      </div>

      {/* Kontrol */}
      <div className="mt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center justify-between sm:justify-start gap-2.5 w-full sm:w-auto">
          <div className="flex items-center gap-2">
            <Volume2 className="h-4 w-4 shrink-0 text-brand-ink" aria-hidden />
            <Slider
              value={[Math.round(vol * 100)]}
              min={0}
              max={100}
              step={1}
              aria-label="Volume saron"
              onValueChange={(v) => updateVolume((v[0] ?? 70) / 100)}
              className="w-24 sm:w-36"
            />
            <span className="w-8 text-right text-xs tabular-nums text-muted-foreground">
              {Math.round(vol * 100)}%
            </span>
          </div>

          <Button
            type="button"
            size="sm"
            variant={playingDemo ? "secondary" : "default"}
            onClick={playingDemo ? stopDemo : startDemo}
            aria-label={playingDemo ? "Hentikan demo melodi" : "Mainkan demo melodi"}
            className="h-8 px-3 text-xs min-h-[36px]"
          >
            {playingDemo ? (
              <Square className="h-3.5 w-3.5 mr-1" aria-hidden />
            ) : (
              <Play className="h-3.5 w-3.5 mr-1" aria-hidden />
            )}
            {playingDemo ? "Hentikan" : "Demo Melodi"}
          </Button>
        </div>
      </div>
    </section>
  );
}
