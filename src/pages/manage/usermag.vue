<route-meta>
{
  "requiresAuth": true,
  "name":"管理员用户管理",
  "parent":"系统管理"
}
</route-meta>
<template>
    <div class="table">
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true" :rules="queryRules" ref="queryform" :model="queryParam" >
                <el-form-item label="登录名">
                    <el-input v-model="queryParam.loginName" :maxlength=10 auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="名称">
                    <el-input v-model="queryParam.name" :maxlength=10 auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="角色">
                    <el-select v-model="queryParam.roleId" clearable filterable placeholder="请选择角色">
                        <!-- <v-yvoption groupName="myRole" :dataList="currentUser.orgId|string"></v-yvoption> -->
                    </el-select>
                </el-form-item>
                <el-form-item label="所属党支部">
                        <el-select v-model="queryParam.orgId" placeholder="请选择所属党支部" clearable filterable>
                            <!-- <v-yvoption groupName="myPartyOrg" :dataList="currentUser.orgId|string"></v-yvoption> -->
                        </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="getUserList">查询</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleAdd">新增</el-button>
                </el-form-item>
            </el-form>
        </el-col>
        <el-table :data="tableData" border style="width: 100%" v-loading.body="loading" @selection-change="selsChange">
            <el-table-column type="selection" width="70"></el-table-column>
            <el-table-column prop="nickName" label="名称" show-overflow-tooltip></el-table-column>
            <el-table-column prop="roleName" label="角色" show-overflow-tooltip></el-table-column>
            <el-table-column prop="orgName" label="所属党支部" show-overflow-tooltip></el-table-column>
            <el-table-column prop="regTime" label="注册时间" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span style="">{{ scope.row.regTime | date }}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作"  width="280">
                <template slot-scope="scope">
                    <el-button size="mini" type="primary" @click="handleReset(scope.$index, scope.row)">重置密码</el-button>
                    <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button size="mini" v-if="scope.row.id != '20'" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-row type="flex" justify="space-between" style="margin-top:10px">
            <el-col :span='12'>
                <el-button type="danger" @click="batchRemove">批量删除</el-button>
            </el-col>
            <el-col :span='6'>
                <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page.sync="currentPage1"
                    :page-size=pageSize
                    :page-sizes="[10, 20, 30, 50]"
                    layout="total, sizes, prev,  pager, next"
                    :total=totalCount>
                </el-pagination>
            </el-col>
        </el-row>
        <!--新增界面-->
        <el-dialog :title="formTittle" :visible.sync="formVisible" :close-on-click-modal="false" >
            <el-form :model="subform" label-width="100px" :rules="formRules" ref="subform" :disabled="subform.id == '20'">
                <el-row>
                    <el-col :span='12'>
                        <el-form-item label="头像" prop="pic">
                            <!-- <imgUpDate :imageUrl="imgUrl"  v-model="subform.pic" @accessImageChange="accessImageChange"></imgUpDate> -->
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span='12'>
                        <el-form-item label="用户id" prop="id">
                            <el-input v-model="subform.id" auto-complete="off" disabled></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span='12'>
                        <el-form-item label="角色" prop="roleId">
                            <el-select v-model="subform.roleId" placeholder="请选择角色">
                                <!-- <v-yvoption groupName="myRole" :dataList="currentUser.orgId|string"></v-yvoption> -->
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span='12'>
                        <el-form-item label="登录名" prop="loginName">
                            <el-input v-model="subform.loginName" auto-complete="off"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span='12'>
                        <el-form-item label="所属党支部" prop="orgId">
                            <el-select v-model="subform.orgId" placeholder="请选择所属党支部" :clearable="currentUser.userType==0" :filterable="currentUser.userType==0">
                                <!-- <v-yvoption groupName="myPartyOrg" :dataList="currentUser.orgId|string"></v-yvoption> -->
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span='12'>
                        <el-form-item label="名称" prop="nickName">
                            <el-input v-model="subform.nickName" auto-complete="off"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span='12'>
                        <el-form-item label="手机号" prop="mobilePhone">
                            <el-input v-model="subform.mobilePhone" auto-complete="off"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span='12'>
                        <el-form-item label="邮箱" prop="email">
                            <el-input v-model="subform.email" auto-complete="off"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span='12'>
                        <el-form-item label="状态" prop="status">
                            <el-select v-model="subform.status" placeholder="请选择状态">
                                <!-- <v-yvoption groupName="userStatus"></v-yvoption> -->
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span='12'>
                        <el-form-item label="注册时间" prop="regTime">
                            <el-date-picker type="datetime" placeholder="选择日期" v-model="subform.regTime" disabled></el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="formVisible = false">取消</el-button>
                <el-button type="primary" @click.native="formSubmit" :loading="formLoading">提交</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import {
    // createUser,
    getUserList,
    // editUser,
    // delUser,
    // getRoleList,
    // resetPwd,
    base
} from '../../api/api';
// import vYvoption from '../../common/yvoption.vue';
// import vYvtableoption from '../../common/yvtableoption.vue';
// import {validNum} from '../../../utils/validator.js';
const code = '200';
// import imgUpDate from '../../common/imgUpDate.vue'
export default {
    layout: 'home',
    data() {
            return {
                // uploadUrl:base+'/upload',
                upPercentage: 0,
                upFlag: '',
                tableData: [],
                roleData: [],
                pageIndex: 1,
                pageSize: 10,
                totalCount: 0,
                loading: true,
                sels: [],
                //form数据
                formTittle: '',
                formVisible: false,
                queryParam: {
                    id: '',
                    name: '',
                    loginName:'',
                    roleId: '',
                    status: '',
                    orgId:''
                },
                subform: {},
                initform: {
                    id: '',
                    roleId: '',
                    orgId:'',
                    mobilePhone: '',
                    loginName: '',
                    nickName: '',
                    email: '',
                    pic: '',
                    status: 1,
                    isDel: '0',
                    regTime: '',
                },
                formRules: {
                    roleId: [{
                        required: true,
                        message: '请选择角色',
                        trigger: 'change'
                    }],
                    loginName: [{
                        required: true,
                        message: '请输入登陆名称',
                        trigger: 'blur'
                    }],
                    orgId: [{
                        required: true,
                        message: '请选择所属党支部',
                        trigger: 'change'
                    }],
                    nickName: [{
                        required: true,
                        message: '请输入名称',
                        trigger: 'blur'
                    }]
                },
                queryRules: {
                    id: [{
                        // validator: validNum,
                        trigger: 'blur'
                    }],
                },
                formLoading: false,
                imgUrl:'',
                currentPage1:1
            }
        },
        // components: {
        //     vYvoption,
        //     vYvtableoption,
        //     imgUpDate
        // },

        computed:{
            currentUser(){
                let userStr = localStorage.getItem('user');
                if(!userStr){
                    return false
                }
                let user = JSON.parse(userStr);
                return user;
            }
        },
        methods: {
            accessImageChange(val){
                this.imgUrl = val;
            },
            handleSizeChange(val) {
                console.log(val,11)
                this.pageSize=val;
                this.getUserList();
              },
            handleCurrentChange(val) {
                console.log(val)
                this.pageIndex = val;
                this.getUserList()
            },
            handleAdd(index, row) {
                this.formVisible = true;
                this.upPercentage = 0;
                this.upFlag = '';
                this.$nextTick(function() {
                    this.imgUrl = "";
                    this.subform = Object.assign({}, this.initform);
                    this.$refs['subform'].resetFields();
                    this.formTittle = "新增"
                })
            },
            handleEdit(index, row) {
                this.formVisible = true;
                this.upPercentage = 0;
                this.upFlag = '';
                this.$nextTick(function() {
                    this.$refs['subform'].resetFields();
                    this.subform = Object.assign({}, row);
                    this.formTittle = "编辑";
                    this.imgUrl = row.picAccess
                })
            },
            handleReset(index, row) {
                this.$confirm('确认重置该用户密码为初始密码123456吗?', '提示', {
                    type: 'warning'
                }).then(() => {
                    let param = {
                        id: row.id
                    }
                    resetPwd(param).then((res) => {
                        if (res.data.code == code) {
                            this.$message.success("重置成功");
                        } else {
                            this.$message.error(res.data.message);
                        }
                    });
                }).catch(() => {

                });
            },
            handleDelete(index, row) {
                this.$confirm('确认删除该记录吗?', '提示', {
                    type: 'warning'
                }).then(() => {
                    let param = {
                        ids: row.id
                    };
                    delUser(param).then((res) => {
                        if (res.data.code == code) {
                            this.formVisible = false;
                            this.getUserList();
                            this.$message.success("删除成功");
                        } else {
                            this.$message.error(res.data.message);
                        }
                    });
                }).catch(() => {

                });
            },
            getUserList() {
                this.$refs["queryform"].validate((valid) => {
                    if (valid) {
                        this.loading = true;
                        const self = this;
                        let params = {
                            page: this.pageIndex,
                            size: this.pageSize,
                            id: this.queryParam.id,
                            loginName: this.queryParam.loginName,
                            nickName: this.queryParam.name,
                            roleId: this.queryParam.roleId,
                            orgId: this.queryParam.orgId,
                        }
                        getUserList(params).then((res) => {
                            this.loading = false;
                            if (res.data.code == code) {
                                console.log(res)
                                this.tableData = res.data.data.list;
                                this.totalCount = res.data.data.total;
                            } else {
                                this.$message.error(res.data.message);
                            }
                        }).catch(function(error) {
                            self.loading = false;
                            self.$message.error('网络故障，请稍后再试');
                        });
                    }
                })
            },
            formSubmit() {
                this.$refs["subform"].validate((valid) => {
                    if (valid) {
                        this.formLoading = true;
                        let param = Object.assign({}, this.subform);
                        if (param.id != "") {
                            editUser(param).then((res) => {
                                this.formLoading = false;
                                if (res.data.code == code) {
                                    this.$message.success("保存成功");
                                    this.formVisible = false;
                                    this.getUserList();
                                } else {
                                    this.$message.error(res.data.message);
                                }
                            });
                        } else {
                            createUser(param).then((res) => {
                                this.formLoading = false;
                                if (res.data.code == code) {
                                    this.$message.success("保存成功");
                                    this.formVisible = false;
                                    this.getUserList();
                                } else {
                                    this.$message.error(res.data.message);
                                }
                            });
                        }

                    } else {
                        return false;
                    }
                })

            },
            selsChange(sels) {
                this.sels = sels;
            },
            batchRemove() {
                var ids = this.sels.map(item => item.id).toString();
                if (ids == "") {
                    this.$message.warning("您还没有选中记录");
                    return false;
                }
                this.$confirm('确认删除选中记录吗？', '提示', {
                    type: 'warning'
                }).then(() => {
                    let param = {
                        ids: ids
                    };
                    delUser(param).then((res) => {
                        if (res.data.code == code) {
                            this.getUserList();
                            this.$message.success("删除成功");
                        } else {
                            this.$message.error(res.data.message);
                        }
                    });
                }).catch(() => {

                });
            },
            handleAvatarSuccess(res, file) {
                this.subform.pic = res.data.dbFileName;
                this.imgUrl = res.data.accessUrl;
            },
            beforeAvatarUpload(file) {
                const picType = "image/pjpeg image/gif image/bmp image/x-png image/tiff image/png image/jpeg";
                const isPIC = picType.indexOf(file.type) != '-1';
                const notNULL = file.type != '';
                const isLt2M = file.size / 1024 / 1024 < 2;

                if (!isPIC || !notNULL) {
                    this.$message.error('上传头像图片只能是图片格式!');
                }
                if (!isLt2M) {
                    this.$message.error('上传头像图片大小不能超过 2MB!');
                }
                return isPIC && isLt2M && notNULL;
            },
            handleProgress(event, file) {
                this.upPercentage = event.percent;
                if (event.percent == 100) {
                    this.upFlag = "success";
                }
            }
        },

        mounted: function() {
            this.getUserList();
        }
}
</script>
