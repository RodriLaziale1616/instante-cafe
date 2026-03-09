const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

async function upsertProduct(data) {
  return prisma.product.upsert({
    where: { codigo: data.codigo },
    update: data,
    create: data,
  });
}

async function main() {
  const passwordHash = await bcrypt.hash('admin123', 10);
  await prisma.user.upsert({
    where: { codigo: 'admin' },
    update: { nombre: 'Administrador', passwordHash, rol: 'admin', activo: true },
    create: { codigo: 'admin', nombre: 'Administrador', passwordHash, rol: 'admin', activo: true },
  });

  const cafe = await upsertProduct({ codigo: 'CAFE', nombre: 'Café', categoria: 'Cafés', precio: 12000, tipo: 'simple', activo: true });
  const cappu = await upsertProduct({ codigo: 'CAPPU', nombre: 'Cappuccino', categoria: 'Cafés', precio: 16000, tipo: 'simple', activo: true });
  const jugo = await upsertProduct({ codigo: 'JUGO', nombre: 'Jugo', categoria: 'Bebidas', precio: 14000, tipo: 'simple', activo: true });
  const media = await upsertProduct({ codigo: 'MEDIA', nombre: 'Medialuna', categoria: 'Comidas', precio: 9000, tipo: 'simple', activo: true });
  const wrap = await upsertProduct({ codigo: 'WRAP', nombre: 'Wrap', categoria: 'Comidas', precio: 22000, tipo: 'simple', activo: true });
  const huevos = await upsertProduct({ codigo: 'HUEVOS', nombre: 'Huevos revueltos', categoria: 'Comidas', precio: 18000, tipo: 'simple', activo: true });

  const combo1 = await upsertProduct({ codigo: 'C1', nombre: 'Combo C1', categoria: 'Combos', precio: 22000, tipo: 'combo', activo: true });
  const combo2 = await upsertProduct({ codigo: 'C2', nombre: 'Combo C2', categoria: 'Combos', precio: 32000, tipo: 'combo', activo: true });
  const combo3 = await upsertProduct({ codigo: 'C3', nombre: 'Combo C3', categoria: 'Combos', precio: 26000, tipo: 'combo', activo: true });

  await prisma.comboItem.deleteMany();
  await prisma.comboItem.createMany({
    data: [
      { comboId: combo1.id, productoId: cappu.id, cantidad: 1 },
      { comboId: combo1.id, productoId: media.id, cantidad: 1 },
      { comboId: combo2.id, productoId: jugo.id, cantidad: 1 },
      { comboId: combo2.id, productoId: wrap.id, cantidad: 1 },
      { comboId: combo3.id, productoId: cafe.id, cantidad: 1 },
      { comboId: combo3.id, productoId: huevos.id, cantidad: 1 },
    ],
  });

  console.log('Seed OK');
}

main().finally(() => prisma.$disconnect());
