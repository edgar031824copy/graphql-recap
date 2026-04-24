import prisma from '../lib/prisma.js';

export const findCompanyById = (id: string) =>
  prisma.company.findUnique({ where: { id }, include: { jobs: true } });

export const findCompanies = () =>
  prisma.company.findMany({ include: { jobs: true } });
