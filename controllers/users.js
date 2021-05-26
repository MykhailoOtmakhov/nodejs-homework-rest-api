const Users = require('../model/users')
const { HttpCode } = require('../helpers/constants')
// const { required } = require('joi')
const jwt = require('jsonwebtoken')
const jimp = require('jimp')
const fs = require('fs').promises
const path = require('path')
const cloudinary = require('cloudinary').v2;
const { promisify } = require('util')
require('dotenv').config()
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY
const EmailService = require('../services/email')

cloudinary.config({ 
  cloud_name: process.env.CLOUD_NAME, 
  api_key: process.env.API_KEY_CLOUD, 
  api_secret: process.env.API_SECRET_CLOUD, 
});

const uploadToCloud = promisify(cloudinary.uploader.upload)

const reg = async (req, res, next) => {
    const user = await Users.findByEmail(req.body.email)
    if (user) {
        return res.status(HttpCode.CONFLICT).json({
            status: 'error',
            code: HttpCode.CONFLICT,
            message: 'Email in use'
        })
    }
    try {
        const newUser = await Users.create(req.body)
        const { id, name, email, gender, avatar, verifyTokenEmail } = newUser
        try {
            const emailService = new EmailService(process.env.NODE_ENV)
            await emailService.sendVerifyEmail(verifyTokenEmail, email, name)
        } catch (e) {
            console.log(e.message);
        }
        return res.status(HttpCode.CREATED).json({
            status: 'success',
            code: HttpCode.CREATED,
            data: {
                id,
                email,
                gender,
                avatar,
                name
            }
        })
    } catch (e) {
        next(e)
    }
 }

const login = async (req, res, next) => {
    const { email, password } = req.body
    const user = await Users.findByEmail(email)
    console.log(user);
    const isValidPassword = await user?.validPassword(String(password))
    if (!user || !isValidPassword || !user.verify) {
        return res.status(HttpCode.UNAUTHORIZED).json({
            status: 'error',
            code: HttpCode.UNAUTHORIZED,
            message: 'Email or password is wrong',
        })
    }
    const payload = { id: user.id }
    const token = jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: '3h' })
    await Users.updateToken(user.id, token)
        return res.status(HttpCode.OK).json({
            status: 'success',
            code: HttpCode.OK,
            // avatar: user.avatar,
            data: { token }
        })    
}

const logout = async (req, res, next) => {
    const id = req.user.id
    await Users.updateToken(id, null)
    return res.status(HttpCode.NO_CONTENT).json({
        status: 'success',
        code: HttpCode.OK 
    })
}

const updateAvatar = async (req, res, next) => {
    const { id } = req.user
    // const avatarUrl = await saveAvatar(req)
    const { idCloudAvatar, avatarUrl } = await saveAvatarUserToCloud(req)

    await Users.updateAvatar(id, avatarUrl)
    // await Users.updateAvatar(id, avatarUrl, idCloudAvatar)

    return res.status(HttpCode.OK).json({
        status: 'success',
        code: HttpCode.OK,
        data: { avatarUrl }
    })
}

const saveAvatar = async (req) => {
    const FOLDER_AVATARS = process.env.FOLDER_AVATARS
    // req.file
    const pathFile = req.file.path
    const newNameAvatar = `${Date.now().toString()}-${req.file.originalname}`
    const img = await jimp.read(pathFile)
    await img
        .autocrop()
        .cover(250, 250, jimp.HORIZONTAL_ALIGN_CENTER | jimp.VERTICAL_ALIGN_MIDDLE)
        .writeAsync(pathFile)
    try {
        await fs.rename(
            pathFile,
            path.join(process.cwd(), 'public', FOLDER_AVATARS, newNameAvatar),
        )
    } catch (e) {
        console.log(e.message);
    }
    const oldAvatar = req.user.avatar
    if (oldAvatar.includes(`${FOLDER_AVATARS}/`)) {
        await fs.unlink(path.join(process.cwd(), 'public', oldAvatar))
        }
    return path.join(FOLDER_AVATARS, newNameAvatar).replace('\\', '/')
}

const saveAvatarUserToCloud = async (req) => {
    const pathFile = req.file.path
    const { public_id: idCloudAvatar, secure_url: avatarUrl } = await uploadToCloud(
        pathFile, {
            public_id: req.user.idCloudAvatar?.replace('Avatars/', ''),
            folder: 'Avatars',
            transformation:{width:250, height: 250, crop: 'pad'}
        }
    )
    await fs.unlink(pathFile)
    return { idCloudAvatar, avatarUrl }
    
}

const verify = async (req, res, next) => {
    try {
        const user = await Users.findByVerifyTokenEmail(req.params.token)
        console.log(req.params);
        if (user) {
            res.status(HttpCode.OK).json({
                status: 'success',
                code: HttpCode.OK,
                data: { message: 'Verification successful!' }
            })
        }
        return res.status(HttpCode.BAD_REQUEST).json({
            status: 'error',
            code: HttpCode.BAD_REQUEST,
            message: 'Verification failed!',
        }) 
    } catch (error) {
        next(error)
    }
}
    
const repeatEmailVerify = async (req, res, next) => {
    try {
        const user = await Users.findByEmail(req.body.email)
        if (user) {
            const { name, verifyTokenEmail, email } = user
            const emailService = new EmailService(process.env.NODE_ENV)
            await emailService.sendVerifyEmail(verifyTokenEmail, email, name)
            return res.status(HttpCode.OK).json({
                status: 'success',
                code: HttpCode.OK,
                data: { message: 'Verification email resubmitted!' }
            })
        }
        return res.status(HttpCode.NOT_FOUND).json({
            status: 'error',
            code: HttpCode.NOT_FOUND,
            message: 'User not found!',
        }) 
    } catch (error) {
        next(error)
    }
}

    
module.exports = {
    reg,
    login,
    logout,
    updateAvatar,
    verify,
    repeatEmailVerify
}