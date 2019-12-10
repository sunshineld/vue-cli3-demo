<route-meta>
{
  "requiresAuth": true,
  "name":"我的任务箱",
  "parent":"任务管理"
}
</route-meta>
<template>
    <div class="log">
        <div class="search">
            <div style="margin-bottom: 40px;">
                <el-radio-group v-model="category" @change="getSearch">
                    <el-radio-button :label="1">未接收任务</el-radio-button>
                    <el-radio-button :label="2">未完结任务</el-radio-button>
                    <el-radio-button :label="3">已完成任务</el-radio-button>
                </el-radio-group>
                <!-- <el-button type="primary" style="margin-left: 30px;" @click="addTask">发布自主任务</el-button> -->
            </div>
            <el-form class="form" :inline="true" :model="query" ref="search">
                <el-form-item label="发布类型">
                    <el-select v-model="query.sendType" clearable filterable placeholder="请选择发布类型">
                        <!-- <v-yvoption groupName="taskSendType"></v-yvoption> -->
                    </el-select>
                </el-form-item>
                <!-- <el-form-item label="发布单位">
                    <el-input v-model="query.unit" clearable></el-input>
                </el-form-item> -->
                <el-form-item label="任务名称">
                    <el-input v-model="query.title" clearable></el-input>
                </el-form-item>
                <el-form-item label="任务类型">
                    <el-select v-model="query.taskType" clearable filterable placeholder="请选择任务类型">
                        <!-- <v-yvoption groupName="taskType"></v-yvoption> -->
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <div class="btnSearch">
                        <el-button type="primary" v-loading="loadingOne" @click="getSearch">查询</el-button>
                    </div>
                </el-form-item>
            </el-form>
        </div>
        <div class="table-wrapper" style="margin-top: 20px;">
            <el-table  ref="multipleTable" :data="list.list"  tooltip-effect="dark"  @selection-change="handleSelectionChange" v-loading="loadingOne">
                <!-- <el-table-column type="selection"  width="70" ></el-table-column> -->
				<el-table-column label="紧急程度" min-width="120" align="center" v-if="category != 3">
                    <template slot-scope="scope">
                        <el-button type="danger" size="small" circle v-if='scope.row.cautionType == 1' style='cursor:text;'></el-button>
                        <el-button type="warning" size="small" circle v-if='scope.row.cautionType == 2' style='cursor:text;'></el-button>
                        <el-button size="small" style='background:#f4e136;border-color:#f4e136;cursor:text;' circle v-if='scope.row.cautionType == 3'></el-button>
                        <el-button type="success" size="small" circle v-if='scope.row.cautionType == 4' style='cursor:text;'></el-button>
                    </template>
                </el-table-column>
                <el-table-column label="超期情况" min-width="120" align="center" v-else>
                    <template slot-scope="scope">
                        <el-button type="danger" size="small" circle v-if='scope.row.cautionType == 1' style='cursor:text;'></el-button>
                        <el-button type="warning" size="small" circle v-if='scope.row.cautionType == 2' style='cursor:text;'></el-button>
                        <el-button size="small" style='background:#f4e136;border-color:#f4e136;cursor:text;' circle v-if='scope.row.cautionType == 3'></el-button>
                        <el-button type="success" size="small" circle v-if='scope.row.cautionType == 4' style='cursor:text;'></el-button>
                    </template>
                </el-table-column>
				<el-table-column prop="sendTypeZh" label="发布类型" show-overflow-tooltip min-width="160"></el-table-column>
				<el-table-column prop="title" label="任务名称" show-overflow-tooltip min-width="160"></el-table-column>
                <el-table-column prop="masterOrgName" label="发布单位" show-overflow-tooltip min-width="160"></el-table-column>
                <el-table-column prop="createTime" label="发布时间" min-width="160">
					<template slot-scope="scope">
                    	<span style="">{{ scope.row.createTime|date }}</span>
                	</template>
				</el-table-column>
                <el-table-column prop="needReceiptTypeZh" label="回执要求" show-overflow-tooltip min-width="160"></el-table-column>
				<el-table-column prop="endTime" label="截止时间" min-width="160">
					<template slot-scope="scope">
                    	<span style="">{{ scope.row.endTime|date }}</span>
                	</template>
				</el-table-column>
                <el-table-column prop="taskTypeZh" label="任务类型" show-overflow-tooltip min-width="160"></el-table-column>
				<el-table-column prop="checkStatusZh" label="任务状态" show-overflow-tooltip min-width="160" v-if='category != 1'>
                    <template slot-scope="scope">
                        <el-tag>{{ scope.row.checkStatusZh }}</el-tag>
                    </template>
                </el-table-column>
				<el-table-column prop="submitTime" label="完成时间" min-width="160"  v-if='category == 3'>
					<template slot-scope="scope">
                    	<span style="">{{ scope.row.submitTime|date }}</span>
                	</template>
				</el-table-column>
                <el-table-column  label="操作" min-width="225px" fixed="right">
                    <template slot-scope="scope">
                        <el-button type="primary" size="mini" @click="handleFinish(scope.$index, scope.row)" v-if="category == 1">去接收</el-button>
                        <el-button type="primary" size="mini" @click="handleFinish(scope.$index, scope.row)" v-if="category == 2 && (scope.row.checkStatus == 1 || scope.row.checkStatus == 3)">去完成</el-button>
                        <el-button type="primary" size="mini" @click="handleFinish(scope.$index, scope.row)" v-if="category == 3 || scope.row.checkStatus == 4 ">查看</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <!--批量删除-->
        <div class="block">
            <!-- <el-button type="danger" @click="removeAll">批量删除</el-button> -->
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page.sync="currentPage1"
                :page-size=query.size
                :page-sizes="[10, 20, 30, 50]"
                layout="total, sizes, prev,  pager, next"
                :total=list.total>
            </el-pagination>
        </div>


        <!--新增模态框-->
        <el-dialog :title="dialogTitle"  :visible.sync="dialogVisible">
            <el-form  label-width="110px" :model="newQuerys" ref="addQuery" :rules="rules">
                <el-row>
					    <!-- <el-col :span='12'>
	                        <el-form-item label="ID" prop="id">
	                            <el-input v-model="newQuerys.id" auto-complete="off"></el-input>
	                        </el-form-item>
	                    </el-col> -->
                        <el-col :span='24'>
	                        <el-form-item label="发布类型：" prop="sendType">
                                <p>{{sendType}}</p>
	                        </el-form-item>
	                    </el-col>
					    <el-col :span='12'>
	                        <el-form-item label="任务发布单位：" prop="sendUnit">
	                            <!-- <el-input v-model="newQuerys.sendType" auto-complete="off"></el-input> -->
                                <p>{{sendUnit}}</p>
	                        </el-form-item>
	                    </el-col>
                        <el-col :span='12'>
	                        <el-form-item label="任务类型：" prop="taskType">
                                <el-radio-group v-model="newQuerys.taskType">
                                    <el-radio :label="2">普通类</el-radio>
                                    <el-radio :label="1" disabled>功能类</el-radio>
                                </el-radio-group>
	                        </el-form-item>
	                    </el-col>
                        <el-col :span='12'>
	                        <el-form-item label="任务名称：" prop="title">
	                            <el-input v-model="newQuerys.title" auto-complete="off" maxlength='100'></el-input>
	                        </el-form-item>
	                    </el-col>
                        <el-col :span='12'>
	                        <el-form-item label="回执需求：" prop="needReceiptType">
                                <el-radio-group v-model="newQuerys.needReceiptType">
                                    <el-radio :label="0">无需回执</el-radio>
                                    <el-radio :label="1">需要回执</el-radio>
                                </el-radio-group>
	                        </el-form-item>
	                    </el-col>
                        <el-col :span='12'>
	                        <el-form-item label="任务截止时间：" prop="endTime">
	                        	<el-date-picker type="date" placeholder="选择日期" v-model="newQuerys.endTime" :picker-options='pickerOptions'></el-date-picker>
	                        </el-form-item>
	                    </el-col>
                        <el-col :span='12'>
	                        <el-form-item label="重要程度：" prop="importantType">
                                <el-radio-group v-model="newQuerys.importantType">
                                    <el-radio :label="1">普通</el-radio>
                                    <el-radio :label="2">重要</el-radio>
                                    <el-radio :label="3">非常重要</el-radio>
                                </el-radio-group>
	                        </el-form-item>
	                    </el-col>
                        <el-col :span='24'>
	                        <el-form-item label="任务要求：" prop="content">
                                <el-input type="textarea" v-model="newQuerys.content" style='width: 80%;' :rows="4" maxlength="800"></el-input>
	                        </el-form-item>
	                    </el-col>
					    <el-col :span='24'>
	                        <el-form-item label="任务文档：" prop="documents">
                                <file-upload @input="upfileList" :fileList='newQuerys.documents'></file-upload>
	                        </el-form-item>
	                    </el-col>
					    <el-col :span='24'>
	                        <el-form-item label="接收单位：">
	                            <p>{{sendUnit}}</p>
	                        </el-form-item>
	                    </el-col>
                </el-row>
            </el-form>

            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible=false">取 消</el-button>
                <el-button type="primary" @click="handleCreate" :loading="loadingTwo">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 详情模态框 -->
        <el-dialog :title="detailTitle"  :visible.sync="detailsDialogVisible" :close-on-click-modal='false'>
            <el-form  label-width="150px" :model="detailsQuerys" :rules="detailsRules" ref="detailsQuery">
                <el-row>
					    <el-col :span='12'>
                            <div>
                                <el-button type="danger" size="small" circle v-if='detailsQuerys.cautionType == 1' class="circle"></el-button>
                                <el-button type="warning" size="small" circle v-if='detailsQuerys.cautionType == 2' class="circle"></el-button>
                                <el-button size="small" class="circle" style='background:#f4e136;border-color:#f4e136;' circle v-if='detailsQuerys.cautionType == 3'></el-button>
                                <el-button type="success" size="small" circle v-if='detailsQuerys.cautionType == 4' class="circle"></el-button>
                                <el-form-item label="任务编号：" prop="id">
                                    <p>{{detailsQuerys.id}}</p>
                                </el-form-item>
                            </div>
	                    </el-col>
                        <el-col :span='12'>
	                        <el-form-item label="发布类型：" prop="sendType">
                                <p>{{detailsQuerys.sendTypeZh}}</p>
	                        </el-form-item>
	                    </el-col>
					    <el-col :span='12'>
	                        <el-form-item label="任务发布单位：" prop="sendOrgName">
                                <p>{{detailsQuerys.sendOrgName}}</p>
	                        </el-form-item>
	                    </el-col>
                        <el-col :span='12'>
	                        <el-form-item label="任务类型：" prop="taskType">
                                <p>{{detailsQuerys.taskTypeZh}}</p>
	                        </el-form-item>
	                    </el-col>
                        <el-col :span='12'>
	                        <el-form-item label="任务名称：" prop="title">
                                <p class="p_style">{{detailsQuerys.title}}</p>
	                        </el-form-item>
	                    </el-col>
                        <el-col :span='12'>
	                        <el-form-item label="回执需求：" prop="needReceiptType">
                                <p>{{detailsQuerys.needReceiptTypeZh}}</p>
	                        </el-form-item>
	                    </el-col>
                        <el-col :span='12'>
	                        <el-form-item label="任务截止时间：" prop="endTime">
                                <p>{{detailsQuerys.endTime|date}}</p>
	                        </el-form-item>
	                    </el-col>
                        <el-col :span='12'>
	                        <el-form-item label="重要程度：" prop="importantType">
                                <p>{{detailsQuerys.importantTypeZh}}</p>
	                        </el-form-item>
	                    </el-col>
                        <el-col :span='24'>
	                        <el-form-item label="任务要求：" prop="content">
                                <p v-if='!detailsQuerys.content'>无</p>
                                <el-input v-else type='textarea' :value='detailsQuerys.content' rows="5" :readonly="true"  style='width:80%;'></el-input>
	                        </el-form-item>
	                    </el-col>
					    <el-col :span='24'>
	                        <el-form-item label="任务文档：" prop="documents">
                                <p v-if='!detailsQuerys.taskDocuments'>无</p>
                                <div v-else>
                                    <div v-for="(item,index) in detailsQuerys.taskDocumentsAccess" :key="index">
                                        <a :href='item' target="_blank" class="a_style">{{item.split('_')[1]}}</a>
                                    </div>
                                </div>
	                        </el-form-item>
	                    </el-col>
                        <el-col :span='12'>
	                        <el-form-item label="任务状态：">
	                            <p :style='detailsQuerys.checkStatus == 1 ? "color:red;" : ""'>{{detailsQuerys.checkStatusZh}}</p>
	                        </el-form-item>
	                    </el-col>
                        <el-col :span='12'>
	                        <el-form-item label="接收单位：">
	                            <p>{{detailsQuerys.receiveOrgName}}</p>
	                        </el-form-item>
	                    </el-col>
                        <el-col :span='12' v-if="detailsQuerys.checkStatus == 1 || detailsQuerys.checkStatus == 5">
	                        <el-form-item label="审核结论：">
	                            <p :style='detailsQuerys.checkStatus == 1 ? "color:red;" : ""'>{{detailsQuerys.statusInfo ? detailsQuerys.statusInfo : '无'}}</p>
	                        </el-form-item>
	                    </el-col>
                        <el-col :span='12' v-if="detailsQuerys.checkStatus == 1 || detailsQuerys.checkStatus == 5">
	                        <el-form-item label="审核人：">
	                            <p>{{detailsQuerys.masterOrgName}}</p>
	                        </el-form-item>
	                    </el-col>
                        <el-col :span='24' v-if='detailsQuerys.needReceiptType != 0 && nowFinish'>
	                        <el-form-item label="完成说明：" :prop="category == 3 || detailsQuerys.checkStatus == 4 ? '' : 'info'">
	                            <el-input type="textarea" v-model="detailsQuerys.info" style='width: 80%;' :rows="4" v-if='category != 3 && detailsQuerys.checkStatus != 4'></el-input>
                                <el-input v-if='category == 3 || detailsQuerys.checkStatus == 4' type='textarea' :value='detailsQuerys.info' rows="5" :readonly="true" style='width:80%;'></el-input>
	                        </el-form-item>
	                    </el-col>
                        <el-col :span='24' v-if='detailsQuerys.needReceiptType != 0 && nowFinish'>
	                        <el-form-item label="文件上传：">
	                            <file-upload v-model="detailsQuerys.documents" @disableBtn='disableBtn' v-if='category != 3 && detailsQuerys.checkStatus != 4' :fileList='detailsQuerys.documentsAccess'></file-upload>
                                <div v-if='category == 3 || detailsQuerys.checkStatus == 4'>
                                    <p v-if='!detailsQuerys.documents'>无</p>
                                    <div v-for='(item,index) in detailsQuerys.documentsAccess' :key="index">
                                        <a :href="item" target="_blank" class="a_style">{{item.split('_')[1]}}</a>
                                    </div>
                                </div>
	                        </el-form-item>
	                    </el-col>
					    <el-col :span='24' v-if='detailsQuerys.needReceiptType != 0 && nowFinish'>
	                        <el-form-item label="图片上传：">
	                            <imgsUpload v-model='detailsQuerys.images'   :imageUrl='detailsQuerys.imagesAccess' :dis='detailsQuerys.checkStatus == 4 || category == 3 ? true : false'></imgsUpload>
	                        </el-form-item>
	                    </el-col>
                </el-row>
            </el-form>

            <div slot="footer" class="dialog-footer" v-if="category != 1 || nowFinish">
                <el-button @click="handleCancel" :disabled="isDisableBtn">取 消</el-button>
                <el-button type="primary" @click="handleSubmit" :disabled="isDisableBtn" :loading="loadingTwo" v-if='category != 3 && detailsQuerys.checkStatus != 4'>提 交</el-button>
            </div>
            <div slot="footer" class="dialog-footer-middle" v-if="category == 1 && !nowFinish">
                <el-button @click="schedule" v-if="detailsQuerys.needReceiptType != 0" type="primary">安排日程</el-button>
                <el-button @click="handleSubmit" v-if="detailsQuerys.needReceiptType == 0" type="primary">确认接收</el-button>
                <el-button @click="handleFinishNow" v-if="detailsQuerys.needReceiptType != 0" type="primary">马上完成</el-button>
                <el-button @click="detailsDialogVisible = false">暂不接收</el-button>
                <!-- <el-button type="primary" @click="handleSubmit" :loading="loadingTwo" v-if='category != 3'>提 交</el-button> -->
            </div>
        </el-dialog>
        <!-- 安排日程模态框 -->
        <el-dialog title="安排日程" :visible.sync="dialogVisibleSchedule">
            <el-form>
                <el-row>
                    <el-col :span='8'>
                        <el-form-item label="安排日程">
                            <el-date-picker type="date" placeholder="选择日期" v-model="schedQuery.alarmTime"></el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span='12'>
                        <el-button type="danger" @click="dialogVisibleSchedule = false">取消</el-button>
                        <el-button type="primary" @click='scheduleSave'>确定</el-button>
                    </el-col>
                </el-row>
            </el-form>
        </el-dialog>
    </div>

</template>

<script>
    import {
        // delSystemTaskRecords as del,
        getSystemTaskRecords as get,
        // postSystemTaskRecords as post,
        // putSystemTaskRecords as put,
        // putSystemTaskRecordsSchedule as putS,
    } from '../../../api/villageApi';

    const code = "200";
    import vYvoption from '../../../components/common/yvoption.vue';
    import fileUpload from '../../../components/common/uploadsFile.vue';
    import imgsUpload from '../../../components/common/imgsUpload.vue';
    import {checkEmporty} from '../../../utils/validator';
    export default {
        layout:'home',
        data() {
            return {
                category:1,
                emportyArr:[],
                query:{
                    size:10,
                    page:1,
                    sendType:'',
                    unit:'',
                    title:'',
                    taskType:'',
                    checkStatusList:''
                },
                sendUnit:'',
                sendType:'自主发布',
                addQuery:{
                	id:'',
                	taskType:2,
                	title:'',
                	startTime:'',
                	endTime:'',
                	content:'',
                	isAlarm:'',
                	alarmTime:'',
                	needReceiptType:0,
                	importantType:1,
                    taskDocumentList:''
                },
                rules:{
                	title:[{validator: checkEmporty,required: true, max: 100, trigger: 'blur' }],
                	content:[{validator: checkEmporty,required: true, max: 800, trigger: 'blur' }],
                	// endTime:[{required: true, max: 2147483647, message: '长度错误!', trigger: 'blur' }],	
                },
                detailsRules: {
                    info: [{required: true, max: 800, message: '请填写完成说明!', trigger: 'blur' }]
                },
                newQuerys:{},
                detailsQuerys:{},
                sells:[],
                list:{},
                dialogVisible:false,
                detailsDialogVisible: false,
                dialogVisibleSchedule: false,
                isDisableBtn: false,
                currentPage1:1,
                dialogTitle:'',
                detailTitle:'',
                loadingOne:false,
                loadingTwo:false,
                user: JSON.parse(localStorage.getItem('user')),
                feedbackFiles:'',
                feedbackImages:'',
                nowFinish: false,
                pickerOptions: {
                    disabledDate(time) {
                        return time.getTime() < Date.now() - 8.64e7
                    }
                },
                schedQuery: {
                    alarmTime: "",
                    id: "",
                    isAlarm: 1
                },
            }
        },
        methods:{
            getSearch() {
                this.query.page = 1;
                this.currentPage1 = 1;
                this.getSearchList();
            },
            getSearchList(){
                this.loadingOne = true;
                if(this.category == 1) {
                    this.query.checkStatusList = '2';
                    this.nowFinish = false;
                } else if(this.category == 2) {
                    this.query.checkStatusList = '1,3,4';
                    this.nowFinish = true;
                } else {
                    this.query.checkStatusList = '5,6';
                    this.nowFinish = true;
                }
                get(this.query).then((res) => {
                	this.loadingOne = false;
                    if(res.data.code == code){
                        this.list = res.data.data;
                    }else{
                        this.$message({
                            type: 'error',
                            message:res.data.message
                        });
                    }
                }).catch(() =>{
                	this.loadingOne = false;
                    this.$message({
                        type: 'error',
                        message:"查询失败,请重试或者联系管理员！！"
                    });
                })
            },
            addTask(){
                this.dialogVisible = true;
                this.sendUnit = this.user.orgName;
                this.$nextTick(function() {
                	this.$refs['addQuery'].resetFields();
                    this.newQuerys = Object.assign({}, this.addQuery);
                    this.dialogTitle = "发布自主任务";
                    this.newQuerys.documents = [];
                })
            },
            handleSelectionChange(val) {
                this.sells = val;
            },
            handleFinishNow() {//马上完成
                this.nowFinish = true;
            },
            schedule() {
                this.dialogVisibleSchedule = true;
                this.schedQuery = {
                    alarmTime: "",
                    id: "",
                    isAlarm: 1
                }
            },
            scheduleSave() {//安排日程
                this.schedQuery.id = this.detailsQuerys.id;
                if (this.schedQuery.alarmTime == "") {
                    this.$message({
                        type: "error",
                        message: "请安排日程"
                    });
                    return;
                }
                putS(this.schedQuery).then(res => {
                     if (res.data.code == code) {
                        this.dialogVisibleSchedule = false;
                        this.detailsDialogVisible = false;
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
                }).catch(err => {
                    this.$message({
                        type: "error",
                        message: "查询失败,请重试或者联系管理员！！"
                    });
                })
            },
            handleFinish(index,row) {//去完成
                this.detailsDialogVisible = true;
                console.log(row)
                this.$nextTick(function() {
                    this.detailTitle = '详情';
                    this.sendUnit = this.user.orgName;
                    this.detailsQuerys = JSON.parse(JSON.stringify(row));
                })
            },
            handleSubmit() {//提交反馈
                this.$refs["detailsQuery"].validate((valid) => {
                    if(valid) {
                        let para = {};
                        if(this.detailsQuerys.needReceiptType == 0) {
                            para.id = this.detailsQuerys.id;
                        } else {
                            para.id = this.detailsQuerys.id;
                            para.info = this.detailsQuerys.info;
                            para.documents = this.detailsQuerys.documents;
                            para.images = this.detailsQuerys.images;
                        }
                        console.log('para',para);
                        put(para).then(res => {
                            // console.log(res);
                            if(res.data.code == code) {
                                this.$message({
                                    type: 'success',
                                    message:'提交成功！'
                                });
                                this.detailsDialogVisible = false;
                                this.getSearchList();
                            } else {
                                this.$message({
                                    type: 'error',
                                    message:res.data.message
                                });
                            }
                        }).catch(err => {
                            this.$message({
                                type: 'error',
                                message:"提交失败,请重试或者联系管理员！！"
                            });
                        })
                    }
                })
                
            },
            upfileList(file) {
                this.newQuerys.taskDocuments = file;
            },
            handleCreate() {//确认发布自主任务
            	this.$refs["addQuery"].validate((valid) => {
                    if (valid) {
                    this.loadingTwo = true;
                        if(this.newQuerys.id == 0){
                            post(this.newQuerys)
                                .then((res) => {
                                this.loadingTwo = false;
                                    if(res.data.code == code){
                                        this.$message({
                                            message: "发布成功",
                                            type: 'success'
                                        });
                                        this.dialogVisible = false;
                                        this.getSearchList();
                                    }else{
                                        this.$message({
                                            message: res.data.message,
                                            type: 'warning'
                                        });
                                    }
                                }).catch(() => {
                                this.loadingTwo = false;
                                this.$message({
                                    type: 'error',
                                    message:"发布失败,请重试或者联系管理员！！"
                                });
                            });
                        }else{
                            put(this.newQuerys)
                                .then((res) => {
                                this.loadingTwo = false;
                                    if(res.data.code == code){
                                        this.$message({
                                            message: "编辑成功",
                                            type: 'success'
                                        });
                                        this.dialogVisible = false;
                                        this.getSearchList();
                                    }else{
                                        this.$message({
                                            message: res.data.message,
                                            type: 'warning'
                                        });
                                    }
                                }).catch(() => {
                                this.loadingTwo = false;
                                this.$message({
                                    type: 'error',
                                    message:"编辑失败,请重试或者联系管理员！！"
                                });
                            });
                        }
                    }
                });
            },
            handleDelete(index,row) {
                this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    del({ids:row.id}).then((res) => {
                        if(res.data.code == code){
                            this.getSearchList();
                            this.$message({
                                type: 'success',
                                message: '删除成功!'
                            });
                        }else{
                            this.$message({
                                message: res.data.message,
                                type: 'warning'
                            });
                        }
                    }).catch(() =>{
                        this.$message({
                            message: "请求失败,请重试或者联系管理员！！",
                            type: 'warning'
                        });
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            removeAll(){
                let ids =this.sells.map(item => item.id).toString();
                if(ids == ''){
                    this.$message({
                        message: "请选择数据！！",
                        type: 'warning'
                    });
                    return false;
                }
                this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    del({ids:ids}).then((res) => {
                        if(res.data.code == code){
                            this.getSearchList();
                            this.$message({
                                type: 'success',
                                message: '删除成功!'
                            });
                        }else{
                            this.$message({
                                message: res.data.message,
                                type: 'warning'
                            });
                        }
                    }).catch(() =>{
                        this.$message({
                            message: "请求失败,请重试或者联系管理员！！",
                            type: 'warning'
                        });
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
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
            handleCancel() {
                this.detailsDialogVisible = false;
                if(this.category == 1) {
                    this.nowFinish = false;
                }
            },
            disableBtn(val) {
                this.isDisableBtn = val;
            }
        },
        components: {
            fileUpload,
            vYvoption,
            imgsUpload
        },
        mounted () {
            this.getSearchList();
        },
    }
</script>

<style scoped>
    .el-pagination{
        float: right;
    }
    .block{
        padding: 10px 0;
    }
    .el-button--small.is-circle {
        margin-bottom: 5px;
    }
    .circle {
        position: absolute;
        left: 36px;
        height:20px;
        cursor:text;
        margin-top: 9px;
    }
    .a_style {
        color:#409eff;
        text-decoration:underline;
    }
    .dialog-footer-middle {
        text-align: center;
    }
    .dialog-footer-middle button {
        margin-right: 30px;
    }
</style>
