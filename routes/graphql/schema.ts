import {
  buildSchema
} from 'https://esm.sh/graphql@15.5.0';
import { Company } from '../models/company.ts';

import {
  CompanyModel,
  companyQLString
} from '../models/company.ts';

import {
  NewsModel,
  newsStoryQLString
} from '../models/newsStory.ts';

import {
  UserModel,
  userQLString
} from '../models/user.ts';

import { DBDriver } from '../../database/driver.ts';


const fakeNewsStories = [
  {
    id: '1',
    title: 'News Story 1',
    description: 'News Story 1 description',
    url: 'https://www.google.com',
    image: 'https://www.google.com',
    publishedAt: 123456789,
    companyID: '1'
  },
  {
    id: '2',
    title: 'News Story 2',
    description: 'News Story 2 description',
    url: 'https://www.google.com',
    image: 'https://www.google.com',
    publishedAt: 123456789,
    companyID: '2'
  },
]



export const schema = buildSchema(`
  ${companyQLString}
  ${newsStoryQLString}
  ${userQLString}
  type Query {
    companies: [Company!]!
    company(id: ID!): Company!
    newsStories: [NewsStory!]!
    newsStory(id: ID!): NewsStory!
  }
`)

export const rootValue = {
  companies: async () => {
    const companies = await DBDriver.getAllCompanies()
    return companies.map(company => new CompanyModel(company))
  },
  company: async (id: string ) => {
    const company = await DBDriver.findCompanyByID(id)
    /* TODO: Figure out error handling */
    return new CompanyModel(company as Company)
  },
  newsStories: () => {
    return fakeNewsStories.map(newsStory => new NewsModel(newsStory))
  },
  newStory: (id: string) => {
    const newsStory = fakeNewsStories.find(newsStory => newsStory.id === id)
    return new NewsModel(newsStory as any)
  },
  user: (id: string) => {
  }
}
