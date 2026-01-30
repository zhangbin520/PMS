<template>
  <div class="app-container">
    <el-card>
      <el-form :model="queryParams" ref="queryForm" :inline="true">
        <el-form-item label="开始时间：" prop="keywords">
          <el-date-picker
            v-model="queryParams.beginTime"
            type="date"
            placeholder="选择日期时间"
            value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间：" prop="keywords">
          <el-date-picker
            v-model="queryParams.endTime"
            type="date"
            placeholder="选择日期时间"
            value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="设备：" prop="keywords">
          <el-select v-model="queryParams.equipmentSectionId" multiple filterable placeholder="请选择" clearable>
            <el-option
              v-for="item in equipmentFortask"
              :key="item.id"
              :label="item.deviceNo"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="生产单号：" prop="keywords">
          <el-input
            v-model="queryParams.prodOrderNo"
            placeholder="输入生产单号"
            clearable
            size="small"
            style="width: 200px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery"></el-button>
        </el-form-item>
        <el-form-item label="姓名：">
          <el-tag>{{userName}}</el-tag>
        </el-form-item>
        <el-form-item label="工号：">
          <el-tag>{{personNo}}</el-tag>
        </el-form-item>
        <el-form-item label="部门：">
          <el-tag>{{deptName}}</el-tag>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card>
      <el-button
        size="mini"
        type="primary"
        round
        icon="el-icon-s-promotion"
        @click="handleWaitprocess"
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
        disabled
      >我完成的加工任务</el-button>
    </el-card>
    <!--     任务列表-->
    <el-card>
      <el-row>
        <el-button type="warning" plain icon="el-icon-download" size="mini" style="margin-bottom: 10px" @click="handleExport">导出</el-button>
      </el-row>
      <el-table v-loading="loading" :data="taskStationList" max-height="680px" border highlight-current-row>
        <el-table-column type="index" align="center" />
        <el-table-column label="类型" align="center" prop="datasource">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.datasource == 0" type="success">钢件</el-tag>
            <el-tag v-if="scope.row.datasource == 1">电极</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="工号" align="center" prop="createBy"/>
        <el-table-column label="操作人员" align="center" prop="createName"/>
        <el-table-column label="设备编号" align="center" prop="equipmentSectionNo"/>
        <el-table-column label="生产单号" align="center" prop="prodOrderNo" width="150" :show-overflow-tooltip="true"/>
        <el-table-column label="订单数量" align="center" prop="quantity"/>
        <el-table-column label="操作类型" align="center" prop="type">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.type == 1" type="success">出货</el-tag>
            <el-tag v-if="scope.row.type == 0">完工</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="出货数量" align="center" prop="shipmentQuantity"/>
        <el-table-column label="产出数量" align="center" prop="outputQuantity"/>
        <el-table-column label="异常数量" align="center" prop="exceptionsQuantity"/>
        <el-table-column label="工序名称" align="center" prop="code" />
        <el-table-column label="计划工时" align="center" prop="workHour" v-if="false"/>
        <el-table-column label="产出工时" align="center" prop="assignWork"/>
        <el-table-column label="实际投入工时" align="center" prop="actualWorkHours"/>
        <el-table-column label="实际开工时间" align="center" prop="actualCommencementTime" :show-overflow-tooltip="true"/>
        <el-table-column label="实际完工时间" align="center" prop="actualCompletionTime" :show-overflow-tooltip="true"/>
        <el-table-column label="计划开工时间" align="center" prop="plannedCommencementTime" :show-overflow-tooltip="true"/>
        <el-table-column label="计划完工时间" align="center" prop="plannedCompletionTime" :show-overflow-tooltip="true"/>
        <el-table-column label="模号" align="center" prop="moduleNo" :show-overflow-tooltip="true"/>
        <el-table-column label="件号" align="center" prop="pieceNo"/>
        <el-table-column label="版本" align="center" prop="versionNo" :show-overflow-tooltip="true"/>
        <el-table-column label="品名" align="center" prop="pinName" :show-overflow-tooltip="true"/>
      </el-table>
    </el-card>
    <el-card>
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="queryParamsTime.pageNo"
        :limit.sync="queryParamsTime.pageSize"
        :page-sizes="pageSize"
        @pagination="getListTask"
        style="margin-right: 33%"
      />
    </el-card>

    <!--导出-->
    <!--    <el-dialog :title="title" :visible.sync="openExport" width="400px" append-to-body>-->
    <!--      <el-form ref="formExport" :model="formExport" :rules="rulesExeport" label-width="100px">-->
    <!--        <el-form-item label="开始时间" prop="beginTime">-->
    <!--          <el-date-picker-->
    <!--            v-model="formExport.beginTime"-->
    <!--            type="datetime"-->
    <!--            placeholder="选择日期时间"-->
    <!--            value-format="yyyy-MM-dd HH:mm:ss">-->
    <!--          </el-date-picker>-->
    <!--        </el-form-item>-->
    <!--        <el-form-item label="结束时间" prop="endTime">-->
    <!--          <el-date-picker-->
    <!--            v-model="formExport.endTime"-->
    <!--            type="datetime"-->
    <!--            placeholder="选择日期时间"-->
    <!--            value-format="yyyy-MM-dd HH:mm:ss">-->
    <!--          </el-date-picker>-->
    <!--        </el-form-item>-->
    <!--        <el-form-item label="设备" prop="keywords">-->
    <!--          <el-select v-model="formExport.equipmentSectionId" multiple filterable placeholder="请选择" clearable>-->
    <!--            <el-option-->
    <!--              v-for="item in equipmentFortask"-->
    <!--              :key="item.id"-->
    <!--              :label="item.deviceNo"-->
    <!--              :value="item.id">-->
    <!--            </el-option>-->
    <!--          </el-select>-->
    <!--        </el-form-item>-->
    <!--        <el-form-item label="生产单号" prop="keywords">-->
    <!--          <el-input v-model="formExport.prodOrderNo" style="width: 83%"></el-input>-->
    <!--        </el-form-item>-->
    <!--      </el-form>-->
    <!--      <div slot="footer" class="dialog-footer">-->
    <!--        <el-button type="primary" @click="submitFormExport" icon="el-icon-download">导出</el-button>-->
    <!--        <el-button @click="openExport = false">取 消</el-button>-->
    <!--      </div>-->
    <!--    </el-dialog>-->
  </div>
</template>

<script>
import {exportProdRecord, getProdWorkFinishPage} from "../../../api/production/taskStation";
import {getUserProfile} from "../../../api/system/user";
import {listEquipment} from "../../../api/system/equipment";
import global from '../../../store/global.js';
import { ElMapExportTable } from 'table-excel'

export default {
  name: "viewMyFinishTaskWorker",
  filters: {
    keepTwoNum(value) {
      value = Number(value);
      return value.toFixed(0)
    }
  },
  data() {
    return {
      // 遮罩层
      loading: false,
      // 非多个禁用
      multiple: true,
      // 总条数
      total: 0,
      //已完成表格数据
      taskStationList:[],
      //设备搜索数据
      equipmentFortask:[],
      //导出表单数据
      formExport:{},
      //任务ID
      Id:[],
      //用户信息
      userName:'',
      personNo:'',
      deptName:'',
      // 弹出层标题
      title: "近三月数据导出",
      // 是否显示弹出层
      open: false,
      openExport: false,
      //选中数组
      ids:[],
      // 导出单选框
      radio: '2',
      // 导出多选框
      checkList: [],
      //导出列表
      sheduleList:[],
      // 查询参数
      queryParams: {
        pageNo: 1,
        pageSize: 10,
      },
      // 查询参数
      queryParamsTime: {
        pageNo: 1,
        pageSize: 10,
      },
      // 工段查询参数
      queryParamsProcess: {
        pageNo: 1,
        pageSize: 1000,
      },
      //接收表单校验
      rules: {
        receivedQuantity: [
          { required: true, message: "接收数量不能为空", trigger: "blur" },
        ],
      },
      //接收表单校验
      rulesExeport: {
        beginTime: [
          { required: true, message: "开始时间不能为空", trigger: "blur" },
        ],
        endTime: [
          { required: true, message: "结束时间不能为空", trigger: "blur" },
        ],
      },
      //分页每页显示数据
      pageSize:[10,20,50,100],
      beginTime: '',
      endTime: ''
    }
  },
  created() {
    this.beginTime = this.getBeforeDate(7) + ' ' + '00:00:00'
    this.endTime = this.getBeforeDate(0) + ' ' + '23:59:59'
    this.getListUser();
    this.getListEquipment();
    this.getListTask();
  },
  mounted() {

  },
  methods: {
    /** 查询设备待加工任务列表 */
    getListTask() {
      this.queryParamsTime.beginTime = this.beginTime
      this.queryParamsTime.endTime = this.endTime
      getProdWorkFinishPage(this.queryParamsTime).then(response=> {
        this.taskStationList = response.data.records;
        this.sheduleList = response.data.records;
        this.total = Number(response.data.total);
        this.pageSize.splice(4,1,this.total)
        this.loading = false;
      })
    },
    /** 查询登录用户信息*/
    getListUser() {
      getUserProfile().then(response => {
        this.userName = response.data.nickName
        this.personNo = response.data.userName
        this.deptName = response.data.dept.name
      });
    },
    /** 查询设备列表 */
    getListEquipment() {
      listEquipment(this.queryParamsProcess).then(response => {
        this.equipmentFortask = response.data.records
      });
    },
    /** 搜索按钮操作 */
    handleQuery() {
      if(this.queryParams.beginTime == null || this.queryParams.endTime == null){
        this.getListTask()
      }else{
        this.beginTime = this.queryParams.beginTime
        this.endTime = this.queryParams.endTime
        this.queryParamsTime.beginTime = this.queryParams.beginTime
        this.queryParamsTime.endTime = this.queryParams.endTime
        getProdWorkFinishPage(this.queryParams).then(response => {
          this.taskStationList = response.data.records;
          this.total = response.data.total;
          this.pageSize.splice(4,1,this.total)
          this.loading = false;
        })
      }
    },
    /** 工件待接收任务列表 */
    handleWaitprocess() {
      this.$router.push({
        path:'/production/taskStationWorker',
      });
    },
    /** 已领取的加工任务 */
    handleAlreadyAccept() {
      this.$router.push({
        path:'/production/taskStationWorker-edit/myTask',
      });
    },
    /** 设备待加工任务列表 */
    handleWaitEquprocess() {
      this.$router.push({
        path:'/production/taskStationWorker-edit/equProcess',
      });
    },
    // /** 导出按钮操作 */
    // handleExport() {
    //   this.openExport = true;
    // },
    // submitFormExport() {
    //   exportProdRecord(this.formExport).then(response => {
    //     window.open(global.host+response.msg)
    //   });
    // },
    // 返回前number天的日期格式为2020-02-02，参数number为前几天
    getBeforeDate(number) {
      const num = number;
      const date = new Date();
      let year = date.getFullYear();
      let mon = date.getMonth() + 1;
      let day = date.getDate();
      if (day <= num) {
        if (mon > 1) {
          mon = mon - 1;
        } else {
          year = year - 1;
          mon = 12;
        }
      }
      date.setDate(date.getDate() - num);
      year = date.getFullYear();
      mon = date.getMonth() + 1;
      day = date.getDate();
      const s = year + '-' + (mon < 10 ? ('0' + mon) : mon) + '-' + (day < 10 ? ('0' + day) : day);
      return s;
    },
    /** 导出按钮操作 */
    handleExport() {
      this.openExport = true;
      var data = this.sheduleList; // 这里面是数据列表
      const column = [
        { title: "类型（0钢件 1电极）", dataIndex: "datasource" },
        { title: "工号", dataIndex: "createBy" },
        { title: "操作人员", dataIndex: "createName" },
        { title: "设备编号", dataIndex: "equipmentSectionNo" },
        { title: "生产单号", dataIndex: "prodOrderNo" },
        { title: "订单数量", dataIndex: "quantity" },
        { title: "操作类型（1出货 0完工）", dataIndex: "type" },
        { title: "出货数量", dataIndex: "shipmentQuantity" },
        { title: "产出数量", dataIndex: "outputQuantity" },
        { title: "异常数量", dataIndex: "exceptionsQuantity" },
        { title: "工序名称", dataIndex: "code" },
        { title: "产出工时", dataIndex: "assignWork" },
        { title: "实际投入工时", dataIndex: "actualWorkHours" },
        { title: "实际开工时间", dataIndex: "actualCommencementTime" },
        { title: "实际完工时间", dataIndex: "actualCompletionTime" },
        { title: "计划开工时间", dataIndex: "plannedCommencementTime" },
        { title: "计划完工时间", dataIndex: "plannedCompletionTime" },
        { title: "模号", dataIndex: "moduleNo" },
        { title: "件号", dataIndex: "pieceNo" },
        { title: "版本", dataIndex: "versionNo" },
        { title: "品名", dataIndex: "pinName" },
      ];
      const instance = new ElMapExportTable(
        { column, data },
        { progress: progress => this.percentage = progress },// 进度条回调
      );
      instance.download("完成的加工任务").then((data) => {
        this.openExport = false
      }); // 导出的文件名
    },
  }
}
</script>
