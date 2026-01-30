<template>
  <div class="app-container">
    <el-card>
      <el-form :model="queryParams" ref="queryForm" :inline="true">
        <el-row>
          <el-form-item label="开始时间：" prop="keywords">
            <el-date-picker
              v-model="queryParams.beginTime"
              type="date"
              placeholder="选择日期时间"
              value-format="yyyy-MM-dd HH:mm:ss">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="结束时间：" prop="keywords">
            <el-date-picker
              v-model="queryParams.endTime"
              type="date"
              placeholder="选择日期时间"
              value-format="yyyy-MM-dd 23:59:59">
            </el-date-picker>
          </el-form-item>
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
          <el-form-item label="工段" prop="keywords">
            <el-select v-model="queryParams.codeList" multiple filterable placeholder="请选择" clearable>
              <el-option
                v-for="item in processFortask"
                :key="item.code"
                :label="item.code"
                :value="item.code">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="部门" prop="keywords">
            <treeselect v-model="queryParams.deptCodeList" :options="deptOptions" :normalizer="normalizer" style="width:200px" placeholder="请选择部门">
              <label slot="option-label" slot-scope="{node}">
                {{node.label}}
              </label>
            </treeselect>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery"></el-button>
          </el-form-item>
        </el-row>
       <el-row>
         <el-form-item label="姓名：">
           <el-tag>{{userName}}</el-tag>
         </el-form-item>
         <el-form-item label="工号：">
           <el-tag>{{personNo}}</el-tag>
         </el-form-item>
         <el-form-item label="部门：">
           <el-tag>{{deptName}}</el-tag>
         </el-form-item>
       </el-row>
      </el-form>
    </el-card>
    <!--     任务列表-->
    <el-card>
      <el-row>
        <el-button type="warning" plain icon="el-icon-download" size="mini" style="margin-bottom: 10px" @click="handleExport">导出</el-button>
      </el-row>
      <el-table v-loading="loading" :data="taskStationList" max-height="680px" border>
        <el-table-column type="index" align="center" />
        <el-table-column label="任务类型" align="center" prop="datasource">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.datasource == 0" type="success">钢件</el-tag>
            <el-tag v-if="scope.row.datasource == 1">电极</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="设备编号" align="center" prop="equipmentSectionNo"/>
        <el-table-column label="生产单号" align="center" prop="prodOrderNo" width="150" :show-overflow-tooltip="true"/>
        <el-table-column label="报工人工号" align="center" prop="createBy"/>
        <el-table-column label="报工姓名" align="center" prop="createName"/>
        <el-table-column label="完成时间" align="center" prop="timeAttribution" width="100px"/>
        <el-table-column label="订单数量" align="center" prop="quantity"/>
        <el-table-column label="产出数量" align="center" prop="outputQuantity"/>
        <el-table-column label="异常数量" align="center" prop="exceptionsQuantity"/>
        <el-table-column label="工序名称" align="center" prop="code" />
        <el-table-column label="计划工时" align="center" prop="workHour" />
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
        :page.sync="queryParams.pageNo"
        :limit.sync="queryParams.pageSize"
        :page-sizes=pageSize
        @pagination="getListTask"
      />
    </el-card>
  </div>
</template>

<script>
  import {exportProdRecord, getProdWorkFinishPage} from "../../../api/production/taskStation";
  import {getUserProfile} from "../../../api/system/user";
  import {listEquipment} from "../../../api/system/equipment";
  import global from '../../../store/global.js';
  import {prodWorkFinishRecord} from "../../../api/follow/recording";
  import {listProcess} from "../../../api/system/process";
  import {treeselect} from "../../../api/system/dept";
  import Treeselect from "@riophae/vue-treeselect";
  import "@riophae/vue-treeselect/dist/vue-treeselect.css";
  import {exportWorkRecord} from "../../../api/follow/schedule";
  import { ElMapExportTable } from 'table-excel'

  export default {
    name: "Schedule",
    filters: {
      keepTwoNum(value) {
        value = Number(value);
        return value.toFixed(0)
      }
    },
    components: { Treeselect },
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
        //工段搜索数据
        processFortask:[],
        // 部门树选项
        deptOptions: undefined,
        //导出表单数据
        formExport:{},
        //导出列表
        sheduleList:[],
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
        // 查询参数
        queryParams: {
          pageNo: 1,
          pageSize: 10,
        },
        // 工段查询参数
        queryParamsProcess: {
          pageNo: 1,
          pageSize: 1000,
        },
        //导出全部分页数组
        pageSize:[10,20,30,50],
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
      }
    },
    created() {
      this.getListUser();
      this.getListEquipment();
      this.getListProcess();
      this.getTreeselect();
    },
    methods: {
      /** 查询设备待加工任务列表 */
      getListTask() {
        prodWorkFinishRecord(this.queryParams).then(response => {
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
      /** 查询工段列表 */
      getListProcess() {
        listProcess(this.queryParamsProcess).then(response => {
          this.processFortask = response.data.records;
        });
      },
      /** 查询部门下拉树结构 */
      getTreeselect() {
        treeselect().then(response => {
          this.deptOptions = response.data;
        });
      },
      /** 搜索按钮操作 */
      handleQuery() {
        this.queryParams.pageNo= 1;
        this.getListTask();
      },
      // /** 导出按钮操作 */
      // handleExport() {
      //   this.openExport = true;
      //   exportWorkRecord(this.queryParams).then(response => {
      //     window.open(global.host+response.msg)
      //   });
      // },
      /** 导出按钮操作 */
      handleExport() {
        this.openExport = true;
        var data = this.sheduleList; // 这里面是数据列表
        const column = [
          { title: "任务类型(1 电极 0 钢件)", dataIndex: "datasource" },
          { title: "设备编号", dataIndex: "equipmentSectionNo" },
          { title: "生产单号", dataIndex: "prodOrderNo" },
          { title: "报工人工号", dataIndex: "createBy" },
          { title: "报工姓名", dataIndex: "createName" },
          { title: "完成时间", dataIndex: "timeAttribution" },
          { title: "订单数量", dataIndex: "quantity" },
          { title: "产出数量", dataIndex: "outputQuantity" },
          { title: "异常数量", dataIndex: "exceptionsQuantity" },
          { title: "工序名称", dataIndex: "code" },
          { title: "计划工时", dataIndex: "workHour" },
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
        instance.download("报工记录").then((data) => {
          this.openExport = false
        }); // 导出的文件名
      },
      /** 部门树自定义标签 */
      normalizer(node) {
        return {
          id: node.id,
          label: node.label,
          children: node.children
        }
      },
    }
  }
</script>
