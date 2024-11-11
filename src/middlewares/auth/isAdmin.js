const isAdmin = (req, res, next) => {
  if (req.session.user.id_rol !== 1) {
    return res.status(403).json({ message: 'No tiene permisos de administrador.' })
  }

  next()
}

export default isAdmin
