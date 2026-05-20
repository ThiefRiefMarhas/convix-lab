import React from 'react';
import { FileText, Copy, Check } from 'lucide-react';
import type { Message } from '../../services/api';
import { IntelligenceLogo } from './ChatPanel';

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
            <div className="w-5 h-5 rounded-md bg-gradient-to-br from-[#ef4d23] to-[#ff7a55] flex items-center justify-center p-0.5">
              <IntelligenceLogo className="text-white w-full h-full" />
            </div>
          )}
          <span className="text-[13px] font-semibold text-neutral-700 dark:text-neutral-300">
            {isUser ? 'You' : 'Convix'}
          </span>
        </div>

        {/* Attachments */}
        {isUser && message.metadata?.attachments && Array.isArray(message.metadata.attachments) && message.metadata.attachments.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3 ml-7">
            {message.metadata.attachments.map((file: any, idx: number) => {
              const fileName = typeof file === 'object' && file ? file.name : `Document #${idx + 1}`;
              return (
                <div key={idx} className="flex items-center gap-2 bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200/60 dark:border-neutral-700/60 px-3 py-2 rounded-xl text-xs font-semibold text-neutral-700 dark:text-neutral-300 shadow-sm max-w-[240px] transition-all hover:border-[#ef4d23]/30">
                  <div className="p-1.5 rounded-lg bg-orange-50 dark:bg-orange-950/30 text-[#ef4d23]">
                    <FileText size={14} />
                  </div>
                  <span className="truncate flex-1 pr-1" title={fileName}>{fileName}</span>
                </div>
              );
            })}
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
function renderTable(rows: string[][], key: string | number): React.ReactNode {
  if (rows.length === 0) return null;
  const headers = rows[0];
  const bodyRows = rows.slice(1);

  return (
    <div key={key} className="overflow-x-auto my-4 border border-neutral-200 dark:border-neutral-700 rounded-xl shadow-sm">
      <table className="w-full text-left text-[13.5px] border-collapse">
        <thead>
          <tr className="bg-neutral-50 dark:bg-neutral-800/60 border-b border-neutral-200 dark:border-neutral-700">
            {headers.map((cell, cidx) => (
              <th key={cidx} className="px-4 py-3 font-semibold text-neutral-900 dark:text-neutral-100 border-r border-neutral-200 dark:border-neutral-700 last:border-r-0">
                {formatInline(cell)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {bodyRows.map((row, ridx) => {
            // Pad row if it has fewer cells than headers to keep structure aligned
            const cells = [...row];
            while (cells.length < headers.length) {
              cells.push('');
            }
            return (
              <tr key={ridx} className="border-b border-neutral-200 dark:border-neutral-700 last:border-b-0 hover:bg-neutral-50/50 dark:hover:bg-neutral-800/30 transition-colors">
                {cells.slice(0, headers.length).map((cell, cidx) => (
                  <td key={cidx} className="px-4 py-2.5 text-neutral-700 dark:text-neutral-300 border-r border-neutral-200 dark:border-neutral-700 last:border-r-0">
                    {formatInline(cell)}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function renderMarkdown(content: string): React.ReactNode {
  if (!content) return null;

  // Normalize line endings and split
  const lines = content.replace(/\r\n/g, '\n').split('\n');
  const elements: React.ReactNode[] = [];
  let inCodeBlock = false;
  let codeLines: string[] = [];
  let codeLang = '';

  let inTable = false;
  let tableRows: string[][] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Code blocks
    if (trimmed.startsWith('```')) {
      if (inCodeBlock) {
        elements.push(<CodeBlock key={i} code={codeLines.join('\n')} lang={codeLang} />);
        codeLines = [];
        inCodeBlock = false;
      } else {
        codeLang = trimmed.slice(3).trim();
        inCodeBlock = true;
      }
      continue;
    }
    if (inCodeBlock) {
      codeLines.push(line);
      continue;
    }

    // Tables
    const isTableRow = trimmed.startsWith('|');

    if (isTableRow) {
      // Check if it's a separator line (e.g. |---|---|)
      const isSeparator = /^[|:\-\s]+$/.test(trimmed);
      if (isSeparator) {
        continue;
      }

      // Extract cells robustly
      const cells = trimmed.split('|').map(c => c.trim());
      if (trimmed.startsWith('|')) cells.shift();
      if (trimmed.endsWith('|') && cells.length > 0) cells.pop();

      if (!inTable) {
        inTable = true;
        tableRows = [cells];
      } else {
        tableRows.push(cells);
      }
      continue;
    } else {
      // If we were in a table, render it now
      if (inTable) {
        elements.push(renderTable(tableRows, `table-${i}`));
        inTable = false;
        tableRows = [];
      }
    }

    // Verdict markers
    if (trimmed.includes('[VERDICT:GREEN]') || trimmed.includes('[VERDICT:YELLOW]') || trimmed.includes('[VERDICT:RED]')) {
      const verdictType = trimmed.includes('[VERDICT:GREEN]') ? 'green' : trimmed.includes('[VERDICT:YELLOW]') ? 'yellow' : 'red';
      const cleanLine = trimmed.replace(/\[VERDICT:(GREEN|YELLOW|RED)\]/g, '').trim();
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
    if (trimmed.startsWith('&gt;') || trimmed.startsWith('>')) {
      const quoteText = trimmed.replace(/^(&gt;|>)\s*/, '');
      elements.push(
        <blockquote key={i} className="border-l-4 border-[#ef4d23] bg-orange-50/30 dark:bg-orange-950/20 pl-4 pr-2 py-2 my-3 rounded-r-lg text-neutral-700 dark:text-neutral-300 italic">
          {formatInline(quoteText)}
        </blockquote>
      );
      continue;
    }

    // Headers
    if (trimmed.startsWith('#')) {
      const headerLevel = (trimmed.match(/^#+/) || [''])[0].length;
      const headerText = trimmed.replace(/^#+\s*/, '');
      
      if (headerLevel === 1) {
        elements.push(<h2 key={i} className="font-bold text-[18px] mt-6 mb-3 text-neutral-900 dark:text-neutral-100">{formatInline(headerText)}</h2>);
      } else if (headerLevel === 2) {
        elements.push(<h3 key={i} className="font-bold text-[16px] mt-6 mb-3 text-neutral-900 dark:text-neutral-100">{formatInline(headerText)}</h3>);
      } else {
        elements.push(<h4 key={i} className="font-semibold text-[13px] mt-6 mb-2 uppercase tracking-wide text-neutral-500 dark:text-neutral-400 flex items-center gap-2">{formatInline(headerText)}</h4>);
      }
    }
    // Horizontal rule
    else if (trimmed === '---' || trimmed === '***') {
      elements.push(<hr key={i} className="my-6 border-neutral-200 dark:border-neutral-700" />);
    }
    // Bullet points
    else if (trimmed.match(/^[-*]\s/)) {
      const indent = line.search(/\S/);
      const text = trimmed.replace(/^[-*]\s/, '');
      elements.push(
        <div key={i} className="flex gap-2.5 py-1" style={{ paddingLeft: Math.max(0, indent * 4) }}>
          <span className="text-[#ef4d23] shrink-0 mt-[7px] text-[6px]">●</span>
          <span>{formatInline(text)}</span>
        </div>
      );
    }
    // Numbered lists
    else if (/^\d+\.\s/.test(trimmed)) {
      const match = trimmed.match(/^(\d+)\.\s(.*)/);
      if (match) {
        const num = match[1];
        const text = match[2];
        elements.push(
          <div key={i} className="flex gap-2.5 py-1">
            <span className="text-[#ef4d23] font-semibold shrink-0 text-[14px] min-w-[20px] text-right">{num}.</span>
            <span>{formatInline(text)}</span>
          </div>
        );
      }
    }
    // Empty line
    else if (trimmed === '') {
      elements.push(<div key={i} className="h-3" />);
    }
    // Normal text
    else {
      elements.push(<p key={i} className="py-1">{formatInline(trimmed)}</p>);
    }
  }

  if (inTable) {
    elements.push(renderTable(tableRows, 'table-end'));
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

function formatInline(text: string): React.ReactNode {
  if (!text) return null;

  interface FormatNode {
    type: 'text' | 'code' | 'cite' | 'bold' | 'italic';
    val: string;
    children?: FormatNode[];
  }

  // Phase 1: Code blocks (no nested formatting allowed inside inline code)
  let nodes: FormatNode[] = [];
  const codeParts = text.split(/(`[^`]+`)/g);
  codeParts.forEach(part => {
    if (part.startsWith('`') && part.endsWith('`') && part.length > 2) {
      nodes.push({ type: 'code', val: part.slice(1, -1) });
    } else if (part) {
      nodes.push({ type: 'text', val: part });
    }
  });

  // Phase 2: Citations (no nested formatting allowed)
  nodes = nodes.flatMap((node): FormatNode[] => {
    if (node.type !== 'text') return [node];
    const citeParts = node.val.split(/(\[\d+\])/g);
    return citeParts.map((part): FormatNode => {
      if (/^\[\d+\]$/.test(part)) {
        return { type: 'cite', val: part };
      }
      return { type: 'text', val: part };
    }).filter(n => n.val !== '');
  });

  // Phase 3: Bold (** or __)
  nodes = nodes.flatMap((node): FormatNode[] => {
    if (node.type !== 'text') return [node];
    
    // Split by ** first
    const splitStars = node.val.split(/(\*\*(?:\S|\S.*?\S)\*\*)/g);
    let starProcessed = splitStars.map((part): FormatNode => {
      if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
        return { type: 'bold', val: part.slice(2, -2) };
      }
      return { type: 'text', val: part };
    });

    // Then split by __ on any remaining text nodes
    return starProcessed.flatMap((node2): FormatNode[] => {
      if (node2.type !== 'text') return [node2];
      const splitUnders = node2.val.split(/(__(?:\S|\S.*?\S)__)/g);
      return splitUnders.map((part): FormatNode => {
        if (part.startsWith('__') && part.endsWith('__') && part.length > 4) {
          return { type: 'bold', val: part.slice(2, -2) };
        }
        return { type: 'text', val: part };
      });
    }).filter(n => n.val !== '');
  });

  // Helper to parse italics in a raw string
  const parseItalicsStr = (val: string): FormatNode[] => {
    const splitStars = val.split(/(\*(?!\*)(?:\S|\S.*?\S)\*(?!\*))/g);
    let starProcessed = splitStars.map((part): FormatNode => {
      if (part.startsWith('*') && part.endsWith('*') && part.length > 2 && !part.startsWith('**')) {
        return { type: 'italic', val: part.slice(1, -1) };
      }
      return { type: 'text', val: part };
    });

    return starProcessed.flatMap((node2): FormatNode[] => {
      if (node2.type !== 'text') return [node2];
      const splitUnders = node2.val.split(/(_(?:\S|\S.*?\S)_)/g);
      return splitUnders.map((part): FormatNode => {
        if (part.startsWith('_') && part.endsWith('_') && part.length > 2 && !part.startsWith('__')) {
          return { type: 'italic', val: part.slice(1, -1) };
        }
        return { type: 'text', val: part };
      });
    }).filter(n => n.val !== '');
  };

  // Phase 4: Italic (* or _) - applies to 'text' nodes, and inside 'bold' nodes too!
  nodes = nodes.flatMap((node): FormatNode[] => {
    if (node.type === 'text') {
      return parseItalicsStr(node.val);
    }
    if (node.type === 'bold') {
      return [{
        type: 'bold',
        val: node.val,
        children: parseItalicsStr(node.val)
      }];
    }
    return [node];
  });

  // Recursive renderer to React elements
  const renderNode = (node: FormatNode, index: string): React.ReactNode => {
    switch (node.type) {
      case 'code':
        return (
          <code key={index} className="bg-neutral-100 dark:bg-neutral-800 text-[#c7254e] dark:text-[#ff8ca3] px-1.5 py-0.5 rounded text-[13px] font-mono">
            {node.val}
          </code>
        );
      case 'cite':
        return (
          <sup key={index} className="ml-0.5 cursor-pointer text-[10px] font-bold text-[#ef4d23] hover:text-[#d9441f]">
            {node.val}
          </sup>
        );
      case 'bold':
        return (
          <strong key={index} className="font-semibold text-neutral-900 dark:text-white">
            {node.children ? node.children.map((child, i) => renderNode(child, `${index}-${i}`)) : node.val}
          </strong>
        );
      case 'italic':
        return (
          <em key={index} className="italic">
            {node.val}
          </em>
        );
      case 'text':
      default:
        return <React.Fragment key={index}>{node.val}</React.Fragment>;
    }
  };

  return <>{nodes.map((node, i) => renderNode(node, String(i)))}</>;
}
