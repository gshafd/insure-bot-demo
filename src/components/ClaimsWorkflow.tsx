import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Upload, Shield, Calculator, Mail, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface WorkflowStep {
  id: number;
  title: string;
  description: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  result?: any;
}

export const ClaimsWorkflow = () => {
  const { toast } = useToast();
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [results, setResults] = useState<string[]>([]);

  const [steps, setSteps] = useState<WorkflowStep[]>([
    {
      id: 1,
      title: 'Claim Intake',
      description: 'Extract claim details and validate policy',
      status: 'pending'
    },
    {
      id: 2,
      title: 'Coverage Verification',
      description: 'Check policy coverage against claim',
      status: 'pending'
    },
    {
      id: 3,
      title: 'Damage Assessment',
      description: 'Analyze damage and repair costs',
      status: 'pending'
    },
    {
      id: 4,
      title: 'Settlement Calculation',
      description: 'Calculate payout and generate communication',
      status: 'pending'
    }
  ]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  const performRequest = async () => {
    if (!uploadedFile) {
      toast({
        title: "No file uploaded",
        description: "Please upload a claims document first",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    setResults([]);

    // Process each step
    for (let i = 0; i < steps.length; i++) {
      // Update current step to processing
      setSteps(prev => prev.map((step, idx) => ({
        ...step,
        status: idx === i ? 'processing' : idx < i ? 'completed' : 'pending'
      })));
      
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate and add results
      const stepResult = generateStepResult(i);
      setResults(prev => [...prev, stepResult]);
      
      // Update step to completed
      setSteps(prev => prev.map((step, idx) => ({
        ...step,
        status: idx === i ? 'completed' : step.status,
        result: idx === i ? stepResult : step.result
      })));
    }

    setIsProcessing(false);
  };

  const generateStepResult = (stepIndex: number) => {
    switch (stepIndex) {
      case 0:
        return "Claim intake analysis complete. This is an ACORD form for reporting vehicle damage, including details of involved parties, damages, and witnesses. Policy number: POL-2024-789456, Claim number: CLM-2024-001234 created for the new FNOL. Policy period is valid and active. Documents stored in shared point folder /claims/2024/CLM-001234.";
      
      case 1:
        return "Coverage verification complete. Policy details confirmed - the claim raised is covered under Collision Coverage with a deductible of $500 and coverage limit of $25,000. The incident falls within policy terms and conditions.";
      
      case 2:
        return "Damage assessment analysis complete. Rear fender damage identified from backing into a pole. Estimated repair costs: $3,250 including parts and labor. Severity assessed as moderate damage requiring bumper replacement and paint work.";
      
      case 3:
        return "Settlement calculation complete. Total claim amount: $3,250. After applying $500 deductible, estimated payout: $2,750. Email communication drafted for claims representative to send to policy holder regarding settlement offer and next steps.";
      
      default:
        return "";
    }
  };

  const resetWindow = () => {
    setSteps(prev => prev.map(step => ({ ...step, status: 'pending', result: undefined })));
    setIsProcessing(false);
    setUploadedFile(null);
    setPrompt('');
    setResults([]);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="flex items-center gap-3 p-6 border-b">
        <div className="w-12 h-12 rounded-full overflow-hidden">
          <img 
            src="/lovable-uploads/50aab9d4-603e-4dce-84ef-c922d2dd4baf.png" 
            alt="Data Extraction Icon" 
            className="w-full h-full object-cover"
          />
        </div>
        <h1 className="text-2xl font-bold text-foreground">Data Extraction</h1>
      </div>

      <div className="grid lg:grid-cols-2 h-[calc(100vh-120px)]">
        {/* Left Panel */}
        <div className="bg-muted/30 p-6">
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Automated data retrieval tool</h2>
            
            {/* Upload File Section */}
            <div className="space-y-3">
              <label className="block text-sm font-medium">Upload File</label>
              <div className="flex items-center gap-3">
                <div className="flex-1 bg-background border rounded px-3 py-2 text-sm">
                  {uploadedFile ? uploadedFile.name : 'Filled_Auto_Claim_Form.pdf'}
                </div>
                <label htmlFor="file-upload">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="bg-foreground text-background hover:bg-foreground/90"
                    asChild
                  >
                    <span>Browse</span>
                  </Button>
                </label>
                <Input
                  type="file"
                  accept=".pdf,.doc,.docx,.jpg,.png"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
              </div>
              <p className="text-xs text-muted-foreground">Supported files: All file types.</p>
            </div>

            {/* Prompt Section */}
            <div className="space-y-3">
              <label className="block text-sm font-medium">Prompt</label>
              <div className="relative">
                <Textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="min-h-20 resize-none"
                  placeholder=""
                />
                <div className="absolute right-3 bottom-3">
                  <Upload className="w-4 h-4 text-muted-foreground rotate-180" />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button 
                onClick={performRequest} 
                disabled={isProcessing}
                className="bg-primary hover:bg-primary/90 px-8"
              >
                {isProcessing ? 'Processing...' : 'Perform Request'}
              </Button>
              <Button 
                variant="outline" 
                onClick={resetWindow}
                className="bg-foreground text-background hover:bg-foreground/90 px-8"
              >
                Reset Window
              </Button>
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="bg-background p-6 border-l">
          <h2 className="text-xl font-semibold mb-6">Results</h2>
          
          <div className="space-y-4">
            {results.length === 0 && !isProcessing && (
              <div className="text-muted-foreground">
                Upload a claims document and click "Perform Request" to see results.
              </div>
            )}
            
            {/* Processing Status */}
            {isProcessing && (
              <div className="space-y-4">
                {steps.map((step, index) => (
                  <div key={step.id} className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-1">
                      {step.status === 'completed' ? (
                        <CheckCircle className="w-5 h-5 text-success" />
                      ) : step.status === 'processing' ? (
                        <Clock className="w-5 h-5 text-primary animate-spin" />
                      ) : (
                        <div className="w-5 h-5 border-2 border-muted rounded-full" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium">{step.title}</h3>
                      <p className="text-sm text-muted-foreground">{step.description}</p>
                      {step.status === 'processing' && (
                        <p className="text-sm text-primary mt-1">Processing...</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {/* Results Display */}
            {results.map((result, index) => (
              <div key={index} className="space-y-3">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-success" />
                  <h3 className="font-medium">{steps[index]?.title} Complete</h3>
                </div>
                <p className="text-sm leading-relaxed pl-7">{result}</p>
                {index < results.length - 1 && <div className="border-b border-border/50 pb-3" />}
              </div>
            ))}
            
            {/* Final completion message */}
            {results.length === steps.length && (
              <div className="mt-6 p-4 bg-success/10 border border-success/20 rounded-lg">
                <div className="flex items-center gap-2 text-success font-medium">
                  <CheckCircle className="w-5 h-5" />
                  Claims Processing Complete
                </div>
                <p className="text-sm mt-2">
                  All workflow steps have been completed successfully. The estimated payout of $2,750 has been calculated and communication is ready for the claims representative.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};