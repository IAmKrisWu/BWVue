<template>
  <div>
    <div>
      <el-input placeholder="请输入角色英文名" v-model="r.name" size="mini" style="width: 250px">
      <template slot="prepend">ROLE_</template>
    </el-input>
      <el-input placeholder="请输入角色中文名" v-model="r.nameZh" size="mini" style="width: 200px">
      </el-input>
      <el-button type="primary" size="mini" icon="el-icon-plus" @click="addRole">添加</el-button>
    </div>
    <div style="margin-top: 10px">
      <el-collapse v-model="activeName" accordion style="width: 70%" @change="menuChange">
        <el-collapse-item :title="role.nameZh" :name="role.id" v-for="(role,index) in roles" :key="index+''">
          <el-card class="box-card" shadow="hover">
            <div slot="header" class="clearfix" style="display: flex;justify-content: space-between">
              <span>{{role.nameZh}}</span>
              <el-button icon="el-icon-delete" style="color: red;" type="text" @click="delRole(role)"></el-button>
            </div>
            <div>
              <el-tree
                :data="menu"
                show-checkbox
                ref="tree"
                node-key="id"
                :default-checked-keys="checkedmenu"
                highlight-current
                :props="defaultProps"
                >
              </el-tree>
              <div style="display: flex;justify-content: flex-end;">
                <el-button type="primary" size="mini" @click="updatePermis(role.id,index)">确认修改</el-button>
                <el-button type="primary" size="mini" @click="cancelUpdate(index)">取消修改</el-button>
              </div>
            </div>
          </el-card>
        </el-collapse-item>
      </el-collapse>
    </div>
  </div>
</template>

<script>
  import {deleteRequest} from "../../../utils/api";

  export default {
    name: "PermissMana",
    data(){
      return{
        r:{
          name:'',
          nameZh:''
        },
        roles:[],
        activeName:'',
        menu:[],
        defaultProps: {
          children: 'children',
          label: 'name'
        },
        checkedmenu:[],
      }
    },
    methods:{
      initRoles(){
        this.getRequest("/system/basic/roles/").then(resp=>{
          if(resp&&resp.status==200){
            this.roles=resp.data;
          }
        })
      },menuChange(id){
        var _this=this;
        this.getRequest("/system/basic/permis/menu?rid="+id).then(resp=>{
          if(resp&&resp.status==200){
            _this.checkedmenu=resp.data;
            _this.initMenu();
          }
        })
      },initMenu(){
        this.getRequest("/system/basic/permis/menutree").then(resp=>{
          if(resp&&resp.status==200){
            this.menu=resp.data;
          }
        })
      },addRole(){
        if(this.r.name&&this.r.nameZh){
          this.postRequest("/system/basic/roles/",this.r).then(resp=>{
            if(resp&&resp.data.status==200){
              this.r='';
              this.initRoles();
            }
          })
        }
      },updatePermis(rid,index){

        //获取tree数组
        var trees = this.$refs.tree;
        //找到选中卡片中的tree。因为是数组下标是从0开始
        var tree = trees[index];
        //设置为true则不返回父节点。默认是是false
        var mids = tree.getCheckedKeys(true);
        console.log(mids);

        this.putRequest("/system/basic/permis/",{mids:mids,rid:rid}).then(resp=>{
          if(resp&&resp.data.status==200){
            this.menuChange(rid);
          }
        })
      },
      delRole(role){
        this.$confirm('此操作将删除【'+role.nameZh+'】, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteRequest("/system/basic/roles/?rid="+role.id).then(resp=>{
            if(resp&&resp.data.status==200){
              this.initRoles();
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },cancelUpdate(index){
        let trees = this.$refs.tree;
        let tree = trees[index];
        //将tree选中数组设置为原来已选中的数组
        tree.setCheckedKeys(this.checkedmenu,true);
      }
    },
    mounted(){
      this.initRoles();
      this.initMenu();
    }
  }
</script>

<style scoped>

</style>
