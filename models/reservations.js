const mongoose =require('mongoose')

const ResSchema = new mongoose.Schema({

    title: {
        type: String,
        required:[true,'Name is required']
    },
    time:{
        type: Date,
        require: true
    },
    party:{
        type: Number,
        required: true
    },
    body:{
        type: String,
        require:false
    }
})

ResSchema.set('toObject', { getters: true, virtuals: true})

exports.Reservation = mongoose.model('reservations', ResSchema)  //in db Reservation