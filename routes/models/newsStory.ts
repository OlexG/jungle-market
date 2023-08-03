
import { DBDriver } from '../../database/driver.ts';
import { CompanyModel } from './company.ts'
import { z } from "zod";



export interface NewsStory {
  id: string;
  title: string;
  description: string;
  image: string;
  company: CompanyModel;
  createdAt: string;
}

export const NewsStoryDBSchema = z.object({
  id: z.string().uuid().describe("primary"),
  createdAt: z.string(),
  title: z.string(),
  description: z.string(),
  image: z.string(),
  companyId: z.string().uuid(),
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
  companyId: string

  constructor(newsStory: z.infer<typeof NewsStoryDBSchema>) {
    this.id = newsStory.id
    this.title = newsStory.title
    this.description = newsStory.description
    this.image = newsStory.image
    this.createdAt = newsStory.createdAt
    this.companyId = newsStory.companyId
  }


  async getCompany() {
    return new CompanyModel(await DBDriver.Companies.findById(this.companyId))
  }

  get company() {
    return this.getCompany()
  }

}

