<template>
    <div>
        <el-row class='hhRow'>
            <el-col :span="5" class='hhcol5'>
                <el-col :span="10" :offset="10">
                    <el-row>
                        {{ items.typeZh }}
                    </el-row>
                    <el-row>
                        {{ items.createTime|date }}
                    </el-row>
                </el-col>
                <el-col :span="2" :offset="2" class='hhcol4'>
                    <div class="circle"></div>
                    <div class="line"></div>
                </el-col>
            </el-col>
            <el-col :span="19" class='hhcol19'>
                <!--<el-button type="primary">顶顶顶顶</el-button>-->
                <el-form :model="items" label-width="150px" style="background-color: rgb(243,246,257);padding-top: 10px;padding-right: 10px;margin-bottom: 15px">
                    <el-row>
                        <el-row>
                            <el-col :span='12' v-if='index<4'>
                                 <el-form-item label="会议时间">
                                <el-date-picker type="date" readonly placeholder="选择日期" v-model="items.eventTime"></el-date-picker>
                                 </el-form-item>
                            </el-col>
                             <el-col :span='12' v-if='index>3'>
                                 <el-form-item label="公开时间">
                                <el-date-picker type="date" readonly placeholder="选择日期" v-model="items.eventTime"></el-date-picker>
                                 </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="12" v-if='index<4'>
                                <el-form-item label="关联会议" prop="eventTime">
                                    <el-input auto-complete="off" v-model="items.title" readonly></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8" :offset="1" v-if='index<4'>
                                <el-button @click='gotoMeeting(items)'>
                                    跳转查看
                                </el-button>
                            </el-col>
                            <el-col :span="12" v-if='index>3'>
                                <el-form-item label="关联公开" prop="eventTime">
                                    <el-input auto-complete="off" v-model="items.title" readonly></el-input>
                                </el-form-item>
                            </el-col>

                        </el-row>
                        <el-row>
                        <el-col :span='24'>
                            <!--1党支部会提议 2“两委“会商议 3党员大会审议 4村民代表会议或村民会议决议 5决议公开 6实施结果公开-->
                            <el-form-item label="讨论内容及结果摘要" prop="type">
                                <!-- <el-input type="textarea" auto-complete="off" readonly v-model="items.content"></el-input> -->
                                <div style='background:#fff;padding:5px 10px;border-radius:5px;min-height:30px;' readonly v-html='items.content'></div>
                            </el-form-item>
                        </el-col>
                        
                        <el-col :span="24" v-if='index>3'>
                            <el-form-item label="公开图片" prop="eventTime">
                                <imgsUpload :imageUrl="items.imgsAccess"  :dis="true"></imgsUpload>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="监督时间" prop="type">
                                <el-date-picker type="date" readonly placeholder="选择日期" v-model="items.superviseTime"></el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="监督人员或机构" prop="type">
                                <el-input auto-complete="off" readonly v-model="items.superviseMaster"></el-input>
                            </el-form-item>
                        </el-col>

                        <el-col :span='24'>
                            <el-form-item label="监督结果" prop="title">
                                <el-input type="textarea" auto-complete="off" readonly v-model="items.superviseResult"></el-input>
                            </el-form-item>
                        </el-col>   

                        <el-col :span='24'>
                            <el-form-item label="" prop="title">
                                <p v-if='items.isLast' style='text-align:right'>
                                    <el-button type='primary' @click='back'>退回</el-button>
                                </p> 
                            </el-form-item>
                        </el-col>   
                        
                        </el-row>
                     
                    </el-row>
                </el-form>

            </el-col>
            
        </el-row>
        
        
        <el-dialog custom-class='meeting' width="50%" title="会议详情" append-to-body :visible.sync="visible">
            asd
        </el-dialog>
    </div>
</template>

<script>
import imgsUpload from '../../components/common/imgsUpload';
export default {
  name: "process",
  props: {
    items: Object,
    meetingName: String,
    meetingTime: String,
    index: [String, Number]
  },
  data() {
    return {
      visible: false
    };
  },
  computed :{
      
  },
  components:{
      imgsUpload
  },
  methods: {
    handleMeeting() {
      // this.visible = true;
    },
    gotoMeeting(items) {
      this.$router.push({
       path:'/villagePartyOrgMeetingMagDetail',
       query:{id:items.relevanceId}
      });
    },
    back() {
        this.$confirm('确认将该事项退回上一步吗?', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.$emit('isBack')
                })
        
    }
  },
  mounted () {
     
  }
};
</script>

<style>
.line {
  height: 95%;
  overflow: hidden;
  width: 6px;
  /*border-top-left-radius: 6px;*/
  /*border-top-right-radius: 6px;*/
  /*border-radius: 3px;*/
  /*background-color: red;*/
  background-color: rgb(228, 231, 237);
  /*border: 1px solid black;*/
  /* border-left: 1.5px solid rgb(242, 217, 169); */
  /* border-right: 1.5px solid rgb(242, 217, 169); */
  z-index: -1;
}
.circle {
  position: absolute;
  height: 14px;
  width: 14px;
  /*background-color: red;*/
  border-radius: 14px;
  border: 5px solid rgb(241, 105, 78);
  z-index: 100;
  margin-top: 10px;
  margin-left: -10px;
}
.hhRow{
    position: relative;
}
.hhcol5{
    position: absolute;
    height: 100%;
}
.hhcol4{
    height: 100%;
}
.hhcol19{
    margin-left: 20.83333%;
}
</style>
<style scoped>
.meeting {
  height: 100%;
}
</style>

