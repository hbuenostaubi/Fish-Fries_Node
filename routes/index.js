const express = require('express');
const router = express.Router();   ///we're not changing the server, so keep as const

/* GET home page. */
router.get('/', async function(req, res, next) {
  try{

    res.render('index', {
      // title: "Fish and Fries",
      layout: 'default',
      styles: ['/stylesheets/style.css','/stylesheets/style2.css']
    })

  }catch (err){
    next(err)
  }

})


module.exports = router;
