<route-meta>
{
  "requiresAuth": true,
  "name":"议事决策 / 四议两公开一监督",
  "parent":"首页 / 组织领导"
}
</route-meta>
<template>
    <div class="log">
        <div class="search">
            <el-form class="form" :inline="true" :model="query" ref="search">
                <el-form-item label="事项名称">
                    <el-input v-model="query.title" placeholder="请输入事项名称"></el-input>
                </el-form-item>
                <el-form-item label="年度">
                    <el-input v-model="query.year"  placeholder="请输入年度"></el-input>
                </el-form-item>
                <el-form-item>
                    <div class="btnSearch">
                        <el-button type="primary" @click="getSearchList" v-loading="loadingOne">查询</el-button>
                        <el-button type="primary" @click="addModel" v-show="isAddShow">新建</el-button>
                    </div>
                </el-form-item>
            </el-form>
        </div>
        <div class="table-wrapper">
            <el-table ref="multipleTable" :data="list.list" tooltip-effect="dark" @selection-change="handleSelectionChange" v-loading="loadingOne">
                <el-table-column type="selection" width="70"></el-table-column>
                <el-table-column prop="title" label="重大事项名称" show-overflow-tooltip min-width='150'></el-table-column>
                <el-table-column prop="proposalZh" label="党组织提议" show-overflow-tooltip min-width='150'>
                  <template slot-scope="scope" v-if='scope.row.proposalZh'>
                    {{scope.row.proposalZh | zhTime}}通过
                  </template>
                </el-table-column>
                <el-table-column prop="progressTime" label="两委会商议" show-overflow-tooltip min-width='150'>
                  <template slot-scope="scope" v-if='scope.row.deliberationZh'>
                    {{scope.row.deliberationZh | zhTime}}通过
                  </template>
                </el-table-column>
                <el-table-column prop="progressTime" label="党员大会审议" show-overflow-tooltip min-width='150'>
                  <template slot-scope="scope" v-if='scope.row.considerationZh'>
                    {{scope.row.considerationZh | zhTime}}通过
                  </template>
                </el-table-column>
                <el-table-column prop="progressTime" label="村民（代表）大会决议" show-overflow-tooltip min-width='150'>
                  <template slot-scope="scope" v-if='scope.row.resolutionZh'>
                    {{scope.row.resolutionZh | zhTime}}通过
                  </template>
                </el-table-column>
                <el-table-column prop="progressTime" label="决议公开" show-overflow-tooltip min-width='150'>
                  <template slot-scope="scope" v-if='scope.row.resolutionOpenZh'>
                    {{scope.row.resolutionOpenZh | zhTime}}公开
                  </template>
                </el-table-column>
                <el-table-column prop="progressTime" label="结果公开" show-overflow-tooltip min-width='150'>
                  <template slot-scope="scope" v-if='scope.row.openResultZh'>
                    {{scope.row.openResultZh | zhTime}}公开
                  </template>
                </el-table-column>
                <el-table-column label="操作" min-width="300" align="center">
                    <template slot-scope="scope">
                        <!--<el-button size="mini" type="primary" @click="handleAddProcess(scope.$index, scope.row)">新增进程</el-button>-->
                        <el-button size="mini" @click="handleDetail(scope.$index, scope.row)">详情</el-button>
                        <el-button size="mini" type='primary' @click="handleEdit(scope.$index, scope.row)">编辑当前流程</el-button>
                        <el-button v-show="isShowDel" size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
                <!--<el-table-column prop="checkStatusZh" label="审核状态" show-overflow-tooltip width="200"></el-table-column>-->
            </el-table>
        </div>
        <!--批量删除-->
        <div class="block">
            <el-button type="danger" @click="removeAll">批量删除</el-button>
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="currentPage1" :page-size=query.size :page-sizes="[10, 20, 30, 50]" layout="total, sizes, prev,  pager, next" :total=list.total>
            </el-pagination>
        </div>

        <!--新增模态框-->
        <el-dialog :title="dialogTitle" :visible.sync="dialogVisible">
            <el-form label-width="120px" :model="newQuerys" ref="addQuery" :rules="rules" v-if='dialogVisible'>
                <el-row>
                    <el-col :span='12'>
                        <el-form-item label="事项名称" prop="title">
                            <el-input v-model="newQuerys.title" auto-complete="off"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span='12'>
                        <el-form-item label="事项类别" prop="type">
                            <el-select v-model="newQuerys.type" clearable filterable placeholder="请选择事项类别">
                                <v-yvoption groupName="majorIssuesType"></v-yvoption>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span='12'>
                        <el-form-item label="提议时间" prop="startTime">
                            <el-date-picker type="date" placeholder="选择日期" v-model="newQuerys.startTime"></el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span='24'>
                        <el-form-item label="事项介绍" prop="content">
                            <el-input v-model="newQuerys.content" auto-complete="off" type="textarea"></el-input>
                        </el-form-item>
                    </el-col>

                    <el-col :span='12'>
                        <!--1党支部会提议 2“两委“会商议 3党员大会审议 4村民代表会议或村民会议决议 5决议公开 6实施结果公开-->
                        <el-form-item label="关联会议分类" prop="process_type">
                            <el-select v-model="newQuerys.process_type" clearable filterable disabled placeholder="请选择分类">
                                <v-yvoption groupName="meetingProcessType"></v-yvoption>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span='12'>
                        <el-form-item label="关联会议" prop="relevanceId">
                            <el-select v-model="newQuerys.relevanceId" filterable placeholder="请选择分类" @change='changeMeeting(newQuerys.relevanceId)'>
                                <v-yvoption tableName="party_org_meeting" value="id" label='name' :dataList="queryDataList"></v-yvoption>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span='12'>
                        <el-form-item label="会议时间" prop="process_eventTime">
                            <el-date-picker type="date" placeholder="选择日期" disabled v-model="newQuerys.process_eventTime"></el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span='12'>
                        <el-form-item label="会议名称" prop="process_title">
                            <el-input v-model="newQuerys.process_title" disabled auto-complete="off"></el-input>
                        </el-form-item>
                    </el-col>
                     <el-col :span='24'>
                        <el-form-item label="讨论内容及结果摘要">
                            <!-- <el-input type="textarea" v-model="newQuerys.process_content" auto-complete="off"></el-input> -->
                            <v-editor name='add' :inputContent="inputContent" v-model="newQuerys.process_content"></v-editor>
                        </el-form-item>
                    </el-col>
                    <el-col :span='12'>
                        <el-form-item label="监督人员或机构">
                            <el-input v-model="newQuerys.process_superviseMaster" auto-complete="off"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span='12'>
                        <el-form-item label="监督时间" prop="process_superviseTime">
                            <el-date-picker type="date" placeholder="选择日期" v-model="newQuerys.process_superviseTime"></el-date-picker>
                        </el-form-item>
                    </el-col>
                   
                    <el-col :span='24'>
                        <el-form-item label="监督结果">
                            <el-input type="textarea" v-model="newQuerys.process_superviseResult" auto-complete="off"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span='24'>
                        <el-form-item label="监督备注" prop="process_remark">
                            <el-input type="textarea" v-model="newQuerys.process_remark" auto-complete="off"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="handleCreate" :loading="loadingTwo">确 定</el-button>
            </div>
        </el-dialog>
        <!--新增进程或编辑进程-->
        <el-dialog :title="processTitle" :visible.sync="processVisible">
            <el-form label-width="180px" :model="newProcessQuery" ref="processAddQuery" :rules="processRules" v-if='processVisible'>
                <el-row>
                    <el-col :span='12'>
                        <!--1党支部会提议 2“两委“会商议 3党员大会审议 4村民代表会议或村民会议决议 5决议公开 6实施结果公开-->
                        <el-form-item label="关联会议分类" prop="type">
                            <el-select v-model="newProcessQuery.type" clearable filterable disabled placeholder="请选择分类">
                                <v-yvoption groupName="meetingProcessType"></v-yvoption>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span='12'  v-if='newProcessQuery.type<5'>
                        <el-form-item label="关联会议" prop="relevanceIdTwo" v-if='activeItem<3'>
                            <el-select v-model="newProcessQuery.relevanceId" clearable filterable placeholder="请选择会议" @change='changeMeetingTwo(newProcessQuery.relevanceId)'>
                                <v-yvoption tableName="party_org_meeting" value="id" label='name' :dataList="queryDataList"></v-yvoption>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span='12' v-if='newProcessQuery.type>4'>
                        <el-form-item label="关联会议公开" prop="relevanceIdTwo" v-if='activeItem<3'>
                            <el-select v-model="newProcessQuery.relevanceId" clearable filterable placeholder="请选择会议" @change='changeMeetingIsGk(newProcessQuery.relevanceId)'>
                                <v-yvoption tableName="area_public_service" value="id" label='title' :dataList="queryDataListTwo"></v-yvoption>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span='12'>
                        <el-form-item label="选择公开内容" prop="relevanceIdTwo" v-if='activeItem>3'>
                            <el-select v-model="newProcessQuery.relevanceId" clearable filterable placeholder="请选择公开内容" @change='changeMeetingThree(newProcessQuery.relevanceId)'>
                                <v-yvoption tableName="area_public_service" value="id" label='title' :dataList="queryDataListTwo"></v-yvoption>
                            </el-select>
                        </el-form-item>
                    </el-col>
                       
                     <el-col :span='12'  v-if='newProcessQuery.type>4'>
                        <el-form-item label="公开时间" prop="eventTime">
                            <el-date-picker type="date" placeholder="选择日期" v-model="newProcessQuery.eventTime"></el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span='12'  v-if='newProcessQuery.type>4'>
                        <el-form-item label="公开名称" prop='title'>
                            <el-input v-model="newProcessQuery.title" auto-complete="off"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span='12' v-if='newProcessQuery.type<5'>
                        <el-form-item label="会议时间" prop="eventTime">
                            <el-date-picker type="date" placeholder="选择日期" v-model="newProcessQuery.eventTime"></el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span='12' v-if='newProcessQuery.type<5'>
                        <el-form-item label="会议名称" prop='title'>
                            <el-input v-model="newProcessQuery.title" auto-complete="off"></el-input>
                        </el-form-item>
                    </el-col>
                    <!-- <el-col :span='24' v-if='newProcessQuery.type>4'>
                        <el-form-item label="公开内容">
                             <v-editor name='edit' :inputContent="inputContent" v-model="newProcessQuery.content"></v-editor>
                        </el-form-item>
                    </el-col> -->
                    <el-col :span='24'>
                        <el-form-item label="讨论内容及结果摘要" prop='content'>
                             <v-editor name='edit1' :inputContent="inputContent" v-model="newProcessQuery.content"></v-editor>
                        </el-form-item>
                    </el-col>
                  
                    <el-col :span='24' v-if='newProcessQuery.type>4'>
                       <el-form-item label="公开图片">
                          <imgsUpload :imageUrl="newProcessQuery.imgsAccess" v-model='newProcessQuery.imgs' :dis='true'></imgsUpload>
                        </el-form-item>
                    </el-col>
                    <el-col :span='12'>
                        <el-form-item label="监督人员或机构">
                            <el-input v-model="newProcessQuery.superviseMaster" auto-complete="off"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span='12'>
                        <el-form-item label="监督时间">
                            <el-date-picker type="date" placeholder="选择日期" v-model="newProcessQuery.superviseTime"></el-date-picker>
                        </el-form-item>
                    </el-col>

                    <el-col :span='24'>
                        <el-form-item label="监督结果">
                            <el-input type="textarea" v-model="newProcessQuery.superviseResult" auto-complete="off"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span='24'>
                        <el-form-item label="监督备注" prop="remark">
                            <el-input type="textarea" v-model="newProcessQuery.remark" auto-complete="off"></el-input>
                        </el-form-item>
                    </el-col>
                    <!--<el-col :span='12'>-->
                    <!--<el-form-item label="任务状态" prop="checkStatus">-->
                    <!--&lt;!&ndash;<el-input v-model="newProcessQuery.checkStatus" auto-complete="off"></el-input>&ndash;&gt;-->
                    <!--<el-select v-model="newProcessQuery.checkStatus" clearable filterable placeholder="默认审核通过">-->
                    <!--<v-yvoption groupName="checkStatus"></v-yvoption>-->
                    <!--</el-select>-->
                    <!--</el-form-item>-->
                    <!--</el-col>-->
                    <!--<el-col :span='12'>-->
                    <!--<el-form-item label="创建时间" prop="createTime">-->
                    <!--<el-date-picker type="datetime" placeholder="选择日期" v-model="newQuerys.createTime" disabled></el-date-picker>-->
                    <!--</el-form-item>-->
                    <!--</el-col>-->
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">   
                <el-button @click="processVisible = false">取 消</el-button>
                <el-button type="primary" @click="handleProcessSure" :loading="loadingTwo">确 定</el-button>
            </div>
        </el-dialog>

        
        <!--点击详情的界面-->
        <el-dialog :title="dialogTitle" :visible.sync="isShowDetail" width="70%">
            <el-form label-width="120px" :model="newQuerys" ref="addQuery" :rules="rules">
                <el-row>
                    <el-col :span='12'>
                        <el-form-item label="事项名称" prop="title">
                            <el-input v-model="rows.title" auto-complete="off" :disabled="dis" ></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                  <el-col :span='12'>
                        <el-form-item label="事项类别" prop="type">
                            <el-select v-model="rows.type" clearable filterable placeholder="请选择事项类别" :disabled="dis">
                                <v-yvoption groupName="majorIssuesType"></v-yvoption>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span='12'>
                        <el-form-item label="提议时间" prop="startTime">
                          <el-date-picker type="date" placeholder="选择日期" v-model="rows.startTime" disabled></el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span='24'>
                        <el-form-item label="详细内容" >
                            <el-input type="textarea" :rows=6 v-model="rows.content" :disabled="dis" auto-complete="off"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span='24'>
                        <div style='text-align:right;margin-bottom:20px'>
                          <el-button v-if="dis" @click='update'>修改事项</el-button>
                          <el-button v-else @click='saves'>保 存</el-button>
                          <el-button type="primary"   v-show="this.newQuerys.currentProgressType != 6" @click="handleAddProcess">填写下一个流程</el-button>
                        </div>
                    </el-col>
                    <el-col :span="24">
                        <!-- <el-button type="primary" style="float: right" v-show="this.query.currentProgressType != 6" @click="handleAddProcess">填写下一个流程</el-button> -->
                        <!-- <el-button type="primary"  style="float: right;margin:10px 0;" v-show="this.newQuerys.currentProgressType != 6" @click="handleAddProcess">填写下一个流程</el-button> -->
                    </el-col>
                </el-row>
                <div v-for="(item,index) in process_list.list" :key='index'>
                    <pRocess :items="item" :index="index"  @isBack='isBack'></pRocess>
                </div>
            </el-form>
        </el-dialog>
    </div>

</template>

<script>
import {
//   delVillageAreaMajorIssues as del,
//   getVillageAreaMajorIssues as get,
//   postVillageAreaMajorIssues as post,
//   putVillageAreaMajorIssues as put,
//   delVillageAreaMajorIssueProgresses as processDel,
//   getVillageAreaMajorIssueProgresses as processGet,
//   postVillageAreaMajorIssueProgresses as processPost,
//   putVillageAreaMajorIssueProgresses as processPut,
//   getVillagePartyOrgMeetingsOne,
//   getAreaPublicServicesOne,
//   getVillageAreaPublicServices as getGK,
//   delVillageAreaMajorIssuesRegression as isBackDel
} from "../../../api/villageApi";

const code = "200";
import vYvoption from "../../../components/common/yvoption";
import vYvexcelimport from "../../../components/common/yvexcelimport.vue";
import pRocess from "../../../components/common/process";
import vEditor from '../../../components/common/Editor.vue';
import imgsUpload from '../../../components/common/imgsUpload';
export default {
    layout:'home',
  data() {
    return {
      query: {
        id: "",
        size: 10,
        page: 1,
        currentProgressType: '',
        title: "",
        year: new Date().getFullYear()
      },
      process_query: {
        majorIssueId: "",
        size: 10,
        page: 1
      },
      currentMajorIssueId: "",
      uploadUrl: "/areaMajorIssues",
      activeItem: "1",
      isAddShow: true, // 是否显示新增按钮
      isEdit: false, // 编辑或者详情
      isShowDel: true, // 是否显示删除按钮
      addQuery: {
        id: "",
        areaId: "",
        title: "",
        startTime: "",
        type:"",
        content: "",
        remark: "",
        currentProgressType: "",
        checkStatus: "",
        createTime: "",
        isDeleted: "",
        /*流程字段*/
        process_id: "",
        process_majorIssueId: "",
        process_type: "",
        process_title: "",
        process_eventTime: "",
        process_relevanceId: "",
        process_content: "",
        process_superviseTime: "",
        process_superviseMaster: "",
        process_superviseResult: "",
        process_remark: "",
        process_checkStatus: "",
        process_createTime: "",
        process_isDelete: "",
        relevanceId: ""
      },
      processAddQuery: {
        id: "",
        majorIssueId: "",
        type: "",
        title: "",
        eventTime: "",
        relevanceId: "",
        content: "",
        superviseTime: "",
        superviseMaster: "",
        superviseResult: "",
        remark: "",
        checkStatus: "",
        createTime: "",
        isDelete: "",
        relevanceId: "",
        imgs:'',
        imgsAccess:[],
        content:''
      },
      rules: {
        areaId: [{ required: true, message: "请选择地区", trigger: "blur" }],
        type: [{ required: true, message: "此项必填", trigger: "blur" }],
        relevanceId: [
          { required: true, message: "请选择会议", trigger: "change" }
        ],
        relevanceIdTwo: [
          { required: true, message: "请选择会议", trigger: "change" }
        ],
        title: [
          { required: true, message: "请输入标题", trigger: "blur" },
          { max: 255, message: "长度错误!", trigger: "blur" }
        ],
        content: [
          { required: true, message: "请输入事项介绍", trigger: "blur" },
          { max: 100, message: "最大长度为100!", trigger: "blur" },
          { min: 50, message: "最小长度为50!", trigger: "blur" }
        ],
        remark: [{ max: 255, message: "长度错误!", trigger: "blur" }],
        process_title: [
          { required: true, message: "请输入会议名称", trigger: "blur" },
          { max: 255, message: "长度错误!", trigger: "blur" }
        ],
        process_superviseMaster: [
          { required: true, message: "请输入监督人员或机构", trigger: "blur" },
          { max: 255, message: "长度错误!", trigger: "blur" }
        ],
        process_superviseResult: [
          { required: true, message: "请输入监督结果", trigger: "blur" },
          { max: 2147483647, message: "长度错误!", trigger: "blur" }
        ],
        process_content: [
          { required: true, message: "请输入监督内容", trigger: "blur" },
          { max: 2147483647, message: "长度错误!", trigger: "blur" }
        ],
        process_remark: [{ max: 255, message: "长度错误!", trigger: "blur" }]
      },
      processRules: {
        type: [{ required: true, message: "此项必填", trigger: "blur" }],
        title: [
          { required: true, message: "请输入会议名称", trigger: "blur" },
          { max: 255, message: "长度错误!", trigger: "blur" }
        ],
        superviseMaster: [
          { required: true, message: "请输入监督人员或机构", trigger: "blur" },
          { max: 255, message: "长度错误!", trigger: "blur" }
        ],
        superviseResult: [
          { required: true, message: "请输入监督结果", trigger: "blur" },
          { max: 2147483647, message: "长度错误!", trigger: "blur" }
        ],
        content: [
          { required: true, message: "请输入监督内容", trigger: "blur" },
          { max: 2147483647, message: "长度错误!", trigger: "blur" }
        ],
        remark: [{ max: 255, message: "长度错误!", trigger: "blur" }],
        process_title: [{ required: true, message: "长度错误!", trigger: "blur" }],
        eventTime: [{ required: true, message: "长度错误!", trigger: "change" }],
      },
      newQuerys: {},
      newProcessQuery: {
        content:''
      },
      sells: [],
      list: {},
      process_list: {},
      dialogVisible: false,
      newVisible: false,
      editVisible: false,
      processVisible: false,
      isShowDetail: false,
      currentPage1: 1,
      dialogTitle: "",
      processTitle: "",
      loadingOne: false,
      loadingTwo: false,
      rows:'',
      dis:true,
      inputContent:"",
    };
  },
  computed: {
    queryDataList() {
      let userStr = localStorage.getItem("user");
      if (!userStr) {
        return false;
      }
      let user = JSON.parse(userStr);
      if (this.newProcessQuery.type && this.newProcessQuery.type == 3) {
        return "{party_org_id:" + user.orgId + ",is_deleted:0,type:1}";
      } else {
        return "{party_org_id:" + user.orgId + ",is_deleted:0,type:2}";
      }
    },
    queryDataListTwo() {
      let userStr = localStorage.getItem("user");
      if (!userStr) {
        return false;
      }
      let user = JSON.parse(userStr);
      return "{area_id:" + user.partyOrg.areaId + ",is_deleted:0}";
    }
  },
  components: {
    vYvoption,
    vYvexcelimport,
    pRocess,
    vEditor,
    imgsUpload
  },
  methods: {
    isBack() {
      isBackDel({ids:this.rows.id})
      .then((res) => {
        if (res.data.code == code) {
             this.$message({
              type: "success",
              message: res.data.message
            });
            this.isShowDetail = false;
            this.getSearchList()
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
    changeMeetingIsGk(id) {
       if (id == "") {
        return false;
      }
      getGK({ id: id })
        .then(res => {
          if (res.data.code == code) {
            let data = res.data.data.list[0]
            this.newProcessQuery.title = data.title;
            this.newProcessQuery.eventTime = data.eventTime;
            this.newProcessQuery.content = data.content;
            this.newProcessQuery.accessPicUrl = data.picUrlAccess
            this.newProcessQuery.imgsAccess=[]
            this.newProcessQuery.imgsAccess.push(data.picUrlAccess)
            this.newProcessQuery.imgs = data.picUrl
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
    update() {
      this.dis = !this.dis;
    },
    saves() {
      
      put(this.rows)
      .then((res) => {
       if (res.data.code == code) {
             this.$message({
              type: "success",
              message: res.data.message
            });
            this.dis = !this.dis;
            this.getSearchList()
          } else {
            this.$message({
              type: "error",
              message: res.data.message
            });
          }
        })
        .catch(() => {
          this.loadingOne = false;
          this.$message({
            type: "error",
            message: "查询失败,请重试或者联系管理员！！"
          });
        });
    },


    changeMeeting(id) {
      getVillagePartyOrgMeetingsOne({ id: id })
        .then(res => {
          if (res.data.code == code) {
            this.newQuerys.process_title = res.data.data.name;
            this.newQuerys.process_eventTime = res.data.data.eventTime;
            this.newQuerys.process_content = res.data.data.content;
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
    changeMeetingTwo(id) {
      if (id == "") {
        return false;
      }
      getVillagePartyOrgMeetingsOne({ id: id })
        .then(res => {
          if (res.data.code == code) {
            this.newProcessQuery.title = res.data.data.name;
            this.newProcessQuery.eventTime = res.data.data.eventTime;
            this.newProcessQuery.content = res.data.data.content;
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
    changeMeetingThree(id) {
      if (id == "") {
        return false;
      }
      getAreaPublicServicesOne({ id: id })
        .then(res => {
          if (res.data.code == code) {
            if (res.data.data) {
              this.newProcessQuery.title = res.data.data.title;
              this.newProcessQuery.eventTime = res.data.data.eventTime;
              this.newProcessQuery.content = res.data.data.content;
            }
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
    tabHandleClick(tab) {
      if (tab.name === "1") {
        this.isAddShow = true;
        this.isShowDel = true;
      } else {
        this.isShowDel = false;
        this.isAddShow = false;
      }
      // this.query.currentProgressType = tab.name;
      this.query.currentProgressType = '';
      this.getSearchList();
    },
    getSearchList() {
      // this.query.currentProgressType = 1;
      this.loadingOne = true;
      get(this.query)
        .then(res => {
          this.loadingOne = false;
          if (res.data.code == code) {
            this.list = res.data.data;
          } else {
            this.$message({
              type: "error",
              message: res.data.message
            });
          }
        })
        .catch(() => {
          this.loadingOne = false;
          this.$message({
            type: "error",
            message: "查询失败,请重试或者联系管理员！！"
          });
        });
    },
    getProcessSearchList() {
      processGet(this.process_query)
        .then(res => {
          this.loadingTwo = false;
          if (res.data.code == code) {
            this.process_list = res.data.data;
          } else {
            this.loadingTwo = false;
            this.$message({
              message: res.data.message,
              type: "warning"
            });
          }
        })
        .catch(() => {
          this.loadingTwo = false;
          this.$message({
            type: "error",
            message: "查询失败,请重试或者联系管理员！！"
          });
        });
    },
    addModel() {
      this.dialogVisible = true;
      this.$nextTick(function() {
        this.addQuery.process_type = 1;
        this.$refs['addQuery'].resetFields();
        this.newQuerys = Object.assign({}, this.addQuery);
        this.inputContent = ''
        this.dialogTitle = "新增";
      });
    },
    handleSelectionChange(val) {
      this.sells = val;
    },
    handleEdit(index, row) {
      this.currentMajorIssueId = row.id;
      this.process_query.majorIssueId = row.id;
      this.loadingTwo = true;
      processGet(this.process_query)
        .then(res => {
          this.loadingTwo = false;
          if (res.data.code == code) {
            this.process_list = res.data.data;
            let length = this.process_list.list.length;
            let obj = this.process_list.list[length - 1];
            this.processVisible = true;
            this.newProcessQuery = obj;
            this.$nextTick(function() {
              let aaa = obj.content.replace("<br>","</br>")
              this.newProcessQuery.content = aaa;
              this.inputContent = aaa;
              this.newProcessQuery.accessPicUrl = this.newProcessQuery.imgsAccess
              this.newProcessQuery.imgs = this.newProcessQuery.imgs;
              this.dialogTitle = "编辑";
            });
          } else {
            this.loadingTwo = false;
            this.$message({
              message: res.data.message,
              type: "warning"
            });
          }
        })
        .catch(() => {
          this.loadingTwo = false;
          this.$message({
            type: "error",
            message: "查询失败,请重试或者联系管理员！！"
          });
        });
    },
    handleDetail(index, row) {
      this.rows = row;
      //记录当前事项的id
      this.currentMajorIssueId = row.id;
      this.process_query.majorIssueId = row.id;
      this.loadingTwo = true;
      processGet(this.process_query)
        .then(res => {
          this.loadingTwo = false;
          if (res.data.code == code) {
            this.process_list = res.data.data;
            this.isShowDetail = true;
            if(this.process_list.list.length && this.process_list.list.length>1){
                this.process_list.list[this.process_list.list.length-1].isLast = 1;
            }
            // this.dialogVisible = true;
            // this.newVisible = false;
            // this.editVisible = true;
            this.$nextTick(function() {
              this.newQuerys = Object.assign({}, row);
              this.dialogTitle = "详情";
            });
          } else {
            this.loadingTwo = false;
            this.$message({
              message: res.data.message,
              type: "warning"
            });
          }
        })
        .catch(() => {
          this.loadingTwo = false;
          this.$message({
            type: "error",
            message: "查询失败,请重试或者联系管理员！！"
          });
        });
    },
    handleAddProcess() {
      this.processVisible = true;
      this.isShowDetail = false;
      this.$nextTick(function() {
        // this.processAddQuery.type =  parseInt(this.query.currentProgressType) + 1;
        this.processAddQuery.type =  this.newQuerys.currentProgressType +1;
        this.newProcessQuery = Object.assign({}, this.processAddQuery);
        this.newProcessQuery.majorIssueId = this.currentMajorIssueId;
        this.inputContent = ''
        this.processTitle = "新增";
      });
    },
    handleProcessEdit(index, row) {
      this.processVisible = true;
      this.$nextTick(function() {
        this.newProcessQuery = Object.assign({}, row);
        this.newProcessQuery.majorIssueId = this.currentMajorIssueId;
        this.processTitle = "编辑";
      });
    },
    handleCreate() {
      // 校验条件的处理
      if (this.newQuerys.id == 0) {
        this.handleValid(false);
      } else {
        this.handleValid(true);
      }
      this.$refs["addQuery"].validate(valid => {
        if (valid) {
          this.loadingTwo = true;
          if (this.newQuerys.id == 0) {
            this.newQuerys.currentProgressType = 1;
            post(this.newQuerys)
              .then(res => {
                this.loadingTwo = false;
                if (res.data.code == code) {
                  this.handleProcessCreate(res.data.data.id);
                } else {
                  this.$message({
                    message: res.data.message,
                    type: "warning"
                  });
                }
              })
              .catch(() => {
                this.loadingTwo = false;
                this.$message({
                  type: "error",
                  message: "新增失败,请重试或者联系管理员！！"
                });
              });
          } else {
            put(this.newQuerys)
              .then(res => {
                this.loadingTwo = false;
                if (res.data.code == code) {
                  this.$message({
                    message: "编辑成功",
                    type: "success"
                  });
                  this.dialogVisible = false;
                  this.getSearchList();
                } else {
                  this.$message({
                    message: res.data.message,
                    type: "warning"
                  });
                }
              })
              .catch(() => {
                this.loadingTwo = false;
                this.$message({
                  type: "error",
                  message: "编辑失败,请重试或者联系管理员！！"
                });
              });
          }
        }
      });
    },
    handleProcessSure() {
      this.$refs["processAddQuery"].validate(valid => {
        if (valid) {
          this.loadingTwo = true;
          if (this.newProcessQuery.id == 0) {
            processPost(this.newProcessQuery)
              .then(res => {
                this.loadingTwo = false;
                if (res.data.code == code) {
                  this.$message({
                    message: "新增成功",
                    type: "success"
                  });
                  this.processVisible = false;
                  // 更改事项进程
                  this.newQuerys.currentProgressType += 1;
                  put(this.newQuerys)
                    .then(res => {
                      if (res.data.code == code) {
                        this.getSearchList();
                      } else {
                        this.$message({
                          message: res.data.message,
                          type: "warning"
                        });
                      }
                    })
                    .catch(() => {});
                } else {
                  this.$message({
                    message: res.data.message,
                    type: "warning"
                  });
                }
              })
              .catch(() => {
                this.loadingTwo = false;
                this.$message({
                  type: "error",
                  message: "新增失败,请重试或者联系管理员！！"
                });
              });
          } else {
            processPut(this.newProcessQuery)
              .then(res => {
                this.loadingTwo = false;
                if (res.data.code == code) {
                  this.$message({
                    message: "编辑成功",
                    type: "success"
                  });
                  this.processVisible = false;
                  processGet(this.process_query)
                    .then(res => {
                      // this.loadingTwo = false;
                      if (res.data.code == code) {
                        this.process_list = res.data.data;
                      } else {
                        this.loadingTwo = false;
                        this.$message({
                          message: res.data.message,
                          type: "warning"
                        });
                      }
                    })
                    .catch(() => {
                      this.loadingTwo = false;
                      this.$message({
                        type: "error",
                        message: "查询失败,请重试或者联系管理员！！"
                      });
                    });
                } else {
                  this.$message({
                    message: res.data.message,
                    type: "warning"
                  });
                }
              })
              .catch(() => {
                this.loadingTwo = false;
                this.$message({
                  type: "error",
                  message: "编辑失败,请重试或者联系管理员！！"
                });
              });
          }
        }
      });
    },
    handleDelete(index, row) {
      this.$confirm("此操作将永久删除该数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          del({ ids: row.id })
            .then(res => {
              if (res.data.code == code) {
                this.getSearchList();
                this.$message({
                  type: "success",
                  message: "删除成功!"
                });
              } else {
                this.$message({
                  message: res.data.message,
                  type: "warning"
                });
              }
            })
            .catch(() => {
              this.$message({
                message: "请求失败,请重试或者联系管理员！！",
                type: "warning"
              });
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    handleProcessDelete(index, row) {
      this.$confirm("此操作将永久删除该数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          processDel({ ids: row.id })
            .then(res => {
              if (res.data.code == code) {
                this.getProcessSearchList();
                // 更改事项进程
                this.newQuerys.currentProgressType -= 1;
                put(this.newQuerys)
                  .then(res => {
                    if (res.data.code == code) {
                      this.getSearchList();
                      this.$message({
                        type: "success",
                        message: "删除成功!"
                      });
                    } else {
                      this.$message({
                        message: res.data.message,
                        type: "warning"
                      });
                    }
                  })
                  .catch(() => {});
              } else {
                this.$message({
                  message: res.data.message,
                  type: "warning"
                });
              }
            })
            .catch(() => {
              this.$message({
                message: "请求失败,请重试或者联系管理员！！",
                type: "warning"
              });
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    removeAll() {
      let ids = this.sells.map(item => item.id).toString();
      if (ids == "") {
        this.$message({
          message: "请选择数据！！",
          type: "warning"
        });
        return false;
      }
      this.$confirm("此操作将永久删除该数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          del({ ids: ids })
            .then(res => {
              if (res.data.code == code) {
                this.getSearchList();
                this.$message({
                  type: "success",
                  message: "删除成功!"
                });
              } else {
                this.$message({
                  message: res.data.message,
                  type: "warning"
                });
              }
            })
            .catch(() => {
              this.$message({
                message: "请求失败,请重试或者联系管理员！！",
                type: "warning"
              });
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    handleSizeChange(val) {
      this.query.size = val;
      this.getSearchList();
    },
    handleCurrentChange(val) {
      this.query.page = val;
      this.getSearchList();
    },
    HandleSuccessLeadIn() {},
    handleValid(status) {
      if (status == true) {
        delete this.rules.process_title;
        delete this.rules.process_superviseMaster;
        delete this.rules.process_superviseResult;
        delete this.rules.process_content;
      } else {
        this.rules["process_title"] = [
          { required: true, message: "请输入会议名称", trigger: "blur" },
          { max: 255, message: "长度错误!", trigger: "blur" }
        ];
        this.rules["process_superviseMaster"] = [
          { required: true, message: "请输入监督人员或机构", trigger: "blur" },
          { max: 255, message: "长度错误!", trigger: "blur" }
        ];
        this.rules["process_superviseResult"] = [
          { required: true, message: "请输入监督结果", trigger: "blur" },
          { max: 2147483647, message: "长度错误!", trigger: "blur" }
        ];
        this.rules["process_content"] = [
          { required: true, message: "请输入监督内容", trigger: "blur" },
          { max: 2147483647, message: "长度错误!", trigger: "blur" }
        ];
      }
    },
    handleProcessCreate(issueId) {
      let processQuery = {
        id: this.newQuerys.process_id,
        majorIssueId: issueId,
        type: 1,
        title: this.newQuerys.process_title,
        eventTime: this.newQuerys.process_eventTime,
        relevanceId: this.newQuerys.relevanceId,
        content: this.newQuerys.process_content,
        superviseTime: this.newQuerys.process_superviseTime,
        superviseMaster: this.newQuerys.process_superviseMaster,
        superviseResult: this.newQuerys.process_superviseResult,
        remark: this.newQuerys.process_remark,
        checkStatus: this.newQuerys.process_checkStatus,
        createTime: this.newQuerys.process_createTime,
        isDelete: this.newQuerys.process_isDelete
      };
      processPost(processQuery)
        .then(res => {
          if (res.data.code == code) {
            this.$message({
              message: "新增成功",
              type: "success"
            });
            this.dialogVisible = false;
            this.getSearchList();
          } else {
            this.$message({
              message: res.data.message,
              type: "warning"
            });
          }
        })
        .catch(() => {
          this.$message({
            message: "请求失败,请重试或者联系管理员！！",
            type: "warning"
          });
        });
    }
  },
  mounted() {
    // this.getSearchList();
  }
};
</script>

<style scoped>
.el-pagination {
  float: right;
}
.block {
  padding: 10px 0;
}
</style>
