const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create default super admin
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  const superAdmin = await prisma.user.upsert({
    where: { email: 'superadmin@saloncrm.com' },
    update: {},
    create: {
      email: 'superadmin@saloncrm.com',
      name: 'Super Admin',
      role: 'SUPER_ADMIN',
      password: hashedPassword,
      apiKey: 'super-admin-api-key-change-in-production',
    },
  });

  // Create a sample salon
  const salon = await prisma.salon.upsert({
    where: { id: 'sample-salon-id' },
    update: {},
    create: {
      id: 'sample-salon-id',
      name: 'Beauty Paradise Salon',
      address: '123 Beauty Street, City, State 12345',
      phone: '+1234567890',
      email: 'info@beautyparadise.com',
      description: 'Premium beauty salon offering comprehensive beauty services',
    },
  });

  // Create sample owner
  const ownerPassword = await bcrypt.hash('owner123', 10);
  const owner = await prisma.user.upsert({
    where: { email: 'owner@beautyparadise.com' },
    update: {},
    create: {
      email: 'owner@beautyparadise.com',
      name: 'John Owner',
      role: 'OWNER',
      password: ownerPassword,
      salonId: salon.id,
      apiKey: 'owner-api-key-change-in-production',
    },
  });

  // Create sample staff
  const staffPassword = await bcrypt.hash('staff123', 10);
  const staff = await prisma.user.upsert({
    where: { email: 'staff@beautyparadise.com' },
    update: {},
    create: {
      email: 'staff@beautyparadise.com',
      name: 'Jane Staff',
      role: 'STAFF',
      password: staffPassword,
      salonId: salon.id,
      apiKey: 'staff-api-key-change-in-production',
    },
  });

  // Create sample services
  const services = [
    {
      name: 'Haircut & Styling',
      description: 'Professional haircut and styling service',
      duration: 60,
      price: 50.00,
      salonId: salon.id,
    },
    {
      name: 'Hair Coloring',
      description: 'Professional hair coloring service',
      duration: 120,
      price: 120.00,
      salonId: salon.id,
    },
    {
      name: 'Facial Treatment',
      description: 'Rejuvenating facial treatment',
      duration: 90,
      price: 80.00,
      salonId: salon.id,
    },
    {
      name: 'Manicure',
      description: 'Professional nail care and styling',
      duration: 45,
      price: 35.00,
      salonId: salon.id,
    },
  ];

  for (const service of services) {
    await prisma.service.upsert({
      where: { 
        id: `${service.name.toLowerCase().replace(/\s+/g, '-')}-${salon.id}` 
      },
      update: {},
      create: {
        id: `${service.name.toLowerCase().replace(/\s+/g, '-')}-${salon.id}`,
        ...service,
      },
    });
  }

  // Create sample customer
  const customer = await prisma.customer.upsert({
    where: { 
      phone_salonId: {
        phone: '+1987654321',
        salonId: salon.id,
      }
    },
    update: {},
    create: {
      name: 'Alice Customer',
      phone: '+1987654321',
      email: 'alice@example.com',
      address: '456 Customer Lane, City, State 12345',
      salonId: salon.id,
    },
  });

  console.log('Database seeded successfully!');
  console.log('Default users created:');
  console.log('- Super Admin: superadmin@saloncrm.com / admin123');
  console.log('- Owner: owner@beautyparadise.com / owner123');
  console.log('- Staff: staff@beautyparadise.com / staff123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });