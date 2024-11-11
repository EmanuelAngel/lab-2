import 'dotenv/config'
import jwt from 'jsonwebtoken'

const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token
  req.session = { user: null }

  try {
    const data = jwt.verify(token, process.env.JWT_SECRET)

    req.session.user = data
  } catch (error) {
    req.session.user = null
  }

  next()
}

export default verifyToken
