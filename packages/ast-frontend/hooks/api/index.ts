import { env } from "@/env/config";
import { useMutation } from "@tanstack/react-query";
import ky from "ky";
import { to } from "await-to-ts";
import { useKeyStore } from "@/store";

export type Generate = {
  jobTitle?: string;
  jobDescription: string;
  templateId: number;
  resumeDetails: string;
  key: string;
};

export const useUploadResume = () => {
  const key = useKeyStore();
  return useMutation({
    mutationKey: ["upload_resume"],
    mutationFn: async (form: File | null) => {
      if (!form) throw new Error("No file provided for upload");
      const formData = new FormData();
      formData.append("file", form);
      const [error, response] = await to(
        ky.post(`${env.baseUrl}/upload`, {
          body: formData,
          timeout: false,
        }),
      );
      if (error) {
        throw error;
      }
      return response.json<{
        data: {
          key: string;
          s3Key: string;
          bucketName: string;
          fileName: string;
        };
        message: string;
      }>();
    },
    onSuccess: (data) => {
      key.setKey(data.data.key);
    },
  });
};

type ProcessPayload = {
  key: string;
};

export const useProcessText = () => {
  return useMutation({
    mutationKey: ["process_text"],
    mutationFn: async (data: ProcessPayload) => {
      const [error, response] = await to(
        ky.post(`${env.baseUrl}/process`, {
          json: data,
          timeout: false,
        }),
      );
      if (error) {
        throw error;
      }
      return response.json<{
        message: string;
        text: string;
      }>();
    },
  });
};

export const useGenerateText = () => {
  return useMutation({
    mutationKey: ["generate_text"],
    mutationFn: async (data: Generate) => {
      const [error, response] = await to(
        ky.post(`${env.baseUrl}/generate`, {
          json: data,
          timeout: false,
        }),
      );
      if (error) {
        throw error;
      }
      return response.json<{
        key: string;
        text: string;
        url: string;
      }>();
    },
  });
};
