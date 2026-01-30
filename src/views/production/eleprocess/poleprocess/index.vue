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
      <span>任务列表</span>
      <el-table v-loading="loading" :data="poleprocessList" @selection-change="handleSelectionChange" border max-height="800px">
        <el-table-column type="selection" align="center" />
        <el-table-column label="操作" width="150" align="center" class-name="small-padding fixed-width">
          <template slot-scope="scope" v-if="scope.row.id !== 1">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="handleStopProcess(scope.row)"
            >生产暂停</el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="handleViewFiles(scope.row)"
            >查看文档</el-button>
          </template>
        </el-table-column>
        <el-table-column label="电极序号" align="center" prop="electrodeNo"/>
        <el-table-column label="工件号" align="center" prop="pieceNo"/>
        <el-table-column label="工件生产单号" align="center" prop="workpieceProdOrderNo" :show-overflow-tooltip="true"/>
        <el-table-column label="模号" align="center" prop="moduleNo"/>
        <el-table-column label="工件版本号" align="center" prop="versionNo" />
        <el-table-column label="电极生产单号" align="center" prop="prodOrderNo" :show-overflow-tooltip="true"/>
        <el-table-column label="电极长" align="center" prop="electrodeLength" />
        <el-table-column label="电极宽" align="center" prop="electrodeWidth"/>
              <el-table-column label="电极高" align="center" prop="electrodeHeight" />
      <el-table-column label="有效高度" align="center" prop="effectiveHeight" />
        <el-table-column label="工件EDM工段" align="center" prop="enp"/>
        <el-table-column label="需求日期" align="center" prop="demandDate"/>
        <el-table-column label="电极数量" align="center" prop="quantity" />
        <el-table-column label="品名" align="center" prop="pinName"/>
      </el-table>
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="queryParams.pageNo"
        :limit.sync="queryParams.pageSize"
        @pagination="getListAwait"
      />
    </el-card>

  </div>
</template>

<script>
  import { listElectrodeProcess,processStop } from "../../../../api/production/eleprocess/poleprocess";

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
        // 电极加工表格数据
        poleprocessList: [],
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
        listElectrodeProcess(this.queryParams).then(response => {
          this.poleprocessList = response.data.records;
          this.total = response.data.total;
          this.loading = false;
        })
      },
      /** 搜索按钮操作 */
      handleQuery() {
        this.queryParams.pageNo = 1;
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

      /**生产暂停按钮*/
      handleStopProcess(row) {
        const id = row.id
        this.$modal.confirm('确定生产暂停吗？').then(function() {
          return processStop({'id':id});
        }).then(() => {
          this.$modal.msgSuccess("生产暂停成功");
          this.getListAwait();
        }).catch(() => {});
      },

      /**查看图档按钮*/
      handleViewFiles(row) {

      },
    }
  }
</script>
