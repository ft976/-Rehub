'use client';

import React, { useState } from 'react';
import { ORIGINAL_N8N_WORKFLOW, N8nNode } from '@/lib/workflow-data';
import {
  Play,
  CheckCircle2,
  Clock,
  Code,
  Download,
  Copy,
  Check,
  RotateCcw,
  Settings,
  Send,
  FileCode,
  Filter,
  Globe,
  Info,
  ChevronRight,
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface WorkflowCanvasProps {
  onDownloadJson: () => void;
}

export const WorkflowCanvas: React.FC<WorkflowCanvasProps> = ({ onDownloadJson }) => {
  const [workflow, setWorkflow] = useState(ORIGINAL_N8N_WORKFLOW);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>('0bbb310f-047c-4d8f-bfb4-a92e9863d8e3');
  const [activeTab, setActiveTab] = useState<'visual' | 'json' | 'logs'>('visual');
  const [isRunning, setIsRunning] = useState(false);
  const [currentNodeIdx, setCurrentNodeIdx] = useState<number>(-1);
  const [executionLogs, setExecutionLogs] = useState<
    { timestamp: string; nodeName: string; status: string; data?: any }[]
  >([]);
  const [copiedJson, setCopiedJson] = useState(false);
  const [testUrl, setTestUrl] = useState('https://www.instagram.com/reel/C3x9Q2lO1aX/');

  // Ordered nodes pipeline
  const pipelineNodeIds = [
    '0bbb310f-047c-4d8f-bfb4-a92e9863d8e3', // Telegram Trigger
    '875e46f0-d7a9-4610-ba72-c5bc4152b91a', // URL Download
    'b91deb65-fbcc-4fa3-bef2-2fd2c4de8583', // Delay 3S
    'b055ad08-6df0-44b7-8174-789f6be48b24', // Filtering URL Only
    '3eda9853-3b20-4072-8361-8930b0a9b861', // Delay 3S1
    'e3f39d0d-ca89-4315-b5c3-a0cf244e0db9', // Download
    '19d3ee22-fd1e-4117-b2ef-aaa8a3517c1f', // Sent To Telegram Video
  ];

  const pipelineNodes = pipelineNodeIds
    .map((id) => workflow.nodes.find((n) => n.id === id) as N8nNode)
    .filter(Boolean);

  const selectedNode = workflow.nodes.find((n) => n.id === selectedNodeId) as N8nNode | undefined;

  const handleRunSimulation = async () => {
    setIsRunning(true);
    setExecutionLogs([]);
    setCurrentNodeIdx(0);

    const logs: { timestamp: string; nodeName: string; status: string; data?: any }[] = [];

    const addLog = (nodeName: string, status: string, data?: any) => {
      const entry = {
        timestamp: new Date().toLocaleTimeString(),
        nodeName,
        status,
        data,
      };
      logs.push(entry);
      setExecutionLogs([...logs]);
    };

    let payload: any = {
      message: {
        chat: { id: 987654321, first_name: 'John' },
        text: testUrl,
      },
    };

    // Step 1: Telegram Trigger
    setCurrentNodeIdx(0);
    addLog('Telegram Trigger', 'Received incoming message update', payload);
    await new Promise((r) => setTimeout(r, 800));

    // Step 2: URL Download
    setCurrentNodeIdx(1);
    addLog('URL Download', 'POST to https://www.mediadl.app/api/download...', {
      url: testUrl,
      format: 'bestvideo+bestaudio/best',
    });
    await new Promise((r) => setTimeout(r, 1200));

    payload = {
      title: '🔥 Incredible AI & Robotics Innovation Showcase 2026',
      medias: [
        {
          url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
          quality: '1080p',
        },
      ],
    };
    addLog('URL Download', 'Received media metadata response 200 OK', payload);

    // Step 3: Delay 3S
    setCurrentNodeIdx(2);
    addLog('Delay 3S', 'Waiting 3 seconds to prevent API rate limits...');
    await new Promise((r) => setTimeout(r, 1500));

    // Step 4: Filtering URL Only
    setCurrentNodeIdx(3);
    const filteredUrl = payload.medias[0].url;
    addLog('Filtering URL Only', 'Extracted medias[0].url property', {
      'medias[0].url': filteredUrl,
    });
    await new Promise((r) => setTimeout(r, 800));

    // Step 5: Delay 3S1
    setCurrentNodeIdx(4);
    addLog('Delay 3S1', 'Waiting 3 seconds pause before proxy download...');
    await new Promise((r) => setTimeout(r, 1200));

    // Step 6: Proxy Download
    setCurrentNodeIdx(5);
    addLog('Download', 'Downloading MP4 stream via https://mediadl.app/api/proxy-download...', {
      fileUrl: filteredUrl,
    });
    await new Promise((r) => setTimeout(r, 1400));
    addLog('Download', 'Received binary MP4 file stream (18.4 MB)');

    // Step 7: Send Video to Telegram
    setCurrentNodeIdx(6);
    addLog('Sent To Telegram Video', 'Calling sendVideo API to Telegram chatId: 987654321...', {
      chatId: 987654321,
      fileName: '🔥 Incredible AI & Robotics Innovation Showcase 2026.mp4',
    });
    await new Promise((r) => setTimeout(r, 1000));
    addLog('Sent To Telegram Video', 'Video message delivered successfully to user chat!');

    setIsRunning(false);
    setCurrentNodeIdx(-1);
  };

  const getNodeIcon = (type: string) => {
    if (type.includes('telegramTrigger') || type.includes('telegram')) return Send;
    if (type.includes('httpRequest')) return Globe;
    if (type.includes('wait')) return Clock;
    if (type.includes('set')) return Filter;
    return Settings;
  };

  const getNodeBadgeColor = (type: string) => {
    if (type.includes('telegram')) return 'border-sky-500/40 bg-sky-500/10 text-sky-400';
    if (type.includes('httpRequest')) return 'border-purple-500/40 bg-purple-500/10 text-purple-400';
    if (type.includes('wait')) return 'border-amber-500/40 bg-amber-500/10 text-amber-400';
    if (type.includes('set')) return 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400';
    return 'border-slate-500/40 bg-slate-500/10 text-slate-400';
  };

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(workflow, null, 2));
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Controls Bar */}
      <div className="glass-panel rounded-2xl p-6 flex flex-wrap items-center justify-between gap-4 border-slate-800 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <h2 className="text-xl font-bold text-white">n8n Workflow Visualizer</h2>
            <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
              v{workflow.settings?.executionOrder || '1.0'}
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Interactive node graph and real-time execution simulator for Instagram video automation.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Segmented Tab Controls */}
          <div className="flex items-center p-1 bg-slate-900 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab('visual')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
                activeTab === 'visual'
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <WorkflowIcon className="w-3.5 h-3.5" />
              Node Canvas
            </button>
            <button
              onClick={() => setActiveTab('json')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
                activeTab === 'json'
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <FileCode className="w-3.5 h-3.5" />
              Raw n8n JSON
            </button>
            <button
              onClick={() => setActiveTab('logs')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
                activeTab === 'logs'
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Code className="w-3.5 h-3.5 text-emerald-400" />
              Execution Logs ({executionLogs.length})
            </button>
          </div>

          <button
            onClick={onDownloadJson}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-white transition-all flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            Download .json
          </button>
        </div>
      </div>

      {/* Main Viewport */}
      {activeTab === 'visual' && (
        <div className="space-y-6">
          
          {/* Test Simulation Trigger Bar */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-1 min-w-[280px]">
              <span className="text-xs font-bold text-slate-300 whitespace-nowrap">Simulate Input Link:</span>
              <input
                type="text"
                value={testUrl}
                onChange={(e) => setTestUrl(e.target.value)}
                className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-pink-500"
              />
            </div>

            <button
              onClick={handleRunSimulation}
              disabled={isRunning}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-500/10 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              {isRunning ? 'Running Simulation...' : 'Execute Test Run'}
            </button>
          </div>

          {/* Graphical Pipeline Canvas */}
          <div className="glass-panel rounded-2xl p-6 overflow-x-auto border-slate-800 relative bg-[#0a0e19]">
            
            <div className="min-w-[980px] space-y-8">
              <div className="flex items-center justify-between text-xs text-slate-400 font-semibold border-b border-slate-800/80 pb-3">
                <span>WORKFLOW EXECUTION PIPELINE (7 NODES)</span>
                <span className="font-mono text-slate-500">n8n Execution Order: v1</span>
              </div>

              {/* Connected Node Sequence */}
              <div className="grid grid-cols-7 gap-3 relative py-4">
                {pipelineNodes.map((node, index) => {
                  const Icon = getNodeIcon(node.type);
                  const isSelected = selectedNodeId === node.id;
                  const isCurrentActive = currentNodeIdx === index;
                  const isCompleted = currentNodeIdx > index;

                  return (
                    <div key={node.id} className="relative flex flex-col items-center">
                      
                      {/* Connector Line to Next Node */}
                      {index < pipelineNodes.length - 1 && (
                        <div className="absolute top-8 left-[60%] w-[80%] h-0.5 bg-slate-800 z-0">
                          {isCurrentActive && (
                            <div className="w-full h-full bg-gradient-to-r from-pink-500 to-purple-500 animate-pulse" />
                          )}
                        </div>
                      )}

                      {/* Node Card */}
                      <button
                        onClick={() => setSelectedNodeId(node.id)}
                        className={`relative z-10 w-full p-4 rounded-xl border text-left transition-all duration-200 flex flex-col gap-2.5 ${
                          isSelected
                            ? 'bg-slate-800 border-pink-500 shadow-xl shadow-pink-500/10 ring-1 ring-pink-500'
                            : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-800/50'
                        } ${isCurrentActive ? 'ring-2 ring-emerald-400 animate-bounce' : ''}`}
                      >
                        {/* Status Light */}
                        <div className="flex items-center justify-between">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-mono border ${getNodeBadgeColor(
                              node.type
                            )}`}
                          >
                            Step 0{index + 1}
                          </span>

                          {isCompleted ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          ) : isCurrentActive ? (
                            <Clock className="w-4 h-4 text-amber-400 animate-spin" />
                          ) : (
                            <div className="w-2 h-2 rounded-full bg-slate-700" />
                          )}
                        </div>

                        <div className="flex items-center gap-2 pt-1">
                          <div className="p-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-200">
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="text-xs font-bold text-white truncate max-w-[100px]">
                            {node.name}
                          </div>
                        </div>

                        <div className="text-[10px] text-slate-400 font-mono truncate">
                          {node.type.split('.').pop()}
                        </div>
                      </button>

                    </div>
                  );
                })}
              </div>

              {/* Sticky Notes Banner from prompt */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-800">
                <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-500/20 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-purple-300">
                    <Info className="w-4 h-4 text-purple-400" />
                    <span>How It Works</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Receives Instagram URL from Telegram → Calls mediadl.app/api/download → Waits 3s → Filters stream URL → Waits 3s → Downloads MP4 → Delivers video to user chat.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-sky-950/20 border border-sky-500/20 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-sky-300">
                    <Sparkles className="w-4 h-4 text-sky-400" />
                    <span>Telegram Bot Father Credentials</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Connect Telegram API Credentials using your BotFather token. Pre-configured for auto-sending binary video data back to chatId.
                  </p>
                </div>
              </div>

            </div>

          </div>

          {/* Node Parameter Inspector Panel */}
          {selectedNode && (
            <div className="glass-panel rounded-2xl p-6 border-slate-800 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-pink-500/10 text-pink-400 border border-pink-500/20">
                    <Settings className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">
                      Node Settings: {selectedNode.name}
                    </h3>
                    <p className="text-xs text-slate-400 font-mono">
                      Type: {selectedNode.type} (v{selectedNode.typeVersion})
                    </p>
                  </div>
                </div>

                <span className="text-xs px-2.5 py-1 rounded bg-slate-800 font-mono text-slate-300">
                  ID: {selectedNode.id}
                </span>
              </div>

              <div className="space-y-4">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Configured Parameters
                </div>

                <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-emerald-400 overflow-x-auto max-h-60 leading-relaxed">
                  {JSON.stringify(selectedNode.parameters, null, 2)}
                </pre>

                {selectedNode.credentials && (
                  <div className="space-y-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Credentials Reference
                    </span>
                    <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-sky-400">
                      {JSON.stringify(selectedNode.credentials, null, 2)}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>
      )}

      {/* Raw n8n JSON Schema Viewer */}
      {activeTab === 'json' && (
        <div className="glass-panel rounded-2xl p-6 border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="space-y-1">
              <h3 className="text-base font-bold text-white">Full n8n Workflow JSON</h3>
              <p className="text-xs text-slate-400">
                Exact exported n8n workflow file (`Instagram_Downloader.json`). Import directly into n8n.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyJson}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition-all flex items-center gap-1.5"
              >
                {copiedJson ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    Copy JSON
                  </>
                )}
              </button>
            </div>
          </div>

          <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 overflow-x-auto max-h-[500px] leading-relaxed">
            {JSON.stringify(workflow, null, 2)}
          </pre>
        </div>
      )}

      {/* Execution Logs Inspector */}
      {activeTab === 'logs' && (
        <div className="glass-panel rounded-2xl p-6 border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-base font-bold text-white">Simulation Execution Logs</h3>
            <button
              onClick={handleRunSimulation}
              disabled={isRunning}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Re-run Simulation
            </button>
          </div>

          {executionLogs.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-xs space-y-2">
              <Play className="w-8 h-8 mx-auto text-slate-600" />
              <p>No execution logs yet. Click "Execute Test Run" above to simulate the n8n pipeline!</p>
            </div>
          ) : (
            <div className="space-y-3 font-mono text-xs">
              {executionLogs.map((log, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1"
                >
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-pink-400 font-bold">[{log.nodeName}]</span>
                    <span className="text-[10px] text-slate-500">{log.timestamp}</span>
                  </div>
                  <div className="text-slate-200">{log.status}</div>
                  {log.data && (
                    <pre className="mt-2 p-2 rounded bg-slate-900 text-[11px] text-emerald-400 overflow-x-auto">
                      {JSON.stringify(log.data, null, 2)}
                    </pre>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
};

const WorkflowIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect x="3" y="3" width="6" height="6" rx="1" />
    <rect x="15" y="3" width="6" height="6" rx="1" />
    <rect x="9" y="15" width="6" height="6" rx="1" />
    <path d="M6 9v3a1 1 0 0 0 1 1h5" />
    <path d="M18 9v3a1 1 0 0 1-1 1h-5" />
  </svg>
);
