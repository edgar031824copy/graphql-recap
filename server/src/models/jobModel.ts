import prisma from '../lib/prisma.js';

export const findJobs = () =>
  prisma.job.findMany({ orderBy: { date: 'desc' }, include: { company: true } });

export const findJobById = (id: string) =>
  prisma.job.findUnique({ where: { id }, include: { company: true } });

export const findJobsByCompanyId = (companyId: string) =>
  prisma.job.findMany({
    where: { companyId },
    orderBy: { date: 'desc' },
    include: { company: true },
  });

export const insertJob = (title: string, description: string | undefined, companyId: string) =>
  prisma.job.create({ data: { title, description, companyId }, include: { company: true } });

export const removeJob = (id: string) =>
  prisma.job.delete({ where: { id } });

export const patchJob = (id: string, data: { title?: string; description?: string }) =>
  prisma.job.update({ where: { id }, data, include: { company: true } });
