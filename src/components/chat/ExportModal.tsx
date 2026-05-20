import { useState } from 'react';
import { Download, X, Loader2, FileText, Check } from 'lucide-react';
import api from '../../services/api';

interface ExportModalProps {
  conversationId: string;
  onClose: () => void;
}

export function ExportModal({ conversationId, onClose }: ExportModalProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const parseMarkdown = (md: string): string => {
    if (!md) return '';
    let html = md;
    
    // Clean escape characters or backticks
    html = html
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // Headers
    html = html.replace(/^### (.*$)/gim, '<h3 style="font-size: 15px; font-weight: 700; color: #111827; margin-top: 20px; margin-bottom: 8px; page-break-after: avoid;">$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2 style="font-size: 17px; font-weight: 800; color: #111827; margin-top: 26px; margin-bottom: 12px; border-bottom: 1.5px solid #f3f4f6; padding-bottom: 6px; page-break-after: avoid; text-transform: uppercase; letter-spacing: 0.3px;">$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1 style="font-size: 22px; font-weight: 900; color: #111827; margin-top: 30px; margin-bottom: 16px; page-break-after: avoid;">$1</h1>');
    
    // Bold
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong style="font-weight: 700; color: #111827;">$1</strong>');
    html = html.replace(/__(.*?)__/g, '<strong style="font-weight: 700; color: #111827;">$1</strong>');
    
    // Italic
    html = html.replace(/\*(.*?)\*/g, '<em style="font-style: italic;">$1</em>');
    html = html.replace(/_(.*?)_/g, '<em style="font-style: italic;">$1</em>');
    
    // Links
    html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" style="color: #ef4d23; text-decoration: none; font-weight: 500;">$1</a>');

    // Process lists, tables, and paragraphs line by line
    const lines = html.split('\n');
    const processedLines: string[] = [];
    let inList = false;
    let inTable = false;
    let tableRows: string[][] = [];

    for (let line of lines) {
      const trimmed = line.trim();
      const isTableRow = trimmed.startsWith('|') && trimmed.endsWith('|');

      if (isTableRow) {
        // If we were in a list, close it
        if (inList) {
          processedLines.push('</ul>');
          inList = false;
        }

        // Check if it is a separator row (e.g. |---|---|)
        const isSeparator = /^[|:\-\s]+$/.test(trimmed);
        if (isSeparator) {
          continue;
        }

        const cells = trimmed.split('|').map(c => c.trim()).slice(1, -1);
        if (!inTable) {
          inTable = true;
          tableRows = [cells];
        } else {
          tableRows.push(cells);
        }
      } else {
        // If we were in a table, render it now and close it
        if (inTable) {
          const headerCells = tableRows[0];
          const bodyRows = tableRows.slice(1);
          
          let tableHTML = '<table style="width: 100%; border-collapse: collapse; margin-top: 12px; margin-bottom: 20px; font-size: 11.5px; page-break-inside: avoid; border: 1px solid #e5e7eb;">';
          
          // Header
          tableHTML += '<thead><tr style="background-color: #f9fafb; border-bottom: 1.5px solid #e5e7eb;">';
          for (const cell of headerCells) {
            tableHTML += `<th style="padding: 8px 10px; text-align: left; font-weight: 700; color: #374151; border: 1px solid #e5e7eb;">${cell}</th>`;
          }
          tableHTML += '</tr></thead>';
          
          // Body
          tableHTML += '<tbody>';
          for (const row of bodyRows) {
            tableHTML += '<tr style="border-bottom: 1px solid #e5e7eb; page-break-inside: avoid;">';
            for (const cell of row) {
              tableHTML += `<td style="padding: 8px 10px; color: #4b5563; border: 1px solid #e5e7eb; line-height: 1.4;">${cell}</td>`;
            }
            tableHTML += '</tr>';
          }
          tableHTML += '</tbody></table>';
          
          processedLines.push(tableHTML);
          inTable = false;
          tableRows = [];
        }

        if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
          if (!inList) {
            processedLines.push('<ul style="margin-top: 4px; margin-bottom: 12px; padding-left: 20px; list-style-type: disc;">');
            inList = true;
          }
          const itemContent = trimmed.substring(2);
          processedLines.push(`<li style="margin-bottom: 6px; font-size: 13.5px; color: #374151; line-height: 1.5;">${itemContent}</li>`);
        } else {
          if (inList) {
            processedLines.push('</ul>');
            inList = false;
          }
          if (trimmed === '') {
            continue;
          }
          if (trimmed.startsWith('<h') || trimmed.startsWith('<blockquote') || trimmed.startsWith('<hr')) {
            processedLines.push(trimmed);
          } else {
            processedLines.push(`<p style="margin-top: 0; margin-bottom: 12px; font-size: 13.5px; color: #374151; line-height: 1.6; text-align: justify;">${trimmed}</p>`);
          }
        }
      }
    }

    // Final checks if document ends while still in a list or table
    if (inList) {
      processedLines.push('</ul>');
    }
    if (inTable) {
      const headerCells = tableRows[0];
      const bodyRows = tableRows.slice(1);
      
      let tableHTML = '<table style="width: 100%; border-collapse: collapse; margin-top: 12px; margin-bottom: 20px; font-size: 11.5px; page-break-inside: avoid; border: 1px solid #e5e7eb;">';
      
      // Header
      tableHTML += '<thead><tr style="background-color: #f9fafb; border-bottom: 1.5px solid #e5e7eb;">';
      for (const cell of headerCells) {
        tableHTML += `<th style="padding: 8px 10px; text-align: left; font-weight: 700; color: #374151; border: 1px solid #e5e7eb;">${cell}</th>`;
      }
      tableHTML += '</tr></thead>';
      
      // Body
      tableHTML += '<tbody>';
      for (const row of bodyRows) {
        tableHTML += '<tr style="border-bottom: 1px solid #e5e7eb; page-break-inside: avoid;">';
        for (const cell of row) {
          tableHTML += `<td style="padding: 8px 10px; color: #4b5563; border: 1px solid #e5e7eb; line-height: 1.4;">${cell}</td>`;
        }
        tableHTML += '</tr>';
      }
      tableHTML += '</tbody></table>';
      
      processedLines.push(tableHTML);
    }

    return processedLines.join('\n');
  };

  const handleExport = async () => {
    setIsExporting(true);
    setError(null);

    try {
      // 1. Fetch export report (format: json), SWOT, and Insights concurrently
      const [reportRes, swotRes, insightsRes] = await Promise.allSettled([
        api.post('/export', { conversationId, format: 'json' }),
        api.get(`/swot/${conversationId}`),
        api.get(`/insights/${conversationId}`)
      ]);

      // Verify report fetched successfully (crucial core component)
      if (reportRes.status === 'rejected') {
        throw new Error('Analysis report not found. Please complete the research pipeline first.');
      }

      const rawExport = reportRes.value.data;
      // Support flat json fields and legacy stringified `content`
      let reportData: {
        title?: string;
        date?: string;
        model?: string;
        sources?: Array<{ title?: string; url: string; domain?: string }>;
        report?: string;
      };
      if (rawExport.format === 'json' && typeof rawExport.content === 'string' && !rawExport.report) {
        try {
          reportData = JSON.parse(rawExport.content);
        } catch {
          reportData = rawExport;
        }
      } else {
        reportData = rawExport;
      }

      const swotData = swotRes.status === 'fulfilled' ? swotRes.value.data : null;
      const insightsData = insightsRes.status === 'fulfilled' ? insightsRes.value.data : null;

      // Extract details
      const title = reportData.title || rawExport.title || 'Convix Research Report';
      const date = reportData.date || new Date().toLocaleDateString();
      const model = reportData.model || 'Convix Pro';
      const sources = reportData.sources || [];
      const reportMarkdown = reportData.report || '';
      const parsedReportHTML = parseMarkdown(reportMarkdown);

      // Compile styled verdict
      const verdict = insightsData?.verdict || 'yellow';
      const score = insightsData?.viability_score ?? 50;
      const tam = insightsData?.key_metrics?.tam || insightsData?.market_size || 'N/A';
      const difficulty = insightsData?.difficulty || 'medium';
      const competitorsCount = insightsData?.competitor_count ?? sources.length;
      const verdictText = verdict === 'green' ? 'High Potential' : verdict === 'yellow' ? 'Moderate Risk' : 'High Risk';

      // 2. Build beautifully structured HTML with margins and styles
      const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${title}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
    @page {
      size: A4;
      margin: 20mm;
    }
    body {
      font-family: 'Inter', sans-serif;
      color: #1f2937;
      line-height: 1.6;
      font-size: 13.5px;
      margin: 0;
      padding: 0;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    .header {
      border-bottom: 3px solid #ef4d23;
      padding-bottom: 18px;
      margin-bottom: 24px;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
    }
    .header-left {
      flex: 1;
    }
    .brand {
      font-size: 13px;
      font-weight: 800;
      color: #ef4d23;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      margin-bottom: 6px;
    }
    .doc-title {
      font-size: 26px;
      font-weight: 900;
      color: #111827;
      margin: 0 0 8px 0;
      line-height: 1.15;
    }
    .doc-subtitle {
      font-size: 13px;
      color: #6b7280;
      margin: 0;
    }
    .meta-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 26px;
    }
    .meta-table td {
      padding: 8px 12px;
      font-size: 11.5px;
      border: 1px solid #e5e7eb;
      color: #4b5563;
      background-color: #fafafa;
    }
    .meta-table td strong {
      color: #111827;
    }
    .section-title {
      font-size: 16px;
      font-weight: 800;
      color: #111827;
      border-bottom: 2px solid #f3f4f6;
      padding-bottom: 6px;
      margin-top: 28px;
      margin-bottom: 14px;
      page-break-after: avoid;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    /* Executive Summary Block */
    .insights-container {
      display: flex;
      gap: 16px;
      margin-bottom: 20px;
      page-break-inside: avoid;
    }
    .viability-score-box {
      flex: 0 0 130px;
      border-radius: 10px;
      padding: 14px;
      text-align: center;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }
    .viability-score-box.green { background-color: #f0fdf4; border: 1.5px solid #bbf7d0; color: #15803d; }
    .viability-score-box.yellow { background-color: #fefce8; border: 1.5px solid #fef08a; color: #a16207; }
    .viability-score-box.red { background-color: #fef2f2; border: 1.5px solid #fecaca; color: #b91c1c; }
    
    .v-score { font-size: 38px; font-weight: 900; line-height: 1; margin-bottom: 2px; }
    .v-label { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; }
    
    .insights-summary {
      flex: 1;
      background-color: #fafafa;
      border: 1px solid #e5e7eb;
      border-radius: 10px;
      padding: 14px;
      font-size: 13px;
      color: #374151;
      font-style: italic;
      display: flex;
      align-items: center;
      line-height: 1.5;
    }
    /* Metrics Grid */
    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 12px;
      margin-bottom: 22px;
      page-break-inside: avoid;
    }
    .metric-card {
      background-color: #fafafa;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      padding: 10px 12px;
    }
    .metric-lbl { font-size: 10px; color: #6b7280; text-transform: uppercase; font-weight: 700; margin-bottom: 2px; letter-spacing: 0.3px; }
    .metric-val { font-size: 13.5px; font-weight: 700; color: #111827; text-transform: capitalize; }
    
    /* SWOT Grid */
    .swot-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 14px;
      margin-bottom: 22px;
      page-break-inside: avoid;
    }
    .swot-quad {
      border: 1px solid #e5e7eb;
      border-radius: 10px;
      padding: 12px 14px;
      background-color: #fafafa;
    }
    .swot-quad.strengths { border-top: 4px solid #10b981; }
    .swot-quad.weaknesses { border-top: 4px solid #ef4444; }
    .swot-quad.opportunities { border-top: 4px solid #3b82f6; }
    .swot-quad.threats { border-top: 4px solid #f97316; }
    
    .swot-quad-title {
      font-size: 13px;
      font-weight: 800;
      text-transform: uppercase;
      margin-top: 0;
      margin-bottom: 10px;
      letter-spacing: 0.5px;
    }
    .swot-quad.strengths .swot-quad-title { color: #15803d; }
    .swot-quad.weaknesses .swot-quad-title { color: #b91c1c; }
    .swot-quad.opportunities .swot-quad-title { color: #1d4ed8; }
    .swot-quad.threats .swot-quad-title { color: #c2410c; }
    
    .swot-ul { list-style: none; padding: 0; margin: 0; }
    .swot-li { font-size: 12px; color: #374151; margin-bottom: 8px; padding-left: 12px; position: relative; line-height: 1.4; }
    .swot-li::before { content: "•"; position: absolute; left: 0; color: inherit; font-weight: bold; }
    
    .swot-li-title { font-weight: 600; color: #111827; }
    .swot-li-desc { color: #6b7280; font-size: 11px; margin-top: 1px; }

    /* Sources list */
    .source-ol { margin: 0; padding-left: 18px; }
    .source-li { font-size: 12.5px; color: #4b5563; margin-bottom: 6px; }
    .source-li a { color: #ef4d23; text-decoration: none; font-weight: 500; }
    
    .footer {
      text-align: center;
      font-size: 10px;
      color: #9ca3af;
      border-top: 1px solid #f3f4f6;
      padding-top: 10px;
      margin-top: 35px;
      page-break-inside: avoid;
    }
    .page-break {
      page-break-before: always;
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="header-left">
      <div class="brand">Convix Idea Lab</div>
      <h1 class="doc-title">${title}</h1>
      <p class="doc-subtitle">Startup Feasibility & Market Validation Report</p>
    </div>
  </div>

  <table class="meta-table">
    <tr>
      <td><strong>Date:</strong> ${date}</td>
      <td><strong>Validation Engine:</strong> ${model}</td>
      <td><strong>Sources Audited:</strong> ${sources.length} websites</td>
    </tr>
  </table>

  <!-- Executive Insights Section -->
  <div class="section-title">Executive Summary</div>
  <div class="insights-container">
    <div class="viability-score-box ${verdict}">
      <span class="v-score">${score}</span>
      <span class="v-label">${verdictText}</span>
    </div>
    <div class="insights-summary">
      "${insightsData?.ai_summary || 'Analysis yields a validated strategic positioning for the target market. Core components are summarized in detail below.'}"
    </div>
  </div>

  <div class="metrics-grid">
    <div class="metric-card">
      <div class="metric-lbl">Market Volume (TAM)</div>
      <div class="metric-val">${tam}</div>
    </div>
    <div class="metric-card">
      <div class="metric-lbl">Execution Difficulty</div>
      <div class="metric-val">${difficulty}</div>
    </div>
    <div class="metric-card">
      <div class="metric-lbl">Competitor Saturation</div>
      <div class="metric-val">${competitorsCount} Identified</div>
    </div>
  </div>

  <!-- SWOT Analysis Section (if present) -->
  ${swotData ? `
  <div class="section-title" style="margin-top: 24px;">SWOT Matrix</div>
  <div class="swot-grid">
    <div class="swot-quad strengths">
      <div class="swot-quad-title">Strengths (Score: ${swotData.strengths[0]?.score || 8})</div>
      <ul class="swot-ul">
        ${swotData.strengths.map((item: any) => `
          <li class="swot-li">
            <span class="swot-li-title">${item.text}</span>
            <div class="swot-li-desc">${item.evidence}</div>
          </li>
        `).join('')}
      </ul>
    </div>
    <div class="swot-quad weaknesses">
      <div class="swot-quad-title">Weaknesses (Score: ${swotData.weaknesses[0]?.score || 6})</div>
      <ul class="swot-ul">
        ${swotData.weaknesses.map((item: any) => `
          <li class="swot-li">
            <span class="swot-li-title">${item.text}</span>
            <div class="swot-li-desc">${item.evidence}</div>
          </li>
        `).join('')}
      </ul>
    </div>
    <div class="swot-quad opportunities">
      <div class="swot-quad-title">Opportunities (Score: ${swotData.opportunities[0]?.score || 8})</div>
      <ul class="swot-ul">
        ${swotData.opportunities.map((item: any) => `
          <li class="swot-li">
            <span class="swot-li-title">${item.text}</span>
            <div class="swot-li-desc">${item.evidence}</div>
          </li>
        `).join('')}
      </ul>
    </div>
    <div class="swot-quad threats">
      <div class="swot-quad-title">Threats (Score: ${swotData.threats[0]?.score || 5})</div>
      <ul class="swot-ul">
        ${swotData.threats.map((item: any) => `
          <li class="swot-li">
            <span class="swot-li-title">${item.text}</span>
            <div class="swot-li-desc">${item.evidence}</div>
          </li>
        `).join('')}
      </ul>
    </div>
  </div>
  ` : ''}

  <!-- Page Break for full detailed report analysis to keep sections extremely clean -->
  <div class="page-break"></div>

  <div class="section-title">Deep Research & Feasibility Analysis</div>
  <div style="margin-top: 10px;">
    ${parsedReportHTML}
  </div>

  <!-- Research Sources -->
  <div class="section-title" style="margin-top: 30px;">Audited Sources & References</div>
  <ol class="source-ol">
    ${sources.map((s: any) => `
      <li class="source-li">
        <a href="${s.url}" target="_blank">${s.title || s.domain || s.url}</a>
        <span style="color: #9ca3af; font-size: 11px; margin-left: 6px;">(${s.domain || 'External Resource'})</span>
      </li>
    `).join('')}
  </ol>

  <div class="footer">
    This viability report was generated by Convix Idea Lab using advanced AI-validated web research engine processes.<br>
    © ${new Date().getFullYear()} Convix Lab. All rights reserved. Confidential document.
  </div>
</body>
</html>
      `;

      // 3. Mount hidden iframe and print
      const iframe = document.createElement('iframe');
      iframe.style.position = 'absolute';
      iframe.style.width = '0px';
      iframe.style.height = '0px';
      iframe.style.border = 'none';
      iframe.style.left = '-9999px';
      document.body.appendChild(iframe);

      const doc = iframe.contentWindow?.document || iframe.contentDocument;
      if (doc) {
        doc.open();
        doc.write(htmlContent);
        doc.close();

        // Focus and trigger PDF print dialogue
        iframe.contentWindow?.focus();
        setTimeout(() => {
          iframe.contentWindow?.print();
          // Delay cleanup to allow dialogue process
          setTimeout(() => {
            document.body.removeChild(iframe);
            onClose();
          }, 1000);
        }, 500);
      } else {
        throw new Error('Failed to access print engine document context.');
      }
    } catch (err: any) {
      console.error('Export Error:', err);
      setError(err.message || 'Failed to compile and export PDF report');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div onClick={onClose} className="absolute inset-0 bg-neutral-900/40 dark:bg-black/50 backdrop-blur-sm" aria-hidden />
      <div className="relative bg-[var(--dash-sidebar)] border border-neutral-200 dark:border-neutral-700 rounded-2xl p-6 w-full max-w-md shadow-2xl">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
        
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2.5 bg-[#ef4d23]/10 rounded-xl">
            <FileText className="w-6 h-6 text-[#ef4d23]" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 leading-tight">Export PDF Report</h2>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">Generate professional feasibility document</p>
          </div>
        </div>

        <p className="text-sm text-neutral-600 dark:text-neutral-300 mb-5 leading-relaxed">
          Compile your conversation, market size stats, complete SWOT analysis, and researched web references into a fully structured, presentation-ready corporate A4 PDF.
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-lg text-red-600 dark:text-red-400 text-xs">
            {error}
          </div>
        )}

        {/* Dynamic preview list */}
        <div className="space-y-2.5 mb-6 bg-neutral-50 dark:bg-neutral-800/50 p-4 rounded-xl border border-neutral-200 dark:border-neutral-700">
          <div className="flex items-center gap-2 text-xs text-neutral-700 dark:text-neutral-300 font-medium">
            <Check className="w-3.5 h-3.5 text-[#ef4d23] shrink-0" />
            <span>Executive summary & viability index</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-neutral-700 dark:text-neutral-300 font-medium">
            <Check className="w-3.5 h-3.5 text-[#ef4d23] shrink-0" />
            <span>Structured SWOT quadrant matrix</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-neutral-700 dark:text-neutral-300 font-medium">
            <Check className="w-3.5 h-3.5 text-[#ef4d23] shrink-0" />
            <span>Comprehensive AI market deep analysis</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-neutral-700 dark:text-neutral-300 font-medium">
            <Check className="w-3.5 h-3.5 text-[#ef4d23] shrink-0" />
            <span>Clickable external citation indexes</span>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-medium rounded-xl text-sm transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="flex-1 py-2.5 bg-gradient-to-r from-[#ef4d23] to-[#ff7a55] hover:opacity-95 text-white font-semibold rounded-xl text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50 shadow-md shadow-[#ef4d23]/20"
          >
            {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            {isExporting ? 'Generating...' : 'Download PDF'}
          </button>
        </div>
      </div>
    </div>
  );
}
