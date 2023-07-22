import { db } from "./database.ts";
import { generateRandomCompany } from "../generation/nameGeneration.ts";
import { createPentagon } from "https://deno.land/x/pentagon@v0.1.2/mod.ts";
import { CompanyDBSchema } from "../routes/models/company.ts";
import { NewsStoryDBSchema } from "../routes/models/newsStory.ts";
import { User, UserDBSchema } from "../routes/models/user.ts";
import { OrderDBSchema } from "../routes/models/order.ts";
import { getRandomPrice } from "../generation/priceGeneration.ts";

const NUMBER_OF_COMPANIES = 10;

export class Users {
  static async findPublicById(id: string): Promise<Partial<User>> {
    // TODO: figure out proper typing
    const user = await db.users.findFirst({
      where: { id },
    });
    if (!user) throw new Error("User not found");
    return {
      id: user.id,
      name: user.name,
      icon: user.icon,
    };
  }

  static async processPortofolioChange(
    userID: string,
    companyID: string,
    numberOfShares: number,
    type: "buy" | "sell",
    DBDriver: any
  ) {
    const user = await db.users.findFirst({
      where: { id: userID },
    });
    const portfolio = user.portfolio;
    const company = await db.companies.findFirst({
      where: { id: companyID },
    });

    // If company is already in portfolio, update number of shares
    if (portfolio.some((item) => item.companyID === companyID)) {
      const newPortfolio = portfolio.map((item) => {
        if (item.companyID === companyID) {
          if (type === "buy") {
            return {
              ...item,
              numberOfShares: item.numberOfShares + numberOfShares,
              totalSpent:
                item.totalSpent + numberOfShares * company.currentPrice,
            };
          } else {
            if (item.numberOfShares < numberOfShares) {
              throw new Error("Cannot sell more shares than you own");
            }
            return {
              ...item,
              numberOfShares: item.numberOfShares - numberOfShares,
              totalSpent:
                item.totalSpent - numberOfShares * company.currentPrice,
            };
          }
        } else {
          return item;
        }
      });
      // If number of shares is 0, remove company from portfolio
      if (newPortfolio.some((item) => item.numberOfShares === 0)) {
        const filteredPortfolio = newPortfolio.filter(
          (item) => item.numberOfShares !== 0
        );
        user.portfolio = filteredPortfolio;
        await DBDriver.Users.updateUser(userID, user);
      } else {
        user.portfolio = newPortfolio;
        await DBDriver.Users.updateUser(userID, user);
      }
    } else {
      // If company is not in portfolio, add it
      if (type === "sell") throw new Error("Cannot sell shares you don't own");
      const newPortfolio = [
        ...portfolio,
        {
          companyID,
          numberOfShares,
          totalSpent: numberOfShares * company.currentPrice,
        },
      ];
      user.portfolio = newPortfolio;
      await DBDriver.Users.updateUser(userID, user);
    }
  }

  static async findBySessionToken(
    sessionToken: string
  ): Promise<Partial<User>> {
    const user = await db.users.findFirst({
      where: { sessionToken },
    });
    if (!user) throw new Error("User not found");
    return {
      id: user.id,
      name: user.name,
      icon: user.icon,
    };
  }

  static async getPortfolio(userId: string) {
    const user = await db.users.findFirst({
      where: { id: userId },
    });
    return user.portfolio;
  }

  static async getUserIdFromSessionToken(
    sessionToken: string
  ): Promise<string> {
    const user = await db.users.findFirst({
      where: { sessionToken },
    });
    return user.id;
  }

  static async createOrFind(
    email: string,
    name: string,
    icon: string,
    DBDriver: any
  ): Promise<string> {
    if (!email || !name || !icon) throw new Error("Missing required fields");

    const existingUser = await db.users.findFirst({
      where: { email },
    });

    const newSessionToken = crypto.randomUUID();

    if (existingUser) {
      await Users.updateSessionToken(
        existingUser.id,
        newSessionToken,
        DBDriver
      );
      return newSessionToken;
    }

    const id = crypto.randomUUID();

    await db.users.create({
      data: {
        id,
        email,
        name,
        sessionToken: newSessionToken,
        icon,
        balance: 10000, // TODO: make this configurable per class
        portfolio: [],
      },
    });

    return newSessionToken;
  }

  static async updateSessionToken(
    id: string,
    sessionToken: string,
    DBDriver: any
  ) {
    const user = await db.users.findFirst({
      where: { id },
    });

    if (!user) throw new Error("User not found");

    await DBDriver.Users.updateUser(id, {
      ...user,
      sessionToken,
    });
  }

  static async updateUser(id: string, user: any) {
    await db.users.delete({
      where: { id },
    });

    await db.users.create({
      data: {
        id,
        email: user.email,
        name: user.name,
        sessionToken: user.sessionToken,
        icon: user.icon,
        balance: user.balance,
        portfolio: user.portfolio,
      },
    });
  }

  static async deleteAllRecords() {
    await db.users.deleteMany({});
  }

  async getById(id: string) {
    return await db.users.findFirst({
      where: { id },
    });
  }
}
