import { useGQLQuery } from '../../../lib/graphql.ts';
import { GET_COMPANY } from './companyQueries.ts';
import type { Company } from '../types.ts';

export function useCompany(id: string) {
  const { data, loading: isLoading, error } = useGQLQuery<{ company: Company | null }, { id: string }>(GET_COMPANY, { id });
  return { company: data?.company ?? null, isLoadingCompany: isLoading, error };
}
