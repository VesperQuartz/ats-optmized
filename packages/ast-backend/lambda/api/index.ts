import { Hono } from "hono";
import { handle, LambdaContext, LambdaEvent } from "hono/aws-lambda";
import { requestId } from "hono/request-id";
import { logger } from "hono/logger";
import { poweredBy } from "hono/powered-by";
import { prettyJSON } from "hono/pretty-json";
import { cors } from "hono/cors";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import {
  EventBridgeClient,
  PutEventsCommand,
} from "@aws-sdk/client-eventbridge";
import { to } from "await-to-ts";
import { processApiHandler } from "./utils/process";
import { zValidator } from "@hono/zod-validator";
import z from "zod/v4";
import "dotenv/config";
import { generateLatex, generatePDF } from "./utils/generate";

const s3Client = new S3Client({ region: process.env.AWS_REGION });
const eventBridgeClient = new EventBridgeClient({
  region: process.env.AWS_REGION,
});

type Bindings = {
  event: LambdaEvent;
  lambdaContext: LambdaContext;
};

const app = new Hono<{ Bindings: Bindings }>().basePath("/api");
app.use("*", cors());
app.use(poweredBy());
app.use(logger());
app.use(requestId());
app.use(prettyJSON());
app.get("/", (c) => c.text("Hello Hono!"));

app.post("/upload", async (c) => {
  const data = await c.req.formData();
  const doc = data.get("file") as unknown as File;
  const key = `${crypto.randomUUID()}`;
  let error;

  [error] = await to(
    s3Client.send(
      new PutObjectCommand({
        Body: Buffer.from(await doc.arrayBuffer()),
        Bucket: process.env.BUCKET_NAME!,
        Key: `${key}-${doc.name.replaceAll(" ", "+")}`,
        ContentType: "application/pdf",
      }),
    ),
  );

  if (error) {
    console.error(`S3UploadError, ${error}`);
    throw error;
  }

  let datum;
  [error, datum] = await to(
    eventBridgeClient.send(
      new PutEventsCommand({
        Entries: [
          {
            Source: "text.extract",
            DetailType: "Extract Text",
            Detail: JSON.stringify({
              s3Key: `${key}-${doc.name.replaceAll(" ", "+")}`,
              fileName: doc.name,
              bucketName: process.env.BUCKET_NAME,
              key,
            }),
          },
        ],
      }),
    ),
  );

  console.log("DATUM", datum);

  if (error) {
    console.error(`S3UploadError, ${error}`);
    c.json({ error: JSON.stringify(error) }, 500);
  }

  return c.json({
    data: {
      s3Key: key,
      fileName: doc.name,
      bucketName: process.env.BUCKET_NAME,
      key,
    },
    message: "File uploaded and it is being processed!",
  });
});

app.post(
  "/process",
  zValidator(
    "json",
    z.object({
      key: z.string(),
    }),
  ),
  async (c) => {
    let data, error;
    const { key } = c.req.valid("json");
    const context = c.env.lambdaContext;
    const event = c.env.event;
    console.log({
      context,
      event,
      key,
    });
    [error, data] = await to(processApiHandler({ key }));
    if (error) {
      console.error("E", error);
      c.json({ error: JSON.stringify(error) }, 500);
    }
    return c.json({ message: "Text processed", text: data });
  },
);

app.post(
  "/generate",
  zValidator(
    "json",
    z.object({
      jobTitle: z.string().optional(),
      jobDescription: z.string(),
      templateId: z.number().int().min(1).max(3),
      resumeDetails: z.string(),
      key: z.string(),
    }),
  ),
  async (c) => {
    const { jobTitle, jobDescription, templateId, resumeDetails, key } =
      c.req.valid("json");

    const [error, data] = await to(
      generateLatex({
        jobDescription,
        key,
        resumeDetails,
        templateId,
        jobTitle,
      }),
    );

    if (error) {
      console.error("Error generating LaTeX", error);
      return c.json({ error: JSON.stringify(error) }, 500);
    }

    const [errorPdf, pdfLink] = await to(generatePDF(data.text));

    if (errorPdf) {
      console.error("Error generating PDF", errorPdf);
      return c.json({ error: JSON.stringify(errorPdf) }, 500);
    }

    return c.json({
      text: data.text,
      key: data.key,
      url: pdfLink,
    });
  },
);

export const handler = handle(app);
