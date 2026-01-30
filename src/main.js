import Vue from 'vue'

import Cookies from 'js-cookie'

import Element from 'element-ui'
import './assets/styles/element-variables.scss'

import '@/assets/styles/index.scss' // global css
import '@/assets/styles/ruoyi.scss' // ruoyi css
import App from './App'
import store from './store'
import router from './router'
import directive from './directive' // directive
import plugins from './plugins' // plugins
import { download } from './utils/request'
import VueElementExtends from 'vue-element-extends'
import 'vue-element-extends/lib/index.css'

import 'element-ui/lib/theme-chalk/index.css'
import pageLoading from './utils/pageLoading'


import './assets/icons' // icon
import './permission' // permission control
import { getDicts } from "./api/system/dict/data";
import { getConfigKey } from "./api/system/config";
import { parseTime, resetForm, addDateRange, selectDictLabel, selectDictLabels, handleTree } from "@/utils/ruoyi";
// 分页组件
import Pagination from "@/components/Pagination";
// 自定义表格工具组件
import RightToolbar from "@/components/RightToolbar"
// 富文本组件
import Editor from "@/components/Editor"
// 文件上传组件
import FileUpload from "@/components/FileUpload"
// 变更图档上传组件
import ChangeDocumation from "@/components/ChangeDocumation"
// 图片上传组件
import ImageUpload from "@/components/ImageUpload"
// 头像上传组件
import AvatarUpload from "@/components/AvatarUpload"
// 字典标签组件
import DictTag from '@/components/DictTag'
// 头部标签组件
import VueMeta from 'vue-meta'
// 字典数据组件
import DictData from './components/DictData'
// web上传组件
import WebUploader from './components/WebUploader'
// 对话框可拖动
import dialogDrag from '@/directive'
import elDragDialog from '@/directiveB/el-drag-dialog'
//表格无限滚动
import elTableInfiniteScroll from 'el-table-infinite-scroll';
//分辨率适配
import "lib-flexible/flexible";
import Print from 'vue-print-nb'
//vue-simple-uploader上传组件
import uploader from 'vue-simple-uploader'

import * as echarts from 'echarts';
//表格列宽自适应
import AFTableColumn from 'af-table-column'
//鼠标移动粒子动画
import VueParticles from 'vue-particles'
//表格轮播
import scroll from 'vue-seamless-scroll'
//防止按钮多次点击
import preventReClick from './directive/preventRepeatClick';


Vue.prototype.$echarts = echarts

// 全局方法挂载
Vue.prototype.getDicts = getDicts
Vue.prototype.getConfigKey = getConfigKey
Vue.prototype.parseTime = parseTime
Vue.prototype.resetForm = resetForm
Vue.prototype.addDateRange = addDateRange
Vue.prototype.selectDictLabel = selectDictLabel
Vue.prototype.selectDictLabels = selectDictLabels
Vue.prototype.download = download
Vue.prototype.handleTree = handleTree

// 全局组件挂载
Vue.component('DictTag', DictTag)
Vue.component('Pagination', Pagination)
Vue.component('RightToolbar', RightToolbar)
Vue.component('Editor', Editor)
Vue.component('FileUpload', FileUpload)
Vue.component('ChangeDocumation', ChangeDocumation)
Vue.component('ImageUpload', ImageUpload)
Vue.component('AvatarUpload', AvatarUpload)
Vue.component('WebUploader', WebUploader)
Vue.use(pageLoading)


Vue.use(directive)
Vue.use(plugins)
Vue.use(VueMeta)
Vue.use(VueElementExtends)
Vue.use(dialogDrag);
Vue.use(elDragDialog);
Vue.use(elTableInfiniteScroll);
Vue.use(Print);
Vue.use(AFTableColumn);
Vue.use(VueParticles);
Vue.use(uploader);
Vue.use(scroll);
Vue.use(preventReClick);
DictData.install()

Element.Dialog.props.closeOnClickModal.default = false;


Vue.prototype.msgSuccess = function (msg) {
  this.$message({ showClose: true, message: msg, type: "success" });
}

Vue.prototype.msgError = function (msg) {
  this.$message({ showClose: true, message: msg, type: "error" });
}

Vue.prototype.msgInfo = function (msg) {
  this.$message({ showClose: true, message: msg, type: "warning" });
}
/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online! ! !
 */

Vue.use(Element, {
  size: Cookies.get('size') || 'medium' // set element-ui default size
})

Vue.config.productionTip = false

// main.js
function formatDate(date, fmt) {
  date = new Date(date);
  if (typeof(fmt) === "undefined") {
    fmt = "yyyy-MM-dd HH:mm:ss";
  }
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  let o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'H+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  }
  for (let k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      let str = o[k] + ''
      fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? str : ('00' + str).substr(str.length));
    }
  }
  return fmt
};

//定义一个时间过滤器
Vue.filter("FormatDate", function(date, fmt) {
  return formatDate(date, fmt);
});

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})


