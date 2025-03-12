
import mongoose from 'mongoose';

const DoctorAppointment = mongoose.Schema({
    name :{
        type: String,
        required: true
    },
    email :{
        type: String,
        required: true,
    },
    rollno :{
        type: String,
        required: true
    } ,
    date:{
        type: String,
        required: true
    },
    time :{
        type: String,
        required: true
    },
    illness :{
        type: String,
    },
    bedrest:{
        type: Boolean,
        default: false
    },
    classCordinatorEmail:{
        type: String,
        required: true,
    },
    parentEmail :{
        type: String,
        required: true,
    },
    messege:{
        type: String,
    }
} , {timeStamp: true})

export default mongoose.model('DoctorAppointment', DoctorAppointment)