import * as jobController from "../../../controllers/jobController.js";
import { findCompanyById } from "../../../models/companyModel.js";
import type { GraphQLContext } from "../../index.js";

export const jobResolver = {
  Query: {
    jobs: () => jobController.getJobs(),
    job: (_: unknown, { id }: { id: string }) => jobController.getJobById(id),
  },
  Mutation: {
    createJob: (
      _: unknown,
      { input }: { input: { title: string; description?: string; companyId: string } },
      context: GraphQLContext,
    ) => jobController.createJob(input.title, input.description, input.companyId, context.userId, context.companyId),
    deleteJob: (
      _: unknown,
      { id }: { id: string },
      context: GraphQLContext,
    ) => jobController.deleteJob(id, context.userId, context.companyId),
    updateJob: (
      _: unknown,
      { id, input }: { id: string; input: { title?: string; description?: string } },
      context: GraphQLContext,
    ) => jobController.updateJob(id, input, context.userId, context.companyId),
  },
  Job: {
    date: (job: { date: Date }) => job.date.toISOString(),
    company: (job: { companyId: string; company?: unknown }) =>
      job.company ?? findCompanyById(job.companyId),
  },
};
