import { graphql } from "graphql";
import { rootValue, schema } from "../graphql/schema.ts";
import gql from "graphql-tag";
import { DBDriver } from "../../database/driver.ts";

const protectedMutations = [
  "order",
  "orders",
  "createOrder",
  "reset",
  "user"
];

export const handler = async (_req: Request): Promise<Response> => {
  const body = (await _req.json()).query;
  // get the session-token from cookies
  let sessionToken;
  const cookieHeader = _req.headers.get("Cookie");
  if (cookieHeader) {
    const cookies = cookieHeader.split(";").map((cookie) => cookie.trim());
    for (const cookie of cookies) {
      const [name, value] = cookie.split("=");
      if (name.trim() === "session-token") {
        sessionToken = value.trim();
      }
    }
  }
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
    const userIdArg = graphQLArguments.find((arg: any) =>
      arg.name.value === "userId"
    );
    const userId = userIdArg ? userIdArg.value.value : null;
    const actualuserId = await DBDriver.Users.getuserIdFromSessionToken(
      sessionToken,
    );
    if (userId !== actualuserId) {
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
