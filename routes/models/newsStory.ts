
import Company from '../../types/company.ts'

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
    return fakeCompanies.find(company => company.id === this.companyID)
  }
}

