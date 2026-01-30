<template>
  <div class="app-container">
    <el-card>
      <el-form :model="queryParams" ref="queryForm" :inline="true">
        <el-row>
          <el-form-item label="设备编号" prop="deviceNo">
            <el-input
              v-model="queryParams.deviceNo"
              placeholder="输入设备编号"
              clearable
              size="small"
              style="width: 200px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="刀具库位" prop="toolLocation">
            <el-input
              v-model="queryParams.toolLocation"
              placeholder="输入刀具库位"
              clearable
              size="small"
              style="width: 200px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="刀具型号" prop="toolModel">
            <el-input
              v-model="queryParams.toolModel"
              placeholder="输入刀具型号"
              clearable
              size="small"
              style="width: 200px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item>
            <el-button style="margin-left: 10px" type="primary" icon="el-icon-search" size="mini" @click="handleQuery"></el-button>
            <el-button size="mini" type="primary" icon="el-icon-plus" @click="handleAdd">新增</el-button>
            <el-button size="mini" type="danger" icon="el-icon-delete" @click="handleDelete">删除</el-button>
          </el-form-item>
        </el-row>
      </el-form>
    </el-card>
    <el-card>
      <el-row>
        <el-col :span="24">
          <el-table v-loading="loading" :data="cncToolList" border @selection-change="handleSelectionChange">
            <el-table-column type="index" width="50" align="center" />
            <el-table-column type="selection" width="50" align="center" />
            <el-table-column align="center">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  round
                  type="primary"
                  icon="el-icon-edit"
                  @click="handleUpdate(scope.row)"
                >编辑</el-button>
              </template>
            </el-table-column>
            <el-table-column label="设备编号" align="center" key="deviceNo" prop="deviceNo" />
            <el-table-column label="工艺" align="center" key="craftsName" prop="craftsName"/>
            <el-table-column label="控制器" align="center" key="controller" prop="controller"/>
            <el-table-column label="分类" align="center" key="type" prop="type">
              <template slot-scope="scope">
                <el-tag v-if="scope.row.type === '0'" type="success">钢件</el-tag>
                <el-tag v-if="scope.row.type === '1'" type="danger">电极</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="使用群组" align="center" key="deptName" prop="deptName"/>
            <el-table-column label="刀具库位" align="center" key="toolLocation" prop="toolLocation"/>
            <el-table-column label="刀具型号" align="center" key="toolModel" prop="toolModel"/>
            <el-table-column label="替换刀位" align="center" key="replaceTool" prop="replaceTool"/>
          </el-table>
          <pagination
            v-show="total>0"
            :total="total"
            :page.sync="queryParams.pageNo"
            :limit.sync="queryParams.pageSize"
            @pagination="getList"
          />
        </el-col>
      </el-row>
    </el-card>

    <!-- 新增CNC刀库弹窗对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="480px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="130px">
        <el-form-item label="设备编号" prop="deviceNo">
<!--          <el-input v-model="form.deviceNo" placeholder="" @change="selectEquement"/>-->
          <el-select v-model="form.deviceNo" filterable placeholder="请选择" style="width: 100%"@change="selectEquement">
            <el-option
              v-for="item in deviceList"
              :key="item.id"
              :label="item.deviceNo"
              :value="item.deviceNo"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="工艺" prop="craftsName">
          <el-select v-model="form.craftsName" multiple placeholder="请选择" style="width: 100%">
            <el-option
              v-for="item in codeOption"
              :key="item"
              :label="item"
              :value="item"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="刀具库位" prop="toolLocation">
          <el-input v-model="form.toolLocation" placeholder="" />
        </el-form-item>
        <el-form-item label="刀具型号" prop="toolModel">
          <el-input v-model="form.toolModel" placeholder="" />
        </el-form-item>
        <el-form-item label="替换刀位" prop="replaceTool">
          <el-input v-model="form.replaceTool" placeholder="" />
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
  import {
    delOrderToolCost,
    exportOrderToolCost,
    getOrderToolCostPage,
    saveOrUpdateOrderToolCost
  } from "../../../api/system/toolManagement";
  import {getToken} from "../../../utils/auth";
  import global from '../../../store/global.js';
  import {editBaseCncTool, getBaseCncToolPage, getCodeByController} from "../../../api/production/semiAutomation";
  import {listEquipment} from "../../../api/system/equipment";

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
        cncToolList: [],
        //设备列表
        deviceList:[],
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        // 表单参数
        form: {},
        //根据控制器选择工艺
        codeOption:[],
        //选中数组
        Ids:[],
        toolNames:[],
        // 查询参数
        queryParams: {
          pageNo: 1,
          pageSize: 10,
        },
        // 查询参数
        deviceQueryParams: {
          pageNo: 1,
          pageSize: 1000,
        },
        //文件格式表单校验
        rules: {
          deviceNo: [
            { required: true, message: "设备编号不能为空", trigger: "blur" },
          ],
          craftsName: [
            { required: true, message: "工艺不能为空", trigger: "blur" },
          ],
        },
      };
    },
    created() {
      this.getList();
      this.getEquipment();
    },
    methods: {
      /** 分页查询CNC刀库刀具列表 */
      getList() {
        this.loading = true;
        getBaseCncToolPage(this.queryParams).then(response => {
          this.cncToolList = response.data.records;
          this.total = response.data.total;
          this.loading = false;
        });
      },

      /** 分页查询设备信息列表 */
      getEquipment(){
        listEquipment(this.deviceQueryParams).then(response => {
          this.deviceList = response.data.records

        });
      },

      /** 分页查询设备信息列表 */
      getEquipmentList() {
        const deviceNo = this.form.deviceNo
        listEquipment({'deviceNo':deviceNo}).then(response => {
          this.form.type = response.data.records[0].type
          this.form.deptName = response.data.records[0].deptName
          this.form.controller = response.data.records[0].machineType
          this.form.deptId = response.data.records[0].deptId
          this.getCodeList(this.form.controller)
        });
      },
      /** 根据控制器查控制器绑定得工艺 */
      getCodeList(a) {
        const controller = a
        getCodeByController({'keyWords':controller}).then(response => {
          this.codeOption = response.data.split(',');
        });
      },
      // CNC刀库刀具表单重置
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
        this.toolNames = selection.map(item => item.toolModel);
        this.multiple = !selection.length;
      },
      /** 搜索按钮操作 */
      handleQuery() {
        this.getList();
        this.queryParams = {
          pageNo: 1,
          pageSize: 10,
        };
      },
      /** 根据设备编号获取设备信息 */
      selectEquement() {
        this.getEquipmentList();
      },
      /** 编辑CNC刀库刀具按钮 */
      handleUpdate(row) {
        this.open = true
        this.title = "修改CNC刀库刀具信息"
        this.form = row
        this.form.craftsName = this.form.craftsName.split(',')
        this.getEquipmentList()
      },
      /** 新增CNC刀库刀具按钮 */
      handleAdd() {
        this.reset();
        this.open = true;
        this.title = "新增CNC刀库刀具";
      },
      /** 删除CNC刀库刀具按钮 */
      handleDelete() {
        const ids = this.Ids
        const names = this.toolNames
        this.$modal.confirm('是否确认删除刀具型号为"' + names + '"的数据项？').then(function() {
          return editBaseCncTool({'ids':ids,'delFlag':'1'});
        }).then(() => {
          this.getList();
          this.$modal.msgSuccess("删除成功");
        }).catch(() => {});
      },
      /** 新增CNC刀库刀具提交按钮 */
      submitForm: function() {
        this.$refs["form"].validate(valid => {
          if (valid) {
            if (this.form.id != undefined) {
              this.form.craftsName = this.form.craftsName.join(',')
              editBaseCncTool(this.form).then(response => {
                this.$modal.msgSuccess("修改CNC刀库刀具成功");
                this.open = false;
                this.getList();
              });
            } else {
              this.form.craftsName = this.form.craftsName.join(',')
              editBaseCncTool(this.form).then(response => {
                this.$modal.msgSuccess("新增CNC刀库刀具成功");
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

