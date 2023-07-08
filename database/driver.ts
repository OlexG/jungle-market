/// <reference lib="deno.unstable" />

const NUMBER_OF_COMPANIES = 10;

import { generateRandomCompany } from "../generation/nameGeneration.ts";
import { z } from "https://deno.land/x/zod@v3.21.4/mod.ts";
import { createPentagon } from "https://deno.land/x/pentagon@v0.0.3/mod.ts";
import { CompanyDBSchema } from "../routes/models/company.ts";
import { NewsStoryDBSchema } from "../routes/models/newsStory.ts";
import { UserDBSchema } from "../routes/models/user.ts";

const kv = await Deno.openKv();




const db = createPentagon(kv, {
  users: {
    schema: UserDBSchema,
  },
  companies: {
    schema: CompanyDBSchema,
    relations: {
      newsStories: ["newsStories", [NewsStoryDBSchema], "id", "companyID"],
    },
  },
  newsStories: {
    schema: NewsStoryDBSchema,
    relations: {
      company: ["companies", CompanyDBSchema, "companyID", "id"],
    },
  },
});

async function testIfCompaniesCreated() {
  const companies = await db.companies.findMany({});
  if (companies.length < NUMBER_OF_COMPANIES) {
    const newCompanies = Array(NUMBER_OF_COMPANIES - companies.length)
      .fill(null)
      .map(() => generateRandomCompany());
    await db.companies.createMany({
      data: newCompanies,
    });
  }
}

testIfCompaniesCreated();

export const DBDriver = {
  db,
  init: () => {
    testIfCompaniesCreated();
  },
  getAllCompanies: async () => {
    return await db.companies.findMany({});
  },
  findCompanyByID: async (id: string) => {
    return await db.companies.findFirst({
      where: {
        id,
      },
    });
  },
  findUserByID: async (id: string) => {
    return await db.users.findFirst({
      where: {
        id,
      },
    });
  },
  createOrFindUser: async (email: string, name: string, icon: string): Promise<string> => {
    if (!email || !name || !icon) throw new Error("Missing required fields");
    const id = crypto.randomUUID();
    const existingUser = await db.users.findFirst({
      where: {
        email,
      },
    });
    if (existingUser) {
      return existingUser.id;
    }
  
    const sessionToken = crypto.randomUUID();
    await db.users.create({
      data: {
        id,
        email,
        name,
        sessionToken,
        icon,
      },
    });
    return id;
  }
};