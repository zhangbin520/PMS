<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
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
      <el-form-item label="单位" prop="materialUnit">
        <el-input
          v-model="queryParams.materialUnit"
          placeholder="请输入单位"
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
        >删除</el-button>
      </el-col>
      <!-- <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          :loading="exportLoading"
          @click="handleExport"
        >导出</el-button>
      </el-col> -->
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="electrodeMaterialList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <!-- <el-table-column label="材质编码" align="center" prop="id" /> -->
      <el-table-column label="物料编码" align="center" prop="materialCode" />
      <el-table-column label="物料名称" align="center" prop="materialName" />
      <el-table-column label="长-宽-高" align="center" >
        <template slot-scope="scope">
          {{scope.row.materialLength}}-{{scope.row.materialWidth}}-{{scope.row.materialHeight}}
        </template>
      </el-table-column>
      <el-table-column label="单位" align="center" prop="materialUnit" />
      <el-table-column label="材质" align="center" prop="texture" />
      <el-table-column label="材质编码" align="center" prop="textureCode" />
      <el-table-column label="密度" align="center" prop="textureDensity" />
      <el-table-column label="重量" align="center" prop="materialWeight" />
      <el-table-column label="数量" align="center" prop="materialNumber" />

      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
        <el-popover
          placement="right"
          trigger="click">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleIncome(scope.row)"
          >入库</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleInventory(scope.row)"
          >盘库</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUse(scope.row)"
          >在用物料</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
          >删除</el-button>
          <el-button slot="reference">操作</el-button>
        </el-popover>
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

    <!-- 添加或修改电极物料对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
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

        <el-form-item label="材质编码" prop="textureCode">
          <el-select v-model="form.textureCode" placeholder="请选择材质编码"  @change="handleSelectChange">
            <el-option
              v-for="(item,index) in textureList"
              :key="index"
              :label="item.textureCode"
              :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="材质" prop="texture">
          <el-input v-model="form.texture" placeholder="请输入材质" disabled/>
        </el-form-item>
        <el-form-item label="密度" prop="textureDensity">
          <el-input v-model="form.textureDensity" placeholder="请输入密度" disabled/>
        </el-form-item>
        <!-- <el-form-item label="重量" prop="materialWeight">
          <el-input v-model="form.materialWeight" placeholder="请输入重量" />
        </el-form-item> -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog :title="`${income.materialCode}入库`" :visible.sync="income.showMe" width="500px" append-to-body>
      <el-form :model="income" ref="incomeForm" label-width="100px" class="demo-ruleForm">
        <el-form-item
          label="重量"
          prop="materialWeight"
          :rules="[
            { required: true, message: '重量不能为空'},
            { type: 'number', message: '重量必须为数字值'}
          ]"
        >
          <el-input  v-model.number="income.materialWeight" autocomplete="off">
            <template slot="append">{{income.materialUnit}}</template>
          </el-input>
        </el-form-item>
        <el-form-item
          label="数量"
          prop="materialNumber"
          :rules="[
            { required: true, message: '数量不能为空'},
            { type: 'number', message: '数量必须为数字值'}
          ]"
        >
          <el-input  v-model.number="income.materialNumber" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="doIncome">提交</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog :title="`${useData.materialCode}在用物料`" :visible.sync="useData.showMe" width="80%" append-to-body>
      <electrode-use :materialCode="useData.materialCode">

      </electrode-use>
    </el-dialog>

    <el-dialog :title="`${inventoryData.val.materialCode}盘库重量`" :visible.sync="inventoryData.showMe" width="500px" append-to-body>
      <el-form :model="inventoryData.val" ref="inventoryForm" label-width="100px" class="demo-ruleForm">
        <el-form-item
          label="重量"
          prop="materialWeight"
          :rules="[
            { required: true, message: '重量不能为空'},
            { type: 'number', message: '重量必须为数字值'}
          ]"
        >
          <el-input  v-model.number="inventoryData.val.materialWeight" autocomplete="off">
            <template slot="append">{{inventoryData.val.materialUnit}}</template>
          </el-input>
        </el-form-item>
        <el-form-item
          label="数量"
          prop="materialNumber"
          :rules="[
            { required: true, message: '数量不能为空'},
            { type: 'number', message: '数量必须为数字值'}
          ]"
        >
          <el-input  v-model.number="inventoryData.val.materialNumber" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="doInventory">提交</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import {inventoryElectrodeMaterial, incomeElectrodeMaterial,allTexture,listElectrodeMaterial, getElectrodeMaterial, delElectrodeMaterial, addElectrodeMaterial, updateElectrodeMaterial, exportElectrodeMaterial } from "@/api/jy/electrodeMaterial";
import electrodeUse from '../components/electrodeUse.vue';

export default {
  components: { electrodeUse },
  name: "ElectrodeMaterial",
  data() {
    return {
      inventoryData:{
        showMe:false,
        val:{materialCode:null,}
      },
      useData:{
        showMe:false,
        materialCode:null,
      },
      income:{
        showMe:false,
        data:null,
        materialWeight:null,
        materialNumber:null,
        materialUnit:null,
        materialCode:null,
      },
      textureList:[],
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
      // 电极物料表格数据
      electrodeMaterialList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        materialCode: null,
        materialName: null,
        materialUnit: null,
        texture: null,
        textureCode: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        materialCode: [
          { required: true, message: "物料编码不能为空", trigger: "blur" }
        ],
        materialName: [
          { required: true, message: "物料名称不能为空", trigger: "blur" }
        ],
        materialLength: [
          { required: true, message: "长不能为空", trigger: "blur" }
        ],
        materialWidth: [
          { required: true, message: "宽不能为空", trigger: "blur" }

        ],
        materialHeight: [
          { required: true, message: "高不能为空", trigger: "blur" }

        ],
        materialUnit: [
          { required: true, message: "单位不能为空", trigger: "blur" }
        ],
        texture: [
          { required: true, message: "材质不能为空", trigger: "blur" }
        ],
        textureCode: [
          { required: true, message: "材质编码不能为空", trigger: "blur" }
        ],
        textureDensity: [
          { required: true, message: "密度不能为空", trigger: "blur" }
        ],
      }
    };
  },
  created() {
    this.getList();
    allTexture().then(resp=>{
      this.textureList = resp.data
    })
  },
  methods: {
    handleUse(val){
      this.useData.materialCode = val.materialCode
      this.useData.showMe = true
    },
    doInventory(){
      this.$refs['inventoryForm'].validate((valid) => {
        if (valid) {
          inventoryElectrodeMaterial(this.inventoryData.val).then(resp=>{
            this.$message({
              type: 'success',
              message: '盘库成功'
            });
            this.getList();
            this.inventoryData.showMe = false

          })
        }
      })
    },
    handleInventory(val){
        this.inventoryData.val = Object.assign({},val)
        this.inventoryData.val.materialWeight = null
        this.inventoryData.val.materialNumber = null
        this.inventoryData.showMe = true
        // console.log(this.inventoryData.val);
        // this.$prompt(`请输入盘库重量\(${val.materialUnit}\)`, `${val.materialCode}`, {
        //   confirmButtonText: '确定',
        //   cancelButtonText: '取消',
        //   inputPattern: /[0-9.]/,
        //   inputErrorMessage: '请输入数字'
        // }).then(({ value }) => {
        //   val.materialWeight = value
        //   inventoryElectrodeMaterial(val).then(resp=>{
        //     this.$message({
        //       type: 'success',
        //       message: '盘库成功'
        //     });
        //     this.getList();
        //   })

        // }).catch(() => {     
        // });
    },
    doIncome(){
        this.$refs['incomeForm'].validate((valid) => {
          if (valid) {
            this.income.data.materialWeight = this.income.materialWeight
            this.income.data.materialNumber = this.income.materialNumber
            incomeElectrodeMaterial(this.income.data).then(resp=>{
              this.$message({
                type: 'success',
                message: '入库成功'
              });
              this.income.showMe = false
              this.getList();
            })

          }

        });
    },
    handleIncome(val){
        this.income.data = val
        this.income.materialUnit = val.materialUnit
        this.income.materialCode = val.materialCode
        this.income.showMe = true
    },
    handleSelectChange(val){
      this.form.texture = val.texture
      this.form.textureCode = val.textureCode
      this.form.textureDensity = val.textureDensity
    },
    /** 查询电极物料列表 */
    getList() {
      this.loading = true;
      listElectrodeMaterial(this.queryParams).then(response => {
        this.electrodeMaterialList = response.rows;
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
        createBy: null,
        createTime: null,
        updateBy: null,
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
      this.title = "添加电极物料";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getElectrodeMaterial(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改电极物料";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateElectrodeMaterial(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addElectrodeMaterial(this.form).then(response => {
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
      this.$confirm('是否确认删除电极物料编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delElectrodeMaterial(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有电极物料数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.exportLoading = true;
          return exportElectrodeMaterial(queryParams);
        }).then(response => {
          this.download(response.msg);
          this.exportLoading = false;
        }).catch(() => {});
    }
  }
};
</script>
