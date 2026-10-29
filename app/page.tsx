'use client';

import React, { useState } from 'react';
import { Download, RefreshCw, AlertCircle, CheckCircle2, Instagram } from 'lucide-react';

interface MediaItem {
  url: string;
  quality: string;
  extension: string;
  size: string;
}

interface MediaResult {
  success: boolean;
  shortcode?: string;
  embedUrl?: string;
  title: string;
  author: string;
  thumbnail: string;
  medias: MediaItem[];
  originalUrl: string;
}

export default function HomePage() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<MediaResult | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [isDownloading, setIsDownloading] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  const handleFetchVideo = async (inputUrl?: string) => {
    const targetUrl = inputUrl || url;
    if (!targetUrl.trim()) {
      setErrorMsg('Please enter an Instagram Reel or Video link.');
      return;
    }

    setErrorMsg('');
    setStatusMsg(null);
    setLoading(true);

    try {
      const res = await fetch('/api/instagram/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: targetUrl }),
      });

      const data = await res.json();

      if (data.success && data.embedUrl) {
        setResult(data);
      } else {
        setErrorMsg(data.error || 'Could not fetch video. Please check the Instagram link.');
      }
    } catch (err) {
      setErrorMsg('Failed to connect. Please check your network.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadMp4 = async () => {
    const currentMedia = result?.medias[0];
    if (!currentMedia?.url) return;

    setIsDownloading(true);
    setErrorMsg('');
    setStatusMsg('Saving video file...');

    const filename = `instagram_reel_${result?.shortcode || 'video'}.${currentMedia.extension || 'mp4'}`;
    const proxyUrl = `/api/instagram/proxy-download?fileUrl=${encodeURIComponent(
      currentMedia.url
    )}&filename=${encodeURIComponent(filename)}`;

    try {
      const response = await fetch(proxyUrl);
      if (!response.ok) {
        throw new Error('Download failed.');
      }

      const arrayBuffer = await response.arrayBuffer();
      const videoBlob = new Blob([arrayBuffer], { type: 'video/mp4' });

      const blobUrl = window.URL.createObjectURL(videoBlob);
      const tempLink = document.createElement('a');
      tempLink.style.display = 'none';
      tempLink.href = blobUrl;
      tempLink.setAttribute('download', filename);

      document.body.appendChild(tempLink);
      tempLink.click();

      setTimeout(() => {
        document.body.removeChild(tempLink);
        window.URL.revokeObjectURL(blobUrl);
        setStatusMsg('Video saved successfully!');
        setTimeout(() => setStatusMsg(null), 3000);
      }, 500);

    } catch (err) {
      // Direct link fallback
      const a = document.createElement('a');
      a.href = proxyUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col items-center justify-center p-4 sm:p-6">
      
      <div className="w-full max-w-lg space-y-6 my-auto py-6">
        
        {/* Simple Wordmark */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white shadow-md mb-1">
            <Instagram className="w-6 h-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Instagram Reel Downloader
          </h1>
        </div>

        {/* Minimal Input & Button */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleFetchVideo()}
              placeholder="Paste Instagram link here..."
              className="flex-1 bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 shadow-sm transition-all font-mono"
            />
            <button
              onClick={() => handleFetchVideo()}
              disabled={loading}
              className="px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm transition-all shadow-sm flex items-center gap-2 disabled:opacity-50 shrink-0"
            >
              {loading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                'Fetch Reel'
              )}
            </button>
          </div>

          {errorMsg && (
            <p className="text-xs text-rose-600 font-medium flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{errorMsg}</span>
            </p>
          )}

          {statusMsg && (
            <p className="text-xs text-emerald-600 font-medium flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
              <span>{statusMsg}</span>
            </p>
          )}
        </div>

        {/* Official Live Reel Player & Download Action */}
        {result && result.embedUrl && (
          <div className="space-y-6 pt-2 animate-fadeIn">
            
            {/* Live Reel Viewport */}
            <div className="relative rounded-2xl overflow-hidden bg-black aspect-[9/16] max-h-[500px] mx-auto shadow-xl border border-slate-200">
              <iframe
                src={result.embedUrl}
                className="w-full h-full border-0 rounded-2xl bg-white"
                allowFullScreen
                title="Instagram Reel"
              />
            </div>

            {/* Simple Direct Download Button */}
            <button
              onClick={handleDownloadMp4}
              disabled={isDownloading}
              className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 hover:opacity-95 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isDownloading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Saving Video...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  Download Video
                </>
              )}
            </button>

          </div>
        )}

      </div>

    </div>
  );
}
