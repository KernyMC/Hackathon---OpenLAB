const prisma = require("../lib/prisma");

// Obtener todas las relaciones usuario-ONG
function getAllUsuarioOng() {
  return prisma.usuarioOng.findMany({
    include: {
      usuario: true,
      ong: true,
    },
  });
}

// Obtener por ID
function getUsuarioOngById(id) {
  return prisma.usuarioOng.findUnique({
    where: { id: Number(id) },
    include: { usuario: true, ong: true },
  });
}

// Crear nueva relación
function createUsuarioOng(idUsuario, idOng) {
  return prisma.usuarioOng.create({
    data: { idUsuario: Number(idUsuario), idOng: Number(idOng) },
  });
}

// Eliminar relación
function deleteUsuarioOng(id) {
  return prisma.usuarioOng.delete({
    where: { id: Number(id) },
  });
}

module.exports = {
  getAllUsuarioOng,
  getUsuarioOngById,
  createUsuarioOng,
  deleteUsuarioOng,
};
