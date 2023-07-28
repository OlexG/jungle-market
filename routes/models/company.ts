import { z } from "zod";
import { DBDriver } from "../../database/driver.ts";
import { NewsModel } from "./newsStory.ts";

// Shared TS type

export interface Company {
  id: string;
  name: string;
  ticker: string;
  sector: string;
  currentPrice: number;
  dailyPriceHistory: number[];
  thirtyDaysPriceHistory: number[];
  lastTimeUpdated: number;
  priceAdditionsSoFar: number;
  ceo: string;
  newsStories: NewsModel[];
}

export const CompanyDBSchema = z.object({
  id: z.string().uuid().describe("primary"),
  createdAt: z.date(),
  name: z.string(),
  ticker: z.string(),
  sector: z.string(),
  description: z.string().optional(),
  logo: z.string().optional(),
  dailyPriceHistory: z.array(z.number()), // per minute
  thirtyDaysPriceHistory: z.array(z.number()), // hourly
  currentPrice: z.number(),
  lastTimeUpdated: z.number(),
  priceAdditionsSoFar: z.number(),
  ceo: z.string(),
});

export const companyQLString = `
  type Company {
    id: ID!
    name: String!
    ticker: String!
    sector: String!
    description: String!
    logo: String!
    dailyPriceHistory: [Float!]!
    thirtyDaysPriceHistory: [Float!]!
    currentPrice: Float!
    newsStories: [NewsStory!]!
    lastTimeUpdated: Int!
    ceo: String!
  }
`;

export class CompanyModel {
  id: string;
  name: string;
  ticker: string;
  sector: string;
  currentPrice: number;
  lastTimeUpdated: number;
  dailyPriceHistory: number[];
  thirtyDaysPriceHistory: number[];
  priceAdditionsSoFar: number;
  ceo: string;

  constructor(company: z.infer<typeof CompanyDBSchema>) {
    this.id = company.id;
    this.name = company.name;
    this.ticker = company.ticker;
    this.sector = company.sector;
    this.currentPrice = company.currentPrice;
    this.dailyPriceHistory = company.dailyPriceHistory;
    this.thirtyDaysPriceHistory = company.thirtyDaysPriceHistory;
    this.lastTimeUpdated = company.lastTimeUpdated;
    this.priceAdditionsSoFar = company.priceAdditionsSoFar;
    this.ceo = company.ceo;
  }

  async getNewsStories() {
    const newsStories = await DBDriver.NewsStories.getByCompanyId(this.id);
    return newsStories.map((newsStory) => new NewsModel(newsStory));
  }

  get newsStories() {
    return this.getNewsStories();
  }
}
