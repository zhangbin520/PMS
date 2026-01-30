// utils/customLoading.js
import { Loading } from 'element-ui'
/* animation-timing-function: cubic-bezier(0, 1, 1, 0);
@keyframes smooth-blink {
  0%, 100% { opacity: 1; }   /* 完全显示 */
  /* 50% { opacity: 0.3; } */      /* 变得半透明 */
/* } **/ 
const addCustomStyles = () => {
  const style = document.createElement('style')
  style.textContent = `
    .custom-send-loading .el-loading-spinner .el-loading-text {
      color: #67c23a;
      margin-top: 20px;
      font-size: 16px;
      font-weight: bold;
      z-index:9999 !important;
      background: linear-gradient(90deg, #409EFF, #fff 30%, #409EFF 70%); /* 创建一道高光 */
      background-size: 200% 100%; /* 将背景拉宽，以便移动 */
      background-clip: text;      /* 用文字轮廓裁剪背景 */
      -webkit-background-clip: text; /* 针对Webkit内核浏览器的前缀 */
      -webkit-text-fill-color: transparent; /* 隐藏原有文字颜色，显示背景 */
      animation: shine 3s ease-in-out infinite;
    }
    
    .custom-send-loading .el-loading-spinner .path {
      stroke: #67c23a;
      stroke-width: 3.5;
      stroke-linecap: round;
    }
    
    .custom-send-loading .el-icon-upload {
      font-size: 28px;
      color: #67c23a;
      margin-bottom: 8px;
    }
    
    /* 查询专用 loading 样式 - 使用旋转点动画 */
    .custom-query-loading .el-loading-spinner {
      text-align: center;
      z-index:999999 !important;
    }
    
    .custom-query-loading .el-loading-spinner .el-loading-text {
      color: #409eff;
      margin-top: 12px;
      font-size: 16px;
      font-weight: 600;
      letter-spacing: 0.5px;
      background: linear-gradient(90deg, #409EFF, #fff 30%, #409EFF 70%); /* 创建一道高光 */
      background-size: 200% 100%; /* 将背景拉宽，以便移动 */
      background-clip: text;      /* 用文字轮廓裁剪背景 */
      -webkit-background-clip: text; /* 针对Webkit内核浏览器的前缀 */
      -webkit-text-fill-color: transparent; /* 隐藏原有文字颜色，显示背景 */
      animation: shine 1.2s ease-in-out infinite;
      z-index:999999 !important;
    }
    
  @keyframes shine {
    0% { background-position: -100% 0; } /* 高光在文字左侧 */
    50% { background-position: 100% 0; }  /* 高光移动到文字右侧 */
    100% { background-position: -100% 0; } /* 高光移回左侧 */
  }
    
    /* 创建旋转点动画 */
    .custom-query-loading .el-loading-spinner .dots-loader {
      display: inline-block;
      position: relative;
      width: 80px;
      height: 80px;
      z-index:999999 !important;
    }
    
    .custom-query-loading .el-loading-spinner .dots-loader div {
      position: absolute;
      top: 33px;
      width: 13px;
      height: 13px;
      border-radius: 50%;
      background: #409eff;
      z-index:9999 !important;
      animation: quick-blink 1s linear infinite;
      z-index:999999 !important;
    }


    
    .custom-query-loading .el-loading-spinner .dots-loader div:nth-child(1) {
      left: 8px;
      animation: dots-loader1 0.6s infinite;
    }
    
    .custom-query-loading .el-loading-spinner .dots-loader div:nth-child(2) {
      left: 8px;
      animation: dots-loader2 0.6s infinite;
    }
    
    .custom-query-loading .el-loading-spinner .dots-loader div:nth-child(3) {
      left: 32px;
      animation: dots-loader2 0.6s infinite;
    }
    
    .custom-query-loading .el-loading-spinner .dots-loader div:nth-child(4) {
      left: 56px;
      animation: dots-loader3 0.6s infinite;
    }
    
    @keyframes dots-loader1 {
      0% {
        transform: scale(0);
      }
      100% {
        transform: scale(1);
      }
    }
    
    @keyframes dots-loader2 {
      0% {
        transform: translate(0, 0);
      }
      100% {
        transform: translate(24px, 0);
      }
    }
    
    @keyframes dots-loader3 {
      0% {
        transform: scale(1);
      }
      100% {
        transform: scale(0);
      }
    }
  `
  document.head.appendChild(style)
}
const pageLoading = {
  install(Vue) {
// 添加自定义样式
    addCustomStyles()
    // 上传专用 loading
    Vue.prototype.$sendLoading = (message = '正在上传文件数据，请稍候 ...') => {
      const options = {
        lock: true,
        text: message,
        spinner: 'el-icon-upload',
        background: 'rgba(0, 0, 0, 0.8)',
        customClass: 'custom-send-loading'
      }
      return Loading.service(options)
    }

    // 查询专用 loading
    Vue.prototype.$queryLoading = (message = '正在查询数据，请稍候 ...') => {
      const options = {
        lock: true,
        text: message,
        background: 'rgba(0, 0, 0, 0.8)',
        customClass: 'custom-query-loading'
      }
      return Loading.service(options)
    }
  }
}

export default pageLoading