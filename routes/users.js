const express = require('express')
const router = express.Router()
const { registerValidations, userController } = require('../controllers/user-controller')

router.get('/register', async (req, res, next) => {
    res.render('users/register', {
        title:'Register'
    })
})
///fullName is virtual in models/user.js
router.post('/register',  registerValidations, async (req,res, next) =>{
    await userController.create(req,res,next)
})

router.get('/login', async (req,res,next) =>{
    res.render('users/login', {
        title:"Login"
    })
})

router.post('/login', async (req,res,next) =>{
    await userController.authenticate(req,res)
})

router.get('/logout', async (req, res) =>{
    await userController.exit(req,res)
} )

router.get('/account', async (req, res, next) => {
    await userController.view(req,res,next)

})

router.get('/destroy', async (req, res, next) => {
    await userController.destroy(req,res,next)

})

router.get('/edit_account', async (req,res,next)=>{
    await userController.edit(req,res,next)
})

router.post('/save', async (req, res, next)=>{
    await userController.save(req,res,next)
})

module.exports = router  //equivalent below
// exports = router