
import { DBDriver } from '../../database/driver.ts';
import { generateRandomCompany } from '../../generation/nameGeneration.ts'
import { Company } from './company.ts'
import { z } from "https://deno.land/x/zod@v3.21.4/mod.ts";

const fakeCompanies: Company[] = [
]


export const NewsStoryDBSchema = z.object({
  id: z.string().uuid().describe("primary, unique"),
  createdAt: z.date(),
  title: z.string(),
  description: z.string(),
  url: z.string(),
  image: z.string(),
  publishedAt: z.number(),
  companyID: z.string().uuid(),
});

export const newsStoryQLString = `
  type NewsStory {
    id: ID!
    title: String!
    description: String!
    url: String!
    image: String!
    publishedAt: Int!
    company: Company!
  }
`

export class NewsModel {
  id: string
  title: string
  description: string
  url: string
  image: string
  publishedAt: number
  companyID: string

  constructor(newsStory: any) {
    this.id = newsStory.id
    this.title = newsStory.title
    this.description = newsStory.description
    this.url = newsStory.url
    this.image = newsStory.image
    this.publishedAt = newsStory.publishedAt
    this.companyID = newsStory.companyID
  }

  get company() {
    return DBDriver.Companies.findById(this.companyID)
  }

}

