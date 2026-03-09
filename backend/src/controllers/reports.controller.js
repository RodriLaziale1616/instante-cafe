const prisma = require('../lib/prisma');

exports.orders = async (req, res) => {
  const { from, to } = req.query;
  const where = { estado: 'cerrado' };
  if (from || to) {
    where.fechaOperativa = {};
    if (from) where.fechaOperativa.gte = from;
    if (to) where.fechaOperativa.lte = to;
  }
  const orders = await prisma.pedido.findMany({
    where,
    include: { usuario: true },
    orderBy: { fechaHoraCierre: 'desc' },
  });
  res.json(orders);
};

exports.topProducts = async (req, res) => {
  const { from, to } = req.query;
  const wherePedido = { estado: 'cerrado' };
  if (from || to) {
    wherePedido.fechaOperativa = {};
    if (from) wherePedido.fechaOperativa.gte = from;
    if (to) wherePedido.fechaOperativa.lte = to;
  }

  const components = await prisma.pedidoItemComponente.findMany({
    where: { pedidoItem: { pedido: wherePedido } },
    include: { pedidoItem: { include: { pedido: true } } },
  });

  const map = new Map();
  for (const c of components) {
    const prev = map.get(c.nombreSnapshot) || { nombre: c.nombreSnapshot, cantidad: 0 };
    prev.cantidad += c.cantidad;
    map.set(c.nombreSnapshot, prev);
  }
  const result = [...map.values()].sort((a, b) => b.cantidad - a.cantidad);
  res.json(result);
};
