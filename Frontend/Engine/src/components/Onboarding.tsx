
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Code, Layout, Sparkles, ArrowRight } from 'lucide-react';

export default function Onboarding({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(0);

  const steps = [
    {
      title: "Welcome to Engine",
      description: "Let's personalize your workspace.",
      content: (
        <div className="flex flex-col gap-4">
           <div className="p-4 border rounded-xl hover:bg-muted/50 cursor-pointer transition-colors" onClick={() => setStep(1)}>
              <h3 className="font-bold flex items-center gap-2"><Sparkles className="w-5 h-5 text-primary" /> Start a New Project</h3>
              <p className="text-sm text-muted-foreground mt-1">I have a project ready to go.</p>
           </div>
           <div className="p-4 border rounded-xl hover:bg-muted/50 cursor-pointer transition-colors" onClick={() => onComplete()}>
              <h3 className="font-bold flex items-center gap-2"><Layout className="w-5 h-5" /> Just Exploring</h3>
              <p className="text-sm text-muted-foreground mt-1">I want to look around first.</p>
           </div>
        </div>
      )
    },
    {
      title: "What do you need?",
      description: "Select the primary focus for your project.",
      content: (
        <div className="grid grid-cols-2 gap-4">
           <div className="p-6 border rounded-xl hover:border-primary cursor-pointer transition-all hover:shadow-lg group" onClick={() => setStep(2)}>
              <Code className="w-8 h-8 mb-4 group-hover:text-primary transition-colors" />
              <h3 className="font-bold">Development</h3>
           </div>
           <div className="p-6 border rounded-xl hover:border-primary cursor-pointer transition-all hover:shadow-lg group" onClick={() => setStep(2)}>
              <Layout className="w-8 h-8 mb-4 group-hover:text-primary transition-colors" />
              <h3 className="font-bold">Design</h3>
           </div>
        </div>
      )
    },
    {
      title: "You're all set!",
      description: "Your engine is ready. Let's build something great.",
      content: (
        <div className="text-center py-8">
           <Button className="rounded-full px-8 w-full" size="lg" onClick={onComplete}>
             Enter Dashboard <ArrowRight className="w-4 h-4 ml-2" />
           </Button>
        </div>
      )
    }
  ];

  const currentStep = steps[step];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="w-full max-w-lg"
      >
        <Card className="border-2 shadow-2xl">
          <CardContent className="p-8">
            <div className="mb-8">
               <h2 className="text-2xl font-black tracking-tight mb-2">{currentStep.title}</h2>
               <p className="text-muted-foreground">{currentStep.description}</p>
            </div>
            
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                {currentStep.content}
              </motion.div>
            </AnimatePresence>

            <div className="mt-8 flex justify-between items-center text-xs text-muted-foreground uppercase tracking-widest font-medium">
               <span>Step {step + 1} of {steps.length}</span>
               {step > 0 && step < steps.length - 1 && (
                 <button onClick={() => setStep(step + 1)} className="hover:text-foreground">Skip</button>
               )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
