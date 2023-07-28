import { buildSchema } from "graphql";
import { Company, CompanyDBSchema } from "../models/company.ts";
import { OrderModel, orderQLString } from "../models/order.ts";

import { CompanyModel, companyQLString } from "../models/company.ts";

import { NewsModel, NewsStoryDBSchema, newsStoryQLString } from "../models/newsStory.ts";

import { UserModel, userQLString } from "../models/user.ts";

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
    newsStories: [NewsStory!]!
    newsStory(id: ID!): NewsStory!
    orders(userID: ID!): [Order!]!
    user(id: ID!): User!
    order(
      userID: ID! 
      id: ID!
    ): Order!
  }

  type Mutation {
    createOrder(
      userID: ID!
      companyID: ID!
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
  newStory: async (input: { id: string }) => {
    const newsStory = await DBDriver.NewsStories.getById(input.id);
    return new NewsModel(newsStory as z.infer<typeof NewsStoryDBSchema>);
  },
  user: async (input: { id: string }) => {
    const user = await DBDriver.Users.findPublicById(input.id);
    return new UserModel(user);
  },

  /*---- PROTECTED ----*/
  // TODO: Add authentication
  orders: async (input: { userID: string }) => {
    const orders = await DBDriver.Orders.getByUserId(input.userID);
    return orders.map((order) => new OrderModel(order));
  },

  order: async (input: { userID: string, id: string }) => {
    const order = await DBDriver.Orders.getById(input.id);
    if (order.userID !== input.userID) {
      throw new Error("Order does not belong to user");
    }
    return new OrderModel(order);
  },

  createOrder: async (input: {
    userID: string;
    companyID: string;
    numberOfShares: number;
    type: "buy" | "sell";
  } ) => {
    const order = await DBDriver.Orders.createOrder(
      input.userID,
      input.companyID,
      input.numberOfShares,
      input.type,
    );
    return new OrderModel(order);
  }
};
