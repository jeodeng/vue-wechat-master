<template>
	<div id="chat-room">
		<dialog-list :user-info="userInfo" :dialog-items="dialogItems" @readMsg="readMsg" @create-dialog="createDialog"></dialog-list>
		<template v-for="item in dialogItems">
			<chat-frame :dialog-data="item.dialogData" @sendMsg="sendMsg" v-show="curDialogItem==item.name"></chat-frame>			
		</template>

		<online-user :online-user="onlineUser"></online-user>
	</div>
</template>
<script>

import ChatFrame from './components/ChatFrame.vue';
import DialogList from './components/DialogList.vue';
import OnlineUser from './components/OnlineUser.vue';
import {cookieUtil} from './util/cookieUtil.js'

export default {
	components:{
		'chat-frame':ChatFrame,
		'dialog-list':DialogList,
		'online-user':OnlineUser
	},
	data:function(){
		return {
			userInfo:{
				username:'',
				imgUrl:'',
			},
			dialogItems:[
				{
					name:'public',
					img:'',
					msgNum:'0',
					dialogData:{
						title:'public',
						msgData:[
						],
					},
				},
			],
			// dialogData:{
			// 	title:'public',
			// 	msgData:[
			// 	],
			// },
			onlineUser:[
				{
					name:'public',
					users:[],
				},
				// {
				// 	name:'private',
				// 	users:['测试1','测试2']
				// }
			],
			socket:null,
			curDialogItem:'public',
		}
	},
	created:function(){
		this.userInfo.username=cookieUtil.get('username');
		//发送请求建立websoket连接，
		this.socket=io();

		//获取在线用户，仅在客户端建立连接是发送一次
		this.getOnlineUser()

		//监听是否有用户加入公聊
		this.userEnter();

		//开启接受公聊消息
		this.publicChatConnection();

		//开启接受私聊消息
		this.privateChatConnection();

		//获取当前用户离线留言
		this.getOffLineMsg();
	},
	methods:{
		//读取消息，切换聊天窗口
		readMsg:function(name){
			//发送请求，获取当前聊天内容;
			for (var i = 0; i < this.dialogItems.length; i++) {
				if (this.dialogItems[i].name==name) {
					this.curDialogItem=name;
					this.dialogItems[i].msgNum=0;
					break;
				}
			}
		},
		//发起回话，创建聊天窗口
		createDialog:function(name){
			var temp={
					name:name,
					img:'',
					msgNum:'0',
					dialogData:{
						title:name,
						msgData:[
						],
					},
			};
			this.dialogItems.push(temp);
			this.curDialogItem=name;
		},
		//发送消息事件
		sendMsg:function(temp){

			var dialog={
				name:this.userInfo.username,
				type:'1',
				message:temp.message
			};
			//找到发送的窗口
			for (var i = 0; i < this.dialogItems.length; i++) {
				if (this.dialogItems[i].name==temp.toWho) {
					this.dialogItems[i].dialogData.msgData.push(dialog)
					break;
				}
			}
			// console.log(temp);
			//如果是给公聊发送消息
			if (temp.toWho=='public') {
				var data={
					name:this.userInfo.username,
					message:temp.message,
				}
				this.socket.emit('public',JSON.stringify(data));
			}else{//给私聊发送消息
				var data={
					username:temp.toWho,
					name:this.userInfo.username,
					message:temp.message,
				}
				this.socket.emit(this.userInfo.username,JSON.stringify(data));
			}
		},
		//开启公聊 建立连接
		publicChatConnection:function(){
			var that=this;
			//监听公聊消息事件
			this.socket.on('public',function(data){
				var data=JSON.parse(data);
				// console.log(data);
				//判断是不是别人发送的消息
				if (data.name!=that.userInfo.username) {
					// 如果是别人发送的消息
						var dialog={
							name:data.name, // 谁发的
							type:'2', //代表别人发送的消息
							message:data.message, //消息的内容
						};
						//在聊天窗口中渲染这条消息
						for (var i = 0; i < that.dialogItems.length; i++) {
							if (that.dialogItems[i].name=='public') {
								that.dialogItems[i].dialogData.msgData.push(dialog);
								//如果公聊窗口未打开，但公聊窗口收到消息，则显示未读消息
								if (that.curDialogItem!='public') {
									that.dialogItems[i].msgNum++;
								}
								break;
							}
						}
					return;
				}else{//如果不是，那就是自己发送的消息
					return;
				}
			})
		},
		//开启私聊，建立连接
		privateChatConnection:function(){
			var name=this.userInfo.username;
			var that=this;
			this.socket.on(name,function(data){
				var data=JSON.parse(data);
				// console.log(data);
				var dialog={
					name:data.name, // 谁发的
					type:'2', //代表别人发送的消息
					message:data.message, //消息的内容
				};
				
				//判断当前聊天列表中是否存在此用户
				//在聊天窗口中渲染这条消息
				for (var i = 0; i < that.dialogItems.length; i++) {
					if (that.dialogItems[i].name==data.name) {
						//存在此用户，直接渲染消息
						that.dialogItems[i].dialogData.msgData.push(dialog);
						//如果当前窗口未打开，但收到消息，则显示未读消息
						if (that.curDialogItem!=data.name) {
							that.dialogItems[i].msgNum++;
						}
						return;
					}
				}
				//不存在,添加此聊天窗口
				var temp={
						name:data.name,
						img:'',
						msgNum:'1', //第一次接受消息，未读数为1
						dialogData:{
							title:data.name,
							msgData:[
							],
						},
				};
				temp.dialogData.msgData.push(dialog);
				that.dialogItems.push(temp);
			})
		},
		//新用户加入
		userEnter:function(){
			var that=this;
			//监听是否有用户加入公聊
			this.socket.on('userEnter',function(data){
				var data=JSON.parse(data);
				var dialog={
					name:'admin',
					type:'2',
					message:data.msg,
				}
				//在公聊窗口渲染消息，有新用户加入
				for (var i = 0; i < that.dialogItems.length; i++) {
					if (that.dialogItems[i].name=='public') {
						that.dialogItems[i].dialogData.msgData.push(dialog);
						//如果公聊窗口未打开，但公聊窗口收到消息，则显示未读消息
						if (that.curDialogItem!='public') {
							that.dialogItems[i].msgNum++;
						}
						break;
					}
				}
				//有新用户加入，在线用户同步
				for(var i in that.onlineUser){
					if (that.onlineUser[i].name=='public') {
						that.onlineUser[i].users=data.nowOnlieUsers
						break;
					}
				}
			});
		},
		//退出聊天室
		userOut:function(){
			//发送退出聊天室事件
			this.socket.emit('userOut',this.userInfo.username);
		},
		//获取在线用户
		getOnlineUser:function(){
			var that=this;
			this.socket.emit('get onlineUser','public');
			this.socket.on('get onlineUser',function(data){
				var data=JSON.parse(data)
				for(var i in that.onlineUser){
					if (that.onlineUser[i].name==data.type) {
						that.onlineUser[i].users=data.users
					}
				}
			})
		},
		//获取当前用户离线信息
		getOffLineMsg:function(){
			this.$http({
				url:'http://localhost:8081/chat/getOffLineMsg/?name='+this.userInfo.username,
				method:'get'
			}).then(function(res){
				var data=res.data.message
				console.log(res.data);
			},function(){})
		}
	}
}
</script>
<style>
	#chat-room{
		width: 1100px;overflow: hidden;
		min-height: 640px;max-height: 1000px;
		margin: 1px auto;
		background: white;
		font-size: 0;
	}
	#chat-room>div{
		height: 640px;
		font-size: 16px;
		float: left;
		border-radius: 2px;
		overflow: hidden;
	}
</style>