
import { DBDriver } from '../../database/driver.ts';
import { CompanyModel } from './company.ts'
import { z } from "zod";




export const NewsStoryDBSchema = z.object({
  id: z.string().uuid().describe("primary"),
  createdAt: z.string(),
  title: z.string(),
  description: z.string(),
  image: z.string(),
  companyID: z.string().uuid(),
});

export const newsStoryQLString = `
  type NewsStory {
    id: ID!
    title: String!
    description: String!
    image: String!
    createdAt: String!
    company: Company!
  }
`

export class NewsModel {
  id: string
  title: string
  description: string
  image: string
  createdAt: string
  companyID: string

  constructor(newsStory: z.infer<typeof NewsStoryDBSchema>) {
    this.id = newsStory.id
    this.title = newsStory.title
    this.description = newsStory.description
    this.image = newsStory.image
    this.createdAt = newsStory.createdAt
    this.companyID = newsStory.companyID
  }


  async getCompany() {
    return new CompanyModel(await DBDriver.Companies.findById(this.companyID))
  }

  get company() {
    return this.getCompany()
  }

}

