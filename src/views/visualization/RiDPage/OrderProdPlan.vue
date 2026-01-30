<template>
  <div class="mold-processing-kanban">
    <div class="header-container">
      <header>
        <h1>
          <i class="fas fa-tasks"></i> 模具加工任务看板
          <span class="title-date">{{ titleDate }}</span>
        </h1>
        <div class="header-controls">
          <div class="refresh-timer">
            <i class="fas fa-clock"></i>
            <span>自动刷新: {{ refreshCountdown }}秒</span>
          </div>
          <button class="settings-toggle-btn" @click="toggleSettingsPanel">
            <i class="fas fa-cog"></i> {{ settingsBtnText }}
          </button>
        </div>
      </header>
    </div>

    <div class="control-panel" :class="{ hidden: isControlPanelHidden }">
      <div class="control-column">
        <h3><i class="fas fa-building"></i> 部门选择</h3>
        <div class="department-selector">
          <el-select
            v-model="currentDepartmentId"
            placeholder="请选择部门"
            clearable
            @change="handleDepartmentChange"
            style="width: 100%;"
          >
            <el-option label="所有部门" value="all"></el-option>
            <el-option
              v-for="dept in departments"
              :key="dept.deptId"
              :label="dept.name"
              :value="dept.deptId"
            ></el-option>
          </el-select>
        </div>
      </div>

      <div class="control-column">
        <h3><i class="fas fa-cogs"></i> 设备选择</h3>
        <div class="equipment-selector">
          <label>选择设备 (可多选):</label>
          <div class="equipment-select">
            <div v-if="filteredEquipment.length === 0" class="empty-state">
              {{ currentDepartmentId ? '暂无设备数据' : '请先选择部门' }}
            </div>
            <div v-else>
              <div v-for="equipment in filteredEquipment"
                   :key="equipment.deviceNo"
                   class="equipment-option">
                <input type="checkbox"
                       :id="'eq-' + equipment.deviceNo"
                       :value="equipment.deviceNo"
                       v-model="selectedEquipmentIds"
                       @change="filterAndRenderSchedules">
                <label :for="'eq-' + equipment.deviceNo">
                  {{ equipment.name || equipment.deviceName || equipment.deviceNo }} ({{ equipment.deviceNo }})
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="control-column">
        <h3><i class="fas fa-sort"></i> 排序与布局</h3>
        <div class="sort-controls">
          <label>排序方式:</label>
          <div class="sort-buttons">
            <button v-for="sortOption in sortOptions"
                    :key="sortOption.value"
                    class="sort-btn"
                    :class="{ active: currentSort === sortOption.value }"
                    @click="changeSort(sortOption.value)">
              {{ sortOption.label }}
            </button>
          </div>
        </div>

        <div class="layout-controls">
          <label for="columnsPerRow">
            <i class="fas fa-th"></i> 每行列数:
          </label>
          <input type="number" id="columnsPerRow" min="1" max="4" v-model.number="columnsPerRow" @change="handleColumnsChange">
        </div>
      </div>

      <div class="control-column">
        <h3><i class="fas fa-play-circle"></i> 操作</h3>
        <div class="action-buttons">
          <button class="refresh-btn" @click="manualRefresh">
            <i class="fas fa-sync-alt"></i> 立即刷新
          </button>
          <button class="detail-btn" @click="showDetailModal">
            <i class="fas fa-list-alt"></i> 显示明细
          </button>
          <button class="auto-refresh-btn" @click="toggleAutoRefresh">
            <i :class="isAutoRefreshEnabled ? 'fas fa-pause-circle' : 'fas fa-play-circle'"></i>
            {{ isAutoRefreshEnabled ? '暂停自动刷新' : '开启自动刷新' }}
          </button>
        </div>
      </div>
    </div>

    <div class="stats-bar">
      <div class="stat-item">
        <div class="stat-value">{{ stats.totalTasks }}</div>
        <div class="stat-label">总任务数</div>
      </div>
      <div class="stat-item">
        <div class="stat-value">{{ stats.delayedTasks }}</div>
        <div class="stat-label">延期任务</div>
      </div>
      <div class="stat-item">
        <div class="stat-value">{{ stats.urgentTasks }}</div>
        <div class="stat-label">急件以上</div>
      </div>
      <div class="stat-item">
        <div class="stat-value">{{ stats.activeEquipment }}</div>
        <div class="stat-label">活跃设备</div>
      </div>
    </div>

    <div id="equipmentScheduleContainer">
      <div v-if="isLoading" class="loading-state">
        <i class="fas fa-spinner fa-spin"></i>
        <h3>正在加载加工任务数据...</h3>
      </div>
      <div v-else-if="!hasData" class="empty-state">
        <i class="fas fa-clipboard-list"></i>
        <h3>{{ emptyStateMessage }}</h3>
        <p>请选择其他部门或稍后重试</p>
      </div>
      <div v-else class="equipment-container" :class="'columns-' + columnsPerRow">
        <div v-for="group in groupedSchedules" :key="group.equipmentId" class="equipment-card fade-in">
          <div class="equipment-header">
            <div class="equipment-info">
              <div class="equipment-name">
                <i class="fas fa-cogs"></i>
                {{ group.equipment.name || group.equipment.deviceName || group.equipment.deviceNo }} ({{ group.equipment.deviceNo }})
              </div>
              <div class="equipment-function">{{ group.equipment.type || '' }}</div>
              <div class="equipment-activation">
                <span v-if="group.equipment.equipment_activation !== undefined">
                  稼动率: {{ formatActivation(group.equipment.equipment_activation) }}%
                </span>
                <span v-if="group.equipment.pro_name && group.equipment.pro_name !== 'N/A'">
                  当前程序: {{ group.equipment.pro_name }}
                </span>
              </div>
            </div>
            <div class="equipment-status" :class="'status-' + (group.deviceStatus || 'idle')">
              {{ getStatusText(group.deviceStatus) }}
            </div>
          </div>
          <div class="schedule-table-container">
            <table class="schedule-table">
              <thead>
              <tr>
                <th style="width: 40px;">序号</th>
                <th>生产单号</th>
                <th>模号</th>
                <th>件号</th>
                <th>版次</th>
                <th>CAM/电极</th>
                <th>加工状态</th>
                <th>开始时间</th>
                <th>结束时间</th>
                <th>交期等级</th>
                <th>状态</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="(task, index) in group.schedules" :key="task.id || index">
                <td class="serial-number">{{ index + 1 }}</td>
                <td>{{ task.prodOrderNo || 'N/A' }}</td>
                <td>{{ task.moduleNo || 'N/A' }}</td>
                <td>{{ task.pieceNo || 'N/A' }}</td>
                <td>{{ task.versionNo || 'N/A' }}</td>
                <td v-html="getProgrammingInfo(task, group.equipment)"></td>
                <td>
                  <span class="process-status" :class="'process-' + getProcessStatusClass(task.processStatus)">
                    {{ task.processStatus || '待签收' }}
                  </span>
                </td>
                <td>{{ formatDateTime(task.planDate) }}</td>
                <td>{{ formatDateTime(task.planEndTime) }}</td>
                <td>
                  <span class="deadline-level" :class="'level-' + getLevelClass(task.deliveryLevel)">
                    {{ getDeliveryLevelText(task.deliveryLevel) }}
                  </span>
                </td>
                <td>
                  <span :class="getDelayStatusClass(task)">
                    {{ task.delayStatusText }}
                  </span>
                </td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <div class="modal-overlay" :class="{ active: showDetailModalFlag }" @click="closeDetailModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3><i class="fas fa-list-alt"></i> 任务明细</h3>
          <div class="modal-actions">
            <button class="export-btn" @click="exportDetailData">
              <i class="fas fa-download"></i> 导出Excel
            </button>
            <button class="close-modal" @click="closeDetailModal">&times;</button>
          </div>
        </div>
        <div class="modal-body">
          <table class="schedule-table" id="detailTable">
            <thead>
            <tr>
              <th v-for="header in detailHeaders"
                  :key="header.key"
                  :data-sort="header.key"
                  @click="sortDetailTable(header.key)"
                  :class="{
                      'sorted-asc': detailSortColumn === header.key && detailSortDirection === 'asc',
                      'sorted-desc': detailSortColumn === header.key && detailSortDirection === 'desc'
                    }">
                {{ header.label }}
              </th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="task in sortedDetailData" :key="task.index">
              <td class="serial-number">{{ task.index }}</td>
              <td>{{ task.equipment }}</td>
              <td>{{ task.prodOrderNo }}</td>
              <td>{{ task.moduleNo }}</td>
              <td>{{ task.pieceNo }}</td>
              <td>{{ task.versionNo }}</td>
              <td v-html="getDetailProgrammingInfo(task)"></td>
              <td>
                <span class="process-status" :class="'process-' + getProcessStatusClass(task.processStatus)">
                  {{ task.processStatus }}
                </span>
              </td>
              <td>{{ formatDateTime(task.planDate) }}</td>
              <td>{{ formatDateTime(task.planEndTime) }}</td>
              <td>
                <span class="deadline-level" :class="'level-' + getLevelClass(task.deliveryLevel)">
                  {{ getDeliveryLevelText(task.deliveryLevel) }}
                </span>
              </td>
              <td>
                <span :class="getDetailDelayStatusClass(task)">
                  {{ task.delayStatusText }}
                </span>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div class="page-info">
      最后更新: {{ lastUpdated }}
    </div>

    <div class="scroll-progress" :style="{ width: scrollProgress + '%' }"></div>
    <div class="footer-controls">
      <button class="scroll-toggle-btn" :class="{ paused: !isScrollingEnabled }" @click="toggleAutoScroll">
        <i :class="isScrollingEnabled ? 'fas fa-pause-circle' : 'fas fa-play-circle'"></i>
        <span>{{ isScrollingEnabled ? '暂停自动滚动' : '开始自动滚动' }}</span>
      </button>
      <div class="scroll-speed-control">
        <label><i class="fas fa-tachometer-alt"></i> 滚动速度:</label>
        <div class="speed-buttons">
          <button class="speed-btn" :class="{ active: scrollSpeed === 1 }" @click="changeScrollSpeed(1)">慢</button>
          <button class="speed-btn" :class="{ active: scrollSpeed === 2 }" @click="changeScrollSpeed(2)">中</button>
          <button class="speed-btn" :class="{ active: scrollSpeed === 3 }" @click="changeScrollSpeed(3)">快</button>
        </div>
      </div>
    </div>
    <div class="scroll-indicator" :class="{ visible: showScrollIndicator }">
      <i :class="scrollIndicatorIcon"></i>
      <span>{{ scrollIndicatorText }}</span>
    </div>
  </div>
</template>

<script>
// 导入API方法
import { getDicts } from '@/api/system/dict/data';
import { getEquipmentSectionDept, getDeptIdEquipmentSection, getMoldProcessingAll } from '@/api/follow/recording';
// 新增：导入设备状态接口
import axios from 'axios';
// 导入xlsx库
import * as XLSX from 'xlsx';

export default {
  name: 'MoldProcessingKanban',
  data() {
    return {
      // 基本数据
      allSchedules: [],          // 原始任务数据
      filteredSchedules: [],     // 过滤后的任务数据
      equipmentList: [],         // 设备列表
      departments: [],           // 部门列表
      titleDate: '',             // 标题日期
      lastUpdated: '--',         // 最后更新时间

      // 控制面板状态
      isControlPanelHidden: true,
      settingsBtnText: '设置',
      currentDepartmentId: 'all',
      selectedEquipmentIds: [],
      currentSort: 'planDate',   // 默认按排产开始时间排序
      columnsPerRow: 2,

      // 状态标志
      isLoading: true,
      hasData: false,
      emptyStateMessage: '当前选择无加工任务数据',

      // 统计信息
      stats: {
        totalTasks: 0,
        delayedTasks: 0,
        urgentTasks: 0,
        activeEquipment: 0
      },

      // 排序选项
      sortOptions: [
        { label: '按排产开始时间', value: 'planDate' },
        { label: '按排产结束时间', value: 'planEndTime' },
        { label: '按交期等级（急件优先）', value: 'deliveryLevel' }
      ],

      // 明细模态框
      showDetailModalFlag: false,
      detailData: [],
      detailSortColumn: null,
      detailSortDirection: 'asc',
      detailHeaders: [
        { label: '序号', key: 'index' },
        { label: '设备', key: 'equipment' },
        { label: '生产单号', key: 'prodOrderNo' },
        { label: '模号', key: 'moduleNo' },
        { label: '件号', key: 'pieceNo' },
        { label: '版次', key: 'versionNo' },
        { label: 'CAM/电极', key: 'programming' },
        { label: '加工状态', key: 'processStatus' },
        { label: '开始时间', key: 'planDate' },
        { label: '结束时间', key: 'planEndTime' },
        { label: '交期等级', key: 'deliveryLevel' },
        { label: '状态', key: 'delayStatusText' }
      ],

      // 字典相关
      delayLevelDict: [],        // 延期等级字典（delay_tatus）
      deliveryLevelDict: [],      // 交期等级字典

      // 自动刷新相关
      isAutoRefreshEnabled: true,  // 是否启用自动刷新
      refreshTimer: null,          // 自动刷新定时器
      refreshInterval: 1500000,     // 25分钟 = 1500000毫秒
      refreshCountdown: 1500,       // 倒计时（25分钟 = 1500秒）

      // 设备状态相关
      equipmentStatusData: [],      // 设备状态数据
      equipmentStatusTimer: null,   // 设备状态定时器
      equipmentStatusInterval: 30000, // 设备状态更新间隔30秒

      // 自动滚动相关 - 修改为10秒滚动一次
      isScrollingEnabled: true,
      isAutoScrolling: false,
      scrollStep: 150,             // 每次滚动的像素数
      scrollDelay: 10000,          // 每10秒滚动一次 = 10000毫秒
      pauseDelay: 5000,            // 到底部暂停5秒
      inactivityDelay: 10000,      // 用户不活动后10秒开始滚动
      scrollProgress: 0,
      showScrollIndicator: false,
      scrollIndicatorText: '',
      scrollIndicatorIcon: '',
      autoScrollInterval: null,
      userActivityTimer: null,
      scrollSpeed: 2,              // 滚动速度：1=慢, 2=中, 3=快
      scrollSpeedConfig: {
        1: { delay: 15000, step: 300 },   // 慢：15秒滚动一次，每次300px
        2: { delay: 10000, step: 550 },   // 中：10秒滚动一次，每次550px
        3: { delay: 5000, step: 600 }     // 快：5秒滚动一次，每次600px
      }
    };
  },
  computed: {
    // 过滤后的设备列表
    filteredEquipment() {
      return this.equipmentList;
    },

    // 按设备分组的任务数据
    groupedSchedules() {
      const grouped = {};

      this.filteredSchedules.forEach(moldProcessingAll => {
        const equipmentId = moldProcessingAll.deviceNo;
        if (!grouped[equipmentId]) {
          // 查找设备信息
          const equipment = this.equipmentList.find(eq => eq.deviceNo === equipmentId) || {
            deviceName: '',
            deviceNo: equipmentId,
            type: ''
          };

          // 查找设备状态信息
          const statusInfo = this.equipmentStatusData.find(item =>
            item.equipment_id === equipmentId
          ) || {};

          // 合并设备信息和状态信息
          const mergedEquipment = {
            ...equipment,
            ...statusInfo,
            deviceStatus: this.mapEquipmentStatus(statusInfo.state) // 映射状态
          };

          grouped[equipmentId] = {
            equipmentId,
            equipment: mergedEquipment,
            deviceStatus: mergedEquipment.deviceStatus,
            schedules: []
          };
        }

        // 处理任务，判断延期状态
        const tasks = (moldProcessingAll.moldList || []).map(task => {
          const delayStatusText = this.getDelayStatus(task);
          return {
            ...task,
            delayStatusText: delayStatusText,
            isDelay: delayStatusText !== '正常'
          };
        });

        // 设备内任务排序
        grouped[equipmentId].schedules = tasks.sort(this.sortTasks);

        // 为设备添加排序关键字
        grouped[equipmentId].sortKey = this.getEquipmentSortKey(grouped[equipmentId]);
      });

      // 设备整体排序
      return Object.values(grouped).sort((a, b) => {
        if (this.currentSort === 'planDate') {
          return a.sortKey - b.sortKey;
        } else if (this.currentSort === 'planEndTime') {
          return a.sortKey - b.sortKey;
        } else if (this.currentSort === 'deliveryLevel') {
          return a.sortKey - b.sortKey;
        }
        return 0;
      });
    },

    // 排序后的明细数据
    sortedDetailData() {
      if (!this.detailSortColumn || !this.detailData.length) return this.detailData;

      return [...this.detailData].sort((a, b) => {
        let aValue = this.getSortValue(a, this.detailSortColumn);
        let bValue = this.getSortValue(b, this.detailSortColumn);

        if (aValue < bValue) return this.detailSortDirection === 'asc' ? -1 : 1;
        if (aValue > bValue) return this.detailSortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    },

    // 获取当前滚动配置
    currentScrollConfig() {
      return this.scrollSpeedConfig[this.scrollSpeed] || this.scrollSpeedConfig[2];
    }
  },
  created() {
    this.initPage();
  },
  mounted() {
    this.initAutoScroll();
    this.initAutoRefresh();
    window.addEventListener('scroll', this.handleScroll);

    // 监听用户活动
    const activityEvents = ['mousemove', 'mousedown', 'click', 'scroll', 'keydown', 'keypress', 'keyup', 'touchstart', 'touchmove'];
    activityEvents.forEach(eventName => {
      window.addEventListener(eventName, this.handleUserActivity, {passive: true});
    });
  },
  beforeUnmount() {
    this.stopAutoScroll();
    this.stopAutoRefresh();
    this.stopEquipmentStatusUpdate();
    clearTimeout(this.userActivityTimer);
    window.removeEventListener('scroll', this.handleScroll);

    // 移除用户活动监听
    const activityEvents = ['mousemove', 'mousedown', 'click', 'scroll', 'keydown', 'keypress', 'keyup', 'touchstart', 'touchmove'];
    activityEvents.forEach(eventName => {
      window.removeEventListener(eventName, this.handleUserActivity);
    });
  },
  methods: {
    // 初始化页面
    async initPage() {
      this.updateTitleDate();
      await this.loadDictData();
      await this.loadDepartments();

      if (this.departments.length > 0) {
        await this.loadEquipmentByDepartment('all');
      }

      // 初始化设备状态更新
      this.initEquipmentStatusUpdate();

      await this.loadScheduleData();
    },

    // 初始化设备状态更新
    initEquipmentStatusUpdate() {
      // 立即加载一次设备状态
      this.loadEquipmentStatus();

      // 设置定时器，每30秒更新一次设备状态
      this.equipmentStatusTimer = setInterval(() => {
        this.loadEquipmentStatus();
      }, this.equipmentStatusInterval);
    },

    // 停止设备状态更新
    stopEquipmentStatusUpdate() {
      if (this.equipmentStatusTimer) {
        clearInterval(this.equipmentStatusTimer);
        this.equipmentStatusTimer = null;
      }
    },

    // 加载设备状态数据
    async loadEquipmentStatus() {
      try {
        console.log('正在加载设备状态数据...');

        // 直接调用接口获取设备状态数据
        const response = await axios.get('http://10.123.17.30:8050/prod-api/getequipmentdata');

        if (response && response.status === 200) {
          this.equipmentStatusData = Array.isArray(response.data) ? response.data : [];
          console.log('设备状态数据加载成功，共', this.equipmentStatusData.length, '条记录');

          // 强制更新视图以显示最新的设备状态
          this.$forceUpdate();
        } else {
          console.warn('获取设备状态数据失败:', response?.statusText);
          this.equipmentStatusData = [];
        }
      } catch (error) {
        console.error('加载设备状态数据异常:', error);
        this.equipmentStatusData = [];
      }
    },

    // 映射设备状态编码为状态文本
    mapEquipmentStatus(stateCode) {
      // 状态映射：1=加工中, 2=待机, 3=停机, 4=离线
      const statusMap = {
        '1': 'running',    // 加工中 -> running
        '2': 'idle',       // 待机 -> idle
        '3': 'stopped',    // 停机 -> stopped
        '4': 'offline'     // 离线 -> offline
      };

      return statusMap[stateCode] || 'offline'; // 默认待机
    },

    // 格式化稼动率为百分比
    formatActivation(activation) {
      if (activation === undefined || activation === null) return '0';
      return (activation * 100).toFixed(2);
    },

    // 加载字典数据
    async loadDictData() {
      try {
        // 加载延期等级字典（名称：delay_tatus）
        const delayLevelRes = await getDicts('delay_status');
        if (delayLevelRes && delayLevelRes.code === 200) {
          this.delayLevelDict = Array.isArray(delayLevelRes.data) ? delayLevelRes.data : [];
          this.delayLevelDict.sort((a, b) => Number(a.value) - Number(b.value));
        }

        // 加载交期等级字典
        const deliveryLevelRes = await getDicts('mold_delivery_level');
        if (deliveryLevelRes && deliveryLevelRes.code === 200) {
          this.deliveryLevelDict = Array.isArray(deliveryLevelRes.data) ? deliveryLevelRes.data : [];
        }
      } catch (error) {
        console.error('加载字典数据失败:', error);
        this.delayLevelDict = [];
        this.deliveryLevelDict = [];
      }
    },

    // 初始化自动刷新
    initAutoRefresh() {
      if (this.isAutoRefreshEnabled) {
        this.startAutoRefresh();
      }
    },

    // 开始自动刷新
    startAutoRefresh() {
      this.stopAutoRefresh(); // 先停止现有的定时器

      // 重置倒计时
      this.refreshCountdown = this.refreshInterval / 1000;

      // 启动倒计时
      const countdownInterval = setInterval(() => {
        this.refreshCountdown--;

        if (this.refreshCountdown <= 0) {
          clearInterval(countdownInterval);
          this.refreshCountdown = this.refreshInterval / 1000;
        }
      }, 1000);

      // 启动自动刷新定时器
      this.refreshTimer = setInterval(() => {
        console.log('自动刷新数据...');
        this.loadScheduleData();

        // 重置倒计时
        this.refreshCountdown = this.refreshInterval / 1000;
      }, this.refreshInterval);

      console.log(`自动刷新已启用，每${this.refreshInterval / 1000}秒刷新一次`);
    },

    // 停止自动刷新
    stopAutoRefresh() {
      if (this.refreshTimer) {
        clearInterval(this.refreshTimer);
        this.refreshTimer = null;
        console.log('自动刷新已停止');
      }
    },

    // 切换自动刷新
    toggleAutoRefresh() {
      this.isAutoRefreshEnabled = !this.isAutoRefreshEnabled;

      if (this.isAutoRefreshEnabled) {
        this.startAutoRefresh();
        this.$message.success('自动刷新已启用');
      } else {
        this.stopAutoRefresh();
        this.refreshCountdown = 0;
        this.$message.info('自动刷新已禁用');
      }
    },

    // 手动刷新
    manualRefresh() {
      this.loadScheduleData();
      this.$message.success('数据刷新中...');

      // 如果自动刷新已启用，重新开始计时
      if (this.isAutoRefreshEnabled) {
        this.refreshCountdown = this.refreshInterval / 1000;
      }
    },

    // 更新标题日期
    updateTitleDate() {
      const now = new Date();
      const hour = now.getHours();

      if (hour < 8) {
        now.setDate(now.getDate() - 1);
      }

      this.titleDate = `${now.getFullYear()}年${String(now.getMonth() + 1).padStart(2, '0')}月${String(now.getDate()).padStart(2, '0')}日`;
    },

    // 切换控制面板
    toggleSettingsPanel() {
      this.isControlPanelHidden = !this.isControlPanelHidden;
      this.settingsBtnText = this.isControlPanelHidden ? '设置' : '关闭设置';
    },

    // 改变排序方式
    changeSort(sortType) {
      this.currentSort = sortType;
      this.filterAndRenderSchedules();
      this.$forceUpdate();
    },

    // 处理列数变化
    handleColumnsChange() {
      this.columnsPerRow = Math.max(1, Math.min(4, this.columnsPerRow));
    },

    // 改变滚动速度
    changeScrollSpeed(speed) {
      this.scrollSpeed = speed;

      // 如果正在滚动，重新开始滚动
      if (this.isAutoScrolling) {
        this.stopAutoScroll();
        setTimeout(() => {
          this.startAutoScroll();
        }, 100);
      }

      const speedLabels = {1: '慢速', 2: '中速', 3: '快速'};
      this.$message.success(`滚动速度已设置为${speedLabels[speed]}`);
    },

    // 加载部门列表
    async loadDepartments() {
      try {
        this.isLoading = true;
        const response = await getEquipmentSectionDept();

        if (response && response.code === 200) {
          this.departments = Array.isArray(response.data) ? response.data : [];
          this.departments = this.departments.filter(dept => dept.deptId && dept.name);
        } else {
          this.departments = [];
        }
      } catch (error) {
        console.error('加载部门列表失败:', error);
        this.departments = [];
      } finally {
        this.isLoading = false;
      }
    },

    // 根据部门ID加载设备列表
    async loadEquipmentByDepartment(deptId) {
      try {
        this.isLoading = true;
        let allEquipment = [];

        if (deptId === 'all') {
          for (const dept of this.departments) {
            try {
              const equipmentList = await this.fetchEquipmentByDeptId(dept.deptId);
              allEquipment = allEquipment.concat(equipmentList);
            } catch (e) {
              console.warn(`获取${dept.name}部门设备失败:`, e);
            }
          }
        } else {
          allEquipment = await this.fetchEquipmentByDeptId(deptId);
        }

        this.equipmentList = allEquipment.filter(item => item.deviceNo).map(item => ({...item}));
        this.selectedEquipmentIds = this.equipmentList.map(eq => eq.deviceNo);
        this.filterAndRenderSchedules();
      } catch (error) {
        console.error('加载设备列表失败:', error);
        this.equipmentList = [];
        this.selectedEquipmentIds = [];
      } finally {
        this.isLoading = false;
      }
    },

    // 根据部门ID获取设备数据
    async fetchEquipmentByDeptId(deptId) {
      try {
        const response = await getDeptIdEquipmentSection({deptId});
        if (response && response.code === 200) {
          const equipmentData = Array.isArray(response.data) ? response.data : [];
          const dept = this.departments.find(d => d.deptId === deptId);
          return equipmentData.map(item => ({
            ...item,
            deptId,
            deptName: dept ? dept.name : '',
            deviceNo: item.deviceNo || ''
          }));
        }
        return [];
      } catch (error) {
        console.error(`获取部门${deptId}设备失败:`, error);
        return [];
      }
    },

    // 处理部门变化
    async handleDepartmentChange() {
      this.isLoading = true;
      this.equipmentList = [];
      this.selectedEquipmentIds = [];
      await this.loadEquipmentByDepartment(this.currentDepartmentId);
      await this.loadScheduleData();
      this.isLoading = false;
    },

    // 加载加工任务数据
    async loadScheduleData() {
      this.isLoading = true;
      try {
        const params = {
          deviceNos: this.selectedEquipmentIds.length > 0 ? this.selectedEquipmentIds : []
        };

        const response = await getMoldProcessingAll(params);

        if (response && response.code === 200) {
          this.allSchedules = Array.isArray(response.data) ? response.data : [];
        } else {
          this.allSchedules = [];
          console.error('获取加工任务数据失败:', response?.msg || '接口返回异常');
        }

        this.filterAndRenderSchedules();
        this.lastUpdated = new Date().toLocaleString('zh-CN');

        // 显示刷新成功消息
        if (!this.isLoading) {
          this.$message.success('数据刷新成功');
        }
      } catch (error) {
        console.error('加载加工任务数据异常:', error);
        this.allSchedules = [];
        this.filterAndRenderSchedules();
        this.lastUpdated = new Date().toLocaleString('zh-CN');
        this.$message.error('数据刷新失败，请稍后重试');
      } finally {
        this.isLoading = false;
      }
    },

    // 过滤和渲染计划数据
    filterAndRenderSchedules() {
      if (this.selectedEquipmentIds.length === 0) {
        this.filteredSchedules = [];
        this.hasData = false;
        this.emptyStateMessage = '请选择至少一个设备';
        this.updateStatistics(); // 移除参数
        return;
      }

      this.filteredSchedules = this.allSchedules.filter(item =>
        this.selectedEquipmentIds.includes(item.deviceNo)
      );

      this.hasData = this.filteredSchedules.length > 0 &&
        this.filteredSchedules.some(item => item.moldList && item.moldList.length > 0);

      this.emptyStateMessage = this.hasData ? '' : '当前选择无加工任务数据';
      this.updateStatistics(); // 移除参数
    },

    // 获取设备排序关键字
    getEquipmentSortKey(equipmentGroup) {
      if (equipmentGroup.schedules.length === 0) return Infinity;

      if (this.currentSort === 'planDate') {
        const earliestDate = equipmentGroup.schedules.reduce((min, task) => {
          const taskDate = task.planDate ? new Date(task.planDate).getTime() : Infinity;
          return Math.min(min, taskDate);
        }, Infinity);
        return earliestDate;
      } else if (this.currentSort === 'planEndTime') {
        const earliestEnd = equipmentGroup.schedules.reduce((min, task) => {
          const taskEnd = task.planEndTime ? new Date(task.planEndTime).getTime() : Infinity;
          return Math.min(min, taskEnd);
        }, Infinity);
        return earliestEnd;
      } else if (this.currentSort === 'deliveryLevel') {
        const levelOrder = {'特急件': 1, '急件': 2, '一般': 3};
        const highestLevel = equipmentGroup.schedules.reduce((min, task) => {
          const levelText = this.getDeliveryLevelText(task.deliveryLevel);
          const levelValue = levelOrder[levelText] || 4;
          return Math.min(min, levelValue);
        }, 4);
        return highestLevel;
      }
      return Infinity;
    },

    // 排序任务数据
    sortTasks(a, b) {
      const getDateValue = (dateStr) => {
        if (!dateStr) return Infinity;
        const date = new Date(dateStr);
        return isNaN(date.getTime()) ? Infinity : date.getTime();
      };

      if (this.currentSort === 'planDate') {
        return getDateValue(a.planDate) - getDateValue(b.planDate);
      } else if (this.currentSort === 'planEndTime') {
        return getDateValue(a.planEndTime) - getDateValue(b.planEndTime);
      } else if (this.currentSort === 'deliveryLevel') {
        const aLevelText = this.getDeliveryLevelText(a.deliveryLevel);
        const bLevelText = this.getDeliveryLevelText(b.deliveryLevel);
        const levelOrder = {'特急件': 1, '急件': 2, '一般': 3};
        return (levelOrder[aLevelText] || 4) - (levelOrder[bLevelText] || 4);
      }
      return 0;
    },

    // 更新统计信息 - 修改后：只统计不为离线(offline)和待机(idle)的设备
    updateStatistics() {
      let totalTasks = 0;
      let delayedTasks = 0;
      let urgentTasks = 0;
      let activeEquipment = 0;

      // 使用groupedSchedules来统计设备状态
      this.groupedSchedules.forEach(equipmentGroup => {
        const moldList = equipmentGroup.schedules || [];
        totalTasks += moldList.length;

        // 统计延期任务（非"正常"状态）
        const deviceDelayedTasks = moldList.filter(task => {
          const delayStatus = this.getDelayStatus(task);
          return delayStatus !== '正常';
        }).length;
        delayedTasks += deviceDelayedTasks;

        // 统计急件
        const deviceUrgentTasks = moldList.filter(task => {
          const levelText = this.getDeliveryLevelText(task.deliveryLevel);
          return levelText.includes('特急') || levelText.includes('急件');
        }).length;
        urgentTasks += deviceUrgentTasks;

        // 活跃设备：不为离线(offline)和待机(idle)的设备
        // 只统计设备状态为running（加工中）或stopped（停机）的设备
        if (equipmentGroup.deviceStatus) {
          const status = equipmentGroup.deviceStatus;
          if (status === 'running' || status === 'stopped') {
            activeEquipment += 1;
          }
        }
      });

      this.stats = {
        totalTasks,
        delayedTasks,
        urgentTasks,
        activeEquipment
      };
    },

    // 获取延期状态
    getDelayStatus(task) {
      // 1. 优先使用后端返回的delayStatus值
      const taskDelayValue = task.delayStatus;
      if (taskDelayValue !== undefined && taskDelayValue !== null && taskDelayValue !== '') {
        const delayNum = Number(taskDelayValue);
        if (isNaN(delayNum)) {
          return '延期';
        }

        // 字典非空时，按字典value数值对比判断
        if (this.delayLevelDict.length > 0) {
          const sortedDict = [...this.delayLevelDict].sort((a, b) => Number(a.value) - Number(b.value));

          for (const dictItem of sortedDict) {
            const dictValue = Number(dictItem.value);
            if (delayNum < dictValue) {
              return dictItem.label;
            }
          }
          return '延期';
        } else {
          if (delayNum <= 0) return '正常';
          else if (delayNum < 10) return '低风险';
          else if (delayNum < 20) return '中风险';
          else return '延期';
        }
      }

      // 2. 后端未返回delayStatus，前端通过planEndTime判断
      if (!task.planEndTime) return '正常';

      try {
        const endTime = new Date(task.planEndTime);
        const now = new Date();
        if (isNaN(endTime.getTime())) return '正常';

        const diffTime = endTime.getTime() - now.getTime();
        const diffDays = diffTime / (1000 * 60 * 60 * 24);

        if (diffDays < 0) {
          const delayDays = Math.abs(diffDays);
          if (this.delayLevelDict.length > 0) {
            const sortedDict = [...this.delayLevelDict].sort((a, b) => Number(a.value) - Number(b.value));
            for (const dictItem of sortedDict) {
              const dictValue = Number(dictItem.value);
              if (delayDays < dictValue) {
                return dictItem.label;
              }
            }
            return '延期';
          } else {
            if (delayDays < 0.01) return '低风险';
            else if (delayDays < 0.03) return '中风险';
            else return '延期';
          }
        } else {
          return '正常';
        }
      } catch (e) {
        console.error('前端判断延期状态异常:', e);
        return '正常';
      }
    },

    // 获取延期状态样式类
    getDelayStatusClass(task) {
      const delayStatus = this.getDelayStatus(task);
      if (delayStatus === '正常') return 'status-ontime';
      if (delayStatus === '低风险') return 'status-low-risk';
      if (delayStatus === '中风险') return 'status-medium-risk';
      return 'status-delay';
    },

    // 获取明细延期状态样式类
    getDetailDelayStatusClass(task) {
      const delayStatus = task.delayStatusText;
      if (delayStatus === '正常') return 'status-ontime';
      if (delayStatus === '低风险') return 'status-low-risk';
      if (delayStatus === '中风险') return 'status-medium-risk';
      return 'status-delay';
    },

    // 显示明细模态框
    showDetailModal() {
      if (!this.hasData) {
        this.$message.warning('当前没有任务数据可显示');
        return;
      }

      this.detailData = [];
      let index = 1;

      this.filteredSchedules.forEach(moldProcessingAll => {
        const equipment = this.equipmentList.find(eq => eq.deviceNo === moldProcessingAll.deviceNo);
        const equipmentName = equipment
          ? `${equipment.name || equipment.deviceName || ''}(${equipment.deviceNo})`
          : `${moldProcessingAll.deviceNo}`;

        (moldProcessingAll.moldList || []).forEach(task => {
          const delayStatusText = this.getDelayStatus(task);
          const isDelay = delayStatusText !== '正常';
          this.detailData.push({
            index: index++,
            equipment: equipmentName,
            equipmentType: equipment?.type || '',
            prodOrderNo: task.prodOrderNo || 'N/A',
            moduleNo: task.moduleNo || 'N/A',
            pieceNo: task.pieceNo || 'N/A',
            versionNo: task.versionNo || 'N/A',
            electrodeQty: task.electrodeQty || 0,
            designStatus: task.designStatus || 0,
            designStatusText: task.designStatus === 1 ? '已完成' : task.designStatus === 0 ? '未开始' : '进行中',
            processStatus: task.processStatus || '待签收',
            planDate: task.planDate,
            planEndTime: task.planEndTime,
            deliveryLevel: task.deliveryLevel || '',
            delayStatus: task.delayStatus || 0,
            isDelay: isDelay,
            delayStatusText: delayStatusText
          });
        });
      });

      this.detailSortColumn = null;
      this.detailSortDirection = 'asc';
      this.showDetailModalFlag = true;
    },

    // 导出明细数据为Excel（XLSX格式）
    exportDetailData() {
      if (!this.detailData || this.detailData.length === 0) {
        this.$message.warning('没有数据可导出');
        return;
      }

      try {
        // 准备表头
        const headers = [
          '序号', '设备', '生产单号', '模号', '件号', '版次',
          '电极总数', '设计状态', '加工状态', '开始时间', '结束时间',
          '交期等级', '延期状态', '是否延期'
        ];

        // 准备数据行
        const data = this.detailData.map(item => [
          item.index,
          item.equipment,
          item.prodOrderNo,
          item.moduleNo,
          item.pieceNo,
          item.versionNo,
          item.electrodeQty,
          item.designStatusText,
          item.processStatus,
          this.formatDateTime(item.planDate),
          this.formatDateTime(item.planEndTime),
          this.getDeliveryLevelText(item.deliveryLevel),
          item.delayStatusText,
          item.isDelay ? '是' : '否'
        ]);

        // 创建工作簿
        const wb = XLSX.utils.book_new();

        // 创建工作表数据（包含表头）
        const wsData = [headers, ...data];
        const ws = XLSX.utils.aoa_to_sheet(wsData);

        // 设置列宽
        const colWidths = [
          {wch: 8},   // 序号
          {wch: 20},  // 设备
          {wch: 15},  // 生产单号
          {wch: 15},  // 模号
          {wch: 10},  // 件号
          {wch: 8},   // 版次
          {wch: 12},  // 电极总数
          {wch: 12},  // 设计状态
          {wch: 12},  // 加工状态
          {wch: 18},  // 开始时间
          {wch: 18},  // 结束时间
          {wch: 12},  // 交期等级
          {wch: 12},  // 延期状态
          {wch: 10}   // 是否延期
        ];
        ws['!cols'] = colWidths;

        // 设置第一行（表头）的样式
        const headerRange = XLSX.utils.decode_range(ws['!ref']);
        for (let C = headerRange.s.c; C <= headerRange.e.c; ++C) {
          const cellAddress = XLSX.utils.encode_cell({r: 0, c: C});
          if (!ws[cellAddress]) continue;

          // 设置表头样式：加粗、居中、背景色
          ws[cellAddress].s = {
            font: {bold: true, color: {rgb: "FFFFFF"}},
            fill: {fgColor: {rgb: "3498db"}},
            alignment: {horizontal: "center", vertical: "center"}
          };
        }

        // 设置数据行样式
        for (let R = 1; R <= data.length; ++R) {
          for (let C = 0; C < headers.length; ++C) {
            const cellAddress = XLSX.utils.encode_cell({r: R, c: C});
            if (!ws[cellAddress]) continue;

            // 设置基本对齐
            ws[cellAddress].s = ws[cellAddress].s || {};
            ws[cellAddress].s.alignment = {horizontal: "center", vertical: "center"};

            // 设置边框
            ws[cellAddress].s.border = {
              top: {style: "thin", color: {rgb: "000000"}},
              bottom: {style: "thin", color: {rgb: "000000"}},
              left: {style: "thin", color: {rgb: "000000"}},
              right: {style: "thin", color: {rgb: "000000"}}
            };

            // 设置偶数行背景色
            if (R % 2 === 0) {
              ws[cellAddress].s.fill = {fgColor: {rgb: "f5f5f5"}};
            }
          }
        }

        // 将工作表添加到工作簿
        XLSX.utils.book_append_sheet(wb, ws, '任务明细');

        // 生成文件名
        const now = new Date();
        const fileName = `模具加工任务明细_${now.getFullYear()}年${String(now.getMonth() + 1).padStart(2, '0')}月${String(now.getDate()).padStart(2, '0')}日_${String(now.getHours()).padStart(2, '0')}时${String(now.getMinutes()).padStart(2, '0')}分.xlsx`;

        // 写入文件并下载
        XLSX.writeFile(wb, fileName);

        this.$message.success('Excel文件导出成功！');
      } catch (error) {
        console.error('导出Excel文件失败:', error);
        this.$message.error('导出失败，请稍后重试');
      }
    },

    // 关闭明细模态框
    closeDetailModal() {
      this.showDetailModalFlag = false;
    },

    // 明细表格排序
    sortDetailTable(column) {
      if (this.detailSortColumn === column) {
        this.detailSortDirection = this.detailSortDirection === 'asc' ? 'desc' : 'asc';
      } else {
        this.detailSortColumn = column;
        this.detailSortDirection = 'asc';
      }
    },

    // 获取排序值
    getSortValue(item, column) {
      switch (column) {
        case 'index':
          return item.index;
        case 'equipment':
          return item.equipment || '';
        case 'prodOrderNo':
          return item.prodOrderNo || '';
        case 'moduleNo':
          return item.moduleNo || '';
        case 'pieceNo':
          return item.pieceNo || '';
        case 'versionNo':
          return item.versionNo || '';
        case 'programming':
          return item.electrodeQty || 0;
        case 'processStatus':
          const statusOrder = {'加工中': 1, '待签收': 2, '已完成': 3};
          return statusOrder[item.processStatus] || 4;
        case 'planDate':
          return new Date(item.planDate || 0);
        case 'planEndTime':
          return new Date(item.planEndTime || 0);
        case 'deliveryLevel':
          const levelText = this.getDeliveryLevelText(item.deliveryLevel);
          const levelOrder = {'特急件': 1, '急件': 2, '一般': 3};
          return levelOrder[levelText] || 4;
        case 'delayStatusText':
          const delayOrder = {'高风险': 1, '中风险': 2, '低风险': 3, '正常': 4};
          return delayOrder[item.delayStatusText] || 5;
        default:
          return item[column] || '';
      }
    },

    // 格式化日期时间
    formatDateTime(dateTimeStr) {
      if (!dateTimeStr) return 'N/A';
      try {
        const date = new Date(dateTimeStr);
        return date.toLocaleDateString('zh-CN') + ' ' +
          date.toLocaleTimeString('zh-CN', {hour: '2-digit', minute: '2-digit'});
      } catch (e) {
        return dateTimeStr;
      }
    },

    // 获取编程/电极信息
    getProgrammingInfo(task, equipment) {
      if (equipment.type === 'EDM' || (equipment.function && equipment.function.includes('电火花'))) {
        const total = task.electrodeQty || 0;
        return `
          <div class="electrode-info">
            <div class="electrode-count">
              <span>电极总数: ${total}</span>
            </div>
            <div class="progress-bar-small">
              <div class="progress-small" style="width: ${total > 0 ? 100 : 0}%"></div>
            </div>
          </div>
        `;
      } else if (task.designStatus !== undefined) {
        const statusText = task.designStatus === 1 ? '已完成' : task.designStatus === 0 ? '未开始' : '进行中';
        const statusClass = task.designStatus === 1 ? 'status-completed' :
          task.designStatus === 0 ? 'status-not-started' : 'status-in-progress';
        return `<span class="program-status ${statusClass}">${statusText}</span>`;
      } else {
        return '<span class="empty-state" style="padding:0;color:#95a5a6;">-</span>';
      }
    },

    // 获取明细编程信息
    getDetailProgrammingInfo(task) {
      if (task.equipmentType === 'EDM' || task.equipmentType?.includes('电火花')) {
        const total = task.electrodeQty || 0;
        return `
          <div class="electrode-info">
            <div class="electrode-count">
              <span>电极总数: ${total}</span>
            </div>
            <div class="progress-bar-small">
              <div class="progress-small" style="width: ${total > 0 ? 100 : 0}%"></div>
            </div>
          </div>
        `;
      } else if (task.designStatus !== undefined) {
        const statusText = task.designStatus === 1 ? '已完成' : task.designStatus === 0 ? '未开始' : '进行中';
        const statusClass = task.designStatus === 1 ? 'status-completed' :
          task.designStatus === 0 ? 'status-not-started' : 'status-in-progress';
        return `<span class="program-status ${statusClass}">${statusText}</span>`;
      } else {
        return '<span class="empty-state" style="padding:0;color:#95a5a6;">-</span>';
      }
    },

    // 获取设备状态文本
    getStatusText(status) {
      const statusMap = {
        'running': '加工中',
        'stopped': '停机',
        'idle': '待机',
        'offline': '离线',
        '启用': '加工中',
        '停用': '停机'
      };
      return statusMap[status] || '待机';
    },

    // 获取加工状态样式类
    getProcessStatusClass(processStatus) {
      const status = processStatus || '待签收';
      if (status.includes('加工中') || status === '进行中') return 'processing';
      if (status.includes('完成') || status === '已完成') return 'completed';
      return 'waiting';
    },

    // 获取交期等级文本
    getDeliveryLevelText(level) {
      if (this.deliveryLevelDict.length === 0) {
        const levelMap = {
          '0': '特急件',
          '1': '急件',
          '2': '一般'
        };
        return levelMap[String(level)] || '一般';
      }

      const dictItem = this.deliveryLevelDict.find(item => item.value === String(level));
      return dictItem ? dictItem.label : '一般';
    },

    // 获取交期等级样式类
    getLevelClass(deliveryLevel) {
      if (this.deliveryLevelDict.length === 0) {
        const level = String(deliveryLevel || '2');
        if (level === '0') return 'special';
        if (level === '1') return 'urgent';
        return 'normal';
      }

      const dictItem = this.deliveryLevelDict.find(item => item.value === String(deliveryLevel));
      if (!dictItem) return 'normal';
      if (dictItem.label.includes('特急')) return 'special';
      if (dictItem.label.includes('急件')) return 'urgent';
      return 'normal';
    },

    // ==================== 自动滚动功能 ====================
    // 初始化自动滚动
    initAutoScroll() {
      setTimeout(() => {
        if (this.isScrollingEnabled) {
          this.resetUserActivityTimer();
        }
      }, 3000);
    },

    // 检查滚动位置
    checkScrollPosition() {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = window.innerHeight;
      const maxScrollTop = scrollHeight - clientHeight;

      const scrollPercentage = maxScrollTop > 0 ? (scrollTop / maxScrollTop) * 100 : 0;
      this.scrollProgress = scrollPercentage;

      const isAtTop = scrollTop <= 10;
      const isAtBottom = scrollTop >= maxScrollTop - 10;

      return {scrollTop, maxScrollTop, isAtTop, isAtBottom};
    },

    // 处理滚动
    handleScroll() {
      this.checkScrollPosition();
    },

    // 重置用户活动计时器
    resetUserActivityTimer() {
      clearTimeout(this.userActivityTimer);

      if (this.isAutoScrolling) {
        this.stopAutoScroll();
        this.showScrollIndicator("用户操作，暂停中...", "fas fa-hand-paper");
      }

      this.userActivityTimer = setTimeout(() => {
        if (this.isScrollingEnabled) {
          this.startAutoScroll();
          this.showScrollIndicator("空闲，开始自动滚动", "fas fa-play-circle");
        }
      }, this.inactivityDelay);
    },

    // 处理用户活动
    handleUserActivity() {
      if (this.isScrollingEnabled) {
        this.resetUserActivityTimer();
      }
    },

    // 开始自动滚动（修改为10秒滚动一次）
    startAutoScroll() {
      const {maxScrollTop} = this.checkScrollPosition();
      if (maxScrollTop <= 0) {
        this.showScrollIndicator("内容不足一屏，无需滚动", "fas fa-info-circle");
        return;
      }

      if (this.isAutoScrolling) {
        this.stopAutoScroll();
      }

      this.isAutoScrolling = true;

      // 获取当前滚动配置
      const config = this.currentScrollConfig;

      this.autoScrollInterval = setInterval(() => {
        const {isAtBottom} = this.checkScrollPosition();

        if (isAtBottom) {
          clearInterval(this.autoScrollInterval);
          this.isAutoScrolling = false;
          this.showScrollIndicator("已到底部，等待中...", "fas fa-pause-circle");

          setTimeout(() => {
            window.scrollTo({
              top: 0,
              behavior: 'smooth'
            });
            this.showScrollIndicator("回到顶部，准备重新开始", "fas fa-arrow-up");

            setTimeout(() => {
              this.startAutoScroll();
            }, 1000);

          }, this.pauseDelay);

          return;
        }

        window.scrollBy({
          top: config.step,
          left: 0,
          behavior: 'smooth'
        });
      }, config.delay);

      this.showScrollIndicator(`向下滚动中 (${this.scrollSpeed === 1 ? '慢速' : this.scrollSpeed === 2 ? '中速' : '快速'})`, "fas fa-arrow-down");
    },

    // 停止自动滚动
    stopAutoScroll() {
      clearInterval(this.autoScrollInterval);
      clearTimeout(this.userActivityTimer);
      this.isAutoScrolling = false;
    },

    // 显示滚动提示
    showScrollIndicator(text, iconClass) {
      if (!this.isScrollingEnabled) return;

      this.scrollIndicatorText = text;
      this.scrollIndicatorIcon = iconClass;
      this.showScrollIndicator = true;

      setTimeout(() => {
        this.showScrollIndicator = false;
      }, 2000);
    },

    // 切换自动滚动
    toggleAutoScroll() {
      this.isScrollingEnabled = !this.isScrollingEnabled;

      if (this.isScrollingEnabled) {
        this.showScrollIndicator("自动滚动已启用", "fas fa-play-circle");
        this.resetUserActivityTimer();
      } else {
        this.stopAutoScroll();
        clearTimeout(this.userActivityTimer);
        this.showScrollIndicator("自动滚动已关闭", "fas fa-stop-circle");
      }
    }
  }
};
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

body {
  background-color: #f5f7fa;
  color: #333;
  padding: 15px;
}

.header-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
  position: relative;
}

header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding-bottom: 12px;
  border-bottom: 1px solid #e0e0e0;
}

.header-controls {
  display: flex;
  align-items: center;
  gap: 15px;
}

.refresh-timer {
  display: flex;
  align-items: center;
  gap: 6px;
  background-color: #f8f9fa;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 13px;
  color: #3498db;
  border: 1px solid #e0e0e0;
}

.refresh-timer i {
  font-size: 14px;
}

h1 {
  font-size: 28px;
  color: #2c3e50;
  display: flex;
  align-items: center;
  gap: 8px;
  text-align: center;
}

.title-date {
  font-size: 16px;
  color: #7f8c8d;
  margin-left: 10px;
  font-weight: normal;
}

.settings-toggle-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  background-color: #3498db;
  color: white;
  cursor: pointer;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 6px;
}

.settings-toggle-btn:hover {
  background-color: #2980b9;
}

.control-panel {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  background: white;
  border-radius: 10px;
  padding: 15px 20px;
  margin-bottom: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  flex-wrap: wrap;
  gap: 15px;
  max-height: 500px;
  overflow: hidden;
  transition: max-height 0.3s ease, padding 0.3s ease, margin 0.3s ease;
}

.control-panel.hidden {
  max-height: 0;
  padding: 0 20px;
  margin-bottom: 0;
  overflow: hidden;
}

.control-column {
  flex: 1;
  min-width: 200px;
}

.control-column h3 {
  font-size: 16px;
  color: #2c3e50;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.department-selector, .equipment-selector, .sort-controls, .layout-controls {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.control-column label {
  font-weight: 600;
  color: #2c3e50;
  display: flex;
  align-items: center;
  gap: 6px;
}

.equipment-select {
  min-height: 100px;
  max-height: 150px;
  overflow-y: auto;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 8px;
  background-color: white;
}

.equipment-option {
  padding: 6px 8px;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  border-radius: 3px;
  transition: background-color 0.2s;
}

.equipment-option:hover {
  background-color: #f0f7ff;
}

.equipment-option input {
  margin: 0;
}

.equipment-option span {
  font-size: 14px;
}

select, input[type="number"] {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: white;
  font-size: 14px;
  min-width: 180px;
}

input[type="number"] {
  width: 80px;
}

.sort-buttons {
  display: flex;
  gap: 5px;
  flex-wrap: wrap;
}

.sort-btn {
  padding: 6px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.3s;
}

.sort-btn:hover, .sort-btn.active {
  background: #3498db;
  color: white;
  border-color: #3498db;
}

.action-buttons {
  display: flex;
  gap: 10px;
  margin-top: 15px;
  flex-wrap: wrap;
}

.refresh-btn, .detail-btn, .auto-refresh-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  color: white;
  cursor: pointer;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
}

.refresh-btn {
  background-color: #2ecc71;
}

.refresh-btn:hover {
  background-color: #27ae60;
}

.detail-btn {
  background-color: #9b59b6;
}

.detail-btn:hover {
  background-color: #8e44ad;
}

.auto-refresh-btn {
  background-color: #f39c12;
}

.auto-refresh-btn:hover {
  background-color: #d68910;
}

.equipment-container {
  display: grid;
  gap: 20px;
  margin-bottom: 30px;
  grid-template-columns: repeat(auto-fill, minmax(550px, 1fr));
}

.columns-1 .equipment-container {
  grid-template-columns: 1fr;
}

.columns-2 .equipment-container {
  grid-template-columns: repeat(2, minmax(400px, 1fr));
}

.columns-3 .equipment-container {
  grid-template-columns: repeat(3, minmax(300px, 1fr));
}

.columns-4 .equipment-container {
  grid-template-columns: repeat(4, minmax(250px, 1fr));
}

.equipment-card {
  background: white;
  border-radius: 10px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  width: 100%;
}

.equipment-header {
  background: #3498db;
  color: white;
  padding: 15px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.equipment-info {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.equipment-name {
  font-size: 18px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
}

.equipment-function {
  font-size: 14px;
  opacity: 0.9;
}

.equipment-activation {
  font-size: 12px;
  display: flex;
  flex-direction: column;
  gap: 2px;
  opacity: 0.85;
}

.equipment-status {
  background: rgba(255, 255, 255, 0.2);
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}

.status-running {
  background-color: rgba(46, 204, 113, 0.8);
}

.status-stopped {
  background-color: rgba(231, 76, 60, 0.8);
}

.status-idle {
  background-color: rgba(243, 156, 18, 0.8);
}

.status-offline {
  background-color: rgba(149, 165, 166, 0.8);
}

.schedule-table-container {
  padding: 15px;
  overflow-x: auto;
}

.schedule-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

.schedule-table th {
  background-color: #f8f9fa;
  padding: 12px 8px;
  text-align: left;
  font-weight: 600;
  color: #2c3e50;
  border-bottom: 2px solid #e9ecef;
  white-space: nowrap;
  cursor: pointer;
  position: relative;
  user-select: none;
}

.schedule-table th:hover {
  background-color: #e9ecef;
}

.schedule-table th.sorted-asc::after {
  content: " ↑";
  color: #3498db;
  font-weight: bold;
}

.schedule-table th.sorted-desc::after {
  content: " ↓";
  color: #3498db;
  font-weight: bold;
}

.schedule-table td {
  padding: 10px 8px;
  border-bottom: 1px solid #e9ecef;
  vertical-align: top;
}

.schedule-table tr:hover {
  background-color: #f8f9fa;
}

.program-status {
  padding: 3px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
  display: inline-block;
}

.status-not-started {
  background-color: #e74c3c;
  color: white;
}

.status-in-progress {
  background-color: #f39c12;
  color: white;
}

.status-completed {
  background-color: #2ecc71;
  color: white;
}

.process-status {
  padding: 3px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
  display: inline-block;
}

.process-waiting {
  background-color: #95a5a6;
  color: white;
}

.process-processing {
  background-color: #3498db;
  color: white;
}

.process-completed {
  background-color: #2ecc71;
  color: white;
}

/* 新增延期状态样式 */
.status-delay {
  color: #e74c3c;
  font-weight: 600;
}

.status-ontime {
  color: #2ecc71;
  font-weight: 600;
}

.status-low-risk {
  color: #f39c12;
  font-weight: 600;
}

.status-medium-risk {
  color: #e67e22;
  font-weight: 600;
}

.electrode-info {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.electrode-count {
  display: flex;
  justify-content: space-between;
}

.progress-bar-small {
  height: 6px;
  background-color: #ecf0f1;
  border-radius: 3px;
  margin-top: 3px;
  overflow: hidden;
}

.progress-small {
  height: 100%;
  border-radius: 3px;
  background-color: #2ecc71;
}

.deadline-level {
  padding: 3px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
  display: inline-block;
}

.level-special {
  background-color: #e74c3c;
  color: white;
}

.level-urgent {
  background-color: #f39c12;
  color: white;
}

.level-normal {
  background-color: #3498db;
  color: white;
}

.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: #95a5a6;
}

.empty-state i {
  font-size: 48px;
  margin-bottom: 15px;
  display: block;
}

.loading-state {
  text-align: center;
  padding: 40px 20px;
  color: #3498db;
}

.loading-state i {
  font-size: 36px;
  margin-bottom: 15px;
  display: block;
}

.stats-bar {
  display: flex;
  justify-content: space-around;
  background: white;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.06);
  flex-wrap: wrap;
}

.stat-item {
  text-align: center;
  flex: 1;
  min-width: 100px;
}

.stat-value {
  font-size: 20px;
  font-weight: 700;
  color: #2c3e50;
}

.stat-label {
  font-size: 12px;
  color: #7f8c8d;
}

.modal-overlay {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 1000;
  justify-content: center;
  align-items: center;
}

.modal-overlay.active {
  display: flex;
}

.modal-content {
  background: white;
  border-radius: 10px;
  width: 65%;
  height: 70vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 10px 50px rgba(0, 0, 0, 0.3);
}

.modal-header {
  background: #3498db;
  color: white;
  padding: 15px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  font-size: 20px;
  margin: 0;
}

.modal-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.export-btn {
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  background-color: #2ecc71;
  color: white;
  cursor: pointer;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
}

.export-btn:hover {
  background-color: #27ae60;
}

.close-modal {
  background: none;
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-body {
  padding: 20px;
  overflow-y: auto;
  overflow-x: auto;
  flex: 1;
}

#detailTable {
  min-width: 1200px; /* 根据实际列数调整这个值 */
  width: 100%;
}

.page-info {
  text-align: center;
  margin-top: 25px;
  color: #95a5a6;
  font-size: 12px;
}

.serial-number {
  font-weight: 600;
  color: #3498db;
  text-align: center;
}

.footer-controls {
  position: fixed;
  bottom: 20px;
  left: 20px;
  right: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 998;
  background-color: rgba(255, 255, 255, 0.9);
  padding: 10px 15px;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.scroll-speed-control {
  display: flex;
  align-items: center;
  gap: 10px;
}

.scroll-speed-control label {
  font-size: 13px;
  color: #2c3e50;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 5px;
}

.speed-buttons {
  display: flex;
  gap: 5px;
}

.speed-btn {
  padding: 4px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.3s;
}

.speed-btn:hover, .speed-btn.active {
  background: #3498db;
  color: white;
  border-color: #3498db;
}

.scroll-indicator {
  position: fixed;
  bottom: 70px;
  right: 20px;
  background-color: rgba(52, 152, 219, 0.8);
  color: white;
  padding: 8px 12px;
  border-radius: 20px;
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 6px;
  z-index: 999;
  transition: opacity 0.3s;
  opacity: 0;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.scroll-indicator.visible {
  opacity: 1;
}

.scroll-toggle-btn {
  background-color: rgba(46, 204, 113, 0.8);
  color: white;
  padding: 8px 12px;
  border-radius: 20px;
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 6px;
  z-index: 999;
  border: none;
  cursor: pointer;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s;
}

.scroll-toggle-btn:hover {
  background-color: rgba(39, 174, 96, 0.9);
}

.scroll-toggle-btn.paused {
  background-color: rgba(231, 76, 60, 0.8);
}

.scroll-toggle-btn.paused:hover {
  background-color: rgba(192, 57, 43, 0.9);
}

.scroll-progress {
  position: fixed;
  top: 0;
  left: 0;
  width: 0%;
  height: 3px;
  background-color: #3498db;
  z-index: 1000;
  transition: width 0.3s;
}

.fade-in {
  animation: fadeIn 0.5s ease-in;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 响应式样式 */
@media (max-width: 1200px) {
  .columns-4 .equipment-container {
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  }
}

@media (max-width: 992px) {
  .columns-3 .equipment-container {
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  }

  .columns-4 .equipment-container {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  }
}

@media (max-width: 768px) {
  .equipment-container {
    grid-template-columns: 1fr !important;
  }

  .control-panel:not(.hidden) {
    flex-direction: column;
    align-items: flex-start;
  }

  .control-column {
    width: 100%;
  }

  select, input[type="number"] {
    width: 100%;
  }

  .equipment-select {
    min-height: 80px;
  }

  .action-buttons {
    flex-direction: column;
    width: 100%;
  }

  .refresh-btn, .detail-btn, .auto-refresh-btn {
    width: 100%;
    justify-content: center;
  }

  .modal-content {
    width: 98%;
    height: 95vh;
  }

  .schedule-table {
    font-size: 12px;
  }

  .schedule-table th, .schedule-table td {
    padding: 8px 6px;
  }

  .header-controls {
    flex-direction: column;
    gap: 10px;
    align-items: flex-end;
  }

  .refresh-timer {
    font-size: 11px;
    padding: 4px 8px;
  }

  .footer-controls {
    flex-direction: column;
    gap: 10px;
    align-items: stretch;
    padding: 15px;
  }

  .scroll-speed-control {
    justify-content: center;
  }

  .modal-actions {
    flex-direction: column;
    align-items: flex-end;
    gap: 8px;
  }

  .export-btn {
    padding: 4px 8px;
    font-size: 12px;
  }
}

@media (max-width: 480px) {
  h1 {
    font-size: 22px;
    flex-direction: column;
    gap: 5px;
  }

  .title-date {
    margin-left: 0;
  }

  .equipment-name {
    font-size: 16px;
  }

  .equipment-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .equipment-status {
    align-self: flex-start;
  }

  .settings-toggle-btn {
    position: relative;
    margin-top: 10px;
    align-self: flex-end;
  }

  .modal-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .modal-actions {
    align-self: flex-end;
  }
}
</style>
