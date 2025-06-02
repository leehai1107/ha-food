import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  try {
    // Create roles
    console.log('Creating roles...');
    const adminRole = await prisma.role.upsert({
      where: { name: 'admin' },
      update: {},
      create: { name: 'admin' },
    });

    const userRole = await prisma.role.upsert({
      where: { name: 'user' },
      update: {},
      create: { name: 'user' },
    });

    console.log('Roles created successfully');

    // Create admin account
    console.log('Creating admin account...');
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    const adminAccount = await prisma.account.upsert({
      where: { email: 'admin@hafood.vn' },
      update: {},
      create: {
        name: 'Admin',
        email: 'admin@hafood.vn',
        passwordHash: hashedPassword,
        roleId: adminRole.id,
      },
    });

    console.log('Admin account created successfully');
    console.log('Email:', adminAccount.email);
    console.log('Password: admin123');

  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
