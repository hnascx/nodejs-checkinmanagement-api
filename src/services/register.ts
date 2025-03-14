import { prisma } from '@/lib/prisma'
import { hash } from 'bcryptjs'

interface RegisterServiceRequest {
  name: string
  email: string
  password: string
}

export async function registerService({
  name,
  email,
  password,
}: RegisterServiceRequest) {
  const password_hash = await hash(password, 6) // 6 rounds

  const checkIfAlreadyExistsAUserWithSameEmail = await prisma.user.findUnique({
    where: {
      email,
    },
  })

  if (checkIfAlreadyExistsAUserWithSameEmail) {
    throw new Error('E-mail already exists.')
  }

  await prisma.user.create({
    data: {
      name,
      email,
      password_hash,
    },
  })
}
