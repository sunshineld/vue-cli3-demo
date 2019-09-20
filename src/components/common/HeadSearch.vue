<template>
  <div :class="{'show':show}" class="header-search">
    <i class="search-icon el-icon-search" @click.stop="click" />
    <el-select
      ref="headerSearchSelect"
      v-model="search"
      :remote-method="querySearch"
      filterable
      default-first-option
      remote
      placeholder="搜索菜单"
      class="header-search-select"
      @change="change"
    >
      <el-option v-for="item in options" :key="item.path" :value="item" :label="item.menuName" />
    </el-select>
  </div>
</template>

<script>

// import {getMyMenuLeaves} from '../../api/api'

export default {
  name: 'HeaderSearch',
  data() {
    return {
      search: '',
      options: [],
      searchPool: [],
      show: false,
      fuse: undefined
    }
  },
  computed: {
    routes() {
      return this.$store.getters.permission_routes
    },
    lang() {
      return this.$store.getters.language
    }
  },
  watch: {
    lang() {
      this.searchPool = this.generateRoutes(this.routes)
    },
    routes() {
      this.searchPool = this.generateRoutes(this.routes)
    },
    searchPool(list) {
      this.initFuse(list)
    },
    show(value) {
      if (value) {
        document.body.addEventListener('click', this.close)
      } else {
        document.body.removeEventListener('click', this.close)
      }
    }
  },
  mounted() {
    // this.searchPool = this.generateRoutes(this.routes)
  },
  methods: {
    click() {
      this.show = !this.show
      if (this.show) {
        this.$refs.headerSearchSelect && this.$refs.headerSearchSelect.focus()
      }
    },
    close() {
      this.$refs.headerSearchSelect && this.$refs.headerSearchSelect.blur()
      this.options = []
      this.show = false
    },
    change(val) {
      this.$router.push(val.path)
      this.search = ''
      this.options = []
      this.$nextTick(() => {
        this.show = false
      })
    },
    
    querySearch(query) {
      if (query !== '') {
        getMyMenuLeaves({menuName:query}).then((res) => {
                    if (res.data.code == '200') {
                        this.options = res.data.data.list
                    } else {
                        this.$message.error(res.data.message);
                    }
                }).catch(function(error) {
                    self.$message.error('网络故障，请稍后再试');
                });
      } else {
        this.options = []
      }
    }
  }
}
</script>

<style scoped>
.header-search {
  font-size: 0 !important;
}

  .show .header-search-select{
      width: 210px!important;
      margin-left: 10px;
  }

  .search-icon {
    cursor: pointer;
    font-size: 22px;
    vertical-align: middle;
  }

  .header-search .header-search-select {
    font-size: 18px;
    transition: width 0.2s;
    width: 0;
    overflow: hidden;
    background: transparent;
    border-radius: 0;
    display: inline-block;
    vertical-align: middle;
  }

    .header-search .header-search-select  /deep/ .el-input__inner {
      border-radius: 0;
      border: 0;
      padding-left: 0;
      padding-right: 0;
      box-shadow: none !important;
      border-bottom: 1px solid #d9d9d9;
      vertical-align: middle;
    }

</style>
