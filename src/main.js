// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

import qs from 'qs'

import Public from '@/components/Public'
Vue.prototype.$_glo=Public

import axios from 'axios'
Vue.prototype.$http=axios

import gallery from 'img-vuer'
Vue.use(gallery)

Vue.prototype.$ajax=(url, obj, callback, bool=false)=>{
	if(bool){
		axios.get('/curl/index.php', {
			params: {
				url: str_url
			}
		}).then(response=>{
			callback({
				data: response.data.body
			});
		});
	}else if(window.plus){
		let str_url=qs.stringify(obj)?`${url}?${qs.stringify(obj)}`:url;
		let xhr = new plus.net.XMLHttpRequest();
		xhr.onreadystatechange=()=>{
			if(xhr.readyState===4){
				callback({
					error: 0,
					data: Public.parseJson(xhr.responseText)
				});
			}
		}
		xhr.onerror=error=>{
			let str="lengthComputable="+error.lengthComputable+"loaded="+error.loaded+";total="+error.total;
			callback({
				error: 1,
				errorTxt: str
			});
		}
		xhr.open( "GET", str_url );
		xhr.send();
	}else{
		axios.get(url, {
			params: obj
		}).then(response=>{
			response.error=0;
			callback(response);
		},error=>{
			console.log(error);
			callback({
				error: 1,
				errorTxt: error.message,
				obj_error: error
			});
		});
	}
}

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
