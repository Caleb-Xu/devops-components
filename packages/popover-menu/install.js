import PopoverMenu from './index.vue'

PopoverMenu.install = Vue => {
    Vue.components(PopoverMenu.name, PopoverMenu)
}

export default PopoverMenu
