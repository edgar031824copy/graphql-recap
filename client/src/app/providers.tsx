import type { ReactNode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';
import { AuthProvider } from '../features/auth/context/AuthContext.tsx';
import { apolloClient } from '../lib/apolloClient.ts';

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <ApolloProvider client={apolloClient}>
      <BrowserRouter>
        <AuthProvider>{children}</AuthProvider>
      </BrowserRouter>
    </ApolloProvider>
  );
}
