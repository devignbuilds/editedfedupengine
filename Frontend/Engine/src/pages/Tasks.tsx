
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import DashboardLayout from '../components/layout/DashboardLayout';
import TaskBoard from '../components/TaskBoard';
import { Button } from '../components/ui/button';
import { Plus, Layout, List } from 'lucide-react';
import type { Task } from '../types/task';

const Tasks = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'board' | 'list'>('board');

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        // Fetch ALL tasks if admin, or my tasks if employee
        // For MVP, we need an endpoint to get all tasks or filtered tasks.
        // Assuming /api/tasks returns all tasks for the user's projects or similar.
        // We might need to update the backend api to support getting all tasks.
        // Let's assume there is a generic GET /api/tasks
        const response = await fetch('http://localhost:5000/api/tasks', { // This endpoint might need creation?
          headers: { Authorization: `Bearer ${user?.token}` },
        });
        
        if (response.ok) {
           const data = await response.json();
           setTasks(data);
        } else {
           // Fallback or empty
           setTasks([]);
        }
      } catch (error) {
        console.error("Failed to fetch tasks", error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.token) fetchTasks();
  }, [user]);

  const handleStatusChange = async (taskId: string, newStatus: string) => {
    // Optimistic update
    setTasks(prev => prev.map(t => t._id === taskId ? { ...t, status: newStatus } as Task : t));
    
    try {
      await fetch(`http://localhost:5000/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
    } catch (err) {
      console.error("Failed to update task", err);
      // Revert if needed
    }
  };

  return (
    <DashboardLayout>
       <div className="flex flex-col h-[calc(100vh-100px)]">
         <div className="flex justify-between items-end mb-8">
            <div>
              <h1 className="text-4xl font-black tracking-tighter uppercase italic">Tasks</h1>
              <p className="text-muted-foreground mt-1 text-lg">Global task tracking across all projects.</p>
            </div>
            
            <div className="flex items-center gap-4">
               <div className="bg-muted p-1 rounded-lg flex items-center">
                  <Button 
                    variant={viewMode === 'board' ? 'secondary' : 'ghost'} 
                    size="sm" 
                    onClick={() => setViewMode('board')}
                    className="h-8 w-8 p-0"
                  >
                    <Layout className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant={viewMode === 'list' ? 'secondary' : 'ghost'} 
                    size="sm" 
                    onClick={() => setViewMode('list')}
                    className="h-8 w-8 p-0"
                  >
                    <List className="h-4 w-4" />
                  </Button>
               </div>
               
               <Button className="rounded-full font-black uppercase tracking-widest text-[10px] px-6">
                 <Plus className="mr-2 h-4 w-4" /> New Task
               </Button>
            </div>
         </div>

         <div className="flex-1 overflow-hidden">
            {loading ? (
              <div className="flex items-center justify-center h-full">Loading tasks...</div>
            ) : viewMode === 'board' ? (
              <TaskBoard tasks={tasks} onStatusChange={handleStatusChange} team={[]} />
            ) : (
              <div className="bg-card border border-border rounded-2xl p-6">
                 <p className="items-center justify-center flex h-40 text-muted-foreground italic">List view coming soon.</p>
              </div>
            )}
         </div>
       </div>
    </DashboardLayout>
  );
};

export default Tasks;
