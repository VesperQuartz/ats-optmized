import { Handler, EventBridgeEvent } from "aws-lambda";
import {
  TextractClient,
  StartDocumentTextDetectionCommand,
} from "@aws-sdk/client-textract";
import to from "await-to-ts";
import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";

const textextract = new TextractClient();
const dynamoClient = new DynamoDBClient();
const TABLE_NAME = process.env.TABLE_NAME;

type Extract = {
  s3Key: string;
  key: string;
  bucketName: string;
};
export const handler: Handler<EventBridgeEvent<string, Extract>> = async (
  event,
) => {
  console.log("I was triggered");
  console.log("Event: ", JSON.stringify(event, null, 2));
  let error, data;

  const { s3Key, key } = event.detail;
  console.log("Key", s3Key);

  const command = new StartDocumentTextDetectionCommand({
    DocumentLocation: {
      S3Object: {
        Bucket: process.env.BUCKET_NAME!,
        Name: s3Key,
      },
    },
  });

  [error, data] = await to(textextract.send(command));

  if (error) {
    console.error(`Text extract error ${error}`);
    throw error;
  }
  console.log("Extracted data", data);

  [error] = await to(
    dynamoClient.send(
      new PutItemCommand({
        TableName: TABLE_NAME!,
        Item: marshall({
          jobId: data.JobId,
          key,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }),
      }),
    ),
  );

  if (error) {
    console.error(`Dynamo Error: ${error}`);
    throw error;
  }

  console.log("Queue sent data", JSON.stringify(data, null, 2));
  return {
    statusCode: 200,
    body: JSON.stringify({
      jobId: data,
      message: "Textract job started successfully",
    }),
  };
};
