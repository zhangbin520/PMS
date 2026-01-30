<template>
  <div class="app-container">
    <el-card>
    <el-form :model="queryParams" ref="queryForm" v-show="showSearch" :inline="true">
      <el-form-item label="搜索" prop="keywords">
        <el-input
          v-model="queryParams.keywords"
          placeholder="请输入客户编码/工件号/模号/品名"
          clearable
          size="small"
          style="width: 500px"
        />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery"></el-button>
      </el-form-item>
    </el-form>
  </el-card>

    <el-card>

<!--   <el-table v-loading="loading" :data="scheduleWaitListOut" style="height: 450px" border>-->
<!--    <el-table-column type="expand">-->
<!--      <template slot-scope="props">-->

      <el-table v-loading="loading" :data="scheduleWaitList"  @selection-change="handleSelectionChange" border>
        <el-table-column type="selection" align="center" />
        <el-table-column label="操作" width="150" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope" v-if="scope.row.id !== 1">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleLabor(scope.row)"
          >转人工</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleCraft(scope.row)"
          >工艺</el-button>
        </template>
      </el-table-column>
        <el-table-column label="派工单号" prop="dispatchOrderNo"/>
      <el-table-column label="排产状态" prop="schedulingStatus">
        <template slot-scope="scope">
          <p v-if="scope.row.schedulingStatus =='0'">新单待排产</p>
          <p v-if="scope.row.schedulingStatus =='1'">恢复加工待排产</p>
        </template>
      </el-table-column>
      <el-table-column label="模号" prop="moduleNo" :show-overflow-tooltip="true" />
      <el-table-column label="工件号" prop="pieceNo" :show-overflow-tooltip="true" />
      <el-table-column label="版本" prop="versionNo" :show-overflow-tooltip="true" />
      <el-table-column label="生产单号" prop="prodOrderNo" :show-overflow-tooltip="true"/>
      <el-table-column label="工艺制程" prop="process" :show-overflow-tooltip="true"/>
      <el-table-column label="品名" prop="pinName" :show-overflow-tooltip="true" />
      <el-table-column label="数量" prop="quantity" :show-overflow-tooltip="true" />
      <el-table-column label="需求日期" prop="demandDate" :show-overflow-tooltip="true" />
      <el-table-column label="交货等级" prop="deliveryLevel" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.deliveryLevel =='0'" type="danger">特急件</el-tag>
          <el-tag v-if="scope.row.deliveryLevel =='1'" type="warning">急件</el-tag>
          <el-tag v-if="scope.row.deliveryLevel =='2'">一般</el-tag>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNo"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />
<!--      </template>-->
<!--    </el-table-column>-->

<!--     <el-table-column align="center">-->
<!--       <span>派工单号：{{pNo}}</span>-->
<!--     </el-table-column>-->
<!--    </el-table>-->
    </el-card>

    <el-card>
      <el-row style="margin-left: 40%">
        <el-button type="primary" icon="el-icon-check" size="small" @click="handleLaborMany" :disabled="multiple">批量转人工</el-button>
        <el-button type="primary" icon="el-icon-check" size="small" @click="handleAps" disabled>APS批量排产</el-button>
      </el-row>
    </el-card>

    <!--工艺对话框-->
    <el-dialog :title="title" :visible.sync="openProcess" width="500px" append-to-body>
      <el-table v-loading="loading" :data="processList" @selection-change="handleSelectionChange">
        <el-table-column label="工序名称" prop="code"/>
        <el-table-column label="工时" prop="workHour"/>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
  import { listScheduleWait, laborScheduleWait, apsScheduleWait, listProdProcess } from "../../../../api/production/steeling/scheduleWait";

  export default {
    name: "ScheduleWait",
    data() {
      return {
        // 遮罩层
        loading: true,
        // 选中数组
        ids: [],
        id: [],
        //派工单号
        pNo:{},
        // 选中数组设备状态
        status: [],
        // 非单个禁用
        single: true,
        // 非多个禁用
        multiple: true,
        // 显示搜索条件
        showSearch: true,
        // 总条数
        total: 0,
        // 工价工时表格数据
        scheduleWaitList: [],
        processList: [],
        scheduleWaitListOut: [],
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        openProcess: false,
        // 日期范围
        dateRange: [],
        // 查询参数
        queryParams: {
          pageNo: 1,
          pageSize: 10,
        },
        // 表单参数
        form: {},
        formSetting: {},
        defaultProps: {
          children: "children",
          label: "label"
        },
      }
    },
    created() {
      this.getList();
    },
    methods: {
      /** 查询待排产任务列表 */
      getList() {
        this.loading = true;
        const scheduleWaitList = [];
        const scheduleWaitListOut = [];
        listScheduleWait(this.queryParams).then(response => {
          response.data.records.forEach(function(item){
            console.log(item.prodSpScheduleWaitList)
            item.prodSpScheduleWaitList.forEach(function(d) {
              scheduleWaitList.push(
                {
                  id:d.id,
                  schedulingStatus:d.schedulingStatus,
                  moduleNo:d.moduleNo,
                  pieceNo:d.pieceNo,
                  versionNo:d.versionNo,
                  pinName:d.pinName,
                  quantity:d.quantity,
                  prodOrderNo:d.prodOrderNo,
                  demandDate:d.demandDate,
                  deliveryLevel:d.deliveryLevel,
                  designStatus:d.designStatus,
                  detailId:d.detailId,
                  dispatchOrderNo:d.dispatchOrderNo,
                  process:d.process
                })
            })
            scheduleWaitListOut.push(item.pNo)
          })
          this.scheduleWaitList = scheduleWaitList
          // this.scheduleWaitListOut = scheduleWaitListOut
          // this.pNo = scheduleWaitListOut.join('')
          this.total = response.data.total;
          this.loading = false;
        });
      },

      /** 查询工序工时列表 */
      getProcessList() {
        this.loading = true;
        listProdProcess(this.queryParams).then(response => {
          this.processList = response.data.records;
          this.loading = false;
        });
      },

      // 取消按钮
      cancel() {
        this.open = false;
        this.reset();
      },
      /** 搜索按钮操作 */
      handleQuery() {
        this.queryParams.pageNo = 1;
        this.getList();
      },
      // 表单重置
      reset() {
        this.form = {
          unitPrice: undefined,
          code: undefined,
          name: undefined,
          createBy: undefined,
          createTime: undefined,
          typeName: undefined,
          operationCategory: undefined,
          groupDevicesNum: undefined,
          id: undefined,
          updateBy: undefined,
          updateTime: undefined,
          status: "0",
          workpieceTypeId: undefined
        };
        this.resetForm("form");
      },
      // 多选框选中数据
      handleSelectionChange(selection) {
        this.ids = selection.map(item => item.id)
        this.single = selection.length!=1
        this.multiple = !selection.length
        console.log(this.ids)
      },
      /** 搜索按钮操作 */
      handleSearch() {
        this.reset();
        this.open = true;
        this.title = "搜索";
      },
      /**APS批量排产按钮*/
      handleAps() {
        const ids = this.ids || this.ids;
        this.$modal.confirm('确定转APS排产吗？').then(function() {
          return apsScheduleWait({'ids':ids});
        }).then(() => {
          this.$modal.msgSuccess("排产成功");
          this.getList();
        }).catch(() => {});
      },

      /**转人工排产按钮*/
      handleLabor(row) {
        const id = [row.id];
        this.$modal.confirm('确定转人工排产吗？').then(function() {
          return laborScheduleWait({'ids':id});
        }).then(() => {
          this.$modal.msgSuccess("转人工成功");
          this.getList();
        }).catch(() => {});
      },
      /**批量转人工排产按钮*/
      handleLaborMany(row) {
        const id =  this.ids;
        this.$modal.confirm('确定转人工排产吗？').then(function() {
          return laborScheduleWait({'ids':id});
        }).then(() => {
          this.$modal.msgSuccess("转人工成功");
          this.getList();
        }).catch(() => {});
      },

      /**工艺按钮*/
      handleCraft(row) {
        const detailId = row.detailId
        this.queryParams.detailId = row.detailId
        listProdProcess(this.queryParams).then(response => {
          this.openProcess = true;
          this.getProcessList();
          this.title = "工件工艺制程"
        })
      },
    }
  }
</script>
