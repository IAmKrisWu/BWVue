// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import {getRequest} from "./utils/api";
import {postRequest} from "./utils/api";
import {putRequest} from "./utils/api";
import {deleteRequest} from "./utils/api";
import {initMenu} from "./utils/utils";
import {postBodyRequest} from "./utils/api"
import store from "./store"
import 'font-awesome/css/font-awesome.min.css'
import './utils/filter_utils'



Vue.config.productionTip = false;
//使用ElementUI
Vue.use(ElementUI);

//将请求设置vue插件
Vue.prototype.getRequest=getRequest;
Vue.prototype.postRequest=postRequest;
Vue.prototype.putRequest=putRequest;
Vue.prototype.deleteRequest=deleteRequest;
Vue.prototype.postBodyRequest=postBodyRequest;


//全局守卫。每一个跳转之前都会执行的方法。进入页面之前都会执行
router.beforeEach((to, from, next) => {
  // alert(from.name + "," + to.name);
  // next();
  if(to.path=='/'){
    next();
  }else{
    //如果要去的地方需要登录
    if(to.meta.requireAuth){
      var user = window.localStorage.getItem("user");
      if(user){
        //这里调用的是utils中的initMenu方法
        initMenu(router,store);
        next();
      } else{
        //query表示设置参数，如果key值是redirect的话，会跟在地址后面，登录完成后直接跳转到对应的地址
        next({path:"/",query:{redirect:to.path}});
      }

    }else{
      next();
    }
    // next({path:"/",query:{redirect:to.path}});
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
