<template>
    <el-upload 
        class="upload-demo" 
        :action="uploadUrl" 
        :on-preview="handlePreview" 
        :on-success="handleAvatarSuccess"
        :on-remove="handleRemove" 
        multiple 
        :limit="limit" 
        :on-exceed="handleExceed" 
        :file-list="propFileList"
        :before-upload="beforeUpload" 
        :on-progress="handleProgress" 
        :disabled="dis">
        <el-button :disabled="dis" size="small" type="primary">点击上传</el-button>
    </el-upload>
</template>

<script>
    import {
        base
    } from "../../api/baseUrl";
    const code = "200";
    export default {
        props: {
            value: {
                default: '',
            },
            limit: {
                type: Number,
                default: function () {
                    return 5
                }
            },
            fileList: {
                type: Array,
                default: function (params) {
                    return []
                }
            },
            dis: {
                type: Boolean,
                default: false
            },
        },
        data() {
            return {
                uploadUrl: base + '/upload',
                dbFileName: this.value?this.value.split(","):[]
            };
        },
        computed: {
            propFileList: {
                get: function (val) {
                    let arr = []
                    if (val.fileList && val.fileList.length) {
                        val.fileList.forEach((item) => {
                            arr.push({
                                url: item,
                                name: item.substring(item.lastIndexOf('_') + 1, item.length)
                            })
                        })
                        return arr;
                    } else {
                        return [];
                    }
                },
                set: function (v) {
                    // this.$emit("accessImageChange",v);
                }
            }
        },
        watch:{
            value: function (val) {
                if(val){
                    this.dbFileName = val.split(",");
                } else {
                    this.dbFileName = [];
                }
            }
        },
        methods: {
            handlePreview(file) {
                console.log(file);
                window.open(file.url, file.name)
            },
            handleExceed(files, fileList) {
                this.$message.warning(`当前限制选择 ${this.limit} 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
            },
            handleAvatarSuccess(res, file) {
                this.$emit('disableBtn', false);
                if (res.code == code) {
                    if (this.value && this.value.length) {
                        this.dbFileName = this.value.split(",")
                    } else {
                        this.dbImages=[]
                    }
                    this.dbFileName.push(res.data.dbFileName);
                    //input 父组件可以使用v-model动态绑定
                    this.$emit("input", this.dbFileName.join(','));
                } else {
                    this.$message({
                        type: 'error',
                        message: res.message
                    })
                }
            },
            handleProgress() {
                this.$emit('disableBtn', true);
            },
            beforeUpload(file) {
                const isLt2M = file.size / 1024 / 1024 < 20;
                const name = file.name.indexOf('_') > -1 || file.name.indexOf(',') > -1;
                if (!isLt2M) {
                    this.$message.error('上传文件大小不能超过 20MB!');
                }
                if (name) {
                    this.$message.error('上传文件名字不能包含下滑线和英文逗号!');
                }
                return isLt2M && !name;
            },
            handleRemove(file, fileList) {
                if (file.response) {
                    for (let i = 0; i < this.dbFileName.length; i++) {
                        if (file.response.data.dbFileName == this.dbFileName[i]) {
                            this.dbFileName.splice(i, 1)
                        }
                    }
                } else {
                    for (let i = 0; i < this.dbFileName.length; i++) {
                        if (file.url.indexOf(this.dbFileName[i]) > -1) {
                            this.dbFileName.splice(i, 1)
                        }
                    }
                }
                this.$emit("input", this.dbFileName.join(','));
            },
        }
    };
</script>
