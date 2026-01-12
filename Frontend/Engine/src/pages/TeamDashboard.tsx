import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import type { Project } from '../types/project';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, Mail, Briefcase } from 'lucide-react';

import DashboardLayout from '../components/layout/DashboardLayout';

const TeamDashboard = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [myTasks, setMyTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectsRes, usersRes, tasksRes] = await Promise.all([
          fetch('http://localhost:5000/api/projects', {
            headers: { Authorization: `Bearer ${user?.token}` },
          }),
          fetch('http://localhost:5000/api/users', {
            headers: { Authorization: `Bearer ${user?.token}` },
          }),
          fetch('http://localhost:5000/api/tasks', { // Assuming this returns all accessible tasks
            headers: { Authorization: `Bearer ${user?.token}` },
          })
        ]);

        const projectsData = await projectsRes.json();
        const usersData = await usersRes.json();
        const tasksData = tasksRes.ok ? await tasksRes.json() : [];

        if (projectsRes.ok) setProjects(projectsData);
        if (usersRes.ok) {
          const employees = usersData.filter((u: any) => u.role === 'employee');
          setTeamMembers(employees);
        }
        if (tasksRes.ok) {
           // Filter for 'my tasks' if the API returns more
           const myTasksData = tasksData.filter((t: any) => t.assignedTo?._id === user?._id || t.assignedTo === user?._id);
           setMyTasks(myTasksData);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.token) {
      fetchData();
    }
  }, [user]);

  if (loading) return <DashboardLayout><div className="p-8">Loading dashboard...</div></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="mb-12">
        <h1 className="text-4xl font-black tracking-tighter uppercase italic">Team Dashboard</h1>
        <p className="text-muted-foreground mt-1">Manage your team members and collaborative projects.</p>
      </div>

      {/* My Tasks Section */}
      <div className="mb-12">
         <div className="flex items-center space-x-3 mb-6">
           <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center">
             <Briefcase className="h-3 w-3 text-primary" />
           </div>
           <h2 className="text-2xl font-black uppercase tracking-tight">My Tasks</h2>
           <span className="px-3 py-1 bg-muted rounded-full text-xs font-black">{myTasks.length}</span>
           <Link to="/tasks" className="ml-auto text-xs font-bold uppercase tracking-widest text-primary hover:underline">View Board</Link>
         </div>
         
         {myTasks.length > 0 ? (
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
             {myTasks.slice(0, 4).map((task) => (
               <div key={task._id} className="p-4 rounded-xl border border-border bg-card hover:border-foreground/50 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                     <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-black tracking-wider ${
                        task.priority === 'critical' ? 'bg-destructive/10 text-destructive' : 'bg-muted text-muted-foreground'
                     }`}>
                       {task.priority || 'medium'}
                     </span>
                     <span className="text-[10px] text-muted-foreground font-bold uppercase">{task.status}</span>
                  </div>
                  <h4 className="font-bold text-sm mb-1 truncate">{task.title}</h4>
                  <p className="text-xs text-muted-foreground truncate opacity-70 mb-3">{task.description || 'No description'}</p>
                  {task.dueDate && (
                    <div className="text-[10px] font-medium text-muted-foreground bg-muted/30 px-2 py-1 rounded w-fit">
                      Due: {new Date(task.dueDate).toLocaleDateString()}
                    </div>
                  )}
               </div>
             ))}
           </div>
         ) : (
           <div className="p-8 border-2 border-dashed border-border rounded-2xl text-center">
             <p className="text-muted-foreground font-medium italic">No active tasks assigned to you.</p>
           </div>
         )}
      </div>

      {/* Team Members Section */}
      <div className="mb-12">
        <div className="flex items-center space-x-3 mb-6">
          <Users className="h-6 w-6" />
          <h2 className="text-2xl font-black uppercase tracking-tight">Team Members</h2>
          <span className="px-3 py-1 bg-muted rounded-full text-xs font-black">{teamMembers.length}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teamMembers.map((member) => (
            <motion.div
              key={member._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass hover-glow p-6 rounded-2xl transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-black text-lg tracking-tight">{member.name}</h3>
                  <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold mt-1">{member.role}</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-foreground/10 flex items-center justify-center">
                  <span className="text-sm font-black">{member.name.charAt(0)}</span>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2 text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <span className="text-xs">{member.email}</span>
                </div>
                <div className="flex items-center space-x-2 text-muted-foreground">
                  <Briefcase className="h-4 w-4" />
                  <span className="text-xs font-bold">
                    {projects.filter(p => p.employees?.some((e: any) => e._id === member._id)).length} Active Projects
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
          {teamMembers.length === 0 && (
            <div className="col-span-full py-12 text-center border-2 border-dashed border-border rounded-2xl">
              <p className="text-muted-foreground font-medium">No team members found.</p>
            </div>
          )}
        </div>
      </div>

      {/* Projects Section */}
      <div>
        <div className="flex items-center space-x-3 mb-6">
          <Briefcase className="h-6 w-6" />
          <h2 className="text-2xl font-black uppercase tracking-tight">Active Projects</h2>
          <span className="px-3 py-1 bg-muted rounded-full text-xs font-black">{projects.length}</span>
        </div>

        <motion.div 
          initial="hidden"
          animate="show"
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {projects.map((project) => (
            <motion.div
              key={project._id}
              variants={{
                hidden: { opacity: 0, y: 10 },
                show: { opacity: 1, y: 0 }
              }}
            >
              <Link
                to={`/projects/${project._id}`}
                className="block h-full glass hover-glow p-6 rounded-2xl transition-all shadow-sm group"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-black text-xl tracking-tight group-hover:underline underline-offset-4">{project.name}</h3>
                  <span
                    className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-full border ${
                      project.status === 'active'
                        ? 'bg-foreground text-background border-foreground'
                        : 'bg-muted text-muted-foreground border-border'
                    }`}
                  >
                    {project.status}
                  </span>
                </div>
                <p className="text-muted-foreground text-sm mb-6 line-clamp-2 leading-relaxed">
                  {project.description || 'No description available for this project.'}
                </p>
                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest border-t border-border/50 pt-4">
                  <span className="text-muted-foreground">Client: <span className="text-foreground">{project.client?.name || 'N/A'}</span></span>
                  <span className="text-muted-foreground">Team: <span className="text-foreground">{project.employees?.length || 0}</span></span>
                </div>
              </Link>
            </motion.div>
          ))}
          {projects.length === 0 && (
            <div className="col-span-full py-20 text-center border border-dashed border-border rounded-2xl">
              <p className="text-muted-foreground italic font-medium">No projects assigned to your team.</p>
            </div>
          )}
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default TeamDashboard;
