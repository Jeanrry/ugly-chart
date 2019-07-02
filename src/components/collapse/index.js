import UInput from './UInput.vue'
import UglyMenu from './Menu.vue'
import UglyMenuItem from './MenuItem.vue'
// 这里是重点
const Collapse = {
  install: function (Vue) {
    Vue.component('UglyInput', UInput)
    Vue.component('UglyMenu', UglyMenu)
    Vue.component('UglyMenuItem', UglyMenuItem)
  }
}

// 导出组件
export default Collapse
