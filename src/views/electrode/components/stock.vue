<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="库位名" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入库位名"
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
      <el-col :span="1.5">
        <ana-excel @doAna="doAna"></ana-excel>

      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="stockList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <!-- <el-table-column label="库位名" align="center" prop="id" />
      <el-table-column label="仓库id" align="center" prop="pid" /> -->
      <el-table-column label="库位名" align="center" prop="name" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
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

    <!-- 添加或修改stock对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <!-- <el-form-item label="仓库id" prop="pid">
          <el-input v-model="form.pid" placeholder="请输入仓库id" />
        </el-form-item> -->
        <el-form-item label="库位名" prop="name">
          <el-input v-model="form.name" placeholder="请输入库位名" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog title="Excel解析" :visible.sync="batch.showMe" width="500px" append-to-body>
      <el-table :data="batch.list" >
        <el-table-column  type="index" width="50"/>
        <el-table-column label="库位名" align="center" prop="name" />
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitAna">提 交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { addBatch ,listStock, getStock, delStock, addStock, updateStock, exportStock } from "@/api/jy/stock";
import AnaExcel from '../components/anaExcel.vue';

export default {
  name: "Stock",
  components:{ AnaExcel},

  props:{
    parent:Object
  },
  data() {
    return {
      batch:{
        showMe:false,
        list:[]
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
      // stock表格数据
      stockList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        pid: null,
        name: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      }
    };
  },
  created() {
    this.init();
  },
  methods: {
    submitAna() {
      if(this.batch.list.length<=0){
        this.msgError("解析数据为空,请确认Excel表头为\"库位\"且存在数据");
        return
      }
      let pid = this.batch.pid;
      let list =[]
      this.batch.list.forEach(e=>{
        list.push(e['name'])
      })
      addBatch({pid,list}).then(resp=>{
        this.batch.showMe = false;
        this.getList();
      })
    },
    doAna(list){

      this.batch.list=list
      this.batch.showMe= true
    },
    init(){
      this.form.pid = this.parent.id
      this.batch.pid = this.parent.id
      this.queryParams.pid = this.parent.id
      this.queryParams.pageNum = 1
      this.queryParams.pageSize = 10

      // console.log(this.queryParams);
      this.getList();
    },
    /** 查询stock列表 */
    getList() {
      this.loading = true;
      listStock(this.queryParams).then(response => {
        this.stockList = response.rows;
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
        name: null
      };
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.queryParams.pageNum = 1
      this.queryParams.pageSize = 10
      this.queryParams.name = null
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
      this.title = "添加库位";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getStock(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改库位";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          
          if (this.form.id != null) {
            updateStock(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            this.form.pid = this.parent.id
            addStock(this.form).then(response => {
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
      this.$confirm('是否确认删除stock编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delStock(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有stock数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.exportLoading = true;
          return exportStock(queryParams);
        }).then(response => {
          this.download(response.msg);
          this.exportLoading = false;
        }).catch(() => {});
    }
  },
  watch: {
    parent: {
      handler (newVal,oldVal) {
        this.init();
      },
      deep: true
    }
  }
};
</script>
