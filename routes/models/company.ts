import Company from '../../types/company.ts'

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


export const companyQLString = `
  type Company {
    id: ID!
    name: String!
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
  description: string

  constructor(company: Company) {
    this.id = company.id
    this.name = company.name
    this.description = company.description
  }

  get newsStories() {
    return fakeNewsStories.filter(newsStory => newsStory.companyID === this.id)
  }
}
