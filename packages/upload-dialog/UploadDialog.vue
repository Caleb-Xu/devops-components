<template>
    <section class="devops-upload-dialog">
        <bk-dialog
            width="600"
            :value="computedShow"
            :mask-close="false"
            :show-footer="false"
            header-position="left"
            @cancel="cancel"
            @value-change="computedShow = $event"
            :title="title"
        >
            <Uploader
                ref="uploader"
                name="file"
                :accept="accept"
                :url="url"
                v-bind="$attrs"
                :tip="accept ? `只允许上传${accept}格式的文件` : ''"
            ></Uploader>
        </bk-dialog>
        <div style="display: inline-block;" @click="computedShow = true">
            <slot>
                <bk-button theme="primary">{{ buttonText }}</bk-button>
            </slot>
        </div>
    </section>
</template>

<script>
import { defineComponent } from "vue";

import Uploader from "./Uploader.vue";

const component = defineComponent({
    name: "upload-dialog",
    emits: ['cancel', 'update:visible'],
    components: { Uploader },
    props: {
        /** visible可以不传 */
        visible: {
            type: Boolean,
            default: null
        },
        title: {
            type: String,
            default: "上传文件",
        },
        accept: {
            type: String,
        },
        url: {
            type: String,
            required: true
        },
        buttonText: {
            type: String,
            default: '点击上传'
        }
    },
    data () {
        return {
            show: false
        }
    },
    computed: {
        computedShow: {
            get () {
                return this.visible ?? this.show
            },
            set (val) {
                this.$emit('update:visible', val)
                this.show = val
            }
        }
    },
    watch: {
        visible: {
            handler (val) {
                this.show = val
            },
            immediate: true
        }
    },
    methods: {
        clearFiles() {
            this.$refs.uploader.clearFileList();
        },
        cancel() {
            this.$refs.uploader.clearFileList();
            this.$emit("cancel");
        },
    },
});

component.install = (Vue) => {
    Vue.use(component.name, component);
};

export default component;
</script>

<style lang="scss" scoped>
:deep(.bk-dialog) {
    .bk-dialog-body {
        max-height: 400px;
        overflow-y: auto;
    }
}

:deep(.etl-uploader.bk-upload.draggable) {
    width: 500px;
    margin: 0 auto;

    .file-wrapper {
        height: 165px;
    }

    .all-file .file-item {
        .progress-bar-wrapper {
            width: calc(100% - 20px);
        }
    }
}
</style>
