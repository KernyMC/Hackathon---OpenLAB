const prisma = require("../lib/prisma");

// Obtener todos los tipos de usuario
function getAllTipoUsuario() {
  return prisma.tipoUsuario.findMany();
}

// Obtener por id
function getTipoUsuarioById(id) {
  return prisma.tipoUsuario.findUnique({
    where: { id: Number(id) },
  });
}

// Crear nuevo tipo de usuario
function createTipoUsuario(descripcion) {
  return prisma.tipoUsuario.create({
    data: { descripcion },
  });
}

// Eliminar tipo de usuario
function deleteTipoUsuario(id) {
  return prisma.tipoUsuario.delete({
    where: { id: Number(id) },
  });
}

module.exports = {
  getAllTipoUsuario,
  getTipoUsuarioById,
  createTipoUsuario,
  deleteTipoUsuario,
};
