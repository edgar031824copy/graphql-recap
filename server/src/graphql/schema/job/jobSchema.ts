export const jobSchema = `#graphql
  "A job listing posted by a company."
  type Job {
    id: ID!
    title: String!
    description: String
    "ISO 8601 date string of when the job was posted."
    date: String!
    "The company that owns this job listing."
    company: Company!
  }

  "Input for creating a new job listing."
  input CreateJobInput {
    title: String!
    description: String
    "ID of the company posting this job."
    companyId: ID!
  }

  "Input for updating an existing job listing. All fields are optional."
  input UpdateJobInput {
    title: String
    description: String
  }

  extend type Query {
    "Returns all job listings, ordered by most recent."
    jobs: [Job!]!
    "Returns a single job by ID, or null if not found."
    job(id: ID!): Job
  }

  extend type Mutation {
    "Creates a new job listing for the given company."
    createJob(input: CreateJobInput!): Job!
    "Deletes a job by ID. Returns the deleted job, or null if not found."
    deleteJob(id: ID!): Job
    "Updates an existing job. Only provided fields are changed."
    updateJob(id: ID!, input: UpdateJobInput!): Job!
  }
`;
