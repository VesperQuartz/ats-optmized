import { CheckCircle } from "lucide-react";
import { ProcessStep } from "@/store/index";

interface ProgressIndicatorProps {
  currentStep: ProcessStep;
}

const steps: ProcessStep[] = ["upload", "details", "complete"];

export const ProgressIndicator = ({ currentStep }: ProgressIndicatorProps) => {
  const currentIndex = steps.indexOf(currentStep);

  return (
    <div className="flex justify-center mb-8">
      <div className="flex items-center space-x-4">
        {steps.map((step, index) => (
          <div key={step} className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                currentStep === step
                  ? "bg-arcade-purple text-white"
                  : currentIndex > index
                    ? "bg-green-500 text-white"
                    : "bg-gray-700 text-gray-400"
              }`}
            >
              {currentIndex > index ? (
                <CheckCircle size={16} />
              ) : (
                <span>{index + 1}</span>
              )}
            </div>
            {index < steps.length - 1 && (
              <div
                className={`w-12 h-0.5 ${
                  currentIndex > index ? "bg-green-500" : "bg-gray-700"
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
