const prisma = require("../lib/prisma");

function getAllItemsObservables() {
  return prisma.itemObservable.findMany({
    include: {
      kpi: true,
      proyecto: true,
      mes: true,
    },
  });
}

function getItemObservableById(id) {
  return prisma.itemObservable.findUnique({
    where: { id: Number(id) },
    include: {
      kpi: true,
      proyecto: true,
      mes: true,
    },
  });
}

function createItemObservable(data) {
  return prisma.itemObservable.create({
    data: {
      idKpi: Number(data.idKpi),
      idProyecto: Number(data.idProyecto),
      descripcion: data.descripcion || null,
      idMes: Number(data.idMes),
      year: Number(data.year),
    },
  });
}

function updateItemObservable(id, data) {
  return prisma.itemObservable.update({
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

function deleteItemObservable(id) {
  return prisma.itemObservable.delete({
    where: { id: Number(id) },
  });
}

module.exports = {
  getAllItemsObservables,
  getItemObservableById,
  createItemObservable,
  updateItemObservable,
  deleteItemObservable,
};
