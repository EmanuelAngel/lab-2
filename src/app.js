import express from 'express'
import morgan from 'morgan'
import { NODE_ENV } from './config/env.js'
import { corsMiddleware } from './middlewares/cors.js'

import { getDirname } from './config/path.js'
import { join } from 'node:path'

import cookieParser from 'cookie-parser'
import { verifyAccessToken } from './middlewares/auth/verifyAccessToken.js'

import { homeRouter } from './apps/home/routes/home.routes.js'
import { authRouter } from './apps/auth/routes/auth.routes.js'
import { panelRouter } from './apps/panel/routes/panel.routes.js'
import { appRoutes } from './routes/app.routes.js'

import { notFoundHandler } from './middlewares/error/notFoundHandler.js'
import { globalErrorHandler } from './middlewares/error/globalErrorHandler.js'

const app = express()

if (NODE_ENV === 'development') app.use(morgan('dev'))
app.disable('x-powered-by')
app.use(corsMiddleware())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const __dirname = getDirname(import.meta.url)

app.use(express.static(join(__dirname, '..', 'public')))

// Auth
app.use(cookieParser())
app.use(verifyAccessToken)

// Views configuration
app.set('view engine', 'pug')
app.set('views', join(__dirname, 'views/templates'))

app.get('/', homeRouter)

app.use('/auth', authRouter)

// Panel (views) routes
app.use('/panel', panelRouter())

// App ("API") routes
app.use('/', appRoutes)

// Error handling
app.use(notFoundHandler)
app.use(globalErrorHandler)

export default app
