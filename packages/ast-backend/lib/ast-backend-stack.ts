import * as cdk from "aws-cdk-lib";
import * as iam from "aws-cdk-lib/aws-iam";
import { Construct } from "constructs";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Bucket } from "aws-cdk-lib/aws-s3";
import * as events from "aws-cdk-lib/aws-events";
import { LambdaFunction } from "aws-cdk-lib/aws-events-targets";
import "dotenv/config";

export class AstBackendStack extends cdk.Stack {
  public readonly jobsTable: dynamodb.Table;
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const bucket = new Bucket(this, "S3Bucket", {
      bucketName: `ast-${this.account}-${this.region}`,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
      cors: [
        {
          allowedMethods: [
            cdk.aws_s3.HttpMethods.GET,
            cdk.aws_s3.HttpMethods.PUT,
            cdk.aws_s3.HttpMethods.POST,
          ],
          allowedOrigins: ["*"],
          allowedHeaders: ["*"],
        },
      ],
      lifecycleRules: [
        {
          id: "delete-old-objects",
          enabled: true,
          expiration: cdk.Duration.days(30),
        },
      ],
    });

    this.jobsTable = new dynamodb.Table(this, "DataAccess", {
      tableName: `mrlectus-${this.region}`,
      partitionKey: {
        name: "key",
        type: dynamodb.AttributeType.STRING,
      },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    const textExtract = new NodejsFunction(this, "ExtractFn", {
      entry: "lambda/extract/index.ts",
      handler: "index.handler",
      runtime: lambda.Runtime.NODEJS_22_X,
      environment: {
        BUCKET_NAME: bucket.bucketName,
        TABLE_NAME: this.jobsTable.tableName,
        TABLE_ARN: this.jobsTable.tableArn,
      },
      timeout: cdk.Duration.minutes(5),
      memorySize: 1024,
    });

    const apiHandler = new NodejsFunction(this, "Api", {
      entry: "lambda/api/index.ts",
      handler: "handler",
      runtime: lambda.Runtime.NODEJS_22_X,
      environment: {
        BUCKET_NAME: bucket.bucketName,
        TABLE_NAME: this.jobsTable.tableName,
        TABLE_ARN: this.jobsTable.tableArn,
        OPENAI_API_KEY: process.env.OPENAI_API_KEY!,
        LATEXT_COMPILE: process.env.LATEXT_COMPILE!,
      },
      timeout: cdk.Duration.minutes(10),
      memorySize: 3008,
    });

    const rule = new events.Rule(this, "ExtractEventRule", {
      eventPattern: {
        source: ["text.extract"],
        detailType: ["Extract Text"],
      },
    });

    const fnUrl = apiHandler.addFunctionUrl({
      authType: lambda.FunctionUrlAuthType.NONE,
    });

    rule.addTarget(new LambdaFunction(textExtract));
    this.jobsTable.grantReadWriteData(apiHandler);
    this.jobsTable.grantReadWriteData(textExtract);

    apiHandler.addToRolePolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: ["events:PutEvents"],
        resources: ["*"],
      }),
    );

    textExtract.addToRolePolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: ["textract:*"],
        resources: ["*"],
      }),
    );

    apiHandler.addToRolePolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: ["textract:*"],
        resources: ["*"],
      }),
    );

    bucket.grantReadWrite(apiHandler);
    bucket.grantReadWrite(textExtract);

    new cdk.CfnOutput(this, "apiUrl", {
      value: fnUrl.url!,
    });

    new cdk.CfnOutput(this, "bucketName", {
      value: bucket.bucketName,
    });

    new cdk.CfnOutput(this, "bucketUrl", {
      value: bucket.bucketWebsiteDomainName,
    });
  }
}
