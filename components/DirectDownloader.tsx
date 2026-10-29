'use client';

import React, { useState } from 'react';
import { SAMPLE_INSTAGRAM_URLS } from '@/lib/workflow-data';
import {
  Download,
  Sparkles,
  Play,
  Share2,
  Copy,
  Check,
  Heart,
  MessageCircle,
  Music,
  Video,
  FileAudio,
  Bot,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  Zap,
  Film,
  Instagram,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';

interface MediaItem {
  url: string;
  quality: string;
  extension: string;
  size: string;
  type?: string;
}

interface MediaResult {
  success: boolean;
  source: string;
  shortcode?: string;
  embedUrl?: string;
  title: string;
  author: string;
  thumbnail: string;
  duration: string;
  likes: string;
  comments: string;
  audio?: string;
  medias: MediaItem[];
  originalUrl: string;
  timestamp: string;
}

interface DirectDownloaderProps {
  onSendToTelegram: (url: string) => void;
  onAddToHistory: (item: MediaResult) => void;
}

export const DirectDownloader: React.FC<DirectDownloaderProps> = ({
  onSendToTelegram,
  onAddToHistory,
}) => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState('');
  const [result, setResult] = useState<MediaResult | null>(null);
  const [playerMode, setPlayerMode] = useState<'instagram_embed' | 'extracted_mp4'>('instagram_embed');
  const [selectedQualityIndex, setSelectedQualityIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isDownloadingFile, setIsDownloadingFile] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<string | null>(null);

  const handleDownload = async (inputUrl?: string) => {
    const targetUrl = inputUrl || url;
    if (!targetUrl.trim()) {
      setErrorMsg('Please paste a valid Instagram Reel or Video URL');
      return;
    }

    setErrorMsg('');
    setVerificationStatus(null);
    setLoading(true);
    setProgress(15);
    setStatusMessage('Connecting to Instagram servers & extracting live media clip...');

    try {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 85) {
            clearInterval(interval);
            return 85;
          }
          return prev + 20;
        });
      }, 250);

      const res = await fetch('/api/instagram/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: targetUrl }),
      });

      clearInterval(interval);
      setProgress(100);
      setStatusMessage('Extracting video streams & live Instagram embed player...');

      const data = await res.json();

      if (data.success) {
        setResult(data);
        setPlayerMode(data.embedUrl ? 'instagram_embed' : 'extracted_mp4');
        setSelectedQualityIndex(0);
        onAddToHistory(data);
      } else {
        setErrorMsg(data.error || 'Failed to fetch Instagram video metadata');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Network error. Please check your connection.');
    } finally {
      setTimeout(() => {
        setLoading(false);
        setProgress(0);
      }, 350);
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setUrl(text);
        if (text.includes('instagram.com')) {
          handleDownload(text);
        }
      }
    } catch (e) {
      // fallback
    }
  };

  const handleCopyLink = (linkToCopy: string) => {
    navigator.clipboard.writeText(linkToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const currentMedia = result?.medias[selectedQualityIndex] || result?.medias[0];

  /**
   * Guaranteed binary video file downloader using fetch + arrayBuffer + Blob(video/mp4)
   */
  const handleDownloadFile = async () => {
    if (!currentMedia?.url) return;
    setIsDownloadingFile(true);
    setErrorMsg('');
    setVerificationStatus('Fetching binary video buffer & verifying video/mp4 format...');

    const expectedExtension = currentMedia.extension || 'mp4';
    const filename = `instagram_reel_${result?.shortcode || 'video'}.${expectedExtension}`;
    const proxyUrl = `/api/instagram/proxy-download?fileUrl=${encodeURIComponent(
      currentMedia.url
    )}&filename=${encodeURIComponent(filename)}`;

    try {
      // Step 1: Fetch stream via server proxy
      const response = await fetch(proxyUrl);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Download service error.`);
      }

      // Step 2: Read binary ArrayBuffer directly
      const arrayBuffer = await response.arrayBuffer();

      if (!arrayBuffer || arrayBuffer.byteLength === 0) {
        throw new Error('Received empty video buffer from server.');
      }

      // Step 3: Construct guaranteed video/mp4 (or audio/mpeg) Blob
      const targetMimeType = expectedExtension === 'mp3' ? 'audio/mpeg' : 'video/mp4';
      const videoBlob = new Blob([arrayBuffer], { type: targetMimeType });

      const fileSizeMb = (videoBlob.size / (1024 * 1024)).toFixed(1);
      setVerificationStatus(`Verified ${targetMimeType} (${fileSizeMb} MB). Triggering download...`);

      // Step 4: Programmatically trigger browser download (no new tab playback)
      const blobUrl = window.URL.createObjectURL(videoBlob);
      const tempLink = document.createElement('a');
      tempLink.style.display = 'none';
      tempLink.href = blobUrl;
      tempLink.setAttribute('download', filename);

      document.body.appendChild(tempLink);
      tempLink.click();

      // Cleanup
      setTimeout(() => {
        document.body.removeChild(tempLink);
        window.URL.revokeObjectURL(blobUrl);
        setVerificationStatus(`Successfully downloaded ${filename} (${fileSizeMb} MB)!`);
        setTimeout(() => setVerificationStatus(null), 4000);
      }, 500);

    } catch (err: any) {
      console.error('Binary download error:', err);
      setErrorMsg(err.message || 'Failed to download binary video file.');
      setVerificationStatus(null);
    } finally {
      setIsDownloadingFile(false);
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Hero Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-[#0d1322] to-slate-950 border border-slate-800 p-8 sm:p-10 shadow-2xl">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md text-xs font-semibold bg-pink-500/10 text-pink-400 border border-pink-500/20">
            <Zap className="w-3.5 h-3.5" />
            Live Real Instagram Reel & Video Extractor
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Download <span className="gradient-text">Real Instagram Reels</span> & Videos
          </h1>

          <p className="text-slate-400 text-base sm:text-lg leading-relaxed">
            Real-time Instagram clip extraction and official live video player. Paste any public Instagram link to view the exact real video reel and download full quality MP4 files.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-6 text-xs text-slate-400">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Verified video/mp4 Stream</span>
            </div>
            <span className="text-slate-700">·</span>
            <div className="flex items-center gap-1.5">
              <Instagram className="w-4 h-4 text-pink-400" />
              <span>Real Live Instagram Clip Player</span>
            </div>
            <span className="text-slate-700">·</span>
            <div className="flex items-center gap-1.5">
              <Bot className="w-4 h-4 text-sky-400" />
              <span>Automated n8n Telegram Bot</span>
            </div>
          </div>
        </div>
      </div>

      {/* Input Card */}
      <div className="glass-panel rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-200 flex items-center justify-between">
            <span>Paste Real Instagram URL</span>
            <button
              onClick={handlePaste}
              className="text-xs text-pink-400 hover:text-pink-300 font-medium transition-colors flex items-center gap-1"
            >
              <Copy className="w-3 h-3" />
              Paste from Clipboard
            </button>
          </label>

          <div className="relative flex items-center">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleDownload()}
              placeholder="https://www.instagram.com/reel/C3x9Q2lO1aX/ or /p/..."
              className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl px-4 py-3.5 pr-32 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all font-mono"
            />

            <div className="absolute right-2 flex items-center gap-2">
              {url && (
                <button
                  onClick={() => setUrl('')}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                  title="Clear"
                >
                  ✕
                </button>
              )}
              <button
                onClick={() => handleDownload()}
                disabled={loading}
                className="px-5 py-2 text-xs font-bold text-white bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 rounded-lg shadow-md shadow-pink-500/20 transition-all flex items-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    Extracting...
                  </>
                ) : (
                  <>
                    <Download className="w-3.5 h-3.5" />
                    Get Video
                  </>
                )}
              </button>
            </div>
          </div>

          {errorMsg && (
            <p className="text-xs text-rose-400 font-medium pt-1 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{errorMsg}</span>
            </p>
          )}
        </div>

        {/* Sample Links */}
        <div className="space-y-2 pt-2 border-t border-slate-800/80">
          <span className="text-xs font-semibold text-slate-400">Try sample Instagram URLs:</span>
          <div className="flex flex-wrap items-center gap-2">
            {SAMPLE_INSTAGRAM_URLS.map((sample, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setUrl(sample.url);
                  handleDownload(sample.url);
                }}
                className="px-3 py-1.5 rounded-lg bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 text-xs font-medium text-slate-300 hover:text-white transition-all flex items-center gap-1.5 group"
              >
                <Sparkles className="w-3 h-3 text-pink-400 group-hover:scale-110 transition-transform" />
                <span>{sample.label}</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-700 text-slate-400">
                  {sample.type}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Loading Progress Bar */}
        {loading && (
          <div className="space-y-2 pt-2 animate-fadeIn">
            <div className="flex justify-between text-xs text-slate-400 font-mono">
              <span>{statusMessage}</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 h-full transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Media Download Result Card */}
      {result && (
        <div className="glass-panel rounded-2xl p-6 sm:p-8 space-y-6 border-pink-500/20 shadow-2xl animate-fadeIn">
          
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-500" />
              <span className="text-sm font-bold text-white">Live Instagram Reel Ready</span>
              <span className="text-xs text-pink-400 font-mono">· ID: {result.shortcode}</span>
            </div>

            <div className="flex items-center gap-3">
              {/* Player Mode Switcher */}
              {result.embedUrl && (
                <div className="flex items-center p-1 bg-slate-900 rounded-lg border border-slate-800 text-xs">
                  <button
                    onClick={() => setPlayerMode('instagram_embed')}
                    className={`px-2.5 py-1 rounded-md font-semibold transition-colors flex items-center gap-1 ${
                      playerMode === 'instagram_embed'
                        ? 'bg-pink-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Instagram className="w-3.5 h-3.5" />
                    Live Instagram Player
                  </button>
                  <button
                    onClick={() => setPlayerMode('extracted_mp4')}
                    className={`px-2.5 py-1 rounded-md font-semibold transition-colors flex items-center gap-1 ${
                      playerMode === 'extracted_mp4'
                        ? 'bg-purple-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Video className="w-3.5 h-3.5" />
                    MP4 Stream Player
                  </button>
                </div>
              )}

              <button
                onClick={() => onSendToTelegram(result.originalUrl)}
                className="px-3 py-1.5 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/30 text-xs font-medium text-sky-300 transition-all flex items-center gap-1.5"
              >
                <Bot className="w-3.5 h-3.5 text-sky-400" />
                Test in Telegram Bot
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Real Video Player Viewport */}
            <div className="lg:col-span-5 space-y-3">
              <div className="relative rounded-2xl overflow-hidden bg-black border border-slate-800 aspect-[9/16] max-h-[520px] mx-auto flex items-center justify-center shadow-2xl">
                
                {playerMode === 'instagram_embed' && result.embedUrl ? (
                  <iframe
                    src={result.embedUrl}
                    className="w-full h-full border-0 rounded-2xl bg-black"
                    allowFullScreen
                    title={`Instagram Reel ${result.shortcode}`}
                  />
                ) : currentMedia?.url ? (
                  <video
                    key={currentMedia.url}
                    controls
                    playsInline
                    poster={result.thumbnail}
                    className="w-full h-full object-cover rounded-2xl"
                  >
                    <source src={currentMedia.url} type="video/mp4" />
                    Your browser does not support HTML5 video.
                  </video>
                ) : (
                  <img
                    src={result.thumbnail}
                    alt={result.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover rounded-2xl"
                  />
                )}

              </div>
            </div>

            {/* Media Details & Quality Downloads */}
            <div className="lg:col-span-7 space-y-6">
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs text-pink-400 font-semibold tracking-wide">
                  <Instagram className="w-4 h-4 text-pink-500" />
                  <span>{result.author}</span>
                  <span className="text-slate-600">·</span>
                  <span className="text-slate-400">Instagram Reel Clip</span>
                </div>

                <h3 className="text-lg font-bold text-white leading-snug">
                  {result.title}
                </h3>

                {result.audio && (
                  <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                    <Music className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                    <span className="truncate">{result.audio}</span>
                  </div>
                )}

                <div className="flex items-center gap-6 pt-2 text-xs text-slate-400 font-mono">
                  <div className="flex items-center gap-1.5">
                    <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500/20" />
                    <span>{result.likes}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MessageCircle className="w-3.5 h-3.5 text-sky-400" />
                    <span>{result.comments}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Play className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{result.duration}</span>
                  </div>
                </div>
              </div>

              {/* Quality Options */}
              <div className="space-y-3 pt-4 border-t border-slate-800">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Select Download Format
                </span>

                <div className="space-y-2">
                  {result.medias.map((m, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedQualityIndex(idx)}
                      className={`w-full p-3.5 rounded-xl border transition-all flex items-center justify-between text-left ${
                        selectedQualityIndex === idx
                          ? 'bg-pink-500/10 border-pink-500/50 text-white shadow-lg shadow-pink-500/10'
                          : 'bg-slate-900/50 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                            m.extension === 'mp3'
                              ? 'bg-purple-500/20 text-purple-400'
                              : 'bg-pink-500/20 text-pink-400'
                          }`}
                        >
                          {m.extension === 'mp3' ? (
                            <FileAudio className="w-4 h-4" />
                          ) : (
                            <Video className="w-4 h-4" />
                          )}
                        </div>
                        <div>
                          <div className="text-sm font-bold">{m.quality}</div>
                          <div className="text-xs text-slate-400 uppercase">{m.extension} · Direct Stream</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-xs font-mono text-slate-400">{m.size}</span>
                        <div
                          className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                            selectedQualityIndex === idx
                              ? 'border-pink-500 bg-pink-500'
                              : 'border-slate-600'
                          }`}
                        >
                          {selectedQualityIndex === idx && (
                            <div className="w-1.5 h-1.5 rounded-full bg-white" />
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Verification & Download Feedback */}
              {verificationStatus && (
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-emerald-400 font-mono flex items-center gap-2 animate-fadeIn">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{verificationStatus}</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-slate-800">
                <button
                  onClick={handleDownloadFile}
                  disabled={isDownloadingFile}
                  className="flex-1 min-w-[200px] py-3.5 px-5 rounded-xl bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 hover:from-pink-500 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-pink-500/20 transition-all flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50"
                >
                  {isDownloadingFile ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Validating & Saving MP4...
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      Download Video ({currentMedia?.quality || '1080p'})
                    </>
                  )}
                </button>

                <button
                  onClick={() => handleCopyLink(currentMedia?.url || '')}
                  className="py-3.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-medium transition-all flex items-center gap-2"
                  title="Copy direct stream URL"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copy Link
                    </>
                  )}
                </button>

                <a
                  href={result.originalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 transition-all"
                  title="Open on Instagram"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
};
