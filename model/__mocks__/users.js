const { User, users } = require('./data')

const findById = jest.fn((id) => {
    const [user] = users.filter((el) => String(el._id) ===String(id))
    return user
})

const findByEmail = jest.fn((email) => {
    return {}
})

const create = jest.fn( (userOptions) => {
    const user = new User(userOptions)
    return {}
})

const updateToken = jest.fn((id, token) => {
    return {}
})

const updateAvatar = jest.fn((id, avatar, idCloudAvatar = null) => {
    const [user] = users.filter((el) => String(el._id) ===String(id))
    user.avatar = avatar
    user.idCloudAvatar = idCloudAvatar
    return user
})

module.exports = {
    findById,
    findByEmail,
    create,
    updateToken,
    updateAvatar
}