<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <!-- <el-form-item label="状态" prop="status">
        <el-input
          v-model="queryParams.status"
          placeholder="请输入状态"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item> -->
      <el-form-item label="位置" prop="position">
        <el-input
          v-model="queryParams.position"
          placeholder="请输入位置"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="操作人" prop="operator">
        <el-input
          v-model="queryParams.operator"
          placeholder="请输入操作人"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="电极序号" prop="eleNo">
        <el-input
          v-model="queryParams.eleNo"
          placeholder="请输入电极序号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="工件号" prop="pieceNo">
        <el-input
          v-model="queryParams.pieceNo"
          placeholder="请输入工件号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="工件生产单号" prop="orderNo">
        <el-input
          v-model="queryParams.orderNo"
          placeholder="请输入工件生产单号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="模号" prop="moduleNo">
        <el-input
          v-model="queryParams.moduleNo"
          placeholder="请输入模号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="电极生产单号" prop="eleDispatchNo">
        <el-input
          v-model="queryParams.eleDispatchNo"
          placeholder="请输入电极生产单号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="工件版本号" prop="versionNo">
        <el-input
          v-model="queryParams.versionNo"
          placeholder="请输入工件版本号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="数量" prop="quantity">
        <el-input
          v-model="queryParams.quantity"
          placeholder="请输入数量"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="材质" prop="material">
        <el-input
          v-model="queryParams.material"
          placeholder="请输入材质"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="电极长" prop="electrodeLength">
        <el-input
          v-model="queryParams.electrodeLength"
          placeholder="请输入电极长"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="电极宽" prop="electrodeWidth">
        <el-input
          v-model="queryParams.electrodeWidth"
          placeholder="请输入电极宽"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="电极高" prop="electrodeHeight">
        <el-input
          v-model="queryParams.electrodeHeight"
          placeholder="请输入电极高"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="记录时间" prop="recordTime">
        <el-date-picker clearable size="small"
          v-model="queryParams.recordTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择记录时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <!-- <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['jy:electrodeHistory:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['jy:electrodeHistory:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['jy:electrodeHistory:remove']"
        >删除</el-button>
      </el-col> -->
      <!-- <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          :loading="exportLoading"
          @click="handleExport"
        >导出</el-button> -->
      <!-- </el-col> -->
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="electrodeHistoryList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <!-- <el-table-column label="记录时间" align="center" prop="id" /> -->
      <el-table-column label="状态" align="center" prop="status" >
        <template slot-scope="scope">
          <el-tag v-if='scope.row.status===-1' type="danger">报废</el-tag>
          <el-tag v-else-if="scope.row.status===0" type="success">入库</el-tag>
          <el-tag v-else-if="scope.row.status===1" type="warning">出库</el-tag>
          <el-tag v-else-if="scope.row.status===2" >还库</el-tag>
          <el-tag v-else-if="scope.row.status===5" >解绑</el-tag>
          <el-tag v-else type="info"> 未知</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="位置" align="center" prop="position" />
      <el-table-column label="操作人" align="center" prop="operator" />
      <el-table-column label="电极序号" align="center" prop="eleNo" />
      <el-table-column label="工件号" align="center" prop="pieceNo" />
      <el-table-column label="工件生产单号" align="center" prop="orderNo" />
      <el-table-column label="模号" align="center" prop="moduleNo" />
      <el-table-column label="电极生产单号" align="center" prop="eleDispatchNo" />
      <el-table-column label="工件版本号" align="center" prop="versionNo" />
      <el-table-column label="数量" align="center" prop="quantity" />
      <el-table-column label="材质" align="center" prop="material" />
      <!-- <el-table-column label="电极长" align="center" prop="electrodeLength" />
      <el-table-column label="电极宽" align="center" prop="electrodeWidth" />
      <el-table-column label="电极高" align="center" prop="electrodeHeight" /> -->
      <el-table-column label="长-宽-高" align="center" >
        <template slot-scope="scope">
          {{scope.row.electrodeLength}}-{{scope.row.electrodeWidth}}-{{scope.row.electrodeHeight}}
        </template>
      </el-table-column>
      <el-table-column label="有效高度" align="center" prop="effectiveHeight" />

      <el-table-column label="记录时间" align="center" prop="recordTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.recordTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['jy:electrodeHistory:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['jy:electrodeHistory:remove']"
          >删除</el-button>
        </template>
      </el-table-column> -->
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改电极记录对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="状态" prop="status">
          <el-input v-model="form.status" placeholder="请输入状态" />
        </el-form-item>
        <el-form-item label="位置" prop="position">
          <el-input v-model="form.position" placeholder="请输入位置" />
        </el-form-item>
        <el-form-item label="操作人" prop="operator">
          <el-input v-model="form.operator" placeholder="请输入操作人" />
        </el-form-item>
        <el-form-item label="电极序号" prop="eleNo">
          <el-input v-model="form.eleNo" placeholder="请输入电极序号" />
        </el-form-item>
        <el-form-item label="工件号" prop="pieceNo">
          <el-input v-model="form.pieceNo" placeholder="请输入工件号" />
        </el-form-item>
        <el-form-item label="工件生产单号" prop="orderNo">
          <el-input v-model="form.orderNo" placeholder="请输入工件生产单号" />
        </el-form-item>
        <el-form-item label="模号" prop="moduleNo">
          <el-input v-model="form.moduleNo" placeholder="请输入模号" />
        </el-form-item>
        <el-form-item label="电极生产单号" prop="eleDispatchNo">
          <el-input v-model="form.eleDispatchNo" placeholder="请输入电极生产单号" />
        </el-form-item>
        <el-form-item label="工件版本号" prop="versionNo">
          <el-input v-model="form.versionNo" placeholder="请输入工件版本号" />
        </el-form-item>
        <el-form-item label="数量" prop="quantity">
          <el-input v-model="form.quantity" placeholder="请输入数量" />
        </el-form-item>
        <el-form-item label="材质" prop="material">
          <el-input v-model="form.material" placeholder="请输入材质" />
        </el-form-item>
        <el-form-item label="电极长" prop="electrodeLength">
          <el-input v-model="form.electrodeLength" placeholder="请输入电极长" />
        </el-form-item>
        <el-form-item label="电极宽" prop="electrodeWidth">
          <el-input v-model="form.electrodeWidth" placeholder="请输入电极宽" />
        </el-form-item>
        <el-form-item label="电极高" prop="electrodeHeight">
          <el-input v-model="form.electrodeHeight" placeholder="请输入电极高" />
        </el-form-item>
        <el-form-item label="记录时间" prop="recordTime">
          <el-date-picker clearable size="small"
            v-model="form.recordTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择记录时间">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listElectrodeHistory, getElectrodeHistory, delElectrodeHistory, addElectrodeHistory, updateElectrodeHistory, exportElectrodeHistory } from "../../../api/jy/electrodeHistory";

export default {
  name: "ElectrodeHistory",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 导出遮罩层
      exportLoading: false,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: false,
      // 总条数
      total: 0,
      // 电极记录表格数据
      electrodeHistoryList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        status: null,
        position: null,
        operator: null,
        eleNo: null,
        pieceNo: null,
        orderNo: null,
        moduleNo: null,
        eleDispatchNo: null,
        versionNo: null,
        quantity: null,
        material: null,
        electrodeLength: null,
        electrodeWidth: null,
        electrodeHeight: null,
        recordTime: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      }
    };
  },
  created() {
    this.getList();
  },
  activated() {
    this.getList();
  },
  methods: {
    /** 查询电极记录列表 */
    getList() {
      this.loading = true;
      listElectrodeHistory(this.queryParams).then(response => {
        this.electrodeHistoryList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        status: null,
        position: null,
        operator: null,
        eleNo: null,
        pieceNo: null,
        orderNo: null,
        moduleNo: null,
        eleDispatchNo: null,
        versionNo: null,
        quantity: null,
        material: null,
        electrodeLength: null,
        electrodeWidth: null,
        electrodeHeight: null,
        recordTime: null
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加电极记录";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getElectrodeHistory(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改电极记录";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateElectrodeHistory(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addElectrodeHistory(this.form).then(response => {
              this.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$confirm('是否确认删除电极记录编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delElectrodeHistory(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有电极记录数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.exportLoading = true;
          return exportElectrodeHistory(queryParams);
        }).then(response => {
          this.download(response.msg);
          this.exportLoading = false;
        }).catch(() => {});
    }
  }
};
</script>
