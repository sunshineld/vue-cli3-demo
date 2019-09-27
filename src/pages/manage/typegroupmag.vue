<route-meta>
{
  "requiresAuth": true,
  "name":"数据字典",
  "parent":"基础数据"
}
</route-meta>
<template>
    <div class="table">
		<!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true" :rules="queryRules" ref="queryform" :model="queryParam">
                <el-form-item label="编号">
                    <el-input v-model="queryParam.id" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="成果类型">
                    <el-input v-model="queryParam.groupName" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="getTypeGroupList">查询</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleAdd">新增</el-button>
                </el-form-item>
            </el-form>
        </el-col>
        <el-table :data="tableData" border style="width: 100%" v-loading.body="loading" @selection-change="selsChange">
            <el-table-column type="selection" width="70"></el-table-column>
             <el-table-column prop="id" label="主键ID"></el-table-column>
             <el-table-column prop="groupName" label="类型名称"></el-table-column>
             <el-table-column prop="groupCode" label="类型编码"></el-table-column>
            <el-table-column label="操作" width="200">
                <template slot-scope="scope">
                    <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-row type="flex" justify="space-between" style="margin-top:10px">
            <el-col :span='12'>
                <el-button type="danger" @click="batchRemove">批量删除</el-button>
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
                        <el-form-item label="主键ID" prop="id">
                            <el-input v-model="subform.id" auto-complete="off" disabled></el-input>
                        </el-form-item>
                    </el-col>
                <el-col :span='12'>
                        <el-form-item label="类型名称" prop="groupName">
                            <el-input v-model="subform.groupName" auto-complete="off"></el-input>
                        </el-form-item>
                    </el-col>
                <el-col :span='12'>
                        <el-form-item label="类型编码" prop="groupCode">
                            <el-input v-model="subform.groupCode" auto-complete="off"></el-input>
                        </el-form-item>
                    </el-col>
            </el-row>
            </el-form>

            <!--工具条-->
            <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
                <el-form :inline="true">
                    <el-form-item>
                        <el-button type="primary" @click="subHandleAdd">新增</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
            <el-table :data="subTableData" border style="width: 100%" v-loading.body="loading">
                 <el-table-column prop="typeName" label="名称">
                     <template slot-scope="scope">
                        <el-input v-model="scope.row.typeName" auto-complete="off"></el-input>
                      </template>
                 </el-table-column>
                 <el-table-column prop="typeCode" label="代码">
                     <template slot-scope="scope">
                        <el-input v-model="scope.row.typeCode" auto-complete="off"></el-input>
                      </template>
                 </el-table-column>
                 <el-table-column prop="status" label="状态">
                     <template slot-scope="scope">
                        <el-select v-model="scope.row.status" placeholder="请选择状态">
                                <el-option label="停用" value=0></el-option>
                                <el-option label="启用" value=1></el-option>
                         </el-select>
                      </template>
                 </el-table-column>
                <el-table-column label="操作" width="200">
                    <template slot-scope="scope">
                        <el-button size="small" @click="subHandleSave(scope.$index, scope.row)">保存</el-button>
                        <el-button size="small" type="danger" @click="subHandleDelete(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="formVisible = false">取消</el-button>
                <el-button type="primary" @click.native="formSubmit" :loading="formLoading">提交</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import {
    // createTypeGroup,
    // createType,
    getTypeGroupList,
    // getTypeList,
    // editTypeGroup,
    // editType,
    // delTypeGroup,
    // delType,
    // base
} from '../../api/api';
const code = '200'
export default {
    layout:'home',
    data() {
            return {
                tableData: [],
                subTableData:[],
                pageIndex: 1,
                pageSize: 50,
                totalCount: 0,
                loading: false,
                sels: [],
                //form数据
                formTittle: '',
                formVisible: false,
                queryParam: {
                    id: '',
                    groupName: ''
                },
                subform: {
                   id:'',
                   groupName:'',
                   groupCode:'',
                },
                formRules: {

                },
                queryRules: {
                    id: [{
                        trigger: 'blur'
                    }],
                },
                formLoading: false
            }
        },
        methods: {
            handleSizeChange(val) {
                this.pageSize=val;
                this.getTypeGroupList();
              },
            subHandleAdd(index, row) {
                if(this.subform.id == ''){
                    this.$message.error("请先保存主数据");
                }else{
                    this.subTableData.push({id:'',typeName:'',typeCode:'',typeGroupId:this.subform.id,status:'1'});
                }
            },
            subHandleSave(index, row) {
                var data = Object.assign({}, row);
                if(data.id == ''){
                    createType(data).then((res) => {
                        if (res.data.code == code) {
                            this.$message.success("保存成功");
                            this.getTypeList(row.typeGroupId);
                        } else {
                            this.$message.error(res.data.message);
                        }
                    });
                }else{
                    editType(data).then((res) => {
                        if (res.data.code == code) {
                            this.$message.success("保存成功");
                        } else {
                            this.$message.error(res.data.message);
                        }
                    });
                }
            },
            subHandleDelete(index, row) {
                this.$confirm('确认删除该记录吗?', '提示', {
                    type: 'warning'
                    }).then(() => {
                        let param = {
                            ids: row.id
                        };
                        delType(param).then((res) => {
                            if (res.data.code == code) {
                                this.$message.success("删除成功");
                                this.getTypeList(row.typeGroupId);
                            } else {
                                this.$message.error(res.data.message);
                            }
                        });
                    }).catch(() => {

                    });
            },

            handleAdd(index, row) {
                this.formVisible = true;
                this.upPercentage = 0;
                this.upFlag = '';
                this.subTableData=[];
                this.subform = {
                    id:'',
                    groupName:'',
                    groupCode:'',
                };
                this.formTittle = "新增"
            },
            handleEdit(index, row) {
                this.formVisible = true;
                //this.$refs['subform'].resetFields();
                this.subform = Object.assign({}, row);
                this.formTittle = "编辑"
                this.getTypeList(this.subform.id);
            },
            handleDelete(index, row) {
                this.$confirm('确认删除该记录吗?', '提示', {
                    type: 'warning'
                }).then(() => {
                    let param = {
                        ids: row.id
                    };
                    delTypeGroup(param).then((res) => {
                        if (res.data.code == code) {
                            this.formVisible = false;
                            this.getTypeGroupList();
                            this.$message.success("删除成功");
                        } else {
                      this.$message.error(res.data.message);
                        }
                    });
                }).catch(() => {

                });
            },
            getTypeGroupList() {
                this.$refs["queryform"].validate((valid) => {
                    if (valid) {
                        this.loading = true;
                        const self = this;
                        let params = {
                            page: this.pageIndex,
                            size: this.pageSize,
                            id: this.queryParam.id,
                            groupName: this.queryParam.groupName
                        }
                        getTypeGroupList(params).then((res) => {
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

            getTypeList(id){
                const self = this;
                let params2 = {
                    page: this.pageIndex,
                    size: this.pageSize,
                    typeGroupId: id,
                }
                getTypeList(params2).then((res) => {
                    if (res.data.code == code) {
                        this.subTableData = res.data.data.list;
                        var data = this.subTableData;
                        for(var o in data){
                            data[o].status=data[o].status.toString();
                          }
                    } else {
                        self.$message.error(res.data.message);
                    }
                }).catch(function(error) {
                    self.$message.error('网络故障，请稍后再试');
                });
            },
            handleCurrentChange(val) {
                this.pageIndex = val;
                this.getTypeGroupList()
            },
            formSubmit() {
                this.$refs["subform"].validate((valid) => {
                    if (valid) {
                        this.formLoading = true;
                        let param = Object.assign({}, this.subform);
                        if (param.id != "") {
                            editTypeGroup(param).then((res) => {
                                this.formLoading = false;
                                if (res.data.code == code) {
                                    this.$message.success("保存成功");
                                    this.formVisible = false;
                                    this.getTypeGroupList();
                                } else {
                                    this.$message.error(res.data.message);
                                }
                            });
                        } else {
                            createTypeGroup(param).then((res) => {
                                this.formLoading = false;
                                if (res.data.code == code) {
                                    this.$message.success("保存成功");
                                    this.formVisible = false;
                                    this.getTypeGroupList();
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
                    delTypeGroup(param).then((res) => {
                        if (res.data.code == code) {
                            this.getTypeGroupList();
                            this.$message.success("删除成功");
                        } else {
                            this.$message.error(res.data.message);
                        }
                    });
                }).catch(() => {

                });
            },
        },

        mounted: function() {
            this.getTypeGroupList()
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
.el-table__body-wrapper {
    overflow: inherit;
}
</style>
