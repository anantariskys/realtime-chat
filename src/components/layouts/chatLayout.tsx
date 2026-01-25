"use client";
import { Sidebar } from "@/features/chat/components/sidebar/Sidebar";
import { useChat } from "@/contexts/chat-context";

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { chats, activeChatId, handleChatSelect } = useChat();

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <Sidebar
        chats={chats}
        activeChatId={activeChatId}
        onChatSelect={handleChatSelect}
      />
      {children}
    </div>
  );
}
