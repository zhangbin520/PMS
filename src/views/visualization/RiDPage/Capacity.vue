<template>
  <div class="capacity-container">
    <div class="container">
      <header>
        <h1><i class="fas fa-chart-line"></i> 排产计划负载展示</h1>
        <div class="control-panel">
          <button class="export-btn" @click="exportData">
            <i class="fas fa-file-export"></i>
            <span>导出数据</span>
          </button>
          <button class="toggle-btn" @click="toggleOptions">
            <i :class="optionsPanelVisible ? 'fas fa-times' : 'fas fa-sliders-h'"></i>
            <span>{{ optionsPanelVisible ? '隐藏选项' : '显示选项' }}</span>
          </button>
        </div>
      </header>

      <div class="options-panel" :class="{ hidden: !optionsPanelVisible }">
        <div class="option-group">
          <label for="dataSource">数据源</label>
          <select id="dataSource" v-model="dataSource" class="data-source-select" @change="handleDataSourceChange">
            <option value="pre-schedule">预排</option>
            <option value="schedule-plan">排产计划</option>
          </select>
        </div>
      </div>

      <div class="content">
        <table class="workstation-table">
          <thead>
            <tr>
              <th style="width: 5%;">工段</th>
              <th style="width: 5%;">日产能</th>
              <th style="width: 6%;">负载比例</th>
              <th v-for="(date, index) in dates" :key="index" class="date-header" style="width: 6%;">
                <div class="date">{{ date.date }}</div>
                <div class="day">{{ date.day }}</div>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(ws, index) in workstations.workpiece" :key="`workpiece-${index}`">
              <td class="workstation-info">
                <div class="workstation-name">{{ ws.name }}</div>
              </td>
              <td class="workstation-info">
                <div>{{ ws.dailyCapacity }}</div>
              </td>
              <td class="workstation-info">
                <div class="load-input-container">
                  <input
                    type="number"
                    class="load-input-small"
                    v-model="ws.loadPercentage"
                    min="10"
                    max="200"
                    @change="updateWorkstationLoad(ws.id)">
                  <span style="font-size:0.8rem; color:#4d7cff;">%</span>
                </div>
              </td>
              <td v-for="(date, dateIndex) in dates" :key="`workpiece-${index}-${dateIndex}`">
                <div class="progress-value">
                  <div class="load-value">
                    <span>{{ getLoadValue(ws.id, dateIndex) }}</span>
                    <span class="unit">H</span>
                  </div>
                  <div class="assign-work-value">
                    <span>{{ getAssignWorkValue(ws.id, dateIndex) }}</span>
                    <span class="unit">H</span>
                  </div>
                </div>
                <div
                  class="progress-bar"
                  @dblclick="showDetailModal(ws.name, ws.id, dateIndex, date.date)"
                  :class="{ 'overload': isOverload(ws.id, dateIndex, ws.loadPercentage) }">
                  <div
                    class="progress-fill"
                    :class="{ 'overload': isOverload(ws.id, dateIndex, ws.loadPercentage) }"
                    :style="{ width: getProgressWidth(ws.id, dateIndex, ws.dailyCapacity) + '%' }">
                  </div>
                  <div class="progress-text">{{ getDisplayPercentage(ws.id, dateIndex, ws.dailyCapacity) }}</div>
                </div>
                <div v-if="getEquipmentActivation(ws.id, date.isoDate)" class="equipment-activation">{{ getEquipmentActivation(ws.id, date.isoDate) }}</div>
              </td>
            </tr>
            <tr>
              <td class="section-title" :colspan="3 + dates.length">电极工段</td>
            </tr>
            <tr v-for="(ws, index) in workstations.electrode" :key="`electrode-${index}`">
              <td class="workstation-info">
                <div class="workstation-name">{{ ws.name }}</div>
              </td>
              <td class="workstation-info">
                <div>{{ ws.dailyCapacity }}</div>
              </td>
              <td class="workstation-info">
                <div class="load-input-container">
                  <input
                    type="number"
                    class="load-input-small"
                    v-model="ws.loadPercentage"
                    min="10"
                    max="200"
                    @change="updateWorkstationLoad(ws.id)">
                  <span style="font-size:0.8rem; color:#4d7cff;">%</span>
                </div>
              </td>
              <td v-for="(date, dateIndex) in dates" :key="`electrode-${index}-${dateIndex}`">
                <div class="progress-value">
                  <div class="load-value">
                    <span>{{ getLoadValue(ws.id, dateIndex) }}</span>
                    <span class="unit">H</span>
                  </div>
                  <div class="assign-work-value">
                    <span>{{ getAssignWorkValue(ws.id, dateIndex) }}</span>
                    <span class="unit">H</span>
                  </div>
                </div>
                <div
                  class="progress-bar"
                  @dblclick="showDetailModal(ws.name, ws.id, dateIndex, date.date)"
                  :class="{ 'overload': isOverload(ws.id, dateIndex, ws.loadPercentage) }">
                  <div
                    class="progress-fill"
                    :class="{ 'overload': isOverload(ws.id, dateIndex, ws.loadPercentage) }"
                    :style="{ width: getProgressWidth(ws.id, dateIndex, ws.dailyCapacity) + '%' }">
                  </div>
                  <div class="progress-text">{{ getDisplayPercentage(ws.id, dateIndex, ws.dailyCapacity) }}</div>
                </div>
                <div v-if="getEquipmentActivation(ws.id, date.isoDate)" class="equipment-activation">{{ getEquipmentActivation(ws.id, date.isoDate) }}</div>
              </td>
            </tr>
          </tbody>
        </table>

        <div class="legend">
          <div class="legend-item">
            <div class="legend-color legend-normal"></div>
            <span>正常负载</span>
          </div>
          <div class="legend-item">
            <div class="legend-color legend-overload"></div>
            <span>超负载</span>
          </div>
        </div>
      </div>

      <div class="footer">
        <p> 数据最后更新: <span>{{ updateTime }}</span></p>
      </div>
    </div>
    <el-dialog
      :title="modalTitle"
      :visible.sync="detailModalVisible"
      width="90%"
      :close-on-click-modal="true"
      custom-class="detail-modal">
      <el-table :data="detailData" border stripe>
        <el-table-column type="index" label="序号" width="60" align="center"></el-table-column>
        <el-table-column prop="dispatchNo" label="派工单号" align="center"></el-table-column>
        <el-table-column prop="moldNo" label="模号" align="center"></el-table-column>
        <el-table-column prop="partNo" label="件号" align="center"></el-table-column>
        <el-table-column prop="version" label="版次" align="center"></el-table-column>
        <el-table-column prop="quantity" label="件数" align="center"></el-table-column>
        <el-table-column prop="process" label="工艺" align="center"></el-table-column>
        <el-table-column prop="startDate" label="排产开始日期" align="center"></el-table-column>
        <el-table-column prop="endDate" label="排产结束日期" align="center"></el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import { getCapacityData, getDaliyEnergy, getFocusData, getAssignWork } from '@/api/production/capacity'
import { saveAs } from 'file-saver'

export default {
  name: 'Capacity',
  data() {
    return {
      optionsPanelVisible: false,
      dataSource: 'schedule-plan',
      dates: [],
      todayIndex: -1,
      workstations: {
        workpiece: [],
        electrode: []
      },
      dailyWorkHours: {},
      focusData: {},
      dailyEnergyByCode: {},
      equipmentActivationData: {},
      assignWorkData: {},
      detailModalVisible: false,
      modalTitle: '',
      detailData: [],
      updateTime: ''
    }
  },
  mounted() {
    this.loadData()
    this.updateTime = this.getCurrentTime()
  },
  methods: {
    async loadData() {
      if (this.dataSource === 'pre-schedule') {
        await Promise.all([this.sendHttpGetRequest(), this.sendHttpGetDailyEnergyRequest(), this.sendHttpGetAssignWorkRequest()])
        this.processPreScheduleData()
      } else {
        await Promise.all([this.sendHttpGetFocusDataRequest(), this.sendHttpGetDailyEnergyRequest(), this.sendHttpGetAssignWorkRequest()])
        this.processFocusData()
      }
      this.fetchEquipmentData()
    },

    async fetchEquipmentData() {
      try {
        const response = await fetch('http://10.123.17.30:8050/prod-api/getequipment_all_activation', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          },
          mode: 'cors'
        })
        
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        
        const data = await response.json()
        const activationByProcessDate = {}
        
        data.forEach(item => {
          const process = item.process
          const dateAttribution = item.date_attribution
          const activation = item.equipment_activation
          
          if (process && dateAttribution && activation !== undefined) {
            const key = `${process}_${dateAttribution}`
            if (!activationByProcessDate[key]) {
              activationByProcessDate[key] = []
            }
            activationByProcessDate[key].push(activation)
          }
        })
        
        Object.keys(activationByProcessDate).forEach(key => {
          const activations = activationByProcessDate[key]
          const sum = activations.reduce((acc, val) => acc + val, 0)
          activationByProcessDate[key] = (sum / activations.length).toFixed(1)
        })
        
        this.equipmentActivationData = activationByProcessDate
      } catch (error) {
        console.error('Error fetching equipment activation data:', error)
        this.equipmentActivationData = {}
      }
    },

    // 原有机台数据获取方法（已注释）
    // async fetchEquipmentData() {
    //   try {
    //     const response = await fetch('http://10.123.17.30:8050/prod-api/getequipmentdata', {
    //       method: 'GET',
    //       headers: {
    //         'Content-Type': 'application/json'
    //       },
    //       mode: 'cors'
    //     })
    //     
    //     if (!response.ok) {
    //       throw new Error('Network response was not ok')
    //     }
    //     
    //     const data = await response.json()
    //     this.equipmentActivationData = {}
    //     
    //     data.forEach(item => {
    //       const equipmentId = item.equipment_id
    //       const activation = item.equipment_activation
    //       if (equipmentId && activation !== undefined) {
    //         const sectionPrefix = equipmentId.split('-')[0]
    //         if (sectionPrefix) {
    //           if (!this.equipmentActivationData[sectionPrefix]) {
    //             this.equipmentActivationData[sectionPrefix] = []
    //           }
    //           this.equipmentActivationData[sectionPrefix].push(activation)
    //         }
    //       }
    //     })
    //     
    //     Object.keys(this.equipmentActivationData).forEach(key => {
    //       const activations = this.equipmentActivationData[key]
    //       const sum = activations.reduce((acc, val) => acc + val, 0)
    //       this.equipmentActivationData[key] = (sum / activations.length * 100).toFixed(1)
    //     })
    //   } catch (error) {
    //     console.error('Error fetching equipment data:', error)
    //     this.equipmentActivationData = {}
    //   }
    // },

    async sendHttpGetRequest() {
      try {
        const response = await getCapacityData()

        this.dailyWorkHours = {}
        const dateSet = new Set()

        response.data.forEach(item => {
          const code = item.code
          const totalWorkHour = parseFloat(item.totalWorkHour.toFixed(2))
          const dateStr = item.date

          dateSet.add(dateStr)

          if (!this.dailyWorkHours[code]) {
            this.dailyWorkHours[code] = []
          }
          this.dailyWorkHours[code].push(totalWorkHour)
        })

        const sortedDates = Array.from(dateSet).sort()

        this.dates = sortedDates.map(dateStr => {
          const date = new Date(dateStr)
          const year = date.getFullYear()
          const month = String(date.getMonth() + 1).padStart(2, '0')
          const day = String(date.getDate()).padStart(2, '0')
          const isoDateStr = `${year}-${month}-${day}`
          return {
            date: `${date.getMonth()+1}/${date.getDate()}`,
            day: this.getDayName(date.getDay()),
            fullDate: date,
            isoDate: isoDateStr
          }
        })
        
        // Calculate todayIndex
        this.calculateTodayIndex()

      } catch (error) {
        console.error('Error fetching data:', error)
        this.setDefaultData()
      }
    },

    async sendHttpGetDailyEnergyRequest() {
      try {
        const response = await getDaliyEnergy()

        this.dailyEnergyByCode = {}
        response.data.forEach(item => {
          if (!item) return
          const code = item.code
          if (code) this.dailyEnergyByCode[code] = item.daliy_energy
        })
      } catch (error) {
        console.error('Error fetching daily energy:', error)
        this.dailyEnergyByCode = {}
      }
    },

    async sendHttpGetAssignWorkRequest() {
      try {
        const response = await getAssignWork()

        this.assignWorkData = {}
        response.data.forEach(item => {
          const code = item.code
          const assignWork = item.assignWork ? Math.round(item.assignWork) : 0
          const timeAttribution = item.timeAttribution

          if (!this.assignWorkData[code]) {
            this.assignWorkData[code] = {}
          }

          if (timeAttribution) {
            const date = new Date(timeAttribution)
            const year = date.getFullYear()
            const month = String(date.getMonth() + 1).padStart(2, '0')
            const day = String(date.getDate()).padStart(2, '0')
            const dateStr = `${year}-${month}-${day}`

            if (!this.assignWorkData[code][dateStr]) {
              this.assignWorkData[code][dateStr] = 0
            }
            this.assignWorkData[code][dateStr] += assignWork
          }
        })
      } catch (error) {
        console.error('Error fetching assign work:', error)
        this.assignWorkData = {}
      }
    },

    async sendHttpGetFocusDataRequest() {
      try {
        const response = await getFocusData()

        const focusData = {}

        response.data.forEach(item => {
          const section = item.section
          const processTime = parseFloat(item.process_time.toFixed(2))
          const startDate = new Date(item.plan_date)
          const endDate = new Date(item.plan_end_time)

          const startDateZero = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate())
          const endDateZero = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate())

          let dayDiff = Math.ceil((endDateZero - startDateZero) / (1000 * 60 * 60 * 24))
          if (dayDiff < 1) {
            dayDiff = 1
          }

          const hoursPerDay = processTime / dayDiff

          for (let i = 0; i < dayDiff; i++) {
            const currentDate = new Date(startDateZero)
            currentDate.setDate(startDateZero.getDate() + i)

            const dateStr = currentDate.toISOString().split('T')[0]

            if (!focusData[section]) {
              focusData[section] = {}
            }

            if (!focusData[section][dateStr]) {
              focusData[section][dateStr] = 0
            }
            focusData[section][dateStr] += hoursPerDay
          }
        })

        const today = new Date()
        const fourteenDates = []
        for (let i = -7; i < 14; i++) {
          const date = new Date(today)
          date.setDate(today.getDate() + i)
          const dateStr = date.toISOString().split('T')[0]
          fourteenDates.push(dateStr)
        }

        const sortedFocusData = {}
        Object.keys(focusData).forEach(section => {
          sortedFocusData[section] = fourteenDates.map(dateStr => {
            return parseFloat((focusData[section][dateStr] || 0).toFixed(2))
          })
        })

        this.focusData = sortedFocusData

        this.dates = fourteenDates.map(dateStr => {
          const date = new Date(dateStr)
          const year = date.getFullYear()
          const month = String(date.getMonth() + 1).padStart(2, '0')
          const day = String(date.getDate()).padStart(2, '0')
          const isoDateStr = `${year}-${month}-${day}`
          return {
            date: `${date.getMonth()+1}/${date.getDate()}`,
            day: this.getDayName(date.getDay()),
            fullDate: date,
            isoDate: isoDateStr
          }
        })
        
        // Calculate todayIndex
        this.calculateTodayIndex()

      } catch (error) {
        console.error('Error fetching focus data:', error)
        this.setDefaultData()
      }
    },

    processPreScheduleData() {
      // 合并所有 codes（dailyWorkHours 和 assignWorkData）
      const allCodes = new Set([...Object.keys(this.dailyWorkHours), ...Object.keys(this.assignWorkData)])
      const codes = Array.from(allCodes)
      const workpiece = []

      console.log('processPreScheduleData - all codes:', codes)
      console.log('processPreScheduleData - assignWorkData keys:', Object.keys(this.assignWorkData))

      codes.forEach(x => {
        const energyRaw = this.dailyEnergyByCode?.[x]
        const dailyCapacity = energyRaw === undefined || energyRaw === null || energyRaw === '' ? 600 : this.toNumberOrZero(energyRaw)
        workpiece.push({ id: x, name: x, dailyCapacity, loadPercentage: 70 })
      })

      console.log('processPreScheduleData - workpiece workstations:', workpiece)

      this.workstations = {
        workpiece,
        electrode: [
          {
            id: 'HNC_EL',
            name: 'HNC',
            dailyCapacity: (() => {
              const energyRaw = this.dailyEnergyByCode?.['HNC']
              return energyRaw === undefined || energyRaw === null || energyRaw === '' ? 200 : this.toNumberOrZero(energyRaw)
            })(),
            loadPercentage: 100
          }
        ]
      }
    },

    processFocusData() {
      // 合并所有 codes（focusData 和 assignWorkData）
      const allCodes = new Set([...Object.keys(this.focusData), ...Object.keys(this.assignWorkData)])
      const codes = Array.from(allCodes)
      const workpiece = []

      console.log('processFocusData - all codes:', codes)
      console.log('processFocusData - assignWorkData keys:', Object.keys(this.assignWorkData))

      codes.forEach(x => {
        const energyRaw = this.dailyEnergyByCode?.[x]
        const dailyCapacity = energyRaw === undefined || energyRaw === null || energyRaw === '' ? 600 : this.toNumberOrZero(energyRaw)
        workpiece.push({ id: x, name: x, dailyCapacity, loadPercentage: 70 })
      })

      console.log('processFocusData - workpiece workstations:', workpiece)

      this.workstations = {
        workpiece,
        electrode: [
          {
            id: 'HNC_EL',
            name: 'HNC',
            dailyCapacity: (() => {
              const energyRaw = this.dailyEnergyByCode?.['HNC']
              return energyRaw === undefined || energyRaw === null || energyRaw === '' ? 200 : this.toNumberOrZero(energyRaw)
            })(),
            loadPercentage: 100
          }
        ]
      }
    },

    setDefaultData() {
      this.dailyWorkHours = {
        'CAM': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        'CNC': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        'EDM': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      }

      const today = new Date()
      this.dates = []
      for (let i = -7; i < 14; i++) {
        const date = new Date(today)
        date.setDate(today.getDate() + i)
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const day = String(date.getDate()).padStart(2, '0')
        const isoDateStr = `${year}-${month}-${day}`
        this.dates.push({
          date: `${date.getMonth()+1}/${date.getDate()}`,
          day: this.getDayName(date.getDay()),
          fullDate: date,
          isoDate: isoDateStr
        })
      }
    },

    handleDataSourceChange() {
      this.loadData()
    },

    toggleOptions() {
      this.optionsPanelVisible = !this.optionsPanelVisible
    },

    toNumberOrZero(value) {
      const num = Number(value)
      return Number.isFinite(num) ? num : 0
    },

    getLoadValue(wsId, dateIndex) {
      const data = this.dataSource === 'pre-schedule' ? this.dailyWorkHours : this.focusData
      return this.toNumberOrZero(data?.[wsId]?.[dateIndex])
    },

    getAssignWorkValue(wsId, dateIndex) {
      const date = this.dates[dateIndex]
      if (!date || !date.isoDate) return 0
      const dateStr = date.isoDate
      
      // 处理电极工段的特殊情况 (HNC_EL -> HNC)
      let code = wsId
      if (code === 'HNC_EL') {
        code = 'HNC'
      }
      
      // 获取值并转换为整数
      const value = this.toNumberOrZero(this.assignWorkData?.[code]?.[dateStr])
      const intValue = Math.round(value)
      
      return intValue
    },

    getProgressWidth(wsId, dateIndex, dailyCapacity) {
      const load = this.getLoadValue(wsId, dateIndex)
      const rawPercentage = dailyCapacity > 0 ? (load / dailyCapacity) * 100 : 0
      return Math.min(rawPercentage, 100)
    },

    getDisplayPercentage(wsId, dateIndex, dailyCapacity) {
      const load = this.getLoadValue(wsId, dateIndex)
      const rawPercentage = dailyCapacity > 0 ? (load / dailyCapacity) * 100 : 0
      const percentage = Math.min(Math.round(rawPercentage), 200)
      return rawPercentage > 0 && rawPercentage < 1 ? '<1%' : `${percentage}%`
    },

    isOverload(wsId, dateIndex, loadPercentage) {
      const load = this.getLoadValue(wsId, dateIndex)
      const ws = this.workstations.workpiece.concat(this.workstations.electrode).find(w => w.id === wsId)
      if (!ws) return false
      const dailyCapacity = ws.dailyCapacity
      const rawPercentage = dailyCapacity > 0 ? (load / dailyCapacity) * 100 : 0
      return rawPercentage > loadPercentage
    },

    updateWorkstationLoad(wsId) {
      this.$forceUpdate()
    },

    showDetailModal(wsName, wsId, dateIndex, date) {
      this.modalTitle = `${wsName}工段 - ${date} 排产明细`
      this.detailData = this.generateDetailDataForWorkstation(wsName, dateIndex)
      this.detailModalVisible = true
    },

    generateDetailDataForWorkstation(workstation, dateIndex) {
      const processes = [
        'EDM(36.0)-QC(0.3)-WE(18.0)-QC(1.0)',
        'CNC(24.5)-HNC(12.0)-QC(0.5)',
        'SG(18.0)-WE(12.5)-EDM(8.0)',
        'M(30.0)-CNC(15.0)-QC(1.0)',
        'G(42.0)-EP(16.0)-QC(1.5)',
        'HNC(20.0)-ZWE(10.0)-QC(0.8)'
      ]

      const detailData = []
      const itemCount = Math.floor(Math.random() * 5) + 3

      for (let j = 0; j < itemCount; j++) {
        const processIndex = Math.floor(Math.random() * processes.length)

        detailData.push({
          dispatchNo: `DG${Math.floor(Math.random() * 9000) + 1000}`,
          moldNo: `M${Math.floor(Math.random() * 900) + 100}`,
          partNo: `P${Math.floor(Math.random() * 900) + 100}`,
          version: `V${Math.floor(Math.random() * 5) + 1}`,
          quantity: Math.floor(Math.random() * 50) + 10,
          process: processes[processIndex],
          startDate: `6/${parseInt(dateIndex)+10}`,
          endDate: `6/${parseInt(dateIndex)+12}`
        })
      }

      return detailData
    },

    exportData() {
      let csvContent = "工段,日产能,负载比例,"

      this.dates.forEach(date => {
        csvContent += `${date.date}(${date.day}),`
      })
      csvContent += "\n"

      csvContent += "工件工段\n"
      this.workstations.workpiece.forEach(ws => {
        csvContent += `${ws.name},${ws.dailyCapacity},${ws.loadPercentage}%,`

        this.dates.forEach((date, index) => {
          const load = this.getLoadValue(ws.id, index)
          csvContent += `${load},`
        })

        csvContent += "\n"
      })

      csvContent += "电极工段\n"
      this.workstations.electrode.forEach(ws => {
        csvContent += `${ws.name},${ws.dailyCapacity},${ws.loadPercentage}%,`

        this.dates.forEach((date, index) => {
          const load = this.getLoadValue(ws.id, index)
          csvContent += `${load},`
        })

        csvContent += "\n"
      })

      let detailCsvContent = "工段,日期,序号,派工单号,模号,件号,版次,件数,工艺,排产开始日期,排产结束日期\n"

      this.workstations.workpiece.concat(this.workstations.electrode).forEach(ws => {
        const wsName = ws.name

        this.dates.forEach((date, index) => {
          const details = this.generateDetailDataForWorkstation(wsName, index)

          details.forEach((detail, detailIndex) => {
            detailCsvContent += `${wsName},${date.date},${detailIndex+1},${detail.dispatchNo},${detail.moldNo},${detail.partNo},${detail.version},${detail.quantity},"${detail.process}",${detail.startDate},${detail.endDate}\n`
          })
        })
      })

      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)
      const loadFileName = `排产负载数据_${timestamp}.csv`
      const detailFileName = `工单明细数据_${timestamp}.csv`

      this.downloadFile(csvContent, loadFileName)

      setTimeout(() => {
        this.downloadFile(detailCsvContent, detailFileName)
      }, 500)

      this.$message.success("数据已导出为两个CSV文件：排产负载数据和工单明细数据")
    },

    downloadFile(content, fileName) {
      const blob = new Blob(["\ufeff" + content], { type: 'text/csv;charset=utf-8;' })
      saveAs(blob, fileName)
    },

    getDayName(dayIndex) {
      const days = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
      return days[dayIndex]
    },

    getCurrentTime() {
      const now = new Date()
      return `${now.getFullYear()}-${(now.getMonth()+1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`
    },

    calculateTodayIndex() {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      
      this.todayIndex = this.dates.findIndex(date => {
        const dateToCompare = new Date(date.fullDate)
        dateToCompare.setHours(0, 0, 0, 0)
        return dateToCompare.getTime() === today.getTime()
      })
    },

    getEquipmentActivation(wsId, date) {
      if (!wsId || !date) return ''
      const key = `${wsId}_${date}`
      const activation = this.equipmentActivationData[key]
      return activation ? `${activation}%` : ''
    }
  }
}
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Segoe UI', 'Microsoft YaHei', sans-serif;
}

html {
  font-size: 0.5px;
}

.capacity-container {
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%);
  padding: 0.15625rem;
  min-height: 100vh;
  width: 100%;
  box-sizing: border-box;
}

.container {
  width: 100%;
  max-width: 120rem;
  margin: 0 auto;
  background: white;
  border-radius: 1rem;
  box-shadow: 0 0.75rem 2.5rem rgba(0, 82, 204, 0.15);
  overflow: hidden;
  border: 1px solid #e0e6f0;
  zoom: 0.25;
  -ms-zoom: 0.25;
}

header {
  background: linear-gradient(135deg, #0052cc 0%, #0066ff 100%);
  color: white;
  padding: 0.6875rem 0.9375rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

h1 {
  font-size: 1.1875rem;
  font-weight: 700;
  color: white;
  text-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin: 0;
}

.control-panel {
  display: flex;
  gap: 0.9375rem;
  align-items: center;
}

.toggle-btn, .export-btn {
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: 0.6875rem 1.25rem;
  border-radius: 0.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.625rem;
  font-size: 1rem;
  font-weight: 600;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.toggle-btn:hover, .export-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-0.125rem);
  box-shadow: 0 0.375rem 1.25rem rgba(255, 255, 255, 0.2);
}

.options-panel {
  background: #f8fafd;
  padding: 0.625rem 0.9375rem;
  border-bottom: 1px solid #e0e6f0;
  display: flex;
  gap: 1.25rem;
  transition: all 0.3s ease;
  box-shadow: 0 0.25rem 0.75rem rgba(0, 66, 204, 0.05);
}

.options-panel.hidden {
  display: none;
}

.option-group {
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
}

.option-group label {
  font-weight: 600;
  color: #0052cc;
  font-size: 0.9375rem;
}

.data-source-select {
  padding: 0.625rem 0.9375rem;
  background: white;
  border: 2px solid #e0e6f0;
  border-radius: 0.5rem;
  width: 12.5rem;
  font-size: 0.9375rem;
  color: #333;
  transition: all 0.3s ease;
}

.data-source-select:focus {
  border-color: #0052cc;
  box-shadow: 0 0 0 0.1875rem rgba(0, 82, 204, 0.1);
  outline: none;
}

.data-source-select option {
  background: white;
  color: #333;
}

.content {
  padding: 0.28125rem;
  overflow-x: auto;
  width: 100%;
}

.workstation-table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
  border-radius: 0.75rem;
  overflow: hidden;
  box-shadow: 0 0.375rem 1.25rem rgba(0, 66, 204, 0.08);
}

.workstation-table th {
  background: linear-gradient(135deg, #f0f5ff 0%, #e6eeff 100%);
  color: #0052cc;
  font-weight: 700;
  text-align: center;
  padding: 1.125rem 0.625rem;
  border: 1px solid #d6e4ff;
  position: sticky;
  top: 0;
  z-index: 10;
  font-size: 0.95rem;
}

.workstation-table td {
  padding: 1rem 0.625rem;
  border: 1px solid #e6eeff;
  text-align: center;
  transition: background-color 0.2s ease;
}

.workstation-table tr:hover td {
  background-color: #f8fafd;
}

.workstation-info {
  background: #f8fafd;
  font-weight: 600;
  color: #0052cc;
  font-size: 1.0625rem;
}

.workstation-name {
  font-size: 1.0625rem;
  color: #0052cc;
  font-weight: 700;
}

.load-input-container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.3125rem;
}

.load-input-small {
  width: 3.125rem;
  padding: 0.375rem 0.5rem;
  background: white;
  border: 2px solid #d6e4ff;
  border-radius: 0.375rem;
  text-align: right;
  font-size: 0.9375rem;
  color: #0052cc;
  font-weight: 600;
  transition: all 0.3s ease;
}

.load-input-small:focus {
  border-color: #0052cc;
  box-shadow: 0 0 0 0.1875rem rgba(0, 82, 204, 0.1);
  outline: none;
}

.date-header {
  background: linear-gradient(135deg, #f0f5ff 0%, #e6eeff 100%);
  color: #0052cc;
  font-weight: 700;
  min-width: 6.25rem;
}

.date {
  font-size: 1rem;
  margin-bottom: 0.25rem;
  color: #0052cc;
  font-weight: 700;
}

.day {
  font-size: 0.85rem;
  color: #4d7cff;
  font-weight: 600;
}

.progress-value {
  font-weight: 700;
  color: #0052cc;
  margin-bottom: 0.625rem;
  height: auto;
  min-height: 1.75rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  background: #f0f5ff;
  border-radius: 0.375rem;
  border: 1px solid #d6e4ff;
  padding: 0.125rem 0;
}

.progress-bar {
  height: 1.375rem;
  background: #f0f5ff;
  border-radius: 0.375rem;
  overflow: hidden;
  position: relative;
  cursor: pointer;
  box-shadow: inset 0 0 0.3125rem rgba(0, 66, 204, 0.1);
  border: 1px solid #d6e4ff;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #00c851, #00e676);
  border-radius: 0.3125rem;
  transition: width 0.5s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 0.8rem;
  font-weight: 700;
  box-shadow: 0 0.125rem 0.5rem rgba(0, 200, 81, 0.3);
}

.progress-fill.overload {
  background: linear-gradient(90deg, #ff4444, #ff6b6b);
  box-shadow: 0 0.125rem 0.5rem rgba(255, 68, 68, 0.3);
}

.progress-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 0.8rem;
  font-weight: 700;
  color: #333;
  text-shadow: 0 0 0.1875rem rgba(255, 255, 255, 0.9);
  z-index: 10;
  pointer-events: none;
}

.equipment-activation {
  text-align: center;
  font-size: 0.85rem;
  color: #0052cc;
  font-weight: 600;
  margin-top: 0.125rem;
}

.footer {
  padding: 1.25rem 1.875rem;
  background: #f8fafd;
  border-top: 1px solid #e0e6f0;
  text-align: center;
  color: #4d7cff;
  font-size: 0.9375rem;
  font-weight: 600;
}

.section-title {
  background: linear-gradient(135deg, #f0f5ff 0%, #e6eeff 100%);
  font-weight: 700;
  color: #0052cc;
  text-align: left;
  padding-left: 1.5625rem;
  font-size: 1.1rem;
  height: 3.75rem;
  vertical-align: middle;
}

.legend {
  display: flex;
  justify-content: center;
  gap: 0.78125rem;
  margin-top: 0.78125rem;
  padding-top: 0.625rem;
  border-top: 1px solid #e0e6f0;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  font-size: 0.9375rem;
  color: #0052cc;
  font-weight: 600;
}

.legend-color {
  width: 1.375rem;
  height: 1.375rem;
  border-radius: 0.3125rem;
  box-shadow: 0 0.1875rem 0.5rem rgba(0, 0, 0, 0.1);
}

.legend-normal {
  background: linear-gradient(90deg, #00c851, #00e676);
}

.legend-overload {
  background: linear-gradient(90deg, #ff4444, #ff6b6b);
}

.load-value {
  display: flex;
  align-items: center;
  gap: 0.125rem;
  font-size: 0.75rem;
}

.assign-work-value {
  display: flex;
  align-items: center;
  gap: 0.125rem;
  color: #ff9800;
  font-size: 0.75rem;
}

.assign-work-value .unit {
  color: #ff9800;
  font-size: 0.55rem;
}

.unit {
  font-size: 0.85rem;
  color: #4d7cff;
  font-weight: 600;
}

@media (min-width: 160rem) {
  html {
    font-size: 0.5625px;
  }
}

@media (max-width: 120rem) {
  .container {
    max-width: 100%;
  }
}

@media (max-width: 100rem) {
  html {
    font-size: 0.46875px;
  }
}

@media (max-width: 87.5rem) {
  html {
    font-size: 0.4375px;
  }

  .content {
    padding: 0.625rem;
  }
}

@media (max-width: 75rem) {
  html {
    font-size: 0.40625px;
  }

  .container {
    max-width: 100vw;
    border-radius: 0;
  }

  header {
    padding: 1.125rem 1.25rem;
    flex-wrap: wrap;
    gap: 0.625rem;
  }

  h1 {
    font-size: 1.2rem;
  }

  .control-panel {
    gap: 0.625rem;
  }

  .toggle-btn, .export-btn {
    padding: 0.5rem 0.9375rem;
    font-size: 0.85rem;
  }

  .options-panel {
    padding: 0.9375rem 1.25rem;
    gap: 1.25rem;
  }

  .content {
    padding: 0.9375rem;
  }

  .workstation-table th,
  .workstation-table td {
    padding: 0.75rem 0.375rem;
    font-size: 0.85rem;
  }

  .progress-value {
    height: 1.5rem;
    font-size: 0.9rem;
  }

  .progress-bar {
    height: 1.125rem;
  }

  .load-input-small {
    width: 3.75rem;
    padding: 0.375rem 0.5rem;
    font-size: 0.85rem;
  }

  .section-title {
    font-size: 1rem;
    height: 3.125rem;
    padding-left: 0.9375rem;
  }

  .legend {
    flex-wrap: wrap;
    gap: 0.46875rem;
  }

  .footer {
    padding: 0.46875rem 0.625rem;
    font-size: 0.85rem;
  }
}

@media (max-width: 768px) {
  .capacity-container {
    padding: 1.25px;
  }

  header {
    padding: 7.5px;
    flex-direction: column;
    align-items: flex-start;
  }

  h1 {
    font-size: 1.1rem;
  }

  .control-panel {
    width: 100%;
    justify-content: flex-end;
    margin-top: 5px;
  }

  .toggle-btn, .export-btn {
    padding: 3px 6px;
    font-size: 0.8rem;
  }

  .toggle-btn span, .export-btn span {
    display: none;
  }

  .options-panel {
    padding: 5px 7.5px;
    flex-direction: column;
    gap: 5px;
  }

  .data-source-select {
    width: 100%;
  }

  .content {
    padding: 5px;
  }

  .workstation-table th,
  .workstation-table td {
    padding: 10px 4px;
    font-size: 0.8rem;
  }

  .date {
    font-size: 0.8rem;
  }

  .day {
    font-size: 0.7rem;
  }

  .workstation-name {
    font-size: 0.85rem;
  }

  .progress-value {
    height: 20px;
    font-size: 0.8rem;
    padding: 0 5px;
  }

  .progress-bar {
    height: 16px;
  }

  .progress-text {
    font-size: 0.7rem;
  }

  .load-input-small {
    width: 50px;
    padding: 5px 6px;
    font-size: 0.8rem;
  }

  .unit {
    font-size: 0.75rem;
  }

  .section-title {
    font-size: 0.9rem;
    height: 40px;
    padding-left: 10px;
  }

  .legend {
    gap: 10px;
  }

  .legend-item {
    font-size: 0.85rem;
  }

  .legend-color {
    width: 18px;
    height: 18px;
  }

  .footer {
    padding: 10px 15px;
    font-size: 0.8rem;
  }
}

@media (max-width: 480px) {
  h1 {
    font-size: 1rem;
  }

  .workstation-table th,
  .workstation-table td {
    padding: 8px 3px;
    font-size: 0.75rem;
  }

  .progress-value {
    height: 18px;
    font-size: 0.75rem;
  }

  .progress-bar {
    height: 14px;
  }

  .load-input-small {
    width: 45px;
    padding: 4px 5px;
    font-size: 0.75rem;
  }

  .section-title {
    font-size: 0.85rem;
    height: 35px;
  }
}

::-webkit-scrollbar {
  width: 12px;
  height: 12px;
}

::-webkit-scrollbar-track {
  background: #f0f5ff;
  border-radius: 6px;
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #0052cc 0%, #0066ff 100%);
  border-radius: 6px;
}

::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, #0066ff 0%, #0052cc 100%);
}

@media (max-width: 768px) {
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-thumb {
    border-radius: 4px;
  }
}
</style>
