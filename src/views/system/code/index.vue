<template>
<div class="app-container">
  <el-row>
    <el-col :span="24">
      <el-table v-loading="loading" :data="codeList">
        <el-table-column label="单据名称" align="center" prop="name"  />
        <el-table-column label="前缀" align="center"  prop="prefix" />
        <el-table-column label="年" align="center"  prop="year">
          <template slot-scope="scope">
            <p v-if="scope.row.year == 0">yyyy</p>
            <p v-if="scope.row.year == 1">yy</p>
          </template>
        </el-table-column>
        <el-table-column label="月" align="center"  prop="month">
          <template slot-scope="scope">
            <p v-if="scope.row.month == 0">MM</p>
          </template>
        </el-table-column>
        <el-table-column label="是否包含日期" align="center"  prop="isDate"  />
        <el-table-column label="流水号位数" align="center"  prop="serialNoDigits"  />
        <el-table-column label="部门代码" align="center"  prop="deptCode"  />
        <el-table-column label="操作" align="center" width="160" class-name="small-padding fixed-width">
          <template slot-scope="scope" v-if="scope.row.userId !== 1">
            <el-button
            size="mini"
            round
            type="warning"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            >编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
     <!--    分页-->
      <el-row>
        <el-col :span="15">
      <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNo"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
      /></el-col>
      </el-row>
      <el-row>
       <el-button
        size="mini"
        type="primary"
        round
        icon="el-icon-check"
        style="margin-left: 45%;margin-top: 20px"
        @click="handleAdd"
      >新增编码规则</el-button>
      </el-row>
      </el-col>
    </el-row>

  <!-- 新增编码规则对话框 -->
  <el-dialog :title="title" :visible.sync="open" width="400px" append-to-body>
    <el-form ref="form" :model="form" :rules="rules" label-width="100px">
          <el-form-item label="单据名称" prop="name">
            <el-input v-model="form.name" placeholder="" />
          </el-form-item>
          <el-form-item label="前缀" prop="prefix">
            <el-input v-model="form.prefix" placeholder="" />
          </el-form-item>
          <el-form-item label="部门代码" prop="deptId">
            <div class="father">
              <treeselect v-model="form.deptId" :options="deptOptions" :normalizer="normalizer" :show-count="true" placeholder="请选择部门" @input="handleDeptChange" @close="handleDeptBlur" >
                <label slot="option-label" slot-scope="{node}">
                  {{node.label}}
                </label>
              </treeselect>
            </div>
          </el-form-item>
          <el-form-item label="数据来源" prop="bizType">
            <el-select v-model="form.bizType" style="width: 100%">
              <el-option
                v-for="dict in dict.type.coding_rules_biz_type"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="年" prop="year">
            <el-radio-group v-model="form.year">
              <el-radio
                v-for="dict in dict.type.code_year"
                :key="dict.value"
                :label="dict.value"
              >{{dict.label}}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="月" prop="month">
            <el-radio-group v-model="form.month">
              <el-radio
                v-for="dict in dict.type.code_month"
                :key="dict.value"
                :label="dict.value"
              >{{dict.label}}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="是否包含日期" prop="isDate">
            <el-radio-group v-model="form.isDate">
              <el-radio
                v-for="dict in dict.type.code_isData"
                :key="dict.value"
                :label="dict.value"
              >{{dict.label}}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="流水号位数" prop="serialNoDigits">
            <el-input v-model="form.serialNoDigits" placeholder="" />
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
  import { listCode,addListCode,updateListCode,getListCode,creatListCode,checkCodingRules } from "../../../api/system/code";
  import {listDept, treeselect} from "../../../api/system/dept";
  import Treeselect from "@riophae/vue-treeselect";
  import "@riophae/vue-treeselect/dist/vue-treeselect.css";


  export default {
    name: "Code",
    dicts: ['sys_normal_disable','code_isData','code_year','code_month','coding_rules_biz_type'],
    components: { Treeselect },
    data() {
      return {
        // 遮罩层
        loading: true,
        // 总条数
        total: 0,
        // 表格树数据
        codeList: [],
        // 部门树选项
        deptOptions: undefined,
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        // 表单参数
        form: {},
        // 查询参数
        queryParams: {
          pageNo: 1,
          pageSize: 10,
          id: 0,
        },
        //编码规则表单校验
        rules: {
          name: [
            { required: true, message: "单据名称不能为空", trigger: "blur" },
            { min: 2, max: 10, message: '单据名称长度必须介于 2 和 10 之间', trigger: 'blur' }
          ],
          prefix: [
            { required: true, message: "前缀不能为空", trigger: "blur" },
            { min: 2,max:5, message: '长度必须大于2小于5', trigger: 'blur' },
            { 
              validator: this.validatePrefixRemote, 
              trigger: ['blur'] 
            }
          ],
          deptId: [
            { required: true, message: "部门代码不能为空", trigger: ['blur', 'change']},
            // 自定义验证规则
            { 
              validator: this.validateDeptRemote, 
              trigger: ['blur', 'change'] 
            }
          ],
          bizType: [
            { required: true, message: "数据来源不能为空", trigger: "blur" },
            { 
              validator: this.validateDeptRemote, 
              trigger: ['blur', 'change'] 
            }
          ],
          year: [
            { required: true, message: "年不能为空", trigger: "blur" },
          ],
          month: [
            { required: true, message: "月不能为空", trigger: "blur" },
          ],
          isDate: [
            { required: true, message: "是否包含日期不能为空", trigger: "blur" },
          ],
          serialNoDigits: [
            { required: true, message: "流水号位数不能为空", trigger: "blur" },
          ],
        },
      };
    },
    created() {
      this.getList();
      this.getTreeselect();
    },
    methods: {
       // 选择值变化时触发验证
      handleDeptChange(newVal) {
        this.$nextTick(() => {
          // 触发 Element UI 的 change 验证
          var uu = this.$refs.form.validateField('bizType');
          if (uu!== undefined) {
            this.$refs.form.validateField('deptId');
          }
          console.log(uu) 
        });
      },
      // 关闭下拉框时触发验证 (模拟 blur)
      handleDeptBlur() {
        this.$nextTick(() => {
          // 触发 Element UI 的 blur 验证
          var uu = this.$refs.form.validateField('bizType');
          if (uu!== undefined) {
            this.$refs.form.validateField('deptId');
          }
        });
      },
      async  validatePrefixRemote(rule, value, callback) {
        
        try {
            // 这里可以添加TYPE  参数来区分是新增还是修改
            const submitData = Object.assign({}, this.form, { type: "2" });
            const res = await checkCodingRules(submitData);
            // 根据Java后端返回的布尔值处理
            if (res.data === false) {
              callback(new Error('前缀已存在，不能重复')); // 验证失败
            } else if (res.data === true) {
              callback(); // 验证通过
            } else {
              callback(new Error('服务器返回数据格式异常'));
            }
        } catch (error) {
          console.error('验证请求失败:', error);
          callback(new Error('校验服务不可用，请稍后重试'));
        }
       
      },
      async  validateDeptRemote(rule, value, callback) {
        try {
          // 这里可以添加TYPE  参数来区分是新增还是修改
            const submitData = Object.assign({}, this.form, { type: "1" });
            const res = await checkCodingRules(submitData);
            // 根据Java后端返回的布尔值处理
            if (res.data === false) {
              callback(new Error('数据已存在，不能重复')); // 验证失败
            } else if (res.data === true) {
              callback(); // 验证通过
            } else {
              callback(new Error('服务器返回数据格式异常'));
            }
          
        } catch (error) {
          console.error('验证请求失败:', error);
          callback(new Error('校验服务不可用，请稍后重试'));
        }
      },
      /** 查询编码规则列表 */
      getList() {
        this.loading = true;
        listCode(this.queryParams).then(response => {
          this.codeList = response.data.records;
          this.total = response.data.total;
          this.loading = false;
        });
      },
      /** 查询部门下拉树结构 */
      getTreeselect() {
        treeselect().then(response => {
          this.deptOptions = response.data;
        });
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
      /** 编辑按钮 */
      handleUpdate(row) {
        this.reset();
        const id = row.id
        getListCode({'id':id}).then(response => {
          this.form = response.data;
          this.open = true;
          this.title = "修改编码规则";
        });
      },
      /** 新增编码规则按钮 */
      handleAdd() {
        this.reset();
        this.open = true;
        this.title = "新增编码规则";
      },
      /** 部门树自定义标签 */
      normalizer(node) {
        return {
          id: node.id,
          label: node.deptCode,
          children: node.children
        }
      },
      /** 新增编码规则提交按钮 */
      submitForm: function() {
        
        this.$refs["form"].validate(valid => {
          
          if (valid) {
            if (this.form.id != undefined) {
              updateListCode(this.form).then(response => {
                this.$modal.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              });
            } else {
              addListCode(this.form).then(response => {
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

