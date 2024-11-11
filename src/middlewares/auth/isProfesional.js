const isProfessional = (req, res, next) => {
  if (req.session.user.id_rol !== 3) {
    return res.status(403).json({ message: 'No tiene permisos de profesional.' })
  }

  next()
}

export default isProfessional
