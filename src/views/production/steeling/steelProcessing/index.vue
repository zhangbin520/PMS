<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="18">
        <el-card>
          <div slot="header">
            <el-form :model="queryParams" ref="queryForm" v-show="showSearch" :inline="true">
              <el-form-item label="搜索" prop="keywords">
                <el-input
                  v-model="queryParams.code"
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
          </div>

          <div >
<!--            <el-table v-loading="loading" :data="steelProcessingListOut" style="width: 100%" border>-->
<!--              <el-table-column type="expand">-->
<!--                <template slot-scope="props">-->

            <el-table v-loading="loading" @row-click="handleDisplay" :data="steelProcessingList" @selection-change="handleSelectionChange" border>
              <el-table-column type="selection" align="center" />
              <el-table-column label="操作" align="center" width="160px" class-name="small-padding fixed-width">
                <template slot-scope="scope">
                  <el-button
                    size="mini"
                    type="text"
                    icon="el-icon-edit"
                    @click="handleSuspend(scope.row)"
                  >生产暂停</el-button>
                  <el-button
                    size="mini"
                    type="text"
                    icon="el-icon-edit"
                    @click="handleExamine(scope.row)"
                  >查看图档</el-button>
                </template>
              </el-table-column>
              <el-table-column label="派工单号" align="center" prop="dispatchOrderNo" :show-overflow-tooltip="true"/>
              <el-table-column label="模号" align="center" prop="moduleNo" />
              <el-table-column label="工件号" align="center" prop="pieceNo" :show-overflow-tooltip="true" />
              <el-table-column label="版本" align="center" prop="versionNo" :show-overflow-tooltip="true" />
              <el-table-column label="工单号" align="center" prop="prodOrderNo" :show-overflow-tooltip="true"/>
              <el-table-column label="工艺制程" align="center" prop="process" :show-overflow-tooltip="true"/>
              <el-table-column label="品名" align="center" prop="pinName" :show-overflow-tooltip="true" />
              <el-table-column label="规格" align="center" >
                <template slot-scope="scope">
                  <p>{{scope.row.length}}*{{scope.row.width}}*{{scope.row.height}}</p>
                </template>
              </el-table-column>
              <el-table-column label="数量" align="center" prop="quantity" :show-overflow-tooltip="true" />
              <el-table-column label="材质" align="center" prop="material" :show-overflow-tooltip="true" />
              <el-table-column label="需求日期" align="center" prop="demandDate" :show-overflow-tooltip="true" />
              <el-table-column label="交货等级" align="center" prop="deliveryLevel" :show-overflow-tooltip="true">
              <template slot-scope="scope">
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
<!--             </template>-->
<!--             </el-table-column>-->

<!--              <el-table-column align="center">-->
<!--                <span>派工单号：{{PgNo}}</span>-->
<!--              </el-table-column>-->
<!--            </el-table>-->
          </div>
        </el-card>

        <el-card>
          <div align="center">
            <el-button type="primary"  size="small" @click="" >设置自动排产</el-button>
            <el-button type="primary"  size="small"  @click="" >设置超期预警天数</el-button>
            <el-button type="primary"  size="small" @click="">手动重排现有任务</el-button>
            <el-button type="primary"  size="small" @click="">查看任务甘特图</el-button>
          </div>
        </el-card>
      </el-col>

      <el-card style="height: 550px">
        <div slot="header">
          <span>工件<el-tag>{{pieceNo}}</el-tag>工艺制程，设计者:{{designer}}</span>
        </div>
        <!--<div style="height: 450px">
          <el-table :data="processList" @selection-change="handleSelectionChange">
            <el-table-column label="工序名称" prop="name" :show-overflow-tooltip="true" />
            <el-table-column label="工时" prop="workHour" :show-overflow-tooltip="true" />
          </el-table>
        </div>-->
        <div class="block">
          <el-timeline >
            <el-timeline-item placement="top">
              <el-card>
                  <span>加工工序: {{pieceNo}}</span>
                  <p>接收工件: </p>
                  <p>加工操作: </p>
                  <p>开始加工时间: </p>
              </el-card>
            </el-timeline-item>
            <el-timeline-item placement="top">
            </el-timeline-item>

          </el-timeline>
        </div>
      </el-card>
    </el-row>
  </div>
</template>

<script>
  import { listSteelProcessing, productionSuspension } from "../../../../api/production/steeling/steelProcessing";
  import { listProdProcess } from "../../../../api/production/steeling/scheduleWait";

  export default {
    name: "SteelProcessing",
    data() {
      return {
        name: {},
        pieceNo: {},
        workpiece: "",
        designer: "",
        //派工单号
        PgNo:{},
        // 设置表单左对齐
        labelPosition: 'left',
        // 日期选择器
        value1: '',
        // 时间选择器
        value2: '',
        // 遮罩层
        loading: true,
        // 选中数组
        ids: [],
        // 非单个禁用
        single: true,
        // 非多个禁用
        multiple: true,
        // 显示搜索条件
        showSearch: true,
        // 总条数
        total: 0,
        // 人工排产表格数据
        steelProcessingList: [],
        steelProcessingListOut: [],
        processList: [],
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
      this.pieceNo = this.$route.query.pieceNo
    },
    methods: {
      /** 查询待排产任务列表 */
      getList() {
        this.loading = true;
        const steelProcessingList = [];
        const steelProcessingListOut = [];
        listSteelProcessing(this.queryParams).then(response => {
            response.data.records.forEach(function(item){
              item.prodScheduleSteelpartsList.forEach(function(d) {
                steelProcessingList.push(
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
                    specification:d.specification,
                    dispatchOrderNo:d.dispatchOrderNo,
                    length:d.length,
                    width:d.width,
                    height:d.height,
                    material:d.material,
                    process:d.process
                  })
              })
              steelProcessingListOut.push(item.pNo)
            })
            this.steelProcessingList = steelProcessingList
            // this.steelProcessingListOut = steelProcessingListOut
            // this.PgNo = steelProcessingListOut.join('')
            this.total = response.data.total;
            this.loading = false;
        });
      },

      // 取消按钮
      cancel() {
        this.open = false;
        this.reset();
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
        this.single = selection.length!=1
        this.multiple = !selection.length
      },

      /** 生产暂停按钮 */
      handleSuspend(row) {
        const id = row.id
        this.queryParams.id = row.id
        this.$modal.confirm('确定生产暂停吗？').then(function() {
          return productionSuspension({'id':id});
        }).then(() => {
          this.$modal.msgSuccess("生产暂停成功");
          this.getList();
        }).catch(() => {});
      },

      /** 表格单击显示 */
      handleDisplay (row) {
        this.pieceNo = row.pieceNo
        this.queryParams.detailId = row.detailId
        this.loading = true;
        listProdProcess(this.queryParams).then(response => {
          this.processList = response.data.records;
          this.loading = false;
        });
      },

      handleQuery() {

      }
    }
  }
</script>
