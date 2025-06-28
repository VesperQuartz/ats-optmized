# ATS Resume Optimizer

A serverless application that automatically generates ATS-optimized resumes tailored to specific job descriptions using AWS Lambda and AI.

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [AWS Lambda Implementation](#aws-lambda-implementation)
- [Getting Started](#getting-started)
- [API Endpoints](#api-endpoints)
- [Technology Stack](#technology-stack)
- [Deployment](#deployment)
- [Usage](#usage)

## Overview

The ATS Resume Optimizer eliminates the tedious process of manually customizing resumes for different job applications. Instead of spending hours tweaking your resume for each position, this tool automatically generates optimized versions based on job descriptions, ensuring your resume passes through Applicant Tracking Systems (ATS) while highlighting your most relevant qualifications.

## Features

- **Automated Resume Parsing**: Extract text content from uploaded resume files using AWS Textract
- **AI-Powered Optimization**: Generate tailored resume content using OpenAI based on job descriptions
- **ATS-Friendly Formatting**: Output resumes in LaTeX format for professional PDF generation
- **Serverless Architecture**: Built entirely on AWS serverless infrastructure for scalability and cost-efficiency
- **Real-time Processing**: Asynchronous job processing with status tracking
- **Secure File Handling**: Temporary presigned URLs for secure file access

## Architecture

The application follows a serverless, event-driven architecture built on AWS:

```
User Upload → S3 → EventBridge → Lambda (Textract) → DynamoDB
                                      ↓
Job Details Input → Lambda (AI Processing) → Lambda (PDF Generation) → S3 → Presigned URL
```

## AWS Lambda Implementation

This application leverages AWS Lambda functions extensively for its serverless architecture. Here's how Lambda is utilized throughout the system:

### Lambda Function Architecture

#### 1. **Resume Upload Handler Lambda**
- **Trigger**: S3 PUT events via EventBridge
- **Purpose**: Initiates AWS Textract document analysis
- **Key Operations**:
  - Receives S3 upload notifications
  - Starts Textract `StartDocumentTextDetection` job
  - Stores job metadata in DynamoDB with unique identifiers
  - Returns job ID for status tracking

#### 2. **Textract Status Checker Lambda**
- **Trigger**: API Gateway requests
- **Purpose**: Monitors Textract job completion status
- **Key Operations**:
  - Queries DynamoDB for job information using provided keys
  - Calls Textract `GetDocumentTextDetection` to check job status
  - Returns extracted text when job completes successfully
  - Handles retry logic for in-progress jobs

#### 3. **Resume Generator Lambda**
- **Trigger**: API Gateway requests
- **Purpose**: Generates optimized resume content using AI
- **Key Operations**:
  - Combines extracted resume text with job description
  - Interfaces with OpenAI API for content optimization
  - Formats output in LaTeX-compatible structure
  - Prepares data for PDF compilation

#### 4. **PDF Compiler Lambda**
- **Trigger**: Continuation from Resume Generator Lambda
- **Purpose**: Compiles LaTeX to PDF and handles file storage
- **Key Operations**:
  - Processes LaTeX content into PDF format
  - Uploads generated PDF to S3 bucket
  - Creates presigned URLs for secure file access
  - Manages temporary file cleanup

### Lambda Configuration Details

#### Runtime Environment
- **Runtime**: Node.js (latest supported version)
- **Language**: TypeScript with arrow functions
- **Memory**: Configured based on function requirements (512MB - 3008MB)
- **Timeout**: Varies by function complexity (30s - 15min for PDF generation)

#### IAM Permissions
Each Lambda function operates with least-privilege IAM roles:
- **S3**: `GetObject`, `PutObject` permissions for file operations
- **Textract**: `StartDocumentTextDetection`, `GetDocumentTextDetection` permissions
- **DynamoDB**: `GetItem`, `PutItem`, `UpdateItem` permissions for job tracking
- **EventBridge**: Permissions to receive and process events

#### Environment Variables
- `OPENAI_API_KEY`: Secure API key management
- `S3_BUCKET_NAME`: Target bucket for file operations
- `DYNAMODB_TABLE_NAME`: Job tracking table reference

### Asynchronous Processing Flow

The Lambda-based architecture handles the inherent asynchronicity of document processing:

1. **Upload Phase**: Immediate Lambda response with job ID
2. **Processing Phase**: Background Lambda execution for Textract operations
3. **Status Checking**: Polling Lambda to monitor job progress
4. **Generation Phase**: AI processing Lambda triggered upon completion
5. **Delivery Phase**: PDF compilation and S3 storage Lambda

### Error Handling and Monitoring

- **CloudWatch Integration**: All Lambda functions log to CloudWatch for monitoring
- **Dead Letter Queues**: Failed executions are captured for debugging
- **Retry Logic**: Built-in retry mechanisms for transient failures
- **Timeout Management**: Appropriate timeout settings prevent hanging executions

### Cost Optimization

Lambda's pay-per-execution model provides cost benefits:
- **No Idle Costs**: Only pay for actual processing time
- **Automatic Scaling**: Handles concurrent requests without manual intervention
- **Memory Optimization**: Right-sized memory allocation for each function's requirements

## Getting Started

### Prerequisites
- AWS Account with appropriate permissions
- AWS CLI configured
- Node.js 18+ installed
- AWS CDK installed globally

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/ats-resume-optimizer.git
cd ats-resume-optimizer
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp .env.example .env
# Add your OpenAI API key and other configuration
```

4. Deploy the AWS infrastructure:
```bash
npm run deploy
```

## API Endpoints

### Upload Resume
```http
POST /api/upload
Content-Type: multipart/form-data

Body: resume file
Response: { jobId: string, key: string }
```

### Check Processing Status
```http
GET /api/status/{jobId}?key={key}

Response: { status: 'IN_PROGRESS' | 'SUCCEEDED' | 'FAILED', text?: string }
```

### Generate Optimized Resume
```http
POST /api/generate
Content-Type: application/json

Body: {
  resumeText: string,
  jobDescription: string,
  jobTitle: string,
  companyName: string
}
Response: { downloadUrl: string }
```

## Technology Stack

### Backend
- **AWS Lambda**: Serverless compute for all application logic
- **AWS S3**: File storage for resumes and generated PDFs
- **AWS Textract**: Document text extraction
- **AWS DynamoDB**: Job status and metadata storage
- **AWS EventBridge**: Event-driven architecture coordination
- **AWS API Gateway**: RESTful API endpoints

### AI & Processing
- **OpenAI GPT**: Resume content optimization
- **LaTeX**: Professional PDF formatting
- **AWS CDK**: Infrastructure as Code

### Frontend (if applicable)
- **TypeScript**: Type-safe development
- **React**: User interface (with arrow functions as preferred)

## Deployment

The application uses AWS CDK for infrastructure deployment:

```bash
# Build the project
npm run build

# Deploy to AWS
cdk deploy

# Monitor deployment
aws logs tail /aws/lambda/your-function-name --follow
```

## Usage

1. **Upload Resume**: Submit your current resume (PDF, DOCX, or TXT)
2. **Wait for Processing**: The system extracts text using AWS Textract
3. **Provide Job Details**: Enter job description, title, and company name
4. **Download Optimized Resume**: Receive a tailored, ATS-optimized PDF

## Challenges Overcome

- **AWS CDK Learning Curve**: Navigated complex infrastructure as code concepts
- **Lambda Permissions**: Configured proper IAM roles for cross-service communication
- **Asynchronous Processing**: Implemented robust job tracking for long-running operations
- **Error Handling**: Built resilient error handling for external API dependencies

*Built with ❤️ using AWS Lambda and modern serverless architecture**
