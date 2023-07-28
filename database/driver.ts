/// <reference lib="deno.unstable" />

import { Companies } from "./companies.ts";
import { Users } from "./users.ts";
import { Orders } from "./orders.ts";
import { NewsStories } from "./newsStories.ts";

import { db } from "./database.ts";

export const DBDriver = {
  db,
  init: Companies.ensureCompaniesExist,
  Companies,
  Users,
  Orders,
  NewsStories,
  deleteAllTableRecords: async () => {
    await db.newsStories.deleteMany({});
    await new Promise((resolve) => setTimeout(resolve, 1000));
    await Users.deleteAllRecords();
  },
};
