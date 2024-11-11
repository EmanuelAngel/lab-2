const isProfessional = (req, res, next) => {
  if (req.session.user.id_rol !== 4) {
    return res.status(403).json({ message: 'No tiene permisos de páciente.' })
  }

  next()
}

export default isProfessional
