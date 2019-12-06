<route-meta>
{
  "requiresAuth": true,
  "name":"行政区划管理",
  "parent":"基础数据"
}
</route-meta>
<template>
    <div class="log" id="areaMag">
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true">
                <el-form-item>
                    <el-button type="primary"  @click="addModel">新增父节点</el-button>
                </el-form-item>
                <el-form-item>
                    <v-yvexcelimport :uploadUrl="importUrl" @success="getSearchList"></v-yvexcelimport>
                </el-form-item>
                
            </el-form>
        </el-col>
        <el-col :span="24">
            <el-tree :data="list" style="padding-right: 20px;" :highlight-current="true" :render-content='renderContent'
                     :expand-on-click-node='false' :props="defaultProps" node-key="id" default-expanded-keys=[5]  ref="tree">
            </el-tree>
        </el-col>


        <!--新增模态框-->
        <el-dialog :title="dialogTitle"  :visible.sync="dialogVisible" >
            <el-form  label-width="140px" :model="newQuerys" ref="addQuery" :rules="rules">
                <el-row>
                    <el-col :span='12'>
	                        <el-form-item label="名称" prop="name">
	                            <el-input v-model="newQuerys.name" auto-complete="off"></el-input>
	                        </el-form-item>
	                    </el-col>
                        <el-col :span='12'>
	                        <el-form-item label="级别" prop="level">
                                <el-select v-model="newQuerys.level" clearable placeholder="请选择级别">
                                    <v-yvoption groupName="areaLevel"></v-yvoption>
                                </el-select>
	                        </el-form-item>
	                    </el-col>
                        <el-col :span='12'>
	                        <el-form-item label="父级" prop="parentId">
                                <el-select v-model="newQuerys.parentId" clearable filterable placeholder="请选择状态">
                                    <v-yvoption tableName="area" label="name" value='id'></v-yvoption>
                                </el-select>
	                        </el-form-item>
	                    </el-col>
                </el-row>
                <el-row>

                        <el-col :span='12'>
	                        <el-form-item label="经度" prop="longitude">
	                            <el-input v-model="newQuerys.longitude" auto-complete="off"></el-input>
	                        </el-form-item>
	                    </el-col>
                        <el-col :span='12'>
	                        <el-form-item label="纬度" prop="latitude">
	                            <el-input v-model="newQuerys.latitude" auto-complete="off"></el-input>
	                        </el-form-item>
	                    </el-col>


                        

                       <el-col :span='24'>
                        <el-form-item label="简介" prop="info">
                            <el-input type="textarea" :rows="6" v-model="newQuerys.info" auto-complete="off"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span='12'>
	                        <el-form-item label="创建时间" prop="createTime">
	                        	<el-date-picker type="datetime" placeholder="选择日期" v-model="newQuerys.createTime" disabled></el-date-picker>
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
        // delAreas as del,
        getAreasTree as get,
        // postAreas as post,
        // putAreas as put,
    } from '../../api/api';

    const code = "200";
    import vYvoption from '../../components/common/yvoption';
    import imgUpDate from '../../components/common/imgUpDate.vue'
    import vYvexcelimport from '../../components/common/yvexcelimport.vue'

    export default {
        layout: 'home',
        data() {
            return {
                importUrl:"/areas/tree",
                defaultProps: {
                    children: 'children',
                    label: 'name'
                },
                query:{
                    id:'',
                    size:10,
                    page:1
                },
                addQuery:{
                	id:'',
                	level:6,
                	name:'',
                    parentId:'',
                    longitude:'',
                    latitude:'',
                	info:'',
                	picUrl:'',
                	checkStatus:'',
                	createTime:'',
                    isDeleted:'',
                    pact:'',
                    pactRemark:'',
                    assistLeaderName:'',
                    assistLeaderTitle:'',
                    projectPic:'',
                    projectPlanTable:'',
                    projectProgressTable:'',
                    excellentWork:'',
                    waterPassPercent:'',
                    electricPassPercent:'',
                    gasPassPercent:'',
                    roadPassPercent:'',
                    telePassPercent:'',
                    collectiveEconomyType:'',
                    collectiveEconomyValue:'',
                    countyLeaderName:'',
                    countyLeaderTitle:'',
                    townshipLeaderName:'',
                    townshipLeaderTitle:'',
                    townshipCadre1Name:'',
                    townshipCadre1Title:'',
                    townshipCadre2Name:'',
                    townshipCadre2Title:'',
                    townshipCadre3Name:'',
                    townshipCadre3Title:'',
                },
                rules:{
                	name:[{required: true,message: '请输入地区',trigger: 'blur'},{max: 255, message: '长度错误!', trigger: 'blur' }],
                	level:[{required: true,message: '请输入地区级别',trigger: 'blur'}],
                },
                newQuerys:{},
                sells:[],
                list:[],
                dialogVisible:false,
                currentPage1:1,
                dialogTitle:'',
                loadingOne:false,
                loadingTwo:false,
            }
        },
        components:{
            vYvoption,
            imgUpDate,
            vYvexcelimport
        },
        methods:{
            renderContent(h, {
                node
            }) {
                let _data = Object.assign({}, node.data);
                let _bt1 = h("el-button", {
                    props: {
                        size: "mini",
                        type: "info"
                    },
                    domProps: {
                        innerHTML: "新增下级"
                    },
                    on: {
                        click: () => (this.addModel(_data))
                    }
                });
                let _bt2 = h("el-button", {
                    props: {
                        size: "mini",
                        type: "info"
                    },
                    domProps: {
                        innerHTML: "编辑"
                    },
                    on: {
                        click: () => (this.handleEdit(_data))
                    }
                });
                let _bt3 = "";
                if (node.isLeaf) {
                    _bt3 = h("el-button", {
                        props: {
                            size: "mini",
                            type: "danger"
                        },
                        domProps: {
                            innerHTML: "删除"
                        },
                        on: {
                            click: () => (this.handleDelete(_data))
                        }
                    });
                }

                let _btns = h("span", {
                    'class': 'pull-right'
                }, [_bt1, _bt2, _bt3]);
                return h('span', [_data.name, _btns]);
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
            addModel(data){
                this.dialogVisible = true;
                this.$nextTick(function() {
                    this.newQuerys = Object.assign({}, this.addQuery);
                    this.newQuerys.parentId = data.id;
                    this.dialogTitle = "新增";
                })
            },
            handleSelectionChange(val) {
                this.sells = val;
            },
            handleEdit(data){
                this.dialogVisible = true;
                this.$nextTick(function() {
                    this.newQuerys = Object.assign({}, data);
                    this.dialogTitle = "编辑";
                })

            },
            handleCreate() {
            	this.$refs["addQuery"].validate((valid) => {
                    if (valid) {
                    this.loadingTwo = true;
                        if(this.newQuerys.id == 0){
                            post(this.newQuerys)
                                .then((res) => {
                                this.loadingTwo = false;
                                    if(res.data.code == code){
                                        this.$message({
                                            message: "新增成功",
                                            type: 'success'
                                        });
                                        this.dialogVisible = false;
                                        this.getSearchList();
                                    }else{
                                        this.$message({
                                            message: res.data.message,
                                            type: 'warning'
                                        });
                                    }
                                }).catch(() => {
                                this.loadingTwo = false;
                                this.$message({
                                    type: 'error',
                                    message:"新增失败,请重试或者联系管理员！！"
                                });
                            });
                        }else{
                            put(this.newQuerys)
                                .then((res) => {
                                this.loadingTwo = false;
                                    if(res.data.code == code){
                                        this.$message({
                                            message: "编辑成功",
                                            type: 'success'
                                        });
                                        this.dialogVisible = false;
                                        this.getSearchList();
                                    }else{
                                        this.$message({
                                            message: res.data.message,
                                            type: 'warning'
                                        });
                                    }
                                }).catch(() => {
                                this.loadingTwo = false;
                                this.$message({
                                    type: 'error',
                                    message:"编辑失败,请重试或者联系管理员！！"
                                });
                            });
                        }
                    }
                });
            },
            handleDelete(data) {
                this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    del({ids:data.id}).then((res) => {
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

<style>
    #areaMag .el-tree-node__content{
        position: relative;
        padding: 10px;
    }

    #areaMag .pull-right {
        position: absolute;
        right: 0;
    }
    #areaMag .el-tree{
        margin-bottom: 20px;
    }

</style>
