import fetch from "node-fetch";
import {
  APIGatewayProxyEvent,
  APIGatewayProxyResultV2,
  Handler,
} from "aws-lambda";
import { getTotalCharsForActiveSubscriptions } from "./stripe";

export const handler: Handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResultV2> => {
  const { authorizer } = event.requestContext;
  const requestBody = JSON.parse(event.body);


  const userEmail = requestBody.email || authorizer.claims.email;

  if (!userEmail) {
    return {
      statusCode: 400,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({ error: "Email not provided" }),
    };
  }

  const userActiveSubscriptions = await getTotalCharsForActiveSubscriptions(userEmail);

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify(userActiveSubscriptions),
  };
};
