const mongoose = require ('mongoose')

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:false
    },
    selectedServices: [{
         type: String, 
         required: true 
        }],
    selectedSubServices:[{
        name: { type: String, required: true },
        price: { type: Number, required: true }
      }],
    

    staff:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        required:true
    },
    address:{
        type:String,
        required:false
    },
    totalPrice: { 
        type: Number, 
        required: true
     },
     wage : {
        type: Number,
     },
     status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected'],
        default: 'pending'
     }
})


const Appoinment = mongoose.model('User_Appoinment',userSchema)

module.exports = Appoinment