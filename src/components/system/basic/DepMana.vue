<template>
  <div >
    <el-input
      placeholder="输入关键字进行过滤"
      size="mini"
      style="width: 300px"
      v-model="filterText">
    </el-input>
    <el-tree
      :data="deps"
      show-checkbox
      node-key="id"
      :props="defaultProps"
      :render-content="renderContent"
      style="width: 500px"
      :filter-node-method="filterNode"
      ref="tree2">
    </el-tree>
    <el-dialog
      title="添加部门"
      :visible.sync="dialogVisible"
      width="30%"
      >
      <table>
        <tr>
          <td>父部门:</td>
          <td>
            <!--通过v-model中的值来选中。v-model的值为当前被选中的el-option的 value 属性值-->
            <el-select size="mini" v-model="selected" placeholder="请选择父部门">
              <el-option
                v-for="dep in depsforselect"
                :key="dep.id"
                :label="dep.name"
                :value="dep.id">
                <!--value是上传时显示的值-->
              </el-option>
            </el-select>
          </td>
        </tr>
        <tr>
          <td>部门名称:</td>
          <td><el-input size="mini" v-model="depName" placeholder="请输入部门名称"></el-input></td>
        </tr>
      </table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addDep">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import {getRequest} from "../../../utils/api";

  export default {
    name:'DepMana',
    data(){
      return {
        deps: [],
        //配置树形结构的展示对应的json中键
        defaultProps: {
          children: 'children',
          label: 'name'
        },
        dialogVisible:false,
        depsforselect:[],
        selected:'',
        depName:'',
        currentData:'',
        filterText: ''
      }
    },
    //监听filterText的变化
    watch: {
      //注意这里是监听filterText属性的回调方法
      filterText(val) {
        //调用tree2的过滤器进行过滤
        this.$refs.tree2.filter(val);
      }
    },
    methods:{
      //用于过滤树的节点。每个节点都会过滤，返回true表示显示。data是当前节点的数据,data会自动传入。
      filterNode(value, data) {
        console.log(data);
        if (!value) return true;
        //判断name是否包含value
        return data.name.indexOf(value) !== -1;
      },
      //自定义设置树形菜单内容与格局
      renderContent(h, { node, data, store }) {
        return (
          <span class="custom-tree-node" style="display: flex;justify-content: space-between;width: 500px">
          <span>{node.label}</span>
          <span>
            <el-button  style="margin:0px;padding:2px" size="mini" type="primary" on-click={ () => this.showAdddialog(data,event) }>添加部门</el-button>
            <el-button  style="margin:0px;padding:2px" size="mini" type="danger" on-click={ () => this.delDep(data,event) }>删除部门</el-button>
          </span>
          </span>);
      },
      initDeps(){
        this.getRequest("/system/basic/dep/").then(resp=>{
          if(resp&&resp.status==200){
            this.deps=resp.data;
          }
        })
      },showAdddialog(data,event){
        //加载下拉菜单
        this.initDepsForSelect();
        this.dialogVisible=true;
        this.selected=data.id;
        this.currentData=data;
        console.log(data);
        //防止事件冒泡
        event.stopPropagation();
      },initDepsForSelect(){
        this.getRequest("/system/basic/dep/depsforselect").then(resp=>{
          if(resp&&resp.status==200){
            this.depsforselect=resp.data;
          }
        })
      },addDep(){
        this.postRequest("/system/basic/dep/",{parentid:this.selected,name:this.depName}).then(resp=>{
          if(resp&&resp.data.status==200){

            var dep = resp.data.obj;

            const newChild = { id: dep.id, name: dep.name, children: [],parentid:dep.parentid };
            //如果当前节点没有孩子，则创建一个空孩子数组
            if (!this.currentData.children) {
              this.$set(this.currentData, 'children', []);
            }

            this.currentData.isparent=true;
            //将孩子节点插入父节点的孩子节点数组中
            this.currentData.children.push(newChild);

            this.dialogVisible=false;
            this.selected='';
            this.depName='';
          }
        })
      },delDep(data,event){
          event.stopPropagation();
          if(data.isparent==true){
            this.$message.error("有子部门，不能删除！");
          }else {
            this.deleteRequest("/system/basic/dep/?id="+data.id).then(resp=>{
              if(resp&&resp.data.status==200){
                this.doDelFromDeps(this.deps,data.id);
                //刷新deps，注意：由于嵌套着children因此遍历时要使用递归。
                this.freshDeps(this.deps,data.parentid);
              }
            })
          }
        },doDelFromDeps(deps,id){
        for (var i = 0; i < deps.length; i++) {
          var dep = deps[i];
          if(dep.id==id){
            //splice用于删除数组中的元素，参数一表示数组下标，参数二表示删除几个。
            deps.splice(i,1);

            return;
          }else{
            //递归
            this.doDelFromDeps(dep.children,id);
          }
        }
      },freshDeps(deps,pid) {
        for (var i = 0; i < deps.length; i++) {
          var dep = deps[i];
          if (dep.id == pid) {
            if(dep.children.length==0){
              dep.isparent=false;
              return;
            }
          } else {
            //递归
            this.freshDeps(dep.children, pid);
          }
        }
      }
    },mounted(){
      this.initDeps();
    }
  }
</script>

<style scoped>

</style>
