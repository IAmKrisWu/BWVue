import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import Home from '@/components/Home'
import Chat from '@/components/chat/Chat'

Vue.use(Router)
//下面设置了孩子，使用跳转的时候就会在父组件处寻找router。
//加上hidden，是为了方便判断是否显示
export default new Router({
  routes: [
    {
      path: '/',
      name: '登录',
      component: Login,
      hidden:true
    },{
      path:'/home',
      name:'主页',
      component:Home,
      hidden:true,
      meta:{
        requireAuth:true
      }
    },{
      path:'/home',
      name:'主页',
      component:Home,
      hidden:true,
      meta:{
        requireAuth:true
      },
      children:[
        {
          path: '/chat',
          name: '在线聊天',
          component: Chat,
          hidden:true
        }
      ]
    }
  ]
})
