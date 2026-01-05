import { Chat, ChatType } from '@/types/chat';

import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageCircle, Search } from 'lucide-react';
import { ChatItem } from './chatItem';

interface ChatListProps {
  chats: Chat[];
  activeTab: ChatType | 'all';
  activeChatId: string | null;
  searchQuery: string;
  onChatSelect: (chatId: string) => void;
}

export function ChatList({ chats, activeTab, activeChatId, searchQuery, onChatSelect }: ChatListProps) {
  const filteredChats = chats.filter(chat => {
    const matchesTab = activeTab === 'all' || chat.type === activeTab;
    const matchesSearch = chat.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  if (filteredChats.length === 0) {
    return (
      <Card className="flex flex-col items-center justify-center py-12 px-4 text-center border-0 shadow-none">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
          <MessageCircle className="w-8 h-8 text-muted-foreground" />
        </div>
        <p className="text-muted-foreground text-sm">
          {searchQuery ? 'No chats found' : 'No conversations yet'}
        </p>
      </Card>
    );
  }

  return (
    <ScrollArea className="flex-1">
      <div className={cn('flex flex-col gap-1 p-2')}>
        {filteredChats.map(chat => (
          <ChatItem
            key={chat.id}
            chat={chat}
            isActive={chat.id === activeChatId}
            onClick={() => onChatSelect(chat.id)}
          />
        ))}
      </div>
    </ScrollArea>
  );
}
