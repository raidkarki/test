const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');
require('dotenv').config()


mongoose.connect("mongodb://localhost:27017/Userdatabase",{useNewUrlParser:true})


const userschema=new mongoose.Schema({
  email:{
    type:String,
    required:true
  },
  password:{
    type:String,
    required:true
  }
});



var secret = process.env.SOME_LONG_UNGUESSABLE_STRING;
userschema.plugin(encrypt, { secret: process.env.SECRET_KEY ,encryptedFields: ['password'],additionalAuthenticatedFields: ['email'],decryptPostSave: false});


const User=mongoose.model("user",userschema);

const app =new express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));



app.get("/",function (req,res) {
  res.render("home")

})
app.get("/login",function(req,res){
  res.render("login")
})
app.get("/register",function(req,res){

  res.render("register")
})
app.post("/register",function (req,res) {
  const newuser=new User({
    email:req.body.username,
    password:req.body.password

  })
  console.log(newuser);
newuser.save(function(err){ // encrypted when sent to the database
      if(err) throw err;
      res.render("secrets")               // decrypted in the callback


})



})
app.post("/login",function (req,res) {
  const email=req.body.username
  const password=req.body.password
User.findOne({email:email},function(err,userfound){
  if (err) {
    console.log(err);

  }else{
    if(userfound){
    console.log("userfound");
    if (userfound.password===password) {
      res.render("secrets")
}

}

}})
})
//TODO

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
