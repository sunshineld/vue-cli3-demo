<route-meta>
{
  "requiresAuth": true,
  "name":"角色管理",
  "parent":"系统管理"
}
</route-meta>
<template>
    <div class="table">
        
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true" :rules="queryRules" ref="queryform" :model="queryParam">
                <el-form-item label="角色编号">
                    <el-input v-model="queryParam.id" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="角色名称">
                    <el-input v-model="queryParam.name" :maxlength=40 auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="所属党支部" v-if="currentUser.userType==0">
                    <el-select v-model="queryParam.orgId" placeholder="请选择所属党支部" clearable filterable>
                        <!-- <v-yvoption groupName="myPartyOrg" :dataList="currentUser.orgId|string"></v-yvoption> -->
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="getRoleList">查询</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleAdd">新增</el-button>
                </el-form-item>
            </el-form>
        </el-col>
        <el-table :data="tableData" border style="width: 100%" v-loading.body="loading" @selection-change="selsChange">
            <el-table-column type="selection" width="70"></el-table-column>
            <el-table-column prop="id" label="角色编号" sortable></el-table-column>
            <el-table-column prop="name" label="角色名称"></el-table-column>
            <el-table-column prop="orgName" label="所属党支部"></el-table-column>
            <el-table-column prop="createTime" label="创建时间" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span style="">{{ scope.row.createTime | date }}</span>
                </template>
            </el-table-column>

            <el-table-column label="操作" width="380">
                <template slot-scope="scope">
                    <el-button size="small" @click="handleMenu(scope.$index, scope.row)">使用权限</el-button>
                    <el-button size="small" @click="handleMenuPower(scope.$index, scope.row)">分配权限</el-button>
                    <el-button size="small" v-if="cantDelIds.indexOf(scope.row.id) == -1" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button size="small" v-if="cantDelIds.indexOf(scope.row.id) == -1" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-row type="flex" justify="space-between" style="margin-top:10px">
            <el-col :span='12'>
            </el-col>
            <el-col :span='6'>
                <el-pagination layout="total,sizes,prev, pager, next" :current-page='pageIndex' :page-size='pageSize' @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-sizes="[10, 20, 50, 100]" :total="totalCount" style="float:right;">
                </el-pagination>
            </el-col>
        </el-row>
        <!--新增界面-->
        <el-dialog :title="formTittle" :visible.sync="formVisible" :close-on-click-modal="false">
            <el-form :model="subform" label-width="90px" :rules="formRules" ref="subform">
                <el-row>
                    <el-col :span='12'>
                        <el-form-item label="角色编号" prop="id">
                            <el-input v-model="subform.id" auto-complete="off" disabled></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span='12'>
                        <el-form-item label="角色名称" prop="name">
                            <el-input v-model="subform.name" :maxlength=40 auto-complete="off"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span='12' v-if="currentUser.userType==0">
                        <el-form-item label="级别" prop="level">
                            <el-select v-model="subform.level" clearable placeholder="请选择级别">
                                    <!-- <v-yvoption groupName="areaLevel"></v-yvoption> -->
                                </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span='12'>
                    <el-form-item label="所属党支部" prop="orgId" style='display:none;'>
                        <el-select v-model="subform.orgId" placeholder="请选择所属党支部" clearable filterable>
                            <!-- <v-yvoption groupName="myPartyOrg" :dataList="currentUser.orgId|string"></v-yvoption> -->
                        </el-select>
                    </el-form-item>
                    </el-col>
                    <el-col :span='24'>
                        <el-form-item label="备注" prop="remark">
                            <el-input type="textarea" v-model="subform.remark" :maxlength=200 auto-complete="off"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="formVisible = false">取消</el-button>
                <el-button type="primary" @click.native="formSubmit" :loading="formLoading">提交</el-button>
            </div>
        </el-dialog>

        <!--使用权限界面-->
            <v-roletree :roleId='menuRoleId' v-if='menuFormVisible' :menuFormVisible='menuFormVisible' @on-visible-change='treeVisibleChange'></v-roletree>
        <!-- 分配权限界面 -->
            <v-powerTree :roleId='menuRoleId' v-if='menuFormVisible2' :menuFormVisible='menuFormVisible2' @on-visible-change='treeVisibleChange2'></v-powerTree>
    </div>
</template>
<script>
import {
    getRoleList,
    // createRole,
    // editRole,
    // delRole
} from '../../api/api';
import vRoletree from '../../components/common/roletree';
import vPowerTree from '../../components/common/powerTree.vue';
// import vYvoption from '../../common/yvoption.vue';
// import {validNum} from '../../../utils/validator.js';
const code = '200';
export default {
    layout: 'home',
    data() {
            return {
                cantDelIds:[1],
                menuFormVisible:false,
                menuFormVisible2:false,
                menuRoleId:'',
                tableData: [],
                pageIndex: 1,
                pageSize: 10,
                totalCount: 0,
                loading: false,
                sels: [],
                //form数据
                formTittle: '',
                formVisible: false,
                queryParam: {
                    id: '',
                    name: '',
                    orgId:''
                },
                subform:{},
                initform: {
                    id: '',
                    name: '',
                    isSys: '',
                    orgId:'',
                    level:'',
                    createTime:'',
                    createBy:'',
                    remark: ''
                },
                formRules: {
                    name: [{
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
                formLoading: false
            }
        },
        components:{
            vRoletree,
            // vYvoption,
            vPowerTree
        },
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
            handleSizeChange(val) {
                this.pageSize=val;
                this.getRoleList();
              },
            treeVisibleChange(val){
                this.menuFormVisible=val;
            },
             treeVisibleChange2(val){
                this.menuFormVisible2=val;
            },
            isFormatter(row, column) {
                return row.isSys == 0 ? '否' : row.isSys == 1 ? '是' : '未知';
            },
            handleAdd(index, row) {
                this.formVisible = true;
                this.$nextTick(function() {
                    this.subform = Object.assign({}, this.initform);
                    this.$refs['subform'].resetFields();
                    this.formTittle = "新增"
                })
            },
            handleEdit(index, row) {
                this.formVisible = true;
                this.$nextTick(function() {
                    this.$refs['subform'].resetFields();
                    this.subform = Object.assign({}, row);
                    this.formTittle = "编辑"
                })
            },
            handleMenu(index, row) {
                this.menuRoleId = row.id.toString();
                this.menuFormVisible = true;
            },
            handleMenuPower(index,row){
                this.menuRoleId = row.id.toString();
                this.menuFormVisible2 = true;
            },
            handleDelete(index, row) {
                this.$confirm('确认删除该记录吗?', '提示', {
                    type: 'warning'
                }).then(() => {
                    let param = {
                        ids: row.id
                    };
                    delRole(param).then((res) => {
                        if (res.data.code == code) {
                            this.formVisible = false;
                            this.getRoleList();
                            this.$message.success("删除成功");
                        } else {
                            this.$message.error(res.data.message);
                        }
                    });
                }).catch(() => {

                });
            },
            getRoleList() {
                this.$refs["queryform"].validate((valid) => {
                    if (valid) {
                        this.loading = true;
                        const self = this;
                        let params = {
                            page: this.pageIndex,
                            size: this.pageSize,
                            id: this.queryParam.id,
                            orgId: this.queryParam.orgId,
                            name: this.queryParam.name
                        }
                        getRoleList(params).then((res) => {
                            this.loading = false;
                            if (res.data.code == code) {
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
            handleCurrentChange(val) {
                this.pageIndex = val;
                this.getRoleList()
            },
            formSubmit() {
                this.$refs["subform"].validate((valid) => {
                    if (valid) {
                        this.formLoading = true;
                        let param = Object.assign({}, this.subform);
                        if (param.id != "") {
                            editRole(param).then((res) => {
                                this.formLoading = false;
                                if (res.data.code == code) {
                                    this.$message.success("保存成功");
                                    this.formVisible = false;
                                    this.getRoleList();
                                } else {
                                    this.$message.error(res.data.message);
                                }
                            });
                        } else {
                            createRole(param).then((res) => {
                                this.formLoading = false;
                                if (res.data.code == code) {
                                    this.$message.success("保存成功");
                                    this.formVisible = false;
                                    this.getRoleList();
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
                    delRole(param).then((res) => {
                        if (res.data.code == code) {
                            this.getRoleList();
                            this.$message.success("删除成功");
                        } else {
                            this.$message.error(res.data.message);
                        }
                    });
                }).catch(() => {

                });
            }
        },

        mounted: function() {
            this.getRoleList()
        }
}
</script>
<style>
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
}

.avatar-uploader .el-upload:hover {
    border-color: #20a0ff;
}

.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
}

.avatar {
    width: 178px;
    height: 178px;
    display: block;
}
</style>

