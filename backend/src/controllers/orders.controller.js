const prisma = require('../lib/prisma');

function todayCode() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function todayCompact() {
  return todayCode().replace(/-/g, '');
}

async function nextOrderNumber(fechaOperativa) {
  const last = await prisma.pedido.findFirst({
    where: { fechaOperativa },
    orderBy: { numeroDia: 'desc' },
  });
  return (last?.numeroDia || 0) + 1;
}

exports.create = async (req, res) => {
  try {
    const { customerLabel = '', items = [] } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'El pedido debe tener productos' });
    }

    const fechaOperativa = todayCode();
    const numeroDia = await nextOrderNumber(fechaOperativa);
    const codigoPedido = `${todayCompact()}-${String(numeroDia).padStart(3, '0')}`;

    const productIds = items.map((i) => i.productoId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
    });
    const productsMap = new Map(products.map((p) => [p.id, p]));

    let subtotal = 0;

    const normalizedItems = items.map((item) => {
      const product = productsMap.get(item.productoId);

      if (!product) {
        throw new Error(`Producto ${item.productoId} no encontrado`);
      }

      const cantidad = Number(item.cantidad || 1);
      const lineSubtotal = product.precio * cantidad;
      subtotal += lineSubtotal;

      return {
        productoId: product.id,
        nombreSnapshot: product.nombre,
        tipoItem: product.tipo,
        cantidad,
        precioUnitario: product.precio,
        subtotal: lineSubtotal,
        observacion: item.observacion || '',
        components: product.tipo === 'combo',
      };
    });

    const pedido = await prisma.pedido.create({
      data: {
        codigoPedido,
        numeroDia,
        fechaOperativa,
        customerLabel,
        subtotal,
        total: subtotal,
        usuarioId: req.user.id,
        items: {
          create: normalizedItems.map(({ components, ...item }) => item),
        },
      },
      include: { items: true },
    });

    for (const item of pedido.items) {
      if (item.tipoItem === 'combo') {
        const comboComponents = await prisma.comboItem.findMany({
          where: { comboId: item.productoId },
        });

        for (const component of comboComponents) {
          const p =
            productsMap.get(component.productoId) ||
            (await prisma.product.findUnique({
              where: { id: component.productoId },
            }));

          await prisma.pedidoItemComponente.create({
            data: {
              pedidoItemId: item.id,
              productoId: component.productoId,
              nombreSnapshot: p?.nombre || `Producto ${component.productoId}`,
              cantidad: component.cantidad * item.cantidad,
            },
          });
        }
      }
    }

    res.status(201).json(pedido);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'No se pudo crear el pedido' });
  }
};

exports.list = async (req, res) => {
  try {
    const { from, to } = req.query;
    const where = {};

    if (from || to) {
      where.fechaOperativa = {};
      if (from) where.fechaOperativa.gte = from;
      if (to) where.fechaOperativa.lte = to;
    }

    const orders = await prisma.pedido.findMany({
      where,
      include: {
        usuario: true,
        items: true,
        anuladoPor: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'No se pudieron cargar los pedidos' });
  }
};

exports.sendToKitchen = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const pedido = await prisma.pedido.findUnique({ where: { id } });

    if (!pedido) {
      return res.status(404).json({ message: 'Pedido no encontrado' });
    }

    if (pedido.estado === 'anulado') {
      return res.status(400).json({ message: 'El pedido está anulado' });
    }

    if (pedido.sentToKitchen) {
      return res.status(400).json({ message: 'El pedido ya fue enviado a cocina' });
    }

    const updated = await prisma.pedido.update({
      where: { id },
      data: { sentToKitchen: true },
    });

    res.json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'No se pudo enviar el pedido a cocina' });
  }
};

exports.close = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { efectivo = 0, tarjeta = 0 } = req.body;

    const pedido = await prisma.pedido.findUnique({ where: { id } });

    if (!pedido) {
      return res.status(404).json({ message: 'Pedido no encontrado' });
    }

    if (pedido.estado === 'anulado') {
      return res.status(400).json({ message: 'No se puede cerrar un pedido anulado' });
    }

    if (!pedido.sentToKitchen) {
      return res.status(400).json({ message: 'Primero envía el pedido a cocina' });
    }

    const paid = Number(efectivo) + Number(tarjeta);

    if (paid !== pedido.total) {
      return res.status(400).json({ message: 'El pago no coincide con el total' });
    }

    const updated = await prisma.pedido.update({
      where: { id },
      data: {
        estado: 'cerrado',
        efectivo: Number(efectivo),
        tarjeta: Number(tarjeta),
        fechaHoraCierre: new Date(),
      },
    });

    res.json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'No se pudo cerrar el pedido' });
  }
};

exports.cancelOrder = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { motivo = '' } = req.body;

    const pedido = await prisma.pedido.findUnique({
      where: { id },
    });

    if (!pedido) {
      return res.status(404).json({ message: 'Pedido no encontrado' });
    }

    if (pedido.estado === 'anulado') {
      return res.status(400).json({ message: 'La comanda ya fue anulada' });
    }

    const updated = await prisma.pedido.update({
      where: { id },
      data: {
        estado: 'anulado',
        anuladoAt: new Date(),
        anuladoPorId: req.user.id,
        motivoAnulacion: motivo,
      },
    });

    res.json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'No se pudo anular la comanda' });
  }
};
