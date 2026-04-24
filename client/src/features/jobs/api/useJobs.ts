import { useGQLQuery } from '../../../lib/graphql.ts';
import { GET_JOBS } from './jobQueries.ts';
import type { Job } from '../types.ts';

export function useJobs() {
  const { data, loading: isLoading, error } = useGQLQuery<{ jobs: Job[] }>(GET_JOBS);
  return { jobs: data?.jobs ?? [], isLoadingJobs: isLoading, error };
}
