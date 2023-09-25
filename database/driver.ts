/// <reference lib="deno.unstable" />

import { Companies } from "./companies.ts";
import { Users } from "./users.ts";
import { Orders } from "./orders.ts";
import { NewsStories } from "./newsStories.ts";

import { db } from "./database.ts";

export const DBDriver = {
  db,
  init: async () => {
    // Ensure the lastGenerated key exists on the meta table
    const lastGenerated = await db.meta.findFirst({
      where: { key: "lastGenerated" },
    });
    if (!lastGenerated) {
      await db.meta.create({
        data: {
          id: crypto.randomUUID(),
          key: "lastGenerated",
          value: "0",
        },
      });
    }

    Companies.ensureCompaniesExist;
  },
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
