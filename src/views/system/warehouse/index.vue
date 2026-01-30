<template>
  <div class="app-container">
    <el-row>
      <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
        <el-form-item label="仓库名称" prop="userName">
          <el-input
            v-model="searchName"
            placeholder="请输入仓库名称"
            clearable
            size="small"
            style="width: 240px"
          />
        </el-form-item></el-form>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="12">
        <el-table v-loading="loading" :data="warehouseList.filter(data => !searchName || data.name.toLowerCase().includes(searchName.toLowerCase()))"
                  @cell-click="cellHandleClick" highlight-current-row>
          <el-table-column type="index" width="50" />
          <el-table-column label="仓库名称" align="center"prop="name"  />
          <el-table-column label="排序" align="center" prop="sort" />
          <el-table-column label="状态" align="center" prop="status" >
            <template slot-scope="scope">
              <dict-tag :options="dict.type.warehouse_status" :value="scope.row.status"/>
            </template>
          </el-table-column>
        </el-table>
        <el-row style="margin-top: 10px">
          <el-button
            type="primary"
            size="small"
            round
            icon="el-icon-plus"
            @click="handleAddWarehouse"
            style="margin-bottom: 10px"
          >新增仓库</el-button>
          <el-button
            type="warning"
            size="small"
            round
            icon="el-icon-edit"
            @click="handleUpdateWarehouse()"
            style="margin-bottom: 10px"
          >修改</el-button>
        </el-row>
        <pagination
          v-show="total>0"
          :total="total"
          :page.sync="queryParams.pageNo"
          :limit.sync="queryParams.pageSize"
          @pagination="getListWare"
        />
      </el-col>
      <el-col :span="12">
        <el-table v-loading="loading" :data="wareLocationList" @cell-click="cellHandleClickLocation" highlight-current-row>
          <el-table-column type="index" width="50" />
          <el-table-column label="库位" align="center" prop="name"  />
          <el-table-column label="排序" align="center" prop="sort" />
          <el-table-column label="状态" align="center" prop="status" >
            <template slot-scope="scope">
              <dict-tag :options="dict.type.warehouse_status" :value="scope.row.status"/>
            </template>
          </el-table-column>
        </el-table>
        <el-row style="margin-top: 10px">
          <el-button
            type="primary"
            size="small"
            round
            icon="el-icon-plus"
            @click="handleAddWareLocation"
            style="margin-bottom: 10px"
          >新增库位</el-button>
          <el-button
            type="warning"
            size="small"
            round
            icon="el-icon-edit"
            @click="handleUpdateWareLocation"
            style="margin-bottom: 10px"
          >修改</el-button>
        </el-row>
        <pagination
          v-show="totalLocation>0"
          :total="totalLocation"
          :page.sync="queryParams.pageNo"
          :limit.sync="queryParams.pageSize"
          @pagination="cellHandleClick"
        />
      </el-col>
    </el-row>

    <!-- 添加或修改仓库对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="仓库名称" prop="name">
              <el-input v-model="form.name" placeholder="请输入仓库名称" />
            </el-form-item>
            <el-form-item label="排序" prop="sort">
              <el-input v-model="form.sort" oninput="value=value.replace(/^0|[^0-9]/g,'')" placeholder="" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态" prop="status">
              <el-radio v-model="form.status" :label="0">启用</el-radio>
              <el-radio v-model="form.status" :label="1">停用</el-radio>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 添加或修改库位对话框 -->
    <el-dialog :title="title" :visible.sync="openLocation" width="500px" append-to-body>
      <el-form ref="formLocation" :model="formLocation" :rules="rulesLocation" label-width="80px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="库位名称" prop="name">
              <el-input v-model="formLocation.name" placeholder="请输入库位名称" />
            </el-form-item>
            <el-form-item label="排序" prop="sort">
              <el-input v-model="formLocation.sort" oninput="value=value.replace(/^0|[^0-9]/g,'')" placeholder="" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态" prop="status">
              <el-radio v-model="formLocation.status" :label="0">启用</el-radio>
              <el-radio v-model="formLocation.status" :label="1">停用</el-radio>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFormLocation(formLocation)">确 定</el-button>
        <el-button @click="cancelLocation">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {listWarehouse,listWareLocation,updateWarehouse,addWarehouse,getWarehouse,updateWareLocation,addWareLocation,getWareLocation} from "../../../api/system/warehouse";


export default {
  name: "Warehouse",
  dicts: ['warehouse_status'],
  data() {
    return {
      // 遮罩层
      loading: true,
      // 总条数
      total: 0,
      totalLocation: 0,
      // 弹出层标题
      title: "",
      //单选按钮选中
      radio: '',
      //搜素关键字
      searchName:'',
      // 显示搜索条件
      showSearch: true,
      // 是否显示弹出层
      open: false,
      openLocation: false,
      //仓库信息列表
      warehouseList: [],
      //库位信息列表
      wareLocationList: [],
      // 表单参数
      form: {},
      formLocation: {},
      //传参对象
      _infoId: undefined,
      id:'',
      locationId:'',
      Id:'',
      // 查询参数
      queryParams: {
        pageNo: 1,
        pageSize: 10,
      },
      // 仓库信息表单校验
      rules: {
        name: [
          { required: true, message: "仓库名称不能为空", trigger: "blur" },
          { min: 2, max: 10, message: '仓库名称长度必须介于 2 和 10 之间', trigger: 'blur' }
        ],
        sort: [
          { required: true, message: "排序不能为空", trigger: "blur" },
          { min: 1, max: 10, message: '状态长度必须介于 1 和 10 之间', trigger: 'blur' },
          {
            pattern: /^[1-9]\d*$/,
            message: "请输入正确的排序",
            trigger: "blur"
          }
        ],
        status: [
          { required: true, message: "状态不能为空", trigger: "blur" },
        ],
      },
      rulesLocation: {
        name: [
          { required: true, message: "库位名称不能为空", trigger: "blur" },
          { min: 2, max: 10, message: '库位名称长度必须介于 2 和 10 之间', trigger: 'blur' }
        ],
        sort: [
          { required: true, message: "排序不能为空", trigger: "blur" },
          { min: 1, max: 10, message: '排序长度必须介于 1 和 10 之间', trigger: 'blur' },
          {
            pattern: /^[1-9]\d*$/,
            message: "请输入正确的排序",
            trigger: "blur"
          }
        ],
      },
    }
  },
  created() {
    this.getListWare();
  },
  methods: {
    /** 查询仓库信息列表 */
    getListWare() {
      this.loading = true;
      listWarehouse(this.queryParams).then(response => {
          this.warehouseList = response.data.records;
          if(this.warehouseList.length > 0 ){
            this._infoId = this.warehouseList[0].id
            this.getListWareLocation(this._infoId)
            this.locationId = this._infoId
          }
          this.total = Number(response.data.total);
          this.loading = false;
        }
      );
    },
    /** 仓库表格点击获取基础信息操作 */
    cellHandleClick(row) {
      this.id = row.id
      this.reset()
      this.getListWareLocation(this.id)
      this.locationId = this.id
    },
    /** 查询库位信息列表 */
    getListWareLocation(result) {
      this.queryParams.infoId= result
      listWareLocation(this.queryParams).then(response => {
          this.wareLocationList = response.data.records;
          this.totalLocation = Number(response.data.total);
          this.loading = false;
        }
      );
    },
    /** 库位表格点击获取基础信息操作 */
    cellHandleClickLocation(row) {
      this.Id = row.id
      this.resetLocation()
    },
    // 表单重置
    reset() {
      this.form = {
        id: undefined,
        name: undefined,
        sort: undefined,
        status: undefined,
      };
      this.resetForm("form");
    },
    resetLocation() {
      this.formLocation = {
        id: undefined,
        name: undefined,
        sort: undefined,
        status: undefined,
        infoId: undefined,
      };
      this.resetForm("formLocation");
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    cancelLocation() {
      this.openLocation = false;
      this.resetLocation();
    },
    /** 仓库新增按钮操作 */
    handleAddWarehouse() {
      this.reset();
      this.open = true;
      this.title = "新建仓库";
    },
    /** 库位新增按钮操作 */
    handleAddWareLocation() {
      this.resetLocation();
      this.openLocation = true;
      this.title = "新建库位";
    },
    /** 仓库修改按钮操作 */
    handleUpdateWarehouse() {
      this.reset();
      this.queryParams.id = this.id
      getWarehouse(this.queryParams).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改仓库信息";
      });
    },
    /** 库位修改按钮操作 */
    handleUpdateWareLocation(result) {
      this.resetLocation();
      this.queryParams.id = this.Id
      this.queryParams.infoId = result
      getWareLocation(this.queryParams).then(response => {
        this.formLocation = response.data;
        this.openLocation = true;
        this.title = "修改库位信息";
        this.getListWareLocation(this.id)
      });
    },
    /** 仓库提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != undefined) {
            updateWarehouse(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getListWare();
            });
          } else {
            addWarehouse(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getListWare();
            });
          }
        }
      });
    },
    /** 库位提交按钮 */
    submitFormLocation: function() {
      this.$refs["formLocation"].validate(valid => {
        if (valid) {
          if (this.formLocation.infoId != undefined) {
            updateWareLocation(this.formLocation).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.openLocation = false;
              this.getListWareLocation(this.id);
            });
          } else {
            this.formLocation.infoId = this.locationId
            addWareLocation(this.formLocation).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.openLocation = false;
              this.getListWareLocation(this.id);
            });
          }
        }
      });
    },
  }
}
</script>

