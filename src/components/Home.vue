<template>
    <div>
      <el-container>
        <el-header style="margin: 0;padding: 0;width: 100%;height: 60px">
          <Header></Header>
        </el-header>

        <el-container>
          <!--菜单-->
          <el-aside width="200px">
            <!--菜单开关按钮-->
            <el-switch
              v-model="isCollapse"
              active-color="#ff4949"
              inactive-color="#13ce66">
            </el-switch>
              <el-menu
                @select="menuselect" :unique-opened="true"  :collapse="isCollapse">
                <el-submenu :index="index+''" :key="index" v-for="(route,index) in this.routes" v-if="!route.hidden">
                  <template slot="title">
                    <i :class="route.iconCls" style="color: #409EFF;font-size: 30px"></i>
                    <span style="font-family: 'Hiragino Sans GB">{{route.name}}</span>
                  </template>
                    <el-menu-item :index="child.path" :key="route.id" v-for="(child,indexj) in route.children">{{child.name}}</el-menu-item>
                </el-submenu>
              </el-menu>
          </el-aside>

          <!--中心-->
          <el-main>

            <el-breadcrumb separator-class="el-icon-arrow-right" v-if="this.$router.currentRoute.name!='主页'">
              <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
              <el-breadcrumb-item >{{this.$router.currentRoute.name}}</el-breadcrumb-item>
            </el-breadcrumb>

            <!--过度动画-->
            <transition name="el-fade-in-linear">
              <!--<div v-if="this.$router.currentRoute.name=='主页'"-->
                   <!--style="display: flex;justify-content: center;margin-top: 220px;font-family: 'Kaiti SC';font-size: 50px">-->
                <!--百威美食管理系统-->
              <!--</div>-->
              <div v-if="this.$router.currentRoute.name=='主页'">
                <!--走马灯-->
                <el-carousel :interval="4000" type="card" height="300px">
                  <el-carousel-item >
                    <img style="height: 300px;width: 100%" src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1537644852256&di=3cde5209d455d8a4125ec515db3e9984&imgtype=0&src=http%3A%2F%2Fpic22.nipic.com%2F20120713%2F1490095_175429176155_2.jpg"/>
                  </el-carousel-item>
                  <el-carousel-item >
                    <img style="height: 300px;width: 100%" src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1537644852256&di=b4162f198b8c4a8f716cea75eb207f1e&imgtype=0&src=http%3A%2F%2Fimgsrc.baidu.com%2Fimgad%2Fpic%2Fitem%2F9922720e0cf3d7ca4a050f58f91fbe096b63a928.jpg"/>
                  </el-carousel-item>
                  <el-carousel-item >
                    <img style="height: 300px;width: 100%" src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1538563165848&di=17b32a32f2890803d1846299e70c77cb&imgtype=0&src=http%3A%2F%2Fimgsrc.baidu.com%2Fimage%2Fc0%253Dpixel_huitu%252C0%252C0%252C294%252C40%2Fsign%3Da2d4e77d3212b31bd361c569ef605316%2F562c11dfa9ec8a13b27e2cdafc03918fa0ecc0a0.jpg"/>
                  </el-carousel-item><el-carousel-item >
                    <img style="height: 300px;width: 100%" src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1538563210960&di=4e4d45113d81621326a113f40c97798e&imgtype=0&src=http%3A%2F%2Fimgsrc.baidu.com%2Fimage%2Fc0%253Dpixel_huitu%252C0%252C0%252C294%252C40%2Fsign%3D2e37593e3f9b033b3885f49a7cb653bf%2Fcaef76094b36acafd4c0d2c677d98d1001e99cec.jpg"/>
                  </el-carousel-item>
                </el-carousel>

                <div style="display: flex;justify-content: center;margin-top: 20px;font-family: 'Kaiti SC';font-size: 50px">百威美食管理系统</div>
                <div>
                  您本月的评分:
                  <el-rate
                    v-model="score"
                    disabled
                    show-score
                    text-color="#ff9900"
                    score-template="{value}">
                  </el-rate>
                </div>
              </div>
              <router-view></router-view>
            </transition>

          </el-main>
        </el-container>
      </el-container>
    </div>
</template>

<script>
  import Header from './home/Header'
    export default {
        components:{
          Header
        },
        name: "Home",
        data(){
          //data函数必须要有返回值喔！！！！！！！！，不能加分号
          return {
            // user:JSON.parse(window.localStorage.getItem("user")),
            isCollapse:false,
            score:4.5,
            receivemsg:[]
          }
        },watch:{
        receivemsg(){
            this.alertmsg();
          }
      },
        methods:{
          menuselect(index,indexpath){
            this.$router.push(index);
          },alertmsg(){
            if(this.$router.currentRoute.name!='在线聊天'){

            //弹出最后一条
            let length = this.receivemsg.length;
            let lastmsg = this.receivemsg[length-1];
            //弹框消息
            const h = this.$createElement;
            this.$notify({
              title: lastmsg.from,
              message: h('i', { style: 'color: teal'}, lastmsg.content)
            });
            }else{
              this.$store.state.unreaded=0;
            }
          }

        }
        //这是一个计算属性，有一个特点就是计算属性如果检测到返回的结果相同的话会自动缓存。
        ,computed:{
          //这些虽然写的是一个方法，但是routes是当做属性来用的。
          routes(){
            return this.$store.state.routes;
          }
        },mounted(){
          this.receivemsg=this.$store.state.receivemsg;
      }
    }
</script>

<style scoped>
  .el-carousel__item h3 {
    color: #475669;
    font-size: 14px;
    opacity: 0.75;
    line-height: 150px;
    margin: 0;
  }

  .el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
  }

  .el-carousel__item:nth-child(2n+1) {
    background-color: #d3dce6;
  }
</style>
