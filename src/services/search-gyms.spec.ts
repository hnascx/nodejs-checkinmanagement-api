import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { SearchGymsService } from './search-gyms'

let gymsRepository: InMemoryGymsRepository
let sut: SearchGymsService

describe('Search gyms Service', () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new SearchGymsService(gymsRepository)
  })

  it('should be able to search for gyms', async () => {
    await gymsRepository.create({
      title: 'The Best Gym',
      description: null,
      phone: null,
      latitude: -23.6899759,
      longitude: -46.7962328,
    })

    await gymsRepository.create({
      title: 'Panobianco Gym',
      description: null,
      phone: null,
      latitude: -23.6899759,
      longitude: -46.7962328,
    })

    const { gyms } = await sut.execute({
      query: 'The Best',
      page: 1,
    })

    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([expect.objectContaining({ title: 'The Best Gym' })])
  })

  it('should be able to fetch paginated gyms search', async () => {
    for (let i = 1; i <= 22; i++) {
      await gymsRepository.create({
        title: `The Best Gym ${i}`,
        description: null,
        phone: null,
        latitude: -23.6899759,
        longitude: -46.7962328,
      })
    }

    const { gyms } = await sut.execute({
      query: 'The Best',
      page: 2,
    })

    expect(gyms).toHaveLength(2)
    expect(gyms).toEqual([
      expect.objectContaining({ title: 'The Best Gym 21' }),
      expect.objectContaining({ title: 'The Best Gym 22' }),
    ])
  })
})
