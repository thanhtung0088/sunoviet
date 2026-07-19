'use client';
import React, { useState } from 'react';

export default function SunoVNPro() {
  const [lyrics, setLyrics] = useState('');
  const [style, setStyle] = useState('');
  const [title, setTitle] = useState('');
  const [bpm, setBpm] = useState(90);
  const [selectedVocal, setSelectedVocal] = useState('Nam');
  const [activeTab, setActiveTab] = useState('Tuỳ chỉnh');
  const [isGenerating, setIsGenerating] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!lyrics) {
      console.warn("Chưa có lời bài hát!");
      return;
    }

    setIsGenerating(true);
    setErrorMsg(null);
    setAudioUrl(null);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: lyrics,
          style: style,
          title: title,
          bpm: bpm,
          vocal: selectedVocal
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // MusicGen trả về mảng URL (thường 1 phần tử) hoặc chuỗi URL trực tiếp
        const url = Array.isArray(data.audioUrl) ? data.audioUrl[0] : data.audioUrl;
        setAudioUrl(url);
      } else {
        throw new Error(data.message || "Lỗi từ Server AI");
      }
    } catch (error: unknown) {
      console.error("Lỗi kết nối:", error);
      const message = error instanceof Error ? error.message : "Không thể tạo nhạc, thử lại sau.";
      setErrorMsg(message);
    } finally {
      setIsGenerating(false);
    }
  };

  const addTag = (tag: string) => setLyrics(prev => prev + ` [${tag}] `);

  return (
    <div className="flex h-screen bg-[#0a0a0a] text-gray-300 font-sans overflow-hidden">
      <aside className="w-64 border-r border-[#1f1f1f] bg-[#0a0a0a] flex flex-col p-4">
        <div className="text-xl font-black text-white mb-8 flex items-center gap-2">
          <span className="bg-pink-600 p-1.5 rounded-lg text-white">🎵</span> SunoVN
        </div>
        <nav className="space-y-1 flex-1">
          {['Khám phá', 'Tạo nhạc AI', 'Bìa nhạc AI', 'Video nhạc AI'].map(item => (
            <div key={item} className="p-3 hover:bg-[#1a1a1a] rounded-lg cursor-pointer font-medium text-sm transition">{item}</div>
          ))}
        </nav>
        <div className="bg-[#141414] p-4 rounded-xl border border-[#1f1f1f]">
          <div className="text-2xl font-bold text-white">48</div>
          <div className="text-xs text-gray-500 mb-4">Credits còn lại hôm nay</div>
          <button className="w-full bg-pink-600 hover:bg-pink-500 text-white py-2 rounded-lg font-bold text-sm transition">Nâng cấp Pro</button>
        </div>
      </aside>

      <main className="w-[420px] border-r border-[#1f1f1f] p-6 overflow-y-auto custom-scrollbar">
        <div className="flex items-center justify-between bg-[#121212] p-1 rounded-lg border border-[#333] mb-6">
          <div className="flex gap-1">
            {['Đơn giản', 'Tuỳ chỉnh', 'Âm thanh', 'Nhạc nền'].map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)} className={`px-3 py-1.5 text-[11px] font-bold rounded transition ${activeTab === tab ? 'bg-[#1f1f1f] text-white' : 'text-gray-500 hover:text-white'}`}>
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-5">
          <div>
            <label className="text-xs font-bold text-gray-400 mb-2 block">Lời bài hát</label>
            <textarea value={lyrics} onChange={(e) => setLyrics(e.target.value)} className="w-full h-40 bg-[#121212] p-3 rounded-lg border border-[#333] text-sm focus:border-pink-600 outline-none transition" placeholder="Dán lời bài hát..." />
            <div className="flex gap-1.5 mt-2">
              {['Verse', 'Pre-Chorus', 'Chorus', 'Bridge', 'Outro'].map(tag => (
                <button key={tag} onClick={() => addTag(tag)} className="bg-[#1a1a1a] px-2 py-1 rounded text-[10px] uppercase font-bold hover:bg-gray-700 transition">+{tag}</button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-400 mb-2 block">Phong cách âm nhạc</label>
            <textarea value={style} onChange={(e) => setStyle(e.target.value)} className="w-full h-20 bg-[#121212] p-3 rounded-lg border border-[#333] text-sm" />
          </div>

          <div>
            <label className="text-xs font-bold text-gray-400 mb-2 block">Giọng hát</label>
            <div className="flex gap-2">
              {['Nam', 'Nữ', 'Song ca', 'Hợp xướng'].map(v => (
                <button key={v} onClick={() => setSelectedVocal(v)} className={`px-4 py-1.5 rounded text-xs border transition ${selectedVocal === v ? 'border-pink-600 text-pink-600' : 'border-[#333]'}`}>{v}</button>
              ))}
            </div>
          </div>

          <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full bg-[#121212] p-2 rounded border border-[#333] text-sm" placeholder="Tựa đề..." />
          
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-400">Nhịp độ (BPM): {bpm}</label>
            <input type="range" min="60" max="200" value={bpm} onChange={(e) => setBpm(Number(e.target.value))} className="w-full accent-pink-600" />
          </div>

          <button 
            onClick={handleGenerate} 
            disabled={isGenerating}
            className={`w-full py-3 font-bold rounded-lg uppercase text-xs transition ${isGenerating ? 'bg-gray-600 cursor-not-allowed' : 'bg-pink-600 hover:bg-pink-700 text-white'}`}
          >
            {isGenerating ? 'ĐANG GỬI LỆNH...' : 'TẠO BÀI HÁT'}
          </button>
        </div>
      </main>

      {/* Khu vực thẻ TONE đã được xóa hoàn toàn */}

      <footer className="fixed bottom-0 w-full h-16 bg-[#0a0a0a] border-t border-[#1f1f1f] flex items-center px-6 justify-between gap-4">
        {errorMsg ? (
          <div className="text-sm font-bold text-red-500">⚠️ {errorMsg}</div>
        ) : audioUrl ? (
          <audio controls src={audioUrl} className="h-9 max-w-md flex-1" />
        ) : (
          <div className="text-sm font-bold flex items-center gap-3">
            {isGenerating ? '🎵 Đang tạo nhạc, chờ 20-30 giây...' : '🎵 Hệ thống đã sẵn sàng'}
          </div>
        )}
        <a
          href={audioUrl ?? undefined}
          download={audioUrl ? `${title || 'sunovn-track'}.mp3` : undefined}
          className={`text-xs border border-[#333] px-4 py-2 rounded-lg transition ${audioUrl ? 'hover:bg-[#1a1a1a]' : 'opacity-40 pointer-events-none'}`}
        >
          Tải xuống
        </a>
      </footer>
    </div>
  );
}