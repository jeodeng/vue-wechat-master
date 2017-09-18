<template>
	<div class="chat-frame">
		<div class="head"><span>{{filterPro(dialogData.title)}}</span></div>
		<div class="container" ref='container'>
			<ul>
				<li v-for="msg in dialogData.msgData" :class="{user:msg.type=='1',object:msg.type=='2'}">
					<em v-text="filterPro(msg.name)+'：'"></em>
					<span v-html="msg.message" class=""></span>
				</li>				
			</ul>
			<div ref='chatTo' style="height:0px"></div>
		</div>
		<div class="settings">
		</div>
		<div class="editframe">
			<textarea v-model="editContent" @keydown='enterSend'></textarea>
		</div>
		<div class="submit">
			<span>按下 Enter 发送消息, Ctrl+Enter 换行</span>
			<button @click="sendMsg" :disabled="isDisabled">发送</button>
		</div>
	</div>
</template>
<script>
	export default {
		props:['dialogData'],
		data:function(){
			return {
				editContent:'',
				scrollOnOff:true,
			}
		},
		updated:function(){
			//这个钩子函数在每次vue组件中数据变动的时候执行，包括输入框中的内容变化
			//所以仅仅在消息增加的时候才能跳转执行scrollIntoView();
			if (!this.scrollOnOff) return;
			this.$refs.chatTo.scrollIntoView();
			this.scrollOnOff=!this.scrollOnOff;
		},
		watch:{
			msgNum:function(){
				//控制此时是否可以开始跳转，如果msgNum变了，说明消息数量变化了，但是此时dom元素还没渲染，所以用updated钩子函数
				this.scrollOnOff=!this.scrollOnOff;
			}
		},
		computed:{
			isDisabled:function(){
				return !this.editContent;
			},
			msgNum:function(){
				return this.dialogData.msgData.length;
			}
		},
		methods:{
			sendMsg:function(){
				var sendContent='';
				//把换行符替换
				var reg = new RegExp ('\r\n','g');
				// console.log(reg.test(this.editContent))
				
				sendContent=this.editContent.replace(reg,"<br />");
				var temp={
					toWho:this.dialogData.title,
					type:'1',
					message:sendContent,
				};
				this.editContent='';
				//告诉父组件发送消息了;
				this.$emit('sendMsg',temp);
			},
			enterSend:function(e){
				if (e.keyCode==13 && e.ctrlKey) {
					this.editContent+='\r\n';
					e.preventDefault();
					return;
				}else if(e.keyCode==13){
					this.sendMsg();
					e.preventDefault();
					return;
				}
			},
			filterPro:function(p){
				switch(p) {
					case 'public' : return '聊天广场';
					case 'admin' : return '系统管理员';
					default : return p;
				}
			},
		},
	}
</script>
<style>
	.chat-frame{
		box-sizing: border-box;
		padding-right: 8px;
		background: #eeeeee;
		width: 620px;overflow: hidden;
		position: relative;
	}
	.chat-frame>.head{
		font-size: 16px;
		padding: 16px;
		text-align: center;
		border-bottom: 1px solid #d6d6d6;
	}
	.chat-frame>.head>span{
		cursor: pointer;
	}
	.chat-frame>.container{
		height: 420px;
		box-sizing: border-box;
		padding: 12px;
		font-size: 12px;
		overflow: auto;		
	}
	.chat-frame>.container li{
		overflow: hidden;
		margin-bottom: 16px;
		position: relative;
	}
	.chat-frame>.container li>em{
		display: block;
		max-width: 230px;height: 16px;
		font-size: 12px;
		color: #666;
		font-style: normal;
	}
	.chat-frame>.container li>span{
		max-width: 226px;
		background-color: #b2e281;
		display: inline-block;
		padding: 14px 6px;
		background-color: #b2e281;
		border-radius: 4px;
	}
	.chat-frame>.container li.user{
		padding-right: 26px;
	}
	.chat-frame>.container li.user>span{
		float: right;
	}
	.chat-frame>.container li.user>em{
		display: none;
	}
	.chat-frame>.container li.object{
		padding-left: 26px;
	}
	.chat-frame>.container li.object>span{
		float: left;
		margin-left: 20px;
	}
	.chat-frame>.settings{
		height: 26px;
		border-top: 1px solid #ccc;
	}
	.chat-frame>.editframe{
		height: 90px;
		/*box-sizing: border-box;*/
		/*padding: 6px 10px;*/
		font-size: 14px;
		/*overflow: auto;*/
	}
	.chat-frame>.editframe>textarea{
		height: 90px;width: 100%;
		box-sizing: border-box;
		padding: 6px 10px;
		font-size: 14px;
		overflow: auto;outline: none;
		resize: none;
		display: block;
		border:none;background-color: transparent;
	}
	.chat-frame>.submit{
		min-width: 230px;
		position: absolute;
		bottom: 16px;right: 20px;
	}
	.chat-frame>.submit>button{
		width: 100px;height: 28px;
	}
	.chat-frame>.submit>span{
		font-size: 12px;color: #666;
	}
</style>