const prisma = require('../lib/prisma');

function buildFechaFilter(req) {
  const fechaInicio = req.query.fechaInicio;
  const fechaFin = req.query.fechaFin;

  if (!fechaInicio && !fechaFin) return undefined;

  const filter = {};
  if (fechaInicio) filter.gte = fechaInicio;
  if (fechaFin) filter.lte = fechaFin;

  return filter;
}

exports.list = async (req, res) => {
  try {
    const fechaFilter = buildFechaFilter(req);

    const where = {};
    if (fechaFilter) where.fecha = fechaFilter;

    const expenses = await prisma.expense.findMany({
      where,
      include: { usuario: true },
      orderBy: [{ fecha: 'desc' }, { createdAt: 'desc' }],
    });

    res.json(expenses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'No se pudieron cargar los gastos' });
  }
};

exports.create = async (req, res) => {
  try {
    const { fecha, tipo, descripcion, monto } = req.body;

    if (!fecha || !tipo || !monto) {
      return res.status(400).json({
        message: 'Fecha, tipo y monto son obligatorios',
      });
    }

    const expense = await prisma.expense.create({
      data: {
        fecha,
        tipo,
        descripcion: descripcion || '',
        monto: Number(monto),
        usuarioId: req.user.id,
      },
      include: { usuario: true },
    });

    res.status(201).json(expense);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'No se pudo guardar el gasto' });
  }
};

exports.summary = async (req, res) => {
  try {
    const fechaFilter = buildFechaFilter(req);

    const where = {};
    if (fechaFilter) where.fecha = fechaFilter;

    const expenses = await prisma.expense.findMany({ where });

    const summary = {
      total: 0,
      insumos: 0,
      costos_fijos: 0,
      salario: 0,
      otros: 0,
    };

    for (const item of expenses) {
      const monto = Number(item.monto || 0);
      summary.total += monto;

      if (item.tipo === 'insumos') summary.insumos += monto;
      else if (item.tipo === 'costos_fijos') summary.costos_fijos += monto;
      else if (item.tipo === 'salario') summary.salario += monto;
      else summary.otros += monto;
    }

    res.json(summary);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'No se pudo cargar el resumen de gastos' });
  }
};
