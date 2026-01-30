<template>
  <div class="mold-schedule-board">
    <!-- 头部 -->
    <div class="header-container">
      <header>
        <h1>
          <i class="fas fa-project-diagram"></i> 模具进度总览看板
          <span class="title-date">{{ titleDate }}</span>
        </h1>
        <button class="settings-toggle-btn" @click="toggleSettingsModal">
          <i class="fas fa-cog"></i> 字段设置
        </button>
      </header>
    </div>

    <!-- 控制面板 -->
    <div class="control-panel" :class="{ hidden: !showControlPanel }" id="controlPanel">
      <div class="control-column">
        <h3><i class="fas fa-filter"></i> 模具筛选</h3>
        <div class="mold-selector">
          <label>选择模具 (可多选):</label>
          <div class="mold-select" id="moldSelect">
            <div v-if="moldList.length === 0" class="empty-state">正在加载模具列表...</div>
            <div v-for="moldNo in moldList" :key="moldNo" class="mold-option">
              <input
                type="checkbox"
                :id="'mold-' + moldNo"
                :value="moldNo"
                v-model="selectedMoldNos"
                @change="handleMoldSelectionChange"
              >
              <label :for="'mold-' + moldNo">{{ moldNo }}</label>
            </div>
          </div>
        </div>
      </div>

      <div class="control-column">
        <h3><i class="fas fa-calendar-alt"></i> 时间范围</h3>
        <div class="date-range-selector">
          <label for="startDate">开始日期:</label>
          <input type="date" id="startDate" v-model="startDate" @change="filterByDate">

          <label for="endDate">结束日期:</label>
          <input type="date" id="endDate" v-model="endDate" @change="filterByDate">
        </div>

        <h3><i class="fas fa-search"></i> 甘特图缩放</h3>
        <div class="zoom-controls">
          <button
            v-for="zoomOption in zoomOptions"
            :key="zoomOption.value"
            class="zoom-btn"
            :class="{ active: ganttZoomLevel === zoomOption.value }"
            @click="setZoomLevel(zoomOption.value)"
          >
            {{ zoomOption.label }}
          </button>
        </div>
      </div>

      <div class="control-column">
        <h3><i class="fas fa-play-circle"></i> 操作</h3>
        <div class="action-buttons">
          <button class="refresh-btn" @click="loadMoldData">
            <i class="fas fa-sync-alt"></i> 刷新数据
          </button>
          <button class="export-btn" @click="exportData">
            <i class="fas fa-download"></i> 导出数据
          </button>
        </div>

        <!-- 刷新统计信息 -->
        <div class="refresh-stats" v-if="lastRefreshTime">
          <i class="fas fa-history"></i>
          <span>已刷新 {{ refreshCount }} 次 | 最后: {{ formatLastRefreshTime }}</span>
        </div>

        <!-- 倒计时显示 -->
        <div class="refresh-countdown" v-if="autoRefreshEnabled">
          <i class="fas fa-clock"></i>
          <span>下次刷新: {{ formatTimeUntilRefresh }}</span>
        </div>
      </div>
    </div>

    <!-- 放大镜容器 -->
    <div
      ref="magnifierContainer"
      class="gantt-magnifier"
      :class="{ active: showMagnifier, resizing: isResizing }"
      :style="{
        left: magnifierPosition.x + 'px',
        top: magnifierPosition.y + 'px',
        width: magnifierSize.width + 'px',
        height: magnifierSize.height + 'px',
        minWidth: minMagnifierSize.width + 'px',
        minHeight: minMagnifierSize.height + 'px'
      }"
      @mouseenter="handleMagnifierEnter"
      @mouseleave="handleMagnifierLeave"
    >
      <!-- 调整大小手柄 -->
      <div
        class="resize-handle resize-handle-n"
        @mousedown.prevent="startResize($event, 'n')"
      ></div>
      <div
        class="resize-handle resize-handle-s"
        @mousedown.prevent="startResize($event, 's')"
      ></div>
      <div
        class="resize-handle resize-handle-e"
        @mousedown.prevent="startResize($event, 'e')"
      ></div>
      <div
        class="resize-handle resize-handle-w"
        @mousedown.prevent="startResize($event, 'w')"
      ></div>
      <div
        class="resize-handle resize-handle-ne"
        @mousedown.prevent="startResize($event, 'ne')"
      ></div>
      <div
        class="resize-handle resize-handle-nw"
        @mousedown.prevent="startResize($event, 'nw')"
      ></div>
      <div
        class="resize-handle resize-handle-se"
        @mousedown.prevent="startResize($event, 'se')"
      ></div>
      <div
        class="resize-handle resize-handle-sw"
        @mousedown.prevent="startResize($event, 'sw')"
      ></div>

      <!-- 缩放控制按钮 -->
      <div class="zoom-controls-bar">
        <button
          class="zoom-control-btn zoom-in-btn"
          @click="adjustMagnifierSize(1.2)"
          title="放大"
        >
          <i class="fas fa-search-plus"></i>
        </button>
        <button
          class="zoom-control-btn zoom-out-btn"
          @click="adjustMagnifierSize(0.8)"
          title="缩小"
        >
          <i class="fas fa-search-minus"></i>
        </button>
        <button
          class="zoom-control-btn reset-zoom-btn"
          @click="resetMagnifierSize"
          title="重置大小"
        >
          <i class="fas fa-expand-arrows-alt"></i>
        </button>
        <button
          class="zoom-control-btn close-magnifier-btn"
          @click="closeMagnifier"
          title="关闭放大镜"
        >
          <i class="fas fa-times"></i>
        </button>
        <span class="size-display">{{ magnifierSize.width }}×{{ magnifierSize.height }}</span>
      </div>

      <div v-if="magnifierContent" class="magnifier-content" v-html="magnifierContent"></div>
      <div v-else class="magnifier-placeholder">请将鼠标悬停在甘特图上查看详情</div>

      <!-- 移动手柄 -->
      <div
        class="move-handle"
        @mousedown.prevent="startMove"
        title="拖动移动"
      >
        <i class="fas fa-arrows-alt"></i>
      </div>

      <!-- 缩放提示 -->
      <div v-if="isResizing" class="resizing-hint">
        调整大小中...
      </div>
    </div>

    <!-- 模具进度表格 -->
    <div class="mold-schedule-container" id="moldScheduleContainer">
      <div v-if="loading" class="loading-state">
        <i class="fas fa-spinner fa-spin"></i>
        <h3>正在加载模具进度数据...</h3>
      </div>

      <div v-else-if="filteredMoldData.length === 0" class="empty-state">
        <i class="fas fa-clipboard-list"></i>
        <h3>{{ emptyStateMessage }}</h3>
        <p>请选择其他模具或调整筛选条件</p>
      </div>

      <div v-else class="table-wrapper">
        <!-- 表头 -->
        <div class="mold-table-header">
          <!-- 冻结列 -->
          <div class="header-frozen">
            <div
              class="header-cell frozen sortable col-1"
              :class="sortClasses('index')"
              @click="sortTable('index')"
            >
              序号
            </div>
            <div
              class="header-cell frozen sortable col-2"
              :class="sortClasses('dispatch_no')"
              @click="sortTable('dispatch_no')"
            >
              派工单号
            </div>
          </div>
          <!-- 可滚动列 -->
          <div class="header-scroll">
            <div
              class="header-cell sortable col-3"
              :class="sortClasses('mold_no')"
              @click="sortTable('mold_no')"
            >
              模号
            </div>
            <div
              class="header-cell sortable col-4"
              :class="sortClasses('order_date')"
              @click="sortTable('order_date')"
            >
              投单日期
            </div>
            <div
              class="header-cell sortable col-5"
              :class="sortClasses('deadline')"
              @click="sortTable('deadline')"
            >
              交期
            </div>
            <div
              class="header-cell sortable col-6"
              :class="sortClasses('actual_finish_date')"
              @click="sortTable('actual_finish_date')"
            >
              实际完成日期
            </div>
            <div
              class="header-cell sortable col-7"
              :class="sortClasses('progress')"
              @click="sortTable('progress')"
            >
              当前进度
            </div>
            <div
              class="header-cell sortable col-8"
              :class="sortClasses('delay_status')"
              @click="sortTable('delay_status')"
            >
              是否Delay
            </div>
            <div class="header-cell col-9">甘特图 (计划 vs 实际)</div>
          </div>
        </div>

        <!-- 表格内容 -->
        <div class="mold-table-body">
          <div
            v-for="(mold, moldIndex) in sortedMoldData"
            :key="mold.mold_no"
            class="mold-row fade-in"
            :class="{ expanded: expandedMolds[mold.mold_no] }"
          >
            <!-- 模具主行 -->
            <div class="mold-main-row double-clickable" @dblclick="toggleMoldExpansion(mold.mold_no)">
              <!-- 冻结列 -->
              <div class="cell frozen col-1 serial-number">{{ moldIndex + 1 }}</div>
              <div class="cell frozen col-2">{{ mold.dispatch_no }}</div>
              <!-- 可滚动列 -->
              <div class="cell col-3">{{ mold.mold_no }}</div>
              <div class="cell col-4">{{ formatDate(mold.order_date) }}</div>
              <div class="cell col-5">{{ formatDate(mold.deadline) }}</div>
              <div class="cell col-6">{{ mold.actual_finish_date ? formatDateTimeFull(mold.actual_finish_date) : '进行中' }}</div>
              <div class="cell col-7">
                <div class="progress-container">
                  <div class="progress-bar">
                    <div
                      class="progress-fill"
                      :style="{ width: moldProgress(mold) + '%' }"
                      :data-progress="moldProgress(mold) + '%'"
                    ></div>
                  </div>
                  <div class="progress-text">{{ moldProgress(mold) }}%</div>
                </div>
              </div>
              <div class="cell col-8">
                <span :class="getDelayStatusClass(mold.delay_status)">
                  {{ getDelayStatusText(mold.delay_status) }}
                </span>
              </div>
              <div class="cell col-9">
                <div
                  :id="'mold-gantt-' + moldIndex"
                  class="gantt-container"
                  @mouseenter="handleGanttMouseEnter(moldIndex, $event, 'mold')"
                  @mousemove="handleGanttMouseMove(moldIndex, $event, 'mold')"
                  @mouseleave="handleGanttMouseLeave"
                ></div>
              </div>
            </div>

            <!-- 生产单明细容器 -->
            <div class="part-detail-container" :class="{ expanded: expandedMolds[mold.mold_no] }">
              <!-- 生产单明细表头 -->
              <div class="part-detail-header">
                <div class="cell frozen part-col-1">序号</div>
                <div class="cell frozen part-col-2">生产单号</div>
                <div class="cell part-col-3">模号</div>
                <div class="cell part-col-4">件号</div>
                <div class="cell part-col-5">版次</div>
                <div class="cell part-col-6">CAM电极</div>
                <div class="cell part-col-7">加工状态</div>
                <div class="cell part-col-8">计划开始</div>
                <div class="cell part-col-9">计划结束</div>
                <div class="cell part-col-10">实际开始</div>
                <div class="cell part-col-11">实际结束</div>
                <div class="cell part-col-12">交期等级</div>
                <div class="cell part-col-13">状态</div>
                <div class="cell part-col-14">多工段甘特图</div>
              </div>

              <!-- 生产单明细内容 -->
              <div
                v-for="(prod, prodIndex) in sortedProds(mold)"
                :key="`${mold.mold_no}-${prod.prodOrderNo || prodIndex}`"
                class="part-detail-content"
                :data-prod-order-no="prod.prodOrderNo"
              >
                <div class="cell frozen part-col-1">
                  <div class="part-serial-number">{{ moldIndex + 1 }}.{{ prodIndex + 1 }}</div>
                </div>
                <div class="cell frozen part-col-2">{{ prod.prodOrderNo || 'N/A' }}</div>
                <div class="cell part-col-3">{{ prod.moduleNo || 'N/A' }}</div>
                <div class="cell part-col-4">{{ prod.pieceNo || 'N/A' }}</div>
                <div class="cell part-col-5">{{ prod.versionNo || 'N/A' }}</div>
                <div class="cell part-col-6">
                  <span :class="getCamElectrodeStatusClass(prod.designStatus)">
                    {{ getCamElectrodeStatusText(prod.designStatus) }}
                  </span>
                </div>
                <div class="cell part-col-7">
                  <span :class="processStatusClass(prod.processStatus)">
                    {{ prod.processStatus || '待签收' }}
                  </span>
                </div>
                <div class="cell part-col-8">{{ formatDateTimeFull(prod.planDate) }}</div>
                <div class="cell part-col-9">{{ formatDateTimeFull(prod.planEndTime) }}</div>
                <div class="cell part-col-10">{{ formatDateTimeFull(prod.actualStartTime) }}</div>
                <div class="cell part-col-11">{{ formatDateTimeFull(prod.actualEndTime) }}</div>
                <div class="cell part-col-12">
                  <span :class="deliveryLevelClass(prod.deliveryLevel)">
                    {{ prod.deliveryLevel || '一般' }}
                  </span>
                </div>
                <div class="cell part-col-13">
                  <span :class="getDelayStatusClass(prod.delayStatus)">
                    {{ getDelayStatusText(prod.delayStatus) }}
                  </span>
                </div>
                <div class="cell part-col-14">
                  <div
                    :id="`prod-gantt-${mold.mold_no}-${prod.prodOrderNo || prodIndex}`"
                    class="gantt-container part-gantt-container"
                    @mouseenter="handleProdGanttMouseEnter(moldIndex, prodIndex, $event)"
                    @mousemove="handleProdGanttMouseMove(moldIndex, prodIndex, $event)"
                    @mouseleave="handleGanttMouseLeave"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 设置模态框 -->
    <div class="modal-overlay" :class="{ active: showSettingsModal }" @click.self="closeSettingsModal">
      <div class="modal-content">
        <div class="modal-header">
          <h3><i class="fas fa-cog"></i> 字段显示设置</h3>
          <button class="close-modal" @click="closeSettingsModal">&times;</button>
        </div>
        <div class="modal-body">
          <div class="field-settings">
            <div class="field-group">
              <h4>模具级字段</h4>
              <div
                v-for="field in moldFields"
                :key="field.key"
                class="field-item"
                :data-field="field.key"
              >
                <label>
                  <i :class="field.icon"></i>
                  {{ field.name }}
                </label>
                <label class="toggle-switch">
                  <input type="checkbox" v-model="fieldVisibility[field.key]" @change="updateColumnVisibility">
                  <span class="toggle-slider"></span>
                </label>
              </div>
            </div>

            <div class="field-group">
              <h4>生产单级字段</h4>
              <div
                v-for="field in prodFields"
                :key="field.key"
                class="field-item"
                :data-field="field.key"
              >
                <label>
                  <i :class="field.icon"></i>
                  {{ field.name }}
                </label>
                <label class="toggle-switch">
                  <input type="checkbox" v-model="fieldVisibility[field.key]" @change="updateColumnVisibility">
                  <span class="toggle-slider"></span>
                </label>
              </div>
            </div>

            <!-- 新增：自动刷新设置组 -->
            <div class="field-group">
              <h4><i class="fas fa-sync-alt"></i> 自动刷新设置</h4>

              <!-- 启用/禁用开关 -->
              <div class="field-item">
                <label>
                  <i class="fas fa-play-circle"></i>
                  启用自动刷新
                </label>
                <label class="toggle-switch">
                  <input
                    type="checkbox"
                    v-model="autoRefreshEnabled"
                    @change="handleAutoRefreshToggle"
                  >
                  <span class="toggle-slider"></span>
                </label>
              </div>

              <!-- 刷新间隔设置 -->
              <div v-if="autoRefreshEnabled" class="field-item">
                <label>
                  <i class="fas fa-clock"></i>
                  刷新间隔
                </label>
                <div class="interval-control">
                  <select
                    v-model="autoRefreshInterval"
                    @change="updateRefreshInterval"
                    class="interval-select"
                  >
                    <option value="60">1分钟</option>
                    <option value="300">5分钟</option>
                    <option value="600">10分钟</option>
                    <option value="900">15分钟</option>
                    <option value="1800">30分钟</option>
                    <option value="3600">1小时</option>
                  </select>
                  <span class="interval-unit">秒</span>
                </div>
              </div>

              <!-- 刷新统计信息 -->
              <div v-if="lastRefreshTime" class="refresh-status">
                <div class="status-item">
                  <i class="fas fa-history"></i>
                  <span>已刷新: {{ refreshCount }} 次</span>
                </div>
                <div class="status-item">
                  <i class="fas fa-clock"></i>
                  <span>上次刷新: {{ formatLastRefreshTime }}</span>
                </div>
                <div v-if="autoRefreshEnabled" class="status-item">
                  <i class="fas fa-hourglass-half"></i>
                  <span>下次刷新: {{ formatTimeUntilRefresh }}</span>
                </div>
              </div>

              <!-- 立即刷新按钮 -->
              <div class="action-buttons-modal">
                <button
                  class="refresh-now-btn"
                  @click="loadMoldData"
                >
                  <i class="fas fa-sync-alt"></i>
                  立即刷新数据
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="page-info">
      <div class="refresh-info">
        <span>最后更新: {{ lastUpdated }}</span>
        <span v-if="lastRefreshTime" class="auto-refresh-info">
          | 刷新次数: {{ refreshCount }}
          <span v-if="autoRefreshEnabled">
            | 自动刷新: 已启用 ({{ formatIntervalTime(autoRefreshInterval) }})
            | 下次刷新: {{ formatTimeUntilRefresh }}
          </span>
          <span v-else> | 自动刷新: 已禁用</span>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import { getMoldProcessOverview } from '@/api/follow/recording';
import { getDicts } from '@/api/system/dict/data';

export default {
  name: 'MoldScheduleBoard',

  data() {
    return {
      // 字典数据
      delayStatusDict: [], // 延期状态字典
      delayRiskDict: [],   // 延期风险等级字典
      designStatusDict: [], // CAM电极状态字典

      // 状态
      showControlPanel: false,
      showSettingsModal: false,
      loading: true,
      emptyStateMessage: '当前选择无模具进度数据',
      isMouseInMagnifier: false, // 鼠标是否在放大镜区域内

      // 模具数据
      moldData: [],
      filteredMoldData: [],
      moldList: [],
      selectedMoldNos: [],

      // 筛选条件
      startDate: '',
      endDate: '',
      ganttZoomLevel: 'day',

      // 状态管理
      expandedMolds: {},
      fieldVisibility: {},
      sortState: {
        column: null,
        direction: 'asc'
      },

      // 放大镜功能相关
      showMagnifier: false,
      magnifierPosition: { x: 0, y: 0 },
      magnifierOffset: { x: 0, y: 0 },
      magnifierContent: '',
      currentMagnifierGantt: null, // 当前显示放大镜的甘特图ID
      magnifierTimer: null,

      // 放大镜大小调整相关
      magnifierSize: {
        width: 320,
        height: 220
      },
      minMagnifierSize: {
        width: 200,
        height: 150
      },
      maxMagnifierSize: {
        width: 800,
        height: 600
      },
      isResizing: false,
      isMoving: false,
      resizeDirection: null,
      initialMousePos: { x: 0, y: 0 },
      initialMagnifierPos: { x: 0, y: 0 },
      initialMagnifierSize: { width: 0, height: 0 },

      // 自动刷新相关
      autoRefreshEnabled: false, // 是否启用自动刷新
      autoRefreshInterval: 300, // 自动刷新间隔（秒）- 默认5分钟
      autoRefreshTimer: null, // 定时器引用
      timeUntilRefresh: 0, // 距离下次刷新的时间（秒）
      lastRefreshTime: null, // 最后一次刷新时间
      refreshCount: 0, // 刷新次数统计

      // 常量定义
      PROCESS_STAGES: [
        { code: 'M', name: 'M加工', color: '#3498db', sort: 1 },
        { code: 'G', name: 'G加工', color: '#9b59b6', sort: 2 },
        { code: 'WE', name: '线切割', color: '#f1c40f', sort: 3 },
        { code: 'EDM', name: '电火花', color: '#e67e22', sort: 4 },
        { code: 'CNC', name: 'CNC加工', color: '#2ecc71', sort: 5 },
        { code: 'HNC', name: 'HNC加工', color: '#1abc9c', sort: 6 },
        { code: 'SG', name: '磨床', color: '#95a5a6', sort: 7 },
        { code: 'H', name: '热处理', color: '#e74c3c', sort: 8 },
        { code: 'QC', name: '质检', color: '#34495e', sort: 9 },
        { code: 'CAM', name: 'CAM设计', color: '#8e44ad', sort: 10 },
        { code: 'EP', name: '电极准备', color: '#d35400', sort: 11 }
      ],

      zoomOptions: [
        { value: 'day', label: '按天' },
        { value: 'hour', label: '按小时' },
        { value: '15min', label: '15分钟' }
      ],

      moldFields: [
        { key: 'index', name: '序号', icon: 'fas fa-list-ol' },
        { key: 'dispatch_no', name: '派工单号', icon: 'fas fa-hashtag' },
        { key: 'mold_no', name: '模号', icon: 'fas fa-industry' },
        { key: 'order_date', name: '投单日期', icon: 'fas fa-calendar-plus' },
        { key: 'deadline', name: '交期', icon: 'fas fa-calendar-check' },
        { key: 'actual_finish_date', name: '实际完成日期', icon: 'fas fa-calendar-day' },
        { key: 'progress', name: '当前进度', icon: 'fas fa-chart-line' },
        { key: 'delay_status', name: '是否Delay', icon: 'fas fa-exclamation-triangle' }
      ],

      prodFields: [
        { key: 'prod_index', name: '序号', icon: 'fas fa-list-ol' },
        { key: 'prod_order_no', name: '生产单号', icon: 'fas fa-hashtag' },
        { key: 'prod_mold_no', name: '模号', icon: 'fas fa-industry' },
        { key: 'piece_no', name: '件号', icon: 'fas fa-cube' },
        { key: 'version_no', name: '版次', icon: 'fas fa-code-branch' },
        { key: 'cam_electrode', name: 'CAM电极', icon: 'fas fa-microchip' },
        { key: 'process_status', name: '加工状态', icon: 'fas fa-tasks' },
        { key: 'plan_date', name: '计划开始', icon: 'fas fa-play-circle' },
        { key: 'plan_end_time', name: '计划结束', icon: 'fas fa-stop-circle' },
        { key: 'actual_start_time', name: '实际开始', icon: 'fas fa-play-circle' },
        { key: 'actual_end_time', name: '实际结束', icon: 'fas fa-stop-circle' },
        { key: 'delivery_level', name: '交期等级', icon: 'fas fa-flag' },
        { key: 'prod_delay_status', name: '状态', icon: 'fas fa-exclamation-triangle' }
      ],

      // 添加字典加载状态
      dictsLoaded: false,

      // 自动滚动相关
      autoScrollEnabled: true, // 是否启用自动滚动
      autoScrollSpeed: 1, // 滚动速度（像素/帧）- 提高速度使其更明显
      autoScrollTimer: null, // 自动滚动定时器
      isUserScrolling: false, // 用户是否正在滚动
      userScrollTimer: null // 用户滚动检测定时器
    };
  },

  computed: {
    titleDate() {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      return `${year}年${month}月${day}日`;
    },

    lastUpdated() {
      return `最后更新: ${new Date().toLocaleTimeString()}`;
    },

    // 格式化距离下次刷新的时间
    formatTimeUntilRefresh() {
      const minutes = Math.floor(this.timeUntilRefresh / 60);
      const seconds = this.timeUntilRefresh % 60;
      return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    },

    // 格式化最后刷新时间
    formatLastRefreshTime() {
      if (!this.lastRefreshTime) return '';
      return this.lastRefreshTime.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
    },

    // 格式化间隔时间显示
    formatIntervalTime() {
      return (seconds) => {
        if (seconds < 60) {
          return `${seconds}秒`;
        } else if (seconds < 3600) {
          return `${Math.floor(seconds / 60)}分钟`;
        } else {
          return `${Math.floor(seconds / 3600)}小时`;
        }
      };
    },

    sortedMoldData() {
      if (!this.sortState.column) return this.filteredMoldData;

      return [...this.filteredMoldData].sort((a, b) => {
        let aValue, bValue;

        switch (this.sortState.column) {
          case 'index':
            aValue = this.filteredMoldData.indexOf(a);
            bValue = this.filteredMoldData.indexOf(b);
            break;
          case 'dispatch_no':
            aValue = a.dispatch_no || '';
            bValue = b.dispatch_no || '';
            break;
          case 'mold_no':
            aValue = a.mold_no || '';
            bValue = b.mold_no || '';
            break;
          case 'order_date':
            aValue = new Date(a.order_date || 0);
            bValue = new Date(b.order_date || 0);
            break;
          case 'deadline':
            aValue = new Date(a.deadline || 0);
            bValue = new Date(b.deadline || 0);
            break;
          case 'actual_finish_date':
            aValue = a.actual_finish_date ? new Date(a.actual_finish_date) : new Date(0);
            bValue = b.actual_finish_date ? new Date(b.actual_finish_date) : new Date(0);
            break;
          case 'progress':
            aValue = this.moldProgress(a);
            bValue = this.moldProgress(b);
            break;
          case 'delay_status':
            aValue = this.getDelayStatusSortValue(a.delay_status);
            bValue = this.getDelayStatusSortValue(b.delay_status);
            break;
          default:
            aValue = a[this.sortState.column] || '';
            bValue = b[this.sortState.column] || '';
        }

        if (aValue < bValue) return this.sortState.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return this.sortState.direction === 'asc' ? 1 : -1;
        return 0;
      });
    },

    globalTimeRange() {
      const allDates = [];

      this.filteredMoldData.forEach(mold => {
        if (mold.order_date) allDates.push(new Date(mold.order_date));
        if (mold.deadline) allDates.push(new Date(mold.deadline));
        if (mold.actual_finish_date) allDates.push(new Date(mold.actual_finish_date));

        // 添加生产单的时间
        if (mold.prodList && mold.prodList.length > 0) {
          mold.prodList.forEach(prod => {
            if (prod.planDate) allDates.push(new Date(prod.planDate));
            if (prod.planEndTime) allDates.push(new Date(prod.planEndTime));
            if (prod.actualStartTime) allDates.push(new Date(prod.actualStartTime));
            if (prod.actualEndTime) allDates.push(new Date(prod.actualEndTime));

            // 添加工段的时间
            if (prod.sectionList && prod.sectionList.length > 0) {
              prod.sectionList.forEach(section => {
                if (section.planDate) allDates.push(new Date(section.planDate));
                if (section.planEndTime) allDates.push(new Date(section.planEndTime));
                if (section.actualStartTime) allDates.push(new Date(section.actualStartTime));
                if (section.actualEndTime) allDates.push(new Date(section.actualEndTime));
              });
            }
          });
        }
      });

      if (allDates.length === 0) {
        const today = new Date();
        const minDate = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
        const maxDate = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
        return { min: minDate, max: maxDate };
      }

      const minDate = new Date(Math.min(...allDates.map(d => d.getTime())));
      const maxDate = new Date(Math.max(...allDates.map(d => d.getTime())));

      const timeSpan = maxDate.getTime() - minDate.getTime();
      const margin = timeSpan * 0.1;

      return {
        min: new Date(minDate.getTime() - margin),
        max: new Date(maxDate.getTime() + margin)
      };
    }
  },

  watch: {
    filteredMoldData: {
      handler() {
        this.$nextTick(() => {
          if (this.filteredMoldData.length > 0) {
            this.renderAllGanttCharts();
          }
        });
      },
      deep: true
    },

    ganttZoomLevel() {
      this.$nextTick(() => {
        if (this.filteredMoldData.length > 0) {
          this.renderAllGanttCharts();
        }
      });
    },

    // 监听自动刷新状态变化
    autoRefreshEnabled(newVal) {
      if (newVal) {
        this.startAutoRefresh();
      } else {
        this.stopAutoRefresh();
      }
    },

    // 监听放大镜尺寸变化，重新渲染内容
    magnifierSize: {
      handler(newSize) {
        if (this.showMagnifier && this.currentMagnifierGantt) {
          // 重新渲染放大镜内容
          this.$nextTick(() => {
            this.updateMagnifierContent(
              this.currentMagnifierGantt.id,
              this.currentMagnifierGantt.type,
              { clientX: this.magnifierPosition.x, clientY: this.magnifierPosition.y }
            );
          });
        }
      },
      deep: true
    }
  },

  mounted() {
    this.initPage();
    document.addEventListener('mousemove', this.handleDocumentMouseMove);
    document.addEventListener('mouseup', this.handleDocumentMouseUp);

    // 添加页面鼠标事件监听
    document.addEventListener('mouseenter', this.handlePageMouseEnter);
    document.addEventListener('mouseleave', this.handlePageMouseLeave);

    this.$nextTick(() => {
      this.startAutoScroll();
    });
  },

  beforeDestroy() {
    document.removeEventListener('mousemove', this.handleDocumentMouseMove);
    document.removeEventListener('mouseup', this.handleDocumentMouseUp);
    document.removeEventListener('mouseenter', this.handlePageMouseEnter);
    document.removeEventListener('mouseleave', this.handlePageMouseLeave);

    if (this.magnifierTimer) {
      clearTimeout(this.magnifierTimer);
    }

    this.stopAutoRefresh();
    this.stopAutoScroll();

    if (this.userScrollTimer) {
      clearTimeout(this.userScrollTimer);
    }
  },

  methods: {
    async initPage() {
      try {
        this.setDefaultDateRange();
        this.initFieldVisibility();
        // 先加载字典
        await this.loadDicts();
        // 然后加载模具数据
        await this.loadMoldData();
      } catch (error) {
        this.loading = false;
        this.emptyStateMessage = `初始化页面失败: ${error.message}`;
      }
    },

    // 处理鼠标进入页面
    handlePageMouseEnter() {
      console.log('鼠标进入页面，暂停滚动');
      this.isUserScrolling = true;
      this.stopAutoScroll();
    },

    // 处理鼠标离开页面
    handlePageMouseLeave(event) {
      // 只有当鼠标离开浏览器窗口时才恢复滚动
      if (event.clientY <= 0 || event.clientX <= 0 ||
        event.clientX >= window.innerWidth ||
        event.clientY >= window.innerHeight) {
        console.log('鼠标离开页面，恢复滚动');
        this.isUserScrolling = false;
        if (this.autoScrollEnabled) {
          this.startAutoScroll();
        }
      }
    },

    async loadDicts() {
      try {
        // 加载延期状态字典
        const delayStatusRes = await getDicts('delay_status');
        console.log("delayStatusRes", delayStatusRes);
        if (delayStatusRes && delayStatusRes.code === 200) {
          this.delayStatusDict = Array.isArray(delayStatusRes.data) ? delayStatusRes.data : [];
          // 按 dictLabel 排序（阈值）
          this.delayStatusDict.sort((a, b) => Number(a.dictLabel) - Number(b.dictLabel));
          console.log("延期状态字典已加载:", this.delayStatusDict);
        }

        // 加载CAM电极状态字典
        const designStatusRes = await getDicts('design_tatus');
        if (designStatusRes && designStatusRes.code === 200) {
          this.designStatusDict = Array.isArray(designStatusRes.data) ? designStatusRes.data : [];
        }

        // 设置字典加载完成标志
        this.dictsLoaded = true;
      } catch (error) {
        // 即使加载失败，也设置字典加载完成标志，避免页面卡住
        this.dictsLoaded = true;
      }
    },

    // 获取延期状态显示文本
    getDelayStatusText(status) {
      // 处理null/undefined的情况
      if (status === null || status === undefined || status === '') {
        return '未知';
      }

      const statusNum = Number(status);

      // 特殊处理：0=正常，100=延期
      if (statusNum === 0) return '正常';
      if (statusNum === 100 || statusNum >= 100) return '延期';

      // 如果字典没有加载，根据数值返回
      if (!this.dictsLoaded || !this.delayStatusDict || this.delayStatusDict.length === 0) {
        if (statusNum >= 30) return '高风险';
        if (statusNum >= 20) return '中风险';
        if (statusNum >= 10) return '低风险';
        return '正常';
      }

      // 将字典按阈值(dictLabel)从小到大排序
      const sortedDict = [...this.delayStatusDict].sort((a, b) =>
        Number(a.dictLabel) - Number(b.dictLabel)
      );

      // 如果小于最小阈值，返回"正常"
      const minThreshold = Number(sortedDict[0]?.dictLabel) || 10;
      if (statusNum < minThreshold) {
        return '正常';
      }

      // 遍历字典，找到statusNum所在的区间
      for (let i = 0; i < sortedDict.length; i++) {
        const threshold = Number(sortedDict[i].dictLabel); // 阈值
        const label = sortedDict[i].dictValue; // 显示文本

        // 如果statusNum小于当前阈值，返回前一个阈值（或正常）
        if (statusNum < threshold) {
          if (i === 0) {
            return '正常';
          }
          return sortedDict[i-1].dictValue; // 返回前一个阈值的显示文本
        }

        // 如果statusNum等于当前阈值
        if (statusNum === threshold) {
          return label;
        }

        // 如果是最后一个阈值，并且statusNum大于它
        if (i === sortedDict.length - 1 && statusNum > threshold) {
          return label; // 返回最大阈值的显示文本
        }
      }

      // 默认返回正常
      return '正常';
    },

    // 获取延期状态样式类
    getDelayStatusClass(status) {
      // 处理null/undefined的情况
      if (status === null || status === undefined || status === '') {
        return 'status-unknown';
      }

      const statusNum = Number(status);

      // 0表示正常
      if (statusNum === 0) {
        return 'status-normal';
      }

      // 100表示延期
      if (statusNum === 100 || statusNum >= 100) {
        return 'status-delay';
      }

      // 如果字典为空，根据数值判断
      if (!this.dictsLoaded || !this.delayStatusDict || this.delayStatusDict.length === 0) {
        if (statusNum >= 30) return 'status-high';
        if (statusNum >= 20) return 'status-medium';
        if (statusNum >= 10) return 'status-low';
        return 'status-normal';
      }

      // 将字典按阈值(dictLabel)从小到大排序
      const sortedDict = [...this.delayStatusDict].sort((a, b) =>
        Number(a.dictLabel) - Number(b.dictLabel)
      );

      // 如果小于最小阈值，返回正常样式
      const minThreshold = Number(sortedDict[0]?.dictLabel) || 10;
      if (statusNum < minThreshold) {
        return 'status-normal';
      }

      // 根据数值直接判断颜色，不依赖字典查找
      if (statusNum >= 30) {
        return 'status-high';      // 红色 - 高风险
      } else if (statusNum >= 20) {
        return 'status-medium';    // 橙色 - 中风险
      } else if (statusNum >= 10) {
        return 'status-low';       // 蓝色 - 低风险
      }

      // 默认返回正常样式
      return 'status-normal';      // 绿色 - 正常
    },

    // 获取延期状态排序值
    getDelayStatusSortValue(status) {
      if (status === null || status === undefined || status === '') {
        return 999; // 未知状态排最后
      }

      const statusNum = Number(status);

      // 0表示正常，排最前
      if (statusNum === 0) {
        return 0;
      }

      // 100表示延期，排最后（除了未知）
      if (statusNum === 100 || statusNum >= 100) {
        return 1000;
      }

      // 其他情况按数值排序
      return statusNum;
    },

    // 获取CAM电极状态显示文本
    getCamElectrodeStatusText(status) {
      if (status === null || status === undefined || status === '') {
        return '未知';
      }

      const statusNum = Number(status);

      if (statusNum === 0) {
        return '正常';
      }

      if (statusNum === 100) {
        return '延期';
      }

      if (!this.dictsLoaded || !this.designStatusDict || this.designStatusDict.length === 0) {
        return statusNum.toString();
      }

      const sortedDict = [...this.designStatusDict].sort((a, b) =>
        Number(a.dictValue) - Number(b.dictValue)
      );

      let targetDictItem = null;
      for (let i = sortedDict.length - 1; i >= 0; i--) {
        const dictItem = sortedDict[i];
        const dictValue = Number(dictItem.dictValue);
        if (dictValue <= statusNum) {
          targetDictItem = dictItem;
          break;
        }
      }

      if (targetDictItem) {
        return targetDictItem.dictLabel;
      }

      if (sortedDict.length > 0) {
        return sortedDict[0].dictLabel;
      }

      return '正常';
    },

    // 获取CAM电极状态样式类
    getCamElectrodeStatusClass(status) {
      if (status === null || status === undefined || status === '') {
        return 'cam-status-unknown';
      }

      const statusNum = Number(status);

      if (statusNum === 0) {
        return 'cam-status-normal';
      }

      if (statusNum === 100) {
        return 'cam-status-delay';
      }

      if (!this.dictsLoaded || !this.designStatusDict || this.designStatusDict.length === 0) {
        if (statusNum === 4) {
          return 'cam-status-completed';
        } else if (statusNum >= 2) {
          return 'cam-status-processing';
        } else {
          return 'cam-status-waiting';
        }
      }

      const sortedDict = [...this.designStatusDict].sort((a, b) =>
        Number(a.dictValue) - Number(b.dictValue)
      );

      let targetDictItem = null;
      for (let i = sortedDict.length - 1; i >= 0; i--) {
        const dictItem = sortedDict[i];
        const dictValue = Number(dictItem.dictValue);
        if (dictValue <= statusNum) {
          targetDictItem = dictItem;
          break;
        }
      }

      if (targetDictItem) {
        const dictValue = Number(targetDictItem.dictValue);
        if (dictValue === 0) {
          return 'cam-status-waiting';
        } else if (dictValue === 1) {
          return 'cam-status-processing';
        } else if (dictValue === 2) {
          return 'cam-status-review';
        } else if (dictValue === 3) {
          return 'cam-status-completed';
        } else if (dictValue >= 100) {
          return 'cam-status-delay';
        } else {
          return 'cam-status-unknown';
        }
      }

      return 'cam-status-waiting';
    },

    // 放大镜功能方法
    handleGanttMouseEnter(ganttId, event, type) {
      this.currentMagnifierGantt = {id: ganttId, type: type};

      if (this.magnifierTimer) {
        clearTimeout(this.magnifierTimer);
      }

      this.magnifierTimer = setTimeout(() => {
        this.showMagnifier = true;
        this.updateMagnifierPosition(event);
        this.updateMagnifierContent(ganttId, type, event);
      }, 100);
    },

    handleGanttMouseMove(ganttId, event, type) {
      if (!this.showMagnifier || !this.currentMagnifierGantt) return;

      const ganttContainer = event.target.closest('.gantt-container');
      if (ganttContainer) {
        this.updateMagnifierPosition(event);
        this.updateMagnifierContent(ganttId, type, event);
      }
    },

    handleGanttMouseLeave() {
      if (this.magnifierTimer) {
        clearTimeout(this.magnifierTimer);
      }

      this.magnifierTimer = setTimeout(() => {
        if (!this.isMouseInMagnifier) {
          this.showMagnifier = false;
          this.currentMagnifierGantt = null;
          this.magnifierContent = '';
        }
      }, 300);
    },

    // 新增：生产单甘特图鼠标进入事件
    handleProdGanttMouseEnter(moldIndex, prodIndex, event) {
      const mold = this.sortedMoldData[moldIndex];
      const prod = this.sortedProds(mold)[prodIndex];

      if (!prod) return;

      const uniqueId = `${mold.mold_no}-${prod.prodOrderNo || prodIndex}`;
      this.currentMagnifierGantt = {
        id: uniqueId,
        type: 'prod',
        moldIndex,
        prodIndex
      };

      if (this.magnifierTimer) {
        clearTimeout(this.magnifierTimer);
      }

      this.magnifierTimer = setTimeout(() => {
        this.showMagnifier = true;
        this.updateMagnifierPosition(event);
        this.updateProdMagnifierContent(moldIndex, prodIndex, event);
      }, 100);
    },

    // 新增：生产单甘特图鼠标移动事件
    handleProdGanttMouseMove(moldIndex, prodIndex, event) {
      if (!this.showMagnifier || !this.currentMagnifierGantt) return;

      const ganttContainer = event.target.closest('.part-gantt-container');
      if (ganttContainer) {
        this.updateMagnifierPosition(event);
        this.updateProdMagnifierContent(moldIndex, prodIndex, event);
      }
    },

    handleDocumentMouseMove(event) {
      if (this.isResizing) {
        this.handleResize(event);
        return;
      }

      if (this.isMoving) {
        this.handleMove(event);
        return;
      }

      if (!this.showMagnifier) return;

      const magnifierElement = this.$refs.magnifierContainer;
      if (magnifierElement) {
        const rect = magnifierElement.getBoundingClientRect();
        const isInMagnifier =
          event.clientX >= rect.left &&
          event.clientX <= rect.right &&
          event.clientY >= rect.top &&
          event.clientY <= rect.bottom;

        this.isMouseInMagnifier = isInMagnifier;
        this.updateCursorStyle(event, rect);
      }

      const ganttContainer = event.target.closest('.gantt-container');
      if (!ganttContainer && !this.isMouseInMagnifier) {
        this.handleGanttMouseLeave();
      }
    },

    handleDocumentMouseUp(event) {
      if (this.isResizing) {
        this.isResizing = false;
        this.resizeDirection = null;
        document.body.style.userSelect = '';
        document.body.style.cursor = '';
      }
      if (this.isMoving) {
        this.isMoving = false;
        document.body.style.userSelect = '';
        document.body.style.cursor = '';
      }
    },

    updateCursorStyle(event, rect) {
      if (!rect) return;

      const cursorSize = 8;
      const {clientX, clientY} = event;

      const isNearTop = Math.abs(clientY - rect.top) < cursorSize;
      const isNearBottom = Math.abs(clientY - rect.bottom) < cursorSize;
      const isNearLeft = Math.abs(clientX - rect.left) < cursorSize;
      const isNearRight = Math.abs(clientX - rect.right) < cursorSize;

      let cursor = 'default';

      if (isNearTop && isNearLeft) cursor = 'nw-resize';
      else if (isNearTop && isNearRight) cursor = 'ne-resize';
      else if (isNearBottom && isNearLeft) cursor = 'sw-resize';
      else if (isNearBottom && isNearRight) cursor = 'se-resize';
      else if (isNearTop) cursor = 'n-resize';
      else if (isNearBottom) cursor = 's-resize';
      else if (isNearLeft) cursor = 'w-resize';
      else if (isNearRight) cursor = 'e-resize';
      else if (clientY - rect.top < 40 && clientX - rect.left > 100 && clientX - rect.right < -100) {
        cursor = 'move';
      }

      document.body.style.cursor = cursor;
    },

    // 放大镜鼠标进入事件
    handleMagnifierEnter() {
      this.isMouseInMagnifier = true;
      if (this.magnifierTimer) {
        clearTimeout(this.magnifierTimer);
      }
    },

    // 放大镜鼠标离开事件
    handleMagnifierLeave() {
      this.isMouseInMagnifier = false;
      this.showMagnifier = false;
      this.currentMagnifierGantt = null;
      this.magnifierContent = '';
    },

    updateMagnifierPosition(event) {
      const magnifierWidth = this.magnifierSize.width;
      const magnifierHeight = this.magnifierSize.height;
      const offset = 20;
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      let x = event.clientX + offset;
      let y = event.clientY + offset;

      if (x + magnifierWidth > viewportWidth) {
        x = event.clientX - magnifierWidth - offset;
      }
      if (x < 0) x = 10;

      if (y + magnifierHeight > viewportHeight) {
        y = event.clientY - magnifierHeight - offset;
      }
      if (y < 0) y = 10;

      this.magnifierPosition = {x, y};
    },

    updateMagnifierContent(ganttId, type, event) {
      const containerId = type === 'mold' ? `mold-gantt-${ganttId}` : `prod-gantt-${ganttId}`;
      const ganttElement = document.getElementById(containerId);

      if (!ganttElement) {
        this.magnifierContent = '<div class="magnifier-error">未找到甘特图</div>';
        return;
      }

      let data = null;
      let title = '';

      if (type === 'mold') {
        const moldIndex = parseInt(ganttId);
        const mold = this.sortedMoldData[moldIndex];
        if (mold) {
          data = mold;
          title = `模具: ${mold.mold_no}`;
        }
      } else {
        // 解析生产单的唯一标识
        const [moldNo, prodId] = ganttId.split('-').slice(0, 2);
        // 查找对应的生产单
        const mold = this.sortedMoldData.find(m => m.mold_no === moldNo);
        if (mold && mold.prodList) {
          // 尝试通过生产单号查找
          let prod = mold.prodList.find(p => p.prodOrderNo === prodId);
          // 如果没找到，尝试通过索引查找
          if (!prod) {
            const prodIndex = parseInt(prodId);
            if (!isNaN(prodIndex)) {
              prod = this.sortedProds(mold)[prodIndex];
            }
          }
          if (prod) {
            data = prod;
            title = `生产单: ${prod.prodOrderNo || '未知'}`;
          }
        }
      }

      if (!data) {
        this.magnifierContent = '<div class="magnifier-error">数据加载中...</div>';
        return;
      }

      this.magnifierContent = this.createMagnifierContent(data, type, title, event);
    },

    // 新增：更新生产单放大镜内容
    updateProdMagnifierContent(moldIndex, prodIndex, event) {
      const mold = this.sortedMoldData[moldIndex];
      const prod = this.sortedProds(mold)[prodIndex];

      if (!mold || !prod) {
        this.magnifierContent = '<div class="magnifier-error">未找到生产单数据</div>';
        return;
      }

      this.magnifierContent = this.createProdMagnifierContent(prod, `生产单: ${prod.prodOrderNo || '未知'}`, event);
    },

    createMagnifierContent(data, type, title, event) {
      const width = this.magnifierSize.width;
      const height = this.magnifierSize.height;

      let html = `
    <div class="magnifier-header" style="
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 8px 12px;
      font-size: ${width < 300 ? '10px' : '12px'};
      font-weight: bold;
      border-radius: 4px 4px 0 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
    ">
      <span>${title}</span>
      <span style="font-size: ${width < 300 ? '9px' : '10px'}; opacity: 0.9;">
        ${width}×${height}
      </span>
    </div>

    <div class="magnifier-body" style="
      padding: 10px;
      height: ${height - 70}px;
      overflow: auto;
      background: #f8f9fa;
    ">
  `;

      if (type === 'mold') {
        html += this.createMoldMagnifierContent(data);
      } else {
        html += this.createProdMagnifierContent(data, title, event);
      }

      html += '</div>';

      html += `
    <div class="magnifier-footer" style="
      background: rgba(0, 0, 0, 0.05);
      padding: 5px 12px;
      font-size: 10px;
      color: #666;
      border-top: 1px solid #e0e0e0;
      display: flex;
      justify-content: space-between;
    ">
      <span>${new Date().toLocaleTimeString()}</span>
      <span>拖动边缘调整大小</span>
    </div>
  `;

      return html;
    },

    createMoldMagnifierContent(mold) {
      const progress = this.moldProgress(mold);
      const delayStatus = this.getDelayStatusText(mold.delay_status);
      const delayClass = this.getDelayStatusClass(mold.delay_status);

      const now = new Date();
      const minDate = mold.order_date ? new Date(mold.order_date) : new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      const maxDate = mold.deadline ? new Date(mold.deadline) : new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

      if (minDate >= maxDate) {
        maxDate.setDate(minDate.getDate() + 30);
      }

      const totalDays = Math.max(1, (maxDate - minDate) / (1000 * 60 * 60 * 24));

      let ganttHtml = `
    <div style="margin-top: 8px; border: 1px solid #e0e0e0; border-radius: 4px; padding: 8px; background: white;">
      <div style="font-size: 11px; margin-bottom: 6px; color: #2c3e50; font-weight: bold;">
        时间线 (${totalDays.toFixed(1)} 天)
      </div>
      <div style="position: relative; height: 40px; background: #f5f7fa; border-radius: 3px;">
  `;

      const tickCount = 5;
      for (let i = 0; i <= tickCount; i++) {
        const percent = i / tickCount;
        const date = new Date(minDate.getTime() + (maxDate - minDate) * percent);
        const label = `${date.getMonth() + 1}/${date.getDate()}`;

        ganttHtml += `
      <div style="
        position: absolute;
        left: ${percent * 100}%;
        top: 0;
        height: 100%;
        width: 1px;
        background: ${i === 0 || i === tickCount ? '#2c3e50' : '#ddd'};
      ">
        <div style="
          position: absolute;
          top: -18px;
          left: -10px;
          font-size: 9px;
          color: #666;
          white-space: nowrap;
        ">${label}</div>
      </div>
    `;
      }

      const planStartPercent = 0;
      const planEndPercent = 100;
      ganttHtml += `
    <div style="
      position: absolute;
      left: ${planStartPercent}%;
      top: 10px;
      width: ${planEndPercent - planStartPercent}%;
      height: 15px;
      background: rgba(52, 152, 219, 0.7);
      border: 1px solid #2980b9;
      border-radius: 3px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 9px;
      color: white;
      font-weight: bold;
      z-index: 2;
    ">
      计划
    </div>
  `;

      if (mold.actual_start_date) {
        const actualStart = new Date(mold.actual_start_date);
        const actualEnd = mold.actual_finish_date ? new Date(mold.actual_finish_date) : now;

        const actualStartPercent = Math.max(0, Math.min(100, ((actualStart - minDate) / (maxDate - minDate)) * 100));
        const actualEndPercent = Math.max(0, Math.min(100, ((actualEnd - minDate) / (maxDate - minDate)) * 100));
        const actualWidth = Math.max(5, actualEndPercent - actualStartPercent);

        ganttHtml += `
      <div style="
        position: absolute;
        left: ${actualStartPercent}%;
        top: 25px;
        width: ${actualWidth}%;
        height: 15px;
        background: ${mold.actual_finish_date ? 'rgba(46, 204, 113, 0.7)' : 'rgba(230, 126, 34, 0.7)'};
        border: 1px solid ${mold.actual_finish_date ? '#27ae60' : '#d35400'};
        border-radius: 3px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 9px;
        color: white;
        font-weight: bold;
        z-index: 2;
      ">
        ${mold.actual_finish_date ? '实际' : '进行中'}
      </div>
    `;
      }

      ganttHtml += `
      </div>
    </div>
  `;

      const infoHtml = `
    <div style="
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 6px;
      margin-top: 10px;
      font-size: 11px;
    ">
      <div style="background: #f8f9fa; padding: 6px; border-radius: 3px;">
        <div style="color: #7f8c8d; font-size: 10px;">派工单号</div>
        <div>${mold.dispatch_no}</div>
      </div>
      <div style="background: #f8f9fa; padding: 6px; border-radius: 3px;">
        <div style="color: #7f8c8d; font-size: 10px;">模号</div>
        <div>${mold.mold_no}</div>
      </div>
      <div style="background: #f8f9fa; padding: 6px; border-radius: 3px;">
        <div style="color: #7f8c8d; font-size: 10px;">投单日期</div>
        <div>${this.formatDate(mold.order_date)}</div>
      </div>
      <div style="background: #f8f9fa; padding: 6px; border-radius: 3px;">
        <div style="color: #7f8c8d; font-size: 10px;">交期</div>
        <div>${this.formatDate(mold.deadline)}</div>
      </div>
      <div style="background: #f8f9fa; padding: 6px; border-radius: 3px;">
        <div style="color: #7f8c8d; font-size: 10px;">进度</div>
        <div>
          <div style="display: flex; align-items: center; gap: 6px;">
            <div style="flex: 1; height: 8px; background: #ecf0f1; border-radius: 4px; overflow: hidden;">
              <div style="height: 100%; width: ${progress}%; background: #2ecc71; border-radius: 4px;"></div>
            </div>
            <span style="font-weight: bold;">${progress}%</span>
          </div>
        </div>
      </div>
      <div style="background: #f8f9fa; padding: 6px; border-radius: 3px;">
        <div style="color: #7f8c8d; font-size: 10px;">状态</div>
        <div>
          <span class="${delayClass}" style="padding: 2px 6px; border-radius: 3px; font-size: 10px;">
            ${delayStatus}
          </span>
        </div>
      </div>
    </div>
  `;

      return ganttHtml + infoHtml;
    },

    createProdMagnifierContent(prod, title, event) {
      let html = `
    <div style="
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 6px;
      margin-top: 10px;
      font-size: 11px;
    ">
      <div style="background: #f8f9fa; padding: 6px; border-radius: 3px;">
        <div style="color: #7f8c8d; font-size: 10px;">生产单号</div>
        <div style="font-weight: bold; color: #2c3e50;">${prod.prodOrderNo || 'N/A'}</div>
      </div>
      <div style="background: #f8f9fa; padding: 6px; border-radius: 3px;">
        <div style="color: #7f8c8d; font-size: 10px;">件号</div>
        <div style="font-weight: bold; color: #2c3e50;">${prod.pieceNo || 'N/A'}</div>
      </div>
      <div style="background: #f8f9fa; padding: 6px; border-radius: 3px;">
        <div style="color: #7f8c8d; font-size: 10px;">版次</div>
        <div style="font-weight: bold; color: #2c3e50;">${prod.versionNo || 'N/A'}</div>
      </div>
      <div style="background: #f8f9fa; padding: 6px; border-radius: 3px;">
        <div style="color: #7f8c8d; font-size: 10px;">加工状态</div>
        <div>
          <span class="${this.processStatusClass(prod.processStatus)}" style="padding: 2px 6px; border-radius: 3px; font-size: 10px; display: inline-block;">
            ${prod.processStatus || '待签收'}
          </span>
        </div>
      </div>
  `;

      if (prod.processingProgress !== undefined && prod.processingProgress !== null) {
        const progress = parseFloat(prod.processingProgress) * 100;
        html += `
      <div style="background: #f8f9fa; padding: 6px; border-radius: 3px; grid-column: span 2;">
        <div style="color: #7f8c8d; font-size: 10px;">加工进度</div>
        <div style="display: flex; align-items: center; gap: 8px; margin-top: 4px;">
          <div style="flex: 1; height: 10px; background: #e0e0e0; border-radius: 5px; overflow: hidden;">
            <div style="height: 100%; width: ${Math.min(progress, 100)}%; background: #2ecc71; border-radius: 5px;"></div>
          </div>
          <div style="font-weight: bold; color: #2c3e50; min-width: 40px;">${Math.round(progress)}%</div>
        </div>
      </div>
    `;
      }

      html += '</div>';

      if (prod.sectionList && prod.sectionList.length > 0) {
        let allDates = [];
        prod.sectionList.forEach(section => {
          if (section.planDate) allDates.push(new Date(section.planDate));
          if (section.planEndTime) allDates.push(new Date(section.planEndTime));
          if (section.actualStartTime) allDates.push(new Date(section.actualStartTime));
          if (section.actualEndTime) allDates.push(new Date(section.actualEndTime));
        });

        if (allDates.length === 0) {
          const now = new Date();
          allDates.push(new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000));
          allDates.push(new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000));
        }

        const minDate = new Date(Math.min(...allDates.map(d => d.getTime())));
        const maxDate = new Date(Math.max(...allDates.map(d => d.getTime())));

        if (isNaN(minDate.getTime()) || isNaN(maxDate.getTime()) || minDate >= maxDate) {
          const now = new Date();
          minDate.setTime(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          maxDate.setTime(now.getTime() + 7 * 24 * 60 * 60 * 1000);
        }

        const totalTime = maxDate.getTime() - minDate.getTime();

        html += `
      <div style="margin-top: 12px; border-top: 1px solid #e0e0e0; padding-top: 8px;">
        <div style="font-size: 11px; font-weight: bold; color: #2c3e50; margin-bottom: 8px; display: flex; justify-content: space-between; align-items: center;">
          <span>工段进度 (${prod.sectionList.length}个工段)</span>
          <span style="font-size: 9px; color: #7f8c8d;">计划/实际对比</span>
        </div>
    `;

        prod.sectionList.forEach((section, index) => {
          const sectionInfo = this.PROCESS_STAGES.find(p => p.code === section.section) ||
            {name: section.section, color: '#3498db'};

          const planStart = this.parseDate(section.planDate);
          const planEnd = this.parseDate(section.planEndTime);
          const actualStart = this.parseDate(section.actualStartTime);
          const actualEnd = this.parseDate(section.actualEndTime);

          let planStartPos = 0;
          let planWidth = 0;
          let actualStartPos = 0;
          let actualWidth = 0;

          if (planStart && planEnd && !isNaN(planStart.getTime()) && !isNaN(planEnd.getTime())) {
            planStartPos = Math.max(0, ((planStart.getTime() - minDate.getTime()) / totalTime) * 100);
            planWidth = Math.max(2, ((planEnd.getTime() - planStart.getTime()) / totalTime) * 100);
          }

          if (actualStart && !isNaN(actualStart.getTime())) {
            const actualEndTime = actualEnd && !isNaN(actualEnd.getTime()) ? actualEnd : new Date();
            actualStartPos = Math.max(0, ((actualStart.getTime() - minDate.getTime()) / totalTime) * 100);
            actualWidth = Math.max(2, ((actualEndTime.getTime() - actualStart.getTime()) / totalTime) * 100);
          }

          html += `
        <div style="
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 6px;
          font-size: 10px;
          background: ${index % 2 === 0 ? '#f8f9fa' : '#ffffff'};
          padding: 6px;
          border-radius: 4px;
        ">
          <div style="width: 40px; display: flex; flex-direction: column; align-items: center;">
            <div style="
              width: 24px;
              height: 24px;
              background: ${sectionInfo.color};
              color: white;
              border-radius: 12px;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 10px;
              font-weight: bold;
            ">
              ${section.section}
            </div>
            <div style="font-size: 8px; color: #666; margin-top: 2px; text-align: center;">
              ${sectionInfo.name}
            </div>
          </div>

          <div style="flex: 1; position: relative; height: 32px; background: #f5f7fa; border-radius: 4px; overflow: hidden;">
            <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0;">
              ${Array.from({length: 5}).map((_, i) => {
            const pos = (i / 4) * 100;
            return `
                  <div style="position: absolute; left: ${pos}%; top: 0; bottom: 0; width: 1px; background: #e0e0e0;"></div>
                `;
          }).join('')}
            </div>

            ${planWidth > 0 ? `
              <div style="
                position: absolute;
                left: ${planStartPos}%;
                width: ${planWidth}%;
                top: 4px;
                height: 10px;
                background: ${sectionInfo.color}80;
                border: 1px solid ${sectionInfo.color};
                border-radius: 3px;
                cursor: help;
                z-index: 2;
                transition: all 0.2s;
              " title="计划: ${this.formatDateTimeFull(section.planDate)} - ${this.formatDateTimeFull(section.planEndTime)}">
                <div style="
                  position: absolute;
                  top: 50%;
                  left: 50%;
                  transform: translate(-50%, -50%);
                  font-size: 8px;
                  color: white;
                  font-weight: bold;
                  text-shadow: 1px 1px 1px rgba(0,0,0,0.3);
                ">计</div>
              </div>
            ` : ''}

            ${actualWidth > 0 ? `
              <div style="
                position: absolute;
                left: ${actualStartPos}%;
                width: ${actualWidth}%;
                top: 18px;
                height: 10px;
                background: ${actualEnd && !isNaN(actualEnd.getTime()) ? sectionInfo.color : `${sectionInfo.color}40`};
                border: 1px solid ${this.darkenColor(sectionInfo.color, 30)};
                border-radius: 3px;
                cursor: help;
                z-index: 2;
                transition: all 0.2s;
              " title="${actualEnd && !isNaN(actualEnd.getTime()) ? '实际' : '进行中'}: ${this.formatDateTimeFull(section.actualStartTime)} - ${actualEnd ? this.formatDateTimeFull(section.actualEndTime) : '进行中'}">
                <div style="
                  position: absolute;
                  top: 50%;
                  left: 50%;
                  transform: translate(-50%, -50%);
                  font-size: 8px;
                  color: white;
                  font-weight: bold;
                  text-shadow: 1px 1px 1px rgba(0,0,0,0.3);
                ">${actualEnd && !isNaN(actualEnd.getTime()) ? '实' : '进'}</div>
              </div>
            ` : ''}
          </div>

          <div style="width: 70px; display: flex; flex-direction: column; align-items: center;">
            <span style="padding: 2px 6px; background: ${section.processStatus === '已完成' ? '#2ecc71' : section.processStatus === '加工中' ? '#3498db' : '#95a5a6'}; color: white; border-radius: 3px; font-size: 9px; font-weight: bold; margin-bottom: 2px;">
              ${section.processStatus || '待签收'}
            </span>
            ${section.delayStatus && section.delayStatus !== '0' ? `
              <span class="${this.getDelayStatusClass(section.delayStatus)}" style="padding: 1px 4px; border-radius: 2px; font-size: 8px;">
                ${this.getDelayStatusText(section.delayStatus)}
              </span>
            ` : ''}
          </div>
        </div>
      `;
        });

        html += `
        <div style="
          position: relative;
          height: 20px;
          margin-top: 5px;
          background: #f8f9fa;
          border-radius: 3px;
          padding: 0 5px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        ">
    `;

        const tickCount = 5;
        for (let i = 0; i <= tickCount; i++) {
          const percent = i / tickCount;
          const date = new Date(minDate.getTime() + totalTime * percent);
          const label = `${date.getMonth() + 1}/${date.getDate()}`;

          html += `
          <div style="
            position: relative;
            flex: 1;
            text-align: center;
          ">
            <div style="
              font-size: 8px;
              color: #666;
              white-space: nowrap;
            ">${label}</div>
          </div>
      `;
        }

        html += `
        </div>
      </div>
    `;

        const uniqueSections = [...new Set(prod.sectionList.map(s => s.section))];
        if (uniqueSections.length > 0) {
          html += `
        <div style="margin-top: 10px; padding: 6px; background: #f8f9fa; border-radius: 4px;">
          <div style="font-size: 10px; color: #2c3e50; font-weight: bold; margin-bottom: 4px;">工段说明</div>
          <div style="display: flex; flex-wrap: wrap; gap: 8px;">
      `;

          uniqueSections.forEach(sectionCode => {
            const sectionInfo = this.PROCESS_STAGES.find(p => p.code === sectionCode);
            if (sectionInfo) {
              html += `
            <div style="display: flex; align-items: center; gap: 4px; font-size: 9px;">
              <div style="width: 12px; height: 12px; background: ${sectionInfo.color}; border-radius: 3px;"></div>
              <span style="color: #2c3e50;">${sectionInfo.name}</span>
            </div>
          `;
            }
          });

          html += `
          </div>
        </div>
      `;
        }
      } else {
        html += `
      <div style="margin-top: 12px; border-top: 1px solid #e0e0e0; padding-top: 8px;">
        <div style="
          font-size: 11px;
          color: #95a5a6;
          text-align: center;
          padding: 20px;
          background: #f8f9fa;
          border-radius: 4px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
        ">
          <i class="fas fa-clipboard-list" style="font-size: 24px; color: #bdc3c7;"></i>
          <div>暂无工段数据</div>
          <div style="font-size: 10px;">该生产单未分配工段</div>
        </div>
      </div>
    `;
      }

      return html;
    },

    // 放大镜大小调整方法
    startResize(event, direction) {
      event.stopPropagation();
      this.isResizing = true;
      this.resizeDirection = direction;
      this.initialMousePos = {
        x: event.clientX,
        y: event.clientY
      };
      this.initialMagnifierSize = {
        width: this.magnifierSize.width,
        height: this.magnifierSize.height
      };
      this.initialMagnifierPos = {
        x: this.magnifierPosition.x,
        y: this.magnifierPosition.y
      };

      document.body.style.userSelect = 'none';
      document.body.style.cursor = this.getResizeCursor(direction);
    },

    getResizeCursor(direction) {
      const cursors = {
        'n': 'n-resize',
        's': 's-resize',
        'e': 'e-resize',
        'w': 'w-resize',
        'ne': 'ne-resize',
        'nw': 'nw-resize',
        'se': 'se-resize',
        'sw': 'sw-resize'
      };
      return cursors[direction] || 'default';
    },

    handleResize(event) {
      if (!this.isResizing || !this.resizeDirection) return;

      const deltaX = event.clientX - this.initialMousePos.x;
      const deltaY = event.clientY - this.initialMousePos.y;

      let newWidth = this.initialMagnifierSize.width;
      let newHeight = this.initialMagnifierSize.height;
      let newX = this.initialMagnifierPos.x;
      let newY = this.initialMagnifierPos.y;

      if (this.resizeDirection.includes('e')) {
        newWidth = Math.max(
          this.minMagnifierSize.width,
          Math.min(this.maxMagnifierSize.width, this.initialMagnifierSize.width + deltaX)
        );
      }

      if (this.resizeDirection.includes('w')) {
        const widthChange = this.initialMagnifierSize.width - Math.max(
          this.minMagnifierSize.width,
          Math.min(this.maxMagnifierSize.width, this.initialMagnifierSize.width - deltaX)
        );
        newWidth = this.initialMagnifierSize.width - widthChange;
        newX = this.initialMagnifierPos.x + deltaX;
      }

      if (this.resizeDirection.includes('s')) {
        newHeight = Math.max(
          this.minMagnifierSize.height,
          Math.min(this.maxMagnifierSize.height, this.initialMagnifierSize.height + deltaY)
        );
      }

      if (this.resizeDirection.includes('n')) {
        const heightChange = this.initialMagnifierSize.height - Math.max(
          this.minMagnifierSize.height,
          Math.min(this.maxMagnifierSize.height, this.initialMagnifierSize.height - deltaY)
        );
        newHeight = this.initialMagnifierSize.height - heightChange;
        newY = this.initialMagnifierPos.y + deltaY;
      }

      const maxX = window.innerWidth - newWidth;
      const maxY = window.innerHeight - newHeight;

      newX = Math.max(0, Math.min(maxX, newX));
      newY = Math.max(0, Math.min(maxY, newY));

      this.magnifierSize = {
        width: Math.round(newWidth),
        height: Math.round(newHeight)
      };

      this.magnifierPosition = {
        x: Math.round(newX),
        y: Math.round(newY)
      };
    },

    // 放大镜移动功能
    startMove(event) {
      event.stopPropagation();
      this.isMoving = true;
      this.initialMousePos = {
        x: event.clientX,
        y: event.clientY
      };
      this.initialMagnifierPos = {
        x: this.magnifierPosition.x,
        y: this.magnifierPosition.y
      };

      document.body.style.userSelect = 'none';
      document.body.style.cursor = 'move';
    },

    handleMove(event) {
      if (!this.isMoving) return;

      const deltaX = event.clientX - this.initialMousePos.x;
      const deltaY = event.clientY - this.initialMousePos.y;

      const newX = this.initialMagnifierPos.x + deltaX;
      const newY = this.initialMagnifierPos.y + deltaY;

      const maxX = window.innerWidth - this.magnifierSize.width;
      const maxY = window.innerHeight - this.magnifierSize.height;

      this.magnifierPosition = {
        x: Math.max(0, Math.min(maxX, newX)),
        y: Math.max(0, Math.min(maxY, newY))
      };
    },

    // 放大镜缩放控制
    adjustMagnifierSize(scale) {
      const newWidth = Math.max(
        this.minMagnifierSize.width,
        Math.min(this.maxMagnifierSize.width, this.magnifierSize.width * scale)
      );
      const newHeight = Math.max(
        this.minMagnifierSize.height,
        Math.min(this.maxMagnifierSize.height, this.magnifierSize.height * scale)
      );

      this.magnifierSize = {
        width: Math.round(newWidth),
        height: Math.round(newHeight)
      };

      this.constrainToScreen();
    },

    resetMagnifierSize() {
      this.magnifierSize = {
        width: 320,
        height: 220
      };
      this.constrainToScreen();
    },

    constrainToScreen() {
      const maxX = window.innerWidth - this.magnifierSize.width;
      const maxY = window.innerHeight - this.magnifierSize.height;

      this.magnifierPosition = {
        x: Math.max(0, Math.min(maxX, this.magnifierPosition.x)),
        y: Math.max(0, Math.min(maxY, this.magnifierPosition.y))
      };
    },

    closeMagnifier() {
      this.showMagnifier = false;
      this.currentMagnifierGantt = null;
      this.magnifierContent = '';
      this.isMouseInMagnifier = false;
    },

    // 自动刷新相关方法
    handleAutoRefreshToggle() {
      if (this.autoRefreshEnabled) {
        this.$message.success(`已启用自动刷新，每${this.formatIntervalTime(this.autoRefreshInterval)}刷新一次`);
      } else {
        this.$message.info('已禁用自动刷新');
      }
    },

    updateRefreshInterval() {
      if (this.autoRefreshEnabled) {
        this.stopAutoRefresh();
        this.startAutoRefresh();
        this.$message.success(`刷新间隔已设置为: ${this.formatIntervalTime(this.autoRefreshInterval)}`);
      }
    },

    startAutoRefresh() {
      this.stopAutoRefresh();

      this.timeUntilRefresh = this.autoRefreshInterval;

      this.autoRefreshTimer = setInterval(() => {
        this.timeUntilRefresh--;

        if (this.timeUntilRefresh <= 0) {
          this.executeAutoRefresh();
        }
      }, 1000);
    },

    stopAutoRefresh() {
      if (this.autoRefreshTimer) {
        clearInterval(this.autoRefreshTimer);
        this.autoRefreshTimer = null;
      }
      this.timeUntilRefresh = 0;
    },

    async executeAutoRefresh() {
      try {
        const scrollTop = document.querySelector('.mold-schedule-container')?.scrollTop || 0;

        await this.loadMoldData();

        this.$nextTick(() => {
          const container = document.querySelector('.mold-schedule-container');
          if (container) {
            container.scrollTop = scrollTop;
          }
          if (this.autoScrollEnabled && !this.isUserScrolling) {
            this.startAutoScroll();
          }
        });

        this.lastRefreshTime = new Date();
        this.refreshCount++;

        this.timeUntilRefresh = this.autoRefreshInterval;

        console.log(`数据已自动刷新 (${this.refreshCount}次)`);

      } catch (error) {
        console.error('自动刷新失败:', error);
        this.timeUntilRefresh = this.autoRefreshInterval;
      }
    },

    // 自动滚动相关方法
    startAutoScroll() {
      this.stopAutoScroll();

      if (!this.autoScrollEnabled) {
        return;
      }

      const scroll = () => {
        if (!this.autoScrollEnabled || this.isUserScrolling) {
          return;
        }

        const container = document.querySelector('.mold-schedule-container');
        if (!container) {
          return;
        }

        const scrollHeight = container.scrollHeight;
        const clientHeight = container.clientHeight;
        const maxScroll = scrollHeight - clientHeight;

        if (maxScroll <= 0) {
          this.autoScrollTimer = requestAnimationFrame(scroll);
          return;
        }

        const currentScroll = container.scrollTop;

        if (currentScroll >= maxScroll - 1) {
          container.scrollTop = 0;
        } else {
          container.scrollTop = currentScroll + this.autoScrollSpeed;
        }

        this.autoScrollTimer = requestAnimationFrame(scroll);
      };

      this.$nextTick(() => {
        this.autoScrollTimer = requestAnimationFrame(scroll);
      });
    },

    stopAutoScroll() {
      if (this.autoScrollTimer) {
        cancelAnimationFrame(this.autoScrollTimer);
        this.autoScrollTimer = null;
      }
    },

    // 处理用户滚动事件
    handleUserScroll() {
      this.isUserScrolling = true;

      if (this.userScrollTimer) {
        clearTimeout(this.userScrollTimer);
      }

      this.userScrollTimer = setTimeout(() => {
        this.isUserScrolling = false;
        if (this.autoScrollEnabled) {
          this.startAutoScroll();
        }
      }, 6000);
    },

    // 处理鼠标进入容器（暂停滚动）
    handleContainerMouseEnter() {
      this.isUserScrolling = true;
      this.stopAutoScroll();
    },

    // 处理鼠标离开容器（恢复滚动）
    handleContainerMouseLeave() {
      this.isUserScrolling = false;
      if (this.autoScrollEnabled) {
        this.startAutoScroll();
      }
    },

    setDefaultDateRange() {
      const end = new Date();
      const start = new Date();
      start.setMonth(start.getMonth() - 2);

      this.startDate = start.toISOString().split('T')[0];
      this.endDate = end.toISOString().split('T')[0];
    },

    initFieldVisibility() {
      this.moldFields.forEach(field => {
        this.$set(this.fieldVisibility, field.key, true);
      });

      this.prodFields.forEach(field => {
        this.$set(this.fieldVisibility, field.key, true);
      });
    },

    toggleSettingsModal() {
      this.showSettingsModal = !this.showSettingsModal;
    },

    closeSettingsModal() {
      this.showSettingsModal = false;
    },

    updateColumnVisibility() {
      this.$nextTick(() => {
        if (this.filteredMoldData.length > 0) {
          this.renderAllGanttCharts();
        }
      });
    },

    handleMoldSelectionChange() {
      this.filterMoldData();
    },

    async loadMoldData() {
      this.loading = true;

      try {
        const params = {
          beginTime: this.formatDateToISO(this.startDate, 'start'),
          endTime: this.formatDateToISO(this.endDate, 'end')
        };

        const response = await getMoldProcessOverview(params);

        if (response && response.code === 200) {
          const data = response.rows || response.data || [];

          if (data.length === 0) {
            this.$message.warning('当前时间段内没有找到模具数据');
          }

          this.moldData = this.transformBackendData(data);
          this.updateMoldList();
          this.filterMoldData();
          this.loading = false;

          this.lastRefreshTime = new Date();
          this.refreshCount++;

          this.$nextTick(() => {
            if (this.filteredMoldData.length > 0) {
              this.renderAllGanttCharts();
            }
            setTimeout(() => {
              if (this.autoScrollEnabled && !this.isUserScrolling) {
                this.startAutoScroll();
              }
            }, 500);
          });
        } else {
          const errorMsg = response.msg || '获取数据失败';
          this.$message.error(errorMsg);
          this.loading = false;
          this.emptyStateMessage = errorMsg;
        }
      } catch (error) {
        if (error.name === 'TypeError' && error.message.includes('NetworkError')) {
          this.$message.error('网络连接失败，请检查网络');
          this.emptyStateMessage = '网络连接失败，请检查网络';
        } else {
          this.$message.error(`获取数据失败: ${error.message}`);
          this.emptyStateMessage = `获取数据失败: ${error.message}`;
        }

        this.moldData = [];
        this.filteredMoldData = [];
        this.loading = false;
      }
    },

    formatDateToISO(dateStr, type = 'start') {
      if (!dateStr) return '';

      try {
        if (/^\d{4}-\d{2}-\d{2}T/.test(dateStr)) {
          return dateStr;
        }

        let date;
        if (type === 'start') {
          date = new Date(dateStr + 'T00:00:00.000Z');
        } else {
          date = new Date(dateStr + 'T23:59:59.999Z');
        }

        return date.toISOString();
      } catch (e) {
        if (type === 'start') {
          const now = new Date();
          now.setHours(0, 0, 0, 0);
          return now.toISOString();
        } else {
          const now = new Date();
          now.setHours(23, 59, 59, 999);
          return now.toISOString();
        }
      }
    },

    // 转换后端数据
    transformBackendData(backendData) {
      if (!backendData || !Array.isArray(backendData)) {
        return [];
      }

      return backendData.map((item, index) => {
        let orderDate = this.convertTimestampToISO(item.orderDate);
        let deadline = this.convertTimestampToISO(item.demandDate);
        let actualFinishDate = this.convertTimestampToISO(item.actualEndDate);

        const moldItem = {
          id: item.id || index + 1,
          dispatch_no: item.dispatchOrderNo || `派工单${index + 1}`,
          mold_no: item.moduleNo || `模具${index + 1}`,
          customer_code: item.customerCode,
          customer_name: item.customerName,
          customer_order_no: item.customerOrderNo,
          investor: item.investor,
          processing_content: item.processingContent,
          order_nature: item.orderNature,
          order_date: orderDate,
          deadline: deadline,
          processing_progress: item.processingProgress || 0,
          actual_start_date: this.convertTimestampToISO(item.actualStartDate),
          actual_finish_date: actualFinishDate,
          delay_status: item.delayStatus,
          sort: item.sort || index,
          prodList: this.transformProdList(item.prodList || [], item.moduleNo)
        };

        return moldItem;
      });
    },

    // 转换生产单数据 - 修复：添加生产单号到工段数据
    transformProdList(prodList, moduleNo) {
      if (!prodList || !Array.isArray(prodList)) {
        return [];
      }

      return prodList.map(prod => {
        const transformedProd = {
          prodOrderNo: prod.prodOrderNo,
          moduleNo: prod.moduleNo || moduleNo,
          pieceNo: prod.pieceNo,
          versionNo: prod.versionNo,
          designStatus: prod.designStatus,
          processStatus: prod.processStatus,
          planDate: this.convertTimestampToISO(prod.planDate),
          planEndTime: this.convertTimestampToISO(prod.planEndTime),
          actualStartTime: this.convertTimestampToISO(prod.actualStartTime),
          actualEndTime: this.convertTimestampToISO(prod.actualEndTime),
          deliveryLevel: prod.deliveryLevel,
          delayStatus: prod.delayStatus,
          sectionList: this.transformSectionList(prod.sectionList || [], prod.prodOrderNo) // 传递生产单号
        };

        return transformedProd;
      });
    },

    // 转换工段数据 - 修复：添加生产单号关联
    transformSectionList(sectionList, prodOrderNo) {
      if (!sectionList || !Array.isArray(sectionList)) {
        return [];
      }

      const transformedList = sectionList.map(section => {
        const planDate = this.convertTimestampToISO(section.planDate);
        const planEndTime = this.convertTimestampToISO(section.planEndTime);
        const actualStartTime = this.convertTimestampToISO(section.actualStartTime);
        const actualEndTime = this.convertTimestampToISO(section.actualEndTime);

        return {
          section: section.section,
          planDate: planDate,
          planEndTime: planEndTime,
          actualStartTime: actualStartTime,
          actualEndTime: actualEndTime,
          processStatus: section.processStatus,
          delayStatus: section.delayStatus,
          deliveryLevel: section.deliveryLevel,
          sort: section.sort || 0,
          prodOrderNo: prodOrderNo // 添加工段关联的生产单号
        };
      });

      // 使用统一的排序方法
      return this.sortSections(transformedList);
    },

    // 统一工段排序方法
    sortSections(sections) {
      if (!sections || !Array.isArray(sections)) {
        return [];
      }

      console.log('排序前工段数据:', sections.map(s => ({
        工段代码: s.section,
        生产单号: s.prodOrderNo,
        sort字段: s.sort,
        工段名称: this.PROCESS_STAGES.find(p => p.code === s.section)?.name || s.section
      })));

      // 使用slice()创建新数组进行排序，避免修改原数组
      const sorted = [...sections].sort((a, b) => {
        // 1. 首先按sort字段排序
        const sortA = Number(a.sort) || 0;
        const sortB = Number(b.sort) || 0;
        if (sortA !== sortB) {
          return sortA - sortB;
        }

        // 2. 如果sort相同，按工段代码在PROCESS_STAGES中定义的顺序排序
        const stageA = this.PROCESS_STAGES.find(p => p.code === a.section);
        const stageB = this.PROCESS_STAGES.find(p => p.code === b.section);

        // 如果都在预定义列表中，按列表顺序排序
        if (stageA && stageB) {
          return (stageA.sort || 99) - (stageB.sort || 99);
        }

        // 如果只有一方在列表中，在列表中的排前面
        if (stageA && !stageB) return -1;
        if (!stageA && stageB) return 1;

        // 如果都不在列表中，按工段代码的自然顺序排序
        const sectionA = a.section || '';
        const sectionB = b.section || '';

        // 使用localeCompare的自然排序
        return sectionA.localeCompare(sectionB, undefined, {
          numeric: true,
          sensitivity: 'base'
        });
      });

      console.log('排序后工段数据:', sorted.map(s => ({
        工段代码: s.section,
        生产单号: s.prodOrderNo,
        sort字段: s.sort,
        工段名称: this.PROCESS_STAGES.find(p => p.code === s.section)?.name || s.section
      })));

      return sorted;
    },

    // 时间戳转换方法
    convertTimestampToISO(timestamp) {
      if (!timestamp) {
        return null;
      }

      try {
        if (timestamp instanceof Date) {
          return timestamp.toISOString();
        }

        let date;

        if (typeof timestamp === 'number') {
          if (timestamp > 1000000000000) {
            date = new Date(timestamp);
          } else {
            date = new Date(timestamp * 1000);
          }
        } else if (typeof timestamp === 'string') {
          const trimmedTimestamp = timestamp.trim();

          if (!isNaN(Number(trimmedTimestamp))) {
            const num = Number(trimmedTimestamp);
            if (num > 1000000000000) {
              date = new Date(num);
            } else {
              date = new Date(num * 1000);
            }
          } else {
            date = new Date(trimmedTimestamp);
          }
        }

        if (date && !isNaN(date.getTime())) {
          const offset = date.getTimezoneOffset() * 60000;
          const localTime = new Date(date.getTime() - offset);
          return localTime.toISOString().slice(0, 19).replace('T', ' ');
        }

        return timestamp;
      } catch (error) {
        return timestamp;
      }
    },

    updateMoldList() {
      const moldNos = [...new Set(this.moldData.map(mold => mold.mold_no))];
      this.moldList = moldNos;
      this.selectedMoldNos = [...moldNos];
    },

    filterMoldData() {
      if (this.selectedMoldNos.length === 0) {
        this.filteredMoldData = [...this.moldData];
        this.emptyStateMessage = '请选择至少一个模具';
        return;
      }

      let filtered = this.moldData.filter(mold =>
        this.selectedMoldNos.includes(mold.mold_no)
      );

      filtered = this.filterByDateInternal(filtered);

      this.filteredMoldData = filtered;

      if (this.filteredMoldData.length === 0) {
        this.emptyStateMessage = '当前选择无模具进度数据';
      } else {
        this.emptyStateMessage = '';
      }

      this.$nextTick(() => {
        this.renderAllGanttCharts();
      });
    },

    filterByDate() {
      this.filterMoldData();
      this.loadMoldData();
    },

    filterByDateInternal(data) {
      const start = this.startDate ? new Date(this.startDate) : null;
      const end = this.endDate ? new Date(this.endDate) : null;

      if (!start && !end) {
        return data;
      }

      return data.filter(mold => {
        const orderDate = mold.order_date ? new Date(mold.order_date) : null;
        const deadline = mold.deadline ? new Date(mold.deadline) : null;

        if (!orderDate && !deadline) return false;

        let inRange = true;

        if (start) {
          if (orderDate && orderDate < start && deadline && deadline < start) {
            inRange = false;
          } else if (orderDate && orderDate < start && !deadline) {
            inRange = false;
          } else if (!orderDate && deadline && deadline < start) {
            inRange = false;
          }
        }

        if (end) {
          if (orderDate && orderDate > end && deadline && deadline > end) {
            inRange = false;
          } else if (orderDate && orderDate > end && !deadline) {
            inRange = false;
          } else if (!orderDate && deadline && deadline > end) {
            inRange = false;
          }
        }

        return inRange;
      });
    },

    toggleMoldExpansion(moldNo) {
      this.$set(this.expandedMolds, moldNo, !this.expandedMolds[moldNo]);

      this.$nextTick(() => {
        this.renderAllGanttCharts();
      });
    },

    sortTable(column) {
      if (this.sortState.column === column) {
        this.sortState.direction = this.sortState.direction === 'asc' ? 'desc' : 'asc';
      } else {
        this.sortState.column = column;
        this.sortState.direction = 'asc';
      }
    },

    sortClasses(column) {
      if (this.sortState.column === column) {
        return this.sortState.direction === 'asc' ? 'sorted-asc' : 'sorted-desc';
      }
      return '';
    },

    moldProgress(mold) {
      if (mold.processing_progress !== undefined && mold.processing_progress !== null) {
        let progress = parseFloat(mold.processing_progress);
        if (progress < 1) {
          progress = progress * 100;
        }
        return Math.round(progress);
      }

      if (!mold.prodList || mold.prodList.length === 0) return 0;

      const completedProds = mold.prodList.filter(prod => prod.processStatus === '已完成').length;
      return Math.round((completedProds / mold.prodList.length) * 100);
    },

    sortedProds(mold) {
      if (!mold.prodList) return [];

      return [...mold.prodList].sort((a, b) => {
        const dateA = a.planDate ? new Date(a.planDate) : new Date(0);
        const dateB = b.planDate ? new Date(b.planDate) : new Date(0);
        return dateA - dateB;
      });
    },

    processStatusClass(status) {
      switch (status) {
        case '加工中':
        case '进行中':
          return 'process-status process-processing';
        case '已完成':
          return 'process-status process-completed';
        case '待签收':
        default:
          return 'process-status process-waiting';
      }
    },

    deliveryLevelClass(level) {
      switch (level) {
        case '特急件':
        case '1':
          return 'delivery-level level-special';
        case '急件':
        case '2':
          return 'delivery-level level-urgent';
        default:
          return 'delivery-level level-normal';
      }
    },

    // 格式化为年月日
    formatDate(dateStr) {
      if (!dateStr) return 'N/A';

      try {
        const date = this.parseDate(dateStr);
        if (!date) return dateStr;

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      } catch (e) {
        return dateStr;
      }
    },

    // 格式化为年月日时分秒
    formatDateTimeFull(dateStr) {
      if (!dateStr) {
        return 'N/A';
      }

      try {
        let date;
        const num = Number(dateStr);
        if (!isNaN(num)) {
          const timestampStr = String(dateStr);
          if (timestampStr.length === 10) {
            date = new Date(num * 1000);
          } else if (timestampStr.length === 13) {
            date = new Date(num);
          } else {
            date = this.parseDate(dateStr);
          }
        } else {
          date = this.parseDate(dateStr);
        }

        if (!date || isNaN(date.getTime())) {
          return String(dateStr).substring(0, 19);
        }

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');

        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
      } catch (e) {
        return String(dateStr).substring(0, 19);
      }
    },

    // 日期解析方法
    parseDate(dateStr) {
      if (!dateStr) {
        return null;
      }

      try {
        if (dateStr instanceof Date) {
          return dateStr;
        }

        if (typeof dateStr === 'number') {
          if (dateStr > 1000000000000) {
            return new Date(dateStr);
          } else {
            return new Date(dateStr * 1000);
          }
        }

        if (typeof dateStr === 'string') {
          const trimmedDateStr = dateStr.trim();

          if (!isNaN(Number(trimmedDateStr))) {
            const num = Number(trimmedDateStr);
            if (num > 1000000000000) {
              return new Date(num);
            } else {
              return new Date(num * 1000);
            }
          }

          let dateStrToParse = trimmedDateStr;

          if (dateStrToParse.includes('T')) {
            dateStrToParse = dateStrToParse.split('.')[0];
            dateStrToParse = dateStrToParse.replace('T', ' ');
            dateStrToParse = dateStrToParse.split('+')[0].split('Z')[0];
          }

          const date = new Date(dateStrToParse);

          if (!isNaN(date.getTime())) {
            return date;
          }

          const parsed = Date.parse(trimmedDateStr);
          if (!isNaN(parsed)) {
            return new Date(parsed);
          }
        }

        return null;
      } catch (error) {
        return null;
      }
    },

    setZoomLevel(level) {
      this.ganttZoomLevel = level;

      if (this.filteredMoldData.length > 0) {
        this.renderAllGanttCharts();
      }
    },

    renderAllGanttCharts() {
      if (this.filteredMoldData.length === 0) {
        return;
      }

      const minDate = this.globalTimeRange.min;
      const maxDate = this.globalTimeRange.max;

      if (!minDate || !maxDate || isNaN(minDate.getTime()) || isNaN(maxDate.getTime())) {
        const today = new Date();
        const defaultMin = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
        const defaultMax = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);

        this.renderAllGanttChartsWithRange(defaultMin, defaultMax);
        return;
      }

      this.renderAllGanttChartsWithRange(minDate, maxDate);
    },

    // 新增辅助方法
    renderAllGanttChartsWithRange(minDate, maxDate) {
      let timeUnit, containerWidth;
      switch (this.ganttZoomLevel) {
        case '15min':
          timeUnit = 15 * 60 * 1000;
          containerWidth = 1200;
          break;
        case 'hour':
          timeUnit = 60 * 60 * 1000;
          containerWidth = 1000;
          break;
        case 'day':
        default:
          timeUnit = 24 * 60 * 60 * 1000;
          containerWidth = 800;
          break;
      }

      const totalTime = maxDate.getTime() - minDate.getTime();

      if (totalTime <= 0) {
        const today = new Date();
        const fallbackMin = new Date(today.getTime() - 15 * 24 * 60 * 60 * 1000);
        const fallbackMax = new Date(today.getTime() + 15 * 24 * 60 * 60 * 1000);

        this.renderAllGanttChartsWithRange(fallbackMin, fallbackMax);
        return;
      }

      const ganttWidth = containerWidth;
      const pixelsPerTimeUnit = ganttWidth / (totalTime / timeUnit);

      this.sortedMoldData.forEach((mold, moldIndex) => {
        const containerId = `mold-gantt-${moldIndex}`;
        const container = document.getElementById(containerId);

        if (container) {
          this.renderMoldGanttChart(mold, containerId, minDate, maxDate, timeUnit, pixelsPerTimeUnit, ganttWidth);
        }

        if (this.expandedMolds[mold.mold_no]) {
          const prods = this.sortedProds(mold);

          prods.forEach((prod, prodIndex) => {
            const uniqueId = `${mold.mold_no}-${prod.prodOrderNo || prodIndex}`;
            const prodContainerId = `prod-gantt-${uniqueId}`;
            const prodContainer = document.getElementById(prodContainerId);

            if (prodContainer) {
              // 修复：为每个生产单渲染独立的工段甘特图
              this.renderProdGanttChart(prod, prodContainerId, mold, prodIndex);
            }
          });
        }
      });
    },

    renderMoldGanttChart(mold, containerId, minDate, maxDate, timeUnit, pixelsPerTimeUnit, ganttWidth) {
      const container = document.getElementById(containerId);
      if (!container) {
        return;
      }

      container.innerHTML = '';

      const timeline = document.createElement('div');
      timeline.className = 'gantt-timeline';
      timeline.style.width = `${ganttWidth}px`;
      timeline.style.height = '120px';
      timeline.style.position = 'relative';
      timeline.style.backgroundColor = '#f8f9fa';
      timeline.style.border = '1px solid #e0e0e0';
      timeline.style.borderRadius = '4px';

      container.appendChild(timeline);
      container.style.width = `${ganttWidth}px`;

      const orderDate = this.parseDate(mold.order_date);
      const deadline = this.parseDate(mold.deadline);
      const actualStartDate = this.parseDate(mold.actual_start_date);
      const actualFinishDate = this.parseDate(mold.actual_finish_date);

      if (!orderDate || !deadline || isNaN(orderDate.getTime()) || isNaN(deadline.getTime())) {
        const errorMsg = document.createElement('div');
        errorMsg.textContent = '缺少计划日期';
        errorMsg.style.position = 'absolute';
        errorMsg.style.top = '50%';
        errorMsg.style.left = '50%';
        errorMsg.style.transform = 'translate(-50%, -50%)';
        errorMsg.style.color = '#999';
        errorMsg.style.fontSize = '12px';
        timeline.appendChild(errorMsg);
        return;
      }

      const effectiveMinDate = minDate && !isNaN(minDate.getTime()) ? minDate : orderDate;
      const effectiveMaxDate = maxDate && !isNaN(maxDate.getTime()) ? maxDate : deadline;

      this.addSimpleTimeTicks(timeline, effectiveMinDate, effectiveMaxDate, ganttWidth);

      const timeSpan = effectiveMaxDate.getTime() - effectiveMinDate.getTime();
      const planStartPos = ((orderDate.getTime() - effectiveMinDate.getTime()) / timeSpan) * ganttWidth;
      const planWidth = ((deadline.getTime() - orderDate.getTime()) / timeSpan) * ganttWidth;

      if (planWidth > 0) {
        const planBar = document.createElement('div');
        planBar.className = 'gantt-mold-bar gantt-mold-planned';
        planBar.style.position = 'absolute';
        planBar.style.left = `${Math.max(0, planStartPos)}px`;
        planBar.style.width = `${Math.max(planWidth, 10)}px`;
        planBar.style.height = '20px';
        planBar.style.top = '30px';
        planBar.style.backgroundColor = 'rgba(52, 152, 219, 0.7)';
        planBar.style.border = '1px solid #2980b9';
        planBar.style.borderRadius = '3px';
        planBar.style.cursor = 'pointer';
        planBar.style.zIndex = '5';

        const planLabel = document.createElement('div');
        planLabel.textContent = '计划';
        planLabel.style.color = 'white';
        planLabel.style.fontSize = '10px';
        planLabel.style.fontWeight = 'bold';
        planLabel.style.textAlign = 'center';
        planLabel.style.lineHeight = '20px';
        planLabel.style.textShadow = '1px 1px 1px rgba(0,0,0,0.3)';
        planBar.appendChild(planLabel);

        planBar.title = `计划时间段\n开始: ${this.formatDateTimeFull(orderDate)}\n结束: ${this.formatDateTimeFull(deadline)}`;

        timeline.appendChild(planBar);
      }

      if (actualStartDate && !isNaN(actualStartDate.getTime())) {
        let actualEndDate;
        if (actualFinishDate && !isNaN(actualFinishDate.getTime())) {
          actualEndDate = actualFinishDate;
        } else {
          actualEndDate = new Date();
        }

        if (actualStartDate <= actualEndDate) {
          const actualStartPos = ((actualStartDate.getTime() - effectiveMinDate.getTime()) / timeSpan) * ganttWidth;
          const actualWidth = ((actualEndDate.getTime() - actualStartDate.getTime()) / timeSpan) * ganttWidth;

          if (actualWidth > 0) {
            const actualBar = document.createElement('div');
            actualBar.className = 'gantt-mold-bar gantt-mold-actual';
            actualBar.style.position = 'absolute';
            actualBar.style.left = `${Math.max(0, actualStartPos)}px`;
            actualBar.style.width = `${Math.max(actualWidth, 10)}px`;
            actualBar.style.height = '20px';
            actualBar.style.top = '55px';

            if (actualFinishDate && !isNaN(actualFinishDate.getTime())) {
              actualBar.style.backgroundColor = 'rgba(46, 204, 113, 0.7)';
              actualBar.style.border = '1px solid #27ae60';
              actualBar.className = 'gantt-mold-bar gantt-mold-actual';
            } else {
              actualBar.style.backgroundColor = 'rgba(230, 126, 34, 0.7)';
              actualBar.style.border = '1px solid #d35400';
              actualBar.className = 'gantt-mold-bar gantt-mold-in-progress';
            }

            actualBar.style.borderRadius = '3px';
            actualBar.style.cursor = 'pointer';
            actualBar.style.zIndex = '5';

            const actualLabel = document.createElement('div');
            actualLabel.textContent = actualFinishDate ? '实际' : '进行中';
            actualLabel.style.color = 'white';
            actualLabel.style.fontSize = '10px';
            actualLabel.style.fontWeight = 'bold';
            actualLabel.style.textAlign = 'center';
            actualLabel.style.lineHeight = '20px';
            actualLabel.style.textShadow = '1px 1px 1px rgba(0,0,0,0.3)';
            actualBar.appendChild(actualLabel);

            let tooltip = `实际时间段\n开始: ${this.formatDateTimeFull(actualStartDate)}`;
            if (actualFinishDate && !isNaN(actualFinishDate.getTime())) {
              tooltip += `\n结束: ${this.formatDateTimeFull(actualFinishDate)}`;
              tooltip += `\n状态: 已完成`;
            } else {
              tooltip += `\n结束: 进行中`;
              tooltip += `\n状态: 进行中`;
            }
            actualBar.title = tooltip;

            timeline.appendChild(actualBar);
          }
        }
      }

      const now = new Date();
      if (now >= effectiveMinDate && now <= effectiveMaxDate) {
        const currentTimePos = ((now.getTime() - effectiveMinDate.getTime()) / timeSpan) * ganttWidth;

        const currentTimeLine = document.createElement('div');
        currentTimeLine.style.position = 'absolute';
        currentTimeLine.style.left = `${currentTimePos}px`;
        currentTimeLine.style.top = '0';
        currentTimeLine.style.height = '100%';
        currentTimeLine.style.width = '2px';
        currentTimeLine.style.backgroundColor = '#e74c3c';
        currentTimeLine.style.zIndex = '10';

        timeline.appendChild(currentTimeLine);
      }
    },

    // 添加简单的时间刻度方法
    addSimpleTimeTicks(timeline, minDate, maxDate, width) {
      const timeSpan = maxDate.getTime() - minDate.getTime();
      const days = Math.ceil(timeSpan / (1000 * 60 * 60 * 24));

      let tickIntervalDays = 1;
      if (days > 30) tickIntervalDays = 7;
      if (days > 180) tickIntervalDays = 30;

      const tickIntervalMs = tickIntervalDays * 24 * 60 * 60 * 1000;

      let tickTime = minDate.getTime();
      while (tickTime <= maxDate.getTime()) {
        const tickPos = ((tickTime - minDate.getTime()) / timeSpan) * width;
        const tickDate = new Date(tickTime);

        const tickLine = document.createElement('div');
        tickLine.style.position = 'absolute';
        tickLine.style.left = `${tickPos}px`;
        tickLine.style.top = '0';
        tickLine.style.height = '10px';
        tickLine.style.width = '1px';
        tickLine.style.backgroundColor = '#ccc';
        timeline.appendChild(tickLine);

        const tickLabel = document.createElement('div');
        tickLabel.style.position = 'absolute';
        tickLabel.style.left = `${tickPos}px`;
        tickLabel.style.top = '-18px';
        tickLabel.style.transform = 'translateX(-50%)';
        tickLabel.style.fontSize = '10px';
        tickLabel.style.color = '#666';
        tickLabel.style.whiteSpace = 'nowrap';

        const month = (tickDate.getMonth() + 1).toString().padStart(2, '0');
        const day = tickDate.getDate().toString().padStart(2, '0');
        tickLabel.textContent = `${month}-${day}`;

        timeline.appendChild(tickLabel);

        tickTime += tickIntervalMs;
      }
    },

    // 新增：获取生产单的时间范围
    getProdTimeRange(prod) {
      const allDates = [];

      // 添加生产单自身的计划时间
      if (prod.planDate) allDates.push(new Date(prod.planDate));
      if (prod.planEndTime) allDates.push(new Date(prod.planEndTime));
      if (prod.actualStartTime) allDates.push(new Date(prod.actualStartTime));
      if (prod.actualEndTime) allDates.push(new Date(prod.actualEndTime));

      // 添加工段的时间
      if (prod.sectionList && prod.sectionList.length > 0) {
        prod.sectionList.forEach(section => {
          if (section.planDate) allDates.push(new Date(section.planDate));
          if (section.planEndTime) allDates.push(new Date(section.planEndTime));
          if (section.actualStartTime) allDates.push(new Date(section.actualStartTime));
          if (section.actualEndTime) allDates.push(new Date(section.actualEndTime));
        });
      }

      if (allDates.length === 0) {
        const today = new Date();
        const minDate = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        const maxDate = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
        return {min: minDate, max: maxDate};
      }

      const minDate = new Date(Math.min(...allDates.map(d => d.getTime())));
      const maxDate = new Date(Math.max(...allDates.map(d => d.getTime())));

      const timeSpan = maxDate.getTime() - minDate.getTime();
      const margin = timeSpan * 0.1;

      return {
        min: new Date(minDate.getTime() - margin),
        max: new Date(maxDate.getTime() + margin)
      };
    },

    // 渲染生产单甘特图（包含工段）- 修复：使用生产单自身的时间范围
    renderProdGanttChart(prod, containerId, mold, prodIndex) {
      const container = document.getElementById(containerId);
      if (!container) {
        return;
      }

      container.innerHTML = '<div class="gantt-timeline"></div>';
      const timeline = container.querySelector('.gantt-timeline');

      // 获取生产单自身的时间范围
      const timeRange = this.getProdTimeRange(prod);
      const minDate = timeRange.min;
      const maxDate = timeRange.max;

      let containerWidth;
      switch (this.ganttZoomLevel) {
        case '15min':
          containerWidth = 1200;
          break;
        case 'hour':
          containerWidth = 1000;
          break;
        case 'day':
        default:
          containerWidth = 800;
          break;
      }

      const totalTime = maxDate.getTime() - minDate.getTime();

      if (totalTime <= 0) {
        const today = new Date();
        const fallbackMin = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        const fallbackMax = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
        this.renderProdGanttChartWithRange(prod, containerId, fallbackMin, fallbackMax, containerWidth);
        return;
      }

      this.renderProdGanttChartWithRange(prod, containerId, minDate, maxDate, containerWidth);
    },

    // 新增：使用指定时间范围渲染生产单甘特图
    renderProdGanttChartWithRange(prod, containerId, minDate, maxDate, containerWidth) {
      const container = document.getElementById(containerId);
      if (!container) return;

      const timeline = container.querySelector('.gantt-timeline');
      timeline.style.width = `${containerWidth}px`;
      timeline.style.height = '140px';
      container.style.width = `${containerWidth}px`;

      this.addSimpleTimeTicks(timeline, minDate, maxDate, containerWidth);

      const timeSpan = maxDate.getTime() - minDate.getTime();

      // 渲染生产单计划条
      const planDate = this.parseDate(prod.planDate);
      const planEndTime = this.parseDate(prod.planEndTime);
      const actualStartTime = this.parseDate(prod.actualStartTime);
      const actualEndTime = this.parseDate(prod.actualEndTime);

      if (planDate && planEndTime && !isNaN(planDate.getTime()) && !isNaN(planEndTime.getTime())) {
        const planStartPos = ((planDate.getTime() - minDate.getTime()) / timeSpan) * containerWidth;
        const planWidth = ((planEndTime.getTime() - planDate.getTime()) / timeSpan) * containerWidth;

        if (planWidth > 0) {
          const planBar = document.createElement('div');
          planBar.className = 'gantt-mold-bar gantt-mold-planned';
          planBar.style.position = 'absolute';
          planBar.style.left = `${Math.max(0, planStartPos)}px`;
          planBar.style.width = `${Math.max(planWidth, 10)}px`;
          planBar.style.height = '15px';
          planBar.style.top = '30px';
          planBar.style.backgroundColor = 'rgba(52, 152, 219, 0.7)';
          planBar.style.border = '1px solid #2980b9';
          planBar.style.borderRadius = '3px';
          planBar.style.cursor = 'pointer';
          planBar.style.zIndex = '5';

          const planLabel = document.createElement('div');
          planLabel.textContent = '计划';
          planLabel.style.color = 'white';
          planLabel.style.fontSize = '9px';
          planLabel.style.fontWeight = 'bold';
          planLabel.style.textAlign = 'center';
          planLabel.style.lineHeight = '15px';
          planLabel.style.textShadow = '1px 1px 1px rgba(0,0,0,0.3)';
          planBar.appendChild(planLabel);

          planBar.title = `生产单计划\n开始: ${this.formatDateTimeFull(planDate)}\n结束: ${this.formatDateTimeFull(planEndTime)}\n生产单号: ${prod.prodOrderNo || '未知'}`;

          timeline.appendChild(planBar);
        }
      }

      // 渲染生产单实际条
      if (actualStartTime && !isNaN(actualStartTime.getTime())) {
        let actualEndDate;
        if (actualEndTime && !isNaN(actualEndTime.getTime())) {
          actualEndDate = actualEndTime;
        } else {
          actualEndDate = new Date();
        }

        if (actualStartTime <= actualEndDate) {
          const actualStartPos = ((actualStartTime.getTime() - minDate.getTime()) / timeSpan) * containerWidth;
          const actualWidth = ((actualEndDate.getTime() - actualStartTime.getTime()) / timeSpan) * containerWidth;

          if (actualWidth > 0) {
            const actualBar = document.createElement('div');
            actualBar.className = 'gantt-mold-bar gantt-mold-actual';
            actualBar.style.position = 'absolute';
            actualBar.style.left = `${Math.max(0, actualStartPos)}px`;
            actualBar.style.width = `${Math.max(actualWidth, 10)}px`;
            actualBar.style.height = '15px';
            actualBar.style.top = '50px';

            if (actualEndTime && !isNaN(actualEndTime.getTime())) {
              actualBar.style.backgroundColor = 'rgba(46, 204, 113, 0.7)';
              actualBar.style.border = '1px solid #27ae60';
            } else {
              actualBar.style.backgroundColor = 'rgba(230, 126, 34, 0.7)';
              actualBar.style.border = '1px solid #d35400';
            }

            actualBar.style.borderRadius = '3px';
            actualBar.style.cursor = 'pointer';
            actualBar.style.zIndex = '5';

            const actualLabel = document.createElement('div');
            actualLabel.textContent = actualEndTime ? '实际' : '进行中';
            actualLabel.style.color = 'white';
            actualLabel.style.fontSize = '9px';
            actualLabel.style.fontWeight = 'bold';
            actualLabel.style.textAlign = 'center';
            actualLabel.style.lineHeight = '15px';
            actualLabel.style.textShadow = '1px 1px 1px rgba(0,0,0,0.3)';
            actualBar.appendChild(actualLabel);

            let tooltip = `生产单实际\n开始: ${this.formatDateTimeFull(actualStartTime)}`;
            if (actualEndTime && !isNaN(actualEndTime.getTime())) {
              tooltip += `\n结束: ${this.formatDateTimeFull(actualEndTime)}`;
            } else {
              tooltip += `\n结束: 进行中`;
            }
            tooltip += `\n生产单号: ${prod.prodOrderNo || '未知'}`;
            actualBar.title = tooltip;

            timeline.appendChild(actualBar);
          }
        }
      }

      // 渲染工段甘特图 - 使用已排序的数据
      if (prod.sectionList && prod.sectionList.length > 0) {
        console.log('渲染工段甘特图，生产单号:', prod.prodOrderNo, '工段数量:', prod.sectionList.length);
        console.log('工段顺序:', prod.sectionList.map(s => ({工段: s.section, 生产单号: s.prodOrderNo, sort: s.sort})));

        const sectionHeight = 12;
        const sectionSpacing = 2;
        let sectionTop = 75;

        // 直接使用已经排序好的sectionList，不需要再次排序
        const sortedSections = [...prod.sectionList]; // 已经是排序好的

        sortedSections.forEach((section, sectionIndex) => {
          const sectionInfo = this.PROCESS_STAGES.find(p => p.code === section.section) ||
            {name: section.section, color: '#3498db'};

          const sectionPlanDate = this.parseDate(section.planDate);
          const sectionPlanEndTime = this.parseDate(section.planEndTime);
          const sectionActualStartTime = this.parseDate(section.actualStartTime);
          const sectionActualEndTime = this.parseDate(section.actualEndTime);

          // 渲染工段计划条
          if (sectionPlanDate && sectionPlanEndTime &&
            !isNaN(sectionPlanDate.getTime()) && !isNaN(sectionPlanEndTime.getTime())) {
            const sectionPlanStartPos = ((sectionPlanDate.getTime() - minDate.getTime()) / timeSpan) * containerWidth;
            const sectionPlanWidth = ((sectionPlanEndTime.getTime() - sectionPlanDate.getTime()) / timeSpan) * containerWidth;

            if (sectionPlanWidth > 0) {
              const sectionPlanBar = document.createElement('div');
              sectionPlanBar.className = `gantt-process-bar process-${section.section}`;
              sectionPlanBar.style.position = 'absolute';
              sectionPlanBar.style.left = `${Math.max(0, sectionPlanStartPos)}px`;
              sectionPlanBar.style.width = `${Math.max(sectionPlanWidth, 3)}px`;
              sectionPlanBar.style.top = `${sectionTop}px`;
              sectionPlanBar.style.height = `${sectionHeight}px`;
              sectionPlanBar.style.borderRadius = '2px';
              sectionPlanBar.style.cursor = 'pointer';

              const sectionColor = this.PROCESS_STAGES.find(p => p.code === section.section)?.color || '#3498db';
              sectionPlanBar.style.backgroundColor = `${sectionColor}80`;
              sectionPlanBar.style.border = `1px solid ${sectionColor}`;

              const sectionLabel = document.createElement('div');
              sectionLabel.className = 'process-label';
              sectionLabel.textContent = section.section;
              sectionLabel.style.color = 'white';
              sectionLabel.style.fontSize = '8px';
              sectionLabel.style.fontWeight = 'bold';
              sectionLabel.style.textAlign = 'center';
              sectionLabel.style.lineHeight = `${sectionHeight}px`;
              sectionPlanBar.appendChild(sectionLabel);

              const sectionName = this.PROCESS_STAGES.find(p => p.code === section.section)?.name || section.section;
              let tooltip = `${sectionName}\n计划: ${this.formatDateTimeFull(sectionPlanDate)} - ${this.formatDateTimeFull(sectionPlanEndTime)}`;
              tooltip += `\n生产单号: ${prod.prodOrderNo || '未知'}`;

              if (section.processStatus) {
                tooltip += `\n状态: ${section.processStatus}`;
              }
              if (section.delayStatus && section.delayStatus !== '0') {
                tooltip += `\n延期状态: ${this.getDelayStatusText(section.delayStatus)}`;
              }

              sectionPlanBar.title = tooltip;

              timeline.appendChild(sectionPlanBar);
            }
          }

          // 渲染工段实际条
          if (sectionActualStartTime && !isNaN(sectionActualStartTime.getTime())) {
            let sectionActualEndDate;
            if (sectionActualEndTime && !isNaN(sectionActualEndTime.getTime())) {
              sectionActualEndDate = sectionActualEndTime;
            } else {
              sectionActualEndDate = new Date();
            }

            if (sectionActualStartTime <= sectionActualEndDate) {
              const sectionActualStartPos = ((sectionActualStartTime.getTime() - minDate.getTime()) / timeSpan) * containerWidth;
              const sectionActualWidth = ((sectionActualEndDate.getTime() - sectionActualStartTime.getTime()) / timeSpan) * containerWidth;

              if (sectionActualWidth > 0) {
                const sectionActualBar = document.createElement('div');
                sectionActualBar.className = `gantt-process-bar process-${section.section}`;
                sectionActualBar.style.position = 'absolute';
                sectionActualBar.style.left = `${Math.max(0, sectionActualStartPos)}px`;
                sectionActualBar.style.width = `${Math.max(sectionActualWidth, 3)}px`;
                sectionActualBar.style.top = `${sectionTop + sectionHeight + 2}px`;
                sectionActualBar.style.height = `${sectionHeight}px`;
                sectionActualBar.style.borderRadius = '2px';
                sectionActualBar.style.cursor = 'pointer';

                const sectionColor = this.PROCESS_STAGES.find(p => p.code === section.section)?.color || '#3498db';
                if (sectionActualEndTime && !isNaN(sectionActualEndTime.getTime())) {
                  sectionActualBar.style.backgroundColor = sectionColor;
                  sectionActualBar.style.border = `1px solid ${this.darkenColor(sectionColor, 30)}`;
                } else {
                  sectionActualBar.style.backgroundColor = `${sectionColor}40`;
                  sectionActualBar.style.border = `1px solid ${sectionColor}`;
                }

                const sectionActualLabel = document.createElement('div');
                sectionActualLabel.className = 'process-label';
                sectionActualLabel.textContent = sectionActualEndTime ? '实' : '进';
                sectionActualLabel.style.color = 'white';
                sectionActualLabel.style.fontSize = '8px';
                sectionActualLabel.style.fontWeight = 'bold';
                sectionActualLabel.style.textAlign = 'center';
                sectionActualLabel.style.lineHeight = `${sectionHeight}px`;
                sectionActualBar.appendChild(sectionActualLabel);

                const sectionName = this.PROCESS_STAGES.find(p => p.code === section.section)?.name || section.section;
                let tooltip = `${sectionName} ${sectionActualEndTime ? '实际' : '进行中'}\n开始: ${this.formatDateTimeFull(sectionActualStartTime)}`;
                if (sectionActualEndTime && !isNaN(sectionActualEndTime.getTime())) {
                  tooltip += `\n结束: ${this.formatDateTimeFull(sectionActualEndTime)}`;
                } else {
                  tooltip += `\n结束: 进行中`;
                }
                tooltip += `\n生产单号: ${prod.prodOrderNo || '未知'}`;

                if (section.processStatus) {
                  tooltip += `\n状态: ${section.processStatus}`;
                }
                if (section.delayStatus && section.delayStatus !== '0') {
                  tooltip += `\n延期状态: ${this.getDelayStatusText(section.delayStatus)}`;
                }

                sectionActualBar.title = tooltip;

                timeline.appendChild(sectionActualBar);
              }
            }
          }

          sectionTop += (sectionHeight * 2) + sectionSpacing + 2;
        });

        // 添加工段图例
        const uniqueSections = [...new Set(sortedSections.map(s => s.section))];
        if (uniqueSections.length > 0) {
          const legend = document.createElement('div');
          legend.className = 'gantt-legend';
          legend.style.position = 'absolute';
          legend.style.bottom = '5px';
          legend.style.left = '5px';
          legend.style.display = 'flex';
          legend.style.flexWrap = 'wrap';
          legend.style.gap = '5px';
          legend.style.fontSize = '8px';
          legend.style.zIndex = '10';

          uniqueSections.forEach(sectionCode => {
            const sectionInfo = this.PROCESS_STAGES.find(p => p.code === sectionCode);
            if (sectionInfo) {
              const legendItem = document.createElement('div');
              legendItem.className = 'legend-item';
              legendItem.style.display = 'flex';
              legendItem.style.alignItems = 'center';
              legendItem.style.gap = '2px';

              const colorBox = document.createElement('div');
              colorBox.className = 'legend-color';
              colorBox.style.width = '10px';
              colorBox.style.height = '10px';
              colorBox.style.backgroundColor = sectionInfo.color;
              colorBox.style.borderRadius = '2px';

              const label = document.createElement('span');
              label.textContent = sectionInfo.name;
              label.style.fontSize = '8px';

              legendItem.appendChild(colorBox);
              legendItem.appendChild(label);
              legend.appendChild(legendItem);
            }
          });

          timeline.appendChild(legend);
        }
      } else {
        // 没有工段数据
        const noDataMsg = document.createElement('div');
        noDataMsg.className = 'gantt-no-data';
        noDataMsg.textContent = '无工段数据';
        noDataMsg.style.position = 'absolute';
        noDataMsg.style.top = '50%';
        noDataMsg.style.left = '50%';
        noDataMsg.style.transform = 'translate(-50%, -50%)';
        noDataMsg.style.color = '#999';
        timeline.appendChild(noDataMsg);
      }

      // 添加当前时间线
      const now = new Date();
      if (now >= minDate && now <= maxDate) {
        const currentTimePos = ((now.getTime() - minDate.getTime()) / timeSpan) * containerWidth;
        const currentTimeLine = document.createElement('div');
        currentTimeLine.style.position = 'absolute';
        currentTimeLine.style.left = `${currentTimePos}px`;
        currentTimeLine.style.top = '0';
        currentTimeLine.style.height = '100%';
        currentTimeLine.style.width = '2px';
        currentTimeLine.style.backgroundColor = '#e74c3c';
        currentTimeLine.style.zIndex = '8';

        timeline.appendChild(currentTimeLine);
      }
    },

    // 颜色加深函数
    darkenColor(color, percent) {
      const num = parseInt(color.replace('#', ''), 16);
      const amt = Math.round(2.55 * percent);
      const R = (num >> 16) - amt;
      const G = (num >> 8 & 0x00FF) - amt;
      const B = (num & 0x0000FF) - amt;

      return '#' + (
        0x1000000 +
        (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
        (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
        (B < 255 ? B < 1 ? 0 : B : 255)
      ).toString(16).slice(1);
    },

    exportData() {
      if (this.filteredMoldData.length === 0) {
        alert('没有数据可导出');
        return;
      }

      let csvContent = "data:text/csv;charset=utf-8,\uFEFF";
      csvContent += "序号,派工单号,模号,投单日期,交期,实际完成日期,当前进度,是否Delay\n";

      this.filteredMoldData.forEach((mold, index) => {
        const progress = this.moldProgress(mold);
        const delayStatus = this.getDelayStatusText(mold.delay_status);

        const row = [
          index + 1,
          mold.dispatch_no,
          mold.mold_no,
          this.formatDate(mold.order_date),
          this.formatDate(mold.deadline),
          mold.actual_finish_date ? this.formatDateTimeFull(mold.actual_finish_date) : '进行中',
          `${progress}%`,
          delayStatus
        ].map(cell => `"${cell}"`).join(',');

        csvContent += row + "\n";
      });

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `模具进度_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
};
</script>

<style scoped>
/* 基础样式 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.mold-schedule-board {
  background-color: #f5f7fa;
  color: #333;
  padding: 15px;
  min-height: 100vh;
  position: relative;
}

.header-container {
  display: flex;
  justify-content: space-between;
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

/* 设置按钮 */
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
  transition: background-color 0.3s;
}

.settings-toggle-btn:hover {
  background-color: #2980b9;
}

/* 控制面板样式 */
.control-panel {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  background: white;
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  flex-wrap: wrap;
  gap: 25px;
  max-height: none;
  overflow: visible;
  transition: all 0.3s ease;
}

.control-panel.hidden {
  display: none;
}

.control-column {
  flex: 1;
  min-width: 280px;
  padding: 10px;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

.control-column h3 {
  font-size: 16px;
  color: #2c3e50;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding-bottom: 8px;
  border-bottom: 2px solid #3498db;
}

.control-column h3 i {
  color: #3498db;
}

.mold-selector, .date-range-selector, .display-controls {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.control-column label {
  font-weight: 600;
  color: #2c3e50;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
}

/* 模具选择器 */
.mold-select {
  min-height: 120px;
  max-height: 180px;
  overflow-y: auto;
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 10px;
  background-color: white;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
}

.mold-option {
  padding: 6px 8px;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.2s;
  margin-bottom: 4px;
}

.mold-option:hover {
  background-color: #e3f2fd;
}

.mold-option input {
  margin: 0;
  cursor: pointer;
}

.mold-option label {
  cursor: pointer;
  font-weight: normal;
  color: #495057;
  font-size: 14px;
}

/* 日期选择器 */
.date-range-selector {
  margin-top: 15px;
}

.date-range-selector label {
  display: block;
  margin-bottom: 5px;
}

.date-range-selector input[type="date"] {
  width: 100%;
  padding: 10px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 14px;
  margin-bottom: 12px;
  background-color: white;
  transition: border-color 0.3s;
}

.date-range-selector input[type="date"]:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
}

/* 甘特图缩放控制 */
.zoom-controls {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 15px;
  flex-wrap: wrap;
}

.zoom-btn {
  padding: 8px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  background: white;
  color: #495057;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  transition: all 0.3s;
  min-width: 80px;
  text-align: center;
}

.zoom-btn:hover {
  background: #f8f9fa;
  border-color: #3498db;
  color: #3498db;
}

.zoom-btn.active {
  background: #3498db;
  color: white;
  border-color: #3498db;
  box-shadow: 0 2px 4px rgba(52, 152, 219, 0.3);
}

/* 按钮组 - 重要修复 */
.action-buttons {
  display: flex;
  gap: 12px;
  margin-top: 20px;
  flex-wrap: wrap;
}

.refresh-btn, .export-btn, .auto-refresh-btn {
  padding: 10px 18px !important;
  border: none !important;
  border-radius: 6px !important;
  color: white !important;
  cursor: pointer !important;
  font-weight: 500 !important;
  display: flex !important;
  align-items: center !important;
  gap: 8px !important;
  font-size: 14px !important;
  transition: all 0.3s !important;
  min-width: 140px !important;
  justify-content: center !important;
  text-decoration: none !important;
  outline: none !important;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1) !important;
}

.refresh-btn {
  background-color: #2ecc71 !important;
}

.refresh-btn:hover {
  background-color: #27ae60 !important;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(46, 204, 113, 0.3) !important;
}

.export-btn {
  background-color: #9b59b6 !important;
}

.export-btn:hover {
  background-color: #8e44ad !important;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(155, 89, 182, 0.3) !important;
}

/* 刷新统计信息 */
.refresh-stats {
  margin-top: 15px;
  padding: 12px;
  background-color: #e8f4fc;
  border-radius: 6px;
  font-size: 13px;
  color: #2c3e50;
  display: flex;
  align-items: center;
  gap: 8px;
  border-left: 4px solid #3498db;
}

.refresh-stats i {
  color: #3498db;
  font-size: 14px;
}

/* 倒计时显示 */
.refresh-countdown {
  margin-top: 12px;
  padding: 10px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 6px;
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
  box-shadow: 0 2px 4px rgba(102, 126, 234, 0.3);
}

.refresh-countdown i {
  font-size: 16px;
}

/* 页面底部刷新信息 */
.page-info {
  text-align: center;
  margin-top: 25px;
  padding: 15px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  font-size: 13px;
  color: #6c757d;
}

.refresh-info {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  justify-content: center;
  align-items: center;
}

.auto-refresh-info {
  color: #3498db;
  font-weight: 500;
  background: #e8f4fc;
  padding: 4px 10px;
  border-radius: 4px;
}

/* 放大镜样式 */
.gantt-magnifier {
  position: fixed;
  border: 3px solid #3498db;
  border-radius: 8px;
  background: white;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  z-index: 10000;
  pointer-events: none;
  opacity: 0;
  transform: scale(0.9);
  transition: opacity 0.3s, transform 0.3s;
  overflow: hidden;
  display: none;
  resize: none; /* 禁用浏览器默认的resize */
}

.gantt-magnifier.active {
  opacity: 1;
  transform: scale(1);
  display: block;
  pointer-events: auto;
}

.gantt-magnifier.resizing {
  opacity: 0.9;
  transition: none;
}

/* 调整大小手柄 */
.resize-handle {
  position: absolute;
  background-color: #3498db;
  opacity: 0;
  transition: opacity 0.2s;
  z-index: 10001;
}

.gantt-magnifier.active .resize-handle:hover {
  opacity: 0.8;
}

.resize-handle-n {
  top: 0;
  left: 0;
  right: 0;
  height: 6px;
  cursor: n-resize;
}

.resize-handle-s {
  bottom: 0;
  left: 0;
  right: 0;
  height: 6px;
  cursor: s-resize;
}

.resize-handle-e {
  top: 0;
  right: 0;
  bottom: 0;
  width: 6px;
  cursor: e-resize;
}

.resize-handle-w {
  top: 0;
  left: 0;
  bottom: 0;
  width: 6px;
  cursor: w-resize;
}

.resize-handle-ne {
  top: 0;
  right: 0;
  width: 12px;
  height: 12px;
  cursor: ne-resize;
  border-bottom-left-radius: 8px;
  background: linear-gradient(135deg, transparent 50%, #3498db 50%);
}

.resize-handle-nw {
  top: 0;
  left: 0;
  width: 12px;
  height: 12px;
  cursor: nw-resize;
  border-bottom-right-radius: 8px;
  background: linear-gradient(225deg, transparent 50%, #3498db 50%);
}

.resize-handle-se {
  bottom: 0;
  right: 0;
  width: 12px;
  height: 12px;
  cursor: se-resize;
  border-top-left-radius: 8px;
  background: linear-gradient(315deg, transparent 50%, #3498db 50%);
}

.resize-handle-sw {
  bottom: 0;
  left: 0;
  width: 12px;
  height: 12px;
  cursor: sw-resize;
  border-top-right-radius: 8px;
  background: linear-gradient(45deg, transparent 50%, #3498db 50%);
}

/* 缩放控制栏 */
.zoom-controls-bar {
  position: absolute;
  top: 5px;
  right: 5px;
  display: flex;
  gap: 4px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 4px;
  padding: 4px;
  z-index: 10002;
  pointer-events: auto;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.zoom-control-btn {
  width: 24px;
  height: 24px;
  border: none;
  border-radius: 3px;
  background: #f8f9fa;
  color: #2c3e50;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  transition: all 0.2s;
  pointer-events: auto;
}

.zoom-control-btn:hover {
  background: #3498db;
  color: white;
  transform: scale(1.1);
}

.zoom-in-btn:hover {
  background: #2ecc71;
}

.zoom-out-btn:hover {
  background: #e74c3c;
}

.reset-zoom-btn:hover {
  background: #f39c12;
}

.close-magnifier-btn:hover {
  background: #c0392b;
}

.size-display {
  font-size: 10px;
  color: #666;
  padding: 0 4px;
  display: flex;
  align-items: center;
  min-width: 50px;
  justify-content: center;
  font-family: monospace;
}

/* 移动手柄 */
.move-handle {
  position: absolute;
  top: 5px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(52, 152, 219, 0.1);
  color: #3498db;
  width: 100px;
  height: 30px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: move;
  z-index: 10002;
  opacity: 0;
  transition: opacity 0.2s, background-color 0.2s;
  pointer-events: auto;
}

.move-handle:hover {
  opacity: 1;
  background: rgba(52, 152, 219, 0.2);
}

.gantt-magnifier.active .move-handle {
  opacity: 0.5;
}

/* 调整大小提示 */
.resizing-hint {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 12px;
  z-index: 10003;
  pointer-events: none;
  white-space: nowrap;
}

/* 放大镜内容区域适配不同尺寸 */
.magnifier-content {
  width: 100%;
  height: 100%;
  overflow: auto;
  position: relative;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .zoom-controls-bar {
    flex-wrap: wrap;
    justify-content: center;
  }

  .size-display {
    order: -1;
    width: 100%;
    margin-bottom: 4px;
  }

  .move-handle {
    width: 80px;
    height: 24px;
    font-size: 10px;
  }
}

/* 当放大镜太小时隐藏部分控制元素 */
.gantt-magnifier[style*="width: 2"] .zoom-controls-bar,
.gantt-magnifier[style*="width: 1"] .zoom-controls-bar {
  display: none;
}

.gantt-magnifier[style*="width: 3"] .size-display {
  display: none;
}

/* 放大镜内容滚动条优化 */
.magnifier-content::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.magnifier-content::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.magnifier-content::-webkit-scrollbar-thumb {
  background: #3498db;
  border-radius: 4px;
}

.magnifier-content::-webkit-scrollbar-thumb:hover {
  background: #2980b9;
}

/* 放大镜动画效果 */
@keyframes magnifierAppear {
  from {
    opacity: 0;
    transform: scale(0.8) translateY(-10px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.gantt-magnifier.active {
  animation: magnifierAppear 0.3s ease-out;
}

/* 添加半透明边框效果 */
.gantt-magnifier::before {
  content: '';
  position: absolute;
  top: -3px;
  left: -3px;
  right: -3px;
  bottom: -3px;
  border: 2px solid rgba(52, 152, 219, 0.3);
  border-radius: 10px;
  pointer-events: none;
  z-index: -1;
}

/* 放大镜内容区域 */
.magnifier-placeholder {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #999;
  font-size: 12px;
  text-align: center;
}

.magnifier-hint {
  position: absolute;
  bottom: 5px;
  left: 5px;
  right: 5px;
  text-align: center;
  font-size: 10px;
  color: #7f8c8d;
  background: rgba(255, 255, 255, 0.9);
  padding: 2px 4px;
  border-radius: 3px;
  z-index: 2;
}

/* 模具进度表格容器 */
.mold-schedule-container {
  background: white;
  border-radius: 10px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
  overflow-x: hidden;
  overflow-y: auto;
  margin-bottom: 30px;
  max-height: calc(100vh - 200px);
}

/* 表格包装器 - 用于实现横向滚动和冻结列 */
.table-wrapper {
  position: relative;
  overflow-x: auto;
}

/* 模具主表头 */
.mold-table-header {
  display: flex;
  background: #2c3e50;
  color: white;
  font-weight: 600;
  font-size: 14px;
  min-width: 2000px;
}

/* 表头冻结部分 */
.header-frozen {
  display: flex;
  position: sticky;
  left: 0;
  z-index: 10;
  background: #2c3e50;
}

/* 表头滚动部分 */
.header-scroll {
  display: flex;
  flex: 1;
}

.header-cell {
  padding: 15px 10px;
  white-space: nowrap;
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  text-align: left;
  display: flex;
  align-items: center;
  justify-content: center;
}

.header-cell.frozen {
  background: #2c3e50;
  position: sticky;
  left: 0;
  z-index: 20;
}

.header-cell:last-child {
  border-right: none;
}

/* 模具表格主体 */
.mold-table-body {
  min-width: 2000px;
}

.mold-row {
  display: flex;
  flex-direction: column;
  border-bottom: 1px solid #e0e0e0;
  transition: background-color 0.2s;
}

.mold-row:hover {
  background-color: #f8f9fa;
}

.mold-row.expanded {
  background-color: #f0f7ff;
}

/* 模具主行 */
.mold-main-row {
  display: flex;
  width: 100%;
  cursor: pointer;
  min-height: 70px;
}

/* 单元格样式 */
.cell {
  padding: 12px 10px;
  border-right: 1px solid #e0e0e0;
  white-space: nowrap;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  overflow: hidden;
  text-overflow: ellipsis;
  min-height: 70px;
}

.cell.frozen {
  position: sticky;
  left: 0;
  z-index: 5;
  background-color: inherit;
}

.cell:last-child {
  border-right: none;
}

/* 生产单明细容器 */
.part-detail-container {
  width: 100%;
  display: none;
  background-color: #f8f9fa;
}

.part-detail-container.expanded {
  display: block;
  border-top: 1px solid #e0e0e0;
}

.part-detail-header {
  display: flex;
  padding: 10px 0;
  font-weight: 600;
  color: #2c3e50;
  background-color: #e9ecef;
  border-radius: 0;
  margin-bottom: 0;
  min-width: 2000px;
}

.part-detail-content {
  display: flex;
  padding: 10px 0;
  align-items: center;
  border-bottom: 1px solid #e9ecef;
  min-width: 2000px;
}

.part-detail-content:last-child {
  border-bottom: none;
}

/* 进度条样式 */
.progress-container {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 140px;
}

.progress-bar {
  flex: 1;
  height: 20px;
  background-color: #ecf0f1;
  border-radius: 10px;
  overflow: visible;
  position: relative;
  min-width: 80px;
}

.progress-fill {
  height: 100%;
  border-radius: 10px;
  background-color: #2ecc71;
  position: relative;
  min-width: 20px;
}

/* 在进度条上添加数字 */
.progress-fill::after {
  content: attr(data-progress);
  position: absolute;
  right: 5px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 11px;
  font-weight: bold;
  color: white;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
  white-space: nowrap;
  z-index: 2;
}

/* 当进度很低时，数字放在进度条外面 */
.progress-fill[style*="width: 0%"]::after,
.progress-fill[style*="width: 1%"]::after,
.progress-fill[style*="width: 2%"]::after,
.progress-fill[style*="width: 3%"]::after,
.progress-fill[style*="width: 4%"]::after,
.progress-fill[style*="width: 5%"]::after {
  right: -30px;
  color: #2c3e50;
  text-shadow: none;
  background: white;
  padding: 1px 4px;
  border-radius: 3px;
  border: 1px solid #ddd;
}

/* 调整单元格宽度 */
.cell.col-7 {
  width: 150px !important;
  min-width: 150px !important;
}

/* 调整进度文本位置 */
.progress-text {
  font-size: 13px;
  font-weight: 600;
  min-width: 45px;
  text-align: center;
  color: #2c3e50;
  background: #f8f9fa;
  padding: 2px 6px;
  border-radius: 4px;
  border: 1px solid #e0e0e0;
}

/* 状态样式 */
.status-normal {
  color: #2ecc71; /* 绿色 - 正常 */
  font-weight: 600;
  background-color: rgba(46, 204, 113, 0.1);
  padding: 3px 8px;
  border-radius: 4px;
  border: 1px solid rgba(46, 204, 113, 0.3);
}

.status-low {
  color: #3498db; /* 蓝色 - 低风险 */
  font-weight: 600;
  background-color: rgba(52, 152, 219, 0.1);
  padding: 3px 8px;
  border-radius: 4px;
  border: 1px solid rgba(52, 152, 219, 0.3);
}

.status-medium {
  color: #f39c12; /* 橙色 - 中风险 */
  font-weight: 600;
  background-color: rgba(243, 156, 18, 0.1);
  padding: 3px 8px;
  border-radius: 4px;
  border: 1px solid rgba(243, 156, 18, 0.3);
}

.status-high {
  color: #e74c3c; /* 红色 - 高风险 */
  font-weight: 600;
  background-color: rgba(231, 76, 60, 0.1);
  padding: 3px 8px;
  border-radius: 4px;
  border: 1px solid rgba(231, 76, 60, 0.3);
}

.status-delay {
  color: #c0392b; /* 深红色 - 延期 */
  font-weight: 600;
  background-color: rgba(192, 57, 43, 0.1);
  padding: 3px 8px;
  border-radius: 4px;
  border: 1px solid rgba(192, 57, 43, 0.3);
}

.status-unknown {
  color: #95a5a6; /* 灰色 - 未知 */
  font-weight: 600;
  background-color: rgba(149, 165, 166, 0.1);
  padding: 3px 8px;
  border-radius: 4px;
  border: 1px solid rgba(149, 165, 166, 0.3);
}

/* CAM电极状态样式 */
.cam-status-normal {
  color: #2ecc71;
  font-weight: 600;
}

.cam-status-delay {
  color: #c0392b;
  font-weight: 600;
}

.cam-status-waiting {
  color: #95a5a6;
  font-weight: 600;
}

.cam-status-processing {
  color: #3498db;
  font-weight: 600;
}

.cam-status-review {
  color: #f39c12;
  font-weight: 600;
}

.cam-status-completed {
  color: #2ecc71;
  font-weight: 600;
}

.cam-status-unknown {
  color: #7f8c8d;
  font-weight: 600;
}

/* 加工状态样式 */
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

/* 交期等级样式 */
.delivery-level {
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

/* 甘特图容器样式 */
.gantt-container {
  height: 120px !important;
  min-width: 800px !important;
  position: relative !important;
  background-color: #f8f9fa !important;
  border: 1px solid #e0e0e0 !important;
  border-radius: 4px !important;
  overflow: visible !important;
  display: block !important;
  visibility: visible !important;
}

.gantt-timeline {
  height: 100% !important;
  width: 100% !important;
  position: relative !important;
  display: block !important;
}

/* 甘特条基础样式 */
.gantt-mold-bar {
  position: absolute !important;
  height: 20px !important;
  border-radius: 3px !important;
  cursor: pointer !important;
  opacity: 0.9 !important;
  transition: opacity 0.2s !important;
  z-index: 5 !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
}

.gantt-mold-bar:hover {
  opacity: 1 !important;
  z-index: 10 !important;
}

.gantt-mold-planned {
  background-color: rgba(52, 152, 219, 0.7) !important;
  border: 1px solid #2980b9 !important;
  color: white !important;
}

.gantt-mold-actual {
  background-color: rgba(46, 204, 113, 0.7) !important;
  border: 1px solid #27ae60 !important;
  color: white !important;
}

.gantt-mold-in-progress {
  background-color: rgba(230, 126, 34, 0.7) !important;
  border: 1px solid #d35400 !important;
  color: white !important;
}

/* 空状态样式 */
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

/* 设置模态框 */
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
  width: 70%;
  max-width: 800px;
  max-height: 80vh;
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
  flex: 1;
}

/* 字段设置 */
.field-settings {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.field-group {
  margin-bottom: 20px;
}

.field-group h4 {
  margin-bottom: 10px;
  color: #2c3e50;
  padding-bottom: 5px;
  border-bottom: 1px solid #e0e0e0;
}

.field-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;
}

.field-item:last-child {
  border-bottom: none;
}

.field-item label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
}

/* 自动刷新设置相关样式 */
.interval-control {
  display: flex;
  align-items: center;
  gap: 8px;
}

.interval-select {
  padding: 6px 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
  font-size: 14px;
  min-width: 100px;
}

.interval-unit {
  font-size: 14px;
  color: #666;
}

.refresh-status {
  margin-top: 15px;
  padding: 12px;
  background-color: #f8f9fa;
  border-radius: 6px;
  border-left: 4px solid #3498db;
}

.status-item {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  font-size: 13px;
  color: #2c3e50;
}

.status-item:last-child {
  margin-bottom: 0;
}

.status-item i {
  color: #3498db;
  width: 16px;
  text-align: center;
}

.action-buttons-modal {
  margin-top: 20px;
  padding-top: 15px;
  border-top: 1px solid #eee;
}

.refresh-now-btn {
  width: 100%;
  padding: 10px;
  background-color: #2ecc71;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: background-color 0.3s;
}

.refresh-now-btn:hover {
  background-color: #27ae60;
}

.toggle-switch {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 24px;
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: .4s;
  border-radius: 24px;
}

.toggle-slider:before {
  position: absolute;
  content: "";
  height: 16px;
  width: 16px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  transition: .4s;
  border-radius: 50%;
}

input:checked + .toggle-slider {
  background-color: #2ecc71;
}

input:checked + .toggle-slider:before {
  transform: translateX(26px);
}

/* 排序指示器 */
.sortable {
  cursor: pointer;
  position: relative;
  user-select: none;
}

.sortable:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.sorted-asc::after {
  content: " ↑";
  color: #3498db;
  font-weight: bold;
}

.sorted-desc::after {
  content: " ↓";
  color: #3498db;
  font-weight: bold;
}

/* 序号样式 */
.serial-number {
  font-weight: 600;
  color: #3498db;
  text-align: center;
}

/* 生产单序号样式 */
.part-serial-number {
  font-weight: 600;
  color: #3498db;
  text-align: right;
  padding-right: 8px;
  width: 100%;
}

/* 列宽定义 */
.col-1 {
  width: 60px;
  min-width: 60px;
}

.col-2 {
  width: 140px;
  min-width: 140px;
}

.col-3 {
  width: 100px;
  min-width: 100px;
}

.col-4 {
  width: 100px;
  min-width: 100px;
}

.col-5 {
  width: 100px;
  min-width: 100px;
}

.col-6 {
  width: 120px;
  min-width: 120px;
}

.col-7 {
  width: 120px;
  min-width: 120px;
}

.col-8 {
  width: 90px;
  min-width: 90px;
}

.col-9 {
  width: 1200px;
  min-width: 1200px;
}

/* 生产单列宽 */
.part-col-1 {
  width: 80px;
  min-width: 80px;
}

.part-col-2 {
  width: 120px;
  min-width: 120px;
}

.part-col-3 {
  width: 100px;
  min-width: 100px;
}

.part-col-4 {
  width: 80px;
  min-width: 80px;
}

.part-col-5 {
  width: 70px;
  min-width: 70px;
}

.part-col-6 {
  width: 100px;
  min-width: 100px;
}

.part-col-7 {
  width: 90px;
  min-width: 90px;
}

.part-col-8 {
  width: 130px;
  min-width: 130px;
}

.part-col-9 {
  width: 130px;
  min-width: 130px;
}

.part-col-10 {
  width: 130px;
  min-width: 130px;
}

.part-col-11 {
  width: 130px;
  min-width: 130px;
}

.part-col-12 {
  width: 90px;
  min-width: 90px;
}

.part-col-13 {
  width: 80px;
  min-width: 80px;
}

.part-col-14 {
  width: 1200px;
  min-width: 1200px;
}

/* 甘特图图例 */
.gantt-legend {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-top: 5px;
  padding: 5px;
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 3px;
  font-size: 8px;
  position: absolute;
  bottom: 5px;
  left: 5px;
  z-index: 9;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 3px;
}

.legend-color {
  width: 10px;
  height: 10px;
  border-radius: 2px;
}

/* 无数据提示 */
.gantt-no-data {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #999;
  font-size: 12px;
  font-style: italic;
}

/* 确保甘特图容器可见 */
.gantt-container {
  height: 120px !important;
  min-width: 800px !important;
  position: relative !important;
  background-color: #f8f9fa !important;
  border: 1px solid #e0e0e0 !important;
  border-radius: 4px !important;
  overflow: visible !important;
  display: block !important;
  visibility: visible !important;
}

.gantt-timeline {
  height: 100% !important;
  width: 100% !important;
  position: relative !important;
  display: block !important;
}

/* 甘特条基础样式 */
.gantt-mold-bar {
  position: absolute !important;
  height: 20px !important;
  border-radius: 3px !important;
  cursor: pointer !important;
  opacity: 0.9 !important;
  transition: opacity 0.2s !important;
  z-index: 5 !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
}

.gantt-mold-bar:hover {
  opacity: 1 !important;
  z-index: 10 !important;
}

.gantt-mold-planned {
  background-color: rgba(52, 152, 219, 0.7) !important;
  border: 1px solid #2980b9 !important;
  color: white !important;
}

.gantt-mold-actual {
  background-color: rgba(46, 204, 113, 0.7) !important;
  border: 1px solid #27ae60 !important;
  color: white !important;
}

.gantt-mold-in-progress {
  background-color: rgba(230, 126, 34, 0.7) !important;
  border: 1px solid #d35400 !important;
  color: white !important;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .control-panel:not(.hidden) {
    flex-direction: column;
    align-items: flex-start;
    padding: 15px;
  }

  .control-column {
    width: 100%;
    min-width: 100%;
  }

  select, input[type="date"], input[type="number"] {
    width: 100%;
  }

  .mold-select {
    min-height: 80px;
  }

  .action-buttons {
    flex-direction: column;
    width: 100%;
  }

  .refresh-btn, .export-btn, .auto-refresh-btn {
    width: 100% !important;
    justify-content: center;
    margin-bottom: 8px;
  }

  .cell, .header-cell {
    padding: 8px 5px;
    font-size: 12px;
  }

  .gantt-container {
    height: 80px;
    min-width: 600px;
  }

  .part-gantt-container {
    height: 100px;
    min-width: 600px;
  }

  .refresh-info {
    flex-direction: column;
    gap: 8px;
  }

  h1 {
    font-size: 22px;
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;
  }

  .title-date {
    margin-left: 0;
  }

  .settings-toggle-btn {
    padding: 6px 12px;
    font-size: 14px;
  }

  .modal-content {
    width: 98%;
    height: 95vh;
  }
}

@media (max-width: 480px) {
  .control-panel {
    padding: 10px;
    gap: 15px;
  }

  .control-column h3 {
    font-size: 14px;
  }

  .refresh-btn, .export-btn, .auto-refresh-btn {
    font-size: 13px !important;
    padding: 8px 12px !important;
  }

  h1 {
    font-size: 20px;
  }
}

/* 放大镜内容样式增强 */
.magnifier-body {
  max-height: 280px;
  overflow-y: auto;
}

/* 滚动条样式 */
.magnifier-body::-webkit-scrollbar {
  width: 6px;
}

.magnifier-body::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.magnifier-body::-webkit-scrollbar-thumb {
  background: #3498db;
  border-radius: 3px;
}

.magnifier-body::-webkit-scrollbar-thumb:hover {
  background: #2980b9;
}

/* 错误状态 */
.magnifier-error {
  color: #e74c3c;
  text-align: center;
  padding: 20px;
  font-size: 12px;
}

/* 甘特条悬停效果 */
.gantt-process-bar:hover {
  opacity: 1;
  transform: scaleY(1.2);
  z-index: 100;
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
}

/* 动画效果 */
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

/* 修复按钮显示问题 - 添加这些样式 */
button {
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  border: none;
  background: none;
  cursor: pointer;
  font-family: inherit;
}

button:focus {
  outline: 2px solid #3498db;
  outline-offset: 2px;
}

/* 确保所有按钮都可见 */
.refresh-btn, .export-btn, .auto-refresh-btn, .settings-toggle-btn, .zoom-btn {
  visibility: visible !important;
  opacity: 1 !important;
  display: flex !important;
  position: relative !important;
  z-index: 1 !important;
}
</style>
