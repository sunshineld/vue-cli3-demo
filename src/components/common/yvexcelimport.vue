<template>
    <div class='import'>
        <el-form-item>
            <el-upload v-show='isImport' style="height:16px" :action="importUrl" :headers="headers" :before-upload="beforeUpload" :on-success="handleSuccess" :on-error="handleError" :show-file-list='false' name="files">
                <el-button type="primary" :loading="fileLoading">导入</el-button>
            </el-upload>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="exportExcelTpl" v-show="isImport">导入模板下载</el-button>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" v-show = 'isExports' @click="handleExports" v-loading='exportLoading'>导出</el-button>
        </el-form-item>
    </div>
</template>
<script>
import { base } from "../../api/baseUrl";

export default {
  data() {
    return {
      fileLoading: false,
      importUrl: base + this.uploadUrl + "/import",
      templateUrl: base + this.uploadUrl + "/template",
      exportUrl: base + this.uploadUrl + "/export",
      exportLoading: false,
    };
  },
  computed:{
    headers() {
     return {
       'voucher' : localStorage.voucher
     }
    }
  },
  props: {
    uploadUrl: String,
    isImport: {
      type : Boolean,
      default :true
    },
    isExports:{
      type : Boolean,
      default :false
    },
    fileName:{
      type : String,
      default :"导出文件"
    },
    exportsQuery:{
      type:Object,
      default:null
    }
  },
  methods: {
    handleExports() {
      this.exportLoading = true;
      this.axios({
        method:'get',
        url:this.exportUrl,
        params:this.exportsQuery,
        responseType: 'blob'
      })
      .then((res) => {
         if (!res.data) {
              return
            }
          this.exportLoading = false;
          var blob = new Blob([res.data],{type: "application/vnd.ms-excel"})
          var downloadElement = document.createElement('a');
          var href = window.URL.createObjectURL(blob); //创建下载的链接
          downloadElement.href = href;
          downloadElement.download = this.fileName+'.xls'; //下载后文件名
          document.body.appendChild(downloadElement);
          downloadElement.click(); //点击下载
          document.body.removeChild(downloadElement); //下载完成移除元素
          window.URL.revokeObjectURL(href); 
      }).catch(() => {
         this.$message.error("导出失败!");
      })
    },
    exportExcelTpl() {
      location.href = this.templateUrl;
    },
    handleSuccess(res, file) {
      this.fileLoading = false;
      if (res.code == 200) {
        if ( res.data  && res.data.length) {
          let list = res.data;
          let div = "";
          list.forEach(item => {
            div += item + "<br/>";
          });
          this.$alert(div, "警告", {
            confirmButtonText: "复制并关闭",
            dangerouslyUseHTMLString: true
          }).then(() => {
            this.$copyText(div).then();
          });
        } else {
          this.$message.success("导入成功!");
          this.$emit("success");
        }
      } else {
        this.$message.error(res.message);
      }
    },
    handleError(err, file) {
      this.$message.error("导入失败!");
    },
    beforeUpload(file) {
      const fileType =
        "application/vnd.ms-excel application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
      // const isExcel = fileType.indexOf(file.type) != '-1';
      const notNULL = file.type != "";
      const isLt20M = file.size / 1024 / 1024 < 20;
      this.fileLoading = true;
      // if (!isExcel || !notNULL) {
      //     this.$message.error('导入文件只能是excel格式!');
      //     this.fileLoading=false;
      // }
      if (!isLt20M) {
        this.$message.error("导入文件大小不能超过 20MB!");
        this.fileLoading = false;
      }

      // return isExcel && isLt20M && notNULL;
      return isLt20M;
    }
  }
};
</script>
<style >
.import .el-message-box {
  width: 50%;
}
</style>
