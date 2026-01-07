'use client';

import {
  createContext,
  useCallback,
  useContext,
  useState,
  ReactNode,
} from 'react';
import { Chat, Message } from '@/types/chat';
import { mockChats, mockMessages } from '@/data/mockData';

interface ChatContextValue {
  chats: Chat[];
  activeChat: Chat | null;
  activeChatId: string | null;
  messages: Message[];
  setActiveChatId: (id: string | null) => void;
  sendMessage: (content: string) => void;
}

const ChatContext = createContext<ChatContextValue | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [chats] = useState<Chat[]>(mockChats);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [messagesMap, setMessagesMap] =
    useState<Record<string, Message[]>>(mockMessages);

  const activeChat =
    chats.find((chat) => chat.id === activeChatId) || null;

  const messages = activeChatId
    ? messagesMap[activeChatId] || []
    : [];

  const sendMessage = useCallback(
    (content: string) => {
      if (!activeChatId) return;

      const newMessage: Message = {
        id: `msg-${Date.now()}`,
        content,
        senderId: 'user-1',
        senderName: 'You',
        timestamp: new Date(),
        isOwn: true,
        type: 'message',
      };

      setMessagesMap((prev) => ({
        ...prev,
        [activeChatId]: [...(prev[activeChatId] || []), newMessage],
      }));
    },
    [activeChatId]
  );

  return (
    <ChatContext.Provider
      value={{
        chats,
        activeChat,
        activeChatId,
        messages,
        setActiveChatId,
        sendMessage,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used inside ChatProvider');
  }
  return context;
}
