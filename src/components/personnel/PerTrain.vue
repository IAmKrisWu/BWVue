<template>
  <div>

    <div style="margin-top: 10px;">
      <el-dialog
        title="提示"
        :visible.sync="dialogVisible"
        width="50%"
        >
        <div>
          <el-steps :active="active" finish-status="success">
            <el-step :title="steps[0]"></el-step>
            <el-step :title="steps[1]"></el-step>
            <el-step :title="steps[2]"></el-step>
            <el-step :title="steps[3]"></el-step>
          </el-steps>
          <div style="display: flex;justify-content: center" v-if="active!=steps.length">
            {{step}}:<el-input size="mini" v-model="input" style="margin-left: 20px;width: 200px;"></el-input>
          </div>
          <div v-if="active==steps.length" style="text-align: center">您现在可以提交啦</div>
        </div>

        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addTrain" v-if="active==steps.length">确 定</el-button>
          <el-button  @click="next" v-if="active!=steps.length">下一步</el-button>
        </span>
      </el-dialog>
      <el-button type="primary" @click="opendialog" size="mini">添加</el-button>
    </div>
    <el-table
      :data="tableData"
      style="width: 100%"
      @selection-change="handleSelectionChange"
      height="500"
      width="100%">
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column
        label="编号"
        width="80">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.id}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="姓名"
        width="80">
        <template slot-scope="scope">
          <el-popover trigger="hover" placement="top">
            <p>编号: {{ scope.row.employee.id }}</p>
            <p>姓名: {{ scope.row.employee.name }}</p>
            <p>性别: {{ scope.row.employee.gender }}</p>
            <div slot="reference" class="name-wrapper">
              <el-tag size="medium">{{ scope.row.employee.name }}</el-tag>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column
        label="培训内容"
        width="150">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.trainContent}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="日期"
        width="180">
        <template slot-scope="scope">
          <i class="el-icon-time"></i>
          <span style="margin-left: 10px">{{ scope.row.trainDate | formatDate}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="部门"
        width="100">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.employee.department.name }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="备注"
        width="150">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.remark}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" width="180">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="handleEdit(scope.$index, scope.row)">编辑
          </el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="display: flex;justify-content: space-between;margin-top: 20px">
      <el-button type="primary" :disabled="multipleSelection.length==0" round @click="sendemails">发送邮件通知</el-button>
    </div>
    <el-dialog
      title="提示"
      :visible.sync="updialogVisible"
      width="50%"
    >
      <div style="display: flex;justify-content: center">
      <table style="text-align: center">
        <tr>
          <td>编号:</td>
          <td><el-input size="mini" v-model="updatetrain.id" disabled/></td>
        </tr>
        <tr>
          <td>员工编号:</td>
          <td><el-input size="mini" v-model="updatetrain.eid"/></td>
        </tr>
        <tr>
          <td>培训日期:</td>
          <td><el-input size="mini" v-model="updatetrain.trainDate"/></td>
        </tr>
        <tr>
          <td>培训内容:</td>
          <td><el-input size="mini" v-model="updatetrain.trainContent"/></td>
        </tr>
        <tr>
          <td>备注:</td>
          <td><el-input size="mini" v-model="updatetrain.remark"/></td>
        </tr>
      </table>
      </div>
      <div style="display: flex;justify-content: center;margin-top: 10px">
        <el-button @click="updialogVisible = false" size="mini">取 消</el-button>
        <el-button type="primary" @click="doupdate" size="mini">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        tableData: [],
        multipleSelection: [],
        dialogVisible: false,
        active: 0,
        input:'',
        step:'',
        steps:["员工编号","培训时间","培训内容","备注"],
        train:{eid:'',trainDate:'',trainContent:'',remark:''},
        updatetrain:{id:'',eid:'',trainDate:'',trainContent:'',remark:''},
        updialogVisible:false
      }
    },
    methods: {
      handleEdit(index, row) {
        console.log(index, row);
        this.updialogVisible=true;
        this.updatetrain.id=row.id;
        this.updatetrain.eid=row.employee.id;
        this.updatetrain.trainDate=this.formatDate(row.trainDate);
        this.updatetrain.trainContent=row.trainContent;
        this.updatetrain.remark=row.remark;

      },
      doupdate(){
        this.putRequest("/personnel/train/",this.updatetrain).then(resp=>{
          if(resp&&resp.data.status==200){
            this.initTable();
            this.updialogVisible=false;

          }
        })
      },
      handleDelete(index, row) {
        console.log(index, row);
        this.$confirm('此操作将删除【'+row.employee.name+'】的培训信息, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.deleteRequest("/personnel/train/?id="+row.id).then(resp=>{
            if(resp&&resp.data.status==200){
              this.initTable();
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      initTable() {
        this.getRequest("/personnel/train/").then(resp => {
          if (resp && resp.status == 200) {
            this.tableData = resp.data;
          }
        })
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      sendemails() {
        let _this = this;

        for (let i = 0; i < this.multipleSelection.length; i++) {
          console.log(this.multipleSelection);
          let train = this.multipleSelection[i];
          let employee = train.employee;
          //时间类型转换
          var date = new Date(train.trainDate);
          var year = date.getFullYear();
          var month = date.getMonth() + 1;
          var day = date.getDate();
          if (month < 10) {
            month = "0" + month;
          }
          if (day < 10) {
            day = "0" + day;
          }

          this.postRequest("/mail/send", {
            content: train.trainContent,
            name: employee.name,
            date: year+"/"+month+"/"+day
          }).then(resp => {
          })
        }

      },
      opendialog() {
        this.dialogVisible=true;
      },
      next() {
        // if (this.active++ > 2) this.active = 0;
        if(this.active==0){
          this.train.eid=this.input;
        }else if(this.active==1){
          this.train.trainDate=this.input;
        }else if(this.active==2){
          this.train.trainContent=this.input;
        }else if(this.active==3){
          this.train.remark=this.input;
        }
        this.active++;
        this.step=this.steps[this.active];

        this.input='';
      },
      addTrain(){
        this.dialogVisible=false;
        this.postRequest("/personnel/train/",this.train).then(resp=>{
          if(resp&&resp.data.status==200){
            this.initTable();
          }
        })
      },
      formatDate(value) {
        var date = new Date(value);
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();
        if (month < 10) {
          month = "0" + month;
        }
        if (day < 10) {
          day = "0" + day;
        }
        return year + "/" + month + "/" + day;
      }
    },
    mounted() {
      this.initTable();
      this.step=this.steps[0];
    }
  }
</script>
