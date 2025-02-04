/**
 * Middleware that checks if the user has one of the allowed roles
 * @param {...number} allowedRoles - Allowed roles (1: admin, 2: secretari@, 3: médico, 4: paciente)
 * @returns {Function} Middleware function
 */
export function checkRoles (...allowedRoles) {
  return (req, res, next) => {
    try {
      const roles = req.session?.user?.id_rol

      console.log('roles', roles)

      if (!roles) {
        return res
          .status(401)
          .redirect('/auth/login')
      }

      if (!allowedRoles.includes(roles)) {
        return res.render('pages/error/500', {
          message: 'No tienes permiso para acceder a este recurso',
          error: 'No tienes permiso para acceder a este recurso',
          user: req.session.user
        })
      }

      next()
    } catch (error) {
      console.error('Error al verificar el rol:', error)

      return res.render('pages/error/500', {
        message: 'Error al verificar el rol',
        user: req.session.user
      })
    }
  }
}
