<template>
    <div class="login-wrap">
        <div class="ms-login">
            <div class="ms-title"><img src="../../static/img/dangjianicon.png" />农村基层组织工作信息系统</div>
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="70px" label-position="left" class="login-form">
                <el-form-item prop="userName" label="用户名">
                    <!-- <el-input placeholder="请输入用户名" prefix-icon="fa fa-user" v-model="ruleForm.userName"></el-input> -->
                    <el-select v-model="ruleForm.userName" placeholder="请选择" filterable>
                        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="password" label="密码">
                    <el-input type="password" placeholder="请输入登录密码" prefix-icon="fa fa-lock" v-model="ruleForm.password" @keyup.enter.native="submitForm('ruleForm')"></el-input>
                </el-form-item>
                <el-form-item prop="" label="验证码">
                    <el-col :span="10">
                        <el-input v-model="ruleForm.verifyCode" prefix-icon="fa fa-get-pocket" placeholder="输入验证码" @keyup.enter.native="submitForm('ruleForm')"></el-input>
                    </el-col>
                    <el-col :span="12" :offset="2">
                        <div class="imgDiv">
                            <img :src="yanzhengma" alt="" @click="editCaptcha">
                        </div>
                    </el-col>
                </el-form-item>
                <div class="login-btn">
                    <el-button type="warning" @click="submitForm('ruleForm')" :loading="loging">登录</el-button>
                </div>
                <p style="font-size:12px;line-height:30px;color:#999;">Tips : 请输入用户名密码。</p>
            </el-form>
        </div>

    </div>
</template>
<script>
import { userLogin } from '../api/api'
const code = "200";
export default {
  data() {
    return {
      yanzhengma: "",
      ruleForm: {
        userName: "",
        password: "123456",
        verifyCode: "",
        validKey: ""
      },
      rules: {
        userName: [
          { required: true, message: "请输入用户名", trigger: "blur" }
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
        verifyCode: [
          { required: true, message: "请输入验证码", trigger: "blur" }
        ]
      },
      loging: false,
      regs: false,
      dialogVisible: false,
      options: [{
          value: 'sky',
          label: 'sky'
        },
        {
          value: '不当岩村',
          label: '不当岩村'
        },
        // {
        //   value: '火花村',
        //   label: '火花村'
        // }, {
        //   value: '查琦',
        //   label: '查琦'
        // },  {
        //   value: '安边镇',
        //   label: '安边镇'
        // },
        // {
        //   value: '赵场街道',
        //   label: '赵场街道'
        // },
        // {
        //   value: '樟海镇',
        //   label: '樟海镇'
        // },
        // {
        //   value: '大池村',
        //   label: '大池村'
        // }
        ],
    };
  },
  methods: {
    editCaptcha() {
      this.geImg();
    },
    geImg() {
      // getCationCode({}).then(res => {
      //   if (res.data.code == code) {
      //     this.yanzhengma = res.data.data.baseImg;
      //     this.ruleForm.validKey = res.data.data.validKey;
      //   }
      // });
    },
    submitForm(formName) {
      const self = this;
      self.$refs[formName].validate(valid => {
        if (valid) {
          this.loging = true;
          userLogin(this.ruleForm)
            .then(res => {
              this.loging = false;
              if (res.data.code == code) {
                this.$message({
                  message: "登录成功！",
                  type: "success"
                });
                localStorage.setItem(
                  "user",
                  JSON.stringify(res.data.data.userInfo)
                );
                window.name = res.data.data.voucher;
                localStorage.setItem("voucher", res.data.data.voucher);
                self.$router.push("/readme");
              } else {
                this.$message.error(res.data.message);
              }
            })
            .catch(function(error) {
              console.log(error);
              self.loging = false;
              self.$message.error("网络故障，请稍后再试");
            });
        } else {
          console.log("error submit!!");
        }
      });
    }
  },
  components: {
    
  },
  mounted() {
    this.geImg();
  }
};
</script>

<style scoped lang='stylus'>
.login-wrap
  position relative
  width 100%
  height 100%
  background url("../../static/img/login-background.png") no-repeat
  background-size 100%

.ms-login 
  position absolute
  left 50%
  top 50%
  transform translate(-50%,-50%)
  width 541px
  height 476px
  box-shadow -1px 1px 13px 0px rgba(116, 105, 106, 0.75)
  background #fff
  border-radius 10px

.login-form 
  width 420px
  margin 60px auto

.ms-title 
  width 542px
  height 77px
  text-align center
  line-height 77px
  font-size 30px
  color #fff
  background-color #e43a3d
  border-radius 10px
  img 
    margin-right 20px
.login-btn 
  text-align center
  button 
    width 420px
    height 2.9rem
    background-color #ffbb00
    box-shadow -2px 1px 9px 0px rgba(7, 0, 2, 0.17)
    font-size 1.4rem
.imgDiv img 
  max-width 100%
  max-height 100%


</style>
<style lang='stylus'>
  .el-form-item__content 
    text-align left !important
</style>
