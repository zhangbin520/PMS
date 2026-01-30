<template>
  <div class="screen-container">
    <header class="screen-header">
      <div>
        <img src="/static/img/header_border_dark.png" alt="">
      </div>
      <span class="title">整套模具加工进度可视化</span>
      <div class="title-right">
        <span class="datetime">{{ time }}</span>
      </div>
    </header>
    <div class="screen-body">
     <div style="border:1px solid #66ccff;width: 100%;height: 20%;margin-top: 50px">
       <span class="btitle" style="font-size: 30px">本月计划</span>
       <el-row :gutter="24">
         <el-col :span="8" align="center">
           <span  style="font-size: 25px;">钢 件 剩 余 工 时  /  钢 件 总 工 时</span><br>
           <span style="font-size: 60px;position:relative;top:30px">{{steelParts}}</span>
         </el-col>
         <el-col :span="8" align="center">
           <span  style="font-size: 25px;">完 成 套 数  /  计 划 套 数</span><br>
           <span style="font-size: 60px;position:relative;top:30px">{{prodQuantity}}</span>
         </el-col>
         <el-col :span="8" align="center">
           <span  style="font-size: 25px;">电 极 剩 余 工 时  /  电 极 总 工 时</span><br>
           <span style="font-size: 60px;position:relative;top:30px">{{electrode}}</span>
         </el-col>
       </el-row>
     </div>
      <div class="min">
        <div class="table-wrapper" style="border:1px solid #66ccff;margin-top: 20px;width: 100%;height: 65%;">
          <h1 align="center">重要模具加工进度</h1>
          <el-table ref="scroll_table" class="top" v-if="refreshTable" v-loading="loading" :data="sheduleList" border
                    :header-cell-style="{
            background: 'rgba(40, 118, 193,.5)',
            color: 'rgb(0,246,250)',
            textAlign: 'center',
            fontSize: '20px',
            padding: '0',
            height: '70px',
          }" style="color: #ffffff;"
          >
            <el-table-column label="序号" type="index" width="70" fixed/>
            <el-table-column label="派工单号" align="center" prop="dispatchOrderNo" fixed/>
            <el-table-column label="模号" align="center" prop="moduleNo" fixed/>
            <el-table-column label="客户订单号" align="center" prop="customerOrderNo" :show-overflow-tooltip="true" fixed/>
            <el-table-column label="投单类型" align="center" prop="processingContent" fixed/>
            <el-table-column label="投单性质" align="center" prop="orderNature"/>
            <el-table-column label="投单日期" align="center" prop="orderDate" />
            <el-table-column label="需求日期" align="center" prop="demandDate" :show-overflow-tooltip="true"/>
            <el-table-column label="工时完成比例" align="center" prop="processingProgress" width="200px">
              <template slot-scope="scope">
                <el-tooltip class="item" effect="dark" content="黄色代表进度异常，红色代表进度缓慢，绿色代表进度正常" placement="top-start">
                  <div v-if="Number(scope.row.theoreticalProgress) < 0">
                    <el-progress status="warning" :text-inside="true" :stroke-width="20" :percentage="Number(scope.row.processingProgress)"></el-progress>
                  </div>
                  <div v-if="Number(scope.row.theoreticalProgress) > scope.row.processingProgress && scope.row.processingProgress !== 100">
                    <el-progress status="exception" :text-inside="true" :stroke-width="20" :percentage="Number(scope.row.processingProgress)"></el-progress>
                  </div>
                  <div v-if="(Number(scope.row.theoreticalProgress) <= scope.row.processingProgress && Number(scope.row.theoreticalProgress)>0) || scope.row.processingProgress === 100">
                    <el-progress status="success" :text-inside="true" :stroke-width="20" :percentage="Number(scope.row.processingProgress)"></el-progress>
                  </div>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column label="总工时" align="center" prop="totalManHours"/>
            <el-table-column label="剩余工时" align="center" prop="remainingWork"/>
            <el-table-column label="G" align="center" prop="g"/>
            <el-table-column label="EDM" align="center" prop="edm"/>
            <el-table-column label="WE" align="center" prop="we"/>
            <el-table-column label="CNC" align="center" prop="cnc"/>
            <el-table-column label="HNC" align="center" prop="hnc"/>
            <el-table-column label="M" align="center" prop="m"/>
          </el-table>
          <vue-seamless-scroll
            :data="sheduleList"
            class="seamless-warp"
            style="width: 100%"
            :class-option="classOption"
          >
            <el-table ref="scroll_table" class="bottom" v-if="refreshTable" v-loading="loading" :data="sheduleList" border
                      :header-cell-style="{
            background: 'rgba(40, 118, 193,.5)',
            color: 'rgb(0,246,250)',
            textAlign: 'center',
            fontSize: '12px',
            padding: '0',
          }" style="color: #ffffff" :show-header="false"
            >
              <el-table-column label="序号" type="index" width="70"/>
              <el-table-column label="派工单号" align="center" prop="dispatchOrderNo"/>
              <el-table-column label="模号" align="center" prop="moduleNo"/>
              <el-table-column label="客户订单号" align="center" prop="customerOrderNo"/>
              <el-table-column label="投单类型" align="center" prop="processingContent"/>
              <el-table-column label="投单性质" align="center" prop="orderNature"/>
              <el-table-column label="投单日期" align="center" prop="orderDate" />
              <el-table-column label="需求日期" align="center" prop="demandDate"/>
              <el-table-column label="工时完成比例" align="center" prop="processingProgress" width="200px">
                <template slot-scope="scope">
                  <el-tooltip class="item" effect="dark" content="黄色代表交期异常，红色代表进度缓慢，绿色代表进度正常" placement="top-start">
                    <div v-if="Number(scope.row.theoreticalProgress) < 0">
                      <el-progress status="warning" :text-inside="true" :stroke-width="20" :percentage="Number(scope.row.processingProgress)"></el-progress>
                    </div>
                    <div v-if="Number(scope.row.theoreticalProgress) > scope.row.processingProgress && scope.row.processingProgress !== 100">
                      <el-progress status="exception" :text-inside="true" :stroke-width="20" :percentage="Number(scope.row.processingProgress)"></el-progress>
                    </div>
                    <div v-if="(Number(scope.row.theoreticalProgress) <= scope.row.processingProgress && Number(scope.row.theoreticalProgress)>0) || scope.row.processingProgress === 100">
                      <el-progress status="success" :text-inside="true" :stroke-width="20" :percentage="Number(scope.row.processingProgress)"></el-progress>
                    </div>
                  </el-tooltip>
                </template>
              </el-table-column>
              <el-table-column label="总工时" align="center" prop="totalManHours"/>
              <el-table-column label="剩余工时" align="center" prop="remainingWork"/>
              <el-table-column label="G" align="center" prop="g"/>
              <el-table-column label="EDM" align="center" prop="edm"/>
              <el-table-column label="WE" align="center" prop="we"/>
              <el-table-column label="CNC" align="center" prop="cnc"/>
              <el-table-column label="HNC" align="center" prop="hnc"/>
              <el-table-column label="M" align="center" prop="m"/>
            </el-table>
          </vue-seamless-scroll>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {getProdDispatchFollowPage, getSchedule} from "../../../../api/follow/orderRecord";

  export default {
    data() {
      return {
        // 遮罩层
        loading: false,
        // 重新渲染表格状态
        refreshTable: true,
        // 生产进度表格数据
        sheduleList: [],
        //看板时间
        time: '',
        //看板套数
        prodQuantity:'',
        steelParts:'',
        electrode:'',
        //时间
        nowYear: '',//年
        nowMouth: '',//月
        nowDate: '',
        nowWeek: '',//周几
        hms: '',//时分秒
        timer: '', //定义一个定时器的变量
        times:'',
        // 查询参数
        queryParams: {
          pageNo: 1,
          pageSize: 100000,
        },
      }
    },
    created() {
      this.getList();
      this.getScheduleList();
      this.timer = setInterval(this.getdate, 1000)
      this.times = setInterval(() =>{
        this.getList();
        this.getScheduleList();
      },1000*20);
    },
    computed: {
      // 滚动条的配置项
      classOption() {
        return {
          step: 0.1, // 数值越大速度滚动越快
          limitMoveNum: 1, // 开始无缝滚动的数据量 this.list
          hoverStop: true, // 是否开启鼠标悬停stop
          direction: 1, // 0向下 1向上 2向左 3向右
          openWatch: true, // 开启数据实时监控刷新dom
          singleHeight: 0, // 单步运动停止的高度(默认值0是无缝不停止的滚动) direction => 0/1
          singleWidth: 0, // 单步运动停止的宽度(默认值0是无缝不停止的滚动) direction => 2/3
          waitTime: 1000, // 单步运动停止的时间(默认值1000ms)
        };
      },
    },
    methods: {
      /** 分页查询特别关注列表 */
      getList() {
        getProdDispatchFollowPage(this.queryParams).then(response => {
          this.sheduleList = response.data.records;
        });
      },
      /** 获取看板数据 */
      getScheduleList() {
        let query = {}
        getSchedule(query).then(res =>{
          this.prodQuantity = res.data.completionsConcerns
          this.electrode = res.data.electrode
          this.steelParts = res.data.steelParts
        })
      },
      // 获取当前系统时间
      getdate() {
        const year = new Date().getFullYear()
        const mounth =
          new Date().getMonth() + 1 < 10
            ? '0' + (new Date().getMonth() + 1)
            : new Date().getMonth() + 1
        const date =
          new Date().getDate() < 10
            ? '0' + new Date().getDate()
            : new Date().getDate()
        const hh = new Date().getHours()
        const mf =
          new Date().getMinutes() < 10
            ? '0' + new Date().getMinutes()
            : new Date().getMinutes()
        const ss =
          new Date().getSeconds() < 10
            ? '0' + new Date().getSeconds()
            : new Date().getSeconds()
        const week = new Date().getDay()
        if (week === 1) {
          this.nowWeek = '星期一'
        } else if (week === 2) {
          this.nowWeek = '星期二'
        } else if (week === 3) {
          this.nowWeek = '星期三'
        } else if (week === 4) {
          this.nowWeek = '星期四'
        } else if (week === 5) {
          this.nowWeek = '星期五'
        } else if (week === 6) {
          this.nowWeek = '星期六'
        } else if (week === 27) {
          this.nowWeek = '星期日'
        }
        this.nowYear = year
        this.nowMouth = mounth
        this.nowDate = date
        this.hms = hh + ':' + mf + ':' + ss
        this.time = this.nowYear + '/' + this.nowMouth + '/' + this.nowDate + '  ' + this.hms
      },
      beforeDestroy() {
        if (this.timer) {
          clearInterval(this.timer) // 在Vue实例销毁前，清除定时器
        }
        if (this.times) {
          clearInterval(this.times) // 在Vue实例销毁前，清除定时器
        }
      },
    },
  }
</script>

<style lang="scss">
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
    margin-top: 10px;
  }
  .resize {
    position: absolute;
    right: 20px;
    top: 20px;
    cursor: pointer;
  }

  //透明化整体
  .el-table,
  .el-table__expanded-cell {
    background-color: transparent !important;
  }
  //透明化行、单元格
  el-table th,
  .el-table tr,
  .el-table td {
    background-color: transparent !important;
  }
  .seamless-warp {
    height: 700px;
    overflow: hidden;
  }
  .top .el-table__body-wrapper {
    display: none;
    width: 100%;
  }
  .bottom .el-table__header-wrapper {
    display: none;
    width: 100%;
  }
  .btitle{
    display:block;
    width:300px;
    height:40px;
    position:relative;
    top:-20px;
    text-align: center;
    color: #3333cc;
    margin-left: 43%;
    background-color: #33ffff;
  }
</style>

