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
          <el-form-item label="控制器" prop="controller">
            <el-input
              v-model="queryParams.controller"
              placeholder="输入控制器"
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
          <el-table v-loading="loading" :data="baseEquipmentRfidList" border @selection-change="handleSelectionChange">
            <el-table-column type="index" width="50" align="center" />
            <el-table-column type="selection" width="50" align="center" />
            <el-table-column label="设备编号" align="center" key="deviceNo" prop="deviceNo" />
            <el-table-column label="设备名称" align="center" key="name" prop="name" />
            <el-table-column label="分类" align="center" key="type" prop="type">
              <template slot-scope="scope">
                <el-tag v-if="scope.row.type === '0'" type="success">钢件</el-tag>
                <el-tag v-if="scope.row.type === '1'" type="danger">电极</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="使用群组" align="center" key="deptName" prop="deptName"/>
            <el-table-column label="使用工艺" align="center" key="craftsName" prop="craftsName"/>
            <el-table-column label="控制器" align="center" key="controller" prop="controller"/>
            <el-table-column label="IP" align="center" key="networkAddress" prop="networkAddress"/>
            <el-table-column label="坐标系" align="center" key="coordinate" prop="coordinate"/>
            <el-table-column label="治具RFID" align="center" key="rfid" prop="rfid">
              <template slot-scope="scope">
                <el-input v-model="scope.row.rfid" @change="fixRfid(scope.row)">{{scope.row.rfid}}</el-input>
              </template>
            </el-table-column>
            <el-table-column align="center">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  round
                  type="primary"
                  icon="el-icon-edit"
                  @click="handleUpdate(scope.row)"
                >编辑</el-button>
                <el-button
                  size="mini"
                  round
                  type="danger"
                  icon="el-icon-brush"
                  @click="handleUnbindRfid(scope.row)"
                >解绑</el-button>
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
        </el-col>
      </el-row>
    </el-card>

    <!-- 新增治具弹窗对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="480px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="130px">
        <el-form-item label="设备编号" prop="deviceNo">
          <el-input v-model="form.deviceNo" placeholder="" @change="selectEquement"/>
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
        <el-form-item label="坐标系" prop="coordinate">
          <el-input v-model="form.coordinate" placeholder="" />
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
  import {getToken} from "../../../utils/auth";
  import global from '../../../store/global.js';
  import {
    editBaseEquipmentRfid, fixOrUnbindRfid,
    getBaseEquipmentRfidPage,
    getCodeByController
  } from "../../../api/production/semiAutomation";
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
        baseEquipmentRfidList: [],
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
        deviceNames:[],
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
      /** 分页查询治具列表 */
      getList() {
        this.loading = true;
        getBaseEquipmentRfidPage(this.queryParams).then(response => {
          this.baseEquipmentRfidList = response.data.records;
          this.total = response.data.total;
          this.loading = false;
        });
      },
      /** 分页查询设备信息列表 */
      getEquipmentList() {
        const deviceNo = this.form.deviceNo
        
        listEquipment({'deviceNo':deviceNo}).then(response => {
          this.form.name = response.data.records[0].name
          this.form.type = response.data.records[0].type
          this.form.deptName = response.data.records[0].deptName
          this.form.networkAddress = response.data.records[0].networkAddress
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
      // 坐标系表单重置
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
        this.deviceNames = selection.map(item => item.deviceNo);
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
      /** 编辑治具按钮 */
      handleUpdate(row) {
        this.open = true
        this.title = "修改治具信息"
        this.form = row
        this.form.craftsName = this.form.craftsName.split(',')
        this.getEquipmentList()
      },
      /** 新增治具按钮 */
      handleAdd() {
        this.reset();
        this.open = true;
        this.title = "新增治具";
      },
      /** 删除治具按钮 */
      handleDelete() {
        const ids = this.Ids
        const names = this.deviceNames
        this.$modal.confirm('是否确认删除设备编号为"' + names + '"的数据项？').then(function() {
          return editBaseEquipmentRfid({'ids':ids,'delFlag':'1'});
        }).then(() => {
          this.getList();
          this.$modal.msgSuccess("删除成功");
        }).catch(() => {});
      },
      /** 新增坐标系提交按钮 */
      submitForm: function() {
        this.$refs["form"].validate(valid => {
          if (valid) {
            if (this.form.id != undefined) {
              this.form.craftsName = this.form.craftsName.join(',')
              editBaseEquipmentRfid(this.form).then(response => {
                this.$modal.msgSuccess("修改治具成功");
                this.open = false;
                this.getList();
              });
            } else {
              this.form.craftsName = this.form.craftsName.join(',')
              editBaseEquipmentRfid(this.form).then(response => {
                this.$modal.msgSuccess("新增治具成功");
                this.open = false;
                this.getList();
              });
            }
          }
        });
      },
      /** 绑RFID */
      fixRfid(row) {
        const id = row.id
        const rfid = row.rfid
        fixOrUnbindRfid({'id':id,'op':'1','rfid':rfid}).then(res =>{
          this.$modal.msgSuccess("绑定RFID成功")
          this.getList()
        })
      },
      /** 解绑RFID */
      handleUnbindRfid(row) {
        const id = row.id
        const rfid = row.rfid
        fixOrUnbindRfid({'id':id,'op':'0','rfid':rfid}).then(res =>{
          this.$modal.msgSuccess("解绑RFID成功")
          this.getList()
        })
      },
    }
  };
</script>

