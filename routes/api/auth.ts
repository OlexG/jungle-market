import { config } from "https://deno.land/x/dotenv/mod.ts";
const { CLIENT_ID, CLIENT_SECRET } = config();
import { DBDriver } from "../../database/driver.ts";
async function getAccessToken(code: string) {
  const client_id = CLIENT_ID
  const client_secret = CLIENT_SECRET
  const redirect_uri = 'http://localhost:8000/signin';
  const grant_type = 'authorization_code';
  const data = {
    client_id,
    client_secret,
    redirect_uri,
    code,
    grant_type
  };

  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams(data)
  });

  const tokenData = await response.json();
  return tokenData.access_token;
}


export const handler = async (_req: Request): Promise<Response> => {
  // get code from query parameters
  const code = _req.url.split("?")[1].split("=")[1];
  // get access token from Google
  const accessToken = await getAccessToken(code);
  // get user info from Google
  const endpoint = `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${accessToken}`;
  const response = await fetch(endpoint);
  const data = await response.json();
  // return user info
  // TODO: save user info to database
  let sessionToken;
  try {
    sessionToken = await DBDriver.createOrFindUser(data.email, data.name, data.picture);
  } catch (err) {
    // TODO: add proper logging
    console.log(err);
    return new Response(JSON.stringify(err), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  return new Response(JSON.stringify({
    sessionToken,
    picture: data.picture,
    name: data.name,
    email: data.email
  }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
};