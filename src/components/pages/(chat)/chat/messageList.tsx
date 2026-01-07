import { useEffect, useRef } from "react";
import { Message } from "@/types/chat";

import { cn } from "@/lib/utils";
import { MessageBubble } from "./messageBubble";

interface MessageListProps {
  messages: Message[];
  isGroupChat?: boolean;
}

export default function MessageList({ messages, isGroupChat }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
        <div className="w-20 h-20 rounded-full bg-accent flex items-center justify-center mb-4">
          <svg
            className="w-10 h-10 text-accent-foreground"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        </div>
        <h3 className="font-medium text-foreground mb-1">No messages yet</h3>
        <p className="text-sm text-muted-foreground">
          Start the conversation by sending a message!
        </p>
      </div>
    );
  }

  return (
    <div className={cn("flex-1 overflow-y-auto p-4 scrollbar-thin")}>
      <div className=" mx-auto">
        {messages.map((message, index) => {
          const showSenderName =
            isGroupChat &&
            !message.isOwn &&
            message.type === "message" &&
            (index === 0 || messages[index - 1].senderId !== message.senderId);

          return (
            <MessageBubble
              key={message.id}
              message={message}
              showSenderName={showSenderName}
              isGroupChat={isGroupChat}
            />
          );
        })}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
