# vue-music

> music play
仅仅用于vue的项目学习，不可作为商业用途。
项目是基于Vue.js，成品是一个移动端的音乐播放器，来源于imooc的实战课程。自己动手实践学习。
本项目采用Vue-cli构建开发环境，所有数据都来自于QQ音乐。

## 技术栈
* [x] MVVM框架：Vue.js （版本2.x）
* [x] 状态管理：Vuex
* [x] 前端路由：Vue Router
* [x] 服务端通讯：axios、jsonp
* [x] 移动端滚动库：better-scroll
* [x] 构建工具：webpack 2.0

## 效果图预览

<img src="https://wkongl.github.io/Exercise/vue-music/static/img/music1.png" width="250" height="450">  <img src="https://wkongl.github.io/Exercise/vue-music/static/img//music2.png" width="250" height="450">  <img src="https://wkongl.github.io/Exercise/vue-music/static/img//music3.png" width="250" height="450"> 

### 项目收获及难点

#### 数据来源获取
在QQ音乐中，大部分接口都可以通过JSONP来抓取，但是有一些接口限制了host，如果直接用JSONP是抓取不到数据的。最后解决办法是通过axios代理，设置header和referer，以此绕过host的限制。

#### 搜索框
在搜索框中输入内容会返回搜索的结果，因此在搜索框中每输入一个字符就会产生一个请求，容易造成流量浪费。使用节流函数就能延迟函数的调用，只有输入内容停留一段时间才会开始请求结果。

#### player播放器
player播放器是项目中的重点核心，它是一个全局的组件，需要用vuex来管理数据和状态。每次的状态变更，都需要用`action`来集中提交`mutation`。而且也需要添加一个`songReady`属性来管控歌曲播放，歌曲切换的功能，防止歌曲快速切换。

#### 总结
实践此项目，收获了不少的知识，切换时的动画应用，使用mixin来提取组件公共代码，还有组件化、模块化的开发方式等等。在每次遇到问题并解决后都是一个累积的过程，让自己越来越充实。

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
