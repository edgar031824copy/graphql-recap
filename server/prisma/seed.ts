import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.user.deleteMany();
  await prisma.job.deleteMany();
  await prisma.company.deleteMany();

  const companies = await Promise.all([
    prisma.company.create({ data: { name: 'Acme Corp', description: 'Building tomorrow\'s tools today.' } }),
    prisma.company.create({ data: { name: 'Globex', description: 'Industrial solutions at scale.' } }),
    prisma.company.create({ data: { name: 'Initech', description: 'Enterprise software done right.' } }),
    prisma.company.create({ data: { name: 'Umbrella Inc', description: 'Research and development for a safer world.' } }),
    prisma.company.create({ data: { name: 'Hooli', description: 'Making the world a better place.' } }),
    prisma.company.create({ data: { name: 'Pied Piper', description: 'Compression algorithms that change everything.' } }),
    prisma.company.create({ data: { name: 'Dunder Mifflin', description: 'Paper company with heart.' } }),
    prisma.company.create({ data: { name: 'Stark Industries', description: 'Powering the future with clean energy.' } }),
    prisma.company.create({ data: { name: 'Wayne Enterprises', description: 'Diversified global conglomerate.' } }),
    prisma.company.create({ data: { name: 'Oscorp', description: 'Pioneering biotech research.' } }),
  ]);

  await prisma.user.create({
    data: {
      email: 'edgar031824@gmail.com',
      password: '12345',
      companyId: companies[0].id,
    },
  });

  console.log('Seed complete');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
