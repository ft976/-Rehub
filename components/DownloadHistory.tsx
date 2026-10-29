'use client';

import React, { useState } from 'react';
import { Download, Search, Trash2, ExternalLink, Copy, Check, Play, Film } from 'lucide-react';

interface MediaResult {
  title: string;
  author: string;
  thumbnail: string;
  duration: string;
  likes: string;
  comments: string;
  medias: { url: string; quality: string; extension: string; size: string }[];
  originalUrl: string;
  timestamp: string;
}

interface DownloadHistoryProps {
  history: MediaResult[];
  onClearHistory: () => void;
}

export const DownloadHistory: React.FC<DownloadHistoryProps> = ({
  history,
  onClearHistory,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const filteredHistory = history.filter(
    (item) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.originalUrl.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCopyLink = (idx: number, link: string) => {
    navigator.clipboard.writeText(link);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  const handleExportTxt = () => {
    const lines = history.map(
      (item) => `${item.title} | ${item.author} | ${item.medias[0]?.url || item.originalUrl}`
    );
    const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'instagram_downloads_history.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Bar */}
      <div className="glass-panel rounded-2xl p-6 border-slate-800 flex flex-wrap items-center justify-between gap-4 shadow-xl">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Film className="w-5 h-5 text-indigo-400" />
            <span>Download History & Media Archive</span>
          </h2>
          <p className="text-xs text-slate-400">
            {history.length} Instagram Reels & Videos processed in this session.
          </p>
        </div>

        {history.length > 0 && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportTxt}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              Export List (.txt)
            </button>

            <button
              onClick={onClearHistory}
              className="px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-xs font-semibold text-rose-400 border border-rose-500/20 flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Clear History
            </button>
          </div>
        )}
      </div>

      {/* Search Input */}
      {history.length > 0 && (
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by caption, author, or link..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>
      )}

      {/* History Grid */}
      {filteredHistory.length === 0 ? (
        <div className="glass-panel rounded-2xl p-12 text-center text-slate-500 space-y-3 border-slate-800">
          <Film className="w-10 h-10 mx-auto text-slate-600" />
          <p className="text-sm font-medium">No processed downloads found in history.</p>
          <p className="text-xs text-slate-600">
            Use the Direct Downloader or Telegram Bot Simulator to fetch your first video!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHistory.map((item, idx) => {
            const topMedia = item.medias[0];

            return (
              <div
                key={idx}
                className="glass-panel rounded-2xl p-4 border-slate-800 space-y-3 flex flex-col justify-between hover:border-indigo-500/40 transition-all shadow-lg"
              >
                <div className="space-y-3">
                  {/* Thumbnail */}
                  <div className="relative rounded-xl overflow-hidden bg-black aspect-video border border-slate-800 group">
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Play className="w-8 h-8 text-white fill-white" />
                    </div>
                    <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/70 text-[10px] font-mono text-white">
                      {item.duration}
                    </span>
                  </div>

                  {/* Title & Author */}
                  <div className="space-y-1">
                    <div className="text-[11px] font-bold text-pink-400">{item.author}</div>
                    <h3 className="text-xs font-semibold text-white line-clamp-2 leading-snug">
                      {item.title}
                    </h3>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-[10px] text-slate-500 font-mono">
                    {topMedia?.quality || '1080p'} · {topMedia?.size || 'MP4'}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopyLink(idx, topMedia?.url || item.originalUrl)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                      title="Copy stream link"
                    >
                      {copiedIdx === idx ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>

                    {topMedia?.url && (
                      <a
                        href={`/api/instagram/proxy-download?fileUrl=${encodeURIComponent(topMedia.url)}&filename=instagram_history_video.mp4`}
                        target="_blank"
                        download
                        className="p-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white"
                        title="Download Video"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
