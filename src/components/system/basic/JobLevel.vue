<template>
  <div>
    <div>
      <el-input prefix-icon="el-icon-plus" style="width: 200px" size="mini" v-model="jl.name"
                placeholder="请输入职称"></el-input>

      <el-select v-model="jl.titlelevel" placeholder="请选择" size="mini">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
      <el-button type="primary" size="mini" icon="el-icon-plus" @click="addJl">添加</el-button>
    </div>
    <div style="margin-top: 10px">
      <el-table
        :data="joblevels"
        stripe
        border
        style="width: 100%">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          prop="id"
          label="编号"
          width="180">
        </el-table-column>
        <el-table-column
          prop="name"
          label="名称"
          width="180">
        </el-table-column>
        <el-table-column
          prop="titlelevel"
          label="级别"
          width="180">
        </el-table-column>
        <el-table-column
          label="创建时间"
        >
          <template slot-scope="scope">
            {{scope.row.createdate | formatDate}}
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="180">
          <!--template是一个虚拟节点表示占位。scope.$index表示当前行索引，scope.row表示当前行的json对象-->
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
    </div>
    <el-dialog
      title="修改职称"
      :visible.sync="dialogVisible"
      width="30%"
    >
      <div>
        <table>
          <tr>
            <td>名称:</td>
            <td>
              <el-input size="mini" v-model="dialogData.name"></el-input>
            </td>
          </tr>
          <tr>
            <td>等级:</td>
            <td>
              <el-select v-model="dialogData.titlelevel" placeholder="请选择" size="mini">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </td>
          </tr>
        </table>
      </div>
      <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="updateJobLevel">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        joblevels: [],
        jl: {
          name: '',
          titlelevel: '中级'
        }, dialogData: {
          name: '',
          titlelevel: '中级',
          id: ''
        },
        options: [{
          value: '正高级',
          label: '正高级'
        }, {
          value: '副高级',
          label: '副高级'
        }, {
          value: '中级',
          label: '中级',

        }, {
          value: '初级',
          label: '初级'
        }], dialogVisible: false
      }

    }, methods: {
      initJl() {
        this.getRequest("/system/basic/joblevel/").then(resp => {
          if (resp && resp.status == 200) {
            this.joblevels = resp.data;
          }
        })
      }, addJl() {
        console.log(JSON.stringify(this.jl));
        this.postBodyRequest("/system/basic/joblevel/", JSON.stringify(this.jl)).then(resp => {
          if (resp && resp.data.status == 200) {
            this.initJl();
            this.jl = {
              name: '', titlelevel: '中级'
            }
          }
        })
      }, handleEdit(index, row) {
        this.dialogVisible = true;
        this.dialogData.name = row.name;
        this.dialogData.id = row.id;
        this.dialogData.titlelevel = row.titlelevel;

      }, handleDelete(index, row) {
        this.$confirm('此操作将删除【' + row.name + '】, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.deleteRequest("/system/basic/joblevel/?id=" + row.id).then(resp => {
            if (resp && resp.data.status == 200) {
              this.initJl();
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });


      }, updateJobLevel() {
        this.dialogVisible = false;

        this.putRequest("/system/basic/joblevel/", this.dialogData).then(resp => {
          if (resp && resp.data.status == 200) {
            this.initJl();
          }
        })
      }
    }, mounted() {
      this.initJl();
    }
  }
</script>

<style scoped>

</style>
