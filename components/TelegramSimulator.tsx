'use client';

import React, { useState, useEffect, useRef } from 'react';
import { SAMPLE_INSTAGRAM_URLS } from '@/lib/workflow-data';
import {
  Send,
  Bot,
  Play,
  Download,
  CheckCheck,
  Sparkles,
  Settings,
  RefreshCw,
  Copy,
  Check,
  Shield,
  Zap,
  HelpCircle
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  timestamp: string;
  type: 'text' | 'media' | 'status';
  content?: string;
  mediaData?: {
    title: string;
    author: string;
    videoUrl: string;
    thumbnail: string;
    duration: string;
    size: string;
    embedUrl?: string;
  };
}

interface TelegramSimulatorProps {
  initialUrl?: string;
}

export const TelegramSimulator: React.FC<TelegramSimulatorProps> = ({ initialUrl }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'bot',
      timestamp: '11:20 AM',
      type: 'text',
      content:
        '👋 Welcome to Instagram Downloader Bot! Send me any Instagram Reel, Video, or Post URL and I will fetch the high-quality MP4 video directly to your chat.',
    },
  ]);
  const [inputText, setInputText] = useState(initialUrl || '');
  const [isTyping, setIsTyping] = useState(false);
  const [botToken, setBotToken] = useState('7812934891:AAHk98_sJ2m001xX9zLqP3');
  const [showConfig, setShowConfig] = useState(false);
  const [copiedToken, setCopiedToken] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialUrl) {
      setInputText(initialUrl);
    }
  }, [initialUrl]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async (customUrl?: string) => {
    const textToSend = customUrl || inputText;
    if (!textToSend.trim()) return;

    const userMsgId = Date.now().toString();
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Add User Message
    const userMsg: ChatMessage = {
      id: userMsgId,
      sender: 'user',
      timestamp: timeStr,
      type: 'text',
      content: textToSend,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    // Step 1: Send typing status
    await new Promise((r) => setTimeout(r, 900));

    // Step 2: Add status message
    const statusMsgId = (Date.now() + 1).toString();
    setMessages((prev) => [
      ...prev,
      {
        id: statusMsgId,
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'text',
        content: '⏳ [n8n Workflow Node] Processing URL with mediadl.app API (Delay 3s)...',
      },
    ]);

    // Fetch video metadata from route
    try {
      const res = await fetch('/api/instagram/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: textToSend }),
      });
      const data = await res.json();

      await new Promise((r) => setTimeout(r, 1500));
      setIsTyping(false);

      if (data.success && data.medias?.[0]) {
        const topMedia = data.medias[0];
        const botMediaMsg: ChatMessage = {
          id: (Date.now() + 2).toString(),
          sender: 'bot',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          type: 'media',
          mediaData: {
            title: data.title,
            author: data.author,
            videoUrl: topMedia.url,
            thumbnail: data.thumbnail,
            duration: data.duration,
            size: topMedia.size,
            embedUrl: data.embedUrl,
          },
        };
        setMessages((prev) => [...prev, botMediaMsg]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 2).toString(),
            sender: 'bot',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            type: 'text',
            content: '❌ Sorry, could not process this link. Please ensure it is a valid public Instagram post or Reel.',
          },
        ]);
      }
    } catch (e) {
      setIsTyping(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Bot Info & Config Bar */}
      <div className="glass-panel rounded-2xl p-6 border-slate-800 flex flex-wrap items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src="/src/assets/images/avatar_bot_operator_1793298192944.jpg"
              alt="Bot Avatar"
              className="w-12 h-12 rounded-2xl border border-sky-500/30 object-cover shadow-lg shadow-sky-500/10"
              referrerPolicy="no-referrer"
            />
            <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-[#090d16]" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white">InstaDownloader Telegram Bot</h2>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20 font-mono">
                @InstaDownloaderN8nBot
              </span>
            </div>
            <p className="text-xs text-slate-400 flex items-center gap-2">
              <span>n8n Webhook Connected</span>
              <span>·</span>
              <span className="text-emerald-400 font-medium">Listening to /message updates</span>
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowConfig(!showConfig)}
          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-200 transition-all flex items-center gap-2"
        >
          <Settings className="w-3.5 h-3.5 text-sky-400" />
          Bot & Credential Settings
        </button>
      </div>

      {/* Bot Configuration Panel (Expandable) */}
      {showConfig && (
        <div className="glass-panel rounded-2xl p-6 border-sky-500/30 bg-slate-900/90 space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-sky-400" />
              <span className="text-sm font-bold text-white">Telegram Bot Credentials</span>
            </div>
            <span className="text-xs text-slate-400 font-mono">n8n Telegram Trigger Node</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1.5">
              <label className="text-slate-300 font-medium">Telegram Bot Token (BotFather)</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={botToken}
                  onChange={(e) => setBotToken(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 font-mono text-emerald-400"
                />
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(botToken);
                    setCopiedToken(true);
                    setTimeout(() => setCopiedToken(false), 2000);
                  }}
                  className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 shrink-0"
                >
                  {copiedToken ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-300 font-medium">n8n Webhook Endpoint URL</label>
              <input
                type="text"
                readOnly
                value="https://n8n.your-domain.com/webhook/a8cd8cc1-ce39-4adb-a389-cbca39849471"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 font-mono text-slate-400"
              />
            </div>
          </div>
        </div>
      )}

      {/* Main Telegram Chat Window */}
      <div className="glass-panel rounded-2xl border-slate-800 overflow-hidden shadow-2xl flex flex-col h-[620px] bg-[#0e1621]">
        
        {/* Telegram Chat Header */}
        <div className="px-6 py-4 bg-[#17212b] border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-sky-500 to-indigo-500 p-0.5">
              <img
                src="/src/assets/images/avatar_bot_operator_1793298192944.jpg"
                alt="Bot"
                className="w-full h-full rounded-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <div className="text-sm font-bold text-white flex items-center gap-1.5">
                <span>Instagram Downloader Bot</span>
                <span className="w-2 h-2 rounded-full bg-sky-400" />
              </div>
              <div className="text-[11px] text-sky-400">bot · n8n webhook active</div>
            </div>
          </div>

          <button
            onClick={() => setMessages([])}
            className="text-xs text-slate-400 hover:text-white px-2.5 py-1 rounded bg-slate-800/60"
          >
            Clear Chat
          </button>
        </div>

        {/* Telegram Messages Scroll Area */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-[radial-gradient(#17212b_1px,transparent_1px)] [background-size:16px_16px]">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              {msg.sender === 'user' ? (
                // User Bubble
                <div className="max-w-[80%] sm:max-w-[70%] p-3.5 rounded-2xl rounded-tr-none bg-[#2b5278] text-white space-y-1 shadow-md">
                  <p className="text-sm font-mono break-all">{msg.content}</p>
                  <div className="flex items-center justify-end gap-1 text-[10px] text-sky-200">
                    <span>{msg.timestamp}</span>
                    <CheckCheck className="w-3.5 h-3.5 text-sky-300" />
                  </div>
                </div>
              ) : msg.type === 'text' ? (
                // Bot Text Bubble
                <div className="max-w-[80%] sm:max-w-[70%] p-3.5 rounded-2xl rounded-tl-none bg-[#182533] border border-slate-800 text-slate-100 space-y-1 shadow-md">
                  <p className="text-sm leading-relaxed">{msg.content}</p>
                  <div className="text-[10px] text-slate-400 text-right">{msg.timestamp}</div>
                </div>
              ) : (
                // Bot Media Video Bubble
                <div className="max-w-[85%] sm:max-w-[380px] p-3 rounded-2xl rounded-tl-none bg-[#182533] border border-slate-800 space-y-3 shadow-xl">
                  
                  {/* Video preview player */}
                  <div className="relative rounded-xl overflow-hidden bg-black aspect-[9/16] max-h-[380px] border border-slate-800">
                    {msg.mediaData?.embedUrl ? (
                      <iframe
                        src={msg.mediaData.embedUrl}
                        className="w-full h-full border-0 rounded-xl bg-black"
                        allowFullScreen
                        title="Instagram Real Reel"
                      />
                    ) : (
                      <video
                        controls
                        playsInline
                        poster={msg.mediaData?.thumbnail}
                        className="w-full h-full object-cover"
                      >
                        <source src={msg.mediaData?.videoUrl} type="video/mp4" />
                      </video>
                    )}
                  </div>

                  {/* Caption details */}
                  <div className="space-y-1.5 px-1">
                    <div className="text-xs font-bold text-sky-400">{msg.mediaData?.author}</div>
                    <p className="text-xs text-slate-200 line-clamp-2 leading-relaxed">
                      {msg.mediaData?.title}
                    </p>
                    <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono pt-1 border-t border-slate-800/80">
                      <span>{msg.mediaData?.duration}</span>
                      <span>{msg.mediaData?.size}</span>
                    </div>
                  </div>

                  {/* Direct download button inside Telegram */}
                  <a
                    href={`/api/instagram/proxy-download?fileUrl=${encodeURIComponent(msg.mediaData?.videoUrl || '')}&filename=instagram_reel_telegram.mp4`}
                    target="_blank"
                    download
                    className="w-full py-2.5 px-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Download MP4 Video File
                  </a>

                  <div className="text-[10px] text-slate-500 text-right">{msg.timestamp}</div>
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-2 p-3 rounded-2xl rounded-tl-none bg-[#182533] text-sky-400 text-xs w-max border border-slate-800">
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>Telegram Bot is processing Instagram link...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-[#17212b] border-t border-slate-800/80 space-y-2">
          
          {/* Quick sample chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
            <span className="text-slate-400 text-[11px] font-semibold shrink-0">Quick Links:</span>
            {SAMPLE_INSTAGRAM_URLS.map((sample, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(sample.url)}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] shrink-0 border border-slate-700 flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3 text-pink-400" />
                {sample.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Send Instagram Reel URL to Telegram Bot..."
              className="flex-1 bg-[#0e1621] border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
            />

            <button
              onClick={() => handleSend()}
              disabled={!inputText.trim()}
              className="p-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white disabled:opacity-40 transition-all shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
