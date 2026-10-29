'use client';

import React, { useState } from 'react';
import {
  CheckCircle2,
  Circle,
  Bot,
  Workflow,
  Download,
  Key,
  Play,
  Copy,
  Check,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Sparkles
} from 'lucide-react';

interface GuideStep {
  id: number;
  title: string;
  description: string;
  badge: string;
  details: string[];
  codeSnippet?: string;
}

export const SetupGuide: React.FC = () => {
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [expandedStep, setExpandedStep] = useState<number>(1);
  const [copiedCode, setCopiedCode] = useState(false);

  const steps: GuideStep[] = [
    {
      id: 1,
      title: 'Create & Configure a Telegram Bot',
      description: 'Obtain a Bot Token from Telegram BotFather',
      badge: 'Step 1 of 6',
      details: [
        'Open Telegram and search for @BotFather.',
        'Send /newbot command to start bot creation.',
        'Choose a friendly display name (e.g., Insta Downloader Bot).',
        'Choose a unique bot username ending in "bot" (e.g., my_insta_downloader_bot).',
        'Copy the provided API Bot Token (e.g., 7890123456:AAF...).',
      ],
      codeSnippet: `/newbot
Insta Downloader Bot
my_insta_downloader_bot`,
    },
    {
      id: 2,
      title: 'Prepare Your n8n Automation Environment',
      description: 'Set up Telegram API credentials in n8n Cloud or Self-Hosted instance',
      badge: 'Step 2 of 6',
      details: [
        'Log in to your n8n workspace (n8n Cloud or Docker self-hosted).',
        'Navigate to Credentials on the left sidebar -> Add Credential.',
        'Select "Telegram API".',
        'Paste the Bot Token copied from BotFather in Step 1.',
        'Click Save Credential.',
      ],
    },
    {
      id: 3,
      title: 'Import the Instagram Downloader Workflow',
      description: 'Import Instagram_Downloader.json into n8n canvas',
      badge: 'Step 3 of 6',
      details: [
        'In n8n, click Workflows -> Import from File.',
        'Select the exported Instagram_Downloader.json file (use the "Export n8n Workflow JSON" button in the top navigation bar).',
        'The 7-node pipeline will load onto your n8n canvas.',
      ],
    },
    {
      id: 4,
      title: 'Configure Telegram Nodes',
      description: 'Attach your Telegram credentials to trigger & send video nodes',
      badge: 'Step 4 of 6',
      details: [
        'Double-click on "Telegram Trigger" node.',
        'Select your saved Telegram API credential.',
        'Double-click on "Sent To Telegram Video" node.',
        'Select the same Telegram API credential.',
        'Verify that operation is set to "sendVideo" and binaryData is set to true.',
      ],
    },
    {
      id: 5,
      title: 'Configure HTTP Request Nodes (MediaDL API)',
      description: 'Verify URL & header parameters for extraction endpoints',
      badge: 'Step 5 of 6',
      details: [
        'Node "URL Download": POST https://www.mediadl.app/api/download with body { url: "={{ $json.message.text }}", format: "bestvideo+bestaudio/best" }.',
        'Node "Download": GET https://mediadl.app/api/proxy-download with query parameter fileUrl="={{ $json.medias[0].url }}".',
        'Ensure responseFormat is set to File in the final download node.',
      ],
    },
    {
      id: 6,
      title: 'Activate Workflow & Test in Telegram',
      description: 'Toggle workflow activation switch and send an Instagram link',
      badge: 'Step 6 of 6',
      details: [
        'In the top right corner of your n8n workflow canvas, toggle the "Active" switch to ON.',
        'Open Telegram and start a chat with your new bot.',
        'Send any public Instagram Reel or Video URL (e.g., https://www.instagram.com/reel/C3x9Q2lO1aX/).',
        'The bot will extract and respond with the 1080p MP4 video file within seconds!',
      ],
    },
  ];

  const toggleStepCompleted = (id: number) => {
    if (completedSteps.includes(id)) {
      setCompletedSteps(completedSteps.filter((s) => s !== id));
    } else {
      setCompletedSteps([...completedSteps, id]);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="glass-panel rounded-2xl p-8 border-slate-800 space-y-3 shadow-xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
          <BookOpenIcon className="w-3.5 h-3.5" />
          <span>Step-by-Step Deployment Guide</span>
        </div>
        <h2 className="text-2xl font-bold text-white">
          How to Deploy the Instagram Downloader Telegram Bot in n8n
        </h2>
        <p className="text-sm text-slate-400 max-w-2xl">
          Follow these 6 simple steps to configure BotFather, set up n8n API credentials, and activate automated video delivery.
        </p>

        {/* Progress Tracker */}
        <div className="pt-2 flex items-center justify-between text-xs text-slate-300">
          <span>Deployment Checklist Progress:</span>
          <span className="font-mono text-amber-400 font-bold">
            {completedSteps.length} of {steps.length} Steps Completed
          </span>
        </div>
        <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
          <div
            className="bg-amber-400 h-full transition-all duration-300 ease-out"
            style={{ width: `${(completedSteps.length / steps.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Accordion Steps List */}
      <div className="space-y-4">
        {steps.map((step) => {
          const isDone = completedSteps.includes(step.id);
          const isExpanded = expandedStep === step.id;

          return (
            <div
              key={step.id}
              className={`glass-panel rounded-2xl border transition-all ${
                isDone
                  ? 'border-emerald-500/30 bg-slate-900/40'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <div
                onClick={() => setExpandedStep(isExpanded ? 0 : step.id)}
                className="p-5 flex items-center justify-between cursor-pointer select-none"
              >
                <div className="flex items-center gap-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleStepCompleted(step.id);
                    }}
                    className="p-1 text-slate-400 hover:text-emerald-400 transition-colors"
                  >
                    {isDone ? (
                      <CheckCircle2 className="w-6 h-6 text-emerald-400 fill-emerald-500/20" />
                    ) : (
                      <Circle className="w-6 h-6 text-slate-600" />
                    )}
                  </button>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                        {step.badge}
                      </span>
                      <h3
                        className={`text-base font-bold ${
                          isDone ? 'text-slate-400 line-through' : 'text-white'
                        }`}
                      >
                        {step.title}
                      </h3>
                    </div>
                    <p className="text-xs text-slate-400 pt-0.5">{step.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-slate-400">
                  {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </div>
              </div>

              {isExpanded && (
                <div className="px-6 pb-6 pt-2 border-t border-slate-800/60 space-y-4 text-xs text-slate-300">
                  <ul className="space-y-2 list-disc list-inside">
                    {step.details.map((detail, idx) => (
                      <li key={idx} className="leading-relaxed">
                        {detail}
                      </li>
                    ))}
                  </ul>

                  {step.codeSnippet && (
                    <div className="space-y-1.5 pt-2">
                      <div className="flex items-center justify-between text-[11px] text-slate-400">
                        <span>Command Sequence</span>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(step.codeSnippet || '');
                            setCopiedCode(true);
                            setTimeout(() => setCopiedCode(false), 2000);
                          }}
                          className="flex items-center gap-1 text-pink-400 hover:text-pink-300"
                        >
                          {copiedCode ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                          Copy
                        </button>
                      </div>
                      <pre className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-emerald-400">
                        {step.codeSnippet}
                      </pre>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
};

const BookOpenIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
  </svg>
);
