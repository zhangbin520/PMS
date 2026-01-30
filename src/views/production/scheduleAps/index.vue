<template>
  <div class="app-container">
    <el-card>
      <el-row :gutter="20">
        <el-col :span="13">
      <el-form :model="queryParams" ref="queryForm" v-show="showSearch" :inline="true">
        <el-form-item label="搜索" prop="keywords">
          <el-input
            v-model="queryParams.keywords"
            placeholder="请输入客户编码/工件号/模号/品名"
            clearable
            size="small"
            style="width: 500px"
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery"></el-button>
        </el-form-item>
      </el-form>
        </el-col>
          <el-radio v-model="radio" label="0">长工艺链优先</el-radio>
          <el-radio v-model="radio" label="1">长工时优先</el-radio>
      </el-row>
    </el-card>

    <el-card>

      <!--<el-table v-loading="loading" :data="scheduleApsListOut" style="width: 100%" border>
      <el-table-column type="expand">
      <template slot-scope="props">-->
      <div class="draggable" style="padding: 20px">
      <el-table v-loading="loading" row-key="id" :data="scheduleApsList" @row-click="handleClick" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="100" align="center" />
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="handleLabor(scope.row)"
            >转人工</el-button>
          </template>
        </el-table-column>
        <el-table-column label="派工单号" prop="dispatchOrderNo"/>
        <el-table-column label="模号" prop="moduleNo" :show-overflow-tooltip="true" />
        <el-table-column label="工件号" prop="pieceNo" :show-overflow-tooltip="true" />
        <el-table-column label="版本" prop="versionNo" :show-overflow-tooltip="true" />
        <el-table-column label="品名" prop="pinName" :show-overflow-tooltip="true" />
        <el-table-column label="数量" prop="quantity" :show-overflow-tooltip="true" />
        <el-table-column label="生产单号" prop="prodOrderNo"/>
        <el-table-column label="需求日期" prop="demandDate" :show-overflow-tooltip="true" />
        <el-table-column label="交货等级" prop="deliveryLevel" :show-overflow-tooltip="true" >
        <template scope="scope">
          <p v-if="scope.row.deliveryLevel =='0'">特急件</p>
          <p v-if="scope.row.deliveryLevel =='1'">急件</p>
          <p v-if="scope.row.deliveryLevel =='2'">一般</p>
        </template>
        </el-table-column>
      </el-table>
      </div>
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="queryParams.pageNo"
        :limit.sync="queryParams.pageSize"
        @pagination="getList"
      />

      <!--</template>
      </el-table-column>-->

        <!--<el-table-column align="center">
          <span>派工单号：{{PgNo}}</span>
        </el-table-column>-->
      <!--</el-table>-->

    </el-card>

    <el-card v-loading="loading">
      <div align="center">
      <el-button type="primary" icon="el-icon-check" size="small" :disabled="multiple" @click="handleStart" >开始排产</el-button>
      <el-button type="danger" icon="el-icon-search" size="small" :disabled="multiple" @click="handleBottleneck" >查看瓶颈工序</el-button>
      <el-button type="primary" icon="el-icon-check" size="small" :disabled="multiple" @click="handleConfirm">确认当前排产</el-button>
      </div>
    </el-card>

  </div>
</template>

<script>
  import { listScheduleAps, apsTransferToLabor, getBottleneckProcess, startScheduling, apsDragSort } from "../../../api/production/steeling/scheduleAps";
  import Sortable from 'sortablejs';

  export default {
    name: "ScheduleAps",
    data() {
      return {
        radio: '1',
        //派工单号
        PgNo:{},
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
        // 显示搜索条件
        showSearch: true,
        // 删除传参
        Id:'',
        // 总条数
        total: 0,
        // 工价工时表格数据
        scheduleApsList: [],
        scheduleApsListOut: [],
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        // 日期范围
        dateRange: [],
        // 查询参数
        queryParams: {
          pageNo: 1,
          pageSize: 10,
          createBy: undefined,
          createTime: undefined,
          deliveryLevel: undefined,
          demandDate: undefined,
          dispatchOrderNo: undefined,
          moduleNo: undefined,
          quantity: undefined,
          pieceNo: undefined,
          id: undefined,
          pinName: undefined,
          productionOrderNo: undefined,
          schedulingStatus: undefined,
          updateBy: undefined,
          updateTime: undefined,
          versionNo: undefined,
        },
        // 表单参数
        form: {},
        formSetting: {},
        defaultProps: {
          children: "children",
          label: "label"
        },
      }
    },
    created() {
      this.getList();
    },
    mounted() {
      this.rowDrop()
    },
    methods: {
      /** 查询待排产任务列表 */
      getList() {
        this.loading = true;
        const scheduleApsList = [];
        const scheduleApsListOut = [];
        this.queryParams.sortLevel = "0";
        listScheduleAps(this.queryParams).then(response => {
          response.data.records.forEach(function(item){
            console.log(item.prodScheduleApsList)
            item.prodScheduleApsList.forEach(function(d) {
              scheduleApsList.push(
                {
                  id:d.id,
                  schedulingStatus:d.schedulingStatus,
                  moduleNo:d.moduleNo,
                  pieceNo:d.pieceNo,
                  versionNo:d.versionNo,
                  pinName:d.pinName,
                  prodOrderNo:d.prodOrderNo,
                  demandDate:d.demandDate,
                  deliveryLevel:d.deliveryLevel,
                  designStatus:d.designStatus,
                  detailId:d.detailId,
                  quantity:d.quantity,
                  apsList:d.apsList,
                  sortLevel:d.sortLevel,
                  dispatchOrderNo:d.dispatchOrderNo
                })
            })
            scheduleApsListOut.push(item.pNo)
          })
          this.scheduleApsList = scheduleApsList
          /*this.scheduleApsListOut = scheduleApsListOut
          this.PgNo = scheduleApsListOut.join('')*/
          this.total = response.data.total;
          this.loading = false;
        });
      },
      // 取消按钮
      cancel() {
        this.open = false;
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
        this.single = selection.length!=1
        this.multiple = !selection.length
      },
      /** 搜索按钮操作 */
      handleSearch() {
        this.reset();
        this.open = true;
        this.title = "搜索";
      },
      /** 开始排产按钮 */
      handleStart() {
        this.loading = true
        setTimeout(()=>{
          this.loading=false   //点击一次时隔五秒后才能再次点击
        },3000)
        const type = this.queryParams;
        this.$modal.confirm('确定开始排产吗？').then(function() {
          return startScheduling({'type':type,'schedulingStatus':'0','sortLevel':'1'});
        }).then(() => {
          this.loading = false
          this.$modal.msgSuccess("开始排产成功");
        }).catch(() => {});
      },

      /** 确认当前排产按钮 */
      handleConfirm() {
        this.loading = true
        setTimeout(()=>{
          this.loading=false   //点击一次时隔五秒后才能再次点击
        },3000)
        const type = this.queryParams;
        this.$modal.confirm('确认当前排产吗？').then(function() {
          return startScheduling({'type':type,'schedulingStatus':'1','sortLevel':'0'});
        }).then(() => {
          this.loading = false
          this.$modal.msgSuccess("确认当前排产成功");
        }).catch(() => {});
      },

      /** 转人工排产按钮 */
      handleLabor(row) {
        const id = row.id || this.ids;
        this.queryParams.id = row.id
        this.$modal.confirm('确定转人工排产吗？').then(function() {
          return apsTransferToLabor({'id':id});
        }).then(() => {
          this.$modal.msgSuccess("转人工排产成功");
          this.getList();
        }).catch(() => {});
      },

      /** 查看瓶颈工序按钮 */
      handleBottleneck() {
        getBottleneckProcess(this.queryParams).then(response => {
        })
      },

      /** 表格拖动排序 */
      /*handleClick () {
        apsDragSort(this.queryParams).then(response => {
        })
      },*/
      rowDrop() {
        // 此时找到的元素是要拖拽元素的父容器
        const tbody = document.querySelector('.draggable .el-table__body-wrapper tbody');
        const _this = this;
        Sortable.create(tbody, {
          //  指定父元素下可被拖拽的子元素
          draggable: ".draggable .el-table__row",
          onEnd({newIndex, oldIndex}) {
            const currRow = _this.tableData.splice(oldIndex, 1)[0];
            _this.tableData.splice(newIndex, 0, currRow);
          }
        });
      },

    }
  }
</script>
