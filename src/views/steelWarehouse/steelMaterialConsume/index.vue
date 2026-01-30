<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择状态" clearable size="small">
          <el-option label="待出" value="0" />
          <el-option label="已出" value="1" />
          <el-option label="料损" value="2" />
        </el-select>
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
      <el-form-item label="模号" prop="moduleNo">
        <el-input
          v-model="queryParams.moduleNo"
          placeholder="请输入模号"
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
      <el-form-item label="rfid" prop="rfid">
        <el-input
          v-model="queryParams.rfid"
          placeholder="请输入rfid"
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
          @click="handleOutcome()"
        >出库</el-button>
      </el-col>
      <!-- <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['jy:electrodeMaterialConsume:add']"
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
          v-hasPermi="['jy:electrodeMaterialConsume:edit']"
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
          v-hasPermi="['jy:electrodeMaterialConsume:remove']"
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
          v-hasPermi="['jy:electrodeMaterialConsume:export']"
        >导出</el-button> 
      </el-col> -->
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="electrodeMaterialConsumeList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <!-- <el-table-column label="材质编码" align="center" prop="id" /> -->
      <el-table-column label="状态" align="center" prop="status" >
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status ===0">待出</el-tag>
          <el-tag v-else-if="scope.row.status ===1"  type="warning">已出</el-tag>
          <el-tag v-else-if="scope.row.status ===2" type="success" >料损</el-tag>
          <el-tag v-else type="info">未知</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="电极序号" align="center" prop="eleNo" />
      <el-table-column label="工件号" align="center" prop="pieceNo" />
      <el-table-column label="模号" align="center" prop="moduleNo" />
      <el-table-column label="工件生产单号" align="center" prop="orderNo" />
      <el-table-column label="电极生产单号" align="center" prop="eleDispatchNo" />
      <el-table-column label="工件版本号" align="center" prop="versionNo" />
      <el-table-column label="物料编码" align="center" prop="materialCode" />
      <el-table-column label="物料名称" align="center" prop="materialName" />
      <el-table-column label="长" align="center" prop="materialLength" />
      <el-table-column label="宽" align="center" prop="materialWidth" />
      <el-table-column label="高" align="center" prop="materialHeight" />
      <el-table-column label="单位" align="center" prop="materialUnit" />
      <el-table-column label="材质" align="center" prop="texture" />
      <el-table-column label="材质编码" align="center" prop="textureCode" />
      <el-table-column label="密度" align="center" prop="textureDensity" />
      <el-table-column label="出货重量" align="center" prop="outWeight" />
      <el-table-column label="实际用量" align="center" prop="actulWeight" />
      <el-table-column label="损耗重量" align="center" prop="lossWeight" />
      <el-table-column label="损耗率" align="center" prop="lossCent" >
        <template slot-scope="scope">
          {{Number(scope.row.lossCent)}}
        </template>
      </el-table-column>
      <el-table-column label="rfid" align="center" prop="rfid" />

      <el-table-column label="操作" fixed="right"  align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <!-- <el-button
            v-if="scope.row.status===0"
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleOutcome(scope.row)"
          >出库</el-button> -->
          <el-button
            v-if="scope.row.status===1"
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleActualcome(scope.row)"
          >实用</el-button>
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
    <!-- 添加或修改电极用料对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="状态">
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
        <el-form-item label="出货重量" prop="outWeight">
          <el-input v-model="form.outWeight" placeholder="请输入出货重量" />
        </el-form-item>
        <el-form-item label="实际用量" prop="actulWeight">
          <el-input v-model="form.actulWeight" placeholder="请输入实际用量" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 出库对话框 -->
    <el-dialog title="出库" :visible.sync="outcome.showMe" width="500px" append-to-body>
      <el-form :model="outcome" ref="outcomeFrom" label-width="150px">
        <el-form-item label="物料编码">{{outcome.materialCode}}</el-form-item>
        <el-form-item label="工件号">{{outcome.pieceNo}}</el-form-item>
        <el-form-item
          prop="rfid"
          label="rfid"
          :rules="[
            { required: true, message: '请输入rfid', trigger: 'blur' },
          ]"
        >
          <el-input v-model="outcome.rfid"></el-input>
        </el-form-item>
        <el-form-item
            prop="materialWeight"
            label="出货重量"
            :rules="[
              { required: true, message: '请输入重量', trigger: 'blur' },
            ]"
          >
          <el-input v-model="outcome.materialWeight"></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="doOutcome">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { actualElectrodeMaterialConsume,outcomeElectrodeMaterialConsume,listElectrodeMaterialConsume, getElectrodeMaterialConsume, delElectrodeMaterialConsume, addElectrodeMaterialConsume, updateElectrodeMaterialConsume, exportElectrodeMaterialConsume } from "@/api/jy/steelMaterialConsume";

export default {
  name: "SteelMaterialConsume",
  data() {
    return {
      outcome:{
        materialCode:"",
        pieceNo:"",
        showMe:false,
        data:[],
        materialWeight:"",
        rfid:""
      },
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
      // 电极用料表格数据
      electrodeMaterialConsumeList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        status: null,
        eleNo: null,
        pieceNo: null,
        moduleNo: null,
        orderNo: null,
        eleDispatchNo: null,
        versionNo: null,
        materialCode: null,
        materialName: null,
        materialLength: null,
        materialWidth: null,
        materialHeight: null,
        materialUnit: null,
        texture: null,
        textureCode: null,
        textureDensity: null,
        outWeight: null,
        actulWeight: null,
        lossWeight: null,
        lossCent: null,
        rfid: null,
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
    handleActualcome(val){

        this.$prompt(`请输入实用数量\(${val.materialUnit}\)`, `${val.materialCode}`, {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /[0-9.]/,
          inputErrorMessage: '请输入数字'
        }).then(({ value }) => {
          val.actulWeight = value
          actualElectrodeMaterialConsume(val).then(resp=>{
            this.$message({
              type: 'success',
              message: '操作成功'
            });
            this.outcome.showMe = false
            this.getList();
          })

        }).catch(() => {     
        });
    },
    computeData(){
      let count = 0
      for (let i = 0; i < this.outcome.data.length; i++) {
        const e = this.outcome.data[i];
        count += Number(e.materialLength) *  Number(e.materialWidth) *  Number(e.materialHeight) *  Number(e.textureDensity) 
      }
      console.log(count);
      for (let i = 0; i < this.outcome.data.length; i++) {
        const e = this.outcome.data[i];
        e.materialWeight = (Number(e.materialLength) *  Number(e.materialWidth) *  Number(e.materialHeight) *  Number(e.textureDensity) / count * this.outcome.materialWeight).toFixed(2)
        e.rfid = this.outcome.rfid
      }

    },
    doOutcome(){

      this.$refs["outcomeFrom"].validate(valid => {
        if (valid) {
          console.log("outcomeFrom");
          this.computeData()
          outcomeElectrodeMaterialConsume(JSON.stringify(this.outcome.data)).then(resp=>{
            this.$message({
              type: 'success',
              message: '出库成功'
            });
            this.outcome.showMe=false
            this.getList();
          })
        }
      })
    },
    handleOutcome(){
      if(this.outcome.data === null||this.outcome.data === undefined ||this.outcome.data.length <=0){
        this.msgError("请选择数据")
        return
      }
      let codeFlag = true;
      let ststusFlag = true;
      let pieceNo = ''
      let materialCode = this.outcome.data[0].materialCode
      for (let i = 0; i < this.outcome.data.length; i++) {
        const e = this.outcome.data[i];

        if(materialCode !== e.materialCode){
          codeFlag = false
          break
        }
        if(0 !== e.status){
          ststusFlag = false
          break
        }
        pieceNo += e.pieceNo +','
      }
      console.log(codeFlag);
      if(!codeFlag){
        this.msgError("物料编码不一致")
        return
      }
      if(!ststusFlag){
        this.msgError("数据需全为待出状态")
        return
      }
      this.outcome.materialCode = materialCode
      this.outcome.pieceNo = pieceNo.substring(0,pieceNo.length-1)
      this.outcome.showMe = true
    },
    /** 查询电极用料列表 */
    getList() {
      this.loading = true;
      listElectrodeMaterialConsume(this.queryParams).then(response => {
        this.electrodeMaterialConsumeList = response.rows;
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
        eleNo: null,
        pieceNo: null,
        moduleNo: null,
        orderNo: null,
        eleDispatchNo: null,
        versionNo: null,
        materialCode: null,
        materialName: null,
        materialLength: null,
        materialWidth: null,
        materialHeight: null,
        materialUnit: null,
        texture: null,
        textureCode: null,
        textureDensity: null,
        outWeight: null,
        actulWeight: null,
        lossWeight: null,
        lossCent: null,
        rfid: null,
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

      this.outcome.data = selection
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加电极用料";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getElectrodeMaterialConsume(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改电极用料";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateElectrodeMaterialConsume(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addElectrodeMaterialConsume(this.form).then(response => {
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
      this.$confirm('是否确认删除电极用料编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delElectrodeMaterialConsume(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有电极用料数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.exportLoading = true;
          return exportElectrodeMaterialConsume(queryParams);
        }).then(response => {
          this.download(response.msg);
          this.exportLoading = false;
        }).catch(() => {});
    }
  }
};
</script>
