const isSecre = (req, res, next) => {
  if (req.session.user.id_rol !== 2) {
    return res.status(403).json({ message: 'No tiene permisos de secretari@.' })
  }

  next()
}

export default isSecre
