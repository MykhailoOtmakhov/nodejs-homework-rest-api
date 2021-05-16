const mongoose = require('mongoose')
const gravatar = require('gravatar')
const { Schema, model } = mongoose
const { Gender } = require('../../helpers/constants')
const bcrypt = require('bcryptjs')

const userSchema = new Schema({

  gender: {
    type: String,
    enum: {
      values: [Gender.MALE, Gender.FEMALE, Gender.NONE],
      message: "It's not allowed"
    },
    default: Gender.NONE,
  },

  password: {
    type: String,
    required: [true, 'Password is required'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    validate(value) {
      const re = /\S+@\S+\.\S+/
      return re.test(String(value).toLowerCase())
    }
  },
  subscription: {
    type: String,
    enum: ["starter", "pro", "business"],
    default: "starter"
  },
  token: {
    type: String,
    default: null,
  },
  avatar: {
    type: String,
    default: function () {
      return gravatar.url(this.email, { s: '250' }, true)
    }
  },
  idCloudAvatar: {
    type: String,
    default: null,
  },
})

userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(6)
    this.password = await bcrypt.hash(this.password, salt)
  }
  next()
})

userSchema.methods.validPassword = async function (password) {
  return await bcrypt.compare(password, this.password)
}

const User = model('users', userSchema)
  
module.exports = User