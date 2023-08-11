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
  description: string;
  netIncome: number;
  grossMargin: number;
  deRatio: number;
  peRatio: number;
  roe: number;
  rating: number;
}

export const CompanyDBSchema = z.object({
  id: z.string().uuid().describe("primary"),
  createdAt: z.date(),
  name: z.string(),
  ticker: z.string(),
  sector: z.string(),
  description: z.string(),
  logo: z.string().optional(),
  dailyPriceHistory: z.array(z.number()), // per minute
  thirtyDaysPriceHistory: z.array(z.number()), // hourly
  currentPrice: z.number(),
  lastTimeUpdated: z.number(),
  priceAdditionsSoFar: z.number(),
  ceo: z.string(),
  netIncome: z.number(),
  grossMargin: z.number(),
  deRatio: z.number(),
  peRatio: z.number(),
  roe: z.number(),
  rating: z.number(),
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
    netIncome: Float!
    grossMargin: Float!
    deRatio: Float!
    peRatio: Float!
    roe: Float!
    rating: Float!
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
  description: string;
  netIncome: number;
  grossMargin: number;
  deRatio: number;
  peRatio: number;
  roe: number;
  rating: number;

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
    this.description = company.description;
    this.netIncome = company.netIncome;
    this.grossMargin = company.grossMargin;
    this.deRatio = company.deRatio;
    this.peRatio = company.peRatio;
    this.roe = company.roe;
    this.rating = company.rating;
  }

  async getNewsStories() {
    const newsStories = await DBDriver.NewsStories.findBycompanyId(this.id);
    return newsStories.map((newsStory) => new NewsModel(newsStory));
  }

  get newsStories() {
    return this.getNewsStories();
  }
}
