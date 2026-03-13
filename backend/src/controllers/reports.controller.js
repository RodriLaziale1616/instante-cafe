const prisma = require('../lib/prisma');

function buildFechaOperativaFilter(req) {
  const fechaInicio = req.query.fechaInicio || req.query.from;
  const fechaFin = req.query.fechaFin || req.query.to;

  if (!fechaInicio && !fechaFin) return undefined;

  const filter = {};
  if (fechaInicio) filter.gte = fechaInicio;
  if (fechaFin) filter.lte = fechaFin;

  return filter;
}

exports.orders = async (req, res) => {
  try {
    const fechaOperativa = buildFechaOperativaFilter(req);

    const where = { estado: 'cerrado' };
    if (fechaOperativa) where.fechaOperativa = fechaOperativa;

    const orders = await prisma.pedido.findMany({
      where,
      include: { usuario: true },
      orderBy: { fechaHoraCierre: 'desc' },
    });

    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'No se pudieron cargar las comandas' });
  }
};

exports.topProducts = async (req, res) => {
  try {
    const fechaOperativa = buildFechaOperativaFilter(req);

    const wherePedido = { estado: 'cerrado' };
    if (fechaOperativa) wherePedido.fechaOperativa = fechaOperativa;

    const items = await prisma.pedidoItem.findMany({
      where: { pedido: wherePedido },
      include: { pedido: true },
    });

    const map = new Map();

    for (const item of items) {
      const prev = map.get(item.nombreSnapshot) || {
        nombre: item.nombreSnapshot,
        cantidad: 0,
      };
      prev.cantidad += item.cantidad;
      map.set(item.nombreSnapshot, prev);
    }

    const result = [...map.values()].sort((a, b) => b.cantidad - a.cantidad);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'No se pudieron cargar los productos más vendidos' });
  }
};