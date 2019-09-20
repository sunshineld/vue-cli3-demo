<template>
  <el-breadcrumb class="app-breadcrumb" separator="/">
    <transition-group name="breadcrumb">
      <el-breadcrumb-item v-for="(item,index) in levelList" :key="item.path">
        <span v-if="item.redirect==='noRedirect'||index==levelList.length-1" class="no-redirect"><span v-if="item.meta&&item.meta.parent">{{item.meta?item.meta.parent:''}} / </span>{{ item.meta.name }}</span>
        <a v-else @click.prevent="handleLink(item)">{{ item.meta.name }}</a>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>

<script>
import { match } from 'minimatch'

export default {
  data() {
    return {
      levelList: []
    }
  },
  watch: {
    $route() {
      this.getBreadcrumb()
    }
  },
  created() {
    this.getBreadcrumb()
  },
  methods: {
    getBreadcrumb() {
      // only show routes with meta.title
      let matched = this.$route.matched.filter(item => item.name)
      const first = matched[0]
      if (this.isDashboard(first)) {
        // matched = [{ path: '/readme', name:'首页'}].concat(matched)
        matched[0].name = '首页';
      }
      this.levelList = matched.filter(item => item.name)
    },
    isDashboard(route) {
      const name = route && route.name
      if (!name) {
        return false
      }
      return name.trim().toLocaleLowerCase() === 'readme'.toLocaleLowerCase()
    },
    handleLink(item) {
      const { redirect, path } = item
      if (redirect) {
        this.$router.push(redirect)
        return
      }
      this.$router.push(path)
    }
  }
}
</script>

<style lang="css" scoped>
.app-breadcrumb.el-breadcrumb {
  display: inline-block;
  font-size: 14px;
  line-height: 50px;
  margin-left: 8px;

  
}
.app-breadcrumb.el-breadcrumb .no-redirect {
    color: #97a8be;
    cursor: text;
  }
</style>
