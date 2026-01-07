"use client";

import { useState } from "react";
import { MessageCircle } from "lucide-react";
import { ChatHeader } from "./chatHeader";
import { useChat } from "@/contexts/chat-context";
import MessageList from "./messageList";
import MessageInput from "./messageInput";

export function ChatPage() {
  const { activeChat, messages, sendMessage } = useChat();
  const [isMembersOpen, setIsMembersOpen] = useState(false);

  if (!activeChat) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-background p-8 text-center">
        <div className="w-24 h-24 rounded-full bg-accent flex items-center justify-center mb-6">
          <MessageCircle size={40} className="text-accent-foreground" />
        </div>
        <h2 className="text-2xl font-semibold text-foreground mb-2">
          Welcome to Realtime Chat
        </h2>
        <p className="text-muted-foreground max-w-md">
          Select a conversation from the sidebar to start messaging.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-background min-h-0">
      <ChatHeader
        chat={activeChat}
        onOpenMembers={() => setIsMembersOpen(true)}
      />

      <MessageList
        messages={messages}
        isGroupChat={activeChat.type === "group"}
      />

      <MessageInput onSend={sendMessage} />

      {/* {activeChat.type === 'group' && activeChat.members && (
        <GroupMemberModal
          isOpen={isMembersOpen}
          onClose={() => setIsMembersOpen(false)}
          members={activeChat.members}
          adminIds={activeChat.adminIds || []}
          groupName={activeChat.name}
        />
      )} */}
    </div>
  );
}
