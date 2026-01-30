<!-- 人员产出横向柱形图 -->
<template>
    <div class="containerChart">
        <div class="chart" ref="outPut_ref"></div>
    </div>
</template>

<script>
import { dailyOutputTop30 } from "@/api/screen/screen";

    export default {
      props:['refreshDataList'],
        data() {
            return {
                chartInstance: null, // echarts实例变量
                allData: null, // 服务器返回的数据
                currentPage: 1, // 当前显示页数
                totalPage: 0, // 一共有多少页
                timerId: null, // 定时器的标识
              dataList:{},
            };
        },

        mounted() {
          this.dataList = this.refreshDataList.topPersonnel30
          // console.log(this.dataList)
          this.initChart(this.dataList)
          if(this.dataList !== ''){
            this.initChart(this.dataList)
            this.refreshData()
          }
          window.addEventListener('resize', this.screenAdapter)
          this.screenAdapter()
          // setInterval(() => {
          //   this.refreshData("5")
          // }, 10000)
          this.startInterval()
        },

      // 摧毁生命周期
      destroyed() {
        clearInterval(this.timerId)
        // 在组建销毁时将监听器取消
        window.removeEventListener('resize', this.screenAdapter)
      },
        methods: {
            // 初始化echarts实例对象
            initChart(data) {
                this.chartInstance = this.$echarts.init(this.$refs.outPut_ref, 'chalk')
                // 对图表初始化配置的控制
                const initOption = {
                    title: {
                        text: '● 放电课人员产出(从多到少滚动_Top30)',
                        left: 20,
                        top: 20,
                      textStyle: {
                        //fontSize: 15,
                        color: "#ffffff",
                      },
                    },
                    grid: {
                        top: '20%',
                        left: '3%',
                        right: '6%',
                        bottom: '3%',
                        containLabel: true // 距离包含坐标轴文字
                    },
                    xAxis: {
                        type: 'value',
                      axisLine : {    // 轴线
                        show: true,
                        lineStyle: {
                          color: '#aaaaaa',
                          type: 'solid',
                          width: 1
                        }
                      },
                      splitLine: {
                        show: false, //折线图中的横线
                      },
                    },
                    yAxis: {
                       // data: data.name,
                        type: 'category',
                        axisLine: {
                            show: false, // 隐藏y轴坐标线
                          lineStyle: {
                            color: '#aaaaaa',
                            type: 'solid',
                            width: 1
                          }
                        },

                        axisLabel: {
                            textStyle: {
                                color: "rgba(255,255,255,.6)",
                            },
                        }
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
                  toolbox: {
                    show: true,
                    feature: {
                      saveAsImage: { show: true }
                    },
                  },
                    series: [
                        {
                            //data: data.input,
                            type: 'bar',
                            label: {
                                show: true, // 柱数字显示
                                position: 'right', // 柱数字右侧显示
                              formatter: function (params) {
                                return Math.floor(params.data); // 向下取整，确保不显示小数
                              },
                                textStyle: {
                                  fontSize: 10,
                                    color: 'white'
                                }
                            },
                          //barWidth: 20, // 柱宽度显示
                            itemStyle: {
                                // 颜色渐变
                                color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                                    {
                                        offset: 0,
                                        color: '#248ff7' // 0%状态下颜色值
                                    },
                                    {
                                        offset: 1,
                                        color: '#AB6EE5' // 100%状态下颜色值
                                    }
                                ]),
                              barBorderRadius: 5,
                            }
                        },
                    ]
                }

                this.chartInstance.setOption(initOption)
                // 监听图表对象的鼠标事件
                this.chartInstance.on('mouseover', () => {
                    clearInterval(this.timerId)
                })
                this.chartInstance.on('mouseout', () => {
                    this.startInterval()
                })
            },
          // 获取服务器数据
          refreshData() {
              this.allData = this.dataList
              this.allData.sort((a, b) => {
                return a.input - b.input // 从小到大排序
              })
              this.totalPage = this.allData.length % 8 === 0 ? this.allData.length / 8 : this.allData?.length / 8 + 1
              this.screenAdapter(this.allData)
              this.updateChart(this.allData)
              this.initChart(this.allData)
            window.addEventListener('resize', this.screenAdapter)
            this.screenAdapter()
          },
            // 获取服务器数据
            /*async getData() {
                // http://127.0.0.1:8888/api/outPut
                const {data: ret} = await this.$http.get('outPut')
                console.log(ret)
                this.allData = ret
                // 数组进行排序
                this.allData.sort((a, b) => {
                    return a.value - b.value // 从小到大排序
                })
                // 每八个元素显示一页
                this.totalPage = this.allData.length % 8 === 0 ? this.allData.length / 8 : this.allData?.length / 8 + 1
                this.updateChart()
                // 启动定时器
                this.startInterval()
            },*/
            // 更新图表
            updateChart(data) {
              this.chartInstance = this.$echarts.init(this.$refs.outPut_ref, 'chalk')
                const start = (this.currentPage - 1) * 8 // 0
                const end = this.currentPage * 8 // 8(不包含8)
                const showData = this.allData.slice(start, end)
                const outPutNames = showData.map((item) => {
                    return item.name
                })
              console.log("111")
              console.log(outPutNames)

                const outPutValues = showData.map((item) => {
                    return item.input
                })
              console.log(outPutValues)
                // 数据配置项
                const dataOption = {
                    yAxis: {
                        data: outPutNames,
                    },
                    series: [
                        {
                            data: outPutValues,
                        },
                    ]
                }
                this.chartInstance.setOption(dataOption)
            },
            // 设置定时器滚动
            startInterval() {
                if(this.timerId) {
                    clearInterval(this.timerId)
                }
                this.timerId = setInterval(() => {
                    this.currentPage++
                    // 处理边界值
                    if(this.currentPage > this.totalPage) {
                        this.currentPage = 1
                    }
                    this.updateChart()
                }, 3000)
            },
            // 屏幕适配(当浏览器大小发生变化时，完成屏幕的适配)
            screenAdapter() {
              this.chartInstance = this.$echarts.init(this.$refs.outPut_ref, 'chalk')
                // console.log(this.$refs.outPut_ref.offsetWidth)
                const titleFontSize = this.$refs.outPut_ref.offsetWidth / 100 *2
                // 和分辨率大小相关的配置项
                const adapterOption = {
                    title: {
                        textStyle: {
                            fontSize: titleFontSize * 1.5,
                        },
                    },
                    tooltip: {
                        axisPointer: {
                            lineStyle: {
                                width: titleFontSize,
                            }
                        }
                    },
                    series: [
                        {
                            barWidth: titleFontSize, // 柱宽度显示
                            itemStyle: {
                                barBorderRadius: titleFontSize/2,
                            }
                        },
                    ]
                }
                this.chartInstance.setOption(adapterOption)
                // 手动调用图表对象的resize才能产生效果
                this.chartInstance.resize()
            }
        }
    }
</script>

<style>
  .containerChart {
    width: 100%;
    height: 100%;
    overflow: hidden;
    position: relative;
  }

  .chart {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
</style>
