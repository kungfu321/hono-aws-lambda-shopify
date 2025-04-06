# Hono AWS Lambda Shopify Integration

This project integrates Shopify with AWS Lambda using Hono framework and AWS CDK for infrastructure deployment.

## Project Overview

- **Shopify Admin API**: Connect to Shopify stores via the Admin API
- **Hono Framework**: Fast, lightweight web application framework
- **AWS Lambda**: Serverless compute service
- **DynamoDB**: NoSQL database for storing shop credentials and user data
- **SST**: Serverless Stack framework for streamlined AWS deployments

## Architecture

The application follows a modular architecture:

- **API Layer**: Hono framework for handling HTTP requests
- **Service Layer**: Business logic implementation
- **Data Layer**: DynamoDB for persistent storage
- **Integration Layer**: Shopify Admin API client

## Project Structure

```
├── app/
│   ├── modules/       # Feature modules (users, etc.)
│   │   └── users/     # User management endpoints
│   └── libs/          # Shared libraries
│       ├── shopify/   # Shopify API integration
│       ├── dynamodb/  # DynamoDB operations
│       └── secrets/   # AWS Secrets Manager utilities
├── script/            # Build and deployment scripts
├── sst.config.ts      # SST configuration
└── tsconfig.json      # TypeScript configuration
```
