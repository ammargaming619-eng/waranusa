"use client";

import React, { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import {
  FileImage,
  Cpu,
  Box,
  Layers,
  Sparkles,
  RotateCcw,
  Upload,
  CheckCircle2,
  ArrowRight,
  HelpCircle,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { type ShadingMode } from "./artifact-3d-stage";
import { Button } from "@/components/ui/button";

// Code splitting agresif: Stage Three.js dimuat secara dinamis saat terlihat di viewport
const Artifact3DStage = dynamic(
  () => import("./artifact-3d-stage").then((m) => m.Artifact3DStage),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[520px] rounded-2xl bg-[#F5EFE6]/70 border border-[#E7DECE] animate-pulse flex flex-col items-center justify-center text-[#8B5E3C] gap-3">
        <span className="h-8 w-8 rounded-full border-2 border-[#D97706] border-t-transparent animate-spin" />
        <p className="text-xs font-semibold">Menyiapkan Mesin 3D Laboratorium...</p>
      </div>
    ),
  }
);

interface StepDetail {
  id: number;
  numberStr: string;
  title: string;
  subtitle: string;
  summary: string;
  guideline: string;
  recommendedTools?: string[];
  icon: React.ComponentType<{ className?: string }>;
}

const DIGITALIZATION_STEPS: StepDetail[] = [
  {
    id: 1,
    numberStr: "01",
    title: "Siapkan Foto 2D (.PNG / .JPG)",
    subtitle: "Input Gambar Artefak Tunggal atau Multi-Sudut",
    summary:
      "Gunakan foto artefak format .png atau .jpg dengan latar bersih dan pencahayaan merata.",
    guideline:
      "Siapkan foto artefak 2D beresolusi tinggi (minimal 1024×1024 px). Gunakan format PNG dengan latar transparan atau JPG berlatar kontras polos tanpa bayangan tajam agar kecerdasan buatan dapat memisahkan siluet objek dari latar belakang dengan presisi tinggi.",
    recommendedTools: ["Kamera HP / DSLR", "Photoshop / Remove.bg", "Foto Studio Mini"],
    icon: FileImage,
  },
  {
    id: 2,
    numberStr: "02",
    title: "Konversi AI (2D to 3D Mesh)",
    subtitle: "Ekstraksi Kedalaman & Jaring Poligon Spasial",
    summary:
      "AI memprediksi kedalaman piksel 2D dan mengubahnya menjadi jutaan titik koordinat & jaring kawat poligon.",
    guideline:
      "Platform AI modern menganalisis foto 2D untuk mengestimasi kedalaman (depth map) dan merekonstruksi sisi belakang objek yang tak tampak di foto. AI menghasilkan Point Cloud (kumpulan koordinat ruang) lalu merajutnya menjadi jaring poligon 3D (Wireframe Mesh).",
    recommendedTools: ["Tripo3D AI", "Meshy AI", "CSM (Common Sense)", "Kiri Engine"],
    icon: Cpu,
  },
  {
    id: 3,
    numberStr: "03",
    title: "Ekspor & Uji Format .GLB",
    subtitle: "Kompresi Draco & Pengujian Model 3D Siap Web",
    summary:
      "Ekspor hasil ke format .glb berbobot ringan, lalu uji langsung di kanvas panggung WaraNusa.",
    guideline:
      "Format .GLB (glTF 2.0 Binary) adalah standar baku industri 3D web yang menggabungkan geometri, tekstur material, dan warna dalam satu berkas ringkas. Gunakan kompresi Draco agar ukuran berkas tetap di bawah 15 MB demi performa optimal dan cepat dibuka di perangkat seluler.",
    recommendedTools: ["Blender 3D", "gltf-pipeline / Draco", "Three.js Editor"],
    icon: Box,
  },
];

export default function ArtifactLab3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasIntersected, setHasIntersected] = useState<boolean>(false);
  const [isIntersecting, setIsIntersecting] = useState<boolean>(false);
  const [activeStep, setActiveStep] = useState<number>(1);
  const [shadingMode, setShadingMode] = useState<ShadingMode>("solid");
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);

  // State Interaktif Langkah 2: Rekonstruksi AI
  const [isReconstructingAI, setIsReconstructingAI] = useState<boolean>(false);
  const [aiProgress, setAiProgress] = useState<number>(100);

  // IntersectionObserver untuk Zero PageSpeed Impact & Suspensi Render GPU
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
        if (entry.isIntersecting) {
          setHasIntersected(true);
        }
      },
      {
        threshold: 0.1,
        rootMargin: "200px",
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  // Cleanup Object URL saat unmount atau ganti file
  useEffect(() => {
    return () => {
      if (uploadedUrl) {
        URL.revokeObjectURL(uploadedUrl);
      }
    };
  }, [uploadedUrl]);

  // Efek animasi progress rekonstruksi AI (Langkah 2)
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isReconstructingAI) {
      setAiProgress(0);
      interval = setInterval(() => {
        setAiProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsReconstructingAI(false);
            return 100;
          }
          return prev + 5;
        });
      }, 90);
    }
    return () => clearInterval(interval);
  }, [isReconstructingAI]);

  // Penyesuaian state kanvas saat berpindah langkah
  const handleSelectStep = (stepId: number) => {
    setActiveStep(stepId);
    if (stepId === 1) {
      setShadingMode("solid");
    } else if (stepId === 2) {
      setAiProgress(0); // Mulai dari point cloud
      setShadingMode("points");
    } else if (stepId === 3) {
      setShadingMode("solid");
    }
  };

  const handleFileUpload = (file: File) => {
    if (uploadedUrl) {
      URL.revokeObjectURL(uploadedUrl);
    }
    const objectUrl = URL.createObjectURL(file);
    setUploadedUrl(objectUrl);
  };

  const currentStep =
    DIGITALIZATION_STEPS.find((s) => s.id === activeStep) ??
    DIGITALIZATION_STEPS[0];

  return (
    <section
      ref={containerRef}
      aria-labelledby="artifact-lab-heading"
      className="relative w-full bg-gradient-to-b from-[#F6EFE5] via-[#F0E4D2] to-[#E9DCB8]/50 py-16 sm:py-24 border-t-2 border-b-2 border-[#D8C4AA] overflow-hidden"
    >
      {/* Aksen Latar Belakang Kartografi Halus Khusus Ruang Laboratorium */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-40 bg-[radial-gradient(#8C5E3C22_1px,transparent_1px)] bg-[size:24px_24px]"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* ================= KARTU KONTAINER UTAMA ================= */}
        <div className="rounded-3xl bg-white border-2 border-[#D8C4AA] shadow-[0_20px_60px_rgba(80,50,25,0.08)] p-6 sm:p-8 lg:p-10 min-h-[580px] relative z-10">
          {/* HEADER SEKSI */}
          <div className="max-w-3xl mb-8 sm:mb-10">
            <span className="bg-gradient-to-r from-[#F4E3D0] to-[#E8CFB0] text-[#5A3316] text-xs font-bold px-3.5 py-1.5 rounded-full uppercase tracking-wider inline-flex items-center gap-2 mb-3 border border-[#D5B792] shadow-2xs">
              <span>🔬</span>
              <span>Tutorial & Laboratorium Digital Interaktif</span>
            </span>

            <h2
              id="artifact-lab-heading"
              className="font-serif text-[#1C120C] font-extrabold text-2xl sm:text-3xl lg:text-4xl tracking-tight leading-snug"
            >
              Tutorial Konversi Foto 2D (PNG/JPG) Menjadi Objek 3D (.GLB)
            </h2>

            <p className="mt-3 text-sm sm:text-base text-[#473B32] font-normal leading-relaxed">
              Pelajari alur praktis langkah demi langkah mengubah citra gambar 2D biasa (.png / .jpg) menjadi model tiga dimensi (.glb) berbasis AI, lalu uji coba langsung pada panggung virtual WaraNusa.
            </p>
          </div>

          {/* ================= STRUKTUR RESPONSIF 2 KOLOM ================= */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
            {/* ---------------- KOLOM KIRI: EDUKASI & KONTROL INTERAKTIF ---------------- */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between pb-2 mb-3 border-b-2 border-[#E5D5C2]">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-[#783E15]">
                    Alur Tutorial Konversi 2D ke 3D
                  </span>
                  <span className="text-xs text-stone-500 font-bold bg-[#F4EBE0] px-2 py-0.5 rounded-md">
                    Langkah {activeStep} dari 3
                  </span>
                </div>

                {/* 3 Langkah Interaktif (Kartu Pilihan) */}
                <div className="space-y-3">
                  {DIGITALIZATION_STEPS.map((step) => {
                    const isActive = step.id === activeStep;
                    const IconComponent = step.icon;

                    return (
                      <button
                        key={step.id}
                        type="button"
                        onClick={() => handleSelectStep(step.id)}
                        className={cn(
                          "w-full text-left rounded-2xl p-4 transition-all cursor-pointer flex items-start gap-3.5",
                          isActive
                            ? "border-2 border-[#B45309] bg-gradient-to-br from-[#FFF9F0] to-[#FFF0DB] ring-2 ring-[#D97706]/35 shadow-sm text-stone-900"
                            : "border border-[#E0D0BB] bg-[#FCFBF8] hover:bg-white hover:border-[#B45309]/60 shadow-2xs text-stone-800"
                        )}
                      >
                        <div
                          className={cn(
                            "w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors shadow-2xs",
                            isActive
                              ? "bg-gradient-to-br from-[#D97706] to-[#B45309] text-white"
                              : "bg-[#F2E5D4] text-[#7A4B29]"
                          )}
                        >
                          <IconComponent className="h-4.5 w-4.5" />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span
                              className={cn(
                                "text-[11px] font-mono font-bold",
                                isActive ? "text-[#B45309]" : "text-stone-400"
                              )}
                            >
                              {step.numberStr}.
                            </span>
                            <h3 className="font-serif font-bold text-sm text-[#1C120C] truncate">
                              {step.title}
                            </h3>
                          </div>
                          <p className="text-xs text-[#52443A] mt-1 leading-relaxed">
                            {step.summary}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* PANEL INTERAKTIF & KONTROL REAL-TIME SESUAI LANGKAH AKTIF */}
              <div className="rounded-2xl border-2 border-[#D8C4AA] bg-gradient-to-br from-[#FAF5EC] to-[#F2E5D4] p-5 mt-2 shadow-2xs">
                <div className="flex items-center gap-2 text-xs font-extrabold text-[#783E15] uppercase tracking-wider mb-2">
                  <CheckCircle2 className="h-4 w-4 text-[#D97706]" />
                  <span>Panduan & Aksi: {currentStep.subtitle}</span>
                </div>
                <p className="text-xs sm:text-[13px] text-[#2C1D13] font-normal leading-relaxed mb-3.5">
                  {currentStep.guideline}
                </p>

                {/* REKOMENDASI TOOL / PERANGKAT */}
                {currentStep.recommendedTools && (
                  <div className="mb-3.5 flex flex-wrap items-center gap-1.5">
                    <span className="text-[10px] font-bold text-stone-600 uppercase tracking-wider mr-1">
                      Alat / Tool:
                    </span>
                    {currentStep.recommendedTools.map((tool, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] font-bold bg-white px-2.5 py-0.5 rounded-md border border-[#D5C2AA] text-[#6E3C17] shadow-2xs"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                )}

                {/* AKSI LANGKAH 1: PANDUAN GAMBAR 2D (.PNG / .JPG) */}
                {activeStep === 1 && (
                  <div className="pt-3 border-t-2 border-[#E5D5C2] space-y-3">
                    <div className="grid grid-cols-2 gap-2 text-[11px] bg-white p-3 rounded-xl border border-[#D8C4AA] shadow-2xs">
                      <div>
                        <span className="text-stone-500 block text-[10px] font-medium">Format Gambar</span>
                        <strong className="text-[#8B5E3C] font-bold">.PNG / .JPG / .WEBP</strong>
                      </div>
                      <div>
                        <span className="text-stone-500 block text-[10px] font-medium">Latar Belakang</span>
                        <strong className="text-stone-800 font-bold">Polos / Transparan</strong>
                      </div>
                    </div>
                    <p className="text-[11px] text-[#52443A] leading-relaxed">
                      💡 Tip AI: 1 foto tampak depan sudah cukup untuk AI Single-Image to 3D. Pastikan foto artefak tajam dan tidak blur sebelum melangkah ke konversi AI.
                    </p>
                    <Button
                      type="button"
                      onClick={() => handleSelectStep(2)}
                      className="w-full bg-[#1E0F07] hover:bg-[#381C0E] text-white rounded-xl font-bold px-4 py-2.5 text-xs shadow-md flex items-center justify-center gap-1.5 cursor-pointer active:scale-[0.98] transition-all"
                    >
                      <span>Lanjut ke Langkah 02: Konversi AI</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                )}

                {/* AKSI LANGKAH 2: KONTROL KONVERSI AI 2D TO 3D MESH */}
                {activeStep === 2 && (
                  <div className="pt-3 border-t-2 border-[#E5D5C2] space-y-3">
                    <Button
                      type="button"
                      onClick={() => setIsReconstructingAI(true)}
                      disabled={isReconstructingAI}
                      className="w-full bg-gradient-to-r from-[#D97706] via-[#C86400] to-[#B45309] hover:from-[#B45309] hover:to-[#92400E] text-white rounded-xl font-bold px-4 py-2.5 text-xs shadow-md flex items-center justify-center gap-1.5 cursor-pointer active:scale-[0.98] transition-all"
                    >
                      <Sparkles className="h-3.5 w-3.5 text-yellow-200" />
                      <span>
                        {isReconstructingAI
                          ? "AI Sedang Mengalkulasi Poligon..."
                          : "⚡ Jalankan Simulasi Konversi AI (2D → 3D)"}
                      </span>
                    </Button>

                    {/* Progress Bar Animasi */}
                    <div className="space-y-1.5 bg-white p-3 rounded-xl border border-[#D8C4AA] shadow-2xs">
                      <div className="flex justify-between text-[11px] font-extrabold text-stone-800">
                        <span>Status Konversi 2D ke 3D:</span>
                        <span className="text-[#B45309] font-mono">{aiProgress}%</span>
                      </div>
                      <div className="w-full h-2.5 bg-stone-200 rounded-full overflow-hidden p-0.5">
                        <div
                          className="h-full bg-gradient-to-r from-amber-500 to-amber-600 rounded-full transition-all duration-150"
                          style={{ width: `${aiProgress}%` }}
                        />
                      </div>
                      <p className="text-[10px] text-[#52443A] font-medium pt-0.5">
                        {aiProgress < 40
                          ? "Fase 1: Menganalisis piksel 2D & mengekstrak koordinat ruang (Point Cloud)..."
                          : aiProgress < 85
                          ? "Fase 2: Menghubungkan titik kedalaman menjadi jaring kawat (Wireframe Mesh)..."
                          : "Fase 3: Jaring 3D poligon berhasil dibentuk (18.420 poligon siap diekspor)!"}
                      </p>
                    </div>

                    <Button
                      type="button"
                      onClick={() => handleSelectStep(3)}
                      className="w-full bg-[#1E0F07] hover:bg-[#381C0E] text-white rounded-xl font-bold px-4 py-2.5 text-xs shadow-md flex items-center justify-center gap-1.5 cursor-pointer active:scale-[0.98] transition-all"
                    >
                      <span>Lanjut ke Langkah 03: Ekspor & Uji .GLB</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                )}

                {/* AKSI LANGKAH 3: PANDUAN EKSPOR & PENGUJIAN FORMAT .GLB */}
                {activeStep === 3 && (
                  <div className="pt-3 border-t-2 border-[#E5D5C2] space-y-3">
                    <div className="grid grid-cols-2 gap-2 text-[11px] bg-white p-3 rounded-xl border border-[#D8C4AA] shadow-2xs">
                      <div>
                        <span className="text-stone-500 block text-[10px] font-medium">Format Berkas</span>
                        <strong className="text-[#8B5E3C] font-bold">.GLB (glTF Binary)</strong>
                      </div>
                      <div>
                        <span className="text-stone-500 block text-[10px] font-medium">Kompresi Draco</span>
                        <strong className="text-emerald-700 font-bold">&lt; 15 MB (Optimal)</strong>
                      </div>
                    </div>
                    <p className="text-[11px] text-[#473B32] font-normal leading-relaxed">
                      Hasil model 3D kini tampil penuh dalam mode Solid PBR. Anda dapat memutar bebas objek di kanvas atau menyeret berkas <strong className="text-[#8B5E3C] font-bold">.glb</strong> hasil konversi buatan Anda sendiri pada kotak dropzone di bawah kanvas.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* ---------------- KOLOM KANAN: PERAGAAN TIGA DIMENSI REAL-TIME ---------------- */}
            <div className="lg:col-span-7 flex flex-col justify-between">
              {hasIntersected ? (
                <Artifact3DStage
                  activeStep={activeStep}
                  shadingMode={shadingMode}
                  onShadingChange={setShadingMode}
                  uploadedModelUrl={uploadedUrl}
                  onFileUpload={handleFileUpload}
                  isReconstructingAI={isReconstructingAI}
                  aiProgress={aiProgress}
                  isIntersecting={isIntersecting}
                />
              ) : (
                <div className="w-full h-full min-h-[360px] sm:min-h-[430px] lg:min-h-[480px] rounded-2xl bg-[#FAF6EE] border-2 border-[#D4C1A9] flex flex-col items-center justify-center p-6 text-center">
                  <span className="w-10 h-10 rounded-full bg-[#F5EBE1] text-[#8B5E3C] flex items-center justify-center text-lg mb-3">
                    🔬
                  </span>
                  <p className="font-serif font-bold text-stone-800 text-sm sm:text-base">
                    Panggung 3D Sandbox Siap Dimuat
                  </p>
                  <p className="text-xs text-stone-600 mt-1 max-w-xs leading-relaxed">
                    Kanvas Three.js akan diinisialisasi otomatis saat Anda men-scroll bagian ini untuk menjaga kecepatan halaman web.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}