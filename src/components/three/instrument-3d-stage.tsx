"use client";

import * as React from "react";
import {
  Camera,
  CameraOff,
  Hand,
  Keyboard,
  Loader2,
  Mic,
  Music,
  Music2,
  Play,
  Sparkles,
  Square,
  Volume2,
  Waves,
  Wind,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "sonner";
import {
  INTERACTION_META,
  type TraditionalInstrument38,
} from "@/data/instruments-data";
import {
  getInstrumentMelody,
  getScaleTestSequence,
} from "@/data/instrument-melodies";
import { soundEngine } from "@/lib/sound-engine";
import {
  drawHandSkeleton,
  getHandLandmarker,
  type NormalizedLandmark,
} from "@/components/three/air-gamelan";

export interface Instrument3DStageProps {
  instrument: TraditionalInstrument38;
  volume?: number;
  onVolumeChange?: (v: number) => void;
  showHotspots?: boolean;
}

export function Instrument3DStage({
  instrument,
  volume = 0.78,
  onVolumeChange,
}: Instrument3DStageProps) {
  const isMobile = useIsMobile();
  const [activeNoteIdx, setActiveNoteIdx] = React.useState<number | null>(null);
  const [selectedPitchIdx, setSelectedPitchIdx] = React.useState(0);

  // State untuk Mode Tiup & Gesek
  const [isBowingUI, setIsBowingUI] = React.useState(false);
  const [isBlowingHold, setIsBlowingHold] = React.useState(false);
  const [micBlowEnabled, setMicBlowEnabled] = React.useState(false);
  const [micBlowLevel, setMicBlowLevel] = React.useState(0);

  // State Mode Kamera AI (MediaPipe Hands)
  const [cameraAiEnabled, setCameraAiEnabled] = React.useState(false);
  const [cameraAiLoading, setCameraAiLoading] = React.useState(false);
  const [cameraHandDetected, setCameraHandDetected] = React.useState(false);
  const [handCursor, setHandCursor] = React.useState<{ x: number; y: number } | null>(null);
  const [cameraTargetNoteIdx, setCameraTargetNoteIdx] = React.useState<number | null>(null);
  const [isStrikingState, setIsStrikingState] = React.useState(false);
  const [hitRippleNoteIdx, setHitRippleNoteIdx] = React.useState<number | null>(null);

  // Refs Kamera AI & Gesture Tracking
  const videoRef = React.useRef<HTMLVideoElement | null>(null);
  const overlayCanvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const stageContainerRef = React.useRef<HTMLDivElement | null>(null);
  const wasPinchingRef = React.useRef(false);
  const wasAirTappingRef = React.useRef(false);
  const prevIndexTipRef = React.useRef<{ x: number; y: number; time: number } | null>(null);
  const prevHandPosRef = React.useRef<{ x: number; y: number; time: number } | null>(null);
  const smoothCursorRef = React.useRef<{ x: number; y: number }>({ x: 0.5, y: 0.5 });
  const strikeResetTimerRef = React.useRef<NodeJS.Timeout | null>(null);
  const lastAiTriggerTimeRef = React.useRef(0);

  // Nonaktifkan Kamera AI otomatis pada layar kecil untuk hemat resource
  React.useEffect(() => {
    if (isMobile && cameraAiEnabled) {
      setCameraAiEnabled(false);
    }
  }, [isMobile, cameraAiEnabled]);

  // State Demo Autoplay
  const [demoMode, setDemoMode] = React.useState<"idle" | "scale" | "melody">("idle");
  const [demoLabel, setDemoLabel] = React.useState<string | null>(null);
  const demoTimerRef = React.useRef<number | null>(null);

  const stopDemo = React.useCallback(() => {
    if (demoTimerRef.current !== null) {
      window.clearTimeout(demoTimerRef.current);
      demoTimerRef.current = null;
    }
    setDemoMode("idle");
    setDemoLabel(null);
  }, []);

  const instrumentMelody = React.useMemo(() => getInstrumentMelody(instrument), [instrument]);

  // Sinkronisasi volume ke SoundEngine & preload audio
  React.useEffect(() => {
    soundEngine.setVolume(volume);
  }, [volume]);

  React.useEffect(() => {
    void soundEngine.preloadInstrumentSample(instrument.id);
    soundEngine.stopContinuousVoice();
    setIsBowingUI(false);
    setIsBlowingHold(false);
    setSelectedPitchIdx(0);
    stopDemo();
  }, [instrument.id, stopDemo]);

  // Cleanup saat unmount
  React.useEffect(() => {
    return () => {
      stopDemo();
      soundEngine.stopContinuousVoice();
      soundEngine.stopMicBlowDetector();
    };
  }, [stopDemo]);

  // Handler memicu nada tunggal — dijamin SATU pemicu per ketukan fisik
  const playNoteByIndex = React.useCallback(
    (idx: number, velocity = 0.95) => {
      const note = instrument.notes[idx] ?? instrument.notes[0];
      if (!note) return;

      setActiveNoteIdx(idx);
      setSelectedPitchIdx(idx);

      soundEngine.triggerNote({
        instrumentId: instrument.id,
        synthPreset: instrument.synthPreset,
        freq: note.freq,
        baseFreq: instrument.notes[0]?.freq ?? 261.63,
        velocity,
      });

      if (typeof navigator !== "undefined" && navigator.vibrate) {
        navigator.vibrate(16);
      }

      window.setTimeout(() => {
        setActiveNoteIdx((curr) => (curr === idx ? null : curr));
      }, 260);
    },
    [instrument]
  );

  // Handler Tes Tangga Nada
  const startScaleTest = React.useCallback(() => {
    stopDemo();
    const steps = getScaleTestSequence(instrument.notes.length);
    if (!steps.length) return;

    setDemoMode("scale");
    setDemoLabel("Tangga Nada Laras");
    let currentStep = 0;

    const runStep = () => {
      const step = steps[currentStep];
      if (!step) {
        setDemoMode("idle");
        setDemoLabel(null);
        return;
      }
      playNoteByIndex(step.noteIndex, 0.92);
      currentStep++;
      if (currentStep < steps.length) {
        demoTimerRef.current = window.setTimeout(runStep, step.durationMs);
      } else {
        demoTimerRef.current = window.setTimeout(() => {
          setDemoMode("idle");
          setDemoLabel(null);
        }, 600);
      }
    };

    runStep();
  }, [instrument.notes.length, playNoteByIndex, stopDemo]);

  // Handler Melodi Contoh Lagu Daerah
  const startMelodyDemo = React.useCallback(() => {
    stopDemo();
    const melody = getInstrumentMelody(instrument);
    if (!melody.notes.length) return;

    setDemoMode("melody");
    setDemoLabel(melody.songName);
    let currentStep = 0;

    const runStep = () => {
      const step = melody.notes[currentStep];
      if (!step) {
        setDemoMode("idle");
        setDemoLabel(null);
        return;
      }
      const safeIdx = Math.min(instrument.notes.length - 1, Math.max(0, step.noteIndex));
      playNoteByIndex(safeIdx, 0.95);
      currentStep++;
      if (currentStep < melody.notes.length) {
        demoTimerRef.current = window.setTimeout(runStep, step.durationMs);
      } else {
        demoTimerRef.current = window.setTimeout(() => {
          setDemoMode("idle");
          setDemoLabel(null);
        }, 750);
      }
    };

    runStep();
  }, [instrument, playNoteByIndex, stopDemo]);

  // Pintasan Keyboard 1-9 (Mencegah repeat keydown ganda)
  React.useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return;
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA")) return;

      const num = parseInt(e.key, 10);
      if (num >= 1 && num <= instrument.notes.length) {
        stopDemo();
        playNoteByIndex(num - 1, 0.95);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [instrument.notes.length, playNoteByIndex, stopDemo]);

  // Handler Mikrofon Tiup
  const toggleMicBlow = async () => {
    if (micBlowEnabled) {
      soundEngine.stopMicBlowDetector();
      soundEngine.stopContinuousVoice();
      setMicBlowEnabled(false);
      setMicBlowLevel(0);
      return;
    }

    const ok = await soundEngine.startMicBlowDetector((level, isBlowing) => {
      setMicBlowLevel(level);
      const currentNote = instrument.notes[selectedPitchIdx] ?? instrument.notes[0];
      if (isBlowing && currentNote) {
        soundEngine.startContinuousVoice("blow", currentNote.freq, Math.min(1, level * 1.35));
      } else {
        soundEngine.stopContinuousVoice();
      }
    });

    if (!ok) {
      toast.error("Mikrofon tidak dapat diakses", {
        description: "Pastikan izin mikrofon diizinkan di peramban.",
      });
      return;
    }

    setMicBlowEnabled(true);
    toast.success("Sensor Tiup Mikrofon Aktif", {
      description: "Tiup perlahan ke arah mikrofon untuk membunyikan instrumen.",
    });
  };

  // Handler Mode Kamera AI (MediaPipe Hands Air Tap dengan Cooldown 220ms)
  React.useEffect(() => {
    if (!cameraAiEnabled) {
      setCameraHandDetected(false);
      setHandCursor(null);
      return;
    }

    let cancelled = false;
    let stream: MediaStream | null = null;
    let rafId: number | null = null;

    async function initHandCamera() {
      setCameraAiLoading(true);
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 320, height: 240, facingMode: "user" },
          audio: false,
        });
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        const video = videoRef.current;
        if (video) {
          video.srcObject = stream;
          await video.play();
        }
        const landmarker = await getHandLandmarker();
        if (cancelled) return;
        setCameraAiLoading(false);

        const detectLoop = () => {
          if (cancelled || !videoRef.current) return;
          const v = videoRef.current;
          if (v.readyState >= 2) {
            const nowMs = performance.now();
            const res = landmarker.detectForVideo(v, nowMs);
            const hand = res.landmarks?.[0] as NormalizedLandmark[] | undefined;

            const canvas = overlayCanvasRef.current;
            const ctx = canvas?.getContext("2d");

            if (hand && hand[8]) {
              setCameraHandDetected(true);
              const normX = 1 - hand[8].x;
              const rawY = hand[8].y;

              const LERP_FACTOR = 0.4;
              smoothCursorRef.current.x += (normX - smoothCursorRef.current.x) * LERP_FACTOR;
              smoothCursorRef.current.y += (rawY - smoothCursorRef.current.y) * LERP_FACTOR;
              setHandCursor({ x: smoothCursorRef.current.x, y: smoothCursorRef.current.y });

              const calibratedX = Math.max(0, Math.min(1, (smoothCursorRef.current.x - 0.1) / 0.8));
              const noteIdx = Math.min(
                instrument.notes.length - 1,
                Math.max(0, Math.floor(calibratedX * instrument.notes.length))
              );
              setCameraTargetNoteIdx(noteIdx);

              // 1. Deteksi Pinch (Telunjuk + Jempol)
              let isPinching = false;
              if (hand[4]) {
                const rawPinchDist = Math.hypot(hand[8].x - hand[4].x, hand[8].y - hand[4].y);
                isPinching = rawPinchDist < 0.07;
              }

              // 2. Deteksi Air Tap (Sentakan Cepat Telunjuk ke Bawah)
              let isAirTap = false;
              const prev = prevIndexTipRef.current;
              if (prev) {
                const dt = Math.max(10, nowMs - prev.time);
                const velY = (rawY - prev.y) / (dt / 1000);
                if (velY > 1.25) {
                  isAirTap = true;
                }
              }
              prevIndexTipRef.current = { x: normX, y: rawY, time: nowMs };

              // 3. Trigger Nada dengan Cooldown Eksklusif 220ms
              const isPinchTrigger = isPinching && !wasPinchingRef.current;
              const isAirTapTrigger = isAirTap && !wasAirTappingRef.current;
              const canTrigger = nowMs - lastAiTriggerTimeRef.current > 220;

              if ((isPinchTrigger || isAirTapTrigger) && canTrigger) {
                lastAiTriggerTimeRef.current = nowMs;
                playNoteByIndex(noteIdx, 0.96);
                setHitRippleNoteIdx(noteIdx);
                setIsStrikingState(true);

                if (strikeResetTimerRef.current) clearTimeout(strikeResetTimerRef.current);
                strikeResetTimerRef.current = setTimeout(() => {
                  setIsStrikingState(false);
                  setHitRippleNoteIdx(null);
                }, 300);
              }

              wasPinchingRef.current = isPinching;
              wasAirTappingRef.current = isAirTap;
              prevHandPosRef.current = { x: normX, y: rawY, time: nowMs };

              if (ctx && canvas) {
                drawHandSkeleton(
                  ctx,
                  hand,
                  canvas.width,
                  canvas.height,
                  true,
                  isStrikingState || isPinchTrigger || isAirTapTrigger,
                  isPinching
                );
              }
            } else {
              setCameraHandDetected(false);
              setHandCursor(null);
              setCameraTargetNoteIdx(null);
              setIsStrikingState(false);
              prevHandPosRef.current = null;
              prevIndexTipRef.current = null;
              wasPinchingRef.current = false;
              wasAirTappingRef.current = false;
              if (ctx && canvas) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
              }
            }
          }
          rafId = requestAnimationFrame(detectLoop);
        };

        rafId = requestAnimationFrame(detectLoop);
      } catch {
        setCameraAiLoading(false);
        setCameraAiEnabled(false);
        toast.error("Kamera tidak dapat diakses", {
          description: "Pastikan izin webcam diberikan untuk fitur Gestur Tangan AI.",
        });
      }
    }

    void initHandCamera();

    return () => {
      cancelled = true;
      if (rafId !== null) cancelAnimationFrame(rafId);
      if (stream) stream.getTracks().forEach((t) => t.stop());
    };
  }, [cameraAiEnabled, instrument, playNoteByIndex]);

  const meta = INTERACTION_META[instrument.interactionType];
  const isDrumMembrane =
    instrument.organology === "MEMBRANOFON" ||
    instrument.synthPreset === "strike_drum" ||
    instrument.interactionType === "strike";

  return (
    <div className="space-y-3.5 sm:space-y-4">
      {/* ========================================================================= */}
      {/* 1. HEADER KONTROL ATAS: STATUS ALAT MUSIK, PROVINSI, SUKU, & FITUR PLAY  */}
      {/* ========================================================================= */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 rounded-2xl border border-[#DFD3C2] bg-[#FAF6EE] px-3.5 py-2.5 shadow-2xs">
        <div className="flex flex-wrap items-center gap-2">
          <Badge className="bg-[#52331C] text-white hover:bg-[#482B18] text-xs font-bold px-3 py-1 rounded-full">
            {meta.badge}
          </Badge>
          <Badge
            variant="outline"
            className="border-[#6E472D]/30 bg-white text-[#6E472D] text-xs font-semibold px-2.5 py-0.5 rounded-full"
          >
            {instrument.organology}
          </Badge>
          <span className="text-xs font-semibold text-stone-800">
            {instrument.province} • Suku {instrument.ethnicGroup}
          </span>
        </div>

        {/* Tombol Demo & Pengujian Nada */}
        <div className="flex flex-wrap items-center gap-2">
          {demoMode !== "idle" ? (
            <Button
              type="button"
              size="sm"
              variant="default"
              onClick={stopDemo}
              className="h-8 rounded-full text-xs font-bold bg-[#8F331D] hover:bg-[#782814] text-white shadow-xs animate-pulse cursor-pointer"
              title="Hentikan pemutaran demo"
            >
              <Square className="mr-1.5 h-3 w-3 fill-current" />
              <span>Hentikan Demo</span>
            </Button>
          ) : (
            <>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={startScaleTest}
                className="h-8 rounded-full text-xs font-semibold border-[#6E472D]/40 text-[#2D1E12] bg-white hover:bg-[#FAF3E6] shadow-2xs cursor-pointer"
                title="Uji tangga nada lengkap"
              >
                <Music className="mr-1.5 h-3.5 w-3.5 text-[#6E472D]" />
                <span>Tes Nada</span>
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={startMelodyDemo}
                className="h-8 rounded-full text-xs font-semibold border-[#6E472D]/40 text-[#2D1E12] bg-white hover:bg-[#FAF3E6] shadow-2xs cursor-pointer max-w-[220px] sm:max-w-none"
                title={`Dengarkan contoh lagu ${instrumentMelody.songName}`}
              >
                <Play className="mr-1.5 h-3.5 w-3.5 text-[#6E472D] fill-[#6E472D]/20 shrink-0" />
                <span className="truncate">Contoh Lagu: {instrumentMelody.songName}</span>
              </Button>
            </>
          )}

          {/* Sensor Tiup Mikrofon untuk Aerofon */}
          {instrument.interactionType === "blow" && (
            <Button
              type="button"
              size="sm"
              variant={micBlowEnabled ? "default" : "outline"}
              onClick={toggleMicBlow}
              className={cn(
                "h-8 rounded-full text-xs font-semibold",
                micBlowEnabled
                  ? "bg-emerald-700 text-white hover:bg-emerald-800"
                  : "border-[#6E472D]/40 text-[#6E472D] bg-white hover:bg-[#6E472D]/5"
              )}
            >
              <Mic className={cn("mr-1.5 h-3.5 w-3.5", micBlowEnabled && "animate-pulse")} />
              {micBlowEnabled ? `Sensor Tiup Aktif (${Math.round(micBlowLevel * 100)}%)` : "Sensor Tiup Mic"}
            </Button>
          )}

          {/* Mode Kamera AI Desktop */}
          {!isMobile && (
            <Button
              type="button"
              size="sm"
              variant={cameraAiEnabled ? "default" : "outline"}
              onClick={() => setCameraAiEnabled((prev) => !prev)}
              className={cn(
                "h-8 rounded-full text-xs font-semibold",
                cameraAiEnabled
                  ? "btn-waranusa text-white"
                  : "border-[#6E472D]/40 text-[#2D1E12] bg-white hover:bg-[#FAF3E6]"
              )}
            >
              {cameraAiLoading ? (
                <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
              ) : cameraAiEnabled ? (
                <CameraOff className="mr-1.5 h-3.5 w-3.5" />
              ) : (
                <Camera className="mr-1.5 h-3.5 w-3.5 text-[#6E472D]" />
              )}
              {cameraAiEnabled ? "Matikan Kamera AI" : "Mode Kamera AI"}
            </Button>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. PANGGUNG 2D INTERAKTIF (ZERO-LAG ACOUSTIC VISUAL RESONATOR PAD)          */}
      {/* ========================================================================= */}
      <div
        ref={stageContainerRef}
        className="relative h-[290px] xs:h-[320px] sm:h-[360px] md:h-[400px] w-full overflow-hidden rounded-2xl border border-[#C8B69F] bg-gradient-to-b from-[#2F1D11] via-[#3B2516] to-[#25170E] select-none touch-none shadow-md flex flex-col items-center justify-center p-3 sm:p-6"
      >
        {/* Ornamen Motif Nusantara Halus di Latar Belakang */}
        <div className="pointer-events-none absolute inset-0 opacity-10 bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:20px_20px]" />

        {/* Overlay Kamera AI Preview (Jika Aktif) */}
        {cameraAiEnabled && (
          <div className="absolute right-3 top-3 z-30 rounded-xl overflow-hidden border-2 border-amber-400/80 bg-black/80 shadow-lg w-28 h-20 sm:w-36 sm:h-26">
            <video
              ref={videoRef}
              playsInline
              muted
              className="h-full w-full object-cover scale-x-[-1]"
            />
            <canvas
              ref={overlayCanvasRef}
              width={320}
              height={240}
              className="absolute inset-0 h-full w-full object-cover pointer-events-none"
            />
            <div className="absolute bottom-1 left-1.5 right-1.5 flex items-center justify-between text-[8px] font-bold text-amber-200">
              <span>{cameraHandDetected ? "Tangan Terdeteksi" : "Mencari Tangan..."}</span>
              <span className={cn("h-1.5 w-1.5 rounded-full", cameraHandDetected ? "bg-emerald-400 animate-pulse" : "bg-amber-400")} />
            </div>
          </div>
        )}

        {/* Kursor Gestur Tangan AI (Lingkaran Emas Penabuh) */}
        {cameraAiEnabled && handCursor && (
          <div
            className="pointer-events-none absolute z-40 -translate-x-1/2 -translate-y-1/2 transition-transform duration-75"
            style={{
              left: `${handCursor.x * 100}%`,
              top: `${handCursor.y * 100}%`,
            }}
          >
            <div
              className={cn(
                "rounded-full border-2 transition-all duration-100 flex items-center justify-center",
                isStrikingState
                  ? "h-14 w-14 border-amber-300 bg-amber-400/40 ring-4 ring-amber-300 scale-110 shadow-[0_0_20px_rgba(251,191,36,0.9)]"
                  : "h-9 w-9 border-amber-400 bg-amber-400/20 ring-2 ring-amber-400/50"
              )}
            >
              <span className="h-2 w-2 rounded-full bg-white shadow-xs" />
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAMPILAN 1: MEMBRANOFON / DRUM (Burdah, Tifa, Kendang, Rebana) */}
        {/* ------------------------------------------------------------- */}
        {isDrumMembrane ? (
          <div className="relative flex flex-col items-center justify-center">
            {/* Bingkai Kayu Ukir Melingkar & Membran Kulit Asli */}
            <div className="relative h-56 w-56 xs:h-64 xs:w-64 sm:h-76 sm:w-76 rounded-full border-[10px] sm:border-[12px] border-[#5D371E] bg-[#D6C2A5] shadow-2xl p-2.5 sm:p-3 flex items-center justify-center">
              {/* Paku Keling Tembaga Melingkar di Bibir Bingkai */}
              <div className="pointer-events-none absolute inset-0 rounded-full border-2 border-amber-600/40" />

              {/* Pad Sentuh Konsentris Multi-Zona */}
              <div className="relative h-full w-full rounded-full overflow-hidden bg-gradient-to-br from-[#EFE3CF] via-[#E4D1B5] to-[#CBB494] shadow-inner flex items-center justify-center">
                {/* Efek Riak Gelombang Tabuhan Saat Aktif */}
                {activeNoteIdx !== null && (
                  <span className="pointer-events-none absolute inset-0 rounded-full bg-amber-400/20 animate-ping" />
                )}

                {/* Zona Luar (Rim / Dang / Tek / Klet) */}
                <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 gap-1 p-2">
                  {instrument.notes.slice(1, 5).map((note, qIdx) => {
                    const actualIdx = qIdx + 1;
                    const isStruck = activeNoteIdx === actualIdx;
                    return (
                      <button
                        key={note.code}
                        type="button"
                        aria-label={`Tabuh nada ${note.label}`}
                        onPointerDown={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          stopDemo();
                          playNoteByIndex(actualIdx, 0.95);
                        }}
                        className={cn(
                          "relative rounded-full transition-all duration-100 flex flex-col items-center justify-center p-2 cursor-pointer touch-manipulation group",
                          isStruck
                            ? "bg-amber-400/40 scale-95 shadow-inner"
                            : "hover:bg-amber-700/10 active:scale-95"
                        )}
                      >
                        <span className="font-serif text-[11px] sm:text-xs font-bold text-stone-800 leading-tight text-center">
                          {note.label}
                        </span>
                        <span className="font-mono text-[9px] font-semibold text-stone-600">
                          {Math.round(note.freq)} Hz
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Zona Pusat (Pusat Membran / Bas / Dung) */}
                <button
                  type="button"
                  aria-label={`Tabuh pusat membran ${instrument.notes[0]?.label ?? "Dung"}`}
                  onPointerDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    stopDemo();
                    playNoteByIndex(0, 0.98);
                  }}
                  className={cn(
                    "relative z-10 h-24 w-24 xs:h-28 xs:w-28 sm:h-32 sm:w-32 rounded-full border-4 transition-all duration-100 flex flex-col items-center justify-center cursor-pointer shadow-md touch-manipulation",
                    activeNoteIdx === 0
                      ? "border-amber-400 bg-gradient-to-b from-[#FDE047] via-[#D4AF37] to-[#B45309] text-stone-950 scale-95 shadow-[0_0_24px_rgba(251,191,36,0.9)] ring-4 ring-amber-300"
                      : "border-[#8C5835]/50 bg-gradient-to-b from-[#DFCFB7] via-[#D0BD9F] to-[#BBA583] text-[#3D2514] hover:scale-102 hover:border-[#6E472D] active:scale-95"
                  )}
                >
                  <span className="font-mono text-[10px] font-black uppercase text-[#6E472D]">
                    {instrument.notes[0]?.code ?? "1"}
                  </span>
                  <span className="font-serif text-xs sm:text-sm font-extrabold text-[#2D1E12] leading-tight text-center">
                    {instrument.notes[0]?.label ?? "Dung / Bas"}
                  </span>
                  <span className="font-mono text-[9px] font-semibold text-stone-700">
                    {Math.round(instrument.notes[0]?.freq ?? 110)} Hz
                  </span>
                </button>
              </div>
            </div>
            <p className="mt-2 text-[11px] font-medium text-amber-200/90 text-center">
              Ketuk pusat membran untuk Bas (Dung), atau ketuk tepi untuk nada Dengung/Sisi (Dang/Tek/Klet).
            </p>
          </div>
        ) : (
          /* ------------------------------------------------------------- */
          /* TAMPILAN 2: IDIOFON / KORDOFON / AEROFON / SHAKE               */
          /* ------------------------------------------------------------- */
          <div className="relative w-full max-w-2xl px-2 flex flex-col items-center justify-center">
            {/* Rancakan Kayu Resonator 2D */}
            <div className="w-full rounded-2xl border-4 border-[#6C4023] bg-gradient-to-b from-[#58341D] via-[#4A2B18] to-[#391F11] p-3 sm:p-4 shadow-xl">
              <div
                className="grid gap-2 sm:gap-2.5 items-end justify-center min-h-[140px] sm:min-h-[170px]"
                style={{
                  gridTemplateColumns: `repeat(${Math.max(1, instrument.notes.length)}, minmax(0, 1fr))`,
                }}
              >
                {instrument.notes.map((note, idx) => {
                  const isStruck = activeNoteIdx === idx;
                  const isTarget = cameraTargetNoteIdx === idx;
                  return (
                    <button
                      key={note.code}
                      type="button"
                      aria-label={`Tabuh bilah nada ${note.label}`}
                      onPointerDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        stopDemo();
                        playNoteByIndex(idx, 0.95);
                      }}
                      className={cn(
                        "relative flex flex-col items-center justify-between rounded-xl border-2 py-3 px-1 transition-all duration-100 cursor-pointer select-none touch-manipulation shadow-md",
                        isStruck
                          ? "bg-gradient-to-b from-[#FFF5D6] via-[#FDE047] to-[#D49B27] border-white scale-95 shadow-[0_0_20px_rgba(251,191,36,0.9)] ring-4 ring-amber-300"
                          : isTarget
                          ? "bg-gradient-to-b from-[#FAF0D7] to-[#E3C57F] border-amber-400 scale-102"
                          : "bg-gradient-to-b from-[#EFE5D0] via-[#DFCCA5] to-[#BFA572] border-[#8C6D3B] hover:border-amber-300 active:scale-95"
                      )}
                      style={{
                        height: `${Math.max(110, 160 - idx * 6)}px`,
                      }}
                    >
                      {/* Paku Kuningan Penahan Atas */}
                      <span className="h-2 w-2 rounded-full bg-stone-700/60 shadow-xs" />

                      <div className="flex flex-col items-center my-auto">
                        <span className="font-mono text-[11px] font-black text-[#5C381E]">
                          {note.code}
                        </span>
                        <span className="font-serif text-xs sm:text-sm font-extrabold text-[#2D1E12] leading-tight">
                          {note.label}
                        </span>
                      </div>

                      {/* Paku Kuningan Bawah */}
                      <span className="h-2 w-2 rounded-full bg-stone-700/60 shadow-xs" />
                    </button>
                  );
                })}
              </div>
            </div>
            <p className="mt-2.5 text-[11px] font-medium text-amber-200/90 text-center">
              Ketuk bilah nada di atas atau gunakan papan kontrol frekuensi di bawah.
            </p>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 3. KARTU TANGGA NADA & LARAS FREKUENSI HZ (SINGLE CLICK / TAP GUARANTEE)   */}
      {/* ========================================================================= */}
      <div className="rounded-2xl border border-[#DFD3C2] bg-white/95 p-3 sm:p-4 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-1.5 font-bold text-sm text-[#2D1E12]">
            <Music2 className="h-4 w-4 text-[#6E472D]" />
            <span>
              Tangga Nada &amp; Laras ({instrument.notes.length} Tingkat — Ketuk atau Tekan Keyboard 1–{instrument.notes.length})
            </span>
          </div>

          {onVolumeChange && (
            <div className="flex items-center gap-2 min-w-[140px]">
              <Volume2 className="h-3.5 w-3.5 text-[#6E472D]" />
              <Slider
                value={[volume]}
                min={0}
                max={1}
                step={0.05}
                onValueChange={(v) => onVolumeChange(v[0] ?? 0.78)}
                aria-label="Volume instrumen"
                className="w-24"
              />
              <span className="font-mono text-[11px] font-bold text-[#2D1E12]">
                {Math.round(volume * 100)}%
              </span>
            </div>
          )}
        </div>

        {/* Kisi Tombol Nada (Strict Single onPointerDown Event) */}
        <div className="overflow-x-auto no-scrollbar pb-1 -mx-1 px-1 sm:mx-0 sm:px-0 sm:overflow-visible">
          <div
            className="grid gap-2 min-w-[300px] sm:min-w-0"
            style={{
              gridTemplateColumns: `repeat(${Math.max(1, instrument.notes.length)}, minmax(0, 1fr))`,
            }}
          >
            {instrument.notes.map((note, idx) => {
              const isPlaying = activeNoteIdx === idx;
              const isSelected = selectedPitchIdx === idx;
              const isCameraTarget = cameraAiEnabled && cameraTargetNoteIdx === idx;
              const isHitRippling = hitRippleNoteIdx === idx;

              return (
                <button
                  key={note.code}
                  type="button"
                  aria-label={`Nada ${note.label} (${note.code}), frekuensi ${Math.round(note.freq)} Hertz`}
                  onPointerDown={(e) => {
                    // Mencegah duplicate pointer+click bubbling
                    e.preventDefault();
                    e.stopPropagation();
                    stopDemo();
                    playNoteByIndex(idx, 0.95);
                  }}
                  className={cn(
                    "group relative flex flex-col items-center justify-between rounded-2xl border py-2.5 sm:py-3.5 px-1.5 sm:px-2 transition-all duration-100 cursor-pointer select-none touch-manipulation min-h-[72px] sm:min-h-[82px] shadow-2xs",
                    isHitRippling
                      ? "scale-105 border-amber-500 bg-gradient-to-b from-[#FFF5D6] via-[#FDE047] to-[#F59E0B] text-stone-950 shadow-[0_0_24px_rgba(251,191,36,0.85)] ring-4 ring-amber-300 font-extrabold z-10"
                      : isPlaying
                      ? "scale-98 border-[#B4791E] bg-gradient-to-b from-[#FFEAA0] to-[#D49B27] text-[#2D1E12] shadow-md ring-2 ring-amber-400 font-bold"
                      : isCameraTarget
                      ? "border-amber-500 bg-amber-50/95 text-[#2D1E12] ring-3 ring-amber-400 shadow-md scale-102 font-bold"
                      : isSelected
                      ? "border-[#6E472D] bg-[#F7EFE4] text-[#2D1E12] shadow-xs ring-1 ring-[#6E472D]/30"
                      : "border-[#D8C7B2] bg-gradient-to-b from-[#FFFDF9] via-[#FAF6F0] to-[#F3EDE2] text-stone-800 hover:border-[#8C5835] hover:bg-white active:scale-95 hover:shadow-xs"
                  )}
                >
                  {/* Efek Ripple Saat Ditekan */}
                  {isHitRippling && (
                    <span className="pointer-events-none absolute inset-0 -m-1 rounded-2xl border-2 border-amber-300 bg-amber-400/20 animate-ping" />
                  )}

                  <span className="font-mono text-[10px] xs:text-xs font-black uppercase tracking-wider text-[#7A4B29]">
                    {note.code}
                  </span>
                  <span className="my-0.5 font-serif text-sm xs:text-base sm:text-lg font-extrabold text-[#2D1E12] line-clamp-1 leading-tight text-center">
                    {note.label}
                  </span>
                  <span className="font-mono text-[9px] xs:text-[10px] font-semibold text-stone-600 bg-black/5 rounded px-1.5 py-0.5">
                    {Math.round(note.freq)} Hz
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// Void unused icons to prevent warnings
void Keyboard;
void Sparkles;
void Waves;
void Wind;
