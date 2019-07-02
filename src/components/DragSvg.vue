<template>
  <!--拖拽框，可以生成红色普通框 蓝色普通框 蓝色table-->
  <!--其中 type prop 可选-->
  <!--anchorPoint&#45;&#45;红色&#45;&#45;锚点-->
  <!--textPoint&#45;&#45;蓝色&#45;&#45;普通文本-->
  <!--tablePoint&#45;&#45;蓝色&#45;&#45;表格-->
  <g
    @mouseup="moveStop">
    <rect
      :x="correctAttr.x"
      :y="correctAttr.y"
      :width="correctAttr.w"
      :height="correctAttr.h"
      :class="mainSvgCss"
      @mousedown="move">
    </rect>
    <rect
      v-if="correctAttr.choosed"
      :x="correctAttr.x - 4"
      :y="correctAttr.y - 4"
      :width="8"
      :height="8"
      :class="mainSvgControllarCss"
      class="cursor-ul-dr"
      @mousedown="upLeftMove">
    </rect>
    <rect
      v-if="correctAttr.choosed"
      :x="correctAttr.x - 4 + correctAttr.w/2"
      :y="correctAttr.y - 4"
      :width="8"
      :height="8"
      :class="mainSvgControllarCss"
      class="cursor-up-down"
      @mousedown="upMove">
    </rect>
    <rect
      v-if="correctAttr.choosed"
      :x="correctAttr.x - 4 + correctAttr.w"
      :y="correctAttr.y - 4"
      :width="8"
      :height="8"
      :class="mainSvgControllarCss"
      class="cursor-ur-dl"
      @mousedown="upRightMove">
    </rect>
    <rect
      v-if="correctAttr.choosed"
      :x="correctAttr.x - 4"
      :y="correctAttr.y - 4 + correctAttr.h/2"
      :width="8"
      :height="8"
      :class="mainSvgControllarCss"
      class="cursor-left-right"
      @mousedown="leftMove">
    </rect>
    <rect
      v-if="correctAttr.choosed"
      :x="correctAttr.x - 4 + correctAttr.w"
      :y="correctAttr.y - 4 + correctAttr.h/2"
      :width="8"
      :height="8"
      :class="mainSvgControllarCss"
      class="cursor-left-right"
      @mousedown="rightMove">
    </rect>
    <rect
      v-if="correctAttr.choosed"
      :x="correctAttr.x - 4"
      :y="correctAttr.y - 4 + correctAttr.h"
      :width="8"
      :height="8"
      :class="mainSvgControllarCss"
      class="cursor-ur-dl"
      @mousedown="downLeftMove">
    </rect>
    <rect
      v-if="correctAttr.choosed"
      :x="correctAttr.x - 4 + correctAttr.w/2"
      :y="correctAttr.y - 4 + correctAttr.h"
      :width="8"
      :height="8"
      :class="mainSvgControllarCss"
      class="cursor-up-down"
      @mousedown="downMove">
    </rect>
    <rect
      v-if="correctAttr.choosed"
      :x="correctAttr.x - 4 + correctAttr.w"
      :y="correctAttr.y - 4 + correctAttr.h"
      :width="8"
      :height="8"
      :class="mainSvgControllarCss"
      class="cursor-ul-dr"
      @mousedown="downRightMove">
    </rect>

    <line
      v-for="(i, index) in correctAttr.bar"
      :key="i.id"
      :x1="correctAttr.x + (correctAttr.w * i.w)"
      :y1="correctAttr.y"
      :x2="correctAttr.x + (correctAttr.w * i.w)"
      :y2="correctAttr.y + correctAttr.h"
      class="main-svg--table__bar"
      @mousedown="tableBarMove(index)">
    </line>
  </g>
</template>

<script>
export default {
  name: 'DragSvg',
  data () {
    return {
      drawBoard: { // 原本打算用来计算画板长宽，做一点小优化，暂未完工
        w: 1200,
        h: 500
      },
      moved: false // 记录当前图形是否被移动，若只是点击，该值保持false，若被移动，true
    }
  },
  props: {
    attr: {
      type: Object
    },
    index: {
      type: Number
    },
    type: {
      type: String
    }
  },
  computed: {
    correctAttr: {
      set (value) {

      },
      get () {
        let correct = this.attr
        if (correct.w < 0) {
          correct.x = correct.x + correct.w
          correct.w = 0 - correct.w
        }
        if (correct.h < 0) {
          correct.y = correct.y + correct.h
          correct.h = 0 - correct.h
        }
        return correct
      }
    },
    mainSvgCss () {
      return {
        'main-svg--red': this.type === 'anchorPoint',
        // 'main-svg--blue': this.type === 'textPoint',
        'main-svg--blue': (this.type === 'textPoint') || (this.type === 'tablePoint')
      }
    },
    mainSvgControllarCss () {
      return {
        'main-svg--red__controllar': this.type === 'anchorPoint',
        'main-svg--blue__controllar': (this.type === 'textPoint') || (this.type === 'tablePoint')
        // 'main-svg--table__controllar': this.type === 'tablePoint'
      }
    }
  },
  methods: {
    checkRectPosition (object, drawBoard) {
      if (object.x < 0) {
        object.x = 0
      }
      if ((object.x + object.w) > drawBoard.w) {
        object.x = drawBoard.w - object.w
      }
      if (object.y < 0) {
        object.y = 0
      }
      if ((object.y + object.h) > drawBoard.h) {
        object.y = drawBoard.h - object.h
      }
      return object
    },
    moveStop () {
      let a = this.correctAttr
      if (this.moved) {
        this.$emit('listenToDragSvgEvent', a, this.index, true)
      }

      this.moved = false
    },
    move (e) {
      let positionX = this.correctAttr.x
      let positionY = this.correctAttr.y

      // 算出鼠标相对元素的位置
      let disX = e.clientX - this.correctAttr.x
      // console.log(disX)
      let disY = e.clientY - this.correctAttr.y
      // console.log(disY)
      document.onmousemove = (e) => { // 鼠标按下并移动的事件
        this.moved = true
        // 用鼠标的位置减去鼠标相对元素的位置，得到元素的位置
        // 绑定元素位置到positionX和positionY上面
        positionX = e.clientX - disX
        positionY = e.clientY - disY
        let a = this.correctAttr
        a.x = positionX
        a.y = positionY
        this.$emit('listenToDragSvgEvent', a, this.index)
      }
      document.onmouseup = (e) => {
        document.onmousemove = null
        document.onmouseup = null
      }
    },
    // 左上角拖拽
    upLeftMove (e) {
      this.moved = true
      let positionX = this.correctAttr.x
      let positionY = this.correctAttr.y
      let widthW = this.correctAttr.w
      let heightH = this.correctAttr.h

      // 算出鼠标相对元素的位置
      let disX = e.clientX - this.correctAttr.x
      // console.log(disX)
      let disY = e.clientY - this.correctAttr.y
      // console.log(disY)
      document.onmousemove = (e) => { // 鼠标按下并移动的事件
        // 用鼠标的位置减去鼠标相对元素的位置，得到元素的位置
        // 绑定元素位置到positionX和positionY上面
        positionX = e.clientX - disX
        positionY = e.clientY - disY
        widthW = this.correctAttr.x - positionX + this.correctAttr.w
        heightH = this.correctAttr.y - positionY + this.correctAttr.h
        if (widthW < 0) {
          widthW = 0
        }
        if (heightH < 0) {
          heightH = 0
        }
        let a = this.correctAttr
        a.x = positionX
        a.y = positionY
        a.w = widthW
        a.h = heightH
        this.$emit('listenToDragSvgEvent', a, this.index)
      }
      document.onmouseup = (e) => {
        document.onmousemove = null
        document.onmouseup = null
      }
    },
    // 上拖拽
    upMove (e) {
      this.moved = true
      let positionY = this.correctAttr.y
      let heightH = this.correctAttr.h

      // 算出鼠标相对元素的位置
      let disY = e.clientY - this.correctAttr.y
      // console.log(disY)
      document.onmousemove = (e) => { // 鼠标按下并移动的事件
        // 用鼠标的位置减去鼠标相对元素的位置，得到元素的位置
        // 绑定元素位置到positionX和positionY上面
        positionY = e.clientY - disY
        heightH = this.correctAttr.y - positionY + this.correctAttr.h
        if (heightH < 0) {
          heightH = 0
        }
        let a = this.correctAttr
        a.y = positionY
        a.h = heightH
        this.$emit('listenToDragSvgEvent', a, this.index)
      }
      document.onmouseup = (e) => {
        document.onmousemove = null
        document.onmouseup = null
      }
    },
    // 右上角拖拽
    upRightMove (e) {
      this.moved = true
      let positionY = this.correctAttr.y
      let widthW = this.correctAttr.w
      let heightH = this.correctAttr.h

      // 算出鼠标相对元素的位置
      // console.log(disX)
      let disY = e.clientY - this.correctAttr.y
      // console.log(disY)
      document.onmousemove = (e) => { // 鼠标按下并移动的事件
        // 用鼠标的位置减去鼠标相对元素的位置，得到元素的位置
        // 绑定元素位置到positionX和positionY上面
        positionY = e.clientY - disY
        widthW = e.offsetX - this.correctAttr.x
        heightH = this.correctAttr.y - positionY + this.correctAttr.h
        if (widthW < 0) {
          widthW = 0
        }
        if (heightH < 0) {
          heightH = 0
        }
        let a = this.correctAttr
        a.y = positionY
        a.w = widthW
        a.h = heightH
        this.$emit('listenToDragSvgEvent', a, this.index)
      }
      document.onmouseup = (e) => {
        document.onmousemove = null
        document.onmouseup = null
      }
    },
    // 左拖拽
    leftMove (e) {
      this.moved = true
      let positionX = this.correctAttr.x
      let widthW = this.correctAttr.w

      // 算出鼠标相对元素的位置
      let disX = e.clientX - this.correctAttr.x
      document.onmousemove = (e) => { // 鼠标按下并移动的事件
        // 用鼠标的位置减去鼠标相对元素的位置，得到元素的位置
        // 绑定元素位置到positionX和positionY上面
        positionX = e.clientX - disX
        widthW = this.correctAttr.x - positionX + this.correctAttr.w
        if (widthW < 0) {
          widthW = 0
        }
        let a = this.correctAttr
        a.x = positionX
        a.w = widthW
        this.$emit('listenToDragSvgEvent', a, this.index)
      }
      document.onmouseup = (e) => {
        document.onmousemove = null
        document.onmouseup = null
      }
    },
    // 右拖拽
    rightMove (e) {
      this.moved = true
      let widthW = this.correctAttr.w

      // 算出鼠标相对元素的位置
      document.onmousemove = (e) => { // 鼠标按下并移动的事件
        // 用鼠标的位置减去鼠标相对元素的位置，得到元素的位置
        // 绑定元素位置到positionX和positionY上面
        // console.log(e)
        widthW = e.offsetX - this.correctAttr.x
        if (widthW < 0) {
          widthW = 0
        }
        let a = this.correctAttr
        a.w = widthW
        this.$emit('listenToDragSvgEvent', a, this.index)
      }
      document.onmouseup = (e) => {
        document.onmousemove = null
        document.onmouseup = null
      }
    },
    // 左下角拖拽
    downLeftMove (e) {
      this.moved = true
      let positionX = this.correctAttr.x
      let widthW = this.correctAttr.w
      let heightH = this.correctAttr.h

      // 算出鼠标相对元素的位置
      let disX = e.clientX - this.correctAttr.x
      document.onmousemove = (e) => { // 鼠标按下并移动的事件
        // 用鼠标的位置减去鼠标相对元素的位置，得到元素的位置
        // 绑定元素位置到positionX和positionY上面
        positionX = e.clientX - disX
        widthW = this.correctAttr.x - positionX + this.correctAttr.w
        heightH = e.offsetY - this.correctAttr.y
        // console.log('e.clientY', e.clientY)
        // console.log('this.correctAttr.y', this.correctAttr.y)
        if (widthW < 0) {
          widthW = 0
        }
        if (heightH < 0) {
          heightH = 0
        }
        let a = this.correctAttr
        a.x = positionX
        a.w = widthW
        a.h = heightH
        this.$emit('listenToDragSvgEvent', a, this.index)
      }
      document.onmouseup = (e) => {
        document.onmousemove = null
        document.onmouseup = null
      }
    },
    // 下拖拽
    downMove (e) {
      this.moved = true
      let heightH = this.correctAttr.h

      // 算出鼠标相对元素的位置
      // console.log(disY)
      document.onmousemove = (e) => { // 鼠标按下并移动的事件
        // 用鼠标的位置减去鼠标相对元素的位置，得到元素的位置
        // 绑定元素位置到positionX和positionY上面
        heightH = e.offsetY - this.correctAttr.y
        if (heightH < 0) {
          heightH = 0
        }
        let a = this.correctAttr
        a.h = heightH
        this.$emit('listenToDragSvgEvent', a, this.index)
      }
      document.onmouseup = (e) => {
        document.onmousemove = null
        document.onmouseup = null
      }
    },
    // 右下角拖拽
    downRightMove (e) {
      this.moved = true
      let widthW = this.correctAttr.w
      let heightH = this.correctAttr.h

      // 算出鼠标相对元素的位置
      document.onmousemove = (e) => { // 鼠标按下并移动的事件
        // 用鼠标的位置减去鼠标相对元素的位置，得到元素的位置
        // 绑定元素位置到positionX和positionY上面
        widthW = e.offsetX - this.correctAttr.x
        heightH = e.offsetY - this.correctAttr.y
        if (widthW < 0) {
          widthW = 0
        }
        if (heightH < 0) {
          heightH = 0
        }
        let a = this.correctAttr
        a.w = widthW
        a.h = heightH
        this.$emit('listenToDragSvgEvent', a, this.index)
      }
      document.onmouseup = (e) => {
        document.onmousemove = null
        document.onmouseup = null
      }
    },
    // 表格分割栏
    tableBarMove (value) {
      this.moved = true
      let positionX = this.correctAttr.bar[value].w

      // 算出鼠标相对元素的位置
      document.onmousemove = (e) => { // 鼠标按下并移动的事件
        // 用鼠标的位置减去鼠标相对元素的位置，得到元素的位置
        positionX = (e.layerX - this.correctAttr.x) / this.correctAttr.w
        if (positionX < 0) {
          positionX = 0
        } else if (positionX > 1) {
          positionX = 1
        }
        let a = this.correctAttr
        a.bar[value].w = positionX
        this.$emit('listenToDragSvgEvent', a, this.index)
      }
      document.onmouseup = (e) => {
        document.onmousemove = null
        document.onmouseup = null
      }
    }
  }
}
</script>

<style scoped>
  /*红色配色*/
  .main-svg--red {
    fill: rgba(255, 61, 61, 0.3);
    stroke: rgb(255, 61, 61);
    stroke-width: 1;
    cursor: move;
  }
  .main-svg--red:hover {
    stroke: rgb(255, 255, 255);
  }
  .main-svg--red__controllar {
    fill: rgba(255, 255, 255, 1);
    stroke: rgb(255, 61, 61);
    stroke-width: 1;
  }

  /*蓝色配色*/
  .main-svg--blue {
    fill: rgba(0, 118, 255, 0.3);
    stroke: rgb(0, 118, 255);
    stroke-width: 1;
    cursor: move;
  }
  .main-svg--blue:hover {
    stroke: rgb(255, 255, 255);
  }
  .main-svg--blue__controllar {
    fill: rgba(255, 255, 255, 1);
    stroke: rgb(0, 118, 255);
    stroke-width: 1;
  }
  .main-svg--table__bar {
    stroke: rgb(0, 118, 255);
    stroke-width: 2;
    cursor: e-resize;
  }

  /*上下*/
  .cursor-up-down {
    cursor: n-resize;
  }
  /*左右*/
  .cursor-left-right {
    cursor: w-resize;
  }
  /*左上-右下*/
  .cursor-ul-dr {
    cursor: se-resize;
  }
  /*左下-右上*/
  .cursor-ur-dl {
    cursor: sw-resize;
  }
</style>
