<template>
  <div class="app-container">
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <span>状态</span>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="primary"
          size="mini"
          @click="handleAll"
        >全部</el-button>
      </el-col>

      <el-col :span="1.5">
        <el-button
          type="primary"
          size="mini"
          @click="handleTreat"
        >待完成</el-button>
      </el-col>

      <el-col :span="1.5">
        <el-button
          type="primary"
          size="mini"
          @click="handleAlready"
        >已完成</el-button>
      </el-col>
    </el-row>

    <el-form ::model="queryParams" ref="queryForm" v-show="showSearch" :inline="true">
      <el-form-item label="单据号" prop="orderNo">
        <el-input
          v-model="queryParams.orderNo"
          placeholder="请输入单据号"
          clearable
          size="small"
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <el-form-item label="日期">
        <el-date-picker
          v-model="dateRange"
          size="small"
          style="width: 240px"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="-"
          placeholder="选择日期"
        ></el-date-picker>
      </el-form-item>

      <el-form-item label="类型" prop="type">
        <el-select v-model="form.type" placeholder="选择类型" clearable size="small">
          <el-option
            v-for="item in type"
            :key="item.typeId"
            :label="item.name"
            :value="item.typeId"
            :disabled="item.status == 1"
          />
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
      </el-form-item>
    </el-form>

    <el-table v-loading="loading" :data="warehousingList">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="类型" prop="type" width="120" />
      <el-table-column label="关联单号" prop="orderNo" width="120" />
      <el-table-column label="时间" align="center" prop="createTime" width="160">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="物料种类" prop="materialTypeId"/>
      <el-table-column label="入库数" prop="receiptQuantity"/>
      <el-table-column label="物料总数" prop="materialTotal"/>
      <el-table-column label="状态" prop="status_dictText" :show-overflow-tooltip="true" />
      <el-table-column label="操作" align="center" width="280" class-name="small-padding fixed-width">
        <template slot-scope="scope" v-if="scope.row.roleId !== 1">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
          >查看详情</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
          >取消入库</el-button>
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

    <el-button
      type="primary"
      plain
      icon="el-icon-plus"
      size="mini"
      @click="handleAdd"
    >新增入库</el-button>

    <!-- 新增入库按钮 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="类型" prop="type">
          <el-input v-model="form.type" placeholder="请输入类型"/>
        </el-form-item>
        <el-form-item label="关联单号" prop="orderNo">
          <el-input v-model="form.orderNo" placeholder="请输入关联单号"/>
        </el-form-item>
        <el-form-item label="物料种类" prop="materialTypeId">
          <el-input v-model="form.materialTypeId" placeholder="请输入物料种类"/>
        </el-form-item>
        <el-form-item label="入库数" prop="receiptQuantity">
          <el-input v-model="form.receiptQuantity" placeholder="请输入入库数"/>
        </el-form-item>
        <el-form-item label="物料总数" prop="materialTotal">
          <el-input v-model="form.materialTotal" placeholder="请输入物料总数"/>
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.status">
            <el-radio label="0">启用</el-radio>
            <el-radio label="1">停用</el-radio>
          </el-radio-group>
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
  import { listWarehousing, getWarehousing, addWarehousing, cancelWarehousing, stockInList ,exportWarehousing } from "../../../api/materials/warehousing"

  export default {
    name: "Warehousing",
    data() {
      return {
        // 遮罩层
        loading: true,
        // 选中数组
        ids: [],
        // 选中数组设备状态
        status: [],
        // 非单个禁用
        single: true,
        // 非多个禁用
        multiple: true,
        // 显示搜索条件
        showSearch: true,
        // 删除传参
        Id:'',
        // 总条数
        total: 0,
        //
        type: [],
        // 角色表格数据
        warehousingList: [],
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        menuExpand: false,
        menuNodeAll: false,
        deptExpand: true,
        deptNodeAll: false,
        // 日期范围
        dateRange: [],
        // 菜单列表
        menuOptions: [],
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          status: undefined,
        },
        // 表单参数
        form: {},
        defaultProps: {
          children: "children",
          label: "label"
        },
        // 表单校验
        rules: {
          type: [
            { required: true, message: "类型不能为空", trigger: "blur" }
          ],
          orderNo: [
            { required: true, message: "关联单号不能为空", trigger: "blur" }
          ],
          materialTypeId: [
            { required: true, message: "物料种类不能为空", trigger: "blur" }
          ],
          receiptQuantity: [
            { required: true, message: "入库数不能为空", trigger: "blur" }
          ],
          materialTotal: [
            { required: true, message: "物料总数不能为空", trigger: "blur" }
          ]
        }
      }
    },
    created() {
      this.getList();
    },
    methods: {
      /** 查询入库列表 */
      getList() {
        this.loading = true;
        listWarehousing(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
          this.warehousingList = response.data.records;
          console.log(response)
          this.total = Number(response.total);
          this.loading = false;
        });
      },
      // 取消按钮
      cancel() {
        this.open = false;
        this.reset();
      },
      /** 搜索按钮操作 */
      handleQuery() {
        this.queryParams.pageNum = 1;
        this.getList();
      },
      // 表单重置
      reset() {
        this.form = {
          type: undefined,
          orderNo: undefined,
          createTime: undefined,
          materialTypeId: undefined,
          receiptQuantity: undefined,
          materialTotal: undefined,
          status: "0",
        };
        this.resetForm("form");
      },
      /** 新增按钮操作 */
      handleAdd() {
        this.reset();
        this.open = true;
        this.title = "新增入库";
      },
      /** 全部按钮操作 */
      handleAll() {
        this.reset();
        this.getList();
      },
      /** 待完成按钮操作 */
      handleTreat() {
        this.reset();
        this.getList();
      },
      /** 待完成按钮操作 */
      handleAlready() {
        this.reset();
        this.getList();
      },
      /** 提交按钮 */
      submitForm: function() {
        this.$refs["form"].validate(valid => {
          if (valid) { addWarehousing(JSON.stringify(this.form)).then(response => {
                this.$modal.msgSuccess("新增成功");
                this.open = false;
                this.getList();
              });
            }
        });
      },
      /** 导出按钮操作 */
      handleExport() {
        this.download('equipment/section/export', {
          ...this.queryParams
        }, `role_${new Date().getTime()}.xlsx`)
      }
    }
  }
</script>
