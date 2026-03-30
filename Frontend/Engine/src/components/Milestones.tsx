import { useState } from "react";
import { CheckCircle2, Clock, Flag, Plus, X } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import type { Project } from "../types/project";
import { cn } from "../lib/utils";
import { useAuth } from "../context/useAuth";

interface MilestonesProps {
  project: Project;
  onUpdate?: () => void;
}

export default function Milestones({ project, onUpdate }: MilestonesProps) {
  const { user } = useAuth();
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDueDate, setNewDueDate] = useState("");
  const [loading, setLoading] = useState(false);

  const milestones = project.milestones || [];

  const handleAddMilestone = async () => {
    if (!newTitle || !user?.token) return;
    setLoading(true);
    try {
      const res = await fetch(
        `http://localhost:5001/api/projects/${project._id}/milestones`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({ title: newTitle, dueDate: newDueDate }),
        },
      );
      if (res.ok) {
        setNewTitle("");
        setNewDueDate("");
        setIsAdding(false);
        if (onUpdate) onUpdate();
      }
    } catch (err) {
      console.error("Error adding milestone", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader className="border-b border-border/50 pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <Flag className="h-5 w-5" />
            Milestones
          </CardTitle>
          <Button
            size="sm"
            variant={isAdding ? "ghost" : "outline"}
            className="h-8 rounded-full text-xs uppercase tracking-widest font-bold"
            onClick={() => setIsAdding(!isAdding)}
          >
            {isAdding ? (
              <X className="h-3 w-3 mr-1" />
            ) : (
              <Plus className="h-3 w-3 mr-1" />
            )}
            {isAdding ? "Cancel" : "Add"}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        {isAdding && (
          <div className="mb-6 p-4 bg-muted/30 rounded-xl border border-border space-y-3">
            <input
              className="w-full p-2 bg-background border border-border rounded-lg text-sm"
              placeholder="Milestone title..."
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
            />
            <div className="flex gap-2">
              <input
                type="date"
                className="flex-1 p-2 bg-background border border-border rounded-lg text-sm"
                value={newDueDate}
                onChange={(e) => setNewDueDate(e.target.value)}
              />
              <Button
                size="sm"
                onClick={handleAddMilestone}
                disabled={loading || !newTitle}
              >
                {loading ? "..." : "Save"}
              </Button>
            </div>
          </div>
        )}
        <div className="space-y-6 relative before:absolute before:inset-0 before:ml-2.5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
          {milestones.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground italic text-sm">
              No milestones defined for this roadmap.
            </div>
          ) : (
            milestones.map((milestone, index) => (
              <div
                key={milestone._id || index}
                className="relative flex items-center gap-4"
              >
                <div
                  className={cn(
                    "absolute left-0 rounded-full border-4 border-background h-5 w-5 flex items-center justify-center z-10",
                    milestone.status === "completed"
                      ? "bg-primary"
                      : "bg-muted",
                  )}
                >
                  {milestone.status === "completed" && (
                    <CheckCircle2 className="h-3 w-3 text-primary-foreground" />
                  )}
                </div>
                <div className="pl-8 flex-1">
                  <div className="bg-muted/30 p-4 rounded-xl border border-border flex justify-between items-center group hover:border-foreground/50 transition-colors">
                    <div>
                      <h4
                        className={cn(
                          "font-bold text-sm",
                          milestone.status === "completed" &&
                            "line-through opacity-50",
                        )}
                      >
                        {milestone.title}
                      </h4>
                      {milestone.dueDate && (
                        <div className="flex items-center gap-1 text-[10px] text-muted-foreground font-medium uppercase tracking-wider mt-1">
                          <Clock className="h-3 w-3" />
                          Due:{" "}
                          {new Date(milestone.dueDate).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                    <Badge
                      variant={
                        milestone.status === "completed"
                          ? "default"
                          : milestone.status === "in-progress"
                            ? "secondary"
                            : "outline"
                      }
                      className="uppercase text-[10px] tracking-widest font-bold"
                    >
                      {milestone.status}
                    </Badge>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
