<route-meta>
{
  "requiresAuth": true,
  "name":"党组织基本情况",
  "parent":"组织领导/组织建设"
}
</route-meta>
<!--  -->
<template>
  <div>
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
    <el-tab-pane label="党组织概况" name="first">
        <PartyOrgInfo :activeName = 'activeName'></PartyOrgInfo>
    </el-tab-pane>
    <el-tab-pane label="组织架构" name="last">
        <PartyOrgStructure :activeName = 'activeName'></PartyOrgStructure>
    </el-tab-pane>
    <el-tab-pane label="集体荣誉" name="third">
        <PartyOrgHonor :activeName = 'activeName'></PartyOrgHonor>
    </el-tab-pane>
  </el-tabs>
  </div>
</template>

<script>
import PartyOrgInfo from "../../../components/village/PartyOrgInfo";
import PartyOrgStructure from "../../../components/village/PartyOrgStructure";
import PartyOrgHonor from "../../../components/village/PartyOrgHonor";
export default {
    layout:'home',
  data () {
    return {
        activeName:'first'
    };
  },

  components: {
      PartyOrgInfo,
      PartyOrgStructure,
      PartyOrgHonor
  },

  computed: {},

  mounted(){},

  methods: {
      handleClick(tab) {
          this.activeName = tab.name
      }
  }
}

</script>
<style scoped>
</style>