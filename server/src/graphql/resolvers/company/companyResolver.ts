import * as companyController from "../../../controllers/companyController.js";
import * as jobController from "../../../controllers/jobController.js";

export const companyResolver = {
  Query: {
    companies: () => companyController.getCompanies(),
    company: (_: unknown, { id }: { id: string }) =>
      companyController.getCompanyById(id),
  },
  Company: {
    jobs: (company: { id: string; jobs?: unknown[] }) =>
      company.jobs ?? jobController.getJobsByCompanyId(company.id),
  },
};
