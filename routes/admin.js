const express = require('express')
const router = express.Router()
const adminController = require('../controller/adminController')
const adminAuth =require('../middleware/adminAuth')


router.get("/login",adminAuth.isLogin,adminController.loadLogin)
router.post('/login',adminController.Login)

router.get("/dashboard",adminAuth.checkSession,adminController.loadDashboard)

router.post('/edit/:id',adminAuth.checkSession,adminController.editUser)

router.delete('/delete/:id',adminAuth.checkSession,adminController.deleteUser)

router.post("/add",adminAuth.checkSession,adminController.addUser)

router.post('/logout',adminAuth.checkSession,adminController.logout)

router.post("/searchUser",adminAuth.checkSession,adminController.searchUser)


module.exports = router