var express=require('express');
var router=express.Router();

var userInfo;

router.use(function (req, res, next) {
    userInfo={
    	username:'',
    	password:''
    }
    next();
});
//这里的路径不需要'/user/register'
router.post('/register',function(req,res,next){
	var register=require('./user/register.js');
	register(req,res);
})

router.post('/login',function(req,res,next){
	var login=require('./user/login.js');
	login(req,res);
})

module.exports = router;