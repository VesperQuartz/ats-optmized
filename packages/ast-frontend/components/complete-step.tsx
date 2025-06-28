import { CheckCircle, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useResumeStore } from "@/store/index";
import React from "react";

export const CompleteStep = () => {
  const { setCurrentStepTitle, processedData, resetProcess } = useResumeStore();
  React.useEffect(() => {
    setCurrentStepTitle("Your Optimized Resume is Ready!");
  }, [setCurrentStepTitle]);
  return (
    <div className="text-center">
      <CheckCircle className="mx-auto mb-4 text-green-400" size={48} />
      <p className="text-white mb-4">Your ATS-optimized resume is ready!</p>
      <div className="space-y-3">
        <Button asChild className="w-full bg-green-600 hover:bg-green-700">
          <a
            href={processedData.optimizedResumeUrl}
            download
            target="_blank"
            rel="noopener noreferrer"
          >
            <Download className="mr-2" size={18} />
            Download Optimized Resume
          </a>
        </Button>
        <Button
          onClick={resetProcess}
          variant="outline"
          className="w-full border-gray-600 text-gray-300 hover:bg-gray-800"
        >
          Optimize Another Resume
        </Button>
      </div>
    </div>
  );
};
