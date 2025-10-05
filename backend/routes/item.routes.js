// routes/item.routes.js
const express = require("express");
const router = express.Router();
const itemService = require("../services/item.service");

// GET todos los items
router.get("/", async (req, res) => {
  try {
    const { idProyecto, mes, year } = req.query;

    const where = {};
    if (idProyecto) where.idProyecto = parseInt(idProyecto);
    if (mes) where.idMes = parseInt(mes);
    if (year) where.year = parseInt(year);

    const items = await prisma.item.findMany({
      where,
      include: {
        kpi: true,
        proyecto: true,
        mes: true,
      },
      orderBy: {
        year: "desc",
      },
    });

    res.json(items);
  } catch (error) {
    console.error("Error fetching items:", error);
    res.status(500).json({ error: "Error al obtener items" });
  }
});

// GET item por ID
router.get("/:id", async (req, res) => {
  try {
    const item = await itemService.getItemById(req.params.id);
    if (!item) return res.status(404).json({ message: "Item no encontrado" });
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST crear item
router.post("/", async (req, res) => {
  try {
    const { idKpi, idProyecto, descripcion, idMes, year } = req.body;
    if (!idKpi || !idProyecto || !idMes || !year) {
      return res.status(400).json({ message: "Faltan campos requeridos" });
    }

    const nuevoItem = await itemService.createItem({
      idKpi,
      idProyecto,
      descripcion,
      idMes,
      year,
    });
    res.status(201).json(nuevoItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT actualizar item
router.put("/:id", async (req, res) => {
  try {
    const itemActualizado = await itemService.updateItem(
      req.params.id,
      req.body
    );
    res.json(itemActualizado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE item
router.delete("/:id", async (req, res) => {
  try {
    await itemService.deleteItem(req.params.id);
    res.json({ message: "Item eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
