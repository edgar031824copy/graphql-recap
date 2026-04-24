import type { Job } from '../jobs/types.ts';

export type Company = {
  id: string;
  name: string;
  description?: string;
  jobs: Job[];
};
