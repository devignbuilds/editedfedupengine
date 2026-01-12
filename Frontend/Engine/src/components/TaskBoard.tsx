import type { Task } from '../types/task';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { motion, AnimatePresence } from 'framer-motion';
import { MoreHorizontal, Plus, ArrowRight } from 'lucide-react';
import { Button } from './ui/button';

interface TaskBoardProps {
  tasks: Task[];
  onStatusChange: (taskId: string, newStatus: string) => void;
  team: any[]; 
}

const columns = [
  { id: 'todo', title: 'To Do', color: 'bg-zinc-500/10 border-zinc-500/20', next: 'in-progress' },
  { id: 'in-progress', title: 'In Progress', color: 'bg-blue-500/10 border-blue-500/20', next: 'review' },
  { id: 'review', title: 'Review', color: 'bg-amber-500/10 border-amber-500/20', next: 'done' },
  { id: 'done', title: 'Done', color: 'bg-emerald-500/10 border-emerald-500/20', next: null }
];

export default function TaskBoard({ tasks, onStatusChange }: TaskBoardProps) {
  const getTasksByStatus = (status: string) => tasks.filter(t => t.status === status);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 h-full overflow-x-auto pb-4">
      {columns.map((column) => (
        <div key={column.id} className="flex flex-col h-full min-w-[280px]">
          <div className={`p-4 rounded-xl border mb-4 flex justify-between items-center ${column.color}`}>
             <h3 className="font-black uppercase tracking-widest text-xs flex items-center gap-2">
               <div className={`w-2 h-2 rounded-full ${column.id === 'done' ? 'bg-emerald-500' : column.id === 'review' ? 'bg-amber-500' : column.id === 'in-progress' ? 'bg-blue-500' : 'bg-zinc-500'}`} />
               {column.title}
             </h3>
             <span className="text-xs font-bold opacity-50">{getTasksByStatus(column.id).length}</span>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto pr-2 custom-scrollbar">
             <AnimatePresence>
               {getTasksByStatus(column.id).map((task) => (
                 <motion.div
                   layout
                   initial={{ opacity: 0, y: 10 }}
                   animate={{ opacity: 1, y: 0 }}
                   exit={{ opacity: 0, scale: 0.9 }}
                   key={task._id}
                 >
                   <Card className="hover:border-foreground/50 transition-colors cursor-move group relative overflow-hidden">
                     <CardContent className="p-4 space-y-3">
                        <div className="flex justify-between items-start">
                           <Badge variant={task.priority === 'critical' ? 'destructive' : task.priority === 'high' ? 'secondary' : 'outline'} className="text-[10px] uppercase font-black tracking-widest">
                             {task.priority}
                           </Badge>
                           <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity">
                             <MoreHorizontal className="h-4 w-4" />
                           </Button>
                        </div>
                        
                        <h4 className="font-bold text-sm leading-tight">{task.title}</h4>
                        
                        <div className="flex items-center justify-between pt-2">
                           {task.assignedTo ? (
                             <div className="flex items-center gap-2">
                               <Avatar className="h-6 w-6">
                                 <AvatarFallback className="text-[10px] bg-primary text-primary-foreground">
                                   {task.assignedTo.name.charAt(0)}
                                 </AvatarFallback>
                               </Avatar>
                               <span className="text-[10px] font-medium text-muted-foreground truncate max-w-[80px]">
                                 {task.assignedTo.name}
                               </span>
                             </div>
                           ) : (
                             <span className="text-[10px] text-muted-foreground italic">Unassigned</span>
                           )}
                           
                           {/* Quick Actions */}
                           <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              {column.next && (
                                <Button 
                                  variant="secondary" 
                                  size="icon" 
                                  className="h-6 w-6" 
                                  onClick={() => onStatusChange(task._id, column.next!)}
                                  title={`Move to ${column.next}`}
                                >
                                  <ArrowRight className="h-3 w-3" />
                                </Button>
                              )}
                           </div>
                        </div>
                     </CardContent>
                   </Card>
                 </motion.div>
               ))}
             </AnimatePresence>
             
             <Button variant="ghost" className="w-full border-2 border-dashed border-border/50 text-muted-foreground hover:text-foreground hover:border-foreground/50 text-xs font-black uppercase tracking-widest h-12">
               <Plus className="mr-2 h-3 w-3" /> Add Task
             </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
