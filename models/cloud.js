const mongoose = require('mongoose');

//schema
const userSchema = mongoose.Schema({
    cloudnickname: {
        type: String,
        required: true
    },   
    accountid: {
        type: String,
        required: true,
       
    },
    accessKeyId: {
        type: String,
        required: true
    },
    secretAccessKey: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now()
    }
});

//model
mongoose.model('cloud', userSchema);

module.exports = mongoose.model('cloud');