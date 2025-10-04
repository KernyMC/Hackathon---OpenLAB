const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando seed de la base de datos...');

  try {
    // Limpiar datos existentes (en orden inverso por las foreign keys)
    console.log('Limpiando datos existentes...');
    await prisma.session.deleteMany();
    await prisma.itemObservable.deleteMany();
    await prisma.item.deleteMany();
    await prisma.kPIObservable.deleteMany();
    await prisma.kPI.deleteMany();
    await prisma.ejeObservable.deleteMany();
    await prisma.eje.deleteMany();
    await prisma.proyecto.deleteMany();
    await prisma.usuarioOng.deleteMany();
    await prisma.usuario.deleteMany();
    await prisma.oNG.deleteMany();
    await prisma.tipoDatoItem.deleteMany();
    await prisma.tipoUsuario.deleteMany();

    // Crear tipos de usuario
    console.log('Creando tipos de usuario...');
    const tipoAdmin = await prisma.tipoUsuario.create({
      data: { descripcion: 'Administrador' }
    });
    const tipoUsuario = await prisma.tipoUsuario.create({
      data: { descripcion: 'Usuario Regular' }
    });
    const tipoONG = await prisma.tipoUsuario.create({
      data: { descripcion: 'Representante ONG' }
    });

    // Crear tipos de datos para items
    console.log('Creando tipos de datos...');
    const tipoTexto = await prisma.tipoDatoItem.create({
      data: { descripcion: 'Texto' }
    });
    const tipoNumero = await prisma.tipoDatoItem.create({
      data: { descripcion: 'Número' }
    });
    const tipoFecha = await prisma.tipoDatoItem.create({
      data: { descripcion: 'Fecha' }
    });
    const tipoPorcentaje = await prisma.tipoDatoItem.create({
      data: { descripcion: 'Porcentaje' }
    });
    const tipoBooleano = await prisma.tipoDatoItem.create({
      data: { descripcion: 'Sí/No' }
    });

    // Crear usuarios
    console.log('Creando usuarios...');
    const hashedPassword = await bcrypt.hash('password', 12);
    
    const admin = await prisma.usuario.create({
      data: {
        nombres: 'Admin',
        apellidos: 'Hackathon',
        email: 'admin@hackathon.com',
        password: hashedPassword,
        cedula: '12345678',
        idTipoUsuario: tipoAdmin.id
      }
    });

    const usuario1 = await prisma.usuario.create({
      data: {
        nombres: 'Juan',
        apellidos: 'Pérez',
        email: 'juan.perez@email.com',
        password: hashedPassword,
        cedula: '87654321',
        idTipoUsuario: tipoUsuario.id
      }
    });

    const usuario2 = await prisma.usuario.create({
      data: {
        nombres: 'María',
        apellidos: 'González',
        email: 'maria.gonzalez@email.com',
        password: hashedPassword,
        cedula: '11223344',
        idTipoUsuario: tipoONG.id
      }
    });

    // Crear ONGs
    console.log('Creando ONGs...');
    const ong1 = await prisma.oNG.create({
      data: {
        nombre: 'Fundación Ayuda Social',
        descripcion: 'ONG dedicada a ayudar a comunidades vulnerables'
      }
    });

    const ong2 = await prisma.oNG.create({
      data: {
        nombre: 'Proyecto Verde',
        descripcion: 'Organización enfocada en la conservación del medio ambiente'
      }
    });

    // Asociar usuarios a ONGs
    console.log('Asociando usuarios a ONGs...');
    await prisma.usuarioOng.create({
      data: {
        idUsuario: usuario2.id,
        idOng: ong1.id
      }
    });

    // Crear proyectos
    console.log('Creando proyectos...');
    const proyecto1 = await prisma.proyecto.create({
      data: {
        nombre: 'Programa de Alimentación Infantil',
        descripcion: 'Proyecto para mejorar la nutrición de niños en comunidades rurales',
        idOng: ong1.id
      }
    });

    const proyecto2 = await prisma.proyecto.create({
      data: {
        nombre: 'Reforestación Urbana',
        descripcion: 'Iniciativa para plantar árboles en espacios urbanos',
        idOng: ong2.id
      }
    });

    // Crear ejes
    console.log('Creando ejes...');
    const eje1 = await prisma.eje.create({
      data: {
        nombre: 'Impacto Social',
        idProyecto: proyecto1.id
      }
    });

    const eje2 = await prisma.eje.create({
      data: {
        nombre: 'Sostenibilidad',
        idProyecto: proyecto1.id
      }
    });

    const eje3 = await prisma.eje.create({
      data: {
        nombre: 'Cobertura Geográfica',
        idProyecto: proyecto2.id
      }
    });

    // Crear KPIs
    console.log('Creando KPIs...');
    const kpi1 = await prisma.kPI.create({
      data: {
        nombre: 'Número de niños beneficiados',
        idEje: eje1.id
      }
    });

    const kpi2 = await prisma.kPI.create({
      data: {
        nombre: 'Porcentaje de mejora nutricional',
        idEje: eje1.id
      }
    });

    const kpi3 = await prisma.kPI.create({
      data: {
        nombre: 'Área reforestada (m²)',
        idEje: eje3.id
      }
    });

    // Crear items
    console.log('Creando items...');
    await prisma.item.create({
      data: {
        idKpi: kpi1.id,
        idProyecto: proyecto1.id,
        descripcion: 'Cantidad total de niños que reciben alimentación diaria',
        idTipoDatoItem: tipoNumero.id
      }
    });

    await prisma.item.create({
      data: {
        idKpi: kpi2.id,
        idProyecto: proyecto1.id,
        descripcion: 'Mejora en el índice de masa corporal de los beneficiarios',
        idTipoDatoItem: tipoPorcentaje.id
      }
    });

    await prisma.item.create({
      data: {
        idKpi: kpi3.id,
        idProyecto: proyecto2.id,
        descripcion: 'Superficie total plantada con árboles nativos',
        idTipoDatoItem: tipoNumero.id
      }
    });

    // Crear ejes observables
    console.log('Creando ejes observables...');
    const ejeObservable1 = await prisma.ejeObservable.create({
      data: {
        nombre: 'Indicadores de Calidad',
        idProyecto: proyecto1.id
      }
    });

    // Crear KPIs observables
    console.log('Creando KPIs observables...');
    const kpiObservable1 = await prisma.kPIObservable.create({
      data: {
        nombre: 'Satisfacción de beneficiarios',
        idEje: ejeObservable1.id
      }
    });

    // Crear items observables
    console.log('Creando items observables...');
    await prisma.itemObservable.create({
      data: {
        idKpi: kpiObservable1.id,
        idProyecto: proyecto1.id,
        descripcion: 'Nivel de satisfacción reportado por las familias',
        idTipoDatoItem: tipoPorcentaje.id
      }
    });

    console.log('Seed completado exitosamente');
    console.log('Usuarios creados:');
    console.log('- Admin: admin@hackathon.com / password');
    console.log('- Usuario: juan.perez@email.com / password');
    console.log('- ONG: maria.gonzalez@email.com / password');

  } catch (error) {
    console.error('Error durante el seed:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error('Error en seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
