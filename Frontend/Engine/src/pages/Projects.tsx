import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import type { Project } from '../types/project';
import { useNavigate } from 'react-router-dom';
import CreateProjectModal from '../components/CreateProjectModal';
import { motion } from 'framer-motion';

import DashboardLayout from '../components/layout/DashboardLayout';
import { Plus } from 'lucide-react';
import { Button } from '../components/ui/button';

const Projects = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/projects', {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        });
        const data = await response.json();
        if (response.ok) {
          setProjects(data);
        } else {
          setError(data.message || 'Failed to fetch projects');
        }
      } catch (err) {
        setError('Server error');
      } finally {
        setLoading(false);
      }
    };

    if (user?.token) {
      fetchProjects();
    }
  }, [user]);

  const refreshProjects = async () => {
    window.location.reload();
  };

  if (loading) return <DashboardLayout><div className="p-8">Loading projects...</div></DashboardLayout>;
  if (error) return <DashboardLayout><div className="text-destructive p-8">{error}</div></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="flex justify-between items-end mb-10">
        <div>
          <h1 className="text-4xl font-black tracking-tighter">Projects</h1>
          <p className="text-muted-foreground mt-1 text-lg">Manage and monitor all active platform projects.</p>
        </div>
        {user?.role === 'admin' && (
          <Button 
            onClick={() => setIsModalOpen(true)}
            className="rounded-full px-6 font-bold uppercase tracking-widest text-[10px]"
          >
            <Plus className="mr-2 h-4 w-4" /> New Project
          </Button>
        )}
      </div>

      <motion.div 
        layout
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
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
      >
        {projects.map((project) => (
          <motion.div
            key={project._id}
            variants={{
              hidden: { opacity: 0, y: 20 },
              show: { opacity: 1, y: 0 }
            }}
            onClick={() => navigate(`/projects/${project._id}`)}
            className="group bg-card border border-border text-card-foreground p-8 rounded-3xl hover:border-foreground transition-all cursor-pointer shadow-sm hover:shadow-2xl overflow-hidden relative"
          >
            <div className="flex justify-between items-start mb-6">
              <h3 className="font-black text-2xl tracking-tighter group-hover:underline underline-offset-8 decoration-2">{project.name}</h3>
              <span className={`px-4 py-1 text-[10px] font-black rounded-full border border-border uppercase tracking-widest ${
                project.status === 'active' 
                  ? 'bg-primary text-primary-foreground border-primary' 
                  : project.status === 'pending'
                  ? 'bg-muted text-muted-foreground animate-pulse'
                  : 'bg-muted text-muted-foreground'
              }`}>
                {project.status}
              </span>
            </div>
            <p className="text-muted-foreground text-sm line-clamp-3 mb-8 leading-relaxed font-medium">
              {project.description || 'No description provided for this project.'}
            </p>
            <div className="flex justify-between items-center text-[10px] border-t border-border/50 pt-6 mt-auto font-black uppercase tracking-widest">
              <span className="text-muted-foreground opacity-60">
                Budget: <span className="text-foreground tracking-tight">${project.budget?.toLocaleString() || 0}</span>
              </span>
              <span className="text-muted-foreground opacity-60">
                Due: <span className="text-foreground tracking-tight">{project.deadline ? new Date(project.deadline).toLocaleDateString() : 'N/A'}</span>
              </span>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {projects.length === 0 && (
        <div className="py-40 text-center border-2 border-dashed border-border rounded-3xl">
          <p className="text-muted-foreground text-xl font-bold opacity-30 italic">No projects found on the platform.</p>
        </div>
      )}

      <CreateProjectModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onProjectCreated={refreshProjects}
      />
    </DashboardLayout>

  );
};

export default Projects;
