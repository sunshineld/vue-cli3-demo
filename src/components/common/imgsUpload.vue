<template>
    <div id="imgUpDate">
        <el-upload
            list-type="picture-card"
            :action="uploadUrl"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeUpload"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
            :file-list="myImageUrl"
            :limit="limit"
            :on-exceed="onExceed"
            :disabled="dis"
            >
            <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible" :append-to-body="true">
            <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
    </div>

</template>

<script>
    import {
       base,
    } from '../../api/api';
    const code = '200';
    export default {
        props:{
            value: {
    　　　　　default: '',
    　　　　},
            limit:{
                type:Number,
                default:function(){
                    return 5
                }
            },
            imageUrl:{
                type:Array,
                default:function(){
                    return []
                }
            },
            dis:{
                type:Boolean,
                default:false
            },
        },
        watch:{
            value: function (val) {
                if(val != null){
                    this.dbImages = val.split(",");
                } else {
                    this.dbImages = [];
                }
            }
        },
        computed:{
            myImageUrl: {
                get: function() {
                    if(typeof(this.imageUrl) != "undefined" && this.imageUrl!=null){
                        return this.imageUrl.map(r =>{return {url:r}})
                    }else{
                        return [];
                    }
                },
                set: function (v) {
                    // this.$emit("accessImageChange",v);
                }
            }
        },
        data() {
            return {
                uploadUrl:base+'/upload',
                imageProp:'',
                percentage:0,
                isShow:false,
                dialogImageUrl: '',
                dialogVisible: false,
                images:[],
                dbImages: [],
            };
        },
        methods: {
            onExceed(){
                this.$message({
                    type:'error',
                    message:"只能上传"+this.limit+"张图片"
                })
            },
            handleRemove(file, fileList) {
                console.log('删除',file)
                let arrI = []
                if(file.response) {
                    for(let i = 0; i < this.dbImages.length; i ++) {
                        if(file.response.data.dbFileName == this.dbImages[i]) {
                            this.dbImages.splice(i,1)
                        }
                    }
                } else {
                    for(let i = 0; i < this.dbImages.length; i ++) {
                        if(file.url.indexOf(this.dbImages[i]) > -1) {
                            this.dbImages.splice(i,1)
                        }
                    }
                }
                this.$emit("input",this.dbImages.join(','));
            },
            handlePictureCardPreview(file) {
                this.dialogImageUrl = file.url;
                this.dialogVisible = true;
            },
            handleAvatarSuccess(res, file) {
                // console.log('上传图片',res,file)
                if(res.code == code){
                    if(this.value && this.value.length){
                        this.dbImages=this.value.split(",")
                    }else{
                        this.dbImages=[]
                    }
                    this.dbImages.push(res.data.dbFileName);
                    //input 父组件可以使用v-model动态绑定
                    this.$emit("input",this.dbImages.join(','));
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

                const name = file.name.indexOf('_') > -1 || file.name.indexOf(',') > -1;
                if(name) {
                    this.$message.error('上传文件名字不能包含下滑线和英文逗号!');
                }
                return isJPG && isLt2M && !name;
            },
        },

    }
</script>

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


</style>
