
import { CheckCircle2, ArrowRight, Plus, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Link } from 'react-router-dom';
import type { Project } from '../types/project';

interface ClientNextStepsProps {
  projects: Project[];
  onCreateProject: () => void;
}

export default function ClientNextSteps({ projects, onCreateProject }: ClientNextStepsProps) {
  const hasProjects = projects.length > 0;
  // Mock logic for next steps. In real app, check specific flags.
  const hasInvoices = false; // Placeholder

  const steps = [
    {
      id: 'create-project',
      label: 'Initialize Project',
      description: 'Start your digital transformation.',
      isCompleted: hasProjects,
      action: onCreateProject,
      actionLabel: 'Create New',
      icon: Plus
    },
    {
      id: 'review-timeline',
      label: 'Review Timeline',
      description: 'Check project milestones and deadlines.',
      isCompleted: false, // Always a "next step" if active
      link: hasProjects ? `/projects/${projects[0]?._id}` : undefined,
      actionLabel: 'View Roadmap',
      icon: ArrowRight,
      disabled: !hasProjects
    },
    {
      id: 'check-invoices',
      label: 'Settle Invoices',
      description: 'Review pending payments and history.',
      isCompleted: !hasInvoices,
      link: '/invoices', // assuming route
      actionLabel: 'View Billing',
      icon: FileText,
      disabled: !hasProjects
    }
  ];

  // If no projects, the main focus is just step 1.
  // We can show a progress bar or just a list.

  return (
    <Card className="overflow-hidden border-border/50">
      <CardHeader className="bg-muted/20 border-b border-border/50 pb-4">
        <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-primary" />
          Onboarding Checklist
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-border/50">
          {steps.map((step, index) => (
            <div 
              key={step.id} 
              className={`p-4 flex items-center gap-4 transition-colors ${step.disabled ? 'opacity-50 pointer-events-none' : 'hover:bg-muted/30'}`}
            >
              <div className={`
                h-8 w-8 rounded-full flex items-center justify-center border-2 
                ${step.isCompleted 
                  ? 'bg-primary border-primary text-primary-foreground' 
                  : 'border-muted-foreground/30 text-muted-foreground'
                }
              `}>
                {step.isCompleted ? <CheckCircle2 className="h-4 w-4" /> : <span className="text-xs font-bold">{index + 1}</span>}
              </div>
              
              <div className="flex-1">
                <h4 className={`text-sm font-bold ${step.isCompleted ? 'text-muted-foreground line-through' : 'text-foreground'}`}>
                  {step.label}
                </h4>
                <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                  {step.description}
                </p>
              </div>

              {!step.isCompleted && (
                 step.link ? (
                   <Link to={step.link}>
                     <Button variant="ghost" size="sm" className="h-8 text-xs font-black uppercase tracking-widest">
                       {step.actionLabel} <ArrowRight className="ml-1 h-3 w-3" />
                     </Button>
                   </Link>
                 ) : (
                   <Button onClick={step.action} variant="ghost" size="sm" className="h-8 text-xs font-black uppercase tracking-widest">
                     {step.actionLabel} <ArrowRight className="ml-1 h-3 w-3" />
                   </Button>
                 )
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
