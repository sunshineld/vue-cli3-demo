<template>
    <div class="log">
        <div class="search">
            <el-form class="form" :inline="true" :model="query" ref="search">
                <el-form-item label="年度">
                    <el-input v-model="query.year" placeholder="年度"></el-input>
                </el-form-item>
                <el-form-item label="荣誉名称">
                    <el-input v-model="query.name" placeholder="请输入荣誉名称"></el-input>
                </el-form-item>
                <el-form-item label="表彰类型" prop="type">
                    <el-select v-model="query.type" filterable clearable placeholder="请选择表彰类型">
                        <v-yvoption groupName="awartType"></v-yvoption>
                    </el-select>
                </el-form-item>
                <el-form-item label="授奖单位">
                    <el-input v-model="query.awardUnitName" placeholder="请输入授奖单位"></el-input>
                </el-form-item>
                <el-form-item label="荣誉层级">
                    <el-select v-model="query.level" clearable filterable placeholder="请选择荣誉层级">
                        <v-yvoption groupName="honorType" :disabledIds='[6]'></v-yvoption>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <div class="btnSearch">
                        <el-button type="primary" @click="getSearchList" v-loading="loadingOne">查询</el-button>
                        <el-button type="primary" @click="addModel">新建</el-button>
                    </div>
                </el-form-item>
            </el-form>
        </div>
        <div class="table-wrapper">
            <el-table ref="multipleTable" :data="list.list" tooltip-effect="dark"
                @selection-change="handleSelectionChange" v-loading="loadingOne">
                <el-table-column type="selection" width="70"></el-table-column>
                <el-table-column prop="name" label="荣誉名称" show-overflow-tooltip min-width="200"></el-table-column>
                <el-table-column prop="awardUnitName" label="授奖单位" show-overflow-tooltip min-width="200">
                </el-table-column>
                <el-table-column prop="typeZh" label="表彰类型" show-overflow-tooltip min-width="150"></el-table-column>
                <el-table-column prop="levelZh" label="荣誉层级" show-overflow-tooltip min-width="150"></el-table-column>
                <el-table-column prop="eventTime" label="荣誉时间" show-overflow-tooltip min-width="220">
                    <template slot-scope="scope">
                        <span style="">{{ scope.row.eventTime|date }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="checkStatusZh" label="审核状态" show-overflow-tooltip min-width="200">
                </el-table-column>
                <el-table-column label="操作" min-width="285px">
                    <template slot-scope="scope">
                        <el-button size="mini" type='warning' v-if='scope.row.checkStatus==1'
                            @click="handleCheck(scope.$index, scope.row)">重新送审</el-button>
                        <el-button size="mini" type='warning' v-if='scope.row.checkStatus==0'
                            @click="handleCheck(scope.$index, scope.row)">送审</el-button>
                        <el-button size="mini" v-if="scope.row.checkStatus==0||scope.row.checkStatus==1" @click="handleEdit(scope.$index, scope.row,false)">编辑</el-button>
                        <el-button size="mini" v-if="scope.row.checkStatus==4||scope.row.checkStatus==5" @click="handleEdit(scope.$index, scope.row,true)">详情</el-button>
                        <el-button size="mini" type="danger" v-if='scope.row.checkStatus==0' @click="handleDelete(scope.$index, scope.row)">删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <!--批量删除-->
        <div class="block">
            <el-button type="danger" @click="removeAll">批量删除</el-button>
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                :current-page.sync="currentPage1" :page-size=query.size :page-sizes="[10, 20, 30, 50]"
                layout="total, sizes, prev,  pager, next" :total=list.total>
            </el-pagination>
        </div>


        <!--新增模态框-->
        <el-dialog :title="dialogTitle" :visible.sync="dialogVisible">
            <el-form label-width="120px" :model="newQuerys" ref="addQuery" :rules="rules" :disabled="formDisabled">
                <el-row>
                    <el-col :span='12'>
                        <el-form-item label="荣誉名称" prop="name">
                            <el-input v-model="newQuerys.name" auto-complete="off"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span='12'>
                        <el-form-item label="授奖单位名称" prop="awardUnitName">
                            <el-input v-model="newQuerys.awardUnitName" auto-complete="off"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span='12'>
                        <el-form-item label="表彰类型" prop="type">
                            <el-select v-model="newQuerys.type" filterable placeholder="请选择表彰类型">
                                <v-yvoption groupName="awartType"></v-yvoption>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span='12'>
                        <el-form-item label="荣誉层级" prop="level">
                            <el-select v-model="newQuerys.level" clearable filterable placeholder="请选择荣誉层级">
                                <v-yvoption groupName="honorType" :disabledIds='[6]'></v-yvoption>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span='12'>
                        <el-form-item label="荣誉时间" prop="eventTime">
                            <el-date-picker type="date" placeholder="选择日期" v-model="newQuerys.eventTime">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span='12'>
                        <el-form-item label="相关文号">
                            <el-input v-model="newQuerys.documentNumber" auto-complete="off"></el-input>
                        </el-form-item>
                    </el-col>

                    <el-col :span='24'>
                        <el-form-item label="介绍">
                            <el-input type="textarea" :rows=5 v-model="newQuerys.info" auto-complete="off"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span='24'>
                        <el-form-item label="荣誉图片" prop="imgs">
                            <imgsUpload :imageUrl="newQuerys.imgsAccess" v-model="newQuerys.imgs" :dis="formDisabled"></imgsUpload>
                        </el-form-item>
                    </el-col>
                    <el-col :span='12' v-if="newQuerys.id">
                        <el-form-item label="审核状态">
                            {{newQuerys.checkStatusZh?newQuerys.checkStatusZh:"未上报"}}
                        </el-form-item>
                    </el-col>
                    <el-col :span='12' v-if='newQuerys.checkStatus!=0'>
                        <el-form-item label="送审时间">
                            <el-date-picker type="date" disabled v-model="newQuerys.submitTime"></el-date-picker>
                        </el-form-item>
                    </el-col>
                    <div v-if="newQuerys.checkStatus==1||newQuerys.checkStatus==5">
                        <el-col :span='12'>
                            <el-form-item label="审核时间">
                                <el-date-picker type="date" disabled v-model="newQuerys.checkTime"></el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span='24'>
                            <el-form-item label="备注">
                                {{newQuerys.statusInfo}}
                            </el-form-item>
                        </el-col>
                    </div>
                </el-row>
            </el-form>

            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="handleCreate" v-if="newQuerys.checkStatus==0||newQuerys.checkStatus==1" :loading="loadingTwo">确 定</el-button>
            </div>
        </el-dialog>


    </div>

</template>

<script>
    import {
        // delPartyOrgHonors as del,
        // getPartyOrgHonors as get,
        // postPartyOrgHonors as post,
        // putPartyOrgHonors as put,
        // sendCheckPartyOrgHonors
    } from '../../api/villageApi';

    const code = "200";
    import vYvoption from '../common/yvoption.vue';
    import imgsUpload from "../common/imgsUpload";

    export default {
        data() {
            return {
                query: {
                    year: new Date().getFullYear(),
                    name: "",
                    type: "",
                    awardUnitName: "",
                    level: "",
                    size: 10,
                    page: 1
                },
                addQuery: {
                    id: '',
                    partyOrgId: '',
                    createOrgId: '',
                    name: '',
                    awardUnitName: '',
                    type: '',
                    level: '',
                    eventTime: '',
                    documentNumber: '',
                    info: '',
                    imgs: '',
                    submitTime: '',
                    checkTime: '',
                    checkStatus: 0,
                    statusInfo: '',
                    createTime: '',
                    isDeleted: '',
                },
                rules: {
                    name: [{
                        required: true,
                        message: "此项必填",
                        trigger: "blur"
                    }, {
                        max: 255,
                        message: '长度错误!',
                        trigger: 'blur'
                    }],
                    awardUnitName: [{
                        required: true,
                        message: "此项必填",
                        trigger: "blur"
                    }, {
                        max: 255,
                        message: '长度错误!',
                        trigger: 'blur'
                    }],
                    type: [{
                        required: true,
                        message: "此项必填",
                        trigger: "blur"
                    }],
                    level: [{
                        required: true,
                        message: "此项必填",
                        trigger: "blur"
                    }],
                    eventTime: [{
                        required: true,
                        message: "此项必填",
                        trigger: "blur"
                    }],
                    documentNumber: [{
                        max: 255,
                        message: '长度错误!',
                        trigger: 'blur'
                    }],
                    info: [{
                        max: 65535,
                        message: '长度错误!',
                        trigger: 'blur'
                    }],
                    imgs: [{
                        required: true,
                        message: "此项必填",
                        trigger: "blur"
                    }, {
                        max: 65535,
                        message: '长度错误!',
                        trigger: 'blur'
                    }],
                    statusInfo: [{
                        max: 255,
                        message: '长度错误!',
                        trigger: 'blur'
                    }],
                },
                newQuerys: {},
                sells: [],
                list: {},
                dialogVisible: false,
                currentPage1: 1,
                dialogTitle: '',
                loadingOne: false,
                loadingTwo: false,
                formDisabled:false
            }
        },
        components: {
            vYvoption,
            imgsUpload
        },
        methods: {
            handleCheck(index, row) {
                this.$confirm("将上报上级审核,审核过程中无法修改数据，是否继续?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }).then(() => {
                    sendCheckPartyOrgHonors({
                        id: row.id
                    }).then((res) => {
                        if (res.data.code == code) {
                            this.$message({
                                type: 'success',
                                message: "送审成功"
                            });
                            this.getSearchList();
                        } else {
                            this.$message({
                                type: 'error',
                                message: res.data.message
                            });
                        }
                    }).catch(() => {
                        this.loadingOne = false;
                        this.$message({
                            type: 'error',
                            message: "送审失败，请稍后再试！"
                        });
                    })

                })

            },
            getSearchList() {
                this.loadingOne = true;
                get(this.query).then((res) => {
                    this.loadingOne = false;
                    if (res.data.code == code) {
                        this.list = res.data.data;
                    } else {
                        this.$message({
                            type: 'error',
                            message: res.data.message
                        });
                    }
                }).catch(() => {
                    this.loadingOne = false;
                    this.$message({
                        type: 'error',
                        message: "查询失败,请重试或者联系管理员！！"
                    });
                })
            },
            addModel() {
                this.dialogVisible = true;
                this.formDisabled=false;
                this.$nextTick(function () {
                    this.$refs['addQuery'].resetFields();
                    this.newQuerys = Object.assign({}, this.addQuery);
                    this.dialogTitle = "新增";
                })
            },
            handleSelectionChange(val) {
                this.sells = val;
            },
            handleEdit(index, row,disabled) {
                this.formDisabled = disabled;
                this.dialogVisible = true;
                this.$nextTick(function () {
                    this.$refs['addQuery'].resetFields();
                    this.newQuerys = Object.assign({}, row);
                    this.dialogTitle = "编辑";
                })

            },
            handleCreate() {
                this.$refs["addQuery"].validate((valid) => {
                    if (valid) {
                        this.loadingTwo = true;
                        if (this.newQuerys.id == 0) {
                            post(this.newQuerys)
                                .then((res) => {
                                    this.loadingTwo = false;
                                    if (res.data.code == code) {
                                        this.$message({
                                            message: "新增成功",
                                            type: 'success'
                                        });
                                        this.dialogVisible = false;
                                        this.getSearchList();
                                    } else {
                                        this.$message({
                                            message: res.data.message,
                                            type: 'warning'
                                        });
                                    }
                                }).catch(() => {
                                    this.loadingTwo = false;
                                    this.$message({
                                        type: 'error',
                                        message: "新增失败,请重试或者联系管理员！！"
                                    });
                                });
                        } else {
                            put(this.newQuerys)
                                .then((res) => {
                                    this.loadingTwo = false;
                                    if (res.data.code == code) {
                                        this.$message({
                                            message: "编辑成功",
                                            type: 'success'
                                        });
                                        this.dialogVisible = false;
                                        this.getSearchList();
                                    } else {
                                        this.$message({
                                            message: res.data.message,
                                            type: 'warning'
                                        });
                                    }
                                }).catch(() => {
                                    this.loadingTwo = false;
                                    this.$message({
                                        type: 'error',
                                        message: "编辑失败,请重试或者联系管理员！！"
                                    });
                                });
                        }
                    }
                });
            },
            handleDelete(index, row) {
                this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    del({
                        ids: row.id
                    }).then((res) => {
                        if (res.data.code == code) {
                            this.getSearchList();
                            this.$message({
                                type: 'success',
                                message: '删除成功!'
                            });
                        } else {
                            this.$message({
                                message: res.data.message,
                                type: 'warning'
                            });
                        }
                    }).catch(() => {
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
            removeAll() {
                let ids = this.sells.map(item => item.id).toString();
                if (ids == '') {
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
                    del({
                        ids: ids
                    }).then((res) => {
                        if (res.data.code == code) {
                            this.getSearchList();
                            this.$message({
                                type: 'success',
                                message: '删除成功!'
                            });
                        } else {
                            this.$message({
                                message: res.data.message,
                                type: 'warning'
                            });
                        }
                    }).catch(() => {
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
        },
        mounted() {
            // this.getSearchList();
        },
    }

</script>

<style scoped>
    .el-pagination {
        float: right;
    }

    .block {
        padding: 10px 0;
    }

</style>
