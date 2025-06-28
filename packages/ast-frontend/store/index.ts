import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ProcessStep =
  | "upload"
  | "processing"
  | "details"
  | "generating"
  | "complete"
  | "uploading";
interface KeyStore {
  key: string | undefined;
  deleteKey: () => void;
  setKey: (key: string) => void;
}

export const useKeyStore = create<KeyStore>()(
  persist(
    (set) => ({
      key: undefined,
      setKey: (key: string) => set(() => ({ key })),
      deleteKey: () => set(() => ({ key: undefined })),
    }),
    {
      name: "key-storage",
    },
  ),
);

interface ProcessedData {
  extractedText: string;
  jobTitle: string;
  companyName: string;
  jobDescription: string;
  optimizedResumeUrl?: string;
}

interface ResumeState {
  currentStep: ProcessStep;
  currentStepTitle: string;
  uploadedFile: File | null;
  processedData: ProcessedData;
  isLoading: boolean;
  error: string | null;
  setCurrentStep: (step: ProcessStep) => void;
  setCurrentStepTitle: (title: string) => void;
  setUploadedFile: (file: File | null) => void;
  setProcessedData: (data: Partial<ProcessedData>) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  resetProcess: () => void;
}

const initialProcessedData: ProcessedData = {
  extractedText: "",
  jobTitle: "",
  companyName: "",
  jobDescription: "",
};

export const useResumeStore = create<ResumeState>((set) => ({
  currentStep: "upload",
  currentStepTitle: "Upload Your Resume",
  uploadedFile: null,
  processedData: initialProcessedData,
  isLoading: false,
  error: null,

  setCurrentStep: (step) => set({ currentStep: step }),
  setCurrentStepTitle: (title) => set({ currentStepTitle: title }),
  setUploadedFile: (file) => set({ uploadedFile: file }),
  setProcessedData: (data) =>
    set((state) => ({
      processedData: { ...state.processedData, ...data },
    })),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  resetProcess: () =>
    set({
      currentStep: "upload",
      uploadedFile: null,
      processedData: initialProcessedData,
      isLoading: false,
      error: null,
    }),
}));
