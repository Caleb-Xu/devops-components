<template>
    <span
        :class="[
            'devops-svg-icon',
            {
                'is-disabled': disabled,
                'icon-btn': btn,
                'is-danger': theme === 'danger',
            },
        ]"
        @click="itemClick">
        <span class="icon-content" :title="title">
            <svg :width="size" :height="size" :style="{ fill: color }">
                <use v-bind="{ 'xlink:href': `#${name}` }"></use>
            </svg>
        </span>
        <span class="append-content" :style="{ color }">
            <slot name="append"></slot>
        </span>
    </span>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
    name: "svg-icon",
    props: {
        // SVG名称
        name: {
            type: String,
            default: "",
        },
        // 尺寸
        size: {
            type: [String, Number],
            default: 16,
        },
        // 颜色
        color: {
            type: String,
            default: "currentColor",
        },
        // 标题
        title: {
            type: String,
            default: "",
        },
        // 是否禁用
        disabled: {
            type: Boolean,
            default: false,
        },
        // 是否阻止冒泡
        stop: {
            type: Boolean,
            default: false,
        },
        // 是否作为按钮
        btn: {
            type: Boolean,
            default: false,
        },
        // 作为按钮时的主题色，default/danger
        theme: {
            type: String,
            default: "default",
        },
    },
    methods: {
        itemClick() {
            if (this.stop) event?.stopPropagation();
            if (!this.disabled) {
                this.$emit("item-click");
            }
        },
    },
});
</script>

<style lang="scss" scoped>
.devops-svg-icon {
    display: flex;
    align-items: center;

    .icon-content {
        display: flex;
    }

    &.is-disabled {
        cursor: not-allowed;

        svg {
            fill: #cbd5e0 !important;
        }

        .append-content {
            color: #cbd5e0 !important;
        }
    }

    &.icon-btn {
        height: 20px;
        cursor: pointer;
        color: #8797aa;
        padding: 0 3px;
        display: flex;
        align-items: center;
        justify-content: center;

        &:hover {
            color: #3a84ff;
            border-radius: 2px;
            background: rgba(58, 133, 255, 0.1);
        }

        &.is-danger {
            &:hover {
                color: #c45a56;
                background: rgba(234, 55, 54, 0.2);
                border-radius: 2px;
            }
        }
    }
}
</style>
