<template>
  <div>
    <el-tabs v-model="activeName" @tab-click="handleClick" >
      <el-tab-pane label="部门管理" name="first"><DepMana></DepMana></el-tab-pane>
      <el-tab-pane label="奖惩管理" name="second"><EcMana></EcMana></el-tab-pane>
      <el-tab-pane label="职称管理" name="third"><JobLevel></JobLevel></el-tab-pane>
      <el-tab-pane label="权限管理" name="fourth"><PermissMana></PermissMana></el-tab-pane>
      <el-tab-pane label="职位管理" name="fivth"><PositionMana></PositionMana></el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
  import DepMana from './basic/DepMana'
  import EcMana from './basic/EcMana'
  import JobLevel from './basic/JobLevel'
  import PermissMana from './basic/PermissMana'
  import PositionMana from './basic/PositionMana'
  export default {
    components:{
      DepMana,
      EcMana,
      JobLevel,
      PermissMana,
      PositionMana,
    },
    data() {
      return {
        activeName: 'first'
      };
    },
    methods: {
      handleClick(tab, event) {
        // console.log(tab, event);
      }
    }
  };
</script>
