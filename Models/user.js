var mongoose=require('mongoose');
var bcrypt=require('bcrypt-nodejs');
var bodyParser=require('body-parser');
var Schema = mongoose.Schema;
 
var UserSchema = new Schema({
  email:{type:String, unique:true,lowercase:true},
  password:String,

  profile:{
    name: {type:String,default:''},
    picture:{type:String,default:''}
  },
  address:String,
  history:[{
date:Date,
paid:{type:Number,default:0},
  }]
});
/* hashing the password before even saving it to the databse*/
UserSchema.pre('save',function(next)
{
  var user=this;
  if(!user.isModified('password')) return next();
  bcrypt.genSalt(10,function(err,salt){
    if (err) return next(err);
    bcrypt.hash(user.password, salt, null, function(err,hash){
      if (err) return next(err);
      user.password=hash;
      next();
    });
  });
});
/* compare password that we type in and the one stored in database*/ 
UserSchema.methods.comparePassword=function(password){
  return bcrypt.compareSync(password,this.password);
}

module.exports=mongoose.model('User', UserSchema);
