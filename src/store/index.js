import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

//所有的组件都可以共享store中的数据
export default new Vuex.Store({
  state: {
    routes: [],
    stomp: Stomp.over(new SockJS("/ws/endpoint")),
    receivemsg: [],
    sended: [],
    unreaded: 0,
    onlineperson: [],
    chatList:[]
  },
  mutations: {
    initMenu(state, menus) {
      state.routes = menus;
    },
    updateMsgs(state, msg) {
      state.isreveived=true;
      state.receivemsg.push(msg);
      state.unreaded += 1;

      //  将数据保存在本地
      let user = window.localStorage.getItem("user");
      let parse = JSON.parse(user);

      let item = window.localStorage.getItem(parse.username+"/"+msg.from);
      if(item==null){
        let newmsglist = [];
        newmsglist.push(msg);
        state.chatList.push(msg);
        window.localStorage.setItem(parse.username+"/"+msg.from,JSON.stringify(newmsglist));
      }else{
        let item2 = JSON.parse(item);
        item2.push(msg);
        state.chatList.push(msg);
        window.localStorage.setItem(parse.username+"/"+msg.from,JSON.stringify(item2));
      }

    },
    updateOnlineperson(state, onlines) {
      //需要手动更新
      // state.onlineperson=onlines;

      let len = state.onlineperson.length;
      // 说明有人上线了
      if(onlines.length>state.onlineperson.length){
      //  往数组中添加。num表示多了几个用户
        let num = onlines.length-state.onlineperson.length;
        for (let i = 0; i < num; i++) {
          let num2 = len+i;
          console.log(num2);
          console.log(onlines[num2]);
          state.onlineperson.push(onlines[num2]);
        }
      }else if(onlines.length<state.onlineperson.length){
      //  说明有人下线了。由于下线的顺序是随机的。因此遍历。多的外层，少的内层
        for (let i = 0; i < state.onlineperson.length; i++) {
          for (let j = 0; j < onlines.length; j++) {
            if(onlines[j].user.id==state.onlineperson[i].user.id){
              continue;
            }else{
              state.onlineperson.splice(i,1);
            }
          }
        }
      }



    },
    disconnect(state) {
      state.stomp.disconnect();
    },
    changeChatList(state,currentChat){
      state.chatList=[];
      let str = window.localStorage.getItem("user");
      let user = JSON.parse(str);
      let msgs = window.localStorage.getItem(user.username+"/"+currentChat.username);
      if(msgs!=null){
        state.chatList=JSON.parse(msgs);
      }else {
        state.chatList=[];
      }

    }

  }, actions: {
    connect(context) {
      context.state.stomp = Stomp.over(new SockJS("/ws/endpoint"));
      context.state.stomp.connect({}, success => {
        context.state.stomp.subscribe("/user/queue/chat", message => {
          let msg = JSON.parse(message.body);
          context.commit("updateMsgs", msg);
        });

        var user = window.localStorage.getItem("user");
        // console.log(user);
        // context.commit("updateOnlineperson", user);

        //订阅在线用户
        context.state.stomp.subscribe("/topic/online", message => {
          var msg = message.body;
          var onlines = JSON.parse(msg);
          context.commit("updateOnlineperson", onlines);
        });

        //连接成功
        var online = {user: JSON.parse(user), ison: true};
        //发送在线用户
        context.state.stomp.send("/ws/online", {}, JSON.stringify(online));

      }, fail => {

      })
    }
  }
});
