<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="盈亏状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择盈亏状态" clearable size="small">
          <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item>
      <el-form-item label="物料编码" prop="materialCode">
        <el-input
          v-model="queryParams.materialCode"
          placeholder="请输入物料编码"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="物料名称" prop="materialName">
        <el-input
          v-model="queryParams.materialName"
          placeholder="请输入物料名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="材质" prop="texture">
        <el-input
          v-model="queryParams.texture"
          placeholder="请输入材质"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="材质编码" prop="textureCode">
        <el-input
          v-model="queryParams.textureCode"
          placeholder="请输入材质编码"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="操作人" prop="createName">
        <el-input
          v-model="queryParams.createName"
          placeholder="请输入操作人"
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
      <!-- <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['jy:electrodeMaterialInventory:add']"
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
          v-hasPermi="['jy:electrodeMaterialInventory:edit']"
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
          v-hasPermi="['jy:electrodeMaterialInventory:remove']"
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
          v-hasPermi="['jy:electrodeMaterialInventory:export']"
        >导出</el-button>
      </el-col> -->
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="electrodeMaterialInventoryList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <!-- <el-table-column label="操作人" align="center" prop="id" /> -->
      <el-table-column label="盈亏状态" align="center" prop="status" >
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status ===0" type="success">盈</el-tag>
          <el-tag v-else-if="scope.row.status ===1"  type="warning">亏</el-tag>
          <el-tag v-else-if="scope.row.status ===2" >平</el-tag>
          <el-tag v-else type="info">未知</el-tag>

        </template>
      </el-table-column>
      <el-table-column label="物料编码" align="center" prop="materialCode" />
      <el-table-column label="物料名称" align="center" prop="materialName" />
      <el-table-column label="长" align="center" prop="materialLength" />
      <el-table-column label="宽" align="center" prop="materialWidth" />
      <el-table-column label="高" align="center" prop="materialHeight" />
      <el-table-column label="单位" align="center" prop="materialUnit" />
      <el-table-column label="材质" align="center" prop="texture" />
      <el-table-column label="材质编码" align="center" prop="textureCode" />
      <el-table-column label="密度" align="center" prop="textureDensity" />
      <el-table-column label="原始重量" align="center" prop="materialWeight" />
      <el-table-column label="盘库重量" align="center" prop="inventoryWeight" />
      <el-table-column label="差值" align="center" prop="subWeight" />
      <el-table-column label="操作人" align="center" prop="createName" />
      <!-- <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['jy:electrodeMaterialInventory:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['jy:electrodeMaterialInventory:remove']"
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

    <!-- 添加或修改电极物料盘库记录对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="盈亏状态">
          <el-radio-group v-model="form.status">
            <el-radio label="1">请选择字典生成</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="物料编码" prop="materialCode">
          <el-input v-model="form.materialCode" placeholder="请输入物料编码" />
        </el-form-item>
        <el-form-item label="物料名称" prop="materialName">
          <el-input v-model="form.materialName" placeholder="请输入物料名称" />
        </el-form-item>
        <el-form-item label="长" prop="materialLength">
          <el-input v-model="form.materialLength" placeholder="请输入长" />
        </el-form-item>
        <el-form-item label="宽" prop="materialWidth">
          <el-input v-model="form.materialWidth" placeholder="请输入宽" />
        </el-form-item>
        <el-form-item label="高" prop="materialHeight">
          <el-input v-model="form.materialHeight" placeholder="请输入高" />
        </el-form-item>
        <el-form-item label="单位" prop="materialUnit">
          <el-input v-model="form.materialUnit" placeholder="请输入单位" />
        </el-form-item>
        <el-form-item label="材质" prop="texture">
          <el-input v-model="form.texture" placeholder="请输入材质" />
        </el-form-item>
        <el-form-item label="材质编码" prop="textureCode">
          <el-input v-model="form.textureCode" placeholder="请输入材质编码" />
        </el-form-item>
        <el-form-item label="密度" prop="textureDensity">
          <el-input v-model="form.textureDensity" placeholder="请输入密度" />
        </el-form-item>
        <el-form-item label="原始重量" prop="materialWeight">
          <el-input v-model="form.materialWeight" placeholder="请输入原始重量" />
        </el-form-item>
        <el-form-item label="盘库重量" prop="inventoryWeight">
          <el-input v-model="form.inventoryWeight" placeholder="请输入盘库重量" />
        </el-form-item>
        <el-form-item label="差值" prop="subWeight">
          <el-input v-model="form.subWeight" placeholder="请输入差值" />
        </el-form-item>
        <el-form-item label="操作人" prop="createName">
          <el-input v-model="form.createName" placeholder="请输入操作人" />
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
import { listElectrodeMaterialInventory, getElectrodeMaterialInventory, delElectrodeMaterialInventory, addElectrodeMaterialInventory, updateElectrodeMaterialInventory, exportElectrodeMaterialInventory } from "@/api/jy/steelMaterialInventory";

export default {
  name: "SteelMaterialInventory",
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
      // 电极物料盘库记录表格数据
      electrodeMaterialInventoryList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        status: null,
        materialCode: null,
        materialName: null,
        texture: null,
        textureCode: null,
        createName: null,
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
  methods: {
    /** 查询电极物料盘库记录列表 */
    getList() {
      this.loading = true;
      listElectrodeMaterialInventory(this.queryParams).then(response => {
        this.electrodeMaterialInventoryList = response.rows;
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
        status: 0,
        materialCode: null,
        materialName: null,
        materialLength: null,
        materialWidth: null,
        materialHeight: null,
        materialUnit: null,
        texture: null,
        textureCode: null,
        textureDensity: null,
        materialWeight: null,
        inventoryWeight: null,
        subWeight: null,
        createBy: null,
        createName: null,
        createTime: null
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
      this.title = "添加电极物料盘库记录";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getElectrodeMaterialInventory(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改电极物料盘库记录";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateElectrodeMaterialInventory(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addElectrodeMaterialInventory(this.form).then(response => {
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
      this.$confirm('是否确认删除电极物料盘库记录编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delElectrodeMaterialInventory(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有电极物料盘库记录数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.exportLoading = true;
          return exportElectrodeMaterialInventory(queryParams);
        }).then(response => {
          this.download(response.msg);
          this.exportLoading = false;
        }).catch(() => {});
    }
  }
};
</script>
