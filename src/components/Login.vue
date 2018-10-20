<template>
  <div style="display: flex;justify-content: center;">
    <el-card class="box-card" style="width: 400px;margin-top: 200px;height: 250px">
      <div slot="header" class="clearfix">
        <span style="font-size: 20px">登录</span>
      </div>
      <table style="width: 300px">
        <tr>
          <td><el-input v-model="username" placeholder="请输入账号"></el-input></td>
        </tr>
        <tr><el-input v-model="password" type="password" placeholder="请输入密码"></el-input></tr>
        <tr><el-button type="primary" round style="width: 300px;margin-top: 20px" @click="login">登录</el-button></tr>
      </table>
    </el-card>
  </div>
</template>

<script>
    import {postRequest} from "../utils/api";

    export default {
        name: "Login",
      //data必须是一个函数
      data(){
          return{
            //和v-model绑定的属性
            username:'admin',
            password:'123'
          }
      },
      //methods是一个属性,凡是属性记得要加冒号:喔～～。里面定义各种方法
      methods:{
          login(){
            let _this = this;
            // alert(this.username+"--"+this.password);
            //调用全局方法， .then表示响应成功回调的方法
            postRequest("/login",{username:this.username,password:this.password}).then(resp=>{
              if(resp.data.status==200){
                //开启websocket连接
                this.$store.dispatch("connect");

                //将对象放入localstorge
                window.localStorage.setItem("user",JSON.stringify(resp.data.obj));
                //判断是否有redirect的值，如果有登录完成后直接跳转
                var goPath = this.$route.query.redirect;
                if(goPath){
                  this.$router.replace(goPath)
                }else{
                  //利用路由进行跳转，使用this.$router调用路由对象。replace会替换栈中原本的对象。push则压栈
                  this.$router.replace("/home");
                }
              }
            })
          }
      }
    }
</script>

<style scoped>

</style>
