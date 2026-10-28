import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
  image?: {
    data: string;
    mimeType: string;
  };
}

const DEFAULT_SYSTEM_INSTRUCTION_ID =
  "Anda adalah WaraNusa AI Assistant, kurator dan pakar kebudayaan Indonesia. Jawab pertanyaan pengguna secara akurat, ramah, dan berwawasan mendalam mengenai tradisi, arsitektur vernakular, instrumen musik, dan filosofi 38 provinsi Nusantara sesuai topik yang ditanyakan.";

const DEFAULT_SYSTEM_INSTRUCTION_EN =
  "You are WaraNusa AI Assistant, an Indonesian living heritage curator and cultural expert. Answer user questions accurately, warmly, and with deep insight regarding traditions, vernacular architecture, musical instruments, and the philosophies of Indonesia's 38 provinces according to the topic asked.";

const STABLE_ERROR_NOTICE_ID =
  "Koneksi asisten AI sedang tidak stabil. Silakan coba beberapa saat lagi.";

const STABLE_ERROR_NOTICE_EN =
  "The AI assistant connection is currently unstable. Please try again in a moment.";

// Ambil konteks katalog budaya dari database secara aman (opsional)
async function getCulturalCatalogContext(): Promise<string> {
  try {
    const items = await db.culturalItem.findMany({
      where: { status: "PUBLISHED" },
      select: {
        title: true,
        summary: true,
        meaning: true,
        category: { select: { name: true } },
        region: { select: { name: true } },
      },
      take: 12,
    });

    if (!items || items.length === 0) return "";

    let context = "\n\nKonteks Katalog Terverifikasi WaraNusa:\n";
    for (const item of items) {
      context += `- ${item.title} (${item.category.name} - ${item.region.name}): ${item.summary}\n`;
    }
    return context;
  } catch {
    return "";
  }
}

export async function POST(req: NextRequest) {
  let isEnglish = false;
  try {
    const body = await req.json();
    const { messages, language = "ID" } = body as {
      messages?: ChatMessage[];
      language?: "ID" | "EN";
    };

    isEnglish = language === "EN";

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "Format request tidak valid. Array messages diperlukan." },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;

    // Jika API Key tidak tersedia, tampilkan pesan ramah standar
    if (!apiKey || !apiKey.trim()) {
      return NextResponse.json({
        role: "assistant",
        content: isEnglish ? STABLE_ERROR_NOTICE_EN : STABLE_ERROR_NOTICE_ID,
      });
    }

    // Bangun instruksi sistem
    const catalogContext = await getCulturalCatalogContext();
    const systemPrompt =
      (isEnglish ? DEFAULT_SYSTEM_INSTRUCTION_EN : DEFAULT_SYSTEM_INSTRUCTION_ID) +
      catalogContext;

    // Format pesan untuk Gemini Multimodal (gemini-1.5-flash)
    const geminiContents = messages
      .filter((m) => m.role === "user" || m.role === "assistant")
      .map((m) => {
        const role = m.role === "assistant" ? "model" : "user";
        const parts: Array<{
          text?: string;
          inlineData?: { mimeType: string; data: string };
        }> = [];

        // Tangani jika ada lampiran foto (Base64)
        if (m.image?.data && m.image?.mimeType) {
          const cleanBase64 = m.image.data.includes(",")
            ? m.image.data.split(",")[1]
            : m.image.data;

          parts.push({
            inlineData: {
              mimeType: m.image.mimeType,
              data: cleanBase64,
            },
          });
        }

        const trimmedContent = m.content?.trim();
        if (trimmedContent) {
          parts.push({ text: trimmedContent });
        } else if (parts.length > 0 && !parts.some((p) => p.text)) {
          // Jika pengguna mengirimkan foto tanpa teks keterangan
          parts.push({
            text: isEnglish
              ? "Identify the Indonesian cultural heritage object in this photo. Explain its name, province/ethnic origin, traditional function, and visual signatures."
              : "Identifikasi objek warisan budaya Nusantara pada foto ini. Jelaskan nama objek, asal provinsi/suku, fungsi tradisional, dan ciri khas visualnya.",
          });
        }

        return { role, parts };
      })
      .filter((c) => c.parts.length > 0);

    if (geminiContents.length === 0) {
      geminiContents.push({
        role: "user",
        parts: [
          {
            text: isEnglish
              ? "Hello WaraNusa AI Assistant."
              : "Halo WaraNusa AI Assistant.",
          },
        ],
      });
    }

    let aiReplyText = "";
    const candidateModels = [
      "gemini-1.5-flash",
      "gemini-flash-lite-latest",
      "gemini-flash-latest",
      "gemini-2.5-flash",
    ];

    // 1. Coba menggunakan SDK resmi @google/generative-ai bila tersedia
    let sdkSuccess = false;
    try {
      const { GoogleGenerativeAI } = await import("@google/generative-ai");
      const genAI = new GoogleGenerativeAI(apiKey);
      for (const mName of candidateModels) {
        try {
          const model = genAI.getGenerativeModel({
            model: mName,
            systemInstruction: systemPrompt,
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 1400,
            },
          });

          const response = await model.generateContent({
            contents: geminiContents,
          });

          const text = response.response.text();
          if (text && text.trim()) {
            aiReplyText = text.trim();
            sdkSuccess = true;
            break;
          }
        } catch {}
      }
    } catch (sdkError) {
      sdkSuccess = false;
    }

    // 2. Jika SDK belum memproses, gunakan panggilan REST API resmi Google Generative Language
    if (!sdkSuccess) {
      const restPayload = {
        systemInstruction: {
          parts: [{ text: systemPrompt }],
        },
        contents: geminiContents,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1400,
        },
      };

      for (const mName of candidateModels) {
        try {
          const restResponse = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${mName}:generateContent?key=${apiKey}`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "x-goog-api-key": apiKey,
              },
              body: JSON.stringify(restPayload),
            }
          );

          if (restResponse.ok) {
            const data = await restResponse.json();
            const text = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
            if (text) {
              aiReplyText = text;
              break;
            }
          }
        } catch {}
      }
    }

    if (!aiReplyText) {
      return NextResponse.json({
        role: "assistant",
        content: isEnglish ? STABLE_ERROR_NOTICE_EN : STABLE_ERROR_NOTICE_ID,
      });
    }

    return NextResponse.json({
      role: "assistant",
      content: aiReplyText,
    });
  } catch (error) {
    console.error("[WaraNusa AI Chat Route Error]:", error);
    return NextResponse.json({
      role: "assistant",
      content: isEnglish ? STABLE_ERROR_NOTICE_EN : STABLE_ERROR_NOTICE_ID,
    });
  }
}
