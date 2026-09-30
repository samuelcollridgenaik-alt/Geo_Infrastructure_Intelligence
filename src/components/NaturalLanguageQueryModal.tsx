/**
 * Natural Language Analytics Query Modal
 * Geo Infrastructure Intelligence
 *
 * Uses Gemini API to translate natural language inquiries into safe,
 * read-only analytics over the project database.
 */

import React, { useState } from 'react';
import { X, Sparkles, Send, ArrowRight, CornerDownLeft, Database } from 'lucide-react';
import { InfrastructureProject } from '../types.ts';

interface NaturalLanguageQueryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProject: (projectId: string) => void;
}

const PRESET_QUERIES = [
  'How many road projects are above 65% progress?',
  'Which infrastructure projects are currently delayed or in moderate condition?',
  'List all projects located in Maharashtra or Gujarat.',
  'What is the highest-budget public works asset currently monitored?',
];

export const NaturalLanguageQueryModal: React.FC<NaturalLanguageQueryModalProps> = ({
  isOpen,
  onClose,
  onSelectProject,
}) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleExecuteQuery = async (queryText?: string) => {
    const q = queryText || query;
    if (!q.trim()) return;

    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const res = await fetch('/api/gemini/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q }),
      });

      if (!res.ok) {
        throw new Error('Query analysis failed');
      }

      const data = await res.json();
      setResponse(data);
    } catch (err: any) {
      setError(err.message || 'Failed to process natural language query');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg max-w-xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Natural Language Infrastructure Analytics Query
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Query Input */}
        <div className="p-4 space-y-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Ask an analytical question about public works, progress, delays..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleExecuteQuery()}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md pl-3 pr-10 py-2 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-purple-500"
            />
            <button
              onClick={() => handleExecuteQuery()}
              disabled={loading || !query.trim()}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1 text-purple-600 dark:text-purple-400 hover:text-purple-700 disabled:opacity-40"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Preset Prompts */}
          <div>
            <span className="text-[11px] text-slate-400">Sample Inquiries:</span>
            <div className="flex flex-wrap gap-1.5 mt-1">
              {PRESET_QUERIES.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setQuery(preset);
                    handleExecuteQuery(preset);
                  }}
                  className="px-2 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-[10px] rounded transition-colors"
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Area */}
        <div className="p-4 pt-0 overflow-y-auto flex-1 space-y-3">
          {loading && (
            <div className="p-6 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4 animate-spin text-purple-500" />
              <span>Translating question and querying database telemetry...</span>
            </div>
          )}

          {error && (
            <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 text-rose-700 text-xs rounded">
              {error}
            </div>
          )}

          {response && (
            <div className="p-4 rounded-lg bg-purple-50/50 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/50 space-y-3 text-xs">
              <div>
                <div className="font-semibold text-slate-900 dark:text-slate-100 mb-1">
                  Query Answer:
                </div>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  {response.answer}
                </p>
              </div>

              {response.insights && (
                <div className="p-2.5 rounded bg-white dark:bg-slate-900 border border-purple-200/50 dark:border-purple-900/40 text-[11px] text-slate-600 dark:text-slate-400">
                  <span className="font-semibold text-purple-700 dark:text-purple-400">Analytical Insight: </span>
                  {response.insights}
                </div>
              )}

              {response.matchingProjects && response.matchingProjects.length > 0 && (
                <div>
                  <div className="font-semibold text-slate-900 dark:text-slate-100 mb-1.5">
                    Matching Infrastructure Assets ({response.matchingProjects.length}):
                  </div>
                  <div className="space-y-1.5">
                    {response.matchingProjects.map((p: any) => (
                      <div
                        key={p.id}
                        onClick={() => {
                          onSelectProject(p.id);
                          onClose();
                        }}
                        className="p-2 bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-800 hover:border-purple-400 cursor-pointer flex items-center justify-between transition-colors"
                      >
                        <div>
                          <span className="font-semibold text-slate-800 dark:text-slate-200">
                            {p.name}
                          </span>
                          <span className="text-[10px] text-slate-400 ml-2 font-mono">
                            {p.code} · {p.district}, {p.state}
                          </span>
                        </div>
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                          {p.currentProgress}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="text-[10px] text-slate-400 pt-2 border-t border-purple-200/40 dark:border-purple-900/40">
                Processed via: {response.source}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
