
require('dotenv').config();  //env file var access
const express=require('express');  //initialization code
const morgan=require('morgan');
const cors =require('cors');
const app=express();
const port=process.env.PORT;
const database=require('./database');
const userController=require('./controllers/user');

app.use(morgan('dev'));         //middleware setup
app.use(cors());
app.use('/AWS/',userController);

app.all(                                       //default routers
'/',
function(req,res){
    return res.json({
        status:true,
        message:'Index page working......' //return or res.send('working')
    });
}
);

//starting server
app.listen(
    port,
function(){
    console.log('Server running at port: '+ port);
});