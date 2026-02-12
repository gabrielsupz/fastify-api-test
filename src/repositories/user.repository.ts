import { randomUUID } from 'crypto'

export type User = {
  id: string
  name: string
  email: string
  password: string
}

const users: User[] = [
  {
    id: '1',
    email: 'user@example.com',
    password: '$2b$10$X6tU1Qj/x.pECP6THZ/meO/JbzhmzJ.Tonch0UlwGd50hDMX.aY3e', //123
    name: 'Gabriel Suptitz',
  },
]

export const UsersRepository = {
  create(data: Omit<User, 'id'>) {
    const user = {
      id: randomUUID(),
      ...data,
    }

    users.push(user)
    return user
  },

  findById(id: string) {
    return users.find(user => user.id === id)
  },

  findByEmail(email: string) {
    return users.find(user => user.email === email)
  },
}
