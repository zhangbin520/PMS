<template>
  <div class="app-container">
    <el-card>
      <el-form :model="queryParams" ref="queryForm" :inline="true">
        <el-row>
          <el-form-item label="料架位置名称：" prop="keywords">
            <el-select v-model="queryParams.carId" filterable placeholder="请选择" clearable style="width: 150px"
                       @change="handleQuery"
            >
              <el-option
                v-for="item in objectList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-button style="margin-left: 10px;margin-right: 10px;margin-top: 3px" type="primary" icon="el-icon-search"
                     size="mini" @click="handleQuery"
          ></el-button>
          <el-form-item label="AMR小车名称：" prop="keywords">
            <el-select v-model="queryParamsAGV.carId" filterable placeholder="请选择" clearable style="width: 150px"
                       @change="AMRChange"
            >
              <el-option
                v-for="item in amrList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="设备：" style="margin-left: 20px" prop="keywords">
            <el-select v-model="queryParamsDevice.deviceNo" filterable placeholder="请选择" @click="handleQueryAdd"
                       clearable style="width: 150px"
            >
              <el-option
                v-for="item in deviceList"
                :key="item.deviceNo"
                :label="item.deviceNo"
                :value="item.deviceNo"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button style="margin-left: 10px" type="primary" icon="el-icon-plus" size="mini"
                       @click="handleQueryAdd"
            >查询添加
            </el-button>
          </el-form-item>
          <div style="float: right">
            <el-form-item label="姓名：">
              <el-tag>{{ userName }}</el-tag>
            </el-form-item>
            <el-form-item label="工号：">
              <el-tag>{{ personNo }}</el-tag>
            </el-form-item>
            <el-form-item label="部门：">
              <el-tag>{{ deptName }}</el-tag>
            </el-form-item>
          </div>
        </el-row>
      </el-form>
    </el-card>
    <!--任务列表-->
    <el-col :span="18">
      <el-card>
        <el-table v-loading="loading" :data="semiAutoList" max-height="680px" @selection-change="handleSelectionChange"
                  :row-class-name="tableRowClassName" @header-click="clickFunPre" border highlight-current-row
        >
          <el-table-column type="index" label="序号" width="50" align="center"/>
          <el-table-column type="selection" align="center" :selectable="selected"/>
          <el-table-column label="工件/电极RFID" align="center" key="workpieceEleRfid" prop="workpieceEleRfid"
                           width="120px"
          >
            <template slot-scope="scope">
              <el-input v-model="scope.row.workpieceEleRfid" autofocus="true" @change="selectProduction(scope.row)">
                {{ scope.row.workpieceEleRfid }}
              </el-input>
            </template>
          </el-table-column>
          <el-table-column label="电极自动化加工ID" align="center" key="id" prop="id" v-if="false"/>
          <el-table-column label="生产单号" align="center" prop="prodOrderNo" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <span>{{ scope.row.prodOrderNo }}</span>
            </template>
          </el-table-column>
          <el-table-column label="模号" align="center" key="moduleNo" prop="moduleNo" :show-overflow-tooltip="true"/>
          <el-table-column label="件号" align="center" key="pieceNo" prop="pieceNo" :show-overflow-tooltip="true"/>
          <el-table-column label="制程" align="center" key="process" prop="process" :show-overflow-tooltip="true"/>
          <el-table-column label="工艺工时" align="center" key="processManHours" prop="processManHours" v-if="false"/>
          <el-table-column label="物料位置" align="center" key="electrodePositionNumber" prop="electrodePositionNumber"/>
          <el-table-column label="机床治具RFID" align="center" key="rfid" prop="rfid" width="100px"/>
          <el-table-column label="设备编号" align="center" key="deviceNo" prop="deviceNo"/>
          <el-table-column label="使用工艺" align="center" key="craftsName" prop="craftsName"/>
          <el-table-column label="坐标系" align="center" key="coordinate" prop="coordinate" :show-overflow-tooltip="true"/>
          <el-table-column label="状态" align="center" key="status" prop="status" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.status === '0'" type="danger">未发送</el-tag>
              <el-tag v-if="scope.row.status === '1'" type="success">已发送</el-tag>
              <el-tag v-if="scope.row.status === '2'" type="danger">发送失败</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="创建时间" align="center" key="createTime" prop="createTime"
                           :show-overflow-tooltip="true"
          />
          <el-table-column label="创建人" align="center" key="createBy" prop="createBy" :show-overflow-tooltip="true"/>
          <el-table-column label="+" align="center" width="100px">
            <template slot-scope="scope">
              <el-button
                size="small"
                circle
                type="primary"
                icon="el-icon-plus"
                @click="handleAddData(scope.row)"
              ></el-button>
            </template>
          </el-table-column>
          <el-table-column label="-" align="center" width="100px">
            <template slot-scope="scope">
              <el-button
                size="small"
                circle
                type="warning"
                icon="el-icon-minus"
                @click="handleDeleteData(scope.row,scope.$index)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-card v-loading="loading" style="margin-top: 5px" align="center">
          <el-button size="small" type="success" icon="el-icon-check" v-preventReClick="2000" @click="feeding"
                     :disabled="begin || repeat"
          >上料
          </el-button>
          <el-button size="small" type="success" icon="el-icon-check" v-preventReClick="2000" @click="blanking"
                     :disabled="begin || repeat"
          >下料
          </el-button>
          <el-button size="small" type="success" icon="el-icon-check" v-preventReClick="2000" @click="transportOpen"
                     :disabled="multiple"
          >发送
          </el-button>
          <el-button size="small" type="danger" icon="el-icon-check" v-preventReClick="2000" @click="transportStop"
                     :disabled="begin || repeat"
          >停止进程
          </el-button>
        </el-card>
      </el-card>
    </el-col>
    <el-card>
      <div slot="header">
        <span>料架位置名称：<el-tag>{{ onlyList.name }}</el-tag></span>
      </div>
      <div>
        <el-table @row-dblclick="lineClick" :data="storedNumberList" max-height="800px">
          <el-table-column label="物料位置" align="center" prop="electrodePositionNumber" :show-overflow-tooltip="true"/>
          <el-table-column label="电极rfid" align="center" prop="rfid" :show-overflow-tooltip="true"/>
          <el-table-column label="占用状态" align="center" prop="status" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.status == 0" type="success">否</el-tag>
              <el-tag v-if="scope.row.status == 1" type="danger">是</el-tag>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>

  </div>
</template>

<script>
import { getUserProfile } from '../../../api/system/user'
import { amrGetList, getBaseElectrodeAutoPage, opDoor, semiAutosend, stopSemiAuto, taskLxRequest } from '@/api/amr/amr'
import amrRequest from '@/utils/amrRequest'
import request from '@/utils/request'

import {
  getBaseElectrodeByWorkpieceOrEleRfid,
  getBaseEquipmentRfidPage,
  getBaseEqUseByEqRfid
} from '@/api/production/semiAutomation'

export default {
  name: 'semiAuto',
  data() {
    return {
      // 遮罩层
      loading: true,
      //开始状态
      begin: true,
      //非单个禁用
      single: true,
      //非多个禁用
      multiple: true,
      //多选状态
      selectStatue: false,
      //重复状态
      repeat: false,
      // 总条数
      total: 0,
      totalHisPage: 0,
      //筛选后的amr列表和物料位置列表
      onlyList: [],
      onlyList2: [],
      //多选后的自动化列表
      selectionList: [],
      // amr列表数据
      amrList: [
      //   {
      //   'id': '61bfd33b2753ce4b44a90cc9',
      //   'name': '1',
      //   'type': 'Compact',
      //   'error': false,
      //   'errorMessage': '',
      //   'meters': 1166,
      //   'deviceId': '1C-69-7A-0A-9E-5E',
      //   'battery': 40,
      //   'battery_charging': 0,
      //   'battery_voltage': 48.900002,
      //   'battery_current': 3.2,
      //   'pos': {
      //     'x': '-12.779',
      //     'y': '5.772',
      //     'angle': 0,
      //     'speed': '0.62',
      //     'rad': '0'
      //   },
      //   'map': '1200000',
      //   'mapId': '621ee0729d8b76820d4fc0e6',
      //   'atPoint': '8',
      //   'atPointId': '623185d5edbe7981b1472aeb',
      //   'deviation': 0.172465,
      //   'dispatchId': '',
      //   'dispatchName': '',
      //   'dispatchNum': 0
      // },
      //   {
      //     'id': '61bfd33b2753ce4b434a90cc9',
      //     'name': '2',
      //     'type': 'Compact',
      //     'error': true,
      //     'errorMessage': '定位故障控制板故障',
      //     'meters': 352,
      //     'deviceId': '1C-69-7A-0B-2B-31',
      //     'battery': 40,
      //     'battery_charging': 0,
      //     'battery_voltage': 48.900002,
      //     'battery_current': 3.2,
      //     'pos': {
      //       'x': '29.144',
      //       'y': '-5.173',
      //       'angle': -0.003030293756340721,
      //       'speed': '0.62',
      //       'rad': '0'
      //     },
      //     'map': '1200000',
      //     'mapId': '621ee0729d8b76820d4fc0e6',
      //     'atPoint': '185',
      //     'atPointId': '6232aace376ebcc1d541bbef',
      //     'deviation': 0.172465,
      //     'dispatchId': '',
      //     'dispatchName': '',
      //     'dispatchNum': 0
      //   },{
      //     'id': '620f3bc43aa508d8fd9101',
      //     'name': 'fexa_amr_29f2',
      //     'type': 'Compact',
      //     'error': true,
      //     'errorMessage': '定位故障控制板故障',
      //     'meters': 352,
      //     'deviceId': '1C-69-7A-0B-2B-31',
      //     'battery': 40,
      //     'battery_charging': 0,
      //     'battery_voltage': 48.900002,
      //     'battery_current': 3.2,
      //     'pos': {
      //       'x': '29.144',
      //       'y': '-5.173',
      //       'angle': -0.003030293756340721,
      //       'speed': '0.62',
      //       'rad': '0'
      //     },
      //     'map': '1200000',
      //     'mapId': '621ee0729d8b7682c0e6',
      //     'atPoint': '185',
      //     'atPointId': '6232aace376ebcc1d541bbef',
      //     'deviation': 0.172465,
      //     'dispatchId': '',
      //     'dispatchName': '',
      //     'dispatchNum': 0
      //   },{
      //     'id': '620f3bc43aa508d8101',
      //     'name': 'fexa_amr_300d_04',
      //     'type': 'Compact',
      //     'error': true,
      //     'errorMessage': '定位故障控制板故障',
      //     'meters': 352,
      //     'deviceId': '1C-69-7A-0B-2B-31',
      //     'battery': 40,
      //     'battery_charging': 0,
      //     'battery_voltage': 48.900002,
      //     'battery_current': 3.2,
      //     'pos': {
      //       'x': '29.144',
      //       'y': '-5.173',
      //       'angle': -0.003030293756340721,
      //       'speed': '0.62',
      //       'rad': '0'
      //     },
      //     'map': '1200000',
      //     'mapId': '621ee0729d8b76820d4fc6',
      //     'atPoint': '185',
      //     'atPointId': '6232aace376ebcc1d541bbef',
      //     'deviation': 0.172465,
      //     'dispatchId': '',
      //     'dispatchName': '',
      //     'dispatchNum': 0
      //   }
        ],
      //物料位置集合
      objectList: [
      //   {
      //   '_id': '61bfd33b2753ce4b44a90cc9',
      //   'name': '1',
      //   'type': 'Compact',
      //   'error': false,
      //   'errorMessage': '',
      //   'meters': 1166,
      //   'deviceId': '1C-69-7A-0A-9E-5E',
      //   'battery': 40,
      //   'battery_charging': 0,
      //   'battery_voltage': 48.900002,
      //   'battery_current': 3.2,
      //   'pos': {
      //     'x': '-12.779',
      //     'y': '5.772',
      //     'angle': 0,
      //     'speed': '0.62',
      //     'rad': '0'
      //   },
      //   'map': '1200000',
      //   'mapId': '621ee0729d8b76820d4fc0e6',
      //   'atPoint': '8',
      //   'atPointId': '623185d5edbe7981b1472aeb',
      //   'deviation': 0.172465,
      //   'dispatchId': '',
      //   'dispatchName': '',
      //   'dispatchNum': 0
      // },
      //   {
      //     '_id': '61bfd33b2753ce4b434acc9',
      //     'name': '2',
      //     'type': 'Compact',
      //     'error': true,
      //     'errorMessage': '定位故障控制板故障',
      //     'meters': 352,
      //     'deviceId': '1C-69-7A-0B-2B-31',
      //     'battery': 40,
      //     'battery_charging': 0,
      //     'battery_voltage': 48.900002,
      //     'battery_current': 3.2,
      //     'pos': {
      //       'x': '29.144',
      //       'y': '-5.173',
      //       'angle': -0.003030293756340721,
      //       'speed': '0.62',
      //       'rad': '0'
      //     },
      //     'map': '1200000',
      //     'mapId': '621ee0729d8b76820d4fc0e6',
      //     'atPoint': '185',
      //     'atPointId': '6232aace376ebcc1d541bbef',
      //     'deviation': 0.172465,
      //     'dispatchId': '',
      //     'dispatchName': '',
      //     'dispatchNum': 0
      //   }
        ],
      // 加工任务表格数据
      taskStationList: [],
      //AMR绑定列表
      semiAutoList: [],
      //发送列表
      sendList: [],
      //小车车号上物料列表
      numberList: [],
      index: '',
      //接受弹框数据
      form: {},
      formPosition: {},
      //发送 第六步
      baseDlFileIn: {},
      //任务ID
      Id: [],
      //设备列表
      deviceList: [],
      //检验重复发送列表数据
      repeatList: [],
      //用户信息
      userName: '',
      personNo: '',
      deptName: '',
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      openPosition: false,
      //选中数组
      ids: [],
      receivedQuantity: '',
      id: '',
      //待选设备列表
      equipmentSelection: {},
      //根据rfid查询电极信息列表
      middleList: [],
      //点位信息列表
      position: [],
      //待选设备选中数据
      stationId: '',
      taskId: '',
      //接收按钮禁止状态
      acceptDisabled: false,
      // 查询参数
      queryParams: {
        pageNo: 1,
        pageSize: 10
      },
      queryParamsAGV: {},
      queryParamsDevice: {
        pageNo: 1,
        pageSize: 100
      },
      //物料位置初始信息
      storedNumberList: [{
        electrodePositionNumber: 'A1',
        status: 0
      }, {
        electrodePositionNumber: 'A2',
        status: 0
      }, {
        electrodePositionNumber: 'A3',
        status: 0
      }, {
        electrodePositionNumber: 'A4',
        status: 0
      }, {
        electrodePositionNumber: 'A5',
        status: 0
      }, {
        electrodePositionNumber: 'B1',
        status: 0
      }, {
        electrodePositionNumber: 'B2',
        status: 0
      }, {
        electrodePositionNumber: 'B3',
        status: 0
      }, {
        electrodePositionNumber: 'B4',
        status: 0
      }, {
        electrodePositionNumber: 'B5',
        status: 0
      }, {
        electrodePositionNumber: 'C1',
        status: 0
      }, {
        electrodePositionNumber: 'C2',
        status: 0
      }, {
        electrodePositionNumber: 'C3',
        status: 0
      }, {
        electrodePositionNumber: 'C4',
        status: 0
      }, {
        electrodePositionNumber: 'C5',
        status: 0
      }],
      //位置信息
      positionList: [{
        name: 'A1'
      }, {
        name: 'A2'
      }, {
        name: 'A3'
      }, {
        name: 'A4'
      }, {
        name: 'A5'
      }, {
        name: 'B1'
      }, {
        name: 'B2'
      }, {
        name: 'B3'
      }, {
        name: 'B4'
      }, {
        name: 'B5'
      }, {
        name: 'C1'
      }, {
        name: 'C2'
      }, {
        name: 'C3'
      }, {
        name: 'C4'
      }, {
        name: 'C5'
      }],
      //增加单数
      obj: {
        workpieceEleRfid: ''
      },
      //上下料集合
      p1: [],
      //上下料集合
      p2: [],
      //通过绑定的小车料号那里存储的点位拿到这里来
      getpointList: [],
      //多选框全选
      checkAll: false,
      isIndeterminate: true,
      //解绑rfid集合
      rfids: {},
      //接收表单校验
      rules: {
        point: [
          { required: true, message: '点位位置不能为空', trigger: 'blur' }
        ]
      }
    }
  },

  created() {
    this.getListAmr()
    this.getListUser()
    this.getListPosition()
    this.getListBaseEquipmentRfid() // 选择机床加工的设备
    this.getListObjectPosition()
  },

  methods: {
    /** 分页查看AMR信息 */
    getListAmr() {
      this.loading = true
      setTimeout(() => {
        this.loading = false
      }, 3000)
      amrGetList().then(response => {
        this.amrList = response.content
       // this.amrList = this.amrList.filter(function(item) {
          // 使用split方法分割key属性，并检查下划线的数量
          //let underscoreCount = item.name.split('_').length - 1;
          // 检查下划线的数量是否符合条件
         // return underscoreCount === 2
         // return true ;
       // })
        this.loading = false
      })
    },

    /** 查询物料位置列表 AGV接口 */
    getListObjectPosition() {
      this.loading = true
      return amrRequest({
        url: '/api/fexa/v1/external/things/position',
        method: 'get'
      }).then(response => {
          this.objectList = response.content
          this.loading = false
        }
      )
    },

    /** 查询AMR点位信息列表 */
    getListPosition() {
      this.loading = true
      return amrRequest({
        url: '/api/fexa/v1/external/points/list',
        method: 'get'
      }).then(response => {
          this.position = response.data
          this.loading = false
        }
      )
    },

    /** 查询AMR绑料列表 根据carId获取绑定详情列表*/
    getListAmrBinding() {
      this.loading = true
      return request({
       url: '/base/base-agv/getBaseAgvBindingMaterial/' + this.onlyList.id,
        // url: '/base/base-agv/getBaseAgvBindingMaterial/' + this.queryParamsAGV.carId,
        method: 'get'
      }).then(response => {
          this.getpointList = response.data
          this.loading = false
        }
      )
    },

    /** 查询AMR绑料列表 根据carId获取车号使用情况*/
    getListAmrNumber() {
      this.loading = true
      return request({
        url: '/base/base-agv/getBaseCarNumber/' + this.onlyList.id,
       //  url: '/base/base-agv/getBaseCarNumber/' + this.queryParamsAGV.carId,
        method: 'get'
      }).then(response => {
        
          this.numberList = response.data
          for (let i = 0; i < this.numberList.length; i++) {
            for (let j = 0; j < this.storedNumberList.length; j++) {
              if (this.numberList[i].electrodePositionNumber === this.storedNumberList[j].electrodePositionNumber) {
                this.storedNumberList[j].rfid = this.numberList[i].rfid
                this.storedNumberList[j].electrodePositionNumber = this.numberList[i].electrodePositionNumber
                this.storedNumberList[j].status = this.numberList[i].status
              }
            }
          }
          for (let i = 0; i < this.numberList.length; i++) {
            for (let j = 0; j < this.positionList.length; j++) {
              if (this.numberList[i].electrodePositionNumber === this.positionList[j].name || this.numberList[i].status === 1) {
                this.positionList.splice(j, 1)
              }
            }
          }
          this.loading = false
        }
      )
    },

    /** 分页查询治具名称列表 */
    getListBaseEquipmentRfid() {
      getBaseEquipmentRfidPage(this.queryParamsDevice).then(response => {
        // this.deviceList = response.data.records
        const originalList = response.data.records
        const uniqueDeviceNos = {}
        // 遍历原始列表
        originalList.forEach(item => {
          const deviceNo = item.deviceNo
          if (!uniqueDeviceNos[deviceNo]) {
            uniqueDeviceNos[deviceNo] = true
            this.deviceList.push(item) // 将不重复的条目添加到新列表中
          }
        })
      })
    },

    /** 根据车号查询已绑定的电极 */
    getBaseElectrodeAuto() {
      this.begin = true
      this.semiAutoList = []
      getBaseElectrodeAutoPage(this.queryParams).then(response => {
        this.repeatList = response.data.records
        const middle = response.data.records
        const filteredData = middle.filter(item => item.id !== undefined)
        // console.log(middle)
        // console.log(filteredData)
        // for (let i = 0; i < middle.length; i++) {
        //   if (middle[i].id === undefined) {
        //     middle.splice(i, 1)
        //   }
        // }
        // console.log(middle)
        
        if (filteredData.length > 0) {
          this.begin = false
          for (let i = 0; i < filteredData.length; i++) {
            this.semiAutoList = filteredData
            // Rfid 电极号
            getBaseElectrodeByWorkpieceOrEleRfid({ 'keyWords': filteredData[i].workpieceEleRfid }).then(response => {
              this.middleList = response.data
              delete this.middleList.theoreticalProcessingTime
              delete this.middleList.electrodeSerialNo
              delete this.middleList.dispatchOrderNo
              delete this.middleList.currentSection
              delete this.middleList.currentProcess
              // console.log(this.middleList)
              this.semiAutoList.splice(i, 1, Object.assign(this.semiAutoList[i], this.middleList))
              // this.semiAutoList.push(this.middleList)
              for (let j = 0; j < this.numberList.length; j++) {
                if (this.numberList[j].rfid === this.semiAutoList[i].workpieceEleRfid) {
                  // const y = j + 1
                  this.semiAutoList[i].electrodePositionNumber = this.numberList[j].electrodePositionNumber
                  // this.p1.push(this.semiAutoList[i].electrodePositionNumber)
                  // this.p2.push(y.toString())
                }
              }
            })
            // 机床治具RFID获取设备使用信息  查询 这张表 base_equipment_rfid rfid = 治具id base_equipment_rfid
            // 原来的查询条件为 filteredData[i].deviceRfid，主要将 coordinate 坐标与使用工艺信息添加上
            getBaseEqUseByEqRfid({ 'keyWords': filteredData[i].deviceRfid }).then(response => {
              if(response.data !=null && response.data!= undefined){
                this.middleList = response.data
                delete this.middleList.controller 
                delete this.middleList.createTime 
                delete this.middleList.delFlag
                delete this.middleList.deptName 
                delete this.middleList.name 
                delete this.middleList.networkAddress 
                delete this.middleList.op 
                delete this.middleList.type 
                delete this.middleList.updateTime
                delete this.middleList.id 
                this.semiAutoList.splice(i, 1, Object.assign({}, this.semiAutoList[i], this.middleList))
              }
            }) 
          }
        }

        // setTimeout(()=>{
        //   let data = this.semiAutoList
        //   const positionOrder = {
        //     "A1": 1, "A2": 2, "A3": 3, "A4": 4, "A5": 5,
        //     "B1": 6, "B2": 7, "B3": 8, "B4": 9, "B5": 10,
        //     "C1": 11, "C2": 12, "C3": 13, "C4": 14, "C5": 15
        //   };
        //
        //   data.sort((a, b) => {
        //     const positionA = positionOrder[a.electrodePositionNumber];
        //     const positionB = positionOrder[b.electrodePositionNumber];
        //     return positionA - positionB;
        //   });
        // },1000)


      })

    },

    /** 搜索添加按钮操作 */
    handleQueryAdd() {
      this.begin = true
      if (this.queryParamsDevice.deviceNo == '') {
        this.queryParamsDevice = {
          pageNo: 1,
          pageSize: 100
        }
      }
      this.queryParamsDevice.pageNo = 1
      
      getBaseEquipmentRfidPage(this.queryParamsDevice).then(response => {
        const arr = []
        for (let i = 0; i < response.data.records.length; i++) {
          arr.splice(i, 0, response.data.records[i])
          delete arr[i].updateTime
          delete arr[i].createTime
          delete arr[i].id
          delete arr[i].controller
          delete arr[i].delFlag
          delete arr[i].networkAddress
          delete arr[i].deptName
          delete arr[i].type

        }
        this.obj.carIdNew = this.onlyList2.id
        this.obj.type = this.onlyList2.type
        this.obj.deviceId = this.onlyList2.deviceId
        this.semiAutoList = arr
        if (this.semiAutoList.length > 0) {
          this.begin = false
        }
      })
    },

    /** 根据RFID获取工件/电极信息 */
    selectProduction(row) {
      this.index = row.index
      let flag = true
      for (let i = 0; i < this.semiAutoList.length; i++) {
        if (row.index !== i) {
          if (row.workpieceEleRfid === this.semiAutoList[i].workpieceEleRfid) {
            this.$modal.msgError('请勿重复添加相同数据，请检查后重新添加')
            this.repeat = true
            flag = false
            break
          } else {
            flag = true
          }
        }
      }
      if (flag) {
        this.repeat = false
        this.getProductionList(row.workpieceEleRfid)
        for (let i = 0; i < this.numberList.length; i++) {
          if (this.numberList[i].rfid === this.semiAutoList[row.index].workpieceEleRfid) {
            this.semiAutoList[row.index].electrodePositionNumber = this.numberList[i].electrodePositionNumber
          }
        }
      }
      //  这里发送时要加个状态，如果重复了状态为否，不能发送
    },

    /** 分页查询电极信息 */
    getProductionList(c) {
      const workpieceEleRfid = c
      getBaseElectrodeByWorkpieceOrEleRfid({ 'keyWords': workpieceEleRfid }).then(response => {
        this.middleList = response.data
        this.semiAutoList.splice(this.index, 1, Object.assign(this.semiAutoList[this.index], this.middleList))
      })
    },

    /** 上料按钮 */
    feeding() {
      this.repeat = true
      setTimeout(() => {
        this.repeat = false   //点击一次时隔五秒后才能再次点击
      }, 5000)
      this.p1 = []
      this.p2 = []
      const data = this.semiAutoList

      // const positionOrder = {
      //   "A1": 1, "B1": 2, "C1": 3, "A2": 4, "B2": 5,
      //   "C2": 6, "A3": 7, "B3": 8, "C3": 9, "A4": 10,
      //   "B4": 11, "C4": 12, "A5": 13, "B5": 14, "C5": 15
      // };

      const positionOrder = {
        "A1": 1, "A2": 2, "A3": 3, "A4": 4, "A5": 5,
        "B1": 6, "B2": 7, "B3": 8, "B4": 9, "B5": 10,
        "C1": 11, "C2": 12, "C3": 13, "C4": 14, "C5": 15
      };

      data.sort((a, b) => {
        const positionA = positionOrder[a.electrodePositionNumber];
        const positionB = positionOrder[b.electrodePositionNumber];
        return positionA - positionB;
      });

      for (let i = 0;i < data.length;i++){
        const y = i + 1
        this.p1.push(data[i].electrodePositionNumber)
        // this.p2.push(y.toString())
      }
      if(data.length === 1){
        this.p2.push("5")
      }else if(data.length === 2){
        this.p2.push("6")
      }else if(data.length === 3){
        this.p2.push("7")
      }else if(data.length === 4){
        this.p2.push("8")
      }
      // this.p2.reverse()
      let form = {
        data: {
          orderId: '12345',
          carId: this.onlyList2.id,
          deviceId: this.onlyList2.deviceId,
          type: this.onlyList2.type,
          taskName: '',
          task: [
            {
              action: 'lxScriptTask',
              name: 'do1',
              point: this.repeatList[0].point,
              data: {
                p1: this.p1,
                p2: this.p2
              }
            },
            {
              action: 'lxScriptTask',
              name: 'do2',
              point: this.queryParamsDevice.deviceNo,
              data: {
                p2: this.p2 //要放到机床加工位的位置
              }
            }
          ]
        },
        key: 'AIS7ER83RJDFU92ERF'
      }
      taskLxRequest(form).then(response => {
        if (response.status === 200) {
          this.$modal.msgSuccess('上料成功')
        } else {
          this.$modal.msgError('上料失败')
        }
      })
    },

    /** 下料按钮 */
    blanking() {
      opDoor({ 'op': '0' }).then(response => {
        if(response.code == 200){
          this.$modal.msgSuccess("开门成功");
        }
      })
      this.repeat = true
      setTimeout(() => {
        this.repeat = false   //点击一次时隔五秒后才能再次点击
      }, 5000)
      this.p1 = []
      this.p2 = []
      const data = this.semiAutoList

      // const positionOrder = {
      //   "C5": 1, "B5": 2, "A5": 3, "C4": 4, "B4": 5,
      //   "A4": 6, "C3": 7, "B3": 8, "A3": 9, "C2": 10,
      //   "B2": 11, "A2": 12, "C1": 13, "B1": 14, "A1": 15
      // };

      const positionOrder = {
        "C5": 1, "C4": 2, "C3": 3, "C2": 4, "C1": 5,
        "B5": 6, "B4": 7, "B3": 8, "B2": 9, "B1": 10,
        "A5": 11, "A4": 12, "A3": 13, "A2": 14, "A1": 15
      };

      data.sort((a, b) => {
        const positionA = positionOrder[a.electrodePositionNumber];
        const positionB = positionOrder[b.electrodePositionNumber];
        return positionA - positionB;
      });

      for (let i = 0;i < data.length;i++){
        const y = i + 1
        this.p1.push(data[i].electrodePositionNumber)
        // this.p2.push(y.toString())
      }
      if(data.length === 1){
        this.p2.push("5")
      }else if(data.length === 2){
        this.p2.push("6")
      }else if(data.length === 3){
        this.p2.push("7")
      }else if(data.length === 4){
        this.p2.push("8")
      }
      // this.p2.reverse()
      let form = {
        data: {
          orderId: '123456',
          carId: this.onlyList2.id,
          deviceId: this.onlyList2.deviceId,
          type: this.onlyList2.type,
          taskName: '',
          task: [
            {
              action: 'lxScriptTask',
              name: 'do3',
              point: this.queryParamsDevice.deviceNo,
              data: {
                p2: this.p2 //要放到机床加工位的位置
              }
            },
            {
              action: 'lxScriptTask',
              name: 'do4',
              point: this.repeatList[0].point,
              data: {
                p1: this.p1,
                p2: this.p2
              }
            }
          ]
        },
        key: 'AIS7ER83RJDFU92ERF'
      }
      taskLxRequest(form).then(response => {
        if (response.status === 200) {
          this.$modal.msgSuccess('下料成功')
        } else {
          this.$modal.msgError('下料失败')
        }
      })
    },

    /** 发送按钮 */
    transportOpen() {

      this.repeat = true
      setTimeout(() => {
        this.multiple=false;
        this.repeat = false   //点击一次时隔五秒后才能再次点击
      }, 15000)

      const data = this.semiAutoList
      const positionOrder = {
        "A1": 1, "A2": 2, "A3": 3, "A4": 4, "A5": 5,
        "B1": 6, "B2": 7, "B3": 8, "B4": 9, "B5": 10,
        "C1": 11, "C2": 12, "C3": 13, "C4": 14, "C5": 15
      };

      data.sort((a, b) => {
        const positionA = positionOrder[a.electrodePositionNumber];
        const positionB = positionOrder[b.electrodePositionNumber];
        return positionA - positionB;
      });

      if (this.onlyList2.id === undefined) {
        this.$modal.msgError('请选择AMR')
        return ;
      } else {
        // console.log(this.semiAutoList)
        this.sendList = this.semiAutoList
        if (this.selectStatue) {
          this.sendList = this.selectionList
        }
        let flag = true
        let condition = true

        for (let i = 0; i < this.sendList.length; i++) {
          if (this.sendList[i].workpieceEleRfid === undefined || this.sendList[i].workpieceEleRfid === '') {
            flag = false
            condition = false
            this.$modal.msgError('有空数据，检查后重新发送')
            break
          } else {
            flag = true
            condition = true
          }
        }

        if (condition) {
          outer:
            for (let i = 0; i < this.sendList.length; i++) {
              if (this.sendList[i].id === undefined) {
                for (let j = 0; j < this.repeatList.length; j++) {
                  if (this.repeatList[j].workpieceEleRfid === this.sendList[i].workpieceEleRfid) {
                    if (this.repeatList[j].deviceNo !== undefined) {
                      flag = false
                      this.$modal.msgError('发送的数据已经发送过了，请查询车号后重新发送')
                      break outer
                    } else {
                      flag = true
                    }
                  }
                }
              }
            }
        }

        if (flag) {
          for (let i = 0; i < this.sendList.length; i++) {
            for (let j = 0; j < this.getpointList.length; j++) {
              if (this.sendList[i].workpieceEleRfid === this.getpointList[j].rfid) {
                this.sendList[i].point = this.getpointList[j].point
              }
            }
          }

          this.d = []
          this.e = []
          const arr = []
          const arr2 = []

          this.sendList.forEach(item => {
            arr.push({
              'prodOrderNo': item.prodOrderNo,
              'type': 'CNC',
              'fileType': 'ElecNC_All',
              'nc': '1',
              'deviceNo': item.deviceNo,
              'coordinate': item.coordinate,
              'eleInformation': item.moduleNo + '-' + item.pieceNo + '-' + item.versionNo + '-' + item.electrodeNumber
            })
            if (item.id === undefined) {
              arr2.push({
                'baseCarNumber': item.electrodePositionNumber,
                //'carId': this.onlyList._id,
                'carId': this.onlyList.id,
                'carIdNew': this.onlyList2.id,
                'deviceNo': item.deviceNo,
                'deviceId': this.onlyList2.deviceId,
                'type': this.onlyList2.type,
                'id': 0,
                'moduleNo': item.moduleNo,
                'deviceRfid': item.rfid,
                'point': item.point,
                'coordinate': item.coordinate,
                'prodOrderNo': item.prodOrderNo,
                'rfid': item.workpieceEleRfid,
                'workpiece': item.pieceNo,
                'status': '1'
              })
            } else {
              arr2.push({
                'baseCarNumber': item.electrodePositionNumber,
                'carId': this.onlyList.id,
               // 'carId': this.onlyList2.id,
                'carIdNew': this.onlyList2.id,
                'deviceNo': item.deviceNo,
                'deviceId': this.onlyList2.deviceId,
                'type': this.onlyList2.type,
                'id': item.id,
                'moduleNo': item.moduleNo,
                'deviceRfid': item.rfid,
                'point': item.point,
                'prodOrderNo': item.prodOrderNo,
                'coordinate': item.coordinate,
                'rfid': item.workpieceEleRfid,
                'workpiece': item.pieceNo,
                'status': '1'
              })
            }
          })

          for (let i = 0; i < arr.length; i++) {
            let c = arr[i].coordinate.slice(1)
            this.d += '(-----------PROBE ' + arr[i].coordinate + '------------)\n' + 'G65P10' + c + '\n'
          }
          for (let i = 0; i < arr.length; i++) {
            let c = arr[i].coordinate.slice(1)
            this.e += '(----------MILLING ' + arr[i].coordinate + ' ' + arr[i].eleInformation + '-------------)\n' + 'M252\n'
              + arr[i].coordinate + '\nM198P01' + c + '\n'
          }
      // 组装成主程序，操作机床需要，下载文件到机床 下载地址 http://10.47.71.30:8807/iot/iot/downloadFTP 
          const g = '%\nO0199(MAIN)\n' + this.d.slice(0) + this.e.slice(0) + 'M99\n%'

          const e = this.personNo
          // console.log(this.personNo)
          this.baseDlFileIn.dtoList = arr
          this.baseDlFileIn.m = g

          this.sendDtoList = arr2
          semiAutosend({ 'baseDlFileIn': this.baseDlFileIn, 'sendDtoList': arr2 }).then(res => {
            this.$modal.msgSuccess('发送成功')
            this.getBaseElectrodeAuto()
          })
          // console.log(this.baseDlFileIn)
          // console.log(this.sendDtoList)
        }
      }
    },

    /** 自动化停止进程 */
    transportStop(){
      stopSemiAuto().then(res => {
        if(res.code == 200){
          this.$modal.msgSuccess("停止进程成功");
        } else {
          this.$modal.msgSuccess("停止进程失败，请重试");
        }
      })
    },

    /** 重置物料位置信息 */
    reset() {
      this.storedNumberList = [{
        electrodePositionNumber: 'A1',
        status: 0
      }, {
        electrodePositionNumber: 'A2',
        status: 0
      }, {
        electrodePositionNumber: 'A3',
        status: 0
      }, {
        electrodePositionNumber: 'A4',
        status: 0
      }, {
        electrodePositionNumber: 'A5',
        status: 0
      }, {
        electrodePositionNumber: 'B1',
        status: 0
      }, {
        electrodePositionNumber: 'B2',
        status: 0
      }, {
        electrodePositionNumber: 'B3',
        status: 0
      }, {
        electrodePositionNumber: 'B4',
        status: 0
      }, {
        electrodePositionNumber: 'B5',
        status: 0
      }, {
        electrodePositionNumber: 'C1',
        status: 0
      }, {
        electrodePositionNumber: 'C2',
        status: 0
      }, {
        electrodePositionNumber: 'C3',
        status: 0
      }, {
        electrodePositionNumber: 'C4',
        status: 0
      }, {
        electrodePositionNumber: 'C5',
        status: 0
      }]
    },

    /** 查询登录用户信息*/
    getListUser() {
      getUserProfile().then(response => {
        this.userName = response.data.nickName
        this.personNo = response.data.userName
        this.deptName = response.data.dept.name
      })
    },

    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNo = 1
      this.begin = true
      this.onlyList = []
      this.onlyList2 = []
      for (const item of this.amrList) {
        if (item.id === this.queryParamsAGV.carId) {
          this.onlyList2 = item
          break
        }
      }
      
      for (const item of this.objectList) {
        //if (item._id === this.queryParams.carId) {
        if (item.id === this.queryParams.carId) {
          this.onlyList = item
          break
        }
      }
      this.reset()
      this.getListAmrNumber()
      this.getBaseElectrodeAuto()
      this.getListAmrBinding()
    },

    /** AMR小车变化操作 */
    AMRChange() {
      this.onlyList2 = []
      for (const item of this.amrList) {
        if (item.id === this.queryParamsAGV.carId) {
          this.onlyList2 = item
          break
        }
      }
      
    },

    //双击选中一行
    lineClick(val) {
      for (let i = 0; i < this.semiAutoList.length; i++) {
        if (this.semiAutoList[i].workpieceEleRfid === val.rfid) {
          this.$modal.msgError('请勿重复添加相同数据，请检查后重新添加')
          break
        } else {
          if (this.semiAutoList[i].workpieceEleRfid == undefined) {
            getBaseElectrodeByWorkpieceOrEleRfid({ 'keyWords': val.rfid }).then(response => {
              this.middleList = response.data
              this.semiAutoList.splice(i, 1, Object.assign(this.semiAutoList[i], this.middleList))
            })
            // this.semiAutoList[i].workpieceEleRfid = val.rfid
            this.semiAutoList[i].electrodePositionNumber = val.electrodePositionNumber
            break
          }
        }
      }
    },

    /** 多选框全选 */
    handleCheckAllChange(val) {
      if (this.checkAll) {
        this.queryParams.taskStatusList = [0, 1, 2, 3, 4, 5]
        this.isIndeterminate = false
      } else {
        this.queryParams.taskStatusList = []
      }
    },

    // 多选框选中数据
    handleSelectionChange(selection) {
      this.selectionList = selection
      this.selectStatue = this.selectionList.length > 0
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },

    /** 表格数据增加index */
    tableRowClassName({ row, rowIndex }) {
      //把每一行的索引放进row
      row.index = rowIndex
    },

    /** 多选框禁选 */
    selected(row, index) {
      
       return true;
    },

    /** 增加数据行 */
    handleAddData() {
      this.begin = false
      this.semiAutoList.push(JSON.parse(JSON.stringify(this.obj)))
    },

    /** 删除数据行 */
    handleDeleteData(row, index) {
      this.semiAutoList.splice(index, 1)
      if (this.semiAutoList.length == 0) {
        this.begin = true
      }
    },

    /** 表头点击 */
    clickFunPre(column, event) {
      if (column.label === '+') {
        this.begin = false
        this.semiAutoList.push(JSON.parse(JSON.stringify(this.obj)))
      }
      if (column.label === '-') {
        this.semiAutoList = []
        this.begin = true
      }
    }
  }
}
</script>
<style lang="scss">

</style>
