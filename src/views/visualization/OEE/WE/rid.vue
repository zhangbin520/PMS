<template>
  <div class="container">
    <div class="chart" ref="rid_ref"></div>
  </div>
</template>

<script>
import { screenData } from "@/api/screen/screen";
export default {
  props:['refreshDataList'],
  data() {
    return {
      chartInstance: null, // echarts实例变量
      alldata: null,
      dataList:{},
    }
  },
  //摧毁生命周期
  destroy() {
    window.removeEventListener('resize', this.screenAdapter)
  },
  mounted() {
    this.dataList = this.refreshDataList.thirtyDays
    if(this.dataList !== ''){
      this.refreshData()
    }
    window.addEventListener('resize', this.screenAdapter)
  },
  methods: {

    refreshData() {
        this.initChart(this.dataList)
        this.screenAdapter(this.dataList)
      window.addEventListener('resize', this.screenAdapter)
      this.screenAdapter()
    },


    /**初始化echarts实例对象*/
    initChart(data) {
      this.chartInstance = this.$echarts.init(this.$refs.rid_ref)

      const initOption = {
        title: {
          text: '设备稼动率/加工效率 近30天',
          left: 20,
          top: 20,
          textStyle: {
            //fontSize: 16,
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
        legend: {
          data: ['设备稼动率', '加工效率','良品率','OEE'],
          textStyle: {
            //fontSize: 16,
            color: "#ffffff",
          },
        },
        toolbox: {
          show: true,
          feature: {
            dataView: { show: true, readOnly: false },
            magicType: { show: true, type: ['line', 'bar'] },
            saveAsImage: { show: true }
          }
        },
        calculable: true,
        xAxis: [
          {
            type: 'category',
            // prettier-ignore
            data: data.x,
            axisLine : {    // 轴线
              show: true,
              lineStyle: {
                color: '#aaaaaa',
                type: 'solid',
                width: 1
              }
            },
          }
        ],
        yAxis: [
          {
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
          }
        ],

        series: [
          {
            itemStyle: {
              // 颜色渐变
              color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                {
                  offset: 0,
                  color: '#4FF778' // 0%状态下颜色值
                },
                {
                  offset: 1,
                  color: '#0BA82C' // 100%状态下颜色值
                }
              ]),
              barBorderRadius: 5,
            },
            name: '设备稼动率',
            type: 'bar',
            smooth:true,
            label: {
              formatter: function (params) {
                return Math.round(params.data) + '%'; // 四舍五入，确保不显示小数
              },
              // formatter: '{c}%',
              show: true,
              position: 'top',
              textStyle: {
                color: 'white',
                //fontSize: 12,
              }
            },
            data: data.y1,
            /*markPoint: {
              data: [
                { type: 'max', name: 'Max' },
                { type: 'min', name: 'Min' }
              ]
            },
            markLine: {
              data: [{ type: 'average', name: 'Avg' }]
            }*/
          },
          {
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
            name: '加工效率',
            type: 'bar',
            smooth:true,
            label: {
              formatter: function (params) {
                return Math.round(params.data) + '%'; // 四舍五入，确保不显示小数
              },
              // formatter: '{c}%',
              show: true,
              position: 'top',
              textStyle: {
                color: 'white',
                //fontSize: 12,
              }
            },
            data: data.y2,
          },
          {
            itemStyle: {
              // 颜色渐变
              color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                {
                  offset: 0,
                  color: '#E8821C' // 0%状态下颜色值
                },
                {
                  offset: 1,
                  color: '#E55445' // 100%状态下颜色值
                }
              ]),
              barBorderRadius: 5,
            },
            name: 'OEE',
            type: 'line',
            smooth:true,
            label: {
              formatter: '{c}%',
              show: false,
              textStyle: {
                color: 'white',
                //fontSize: 12,
              }
            },
            data: data.y3,
          },
          {
            itemStyle: {
              // 颜色渐变
              color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                {
                  offset: 0,
                  color: '#E5DD45' // 0%状态下颜色值
                },
                {
                  offset: 1,
                  color: '#E8B11C' // 100%状态下颜色值
                }
              ]),
              barBorderRadius: 5,
            },
            name: '良品率',
            type: 'line',
            smooth:true,
            label: {
              formatter: '{c}%',
              show: false,
              textStyle: {
                color: 'white',
                //fontSize: 12,
              }
            },
            data: data.y4,
          }
        ]
      }

      this.chartInstance.setOption(initOption)
    },

    /** 屏幕适配 */
    screenAdapter() {
      this.chartInstance = this.$echarts.init(this.$refs.rid_ref)
      const titleFontSize = this.$refs.rid_ref.offsetWidth / 100 *1.5
      console.log(titleFontSize )
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: titleFontSize / 1.5,
          },
        },
        legend: {
          textStyle: {
            fontSize: titleFontSize/1.8,
          },
        },
        tooltip: {
          axisPointer: {
            lineStyle: {
              width: titleFontSize/1.5,
            }
          }
        },
        series: [
          {
            barWidth: titleFontSize / 2, // 柱宽度显示
            label: {
              textStyle: {
                fontSize: 7,
              }
            },
          },
          {
            barWidth: titleFontSize / 2, // 柱宽度显示
            label: {
              textStyle: {
                fontSize: 7,
              }
            },
          },
          {
            label: {
              textStyle: {
                fontSize: titleFontSize/2,
              }
            },
            itemStyle: {
              normal: {
                lineStyle: {
                  width: titleFontSize/6
                }
              }
            },
          },
          {
            label: {
              textStyle: {
                fontSize: titleFontSize/2,
              }
            },
          },
        ]
      }
      this.chartInstance.setOption(adapterOption)
      // 手动调用图表对象的resize才能产生效果
      this.chartInstance.resize()
    }
  },
}
</script>

<style>
  .container {
    width: 100%;
    height: 100%;
    overflow: hidden;
    position: relative;
    background-color: rgba(3,60,118);
  }

  .chart {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
</style>
