import { prisma } from '@/lib/prisma'
import { hash } from 'bcryptjs'

interface RegisterServiceRequest {
  name: string
  email: string
  password: string
}

export class RegisterService {
  constructor(private usersRepository: any) {}

  async execute({ name, email, password }: RegisterServiceRequest) {
    const password_hash = await hash(password, 6) // 6 rounds

    const checkIfAlreadyExistsAUserWithSameEmail = await prisma.user.findUnique(
      {
        where: {
          email,
        },
      },
    )

    if (checkIfAlreadyExistsAUserWithSameEmail) {
      throw new Error('E-mail already exists.')
    }

    await this.usersRepository.create({
      name,
      email,
      password_hash,
    })
  }
}
