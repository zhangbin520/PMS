<template>
    <div class="containerChart">
        <div class="chart" ref="daily_ref"></div>

    </div>
</template>

<script>
import { screenData } from "@/api/screen/screen";

    export default {
      props:['refreshDataList'],
        data() {
            return {
                chartInstance: null, // echarts实例变量
                allData: null, // 服务器返回的数据
              dataList:{},
            }
        },
        //摧毁生命周期
        destroy() {
            window.removeEventListener('resize', this.screenAdapter)
        },
        mounted(){
          this.dataList = this.refreshDataList.fourteenDays
          if(this.dataList !== ''){
            this.refreshData()
          }
          // setInterval(() => {
          //   this.refreshData("1")
          // }, 10000)
        },
        methods: {
            refreshData() {
                    this.initChart(this.dataList)
                window.addEventListener('resize', this.screenAdapter)
                this.screenAdapter()
            },
            initChart(data) {
                this.chartInstance = this.$echarts.init(this.$refs.daily_ref, 'chalk')

              // const myChart = this.$refs.myChart;  //通过ref获取到DOM节点
              // if (myChart) {
              //   const thisChart = this.$echarts.init(myChart);  //利用原型调取Echarts的初始化方法
              //   thisChart.setOption(initOption);  //将编写好的配置项挂载到Echarts上
              //   window.addEventListener("resize", function() {
              //     thisChart.resize();  //页面大小变化后Echarts也更改大小
              //     this.chartInstance.resize()
              //   });
              // }

                const initOption = {
                    title: {
                        text: '● 放电课日产出累计(14天，显示每天数据)',
                        left: 20,
                        top: 20,
                      textStyle: {
                        //fontSize: 15,
                        color: "#ffffff",
                      },
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
                  toolbox: {
                    show: true,
                    feature: {
                      saveAsImage: { show: true }
                    },
                  },
                    xAxis: {
                        type: 'category',
                        boundaryGap: false, // 折线紧挨边缘
                        data: data.x,
                      axisLine : {    // 轴线
                        show: true,
                        lineStyle: {
                          type: 'solid',
                          width: 2
                        }
                      },
                      axisLabel: {
                        interval:0,
                        rotate:45,//倾斜度 -90 至 90 默认为0
                        inside: false,
                        textStyle: {
                          color: '#aaaaaa',
                          fontSize: '12',
                          itemSize: ''
                        }
                        },
                    },
                    yAxis: {
                        type: 'value',
                        splitLine: {
                            show: true, //折线图中的横线
                            lineStyle:{
                                width: 0.5,
                              color: 'rgba(250,250,250,0.2)'
                            }
                        },
                      axisLine : {    // 轴线
                        show: true,
                        lineStyle: {
                          color: '#aaaaaa',
                          type: 'solid',
                          width: 1
                        }
                      },
                    },
                    series: [
                        {
                          data: data.y,
                          smooth:true,
                            type: 'line',
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
                                      formatter: function (params) {
                                        return Math.floor(params.data); // 向下取整，确保不显示小数
                                      },
                                        show: true,
                                      fontSize: '12',
                                      color:'#fff',
                                    }
                                }
                            },
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
                    ]
                }

                this.chartInstance.setOption(initOption)


            },
            screenAdapter() {
              this.chartInstance = this.$echarts.init(this.$refs.daily_ref, 'chalk')
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
