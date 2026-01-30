<template>
  <div class="app-container">
    <el-card>
      <el-form :model="queryParams" ref="queryForm" :inline="true">
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
      <h3>任务列表</h3>
      <el-table v-loading="loading" :data="scheduleAwaitList" @selection-change="handleSelectionChange" border>
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
            >查看工艺</el-button>
          </template>
        </el-table-column>
        <el-table-column label="电极序号" align="center" prop="electrodeNo"/>
        <el-table-column label="工件号" align="center" prop="pieceNo"/>
        <el-table-column label="工件生产单号" align="center" prop="workpieceProdOrderNo" width="150"/>
        <el-table-column label="模号" align="center" prop="moduleNo"/>
        <el-table-column label="电极生产单号" align="center" prop="prodOrderNo" width="150"/>
        <el-table-column label="工件版本号" align="center" prop="versionNo" />
        <el-table-column label="电极长" align="center" prop="electrodeLength" />
        <el-table-column label="电极宽" align="center" prop="electrodeWidth"/>
              <el-table-column label="电极高" align="center" prop="electrodeHeight" />
      <el-table-column label="有效高度" align="center" prop="effectiveHeight" />
        <el-table-column label="工件EDM工段 " align="center" prop="deliveryLevel"/>
        <el-table-column label="需求日期" align="center" prop="demandDate"/>
        <el-table-column label="电极数量" align="center" prop="quantity" />
        <el-table-column label="品名" align="center" prop="pinName"/>
      </el-table>
    </el-card>

    <el-card>
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="queryParams.pageNo"
        :limit.sync="queryParams.pageSize"
        @pagination="getListAwait"
      />
      <el-row style="margin-left: 40%">
        <el-button type="primary" icon="el-icon-check" size="small" @click="handleLaborMany" :disabled="multiple">批量转人工</el-button>
        <el-button type="primary" icon="el-icon-check" size="small" @click="handleAps" :disabled="multiple">APS批量排产</el-button>
      </el-row>
    </el-card>

    <!--工艺对话框-->
    <el-dialog :title="title" :visible.sync="openProcess" width="500px" append-to-body>
      <el-table v-loading="loading" :data="processList">
        <el-table-column label="工序名称" prop="code"/>
        <el-table-column label="工时" prop="workHour"/>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="openProcess = false" type="danger" style="margin-right: 40%">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { listElectrodeAwait,turnManyAps,elTransferToLabor,listElectrode } from "../../../../api/production/eleprocess/scheduleAwait";

  export default {
    name: "ScheduleWait",
    data() {
      return {
        // 遮罩层
        loading: true,
        // 非多个禁用
        multiple: true,
        // 总条数
        total: 0,
        // 电极加工待排产表格数据
        scheduleAwaitList: [],
        //工艺表格数据
        processList:[],
        //选中数组
        BomId:[],
        //工艺弹窗打开
        openProcess: false,
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        //选中数组
        ids:[],
        // 查询参数
        queryParams: {
          pageNo: 1,
          pageSize: 10,
        },
      }
    },
    created() {
      this.getListAwait();
    },
    methods: {
      /** 查询待排产任务列表 */
      getListAwait() {
        this.loading = true;
        listElectrodeAwait(this.queryParams).then(response => {
          this.scheduleAwaitList = response.data.records;
          this.total = response.data.total;
          this.loading = false;
        })
      },
      /** 搜索按钮操作 */
      handleQuery() {
        this.queryParams.pageNo= 1;
        this.getListAwait();
      },
      // 表单重置
      reset() {
        this.form = {
          unitPrice: undefined,
          code: undefined,
        };
        this.resetForm("form");
      },
      // 多选框选中数据
      handleSelectionChange(selection) {
        this.ids = selection.map(item => item.id)
        this.multiple = !selection.length
      },
      /**APS批量排产按钮*/
      handleAps() {
        const ids = this.ids
        this.$modal.confirm('确定转APS排产吗？').then(function() {
          return turnManyAps({'ids':ids});
        }).then(() => {
          this.$modal.msgSuccess("排产成功");
          this.getListAwait();
        }).catch(() => {});
      },

      /**转人工排产按钮*/
      handleLabor(row) {
        const id = [row.id]
        this.$modal.confirm('确定转人工排产吗？').then(function() {
          return elTransferToLabor({'ids':id});
        }).then(() => {
          this.$modal.msgSuccess("转人工成功");
          this.getListAwait();
        }).catch(() => {});
      },
      /**批量转人工排产按钮*/
      handleLaborMany(row) {
        const id = this.ids
        this.$modal.confirm('确定转人工排产吗？').then(function() {
          return elTransferToLabor({'ids':id});
        }).then(() => {
          this.$modal.msgSuccess("转人工成功");
          this.getListAwait();
        }).catch(() => {});
      },

      /**工艺按钮*/
      handleCraft(row) {
        this.openProcess = true;
        this.title = "工件工艺制程"
        const BomId = row.detailId
        this.queryParams.eleBomId = BomId
        listElectrode(this.queryParams).then(response => {
          this.processList = response.data.records;
        })
      },
    }
  }
</script>
