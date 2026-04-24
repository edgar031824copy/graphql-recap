import { useGQLMutation } from "../../../lib/graphql.ts";
import { CREATE_JOB } from "./jobMutations.ts";
import { GET_JOBS } from "./jobQueries.ts";
import type { Job } from "../types.ts";

interface CreateJobInput {
  title: string;
  description?: string;
  companyId: string;
}

export function useCreateJob() {
  const [mutate, { loading: isCreating, error }] = useGQLMutation<
    { createJob: Job },
    { input: CreateJobInput }
  >(CREATE_JOB, {
    refetchQueries: [{ query: GET_JOBS }],
  });
  const createJob = (input: CreateJobInput) => mutate({ variables: { input } });
  return { createJob, isCreatingJob: isCreating, error };
}
