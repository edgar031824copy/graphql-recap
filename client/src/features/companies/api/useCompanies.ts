import { useGQLQuery } from '../../../lib/graphql.ts';
import { GET_COMPANIES } from './companyQueries.ts';
import type { Company } from '../types.ts';

export function useCompanies() {
  const { data, loading: isLoading, error } = useGQLQuery<{ companies: Pick<Company, 'id' | 'name'>[] }>(GET_COMPANIES);
  return { companies: data?.companies ?? [], isLoadingCompanies: isLoading, error };
}
