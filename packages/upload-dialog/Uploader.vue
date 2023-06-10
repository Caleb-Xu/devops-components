<template>
    <div :class="['bk-upload draggable', extCls]">
        <div class="file-wrapper" tabindex="0" :class="{ isdrag }" @keydown="handleWrapEnter">
            <div>
                <i class="bk-icon upload-icon icon-upload-cloud"></i>
                <p class="text-area">
                    <span class="drop-upload">{{ dragText }}</span>
                    <span class="click-upload">{{ clickText }}</span>
                </p>
            </div>
            <input ref="uploadInput" tabindex="-1" @change="selectFile" :accept="accept" :multiple="multiple" type="file" />
        </div>
        <p class="tip" style="color: #8797aa" v-if="tip"><i class="bk-icon icon-exclamation-circle mr5"></i>{{ tip }}</p>
        <div class="all-file" v-if="fileList.length">
            <div v-for="(file, index) in fileList" :key="index">
                <div :class="{ 'file-item-fail': file.errorMsg }" class="file-item">
                    <i class="bk-icon icon-close-circle close-upload" title="移除" @click="deleteFile(index, file)"></i>
                    <i v-if="file.errorMsg" class="bk-icon icon-refresh close-upload" title="重试" @click="retry(index, file)"></i>
                    <i v-if="file.done && quickRemove" class="bk-icon icon-delete close-upload" title="删除" @click="removeFile(index, file)"></i>
                    <div class="file-info">
                        <div class="file-name">
                            <span>{{ file.name }}</span>
                        </div>
                        <div class="file-message">
                            <span class="upload-speed" v-show="!file.done && file.status === 'running'">{{ speed }}{{ unit }}</span>
                            <span class="file-size" v-show="!file.done">{{ filesize(file.size) }}</span>
                            <span class="file-size done" v-show="file.done">{{ t("uploadDone") }}</span>
                        </div>
                        <p v-if="file.errorMsg" v-bk-overflow-tips class="error-msg">{{ file.errorMsg }}</p>
                        <div v-else class="progress-bar-wrapper">
                            <div
                                :class="{
                                    success: file.done,
                                    uploading: file.status === 'running' && !file.errorMsg,
                                }"
                                class="progress-bar"
                                :style="{ width: file.progress }"
                            ></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { defineComponent } from "vue";
import { defaultRequest, sliceRequest } from "./request";

const uploaderI18n = {
    drag: "将文件拖到此处或",
    click: "点击上传",
    uploadDone: "上传完毕",
    uploading: "正在上传",
    reupload: "重新上传",
    replace: "点击替换",
    uploadFailed: "上传失败",
    invalidFileName: "文件名不合法",
    uploadLabel: "上传文件",
};

function t(str) {
    return uploaderI18n[str];
}

const component = defineComponent({
    name: "uploader",
    emits: ["on-exceed", "on-error", "on-progress", "on-success", "on-done", "on-delete", "on-remove"],
    props: {
        name: {
            type: String,
            default: "upload_file",
        },
        multiple: {
            type: Boolean,
            default: true,
        },
        accept: {
            type: String,
        },
        delayTime: {
            type: Number,
            default: 0,
        },
        url: {
            type: String,
            required: true
        },
        size: {
            type: [Number, Object],
            default: () => {
                return {
                    maxFileSize: 5,
                    maxImgSize: 1,
                };
            },
        },
        handleResCode: {
            type: Function,
            default: () => {
                return () => true
            },
        },
        header: {
            type: [Array, Object],
        },
        tip: {
            type: String,
            default: "",
        },
        validateName: {
            type: RegExp,
        },
        withCredentials: {
            type: Boolean,
            default: false,
        },
        limit: {
            type: Number,
            default: 1,
        },
        /**
         * 自定义扩展长传属性
         * 格式: { name: 'attrName', value: Object }
         */
        formDataAttributes: {
            type: Array,
            default: () => [],
        },
        // 外部设置的 class name
        extCls: {
            type: String,
            default: "",
        },
        customRequest: {
            type: Function,
        },
        sliceUpload: {
            type: Boolean,
            default: false,
        },
        sliceUrl: {
            type: String,
            default: "",
        },
        mergeUrl: {
            type: String,
            default: "",
        },
        chunkSize: {
            type: Number,
            default: 10,
        },
        quickRemove: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            dragText: "",
            clickText: "",
            showDialog: true,
            labelText: "",
            fileList: [],
            width: 0,
            fileIndex: null,
            speed: 0,
            total: 0,
            unit: "kb/s",
            isdrag: false,
            progress: 0,
        };
    },
    watch: {
        fileIndex(val) {
            if (val !== null && val < this.fileList.length) {
                if (!this.fileList[val].done) {
                    this.uploadFile(this.fileList[val]);
                } else {
                    this.fileIndex++;
                }
            }
        },
    },
    created() {
        this.dragText = t("drag");
        this.clickText = t("click");
        this.labelText = t("uploadLabel");
    },
    mounted() {
        /** 初始化拖拽上传 */
        const uploadEl = this.$refs.uploadInput;
        uploadEl.addEventListener("dragenter", () => {
            this.isdrag = true;
        });
        uploadEl.addEventListener("dragleave", () => {
            this.isdrag = false;
        });
        uploadEl.addEventListener("dragend", () => {
            this.isdrag = false;
        });
    },
    methods: {
        t: t,
        getValidTypeFiles(files) {
            return files.filter((file) => {
                const { type, name } = file;
                const extension = name.indexOf(".") > -1 ? `.${name.split(".").pop()}` : "";
                const baseType = type.replace(/\/.*$/, "");
                return this.accept
                    .split(",")
                    .map((type) => type.trim())
                    .filter((type) => type)
                    .some((acceptedType) => {
                        if (/\..+$/.test(acceptedType)) {
                            return extension === acceptedType;
                        }
                        if (/\/\*$/.test(acceptedType)) {
                            return baseType === acceptedType.replace(/\/\*$/, "");
                        }
                        if (/^[^\/]+\/[^\/]+$/.test(acceptedType)) {
                            return type === acceptedType;
                        }
                        return false;
                    });
            });
        },
        filesize(val) {
            const size = val / 1000;
            if (size < 1) {
                return `${val.toFixed(3)} KB`;
            }
            const index = size.toString().indexOf(".");
            return `${size.toString().slice(0, index + 2)} MB`;
        },
        // 处理外层容器 focus 时的 enter 按键事件
        handleWrapEnter(e) {
            if (e.target !== e.currentTarget) {
                return;
            }
            if ((e.keyCode === 13 || e.keyCode === 32) && this.$refs.uploadInput) {
                const el_ = this.$refs.uploadInput;
                el_.value = "";
                el_.click();
            }
        },
        preHandleFile(file) {
            const fileObj = {
                name: file.name,
                originSize: file.size,
                size: file.size / 1000,
                maxFileSize: 0,
                maxImgSize: 0,
                type: file.type,
                fileHeader: "",
                origin: file,
                url: "",
                sliceUrl: "",
                mergeUrl: "",
                chunkSize: 10,
                base64: "",
                status: "",
                done: false,
                responseData: "",
                speed: 0,
                errorMsg: "",
                progress: "",
            };

            const index = fileObj.type.indexOf("/");
            const type = fileObj.type.slice(0, index);
            fileObj.fileHeader = type;
            if (typeof this.size === "number") {
                fileObj.maxFileSize = this.size;
                fileObj.maxImgSize = this.size;
            } else {
                fileObj.maxFileSize = this.size.maxFileSize;
                fileObj.maxImgSize = this.size.maxImgSize;
            }

            if (fileObj.size > fileObj.maxFileSize * 1000) {
                fileObj.errorMsg = `文件不能超过 ${fileObj.maxFileSize} MB`;
            }
            if (this.validateName) {
                if (!this.validateName.test(fileObj.name)) {
                    fileObj.errorMsg = t("invalidFileName");
                }
            }
            return fileObj;
        },
        selectFile(e) {
            const el = e.target;
            const originalFiles = Array.from(el.files || []);
            const files = this.accept ? this.getValidTypeFiles(originalFiles) : originalFiles;
            if (!files.length) {
                el.value = "";
                return;
            }
            if (typeof this.limit === "number" && this.limit !== 1 && files.length + this.fileList.length > this.limit) {
                el.value = "";
                this.$emit("on-exceed", el.files, this.fileList);
                return;
            }

            files.forEach((file) => {
                const fileObj = this.preHandleFile(file);
                this.fileList.push(fileObj);
            });
            const len = this.fileList.length;
            const fileIndex = this.fileIndex;
            if (len - 1 === fileIndex) {
                this.uploadFile(this.fileList[fileIndex]);
            } else {
                this.fileIndex = 0;
            }
            el.value = "";
        },
        hideFileList() {
            if (this.delayTime) {
                setTimeout(() => {
                    this.fileList = [];
                    this.fileIndex = null;
                }, this.delayTime);
            }
        },
        uploadFile(fileObj) {
            if (fileObj.errorMsg) {
                this.fileIndex += 1;
                fileObj.progress = 100 + "%";
                this.$emit("on-error", fileObj, this.fileList);
                return;
            }
            // 保存分片上传的进度
            const progressList = [];
            const uploadProgress = (e, val) => {
                if (e.lengthComputable && !this.sliceUpload) {
                    const percentComplete = val || Math.round((e.loaded * 100) / e.total);
                    const kb = Math.round(e.loaded / 1000);
                    fileObj.progress = percentComplete + "%";
                    this.speed = kb - this.total;
                    this.total = kb;
                    this.unit = "kb/s";
                    if (this.speed > 1000) {
                        this.speed = Math.round(this.speed / 1000);
                        this.unit = "mb/s";
                    }
                    this.$emit("on-progress", e, fileObj, this.fileList);
                }
                // 计算分片上传的进度和速度
                if (e.lengthComputable && this.sliceUpload) {
                    // 保存每个分片上传的进度
                    progressList[val] = e.loaded;
                    // 计算已上传的总进度
                    const complete = progressList.reduce((p, c) => p + c);
                    const kb = Math.round(complete / 1000);
                    this.speed = kb - this.total;
                    this.total = kb;
                    this.unit = "kb/s";
                    if (this.speed > 1000) {
                        this.speed = Math.round(this.speed / 1000);
                        this.unit = "mb/s";
                    }
                    fileObj.progress = Math.round((complete * 100) / fileObj.origin.size) + "%";
                    if (fileObj.progress === 100 + "%") {
                        this.$emit("on-progress", e, fileObj, this.fileList);
                    }
                }
                fileObj.status = "running";
            };
            const options = {
                fileName: this.name,
                fileObj: fileObj,
                fileList: this.fileList,
                data: this.formDataAttributes || [],
                withCredentials: this.withCredentials,
                method: "POST",
                header: this.header,
                url: this.url,
                sliceUrl: this.sliceUrl,
                mergeUrl: this.mergeUrl,
                chunkSize: this.chunkSize,
                onProgress: (event, val) => {
                    uploadProgress(event, val);
                },
                onSuccess: (reponse, fileObj) => {
                    this.handleSuccess(reponse, fileObj);
                },
                onError: (fileObj, fileList, response) => {
                    this.$emit("on-error", fileObj, fileList, response);
                },
                onDone: (fileObj) => {
                    this.handleDone(fileObj);
                },
            };
            this.isdrag = false;
            const request = this.customRequest ? this.customRequest : this.sliceUpload ? sliceRequest : defaultRequest;
            request(options);
        },
        handleSuccess(response, file) {
            if (this.handleResCode(response, file)) {
                file.done = true;
                file.responseData = response;
                this.$emit("on-success", file, this.fileList);
            } else {
                file.errorMsg = response.message || t("uploadFailed");
                this.$emit("on-error", file, this.fileList);
            }
        },  
        handleDone(file) {
            this.fileIndex += 1;
            this.unit = "kb/s";
            this.total = 0;
            file.status = "done";
            if (this.fileIndex === this.fileList.length) {
                this.$emit("on-done", this.fileList);
                this.hideFileList();
            }
        },
        // 从文件列表中移除文件上传记录
        deleteFile(index, file) {
            if (file.xhr) {
                file.xhr.abort();
            }
            this.fileList.splice(index, 1);
            const len = this.fileList.length;
            if (!len) {
                this.fileIndex = null;
            }
            this.$emit("on-delete", file, this.fileList);
        },
        // 快捷删除已上传的文件
        removeFile(index, file) {
            this.$emit("on-remove", { index, file });
        },
        retry(index, file) {
            file = this.preHandleFile(file?.origin);
            this.fileIndex = index;
            this.fileList[index].errorMsg = "";
        },
        clearFileList() {
            this.fileList = [];
            this.fileIndex = null;
        },
    },
});

component.install = (Vue) => {
    Vue.use(component.name, component);
};

export default component;
</script>

<style lang="scss" scoped>
@import "./style/upload.scss";
</style>
