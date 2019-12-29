var express = require('express');
var morgan = require('morgan');
var mongoose=require('mongoose');
var bodyParser=require('body-parser');
var ejs=require('ejs');
var engine=require('ejs-mate');
var session=require('express-session');
var cookieParser=require('cookie-parser');
var flash=require('express-flash');

var secret=require('./config/secret');
var User=require('./Models/user');

var app=express();

mongoose.connect(secret.database,function(err) {
  if(err){
    console.log(err);
  }else{
    console.log("Connect to the database");
  }
});

// middlewear/
app.use(express.static(__dirname + '/public'));
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(session({
  resave:true,
  saveUinitialized:true,
  secret: secret.secretKey
}));
app.use(flash()); 

app.engine('ejs',engine);
app.set('view engine','ejs');
var mainRoutes=require('./routes/main');
var userRoutes=require('./routes/user');
app.use(mainRoutes);
app.use(userRoutes);


app.post('/create-user',function(req,res,next){
  var user=new User();
user.profile.name=req.body.name;
user.password=req.body.password;
user.email=req.body.email;

user.save(function(err){
  if (err)next(err);
  res.json('Succesfully created a new user');
});
});
app.get('/',function(req,res){
  res.render('main/home');
});

app.get('/',function(req,res){
  res.render('main/about');
});

app.listen(secret.port,function(err){
  if(err) throw err;
  console.log("server is running on port" + secret.port);
});
