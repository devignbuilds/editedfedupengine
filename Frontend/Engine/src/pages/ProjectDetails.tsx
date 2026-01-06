import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { Project } from '../types/project';
import TaskList from '../components/TaskList';
import ChatWindow from '../components/ChatWindow';
import { motion } from 'framer-motion';
import DashboardLayout from '../components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { ArrowLeft, Calendar, DollarSign, Users as TeamIcon, FileText } from 'lucide-react';

const ProjectDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/projects/${id}`, {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        });
        const data = await response.json();
        if (response.ok) {
          setProject(data);
        } else {
          setError(data.message || 'Failed to fetch project');
        }
      } catch (err) {
        setError('Server error');
      } finally {
        setLoading(false);
      }
    };

    if (user?.token && id) {
      fetchProject();
    }
  }, [user, id]);

  if (loading) return <DashboardLayout><div className="p-8">Loading project...</div></DashboardLayout>;
  if (error) return <DashboardLayout><div className="text-destructive p-8">{error}</div></DashboardLayout>;
  if (!project) return <DashboardLayout><div className="p-8">Project not found</div></DashboardLayout>;

  return (
    <DashboardLayout>
      <Link to="/projects" className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors group">
        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
        <span className="font-bold uppercase tracking-widest text-[10px]">Back to Projects</span>
      </Link>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-black tracking-tighter mb-2">{project.name}</h1>
            <p className="text-muted-foreground max-w-2xl text-lg leading-relaxed">{project.description}</p>
          </div>
          <span className={`px-4 py-1.5 rounded-full text-xs font-black tracking-widest uppercase border ${
            project.status === 'active' 
              ? 'bg-primary text-primary-foreground border-primary' 
              : 'bg-muted text-muted-foreground border-border'
          }`}>
            {project.status}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Card>
              <CardHeader className="border-b border-border/50">
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Documentation & Metadata
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Client Information</p>
                    <div className="bg-muted/30 p-4 rounded-xl border border-border">
                      <p className="font-black text-lg">{project.client?.name}</p>
                      <p className="text-sm text-muted-foreground font-medium">{project.client?.email}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Budget & Timeline</p>
                    <div className="grid grid-cols-2 gap-4 text-sm font-bold">
                      <div className="bg-muted/30 p-3 rounded-xl border border-border">
                        <DollarSign className="h-4 w-4 mb-2 text-muted-foreground" />
                        <p className="text-xs text-muted-foreground uppercase opacity-70">Budget</p>
                        <p className="text-lg tracking-tight">${(project.budget ?? 0).toLocaleString()}</p>
                      </div>
                      <div className="bg-muted/30 p-3 rounded-xl border border-border">
                        <Calendar className="h-4 w-4 mb-2 text-muted-foreground" />
                        <p className="text-xs text-muted-foreground uppercase opacity-70">Deadline</p>
                        <p className="text-lg tracking-tight">{project.deadline ? new Date(project.deadline).toLocaleDateString() : 'TBD'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
              <TaskList projectId={project._id} team={project.employees} />
            </div>
          </div>

          <div className="space-y-8">
            <Card>
              <CardHeader className="border-b border-border/50">
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <TeamIcon className="h-5 w-5" />
                  Assigned Team
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-3">
                  {project.employees?.map((emp) => (
                    <div key={emp._id} className="flex items-center gap-3 p-3 bg-muted/30 rounded-xl border border-border group hover:border-foreground transition-colors">
                      <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-black text-xs">
                        {emp.name.charAt(0)}
                      </div>
                      <div className="overflow-hidden">
                        <p className="font-bold text-sm truncate">{emp.name}</p>
                        <p className="text-[10px] text-muted-foreground font-medium truncate uppercase tracking-tighter">{emp.email}</p>
                      </div>
                    </div>
                  ))}
                  {project.employees?.length === 0 && (
                    <p className="text-muted-foreground text-sm text-center py-8 italic">No team members assigned.</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <ChatWindow projectId={project._id} />
          </div>
        </div>
      </motion.div>
    </DashboardLayout>

  );
};

export default ProjectDetails;
