"use client";
import { useResumeStore } from "@/store";
import { Loader2 } from "lucide-react";
import React from "react";

export const ProcessingStep = () => {
  const { setCurrentStepTitle } = useResumeStore();
  React.useEffect(() => {
    setCurrentStepTitle("Processing your resume");
  }, [setCurrentStepTitle]);
  return (
    <div className="text-center">
      <Loader2
        className="mx-auto mb-4 animate-spin text-arcade-purple"
        size={48}
      />
      <p className="text-white mb-2">Extracting text from your resume...</p>
      <p className="text-gray-400">This may take a few moments</p>
    </div>
  );
};
