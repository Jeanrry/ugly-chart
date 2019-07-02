<template>
<div class="test">
  <button @click="addsvg">add</button>
  <svg width="100%" height="800">
    <g>
      <image
        x="0"
        y="0"
        width="100%"
        height="100%"
        @onload.native="imageOnload"
        :href="imgUrl"
        alt="图片"/>
    </g>
    <!--<g style="width: 100%">-->
      <!--<img-->
        <!--width="100%"-->
        <!--@onload.native="imageOnload"-->
        <!--:src="imgUrl"-->
        <!--alt="图片"/>-->
    <!--</g>-->

    <template v-for="(i, index) in svgRectList">
      <drag-svg
        :key="i.id"
        :attr="i"
        type="testPoint"
        :index="index"
        @listenToChildEvent="showMsgFromChild"
        @click.native="handleDragSvgOnclick(index, i.id)">
      </drag-svg>
    </template>
  </svg>

  <!--<svg width="100%" height="500">-->

    <!--<rect @mousedown="move" x="20" y="20" width="250" height="250" style="fill:blue;stroke:pink;stroke-width:5; fill-opacity:0.1;stroke-opacity:0.9; position: relative;"></rect>-->
    <!--&lt;!&ndash;<rect @mousedown="move" x="300" y="20" width="250" height="250" style="fill:blue;stroke:pink; stroke-width:5; opacity:0.9"></rect>&ndash;&gt;-->

  <!--</svg>-->

</div>
</template>

<script>
import DragSvg from '../components/DragSvg.vue'
export default {
  name: 'Test',
  data () {
    return {
      imgUrl: '/static/xbx.jpg',
      svgRectList: [
        {
          id: 0,
          x: 0,
          y: 0,
          w: 250,
          h: 250,
          choosed: false,
          bar: [
            {
              id: 0,
              w: 0.2
            },
            {
              id: 1,
              w: 0.4
            },
            {
              id: 2,
              w: 0.6
            },
            {
              id: 3,
              w: 0.8
            }
          ]
        },
        {
          id: 1,
          x: 300,
          y: 40,
          w: 250,
          h: 250,
          choosed: false
        },
        {
          id: 2,
          x: 600,
          y: 20,
          w: 250,
          h: 250,
          choosed: false
        },
        {
          id: 3,
          x: 900,
          y: 20,
          w: 250,
          h: 250,
          choosed: false
        }
      ]
    }
  },
  components: {
    DragSvg
  },
  methods: {
    move (e) {
    },
    addsvg () {
      this.svgRectList.push({
        id: 4,
        x: 0,
        y: 20,
        w: 250,
        h: 250
      })
      console.log(this.svgRectList)
    },
    showMsgFromChild (data, index) {
      // console.log(data)
      // console.log(index)
      this.svgRectList[index] = data
    },
    handleDragSvgOnclick (value) {
      for (let i in this.svgRectList) {
        this.svgRectList[i].choosed = false
      }
      this.svgRectList[value].choosed = true
    },
    imageOnload (e) {
      console.log(1456789)
      console.log(e)
    }
  }
}
</script>

<style scoped>
.test {
  width: 1200px;
  margin: 0 auto;
}
  /*.svg {*/
    /*border: 1px solid #999999;*/
  /*}*/
</style>
