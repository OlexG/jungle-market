import { db } from "./database.ts";
import { generateRandomCompany } from "../generation/nameGeneration.ts";
import { createPentagon } from "https://deno.land/x/pentagon@v0.1.2/mod.ts";
import { CompanyDBSchema } from "../routes/models/company.ts";
import { NewsStoryDBSchema } from "../routes/models/newsStory.ts";
import { User, UserDBSchema } from "../routes/models/user.ts";
import { OrderDBSchema } from "../routes/models/order.ts";
import { getRandomPrice } from "../generation/priceGeneration.ts";

const NUMBER_OF_COMPANIES = 10;

export class Companies {
  static async ensureCompaniesExist() {
    const companies = await db.companies.findMany({});
    if (companies.length < NUMBER_OF_COMPANIES) {
      const newCompanies = Array(NUMBER_OF_COMPANIES - companies.length)
        .fill(null)
        .map(() => generateRandomCompany())
        .map((company) => ({
          ...company,
          createdAt: new Date(),
          currentPrice: getRandomPrice(),
          dailyPriceHistory: Array(60 * 24)
            .fill(null)
            .map(() => getRandomPrice()),
          thirtyDaysPriceHistory: Array(30 * 24)
            .fill(null)
            .map(() => getRandomPrice()),
        }));

      await db.companies.createMany({
        data: newCompanies,
      });
    }
  }

  static async getAll() {
    return await db.companies.findMany({});
  }

  static async findById(id: string) {
    return await db.companies.findFirst({
      where: { id },
    });
  }

  static async deleteAllRecords() {
    for (const company of await db.companies.findMany({})) {
      await db.companies.delete({
        where: { id: company.id },
      });
    }
  }
}