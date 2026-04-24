import { useGQLMutation } from '../../../lib/graphql.ts';
import { UPDATE_JOB } from './jobMutations.ts';
import { GET_JOB } from './jobQueries.ts';

type UpdateJobInput = { title?: string; description?: string };
type UpdateJobResult = { updateJob: { id: string; title: string; date: string; company: { id: string; name: string } } };

export function useUpdateJob(jobId: string) {
  const [mutate, { loading: isUpdating, error }] = useGQLMutation<UpdateJobResult, { id: string; input: UpdateJobInput }>(
    UPDATE_JOB,
    { refetchQueries: [{ query: GET_JOB, variables: { id: jobId } }] },
  );
  const updateJob = (input: UpdateJobInput) => mutate({ variables: { id: jobId, input } });
  return { updateJob, isUpdatingJob: isUpdating, error };
}
