<route-meta>
{
  "requiresAuth": true,
  "name":"日志管理",
  "parent":"系统管理"
}
</route-meta>
<template>
    <div class="log">
        <div class="search">
            <el-form class="form" :inline="true"  :model="query" ref="search">
                <el-form-item label="编号">
                    <el-input v-model="query.id"  placeholder="请输入编号"></el-input>
                </el-form-item>
                <el-form-item label="操作人姓名">
                    <el-input v-model="query.userName"  placeholder="请输入操作人姓名"></el-input>
                </el-form-item>
                <el-form-item label="操作描述">
                    <el-input v-model="query.operation"  placeholder="请输入操作描述"></el-input>
                </el-form-item>
                <el-form-item>
                    <div class="btnSearch">
                        <el-button  type="primary" @click="getSearch" :loading="loadingOne">查询</el-button>
                    </div>
                </el-form-item>
            </el-form>
        </div>
        <div class="table-wrapper" >
            <el-table  ref="multipleTable" :data="list.list"  v-loading="loadingOne" tooltip-effect="dark"  @selection-change="handleSelectionChange">
                <el-table-column type="selection"  width="70" >
                </el-table-column>
                <el-table-column prop="userName" label="操作人" show-overflow-tooltip >
                </el-table-column>
                <el-table-column  prop="operation" label="操作描述"  show-overflow-tooltip >
                </el-table-column>
                <el-table-column  label="操作时间" show-overflow-tooltip >
                    <template slot-scope="scope">{{ scope.row.operateTime | date('yyyy-MM-dd hh:mm:ss') }}</template>
                </el-table-column>
                <el-table-column  label="操作" width="225px">
                    <template slot-scope="scope">
                        <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">查看</el-button>
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
        <!--查看模态框-->
        <el-dialog :title="dialogTitle"  :visible.sync="dialogVisible" >
            <el-form  label-width="90px" :model="newQuerys" ref="addQuery">
                <el-row>
                    <el-col :span='12'>
                        <el-form-item label="编号" prop="id">
                            <el-input type="number" v-model="newQuerys.id" auto-complete="off" disabled></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="操作时间" prop="operateTime">
                            <el-date-picker type="datetime" placeholder="选择操作时间" v-model="newQuerys.operateTime" disabled></el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="操作人" prop="userName">
                            <el-input  v-model="newQuerys.userName" placeholder="输入操作人"  auto-complete="off" disabled></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="操作描述" prop="operation">
                            <el-input v-model="newQuerys.operation" auto-complete="off" placeholder="输入操作描述" disabled></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="请求参数" prop="reqParam">
                            <el-input  v-model="newQuerys.reqParam" placeholder="输入请求参数"  auto-complete="off" disabled></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="IP" prop="ip">
                            <el-input v-model="newQuerys.ip" auto-complete="off" disabled></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>

            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import {
        // delSysLogs as del,
        getSysLogs as get,
    } from '../../api/api';

    const code = "200";

    export default {
        layout: 'home',
        data() {
            return {
                query:{
                    id:'',
                    userName:'',
                    operation:'',
                    size:10,
                    page:1
                },
                newQuerys:{},
                sells:[],
                list:{},
                dialogVisible:false,
                currentPage1:1,
                dialogTitle:'',
                loadingOne:false,
                loadingTwo:false,

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
            handleSelectionChange(val) {
                this.sells = val;
            },
            handleEdit(index,row){
                this.dialogVisible = true;
                this.$nextTick(function() {
                    this.newQuerys = Object.assign({}, row);
                    this.dialogTitle = "查看";
                    this.newQuerys.operateTime = new Date(this.newQuerys.operateTime)
                })
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

</style>
