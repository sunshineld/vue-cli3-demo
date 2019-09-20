<template>
    <div :class="collapse?'sidebar':'sidebar_close'" id="sidebar">
        <div class="logo" v-if="collapse"><img src="../../../static/img/headLogo.png"><span>基层组织工作平台</span></div>
        <div class="logosTwo" v-else>
            <img src="../../../static/img/headLogo.png">
        </div>
            <el-menu :style="{'min-height':minHeight}" :default-active="onRoutes" :background-color="collapse?'transparent':'#f46666'" text-color="#fff" active-text-color="#333" router :collapse="!collapse" unique-opened>

                <el-menu-item index="/readme" style='text-align:left;'>
                    <i class="fa fa-info icon-right menuIcon"></i><span class="menuName">系统介绍</span>
                </el-menu-item>

                <template v-for="(item,index) in menuData">
                    <template v-if="item.children.length&&item.children[0].menuType==1">
                        <el-submenu :index="index.toString()">
                             <template slot="title"><i class="menuIcon" :class="item.icon"></i><span class="menuName">{{item.menuName}}</span></template>
                            <template v-if='subitem.children.length' v-for="(subitem,indexTwo) in item.children" >
                                <el-submenu  :index="(indexTwo+11000).toString()">
                                    <template slot="title"><span class="menuName">{{subitem.menuName}}</span></template>
                                    <template v-if="child.children.length" v-for='(child,indexThree) in subitem.children'>
                                      <el-submenu :index='(indexThree+12000).toString()'>
                                        <template slot="title"><span class="menuName">{{child.menuName}}</span></template>
                                          <el-menu-item  :index="childs.path" :key='childs.id' v-if='child.children.length &&child.menuType==1 ' v-for="childs in child.children"><span class="menuName">{{childs.menuName}}</span></el-menu-item>
                                      </el-submenu>
                                    </template>
                                    <template v-else>
                                      <el-menu-item  :index="child.path"><span class="menuName">{{child.menuName}}</span></el-menu-item>
                                    </template>
                                </el-submenu>
                            </template>
                            <template v-else>
                                <el-menu-item :index="subitem.path"><span class="menuName">{{subitem.menuName}}</span></el-menu-item>
                            </template>
                        </el-submenu>
                    </template>
                    <template v-else>
                        <el-menu-item :index="item.path" :key="item.id"><i class="menuIcon" :class="item.icon"></i><span class="menuName">{{item.menuName}}</span></el-menu-item>
                    </template>
                </template>
            </el-menu>
        </div>
</template>

<script>
import { getUserMenu } from "../../api/api";
const code = "200";
export default {
  data: function() {
    return {
      menuData: [],
      menuCollapse: false
    };
  },
  props: {
    collapse: Boolean
  },
  computed: {
    isCun() {
      let userStr = localStorage.getItem("user");
      if (!userStr) {
        return false;
      }
      let user = JSON.parse(userStr);
      return user.partyOrg.level
    },
    onRoutes() {
      return this.$route.path.replace("/", "");
    },
    minHeight() {
      return document.documentElement.clientHeight - 70 + "px";
    }
  },
  methods: {
    getUserMenu() {
      const self = this;
      let params = {};
      getUserMenu(params)
        .then(res => {
          if (res.data.code == code) {
            this.menuData = res.data.data;
            let menuArr = [];
            this.menuData.forEach(item => {
              if (item.path == "" || item.path == null) {
                if (item.children != null) {
                  item.children.forEach(e => {
                    menuArr.push(e.path);
                  });
                }
              } else {
                menuArr.push(item.path);
              }
            });
            window.localStorage.setItem(
              "menuArr",
              JSON.stringify(menuArr.join(","))
            );
          } else {
            this.$message.error(res.data.message);
          }
        })
        .catch(function(error) {
          self.$message.error("网络故障，请稍后再试");
        });
    }
  },
  mounted: function() {
    this.getUserMenu();
  }
};
</script>

<style scoped>
.sidebar {
  display: block;
  position: absolute;
  width: 250px;
  left: 0;
  top: 0;
  bottom: 0;
  overflow: auto;
  transition: width 0.3s;
  color: #fff;
  background: url("../../../static/img/siderbar-background.png") no-repeat;
  background-size: cover;
}

.sidebar_close {
  background: #f46666;
  display: block;
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  overflow: auto;
  transition: width 0.3s;
  color: #fff;
}

.icon-right {
  vertical-align: middle;
  text-align: center;
  width: 14px;
}
.menuIcon {
  margin-right: 15px;
  color: #fff;
  width: 14px;
  display: inline-block;
}

.sidebar .logo {
  height: 70px;
  line-height: 70px;
  text-align: center;
  padding: 0px 16px 0px;
}

.sidebar .logo span {
  vertical-align: middle;
  font-size: 1.4rem;
}

.sidebar .logo img {
  margin-right: 10px;
  vertical-align: middle;
}
.el-menu-item:focus,
.el-menu-item:hover {
  outline: 0;
  background-color: rgba(230, 0, 18, 0.21) !important;
}
.logosTwo {
  padding: 20px 20px 0;
}
.logosTwo img {
  width: 14px;
}
.menuName {
  font-size: 1rem !important;
  padding:0.9rem
}
.menuIcon {
  font-size: 1.1rem !important;
}
::-webkit-scrollbar {
    width: 0px;
    height: 5px;
}
</style>
<style>
.el-submenu__title {
  background-color: transparent !important;
  text-align: left;
}
.el-submenu__title:hover {
  background-color: rgba(230, 0, 18, 0.21) !important;
}
.el-submenu__title i {
  color: #fff;
}
</style>
