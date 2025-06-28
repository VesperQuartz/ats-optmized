"use client";
import { useResumeStore } from "@/store";
import { Loader2 } from "lucide-react";
import React from "react";

export const GeneratingStep = () => {
  const { setCurrentStepTitle } = useResumeStore();
  React.useEffect(() => {
    setCurrentStepTitle("Generating Optimized Resume");
  }, [setCurrentStepTitle]);
  return (
    <div className="text-center">
      <Loader2
        className="mx-auto mb-4 animate-spin text-arcade-purple"
        size={48}
      />
      <p className="text-white mb-2">Generating your optimized resume...</p>
      <p className="text-gray-400">
        AI is customizing your resume for the job. Be patient, this might take a
        while!
      </p>
    </div>
  );
};
