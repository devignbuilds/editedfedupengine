import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './ui/button';
import { Sparkles, ArrowRight, Clock, Zap, Target, Layers, Smartphone, ShoppingCart, Palette, Code2, X } from 'lucide-react';

interface OnboardingWizardProps {
  onComplete: () => void;
}

const OnboardingWizard = ({ onComplete }: OnboardingWizardProps) => {
  const [step, setStep] = useState(0);
  const [selections, setSelections] = useState<{
    projectType?: string;
    serviceType?: string;
    timeline?: string;
    wantsTutorial?: boolean;
  }>({});

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);
  
  const handleSelection = (key: string, value: string) => {
    setSelections({ ...selections, [key]: value });
    setTimeout(nextStep, 300);
  };

  const totalSteps = 4;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-3xl">
       <div className="w-full max-w-6xl p-8 relative">
          {/* Skip Button */}
          {step > 0 && (
            <button
              onClick={onComplete}
              className="absolute top-4 right-4 z-50 h-10 w-10 rounded-full bg-muted/50 hover:bg-muted flex items-center justify-center transition-colors group"
              aria-label="Skip onboarding"
            >
              <X className="h-5 w-5 text-muted-foreground group-hover:text-foreground" />
            </button>
          )}

          {/* Progress Indicator */}
          {step > 0 && step < totalSteps && (
            <div className="mb-8">
              <div className="flex justify-center gap-2">
                {[...Array(totalSteps - 1)].map((_, i) => (
                  <div
                    key={i}
                    className={`h-1.5 w-16 rounded-full transition-all duration-300 ${
                      i < step ? 'bg-primary' : 'bg-muted'
                    }`}
                  />
                ))}
              </div>
              <p className="text-center text-sm text-muted-foreground mt-4">
                Step {step} of {totalSteps - 1}
              </p>
            </div>
          )}

          <AnimatePresence mode="wait">
            {/* Welcome Screen */}
            {step === 0 && (
                <motion.div 
                    key="step0"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.4 }}
                    className="text-center bg-card border border-border/40 p-16 rounded-[40px] shadow-2xl"
                >
                    <div className="inline-flex h-20 w-20 bg-primary/10 rounded-full items-center justify-center mb-8 border border-primary/20 relative">
                        <Sparkles className="h-8 w-8 text-primary animate-pulse" />
                        <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse" />
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-6">Welcome to the Engine</h2>
                    <p className="text-xl text-muted-foreground/80 max-w-2xl mx-auto mb-4 leading-relaxed font-medium">
                        Your Modular Service OS. <br/>
                        Built by the DevignBuilds team for teams like yours.
                    </p>
                    <p className="text-base text-muted-foreground/60 max-w-xl mx-auto mb-12">
                        Let's personalize your experience in just a few quick steps.
                    </p>
                    <Button size="lg" className="h-16 px-12 rounded-full text-lg font-bold transition-all hover:scale-105 shadow-lg" onClick={nextStep}>
                        Let's Begin <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                </motion.div>
            )}

            {/* Step 1: Project Type */}
            {step === 1 && (
                <motion.div 
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.4 }}
                >
                    <h2 className="text-3xl font-black tracking-tight mb-3 text-center">What are you building?</h2>
                    <p className="text-center text-muted-foreground mb-12">Select your primary project type</p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12 max-w-5xl mx-auto">
                         <ProjectTypeCard 
                           title="Web App" 
                           icon={<Layers className="h-7 w-7" />} 
                           onClick={() => handleSelection('projectType', 'web-app')}
                           selected={selections.projectType === 'web-app'}
                         />
                         <ProjectTypeCard 
                           title="Mobile App" 
                           icon={<Smartphone className="h-7 w-7" />} 
                           onClick={() => handleSelection('projectType', 'mobile-app')}
                           selected={selections.projectType === 'mobile-app'}
                         />
                         <ProjectTypeCard 
                           title="Website" 
                           icon={<Zap className="h-7 w-7" />} 
                           onClick={() => handleSelection('projectType', 'website')}
                           selected={selections.projectType === 'website'}
                         />
                         <ProjectTypeCard 
                           title="E-commerce" 
                           icon={<ShoppingCart className="h-7 w-7" />} 
                           onClick={() => handleSelection('projectType', 'ecommerce')}
                           selected={selections.projectType === 'ecommerce'}
                         />
                         <ProjectTypeCard 
                           title="Design System" 
                           icon={<Palette className="h-7 w-7" />} 
                           onClick={() => handleSelection('projectType', 'design-system')}
                           selected={selections.projectType === 'design-system'}
                         />
                         <ProjectTypeCard 
                           title="Branding" 
                           icon={<Sparkles className="h-7 w-7" />} 
                           onClick={() => handleSelection('projectType', 'branding')}
                           selected={selections.projectType === 'branding'}
                         />
                         <ProjectTypeCard 
                           title="API/Backend" 
                           icon={<Code2 className="h-7 w-7" />} 
                           onClick={() => handleSelection('projectType', 'api')}
                           selected={selections.projectType === 'api'}
                         />
                         <ProjectTypeCard 
                           title="Custom" 
                           icon={<Target className="h-7 w-7" />} 
                           onClick={() => handleSelection('projectType', 'custom')}
                           selected={selections.projectType === 'custom'}
                         />
                    </div>
                </motion.div>
            )}

            {/* Step 2: Service Type */}
            {step === 2 && (
                <motion.div 
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.4 }}
                >
                    <h2 className="text-3xl font-black tracking-tight mb-3 text-center">What do you need?</h2>
                    <p className="text-center text-muted-foreground mb-12">Choose your service preference</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto">
                         <ServiceCard 
                           title="Development" 
                           description="Full-stack engineering and technical implementation"
                           icon={<Code2 className="h-8 w-8" />} 
                           onClick={() => handleSelection('serviceType', 'development')}
                           selected={selections.serviceType === 'development'}
                         />
                         <ServiceCard 
                           title="Design" 
                           description="UI/UX design, branding, and visual identity"
                           icon={<Palette className="h-8 w-8" />} 
                           onClick={() => handleSelection('serviceType', 'design')}
                           selected={selections.serviceType === 'design'}
                         />
                         <ServiceCard 
                           title="Both" 
                           description="End-to-end design and development services"
                           icon={<Sparkles className="h-8 w-8" />} 
                           onClick={() => handleSelection('serviceType', 'both')}
                           selected={selections.serviceType === 'both'}
                         />
                    </div>
                    
                    {step > 0 && (
                      <div className="text-center">
                        <Button variant="ghost" onClick={prevStep} className="text-sm">
                          <ArrowRight className="mr-2 h-4 w-4 rotate-180" />
                          Back
                        </Button>
                      </div>
                    )}
                </motion.div>
            )}

            {/* Step 3: Timeline */}
            {step === 3 && (
                <motion.div 
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.4 }}
                >
                    <h2 className="text-3xl font-black tracking-tight mb-3 text-center">Project Timeline?</h2>
                    <p className="text-center text-muted-foreground mb-12">When do you need this delivered?</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto">
                         <ServiceCard 
                           title="ASAP" 
                           description="Sprint mode - highest priority, fastest turnaround"
                           icon={<Zap className="h-8 w-8" />} 
                           onClick={() => handleSelection('timeline', 'asap')}
                           selected={selections.timeline === 'asap'}
                         />
                         <ServiceCard 
                           title="Standard" 
                           description="2-4 weeks - balanced timeline for quality delivery"
                           icon={<Clock className="h-8 w-8" />} 
                           onClick={() => handleSelection('timeline', 'standard')}
                           selected={selections.timeline === 'standard'}
                         />
                         <ServiceCard 
                           title="Flexible" 
                           description="No rush - we'll work at a comfortable pace"
                           icon={<Layers className="h-8 w-8" />} 
                           onClick={() => handleSelection('timeline', 'flexible')}
                           selected={selections.timeline === 'flexible'}
                         />
                    </div>
                    
                    <div className="text-center">
                      <Button variant="ghost" onClick={prevStep} className="text-sm">
                        <ArrowRight className="mr-2 h-4 w-4 rotate-180" />
                        Back
                      </Button>
                    </div>
                </motion.div>
            )}

             {/*Step 4: Setup Complete / Tutorial Option */}
             {step === 4 && (
                <motion.div 
                    key="step4"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.05 }}
                    className="text-center bg-card border border-border/40 p-16 rounded-[40px] shadow-2xl max-w-3xl mx-auto"
                >
                    <div className="inline-flex h-20 w-20 bg-primary/10 rounded-full items-center justify-center mb-8 border border-primary/20">
                        <Sparkles className="h-10 w-10 text-primary" />
                    </div>
                    <h2 className="text-4xl font-black mb-6">Setup Complete!</h2>
                    <p className="text-xl text-muted-foreground/80 max-w-xl mx-auto mb-4">
                       Your Engine is configured and ready. <br/>
                       Modules loaded: <strong>Projects</strong>, <strong>Chat</strong>, <strong>Payments</strong>.
                    </p>
                    
                    <div className="bg-muted/30 rounded-2xl p-6 mb-10 mt-8">
                      <p className="text-sm font-bold text-muted-foreground mb-4">Want a quick tour of the dashboard?</p>
                      <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button 
                          size="lg" 
                          className="rounded-full px-10 h-14 font-bold"
                          onClick={() => {
                            setSelections({ ...selections, wantsTutorial: true });
                            onComplete();
                          }}
                        >
                          <Sparkles className="mr-2 h-5 w-5" />
                          Show Me Around
                        </Button>
                        <Button 
                          size="lg" 
                          variant="outline"
                          className="rounded-full px-10 h-14 font-bold"
                          onClick={() => {
                            setSelections({ ...selections, wantsTutorial: false });
                            onComplete();
                          }}
                        >
                          I'll Explore on My Own
                        </Button>
                      </div>
                    </div>
                </motion.div>
            )}
          </AnimatePresence>
       </div>
    </div>
  );
};

// Project Type Card Component
function ProjectTypeCard({ title, icon, onClick, selected }: { title: string, icon: React.ReactNode, onClick: () => void, selected?: boolean }) {
    return (
        <div 
            onClick={onClick}
            className={`p-6 rounded-2xl border-2 cursor-pointer transition-all duration-200 hover:scale-[1.02] group flex flex-col items-center text-center justify-center aspect-square ${
              selected 
                ? 'border-primary bg-primary/10 shadow-lg' 
                : 'border-border/40 bg-card hover:border-primary/30 hover:shadow-lg'
            }`}
        >
            <div className={`mb-3 p-3 rounded-xl transition-colors ${
              selected ? 'bg-primary/20 text-primary' : 'bg-muted/50 group-hover:bg-primary/10 group-hover:text-primary'
            }`}>
                {icon}
            </div>
            <h3 className="text-base font-bold">{title}</h3>
        </div>
    )
}

// Service Card Component  
function ServiceCard({ title, description, icon, onClick, selected }: { title: string, description: string, icon: React.ReactNode, onClick: () => void, selected?: boolean }) {
    return (
        <div 
            onClick={onClick}
            className={`p-8 rounded-3xl border-2 cursor-pointer transition-all duration-200 hover:scale-[1.02] group flex flex-col items-center text-center ${
              selected 
                ? 'border-primary bg-primary/10 shadow-lg' 
                : 'border-border/40 bg-card hover:border-primary/30 hover:shadow-lg'
            }`}
        >
            <div className={`mb-4 p-4 rounded-2xl transition-colors ${
              selected ? 'bg-primary/20 text-primary' : 'bg-muted/50 group-hover:bg-primary/10 group-hover:text-primary'
            }`}>
                {icon}
            </div>
            <h3 className="text-xl font-black mb-2">{title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
        </div>
    )
}

export default OnboardingWizard;
