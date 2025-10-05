const prisma = require("../lib/prisma");

function getAllTipoDatoItem() {
  return prisma.tipoDatoItem.findMany();
}

function getTipoDatoItemById(id) {
  return prisma.tipoDatoItem.findUnique({
    where: { id: Number(id) },
  });
}

function createTipoDatoItem(data) {
  return prisma.tipoDatoItem.create({
    data: {
      descripcion: data.descripcion,
      unidad: data.unidad,
    },
  });
}

function updateTipoDatoItem(id, data) {
  return prisma.tipoDatoItem.update({
    where: { id: Number(id) },
    data: {
      descripcion: data.descripcion,
      unidad: data.unidad,
    },
  });
}

function deleteTipoDatoItem(id) {
  return prisma.tipoDatoItem.delete({
    where: { id: Number(id) },
  });
}

module.exports = {
  getAllTipoDatoItem,
  getTipoDatoItemById,
  createTipoDatoItem,
  updateTipoDatoItem,
  deleteTipoDatoItem,
};
