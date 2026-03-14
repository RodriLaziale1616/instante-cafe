const ExcelJS = require('exceljs');
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

exports.excel = async (req, res) => {
  try {
    const fechaOperativa = buildFechaOperativaFilter(req);

    const where = { estado: 'cerrado' };
    if (fechaOperativa) where.fechaOperativa = fechaOperativa;

    const orders = await prisma.pedido.findMany({
      where,
      include: { usuario: true },
      orderBy: { fechaHoraCierre: 'desc' },
    });

    const items = await prisma.pedidoItem.findMany({
      where: { pedido: where },
      include: { pedido: true },
    });

    const productMap = new Map();
    for (const item of items) {
      const prev = productMap.get(item.nombreSnapshot) || {
        nombre: item.nombreSnapshot,
        cantidad: 0,
      };
      prev.cantidad += item.cantidad;
      productMap.set(item.nombreSnapshot, prev);
    }

    const topProducts = [...productMap.values()].sort((a, b) => b.cantidad - a.cantidad);

    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'Modo Café POS';
    workbook.created = new Date();

    // Hoja 1: Comandas
    const sheetOrders = workbook.addWorksheet('Comandas');

    sheetOrders.columns = [
      { header: 'Comanda', key: 'comanda', width: 20 },
      { header: 'Cliente', key: 'cliente', width: 22 },
      { header: 'Usuario', key: 'usuario', width: 18 },
      { header: 'Total', key: 'total', width: 14 },
      { header: 'Efectivo', key: 'efectivo', width: 14 },
      { header: 'Tarjeta', key: 'tarjeta', width: 14 },
      { header: 'Fecha cierre', key: 'fechaHoraCierre', width: 24 },
    ];

    orders.forEach((order) => {
      sheetOrders.addRow({
        comanda: order.codigoPedido || order.id,
        cliente: order.customerLabel || '-',
        usuario: order.usuario?.nombre || '-',
        total: Number(order.total || 0),
        efectivo: Number(order.efectivo || 0),
        tarjeta: Number(order.tarjeta || 0),
        fechaHoraCierre: order.fechaHoraCierre
          ? new Date(order.fechaHoraCierre).toLocaleString()
          : '-',
      });
    });

    const totals = orders.reduce(
      (acc, order) => {
        acc.total += Number(order.total || 0);
        acc.efectivo += Number(order.efectivo || 0);
        acc.tarjeta += Number(order.tarjeta || 0);
        return acc;
      },
      { total: 0, efectivo: 0, tarjeta: 0 }
    );

    sheetOrders.addRow({});
    sheetOrders.addRow({
      comanda: 'Totales',
      total: totals.total,
      efectivo: totals.efectivo,
      tarjeta: totals.tarjeta,
    });

    // Hoja 2: Productos más vendidos
    const sheetProducts = workbook.addWorksheet('Productos mas vendidos');

    sheetProducts.columns = [
      { header: 'Producto', key: 'nombre', width: 28 },
      { header: 'Cantidad', key: 'cantidad', width: 14 },
    ];

    topProducts.forEach((item) => {
      sheetProducts.addRow({
        nombre: item.nombre,
        cantidad: item.cantidad,
      });
    });

    // Estilo encabezados
    [sheetOrders, sheetProducts].forEach((sheet) => {
      const headerRow = sheet.getRow(1);
      headerRow.font = { bold: true };
      headerRow.alignment = { vertical: 'middle', horizontal: 'center' };
    });

    const fechaInicio = req.query.fechaInicio || 'inicio';
    const fechaFin = req.query.fechaFin || 'fin';

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );

    res.setHeader(
      'Content-Disposition',
      attachment; filename="modo-cafe-reportes-${fechaInicio}-a-${fechaFin}.xlsx"
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'No se pudo exportar el Excel' });
  }
};