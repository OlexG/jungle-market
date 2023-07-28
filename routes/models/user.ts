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
  }
`

export class UserModel {
  id: string
  name: string
  email: string
  icon: string
  balance: number

  constructor(user: any) {
    this.id = user.id
    this.name = user.name
    this.email = user.email
    this.icon = user.icon
    this.balance = user.balance
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

