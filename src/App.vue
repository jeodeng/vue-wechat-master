<template>
	<div id='container-body'>
		<login-frame v-if="loginFlag" @jump="jump"></login-frame>
        <register-frame v-if="registerFlag" @jump="jump"></register-frame>
	</div>
</template>
<script>
import LoginFrame from './components/login.vue'
import RegisterFrame from './components/register.vue'
export default{
	components:{
        'login-frame':LoginFrame,
        'register-frame':RegisterFrame
    },
    data(){
    	return{
            loginFlag:true, //记录登录状态
            registerFlag:false,
    	}
    },
    methods:{
        jump:function(target){
            switch(target) {
                case 'register':
                    this.registerFlag=true;
                    this.loginFlag=false;
                    break;
                case 'login':
                    this.loginFlag=true;
                    this.registerFlag=false;
                    break;
                default : return;
            }
        }
    }
}
</script>
<style>
</style>