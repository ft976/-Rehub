'use client';

import React, { useState } from 'react';
import { Terminal, Copy, Check, Play, Globe, Code, FileCode } from 'lucide-react';

export const ApiConsole: React.FC = () => {
  const [selectedEndpoint, setSelectedEndpoint] = useState<'download' | 'proxy'>('download');
  const [selectedLanguage, setSelectedLanguage] = useState<'curl' | 'javascript' | 'python' | 'n8n'>('curl');
  const [inputUrl, setInputUrl] = useState('https://www.instagram.com/reel/C3x9Q2lO1aX/');
  const [responseJson, setResponseJson] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleTestApi = async () => {
    setLoading(true);
    setResponseJson(null);

    try {
      if (selectedEndpoint === 'download') {
        const res = await fetch('/api/instagram/download', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: inputUrl }),
        });
        const data = await res.json();
        setResponseJson(data);
      } else {
        setResponseJson({
          proxy_endpoint: '/api/instagram/proxy-download',
          query_params: { fileUrl: 'https://cdn.mediadl.app/video.mp4', filename: 'reel.mp4' },
          headers: {
            'Content-Disposition': 'attachment; filename="reel.mp4"',
            'Content-Type': 'video/mp4',
          },
          status: '200 Stream Streaming',
        });
      }
    } catch (e) {
      setResponseJson({ error: 'Failed to complete API request' });
    } finally {
      setLoading(false);
    }
  };

  const getCodeSnippet = () => {
    if (selectedEndpoint === 'download') {
      switch (selectedLanguage) {
        case 'curl':
          return `curl -X POST "https://www.mediadl.app/api/download" \\
  -H "Content-Type: application/json" \\
  -H "Referer: https://www.mediadl.app/en" \\
  -H "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" \\
  -d '{"url": "${inputUrl}", "format": "bestvideo+bestaudio/best"}'`;

        case 'javascript':
          return `const response = await fetch("https://www.mediadl.app/api/download", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Referer": "https://www.mediadl.app/en",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
  },
  body: JSON.stringify({
    url: "${inputUrl}",
    format: "bestvideo+bestaudio/best"
  })
});
const data = await response.json();
console.log(data);`;

        case 'python':
          return `import requests

url = "https://www.mediadl.app/api/download"
headers = {
    "Content-Type": "application/json",
    "Referer": "https://www.mediadl.app/en",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
}
payload = {
    "url": "${inputUrl}",
    "format": "bestvideo+bestaudio/best"
}

response = requests.post(url, json=payload, headers=headers)
print(response.json())`;

        case 'n8n':
          return `{
  "parameters": {
    "url": "https://www.mediadl.app/api/download",
    "method": "POST",
    "sendBody": true,
    "bodyParameters": {
      "parameters": [
        { "name": "url", "value": "={{ $json.message.text }}" },
        { "name": "format", "value": "bestvideo+bestaudio/best" }
      ]
    }
  },
  "type": "n8n-nodes-base.httpRequest"
}`;
      }
    } else {
      switch (selectedLanguage) {
        case 'curl':
          return `curl -X GET "https://mediadl.app/api/proxy-download?fileUrl=https://cdn.mediadl.app/video.mp4" \\
  -H "Referer: https://mediadl.app/in" \\
  -H "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64)" \\
  --output instagram_reel.mp4`;

        case 'javascript':
          return `const videoUrl = encodeURIComponent("https://cdn.mediadl.app/video.mp4");
window.location.href = \`/api/instagram/proxy-download?fileUrl=\${videoUrl}&filename=reel.mp4\`;`;

        case 'python':
          return `import requests

proxy_url = "https://mediadl.app/api/proxy-download"
params = {"fileUrl": "https://cdn.mediadl.app/video.mp4"}
res = requests.get(proxy_url, params=params)

with open("instagram_reel.mp4", "wb") as f:
    f.write(res.content)`;

        case 'n8n':
          return `{
  "parameters": {
    "url": "https://mediadl.app/api/proxy-download",
    "sendQuery": true,
    "queryParameters": {
      "parameters": [
        { "name": "fileUrl", "value": "={{ $json.medias[0].url }}" }
      ]
    }
  },
  "type": "n8n-nodes-base.httpRequest"
}`;
      }
    }
  };

  const handleCopySnippet = () => {
    navigator.clipboard.writeText(getCodeSnippet());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="glass-panel rounded-2xl p-6 border-slate-800 space-y-2 shadow-xl">
        <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
          <Terminal className="w-5 h-5" />
          <span>API Playground & Request Builder</span>
        </div>
        <h2 className="text-xl font-bold text-white">MediaDL API Reference & Test Console</h2>
        <p className="text-xs text-slate-400">
          Inspect, test, and generate production code snippets for the Instagram video extraction endpoints used in the n8n automation workflow.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Request Configuration Panel */}
        <div className="lg:col-span-5 glass-panel rounded-2xl p-6 border-slate-800 space-y-5">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 pb-2 border-b border-slate-800">
            1. Select Endpoint
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setSelectedEndpoint('download')}
              className={`p-3 rounded-xl border text-left transition-all ${
                selectedEndpoint === 'download'
                  ? 'bg-emerald-500/10 border-emerald-500/50 text-white'
                  : 'bg-slate-900 border-slate-800 text-slate-400'
              }`}
            >
              <div className="text-xs font-bold font-mono">POST /api/download</div>
              <div className="text-[10px] text-slate-400">Fetch metadata & streams</div>
            </button>

            <button
              onClick={() => setSelectedEndpoint('proxy')}
              className={`p-3 rounded-xl border text-left transition-all ${
                selectedEndpoint === 'proxy'
                  ? 'bg-emerald-500/10 border-emerald-500/50 text-white'
                  : 'bg-slate-900 border-slate-800 text-slate-400'
              }`}
            >
              <div className="text-xs font-bold font-mono">GET /proxy-download</div>
              <div className="text-[10px] text-slate-400">Stream MP4 binary video</div>
            </button>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300">Test Target Link</label>
            <input
              type="text"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300">Required Headers</label>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-400 space-y-1">
              <div><span className="text-pink-400">User-Agent:</span> Mozilla/5.0 Chrome/122</div>
              <div><span className="text-purple-400">Referer:</span> https://www.mediadl.app/en</div>
              <div><span className="text-sky-400">Origin:</span> https://www.mediadl.app</div>
              <div><span className="text-emerald-400">Sec-Fetch-Mode:</span> cors</div>
            </div>
          </div>

          <button
            onClick={handleTestApi}
            disabled={loading}
            className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-500/10 transition-all flex items-center justify-center gap-2"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            {loading ? 'Executing API Call...' : 'Send Live API Request'}
          </button>
        </div>

        {/* Snippet & Response Panel */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Code Snippet Box */}
          <div className="glass-panel rounded-2xl p-6 border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              
              {/* Language Selector */}
              <div className="flex items-center gap-1 p-1 bg-slate-900 rounded-lg">
                {(['curl', 'javascript', 'python', 'n8n'] as const).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setSelectedLanguage(lang)}
                    className={`px-3 py-1 rounded text-[11px] font-mono font-bold uppercase transition-colors ${
                      selectedLanguage === lang
                        ? 'bg-slate-800 text-emerald-400 shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>

              <button
                onClick={handleCopySnippet}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition-all flex items-center gap-1.5"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>

            <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-emerald-400 overflow-x-auto leading-relaxed">
              {getCodeSnippet()}
            </pre>
          </div>

          {/* Response Inspector */}
          {responseJson && (
            <div className="glass-panel rounded-2xl p-6 border-slate-800 space-y-3 animate-fadeIn">
              <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                <span>API Live Response</span>
                <span className="text-emerald-400 font-mono">STATUS: 200 OK</span>
              </div>
              <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-sky-300 overflow-x-auto max-h-60 leading-relaxed">
                {JSON.stringify(responseJson, null, 2)}
              </pre>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
