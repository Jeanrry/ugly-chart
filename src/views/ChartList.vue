<template>
  <div class="ocr-formwork-list">
    <div class="wrapper" style="padding-top:20px;">
      <div class="hd-title mb20">OCR模板列表</div>
      <div class="formwork-wrapper">
        <div class="btn-upload mt10 mb20">
          <el-button type="primary" @click="handleAddButtonOnclick">新建模板</el-button>
        </div>
        <div class="formwork-list">
          <el-table
            :data="formworkList"
            style="width: 100%;">
            <el-table-column
              fixed="left"
              prop="img"
              label="缩略图"
              width="100">
              <template slot-scope="scope">
                <!--{{ scope.row.img }}-->
                <img :src="scope.row.path" height="70" alt=""/>
              </template>
            </el-table-column>
            <el-table-column
              fixed="left"
              label="模板名称"
              width="180">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click="handleEditButtonOnclick(scope.row.templateId)">{{ scope.row.name }}</el-button>
              </template>
            </el-table-column>
            <el-table-column
              prop="templateId"
              label="模板id"
              width="360">
            </el-table-column>
            <el-table-column
              label="模板状态"
              width="100">
              <template slot-scope="scope">
                <p style="color: #FFB63C;">{{ scope.row.status | formatStatus}}</p>
              </template>
            </el-table-column>
            <el-table-column
              prop="createTime"
              label="创建时间"
              width="150">
            </el-table-column>
            <el-table-column
              prop="modifyTime"
              label="最近修改时间"
              width="150">
            </el-table-column>
            <el-table-column
              fixed="right"
              label="模板操作"
              width="360">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click="handleEditButtonOnclick(scope.row.templateId)">编辑</el-button>
                <el-button type="text" size="small">删除</el-button>
                <el-button type="text" size="small">上传图片试用</el-button>
                <el-button type="text" size="small">发布</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>

        <el-pagination v-if="formworkList.length > 0" background style="margin-top:20px;text-align:right;"
                       layout="total, prev, pager, next" :total="dataTotal" @size-change="handleSizeChange"
                       @current-change="handleCurrentChange">
        </el-pagination>
        <el-dialog title="上传模板图片" :visible.sync="addDialogVisible">
          <div style="text-align: center; width: 100%">
            <el-upload
              class="upload-demo"
              drag
              action="https://jsonplaceholder.typicode.com/posts/"
              :on-success="handleAvatarSuccess"
              multiple>
              <i v-if="!imageUrl" class="el-icon-upload"></i>
              <div v-if="!imageUrl" class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
              <div v-if="!imageUrl" class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </div>
          <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
      </span>
        </el-dialog>
        <el-dialog title="设置模板名称" :visible.sync="setDialogVisible">
          <el-row :gutter="20">
            <el-col :span="12">
              <img :src="imageUrl" class="avatar" alt="">
              <!--<div style="">-->
              <!--<i class="el-icon-refresh"></i>-->
              <!--重新上传-->
              <!--</div>-->
            </el-col>
            <el-col :span="12">
              <div>
                <label style="line-height: 30px">模板名称</label>
              </div>
              <el-input v-model="input"></el-input>
              <label style="line-height: 30px">模板命名规范：blabal</label>
            </el-col>
          </el-row>
          <span slot="footer" class="dialog-footer">
        <el-button @click="formworkSubmit">确 定</el-button>
        <el-button @click="setDialogVisible = false">取 消</el-button>
      </span>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'OcrFormworkList',
  data () {
    return {
      pageNum: 1,
      pageSize: 10,
      loading: true,
      dataTotal: 0, // 分页总条数
      addDialogVisible: false,
      setDialogVisible: false,
      imageUrl: '',
      input: '',
      formworkList: []
    }
  },
  filters: {
    formatStatus (value) {
      return value === 1 ? '已发布' : '未发布'
    }
  },
  mounted () {
    this.getFormworks()
  },
  methods: {
    // 获取列表
    getFormworks () {
      let params = {pageNum: this.pageNum, pageSize: this.pageSize}
      this.$api.formworkList({}, {params: params}).then(res => {
        console.log(res)
        this.loading = false
        if (res.success) {
          this.formworkList = res.data || []
          this.dataTotal = res.total
        } else {
          this.$message.error(res.message)
        }
      })
    },
    handleAddButtonOnclick () {
      this.addDialogVisible = true
    },
    handleEditButtonOnclick (value) {
      this.$router.push({path: '/ocrFormworkManagement', query: {id: value}})
    },
    handleAvatarSuccess (res, file) {
      this.imageUrl = URL.createObjectURL(file.raw)
      this.input = file.name
      this.addDialogVisible = false
      this.setDialogVisible = true
    },
    formworkSubmit () {
      // 传模板名称并跳转
      this.$router.push({path: '/ocrFormworkManagement', query: {id: this.$route.query.id}})
    },
    // 页码点击事件
    handleSizeChange (val) {
      this.pageNum = val
      this.getFormworks()
    },
    // 分页点击事件
    handleCurrentChange (val) {
      this.pageNum = val
      this.getFormworks()
    }
  }
}
</script>

<style scoped lang="less">
  /deep/ .el-table__empty-block {
    display: none !important;
  }

  .ocr-formwork-list {
    background: #f0f4f5;
  }

  .formwork-wrapper {
    padding: 30px;
    background: #fff;
    flex: 1;
  }

  .clr-blue {
    color: #409eff;
    cursor: pointer;
  }

  /*.ocr-formwork-list {*/
  /*width: 1200px;*/
  /*margin: 0 auto;*/
  /*}*/

  .avatar {
    width: 100%;
  }
</style>
