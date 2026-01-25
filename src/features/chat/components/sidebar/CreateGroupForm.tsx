import { useState, useEffect } from "react";
import { User } from "@/types/chat";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowLeft, Check, User as UserIcon, X } from "lucide-react";
import { socket } from "@/socket";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

interface CreateGroupFormProps {
  onCancel: () => void;
  onSuccess: () => void;
}

export function CreateGroupForm({ onCancel, onSuccess }: CreateGroupFormProps) {
  const { data: session } = useSession();
  const [groupName, setGroupName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Search users
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.length > 1) {
        setIsLoading(true);
        try {
          const res = await fetch(`/api/contacts/search?q=${encodeURIComponent(searchQuery)}`);
          if (res.ok) {
            const data = await res.json();
            // Filter out self and already selected
            setSearchResults(data.filter((u: User) => 
                u.id !== session?.user?.id && 
                !selectedUsers.some(selected => selected.id === u.id)
            ));
          }
        } catch (error) {
          console.error(error);
          toast.error("Failed to search users");
        } finally {
          setIsLoading(false);
        }
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, selectedUsers, session]);

  const toggleUser = (user: User) => {
    if (selectedUsers.some(u => u.id === user.id)) {
      setSelectedUsers(prev => prev.filter(u => u.id !== user.id));
    } else {
      setSelectedUsers(prev => [...prev, user]);
      setSearchQuery(""); // Clear search after selecting
      setSearchResults([]);
    }
  };

  const handleCreate = () => {
    if (!groupName) {
      toast.error("Group name is required");
      return;
    }
    if (selectedUsers.length === 0) {
      toast.error("Select at least one member");
      return;
    }
    if (!session?.user?.id) return;

    try {
      socket.emit("create-group", {
        name: groupName,
        memberIds: selectedUsers.map(u => u.id),
        adminId: session.user.id
      });

      toast.success("Group created successfully");
      onSuccess();
    } catch (error) {
      toast.error("Failed to create group");
    }
  };

  return (
    <div className="flex flex-col h-full bg-background animate-in slide-in-from-left-5 duration-200">
      <div className="p-4 border-b border-border flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={onCancel}>
          <ArrowLeft size={18} />
        </Button>
        <h2 className="font-semibold text-lg">New Group</h2>
      </div>

      <div className="p-4 space-y-4 flex-1 overflow-hidden flex flex-col">
        <div className="space-y-2">
          <Label>Group Name</Label>
          <Input 
            placeholder="Enter group name" 
            value={groupName}
            onChange={e => setGroupName(e.target.value)}
          />
        </div>

        <div className="space-y-2 flex-1 flex flex-col min-h-0">
          <Label>Add Members</Label>
          <Input 
            placeholder="Search people..." 
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
          
          {selectedUsers.length > 0 && (
            <div className="flex flex-wrap gap-2 py-2">
              {selectedUsers.map(user => (
                <div key={user.id} className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full flex items-center gap-1">
                  {user.name}
                  <button onClick={() => toggleUser(user)} className="hover:text-destructive">
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}

          <ScrollArea className="flex-1 border rounded-md p-2">
            {searchResults.length === 0 && searchQuery.length > 1 && !isLoading && (
              <p className="text-center text-muted-foreground text-sm py-4">No users found</p>
            )}
            
            {searchResults.map(user => (
              <div 
                key={user.id}
                onClick={() => toggleUser(user)}
                className="flex items-center gap-3 p-2 hover:bg-muted/50 rounded-lg cursor-pointer"
              >
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                    {user.avatar ? <img src={user.avatar} className="w-full h-full rounded-full" /> : <UserIcon size={14} />}
                </div>
                <div className="flex-1">
                    <p className="text-sm font-medium">{user.name}</p>
                </div>
                {selectedUsers.some(u => u.id === user.id) && <Check size={16} className="text-primary" />}
              </div>
            ))}
          </ScrollArea>
        </div>

        <Button 
            className="w-full" 
            disabled={!groupName || selectedUsers.length === 0}
            onClick={handleCreate}
        >
            Create Group
        </Button>
      </div>
    </div>
  );
}
