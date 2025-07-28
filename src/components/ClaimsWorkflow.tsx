import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Upload, CheckCircle, Clock, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface WorkflowStep {
  id: number;
  title: string;
  description: string;
  status: 'pending' | 'processing' | 'completed';
  result?: string;
}

export const ClaimsWorkflow = () => {
  const { toast } = useToast();
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);
  const [completedSteps, setCompletedSteps] = useState<WorkflowStep[]>([]);

  const steps: WorkflowStep[] = [
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
  ];

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length > 0) {
      setUploadedFiles(prev => [...prev, ...files]);
      toast({
        title: "Files uploaded successfully",
        description: `${files.length} file(s) added to processing queue`,
      });
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const performRequest = async () => {
    if (uploadedFiles.length === 0) {
      toast({
        title: "No files uploaded",
        description: "Please upload claims documents first",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    setCompletedSteps([]);
    setCurrentStepIndex(0);

    // Process each step sequentially
    for (let i = 0; i < steps.length; i++) {
      setCurrentStepIndex(i);
      
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 1000));
      
      // Generate step result
      const stepResult = generateStepResult(i);
      const completedStep = {
        ...steps[i],
        status: 'completed' as const,
        result: stepResult
      };
      
      // Add completed step to results
      setCompletedSteps(prev => [...prev, completedStep]);
      setCurrentStepIndex(-1);
      
      // Brief pause before next step
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    setIsProcessing(false);
    toast({
      title: "Processing completed",
      description: "All workflow steps have been completed successfully",
    });
  };

  const generateStepResult = (stepIndex: number) => {
    switch (stepIndex) {
      case 0:
        return `Claim intake analysis complete for ${uploadedFiles.length} document(s).

This is an ACORD form for reporting vehicle damage, including details of involved parties, damages, and witnesses.

Key Information Extracted:
• Policy Number: POL-2024-789456
• Claim Number: CLM-2024-001234 (newly created FNOL)
• Policy Status: Active and Valid
• Incident Date: January 15, 2024
• Claimant: John Smith
• Document Storage: /claims/2024/CLM-001234

Policy period verification: PASSED - Policy is current and active.`;
      
      case 1:
        return `Coverage verification analysis complete.

Policy Details Confirmed:
• Coverage Type: Collision Coverage
• Policy Holder: John Smith
• Deductible: $500
• Coverage Limit: $25,000
• Policy Effective: 01/01/2024 - 12/31/2024

Claim Verification:
• Incident Type: Vehicle collision (backing into pole)
• Coverage Status: COVERED under policy terms
• Claim Validity: APPROVED for processing

The claim falls within policy terms and conditions. Proceeding with damage assessment.`;
      
      case 2:
        return `Damage assessment analysis complete.

Incident Details:
• Description: Rear fender damage from backing into a pole
• Vehicle: 2022 Honda Accord
• Damage Location: Rear bumper and fender
• Severity Level: Moderate

Repair Assessment:
• Parts Required: Rear bumper replacement, paint work
• Labor Hours: 8-10 hours estimated
• Parts Cost: $1,800
• Labor Cost: $1,450
• Total Repair Estimate: $3,250

Damage photos and repair estimates have been validated against industry standards.`;
      
      case 3:
        return `Settlement calculation complete.

Financial Summary:
• Total Claim Amount: $3,250
• Policy Deductible: $500
• Net Payout Amount: $2,750

Settlement Details:
• Payment Method: Direct Deposit
• Processing Time: 3-5 business days
• Claim Status: Approved for Payment

--- DRAFT EMAIL COMMUNICATION ---

Subject: Claim Settlement Approved - Claim #CLM-2024-001234

Dear Mr. Smith,

We have completed the review of your auto insurance claim #CLM-2024-001234 for the incident that occurred on January 15, 2024.

Good news! Your claim has been approved for settlement.

Settlement Details:
• Total repair estimate: $3,250.00
• Your deductible: $500.00
• Settlement amount: $2,750.00

Payment Information:
Your settlement payment of $2,750.00 will be processed via direct deposit to your account on file within 3-5 business days.

Next Steps:
1. You may proceed with repairs at any authorized repair facility
2. Please retain all receipts for your records
3. Contact us if you need assistance finding a preferred repair shop

If you have any questions about your settlement, please don't hesitate to contact me directly.

Best regards,
Claims Representative
Auto Insurance Company
Phone: (555) 123-4567
Email: claims@autoinsurance.com

--- END DRAFT EMAIL ---

Claim processing complete. Settlement approved and communication drafted.`;
      
      default:
        return "";
    }
  };

  const resetWindow = () => {
    setCompletedSteps([]);
    setCurrentStepIndex(-1);
    setIsProcessing(false);
    setUploadedFiles([]);
    setPrompt('');
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
        <h1 className="text-2xl font-bold text-foreground">Autonomous claims agent</h1>
      </div>

      <div className="grid lg:grid-cols-2 h-[calc(100vh-120px)]">
        {/* Left Panel */}
        <div className="bg-muted/30 p-6">
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Automated data retrieval tool</h2>
            
            {/* Upload File Section */}
            <div className="space-y-3">
              <label className="block text-sm font-medium">Upload Files</label>
              
              {/* File Upload Input */}
              <div className="flex items-center gap-3">
                <div className="flex-1 bg-background border rounded px-3 py-2 text-sm">
                  {uploadedFiles.length > 0 ? `${uploadedFiles.length} file(s) selected` : 'No files selected'}
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
                  multiple
                />
              </div>
              
              {/* Uploaded Files List */}
              {uploadedFiles.length > 0 && (
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {uploadedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-background border rounded px-3 py-2">
                      <span className="text-sm truncate flex-1">{file.name}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(index)}
                        className="h-6 w-6 p-0"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
              
              <p className="text-xs text-muted-foreground">Supported files: All file types. Multiple files allowed.</p>
            </div>


            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button 
                onClick={performRequest} 
                disabled={isProcessing || uploadedFiles.length === 0}
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
        <div className="bg-background p-6 border-l overflow-y-auto">
          <h2 className="text-xl font-semibold mb-6">Results</h2>
          
          {/* Workflow Progress Section */}
          {(isProcessing || completedSteps.length > 0) && (
            <div className="mb-8">
              <h3 className="text-lg font-medium mb-4">Workflow Progress</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {steps.map((step, index) => {
                  const isCompleted = completedSteps.some(completed => completed.id === step.id);
                  const isCurrentlyProcessing = currentStepIndex === index;
                  const isPending = !isCompleted && !isCurrentlyProcessing;
                  
                  return (
                    <div key={step.id} className="flex items-center gap-3 p-3 rounded-lg border">
                      {isCompleted && <CheckCircle className="w-5 h-5 text-success" />}
                      {isCurrentlyProcessing && <Clock className="w-5 h-5 text-primary animate-spin" />}
                      {isPending && <div className="w-5 h-5 rounded-full border-2 border-muted" />}
                      
                      <div className="flex-1">
                        <h4 className="font-medium">{step.title}</h4>
                        <p className="text-sm text-muted-foreground">{step.description}</p>
                        {isCurrentlyProcessing && (
                          <p className="text-sm text-primary mt-1">Processing...</p>
                        )}
                        {isCompleted && (
                          <p className="text-sm text-success mt-1">Completed</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          
          {/* Results Section */}
          <div className="space-y-6">
            {!isProcessing && completedSteps.length === 0 && (
              <div className="text-muted-foreground">
                Upload claims documents and click "Perform Request" to see results.
              </div>
            )}
            
            {completedSteps.length > 0 && (
              <div>
                <h3 className="text-lg font-medium mb-4">Step Results</h3>
                <div className="space-y-6">
                  {completedSteps.map((step, index) => (
                    <div key={step.id} className="space-y-3">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-success" />
                        <h4 className="font-medium">{step.title} Results</h4>
                      </div>
                      <div className="pl-7">
                        <pre className="text-sm leading-relaxed whitespace-pre-wrap font-sans bg-muted/30 p-4 rounded border">{step.result}</pre>
                      </div>
                      {index < completedSteps.length - 1 && (
                        <div className="border-b border-border/50 pb-3" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Final completion message */}
            {completedSteps.length === steps.length && !isProcessing && (
              <div className="mt-6 p-4 bg-success/10 border border-success/20 rounded-lg">
                <div className="flex items-center gap-2 text-success font-medium">
                  <CheckCircle className="w-5 h-5" />
                  Multi-Agent Claims Processing Complete
                </div>
                <p className="text-sm mt-2">
                  All {steps.length} autonomous agents have completed their sequential processing. 
                  Settlement of $2,750 has been approved and email communication is ready for dispatch.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};