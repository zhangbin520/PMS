<template>
  <div class="app-container">
    <el-card>
      <el-form :model="queryParams" ref="queryForm" :inline="true">
        <el-row>
          <el-form-item label="生产单号" prop="keywords">
            <el-input
              v-model="queryParams.prodOrderNo"
              placeholder="输入生产单号"
              clearable
              size="small"
              style="width: 200px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="RFID" prop="keywords">
            <el-input
              v-model="queryParams.rfid"
              placeholder="输入RFID"
              clearable
              size="small"
              style="width: 200px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="首末工序：" prop="keywords">
            <el-select v-model="queryParams.processSequence" filterable placeholder="请选择" clearable style="width: 150px" @change="handleQuery">
              <el-option
                v-for="item in processFortask"
                :key="item.id"
                :label="item.name"
                :value="item.status">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="设备：" prop="keywords">
            <el-select v-model="queryParams.equipmentSectionId" filterable placeholder="请选择" clearable style="width: 150px" @change="handleQuery">
              <el-option
                v-for="item in equipmentFortask"
                :key="item.id"
                :label="item.deviceNo"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="工段：" prop="keywords">
            <el-input
              v-model="queryParams.codeList"
              placeholder="请输入工段名"
              clearable
              size="small"
              style="width: 220px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
        </el-row>
        <el-row>
            <div style="float: left">
                <el-form-item label="报工权限：" >  <!-- allPermissionList -->
                  <el-checkbox-group v-model="allPermissionList">
                    <el-checkbox disabled v-for="item in permissionOptionsList"   :label="item.status">{{ item.name }}</el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
                
                </div>
                <div style="float: right">
                <el-form-item label="姓名：">
                  <el-tag>{{userName}}</el-tag>
                </el-form-item>
                <el-form-item label="工号：">
                  <el-tag>{{personNo}}</el-tag>
                </el-form-item>
                <el-form-item label="部门：">
                  <el-tag>{{deptName}}</el-tag>
                </el-form-item>
                </div>
         
        </el-row>
        <el-row>
          <el-form-item label="加工任务状态：" prop="taskStatusList">
            <el-checkbox-group v-model="queryParams.taskStatusList">
              <el-checkbox v-for="item in taskStatusOptions" :key="item.id" :label="item.status">{{ item.name }}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="" prop="taskStatusList">
            <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选/全不选</el-checkbox>
          </el-form-item>
          <el-form-item label="时间范围" prop="dispatchOrderNo" style="margin-left: 20px">
            <el-date-picker
              v-model="queryParams.beginTime"
              type="datetime"
              placeholder="选择工序开始时间"
              value-format="yyyy-MM-dd">
            </el-date-picker>
            <el-date-picker
              v-model="queryParams.endTime"
              type="datetime"
              placeholder="选择工序结束时间"
              style="margin-left: 10px"
              value-format="yyyy-MM-dd">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="任务类别" prop="datasource">
            <el-radio v-model="queryParams.datasource" label="1">电极</el-radio>
            <el-radio v-model="queryParams.datasource" label="0">钢件</el-radio>
          </el-form-item>
          <el-form-item>
            <el-button style="margin-left: 10px" type="primary" icon="el-icon-search" size="mini" @click="handleQuery"></el-button>
            <el-button type="warning" plain icon="el-icon-download" size="mini" style="margin-bottom: 10px" @click="handleExport">导出</el-button>
          </el-form-item>
        </el-row>
      </el-form>
    </el-card>
    <el-card>
      <el-button
        size="mini"
        type="primary"
        round
        icon="el-icon-s-promotion"
        disabled
      >待接收工件任务列表</el-button>
      <el-button
        size="mini"
        type="info"
        round
        icon="el-icon-s-promotion"
        @click="handleWaitEquprocess"
      >设备待加工任务列表</el-button>
      <el-button
        size="mini"
        type="success"
        round
        icon="el-icon-s-promotion"
        @click="handleAlreadyAccept"
      >已领取的加工任务</el-button>
      <el-button
        size="mini"
        type="danger"
        round
        icon="el-icon-s-promotion"
        @click="handleAlreadyFinish"
      >我完成的加工任务</el-button>
    </el-card>
    <!--任务列表-->
    <el-card>
      <el-table v-loading="loading" :data="taskStationList" max-height="680px" @selection-change="handleSelectionChange"
                :row-class-name="tableRowClassName" border highlight-current-row>
        <el-table-column type="index" align="center" />
        <el-table-column type="selection" align="center" :selectable="selected"/>
        <el-table-column label="操作" width="200" align="center" class-name="small-padding fixed-width">
          <template slot-scope="scope"  v-if="scope.row.frozen === '0'">
            <el-tooltip class="item" effect="dark" content="强制报工" placement="top-start">
              <el-button
                type="warning"
                circle
                icon="el-icon-check"
                @click="handleForce(scope.row)"
                :disabled="scope.row.isForce === '0'"
                v-if="scope.row.taskStatus !== 5"
              ></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="接收" placement="top-start">
              <el-button
                type="success"
                circle
                icon="el-icon-s-promotion"
                @click="handleAccept(scope.row)"
                :disabled="scope.row.orderStatus === '1'"
                v-if="scope.row.quantity !== scope.row.receivedQuantity"
              ></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="改变状态" placement="top-start"
                        v-if="scope.row.flag === 'Y' && personNo === 'H719888' && scope.row.orderStatus === '0'">
              <el-button
                type="danger"
                circle
                icon="el-icon-setting"
                @click="handleChangeStatus(scope.row)"
              ></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="操作历史" placement="top-start">
              <el-button
                type="primary"
                circle
                icon="el-icon-edit"
                @click="handleAcceptDetail(scope.row)"
              ></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="查看图档" placement="top-start">
              <el-button
                circle
                type="primary"
                icon="el-icon-folder-opened"
                @click="handleViewFile(scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="任务类型" align="center" prop="datasource">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.datasource == 0" type="success">钢件</el-tag>
            <el-tag v-if="scope.row.datasource == 1" type="danger">电极</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="设备" align="center" prop="equipmentSectionCode"/>
        <el-table-column label="生产单号" align="center" prop="prodOrderNo" width="150" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <div v-if="scope.row.datasource === '1'">
              <span>{{scope.row.prodOrderNo}}-{{scope.row.electrodeNo}}</span><br>
              <span>{{scope.row.prodOrderNoForElectrode}}</span>
            </div>
            <div v-if="scope.row.datasource === '0'">
              <span>{{scope.row.prodOrderNo}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="编码" align="center" prop="turnoverBasketNo"/>
        <el-table-column label="任务状态" align="center" prop="taskStatus">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.taskStatus == 0" type="info">待领取</el-tag>
            <el-tag v-if="scope.row.taskStatus == 1">已领取</el-tag>
            <el-tag v-if="scope.row.taskStatus == 2">加工中</el-tag>
            <el-tag v-if="scope.row.taskStatus == 3" type="danger">已暂停</el-tag>
            <el-tag v-if="scope.row.taskStatus == 4" type="danger">任务异常</el-tag>
            <el-tag v-if="scope.row.taskStatus == 5" type="success">已完成</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="当前操作员" align="center" prop="operator"/>
        <el-table-column label="操作时间" align="center" prop="operatorTime" :show-overflow-tooltip="true"/>
        <el-table-column label="订单数量" align="center" prop="quantity"/>
        <el-table-column label="已收数量" align="center" prop="receivedQuantity"/>
        <el-table-column label="产出数量" align="center" prop="outputQuantity"/>
        <el-table-column label="异常数量" align="center" prop="exceptionsQuantity"/>
        <el-table-column label="上道工序" align="center" prop="previousProcess"/>
        <el-table-column label="工序名" align="center" prop="code"/>
        <el-table-column label="计划工时" align="center" prop="workHour" v-if="false"/>
        <el-table-column label="实际工时" align="center" prop="actualWorkHours"/>
        <el-table-column label="实际完工时" align="center" prop="actualCompletionTime" :show-overflow-tooltip="true"/>
        <el-table-column label="计划完工时" align="center" prop="plannedCompletionTime" :show-overflow-tooltip="true"/>
        <!--        <el-table-column label="延期" align="center" prop="receivedQuantity"/>-->
        <el-table-column label="模号" align="center" prop="moduleNo" :show-overflow-tooltip="true"/>
        <el-table-column label="件号" align="center" prop="pieceNo"/>
        <el-table-column label="版本" align="center" prop="versionNo"/>
        <el-table-column label="品名" align="center" prop="pinName" :show-overflow-tooltip="true"/>
        <el-table-column label="工艺制程" align="center" prop="process" :show-overflow-tooltip="true"/>
        <el-table-column label="首末工序" align="center" prop="processSequence">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.processSequence == 0" type="success">首工序</el-tag>
            <el-tag v-if="scope.row.processSequence == 1">末工序</el-tag>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="queryParams.pageNo"
        :limit.sync="queryParams.pageSize"
        :page-sizes="[10, 20, 30, 300, 500]"
        @pagination="getListTask"
      />
      <el-button size="small" type="primary" icon="el-icon-edit" style="margin-left: 45%" @click="changeEquipment" :disabled="single">更换设备</el-button>
    </el-card>

    <!--接受对话框-->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="本次接收数量" prop="previousShipmentQuantity">
          <el-input v-model="form.previousShipmentQuantity" placeholder="上道工序出货的数量" disabled/>
        </el-form-item>
        <el-form-item label="接收数量" prop="receivedQuantity">
          <el-input v-model="form.receivedQuantity" type="number" placeholder="" @change="selectDisable"/>
        </el-form-item>
        <el-form-item label="上工段出货所用周转筐编号" prop="TurnoverBasketNoList">
          <el-input v-model="form.TurnoverBasketNoList" type="textarea" disabled placeholder="" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm" :disabled="acceptDisabled">确 定</el-button>
        <el-button @click="open = false">取 消</el-button>
      </div>
    </el-dialog>
    <!--操作历史对话框-->
    <el-dialog :title="title" :visible.sync="openDetail" width="700px" append-to-body>
      <el-table v-loading="loading" :data="detailList" border>
        <el-table-column label="任务状态" prop="operationStatus">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.operationStatus === 0">接收</el-tag>
            <el-tag v-if="scope.row.operationStatus === 1">领取</el-tag>
            <el-tag v-if="scope.row.operationStatus === 2">开工</el-tag>
            <el-tag v-if="scope.row.operationStatus === 3" type="success">恢复</el-tag>
            <el-tag v-if="scope.row.operationStatus === 4" type="info">暂停</el-tag>
            <el-tag v-if="scope.row.operationStatus === 5" type="danger">异常</el-tag>
            <el-tag v-if="scope.row.operationStatus === 6" type="success">完成</el-tag>
            <el-tag v-if="scope.row.operationStatus === 7" type="danger">退回</el-tag>
            <el-tag v-if="scope.row.operationStatus === 8" type="warning">部分出货</el-tag>
            <el-tag v-if="scope.row.operationStatus === 9" type="warning">更换设备</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作人" prop="createBy"/>
        <el-table-column label="操作时间" prop="createTime"/>
        <el-table-column label="备注" prop="remark"/>
      </el-table>
      <pagination
        v-show="totalHisPage>0"
        :total="totalHisPage"
        :page.sync="queryParams.pageNo"
        :limit.sync="queryParams.pageSize"
        @pagination="getProdWorkOperationHisPage"
      />
      <div slot="footer" class="dialog-footer">
        <el-button @click="openDetail = false" type="danger" style="margin-right: 40%">关 闭</el-button>
      </div>
    </el-dialog>
    <!--更换设备对话框-->
    <el-dialog :title="titleEquipment" :visible.sync="openEquipment" width="500px" append-to-body>
      <el-form ref="formEquipment" :model="formEquipment" :rules="rules" label-width="120px">
        <el-form-item label="选择设备" prop="previousShipmentQuantity">
          <el-select v-model="formEquipment.equipmentSectionId" placeholder="请选择设备" style="width: 100%">
            <el-option
              v-for="item in equipmentSelection"
              :key="item.id"
              :label="item.deviceNo"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFormEquipment">确 定</el-button>
        <el-button @click="openEquipment = false">取 消</el-button>
      </div>
    </el-dialog>

    <!--强制报工周转筐对话框-->
    <el-dialog v-loading="loading" :title="titleShipment" :visible.sync="openShipment" width="800px" append-to-body>
      <el-table :data="ShipmentData" border @header-click="" :row-class-name="tableRowClassName2">
        <el-table-column label="RFID卡号" align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.rfid" placeholder="请输入内容" @change="searchTurnoverBasket(scope.row)"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="周转筐编号" align="center" prop="code"/>
        <el-table-column label="生产单号" align="center" prop="prodOrderNo"/>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" icon="el-icon-check" @click="saveShipment" :disabled="disabledShip">保 存</el-button>
        <el-button @click="cancelButton" type="danger">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listTaskStation,
  receiveTaskStation,
  returnWorkpiece,
  getProdWorkOperationHisPage,
  getPreviousShipmentQuantity,
  waitEquipment,
  batchReplaceEquipment,
  tubeSetSectionStatus,
  forceOneButtonWorkReporting, rfidTurnoverBasket
} from '../../../api/production/taskStation'
import {listEquipment} from "../../../api/system/equipment";
import {getUserProfile} from "../../../api/system/user";
import {listBasketRfid} from "../../../api/system/rfid";
import {listProcess} from "../../../api/system/process";
import { ElMapExportTable } from "table-excel";
import { steelPartsFinish } from '@/api/production/steelAutomation'

export default {
  name: "TaskStation",
  filters: {
    keepTwoNum(value) {
      value = Number(value);
      return value.toFixed(0)
    }
  },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 总条数
      total: 0,
      totalHisPage:0,
      // 加工任务表格数据
      taskStationList: [],
      //接受弹框数据
      form:{},
      //更换设备表单数据
      formEquipment:{},
      //接收详情弹框数据
      detailList:[],
      //设备搜索数据
      equipmentFortask:[],
      //所有权限
      allPermissionList:[],
      permissionOptionsList:[],
      //工段搜索数据
      //任务ID
      Id:[],
      //用户信息
      userName:'',
      personNo:'',
      deptName:'',
      // 弹出层标题
      title: "",
      titleEquipment:'',
      // 是否显示弹出层
      open: false,
      openDetail:false,
      openEquipment:false,
      //选中数组
      ids:[],
      previousProcessId:'',
      receivedQuantity:'',
      quantity:'',
      id:'',
      //待选设备列表
      equipmentSelection:{},
      //待选设备选中数据
      stationId:'',
      taskId:'',
      //接收按钮禁止状态
      acceptDisabled: false,
      // 查询参数
      queryParams: {
        pageNo: 1,
        pageSize: 10,
        taskStatusList:[0,1,2],
      },
      // 更换设备查询参数
      deviceQueryParams: {
        pageNo: 1,
        pageSize: 500,
      },
      // 工段查询参数
      queryParamsProcess: {
        pageNo: 1,
        pageSize: 500,
      },
      taskStatusOptions: [{
        status: 0,
        name: "待接收"
      },{
        status: 1,
        name: "已领取"
      },{
        status: 2,
        name: "加工中"
      },{
        status: 3,
        name: "已暂停"
      },{
        status: 4,
        name: "任务异常"
      },{
        status: 5,
        name: "已完成"
      },],
      //首末工序查询
      processFortask:[{
        status: '0',
        name: "首工序"
      },{
        status: '1',
        name: "末工序"
      }],
      //多选框全选
      checkAll: false,
      isIndeterminate: true,
      //接收表单校验
      rules: {
        receivedQuantity: [
          { required: true, message: "接收数量不能为空", trigger: "blur" },
        ],
      },
      //完工周转筐弹窗
      titleShipment:'',
      openShipment:false,
      ShipmentData:[],
      disabledShip:false,
      forceId:'',
      shipmentStatus: true,
      //查询参数
      queryParamsRfid: {
        pageNo: 1,
        pageSize: 10,
      },
    }
  },
  created() {
    this.getListTask();
    this.getListEquipment();
    this.getListUser();
  },
  methods: {
    /** 查询报工终端任务列表 */
    getListTask() {
      this.loading = true;
      listTaskStation(this.queryParams).then(response => {
        this.taskStationList = response.data.records;
        for (let i = 0;i < this.taskStationList.length;i++){
          this.taskStationList[i].process = this.taskStationList[i].process.replace(/-/g, "-").replace(/\([^\)]*\)/g, "")
        }
        this.total = Number(response.data.total);
        this.loading = false;
      })
    },
    /** 查询设备列表 */
    getListEquipment() {
      listEquipment(this.queryParamsProcess).then(response => {
        this.equipmentFortask = response.data.records
      });
    },
    /** 查询登录用户信息*/
    getListUser() {
      getUserProfile().then(response => {
        console.log('response:'+response)
        this.permissionOptionsList = response.list;
        if(this.permissionOptionsList!=null&&this.permissionOptionsList.length>0){
          for(var i=0;i<this.permissionOptionsList.length;i++){
            this.allPermissionList.push(this.permissionOptionsList[i].status);
          }
        }
        this.userName = response.data.nickName
        this.personNo = response.data.userName
        this.deptName = response.data.dept.name
      });
    },
    /** 分页查询上道工序出货数量 */
    getPreviousShipmentQuantity() {
      this.queryParams.previousProcessId = this.previousProcessId
      getPreviousShipmentQuantity(this.queryParams).then(res => {
        if(this.form.processSequence == '0'){
          this.form.previousShipmentQuantity = '0'
        }else {
          this.form.previousShipmentQuantity = Number(res.data.PreviousShipmentQuantity - this.receivedQuantity)
          this.form.TurnoverBasketNoList = res.data.TurnoverBasketNoList
        }
      })
    },
    /** 分页操作历史记录 */
    getProdWorkOperationHisPage() {
      this.queryParams.taskId = this.id
      getProdWorkOperationHisPage(this.queryParams).then(response => {
        this.detailList = response.data.records;
        this.totalHisPage = Number(response.data.total);
      })
    },
    /** 待选设备列表 */
    getWaitEquipment() {
      this.deviceQueryParams.stationId = this.stationId
      waitEquipment(this.deviceQueryParams).then(response => {
        this.equipmentSelection = response.data;
      })
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNo= 1;
      this.getListTask();
    },
    // 接收表单重置
    reset() {
      this.form = {
        receivedQuantity: undefined,
        previousShipmentQuantity:undefined,
      };
      this.resetForm("form");
    },
    /** 多选框全选 */
    handleCheckAllChange(val) {
      if (this.checkAll){
        this.queryParams.taskStatusList = [0,1,2,3,4,5];
        this.isIndeterminate = false;
      }else {
        this.queryParams.taskStatusList = []
      }
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.stationId = selection.map(item => item.stationId).join('')
      this.taskId = selection.map(item => item.id).join('')
      this.single = selection.length!=1
      this.multiple = !selection.length
    },
    /**接收按钮*/
    handleAccept(row) {
      this.reset()
      this.Id = row.id
      this.open = true;
      this.title = "接收工件";
      this.previousProcessId = row.previousProcessId
      this.form.processSequence = row.processSequence
      this.form.code = row.code
      this.receivedQuantity = row.receivedQuantity
      this.quantity = row.quantity
      this.getPreviousShipmentQuantity()
    },
    /** 控制接收按钮是否禁用 */
    selectDisable() {
      this.acceptDisabled = false
      if((this.form.previousShipmentQuantity == '0' && this.form.processSequence !== '0') || (this.form.receivedQuantity > this.form.previousShipmentQuantity && this.form.processSequence !== '0')){
        this.acceptDisabled = true
      }else{
        this.acceptDisabled = false
      }
    },
    /** 接收提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        this.form.taskId = this.Id
        receiveTaskStation(this.form).then(response =>{
          if(response!=undefined){
              this.$modal.msgSuccess("接收成功");

            }
            this.getListTask();
            this.open = false;
        })
      });
    },
    /**操作历史按钮*/
    handleAcceptDetail(row) {
      this.openDetail = true;
      this.title = "工件接收详情"
      this.id = row.id
      this.getProdWorkOperationHisPage()
    },
    /** 行高亮 */
    tableRowClassName({row, rowIndex}) {
      // alert(row.receivedQuantity < row.quantity)
      if (row.receivedQuantity !== 0 && row.receivedQuantity < row.quantity) {
        return 'warning-row';
      } else if (row.receivedQuantity === row.quantity) {
        return 'success-row';
      }
      return '';
    },
    /** 设备待加工任务列表 */
    handleWaitEquprocess() {
      this.$router.push({
        path:'/production/taskStationWorker-edit/equProcess',
      });
    },
    /** 已领取的加工任务 */
    handleAlreadyAccept() {
      this.$router.push({
        path:'/production/taskStationWorker-edit/myTask',
      });
    },
    /** 我完成的加工任务 */
    handleAlreadyFinish() {
      this.$router.push({
        path:'/production/taskStationWorker-edit/finishTask',
      });
    },
    /** 未接收数量为空显示0 */
    quantityFormat(row) {
      return row.quantityNotReceived == null?"0":row.quantityNotReceived;
    },
    /** 更换设备 */
    changeEquipment() {
      this.titleEquipment = "选择需要更换的设备"
      this.openEquipment = true
      this.getWaitEquipment()
    },
    /** 待选设备提交按钮 */
    submitFormEquipment: function() {
      this.$refs["formEquipment"].validate(valid => {
        this.formEquipment.taskId = this.taskId
        batchReplaceEquipment(this.formEquipment).then(response =>{
          this.$modal.msgSuccess("更换设备成功");
          this.getListTask();
          this.openEquipment = false;
        })
      });
    },
    /** 多选框禁选 */
    selected(row,index){
      if (row.taskStatus == '5') {
        return false //不可勾选
      } else {
        return true; //可勾选
      }
    },
    /** 生管改变任务状态 */
    handleChangeStatus(row) {
      const taskId = row.id
      this.$modal.confirm('确认要改变任务状态嘛？').then(function () {
        return tubeSetSectionStatus({'taskId':taskId,'code':row.code});
      }).then(() => {
        this.$modal.msgSuccess("改变任务状态成功");
        this.getListTask();
      })
    },
    /** 查看图档 */
    handleViewFile(row) {
      console.log(row.turnoverBasketNo)
      this.$router.push({
        path: '/eleContact/eleContactForm',
        query: {
          rfid:row.turnoverBasketNo,
          prodOrderNo: row.prodOrderNo,
          electrodeNo: row.electrodeNo,
        },
      });
    },

    /** 强制报工按钮*/
      handleForce(row){
        console.log(row)
        if(row.datasource == '1'){
          forceOneButtonWorkReporting({'taskId':row.id,'turnoverBasketNoList':[],'code':row.code}).then(res=>{
            if(response!=undefined){
              this.$modal.msgSuccess("强制报工成功");

            }
            this.getListTask();
          })
        }else if(row.datasource == '0'){
          this.openShipment = true
          this.forceId = row.id
          this.ShipmentData = []
          this.ShipmentData.push({
            'prodOrderNo': row.prodOrderNo
          })
        }
      },

    /** 根据RFID标签搜索周转框编码 */
    searchTurnoverBasket(row) {
      // this.rfid = row.rfid
      const index = row.index
      this.queryParamsRfid.rfidCode = row.rfid
      rfidTurnoverBasket(this.queryParamsRfid).then(res => {
        const arr = {
          rfid:res.data.rfid,
          code:res.data.code,
          status:res.data.status,
          prodOrderNo:row.prodOrderNo
        }
        // this.ShipmentData.splice(index,1,this.conFirmprodOrderNo)
        this.ShipmentData.splice(index,1,arr)
        const a = []
        this.ShipmentData.forEach(function (item) {
          a.push(item.code)
        })
        this.turnoverBasketNoList = a
        if(this.ShipmentData.filter(d => d.code !== undefined).length !== this.ShipmentData.length){
          this.disabledShip = true
        }else {
          this.disabledShip = false
        }
        // console.log(this.disabledShip)
        // console.log(this.ShipmentData.filter(d => d.code !== undefined).length)
        // console.log(this.ShipmentData)
      })
      // console.log(this.turnoverBasketNoList)
      // if(this.ShipmentData.filter(d => d.code !== undefined).length !== this.ShipmentData.length){
      //   this.disabledShip = true
      // }else {
      //   this.disabledShip = false
      // }
      // console.log(this.disabledShip)
      // console.log(this.ShipmentData.filter(d => d.code !== undefined).length)
      // console.log(this.ShipmentData)
    },

    /** 周转筐保存按钮 */
    saveShipment() {
      // console.log(this.ShipmentData.filter(d => d.code !== undefined).length)
      console.log(this.ShipmentData)
      if(this.ShipmentData.filter(d => d.code !== undefined).length !== this.ShipmentData.length){
        this.$modal.msgError("还绑定周转筐编码")
      }else {
        for(let i = 0;i < this.ShipmentData.length;i++){
          if(this.ShipmentData[i].code == '' || this.ShipmentData[i].prodOrderNo == ''){
            this.shipmentStatus = false
            break
          }
        }
        if(this.shipmentStatus){
          this.loading = true
          setTimeout(()=>{
            this.loading=false   //点击一次时隔五秒后才能再次点击
          },3000)
          this.disabledShip = false
          forceOneButtonWorkReporting({'taskId':this.forceId,'turnoverBasketNoList':this.ShipmentData[0].code}).then(response =>{
            this.$modal.msgSuccess("操作成功");
            this.openShipment = false
            this.loading = false
            this.getListTask()
            this.ShipmentData = []
          })
        }else{
          this.$modal.msgError("周转筐生产单号信息不完整")
          this.shipmentStatus = true
        }
      }
    },

    /**周转筐取消按钮*/
    cancelButton(){
      this.openShipment = false
      this.ShipmentData = []
    },

    //周转筐表头点击
    tableRowClassName2({row, rowIndex}) {
      //把每一行的索引放进row
      row.index = rowIndex;
    },

    /** 导出按钮操作 */
    handleExport() {
      this.openExport = true;
      var data = this.taskStationList; // 这里面是数据列表
      const column = [
        { title: "任务类型", dataIndex: "datasource" },
        { title: "设备", dataIndex: "equipmentSectionCode" },
        { title: "生产单号", dataIndex: "prodOrderNo" },
        { title: "编码", dataIndex: "turnoverBasketNo" },
        { title: "任务状态(0 待接收 1 已领取 2 加工中 3 已暂停 4 任务异常 5 已完成)", dataIndex: "taskStatus" },
        { title: "当前操作员", dataIndex: "operator" },
        { title: "操作时间", dataIndex: "operatorTime" },
        { title: "订单数量", dataIndex: "quantity" },
        { title: "已收数量", dataIndex: "receivedQuantity" },
        { title: "产出数量", dataIndex: "outputQuantity" },
        { title: "异常数量", dataIndex: "exceptionsQuantity" },
        { title: "上道工序", dataIndex: "previousProcess" },
        { title: "工序名", dataIndex: "code" },
        { title: "计划工时", dataIndex: "workHour" },
        { title: "实际工时", dataIndex: "actualWorkHours" },
        { title: "实际完工时间", dataIndex: "actualCompletionTime" },
        { title: "计划完工时间", dataIndex: "plannedCompletionTime" },
        { title: "模号", dataIndex: "moduleNo" },
        { title: "件号", dataIndex: "pieceNo" },
        { title: "版本", dataIndex: "versionNo" },
        { title: "品名", dataIndex: "pinName" },
        { title: "工艺制程", dataIndex: "process" },
        { title: "首末工序( 0 首工序 1 末工序)", dataIndex: "processSequence" },
      ];
      const instance = new ElMapExportTable(
        { column, data },
        { progress: progress => this.percentage = progress },// 进度条回调
      );
      instance.download("报工加工明细").then((data) => {
        this.openExport = false
      }); // 导出的文件名
    },
  }
}
</script>
<style lang="scss">
.el-table .warning-row {
  background: #FFDDDD;
}

.el-table .success-row {
  background: #E4FFDD;
}
</style>
