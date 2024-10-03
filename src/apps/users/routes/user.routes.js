import { Router } from 'express'
import { UserController } from '../controller/user.controller.js'

export const userRouter = ({ userModel }) => {
  const user = Router()

  const userController = new UserController({ userModel })

  user.get('/', userController.getAll)
  user.get('/:id', userController.getById)
  user.post('/', userController.create)
  user.delete('/:id', userController.delete)
  user.patch('/:id', userController.partiallyUpdate)

  return user
}
