import { Chat, ChatType, User } from '@/types/chat';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageCircle, User as UserIcon } from 'lucide-react';
import { ChatItem } from './ChatItem';

interface ChatListProps {
  chats: Chat[];
  activeTab: ChatType | 'all';
  activeChatId: string | null;
  searchQuery: string;
  searchResults?: User[]; // New prop for contacts
  onChatSelect: (chatId: string) => void;
}

export function ChatList({ chats, activeTab, activeChatId, searchQuery, searchResults = [], onChatSelect }: ChatListProps) {
  // If we have search results from the API (contacts), show them
  if (searchQuery.length > 2 && searchResults.length > 0) {
       return (
         <ScrollArea className="flex-1">
           <div className="flex flex-col gap-1 p-2">
             <div className="px-2 py-1 text-xs font-semibold text-muted-foreground uppercase">
               Contacts Found
             </div>
             {searchResults.map(user => (
               <div 
                 key={user.id}
                 onClick={() => onChatSelect(user.id)} // In real app, this should create/find chat with this user
                 className={cn(
                   "flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200 hover:bg-muted/50"
                 )}
               >
                 <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    {user.avatar ? <img src={user.avatar} className="w-full h-full rounded-full" /> : <UserIcon className="w-5 h-5 text-primary" />}
                 </div>
                 <div>
                    <p className="text-sm font-medium text-foreground">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.id === 'user-1' || user.id === 'user-2' ? user.id : 'Contact'}</p>
                 </div>
               </div>
             ))}
           </div>
         </ScrollArea>
       );
  }

  const filteredChats = chats.filter(chat => {
    const matchesTab = activeTab === 'all' || chat.type === activeTab;
    const matchesSearch = chat.name?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false;
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
