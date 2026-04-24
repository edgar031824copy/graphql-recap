import prisma from '../lib/prisma.js';

export const findUserByEmail = (email: string) =>
  prisma.user.findUnique({ where: { email } });
