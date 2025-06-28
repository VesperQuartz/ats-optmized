# ATS Resume Optimizer

A serverless application that automatically generates ATS-optimized resumes tailored to specific job descriptions using AWS Lambda and AI.

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
# Deploy to AWS
cdk deploy

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
