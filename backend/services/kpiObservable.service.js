const prisma = require("../lib/prisma");

// Obtener todos los KPI observables
function getAllKpiObservables() {
  return prisma.kPIObservable.findMany({
    include: {
      eje: true,
      itemsObservables: true,
    },
  });
}

// Obtener KPI observable por ID
function getKpiObservableById(id) {
  return prisma.kPIObservable.findUnique({
    where: { id: Number(id) },
    include: {
      eje: true,
      itemsObservables: true,
    },
  });
}

// Crear KPI observable
function createKpiObservable(nombre, idEje) {
  return prisma.kPIObservable.create({
    data: {
      nombre: nombre,
      idEje: Number(idEje),
    },
  });
}

// Actualizar KPI observable
function updateKpiObservable(id, data) {
  return prisma.kPIObservable.update({
    where: { id: Number(id) },
    data: data,
  });
}

// Eliminar KPI observable
function deleteKpiObservable(id) {
  return prisma.kPIObservable.delete({
    where: { id: Number(id) },
  });
}

module.exports = {
  getAllKpiObservables,
  getKpiObservableById,
  createKpiObservable,
  updateKpiObservable,
  deleteKpiObservable,
};
