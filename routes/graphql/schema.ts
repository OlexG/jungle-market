import { buildSchema } from "https://esm.sh/graphql@15.5.0";
import { Company } from "../models/company.ts";
import { OrderModel, orderQLString } from "../models/order.ts";

import { CompanyModel, companyQLString } from "../models/company.ts";

import { NewsModel, newsStoryQLString } from "../models/newsStory.ts";

import { UserModel, userQLString } from "../models/user.ts";

import { DBDriver } from "../../database/driver.ts";

const fakeNewsStories = [
  {
    id: "1",
    title: "News Story 1",
    description: "News Story 1 description",
    url: "https://www.google.com",
    image: "https://www.google.com",
    publishedAt: 123456789,
    companyID: "1",
  },
  {
    id: "2",
    title: "News Story 2",
    description: "News Story 2 description",
    url: "https://www.google.com",
    image: "https://www.google.com",
    publishedAt: 123456789,
    companyID: "2",
  },
];

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
    order(id: ID!): Order!
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
    return new CompanyModel(company as Company);
  },
  newsStories: () => {
    return fakeNewsStories.map((newsStory) => new NewsModel(newsStory));
  },
  newStory: (input: { id: string }) => {
    const newsStory = fakeNewsStories.find(
      (newsStory) => newsStory.id === input.id
    );
    return new NewsModel(newsStory as any);
  },
  user: async (input: { id: string }) => {
    const user = await DBDriver.Users.findById(input.id);
    return new UserModel(user);
  },

  /*---- PROTECTED ----*/
  // TODO: Add authentication
  orders: async (input: { userID: string }) => {
    const orders = await DBDriver.Orders.getByUserId(input.userID);
    return orders.map((order) => new OrderModel(order));
  },

  order: async (input: { id: string }) => {
    const order = await DBDriver.Orders.getById(input.id);
    return new OrderModel(order);
  }
};
