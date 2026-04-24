import { GraphQLError } from 'graphql';
import * as companyModel from '../models/companyModel.js';

export const getCompanyById = async (id: string) => {
  const company = await companyModel.findCompanyById(id);
  if (!company) throw new GraphQLError('Company not found', { extensions: { code: 'NOT_FOUND' } });
  return company;
};

export const getCompanies = () => companyModel.findCompanies();
