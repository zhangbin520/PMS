<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!--组织机构数据-->
      <el-col :span="4" :xs="24">
        <div class="head-container">
      <!-- 组织机构树状图-->
          <el-tree
            :data="deptOptions"
            :props="defaultProps"
            :expand-on-click-node="false"
            :filter-node-method="filterNode"
            ref="tree"
            default-expand-all
            @node-click="handleNodeClick"
          />
        </div>
      </el-col>
      <!--组织机构列表-->
      <el-col :span="20" :xs="24">
        <el-row>
          <el-col :span="15"><i class="el-icon-s-order">根节点下级组织机构</i></el-col>
          <el-col :span="9">
            <el-button
              size="mini"
              round
              type="primary"
              icon="el-icon-plus"
              style="margin-bottom: 10px"
              @click="handleAdd"
            >新增根节点下级机构</el-button>
          </el-col>
        </el-row>
        <el-table  v-if="refreshTable" v-loading="loading" :data="deptList" row-key="deptId"
                   :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
          <el-table-column label="机构代码" align="center" key="deptCode" prop="deptCode"  />
          <el-table-column label="机构名称" align="center" key="name" prop="name" />
          <el-table-column label="机构类型" align="center" key="type" prop="type">
            <template slot-scope="scope">
              <p v-if="scope.row.type == '0'">部门</p>
              <p v-if="scope.row.type == '1'">车间</p>
            </template>
          </el-table-column>
          <el-table-column label="负责人" align="center" key="personName" prop="personName"  />
          <el-table-column label="电话" align="center" key="phone" prop="phone"  />
          <el-table-column label="机构描述" align="center" key="des" prop="des"  />
          <el-table-column label="状态" align="center" key="status_dictText" >
            <template slot-scope="scope">
              <dict-tag :options="dict.type.sys_normal_disable" :value="scope.row.status"/>
            </template>
          </el-table-column>
          <el-table-column label="下级机构数" align="center" prop="rootNodeNo">
          </el-table-column>
          <el-table-column label="操作" align="center" width="160" class-name="small-padding fixed-width">
            <template slot-scope="scope" v-if="scope.row.userId !== 1">
              <el-button size="mini" type="text" icon="el-icon-top" @click="handleAdjustUp(scope.row, scope.$index)"/>
              <el-button size="mini" type="text" icon="el-icon-bottom" @click="handleAdjustDown(scope.row, scope.$index)"/>
              <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)">编辑</el-button>
              <el-button size="mini" type="text" icon="el-icon-top-right" @click="handleAdjustPosition(scope.row)">调整上级</el-button>
              <el-button size="mini" type="text" icon="el-icon-warning-outline" @click="handleBan(scope.row)">
                <span v-if="scope.row.status == 0">禁用</span>
                <span v-else>启用</span>
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <!--组织机构分页组件-->
        <pagination
          v-show="total>0"
          :total="total"
          :page.sync="queryParams.pageNo"
          :limit.sync="queryParams.pageSize"
          @pagination="getList"
        />
      </el-col>
    </el-row>

    <!-- 新增根节点下级机构对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="上级部门">
          <span style="margin-left: 80px" v-if="this.selectId == ''">无</span>
          <span style="margin-left: 80px" v-if="this.selectId == 1">根节点</span>
          <span style="margin-left: 80px" v-if="this.selectId == 1509864359667879938">RiD模具中心</span>
          <span style="margin-left: 80px" v-if="this.selectId == 1509864480962957314">RiD模具中心</span>
          <span style="margin-left: 80px" v-if="this.selectId == 1509864552358400002">RiD模具中心</span>
          <span style="margin-left: 80px" v-if="this.selectId == 1509864619505012738">RiD模具中心</span>
          <span style="margin-left: 80px" v-if="this.selectId == 1509864696223027201">塑模开发部</span>
          <span style="margin-left: 80px" v-if="this.selectId == 1509864753106178050">塑模开发部</span>
          <span style="margin-left: 80px" v-if="this.selectId == 1509864795028246530">塑模开发部</span>
          <span style="margin-left: 80px" v-if="this.selectId == 1509864861159837697">冲模/治具开发部</span>
          <span style="margin-left: 80px" v-if="this.selectId == 1509864931087273985">冲模/治具开发部</span>
          <span style="margin-left: 80px" v-if="this.selectId == 1509864988964474881">冲模/治具开发部</span>
          <span style="margin-left: 80px" v-if="this.selectId == 1509865038851526657">冲模/治具开发部</span>
          <span style="margin-left: 80px" v-if="this.selectId == 1509865112033742849">模具加工部</span>
          <span style="margin-left: 80px" v-if="this.selectId == 1509865164542234625">模具加工部</span>
          <span style="margin-left: 80px" v-if="this.selectId == 1509865222708842498">模具加工部</span>
          <span style="margin-left: 80px" v-if="this.selectId == 1509865274592382977">模具加工部</span>
          <span style="margin-left: 80px" v-if="this.selectId == 1509865326496894977">模具加工部</span>
          <span style="margin-left: 80px" v-if="this.selectId == 1509865373913501698">模具加工部</span>
          <span style="margin-left: 80px" v-if="this.selectId == 1509865444390391809">模具加工部</span>
          <span style="margin-left: 80px" v-if="this.selectId == 1509865492675219457">智能制造/设备维护部</span>
          <span style="margin-left: 80px" v-if="this.selectId == 1509865547599630337">智能制造/设备维护部</span>
          <span style="margin-left: 80px" v-if="this.selectId == 1509865589915963393">智能制造/设备维护部</span>
<!--          <span style="margin-left: 80px" v-if="this.id = 1">根节点</span>-->
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" placeholder="" />
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-select v-model="form.type" placeholder="请选择" style="width: 100%">
            <el-option
              v-for="dict in dict.type.dept_type"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <div v-if="form.type == 1">
        <el-form-item label="统一社会信用代码" prop="socialUnifiedCreditCode">
          <el-input v-model="form.socialUnifiedCreditCode" placeholder="" />
        </el-form-item>
        </div>
        <el-form-item label="部门代码" prop="deptCode">
          <el-input v-model="form.deptCode" placeholder="" />
        </el-form-item>
        <el-form-item label="负责人" prop="personCode">
          <el-select v-model="form.personCode" placeholder="请选择" style="width: 100%">
            <el-option
              v-for="item in superiorForperson"
              :key="item.personNo"
              :label="item.name"
              :value="item.personNo"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="联系电话" prop="phone">
          <el-input v-model="form.phone" placeholder="">
            <span></span>
          </el-input>
        </el-form-item>
        <el-form-item label="描述" prop="des">
          <el-input v-model="form.des" type="textarea" placeholder="" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="open =false">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 调整上级对话框 -->
    <el-dialog :title="adjust.title" :visible.sync="adjust.open" width="500px" append-to-body>
      <el-form ref="formAdjust" :model="formAdjust" :rules="rules" label-width="80px">
        <el-form-item label="部门" prop="deptName">
          <div class="father">
            <treeselect v-model="formAdjust.id" :options="deptOptions" :show-count="true" placeholder="请选择上级部门" />
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFormAdjust">确 定</el-button>
        <el-button @click="adjust.open =false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { listDept,adjustDept,updateDept,listRoot,addDept,adjustDeptPosition,updateDeptstatus } from "../../../api/system/dept";
  import { treeselect } from "../../../api/system/dept";
  import Treeselect from "@riophae/vue-treeselect";
  import "@riophae/vue-treeselect/dist/vue-treeselect.css";
  import {listPerson} from "../../../api/system/person";

  export default {
    name: "Dept",
    dicts: ['dept_type','sys_normal_disable'],
    components: { Treeselect },
    data() {
      return {
        // 遮罩层
        loading: true,
        // 重新渲染表格状态
        refreshTable: true,
        // 总条数
        total: 0,
        // 表格树数据
        deptList: [],
        // 弹出层标题
        title: "",
        //负责人选择
        superiorForperson: [],
        phone:[],
        // 部门树选项
        deptOptions: undefined,
        // 是否显示弹出层
        open: false,
        // 表单参数
        form: {},
        formAdjust:{},
        //选中数组
        parentId:[],
        Id:[],
        //
        selectId:'',
        defaultProps: {
          children: "children",
          label: "label"
        },
        //调整上级表单参数
        adjust: {
          // 是否显示弹出层（用户导入）
          open: false,
          // 弹出层标题（用户导入）
          title: "",
        },
        // 查询参数
        queryParams: {
          pageNo: 1,
          pageSize: 10,
          id: 1,
          isRootNode: 'Y',
        },
        // 查询参数
        personQueryParams: {
          pageNo: 1,
          pageSize: 1000,
          id: 0,
          isRootNode: 'N',
        },
        roleId: '',
        // 新增根节点下级机构表单校验
        rules: {
          name: [
            { required: true, message: "职位类别不能为空", trigger: "blur" },
            { min: 2, max: 10, message: '职位类别长度必须介于 2 和 10 之间', trigger: 'blur' }
          ],
          phone: [
            {
              pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
              message: "请输入正确的联系号码",
              trigger: "blur"
            }
          ]
        },
      };
    },
    watch: {
      // 根据名称筛选部门树
      deptName(val) {
        this.$refs.tree.filter(val);
      }
    },
    created() {
      this.getList();
      this.getTreeselect();
      this.getListPerson();
    },
    methods: {
      /** 查询部门列表 */
      getList() {
        this.loading = true;
        listDept(this.queryParams).then(response => {
          this.deptList = this.handleTree(response.data.records, this.queryParams.deptId);
          this.loading = false;
        });
      },
      /** 查询员工列表 */
      getListPerson() {
        this.loading = true;
        listPerson(this.personQueryParams).then(response => {
          this.superiorForperson = response.data.records;
        });
      },
      /** 查询部门下拉树结构 */
      getTreeselect() {
        treeselect().then(response => {
          this.deptOptions = response.data;
        });
      },
      // 筛选节点
      filterNode(value, data) {
        if (!value) return true;
        return data.label.indexOf(value) !== -1;
      },
      // 节点单击事件
      handleNodeClick(data) {
        // console.log(data.id)
        this.selectId = data.id
        this.queryParams.id = data.id;
        this.parentId = data.id
        this.handleQuery();
      },
      // 组织机构表单重置
      reset() {
        this.form = {
          name: undefined,
        };
        this.resetForm("form");
      },
      /** 组织机构新增按钮操作 */
      handleAdd() {
        this.reset();
        this.open = true;
        this.title = "新增组织机构";
      },
      /** 搜索按钮操作 */
      handleQuery() {
        this.queryParams.pageNo = 1;
        this.queryParams.isRootNode = 'N'
        this.getList();
      },
      /** 根节点按钮  */
      handleRoot() {

      },
      // 上移
      handleAdjustUp(item, index) {
        this.deptList.splice(index - 1, 0, item);
        this.deptList.splice(index + 1, 1);
      },
      // 下移
      handleAdjustDown(item, index) {
        this.deptList.splice(index + 2, 0, item);
        this.deptList.splice(index, 1);
      },
      /** 组织机构编辑按钮操作 */
      handleUpdate(row) {
        this.reset();
        const id = row.id
        listRoot({'id':id}).then(response => {
          this.form = response.data;
          this.open = true;
          this.title = "修改组织机构";
        });
      },
      /** 调整上级按钮操作 */
      handleAdjustPosition(row) {
        this.adjust.open = true
        this.adjust.title = "选择新的上级，若不指定则默认根节点"
        this.Id = row.id
      },
      /** 禁用按钮操作 */
      handleBan(row) {
        const id = row.id
        if(row.status ==0) {
          const status = 1
          updateDeptstatus({'id':id,'status':status}).then(response => {
            this.deptList = response.data.records;
            this.getList();
          })
        } else {
          const status = 0
          updateDeptstatus({'id':id,'status':status}).then(response => {
            this.deptList = response.data.records;
            this.getList();
          })
        }
      },
      /** 新增组织机构提交按钮 */
      submitForm: function() {
        this.$refs["form"].validate(valid => {
          if (valid) {
            if (this.form.id != undefined) {
              updateDept(this.form).then(response => {
                this.$modal.msgSuccess("修改成功");
                this.open = false;
                this.getList();
                this.getTreeselect();
              });
            } else {
                this.form.status = '0';
                this.form.parentId = this.parentId
              addDept(this.form).then(response => {
                this.$modal.msgSuccess("新增成功");
                this.open = false;
                this.getList();
                this.getTreeselect();
              });
            }
          }
        });
      },
      /** 调整上级提交按钮 */
      submitFormAdjust: function() {
        this.$refs["formAdjust"].validate(valid => {
          if (valid){
            if (this.formAdjust.id != undefined) {
              const data = {
                "levelDeptId":this.formAdjust.id,
                "id":this.Id,
              }
              adjustDeptPosition(data).then(response => {
                this.$modal.msgSuccess("调整上级成功");
                this.adjust.open = false;
                this.getList();
                this.getTreeselect();
              });
            }
          }else{
            this.$modal.msgError("表单验证失败,请检查是否输入正确");
          }
        })
      },
    }
  };
</script>
