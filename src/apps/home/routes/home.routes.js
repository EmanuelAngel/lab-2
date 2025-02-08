import { Router } from 'express'

export const homeRouter = Router()

homeRouter
  .get('/', (req, res) => res.render('index', { user: req.session.user }))
