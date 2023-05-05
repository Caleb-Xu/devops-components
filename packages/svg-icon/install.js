import SvgIcon from './index.vue'

SvgIcon.install = Vue => {
    Vue.components(SvgIcon.name, SvgIcon)
}

export default SvgIcon
