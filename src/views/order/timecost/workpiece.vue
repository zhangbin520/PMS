<template>
  <div class="app-container">
    <div slot="header">
      <el-form :model="queryParams" ref="queryForm" v-show="showSearch" :inline="true">
        <el-form-item label="模号" prop="moduleNo">
          <el-input
            v-model="queryParams.moduleNo"
            placeholder="请输入模号"
            clearable
            size="small"
            style="width: 220px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="件号" prop="pieceNo">
          <el-input
            v-model="queryParams.pieceNo"
            placeholder="请输入客户件号"
            clearable
            size="small"
            style="width: 220px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="版本" prop="versionNo">
          <el-input
            v-model="queryParams.versionNo"
            placeholder="请输入版本"
            clearable
            size="small"
            style="width: 220px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="生产单号" prop="prodOrderNo">
          <el-input
            v-model="queryParams.prodOrderNo"
            placeholder="请输入生产单号"
            clearable
            size="small"
            style="width: 220px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="品名" prop="pinName">
          <el-input
            v-model="queryParams.pinName"
            placeholder="请输入品名"
            clearable
            size="small"
            style="width: 220px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
          <el-button type="warning" plain icon="el-icon-download" size="mini" style="margin-bottom: 10px" @click="handleExport">导出</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-row>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getListWorkpiece"></right-toolbar>
      <el-col :span="24">
        <el-table v-loading="loading" :data="workpieceList" border highlight-current-row>
          <el-table-column type="index" width="50"/>
          <el-table-column label="操作" align="center" width="160" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button
                size="mini"
                round
                type="primary"
                icon="el-icon-edit"
                @click="handleViewWorktime(scope.row)"
              >查看工时</el-button>
              <el-button
                size="mini"
                round
                type="primary"
                icon="el-icon-folder-opened"
                @click="handleViewFile(scope.row)"
              >查看图档</el-button>
            </template>
          </el-table-column>
          <el-table-column label="模号" align="center" prop="moduleNo" />
          <el-table-column label="件号" align="center" prop="pieceNo"  />
          <el-table-column label="版本" align="center" prop="versionNo" />
          <el-table-column label="品名" align="center" prop="pinName"  />
          <el-table-column label="规格" align="center" >
            <template slot-scope="scope">
              <p>{{scope.row.length}}*{{scope.row.width}}*{{scope.row.height}}</p>
            </template>
          </el-table-column>
          <el-table-column label="数量" align="center" prop="quantity" />
          <el-table-column label="材质" align="center" prop="material"  />
          <el-table-column label="硬度" align="center" prop="hardness" />
          <el-table-column label="投单类型" align="center" prop="processingContent"  />
          <el-table-column label="投单原因" align="center" prop="orderReason"  />
          <el-table-column label="生产单号" align="center" prop="prodOrderNo"  />
          <el-table-column label="加工成本" align="center" prop="processingCost">
            <template slot-scope="scope">
              {{ (scope.row.processingCost) | keepTwoNum}}
            </template>
          </el-table-column>
          <el-table-column label="材料成本" align="center" prop="materialCost">
            <template slot-scope="scope">
              {{ (scope.row.materialCost) | keepTwoNum}}
            </template>
          </el-table-column>
          <el-table-column label="管理成本" align="center" prop="managementCost">
            <template slot-scope="scope">
              {{ (scope.row.managementCost) | keepTwoNum}}
            </template>
          </el-table-column>
          <el-table-column label="刀具成本" align="center" prop="toolCost">
            <template slot-scope="scope">
              {{ (scope.row.toolCost) | keepTwoNum}}
            </template>
          </el-table-column>
          <el-table-column label="电极成本" align="center" prop="electrodeCost">
            <template slot-scope="scope">
              {{ (scope.row.electrodeCost) | keepTwoNum}}
            </template>
          </el-table-column>
          <el-table-column label="总成本" align="center" prop="totalCost">
            <template slot-scope="scope">
              {{ (scope.row.totalCost) | keepTwoNum}}
            </template>
          </el-table-column>
        </el-table>
        <div align="center">
          <pagination
            v-show="total>0"
            :total="total"
            :page.sync="queryParams.pageNo"
            :limit.sync="queryParams.pageSize"
            @pagination="getListWorkpiece"
          />
          <el-row>
            <el-button
              size="small"
              plain
              type="primary"
              icon="el-icon-refresh-left"
              @click="handleReturn"
            >返回</el-button>
          </el-row>
        </div>
      </el-col>
    </el-row>
    <!-- 查看工时对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="400px" append-to-body>
      <el-table :data="timeData" v-loading="loading" :default-sort = "{order: 'descending'}" show-summary :summary-method="getSummaries">
        <el-table-column prop="name" label="工序名称" sortable></el-table-column>
        <el-table-column prop="workHour" label="工时"></el-table-column>
        <el-table-column prop="unitPrice" label="单价"></el-table-column>
        <el-table-column prop="totalPrice" label="总价"></el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="open = false" type="danger" style="margin-right: 40%">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { listWorktime,listWorkpiece } from "../../../api/order/timecost"
  import { ElMapExportTable } from 'table-excel'

  export default {
    name: "Quality",
    dicts: ['sys_normal_disable'],
    filters: {
      keepTwoNum(value){
        value = Number(value);
        return value.toFixed(2)
      }
    },
    data() {
      return {
        // 遮罩层
        loading: true,
        // 总条数
        total: 0,
        // 非多个禁用
        multiple: true,
        // 显示搜索条件
        showSearch: true,
        // 工时成本表格数据
        workpieceList: [],
        // 查看工时表格参数
        timeData: [],
        //总成本表单参数
        form:{
          processingCost:'',
          materialCost:'',
          managementCost:'',
          toolCost:'',
          electrodeCost:'',
        },
        //携带参数
        costId:[],
        // 生产进度表格数据
        sheduleList: [],
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        // 查询参数
        queryParams: {
          pageNo: 1,
          pageSize: 10,
        },
        //工时成本表单校验
        rules: {
          code: [
            { required: true, message: "材质编码不能为空", trigger: "blur" },
            { min: 2, max: 10, message: '材质编码长度必须介于 2 和 10 之间', trigger: 'blur' }
          ],
          name: [
            { required: true, message: "名称不能为空", trigger: "blur" },
            { min: 2, max: 10, message: '名称长度必须介于 2 和 10 之间', trigger: 'blur' }
          ],
        },
      };
    },
    created() {
      this.getListWorkpiece();
    },
    mounted() {
      this.costId = this.$route.query.costId
    },
    computed: {
      totalCost: function () {
        // return parseInt(this.form.a) + parseInt(this.form.b)
        if (isNaN(parseInt(this.form.processingCost) + parseInt(this.form.materialCost) + parseInt(this.form.managementCost)
          + parseInt(this.form.toolCost) + parseInt(this.form.electrodeCost))) {
          return ''
        } else {
          return parseInt(this.form.processingCost) + parseInt(this.form.materialCost) + parseInt(this.form.managementCost)
            + parseInt(this.form.toolCost) + parseInt(this.form.electrodeCost)
        }
      }
    },
    methods: {
      /** 分页查询工件列表 */
      getListWorkpiece() {
        this.loading = true;
        this.queryParams.bomId = this.$route.query.bomId
        listWorkpiece(this.queryParams).then(response => {
          this.sheduleList = response.data.records;
          this.workpieceList = response.data.records;
          this.total = response.data.total;
          this.loading = false;
        });
      },
      // 工时成本表单重置
      reset() {
        this.form = {
          processingCost: undefined,
          materialCost: undefined,
          managementCost: undefined,
        };
        this.resetForm("form");
      },
      /** 搜索按钮操作 */
      handleQuery() {
        this.queryParams.pageNo = 1;
        this.getListWorkpiece();
      },
      /** 查看工时 */
      handleViewWorktime(row) {
        this.reset();
        this.open = true;
        this.title = "查看工时";
        const detailId = row.id
        listWorktime({'detailId':detailId}).then(response =>{
          this.timeData = response.data.records;
        })
      },
      /** 查看图档 */
      handleViewFile(row) {
        this.$router.push({
          path:'/eleContact/eleContactForm',
          query:{
            prodOrderNo: row.prodOrderNo,
          },
        });
      },
      /** 返回按钮 */
      handleReturn() {
        this.$router.go(-1);
      },
      /** 工时表格合计行 */
      getSummaries(param) {
        const { columns, data } = param
        const sums = []
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '合计'
            return
          }
          const values = data.map(item => Number(item[column.property]))
          if (!values.every(value => isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr)
              if (!isNaN(value)) {
                return prev + curr
              } else {
                return prev
              }
            }, 0)
            switch (column.property) {
              case 'workHour':
                sums[index] = sums[index].toFixed(2) //保留两位小数
                break
              case 'unitPrice':
                sums[index] = '-'
                break
              case 'totalPrice':
                sums[index] = sums[index].toFixed(2) //保留两位小数
                break
              default:
                break
            }
          } else {
            sums[index] = '-'
          }
        })
        return sums
      },

      /** 导出按钮操作 */
      handleExport() {
        this.openExport = true;
        var data = this.sheduleList; // 这里面是数据列表
        const column = [
          { title: "模号", dataIndex: "moduleNo" },
          { title: "件号", dataIndex: "pieceNo" },
          { title: "版本", dataIndex: "versionNo" },
          { title: "品名", dataIndex: "pinName" },
          { title: "规格(长)", dataIndex: "length" },
          { title: "规格(宽)", dataIndex: "width" },
          { title: "规格(高)", dataIndex: "height" },
          { title: "数量", dataIndex: "quantity" },
          { title: "材质", dataIndex: "material" },
          { title: "硬度", dataIndex: "hardness" },
          { title: "投单类型", dataIndex: "processingContent" },
          { title: "投单原因", dataIndex: "orderReason" },
          { title: "生产单号", dataIndex: "prodOrderNo" },
          { title: "加工成本", dataIndex: "processingCost" },
          { title: "材料成本", dataIndex: "materialCost" },
          { title: "管理成本", dataIndex: "managementCost" },
          { title: "刀具成本", dataIndex: "toolCost" },
          { title: "电极成本", dataIndex: "electrodeCost" },
          { title: "总成本", dataIndex: "totalCost" },
        ];
        const instance = new ElMapExportTable(
          { column, data },
          { progress: progress => this.percentage = progress },// 进度条回调
        );
        instance.download("工件列表").then((data) => {
          this.openExport = false
        }); // 导出的文件名
      },

    }
  };
</script>

