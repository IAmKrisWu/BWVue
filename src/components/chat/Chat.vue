<template>
  <div id="chat">
    <el-container style="margin-top: 10px">

      <el-aside width="200px">
        <el-menu
          default-active="2"
          class="el-menu-vertical-demo"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
          style="height: 100%"
          @select="currentChat">
          <el-menu-item>
            <el-input prefix-icon="el-icon-search" size="mini" v-model="sname" placeholder="输入名称搜索"></el-input>
          </el-menu-item>

          <el-menu-item index="0">
            系统通知
          </el-menu-item>
          <el-menu-item :index="online.user.id+''" v-for="(online,index) in onlinepersons" :key="index+''">
            <img :src="online.user.userface" alt="头像" style="width: 40px;height: 40px;border-radius: 40px">
            <span slot="title">{{online.user.name}}</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-container>
        <el-header style="background-color: #545c64;display: flex;align-items: center;display: flex;justify-content: space-between">
          <div>
          <i class="fa fa-weixin" aria-hidden="true" style="margin-right: 4px;font-size: 30px;color: chartreuse"></i>
          <span style="color: aliceblue;font-size: 20px" v-if="currentFriend!=null">{{currentFriend.name}}</span>
          </div>
          <i class="fa fa-user-circle" aria-hidden="true" style="font-size: 30px;"></i>
        </el-header>

        <el-main style="padding: 0px;margin: 0px">
          <el-card shadow="hover" id="scroll" style="height: 400px;margin: 0px;overflow:auto">

              <template v-for="msg in msgList" v-if="msgList!=null">
                <!--发送来的消息-->
                <div v-if="msg.from==currentFriend.username"
                  style="display: flex;justify-content: flex-start;align-items: center;box-sizing: border-box;margin-top: 6px"
                >
                  <img :src="currentFriend.userface" style="width: 40px;height: 40px;margin-right: 6px">
                  <div
                    style="display: inline-flex;border-style: solid;border-width: 1px;border-color: #20a0ff;border-radius: 5px;padding: 5px 8px 5px 8px">
                    {{msg.content}}
                  </div>
                </div>
                <!--发出去的消息-->
                <div v-if="msg.from==user.username"
                     style="margin-top: 6px;display: flex;justify-content: flex-end;align-items: center;box-sizing: border-box;">
                  <div
                    style="display: inline-flex;border-style: solid;border-width: 1px;border-color: #20a0ff;border-radius: 5px;padding: 5px 8px 5px 8px;margin-right: 3px;background-color: #9eea6a">
                    {{msg.content}}
                  </div>
                  <img :src="user.userface" style="width: 40px;height: 40px;margin-left: 6px">
                </div>
              </template>

            <!--<div id="scroll" style="height: 400px;overflow:auto">-->
            <!--<span v-for="m in sended" style="align:left">-->
            <!--{{m.from}}&#45;&#45;&#45;&#45;{{m.content}}<br/>-->
            <!--</span>-->
            <!--<span v-for="r in receivemsg" style="align:right">-->
            <!--{{r.from}}&#45;&#45;&#45;&#45;{{r.content}}<br/>-->
            <!--</span>-->
            <!--</div>-->
          </el-card>
        </el-main>
        <el-footer style="height: 200px;align-items: center;display: flex;margin: 0px;padding: 0px;background-color: black">
          <!--<div style="display: flex;bottom: 0">-->
            <!--<el-input v-model="mymsg" size="mini" type="text" style="width: 480px"/>-->
            <!--<el-button size="mini" type="primary" @click="sendmsg">发送</el-button>-->
          <!--</div>-->
          <el-card fit="true" style="height: 200px;width: 100%">
            <div slot="header" style="height: 15px;margin: 0px">
              <i class="fa fa-paper-plane-o" @click="sendmsg" aria-hidden="true" style="cursor: pointer;font-size: 25px;float: right; padding: 3px 0"></i>
            </div>

            <el-input
              type="textarea"
              :rows="5"
              placeholder="请输入内容。ctrl+enter发送"
              v-model="mymsg"
              style="width: 100%"
              @keydown.native.enter.ctrl="sendmsg"
              >
            </el-input>
            <!--<textarea id="content"></textarea>-->
          </el-card>
        </el-footer>
      </el-container>
    </el-container>

  </div>
</template>

<script>
  import '../../lib/sockjs'
  import '../../lib/stomp'


  export default {
    name: "chat",
    data() {
      return {
        mymsg: '',
        stomp: null,
        onlinepersons: [],
        currentFriend: null,
        msgList:[],
        user:{},
        sname:''
      }
    }, methods: {
      //配置连接地址
      // initCon(){
      //   let _this = this;
      //   this.stomp=Stomp.over(new SockJS("/ws/endpoint"));
      //   //开始连接
      //   this.stomp.connect({},success=>{
      //   //连接成功的回调，订阅消息地址记得要加上/user。因为websocket在处理时会自动为服务端的转发地址加上/user
      //     this.stomp.subscribe("/user/queue/chat",msg=>{
      //       console.log(msg.body);
      //       var parse = JSON.parse(msg.body);
      //     //  注意：这里属于一个内部方法，无法调用外部的this，因此只能使用在方法内部定义的_this。
      //     //  msg.body是从服务端转发过来的消息
      //       _this.msgs.push({content:parse.content,from:parse.from});
      //     })
      //   },fail=>{
      //   //  连接失败的回调
      //     this.$message.error("连接失败");
      //   })
      // },
      sendmsg() {
        let flag = false;
        //判断对方是否已经下线
        for (let i = 0; i < this.onlinepersons.length; i++) {
          let curr = this.onlinepersons[i];
          if(curr.user.id==this.currentFriend.id){
            flag=true;
          }
        }
        if(!flag){
          this.$message.error("对方下线了喔～～～");
          return;
        }

        let msg = {
          content: this.mymsg,
          to: this.currentFriend.username,
          from:this.user.username
        };
        //1。消息发送的地址。2。优先级。3。发送的内容
        this.$store.state.stomp.send("/ws/chat", {}, JSON.stringify(msg));

        let user = window.localStorage.getItem("user");
        let parse = JSON.parse(user);

        //将自己发送的消息保存在本地
        let item = window.localStorage.getItem(parse.username+"/"+this.currentFriend.username);
        if(item==null){
          let newmsglist = [];
          newmsglist.push(msg);
          this.msgList.push(msg);
          window.localStorage.setItem(parse.username+"/"+msg.to,JSON.stringify(newmsglist));
        }else{
          let item2 = JSON.parse(item);
          item2.push(msg);
          this.msgList.push(msg);
          window.localStorage.setItem(parse.username+"/"+msg.to,JSON.stringify(item2));
        }
        this.mymsg = '';
      },
      currentChat(index, indexpath) {

        if(index==0){

        }else{
          for (let i = 0; i < this.onlinepersons.length; i++) {
            if (this.onlinepersons[i].user.id == index) {
              this.currentFriend = this.onlinepersons[i].user;
            }
          }
          //更改聊天列表
          this.$store.commit("changeChatList",this.currentFriend);
          this.msgList = this.$store.state.chatList;
        }

      }
    },
    mounted() {
      //未读清0
      this.$store.state.unreaded = 0;
      //获取在线用户
      this.onlinepersons = this.$store.state.onlineperson;
      //获取当前登录的用户
      this.user=JSON.parse(window.localStorage.getItem("user"));

      this.currentFriend=this.onlinepersons[0].user;

      //获取对话列表
      this.msgList = this.$store.state.chatList;
    },
    watch: {
      msgList() {
        //表示要在下次渲染之前执行
        this.$nextTick(function () {
          document.getElementById('scroll').scrollTop = document.getElementById('scroll').scrollHeight;
        })
      },
      sname(){
        if(this.sname==""){
          this.onlinepersons=this.$store.state.onlineperson;
        }else{
          let _this = this;
          let searchChat = [];
          for (let i = 0; i < this.onlinepersons.length; i++) {
            let online = this.onlinepersons[i];
            let user = _this.onlinepersons[i].user;
            if(user.name.lastIndexOf(_this.sname)!==-1){
              searchChat.push(online);
            }
          }
          this.onlinepersons=searchChat;
        }

      }
    }
  }
</script>

<style scoped>

</style>
