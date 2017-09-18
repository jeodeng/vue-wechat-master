<template>
	<div class="online-user">
		<div class="head"><h2 v-text="title"></h2></div>
		<div class="container">
			<div v-for="item in onlineUser">
				<h2 v-text="filterPro(item.name)"></h2>
				<ul>
					<li v-for="user in item.users" v-text="user"></li>
				</ul>
			</div>
		</div>
	</div>
</template>
<script>
	export default {
		props:['onlineUser'],
		data:function(){
			return {
				title:'在线用户列表',
			}
		},
		methods:{
			filterPro:function(p){
				switch(p) {
					case 'private': return '我的好友';
					case 'public' : return '聊天广场';
					default : return p;
				}
			}
		}
	}
</script>
<style>
	.online-user{
		box-sizing: border-box;
		background: #eee;
		width: 200px;overflow: hidden;
		border-left: 2px solid #ccc;
		padding: 10px 2px;
	}
	.online-user>.head>h2{
		font-size: 18px;
		font-weight: normal;
		padding: 8px 12px;
		border-bottom: 1px solid #ccc;
	}
	.online-user>.container{
		max-height: 560px;
		overflow: auto;
	}
	.online-user>.container>div>h2{
		display: block;
		font-size: 16px;font-weight: normal;
		padding: 10px 18px;
		cursor: pointer;
		height: 46px;
		box-sizing: border-box;
	}
	.online-user>.container>div>ul>li{
		text-align: center;padding: 6px 22px;
		color: #666;
	}
</style>