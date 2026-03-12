const prisma = require('../lib/prisma');

exports.list = async (_req, res) => {
  const products = await prisma.product.findMany({
    where: { activo: true },
    orderBy: [{ categoria: 'asc' }, { nombre: 'asc' }],
  });

  const comboIds = products.filter((p) => p.tipo === 'combo').map((p) => p.id);
  const comboItems = comboIds.length
    ? await prisma.comboItem.findMany({
        where: { comboId: { in: comboIds } },
      })
    : [];

  const productMap = new Map(products.map((p) => [p.id, p]));

  const response = products.map((product) => {
    if (product.tipo !== 'combo') return product;

    const components = comboItems
      .filter((ci) => ci.comboId === product.id)
      .map((ci) => ({
        productoId: ci.productoId,
        nombre: productMap.get(ci.productoId)?.nombre || `Producto ${ci.productoId}`,
        cantidad: ci.cantidad,
      }));

    return { ...product, components };
  });

  res.json(response);
};

exports.create = async (req, res) => {
  try {
    const { nombre, categoria, precio, tipo = 'simple', activo = true } = req.body;

    if (!nombre?.trim()) {
      return res.status(400).json({ message: 'El nombre es obligatorio' });
    }

    if (!categoria?.trim()) {
      return res.status(400).json({ message: 'La categoría es obligatoria' });
    }

    const parsedPrice = Number(precio);
    if (!parsedPrice || parsedPrice <= 0) {
      return res.status(400).json({ message: 'El precio debe ser mayor a 0' });
    }

    const codigoBase = nombre
      .trim()
      .toUpperCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^A-Z0-9]+/g, '_')
      .replace(/^_+|_+$/g, '')
      .slice(0, 20) || 'PRODUCTO';

    let codigo = codigoBase;
    let counter = 1;

    while (await prisma.product.findUnique({ where: { codigo } })) {
      codigo = `${codigoBase}_${counter}`;
      counter += 1;
    }

    const product = await prisma.product.create({
      data: {
        codigo,
        nombre: nombre.trim(),
        categoria: categoria.trim(),
        precio: parsedPrice,
        tipo,
        activo: Boolean(activo),
      },
    });

    res.status(201).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'No se pudo crear el producto' });
  }
};

exports.update = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { nombre, categoria, precio, tipo = 'simple', activo = true } = req.body;

    if (!id) {
      return res.status(400).json({ message: 'ID inválido' });
    }

    if (!nombre?.trim()) {
      return res.status(400).json({ message: 'El nombre es obligatorio' });
    }

    if (!categoria?.trim()) {
      return res.status(400).json({ message: 'La categoría es obligatoria' });
    }

    const parsedPrice = Number(precio);
    if (!parsedPrice || parsedPrice <= 0) {
      return res.status(400).json({ message: 'El precio debe ser mayor a 0' });
    }

    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    const product = await prisma.product.update({
      where: { id },
      data: {
        nombre: nombre.trim(),
        categoria: categoria.trim(),
        precio: parsedPrice,
        tipo,
        activo: Boolean(activo),
      },
    });

    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'No se pudo actualizar el producto' });
  }
};