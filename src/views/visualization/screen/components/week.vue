<template>
    <div class="com-container">
        <div class="com-chart" ref="week_ref"></div>
        <div ref="myChart" style="width:100%;height:420px" id="myChart"></div>
        <div class="content"></div>
    </div>
</template>

<script>
import { screenData } from "@/api/screen/screen";

    export default {
        data() {
            return {
                chartInstance: null, // echarts实例变量
                allData: null, // 服务器返回的数据
            }
        },
        // mounted() {
        //     this.initChart()
        //     this.getData()
        //     window.addEventListener('resize', this.screenAdapter)
        //     this.screenAdapter()
        // },
        // // 摧毁生命周期
        // destroy() {
        //     window.removeEventListener('resize', this.screenAdapter)
        // },
        methods: {
            refreshData(type) {
                screenData({"type":type}).then(resp=>{
                    // console.log(resp);
                    this.initChart(resp.data)
                })
                // window.addEventListener('resize', this.screenAdapter)
                // this.screenAdapter()
            },
            // 初始化echarts实例对象
            initChart(data) {
                // this.chartInstance = this.$echarts.init(this.$refs.week_ref, 'chalk')
                // 对图表初始化配置的控制
                const initOption = {
                    title: {
                        text: '● 各部门周产出累计(显示各周数据)',
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
                        data: data.x1,
                        type: 'category',
                        boundaryGap: false
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
                        data: data.y,
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
                    ]
                }
                const myChart = this.$refs.myChart;  //通过ref获取到DOM节点
                if (myChart) {
                    const thisChart = this.$echarts.init(myChart);  //利用原型调取Echarts的初始化方法
                    thisChart.setOption(initOption);  //将编写好的配置项挂载到Echarts上
                    window.addEventListener("resize", function() {
                        thisChart.resize();  //页面大小变化后Echarts也更改大小
                    });
                }
                // this.chartInstance.setOption(initOption)
            },
            // 获取服务器数据
            async getData() {
                const { data: ret } = await this.$http.get('week')
                this.allData = ret
                console.log(ret)
                this.updateChart()
            },
            // 更新图表
            updateChart() {
                const timeArr = this.allData.common.week
                const valueArr = this.allData.week.data
                const seriesArr = valueArr.map((item, index) => {
                    return {
                        type: 'line',
                        data: item.data,
                        stack: 'week',
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
                })
                // 数据配置项
                const dataOption = {
                    xAxis: {
                        data: timeArr
                    },
                    series: seriesArr
                }
                this.chartInstance.setOption(dataOption)
            },
            // 屏幕适配(当浏览器大小发生变化时，完成屏幕的适配)
            screenAdapter() {
                const titleFontSize = this.$refs.week_ref.offsetWidth / 100 *2
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
