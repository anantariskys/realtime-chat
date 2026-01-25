import * as React from "react";
import { User, Users } from "lucide-react";
import { ChatType } from "@/types/chat";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ChatTabsProps {
  activeTab: ChatType | "all";
  onTabChange: (tab: ChatType | "all") => void;
}

export function ChatTabs({ activeTab, onTabChange }: ChatTabsProps) {
  return (
    <Tabs
      value={activeTab}
      onValueChange={(value) => onTabChange(value as ChatType | "all")}
      className="w-full"
    >
      <TabsList className="grid grid-cols-3">
        <TabsTrigger value="all" className="flex items-center gap-2">
          <span>All</span>
        </TabsTrigger>
        <TabsTrigger value="personal" className="flex items-center gap-2">
          <User className="h-4 w-4" />
          <span>Personal</span>
        </TabsTrigger>
        <TabsTrigger value="group" className="flex items-center gap-2">
          <Users className="h-4 w-4" />
          <span>Groups</span>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
