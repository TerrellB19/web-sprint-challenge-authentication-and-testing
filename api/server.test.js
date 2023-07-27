// Write your tests here
const db = require('../data/dbConfig')
const request = require('supertest')
const server = require('./server')

test('sanity', () => {
  expect(true).toBe(true)
})

beforeAll(async () => {
  await db.migrate.rollback();
  await db.migrate.latest();
})

beforeEach(async () => {
  await db('users').truncate()
})

describe('[GET] jokes', () => {
  const controlUser = {
    username: "foo",
    password: "bar"
  }
  test('receives an error when token is not available', async () => {
    await request(server).post('/api/auth/register').send(controlUser)
    await request(server).post('/api/auth/login').send(controlUser)
    const data = await request(server).get('/api/jokes')
    expect(data.body.message).toBe('token required')
  })
  test('returns a list of jokes when token is available', async () => {
    await request(server).post('/api/auth/register').send(controlUser)
    const res = await request(server).post('/api/auth/login').send(controlUser)
    const data = await request(server).get('/api/jokes').set('Authorization', `${res.body.token}`)
    expect(data.body).toHaveLength(3)
  })
})

describe('[POST] register', () => {
  const controlUser = {
    username: "foo",
    password: "bar"
  }
  test('newly created users show in db', async () => {
    await request(server).post('/api/auth/register').send(controlUser)
    const rows = await db('users')
    expect(rows).toHaveLength(1)
  })
  test('returns username and hashed pass', async () => {
    const res = await request(server).post('/api/auth/register').send(controlUser)
    expect(res.body.username).toMatch(controlUser.username)
    expect(res.body.password).not.toMatch(controlUser.password)
  })
})

describe('[POST] login', () => {
  const controlUser = {
    username: "foo",
    password: "bar"
  }
  test('Freshly logged in user gains a fresh token', async () => {
    await request(server).post('/api/auth/register').send(controlUser)
    const res = await request(server).post('/api/auth/login').send(controlUser)
    expect(res.body.token).toBeDefined()
  })
  test('wrong credentials throw an error', async () => {
    await request(server).post('/api/auth/register').send(controlUser)
    const res = await request(server).post('/api/auth/login').send({ username: "zzz", password: 'baz'})
    expect(res.body.message).toBe('invalid credentials')
  })
})

