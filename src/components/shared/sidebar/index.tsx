import { useState } from "react";
import { Search, MessageCircle, Settings, Plus } from "lucide-react";

import { Chat, ChatType } from "@/types/chat";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { ChatTabs } from "./chatTabs";
import { ChatList } from "./chatList";

interface SidebarProps {
  chats: Chat[];
  activeChatId: string | null;
  onChatSelect: (chatId: string) => void;
}

export function Sidebar({ chats, activeChatId, onChatSelect }: SidebarProps) {
  const [activeTab, setActiveTab] = useState<ChatType | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="w-80 h-full flex flex-col bg-chat-sidebar border-r border-border">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <MessageCircle size={18} className="text-primary-foreground" />
            </div>
            <h1 className="text-lg font-bold text-foreground">Realtime Chat</h1>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-foreground"
            >
              <Plus size={18} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-foreground"
            >
              <Settings size={18} />
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
          />
          <Input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={cn(
              "pl-9 pr-4 py-2.5 rounded-xl",
              "bg-muted/50 border border-transparent",
              "placeholder:text-muted-foreground text-sm",
              "focus:bg-card focus:border-border",
              "transition-all duration-200"
            )}
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="px-4 py-3">
        <ChatTabs activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        <ChatList
          chats={chats}
          activeTab={activeTab}
          activeChatId={activeChatId}
          searchQuery={searchQuery}
          onChatSelect={onChatSelect}
        />
      </div>
    </div>
  );
}
