"use client";

import * as React from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import {
  Camera,
  CameraOff,
  Hand,
  Keyboard,
  Loader2,
  Mic,
  MicOff,
  MousePointerClick,
  Music,
  Music2,
  Pause,
  Play,
  RotateCcw,
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
  type InteractionType,
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

interface BoundaryProps {
  resetKey?: string;
  onError: () => void;
  children: React.ReactNode;
}

class GlbErrorBoundary extends React.Component<BoundaryProps, { hasError: boolean }> {
  constructor(props: BoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch() {
    this.props.onError();
  }

  componentDidUpdate(prevProps: BoundaryProps) {
    if (prevProps.resetKey !== this.props.resetKey && this.state.hasError) {
      this.setState({ hasError: false });
    }
  }

  render() {
    if (this.state.hasError) return null;
    return this.props.children;
  }
}

function StudioEnvironment() {
  const { gl, scene } = useThree();
  React.useEffect(() => {
    const pmremGenerator = new THREE.PMREMGenerator(gl);
    pmremGenerator.compileEquirectangularShader();
    const envScene = new RoomEnvironment();
    const envTexture = pmremGenerator.fromScene(envScene).texture;
    scene.environment = envTexture;
    return () => {
      scene.environment = null;
      envTexture.dispose();
      envScene.dispose();
      pmremGenerator.dispose();
    };
  }, [gl, scene]);
  return null;
}

function ResponsiveInstrumentCamera() {
  const { camera, size } = useThree();
  React.useEffect(() => {
    const aspect = size.width / size.height;
    if (camera instanceof THREE.PerspectiveCamera) {
      if (aspect < 1.15) {
        // Layar potret / ponsel / tablet: mundurkan kamera proporsional agar model lebar muat penuh
        const factor = Math.min(Math.max(1.15 / aspect, 1.05), 1.55);
        camera.position.set(0, 1.85 * factor, 3.65 * factor);
      } else {
        camera.position.set(0, 1.85, 3.65);
      }
      camera.updateProjectionMatrix();
    }
  }, [camera, size]);
  return null;
}

function ModelLoadingIndicator({ title }: { title?: string }) {
  const gemRef = React.useRef<THREE.Mesh>(null);
  const ringRef = React.useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (gemRef.current) {
      gemRef.current.rotation.y += delta * 1.6;
      gemRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 2) * 0.2;
      gemRef.current.position.y = 0.55 + Math.sin(state.clock.elapsedTime * 3) * 0.08;
    }
    if (ringRef.current) {
      ringRef.current.rotation.z += delta * 0.9;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Cincin Hologram Emas Berputar */}
      <mesh ref={ringRef} position={[0, 0.55, 0]} rotation={[-Math.PI / 2.5, 0, 0]}>
        <ringGeometry args={[0.65, 0.72, 32]} />
        <meshBasicMaterial color="#E0A93B" transparent opacity={0.6} side={THREE.DoubleSide} />
      </mesh>
      {/* Kristal Resonansi 3D */}
      <mesh ref={gemRef} position={[0, 0.55, 0]}>
        <octahedronGeometry args={[0.32, 0]} />
        <meshStandardMaterial
          color="#FAF5EB"
          emissive="#D4A843"
          emissiveIntensity={0.65}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>
    </group>
  );
}

function LoadedGlbModel({ url }: { url: string }) {
  const { scene } = useGLTF(url);

  const normalized = React.useMemo(() => {
    const clone = scene.clone(true);
    clone.traverse((obj) => {
      if (obj instanceof THREE.Mesh) {
        obj.castShadow = true;
        obj.receiveShadow = true;
        if (obj.material) {
          const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
          for (const mat of mats) {
            if (mat) {
              mat.side = THREE.DoubleSide;
              if ("metalness" in mat && typeof mat.metalness === "number") {
                mat.metalness = Math.min(mat.metalness, 0.75);
              }
              if ("roughness" in mat && typeof mat.roughness === "number") {
                mat.roughness = Math.max(0.25, Math.min(0.75, mat.roughness));
              }
            }
          }
        }
      }
    });

    const box = new THREE.Box3().setFromObject(clone);
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z) || 1;
    clone.scale.setScalar(2.35 / maxDim);

    const box2 = new THREE.Box3().setFromObject(clone);
    const center = box2.getCenter(new THREE.Vector3());
    clone.position.set(-center.x, clone.position.y - box2.min.y + 0.1, -center.z);
    return clone;
  }, [scene]);

  return <primitive object={normalized} />;
}

/**
 * Model 3D Prosedural Kontekstual (Digunakan bila provinsi ke-18..38 belum memiliki file .glb)
 * Menyesuaikan geometri dengan kategori interaksi: strike, pluck, bow, shake, atau blow.
 */
function ProceduralInstrumentFallback({
  interactionType,
  activeNoteIdx,
}: {
  interactionType: InteractionType;
  activeNoteIdx: number | null;
}) {
  if (interactionType === "pluck") {
    // Bentuk Lute / Sasando / Sape' Berdawai
    return (
      <group position={[0, 0.25, 0]}>
        <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
          <sphereGeometry args={[0.62, 28, 20]} />
          <meshStandardMaterial color="#8B4A24" roughness={0.45} metalness={0.12} />
        </mesh>
        <mesh position={[0, 1.35, 0]} castShadow>
          <cylinderGeometry args={[0.09, 0.13, 1.65, 16]} />
          <meshStandardMaterial color="#5C2E14" roughness={0.5} />
        </mesh>
        {[-0.18, -0.12, -0.06, 0, 0.06, 0.12, 0.18].map((x, idx) => (
          <mesh key={idx} position={[x, 1.0, 0.56]}>
            <cylinderGeometry args={[0.008, 0.008, 1.75, 8]} />
            <meshStandardMaterial
              color={activeNoteIdx === idx ? "#F5C451" : "#E5D3B3"}
              emissive={activeNoteIdx === idx ? "#D49B27" : "#000000"}
              emissiveIntensity={activeNoteIdx === idx ? 0.8 : 0}
              metalness={0.85}
              roughness={0.2}
            />
          </mesh>
        ))}
      </group>
    );
  }

  if (interactionType === "bow") {
    // Bentuk Instrumen Gesek (Rebab / Keso-Keso / Tehyan)
    return (
      <group position={[0, 0.2, 0]}>
        <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.45, 0.38, 0.35, 24]} />
          <meshStandardMaterial color="#7A3E1D" roughness={0.42} />
        </mesh>
        <mesh position={[0, 1.35, 0]} castShadow>
          <cylinderGeometry args={[0.055, 0.07, 1.85, 16]} />
          <meshStandardMaterial color="#3E1F0D" roughness={0.38} />
        </mesh>
        {[-0.04, 0.04].map((x, i) => (
          <mesh key={i} position={[x, 1.15, 0.22]}>
            <cylinderGeometry args={[0.009, 0.009, 1.65, 8]} />
            <meshStandardMaterial color="#F3E5AB" metalness={0.8} roughness={0.2} />
          </mesh>
        ))}
      </group>
    );
  }

  if (interactionType === "shake") {
    // Bentuk Tabung Bambu Angklung Bertingkat
    return (
      <group position={[0, 0.2, 0]}>
        <mesh position={[0, 0.12, 0]} castShadow>
          <cylinderGeometry args={[0.06, 0.06, 1.7, 16]} rotation={[0, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#9C6B30" roughness={0.5} />
        </mesh>
        {[-0.45, 0, 0.45].map((x, idx) => (
          <mesh key={idx} position={[x, 0.85 - idx * 0.14, 0]} castShadow>
            <cylinderGeometry args={[0.11, 0.12, 1.25 - idx * 0.22, 20]} />
            <meshStandardMaterial color="#C89D54" roughness={0.42} metalness={0.08} />
          </mesh>
        ))}
      </group>
    );
  }

  if (interactionType === "blow") {
    // Bentuk Kerang Tahuri / Seruling Bambu
    return (
      <group position={[0, 0.75, 0]} rotation={[0.15, 0.3, -0.35]}>
        <mesh castShadow receiveShadow>
          <coneGeometry args={[0.52, 1.85, 28]} />
          <meshStandardMaterial color="#D9C2A3" roughness={0.35} metalness={0.15} />
        </mesh>
        <mesh position={[0, -0.65, 0]}>
          <torusGeometry args={[0.38, 0.08, 16, 32]} />
          <meshStandardMaterial color="#B38852" roughness={0.4} />
        </mesh>
      </group>
    );
  }

  // Default: Strike (Bilah Perunggu / Gendang Tabuh)
  return (
    <group position={[0, 0.25, 0]}>
      <mesh position={[0, 0.22, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.1, 0.38, 0.78]} />
        <meshStandardMaterial color="#5E2C14" roughness={0.55} />
      </mesh>
      {[-0.75, -0.5, -0.25, 0, 0.25, 0.5, 0.75].map((x, idx) => {
        const isHit = activeNoteIdx === idx;
        return (
          <mesh
            key={idx}
            position={[x, isHit ? 0.44 : 0.47, 0]}
            castShadow
            receiveShadow
          >
            <boxGeometry args={[0.2, 0.07, 0.62 - idx * 0.03]} />
            <meshStandardMaterial
              color={isHit ? "#FFE082" : "#D4A843"}
              emissive={isHit ? "#D49B27" : "#000000"}
              emissiveIntensity={isHit ? 0.65 : 0}
              metalness={0.78}
              roughness={0.24}
            />
          </mesh>
        );
      })}
    </group>
  );
}

/**
 * Panggung Adegan 3D dengan Animasi Fisika Reaktif Sesuai 5 Cara Main
 */
function ReactiveInstrumentScene({
  instrument,
  activeNoteIdx,
  strikePulseRef,
  shakeEnergyRef,
  bowStateRef,
  blowEnergyRef,
  onStageStrike,
}: {
  instrument: TraditionalInstrument38;
  activeNoteIdx: number | null;
  strikePulseRef: React.MutableRefObject<number>;
  shakeEnergyRef: React.MutableRefObject<number>;
  bowStateRef: React.MutableRefObject<{ active: boolean; pos: number }>;
  blowEnergyRef: React.MutableRefObject<number>;
  onStageStrike: () => void;
}) {
  const groupRef = React.useRef<THREE.Group>(null);
  const ringRef = React.useRef<THREE.Mesh>(null);
  const bowMeshRef = React.useRef<THREE.Group>(null);
  const [glbFailed, setGlbFailed] = React.useState(false);

  React.useEffect(() => {
    setGlbFailed(false);
  }, [instrument.id, instrument.modelUrl]);

  useFrame((state, delta) => {
    const group = groupRef.current;
    if (!group) return;

    // 1. Animasi pantul (Strike Recoil)
    if (strikePulseRef.current > 0.005) {
      strikePulseRef.current = Math.max(0, strikePulseRef.current - delta * 4.2);
      const p = strikePulseRef.current;
      group.position.y = -Math.sin(p * Math.PI) * 0.14;
      const squash = 1 + Math.sin(p * Math.PI * 2) * 0.055;
      group.scale.set(squash, 1 / squash, squash);
    } else {
      group.position.y = THREE.MathUtils.lerp(group.position.y, 0, 0.15);
      group.scale.lerp(new THREE.Vector3(1, 1, 1), 0.15);
    }

    // 2. Animasi goyang (Shake Oscillation)
    if (shakeEnergyRef.current > 0.01) {
      shakeEnergyRef.current = Math.max(0, shakeEnergyRef.current - delta * 2.2);
      group.rotation.z =
        Math.sin(state.clock.elapsedTime * 38) * 0.18 * shakeEnergyRef.current;
    } else {
      group.rotation.z = THREE.MathUtils.lerp(group.rotation.z, 0, 0.18);
    }

    // 3. Animasi busur gesek (Bow)
    if (bowMeshRef.current) {
      const targetX = bowStateRef.current.active
        ? (bowStateRef.current.pos - 0.5) * 1.35
        : 0.45;
      bowMeshRef.current.position.x = THREE.MathUtils.lerp(
        bowMeshRef.current.position.x,
        targetX,
        0.22
      );
      bowMeshRef.current.position.y = bowStateRef.current.active ? 0.88 : 0.72;
    }

    // 4. Gelombang akustik bawah (Strike / Blow / Pluck)
    if (ringRef.current) {
      const energy = Math.max(
        strikePulseRef.current,
        blowEnergyRef.current,
        shakeEnergyRef.current
      );
      const scale = 1 + energy * 1.15 + Math.sin(state.clock.elapsedTime * 5) * 0.04;
      ringRef.current.scale.set(scale, scale, 1);
      const mat = ringRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.16 + energy * 0.45;
    }
  });

  const shouldTryGlb = !glbFailed && Boolean(instrument.modelUrl);

  return (
    <group>
      {/* Podium Kayu Jati Museum Cerah */}
      <mesh position={[0, -0.06, 0]} receiveShadow>
        <cylinderGeometry args={[1.65, 1.82, 0.12, 48]} />
        <meshStandardMaterial color="#FAF5EB" roughness={0.75} metalness={0.02} />
      </mesh>

      {/* Cincin Resonansi Suara Emas */}
      <mesh ref={ringRef} position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.15, 1.32, 48]} />
        <meshBasicMaterial color="#D4A843" transparent opacity={0.45} side={THREE.DoubleSide} />
      </mesh>

      {/* Grup Instrumen Utama */}
      <group
        ref={groupRef}
        onClick={(e) => {
          e.stopPropagation();
          onStageStrike();
        }}
      >
        {shouldTryGlb ? (
          <GlbErrorBoundary
            key={instrument.modelUrl}
            resetKey={instrument.modelUrl}
            onError={() => setGlbFailed(true)}
          >
            <React.Suspense
              fallback={<ModelLoadingIndicator title={instrument.title} />}
            >
              <LoadedGlbModel url={instrument.modelUrl} />
            </React.Suspense>
          </GlbErrorBoundary>
        ) : (
          <ProceduralInstrumentFallback
            interactionType={instrument.interactionType}
            activeNoteIdx={activeNoteIdx}
          />
        )}
      </group>

      {/* Busur Gesek Virtual 3D khusus instrumen bertipe BOW */}
      {instrument.interactionType === "bow" && (
        <group ref={bowMeshRef} position={[0.45, 0.72, 0.65]} rotation={[0, 0, -0.12]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.018, 0.018, 1.85, 12]} rotation={[0, 0, Math.PI / 2]} />
            <meshStandardMaterial color="#5C2E14" roughness={0.4} />
          </mesh>
          <mesh position={[0, -0.05, 0]}>
            <boxGeometry args={[1.78, 0.008, 0.015]} />
            <meshStandardMaterial
              color={bowStateRef.current.active ? "#FFE082" : "#F5EFE6"}
              emissive={bowStateRef.current.active ? "#D49B27" : "#000000"}
              emissiveIntensity={bowStateRef.current.active ? 0.6 : 0}
            />
          </mesh>
        </group>
      )}
    </group>
  );
}

export interface Instrument3DStageProps {
  instrument: TraditionalInstrument38;
  volume?: number;
  onVolumeChange?: (v: number) => void;
}

export function Instrument3DStage({
  instrument,
  volume = 0.78,
  onVolumeChange,
}: Instrument3DStageProps) {
  const isMobile = useIsMobile();
  const [activeNoteIdx, setActiveNoteIdx] = React.useState<number | null>(null);
  const [autoRotate, setAutoRotate] = React.useState<boolean>(true);
  const [cameraKey, setCameraKey] = React.useState<number>(0);

  // Defer WebGL loop when stage is offscreen (IntersectionObserver for PageSpeed 90+)
  const stageContainerRef = React.useRef<HTMLDivElement>(null);
  const [isStageVisible, setIsStageVisible] = React.useState(true);

  React.useEffect(() => {
    const el = stageContainerRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsStageVisible(entry.isIntersecting);
      },
      { rootMargin: "250px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // State untuk Mode Gesek (Bow), Goyang (Shake), dan Tiup (Blow)
  const [isBowingUI, setIsBowingUI] = React.useState(false);
  const [isBlowingHold, setIsBlowingHold] = React.useState(false);
  const [micBlowEnabled, setMicBlowEnabled] = React.useState(false);
  const [micBlowLevel, setMicBlowLevel] = React.useState(0);
  const [selectedPitchIdx, setSelectedPitchIdx] = React.useState(0);

  // State Mode Kamera AI (MediaPipe Hands)
  const [cameraAiEnabled, setCameraAiEnabled] = React.useState(false);
  const [cameraAiLoading, setCameraAiLoading] = React.useState(false);
  const [cameraHandDetected, setCameraHandDetected] = React.useState(false);
  const [handCursor, setHandCursor] = React.useState<{ x: number; y: number } | null>(null);
  const [cameraTargetNoteIdx, setCameraTargetNoteIdx] = React.useState<number | null>(null);
  const [isPinchingState, setIsPinchingState] = React.useState(false);
  const [isStrikingState, setIsStrikingState] = React.useState(false);
  const [hitRippleNoteIdx, setHitRippleNoteIdx] = React.useState<number | null>(null);

  // Refs Kamera AI & Gesture Tracking (Air Tap & Pinch)
  const wasPinchingRef = React.useRef(false);
  const wasAirTappingRef = React.useRef(false);
  const prevIndexTipRef = React.useRef<{ x: number; y: number; relY?: number; time: number } | null>(null);
  const lastNoteIdxRef = React.useRef<number | null>(null);
  const lastNoteChangeTimeRef = React.useRef(0);
  const smoothCursorRef = React.useRef<{ x: number; y: number }>({ x: 0.5, y: 0.5 });
  const strikeResetTimerRef = React.useRef<NodeJS.Timeout | null>(null);

  // Nonaktifkan Kamera AI otomatis pada layar HP untuk menghemat baterai & memori
  React.useEffect(() => {
    if (isMobile && cameraAiEnabled) {
      setCameraAiEnabled(false);
    }
  }, [isMobile, cameraAiEnabled]);

  // Refs animasi 3D & deteksi gerakan
  const strikePulseRef = React.useRef(0);
  const shakeEnergyRef = React.useRef(0);
  const bowStateRef = React.useRef({ active: false, pos: 0.5 });
  const blowEnergyRef = React.useRef(0);
  const lastShakeTriggerRef = React.useRef(0);
  const lastMouseXRef = React.useRef<number | null>(null);
  const lastPluckedIdxRef = React.useRef<number | null>(null);

  // Refs Kamera AI
  const videoRef = React.useRef<HTMLVideoElement | null>(null);
  const overlayCanvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const prevHandPosRef = React.useRef<{ x: number; y: number; time: number } | null>(null);
  const lastAiTriggerTimeRef = React.useRef(0);

  // State Demo Autoplay (Tes Tangga Nada & Melodi Lagu Daerah)
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

  // Sinkronisasi volume ke SoundEngine & preload sampel MP3 jika ada
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

  const lastPlayTimeRef = React.useRef<number>(0);

  // Fungsi memicu nada tunggal (Strike / Pluck / Shake / Tap)
  const playNoteByIndex = React.useCallback(
    (idx: number, velocity = 0.9) => {
      // Debounce minimal 80ms untuk mencegah double-trigger audio click
      const now = typeof performance !== "undefined" ? performance.now() : Date.now();
      if (now - lastPlayTimeRef.current < 80) return;
      lastPlayTimeRef.current = now;

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

      if (instrument.interactionType === "shake") {
        shakeEnergyRef.current = 1.0;
      } else if (instrument.interactionType === "blow") {
        blowEnergyRef.current = 0.85;
      } else {
        strikePulseRef.current = 1.0;
      }

      if (typeof navigator !== "undefined" && navigator.vibrate) {
        navigator.vibrate(14);
      }

      window.setTimeout(() => {
        setActiveNoteIdx((curr) => (curr === idx ? null : curr));
      }, 280);
    },
    [instrument]
  );

  // Handler Memulai Tes Tangga Nada
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

  // Handler Memulai Melodi Contoh Lagu Daerah
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

  // Handler Genjreng Seluruh Senar (Arpeggio Strumming Cascade)
  const strumAllStrings = React.useCallback(
    (direction: "down" | "up" = "down") => {
      stopDemo();
      const count = instrument.notes.length;
      const indices = Array.from({ length: count }, (_, i) =>
        direction === "down" ? i : count - 1 - i
      );
      indices.forEach((idx, step) => {
        window.setTimeout(() => {
          playNoteByIndex(idx, 0.95);
        }, step * 48); // Jeda 48ms menghasilkan genjrengan akustik alami
      });
    },
    [instrument.notes.length, playNoteByIndex, stopDemo]
  );

  // Pintasan Keyboard 1-7
  React.useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return;
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA")) return;

      const num = parseInt(e.key, 10);
      if (num >= 1 && num <= instrument.notes.length) {
        stopDemo();
        playNoteByIndex(num - 1, 0.92);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [instrument.notes.length, playNoteByIndex, stopDemo]);

  // Handler Mikrofon Tiup (AnalyserNode)
  const toggleMicBlow = async () => {
    if (micBlowEnabled) {
      soundEngine.stopMicBlowDetector();
      soundEngine.stopContinuousVoice();
      setMicBlowEnabled(false);
      setMicBlowLevel(0);
      blowEnergyRef.current = 0;
      return;
    }

    const ok = await soundEngine.startMicBlowDetector((level, isBlowing) => {
      setMicBlowLevel(level);
      blowEnergyRef.current = level;
      const currentNote =
        instrument.notes[selectedPitchIdx] ?? instrument.notes[0];
      if (isBlowing && currentNote) {
        soundEngine.startContinuousVoice("blow", currentNote.freq, Math.min(1, level * 1.35));
      } else {
        soundEngine.stopContinuousVoice();
      }
    });

    if (!ok) {
      toast.error("Mikrofon tidak dapat diakses", {
        description:
          "Pastikan izin mikrofon diaktifkan di peramban, atau gunakan tombol Tahan Tiup di layar.",
      });
      return;
    }

    setMicBlowEnabled(true);
    toast.success("Sensor Tiup Mikrofon Aktif", {
      description: "Tiup perlahan ke arah mikrofon perangkat Anda untuk membunyikan instrumen.",
    });
  };

  // Handler Mode Kamera AI (MediaPipe Hands)
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
              // Mirror X agar gerakan telunjuk sinkron dengan cermin pengguna
              const normX = 1 - hand[8].x;
              const rawY = hand[8].y;

              // Smoothing kursor target (lerp/damping) agar pergerakan lingkaran oranye halus
              const LERP_FACTOR = 0.35;
              smoothCursorRef.current.x += (normX - smoothCursorRef.current.x) * LERP_FACTOR;
              smoothCursorRef.current.y += (rawY - smoothCursorRef.current.y) * LERP_FACTOR;
              setHandCursor({ x: smoothCursorRef.current.x, y: smoothCursorRef.current.y });

              // Kalibrasi jangkauan tangan horizontal (0.12 s/d 0.88)
              const calibratedX = Math.max(0, Math.min(1, (smoothCursorRef.current.x - 0.12) / 0.76));
              const noteIdx = Math.min(
                instrument.notes.length - 1,
                Math.max(0, Math.floor(calibratedX * instrument.notes.length))
              );
              const note = instrument.notes[noteIdx] ?? instrument.notes[0];
              setCameraTargetNoteIdx(noteIdx);

              // -------------------------------------------------------------
              // 1. DETEKSI PINCH (Jarak Antara Telunjuk [8] & Jempol [4])
              // -------------------------------------------------------------
              let isPinching = false;
              if (hand[4]) {
                const rawPinchDist = Math.hypot(hand[8].x - hand[4].x, hand[8].y - hand[4].y);
                const palmSize = hand[0] && hand[9]
                  ? Math.hypot(hand[0].x - hand[9].x, hand[0].y - hand[9].y)
                  : 0.25;
                const pinchRatio = rawPinchDist / (palmSize || 0.25);

                // Histeresis: aktif saat benar-benar rapat (< 0.042 raw atau rasio < 0.22), lepas saat terbuka
                if (!wasPinchingRef.current) {
                  isPinching = rawPinchDist < 0.042 && pinchRatio < 0.22;
                } else {
                  isPinching = rawPinchDist < 0.070 && pinchRatio < 0.32;
                }
              }
              setIsPinchingState(isPinching);

              // Periksa kecepatan horizontal: apakah tangan sedang digeser antar nada (misal nada 2 ke 1)?
              const prev = prevHandPosRef.current;
              let isMovingHorizontally = false;
              let vx = 0;
              if (prev) {
                const dt = Math.max(8, nowMs - prev.time);
                vx = (normX - prev.x) / (dt / 1000);
                // Kecepatan horizontal di atas 0.26 menandakan tangan sedang bergeser membidik
                isMovingHorizontally = Math.abs(vx) > 0.26;
              }

              // Catat momen perpindahan nada untuk mencegah trigger palsu akibat momentum geser
              if (lastNoteIdxRef.current !== noteIdx) {
                lastNoteChangeTimeRef.current = nowMs;
                lastNoteIdxRef.current = noteIdx;
              }
              const justChangedNote = nowMs - lastNoteChangeTimeRef.current < 90;

              // -------------------------------------------------------------
              // 2. DETEKSI AIR TAP (Kecepatan Sentakan Vertikal Telunjuk ke Bawah)
              // -------------------------------------------------------------
              let isAirTap = false;
              const prevTip = prevIndexTipRef.current;
              if (prevTip && !isMovingHorizontally && !justChangedNote) {
                const dt = Math.max(8, nowMs - prevTip.time);
                // Arah bawah layar bernilai Y positif
                const tipVy = (hand[8].y - prevTip.y) / (dt / 1000);
                const deltaY = hand[8].y - prevTip.y;

                // Gerakan relatif ujung telunjuk terhadap buku jari telunjuk (hand[5])
                const relY = hand[8].y - hand[5].y;
                const prevRelY = prevTip.relY ?? relY;
                const deltaRelY = relY - prevRelY;

                // Syarat Air Tap murni (sentakan ke bawah saat membidik, bukan geseran):
                // 1. Kecepatan vertikal tegas (tipVy > 0.58)
                // 2. Jarak sentakan nyata (deltaY > 0.032)
                // 3. Tekukan ujung telunjuk relatif terhadap pangkal (deltaRelY >= -0.005)
                // 4. Dominan vertikal (tipVy > |vx| * 2)
                if (
                  dt < 90 &&
                  tipVy > 0.58 &&
                  deltaY > 0.032 &&
                  deltaRelY >= -0.005 &&
                  tipVy > Math.abs(vx) * 2
                ) {
                  isAirTap = true;
                }
              }
              prevIndexTipRef.current = {
                x: hand[8].x,
                y: hand[8].y,
                relY: hand[8].y - hand[5].y,
                time: nowMs,
              };

              // -------------------------------------------------------------
              // 3. EKSEKUSI TRIGGER MENABUH (AIR TAP ATAU PINCH)
              // -------------------------------------------------------------
              const isPinchTrigger = isPinching && !wasPinchingRef.current;
              const isAirTapTrigger = isAirTap && !wasAirTappingRef.current;
              const canTrigger = nowMs - lastAiTriggerTimeRef.current > 200;

              if ((isPinchTrigger || isAirTapTrigger) && canTrigger) {
                lastAiTriggerTimeRef.current = nowMs;
                playNoteByIndex(noteIdx, 0.96);
                setHitRippleNoteIdx(noteIdx);
                setIsStrikingState(true);

                if (strikeResetTimerRef.current) clearTimeout(strikeResetTimerRef.current);
                strikeResetTimerRef.current = setTimeout(() => {
                  setIsStrikingState(false);
                  setHitRippleNoteIdx(null);
                }, 350);
              }
              // Mode Gesek (Bow) untuk instrumen dawai (misal Rebab)
              else if (instrument.interactionType === "bow" && prev) {
                const dt = Math.max(8, nowMs - prev.time);
                const vx = (normX - prev.x) / (dt / 1000);
                const speed = Math.abs(vx);
                if ((isPinching || speed > 0.16) && note) {
                  bowStateRef.current = { active: true, pos: normX };
                  setActiveNoteIdx(noteIdx);
                  soundEngine.startContinuousVoice(
                    "bow",
                    note.freq,
                    Math.min(1, 0.4 + (isPinching ? 0.4 : speed * 0.5))
                  );
                } else {
                  bowStateRef.current.active = false;
                  soundEngine.stopContinuousVoice();
                }
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
              setIsPinchingState(false);
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
          description: "Pastikan izin webcam diberikan untuk mencoba fitur Gestur Tangan AI.",
        });
      }
    }

    void initHandCamera();

    return () => {
      cancelled = true;
      if (rafId !== null) cancelAnimationFrame(rafId);
      if (stream) stream.getTracks().forEach((t) => t.stop());
      soundEngine.stopContinuousVoice();
    };
  }, [cameraAiEnabled, instrument, playNoteByIndex]);

  const meta = INTERACTION_META[instrument.interactionType];

  return (
    <div className="space-y-4">
      {/* BARIS KONTROL ATAS: STATUS CARA MAIN, SENSOR MIKROFON, & KAMERA AI */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 rounded-2xl border border-[#DFD3C2] bg-[#FAF6EE] px-3.5 py-2.5">
        <div className="flex flex-wrap items-center gap-2">
          <Badge className="bg-[#52331C] text-white hover:bg-[#482B18] text-xs font-bold px-3 py-1 rounded-full">
            Cara Main: {meta.badge}
          </Badge>
          <span className="text-xs font-medium text-stone-700">
            {instrument.hasGlbAsset
              ? `Model 3D Asli (${instrument.province})`
              : `Simulasi 3D Interaktif (${instrument.province})`}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Tombol Demo Tangga Nada & Melodi Lagu Tradisional */}
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
                title="Uji tangga nada lengkap dari nada dasar ke tinggi lalu kembali"
              >
                <Music className="mr-1.5 h-3.5 w-3.5 text-[#6E472D]" />
                <span>Tes Nada</span>
              </Button>

              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={startMelodyDemo}
                className="h-8 rounded-full text-xs font-semibold border-[#6E472D]/40 text-[#2D1E12] bg-white hover:bg-[#FAF3E6] shadow-2xs cursor-pointer max-w-[210px] sm:max-w-none"
                title={`Dengarkan contoh lagu ${instrumentMelody.songName}`}
              >
                <Play className="mr-1.5 h-3.5 w-3.5 text-[#6E472D] fill-[#6E472D]/20 shrink-0" />
                <span className="truncate">Contoh Lagu: {instrumentMelody.songName}</span>
              </Button>
            </>
          )}

          {/* Tombol Genjreng Akord khusus instrumen PETIK / PLUCK */}
          {instrument.interactionType === "pluck" && (
            <Button
              type="button"
              size="sm"
              variant="default"
              onClick={() => strumAllStrings("down")}
              className="h-8 rounded-full text-xs font-bold btn-waranusa text-white shadow-xs cursor-pointer flex items-center gap-1.5 hover:scale-105 transition-all"
              title="Petik cepat seluruh senar (Genjreng Akord)"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Genjreng Akord</span>
            </Button>
          )}

          {/* Tombol Sensor Tiup Mikrofon khusus instrumen BLOW */}
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
              {micBlowEnabled ? (
                <>
                  <Mic className="mr-1.5 h-3.5 w-3.5 animate-pulse" />
                  Mikrofon Tiup Aktif
                </>
              ) : (
                <>
                  <MicOff className="mr-1.5 h-3.5 w-3.5" />
                  Aktifkan Tiup Mikrofon
                </>
              )}
            </Button>
          )}

          {/* Tombol Mode Kamera AI (MediaPipe Hands) — Khusus Layar Desktop (Nonaktif di HP untuk performa & hemat daya) */}
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
              {cameraAiEnabled ? "Matikan Kamera AI" : "Mode Kamera AI (Gestur Tangan)"}
            </Button>
          )}
        </div>
      </div>

      {/* PANGGUNG KANVAS 3D + OVERLAY INTERAKSI MULTI-INPUT */}
      <div
        ref={stageContainerRef}
        className="relative h-[340px] xs:h-[380px] sm:h-[430px] md:h-[470px] w-full overflow-hidden rounded-2xl border border-[#C8B69F] bg-gradient-to-b from-[#DCCAB3] via-[#CBB69C] to-[#B79F81] select-none touch-none"
        onTouchStart={(e) => {
          if (e.touches.length > 0) {
            const touch = e.touches[0];
            const rect = e.currentTarget.getBoundingClientRect();
            const relX = Math.max(0, Math.min(1, (touch.clientX - rect.left) / rect.width));

            if (instrument.interactionType === "pluck") {
              const idx = Math.min(
                instrument.notes.length - 1,
                Math.max(0, Math.floor(relX * instrument.notes.length))
              );
              lastPluckedIdxRef.current = idx;
              playNoteByIndex(idx, 0.95);
            } else if (instrument.interactionType === "bow") {
              const idx = Math.min(
                instrument.notes.length - 1,
                Math.floor(relX * instrument.notes.length)
              );
              const note = instrument.notes[idx] ?? instrument.notes[0];
              setIsBowingUI(true);
              bowStateRef.current = { active: true, pos: relX };
              setActiveNoteIdx(idx);
              if (note) {
                soundEngine.startContinuousVoice("bow", note.freq, 0.85);
              }
            } else if (instrument.interactionType === "shake") {
              lastMouseXRef.current = relX;
              const idx = Math.min(
                instrument.notes.length - 1,
                Math.floor(relX * instrument.notes.length)
              );
              playNoteByIndex(idx, 0.95);
            }
          }
        }}
        onTouchMove={(e) => {
          if (e.touches.length > 0) {
            const touch = e.touches[0];
            const rect = e.currentTarget.getBoundingClientRect();
            const relX = Math.max(0, Math.min(1, (touch.clientX - rect.left) / rect.width));

            // Mode PLUCK / STRUM: Geser jari melintasi senar untuk menggenjreng
            if (instrument.interactionType === "pluck") {
              const idx = Math.min(
                instrument.notes.length - 1,
                Math.max(0, Math.floor(relX * instrument.notes.length))
              );
              if (lastPluckedIdxRef.current !== idx) {
                lastPluckedIdxRef.current = idx;
                playNoteByIndex(idx, 0.95);
              }
            }

            if (instrument.interactionType === "shake") {
              if (lastMouseXRef.current !== null) {
                const deltaX = Math.abs(relX - lastMouseXRef.current);
                const now = performance.now();
                if (deltaX > 0.075 && now - lastShakeTriggerRef.current > 130) {
                  lastShakeTriggerRef.current = now;
                  const idx = Math.min(
                    instrument.notes.length - 1,
                    Math.floor(relX * instrument.notes.length)
                  );
                  playNoteByIndex(idx, Math.min(1, 0.65 + deltaX * 2.5));
                }
              }
              lastMouseXRef.current = relX;
            }

            if (instrument.interactionType === "bow" && isBowingUI) {
              bowStateRef.current = { active: true, pos: relX };
              const idx = Math.min(
                instrument.notes.length - 1,
                Math.floor(relX * instrument.notes.length)
              );
              const note = instrument.notes[idx] ?? instrument.notes[0];
              setActiveNoteIdx(idx);
              if (note) {
                soundEngine.updateContinuousVoice(note.freq, 0.85);
              }
            }
          }
        }}
        onTouchEnd={() => {
          lastMouseXRef.current = null;
          lastPluckedIdxRef.current = null;
          if (instrument.interactionType === "bow" && isBowingUI) {
            setIsBowingUI(false);
            bowStateRef.current.active = false;
            setActiveNoteIdx(null);
            soundEngine.stopContinuousVoice();
          }
        }}
        onTouchCancel={() => {
          lastMouseXRef.current = null;
          lastPluckedIdxRef.current = null;
          if (instrument.interactionType === "bow" && isBowingUI) {
            setIsBowingUI(false);
            bowStateRef.current.active = false;
            setActiveNoteIdx(null);
            soundEngine.stopContinuousVoice();
          }
        }}
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const relX = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));

          // Mode PLUCK / STRUM: Geser kursor mouse sambil ditekan untuk genjreng
          if (instrument.interactionType === "pluck") {
            if (e.buttons > 0) {
              const idx = Math.min(
                instrument.notes.length - 1,
                Math.max(0, Math.floor(relX * instrument.notes.length))
              );
              if (lastPluckedIdxRef.current !== idx) {
                lastPluckedIdxRef.current = idx;
                playNoteByIndex(idx, 0.95);
              }
            }
          }

          // Mode SHAKE: Goyangkan kursor cepat kiri-kanan di atas panggung
          if (instrument.interactionType === "shake") {
            if (lastMouseXRef.current !== null) {
              const deltaX = Math.abs(relX - lastMouseXRef.current);
              const now = performance.now();
              if (deltaX > 0.085 && now - lastShakeTriggerRef.current > 140) {
                lastShakeTriggerRef.current = now;
                const idx = Math.min(
                  instrument.notes.length - 1,
                  Math.floor(relX * instrument.notes.length)
                );
                playNoteByIndex(idx, Math.min(1, 0.65 + deltaX * 2.5));
              }
            }
            lastMouseXRef.current = relX;
          }

          // Mode BOW: Drag & Hold kiri-kanan untuk menggesek dawai
          if (instrument.interactionType === "bow" && isBowingUI) {
            bowStateRef.current = { active: true, pos: relX };
            const idx = Math.min(
              instrument.notes.length - 1,
              Math.floor(relX * instrument.notes.length)
            );
            const note = instrument.notes[idx] ?? instrument.notes[0];
            setActiveNoteIdx(idx);
            if (note) {
              soundEngine.updateContinuousVoice(note.freq, 0.85);
            }
          }
        }}
        onMouseDown={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const relX = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));

          if (instrument.interactionType === "pluck") {
            const idx = Math.min(
              instrument.notes.length - 1,
              Math.max(0, Math.floor(relX * instrument.notes.length))
            );
            lastPluckedIdxRef.current = idx;
            playNoteByIndex(idx, 0.95);
          } else if (instrument.interactionType === "bow") {
            const idx = Math.min(
              instrument.notes.length - 1,
              Math.floor(relX * instrument.notes.length)
            );
            const note = instrument.notes[idx] ?? instrument.notes[0];
            setIsBowingUI(true);
            bowStateRef.current = { active: true, pos: relX };
            setActiveNoteIdx(idx);
            if (note) {
              soundEngine.startContinuousVoice("bow", note.freq, 0.82);
            }
          }
        }}
        onMouseUp={() => {
          lastPluckedIdxRef.current = null;
          if (instrument.interactionType === "bow" && isBowingUI) {
            setIsBowingUI(false);
            bowStateRef.current.active = false;
            setActiveNoteIdx(null);
            soundEngine.stopContinuousVoice();
          }
        }}
        onMouseLeave={() => {
          lastMouseXRef.current = null;
          lastPluckedIdxRef.current = null;
          if (instrument.interactionType === "bow" && isBowingUI) {
            setIsBowingUI(false);
            bowStateRef.current.active = false;
            setActiveNoteIdx(null);
            soundEngine.stopContinuousVoice();
          }
        }}
      >
        {/* OVERLAY PANDUAN CARA BERMAIN DI POJOK KIRI ATAS */}
        <div className="pointer-events-none absolute top-2.5 left-2.5 sm:top-3 sm:left-3 z-20 max-w-[calc(100%-125px)] sm:max-w-xs rounded-xl border border-[#B8977E]/80 bg-white/95 backdrop-blur-md p-2.5 sm:p-3 shadow-xs">
          <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-bold text-[#2D1E12]">
            <Hand className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-[#6E472D] shrink-0" aria-hidden="true" />
            <span className="truncate">Panduan ({meta.badge})</span>
          </div>
          <p className="mt-0.5 sm:mt-1 text-[10.5px] sm:text-[11.5px] leading-snug sm:leading-relaxed text-stone-800 font-medium line-clamp-2 sm:line-clamp-none">
            {instrument.interactionType === "pluck"
              ? "Usap/geser mouse atau jari melintasi senar untuk menggenjreng, atau klik tombol Genjreng Akord."
              : cameraAiEnabled
              ? "Arahkan jari telunjuk ke bilah nada, lalu sentakkan jari ke bawah untuk menabuh."
              : instrument.mouseGuide}
          </p>
        </div>

        {/* KONTROL ROTASI & RESET KAMERA DI POJOK KANAN ATAS */}
        <div className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 z-20 flex items-center gap-1 sm:gap-1.5 rounded-full border border-[#DFD3C2] bg-white/95 px-2 sm:px-2.5 py-1 shadow-xs backdrop-blur-md">
          <button
            type="button"
            onClick={() => setAutoRotate((prev) => !prev)}
            aria-label={autoRotate ? "Jeda rotasi 360 derajat" : "Putar instrumen 360 derajat otomatis"}
            className="flex items-center gap-1 text-[10px] sm:text-[11px] font-semibold text-stone-700 hover:text-[#6E472D] px-1 sm:px-1.5 py-0.5 cursor-pointer"
          >
            {autoRotate ? <Pause className="h-3 w-3" aria-hidden="true" /> : <Play className="h-3 w-3" aria-hidden="true" />}
            <span className="hidden xs:inline">{autoRotate ? "Jeda" : "360°"}</span>
          </button>
          <span className="h-3 w-[1px] bg-stone-300" aria-hidden="true" />
          <button
            type="button"
            onClick={() => setCameraKey((k) => k + 1)}
            aria-label="Atur ulang sudut kamera instrumen"
            className="p-1 text-stone-600 hover:text-[#6E472D] cursor-pointer"
            title="Reset Kamera"
          >
            <RotateCcw className="h-3 w-3 sm:h-3.5 sm:w-3.5" aria-hidden="true" />
          </button>
        </div>

        {/* OVERLAY SENAR VIRTUAL INTERAKTIF KHUSUS INSTRUMEN PETIK (PLUCK) — DAPAT DIGENJRENG DENGAN DRAG / SWIPE */}
        {instrument.interactionType === "pluck" && (
          <div
            className="absolute inset-x-6 sm:inset-x-14 bottom-12 top-16 z-20 flex items-stretch justify-between pointer-events-auto touch-none select-none"
            onPointerDown={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const relX = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
              const idx = Math.min(
                instrument.notes.length - 1,
                Math.max(0, Math.floor(relX * instrument.notes.length))
              );
              lastPluckedIdxRef.current = idx;
              playNoteByIndex(idx, 0.95);
            }}
            onPointerMove={(e) => {
              // Genjreng: sapuan kursor saat mouse ditekan ATAU swipe sentuhan di HP
              if (e.buttons > 0 || e.pointerType === "touch") {
                const rect = e.currentTarget.getBoundingClientRect();
                const relX = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
                const idx = Math.min(
                  instrument.notes.length - 1,
                  Math.max(0, Math.floor(relX * instrument.notes.length))
                );
                if (lastPluckedIdxRef.current !== idx) {
                  lastPluckedIdxRef.current = idx;
                  playNoteByIndex(idx, 0.95);
                }
              }
            }}
            onPointerUp={() => {
              lastPluckedIdxRef.current = null;
            }}
            onPointerCancel={() => {
              lastPluckedIdxRef.current = null;
            }}
          >
            {instrument.notes.map((note, idx) => {
              const isStruck = activeNoteIdx === idx;
              return (
                <div
                  key={note.code}
                  role="button"
                  tabIndex={0}
                  aria-label={`Petik Senar ${note.label} (${note.code}), frekuensi ${Math.round(note.freq)} Hertz`}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      stopDemo();
                      playNoteByIndex(idx, 0.95);
                    }
                  }}
                  onPointerDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    stopDemo();
                    lastPluckedIdxRef.current = idx;
                    playNoteByIndex(idx, 0.95);
                  }}
                  onPointerEnter={(e) => {
                    // Sapuan kursor saat tombol ditekan (strumming)
                    if (e.buttons > 0 && lastPluckedIdxRef.current !== idx) {
                      lastPluckedIdxRef.current = idx;
                      playNoteByIndex(idx, 0.92);
                    }
                  }}
                  className="group relative flex-1 flex flex-col items-center justify-end pb-2 cursor-pointer outline-hidden touch-none"
                  title={`Petik Senar ${note.label} (${note.freq} Hz) — Geser/usap kiri-kanan untuk genjreng`}
                >
                  {/* Efek Garis Senar dengan Animasi Getar/Vibrasi saat Digenjreng */}
                  <div
                    className={cn(
                      "h-full w-[2px] sm:w-[2.5px] transition-all duration-75 relative",
                      isStruck
                        ? "w-[4px] sm:w-[5px] bg-gradient-to-b from-[#FFF5D6] via-[#F59E0B] to-[#D97706] shadow-[0_0_16px_#F59E0B] scale-x-125 animate-pulse"
                        : "bg-[#8B5A2B]/55 group-hover:bg-[#6E472D]"
                    )}
                  >
                    {isStruck && (
                      <span className="absolute inset-y-0 -left-1 -right-1 bg-amber-400/40 blur-xs" />
                    )}
                  </div>
                  <span
                    className={cn(
                      "mt-1.5 rounded-full px-2 py-0.5 text-[10px] font-bold shadow-xs border transition-all",
                      isStruck
                        ? "bg-amber-400 text-stone-950 border-amber-300 font-extrabold scale-110 shadow-md"
                        : "bg-white/95 text-[#2D1E12] border-[#DFD3C2]"
                    )}
                  >
                    {note.code}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {/* KURSOR TARGET ORANYE (LERP/DAMPING SMOOTH) MENGIKUTI POSISI JARI TELUNJUK */}
        {cameraAiEnabled && handCursor && (
          <div
            className="pointer-events-none absolute z-30 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1.5 transition-transform duration-75"
            style={{
              left: `${Math.max(5, Math.min(95, handCursor.x * 100))}%`,
              top: `${Math.max(8, Math.min(90, handCursor.y * 100))}%`,
            }}
          >
            {/* Lingkaran Target Oranye Mulus dengan Efek Tabuh / Ripple */}
            <div
              className={cn(
                "rounded-full border-2 transition-all duration-150 flex items-center justify-center relative",
                isStrikingState
                  ? "h-12 w-12 scale-125 bg-amber-400/80 border-white ring-4 ring-amber-300 shadow-[0_0_30px_rgba(251,191,36,1)]"
                  : isPinchingState
                  ? "h-10 w-10 scale-110 bg-amber-500/60 border-amber-200 ring-3 ring-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.9)]"
                  : "h-8 w-8 bg-amber-500/25 border-amber-400 ring-2 ring-amber-400/50 shadow-[0_0_16px_rgba(245,158,11,0.6)]"
              )}
            >
              <div
                className={cn(
                  "rounded-full transition-all duration-100",
                  isStrikingState ? "h-3.5 w-3.5 bg-white shadow-md animate-ping" : "h-2 w-2 bg-white shadow-xs"
                )}
              />
              {isStrikingState && (
                <span className="absolute inset-0 rounded-full border-2 border-amber-300 animate-ping" />
              )}
            </div>

            {/* Label Nada yang Sedang Dibidik Kursor */}
            {cameraTargetNoteIdx !== null && instrument.notes[cameraTargetNoteIdx] && (
              <span
                className={cn(
                  "whitespace-nowrap rounded-full px-2.5 py-0.5 text-[10px] font-bold shadow-md border transition-all select-none",
                  isStrikingState
                    ? "bg-amber-400 text-stone-950 border-white ring-2 ring-amber-300 scale-110 font-extrabold"
                    : "bg-stone-900/90 text-amber-200 border-amber-400/80 ring-1 ring-amber-400/40"
                )}
              >
                {isStrikingState
                  ? `💥 ${instrument.notes[cameraTargetNoteIdx].label} (Tabuh!)`
                  : `👉 ${instrument.notes[cameraTargetNoteIdx].label}`}
              </span>
            )}
          </div>
        )}

        {/* PREVIEW WEBCAM KERANGKA TANGAN DI POJOK KANAN BAWAH */}
        {cameraAiEnabled && (
          <div className="absolute bottom-2.5 right-2.5 sm:bottom-3 sm:right-3 z-20 w-28 xs:w-32 sm:w-44 overflow-hidden rounded-xl border-2 border-[#6E472D]/60 bg-stone-950 shadow-lg">
            <div className="relative aspect-4/3 w-full">
              <video
                ref={videoRef}
                playsInline
                muted
                className="h-full w-full -scale-x-100 object-cover opacity-75"
              />
              <canvas
                ref={overlayCanvasRef}
                width={176}
                height={132}
                className="pointer-events-none absolute inset-0 h-full w-full -scale-x-100"
              />
            </div>
            <div className="bg-stone-900/95 px-1.5 sm:px-2 py-0.5 sm:py-1 text-[9px] sm:text-[10px] font-medium text-amber-100 flex items-center justify-between">
              <span className="truncate">
                {cameraHandDetected
                  ? isStrikingState
                    ? "💥 Tabuh!"
                    : isPinchingState
                    ? "👌 Cubit (Pinch)"
                    : cameraTargetNoteIdx !== null && instrument.notes[cameraTargetNoteIdx]
                    ? `🎯 ${instrument.notes[cameraTargetNoteIdx].label}`
                    : "Tangan Terdeteksi"
                  : "Arahkan Tangan"}
              </span>
              <span
                className={cn(
                  "h-1.5 w-1.5 sm:h-2 sm:w-2 shrink-0 rounded-full",
                  cameraHandDetected
                    ? isStrikingState
                      ? "bg-amber-300 ring-2 ring-white animate-pulse"
                      : "bg-emerald-400 animate-ping"
                    : "bg-amber-400"
                )}
              />
            </div>
          </div>
        )}

        {/* KANVAS THREE.JS (Throttled via IntersectionObserver for Battery & 90+ PageSpeed) */}
        <Canvas
          key={`${instrument.id}-${cameraKey}`}
          shadows
          camera={{ position: [0, 1.85, 3.65], fov: 42 }}
          frameloop={isStageVisible && (autoRotate || cameraAiEnabled) ? "always" : "demand"}
          gl={{
            toneMapping: THREE.NeutralToneMapping,
            toneMappingExposure: 0.98,
            antialias: true,
          }}
        >
          <ResponsiveInstrumentCamera />
          <StudioEnvironment />
          {/* Pencahayaan Studio Alami & Terkalibrasi: Hangat, jernih, dan tidak membakar warna terang */}
          <ambientLight intensity={0.60} />
          <hemisphereLight args={["#FFFDF2", "#4A3522", 0.68]} />
          <directionalLight
            position={[5, 8, 5]}
            intensity={1.05}
            castShadow
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
          />
          <directionalLight position={[0, 3.5, 5.5]} intensity={0.55} color="#FFF8EE" />
          <directionalLight position={[-4, 4, -4]} intensity={0.42} color="#FFF2DB" />

          <ReactiveInstrumentScene
            instrument={instrument}
            activeNoteIdx={activeNoteIdx}
            strikePulseRef={strikePulseRef}
            shakeEnergyRef={shakeEnergyRef}
            bowStateRef={bowStateRef}
            blowEnergyRef={blowEnergyRef}
            onStageStrike={() => {
              const nextIdx =
                activeNoteIdx !== null
                  ? (activeNoteIdx + 1) % instrument.notes.length
                  : 0;
              playNoteByIndex(nextIdx, 0.92);
            }}
          />

          <OrbitControls
            enablePan={false}
            enableZoom={true}
            enableRotate={instrument.interactionType !== "bow"}
            autoRotate={autoRotate && !isBowingUI && !isBlowingHold}
            autoRotateSpeed={1.1}
            minDistance={2.1}
            maxDistance={5.5}
            maxPolarAngle={Math.PI / 2 - 0.04}
          />
        </Canvas>
      </div>

      {/* PANEL AKSI SPESIFIK TIPE INTERAKSI (GESEK / GOYANG / TIUP) */}
      {instrument.interactionType === "bow" && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#DFD3C2] bg-[#FAF6EE] px-4 py-3">
          <div className="text-xs text-stone-700">
            <strong className="font-bold text-[#2D1E12]">Kontrol Busur Gesek:</strong>{" "}
            Tahan &amp; geser mouse kiri-kanan di atas panggung 3D, atau tahan tombol gesek di samping.
          </div>
          <Button
            type="button"
            onMouseDown={() => {
              const note = instrument.notes[selectedPitchIdx] ?? instrument.notes[0];
              setIsBowingUI(true);
              bowStateRef.current = { active: true, pos: 0.65 };
              if (note) soundEngine.startContinuousVoice("bow", note.freq, 0.85);
            }}
            onMouseUp={() => {
              setIsBowingUI(false);
              bowStateRef.current.active = false;
              soundEngine.stopContinuousVoice();
            }}
            onMouseLeave={() => {
              if (isBowingUI) {
                setIsBowingUI(false);
                bowStateRef.current.active = false;
                soundEngine.stopContinuousVoice();
              }
            }}
            onTouchStart={() => {
              const note = instrument.notes[selectedPitchIdx] ?? instrument.notes[0];
              setIsBowingUI(true);
              bowStateRef.current = { active: true, pos: 0.65 };
              if (note) soundEngine.startContinuousVoice("bow", note.freq, 0.85);
            }}
            onTouchEnd={() => {
              setIsBowingUI(false);
              bowStateRef.current.active = false;
              soundEngine.stopContinuousVoice();
            }}
            className="btn-waranusa rounded-full px-5 text-xs font-bold text-white"
          >
            <Waves className="mr-1.5 h-3.5 w-3.5" />
            {isBowingUI ? "Sedang Menggesek Dawai..." : "Tahan untuk Gesek Dawai"}
          </Button>
        </div>
      )}

      {instrument.interactionType === "shake" && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#DFD3C2] bg-[#FAF6EE] px-4 py-3">
          <div className="text-xs text-stone-700">
            <strong className="font-bold text-[#2D1E12]">Kontrol Goyang Bambu:</strong>{" "}
            Gerakkan kursor cepat kiri-kanan di atas model 3D atau klik tombol goyang untuk memicu getaran tabung.
          </div>
          <Button
            type="button"
            onClick={() => playNoteByIndex(selectedPitchIdx, 0.95)}
            className="btn-waranusa rounded-full px-5 text-xs font-bold text-white"
          >
            <Sparkles className="mr-1.5 h-3.5 w-3.5" />
            Goyangkan {instrument.title}
          </Button>
        </div>
      )}

      {instrument.interactionType === "blow" && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#DFD3C2] bg-[#FAF6EE] px-4 py-3">
          <div className="flex-1 min-w-[200px] space-y-1">
            <div className="flex items-center justify-between text-xs">
              <strong className="font-bold text-[#2D1E12]">
                Tekanan Udara / Tiupan ({instrument.notes[selectedPitchIdx]?.label ?? "Nada 1"}):
              </strong>
              <span className="font-mono text-[11px] text-[#7A4B29]">
                {micBlowEnabled
                  ? `Sensor Mic: ${Math.round(micBlowLevel * 100)}%`
                  : isBlowingHold
                  ? "Meniup Aktif"
                  : "Siap Ditiup"}
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-stone-200">
              <div
                className="h-full bg-gradient-to-r from-[#6E472D] to-[#D49B27] transition-all duration-75"
                style={{
                  width: `${Math.max(
                    isBlowingHold ? 85 : 0,
                    Math.round(micBlowLevel * 100)
                  )}%`,
                }}
              />
            </div>
          </div>

          <Button
            type="button"
            onMouseDown={() => {
              const note = instrument.notes[selectedPitchIdx] ?? instrument.notes[0];
              setIsBlowingHold(true);
              blowEnergyRef.current = 0.85;
              if (note) soundEngine.startContinuousVoice("blow", note.freq, 0.88);
            }}
            onMouseUp={() => {
              setIsBlowingHold(false);
              blowEnergyRef.current = 0;
              soundEngine.stopContinuousVoice();
            }}
            onMouseLeave={() => {
              if (isBlowingHold) {
                setIsBlowingHold(false);
                blowEnergyRef.current = 0;
                soundEngine.stopContinuousVoice();
              }
            }}
            onTouchStart={() => {
              const note = instrument.notes[selectedPitchIdx] ?? instrument.notes[0];
              setIsBlowingHold(true);
              blowEnergyRef.current = 0.85;
              if (note) soundEngine.startContinuousVoice("blow", note.freq, 0.88);
            }}
            onTouchEnd={() => {
              setIsBlowingHold(false);
              blowEnergyRef.current = 0;
              soundEngine.stopContinuousVoice();
            }}
            className="btn-waranusa rounded-full px-5 text-xs font-bold text-white"
          >
            <Wind className="mr-1.5 h-3.5 w-3.5" />
            {isBlowingHold ? "Sedang Meniup..." : "Tahan untuk Tiup"}
          </Button>
        </div>
      )}

      {/* DERETAN 7 BILAH / TOMBOL NADA INTERAKTIF (UNTUK SEMUA INSTRUMEN) */}
      <div className="space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-stone-600">
          <div className="flex flex-wrap items-center gap-2">
            <span className="flex items-center gap-1.5 font-semibold text-[#2D1E12]">
              <Music2 className="h-3.5 w-3.5 text-[#6E472D]" />
              <span>
                Tangga Nada &amp; Laras ({instrument.notes.length} Tingkat Nada — Ketuk atau Tekan{" "}
                <kbd className="rounded border border-stone-300 bg-white px-1 py-0.5 font-mono text-[10px]">
                  1
                </kbd>
                –
                <kbd className="rounded border border-stone-300 bg-white px-1 py-0.5 font-mono text-[10px]">
                  {instrument.notes.length}
                </kbd>
                )
              </span>
            </span>

            {demoMode !== "idle" && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100/90 border border-amber-300/80 px-2.5 py-0.5 text-[10px] font-bold text-amber-900 animate-pulse">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-600" />
                <span>Memutar: {demoLabel}</span>
              </span>
            )}
          </div>

          {onVolumeChange && (
            <div className="flex items-center gap-2 min-w-[150px]">
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

        <div className="overflow-x-auto no-scrollbar pb-1.5 -mx-1 px-1 sm:mx-0 sm:px-0 sm:overflow-visible">
          <div
            className="grid gap-1.5 sm:gap-2.5 min-w-[320px] sm:min-w-0"
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
                    // Mencegah delay sentuh 300ms & mencegah trigger ganda (hanya 1 pemicu per ketukan fisik)
                    e.preventDefault();
                    e.stopPropagation();
                    stopDemo();
                    playNoteByIndex(idx, 0.95);
                  }}
                  className={cn(
                    "group relative flex flex-col items-center justify-between rounded-2xl border py-2.5 sm:py-3.5 px-1.5 sm:px-2 transition-all duration-150 cursor-pointer select-none touch-manipulation min-h-[70px] xs:min-h-[76px] sm:min-h-[82px] shadow-2xs",
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
                  {/* Efek visual ripple melingkar saat bilah nada terkena tabuhan (Air Tap / Pinch) */}
                  {isHitRippling && (
                    <span className="pointer-events-none absolute inset-0 -m-1 rounded-2xl border-2 border-amber-300 bg-amber-400/20 animate-ping" />
                  )}

                  {isCameraTarget && (
                    <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 rounded-full bg-amber-500 text-stone-950 px-2 py-0.5 text-[8.5px] font-extrabold shadow-sm uppercase tracking-wider">
                      🎯 Bidik
                    </span>
                  )}
                  <span className="font-mono text-[10px] xs:text-xs font-black uppercase tracking-wider text-[#7A4B29]">
                    {note.code}
                  </span>
                  <span className="my-0.5 font-serif text-sm xs:text-base sm:text-lg font-extrabold text-[#2D1E12] line-clamp-1 leading-tight">
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

// Void unused icons to prevent HMR issues
void Keyboard;
void MousePointerClick;
