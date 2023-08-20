# AWS Lambda: User Active Subscriptions

This AWS Lambda function retrieves the total characters for active subscriptions of a user using their email.

## Overview

When triggered, the function:

1. Extracts the user's email either from the request body or from the claims provided in the request context.
2. Fetches the total characters for the user's active subscriptions.
3. Returns the fetched data in a JSON format.

## Prerequisites

- Node.js
- AWS CLI configured with appropriate permissions
- `node-fetch` package
- AWS Lambda types for TypeScript

## Setup

1. Clone the repository:

```bash
git clone <repository-url>
cd <repository-name>
```

2. Install the dependencies:

```bash
npm install
```

3. Deploy the function to AWS Lambda:

```bash
# Replace with your deployment command or script
```

## Usage

Trigger the Lambda function by sending a request with the following format:

```json
{
  "body": {
    "email": "user@example.com"
  }
}
```

If the email is not provided in the body, the function will attempt to retrieve it from the claims in the request context.

## Response

The function will return a JSON object with the total characters for the user's active subscriptions.

## Dependencies

- `node-fetch`: Used for making network requests.
- AWS Lambda types: Used for TypeScript type definitions.

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.



Replace placeholders like `<repository-url>` and `<repository-name>` with actual values relevant to your project. Adjust the setup and deployment steps based on your actual deployment process.