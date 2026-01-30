<template>
  <div class="app-container">
    <el-card>
      <el-form :model="queryParams" ref="queryForm" :inline="true">
        <el-row>
          <el-form-item label="开始时间：" prop="beginTime">
            <el-date-picker
              v-model="queryParams.beginTime"
              type="date"
              placeholder="选择日期时间"
              value-format="yyyy-MM-dd">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="结束时间：" prop="endTime">
            <el-date-picker
              v-model="queryParams.endTime"
              type="date"
              placeholder="选择日期时间"
              value-format="yyyy-MM-dd">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="派工单号：" prop="dispatchOrderNo">
            <el-input
              v-model="queryParams.dispatchOrderNo"
              placeholder="请输入派工单号"
              clearable
              size="small"
              style="width: 200px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="生产单号：" prop="prodOrderNo">
            <el-input
              v-model="queryParams.prodOrderNo"
              placeholder="请输入生产单号"
              clearable
              size="small"
              style="width: 220px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="模号：" prop="moduleNo">
            <el-input
              v-model="queryParams.moduleNo"
              placeholder="请输入模号"
              clearable
              size="small"
              style="width: 220px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="件号：" prop="pieceNo">
            <el-input
              v-model="queryParams.pieceNo"
              placeholder="请输入件号"
              clearable
              size="small"
              style="width: 220px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
<!--          <el-form-item label="订单状态：" prop="orderState">-->
<!--            <el-select v-model="queryParams.orderState" placeholder="请选择" clearable>-->
<!--              <el-option-->
<!--                v-for="item in order_state"-->
<!--                :key="item.value"-->
<!--                :label="item.label"-->
<!--                :value="item.value"-->
<!--              ></el-option>-->
<!--            </el-select>-->
<!--          </el-form-item>-->
          <el-form-item label="排产状态：" prop="orderPlanState">
            <el-select v-model="queryParams.orderPlanState" placeholder="请选择" clearable>
              <el-option
                v-for="item in order_plan_state"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button style="margin-left: 10px" type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
          </el-form-item>
        </el-row>
      </el-form>
    </el-card>

    <!-- 主内容区域 - 上下布局 -->
    <div class="main-content">
      <!-- 上方派工单主信息 - 占满全部宽度 -->
      <el-card class="box-card top-card" shadow="hover">
        <div slot="header" class="clearfix">
          <span class="card-title">派工单主信息</span>
        </div>
        <el-table
          v-loading="loading"
          :data="sheduleList"
          border
          highlight-current-row
          @row-click="handleRowClick"
          style="width: 100%">
          <el-table-column type="index" width="50" label="序号" align="center"/>
          <el-table-column label="派工单号" align="center" prop="dispatchOrderNo" width="110"/>
          <el-table-column label="模号" align="center" prop="moduleNo" width="130"/>
          <el-table-column label="件号" align="center" prop="pieceNo" width="100"/>
          <el-table-column label="生产单号" align="center" prop="prodOrderNo" width="125">
            <template slot-scope="scope">
              <span v-if="scope.row.electrodeNo && scope.row.electrodeNo !== '0'">{{scope.row.prodOrderNo}}-{{scope.row.electrodeNo}}</span>
              <span v-else>{{scope.row.prodOrderNo}}</span>
            </template>
          </el-table-column>
          <el-table-column label="需求日期" align="center" prop="demandDate" width="100"/>
          <el-table-column label="订单数量" align="center" prop="quantity" width="100"/>
          <el-table-column label="订单状态" align="center" prop="orderState" width="100">
            <template slot-scope="scope">
              <el-tag :type="scope.row.orderState === '1' ? 'success' : 'primary'">
                {{ scope.row.orderState === '1' ? '已完结' : '进行中' }}
              </el-tag>
            </template>
          </el-table-column>
        </el-table>
        <!-- 固定分页为10条 -->
        <div class="pagination-container">
          <el-pagination
            v-show="total>0"
            :total="total"
            :current-page.sync="queryParams.pageNo"
            :page-size.sync="queryParams.pageSize"
            :page-sizes="[10]"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </el-card>

      <!-- 下方子排产计划 - 占满全部宽度 -->
      <el-card class="box-card bottom-card" shadow="hover">
        <div slot="header" class="clearfix">
          <span class="card-title">子排产计划</span>
        </div>
        <el-table
          v-loading="subLoading"
          :data="subScheduleList"
          border
          style="width: 100%"
          @selection-change="handleSubSelectionChange">
          <el-table-column type="selection" width="55" align="center"></el-table-column>
          <el-table-column label="工段" align="center" prop="section" width="100"/>
          <!-- 新增：工段顺序列 -->
          <el-table-column label="工段顺序" align="center" prop="sort" width="100">
            <template slot-scope="scope">
              <span>{{ scope.row.sort || '-' }}</span>
            </template>
          </el-table-column>
          <!-- 排产日期列 -->
          <el-table-column label="排产开始时间" align="center" prop="planDate" width="140">
            <template slot-scope="scope">
              <span>{{ formatPlanDate(scope.row.planDate) }}</span>
            </template>
          </el-table-column>
          <!-- 排产结束时间列 -->
          <el-table-column label="排产结束时间" align="center" prop="planEndTime" width="140">
            <template slot-scope="scope">
              <span>{{ formatPlanDate(scope.row.planEndTime) }}</span>
            </template>
          </el-table-column>
          <!-- 编程状态列 -->
          <el-table-column label="编程状态" align="center" prop="designStatus" width="120">
            <template slot-scope="scope">
              <el-tag
                :type="getDesignStatusType(scope.row.designStatus)">
                {{ getDesignStatusText(scope.row.designStatus) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="工件类型" align="center" prop="workpieceType" width="100"/>
          <el-table-column label="生产单号" align="center" prop="prodOrderNo" width="130"/>
          <el-table-column label="机台设备" align="center" prop="equipment" width="100"/>
          <el-table-column label="加工时间(h)" align="center" prop="processTime" width="110">
            <template slot-scope="scope">
              <span>{{ scope.row.processTime || '-' }}</span>
            </template>
          </el-table-column>
          <!-- 出货流转时间列 -->
          <el-table-column label="出货流转时间(h)" align="center" prop="circulationTime" width="120">
            <template slot-scope="scope">
              <span>{{ formatCirculationTime(scope.row.circulationTime) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="加工状态" align="center" prop="processStatus" width="100">
            <template slot-scope="scope">
              <el-tag
                :type="scope.row.processStatus === '已完成' ? 'success' :
                      (scope.row.processStatus === '加工中' ? 'warning' :
                      (scope.row.processStatus === '待领取' ? 'info' :
                      (scope.row.processStatus === '无' ? 'danger' : 'primary')))">
                {{scope.row.processStatus || '待加工'}}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="电极数量" align="center" prop="electrodeQty" width="90">
            <template slot-scope="scope">
              <span
                v-if="scope.row.electrodeQty && scope.row.electrodeQty > 0"
                class="electrode-count-link"
                @click="handleElectrodeDetail(scope.row)"
              >
                {{ scope.row.electrodeQty }}
              </span>
              <span v-else>{{ scope.row.electrodeQty || 0 }}</span>
            </template>
          </el-table-column>
          <el-table-column label="添加人" align="center" prop="createBy" width="100"/>
          <el-table-column label="添加时间" align="center" prop="createTime" width="150">
            <template slot-scope="scope">
              <span>{{ formatTimestamp(scope.row.createTime) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="更新人" align="center" prop="updateBy" width="100"/>
          <el-table-column label="更新时间" align="center" prop="updateTime" width="150">
            <template slot-scope="scope">
              <span>{{ formatTimestamp(scope.row.updateTime) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="120" fixed="right">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="primary"
                icon="el-icon-edit"
                @click="handleEdit(scope.row)"
              >编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>

    <!-- 子排产计划编辑对话框 -->
    <el-dialog :title="subScheduleFormTitle" :visible.sync="openSubScheduleForm" width="500px" append-to-body @close="handleDialogClose">
      <el-form :model="subScheduleForm" :rules="subScheduleRules" ref="subScheduleFormRef" label-width="120px">
        <el-form-item label="工段" prop="section">
          <el-input v-model="subScheduleForm.section" placeholder="请输入工段" :disabled="true"></el-input>
        </el-form-item>
        <!-- 排产日期字段 -->
        <el-form-item label="排产开始时间" prop="planDate">
          <el-date-picker
            v-model="subScheduleForm.planDate"
            type="datetime"
            placeholder="选择排产日期"
            value-format="yyyy-MM-dd HH:mm:ss"
            format="yyyy-MM-dd HH:mm:ss"
            style="width: 100%">
          </el-date-picker>
        </el-form-item>
        <!-- 排产结束时间字段 -->
        <el-form-item label="排产结束时间" prop="planEndTime">
          <el-date-picker
            v-model="subScheduleForm.planEndTime"
            type="datetime"
            placeholder="选择排产结束时间"
            value-format="yyyy-MM-dd HH:mm:ss"
            format="yyyy-MM-dd HH:mm:ss"
            style="width: 100%">
          </el-date-picker>
        </el-form-item>
        <!-- 编程状态显示 -->
        <el-form-item label="编程状态" prop="designStatus">
          <el-input
            :value="getDesignStatusText(subScheduleForm.designStatus)"
            placeholder="编程状态"
            :disabled="true"
            style="width: 100%">
          </el-input>
        </el-form-item>
        <el-form-item label="工件类型" prop="workpieceType">
          <el-input v-model="subScheduleForm.workpieceType" placeholder="请输入工件类型" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="生产单号" prop="prodOrderNo">
          <el-input v-model="subScheduleForm.prodOrderNo" placeholder="请输入生产单号" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="机台设备" prop="equipment">
          <el-select
            v-model="subScheduleForm.equipment"
            placeholder="请选择机台设备"
            style="width: 100%"
            clearable
            filterable>
            <el-option
              v-for="item in equipmentOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="加工时间(h)" prop="processTime">
          <el-input-number
            v-model="subScheduleForm.processTime"
            :min="0"
            :precision="2"
            :step="0.5"
            style="width: 100%"
            placeholder="请输入加工时间"
          >
          </el-input-number>
        </el-form-item>
        <!-- 出货流转时间字段 -->
        <el-form-item label="出货流转时间(h)" prop="circulationTime">
          <el-input-number
            v-model="subScheduleForm.circulationTime"
            :min="0"
            :precision="2"
            :step="0.5"
            style="width: 100%"
            placeholder="请输入出货流转时间"
            :controls="false"
            @change="handleCirculationTimeChange">
          </el-input-number>
          <div class="time-controls" style="margin-top: 8px;">
            <el-button size="mini" @click="adjustCirculationTime(-0.5)">-0.5h</el-button>
            <el-button size="mini" @click="adjustCirculationTime(0.5)">+0.5h</el-button>
            <el-button size="mini" @click="resetCirculationTime">重置为1h</el-button>
          </div>
        </el-form-item>
        <el-form-item label="加工状态" prop="processStatus">
          <el-input
            :value="subScheduleForm.processStatus"
            placeholder="加工状态"
            :disabled="true"
            style="width: 100%">
          </el-input>
        </el-form-item>
        <el-form-item label="电极数量" prop="electrodeQty">
          <el-input-number
            v-model="subScheduleForm.electrodeQty"
            :min="0"
            style="width: 100%"
            placeholder="请输入电极数量"
            :disabled="true">
          </el-input-number>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="openSubScheduleForm = false">取 消</el-button>
        <el-button type="primary" @click="submitSubScheduleForm">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 电极详情对话框 -->
    <el-dialog
      title="电极详情"
      :visible.sync="openElectrodeDetail"
      width="800px"
      append-to-body
      :close-on-click-modal="false">
      <el-table
        v-loading="electrodeLoading"
        :data="electrodeList"
        border
        style="width: 100%">
        <el-table-column label="电极编号" align="center" prop="electrodeBno" width="120"/>
        <el-table-column label="电极状态" align="center" prop="status" width="100">
          <template slot-scope="scope">
            <el-tag
              :type="scope.row.status === '-1' ? 'danger' :
            (scope.row.status === '0' ? 'info' :
            (scope.row.status === '1' ? 'success' :
            (scope.row.status === '2' ? 'warning' :
            (scope.row.status === '4' ? 'primary' : 'default'))))">
              {{
                scope.row.status === '-1' ? '报废' :
                  scope.row.status === '0' ? '已备料' :
                    scope.row.status === '1' ? '已入库' :
                      scope.row.status === '2' ? '已出库' :
                        scope.row.status === '4' ? '还库' :
                          scope.row.status === '5' ? '已解绑' : '未知'
              }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="电极库位" align="center" prop="processPosition" width="120"/>
        <el-table-column label="电极结果" align="center" prop="measureResult" width="120">
          <template slot-scope="scope">
            <el-tag
              :type="scope.row.measureResult === 'OK' ? 'success' :
          (scope.row.measureResult === 'NG' ? 'danger' : 'info')">
              {{
                scope.row.measureResult === 'OK' ? '合格' :
                  scope.row.measureResult === 'NG' ? '不合格' : '待检测'
              }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="材料" align="center" prop="electrodeMaterial" width="100"/>
      </el-table>

      <div slot="footer" class="dialog-footer">
        <el-button @click="openElectrodeDetail = false">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getProdSchedulePlanPage,
  getProdSchedulePlan,
  getProdPlanEl,
  updateProdPlanEl,
  getEquipmentSectionOne
} from "../../../api/follow/recording";

export default {
  name: "ScheduleManagement",
  data() {
    return {
      // 查询参数
      queryParams: {
        pageNo: 1,
        pageSize: 10, // 固定为10条
        beginTime: undefined,
        endTime: undefined,
        dispatchOrderNo: undefined,
        prodOrderNo: undefined,
        moduleNo: undefined,
        pieceNo: undefined,
        orderState: undefined,
        orderPlanState: undefined
      },
      // 派工单列表
      sheduleList: [],
      // 子排产计划列表
      subScheduleList: [],
      // 选中的子排产计划
      selectedSubSchedules: [],
      // 电极列表
      electrodeList: [],
      // 设备工段选项
      equipmentOptions: [],
      // 加载状态
      loading: false,
      subLoading: false,
      electrodeLoading: false,
      // 总数
      total: 0,
      // 订单状态选项
      order_state: [
        {value: '0', label: '进行中'},
        {value: '1', label: '已完结'}
      ],
      order_plan_state: [
        {value: '0', label: '已排产'},
        {value: '1', label: '未排产'}
      ],
      // 子排产计划表单
      subScheduleForm: {
        id: undefined,
        section: '',
        planDate: '',
        planEndTime: '',
        workpieceType: '',
        prodOrderNo: '',
        equipment: '',
        processTime: 0,
        circulationTime: 1.0, // 出货流转时间，默认1小时
        processStatus: '无',
        designStatus: undefined,
        electrodeQty: 0,
        createBy: '',
        updateBy: ''
      },
      // 子排产计划表单验证规则
      subScheduleRules: {
        section: [{required: true, message: '工段不能为空', trigger: 'blur'}],
        workpieceType: [{required: true, message: '工件类型不能为空', trigger: 'blur'}],
        prodOrderNo: [{required: true, message: '生产单号不能为空', trigger: 'blur'}],
        equipment: [{required: true, message: '机台设备不能为空', trigger: 'change'}],
        processStatus: [{required: true, message: '加工状态不能为空', trigger: 'change'}],
        processTime: [{type: 'number', min: 0, message: '加工时间必须大于等于0', trigger: 'blur'}],
        circulationTime: [{type: 'number', min: 0, message: '出货流转时间必须大于等于0', trigger: 'blur'}],
        // 排产结束时间的验证
        planEndTime: [
          {
            validator: (rule, value, callback) => {
              if (!value) {
                callback();
                return;
              }
              if (this.subScheduleForm.planDate && value) {
                const startTime = new Date(this.subScheduleForm.planDate).getTime();
                const endTime = new Date(value).getTime();
                if (endTime < startTime) {
                  callback(new Error('排产结束时间不能早于排产开始时间'));
                } else {
                  callback();
                }
              } else {
                callback();
              }
            },
            trigger: 'blur'
          }
        ]
      },
      // 子排产计划表单标题
      subScheduleFormTitle: '',
      // 对话框显示状态
      openSubScheduleForm: false,
      openElectrodeDetail: false,
      // 当前选中的电极数据
      currentElectrodeData: null,
      // 当前选中的派工单生产单号
      currentProdOrderNo: ''
    }
  },
  computed: {
    // 添加计算属性来处理编程状态的显示
    designStatusText() {
      return this.getDesignStatusText(this.subScheduleForm.designStatus);
    }
  },
  created() {
    this.getList();
  },
  methods: {
    // 获取派工单列表
    getList() {
      this.loading = true;
      getProdSchedulePlanPage(this.queryParams).then(response => {
        if (response.code === 200) {
          this.sheduleList = response.data.records || [];
          this.total = response.data.total || 0;
        } else {
          this.$message.error(response.msg || '获取数据失败');
          this.sheduleList = [];
          this.total = 0;
        }
      }).catch(error => {
        console.error('获取派工单列表失败:', error);
        this.$message.error('获取数据失败');
        this.sheduleList = [];
        this.total = 0;
      }).finally(() => {
        this.loading = false;
      });
    },

    // 获取编程状态文本 - 修复版本
    getDesignStatusText(status) {
      // 处理空值或未定义
      if (status === null || status === undefined || status === '') {
        return '无';
      }

      // 确保状态值是数字
      const statusNum = parseInt(status);

      const statusMap = {
        0: '待领取',
        1: '已领取',
        2: '已开始',
        3: '已暂停',
        4: '已完成',
        5: '已放弃',
        6: '订单已暂停',
        7: '订单已取消'
      };

      return statusMap[statusNum] || '无';
    },

    // 获取编程状态标签类型 - 修复版本
    getDesignStatusType(status) {
      // 处理空值或未定义
      if (status === null || status === undefined || status === '') {
        return 'default';
      }

      // 确保状态值是数字
      const statusNum = parseInt(status);

      const typeMap = {
        0: 'info',
        1: 'primary',
        2: 'warning',
        3: 'warning',
        4: 'success',
        5: 'danger',
        6: 'info',
        7: 'danger'
      };

      return typeMap[statusNum] || 'default';
    },

    // 点击行事件 - 加载对应的子排产计划
    handleRowClick(row) {
      console.log('选中派工单:', row);
      this.currentProdOrderNo = row.prodOrderNo;
      this.loadSubScheduleList(row.prodOrderNo);
    },

    // 加载子排产计划 - 根据生产单号加载
    loadSubScheduleList(prodOrderNo) {
      this.subLoading = true;

      const queryParams = {
        prodOrderNo: prodOrderNo
      };

      // 调用真实接口获取子排产计划数据
      getProdSchedulePlan(queryParams).then(response => {
        if (response.code === 200) {
          // 处理接口返回的数据
          if (response.data && Array.isArray(response.data)) {
            this.subScheduleList = response.data;
            console.log('获取到的子排产计划数据:', this.subScheduleList);
          } else {
            this.subScheduleList = [];
          }

          // 如果没有数据，显示提示信息
          if (this.subScheduleList.length === 0) {
            this.$message.info('该生产单号暂无子排产计划数据');
          }
        } else {
          this.$message.error(response.msg || '获取子排产计划失败');
          this.subScheduleList = [];
        }
      }).catch(error => {
        console.error('获取子排产计划失败:', error);
        this.$message.error('获取子排产计划数据失败');
        this.subScheduleList = [];
      }).finally(() => {
        this.subLoading = false;
      });
    },

    // 点击电极数量查看详情
    handleElectrodeDetail(row) {
      this.currentElectrodeData = row;
      this.openElectrodeDetail = true;
      this.loadElectrodeData(row);
    },

    // 加载电极数据
    loadElectrodeData(row) {
      this.electrodeLoading = true;

      // 构建查询参数：生产单号和工段
      const queryParams = {
        prodOrderNo: row.prodOrderNo,  // 生产单号
        code: row.section              // 工段
      };

      console.log('查询电极参数:', queryParams);

      // 调用真实接口获取电极数据
      getProdPlanEl(queryParams).then(response => {
        if (response.code === 200) {
          // 处理接口返回的数据
          if (response.data && Array.isArray(response.data)) {
            this.electrodeList = response.data;
            console.log('获取到的电极数据:', this.electrodeList);

            // 如果没有数据，显示提示信息
            if (this.electrodeList.length === 0) {
              this.$message.info('该工段暂无电极数据');
            }
          } else if (response.data) {
            // 如果返回的不是数组，尝试转换为数组
            this.electrodeList = [response.data];
          } else {
            this.electrodeList = [];
            this.$message.info('该工段暂无电极数据');
          }
        } else {
          this.$message.error(response.msg || '获取电极数据失败');
          this.electrodeList = [];
        }
      }).catch(error => {
        console.error('获取电极数据失败:', error);
        this.$message.error('获取电极数据失败');
        this.electrodeList = [];
      }).finally(() => {
        this.electrodeLoading = false;
      });
    },

    // 根据工段获取设备选项
    async loadEquipmentOptions(section) {
      if (!section) {
        this.equipmentOptions = [];
        return;
      }

      try {
        // 调用获取设备工段的API，将工段作为manHourName参数传递给后端
        const response = await getEquipmentSectionOne({manHourName: section});

        if (response.code === 200) {
          // 处理返回的设备数据
          if (Array.isArray(response.data)) {
            this.equipmentOptions = response.data.map(item => ({
              value: item.value || item.deviceNo || item.deviceNo,
              label: item.label || item.deviceNo || item.deviceNo
            }));
          } else {
            console.warn('获取到的设备工段数据不是数组格式:', response.data);
            this.equipmentOptions = [];
          }
        } else {
          this.$message.error(response.msg || '获取设备工段失败');
          this.equipmentOptions = [];
        }
      } catch (error) {
        console.error('获取设备工段失败:', error);
        this.$message.error('获取设备工段失败');
        this.equipmentOptions = [];
      }
    },

    // 格式化日期
    formatDate(date) {
      try {
        // 如果是时间戳（数字类型），转换为 Date 对象
        if (typeof date === 'number') {
          const dateObj = new Date(date);
          const year = dateObj.getFullYear();
          const month = String(dateObj.getMonth() + 1).padStart(2, '0');
          const day = String(dateObj.getDate()).padStart(2, '0');
          return `${year}-${month}-${day}`;
        }

        // 如果是字符串，直接返回
        if (typeof date === 'string') {
          return date;
        }

        // 其他情况尝试转换
        return this.$dayjs(date).format('YYYY-MM-DD');
      } catch (error) {
        console.error('日期格式化错误:', error);
        return '-';
      }
    },

    // 格式化排产日期 - 新增专用方法
    formatPlanDate(planDate) {
      if (!planDate) return '-';

      try {
        // 如果是时间戳（数字类型）
        if (typeof planDate === 'number') {
          const dateObj = new Date(planDate);
          const year = dateObj.getFullYear();
          const month = String(dateObj.getMonth() + 1).padStart(2, '0');
          const day = String(dateObj.getDate()).padStart(2, '0');
          const hours = String(dateObj.getHours()).padStart(2, '0');
          const minutes = String(dateObj.getMinutes()).padStart(2, '0');
          const seconds = String(dateObj.getSeconds()).padStart(2, '0');
          return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
        }

        // 如果是字符串，检查格式
        if (typeof planDate === 'string') {
          // 如果是完整的时间戳字符串
          if (planDate.includes('-') && planDate.includes(':')) {
            return planDate;
          }
          // 如果是时间戳字符串
          if (!isNaN(planDate)) {
            return this.formatPlanDate(Number(planDate));
          }
        }

        return '-';
      } catch (error) {
        console.error('排产日期格式化错误:', error, planDate);
        return '-';
      }
    },

    // 格式化出货流转时间
    formatCirculationTime(time) {
      if (time === null || time === undefined || time === '') {
        return '1.0';
      }

      try {
        // 转换为数字并保留一位小数
        const num = parseFloat(time);
        if (isNaN(num)) {
          return '1.0';
        }
        return num.toFixed(1);
      } catch (error) {
        console.error('格式化出货流转时间错误:', error);
        return '1.0';
      }
    },

    // 格式化时间戳
    formatTimestamp(timestamp) {
      if (!timestamp) return '-';

      try {
        // 如果是字符串类型的时间戳
        if (typeof timestamp === 'string' && !isNaN(timestamp)) {
          timestamp = Number(timestamp);
        }

        // 如果是数字类型的时间戳
        if (typeof timestamp === 'number') {
          const date = new Date(timestamp);
          // 检查是否为有效日期
          if (isNaN(date.getTime())) {
            return '-';
          }
          // 格式化为YYYY-MM-DD HH:mm:ss
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const day = String(date.getDate()).padStart(2, '0');
          const hours = String(date.getHours()).padStart(2, '0');
          const minutes = String(date.getMinutes()).padStart(2, '0');
          const seconds = String(date.getSeconds()).padStart(2, '0');
          return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
        }

        return '-';
      } catch (error) {
        console.error('时间戳格式化错误:', error, timestamp);
        return '-';
      }
    },

    // 查询
    handleQuery() {
      this.queryParams.pageNo = 1;
      this.getList();
    },

    // 导出
    handleExport() {
      this.$message.info('导出功能待实现');
    },

    // 子排产计划选择变化
    handleSubSelectionChange(selection) {
      this.selectedSubSchedules = selection;
    },

    // 编辑子排产计划 - 修复数据污染问题
    handleEdit(row) {
      // 重置表单，避免数据污染
      this.resetSubScheduleForm();

      // 复制行数据到表单
      this.subScheduleForm = {
        id: row.id,
        section: row.section || '',
        planDate: this.convertToDateTimeString(row.planDate),
        planEndTime: this.convertToDateTimeString(row.planEndTime),
        workpieceType: row.workpieceType || '',
        prodOrderNo: row.prodOrderNo || '',
        equipment: row.equipment || '',
        processTime: row.processTime || 0,
        circulationTime: row.circulationTime || 1.0, // 默认1小时
        processStatus: row.processStatus || '无',
        designStatus: row.designStatus,
        electrodeQty: row.electrodeQty || 0,
        createBy: row.createBy || '',
        updateBy: row.updateBy || ''
      };

      this.subScheduleFormTitle = '编辑子排产计划';
      this.openSubScheduleForm = true;

      // 根据工段加载设备选项，将工段作为manHourName参数传递给后端
      this.loadEquipmentOptions(row.section);

      this.$nextTick(() => {
        if (this.$refs.subScheduleFormRef) {
          this.$refs.subScheduleFormRef.clearValidate();
        }
      });
    },

    // 将排产日期转换为日期时间字符串
    convertToDateTimeString(dateValue) {
      if (!dateValue) return '';

      try {
        // 如果是时间戳（数字）
        if (typeof dateValue === 'number') {
          const date = new Date(dateValue);
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const day = String(date.getDate()).padStart(2, '0');
          const hours = String(date.getHours()).padStart(2, '0');
          const minutes = String(date.getMinutes()).padStart(2, '0');
          const seconds = String(date.getSeconds()).padStart(2, '0');
          return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
        }

        // 如果是字符串
        if (typeof dateValue === 'string') {
          // 如果已经是完整格式
          if (dateValue.includes('-') && dateValue.includes(':')) {
            return dateValue;
          }
          // 如果是时间戳字符串
          if (!isNaN(dateValue)) {
            return this.convertToDateTimeString(Number(dateValue));
          }
        }

        return '';
      } catch (error) {
        console.error('日期转换错误:', error);
        return '';
      }
    },

    // 重置子排产计划表单
    resetSubScheduleForm() {
      this.subScheduleForm = {
        id: undefined,
        section: '',
        planDate: '',
        planEndTime: '',
        workpieceType: '',
        prodOrderNo: '',
        equipment: '',
        processTime: 0,
        circulationTime: 1.0, // 重置为1小时
        processStatus: '无',
        designStatus: undefined,
        electrodeQty: 0,
        createBy: '',
        updateBy: ''
      };

      if (this.$refs.subScheduleFormRef) {
        this.$refs.subScheduleFormRef.clearValidate();
      }
    },

    // 对话框关闭时的处理
    handleDialogClose() {
      this.resetSubScheduleForm();
      this.equipmentOptions = [];
    },

    // 出货流转时间变化处理
    handleCirculationTimeChange(value) {
      // 这里可以添加其他逻辑，比如限制最小值和最大值
      if (value < 0) {
        this.subScheduleForm.circulationTime = 0;
      }
    },

    // 调整出货流转时间
    adjustCirculationTime(amount) {
      let current = parseFloat(this.subScheduleForm.circulationTime) || 1.0;
      current += amount;
      if (current < 0) {
        current = 0;
      }
      // 保留一位小数
      this.subScheduleForm.circulationTime = Math.round(current * 10) / 10;
    },

    // 重置出货流转时间为1小时
    resetCirculationTime() {
      this.subScheduleForm.circulationTime = 1.0;
    },

    // 提交子排产计划表单
    submitSubScheduleForm() {
      this.$refs.subScheduleFormRef.validate(valid => {
        if (valid) {
          // 构建更新参数
          const updateParams = {
            id: this.subScheduleForm.id,
            prodOrderNo: this.subScheduleForm.prodOrderNo,
            section: this.subScheduleForm.section,
            equipment: this.subScheduleForm.equipment,
            processTime: this.subScheduleForm.processTime,
            circulationTime: this.subScheduleForm.circulationTime, // 出货流转时间
            processStatus: this.subScheduleForm.processStatus,
            planDate: this.subScheduleForm.planDate,
            planEndTime: this.subScheduleForm.planEndTime
          };

          console.log('提交更新参数:', updateParams);

          // 调用更新接口
          updateProdPlanEl(updateParams).then(response => {
            if (response.code === 200) {
              this.$message.success('更新成功');
              this.openSubScheduleForm = false;
              // 重新加载当前生产单号的子排产计划数据
              if (this.currentProdOrderNo) {
                this.loadSubScheduleList(this.currentProdOrderNo);
              }
            } else {
              this.$message.error(response.msg || '更新失败');
            }
          }).catch(error => {
            console.error('更新子排产计划失败:', error);
            this.$message.error('更新失败');
          });
        }
      });
    },

    formatDateTime(date) {
      try {
        if (!date) return '-';

        // 如果是时间戳
        if (typeof date === 'number') {
          return this.$dayjs(date).format('YYYY-MM-DD HH:mm:ss');
        }

        // 如果是字符串，先尝试解析
        if (typeof date === 'string') {
          // 如果已经包含时间部分，直接格式化
          if (date.includes(' ')) {
            return this.$dayjs(date).format('YYYY-MM-DD HH:mm:ss');
          } else {
            // 如果只有日期部分，添加默认时间
            return this.$dayjs(`${date} 00:00:00`).format('YYYY-MM-DD HH:mm:ss');
          }
        }

        // 其他情况
        return this.$dayjs(date).format('YYYY-MM-DD HH:mm:ss');
      } catch (error) {
        console.error('日期时间格式化错误:', error);
        return '-';
      }
    },

    // 分页大小变化
    handleSizeChange(val) {
      // 固定为10条，不处理变化
      this.queryParams.pageSize = 10;
    },

    // 当前页变化
    handleCurrentChange(val) {
      this.queryParams.pageNo = val;
      this.getList();
    }
  }
}
</script>

<style scoped>
.app-container {
  padding: 20px;
}

.main-content {
  margin-top: 20px;
  width: 100%;
}

.card-title {
  font-size: 16px;
  font-weight: bold;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both;
}

/* 上下布局卡片样式 */
.top-card {
  margin-bottom: 20px;
  width: 100%;
}

.bottom-card {
  margin-top: 0;
  width: 100%;
}

/* 分页容器样式 */
.pagination-container {
  margin-top: 20px;
  text-align: right;
}

/* 电极数量链接样式 */
.electrode-count-link {
  color: #409EFF;
  text-decoration: underline;
  cursor: pointer;
  font-weight: 500;
}

.electrode-count-link:hover {
  color: #67C23A;
}

/* 确保卡片占满全部宽度 */
.box-card {
  width: 100%;
}

/* 时间控制按钮样式 */
.time-controls {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.time-controls .el-button {
  flex: 1;
  min-width: 70px;
}
</style>
