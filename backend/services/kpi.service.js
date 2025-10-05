const prisma = require("../lib/prisma");

// Obtener todos los KPIs
function getAllKpis() {
  return prisma.kPI.findMany({
    include: {
      eje: true,
      items: true,
    },
  });
}

// Obtener KPI por ID
function getKpiById(id) {
  return prisma.kPI.findUnique({
    where: { id: Number(id) },
    include: { eje: true, items: true, tipoDatoItem: true },
  });
}

// Crear KPI
function createKpi(nombre, idEje, idTipoDatoItem) {
  return prisma.kPI.create({
    data: {
      nombre: nombre,
      idEje: Number(idEje),
      idTipoDatoItem: Number(idTipoDatoItem),
    },
  });
}

// Actualizar KPI
function updateKpi(id, data) {
  return prisma.kPI.update({
    where: { id: Number(id) },
    data: data,
  });
}

// Eliminar KPI
function deleteKpi(id) {
  return prisma.kPI.delete({
    where: { id: Number(id) },
  });
}

module.exports = {
  getAllKpis,
  getKpiById,
  createKpi,
  updateKpi,
  deleteKpi,
};
