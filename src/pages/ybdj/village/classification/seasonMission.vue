<route-meta>
{
  "requiresAuth": true,
  "name":"组织建设 / 分类定级 / 季度任务完成情况",
  "parent":"首页 / 组织领导"
}
</route-meta>
<template>
    <div class="log">
        <div class="search">
            <div class="btnSearch">
                <el-button @click='goBack'>返回</el-button>
                <el-button v-if="list.list&&list.list[0].queryQuarterInfoRecord.quarterSubmitStatus==0" type='success'
                    @click="updateReform">上报</el-button>
            </div>

        </div>
        <div class="table-wrapper">
            　　　　<h1 class="detail_h1">{{$route.query.year}}年第{{$route.query.season}}季度任务完成情况</h1>
            <el-table ref="multipleTable" :data="list.list" tooltip-effect="dark" v-loading="loadingOne">
                <el-table-column prop="name" label="工作举措" show-overflow-tooltip min-width="150"></el-table-column>
                <el-table-column prop="content" label="要求" show-overflow-tooltip min-width="150"></el-table-column>
                <el-table-column prop="deadLine" label="完成时限" show-overflow-tooltip min-width="150">
                    <template slot-scope="scope">
                        <span style="">{{ scope.row.deadLine|date }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="responsiblePerson" label="责任人" show-overflow-tooltip min-width="150">
                </el-table-column>
                <el-table-column prop="queryQuarterInfoRecord.quarterInfo" label="完成比例" show-overflow-tooltip
                    min-width="150"></el-table-column>
                <el-table-column prop="queryQuarterInfoRecord.quarterContent" label="状态描述" show-overflow-tooltip
                    min-width="150"></el-table-column>
                <el-table-column label="操作" width="225px"
                    v-if="list.list&&list.list[0].queryQuarterInfoRecord.quarterSubmitStatus==0">
                    <template slot-scope="scope">
                        <el-popover placement="right" width="100%" trigger="hover">
                            <el-table :data="scope.row.quarterInfoRecordList">
                                <el-table-column min-width="120" property="quarter" label="季度"></el-table-column>
                                <el-table-column min-width="120" property="quarterInfo" label="完成比例"></el-table-column>
                                <el-table-column min-width="300" property="quarterContent" label="状态描述">
                                </el-table-column>
                                <el-table-column min-width="150" property="quarterSubmitTime" label="上报日期">
                                    <template slot-scope="scope">
                                        <span style="">{{ scope.row.quarterSubmitTime|date }}</span>
                                    </template>
                                </el-table-column>
                            </el-table>
                            <el-button slot="reference" size="mini" type="primary"
                                @click="addModel(scope.$index, scope.row)">更新状态</el-button>
                        </el-popover>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <!--批量删除-->
        <div class="block">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                :current-page.sync="currentPage1" :page-size=query.size :page-sizes="[10, 20, 30, 50]"
                layout="total, sizes, prev,  pager, next" :total=list.total>
            </el-pagination>
        </div>

        <!--新增模态框-->
        <el-dialog :title="dialogTitle" :visible.sync="dialogVisible">
            <el-form label-width="120px" :model="newQuerys" ref="addQuery" :rules="rules" id="checkScreen">
                <el-row>
                    <el-col :span='12'>
                        <el-form-item label="完成比例" prop="quarterInfo">
                            <el-select v-model="newQuerys.quarterInfo" clearable filterable>
                                <v-yvoption groupName="quarterInfo"></v-yvoption>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span='24'>
                        <el-form-item label="状态描述" prop="quarterContent">
                            <el-input type="textarea" :rows=5 v-model="newQuerys.quarterContent" auto-complete="off">
                            </el-input>
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
        // getPartyOrgGradationSolutions as get,
        // putPartyOrgGradationSolutions as put,
        // putPartyOrgGradationSolutionsSubmit as putTwo
    } from "../../../../api/villageApi";

    const code = "200";
    import vYvoption from "../../../../components/common/yvoption";
    export default {
        layout:'home',
        data() {
            return {
                query: {
                    size: 10,
                    page: 1,
                    quarter: this.$route.query.season,
                    year: this.$route.query.year
                },
                addQuery: {
                    content: "",
                    createTime: "",
                    deadLine: "",
                    deadLineQuarter: "",
                    id: "",
                    isDeleted: "",
                    name: "",
                    partyOrgId: "",
                    quarter1Content: "",
                    quarter1Info: "",
                    quarter1Status: "",
                    quarter1SubmitStatus: "",
                    quarter1SubmitTime: "",
                    quarter2Content: "",
                    quarter2Info: "",
                    quarter2Status: "",
                    quarter2SubmitStatus: "",
                    quarter2SubmitTime: "",
                    quarter3Content: "",
                    quarter3Info: "",
                    quarter3Status: "",
                    quarter3SubmitStatus: "",
                    quarter3SubmitTime: "",
                    quarter4Content: "",
                    quarter4Info: "",
                    quarter4Status: "",
                    quarter4SubmitStatus: "",
                    quarter4SubmitTime: "",
                    responsiblePerson: "",
                    yearStatus: "",
                    yearStatusInfo: "",
                    year: this.$route.query.year
                },
                rules: {
                    quarterInfo: [{
                        required: true,
                        message: "请输入",
                        trigger: "blur"
                    }],
                    quarterContent: [{
                        required: true,
                        message: "请输入",
                        trigger: "blur"
                    }],
                },
                initQuery: {
                    id: 0,
                    quarter: this.$route.query.season,
                    quarterContent: "",
                    quarterInfo: ""
                },
                newQuerys: {

                },
                sells: [],
                list: {},
                dialogVisible: false,
                currentPage1: 1,
                dialogTitle: "",
                loadingOne: false,
                loadingTwo: false,
                imgUrl: ""
            };
        },
        components: {
            vYvoption,

        },
        methods: {
            updateReform() {
                let that = this;
                this.$confirm("此操作将上报本季度完成情况, 是否继续?", "提示", {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        type: "warning"
                    })
                    .then(() => {
                        putTwo({
                                year: this.$route.query.year,
                                quarter: this.$route.query.season
                            })
                            .then(res => {
                                if (res.data.code == code) {
                                    this.$message({
                                        type: "success",
                                        message: res.data.message
                                    });
                                    this.getSearchList();
                                    // setTimeout(() => {
                                        that.$router.back(-1)
                                    // }, 2000);

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
                                    message: "网络故障,请重试或者联系管理员！！"
                                });
                            });
                    })



            },
            goBack() {
                this.$router.back(-1)
            },
            getSearchList() {
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
            addModel(index, row) {
                this.dialogVisible = true;
                this.$nextTick(function () {
                    this.newQuerys = Object.assign({}, this.initQuery);
                    this.newQuerys.id = row.id;
                    this.$refs["addQuery"].resetFields();
                    this.dialogTitle = "更新状态";
                });
            },
            handleCreate() {
                this.$refs["addQuery"].validate(valid => {
                    if (valid) {
                        this.loadingTwo = true;
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

    .btnSearch {
        margin-bottom: 10px;
    }

    .detail_h1 {
        font-size: 2rem;
        padding: 0 0 20px 0;
        color: #111;
        line-height: 1.4;
        word-wrap: break-word;
        text-align: center;
    }

</style>
