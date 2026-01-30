<template>
    <div class="screen-container" style="overflow-y:scroll;overflow-x:hidden;height:100%">
        <header class="screen-header">
            <div>
                <img src="/static/img/header_border_dark.png" alt="">
            </div>
            <span class="logo">
                <li><a @click="goTarget">RiD模具中心</a></li>
      </span>
            <span class="title">CNC加工课</span>
            <div class="title-right">
                <span class="datetime">{{time}}</span>
            </div>
        </header>
        <div class="screen-body">
            <section class="screen-left">
                <div id="left-top">
                    <!-- 30天 -->
                    <rid :refreshDataList="dataList" v-if="lock"></rid>
                </div>
            </section>
        </div>

        <div class="screen-body2">
            <section class="screen-left">
                    <!-- 12周 -->
                    <ridWeek :refreshDataList="dataList" v-if="lock"></ridWeek>
            </section>
            <section class="screen-middle">
                    <!-- 12月 -->
                    <ridMonth :refreshDataList="dataList" v-if="lock"></ridMonth>
            </section>
        </div>
    </div>
</template>

<script>
    import rid from '@/views/visualization/OEE/CNC/rid'
    import ridMonth from '@/views/visualization/OEE/CNC/ridMonth'
    import ridWeek from '@/views/visualization/OEE/CNC/ridWeek'
    import moment from 'moment'
    import { cropMovementDept } from '@/api/screen/screen'

    export default {
        data() {
            return {
                time: null,
              dataList:{},
              lock:false,
            }
        },
        components: {
            rid,
            ridMonth,
            ridWeek
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
                this.$router.push('/RidPage')
              }, 20000)
            }
        },
        destroyed() {
          clearInterval(this.timer)
          this.timer = null;
          location.reload()
        },
        methods: {
          refreshData() {
            const deptCode = "D157501"
            cropMovementDept({"deptCode":deptCode}).then(resp=>{
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
                this.$router.push('/RidPage')
            }
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

    ::-webkit-scrollbar {
      width: 0 !important;
    }
    ::-webkit-scrollbar {
      width: 0 !important;height: 0;
    }
    .screen-container {
        width: 100%;
        height: 100%;
        padding: 0 20px;
        background-color: rgba(3,60,118);
        color: #fff;
        box-sizing: border-box;
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
        height: 90%;
        display: flex;
        margin-top: 10px;
    .screen-left {
        height: 95%;
        width: 100%;

    #left-top {
        height: 55%;
        position: relative;
        border: 1px solid rgba(7, 118, 181, .7);
        box-shadow: inset 0 0 5px rgba(7, 118, 181, .8);
    }
    }
    }

    .screen-body2 {
        width: 100%;
        height: 40%;
        display: flex;
        margin-top: -340px;
    .screen-left {
        height: 100%;
        width: 50%;
        border:1px solid rgba(7,118,181,.7);
        box-shadow:inset 0 0 5px rgba(7,118,181,.8);
    }
    .screen-middle {
        height: 100%;
        width: 50%;
        border:1px solid rgba(7,118,181,.7);
        box-shadow:inset 0 0 5px rgba(7,118,181,.8);
    }
    }

    .resize {
        position: absolute;
        right: 20px;
        top: 20px;
        cursor: pointer;
    }
</style>
