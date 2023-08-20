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
  let requestContexts = event.requestContext.authorizer;
  const user = requestContexts.claims.sub;
  const bodyEvent = JSON.parse(event.body);
  // user email
  const email = bodyEvent?.email as string
  const useremail = requestContexts.claims.email || email
  const userActiveSubscriptions = await getTotalCharsForActiveSubscriptions(useremail);

  let res = {};
  res["statusCode"] = 200;
  res["headers"] = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  };
  res["body"] = JSON.stringify(userActiveSubscriptions);
  return res;
};
