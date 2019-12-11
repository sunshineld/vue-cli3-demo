<route-meta>
{
  "requiresAuth": true,
  "name":"组织建设 / 分类定级",
  "parent":"首页 / 组织领导"
}
</route-meta>
<template>
    <div class="log" id="classification">

        <div class="search">
            <el-form class="form" :inline="true" :model="query" ref="search">
                <el-form-item label="年度">
                    <el-input v-model="query.year" placeholder="请输入年度"></el-input>
                </el-form-item>

                <el-form-item>
                    <div class="btnSearch">
                        <el-button type="primary" @click="getSearchList" v-loading="loadingOne">查询</el-button>
                    </div>
                </el-form-item>
            </el-form>
        </div>
        <br><br><br>
        <div class="table-wrapper">
            <el-steps :active="newQuerys.activeIndex" align-center finish-status="success">
            <el-step title="评议阶段">
                <template slot="description">
                    <el-row>
                        <div @click="detail(1)">
                            <el-card shadow="hover" @click="detail" :body-style="formatDetailStyle(newQuerys.rankProgress.selfStatus)">
                                自评上报
                            </el-card>
                        </div>
                    </el-row>
                    <el-row>
                        <div @click="detail(2)">
                        <el-card shadow="hover" :body-style="formatDetailStyle(newQuerys.rankProgress.committeeStatus)">
                            上级评定
                        </el-card>
                        </div>
                    </el-row>
                    <el-row v-if="newQuerys.rankProgress.committeeStatus==3">
                        评议结果: &nbsp;&nbsp;<span style="color:red;font-size:1.3rem">{{newQuerys.rankProgress.committeeInfo}}</span>
                    </el-row>
                    
                </template>
            </el-step>
            <el-step title="巩固、提升、整改阶段">
                <template slot="description">
                    <el-row>
                        <div @click="detail(3)">
                        <el-card shadow="hover" :body-style="formatDetailStyle(newQuerys.solutionProgress.quarter1Status)">
                            第一季度
                            {{newQuerys.solutionProgress.quarter1Info}}
                        </el-card>
                        </div>
                    </el-row>
                    <el-row>
                        <div @click="detail(4)">
                        <el-card shadow="hover" :body-style="formatDetailStyle(newQuerys.solutionProgress.quarter2Status)">
                            第二季度
                            {{newQuerys.solutionProgress.quarter2Info}}
                        </el-card>
                        </div>
                    </el-row>
                    <el-row>
                        <div @click="detail(5)">
                        <el-card shadow="hover" :body-style="formatDetailStyle(newQuerys.solutionProgress.quarter3Status)">
                            第三季度
                            {{newQuerys.solutionProgress.quarter3Info}}
                        </el-card>
                        </div>
                    </el-row>
                    <el-row>
                        <div @click="detail(6)">
                        <el-card shadow="hover" :body-style="formatDetailStyle(newQuerys.solutionProgress.quarter4Status)">
                            第四季度
                            {{newQuerys.solutionProgress.quarter4Info}}
                        </el-card>
                        </div>
                    </el-row>
                    <el-row v-if="newQuerys.rankProgress.committeeStatus==3">
                        任务完成情况: &nbsp;&nbsp;<span style="color:red;font-size:1.3rem">{{newQuerys.solutionProgress.statusInfo}}</span>
                    </el-row>
                    
                </template>
            </el-step>
            <el-step title="验收阶段">
                <template slot="description">
                    <el-row>
                        <div @click="detail(7)">
                        <el-card shadow="hover" :body-style="formatDetailStyle(newQuerys.yearEndProgress.selfStatus)">
                            申请上报
                        </el-card>
                        </div>
                    </el-row>
                    <el-row>
                        <div @click="detail(8)">
                        <el-card shadow="hover" :body-style="formatDetailStyle(newQuerys.yearEndProgress.committeeStatus)">
                            上级结论
                        </el-card>
                        </div>
                    </el-row>
                    <el-row v-if="newQuerys.yearEndProgress.committeeStatus==3">
                        提升结果: &nbsp;&nbsp;<span style="color:red;font-size:1.3rem">{{newQuerys.yearEndProgress.committeeInfo}}</span>
                    </el-row>
                </template>
            </el-step>
            </el-steps>
        </div>

    </div>

</template>

<script>
    import {
        // getVillageClassificationProgress as get,
    } from "../../../../api/villageApi";

    const code = "200";


    export default {
        layout:'home',
        data() {
            return {
                bodyStyle:{background:'#ffff',color:'#c0c4cc'},
                doingStyle:{background:'#409EFF',color:'#ffff'},
                successStyle:{background:'#67C23A',color:'#ffff'},
                todoStyle:{background:'#ffff',color:'#c0c4cc'},
                query: {
                    year:new Date().getFullYear(),
                    size: 10,
                    page: 1
                },
                rules: {
                },
                newQuerys: {
                    activeIndex: 3,
                    rankProgress:{
                        committeeInfo:"",
                        committeeStatus: 1,
                        selfStatus: 2,
                        status: 2
                    },
                    solutionProgress: {
                        quarter1Info:"" ,
                        quarter1Status: 1,
                        quarter2Info:"" ,
                        quarter2Status: 1,
                        quarter3Info:"" ,
                        quarter3Status: 1,
                        quarter4Info:"" ,
                        quarter4Status: 1,
                        status: 1,
                        statusInfo: ""
                    },
                    year: 2019,
                    yearEndProgress: {
                        committeeInfo:"" ,
                        committeeStatus: 1,
                        selfStatus: 1,
                        status: 1
                    }
                },
                loadingOne: false,
            };
        },
        components: {

        },
        methods: {
            detail(progress){
                
                if(progress == 1){
                    if(this.newQuerys.rankProgress.selfStatus!=1){
                        this.$router.push("/ybdj/village/classification/selfReport?year="+this.query.year);
                    }
                }else if(progress == 2){
                    if( this.newQuerys.rankProgress.committeeStatus==3){
                        this.$router.push("/ybdj/village/classification/SuperiorResult?year="+this.query.year);
                    }else if(this.newQuerys.rankProgress.committeeStatus==2){
                        this.$alert("上级评定中，请耐心等待...","提示");
                    }
                }else if(progress == 3){
                    if(this.newQuerys.solutionProgress.quarter1Status==2 || this.newQuerys.solutionProgress.quarter1Status==3){
                        this.$router.push("/ybdj/village/classification/seasonMission?year="+this.query.year+"&season=1");
                    }
                }else if(progress == 4){
                    if(this.newQuerys.solutionProgress.quarter2Status==2 || this.newQuerys.solutionProgress.quarter2Status==3){
                        this.$router.push("/ybdj/village/classification/seasonMission?year="+this.query.year+"&season=2");
                    }
                }else if(progress == 5){
                    if(this.newQuerys.solutionProgress.quarter3Status==2 || this.newQuerys.solutionProgress.quarter3Status==3){
                        this.$router.push("/ybdj/village/classification/seasonMission?year="+this.query.year+"&season=3");
                    }
                }else if(progress == 6){
                    if(this.newQuerys.solutionProgress.quarter4Status==2 || this.newQuerys.solutionProgress.quarter4Status==3){
                        this.$router.push("/ybdj/village/classification/seasonMission?year="+this.query.year+"&season=4");
                    }
                }else if(progress == 7){
                    if(this.newQuerys.yearEndProgress.selfStatus==2 || this.newQuerys.yearEndProgress.selfStatus==3){
                        this.$router.push("/ybdj/village/classificationapplySubmit?year="+this.query.year);
                    }
                }else if(progress == 8){
                    if( this.newQuerys.yearEndProgress.committeeStatus==3){
                        this.$router.push("/ybdj/village/classification/finalResult?year="+this.query.year);
                    }else if(this.newQuerys.yearEndProgress.committeeStatus==2){
                        this.$alert("上级结论中，请耐心等待...","提示");
                    }
                }
            },
            formatDetailStyle(status){
                let returnStyle="";
                if(status==2){
                    returnStyle=this.doingStyle
                }else if(status==3){
                    returnStyle=this.successStyle
                }else{
                    returnStyle=this.todoStyle
                }
                return returnStyle;
            },
            getSearchList() {
                this.loadingOne = true;
                get(this.query)
                    .then(res => {
                        this.loadingOne = false;
                        if (res.data.code == code) {
                             this.newQuerys = res.data.data;
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

            handleCreate() {
                this.$refs["addQuery"].validate(valid => {
                    if (valid) {
                        this.loadingTwo = true;
                        if (this.newQuerys.id == 0) {
                            post(this.newQuerys)
                                .then(res => {
                                    this.loadingTwo = false;
                                    if (res.data.code == code) {
                                        this.$message({
                                            message: "新增成功",
                                            type: "success"
                                        });
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
                    }
                });
            },
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
    .el-row{
        margin-top:3rem;
    }
    

</style>

<style>
    #classification .el-step.is-center .el-step__description {
        padding-left: 38%;
        padding-right: 38%;
        width: 150px;
    }
</style>
