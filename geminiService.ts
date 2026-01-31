
import { GoogleGenAI, Type } from "@google/genai";
import { BookContent } from "./types";

const MODEL_NAME = 'gemini-3-flash-preview';

// Helper function untuk memberikan jeda waktu
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Membungkus pemanggilan API dengan logika retry jika terkena rate limit (429)
 */
async function callGeminiWithRetry(
  ai: GoogleGenAI, 
  params: any, 
  maxRetries = 3
): Promise<any> {
  let lastError: any;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await ai.models.generateContent(params);
    } catch (error: any) {
      lastError = error;
      const isQuotaError = error.message?.includes("429") || error.message?.toLowerCase().includes("quota");
      
      if (isQuotaError && attempt < maxRetries) {
        // Tunggu lebih lama setiap kali gagal (Exponential Backoff)
        // Percobaan 1: tunggu 5s, Percobaan 2: tunggu 10s
        const waitTime = attempt * 5000;
        console.warn(`Kuota terlampaui. Mencoba lagi dalam ${waitTime/1000} detik (Percobaan ${attempt}/${maxRetries})...`);
        await sleep(waitTime);
        continue;
      }
      throw error;
    }
  }
  throw lastError;
}

export async function generateBookManuscript(
  title: string, 
  author: string,
  onProgress: (status: string) => void
): Promise<BookContent> {
  // Always use process.env.API_KEY directly as per guidelines
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    onProgress("Menyusun kerangka buku dan kata pengantar...");
    
    // Step 1: Outline, Foreword, Introduction
    const initialResponse = await callGeminiWithRetry(ai, {
      model: MODEL_NAME,
      contents: `Buatlah kerangka buku non-fiksi profesional berjudul "${title}" oleh "${author}". 
      Format output harus JSON dengan properti: 
      - foreword (Kata Pengantar)
      - introduction (Pendahuluan)
      - toc (Array string berisi 10 judul bab yang mendalam)
      Gunakan Bahasa Indonesia yang baku dan elegan (EYD).`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            foreword: { type: Type.STRING },
            introduction: { type: Type.STRING },
            toc: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING } 
            }
          },
          required: ["foreword", "introduction", "toc"]
        }
      }
    });

    const baseData = JSON.parse(initialResponse.text || '{}');
    if (!baseData.toc) throw new Error("Gagal membuat kerangka buku.");
    
    const chapters: string[] = [];

    // Step 2: Generate Chapters
    for (let i = 0; i < baseData.toc.length; i++) {
      const chapterTitle = baseData.toc[i];
      onProgress(`Menulis Bab ${i + 1}: ${chapterTitle}...`);
      
      // Jeda paksa 2 detik antar bab untuk menjaga RPM tetap stabil
      await sleep(2000);

      const chapterResponse = await callGeminiWithRetry(ai, {
        model: MODEL_NAME,
        contents: `Tuliskan isi Bab ${i + 1} untuk buku "${title}". 
        Judul Bab: "${chapterTitle}". 
        Konteks: Ini adalah bab dalam buku non-fiksi. 
        Tuliskan secara mendalam, komprehensif, dan panjang (minimal 5 paragraf). 
        Gunakan gaya penulisan profesional dan Bahasa Indonesia yang baik dan benar (EYD/PUEBI).`,
      });
      
      chapters.push(chapterResponse.text || '');
    }

    onProgress("Menyusun daftar pustaka...");
    await sleep(2000);
    
    // Step 3: Bibliography
    const biblioResponse = await callGeminiWithRetry(ai, {
      model: MODEL_NAME,
      contents: `Buatlah Daftar Pustaka (Bibliography) yang relevan untuk buku non-fiksi berjudul "${title}" dengan topik: ${baseData.toc.join(", ")}. Gunakan format APA.`,
    });

    return {
      title,
      author,
      foreword: baseData.foreword,
      toc: baseData.toc,
      introduction: baseData.introduction,
      chapters,
      bibliography: biblioResponse.text || ''
    };
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    if (error.message?.includes("429") || error.message?.toLowerCase().includes("quota")) {
      throw new Error("Batas kecepatan API terlampaui. Sistem telah mencoba mengulang namun server Google masih membatasi akses. Silakan tunggu 1-2 menit lalu coba lagi.");
    }
    throw error;
  }
}
