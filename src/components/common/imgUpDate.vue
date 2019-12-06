<template>
    <div id="imgUpDate">
        <el-upload
            class="avatar-uploader"
            :action="uploadUrl"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :on-progress="handProgress"
            :disabled="dis"
            :before-upload="beforeUpload">
            <img v-if="myImageUrl" :src="myImageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div class="pric" v-show="isShow">
                <el-progress type="circle" :percentage="percentage"></el-progress>
            </div>
            <div class='shadow' v-if='myImageUrl'>
                    <span class='el-icon-zoom-in'  @click='bigClick'></span>
                    <span class='el-icon-delete' v-if="!dis"  @click='delClick'></span>
            </div>
        </el-upload>
        <el-dialog width="70%" :visible.sync="dialogVisible">
                <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
    </div>

</template>

<script>
    import {
       base,
    } from '../../api/baseUrl';
    const code = '200';
    export default {
        props:{
            imageUrl:String,
            keys:Number,
            dis:{
                type:Boolean,
                default:false
            },
        },
        computed:{
            myImageUrl: {
                get: function() {
                    return this.imageUrl
                },
                set: function (v) {
                    this.$emit("accessImageChange",v,this.keys);
                }
            }
        },
        data() {
            return {
                uploadUrl:base+'/upload',
                imageProp:'',
                percentage:0,
                isShow:false,
                dialogVisible:false,
                dialogImageUrl:''
            };
        },
        methods: {
            bigClick(e) {
                e.stopPropagation()
               this.dialogImageUrl = this.myImageUrl;
                this.dialogVisible = true;
            },
            delClick(e) {
                e.stopPropagation()
                this.myImageUrl = '';
                this.$emit("input",'')
            },
            handleAvatarSuccess(res, file) {
                if(res.code == code){
                        this.myImageUrl = res.data.accessUrl;
                    //input 父组件可以使用v-model动态绑定
                        this.$emit("input",res.data.dbFileName);
                }else{
                    this.$message({
                        type:'error',
                        message:res.message
                    })
                }

            },
            beforeUpload(file) {
                let imgArr = ['image/png','image/jpg','image/jpeg','image/gif'];
                const isJPG = file.type ;
                if(imgArr.indexOf(isJPG) == -1){
                    this.$message.error('只能上传图片格式!');
                    return false
                }
                const isLt2M = file.size / 1024 / 1024 < 20;

                if (!isLt2M) {
                    this.$message.error('上传头像图片大小不能超过 20MB!');
                }
                return isJPG && isLt2M;
            },
            handProgress(event,file){
                this.isShow = true;
                this.percentage = parseInt(event.percent);
                if(this.percentage == 100){
                    this.isShow = false
                }
            },

        },


    }
</script>

<style scope>

    .shadow{
        position: absolute;
        width: 100%;
        height: 100%;
        top:0;
        background:rgba(0,0,0,.5);
        opacity: 0;
        transition: all .5s;
    }
    .shadow span{
        text-align: center;
        line-height: 178px;
        font-size: 24px;
        color:#fff;
        padding: 0 10px;
    }
    .el-upload:hover .shadow{
       opacity: 1;
    }

</style>


<style>
    #imgUpDate .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }
    #imgUpDate .avatar-uploader .el-upload:hover {
        border-color: #409EFF;
    }
    #imgUpDate .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 178px;
        height: 178px;
        line-height: 178px;
        text-align: center;
    }
    #imgUpDate .avatar {
        width: 265px;
        height: 178px;
        /*display: block;*/
        object-fit: contain;
    }
    #imgUpDate  .pric{
        position: absolute;
        width: 100%;
        height:100%;
        top:0;
        left:0;
        background: rgba(0,0,0,0.3);
    }
    #imgUpDate .el-progress{
        margin-top: 30px;
    }
    #imgUpDate .el-progress__text{
        color: #fff;
    }
    #imgUpDate .el-dialog__wrapper{
        z-index: 2013 !important;
    }
    .v-modal{
        z-index: 2000 !important;
    }

</style>
