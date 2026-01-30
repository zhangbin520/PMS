<template>
    <div class="containerChart">
        <div class="chart" ref="person_ref"></div>
        <!-- <div ref="myChart" style="width:100%;height:520px" id="myChart"></div> -->
        <div ref="myChart" style="width:100%;height:340px" id="myChart"></div>
        <div class="content"></div>
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

       mounted() {
         this.dataList = this.refreshDataList.weeklyPerCapitaOutput
         if(this.dataList !== ''){
           this.refreshData()
         }
         // setInterval(() => {
         //   this.refreshData("4")
         // }, 10000)
       },

        methods: {
            refreshData() {
                    this.initChart(this.dataList)
                  this.screenAdapter(this.dataList)
                window.addEventListener('resize', this.screenAdapter)
                this.screenAdapter()
            },
            // 初始化echarts实例对象
            initChart(data) {
                this.chartInstance = this.$echarts.init(this.$refs.person_ref, 'chalk')
                // 对图表初始化配置的控制
                const initOption = {
                    title: {
                        text: '● 铣磨课周人均产出累计',
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
                        type: 'category',
                        data: data.x,
                      axisLine : {    // 轴线
                        show: true,
                        lineStyle: {
                          color: '#aaaaaa',
                          type: 'solid',
                          width: 1
                        }
                      },
                      axisLabel: {
                        interval: 0,
                        rotate: 45,
                      }
                    },
                    yAxis: {
                        type: 'value',
                        axisLine: {
                            show: false, // 隐藏y轴坐标线
                          lineStyle: {
                            color: '#aaaaaa',
                            type: 'solid',
                            width: 1
                          }
                        },
                        splitLine: {
                            show: true, //折线图中的横线
                            lineStyle:{
                                width: 0.5,
                              color: 'rgba(250,250,250,0.2)'
                            }
                        },
                    },
                    /*tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'line',
                            z: 0,
                            lineStyle: {
                                color: 'rgba(255,255,255,.1)',
                            }
                        }
                    },*/
                  toolbox: {
                    show: true,
                    feature: {
                      saveAsImage: { show: true }
                    },
                  },
                    series: [
                        {
                            data: data.y,

                            type: 'bar',
                            label: {
                                show: true, // 柱数字显示
                                position: 'top', // 柱数字右侧显示
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
                            },
                        },
                        {
                            data: data.y,
                          smooth:true,
                            type: 'line',
                            showSymbol: true, // 显示原点
                            symbolSize: 4,
                            itemStyle: {
                                normal: {
                                    color:'#fff',// 原点颜色样式
                                    lineStyle: {
                                        color: "#2f89cf", // 折线颜色样式
                                    },
                                }
                            },
                            areaStyle: {
                                color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                    /*{
                                        offset: 0,
                                        color: 'rgba(44, 110, 255, 0.5)'
                                    },
                                    {
                                        offset: 1,
                                        color: 'rgba(44, 110, 255, 0)'
                                    }*/
                                ])
                            }
                        }
                    ]
                }
                // const myChart = this.$refs.myChart;  //通过ref获取到DOM节点
                // if (myChart) {
                //     const thisChart = this.$echarts.init(myChart);  //利用原型调取Echarts的初始化方法
                //     thisChart.setOption(initOption);  //将编写好的配置项挂载到Echarts上
                //     window.addEventListener("resize", function() {
                //         thisChart.resize();  //页面大小变化后Echarts也更改大小
                //     });
                // }
                this.chartInstance.setOption(initOption)
            },
            // 获取服务器数据
            /*async getData() {
                const {data: ret} = await this.$http.get('person')
                this.allData = ret
                console.log(ret)
                this.updateChart()
            },*/
            // 更新图表
            /*updateChart() {
                const personNames = this.allData.map((item) => {
                    return item.name
                })
                const personValues = this.allData.map((item) => {
                    return item.value
                })
                // 数据配置项
                const dataOption = {
                    xAxis: {
                        data: personNames,
                    },
                    series: [
                        {
                            data: personValues,
                        },
                        {
                            data: personValues,
                        },
                    ]
                }
                this.chartInstance.setOption(dataOption)
            },*/
            // 屏幕适配(当浏览器大小发生变化时，完成屏幕的适配)
            screenAdapter() {
              this.chartInstance = this.$echarts.init(this.$refs.person_ref, 'chalk')
                // 和分辨率大小相关的配置项
                const titleFontSize = this.$refs.person_ref.offsetWidth / 100 *2
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
                            barWidth: titleFontSize * 1.5, // 柱宽度显示
                            itemStyle: {
                                /*barBorderRadius: [titleFontSize/2, titleFontSize/2, 0, 0]*/
                            }
                        },
                    ]
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
