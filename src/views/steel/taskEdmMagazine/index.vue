<template>
  <div class="app-container">
    <el-row :gutter="24">
    <el-col :span="24">
        <!-- @keyup.enter.native="handleQuery" -->
      <el-card>
          <div slot="header" >
          <el-form :model="queryParams" ref="queryForm" v-show="showSearch" :inline="true">

          <el-form-item  style="margin-left: 20px" prop="keywords">
            <span style="text-align: center;font-size: 18px;margin-right: 12px">设备:</span>
            <el-select v-model="queryParams.deviceNo" filterable placeholder="请选择" clearable style="width: 150px">
              <el-option
                v-for="item in deviceList"
                :key="item.id"
                :label="item.deviceNo"
                :value="item.deviceNo"
              >
              </el-option>
            </el-select>
          </el-form-item>

            <el-form-item label="刀库号" prop="toolMagazineNumber">
                <el-input
                  v-model="queryParams.toolMagazineNumber"
                  placeholder="输入刀库号"
                  clearable
                  size="small"
                  style="width: 200px"
                />
            </el-form-item>
            <el-form-item label="刀库RFID" prop="toolMagazineRfid">
                <el-input
                  v-model="queryParams.toolMagazineRfid"
                  placeholder="输入刀库RFID"
                  clearable
                  size="small"
                  style="width: 200px"
                />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery"></el-button>
            </el-form-item>
          </el-form>
           <el-button type="primary" icon="el-icon-add" size="mini" @click="handleAdd">新增</el-button>
          </div>
        
          <div>
            <el-table v-loading="loading" :data="warehouseEleList" @selection-change="handleSelectionChange"  max-height="1200px" border highlight-current-row>
              <el-table-column type="index" label="序号" width="50" align="center"/>
              <el-table-column label="设备" align="center" prop="deviceNo"> </el-table-column>
              <el-table-column label="刀库号" align="center" prop="toolMagazineNumber" />
              <el-table-column label="刀库RFID" align="center" prop="toolMagazineRfid"> </el-table-column>
              <el-table-column label="备注" align="center" prop="remark" />
              <el-table-column label="操作" align="center" width="200px">
                <template slot-scope="scope">
                  <el-button
                    size="mini"
                    round
                    type="primary"
                    icon="el-icon-edit"
                    @click="handleEditData(scope.row)"
                  >修改</el-button>
                  <el-button
                    size="mini"
                    round
                    style="background-color: rgb(204 9 37);color: #ffffff"
                    icon="el-icon-delete"
                    @click="handleDelete(scope.row)"
                  >删除</el-button>
                </template>
              </el-table-column>
              
            </el-table>
            
            <pagination
              v-show="total>0"
              :total="total"
              :page.sync="queryParams.pageNo"
              :limit.sync="queryParams.pageSize"
              @pagination="getWarehouseEleList"
            />
          </div>
      </el-card>
    </el-col>
    </el-row>


    <!-- 新增刀库号  -->
    <el-dialog :title="magazine.title" :visible.sync="magazine.open" width="1200px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="设备名称" prop="deviceNo">
              <el-select v-model="form.deviceNo" filterable placeholder="请选择" clearable style="width: 150px">
                <el-option
                  v-for="item in deviceList"
                  :key="item.id"
                  :label="item.deviceNo"
                  :value="item.deviceNo"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="刀库号" prop="toolMagazineNumber">
              <el-input v-model="form.toolMagazineNumber" placeholder="" />
            </el-form-item>
          </el-col>  
          <el-col :span="12">
            <el-form-item label="刀库RFID" prop="toolMagazineRfid">
              <el-input v-model="form.toolMagazineRfid"  placeholder="" />
            </el-form-item>

            <el-form-item label="备注" prop="remark">
              <el-input v-model="form.remark"  placeholder="" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="magazine.open = false">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 修改SAP -->
    <el-dialog title="修改刀库号" :visible.sync="magazine.openT" width="1200px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="设备名称" prop="deviceNo">
              <el-select v-model="form.deviceNo" filterable placeholder="请选择" style="width: 100%">
                <el-option
                  v-for="item in deviceList"
                  :key="item.id"
                  :label="item.deviceNo"
                  :value="item.deviceNo"
                ></el-option>
              </el-select>
            </el-form-item>
            
            <el-form-item label="刀库RFID" prop="toolMagazineRfid">
              <el-input v-model="form.toolMagazineRfid" placeholder="请输入刀库RFID" />
            </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="刀库号" prop="toolMagazineNumber">
                  <el-input v-model="form.toolMagazineNumber" placeholder="请输入刀库号" />
                </el-form-item>
                <el-form-item label="备注" prop="remark">
                  <el-input v-model="form.remark"  placeholder="" />
                </el-form-item>
            </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">保 存</el-button>
        <el-button @click="magazine.openT = false">取 消</el-button>
      </div>
    </el-dialog>


  </div>
</template>

<script>
  import request from '@/utils/request'
  import downloadGlobal from '@/store/downloadGlobal'
  import { listEquipment } from '@/api/system/equipment'
  import { getCamElectrodeBom,getCamSparkList } from '@/api/jy/electrodeMange'
  import {
  delBatchCamElectrodeKnifeLibrary,
  editCamElectrodeKnifeLibrary,
  getCamElectrodeKnifeLibraryPage
} from '@/api/system/warehouseRfid'

  export default {
    name: "TaskEdmMagazine",
    dicts: ['sys_normal_disable','deliveryLevel'],
    // inject: ['reload'],
    data() {
      return {
        // 刷新标识
        isReloadData: true,
        name: {},
        equipmentSectionId: [],
        deviceQueryParams: {
          pageNo: 1,
          pageSize: 1000,
        },

        // 设置表单左对齐
        labelPosition: 'left',
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
        // 非单个禁用
        single: true,
        // 非多个禁用
        multiple: true,
        multipled: true,
        // 显示搜索条件
        showSearch: true,
        //电极库位绑定列表
        electrodeList:[],
       //设备列表
        deviceList:[],
        queryParamsDevice: {
          pageNo: 1,
          pageSize: 1000,
        },
        // 总条数
        total: 0,
        titleProgram: "",
       
        //按钮禁用
        isDisabled:false,
        isDisable:false,

        //  刀库列表 list
        warehouseEleList: [],
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        // 日期范围
        dateRange: [],
        //类型
        type: [],
        // 查询参数
        queryParams: {
           pageNo: 1,
           pageSize: 10,
        },
        // 表单参数
        form: {},
        formSetting: {},
        magazineList: [],
        magazine: {
          // 是否显示弹出层
          open: false,
          openT: false,
          // 弹出层标题
          title: "新增刀库",
        },
        rules: {
          deviceNo: [
            { required: true, message: "设备不能为空", trigger: "blur" },
            { min: 2, max: 10, message: '设备长度必须介于 2 和 10 之间', trigger: 'blur' }
          ],
          toolMagazineNumber: [
            { required: true, message: "刀库号为空", trigger: "blur" },
            { min: 2, max: 10, message: '刀库号长度必须介于 2 和 10 之间', trigger: 'blur' }
          ],
          toolMagazineRfid: [
            { required: true, message: "刀库RFID不能为空", trigger: "blur" },
          ],
          
        },

      }
    },
    created() {
      this.getWarehouseEleList();
      this.getListEquipment();
    },
    mounted() {
    },
    methods: {
       /** 提交操作 */
       /** 新增修改订单sap配置 */
        submitForm: function() {
          this.$refs["form"].validate(valid => {
            if (valid) {
              if (this.form.id != undefined) {
                editCamElectrodeKnifeLibrary(this.form).then(response => {
                  this.$modal.msgSuccess("修改成功");
                  this.magazine.openT = false;
                  this.getWarehouseEleList();
                });
              } else {
                editCamElectrodeKnifeLibrary(this.form).then(response => {
                  this.$modal.msgSuccess("新增成功");
                  this.magazine.open = false;
                  this.getWarehouseEleList();
                });
              }
            }
          });
       },
       // 取消按钮
      cancel() {
        this.magazine.open = false;
        this.reset();
      },
       /** 仓库新增按钮操作 */
      handleAdd() {
        this.reset();
        this.magazine.open = true;
        this.magazine.title = "新建刀库";
      },
       /** 修改数据行 */
      handleEditData(row) {
        let obj = {...row}
        this.form = {...obj}
        this.magazine.openT = true;
      },
      /** 删除按钮操作 */
    handleDelete(row) {
      // 先获取复选框选中的ID // 数组[1,2,3]
      this.ids[0] = row.id
      const array = this.ids;
      this.$modal.confirm('是否确认删除刀库RFID为"' + row.toolMagazineRfid + '"的数据项？').then(function() {
        return delBatchCamElectrodeKnifeLibrary({'ids':array});
      }).then(() => {
        this.getWarehouseEleList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {}); 
    },
      // 刷新当前页面，在修改数据之后 this.reload 一下就可以完成刷新当前这个指定标签的刷新
      /*reload() {
        this.isReloadData = false;
        this.$nextTick(() => {
          this.isReloadData = true;
        })
      },*/

    getWarehouseEleList(){
      
      getCamElectrodeKnifeLibraryPage(this.queryParams).then(response => {
        
        this.warehouseEleList = response.data.records
        this.total = response.data.total
        this.loading = false
        //this.middleList = response.data.records[0]
        // this.warehouseEleList.splice(this.index, 1,Object.assign(this.warehouseEleList[this.index], this.middleList))
        // this.warehouseEleList.splice(this.index, 1,response.data.records[0].toolMagazineNumber)
        // this.warehouseEleList[this.index].toolMagazineNumber = response.data.records[0].toolMagazineNumber
      });
    },
    /** 分页查询设备信息列表 */
     /** 分页查询设备信息列表 */

      /** 查询设备列表 */
    getListEquipment() {
       this.loading = true
       listEquipment(this.deviceQueryParams).then(response => {
          this.deviceList = response.data.records
          this.loading = false
       });
    },
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
        this.getWarehouseEleList();
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
          operationCategory: undefined,
          groupDevicesNum: undefined,
          id: undefined,
          updateBy: undefined,
          updateTime: undefined,
          status: "0",
          workpieceTypeId: undefined
        };
        this.resetForm("form");
      },
      // 多选框选中数据
      handleSelectionChange(selection) {
        this.ids = selection.map(item => item.id)
        this.status = selection.map(item => item.status)
        this.detailIds = selection.map(item => item.detailId)
        this.single = selection.length!=1
        this.multiple = !selection.length
        this.multipled = !selection.length
      },
      /** 搜索按钮操作 */
      handleSearch() {
        this.reset();
        this.open = true;
        this.title = "搜索";
      },
      handleWatchCustomer(row) {
        this.openProgram = true;
        this.titleProgram = "电极程式参数";
        this.getListCamElectrod(row);
        this.getListCamSpark(row);
      },
      getListCamElectrod(row) {
       this.camSparkList = [];
       this.camElectrodList = [];
       this.queryParamsCam.electrodeProdOrderNo = row.electrodeProdOrderNo

        getCamElectrodeBom({"electrodeProdOrderNo":row.electrodeProdOrderNo}).then(resp=>{
            this.camElectrodList = resp.data
            this.total = resp.data.total
          })
       
      },

    /** 删除数据行 */
    handleDeleteData(row, index) {
      this.warehouseEleList.splice(index, 1)
      if (this.warehouseEleList.length == 0) {
        this.begin = true
      }
    },
   

      
    }
  }
</script>


