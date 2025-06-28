import { template } from "../template";
import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";
import to from "await-to-ts";
import ky from "ky";
import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const compileUrl = process.env.LATEXT_COMPILE;
const s3Client = new S3Client({ region: process.env.AWS_REGION! });

export type Generate = {
  jobTitle?: string;
  jobDescription: string;
  templateId: number;
  resumeDetails: string;
  key: string;
};

export const generateLatex = async ({
  jobTitle,
  jobDescription,
  templateId,
  resumeDetails,
  key,
}: Generate) => {
  const temp = await template(templateId);

  const [error, result] = await to(
    generateText({
      model: openai("gpt-4.1"),
      temperature: 0.7,
      prompt: `
    Using this Resume template below Generate an optimized ATS-friendly LaTeX resume:
      ${temp}

    This is the information of the company user is applying to,make sure to use it to optimize the resume:
    JobTitle:
      ${jobTitle}
    Job Description:
      ${jobDescription}

    This is the User former resume to optmize to fit the Job above making it ATS-friendly
    Previous Resume Details:
      ${resumeDetails}

    Please only return the template as text in pure latext format! that is  begin with documentclass and end with end. do not comment it or add backticks
    Validate that what is genetated is valid latext
    `,
      system: `
    You are a LaTeX resume generator.
    `,
    }),
  );

  if (error) {
    console.error("Error generating LaTeX resume:", error);
    throw error;
  }

  return { text: result.text, key };
};

export const generatePDF = async (text: string) => {
  const textKey = `resumes/${Date.now()}.tex`;

  await s3Client.send(
    new PutObjectCommand({
      Bucket: process.env.BUCKET_NAME!,
      Key: textKey,
      Body: text,
      ContentType: "application/x-tex",
    }),
  );

  const [signedurlTexError, signedTexUrl] = await to(
    getSignedUrl(
      s3Client,
      new GetObjectCommand({
        Bucket: process.env.BUCKET_NAME!,
        Key: textKey,
        ResponseContentDisposition: "attachment",
      }),
      {
        expiresIn: 600,
      },
    ),
  );

  if (signedurlTexError) {
    console.error(
      "Error generating signed URL for LaTeX file:",
      signedurlTexError,
    );
    throw signedurlTexError;
  }

  console.log(
    "Try this And this",
    `${compileUrl}?url=${encodeURIComponent(signedTexUrl)}&command=xelatex`,
  );

  console.log("Try this", `${compileUrl}?url=${signedTexUrl}&command=xelatex`);

  const [error, data] = await to(
    ky(
      `${compileUrl}?url=${encodeURIComponent(signedTexUrl)}&command=xelatex`,
      {
        timeout: false,
      },
    ),
  );

  if (error) {
    console.error("Error generating PDF:", error);
    throw error;
  }

  const tempArray = await data.arrayBuffer();

  console.log("Temp Array", tempArray);

  const key = `resumes/${Date.now()}.pdf`;

  const [sendError] = await to(
    s3Client.send(
      new PutObjectCommand({
        Bucket: process.env.BUCKET_NAME,
        Key: key,
        Body: new Uint8Array(tempArray),
        ContentType: "application/pdf",
      }),
    ),
  );

  if (sendError) {
    console.error("Error uploading PDF to S3:", sendError);
    throw new Error(`Error uploading PDF to S3: ${sendError}`);
  }

  const [signedurlError, signedUrl] = await to(
    getSignedUrl(
      s3Client,
      new GetObjectCommand({
        Bucket: process.env.BUCKET_NAME!,
        Key: key,
      }),
      {
        expiresIn: 600,
      },
    ),
  );

  if (signedurlError) {
    console.error("Error generating signed URL:", signedurlError);
    throw new Error(`Error generating signed URL: ${signedurlError}`);
  }

  return signedUrl;
};
