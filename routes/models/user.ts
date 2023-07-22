import { z } from "https://deno.land/x/zod@v3.21.4/mod.ts";
import { DBDriver } from "../../database/driver.ts";
import { OrderModel } from "./order.ts";

// Shared TS type
export interface User {
  name: string;
  icon: string;
  id: string;
}

export const UserDBSchema = z.object({
  id: z.string().uuid().describe("primary, unique"),
  createdAt: z.date().optional(),
  name: z.string(),
  email: z.string(),
  sessionToken: z.string().optional(),
  icon: z.string(),
});

export const userQLString = `
  type User {
    id: ID!
    name: String!
    icon: String!
    orders: [Order!]!
  }
`

export class UserModel implements User {
  id: string
  name: string
  email: string
  icon: string

  constructor(user: any) {
    this.id = user.id
    this.name = user.name
    this.email = user.email
    this.icon = user.icon
  }

  async orders() {
    return this.getOrders()
  }

  async getOrders() {
    const orders = await DBDriver.Orders.getByUserId(this.id) // TODO: find vs get
    return orders.map((order: any) => new OrderModel(order))
  }
}

