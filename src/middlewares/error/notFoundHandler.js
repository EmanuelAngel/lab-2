export const notFoundHandler = (req, res, _next) => {
  try {
    const acceptHeader = req.get('Accept') || ''
    const wantsJson = req.xhr ||
                      acceptHeader.includes('application/json') ||
                      req.query.format === 'json'

    if (wantsJson) {
      return res.status(404)
        .contentType('application/json')
        .json({
          error: 'Not Found',
          message: 'La ruta solicitada no existe'
        })
    }

    return res.status(404).render('pages/error/404', {
      title: 'Página no encontrada',
      message: 'La página que buscas no existe',
      user: req.session.user
    })
  } catch (error) {
    console.error('Error en notFoundHandler:', error)

    res.status(404).send('Página no encontrada')
  }
}
