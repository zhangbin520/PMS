<template>
  <div class="app-container">
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['mes:electrodeUse:add']"
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
          v-hasPermi="['mes:electrodeUse:edit']"
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
          v-hasPermi="['mes:electrodeUse:remove']"
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
          v-hasPermi="['mes:electrodeUse:export']"
        >导出</el-button>
      </el-col>
      <el-col :span="1.5">

        <el-input placeholder="请输入rfid" v-model="queryParams.rfid" class="input-with-select" clearable @keyup.enter.native="handleQuery">
          <el-button slot="append" icon="el-icon-search" @click="handleQuery"></el-button>
        </el-input>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="electrodeUseList" @selection-change="handleSelectionChange">
      <!-- <el-table-column type="selection" width="55" align="center" /> -->
      <!-- <el-table-column label="电极生产单号" align="center" prop="id" /> -->
      <el-table-column label="状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status==-1" type="danger">报废</el-tag>
          <el-tag v-else-if="scope.row.status==0" type="info">未可用</el-tag>
          <el-tag v-else-if="scope.row.status==1">已使用</el-tag>
          <el-tag v-else-if="scope.row.status==2" type="warning">可降面</el-tag>
          <el-tag v-else-if="scope.row.status==3" type="success">可使用</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="rfid" align="center" prop="rfid" />
      <el-table-column label="物料编码" align="center" prop="materialCode" />
      <el-table-column label="物料名称" align="center" prop="materialName" />
      <el-table-column label="长" align="center" prop="materialLength" />
      <el-table-column label="宽" align="center" prop="materialWidth" />
      <el-table-column label="高" align="center" prop="materialHeight" />
      <el-table-column label="有效高度" align="center" prop="effectiveHeight" />
      <el-table-column label="单位" align="center" prop="materialUnit" />
      <el-table-column label="材质" align="center" prop="texture" />
      <el-table-column label="材质编码" align="center" prop="textureCode" />
      <el-table-column label="密度" align="center" prop="textureDensity" />
      <el-table-column label="重量" align="center" prop="materialWeight" />
      <el-table-column label="数量" align="center" prop="materialNumber" />
      <el-table-column label="电极序号" align="center" prop="eleNo" />
      <el-table-column label="电极生产单号" align="center" prop="eleDispatchNo" />
      <el-table-column fixed="right" label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <!-- <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
          >修改</el-button> -->
          
          <el-button
            v-if="scope.row.status===2"
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleReuse(scope.row)"
          >降面</el-button>
          <el-button
            v-if="scope.row.status===2||scope.row.status===3"
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleDelCondition(scope.row)"
          >报废</el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改电极已用物料对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="electrode_in id" prop="iid">
          <el-input v-model="form.iid" placeholder="请输入electrode_in id" />
        </el-form-item>
        <el-form-item label="electrode_material_consume id" prop="cid">
          <el-input v-model="form.cid" placeholder="请输入electrode_material_consume id" />
        </el-form-item>
        <el-form-item label="electrode_material_id" prop="mid">
          <el-input v-model="form.mid" placeholder="请输入electrode_material_id" />
        </el-form-item>
        <el-form-item label="electrode_mange id" prop="eid">
          <el-input v-model="form.eid" placeholder="请输入electrode_mange id" />
        </el-form-item>
        <el-form-item label="rfid" prop="rfid">
          <el-input v-model="form.rfid" placeholder="请输入rfid" />
        </el-form-item>
        <el-form-item label="物料编码" prop="materialCode">
          <el-input v-model="form.materialCode" placeholder="请输入物料编码" />
        </el-form-item>
        <el-form-item label="物料名称" prop="materialName">
          <el-input v-model="form.materialName" placeholder="请输入物料名称" />
        </el-form-item>
        <!-- <el-form-item label="长" prop="materialLength">
          <el-input v-model="form.materialLength" placeholder="请输入长" />
        </el-form-item>
        <el-form-item label="宽" prop="materialWidth">
          <el-input v-model="form.materialWidth" placeholder="请输入宽" />
        </el-form-item>
        <el-form-item label="高" prop="materialHeight">
          <el-input v-model="form.materialHeight" placeholder="请输入高" />
        </el-form-item>
        <el-form-item label="有效高度" prop="effectiveHeight">
          <el-input v-model="form.effectiveHeight" placeholder="请输入有效高度" />
        </el-form-item>
        <el-form-item label="单位" prop="materialUnit">
          <el-input v-model="form.materialUnit" placeholder="请输入单位" />
        </el-form-item> -->
        <el-form-item label="材质" prop="texture">
          <el-input v-model="form.texture" placeholder="请输入材质" />
        </el-form-item>
        <el-form-item label="材质编码" prop="textureCode">
          <el-input v-model="form.textureCode" placeholder="请输入材质编码" />
        </el-form-item>
        <!-- <el-form-item label="密度" prop="textureDensity">
          <el-input v-model="form.textureDensity" placeholder="请输入密度" />
        </el-form-item>
        <el-form-item label="重量" prop="materialWeight">
          <el-input v-model="form.materialWeight" placeholder="请输入重量" />
        </el-form-item>
        <el-form-item label="数量" prop="materialNumber">
          <el-input v-model="form.materialNumber" placeholder="请输入数量" />
        </el-form-item> -->
        <el-form-item label="电极序号" prop="eleNo">
          <el-input v-model="form.eleNo" placeholder="请输入电极序号" />
        </el-form-item>
        <el-form-item label="电极生产单号" prop="eleDispatchNo">
          <el-input v-model="form.eleDispatchNo" placeholder="请输入电极生产单号" />
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
import { delElectrodeUseCondition,listElectrodeUse, getElectrodeUse, delElectrodeUse, addElectrodeUse, updateElectrodeUse, exportElectrodeUse } from "@/api/jy/electrodeUse";

export default {
  name: "ElectrodeUse",
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
      // 电极已用物料表格数据
      electrodeUseList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        iid: null,
        cid: null,
        mid: null,
        eid: null,
        rfid: null,
        materialCode: null,
        materialName: null,
        materialLength: null,
        materialWidth: null,
        materialHeight: null,
        effectiveHeight: null,
        materialUnit: null,
        texture: null,
        textureCode: null,
        textureDensity: null,
        materialWeight: null,
        materialNumber: null,
        eleNo: null,
        eleDispatchNo: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      }
    };
  },
  activated(){
    this.getList();
  },
  created(){
    this.getList();
  },
  methods: {
    handleRfid(){
      console.log("xxx");
    },
    handleDelCondition(val){
      let _this=this
      this.$confirm('是否确认报废rfid为"' + val.rfid + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
      }).then(function() {
        delElectrodeUseCondition(val.id).then(resp=>{
          _this.getList()
          _this.msgSuccess("报废成功");

        })
      }).catch(() => {});

    },
    /** 查询电极已用物料列表 */
    getList() {
      this.loading = true;
      listElectrodeUse(this.queryParams).then(response => {
        this.electrodeUseList = response.rows;
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
        iid: null,
        cid: null,
        mid: null,
        eid: null,
        rfid: null,
        materialCode: null,
        materialName: null,
        materialLength: null,
        materialWidth: null,
        materialHeight: null,
        effectiveHeight: null,
        materialUnit: null,
        texture: null,
        textureCode: null,
        textureDensity: null,
        materialWeight: null,
        materialNumber: null,
        eleNo: null,
        eleDispatchNo: null,
        createTime: null,
        updateTime: null
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
      this.title = "添加电极已用物料";
    },
    handleReuse(row){
        this.$prompt('请输入降面高度', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /[0-9]+/,
          inputErrorMessage: '只能输入数字'
        }).then(({ value }) => {

          updateElectrodeUse({"id":row.id,"status":3,"materialHeight":value}).then(response => {
            this.msgSuccess("修改成功");
            this.getList();
          });

        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消输入'
          });       
        });
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getElectrodeUse(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改电极已用物料";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateElectrodeUse(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addElectrodeUse(this.form).then(response => {
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
      this.$confirm('是否确认删除电极已用物料编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delElectrodeUse(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有电极已用物料数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.exportLoading = true;
          return exportElectrodeUse(queryParams);
        }).then(response => {
          this.download(response.msg);
          this.exportLoading = false;
        }).catch(() => {});
    }
  }
};
</script>
