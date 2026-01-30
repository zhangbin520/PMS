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
          <el-form-item label="料架位置点位：">
            <el-tag>{{ onlyList.atPoint }}</el-tag>
          </el-form-item>
          <el-form-item label="AGV小车名称：" prop="keywords">
            <el-select v-model="queryParamsAGV.carId" filterable placeholder="请选择" clearable style="width: 150px"
                       @change="positionSet2"
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
          <el-form-item label="运输点位：" style="margin-left: 20px" prop="keywords">
            <el-select v-model="formPosition.name" filterable placeholder="请选择" clearable style="width: 150px">
              <el-option
                v-for="item in position"
                :key="item.name"
                :label="item.name"
                :value="item.name"
              >
              </el-option>
            </el-select>
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
        <el-table v-loading="loading" :data="amrBindingList" max-height="680px"
                  @selection-change="handleSelectionChange"
                  :row-class-name="tableRowClassName" @header-click="clickFunPre" border highlight-current-row
        >
          <el-table-column type="index" label="序号" width="50" align="center"/>
          <el-table-column type="selection" align="center" :selectable="selected"/>
          <el-table-column label="RFID" align="center" key="rfid" prop="rfid" width="120px">
            <template slot-scope="scope">
              <el-input v-model="scope.row.rfid" autofocus="true" @change="selectProduction(scope.row)">
                {{ scope.row.rfid }}
              </el-input>
            </template>
          </el-table-column>
          <el-table-column label="类型" align="center" prop="datasource">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.datasource == 0" type="success">钢件</el-tag>
              <el-tag v-if="scope.row.datasource == 1" type="danger">电极</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="生产单号" align="center" prop="prodOrderNo" width="150" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <span>{{ scope.row.prodOrderNo }}</span>
            </template>
          </el-table-column>
          <el-table-column label="料架位置ID" align="center" prop="carId"/>
          <el-table-column label="料架位置名称" align="center" prop="carName"/>
          <el-table-column label="物料位置" align="center" prop="electrodePositionNumber">
            <template slot-scope="scope">
              <el-select v-model="scope.row.electrodePositionNumber" @change="positionChange" filterable
                         placeholder="请选择" clearable
              >
                <el-option
                  v-for="item in positionList"
                  :key="item.name"
                  :label="item.name"
                  :value="item.name"
                >
                </el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="运输点位" align="center" prop="point"/>
          <el-table-column label="创建人" align="center" prop="createBy"/>
          <el-table-column label="创建时间" align="center" prop="createTime"/>
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
          <el-button size="small" type="primary" icon="el-icon-video-play" v-preventReClick="2000" @click="bind"
                     :disabled="begin"
          >绑料
          </el-button>
          <el-button size="small" type="warning" icon="el-icon-video-pause" @click="unbind" :disabled="begin">解绑
          </el-button>
          <el-button size="small" type="success" icon="el-icon-check" v-preventReClick="2000" @click="submit"
                     :disabled="begin"
          >运输
          </el-button>
          <el-button size="small" type="success" icon="el-icon-check" v-preventReClick="2000" @click="confirm"
                     :disabled="begin"
          >确认状态
          </el-button>
        </el-card>
      </el-card>
    </el-col>
    <el-card>
      <div slot="header">
        <span>料架位置名称：<el-tag>{{ onlyList.name }}</el-tag></span>
      </div>
      <div>
        <el-table :data="storedNumberList" max-height="800px">
          <el-table-column label="物料位置" align="center" prop="electrodePositionNumber" :show-overflow-tooltip="true"/>
          <el-table-column label="占用状态" align="center" prop="status" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.status == 0" type="success">否</el-tag>
              <el-tag v-if="scope.row.status == 1" type="danger">是</el-tag>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>

    <!--    &lt;!&ndash; 任务请求对话框 &ndash;&gt;-->
    <!--    <el-dialog :title="title" :visible.sync="openPosition" width="550px" append-to-body>-->
    <!--      <el-form ref="form" :model="formPosition" :rules="rules" label-width="120px">-->
    <!--        <el-form-item label="点位信息" prop="point">-->
    <!--          <el-select v-model="formPosition.point"  filterable placeholder="选择要运输的点位" clearable size="small">-->
    <!--            <el-option-->
    <!--              v-for="item in position"-->
    <!--              :key="item.remarks"-->
    <!--              :label="item.remarks"-->
    <!--              :value="item.remarks"-->
    <!--            />-->
    <!--          </el-select>-->
    <!--        </el-form-item>-->
    <!--      </el-form>-->
    <!--      <div slot="footer" class="dialog-footer">-->
    <!--        <el-button type="primary" @click="submit">确 定</el-button>-->
    <!--        <el-button @click="cancel">取 消</el-button>-->
    <!--      </div>-->
    <!--    </el-dialog>-->

  </div>
</template>

<script>
import { getUserProfile } from '../../../api/system/user'
import { amrGetList, binding, taskLxRequest, unbinding } from '@/api/amr/amr'
import amrRequest from '@/utils/amrRequest'
import request from '@/utils/request'
import { getBaseElectrodeByWorkpieceOrEleRfid } from '@/api/production/semiAutomation'

export default {
  name: 'amrBinding',
  data() {
    return {
      // 遮罩层
      loading: true,
      //
      begin: true,
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 总条数
      total: 0,
      totalHisPage: 0,
      //筛选后的amr列表和物料位置列表
      onlyList: [],
      onlyList2: [],
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
      // 加工任务表格数据
      taskStationList: [],
      //运输返回任务id
      dispatchId: '',
      //AMR绑定列表
      amrBindingList: [],
      //小车车号上物料列表
      numberList: [],
      index: '',
      //接受弹框数据
      form: {},
      formPosition: {},
      //任务ID
      Id: [],
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
      position: [
        /*  {
           "_id": "646ad0300d815955c87bacf0",
           "__v": 0,
           "remarks": "设备点A",
           "thingsAt": "2023-06-07T01:02:11.085Z",
           "things": "635b7ef918792e752808b39e",
           "belongToCar": null,
           "isSleep": "",
           "car": "",
           "updatedAt": "2023-06-01T07:51:27.465Z",
           "createdAt": "2023-05-22T02:15:12.026Z",
           "removed": false,
           "active": true,
           "sort": 1,
           "action": "nothing",
           "worktable": "646ad4760d815955c87bad8a",
           "obstacleDistance": 0,
           "scriptTask": null,
           "taskType": "",
           "movementType": "forward",
           "rad": 0.5,
           "speed": 0.5,
           "name": "1",
           "type": "device",
           "y": 20,
           "x": -20,
           "map": "6423dce27f2bbb11bcae9cb3"
         } */
        
         
      ],
      //待选设备选中数据
      stationId: '',
      taskId: '',
      //接收按钮禁止状态
      acceptDisabled: false,
      // 查询参数
      queryParams: {},
      queryParamsAGV: {},
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
        rfid: ''

      },
      //物料位置集合
      objectList: [
       /*  {
         '_id': '61bfd33b2753ce4b44a90cc9',
       'name': '1',
         'type': 'Compact',
         'error': false,
         'errorMessage': '',
        'meters': 1166,
        'deviceId': '1C-69-7A-0A-9E-5E',
        'battery': 40,
        'battery_charging': 0,
         'battery_voltage': 48.900002,
         'battery_current': 3.2,
        'pos': {
          'x': '-12.779',
          'y': '5.772',
          'angle': 0,
          'speed': '0.62',
           'rad': '0'
         },
         'map': '1200000',
        'mapId': '621ee0729d8b76820d4fc0e6',
         'atPoint': '8',
         'atPointId': '623185d5edbe7981b1472aeb',
         'deviation': 0.172465,
         'dispatchId': '',
       'dispatchName': '',
        'dispatchNum': 0
       },
         {
          '_id': '61bfd33b2753ce4b434acc9',
           'name': '2',
           'type': 'Compact',
         'error': true,
          'errorMessage': '定位故障控制板故障',
           'meters': 352,
           'deviceId': '1C-69-7A-0B-2B-31',
           'battery': 40,
           'battery_charging': 0,
         'battery_voltage': 48.900002,
           'battery_current': 3.2,
           'pos': {
             'x': '29.144',
             'y': '-5.173',
             'angle': -0.003030293756340721,
           'speed': '0.62',
             'rad': '0'
           },
           'map': '1200000',
           'mapId': '621ee0729d8b76820d4fc0e6',
          'atPoint': '185',
           'atPointId': '6232aace376ebcc1d541bbef',
          'deviation': 0.172465,
           'dispatchId': '',
           'dispatchName': '',
           'dispatchNum': 0
         } */
        ],
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
    this.getListAmrBinding()
    this.getListUser()
    this.getListPosition()
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
        console.log('测试。。。。。。。。。。。。。。。')
        this.amrList = response.content
        
        //let filteredData = this.amrList.filter(function(item) {
          // 使用split方法分割key属性，并检查下划线的数量
         // let underscoreCount = item.name.split('_').length - 1;

          // 检查下划线的数量是否符合条件
         // return underscoreCount === 3
         // return true ;
        //});
        //this.amrList = filteredData
        this.loading = false
      })
    },

    /** 查询AMR点位信息列表 */
    getListPosition() {
      this.loading = true
      return amrRequest({
        //url: '/api/fexa/v1/external/points/list?key=AIS7ER83RJDFU92ERF&data={"type":{"$ne":"route"}}',
        url: '/api/fexa/v1/external/points/list',
        method: 'get'
      }).then(response => {
          this.position = response.content
          this.loading = false
        }
      )
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

    /** 查询AMR绑料列表 根据carId获取绑定详情列表*/
    /**  绑完之后，根据carId  查询绑定电极列表 ，解绑之后也查询此列表 */
    getListAmrBinding() {
      if (this.queryParams.carId === '') {
        this.queryParams.carId = undefined
      }
      
      this.loading = true
      return request({
       url: '/base/base-agv/getBaseAgvBindingMaterial/' + this.queryParams.carId,
       // url: '/base/base-agv/getBaseAgvBindingMaterial/' + this.queryParamsAGV.carId,
        method: 'get'
      }).then(response => {
          this.amrBindingList = response.data
          if (this.amrBindingList.length !== 0) {
            this.begin = false
          }
          this.loading = false
        }
      )
    },

    /** 查询AMR绑料列表 根据carId获取车号使用情况*/
    // 根据carId  查询 料架位置列表 查询 料架位置是否被占用 storedNumberList
    getListAmrNumber() {
      this.loading = true
      
      return request({
       url: '/base/base-agv/getBaseCarNumber/' + this.queryParams.carId,
        // url: '/base/base-agv/getBaseCarNumber/' + this.queryParamsAGV.carId,
        method: 'get'
      }).then(response => {
        
          this.numberList = response.data
          for (let i = 0; i < this.numberList.length; i++) {
            for (let j = 0; j < this.storedNumberList.length; j++) {
              //  根据 位置信息 A1、 B1等判断 位置是否被占用
              if (this.numberList[i].electrodePositionNumber === this.storedNumberList[j].electrodePositionNumber) {
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

    /** 根据RFID获取工件/电极信息 */
    selectProduction(row) {
      console.log(row.index)
      this.index = row.index
      this.getProductionList(row.rfid)
    },

    /** 分页查询电极信息 */
    getProductionList(c) {
      const rfid = c
      getBaseElectrodeByWorkpieceOrEleRfid({ 'keyWords': rfid }).then(response => {
        this.middleList.prodOrderNo = response.data.prodOrderNo
        this.middleList.datasource = '1'
        this.amrBindingList.splice(this.index, 1, Object.assign(this.amrBindingList[this.index], this.middleList))
      })
    },

    /** 绑料 */
    bind() {
    // 判断料架位置名称、AGV小车名称、运输点位 都不为空
     if(this.queryParams.carId == null||this.queryParams.carId == undefined||this.queryParams.carId == ''){
         this.$modal.msgError('请选择料架位置名称')
     }
      const filteredData = this.amrBindingList.filter(item => item.createBy === undefined)
      let status = false
      let status2 = false
      let status3 = false
      console.log(filteredData)
      for (let i = 0; i < filteredData.length; i++) {
        filteredData[i].point = this.formPosition.name
        if (filteredData[i].rfid === '') {
          status = true
        } else {
          status = false
        }
        if (filteredData[i].point === undefined) {
          status2 = true
        } else {
          status2 = false
        }
        if (filteredData[i].electrodePositionNumber === undefined) {
          status3 = true
        } else {
          status3 = false
        }
        if(this.amrBindingList.carId === '' || this.amrBindingList.carId === undefined){
          filteredData[i].carId = this.queryParams.carId
        }
        //filteredData[i].carId = '62288ed50013381a389f7913';
        //alert(filteredData[i].carId)
      }
      
      if (filteredData.length === 0) {
        this.$modal.msgError('没有要绑定的列表，请检查后重试')
      } else if (status) {
        this.$modal.msgError('有RFID为空，请检查后重试')
      } else if (status2) {
        this.$modal.msgError('有点位位置为空，请检查后重试')
      } else if (status3) {
        this.$modal.msgError('有物料位置为空，请检查后重试')
      } else {
        
        // console.log(filteredData)
        binding(filteredData).then(response => {
          this.$modal.msgSuccess('绑定成功')
          this.reset()
          this.getListAmrNumber()
          this.getListAmrBinding()
        })
      }
    },

    /** 解料 */
    unbind() {
      unbinding({ 'rfidIds': this.rfids }).then(response => {
        this.$modal.msgSuccess('解绑成功')
        this.reset()
        this.getListAmrNumber()
        this.getListAmrBinding()
      })
    },

    /** 物料位置变化 */
    positionChange() {
      this.reset()
      for (let i = 0; i < this.amrBindingList.length; i++) {
        for (let j = 0; j < this.positionList.length; j++) {
          if (this.amrBindingList[i].electrodePositionNumber === this.positionList[j].name || this.amrBindingList[i].status === 1) {
            this.positionList.splice(j, 1)
          }
        }
      }
    },

    /** 运输确定按钮 */
    submit() {
      console.log(this.form)
      if (this.form.data.carId === undefined) {
        this.$modal.msgError('未选择AGV小车，请检查后重新运输')
      } else if (this.formPosition.name === '' || this.formPosition.name !== this.amrBindingList[0].point) {
        this.$modal.msgError('运输点位为空或与之前绑定点位不一致，请检查后重新运输')
      } else {
        const choosePosition = []
        choosePosition[0] = this.formPosition
        choosePosition[1] = {
          action: 'route',
          name: '休息点5'
        }
        this.form.data.task = choosePosition
        this.form.data.orderId = this.amrBindingList[0].rfid
        // console.log(this.form)
        taskLxRequest(this.form).then(response => {
          this.dispatchId = response.content[0].dispatchId
          this.$modal.msgSuccess('运输成功')
          this.openPosition = false
        })
      }
    },
//  确认状态 ，获取料车到位信号，拿到料车到位状态 done 就可以进行下一步
    confirm() {
      return amrRequest({
       // url: '/api/fexa/v1/external/dispatch/findById?key=AIS7ER83RJDFU92ERF&data={"id":"' + this.amrBindingList[0].rfid + '"}',
        url: '/api/fexa/v1/external/dispatch/findById?id=' + this.amrBindingList[0].rfid ,
        method: 'get'
      }).then(response => {
          if (response.content.status === 'done') {
            this.$modal.msgSuccess('状态为完成')
          } else {
            this.$modal.msgError('状态错误')
          }
          this.loading = false
        }
      )
    },

    // /** 运输取消按钮 */
    // cancel(){
    //   this.openPosition = false
    //   this.positionSet()
    // },

    /** 重置点位位置信息 */
    positionSet2() {
      for (const item of this.amrList) {
        if (item.id === this.queryParamsAGV.carId) {
          this.onlyList2 = item
          break
        }
      }
      
      this.dispatchId = this.onlyList2.dispatchId
      this.form = {
        data: {
          carId: this.onlyList2.id,
          deviceId: this.onlyList2.deviceId,
          type: this.onlyList2.type,
          taskName: '',
          task: [
            {
              action: 'route',
              name: ''
            },
            {
              action: 'route',
              name: '休息点5'
            }
          ]
        },
        key: 'AIS7ER83RJDFU92ERF'
      }
      this.resetForm('form')
    },

    /** 重置点位位置信息 */
    positionSet() {
      for (const item of this.amrList) {
        if (item.id === this.queryParamsAGV.carId) {
          this.onlyList2 = item
          break
        }
      }
      this.formPosition = {
        action: 'route',
        name: undefined
      }
      this.form = {
        data: {
          carId: this.onlyList2.id,
          deviceId: this.onlyList2.deviceId,
          type: this.onlyList2.type,
          taskName: '',
          task: [
            {
              action: 'route',
              name: ''
            },
            {
              action: 'route',
              name: '休息点5'
            }
          ]
        },
        key: 'AIS7ER83RJDFU92ERF'
      }
      this.resetForm('form')
    },

    /** 重置物料位置信息 */
    reset() {
      this.positionList = [{
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
      }]
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
        if (item.id === this.queryParams.carId) {
          this.onlyList = item
          console.log('onlyList:'+this.onlyList)
          break
        }
      }
      this.obj.carId = this.onlyList.id
      this.obj.carName = this.onlyList.name
      this.positionSet()
      this.reset()
      this.getListAmrBinding()
      this.getListAmrNumber()
     
      console.log('obj.carId'+ this.onlyList.id)
      console.log('obj.carName'+ this.onlyList.name)
      console.log('carId: '+this.queryParams.carId)
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
      this.single = selection.length !== 1
      this.multiple = !selection.length
      this.rfids = selection.map(item => item.rfid)
    },

    /** 表格数据增加index */
    tableRowClassName({ row, rowIndex }) {
      //把每一行的索引放进row
      row.index = rowIndex
    },

    /** 多选框禁选 */
    selected(row, index) {
      if (row.status == '1') {
        return false //可勾选
      } else {
        return true //不可勾选
      }
    },

    /** 增加数据行 */
    handleAddData() {
      this.begin = false
      this.amrBindingList.push(JSON.parse(JSON.stringify(this.obj)))
    },

    /** 删除数据行 */
    handleDeleteData(row, index) {
      this.amrBindingList.splice(index, 1)
      if (this.amrBindingList.length == 0) {
        this.begin = true
      }
    },

    /** 表头点击 */
    clickFunPre(column, event) {
      if (column.label === '+') {
        this.begin = false
        this.amrBindingList.push(JSON.parse(JSON.stringify(this.obj)))
      }
      if (column.label === '-') {
        this.amrBindingList = []
        this.begin = true
      }
    }
  }
}
</script>
<style lang="scss">

</style>
