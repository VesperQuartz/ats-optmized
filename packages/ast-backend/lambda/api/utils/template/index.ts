import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import to from "await-to-ts";
import ky from "ky";

const s3Client = new S3Client({ region: process.env.AWS_REGION });

export const template = async (id: number) => {
  let error, data;
  [error, data] = await to(
    getSignedUrl(
      s3Client,
      new GetObjectCommand({
        Bucket: process.env.BUCKET_NAME!,
        Key: `template${id}.tex`,
      }),
      {
        expiresIn: 240,
      },
    ),
  );

  if (error) {
    console.error("Error fetching data:", error);
    throw error;
  }

  [error, data] = await to(ky(data).text());
  if (error) {
    console.error("Error fetching template:", error);
    throw error;
  }
  return await data;
};
