import { verifyToken } from '../../apps/.utils/jwt.js'

export const verifyAccessToken = (req, res, next) => {
  const token = req.cookies.access_token
  req.session = { user: null }

  try {
    const data = verifyToken({ token })

    req.session.user = data
  } catch (error) {
    req.session.user = null
  }

  next()
}
