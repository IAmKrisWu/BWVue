<template>
  <div style="display: flex;flex-wrap: wrap;justify-content: center">
    <el-card shadow="hover" class="box-card" v-for="(hr,index) in hrs" :key="index" style="width: 300px;margin: 30px;height: 350px;">
      <div slot="header" class="clearfix" style="display: flex;justify-content: space-between">
        <span>{{hr.name}}</span>
        <el-button icon="el-icon-delete" style="color: red;" type="text" @click="delHr(hr.id,hr.name)"></el-button>
      </div>
      <div class="text item">
        <div style="display: flex;justify-content: center">
          <img :src="hr.userface" style="border-radius: 80px;width: 80px;height: 80px"/>
        </div>
        <div style="margin-top: 5px">
          <table>
            <tr>
              <td>电话:</td>
              <td>{{hr.phone}}</td>
            </tr>
            <tr>
              <td>地址:</td>
              <td>{{hr.address}}</td>
            </tr>
            <tr>
              <td style="width: 80px">角色:</td>
              <td style="display: flex;flex-wrap: wrap;"><el-tag size="mini" type="success" v-for="(role,indexj) in hr.roles" :key="indexj" style="margin: 5px;padding: 0px">{{role.nameZh}}</el-tag>

                <el-popover
                  placement="bottom"
                  title="标题"
                  width="200"
                  trigger="click"
                  @show="setselected(hr.roles)"
                  transition="zoom-in-top"
                  @hide="updateSelected(hr.id)"
                  >
                  <!--v-model的值为当前被选中的el-option的 value 属性值-->
                  <el-select size="mini" v-model="selected" multiple placeholder="请选择">
                    <el-option
                      v-for="item in allRoles"
                      :key="item.id"
                      :label="item.nameZh"
                      :value="item.id">
                    </el-option>
                  </el-select>
                  <el-button slot="reference" type="text" icon="el-icon-more" size="mini"/>
                </el-popover>
              </td>
            </tr>
            <tr>
              <td>账号状态:</td>
              <td><el-switch
                v-model="hr.enabled"
                active-text="启动"
                inactive-text="禁用"
                @change="stateChange(hr.id,hr.enabled)">
              </el-switch></td>
            </tr>
          </table>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
  export default {
    data(){
      return{
        hrs:[],
        allRoles:[],
        selected:[]
      }
    },methods:{
      initHrs(){
        this.getRequest("/system/hr/").then(resp=>{
          if(resp&&resp.status==200){
            this.hrs=resp.data;
          }
        })
      },delHr(hrid,name){
        this.$confirm('此操作将删除【'+name+'】, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.deleteRequest("/system/hr/?hrid="+hrid).then(resp=>{
            if(resp&&resp.data.status==200){
              this.initHrs();
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });

      },stateChange(id,enabled){
        this.putRequest("/system/hr/enabled",{id:id,enabled:enabled}).then(resp=>{})
      },getAllRoles(){
        this.getRequest("/system/basic/roles/").then(resp=>{
          if(resp&&resp.status==200){
            this.allRoles=resp.data;
          }
        })
      },setselected(roles){
        this.selected=[];
        for (let i = 0; i < roles.length; i++) {
          this.selected[i]=roles[i].id;
        }
      },updateSelected(id){

        this.putRequest("/system/hr/roles",{rids:this.selected,hrid:id}).then(resp=>{
          this.initHrs();
        })
      }
    },mounted(){
      this.initHrs();
      this.getAllRoles();
    }
  }
</script>
