import Empty from './index.vue'

Empty.install = Vue => {
    Vue.components(Empty.name, Empty)
}

export default Empty
