import { cn } from '@/lib/utils';
import { Message } from '@/types/chat';
import { format } from 'date-fns';
import {  CheckCheck } from 'lucide-react';

interface MessageBubbleProps {
  message: Message;
  showSenderName?: boolean;
  isGroupChat?: boolean;
}

export function MessageBubble({ message, showSenderName, isGroupChat }: MessageBubbleProps) {
  if (message.type === 'system') {
    return (
      <div className="flex justify-center my-4 animate-fade-in">
        <span className="px-3 py-1 text-xs text-chat-system bg-muted rounded-full">
          {message.content}
        </span>
      </div>
    );
  }

  const formattedTime = format(message.timestamp, 'HH:mm');

  return (
    <div
      className={cn(
        'flex mb-2',
        message.isOwn ? 'justify-end animate-slide-in-right' : 'justify-start animate-slide-in-left'
      )}
    >
      <div
        className={cn(
          'max-w-[70%] rounded-2xl px-4 py-2 shadow-chat',
          message.isOwn
            ? 'bg-primary text-primary-foreground rounded-br-md'
            : 'bg-secondary text-secondary-foreground rounded-bl-md'
        )}
      >
        {isGroupChat && showSenderName && !message.isOwn && (
          <p className="text-xs font-medium text-primary mb-1">
            {message.senderName}
          </p>
        )}
        <p className="text-[15px] leading-relaxed break-words whitespace-pre-wrap">
          {message.content}
        </p>
        <div className={cn(
          'flex items-center justify-end gap-1 mt-1',
          message.isOwn ? 'text-primary-foreground/70' : 'text-muted-foreground'
        )}>
          <span className="text-[10px]">{formattedTime}</span>
          {message.isOwn && (
            <CheckCheck size={14} className="text-primary-foreground/70" />
          )}
        </div>
      </div>
    </div>
  );
}
