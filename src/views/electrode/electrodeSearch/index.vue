<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="180px">

      <el-form-item label="rfid" prop="rfid">
        <el-input
          v-model="queryParams.rfid"
          placeholder="请输入rfid"
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
      <el-form-item label="电极序号" prop="eleNo">
        <el-input
          v-model="queryParams.eleNo"
          placeholder="请输入电极序号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['jy:electrodeSearch:add']"
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
          v-hasPermi="['jy:electrodeSearch:edit']"
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
          v-hasPermi="['jy:electrodeSearch:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          :loading="exportLoading"
          @click="handleExport"
          v-hasPermi="['jy:electrodeSearch:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="electrodeSearchList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="状态" align="center" prop="status" >
        <template slot-scope="scope">
          <el-tag v-if='scope.row.status===-3' type="info">待出料</el-tag>
          <el-tag v-else-if='scope.row.status===-2' type="info" effect="dark">待入库</el-tag>
          <el-tag v-else-if='scope.row.status===-1' type="danger">报废</el-tag>
          <el-tag v-else-if="scope.row.status===0" type="success">在库</el-tag>
          <el-tag v-else-if="scope.row.status===1" type="warning">待出库</el-tag>
          <el-tag v-else-if="scope.row.status===2" >已出库</el-tag>
          <el-tag v-else-if="scope.row.status===5" effect="dark">已解绑</el-tag>
          <el-tag v-else type="info"> 未知</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="rfid" align="center" prop="rfid" />
      <el-table-column label="电极生产单号" align="center" prop="eleDispatchNo" />
      <el-table-column label="电极序号" align="center" prop="eleNo" />
      <el-table-column label="电极编号" align="center" prop="electrodeBno" />
      <el-table-column label="位置" align="center" prop="position" />
      <el-table-column label="材质" align="center" prop="material" />
      <!-- <el-table-column label="电极长" align="center" prop="electrodeLength" />
      <el-table-column label="电极宽" align="center" prop="electrodeWidth" />
      <el-table-column label="电极高" align="center" prop="electrodeHeight" /> -->
      <!-- <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['jy:electrodeSearch:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['jy:electrodeSearch:remove']"
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

    <!-- 添加或修改电极搜索对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="状态">
          <el-radio-group v-model="form.status">
            <el-radio label="1">请选择字典生成</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="rfid" prop="rfid">
          <el-input v-model="form.rfid" placeholder="请输入rfid" />
        </el-form-item>
        <el-form-item label="电极生产单号" prop="eleDispatchNo">
          <el-input v-model="form.eleDispatchNo" placeholder="请输入电极生产单号" />
        </el-form-item>
        <el-form-item label="电极序号" prop="eleNo">
          <el-input v-model="form.eleNo" placeholder="请输入电极序号" />
        </el-form-item>
        <el-form-item label="位置" prop="position">
          <el-input v-model="form.position" placeholder="请输入位置" />
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
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listElectrodeSearch, getElectrodeSearch, delElectrodeSearch, addElectrodeSearch, updateElectrodeSearch, exportElectrodeSearch } from "@/api/jy/electrodeSearch";

export default {
  name: "ElectrodeSearch",
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
      showSearch: true,
      // 总条数
      total: 0,
      // 电极搜索表格数据
      electrodeSearchList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        status: null,
        rfid: null,
        eleDispatchNo: null,
        eleNo: null,
        position: null,
        material: null,
        electrodeLength: null,
        electrodeWidth: null,
        electrodeHeight: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      }
    };
  },
  activated() {
    this.getList();
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询电极搜索列表 */
    getList() {
      this.loading = true;
      listElectrodeSearch(this.queryParams).then(response => {
        this.electrodeSearchList = response.rows;
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
        status: 0,
        rfid: null,
        eleDispatchNo: null,
        eleNo: null,
        position: null,
        material: null,
        electrodeLength: null,
        electrodeWidth: null,
        electrodeHeight: null
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
      this.ids = selection.map(item => item.status)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加电极搜索";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const status = row.status || this.ids
      getElectrodeSearch(status).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改电极搜索";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.status != null) {
            updateElectrodeSearch(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addElectrodeSearch(this.form).then(response => {
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
      const statuss = row.status || this.ids;
      this.$confirm('是否确认删除电极搜索编号为"' + statuss + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delElectrodeSearch(statuss);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有电极搜索数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.exportLoading = true;
          return exportElectrodeSearch(queryParams);
        }).then(response => {
          this.download(response.msg);
          this.exportLoading = false;
        }).catch(() => {});
    }
  }
};
</script>
