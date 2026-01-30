<template>
    <div class="com-container">
        <div class="com-chart" ref="equip_ref"></div>
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
            // 在组件创建完成后，注册回调函数
            this.$socket.registerCallBack('equipData', this.getData)
        },
        mounted() {
            this.initChart()
            this.getData()
            /*// 发送数据给服务器，告诉服务器，我现在需要数据
            this.$socket.send({
                action: 'getData',
                socketType: 'equipData',
                chartName: 'equip',
                value: ''
            })*/
            window.addEventListener('resize', this.screenAdapter)
            this.screenAdapter()
        },
        // 摧毁生命周期
        destroy() {
            window.removeEventListener('resize', this.screenAdapter)
            this.$socket.unRegisterCallBack('equipData')
        },
        methods: {
            // 初始化echarts实例对象
            initChart() {
                this.chartInstance = this.$echarts.init(this.$refs.equip_ref, 'chalk')
                // 对图表初始化配置的控制
                const initOption = {
                    title: {
                        text: '● 设备稼动率',
                        left: 20,
                        top: 20,
                    },
                }
                this.chartInstance.setOption(initOption)
            },
            // 获取服务器数据
            async getData() {
                const { data: ret } = await this.$http.get('equip')
                this.allData = ret
                console.log(this.allData)
                this.updateChart()
            },
            // 更新图表
            updateChart() {
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
                const showData = this.allData.slice(0, 5) // 数据切割，包含0不包含5（0-4）
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
                            color: colorArr[index][0], // value颜色
                            valueAnimation: true,
                            offsetCenter: [0, '25%'] // 数字位置
                        },
                        // 设置仪表盘中文字属性
                        title : {
                            offsetCenter : [0, '60%'], // 设置文字位置
                            textStyle: {
                                color: "#aaaaaa",
                            }
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
                const titleFontSize = this.$refs.equip_ref.offsetWidth / 100 *1.5
                const adapterOption = {
                    title: {
                        textStyle: {
                            fontSize: titleFontSize * 2
                        }
                    },
                    series: [
                        {
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
                                fontSize: titleFontSize * 1.8
                            },
                        },
                        {
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
                                fontSize: titleFontSize * 1.8
                            },
                        },
                        {
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
                                fontSize: titleFontSize * 2
                            },
                            // 设置仪表盘中文字属性
                            title : {
                                fontSize: titleFontSize * 1.8
                            },
                        },
                        {
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
                                fontSize: titleFontSize * 2
                            },
                            // 设置仪表盘中文字属性
                            title : {
                                fontSize: titleFontSize * 1.8
                            },
                        },
                        {
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
                                fontSize: titleFontSize * 2
                            },
                            // 设置仪表盘中文字属性
                            title : {
                                fontSize: titleFontSize * 1.8
                            },
                        },
                    ]
                }
                this.chartInstance.setOption(adapterOption)
                this.chartInstance.resize()
            }
        }
    }
</script>
