<template>

  
  <div class="app-container">
    <el-card>
      <el-form :model="queryParams" ref="queryForm" :inline="true">
        <el-row>
          <!-- <el-button style="margin-left: 10px;margin-right: 10px;margin-top: 3px" type="primary" icon="el-icon-search"
                     size="mini" @click="handleQuery"
          ></el-button> -->
          <el-form-item  style="margin-left: 20px" prop="keywords">
            <span style="text-align: center;font-size: 18px;margin-right: 12px">设备:</span>
            <el-select v-model="queryParams.deviceNo" filterable placeholder="请选择"  @change="getDischange" clearable style="width: 200px">
              <el-option
                v-for="item in deviceList"
                :key="item.id"
                :label="item.deviceNo"
                :value="item.deviceNo"
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

    <el-card>
      <el-form :model="queryKuParams" ref="queryKuForm" :inline="true">
        <el-row>
          <el-form-item label="">
            <el-checkbox v-model="reserveEnabled"></el-checkbox>
          </el-form-item>
          <el-form-item label="加工预留量：" prop="keywords">
            <div style="float: right">
            <el-form-item label="R预留">
              <el-input-number
                v-model="reserveR"
                :min="0"
                :step="0.001"
                :precision="3"
                :step-strictly="false"
                :controls="true"
                style="width: 130px"
              />
              <!-- <el-editinput prop="workHour" ref="refColumn2" align="center" label="工时" type="default">
                <template slot-scope="{ row,  $index }">
                  <el-input v-model="row.workHour" type="number" @keyup.native.enter="nextFocus($event,row)"></el-input>
                  <el-input @keyup.enter.native="('workHour_' + $index)" :ref="'workHour_' + $index" v-model="row.workHour" type="number"></el-input>
                </template>
              </el-editinput> -->
            </el-form-item>
            <el-form-item label="Z预留：">
              <el-input-number
                v-model="reserveZ"
                :min="0"
                :step="0.001"
                :precision="3"
                style="width: 130px"
              />
            </el-form-item>
            <el-form-item label="油槽高度：">
              <el-input-number
                v-model="oilTankHeight"
                :min="0"
                :step="1"
                :precision="1"
                style="width: 120px"
              />
            </el-form-item>
          </div>
          </el-form-item>

          <el-form-item label="">
            <el-checkbox v-model="eleEnabled"></el-checkbox>
          </el-form-item>
          <el-form-item label="加工前自动校正电极：" prop="keywords">
          </el-form-item>
          <el-form-item label="">
            <el-checkbox v-model="steelEnabled"></el-checkbox>
          </el-form-item>
          <el-form-item label="加工前自动校正工件：" prop="keywords">
          </el-form-item>
          <el-form-item label="">
            <el-checkbox v-model="configTeeEnabled"></el-checkbox>
          </el-form-item>
          <el-form-item label="精加工前自动确认余量：" prop="keywords">
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="">
          <div class="assist-row">
            <el-checkbox v-model="assistEnabled"></el-checkbox>
            <span class="assist-label">G132辅助选择</span>
            <span class="assist-label">G132D60Q</span>

             <el-select v-model="queryParams.workG" placeholder="请选择" style="width: 90px" clearable>
                 <el-option :key="1" :value="1" ></el-option>
                 <el-option :key="2" :value="2" ></el-option>
                 <el-option :key="3" :value="3" ></el-option>
             </el-select>
             A
             <el-select v-model="queryParams.workA" placeholder="请选择" style="width: 90px" clearable>
               <el-option :key="2" :value="2" ></el-option>
               <el-option :key="3" :value="3" ></el-option>
               <el-option :key="4" :value="4" ></el-option>
               <el-option :key="5" :value="5" ></el-option>
               <el-option :key="6" :value="6" ></el-option>
               <el-option :key="7" :value="7" ></el-option>
               <el-option :key="8" :value="8" ></el-option>
               <el-option :key="9" :value="9" ></el-option>
               <el-option :key="10" :value="10" ></el-option>
             </el-select>
             M
             <el-select v-model="queryParams.workM" placeholder="请选择" style="width: 90px" clearable>
                 <el-option :key="1" :value="1" ></el-option>
                 <el-option :key="2" :value="2" ></el-option>
             </el-select>
             R
             <el-select v-model="queryParams.workR" placeholder="请选择" style="width: 90px" clearable>
                 <el-option :key="10" :value="10" ></el-option>
                 <el-option :key="11" :value="11" ></el-option>
                 <el-option :key="12" :value="12" ></el-option>
                 <el-option :key="13" :value="13" ></el-option>
                 <el-option :key="14" :value="14" ></el-option>
                 <el-option :key="15" :value="15" ></el-option>
                 <el-option :key="16" :value="16" ></el-option>
                 <el-option :key="17" :value="17" ></el-option>
                 <el-option :key="18" :value="18" ></el-option>
             </el-select>
             U
             <el-select v-model="queryParams.workU" placeholder="请选择" style="width: 90px" clearable>
                 <el-option :key="1" :value="1" ></el-option>
                 <el-option :key="2" :value="2" ></el-option>
                 <el-option :key="3" :value="3" ></el-option>
             </el-select>
             W
             <el-select v-model="queryParams.workW" placeholder="请选择" style="width: 90px" clearable>
                 <el-option :key="1" :value="1" ></el-option>
                 <el-option :key="2" :value="2" ></el-option>
                 <el-option :key="3" :value="3" ></el-option>
             </el-select>
          </div>
          </el-form-item>
        </el-row>

        <el-row>
          <el-form-item label="">
          <div class="assist-row">
            <el-checkbox v-model="conditionEnabled"></el-checkbox>
            <span class="assist-label">加工条件选择</span>
            E
             <el-select v-model="queryParams.workE" placeholder="请选择" style="width: 90px" clearable>
                 <el-option :key="1" :value="1" ></el-option>
                 <el-option :key="2" :value="2" ></el-option>
                 <el-option :key="3" :value="3" ></el-option>
             </el-select>
             I
             <el-select v-model="queryParams.workI" placeholder="请选择" style="width: 90px" clearable>
               <el-option :key="2" :value="2" ></el-option>
               <el-option :key="3" :value="3" ></el-option>
               <el-option :key="4" :value="4" ></el-option>
               <el-option :key="5" :value="5" ></el-option>
               <el-option :key="6" :value="6" ></el-option>
               <el-option :key="7" :value="7" ></el-option>
               <el-option :key="8" :value="8" ></el-option>
               <el-option :key="9" :value="9" ></el-option>
               <el-option :key="10" :value="10" ></el-option>
             </el-select>
             J
             <el-select v-model="queryParams.workj" placeholder="请选择" style="width: 90px" clearable>
                 <el-option :key="1" :value="1" ></el-option>
                 <el-option :key="2" :value="2" ></el-option>
             </el-select>
             O
             <el-select v-model="queryParams.worko" placeholder="请选择" style="width: 90px" clearable>
                 <el-option :key="10" :value="10" ></el-option>
                 <el-option :key="11" :value="11" ></el-option>
                 <el-option :key="12" :value="12" ></el-option>
                 <el-option :key="13" :value="13" ></el-option>
                 <el-option :key="14" :value="14" ></el-option>
                 <el-option :key="15" :value="15" ></el-option>
                 <el-option :key="16" :value="16" ></el-option>
                 <el-option :key="17" :value="17" ></el-option>
                 <el-option :key="18" :value="18" ></el-option>
             </el-select>
            
          </div>
          </el-form-item>
        </el-row>

      </el-form>
      
    </el-card>

    <!--任务列表-->
    <el-col :span="24">
      <el-card>
        <el-card v-loading="loading" style="margin-top: 5px" align="center">
          <el-button size="small" type="danger" icon="el-icon-s-check" v-preventReClick="2000" @click="checking"
                     :disabled="multiple"
          >检查数据
          </el-button>
          <el-button size="small" type="primary" icon="el-icon-s-order" v-preventReClick="2000" @click="beginning"
                     :disabled="multiple"
          >开始
          </el-button>
          <el-button size="small" type="primary" icon="el-icon-s-release" v-preventReClick="2000" @click="generateProgram"
                     :disabled="multiple"
          >生成程式
          </el-button>
          <el-button size="small" type="success" icon="el-icon-success" v-preventReClick="2000" @click="ending"
                     :disabled="multiple"
          >完工
          </el-button>
        </el-card>
        <el-table v-loading="loading" ref="editableList" :row-key="(row)=>row.pid" :data="semiAutoList"  max-height="680px" @selection-change="handleSelectionChange"
                  :row-class-name="tableRowClassName" @header-click="clickFunPre" border highlight-current-row
        >
          <el-table-column type="index" label="序号" width="50" align="center"/>
          <!-- 新增拖拽手柄列 -->
          <el-table-column width="50" align="center" label="自由拖拽">
            <template slot-scope="scope" >
              <!-- 此处使用 Element UI 的图标作为拖拽手柄 -->
              <i class="el-icon-rank drag-handle" style="cursor: move;" ></i>
            </template>
          </el-table-column>
          <el-table-column type="selection" align="center" :selectable="selected" fixed/>
          <el-table-column  label="库位ID" prop="toolMagazineNumber" align="center" width="50"/> 
          <el-table-column  label="设备编号" prop="deviceNo" align="center" /> 
          <el-table-column  label="设备品牌" prop="machineType" align="center" /> 
          <el-table-column label="工件/电极RFID" align="center" key="workpieceEleRfid" prop="workpieceEleRfid" width="120px">
            <template slot-scope="scope">
              <el-input v-model="scope.row.workpieceEleRfid" autofocus="true" @change="selectProduction(scope.row)">
                {{ scope.row.workpieceEleRfid }}
              </el-input>
            </template>
          </el-table-column>
          <el-table-column label="R预留" prop="reserveR" align="center"  width="88px">
            <template slot-scope="scope">
              <el-input v-model="scope.row.reserveR"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="Z预留" prop="reserveZ" align="center"  width="88px">
            <template slot-scope="scope">
              <el-input v-model="scope.row.reserveZ"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="油槽高度" prop="oilTankHeight" align="center"  width="88px">
            <template slot-scope="scope">
              <el-input v-model="scope.row.oilTankHeight"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="模号" prop="moduleNo" align="center" />
          <el-table-column label="件号" prop="pieceNo" align="center" />
          <el-table-column label="电极号" prop="suffix" align="center" />
          <el-table-column label="电极间隙" prop="sparkGap" align="center" />
          <el-table-column label="量测结果" prop="currentProcess" align="center" width="50"/>
          <el-table-column label="基准台X" prop="xpitch" align="center" />
          <el-table-column label="基准台Y" prop="ypitch" align="center" />
          <el-table-column label="基准台Z" prop="zpitch" align="center" />
          <el-table-column label="C角度" prop="num" align="center" width="50"/>
          <el-table-column label="XY平均间隙" prop="sparkGap" align="center" />
          <el-table-column label="操作" align="center" width="200px">
           <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="跑位数据" placement="top-start">
              <el-button
                circle
                type="primary"
                icon="el-icon-folder-opened"
                @click="handleWatchCustomer(scope.row)"
              ></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="量测结果" placement="top-start">
              <el-button
                circle
                type="primary"
                icon="el-icon-folder-opened"
                @click="watchCmmResult(scope.row)"
              ></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除数据" placement="top-start">
              <el-button
                type="danger"
                circle
                icon="el-icon-delete"
                @click="handleDeleteData(scope.row,scope.$index)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
        </el-table>
      </el-card>
    </el-col>
    
    <!-- <el-card>
      <div slot="header">
        <span>库位位置名称：<el-tag>{{ onlyList.name }}</el-tag></span>
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
    </el-card> -->


    <!--电火花放电参数对话框-->
    <el-dialog :title="titleProgram" :visible.sync="openProgram" width="1300px" append-to-body>
      <el-row :gutter="20">
         <el-col :span="24">
          <h2>电火花放电参数列表</h2>
          <el-table :data="camElectrodList" border>
            <el-table-column label="X方向平移距离" align="center" prop="xpitch"></el-table-column>
            <el-table-column label="X方向平移次数" align="center" prop="xjump"></el-table-column>
            <el-table-column label="Y方向平移次数" align="center" prop="yjump"></el-table-column>
            <el-table-column label="Y方向平移距离" align="center" prop="ypitch"></el-table-column>
            <el-table-column label="VDI底面纹，第一个程式" align="center" prop="vdiFloor"></el-table-column>
            <el-table-column label="VDI侧面纹，第二个程式" align="center" prop="vdiSide"></el-table-column>
            <el-table-column label="放电间隙（火花位）" align="center" prop="sparkGap"></el-table-column>
            <el-table-column label="实体是否已缩放电间隙" align="center" prop="bodyScaled"></el-table-column>
            <el-table-column label="摇动方式（圆摇、方摇、球摇）" align="center" prop="orbitType"></el-table-column>
            <el-table-column label="电极作用" align="center" prop="elecUse"></el-table-column>
            <el-table-column label="电极上公差" align="center" prop="elecUpTol"></el-table-column>
            <el-table-column label="电极下公差" align="center" prop="elecDownTol"></el-table-column>
            <el-table-column label="加工面积，投影面积" align="center" prop="edmFace"></el-table-column>
            <el-table-column label="放电模型能量面积" align="center" prop="edmArea"></el-table-column>
            <el-table-column label="实体是否已缩放电间隙" align="center" prop="bodyScaled"></el-table-column>
            <el-table-column label="工位精度" align="center" prop="edmAreaPrecision"></el-table-column>
            <el-table-column label="夹具型号" align="center" prop="fixtureNumber"></el-table-column>
            <el-table-column label="固定方式" align="center" prop="elecFixture"></el-table-column>
            <el-table-column label="有效高度" align="center" prop="effectiveHeight"></el-table-column>
          </el-table>
        </el-col>
      </el-row>
      </el-dialog>

     <!-- 查看电极量测结果数据 -->
    <el-dialog :title="measureResult.title" :visible.sync="measureResult.open" width="1600px" append-to-body>
      <el-table :data="measureResultList" v-loading="loading" border max-height="900px">
        <el-table-column label="序号" type="index" align="center"/>
        <el-table-column label="工件生产单号" prop="workpieceProdOrderNo" align="center"/>
        <el-table-column label="电极生产单号" prop="electrodeProdOrderNo" align="center"/>
        <el-table-column label="EDM工序序号" prop="edmNo" align="center"/>
        <el-table-column label="模号" prop="moduleNo" align="center"/>
        <el-table-column label="件号" prop="pieceNo" align="center"/>
        <el-table-column label="版本" prop="versionNo" align="center"/>
        <el-table-column label="电极RFID" prop="rfid" align="center"/>
        <el-table-column label="最大间隙" prop="maxGap" align="center"/>
        <el-table-column label="平均间隙" prop="avgGap" align="center"/>
        <el-table-column label="x偏差" prop="x" align="center"/>
        <el-table-column label="y偏差" prop="y" align="center"/>
        <el-table-column label="c偏差" prop="c" align="center"/>
        <el-table-column label="z偏差" prop="z" align="center"/>
        <el-table-column label="量测结果" prop="testResult" align="center"/>
        <el-table-column label="量测NG需要原因" prop="reason" align="center"/>

        <el-table-column label="同大同小规格" prop="uniformOversize" align="center"/>
        <el-table-column label="同大同小上公差" prop="uoUpTolerance" align="center"/>
        <el-table-column label="同大同小下公差" prop="uoLowTolerance" align="center"/>
        <el-table-column label="XY最大值" prop="xyMaxGap" align="center"/>
        <el-table-column label="XY最小值" prop="xyMinGap" align="center"/>
        <el-table-column label="XY差值" prop="xyDifferential" align="center"/>
        <el-table-column label="XY平均值" prop="xyAvgGap" align="center"/>
        <el-table-column label="XY是否同大同小" prop="xyUO" align="center"/>
        <el-table-column label="Z最大值" prop="zMaxGap" align="center"/>
        <el-table-column label="Z最小值" prop="zMinGap" align="center"/>
        <el-table-column label="Z差值" prop="zDifferential" align="center"/>
        <el-table-column label="Z平均值" prop="zAvgGap" align="center"/>
        <el-table-column label="Z是否同大同小" prop="zUO" align="center"/>

        <el-table-column label="c偏差角度" prop="angle" align="center"/>
        <el-table-column label="创建时间" prop="createTime" align="center"/>
        <el-table-column label="修改时间" prop="updateTime" align="center"/>
      </el-table>
    </el-dialog>


  </div>
</template>

<script>
import { getUserProfile } from '../../../api/system/user'
import Sortable from 'sortablejs';
import request from '@/utils/request'
import { getCamElectrodeBom,getCamSparkList } from '@/api/jy/electrodeMange'
import { getCmmSparkPointList  } from '@/api/production/edmAutomation'
import {
  getBaseElectrodeByRfid,
  getBaseEquipmentRfidPage,
  getBaseEqUseByEqRfid
} from '@/api/production/semiAutomation'
import { getEdmAutoList } from "../../../api/production/eleprocess/poleprocess";

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
      //选中状态
      reserveEnabled: true,
      steelEnabled: true,
      eleEnabled: true,
      assistEnabled: true,
      conditionEnabled: true,
      configTeeEnabled: true,

      // 总条数
      total: 0,
      reserveR: 0.005,
      reserveZ: 0.005,
      oilTankHeight: 200,
      totalHisPage: 0,
      index: '',
      //多选后的自动化列表
      selectionList: [],
      camSparkList: [],
      camElectrodList: [],
      measureResultList: [],
      //接受弹框数据
      form: {},
      deviceQueryParams: {  pageNo: 1, pageSize: 1000, },
      openProgram: false,
      titleProgram: "",
      //设备列表
      deviceList: [],
      semiAutoList: [],
      middleList: [],
      queryParamsCam: {
          pageNo: 1,
          pageSize: 10,
      },
      queryParamsCamSpark: {
          pageNo: 1,
          pageSize: 10,
      },
      queryParamsMeasureResult: { },
      measureResult: {
          // 是否显示弹出层
          open: false,
          // 弹出层标题
          title: "电极量测结果",
        },
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

      //接收按钮禁止状态
      acceptDisabled: false,
      // 查询参数
      queryParams: {
        pageNo: 1,
        pageSize: 10
      },
      queryKuParams: {
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
computed: {
    // 计算属性，返回一个包含所有设备编号的数组
    deviceNos() {
      return this.deviceList.map(item => item.deviceNo);
    }
  },
  watch: {
    // 监听设备列表变化，更新查询参数
    /* deviceList(newVal) {
      if (newVal.length > 0) {
        this.queryParamsDevice = { ...this.queryParamsDevice, deviceNos: this.deviceNos };
      }
    }, */
    reserveR(newVal) {
      this.semiAutoList.forEach(item => {
        item.reserveR = newVal;
        if(item.id!=null&&item.id!==undefined){
          item.reserveR = newVal;
        }
      });
    },
    reserveZ(newVal) {
      this.semiAutoList.forEach(item => {
        if(item.id!=null&&item.id!==undefined){
          item.reserveZ = newVal;
        }
      });
    },
    oilTankHeight(newVal) {
      this.semiAutoList.forEach(item => {
        if(item.id!=null&&item.id!==undefined){
          item.oilTankHeight = newVal;
        }
      });
    } 
},
  created() {
    this.getListUser()
    this.getEquipment();
  },

  mounted() {
    // 等待组件渲染完成后初始化拖拽功能
      this.$nextTick(() => {
         // 根据实际 DOM 结构查找 tbody 元素（请根据实际情况调整选择器）
          const tableBody = this.$refs.editableList.$el.querySelector('tbody');
          if (tableBody) {
            Sortable.create(tableBody, {
              // 只有拖拽手柄生效
              handle: '.drag-handle',
              animation: 150,
              onEnd: evt => {
                // 拖拽结束后，更新 semiAutoList 的顺序
           // evt.oldIndex 和 evt.newIndex 为拖拽前后在 DOM 中的索引
             if (evt.oldIndex !== evt.newIndex) {
                if (evt.oldIndex < 0 || evt.oldIndex >= this.semiAutoList.length || evt.newIndex < 0 || evt.newIndex >= this.semiAutoList.length) {
                   throw new Error('Index out of bounds');
                }
                // 克隆数组（可选，根据业务是否需要避免原数组直接修改）
                const newList = [...this.semiAutoList];
                // 从旧位置移除被拖拽的元素，返回数组中被删除的项数组（取第一个，即被拖拽的那一项）
                const movedItem = newList.splice(evt.oldIndex, 1)[0];
                // 将被拖拽的元素插入到新位置，splice 的第二个参数为0表示不删除其他项
                newList.splice(evt.newIndex, 0, movedItem);
                
                /* newList.forEach((row, index) => {
                   this.$set(row, 'index', index); // 使用 Vue.set 确保响应式
                }); */
                // 更新整个数组的 sort 字段，确保每个元素的排序号都正确
                 newList.forEach((item, index) => {
                  // 如果需要从1开始，可以使用 index+1；如果从0开始，则直接使用 index
                   item.sort = index + 1;
                });
                // 将新顺序赋值回 semiAutoList
                this.semiAutoList = newList;
                // 强制刷新表格
                this.$nextTick(() => {
                  this.$refs.editableList.doLayout();
                });
              }
              }
            });
          }
      });

    this.semiAutoList = [];
    this.loading = true;
    for(var i =0;i<10;i++){
        var obj = {};
        obj.toolMagazineNumber = 'A' + (i + 1);
        obj.reserveR = this.reserveR;
        obj.reserveZ = this.reserveZ;
        obj.oilTankHeight = this.oilTankHeight;
        obj.pid = i + 1;
        this.semiAutoList[i] = obj;
    }
    this.loading = false 
  },
  methods: {
    handleSpark(){},
    handleCmm(){},
    /** 分页查询设备信息列表 */
    getEquipment(){
      const id = 'thisid';
      /** 查询DEVICE LIST*/
      this.loading = true
      return request({
       url: '/equipment/section/getEquipmentSectionList/' + id,
        method: 'get'
      }).then(response => {
          this.deviceList = response.data
          this.loading = false
        }
      )
    },
    
    getIncreaseList(deviceList) {
      
      if(deviceList === null) {
        deviceList.length  = 10;
      }
      this.semiAutoList = [];
      this.loading = true;
      for(var i =0;i<deviceList.length;i++){
        var obj = {};
        obj.toolMagazineNumber = 'A' + (i + 1);
        obj.reserveR = this.reserveR;
        obj.reserveZ = this.reserveZ;
        obj.oilTankHeight = this.oilTankHeight;
        obj.deviceNo = deviceList[i].deviceNo;
        obj.machineType = deviceList[i].machineType;
        obj.pid = i + 1;
        this.semiAutoList[i] = obj;
      }
      this.loading = false  
    },
    
    /** 多选框禁选 */
    selected(row,index){
      if (row.id !== null && row.id !== undefined&& row.id !== '') {
        return true; //可勾选
      } else {
        return false //不可勾选
      }
    },

    beginning(){},
    generateProgram(){},
    ending(){},
    checking(){},
  
    /** 搜索添加按钮操作 */
    handleQueryAdd() { },

    handleWatchCustomer(row) {
      if(row.electrodeProdOrderNo === '' ||row.electrodeProdOrderNo == null){
         this.$modal.msgError('请扫描RFID')
         return;
      }
      
        this.openProgram = true;
        this.titleProgram = "电极程式参数";
        this.getListCamElectrod(row);
        this.getListCamSpark(row);
      },
     getListCamElectrod(row) {
      
       this.camSparkList = [];
       this.camElectrodList = [];
       this.queryParamsCam.electrodeProdOrderNo = row.electrodeProdOrderNo
      
        getCamElectrodeBom({"electrodeProdOrderNo":row.electrodeProdOrderNo}).then(resp=>{
            this.camElectrodList = resp.data
        })
       
      },
    getListCamSpark(row) {
        this.queryParamsCamSpark.prodOrderNo = row.electrodeProdOrderNo
        
        getCamSparkList({"prodOrderNo":row.electrodeProdOrderNo}).then(resp=>{
            this.camSparkList = resp.data
        })
      },

    watchCmmResult(row){
      
      if(row.electrodeProdOrderNo === '' ||row.electrodeProdOrderNo == null){
         this.$modal.msgError('请扫描RFID')
         return;
      }
      this.queryParamsMeasureResult.workpieceProdOrderNo = row.workpieceProdOrderNo
      this.queryParamsMeasureResult.electrodeProdOrderNo = row.electrodeProdOrderNo
      this.queryParamsMeasureResult.electrodeNo = row.electrodeNo
      this.queryParamsMeasureResult.RFID = row.workpieceEleRfid
      this.queryParamsMeasureResult.sort = row.sort
      this.measureResult.open = true
      this.measureResult.title = "查看量测数据"
      this.getListMeasureResult()
    },
    getListMeasureResult() {
        getCmmSparkPointList(this.queryParamsMeasureResult).then(res => {
          
          this.measureResultList = res;
        })
        
    },
    
     /** 设备选中事件 */
    getDischange(value) {
      // value 是选中的 deviceNo
      const selectedItem = this.deviceList.find(item => item.deviceNo === value);
      if (selectedItem) {
        // 获取 key、id、deviceNo
        const key = selectedItem.id;
        const id = selectedItem.id;
        const deviceNo = selectedItem.deviceNo;
        // 你可以在这里使用 key、id、deviceNo
        console.log('选中设备:', { key, id, deviceNo });
        // 例如赋值到 data
        this.selectedDevice = { key, id, deviceNo };
        this.getIncreaseList(selectedItem.knifeLibraryList)
      }
        
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
        /* for (let i = 0; i < this.semiAutoList.length; i++) {
          if (this.semiAutoList[i].rfid === this.semiAutoList[row.index].workpieceEleRfid) {
            this.semiAutoList[row.index].electrodePositionNumber = this.semiAutoList[i].electrodePositionNumber
          }
        } */
      }
      //  这里发送时要加个状态，如果重复了状态为否，不能发送
    },

    /** 分页EDM自动化电极信息 */
    getProductionList(c) {
      const workpieceEleRfid = c;
      this.$modal.loading("正在查询数据，请稍候！");
      getBaseElectrodeByRfid({ 'keyWords': workpieceEleRfid }).then(response => {
        this.$modal.closeLoading();
        this.middleList = response.data
        this.semiAutoList.splice(this.index, 1, Object.assign(this.semiAutoList[this.index], this.middleList))
      })
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
    handleQuery() { },

    //双击选中一行
    lineClick(val) {
      for (let i = 0; i < this.semiAutoList.length; i++) {
        if (this.semiAutoList[i].workpieceEleRfid === val.rfid) {
          this.$modal.msgError('请勿重复添加相同数据，请检查后重新添加')
          break
        } else {
          if (this.semiAutoList[i].workpieceEleRfid == undefined) {
            getBaseElectrodeByRfid({ 'keyWords': val.rfid }).then(response => {
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
 .assist-row {
  display: flex;
  align-items: center;
  gap: 12px;
}
.assist-label, .assist-row .el-select {
  font-size: 14px;
  color: #333;
  line-height: 40px;
  text-align: right;
  padding: 0 12px 0 0;
  
}
.assist-row .el-select {
  width: 80px;
}

.assist-label {
  font-size: 14px;
  color: #606266;
  font-weight: 700;
  line-height: 40px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}
.highlight {
  border: 2px solid red; /* 自定义高亮样式 */
}
.drag-handle {
  cursor: move; /* 设置鼠标样式为移动 */
  display: inline-block; /* 设置为行内块元素 */
  width: 20px; /* 设置宽度 */
  height: 20px; /* 设置高度 */
  background-color: #409EFF; /* 设置背景颜色 */
  color: #fff; /* 设置文字颜色 */
  text-align: center; /* 设置文字居中 */
  line-height: 20px; /* 设置行高 */
  border-radius: 50%; /* 设置圆角 */
  margin-right: 10px; /* 设置右边距 */
}
/* 可根据需要自定义拖拽手柄样式 */

</style>
