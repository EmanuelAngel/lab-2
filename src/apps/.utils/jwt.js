import jwt from 'jsonwebtoken'

import { JWT_SECRET, JWT_EXPIRES } from '../../config/env.js'

export function generateToken (
  { payload, key = JWT_SECRET, options = {} }
) {
  try {
    return jwt.sign(
      payload,
      key,
      {
        expiresIn: JWT_EXPIRES,
        ...options
      })
  } catch (error) {
    throw new Error('Error al generar el token')
  }
}

export function verifyToken ({ token, key = JWT_SECRET }) {
  try {
    return jwt.verify(token, key)
  } catch (error) {
    throw new Error('Error al verificar el token')
  }
}

export function decodeToken ({ token, options = {} }) {
  try {
    return jwt.decode(token, options)
  } catch (error) {
    throw new Error('Error al decodificar el token')
  }
}
