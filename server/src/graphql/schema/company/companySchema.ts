export const companySchema = `#graphql
  "A company that posts job listings."
  type Company {
    id: ID!
    name: String!
    description: String
    "All jobs posted by this company."
    jobs: [Job!]!
  }

  extend type Query {
    "Returns all companies."
    companies: [Company!]!
    "Returns a single company by ID, or null if not found."
    company(id: ID!): Company
  }
`;
