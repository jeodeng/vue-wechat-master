var MongoClient=require('mongodb').MongoClient;
var DB_STR="mongodb://localhost:27017/we-chat";

var resData={
	code:'0',
	msg:'此用户不存在'
}

function usertest(req,res){
	MongoClient.connect(DB_STR,function(err,db){
		if (err) {console.log(err);res.json(resData);return;}
		var collection=db.collection('users');
		collection.findOne({username:req.query.name},function(err,doc){
			if (err) {console.log(err);res.json(resData);return}
			if (!doc) { //取反为真，用户名不存在
				res.json(resData);
				return; 
			}else{
				resData.code='1';
				resData.msg='此用户存在';
				res.json(resData);
				db.close();
			}
		})
	})
}
module.exports=usertest;