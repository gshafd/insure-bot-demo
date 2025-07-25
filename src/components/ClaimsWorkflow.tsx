import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Upload, FileText, CheckCircle, AlertCircle, Clock, Shield, Calculator, Mail, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface WorkflowStep {
  id: number;
  title: string;
  description: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  icon: React.ReactNode;
  result?: any;
}

export const ClaimsWorkflow = () => {
  const { toast } = useToast();
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [prompt, setPrompt] = useState('');

  const [steps, setSteps] = useState<WorkflowStep[]>([
    {
      id: 1,
      title: 'Document Detection',
      description: 'Agent detects document types',
      status: 'pending',
      icon: <FileText className="w-5 h-5" />
    },
    {
      id: 2,
      title: 'Claim Intake',
      description: 'Extract claim details and validate policy',
      status: 'pending',
      icon: <Upload className="w-5 h-5" />
    },
    {
      id: 3,
      title: 'Coverage Verification',
      description: 'Check policy coverage against claim',
      status: 'pending',
      icon: <Shield className="w-5 h-5" />
    },
    {
      id: 4,
      title: 'Damage Assessment',
      description: 'Analyze damage and repair costs',
      status: 'pending',
      icon: <AlertCircle className="w-5 h-5" />
    },
    {
      id: 5,
      title: 'Settlement Calculation',
      description: 'Calculate payout and generate communication',
      status: 'pending',
      icon: <Calculator className="w-5 h-5" />
    }
  ]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      toast({
        title: "File uploaded successfully",
        description: `${file.name} is ready for processing`,
      });
    }
  };

  const simulateProcessing = async () => {
    if (!uploadedFile) {
      toast({
        title: "No file uploaded",
        description: "Please upload a claims document first",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    setCurrentStep(0);

    // Simulate each step with realistic processing time
    for (let i = 0; i < steps.length; i++) {
      // Update current step to processing
      setSteps(prev => prev.map((step, idx) => ({
        ...step,
        status: idx === i ? 'processing' : idx < i ? 'completed' : 'pending'
      })));
      
      setCurrentStep(i);
      
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 1000));
      
      // Update step to completed with mock results
      const mockResults = generateMockResults(i);
      setSteps(prev => prev.map((step, idx) => ({
        ...step,
        status: idx === i ? 'completed' : step.status,
        result: idx === i ? mockResults : step.result
      })));
    }

    setIsProcessing(false);
    toast({
      title: "Processing completed",
      description: "All workflow steps have been completed successfully",
    });
  };

  const generateMockResults = (stepIndex: number) => {
    switch (stepIndex) {
      case 0:
        return {
          documentType: "Auto Insurance Claim Form (ACORD)",
          confidence: "98%",
          pages: 3
        };
      case 1:
        return {
          policyNumber: "POL-2024-789456",
          claimNumber: "CLM-2024-001234",
          policyValid: true,
          claimType: "Vehicle Damage",
          dateOfLoss: "2024-01-15"
        };
      case 2:
        return {
          coverageValid: true,
          deductible: "$500",
          coverageLimit: "$25,000",
          coverageType: "Collision Coverage"
        };
      case 3:
        return {
          damageAssessment: "Rear fender damage, bumper replacement needed",
          estimatedRepairCost: "$3,250",
          severity: "Moderate"
        };
      case 4:
        return {
          estimatedPayout: "$2,750",
          deductibleApplied: "$500",
          totalClaim: "$3,250"
        };
      default:
        return {};
    }
  };

  const resetWorkflow = () => {
    setSteps(prev => prev.map(step => ({ ...step, status: 'pending', result: undefined })));
    setCurrentStep(0);
    setIsProcessing(false);
    setUploadedFile(null);
    setPrompt('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
      {/* Header */}
      <div className="bg-card border-b shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Auto Insurance Autonomous Claims Management System</h1>
              <p className="text-muted-foreground">Demo Environment</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Panel - Upload and Controls */}
          <Card className="p-6 shadow-lg">
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-4">Automated Claims Processing Tool</h2>
                
                {/* File Upload */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Upload File</label>
                    <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                      <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                      <div className="space-y-2">
                        <Input
                          type="file"
                          accept=".pdf,.doc,.docx,.jpg,.png"
                          onChange={handleFileUpload}
                          className="hidden"
                          id="file-upload"
                        />
                        <label htmlFor="file-upload" className="cursor-pointer">
                          <Button variant="outline" size="sm" className="pointer-events-none">
                            Browse Files
                          </Button>
                        </label>
                        {uploadedFile && (
                          <p className="text-sm text-foreground font-medium">{uploadedFile.name}</p>
                        )}
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">Supported files: All file types</p>
                  </div>

                  {/* Prompt */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Processing Instructions</label>
                    <Textarea
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="Optional: Add specific instructions for claims processing..."
                      className="min-h-20"
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <Button 
                      onClick={simulateProcessing} 
                      disabled={!uploadedFile || isProcessing}
                      className="flex-1 bg-primary hover:bg-primary/90"
                    >
                      {isProcessing ? (
                        <>
                          <Clock className="w-4 h-4 mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        'Process Claim'
                      )}
                    </Button>
                    <Button variant="outline" onClick={resetWorkflow}>
                      Reset
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Right Panel - Results and Workflow */}
          <Card className="p-6 shadow-lg">
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Processing Results</h2>

              {/* Workflow Progress */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Overall Progress</span>
                  <span className="text-sm text-muted-foreground">
                    {steps.filter(s => s.status === 'completed').length}/{steps.length} steps
                  </span>
                </div>
                <Progress 
                  value={(steps.filter(s => s.status === 'completed').length / steps.length) * 100} 
                  className="h-2"
                />
              </div>

              {/* Workflow Steps */}
              <div className="space-y-4">
                {steps.map((step, index) => (
                  <div key={step.id} className="flex gap-4 p-4 rounded-lg border bg-card/50">
                    <div className="flex-shrink-0">
                      {step.status === 'completed' ? (
                        <div className="w-8 h-8 bg-success rounded-full flex items-center justify-center">
                          <CheckCircle className="w-5 h-5 text-success-foreground" />
                        </div>
                      ) : step.status === 'processing' ? (
                        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                          <Clock className="w-5 h-5 text-primary-foreground animate-spin" />
                        </div>
                      ) : (
                        <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                          {step.icon}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium">{step.title}</h3>
                        <Badge variant={
                          step.status === 'completed' ? 'default' : 
                          step.status === 'processing' ? 'secondary' : 
                          'outline'
                        }>
                          {step.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{step.description}</p>
                      
                      {/* Results */}
                      {step.result && (
                        <div className="mt-3 p-3 bg-muted/30 rounded-lg">
                          <div className="space-y-2 text-sm">
                            {Object.entries(step.result).map(([key, value]) => (
                              <div key={key} className="flex justify-between">
                                <span className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                                <span className="text-foreground">{value as string}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Final Results */}
              {steps.every(s => s.status === 'completed') && (
                <div className="space-y-4 p-4 bg-success/10 border border-success/20 rounded-lg">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-success" />
                    <h3 className="font-semibold text-success">Claims Processing Complete</h3>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-card rounded-lg">
                      <span className="font-medium">Estimated Payout:</span>
                      <span className="text-lg font-bold text-success">$2,750</span>
                    </div>
                    
                    <Button variant="outline" className="w-full" onClick={() => toast({ title: "Email drafted", description: "Communication ready for claims representative" })}>
                      <Mail className="w-4 h-4 mr-2" />
                      Generate Email Communication
                    </Button>
                    
                    <Button variant="outline" className="w-full" onClick={() => toast({ title: "Report generated", description: "Processing report downloaded" })}>
                      <Download className="w-4 h-4 mr-2" />
                      Download Processing Report
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};