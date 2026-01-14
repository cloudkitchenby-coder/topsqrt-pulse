import { useState } from 'react';
import { HelpCircle, ArrowRight, CheckCircle, RefreshCw, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

interface JourneyStep {
  id: string;
  label: string;
  description: string;
  outcomes: {
    result: string;
    nextStep: string;
    icon: 'check' | 'refresh' | 'close';
  }[];
}

const journeySteps: JourneyStep[] = [
  {
    id: 'new-client',
    label: 'New Client',
    description: 'Client registration',
    outcomes: [
      { result: 'Registered', nextStep: 'Trial Visit', icon: 'check' },
    ],
  },
  {
    id: 'trial-visit',
    label: 'Trial Visit',
    description: 'Officer visits for trial',
    outcomes: [
      { result: 'Done - Agreed', nextStep: 'Payment Visit', icon: 'check' },
      { result: 'Follow-Up', nextStep: 'Trial Visit', icon: 'refresh' },
      { result: 'Rejected', nextStep: 'Unsubscriber', icon: 'close' },
    ],
  },
  {
    id: 'payment-visit',
    label: 'Payment Visit',
    description: 'Payment collection',
    outcomes: [
      { result: 'Done - Collected', nextStep: 'Bill Making', icon: 'check' },
      { result: 'Follow-Up', nextStep: 'Payment Call', icon: 'refresh' },
      { result: 'Unavailable', nextStep: 'Payment Call', icon: 'refresh' },
    ],
  },
  {
    id: 'bill-making',
    label: 'Bill Making',
    description: 'Generate bill',
    outcomes: [
      { result: 'Done', nextStep: 'Bill Distributing', icon: 'check' },
    ],
  },
  {
    id: 'bill-distributing',
    label: 'Bill Distributing',
    description: 'Deliver bill to client',
    outcomes: [
      { result: 'Done', nextStep: 'Bill WhatsApp', icon: 'check' },
    ],
  },
  {
    id: 'bill-whatsapp',
    label: 'Bill WhatsApp',
    description: 'Send bill via WhatsApp',
    outcomes: [
      { result: 'Done', nextStep: 'Active Client', icon: 'check' },
    ],
  },
];

export const ClientJourneyModal = () => {
  const [selectedStep, setSelectedStep] = useState<string | null>(null);

  const getOutcomeIcon = (icon: 'check' | 'refresh' | 'close') => {
    switch (icon) {
      case 'check':
        return <CheckCircle className="h-3 w-3 text-green-500" />;
      case 'refresh':
        return <RefreshCw className="h-3 w-3 text-amber-500" />;
      case 'close':
        return <XCircle className="h-3 w-3 text-red-500" />;
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10"
        >
          <HelpCircle className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-primary" />
            Client Journey Flowchart
          </DialogTitle>
        </DialogHeader>

        <div className="py-4">
          <p className="text-sm text-muted-foreground mb-6">
            Interactive flowchart showing how clients move through the system based on action results.
            Click on any step to see possible outcomes.
          </p>

          {/* Journey Flow */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
            {journeySteps.map((step, index) => (
              <div key={step.id} className="flex items-center gap-2">
                <Button
                  variant={selectedStep === step.id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedStep(selectedStep === step.id ? null : step.id)}
                  className={cn(
                    "text-xs transition-all",
                    selectedStep === step.id && "ring-2 ring-primary ring-offset-2"
                  )}
                >
                  {step.label}
                </Button>
                {index < journeySteps.length - 1 && (
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                )}
              </div>
            ))}
          </div>

          {/* Selected Step Details */}
          {selectedStep && (
            <div className="p-4 bg-muted/50 rounded-lg animate-fade-in">
              {journeySteps
                .filter((s) => s.id === selectedStep)
                .map((step) => (
                  <div key={step.id}>
                    <h3 className="font-semibold text-lg mb-1">{step.label}</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {step.description}
                    </p>

                    <div className="space-y-2">
                      <p className="text-sm font-medium">Possible Outcomes:</p>
                      {step.outcomes.map((outcome, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-3 p-2 bg-card rounded border"
                        >
                          {getOutcomeIcon(outcome.icon)}
                          <span className="text-sm font-medium">
                            {outcome.result}
                          </span>
                          <ArrowRight className="h-3 w-3 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            {outcome.nextStep}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          )}

          {!selectedStep && (
            <div className="text-center py-8 text-muted-foreground">
              <p className="text-sm">Click on a step to see possible outcomes</p>
            </div>
          )}

          {/* Legend */}
          <div className="mt-6 pt-4 border-t">
            <p className="text-xs font-medium mb-2">Legend:</p>
            <div className="flex flex-wrap gap-4 text-xs">
              <div className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3 text-green-500" />
                <span>Done - Moves forward</span>
              </div>
              <div className="flex items-center gap-1">
                <RefreshCw className="h-3 w-3 text-amber-500" />
                <span>Follow-Up - Stays or moves to call</span>
              </div>
              <div className="flex items-center gap-1">
                <XCircle className="h-3 w-3 text-red-500" />
                <span>Rejected - Moves to unsubscriber</span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
