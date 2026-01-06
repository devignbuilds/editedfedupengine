import { useState, useEffect, type FormEvent } from 'react';
import { useAuth } from '../context/AuthContext';
import type { Task } from '../types/task';
import type { User } from '../types/user';
import { motion, AnimatePresence } from 'framer-motion';

interface TaskListProps {
  projectId: string;
  team: User[];
}

const TaskList = ({ projectId, team }: TaskListProps) => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskAssignee, setNewTaskAssignee] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState('medium');
  const [newTaskDueDate, setNewTaskDueDate] = useState('');

  useEffect(() => {
    fetchTasks();
  }, [projectId]);

  const fetchTasks = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/tasks/project/${projectId}`, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setTasks(data);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (e: FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    try {
      const response = await fetch('http://localhost:5000/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify({
          title: newTaskTitle,
          project: projectId,
          assignedTo: newTaskAssignee || undefined,
          status: 'todo',
          priority: newTaskPriority,
          dueDate: newTaskDueDate || undefined,
        }),
      });

      if (response.ok) {
        setNewTaskTitle('');
        setNewTaskAssignee('');
        setNewTaskPriority('medium');
        setNewTaskDueDate('');
        fetchTasks();
      }
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const handleStatusChange = async (taskId: string, newStatus: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        fetchTasks();
      }
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  if (loading) return <div>Loading tasks...</div>;

  return (
    <div className="mt-8">
      <h3 className="text-2xl font-bold mb-4">Tasks</h3>

      {/* Create Task Form */}
      <form onSubmit={handleCreateTask} className="bg-card text-card-foreground border border-border p-4 rounded mb-6 gap-4 grid grid-cols-1 md:grid-cols-4">
        <input
          type="text"
          placeholder="New Task Title"
          className="bg-input text-foreground border border-input rounded px-3 py-2 focus:ring-1 focus:ring-ring outline-none"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
        />
        <select
          className="bg-input text-foreground border border-input rounded px-3 py-2 focus:ring-1 focus:ring-ring outline-none"
          value={newTaskAssignee}
          onChange={(e) => setNewTaskAssignee(e.target.value)}
        >
          <option value="">Assign to...</option>
          {team.map((member) => (
            <option key={member._id} value={member._id}>
              {member.name}
            </option>
          ))}
        </select>
        <select
          className="bg-input text-foreground border border-input rounded px-3 py-2 focus:ring-1 focus:ring-ring outline-none"
          value={newTaskPriority}
          onChange={(e) => setNewTaskPriority(e.target.value)}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="critical">Critical</option>
        </select>
        <input 
          type="date"
          className="bg-input text-foreground border border-input rounded px-3 py-2 focus:ring-1 focus:ring-ring outline-none"
          value={newTaskDueDate}
          onChange={(e) => setNewTaskDueDate(e.target.value)}
        />
        <button
          type="submit"
          className="bg-primary text-primary-foreground px-4 py-2 rounded hover:opacity-90 col-span-full md:col-auto font-bold"
        >
          Add Task
        </button>
      </form>

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
                  <span className={`text-[10px] uppercase border px-2 py-0.5 rounded-full font-black tracking-widest ${
                    task.priority === 'critical' 
                      ? 'bg-primary text-primary-foreground border-primary' 
                      : 'border-border text-muted-foreground'
                  }`}>
                    {task.priority || 'medium'}
                  </span>
                </div>
                <div className="flex gap-4 text-xs text-muted-foreground font-medium">
                  <p>Assigned: <span className="text-foreground">{task.assignedTo?.name || 'Unassigned'}</span></p>
                  {task.dueDate && <p>Due: <span className="text-foreground">{new Date(task.dueDate).toLocaleDateString()}</span></p>}
                </div>
              </div>
              <select
                value={task.status}
                onChange={(e) => handleStatusChange(task._id, e.target.value)}
                className="bg-muted/50 border border-border rounded-lg px-3 py-1.5 text-xs font-bold cursor-pointer hover:bg-muted focus:outline-none focus:ring-1 focus:ring-foreground transition-colors appearance-none"
              >
                <option value="todo">TO DO</option>
                <option value="in-progress">IN PROGRESS</option>
                <option value="review">REVIEW</option>
                <option value="done">DONE</option>
              </select>
            </motion.div>
          ))}
        </AnimatePresence>
        {tasks.length === 0 && <p className="text-muted-foreground text-center py-8 italic">No tasks assigned yet.</p>}
      </motion.div>
    </div>
  );
};

export default TaskList;
