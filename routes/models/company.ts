import { z } from "https://deno.land/x/zod@v3.21.4/mod.ts";

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
}

const fakeNewsStories = [
  {
    id: '0',
    title: 'News Story 1',
    description: 'News Story 1 description',
    url: 'https://www.google.com',
    image: 'https://www.google.com',
    publishedAt: 123456789,
    companyID: '1'
  },
  {
    id: '0',
    title: 'News Story 2',
    description: 'News Story 2 description',
    url: 'https://www.google.com',
    image: 'https://www.google.com',
    publishedAt: 123456789,
    companyID: '2'
  },
]

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
  }
`

export class CompanyModel implements Company {
  id: string
  name: string
  ticker: string
  sector: string
  currentPrice: number;
  lastTimeUpdated: number;
  dailyPriceHistory: number[];
  thirtyDaysPriceHistory: number[];
  priceAdditionsSoFar: number;

  constructor(company: Company) {
    this.id = company.id
    this.name = company.name
    this.ticker = company.ticker
    this.sector = company.sector
    this.currentPrice = company.currentPrice
    this.dailyPriceHistory = company.dailyPriceHistory
    this.thirtyDaysPriceHistory = company.thirtyDaysPriceHistory
    this.lastTimeUpdated = company.lastTimeUpdated
    this.priceAdditionsSoFar = company.priceAdditionsSoFar
  }

  get newsStories() {
    return fakeNewsStories.filter(newsStory => newsStory.companyID === this.id)
  }
}
