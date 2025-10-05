const prisma = require("../lib/prisma");

function getAllItems() {
  return prisma.item.findMany({
    include: {
      proyecto: true,
      mes: true,
    },
  });
}

function getItemById(id) {
  return prisma.item.findUnique({
    where: { id: Number(id) },
    include: {
      kpi: true,
      proyecto: true,
      mes: true,
    },
  });
}

function createItem(data) {
  return prisma.item.create({
    data: {
      idKpi: Number(data.idKpi),
      idProyecto: Number(data.idProyecto),
      descripcion: data.descripcion || null,
      idMes: Number(data.idMes),
      year: Number(data.year),
    },
  });
}

function updateItem(id, data) {
  return prisma.item.update({
    where: { id: Number(id) },
    data: {
      idKpi: data.idKpi !== undefined ? Number(data.idKpi) : undefined,
      idProyecto:
        data.idProyecto !== undefined ? Number(data.idProyecto) : undefined,
      descripcion:
        data.descripcion !== undefined ? data.descripcion : undefined,
      idMes: data.idMes !== undefined ? Number(data.idMes) : undefined,
      year: data.year !== undefined ? Number(data.year) : undefined,
    },
  });
}

function deleteItem(id) {
  return prisma.item.delete({
    where: { id: Number(id) },
  });
}

module.exports = {
  getAllItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
};
