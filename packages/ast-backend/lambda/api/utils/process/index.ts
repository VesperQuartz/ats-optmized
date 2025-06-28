import to from "await-to-ts";
import { DynamoDBClient, GetItemCommand } from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";

import {
  TextractClient,
  GetDocumentTextDetectionCommand,
} from "@aws-sdk/client-textract";

const textextract = new TextractClient();
const dynamoClient = new DynamoDBClient();
const TABLE_NAME = process.env.TABLE_NAME;

export const processApiHandler = async ({ key }: { key: string }) => {
  let error, data;
  [error, data] = await to(
    dynamoClient.send(
      new GetItemCommand({
        TableName: TABLE_NAME,
        Key: marshall({ key }),
      }),
    ),
  );

  if (error) {
    console.error("Error receiving data from Dynamo:", error);
    throw error;
  }

  console.log("Incoming Key", key);
  console.log("Dynamo Data:", marshall(data.Item));

  const jobId = unmarshall(data.Item!).jobId;

  console.log("Job ID:", jobId);

  [error, data] = await to(getTextractResults(jobId));

  if (error) {
    console.error("Error getting text extraction result", error);
    throw error;
  }

  console.log("Text Data", data);

  return data;
};

const getTextractResults = async (jobId: string): Promise<string> => {
  try {
    while (true) {
      const command = new GetDocumentTextDetectionCommand({
        JobId: jobId,
      });

      const result = await textextract.send(command);

      if (result.JobStatus === "SUCCEEDED") {
        let nextToken: string | undefined;
        let allText = "";

        do {
          const pageCommand = new GetDocumentTextDetectionCommand({
            JobId: jobId,
            NextToken: nextToken,
          });

          const pageResult = await textextract.send(pageCommand);

          pageResult.Blocks?.forEach((block) => {
            if (block.BlockType === "LINE") {
              allText += block.Text + "\n";
            }
          });

          nextToken = pageResult.NextToken;
        } while (nextToken);

        return allText.trim();
      } else if (result.JobStatus === "FAILED") {
        throw new Error(`Textract job failed: ${result.StatusMessage}`);
      } else if (result.JobStatus === "IN_PROGRESS") {
        console.log(`Job status: IN_PROGRESS - waiting...`);

        await new Promise((resolve) => setTimeout(resolve, 2000));
      } else {
        console.log(`Job status: ${result.JobStatus} - waiting...`);
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }
    }
  } catch (error) {
    console.error("Error processing Textract results:", error);
    throw new Error(`Error processing Textract results: ${error}`);
  }
};
