import { NODE_ENV } from '../../config/env.js'

export const globalErrorHandler = (err, req, res, next) => {
  const statusCode = err.status || 500
  const isDevelopment = NODE_ENV === 'development'

  const errorData = {
    title: `Error ${statusCode}`,
    message: isDevelopment ? err.message : 'Ha ocurrido un error',
    stack: isDevelopment ? err.stack : null,
    status: statusCode,
    NODE_ENV
  }

  let template = 'error/general'
  if (statusCode === 404) template = 'error/404'
  if (statusCode === 403) template = 'error/403'

  res.status(statusCode).render(template, {
    ...errorData,
    user: req.session?.user || null
  })
}
