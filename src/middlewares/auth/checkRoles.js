export function checkRoles (...allowedRoles) {
  return async (req, res, next) => {
    try {
      // 1. Determinar tipo de respuesta
      const wantsJson = req.xhr ||
        req.get('Accept')?.includes('application/json') ||
        req.query.format === 'json'

      // 2. Verificar autenticación
      if (!req.session?.user) {
        return wantsJson
          ? res.status(401).json({ error: 'No autenticado' })
          : res.redirect('/auth/login')
      }

      // 3. Obtener y validar rol
      const userRole = Number(req.session.user.id_rol)
      if (isNaN(userRole)) {
        throw new Error('Rol de usuario inválido')
      }

      // 4. Verificar permisos
      if (!allowedRoles.includes(userRole)) {
        return wantsJson
          ? res.status(403).json({ error: 'Acceso no autorizado' })
          : res.status(403).render('error/403', {
            title: 'Acceso denegado',
            message: 'No tienes permisos para esta acción',
            user: req.session.user
          })
      }

      next()
    } catch (error) {
      // 5. Manejo centralizado de errores
      next(error)
    }
  }
}
