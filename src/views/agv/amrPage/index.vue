<template>
  <div>
<!--    <iframe src="http://10.123.17.11:3038/" id="mobsf" scrolling="auto" frameborder="0" style="position:absolute;top:0px;left: 25px;right:0px;bottom:100px;"></iframe>-->
    <iframe src="http://10.123.17.11:30381/#/pathManage/index2" id="mobsf" scrolling="auto" frameborder="0" style="position:absolute;top:0px;left: 25px;right:0px;bottom:100px;"></iframe>
  </div>
</template>

<script>
export default {
  data () {
    return {
    }
  },
  mounted(){
    /**
     * iframe-宽高自适应显示
     */
    function changeMobsfIframe(){
      const mobsf = document.getElementById('mobsf');
      const deviceWidth = document.body.clientWidth;
      const deviceHeight = document.body.clientHeight;
      mobsf.style.width = (Number(deviceWidth)-240) + 'px'; //数字是页面布局宽度差值
      mobsf.style.height = (Number(deviceHeight)-64) + 'px'; //数字是页面布局高度差
    }

    changeMobsfIframe()

    window.onresize = function(){
      changeMobsfIframe()

    }
  }
}
window.addEventListener('load', function() {
  var previousUrl = window.location.href;

  setInterval(function() {
    var currentUrl = window.location.href;
    if (currentUrl !== previousUrl) {
      // URL 发生变化，可能是登录成功后的跳转
      // 在这里可以进行相应的处理
      previousUrl = currentUrl;
    }
  }, 1000); // 每秒检查一次 URL 变化
});
// <template>
//   <div>
//     <iframe ref="mobsfFrame" src="http://16.43.75.17:athManage/index2" ...></iframe>
// </div>
// </template>

// <script>
//   export default {
//   methods: {
//   handleIframeLoad() {
//   const iframe = this.$refs.mobsfFrame;
//   iframe.contentWindow.addEventListener('load', () => {
//   // 在这里可以执行监控 iframe 内部导航的操作
// });
// }
// },
//   mounted() {
//   this.handleIframeLoad();
// }
// };

</script>
