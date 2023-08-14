import { db } from "./database.ts";
import { generateRandomCompany } from "../generation/nameGeneration.ts";
import { CompanyDBSchema } from "../routes/models/company.ts";
import { getRandomPrice, getNextPrice } from "../generation/priceGeneration.ts";
import { z } from "zod";

const NUMBER_OF_COMPANIES = 10;

export class Companies {
  static async ensureCompaniesExist() {
    const companies = await db.companies.findMany({});
    if (companies.length < NUMBER_OF_COMPANIES) {
      const newCompanies = Array(NUMBER_OF_COMPANIES - companies.length)
        .fill(null)
        .map(() => generateRandomCompany())
        .map((company) => {
          const startingPrice = getRandomPrice();
          const thirtyDaysPriceHistory = [startingPrice];
          for (let i = 1; i < 29 * 24; i++) {
            thirtyDaysPriceHistory.push(
              getNextPrice(thirtyDaysPriceHistory[i - 1], company as any, 3)
            );
          }

          const dailyPriceHistory = [thirtyDaysPriceHistory[thirtyDaysPriceHistory.length - 1]];
          for (let i = 1; i <= 24 * 60; i++) {
            dailyPriceHistory.push(getNextPrice(dailyPriceHistory[i - 1], company as any, 0.5));
            if (i % 60 === 0) {
              thirtyDaysPriceHistory.push(dailyPriceHistory[i]);
            }
          }

          const currentCompanyPrice = dailyPriceHistory[dailyPriceHistory.length - 1];
          return {
            ...company,
            createdAt: new Date(),
            currentPrice: currentCompanyPrice,
            thirtyDaysPriceHistory: thirtyDaysPriceHistory,
            dailyPriceHistory: dailyPriceHistory,
            lastTimeUpdated: Date.now(),
            priceAdditionsSoFar: 0,
          };
        });

      await db.companies.createMany({
        data: newCompanies,
      });

      for (let i = 1; i < 30 * 24; i++) {
        Companies.updateCompanyPrices();
      }
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

  static getNewCompanyPrice(company: z.infer<typeof CompanyDBSchema>) {
    const companyCopy = { ...company };
    const lastTimeUpdated = companyCopy.lastTimeUpdated;
    const timeSinceLastUpdate = Date.now() - lastTimeUpdated;
    const minutesSinceLastUpdate = timeSinceLastUpdate / 1000 / 60;
    for (let i = 0; i < minutesSinceLastUpdate; i++) {
      companyCopy.dailyPriceHistory.shift();
      companyCopy.dailyPriceHistory.push(
        getNextPrice(companyCopy.currentPrice, companyCopy, 0.5)
      );
    }
    companyCopy.currentPrice =
      companyCopy.dailyPriceHistory[companyCopy.dailyPriceHistory.length - 1];
    companyCopy.lastTimeUpdated = Date.now();
    companyCopy.priceAdditionsSoFar += minutesSinceLastUpdate;
    if (companyCopy.priceAdditionsSoFar >= 60) {
      companyCopy.priceAdditionsSoFar -= 60;
      companyCopy.thirtyDaysPriceHistory.shift();
      companyCopy.thirtyDaysPriceHistory.push(companyCopy.currentPrice);
    }
    return companyCopy;
  }

  static async updateCompanyPrices() {
    const companies = await db.companies.findMany({});
    const newCompanies = await Promise.all(
      companies.map((company) => this.getNewCompanyPrice(company))
    );

    for (const company of newCompanies) {
      await db.companies.update({
        where: { id: company.id },
        data: {
          currentPrice: company.currentPrice,
          dailyPriceHistory: company.dailyPriceHistory,
          thirtyDaysPriceHistory: company.thirtyDaysPriceHistory,
          lastTimeUpdated: company.lastTimeUpdated,
          priceAdditionsSoFar: company.priceAdditionsSoFar,
        },
      });
    }
  }
}

// Set up minute-based updates
setInterval(async () => {
  await Companies.updateCompanyPrices();
}, 100 * 60);
