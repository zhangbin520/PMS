<template>
  <div style="width:100%;height:100%">
    <WE></WE>
  </div>
</template>

<script>
  import screenPage from '@/views/visualization/RiDPage/screenPage'
  import WE from '@/views/visualization/RiDPage/WE'
  export default {
    data(){
      return {
        timer:null, //定时器名称
      }
    },
    create() {
      this.startInterval()
    },
    mounted () {
      this.startInterval()
      /*const timer = setInterval(() =>{
        this.$router.push('/WE')
      }, 3000);*/

      /*this.$once('hook:beforeDestroy', () => {
        clearInterval(timer);
      })*/
    },
    components: {
      screenPage: screenPage,
      WE: WE
    },
    methods: {
      startInterval() {
        var i = 0;
        var arr = [1,2,3,4,5];
        let self = this
        var timer = setInterval(function(){
          while (arr[i]===5){
            i=0
          }
          if(arr[i] === 4){
            self.$router.push('/WE')
          }
          if(arr[i] === 1){
            self.$router.push('/EDM')
          }
          if(arr[i] === 2){
            self.$router.push('/M')
          }
          if(arr[i] === 3){
            self.$router.push('/CNC')
          }
          i++;
          if(i > arr.length-1){       //因为i++的原因，所以当i的值大于数组的长度-1的时候，清除定时器
            clearInterval(timer);
          }
        },13000);
      },
      goTarget () {
        this.$router.push('/screen')
      },
      goTarget2 () {
        this.$router.push('/WE')
      },
      goTarget3 () {
        this.$router.push('/EDM')
      },
      goTarget4 () {
        this.$router.push('/M')
      },
      goTarget5 () {
        this.$router.push('/CNC')
      },
    }
  }

</script>
