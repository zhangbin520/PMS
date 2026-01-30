<template>
  <div class="app-container">
    <el-row>
      <el-col :span="24"><i class="el-icon-s-order">材质列表</i></el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-table v-loading="loading" :data="qualityList" @selection-change="handleSelectionChange">
          <el-table-column type="index" width="50"/>
          <el-table-column type="selection" width="50" align="center" />
          <el-table-column label="名称" align="center" key="name" prop="name" />
          <el-table-column label="类型" align="center" key="type" prop="type">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.type == 0">钢件</el-tag>
              <el-tag v-if="scope.row.type == 1">电极</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="材质编码" align="center" key="code" prop="code"  />
          <el-table-column label="价格/元/kg" align="center" key="price" prop="price" />
          <el-table-column label="密度/克/cm³" align="center" key="density" prop="density"  />
          <el-table-column label="备注" align="center" key="remark" prop="remark"  />
          <el-table-column label="" align="center" width="160" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="handleUpdate(scope.row)"
              >编辑</el-button>
            </template>
          </el-table-column>
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
            round
            type="primary"
            icon="el-icon-plus"
            @click="handleAdd"
          >新增</el-button>
          <el-button
            size="mini"
            round
            type="danger"
            icon="el-icon-delete"
            @click="handleDelete"
          >删除</el-button>
        </el-row>
      </el-col>
    </el-row>

    <!-- 新增材质配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="400px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" placeholder="" />
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-select v-model="form.type" placeholder="请选择" style="width: 100%">
            <el-option
              v-for="dict in dict.type.quality_type"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="材质编码" prop="code">
          <el-input v-model="form.code" placeholder="" />
        </el-form-item>
        <el-form-item label="价格/元/kg" prop="price">
          <el-input v-model="form.price" placeholder="" />
        </el-form-item>
        <el-form-item label="密度/g/cm³" prop="density">
          <el-input v-model="form.density" placeholder="" />
        </el-form-item>
        <el-form-item label="是否计算成本" prop="isCalc">
          <el-radio-group v-model="form.isCalc">
            <el-radio label="1">是</el-radio>
            <el-radio label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="open = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { listQuality,addQuality,deleteQuality,getListQuality,updateQuality } from "../../../api/system/quality"

  export default {
    name: "Quality",
    dicts: ['sys_normal_disable','quality_type'],
    data() {
      return {
        // 遮罩层
        loading: true,
        // 总条数
        total: 0,
        // 非多个禁用
        multiple: true,
        // 表格树数据
        qualityList: [],
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        // 表单参数
        form: {},
        //选中数组
        Ids:[],
        // 查询参数
        queryParams: {
          pageNo: 1,
          pageSize: 10,
        },
        //材质配置表单校验
        rules: {
          code: [
            { required: true, message: "材质编码不能为空", trigger: "blur" },
            { min: 2, max: 10, message: '材质编码长度必须介于 2 和 10 之间', trigger: 'blur' }
          ],
          name: [
            { required: true, message: "名称不能为空", trigger: "blur" },
            { min: 2, max: 10, message: '名称长度必须介于 2 和 10 之间', trigger: 'blur' }
          ],
        },
      };
    },
    created() {
      this.getList();
    },
    methods: {
      /** 查询材质配置列表 */
      getList() {
        this.loading = true;
        listQuality(this.queryParams).then(response => {
          this.qualityList = response.data.records;
          this.total = response.data.total;
          this.loading = false;
        });
      },
      // 材质配置表单重置
      reset() {
        this.form = {
          code: undefined,
          name: undefined,
        };
        this.resetForm("form");
      },
      // 多选框选中数据
      handleSelectionChange(selection) {
        this.Ids = selection.map(item => item.id);
        this.multiple = !selection.length;
      },
      /** 编辑材质配置按钮 */
      handleUpdate(row) {
        this.reset();
        const id = row.id
        getListQuality({'id':id}).then(response => {
          this.form = response.data;
          console.log(response.data)
          this.open = true;
          this.title = "修改材质配置";
        });
      },
      /** 新增材质配置按钮 */
      handleAdd() {
        this.reset();
        this.open = true;
        this.title = "新增材质配置";
      },
      /** 删除材质配置按钮 */
      handleDelete() {
        const ids = this.Ids
        this.$modal.confirm('是否确认删除材质配置ID为"' + ids + '"的数据项？').then(function() {
          return deleteQuality({'ids':ids});
        }).then(() => {
          this.getList();
          this.$modal.msgSuccess("删除成功");
        }).catch(() => {});
      },
      /** 新增材质配置提交按钮 */
      submitForm: function() {
        this.$refs["form"].validate(valid => {
          if (valid) {
            if (this.form.id != undefined) {
              updateQuality(this.form).then(response => {
                this.$modal.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              });
            } else {
              addQuality(this.form).then(response => {
                this.$modal.msgSuccess("新增成功");
                this.open = false;
                this.getList();
              });
            }
          }
        });
      },
    }
  };
</script>

