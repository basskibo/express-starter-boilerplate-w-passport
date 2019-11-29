import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique : false
    },
    price : {
        type: Number,
        min : 0
    },
    //author will be seperated collection with more info about author check https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/mongoose
    author: {
        type: String,
    },
    length: {
        type: Number,
        min : 0
    },
    number_of_chapters: {
        type: Number,
        min: 1
    },
    narrator: {
        type: String
    },
    summary : {
        type: String
    },
    genres:{
        //NEEDS TO BE CHANGED TO REFERENT COLLECTION as author
        type: Array
    },
    img_url:{
        type: String
    }




});