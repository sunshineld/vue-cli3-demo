<!--  -->
<template>
    <div class='survey' :loading='loadingOne'>
        <el-form class="form" label-width="160px" :disabled='dis' :model="query" ref="query" :rules="rules">
            <el-row>
                <el-col :span='8'>
                    <el-form-item label="党组织类型" prop='type'>
                        <el-select v-model="query.type" filterable placeholder="选择所属区域党组织">
                            <v-yvoption groupName="partyOrgType"></v-yvoption>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span='8'>
                    <el-form-item label="下属支部个数">
                        <el-input v-model="query.subOrgCount" placeholder="请输入下属支部个数"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span='8'>
                    <el-form-item label="下属党小组个数">
                        <el-input v-model="query.subSmallGroupCount" disabled></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span='24'>
                    <el-form-item label="党小组信息">
                        <template v-for="(tag,index) in query.smallGroupList">
                        <el-tooltip class="item" :key="tag.id" effect="light" :disabled="!tag.areaSmallGroupInfo" :content="tag.areaSmallGroupInfo" placement="bottom-end">
                        <el-tag
                        :key="tag.id"
                        
                        :closable="!dis"
                        :disable-transitions="false"
                        @close="handleClose(tag,index)"
                        @click="handleEdit(tag,index)"
                        >
                        {{tag.groupName}}
                        </el-tag>
                        </el-tooltip>
                        </template>
                    <el-button  class="button-new-tag" size="small" @click="showInput">+ 添加党小组</el-button>
                    </el-form-item>
                </el-col>
            </el-row>

        </el-form>
        <div class="dialog-footer">
            <el-button type="primary" v-if='!dis' @click="save" :loading='loadingTwo'>保 存</el-button>
            <el-button v-if='!dis' @click="cancel">取 消</el-button>
            <el-button type="primary" v-else @click="update">修 改</el-button>
        </div>

         <!--新增模态框-->
        <el-dialog title="党小组信息"  :visible.sync="dialogVisible" >
            <el-form  label-width="180px" :model="smallGroupInfo">
                    <el-row>
					    <el-col :span='12'>
	                        <el-form-item label="党小组名称" prop="groupName">
	                            <el-input v-model="smallGroupInfo.groupName" auto-complete="off"></el-input>
	                        </el-form-item>
	                    </el-col>
                        <el-col :span='12'>
	                        <el-form-item label="覆盖村民小组" prop="areaSmallGroupInfo">
                                <el-input v-model="smallGroupInfo.areaSmallGroupInfo" auto-complete="off"></el-input>
	                        </el-form-item>
	                    </el-col>
                    </el-row>
            </el-form>

            <div slot="footer" class="dialog-footer-right">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="handleCreateSmallGroup">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import {
        // getVillagePartyOrgFramework as get,
        // putVillagePartyOrgFramework as put
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
                dialogVisible:false,
                query: {
                    smallGroupList: [],
                    subOrgCount: 0,
                    subSmallGroupCount: 0,
                    type: 1,
                },
                smallGroupInit:{
                    groupName:"",
                    areaSmallGroupInfo:""
                },
                smallGroupInfo:{},
                rules: {
                    type: [{
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
        },

        methods: {
            handleCreateSmallGroup(){
                this.query.smallGroupList.push(this.smallGroupInfo)
                this.dialogVisible = false;
            },
            handleEdit(tag,index){
                this.dialogVisible = true;
                this.$nextTick(function() {
                    this.smallGroupInfo = Object.assign({}, tag);
                })
            },
            handleClose(tag,index) {
                this.query.smallGroupList.splice(index, 1);
            },
            showInput() {
                this.dialogVisible = true;
                this.$nextTick(function() {
                    this.smallGroupInfo = Object.assign({}, this.smallGroupInit);
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

    .dialog-footer-right {
        text-align: right;
    }

</style>
<style>
    .el-input.is-disabled .el-input__inner {
        background-color: #ffffff;
        border-color: #e4e7ed;
        color: #20192e;
        cursor: not-allowed;
    }

    .el-textarea.is-disabled .el-textarea__inner {
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
    .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .el-tag + .el-tag {
    margin-left: 10px;
  }

</style>
