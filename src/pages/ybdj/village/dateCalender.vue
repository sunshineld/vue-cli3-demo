<route-meta>
{
  "requiresAuth": true,
  "name":"日程管理",
  "parent":"首页"
}
</route-meta>
<!--  -->
<template>
    <div style="margin-top:40px">
        <full-calendar :events="fcEvents" @moreClick='moreClick ' @changeMonth='changeMonth' @dayClick='dayClick' @eventClick='eventClick ' lang="zh">

        </full-calendar>

        <!--查看模态框-->
        <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" :close-on-click-modal='false' @close='handleCancel'>
            <el-form label-width="150px">
              <el-row>
                <el-col :span="12">
                  <div>
                    <el-button type="danger" size="small" circle v-if='newQuerys.cautionType == 1' class="circle"></el-button>
                    <el-button type="warning" size="small" circle v-if='newQuerys.cautionType == 2' class="circle"></el-button>
                    <el-button size="small" class="circle" style='background:#f4e136;border-color:#f4e136;' circle v-if='newQuerys.cautionType == 3'></el-button>
                    <el-button type="success" size="small" circle v-if='newQuerys.cautionType == 4' class="circle"></el-button>
                    <el-form-item label="任务编号：" prop="id">
                      <p>{{newQuerys.id}}</p>
                    </el-form-item>
                  </div>
                </el-col>
                <el-col :span="12">
                  <el-form-item label='任务名称：'>
                    <span class="p_style">{{newQuerys.title}}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label='发布类型：'>
                    <span>{{newQuerys.sendTypeZh}}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label='任务发布单位：'>
                    <span>{{newQuerys.masterOrgName}}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label='任务类型：'>
                    <span>{{newQuerys.taskTypeZh}}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label='回执要求：'>
                    <span>{{newQuerys.needReceiptTypeZh}}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label='重要重度：'>
                    <span>{{newQuerys.importantTypeZh}}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label='任务截止时间：'>
                    <span>{{newQuerys.endTime | date}}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label='任务状态：'>
                    <span>{{newQuerys.checkStatusZh}}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label='任务要求：'>
                    <span v-if='!newQuerys.content'>无</span>
                    <el-input v-else type="textarea" :value='newQuerys.content' rows='6' :readonly="true" style='width:80%;'></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label='任务文档：'>
                    <span v-if='!newQuerys.taskDocuments'>无</span>
                    <div v-else v-for='(item,index) in newQuerys.taskDocumentsAccess' :key="index">
                      <a :href="item" target="_blank" class='a_style'>{{item.split('_')[1]}}</a>         
                    </div>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
            <el-form label-width="150px" v-if='newQuerys.taskType == 2' :model='feedbackQuerys' :rules="rules" ref='feedbackQuerys'>
                <el-row>
                  <el-col :span='24'>
                        <el-form-item label="完成说明：" prop='info'>
                            <el-input type="textarea" :disabled="dis" :rows='6' v-model="feedbackQuerys.info" style='width:80%;'></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span='12'>
                        <el-form-item label="上传文件：">
                            <fileUpload v-model='feedbackQuerys.documents' :fileList='feedbackQuerys.documentsAccess' :disableBtn='disableBtn'></fileUpload>
                        </el-form-item>
                    </el-col>
                    <el-col :span='24'>
                        <el-form-item label="上传图片：">
                            <imgsUpload v-model='feedbackQuerys.images' :imageUrl='feedbackQuerys.imagesAccess'></imgsUpload>
                        </el-form-item>
                    </el-col>
                    
                </el-row>
            </el-form>

            <div slot="footer" class="dialog-footer">
                <el-button type="success" :disabled="isDisableBtn" v-show='!dis' @click='schedule'>重新安排日程</el-button>
                <el-button type='primary' :disabled="isDisableBtn" v-show='!dis' @click='gave'>{{gaves}}</el-button>
                <el-button  @click="handleCancel" :disabled="isDisableBtn">取消</el-button>
            </div>
        </el-dialog>

        <el-dialog title="安排日程" :visible.sync="dialogVisibleTwo">
            <el-form>
                <el-row>
                    <el-col :span='8'>
                        <el-form-item label="安排日程" prop="birthday">
                            <el-date-picker type="date" placeholder="选择日期" v-model="schedQuery.alarmTime"></el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span='12'>
                        <el-button type="danger" @click="dialogVisibleTwo = false">取消</el-button>
                        <el-button type="primary" @click='scheduleSave'>确定</el-button>
                    </el-col>
                </el-row>
            </el-form>
        </el-dialog>

    </div>
</template>

<script>
import {
//   getVillageSystemTaskRecordsSchedule as get,
//   putSystemTaskRecordsSchedule as put,
//   putSystemTaskRecords as putTwo,
//     delVillageSystemTaskRecords as del,
//   postVillageSystemTaskRecords as post,
//   getSystemTasksTree,
} from "../../../api/villageApi";
import {base} from '../../../api/api';

const code = "200";
import fileUpload from '../../../components/common/uploadsFile.vue';
import imgsUpload from '../../../components/common/imgsUpload.vue';
import {checkEmporty} from '../../../utils/validator.js';
export default {
    layout:'home',
  data() {
    return {
      uploadUrl: base + "/upload",
      fcEvents: [],
      query: {
        startTime: "",
        endTime: ""
      },
      dialogVisible: false,
      dialogVisibleTwo: false,
      newQuerys: {},
      dis: false,
      isDisableBtn: false,
      schedQuery: {
        alarmTime: "",
        id: "",
        isAlarm: 1
      },
      feedbackQuerys: {
        info: "",
      },
      gaves: "",
      dialogTitle:'',
      rules: {
        info: [{validator: checkEmporty,required: true, max: 800, trigger: 'blur' }]
      },
      fileList:[],
    };
  },

  components: {
    "full-calendar": require("vue-fullcalendar"),
    fileUpload,
    imgsUpload
  },

  methods: {
    getSearchList() {
      get(this.query)
        .then(res => {
          if (res.data.code == code) {
            let list = [];
            if (res.data.data.list.length) {
              res.data.data.list.forEach(item => {
                list.push({
                  title: item.title,
                  start: item.alarmTime,
                  cssClass: ["white", "bg" + item.cautionType],
                  YOUR_DATA: item
                });
              });
            }
            this.fcEvents = list;
          } else {
            this.$message({
              type: "error",
              message: res.data.message
            });
          }
        })
        .catch(() => {
          this.$message({
            type: "error",
            message: "查询失败,请重试或者联系管理员！！"
          });
        });
    },
    changeMonth(s, e, c) {
      var end = c.split("-");//当月第一天日期
      var newD = new Date(end[0], end[1], 0).getDate();
      end[2] = newD;
      this.query.startTime = c;
      this.query.endTime = end.join("-");
      this.getSearchList();
    },
    eventClick(e) {
      this.dialogVisible = true;
      this.newQuerys = e.YOUR_DATA;
      this.feedbackQuerys = JSON.parse(JSON.stringify(this.newQuerys));
      this.dialogTitle = '任务详情';
      if (this.newQuerys.taskType == 1) {
        this.gaves = "去完成";
      } else {
        this.gaves = "确认提交";
      }
      this.$nextTick(function() {
        this.$refs['feedbackQuerys'].resetFields();
      })
      this.getUploadAss();
    },
    dayClick(e, q) {
      //    var d = e;
      //    var resDate = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
      //    console.log(resDate,q)
    },
    moreClick(e) {
        // console.log(e,1)
    },
    gave() {//立即完成
      this.$refs['feedbackQuerys'].validate((valid) => {
        if(valid) {
          if (this.newQuerys.taskType == 1) {
            this.$confirm("此操作跳转其他页面完成任务, 是否继续?", "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
            })
              .then(() => {
                this.$router.push({
                  path: this.newQuerys.systemTreeMenuUrl
                });
              })
              .catch(() => {});
          } else if (this.newQuerys.taskType == 2) {
            let queryList = {
              id: this.newQuerys.id,
              documents: this.feedbackQuerys.documents,
              images: this.feedbackQuerys.images,
              info: this.feedbackQuerys.info
            };
            if (queryList.info == "") {
              this.$message({
                type: "warning",
                message: "请填写完成说明！"
              });
              return
            }
            console.log(queryList);
            putTwo(queryList)
              .then(res => {
                if (res.data.code == code) {
                  this.dialogVisible = false;
                  this.getSearchList();
                  this.$message({
                    type: "success",
                    message: res.data.message
                  });
                } else {
                  this.$message({
                    type: "error",
                    message: res.data.message
                  });
                }
              })
              .catch(() => {
                this.$message({
                  type: "error",
                  message: "查询失败,请重试或者联系管理员！！"
                });
              });
          }
        }
      })
      
    },
    getUploadAss() {
      if (this.newQuerys.checkStatus == 4 || this.newQuerys.checkStatus == 5) {
        this.dis = true;
        if (this.newQuerys.accessDocuments.length) {
          this.newQuerys.accessDocuments.forEach(item => {
            this.fileList.push({
              name: item.substring(item.lastIndexOf("/") + 1),
              url: item
            });
          });
        }
        if (this.newQuerys.accessImages.length) {
          this.newQuerys.accessImages.forEach(item => {
            this.fileListTwo.push({
              url: item
            });
          });
        }
      } else {
        this.dis = false;
      }
      console.log('0000',this.newQuerys)
    },
    handleExceed(file, e) {
      this.$message({
        type: "error",
        message: "最多只能上传" + e.length + "个文件"
      });
    },
    onSuccess(response, file, fileList) {
      this.fileList = fileList;
    },
    onSuccessTwo(response, file, fileList) {
      this.fileListTwo = fileList;
    },
    //安排日程
    schedule() {
      this.dialogVisibleTwo = true;
      this.schedQuery = {
        alarmTime: "",
        id: "",
        isAlarm: 1
      };
    },
    scheduleSave() {
      this.schedQuery.id = this.newQuerys.id;
      if (this.schedQuery.alarmTime == "") {
        this.$message({
          type: "error",
          message: "请安排日程"
        });
        return
      }
      put(this.schedQuery)
        .then(res => {
          if (res.data.code == code) {
            this.dialogVisibleTwo = false;
            this.dialogVisible = false;
            this.getSearchList();
            this.$message({
              type: "success",
              message: res.data.message
            });
          } else {
            this.$message({
              type: "error",
              message: res.data.message
            });
          }
        })
        .catch(() => {
          this.$message({
            type: "error",
            message: "查询失败,请重试或者联系管理员！！"
          });
        });
    },
    disableBtn(val) {
      this.isDisableBtn = val;
    },
    handleCancel() {
      this.dialogVisible = false;
    }
    
  }
};
</script>
<style>
.circle {
  position: absolute;
  left: 36px;
  height:20px;
  cursor:text;
  margin-top: 9px;
}
.full-calendar-header {
  height: 40px;
  background-color: #228df1;
  color: #fff;
}
.full-calendar-body{
    margin-top: 0;
}
.full-calendar-body .weeks {
    height: 30px;
    line-height: 30px;
    background-color: #228df1;
    color: #fff;
    border-color: #228df1;
}
.full-calendar-body .weeks .week {
    border-color: #228df1;
}
.full-calendar-body
  .dates
  .dates-events
  .events-week
  .events-day
  .event-box
  .event-item.bg1 {
  background: #f56c6c;
}
.full-calendar-body
  .dates
  .dates-events
  .events-week
  .events-day
  .event-box
  .event-item.bg2 {
  background: #e6a23c;
}
.full-calendar-body
  .dates
  .dates-events
  .events-week
  .events-day
  .event-box
  .event-item.bg3 {
  background: rgb(244, 225, 54);
}
.full-calendar-body
  .dates
  .dates-events
  .events-week
  .events-day
  .event-box
  .event-item.bg4 {
  background: #67c23a;
}
.today {
  /* background-color: transparent; */
  opacity: 1;
}

</style>
<style scoped>
.comp-full-calendar {
  padding: 0 !important;
  margin-top: -30px;
}

.content {
  display: flex;
  flex-wrap: wrap;
  padding: 0 20px;
}
.Red {
  color: red;
}
.content .contentP {
  width: 50%;
  margin-bottom: 10px;
  height: 42px;
  line-height: 42px;
}
.title {
  width: 30%;
  text-align: right;
  display: inline-block;
}
.name {
  /* border: 1px solid #bcbaba; */
  padding: 5px 20px;
}
.detail {
  position: absolute;
  right: 10%;
  bottom: 8%;
  color: #409eff;
  cursor: pointer;
}
.dialogContent .contentP {
  width: 25%;
}

.dialogContent .descP {
  padding: 0 20px;
}
.descTitle {
  width: 7.5%;
  display: inline-block;
  text-align: right;
}
.descP .descSpan {
  width: 90%;
  display: inline-block;
  height: 100px;
  box-sizing: border-box;
  margin-bottom: 15px;
  border: 1px solid #bcbaba;
  padding: 5px 10px;
}
.dialog-footer {
  text-align: center;
}

.h1Span {
  display: inline-block;
  min-width: 20%;
}
.gent {
  vertical-align: middle;
}
.gent i {
  display: inline-block;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  vertical-align: middle;
  margin: 0 5px;
}
</style>
