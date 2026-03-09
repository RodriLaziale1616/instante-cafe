# Instante Café v1 real

Esta entrega sí está armada por mí como base funcional completa para que puedas probar el flujo real: login, catálogo, pedido, envío a cocina, cobro, cierre y reportes.

## Qué incluye
- Backend Express + Prisma
- Base SQLite lista para correr local
- Login real
- Productos y combos seed
- POS móvil conectado al backend
- Nombre/label opcional del cliente
- Envío a cocina
- Cobro efectivo/tarjeta/mixto
- Cierre de pedido validado
- Reporte de comandas
- Productos más vendidos

## Credenciales
- usuario: `admin`
- contraseña: `admin123`

## 1. Backend
```bash
cd backend
copy .env.example .env
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run seed
npm run dev
```

Debe quedar en `http://localhost:3000`

## 2. Frontend
En otra terminal:
```bash
cd frontend
copy .env.example .env
npm install
npm run dev
```

Abre `http://localhost:5173`

## Notas honestas
- Esta base está pensada para correr fácil en local con SQLite.
- Para subirla a Railway, el cambio natural es pasar Prisma a PostgreSQL.
- Todavía no incluye exportación Excel/PDF ni impresión térmica; eso sería el siguiente sprint.
