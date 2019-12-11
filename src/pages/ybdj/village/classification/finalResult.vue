<route-meta>
{
  "requiresAuth": true,
  "name":"组织建设 / 分类定级 / 上级结论",
  "parent":"首页 / 组织领导"
}
</route-meta>
<template>
    <div id="finalResult">
            <div class="btnSearch">
                <el-button @click="$router.go(-1)">返回</el-button>
            </div>
            <br><br>

            <el-form label-width="160px" :model="newQuerys" :rules="rules" ref="addQuery" disabled>
            <el-row>
                <el-col :span='8'>
                    <el-form-item label="年度" prop="year">
                        <el-input  v-model="newQuerys.year" auto-complete="off" disabled></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span='8'>
                    <el-form-item label="验收结果" prop="partyCommitteeRank">
                        <el-select v-model="newQuerys.partyCommitteeRank" clearable filterable placeholder="选择申请等级">
                            <v-yvoption groupName="selfEvaluationResult"></v-yvoption>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span='8'>
                    <el-form-item label="乡镇党委会议时间" prop="partyCommitteeTime">
                        <el-date-picker type="date"  v-model="newQuerys.partyCommitteeTime" disabled></el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :span='18'>
                    <el-form-item label="评定理由" prop="partyCommitteeRankInfo">
                        <el-input type="textarea" :rows=5 v-model="newQuerys.partyCommitteeRankInfo" auto-complete="off"></el-input>
                    </el-form-item>
                </el-col>
                
            </el-row>
            </el-form>
            
    </div>
</template>

<script>
    import {
        // getPartyOrgGradationYearEnds as get,
        // postPartyOrgGradationYearEnds as post
    } from "../../../../api/villageApi";
    import vYvoption from "../../../../components/common/yvoption.vue";
    const code = "200";

    export default {
        layout:'home',
        data() {
            return {
                loadingTwo:false,
                rules: {
                    applyRank:[{ required: true, message: "此项必填", trigger: "blur" }],
                    applyRankInfo:[{ required: true, message: "此项必填", trigger: "blur" },{max: 255, message: '长度错误!', trigger: 'blur' }],
                },
                newQuerys:{
                    applyRank:"", 
                    applyRankInfo:"", 
                    applyRankTime:"", 
                    checkStatus:"", 
                    checkTime:"", 
                    createTime:"", 
                    id:"", 
                    isDeleted:"", 
                    partyCommitteeRank:"", 
                    partyCommitteeRankInfo:"", 
                    partyCommitteeTime:"", 
                    partyOrgId:"", 
                    submitTime:"", 
                    year:"", 
                }
            };
        },
        components: {
            vYvoption,
        },
        methods: {
            save(){
                this.$refs["addQuery"].validate(valid => {
                    if (valid) {
                        this.loadingTwo = true;
                            post(this.newQuerys)
                                .then(res => {
                                    this.loadingTwo = false;
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
                    }
                });
            },
            getDetail() {
                let year = this.$route.query.year;
                get({year:year})
                    .then(res => {
                        if (res.data.code == code) {
                            if(res.data.data.list.length){
                                this.newQuerys = res.data.data.list[0];
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
   #finalResult .el-input.is-disabled .el-input__inner {
        background-color: #ffffff;
        border-color: #e4e7ed;
        color: #20192e;
        cursor: not-allowed;
    }

    #finalResult .el-textarea.is-disabled .el-textarea__inner {
        background-color: #ffffff;
        border-color: #e4e7ed;
        color: #20192e;
        cursor: not-allowed;
    }
    #finalResult .el-checkbox__input.is-checked+.el-checkbox__label {
        color: #409EFF;
    }
</style>
