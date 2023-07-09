/// <reference lib="deno.unstable" />

const NUMBER_OF_COMPANIES = 10;

import { generateRandomCompany } from "../generation/nameGeneration.ts";
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
      .map(() => generateRandomCompany())
      .map((company) => ({
        ...company,
        createdAt: new Date(),
      }));

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
  /*
  * Creates a user or finds one with the same email. Regenerates and returns
  * a new session token. 
  */
  createOrFindUser: async (email: string, name: string, icon: string): Promise<string> => {
    if (!email || !name || !icon) throw new Error("Missing required fields");
    const existingUser = await db.users.findFirst({
      where: {
        email,
      },
    });
    const newSessionToken = crypto.randomUUID();

    if (existingUser) {
      // TODO: fix this
      await DBDriver.updateSessionToken(existingUser.id, newSessionToken);
      return newSessionToken
    }
    
    const id = crypto.randomUUID();
    await db.users.create({
      data: {
        id,
        email,
        name,
        sessionToken: newSessionToken,
        icon,
      },
    });
    return id;
  },

  /*
  * Workaround due to update not working
  */
  updateSessionToken: async (id: string, sessionToken: string) => {
    const user = await db.users.findFirst({
      where: {
        id,
      },
    });
    if (!user) throw new Error("User not found");
    await db.users.delete({
      where: {
        id,
      },
    });
    await db.users.create({
      data: {
        id,
        email: user.email,
        name: user.name,
        sessionToken,
        icon: user.icon,
      },
    });
  },

  deleteAllTableRecords: async () => {
    await db.newsStories.deleteMany({});
    await new Promise((resolve) => setTimeout(resolve, 1000));
    await db.users.deleteMany({});
  },
};