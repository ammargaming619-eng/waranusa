"use client";

/**
 * WaraNusa — Air Gamelan Hand Tracking Gesture Controller
 *
 * Menggunakan @mediapipe/tasks-vision untuk melacak koordinat tangan via webcam:
 * - Landmark index 8 (INDEX_FINGER_TIP) sebagai penunjuk virtual.
 * - Deteksi ketukan udara (downward strike) dan hover dwell (0.5s).
 * - Floating preview webcam dengan render kerangka tangan (hand skeleton).
 * - Indikator kursor emas menyala di atas panggung 3D Saron.
 */

import * as React from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import {
  CameraOff,
  ChevronDown,
  ChevronUp,
  Loader2,
  Volume2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SARON_KEY_XS } from "@/components/three/procedural-models";

// Label nada pelog standar 1-7
export const AIR_PELOG_LABELS = ["1", "2", "3", "4", "5", "6", "7"] as const;

// Tipe data MediaPipe Tasks Vision
export interface NormalizedLandmark {
  x: number;
  y: number;
  z: number;
  visibility?: number;
}

export interface HandLandmarkerResult {
  landmarks: NormalizedLandmark[][];
  worldLandmarks?: unknown[][];
  handedness?: unknown[][];
}

export interface HandLandmarkerInstance {
  detectForVideo: (videoFrame: HTMLVideoElement, timestamp: number) => HandLandmarkerResult;
  close?: () => void;
}

// 21 Titik Sendi Tangan MediaPipe (Bones Connections)
export const HAND_CONNECTIONS: ReadonlyArray<[number, number]> = [
  [0, 1], [1, 2], [2, 3], [3, 4],       // Ibu Jari (Thumb)
  [0, 5], [5, 6], [6, 7], [7, 8],       // Telunjuk (Index)
  [5, 9], [9, 10], [10, 11], [11, 12],   // Jari Tengah (Middle)
  [9, 13], [13, 14], [14, 15], [15, 16], // Jari Manis (Ring)
  [13, 17], [17, 18], [18, 19], [19, 20],// Kelingking (Pinky)
  [0, 17],                              // Telapak Bawah (Palm Base)
];

// Singleton cache untuk memuat model MediaPipe sekali saja
let landmarkerInstancePromise: Promise<HandLandmarkerInstance> | null = null;

export async function getHandLandmarker(): Promise<HandLandmarkerInstance> {
  if (landmarkerInstancePromise) return landmarkerInstancePromise;

  landmarkerInstancePromise = (async () => {
    const { FilesetResolver, HandLandmarker } = await import("@mediapipe/tasks-vision");
    const vision = await FilesetResolver.forVisionTasks(
      "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm"
    );

    try {
      const landmarker = await HandLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath:
            "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task",
          delegate: "GPU",
        },
        runningMode: "VIDEO",
        numHands: 1,
      });
      return landmarker as unknown as HandLandmarkerInstance;
    } catch (gpuError) {
      console.warn("GPU delegate gagal untuk HandLandmarker, beralih ke mode CPU:", gpuError);
      const landmarker = await HandLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath:
            "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task",
          delegate: "CPU",
        },
        runningMode: "VIDEO",
        numHands: 1,
      });
      return landmarker as unknown as HandLandmarkerInstance;
    }
  })();

  return landmarkerInstancePromise;
}

// -------------------------------------------------------------
// Helper visualisasi kerangka tangan di Canvas 2D
// -------------------------------------------------------------
export function drawHandSkeleton(
  ctx: CanvasRenderingContext2D,
  landmarks: NormalizedLandmark[],
  width: number,
  height: number,
  isHovering: boolean,
  isStriking: boolean
) {
  ctx.clearRect(0, 0, width, height);

  // 1. Gambar garis penghubung sendi (Bones)
  ctx.lineWidth = 2.5;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.strokeStyle = isStriking
    ? "#F2B544"
    : isHovering
    ? "rgba(242, 181, 68, 0.9)"
    : "rgba(20, 184, 166, 0.75)";

  for (const [start, end] of HAND_CONNECTIONS) {
    const p1 = landmarks[start];
    const p2 = landmarks[end];
    if (!p1 || !p2) continue;
    ctx.beginPath();
    ctx.moveTo(p1.x * width, p1.y * height);
    ctx.lineTo(p2.x * width, p2.y * height);
    ctx.stroke();
  }

  // 2. Gambar titik sendi
  for (let i = 0; i < landmarks.length; i++) {
    if (i === 8) continue; // Telunjuk digambar khusus
    const p = landmarks[i];
    ctx.beginPath();
    ctx.arc(p.x * width, p.y * height, 3, 0, Math.PI * 2);
    ctx.fillStyle = "#14B8A6";
    ctx.fill();
  }

  // 3. Ujung Jari Telunjuk (Landmark 8: INDEX_FINGER_TIP)
  const tip = landmarks[8];
  if (tip) {
    const tx = tip.x * width;
    const ty = tip.y * height;

    // Lingkaran luar berdenyut
    ctx.beginPath();
    ctx.arc(tx, ty, isStriking ? 12 : isHovering ? 9 : 7, 0, Math.PI * 2);
    ctx.strokeStyle = "#F2B544";
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Titik pusat
    ctx.beginPath();
    ctx.arc(tx, ty, 4, 0, Math.PI * 2);
    ctx.fillStyle = isStriking ? "#FFFFFF" : "#F2B544";
    ctx.fill();
  }
}

// -------------------------------------------------------------
// Komponen Pelacak 3D di dalam Canvas Tiga Dimensi
// -------------------------------------------------------------
interface AirGesture3DTrackerProps {
  cursorNDC: { x: number; y: number } | null;
  active: boolean;
  onHoverNote: (note: number | null) => void;
}

const SARON_BAR_Y = 0.535;

export function AirGesture3DTracker({ cursorNDC, active, onHoverNote }: AirGesture3DTrackerProps) {
  const { camera, scene, raycaster } = useThree();
  const lastHoverRef = React.useRef<number | null>(null);

  useFrame(() => {
    if (!active || !cursorNDC) {
      if (lastHoverRef.current !== null) {
        lastHoverRef.current = null;
        onHoverNote(null);
      }
      return;
    }

    // Raycast langsung ke mesh 3D
    raycaster.setFromCamera(cursorNDC, camera);
    const intersects = raycaster.intersectObjects(scene.children, true);
    let hitNote: number | null = null;

    for (const hit of intersects) {
      let obj: THREE.Object3D | null = hit.object;
      while (obj) {
        if (obj.userData && typeof obj.userData.noteIndex === "number") {
          hitNote = obj.userData.noteIndex;
          break;
        }
        obj = obj.parent;
      }
      if (hitNote !== null) break;
    }

    // Toleransi kedekatan jika kursor melayang sedikit di atas bilah atau di sela-sela
    if (hitNote === null) {
      const tempVec = new THREE.Vector3();
      let bestDist = Infinity;
      let closestNote: number | null = null;

      for (let i = 0; i < SARON_KEY_XS.length; i++) {
        tempVec.set(SARON_KEY_XS[i], SARON_BAR_Y - 0.45, 0);
        tempVec.project(camera);
        const dx = cursorNDC.x - tempVec.x;
        const dy = cursorNDC.y - tempVec.y;

        // Cek apakah kursor berada di rentang bilah saron
        if (Math.abs(dy) < 0.42 && Math.abs(dx) < 0.17) {
          const dist = Math.hypot(dx, dy);
          if (dist < bestDist) {
            bestDist = dist;
            closestNote = i;
          }
        }
      }
      hitNote = closestNote;
    }

    if (hitNote !== lastHoverRef.current) {
      lastHoverRef.current = hitNote;
      onHoverNote(hitNote);
    }
  });

  return null;
}

// -------------------------------------------------------------
// Kursor Penunjuk Emas Virtual di atas Kanvas 3D
// -------------------------------------------------------------
export interface StrikeEvent {
  note: number;
  triggerType: "tap" | "hover";
  timestamp: number;
}

interface AirGestureCursorOverlayProps {
  cursor: { x: number; y: number } | null;
  hoveredNote: number | null;
  hoverProgress: number; // 0..1
  strikeEvent: StrikeEvent | null;
  handDetected: boolean;
  labels?: readonly string[];
}

export function AirGestureCursorOverlay({
  cursor,
  hoveredNote,
  hoverProgress,
  strikeEvent,
  handDetected,
  labels = AIR_PELOG_LABELS,
}: AirGestureCursorOverlayProps) {
  if (!cursor || !handDetected) return null;

  const leftPercent = `${(cursor.x * 100).toFixed(2)}%`;
  const topPercent = `${(cursor.y * 100).toFixed(2)}%`;
  const isHovering = hoveredNote !== null;

  // SVG circular dwell progress (radius 22px)
  const radius = 22;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - Math.max(0, Math.min(1, hoverProgress)));

  return (
    <div
      className="pointer-events-none absolute inset-0 z-20 overflow-hidden"
      aria-hidden="true"
    >
      <div
        className="absolute -translate-x-1/2 -translate-y-1/2 transition-transform duration-75"
        style={{ left: leftPercent, top: topPercent }}
      >
        {/* Efek gelombang kejut (Strike Ripple) saat menabuh */}
        {strikeEvent && Date.now() - strikeEvent.timestamp < 450 && (
          <div className="absolute -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 h-20 w-20 rounded-full border-2 border-brand-gold bg-brand-gold/20 animate-ping" />
        )}

        {/* Aura pendaran emas di sekitar kursor */}
        <div
          className={`absolute -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 rounded-full bg-brand-gold/25 blur-md transition-all duration-200 ${
            isHovering ? "h-16 w-16 bg-brand-gold/40" : "h-12 w-12"
          }`}
        />

        {/* Lingkaran cincin utama */}
        <div
          className={`relative flex items-center justify-center rounded-full border-2 transition-all duration-150 ${
            isHovering
              ? "h-11 w-11 border-brand-gold bg-brand-gold/20 shadow-[0_0_20px_#F2B544]"
              : "h-9 w-9 border-brand-gold/80 bg-brand-gold/10 shadow-[0_0_12px_rgba(242,181,68,0.5)]"
          }`}
        >
          {/* Titik pusat kursor */}
          <div
            className={`rounded-full transition-transform duration-150 ${
              isHovering ? "h-3 w-3 bg-white shadow-sm scale-110" : "h-2 w-2 bg-brand-gold"
            }`}
          />

          {/* SVG Progress Circle saat Hover Dwell (0.5s) */}
          {isHovering && hoverProgress > 0 && (
            <svg
              className="absolute -left-1.5 -top-1.5 -rotate-90"
              width={48}
              height={48}
              viewBox="0 0 48 48"
            >
              <circle
                cx={24}
                cy={24}
                r={radius}
                fill="none"
                stroke="rgba(242, 181, 68, 0.25)"
                strokeWidth={3}
              />
              <circle
                cx={24}
                cy={24}
                r={radius}
                fill="none"
                stroke="#F2B544"
                strokeWidth={3}
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-75"
              />
            </svg>
          )}
        </div>

        {/* Label nada yang sedang di-hover */}
        {isHovering && (
          <div className="absolute left-1/2 -top-8 -translate-x-1/2 whitespace-nowrap rounded-full border border-brand-gold/60 bg-brand-ink/90 px-2 py-0.5 text-[11px] font-bold text-brand-gold shadow-md backdrop-blur">
            <span className="flex items-center gap-1">
              <Volume2 className="h-3 w-3" />
              Nada {labels[hoveredNote] ?? hoveredNote + 1}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// Kotak Pratinjau Webcam Mengambang (Floating Preview)
// -------------------------------------------------------------
interface AirGamelanFloatingPreviewProps {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  handDetected: boolean;
  isLoadingModel: boolean;
  hoveredNote: number | null;
  lastStrike: StrikeEvent | null;
  onClose: () => void;
  labels?: readonly string[];
}

export function AirGamelanFloatingPreview({
  videoRef,
  canvasRef,
  handDetected,
  isLoadingModel,
  hoveredNote,
  lastStrike,
  onClose,
  labels = AIR_PELOG_LABELS,
}: AirGamelanFloatingPreviewProps) {
  const [isMinimized, setIsMinimized] = React.useState(false);

  return (
    <div className="absolute bottom-3 right-3 z-30 flex flex-col items-end">
      <div className="overflow-hidden rounded-2xl border border-brand-gold/40 bg-brand-ink/95 shadow-2xl backdrop-blur-md transition-all duration-200">
        {/* Header Preview Bar */}
        <div className="flex items-center justify-between gap-2 border-b border-white/10 px-3 py-1.5 text-xs">
          <div className="flex items-center gap-2">
            <span
              className={`h-2.5 w-2.5 rounded-full ${
                isLoadingModel
                  ? "bg-amber-400 animate-pulse"
                  : handDetected
                  ? "bg-emerald-400 shadow-[0_0_8px_#34D399]"
                  : "bg-amber-500"
              }`}
            />
            <span className="text-[11px] font-medium text-white">
              {isLoadingModel
                ? "Memuat AI Vision..."
                : handDetected
                ? "Tangan Terdeteksi"
                : "Arahkan Tangan ke Kamera"}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => setIsMinimized((prev) => !prev)}
              aria-label={isMinimized ? "Perbesar kamera" : "Perkecil kamera"}
              className="h-5 w-5 text-zinc-300 hover:text-white"
            >
              {isMinimized ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={onClose}
              aria-label="Tutup kamera Air Gamelan"
              className="h-5 w-5 text-zinc-300 hover:text-rose-400"
            >
              <CameraOff className="h-3 w-3" />
            </Button>
          </div>
        </div>

        {/* Layar Kamera + Canvas Kerangka Tangan */}
        {!isMinimized && (
          <div className="relative h-28 w-44 sm:h-32 sm:w-52 bg-black/60 overflow-hidden">
            {/* Video stream mirrored horizontally */}
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="h-full w-full object-cover transform -scale-x-100 opacity-70"
            />

            {/* Canvas untuk menggambar kerangka tangan */}
            <canvas
              ref={canvasRef}
              width={240}
              height={180}
              className="absolute inset-0 h-full w-full pointer-events-none transform -scale-x-100"
            />

            {/* Spinner saat model sedang diunduh */}
            {isLoadingModel && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-brand-ink/80 text-white">
                <Loader2 className="h-5 w-5 animate-spin text-brand-gold" />
                <span className="text-[10px] text-zinc-300">Menyiapkan model...</span>
              </div>
            )}

            {/* Status Feedback Gestur */}
            <div className="absolute bottom-1 left-1 right-1 flex items-center justify-between px-1.5 py-0.5 rounded bg-black/60 text-[10px] text-zinc-300">
              <span className="truncate">
                {lastStrike && Date.now() - lastStrike.timestamp < 1200
                  ? `⚡ Nada ${labels[lastStrike.note] ?? lastStrike.note + 1}!`
                  : hoveredNote !== null
                  ? `Nada ${labels[hoveredNote] ?? hoveredNote + 1}`
                  : "Arahkan jari telunjuk"}
              </span>
              <span className="text-brand-gold text-[9px] font-mono shrink-0 ml-1">Air Gamelan</span>
            </div>
          </div>
        )}
      </div>

      {/* Petunjuk singkat di bawah preview */}
      {!isMinimized && (
        <span className="mt-1 text-[10px] text-white/70 bg-black/40 px-2 py-0.5 rounded-full shadow-sm">
          💡 Ketuk ke bawah atau diamkan 0.5 detik
        </span>
      )}
    </div>
  );
}

// -------------------------------------------------------------
// Hook Pengelola Siklus Hidup & Pelacakan Gestur Air Gamelan
// -------------------------------------------------------------
export interface UseAirGamelanOptions {
  active: boolean;
  hoveredNote: number | null;
  onPlayNote: (note: number) => void;
  onError: (error: Error) => void;
}

export function useAirGamelanTracking({
  active,
  hoveredNote,
  onPlayNote,
  onError,
}: UseAirGamelanOptions) {
  const videoRef = React.useRef<HTMLVideoElement | null>(null);
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const streamRef = React.useRef<MediaStream | null>(null);
  const landmarkerRef = React.useRef<HandLandmarkerInstance | null>(null);
  const animFrameRef = React.useRef<number | null>(null);

  const [isLoadingModel, setIsLoadingModel] = React.useState(false);
  const [handDetected, setHandDetected] = React.useState(false);
  const [cursor, setCursor] = React.useState<{ x: number; y: number } | null>(null);
  const [cursorNDC, setCursorNDC] = React.useState<{ x: number; y: number } | null>(null);
  const [hoverProgress, setHoverProgress] = React.useState(0);
  const [strikeEvent, setStrikeEvent] = React.useState<StrikeEvent | null>(null);

  // Buffer posisi untuk deteksi ketukan cepat ke bawah (Air Tap)
  const yHistoryRef = React.useRef<Array<{ y: number; time: number }>>([]);
  const lastStrikeTimeRef = React.useRef<number>(0);

  // State untuk deteksi melayang diam (Hover Dwell 0.5 detik)
  const hoverStartRef = React.useRef<number>(0);
  const hoverAnchorRef = React.useRef<{ x: number; y: number } | null>(null);
  const hoverTriggeredRef = React.useRef<boolean>(false);
  const lastHoveredRef = React.useRef<number | null>(null);

  // Filter kehalusan kursor (Exponential smoothing)
  const smoothedPosRef = React.useRef<{ x: number; y: number } | null>(null);

  // Simpan callback terbaru dalam ref
  const onPlayNoteRef = React.useRef(onPlayNote);
  onPlayNoteRef.current = onPlayNote;

  const hoveredNoteRef = React.useRef(hoveredNote);
  hoveredNoteRef.current = hoveredNote;

  // Bersihkan stream webcam
  const cleanupCamera = React.useCallback(() => {
    if (animFrameRef.current !== null) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      if (ctx) ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
    setHandDetected(false);
    setCursor(null);
    setCursorNDC(null);
    setHoverProgress(0);
  }, []);

  // Inisialisasi kamera dan model MediaPipe saat mode aktif
  React.useEffect(() => {
    if (!active) {
      cleanupCamera();
      return;
    }

    let isMounted = true;

    async function init() {
      setIsLoadingModel(true);
      try {
        if (!navigator.mediaDevices?.getUserMedia) {
          throw new Error("Peramban Anda tidak mendukung akses kamera (getUserMedia).");
        }

        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "user",
            width: { ideal: 640 },
            height: { ideal: 480 },
          },
          audio: false,
        });

        if (!isMounted) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }

        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }

        const landmarker = await getHandLandmarker();
        if (!isMounted) return;
        landmarkerRef.current = landmarker;
        setIsLoadingModel(false);

        // Mulai loop deteksi frame
        let lastVideoTime = -1;
        const processFrame = () => {
          if (!isMounted) return;

          const video = videoRef.current;
          const canvas = canvasRef.current;
          const landmarkerInst = landmarkerRef.current;

          if (video && canvas && landmarkerInst && video.readyState >= 2) {
            const now = performance.now();
            if (video.currentTime !== lastVideoTime) {
              lastVideoTime = video.currentTime;
              const result = landmarkerInst.detectForVideo(video, now);

              const ctx = canvas.getContext("2d");
              if (result.landmarks && result.landmarks.length > 0) {
                const landmarks = result.landmarks[0];
                setHandDetected(true);

                // Landmark 8: Ujung jari telunjuk (INDEX_FINGER_TIP)
                const indexTip = landmarks[8];
                if (indexTip) {
                  // Cermin koordinat X secara horizontal agar sesuai gestur alami pengguna
                  const rawMirroredX = 1 - indexTip.x;
                  const rawY = indexTip.y;

                  // Pemetaan rentang yang nyaman agar tangan mudah menjangkau seluruh 7 bilah
                  const targetX = Math.max(0.04, Math.min(0.96, (rawMirroredX - 0.15) / (0.85 - 0.15)));
                  const targetY = Math.max(0.04, Math.min(0.96, (rawY - 0.15) / (0.85 - 0.15)));

                  // Exponential smoothing (lerp) untuk mengurangi getaran noise kamera
                  if (!smoothedPosRef.current) {
                    smoothedPosRef.current = { x: targetX, y: targetY };
                  } else {
                    const SMOOTHING = 0.45;
                    smoothedPosRef.current.x += (targetX - smoothedPosRef.current.x) * SMOOTHING;
                    smoothedPosRef.current.y += (targetY - smoothedPosRef.current.y) * SMOOTHING;
                  }

                  const curX = smoothedPosRef.current.x;
                  const curY = smoothedPosRef.current.y;
                  setCursor({ x: curX, y: curY });

                  // Konversi ke Three.js Normalized Device Coordinates (NDC: -1 s/d +1)
                  const ndcX = curX * 2 - 1;
                  const ndcY = -(curY * 2 - 1);
                  setCursorNDC({ x: ndcX, y: ndcY });

                  // Simpan riwayat Y untuk mendeteksi ketukan udara cepat (Air Tap)
                  const history = yHistoryRef.current;
                  history.push({ y: targetY, time: now });
                  while (history.length > 0 && now - history[0].time > 130) {
                    history.shift();
                  }

                  const curHovered = hoveredNoteRef.current;
                  const timeSinceLastStrike = now - lastStrikeTimeRef.current;

                  // 1) Pemicu Ketukan Cepat ke Bawah (Downward Tap Strike)
                  let didTap = false;
                  if (curHovered !== null && history.length >= 2 && timeSinceLastStrike > 320) {
                    const oldest = history[0];
                    const deltaY = targetY - oldest.y;
                    const deltaTime = now - oldest.time;
                    const velocityY = deltaTime > 0 ? deltaY / deltaTime : 0;

                    // Bergerak turun cepat > 0.024 dalam kurun waktu < 130ms
                    if (deltaY > 0.024 && velocityY > 0.0006) {
                      didTap = true;
                      lastStrikeTimeRef.current = now;
                      onPlayNoteRef.current(curHovered);
                      setStrikeEvent({
                        note: curHovered,
                        triggerType: "tap",
                        timestamp: Date.now(),
                      });
                      yHistoryRef.current = [];
                    }
                  }

                  // 2) Pemicu Melayang Diam (Hover Dwell 0.5 detik)
                  if (!didTap && curHovered !== null) {
                    if (curHovered !== lastHoveredRef.current) {
                      lastHoveredRef.current = curHovered;
                      hoverStartRef.current = now;
                      hoverAnchorRef.current = { x: curX, y: curY };
                      hoverTriggeredRef.current = false;
                      setHoverProgress(0);
                    } else if (!hoverTriggeredRef.current && hoverAnchorRef.current) {
                      const dist = Math.hypot(
                        curX - hoverAnchorRef.current.x,
                        curY - hoverAnchorRef.current.y
                      );

                      // Jika jari tetap diam dalam radius toleransi
                      if (dist < 0.05) {
                        const elapsed = now - hoverStartRef.current;
                        const prog = Math.min(1, elapsed / 500);
                        setHoverProgress(prog);

                        if (elapsed >= 500) {
                          hoverTriggeredRef.current = true;
                          lastStrikeTimeRef.current = now;
                          onPlayNoteRef.current(curHovered);
                          setStrikeEvent({
                            note: curHovered,
                            triggerType: "hover",
                            timestamp: Date.now(),
                          });
                        }
                      } else {
                        // Jari bergeser, reset acuan waktu
                        hoverAnchorRef.current = { x: curX, y: curY };
                        hoverStartRef.current = now;
                        setHoverProgress(0);
                      }
                    }
                  } else if (curHovered === null) {
                    lastHoveredRef.current = null;
                    hoverTriggeredRef.current = false;
                    setHoverProgress(0);
                  }

                  // Gambar kerangka tangan pada floating canvas
                  if (ctx) {
                    const isHovering = curHovered !== null;
                    const isStriking =
                      timeSinceLastStrike < 300 && strikeEvent !== null;
                    drawHandSkeleton(
                      ctx,
                      landmarks,
                      canvas.width,
                      canvas.height,
                      isHovering,
                      isStriking
                    );
                  }
                }
              } else {
                setHandDetected(false);
                setHoverProgress(0);
                lastHoveredRef.current = null;
                hoverTriggeredRef.current = false;
                if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
              }
            }
          }

          animFrameRef.current = requestAnimationFrame(processFrame);
        };

        animFrameRef.current = requestAnimationFrame(processFrame);
      } catch (err: unknown) {
        if (!isMounted) return;
        setIsLoadingModel(false);
        cleanupCamera();
        onError(err instanceof Error ? err : new Error(String(err)));
      }
    }

    void init();

    return () => {
      isMounted = false;
      cleanupCamera();
    };
  }, [active, cleanupCamera, onError]);

  return {
    videoRef,
    canvasRef,
    isLoadingModel,
    handDetected,
    cursor,
    cursorNDC,
    hoverProgress,
    strikeEvent,
  };
}
