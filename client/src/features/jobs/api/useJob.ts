import { useGQLQuery } from '../../../lib/graphql.ts';
import { GET_JOB } from './jobQueries.ts';
import type { Job } from '../types.ts';

export function useJob(id: string) {
  const { data, loading: isLoading, error } = useGQLQuery<{ job: Job | null }, { id: string }>(GET_JOB, { id });
  return { job: data?.job ?? null, isLoadingJob: isLoading, error };
}
