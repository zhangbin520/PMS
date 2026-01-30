<template>
  <div class="com-container">
    <div class="com-chart" ref="daily_ref"></div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        chartInstance: null, // echarts实例变量
        allData: null, // 服务器返回的数据
      }
    },
    created () {
    },
    mounted() {
      this.initChart()
      this.getData()

      /*// 发送数据给服务器，告诉服务器，我现在需要数据
      this.$socket.send({
          action: 'getData',
          socketType: 'dailyData',
          chartName: 'daily',
          value: ''
      })*/
      window.addEventListener('resize', this.screenAdapter)
      this.screenAdapter()
    },
    // 摧毁生命周期
    destroy() {
      window.removeEventListener('resize', this.screenAdapter)
    },
    methods: {
      initChart() {
        this.chartInstance = this.$echarts.init(this.$refs.daily_ref, 'chalk')
        const initOption = {
          title: {
            text: '● 各部门日产出累计(14天，显示每天数据)',
            left: 20,
            top: 20
          },
          grid: {
            left: '3%',
            top: '30%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'line',
              z: 0,
              lineStyle: {
                color: 'rgba(255,255,255,.1)',
              }
            }
          },
          xAxis: {
            type: 'category',
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            boundaryGap: false // 折线紧挨边缘
          },
          yAxis: {
            type: 'value',
            splitLine: {
              show: true, //折线图中的横线
              lineStyle:{
                width: 0.5
              }
            }
          },
          series: [
            {
              type: 'line',
              data: [150, 230, 224, 218, 135, 147, 260],
              showSymbol: true, // 显示原点
              symbolSize: 4, // 原点大小
              itemStyle: {
                normal: {
                  color:'#fff',// 原点颜色样式
                  lineStyle: {
                    color: "#2f89cf", // 折线颜色样式
                  },
                  // 显示表格数据
                  label : {
                    show: true,
                  }
                }
              }
            }
          ]
        }
        this.chartInstance.setOption(initOption)
      },
      // 获取服务器数据
      // ret 就是服务端发送给客户端的图表数据
      async getData() {
        const { data: ret } = await this.$http.get('daily')
        this.allData = ret
        this.updateChart()
      },
      // 更新图表
      updateChart() {
        // timeArr x轴，类目轴的数据
        /*const timeArr = this.allData.common.day
        console.log(timeArr)
        // valueArr y轴的数据
        const valueArr = this.allData.daily.data
        const seriesArr = valueArr.map((item, index) => {
          return {
            type: 'line',
            data: item.data,
            stack: 'daily',
            areaStyle: {
              color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: 'rgba(44, 110, 255, 0.5)'
                },
                {
                  offset: 1,
                  color: 'rgba(44, 110, 255, 0)'
                }
              ])
            }
          }
        })*/
        // 数据配置项
        const dataOption = {
          /*xAxis: {
            data: timeArr
          },
          series: seriesArr*/
          xAxis: {
            type: 'category',
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
          },
          yAxis: {
            type: 'value'
          },
          series: [
            {
              data: [150, 230, 224, 218, 135, 147, 260],
              type: 'line'
            }
          ]
        }
        this.chartInstance.setOption(dataOption)
      },
      screenAdapter() {
        const titleFontSize = this.$refs.daily_ref.offsetWidth / 100 *2
        // 和分辨率大小相关的配置项
        const adapterOption = {
          title: {
            textStyle: {
              fontSize: titleFontSize * 1.5,
            },
          },
        }
        this.chartInstance.setOption(adapterOption)
        this.chartInstance.resize()
      }
    }
  }
</script>
