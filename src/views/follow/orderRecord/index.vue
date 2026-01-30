<template>
  <div class="app-container">
    <el-card>
      <el-form :model="queryParams" ref="queryForm" :inline="true">
        <el-row>
          <el-form-item label="开始时间：" prop="keywords">
            <el-date-picker
              v-model="queryParams.beginTime"
              type="date"
              placeholder="选择日期时间"
              value-format="yyyy-MM-dd">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="结束时间：" prop="keywords">
            <el-date-picker
              v-model="queryParams.endTime"
              type="date"
              placeholder="选择日期时间"
              value-format="yyyy-MM-dd">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="派工单号：" prop="keywords">
            <el-input
              v-model="queryParams.dispatchOrderNo"
              placeholder="请输入派工单号"
              clearable
              size="small"
              style="width: 200px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="投单人：" prop="keywords">
            <el-input
              v-model="queryParams.investor"
              placeholder="请输入投单人"
              clearable
              size="small"
              style="width: 220px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="模号：" prop="keywords">
            <el-input
              v-model="queryParams.moduleNo"
              placeholder="请输入模号"
              clearable
              size="small"
              style="width: 220px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="订单状态：" prop="orderState">
            <el-select v-model="queryParams.orderState" placeholder="请选择" clearable>
              <el-option
                v-for="item in order_state"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button style="margin-left: 10px" type="primary" icon="el-icon-search" size="mini" @click="handleQuery"></el-button>
            <el-button type="warning" plain icon="el-icon-download" size="mini" style="margin-bottom: 10px" @click="handleExport">导出</el-button>
          </el-form-item>
        </el-row>
      </el-form>
    </el-card>
    <div>
      <el-table v-loading="loading" :data="sheduleList" border max-height="800px" @selection-change="handleSelectionChange" highlight-current-row>
        <el-table-column type="index" width="50" fixed/>
        <el-table-column type="selection" align="center" fixed :selectable="selected"/>
        <el-table-column label="操作" align="center" width="150px" fixed>
          <template slot-scope="scope">
            <el-button
              size="mini"
              round
              type="primary"
              @click="handleViewRecord(scope.row)"
            >查看工件生产进度</el-button>
          </template>
        </el-table-column>
        <el-table-column label="派工单号" align="center" prop="dispatchOrderNo" fixed/>
        <el-table-column label="模号" align="center" prop="moduleNo" fixed/>
        <el-table-column label="客户代码" align="center" prop="customerCode" fixed/>
        <el-table-column label="客户名称" align="center" prop="customerName"  fixed :show-overflow-tooltip="true"/>
        <el-table-column label="客户订单号" align="center" prop="customerOrderNo" :show-overflow-tooltip="true" fixed/>
        <el-table-column label="投单人员" align="center" prop="investor" fixed :show-overflow-tooltip="true"/>
        <el-table-column label="投单类型" align="center" prop="processingContent" fixed/>
        <el-table-column label="投单性质" align="center" prop="orderNature"/>
        <el-table-column label="投单日期" align="center" prop="orderDate" :show-overflow-tooltip="true"/>
        <el-table-column label="需求日期" align="center" prop="demandDate" :show-overflow-tooltip="true"/>
        <el-table-column label="工件类型" align="center" prop="workpieceTypeName" />
        <el-table-column label="工时完成比例" align="center" prop="processingProgress" width="200px">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="黄色代表交期异常，红色代表进度缓慢，绿色代表进度正常" placement="top-start">
            <div v-if="Number(scope.row.theoreticalProgress) < 0">
              <el-progress status="warning" :text-inside="true" :stroke-width="20" :percentage="Number(scope.row.processingProgress)"></el-progress>
            </div>
            <div v-if="Number(scope.row.theoreticalProgress) > scope.row.processingProgress && scope.row.processingProgress !== 100">
              <el-progress status="exception" :text-inside="true" :stroke-width="20" :percentage="Number(scope.row.processingProgress)"></el-progress>
            </div>
            <div v-if="(Number(scope.row.theoreticalProgress) <= scope.row.processingProgress && Number(scope.row.theoreticalProgress)>0) || scope.row.processingProgress === 100">
              <el-progress status="success" :text-inside="true" :stroke-width="20" :percentage="Number(scope.row.processingProgress)"></el-progress>
            </div>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="钢件" align="center">
          <el-table-column label="总工时" align="center" prop="totalManHours"/>
          <el-table-column label="剩余工时" align="center" prop="remainingWork"/>
        </el-table-column>
        <el-table-column label="电极" align="center">
          <el-table-column label="总工时" align="center" prop="totalWorkingHoursElectrode"/>
          <el-table-column label="剩余工时" align="center" prop="remainingWorkingHoursElectrode"/>
        </el-table-column>
        <el-table-column label="工时分布" align="center">
          <el-table-column label="G" align="center" prop="g"/>
          <el-table-column label="EDM" align="center" prop="edm"/>
          <el-table-column label="WE" align="center" prop="we"/>
          <el-table-column label="CNC" align="center" prop="cnc"/>
          <el-table-column label="钢件HNC" align="center" prop="hnc"/>
          <el-table-column label="电极HNC" align="center" prop="djhnc"/>
          <el-table-column label="M" align="center" prop="m"/>
          <el-table-column label="SG" align="center" prop="sg"/>
          <el-table-column label="QC" align="center" prop="qc"/>
        </el-table-column>
        <el-table-column label="订单状态" align="center" prop="orderState">
          <template slot-scope="scope">
            <el-tag v-if="Number(scope.row.processingProgress) < 100">进行中</el-tag>
            <el-tag v-if="Number(scope.row.processingProgress) >= 100" type="success">已完结</el-tag>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="queryParams.pageNo"
        :limit.sync="queryParams.pageSize"
        :page-sizes="[10, 20, 30, 40, 50]"
        :page-size="10"
        @pagination="getList"
      />
      <div align="center">
        <el-button size="small" type="danger" icon="el-icon-star-off" @click="handleSpecialAttention">特别关注</el-button>
        <el-button size="small" type="primary" icon="el-icon-files" @click="handleCheckWorkHours">查看钢件工段工时</el-button>
        <el-button size="small" type="warning" icon="el-icon-cpu" @click="handleCheckEleWorkHours">查看电极工段工时</el-button>
        <el-button size="small" type="success" icon="el-icon-s-order" @click="handleCheckWait">查看未加工明细</el-button>
      </div>
    </div>
    <!--导出-->
    <el-dialog :title="title" :visible.sync="openExport" width="400px" append-to-body>
      <div align="center">
        <el-progress :percentage="percentage" type="circle"></el-progress>
      </div>
    </el-dialog>
    <!--特别关注弹窗-->
    <el-dialog :title="specialAttention.title" :visible.sync="specialAttention.open" width="400px" append-to-body>
      <el-form :model="formSpecialAttention">
        <el-form-item label="备注" prop="remark">
          <el-input v-model="formSpecialAttention.remark" type="textarea"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="saveSpecialAttention" type="primary" style="margin-right: 40%">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 查看钢件工段工时对话框 -->
    <el-dialog :title="orderRecord.title" :visible.sync="orderRecord.open" width="1200px" append-to-body>
      <el-form ref="form" :model="orderRecordForm" :rules="rules" label-width="100px">
        <el-col v-for="(item,index) in steelTotalData" :key="index" :xs="{span: 24}" :sm="{span: 12}" :md="{span: 12}" :lg="{span: 6}" :xl="{span: 6}">
          <el-form-item
            :label="item.k"
            :prop="item.v"
          >
            <el-input v-model="item.v"></el-input>
          </el-form-item>
        </el-col>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="orderRecord.open = false" type="danger">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 查看电极工段工时对话框 -->
    <el-dialog :title="orderEleRecord.title" :visible.sync="orderEleRecord.open" width="1200px" append-to-body>
      <el-form ref="form" :model="orderEleRecordForm" :rules="rules" label-width="100px">
        <el-col v-for="(item,index) in eleTotalData" :key="index" :xs="{span: 24}" :sm="{span: 12}" :md="{span: 12}" :lg="{span: 6}" :xl="{span: 6}">
          <el-form-item
            :label="item.k"
            :prop="item.v"
          >
            <el-input v-model="item.v"></el-input>
          </el-form-item>
        </el-col>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="orderEleRecord.open = false" type="danger">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 查看未加工明细对话框 -->
    <el-dialog :title="waitProcess.title" :visible.sync="waitProcess.open" width="1200px" append-to-body>
      <el-card>
        <el-form :model="queryParamsWait" ref="queryForm" :inline="true">
          <el-form-item label="派工单号：" prop="keywords">
            <el-input
              v-model="queryParamsWait.dispatchOrderNo"
              placeholder="请输入派工单号"
              clearable
              size="small"
              style="width: 200px"
              @keyup.enter.native="handleQueryWait"
            />
          </el-form-item>
          <el-form-item label="生产单号：" prop="keywords">
            <el-input
              v-model="queryParamsWait.prodOrderNo"
              placeholder="请输入生产单号"
              clearable
              size="small"
              style="width: 220px"
              @keyup.enter.native="handleQueryWait"
            />
          </el-form-item>
          <el-form-item label="模号：" prop="keywords">
            <el-input
              v-model="queryParamsWait.moduleNo"
              placeholder="请输入模号"
              clearable
              size="small"
              style="width: 220px"
              @keyup.enter.native="handleQueryWait"
            />
          </el-form-item>
          <el-form-item>
            <el-button style="margin-left: 10px" type="primary" icon="el-icon-search" size="mini" @click="handleQueryWait"></el-button>
            <el-button size="small" type="success" icon="el-icon-download" @click="handleExport">导出</el-button>
          </el-form-item>
        </el-form>
      </el-card>
      <el-table :data="waitList" border>
        <el-table-column label="序号" type="index" />
        <el-table-column label="派工单号" align="center" prop="dispatchOrderNo"/>
        <el-table-column label="订单类型" align="center" prop="datasource">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.datasource === '0'" type="success">钢件</el-tag>
            <el-tag v-if="scope.row.datasource === '1'" type="danger">电极</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="模号" align="center" prop="moduleNo"/>
        <el-table-column label="件号" align="center" prop="pieceNo"/>
        <el-table-column label="版本" align="center" prop="versionNo"/>
        <el-table-column label="生产单号" align="center" prop="prodOrderNo"/>
        <el-table-column label="工序" align="center" prop="sort"/>
        <el-table-column label="工段" align="center" prop="code"/>
        <el-table-column label="订单数量" align="center" prop="quantity"/>
        <el-table-column label="当前状态" align="center" prop="taskStatus">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.taskStatus === 0" type="info">待领取</el-tag>
            <el-tag v-if="scope.row.taskStatus === 1" type="success">已领取</el-tag>
            <el-tag v-if="scope.row.taskStatus === 2" type="danger">加工中</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="工艺工时" align="center" prop="workHour"/>
        <el-table-column label="已报工时" align="center" prop="assignWork"/>
      </el-table>
      <pagination
        v-show="totalWait>0"
        :total="totalWait"
        :page.sync="queryParamsWait.pageNo"
        :limit.sync="queryParamsWait.pageSize"
        :page-sizes="[10, 20, 30, 40, totalWait]"
        :page-size="10"
        @pagination="getListWaitProcess"
      />
      <div slot="footer" class="dialog-footer">
        <el-button @click="waitProcess.open = false" type="danger">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {exportProdSchedule, getProdSchedulePage, saveProdScheduleFollow} from "../../../api/follow/recording";
  import {getProdWorkOperationHisPage} from "../../../api/production/taskStation";
  import global from '../../../store/global.js';
  import { ElMapExportTable } from "table-excel";
  import {
    eachSectionSteelPartsTotal,
    electrodeSectionsTotal,getProdDispatchFollowExport,
    getProdScheduleDispatchOrderPage, getUnprocessedOrderDetail, saveProdDispatchFollow
  } from "../../../api/follow/orderRecord";

  export default {
    name: "OrderRecord",
    dicts: ['sys_normal_disable'],
    components:{ElMapExportTable},
    data() {
      var myDate = new Date ();
      return {
        // 遮罩层
        loading: true,
        // 总条数
        total: 0,
        totalWait: 0,
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        openDetail:false,
        openExport: false,
        // 显示搜索条件
        showSearch: true,
        // 生产进度表格数据
        sheduleList: [],
        //导出进度显示
        percentage:0,
        //特别关注数据
        specialAttention:{
          title:"",
          open:false,
        },
        formSpecialAttention:{},
        //钢件工段工时参数
        orderRecord:{
          title:"",
          open:false,
        },
        //工段工时表单数据
        orderRecordForm:{},
        //钢件各工段Total数据
        steelTotalData:[],
        //电极工段工时参数
        orderEleRecord:{
          title:"",
          open:false,
        },
        //工段工时表单数据
        orderEleRecordForm:{},
        //钢件各工段Total数据
        eleTotalData:[],
        //未加工对话框参数
        waitProcess:{
          title:"",
          open:false,
        },
        //未加工明细表格数据
        waitList:[],
        // 查询参数
        queryParams: {
          pageNo: 1,
          pageSize: 10,
          beginTime: new Date(myDate - 1000 * 60 * 60* 24 * 60),
          endTime:new Date(),
        },
        // 查询参数
        queryParamsExport: {
          pageNo: 1,
          pageSize: 10,
        },
        // 查询参数
        queryParamsSpecial: {
          pageNo: 1,
          pageSize: 10,
        },
        // 查询参数
        queryParamsWait: {
          pageNo: 1,
          pageSize: 10,
        },
        //进度查询表单校验
        rules: {},
        //订单状态数组
        order_state:[{
          "value": 0,
          "label": '进行中'
        },{
          "value": 1,
          "label": '已完结'
        }],
      };
    },
    created() {
      this.getList();
    },
    methods: {
      /** 分页查询生产进度列表 */
      getList() {
        
        this.loading = true;
        getProdScheduleDispatchOrderPage(this.queryParams).then(response => {
          this.sheduleList = response.data.records;
          this.total = response.data.total;
          this.loading = false;
        });
      },
      /** 分页查询钢件各工段Total */
      getListSteelTotal() {
        eachSectionSteelPartsTotal().then(res =>{
          this.steelTotalData = res.data
        })
      },
      /** 分页查询电极各工段Total */
      getListEleTotal() {
        electrodeSectionsTotal().then(res =>{
          this.eleTotalData = res.data
          console.log(this.eleTotalData)
        })
      },
      /** 分页查询未加工明细 */
      getListWaitProcess() {
        getUnprocessedOrderDetail(this.queryParamsWait).then(res =>{
          this.waitList = res.data.records
          this.totalWait = res.data.total
        })
      },
      // 多选框选中数据
      handleSelectionChange(selection) {
        this.attentionProdOrderNo = selection.map(item => item.dispatchOrderNo)
        this.single = selection.length!=1
        this.multiple = !selection.length
      },
      /** 搜索按钮操作 */
      handleQuery() {
        this.queryParams.pageNo = 1;
        if(this.queryParams.orderState === undefined || this.queryParams.orderState === ''){
          delete this.queryParams.orderState
        }
        this.getList();
      },
      /** 进度条颜色 */
      customColorMethod(percentage) {
        if (percentage < 30) {
          return '#F56C6C';
        } else if (percentage < 70) {
          return '#409EFF';
        } else {
          return '#67c23a';
        }
      },
      /** 导出按钮操作 */
      handleExport() {
        this.openExport = true;
        var data = this.sheduleList; // 这里面是数据列表
        const column = [
          { title: "派工单号", dataIndex: "dispatchOrderNo" },
          { title: "模号", dataIndex: "moduleNo" },
          { title: "客户代码", dataIndex: "customerCode" },
          { title: "客户名称", dataIndex: "customerName" },
          { title: "客户订单号", dataIndex: "customerOrderNo" },
          { title: "投单人员", dataIndex: "investor" },
          { title: "投单类型", dataIndex: "processingContent" },
          { title: "投单性质", dataIndex: "orderNature" },
          { title: "投单日期", dataIndex: "orderDate" },
          { title: "需求日期", dataIndex: "demandDate" },
          { title: "工件类型", dataIndex: "workpieceTypeName" },
          { title: "加工进度", dataIndex: "processingProgress" },
          { title: "总工时", dataIndex: "totalManHours" },
          { title: "剩余工时", dataIndex: "remainingWork" },
          { title: "G", dataIndex: "g" },
          { title: "EDM", dataIndex: "edm" },
          { title: "WE", dataIndex: "we" },
          { title: "CNC", dataIndex: "cnc" },
          { title: "HNC", dataIndex: "hnc" },
          { title: "M", dataIndex: "m" },
        ];
        const instance = new ElMapExportTable(
          { column, data },
          { progress: progress => this.percentage = progress },// 进度条回调
        );
        instance.download("模具整套进度查询").then((data) => {
          this.openExport = false
        }); // 导出的文件名
      },
      /** 特别关注按钮 */
      handleSpecialAttention() {
        this.specialAttention.open = true
        this.specialAttention.title = "特别关注任务备注"
      },
      /** 特别关注确定按钮 */
      saveSpecialAttention() {
        this.queryParamsSpecial.dispatchOrderNo = this.attentionProdOrderNo
        this.queryParamsSpecial.remark = this.formSpecialAttention.remark
        saveProdDispatchFollow(this.queryParamsSpecial).then(res => {
          this.$modal.msgSuccess("特别关注成功")
          this.specialAttention.open = false
          this.getList()
        })
      },
      /** 多选框禁选 */
      selected(row,index){
        if (row.state === '1') {
          return false //不可勾选
        } else {
          return true; //可勾选
        }
      },
      /** 查看工段工时 */
      handleCheckWorkHours() {
        this.orderRecord.title = "钢件工段工时汇总"
        this.orderRecord.open = true
        this.getListSteelTotal()
      },
      /** 查看电极工段工时 */
      handleCheckEleWorkHours() {
        this.orderEleRecord.title = "电极工段工时汇总"
        this.orderEleRecord.open = true
        this.getListEleTotal()
      },
      /** 查看工件生产进度 */
      handleViewRecord(row) {
        this.$router.push({
          path:'/follow/recording',
          query:{
            dispatchOrderNo:row.dispatchOrderNo
          }
        });
      },
      /** 查看未加工明细 */
      handleCheckWait() {
        this.waitProcess.title = "查看未加工明细"
        this.waitProcess.open = true
        this.getListWaitProcess()
      },

 /** 导出按钮操作 */
      handleExport() {
        this.loading = true
        setTimeout(()=>{
          this.loading=false   //点击一次时隔五秒后才能再次点击
        },3000)
        
        getProdDispatchFollowExport(this.queryParams).then(response => {

             const edmdata = response.data ;
             console.log('edmdata', edmdata)
             const column = [
           { title: "派工单号", dataIndex: "dispatchOrderNo" },
          { title: "模号", dataIndex: "moduleNo" },
          { title: "客户代码", dataIndex: "customerCode" },
          { title: "客户名称", dataIndex: "customerName" },
          { title: "客户订单号", dataIndex: "customerOrderNo" },
          { title: "投单人", dataIndex: "investor" },
          { title: "投单类型", dataIndex: "processingContent" },
          { title: "投单性质", dataIndex: "orderNature" },
          { title: "投单日期", dataIndex: "orderDate" },
          { title: "需求日期", dataIndex: "demandDate" },
          { title: "工件类型名", dataIndex: "workpieceTypeName" },
          { title: "加工进度", dataIndex: "processingProgress" },
          { title: "钢件总工时", dataIndex: "totalManHours" },
          { title: "钢件剩余工时", dataIndex: "remainingWork" },
          { title: "电极总工时", dataIndex: "totalWorkingHoursElectrode" },
          { title: "电极剩余工时", dataIndex: "remainingWorkingHoursElectrode" },
          { title: "G", dataIndex: "g" },
          { title: "EDM", dataIndex: "edm" },
          { title: "WE", dataIndex: "we" },
          { title: "CNC", dataIndex: "cnc" },
          { title: "钢件HNC", dataIndex: "hnc" },
          { title: "电极HNC", dataIndex: "djhnc" },
          { title: "M", dataIndex: "m" },
          { title: "SG", dataIndex: "sg" },
          { title: "QC", dataIndex: "qc" },

          { title: "订单状态", dataIndex: "processingProgress" },
       
            
            
          ];
          const instance = new ElMapExportTable(
            { column,
             data: edmdata   // 这里必须是 data},
            }
          );
          // 导出的文件名
          instance.download("整套进度数据").then((edmdata) => {
            this.loading = false
          }); 
        });
      },
      /** 导出未加工明细 */
      handleExportWait() {
        this.openExport = true;
        var data = this.waitList; // 这里面是数据列表
        const column = [
          { title: "派工单号", dataIndex: "dispatchOrderNo" },
          { title: "模号", dataIndex: "moduleNo" },
          { title: "件号", dataIndex: "pieceNo" },
          { title: "版本", dataIndex: "versionNo" },
          { title: "生产单号", dataIndex: "prodOrderNo" },
          { title: "工序", dataIndex: "sort" },
          { title: "工段", dataIndex: "code" },
          { title: "订单数量", dataIndex: "quantity" },
          { title: "当前状态", dataIndex: "taskStatusName" },
          { title: "工艺工时", dataIndex: "workHour" },
          { title: "已报工时", dataIndex: "assignWork" },
        ];
        const instance = new ElMapExportTable(
          { column, data },
          { progress: progress => this.percentage = progress },// 进度条回调
        );
        instance.download("未加工明细").then((data) => {
          this.openExport = false
        }); // 导出的文件名
      },
      /** 未加工明细查询 */
      handleQueryWait() {
        this.queryParamsWait.pageNo = 1;
        this.getListWaitProcess();
      }
    }
  };
</script>

<style scoped>
  .green-color{
    background: #98FB98;
  }
  .red-color{
    background: #F08080;
    color: #FFFFFF;
  }
  .gray-color{
    background: #B8B8B8;
    color: #FFFFFF;
  }
</style>
