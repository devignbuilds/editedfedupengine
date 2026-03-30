import { useState, useEffect } from "react";
import { useAuth } from "../context/useAuth";
import DashboardLayout from "../components/layout/DashboardLayout";
import { cn } from "../lib/utils";
import TaskBoard from "../components/TaskBoard";
import TaskListView from "../components/TaskListView";
import { Button } from "../components/ui/button";
import { Plus, Layout, List, RefreshCw } from "lucide-react";
import { engineApi } from "../api/engineApi";
import type { Task } from "../types/task";

const Tasks = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"board" | "list">("board");

  const fetchTasks = async () => {
    try {
      if (!user?.token) return;
      setLoading(true);
      const data = await engineApi.tasks.getAll(user.token);
      setTasks(data);
    } catch (error) {
      console.error("Failed to fetch tasks", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [user]);

  const handleStatusChange = async (taskId: string, newStatus: string) => {
    if (!user?.token) return;
    
    // Optimistic update
    setTasks((prev: Task[]) =>
      prev.map((t: Task) =>
        t._id === taskId ? ({ ...t, status: newStatus } as Task) : t
      )
    );

    try {
      await engineApi.tasks.update(taskId, { status: newStatus }, user.token);
    } catch (err) {
      console.error("Failed to update task", err);
      // Revert logic could be added here
    }
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col h-[calc(100vh-100px)]">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-4xl font-black tracking-tighter uppercase italic">
              Tasks
            </h1>
            <p className="text-muted-foreground mt-1 text-lg">
              Global task tracking across all projects.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="bg-muted p-1 rounded-lg flex items-center">
              <Button
                variant={viewMode === "board" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setViewMode("board")}
                className="h-8 w-8 p-0"
              >
                <Layout className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="h-8 w-8 p-0"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>

            <Button 
               variant="outline" 
               size="sm" 
               onClick={fetchTasks}
               className="h-9 px-3 rounded-lg border-border hover:bg-muted"
            >
              <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
            </Button>

            <Button className="rounded-full font-black uppercase tracking-widest text-[10px] px-6">
              <Plus className="mr-2 h-4 w-4" /> New Task
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              Loading tasks...
            </div>
          ) : viewMode === "board" ? (
            <TaskBoard
              tasks={tasks}
              onStatusChange={handleStatusChange}
              team={[]}
            />
          ) : (
            <TaskListView
              tasks={tasks}
              onStatusChange={handleStatusChange}
            />
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Tasks;
