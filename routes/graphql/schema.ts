import {
  buildSchema
} from 'https://esm.sh/graphql@15.5.0';

const fakeCompanies = [
  {
    name: 'Company 1',
    description: 'Company 1 description'
  },
  {
    name: 'Company 2',
    description: 'Company 2 description'
  },
  {
    name: 'Company 3',
    description: 'Company 3 description'
  },
]

export const schema = buildSchema(`
  type Company {
    name: String!
    description: String!
  }

  type Query {
    companies: [Company!]!
  }
`)

export const rootValue = {
  companies: () => {
    return fakeCompanies
  }
}
