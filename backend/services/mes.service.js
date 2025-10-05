const prisma = require("../lib/prisma");

function getAllMes() {
  return prisma.mes.findMany();
}

function getMesById(id) {
  return prisma.mes.findUnique({
    where: { id: Number(id) },
  });
}

function createMes(data) {
  // data should contain { id, descripcion } because id no es autoincrement en tu schema
  return prisma.mes.create({
    data: {
      id: Number(data.id),
      descripcion: data.descripcion,
    },
  });
}

function updateMes(id, data) {
  return prisma.mes.update({
    where: { id: Number(id) },
    data: {
      descripcion: data.descripcion,
    },
  });
}

function deleteMes(id) {
  return prisma.mes.delete({
    where: { id: Number(id) },
  });
}

module.exports = {
  getAllMes,
  getMesById,
  createMes,
  updateMes,
  deleteMes,
};
