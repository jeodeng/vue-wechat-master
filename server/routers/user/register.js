var MongoClient=require('mongodb').MongoClient;
var DB_STR="mongodb://localhost:27017/we-chat";

var resData={
	code:'9',
	msg:'数据库连接出现错误',
}

//验证密码 (6-18位，字母、数字、特殊符)
function checkPassword(value){
	var re=/^.{6,18}$/;
	return re.test(value);
}
//验证用户名只能是英文或者数字 (4-10位)
function checkUserName(value){
	var re=/^[A-Za-z0-9]{4,10}$/;
	return re.test(value);
}

//注册验证逻辑
//说明：
// code : 0 注册成功
// code : 1 用户名已存在
// code : 2 用户名不可为空
// code : 3 密码不可为空
// code : 4	用户名不符合格式
// code : 5 密码不符合格式
// 

function register(req,res){
	if(!req.body.username){
		resData.code='2';
		resData.msg='用户名不可为空';
		res.json(resData);
		return;
	}else if(!req.body.password){
		resData.code='3';
		resData.msg='密码不可为空';
		res.json(resData);
		return;
	}else if(!checkUserName(req.body.username)){
		resData.code='4';
		resData.msg='用户名必须是英文或者数字 (4-10位)';
		res.json(resData);
		return;
	}else if(!checkPassword(req.body.password)){
		resData.code='5';
		resData.msg='密码必须符合 (6-18位，字母、数字、特殊符)';
		res.json(resData);
		return;
	}

	MongoClient.connect(DB_STR,function(err,db){
		if (err) {console.log(err);res.json(resData);return;}
		var collection=db.collection('users');
		collection.findOne({username:req.body.username},function(err,doc){
			if (err) {console.log(err);res.json(resData);return}
			if (!doc) { //取反为真，此用户名未注册
				var user=req.body;
				user.offLineMsg=[]; //动态开辟属性，离线消息
				collection.insert(user); //向数据库插入数据
				resData.code='0';
				resData.msg='恭喜，此用户名可注册';
				res.json(resData);
				return; 
			}else{
				resData.code='1';
				resData.msg='不可注册，此用户名已存在';
				res.json(resData);
				return;
			}
		})
	})
}

module.exports=register;