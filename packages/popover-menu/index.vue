<template>
    <bk-popover ref="popover" theme="light" trigger="click" ext-cls="popover-menu" placement="bottom-start" v-bind="popoverConfig">
        <slot name="trigger">
            <svg-icon btn :size="iconSize" :name="iconName"></svg-icon>
        </slot>
        <ul :class="['popover-menu-list', { 'with-icon': isWithIcon }]" slot="content">
            <li
                v-for="menu in menuList"
                :key="menu.key"
                :class="[
                    'popover-menu-item',
                    {
                        'is-split': menu.split,
                        'is-danger': menu.danger,
                        'is-disabled': menu.disabled,
                    },
                ]"
                @click="handleClick(menu)"
            >
                <span>
                    <i v-if="menu.icon" :class="[menuIconClass, menu.icon]"></i>
                    {{ menu.label }}
                </span>
            </li>
        </ul>
    </bk-popover>
</template>

<script>
import { defineComponent } from "vue";
import SvgIcon from "@devops/svg-icon";

export default defineComponent({
    name: "popover-menu",
    components: {
        SvgIcon,
    },
    props: {
        iconName: {
            type: String,
            default: "more",
        },
        iconSize: {
            type: Number,
            default: 14,
        },
        menuIconClass: {
            type: String,
            default: "bk-icon",
        },
        menuList: {
            type: Array,
            default: () => [],
        },
        autoHide: {
            type: Boolean,
            default: true,
        },
        popoverConfig: {
            type: Object,
            default: () => ({}),
        },
    },
    computed: {
        isWithIcon() {
            return this.menuList.some((menu) => menu.icon);
        },
    },
    methods: {
        handleClick(menu) {
            if (menu.disabled) {
                return;
            }
            this.$emit("click-menu", menu);
            if (this.autoHide) {
                this.$refs.popover.hideHandler();
            }
        },
        hide() {
            this.$refs.popover.hideHandler();
        },
    },
});
</script>

<style lang="scss">
.bk-tooltip,
[id^="bk_pop"] {
    .tippy-popper {
        .tippy-tooltip {
            padding: 8px 0;
        }
    }
}

.popover-menu {
    ul,
    ol,
    li {
        margin: 0;
        padding: 0;
        list-style: none;
    }

    ::-webkit-scrollbar {
        width: 4px;
        height: 6px;
        background: #f2f2f2;
    }

    ::-webkit-scrollbar-thumb {
        height: 8px;
        border-radius: 20px;
        background-color: rgb(203 213 224 / 50%);

        &:hover {
            background-color: rgb(203 213 224 / 70%);
        }

        &:active {
            background-color: rgb(203 213 224);
        }
    }

    &-list {
        padding: 0 5px;
        color: #081e40;
        min-width: 100px;
        max-height: 325px;
        overflow-y: auto;

        &.with-icon {
            min-width: 120px;
        }
    }

    .popover-menu-item {
        line-height: 40px;
        padding: 0 15px;
        cursor: pointer;

        i {
            font-size: 14px;
            margin-right: 5px;
        }

        &.is-disabled {
            color: #8797aa;
            cursor: not-allowed;
        }

        &:not(.is-disabled):hover {
            color: #3a84ff;
            background: rgba(58, 132, 255, 0.1);
        }

        &.is-split {
            border-top: 1px solid #cbd5e080;
        }

        &.is-danger:hover {
            color: #c45a56;
            background: rgba(234, 55, 54, 0.2);
        }
    }
}
</style>
