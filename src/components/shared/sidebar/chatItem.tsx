import { cn } from '@/lib/utils';
import { Chat } from '@/types/chat';

import { formatDistanceToNow } from 'date-fns';
import { Avatar } from '../avatar';

interface ChatItemProps {
  chat: Chat;
  isActive: boolean;
  onClick: () => void;
}

export function ChatItem({ chat, isActive, onClick }: ChatItemProps) {
  const formatTime = (date?: Date) => {
    if (!date) return '';
    return formatDistanceToNow(date, { addSuffix: false });
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 text-left',
        isActive
          ? 'bg-accent text-accent-foreground'
          : 'hover:bg-muted'
      )}
    >
      <Avatar
        name={chat.name}
        src={chat.avatar}
        isGroup={chat.type === 'group'}
        isOnline={chat.type === 'personal' ? chat.isOnline : undefined}
        size="md"
      />
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <h3 className="font-medium truncate text-sm">
            {chat.name}
          </h3>
          {chat.lastMessageTime && (
            <span className="text-xs text-muted-foreground flex-shrink-0">
              {formatTime(chat.lastMessageTime)}
            </span>
          )}
        </div>
        
        <div className="flex items-center justify-between gap-2 mt-0.5">
          <p className="text-sm text-muted-foreground w-48 truncate">
            {chat.lastMessage || 'No messages yet'}
          </p>
          {chat.unreadCount && chat.unreadCount > 0 && (
            <span className="flex-shrink-0 min-w-[20px] h-5 px-1.5 flex items-center justify-center bg-primary text-primary-foreground text-xs font-medium rounded-full">
              {chat.unreadCount > 99 ? '99+' : chat.unreadCount}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}
