
import React, { useState, useRef } from 'react';
import { Send, Copy, ExternalLink, Loader2, CheckCircle, FileText, BookOpen, AlertTriangle, RefreshCcw } from 'lucide-react';
import { generateBookManuscript } from '../geminiService';
import { BookContent } from '../types';
import { DEVELOPER_INFO } from '../constants';

const Dashboard: React.FC = () => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [result, setResult] = useState<BookContent | null>(null);
  const [error, setError] = useState('');
  const resultRef = useRef<HTMLDivElement>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !author) {
      setError('Judul dan Penulis wajib diisi.');
      return;
    }

    setError('');
    setIsLoading(true);
    setResult(null);

    try {
      const data = await generateBookManuscript(title, author, (s) => setStatus(s));
      setResult(data);
    } catch (err: any) {
      const errorMessage = err.message || 'Terjadi kesalahan saat generate naskah.';
      setError(errorMessage);
      console.error(err);
    } finally {
      setIsLoading(false);
      setStatus('');
    }
  };

  const copyAndOpenGoogleDocs = async () => {
    if (!resultRef.current) return;

    const content = resultRef.current.innerHTML;
    
    try {
      const type = "text/html";
      const blob = new Blob([content], { type });
      const data = [new ClipboardItem({ [type]: blob })];
      await navigator.clipboard.write(data);
      
      alert('Konten telah disalin ke clipboard! Tab baru Google Dokumen akan dibuka. Silakan gunakan Ctrl+V untuk mempaste hasil naskah.');
      window.open('https://docs.google.com/document/create', '_blank');
    } catch (err) {
      const plainText = resultRef.current.innerText;
      await navigator.clipboard.writeText(plainText);
      alert('Konten (teks saja) telah disalin. Tab Google Dokumen akan dibuka.');
      window.open('https://docs.google.com/document/create', '_blank');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden mb-10">
        <div className="bg-blue-600 p-8 text-white relative">
          <div className="relative z-10">
            <h1 className="text-3xl font-extrabold mb-2 flex items-center gap-3">
              <BookOpen size={32} />
              Tulis Naskah Buku Anda
            </h1>
            <p className="text-blue-100 opacity-90 max-w-xl">
              Gunakan kecerdasan buatan untuk membantu menyusun kerangka dan isi buku non-fiksi secara profesional dengan standar Bahasa Indonesia.
            </p>
            <p className="text-blue-200 text-sm font-medium mt-4 italic">
              {DEVELOPER_INFO}
            </p>
          </div>
          <div className="absolute top-0 right-0 h-full w-1/3 bg-white opacity-5 transform skew-x-12 translate-x-20"></div>
        </div>

        <form onSubmit={handleGenerate} className="p-8 space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Judul Buku <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Contoh: Strategi Mengajar Abad 21"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Nama Penulis <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Contoh: Ahmad Bashir, S.Pd, M.Pd"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                required
              />
            </div>
          </div>

          {error && (
            <div className="p-5 bg-amber-50 text-amber-900 rounded-xl text-sm font-medium border border-amber-200 flex items-start gap-4">
              <AlertTriangle className="flex-shrink-0 mt-0.5 text-amber-600" size={24} />
              <div className="space-y-2">
                <p className="font-bold text-base">Antrian Padat / Kuota Terlampaui</p>
                <p className="leading-relaxed">{error}</p>
                <div className="flex flex-wrap gap-2 mt-3">
                  <button 
                    type="button"
                    onClick={handleGenerate}
                    className="flex items-center gap-1.5 bg-amber-600 text-white px-3 py-1.5 rounded-lg hover:bg-amber-700 transition-colors"
                  >
                    <RefreshCcw size={14} />
                    Coba Lagi Sekarang
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={isLoading}
              className={`flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-white shadow-lg transition-all transform active:scale-95 ${
                isLoading 
                  ? 'bg-slate-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700 hover:shadow-blue-200'
              }`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  <span>Sedang Menulis...</span>
                </>
              ) : (
                <>
                  <Send size={20} />
                  <span>Mulai Generate Buku</span>
                </>
              )}
            </button>
          </div>
        </form>

        {isLoading && (
          <div className="px-8 pb-8">
            <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50">
              <div className="relative mb-4">
                <Loader2 className="animate-spin text-blue-600" size={48} />
                <BookOpen className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-blue-300" size={20} />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">Memproses Penulisan AI</h3>
              <p className="text-slate-500 text-center max-w-sm animate-pulse">
                {status || "Menyiapkan mesin kecerdasan buatan..."}
              </p>
              <div className="w-full max-w-xs bg-slate-200 h-2 mt-6 rounded-full overflow-hidden">
                <div className="bg-blue-600 h-full animate-[loading_60s_linear_infinite]" style={{ width: '60%' }}></div>
              </div>
              <p className="mt-4 text-[10px] text-slate-400 text-center italic">
                Proses penulisan 10 bab membutuhkan waktu sekitar 1-2 menit.<br/>
                Mohon tidak menutup halaman ini.
              </p>
            </div>
          </div>
        )}
      </div>

      {result && (
        <div className="space-y-6 animate-in fade-in duration-700 slide-in-from-bottom-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 rounded-xl shadow-md border border-slate-200 sticky top-20 z-40">
            <div className="flex items-center gap-2 text-green-600 font-bold">
              <CheckCircle size={20} />
              <span>Naskah Berhasil Dibuat!</span>
            </div>
            <button
              onClick={copyAndOpenGoogleDocs}
              className="flex items-center gap-2 bg-slate-800 text-white px-5 py-2.5 rounded-lg hover:bg-slate-700 transition-all font-medium shadow-sm w-full sm:w-auto justify-center"
            >
              <Copy size={18} />
              <span>Salin & Buka di Google Dokumen</span>
              <ExternalLink size={16} />
            </button>
          </div>

          <div 
            ref={resultRef}
            className="bg-white p-12 sm:p-20 rounded-2xl shadow-xl border border-slate-200 manuscript prose-justify"
          >
            <div className="text-center mb-40 pt-20">
              <h1 className="text-5xl font-extrabold uppercase mb-8 leading-tight">{result.title}</h1>
              <div className="h-1 w-32 bg-slate-800 mx-auto mb-8"></div>
              <p className="text-2xl font-medium text-slate-700 italic">Disusun oleh:</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">{result.author}</p>
            </div>

            <section className="mb-20">
              <h2 className="text-3xl font-bold mb-8 border-b-2 border-slate-100 pb-2">KATA PENGANTAR</h2>
              <div className="text-lg text-slate-800 leading-relaxed space-y-4 whitespace-pre-wrap">
                {result.foreword}
              </div>
              <div className="mt-12 text-right">
                <p className="font-bold">{result.author}</p>
              </div>
            </section>

            <div className="page-break my-12 border-t-2 border-dashed border-slate-200"></div>

            <section className="mb-20">
              <h2 className="text-3xl font-bold mb-8 border-b-2 border-slate-100 pb-2">DAFTAR ISI</h2>
              <ul className="space-y-4 text-lg">
                <li className="flex justify-between border-b border-slate-50 pb-1">
                  <span className="font-medium">KATA PENGANTAR</span>
                  <span>v</span>
                </li>
                <li className="flex justify-between border-b border-slate-50 pb-1">
                  <span className="font-medium">PENDAHULUAN</span>
                  <span>1</span>
                </li>
                {result.toc.map((item, idx) => {
                  return (
                    <li key={idx} className="flex justify-between border-b border-slate-50 pb-1">
                      <span className="font-medium">BAB {idx + 1}: {item}</span>
                      <span>{10 + (idx * 15)}</span>
                    </li>
                  );
                })}
                <li className="flex justify-between border-b border-slate-50 pb-1">
                  <span className="font-medium">DAFTAR PUSTAKA</span>
                  <span>160</span>
                </li>
              </ul>
            </section>

            <div className="page-break my-12 border-t-2 border-dashed border-slate-200"></div>

            <section className="mb-20">
              <h2 className="text-3xl font-bold mb-8 border-b-2 border-slate-100 pb-2">PENDAHULUAN</h2>
              <div className="text-lg text-slate-800 leading-relaxed space-y-4 whitespace-pre-wrap">
                {result.introduction}
              </div>
            </section>

            {result.chapters.map((chapter, idx) => {
              return (
                <section key={idx} className="mb-20">
                  <h2 className="text-3xl font-bold mb-2">BAB {idx + 1}</h2>
                  <h3 className="text-2xl font-bold mb-8 text-slate-700 uppercase">{result.toc[idx]}</h3>
                  <div className="text-lg text-slate-800 leading-relaxed space-y-6 whitespace-pre-wrap">
                    {chapter}
                  </div>
                </section>
              );
            })}

            <div className="page-break my-12 border-t-2 border-dashed border-slate-200"></div>

            <section className="mb-20">
              <h2 className="text-3xl font-bold mb-8 border-b-2 border-slate-100 pb-2">DAFTAR PUSTAKA</h2>
              <div className="text-lg text-slate-800 leading-relaxed space-y-4 whitespace-pre-wrap">
                {result.bibliography}
              </div>
            </section>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
