'use client';

import React from 'react';
import { Download, Bot, Sparkles, Workflow, Terminal, BookOpen, Layers } from 'lucide-react';

interface HeaderProps {
  activeTab: 'downloader' | 'workflow' | 'telegram' | 'guide' | 'api' | 'history';
  setActiveTab: (tab: 'downloader' | 'workflow' | 'telegram' | 'guide' | 'api' | 'history') => void;
  onDownloadWorkflow: () => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, onDownloadWorkflow }) => {
  return (
    <header className="sticky top-0 z-50 bg-[#090d16]/90 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-8">
          
          {/* Zone 1: Single text wordmark */}
          <button
            onClick={() => setActiveTab('downloader')}
            className="flex items-center gap-2.5 text-left group focus:outline-none"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-pink-500 via-purple-600 to-indigo-500 p-0.5 flex items-center justify-center shadow-lg shadow-pink-500/20 group-hover:scale-105 transition-transform duration-200">
              <div className="w-full h-full bg-[#0d1322] rounded-[10px] flex items-center justify-center">
                <Workflow className="w-5 h-5 text-pink-400 group-hover:text-pink-300 transition-colors" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight text-white whitespace-nowrap shrink-0 flex items-center gap-1.5">
                InstaStream <span className="gradient-text font-extrabold">Flow</span>
              </span>
            </div>
          </button>

          {/* Zone 2: 5 clean single-line navigation links */}
          <nav className="hidden lg:flex items-center gap-1 overflow-x-auto py-1 no-scrollbar">
            <button
              onClick={() => setActiveTab('downloader')}
              className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap shrink-0 flex items-center gap-2 ${
                activeTab === 'downloader'
                  ? 'bg-slate-800/90 text-white shadow-sm border border-slate-700/60'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
              }`}
            >
              <Sparkles className="w-4 h-4 text-pink-400" />
              Direct Downloader
            </button>

            <button
              onClick={() => setActiveTab('workflow')}
              className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap shrink-0 flex items-center gap-2 ${
                activeTab === 'workflow'
                  ? 'bg-slate-800/90 text-white shadow-sm border border-slate-700/60'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
              }`}
            >
              <Workflow className="w-4 h-4 text-purple-400" />
              n8n Canvas
            </button>

            <button
              onClick={() => setActiveTab('telegram')}
              className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap shrink-0 flex items-center gap-2 ${
                activeTab === 'telegram'
                  ? 'bg-slate-800/90 text-white shadow-sm border border-slate-700/60'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
              }`}
            >
              <Bot className="w-4 h-4 text-sky-400" />
              Telegram Bot Sim
            </button>

            <button
              onClick={() => setActiveTab('guide')}
              className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap shrink-0 flex items-center gap-2 ${
                activeTab === 'guide'
                  ? 'bg-slate-800/90 text-white shadow-sm border border-slate-700/60'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
              }`}
            >
              <BookOpen className="w-4 h-4 text-amber-400" />
              Setup Guide
            </button>

            <button
              onClick={() => setActiveTab('api')}
              className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap shrink-0 flex items-center gap-2 ${
                activeTab === 'api'
                  ? 'bg-slate-800/90 text-white shadow-sm border border-slate-700/60'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
              }`}
            >
              <Terminal className="w-4 h-4 text-emerald-400" />
              API Playground
            </button>

            <button
              onClick={() => setActiveTab('history')}
              className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap shrink-0 flex items-center gap-2 ${
                activeTab === 'history'
                  ? 'bg-slate-800/90 text-white shadow-sm border border-slate-700/60'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
              }`}
            >
              <Layers className="w-4 h-4 text-indigo-400" />
              History
            </button>
          </nav>

          {/* Zone 3: 1 primary action */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onDownloadWorkflow}
              className="px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 hover:from-pink-500 hover:to-indigo-500 rounded-lg shadow-md shadow-pink-500/10 hover:shadow-pink-500/25 transition-all duration-200 flex items-center gap-2 whitespace-nowrap shrink-0 active:scale-95"
            >
              <Download className="w-3.5 h-3.5" />
              Export n8n Workflow JSON
            </button>
          </div>

        </div>

        {/* Mobile Navigation Row */}
        <div className="lg:hidden flex items-center gap-1 overflow-x-auto pb-2.5 pt-1 no-scrollbar border-t border-slate-800/50">
          <button
            onClick={() => setActiveTab('downloader')}
            className={`px-3 py-1 rounded-md text-xs font-medium whitespace-nowrap shrink-0 ${
              activeTab === 'downloader' ? 'bg-pink-500/20 text-pink-300 border border-pink-500/30' : 'text-slate-400'
            }`}
          >
            Direct Downloader
          </button>
          <button
            onClick={() => setActiveTab('workflow')}
            className={`px-3 py-1 rounded-md text-xs font-medium whitespace-nowrap shrink-0 ${
              activeTab === 'workflow' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' : 'text-slate-400'
            }`}
          >
            n8n Canvas
          </button>
          <button
            onClick={() => setActiveTab('telegram')}
            className={`px-3 py-1 rounded-md text-xs font-medium whitespace-nowrap shrink-0 ${
              activeTab === 'telegram' ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30' : 'text-slate-400'
            }`}
          >
            Telegram Bot
          </button>
          <button
            onClick={() => setActiveTab('guide')}
            className={`px-3 py-1 rounded-md text-xs font-medium whitespace-nowrap shrink-0 ${
              activeTab === 'guide' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'text-slate-400'
            }`}
          >
            Setup Guide
          </button>
          <button
            onClick={() => setActiveTab('api')}
            className={`px-3 py-1 rounded-md text-xs font-medium whitespace-nowrap shrink-0 ${
              activeTab === 'api' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'text-slate-400'
            }`}
          >
            API Console
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-3 py-1 rounded-md text-xs font-medium whitespace-nowrap shrink-0 ${
              activeTab === 'history' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' : 'text-slate-400'
            }`}
          >
            History
          </button>
        </div>

      </div>
    </header>
  );
};
