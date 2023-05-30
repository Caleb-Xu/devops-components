import SparkMD5 from 'spark-md5'

export type FormDataAttributes = { name: string, value: string | Blob }[]
export type HeaderAttributes = { name: string, value: string } | { name: string, value: string }[]
export type XhrResponse = {
    code?: number
    message?: string,
    [key: string]: unknown
}

export type FileObj = {
    name: string
    originSize: number
    size: number
    maxFileSize: number
    maxImgSize: number
    type: string
    fileHeader: string
    origin: File
    url: string
    sliceUrl: string
    mergeUrl: string
    chunkSize: number
    base64: string
    status: string
    done: boolean
    responseData: unknown
    speed: number
    errorMsg: string
    progress: string
    xhr?: XMLHttpRequest
}

export type UploaderOptions = {
    fileName: string
    fileObj: FileObj
    fileList: FileObj[]
    data: FormDataAttributes
    withCredentials: boolean
    method: 'POST'
    header: HeaderAttributes
    url: string,
    sliceUrl: string
    mergeUrl: string
    chunkSize: number
    onProgress: (evt?: Event, index?: number) => void
    onSuccess: (res: XhrResponse, fileObj: FileObj) => void
    onError: (fileObj: FileObj, fileList: FileObj[], res: unknown) => void
    onDone: (fileObj: FileObj) => void
}

const parseResponse = (response: string): XhrResponse => {
    if (!response) {
        return {}
    }
    try {
        return JSON.parse(response)
    } catch (error) {
        return {}
    }
}

export const defaultRequest = (options: UploaderOptions): { abort:() => void } => {
    const xhr = new XMLHttpRequest()
    options.fileObj.xhr = xhr

    const formData = new FormData()
    options.data.forEach(item => {
        formData.append(item.name, item.value)
    })
    formData.append(options.fileName, options.fileObj.origin)

    xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
            const reponseText = parseResponse(xhr.responseText || xhr.response)
            if (xhr.status < 200 || xhr.status >= 300) {
                options.fileObj.progress = 100 + '%'
                options.fileObj.errorMsg = reponseText.message || '上传失败'
                options.onError(options.fileObj, options.fileList, xhr.response)
            } else {
                options.onSuccess(reponseText, options.fileObj)
            }
            options.onDone(options.fileObj)
        }
    }

    xhr.upload.addEventListener('progress', options.onProgress, false)
    xhr.withCredentials = options.withCredentials
    xhr.open(options.method, options.url, true)
    if (options.header) {
        if (Array.isArray(options.header)) {
            options.header.forEach(head => {
                const headerKey = head.name
                const headerVal = head.value
                xhr.setRequestHeader(headerKey, headerVal)
            })
        } else {
            const headerKey = options.header.name
            const headerVal = options.header.value
            xhr.setRequestHeader(headerKey, headerVal)
        }
    }
    xhr.send(formData)

    return {
        abort () {
            xhr.abort()
        }
    }
}

// 该方法用于在不同的浏览器使用不同的方式
const blobSlice = File.prototype.slice
export const sliceRequest = async (options: UploaderOptions): Promise<void> => {
    const chunkSize = options.chunkSize * 1024 * 1024
    const file = options.fileObj.origin
    if (!file) {
        window.measVue.$bkMessage({
            theme: 'warning',
            message: '没有获取到文件',
            offsetY: 80
        })
        return
    }
    const blockCount = Math.ceil(file.size / chunkSize)
    const hash = await hashFile(file, chunkSize)
    const progressList: Promise<unknown>[] = []
    sliceUpload(options, file, blockCount, hash, progressList, chunkSize)
    // 所有分片上传后，请求合并分片文件
    await Promise.all(progressList).then(() => {
    // 合并chunks
        const data = {
            size: file.size,
            name: file.name,
            total: blockCount,
            hash
        }
        const req = new XMLHttpRequest()
        req.open(options.method, options.mergeUrl, true)
        req.onreadystatechange = () => {
            if (req.readyState === 4) {
                const reponseText = parseResponse(req.responseText || req.response)
                if (req.status < 200 || req.status >= 300) {
                    options.fileObj.progress = 100 + '%'
                    options.fileObj.errorMsg = reponseText.message || '上传失败'
                    options.onError(options.fileObj, options.fileList, req.response)
                } else {
                    options.onSuccess(reponseText, options.fileObj)
                }
                options.onDone(options.fileObj)
            }
        }
        req.setRequestHeader('Content-type', 'application/JSON')
        req.send(JSON.stringify(data))
    })
}
// 请求分片上传，保存在progressList中
const sliceUpload = (options: UploaderOptions, file: File, blockCount: number, hash: string, progressList: Promise<unknown>[], chunkSize: number) => {
    for (let i = 0; i < blockCount; i++) {
        const pooltask = new Promise((resolve, reject) => {
            const start = i * chunkSize
            const end = Math.min(file.size, start + chunkSize)
            // 构建表单
            const formData = new FormData()
            options.data.forEach(item => {
                formData.append(item.name, item.value)
            })
            formData.append('file', blobSlice.call(file, start, end))
            formData.append('name', file.name)
            formData.append('total', blockCount.toString())
            formData.append('index', i.toString())
            formData.append('size', file.size.toString())
            formData.append('hash', hash)
            const xhr = new XMLHttpRequest()
            options.fileObj.xhr = xhr
            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4) {
                    const reponseText = parseResponse(xhr.responseText || xhr.response)
                    if (xhr.status < 200 || xhr.status >= 300) {
                        reject(xhr.response)
                        options.fileObj.progress = 100 + '%'
                        options.fileObj.errorMsg = reponseText.message || '上传失败'
                        options.onError(options.fileObj, options.fileList, xhr.response)
                    } else {
                        resolve('reponseText')
                    }
                    options.onDone(options.fileObj)
                }
            }
            xhr.upload.addEventListener('progress', (e) => options.onProgress(e, i), false)
            xhr.withCredentials = options.withCredentials
            xhr.open(options.method, options.sliceUrl, true)
            if (options.header) {
                if (Array.isArray(options.header)) {
                    options.header.forEach(head => {
                        const headerKey = head.name
                        const headerVal = head.value
                        xhr.setRequestHeader(headerKey, headerVal)
                    })
                } else {
                    const headerKey = options.header.name
                    const headerVal = options.header.value
                    xhr.setRequestHeader(headerKey, headerVal)
                }
            }
            xhr.send(formData)
        })
        progressList.push(pooltask)
    }
}
// SparkMD5分片文件
const hashFile = (file: File, chunkSize: number): Promise<string> => {
    return new Promise(resolve => {
        const chunks = Math.ceil(file.size / chunkSize)
        let currentChunk = 0
        const spark = new SparkMD5.ArrayBuffer()
        const fileReader = new FileReader()
        function loadNext () {
            const start = currentChunk * chunkSize
            const end = start + chunkSize >= file.size ? file.size : start + chunkSize
            fileReader.readAsArrayBuffer(blobSlice.call(file, start, end))
        }
        fileReader.onload = e => {
            spark.append(e.target.result as ArrayBuffer) // Append array buffer
            currentChunk += 1
            if (currentChunk < chunks) {
                loadNext()
            } else {
                const result = spark.end()
                // 如果单纯的使用result 作为hash值的时候, 如果文件内容相同，而名称不同的时候
                // 想保留两个文件无法保留。所以把文件名称加上。
                const sparkMd5 = new SparkMD5()
                sparkMd5.append(result)
                sparkMd5.append(file.name)
                const hexHash = sparkMd5.end()
                resolve(hexHash)
            }
        }
        fileReader.onerror = () => {
            window.measVue.$bkMessage({
                theme: 'warning',
                message: '文件分片失败',
                offsetY: 80
            })
        }
        loadNext()
    })
}
