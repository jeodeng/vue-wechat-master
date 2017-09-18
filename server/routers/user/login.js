var MongoClient=require('mongodb').MongoClient;
var DB_STR="mongodb://localhost:27017/we-chat";

var resData={
	code:'9',
	msg:'数据库连接出现错误',
}


//注册验证逻辑
//说明：
// code : -1 登录失败
// code : 0 登录成功
// code : 1 用户名不可为空
// code : 2 密码不可为空
// code : 3 账号不存在
// code : 4 密码填写有误

function login(req,res){
	if(!req.body.username){
		resData.code='1';
		resData.msg='用户名不可为空';
		res.json(resData);
		return;
	}else if(!req.body.password){
		resData.code='2';
		resData.msg='密码不可为空';
		res.json(resData);
		return;
	}

	MongoClient.connect(DB_STR,function(err,db){
		if (err) {console.log(err);res.json(resData);return;}
		var collection=db.collection('users');
		collection.findOne({username:req.body.username},function(err,doc){
			if (err) {console.log(err);res.json(resData);return}
			if (!doc) { //取反为真，用户名不存在
				resData.code='3';
				resData.msg='此账号不存在';
				res.json(resData);
				return; 
			}else if(doc.password!=req.body.password){
				resData.code='4';
				resData.msg='填写的密码有误';
				res.json(resData);
				return; 
			}
			else{
				req.session.regenerate(function(err){
					if (err) {
					resData.code='-1';
					resData.msg='登录失败';
					res.json(resData);
					return; 
					}
					req.session.user=req.body.username;
					resData.code='0';
					resData.msg='登录成功';
					res.json(resData);
					return;					
				})

			}
		})
	})
}

module.exports=login;