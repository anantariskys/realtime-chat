"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useSession } from "next-auth/react";
import { Chat, Message } from "@/types/chat";
import { useChats, useMessages, useSendMessage } from "@/hooks/useChatData";
import { useSocket } from "@/hooks/useSocket";

import { socket } from "@/socket";

interface ChatContextValue {
  chats: Chat[];
  activeChat: Chat | null;
  activeChatId: string | null;
  messages: Message[];
  isLoadingChats: boolean;
  isLoadingMessages: boolean;
  setActiveChatId: (id: string | null) => void;
  sendMessage: (content: string) => void;
  handleChatSelect: (id: string) => void;
}

const ChatContext = createContext<ChatContextValue | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
  const { data: session } = useSession();
  const [activeChatId, setActiveChatId] = useState<string | null>(null);

  // Initialize Socket.IO connection
  useSocket();
  
  // Join chat room when activeChatId changes
  useEffect(() => {
    if (activeChatId && socket.connected) {
        socket.emit("join-chat", activeChatId);
    }
  }, [activeChatId]);

  const { data: chats = [], isLoading: isLoadingChats } = useChats(session?.user?.id);
  const { data: messages = [], isLoading: isLoadingMessages } = useMessages(activeChatId);
  const { mutate: sendMessageMutation } = useSendMessage();

  const activeChat = chats.find((chat) => chat.id === activeChatId) || null;

  const sendMessage = (content: string) => {
    if (!activeChatId || !session?.user?.id) return;
    sendMessageMutation({
      chatId: activeChatId,
      content,
      senderId: session.user.id,
      senderName: session.user.name || "User",
    });
  };

  const handleChatSelect = (id: string) => {
      // 1. Check if it's an existing chat ID
      const existingChat = chats.find(c => c.id === id);
      if (existingChat) {
          setActiveChatId(id);
          return;
      }

      // 2. Check if it's a User ID that we already have a chat with
      // (This logic works because our dummy chats have member IDs)
      const chatWithUser = chats.find(c =>
          c.type === 'personal' && c.members?.some(m => m.id === id)
      );

      if (chatWithUser) {
          setActiveChatId(chatWithUser.id);
          return;
      }

      // 3. If neither, it's a new user -> Create Chat via Socket
      if (session?.user?.id) {
          console.log("Creating chat with:", id);
          socket.emit("create-chat", {
              partnerId: id,
              currentUserId: session.user.id
          });
          // We don't set activeChatId immediately; we wait for 'chat-created' event
          // which will add the chat to the list, and then we could select it.
          // For better UX, we could set a "creating" state, but for now this is fine.
          // Optionally, we can listen for the NEXT chat-created event to select it.
          const onceCreated = (newChat: any) => {
              if (newChat.members.includes(id)) {
                  setActiveChatId(newChat.id);
                  socket.off("chat-created", onceCreated);
              }
          };
          socket.on("chat-created", onceCreated);
      }
  };

  return (
    <ChatContext.Provider
      value={{
        chats,
        activeChat,
        activeChatId,
        messages,
        isLoadingChats,
        isLoadingMessages,
        setActiveChatId,
        sendMessage,
        handleChatSelect,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used inside ChatProvider");
  }
  return context;
}
