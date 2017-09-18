<template>
	<div id="login-frame">
		<h1 class="header">欢迎，请登录</h1>
		<div class="container">
			<form-body :config="config" :err-msg="errMsg" :form-data="formData"></form-body>
		</div>
		<div class="footer">
			<button @click="login">立即登录</button>
			<ul>
				<li v-for="item in loginMenu"><a href="javascript:" v-text="item.name" @click="item.action"></a></li>
			</ul>
		</div>
	</div>
</template>
<script>
import FormBody from './common/FormBody.vue'
import {cookieUtil} from '../util/cookieUtil.js'
export default{
	components:{'form-body':FormBody},
	data(){
		return {
			config:[
				{name:'username',value:'',type:'text'},
				{name:'password',value:'',type:'password'},
			],
			loginMenu:[
				{name:'关于我们',action:null},
				{name:'快速注册',action:this.toRegister}
			],
			errMsg:{
				username:{msg:'',flag:false},
				password:{msg:'',flag:false},
			},
			formData:{
				username:'',
				password:'',
			},
			url:'http://localhost:8081/user/login'
		}
	},

//说明：
// code : 0 登录成功
// code : 1 用户名不可为空
// code : 2 密码不可为空
// code : 3 账号不存在
// code : 4 密码填写有误
// 
	methods:{
		login:function(){
			//发送请求验证
			this.$http.post(this.url,this.formData).then(function(res){
				switch(res.data.code) {
					case '0':
						// console.log('登录成功') 
						cookieUtil.set('username',this.formData.username);
						window.location.replace('http://localhost:8081/chat');
						return;
					case '1':
						this.errMsg.username.msg=res.data.msg;
						this.errMsg.username.flag=true;
						this.errMsg.password.flag=false;
						return;
					case '2':
						this.errMsg.password.msg=res.data.msg;
						this.errMsg.password.flag=true;
						this.errMsg.username.flag=false;
						return;
					case '3':
						this.errMsg.username.msg=res.data.msg;
						this.errMsg.username.flag=true;
						this.errMsg.password.flag=false;
						return;
					case '4':
						this.errMsg.password.msg=res.data.msg;
						this.errMsg.password.flag=true;
						this.errMsg.username.flag=false;
						return;
					case '-1':alert('登录失败'); return;
					default  : alert('登录失败'); return;
				}
			},function(){})
			// this.$emit('user-login');
		},
		toRegister:function(){
			this.$emit('jump','register');
		}
	}
}
</script>
<style>
input,button{
	outline: none;
}
#login-frame{
	margin: 80px auto 0;
	width: 350px;height: 470px;
	box-sizing: border-box;
	box-shadow: 0 2px 4px 4px #777;
	padding: 14px;
	background: rgba(255,255,255,0.6);
}
#login-frame>.header{
	font-size: 28px;padding: 10px 5px;
	font-weight: normal;color:#666;
	text-align: center;
}
#login-frame>.container{
	font-size: 16px;
	margin-top: 20px;
	margin-bottom: 30px;
}
#login-frame>.footer{
	position: relative;
}
#login-frame>.footer>button{
	display: block;
	margin: 0 auto;
	height: 40px;width: 248px;
	border-radius: 10px;
	font-size: 16px;
	background: white;
}
#login-frame>.footer>ul{
	height: 20px;
	margin-top: 20px;
}
#login-frame>.footer>ul>li{
	float: right;
	padding: 2px 8px;border-right: 1px solid #666;
}
#login-frame>.footer>ul>li>a{
	color: black;font-size: 12px;font-family: '宋体';
	text-decoration: none;
}
#login-frame>.footer>ul>li:first-child{
	border:none;
}

</style>