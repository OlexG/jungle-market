import {
  buildSchema
} from 'https://esm.sh/graphql@15.5.0';
import Company from '../../types/company.ts';

import {
  CompanyModel,
  companyQLString
} from '../models/company.ts';

import {
  NewsModel,
  newsStoryQLString
} from '../models/newsStory.ts';
 
const fakeCompanies: Company[] = [
  {
    id: '1',
    name: 'Company 1',
    description: 'Company 1 description'
  },
  {
    id: '2',
    name: 'Company 2',
    description: 'Company 2 description'
  },
  {
    id: '3',
    name: 'Company 3',
    description: 'Company 3 description'
  },
]

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
  type Query {
    companies: [Company!]!
    company(id: ID!): Company!
    newsStories: [NewsStory!]!
    newsStory(id: ID!): NewsStory!
  }
`)

export const rootValue = {
  companies: () => {
    return fakeCompanies.map(company => new CompanyModel(company))
  },
  company: (id: string ) => {
    const company = fakeCompanies.find(company => company.id === id)
    /* TODO: Figure out error handling */
    return new CompanyModel(company as Company)
  },
  newsStories: () => {
    return fakeNewsStories.map(newsStory => new NewsModel(newsStory))
  },
  newStory: (id: string) => {
    const newsStory = fakeNewsStories.find(newsStory => newsStory.id === id)
    return new NewsModel(newsStory as any)
  }
}
