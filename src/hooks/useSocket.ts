import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { socket } from "@/socket";
import { Message, User } from "@/types/chat";
import { dummyUsers } from "@/auth";
import { useSession } from "next-auth/react";

export function useSocket() {
  const queryClient = useQueryClient();
  const { data: session } = useSession();

  // Handle connection and user room joining
  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    }

    function onConnect() {
      console.log("Socket connected");
      if (session?.user?.id) {
          socket.emit("join-user", session.user.id);
      }
    }

    socket.on("connect", onConnect);

    // If already connected when this hook mounts or session changes
    if (socket.connected && session?.user?.id) {
        socket.emit("join-user", session.user.id);
    }

    return () => {
      socket.off("connect", onConnect);
    };
  }, [session]);

  // Handle message events
  useEffect(() => {
    function onNewMessage(message: Message & { chatId: string }) {
      console.log("New message received:", message);
      
      // Calculate isOwn based on session
      const messageWithOwnership = {
        ...message,
        isOwn: session?.user?.id === message.senderId
      };

      // Update messages cache for the specific chat
      queryClient.setQueryData(
        ["messages", message.chatId],
        (oldMessages: Message[] | undefined) => {
          if (!oldMessages) return [messageWithOwnership];
          // Check if message already exists to avoid duplicates
          if (oldMessages.some(m => m.id === message.id)) return oldMessages;
          return [...oldMessages, messageWithOwnership];
        }
      );

      // Update chat list to show latest message
      queryClient.setQueriesData({ queryKey: ["chats"] }, (oldChats: any[] | undefined) => {
        if (!oldChats) return oldChats;
        return oldChats.map(chat => {
          if (chat.id === message.chatId) {
            return {
              ...chat,
              lastMessage: message.content,
              lastMessageTime: message.timestamp,
              unreadCount: (chat.unreadCount || 0) + 1
            };
          }
          return chat;
        });
      });
    }

    function onChatCreated(newChat: any) {
        // Populate members if they are strings
        const populatedChat = {
            ...newChat,
            members: newChat.members.map((memberId: string | User) => {
                if (typeof memberId !== 'string') return memberId;
                const user = dummyUsers.find(u => u.id === memberId);
                return user ? {
                    id: user.id,
                    name: user.name,
                    avatar: user.image,
                    isOnline: true
                } : {
                    id: memberId,
                    name: 'Unknown User',
                    avatar: '',
                    isOnline: false
                };
            })
        };

        queryClient.setQueriesData({ queryKey: ["chats"] }, (oldChats: any[] | undefined) => {
            if (!oldChats) return [populatedChat];
            if (oldChats.some(c => c.id === populatedChat.id)) return oldChats;
            return [populatedChat, ...oldChats];
        });
    }
    
    function onDisconnect() {
        console.log("Socket disconnected");
    }

    socket.on("disconnect", onDisconnect);
    socket.on("message", onNewMessage);
    socket.on("chat-created", onChatCreated);

    return () => {
      socket.off("disconnect", onDisconnect);
      socket.off("message", onNewMessage);
      socket.off("chat-created", onChatCreated);
    };
  }, [queryClient]);
}
