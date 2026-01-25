import { Chat } from "@/types/chat";

import { Settings, Users, Phone, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/shared/avatar";

interface ChatHeaderProps {
  chat: Chat;
  onOpenMembers?: () => void;
}

export function ChatHeader({ chat, onOpenMembers }: ChatHeaderProps) {
  const subtitle =
    chat.type === "personal"
      ? chat.isOnline
        ? "Online"
        : "Offline"
      : `${chat.members?.length || 0} members`;

  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-card/80 backdrop-blur-sm">
      <div className="flex items-center gap-3">
        <Avatar
          name={chat.name}
          src={chat.avatar}
          isGroup={chat.type === "group"}
          isOnline={chat.type === "personal" ? chat.isOnline : undefined}
          size="md"
        />
        <div>
          <h2 className="font-semibold text-foreground">{chat.name}</h2>
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            {chat.type === "personal" && chat.isOnline && (
              <span className="w-2 h-2 rounded-full bg-chat-online animate-pulse-soft" />
            )}
            {subtitle}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-foreground"
        >
          <Phone size={18} />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-foreground"
        >
          <Video size={18} />
        </Button>
        {chat.type === "group" && (
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-foreground"
            onClick={onOpenMembers}
          >
            <Users size={18} />
          </Button>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-foreground"
        >
          <Settings size={18} />
        </Button>
      </div>
    </div>
  );
}
