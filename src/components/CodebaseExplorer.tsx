import React, { useState } from 'react';
import { Copy, Check, Download, FileCode, FolderGit2, Sparkles, Terminal } from 'lucide-react';
import { PYTHON_FILES, FOLDER_STRUCTURE_TEXT } from '../data/pythonCodebase';
import { FileItem } from '../types';

interface CodebaseExplorerProps {
  onDownloadZip: () => void;
}

export const CodebaseExplorer: React.FC<CodebaseExplorerProps> = ({ onDownloadZip }) => {
  const [selectedFile, setSelectedFile] = useState<string>('agents.py');
  const [copied, setCopied] = useState<boolean>(false);

  const activeFile = PYTHON_FILES.find((f) => f.name === selectedFile) || PYTHON_FILES[0];

  const handleCopy = () => {
    navigator.clipboard.writeText(activeFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lines = activeFile.content.split('\n');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 mb-6 border-b border-slate-800 gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/30">
              PYTHON ARCHITECTURE BLUEPRINT
            </span>
            <span className="text-xs text-slate-400">CrewAI 0.86+ · LangChain · Streamlit</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            Autonomous Research Team Codebase
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Production-ready, heavily commented Python source files. Zero placeholders, fully functional.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={onDownloadZip}
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-xs rounded-xl shadow-lg shadow-blue-500/20 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download Full Project (.zip)</span>
          </button>
        </div>
      </div>

      {/* Main Grid: File Tree + Code Viewer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: File Tree & Project Structure */}
        <div className="lg:col-span-4 space-y-4">
          {/* File Selector */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <FileCode className="w-4 h-4 text-cyan-400" />
                Project Deliverables ({PYTHON_FILES.length})
              </span>
            </div>

            <div className="space-y-1.5">
              {PYTHON_FILES.map((file) => {
                const isSelected = file.name === selectedFile;
                return (
                  <button
                    key={file.name}
                    onClick={() => setSelectedFile(file.name)}
                    className={`w-full text-left px-3 py-2.5 rounded-xl transition-all flex items-center justify-between group cursor-pointer ${
                      isSelected
                        ? 'bg-blue-600 text-white font-medium shadow-md shadow-blue-600/30'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5 truncate">
                      <span className="font-mono text-xs">{file.name}</span>
                    </div>
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded uppercase font-mono ${
                        isSelected ? 'bg-blue-700/80 text-blue-100' : 'bg-slate-800 text-slate-400 group-hover:bg-slate-700'
                      }`}
                    >
                      {file.language}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Folder Hierarchy Visualizer Card */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 shadow-xl">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <FolderGit2 className="w-4 h-4 text-emerald-400" />
                Repository Structure
              </span>
            </div>
            <pre className="text-xs font-mono text-slate-300 bg-slate-950/80 p-3 rounded-xl overflow-x-auto leading-relaxed border border-slate-800/80">
              {FOLDER_STRUCTURE_TEXT}
            </pre>
          </div>

          {/* Quick Setup Cheat Sheet */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-4 shadow-xl text-xs space-y-2.5">
            <div className="font-bold text-slate-200 flex items-center gap-1.5">
              <Terminal className="w-4 h-4 text-yellow-400" />
              Quick Run Command
            </div>
            <div className="bg-slate-950 border border-slate-800 p-2.5 rounded-xl font-mono text-cyan-300">
              $ streamlit run app.py
            </div>
            <p className="text-slate-400 leading-normal text-[11px]">
              Or run the CLI version directly with <code className="text-slate-200 bg-slate-800 px-1 rounded">python crew.py</code>.
            </p>
          </div>
        </div>

        {/* Right Column: Code Viewer */}
        <div className="lg:col-span-8">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl shadow-xl overflow-hidden flex flex-col h-[760px]">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3.5 bg-slate-950/80 border-b border-slate-800">
              <div className="flex items-center space-x-3">
                <div className="flex space-x-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                </div>
                <span className="font-mono text-xs font-semibold text-slate-200">
                  {activeFile.path}
                </span>
                <span className="hidden sm:inline-block text-[11px] text-slate-500">
                  ({lines.length} lines)
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={handleCopy}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-all cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-400" />
                      <span>Copy Code</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Description bar */}
            <div className="px-5 py-2 bg-slate-900 border-b border-slate-800/80 text-xs text-slate-400">
              {activeFile.description}
            </div>

            {/* Code Body with Line Numbers */}
            <div className="flex-1 overflow-auto bg-slate-950 font-mono text-xs p-4 leading-relaxed">
              <div className="table w-full">
                {lines.map((line, idx) => (
                  <div key={idx} className="table-row hover:bg-slate-900/60 transition-colors">
                    <span className="table-cell pr-4 text-right select-none text-slate-600 font-mono text-[11px] w-10">
                      {idx + 1}
                    </span>
                    <span className="table-cell whitespace-pre text-slate-200">
                      {formatCodeLine(line, activeFile.language)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Light syntax highlighting helper
function formatCodeLine(line: string, language: string) {
  if (language === 'python') {
    if (line.trim().startsWith('#')) {
      return <span className="text-slate-500 italic">{line}</span>;
    }
    if (line.trim().startsWith('"""') || line.trim().startsWith("'''") || line.includes('"""')) {
      return <span className="text-emerald-400/90 italic">{line}</span>;
    }
    if (line.includes('def ') || line.includes('class ')) {
      return <span className="text-blue-400 font-bold">{line}</span>;
    }
    if (line.includes('import ') || line.includes('from ')) {
      return <span className="text-purple-400">{line}</span>;
    }
    if (line.includes('return ') || line.includes('raise ')) {
      return <span className="text-pink-400 font-semibold">{line}</span>;
    }
  }

  if (language === 'shell' || language === 'dotenv') {
    if (line.trim().startsWith('#')) {
      return <span className="text-slate-500 italic">{line}</span>;
    }
    if (line.includes('=')) {
      const [k, ...v] = line.split('=');
      return (
        <span>
          <span className="text-cyan-400">{k}</span>=
          <span className="text-emerald-300">{v.join('=')}</span>
        </span>
      );
    }
  }

  return <span>{line}</span>;
}
