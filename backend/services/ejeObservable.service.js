const prisma = require("../lib/prisma");

// Obtener todos los ejes observables
function getAllEjesObservables() {
  return prisma.ejeObservable.findMany({
    include: {
      proyecto: true,
      kpisObservables: true,
    },
  });
}

// Obtener eje observable por ID
function getEjeObservableById(id) {
  return prisma.ejeObservable.findUnique({
    where: { id: Number(id) },
    include: {
      proyecto: true,
      kpisObservables: true,
    },
  });
}

// Crear eje observable
function createEjeObservable(nombre, idProyecto) {
  return prisma.ejeObservable.create({
    data: {
      nombre: nombre,
      idProyecto: Number(idProyecto),
    },
  });
}

// Actualizar eje observable
function updateEjeObservable(id, data) {
  return prisma.ejeObservable.update({
    where: { id: Number(id) },
    data: data,
  });
}

// Eliminar eje observable
function deleteEjeObservable(id) {
  return prisma.ejeObservable.delete({
    where: { id: Number(id) },
  });
}

module.exports = {
  getAllEjesObservables,
  getEjeObservableById,
  createEjeObservable,
  updateEjeObservable,
  deleteEjeObservable,
};
