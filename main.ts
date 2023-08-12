/// <reference no-default-lib="true" />
/// <reference lib="dom" />
/// <reference lib="dom.iterable" />
/// <reference lib="dom.asynciterable" />
/// <reference lib="deno.ns" />

import "$std/dotenv/load.ts";

import { start } from "$fresh/server.ts";
import manifest from "./fresh.gen.ts";

import twindPlugin from "$fresh/plugins/twind.ts";
import twindConfig from "./twind.config.ts";

import { DBDriver } from "./database/driver.ts";

globalThis.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled Promise Rejection:', event.reason);
  event.preventDefault(); // Prevents the default browser action (which might be to print the error to console).
});

globalThis.addEventListener('error', (event) => {
  console.error('Uncaught Exception:', event.error);
  event.preventDefault(); // Prevents the default browser action (which might be to print the error to console).
});

DBDriver.init();


/* --- Uncomment to delete all records in the database --- */
/* Run Deno, uncomment the first away function & save. Then recomment it and uncomment the next 3 await functions and save. Then comment out all 4.
Then uncomment everything else and comment back in */

// await DBDriver.Companies.deleteAllRecords();

// await DBDriver.Users.deleteAllRecords();
// await DBDriver.Orders.deleteAllRecords();
// await DBDriver.NewsStories.deleteAllRecords();

await start(manifest, { plugins: [twindPlugin(twindConfig)] });
