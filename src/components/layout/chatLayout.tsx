'use client'
import { useCallback, useState } from "react";
import { Sidebar } from "../shared/sidebar";
import { Chat, Message } from "@/types/chat";
import { mockChats, mockMessages } from "@/data/mockData";

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [chats] = useState<Chat[]>(mockChats);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [messages, setMessages] =
    useState<Record<string, Message[]>>(mockMessages);

  const activeChat = chats.find((c) => c.id === activeChatId) || null;
  const currentMessages = activeChatId ? messages[activeChatId] || [] : [];

  const handleSendMessage = useCallback(
    (content: string) => {
      if (!activeChatId) return;

      const newMessage: Message = {
        id: `msg-${Date.now()}`,
        content,
        senderId: "user-1",
        senderName: "You",
        timestamp: new Date(),
        isOwn: true,
        type: "message",
      };

      setMessages((prev) => ({
        ...prev,
        [activeChatId]: [...(prev[activeChatId] || []), newMessage],
      }));
    },
    [activeChatId]
  );
  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <Sidebar
        chats={chats}
        activeChatId={activeChatId}
        onChatSelect={setActiveChatId}
      />
      {children}
    </div>
  );
}
