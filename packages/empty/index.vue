<template>
    <div class="devops-empty-container">
        <!-- 图片 -->
        <div class="devops-empty-container-image">
            <template v-if="!$slots.default">
                <img v-if="imageSize === 'normal'" src="./image/normal.png">
                <img v-if="imageSize === 'small'" src="./image/small.png">
            </template>
            <slot></slot>
        </div>
        <!-- 主文案 -->
        <div class="devops-empty-container-main-title title-common" :style="{ 'font-size': imageSize === 'normal' ? '14px' : '12px' }"> {{mainTitle}} </div>
        <!-- 小尺寸时不显示副标题及添加按钮 -->
        <template v-if="imageSize === 'normal'">
            <!-- 副文案 -->
            <div v-if="subTitle" class="devops-empty-container-sub-title title-common" :title="subTitle"> {{subTitle}} </div>
            <!-- 按钮 -->
            <bk-button v-if="showAddBtn" theme="primary" :title="addBtnInfo" @click="onClickAdd">
                {{addBtnInfo}}
            </bk-button>
        </template>
    </div>
</template>

<script>
    import { defineComponent } from 'vue'
    export default defineComponent({
        name: 'empty',
        props: {
            // 图片大小
            imageSize: {
                type: String,
                required: false,
                default: 'normal',
                describe: '图片大小，如果在 select 中使用，请使用 small'
            },
            // 主文案
            mainTitle: {
                type: String,
                required: false,
                default: '暂无数据',
                describe: '主文案内容'
            },
            // 副文案
            subTitle: {
                type: String,
                required: false,
                describe: '副文案内容'
            },
            // 按钮是否显示
            showAddBtn: {
                type: Boolean,
                required: false,
                default: false,
                describe: '创建按钮是否显示'
            },
            // 按钮文案
            addBtnInfo: {
                type: String,
                required: false,
                default: '立即创建',
                describe: '创建按钮显示文案'
            }
        },
        methods: {
            onClickAdd () {
                this.$emit('clickAddHandler')
            }
        }
    })
</script>

<style lang="scss" scoped>
.devops-empty-container{
    width: 100%;
    height: 100%;
    min-height: 120px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    &-image{
        border-radius: 6px;
    }
    &-main{
        &-title{
            font-weight: 500;
            margin-block-end: 10px;
        }
    }
    &-sub{
        &-title{
            font-size: 12px;
            font-weight: 400;
            color: #8797AA;
            margin-block-end: 30px;
        }
    }
    .title-common{
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        width: 100%;
        text-align: center;
    }
}
</style>
