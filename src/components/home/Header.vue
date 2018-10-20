<template>
    <div style="background-color: #409EFF;display: flex;justify-content: space-between;height: 60px;align-items: center">
      <div style="font-family: 'PingFang SC';color: aliceblue;font-size: 35px;">百威美食餐饮系统</div>
      <div style="display: flex;align-items: center">
        <el-badge :value="unreaded"  style="margin-right: 20px">
          <i class="fa fa-bell-o" style="cursor:pointer;color: black;font-size: 20px" @click="tochat"/>
        </el-badge>

        <!--添加点击事件-->
        <el-dropdown @command="handleCommand">
              <span class="el-dropdown-link" style="cursor: pointer;display: flex;align-items: center">
                <!--border-radius边框为圆形直径40px-->
                {{user.name}}<img :src="user.userface" alt="头像" style="width: 40px;height: 40px;border-radius: 40px">
              </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="usercenter">用户中心</el-dropdown-item>
            <el-dropdown-item command="usersetting">设置</el-dropdown-item>
            <!--divided表示分割线-->
            <el-dropdown-item divided command="logout">注销</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
</template>

<script>
    export default {
        name: "Header",
        data(){
          return{
            user:JSON.parse(window.localStorage.getItem("user"))
          }
        },methods: {
        //command就是我们上面定义的command
        handleCommand(command) {
          if (command == 'logout') {
            this.$confirm('此操作将注销登录, 是否继续?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              var online = {user:this.user,ison:false};
              //发送下线通知
              this.$store.state.stomp.send("/ws/online",{},JSON.stringify(online));
              //记得加上this，当前当前对象
              this.getRequest("/logout");
              //将user设为空
              window.localStorage.removeItem("user");
              //将store清空。通过commit调用store中的方法
              this.$store.commit('initMenu', []);
              //跳转页面
              this.$router.replace("/");
              this.$message.success("注销成功");

            //  关闭socket连接
              this.$store.commit("disconnect");
            }).catch(() => {
              this.$message({
                type: 'info',
                message: '已取消注销'
              });
            });

          }
        },tochat(){
          this.$router.push('/chat');
        }
      },computed:{
        unreaded(){
        return this.$store.state.unreaded;
      }
      }
    }
</script>

<style scoped>

</style>
