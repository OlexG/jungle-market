
import {
  graphql,
} from 'https://esm.sh/graphql@15.5.0';

import {
  schema,
  rootValue,
} from '../graphql/schema.ts';


export const handler = async (_req: Request): Promise<Response> => {
  const body = (await _req.json()).query
  const graphQLResult = await graphql({ schema, source: body, rootValue })

  const response = new Response(JSON.stringify(graphQLResult), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    }
  });

  return response;
};