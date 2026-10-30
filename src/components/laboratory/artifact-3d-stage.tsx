"use client";

import React, { useRef, useState, useEffect, useMemo } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import {
  RotateCcw,
  Sun,
  SunMedium,
  Moon,
  Upload,
  FileCheck,
  Eye,
  Grid3X3,
  Dot,
  Camera,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type ShadingMode = "solid" | "wireframe" | "points";
export type LightPreset = "daylight" | "warm" | "studio";

interface Artifact3DStageProps {
  activeStep: number;
  shadingMode: ShadingMode;
  onShadingChange: (mode: ShadingMode) => void;
  uploadedModelUrl: string | null;
  onFileUpload: (file: File) => void;
  isReconstructingAI: boolean;
  aiProgress: number;
  isIntersecting?: boolean;
}

/**
 * Objek 3D Prosedural Miniatur Stupa Candi Borobudur Nusantara
 * Berfungsi sebagai safe fallback jika file .glb belum dimuat atau saat dalam mode rekonstruksi
 */
function ProceduralStupaArtifact({
  shadingMode,
  aiProgress = 100,
  step = 3,
}: {
  shadingMode: ShadingMode;
  aiProgress?: number;
  step?: number;
}) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current && step !== 1) {
      groupRef.current.rotation.y += delta * 0.2;
    }
  });

  // Di Langkah 2: Sebelum AI selesai, tampilkan transisi partikel point-cloud -> wireframe
  const effectiveShading: ShadingMode =
    step === 2
      ? aiProgress < 50
        ? "points"
        : "wireframe"
      : shadingMode;

  const materialProps = useMemo(() => {
    return {
      color: "#E2A83B",
      metalness: 0.6,
      roughness: 0.25,
      wireframe: effectiveShading === "wireframe",
    };
  }, [effectiveShading]);

  const baseMaterialProps = useMemo(() => {
    return {
      color: "#8B6543",
      metalness: 0.45,
      roughness: 0.5,
      wireframe: effectiveShading === "wireframe",
    };
  }, [effectiveShading]);

  if (effectiveShading === "points") {
    return (
      <group ref={groupRef} position={[0, -0.6, 0]}>
        <points position={[0, 0.15, 0]}>
          <cylinderGeometry args={[1.55, 1.75, 0.3, 36, 6]} />
          <pointsMaterial color="#D97706" size={0.035} sizeAttenuation />
        </points>
        <points position={[0, 0.45, 0]}>
          <cylinderGeometry args={[1.25, 1.45, 0.3, 36, 6]} />
          <pointsMaterial color="#D97706" size={0.035} sizeAttenuation />
        </points>
        <points position={[0, 1.15, 0]}>
          <sphereGeometry args={[0.92, 36, 28, 0, Math.PI * 2, 0, Math.PI * 0.75]} />
          <pointsMaterial color="#FBBF24" size={0.04} sizeAttenuation />
        </points>
        <points position={[0, 2.05, 0]}>
          <cylinderGeometry args={[0.06, 0.16, 0.85, 20, 10]} />
          <pointsMaterial color="#FDE68A" size={0.04} sizeAttenuation />
        </points>
        <points position={[0, 2.48, 0]}>
          <sphereGeometry args={[0.12, 16, 16]} />
          <pointsMaterial color="#FFFBEB" size={0.045} sizeAttenuation />
        </points>
      </group>
    );
  }

  return (
    <group ref={groupRef} position={[0, -0.6, 0]}>
      {/* 1. Lapik Bawah Padmasana Bertingkat */}
      <mesh position={[0, 0.12, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.55, 1.75, 0.24, 48]} />
        <meshStandardMaterial {...baseMaterialProps} />
      </mesh>
      <mesh position={[0, 0.36, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.28, 1.48, 0.24, 48]} />
        <meshStandardMaterial {...baseMaterialProps} />
      </mesh>
      <mesh position={[0, 0.58, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.08, 1.22, 0.2, 48]} />
        <meshStandardMaterial {...baseMaterialProps} />
      </mesh>

      {/* 2. Genta Kubah Utama Stupa (Andah) */}
      <mesh position={[0, 1.15, 0]} castShadow receiveShadow>
        <sphereGeometry args={[0.92, 48, 36, 0, Math.PI * 2, 0, Math.PI * 0.75]} />
        <meshStandardMaterial {...materialProps} />
      </mesh>

      {/* 3. Sabuk Relief Melingkar */}
      <mesh position={[0, 0.85, 0]} castShadow>
        <torusGeometry args={[0.9, 0.05, 16, 64]} />
        <meshStandardMaterial color="#B45309" metalness={0.7} roughness={0.2} wireframe={effectiveShading === "wireframe"} />
      </mesh>

      {/* 4. Harmika (Leher Persegi) */}
      <mesh position={[0, 1.62, 0]} castShadow>
        <boxGeometry args={[0.38, 0.18, 0.38]} />
        <meshStandardMaterial color="#B45309" metalness={0.5} roughness={0.3} wireframe={effectiveShading === "wireframe"} />
      </mesh>

      {/* 5. Yashti & Payung Chhatra Keemasan */}
      <mesh position={[0, 2.05, 0]} castShadow>
        <cylinderGeometry args={[0.05, 0.14, 0.72, 32]} />
        <meshStandardMaterial {...materialProps} color="#F59E0B" />
      </mesh>
      {[1.82, 1.95, 2.08, 2.21].map((y, idx) => (
        <mesh key={idx} position={[0, y, 0]} castShadow>
          <cylinderGeometry args={[0.22 - idx * 0.035, 0.24 - idx * 0.035, 0.04, 32]} />
          <meshStandardMaterial {...materialProps} color="#FBBF24" />
        </mesh>
      ))}

      {/* 6. Mustika Puncak Keemasan */}
      <mesh position={[0, 2.48, 0]} castShadow>
        <sphereGeometry args={[0.1, 24, 24]} />
        <meshStandardMaterial color="#FFFBEB" emissive="#D97706" emissiveIntensity={0.4} metalness={0.8} roughness={0.15} wireframe={effectiveShading === "wireframe"} />
      </mesh>

      {/* Cincin Bayangan Landasan */}
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <ringGeometry args={[1.75, 2.1, 48]} />
        <meshBasicMaterial color="#78350F" transparent opacity={0.12} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

/**
 * Loader Model GLB Nyata dengan Penanganan Galat & Fallback Otomatis
 */
function RealGlbModel({
  url,
  shadingMode,
  step = 3,
  aiProgress = 100,
  onError,
}: {
  url: string;
  shadingMode: ShadingMode;
  step?: number;
  aiProgress?: number;
  onError?: () => void;
}) {
  const [modelScene, setModelScene] = useState<THREE.Group | null>(null);
  const [pointCloud, setPointCloud] = useState<THREE.Points | null>(null);
  const groupRef = useRef<THREE.Group>(null);

  useEffect(() => {
    let isMounted = true;
    const loader = new GLTFLoader();
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("https://www.gstatic.com/draco/versioned/decoders/1.5.7/");
    loader.setDRACOLoader(dracoLoader);

    loader.load(
      url,
      (gltf) => {
        if (!isMounted) return;
        const scene = gltf.scene;

        const box = new THREE.Box3().setFromObject(scene);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());

        const maxDim = Math.max(size.x, size.y, size.z) || 1;
        const scale = 2.4 / maxDim;
        scene.scale.setScalar(scale);

        scene.position.x = -center.x * scale;
        scene.position.y = -box.min.y * scale - 0.7;
        scene.position.z = -center.z * scale;

        // Siapkan juga versi Point Cloud untuk Langkah 2
        const pointsPositions: number[] = [];
        scene.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            mesh.castShadow = true;
            mesh.receiveShadow = true;

            const posAttr = mesh.geometry.attributes.position;
            if (posAttr) {
              const worldMat = mesh.matrixWorld;
              const v = new THREE.Vector3();
              for (let i = 0; i < posAttr.count; i += 3) {
                v.fromBufferAttribute(posAttr, i);
                v.applyMatrix4(worldMat);
                pointsPositions.push(v.x, v.y, v.z);
              }
            }
          }
        });

        if (pointsPositions.length > 0) {
          const ptGeo = new THREE.BufferGeometry();
          ptGeo.setAttribute(
            "position",
            new THREE.Float32BufferAttribute(pointsPositions, 3)
          );
          const ptMat = new THREE.PointsMaterial({
            color: "#F59E0B",
            size: 0.035,
            sizeAttenuation: true,
          });
          const pts = new THREE.Points(ptGeo, ptMat);
          setPointCloud(pts);
        }

        setModelScene(scene);
      },
      undefined,
      (err) => {
        if (!isMounted) return;
        console.warn("Model GLB gagal dimuat, beralih ke fallback prosedural:", err);
        onError?.();
      }
    );

    return () => {
      isMounted = false;
      dracoLoader.dispose();
    };
  }, [url]);

  useFrame((_, delta) => {
    if (groupRef.current && step !== 1) {
      groupRef.current.rotation.y += delta * 0.18;
    }
  });

  const effectiveShading: ShadingMode =
    step === 2
      ? aiProgress < 50
        ? "points"
        : "wireframe"
      : shadingMode;

  useEffect(() => {
    if (!modelScene) return;
    modelScene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        if (mesh.material) {
          const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
          mats.forEach((mat) => {
            if ("wireframe" in mat) {
              (mat as THREE.MeshStandardMaterial).wireframe =
                effectiveShading === "wireframe";
            }
          });
        }
      }
    });
  }, [modelScene, effectiveShading]);

  if (!modelScene) return null;

  if (effectiveShading === "points" && pointCloud) {
    return (
      <group ref={groupRef}>
        <primitive object={pointCloud} />
      </group>
    );
  }

  return (
    <group ref={groupRef}>
      <primitive object={modelScene} />
    </group>
  );
}

export function Artifact3DStage({
  activeStep,
  shadingMode,
  onShadingChange,
  uploadedModelUrl,
  onFileUpload,
  isReconstructingAI,
  aiProgress,
  isIntersecting = true,
}: Artifact3DStageProps) {
  const controlsRef = useRef<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [lightPreset, setLightPreset] = useState<LightPreset>("daylight");
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [glbError, setGlbError] = useState(false);

  const resetCamera = () => {
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  };

  const cycleLighting = () => {
    if (lightPreset === "daylight") setLightPreset("warm");
    else if (lightPreset === "warm") setLightPreset("studio");
    else setLightPreset("daylight");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFileName(file.name);
      onFileUpload(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file && (file.name.endsWith(".glb") || file.name.endsWith(".gltf"))) {
      setUploadedFileName(file.name);
      onFileUpload(file);
    }
  };

  const targetGlbUrl = uploadedModelUrl || (!glbError ? "/models/borobudur.glb" : null);

  return (
    <div className="flex flex-col h-full justify-between relative">
      {/* ================= KANVAS 3D INTERAKTIF ================= */}
      <div className="relative w-full aspect-[4/3] sm:aspect-auto h-[320px] xs:h-[360px] sm:h-[430px] lg:h-[480px] rounded-2xl overflow-hidden bg-gradient-to-b from-[#F9F4EB] via-[#F3E7D5] to-[#EBE0CE] border-2 border-[#D4C1A9] shadow-[inset_0_2px_14px_rgba(110,71,45,0.08)] select-none">
        {/* Tombol Kontrol Cepat di Sudut Kanan Atas */}
        <div className="absolute top-3.5 right-3.5 z-20 flex items-center gap-1.5 bg-white/95 backdrop-blur-md px-2 py-1 rounded-full border-2 border-[#D4C1A9] shadow-xs">
          <button
            type="button"
            onClick={resetCamera}
            className="rounded-full min-h-[44px] min-w-[44px] flex items-center justify-center text-stone-700 hover:text-stone-950 hover:bg-stone-100 transition-colors cursor-pointer"
            title="Reset Sudut Pandang Kamera"
            aria-label="Reset Sudut Pandang Kamera 3D"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={cycleLighting}
            className="rounded-full min-h-[44px] min-w-[44px] px-2.5 flex items-center justify-center gap-1 text-xs font-bold text-stone-700 hover:text-stone-950 hover:bg-stone-100 transition-colors cursor-pointer"
            title="Ubah Preset Pencahayaan Studio"
            aria-label="Ubah Preset Pencahayaan Studio"
          >
            {lightPreset === "daylight" && <Sun className="h-4 w-4 text-amber-600" />}
            {lightPreset === "warm" && <SunMedium className="h-4 w-4 text-orange-600" />}
            {lightPreset === "studio" && <Moon className="h-4 w-4 text-stone-800" />}
            <span className="hidden xs:inline capitalize">{lightPreset}</span>
          </button>
        </div>

        {/* Status Mode & Objek Aktif di Kiri Atas */}
        <div className="absolute top-3.5 left-3.5 z-20 pointer-events-none flex flex-col gap-1.5">
          <div className="bg-white/95 backdrop-blur-sm border-2 border-[#D4C1A9] px-3.5 py-1 rounded-full text-[11px] font-bold text-[#6E3C17] shadow-xs inline-flex items-center gap-1.5">
            {uploadedFileName ? (
              <span className="flex items-center gap-1.5 truncate max-w-[200px]">
                <FileCheck className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                {uploadedFileName}
              </span>
            ) : !glbError ? (
              <span>🏛️ Candi Borobudur (Model 3D Nyata)</span>
            ) : (
              <span>✨ Stupa Borobudur (Cadangan Prosedural 3D)</span>
            )}
          </div>

          {/* Badge Khusus Berdasarkan Langkah Tutorial */}
          {activeStep === 1 && (
            <div className="bg-[#6E3C17] text-white backdrop-blur-sm px-3 py-1 rounded-full text-[11px] font-bold shadow-xs inline-flex items-center gap-1.5">
              <span>🖼️ Langkah 1: Input Foto 2D (.PNG / .JPG)</span>
            </div>
          )}

          {activeStep === 2 && (
            <div className="bg-gradient-to-r from-[#D97706] to-[#B45309] text-white backdrop-blur-sm px-3.5 py-1 rounded-full text-[11px] font-mono font-extrabold shadow-xs inline-flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-yellow-200" />
              <span>
                {aiProgress < 100
                  ? `AI 2D→3D: ${aiProgress}% Jaring Mesh...`
                  : "Status: 18.420 Poligon Mesh Selesai ✓"}
              </span>
            </div>
          )}

          {activeStep === 3 && (
            <div className="bg-[#1E0F07] text-amber-300 backdrop-blur-sm px-3 py-1 rounded-full text-[11px] font-bold shadow-xs inline-flex items-center gap-1.5">
              <span>📦 Langkah 3: Siap Ekspor & Diuji (.GLB)</span>
            </div>
          )}
        </div>

        {/* Kanvas Three.js */}
        <Canvas
          shadows
          frameloop={isIntersecting ? "always" : "never"}
          dpr={[1, 1.5]}
          gl={{
            powerPreference: "high-performance",
            antialias: true,
            alpha: true,
            preserveDrawingBuffer: false,
          }}
          camera={{ position: [0, 1.35, 4.2], fov: 45 }}
          className="w-full h-full cursor-grab active:cursor-grabbing touch-none"
        >
          {/* Pencahayaan Studio Dipertajam (Gacor & Kontras Tajam) */}
          {lightPreset === "daylight" && (
            <>
              <ambientLight intensity={1.15} />
              <directionalLight
                position={[5, 9, 6]}
                intensity={2.2}
                castShadow
                shadow-mapSize-width={1024}
                shadow-mapSize-height={1024}
              />
              <directionalLight position={[-4, 4, -3]} intensity={0.9} color="#FFEEDD" />
              <directionalLight position={[0, -3, 2]} intensity={0.5} color="#F5E6D3" />
            </>
          )}

          {lightPreset === "warm" && (
            <>
              <ambientLight intensity={0.95} color="#FFF2DB" />
              <directionalLight
                position={[4, 8, 5]}
                intensity={2.6}
                color="#FBBF24"
                castShadow
              />
              <pointLight position={[-3, 3, -2]} intensity={1.2} color="#EA580C" />
              <directionalLight position={[0, -3, 2]} intensity={0.6} color="#FED7AA" />
            </>
          )}

          {lightPreset === "studio" && (
            <>
              <ambientLight intensity={0.65} />
              <directionalLight position={[0, 10, 6]} intensity={2.8} castShadow />
              <directionalLight position={[6, 2, -4]} intensity={1.2} color="#38BDF8" />
              <directionalLight position={[-6, 2, -4]} intensity={1.2} color="#F59E0B" />
              <directionalLight position={[0, -4, 2]} intensity={0.6} color="#FFFFFF" />
            </>
          )}

          {/* Model 3D: Coba muat GLB asli atau alihkan ke Prosedural */}
          {targetGlbUrl ? (
            <RealGlbModel
              url={targetGlbUrl}
              shadingMode={shadingMode}
              step={activeStep}
              aiProgress={aiProgress}
              onError={() => setGlbError(true)}
            />
          ) : (
            <ProceduralStupaArtifact
              shadingMode={shadingMode}
              step={activeStep}
              aiProgress={aiProgress}
            />
          )}

          {/* OrbitControls */}
          <OrbitControls
            ref={controlsRef}
            enablePan={true}
            enableZoom={true}
            minDistance={1.8}
            maxDistance={8}
            maxPolarAngle={Math.PI / 2 + 0.08}
          />
        </Canvas>

        {/* Petunjuk Navigasi Bawah */}
        <div className="absolute bottom-2.5 inset-x-0 text-center pointer-events-none">
          <span className="text-[10px] sm:text-xs text-stone-700 font-medium bg-white/90 backdrop-blur-xs px-3 py-1 rounded-full border border-stone-300 shadow-2xs">
            🖱️ Putar 360° • Gulir untuk Zoom • Klik kanan / dua jari untuk Geser
          </span>
        </div>
      </div>

      {/* ================= MODE SWITCHER SHADING (SELALU TAMPIL) ================= */}
      <div className="mt-3.5 flex items-center justify-between gap-2 p-1.5 bg-[#EFE3D2] rounded-xl border-2 border-[#D4C1A9] shadow-2xs">
        <span className="text-xs font-extrabold text-[#5A3316] px-2.5 hidden sm:inline">
          Mode Shading:
        </span>

        <div className="flex items-center gap-1.5 flex-1 sm:flex-initial">
          <button
            type="button"
            onClick={() => onShadingChange("solid")}
            aria-label="Mode Shading Solid PBR"
            className={cn(
              "flex-1 sm:flex-initial min-h-[44px] px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer",
              shadingMode === "solid"
                ? "bg-[#1E0F07] text-[#FDE68A] shadow-md ring-1 ring-amber-400/50"
                : "text-[#4A3B32] hover:text-[#1C120C] hover:bg-white/60"
            )}
          >
            <Eye className="h-3.5 w-3.5" />
            <span>✨ Solid</span>
          </button>

          <button
            type="button"
            onClick={() => onShadingChange("wireframe")}
            aria-label="Mode Shading Jaring Wireframe"
            className={cn(
              "flex-1 sm:flex-initial min-h-[44px] px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer",
              shadingMode === "wireframe"
                ? "bg-[#1E0F07] text-[#FDE68A] shadow-md ring-1 ring-amber-400/50"
                : "text-[#4A3B32] hover:text-[#1C120C] hover:bg-white/60"
            )}
          >
            <Grid3X3 className="h-3.5 w-3.5" />
            <span>🕸️ Wireframe</span>
          </button>

          <button
            type="button"
            onClick={() => onShadingChange("points")}
            aria-label="Mode Shading Titik Poligon"
            className={cn(
              "flex-1 sm:flex-initial min-h-[44px] px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer",
              shadingMode === "points"
                ? "bg-[#1E0F07] text-[#FDE68A] shadow-md ring-1 ring-amber-400/50"
                : "text-[#4A3B32] hover:text-[#1C120C] hover:bg-white/60"
            )}
          >
            <Dot className="h-3.5 w-3.5" />
            <span>📐 Titik Poligon</span>
          </button>
        </div>
      </div>

      {/* ================= AREA DROPZONE UPLOAD FILE NYATA (SELALU TAMPIL) ================= */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".glb,.gltf"
        onChange={handleFileChange}
        className="hidden"
      />

      <div
        role="button"
        tabIndex={0}
        aria-label="Unggah atau seret berkas model 3D berekstensi glb atau gltf"
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            fileInputRef.current?.click();
          }
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={cn(
          "border-2 border-dashed rounded-2xl p-4 text-center mt-3.5 transition-all cursor-pointer shadow-2xs min-h-[64px]",
          isDragOver
            ? "border-[#D97706] bg-[#FFF8EE]"
            : "border-[#BCA78F] hover:border-[#8B5E3C] bg-white/80 hover:bg-white"
        )}
      >
        <div className="flex flex-col items-center justify-center gap-1.5">
          <div className="w-8 h-8 rounded-full bg-[#F5EBE1] flex items-center justify-center text-[#8B5E3C] shadow-2xs">
            <Upload className="h-4 w-4" />
          </div>
          <div>
            <p className="text-xs font-bold text-stone-900">
              Tarik & Letakkan Berkas 3D atau{" "}
              <span className="text-[#8B5E3C] underline underline-offset-2">
                Pilih File 3D (.glb / .gltf)
              </span>
            </p>
            <p className="text-[11px] text-[#52443A] font-medium mt-0.5">
              Ukuran ideal di bawah 15 MB. Berkas diproses lokal di peramban tanpa disimpan ke server.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}