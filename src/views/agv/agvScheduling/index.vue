<template>
  <div class="app-container">
    <div slot="header">
      <el-form :model="queryParams" ref="queryForm" v-show="true" :inline="true"  label-width="90px">
        <el-form-item label="AMR id" prop="orderDate">
          <el-input
            v-model="queryParams.id"
            placeholder="请输入AMR id"
            clearable
            size="small"
            style="width: 220px"
            @keyup.enter.native="handleIdQuery"
          />
        </el-form-item>
        <el-form-item v-loading="loading" style="padding-left: 35px">
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleIdQuery">搜索</el-button>
        </el-form-item>
        <el-form-item label="AMR名称" prop="demandDate">
          <el-input
            v-model="queryParams.name"
            placeholder="请输入AMR名称"
            clearable
            size="small"
            style="width: 220px"
            @keyup.enter.native="handleNameQuery"
          />
        </el-form-item>
        <el-form-item v-loading="loading" style="padding-left: 35px">
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleNameQuery">搜索</el-button>
          <el-button type="warning" plain icon="el-icon-download" size="mini" style="margin-bottom: 10px" @click="handleExport">导出</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-row>
      <el-col :span="24">
        <el-table ref="multipleTable" v-loading="loading" :data="amrList" max-height="750px" border highlight-current-row>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="任务请求" placement="top-start">
              <el-button
                circle
                icon="el-icon-check"
                style="background-color: #F0F3BD;color: #011627"
                @click="taskRequest(scope.row)"
              ></el-button>
            </el-tooltip>
              <el-tooltip class="item" effect="dark" content="调度任务执行情况" placement="top-start">
                <el-button
                  style="background-color: #FF6B6B;color: #ffffff"
                  icon="el-icon-s-order"
                  circle
                  @click="handleImplementation(scope.row)"
                ></el-button>
              </el-tooltip>
              </template>
          </el-table-column>
          <el-table-column label="调度" align="center">
            <template slot-scope="scope">
              <el-tooltip class="item" effect="dark" content="暂停调度任务" placement="top-start">
                <el-button
                  type="warning"
                  icon="el-icon-video-pause"
                  circle
                  @click="dispatchPause(scope.row)"
                ></el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="继续调度任务" placement="top-start">
                <el-button
                  type="primary"
                  icon="el-icon-refresh-left"
                  circle
                  @click="dispatchContinue(scope.row)"
                ></el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="终止调度任务" placement="top-start">
                <el-button
                  type="danger"
                  icon="el-icon-close"
                  circle
                  @click="dispatchStop(scope.row)"
                ></el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="前往最近的等待点" placement="top-start">
                <el-button
                  type="primary"
                  icon="el-icon-s-promotion"
                  circle
                  @click="dispatchGoIdle(scope.row)"
                ></el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="前往最近的休息点" placement="top-start">
                <el-button
                  type="primary"
                  icon="el-icon-s-home"
                  circle
                  @click="dispatchGoResting(scope.row)"
                ></el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="前往充电" placement="top-start">
                <el-button
                  type="primary"
                  icon="el-icon-s-flag"
                  circle
                  @click="dispatchGoCharge(scope.row)"
                ></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column label="id" align="center" prop="id" v-if="false" />
          <el-table-column label="AMR名称" align="center" prop="name" :show-overflow-tooltip="true" />
          <el-table-column label="AMR类型" align="center" prop="type"  />
          <el-table-column label="是否故障" prop="error" align="center" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.status === 'true'" type="danger">是</el-tag>
              <el-tag v-if="scope.row.status === 'false'">否</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="故障内容" align="center" prop="errorMessage"  />
          <el-table-column label="总里程" align="center" prop="meters" />
          <el-table-column label="MAC地址" align="center" prop="deviceId" v-if="false" />
          <el-table-column label="电量" align="center" prop="battery"/>
          <el-table-column label="所处位置" align="center" prop="atPoint"/>
          <el-table-column label="所处位置ID" align="center" width="100px" prop="atPointId" v-if="false"/>
          <el-table-column label="执行任务ID" align="center" width="100px" prop="dispatchId" v-if="false"/>
          <el-table-column label="执行任务文本" align="center" prop="dispatchName"/>
          <el-table-column label="多少任务未完成" align="center" prop="dispatchNum"/>
        </el-table>
        <div align="center">
          <el-pagination @size-change="sizeChange" @current-change="currentChange"
                         :current-page="queryParams.pageNo" :page-size="queryParams.pageSize" :page-sizes="pageSizes"
                         layout="total, sizes, prev, pager, next, jumper" :total="total">
          </el-pagination>
        </div>
        <div align="center">
          <el-row style="margin-top: 30px">
            <el-button
              size="mini"
              round
              type="primary"
              icon="el-icon-refresh"
              @click="updateThingsRequest"
            >更新点位的物料信息</el-button>
            <el-button
              size="mini"
              round
              type="primary"
              icon="el-icon-s-order"
              @click="setPointBusyRequest"
            >点位外部请求占用</el-button>
          </el-row>
        </div>
      </el-col>
    </el-row>

    <!-- 任务请求对话框 -->
    <el-dialog :title="title" :visible.sync="openTaskRequest" width="550px" append-to-body>
      <el-form ref="form" :model="taskRequestTaskForm" :rules="taskRequestRules" label-width="120px">
        <el-form-item label="订单ID" prop="carId">
          <el-input v-model="taskRequestDataForm.orderId" clearable placeholder="请输入订单ID"/>
        </el-form-item>
        <el-form-item label="小车ID" prop="carId">
          <el-input v-model="taskRequestDataForm.carId" clearable placeholder="请输入小车ID"/>
        </el-form-item>
        <el-form-item label="小车设备ID" prop="deviceId">
          <el-input v-model="taskRequestDataForm.deviceId" clearable placeholder="请输入小车设备ID"/>
        </el-form-item>
        <el-form-item label="AMR类型" prop="type">
          <el-select v-model="taskRequestDataForm.type"  filterable placeholder="选择AMR类型" clearable size="small">
            <el-option
              v-for="item in typeList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="任务名称" prop="taskName">
          <el-input v-model="taskRequestDataForm.taskName" clearable placeholder="请输入任务名称"/>
        </el-form-item>
        <el-form-item label="任务Action" prop="action">
          <el-select v-model="taskRequestTaskForm.action" filterable placeholder="选择任务Action" clearable size="small">
            <el-option
              v-for="item in actionList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="任务行为名称" prop="name">
          <el-input v-model="taskRequestTaskForm.name" clearable placeholder="请输入任务行为名称"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitTaskRequest">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

<!--    &lt;!&ndash; AMR调度对话框 &ndash;&gt;-->
<!--    <el-dialog :title="title" :visible.sync="openAmrScheduling" width="550px" append-to-body>-->
<!--      <el-form ref="form" :model="amrScheduleForm" :rules="armScheduleRules" label-width="120px">-->
<!--        <el-form-item label="MES订单ID" prop="orderId">-->
<!--          <el-input v-model="amrScheduleForm.orderId" placeholder="请输入MES订单ID"/>-->
<!--        </el-form-item>-->
<!--        <el-form-item label="AMR起点" prop="fromPoint">-->
<!--          <el-input v-model="amrScheduleForm.fromPoint" placeholder="请输入AMR起点"/>-->
<!--        </el-form-item>-->
<!--        <el-form-item label="AMR起点库位号" prop="fromShellvesId">-->
<!--          <el-input v-model="amrScheduleForm.fromShellvesId" placeholder="请输入AMR起点库位号"/>-->
<!--        </el-form-item>-->
<!--        <el-form-item label="AMR终点" prop="toPoint">-->
<!--          <el-input v-model="amrScheduleForm.toPoint" placeholder="请输入AMR终点"/>-->
<!--        </el-form-item>-->
<!--        <el-form-item label="AMR终点库位号" prop="toShellvesId">-->
<!--          <el-input v-model="amrScheduleForm.toShellvesId" placeholder="请输入AMR终点库位号"/>-->
<!--        </el-form-item>-->
<!--        <el-form-item label="任务Action" prop="action">-->
<!--          <el-select v-model="amrScheduleForm.action" style="width: 390px" filterable placeholder="选择任务Action" clearable size="small">-->
<!--            <el-option-->
<!--              v-for="item in armActionList"-->
<!--              :key="item.value"-->
<!--              :label="item.label"-->
<!--              :value="item.value"-->
<!--            />-->
<!--          </el-select>-->
<!--        </el-form-item>-->
<!--        <el-form-item label="小车ID" prop="carId">-->
<!--          <el-input v-model="amrScheduleForm.carId" placeholder="请输入小车ID"/>-->
<!--        </el-form-item>-->
<!--      </el-form>-->
<!--      <div slot="footer" class="dialog-footer">-->
<!--        <el-button type="primary" @click="submitForm">确 定</el-button>-->
<!--        <el-button @click="scheduleCancel">取 消</el-button>-->
<!--      </div>-->
<!--    </el-dialog>-->

    <!-- 查询调度任务执行情况对话框 -->
    <el-dialog :title="title" :visible.sync="openImplementation" width="1200px" append-to-body>
      <el-table :data="implementationList" v-loading="loading" border>
        <el-table-column type="index" align="center" label="" width="50"></el-table-column>
        <el-table-column prop="carDeviceId" align="center" label="设备 ID"></el-table-column>
        <el-table-column prop="carName" align="center" label="执行AMR名称"></el-table-column>
        <el-table-column prop="taskName" align="center" label="任务名称"></el-table-column>
        <el-table-column prop="taskId" align="center" label="任务ID"></el-table-column>
        <el-table-column prop="createAt" align="center" label="创建时间"></el-table-column>
        <el-table-column prop="endAt" align="center" label="结束时间"></el-table-column>
        <el-table-column prop="taskStatus" align="center" label="任务状态"></el-table-column>
        <el-table-column prop="nextId" align="center" label="后续调度ID" width="100"></el-table-column>
      </el-table>
      <div align="center">
        <el-pagination @size-change="implementationSizeChange" @current-change="implementationCurrentChange"
                       :current-page="queryParamsImplementation.pageNo" :page-size="queryParamsImplementation.pageSize" :page-sizes="pageSizes"
                       layout="total, sizes, prev, pager, next, jumper" :total="implementationTotal">
        </el-pagination>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="ImplementationCancel">关 闭</el-button>
      </div>
    </el-dialog>

    <!-- 更新点位的物料信息对话框 -->
    <el-dialog :title="title" :visible.sync="openUpdateThings" width="550px" append-to-body>
      <el-form ref="form" :model="updateThingsDataForm" :rules="updateThingsRules" label-width="120px">
        <el-form-item label="接料点" prop="point">
          <el-input v-model="updateThingsDataForm.point" clearable placeholder="请输入接料点"/>
        </el-form-item>
        <el-form-item label="件号" prop="itemID">
          <el-input v-model="updateThingsDataForm.itemID" clearable placeholder="请输入件号"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitUpdateThings">确 定</el-button>
        <el-button @click="updateThingsCancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 点位外部请求占用对话框 -->
    <el-dialog :title="title" :visible.sync="openSetPointBusy" width="550px" append-to-body>
      <el-form ref="form" :model="setPointBusyDataForm" :rules="setPointBusyRules" label-width="120px">
        <el-form-item label="要占用的点位" prop="pointList">
          <el-input v-model="setPointBusyDataForm.pointList" clearable placeholder="请输入要占用的点位"/>
        </el-form-item>
        <el-form-item label="是否占用" prop="busy">
          <el-select v-model="setPointBusyDataForm.busy"  filterable placeholder="选择是否占用" clearable size="small">
            <el-option
              v-for="item in busyList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitSetPointBusy">确 定</el-button>
        <el-button @click="setPointBusyCancel">取 消</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { getUserProfile } from '@/api/system/user'
import { listCustomer } from '@/api/system/customer'
import { ElMapExportTable } from 'table-excel'
import {
  amrGetList,
  continueDispatch, goChargeDispatch, goIdleDispatch, goRestingDispatch,
  pauseDispatch, setPointBusyPoints, stopDispatch,
  taskRequest,
  updateThingsPoints
} from '@/api/amr/amr'
import amrRequest from '@/utils/amrRequest'


export default {
  name: 'sapItemNumber',
  data(){
    return {
      // 遮罩层
      loading: false,
      // 总条数
      total: 0,
      implementationTotal: 0,
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 查询参数
      queryParams: {
        pageNo: 1,
        pageSize: 5,
      },
      // 查询参数
      queryParamsImplementation: {
        pageNo: 1,
        pageSize: 5,
      },
      // 查询参数
      queryParamsCustomer: {
        pageNo: 1,
        pageSize: 100000,
      },
      pageSizes: [5, 10, 20, 50, 100],
      //列表初始化
      tableData: [],
      implementationTableData: [],
      // amr列表数据
      amrList: [],
      //客户资料数据
      customerFororder:[],
      // 导入
      fileList: [],
      //选中数组
      Ids:[],
      // 弹出层标题
      title: "",
      // 表单参数
      taskRequestForm: {},
      taskRequestDataForm: {},
      taskRequestTaskForm: {},
      amrScheduleForm:{},
      customerForm:{},
      pauseDispatchForm:{},
      pauseDispatchDataForm:{},
      continueDispatchForm:{},
      continueDispatchDataForm:{},
      stopDispatchForm:{},
      stopDispatchDataForm:{},
      goIdleDispatchForm:{},
      goIdleDispatchDataForm:{},
      goRestingDispatchForm:{},
      goRestingDispatchDataForm:{},
      goChargeDispatchForm:{},
      goChargeDispatchDataForm:{},
      updateThingsForm:{},
      updateThingsDataForm:{},
      setPointBusyForm:{},
      setPointBusyDataForm:{},
      //查询调度任务执行情况列表
      implementationList:[],
      // 是否显示弹出层
      open: false,
      open2: false,
      openExport: false,
      openTaskRequest: false,
      openAmrScheduling: false,
      openImplementation: false,
      openUpdateThings: false,
      openSetPointBusy: false,
      //查询amr临时列表参数
      AmrNameparam:{},
      //AMR类型列表
      typeList:[
        {
          'value': 'Compact',
          'label':'潜入式',
        },
        {
          'value': 'Tugger',
          'label':'牵引式',
        },
        {
          'value': 'Deck',
          'label':'背负式',
        },
        {
          'value': 'Hybrid',
          'label':'复合式',
        },
        {
          'value': 'Conveyor',
          'label':'辊筒式',
        },
        {
          'value': 'ForkLift_1',
          'label':'小地牛',
        },
        {
          'value': 'ForkLift_2',
          'label':'大地牛',
        },
        {
          'value': 'ForkLift_3',
          'label':'高位叉车',
        },
      ],
      //任务行为列表
      actionList:[
        {
          'value': 'route',
          'label':'小车前往某个点位',
        },
        {
          'value': 'scirptTask',
          'label':'小车机构任务',
        },
      ],
      //调度任务行为列表
      armActionList:[
        {
          'value': 'carry',
          'label':'在起点接料,' +
            '在终点卸料',
        },
        {
          'value': 'move-to',
          'label':'AMR移动到终点',
        },
        {
          'value': 'move',
          'label':'AMR从起点前往至终点',
        },
        {
          'value': 'upload',
          'label':'AMR前往起点接料,' +
            '终点如果有值，AMR接完料将开往' +
            '终点',
        },
        {
          'value': 'unload',
          'label':'AMR前往起点卸料,' +
            '终点如果有值，AMR卸完料将开往' +
            '终点，否则开往最近的等待点',
        },
      ],
      busyList:[
        {
          'value': 0,
          'label':'解除占用'
        },
        {
          'value': 1,
          'label':'占用',
        },
      ],
      // 表单校验armScheduleRules
      taskRequestRules: {
        // code: [
        //   { required: true, message: "工序代码不能为空", trigger: "blur" },
          // {
          //   pattern: /[a-zA-z]$/,
          //   message: "工序代码不符合要求",
          //   trigger: "blur"
          // }
        // ],
        action: [
          { required: true, message: "任务Action不能为空", trigger: "blur" }
        ],
        name: [
          { required: true, message: "任务行为名称不能为空", trigger: "blur" }
        ],
      },
      // 更新点位的物料信息表单校验
      updateThingsRules: {
        point: [
          { required: true, message: "接料点不能为空", trigger: "blur" }
        ],
        itemID: [
          { required: true, message: "件号不能为空", trigger: "blur" }
        ],
      },
      //  点位外部请求占用表单校验
      setPointBusyRules: {
        pointList: [
          { required: true, message: "占用点位不能为空", trigger: "blur" }
        ],
        busy: [
          { required: true, message: "占用状态不能为空", trigger: "blur" }
        ],
      },

    }
  },

  created() {
    this.getListAmr()
    this.getListUser()
    this.getListCustomer()

    //加载配置文件

  },

  methods:{
    /** 分页查看AMR信息 */
    getListAmr(){
      this.loading = true
      setTimeout(()=>{
        this.loading = false
      },3000)
      amrGetList().then(response => {
        this.amrList = response.content;
        this.getTabelData();
        this.loading = false;
      });
    },

    /** 根据id分页查看AMR信息 */
    getListAmrId(data){
      this.loading = true
      setTimeout(()=>{
        this.loading = false
      },3000)
      return amrRequest({
        //url: '/api/fexa/v1/external/car/findByDeviceId?key=AIS7ER83RJDFU92ERF'+'&data={"id":"'+ data.deviceId  + '"}',
        url: '/api/fexa/v1/external/car/findByDeviceId/?deviceId='+data.deviceId,
        method: 'get',
      }).then(response => {
        this.amrList = response.content;
        this.getTabelData();
        this.loading = false;
      }
      )
    },

    /** 根据名称分页查看AMR信息 */
    getListAmrName(data){
      this.loading = true
      setTimeout(()=>{
        this.loading = false
      },3000)
      return amrRequest({
        url: '/api/fexa/v1/external/car/findByName?key=AIS7ER83RJDFU92ERF'+'&data={"name":"'+ data + '"}',
        method: 'get',
      }).then(response => {
        this.amrList = response.content;
        this.getTabelData();
        this.loading = false;
      }
      )
    },

    //获取表格数据，自行分页（splice）
    getTabelData() {
      let data=JSON.parse(JSON.stringify(this.amrList))
      this.tableData = data.splice(
        (this.queryParams.pageNo - 1) * this.queryParams.pageSize,
        this.queryParams.pageSize
      );
      this.total=this.amrList.length
    },

    //page改变时的回调函数，参数为当前页码
    currentChange(val) {
      // console.log("翻页，当前为第几页", val);
      this.queryParams.pageNo = val;
      this.getTabelData();
    },

    //size改变时回调的函数，参数为当前的size
    sizeChange(val) {
      // console.log("改变每页多少条，当前一页多少条数据", val);
      this.queryParams.pageSize = val;
      this.queryParams.pageNo = 1;
      this.getTabelData();
    },

    //获取表格数据，自行分页（splice）
    getTabelDataImplementation() {
      let data=JSON.parse(JSON.stringify(this.implementationList))
      this.implementationTableData = data.splice(
        (this.queryParamsImplementation.pageNo - 1) * this.queryParamsImplementation.pageSize,
        this.queryParamsImplementation.pageSize
      );
      this.implementationTotal=this.implementationList.length
    },

    //page改变时的回调函数，参数为当前页码
    implementationCurrentChange(val) {
      // console.log("翻页，当前为第几页", val);
      this.queryParamsImplementation.pageNo = val;
      this.getTabelDataImplementation();
    },

    //size改变时回调的函数，参数为当前的size
    implementationSizeChange(val) {
      // console.log("改变每页多少条，当前一页多少条数据", val);
      this.queryParamsImplementation.pageSize = val;
      this.queryParamsImplementation.pageNo = 1;
      this.getTabelDataImplementation();
    },

    /** 搜索按钮操作 */
    handleIdQuery() {
      if(this.queryParams.id === undefined || this.queryParams.id === ''){
        this.getListAmr()
      }else{
        this.queryParams.pageNo = 1;
        this.getListAmrId(this.queryParams.id)
      }
    },

    /** 搜索按钮操作 */
    handleNameQuery() {
      if(this.queryParams.name === undefined || this.queryParams.name === ''){
        this.getListAmr()
      }else{
        this.queryParams.pageNo = 1;
        this.getListAmrName(this.queryParams.name)
      }
    },

    /** 查询登录用户信息*/
    getListUser() {
      getUserProfile().then(res => {
      });
    },

    /** 查询客户信息列表 */
    getListCustomer() {
      this.loading = true;
      listCustomer(this.queryParamsCustomer).then(response => {
        this.customerFororder = response.data.records;
      });
    },

    /** 任务请求按钮操作 */
    taskRequest(row){
      this.taskRequestReset();
      this.title = "任务请求";
      this.openTaskRequest = true;
      this.taskRequestForm.key = 'AIS7ER83RJDFU92ERF'
      this.$set(this.taskRequestDataForm, 'carId', row.id)
      this.$set(this.taskRequestDataForm, 'deviceId', row.deviceId)
    },

    /**  任务请求确定按钮操作 */
    submitTaskRequest(){
      this.taskRequestDataForm.task = this.taskRequestTaskForm
      this.taskRequestForm.data = this.taskRequestDataForm
      this.$refs["form"].validate(valid => {
        if(valid){
          taskRequest(this.taskRequestForm).then(res => {
            if(res.status == 200){
              this.$modal.msgSuccess("任务请求成功"+'执行任务id为'+ res.content.dispatchId + '执行任务名称为' + res.content.dispatchName);
            }else{
              this.$modal.msgError('任务请求失败，请重试')
            }
            this.openTaskRequest = false
          })
        }
      })
    },

    /** 任务请求取消按钮操作 */
    cancel(){
      this.openTaskRequest = false;
      this.taskRequestReset()
    },

    /** 查询调度任务执行情况按钮操作 */
    handleImplementation(data){
      this.title = "调度任务执行情况";
      this.openImplementation = true;
      return amrRequest({
        url: '/api/fexa/v1/external/dispatch/findById?id='+ data.id,
        method: 'get',
      }).then(res => {
        this.implementationList = res.content
      })
    },

    /** 调度任务执行情况取消按钮操作 */
    ImplementationCancel(){
      this.openImplementation = false;
    },

    /**  暂停调度任务 */
    dispatchPause(data){
      this.loading = true
      setTimeout(()=>{
        this.loading = false
      },3000)
      this.pauseDispatchForm.key = 'AIS7ER83RJDFU92ERF'
      this.pauseDispatchDataForm.id = data.id
      this.pauseDispatchForm.data = this.pauseDispatchDataForm
      pauseDispatch(this.pauseDispatchForm).then(res =>{
        if(res.status == 200){
          this.loading = false
          this.$modal.msgSuccess(res.content);
        }else{
          this.$modal.msgError('任务请求失败，请重试')
        }
      })
    },

    /**  继续调度任务 */
    dispatchContinue(data){
      this.loading = true
      setTimeout(()=>{
        this.loading = false
      },3000)
      this.continueDispatchForm.key = 'AIS7ER83RJDFU92ERF'
      this.continueDispatchDataForm.id = data.id
      this.continueDispatchForm.data = this.continueDispatchDataForm
      continueDispatch(this.continueDispatchForm).then(res =>{
        if(res.status == 200){
          this.loading = false
          this.$modal.msgSuccess(res.content);
        }else{
          this.$modal.msgError('任务请求失败，请重试')
        }
      })
    },

    /**  终止调度任务 */
    dispatchStop(data){
      this.loading = true
      setTimeout(()=>{
        this.loading = false
      },3000)
      this.stopDispatchForm.key = 'AIS7ER83RJDFU92ERF'
      this.stopDispatchDataForm.id = data.id
      this.stopDispatchForm.data = this.stopDispatchDataForm
      stopDispatch(this.stopDispatchForm).then(res =>{
        if(res.status == 200){
          this.loading = false
          this.$modal.msgSuccess(res.content);
        }else{
          this.$modal.msgError('任务请求失败，请重试')
        }
      })
    },

    /**  AMR 前往最近的等待点 */
    dispatchGoIdle(data){
      this.loading = true
      setTimeout(()=>{
        this.loading = false
      },3000)
      this.goIdleDispatchForm.key = 'AIS7ER83RJDFU92ERF'
      this.goIdleDispatchDataForm.carId = data.id
      this.goIdleDispatchForm.data = this.goIdleDispatchDataForm
      goIdleDispatch(this.goIdleDispatchForm).then(res =>{
        if(res.status == 200){
          this.loading = false
          this.$modal.msgSuccess('操作成功！' + res.content.name);
        }else{
          this.$modal.msgError('请求失败，请重试')
        }
      })
    },

    /**  AMR 前往最近的休息点 */
    dispatchGoResting(data){
      this.loading = true
      setTimeout(()=>{
        this.loading = false
      },3000)
      this.goRestingDispatchForm.key = 'AIS7ER83RJDFU92ERF'
      this.goRestingDispatchDataForm.carId = data.id
      this.goRestingDispatchForm.data = this.goRestingDispatchDataForm
      goRestingDispatch(this.goRestingDispatchForm).then(res =>{
        if(res.status == 200){
          this.loading = false
          this.$modal.msgSuccess('操作成功！' + res.content.name);
        }else{
          this.$modal.msgError('请求失败，请重试')
        }
      })
    },

    /**  AMR 前往充电 */
    dispatchGoCharge(data){
      this.loading = true
      setTimeout(()=>{
        this.loading = false
      },3000)
      this.goChargeDispatchForm.key = 'AIS7ER83RJDFU92ERF'
      this.goChargeDispatchDataForm.carId = data.id
      this.goChargeDispatchForm.data = this.goChargeDispatchDataForm
      goChargeDispatch(this.goChargeDispatchForm).then(res =>{
        if(res.status == 200){
          this.loading = false
          this.$modal.msgSuccess('操作成功！' + res.content.name);
        }else{
          this.$modal.msgError('请求失败，请重试')
        }
      })
    },

    /** 更新点位的物料信息按钮操作 */
    updateThingsRequest(){
      this.updateThingsReset();
      this.title = "更新点位的物料信息";
      this.openUpdateThings = true;
      this.updateThingsForm.key = 'AIS7ER83RJDFU92ERF'
    },

    /** 更新点位的物料信息提交按钮操作 */
    submitUpdateThings(){
      this.updateThingsForm.data = this.updateThingsDataForm
      this.$refs["form"].validate(valid => {
        if(valid){
          updateThingsPoints(this.updateThingsForm).then(res => {
            if(res.status == 200){
              this.$modal.msgSuccess(res.message);
            }else{
              this.$modal.msgError('请求失败，请重试')
            }
            this.openUpdateThings = false;
          })
        }
      })
    },

    /** 更新点位的物料信息取消按钮操作 */
    updateThingsCancel(){
      this.openUpdateThings = false;
      this.updateThingsReset();
    },

    /** 点位外部请求占用按钮操作 */
    setPointBusyRequest(){
      this.setPointBusyReset();
      this.title = "点位外部请求占用";
      this.openSetPointBusy = true;
      this.setPointBusyForm.key = 'AIS7ER83RJDFU92ERF'
    },

    /** 点位外部请求占用确定按钮操作 */
    submitSetPointBusy(){
      this.setPointBusyForm.data = this.setPointBusyDataForm
      this.$refs["form"].validate(valid => {
        if(valid){
          setPointBusyPoints(this.setPointBusyForm).then(res => {
            if(res.status == 200){
              this.$modal.msgSuccess(res.message);
            }else{
              this.$modal.msgError('请求失败，请重试')
            }
            this.openUpdateThings = false;
          })
        }
      })
    },

    /** 点位外部请求占用取消按钮操作 */
    setPointBusyCancel(){
      this.openSetPointBusy = false;
      this.setPointBusyReset();
    },

    /** 表单重置 */
    setPointBusyReset() {
      this.setPointBusyDataForm = {
        pointList: undefined,
        busy: undefined,
      }
      this.resetForm("form");
    },

    /** 表单重置 */
    updateThingsReset() {
      this.updateThingsDataForm = {
        point: undefined,
        itemID: undefined,
      }
      this.resetForm("form");
    },

    /** 表单重置 */
    taskRequestReset() {
      this.taskRequestDataForm = {
        orderId:undefined,
        carId: undefined,
        deviceId: undefined,
        type: undefined,
        taskName: undefined,
      }
      this.taskRequestTaskForm = {
        action: undefined,
        name: undefined,
      }
      this.resetForm("form");
    },

    /** 导出按钮操作 */
    handleExport() {
      this.openExport = true;
      var data = this.sheduleList; // 这里面是数据列表
      const column = [
        { title: "id", dataIndex: "id" },
        { title: "AMR名称", dataIndex: "name" },
        { title: "AMR类型", dataIndex: "type" },
        { title: "是否故障", dataIndex: "error" },
        { title: "故障内容", dataIndex: "errorMessage" },
        { title: "总里程", dataIndex: "meters" },
        { title: "MAC地址", dataIndex: "deviceId" },
        { title: "电量", dataIndex: "battery" },
        { title: "使用地图", dataIndex: "map" },
        { title: "地图 ID", dataIndex: "mapId" },
        { title: "所处位置", dataIndex: "atPoint" },
        { title: "所处位置 ID", dataIndex: "atPointId" },
        { title: "位置偏差", dataIndex: "deviation" },
        { title: "AMR旋转速度", dataIndex: "rad" },
        { title: "执行任务 ID", dataIndex: "dispatchId" },
        { title: "执行任务文本", dataIndex: "dispatchName" },
        { title: "多少任务未完成", dataIndex: "dispatchNum" },
      ];
      const instance = new ElMapExportTable(
        { column, data },
        { progress: progress => this.percentage = progress },// 进度条回调
      );
      instance.download("AMR信息列表").then((data) => {
        this.openExport = false
      }); // 导出的文件名
    },
  }
}
</script>

