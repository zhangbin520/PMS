<template>
  <div class="app-container">
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
    </el-table>
    
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

  </div>
</template>

<script>
import { listElectrodeUse, getElectrodeUse, delElectrodeUse, addElectrodeUse, updateElectrodeUse, exportElectrodeUse } from "@/api/jy/electrodeUse";

export default {
  name: "ElectrodeUse",
  props:{
    materialCode:String
  },
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
  created() {
    this.getList();
  },
  methods: {
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
  },
  watch:{
    materialCode: {
      // 数据发生变化就会调用这个函数  
        handler(newVal, oldVal) {
          this.queryParams.materialCode=newVal
          this.handleQuery();
        },
        // 立即处理 进入页面就触发
        immediate: true
    }
  }
};
</script>
