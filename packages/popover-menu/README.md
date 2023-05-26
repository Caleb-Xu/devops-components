# PopoverMenu 下拉菜单

基于蓝鲸组件库中 BkPopover 组件封装的通用下拉菜单组件。根据设计规范，最小宽度为 100px，菜单项有图标时最小宽度为 120px，超过 8 个菜单项时出现滚动条。默认使用 svg-icon 组件作为触发对象，需自行引入相关 SVG 文件。

## 示例

```vue
<script>
const requireAll = (requireContext) => requireContext.keys().map(requireContext);
const req = require.context("./svg", true, /\.svg$/);
requireAll(req);

import PopoverMenu from "@devops/popover-menu";

export default {
    components: {
        PopoverMenu,
    },
    data() {
        return {
            menuList: [
                { label: "编辑", key: "edit" },
                { label: "移动", key: "move", disabled: true },
                { label: "复制", key: "copy" },
                { label: "重命名", key: "rename" },
                { label: "创建子需求", key: "newDemand", split: true },
                { label: "创建子任务", key: "newTask" },
                { label: "创建生产缺陷", key: "newBug" },
                { label: "禁用", key: "disable", split: true, danger: true },
                { label: "删除", key: "remove", danger: true },
            ],
            menuWithIcon: [
                { label: "Apps", key: "apps", icon: "icon-apps" },
                { label: "Calendar", key: "calendar", icon: "icon-calendar" },
                { label: "Dialogue", key: "dialogue", icon: "icon-dialogue" },
                { label: "Clipboard", key: "clipboard", icon: "icon-clipboard" },
                { label: "Save", key: "save", icon: "icon-save", danger: true },
            ],
        };
    },
    methods: {
        onClickMenu(menu) {
            const { label, key } = menu;
            alert(`你点击了${label}，key为${key}`);
        },
    },
};
</script>

<template>
    <div class="example-container">
        <p>带分组/禁用状态/危险操作的操作菜单</p>
        <popover-menu :popover-config="{ offset: -55, distance: 10, width: 110 }" :menu-list="menuList" @click-menu="onClickMenu"> </popover-menu>
        <p>带图标的操作菜单</p>
        <popover-menu :popover-config="{ distance: 10 }" :menu-list="menuWithIcon" @click-menu="onClickMenu"> </popover-menu>
    </div>
</template>

<style>
.example-container {
    padding: 20px;
}
</style>
```

## 参数

| 参数          | 说明                   | 类型          | 可选值 | 默认值  |
| ------------- | :--------------------- | :------------ | :----- | :------ |
| iconName      | 图标按钮名称           | string        | -      | more    |
| iconSize      | 图标按钮大小           | number/string | -      | 14      |
| menuIconClass | 菜单项图标样式类名     | string        | -      | bk-icon |
| menuList      | 菜单列表               | menu 结构如下 | -      | -       |
| menu.label    | 菜单标题               | string        | -      | -       |
| menu.key      | 菜单唯一标识           | string        | -      | -       |
| menu.split    | 是否显示分割线         | boolean       | -      | -       |
| menu.disabled | 菜单是否禁用           | boolean       | -      | -       |
| menu.danger   | 是否为危险操作         | boolean       | -      | -       |
| autoHide      | 点击菜单后是否自动隐藏 | boolean       | -      | true    |
| popoverConfig | bkPopover 配置项       | object        | -      | -       |

## 插槽

| 名称    | 说明                                 |
| ------- | :----------------------------------- |
| trigger | 自定义触发对象，默认是 svg-icon 按钮 |

## 事件

| 事件名称   | 说明         | 参数 |
| ---------- | :----------- | :--- |
| menu-click | 菜单点击事件 | menu |

## 方法

| 方法名称 | 说明         | 参数 |
| -------- | :----------- | :--- |
| hide     | 手动隐藏菜单 | -    |
