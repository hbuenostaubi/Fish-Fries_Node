const express = require('express');
const router = express.Router();   ///we're not changing the server, so keep as const
let reservationsStore = require('../app').ReservationsStore  ///to get key list
let moment = require('moment')
const { resController } = require('../controllers/res-controller')


router.get('/add', async (req, res, next) => {
    await resController.add(req,res,next)
})

router.post('/save', async (req, res, next)=>{
   await resController.save(req,res,next)
})

router.get('/view', async (req, res, next)=>{
    await resController.view(req,res,next)
})

router.get('/edit', async (req,res,next)=>{
    await resController.edit(req,res,next)
})

router.get('/destroy', async (req, res, next) => {
    await resController.destroy(req,res,next)

})

router.get('/jokey-jokes', async (req,res,next) =>{
    await resController.jokeyjokes(req,res,next)
})

router.get('/view_list', async (req, res, next) => {
    await resController.viewAll(req, res, next)
})


module.exports=router;