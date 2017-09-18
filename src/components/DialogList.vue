<template>
	<div class="dialog-list">
		<div class="d-head">
			<div><img :src="userInfo.imgUrl" alt="头像"></div>
			<span v-text="userInfo.username"></span>
			<a class="setting-btn" href="javascript:;" @click="userSetting"></a>
			<div class="create-dialog">
				<input type="text" v-model="createName">
				<input type="button" value="发起对话" @click="createDialog">
			</div>
			<div class="setting-case" v-show='settingShow'>
				<ul>
					<li v-for="opt in settingConfig">
						<i :class="opt.icon"></i><em v-text="opt.name"></em>
					</li>
				</ul>
			</div>
		</div>
		<ul class="d-tab">
			<li :class="{active:curTab==item.name}" v-for="item in config" v-text="filterPro(item.name)" @click="curTab=item.name"></li>
		</ul>
		<div class="d-list">
			<ul v-show="curTab=='dialog'">
				<li v-for="(item,index) in dialogItems" @click="readMsg(item.name)">
					<div>
						<img :src="item.img">
					</div>
					<h1 v-text="filterPro(item.name)"></h1>
					<em v-show="item.msgNum>0">{{unReadMsg(item.msgNum)}}</em>
				</li>
			</ul>
			<ul v-show="curTab=='friends'">
				<li>联系人1</li>
			</ul>
		</div>
	</div>
</template>
<script>

	export default {
		props:['dialogItems','userInfo'],
		data:function(){
			return {
				config:[
					{name:'dialog'},
					{name:'friends'}
				],
				createName:'',
				curDialog:'',
				curTab:'dialog',
				settingShow:false,
				settingConfig:[
					{name:'个人信息',icon:''},
					{name:'发起聊天',icon:''},
					{name:'意见反馈',icon:''},
					{name:'退出登录',icon:''},
				]
			}	
		},
		methods:{
			userSetting:function(){
				this.settingShow=true;
			},
			unReadMsg:function(num){
				return num>99?'99+':num
			},
			readMsg:function(name){
				if (this.curDialog==name) return;
				this.curDialog=name;
				for(var i in this.dialogItems){
					if (this.dialogItems[i].name==name) {
						// this.dialogItems[i].msgNum=0;
						//发送消息，阅读此联系人窗口
						this.$emit('readMsg',name);
						return;
					}
				}
			},
			filterPro:function(p){
				switch(p) {
					case 'friends': return '联系人';
					case 'dialog' : return '会话列表';
					case 'public' : return '聊天广场';
					default : return p;
				}
			},
			createDialog:function(){
				//如果为空则直接return,不发起对话
				if (!this.createName) return;
				//发送请求判断发起对话的用户是否存在
				this.$http({
					url:'http://localhost:8081/chat/usertest?name='+this.createName,
					method:'get',
				}).then(function(res){
					if (res.data.code=='0') {
						alert(res.data.msg);
					}else if(res.data.code=='1'){
						this.$emit('create-dialog',this.createName);
						this.createName='';						
					}
				},function(){})
			}
		}
	}
</script>
<style>
	.dialog-list{
		background: #2e3238;
		width: 280px;
	}
	.dialog-list>*{
		box-sizing: border-box;
		padding: 10px;
	}
	.dialog-list>.d-head{
		height: 80px;
		padding-bottom: 20px;
		box-sizing: border-box;
		position: relative;
		margin-bottom: 60px;
	}
	.dialog-list>.d-head>div:nth-of-type(1){
		background: white;float: left;
		width: 48px;height: 48px;
	}
	.dialog-list>.d-head>div:nth-of-type(1) img{
		width: 100%;
	}
	.dialog-list>.d-head>.create-dialog{
		height: 34px;width: 244px;
		position: absolute;
		top: 100%;left: 50%;
		transform: translateX(-50%);
		background-color: #26292e;
		font-size: 0;
	}
	.dialog-list>.d-head>.create-dialog input{
		height: 100%;
		background: transparent;
		border:none;
		display: inline-block;
		color: white;font-size: 14px;
		box-sizing: border-box;
		padding: 2px 6px;outline: none;
	}
	.dialog-list>.d-head>.create-dialog input[type='text']{
		width: 160px;
	}
	.dialog-list>.d-head>.create-dialog input[type='button']{
		width: 80px;
		cursor: pointer;
	}
	.dialog-list>.d-head>span{
		display: block;float: left;
		padding-left: 8px;height: 60px;
		color: white;font-size: 18px;
		line-height: 56px;
	}
	.dialog-list>.d-head>.setting-case{
		position: absolute;
		right: 10px;top: 50%;
		width: 16px;height: 16px;
		background: green;
	}
	.dialog-list>.d-head>.setting-btn{
		display: block;
	}
	.dialog-list>.d-tab{
		height: 60px;
		border-bottom: 1px solid #24272c;
	}
	.dialog-list>.d-tab li{
		float: left;width:90px;
		box-sizing: border-box;
		padding: 5px 10px;font-size: 16px;
		color: white;
		cursor: pointer;
		margin-right: 8px;
		border-radius: 5px;text-align: center;
	}
	.dialog-list>.d-tab li:hover,.dialog-list>.d-tab li.active{
		background: #54565a;
	}
	.dialog-list>.d-list{
		padding: 10px;
		box-sizing: border-box;
		padding: 0;
		overflow: auto;
	}
	.dialog-list>.d-list ul{
		min-height: 420px;
	}
	.dialog-list>.d-list li{
		padding: 5px 12px;position: relative;
		border-bottom:1px solid #24272c;
		height: 66px;box-sizing: border-box;
		cursor: pointer;
	}
	.dialog-list>.d-list li:hover,.dialog-list>.d-list li.active{
		background: #3a3f45;
	}
	.dialog-list>.d-list li>*{
		display: inline-block;
	}
	.dialog-list>.d-list li>div{
		position: absolute;
		left: 10px;top: 50%;
		transform: translateY(-50%);
		width: 40px;height: 40px;
		background: white;
	}
	.dialog-list>.d-list li>h1{
		font-size: 16px;color: white;
		font-weight: normal;
		height: 100%;
		margin-left: 48px;
		padding-top: 8px;
	}
	.dialog-list>.d-list li>em{
		color: white;
		position: absolute;
		top: 10px;right: 16px;
		width: 30px;height: 20px;
		border-radius: 10px;
		background: #ec1515;
		line-height: 20px;text-align: center;
		font-style: normal;
		font-size: 12px;
	}
</style>