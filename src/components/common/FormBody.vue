<template>
	<div>
		<ul>
			<li v-for="item in config">
				<template v-if="item.type=='password'">
					<label :for="item.name">{{filterPro(item.name)}}</label>
					<input type="password" :name="item.name" v-model="formData[item.name]">
					<span v-show="errMsg[item.name].flag" v-text="'* '+errMsg[item.name].msg"></span>
				</template>
				<template v-else>
					<label :for="item.name">{{filterPro(item.name)}}</label>
					<input type="text" :name="item.name" v-model="formData[item.name]">
					<span v-show="errMsg[item.name].flag" v-text="'* '+errMsg[item.name].msg"></span>
				</template>
			</li>
		</ul>
	</div>
</template>
<script>
export default{
	props:['config','errMsg','formData'],
	methods:{
		filterPro:function(p){
			switch(p) {
				case 'username' : return '用户名：';
				case 'password' : return '密码：';
				default :return p;
			}
		},
	}
}
</script>
<style scoped>
	input,button{
		outline: none;
	}
	ul li{
		line-height: 40px;
		min-height: 40px;
		padding-bottom: 28px;
		position: relative;
	}
	ul li>span{
		position: absolute;
		width: 100%;height: 24px;
		line-height: 24px;text-indent: 10px;
		color: red;
		left: 40px;
		bottom: 0px;
		overflow: hidden;
		font-size: 12px;
	}
	ul li>label{
		font-size: 16px;
		display: block;
		padding: 5px 37px;
	}
	ul li input[type="text"],.container input[type="password"]{
		display: block;
		margin: 0 auto;
		width: 248px;box-sizing: border-box;
		height: 40px;
		padding: 5px 10px;
		font-size: 16px;
		border-radius: 4px;
	}
</style>