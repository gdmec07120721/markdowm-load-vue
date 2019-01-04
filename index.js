let fs = require('fs');
let path = require('path');
let marked = require('marked');

//缓存文件夹
let cachePath = path.resolve(__dirname, '../../docs/.vuepress/components/Cache');

//判断Cache文件夹是否存在
if(!fs.existsSync(cachePath)) {
    //异步创建Cache文件夹
    fs.mkdirSync(cachePath);
}

let commonPath = path.resolve(__dirname, '../../docs/.vuepress/components/Common');

//判断Common文件夹是否存在
if(!fs.existsSync(commonPath)) {
    let demoCode =  fs.readFileSync(path.resolve(__dirname, 'lib/Democode.vue'),'utf-8');
    //异步创建Common文件夹
    fs.mkdirSync(commonPath);
    //异步创建文件
    fs.writeFileSync(path.join(commonPath, 'Democode.vue'), demoCode, 'utf8');
}

module.exports = function(content) {
    // 不包含后缀的文件名
    let fileName = path.basename(this.resourcePath, '.md').replace(/\b(\w)|\s(\w)/g,function(m){
        //把首字符转化为大写
        return m.toUpperCase();
    });; 

    let demos = [];
 
    /*
    *把下面格式
    *:::
    *```html
    * //内容
    *```
    *:::
    *内容提取
    */
    content = content.replace(/(^|\r|\n|\r\n):::[\s\S]*?```html(\r|\n|\r\n)([\s\S]+?)```[\s\S]*?:::(\r|\n|\r\n|$)/g, function(m, $1, $2, $3){

        let demoName = `${fileName}Demo${demos.length + 1}.vue`;

        demos.push(demoName);
        //异步创建文件
        fs.writeFileSync(path.join(cachePath, demoName), $3, 'utf8');

        let componentName = demoName.replace(/\.vue$/, '');

        // vue会误把textarea中的{{}}内容也当成插值处理，所以这里临时替换掉，代码高亮的时候再还原回来
        $3 = $3.replace(/{{/g, '{ {').replace(/}}/g, '} }');

        return `<Common-Democode>\n  <Cache-${componentName}></Cache-${componentName}>\n  <highlight-code slot="codeText" lang="vue">${$3}</highlight-code>\n</Common-Democode>\n`;
        //fs.writeFileSync(path.join(cachePath, '1111'), marked($3), 'utf8');
        //return `<Common-Democode>\n  <Cache-${componentName}></Cache-${componentName}>\n  <div slot="codeText" class="language-html extra-class">${marked($3 || '', {sanitize: true})}</div>\n</Common-Democode>\n`;

    });
    
    return content;
};