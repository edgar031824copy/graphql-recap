import { GraphQLError } from "graphql";
import * as jobModel from "../models/jobModel.js";
import { findCompanyById } from "../models/companyModel.js";

function requireAuth(userId: string | null): asserts userId is string {
  if (!userId)
    throw new GraphQLError("Not authenticated", {
      extensions: { code: "UNAUTHENTICATED" },
    });
}

function requireOwnership(jobCompanyId: string, userCompanyId: string) {
  if (jobCompanyId !== userCompanyId)
    throw new GraphQLError("You can only manage jobs from your own company", {
      extensions: { code: "FORBIDDEN" },
    });
}

export const getJobs = () => jobModel.findJobs();

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
  userCompanyId: string | null,
) => {
  requireAuth(userId);
  requireOwnership(companyId, userCompanyId!);
  const company = await findCompanyById(companyId);
  if (!company)
    throw new GraphQLError("Company not found", {
      extensions: { code: "NOT_FOUND" },
    });
  return jobModel.insertJob(title, description, companyId);
};

export const deleteJob = async (id: string, userId: string | null, userCompanyId: string | null) => {
  requireAuth(userId);
  const job = await jobModel.findJobById(id);
  if (!job)
    throw new GraphQLError("Job not found", {
      extensions: { code: "NOT_FOUND" },
    });
  requireOwnership(job.companyId, userCompanyId!);
  return jobModel.removeJob(id);
};

export const updateJob = async (
  id: string,
  data: { title?: string; description?: string },
  userId: string | null,
  userCompanyId: string | null,
) => {
  requireAuth(userId);
  const job = await jobModel.findJobById(id);
  if (!job)
    throw new GraphQLError("Job not found", {
      extensions: { code: "NOT_FOUND" },
    });
  requireOwnership(job.companyId, userCompanyId!);
  return jobModel.patchJob(id, data);
};
