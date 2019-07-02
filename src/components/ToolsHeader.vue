<template>
  <div class="header-wrapper">
    <div class="header-inner">
      <div class="left">
        <div @click="handleBackOnclick('save')">返回</div>
        <el-popover
          placement="bottom-start"
          width="400"
          trigger="click"
          v-model="changeNameVisible">
          <div>
            <div>修改模板名称</div>
            <el-input v-model="modelName" placeholder="请输入内容" style="margin-top: 10px"></el-input>
          </div>
          <div style="text-align: right; margin-top: 10px">
            <el-button type="primary" size="mini" @click="handleModelNameChangeOnclick">确定</el-button>
          </div>
          <div slot="reference">{{ value }}<i class="el-icon-arrow-down"></i></div>
        </el-popover>
        <div @click="handlePrintOnclick('pointer')" :class="pointerFocus">
          <label>指针</label>
        </div>
        <div @click="handlePrintOnclick('anchorPoint')" :class="anchorPointFocus">
          <label>框选锚点</label>
        </div>
        <div @click="handlePrintOnclick('textPoint')" :class="textPointFocus">
          <label>识别普通文本</label>
        </div>
        <el-popover
          placement="bottom"
          width="400"
          trigger="click"
          v-model="checkRowsVisible">
          <div>
            <div>插入表格列数</div>
            <el-input v-model="barNum" placeholder="请输入内容" style="margin-top: 10px"></el-input>
          </div>
          <div style="margin-top: 10px">
            <div v-if="warningVisible" style="float:left; line-height: 30px; color: red;">必须为不超过20的正整数</div>
            <el-button style="float:right" type="primary" size="mini" :disabled="btnDisabled" @click="handlePrintOnclick('tablePoint')">确定</el-button>
          </div>
          <div slot="reference">识别表格</div>
        </el-popover>
      </div>
      <div class="right">
      </div>
    </div>
  </div>
</template>
<script>

export default {
  name: 'OcrToolHeader',
  data () {
    return {
      modelName: '',
      formLabelWidth: '120px',
      barNum: '',
      warningVisible: false,
      btnDisabled: true,
      changeNameVisible: false,
      checkRowsVisible: false,
      pointerFocused: true,
      anchorPointFocused: false,
      textPointFocused: false
    }
  },
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  model: {
    prop: 'value',
    event: 'valueChanged'
  },
  computed: {
    pointerFocus () {
      return {
        'labelFocus': this.pointerFocused
      }
    },
    anchorPointFocus () {
      return {
        'labelFocus': this.anchorPointFocused
      }
    },
    textPointFocus () {
      return {
        'labelFocus': this.textPointFocused
      }
    }
  },
  mounted () {
    this.modelName = this.value
  },
  watch: {
    // 如果 `barNum` 发生改变，这个函数就会运行
    barNum () {
      let reg = /^[0-9]+$/
      if (this.barNum !== '' && !reg.test(this.barNum)) {
        this.btnDisabled = true
        this.warningVisible = true
      } else if (this.barNum === '') {
        this.btnDisabled = true
        this.warningVisible = false
      } else if (parseInt(this.barNum) > 20) {
        this.btnDisabled = true
        this.warningVisible = true
      } else {
        this.btnDisabled = false
        this.warningVisible = false
      }
    }
  },
  methods: {
    handlePrintOnclick (value) {
      this.pointerFocused = false
      this.anchorPointFocused = false
      this.textPointFocused = false

      if (value === 'anchorPoint') {
        this.anchorPointFocused = true
      } else if (value === 'textPoint') {
        this.textPointFocused = true
      } else {
        this.pointerFocused = true
      }
      console.log(value)
      this.$emit('listenToHeaderPrintEvent', value, this.barNum)
      this.barNum = ''
      this.checkRowsVisible = false
      this.btnDisabled = false
      this.warningVisible = false
      console.log(this.warningVisible)
    },
    handleBackOnclick () {
      this.$emit('listenToHeaderSaveEvent', true)
    },
    handleModelNameChangeOnclick () {
      this.$emit('valueChanged', this.modelName)
      this.changeNameVisible = false
    }
  }
}
</script>
<style scoped lang="less">
  /deep/ a {
    color: #fff;
  }
  .router-link-active {
    color: #099bdf !important;
    // border-bottom: 3px solid #099bdf;
  }
  .msg-num {
    position: absolute;
    background: rgb(255, 80, 41);
    color: #fff !important;
    line-height: 1;
    height: 14px;
    font-size: 10px !important;
    display: inline-block;
    border-radius: 10px;
    padding: 0px 6px;
    top: 53%;
    transform: translateY(-50%);
    &:hover {
      color: #fff !important;
    }
  }
  .header-wrapper {
    border-bottom: 1px solid #E4E7ED;
    z-index: 999;
    height: 40px;
    background-color: #fff;
    align-items: center;
    justify-content: space-between;
    font-size: 16px;
    position: relative;
    top: 0;
    left: 0;
    .header-inner {
      display: flex;
      width: 100%;
      height:100%;
      margin: 0 auto;
    }
    .left {
      flex: 1;
      font-size: 14px;
      display: flex;
      align-items: center;
      div {
        padding: 0 20px;
        line-height: 40px;
        color: #000000;
        cursor: pointer;
        &:hover {
          color: #099bdf;
        }
        label {
          cursor: pointer;
        }
      }
    }
    .labelFocus {
      border-bottom:2px solid #099bdf;
      label {
        color: #099bdf;
      }
    }
    .right {
      font-size: 14px;
      display: flex;
      align-items: center;
    }
  }

</style>
