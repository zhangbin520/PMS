<!--<template>-->
<!--  <div class="app-container">-->
<!--    <el-card style="height: 550px">-->
<!--      <el-table :data="processList" @selection-change="handleSelectionChange">-->
<!--        <el-table-column type="selection" width="100" align="center" />-->
<!--        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">-->
<!--          <template slot-scope="scope" v-if="scope.row.roleId !== 1">-->
<!--            <el-button-->
<!--              size="mini"-->
<!--              type="text"-->
<!--              icon="el-icon-edit"-->
<!--              @click="handleUpdate(scope.row)"-->
<!--            >"待定"</el-button>-->
<!--          </template>-->
<!--        </el-table-column>-->
<!--        <el-table-column label="排产状态" prop="schedulingStatus"/>-->
<!--        <el-table-column label="模号" prop="moduleNo" :show-overflow-tooltip="true" />-->
<!--        <el-table-column label="工件号" prop="pieceNo" :show-overflow-tooltip="true" />-->
<!--        <el-table-column label="版本" prop="versionNo" :show-overflow-tooltip="true" />-->
<!--        <el-table-column label="品名" prop="pinName" :show-overflow-tooltip="true" />-->
<!--        <el-table-column label="数量" prop="numElectrodes" :show-overflow-tooltip="true" />-->
<!--        <el-table-column label="生产单号" prop="productionOrderNo" :show-overflow-tooltip="true" />-->
<!--        <el-table-column label="需求日期" prop="demandDate" :show-overflow-tooltip="true" />-->
<!--        <el-table-column label="交货等级" prop="deliveryLevel" :show-overflow-tooltip="true" />-->
<!--        <el-table-column label="设计状态" prop="schedulingStatus" :show-overflow-tooltip="true" />-->
<!--      </el-table>-->
<!--      <pagination-->
<!--        v-show="total>0"-->
<!--        :total="total"-->
<!--        :page.sync="queryParams.pageNo"-->
<!--        :limit.sync="queryParams.pageSize"-->
<!--        @pagination="getList"-->
<!--      />-->
<!--    </el-card>-->

<!--    <el-card>-->
<!--      <el-button type="text" icon="el-icon-search" size="small" @click="">搜索</el-button>-->
<!--      <el-button type="text" icon="el-icon-download" size="small" @click="">导出</el-button>-->
<!--      <el-button type="text" icon="el-icon-refresh" size="small" @click="">刷新</el-button>-->
<!--    </el-card>-->

<!--  </div>-->
<!--</template>-->

<!--<script>-->
<!--  import { listQualityAssurance } from "../../../../api/production/steeling/qualityAssurance";-->

<!--  export default {-->
<!--    name: "QualityAssurance",-->
<!--    data() {-->
<!--      return {-->
<!--        workpiece: "",-->
<!--        designer: "",-->
<!--        // 设置表单左对齐-->
<!--        labelPosition: 'left',-->
<!--        // 日期选择器-->
<!--        value1: '',-->
<!--        // 时间选择器-->
<!--        value2: '',-->
<!--        // 遮罩层-->
<!--        loading: true,-->
<!--        // 选中数组-->
<!--        ids: [],-->
<!--        // 工件类型删除id-->
<!--        id: [],-->
<!--        // 选中数组代码-->
<!--        codes: [],-->
<!--        // 选中数组设备状态-->
<!--        status: [],-->
<!--        // 非单个禁用-->
<!--        single: true,-->
<!--        // 非多个禁用-->
<!--        multiple: true,-->
<!--        // 显示搜索条件-->
<!--        showSearch: true,-->
<!--        // 删除传参-->
<!--        Id:'',-->
<!--        // 总条数-->
<!--        total: 0,-->
<!--        // 人工排产表格数据-->
<!--        scheduleArtificialList: [],-->
<!--        processList: [],-->
<!--        dispatchList: [],-->
<!--        // 弹出层标题-->
<!--        title: "",-->
<!--        // 是否显示弹出层-->
<!--        open: false,-->
<!--        openDispatch: false,-->
<!--        openAppoint: false,-->
<!--        // 日期范围-->
<!--        dateRange: [],-->
<!--        // 查询参数-->
<!--        queryParams: {-->
<!--          pageNo: 1,-->
<!--          pageSize: 10,-->
<!--          createBy: undefined,-->
<!--          createTime: undefined,-->
<!--          deliveryLevel: undefined,-->
<!--          demandDate: undefined,-->
<!--          dispatchOrderNo: undefined,-->
<!--          moduleNo: undefined,-->
<!--          numElectrodes: undefined,-->
<!--          pieceNo: undefined,-->
<!--          id: undefined,-->
<!--          pinName: undefined,-->
<!--          productionOrderNo: undefined,-->
<!--          schedulingStatus: undefined,-->
<!--          updateBy: undefined,-->
<!--          updateTime: undefined,-->
<!--          versionNo: undefined,-->
<!--        },-->
<!--        // 表单参数-->
<!--        form: {},-->
<!--        formSetting: {},-->
<!--        defaultProps: {-->
<!--          children: "children",-->
<!--          label: "label"-->
<!--        },-->
<!--      }-->
<!--    },-->
<!--    created() {-->
<!--      this.getList();-->
<!--    },-->
<!--    methods: {-->
<!--      /** 查询待排产任务列表 */-->
<!--      getList() {-->
<!--        this.loading = true;-->
<!--        listSteelProcessing(this.addDateRange(this.queryParams, this.dateRange)).then(response => {-->
<!--          this.scheduleArtificialList = response.data.records;-->
<!--          this.total = Number(response.total);-->
<!--          this.loading = false;-->
<!--        });-->
<!--      },-->
<!--      // 取消按钮-->
<!--      cancel() {-->
<!--        this.open = false;-->
<!--        this.reset();-->
<!--      },-->
<!--      cancelDispatch() {-->
<!--        this.openDispatch = false;-->
<!--        this.reset();-->
<!--      },-->
<!--      cancelAppoint() {-->
<!--        this.openAppoint = false;-->
<!--        this.reset();-->
<!--      },-->
<!--      /** 搜索按钮操作 */-->
<!--      handleQuery() {-->
<!--        this.queryParams.pageNo = 1;-->
<!--        this.getList();-->
<!--      },-->
<!--      // 表单重置-->
<!--      reset() {-->
<!--        this.form = {-->
<!--          unitPrice: undefined,-->
<!--          code: undefined,-->
<!--          name: undefined,-->
<!--          createBy: undefined,-->
<!--          createTime: undefined,-->
<!--          typeName: undefined,-->
<!--          operationCategory: undefined,-->
<!--          groupDevicesNum: undefined,-->
<!--          id: undefined,-->
<!--          updateBy: undefined,-->
<!--          updateTime: undefined,-->
<!--          status: "0",-->
<!--          workpieceTypeId: undefined-->
<!--        };-->
<!--        this.resetForm("form");-->
<!--      },-->
<!--      // 多选框选中数据-->
<!--      handleSelectionChange(selection) {-->
<!--        this.ids = selection.map(item => item.id)-->
<!--        this.status = selection.map(item => item.status)-->
<!--        this.single = selection.length!=1-->
<!--        this.multiple = !selection.length-->
<!--      },-->
<!--      /** 搜索按钮操作 */-->
<!--      handleSearch() {-->
<!--        this.reset();-->
<!--        this.open = true;-->
<!--        this.title = "搜索";-->
<!--      },-->
<!--      handleArtificial() {-->
<!--        this.$confirm('确定转APS排产吗?', '提示', {-->
<!--          confirmButtonText: '确定',-->
<!--          cancelButtonText: '取消',-->
<!--          type: 'warning'-->
<!--        }).then(() => {-->
<!--          this.$message({-->
<!--            type: 'success',-->
<!--            message: '转APS成功!'-->
<!--          });-->
<!--        }).catch(() => {-->
<!--          this.$message({-->
<!--            type: 'info',-->
<!--            message: '已取消'-->
<!--          });-->
<!--        });-->
<!--      },-->
<!--      handleConfirm() {-->
<!--        this.$confirm('确认生产吗?', '提示', {-->
<!--          confirmButtonText: '确定',-->
<!--          cancelButtonText: '取消',-->
<!--          type: 'warning'-->
<!--        }).then(() => {-->
<!--          this.$message({-->
<!--            type: 'success',-->
<!--            message: '确认成功!'-->
<!--          });-->
<!--        }).catch(() => {-->
<!--          this.$message({-->
<!--            type: 'info',-->
<!--            message: '已取消'-->
<!--          });-->
<!--        });-->
<!--      },-->
<!--      /**派工按钮操作*/-->
<!--      handleDispatch() {-->
<!--        this.openDispatch = true;-->
<!--        this.title = "工件加工信息"-->
<!--      },-->
<!--      /**指定工段按钮*/-->
<!--      handleAppoint() {-->
<!--        this.openAppoint = true;-->
<!--        this.title = "确认排期及指定工位"-->
<!--      },-->
<!--      /**确认排期提交按钮*/-->
<!--      submitConfirm: function() {-->
<!--      },-->
<!--    }-->
<!--  }-->
<!--</script>-->
