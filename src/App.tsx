/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import JSZip from 'jszip';
import { Navbar } from './components/Navbar';
import { LiveResearchStudio } from './components/LiveResearchStudio';
import { CodebaseExplorer } from './components/CodebaseExplorer';
import { ArchitectureDiagram } from './components/ArchitectureDiagram';
import { PYTHON_FILES } from './data/pythonCodebase';
import { Terminal, Shield, Zap, Sparkles } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'studio' | 'codebase' | 'architecture'>('studio');

  const handleDownloadZip = async () => {
    const zip = new JSZip();
    const folder = zip.folder('autonomous-research-crew');

    PYTHON_FILES.forEach((file) => {
      folder?.file(file.path, file.content);
    });

    const content = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(content);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'autonomous-research-crew.zip';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-500/30 selection:text-cyan-200">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onDownloadZip={handleDownloadZip}
      />

      {/* Main Tab Content */}
      <main className="flex-1">
        {activeTab === 'studio' && <LiveResearchStudio />}
        {activeTab === 'codebase' && <CodebaseExplorer onDownloadZip={handleDownloadZip} />}
        {activeTab === 'architecture' && <ArchitectureDiagram />}
      </main>

      {/* Global Executive Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-8 px-4 sm:px-6 lg:px-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <span className="font-semibold text-slate-400">CrewAI Autonomous Swarm</span>
            <span>•</span>
            <span>LangChain Tavily Grounding</span>
            <span>•</span>
            <span>Streamlit Interface</span>
          </div>

          <div className="flex items-center space-x-6 text-slate-400">
            <button
              onClick={() => setActiveTab('studio')}
              className="hover:text-cyan-400 transition-colors cursor-pointer"
            >
              Studio
            </button>
            <button
              onClick={() => setActiveTab('codebase')}
              className="hover:text-cyan-400 transition-colors cursor-pointer"
            >
              Codebase
            </button>
            <button
              onClick={() => setActiveTab('architecture')}
              className="hover:text-cyan-400 transition-colors cursor-pointer"
            >
              Architecture
            </button>
            <button
              onClick={handleDownloadZip}
              className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors cursor-pointer"
            >
              Download .zip
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
