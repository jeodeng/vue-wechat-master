<template>
	<div id="register-frame">
		<h1 class="header">注册</h1>
		<div class="container">
			<form-body :config="config" :err-msg="errMsg" :form-data="formData"></form-body>
		</div>
		<div class="footer">
			<button @click="register">提交注册</button>
			<ul>
				<li v-for="item in registerMenu"><a href="javascript:" v-text="item.name" @click="item.action"></a></li>
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
			registerMenu:[
				{name:'关于我们',action:null},
				{name:'已注册，立即登录',action:this.toLogin}
			],
			errMsg:{
				username:{msg:'',flag:false},
				password:{msg:'',flag:false},
			},
			formData:{
				username:'',
				password:'',
			},
			url:'http://localhost:8081/user/register'
		}
	},
	//说明：
	// code : 0 注册成功
	// code : 1 用户名已存在
	// code : 2 用户名不可为空
	// code : 3 密码不可为空
	// code : 4	用户名不符合格式
	// code : 5 密码不符合格式
	methods:{
		register:function(){
			//发送请求验证是否能够注册
			this.$http.post(this.url,this.formData).then(function(res){
				if (res.data.code=='5'||res.data.code=='3') {
					// console.log('密码不符合格式')
					this.errMsg.password.msg=res.data.msg;
					this.errMsg.password.flag=true;
					this.errMsg.username.flag=false;
				}else if(res.data.code=='1'||res.data.code=='2'||res.data.code=='4'){
					// console.log('用户名')
					this.errMsg.username.msg=res.data.msg;
					this.errMsg.username.flag=true;
					this.errMsg.password.flag=false;
				}else if(res.data.code=='0'){
					cookieUtil.set('username',this.formData.username);
					if (confirm('注册成功，立即登录')) {
						window.location.replace('http://localhost:8081/chat')
					}else{
						window.location.reload();
					}
				}
			},function(){})
		},
		toLogin:function(){
			this.$emit('jump','login');
		}
	}
}
</script>
<style>
input,button{
	outline: none;
}
#register-frame{
	margin: 80px auto 0;
	width: 350px;height: 470px;
	box-sizing: border-box;
	box-shadow: 0 2px 4px 4px #777;
	padding: 14px;
	background: rgba(255,255,255,0.6);
}
#register-frame>.header{
	font-size: 28px;padding: 10px 5px;
	font-weight: normal;color:#666;
	text-align: center;
}
#register-frame>.container{
	font-size: 16px;
	margin-top: 20px;
	margin-bottom: 30px;
}
#register-frame>.footer{
	position: relative;
}
#register-frame>.footer>button{
	display: block;
	margin: 0 auto;
	height: 40px;width: 248px;
	border-radius: 10px;
	font-size: 16px;
	background: white;
}
#register-frame>.footer>ul{
	height: 20px;
	margin-top: 20px;
}
#register-frame>.footer>ul>li{
	float: right;
	border-right: 1px solid #666;
	padding: 2px 8px;
}
#register-frame>.footer>ul>li>a{
	color: black;font-size: 12px;font-family: '宋体';
	text-decoration: none;
}
#register-frame>.footer>ul>li:first-child{
	border:none;
}

</style>