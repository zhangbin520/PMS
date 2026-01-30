<template>
  <div class="father">
    <div id="myEchart" ref="myEchart" style="width: 100%;height:100vh;margin-top: 20px" ></div>
  </div>
</template>
<script>
  import * as echarts from 'echarts'
  import {equipmentLoad} from "../../../api/production/equipmentLoad";
  export default {
    name: "equipmentLoad",
    data() {
      return {
        chartInstance: null, // echarts实例变量
        dataSource:[],
      }
    },
    mounted() {
      this.getEquipmentList()
    },
    methods: {
      // getDateList(count,long) {
      //   var time = new Date().setMinutes(0);
      //   time = time - 24*60*60*1000;
      //   var categoryData = [];
      //   for (var i = 0 ; i <= count ; i++) {
      //     categoryData.push(moment(time).format('YYYY-MM-DD'));
      //     time += long;
      //   }
      //   return categoryData
      // },
      getEquipmentList() {
        equipmentLoad().then(res => {
          this.datasource = res.data
          this.initChart(this.datasource)
        })
      },
      initChart() {
        var chartDom = document.getElementById('myEchart');
        var myChart = echarts.init(chartDom);
        var option;


        // 工件编号，工序编号，机器编号，起始时间，终止时间
        // const dataSource = [
        //   { prodOrderNo: 'WD2208090003', workHour: 8, machine: 'CNC-01', startTime: '2022-8-10 00:00:00', endTime: '2022-8-11 08:00:00' },
        //   { prodOrderNo: 'WD2208090003', workHour: 24, machine: 'CNC-02', startTime: '2022-8-11', endTime: '2022-8-12' },
        //   { prodOrderNo: 'WD2208090003', workHour: 72, machine: 'CNC-03', startTime: '2022-8-10', endTime: '2022-8-13' },
        //   { prodOrderNo: 'WD2208090003', workHour: 48, machine: 'CNC-04', startTime: '2022-8-12', endTime: '2022-8-14' },
        //   { prodOrderNo: 'WD2208090003', workHour: 48, machine: 'CNC-05', startTime: '2022-8-13', endTime: '2022-8-15' },
        //   { prodOrderNo: 'WD2208090003', workHour: 48, machine: 'CNC-06', startTime: '2022-8-14', endTime: '2022-8-16' },
        //   { prodOrderNo: 'WD2208090003', workHour: 48, machine: 'CNC-07', startTime: '2022-8-15', endTime: '2022-8-17' },
        //   { prodOrderNo: 'WD2208090003', workHour: 48, machine: 'CNC-08', startTime: '2022-8-16', endTime: '2022-8-18' }
        // ];
        const dataSource = this.datasource
        // 一堆颜色集，画每一个图块需要
        const Colors = [
          "#BB86D7",
          "#FFAFF0",
          "#5BC3EB",
          "#B5E2FA",
          "#A9D5C3",
          "#73DCFF",
          "#DCB0C6",
          "#F9CDA5",
          "#FBE6D2",
          "#B5E2FA",
          "#B8FFCE",
          "#FFE4E2",
          "#F7AF9D",
          "#BBF9B4",
          "#FFEE93",
          "#2CEAA3",
          "#ECC2C2",
          "#C8CACA"
        ];
        const { keys } = Object;

        // 以机器为纵坐标轴绘制甘特图（这里还可以以工件为坐标轴）

        let machines = dataSource.reduce((acc, cur) => {
          acc[cur.machine] ? acc[cur.machine].push(cur) : acc[cur.machine] = [cur];
          return acc;
        }, {});

        let prodOrderNos = dataSource.reduce((acc, cur) => {
          acc[cur.prodOrderNo] ? acc[cur.prodOrderNo].push(cur) : acc[cur.prodOrderNo] = [cur];
          return acc;
        }, {});

        let prodOrderNoColors = {}; // 颜色映射
        keys(prodOrderNos).forEach((v, i) => prodOrderNoColors[v] = Colors[i]);
        let data = [];
        // 关键
        keys(machines).forEach((k) => {
          machines[k].forEach(v => {
            // let startTime = new Date(v.startTime).getTime();
            // let endTime = new Date(v.endTime).getTime();
            // let duration = endTime - startTime;
            var startTime = new Date(Date.parse(v.startTime.replace(/-/g, "/"))).getTime();
            var endTime = new Date(Date.parse(v.endTime.replace(/-/g, "/"))).getTime();
            var duration = (endTime - startTime) / (1000 * 60 * 60 * 24);
            data.push({
              name: v.prodOrderNo, // 图块名称
              value: [k, startTime, endTime, duration], // 名称， 起始时间， 终止时间，持续时间
              planStartTime:v.startTime,
              planEndTime:v.endTime,
              workHour:v.workHour,
              itemStyle: {
                normal: {
                  color: prodOrderNoColors[v.prodOrderNo] // 图块颜色
                }
              }
            });
          });
        });


        function renderItem(params, api) {
          var categoryIndex = api.value(0);
          var start = api.coord([api.value(1), categoryIndex]);
          var end = api.coord([api.value(2), categoryIndex]);
          var height = api.size([0, 1])[1] * 0.6;

          var rectShape = echarts.graphic.clipRectByRect({
            x: start[0],
            y: start[1] - height / 2,
            width: end[0] - start[0],
            height: height
          }, {
            x: params.coordSys.x,
            y: params.coordSys.y,
            width: params.coordSys.width,
            height: params.coordSys.height
          });

          return rectShape && {
            type: 'rect',
            shape: rectShape,
            style: api.style()
          };
        }


        option = {
          tooltip: {
            formatter: function (params) {
              return (
                params.marker + '生产单号'+ ': ' +  params.name +
                "</br>" +
                params.marker + '计划开始时间'+ ': ' +  params.data.planStartTime +
                "</br>" +
                params.marker + '计划完成时间'+ ': ' +  params.data.planEndTime +
                "</br>" +
                params.marker + '计划工时'+ ': ' +  params.data.workHour
              )
            }
          },
          title: {
            text: '设备负荷',
            left: 'center'
          },
          dataZoom: [
            {
              type: 'slider',
              filterMode: 'weakFilter',
              showDataShadow: false,
              top: 900,
              labelFormatter: ''
            },
            {
              type: 'inside', // 放大和缩小
              orient: 'vertical',
            },
            {
              type: 'inside',
              filterMode: 'weakFilter'
            }
          ],
          grid: {
            height:800
          },
          xAxis: {
            type:"time",
            position: 'top',
            scale: true,
          },
          yAxis: {
            data: keys(machines) // 机器编号为纵坐标轴
          },
          series: [{
            type: 'custom',
            renderItem: renderItem,
            itemStyle: {
              normal: {
                opacity: 0.8
              }
            },
            encode: {
              x: [1, 2],
              y: 0
            },
            data: data
          }]
        };
        option && myChart.setOption(option);
      },
    }
  }
</script>
<style lang="scss" scoped>

</style>
