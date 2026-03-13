const bcrypt = require('bcryptjs');
const prisma = require('../lib/prisma');

exports.list = async (_req, res) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: [{ createdAt: 'asc' }],
      select: {
        id: true,
        codigo: true,
        nombre: true,
        rol: true,
        activo: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'No se pudieron listar los usuarios' });
  }
};

exports.create = async (req, res) => {
  try {
    const { codigo, nombre, password, rol, activo = true } = req.body;

    if (!codigo?.trim()) {
      return res.status(400).json({ message: 'El código es obligatorio' });
    }

    if (!nombre?.trim()) {
      return res.status(400).json({ message: 'El nombre es obligatorio' });
    }

    if (!password || password.length < 4) {
      return res.status(400).json({ message: 'La contraseña debe tener al menos 4 caracteres' });
    }

    if (!['admin', 'operador'].includes(rol)) {
      return res.status(400).json({ message: 'Rol inválido' });
    }

    const existing = await prisma.user.findUnique({
      where: { codigo: codigo.trim() },
    });

    if (existing) {
      return res.status(400).json({ message: 'Ya existe un usuario con ese código' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        codigo: codigo.trim(),
        nombre: nombre.trim(),
        passwordHash,
        rol,
        activo: Boolean(activo),
      },
      select: {
        id: true,
        codigo: true,
        nombre: true,
        rol: true,
        activo: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    res.status(201).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'No se pudo crear el usuario' });
  }
};

exports.update = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { codigo, nombre, password, rol, activo = true } = req.body;

    if (!id) {
      return res.status(400).json({ message: 'ID inválido' });
    }

    if (!codigo?.trim()) {
      return res.status(400).json({ message: 'El código es obligatorio' });
    }

    if (!nombre?.trim()) {
      return res.status(400).json({ message: 'El nombre es obligatorio' });
    }

    if (!['admin', 'operador'].includes(rol)) {
      return res.status(400).json({ message: 'Rol inválido' });
    }

    const existing = await prisma.user.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const duplicate = await prisma.user.findFirst({
      where: {
        codigo: codigo.trim(),
        NOT: { id },
      },
    });

    if (duplicate) {
      return res.status(400).json({ message: 'Ya existe otro usuario con ese código' });
    }

    const data = {
      codigo: codigo.trim(),
      nombre: nombre.trim(),
      rol,
      activo: Boolean(activo),
    };

    if (password && password.trim()) {
      data.passwordHash = await bcrypt.hash(password.trim(), 10);
    }

    const user = await prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        codigo: true,
        nombre: true,
        rol: true,
        activo: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'No se pudo actualizar el usuario' });
  }
};