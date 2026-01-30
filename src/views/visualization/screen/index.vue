<template>
    <div class="screen-container">
        <header class="screen-header">
            <div>
                <img src="/static/img/header_border_dark.png" alt="">
            </div>
            <span class="logo">
                <img src="/static/img/Home.png" @click="goTarget"><a @click="goTarget">首页</a>
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
                    <daily ref="daily" />
                </div>
                <div id="left-bottom">
                    <!-- 设备稼动率图表 -->
                    <!-- <equip></equip> -->
                </div>
            </section>
            <section class="screen-middle">
                <div id="middle-top">
                    <week ref="week" />
                </div>
                <div id="middle-bottom">
                    <person ref="person"/>
                </div>
            </section>
            <section class="screen-right">
                <div id="right-top">
                    <month ref="month"/>
                </div>
                <div id="right-bottom">
                    <outPut ref="outPut"/>
                </div>
            </section>
        </div>
    </div>
</template>

<script>
    import daily from '@/views/visualization/screen/components/daily'
    import equip from '@/views/visualization/screen/components/equip'
    import month from '@/views/visualization/screen/components/month'
    import outPut from '@/views/visualization/screen/components/outPut'
    import person from '@/views/visualization/screen/components/person'
    import week from '@/views/visualization/screen/components/week'
    import moment from 'moment'

    export default {
        data() {
            return {
                time: null
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
        mounted () {
            this.getDate()
            this.refreshData()
            setInterval(() => {
                 this.refreshData()
            }, 10000)
        },
        methods: {
            refreshData(){
                this.$refs.daily.refreshData("1")
                this.$refs.week.refreshData("2")
                this.$refs.month.refreshData("3")
                this.$refs.person.refreshData("4")
                this.$refs.outPut.refreshData("5")
            },
            getDate () {
                setInterval(() => {
                    this.time = moment().format('yyyy-MM-DD HH:mm:ss')
                }, 1000)
            },
            goTarget () {
                this.$router.push('/home')
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
        font-size: 20px;
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
        margin-top: 100px;
        margin-left: -50%;
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
        margin-left: -50%;
        margin-top: 100px;
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

