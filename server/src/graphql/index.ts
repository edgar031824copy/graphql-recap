import { ApolloServer } from '@apollo/server';
import { jobSchema } from './schema/job/jobSchema.js';
import { companySchema } from './schema/company/companySchema.js';
import { jobResolver } from './resolvers/job/jobResolver.js';
import { companyResolver } from './resolvers/company/companyResolver.js';

// Shared context type — available in every resolver as the third argument
export type GraphQLContext = { userId: string | null; companyId: string | null };

const baseSchema = `#graphql
  type Query
  type Mutation
`;

const typeDefs = [baseSchema, jobSchema, companySchema];

const resolvers = {
  Query: {
    ...jobResolver.Query,
    ...companyResolver.Query,
  },
  Mutation: {
    ...jobResolver.Mutation,
  },
  Job: jobResolver.Job,
  Company: companyResolver.Company,
};

export const apolloServer = new ApolloServer<GraphQLContext>({ typeDefs, resolvers });
