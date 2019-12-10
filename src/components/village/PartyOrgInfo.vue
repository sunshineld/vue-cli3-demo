<!--  -->
<template>
    <div class='survey' :loading='loadingOne' id="partyOrgInfo">
        <el-form class="form" label-width="160px" :disabled='dis' :model="query" ref="query" :rules="rules">
            <el-row>
                <el-col :span='24'>
                    <el-form-item label="党组织全称" prop='name'>
                        <el-input v-model="query.name" placeholder="请输入摘要"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span='8'>
                    <el-form-item label="所属区域党组织">
                        <el-select v-model="query.regionOrgType" filterable clearable placeholder="选择所属区域党组织">
                            <v-yvoption groupName="regionOrgType"></v-yvoption>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span='8'>
                    <el-form-item label="城乡结对党组织名称">
                        <el-input v-model="query.pairOrgName" placeholder="请输入城乡结对党组织名称"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span='8'>
                    <el-form-item label="结对党组织类型">
                        <el-select v-model="query.pairOrgType" filterable clearable placeholder="选择结对党组织类型">
                            <v-yvoption groupName="pairOrgType"></v-yvoption>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span='4'>
                    <el-form-item label="是否下派第一书记">
                            <span v-if="query.isAssignFirstSecretary"><i class="fa fa-check"></i></span>
                        <span v-else><i class="fa fa-close"></i></span>
                    </el-form-item>
                </el-col>
                <el-col :span='4' v-if="query.isAssignFirstSecretary==1">
                    <el-form-item label="第一书记姓名">
                        {{query.assignFirstSecretaryName}}
                    </el-form-item>
                </el-col>
                <el-col :span='8' v-if="query.isAssignFirstSecretary==1">
                    <el-form-item label="第一书记下派缘由">
                        {{query.assignFirstSecretaryTypeZh}}
                    </el-form-item>
                </el-col>

                <el-col :span='24'>
                    <el-form-item label="党组织简述" prop='brief'>
                        <el-input v-model="query.brief" type='textarea' :rows='6' placeholder="请输入党组织简述"></el-input>
                    </el-form-item>
                </el-col>
                
                <el-col :span='24'>
                    <el-form-item label="乡镇安排年度目标">
                        <template v-for="(item,i) in goalsType1.list">
                            <div :key="i" v-if="item.type==1">{{i+1}}:{{item.title}}</div>
                        </template>
                    </el-form-item>
                </el-col>
                <el-col :span='24'>
                    <el-form-item label="自定年度目标" prop='brief'>
                        <template v-for="(item,i) in goalsType2.list">
                            <div :key="i" v-if="item.type==2">{{i+1}}:{{item.title}}</div>
                        </template>
                    </el-form-item>
                </el-col>

            </el-row>

        </el-form>
        <div class="dialog-footer">
            <el-button type="success" @click="lookupMission">查看年度目标</el-button>
            <el-button type="primary" v-if='!dis' @click="save" :loading='loadingTwo'>保 存</el-button>
            <el-button v-if='!dis' @click="cancel">取 消</el-button>
            <el-button type="primary" v-else @click="update">修 改</el-button>
        </div>
    </div>
</template>

<script>
    import {
        // getPartyOrgInfo as get,
        // putPartyOrgInfo as put,
        // getPartyOrgYearlyIssues
    } from "../../api/villageApi";
    const code = 200;
    import vYvoption from "../common/yvoption";
    import imgsUpload from "../common/imgsUpload";
    export default {
        props: {
            activeName: String
        },
        data() {
            return {
                goalsType1:{},
                goalsType2:{},
                query: {
                    areaId: "",
                    assignFirstSecretaryName: "",
                    assignFirstSecretaryType: "",
                    brief: "",
                    id: "",
                    isAssignFirstSecretary: 0,
                    name: "",
                    pairOrgName: "",
                    pairOrgType: "",
                    regionOrgType: "",
                },
                rules: {
                    name: [{
                        required: true,
                        message: '请输入',
                        trigger: "blur"
                    }],
                    selfAssessment: [{
                        required: true,
                        message: '请输入',
                        trigger: "blur"
                    }],
                    jobDuty: [{
                        required: true,
                        message: '请输入',
                        trigger: "blur"
                    }],
                },
                dis: true,
                loadingOne: false,
                loadingTwo: false
            };
        },

        components: {
            vYvoption,
            imgsUpload
        },
        watch: {
            activeName: function (val) {
                if (val == "first") {
                    this.getSearchList();
                    this.getYearGoalType1()
                    this.getYearGoalType2()
                }
            }
        },
        computed: {
            currentUser() {
                let userStr = localStorage.getItem("user");
                if (!userStr) {
                    return false;
                }
                let user = JSON.parse(userStr);
                return user.orgId.toString();
            },
        },

        mounted() {
            // this.getSearchList()
            // this.getYearGoalType1()
            // this.getYearGoalType2()
        },

        methods: {
            lookupMission(){
                this.$router.push("/village/yearGoalsRating?year="+new Date().getFullYear());
            },
            getYearGoalType1(){
                getPartyOrgYearlyIssues({type:1,year:new Date().getFullYear()}).then((res) => {
                    if(res.data.code == code){
                        this.goalsType1 = res.data.data;
                    }else{
                        this.$message({
                            type: 'error',
                            message:res.data.message
                        });
                    }
                }).catch(() =>{
                    this.$message({
                        type: 'error',
                        message:"查询失败,请重试或者联系管理员！！"
                    });
                })
            },
            getYearGoalType2(){
                getPartyOrgYearlyIssues({type:2,year:new Date().getFullYear()}).then((res) => {
                    if(res.data.code == code){
                        this.goalsType2 = res.data.data;
                    }else{
                        this.$message({
                            type: 'error',
                            message:res.data.message
                        });
                    }
                }).catch(() =>{
                    this.$message({
                        type: 'error',
                        message:"查询失败,请重试或者联系管理员！！"
                    });
                })
            },
            getSearchList() {
                this.loadingOne = true;
                get({})
                    .then(res => {
                        this.loadingOne = false;
                        if (res.data.code == code) {
                            this.query = res.data.data;
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
            update() {
                this.dis = false;
            },
            changeIsAssign() {
                console.log(this.query.isAssignFirstSecretary)
                if (this.query.isAssignFirstSecretary == 0) {
                    this.query.assignFirstSecretaryName = ''
                }
            },
            cancel() {
                this.getSearchList()
                this.dis = true;
            },
            save() {
                this.$refs["query"].validate(valid => {
                    if (valid) {
                        put(this.query)
                            .then(res => {
                                this.loadingTwo = false;
                                if (res.data.code == code) {
                                    this.$message({
                                        message: res.data.message,
                                        type: "success"
                                    });
                                    this.dis = true;
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
                })


            }
        }
    }

</script>
<style scoped>
    .dialog-footer {
        text-align: center;
    }

</style>
<style>
    #partyOrgInfo .el-input.is-disabled .el-input__inner {
        background-color: #ffffff;
        border-color: #e4e7ed;
        color: #20192e;
        cursor: not-allowed;
    }

    #partyOrgInfo .el-textarea.is-disabled .el-textarea__inner {
        background-color: #ffffff;
        border-color: #e4e7ed;
        color: #20192e;
        cursor: not-allowed;
    }

    .fa-check {
        font-size: 20px;
        color: #20a0ff;
    }

    .fa-close {
        font-size: 20px;
        color: red;
    }

</style>
