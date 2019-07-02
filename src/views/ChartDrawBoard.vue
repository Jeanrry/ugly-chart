<template>
  <div class="ocr-formwork-management">

    <div class="wrapper" style="padding-top:20px;">
      <div class="hd-title mb20">OCR模板管理</div>
      <div class="formwork-management-wrapper">
        <div class="ocr-formwork-management__row">
          <div class="ocr-formwork-management__row-left">
            <ocr-tools-header
              v-model="templateName"
              @listenToHeaderPrintEvent="listenToHeaderEvent"
              @listenToHeaderSaveEvent="headerSaveEvent">
            </ocr-tools-header>

            <div class="ocr-formwork-management__row-left__main-body" ref="mainBody">
              <!--<img src="/static/xbx.jpg" alt="图片"/>-->
              <svg width="100%" height="100%">
                <!--待识别图片-->
                <g
                  class="cursor-default">
                  <image
                    x="0"
                    y="0"
                    width="100%"
                    height="100%"
                    :href="imgUrl"
                    alt="图片"/>
                </g>

                <!--所有的框框-->
                <template v-for="(i, index) in svgRectList">
                  <drag-svg
                    :key="i.id"
                    :attr="i"
                    :type="i.type"
                    :index="index"
                    @listenToDragSvgEvent="showMsgFromDragSvg"
                    @click.native="handleDragSvgOnclick(index, i.id)">
                  </drag-svg>
                </template>

                <!--拖动生成框，松开鼠标会将该框加入到上文的列表中-->
                <drag-svg
                  v-if="drawSvgVisibility"
                  :attr="snapSvgRect"
                  :type="snapSvgRect.type"
                  @mousemove.native="drawSvgOnSvg">
                </drag-svg>

                <!--画布，只有选择开始作画时候才会显示-->
                <g
                  v-if="!pointerFocused"
                  class="cursor-crosshair"
                  @mousedown="drawSvgStart"
                  @mousemove="drawSvg"
                  @mouseup="drawSvgStop">
                  <rect
                    :x="0"
                    :y="0"
                    width="100%"
                    height="100%"
                    style="fill: rgba(255, 255, 255, 0);">
                  </rect>
                </g>

                <!--禁用罩-->
                <g
                  v-if="waitSvgVisibility"
                  class="cursor-wait"
                  @mousedown="drawSvgStart"
                  @mousemove="drawSvg"
                  @mouseup="drawSvgStop">
                  <rect
                    :x="0"
                    :y="0"
                    width="100%"
                    height="100%"
                    style="fill: rgba(255, 255, 255, 0);">
                  </rect>
                </g>
              </svg>
            </div>
            <!--<el-button @click="handleChange">切换</el-button>-->
          </div>

          <div class="ocr-formwork-management__row-right">
            <el-tabs v-model="activeName" @tab-click="handleClick" type="card" stretch>
              <!--锚点栏-->
              <el-tab-pane label="框选参照锚点" name="first" style="height: calc(100vh - 186px);">
                <el-scrollbar style="height: 100%">
                <template v-for="(i, index) in svgRectList">
                  <div v-if="i.type === 'anchorPoint'" :key="i.id" class="dragger-layout--anchor-point">
                    <div class="dragger-layout--anchor-point__tag">
                      {{ i.index }}
                    </div>
                    <el-input v-model="i.data" class="dragger-layout--anchor-point__input" size="mini"></el-input>
                    <el-button type="text" icon="el-icon-delete" @click="handleDeleteBtnOnclick(index)"></el-button>
                  </div>
                </template>
                </el-scrollbar>
              </el-tab-pane>

              <!--内容栏-->
              <el-tab-pane label="框选内容识别区" name="second" style="height: calc(100vh - 186px);">
                <el-scrollbar style="height: 100%">
                <template v-for="(i, index) in svgRectList">
                  <div :key="i.id">
                    <div v-if="i.type === 'textPoint'" class="dragger-layout--text-point">
                      <div class="dragger-layout--text-point__line">
                        <div class="dragger-layout--text-point__tag">
                          {{ i.index }}
                        </div>
                        <div class="dragger-layout--text-point__key">字段名：</div>
                        <el-input v-model="i.name" class="dragger-layout--text-point__input" size="mini"></el-input>
                        <el-button type="text" icon="el-icon-delete" @click="handleDeleteBtnOnclick(index)"></el-button>
                      </div>
                      <div class="dragger-layout--text-point__line">
                        <div class="dragger-layout--text-point__OCR-res">识别内容参考：{{ i.data }}</div>
                      </div>
                    </div>

                    <div v-if="i.type === 'tablePoint'" class="dragger-layout--table-point">
                      <div class="dragger-layout--table-point__line">
                        <div class="dragger-layout--table-point__tag">
                          {{ i.index }}
                        </div>
                        <div class="dragger-layout--table-point__key">表格名：</div>
                        <el-input v-model="i.name" class="dragger-layout--table-point__input" size="mini"></el-input>
                        <el-button type="text" icon="el-icon-delete" @click="handleDeleteBtnOnclick(index)"></el-button>
                      </div>

                      <div v-for="col in i.barLists" :key="col.id" class="dragger-layout--table-point__OCR-res">第{{ col.id }}列：{{ col.text }}</div>
                    </div>
                  </div>
                </template>
                </el-scrollbar>
              </el-tab-pane>
            </el-tabs>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import DragSvg from '../components/DragSvg.vue'
import OcrToolsHeader from '../components/ToolsHeader.vue'
import crypto from 'crypto'

export default {
  name: 'OcrFormworkManagement',
  data () {
    return {
      activeIndex: '',
      activeName: 'first',
      drawBoardW: 0, // 画板宽度
      drawBoardH: 0, // 画板宽度
      imgUrl: '',
      imgW: 0, // 图片宽度
      imgH: 0, // 图片高度
      imgWhiteBar: false, // 图片长宽基准，图片在画板上左右留白为false，图片在画板上上下留白为true
      templateName: '',
      e: {},
      startX: 0,
      startY: 0,
      stopX: 0,
      stopY: 0,
      drawSvgOrNot: false, // 是否在画框
      drawSvgVisibility: false, // 拖动生成框是否渲染
      waitSvgVisibility: false, // 禁用框是否渲染
      snapSvgRect: { // 当前所画框数据
        id: this.getId(),
        x: 0,
        y: 0,
        w: 0,
        h: 0,
        type: '',
        choosed: false
      },
      svgRectList: [], // 存放页面显示框
      rects: [], // 存放原始数据
      pointerFocused: true,
      anchorPointFocused: false,
      textPointFocused: false
    }
  },
  components: {
    DragSvg,
    OcrToolsHeader
  },
  computed: {
    imageCursor () {
      return {
        'cursor-crosshair': !this.pointerFocused,
        'cursor-default': this.pointerFocused
      }
    }
  },
  mounted () {
    // console.log('mounted')
    this.getDrawBoardWH()
    // console.log('width:' + this.drawBoardW + ',height:' + this.drawBoardH)
    this.getEditFormworks()
    // console.log('width:' + this.drawBoardW + ',height:' + this.drawBoardH)
  },
  watch: {
    // svgRectList (o, n) {
    //   console.log(o)
    //   console.log(n)
    // }
  },
  methods: {
    // 获取当前编辑的模板全部数据
    getEditFormworks () {
      console.log(this.$route.query.id)
      this.$api.formworkInfo({}, {urlParam: this.$route.query.id}).then(res => {
        // console.log(res)
        if (res.success) {
          console.log(res)
          this.templateName = res.data.template.name || ''
          this.imgUrl = res.data.template.path || ''
          this.rects = res.data.rects || []
          this.getImgWH(this.imgUrl, () => {
            console.log(this.rects)
            for (let i in this.rects) {
              if (this.rects[i].type === 0) {
                this.svgRectList.push(
                  {
                    id: this.rects[i].id,
                    x: this.getScreenX(this.rects[i].x),
                    y: this.getScreenY(this.rects[i].y),
                    w: this.getScreenX(this.rects[i].x + this.rects[i].width) - this.getScreenX(this.rects[i].x),
                    h: this.getScreenY(this.rects[i].y + this.rects[i].height) - this.getScreenY(this.rects[i].y),
                    index: this.getIndex('anchorPoint'),
                    type: 'anchorPoint',
                    choosed: false,
                    name: this.rects[i].name || '',
                    data: this.rects[i].text || ''
                  }
                )
              }
              if (this.rects[i].type === 1 && this.rects[i].isTable === 0) {
                this.svgRectList.push(
                  {
                    id: this.rects[i].id,
                    x: this.getScreenX(this.rects[i].x),
                    y: this.getScreenY(this.rects[i].y),
                    w: this.getScreenX(this.rects[i].x + this.rects[i].width) - this.getScreenX(this.rects[i].x),
                    h: this.getScreenY(this.rects[i].y + this.rects[i].height) - this.getScreenY(this.rects[i].y),
                    index: this.getIndex('textPoint'),
                    type: 'textPoint',
                    choosed: false,
                    name: this.rects[i].name || '',
                    data: this.rects[i].text || ''
                  }
                )
              }
              if (this.rects[i].type === 1 && this.rects[i].isTable === 1) {
                let barLists = this.rects[i].colJson.split(',')
                let x = this.getScreenX(this.rects[i].x)
                let y = this.getScreenY(this.rects[i].y)
                let w = this.getScreenX(this.rects[i].x + this.rects[i].width) - x
                let h = this.getScreenY(this.rects[i].y + this.rects[i].height) - y
                for (let i in barLists) {
                  barLists[i] = {
                    id: i,
                    w: (this.getScreenX(parseInt(barLists[i])) - x) / w
                  }
                }
                console.log(barLists)
                this.svgRectList.push(
                  {
                    id: this.rects[i].id,
                    x: x,
                    y: y,
                    w: w,
                    h: h,
                    index: this.getIndex('tablePoint'),
                    type: 'tablePoint',
                    choosed: false,
                    name: this.rects[i].name || '',
                    data: this.rects[i].text || '',
                    col: barLists.length + 1,
                    bar: barLists
                  }
                )
              }
              // console.log(this.svgRectList)
            }
            // console.log(this.svgRectList)
          })
        } else {
          this.$message.error(res.message)
        }
      })
    },
    // 右侧标签页点击事件
    handleClick (tab, event) {
      // console.log(tab, event)
      // console.log(this.activeName)
    },
    // 手动切换标签页
    handleChange () {
      // this.activeName = this.activeName === 'second' ? 'first' : 'second'
    },
    // 拖动框核心方法，接收子组件“DragSvg”传回来的数据，并依据数据修改传送给“DragSvg”的参数，从而改变拖动框的位置和大小
    // 上传数据给服务器
    // data为拖动后的位置信息
    // index是被修改的框的列表下标
    // 若鼠标弹起 bool为true 否则为false
    showMsgFromDragSvg (data, index, bool) {
      // console.log(index)
      // this.svgRectList[index] = data
      // console.log(this.svgRectList)
      // console.log(bool)

      // 鼠标弹起，校验新坐标是否合法，修正剔除拖动框在画布外的部分
      if (bool) {
        let overflowChecked = this.checkRectOverflow(data.x, data.y, data.w, data.h)
        console.log(overflowChecked)
        console.log(data)
        data.x = overflowChecked.x
        data.y = overflowChecked.y
        data.w = overflowChecked.w
        data.h = overflowChecked.h
      }

      // 鼠标弹起并识别表格
      if (data.type === 'tablePoint' && bool) {
        let x = this.getImageX(data.x)
        let y = this.getImageY(data.y)
        let width = this.getImageX(data.x + data.w) - this.getImageX(data.x)
        let height = this.getImageY(data.y + data.h) - this.getImageY(data.y)
        let barLists = []
        for (let i in data.bar) {
          barLists.push(data.bar[i].w)
        }
        // 对格子进行排序
        // 在拖动过程中，可能出现id较小但更靠右的条
        barLists.sort(function (a, b) {
          return a - b
        })
        for (let i in barLists) {
          barLists[i] = parseInt(barLists[i] * width + x)
        }
        // console.log(data)
        let param = {
          x: x,
          y: y,
          width: width,
          height: height,
          templateId: this.$route.query.id,
          col: data.col,
          coordinate: barLists
        }
        // console.log(param)
        this.checkTable(param, (res) => {
          // console.log(res)
          barLists = []
          for (let i in res.data) {
            let text = ''
            for (let t in res.data[i]) {
              text += res.data[i][t] + ' '
            }
            barLists.push(
              {
                id: Number(i) + 1,
                text: text
              }
            )
          }
          data.barLists = barLists
          // console.log(data)
        })
      }

      // 鼠标弹起并识别普通框
      if (data.type !== 'tablePoint' && bool) {
        // console.log(data)
        let param = {
          x: this.getImageX(data.x),
          y: this.getImageY(data.y),
          width: this.getImageX(data.x + data.w) - this.getImageX(data.x),
          height: this.getImageY(data.y + data.h) - this.getImageY(data.y),
          type: data.type === 'anchorPoint' ? 0 : 1,
          templateId: this.$route.query.id
        }
        // console.log(param)
        this.checkRect(param, (res) => {
          console.log(res)
          this.svgRectList[index].data = res.data
        })
      }
    },
    // 处理当前选中框
    handleDragSvgOnclick (value) {
      for (let i in this.svgRectList) {
        this.svgRectList[i].choosed = false
      }
      this.svgRectList[value].choosed = true
    },
    // 工具栏返回信息
    listenToHeaderEvent (svgType, value) {
      this.pointerFocused = false
      this.anchorPointFocused = false
      this.textPointFocused = false

      // 分别接收header传来的点选数据和列表列数
      if (svgType === 'pointer') {
        this.pointerFocused = true
      } else if (svgType === 'anchorPoint') {
        this.anchorPointFocused = true
        this.activeName = 'first'
      } else if (svgType === 'textPoint') {
        this.textPointFocused = true
        this.activeName = 'second'
      } else if (svgType === 'tablePoint') {
        this.pointerFocused = true
        this.activeName = 'second'
        // 计算列表框宽高，以及根据列数，计算列表框每一列的位置
        let barList = []
        for (let i = 0; i < parseInt(value); i++) {
          if (i > 0) {
            barList.push(
              {
                id: i,
                w: i / parseInt(value)
              }
            )
          }
        }
        let overflowChecked = this.checkRectOverflow(0, 0, this.$refs.mainBody.offsetWidth, this.$refs.mainBody.offsetHeight / 2)

        let table = {
          id: this.getId(),
          x: overflowChecked.x,
          y: overflowChecked.y,
          w: overflowChecked.w,
          h: overflowChecked.h,
          index: this.getIndex('tablePoint'),
          name: 'item' + this.getIndex('tablePoint').toString(),
          type: 'tablePoint',
          choosed: false,
          bar: barList,
          col: barList.length + 1
        }
        console.log(table)
        this.svgRectList.push(table)
      }
    },
    // 工具栏点击保存
    headerSaveEvent () {
      let rectJson = []
      for (let i in this.svgRectList) {
        console.log(this.svgRectList[i])
        // 根据浏览器像素分别计算拖动框对应在图片上的像素xywh
        let x = this.getImageX(this.svgRectList[i].x)
        let y = this.getImageY(this.svgRectList[i].y)
        let w = this.getImageX(this.svgRectList[i].x + this.svgRectList[i].w) - x
        let h = this.getImageY(this.svgRectList[i].y + this.svgRectList[i].h) - y

        // if判断并生成rectJson数据
        if (this.svgRectList[i].type === 'anchorPoint') {
          rectJson.push(
            {
              type: 0,
              text: this.svgRectList[i].data,
              x: x,
              y: y,
              width: w,
              height: h
            }
          )
        } else if (this.svgRectList[i].type === 'textPoint') {
          rectJson.push(
            {
              type: 1,
              text: this.svgRectList[i].data,
              x: x,
              y: y,
              width: w,
              height: h,
              name: this.svgRectList[i].name,
              isTable: 0
            }
          )
        } else if (this.svgRectList[i].type === 'tablePoint') {
          let barLists = []
          console.log(this.svgRectList[i])
          let abc = this.svgRectList[i]
          console.log(abc)
          console.log(abc.bar)
          for (let l in abc.bar) {
            barLists.push(abc.bar[l].w)
          }
          // 对格子进行排序
          // 在拖动过程中，可能出现id较小但更靠右的条
          barLists.sort(function (a, b) {
            return a - b
          })
          for (let i in barLists) {
            barLists[i] = parseInt(barLists[i] * w + x)
          }
          rectJson.push(
            {
              type: 1,
              text: this.svgRectList[i].data,
              x: x,
              y: y,
              width: w,
              height: h,
              name: this.svgRectList[i].name,
              isTable: 1, // 是否是表格 1是 0否
              col: this.svgRectList[i].col, // 表格有几列
              colJson: barLists.toString() // 表格竖线的x坐标
            }
          )
        }
      }
      console.log(rectJson)
      let param = {
        rectJson: JSON.stringify(rectJson),
        templateId: this.$route.query.id
      }
      console.log(param)
      this.$api.saveRect(param).then(res => {
        if (res.success) {
          console.log(res)
        } else {
          this.$message.error(res.message)
        }
      })
    },
    // 在画布上鼠标按下，开始作画
    drawSvgStart (e) {
      if (!this.pointerFocused) {
        this.e = e
        this.startX = e.offsetX
        this.startY = e.offsetY
        this.drawSvgOrNot = true
        this.drawSvgVisibility = true
      }
    },
    // 开始作画并在画布上鼠标移动
    drawSvg (e) {
      if (!this.pointerFocused) {
        if (this.drawSvgOrNot) {
          // console.log('a', e)
          this.stopX = e.offsetX
          this.stopY = e.offsetY

          let w, h
          w = this.stopX - this.startX
          h = this.stopY - this.startY

          let type = 'anchorPoint'
          if (this.anchorPointFocused) {
            type = 'anchorPoint'
          }
          if (this.textPointFocused) {
            type = 'textPoint'
          }

          this.snapSvgRect = {
            id: this.getId(),
            x: this.startX,
            y: this.startY,
            w: w,
            h: h,
            type: type,
            choosed: false
          }
        }
      }
    },
    // 在画布上鼠标弹起，结束作画，详细逻辑：
    // 1 判断此时状态是否是正在拖动并鼠标弹起
    // 2 隐藏“画板框”，保持“拖动框”显示，显示“等待框”
    // 3 数据传输完成后，保存“拖动框”的数据到rectLists列表中，隐藏“等待框”
    // 4 初始化“拖动框”数据，等待下次调用
    drawSvgStop (e) {
      if (!this.pointerFocused) {
        if (this.drawSvgOrNot) {
          this.drawSvgOrNot = false
          this.pointerFocused = true

          // console.log(this.imgW)
          // console.log(this.imgH)
          // console.log(this.startX)
          // console.log(this.startY)
          // console.log(this.stopX)
          // console.log(this.stopY)
          // 上传框选数据
          // console.log(this.snapSvgRect)
          // console.log(this.startX)
          // console.log(this.startY)
          // console.log(this.stopX)
          // console.log(this.stopY)
          let overflowChecked = this.checkRectOverflow(this.snapSvgRect.x, this.snapSvgRect.y, this.snapSvgRect.w, this.snapSvgRect.h)
          this.snapSvgRect.x = overflowChecked.x
          this.snapSvgRect.y = overflowChecked.y
          this.snapSvgRect.w = overflowChecked.w
          this.snapSvgRect.h = overflowChecked.h
          let param = {
            x: this.getImageX(overflowChecked.x),
            y: this.getImageY(overflowChecked.y),
            width: this.getImageX(overflowChecked.x + overflowChecked.w) - this.getImageX(overflowChecked.x),
            height: this.getImageY(overflowChecked.y + overflowChecked.h) - this.getImageY(overflowChecked.y),
            type: this.anchorPointFocused ? 1 : 0,
            templateId: this.$route.query.id
          }
          console.log(param)
          // let length = this.svgRectList.length
          this.checkRect(param, (res) => {
            this.snapSvgRect.data = res.data
            this.snapSvgRect.index = this.getIndex(this.snapSvgRect.type)
            this.snapSvgRect.name = 'item' + this.getIndex(this.snapSvgRect.type).toString()
            // console.log(this.svgRectList)
            this.startX = 0
            this.startY = 0
            this.stopX = 0
            this.stopY = 0
            this.svgRectList.push(this.snapSvgRect)
            this.drawSvgVisibility = false
            this.snapSvgRect = {
              id: this.getId(),
              x: 0,
              y: 0,
              w: 0,
              h: 0,
              type: '',
              choosed: false
            }
            this.pointerFocused = false
          })
        }
      }
    },
    // 框选文字内容，用于生成框时及修改框时
    checkRect (param, callback) {
      this.waitSvgVisibility = true
      this.$api.checkRect(param).then(res => {
        if (res.success) {
          this.waitSvgVisibility = false
          callback(res)
        } else {
          this.$message.error(res.message)
        }
      })
    },
    // table文字内容，用于修改框时(生成框默认置空)
    checkTable (param, callback) {
      this.waitSvgVisibility = true
      this.$api.checkTable(param).then(res => {
        if (res.success) {
          this.waitSvgVisibility = false
          callback(res)
        } else {
          this.$message.error(res.message)
        }
      })
    },
    // 删除单个框框 仅浏览器删除，删除后台数据还要点击保存
    handleDeleteBtnOnclick (value) {
      console.log(value)
      this.svgRectList.splice(value, 1)
      console.log(this.svgRectList)
    },
    // 生成框框的tab值，拖动框后台记录在一个列表中，但浏览器显示是分别显示的，所以需要计算其index值
    getIndex (value) {
      if (value === 'anchorPoint') {
        let index = 1
        for (let i in this.svgRectList) {
          if (this.svgRectList[i].type === 'anchorPoint') {
            index++
          }
        }
        return index
      } else {
        let index = 1
        for (let i in this.svgRectList) {
          if (this.svgRectList[i].type !== 'anchorPoint') {
            index++
          }
        }
        return index
      }
    },
    // 生成拖动框的本地id，便于浏览器显示，例如拖动框尚未保存至后台，但浏览器操作需要用这个id找到对应的拖动框
    getId () {
      let myDate = new Date()
      let md5 = crypto.createHash('md5')
      md5.update(myDate.getTime().toString())
      return md5.digest('hex') + Math.ceil(Math.random() * 10).toString()
    },
    // 获取画板宽高
    getDrawBoardWH () {
      this.drawBoardH = this.$refs.mainBody.offsetHeight
      this.drawBoardW = this.$refs.mainBody.offsetWidth
      // console.log('width:' + this.drawBoardW + ',height:' + this.drawBoardH)
    },
    // 获取图片宽高 用于计算原始图片长宽与浏览器显示图片长宽的对应关系
    getImgWH (value, initializeRects) {
      let img = new Image()

      // 改变图片的src
      img.src = value

      // 加载完成执行
      img.onload = () => {
        // 打印
        this.imgW = img.width
        this.imgH = img.height
        this.imgWhiteBar = (this.imgW / this.imgH) > (this.drawBoardW / this.drawBoardH)
        console.log(this.imgWhiteBar)
        // 将后台传来的原始数据转为浏览器显示数据
        // 一方面是算图片像素点和浏览器像素点之间的转换
        // 另一方面是换字段名称
        initializeRects()
      }
    },
    // 依据图片像素获得浏览器像素X
    getScreenX (x) {
      if (this.imgWhiteBar) { // 图片上下留白
        return this.drawBoardW * x / this.imgW
      } else { // 图片左右留白
        return (this.drawBoardW / 2 + (this.drawBoardH * x) / this.imgH - (this.imgW * this.drawBoardH) / (this.imgH * 2))
      }
    },
    // 依据图片像素获得浏览器像素Y
    getScreenY (y) {
      if (this.imgWhiteBar) { // 图片上下留白
        return (this.drawBoardH / 2 + (this.drawBoardW * y) / this.imgW - (this.imgH * this.drawBoardW) / (this.imgW * 2))
      } else { // 图片左右留白
        return this.drawBoardH * y / this.imgH
      }
    },
    // 依据浏览器像素获得图片像素X
    getImageX (x) {
      if (this.imgWhiteBar) { // 图片上下留白
        return parseInt(x * this.imgW / this.drawBoardW)
      } else { // 图片左右留白
        return parseInt((x * this.imgH) / this.drawBoardH + this.imgW / 2 - (this.drawBoardW * this.imgH) / (this.drawBoardH * 2))
      }
    },
    // 依据浏览器像素获得图片像素X
    getImageY (y) {
      if (this.imgWhiteBar) { // 图片上下留白
        return parseInt((y * this.imgW) / this.drawBoardW + this.imgH / 2 - (this.drawBoardH * this.imgW) / (this.drawBoardW * 2))
      } else { // 图片左右留白
        return parseInt(y * this.imgH / this.drawBoardH)
      }
    },
    // 检查所画框是否越界
    // 输入画板上的像素值
    // 返回画板上的像素值
    checkRectOverflow (x, y, w, h) {
      let res = {
        x: 0,
        y: 0,
        w: 0,
        h: 0
      }
      if (this.imgWhiteBar) { // 图片上下留白
        if (x < 0) {
          res.w = x + w
          res.x = 0
        } else {
          res.x = x
          res.w = w
        }
        if ((res.x + res.w) > this.drawBoardW) {
          res.w = this.drawBoardW - res.x
        }
        let rectY1 = this.getImageY(y)
        let rectY2 = this.getImageY(y + h)
        // 所画框完全在图片上面
        if (rectY2 <= 0) {
          res.y = this.getScreenY(0)
          res.h = this.getScreenY(this.imgH * 0.2) - res.y
        }
        // 所画框骑在图片上边框
        if (rectY1 < 0 && rectY2 > 0 && rectY2 < this.imgH) {
          res.y = this.getScreenY(0)
          res.h = y + h - res.y
        }
        // 所画框在图片内部
        if (rectY1 >= 0 && rectY2 <= this.imgH) {
          res.y = y
          res.h = h
        }
        // 所画框骑在图片下边框
        if (rectY1 > 0 && rectY1 < this.imgH && rectY2 > this.imgH) {
          res.y = y
          res.h = this.getScreenY(this.imgH) - y
        }
        // 所画框完全在图片下侧
        if (rectY1 >= this.imgH) {
          res.y = this.getScreenY(this.imgH * 0.8)
          res.h = this.getScreenY(this.imgH) - res.y
        }
        // 所画框骑在图片上边框且骑在图片下边框
        if (rectY1 < 0 && rectY2 > this.imgH) {
          res.y = this.getScreenY(0)
          res.h = this.getScreenY(this.imgH) - res.y
        }
        return res
      } else {
        if (x < 0) {
          res.h = y + h
          res.y = 0
        } else {
          res.y = y
          res.h = h
        }
        if ((res.y + res.h) > this.drawBoardH) {
          res.h = this.drawBoardH - res.y
        }
        let rectX1 = this.getImageX(x)
        let rectX2 = this.getImageX(x + w)
        // 所画框完全在图片左侧
        if (rectX2 <= 0) {
          res.x = this.getScreenX(0)
          res.w = this.getScreenX(this.imgW * 0.2) - res.x
        }
        // 所画框骑在图片左边框
        if (rectX1 < 0 && rectX2 > 0 && rectX2 < this.imgW) {
          res.x = this.getScreenX(0)
          res.w = x + w - res.x
        }
        // 所画框在图片内部
        if (rectX1 >= 0 && rectX2 <= this.imgW) {
          res.x = x
          res.w = w
        }
        // 所画框骑在图片右边框
        if (rectX1 > 0 && rectX1 < this.imgW && rectX2 > this.imgW) {
          res.x = x
          res.w = this.getScreenX(this.imgW) - x
        }
        // 所画框完全在图片右侧
        if (rectX1 >= this.imgW) {
          res.x = this.getScreenX(this.imgW * 0.8)
          res.w = this.getScreenX(this.imgW) - res.x
        }
        // 所画框骑在图片左边框且骑在图片右边框
        if (rectX1 < 0 && rectX2 > this.imgW) {
          res.x = this.getScreenX(0)
          res.w = this.getScreenX(this.imgW) - res.x
        }
        return res
      }
    }
  }
}
</script>

<style scoped>
  .ocr-formwork-management {
    background: #f0f4f5;
    display: flex;
  }

  .formwork-management-wrapper {
    /*padding: 30px 0;*/
    background: #fff;
    flex: 1;
  }

  .ocr-formwork-management__row {
    height: calc(100vh - 120px);
  }

  .ocr-formwork-management__row::after {
    clear: both;
  }

  .ocr-formwork-management__row::after, .ocr-formwork-management__row::before {
    display: table;
    content: "";
  }

  .ocr-formwork-management__row-left {
    float: left;
    width: 899px;
    height: 100%;
    border-right: 1px solid #E4E7ED;
  }

  .ocr-formwork-management__row-left__main-body {
    text-align: center;
    height: calc(100vh - 190px);
  }

  .cursor-crosshair {
    cursor: crosshair;
  }

  .cursor-default {
    cursor: default;
  }

  .cursor-not-allowed {
    cursor: not-allowed;
  }

  .cursor-wait {
    cursor: wait;
  }

  .ocr-formwork-management__row-right {
    float: left;
    width: 300px;
    height: 100%;
    background-color: #fff
  }

  .dragger-layout--anchor-point {
    border: 1px solid #ebeef5;
    margin: 0 10px 10px 10px;
    width: 280px; height: 40px;
    background-color: #fff;
    display: flex;
    cursor: pointer;
  }
  .dragger-layout--anchor-point__tag {
    margin: 6px 5px 6px 6px;
    width: 28px;
    height: 28px;
    background-color: #ff3d3d;
    text-align: center;
    font-size: 16px;
    color: #FFFFFF;
    line-height: 28px;
    cursor: pointer;
  }
  .dragger-layout--anchor-point__input {
    margin: 6px 5px 6px 5px;
    width: 180px;
  }

  .dragger-layout--text-point {
    border: 1px solid #ebeef5;
    margin: 0 10px 10px 10px;
    width: 280px;
    background-color: #fff;
    cursor: pointer;
  }
  .dragger-layout--text-point__line {
    display: flex;
  }
  .dragger-layout--text-point__tag {
    margin: 6px 5px 6px 6px;
    width: 28px;
    height: 28px;
    background-color: #3293E3;
    text-align: center;
    font-size: 16px;
    color: #FFFFFF;
    line-height: 28px;
    cursor: pointer;
  }
  .dragger-layout--text-point__key {
    font-size: 12px;
    line-height: 40px;
    margin-left: 3px
  }
  .dragger-layout--text-point__input {
    margin: 6px 0;
    width: 135px;
  }
  .dragger-layout--text-point__OCR-res {
    font-size: 12px;
    line-height: 40px;
    margin-left: 5px
  }

  .dragger-layout--table-point {
    border: 1px solid #ebeef5;
    margin: 0 10px 10px 10px;
    width: 280px;
    background-color: #fff;
    cursor: pointer;
  }
  .dragger-layout--table-point__line {
    display: flex;
  }
  .dragger-layout--table-point__tag {
    margin: 6px 5px 6px 6px;
    width: 28px;
    height: 28px;
    background-color: #3293E3;
    text-align: center;
    font-size: 16px;
    color: #FFFFFF;
    line-height: 28px;
    cursor: pointer;
  }
  .dragger-layout--table-point__key {
    font-size: 12px;
    line-height: 40px;
    margin-left: 3px
  }
  .dragger-layout--table-point__input {
    margin: 6px 0;
    width: 135px;
  }
  .dragger-layout--table-point__OCR-res {
    line-height: 28px;
    margin: 10px 10px 10px 45px;
    font-size: 12px
  }

  .dragger-layout--shadow {
    box-shadow: 0 2px 12px 0 rgba(0,0,0,.2);
  }

</style>
