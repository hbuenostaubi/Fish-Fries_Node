let Reservation = require('../models/reservations').Reservation
let moment = require('moment')
let {User} = require('../models/user')
const axios = require('axios').default

//// check views/reservation/add or destroy etc
exports.resController = {
///render reservation and redirect reservations b/c of router
    save: async (req,res,next) => {
        try{
            let reservation
            if(req.body.saveMethod === 'create'){
                reservation = await create(req.body.title, req.body.body, req.body.tableTime, req.body.tableParty)
                req.user.reservations.push(reservation.id.trim())
                req.user = await User.findByIdAndUpdate({_id:req.user.id.trim()}, {reservations:req.user.reservations}, {new:true})
            } else {
                reservation = await update(req.body.resId, req.body.title, req.body.body, req.body.tableTime, req.body.tableParty)

            }
            res.redirect('/reservations/view?id='+reservation._id)
        } catch (err) {
            next(err)
        }
    },

    add: async (req, res, next) => {
        if(req.isAuthenticated()){
            try {
                res.render('reservation/add_res', {
                    doCreate: true,
                    title: 'Add a reservation',
                    isHomeActive: "",
                    isAddResActive: "active"
                })
            } catch (err) {
                next(err)
        }
        }else{
            req.flash('error', 'Please log in to access reservations')
            res.redirect('/users/login')
        }
    },

    edit: async (req, res, next) => {
    try {
        const reservation = await Reservation.findOne({_id:req.query.id.trim()})
        res.render('reservation/edit_res', {
            doCreate: false,
            title: 'Edit Reservation',
            resId: req.query.id,
            resTitle: reservation.title,
            resBody: reservation.body,
            tableTime: moment(reservation.time).format(moment.DATETIME_LOCAL),  //format date  moment pkg npm
            tableParty: reservation.party
        })
        console.log(moment(reservation.time).format("YYYY-MM-DDTHH:mmZ"))
    } catch (err){
        next(err)
        }
    },

    view: async (req,res, next) => {
        try{
            const reservation = await Reservation.findOne({_id:req.query.id.trim()})

            res.render('reservation/view_res', {
                title: "View Reservation",
                resId: req.query.id,
                resTitle: reservation.title,
                resBody:reservation.body,  ////moment(reservation.time).format("MM-dd-yyyyThh:mm")
                tableTime: moment(reservation.time).format("LLL"),  //format date  moment pkg npm
                tableParty: reservation.party
            })

            console.log(moment(reservation.time).format(moment.DATETIME_LOCAL))
        }catch (err){
            next(err)
        }
    },

    destroy: async (req, res, next ) =>{
        try{
            await Reservation.findOneAndDelete({_id:req.query.id.trim()})
            res.redirect('/')
        }catch (err) {
            next(err)
        }

    },

    viewAll: async (req, res, next) => {
        try{
            let resIds = req.user.reservations
            let resPromises = resIds.map(id => Reservation.findOne({_id:id}))
            let reservations = await Promise.all(resPromises)
            let allReservations = reservations.map( reservation =>{
                return {
                    id: reservation.id,
                    title: reservation.title
                }
            })
            res.render('reservation/view_list', {
                title: "Reservations",
                resList: allReservations,
                isHomeActive: "active"
            })
        } catch (err) {
            next(err)
        }
    },

    jokeyjokes: async (req,res,next) => {
        try{
            const jokePromise = axios.get("https://sv443.net/jokeapi/v2/joke/Any?blacklistFlags=nsfw,racist,sexist&type=single")
            res.render('reservation/jokey-jokes', {
                joke: (await jokePromise).data.joke
            })

            console.log(moment(reservation.time).format(moment.DATETIME_LOCAL))
        }catch (err){
            next(err)
        }
    }
}

    create = async (title,body, time, party) => {
        let reservation = new Reservation({
            title:title,
            body:body,
            time: time,
            party: party
        })
        reservation = await reservation.save()
        return reservation;
    }

    update = async (id, title, body, time, party) => {
        id = id.trim()
        let reservation = Reservation.findByIdAndUpdate({_id:id}, {title: title, time:time, party: party, body:body},
            {new:true})
        return reservation;

    }

    // getJokes = async () => {
    //         let jokePromise = axios.get("https://sv443.net/jokeapi/v2/joke/Any?blacklistFlags=nsfw,racist,sexist&type=single")
    //         jokePromise
    //             .then( value => {
    //                 const newSpan=document.createElement("span")
    //                 const contentText=document.createTextNode(value.data.joke)
    //                 newSpan.appendChild(contentText);
    //                 let el = document.querySelector("div");
    //                 console.log(el)
    //                 el.appendChild(newSpan)
    //                 return document.body.appendChild(el)
    //             })
    //             .catch(
    //                 error => {
    //                     console.log('error 1: ' + error)
    //                 })
    // }
