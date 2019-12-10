<route-meta>
{
  "requiresAuth": true,
  "name":"信息上报",
  "parent":"任务管理/信息管理"
}
</route-meta>
<template>
    <div>
        <div class="search">
            <el-form class="form" :inline="true" :model="query" ref="search">
                <el-form-item label="信息标题">
                    <el-input v-model="query.title" clearable></el-input>
                </el-form-item>
                <el-form-item label="接收状态">
                    <el-select v-model="query.reportStatusList" clearable filterable placeholder="请选择接收状态">
                        <v-yvoption groupName="msgReceiveStatus"></v-yvoption>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <div class="btnSearch">
                        <el-button type="primary" v-loading="loadingOne" @click="getSearchList">查询</el-button>
                        <el-button type="primary" @click="handleReport">上报信息</el-button>
                    </div>
                </el-form-item>
            </el-form>
        </div>
        <div class="table-wrapper" style="margin-top: 20px;">
            <el-table  ref="multipleTable" :data="list.list"  tooltip-effect="dark" v-loading="loadingOne">
                <!-- <el-table-column type="selection"  width="70" ></el-table-column> -->
				<el-table-column prop="title" label="信息标题" show-overflow-tooltip min-width="160"></el-table-column>
				<el-table-column prop="createTime" label="上报时间" show-overflow-tooltip min-width="160">
                    <template slot-scope="scope">
                    	<span style="">{{ scope.row.createTime|date }}</span>
                	</template>
                </el-table-column>
                <el-table-column prop="receiveOrgName" label="报送对象" show-overflow-tooltip min-width="160"></el-table-column>
                <el-table-column label="附件" min-width="160">
					<template slot-scope="scope">
                        <span v-if='!scope.row.documents'>无</span>
                        <span v-for='(item,index) in scope.row.documentsAccess' v-else :key="index">
                            <a :href='item' class="a_style" target="_blank">{{item.split('_')[1]}}</a><br>
                        </span>
                	</template>
				</el-table-column>
                <el-table-column label="信息类别" show-overflow-tooltip min-width="160">
                    <template slot-scope="scope">
                        <p>{{scope.row.isNeedReply == 0 ? '无需回复' : '需要回复'}}</p>
                    </template>
                </el-table-column>
                <el-table-column prop="reportStatusZh" label="接收状态" show-overflow-tooltip min-width="160">
                    <template slot-scope="scope">
                        <el-tag>{{scope.row.reportStatusZh}}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column  label="操作" min-width="225px" fixed="right">
                    <template slot-scope="scope">
                        <el-button type="primary" size="mini" @click="handleCheck(scope.$index, scope.row)">查看</el-button>
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
        <!-- 上报信息模态框 -->
        <el-dialog :title="dialogTitle"  :visible.sync="dialogVisible" :close-on-click-modal='false'>
            <el-form  label-width="200px" :model="newQuerys" ref="addQuery" :rules="rules">
                <el-row>
                    <el-col :span='24'>
                        <el-form-item label="信息报送单位：">
                            <p>{{newQuerys.sendOrgName}}</p>
                        </el-form-item>
                    </el-col>
                    <el-col :span='12'>
                        <el-form-item label="信息标题：" prop="title">
                            <el-input v-model="newQuerys.title" auto-complete="off" maxlength="100"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span='12'>
                        <el-form-item label="信息类别：">
                            <el-radio-group v-model="newQuerys.isNeedReply">
                                <el-radio :label="0">无需回复</el-radio>
                                <el-radio :label="1">需要回复</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                    <el-col :span='24'>
                        <el-form-item label="信息内容（或简介）：" prop="content">
                            <el-input type="textarea" v-model="newQuerys.content" style='width: 80%;' :rows="6" maxlength="800"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span='24'>
                        <el-form-item label="附件：" prop="documents">
                            <file-upload v-model="newQuerys.documents" :fileList='newQuerys.documentsAccess' @disableBtn='disableBtn'></file-upload>
                        </el-form-item>
                    </el-col>
                    <el-col :span='24'>
                        <el-form-item label="报送对象：">
                            <p>{{newQuerys.receiveOrgName}}</p>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>

            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible=false" :disabled="isDisableBtn">取 消</el-button>
                <el-button type="primary" @click="handleCreate" :loading="loadingTwo" v-if="isAdd" :disabled="isDisableBtn">报 送</el-button>
                <el-button type="primary" @click="handleCreate" :loading="loadingTwo" v-if='!isAdd' :disabled="isDisableBtn">重新报送</el-button>
            </div>
        </el-dialog>
        <!-- 详情弹框 -->
        <el-dialog title="查看"  :visible.sync="detailsDialogVisible" >
            <el-form  label-width="200px" :model="detailsQuerys">
                <el-row>
                    <el-col :span='24'>
                        <el-form-item label="信息报送单位：">
                            <p>{{detailsQuerys.sendOrgName}}</p>
                        </el-form-item>
                    </el-col>
                    <el-col :span='12'>
                        <el-form-item label="信息标题：" prop="title">
                            <p class="p_style">{{detailsQuerys.title}}</p>
                        </el-form-item>
                    </el-col>
                    <el-col :span='12'>
                        <el-form-item label="信息类别：">
                            <p>{{detailsQuerys.isNeedReply == 0 ? '无需回复' : '需要回复'}}</p>
                        </el-form-item>
                    </el-col>
                    <el-col :span='24'>
                        <el-form-item label="信息内容（或简介）：" prop="content">
                            <p v-if='!detailsQuerys.content'>无</p>
                            <el-input v-else type="textarea" :value='detailsQuerys.content' :readonly="true" rows='6' style='width:80%;'></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span='24'>
                        <el-form-item label="附件：" prop="documents">
                            <p v-if="!detailsQuerys.documents">无</p>
                            <div v-for="(item,index) in detailsQuerys.documentsAccess" v-else :key='index'>
                                <a :href='item' target="_blank" class="a_style">{{item.split('_')[1]}}</a>
                            </div>
                        </el-form-item>
                    </el-col>
                    <el-col :span='12'>
                        <el-form-item label="报送对象：">
                            <p>{{detailsQuerys.receiveOrgName}}</p>
                        </el-form-item>
                    </el-col>
                    <el-col :span='12'>
                        <el-form-item label="接收状态：">
                            <p>{{detailsQuerys.reportStatusZh}}</p>
                        </el-form-item>
                    </el-col>
                    <el-col :span='24' v-if="detailsQuerys.reportStatus == 3">
                        <el-form-item label="回复内容：">
                            <p>{{detailsQuerys.replyInfo}}</p>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>

            <div slot="footer" class="dialog-footer">
                <el-button @click="detailsDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="handleRecall" :loading="loadingTwo" v-if='detailsQuerys.reportStatus == 1'>撤 回</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    import { 
        // postInformationReports as post,
        getInformationReports as get,
        // putInformationReports as put,
        // recallInformationReports as recallPut,
    } from '../../../api/villageApi';
    const code = "200";
    import vYvoption from '../../../components/common/yvoption.vue';
    import fileUpload from '../../../components/common/uploadsFile.vue';
    import {checkEmporty} from '../../../utils/validator';
    export default {
        layout:'home',
        data() {
            return {
                query: {
                    title:'',
                    reportStatusList:'',
                    size:10,
                    page:1,
                },
                user: JSON.parse(localStorage.getItem('user')),
                loadingOne: false,
                loadingTwo: false,
                list: {},
                dialogTitle:'',
                dialogVisible: false,
                detailsDialogVisible: false,
                isDisableBtn: false,
                addQuery: {
                    title:'',
                    isNeedReply: 0,
                    content:'',
                    documents:'',
                    sendOrgName: '',
                    receiveOrgName: '',
                    documentsAccess:[],
                },
                newQuerys:{},
                detailsQuerys: {},
                isAdd: true,
                currentPage1: 1,
                rules:{
                    title:[{validator: checkEmporty,required: true, max: 200, trigger: 'blur' }],
                    content:[{validator: checkEmporty,required: true, max: 800, trigger: 'blur' }],
                },
            }
        },
        components: {
            vYvoption,
            fileUpload
        },
        mounted() {
            this.getSearchList();
        },
        methods:{
            getSearchList() {
                get(this.query).then(res => {
                    this.loadingOne = false;
                    if(res.data.code == code) {
                        this.list = res.data.data;
                    } else {
                        this.$message({
                            type:'error',
                            message: res.data.message,
                        })
                    }
                }).catch(err => {
                    console.log('err',err)
                    this.loadingOne = false;
                    this.$message({
                        type: 'error',
                        message:"查询失败,请重试或者联系管理员！！"
                    });
                })
            },
            handleReport() {
                this.dialogVisible = true;
                this.isAdd = true;
                this.isDisableBtn = false;
                this.addQuery.isNeedReply = 0;
                this.$nextTick(function() {
                    this.$refs['addQuery'].resetFields();
                    this.dialogTitle = '上报信息';
                    this.newQuerys = JSON.parse(JSON.stringify(this.addQuery));
                    this.newQuerys.sendOrgName = this.user.orgName;
                    this.newQuerys.receiveOrgName = this.user.partyOrg.parentName;
                })
            },
            handleCheck(index,row) {
                console.log('row',row);
                if(row.reportStatus == 0) {
                    this.dialogVisible = true;
                    this.isAdd = false;
                    this.dialogTitle = '查看';
                    this.$nextTick(function() {
                        this.newQuerys = JSON.parse(JSON.stringify(row));
                    })
                } else {
                    this.detailsDialogVisible = true;
                    this.$nextTick(function () {
                        this.detailsQuerys = JSON.parse(JSON.stringify(row));
                    })
                }
                
            },
            handleCreate() {//上报
                this.$refs["addQuery"].validate((valid) => {
                    if(valid) {
                        this.loadingTwo = true;
                        console.log(this.newQuerys)
                        if(this.isAdd) {
                            post(this.newQuerys).then(res => {
                                this.loadingTwo = false;
                                if(res.data.code == code) {
                                    this.$message.success('上报成功！');
                                    this.dialogVisible = false;
                                    this.getSearchList();
                                } else {
                                    this.$message({
                                        message: res.data.message,
                                        type: 'warning'
                                    });
                                }
                            }).catch(err => {
                                this.loadingTwo = false;
                                this.$message({
                                    type: 'error',
                                    message:"上报失败,请重试或者联系管理员！！"
                                });
                            })
                        } else {
                            put(this.newQuerys).then(res => {
                                this.loadingTwo = false;
                                if(res.data.code == code) {
                                    this.dialogVisible = false;
                                    this.$message.success('上报成功！');
                                    this.getSearchList();
                                } else {
                                    this.$message({
                                        message: res.data.message,
                                        type: 'warning'
                                    });
                                }
                            }).catch(err => {
                                this.loadingTwo = false;
                                this.$message({
                                    type: 'error',
                                    message:"上报失败,请重试或者联系管理员！！"
                                });
                            })
                        }
                        
                    }
                })
            },
            handleRecall() {//撤回
                let id = this.detailsQuerys.id;
                this.loadingTwo = true;
                recallPut(id).then(res => {
                    this.loadingTwo = false;
                    if(res.data.code == code) {
                        this.detailsDialogVisible = false;
                        this.getSearchList();
                    } else {
                        this.$message({
                            type: 'error',
                            message:res.data.message
                        })
                    }
                }).catch(err => {
                    this.loadingTwo = false;
                    this.$message({
                        type: 'error',
                        message:"撤回失败,请重试或者联系管理员！！"
                    });
                })
            },
            handleSizeChange(val) {
                this.query.size = val;
                this.getSearchList();
            },
            handleCurrentChange(val) {
                this.query.page = val;
                this.getSearchList();
            },
            disableBtn(val) {
                this.isDisableBtn = val;
            }
        } 
    }
</script>
<style scoped>
    .el-pagination{
        float: right;
    }
    .block{
        padding: 10px 0;
    }
    .a_style {
        color:#409eff;
        text-decoration:underline;
    }
</style>