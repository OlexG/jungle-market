import { z } from "zod";
import { DBDriver } from "../../database/driver.ts";
import { OrderModel, Order } from "./order.ts";
import { Company, CompanyModel } from "./company.ts";

// Shared TS type
export interface User {
  name: string;
  icon: string;
  id: string;
  balance: number;
  email: string;
  orders: Order[];
  totalNetWorth: number;
  portfolio: {
    company: Company;
    numberOfShares: number;
    totalSpent: number;
  }[]
}

export interface PublicUser {
  id: string;
  icon: string;
  name: string;
  totalNetWorth: number;
  balance: number;
}

export const UserDBSchema = z.object({
  id: z.string().uuid().describe("primary"),
  createdAt: z.date().optional(),
  balance: z.number(),
  name: z.string(),
  email: z.string(),
  sessionToken: z.string().optional(),
  icon: z.string(),
  portfolio: z.array(z.object({
    companyId: z.string().uuid(),
    numberOfShares: z.number(),
    totalSpent: z.number(),
  })),
});

export const userQLString = `
  type PortfolioItem {
    company: Company!
    numberOfShares: Int!
    totalSpent: Float!
  }

  type User {
    id: ID!
    name: String!
    icon: String!
    balance: Float!
    orders: [Order!]!
    portfolio: [PortfolioItem!]!
    totalNetWorth: Float!
  }

  type PublicUser {
    name: String!
    totalNetWorth: Float!
    icon: String!
  }
`

export class PublicUserModel {
  id: string
  name: string
  icon: string
  totalNetWorth: number
  balance: number

  constructor(user: any) {
    this.id = user.id
    this.name = user.name
    this.icon = user.icon
    this.totalNetWorth = user.totalNetWorth
    this.balance = user.balance
  }
}

export class UserModel {
  id: string
  name: string
  email: string
  icon: string
  balance: number
  totalNetWorth: number

  constructor(user: any) {
    this.id = user.id
    this.name = user.name
    this.email = user.email
    this.icon = user.icon
    this.balance = user.balance
    this.totalNetWorth = user.totalNetWorth
  }

  orders() {
    return this.getOrders()
  }

  portfolio() {
    return this.getPortfolio()
  }

  async getPortfolio() {
    const portfolio = await DBDriver.Users.getPortfolio(this.id)
    return portfolio.map(async (portfolioItem: any) => {
      const company = await DBDriver.Companies.findById(portfolioItem.companyId)
      return {
        company: new CompanyModel(company),
        numberOfShares: portfolioItem.numberOfShares,
        totalSpent: portfolioItem.totalSpent
      }
    })
  }

  async getOrders() {
    const orders = await DBDriver.Orders.findByuserId(this.id) // TODO: find vs get
    return orders.map((order: any) => new OrderModel(order))
  }
}

