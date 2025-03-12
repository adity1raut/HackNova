
import mongoose  from "mongoose";

const docterSchema = new mongoose.Schema({
    ower_id :{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name :{
        type: String,
        required: true
    },
    email :{
        type: String,
        required: true,
        match: /.+\@.+\..+/
    },
    phone :{
        type: String,
        required: true
    },
    ilness :{
        type: String,
        required: true
    },
    time :{
        type: String,
        required: true
    },
    date :{
        type: Date,
        required: true
    },

},{timestamps: true});

const Docter = mongoose.model('Docter', docterSchema);

export default Docter;