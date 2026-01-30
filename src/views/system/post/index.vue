<template>
  <div class="app-container">
    <el-row :gutter="10">
      <!--职位类别数据-->
      <el-col :span="6"  align="center">
    <el-table v-loading="loading" :data="typeList" @cell-click="cellHandleClick" highlight-current-row>
      <el-table-column  align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="small"
            circle
            type="primary"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
          ></el-button>
          <el-button
            size="small"
            circle
            type="warning"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
          ></el-button>
        </template>
      </el-table-column>
      <el-table-column label="编号" align="center" prop="id" />
      <el-table-column label="职位类别" align="center" prop="name" />
    </el-table>
        <el-button
          size="mini"
          icon="el-icon-plus"
          style="align: center;margin-top: 20px"
          @click="handleAdd"
        >添加类别</el-button>
      </el-col>
      <!--职位信息数据-->
      <el-col :span="10" align="center">
        <el-table v-loading="loading" :data="postList">
          <el-table-column label="代码" align="center" prop="code" />
          <el-table-column label="类别" align="center" prop="categoryName" />
          <el-table-column label="职位名称" align="center" prop="name" />
          <el-table-column label="级别" align="center" prop="levels" />
          <el-table-column label="描述" align="center" prop="des" />
          <el-table-column align="center" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button
                size="small"
                circle
                type="primary"
                icon="el-icon-edit"
                @click="handleUpdatePost(scope.row)"
              ></el-button>
              <el-button
                size="small"
                circle
                type="warning"
                icon="el-icon-delete"
                @click="handleDeletePost(scope.row)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-button
          size="mini"
          icon="el-icon-plus"
          style="align: center;margin-top: 20px"
          @click="handleAddPost"
        >添加职位</el-button>
        <pagination
          style="margin-right: 8%"
          v-show="totalPost>0"
          :total="totalPost"
          :page.sync="queryParamsPost.pageNo"
          :limit.sync="queryParamsPost.pageSize"
          @pagination="getPost"
        />
      </el-col>
      <!--职位级别数据-->
      <el-col :span="8" align="center">
        <el-table v-loading="loading" :data="levelList">
          <el-table-column label="级别" align="center" prop="levels" />
          <el-table-column label="级别名" align="center" prop="name" />
          <el-table-column label="描述" align="center" prop="des" />
          <el-table-column align="center" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button
                type="primary"
                circle
                size="small"
                icon="el-icon-edit"
                @click="handleUpdateLevel(scope.row)"
              ></el-button>
              <el-button
                type="warning"
                circle
                size="small"
                icon="el-icon-delete"
                @click="handleDeleteLevel(scope.row)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-button v-loading = "loading"
          type="warning"
          size="small"
          plain
          icon="el-icon-download"
          style="margin-top: 20px"
          @click="handleExport"
        >导出</el-button>
        <el-button
          size="mini"
          icon="el-icon-plus"
          style="align: center;margin-top: 20px"
          @click="handleAddLevel"
        >添加类别</el-button>
      </el-col>
    </el-row>
    <!--职位类别分页组件-->
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParamsType.pageNo"
      :limit.sync="queryParamsType.pageSize"
      @pagination="getList"
    />
    <!--职位级别分页组件-->
    <pagination
      v-show="totalLevel>0"
      :total="totalLevel"
      :page.sync="queryParamsLevel.pageNo"
      :limit.sync="queryParamsLevel.pageSize"
      @pagination="getLevel"
    />

    <!-- 添加或修改职位类别对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="职位类别" prop="name">
          <el-input v-model="form.name" placeholder="请输入职位类别" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 添加或修改职位信息对话框 -->
    <el-dialog :title="title" :visible.sync="openPost" width="500px" append-to-body>
      <el-form ref="formPost" :model="formPost" :rules="rules" label-width="80px">
        <el-form-item label="职位名称" prop="name">
          <el-input v-model="formPost.name" placeholder="请输入职位名称" />
        </el-form-item>
        <el-form-item label="所属类别">
          <el-input v-model="formPost.categoryName" placeholder="" />
        </el-form-item>
        <el-form-item label="级别">
          <el-select v-model="formPost.levelId"  placeholder="请选择" style="width: 100%">
            <el-option
              v-for="item in typeLevelForPost"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="描述" prop="des">
          <el-input v-model="formPost.des" type="textarea" placeholder="请输入内容"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFormPost">确 定</el-button>
        <el-button @click="cancelPost">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 添加或修改职位级别对话框 -->
    <el-dialog :title="title" :visible.sync="openLevel" width="500px" append-to-body>
      <el-form ref="formLevel" :model="formLevel" :rules="rulesLevel" label-width="80px">
        <el-form-item label="级别" prop="levels">
          <el-input v-model="formLevel.level" placeholder="请输入职位级别" />
        </el-form-item>
        <el-form-item label="级别名称" prop="name">
          <el-input v-model="formLevel.name" placeholder="请输入职位级别名称" />
        </el-form-item>
        <el-form-item label="描述" prop="des">
          <el-input v-model="formLevel.des" type="textarea" placeholder="请输入内容"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFormLevel">确 定</el-button>
        <el-button @click="cancelLevel">取 消</el-button>
      </div>
    </el-dialog>
<!--    &lt;!&ndash;导出弹出框&ndash;&gt;-->
<!--    <el-dialog :title="title" :visible.sync="openExport" width="400px" append-to-body>-->
<!--      <el-form ref="formExport" :model="form" :rules="rules" label-width="100px">-->
<!--        <span>选择导出列</span>-->
<!--        <el-form-item>-->
<!--          <el-checkbox label="级别" prop="level" v-model="checkList1"></el-checkbox>-->
<!--          <br>-->
<!--          <el-checkbox label="级别名" prop="name" v-model="checkList2"></el-checkbox>-->
<!--          <br>-->
<!--          <el-checkbox label="描述" prop="des" v-model="checkList3"></el-checkbox>-->
<!--        </el-form-item>-->
<!--        <el-button type="primary" @click="submitFormExport" icon="el-icon-download">导出</el-button>-->
<!--        <el-button @click="openExport = false">取 消</el-button>-->
<!--      </el-form>-->
<!--    </el-dialog>-->
  </div>
</template>

<script>
import { typePost,listPost,levelPost, getTypePost,getListPost,getLevelPost, delTypePost,delListPost,delLevelPost,
         addTypePost,addListPost,addLevelPost, updateTypePost,updateListPost,updateLevelPost,exportPost} from "../../../api/system/post";
import global from "../../../store/global";
import { ElMapExportTable } from 'table-excel'

export default {
  name: "Post",
  dicts: ['sys_normal_disable'],
  data() {
    return {
      // 遮罩层
      loading: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      totalPost: 0,
      totalLevel: 0,
      //职位类别数据
      typeList:[],
      // 职位select
      typeListForPost:[],
      // 职位级别select
      typeLevelForPost:[],
      // 岗位表格数据
      postList: [],
      // 级别表格数据
      levelList:[],
      // 弹出层标题
      title: "",
      // 是否显示职位类别弹出层
      open: false,
      // 是否显示职位信息弹出层
      openPost: false,
      // 是否显示职位级别弹出层
      openLevel: false,
      // 是否显示导出框弹出层
      openExport: false,
      // 多选框
      checkList1: true,
      checkList2: true,
      checkList3: true,
      // 单选框
      radio: '1',
      //职位类别ID
      categoryId:[],
      //职位类别名称
      categoryName:[],
      // 职位类别查询参数
      queryParamsType: {
        pageNo: 1,
        pageSize: 10,
        id: undefined,
        name: undefined,
      },
      // 职位信息查询参数
      queryParamsPost: {
        pageNo: 1,
        pageSize: 10,
        levelId: undefined,
        name: undefined,
        code: undefined,
        categoryId: undefined,
      },
      // 职位级别查询参数
      queryParamsLevel: {
        pageSize: 10,
        pageNo: 1,
        id: undefined,
        levels: undefined,
        name: undefined,
        des: undefined,
      },
      // 职位类别表单参数
      form: {},
      // 职位信息表单参数
      formPost: {},
      // 职位级别表单参数
      formLevel: {},
      //导出列表
      sheduleList:[],
      // 职位类别表单校验
      rules: {
        name: [
          { required: true, message: "职位类别不能为空", trigger: "blur" },
          { min: 2, max: 10, message: '职位类别长度必须介于 2 和 10 之间', trigger: 'blur' }
        ],
      },
      // 职位信息表单校验
      rulesPost: {
        name: [
          { required: true, message: "职位名称不能为空", trigger: "blur" },
          { min: 2, max: 10, message: '职位名称长度必须介于 2 和 10 之间', trigger: 'blur' }
        ],
        categoryName: [
          { required: true, message: "所属类别不能为空", trigger: "blur" },
          { min: 2, max: 10, message: '所属类别长度必须介于 2 和 10 之间', trigger: 'blur' }
        ],
        levelName: [
          { required: true, message: "级别不能为空", trigger: "blur" },
          { min: 2, max: 10, message: '级别长度必须介于 2 和 10 之间', trigger: 'blur' }
        ],
        des: [
          { min: 2, max: 500, message: '描述长度必须介于 1 和 500 之间', trigger: 'blur' }
        ],
      },
      // 职位级别表单校验
      rulesLevel: {
        name: [
          { required: true, message: "职位名称不能为空", trigger: "blur" },
          { min: 2, max: 10, message: '职位名称长度必须介于 2 和 10 之间', trigger: 'blur' }
        ],
        levels: [
          { required: true, message: "级别不能为空", trigger: "blur" },
          { min: 1, max: 10, message: '所属类别长度必须介于 1 和 10 之间', trigger: 'blur' }
        ],
        des: [
          { min: 2, max: 500, message: '描述长度必须介于 1 和 500 之间', trigger: 'blur' }
        ],
      }
    };
  },
  created() {
    this.getList();
    this.getLevel();
  },
  methods: {
    /** 查询职位类别列表 */
    getList() {
      this.loading = true;
      typePost(this.queryParamsType).then(response => {
        this.typeList = response.data;
        // this.sheduleList = this.sheduleList.push(this.typeList);
        this.typeListForPost = response.data;
        this.loading = false;
      });
    },
    /** 查询职位信息列表 */
    getPost(result) {
      this.loading = true;
      const categoryId = result
      listPost({'categoryId':categoryId}).then(response => {
        this.postList = response.data.records;
        // this.sheduleList = this.sheduleList.push(this.postList);
        this.totalPost = Number(response.data.total);
        this.loading = false;
      });
    },
    /** 查询职位级别列表 */
    getLevel() {
      this.loading = true;
      levelPost(this.queryParamsLevel).then(response => {
        this.levelList = response.data;
        this.sheduleList = response.data
        this.typeLevelForPost = response.data;
        this.loading = false;
      });
    },
    /** 职位类别表格点击获取职位信息操作 */
    cellHandleClick(row) {
      this.categoryId = row.id
      this.getPost(this.categoryId)
      this.categoryName = row.name
    },
    // 职位类别表单取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 职位信息表单取消按钮
    cancelPost() {
      this.openPost = false;
      this.resetPost();
    },
    // 职位级别表单取消按钮
    cancelLevel() {
      this.openLevel = false;
      this.resetLevel();
    },
    // 职位类别表单重置
    reset() {
      this.form = {
        name: undefined,
      };
      this.resetForm("form");
    },
    // 职位信息表单重置
    resetPost() {
      this.formPost = {
        levelId: undefined,
        name: undefined,
        code: undefined,
        categoryId: undefined,
      };
      this.resetForm("formPost");
    },
    // 职位级别表单重置
    resetLevel() {
      this.formLevel = {
        id: undefined,
      };
      this.resetForm("formLevel");
    },
    /** 职位类别新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加";
    },
    /** 职位信息新增按钮操作 */
    handleAddPost() {
      this.resetPost();
      this.openPost = true;
      this.title = "添加职位";
      this.formPost.categoryName = this.categoryName
    },
    /** 职位级别新增按钮操作 */
    handleAddLevel() {
      this.resetLevel();
      this.openLevel = true;
      this.title = "添加级别";
    },
    /** 职位类别修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id
      getTypePost({'id':id}).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改职位类别";
      });
    },
    /** 职位信息修改按钮操作 */
    handleUpdatePost(row) {
      this.resetPost();
      const code = row.code
      getListPost({'code':code}).then(response => {
        this.formPost = response.data;
        this.openPost = true;
        this.title = "修改职位信息";
      });
    },
    /** 职位级别修改按钮操作 */
    handleUpdateLevel(row) {
      this.resetLevel();
      const id = row.id
      getLevelPost({'id':id}).then(response => {
        this.formLevel = response.data;
        this.openLevel = true;
        this.title = "修改级别信息";
      });
    },
    /** 职位类别提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != undefined) {
            updateTypePost(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addTypePost(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 职位信息提交按钮 */
    submitFormPost: function() {
      this.$refs["formPost"].validate(valid => {
        if (valid) {
          if (this.formPost.id != undefined) {
            this.formPost.categoryId = this.categoryId
            updateListPost(this.formPost).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.openPost = false;
              this.getPost(this.categoryId);
            });
          } else {
            this.formPost.categoryId = this.categoryId
            addListPost(this.formPost).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.openPost = false;
              this.getPost(this.categoryId);
            });
          }
        }
      });
    },
    /** 职位级别提交按钮 */
    submitFormLevel: function() {
      this.$refs["formLevel"].validate(valid => {
        if (valid) {
          if (this.formLevel.id != undefined) {
            updateLevelPost(this.formLevel).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.openLevel = false;
              this.getLevel();
            });
          } else {
            addLevelPost(this.formLevel).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.openLevel = false;
              this.getLevel();
            });
          }
        }
      });
    },
    /** 职位类别删除按钮操作 */
    handleDelete(row) {
      const id = row.id || this.ids
      this.$modal.confirm('是否确认删除职位类别编号为"' + id + '"的数据项？').then(function() {
        return delTypePost({'id':id});
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 职位信息删除按钮操作 */
    handleDeletePost(row) {
      const code = row.code
      this.$modal.confirm('是否确认删除职位类别编号为"' + code + '"的数据项？').then(function() {
        return delListPost({'code':code});
      }).then(() => {
        this.getPost(this.categoryId)
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 职位级别删除按钮操作 */
    handleDeleteLevel(row) {
      const id = row.id
      this.$modal.confirm('是否确认删除职位类别编号为"' + id + '"的数据项？').then(function() {
        return delLevelPost({'id':id});
      }).then(() => {
        this.getLevel();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    // /** 导出按钮操作 */
    // handleExport() {
    //   this.openExport = true;
    // },
    // submitFormExport() {
    //   exportPost(this.queryParamsLevel).then(response => {
    //     window.open(global.host+response.msg)
    //   });
    // },
    /** 导出按钮操作 */
    handleExport() {
      this.loading =true
      this.openExport = true;
      var data = this.sheduleList; // 这里面是数据列表
      const column = [
        { title: "职位级别ID", dataIndex: "id" },
        { title: "级别", dataIndex: "levels" },
        { title: "级别名", dataIndex: "name" },
        { title: "描述", dataIndex: "des" },
        { title: "创建人", dataIndex: "createBy" },
        { title: "创建时间", dataIndex: "createTime" },
        { title: "更新人", dataIndex: "updateBy" },
        { title: "更新时间", dataIndex: "updateTime" },
      ];
      const instance = new ElMapExportTable(
        { column, data },
        { progress: progress => this.percentage = progress },// 进度条回调
      );
      instance.download("职位级别列表").then((data) => {
        this.openExport = false
      });// 导出的文件名
      this.loading = false
    },
  }
};
</script>
