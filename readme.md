# AWS Lambda: User Active Subscriptions 📊

Retrieve the total characters for active subscriptions of a user using their email.

## 🌟 Features

- Extracts user email from the request body or claims.
- Fetches total characters for active subscriptions.
- Returns data in a structured JSON format.


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

## 📄 Response

The function will return a JSON object detailing the total characters for the user's active subscriptions.


## 📜 License

Distributed under the MIT License.

Replace placeholders like `<repository-url>` and `<repository-name>` with actual values relevant to your project. Adjust the setup and deployment steps based on your actual deployment process.