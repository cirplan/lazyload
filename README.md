# A image lazy load plugin. v0.1.1

### Demo

[demo1](http://jeffdeng.me/lazyload/docs/index1.html)
[demo2](http://jeffdeng.me/lazyload/docs/index2.html)

## How to use

```

// js
import lazyload from 'lazyload.es6.js'

lazyload()

// html 
<img class="lazy" data-url="http://xxxx.png" />

```

## 参数
```
* container {Element} 监听元素，默认为 window
* prefix    {String}  图片 src 属性，默认为 data-url
* class     {String}  需要懒加载的标记样式，默认为 .lazy
* async     {Bealoon} 页面中是否有异步加载，默认为 false
```
