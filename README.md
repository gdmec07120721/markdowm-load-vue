## Markdowm-load-vue

基于Vuepress的一个简单Markdowm转化为Vue的解析器，效果类似于Element UI 组件文档。

### 安装
---

```
> npm install markdown-load-vue
```

### 安装引入相应依赖组件
---

```
> npm install vue-highlight.js highlight.js
```

安装Vue高亮组件后，需要在.vuepress/enhanceApp.js 文件注册为全局组件（[应用级别的配置](https://vuepress.vuejs.org/zh/guide/basic-config.html#%E5%BA%94%E7%94%A8%E7%BA%A7%E5%88%AB%E7%9A%84%E9%85%8D%E7%BD%AE)）。

```js
import VueHighlightJS from 'vue-highlight.js';
import 'highlight.js/styles/atom-one-dark.css';

export default ({
  //...做一些事情
}) => {
  // ...做一些其他的应用级别的优化
  Vue.use(VueHighlightJS)
}

```

### 使用
---

在config.js文件修改内部的 Webpack 配置（[configureWebpack](https://vuepress.vuejs.org/zh/config/#configurewebpack)）


```js
//修改内部的 Webpack 配置
configureWebpack: (config, isServer) => {
  //...
  //添加‘.md’文件模块解析规则
  config.module.rules = config.module.rules.map(item => {
    let copy_item = {...item};

    if (copy_item.test.toString().indexOf('.md') > -1) {
        //使用markdown-load-vue解析器
        item.use.push({
            loader: 'markdown-load-vue'
        });
    }           
    return item;
  });
}
```

在.md文件中使用

```md
    :::
    ```html
    //...写些vue代码

    ```
    :::
```

