import { supabaseAdmin } from './supabase-admin.js';

export interface ExportParams {
  conversationId: string;
  format: 'markdown' | 'json';
  template?: string;
  userId: string;
}

export interface ExportResult {
  title: string;
  content: string;
  format: string;
  date?: string;
  model?: string;
  sources?: Array<{ title?: string; url: string; domain?: string }>;
  report?: string;
}

export async function generateExport(params: ExportParams): Promise<ExportResult> {
  const { conversationId, format, userId } = params;

  // 1. Fetch conversation details
  const { data: conversation, error: convoError } = await supabaseAdmin
    .from('conversations')
    .select('*')
    .eq('id', conversationId)
    .single();

  if (convoError || !conversation) {
    throw new Error('Conversation not found');
  }

  // Verify ownership
  if (conversation.user_id !== userId) {
    throw new Error('Unauthorized');
  }

  // 2. Fetch the final analysis report message
  const { data: messages } = await supabaseAdmin
    .from('messages')
    .select('content, metadata, created_at')
    .eq('conversation_id', conversationId)
    .eq('role', 'assistant')
    .order('created_at', { ascending: false });

  // Find the last message that is an analysis report, or just use the last message if none explicitly marked
  let reportMessage = (messages || []).find(m => m.metadata?.isAnalysisReport);
  if (!reportMessage && messages && messages.length > 0) {
    reportMessage = messages[0];
  }

  if (!reportMessage) {
    throw new Error('No analysis report found to export');
  }

  // 3. Fetch sources
  const { data: sources } = await supabaseAdmin
    .from('research_sources')
    .select('title, url, domain')
    .eq('conversation_id', conversationId);

  const title = conversation.title || 'Convix Analysis Report';
  const date = new Date(reportMessage.created_at).toLocaleDateString();
  const sourceCount = sources?.length || 0;
  const modelUsed = reportMessage.metadata?.model || conversation.model || 'Unknown';

  if (format === 'json') {
    return {
      title,
      format: 'json',
      date,
      model: modelUsed,
      sources: sources || [],
      report: reportMessage.content,
      // Keep stringified copy for export history table
      content: JSON.stringify({
        title,
        date,
        model: modelUsed,
        sources: sources || [],
        report: reportMessage.content,
      }, null, 2),
    };
  }

  // Markdown format
  let markdown = `# ${title}\n\n`;
  markdown += `**Date:** ${date} | **Model:** ${modelUsed} | **Sources Analyzed:** ${sourceCount}\n\n`;
  markdown += `---\n\n`;
  
  markdown += reportMessage.content;
  
  markdown += `\n\n---\n\n`;
  markdown += `## Research Sources\n\n`;
  
  if (sources && sources.length > 0) {
    sources.forEach((s, i) => {
      markdown += `${i + 1}. [${s.title || s.domain}](${s.url})\n`;
    });
  } else {
    markdown += `No external sources were referenced.\n`;
  }

  return {
    title,
    format: 'markdown',
    content: markdown,
  };
}
