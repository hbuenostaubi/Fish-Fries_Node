let User = require('../models/user').User
const { body, validationResult } = require('express-validator')
const passport= require('passport')

//creating object literal
exports.userController = {
    create: async (req,res) => {
        const errors=validationResult(req)
        if(!errors.isEmpty()) {
            //maps each error to a string so that each is displayed on its own line
            req.flash('error', errors.array().map(e => e.msg + '</br>').join(''))
            res.redirect('/users/register')
        }  else {
            try{
                let userParams = getUserParams(req.body)
                let newUser = new User(userParams)
                let user = await User.register(newUser, req.body.password)
                req.flash('success', `${user.fullName}'s account created successfully`)
                res.redirect('/')
            } catch (error){
                console.log(`Error saving user: ${error.message}`)  ///backtick quotes
                req.flash('error', `Failed to create user account. Invalid email.`)
                res.redirect('back')
            }
        }
    },

    authenticate: async (req,res,next) => {
        await passport.authenticate('local', function (err,user, info){
          if(err)
              return next(err)
          if(!user){
              req.flash('error', 'Failed to login')
              return res.redirect('back')
          }
          req.logIn(user, function (err){
              if(err)
                  return next(err)
              req.flash('success', `${user.fullName} logged in!`)
              return res.redirect('/')
          })

        })(req,res,next);  //to just be safe
    },

    exit: async (req,res) => {
        req.logout();
        res.redirect('/')
    },
    view: async (req,res, next) =>{
        try{
            res.render('users/account', {
                title: "User Profile",
                userID: req.user.id,
                nameFirst: req.user.name.first,
                nameLast: req.user.name.last,
                email: req.user.email,
                phone: req.user.phone
            })
        }catch (err){
            next(err)
        }
    },

    destroy: async (req, res, next ) =>{
        try{
            await User.findOneAndDelete({_id:req.user.id.trim()})
            res.redirect('/')
        }catch (err) {
            next(err)
        }

    },

    edit: async (req, res, next) => {
        try {
            // const reservation = await User.findOne({_id:req.user.id.trim()})
            res.render('users/edit_account', {
                title: 'Edit Account',
                userID:req.user.id.trim(),
                firstName:req.user.name.first,
                lastName:req.user.name.last,
                email:req.user.email,
                phone:req.user.phone,
                password: req.user.password
            })
        } catch (err){
            next(err)
        }
    },

    save: async (req, res, next) =>{
        try{
        await User.findByIdAndUpdate({_id:req.user.id.trim()},
            {
                name: {
                    first: req.body.firstName,
                    last:req.body.lastName},
                email: req.body.email,
                phone:req.body.phone},
            {new:true})

        await User.findById(req.user._id)
            .then(foundUser => {
                foundUser.changePassword(req.body.oldPassword, req.body.password)
                    .then(() => {
                        req.flash('success', `Changes made to user account.`)
                        res.redirect('/')
                    })
                    .catch((error) => {
                        req.flash('error', `Changes not made.`)
                        res.redirect('back')
                    })
            })
            .catch((error) => {
                console.log(error);
            })
    }catch (err){
        next(err)}
    }

}

const getUserParams = body => {
    return {
        name: {
            first: body.first,
            last: body.last,
        },
        email: body.email,
        password:body.password,
        phone: body.phone
    }
}


exports.registerValidations = [
    body('first')
        .notEmpty().withMessage('First name is required')
        .isLength({min:2}).withMessage('First name must be at least 2 characters') ,
    body('last')
        .notEmpty().withMessage('Last name is required')
        .isLength({min:2}).withMessage('Last name must be at least 2 characters') ,
    body('password')
        .notEmpty().withMessage('Password is required')
        .isLength({min:8}).withMessage('Password must be at least 8 characters') ,
    body('email').isEmail().normalizeEmail().withMessage('Email is invalid')
    //validators are on the powerpoint Lecture 11
]