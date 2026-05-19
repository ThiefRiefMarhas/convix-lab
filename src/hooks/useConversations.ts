import { useState, useEffect, useCallback } from 'react';
import {
  getConversations,
  deleteConversation as apiDelete,
  renameConversation as apiRename,
  Conversation,
} from '../services/api';

export function useConversations() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    const data = await getConversations();
    setConversations(data);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const removeConversation = useCallback(async (id: string) => {
    const ok = await apiDelete(id);
    if (ok) {
      setConversations(prev => prev.filter(c => c.id !== id));
    }
    return ok;
  }, []);

  const renameConversation = useCallback(async (id: string, title: string) => {
    const ok = await apiRename(id, title);
    if (ok) {
      setConversations(prev =>
        prev.map(c => c.id === id ? { ...c, title } : c)
      );
    }
    return ok;
  }, []);

  // Group conversations by date
  const grouped = groupByDate(conversations);

  return {
    conversations,
    grouped,
    isLoading,
    refresh,
    deleteConversation: removeConversation,
    renameConversation,
  };
}

interface GroupedConversations {
  today: Conversation[];
  yesterday: Conversation[];
  previous7Days: Conversation[];
  older: Conversation[];
}

function groupByDate(conversations: Conversation[]): GroupedConversations {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterdayStart = new Date(todayStart.getTime() - 86400000);
  const week = new Date(todayStart.getTime() - 7 * 86400000);

  const result: GroupedConversations = { today: [], yesterday: [], previous7Days: [], older: [] };

  for (const c of conversations) {
    const d = new Date(c.last_message_at || c.created_at);
    if (d >= todayStart) result.today.push(c);
    else if (d >= yesterdayStart) result.yesterday.push(c);
    else if (d >= week) result.previous7Days.push(c);
    else result.older.push(c);
  }

  return result;
}
