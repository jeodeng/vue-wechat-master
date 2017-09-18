var publicOnlieUsers=[];

function arrUnique(arr){
	var res=[];
	var obj={};
	for(var i=0;i<arr.length;i++){
		if (!obj[arr[i]]) {
			res.push(arr[i]);
			obj[arr[i]]=1;
		}
	}
	return res;
}

function socket(io,name) {
	//有客户端通过socket连接服务器触发connections事件
	io.on('connection',function(socket){

		publicOnlieUsers.push(name.name);
		var addInfo={
			name:name.name,
			msg:'欢迎'+name.name+'加入聊天',
			nowOnlieUsers:arrUnique(publicOnlieUsers),
		}
		socket.broadcast.emit('userEnter',JSON.stringify(addInfo));

		//获取在线用户，仅在客户端建立连接是发送一次
		socket.on('get onlineUser',function(data){
			if (data=='public') {
				var onlineUser={
					type:'public',
					users:arrUnique(publicOnlieUsers)
				}
				socket.emit('get onlineUser',JSON.stringify(onlineUser));
			}
		})
		
		//私聊消息，在建立socket连接时根据客户端连接的用户名创建
		socket.on(name.name,function(data){
			// var info={}
			var data=JSON.parse(data);
			var index=publicOnlieUsers.indexOf(data.username);
			if (index=='-1') { //此用户不在线
				// console.log('用户不在线');
				var offLineFn=require('./chat/offlineMsg.js');
				offLineFn.setItem(data);
			}else{
				//发送给对象
				socket.broadcast.emit(data.username,JSON.stringify(data));				
			}
		})

		socket.on('public',function(data){
			// var info={}
			var data=JSON.parse(data);
			//把公聊消息广播给所有客户端的公聊频道
			socket.broadcast.emit('public',JSON.stringify(data));
		})	
	});

};

module.exports=socket;