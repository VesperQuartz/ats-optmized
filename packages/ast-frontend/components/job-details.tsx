"use client";
import { Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useKeyStore, useResumeStore } from "@/store/index";
import { toast } from "sonner";
import { useGenerateText, useProcessText } from "@/hooks/api";
import { match } from "ts-pattern";
import { GeneratingStep } from "./generating";
import React from "react";

export const JobDetailsStep = () => {
  const {
    setCurrentStepTitle,
    processedData,
    setProcessedData,
    setError,
    setCurrentStep,
    isLoading,
  } = useResumeStore();
  const generate = useGenerateText();
  const process = useProcessText();
  const { key } = useKeyStore();

  React.useEffect(() => {
    setCurrentStepTitle("Enter Job Details");
  }, [setCurrentStepTitle]);
  const handleGenerate = async () => {
    if (
      !processedData.jobTitle ||
      !processedData.companyName ||
      !processedData.jobDescription
    ) {
      setError("Please fill in all job details");
      return;
    }

    console.log(processedData);
    setError(null);

    process.mutate(
      { key: key ?? "" },
      {
        onSuccess: (data) => {
          generate.mutate(
            {
              key: key ?? "",
              jobDescription: processedData.jobDescription,
              templateId: 1,
              resumeDetails: data.text,
              jobTitle: processedData.jobTitle,
            },
            {
              onSuccess: (data) => {
                setProcessedData({ optimizedResumeUrl: data.url });
                setCurrentStep("complete");
                toast.success(
                  "Your ATS-optimized resume is ready for download.",
                );
              },
              onError: () => {
                setError(
                  "Failed to generate optimized resume. Please try again.",
                );
              },
            },
          );
        },
      },
    );
  };

  return (
    <>
      {match(process.isPending || generate.isPending)
        .with(true, () => {
          return <GeneratingStep />;
        })
        .with(false, () => {
          return (
            <div className="space-y-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="jobTitle" className="text-white">
                  Job Title
                </Label>
                <Input
                  id="jobTitle"
                  value={processedData.jobTitle}
                  onChange={(e) =>
                    setProcessedData({ jobTitle: e.target.value })
                  }
                  placeholder="e.g., Senior Software Engineer"
                  className="bg-arcade-terminal border-gray-700 text-white"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="companyName" className="text-white">
                  Company Name
                </Label>
                <Input
                  id="companyName"
                  value={processedData.companyName}
                  onChange={(e) =>
                    setProcessedData({ companyName: e.target.value })
                  }
                  placeholder="e.g., Google"
                  className="bg-arcade-terminal border-gray-700 text-white"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="jobDescription" className="text-white">
                  Job Description
                </Label>
                <Textarea
                  id="jobDescription"
                  value={processedData.jobDescription}
                  onChange={(e) =>
                    setProcessedData({ jobDescription: e.target.value })
                  }
                  placeholder="Paste the full job description here..."
                  className="bg-arcade-terminal border-gray-700 text-white min-h-32"
                />
              </div>
              <Button
                onClick={handleGenerate}
                disabled={isLoading}
                className="w-full bg-arcade-purple hover:bg-arcade-purple/90"
              >
                <Briefcase className="mr-2" size={18} />
                Optimize My Resume
              </Button>
            </div>
          );
        })
        .exhaustive()}
    </>
  );
};
