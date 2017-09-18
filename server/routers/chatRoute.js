var express = require('express');
var router = express.Router();

router.use(function (req, res, next) {
	if (!req.session.user) {
		// console.log('验证失败,跳转回首页登录');
		res.redirect('index');
		return;
	}else{
	    next();
	}
});

router.get('/',function(req,res,next){
	// console.log('成功,进入聊天室');
	// console.log(req.cookies);
	res.render('wechat.html');
})
router.get('/usertest',function(req,res,next){
	var usertest = require('./chat/usertest.js');
	usertest(req,res);
})
router.get('/getOffLineMsg',function(req,res){
	var getOffLineMsg = require('./chat/offlineMsg.js').getItem;
	getOffLineMsg(req,res)
})
module.exports = router;