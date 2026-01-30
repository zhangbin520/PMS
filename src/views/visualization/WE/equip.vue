<template>
    <div class="containerChart">
        <div class="chart" ref="equip_ref"></div>
    </div>
</template>

<script>
    import { equipmentUtilizationRateTwo } from "@/api/screen/screen";

    export default {
      props:['refreshDataList'],
        data() {
            return {
                chartInstance: null, // echarts实例变量
                allData: null, // 服务器返回的数据
              currentIndex: 0, // 当前显示页面页数
              timerId: null, // 定时器标识
              dataList:{},
            }
        },
        mounted() {
          this.dataList = this.refreshDataList.cropRate
          if(this.dataList !== ''){
            this.refreshData()
          }
          // setInterval(() => {
          //   this.refreshData()
          // }, 10000)

            // window.addEventListener('resize', this.screenAdapter)
            // this.screenAdapter()
        },
        // 摧毁生命周期
        destroy() {
            window.removeEventListener('resize', this.screenAdapter)
          this.screenAdapter()
          clearInterval(this.timerId)
        },
        methods: {
          // 获取服务器数据
           refreshData() {
               this.allData = this.dataList
               this.totalPage = this.allData.length % 5 === 0 ? this.allData.length / 5 : this.allData?.length / 5 + 1
              //console.log(this.allData);
              this.updateChart(this.allData)
               this.initChart(this.allData)
               this.screenAdapter(this.allData)
            window.addEventListener('resize', this.screenAdapter)
            this.screenAdapter()
             this.startInterval()
          },
          // 定时器
          startInterval() {
             if (this.timerId) {
               clearInterval(this.timerId)
             }
            this.timerId = setInterval(() => {
              this.currentIndex++
              if (this.currentIndex > this.totalPage) {
                this.currentIndex = 0
              }
              this.updateChart() //更新页面显示
            }, 2000)
          },
          // 初始化echarts实例对象
          initChart() {
            this.chartInstance = this.$echarts.init(this.$refs.equip_ref, 'chalk')
            // 对图表初始化配置的控制
            const initOption = {
              title: {
                text: '● 线割课设备稼动率（近30天）',
                left: 20,
                top: 20,
                textStyle: {
                  color: "#ffffff",
                }
              },
            }
            this.chartInstance.setOption(initOption)
            this.chartInstance.on('mouseover', () => {
              clearInterval(this.timerId)
            })
            this.chartInstance.on('mouseout', () => {
              this.startInterval()
            })
          },
            // 更新图表
            updateChart() {
              this.chartInstance = this.$echarts.init(this.$refs.equip_ref, 'chalk')
                // 仪表盘位置数组
                const centerArr = [
                    ['18%', '40%'],
                    ['50%', '40%'],
                    ['82%', '40%'],
                    ['34%', '80%'],
                    ['66%', '80%'],
                ]
                // 仪表板颜色数组
                const colorArr = [
                    ['#5052EE', '#AB6EE5'],
                    ['#23E5E5', '#2E72BF'],
                    ['#4FF778', '#0BA82C'],
                    ['#E5DD45', '#E8B11C'],
                    ['#E8821C', '#E55445'],
                ]
                // 处理图表需要的数据
                const start = this.currentIndex * 5
                const end = (this.currentIndex + 1 ) * 5
                const showData = this.allData.slice(start, end) // 数据切割，包含0不包含5（0-4）
                const seriesArr = showData.map((item, index) => {
                    return {
                        type: 'gauge',
                        radius:'38%', // 设置仪表盘大小
                        center: centerArr[index],
                        startAngle: 200, // 仪表盘初始角度
                        endAngle: -20,
                        axisTick: {
                            show: false // 消除刻度
                        },
                        // 进度条属性
                        axisLine: {
                            roundCap: true,
                            lineStyle: {
                                color: [
                                    [
                                        item.input * 0.01, new echarts.graphic.LinearGradient(//0.8值为颜色显示百分比80%
                                        0, 0, 1, 0, [{
                                            offset: 0,
                                            color: colorArr[index][0]
                                        },
                                            {
                                                offset: 1,
                                                color: colorArr[index][1]
                                            }
                                        ]
                                    )
                                    ],
                                    [
                                        1, '#1c4e85'
                                    ]
                                ]
                            }
                        },
                        axisLabel: {
                            show: false // 消除刻度数字
                        },
                        splitLine: {
                            show: false // 消除刻度线
                        },
                        itemStyle: {
                            shadowColor: colorArr[index][0], // 进度条阴影
                            shadowBlur: 10,
                            shadowOffsetX: 2,
                            shadowOffsetY: 2
                        },
                        // 显示进度条颜色
                        progress: {
                            show: true,
                            roundCap: true,
                        },
                        // 设置数字属性
                        detail: {
                          formatter: '{value}%',
                          fontSize: 15,
                            color: colorArr[index][0], // value颜色
                            valueAnimation: true,
                            offsetCenter: [0, '35%'] // 数字位置
                        },
                        // 设置仪表盘中文字属性
                        title : {
                          fontSize: 12,
                            offsetCenter : [0, '70%'], // 设置文字位置
                            textStyle: {
                                color: "#aaaaaa",
                            }
                        },
                      tooltip: {
                        formatter: '{a} <br/>{b} : {c}%'
                      },
                        data: [
                            {
                                name: item.name,
                                value: item.input,
                                itemStyle: {
                                    color: new this.$echarts.graphic.LinearGradient(0, 1, 0, 0, [
                                        {
                                            offset: 0,
                                            color: colorArr[index][0]
                                        },
                                        {
                                            offset: 1,
                                            color: colorArr[index][1]
                                        }
                                    ])
                                }
                            }
                        ]
                    }
                })
                // 数据配置项
                const dataOption = {
                    series: seriesArr
                }
                this.chartInstance.setOption(dataOption)
            },
            // 屏幕适配(当浏览器大小发生变化时，完成屏幕的适配)
            screenAdapter() {
                // 和分辨率大小相关的配置项
              this.chartInstance = this.$echarts.init(this.$refs.equip_ref, 'chalk')
              const titleFontSize = this.$refs.equip_ref.offsetWidth / 100 *1.5
              const screenArr = ((item, index) => {
                return {
                  type: 'gauge',
                    // 进度条属性
                    axisLine: {
                  lineStyle: {
                    width: titleFontSize * 1.4, // 进度条宽度
                  }
                },
                  // 显示进度条颜色
                  progress: {
                    width: titleFontSize
                  },
                  // 设置指针属性
                  pointer: {
                    width: titleFontSize / 2,
                  },
                  // 设置数字属性
                  detail: {
                    fontSize: titleFontSize * 2,
                  },
                  // 设置仪表盘中文字属性
                  title : {
                    fontSize: titleFontSize * 1.5
                  },
                }
              })

                const adapterOption = {
                    title: {
                        textStyle: {
                            fontSize: titleFontSize * 2,
                          color: "#ffffff",
                        }
                    },
                    series: screenArr
                }
                this.chartInstance.setOption(adapterOption)
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
