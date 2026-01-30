<template>
  <div class="container">
    <div class="chart" ref="gutter_ref"></div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        chartInstance: null, // echarts实例变量
      }
    },
    //摧毁生命周期
    destroy() {
      window.removeEventListener('resize', this.screenAdapter)
    },
    mounted() {
      this.initChart()
      this.screenAdapter()
      window.addEventListener('resize', this.screenAdapter)
    },
    methods: {

      /**初始化echarts实例对象*/
      initChart() {
        this.chartInstance = this.$echarts.init(this.$refs.gutter_ref)

        const initOption = {
          title: {
            text: '● GUTTER',
            left: 20,
            top: 20,
            textStyle: {
              //fontSize: 16,
              color: "#ffffff",
            },
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            },
            formatter: function (params) {
              let tar;
              if (params[1].value !== '-') {
                tar = params[1];
              } else {
                tar = params[0];
              }
              return tar.name + '<br/>' + tar.seriesName + ' : ' + tar.value;
            }
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: {
            type: 'value',
          },
          yAxis: {
            type: 'category',
            data: ['CNC01','CNC02','CNC03','WE01','WE02','WE03','EDM01','EDM02','EDM03']
          },
          series: [
            {
              name: 'Placeholder',
              type: 'bar',
              stack: 'Total',
              itemStyle: {
                borderColor: 'transparent',
                color: 'transparent'
              },
              emphasis: {
                itemStyle: {
                  borderColor: 'transparent',
                  color: 'transparent'
                }
              },
              data: [0, 900, 1245, 1530, 1376, 1376, 1511, 1689, 1856, 1495, 1292]
            },
            {
              name: 'Income',
              type: 'bar',
              stack: 'Total',
              label: {
                show: true,
                position: 'top',
                color: "#ffffff",
              },
              data: [900, 345, 393, '-', '-', 135, 178, 286, '-', '-', '-']
            },
            {
              name: 'Expenses',
              type: 'bar',
              stack: 'Total',
              label: {
                show: true,
                position: 'bottom',
                color: "#ffffff",
              },
              data: ['-', '-', '-', 108, 154, '-', '-', '-', 119, 361, 203]
            }
          ]
        }

        this.chartInstance.setOption(initOption)
      },

      /** 屏幕适配 */
      screenAdapter() {
        this.chartInstance = this.$echarts.init(this.$refs.gutter_ref)
        const titleFontSize = this.$refs.gutter_ref.offsetWidth / 100 *1.5
        const adapterOption = {
          title: {
            textStyle: {
              fontSize: titleFontSize / 1.2,
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
              label: {
                textStyle: {
                  fontSize: titleFontSize/1.8,
                }
              },
            },
            {
              label: {
                textStyle: {
                  fontSize: titleFontSize/1.8,
                }
              },
            }
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
