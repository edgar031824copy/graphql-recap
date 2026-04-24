import { GraphQLError } from "graphql";
import * as jobModel from "../models/jobModel.js";
import { findCompanyById } from "../models/companyModel.js";

// TypeScript assertion helper: narrows `userId` to `string` or throws UNAUTHENTICATED.
// Using `asserts` means TS knows userId is a non-null string after this call.
function requireAuth(userId: string | null): asserts userId is string {
  if (!userId)
    throw new GraphQLError("Not authenticated", {
      extensions: { code: "UNAUTHENTICATED" },
    });
}

export const getJobs = () => {
  return jobModel.findJobs();
};

export const getJobById = async (id: string) => {
  const job = await jobModel.findJobById(id);
  if (!job)
    throw new GraphQLError("Job not found", {
      extensions: { code: "NOT_FOUND" },
    });
  return job;
};

export const getJobsByCompanyId = (companyId: string) =>
  jobModel.findJobsByCompanyId(companyId);

export const createJob = async (
  title: string,
  description: string | undefined,
  companyId: string,
  userId: string | null,
) => {
  requireAuth(userId);
  const company = await findCompanyById(companyId);
  if (!company)
    throw new GraphQLError("Company not found", {
      extensions: { code: "NOT_FOUND" },
    });
  return jobModel.insertJob(title, description, companyId);
};

export const deleteJob = async (id: string, userId: string | null) => {
  requireAuth(userId);
  const job = await jobModel.findJobById(id);
  if (!job)
    throw new GraphQLError("Job not found", {
      extensions: { code: "NOT_FOUND" },
    });
  return jobModel.removeJob(id);
};

export const updateJob = async (
  id: string,
  data: { title?: string; description?: string },
  userId: string | null,
) => {
  requireAuth(userId);
  const job = await jobModel.findJobById(id);
  if (!job)
    throw new GraphQLError("Job not found", {
      extensions: { code: "NOT_FOUND" },
    });
  return jobModel.patchJob(id, data);
};
