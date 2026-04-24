import { useGQLMutation } from '../../../lib/graphql.ts';
import { DELETE_JOB } from './jobMutations.ts';
import { GET_JOBS } from './jobQueries.ts';

export function useDeleteJob() {
  const [mutate, { loading: isDeleting, error }] = useGQLMutation<{ deleteJob: { id: string } }, { id: string }>(DELETE_JOB, {
    refetchQueries: [{ query: GET_JOBS }],
  });
  const deleteJob = (id: string) => mutate({ variables: { id } });
  return { deleteJob, isDeletingJob: isDeleting, error };
}
