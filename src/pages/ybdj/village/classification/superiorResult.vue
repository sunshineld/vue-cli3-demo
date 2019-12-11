<route-meta>
{
  "requiresAuth": true,
  "name":"组织建设 / 分类定级 / 上级评定结果",
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
                    <el-form-item label="评定结果" prop="partyCommitteeRankZh">
                        <el-input  v-model="newQuerys.partyCommitteeRankZh" auto-complete="off" disabled></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span='8'>
                    <el-form-item label="党委会议时间" prop="partyCommitteeTime">
                        <el-date-picker type="date"  v-model="newQuerys.partyCommitteeTime"></el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :span='8'>
                    <el-form-item label="转化期限" prop="conversionDeadLine">
                        <el-date-picker type="date" v-model="newQuerys.conversionDeadLine"></el-date-picker>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row>
                <el-col :span='8'>
                    <el-form-item label="会议结果">
                        <imgsUpload v-model='newQuerys.partyCommitteeRankImgs' :imageUrl='newQuerys.partyCommitteeRankImgsAccess' dis></imgsUpload>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row v-if="newQuerys.partyCommitteeRank==3">
                <el-col :span='18'>
                    <el-form-item label="存在问题" prop="partyCommitteeRankSlacknessIssuesAccess">
                        <el-checkbox-group v-model="newQuerys.partyCommitteeRankSlacknessIssuesAccess">
                            <el-checkbox v-for="item in weakOption" :label="item" :key="item"></el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                </el-col>
            </el-row>

             <el-row v-if="newQuerys.partyCommitteeRank==3">
                <el-col :span='8'>
                    <el-form-item label="联系区领导" prop="countyLeader">
                        <el-input  v-model="newQuerys.countyLeader" auto-complete="off" disabled></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span='8'>
                    <el-form-item label="联系乡镇领导" prop="townshipLeader">
                        <el-input  v-model="newQuerys.townshipLeader" auto-complete="off" disabled></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span='8'>
                    <el-form-item label="第一书记" prop="firstSecretaryName">
                        <el-input  v-model="newQuerys.firstSecretaryName" auto-complete="off" disabled></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span='8'>
                    <el-form-item label="对口帮扶党组织" prop="supportOrgName">
                        <el-input  v-model="newQuerys.supportOrgName" auto-complete="off" disabled></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span='8'>
                    <el-form-item label="为民服务项目" prop="serviceProject">
                        <el-input  v-model="newQuerys.serviceProject" auto-complete="off" disabled></el-input>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row v-if="newQuerys.partyCommitteeRank!=3">
                <el-col :span='18'>
                    <el-form-item label="争创目标">
                        <el-input type="textarea" :rows=6 v-model="newQuerys.striveGoal" auto-complete="off" disabled></el-input>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row>
                <el-col :span='24'>
                    <el-form-item :label="newQuerys.partyCommitteeRank==3?'整改方案':'提升、巩固方案'">
                        <el-table :data="newQuerys.solutions" style="width: 100%">
                            <el-table-column prop="name" label="工作举措" show-overflow-tooltip min-width="150"></el-table-column>
                            <el-table-column prop="content" label="要求" show-overflow-tooltip min-width="150"></el-table-column>
                            <el-table-column prop="deadLine" label="完成时限" show-overflow-tooltip min-width="150">
                                <template slot-scope="scope">{{ scope.row.deadLine | date }}</template>
                            </el-table-column>
                            <el-table-column prop="responsiblePerson" label="责任人" show-overflow-tooltip min-width="150"></el-table-column>
                        </el-table>
                    </el-form-item>
                </el-col>
            </el-row>

            </el-form>
    </div>
</template>

<script>
    import {
        // getPartyOrgGradationRanks as get,
    } from "../../../../api/villageApi";
    import vYvoption from "../../../../components/common/yvoption.vue";
    import imgsUpload from "../../../../components/common/imgsUpload.vue";
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
                    checkStatus: "",
                    checkStatusZh: "",
                    checkTime: "",
                    conversionDeadLine: "",
                    countyLeader: "",
                    createTime: "",
                    firstSecretaryName: "",
                    id: "",
                    isDeleted: 0,
                    isMadeSolution: 0,
                    massRank: "",
                    massRankTime: "",
                    massRankZh: "",
                    meetingRank: "",
                    meetingRankTime: "",
                    meetingRankZh: "",
                    partyCommitteeRank: "",
                    partyCommitteeRankImgs: "",
                    partyCommitteeRankImgsAccess: [],
                    partyCommitteeRankSlacknessIssues: "",
                    partyCommitteeRankZh: "",
                    partyCommitteeTime: "",
                    partyOrgId: "",
                    partyOrgName: "",
                    rankInfo: "",
                    selfRank: "",
                    selfRankSlacknessIssues: "",
                    selfRankTime: "",
                    selfRankZh: "",
                    serviceProject: "",
                    striveGoal: "",
                    submitTime: "",
                    supportOrgName: "",
                    townshipLeader: "",
                    year: ""
                }
            };
        },
        components: {
            vYvoption,
            imgsUpload
        },
        methods: {
            
            getDetail() {
                let year = this.$route.query.year;
                get({year:year})
                    .then(res => {
                        if (res.data.code == code) {
                            if(res.data.data.list.length){
                                res.data.data.list[0].partyCommitteeRankSlacknessIssuesAccess = JSON.parse(res.data.data.list[0].partyCommitteeRankSlacknessIssues)
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
