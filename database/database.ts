/// <reference lib="deno.unstable" />

import { createPentagon } from "pentagon";
import { CompanyDBSchema } from "../routes/models/company.ts";
import { NewsStoryDBSchema } from "../routes/models/newsStory.ts";
import { UserDBSchema } from "../routes/models/user.ts";
import { OrderDBSchema } from "../routes/models/order.ts";

const kv = await Deno.openKv();

export const db = createPentagon(kv, {
  users: {
    schema: UserDBSchema,
  },
  companies: {
    schema: CompanyDBSchema,
    relations: {
      newsStories: ["newsStories", [NewsStoryDBSchema], "id", "companyId"],
    },
  },
  newsStories: {
    schema: NewsStoryDBSchema,
    relations: {
      company: ["companies", CompanyDBSchema, "companyId", "id"],
    },
  },
  orders: {
    schema: OrderDBSchema,
    relations: {
      user: ["users", UserDBSchema, "userId", "id"],
      company: ["companies", CompanyDBSchema, "companyId", "id"],
    },
  },
});