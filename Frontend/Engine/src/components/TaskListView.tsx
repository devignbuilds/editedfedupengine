import { motion } from "framer-motion";
import type { Task } from "../types/task";
import { Badge } from "./ui/badge";
import CustomSelect from "./ui/CustomSelect";
import { Calendar, Briefcase } from "lucide-react";
import { cn } from "../lib/utils";

interface TaskListViewProps {
  tasks: Task[];
  onStatusChange: (taskId: string, newStatus: string) => void;
}

const TaskListView = ({ tasks, onStatusChange }: TaskListViewProps) => {
  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Task</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Project</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Assignee</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Priority</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Due Date</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {tasks.map((task, i) => (
              <motion.tr
                key={task._id}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="hover:bg-muted/10 transition-colors group"
              >
                <td className="px-6 py-4">
                  <p className="font-bold text-sm group-hover:text-primary transition-colors">{task.title}</p>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                    <Briefcase className="h-3 w-3" />
                    <span>{(task.project as any)?.name || "Internal"}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-xs font-medium">
                    <div className="h-5 w-5 rounded-full bg-primary/20 text-primary flex items-center justify-center font-black text-[8px]">
                      {task.assignedTo?.name?.[0] || "?"}
                    </div>
                    <span>{task.assignedTo?.name || "Unassigned"}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-[9px] font-black px-2 py-0.5 uppercase tracking-widest rounded-md",
                      task.priority === "critical" && "bg-destructive/10 text-destructive border-destructive/20",
                      task.priority === "high" && "bg-orange-500/10 text-orange-500 border-orange-500/20",
                      task.priority === "medium" && "bg-primary/10 text-primary border-primary/20",
                      task.priority === "low" && "bg-muted text-muted-foreground border-border"
                    )}
                  >
                    {task.priority || "medium"}
                  </Badge>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>
                      {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "No Date"}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <CustomSelect
                    className="w-32 h-8"
                    options={[
                      { label: "TO DO", value: "todo" },
                      { label: "DOING", value: "in-progress" },
                      { label: "REVIEW", value: "review" },
                      { label: "DONE", value: "done" },
                    ]}
                    value={task.status}
                    onChange={(val) => onStatusChange(task._id, val)}
                  />
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
        {tasks.length === 0 && (
          <div className="py-20 text-center text-muted-foreground italic">
            No tasks found matching your criteria.
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskListView;
