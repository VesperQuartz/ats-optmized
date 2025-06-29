"use client";
import { ArrowLeft, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useResumeStore } from "@/store/index";
import { ProgressIndicator } from "@/components/indicator";
import { UploadStep } from "@/components/upload";
import { JobDetailsStep } from "@/components/job-details";
import { CompleteStep } from "@/components/complete-step";
import { ErrorDisplay } from "@/components/error-display";
import { match } from "ts-pattern";
import Link from "next/link";

const ResumeOptimizer = () => {
  const { currentStep, error, currentStepTitle } = useResumeStore();

  const renderStepContent = () => {
    return match(currentStep)
      .with("upload", () => <UploadStep />)
      .with("details", () => <JobDetailsStep />)
      .with("complete", () => <CompleteStep />)
      .otherwise(() => null);
  };

  return (
    <div className="min-h-screen flex flex-col overflow-hidden bg-arcade-dark">
      <div className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
        <Link
          href={"/"}
          className="flex items-center text-gray-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft size={20} className="mr-2" />
          <span>Back to home</span>
        </Link>
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-arcade-terminal flex items-center justify-center mx-auto mb-4 relative">
            <div className="absolute inset-0 rounded-full bg-arcade-purple opacity-20 blur-xl"></div>
            <FileText className="text-2xl text-arcade-purple" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
            ATS Resume <span className="gradient-text">Optimizer</span>
          </h1>
          <p className="text-gray-300 text-lg">
            Upload your resume and get it optimized for any job application
          </p>
        </div>

        <ProgressIndicator currentStep={currentStep} />

        {error && <ErrorDisplay error={error} />}

        <Card className="bg-arcade-terminal/40 backdrop-blur-sm border-gray-800 shadow-xl">
          <CardHeader>
            <CardTitle className="text-white text-center">
              {currentStepTitle}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">{renderStepContent()}</CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ResumeOptimizer;
