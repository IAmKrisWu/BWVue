<template>
  <div>
    <div style="margin-top: 10px">
      <!--@keydown.enter.native="search"键盘回车控制-->
      <el-input v-model="name" placeholder="请输入关键字" size="mini" style="width: 250px" @keydown.enter.native="search"></el-input>
      <el-button icon="el-icon-search" circle size="mini" @click="search"></el-button>
      <el-button type="success" icon="el-icon-download" size="mini" @click="emportemps">导出员工资料</el-button>
      <el-upload
        action="/employee/basic/import"
         style="display: inline"
        :on-progress="uploading"
        :on-success="uploadsuccess"
        :on-error="uploaderr"
        :disabled="uploadtext=='正在上传'">
        <el-button type="success" :disabled="uploadtext=='正在上传'" :icon="uploadstate" size="mini">{{uploadtext}}</el-button>
        <div slot="tip" class="el-upload__tip" style="display: inline">只能上传excel文件,excel中的id字段不设置值</div>
      </el-upload>
    </div>
    <div fit="true">
      <el-table
        :data="emps"
        style="width: 100%;"
        height="500"
        @selection-change="handleSelectionChange">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          fixed
          prop="id"
          label="员工编号"
          width="80">
        </el-table-column>
        <el-table-column
          prop="name"
          label="姓名"
          width="180">
        </el-table-column>
        <el-table-column
          prop="gender"
          label="性别"
          width="55">
        </el-table-column>
        <el-table-column
          label="出生日期"
          width="180">
          <template slot-scope="scope">
            {{scope.row.birthday | formatDate}}
          </template>
        </el-table-column>
        <el-table-column
          prop="idcard"
          label="身份证号码"
          width="180">
        </el-table-column>
        <el-table-column
          prop="wedlock"
          label="是否已婚"
          width="80">
        </el-table-column>
        <el-table-column
          prop="nation.name"
          label="种族"
          width="55">
        </el-table-column>
        <el-table-column
          prop="nativeplace"
          label="籍贯"
          width="55">
        </el-table-column>
        <el-table-column
          prop="politicsstatus.name"
          label="政治面貌"
          width="80">
        </el-table-column>
        <el-table-column
          prop="email"
          label="邮箱"
          width="180">
        </el-table-column>
        <el-table-column
          prop="phone"
          label="电话"
          width="180">
        </el-table-column>
        <el-table-column
          prop="address"
          label="地址"
          width="100">
        </el-table-column>
        <el-table-column
          prop="department.name"
          label="所属部门"
          width="80">
        </el-table-column>
        <el-table-column
          prop="joblevel.name"
          label="职称"
          width="55">
        </el-table-column>
        <el-table-column
          prop="position.name"
          label="职位"
          width="55">
        </el-table-column>
        <el-table-column
          prop="engageform"
          label="签署形式"
          width="80">
        </el-table-column>
        <el-table-column
          prop="tiptopdegree"
          label="最高学历"
          width="80">
        </el-table-column>
        <el-table-column
          prop="specialty"
          label="专业"
          width="180">
        </el-table-column>
        <el-table-column
          prop="school"
          label="毕业院校"
          width="80">
        </el-table-column>
        <el-table-column
          label="起始日期"
          width="180">
          <template slot-scope="scope">
            {{scope.row.begindate | formatDate}}
          </template>
        </el-table-column>
        <el-table-column
          prop="workstate"
          label="工作状态"
          width="80">
        </el-table-column>
        <el-table-column
          prop="workid"
          label="工号"
          width="100">
        </el-table-column>
        <el-table-column
          prop="contractterm"
          label="合同期限(年)"
          width="100">
        </el-table-column>
        <el-table-column
          label="签署时间"
          width="180">
          <template slot-scope="scope">
            {{scope.row.conversiontime | formatDate}}
          </template>
        </el-table-column>
        <el-table-column
          label="合同开始时间"
          width="180">
          <template slot-scope="scope">
            {{scope.row.begincontract | formatDate}}
          </template>
        </el-table-column>
        <el-table-column
          label="合同结束时间"
          width="180">
          <template slot-scope="scope">
            {{scope.row.endcontract | formatDate}}
          </template>
        </el-table-column>
        <el-table-column
        prop="workage"
        label="工龄"
        width="55">
      </el-table-column>
        <el-table-column
        prop="notworkdate"
        label="休息时间"
        width="180">
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="180">
          <!--template是一个虚拟节点表示占位。scope.$index表示当前行索引，scope.row表示当前行的json对象-->
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!--底部-->
    <div style="display: flex;justify-content: space-between;margin-top: 20px">
      <el-button type="danger" :disabled="multipleSelection.length==0" round @click="bathdelete">批量删除</el-button>
      <!--分页-->
      <el-pagination
        background
        layout="total,sizes,prev, pager, next,jumper"
        :total="total"
        :page-sizes="[10, 20, 30, 40,50]"
        :page-size="10"
        @current-change="pagechange"
        @size-change="handleSizeChange">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import {initMenu} from "../../utils/utils";
  import {deleteRequest} from "../../utils/api";

  export default {
    data() {
      return {
        emps: [],
        name:'',
        page:'1',
        count:'10',
        total:20,
        multipleSelection: [],
        uploadstate:'el-icon-download',
        uploadtext:'导入员工资料'
      }
    },//节点加载之前会执行mounted方法
    mounted(){
      this.initMenu();
    },
    methods:{
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      initMenu(){
        this.getRequest("/employee/basic/emp?page="+this.page+"&count="+this.count+"&name="+this.name).then(resp=>{
          if(resp&&resp.status==200){
            this.emps=resp.data.list;
            this.total=resp.data.total;
          }
        })

      },handleEdit(index, row) {
        console.log(index, row);
      },
      handleDelete(index, row) {
        this.$confirm('此操作将删除【'+row.name+'】, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.dodelete(row.id);
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });

      },search(){
        this.initMenu();
      },pagechange(val){
        this.page=val;
        this.initMenu();
      },handleSizeChange(val){
        this.count=val;
        this.initMenu();
      },bathdelete(){
        this.$confirm('此操作将删除'+this.multipleSelection.length+'条数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          var ids = '';
          this.multipleSelection.forEach(row=>{
            ids = ids+row.id+",";
          });
          this.dodelete(ids);
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });

      },dodelete(ids){
        deleteRequest("/employee/basic/emp/"+ids).then(resp=>{
          if(resp.status==200){
            this.initMenu();
          }
        })
      },
      emportemps(){
       // 因为ajax返回的数据是json，而这里返回的是字节，因此使用在当前下载
       window.open("/employee/basic/download","_parent");
      },uploading(){
        this.uploadstate = "el-icon-loading";
        this.uploadtext = "正在上传";
      },uploadsuccess(response, file, fileList){
        if(response&&response.status==200){
          this.uploadstate = "el-icon-upload2";
          this.uploadtext = "导入员工资料";
          this.initMenu();
        }

      },uploaderr(err, file, fileList){
        this.uploadstate = "el-icon-upload2";
        this.uploadtext = "导入员工资料";
      }
    }
  }
</script>


