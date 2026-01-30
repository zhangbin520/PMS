<template>
  <div class="app-container">
    <el-row>
      <el-col :span="24"><h2 class="el-icon-s-order">文件格式列表</h2></el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-table v-loading="loading" :data="filesList" @selection-change="handleSelectionChange">
          <el-table-column type="index" width="50"/>
          <el-table-column type="selection" width="50" align="center" />
          <el-table-column label="文件后缀名(不含.)" align="center" key="type" prop="type" />
          <el-table-column label="用途" align="center" key="purpose" prop="purpose">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.purpose == 0">订单客户图档</el-tag>
              <el-tag v-if="scope.row.purpose == 1">CAM图档</el-tag>
            </template>
          </el-table-column>
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

    <!-- 新增文件格式对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="400px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="130px">
        <el-form-item label="文件后缀名(不含.)" prop="type">
          <el-input v-model="form.type" placeholder="" />
        </el-form-item>
        <el-form-item label="用途" prop="purpose">
          <el-radio-group v-model="form.purpose">
            <el-radio label="0">订单客户图档</el-radio>
            <el-radio label="1">CAM图档</el-radio>
          </el-radio-group>
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
  import {addFiles, delFiles, listFiles, updateFiles} from "../../../api/system/files";

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
        filesList: [],
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        // 表单参数
        form: {},
        //选中数组
        Ids:[],
        fileId:'',
        // 查询参数
        queryParams: {
          pageNo: 1,
          pageSize: 10,
        },
        //文件格式表单校验
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
      /** 查询文件格式列表 */
      getList() {
        this.loading = true;
        listFiles(this.queryParams).then(response => {
          this.filesList = response.data.records;
          this.total = response.data.total;
          this.loading = false;
        });
      },
      // 文件格式表单重置
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
      /** 编辑文件格式按钮 */
      handleUpdate(row) {
        this.open = true
        this.title = "文件格式编辑"
        this.form = row
        this.fileId = row.id
      },
      /** 新增文件格式按钮 */
      handleAdd() {
        this.reset();
        this.open = true;
        this.title = "新增文件格式";
      },
      /** 删除文件格式按钮 */
      handleDelete() {
        const ids = this.Ids
        this.$modal.confirm('是否确认删除文件格式ID为"' + ids + '"的数据项？').then(function() {
          return delFiles({'ids':ids});
        }).then(() => {
          this.getList();
          this.$modal.msgSuccess("删除成功");
        }).catch(() => {});
      },
      /** 新增文件格式提交按钮 */
      submitForm: function() {
        this.$refs["form"].validate(valid => {
          if (valid) {
            if (this.form.id != undefined) {
              this.form.id = this.fileId
              updateFiles(this.form).then(response => {
                this.$modal.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              });
            } else {
              addFiles(this.form).then(response => {
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

