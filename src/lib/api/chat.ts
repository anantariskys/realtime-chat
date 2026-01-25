import { Chat, Message, User } from "@/types/chat";
import { dummyUsers } from "@/auth";
import { socket } from "@/socket";

// In a real app, these would call your backend API endpoints
// which would then interact with the database/socket server
// For this hybrid approach, we'll fetch from our new API routes or just return static data where applicable

export const chatApi = {
  getChats: async (userId?: string): Promise<Chat[]> => {
    if (!userId) return [];
    try {
        const res = await fetch(`/api/direct/chats?userId=${userId}`);
        if (!res.ok) return [];
        const rawChats = await res.json();
        
        // Populate members
        return rawChats.map((chat: any) => ({
            ...chat,
            members: chat.members.map((memberId: string | User) => {
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
        }));
    } catch (e) {
        console.error("Failed to fetch chats", e);
        return [];
    }
  },

  getMessages: async (chatId: string): Promise<Message[]> => {
     try {
        const res = await fetch(`/api/direct/messages?chatId=${chatId}`);
        if (!res.ok) return [];
        return res.json();
     } catch (e) {
         console.error("Failed to fetch messages", e);
         return [];
     }
  },

  getContacts: async (): Promise<User[]> => {
    return dummyUsers.map(u => ({
        id: u.id,
        name: u.name,
        avatar: u.image,
        isOnline: true
    }));
  },

  sendMessage: async (chatId: string, content: string, senderId: string, senderName: string = "User"): Promise<Message> => {
     socket.emit("send-message", {
       chatId,
       content,
       senderId,
       senderName
     });

    return {
      id: `msg-${Date.now()}`,
      content,
      senderId,
      senderName, 
      timestamp: new Date(),
      isOwn: true,
      type: "message",
    };
  },
  
  searchContacts: async (query: string): Promise<User[]> => {
    const res = await fetch(`/api/contacts/search?q=${encodeURIComponent(query)}`);
    if (!res.ok) return [];
    return res.json();
  }
};
