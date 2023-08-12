import { config } from "mod";
import { DBDriver } from "../../database/driver.ts";
import { generateArticle } from "../../database/newsStories.ts";
const { ADMIN_KEY } = config();

export const handler = async (_req: Request): Promise<Response> => {
  const adminKey = _req.headers.get("admin-key");
  if (adminKey !== ADMIN_KEY) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    await DBDriver.init();
    // wait 6 seconds
    await new Promise((resolve) => setTimeout(resolve, 6000));
    await generateArticle();
  } catch (error) {
    console.log('Error');
  }

  return new Response("OK", { status: 200 });
};
