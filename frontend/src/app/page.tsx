"use client";
import React, { useState }from 'react';
import Image from 'next/image';

interface TikTokData {
  success: boolean;
  title: string;
  proxy_url: string;
  thumbnail: string;
  author: string;
  duration: string;
}

export default function HomePage() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TikTokData | null>(null);
  const [error, setError] = useState('');

  const handleDownload = async () => {
    if (!url) return;
    setLoading(true);
    setResult(null);
    setError('');

    try {
      const response = await fetch('http://127.0.0.1:8000/api/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      });

      const data = await response.json();
      if (response.ok) {
        setResult(data);
      } else {
        setError(data.detail || 'Something went wrong');
      }
    } catch (err) {
      setError('Cannot connect to server. Make sure Backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans">
      {/* Navbar */}
      <nav className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            TikSave<span className="text-white text-sm font-light">.pro</span>
          </div>
          <div className="hidden md:flex gap-6 text-sm text-slate-300">
            <a href="#" className="hover:text-cyan-400 transition">How to Use</a>
            <a href="#" className="hover:text-cyan-400 transition">Features</a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-5xl mx-auto px-4 pt-20 pb-12">
        <div className="text-center space-y-6">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
            TikTok Video Downloader <br />
            <span className="text-cyan-400">Without Watermark</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Fast, free, and permanent. Download your favorite TikTok videos in high quality MP4 format instantly.
          </p>

          {/* Input Box */}
          <div className="max-w-3xl mx-auto mt-10">
            <div className="relative flex flex-col md:flex-row gap-2 bg-slate-900 p-2 rounded-2xl border border-slate-800">
              <input 
                type="text" 
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Paste TikTok link here..." 
                className="flex-1 bg-transparent px-6 py-4 outline-none text-white placeholder:text-slate-500"
              />
              <button 
                onClick={handleDownload}
                disabled={loading}
                className="bg-cyan-500 hover:bg-cyan-400 disabled:bg-slate-700 text-slate-950 font-bold px-8 py-4 rounded-xl transition-all"
              >
                {loading ? 'Processing...' : 'Download Now'}
              </button>
            </div>
            {error && <p className="text-red-400 mt-4 text-sm font-medium">{error}</p>}
          </div>
          <p className="text-xs text-slate-500 mt-4 text-center">
              By using our service you accept our Terms of Service.
          </p>

          {/* PREVIEW AREA - Muncul setelah data didapat */}
          {result && (
            <div className="mt-12 max-w-2xl mx-auto bg-slate-900 rounded-3xl border border-slate-800 p-6 animate-in fade-in zoom-in duration-500">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Thumbnail / Video Mini Preview */}
                <div className="w-full md:w-48 h-72 bg-black rounded-2xl overflow-hidden shadow-2xl relative flex-shrink-0">
                  <Image 
                    src={result.thumbnail} 
                    alt="Preview" 
                    width={200} 
                    height={300} 
                    className="w-full h-full object-cover opacity-80"
                    unoptimized={true} 
                  />
                   <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-12 bg-cyan-500 rounded-full flex items-center justify-center">
                         <svg className="w-6 h-6 text-slate-950" fill="currentColor" viewBox="0 0 20 20"><path d="M4.5 3.5v13L16 10z"/></svg>
                      </div>
                   </div>
                </div>

                {/* Video Info & Download Options */}
                <div className="flex-1 text-left space-y-4">
                  <div>
                    <h3 className="font-bold text-xl line-clamp-2">{result.title}</h3>
                    <p className="text-slate-400 text-sm">@{result.author} • {result.duration}</p>
                  </div>

                  <div className="space-y-3 pt-4 border-t border-slate-800">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Select Quality</p>
                    
                    {/* Link download sebenarnya */}
                    <a 
                      href={`http://localhost:8000${result.proxy_url}`}
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-between w-full bg-slate-800 hover:bg-slate-700 p-4 rounded-xl transition group"
                    >
                      <span className="font-medium text-slate-200">Video 1080p (HD)</span>
                      <span className="text-cyan-400 group-hover:translate-x-1 transition-transform">Download →</span>
                    </a>
                    
                    <button className="w-full text-center text-slate-500 text-xs py-2 hover:underline">
                       Download Original MP3 Audio
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      
        {/* Feature Section (PENTING UNTUK SEO) */}
        <div className="grid md:grid-cols-3 gap-8 mt-32">
          <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-cyan-500/50 transition">
            <div className="w-12 h-12 bg-cyan-500/10 rounded-lg flex items-center justify-center text-cyan-400 mb-4">
              ✨
            </div>
            <h3 className="text-xl font-bold mb-2">No Watermark</h3>
            <p className="text-slate-400 text-sm">Get the original video quality without any distracting TikTok logos.</p>
          </div>
          <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-cyan-500/50 transition">
            <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center text-blue-400 mb-4">
              ⚡
            </div>
            <h3 className="text-xl font-bold mb-2">Ultra Fast</h3>
            <p className="text-slate-400 text-sm">Our high-speed servers process your request in seconds.</p>
          </div>
          <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-cyan-500/50 transition">
            <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center text-purple-400 mb-4">
              📱
            </div>
            <h3 className="text-xl font-bold mb-2">Any Device</h3>
            <p className="text-slate-400 text-sm">Works perfectly on Android, iOS, Windows, and macOS browsers.</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 py-12 mt-20">
        <div className="max-w-5xl mx-auto px-4 text-center text-slate-500 text-sm">
          <p>© 2026 TikSave Pro. All rights reserved. We are not affiliated with TikTok.</p>
        </div>
      </footer>
    </div>
  );
}