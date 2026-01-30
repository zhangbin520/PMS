<template>
    <div class="screen-container">
        <header class="screen-header">
            <div>
                <img src="/static/img/header_border_dark.png" alt="">
            </div>
            <span class="logo">
                <img src="/static/img/Home.png" @click="goTarget"><a @click="goTarget">首页</a>
              <a style="margin-left: 10px" @click="goTarget2">线割加工课</a>
              <a style="margin-left: 10px" @click="goTarget3">放电加工课</a>
              <a style="margin-left: 10px" @click="goTarget4">铣磨加工课</a>
              <a style="margin-left: 10px" @click="goTarget5">CNC加工课</a>
      </span>
            <span class="title">RiD模具中心</span>
            <div class="title-right">
                <span class="datetime">{{ time }}</span>
            </div>
        </header>
        <div class="screen-body">
            <section class="screen-left">
                <div id="left-top">
                    <!-- 各部门日产出累计图表 -->
                    <ceshi111 :refreshDataList="dataList" v-if="lock"></ceshi111>
                </div>
                <div id="left-bottom">
                    <!-- 设备稼动率图表 -->
                    <equip :refreshDataList="dataList" v-if="lock"></equip>
                </div>
            </section>
            <section class="screen-middle">
                <div id="middle-top">
                    <!-- 各部门周产出累计图表 -->
                    <week :refreshDataList="dataList" v-if="lock"></week>
                </div>
                <div id="middle-bottom">
                    <!-- 各部门周人均产出累计图表 -->
                    <person :refreshDataList="dataList" v-if="lock"></person>
                </div>
            </section>
            <section class="screen-right">
                <div id="right-top">
                    <!-- 各部门月产出累计图表 -->
                    <month :refreshDataList="dataList" v-if="lock"></month>
                </div>
                <div id="right-bottom">
                    <!-- 人员产出图表 -->
                    <outPut2 :refreshDataList="dataList" v-if="lock"></outPut2>
                </div>
            </section>
        </div>
    </div>
</template>

<script>
  import ceshi111 from '@/views/visualization/RiD/ceshi111'
    import equip from '@/views/visualization/RiD/equip'
    import month from '@/views/visualization/RiD/month'
    import outPut2 from '@/views/visualization/RiD/outPut2'
    import person from '@/views/visualization/RiD/person'
    import week from '@/views/visualization/RiD/week'
    import moment from 'moment'
  import { dailyOutputIndex } from '@/api/screen/screen'
    export default {
        data() {
            return {
              time: null,
              timer: '00:00:00', // 每天几点执行
              interval: 1, // 隔几天执行一次
              runNow: true, // 是否立即执行
              intervalTimer: '',
              timeOutTimer: '',
              dataList:{},
              lock:false,
            }
        },
        components: {
          ceshi111,
            equip,
            month,
            outPut2,
            person,
            week
        },
      created() {
        this.refreshData()
        setInterval(() => {
          this.refreshData()
        }, 10000)
      },
      // beforeCreate() {
      //   this.refreshData()
      // },
      mounted () {
          // this.refreshData()
        // setInterval(() => {
        //   this.refreshData()
        // }, 10000)
        this.getDate()
        // console.log(this.time)
        setInterval(() => {
          location.reload()
        }, 120000)
      },
        methods: {
          refreshData() {
            dailyOutputIndex().then(resp=>{
              this.dataList = resp.data
              this.lock = true
            })
          },
            getDate () {
                setInterval(() => {
                    this.time = moment().format('yyyy-MM-DD HH:mm:ss')
                }, 1000)
              // console.log(this.time)
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

          getBussTop10DataByTimer() {
            if (this.runNow) {
              // 如果配置了立刻运行则立刻运行任务函数
              location.reload()
            }
            // 获取下次要执行的时间，如果执行时间已经过了今天，就让把执行时间设到明天的按时执行的时间
            var nowTime = new Date().getTime()
            var timePoint = this.timer.split(':').map((i) => parseInt(i))
            var recent = new Date().setHours(...timePoint) // 获取执行时间的时间戳
            if (recent <= nowTime) {
              recent += 24 * 60 * 60 * 1000
            }
            // 未来程序执行的时间减去现在的时间，就是程序要多少秒之后执行
            var doRunTime = recent - nowTime
            this.timeOutTimer = setTimeout(this.setTimer, doRunTime)
          },
          setTimer() {
            // console.log('进入定时器')
            //配置后的第一天12点执行
            location.reload()
            // 每隔多少天再执行一次
            var intTime = this.interval * 24 * 60 * 60 * 1000
            this.intervalTimer = setInterval(location.reload, intTime)
          }
        },
      beforeDestroy() {
        // console.log(
        //   '关闭任务定时器',
        //   this.intervalTimer
        // )
        clearInterval(this.intervalTimer)
        // console.log('清除定时器timeout', this.timeOutTimer)
        clearTimeout(this.timeOutTimer)
        location.reload()
      }

    }
</script>

<style lang="scss" scoped>
     /*全屏样式的定义*/
    .fullscreen {
        position: fixed!important;
        top: 0 !important;
        left: 0 !important;
        width: 100% !important;
        height: 100% !important;
        margin: 0 !important;
        z-index: 100;
    }
    .screen-container {
        width: 100%;
        height: 100%;
        padding: 0 20px;
        background-color: rgba(3,60,118);
        color: #fff;
        box-sizing: border-box;
      overflow: hidden;
    }
    .screen-header {
        width: 100%;
        height: 64px;
        font-size: 20px;
        position: relative;
    > div {
    img {
        width: 100%;
    }
    }
    .title {
        position: absolute;
        left: 50%;
        top: 50%;
        font-size: 25px;
      font-weight :bold;
        transform: translate(-50%, -50%);
    }
    .title-right {
        display: flex;
        align-items: center;
        position:absolute;
        right: 0;
        top: 50%;
        transform: translateY(-80%);
    }
    .datetime {
        font-size: 15px;
        margin-left: 10px;
    }
    .logo {
        position: absolute;
        left: 0px;
        top: 50%;
        transform: translateY(-80%);
        font-size: 14px;
    img {
        height: 25px;
        width: 25px;
    }
    }
    }
    .screen-body {
        width: 100%;
        height: 100%;
        display: flex;
        margin-top: 10px;
      overflow: hidden;
    .screen-left {
        height: 95%;
        width: 40%;
    #left-top {
        height: 40%;
        position: relative;
        /*border:1px solid rgba(7,118,181,.7);
        box-shadow:inset 0 0 5px rgba(7,118,181,.8);*/
    }
    #left-bottom {
        height: 40%;
        margin-top: 25px;
        position: relative;
    }
    }
    .screen-middle {
        height: 95%;
        width: 40%;
        margin-left: 1.6%;
        margin-right: 1.6%;
    #middle-top {
        width: 100%;
        height: 40%;
        position: relative;
    }
    #middle-bottom {
        margin-top: 25px;
        width: 100%;
        height: 40%;
        position: relative;
    }
    }
    .screen-right {
        height: 95%;
        width: 40%;
    #right-top {
        height: 40%;
        position: relative;
    }
    #right-bottom {
        height: 40%;
        margin-top: 25px;
        position: relative;
    }
    }
    }
    .resize {
        position: absolute;
        right: 20px;
        top: 20px;
        cursor: pointer;
    }
</style>

