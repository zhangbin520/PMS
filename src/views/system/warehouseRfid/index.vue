<template>
  <div class="app-container">
    <div slot="header">
      <el-form :model="queryParams" ref="queryForm" v-show="true" :inline="true"  label-width="90px">
        <el-form-item label="设备编号" prop="deviceNo">
          <el-input
            v-model="queryParams.deviceNo"
            placeholder="请输入设备编号"
            clearable
            size="small"
            style="width: 220px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="刀库RFID" prop="toolMagazineRfid">
          <el-input
            v-model="queryParams.toolMagazineRfid"
            placeholder="请输入刀库RFID"
            clearable
            size="small"
            style="width: 220px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item v-loading="loading" style="padding-left: 35px">
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-row>
      <el-col :span="24">
        <el-table ref="multipleTable" v-loading="loading" :data="warehouseRfidList" @selection-change="handleSelectionChange"
                  max-height="750px" border highlight-current-row>
          <el-table-column type="selection" width="50" align="center" />
          <el-table-column label="操作" align="center" class-name="small-padding">
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
          <el-table-column label="设备编号" align="center" sortable prop="deviceNo"  />
          <el-table-column label="刀库号" align="center" sortable prop="toolMagazineNumber" :show-overflow-tooltip="true" />
          <el-table-column label="电极刀库RFID" align="center" sortable prop="toolMagazineRfid"  />
          <el-table-column label="电极刀库号ID" align="center" prop="id" v-if="false"/>
        </el-table>
        <div align="center">
          <pagination
            v-show="total>0"
            :total="total"
            :page.sync="queryParams.pageNo"
            :limit.sync="queryParams.pageSize"
            :page-sizes=[10,20,30,50,this.total]
            @pagination="getWarehouseRfid"
          />
          <el-row style="margin-top: 30px">
            <el-button
              size="mini"
              round
              type="primary"
              icon="el-icon-check"
              @click="handleAdd"
            >新增刀库号</el-button>
            <el-button
              size="mini"
              round
              style="background-color: #FF8294;color: #ffffff"
              icon="el-icon-delete"
              :disabled="multiple"
              @click="handleDelete"
            >删除</el-button>
          </el-row>
        </div>
      </el-col>
    </el-row>

    <!-- 新增刀库号 -->
    <el-dialog title="新增刀库号" :visible.sync="open" width="320px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-row :gutter="24">
          <el-col :span="20">
            <el-form-item label="设备编号" prop="deviceNo">
              <el-select v-model="form.deviceNo" filterable placeholder="请选择" style="width: 100%">
                <el-option
                  v-for="item in deviceList"
                  :key="item.id"
                  :label="item.deviceNo"
                  :value="item.deviceNo"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="刀库号" prop="toolMagazineNumber">
              <el-input v-model="form.toolMagazineNumber" placeholder="请输入刀库号" />
            </el-form-item>
            <el-form-item label="刀库RFID" prop="toolMagazineRfid">
              <el-input v-model="form.toolMagazineRfid" placeholder="请输入刀库RFID" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">保 存</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 修改SAP -->
    <el-dialog title="修改刀库号" :visible.sync="open2" width="320px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-row :gutter="24">
          <el-col :span="20">
            <el-form-item label="设备编号" prop="deviceNo">
              <el-select v-model="form.deviceNo" filterable placeholder="请选择" style="width: 100%">
                <el-option
                  v-for="item in deviceList"
                  :key="item.id"
                  :label="item.deviceNo"
                  :value="item.deviceNo"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="刀库号" prop="toolMagazineNumber">
              <el-input v-model="form.toolMagazineNumber" placeholder="请输入刀库号" />
            </el-form-item>
            <el-form-item label="刀库RFID" prop="toolMagazineRfid">
              <el-input v-model="form.toolMagazineRfid" placeholder="请输入刀库RFID" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">保 存</el-button>
        <el-button @click="cancel2">取 消</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { listCustomer } from '@/api/system/customer'
import {
  delBatchCamElectrodeKnifeLibrary,
  editCamElectrodeKnifeLibrary,
  getCamElectrodeKnifeLibraryPage
} from '@/api/system/warehouseRfid'
import { listEquipment } from '@/api/system/equipment'



export default {
  name: 'sapItemNumber',
  data(){
    return {
      // 遮罩层
      loading: false,
      // 总条数
      total: 0,
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 查询参数
      queryParams: {
        pageNo: 1,
        pageSize: 10,
      },
      // 查询参数
      queryParamsCustomer: {
        pageNo: 1,
        pageSize: 100000,
      },
      //刀库芯片表格数据
      warehouseRfidList: [
        // {
        //   "deviceNo":"HNC-05",
        //   "toolMagazineNumber":"1",
        //   "toolMagazineRfid":"4139689803",
        //   "id":"15983465375209"
        // },
        // {
        //   "deviceNo":"HNC-05",
        //   "toolMagazineNumber":"2",
        //   "toolMagazineRfid":"4139690979",
        //   "id":"1598146754745694209"
        // },
        // {
        //   "deviceNo":"HNC-09",
        //   "toolMagazineNumber":"5",
        //   "toolMagazineRfid":"4139711584",
        //   "id":"1598140594209"
        // },
        // {
        //   "deviceNo":"HNC-09",
        //   "toolMagazineNumber":"6",
        //   "toolMagazineRfid":"3123722492",
        //   "id":"1598146077465694288"
        // },
        // {
        //   "deviceNo":"CNC-06",
        //   "toolMagazineNumber":"1",
        //   "toolMagazineRfid":"3123722493",
        //   "id":"15965694209"
        // },
        // {
        //   "deviceNo":"CNC-06",
        //   "toolMagazineNumber":"2",
        //   "toolMagazineRfid":"4139712436",
        //   "id":"159814607746569209"
        // },
        // {
        //   "deviceNo":"CNC-08",
        //   "toolMagazineNumber":"1",
        //   "toolMagazineRfid":"4139711410",
        //   "id":"15986077465694209"
        // },
        // {
        //   "deviceNo":"CNC-08",
        //   "toolMagazineNumber":"2",
        //   "toolMagazineRfid":"4139690982",
        //   "id":"159814607746594209"
        // }
      ],
      //设备列表
      deviceList:[],
      //客户资料数据
      customerFororder:[],
      // 查询参数
      deviceQueryParams: {
        pageNo: 1,
        pageSize: 1000,
      },
      //选中数组
      Ids:[],
      // 表单参数
      form: {},
      //是否显示弹出层
      open: false,
      open2: false,
      //
      //订单BOM表单校验
      rules: {
        deviceNo: [
          { required: true, message: "设备编号不能为空", trigger: "blur" },
        ],
        toolMagazineNumber: [
          { required: true, message: "刀库号不能为空", trigger: "blur" },
        ],
        toolMagazineRfid: [
          { required: true, message: "刀库RFID不能为空", trigger: "blur" },
        ],
      },
    }
  },
  created() {
    this.getWarehouseRfid();
    this.getListCustomer();
    this.getEquipment()
  },

  methods:{
    /** 分页查看电极刀库号*/
    getWarehouseRfid(){
      this.loading = true
      setTimeout(()=>{
        this.loading = false
      },3000)
      getCamElectrodeKnifeLibraryPage(this.queryParams).then(response => {
        this.warehouseRfidList = response.data.records;
        this.total = response.data.total;
        this.loading = false;
      });
    },

    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNo = 1;
      this.getWarehouseRfid()
    },

    // 多选框选中数据
    handleSelectionChange(selection) {
      this.single = selection.length!=1
      this.code = selection.map(item => item.toolMagazineRfid);
      this.multiple = !selection.length
      this.ids = selection.map(item => item.id)
    },

    /** 查询客户信息列表 */
    getListCustomer() {
      this.loading = true;
      listCustomer(this.queryParamsCustomer).then(response => {
        this.customerFororder = response.data.records;
      });
    },

    /** 分页查询设备信息列表 */
    getEquipment(){
      listEquipment(this.deviceQueryParams).then(response => {
        this.deviceList = response.data.records
      });
    },


    /** 删除按钮操作 */
    handleDelete(row) {
      // 先获取复选框选中的ID
      const ids = row.id || this.ids // 数组[1,2,3]
      const customerCode = this.code;
      this.$modal.confirm('是否确认删除刀库RFID为"' + customerCode + '"的数据项？').then(function() {
        return delBatchCamElectrodeKnifeLibrary({'ids':ids});
      }).then(() => {
        this.getWarehouseRfid();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },

    // SAP料号表单重置
    reset() {
      this.form = {
        deviceNo: undefined,
        toolMagazineNumber: undefined,
        toolMagazineRfid: undefined,
      };
      // console.log(this.form)
      this.resetForm("form");
    },

    /** 新增电极刀库按钮 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "新增刀库号";
    },

    /** 编辑电极刀库按钮 */
    handleUpdate(row) {
      let obj = {...row}
      this.form = {...obj}
      this.open2 = true;
    },

    /** 新增修改订单sap配置 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != undefined) {
            editCamElectrodeKnifeLibrary(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open2 = false;
              this.getWarehouseRfid();
            });
          } else {
            editCamElectrodeKnifeLibrary(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getWarehouseRfid();
            });
          }
        }
      });
    },

    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
      this.getWarehouseRfid()
    },
    // 取消按钮
    cancel2() {
      this.open2 = false;
      this.reset();
      this.getWarehouseRfid()
    },

  }
}
</script>

