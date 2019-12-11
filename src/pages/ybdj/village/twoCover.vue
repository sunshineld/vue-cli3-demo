<route-meta>
{
  "requiresAuth": true,
  "name":"组织建设 / 两个覆盖",
  "parent":"首页 / 组织领导"
}
</route-meta>
<template>
    <div class="log">
        <div class="search">
            <el-form class="form" :inline="true"  :model="query" ref="search">
                <el-form-item label="组织名称">
                    <el-input v-model="query.name"  placeholder="组织名称"></el-input>
                </el-form-item>
                <el-form-item label="组织类型">
                    <el-select v-model="query.type" clearable filterable placeholder="请选择组织类型">
                        <v-yvoption groupName="twoCoversorganizationType"></v-yvoption>
                    </el-select>
                </el-form-item>
                <el-form-item label="覆盖情况">
                    <el-select v-model="query.coverageType" clearable filterable placeholder="请选择覆盖情况">
                        <v-yvoption groupName="coverageCondition"></v-yvoption>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <div class="btnSearch">
                        <el-button  type="primary" @click="getSearchList" v-loading="loadingOne">查询</el-button>
                        <el-button  type="primary" @click="addModel">新建</el-button>
                    </div>
                </el-form-item>
            </el-form>
        </div>
        <div class="table-wrapper" >
            <el-table  ref="multipleTable" :data="list.list"  tooltip-effect="dark"  @selection-change="handleSelectionChange" v-loading="loadingOne">
                <el-table-column type="selection"  width="70" ></el-table-column>
				<el-table-column prop="name" label="组织名称" show-overflow-tooltip ></el-table-column>
				<el-table-column prop="typeZh" label="组织类型" show-overflow-tooltip ></el-table-column>
				<el-table-column prop="leader" label="负责人" show-overflow-tooltip ></el-table-column>
				<el-table-column prop="leaderPositionZh" label="负责人身份" width="130" show-overflow-tooltip ></el-table-column>
				<el-table-column prop="sumMemberCount" label="组织人数" show-overflow-tooltip ></el-table-column>
				<el-table-column prop="partyMemberCount" label="党员人数" show-overflow-tooltip ></el-table-column>
				<el-table-column prop="coverageTypeZh" label="覆盖情况" show-overflow-tooltip ></el-table-column>
				
                <el-table-column  label="操作" width="225px">
                    <template slot-scope="scope">
                        <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                        <el-button size="mini" type="danger"  @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <!--批量删除-->
        <div class="block">
            <el-button type="danger" @click="removeAll">批量删除</el-button>
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
        <el-dialog :title="dialogTitle"  :visible.sync="dialogVisible" >
            <el-form  label-width="180px" :model="newQuerys" ref="addQuery" :rules="rules">
                    <el-row>
					    <el-col :span='12'>
	                        <el-form-item label="组织名称" prop="name">
	                            <el-input v-model="newQuerys.name" auto-complete="off"></el-input>
	                        </el-form-item>
	                    </el-col>
                        <el-col :span='12'>
	                        <el-form-item label="创办时间" prop="foundationTime">
                                <el-date-picker type="date" placeholder="选择创办日期" v-model="newQuerys.foundationTime"></el-date-picker>
	                        </el-form-item>
	                    </el-col>
					    <el-col :span='24'>
	                        <el-form-item label="主营业务" prop="works">
	                            <el-input type="textarea" :rows=5 v-model="newQuerys.works" auto-complete="off"></el-input>
	                        </el-form-item>
	                    </el-col>
					    <el-col :span='12'>
	                        <el-form-item label="年产值(万元)/成效" prop="efficiency">
	                            <el-input v-model="newQuerys.efficiency" auto-complete="off">
                                </el-input>
	                        </el-form-item>
	                    </el-col>
                        <el-col :span='12'>
	                        <el-form-item label="状态" prop="status">
                                 <el-select v-model="newQuerys.status"  placeholder="请选择">
                                    <v-yvoption groupName="orgStatus"></v-yvoption>
                                </el-select>
	                        </el-form-item>
	                    </el-col>
                    </el-row>
                    <el-row>
					    <el-col :span='12'>
	                        <el-form-item label="组织类型" prop="type">
                                 <el-select v-model="newQuerys.type" clearable @change='changeOrganization(newQuerys.type)' filterable placeholder="请选择">
                                    <v-yvoption groupName="twoCoversorganizationType"></v-yvoption>
                                </el-select>
	                        </el-form-item>
	                    </el-col>
					    <el-col :span='12'>
	                        <el-form-item label="组织类别" prop="subType">
                                <el-select v-model="newQuerys.subType" :disabled='dis' clearable filterable placeholder="请选择">
                                    <v-yvoption :groupName="orgType"></v-yvoption>
                                </el-select>
	                        </el-form-item>
	                    </el-col>
                        </el-row>
                        <el-row>
					    <el-col :span='12'>
	                        <el-form-item label="组织总人数" prop="sumMemberCount">
	                            <el-input v-model="newQuerys.sumMemberCount" type='number' onkeypress='return( /[\d]/.test(String.fromCharCode(event.keyCode)))' auto-complete="off"></el-input>
	                        </el-form-item>
	                    </el-col>
					    <el-col :span='12'>
	                        <el-form-item label="党员人数" prop="partyMemberCount">
	                            <el-input v-model="newQuerys.partyMemberCount" type='number' onkeypress='return( /[\d]/.test(String.fromCharCode(event.keyCode)))' auto-complete="off"></el-input>
	                        </el-form-item>
	                    </el-col>
					    <el-col :span='12'>
	                        <el-form-item label="负责人" prop="leader">
	                            <el-input v-model="newQuerys.leader" auto-complete="off"></el-input>
	                        </el-form-item>
	                    </el-col>
					    <el-col :span='12'>
	                        <el-form-item label="负责人身份" prop="leaderPosition">
                                <el-select v-model="newQuerys.leaderPosition" clearable filterable placeholder="请选择">
                                    <v-yvoption groupName="leaderPosition"></v-yvoption>
                                </el-select>
	                        </el-form-item>
	                    </el-col>
					    <el-col :span='12'>
	                        <el-form-item label="覆盖情况" prop="coverageType">
                                <el-select v-model="newQuerys.coverageType" @change='changeCoverage(newQuerys.coverageCondition)' clearable filterable placeholder="请选择覆盖情况">
                                    <v-yvoption groupName="coverageCondition"></v-yvoption>
                                </el-select>
	                        </el-form-item>
	                    </el-col>
                    </el-row>
                    <el-row v-if='newQuerys.coverageType == 1'>
					    <el-col :span='12'>
	                        <el-form-item label="党组织名称" prop="coveragePartyOrgName">
	                            <el-input v-model="newQuerys.coveragePartyOrgName" auto-complete="off"></el-input>
	                        </el-form-item>
	                    </el-col>
					    <el-col :span='12'>
	                        <el-form-item label="党组织成立时间" prop="coveragePartyOrgTime">
	                        	<el-date-picker type="date" placeholder="选择日期" v-model="newQuerys.coveragePartyOrgTime"></el-date-picker>
	                        </el-form-item>
	                    </el-col>
					    <el-col :span='12'>
	                        <el-form-item label="组建方式" prop="coveragePartyOrgFoundationType">
                                 <el-select v-model="newQuerys.coveragePartyOrgFoundationType" clearable filterable placeholder="请选择">
                                    <v-yvoption groupName="twoCoverFormationMode"></v-yvoption>
                                </el-select>
	                        </el-form-item>
	                    </el-col>
					    <el-col :span='12'>
	                        <el-form-item label="党组织书记名称" prop="coveragePartyOrgSecretaryName">
	                            <el-input v-model="newQuerys.coveragePartyOrgSecretaryName" auto-complete="off"></el-input>
	                        </el-form-item>
	                    </el-col>
					    <el-col :span='12'>
	                        <el-form-item label="党组织书记电话" prop="coveragePartyOrgSecretaryPhone">
	                            <el-input v-model="newQuerys.coveragePartyOrgSecretaryPhone" auto-complete="off"></el-input>
	                        </el-form-item>
	                    </el-col>
                    </el-row>
                    <el-row v-if='newQuerys.coverageType == 2'>
					    <el-col :span='12'>
	                        <el-form-item label="党建指导员姓名" prop="partyBuildingInstructorName">
	                            <el-input v-model="newQuerys.partyBuildingInstructorName" auto-complete="off"></el-input>
	                        </el-form-item>
	                    </el-col>
					    <el-col :span='12'>
	                        <el-form-item label="党建指导员手机号" prop="partyBuildingInstructorPhone">
	                            <el-input v-model="newQuerys.partyBuildingInstructorPhone" auto-complete="off"></el-input>
	                        </el-form-item>
	                    </el-col>
                    </el-row>
            </el-form>

            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="handleCreate" :loading="loadingTwo">确 定</el-button>
            </div>
        </el-dialog>


    </div>

</template>

<script>
    import {
        // delVillagePartyOrgCovers as del,
        // getVillagePartyOrgCovers as get,
        // postVillagePartyOrgCovers as post,
        // putVillagePartyOrgCovers as put,
    } from '../../../api/villageApi';

    const code = "200";
    import vYvoption from '../../../components/common/yvoption';

    export default {
        layout:'home',
        data() {
            return {
                query:{
                    name:'',
                    type:'',
                    coverageType:"",
                    size:10,
                    page:1
                },
                addQuery:{
                	areaId: "",
                    areaName: "",
                    coveragePartyOrgFoundationType:"",
                    coveragePartyOrgName: "",
                    coveragePartyOrgSecretaryName: "",
                    coveragePartyOrgSecretaryPhone: "",
                    coveragePartyOrgTime: "",
                    coverageType: "",
                    createTime: "",
                    foundationTime: "",
                    id: "",
                    leader: "",
                    leaderPhone: "",
                    leaderPosition: "",
                    name: "",
                    partyBuildingInstructorName: "",
                    partyBuildingInstructorPhone: "",
                    partyMemberCount: 0,
                    status:1,
                    subType: "",
                    sumMemberCount: 0,
                    type: "",
                    efficiency: "",
                    works: ""
                },
                rules:{
                	name:[{required:true, message: '请填写内容', trigger: 'blur' }],
                	type:[{required:true, message: '请选择内容', trigger: 'change' }],
                    subType:[{required:true, message: '请选择内容', trigger: 'change' }],

                    coveragePartyOrgName:[{required:false, message: '请填写内容', trigger: 'blur' }],
                    coveragePartyOrgTime:[{required:false, message: '请填写内容', trigger: 'change' }],
                    coveragePartyOrgFoundationType:[{required:false, message: '请选择内容', trigger: 'change' }],
                    coveragePartyOrgSecretaryName:[{required:false, message: '请填写内容', trigger: 'blur' }],
                    coveragePartyOrgSecretaryPhone:[{required:false, message: '请填写内容', trigger: 'blur' }],

                    partyBuildingInstructorName:[{required:false, message: '请填写内容', trigger: 'blur' }],
                    partyBuildingInstructorPhone:[{required:false, message: '请填写内容', trigger: 'blur' }]
                },
                newQuerys:{},
                sells:[],
                list:{},
                dialogVisible:false,
                currentPage1:1,
                dialogTitle:'',
                loadingOne:false,
                loadingTwo:false,
                dis:true,
                orgType:'moneyOrganizationType'
            }
        },
        components:{
            vYvoption
        },
        watch:{
            // 'newQuerys.organizationType':function (params) {
            //     if(params){
            //         this.newQuerys.organizationCategory = ''
            //     }
            // }
        },
        methods:{
            changeCoverage(val) {
                if(val == 1) {
                    this.rules.coveragePartyOrgName[0].required = true;
                    this.rules.coveragePartyOrgTime[0].required = true;
                    this.rules.coveragePartyOrgFoundationType[0].required = true;
                    this.rules.coveragePartyOrgSecretaryName[0].required = true;
                    this.rules.coveragePartyOrgSecretaryPhone[0].required = true;

                    this.newQuerys.partyBuildingInstructorName = '';
                    this.newQuerys.partyBuildingInstructorPhone = '';
                }else if(val == 2){
                    this.rules.partyBuildingInstructorName[0].required = true;
                    this.rules.partyBuildingInstructorPhone[0].required = true;

                    this.newQuerys.coveragePartyOrgName = '';
                    this.newQuerys.coveragePartyOrgTime = '';
                    this.newQuerys.coveragePartyOrgFoundationType = '';
                    this.newQuerys.coveragePartyOrgSecretaryName = '';
                    this.newQuerys.coveragePartyOrgSecretaryPhone = '';
                }else{
                    this.newQuerys.coveragePartyOrgName = '';
                    this.newQuerys.coveragePartyOrgTime = '';
                    this.newQuerys.coveragePartyOrgFoundationType = '';
                    this.newQuerys.coveragePartyOrgSecretaryName = '';
                    this.newQuerys.coveragePartyOrgSecretaryPhone = '';
                    this.newQuerys.partyBuildingInstructorName = '';
                    this.newQuerys.partyBuildingInstructorPhone = '';
                }
            },
            changeOrganization(val) {
                if(val == ''){
                    this.dis = true;
                    this.newQuerys.subType = ''
                }else{
                    this.dis = false;
                    this.newQuerys.subType = ''
                }
                if(val == 1) {
                    this.orgType = 'moneyOrganizationType';
                    this.newQuerys.subType = 1
                }else{
                    this.orgType = 'worldOrganizationType';
                    this.newQuerys.subType = 4
                }
            },
            getSearchList(){
            	this.loadingOne = true;
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
            addModel(){
                this.dialogVisible = true;
                this.$nextTick(function() {
                	this.$refs['addQuery'].resetFields();
                    this.newQuerys = Object.assign({}, this.addQuery);
                    this.dialogTitle = "新增";
                })
            },
            handleSelectionChange(val) {
                this.sells = val;
            },
            handleEdit(index,row){
                this.dialogVisible = true;
                this.$nextTick(function() {
                	this.$refs['addQuery'].resetFields();
                    this.newQuerys = Object.assign({}, row);
                    this.dialogTitle = "编辑";
                    if(this.newQuerys.type == 1){
                        this.orgType = 'moneyOrganizationType'
                    }else{
                        this.orgType = 'worldOrganizationType'
                    }
                    this.dis = false;
                })

            },
            handleCreate() {
               
            	this.$refs["addQuery"].validate((valid) => {
                    if (valid) {
                 
                    this.loadingTwo = true;
                        if(this.newQuerys.id == 0){
                            post(this.newQuerys)
                                .then((res) => {
                                this.loadingTwo = false;
                                    if(res.data.code == code){
                                        this.$message({
                                            message: "新增成功",
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
                                    message:"新增失败,请重试或者联系管理员！！"
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
            }
        },
        mounted () {
            // this.getSearchList();
         
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

</style>
