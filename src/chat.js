require('./assets/css/public.css')
import Vue from 'vue'

import App from './Chat.vue'
import VueResource from 'vue-resource'

//创建设一个vue实例,挂载在body上面
Vue.use(VueResource);

new Vue({
	el:'#app',
	template:'<App/>',
	components:{App}
});