import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { chatApi } from "@/lib/api/chat";
import { useSession } from "next-auth/react";
import { Message } from "@/types/chat";

export function useChats(userId?: string) {
  return useQuery({
    queryKey: ["chats", userId],
    queryFn: () => chatApi.getChats(userId),
    enabled: !!userId,
  });
}

export function useMessages(chatId: string | null) {
  const { data: session } = useSession();

  return useQuery({
    queryKey: ["messages", chatId],
    queryFn: () => (chatId ? chatApi.getMessages(chatId) : Promise.resolve([])),
    enabled: !!chatId,
    select: (messages) => {
      if (!session?.user?.id) return messages;
      return messages.map((msg) => ({
        ...msg,
        isOwn: msg.senderId === session.user.id,
      }));
    },
  });
}

export function useContacts() {
  return useQuery({
    queryKey: ["contacts"],
    queryFn: chatApi.getContacts,
  });
}

export function useSendMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      chatId,
      content,
      senderId,
      senderName,
    }: {
      chatId: string;
      content: string;
      senderId: string;
      senderName: string;
    }) => chatApi.sendMessage(chatId, content, senderId, senderName),
  });
}
