require('./assets/css/public.css');

import Vue from 'vue'
import VueResource from 'vue-resource'
import App from './App.vue'
//创建设一个vue实例,挂载在body上面
Vue.use(VueResource);

new Vue({
	el:'#app',
	template: '<App/>',
	components:{App}
});

