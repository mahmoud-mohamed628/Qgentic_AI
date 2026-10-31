import React from 'react';

interface MarkdownRendererProps {
  content: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  // Simple, robust Markdown parser tailored for Executive Reports
  const renderFormattedMarkdown = (raw: string) => {
    const lines = raw.split('\n');
    const elements: React.ReactNode[] = [];
    let inTable = false;
    let tableRows: string[][] = [];
    let inCodeBlock = false;
    let codeBlockLines: string[] = [];
    let codeLanguage = '';

    const flushTable = (key: number) => {
      if (tableRows.length > 0) {
        const [headerRow, ...bodyRows] = tableRows;
        // Filter out divider row (contains dashes)
        const cleanBody = bodyRows.filter(
          (row) => !row.every((cell) => cell.trim().match(/^:?-+:?$/))
        );

        elements.push(
          <div key={`table-${key}`} className="my-6 overflow-x-auto rounded-xl border border-slate-700/80 shadow-md">
            <table className="min-w-full divide-y divide-slate-700 bg-slate-900 text-sm">
              <thead className="bg-slate-800/90 text-left text-xs font-semibold uppercase tracking-wider text-slate-300">
                <tr>
                  {headerRow.map((cell, idx) => (
                    <th key={idx} className="px-4 py-3 border-r border-slate-700/50 last:border-r-0">
                      {cell.trim()}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 font-sans text-slate-200">
                {cleanBody.map((row, rIdx) => (
                  <tr key={rIdx} className={rIdx % 2 === 0 ? 'bg-slate-900/80 hover:bg-slate-800/50' : 'bg-slate-900/40 hover:bg-slate-800/50'}>
                    {row.map((cell, cIdx) => (
                      <td key={cIdx} className="px-4 py-2.5 whitespace-normal border-r border-slate-800/60 last:border-r-0">
                        {renderInlineFormatting(cell.trim())}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
        tableRows = [];
        inTable = false;
      }
    };

    const flushCodeBlock = (key: number) => {
      if (codeBlockLines.length > 0) {
        elements.push(
          <div key={`code-${key}`} className="my-4 rounded-xl border border-slate-800 bg-slate-950 p-4 font-mono text-xs text-emerald-400 overflow-x-auto">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-[10px] text-slate-400 font-sans uppercase">
              <span>{codeLanguage || 'Code'}</span>
              <span>Syntax</span>
            </div>
            <pre className="whitespace-pre">{codeBlockLines.join('\n')}</pre>
          </div>
        );
        codeBlockLines = [];
        inCodeBlock = false;
      }
    };

    lines.forEach((line, index) => {
      // Code block detection
      if (line.startsWith('```')) {
        if (inCodeBlock) {
          flushCodeBlock(index);
        } else {
          flushTable(index);
          inCodeBlock = true;
          codeLanguage = line.replace('```', '').trim();
        }
        return;
      }

      if (inCodeBlock) {
        codeBlockLines.push(line);
        return;
      }

      // Markdown Table detection
      if (line.trim().startsWith('|') && line.trim().endsWith('|')) {
        inTable = true;
        const cells = line
          .trim()
          .split('|')
          .slice(1, -1);
        tableRows.push(cells);
        return;
      } else if (inTable) {
        flushTable(index);
      }

      // Headings
      if (line.startsWith('# ')) {
        elements.push(
          <div key={index} className="pt-4 pb-2 border-b border-slate-700/60 mb-4">
            <span className="inline-block px-2.5 py-0.5 text-xs font-semibold rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-2">
              EXECUTIVE BRIEFING DELIVERABLE
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {line.replace('# ', '')}
            </h1>
          </div>
        );
      } else if (line.startsWith('## ')) {
        elements.push(
          <h2 key={index} className="text-xl sm:text-2xl font-bold text-slate-100 mt-8 mb-3 flex items-center gap-2 border-l-4 border-blue-500 pl-3">
            {line.replace('## ', '')}
          </h2>
        );
      } else if (line.startsWith('### ')) {
        elements.push(
          <h3 key={index} className="text-lg font-semibold text-cyan-300 mt-6 mb-2">
            {line.replace('### ', '')}
          </h3>
        );
      } else if (line.startsWith('#### ')) {
        elements.push(
          <h4 key={index} className="text-base font-medium text-slate-300 mt-4 mb-2">
            {line.replace('#### ', '')}
          </h4>
        );
      } else if (line.startsWith('> ')) {
        // Blockquote
        elements.push(
          <div key={index} className="my-4 pl-4 border-l-4 border-cyan-500/80 bg-cyan-950/20 py-2.5 pr-4 rounded-r-lg text-slate-200 text-sm italic">
            {renderInlineFormatting(line.replace('> ', ''))}
          </div>
        );
      } else if (line.startsWith('---')) {
        // Horizontal Rule
        elements.push(<hr key={index} className="my-6 border-slate-800" />);
      } else if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
        // Bullet list item
        const text = line.trim().replace(/^[-*]\s+/, '');
        elements.push(
          <li key={index} className="ml-5 list-disc text-slate-300 text-sm leading-relaxed my-1.5 pl-1 marker:text-cyan-400">
            {renderInlineFormatting(text)}
          </li>
        );
      } else if (/^\d+\.\s+/.test(line.trim())) {
        // Numbered list item
        const text = line.trim().replace(/^\d+\.\s+/, '');
        elements.push(
          <li key={index} className="ml-6 list-decimal text-slate-300 text-sm leading-relaxed my-1.5 pl-1 marker:text-blue-400">
            {renderInlineFormatting(text)}
          </li>
        );
      } else if (line.trim() === '') {
        // Empty line spacer
        elements.push(<div key={index} className="h-2" />);
      } else {
        // Regular paragraph
        elements.push(
          <p key={index} className="text-slate-300 text-sm sm:text-base leading-relaxed my-2">
            {renderInlineFormatting(line)}
          </p>
        );
      }
    });

    if (inTable) flushTable(lines.length);
    if (inCodeBlock) flushCodeBlock(lines.length);

    return elements;
  };

  // Inline formatting helper: Bold, Italics, Code, Links
  const renderInlineFormatting = (text: string): React.ReactNode => {
    // Split by bold (**text**)
    const parts = text.split(/(\*\*.*?\*\*|`.*?`|\[.*?\]\(.*?\))/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={i} className="font-semibold text-white">
            {part.slice(2, -2)}
          </strong>
        );
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return (
          <code key={i} className="px-1.5 py-0.5 rounded bg-slate-800 text-cyan-300 font-mono text-xs border border-slate-700">
            {part.slice(1, -1)}
          </code>
        );
      }
      if (part.startsWith('[') && part.includes('](') && part.endsWith(')')) {
        const linkMatch = part.match(/\[(.*?)\]\((.*?)\)/);
        if (linkMatch) {
          const [, label, url] = linkMatch;
          return (
            <a
              key={i}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-400 underline decoration-cyan-500/50 hover:text-cyan-300"
            >
              {label}
            </a>
          );
        }
      }
      return part;
    });
  };

  return <div className="markdown-body font-sans">{renderFormattedMarkdown(content)}</div>;
};
