"use client";
import { Sidebar } from "../shared/sidebar";

import { useChat } from "@/contexts/chat-context";

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { chats, activeChatId, setActiveChatId } = useChat();

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
