import { NODE_ENV } from '../../config/env.js'

export const globalErrorHandler = (err, req, res) => {
  // Valores por defecto
  const statusCode = err.status || err.statusCode || 500
  const errorName = err.name || 'Error'

  // Log del error
  console.error(`
    [${errorName}]
    ${err.message}`,
  {
    status: statusCode,
    stack: err.stack,
    timestamp: new Date().toISOString()
  })

  // Determinar si estamos en desarrollo
  const isDevelopment = NODE_ENV === 'development'

  // Construir respuesta de error
  const errorResponse = {
    success: false,
    status: statusCode,
    message: isDevelopment
      ? err.message
      : 'Ha ocurrido un error interno en el servidor',
    ...(isDevelopment && {
      name: errorName,
      stack: err.stack
    })
  }

  // Respuesta según el tipo de solicitud
  if (req.xhr || req.headers.accept.indexOf('json') > -1) {
    // Para solicitudes AJAX o que esperan JSON
    return res.status(statusCode).json(errorResponse)
  }

  // Para solicitudes que esperan renderizar
  res.status(statusCode).render('pages/error/500', {
    ...errorResponse,
    title: `Error ${statusCode}`,
    session: req.session
  })
}
