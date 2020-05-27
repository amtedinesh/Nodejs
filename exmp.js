var express = require('express');
var app = express();

var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/user')

var userModel = new mongoose.Schema({
name:String,
});


var User = mongoose.model('user',userModel)


app.get('/getUser',function(req,res){
User.find({}).exec(function(err,result){
    console.log(result);
 res.json(result)
 })

})


app.listen(3000,function(){console.log(" listening 3000...")});