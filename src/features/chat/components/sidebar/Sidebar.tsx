import { useState, useEffect } from "react";
import { Search, MessageCircle, Settings, Plus, LogOut } from "lucide-react";
import { toast } from "sonner";
import { signOut } from "next-auth/react";

import { Chat, ChatType } from "@/types/chat";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { ChatTabs } from "./ChatTabs";
import { ChatList } from "./ChatList";

import { CreateGroupForm } from "./CreateGroupForm";

interface SidebarProps {
  chats: Chat[];
  activeChatId: string | null;
  onChatSelect: (chatId: string) => void;
}

export function Sidebar({ chats, activeChatId, onChatSelect }: SidebarProps) {
  const [activeTab, setActiveTab] = useState<ChatType | "all">("all");
  const [view, setView] = useState<"list" | "create-group">("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Simple debounced search
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.length > 2) {
        setIsSearching(true);
        try {
          // Import chatApi here or pass it in. Since it's a component, we can fetch directly or use a hook.
          // For simplicity, using fetch directly to the API route we created
          const res = await fetch(`/api/contacts/search?q=${encodeURIComponent(searchQuery)}`);
          if (res.ok) {
              const data = await res.json();
              setSearchResults(data);
          }
        } catch (error) {
            console.error(error);
            toast.error("Failed to search contacts");
        } finally {
            setIsSearching(false);
        }
      } else {
        setSearchResults([]);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  if (view === "create-group") {
      return <CreateGroupForm onCancel={() => setView("list")} onSuccess={() => setView("list")} />;
  }

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
              onClick={() => setView("create-group")}
            >
              <Plus size={18} />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-foreground"
                >
                  <Settings size={18} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="text-red-600 focus:text-red-600 cursor-pointer"
                  onClick={() => signOut({ callbackUrl: "/login" })}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
          searchResults={searchResults}
          onChatSelect={onChatSelect}
        />
      </div>
    </div>
  );
}
