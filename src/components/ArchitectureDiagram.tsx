import React from 'react';
import { Search, Brain, FileText, ArrowRight, ShieldCheck, Zap, DollarSign, Database, CheckCircle2 } from 'lucide-react';

export const ArchitectureDiagram: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2">
          <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
            SYSTEM ARCHITECTURE & MULTI-AGENT SPECIFICATION
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-2">
          Autonomous Research Crew Pipeline
        </h1>
        <p className="text-sm text-slate-400 mt-1 max-w-3xl">
          Sequential execution architecture built with CrewAI, LangChain, Tavily API, and Streamlit,
          optimized for cost efficiency with <code className="text-cyan-300 font-mono">gpt-4o-mini</code>.
        </p>
      </div>

      {/* Visual Sequence Flow Diagram */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center justify-between pb-6 border-b border-slate-800 mb-8">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-400" />
              Process.sequential Pipeline Execution
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Strict deterministic state progression with explicit context hand-offs between agents.
            </p>
          </div>
          <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-full text-xs font-semibold">
            Memory Enabled
          </span>
        </div>

        {/* 3 Step Cards Flow */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          {/* Agent 1 */}
          <div className="bg-slate-950/80 border border-blue-500/30 rounded-2xl p-5 shadow-lg relative flex flex-col justify-between">
            <div className="absolute -top-3 left-4 px-2 py-0.5 bg-blue-600 text-white rounded text-[10px] font-bold tracking-wider uppercase">
              Agent 01 · Research
            </div>
            <div>
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-4 mt-1">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">Senior Web Researcher</h3>
              <p className="text-xs text-blue-400 font-medium mb-3">Tavily Search Specialist</p>
              <p className="text-xs text-slate-300 leading-relaxed">
                Formulates targeted search queries, pulls primary sources, academic preprints, verified CAGR numbers, and official filings.
              </p>
            </div>

            <div className="mt-6 pt-3 border-t border-slate-800 space-y-2 text-[11px]">
              <div className="flex justify-between text-slate-400">
                <span>Tool:</span>
                <span className="font-mono text-cyan-300">TavilySearchResults</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Output:</span>
                <span className="text-slate-200 font-medium">Raw Fact Dossier</span>
              </div>
            </div>
          </div>

          {/* Agent 2 */}
          <div className="bg-slate-950/80 border border-indigo-500/30 rounded-2xl p-5 shadow-lg relative flex flex-col justify-between">
            <div className="absolute -top-3 left-4 px-2 py-0.5 bg-indigo-600 text-white rounded text-[10px] font-bold tracking-wider uppercase">
              Agent 02 · Analysis
            </div>
            <div>
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-4 mt-1">
                <Brain className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">Lead Market Analyst</h3>
              <p className="text-xs text-indigo-400 font-medium mb-3">Quantitative & Strategy Modeling</p>
              <p className="text-xs text-slate-300 leading-relaxed">
                Filters marketing hype, isolates durable macro/micro trends, evaluates bottlenecks, and establishes competitive moats.
              </p>
            </div>

            <div className="mt-6 pt-3 border-t border-slate-800 space-y-2 text-[11px]">
              <div className="flex justify-between text-slate-400">
                <span>Tool:</span>
                <span className="text-slate-400 italic">None (Pure LLM Reasoning)</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Input:</span>
                <span className="text-slate-200 font-medium">context=[research_task]</span>
              </div>
            </div>
          </div>

          {/* Agent 3 */}
          <div className="bg-slate-950/80 border border-emerald-500/30 rounded-2xl p-5 shadow-lg relative flex flex-col justify-between">
            <div className="absolute -top-3 left-4 px-2 py-0.5 bg-emerald-600 text-white rounded text-[10px] font-bold tracking-wider uppercase">
              Agent 03 · Editorial
            </div>
            <div>
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4 mt-1">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">Executive Editor</h3>
              <p className="text-xs text-emerald-400 font-medium mb-3">C-Suite Intelligence Briefing</p>
              <p className="text-xs text-slate-300 leading-relaxed">
                Transforms analytics into an executive-ready Markdown report with KPI cards, strategic roadmaps, risk matrices, and citations.
              </p>
            </div>

            <div className="mt-6 pt-3 border-t border-slate-800 space-y-2 text-[11px]">
              <div className="flex justify-between text-slate-400">
                <span>Tool:</span>
                <span className="text-slate-400 italic">None (Editorial Synthesis)</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Final Output:</span>
                <span className="text-emerald-300 font-semibold">Executive Markdown (.md)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Deep-Dive Specifications Table */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* LLM Cost & Performance Analysis */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center space-x-2 text-white font-bold text-base">
            <DollarSign className="w-5 h-5 text-emerald-400" />
            <span>LLM Backbone: Why gpt-4o-mini?</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Multi-agent systems execute iterative scratchpad loops, system prompts, memory embeddings, and tool observations.
            Using <code className="text-cyan-300 font-mono">gpt-4o-mini</code> delivers high-level reasoning while slashing token expenditure by up to 90%.
          </p>

          <div className="overflow-hidden rounded-xl border border-slate-800 text-xs">
            <table className="w-full text-left">
              <thead className="bg-slate-950 text-slate-400">
                <tr>
                  <th className="p-3">Model</th>
                  <th className="p-3">Input / 1M</th>
                  <th className="p-3">Output / 1M</th>
                  <th className="p-3">Typical Crew Run</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                <tr className="bg-blue-500/10 text-white font-semibold">
                  <td className="p-3 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                    gpt-4o-mini (Selected)
                  </td>
                  <td className="p-3">$0.15</td>
                  <td className="p-3">$0.60</td>
                  <td className="p-3 text-emerald-400">~$0.003</td>
                </tr>
                <tr>
                  <td className="p-3 text-slate-400">gpt-4o (Standard)</td>
                  <td className="p-3">$2.50</td>
                  <td className="p-3">$10.00</td>
                  <td className="p-3 text-slate-400">~$0.06</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Why Tavily Search Tool */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center space-x-2 text-white font-bold text-base">
            <Database className="w-5 h-5 text-cyan-400" />
            <span>Web Tooling: Why TavilySearchResults?</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Unlike generic web scrapers that choke on cookie banners, JavaScript SPAs, and raw HTML markup,
            <code className="text-cyan-300 font-mono">TavilySearchResults</code> was built specifically for Autonomous LLM Agents:
          </p>

          <ul className="space-y-2 text-xs text-slate-300">
            <li className="flex items-start space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span><strong>Cleansed Markdown Extraction</strong>: Extracts purely semantic content with zero advertisement noise.</span>
            </li>
            <li className="flex items-start space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span><strong>Advanced Relevance Scoring</strong>: Ranks search results by factual density and primary source credibility.</span>
            </li>
            <li className="flex items-start space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span><strong>Direct LangChain Integration</strong>: Native compatibility with <code className="text-slate-200 font-mono">langchain_community.tools.tavily_search</code>.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
