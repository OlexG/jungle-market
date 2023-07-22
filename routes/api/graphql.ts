import { graphql } from "https://esm.sh/graphql@15.5.0";

import { rootValue, schema } from "../graphql/schema.ts";

import gql from "https://esm.sh/graphql-tag@2.12.6";
import { DBDriver } from "../../database/driver.ts";

const protectedMutations = [
  "order",
  "orders",
  "createOrder",
];

export const handler = async (_req: Request): Promise<Response> => {
  const body = (await _req.json()).query;
  // get the session-token from cookies
  const sessionToken = _req.headers.get("cookie")?.split("=")[1];
  const queryObject = gql`${body}`;
  const mutation =
    queryObject.definitions[0].selectionSet.selections[0].name.value;
  if (protectedMutations.includes(mutation)) {
    if (!sessionToken) {
      return new Response(
        JSON.stringify({
          error: "Not logged in",
        }),
        {
          status: 401,
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
    }
    const graphQLArguments =
      queryObject.definitions[0].selectionSet.selections[0].arguments;
    const userIdArg = graphQLArguments.find((arg: any) => arg.name.value === "userID");
    const userId = userIdArg ? userIdArg.value.value : null;
    const actualUserId = await DBDriver.Users.getUserIdFromSessionToken(
      sessionToken,
    );
    if (userId !== actualUserId) {
      return new Response(
        JSON.stringify({
          error: "Unauthorized",
        }),
        {
          status: 401,
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
    }
  }

  const graphQLResult = await graphql({ schema, source: body, rootValue });

  const response = new Response(JSON.stringify(graphQLResult), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response;
};
