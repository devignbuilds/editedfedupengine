import { useState, useEffect } from "react";
import { engineApi } from "../api/engineApi";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Search, UserPlus, Check } from "lucide-react";

interface AddMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  currentMembers: any[];
  onUpdate: () => void;
  token: string;
}

export default function AddMemberModal({
  isOpen,
  onClose,
  projectId,
  currentMembers,
  onUpdate,
  token,
}: AddMemberModalProps) {
  const [users, setUsers] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loadingUserId, setLoadingUserId] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      const fetchUsers = async () => {
        try {
          const data = await engineApi.users.getAll(token);
          // Only list employees
          setUsers(data.filter((u: any) => u.role === "employee"));
        } catch (err) {
          console.error("Failed to fetch users", err);
        }
      };
      fetchUsers();
    }
  }, [isOpen, token]);

  const toggleMember = async (userId: string) => {
    setLoadingUserId(userId);
    const isMember = currentMembers.some((m) => m._id === userId);
    let newMembers;
    
    if (isMember) {
      newMembers = currentMembers.filter((m) => m._id !== userId).map(m => m._id);
    } else {
      newMembers = [...currentMembers.map(m => m._id), userId];
    }

    try {
      await engineApi.projects.update(projectId, { employees: newMembers }, token);
      onUpdate();
    } catch (err) {
      console.error("Failed to update members", err);
    } finally {
      setLoadingUserId(null);
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-xl font-black uppercase tracking-tighter">
            Manage Team
          </DialogTitle>
          <DialogDescription className="text-[10px] uppercase font-bold tracking-widest opacity-60">
            Assign or remove employees from this operation segment.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground opacity-50" />
            <input
              type="text"
              placeholder="Search employees..."
              className="w-full pl-10 pr-4 py-2 bg-muted/50 border border-border rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="max-h-[300px] overflow-y-auto pr-2 space-y-2 custom-scrollbar">
            {filteredUsers.map((u) => {
              const isMember = currentMembers.some((m) => m._id === u._id);
              return (
                <div
                  key={u._id}
                  className="flex items-center justify-between p-3 rounded-xl border border-border bg-muted/20 hover:border-foreground/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary text-primary-foreground font-black text-[10px]">
                        {u.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-bold text-sm tracking-tight">{u.name}</p>
                      <p className="text-[10px] text-muted-foreground uppercase font-medium">
                        {u.email}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant={isMember ? "secondary" : "ghost"}
                    size="sm"
                    className="h-8 w-8 p-0 rounded-lg"
                    onClick={() => toggleMember(u._id)}
                    disabled={loadingUserId === u._id}
                  >
                    {isMember ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <UserPlus className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              );
            })}
            {filteredUsers.length === 0 && (
              <p className="text-center py-8 text-xs text-muted-foreground italic">
                No matching employees found in registry.
              </p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
