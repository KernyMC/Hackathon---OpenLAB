const prisma = require("../lib/prisma");

// Obtener todos los ejes
function getAllEjes() {
  return prisma.eje.findMany({
    include: {
      proyecto: true,
      kpis: true,
    },
  });
}

// Obtener eje por ID
function getEjeById(id) {
  return prisma.eje.findUnique({
    where: { id: Number(id) },
    include: { proyecto: true, kpis: true },
  });
}

// Crear eje
function createEje(nombre, idProyecto) {
  return prisma.eje.create({
    data: {
      nombre: nombre,
      idProyecto: Number(idProyecto),
    },
  });
}

// Actualizar eje
function updateEje(id, data) {
  return prisma.eje.update({
    where: { id: Number(id) },
    data: data,
  });
}

// Eliminar eje
function deleteEje(id) {
  return prisma.eje.delete({
    where: { id: Number(id) },
  });
}

module.exports = {
  getAllEjes,
  getEjeById,
  createEje,
  updateEje,
  deleteEje,
};
