<template>
  <div class="excel-editor">
    <!-- 添加部门选择区域 -->
    <div class="dept-selector">
      <el-form :model="uploadForm" :rules="uploadRules" ref="uploadFormRef" inline>
        <el-form-item label="部门代码" prop="codingRulesDeptId" required>
          <el-select
            v-model="uploadForm.codingRulesDeptId"
            placeholder="请选择部门"
            style="width: 300px; margin-right: 15px;"
            clearable
            filterable>
            <el-option
              v-for="item in deptOptions"
              :key="item.deptId"
              :label="item.deptCode"
              :value="item.deptId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            size="small"
            @click="validateDeptSelection"
            :disabled="!uploadForm.codingRulesDeptId">
            验证部门
          </el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="toolbar">
      <button @click="importExcel" class="btn-import">
        <i class="el-icon-upload"></i> 导入Excel
      </button>
      <input
        type="file"
        ref="fileInput"
        @change="handleFileChange"
        accept=".xlsx,.xls,.csv"
        style="display:none"
      />
      <!--      <button-->
      <!--        @click="exportExcel"-->
      <!--        class="btn-export"-->
      <!--        :disabled="!rowData.length">-->
      <!--        <i class="el-icon-download"></i> 导出Excel-->
      <!--      </button>-->

      <!-- 手动校验按钮 -->
      <button @click="manualValidate" class="btn-import" style="background: #909399;">
        <i class="el-icon-search"></i> 手动校验
      </button>

      <!-- 提交数据按钮 -->
      <button
        @click="submitData"
        class="btn-submit"
        :disabled="!rowData.length || hasInvalidCells() || !uploadForm.codingRulesDeptId"
        style="margin-left: auto;">
        <i class="el-icon-check"></i> 提交数据
      </button>
    </div>

    <ag-grid-vue
      style="height: 70vh;"
      class="ag-theme-fresh"
      :gridOptions="gridOptions"
      :columnDefs="columnDefs"
      :rowData="rowData"
      @grid-ready="onGridReady">
    </ag-grid-vue>

    <!-- 校验结果弹窗 -->
    <el-dialog
      title="数据校验结果"
      :visible.sync="validateDialogVisible"
      width="600px"
      append-to-body>
      <div class="validate-result">
        <el-alert
          v-if="validateResult.hasErrors"
          title="存在校验失败的单元格"
          type="error"
          :description="`发现 ${validateResult.errorCount} 个问题单元格，请修正后再提交！`"
          show-icon
          style="margin-bottom: 20px;">
        </el-alert>

        <el-alert
          v-else
          title="所有数据校验通过"
          type="success"
          :description="`共 ${validateResult.validCount} 个有效单元格，可以提交数据。`"
          show-icon
          style="margin-bottom: 20px;">
        </el-alert>

        <div class="error-details" v-if="validateResult.errorDetails.length > 0">
          <h4>问题单元格详情：</h4>
          <el-table
            :data="validateResult.errorDetails"
            border
            max-height="200">
            <el-table-column prop="row" label="行号" width="80"></el-table-column>
            <el-table-column prop="column" label="列名" width="150"></el-table-column>
            <el-table-column prop="value" label="单元格值" show-overflow-tooltip></el-table-column>
            <el-table-column prop="reason" label="问题原因" show-overflow-tooltip></el-table-column>
          </el-table>
        </div>
      </div>

<!--      <div slot="footer" class="dialog-footer">-->
<!--        <el-button @click="validateDialogVisible = false">关闭</el-button>-->
<!--        <el-button-->
<!--          type="primary"-->
<!--          @click="confirmSubmit"-->
<!--          :disabled="validateResult.hasErrors">-->
<!--          确认提交-->
<!--        </el-button>-->
<!--      </div>-->
    </el-dialog>
  </div>
</template>

<script>
import { AgGridVue } from 'ag-grid-vue'
import 'ag-grid-community/dist/styles/ag-grid.css'
import 'ag-grid-community/dist/styles/ag-theme-fresh.css'
import * as XLSX from "xlsx";
import {getToken} from "@/utils/auth";

export default {
  components: { AgGridVue },
  props: {
    // 从父组件接收部门选项
    deptOptions: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      gridApi: null,
      columnApi: null,
      rowData: [],
      columnDefs: [],
      originalMerges: [],
      originalStyles: {},
      validateDialogVisible: false,
      validateResult: {
        hasErrors: false,
        errorCount: 0,
        validCount: 0,
        errorDetails: []
      },
      // 添加一个状态来跟踪是否正在处理提交
      isSubmitting: false,
      // 添加上传表单数据
      uploadForm: {
        codingRulesDeptId: ''
      },
      // 添加上传表单验证规则
      uploadRules: {
        codingRulesDeptId: [
          { required: true, message: "请选择部门代码", trigger: "change" }
        ]
      },
      // 定义需要校验的列索引
      columnIndexes: {
        SPEC_H: 7,      // H列 - 规格
        SPEC_I: 8,      // I列 - 发料规格
        PROCESS_P: 15   // P列 - 工艺制程
      }
    }
  },
  computed: {
    // 将 gridOptions 改为计算属性，确保响应式
    gridOptions() {
      return {
        defaultColDef: {
          editable: true,
          sortable: true,
          filter: true,
          resizable: true,
          minWidth: 120,
          width: 150,
          cellStyle: this.cellStyleFunction
        },
        getRowHeight: () => 40,
        enableRangeSelection: true,
        rowSelection: 'multiple',
        onCellValueChanged: this.handleCellValueChanged,
        // 添加这些配置确保数据变化时实时更新
        enableCellChangeFlash: true,
        animateRows: true
      }
    }
  },
  methods: {
    // 根据列索引获取Excel列字母
    getExcelColumnLetter(index) {
      return String.fromCharCode(65 + index); // A=0, B=1, ..., H=7, I=8, P=15
    },

    // 从字段名获取列索引
    getColumnIndexFromField(field) {
      if (field && field.startsWith('col')) {
        return parseInt(field.replace('col', ''));
      }
      return -1;
    },

    // 验证部门选择
    validateDeptSelection() {
      this.$refs.uploadFormRef.validate((valid) => {
        if (valid) {
          const selectedDept = this.deptOptions.find(dept => dept.deptId === this.uploadForm.codingRulesDeptId);
          if (selectedDept) {
            this.$message.success(`已选择部门: ${selectedDept.deptCode}`);
          }
        } else {
          this.$message.error('请选择部门代码');
        }
      });
    },

    cellStyleFunction(params) {
      const rowIndex = params.node.rowIndex;
      const value = params.value;
      const isValid = this.validateCell(value, params, rowIndex);

      if (value === null || value === undefined || value === '') {
        return null;
      }

      if (isValid) {
        return {backgroundColor: '#e6f7e0'};
      }

      return {backgroundColor: '#ffcccc'};
    },

    onGridReady(params) {
      this.gridApi = params.api
      this.columnApi = params.columnApi
      params.api.sizeColumnsToFit()
    },

    importExcel() {
      this.$refs.fileInput.click()
    },

    handleFileChange(event) {
      const file = event.target.files[0]
      if (!file) return

      const reader = new FileReader()
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result)
        const workbook = XLSX.read(data, {type: 'array'})
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]]

        this.originalMerges = firstSheet['!merges'] || [];
        this.extractCellStyles(firstSheet);

        const jsonData = XLSX.utils.sheet_to_json(firstSheet, {header: 1})

        // 清洗数据 - 根据列索引进行转换
        const cleanedData = this.cleanDataByColumnIndex(jsonData);

        this.generateGrid(cleanedData)

        this.$nextTick(() => {
          this.validateAllCells();
        });
      }
      reader.readAsArrayBuffer(file)
    },

    // 根据列索引清洗数据
    cleanDataByColumnIndex(data) {
      if (!data || data.length < 2) return data;

      const headers = data[0];
      const cleanedData = [headers]; // 保留表头

      console.log('开始数据清洗，表头:', headers);

      // 处理数据行（从第6行开始，索引5）
      for (let i = 1; i < data.length; i++) {
        const row = data[i];
        const cleanedRow = [...row]; // 复制原行

        // 从第6行开始处理（索引5对应Excel第6行）
        if (i >= 5) {
          // H列（索引7）- 规格
          if (cleanedRow.length > this.columnIndexes.SPEC_H) {
            const originalValue = cleanedRow[this.columnIndexes.SPEC_H];
            if (typeof originalValue === 'string' && originalValue.trim() !== '') {
              console.log(`清洗前 H列[${i + 1}]:`, originalValue);
              cleanedRow[this.columnIndexes.SPEC_H] = this.cleanSpecificationValue(originalValue);
              console.log(`清洗后 H列[${i + 1}]:`, cleanedRow[this.columnIndexes.SPEC_H]);
            }
          }

          // I列（索引8）- 发料规格
          if (cleanedRow.length > this.columnIndexes.SPEC_I) {
            const originalValue = cleanedRow[this.columnIndexes.SPEC_I];
            if (typeof originalValue === 'string' && originalValue.trim() !== '') {
              console.log(`清洗前 I列[${i + 1}]:`, originalValue);
              cleanedRow[this.columnIndexes.SPEC_I] = this.cleanSpecificationValue(originalValue);
              console.log(`清洗后 I列[${i + 1}]:`, cleanedRow[this.columnIndexes.SPEC_I]);
            }
          }

          // P列（索引15）- 工艺制程
          if (cleanedRow.length > this.columnIndexes.PROCESS_P) {
            const originalValue = cleanedRow[this.columnIndexes.PROCESS_P];
            if (typeof originalValue === 'string' && originalValue.trim() !== '') {
              console.log(`检查 P列[${i + 1}]:`, originalValue);
              // P列只校验不转换
            }
          }
        }

        cleanedData.push(cleanedRow);
      }

      console.log('数据清洗完成');
      return cleanedData;
    },

    // 清洗规格值（H列和I列）
    cleanSpecificationValue(value) {
      let cleanedValue = value;

      // 1. 将 x 或 X 替换为 *（使用全局替换，不区分大小写）
      cleanedValue = cleanedValue.replace(/x/gi, '*');

      // 2. 处理小数点
      // 先处理 10.0, 10.00 等情况
      cleanedValue = cleanedValue.replace(/(\d+)\.0+(?=\D|$)/g, '$1');
      // 再处理 10. 这种情况
      cleanedValue = cleanedValue.replace(/(\d+)\.(?=\D|$)/g, '$1');

      return cleanedValue;
    },

    extractCellStyles(worksheet) {
      this.originalStyles = {};
      for (let cellAddress in worksheet) {
        if (cellAddress[0] === '!') continue;
        const cell = worksheet[cellAddress];
        if (cell.s) {
          this.originalStyles[cellAddress] = cell.s;
        }
      }
    },

    generateGrid(data) {
      const maxCols = Math.max(...data.map(row => row.length))
      const headers = data[0] || []
      while (headers.length < maxCols) {
        headers.push(`列${headers.length + 1}`)
      }

      this.columnDefs = headers.map((header, index) => ({
        headerName: header,
        field: `col${index}`,
        width: 180
      }))

      this.rowData = data.slice(1).map((row, rowIndex) => {
        const rowObj = {}
        headers.forEach((_, index) => {
          rowObj[`col${index}`] = row[index] ?? ''
        })
        return rowObj
      })
    },

    // 单元格校验方法 - 根据列索引校验
    validateCell(value, params, rowIndex) {
      if (value === null || value === undefined || value === '') {
        return true;
      }

      // 获取列索引
      const columnIndex = this.getColumnIndexFromField(params.colDef.field);

      // 对所有行进行通用校验（空格和标点符号）
      if (typeof value === 'string') {
        // 检查首尾空格
        if (/^\s|\s$/.test(value)) {
          return false;
        }

        // 检查中文标点符号
        const chinesePunctuation = /[\u3000-\u303F\uff00-\uffef]/;
        if (chinesePunctuation.test(value)) {
          return false;
        }
      }

      // 只对第6行及之后的数据行进行特殊列校验（前5行是表头）
      if (rowIndex < 4) {
        console.log('1111进入只对第6行及之后的数据行进行特殊列校验（前5行是表头）');
        return true;
      }

      // P列（索引15）- 工艺制程校验
      if (columnIndex === this.columnIndexes.PROCESS_P) {
        return this.validateProcessFormat(value);
      }

      // H列（索引7）和 I列（索引8）- 规格校验
      if (columnIndex === this.columnIndexes.SPEC_H || columnIndex === this.columnIndexes.SPEC_I) {
        return this.validateSpecificationFormat(value);
      }

      return true;
    },

    // 校验工艺制程格式 WE(1.5)-G(0.8)-KZ(0.1)-QC(0.1)
    validateProcessFormat(value) {
      if (typeof value !== 'string') return false;

      // 空值通过
      if (value.trim() === '') return true;
      console.log("2222进入只对第6行及之后的数据行进行特殊列校验（前5行是表头）")
      console.log("2222进入只对第6行及之后的数据行进行特殊列校验（前5行是表头）", value)
      // 首先检查是否存在不完整的小数点，如 QC(0.)
      const incompleteDecimalPattern = /\(\d+\.\)/;
      console.log("jiaoyuan", incompleteDecimalPattern.test(value))
      if (incompleteDecimalPattern.test(value)) {
        return false; // 不完整的小数点，如 QC(0.) 应该被拒绝
      }

      // 工艺制程格式正则：字母+(数字.数字) 用-连接
      // 例如：WE(1.5)-G(0.8)-KZ(0.1)-QC(0.1)
      // 修改后的正则：确保小数点后必须至少有一个数字
      const processPattern = /^[A-Za-z]+\(\d+(\.\d+)?\)(-[A-Za-z]+\(\d+(\.\d+)?\))*$/;

      return processPattern.test(value.trim());
    },

    // 校验发料规格和规格列格式
    validateSpecificationFormat(value) {
      if (typeof value !== 'string') return false;

      // 空值通过
      if (value.trim() === '') return true;

      // 检查是否包含需要替换的x/X
      if (/[xX]/.test(value)) {
        return false;
      }

      // 检查不完整的小数点
      if (/(\d+)\.(?=\D|$)/.test(value) && !/(\d+)\.0+(?=\D|$)/.test(value)) {
        return false;
      }

      // 校验规格格式
      // 规格通常包含数字、*、×、-等符号
      const specPattern = /^[\d\*×\-\+\.\,\s\/\\\(\)mmcm]+$/i;

      return specPattern.test(value.trim());
    },

    // 获取校验失败的具体原因
    getValidateReason(value, params) {
      if (value === null || value === undefined || value === '') {
        return '';
      }

      // 获取列索引和列名
      const columnIndex = this.getColumnIndexFromField(params.colDef.field);
      const columnName = params.colDef.headerName;
      const rowIndex = params.node.rowIndex;

      // 通用错误原因（适用于所有行）
      if (typeof value === 'string') {
        if (/^\s|\s$/.test(value)) {
          return '包含首尾空格';
        }

        const chinesePunctuation = /[\u3000-\u303F\uff00-\uffef]/;
        if (chinesePunctuation.test(value)) {
          return '包含中文标点符号';
        }
      }

      // 只对第6行及之后的数据行进行特殊列的错误原因判断
      if (rowIndex < 5) {
        return '';
      }

      // P列（索引15）- 工艺制程的错误原因
      if (columnIndex === this.columnIndexes.PROCESS_P) {
        if (!this.validateProcessFormat(value)) {
          // 检查具体的不合规原因
          if (value.includes('(') && value.includes(')')) {
            const incompleteDecimalPattern = /\(\d+\.\)/;
            if (incompleteDecimalPattern.test(value)) {
              return `${columnName}工艺制程格式错误：括号内数字不完整（如0.），小数点后必须有数字`;
            }

            // 检查括号内格式
            const bracketContents = value.match(/\(([^)]+)\)/g);
            if (bracketContents) {
              for (let content of bracketContents) {
                const inside = content.slice(1, -1); // 去掉括号
                if (!/^\d+(\.\d+)?$/.test(inside)) {
                  return `${columnName}工艺制程格式错误："${content}" 应为数字或小数格式`;
                }
              }
            }
          }
          return `${columnName}工艺制程格式不正确，应为类似 WE(1.5)-G(0.8)-KZ(0.1) 格式，且小数点后必须有数字`;
        }
      }

      // H列（索引7）和 I列（索引8）- 规格的错误原因
      if (columnIndex === this.columnIndexes.SPEC_H || columnIndex === this.columnIndexes.SPEC_I) {
        // 先检查是否包含需要替换的字符
        if (/[xX]/.test(value)) {
          return `${columnName}中包含x/X，应替换为*号`;
        }

        // 检查不完整的小数点
        if (/(\d+)\.(?=\D|$)/.test(value) && !/(\d+)\.0+(?=\D|$)/.test(value)) {
          return `${columnName}中小数点不完整（如10.），请补充小数位或去掉小数点`;
        }

        if (!this.validateSpecificationFormat(value)) {
          return `${columnName}规格格式不正确，请检查是否包含非法字符`;
        }
      }

      return '';
    },

    // 全面校验所有单元格并返回详细结果
    validateAllCellsDetailed() {
      if (!this.gridApi) return;

      let errorCount = 0;
      let validCount = 0;
      const errorDetails = [];

      this.gridApi.forEachNode((node, rowIndex) => {
        // 现在对所有行进行校验
        Object.keys(node.data).forEach(field => {
          const value = node.data[field];
          const columnDef = this.columnDefs.find(col => col.field === field);
          const columnName = columnDef ? columnDef.headerName : field;

          // 创建 params 对象
          const params = {
            colDef: columnDef,
            data: node.data,
            node: node
          };

          if (!this.validateCell(value, params, rowIndex)) {
            errorCount++;
            errorDetails.push({
              row: rowIndex + 2, // +2 因为表头占一行，且行号从1开始
              column: columnName,
              value: value,
              reason: this.getValidateReason(value, params)
            });
          } else if (value !== '') {
            validCount++;
          }
        });
      });

      return {
        hasErrors: errorCount > 0,
        errorCount,
        validCount,
        errorDetails
      };
    },

    // 校验所有单元格
    validateAllCells() {
      const result = this.validateAllCellsDetailed();
      if (!result) return 0;

      if (result.errorCount > 0) {
        this.$message.warning(`发现 ${result.errorCount} 个问题单元格（红色），${result.validCount} 个有效单元格（绿色）`);
      } else if (result.validCount > 0) {
        this.$message.success(`所有单元格校验通过，${result.validCount} 个有效单元格（绿色）`);
      }

      return result.errorCount;
    },

    // 检查是否存在无效单元格
    hasInvalidCells() {
      if (!this.gridApi) return false;

      let hasErrors = false;
      this.gridApi.forEachNode(node => {
        // 现在对所有行进行校验
        Object.keys(node.data).forEach(field => {
          const value = node.data[field];
          const columnDef = this.columnDefs.find(col => col.field === field);

          // 创建 params 对象
          const params = {
            colDef: columnDef,
            data: node.data,
            node: node
          };

          if (value && !this.validateCell(value, params, node.rowIndex)) {
            hasErrors = true;
          }
        });
      });

      return hasErrors;
    },

    // 单元格编辑后实时校验和转换 - 根据列索引处理
    handleCellValueChanged(event) {
      const newValue = event.newValue;
      const oldValue = event.oldValue;
      const columnIndex = this.getColumnIndexFromField(event.column.colId);
      const rowIndex = event.node.rowIndex;
      const excelColumn = this.getExcelColumnLetter(columnIndex);

      console.log(`单元格值改变: ${excelColumn}${rowIndex + 1}, 新值:`, newValue, '旧值:', oldValue);

      if (newValue === oldValue) return;

      // 只对第6行及之后的数据行进行实时转换（前5行是表头）
      if (rowIndex >= 4) {
        // 如果是H列或I列（规格列），进行实时转换
        if ((columnIndex === this.columnIndexes.SPEC_H || columnIndex === this.columnIndexes.SPEC_I) &&
          typeof newValue === 'string' && newValue.trim() !== '') {

          let convertedValue = this.cleanSpecificationValue(newValue);

          // 如果值发生了变化，更新单元格
          if (convertedValue !== newValue) {
            console.log(`规格列转换: ${newValue} -> ${convertedValue}`);
            // 使用setTimeout避免在事件处理中直接修改数据
            setTimeout(() => {
              event.node.setDataValue(event.column.colId, convertedValue);
            }, 0);
            return; // 直接返回，等待下一次值变化
          }
        }
      }

      // 立即更新校验结果
      this.validateResult = this.validateAllCellsDetailed();

      // 对于P列修改，特别处理
      if (columnIndex === this.columnIndexes.PROCESS_P && rowIndex >= 5) {
        console.log('P列修改，进行实时校验');


        // 创建校验参数
        const params = {
          colDef: event.column.colDef,
          data: event.data,
          node: event.node
        };
        console.log(`P列校验结果:`, newValue, params, rowIndex);
        const isValid = this.validateCell(newValue, params, rowIndex);
        console.log(`P列校验结果:`, isValid);

        // 强制刷新当前单元格和行
        this.gridApi.refreshCells({
          rowNodes: [event.node],
          columns: [event.column.colId],
          force: true
        });
      } else {
        // 其他列正常刷新
        this.gridApi.refreshCells({
          force: true
        });
      }

      // 调试信息
      console.log('当前校验结果:', this.validateResult);
    },

    // 执行变更后的校验
    performValidationAfterChange(event, value) {
      console.log('执行校验，传入值:', value);

      // 从节点数据中获取实际值，确保准确性
      const actualValue = event.node.data[event.column.colId];
      console.log('节点中存储的实际值:', actualValue);

      // 使用传入的值，如果传入值为空则使用实际值
      const checkValue = value !== undefined ? value : actualValue;

      // 创建校验参数
      const params = {
        colDef: event.column.colDef,
        data: event.data,
        node: event.node
      };

      const columnIndex = this.getColumnIndexFromField(event.column.colId);
      const rowIndex = event.node.rowIndex;

      console.log(`校验参数 - 列: ${columnIndex}, 行: ${rowIndex}, 值: "${checkValue}"`);

      // 如果是P列，特别处理
      if (columnIndex === this.columnIndexes.PROCESS_P && rowIndex >= 5) {
        const isValid = this.validateCell(checkValue, params, rowIndex);
        console.log(`P列校验结果: ${isValid}, 值: "${checkValue}"`);
      }

      // 更新校验结果
      this.validateResult = this.validateAllCellsDetailed();

      // 强制刷新当前单元格样式
      this.gridApi.refreshCells({
        rowNodes: [event.node],
        columns: [event.column.colId],
        force: true
      });

      console.log('单元格校验完成');
    },

    // 手动校验方法
    manualValidate() {
      console.log('=== 开始手动校验 ===');
      const result = this.validateAllCellsDetailed();

      if (result) {
        console.log('校验结果:', result);
        this.validateResult = result;

        // 显示校验弹窗
        this.validateDialogVisible = true;

        if (result.hasErrors) {
          this.$message.warning(`发现 ${result.errorCount} 个问题单元格`);
        } else {
          this.$message.success(`所有 ${result.validCount} 个单元格校验通过`);
        }
      }

      // 强制刷新所有单元格样式
      if (this.gridApi) {
        this.gridApi.refreshCells({force: true});
      }
    },

    // 提交数据方法
    submitData() {
      console.log('提交按钮被点击');

      // 先验证部门选择
      this.$refs.uploadFormRef.validate((valid) => {
        if (!valid) {
          this.$message.error('请先选择部门代码');
          return;
        }

        if (!this.rowData.length) {
          this.$message.warning('没有数据可提交');
          return;
        }

        if (this.isSubmitting) {
          this.$message.warning('正在提交中，请稍候...');
          return;
        }

        // 立即进行校验
        this.validateResult = this.validateAllCellsDetailed();
        console.log('校验结果:', this.validateResult);

        // 如果没有错误，直接提交
        if (!this.validateResult.hasErrors) {
          console.log('没有错误，直接提交');
          this.confirmSubmit();
          return;
        }

        // 如果有错误，显示校验结果弹窗
        console.log('有错误，显示弹窗');
        this.validateDialogVisible = true;
      });
    },

    // 在 confirmSubmit 方法中直接调用后端接口
    async confirmSubmit() {
      console.log('确认提交');

      if (this.isSubmitting) {
        this.$message.warning('正在提交中，请稍候...');
        return;
      }
      if (!this.rowData || this.rowData.length === 0) {
        this.$message.warning('没有数据可提交');
        return;
      }

      // 再次确保没有错误
      this.validateResult = this.validateAllCellsDetailed();
      if (this.validateResult.hasErrors) {
        this.$message.error('存在校验失败的单元格，无法提交');
        return;
      }

      this.isSubmitting = true;

      try {
        console.log('开始提交数据到后端，数据行数:', this.rowData.length);
        console.log('选择的部门ID:', this.uploadForm.codingRulesDeptId);

        // 1. 将数据转换为Excel文件
        const excelFile = await this.convertDataToExcel(this.rowData);

        // 2. 创建FormData
        const formData = new FormData();
        formData.append('file', excelFile, 'import_data.xlsx');
        formData.append('codingRulesDeptId', this.uploadForm.codingRulesDeptId); // 使用选择的部门ID

        // 3. 调用后端接口
        const response = await this.uploadFile(formData);

        if (response.code === 200) { // 根据您的API响应结构调整
          console.log('提交成功:', response);
          this.$message.success('订单数据提交成功！');

          // 触发成功事件通知父组件
          this.$emit('submit-success', {
            data: this.rowData,
            deptId: this.uploadForm.codingRulesDeptId
          });

          // 关闭弹窗
          this.validateDialogVisible = false;

          // 清空数据
          this.clearData();
        } else {
          throw new Error(response.msg || '提交失败');
        }

      } catch (error) {
        console.error('提交出错:', error);
        this.$message.error('提交出错: ' + error.message);
      } finally {
        // 重置提交状态
        setTimeout(() => {
          this.isSubmitting = false;
        }, 1000);
      }
    },

    // 添加文件上传方法到子组件
    uploadFile(formData) {
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        // 使用您的后端接口URL
        const url = process.env.VUE_APP_BASE_API + "/order/bom/importOrderBomAndDetail";

        xhr.open('POST', url, true);

        // 添加 Authorization 请求头
        const token = getToken();
        if (token) {
          xhr.setRequestHeader('Authorization', 'Bearer ' + token);
        }

        xhr.onload = function () {
          if (xhr.status === 200) {
            try {
              const response = JSON.parse(xhr.responseText);
              resolve(response);
            } catch (e) {
              reject(new Error('响应解析失败'));
            }
          } else {
            reject(new Error('上传失败，状态码: ' + xhr.status));
          }
        };

        xhr.onerror = function () {
          reject(new Error('网络错误'));
        };

        // 添加超时处理
        xhr.timeout = 30000; // 30秒超时
        xhr.ontimeout = function () {
          reject(new Error('请求超时'));
        };

        xhr.send(formData);
      });
    },

    // 添加数据转Excel方法到子组件
    convertDataToExcel(data) {
      return new Promise((resolve) => {
        // 使用xlsx库将数据转换为Excel文件
        const wb = XLSX.utils.book_new();

        // 将数据转换为工作表
        const ws = XLSX.utils.json_to_sheet(data);

        // 将工作表添加到工作簿
        XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

        // 生成Excel二进制数据
        const excelBuffer = XLSX.write(wb, {bookType: 'xlsx', type: 'array'});

        // 创建Blob对象
        const blob = new Blob([excelBuffer], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        });

        resolve(blob);
      });
    },

    exportExcel() {
      if (this.hasInvalidCells()) {
        this.$message.error('存在错误单元格（红色），请修正后再导出！');
        return;
      }

      if (!this.gridApi) return

      const workbook = XLSX.utils.book_new()
      const exportData = this.rowData.map(row =>
        this.columnDefs.reduce((obj, colDef) => {
          obj[colDef.headerName] = row[colDef.field] ?? ''
          return obj
        }, {})
      )

      const worksheet = XLSX.utils.json_to_sheet(exportData, {
        header: this.columnDefs.map(col => col.headerName)
      })

      this.mergeFirstTwoRowsAsOneCell(worksheet);

      XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1')
      XLSX.writeFile(workbook, '订单导入BOM.xlsx')
      this.clearData();
    },

    // 清空数据方法
    clearData() {
      this.rowData = [];
      this.columnDefs = [];
      this.originalMerges = [];
      this.originalStyles = {};
      this.validateResult = {
        hasErrors: false,
        errorCount: 0,
        validCount: 0,
        errorDetails: []
      };
      this.isSubmitting = false;
      this.uploadForm.codingRulesDeptId = '';

      if (this.gridApi) {
        this.gridApi.setRowData([]);
        this.gridApi.setColumnDefs([]);
      }

      this.$message.success('数据已清空');
    },

    // 合并整个第一行和第二行为一个大单元格
    mergeFirstTwoRowsAsOneCell(worksheet) {
      worksheet['!merges'] = [];
      const columnCount = this.columnDefs.length;
      const firstHeaderValue = this.columnDefs[0]?.headerName || '订单数据';

      for (let col = 0; col < columnCount; col++) {
        const cellAddress = XLSX.utils.encode_cell({r: 0, c: col});

        if (col === 0) {
          if (!worksheet[cellAddress]) {
            worksheet[cellAddress] = {v: firstHeaderValue};
          } else {
            worksheet[cellAddress].v = firstHeaderValue;
          }
        } else {
          if (!worksheet[cellAddress]) {
            worksheet[cellAddress] = {v: ''};
          } else {
            worksheet[cellAddress].v = '';
          }
        }

        worksheet[cellAddress].s = {
          font: {bold: true},
          alignment: {
            horizontal: 'center',
            vertical: 'center',
            wrapText: true
          },
          border: {
            top: {style: 'thin'},
            left: {style: 'thin'},
            bottom: {style: 'thin'},
            right: {style: 'thin'}
          }
        };
      }

      for (let col = 0; col < columnCount; col++) {
        const cellAddress = XLSX.utils.encode_cell({r: 1, c: col});

        if (!worksheet[cellAddress]) {
          worksheet[cellAddress] = {v: ''};
        } else {
          worksheet[cellAddress].v = '';
        }

        worksheet[cellAddress].s = {
          alignment: {
            horizontal: 'center',
            vertical: 'center',
            wrapText: true
          },
          border: {
            top: {style: 'thin'},
            left: {style: 'thin'},
            bottom: {style: 'thin'},
            right: {style: 'thin'}
          }
        };
      }

      worksheet['!merges'].push({
        s: {r: 0, c: 0},
        e: {r: 1, c: columnCount - 1}
      });

      if (!worksheet['!rows']) worksheet['!rows'] = [];
      worksheet['!rows'][0] = {hpt: 40};
      worksheet['!rows'][1] = {hpt: 40};
    }
  }
}
</script>

<style scoped>
.excel-editor {
  height: 100vh;
  padding: 20px;
  display: flex;
  flex-direction: column;
}

.dept-selector {
  margin-bottom: 15px;
  padding: 15px;
  background-color: #f5f7fa;
  border-radius: 4px;
  border: 1px solid #e4e7ed;
}

.toolbar {
  margin-bottom: 15px;
  display: flex;
  gap: 15px;
  align-items: center;
}

.btn-import, .btn-export, .btn-submit {
  padding: 12px 24px;
  font-size: 16px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s;
}

.btn-import {
  background: #67C23A;
  color: white;
}

.btn-import:hover {
  background: #5daf34;
  transform: scale(1.05);
}

.btn-export {
  background: #409EFF;
  color: white;
}

.btn-export:hover {
  background: #3a8ee6;
  transform: scale(1.05);
}

.btn-export:disabled {
  background: #C0C4CC;
  cursor: not-allowed;
  transform: none;
}

.btn-submit {
  background: #E6A23C;
  color: white;
}

.btn-submit:hover {
  background: #d4922f;
  transform: scale(1.05);
}

.btn-submit:disabled {
  background: #C0C4CC;
  cursor: not-allowed;
  transform: none;
}

.validate-result {
  max-height: 400px;
  overflow-y: auto;
}

.error-details {
  margin-top: 20px;
}

.error-details h4 {
  margin-bottom: 10px;
  color: #F56C6C;
}

/* 调整AG-Grid主题中的行高 */
.ag-theme-fresh .ag-row {
  min-height: 40px !important;
  line-height: 40px !important;
}

.ag-theme-fresh .ag-cell {
  line-height: 40px !important;
  padding: 0 10px !important;
}
</style>
