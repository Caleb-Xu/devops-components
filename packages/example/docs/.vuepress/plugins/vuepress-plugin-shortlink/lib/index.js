const fs = require('fs')
const matter = require('gray-matter')
const crc32 = require('./crc32')

let hasCrcs = new Array()
let checkRepeat = function (crc) {
  if (hasCrcs.indexOf(crc) > -1) {
    crc++
    return checKCrc(crc)
  } else {
    hasCrcs.push(crc)
    return crc
  }
}
module.exports = (options = {}, context) => {
  const {
    normalSuffix = '.html',
    indexSuffix = '/',
    notFoundPath = '/404.html',
    containDirs = []
  } = options
  
  return {
    extendPageData (page) {
      const { regularPath, frontmatter = {}, _content, _strippedContent, _filePath} = page
      if (frontmatter.permalink) return
      if (regularPath === '/404.html') {
        // path for 404 page
        page.path = notFoundPath
      } else if (regularPath.endsWith('.html')) {
        // normal path
        // e.g. foo/bar.md -> foo/bar.html
        //获取不带.html的链接
        let newRegularPath = regularPath.slice(0, -5)
        //以路径分割
        let newRegularPaths = newRegularPath.split("/")
        //删除并拿到文件名
        let newRegularPathLast = newRegularPaths.pop()
        //转化文件名
        let crc = crc32.str(newRegularPathLast) >>> 0
        crc = checkRepeat(crc)
        //拼接路径
        if(containDirs.length == 0 || containDirs.indexOf(newRegularPaths.join("/"))>-1){//默认全部路径,如果有配置，则按配置来
          //组装文件名路径
          newRegularPaths.push(crc.toString(16) +  normalSuffix)
          page.path = newRegularPaths.join("/")
        }else{
          page.path = "/" + crc.toString(16) +  normalSuffix
        }
        
        //路径写到文件里
        //let mdText = fs.readFileSync(page._filePath, 'utf8')
        //mdText.replace(/title>([\s\S]){1,}<\/title>/gm, '<title>二标题</title>')
        //fs.writeFileSync('./src/test.html', testHtml, 'utf8')
        //frontmatter.permalink = page.path
        //let newContent = _content.replace("title2:","title:")
        frontmatter.permalink = page.path
        let newContent = matter.stringify(_strippedContent, frontmatter)
        fs.writeFileSync(_filePath, newContent, 'utf8')
      } else if (regularPath.endsWith('/')) {
        // index path
        // e.g. foo/index.md -> foo/
        page.path = regularPath.slice(0, -1) + indexSuffix
      }
    }
  }
}