import { config } from "mod";
import { DBDriver } from "../../database/driver.ts";
const { ADMIN_KEY } = config();
async function attemptFunctionMultipleTimes(fn: () => Promise<void>, numberOfTries: number): Promise<void> {
  for (let i = 0; i < numberOfTries; i++) {
      try {
          await fn();
      } catch (error) {
          console.error(`Error on try ${i + 1}:`, error.message);
      }
  }
}

export const handler = async (_req: Request): Promise<Response> => {
  const adminKey = _req.headers.get("admin-key");
  if (adminKey !== ADMIN_KEY) {
    return new Response("Unauthorized", { status: 401 });
  }
  
  await attemptFunctionMultipleTimes(async () => {
    await DBDriver.Companies.deleteAllRecords();
  }, 3);

  await attemptFunctionMultipleTimes(async () => {
    await DBDriver.Users.deleteAllRecords();
  }, 3);

  await attemptFunctionMultipleTimes(async () => {
    await DBDriver.NewsStories.deleteAllRecords();
  }, 3);

  await attemptFunctionMultipleTimes(async () => {
    await DBDriver.Orders.deleteAllRecords();
  }, 3);

  return new Response("OK", { status: 200 });
}