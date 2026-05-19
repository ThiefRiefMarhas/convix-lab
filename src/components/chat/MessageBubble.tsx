import React from 'react';
import { Wand2, FileText, Copy, Check } from 'lucide-react';
import type { Message } from '../../services/api';

interface MessageBubbleProps {
  message: Message;
  isStreaming?: boolean;
}

/**
 * ChatGPT-style message — no bubbles, clean full-width layout.
 * Supports verdict badges, code blocks, tables, and markdown.
 */
const MessageBubble = React.memo(function MessageBubble({ message, isStreaming = false }: MessageBubbleProps) {
  if (message.role === 'tool' || message.role === 'system') return null;

  const isUser = message.role === 'user';

  return (
    <div className={`group py-4 px-5 ${isUser ? '' : 'bg-[var(--dash-chat-assist-bg)]'}`}>
      <div className="max-w-3xl mx-auto">
        {/* Role label */}
        <div className="flex items-center gap-2 mb-2">
          {isUser ? (
            <div className="w-5 h-5 rounded-md bg-neutral-800 dark:bg-neutral-200 flex items-center justify-center">
              <span className="text-[10px] font-bold text-white dark:text-neutral-900">Y</span>
            </div>
          ) : (
            <div className="w-5 h-5 rounded-md bg-gradient-to-br from-[#ef4d23] to-[#ff7a55] flex items-center justify-center">
              <Wand2 size={10} className="text-white" />
            </div>
          )}
          <span className="text-[13px] font-semibold text-neutral-700 dark:text-neutral-300">
            {isUser ? 'You' : 'Convix'}
          </span>
        </div>

        {/* Attachments */}
        {isUser && message.metadata?.attachments && (
          <div className="flex items-center gap-2 mb-2 ml-7">
            <div className="flex items-center gap-1.5 bg-neutral-100 dark:bg-neutral-800 px-2.5 py-1.5 rounded-lg text-[11px] font-medium text-neutral-600 dark:text-neutral-400">
              <FileText size={12} className="text-neutral-400" />
              <span>{message.metadata.attachments.length} file(s) attached</span>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="ml-7 text-[15px] leading-relaxed text-neutral-800 dark:text-neutral-200 overflow-x-hidden break-words">
          {isUser ? (
            <p className="whitespace-pre-wrap">{message.content}</p>
          ) : (
            <div className="prose-convix">
              {renderMarkdown(message.content)}
              {isStreaming && (
                <span className="inline-block w-0.5 h-5 bg-[#ef4d23] ml-0.5 animate-pulse" />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

export default MessageBubble;

/**
 * Markdown renderer — handles headers, bold, lists, code, tables, verdict badges.
 */
function renderMarkdown(content: string): React.ReactNode {
  if (!content) return null;

  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  let inCodeBlock = false;
  let codeLines: string[] = [];
  let codeLang = '';

  let inTable = false;
  let tableRows: React.ReactNode[][] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Code blocks
    if (line.startsWith('```')) {
      if (inCodeBlock) {
        elements.push(<CodeBlock key={i} code={codeLines.join('\n')} lang={codeLang} />);
        codeLines = [];
        inCodeBlock = false;
      } else {
        codeLang = line.slice(3).trim();
        inCodeBlock = true;
      }
      continue;
    }
    if (inCodeBlock) { codeLines.push(line); continue; }

    // Tables
    if (line.startsWith('|') && line.endsWith('|')) {
      if (line.includes('---')) continue;
      
      const cells = line.split('|').slice(1, -1).map(c => c.trim());
      
      if (!inTable) {
        inTable = true;
        tableRows = [];
      }
      
      tableRows.push(cells.map((cell, cidx) => (
        <td key={cidx} className={`px-4 py-2.5 border-b border-neutral-200 dark:border-neutral-700 ${tableRows.length === 0 ? 'font-semibold bg-neutral-50 dark:bg-neutral-800/50 text-neutral-900 dark:text-neutral-100' : 'text-neutral-700 dark:text-neutral-300'}`}>
          {formatInline(cell)}
        </td>
      )));
      continue;
    } else if (inTable) {
      elements.push(
        <div key={`table-${i}`} className="overflow-x-auto my-4 border border-neutral-200 dark:border-neutral-700 rounded-xl">
          <table className="w-full text-left text-[13px] border-collapse">
            <tbody>
              {tableRows.map((row, ridx) => <tr key={ridx}>{row}</tr>)}
            </tbody>
          </table>
        </div>
      );
      inTable = false;
      tableRows = [];
    }

    // Verdict markers
    if (line.includes('[VERDICT:GREEN]') || line.includes('[VERDICT:YELLOW]') || line.includes('[VERDICT:RED]')) {
      const verdictType = line.includes('[VERDICT:GREEN]') ? 'green' : line.includes('[VERDICT:YELLOW]') ? 'yellow' : 'red';
      const cleanLine = line.replace(/\[VERDICT:(GREEN|YELLOW|RED)\]/g, '').trim();
      const icon = verdictType === 'green' ? '✅' : verdictType === 'yellow' ? '⚠️' : '🚫';
      const label = verdictType === 'green' ? 'Recommended' : verdictType === 'yellow' ? 'Caution' : 'Not Recommended';
      
      elements.push(
        <div key={i} className="my-4">
          <span className={`verdict-badge verdict-${verdictType}`}>
            <span>{icon}</span>
            <span>{label}</span>
          </span>
          {cleanLine && <p className="mt-3 font-medium">{formatInline(cleanLine)}</p>}
        </div>
      );
      continue;
    }

    // Blockquotes
    if (line.startsWith('> ')) {
      elements.push(
        <blockquote key={i} className="border-l-4 border-[#ef4d23] bg-orange-50/30 dark:bg-orange-950/20 pl-4 pr-2 py-2 my-3 rounded-r-lg text-neutral-700 dark:text-neutral-300 italic">
          {formatInline(line.slice(2))}
        </blockquote>
      );
      continue;
    }

    // Headers
    if (line.startsWith('### ')) {
      elements.push(<h4 key={i} className="font-semibold text-[13px] mt-6 mb-2 uppercase tracking-wide text-neutral-500 dark:text-neutral-400 flex items-center gap-2">{formatInline(line.slice(4))}</h4>);
    } else if (line.startsWith('## ')) {
      elements.push(<h3 key={i} className="font-bold text-[16px] mt-6 mb-3 text-neutral-900 dark:text-neutral-100">{formatInline(line.slice(3))}</h3>);
    } else if (line.startsWith('# ')) {
      elements.push(<h2 key={i} className="font-bold text-[18px] mt-6 mb-3 text-neutral-900 dark:text-neutral-100">{formatInline(line.slice(2))}</h2>);
    }
    // Horizontal rule
    else if (line.trim() === '---' || line.trim() === '***') {
      elements.push(<hr key={i} className="my-6 border-neutral-200 dark:border-neutral-700" />);
    }
    // Bullet points
    else if (line.match(/^\s*[-*]\s/)) {
      const indent = line.search(/\S/);
      const text = line.replace(/^\s*[-*]\s/, '');
      elements.push(
        <div key={i} className="flex gap-2.5 py-1" style={{ paddingLeft: Math.max(0, indent * 4) }}>
          <span className="text-[#ef4d23] shrink-0 mt-[7px] text-[6px]">●</span>
          <span>{formatInline(text)}</span>
        </div>
      );
    }
    // Numbered lists
    else if (/^\s*\d+\.\s/.test(line)) {
      const num = line.match(/(\d+)\.\s/)![1];
      const text = line.replace(/^\s*\d+\.\s/, '');
      elements.push(
        <div key={i} className="flex gap-2.5 py-1">
          <span className="text-[#ef4d23] font-semibold shrink-0 text-[14px] min-w-[20px] text-right">{num}.</span>
          <span>{formatInline(text)}</span>
        </div>
      );
    }
    // Empty line
    else if (line.trim() === '') {
      elements.push(<div key={i} className="h-3" />);
    }
    // Normal text
    else {
      elements.push(<p key={i} className="py-1">{formatInline(line)}</p>);
    }
  }

  if (inTable) {
    elements.push(
      <div key={`table-end`} className="overflow-x-auto my-4 border border-neutral-200 dark:border-neutral-700 rounded-xl">
        <table className="w-full text-left text-[13px] border-collapse">
          <tbody>
            {tableRows.map((row, ridx) => <tr key={ridx}>{row}</tr>)}
          </tbody>
        </table>
      </div>
    );
  }

  return <>{elements}</>;
}

/**
 * Code block with copy button and syntax highlighting hint.
 */
function CodeBlock({ code, lang }: { code: string; lang: string; key?: string | number }) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <pre className="bg-neutral-900 text-neutral-100 rounded-xl p-4 my-3 text-[13px] font-mono overflow-x-auto relative group">
      <button
        onClick={handleCopy}
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-neutral-800 hover:bg-neutral-700 px-2.5 py-1.5 rounded-lg text-xs flex items-center gap-1.5 text-neutral-300"
      >
        {copied ? <><Check size={12} /> Copied</> : <><Copy size={12} /> Copy</>}
      </button>
      {lang && <div className="text-[10px] text-neutral-500 mb-2 uppercase tracking-wider">{lang}</div>}
      <code className="block whitespace-pre-wrap break-all">{code}</code>
    </pre>
  );
}

/**
 * Inline text formatting — handles bold, citations, inline code.
 * Returns a flat array of React nodes.
 */
function formatInline(text: string): React.ReactNode {
  if (!text) return null;

  // Split on bold markers
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  const result: React.ReactNode[] = [];

  parts.forEach((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      result.push(<strong key={`b-${i}`} className="font-semibold text-neutral-900 dark:text-white">{part.slice(2, -2)}</strong>);
      return;
    }
    
    // Split on citations
    const citeParts = part.split(/(\[\d+\])/g);
    citeParts.forEach((cp, j) => {
      if (/^\[\d+\]$/.test(cp)) {
        result.push(
          <sup key={`cite-${i}-${j}`} className="ml-0.5 cursor-pointer text-[10px] font-bold text-[#ef4d23] hover:text-[#d9441f]">
            {cp}
          </sup>
        );
        return;
      }
      
      // Inline code
      const codeParts = cp.split(/(`[^`]+`)/g);
      codeParts.forEach((ccp, k) => {
        if (ccp.startsWith('`') && ccp.endsWith('`')) {
          result.push(
            <code key={`code-${i}-${j}-${k}`} className="bg-neutral-100 dark:bg-neutral-800 text-[#c7254e] dark:text-[#ff8ca3] px-1.5 py-0.5 rounded text-[13px] font-mono">
              {ccp.slice(1, -1)}
            </code>
          );
          return;
        }
        if (ccp) {
          result.push(<React.Fragment key={`text-${i}-${j}-${k}`}>{ccp}</React.Fragment>);
        }
      });
    });
  });

  return <>{result}</>;
}
