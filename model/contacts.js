const Contacts = require('./schemas/contacts')

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
  const results = await Contacts.create({ ...body, owner: userId })
  return results
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

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact
}
