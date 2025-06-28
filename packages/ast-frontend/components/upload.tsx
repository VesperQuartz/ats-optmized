import { Loader2Icon, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useResumeStore } from "@/store/index";
import { toast } from "sonner";
import { useUploadResume } from "@/hooks/api";
import { match } from "ts-pattern";
import { ProcessingStep } from "./processing";
import React from "react";

export const UploadStep = () => {
  const { uploadedFile, setUploadedFile, setError, setCurrentStep } =
    useResumeStore();

  const upload = useUploadResume();

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      setError("Please upload a PDF file");
      return;
    }

    setUploadedFile(file);
    setError(null);

    upload.mutate(file, {
      onSuccess: () => {
        toast.success(
          "Resume processed successfully! Now enter the job details to optimize your resume.",
        );
        setCurrentStep("details");
      },
      onError: (error) => {
        console.error(error);
        setError("Failed to process resume. Please try again.");
      },
    });
  };

  return (
    <>
      {match(upload.isPending)
        .with(true, () => {
          return <ProcessingStep />;
        })
        .with(false, () => {
          return (
            <React.Fragment>
              <div className="text-center">
                <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 mb-4 hover:border-arcade-purple transition-colors">
                  <Upload className="mx-auto mb-4 text-gray-400" size={48} />
                  <p className="text-white mb-2">
                    Upload your current resume (PDF only)
                  </p>
                  <p className="text-gray-400 text-sm mb-4">
                    Maximum file size: 10MB
                  </p>
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="resume-upload"
                  />
                  <Button
                    asChild
                    className="bg-arcade-purple hover:bg-arcade-purple/90"
                  >
                    <label htmlFor="resume-upload" className="cursor-pointer">
                      Choose File{" "}
                      {upload.isPending && (
                        <Loader2Icon className="animate-spin" />
                      )}
                    </label>
                  </Button>
                </div>
                {uploadedFile && (
                  <p className="text-green-400">
                    Selected: {uploadedFile.name}
                  </p>
                )}
              </div>
            </React.Fragment>
          );
        })
        .exhaustive()}
    </>
  );
};
