import { config } from "mod";
let { CLIENT_ID, CLIENT_SECRET, RED_URL } = config();
if (!CLIENT_ID) {
  CLIENT_ID = Deno.env.get("CLIENT_ID") || "";
}
if (!CLIENT_SECRET) {
  CLIENT_SECRET = Deno.env.get("CLIENT_SECRET") || "";
}
if (!RED_URL) {
  RED_URL = Deno.env.get("RED_URL") || "";
}

import { DBDriver } from "../../database/driver.ts";
async function getAccessToken(code: string) {
  const client_id = CLIENT_ID
  const client_secret = CLIENT_SECRET
  const redirect_uri = RED_URL
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
  let user
  if (!data?.email || !data?.name || !data?.picture) {
    console.log(data);
  }

  try {
    sessionToken = await DBDriver.Users.createOrFind(data.email, data.name, data.picture);
    user = await DBDriver.Users.findBySessionToken(sessionToken);
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
    icon: user.icon,
    name: user.name,
    id: user.id,
  }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      // set a CSRF token
      "Set-Cookie": `session-token=${sessionToken}; HttpOnly; Path=/; SameSite=Strict`,
    },
  });
};