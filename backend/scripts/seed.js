const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando seed de la base de datos...');

  // Verificar si ya existe el usuario admin
  const existingAdmin = await prisma.user.findUnique({
    where: { email: 'admin@hackathon.com' }
  });

  if (existingAdmin) {
    console.log('Usuario admin ya existe');
    return;
  }

  // Crear usuario admin
  const hashedPassword = await bcrypt.hash('password', 12);
  
  const admin = await prisma.user.create({
    data: {
      email: 'admin@hackathon.com',
      password: hashedPassword,
      name: 'Admin Hackathon',
      role: 'admin'
    }
  });

  console.log('Usuario admin creado:', {
    id: admin.id,
    email: admin.email,
    name: admin.name,
    role: admin.role
  });

  console.log('Seed completado exitosamente');
}

main()
  .catch((e) => {
    console.error('Error en seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
