import { useState, useEffect, type FormEvent } from "react";
import { useAuth } from "../context/useAuth";
import { Button } from "./ui/button";
import type { Task } from "../types/task";
import type { User } from "../types/user";
import { motion, AnimatePresence } from "framer-motion";
import { RefreshCw } from "lucide-react";
import CustomSelect from "./ui/CustomSelect";

interface TaskListProps {
  projectId: string;
  team: User[];
}

const TaskList = ({ projectId, team }: TaskListProps) => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskAssignee, setNewTaskAssignee] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState("medium");
  const [newTaskDueDate, setNewTaskDueDate] = useState("");

  useEffect(() => {
    fetchTasks();
  }, [projectId]);

  const fetchTasks = async () => {
    try {
      const response = await fetch(
        `http://localhost:5001/api/tasks/project/${projectId}`,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      const data = await response.json();
      if (response.ok) {
        setTasks(data);
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (e: FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    try {
      const response = await fetch("http://localhost:5001/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify({
          title: newTaskTitle,
          project: projectId,
          assignedTo: newTaskAssignee || undefined,
          status: "todo",
          priority: newTaskPriority,
          dueDate: newTaskDueDate || undefined,
        }),
      });

      if (response.ok) {
        setNewTaskTitle("");
        setNewTaskAssignee("");
        setNewTaskPriority("medium");
        setNewTaskDueDate("");
        fetchTasks();
      }
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

  const handleStatusChange = async (taskId: string, newStatus: string) => {
    try {
      const response = await fetch(
        `http://localhost:5001/api/tasks/${taskId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user?.token}`,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (response.ok) {
        fetchTasks();
      }
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  if (loading) return <div>Loading tasks...</div>;

  const canCreate = user?.role === "admin" || user?.role === "employee";

  return (
    <div className="mt-8">
      <h3 className="text-2xl font-bold mb-4">Tasks</h3>

      {/* Create Task Form */}
      {!canCreate ? (
        <div className="bg-muted/30 border border-border p-4 rounded mb-6">
          <p className="text-sm text-muted-foreground">
            You do not have permission to create tasks. Only admins and
            employees may create tasks.
          </p>
        </div>
      ) : (
        <>
          <Button
            onClick={fetchTasks}
            variant="outline"
            className="mb-8 font-black uppercase tracking-widest gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Sync Task Engine
          </Button>
          <form
            onSubmit={handleCreateTask}
            className="bg-card border border-border p-6 rounded-2xl mb-8 gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 items-end"
          >
          <input
            type="text"
            placeholder="New Task Title"
            className="w-full h-11 px-4 rounded-xl border border-border bg-card transition-all duration-200 hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm font-medium"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
          />
          <CustomSelect
            options={[
              { label: "Assign to...", value: "" },
              ...team.map((member) => ({ label: member.name, value: member._id })),
            ]}
            value={newTaskAssignee}
            onChange={(val) => setNewTaskAssignee(val)}
            placeholder="Assign to..."
          />
          <CustomSelect
            options={[
              { label: "Low", value: "low" },
              { label: "Medium", value: "medium" },
              { label: "High", value: "high" },
              { label: "Critical", value: "critical" },
            ]}
            value={newTaskPriority}
            onChange={(val) => setNewTaskPriority(val)}
            placeholder="Priority"
          />
          <input
            type="date"
            className="w-full h-11 px-4 rounded-xl border border-border bg-card transition-all duration-200 hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm font-medium"
            value={newTaskDueDate}
            onChange={(e) => setNewTaskDueDate(e.target.value)}
          />
          <Button
            type="submit"
            className="h-11 rounded-xl font-black uppercase tracking-widest col-span-full md:col-auto"
          >
            Add Task
          </Button>
          </form>
        </>
      )}

      {/* Task List */}
      <motion.div layout className="space-y-3">
        <AnimatePresence mode="popLayout">
          {tasks.map((task) => (
            <motion.div
              layout
              key={task._id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="bg-card text-card-foreground border border-border p-4 rounded-xl flex justify-between items-center group hover:border-foreground transition-all shadow-sm"
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-bold text-foreground">{task.title}</h4>
                  <span
                    className={`text-[10px] uppercase border px-2 py-0.5 rounded-full font-black tracking-widest ${
                      task.priority === "critical"
                        ? "bg-primary text-primary-foreground border-primary"
                        : "border-border text-muted-foreground"
                    }`}
                  >
                    {task.priority || "medium"}
                  </span>
                </div>
                <div className="flex gap-4 text-xs text-muted-foreground font-medium">
                  <p>
                    Assigned:{" "}
                    <span className="text-foreground">
                      {task.assignedTo?.name || "Unassigned"}
                    </span>
                  </p>
                  {task.dueDate && (
                    <p>
                      Due:{" "}
                      <span className="text-foreground">
                        {new Date(task.dueDate).toLocaleDateString()}
                      </span>
                    </p>
                  )}
                </div>
              </div>
              <CustomSelect
                className="w-40"
                options={[
                  { label: "TO DO", value: "todo" },
                  { label: "IN PROGRESS", value: "in-progress" },
                  { label: "REVIEW", value: "review" },
                  { label: "DONE", value: "done" },
                ]}
                value={task.status}
                onChange={(val) => handleStatusChange(task._id, val)}
              />
            </motion.div>
          ))}
        </AnimatePresence>
        {tasks.length === 0 && (
          <p className="text-muted-foreground text-center py-8 italic">
            No tasks assigned yet.
          </p>
        )}
      </motion.div>
    </div>
  );
};

export default TaskList;
