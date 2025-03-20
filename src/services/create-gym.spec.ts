import { expect, describe, it, beforeEach } from 'vitest'
import { CreateGymService } from './create-gym'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'

let gymsRepository: InMemoryGymsRepository
let sut: CreateGymService

describe('Create Gym Service', () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new CreateGymService(gymsRepository)
  })

  it('should be able to create gym', async () => {
    const { gym } = await sut.execute({
      title: 'The Best Gym',
      description: null,
      phone: null,
      latitude: -23.6899759,
      longitude: -46.7962328,
    })

    expect(gym.id).toEqual(expect.any(String))
  })
})
