import { validatePartialUser, validateUser } from './schemes/user.scheme.js'

export class UserController {
  constructor ({ userModel }) {
    this.userModel = userModel
  }

  getAll = async (req, res) => {
    const users = await this.userModel.getAll()

    return res.json(users)
  }

  getById = async (req, res) => {
    const { id } = req.params

    const user = await this.userModel.getById({ id })

    if (user === false) {
      return res.status(404).json({ error: 'User not found' })
    }

    return res.json(user)
  }

  create = async (req, res) => {
    const result = validateUser(req.body)

    if (result.error) {
      return res.status(422).json({ error: JSON.parse(result.error.message) })
    }

    const createdUser = await this.userModel.create({ input: result.data })

    return res.status(201).json({ created: createdUser })
  }

  delete = async (req, res) => {
    const { id } = req.params

    const result = await this.userModel.delete({ id })

    if (result === false) {
      return res.status(404).json({ error: 'User not found' })
    }

    return res.status(200).json({ message: 'User deleted' })
  }

  partiallyUpdate = async (req, res) => {
    const result = validatePartialUser(req.body)

    if (result.error) {
      return res.status(422).json({ error: JSON.parse(result.error.message) })
    }

    const { id } = req.params

    const updatedUser = await this.userModel.partiallyUpdate({
      id,
      input: result.data
    })

    return res.json({ updated: updatedUser })
  }
}
