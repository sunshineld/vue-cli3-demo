<template>
    <div>
        <el-option v-for="item in options" :label="item.label" :key="item.value" :value="item.value" :disabled="disabledIds?(disabledIds.indexOf(item.value)!=-1):false"></el-option>
    </div>
</template>
<script>
import {
    getOptions
} from '../../api/api';
export default {
    data() {
            return {
                options: []
            }
        },
        props: {
            tableName: String,
            label: String,
            value: String,
            groupName: String,
            dataList:String,
            disabledIds:Array,
            isInit:{
                type: Boolean,
                default: function () {
                    return true
                }
            }
        },
        methods: {
            getOptions() {
                let params = {
                    tableName: this.tableName,
                    label: this.label,
                    value: this.value,
                    groupName: this.groupName,
                    dataList:this.dataList,
                }
                getOptions(params).then((res) => {
                    if (res.data.code == '200') {
                        this.options = res.data.data;
                        this.$emit("onGetOption",this.options)
                    } else {
                        this.$message.error(res.data.message);
                    }
                }).catch(function(error) {
                    self.$message.error('网络故障，请稍后再试');
                });
            },

        },
        watch: {
            groupName:'getOptions',
            dataList: 'getOptions'
        },

        mounted: function() {
            if(this.isInit){
                this.getOptions()
            }
        }
}
</script>
