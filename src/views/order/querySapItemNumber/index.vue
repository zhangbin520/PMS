<template>
  <div class="app-container">
    <div slot="header">
      <el-form :model="queryParams" ref="queryForm" v-show="true" :inline="true"  label-width="90px">
        <el-form-item label="接单日期" prop="orderDate">
          <el-input
            v-model="queryParams.orderDate"
            placeholder="请输入接单日期"
            clearable
            size="small"
            style="width: 220px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="需求日期" prop="demandDate">
          <el-input
            v-model="queryParams.demandDate"
            placeholder="请输入需求日期"
            clearable
            size="small"
            style="width: 220px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="客户名称" prop="customerName">
          <el-input
            v-model="queryParams.customerName"
            placeholder="请输入客户名称"
            clearable
            size="small"
            style="width: 220px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="客户订单号" prop="customerOrderNo">
          <el-input
            v-model="queryParams.customerOrderNo"
            placeholder="请输入客户订单号"
            clearable
            size="small"
            style="width: 220px"
            @keyup.enter.native="handleQuery"
          />
          <template> %</template>
        </el-form-item>
        <el-form-item label="客户料号" prop="customerItemNo">
          <el-input
            v-model="queryParams.customerItemNo"
            placeholder="请输入客户料号"
            clearable
            size="small"
            style="width: 220px"
            @keyup.enter.native="handleQuery"
          />
          <template> %</template>
        </el-form-item>
        <el-form-item label="类别" prop="category">
          <el-input
            v-model="queryParams.category"
            placeholder="请输入类别"
            clearable
            size="small"
            style="width: 220px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-input
            v-model="queryParams.type"
            placeholder="请输入类型"
            clearable
            size="small"
            style="width: 220px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="SAP料号" prop="sapItemNo">
          <el-input
            v-model="queryParams.sapItemNo"
            placeholder="请输入SAP料号"
            clearable
            size="small"
            style="width: 220px"
            @keyup.enter.native="handleQuery"
          />
          <template> %</template>
        </el-form-item>
        <el-form-item v-loading="loading" style="padding-left: 35px">
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
          <el-button type="warning" plain icon="el-icon-download" size="mini" style="margin-bottom: 10px" @click="handleExport">导出</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-row>
      <el-col :span="24">
        <el-table ref="multipleTable" v-loading="loading" :data="sapList"
                  max-height="750px" border highlight-current-row>
          <el-table-column label="创建时间" align="center" sortable prop="createTime"  />
          <el-table-column label="接单日期" align="center" sortable prop="orderDate">
            <template slot-scope="scope">
              {{scope.row.orderDate | format}}
            </template>
          </el-table-column>
          <el-table-column label="需求日期" align="center" sortable prop="demandDate">
            <template slot-scope="scope">
              {{scope.row.demandDate | format}}
            </template>
          </el-table-column>
          <el-table-column label="客户名称" align="center" sortable prop="customerName" :show-overflow-tooltip="true" />
          <el-table-column label="需求人" align="center" sortable prop="demander"  />
          <el-table-column label="客户订单号" align="center" sortable prop="customerOrderNo"  />
          <el-table-column label="客户料号" align="center" sortable prop="customerItemNo" />
          <el-table-column label="类别" align="center" sortable prop="category" />
          <el-table-column label="类型" align="center" sortable prop="type"/>
          <el-table-column label="机种" align="center" sortable prop="typeOfMachine"/>
          <el-table-column label="SAP料号ID" align="center" prop="id"/>
          <el-table-column label="SAP料号" align="center" sortable prop="sapItemNo"/>
          <el-table-column label="品名" align="center" sortable prop="pinName"/>
          <el-table-column label="接单数量" align="center" sortable prop="quantity"/>
          <el-table-column label="接单金额" align="center" sortable prop="money"/>
          <el-table-column label="是否已被使用" prop="status" sortable align="center" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.status === '0'" type="danger">否</el-tag>
              <el-tag v-if="scope.row.status === '1'">是</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="备注" align="center" sortable prop="remark"/>
        </el-table>
        <div align="center">
          <pagination
            v-show="total>0"
            :total="total"
            :page.sync="queryParams.pageNo"
            :limit.sync="queryParams.pageSize"
            :page-sizes=[10,20,30,50,this.total]
            @pagination="getListSap"
          />
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {
  delBatchOrderBomSapItem,
  exportSapItemNumber,
  getOrderBomSapItemPage,
  saveOrUpdateOrderBomSapItem
} from '@/api/order/sapItemNumber'
import { getUserProfile } from '@/api/system/user'
import { listContact, listCustomer } from '@/api/system/customer'
import { getToken } from '@/utils/auth'
import global from '@/store/global'
import { ElMapExportTable } from 'table-excel'



export default {
  name: 'sapItemNumber',
  data(){
    return {
      // 遮罩层
      loading: false,
      // 总条数
      total: 0,
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 查询参数
      queryParams: {
        pageNo: 1,
        pageSize: 10,
      },
      // 查询参数
      queryParamsCustomer: {
        pageNo: 1,
        pageSize: 100000,
      },
      // sap料号表格数据
      sapList: [],
      //客户资料数据
      customerFororder:[],
      //上传参数
      upload: {
        // 是否显示弹出层
        open: false,
        // 弹出层标题
        title: "",
        // 是否禁用上传
        isUploading: false,
        // 是否更新已经存在的用户数据
        updateSupport: 0,
        // 设置上传的请求头部
        headers: { Authorization: "Bearer " + getToken() },
        // 上传的地址
        url: process.env.VUE_APP_BASE_API + "/order/sap/importOrderBomSapItem",
      },
      // 导入
      fileList: [],
      //选中数组
      Ids:[],
      // 表单参数
      form: {},
      customerForm:{},
      //
      open: false,
      open2: false,
      customerIdForm:[],
      customerId:'',
      // 是否显示弹出层
      openExport: false,
      //订单BOM表单校验
    }
  },
  created() {
    this.getListSap();
    this.getListUser();
    this.getListCustomer()
  },

  filters:{
    format(value){
      if (value == undefined){
        value = ''
      }else {
        // console.log(value)
        var date = new Date(parseInt(value));
        var tt = [date.getFullYear(), date.getMonth()+1, date.getDate()].join('-') ;
        return tt;
      }
    }
  },

  methods:{
    /** 分页查看SAP料号 */
    getListSap(){
      this.loading = true
      setTimeout(()=>{
        this.loading = false
      },3000)
      getOrderBomSapItemPage(this.queryParams).then(response => {
        this.sapList = response.data.records;
        this.sheduleList = response.data.records;
        // console.log(this.sheduleList)
        // console.log(this.sapList.orderDate)
        // let date = new Date(this.sapList.orderDate)
        // console.log(date)
        // this.sapList.orderDate = this.formatDate(date, 'yyyy-MM-dd')
        this.total = response.data.total;
        this.loading = false;
      });
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNo = 1;
      if (this.queryParams.sapItemNo == ''){
        delete this.queryParams.sapItemNo
      }
      if (this.queryParams.category == ''){
        delete this.queryParams.category
      }
      if (this.queryParams.type == ''){
        delete this.queryParams.type
      }
      if (this.queryParams.customerName == ''){
        delete this.queryParams.customerName
      }
      if (this.queryParams.customerOrderNo == ''){
        delete this.queryParams.customerOrderNo
      }
      if (this.queryParams.customerItemNo == ''){
        delete this.queryParams.customerItemNo
      }
      this.getListSap()
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
      // console.log(this.customerFororder)
    },

    /** 时间戳转换 */
    formatDate(date, fmt) {
      if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
      }
      let o = {
        'M+': date.getMonth() + 1,
        'd+': date.getDate(),
        'h+': date.getHours(),
        'm+': date.getMinutes(),
        's+': date.getSeconds()
      }
      for (let k in o) {
        if (new RegExp(`(${k})`).test(fmt)) {
          let str = o[k] + ''
          fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : this.padLeftZero(str))
        }
      }
      return fmt
    },
    padLeftZero(str) {
      return ('00' + str).substr(str.length)
    },
    /** 导出按钮操作 */
    handleExport() {
      this.openExport = true;
      for (let i = 0;i < this.sheduleList.length;i++){
        let date = new Date(this.sheduleList[i].demandDate)
        this.sheduleList[i].demandDate = this.formatDate(date, 'yyyy-MM-dd')
        let date2 = new Date(this.sheduleList[i].orderDate)
        this.sheduleList[i].orderDate = this.formatDate(date2, 'yyyy-MM-dd')
        if (this.sheduleList[i].orderDate == 'NaN-aN-aN'|| this.sheduleList[i].orderDate == null){
          this.sheduleList[i].orderDate = ''
        }
        if (this.sheduleList[i].demandDate == 'NaN-aN-aN'|| this.sheduleList[i].demandDate == null){
          this.sheduleList[i].demandDate = ''
        }
      }
      // console.log(this.sheduleList)
      var data = this.sheduleList; // 这里面是数据列表

      const column = [
        { title: "SAP料号ID", dataIndex: "id" },
        { title: "客户编号", dataIndex: "customerCode" },
        { title: "客户名称", dataIndex: "customerName" },
        { title: "客户订单号", dataIndex: "customerOrderNo" },
        { title: "SAP料号", dataIndex: "sapItemNo" },
        { title: "接单日期", dataIndex: "orderDate" },
        { title: "需求日期", dataIndex: "demandDate" },
        { title: "客户料号", dataIndex: "customerItemNo" },
        { title: "需求人", dataIndex: "demander" },
        { title: "机种", dataIndex: "typeOfMachine" },
        { title: "类别", dataIndex: "category" },
        { title: "类型", dataIndex: "type" },
        { title: "品名", dataIndex: "pinName" },
        { title: "备注", dataIndex: "remark" },
        { title: "数量", dataIndex: "quantity" },
        { title: "金额", dataIndex: "money" },
        { title: "是否已被使用（0否 1是）", dataIndex: "status" },
      ];
      const instance = new ElMapExportTable(
        { column,
          data ,
          setCellFormat: ({ data, rowIndex, columnIndex, type }) => {
            if (columnIndex === 5 || columnIndex === 6) {
              return {
                numFmt: "yyyy-mm-dd",
              };
            }
          },
        },
        { progress: progress => this.percentage = progress },// 进度条回调
      );
      instance.download("SAP料号列表").then((data) => {
        this.openExport = false
      }); // 导出的文件名
      this.getListSap()
    },
  }
}
</script>

