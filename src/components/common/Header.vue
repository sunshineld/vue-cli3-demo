<template>
  <div class="navbar">
    <el-button class="hamburger-container" :icon="icon" @click.native="onCollapse" size="mini" circle></el-button>
    <breadcrumb class="breadcrumb-container" />
    <div class="right-menu">
      <el-badge class="item" style="line-height: 20px">
        <el-tooltip content="搜索" placement="bottom" effect="light">
          <search class="right-menu-item" />
        </el-tooltip>
      </el-badge>
    
      <el-badge class="item" style="line-height: 20px">
        <el-tooltip content="全屏" placement="bottom" effect="light">
          <screenfull></screenfull>
        </el-tooltip>
      </el-badge>
      <el-badge class="item" style="margin:0 20px;line-height: 20px">
        <el-tooltip content="大屏" placement="bottom" effect="light">
          <i class="fa fa-bar-chart" @click='handleChart'></i>
        </el-tooltip>
      </el-badge>
      <span @click="toMail">
      <el-badge :value="$store.state.todoCount" class="item" style="margin:0 20px;line-height: 20px">
        <el-tooltip content="我的消息" placement="bottom" effect="light">
          <i class="el-icon-bell fa-lg screenfull-svg"></i>
          <!-- <el-button size="small" class="el-icon-message" type="primary" circle></el-button> -->
        </el-tooltip>
      </el-badge>
      </span>

      <!--<div class="collapse">-->
      <!--<el-tooltip :content="tooltip" placement="bottom">-->
      <!---->
      <!--</el-tooltip>-->
      <!--</div>-->
      <el-dropdown class="avatar-container" trigger="click" @command="handleCommand">
        <span class="avatar-wrapper">
          <img class="user-logo" :src="img"> {{username}}
          <i class="el-icon-caret-bottom" />
        </span>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <el-dropdown-item command="modPwd">修改密码</el-dropdown-item>
          <el-dropdown-item command="loginout">退出</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>
<script>
// import {
//   userLoginout,
//   front2,
//   getUserNotifications as get
// } from "../../api/api";
import { userLoginout } from '../../api/api'
import Screenfull from "./Screenfull.vue";
import Breadcrumb from './Breadcrumb'
import Search from './HeadSearch'
const code = "200";
export default {
  props: {
    collapse: Boolean
  },
  data() {
    return {
      name: "sky",
      img: require("../../../static/img/img.jpg"),
      userId: null,
      todoCount: "",
      // websocketUrl: "ws://" + document.domain + ":8088/websocket/",
      // websocketUrl: "ws://192.168.50.162:4399/websocket/",
      // websocketUrl: "ws://118.24.0.151:8091/websocket/",//prod
      websocketUrl: "ws://118.24.8.33:8091/websocket/",//test
      tooltip: "收缩",
      icon: "fa fa-bars"
    };
  },
  components: {
    Screenfull,
    Breadcrumb,
    Search
  },
  computed: {
    username() {
      let userStr = localStorage.getItem("user");
      if (!userStr) {
        return false;
      }
      let user = JSON.parse(userStr);

      if (user.pic != null && user.pic != "") {
        this.img = user.picAccess;
      }
      this.userId = user.id;

      return user.nickName ? user.nickName : user.loginName;
    }
  },
  methods: {
    getTodoCount() {
      get({ isRead: 0 })
        .then(res => {
          if (res.data.code == code) {
            this.todoCount = res.data.data.total;
            this.$store.dispatch("modifyTodoCount",this.todoCount)
            if(this.todoCount){
              this.notifyTodo(this.todoCount);
            }
          } else {
            this.$message({
              type: "error",
              message: res.data.message
            });
          }
        })
        .catch((e) => {
          console.log(e)
          this.$message({
            type: "error",
            message: "查询失败,请重试或者联系管理员！！"
          });
        });
    },

    onCollapse() {
      this.$emit("onCollapse", this.collapse);
    },
    initWebSocket() {
      let self = this;
      var websocket = null;
      //判断当前浏览器是否支持WebSocket
      if ("WebSocket" in window) {
        let userStr = localStorage.getItem("user");
        if (!userStr) {
          return false;
        }
        let userId = JSON.parse(userStr).id;
        websocket = new WebSocket(this.websocketUrl + userId);
      }
      //接收到消息的回调方法
      websocket.onmessage = function(event) {
        self.getTodoCount();
        if (event.data != "1") {
          self.notifyTodo(event.data);
        }
      };
      //监听窗口关闭事件，当窗口关闭时，主动去关闭websocket连接，防止连接还没断开就关闭窗口，server端会抛异常。
      window.onbeforeunload = function() {
        websocket.close();
      };
    },
    notifyTodo(msg) {
      this.$notify.info({
        title: "提示",
        type:"warning",
        dangerouslyUseHTMLString: true,
        message: "<a href='#/innerMail'>您有<strong style='color:red'>"+msg+"</strong>条未读消息，请注意查收</a>",
        offset: 100,
      });
    },
    handleCommand(command) {
      let self = this;
      if (command == "loginout") {
        userLoginout()
          .then(res => {
            if (res.data.code == "200") {
              localStorage.removeItem("voucher");
              localStorage.removeItem("user");
              this.$router.push("/");
              this.$message({
                message: "退出成功！",
                type: "success"
              });
            } else {
              this.$message.error(res.data.message);
              return false;
            }
          })
          .catch(function(error) {
            self.$message.error("网络故障，请稍后再试");
          });
      } else if (command == "modPwd") {
        this.$router.push("/modifyPwd");
      }
    },

    toMail() {
      this.$router.push("/innerMail");
    },
    handleChart() {
      let userStr = localStorage.getItem("user");
      if (!userStr) {
        return false;
      }
      let user = JSON.parse(userStr);
      if(user.partyOrg.level == 6){
         // name=高场镇&cun=公民村&id=83&cunId=86
      window.open('/bigscreen/cunIndex?name='+user.area.parentName+'&cun='+user.area.name+'&id='+user.area.parentId+'&cunId='+user.area.id)
      }else if(user.partyOrg.level == 5){
         window.open('/bigscreen/zengIndex?name='+user.area.name+'&id='+user.area.id)
      }else if(user.partyOrg.level == 4){
         window.open('/bigscreen/')
      }
     
    }
  },
  mounted: function() {
    // this.initWebSocket();
    // this.getTodoCount();
  }
};
</script>
<style scoped>
.header {
  position: relative;
  box-sizing: border-box;
  width: auto;
  height: 42px;
  font-size: 22px;
  line-height: 42px;
  color: #fff;
  background-color: #fff;
}
.header .logo {
  float: left;
  width: 450px;
  text-align: center;
}
.user-info {
  float: right;
  padding-right: 50px;
  font-size: 16px;
  color: #000;
}
.user-info .el-dropdown-link {
  position: relative;
  display: inline-block;
  padding-left: 30px;
  color: #000;
  cursor: pointer;
  vertical-align: middle;
}
.user-logo {
  margin-right: 5px;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  vertical-align: middle;
}
.el-dropdown-menu__item {
  text-align: center;
}
.item {
  margin-top: 0px;
  margin-left: 20px;
  cursor: pointer;
}
.screenfull-svg {
  display: inline-block;
  cursor: pointer;
  fill: #5a5e66;
  font-size: 22px;
}
.el-breadcrumb {
  line-height: 42px;
  padding: 0 20px;
}
.elBtn {
  position: absolute;
  left: 8px;
  top: 8px;
}
.breadcrumb-container {
  float: left;
}

.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);
}
.hamburger-container {
  max-height: 100%;
  margin:10px;
  float: left;
  cursor: pointer;
  transition: background .3s;
  -webkit-tap-highlight-color:transparent;
}

.right-menu {
  float: right;
  height: 100%;
  line-height: 50px;
}

.right-menu:focus {
  outline: none;
}

.right-menu-item {
  display: inline-block;
  padding: 0 8px;
  height: 100%;
  font-size: 18px;
  color: #5a5e66;
  vertical-align: text-bottom;
}
.right-menu-item .hover-effect {
  cursor: pointer;
  transition: background .3s;
}
.right-menu-item .hover-effect:hover {
  background: rgba(0, 0, 0, .025)
}

.avatar-container {
  margin-right: 30px;
}

.avatar-container .avatar-wrapper {
  margin-top: 5px;
  position: relative;
  cursor: pointer;
}

.avatar-container .avatar-wrapper .user-avatar {
  cursor: pointer;
  width: 40px;
  height: 40px;
  border-radius: 10px;
}

.avatar-container .avatar-wrapper.el-icon-caret-bottom {
  cursor: pointer;
  position: absolute;
  right: -20px;
  top: 25px;
  font-size: 12px;
}
</style>
