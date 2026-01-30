<!-- 人员产出横向柱形图 -->
<template>
    <div class="com-container">
        <div class="com-chart" ref="outPut_ref"></div>
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
                currentPage: 1, // 当前显示页数
                totalPage: 0, // 一共有多少页
                timerId: null, // 定时器的标识
            };
        },
        // created () {
        //     // 在组件创建完成后，注册回调函数
        //     this.$socket.registerCallBack('outPutData', this.getData)
        // },
        // mounted() {
        //     this.initChart()
        //     this.getData()
        //     window.addEventListener('resize', this.screenAdapter)
        //     this.screenAdapter()
        // },
        // 摧毁生命周期
        // destroyed() {
        //     clearInterval(this.timerId)
        //     // 在组建销毁时将监听器取消
        //     window.removeEventListener('resize', this.screenAdapter)
        //     this.$socket.unRegisterCallBack('outPutData')
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
                // this.chartInstance = this.$echarts.init(this.$refs.outPut_ref, 'chalk')
                // 对图表初始化配置的控制
                const initOption = {
                    title: {
                        text: '● 人员产出(从大到小滚动_前30)',
                        left: 20,
                        top: 20
                    },
                    grid: {
                        top: '20%',
                        left: '3%',
                        right: '6%',
                        bottom: '3%',
                        containLabel: true // 距离包含坐标轴文字
                    },
                    xAxis: {
                        data: data.x1,
                        type: 'value',
                    },
                    yAxis: {
                        type: 'category',
                        axisLine: {
                            show: false // 隐藏y轴坐标线
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
                    series: [
                        {
                            data: data.y.reverse(),
                            type: 'bar',
                            label: {
                                show: true, // 柱数字显示
                                position: 'right', // 柱数字右侧显示
                                textStyle: {
                                    color: 'white'
                                }
                            },
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
                                ])
                            }
                        },
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
                // // 监听图表对象的鼠标事件
                // this.chartInstance.on('mouseover', () => {
                //     clearInterval(this.timerId)
                // })
                // this.chartInstance.on('mouseout', () => {
                //     this.startInterval()
                // })
            },
            // 获取服务器数据
            async getData() {
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
            },
            // 更新图表
            updateChart() {
                const start = (this.currentPage - 1) * 8 // 0
                const end = this.currentPage * 8 // 8(不包含8)
                const showData = this.allData?.slice(start, end)
                const outPutNames = showData.map((item) => {
                    return item.name
                })
                const outPutValues = showData.map((item) => {
                    return item.value
                })
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
