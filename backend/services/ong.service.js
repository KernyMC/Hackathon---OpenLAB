const prisma = require("../lib/prisma");

// Obtener todas las ONGs
function getAllONG() {
  return prisma.oNG.findMany(); // ojo que Prisma mantiene la capitalización que pusiste en @@map
}

// Obtener ONG por ID
function getONGById(id) {
  return prisma.oNG.findUnique({
    where: { id: Number(id) },
  });
}

// Crear nueva ONG
function createONG(nombre, descripcion) {
  return prisma.oNG.create({
    data: { nombre, descripcion },
  });
}

// Actualizar ONG
function updateONG(id, nombre, descripcion) {
  return prisma.oNG.update({
    where: { id: Number(id) },
    data: { nombre, descripcion },
  });
}

// Eliminar ONG
function deleteONG(id) {
  return prisma.oNG.delete({
    where: { id: Number(id) },
  });
}

module.exports = {
  getAllONG,
  getONGById,
  createONG,
  updateONG,
  deleteONG,
};
