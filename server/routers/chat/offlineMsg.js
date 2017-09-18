var MongoClient=require('mongodb').MongoClient;
var DB_STR="mongodb://localhost:27017/we-chat";

var offLineFun={
	setItem:function(data){
		//data中name指发送此消息的用户，
		//username指接受此消息的用户，
		//message指消息内容
		MongoClient.connect(DB_STR,function(err,db){
			if(err){console.log(err);return}
			// console.log(data);
			var collection=db.collection('users');
			// collection.update({username:data.username},{$set:{offLineMessage:}})
			collection.findOne({username:data.username},function(err,doc){
				if (err) {console.log(err);res.json(resData);return}
				var offLineMsg=doc.offLineMsg
				// console.log(doc)
				offLineMsg.push(data);
				collection.update({username:data.username},{$set:{offLineMsg:offLineMsg}})
				db.close();
			})
		})
	},
	getItem:function(req,res){
		MongoClient.connect(DB_STR,function(err,db){
			if(err){console.log(err);return}
			var collection=db.collection('users');
			collection.findOne({username:req.query.name},function(err,doc){
				var data={
					message:doc.offLineMsg
				}
				res.json(data);
				//读取离线消息以后清空离线消息
				collection.update({username:req.query.name},{$set:{offLineMsg:[]}})
				db.close();
			})
		})
	}
}

module.exports=offLineFun