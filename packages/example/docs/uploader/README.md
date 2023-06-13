# Uploader 上传文件

源自度量平台的一款上传组件，通过按钮触发弹窗，在弹窗内提供一个上传入口供用户选择文件上传。

## 示例

<template>
    <div style="padding: 20px;">
        <div style="margin-bottom: 20px;">弹窗形式——</div>
        <UploadDialog :url="uploadUrl" :handle-res-code="handleResCode"> </UploadDialog>
        <div style="margin-top: 20px;margin-bottom: 20px;">直接使用——</div>
        <Uploader :url="uploadUrl" :handle-res-code="handleResCode"> </Uploader>
        <img v-for="url of imgUrls" :key="url" :src="url" />
    </div>
</template>

<script>
import UploadDialog, { Uploader } from "@devops/upload-dialog";

export default {
    components: { UploadDialog, Uploader },
    data() {
        return {
            uploadUrl: 'https://jsonplaceholder.typicode.com/posts/',
            imgUrls: [],
        };
    },
    methods: {
        handleResCode(res, file) {
            this.imgUrls.push(URL.createObjectURL(file.origin));
            return true;
        },
    },
};
</script>

```vue
<template>
    <div style="padding: 20px;">
        <div style="margin-bottom: 20px;">弹窗形式——</div>
        <UploadDialog :url="uploadUrl" :handle-res-code="handleResCode"> </UploadDialog>
        <div style="margin-top: 20px;margin-bottom: 20px;">直接使用——</div>
        <Uploader :url="uploadUrl" :handle-res-code="handleResCode"> </Uploader>
        <img v-for="url of imgUrls" :key="url" :src="url" />
    </div>
</template>

<script>
import UploadDialog, { Uploader } from "@devops/upload-dialog";

export default {
    components: { UploadDialog, Uploader },
    data() {
        return {
            uploadUrl: "https://jsonplaceholder.typicode.com/posts/",
            imgUrls: [],
        };
    },
    methods: {
        handleResCode(res, file) {
            this.imgUrls.push(URL.createObjectURL(file.origin));
            return true;
        },
    },
};
</script>
```

## 参数

### UploaderDialog

| 参数       |           说明           |    类型 | 可选值 | 默认值     |
| ---------- | :----------------------: | ------: | ------ | ---------- |
| visible    | 弹窗是否可见（可以不传） | boolean | -      | -          |
| title      |         弹窗标题         |  string | -      | -          |
| buttonText |      默认的按钮文本      |  string | -      | '点击上传' |

其他参数详见`Uploader`参数列表

### Uploader

| 参数               |                        说明                         |                                                 类型 | 可选值 | 默认值                            |
| ------------------ | :-------------------------------------------------: | ---------------------------------------------------: | ------ | --------------------------------- |
| name               |                   上传后的文件名                    |                                               string | -      | 'upload_file'                     |
| multiple           |                 是否可上传多个文件                  |                                              boolean | -      | true                              |
| accept             | 可接受的文件类型（如果有多个类型用英文逗号`,`隔开） |                                               string | -      | -                                 |
| delayTime          |                      延迟时间                       |                                               number | -      | 0                                 |
| \* url             |                      请求路径                       |                                               string | -      | -                                 |
| size               |                  文件/图片尺寸上限                  | number / { maxFileSize: number, maxImgSize: number } | -      | { maxFileSize: 5, maxImgSize: 1 } |
| handleResCode      |              上传后是否成功的判断回调               |                     (res: any, file: any) => boolean | -      | () => true                        |
| header             |                   上传时的请求头                    |                          any[] / Record<string, any> | -      | -                                 |
| tip                |                      提示文本                       |                                               string | -      | ''                                |
| validateName       |                  文件名的校验正则                   |                                               RegExp | -      | -                                 |
| withCredentials    |             对应 http-`withCredentials`             |                                              boolean | -      | false                             |
| limit              |                    文件个数上限                     |                                               number | -      | 1                                 |
| formDataAttributes |                 自定义扩展长传属性                  |                   { name: 'attrName', value: any }[] | -      | -                                 |
| extCls             |                   组件 className                    |                                               string | -      | ''                                |
| customRequest      |                   自定义请求方式                    |                                             Function | -      | -                                 |
| sliceUpload        |                    是否分片上传                     |                                              boolean | -      | false                             |
| sliceUrl           |                   分片上传的 url                    |                                               string | -      | ''                                |
| mergeUrl           |                     合并的 url                      |                                               string | -      | ''                                |
| chunkSize          |                     分片的尺寸                      |                                               number | -      | 10                                |
| quickRemove        |                是否显示文件删除按钮                 |                                              boolean | -      | false                             |

## 插槽

### UploaderDialog

| 名称    | 说明                                           |
| ------- | ---------------------------------------------- |
| default | 唤起弹窗的触发器，点击唤起弹窗，默认为一个按钮 |

## 事件

### UploaderDialog

| 事件名称       | 说明              | 参数    |
| -------------- | :---------------- | :------ |
| cancel         | 点击关闭弹窗按钮  | -       |
| update:visible | 更新 visible 参数 | boolean |

### Uploader

| 事件名称    | 说明               | 参数                             |
| ----------- | :----------------- | :------------------------------- |
| on-exceed   | 文件超出上限时     | FileObj[]                        |
| on-error    | 上传失败时         | FileObj                          |
| on-progress | 上传进度更新时     | Event                            |
| on-success  | 上传成功时         | FileObj                          |
| on-done     | 上传完成时         | FileObj[]                        |
| on-delete   | 删除文件上传记录时 | FileObj                          |
| on-remove   | 移除文件时         | { index: number, file: FileObj } |
