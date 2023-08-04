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
DBDriver.init();

/* --- Uncomment to delete all records in the database --- */

// await DBDriver.Companies.deleteAllRecords();
// await DBDriver.Users.deleteAllRecords();
// await DBDriver.Orders.deleteAllRecords();
// await DBDriver.NewsStories.deleteAllRecords();


await start(manifest, { plugins: [twindPlugin(twindConfig)] });
