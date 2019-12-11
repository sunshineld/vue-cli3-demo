<route-meta>
{
  "requiresAuth": true,
  "name":"组织建设 / 分类定级 / 自评上报",
  "parent":"首页 / 组织领导"
}
</route-meta>
<template>
    <div id="selfReport">
            <el-row>
                    <el-col :span='12'>
                        <el-button icon="el-icon-back" @click="$router.go(-1)">返回</el-button>
                    </el-col>
            </el-row>

            <el-form label-width="160px" :model="newQuerys" :rules="rules" ref="addQuery" :disabled="newQuerys.checkStatus==4 || newQuerys.checkStatus==5">
            <el-row>
                <el-col :span='8'>
                    <el-form-item label="年度" prop="year">
                        <el-input  v-model="newQuerys.year" auto-complete="off" disabled></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span='8'>
                    <el-form-item label="群众代表初评时间" prop="massRankTime">
                        <el-date-picker type="date" placeholder="选择初评时间" v-model="newQuerys.massRankTime"></el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :span='8'>
                    <el-form-item label="初评结果" prop="massRank">
                        <el-select v-model="newQuerys.massRank" clearable filterable placeholder="选择初评结果">
                            <v-yvoption groupName="selfEvaluationResult"></v-yvoption>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row>
                <el-col :span='8'>
                    <el-form-item label="党员大会评议时间" prop="meetingRankTime">
                        <el-date-picker type="date" placeholder="选择初评时间" v-model="newQuerys.meetingRankTime"></el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :span='8'>
                    <el-form-item label="评议结果" prop="meetingRank">
                        <el-select v-model="newQuerys.meetingRank" clearable filterable placeholder="选择评议结果">
                            <v-yvoption groupName="selfEvaluationResult"></v-yvoption>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row>
                <el-col :span='8'>
                    <el-form-item label="村党组织自评时间" prop="selfRankTime">
                        <el-date-picker type="date" placeholder="选择初评时间" v-model="newQuerys.selfRankTime"></el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :span='8'>
                    <el-form-item label="自评结论" prop="selfRank">
                        <el-select v-model="newQuerys.selfRank" clearable filterable placeholder="选择自评结论">
                            <v-yvoption groupName="selfEvaluationResult"></v-yvoption>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span='18'>
                    <el-form-item label="评定理由" prop="rankInfo">
                        <el-input type="textarea" :rows=6 v-model="newQuerys.rankInfo" auto-complete="off"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row v-if="newQuerys.selfRank==3">
                <el-col :span='18'>
                    <el-form-item label="存在问题" prop="selfRankSlacknessIssuesAccess">
                        <el-checkbox-group v-model="newQuerys.selfRankSlacknessIssuesAccess">
                            <el-checkbox v-for="item in weakOption" :label="item" :key="item"></el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row v-if="newQuerys.checkStatus==4 || newQuerys.checkStatus==5">
                <el-col :span='18'>
                    <el-form-item label="上报时间" prop="submitTime">
                        <el-date-picker type="datetime"  v-model="newQuerys.submitTime"></el-date-picker>
                    </el-form-item>
                </el-col>
            </el-row>
            
            <div class="el-divider el-divider--horizontal"></div>
            </el-form>

            <el-col :span="24" style="text-align: center;padding-bottom: 20px;">
                    <el-button type="success" v-if="newQuerys.checkStatus==0" @click="report">上 报</el-button>
                    <el-button type="primary" v-if="newQuerys.checkStatus==0" @click="save" :loading="loadingTwo">保 存</el-button>
                </el-col>
            
    </div>
</template>

<script>
    import {
        // getPartyOrgGradationRanks as get,
        // postPartyOrgGradationRanks as post,
        // postPartyOrgGradationRanksSubmit,
        // putPartyOrgGradationRanks as put,
    } from "../../../../api/villageApi";
    import vYvoption from "../../../../components/common/yvoption";
    const code = "200";

    export default {
        layout:'home',
        data() {
            return {
                loadingTwo:false,
                rules: {
                },
                weakOption : ['党组织班子配齐不全、书记长期缺职、工作处于停滞状态', '党组织书记不胜任现职、工作不在状态、严重影响班子整体战斗力', '班子不团结、内耗严重、工作不能正常开展', '组织制度形同虚设、不开展党组织活动','换届选举拉票贿赂问题突出','宗族宗教和黑恶势力干涉渗透严重','村务党务财务公开和民主管理混乱','社会治安问题和信访矛盾纠纷集中','无村级组织活动场所','党组织服务意识差、服务能力弱、群众意见大',"存在'村霸'问题","存在'微腐败''苍贪'现象","无集体经济收入"],
                newQuerys:{
                    id: "",
                    submitTime:"",
                    checkStatus:"",
                    massRank: "",
                    massRankTime: "",
                    meetingRank: "",
                    meetingRankTime: "",
                    rankInfo: "",
                    selfRank: "",
                    selfRankSlacknessIssues: "",
                    selfRankSlacknessIssuesAccess: [],
                    selfRankTime: "",
                    year: this.$route.query.year
                }
            };
        },
        components: {
            vYvoption,
        },
        methods: {
            report(){
                this.newQuerys.selfRankSlacknessIssues = JSON.stringify(this.newQuerys.selfRankSlacknessIssuesAccess);
                postPartyOrgGradationRanksSubmit(this.newQuerys)
                                .then(res => {
                        if (res.data.code == code) {
                            this.$message({
                                message: "上报成功",
                                type: "success"
                            });
                            this.getDetail();
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
                            message: "上报失败,请重试或者联系管理员！！"
                        });
                    });
            },
            save(){
                this.$refs["addQuery"].validate(valid => {
                    if (valid) {
                        this.loadingTwo = true;
                        this.newQuerys.selfRankSlacknessIssues = JSON.stringify(this.newQuerys.selfRankSlacknessIssuesAccess);
                        if (this.newQuerys.id == "") {
                            post(this.newQuerys)
                                .then(res => {
                                    this.loadingTwo = false;
                                    if (res.data.code == code) {
                                        this.$message({
                                            message: "新增成功",
                                            type: "success"
                                        });
                                        this.getDetail();
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
                                        this.getDetail();
                                    } else {
                                        this.$message({
                                            message: res.data.message,
                                            type: "warning"
                                        });
                                    }
                                })
                                .catch((e) => {
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
            getDetail() {
                let year = this.$route.query.year;
                get({year:year})
                    .then(res => {
                        if (res.data.code == code) {
                            if(res.data.data.list.length){
                                // this.newQuerys = res.data.data.list[0];
                                res.data.data.list[0].selfRankSlacknessIssuesAccess = JSON.parse(res.data.data.list[0].selfRankSlacknessIssues)
                                this.newQuerys=res.data.data.list[0]
                            }
                        } else {
                            this.$message({
                                type: "error",
                                message: res.data.message
                            });
                        }
                    })
                    .catch((e) => {
                        console.error(e)
                        this.$message({
                            type: "error",
                            message: "查询失败,请重试或者联系管理员！！"
                        });
                    });
            },
        },
        mounted() {
            // this.getDetail();
        }
    };

</script>

<style scoped>
    
</style>

<style>
   #selfReport .el-input.is-disabled .el-input__inner {
        background-color: #ffffff;
        border-color: #e4e7ed;
        color: #20192e;
        cursor: not-allowed;
    }

    #selfReport .el-textarea.is-disabled .el-textarea__inner {
        background-color: #ffffff;
        border-color: #e4e7ed;
        color: #20192e;
        cursor: not-allowed;
    }
    #selfReport .el-checkbox__input.is-checked+.el-checkbox__label {
        color: #409EFF;
    }
</style>
