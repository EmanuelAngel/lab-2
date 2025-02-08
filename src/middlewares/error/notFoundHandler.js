const determineResponseType = (req) => {
  return req.xhr ||
    req.get('Accept')?.includes('application/json') ||
    req.query.format === 'json'
}

export const notFoundHandler = (req, res, next) => {
  const wantsJson = determineResponseType(req)

  try {
    if (wantsJson) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'El recurso solicitado no existe'
      })
    }

    res.status(404).render('error/404', {
      title: 'Página no encontrada',
      message: 'El recurso solicitado no existe',
      user: req.session?.user || null
    })
  } catch (error) {
    next(error)
  }
}
