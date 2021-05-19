const contacts = [
    {
            favorite: false,
            features: [],
            _id: "60a2a33411c72a8efcea1e58",
            name: "Maxonason",
            email: "maxxxon@mail.com",
            phone: "12312312312312",
            owner: "609bbfdb696e055654db0049"
    }
]

const newContact = {
    name: 'New',
    // favorite: false,
    email: "new@mail.com"
}

const User = {
    _id: "60a2a33411c72a8efcea1e58",
    id: "60a2a33411c72a8efcea1e58",
    gender: 'none',
    subscription: "starter",
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwOTAyMTQ5Yjc2Mzc2NDkxYzM5NGFiMSIsImlhdCI6MTYyMDEwODQ0NCwiZXhwIjoxNjIwMTE5MjQ0fQ.q1KNsO90Jmcpavn3qBHz3Fc13C0s2LnycXQTMoJO7dY",
    email: "sv@fa.com",
    password: "$2a$06$hNcLLm0UPTiUtrPQzps7EeoenrB.FGeTsfd4ryXDEXXPaCBdqvi8q",
}

const users = []
users[0] = User

const newUser = { email: 'test@test.com', password: '123456' }

module.exports = { contacts, newContact, User, users, newUser }