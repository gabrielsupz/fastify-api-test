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
    password: '123',
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

  findByEmail(email: string) {
    return users.find(user => user.email === email)
  },
}
