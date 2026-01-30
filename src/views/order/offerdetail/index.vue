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
        <el-form-item label="模号" prop="moduleNo">
          <el-input
            v-model="queryParams.moduleNo"
            placeholder="请输入模号"
            clearable
            size="small"
            style="width: 220px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="生产单号" prop="prodOrderNo">
          <el-input
            v-model="queryParams.prodOrderNo"
            placeholder="请输入生产单号"
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
          <el-input
            v-model="queryParams.orderDate"
            placeholder="请输入投单日期"
            clearable
            size="small"
            style="width: 220px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
          <el-button type="warning" plain icon="el-icon-download" size="mini" style="margin-bottom: 10px" @click="handleExport">导出</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-row>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
      <el-col :span="24">
        <el-table v-loading="loading" :data="offerList" border max-height="700px" highlight-current-row>
          <el-table-column type="index" width="50"/>
          <el-table-column label="操作" align="center" width="180" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button
                size="mini"
                round
                type="primary"
                icon="el-icon-folder-opened"
                @click="handleViewFile(scope.row)"
              >查看图档</el-button>
              <el-button
                size="mini"
                round
                type="primary"
                icon="el-icon-edit"
                @click="handleChangeCustomerCost(scope.row)"
              >修改客户成本</el-button>
            </template>
          </el-table-column>
          <el-table-column label="客户名称" align="center" prop="customerName" :show-overflow-tooltip="true" />
          <el-table-column label="客户订单号" align="center" prop="customerOrderNo" />
          <el-table-column label="投单人" align="center" prop="investor"  />
          <el-table-column label="派工单号" align="center" prop="executionOrderNo" width="150px"/>
          <el-table-column label="机种" align="center" prop="typeOfMachine"  />
          <el-table-column label="品名" align="center" prop="pinName" />
          <el-table-column label="需求日期" align="center" prop="demandDate" :show-overflow-tooltip="true"/>
          <el-table-column label="投单日期" align="center" prop="orderDate" :show-overflow-tooltip="true"/>
          <el-table-column label="投单性质" align="center" prop="orderNature" />
          <el-table-column label="投单原因" align="center" prop="orderReason" :show-overflow-tooltip="true"/>
          <el-table-column label="模号" align="center" prop="moduleNo"  />
          <el-table-column label="件号" align="center" prop="pieceNo" />
          <el-table-column label="版本" align="center" prop="versionNo"  />
          <el-table-column label="生产单号" align="center" prop="prodOrderNo" width="150px"/>
          <el-table-column label="工艺制程" align="center" prop="process" width="150px" :show-overflow-tooltip="true"/>
          <el-table-column label="规格" align="center" >
            <template slot-scope="scope">
              <p>{{scope.row.length}}*{{scope.row.width}}*{{scope.row.height}}</p>
            </template>
          </el-table-column>
          <el-table-column label="数量" align="center" prop="quantity" />
          <el-table-column label="材质" align="center" prop="material" />
          <el-table-column label="投单类型" align="center" prop="orderNature"  />
          <el-table-column label="工时成本" align="center">
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
          </el-table-column>
          <el-table-column label="客户成本" align="center">
            <el-table-column label="加工成本" align="center" prop="processingCost">
              <template slot-scope="scope">
                {{ (scope.row.originalProcessingCost) | keepTwoNum}}
              </template>
            </el-table-column>
            <el-table-column label="材料成本" align="center" prop="materialCost">
              <template slot-scope="scope">
                {{ (scope.row.originalMaterialCost) | keepTwoNum}}
              </template>
            </el-table-column>
            <el-table-column label="管理成本" align="center" prop="managementCost">
              <template slot-scope="scope">
                {{ (scope.row.originalManagementCost) | keepTwoNum}}
              </template>
            </el-table-column>
            <el-table-column label="刀具成本" align="center" prop="toolCost">
              <template slot-scope="scope">
                {{ (scope.row.originalToolCost) | keepTwoNum}}
              </template>
            </el-table-column>
            <el-table-column label="电极成本" align="center" prop="electrodeCost">
              <template slot-scope="scope">
                {{ (scope.row.originalElectrodeCost) | keepTwoNum}}
              </template>
            </el-table-column>
            <el-table-column label="总成本" align="center" v-model="totalCost">
              <template slot-scope="scope">
                {{ (scope.row.originalTotalCost) | keepTwoNum}}
              </template>
            </el-table-column>
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
        </div>
      </el-col>
    </el-row>

    <!--导出-->
    <el-dialog :title="title" :visible.sync="openExport" width="400px" append-to-body>
      <el-form ref="formExport" :model="formExport" :rules="rules" label-width="100px">
        <el-form-item label="开始时间" prop="beginTime">
          <el-date-picker
            v-model="formExport.beginTime"
            type="date"
            placeholder="选择日期时间"
            value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间" prop="endTime">
          <el-date-picker
            v-model="formExport.endTime"
            type="date"
            placeholder="选择日期时间"
            value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFormExport" icon="el-icon-download">导出</el-button>
        <el-button @click="openExport = false">取 消</el-button>
      </div>
    </el-dialog>
    <!--修改客户成本-->
    <el-dialog :title="customer.title" :visible.sync="customer.open" width="400px" append-to-body>
      <el-form ref="formCustomer" :model="formCustomer" :rules="rules" label-width="100px">
        <el-form-item label="加工成本" prop="beginTime">
          <el-input v-model="formCustomer.originalProcessingCost" placeholder="" />
        </el-form-item>
        <el-form-item label="材料成本" prop="endTime">
          <el-input v-model="formCustomer.originalMaterialCost" placeholder="" />
        </el-form-item>
      <el-form-item label="管理成本" prop="beginTime">
        <el-input v-model="formCustomer.originalManagementCost" placeholder="" />
      </el-form-item>
      <el-form-item label="刀具成本" prop="endTime">
        <el-input v-model="formCustomer.originalToolCost" placeholder="" />
      </el-form-item>
      <el-form-item label="电极成本" prop="beginTime">
        <el-input v-model="formCustomer.originalElectrodeCost" placeholder="" />
      </el-form-item>
      <el-form-item label="总成本" prop="endTime">
        <el-input v-model="formCustomer.originalTotalCost" placeholder="" />
      </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFormCustomer">确定</el-button>
        <el-button @click="customer.open = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {editOrderBomCustomerCost, exportQuotationDetails, quotationDetails} from "../../../api/order/offerdetail";
  import global from '../../../store/global.js';
  import { ElMapExportTable } from 'table-excel'

  export default {
    name: "OfferDetail",
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
        // 总条数
        total: 0,
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        openExport: false,
        // 显示搜索条件
        showSearch: true,
        // 工时成本表格数据
        offerList: [],
        totalCost:'',
        //导出表单数据
        formExport:{},
        //选中数组
        Id:[],
        //客户成本表单弹出层
        customer:{
          title:"",
          open:false,
        },
        //客户成本表单数据
        formCustomer:{},
        //导出列表
        sheduleList:[],
        //修改客户成本选中数据
        id:'',
        // 查询参数
        queryParams: {
          pageNo: 1,
          pageSize: 10,
        },
        // 查询参数
        queryParamsCustomer: {
          pageNo: 1,
          pageSize: 10,
        },
        //工时成本表单校验
        rules: {}
      };
    },
    created() {
      this.getList();
    },
    methods: {
      /** 分页查询工时成本列表 */
      getList() {
        this.loading = true;
        quotationDetails(this.queryParams).then(response => {
          this.offerList = response.data.records;
          this.sheduleList = response.data.records;
          this.total = response.data.total;
          this.loading = false;
        });
      },
      /** 搜索按钮操作 */
      handleQuery() {
        this.queryParams.pageNo = 1;
        this.getList();
      },
      /** 查看图档 */
      handleViewFile(row) {
        this.$router.push({
          path:'/eleContact/eleContactForm',
          query:{
            prodOrderNo: row.prodOrderNo,
          },
        });
      },
      // /** 导出按钮操作 */
      // handleExport() {
      //   this.openExport = true;
      // },
      submitFormExport() {
         this.queryParams.beginTime = this.formExport.beginTime
         this.queryParams.endTime = this.formExport.endTime
         exportQuotationDetails(this.queryParams).then(response => {
           window.open(global.host+response.msg)
         });
       },
      /** 导出按钮操作 */
      handleExport() {
        this.openExport = true;
        var data = this.sheduleList; // 这里面是数据列表
        const column = [
          { title: "客户名称", dataIndex: "customerName" },
          { title: "客户订单号", dataIndex: "customerOrderNo" },
          { title: "投单人", dataIndex: "investor" },
          { title: "派工单号", dataIndex: "executionOrderNo" },
          { title: "机种", dataIndex: "typeOfMachine" },
          { title: "品名", dataIndex: "pinName" },
          { title: "需求日期", dataIndex: "demandDate" },
          { title: "投单日期", dataIndex: "orderDate" },
          { title: "投单性质", dataIndex: "orderNature" },
          { title: "投单原因", dataIndex: "orderReason" },
          { title: "模号", dataIndex: "moduleNo" },
          { title: "件号", dataIndex: "pieceNo" },
          { title: "版本", dataIndex: "versionNo" },
          { title: "生产单号", dataIndex: "prodOrderNo" },
          { title: "工艺制程", dataIndex: "process" },
          { title: "规格（长）", dataIndex: "length" },
          { title: "规格（宽）", dataIndex: "width" },
          { title: "规格（高）", dataIndex: "height" },
          { title: "数量", dataIndex: "quantity" },
          { title: "材质", dataIndex: "material" },
          { title: "投单类型", dataIndex: "orderNature" },
          { title: "（工时）加工成本", dataIndex: "processingCost" },
          { title: "（工时）材料成本", dataIndex: "materialCost" },
          { title: "（工时）管理成本", dataIndex: "managementCost" },
          { title: "（工时）刀具成本", dataIndex: "toolCost" },
          { title: "（工时）电极成本", dataIndex: "electrodeCost" },
          { title: "（工时）总成本", dataIndex: "totalCost" },
          { title: "（客户）加工成本", dataIndex: "originalProcessingCost" },
          { title: "（客户）材料成本", dataIndex: "originalMaterialCost" },
          { title: "（客户）管理成本", dataIndex: "originalManagementCost" },
          { title: "（客户）刀具成本", dataIndex: "originalToolCost" },
          { title: "（客户）电极成本", dataIndex: "originalElectrodeCost" },
          { title: "（客户）总成本", dataIndex: "originalTotalCost" },
        ];
        const instance = new ElMapExportTable(
          { column, data },
          { progress: progress => this.percentage = progress },// 进度条回调
        );
        instance.download("报价明细").then((data) => {
          this.openExport = false
        }); // 导出的文件名
      },
      /** 修改客户成本 */
      handleChangeCustomerCost(row) {
        this.id = row.originalId
        this.customer.title = "修改客户成本"
        this.customer.open = true
        this.formCustomer = row
      },
      submitFormCustomer() {
        this.queryParamsCustomer.id = this.id
        this.queryParamsCustomer.originalProcessingCost = this.formCustomer.originalProcessingCost
        this.queryParamsCustomer.originalMaterialCost = this.formCustomer.originalMaterialCost
        this.queryParamsCustomer.originalManagementCost = this.formCustomer.originalManagementCost
        this.queryParamsCustomer.originalToolCost = this.formCustomer.originalToolCost
        this.queryParamsCustomer.originalElectrodeCost = this.formCustomer.originalElectrodeCost
        this.queryParamsCustomer.originalTotalCost = this.formCustomer.originalTotalCost
        editOrderBomCustomerCost(this.queryParamsCustomer).then(res => {
          this.$modal.msgSuccess("修改客户成本成功")
          this.customer.open = false
          this.getList()
        })
      }
    }
  };
</script>

