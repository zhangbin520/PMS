<template>
  <div class="app-container">
    <el-card>
      <div slot="header">
      <el-form :model="queryParams" ref="queryForm" v-show="showSearch" :inline="true">
      <el-form-item label="代码" prop="code">
        <el-input
          v-model="queryParams.code"
          placeholder="请输入代码"
          clearable
          size="small"
          style="width: 220px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <el-form-item label="工序名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入工序名称"
          clearable
          size="small"
          style="width: 220px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <el-form-item label="群组设备数量" prop="groupDevicesNum">
        <el-input
          v-model="queryParams.groupDevicesNum"
          placeholder="请输入群组设备数量"
          clearable
          size="small"
          style="width: 220px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="选择状态" style="width: 220px"  clearable size="small">
          <el-option
            v-for="dict in dict.type.process_man_hour_status"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
      </el-form-item>
    </el-form>
      </div>
      <div>
    <el-row :gutter="10">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
        >新增工序</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-circle-check"
          size="mini"
          :disabled="multiple"
          @click="handleOn"
        >启用工序</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-circle-close"
          size="mini"
          :disabled="multiple"
          @click="handleOff"
        >停用工序</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
        >删除工序</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
        >导出</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          size="mini"
          @click="handleSetting"
        >设置工件类型</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          size="mini"
          icon="el-icon-edit"
          @click="handleSettingGroup"
        >设置工艺组</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          size="mini"
          icon="el-icon-s-order"
          @click="handleSettingList"
        >查看工艺组</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>
      </div>
    </el-card>
    <el-card>
    <el-table v-loading="loading" :row-key="getRowKeys" :data="processList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" :reserve-selection="true" width="100" align="center" />
      <el-table-column label="代码" prop="code" width="120" />
      <el-table-column label="工序名称" prop="name" :show-overflow-tooltip="true" />
      <el-table-column label="工序类别" prop="operationCategory" :show-overflow-tooltip="true" />
      <el-table-column label="工件类型" prop="workpieceTypeName" :show-overflow-tooltip="true" />
      <el-table-column label="平均单价元/小时" prop="unitPrice" :show-overflow-tooltip="true" />
      <el-table-column label="群组设备数量" prop="groupDevicesNum" :show-overflow-tooltip="true" />
      <el-table-column label="是否外发" prop="isOutgoing" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.isOutgoing === '0'" type="danger">否</el-tag>
          <el-tag v-if="scope.row.isOutgoing === '1'">是</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="是否强制报工" prop="isForce" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.isForce === '0'" type="danger">否</el-tag>
          <el-tag v-if="scope.row.isForce === '1'">是</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="启停" prop="status_dictText" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status === '1'" type="danger">停用</el-tag>
          <el-tag v-if="scope.row.status === '0'">启用</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope" v-if="scope.row.roleId !== 1">
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
    </el-card>

    <!-- 添加或修改工艺对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="550px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="工序代码" prop="code">
          <el-input v-model="form.code" placeholder="请输入代码"/>
        </el-form-item>
        <el-form-item label="工序名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入工序名称"/>
        </el-form-item>
        <el-form-item label="工价/元/小时" prop="unitPrice">
          <el-input v-model="form.unitPrice" placeholder="请输入工价"/>
        </el-form-item>
        <el-form-item label="工序状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio label="0">启用</el-radio>
            <el-radio label="1">停用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="设备群组数量" prop="groupDevicesNum">
          <el-input v-model="form.groupDevicesNum" placeholder="请输入数量"/>
        </el-form-item>
        <el-form-item label="选择工件类型" prop="workpieceTypeName">
          <el-select v-model="form.workpieceTypeId" filterable placeholder="选择工件类型" clearable size="small">
            <el-option
              v-for="item in typeNameOptions"
              :key="item.id"
              :label="item.typeName"
              :value="item.id"
              :disabled="item.status == 1"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="工序类别" prop="operationCategory">
          <el-radio-group v-model="form.operationCategory">
            <el-radio label="CNC">CNC编程</el-radio>
            <el-radio label="WE">WE编程</el-radio>
            <el-radio label="EDM">EDM编程</el-radio>
            <el-radio label="">无</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否外发" prop="isOutgoing">
          <el-radio-group v-model="form.isOutgoing">
            <el-radio label="0">否</el-radio>
            <el-radio label="1">是</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否强制报工" prop="isForce">
          <el-radio-group v-model="form.isForce">
            <el-radio label="0">否</el-radio>
            <el-radio label="1">是</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 设置工件类型 -->
    <el-dialog :title="title" :visible.sync="openSetting" width="500px" append-to-body>
        <el-table v-loading="loading" :data="settingList" @selection-change="handleSelectionChange">
          <el-table-column label="工件类型" prop="typeName"/>
          <el-table-column label="图档格式" prop="drawingFile"/>
          <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
            <template slot-scope="scope" v-if="scope.row.roleId !== 1">
              <el-button
                type="danger"
                plain
                icon="el-icon-delete"
                size="mini"
                @click="workpieceDelete(scope.row.id,scope.row.typeName)"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="workpieceTypeAdd"
        >新增</el-button>
      <el-button @click="cancelSetting">取 消</el-button>
    </el-dialog>

    <!--新增工件类型-->
    <el-dialog :title="title" :visible.sync="openSettingAdd" width="400px" append-to-body>
      <el-form ref="formSettingAdd" :model="form" :rules="rulesWorkpieceType" label-width="100px">
        <el-form-item label="工件类型名" prop="typeName">
          <el-input v-model="form.typeName" placeholder="请输入工件类型"/>
        </el-form-item>
        <el-form-item label="图档格式" prop="drawingFile">
          <el-input v-model="form.drawingFile" placeholder="请输入图档格式"/>
        </el-form-item>
        <el-button type="primary" @click="submitFormSetting">确 定</el-button>
        <el-button @click="cancelSettingAdd">取 消</el-button>
      </el-form>
    </el-dialog>

<!--    &lt;!&ndash;导出&ndash;&gt;-->
<!--    <el-dialog :title="title" :visible.sync="openExport" width="400px" append-to-body>-->
<!--      <el-form ref="formExport" :model="form" :rules="rules" label-width="100px">-->
<!--        <el-form-item label="选择导出范围">-->
<!--        <el-radio v-model="radio" label="1" @change="radioChange">当前页</el-radio>-->
<!--        <el-radio v-model="radio" label="2" @change="radioChange">全部记录</el-radio>-->
<!--        </el-form-item>-->
<!--        <el-form-item label="选择导出列">-->
<!--          <el-checkbox-group v-model="checkList" @change="handleChecked">-->
<!--            <el-checkbox v-for="(val, key) in records" :label="key" style="display:block" checked="checked">{{val}}</el-checkbox>-->
<!--          </el-checkbox-group>-->

<!--        </el-form-item>-->
<!--        <el-button type="primary" @click="submitFormExport" icon="el-icon-download">导出</el-button>-->
<!--        <el-button @click="cancelExport">取 消</el-button>-->
<!--      </el-form>-->
<!--    </el-dialog>-->

    <!--设置工艺群组对话框-->
    <el-dialog v-el-drag-dialog :title="title" :visible.sync="openSettingGroup" width="600px" append-to-body>
      <el-card>
        <div>
          <elx-editable v-loading="loading" ref="editable" :data.sync="settingGroupList">
            <elx-editable-column label="工序代码" prop="code"/>
            <elx-editable-column label="工序名称" prop="name"/>
            <elx-editable-column prop="workHour" align="center" label="工时" type="default" :edit-render="{name: 'ElInputNumber'}"></elx-editable-column>
            <elx-editable-column label="平均单价 元/小时" prop="unitPrice"/>
          </elx-editable>
        </div>
      </el-card>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitGroupCon" icon="el-icon-check">确 定</el-button>
        <el-button @click="cancelSettingGroup">取 消</el-button>
      </div>
    </el-dialog>

    <!--保存-设置工艺群组名称对话框-->
    <el-dialog v-el-drag-dialog :title="title" :visible.sync="openSettingGroupPre" width="400px" append-to-body>
      <el-form ref="form" :model="form" :rules="rulesWorkpieceType" label-width="100px">
        <el-form-item label="工艺群组名称" prop="groupName">
          <el-input v-model="form.groupName" placeholder="请输入群组名称"/>
        </el-form-item>
        <el-form-item label="选择工件类型" prop="workpieceTypeName">
          <el-select v-model="form.workpieceTypeId" @change="WorkpieceTypeSelect" placeholder="选择工件类型" clearable size="small">
            <el-option
              v-for="item in typeNameOptions"
              :key="item.id"
              :label="item.typeName"
              :value="item.id"
              :disabled="item.status == 1"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitGroupPre">保 存</el-button>
        <el-button @click="cancelSettingGroupPre">取 消</el-button>
      </div>
    </el-dialog>

    <!--查看工艺组对话框（工艺组名称、功序列表）-->
    <el-dialog v-el-drag-dialog :visible.sync="openSettingGroupBB" width="1000px" append-to-body>
      <el-row :gutter="20">
        <el-col :span="10">
          <el-card>
            <div slot="header">
              <span>工艺组名称:</span>
            </div>
            <div>
              <el-table v-loading="loading" :data="settingGroupListBB" @row-click="handleDisplay">
                <el-table-column label="工件类型ID" prop="workpieceTypeId" v-if="show"/>
                <el-table-column label="工艺名称" prop="groupName"/>
                <el-table-column label="工件类型" prop="workpieceTypeName"/>
                <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                  <template slot-scope="scope">
                    <el-button
                      type="danger"
                      plain
                      icon="el-icon-delete"
                      size="mini"
                      @click="handleDelGroup(scope.row)"
                    >删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-card>
        </el-col>
        <el-col :span="14">
          <el-card>
            <div slot="header">
              <span>工序列表:<el-tag>{{groupName}}</el-tag></span>
            </div>
            <div>
              <elx-editable v-loading="loading" ref="editable" :data.sync="settingGroupListDD">
                <elx-editable-column label="工序代码" prop="code"/>
                <elx-editable-column label="单价" prop="unitPrice"/>
                <elx-editable-column prop="workHour" align="center" label="工时" type="default" :edit-render="{name: 'ElInputNumber'}"></elx-editable-column>
                <elx-editable-column label="操作" align="center" class-name="small-padding fixed-width">
                  <template slot-scope="scope">
                    <el-button
                      type="danger"
                      plain
                      icon="el-icon-delete"
                      size="mini"
                      @click="handleDelProcess(scope.row)"
                    >删除</el-button>
                  </template>
                </elx-editable-column>
              </elx-editable>
            </div>
          </el-card>
          <el-card>
            <el-button type="primary" icon="el-icon-plus" style="margin-left: 150px" @click="handleGroupAddProcess">增加工序</el-button>
            <el-button type="primary"  @click="handleSave">保存</el-button>
          </el-card>
        </el-col>
      </el-row>
    </el-dialog>

    <!--增加工序对话框-->
    <el-dialog v-el-drag-dialog :title="title" :visible.sync="openGroupAddProcess" width="400px" append-to-body>
      <el-form ref="form" :model="form"  label-width="100px">
        <el-form-item label="选择工序" prop="code">
          <el-select v-model="form.code" placeholder="选择工序" @change="codeSelect" clearable size="small">
            <el-option
              v-for="item in codeOptions"
              :key="item.id"
              :label="item.code"
              :value="item.id"
              :disabled="item.status == 1"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitGroupProcess">保 存</el-button>
        <el-button @click="cancelGroupProcess">取 消</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import {
  listProcess,
  getProcess,
  delProcess,
  addProcess,
  addWorkpieceType,
  updateProcess,
  changeProcessStatus,
  exportProcess,
  getProcessWorkpieceType,
  delWorkpieceType,
  setProcessGroup,
  getGroupPage,
  delGroup,
  getGroupProcessPage,
  delAProcess,
  editGroupAddProcess, editProcessGroup
} from '../../../api/system/process'

  import global from '../../../store/global.js'
  import { ElMapExportTable } from 'table-excel'

  export default {
    name: "Process",
    dicts: ['process_man_hour_status'],
    data() {
      return {
        ceshi:null,
        groupCode: "",
        // 工艺组名称展示
        groupName: "",
        processManHourIds: [],
        getRowKeys(row) {
          return row.id;
        },
        multipleSelection: [],   // 当前页选中的数据
        checkList: [],
        records: {
          code: "代码",
          name: "工序名称",
          operationCategory: "工序类别",
          workpieceTypeName: "工件类型",
          unitPrice: "平均单价元/小时",
          groupDevicesNum: "群组设备数量",
          status: "启停"
        },
        show: "",
        // 单选框
        radio: '1',
        // 遮罩层
        loading: true,
        // 选中数组
        ids: [],
        // 工件类型删除id
        id: [],
        // 选中数组代码
        codes: [],
        // 选中数组设备状态
        status: [],
        // 工件类型名称
        typeName: [],
        // 非单个禁用
        single: true,
        // 非多个禁用
        multiple: true,
        // 显示搜索条件
        showSearch: true,
        // 删除传参
        Id:'',
        workpieceId: [],
        // 总条数
        total: 0,
        // 工价工时表格数据
        processList: [],
        // 工件类型表格数据
        settingList: [],
        // 工艺组表格数据
        settingGroupList: [],
        // 工艺组名称表格数据
        settingGroupListBB: [],
        // 工序列表表格数据
        settingGroupListDD: [],
        // 设置工件类型数据
        workpieceTypeList: [],
        // 设置工件类型Id
        workpieceTypeId: undefined,
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        openSetting: false,
        openSettingAdd: false,
        openExport: false,
        openSettingGroup: false,
        openSettingGroupPre: false,
        openSettingGroupBB: false,
        openGroupAddProcess: false,
        // 日期范围
        dateRange: [],
        // 设置工件类型
        typeNameOptions: [],
        checkedOptions: [],
        codeOptions: [],
        // 菜单列表
        menuOptions: [],
        //导出列表
        sheduleList:[],
        // 查询参数
        queryParams: {
          pageNo: 1,
          pageSize: 10,
          roleName: undefined,
          roleKey: undefined,
          status: undefined,
          deptName: undefined,
          department: undefined,
          deptId: undefined,
          groupCode: undefined,
          typeName: undefined,
          operationCategory: undefined,
          groupName: undefined,
          drawingFile: undefined,
        },
        queryManHourParams:{
          code: undefined,
          columns: [],
          groupDevicesNum: undefined,
          isAll: 1,
          name: undefined,
          operationCategory: undefined,
          pageNo: 1,
          pageSize: 10,
          status: undefined,
          unitPrice: undefined,
          workpieceTypeId: undefined,
          workpieceTypeName: undefined,
          typeName: undefined,
        },
        groupCodeFirst:'',
        // 表单参数
        form: {},
        formSetting: {},
        formSettingAdd: {},
        defaultProps: {
          children: "children",
          label: "label"
        },
        // 表单校验
        rules: {
          code: [
            { required: true, message: "工序代码不能为空", trigger: "blur" },
            {
              pattern: /[a-zA-z]$/,
              message: "工序代码不符合要求",
              trigger: "blur"
            }
          ],
          name: [
            { required: true, message: "工序名称不能为空", trigger: "blur" }
          ],
          unitPrice: [
            { required: true, message: "工价不能为空", trigger: "blur" },
            {
              pattern: /^[0-9]*$/,
              message: "平均单价不符合要求",
              trigger: "blur"
            }
          ],
          groupDevicesNum: [
            {
              pattern: /^[0-9]*$/,
              message: "群组设备数量不符合要求",
              trigger: "blur"
            }
          ],
          status: [
            { required: true, message: "状态不能为空", trigger: "blur" }
          ],
          department: [
            { required: true, message: "所属部门不能为空", trigger: "blur" }
          ],
        }
        ,
        // 表单校验
        rulesWorkpieceType: {
          typeName: [
            {
              required: true,
              message: "工序类型名称不能为空",
              trigger: "blur"
            },
            {
              pattern: /^[A-Za-z0-9\u4e00-\u9fa5]{2,10}$/,
              message: "工序类型名称不能为空2~10个字符",
              trigger: "blur"
            }
          ]
        },
      }
    },
    created() {
      this.getList();
    },
    methods: {
      /** 查询工价工时列表 */
      getList() {
        this.loading = true;
        listProcess(this.queryParams).then(response => {
          this.processList = response.data.records;
          this.sheduleList = response.data.records;
          this.total = Number(response.data.total);
          this.loading = false;
        });
      },
      /** 查询工件类型 */
      getSetting() {
        this.loading = true;
        this.queryParams.pageNo = 1;
        this.getList();
        getProcessWorkpieceType(this.queryParams).then(response => {
          this.settingList = response.data.records;
          this.id = response.data.records.id;
          this.loading = false;
        });
      },

      /** 查询工艺组列表 */
      getSettingGroup() {
        this.loading = true;
        getGroupPage(this.queryParams).then(response => {
          this.settingGroupListBB = response.data.records;
          this.loading = false;
        })
      },

      /** 分页查询工艺组工艺列表 */
      getSettingGroupListBB() {
        this.loading = true;
        getGroupProcessPage(this.queryParams).then(response => {
          this.settingGroupListDD = response.data.records;
          this.loading = false;
        })
      },

      // 取消按钮
      cancel() {
        this.open = false;
        this.reset();
      },
      cancelSetting() {
        this.openSetting = false;
        this.resetSetting();
      },
      cancelSettingAdd() {
        this.openSettingAdd = false;
        this.resetSetting();
      },
      cancelExport() {
        this.openExport = false;
        this.resetSetting();
      },
      cancelSettingGroup() {
        this.openSettingGroup = false;
      },
      cancelSettingGroupPre() {
        this.openSettingGroupPre = false;
      },
      cancelGroupProcess() {
        this.openGroupAddProcess = false;
      },
      /** 搜索按钮操作 */
      handleQuery() {
        this.queryParams.pageNo = 1;
        this.getList();
      },
      // 表单重置
      reset() {
        this.form = {
          unitPrice: undefined,
          code: undefined,
          name: undefined,
          createBy: undefined,
          createTime: undefined,
          typeName: undefined,
          groupName: undefined,
          operationCategory: undefined,
          groupDevicesNum: undefined,
          id: undefined,
          updateBy: undefined,
          updateTime: undefined,
          status: "0",
          workpieceTypeName: undefined,
          workpieceTypeId: undefined,
          drawingFile: undefined,
        };
        this.resetForm("form");
      },
      // 工件类型表单重置
      resetSetting() {
        this.formSetting = {
          dataScope: undefined,
          name: undefined,
          orderBy: undefined,
          typeName: undefined,
          workpieceTypeName: undefined,
          workpieceTypeId: undefined
        };
        this.resetForm("formSetting");
      },
      // 新增工件类型表单重置
      resetSettingAdd() {
        this.formSetting = {
          dataScope: undefined,
          name: undefined,
          orderBy: undefined,
          typeName: undefined,
          workpieceTypeName: undefined,
          workpieceTypeId: undefined
        };
        this.resetForm("formSettingAdd")
      },
      // 多选框选中数据
      handleSelectionChange(selection) {
        this.processManHourIds = selection.map(item => item.id)
        this.settingGroupList = selection;
        this.ids = selection.map(item => item.id)
        this.codes = selection.map(item => item.codes)
        this.status = selection.map(item => item.status)
        this.workpieceTypeId = selection.map(item => item.workpieceTypeId)
        this.typeName = selection.map(item => item.typeName)
        this.single = selection.length!=1
        this.multiple = !selection.length
      },

      /** 新增按钮操作 */
      handleAdd() {
        this.reset();
        this.open = true;
        this.title = "新增工序";
        this.queryParams.pageNo = 1;
        this.getList();
        const workpieceTypeId = this.queryParams.workpieceTypeId;
        getProcessWorkpieceType(this.queryParams).then(response => {
          this.typeNameOptions = response.data.records
        })
      },

      /** 编辑按钮操作 */
      handleUpdate(row) {
        this.reset();
        const id = row.id || this.ids;
        const workpieceTypeId = row.workpieceTypeId;
        this.workpieceTypeId = row.workpieceTypeId;
        getProcess({'id':id}).then(response => {
          getProcessWorkpieceType({'workpieceTypeId': workpieceTypeId}).then(response => {
            this.typeNameOptions = response.data.records
          })
          this.form = response.data;
          this.open = true;
          this.title = "编辑工序";
        });
      },

      /** 设置工件类型按钮 */
      handleSetting() {
        this.getSetting();
        this.openSetting = true;
        this.title = "工件类型"
        for (let i = 0; i < this.processList.length; i++) {
          if (this.processList[i].code === "M0") {
            this.name = this.processList[i].name
          }
        }
        console.log(this.name)
      },
      /** 设置工件类型新增按钮操作 */
      workpieceTypeAdd() {
        this.resetSettingAdd();
        this.openSettingAdd = true;
        this.title = "新增工件类型";
      },

      /** 提交按钮 */
      submitForm: function() {
        this.$refs["form"].validate(valid => {
          if (valid) {
            if (this.form.id != undefined) {
              updateProcess(JSON.stringify(this.form)).then(response => {
                this.$modal.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              });
            } else {
              addProcess(JSON.stringify(this.form)).then(response => {
                this.$modal.msgSuccess("新增成功");
                this.open = false;
                this.getList();
              });
            }
          }
        });
      },

      /** 新增工件类型提交按钮 */
      submitFormSetting: function() {
        this.$refs["formSettingAdd"].validate(valid => {
          if (valid) {
            addWorkpieceType({'typeName':this.form.typeName,'drawingFile':this.form.drawingFile}).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.openSettingAdd = false;
              this.getSetting();
            });
          }
        });
      },
      /** 启用按钮操作 */
      handleOn() {
        const ids = this.ids
        const codes = this.codes
        this.$modal.confirm('是否确认启用代码为"' + codes + '"的数据项？').then(function() {
          return changeProcessStatus({'ids':ids,'status':'0'});
        }).then(() => {
          this.$modal.msgSuccess("启用成功");
          this.getList();
        }).catch(function() {
          this.status = this.status === "0" ? "1" : "0";
        });
      },
      /** 停用按钮操作 */
      handleOff() {
        const ids = this.ids
        const codes = this.codes
        this.$modal.confirm('是否确认停用代码为"' + codes + '"的数据项？').then(function() {
          return changeProcessStatus({'ids':ids,'status':'1'});
        }).then(() => {
          this.$modal.msgSuccess("停用成功");
          this.getList();
        }).catch(function() {
          this.status = this.status === "0" ? "1" : "0";
        });
      },
      /** 删除按钮操作 */
      handleDelete(row) {
        // 先获取复选框选中的ID
        const ids = row.id || this.ids // 数组[1,2,3]
        const codes =  this.codes
        this.$modal.confirm('是否确认删除设备编号为"' + codes + '"的数据项？').then(function() {
          return delProcess({'ids':ids});
        }).then(() => {
          this.getList();
          this.$modal.msgSuccess("删除成功");
        }).catch(() => {});
      },
      /** 新增工件类型删除按钮操作 */
      workpieceDelete(id,typeNames) {
        this.$modal.confirm('是否确认删除设备编号为"' +  typeNames + '"的数据项？').then(function() {
          return delWorkpieceType({'id': id});
        }).then(() => {
          this.$modal.msgSuccess("删除成功");
          this.getSetting();
        }).catch(() => {});
      },

      /** 导出按钮操作 */
      handleExport() {
        this.openExport = true;
        var data = this.sheduleList; // 这里面是数据列表
        const column = [
          { title: "代码", dataIndex: "code" },
          { title: "工序名称", dataIndex: "name" },
          { title: "工序类别", dataIndex: "operationCategory" },
          { title: "工件类型", dataIndex: "workpieceTypeName" },
          { title: "平均单价 元/每小时", dataIndex: "unitPrice" },
          { title: "群组设备数量", dataIndex: "groupDevicesNum" },
          { title: "是否外发 (1是 0否)", dataIndex: "isOutgoing" },
          { title: "启停", dataIndex: "status_dictText" },
        ];
        const instance = new ElMapExportTable(
          { column, data },
          { progress: progress => this.percentage = progress },// 进度条回调
        );
        instance.download("工序工时设定").then((data) => {
          this.openExport = false
        }); // 导出的文件名
      },
      // /** 导出按钮操作 */
      // handleExport() {
      //   this.openExport = true;
      // },
      // handleChecked(val) {
      //   this.queryManHourParams.columns = val
      // },
      // radioChange(r) {
      //   if (r == 1) {
      //     this.queryManHourParams.isAll = 0
      //   } else {
      //     this.queryManHourParams.isAll = 1
      //   }
      // },
      // submitFormExport() {
      //   const data = this.queryManHourParams
      //   exportProcess(data).then(response => {
      //     window.open(global.host+response.msg)
      //   });
      // },

      /** 设置工艺组按钮 */
      handleSettingGroup() {
        this.title = "设置工艺群组"
        this.openSettingGroup = true;
      },
      // 设置工艺组表格删除按钮
      settingGroupDelete(index, rows) {
        rows.splice(index, 1);

      },

      /** 工艺组确定按钮 */
      submitGroupCon() {
        this.reset();
        console.log(this.settingGroupList)
        this.openSettingGroupPre = true;
        this.queryParams.pageNo = 1;
       // this.queryParams.pageSize = 100;
        getProcessWorkpieceType(this.queryParams).then(response => {
          this.typeNameOptions = response.data.records
        })
      },

      /** 工艺组工件类型选择框 */
      WorkpieceTypeSelect(row) {
        this.workpieceTypeId = row
      },

      /** 工艺组保存按钮 */
      submitGroupPre: function() {
        const processManHourIds = this.processManHourIds;
        const groupData = []
        for (let i = 0 ;i < this.settingGroupList.length ; i++){
          const group = {}
          group.processManHourId = this.settingGroupList[i].id
          group.workHour = this.settingGroupList[i].workHour
          groupData.push(group)
        }
        // console.log(groupData)
        const workpieceTypeId = this.workpieceTypeId;
        setProcessGroup({
          'groupName':this.form.groupName,
          'groupDto':groupData,
          'workpieceTypeId':workpieceTypeId,
        }).then(response => {
          this.$modal.msgSuccess("保存成功");
          this.openSettingGroupPre = false;
          this.openSettingGroup = false;
        })
      },

      /** 工艺组修改工时 */
      handleSave(){
        // console.log(this.settingGroupListDD)
        const groupData = []
        for (let i = 0 ;i < this.settingGroupListDD.length ; i++){
          const group = {}
          group.groupId = this.settingGroupListDD[i].id
          group.processManHourId = this.settingGroupListDD[i].processManHourId
          group.workHour = this.settingGroupListDD[i].workHour
          groupData.push(group)
        }
        editProcessGroup({
          'groupDto':groupData
          }).then(res=>{
          this.$modal.msgSuccess("修改成功");
        })
      },

      /** 查看工艺组按钮 */
      handleSettingList() {
        this.openSettingGroupBB = true;
        this.getSettingGroup()
        /*this.queryParams.groupCode = this.groupCodeFirst;
        this.getSettingGroupListBB()*/
      },

      /** 删除工艺组按钮 */
      handleDelGroup(row) {
        const groupCode = row.groupCode;
        delGroup({'groupCode': groupCode}).then(response => {
          this.$modal.msgSuccess("删除成功");
          this.getSettingGroup()
        })
      },

      /** 表格单击显示 */
      handleDisplay (row) {
        this.queryParams.groupCode = row.groupCode;
        this.workpieceTypeId = row.workpieceTypeId;
        this.groupName = row.groupName; // 新增工序取groupName

        this.groupCode = row.groupCode; // 新增工序取groupCode
        this.getSettingGroupListBB();
      },

      /** 删除工艺按钮 */
      handleDelProcess(row) {
        const id = row.id;
        delAProcess({'id': id}).then(response => {
          this.$modal.msgSuccess("删除成功");
          this.getSettingGroup()
          this.getSettingGroupListBB();
        })
      },

      /** 工序id选择框 */
      codeSelect(val) {
        this.processManHourId = val;
      },

      /** 工序列表增加工序按钮 */
      handleGroupAddProcess() {
        this.openGroupAddProcess = true;
        this.title = "选择要增加的工序"
        listProcess(this.queryParams).then(response => {
          this.codeOptions = response.data.records
        });
      },
      /** 增加工序按钮保存按钮 */
      submitGroupProcess() {
        const groupCode = this.groupCode;
        const groupName = this.groupName;
        const processManHourId = this.processManHourId;
        const workpieceTypeId = this.workpieceTypeId;
        editGroupAddProcess({
          'groupCode': groupCode,
          'groupName': groupName,
          'processManHourId': processManHourId,
          'workpieceTypeId': workpieceTypeId
        }).then(response => {
          this.getSettingGroupListBB();
          this.openGroupAddProcess = false;
        })
      },
    }
  }
</script>
