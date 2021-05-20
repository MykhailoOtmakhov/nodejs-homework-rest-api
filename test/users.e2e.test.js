const request = require('supertest')
const jwt = require('jsonwebtoken')
const app = require('../app')
const fs = require('fs/promises')
const { User, newUser } = require('../model/__mocks__/data')
require('dotenv').config()

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY
const issueToken = (payload, secret) => jwt.sign(payload, secret)
const token = issueToken({id: User.id}, JWT_SECRET_KEY)
User.token = token

jest.mock('../model/contacts.js')
jest.mock('../model/users.js')
jest.mock('cloudinary')

describe('Testing the route api/users', () => {
    describe('should handle POST request', () => {
        test('should return 200 status for PATCH: /users/avatar', async (done) => {
            const buffer = await fs.readFile('./test/avatar.jpg')
            const res = await request(app)
                .patch('/api/users/avatars')
                .set('Authorization', `Bearer ${token}`)
                .attach('avatar', buffer, 'avatar.jpg')         
            expect(res.status).toEqual(200)
            expect(res.body).toBeDefined()
            expect(res.body.data.avatarUrl).toEqual('secure_url_cloudinary')
            done()
        })
    })
})