<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="18">
    <el-card>
      <div slot="header">
      <el-form :model="queryParams" ref="queryForm" v-show="showSearch" :inline="true">
        <el-form-item label="搜索" prop="keywords">
          <el-input
            v-model="queryParams.keywords"
            placeholder="请输入生产单号/客户编码/工件号/模号/品名"
            clearable
            size="small"
            style="width: 500px"
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery"></el-button>
        </el-form-item>
      </el-form>
      </div>

    <div>

<!--      <el-table v-loading="loading" :data="scheduleArtificialListOut" style="width: 100%" border>-->
<!--        <el-table-column type="expand">-->
<!--          <template slot-scope="props">-->

      <el-table v-loading="loading" :data="scheduleArtificialList" @selection-change="handleSelectionChange" @row-dblclick="handleDisplay" max-height="800px" border>
        <el-table-column type="selection" align="center" />
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="140px">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="handleDispatch(scope.row)"
            >派工</el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              :disabled="isDisabled"
              v-preventReClick="2000"
              @click="handleConfirm(scope.row)"
            >确认生产</el-button>
          </template>
        </el-table-column>
        <el-table-column label="类型" prop="type" >
          <template scope="scope">
            <el-tag v-if="scope.row.type =='0'" type="success">钢件</el-tag>
            <el-tag v-if="scope.row.type=='1'">电极</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="电极序号" prop="electrodeNo" />
        <el-table-column label="模号" prop="moduleNo" :show-overflow-tooltip="true"/>
        <el-table-column label="工件号" prop="pieceNo" />
        <el-table-column label="版本" prop="versionNo" />
        <el-table-column label="生产单号" prop="prodOrderNo" :show-overflow-tooltip="true"/>
        <el-table-column label="工艺制程" prop="process" :show-overflow-tooltip="true"/>
        <el-table-column label="品名" prop="pinName" />
        <el-table-column label="数量" prop="quantity"/>
        <el-table-column label="需求日期" prop="demandDate" />
        <el-table-column label="交货等级" prop="deliveryLevel" :show-overflow-tooltip="true">
          <template scope="scope">
            <el-tag v-if="scope.row.deliveryLevel =='0'" type="danger">特急件</el-tag>
            <el-tag v-if="scope.row.deliveryLevel =='1'" type="warning">急件</el-tag>
            <el-tag v-if="scope.row.deliveryLevel =='2'">一般</el-tag>
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
<!--      </template>-->
<!--      </el-table-column>-->
<!--        <el-table-column align="center">-->
<!--          <span>派工单号：{{PgNo}}</span>-->
<!--        </el-table-column>-->

<!--      </el-table>-->

    </div>
    </el-card>

    <el-card v-loading="loading">
      <div align="center">
<!--      <el-button type="primary" icon="el-icon-check" size="small" :disabled="multiple" @click="handleArtificial" >转APS排产</el-button>-->
        <el-button type="primary" icon="el-icon-check" size="small" :disabled="multiple"  v-preventReClick="2000" @click="handleConfirmMany">批量确认生产</el-button>
      <el-button type="primary" icon="el-icon-check" size="small" :disabled="multipled" @click="handleAuto">一键报工</el-button>
      </div>
    </el-card>
      </el-col>

      <el-card>
        <div slot="header">
          <span>工件<el-tag>{{pieceNo}}</el-tag>工艺制程，设计者:{{designer}}</span>
        </div>
        <div>
          <el-table :data="processList" max-height="800px">
            <el-table-column label="工序名称" prop="code" :show-overflow-tooltip="true" />
            <el-table-column label="工时" prop="workHour" :show-overflow-tooltip="true" />
          </el-table>
        </div>
      </el-card>
<!--      <el-card>-->
<!--&lt;!&ndash;        <el-button type="primary" icon="el-icon-check" size="small" @click="" style="display:block;margin:0 auto">申请变更工艺</el-button>&ndash;&gt;-->
<!--      </el-card>-->
    </el-row>

    <!--派工对话框-->
    <el-dialog :title="title" :visible.sync="openDispatch" width="500px" append-to-body>
      <el-table v-loading="loading" :data="dispatchList" @selection-change="handleSelectionChange">
        <el-table-column label="工序名称" prop="code"/>
        <el-table-column label="设备" prop="equipmentSectionCode"/>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button
              type="primary"
              plain
              icon="el-icon-edit"
              size="mini"
              @click="handleAppoint(scope.row)"
            >指定工段</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer"  class="dialog-footer">
      <el-button @click="cancelDispatch">取 消</el-button>
      </div>
    </el-dialog>
    <!--<el-dialog :title="title" :visible.sync="openDispatch" width="500px" append-to-body>
      <el-form ref="formDispatch" :model="form" label-width="100px">
        <el-form-item label="工序名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入工序名称"/>
        </el-form-item>
        <el-form-item label="设备" prop="equipmentSectionId">
          <el-select v-model="form.equipmentSectionId" placeholder="选择设备" clearable size="small">
            <el-option
              v-for="item in equipmentSectionOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer"  class="dialog-footer">
        <el-button type="primary" icon="el-icon-check" size="small" @click="handleConScheduling">确认排期</el-button>
        <el-button @click="cancelDispatch">取 消</el-button>
      </div>
    </el-dialog>-->

    <!--指定工段对话框-->
    <el-dialog v-loading="loading" :title="title" :visible.sync="openAppoint" width="500px" append-to-body>
      <el-form ref="formSection" :model="form" label-width="100px">
        <el-form-item label="设备" prop="equipmentSectionId">
          <el-select v-model="equipmentSectionId" @change="equipmentSelect" placeholder="选择设备" filterable clearable size="small">
            <el-option
              v-for="item in equipmentSectionOptions"
              :key="item.id"
              :label="item.deviceNo"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer"  class="dialog-footer">
        <el-button type="primary" icon="el-icon-check" size="small" @click="handleConScheduling">确认排期</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import { listScheduleArtificial, apsScheduleArtificial, getDispatch, confirmProduction, confirmScheduling, oneButtonDispatch, process } from "../../../api/production/steeling/scheduleArtificial";
  import { listEquipment } from "../../../api/system/equipment"
  import { listProdProcess } from "../../../api/production/steeling/scheduleWait";

  export default {
    name: "ScheduleArtificial",
    // inject: ['reload'],
    data() {
      return {
        // 刷新标识
        isReloadData: true,
        pieceNo:{},
        name: {},
        equipmentName: '',
        workpiece: "",
        designer: "",
        //
        equipmentSectionId: [],
        //
        equipmentSectionOptions: [],
        //
        wareId: [],
        // 设置表单左对齐
        labelPosition: 'left',
        // 日期选择器
        value1: '',
        // 时间选择器
        value2: '',
        //派工单号
        PgNo:{},
        // 字典{设备id: 设备名}
        dict: {},
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
        // 删除传参
        Id:'',
        // 总条数
        total: 0,
        //按钮禁用
        isDisabled:false,
        isDisable:false,
        // 人工排产表格数据
        scheduleArtificialList: [],
        scheduleArtificialListOut: [],
        processList: [],
        dispatchList: [],
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        openDispatch: false,
        openAppoint: false,
        // 日期范围
        dateRange: [],
        //类型
        type: [],
        // 查询参数
        queryParams: {
          pageNo: 1,
          pageSize: 10,
        },
        // 查询参数
        queryParamsProcess: {
          pageNo: 1,
          pageSize: 50,
        },
        // 表单参数
        form: {},
        formSetting: {},

      }
    },
    created() {
      this.getList();
    },
    mounted() {
      // this.PieceNo = this.$route.query.pieceNo
      // this.name = this.$route.query.name
      // console.log(1111)
    },
    methods: {
      // 刷新当前页面，在修改数据之后 this.reload 一下就可以完成刷新当前这个指定标签的刷新
      /*reload() {
        this.isReloadData = false;
        this.$nextTick(() => {
          this.isReloadData = true;
        })
      },*/


      /** 查询人工排产任务列表 */
      getList() {
        this.loading = true;
        const scheduleArtificialList = [];
        const scheduleArtificialListOut = [];
        listScheduleArtificial(this.queryParams).then(response => {
          response.data.records.forEach(function(item){
            item.prodScheduleArtificialList.forEach(function(d) {
              scheduleArtificialList.push(
                {
                  id:d.id,
                  schedulingStatus:d.schedulingStatus,
                  moduleNo:d.moduleNo,
                  pieceNo:d.pieceNo,
                  versionNo:d.versionNo,
                  pinName:d.pinName,
                  quantity:d.quantity,
                  prodOrderNo:d.prodOrderNo,
                  demandDate:d.demandDate,
                  deliveryLevel:d.deliveryLevel,
                  designStatus:d.designStatus,
                  detailId:d.detailId,
                  equipmentSectionId:d.equipmentSectionId,
                  electrodeNo:d.electrodeNo,
                  type:d.type,
                  process:d.process,
                })
            })
            scheduleArtificialListOut.push(item.pNo)
          })
          this.scheduleArtificialList = scheduleArtificialList
          /*this.scheduleArtificialListOut = scheduleArtificialListOut
          this.PgNo = scheduleArtificialListOut.join('')*/
          this.total = response.data.total;
          this.loading = false;
          /*this.reload()*/
        });
      },

      /** 查询派工列表 */
      getDispatchList() {
        this.loading = true;
        getDispatch(this.queryParams).then(response => {
          this.dispatchList = response.data;
          this.loading = false;
        });
      },

      // 取消按钮
      cancel() {
        this.open = false;
        this.reset();
      },
      cancelDispatch() {
        this.openDispatch = false;
        this.reset();
      },
      cancelAppoint() {
        this.openAppoint = false;
        this.reset();
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

      // /** 转APS排产按钮操作 */
      // handleArtificial() {
      //   const ids = this.ids || this.ids;
      //   this.$modal.confirm('确定转APS排产吗？').then(function() {
      //     return apsScheduleArtificial({'ids':ids});
      //   }).then(() => {
      //     this.$modal.msgSuccess("排产成功");
      //     this.getList();
      //   }).catch(() => {});
      // },

      /** 确认生产按钮 */
      handleConfirm(row) {
        const id = [row.id]
        this.isDisabled = true
        setTimeout(()=>{
          this.isDisabled=false   //点击一次时隔两秒后才能再次点击
        },6000)
        this.$modal.confirm('确定确认生产吗？').then(function() {
          return confirmProduction({'ids':id});
        }).then(() => {
          this.$modal.msgSuccess("确认生产成功");
          this.getList();
        }).catch(() => {});
      },

      /** 批量确认生产按钮 */
      handleConfirmMany(row) {
        this.loading = true
        setTimeout(()=>{
          this.loading = false
        },3000)
        const id = this.ids
        this.multiple = true
        this.isDisabled = true
        setTimeout(()=>{
          this.multiple=false   //点击一次时隔三秒后才能再次点击
          this.isDisabled = false
        },3000)
        this.$modal.confirm('确定确认生产吗？').then(function() {
          return confirmProduction({'ids':id});
        }).then(() => {
          this.loading = false
          this.$modal.msgSuccess("确认生产成功");
          this.getList();
        }).catch(() => {});
      },

      /**确认排期提交按钮*/
      handleConScheduling() {
        this.loading = true
        const id = this.id
        const equipmentSectionId = this.wareId
        confirmScheduling({'id':id,'equipmentSectionId':equipmentSectionId}).then(response => {
          this.loading = false
          this.openAppoint = false;
          this.$modal.msgSuccess("确认排期提交成功");
          this.openDispatch = false
          this.getDispatchList();
        })
      },

      /**派工按钮操作*/
      handleDispatch(row) {
        this.queryParams.detailId = row.detailId
        this.queryParams.pageNo = 1;
        this.queryParams.pageSize = 1000;
        this.queryParams.type = row.type
          listEquipment(this.queryParams).then(response => {
            this.equipmentSectionOptions = response.data.records;
          })
          this.getDispatchList();
          this.openDispatch = true;
          this.title = "工件加工信息"
      },

      /** 指定工段按钮 */
      handleAppoint(row) {
        const name = row.name
        const id = row.id;
        this.id = row.id;
        this.openAppoint = true;
        this.title = "指定工段"
      },

      /** 指定工段选择框 */
      equipmentSelect(val) {
        // this.name = val
        for(let i = 0 ;i<this.equipmentSectionOptions.length;i++){
          if(this.equipmentSectionOptions[i].id===val){
            this.equipmentName = this.equipmentSectionOptions[i].deviceNo
          }
        }
        // this.equipmentSectionOptions.forEach(function (item){
        //   if(item.id===val){
        //     this.equipmentName = item.name
        //   }
        // })
        this.wareId = val
        listEquipment(this.queryParams).then(response => {
          this.equipmentSectionOptions = response.data.records;
        })
      },

      /** 表格单击显示 */
      handleDisplay (row) {
        this.queryParamsProcess.detailId = row.detailId
        this.queryParamsProcess.pieceNo = row.pieceNo
        this.pieceNo = row.pieceNo
        this.loading = true;
        process(this.queryParamsProcess).then(response => {
          this.processList = response.data;
          this.loading = false;
        });
      },

      /** 一键派工按钮 */
      handleAuto() {
        const detailIds = this.detailIds
        this.$modal.confirm('确定一键派工吗？').then(function() {
          return oneButtonDispatch({'detailIds':detailIds});
        }).then(() => {
          this.$modal.msgSuccess("一键派工成功");
        }).catch(() => {});
      }
    }
  }
</script>


