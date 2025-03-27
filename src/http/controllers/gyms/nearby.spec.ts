import request from 'supertest'
import { app } from '@/app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'

describe('Nearby Gyms (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to list nearby gyms', async () => {
    const { token } = await createAndAuthenticateUser(app)

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'The Best Gym',
        description: 'Some desc.',
        phone: '11999999999',
        latitude: -23.6899759,
        longitude: -46.7962328,
      })

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Panobianco Gym',
        description: 'Some desc.',
        phone: '11999999999',
        latitude: -23.4643675,
        longitude: -46.5213309,
      })

    const response = await request(app.server)
      .get('/gyms/nearby')
      .query({
        latitude: -23.6899759,
        longitude: -46.7962328,
      })
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.statusCode).toEqual(200)
    expect(response.body.gyms).toHaveLength(1)
    expect(response.body.gyms).toEqual([
      expect.objectContaining({
        title: 'The Best Gym',
      }),
    ])
  })
})
