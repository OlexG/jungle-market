import { z } from "https://deno.land/x/zod@v3.21.4/mod.ts";
import { DBDriver } from "../../database/driver.ts";

export const OrderDBSchema = z.object({
  id: z.string().uuid().describe("primary, unique"),
  companyID: z.string().uuid(),
  userID: z.string().uuid(),
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
    classId: String!
  }
`;

export class OrderModel {
  id: string;
  companyID: string;
  userID: string;
  createdAt: Date;
  numberOfShares: number;
  price: number;
  type: "buy" | "sell";
  classId: string;

  constructor(order: any) {
    this.id = order.id;
    this.companyID = order.companyID;
    this.userID = order.userID;
    this.createdAt = order.createdAt;
    this.numberOfShares = order.numberOfShares;
    this.price = order.price;
    this.type = order.type;
    this.classId = order.classId;
  }

  get user() {
    return DBDriver.Users.findPublicById(this.userID);
  }

  get company() {
    return DBDriver.Companies.findById(this.companyID);
  }
}
