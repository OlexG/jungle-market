import { z } from "https://deno.land/x/zod@v3.21.4/mod.ts";

// Shared TS type
export interface Company {
  id: string;
  name: string;
  ticker: string;
  sector: string;
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
  id: z.string().uuid().describe("primary, unique"),
  createdAt: z.date().optional(),
  name: z.string(),
  ticker: z.string(),
  sector: z.string(),
  description: z.string().optional(),
  logo: z.string().optional(),
  priceHistory: z.array(z.number()).optional(),
  currentPrice: z.number().optional(),
});

export const companyQLString = `
  type Company {
    id: ID!
    name: String!
    ticker: String!
    sector: String!
    description: String!
    logo: String!
    priceHistory: [Float!]!
    currentPrice: Float!
    newsStories: [NewsStory!]!
  }
`

export class CompanyModel implements Company {
  id: string
  name: string
  ticker: string
  sector: string

  constructor(company: Company) {
    this.id = company.id
    this.name = company.name
    this.ticker = company.ticker
    this.sector = company.sector
  }

  get newsStories() {
    return fakeNewsStories.filter(newsStory => newsStory.companyID === this.id)
  }
}
