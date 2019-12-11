<route-meta>
{
  "requiresAuth": true,
  "name":"组织建设 / 分类定级 / 申请上报",
  "parent":"首页 / 组织领导"
}
</route-meta>
<template>
    <div id="applySubmit">
            <div class="btnSearch">
                <el-button @click="$router.go(-1)">返回</el-button>
                <el-button type="success" v-if="newQuerys.checkStatus==0" @click="save">上 报</el-button>
            </div>
            <br><br>

            <el-form label-width="160px" :model="newQuerys" :rules="rules" ref="addQuery" :disabled="newQuerys.checkStatus!=0">
            <el-row>
                <el-col :span='8'>
                    <el-form-item label="年度" prop="year">
                        <el-input  v-model="newQuerys.year" auto-complete="off" disabled></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span='18'>
                    <el-form-item label="工作总结" prop="applyRankInfo">
                        <el-input type="textarea" :rows=5 v-model="newQuerys.applyRankInfo" auto-complete="off"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span='8'>
                    <el-form-item label="申请等级" prop="applyRank">
                        <el-select v-model="newQuerys.applyRank" clearable filterable placeholder="选择申请等级">
                            <v-yvoption groupName="selfEvaluationResult"></v-yvoption>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row v-if="newQuerys.checkStatus==4 || newQuerys.checkStatus==5">
                <el-col :span='18'>
                    <el-form-item label="上报时间" prop="submitTime">
                        <el-date-picker type="datetime"  v-model="newQuerys.submitTime" disabled></el-date-picker>
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
    import vYvoption from "../../../../components/common/yvoption";
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
                    id: "",
                    applyRank: "",
                    checkStatus:0,
                    applyRankInfo: "",
                    year: this.$route.query.year
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
   #applySubmit .el-input.is-disabled .el-input__inner {
        background-color: #ffffff;
        border-color: #e4e7ed;
        color: #20192e;
        cursor: not-allowed;
    }

    #applySubmit .el-textarea.is-disabled .el-textarea__inner {
        background-color: #ffffff;
        border-color: #e4e7ed;
        color: #20192e;
        cursor: not-allowed;
    }
    #applySubmit .el-checkbox__input.is-checked+.el-checkbox__label {
        color: #409EFF;
    }
</style>
