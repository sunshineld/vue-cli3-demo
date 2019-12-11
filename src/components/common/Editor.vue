<template lang="html">
<div>
    <div ref="editor" @input="outputContent"></div>
    <!-- <button @click="getContent">查看内容</button> -->
    </div>
</template>

<script>
import WangEditor from 'wangeditor'
import {base} from '../../api/baseUrl';
var editor;
export default {
    props: ['value'],
    data() {
        return {
            content: ''
        }
    },
    computed: {
    },
    mounted() {
        this.createEditor()
    },
    methods: {
        getContent: function () {
            alert(this.content)
        },
        createEditor() {
            editor = new WangEditor(this.$refs.editor)
            const self = this;
             editor.customConfig.menus = [
                                            'head',  // 标题
                                            'bold',  // 粗体
                                            'italic',  // 斜体
                                            'underline',  // 下划线
                                            'strikeThrough',  // 删除线
                                            'foreColor',  // 文字颜色
                                            'backColor',  // 背景颜色
                                            'link',  // 插入链接
                                            'list',  // 列表
                                            'justify',  // 对齐方式
                                            'quote',  // 引用
                                            'emoticon',  // 表情
                                            'image',  // 插入图片
                                            'table',  // 表格
                                            'video',  // 插入视频
                                            'code',  // 插入代码
                                            'undo',  // 撤销
                                            'redo',  // 重复
                                        ]
            editor.customConfig.onchange = function (html) {
                self.formatContent(html)
            }
            //关闭粘贴样式的过滤
            editor.customConfig.pasteFilterStyle = false;
            //上传图片服务器
            editor.customConfig.uploadImgServer = base+'/uploadEditorPic'
            // 隐藏“网络图片”tab
            editor.customConfig.showLinkImg = false
            // 将图片大小限制为 10M
            editor.customConfig.uploadImgMaxSize = 10 * 1024 * 1024
            // 限制一次最多上传 5 张图片
            editor.customConfig.uploadImgMaxLength = 1
            // 上传超时时间10s
            editor.customConfig.uploadImgTimeout = 10000

            editor.customConfig.uploadImgHooks = {
                // 如果服务器端返回的不是 {errno:0, data: [...]} 这种格式，可使用该配置
                // （但是，服务器端返回的必须是一个 JSON 格式字符串！！！否则会报错）
                customInsert: function (insertImg, result, editor) {
                    var url = result.data.accessUrl;
                    insertImg(url)
                }
            }
            editor.create()
        },
        formatContent(content) {
            this.content = content;
            this.outputContent()
        },
        outputContent() {
            this.$emit('input', this.content)
        },
        changeValue(){
            if(this.content != this.value){
                editor.txt.html(this.value)
                editor.change && editor.change();
            }
        }
    },
    watch: {
            value:'changeValue'
        },
    components: {}
}
</script>

<style lang="css" scoped>
    #editor{
        height: 400px;
    }

    .wangEditor-container{
        border-radius: 2px;
        overflow: hidden;
        border: 1px solid #CCC;
    }
</style>
