const prisma = require('../lib/prisma');

exports.list = async (_req, res) => {
  const products = await prisma.product.findMany({ where: { activo: true }, orderBy: [{ categoria: 'asc' }, { nombre: 'asc' }] });
  const comboIds = products.filter(p => p.tipo === 'combo').map(p => p.id);
  const comboItems = comboIds.length ? await prisma.comboItem.findMany({ where: { comboId: { in: comboIds } } }) : [];
  const productMap = new Map(products.map(p => [p.id, p]));
  const response = products.map(product => {
    if (product.tipo !== 'combo') return product;
    const components = comboItems.filter(ci => ci.comboId === product.id).map(ci => ({
      productoId: ci.productoId,
      nombre: productMap.get(ci.productoId)?.nombre || `Producto ${ci.productoId}`,
      cantidad: ci.cantidad,
    }));
    return { ...product, components };
  });
  res.json(response);
};
