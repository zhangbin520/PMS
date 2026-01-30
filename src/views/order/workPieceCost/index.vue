<template>
  <div class="app-container">
    <el-card>
      <el-form :model="queryParams" ref="queryForm" :inline="true">
        <el-row>
          <el-form-item label="派工单号" prop="keywords">
            <el-input
              v-model="queryParams.executionOrderNo"
              placeholder="输入派工单号"
              clearable
              size="small"
              style="width: 200px"
              @keyup.enter.native="handleQuery"
            />
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
          <el-form-item label="模号" prop="keywords">
            <el-input
              v-model="queryParams.moduleNo"
              placeholder="输入模号"
              clearable
              size="small"
              style="width: 200px"
              @keyup.enter.native="handleQuery"
            />
            </el-form-item>
            <el-form-item label="件号" prop="keywords">
            <el-input
              v-model="queryParams.pieceNo"
              placeholder="输入件号"
              clearable
              size="small"
              style="width: 200px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item>
            <el-button style="margin-left: 10px" type="primary" icon="el-icon-search" size="mini" @click="handleQuery"></el-button>
            <el-button type="warning" plain icon="el-icon-download" size="mini" style="margin-bottom: 10px" @click="handleExport">导出</el-button> 
          </el-form-item>
        </el-row>
      </el-form>
    </el-card>
    <el-card>
      <el-row>
        <el-col :span="24">
          <el-table v-loading="loading" :data="workPieceCostList" border>
            <el-table-column type="index" width="50" align="center" />
            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  round
                  type="primary"
                  @click="handleUpdate(scope.row)"
                  :disabled="scope.row.taskStatus === '已完成'"
                >生产进度</el-button>
              </template>
            </el-table-column>
            <el-table-column label="生产单状态" align="center" key="taskStatus" prop="taskStatus" />
            <el-table-column label="派工单号" align="center" key="executionOrderNo" prop="executionOrderNo" />
            <el-table-column label="生产单号" align="center" key="prodOrderNo" prop="prodOrderNo"/>
            <el-table-column label="模号" align="center" key="moduleNo" prop="moduleNo"/>
            <el-table-column label="件号" align="center" key="pieceNo" prop="pieceNo"/>
            <el-table-column label="工时报价" align="center">
              <el-table-column label="加工成本" align="center" key="processingCost" prop="processingCost"/>
              <el-table-column label="材料成本" align="center" key="materialCost" prop="materialCost"/>
              <el-table-column label="管理成本" align="center" key="managementCost" prop="managementCost"/>
              <el-table-column label="刀具成本" align="center" key="toolCost" prop="toolCost"/>
              <el-table-column label="电极成本" align="center" key="electrodeCost" prop="electrodeCost"/>
              <el-table-column label="合计成本" align="center" key="totalCost" prop="totalCost"/>
            </el-table-column>
            <el-table-column label="实际" align="center">
              <el-table-column label="加工成本" align="center" key="actualProcessingCost" prop="actualProcessingCost"/>
              <el-table-column label="材料成本" align="center" key="actualMaterialCost" prop="actualMaterialCost"/>
              <el-table-column label="管理成本" align="center" key="actualManagementCost" prop="actualManagementCost"/>
              <el-table-column label="刀具成本" align="center" key="actualToolCost" prop="actualToolCost">
                <template slot-scope="scope">
                  <el-button type="text" @click="openToolDetails(scope.row)">{{scope.row.actualToolCost}}</el-button>
                </template>
              </el-table-column>
              <el-table-column label="电极成本" align="center" key="actualElectrodeCost" prop="actualElectrodeCost"/>
              <el-table-column label="合计成本" align="actualTotalCost" key="length" prop="actualTotalCost"/>
            </el-table-column>
          </el-table>
          <pagination
            v-show="total>0"
            :total="total"
            :page.sync="queryParams.pageNo"
            :limit.sync="queryParams.pageSize"
            @pagination="getList"
          />
        </el-col>
      </el-row>
    </el-card>

    <!-- 刀具明细对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="1000px" append-to-body>
      <el-card>
        <h3>生产单<el-tag>{{prodOrderNo}}</el-tag>的刀具成本</h3>
        <el-form ref="form" :model="form" :rules="rules" label-width="80px">
          <el-col :span="12">
            <el-form-item label="成本合计" prop="type">
              <el-input v-model="form.total" placeholder="" style="width: 240px"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="" prop="type">
             <el-tag>成本小计=订单数量x单价x加工精度比例</el-tag>
            </el-form-item>
          </el-col>
        </el-form>
      </el-card>
      <el-card>
        <h3>刀具明细</h3>
        <el-table :data="toolData" max-height="500px" border>
          <el-table-column label="生产单号" align="center" key="prodOrderNo" prop="prodOrderNo"/>
          <el-table-column label="类型" align="center" key="dataSource" prop="dataSource"/>
          <el-table-column label="订单数量" align="center" key="quantity" prop="quantity"/>
          <el-table-column label="料号" align="center" key="itemNo" prop="itemNo"/>
          <el-table-column label="刀具名称" align="center" key="name" prop="name"/>
          <el-table-column label="刀具长度" align="center" key="length" prop="length"/>
          <el-table-column label="单价" align="center" key="price" prop="price"/>
          <el-table-column label="加工精度比例" align="center" key="proportion" prop="proportion"/>
          <el-table-column label="程式单加工精度" align="center" key="accuracy" prop="accuracy"/>
          <el-table-column label="成本小计" align="center" key="subtotal" prop="subtotal"/>
        </el-table>

      </el-card>
      <div slot="footer" class="dialog-footer">
        <el-button @click="open = false" type="danger">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { listQuality,addQuality,deleteQuality,getListQuality,updateQuality } from "../../../api/system/quality"
  import {addFiles, delFiles, listFiles, updateFiles} from "../../../api/system/files";
  import {
    delOrderToolCost,
    exportOrderToolCost, getOrderToolCostDetailList,
    getOrderToolCostPage,
    saveOrUpdateOrderToolCost
  } from "../../../api/system/toolManagement";
  import {orderWorkpieceCost} from "../../../api/order/workPieceCost";
    import { ElMapExportTable } from 'table-excel'

  export default {
    name: "Quality",
    dicts: ['sys_normal_disable','quality_type'],
    data() {
      return {
        // 遮罩层
        loading: true,
        // 总条数
        total: 0,
        // 非多个禁用
        multiple: true,
        // 表格树数据
        workPieceCostList: [],
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        // 表单参数
        form: {},
        //选中数组
        Ids:[],
        toolNames:[],
        //刀具表格数据
        toolData:[],
        //刀具选中数据
        prodOrderNo:'',
        // 查询参数
        queryParams: {
          pageNo: 1,
          pageSize: 10,
        },
        // 查询参数
        queryParamsTool: {
          pageNo: 1,
          pageSize: 100,
        },
        //文件格式表单校验
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
      /** 查询工件成本列表 */
      getList() {
        this.loading = true;
        orderWorkpieceCost(this.queryParams).then(response => {
          this.workPieceCostList = response.data.records;
          this.total = response.data.total;
          this.loading = false;
        });
      },
      /** 查询刀具明细 */
      getListTool() {
        this.queryParamsTool.prodOrderNo = this.prodOrderNo
        getOrderToolCostDetailList(this.queryParamsTool).then(response => {
          this.toolData = response.data.records;
          this.form.total = response.data.total
          this.loading = false;
        });
      },
      /** 搜索按钮操作 */
      handleQuery() {
        this.queryParams.pageNo= 1;
        this.getList();
      },
       /** 导出按钮操作 */
      handleExport() {
        this.openExport = true;
        var data = this.workPieceCostList; // 这里面是数据列表
        const column = [
          { title: "派工单号", dataIndex: "executionOrderNo" },
          { title: "生产单状态", dataIndex: "taskStatus" },
          { title: "模号", dataIndex: "moduleNo" },
          { title: "件号", dataIndex: "pieceNo" },
          { title: "加工成本", dataIndex: "processingCost" },
          { title: "材料成本", dataIndex: "materialCost" },
          { title: "管理成本", dataIndex: "managementCost" },
          { title: "刀具成本", dataIndex: "toolCost" },
          { title: "电极成本", dataIndex: "electrodeCost" },
          { title: "合计成本", dataIndex: "totalCost" },
          { title: "加工成本", dataIndex: "actualProcessingCost" },
          { title: "材料成本", dataIndex: "actualMaterialCost" },
          { title: "管理成本", dataIndex: "actualManagementCost" },
          { title: "刀具成本", dataIndex: "actualToolCost" },
          { title: "电极成本", dataIndex: "actualElectrodeCost" },
          { title: "合计成本", dataIndex: "actualTotalCost" },
        ];
        const instance = new ElMapExportTable(
          { column, data },
          { progress: progress => this.percentage = progress },// 进度条回调
        );
        instance.download("工件成本").then((data) => {
          this.openExport = false
        }); // 导出的文件名
      },
      /** 编辑刀具成本按钮 */
      handleUpdate(row) {
        this.$router.push({
          path:'/follow/recording',
        });
      },
      /** 查看刀具明细 */
      openToolDetails(row) {
        this.open = true
        this.prodOrderNo = row.prodOrderNo
        this.getListTool()
      }
    }
  };
</script>

