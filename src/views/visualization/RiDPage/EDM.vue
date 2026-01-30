<template>
    <div class="screen-container">
        <header class="screen-header">
            <div>
                <img src="/static/img/header_border_dark.png" alt="">
            </div>
            <span class="logo">
                <img src="/static/img/Home.png" @click="goTarget"><a @click="goTarget">首页</a>
      </span>
            <span class="title">放电加工课</span>
            <div class="title-right">
                <span class="datetime">{{ time }}</span>
            </div>
        </header>
        <div class="screen-body">
            <section class="screen-left">
                <div id="left-top">
                    <!-- 各部门日产出累计图表 -->
                    <daily :refreshDataList="dataList" v-if="lock"></daily>
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
                    <outPut :refreshDataList="dataList" v-if="lock"></outPut>
                </div>
            </section>
        </div>
    </div>
</template>

<script>
    import daily from '@/views/visualization/EDM/daily'
    import equip from '@/views/visualization/EDM/equip'
    import month from '@/views/visualization/EDM/month'
    import outPut from '@/views/visualization/EDM/outPut'
    import person from '@/views/visualization/EDM/person'
    import week from '@/views/visualization/EDM/week'
    import moment from 'moment'
    import { dailyOutputDept } from '@/api/screen/screen'

    export default {
        data() {
            return {
                time: null,
              timer: null,
              dataList:{},
              lock:false,
            }
        },
        components: {
            daily,
            equip,
            month,
            outPut,
            person,
            week
        },
      created() {
        this.refreshData()
        // setInterval(() => {
        //   this.refreshData()
        // }, 10000)
      },
      mounted () {
        this.getDate()
        if (this.timer) {
          clearInterval(this.timer);
        } else {
          this.timer = setInterval(() => {
            this.$router.push('/M')
          }, 12000)
        }
      },
      destroyed() {
        clearInterval(this.timer)
        this.timer = null;
      },
      // beforeDestroy() {
      //   clearInterval(this.timer);
      //   this.timer = null;
      // },
        methods: {
          refreshData() {
            const deptCode = "D157521"
            dailyOutputDept({"deptCode":deptCode}).then(resp=>{
              this.dataList = resp.data
              this.lock = true
            })
          },
            getDate () {
                setInterval(() => {
                    this.time = moment().format('yyyy-MM-DD HH:mm:ss')
                }, 1000)
            },
            goTarget () {
                this.$router.push('/screen')
            },

        },
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
        right: 0px;
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

