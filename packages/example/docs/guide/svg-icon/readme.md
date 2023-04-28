<script>
    const requireAll = requireContext => requireContext.keys().map(requireContext)
    const req = require.context('./svg', true, /\.svg$/)
    requireAll(req)

    import SvgIcon from '@devops/svg-icon'

    export default {
        components: {
            SvgIcon
        },
        methods: {
            handleClick () {
                // TODo
            }
        }
    }
</script>

<style lang="scss">
.flex-center {
    display: flex;
    align-items: center;
    justify-content: center;
}

.mr10 {
    margin-right: 10px;
}
</style>

## SVG 图标（SvgIcon）

SVG 图标组件，通过`svg-sprite-loader`引入的 SVG 图标可以直接用图标名称使用，加上`icon-btn`的类名表现为 DevOps 标准按钮样式，加上`is-danger`的类名表现为危险按钮样式。

### 示例

<template>
    <div class="flex-center">
        <svg-icon btn class="mr10" size="14" name="edit"/>
        <svg-icon btn theme="danger" size="14" name="delete"/>
    </div>
</template>

#### 代码

```vue
<template>
    <div class="flex-center">
        <svg-icon btn class="mr10" size="14" name="edit" />
        <svg-icon btn theme="danger" size="14" name="delete" />
    </div>
</template>
```

#### 批量导入 SVG 文件

```js
const requireAll = (requireContext) => requireContext.keys().map(requireContext);
const req = require.context("./svg", true, /\.svg$/);
requireAll(req);
```

### 参数

| 参数     |        说明        |          类型 | 可选值         | 默认值       |
| -------- | :----------------: | ------------: | -------------- | ------------ |
| name     |      图标名称      |        string | -              | -            |
| size     |      图标大小      | number/string | -              | 14           |
| color    |    图标默认颜色    |        string | -              | currentColor |
| title    |  原生 title 属性   |        string | -              | -            |
| disabled |      是否禁用      |       boolean | -              | false        |
| stop     |    是否阻止冒泡    |       boolean | -              | false        |
| btn      |  是否作为按钮使用  |       boolean | -              | false        |
| theme    | 作为按钮时的主题色 |        string | default/danger | default      |

### 事件

| 事件名称   |     说明     | 参数 |
| ---------- | :----------: | ---: |
| item-click | 图标点击事件 |    - |
