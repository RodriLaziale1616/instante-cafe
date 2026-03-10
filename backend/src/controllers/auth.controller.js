const bcrypt = require('bcryptjs');
const prisma = require('../lib/prisma');
const { signToken } = require('../lib/jwt');

exports.login = async (req, res) => {
  const { codigo, password } = req.body;
  const user = await prisma.user.findUnique({ where: { codigo } });
  if (!user || !user.activo) return res.status(401).json({ message: 'Credenciales inválidas' });
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ message: 'Credenciales inválidas' });
  const token = signToken({ id: user.id, codigo: user.codigo, nombre: user.nombre, rol: user.rol });
  res.json({ token, user: { id: user.id, codigo: user.codigo, nombre: user.nombre, rol: user.rol } });
};

exports.me = async (req, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.user.id } });
  if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
  res.json({ id: user.id, codigo: user.codigo, nombre: user.nombre, rol: user.rol });
};
