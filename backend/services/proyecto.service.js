const prisma = require("../lib/prisma");

// Obtener todos los proyectos
function getAllProyectos() {
  return prisma.proyecto.findMany({
    include: {
      ong: true,
    },
  });
}

// Obtener un proyecto por ID
function getProyectoById(id) {
  return prisma.proyecto.findUnique({
    where: { id: Number(id) },
    include: { ong: true },
  });
}

// Crear un nuevo proyecto
function createProyecto(nombre, descripcion, idOng) {
  return prisma.proyecto.create({
    data: {
      nombre: nombre,
      descripcion: descripcion,
      idOng: Number(idOng),
    },
  });
}

// Actualizar proyecto
function updateProyecto(id, data) {
  return prisma.proyecto.update({
    where: { id: Number(id) },
    data: data,
  });
}

// Eliminar proyecto
function deleteProyecto(id) {
  return prisma.proyecto.delete({
    where: { id: Number(id) },
  });
}

module.exports = {
  getAllProyectos,
  getProyectoById,
  createProyecto,
  updateProyecto,
  deleteProyecto,
};
