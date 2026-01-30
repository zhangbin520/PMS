<template>
  <div class="app-container">
    <div slot="header">
      <el-form :model="queryParams" ref="queryForm" v-show="true" :inline="true"  label-width="90px">
        <el-form-item label="刀具品牌" prop="orderDate">
          <el-input
            v-model="queryParams.name"
            placeholder="请输入刀具品牌"
            clearable
            size="small"
            style="width: 220px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item v-loading="loading" style="padding-left: 35px">
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-row>
      <el-col :span="24">
        <el-table ref="multipleTable" v-loading="loading" :data="brandList" @selection-change="handleSelectionChange"
                  max-height="750px" border highlight-current-row>
          <el-table-column type="selection" width="50" align="center" />
          <el-table-column label="操作" align="center" class-name="small-padding">
            <template slot-scope="scope">
              <el-button
                size="mini"
                round
                type="primary"
                icon="el-icon-edit"
                @click="handleUpdate(scope.row)"
              >编辑</el-button>
            </template>
          </el-table-column>
          <el-table-column label="id" align="center" sortable prop="id" :show-overflow-tooltip="true" />
          <el-table-column label="刀具品牌" align="center" sortable prop="name" :show-overflow-tooltip="true" />
          <el-table-column label="url" align="center" sortable prop="url"  />
        </el-table>
        <div align="center">
          <pagination
            v-show="total>0"
            :total="total"
            :page.sync="queryParams.pageNo"
            :limit.sync="queryParams.pageSize"
            :page-sizes=[10,20,30,50,this.total]
            @pagination="getListBrand"
          />
          <el-row style="margin-top: 30px">
            <el-button
              size="mini"
              round
              type="primary"
              icon="el-icon-check"
              @click="handleAdd"
            >新增刀具品牌</el-button>
            <el-button
              size="mini"
              round
              style="background-color: #FF8294;color: #ffffff"
              icon="el-icon-delete"
              :disabled="multiple"
              @click="handleDelete"
            >删除</el-button>
          </el-row>
        </div>
      </el-col>
    </el-row>

    <!-- 新增刀具 -->
    <el-dialog title="新增刀具品牌" :visible.sync="open" width="550px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="id" prop="id">
              <el-input v-model="form.id" placeholder="请输入id" />
            </el-form-item>
            <el-form-item label="刀具品牌" prop="name">
              <el-input v-model="form.name" placeholder="请输入刀具品牌" />
            </el-form-item>
            <el-form-item label="请求地址" prop="url">
              <el-input v-model="form.url" placeholder="请输入请求地址" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">保 存</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 修改刀具 -->
    <el-dialog title="修改刀具品牌" :visible.sync="open2" width="550px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="id" prop="id">
              <el-input v-model="form.id" placeholder="请输入id" :disabled="true"/>
            </el-form-item>
            <el-form-item label="刀具品牌" prop="name">
              <el-input v-model="form.name" placeholder="请输入刀具品牌" />
            </el-form-item>
            <el-form-item label="请求地址" prop="url">
              <el-input v-model="form.url" placeholder="请输入请求地址" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">保 存</el-button>
        <el-button @click="cancel2">取 消</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import {
  delBatchOrderBomSapItem,
  saveOrUpdateOrderBomSapItem
} from '@/api/order/sapItemNumber'
import {
  delOrderToolCostBrand,
  getOrderToolCostBrandPage,
  saveOrUpdateOrderToolCostBrand
} from '@/api/cncTool/toolBrand'



export default {
  name: 'toolBrand',
  data(){
    return {
      // 遮罩层
      loading: false,
      // 总条数
      total: 0,
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 查询参数
      queryParams: {
        pageNo: 1,
        pageSize: 10,
      },
      // 刀具品牌表格数据
      brandList: [],
      //选中数组
      Ids:[],
      // 表单参数
      form: {},
      //
      open: false,
      open2: false,
      // 是否显示弹出层
      openExport: false,
      //
      //订单BOM表单校验
      rules: {
        name: [
          { required: true, message: "刀具品牌不能为空", trigger: "blur" },
        ],
        url: [
          { required: true, message: "请求地址不能为空", trigger: "blur" },
        ],
      },
    }
  },
  created() {
    this.getListBrand();
  },

  methods:{
    /** 分页查看刀具品牌 */
    getListBrand(){
      this.loading = true
      setTimeout(()=>{
        this.loading = false
      },3000)
      getOrderToolCostBrandPage(this.queryParams).then(response => {
        this.brandList = response.data.records;
        this.total = response.data.total;
        this.loading = false;
      });
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNo = 1;
      this.getListBrand()
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.single = selection.length!=1
      this.code = selection.map(item => item.name);
      this.multiple = !selection.length
      this.ids = selection.map(item => item.id)
    },

    /** 删除按钮操作 */
    handleDelete(row) {
      // 先获取复选框选中的ID
      const ids = row.id || this.ids // 数组[1,2,3]
      const customerCode = this.code;
      this.$modal.confirm('是否确认删除刀具品牌为"' + customerCode + '"的数据项？').then(function() {
        return delOrderToolCostBrand({'ids':ids});
      }).then(() => {
        this.getListBrand();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },

    // 刀具表单重置
    reset() {
      this.form = {
        id: undefined,
        name: undefined,
        url: undefined,
      };
      this.resetForm("form");
    },

    /** 新增刀具品牌按钮 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "新增刀具品牌";
    },

    /** 编辑刀具品牌按钮 */
    handleUpdate(row) {
      let obj = {...row}
      this.form = {...obj}
      this.open2 = true;
    },

    /** 新增修改刀具品牌配置 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          // if (this.form.id != undefined) {
          //   saveOrUpdateOrderToolCostBrand(this.form).then(response => {
          //     this.$modal.msgSuccess("修改成功");
          //     this.open2 = false;
          //     this.getListBrand();
          //   });
          // } else {
            saveOrUpdateOrderToolCostBrand(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.open2 = false;
              this.getListBrand();
            });
          // }
        }
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
      this.getListBrand()
    },
    // 取消按钮
    cancel2() {
      this.open2 = false;
      this.reset();
      this.getListBrand()
    },
  }
}
</script>

