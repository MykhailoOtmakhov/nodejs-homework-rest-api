const Contacts = require('../model/contacts')

const getAll = async (req, res, next) => {
  try {
    const userId = req.user?.id
    const contacts = await Contacts.listContacts(userId, req.query)
    return res.json({
      status: "success",
      code: 200,
      data: {
        contacts,
      }
    })
  } catch (e) {
    next(e)
  }
}

// router.post('/',
//   validationCreateContact,
//   handleError(async (req, res, next) => {
//     const contact = await Contacts.addContact(req.body)
//       return res.status(201).json({
//         status: "created",
//         code: 201,
//         data: {
//           contact,
//         },
//       })
//     }),
// )

const getById = async (req, res, next) => {
  try {
    const userId = req.user?.id
    const contact = await Contacts.getContactById(userId, req.params.id)
    if (!contact) {
      return res.status(404).json({
        status: "error",
        code: 404,
        data: 'Not found'
      })  
    } else {
      return res.json({
        status: "success",
        code: 200,
        data: {
          contact,
        }
      })
    }    
  } catch (e) {
    next(e)
  }
}

// router.post('/',
//   validationCreateContact,
//   handleError(async (req, res, next) => {
//     const contact = await Contacts.addContact(req.body)
//       return res.status(201).json({
//         status: "created",
//         code: 201,
//         data: {
//           contact,
//         },
//       })
//     }),
// )

const createContact = async (req, res, next) => {
  try {
    const { name } = req.body;
    const { email } = req.body;
    const userId = req.user?.id
    const contact = await Contacts.addContact(userId, req.body)
    if (name && email) {
      return res.status(201).json({
        status: "created",
        code: 201,
        data: {
          contact,
        }
      })
    } else {
      return res.json({ message: "missing required field" })
    }
  }catch (e) {
    next(e)
  }
}

const updateContact = async (req, res, next) => {
  try {
    const userId = req.user?.id
    const contact = await Contacts.updateContact(userId, req.params.id, req.body)
    if (!contact) {
      return res.status(404).json({
        status: "error",
        code: 404,
        data: 'Not found'
      })  
    } else {
      return res.json({
        status: "success",
        code: 200,
        data: {
          contact,
        }
      })
    }   
  } catch (e) {
    next(e)
  }
}

const removeContact = async (req, res, next) => {
  try {
    const userId = req.user?.id
    const { id } = req.params;
    const contact = await Contacts.removeContact(userId, id) 
    if (!contact) {
      return res.status(404).json({
        status: "error",
        code: 404,
        data: 'Not found'
      })
    } else {
      return res.json({
        status: "success",
        code: 200,
        message: "Contact deleted!",
      })
    }    
  } catch (e) {
    next(e)
  }
}

const updateStatus = async (req, res, next) => {
  try {
    const userId = req.user?.id
    const { id } = req.params;
    const { body } = req;
    const contact = await Contacts.updateContact(userId, id)
    if (!contact) {
      return res.status(404).json({
        status: "error",
        code: 404,
        data: 'Not found'
      })  
    } else {
      if (Object.keys(req.body).length !== 0){
        return res.json({
          status: "success",
          code: 200,
          data: {
            ...contact,
            ...body
          }
        })
      } else {
        return res.json({
          message : "missing fields"
        })
      }
    }    
  } catch (e) {
    next(e)
  }
}

const onlyMan = async (req, res, next) => {
      return res.status(404).json({
        status: "error",
        code: 404,
        data: {
          message: 'Only man!'
        }
      })  
}

const onlyFemale = async (req, res, next) => {
      return res.status(404).json({
        status: "error",
        code: 404,
        data: {
          message: 'Only woman!'
        }
      })  
}
    


// const updateStatus = async (req, res, next) => {
//     try {
//         const contact = await Contacts.updateStatusContact(
//             req.params.id,
//             req.body
//       )
//       if (!contact) {
//         return res.status(404).json({
//           status: "error",
//           code: 404,
//           data: 'Not found'
//         })  
//       } else {
//         if (Object.keys(req.body).length !== 0){
//           return res.json({
//             status: "success",
//             code: 200,
//             data: {
//               contact,
//             }
//           })
//         } else {
//           return res.json({
//             message : "missing fields"
//           })
//         }
//       }  
//     } catch (error) {
//       next(error)
//     }
// }

// router.patch(
//   '/:id/favorite',
//   validationObjectId,
//   validationUpdateStatusContact,
//   async (req, res, next) => {
//     try {
//         const contact = await Contacts.updateStatusContact(
//             req.params.id,
//             req.body
//       )
//       if (!contact) {
//         return res.status(404).json({
//           status: "error",
//           code: 404,
//           data: 'Not found'
//         })  
//       } else {
//         if (Object.keys(req.body).length !== 0){
//           return res.json({
//             status: "success",
//             code: 200,
//             data: {
//               contact,
//             }
//           })
//         } else {
//           return res.json({
//             message : "missing fields"
//           })
//         }
//       }  
//     } catch (error) {
//       next(error)
//     }
//   }
// )

module.exports = {
    getAll,
    getById,
    createContact,
    updateContact,
    removeContact,
  updateStatus,
  onlyMan,
    onlyFemale
}
