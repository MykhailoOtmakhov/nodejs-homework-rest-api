const express = require('express')
const router = express.Router()
const controlls = require('../../controllers/contacts')

const {
  validationCreateContact,
  validationUpdateContact,
  validationObjectId,
  validationUpdateStatusContact,
  validationQueryContact
} = require('../contacts/validator-router')

const {Gender} = require('../../helpers/constants')
const role = require('../../helpers/role')
const guard = require('../../helpers/guard')


router
  .get('/', guard, validationQueryContact, controlls.getAll)
  .post('/', guard, validationCreateContact, controlls.createContact)

router.get('/man', guard, role(Gender.MALE), controlls.onlyMan)
router.get('/woman', guard, role(Gender.FEMALE), controlls.onlyFemale)

router
  .get('/:id', guard, validationObjectId, controlls.getById)
  .put('/:id', guard, validationUpdateContact, controlls.updateContact)
  .delete('/:id', guard, controlls.removeContact)

router
  .patch('/:id/favorite', guard, validationUpdateStatusContact, controlls.updateStatus)


module.exports = router
