import { db } from "./database.ts";
import { User, PublicUser, UserDBSchema } from "../routes/models/user.ts";
import { z } from "zod";

export class Users {
  static async findPublicById(id: string): Promise<PublicUser> {
    // TODO: figure out proper typing
    const user = await db.users.findFirst({
      where: { id },
    });
    const companies = await db.companies.findMany({});

    if (!user) throw new Error("User not found");
    return {
      id: user.id,
      name: user.name,
      icon: user.icon,
      balance: user.balance,
      totalNetWorth: user.balance + user.portfolio.reduce(
        (acc, item) => acc + item.numberOfShares * companies.find(
          (company) => company.id === item.companyId
        )!.currentPrice,
        0,
      ),
    };
  }

  static async getAllPublic(): Promise<PublicUser[]> {
    const users = await db.users.findMany({});
    const companies = await db.companies.findMany({});
    return users.map((user) => ({
      id: user.id,
      balance: user.balance,
      name: user.name,
      icon: user.icon,
      totalNetWorth: user.balance + user.portfolio.reduce(
        (acc, item) => acc + item.numberOfShares * companies.find(
          (company) => company.id === item.companyId
        )!.currentPrice,
        0,
      ),
    }));
  }


  static async processPortofolioChange(
    user: z.infer<typeof UserDBSchema>,
    companyId: string,
    numberOfShares: number,
    type: "buy" | "sell",
  ) {
    const portfolio = user.portfolio;
    const company = await db.companies.findFirst({
      where: { id: companyId },
    });

    // If company is already in portfolio, update number of shares
    if (portfolio.some((item) => item.companyId === companyId)) {
      const newPortfolio = portfolio.map((item) => {
        if (item.companyId === companyId) {
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
        await this.updateUser(user.id, user);
      } else {
        user.portfolio = newPortfolio;
        await this.updateUser(user.id, user);
      }
    } else {
      // If company is not in portfolio, add it
      if (type === "sell") throw new Error("Cannot sell shares you don't own");
      const newPortfolio = [
        ...portfolio,
        {
          companyId,
          numberOfShares,
          totalSpent: numberOfShares * company.currentPrice,
        },
      ];
      user.portfolio = newPortfolio;
      await this.updateUser(user.id, user);
    }
  }

  static async findBySessionToken(
    sessionToken: string
  ): Promise<PublicUser> {
    const user = await db.users.findFirst({
      where: { sessionToken },
    });
    const companies = await db.companies.findMany({});
    if (!user) throw new Error("User not found");
    return {
      id: user.id,
      name: user.name,
      icon: user.icon,
      balance: user.balance,
      totalNetWorth: user.balance + user.portfolio.reduce(
        (acc, item) => acc + item.numberOfShares * companies.find( 
          (company) => company.id === item.companyId
        )!.currentPrice,
        0,
      ),
    };
  }

  static async getPortfolio(userId: string) {
    const user = await db.users.findFirst({
      where: { id: userId },
    });
    return user.portfolio;
  }

  static async getuserIdFromSessionToken(
    sessionToken: string
  ): Promise<string> {
    if (!sessionToken) return "";
    const user = await db.users.findFirst({
      where: { sessionToken },
    });
    return user.id;
  }

  static async createOrFind(
    email: string,
    name: string,
    icon: string,
  ): Promise<string> {
    if (!email || !name || !icon) throw new Error("Missing required fields " + email + name + icon);

    const existingUser = await db.users.findFirst({
      where: { email },
    });

    const newSessionToken = crypto.randomUUID();

    if (existingUser) {
      await Users.updateSessionToken(
        existingUser.id,
        newSessionToken,
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

  static async updateUser(id: string, user: z.infer<typeof UserDBSchema>) {
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

  async findById(id: string) {
    return await db.users.findFirst({
      where: { id },
    });
  }
}

import { DBDriver } from "./driver.ts";