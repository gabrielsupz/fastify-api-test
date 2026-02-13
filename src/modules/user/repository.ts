import { UserModel } from './model'

export const UsersRepository = {
  async create(data: { name: string; email: string; password: string }) {
    const user = await UserModel.create(data)
    return user
  },

  async findById(id: string) {
    return UserModel.findById(id)
  },

  async findByEmail(email: string) {
    return UserModel.findOne({ email })
  },
}
