<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="24">
          <el-form :model="queryParams" ref="queryForm" v-show="showSearch">
            <el-form-item>
              <el-input
                v-model="searchName"
                placeholder="物料名称/物料编码"
                clearable
                prefix-icon="el-icon-search"
                style="width: 100%"
                @keyup.enter.native="handleQuery"
              />
            </el-form-item>
          </el-form>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <!--物料数据-->
      <el-col :span="6" :xs="24">
        <div class="head-container">
          <el-row>
            <el-col :span="16"><i class="el-icon-s-order">当前分类：</i></el-col>
            <el-col :span="6">
              <el-button
                type="primary"
                size="small"
                round
                icon="el-icon-refresh-left"
                @click="handleCancel"
                style="margin-bottom: 10px"
              >取消选择</el-button>
            </el-col>
          </el-row>
          <el-tree
            :data="materialOptions"
            :props="defaultProps"
            :expand-on-click-node="false"
            :filter-node-method="filterNode"
            ref="tree"
            default-expand-all
            @node-click="handleNodeClick"
          />
          <el-row>
          <el-button
            size="mini"
            type="warning"
            style="margin-top: 200px;align-content: center"
            icon="el-icon-edit"
            @click="handleUpdate"
          >修改</el-button>
            <el-button
              size="mini"
              type="primary"
              style="margin-top: 200px;align-content: center"
              icon="el-icon-plus"
              @click="handleAdd"
            >新增</el-button>
          </el-row>
        </div>
      </el-col>
      <!--物料数据-->
      <el-col :span="18" :xs="24">
        <el-table  v-if="refreshTable" v-loading="loading" :data="materialList" row-key="id"
                   :tree-props="{children: 'children', hasChildren: 'hasChildren'}" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="50" align="center" />
          <el-table-column label="物料编码" align="center" key="code" prop="code"  />
          <el-table-column label="物料名称" align="center" key="name" prop="name" />
          <el-table-column label="规格" align="center">
            <template slot-scope="scope">
              <p>{{scope.row.length}}*{{scope.row.width}}*{{scope.row.height}}</p>
            </template>
          </el-table-column>
          <el-table-column label="单位" align="center" key="unit" prop="unit"  />
          <el-table-column label="默认仓库" align="center" key="warehouseName" prop="warehouseName"  />
          <el-table-column label="默认库位" align="center" key="warehouseLocationName" prop="warehouseLocationName"  />
          <el-table-column label="库存上限" align="center" key="inventoryCeiling" prop="inventoryCeiling" />
          <el-table-column label="库存下限" align="center" key="inventoryLowerLimit" prop="inventoryLowerLimit" />
        </el-table>
        <pagination
          v-show="total>0"
          :total="total"
          :page.sync="queryParams.pageNo"
          :limit.sync="queryParams.pageSize"
          @pagination="getList"
        />
        <el-row>
          <el-button
            size="mini"
            type="warning"
            style="margin-top: 200px;align-content: center"
            icon="el-icon-edit"
            :disabled="single"
            @click="handleUpdateMaterial"
          >修改</el-button>
          <el-button
            size="mini"
            type="primary"
            style="margin-top: 200px;align-content: center"
            icon="el-icon-plus"
            @click="handleAddMaterial"
          >新增</el-button>
        </el-row>
      </el-col>
    </el-row>

    <!-- 新增物料分类对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="父分类">
              <el-input v-model="Name" placeholder="" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="设置无" prop="parentId" />
          </el-col>
        </el-row>
        <el-row>
          <el-form-item label="分类名称" prop="typeName">
            <el-input v-model="form.typeName" placeholder=""></el-input>
          </el-form-item>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="open = false">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 修改物料分类对话框 -->
    <el-dialog :title="update.title" :visible.sync="update.open" width="500px" append-to-body>
      <el-form ref="formUpdate" :model="formUpdate" :rules="rules" label-width="100px">
          <el-form-item label="分类名称" prop="typeName">
            <el-input v-model="formUpdate.typeName" placeholder=""></el-input>
          </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFormUpdate">确 定</el-button>
        <el-button @click="update.open = false">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 新增物料数据对话框 -->
    <el-dialog :title="titleMaterial" :visible.sync="openMaterial" width="500px" append-to-body>
      <el-form ref="formMaterial" :model="formMaterial" :rules="rulesMaterial" label-width="100px">
       <el-row>
         <el-col :span="12">
           <el-form-item label="物料名称" prop="name">
             <el-input v-model="formMaterial.name" placeholder="" />
           </el-form-item>
           <el-form-item label="物料编码" prop="code">
             <el-input v-model="formMaterial.code" placeholder="" />
           </el-form-item>
           <el-form-item label="单位" prop="unit">
             <el-input v-model="formMaterial.unit" placeholder="" />
           </el-form-item>
           <el-form-item label="品牌" prop="brand">
             <el-input v-model="formMaterial.brand" placeholder="" />
           </el-form-item>
           <el-form-item label="长" prop="length">
             <el-input v-model="formMaterial.length" placeholder="" />
           </el-form-item>
           <el-form-item label="宽" prop="width">
             <el-input v-model="formMaterial.width" placeholder="" />
           </el-form-item>
           <el-form-item label="高" prop="height">
             <el-input v-model="formMaterial.height" placeholder="" />
           </el-form-item>
           <el-form-item label="默认入库仓库" prop="defaultWarehouse">
             <el-select v-model="formMaterial.defaultWarehouse" placeholder="请选择" style="width: 100%" @change="select">
               <el-option
                 v-for="item in wareHouse"
                 :key="item.id"
                 :label="item.name"
                 :value="item.id"
               ></el-option>
             </el-select>
           </el-form-item>
           <el-form-item label="默认供应商" prop="defaultSupplier">
             <el-input v-model="formMaterial.defaultSupplier" placeholder="" />
           </el-form-item>
         </el-col>
         <el-col :span="12">
           <!-- 照片-->
           <AvatarUpload v-model="form.picture" style="margin-left: 50px" />
           <el-form-item label="默认入库库位" prop="defaultLocation">
             <el-select v-model="formMaterial.defaultLocation" placeholder="请选择" style="width: 100%">
               <el-option
                 v-for="item in wareHouseLocation"
                 :key="item.id"
                 :label="item.name"
                 :value="item.id"
               ></el-option>
             </el-select>
           </el-form-item>
           <el-form-item label="分类" prop="typeId">
             <div class="father">
               <treeselect v-model="formMaterial.typeId" :options="materialOptions" :show-count="true" placeholder="请选择物料分类" />
             </div>
           </el-form-item>
         </el-col>
       </el-row>
        <el-row>
          <el-form-item label="备注" prop="remark">
            <el-input v-model="formMaterial.remark" type="textarea" placeholder="" />
          </el-form-item>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFormMaterial">确 定</el-button>
        <el-button @click="openMaterial = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { listMaterial,listMaterialType,getListMaterial,addMaterialType,updateMaterialType,
           addListMaterial,updateListMaterial,enterStorageList} from "../../../api/system/material";
  import Treeselect from "@riophae/vue-treeselect";
  import "@riophae/vue-treeselect/dist/vue-treeselect.css";
  import {listWarehouse, listWareLocation,wareLocationList} from "../../../api/system/warehouse";

  export default {
    name: "Material",
    dicts: ['sys_normal_disable'],
    components: {Treeselect},
    data() {
      return {
        // 遮罩层
        loading: true,
        // 非单个禁用
        single: true,
        // 显示搜索条件
        showSearch: true,
        // 重新渲染表格状态
        refreshTable: true,
        // 总条数
        total: 0,
        //搜索关键词
        searchName: '',
        // 表格树数据
        materialList:[],
        //默认仓库选择
        wareHouse:[],
        //默认库位选择
        wareHouseLocation:[],
        // 弹出层标题
        title: "",
        titleMaterial:'',
        // 部门树选项
        materialOptions:undefined,
        // 是否显示弹出层
        open: false,
        openMaterial: false,
        // 选中数组
        parentId:[],
        Id:[],
        Name:'',
        ids: [],
        wareId:[],
        // 表单参数
        form: {},
        formMaterial: {},
        formUpdate:{},
        defaultProps: {
          children: "children",
          label: "label"
        },
        //修改物料分类表单参数
        update: {
          // 是否显示弹出层（用户导入）
          open: false,
          // 弹出层标题（用户导入）
          title: "",
        },
        // 查询参数
        queryParams: {
          pageNo: 1,
          pageSize: 10,
          id:1,
          typeId:1,
        },
        // 表单校验
        rules: {
          typeName: [
            {required: true, message: "分类名称不能为空", trigger: "blur"},
            {min: 2, max: 20, message: '分类名称长度必须介于 2 和 20 之间', trigger: 'blur'}
          ],
        },
        rulesMaterial: {
          name: [
            {required: true, message: "物料不能为空", trigger: "blur"},
            {min: 2, max: 15, message: '物料长度必须介于 2 和 15 之间', trigger: 'blur'}
          ],
          code: [
            {required: true, message: "物料编码不能为空", trigger: "blur"},
            {min: 2, max: 15, message: '物料编码长度必须介于 2 和 15 之间', trigger: 'blur'}
          ],
          defaultLocation: [
            {required: true, message: "默认入库库位不能为空", trigger: "blur"},
          ],
          typeId: [
            {required: true, message: "分类不能为空", trigger: "blur"},
          ],
        }
      };
    },
    created() {
      this.getList();
      this.getTreeselect();
      this.getListWare();
    },
    methods: {
      /** 获取物料信息列表 */
      getList() {
        this.loading = true;
        listMaterial(this.queryParams).then(response => {
          this.materialList = response.data.records;
          this.total = Number(response.data);
          this.loading = false;
        });
      },
      /** 查询仓库信息列表 */
      getListWare() {
        this.loading = true;
        listWarehouse(this.queryParams).then(response => {
            this.wareHouse = response.data.records;
          });
      },
      /** 仓库表格点击获取基础信息操作 */
      select(val) {
        this.wareId = val
        listWareLocation({'infoId':val}).then(response => {
          this.wareHouseLocation = response.data.records;
        });
      },
      // 物料分类表单重置
      reset() {
        this.form = {
          id: undefined,
          typeName:undefined,
        };
        this.resetForm("form");
      },
      // 物料数据表单重置
      resetMaterial() {
        this.formMaterial = {
          name: undefined,
          code:undefined,
          unit: undefined,
          brand:undefined,
          specification: undefined,
          defaultWarehouse:undefined,
          defaultSupplier: undefined,
          defaultLocation:undefined,
          remark: undefined,
          typeId:undefined,
        };
        this.resetForm("formMaterial");
      },
      /** 查询物料下拉树结构 */
      getTreeselect() {
        listMaterialType().then(response => {
          this.materialOptions = response.data;
        });
      },
      // 筛选节点
      filterNode(value, data) {
        if (!value) return true;
        return data.label.indexOf(value) !== -1;
      },
      // 节点单击事件
      handleNodeClick(data) {
        this.queryParams.typeId = data.id;
        this.Name = data.label
        this.Id = data.id
        this.handleQuery();
      },
      /** 搜索按钮操作 */
      handleQuery() {
        this.queryParams.pageNo = 1;
        this.getList();
      },
      // 多选框选中数据
      handleSelectionChange(selection) {
        this.ids = selection.map(item => item.id);
        this.single = selection.length != 1;
      },
      /** 分类取消选择按钮 */
      handleCancel() {
        this.getTreeselect();
      },
      /** 分类修改按钮 */
      handleUpdate() {
        this.reset();
        this.update.open = true;
        this.update.title = "修改分类";
      },
      /** 分类新增按钮 */
      handleAdd() {
        this.reset();
        this.open = true;
        this.title = "新增分类";
      },
      /** 物料修改按钮 */
      handleUpdateMaterial() {
        this.reset();
        const id = this.ids
        getListMaterial({'id':id[0]}).then(response => {
          this.formMaterial = response.data;
          this.openMaterial = true;
          this.titleMaterial = "修改物料详情";
        });
      },
      /** 物料新增按钮 */
      handleAddMaterial() {
        this.resetMaterial();
        this.openMaterial = true;
        this.titleMaterial = "添加商品";
      },
      /** 新增物料分类提交按钮 */
      submitForm: function () {
        this.$refs["form"].validate(valid => {
          if (valid){
            if(this.Id == ''){
              this.form.parentId = '0'
            }else {
              this.form.parentId = this.Id
            }
            if (this.form.typeName !== undefined) {
              addMaterialType(this.form).then(response => {
                this.$modal.msgSuccess("新增成功");
                this.open = false;
                this.getTreeselect();
              });
            }
          }else{
            this.$modal.msgError("表单验证失败,请检查是否输入正确");
          }
        });
      },
      /** 修改物料分类提交按钮 */
      submitFormUpdate: function () {
        this.$refs["formUpdate"].validate(valid => {
          if (valid){
            const data ={
              "id":this.Id,
              "typeName":this.formUpdate.typeName,
            }
            if (data.typeName !== undefined){
              updateMaterialType(data).then(response => {
                this.$modal.msgSuccess("修改成功");
                this.update.open = false;
                this.getTreeselect();
              });
            }else{
            }
          }else{
            this.$modal.msgError("表单验证失败,请检查是否输入正确");
          }
        });
      },
      /** 物料表格提交按钮 */
      submitFormMaterial: function () {
        this.$refs["formMaterial"].validate(valid => {
          if (valid) {
            if (this.formMaterial.id != undefined) {
              updateListMaterial(this.formMaterial).then(response => {
                this.$modal.msgSuccess("修改成功");
                this.openMaterial = false;
                this.getList();
              });
            } else {
              addListMaterial(this.formMaterial).then(response => {
                this.$modal.msgSuccess("新增成功");
                this.openMaterial = false;
                this.getList();
              });
            }
          }
        });
      },
    },
  };
</script>

<style scoped>

</style>
