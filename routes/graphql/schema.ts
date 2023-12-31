import { buildSchema } from "graphql";
import { Company, CompanyDBSchema } from "../models/company.ts";
import { OrderModel, orderQLString } from "../models/order.ts";

import { CompanyModel, companyQLString } from "../models/company.ts";

import { NewsModel, NewsStoryDBSchema, newsStoryQLString } from "../models/newsStory.ts";

import { PublicUserModel, UserModel, userQLString } from "../models/user.ts";

import { DBDriver } from "../../database/driver.ts";
import z from "https://deno.land/x/zod@v3.21.4/index.ts";


export const schema = buildSchema(`
  ${companyQLString}
  ${newsStoryQLString}
  ${userQLString}
  ${orderQLString}
  type Query {
    companies: [Company!]!
    company(id: ID!): Company!
    newsStories(page: Int! pageSize: Int!): [NewsStory!]!
    newsStory(id: ID!): NewsStory!
    orders(userId: ID!): [Order!]!
    user(userId: ID!): User!
    reset(id: ID!): User!
    users: [PublicUser!]!
    order(
      userId: ID! 
      id: ID!
    ): Order!
  }

  type Mutation {
    createOrder(
      userId: ID!
      companyId: ID!
      numberOfShares: Int!
      type: OrderType!
    ) : Order!
  }
`);

export const rootValue = {
  companies: async () => {
    const companies = await DBDriver.Companies.getAll();
    return companies.map((company) => new CompanyModel(company));
  },
  company: async (input: { id: string }) => {
    const company = await DBDriver.Companies.findById(input.id);
    /* TODO: Figure out error handling */
    return new CompanyModel(company as z.infer<typeof CompanyDBSchema>);
  },
  newsStory: async (input: { id: string }) => {
    const newsStory = await DBDriver.NewsStories.findById(input.id);
    return new NewsModel(newsStory as z.infer<typeof NewsStoryDBSchema>);
  },
  newsStories: async (input: { page: number, pageSize: number }) => {
    const newsStories = await DBDriver.NewsStories.getNewsByPage();
    return newsStories.map((newsStory) => new NewsModel(newsStory));
  },

  user: async (input: { userId: string }) => {
    const user = await DBDriver.Users.findPublicById(input.userId);
    return new UserModel(user);
  },

  users: async () => {
    const users = await DBDriver.Users.getAllPublic();
    return users.map((user) => new PublicUserModel(user));
  },

  /*---- PROTECTED ----*/
  // TODO: Add authentication
  orders: async (input: { userId: string }) => {
    const orders = await DBDriver.Orders.findByuserId(input.userId);
    return orders.map((order) => new OrderModel(order));
  },

  reset: async (input: { userId: string }) => {
    await DBDriver.Users.reset(input.userId);
    return true;
  },

  order: async (input: { userId: string, id: string }) => {
    const order = await DBDriver.Orders.findById(input.id);
    if (order.userId !== input.userId) {
      throw new Error("Order does not belong to user");
    }
    return new OrderModel(order);
  },

  createOrder: async (input: {
    userId: string;
    companyId: string;
    numberOfShares: number;
    type: "buy" | "sell";
  } ) => {
    const order = await DBDriver.Orders.createOrder(
      input.userId,
      input.companyId,
      input.numberOfShares,
      input.type,
    );
    return new OrderModel(order);
  }
};
