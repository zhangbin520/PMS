<template>
    <div class="com-container">
        <div class="com-chart" ref="person_ref"></div>
        <!-- <div ref="myChart" style="width:100%;height:520px" id="myChart"></div> -->
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
        // created () {
        //     // 在组件创建完成后，注册回调函数
        //     this.$socket.registerCallBack('personData', this.getData)
        // },
        // mounted() {
        //     this.initChart()
        //     this.getData()
        //     /*// 发送数据给服务器，告诉服务器，我现在需要数据
        //     this.$socket.send({
        //         action: 'getData',
        //         socketType: 'personData',
        //         chartName: 'person',
        //         value: ''
        //     })*/
        //     window.addEventListener('resize', this.screenAdapter)
        //     this.screenAdapter()
        // },
        // // 摧毁生命周期
        // destroy() {
        //     window.removeEventListener('resize', this.screenAdapter)
        //     // 在组件销毁时，进行回调函数的取消
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
                this.chartInstance = this.$echarts.init(this.$refs.person_ref, 'chalk')
                // 对图表初始化配置的控制
                const initOption = {
                    title: {
                        text: '● 各部门周人均产出累计',
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
                        type: 'category',
                        data: data.x1,
                    },
                    yAxis: {
                        type: 'value',
                        axisLine: {
                            show: false // 隐藏y轴坐标线
                        },
                        splitLine: {
                            show: true, //折线图中的横线
                            lineStyle:{
                                width: 0.5
                            }
                        }
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
                    series: [
                        {
                            data: data.y,
                            type: 'bar',
                            label: {
                                show: true, // 柱数字显示
                                position: 'top', // 柱数字右侧显示
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
                            },
                        },
                        {
                            data: data.y,
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
                const {data: ret} = await this.$http.get('person')
                this.allData = ret
                console.log(ret)
                this.updateChart()
            },
            // 更新图表
            updateChart() {
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
            },
            // 屏幕适配(当浏览器大小发生变化时，完成屏幕的适配)
            screenAdapter() {
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
