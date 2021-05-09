const Contacts = require('./schemas/contacts')
// with db


const listContacts = async (userId, query) => {
  const { sortBy, sortByDesc, filter, favorite = null, limit = 20, offset = 0} = query
  const optionsSearch = { owner: userId }
  if (favorite !== null) {
    optionsSearch.favorite = favorite
  }
  const results = await Contacts.paginate(optionsSearch, {
    limit,
    offset,
    sort: {
      ...(sortBy ? { [`${sortBy}`]: 1 } : {}),
      ...(sortByDesc ? { [`${sortByDesc}`]: -1 } : {}),
    },
    select: filter ? filter.split('|').join(' ') : '',
    populate: {
      path: 'owner',
      select: 'name emeil gender phone'
    },
  })  
  return results
}

const getContactById = async (userId, id) => {
  const result = await Contacts.findOne({ _id: id, owner: userId }).populate({
    path: 'owner',
    select: 'name emeil gender'
  })
  return result
}

const removeContact = async (userId, id) => {
  const result = await Contacts.findByIdAndRemove({ _id: id, owner: userId  })
  return result
}

const addContact = async (userId, body) => {
  // try {
  const results = await Contacts.create({ ...body, owner: userId })
    return results
  // } catch (e) {
  //   const err = new Error(e)
  //   if (e.name === 'ValidationError') {
  //     err.status = 400
  //   }
  //   throw err
  // }
}

const updateContact = async (userId, id, body ) => {
  const result = await Contacts.findByIdAndUpdate(
    { _id: id, owner: userId },
    { ...body  },
    { new: true},
  )
  return result
}

const updateStatusContact = async (id, body) => {
    const result = await Contacts.findByIdAndUpdate(
    { _id: id },
    body,
    { new: true},
  )
  return result
}

// const fs = require('fs')
// const { promises: fsPromise } = fs;

// async function listContacts(){
//     try {
//       const contactsList = await fsPromise.readFile('./model/contacts.json')
//       const contactsArr = JSON.parse(contactsList.toString())
//       return contactsArr
//     } catch (err) {
//         console.log(err.message);
//     }
// }

// async function getContactById(contactId){
//     try {
//       const contactsList = await fsPromise.readFile('./model/contacts.json')
//       const contactsArr = JSON.parse(contactsList.toString())
//       console.log(contactsArr)
//       const contactWithId = contactsArr.filter(({ id }) => id == contactId);
//       console.log(contactWithId)
//       return contactWithId
//     } catch (err) {
//       console.log(err.message);
//     }
// }

// async function removeContact(contactId){
//     try {
//       const contactsList = await fsPromise.readFile('./model/contacts.json')
//       const contactsArr = JSON.parse(contactsList.toString())
//       const contactWithId = contactsArr.filter(({ id }) => id == contactId);
//       const contacstWithoutId = contactsArr.filter(({ id }) => id != contactId);
//       await fsPromise.writeFile('./model/contacts.json', JSON.stringify(contacstWithoutId));
//       return contactWithId
//     } catch (err) {
//       console.log(err.message);
//     }
// }

// async function addContact({ name, email, phone }) {
//   try {
//     const contactsList = await fsPromise.readFile('./model/contacts.json')
//     const contactsArr = JSON.parse(contactsList.toString())
//     const id = uuidv4()
//     const newContact = {
//       id: id, 
//       name: name,
//       email: email,
//       phone: phone
//     };
//     contactsArr.push(newContact)
//     await fsPromise.writeFile('./model/contacts.json', JSON.stringify(contactsArr));
//     return newContact
//     } catch (err) {
//       console.log(err.message);
//     }
// }

// async function updateContact(contactId, body ) {
//     try {
//       const contactsList = await fsPromise.readFile('./model/contacts.json')
//       const contactsArr = JSON.parse(contactsList.toString())
//       const contactWithId = contactsArr.filter(({ id }) => id == contactId);
//       const updatedContact = Object.assign(...contactWithId, body)
//       return updatedContact
//     } catch (err) {
//       console.log(err.message);
//     }
// }

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact
}
