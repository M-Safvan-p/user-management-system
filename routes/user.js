const express = require("express")
const router = express.Router()
const userController =require('../controller/userController')
const auth = require('../middleware/auth')

router.get('/login',auth.isLogin,userController.loadLogin)
router.post('/login',userController.login)

router.get('/register',auth.isLogin,userController.loadRegister)
router.post('/register',userController.registerUser)

router.get('/home',auth.checkSession,userController.loadHome)

router.post('/logout',auth.checkSession,userController.logout)

router.get('/details',auth.checkSession,userController.details)


module.exports =router