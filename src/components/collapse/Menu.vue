<template>
<div class="ugly-menu">
  <ul>
    <li v-for="i in menuList" :key="i.id" class="ugly-nav-item">
      {{ i.title }}
      <!--{{ i }}-->
      <div v-for="is in i.children" :key="is.id" class="ugly-nav-group">
        {{ is.title }}
      </div>
    </li>
  </ul>
</div>
</template>

<script>
export default {
  name: 'ugly-menu',
  props: {
    // 菜单数据
    menuList: {
      type: Array
    },
    // 菜单模式 horizontal / vertical
    mode: {
      type: String,
      default: 'vertical'
    },
    // 菜单的背景色
    backgroundColor: {
      type: String,
      default: '#ffffff'
    },
    // 菜单的文字颜色
    textColor: {
      type: String,
      default: '#303133'
    },
    // 当前激活菜单的文字颜色
    activeTextColor: {
      type: String,
      default: '#409EFF'
    },
    // 当前激活菜单的 index
    defaultActive: {
      type: String
    },
    // 是否只保持一个子菜单的展开
    uniqueOpened: {
      type: Boolean,
      default: false
    },
    // 子菜单打开的触发方式(只在 mode 为 horizontal 时有效) hover / click
    menuTrigger: {
      type: String,
      default: 'hover'
    },
    // 是否使用 vue-router 的模式，启用该模式会在激活导航时以 index 作为 path 进行路由跳转
    router: {
      type: Boolean,
      default: false
    }
  },
  model: {
    prop: 'menuItem',
    event: 'menuItemChanged'
  },
  methods: {
  }
}
</script>

<style scoped>
  .ugly-menu {

  }

  .ugly-nav-item {
    line-height: 40px;
    min-height: 40px;
    font-size: 18px;
    padding: 0 20px;
  }
  .ugly-nav-group {
    padding: 0 60px;
  }
</style>
