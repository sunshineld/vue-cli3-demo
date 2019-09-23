<route-meta>
{
  "requiresAuth": true,
  "name":"菜单管理",
  "parent":"系统管理"
}
</route-meta>
<template>
  <div class="table" id="menumag">

    <!--工具条-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form :inline="true">
        <el-form-item>
          <el-button type="primary" @click="handleAdd">新增父节点</el-button>
        </el-form-item>
      </el-form>
    </el-col>
    <el-col :span="24">
      <el-tree :data="dataTree" :render-content='renderContent' :expand-on-click-node='false' :highlight-current='true' node-key="id" ref="tree">
      </el-tree>
    </el-col>

    <!--新增界面-->
    <el-dialog :title="formTittle" :visible.sync="formVisible" :close-on-click-modal="false">
      <el-form :model="subform" label-width="90px" :rules="formRules" ref="subform">
        <el-row>
          <el-col :span='12'>
            <el-form-item label="主键" prop="id">
              <el-input v-model="subform.id" auto-complete="off" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span='12'>
            <el-form-item label="父级id" prop="pid">
              <el-input v-model="subform.pid" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span='12'>
            <el-form-item label="类型" prop="menuType">
              <el-radio v-model="subform.menuType" :label="1">菜单</el-radio>
              <el-radio v-model="subform.menuType" :label="2">权限</el-radio>
            </el-form-item>
          </el-col>
          <el-col :span='12' v-if='subform.menuType==2'>
            <el-form-item label="调用方式" prop="method">
              <el-select v-model="subform.method" placeholder="请选择调用方式">
                <el-option v-for="item in methodsOptions" :key="item" :label="item" :value="item">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span='12'>
            <el-form-item label="名称" prop="menuName">
              <el-input v-model="subform.menuName" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span='12'>
            <el-form-item label="路径" prop="path">
              <el-input v-model="subform.path" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span='12'>
            <el-form-item label="图标" prop="icon">
              <el-input v-model="subform.icon" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span='12'>
            <el-form-item label="序号" prop="sort">
              <el-input v-model="subform.sort" auto-complete="off" type='number'></el-input>
            </el-form-item>
          </el-col>
          <el-col :span='12'>
            <el-form-item label="索引位" prop="indexId">
              <el-input v-model="subform.indexId" auto-complete="off" type='number'></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="formVisible = false">取消</el-button>
        <el-button type="primary" @click.native="formSubmit" :loading="formLoading">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  postMenu,
//   getRoleMenu,
//   getMenuList,
//   editMenu,
//   delMenu,
  base
} from "../../api/api";
const code = "200";
export default {
  layout: 'home',
  data() {
    return {
      methodsOptions: ["get", "post", "delete", "put"],
      dataTree: [],
      defaultProps: {
        children: "children",
        label: "name"
      },
      tableData: [],
      pageIndex: 1,
      pageSize: 10,
      totalCount: 0,
      loading: true,
      sels: [],
      //form数据
      formTittle: "",
      formVisible: false,
      queryParam: {
        id: "",
        name: ""
      },
      subform: {},
      initform: {
        id: "",
        pid: 0,
        menuName: "",
        path: "",
        icon: "",
        sort: 0,
        indexId: "",
        menuType: 1,
        method: "get",
        _btn1: ""
      },
      formRules: {
        menuName: [{ required: true, message: "请输入名称", trigger: "blur" }]
      },
      formLoading: false
    };
  },
  methods: {
    renderContent(h, { node }) {
      let _data = Object.assign({}, node.data);
      let _tag = h("el-tag", {
        props: {
          type: "success"
        },
        domProps: {
          innerHTML: "菜单显示"
        }
      });

      if (_data.menuType == 2) {
        this._btn1 = "";
      } else {
        this._btn1 = h("el-button", {
          props: {
            size: "mini",
            type: "info"
          },
          domProps: {
            innerHTML: "新增下级"
          },
          on: {
            click: () => this.handleAdd(_data)
          }
        });
      }
      let _bt2 = h("el-button", {
        props: {
          size: "mini",
          type: "info"
        },
        domProps: {
          innerHTML: "编辑"
        },
        on: {
          click: () => this.handleEdit(_data)
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
            click: () => this.handleDelete(_data)
          }
        });
      }

      let _btns = h(
        "span",
        {
          class: "pull-right"
        },
        [this._btn1, _bt2, _bt3]
      );
      return h("span", [_data.menuName, _btns]);
    },
    getTreeData() {
      let params = {
        role: 0
      };
      getRoleMenu(params)
        .then(res => {
          if (res.data.code == code) {
            this.dataTree = res.data.data.menuData;
          } else {
            this.$message.error(res.data.message);
          }
        })
        .catch(function(error) {
          self.$message.error("网络故障，请稍后再试");
        });
    },
    handleAdd(row) {
      this.formVisible = true;
      this.$nextTick(function() {
        this.subform = Object.assign({}, this.initform);
        this.subform.pid = row.id;
        this.$refs["subform"].resetFields();
        this.formTittle = "新增";
        if (row.children) {
          this.subform.menuType = 2;
        }
      });
    },
    handleEdit(row) {
      this.formVisible = true;
      this.$nextTick(function() {
        this.$refs["subform"].resetFields();
        this.subform = Object.assign({}, row);
        this.formTittle = "编辑";
      });
    },
    handleDelete(row) {
      this.$confirm("确认删除该记录吗?", "提示", {
        type: "warning"
      })
        .then(() => {
          let param = {
            ids: row.id
          };
          delMenu(param).then(res => {
            if (res.data.code == code) {
              this.formVisible = false;
              this.getTreeData();
              this.$message.success("删除成功");
            } else {
              this.$message.error(res.data.message);
            }
          });
        })
        .catch(() => {});
    },
    getMenuList() {
      this.loading = true;
      const self = this;
      let params = {
        page: this.pageIndex,
        itemcount: this.pageSize,
        id: this.queryParam.id,
        name: this.queryParam.name
      };
      getMenuList(params)
        .then(res => {
          this.loading = false;
          if (res.data.code == code) {
            this.tableData = res.data.data;
            this.totalCount = res.data.count;
          } else {
            this.$message.error(res.data.message);
          }
        })
        .catch(function(error) {
          self.loading = false;
          self.$message.error("网络故障，请稍后再试");
        });
    },
    handleCurrentChange(val) {
      this.pageIndex = val;
      this.getTreeData();
    },
    formSubmit() {
      if (this.subform.menuType == 1) {
        this.subform.method = "";
      }
      this.$refs["subform"].validate(valid => {
        if (valid) {
          this.formLoading = true;
          let param = Object.assign({}, this.subform);
          if (param.id != "") {
            editMenu(param).then(res => {
              this.formLoading = false;
              if (res.data.code == code) {
                this.$message.success("保存成功");
                this.formVisible = false;
                this.getTreeData();
              } else {
                this.$message.error(res.data.message);
              }
            });
          } else {
            postMenu(param).then(res => {
              this.formLoading = false;
              if (res.data.code == code) {
                this.$message.success("保存成功");
                this.formVisible = false;
                this.getTreeData();
              } else {
                this.$message.error(res.data.message);
              }
            });
          }
        } else {
          return false;
        }
      });
    },
    selsChange(sels) {
      this.sels = sels;
    },
    batchRemove() {
      var ids = this.sels.map(item => item.id).toString();
      if (ids == "") {
        this.$message.warning("您还没有选中记录");
        return false;
      }
      this.$confirm("确认删除选中记录吗？", "提示", {
        type: "warning"
      })
        .then(() => {
          let param = {
            ids: ids
          };
          delMenu(param).then(res => {
            if (res.data.code == code) {
              this.getTreeData();
              this.$message.success("删除成功");
            } else {
              this.$message.error(res.data.message);
            }
          });
        })
        .catch(() => {});
    }
  },

  mounted: function() {
    // this.getTreeData();
  }
};
</script>
<style>
#menumag .avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

#menumag .avatar-uploader .el-upload:hover {
  border-color: #20a0ff;
}

#menumag .avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  height: 178px;
  line-height: 178px;
  text-align: center;
}

#menumag .avatar {
  width: 237px;
  height: 178px;
}

#menumag .el-tree-node__content {
  position: relative;
  padding: 8px;
}

#menumag .pull-right {
  position: absolute;
  right: 0;
}
#menumag .el-tree {
  margin-bottom: 20px;
}
</style>
