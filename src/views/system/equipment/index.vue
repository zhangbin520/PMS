<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" v-show="showSearch" :inline="true">
      <el-form-item label="设备编号" prop="deviceNo">
        <el-input
          v-model="queryParams.deviceNo"
          placeholder="请输入设备编号"
          clearable
          size="small"
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <el-form-item label="设备名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入设备名称"
          clearable
          size="small"
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <!--<el-form-item label="分类" prop="type">
        <el-select v-model="form.type" placeholder="选择分类" clearable size="small">
          <template scope="scope">
          <el-option
            v-for="item in typeOptions"
            :key="item.id"
            :label="item.type"
            :value="item.id"
          />
          </template>
        </el-select>
      </el-form-item>-->

      <el-form-item label="使用工艺" prop="manHourName">
        <el-input
          v-model="queryParams.manHourName"
          placeholder="请输入工艺"
          clearable
          size="small"
          style="width: 220px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="选择状态" clearable size="small">
          <el-option
            v-for="dict in dict.type.equipment_section_status"
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

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
        >增加设备</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-circle-check"
          size="mini"
          :disabled="multiple"
          @click="handleOn"
        >启用设备</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-circle-close"
          size="mini"
          :disabled="multiple"
          @click="handleOff"
        >停用设备</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
        >删除设备</el-button>
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
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="equipmentList" @selection-change="handleSelectionChange" border>
      <el-table-column type="selection" width="55" align="center" />
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
      <el-table-column label="设备编号" prop="deviceNo"  />
      <el-table-column label="设备名称" prop="name" :show-overflow-tooltip="true" />
      <el-table-column label="分类" prop="type" :show-overflow-tooltip="true" >
        <template slot-scope="scope">
          <p v-if="scope.row.type =='0'">钢件</p>
          <p v-if="scope.row.type =='1'">电极</p>
        </template>
      </el-table-column>
      <el-table-column label="使用群组" prop="deptName" :show-overflow-tooltip="false" />
      <el-table-column label="使用工艺" prop="manHourName" :show-overflow-tooltip="false" />
      <el-table-column label="日产能" prop="dailyEnergy" :show-overflow-tooltip="false" />
      <el-table-column label="部门" prop="deptParentName" :show-overflow-tooltip="false" />
      <el-table-column label="转速" prop="speed" :show-overflow-tooltip="false" />
      <el-table-column label="控制器" prop="machineType" :show-overflow-tooltip="false" />
      <el-table-column label="品牌" prop="brand" :show-overflow-tooltip="false" />
      <el-table-column label="版本" prop="edition" :show-overflow-tooltip="false" />
      <el-table-column label="PLC地址" prop="networkAddress" :show-overflow-tooltip="false" />
      <el-table-column label="状态" prop="status_dictText" :show-overflow-tooltip="false" />
      <el-table-column label="是否自动化设备" prop="isAutomation_dictText" :show-overflow-tooltip="false" />
      <el-table-column label="产品序列号" prop="productSn" :show-overflow-tooltip="false" />
      <el-table-column label="备注" prop="remark" :show-overflow-tooltip="false" />
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNo"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改设备对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="1000px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="150px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="设备编号" prop="deviceNo">
              <el-input v-model="form.deviceNo" placeholder="请输入设备编号"/>
            </el-form-item>
            <el-form-item label="设备名称" prop="name">
              <el-input v-model="form.name" placeholder="请输入设备名称"/>
            </el-form-item>
            <el-form-item label="使用群组" prop="deptId">
              <treeselect
                v-model="form.deptId"
                :options="deptOptions"
                :show-count="true"
                placeholder="选择群组"
              />
            </el-form-item>
            <el-form-item label="设备分类" prop="type">
              <el-radio-group v-model="form.type" @change="selectProcess">
                <el-radio label="0">钢件</el-radio>
                <el-radio label="1">电极</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="使用工艺" prop="craftsId">
              <el-select v-model="form.craftsId" filterable placeholder="选择工艺" clearable size="small">
                <el-option
                  v-for="item in manHourNameOptions"
                  :key="item.id"
                  :label="item.code"
                  :value="item.id"
                  :disabled="item.status == 1"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="日产能H/天" prop="dailyEnergy">
              <el-input v-model="form.dailyEnergy" placeholder="请输入日产能"/>
            </el-form-item>
            <el-form-item label="状态" prop="status">
              <el-radio-group v-model="form.status">
                <el-radio label="0">启用</el-radio>
                <el-radio label="1">停用</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="所属部门" prop="deptParentId">
              <treeselect
                v-model="form.deptParentId"
                :options="deptOptions"
                :show-count="true"
                placeholder="选择部门"
              />
            </el-form-item>
            <el-form-item label="转速" prop="speed">
              <el-input v-model="form.speed" placeholder="请输入转速"/>
            </el-form-item>
            <el-form-item label="控制器" prop="machineType">
              <el-input v-model="form.machineType" placeholder="请输入控制器"/>
            </el-form-item>
            <el-form-item label="品牌" prop="brand">
              <el-input v-model="form.brand" placeholder="请输入品牌"/>
            </el-form-item>
            <el-form-item label="版本" prop="edition">
              <el-input v-model="form.edition" placeholder="请输入版本"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="PLC地址" prop="networkAddress">
              <el-input v-model="form.networkAddress" placeholder="请输入PLC地址"/>
            </el-form-item>
            <el-form-item label="PLC地址2" prop="networkAddress">
              <el-input v-model="form.network" placeholder="请输入PLC地址2"/>
            </el-form-item>
            <el-form-item label="FTP用户" prop="ftpName">
              <el-input v-model="form.ftpName" placeholder="请输入FTP用户"/>
            </el-form-item>
            <el-form-item label="FTP密码" prop="ftpPwd">
              <el-input v-model="form.ftpPwd"  placeholder="请输入FTP密码"/>
            </el-form-item>
            <el-form-item label="是否自动化" prop="isAutomation">
              <el-radio-group v-model="form.isAutomation">
                <el-radio label="0">是</el-radio>
                <el-radio label="1">否</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="网关设备序列号" prop="gatewayDeviceSn">
              <el-input v-model="form.gatewayDeviceSn" placeholder="请输入网关设备序列号"/>
            </el-form-item>
            <el-form-item label="网关所属产品序列号" prop="gatewayProductSn">
              <el-input v-model="form.gatewayProductSn" placeholder="请输入网关所属产品序列号"/>
            </el-form-item>
            <el-form-item label="子设备序列号(私有)" prop="subdeviceSn">
              <el-input v-model="form.subdeviceSn" placeholder="请输入子设备序列号(私有)"/>
            </el-form-item>
            <el-form-item label="子设备序列号(FTP)" prop="privateFtp">
              <el-input v-model="form.privateFtp" placeholder="请输入子设备序列号(FTP)"/>
            </el-form-item>
            <el-form-item label="子设备所属产品序列号" prop="subEquipmentProductsSn">
              <el-input v-model="form.subEquipmentProductsSn" placeholder="请输入子设备所属产品序列号"/>
            </el-form-item>
            <el-form-item label="总NC机床路径" prop="totalDevDir">
              <el-input v-model="form.totalDevDir" placeholder="请输入总NC机床路径"/>
            </el-form-item>
            <el-form-item label="子NC机床路径" prop="devDir">
              <el-input v-model="form.devDir" placeholder="请输入子NC机床路径"/>
            </el-form-item>
            <el-form-item label="备注" prop="remark">
              <el-input type="textarea" v-model="form.remark" placeholder="请输入备注"/>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

<!--    &lt;!&ndash;导出&ndash;&gt;-->
<!--    <el-dialog :title="title" :visible.sync="openExport" width="400px" append-to-body>-->
<!--      <el-form ref="formExport" :model="form" :rules="rules" label-width="100px">-->
<!--        <span>选择导出范围</span>-->
<!--        <el-form-item>-->
<!--          <el-radio-group v-model="radio" @change="radioChecked">-->
<!--          <el-radio  label="1" border>当前页</el-radio>-->
<!--          <el-radio  label="2" border>全部记录</el-radio>-->
<!--          </el-radio-group>-->
<!--        </el-form-item>-->
<!--        <span>选择导出列</span>-->
<!--        <el-card class="box-card" style="overflow:auto">-->
<!--          <el-checkbox-group v-model="checkList" @change="handleChecked">-->
<!--            <el-checkbox v-for="(val, key) in records" :label="key" style="display:block" checked="checked">{{val}}</el-checkbox>-->
<!--          </el-checkbox-group>-->
<!--        </el-card>-->
<!--        <el-button type="primary" @click="submitFormExport" icon="el-icon-download">导出</el-button>-->
<!--        <el-button @click="cancelExport">取 消</el-button>-->
<!--      </el-form>-->
<!--    </el-dialog>-->
  </div>
</template>

<script>
  import { listEquipment, getEquipment, delEquipment, addEquipment, updateEquipment, changeEquipmentStatus, exportEquipment } from "../../../api/system/equipment"
  import { listProcess } from "../../../api/system/process";
  import { treeselect } from "../../../api/system/dept";
  import Treeselect from "@riophae/vue-treeselect";
  import "@riophae/vue-treeselect/dist/vue-treeselect.css";
  import global from '../../../store/global.js'
  import { ElMapExportTable } from 'table-excel'

  export default {
    name: "Equipment",
    dicts: [ 'equipment_section_is_automation','equipment_section_status' ],
    components: { Treeselect },
    data() {
      return {
        records: {
          deviceNo: "设备编号",
          name: "名称",
          deptId: "使用群组",
          craftsId: "使用工艺",
          dailyEnergy: "日产能",
          speed: "转速",
          brand: "部门",
          edition: "版本",
          networkAddress: "PLC地址",
          status: "启停"
        },
        // 设备分类
        typeOptions: [],
        // 导出单选框
        radio: '2',
        // 导出多选框
        checkList: [],
        // 遮罩层
        loading: true,
        // 选中数组
        ids: [],
        // 选中数组设备名称
        deviceNos: [],
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
        // 工艺列表
        manHourNameOptions: [],
        // 角色表格数据
        equipmentList: [],
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        openExport: false,
        // 日期范围
        dateRange: [],
        // 菜单列表
        menuOptions: [],
        // 部门树选项
        deptOptions: undefined,
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
          deptParentId: undefined,
          deptId: undefined,
          type: undefined,
        },

        queryManHourParams:{
          brand: undefined,
          columns: [],
          dailyEnergy: undefined,
          dataScope: undefined,
          deptId: undefined,
          deptParentId: 0,
          deviceNo: undefined,
          edition: undefined,
          ftpName: undefined,
          isAll: 1,
          manHourName: undefined,
          name: undefined,
          networkAddress: undefined,
          orderBy: undefined,
          pageNo: 4,
          pageSize: 10,
          remark: undefined,
          speed: undefined,
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
          deviceNo: [
            { required: true, message: "设备编号不能为空", trigger: "blur" }
          ],
          name: [
            { required: true, message: "设备名称不能为空", trigger: "blur" }
          ],
          deptId: [
            { required: true, message: "使用群组不能为空", trigger: "blur" }
          ],
          craftsId: [
            { required: true, message: "使用工艺不能为空", trigger: "blur" }
          ],
          dailyEnergy: [
            { required: true, message: "日产能不能为空", trigger: "blur" },
          ],
          status: [
            {  required: true, message: "状态不能为空", trigger: "blur" }
          ],
          type: [
            {  required: true, message: "设备分类不能为空", trigger: "blur" }
          ],
          deptParentId: [
            { required: true, message: "所属部门不能为空", trigger: "blur" }
          ],
          isAutomation: [
            { required: true, message: "是否自动化不能为空", trigger: "blur" }
          ],
          brand: [
            { required: true, message: "品牌不能为空", trigger: "blur" }
          ]
        }
      }
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
    },
   
    methods: {
      /** 查询设备列表 */
      getList() {
        this.loading = true;
        listEquipment(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
          this.typeOptions = response.data.records
          this.equipmentList = response.data.records;
          this.sheduleList = response.data.records;
          this.total = Number(response.data.total);
          this.loading = false;
        });
      },
      /** 查询部门下拉树结构 */
      getTreeselect() {
        treeselect().then(response => {
          this.deptOptions = response.data;
        });
      },
      /** 查询工艺 */
      handeleSelectProcess() {
        const type = this.form.type
        listProcess({'pageNum': 1, 'pageSize':1000,'type':type}).then(response => {
          this.manHourNameOptions = response.data.records
        })
      },
      /** 根据角色ID查询部门树结构 */
      getRoleDeptTreeselect(roleId) {
        return roleDeptTreeselect(roleId).then(response => {
          this.deptOptions = response.depts;
          return response;
        });
      },
      /** 转换菜单数据结构 */
      normalizer(node) {
        if (node.children && !node.children.length) {
          delete node.children;
        }
        return {
          id: node.menuId,
          label: node.menuName,
          children: node.children
        };
      },
      // 取消按钮
      cancel() {
        this.open = false;
        this.reset();
      },
      cancelExport() {
        this.openExport = false;
        this.resetSetting();
      },
      /** 搜索按钮操作 */
      handleQuery() {
        this.queryParams.pageNo = 1;
        this.getList();
      },
      // 表单重置
      reset() {
        this.form = {
          deptId: undefined,
          deviceNo: undefined,
          type: undefined,
          name: undefined,
          deptName: undefined,
          manHourNameId: undefined,
          dailyEnergy: undefined,
          deptParentId: undefined,
          speed: undefined,
          brand: undefined,
          status: "0",
          edition: undefined,
          networkAddress: undefined,
          postIds: [],
          roleIds: []
        };
        this.resetForm("form");
      },
      // 多选框选中数据
      handleSelectionChange(selection) {
        this.ids = selection.map(item => item.id)
        this.deviceNos = selection.map(item => item.deviceNo)
        this.status = selection.map(item => item.status)
        this.single = selection.length!=1
        this.multiple = !selection.length
      },
      // 更多操作触发
      handleCommand(command, row) {
        switch (command) {
          case "handleDataScope":
            this.handleDataScope(row);
            break;
          case "handleAuthUser":
            this.handleAuthUser(row);
            break;
          default:
            break;
        }
      },
      /** 新增设备 */
      handleAdd() {
        this.reset();
        this.getTreeselect();
        this.open = true;
        this.title = "添加设备";
        listProcess({'pageNum': 1, 'pageSize':1000}).then(response => {
          this.manHourNameOptions = response.data.records
        })
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset();
        this.getTreeselect();
        const id = row.id || this.ids;
        listProcess({'pageNum': 1, 'pageSize':1000,'type':row.type}).then(response => {
          this.manHourNameOptions = response.data.records
        })
        getEquipment({'id':id}).then(response => {
          this.form = response.data;
          this.open = true;
          this.title = "编辑设备";
        });
      },
      /** 提交按钮 */
      submitForm: function() {
        
        this.$refs["form"].validate(valid => {
          if (valid) {
            if (this.form.id != undefined) {
              const data = JSON.stringify(this.form);
              console.log("Updating equipment with data:", data);
              updateEquipment(data).then(response => {
                this.$modal.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              });
            } else {
              addEquipment(JSON.stringify(this.form)).then(response => {
                this.$modal.msgSuccess("新增成功");
                this.open = false;
                this.getList();
              });
            }
          }
        });
      },
      /** 启用按钮操作 */
      handleOn() {
        const ids = this.ids
        const deviceNos = this.deviceNos
        this.$modal.confirm('是否确认启用设备编号为"' + deviceNos + '"的数据项？').then(function() {
          return changeEquipmentStatus({'ids':ids,'status':'0'});
        }).then(() => {
          this.$modal.msgSuccess("启用成功");
          this.getList();
        }).catch(function() {
          this.status = this.status === "0" ? "1" : "0";
        });
      },
      /** 停用按钮操作 */
      handleOff() {
        const ids = this.id || this.ids;
        const deviceNos = this.deviceNos
        this.$modal.confirm('是否确认停用设备编号为"' + deviceNos + '"的数据项？').then(function() {
          return changeEquipmentStatus({'ids':ids,'status':'1'});
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
        const deviceNos =  this.deviceNos
        this.$modal.confirm('是否确认删除设备编号为"' + deviceNos + '"的数据项？').then(function() {
          return delEquipment({'ids':ids});
        }).then(() => {
          this.getList();
          this.$modal.msgSuccess("删除成功");
        }).catch(() => {});
      },

      /** 导出按钮操作 */
      handleExport() {
        this.openExport = true;
        var data = this.sheduleList; // 这里面是数据列表
        const column = [
          { title: "设备编号", dataIndex: "deviceNo" },
          { title: "设备名称", dataIndex: "name" },
          { title: "分类(0 钢件 1 电极)", dataIndex: "type" },
          { title: "使用群组", dataIndex: "deptName" },
          { title: "使用工艺", dataIndex: "manHourName" },
          { title: "日产能", dataIndex: "dailyEnergy" },
          { title: "部门", dataIndex: "deptParentName" },
          { title: "转速", dataIndex: "speed" },
          { title: "控制器", dataIndex: "machineType" },
          { title: "品牌", dataIndex: "brand" },
          { title: "版本", dataIndex: "edition" },
          { title: "PLC地址", dataIndex: "networkAddress" },
          { title: "状态", dataIndex: "status_dictText" },
          { title: "是否自动化设备", dataIndex: "isAutomation_dictText" },
          { title: "网关设备序列号", dataIndex: "gatewayDeviceSn" },
          { title: "网关所属产品序列号", dataIndex: "gatewayProductSn" },
          { title: "子设备序列号(私有)", dataIndex: "subdeviceSn" },
          { title: "子设备序列号(FTP)", dataIndex: "privateFtp" },
          { title: "子设备所属产品序列号", dataIndex: "subEquipmentProductsSn" },
          { title: "总NC机床路径", dataIndex: "totalDevDir" },
          { title: "子NC机床路径", dataIndex: "devDir" },
          { title: "备注", dataIndex: "remark" },
        ];
        const instance = new ElMapExportTable(
          { column, data },
          { progress: progress => this.percentage = progress },// 进度条回调
        );
        instance.download("设备工段管理").then((data) => {
          this.openExport = false
        }); // 导出的文件名
      },
      // /** 导出按钮操作 */
      // handleExport() {
      //   this.openExport = true;
      // },
      // handleChecked(value) {
      //   this.queryManHourParams.columns = value
      // },
      // radioChecked(r) {
      //   if (r == 1) {
      //     this.queryManHourParams.isAll = 0
      //   } else {
      //     this.queryManHourParams.isAll = 1
      //   }
      // },
      // submitFormExport() {
      //   const data =  this.queryManHourParams;
      //   exportEquipment(data).then(response => {
      //     window.open(global.host+response.msg)
      //   });
      // },

      /** 选择工艺 */
      selectProcess() {
        this.handeleSelectProcess()
      }
    }
  }
</script>

