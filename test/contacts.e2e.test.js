const request = require('supertest')
const jwt = require('jsonwebtoken')
const app = require('../app')
const { User, contacts, newContact } = require('../model/__mocks__/data')
require('dotenv').config()

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY
const issueToken = (payload, secret) => jwt.sign(payload, secret)
const token = issueToken({id: User.id}, JWT_SECRET_KEY)
User.token = token

jest.mock('../model/contacts.js')
jest.mock('../model/users.js')

describe('Testing the route api/contacts', () => {
    let idNewContact = null
    describe('should handle GET request', () => {
        test('should return 200 status for GET: /contacts', async (done) => {
            const res = await request(app)
                .get('/api/contacts')
                .set('Authorization', `Bearer ${token}`)
            expect(res.status).toEqual(200)
            expect(res.body).toBeDefined()
            expect(res.body.data.contacts).toBeInstanceOf(Array)
            done()
        })
            test('should return 200 status for GET: /contacts/:id', async (done) => {
            const contact = contacts[0]
            const res = await request(app)
                .get(`/api/contacts/${contact._id}`)
                .set('Authorization', `Bearer ${token}`)
            expect(res.status).toEqual(200)
            expect(res.body).toBeDefined()
            expect(res.body.data.contact._id).toBe(contact._id)
            done()
        })
            test('should return 404 status for GET: /contacts/:id', async (done) => {
                const res = await request(app)
                .get(`/api/contacts/60a2a33411c72a8efcea2e58`)
                .set('Authorization', `Bearer ${token}`)
            expect(res.status).toEqual(404)
            expect(res.body).toBeDefined()
            done()
        })
            test('should return 400 status for GET: /contacts/:id', async (done) => {
            const res = await request(app)
                .get(`/api/contacts/'160a2a33411c72a8efceae58'`)
                .set('Authorization', `Bearer ${token}`)
            expect(res.status).toEqual(400)
            expect(res.body).toBeDefined()
            done()
        })
    })

    describe('should handle POST request', () => {
        test('should return 201 status for POST: /contacts', async (done) => {
            const res = await request(app)
                .post('/api/contacts')
                .set('Authorization', `Bearer ${token}`)
                .set('Accept', 'application/json')
                .send(newContact)
            expect(res.status).toEqual(201)
            expect(res.body).toBeDefined()
            idNewContact = res.body.data.contact._id
            done()
        })
        test('should return 400 status for POST: /contacts wrong field', async (done) => {
            const res = await request(app)
                .post('/api/contacts')
                .set('Authorization', `Bearer ${token}`)
                .set('Accept', 'application/json')
                .send({ ...newContact, test: 1 })
            expect(res.status).toEqual(400)
            expect(res.body).toBeDefined()
            done()
        })
        test('should return 400 status for POST: /contacts without field', async (done) => {
            const res = await request(app)
                .post('/api/contacts')
                .set('Authorization', `Bearer ${token}`)
                .set('Accept', 'application/json')
                .send({ age: 1 })
            expect(res.status).toEqual(400)
            expect(res.body).toBeDefined()
            done()
        })
    })

    describe('should handle PUT request', () => {
        test('should return 200 status for PUT: /contacts', async (done) => {
            const res = await request(app)
                .put(`/api/contacts/${idNewContact}`)
                .set('Authorization', `Bearer ${token}`)
                .set('Accept', 'application/json')
                .send({ name: 'Maxonaso' })
            expect(res.status).toEqual(200)
            expect(res.body).toBeDefined()
            expect(res.body.data.contact.name).toBe('Maxonaso')
            done()
        })
        test('should return 400 status for PUT: /contacts wrong field', async (done) => {
            const res = await request(app)
                .put('/api/contacts/123')
                .set('Authorization', `Bearer ${token}`)
                .set('Accept', 'application/json')
                .send({ test: 1 })
            expect(res.status).toEqual(400)
            expect(res.body).toBeDefined()
            done()
        })
        test('should return 404 status for PUT: /contacts without field', async (done) => {
            const res = await request(app)
                .put('/api/contacts/60a2a33411c72a8efcea2e59')
                .set('Authorization', `Bearer ${token}`)
                .set('Accept', 'application/json')
                .send({ email: 'qwe@qwe.com' })
            expect(res.status).toEqual(404)
            expect(res.body).toBeDefined()
            done()
        })
    })

    describe('should handle PATCH request', () => {
        test('should return 200 status for PATCH: /contacts/:id/favorite', async (done) => {
            const res = await request(app)
                .patch(`/api/contacts/${idNewContact}/favorite`)
                .set('Authorization', `Bearer ${token}`)
                .set('Accept', 'application/json')
                .send({ favorite: true })
            expect(res.status).toEqual(200)
            expect(res.body).toBeDefined()
            // console.log(res.body.data.favorite);
            // в видео было res.body.data.contact.favorite. Почему?
            expect(res.body.data.favorite).toBe(true)
            done()
        })
        test('should return 400 status for PATCH: /contacts wrong field', async (done) => {
            const res = await request(app)
                .patch(`/api/contacts/${idNewContact}/favorite`)
                .set('Authorization', `Bearer ${token}`)
                .set('Accept', 'application/json')
                .send({ test: 1 })
            expect(res.status).toEqual(400)
            expect(res.body).toBeDefined()
            done()
        })
        test('should return 404 status for PATCH: /contacts without field', async (done) => {
            const res = await request(app)
                .patch('/api/contacts/60a2a33411c72a8efcea2e59/favorite')
                .set('Authorization', `Bearer ${token}`)
                .set('Accept', 'application/json')
                .send({ favorite: true })
            expect(res.status).toEqual(404)
            expect(res.body).toBeDefined()
            done()
        })
    })
})