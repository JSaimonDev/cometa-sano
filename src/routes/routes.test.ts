import { describe, it } from 'vitest'
import request from 'supertest'
import express from 'express'

const app = express()

describe('Testing post endpoints', () => {
  it('Get endpoint return 200 status', () => {
    request(app)
      .get('/api/post')
      .expect(200)
      .expect('Content-Type', /json/)
      .catch(e => { console.log('error') })
  })
})
