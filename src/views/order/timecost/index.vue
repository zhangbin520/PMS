<template>
  <div class="app-container">
    <div slot="header">
      <el-form :model="queryParams" ref="queryForm" v-show="showSearch" :inline="true">
        <el-form-item label="客户名称" prop="customerName">
          <el-input
            v-model="queryParams.customerName"
            placeholder="请输入客户名称"
            clearable
            size="small"
            style="width: 220px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="客户订单号" prop="customerOrderNo">
          <el-input
            v-model="queryParams.customerOrderNo"
            placeholder="请输入客户订单号"
            clearable
            size="small"
            style="width: 220px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="派工单号" prop="executionOrderNo">
          <el-input
            v-model="queryParams.executionOrderNo"
            placeholder="请输入派工单号"
            clearable
            size="small"
            style="width: 220px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="客户料号" prop="customerItemNo">
          <el-input
            v-model="queryParams.customerItemNo"
            placeholder="请输入客户料号"
            clearable
            size="small"
            style="width: 220px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="需求日期" prop="demandDate">
          <el-input
            v-model="queryParams.demandDate"
            placeholder="请输入需求日期"
            clearable
            size="small"
            style="width: 220px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="投单日期" prop="orderDate">
          <div class="block">
            <el-date-picker
              v-model="queryParams.orderDate"
              type="daterange"
              value-format="yyyy-MM-dd HH:mm:ss"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
          </div>

          <!-- <el-date-picker
            v-model="queryParams.orderDate"
            placeholder="请输入投单开始日期"
            clearable
            type="date"
            size="small"
            value-format="yyyy-MM-dd"
            style="width: 220px"
            @keyup.enter.native="handleQuery"
          /> -->
        </el-form-item>
        <!-- <el-form-item label="投单截止日期" prop="orderEndDate">
          <el-date-picker
            v-model="queryParams.orderEndDate"
            placeholder="请输入投单截止日期"
            clearable
            type="date"
            value-format="yyyy-MM-dd"
            size="small"
            style="width: 220px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item> -->
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
          <el-button type="warning" plain icon="el-icon-download" size="mini" style="margin-bottom: 10px" @click="handleExport">导出</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-row>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
      <el-col :span="24" style="height: 600px; overflow-y: auto; overflow-x: auto;">
        <el-table v-loading="loading" :data="timeList" border @selection-change="handleSelectionChange" highlight-current-row>
          <el-table-column type="index" width="50"/>
          <el-table-column type="selection" width="50"/>
          <el-table-column label="操作" align="center" width="160" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button
                size="mini"
                round
                type="primary"
                icon="el-icon-edit"
                @click="handleTotalCost(scope.row)"
              >总成本</el-button>
              <el-button
                size="mini"
                round
                type="primary"
                icon="el-icon-edit"
                @click="handleViewWorkpiece(scope.row)"
              >查看工件</el-button>
            </template>
          </el-table-column>
          <el-table-column label="客户名称" align="center" prop="customerName" :show-overflow-tooltip="true"/>
          <el-table-column label="客户订单号" align="center" prop="customerOrderNo" />
          <el-table-column label="模号" align="center" prop="customerItemNo" :show-overflow-tooltip="true"/>
          <el-table-column label="派工单号" align="center" prop="executionOrderNo" width="150px"/>
          <el-table-column label="机种" align="center" prop="typeOfMachine"  />
          <el-table-column label="品名" align="center" prop="pinName" />
          <el-table-column label="需求日期" align="center" prop="demandDate" :show-overflow-tooltip="true"/>
          <el-table-column label="投单日期" align="center" prop="orderDate" :show-overflow-tooltip="true"/>
          <el-table-column label="投单性质" align="center" prop="orderNature" />
          <el-table-column label="加工成本" align="center" prop="processingCost">
            <template slot-scope="scope">
              {{ (scope.row.processingCost) | keepTwoNum}}
            </template>
          </el-table-column>
          <el-table-column label="材料成本" align="center" prop="materialCost">
            <template slot-scope="scope">
              {{ (scope.row.materialCost) | keepTwoNum}}
            </template>
          </el-table-column>
          <el-table-column label="管理成本" align="center" prop="managementCost">
            <template slot-scope="scope">
              {{ (scope.row.managementCost) | keepTwoNum}}
            </template>
          </el-table-column>
          <el-table-column label="刀具成本" align="center" prop="toolCost">
            <template slot-scope="scope">
              {{ (scope.row.toolCost) | keepTwoNum}}
            </template>
          </el-table-column>
          <el-table-column label="电极成本" align="center" prop="electrodeCost">
            <template slot-scope="scope">
              {{ (scope.row.electrodeCost) | keepTwoNum}}
            </template>
          </el-table-column>
          <el-table-column label="总成本" align="center" v-model="totalCost">
            <template slot-scope="scope">
              {{ (scope.row.totalCost) | keepTwoNum}}
            </template>
          </el-table-column>
        </el-table>
        <div align="center">
          <pagination
            v-show="total>0"
            :total="total"
            :page.sync="queryParams.pageNo"
            :limit.sync="queryParams.pageSize"
            @pagination="getList"
          />
          <el-row>
            <el-button size="mini" plain type="primary" icon="el-icon-edit" :disabled="single" @click="handleCompare">计划成本与实际成本对比</el-button>
          </el-row>
        </div>
      </el-col>
    </el-row>
    <!-- 查看工时成本对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="400px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="加工成本/元" prop="processingCost">
          <el-input v-model="form.processingCost" placeholder="" />
        </el-form-item>
        <el-form-item label="材料成本/元" prop="materialCost">
          <el-input v-model="form.materialCost" placeholder="" />
        </el-form-item>
        <el-form-item label="管理成本/元" prop="managementCost">
          <el-input v-model="form.managementCost" placeholder="">
          </el-input>
        </el-form-item>
        <el-form-item label="刀具成本/元" prop="toolCost">
          <el-input v-model="form.toolCost" placeholder="" />
        </el-form-item>
        <el-form-item label="电极成本/元" prop="electrodeCost">
          <el-input v-model="form.electrodeCost"  placeholder="" />
        </el-form-item>
        <el-form-item label="总成本/元" prop="totalCost">
          <el-input v-model="form.totalCost" placeholder="" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="open = false" type="danger">关 闭</el-button>
      </div>
    </el-dialog>
    <!--导出-->
<!--    <el-dialog :title="title" :visible.sync="openExport" width="400px" append-to-body>-->
<!--      <el-form ref="formExport" :model="formExport" :rules="rules" label-width="100px">-->
<!--        <el-form-item label="开始时间" prop="beginTime">-->
<!--          <el-date-picker-->
<!--            v-model="formExport.beginTime"-->
<!--            type="date"-->
<!--            placeholder="选择日期时间"-->
<!--            value-format="yyyy-MM-dd">-->
<!--          </el-date-picker>-->
<!--        </el-form-item>-->
<!--        <el-form-item label="结束时间" prop="endTime">-->
<!--          <el-date-picker-->
<!--            v-model="formExport.endTime"-->
<!--            type="date"-->
<!--            placeholder="选择日期时间"-->
<!--            value-format="yyyy-MM-dd">-->
<!--          </el-date-picker>-->
<!--        </el-form-item>-->
<!--      </el-form>-->
<!--      <div slot="footer" class="dialog-footer">-->
<!--        <el-button type="primary" @click="submitFormExport" icon="el-icon-download">导出</el-button>-->
<!--        <el-button @click="openExport = false">取 消</el-button>-->
<!--      </div>-->
<!--    </el-dialog>-->
    <!--计划与实际成本对比-->
    <el-dialog :title="compare.title" :visible.sync="compare.open" width="1800px" append-to-body center>
      <el-table :data="compareList" >
        <el-table-column label="派工单号" align="center" prop="executionOrderNo"></el-table-column>
        <el-table-column label="模号" align="center" prop="customerItemNo"></el-table-column>
        <el-table-column label="客户订单号" align="center" prop="customerOrderNo"></el-table-column>
        <el-table-column label="生产单数量" align="center" prop="prodOrderQuantity"></el-table-column>
        <el-table-column label="订单数量" align="center" prop="orderQuantity"></el-table-column>
        <el-table-column label="报价" align="center">
          <el-table-column label="加工成本" align="center" prop="processingCost"></el-table-column>
          <el-table-column label="材料成本" align="center" prop="materialCost"></el-table-column>
          <el-table-column label="管理成本" align="center" prop="managementCost"></el-table-column>
          <el-table-column label="刀具成本" align="center" prop="toolCost"></el-table-column>
          <el-table-column label="电极成本" align="center" prop="electrodeCost"></el-table-column>
          <el-table-column label="总成本" align="center" prop="totalCost"></el-table-column>
          <el-table-column label="平均单价" align="center" prop="avgUnitPrice"></el-table-column>
        </el-table-column>
        <el-table-column label="实际" align="center">
          <el-table-column label="加工成本" align="center" prop="actualProcessingCost"></el-table-column>
          <el-table-column label="材料成本" align="center" prop="actualMaterialCost"></el-table-column>
          <el-table-column label="管理成本" align="center" prop="actualManagementCost"></el-table-column>
          <el-table-column label="刀具成本" align="center" prop="actualToolCost"></el-table-column>
          <el-table-column label="电极成本" align="center" prop="actualElectrodeCost"></el-table-column>
          <el-table-column label="总成本" align="center" prop="actualTotalCost"></el-table-column>
          <el-table-column label="平均单价" align="center" prop="actualAvgUnitPrice"></el-table-column>
        </el-table-column>
        <el-table-column label="差异" align="center">
          <el-table-column label="加工成本" align="center" prop="differenceProcessingCost">
            <template slot-scope="scope">
              <el-tag :class="scope.row.differenceProcessingCost < 0?'red-color':'green-color'">{{scope.row.differenceProcessingCost}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="材料成本" align="center" prop="differenceMaterialCost">
            <template slot-scope="scope">
              <el-tag :class="scope.row.differenceMaterialCost < 0?'red-color':'green-color'">{{scope.row.differenceMaterialCost}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="刀具成本" align="center" prop="differenceToolCost">
            <template slot-scope="scope">
              <el-tag :class="scope.row.differenceToolCost < 0?'red-color':'green-color'">{{scope.row.differenceToolCost}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="电极成本" align="center" prop="differenceElectrodeCost">
            <template slot-scope="scope">
              <el-tag :class="scope.row.differenceElectrodeCost < 0?'red-color':'green-color'">{{scope.row.differenceElectrodeCost}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="总成本" align="center" prop="differenceTotalCost">
            <template slot-scope="scope">
              <el-tag :class="scope.row.differenceTotalCost < 0?'red-color':'green-color'">{{scope.row.differenceTotalCost}}</el-tag>
            </template>
          </el-table-column>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="compare.open = false" type="danger">关 闭</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import {costComparison, exportManHourCost, listTimeCost} from "../../../api/order/timecost"
  import global from '../../../store/global.js'
  import { ElMapExportTable } from 'table-excel'

  export default {
    name: "TimeCost",
    dicts: ['sys_normal_disable'],
    filters: {
      keepTwoNum(value){
        value = Number(value);
        return value.toFixed(2)
      }
    },
    data() {
      return {
        // 遮罩层
        loading: true,
        // 非单个禁用
        single: true,
        // 总条数
        total: 0,
        totalCompare:0,
        // 显示搜索条件
        showSearch: true,
        // 非多个禁用
        multiple: true,
        // 工时成本表格数据
        timeList: [],
        // 查看工时表格参数
        timeData: [],
        totalCost:'',
        //总成本表单参数
        form:{},
        //导出表单数据
        formExport:{},
        //导出列表
        sheduleList:[],
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        openExport: false,
        //计划与实际成本对比
        compare:{
          // 弹出层标题
          title: "",
          // 是否显示弹出层
          open: false,
        },
        //计划与实际成本对比表格数据
        compareList:[],
        Id:'',
        // 查询参数
        queryParams: {
          pageNo: 1,
          pageSize: 100,
        },
        //工时成本表单校验
        rules: {
          code: [
            { required: true, message: "材质编码不能为空", trigger: "blur" },
            { min: 2, max: 10, message: '材质编码长度必须介于 2 和 10 之间', trigger: 'blur' }
          ],
          name: [
            { required: true, message: "名称不能为空", trigger: "blur" },
            { min: 2, max: 10, message: '名称长度必须介于 2 和 10 之间', trigger: 'blur' }
          ],
        },
      };
    },
    created() {
      this.getList();
    },
    methods: {
      /** 分页查询工时成本列表 */
      getList() {
        this.loading = true;
        listTimeCost(this.queryParams).then(response => {
          this.timeList = response.data.records;
          this.sheduleList = response.data.records;
          this.total = response.data.total;
          this.loading = false;
        });
      },
      /** 分页成本对比列表 */
      getListCompare() {
        this.queryParams.id = this.Id
        costComparison(this.queryParams).then(response => {
          this.compareList = [response.data];
        });
      },
      // 工时成本表单重置
      reset() {
        this.form = {
          processingCost: undefined,
          materialCost: undefined,
          managementCost: undefined,
        };
        this.resetForm("form");
      },
      // 多选框选中数据
      handleSelectionChange(selection) {
        this.Id = selection.map(item => item.id).join('');
        this.single = selection.length != 1;
      },
      /** 搜索按钮操作 */
      handleQuery() {
        this.queryParams.pageNo = 1;
        this.getList();
      },
      /** 总成本按钮 */
      handleTotalCost(row) {
        this.reset();
        const id = row.id
        listTimeCost(this.queryParams).then(response => {
          let arr = response.data.records
          for( let i=0;i<arr.length;i++){
            if(id == arr[i].id ) {
              this.form.processingCost = response.data.records[i].processingCost;
              this.form.materialCost = response.data.records[i].materialCost;
              this.form.managementCost = response.data.records[i].managementCost;
              this.form.toolCost = response.data.records[i].toolCost;
              this.form.electrodeCost = response.data.records[i].electrodeCost;
              this.form.totalCost = response.data.records[i].totalCost;
            }
          }
          this.open = true;
          this.title = "查看总成本";
        });
      },
      /** 查看工件按钮 */
      handleViewWorkpiece(row) {
        this.$router.push({
          path:'/order/timecost-edit/workpiece',
          query: {
            bomId: row.id,
          }
        });
      },
      /** 计划成本与实际成本对比按钮 */
      handleCompare() {
        this.compare.title = "计划与实际成本对比"
        this.compare.open = true
        this.getListCompare()
      },
      /** 导出按钮操作 */
      handleExport() {
        this.openExport = true;
        var data = this.sheduleList; // 这里面是数据列表
        const column = [
          { title: "客户名称", dataIndex: "customerName" },
          { title: "客户订单号", dataIndex: "customerOrderNo" },
          { title: "模号", dataIndex: "customerItemNo" },
          { title: "派工单号", dataIndex: "executionOrderNo" },
          { title: "机种", dataIndex: "typeOfMachine" },
          { title: "品名", dataIndex: "pinName" },
          { title: "需求日期", dataIndex: "demandDate" },
          { title: "投单日期", dataIndex: "orderDate" },
          { title: "投单性质", dataIndex: "orderNature" },
          { title: "加工成本", dataIndex: "processingCost" },
          { title: "材料成本", dataIndex: "materialCost" },
          { title: "管理成本", dataIndex: "managementCost" },
          { title: "刀具成本", dataIndex: "toolCost" },
          { title: "电极成本", dataIndex: "electrodeCost" },
          { title: "总成本", dataIndex: "totalCost" },
        ];
        const instance = new ElMapExportTable(
          { column, data },
          { progress: progress => this.percentage = progress },// 进度条回调
        );
        instance.download("工时成本").then((data) => {
          this.openExport = false
        }); // 导出的文件名
      },
      // /** 导出按钮操作 */
      // handleExport() {
      //   this.openExport = true;
      // },
      // submitFormExport() {
      //   this.queryParams.beginTime = this.formExport.beginTime
      //   this.queryParams.endTime = this.formExport.endTime
      //   exportManHourCost(this.queryParams).then(response => {
      //     window.open(global.host+response.msg)
      //   });
      // },

    }
  };
</script>

<style scoped>
  .green-color{
    background: #98FB98;
  }
  .red-color{
    background: #F08080;
    color: #FFFFFF;
  }
</style>
