import { z } from "zod";
import { DBDriver } from "../../database/driver.ts";
import { UserModel } from "./user.ts";
import { CompanyModel, Company } from "./company.ts";

export interface Order {
  id: string;
  company: Company;
  createdAt: Date;
  numberOfShares: number;
  price: number;
  type: "buy" | "sell";
  user: UserModel;
  classId: string;
}

export const OrderDBSchema = z.object({
  id: z.string().uuid().describe("primary"),
  companyId: z.string().uuid(),
  userId: z.string().uuid(),
  createdAt: z.date().optional(),
  numberOfShares: z.number(),
  price: z.number(),
  type: z.enum(["buy", "sell"]),
  classId: z.string().uuid(), // TODO: make this an actual class eventually
});

export const orderQLString = `
  enum OrderType {
    buy
    sell
  }

  type Order {
    id: ID!
    company: Company!
    createdAt: String!
    numberOfShares: Int!
    price: Float!
    type: OrderType!
    user: User!
    classId: String!
  }
`;

export class OrderModel {
  id: string;
  companyId: string;
  userId: string;
  createdAt: Date;
  numberOfShares: number;
  price: number;
  type: "buy" | "sell";
  classId: string;

  constructor(order: any) {
    this.id = order.id;
    this.companyId = order.companyId;
    this.userId = order.userId;
    this.createdAt = order.createdAt;
    this.numberOfShares = order.numberOfShares;
    this.price = order.price;
    this.type = order.type;
    this.classId = order.classId;
  }

  user() {
    return this.getUser();
  }

  company() {
    return this.getCompany();
  }

  async getUser() {
    const user = await DBDriver.Users.findPublicById(this.userId);
    return new UserModel(user);
  }

  async getCompany() {
    const company = await DBDriver.Companies.findById(this.companyId);
    return new CompanyModel(company);
  }
}
