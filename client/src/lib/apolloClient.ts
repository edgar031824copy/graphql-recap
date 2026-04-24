import { ApolloClient, InMemoryCache } from '@apollo/client';

export const apolloClient = new ApolloClient({
  uri: 'http://localhost:4000/graphql',
  // Required for the browser to include the httpOnly cookie on every GraphQL request
  credentials: 'include',
  cache: new InMemoryCache(),
});
