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
          <el-button size="mini" type="primary" icon="el-icon-folder-add" @click="handleImport">导入SAP料号</el-button>
          <el-button type="warning" plain icon="el-icon-download" size="mini" style="margin-bottom: 10px" @click="handleExport">导出</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-row>
      <el-col :span="24">
        <el-table ref="multipleTable" v-loading="loading" :data="sapList" @selection-change="handleSelectionChange"
                  max-height="750px" border highlight-current-row>
          <el-table-column type="selection" width="50" align="center" />
          <el-table-column label="操作" align="center" class-name="small-padding">
            <template slot-scope="scope" v-if="scope.row.userId !== 1">
              <el-button
                size="mini"
                round
                type="primary"
                icon="el-icon-edit"
                @click="handleUpdate(scope.row)"
              >编辑</el-button>
            </template>
          </el-table-column>
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
          <el-table-column label="SAP料号ID" align="center" prop="id" v-if="true"/>
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
          <el-row style="margin-top: 30px">
            <el-button
              size="mini"
              round
              type="primary"
              icon="el-icon-check"
              @click="handleAdd"
            >新增SAP料号</el-button>
            <el-button
              size="mini"
              round
              style="background-color: #FF8294;color: #ffffff"
              icon="el-icon-delete"
              :disabled="multiple"
              @click="handleDelete"
            >删除</el-button>
          </el-row>
        </div>
      </el-col>
    </el-row>

    <!-- 导入对话框 -->
    <el-dialog :title="upload.title" :visible.sync="upload.open" width="400px" append-to-body>
      <el-upload
        ref="upload"
        :on-change="handlePreview"
        :limit="1"
        accept=".xlsx, .xls"
        :headers="upload.headers"
        :action="upload.url + '?bizType=1'"
        :disabled="upload.isUploading"
        :on-progress="handleFileUploadProgress"
        :on-success="handleFileSuccess"
        :auto-upload="false"
        :file-list="fileList"
        drag
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip text-center" slot="tip">
          <span>仅允许导入xls、xlsx格式文件。</span>
          <el-link type="primary" :underline="false" style="font-size:12px;vertical-align: baseline;" @click="importTemplate">下载模板</el-link>
        </div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFileForm">确 定</el-button>
        <el-button @click="upload.open = false">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 新增SAP -->
    <el-dialog title="新增SAP料号" :visible.sync="open" width="550px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="投单日期" prop="orderDate">
              <el-date-picker v-model="form.orderDate" type="date" placeholder="选择日期" value-format="yyyy-MM-dd" style="width: 100%"/>
            </el-form-item>
            <el-form-item label="需求日期" prop="demandDate">
              <el-date-picker v-model="form.demandDate" type="date" placeholder="选择日期" value-format="yyyy-MM-dd" style="width: 100%"/>
            </el-form-item>
        <el-form-item label="客户名称" prop="customerName">
          <el-select v-model="form.customerName" filterable placeholder="请选择" style="width: 100%">
            <el-option
              v-for="item in customerFororder"
              :key="item.socialUnifiedCreditCode"
              :label="item.corporateName"
              :value="[item.corporateName,item.socialUnifiedCreditCode]"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="需求人" prop="demander">
          <el-input v-model="form.demander" placeholder="请输入需求人" />
        </el-form-item>
        <el-form-item label="客户订单号" prop="customerOrderNo">
          <el-input v-model="form.customerOrderNo" placeholder="请输入客户订单号" />
        </el-form-item>
        <el-form-item label="客户料号" prop="customerItemNo">
          <el-input v-model="form.customerItemNo"  placeholder="请输入客户料号" />
        </el-form-item>
        <el-form-item label="类别" prop="category">
          <el-input v-model="form.category"  placeholder="请输入类别" />
        </el-form-item>
          </el-col>
          <el-col :span="12">
        <el-form-item label="类型" prop="type">
          <el-input v-model="form.type"  placeholder="请输入类型" />
        </el-form-item>
        <el-form-item label="机种" prop="typeOfMachine">
          <el-input v-model="form.typeOfMachine"  placeholder="请输入机种" />
        </el-form-item>
        <el-form-item label="SAP料号" prop="sapItemNo">
          <el-input v-model="form.sapItemNo"  placeholder="请输入SAP料号" />
        </el-form-item>
        <el-form-item label="品名" prop="pinName">
          <el-input v-model="form.pinName"  placeholder="请输入品名" />
        </el-form-item>
        <el-form-item label="接单数量" prop="quantity">
          <el-input v-model="form.quantity"  placeholder="请输入接单数量" />
        </el-form-item>
        <el-form-item label="接单金额" prop="money">
          <el-input v-model="form.money"  placeholder="请输入接单数量" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input type="textarea" v-model='form.remark'  placeholder="请输入备注"/>
        </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">保 存</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 修改SAP -->
    <el-dialog title="修改SAP料号" :visible.sync="open2" width="550px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="投单日期" prop="orderDate">
              <el-date-picker v-model="form.orderDate" type="date" placeholder="选择日期" value-format="yyyy-MM-dd" style="width: 100%"/>
            </el-form-item>
            <el-form-item label="需求日期" prop="demandDate">
              <el-date-picker v-model="form.demandDate" type="date" placeholder="选择日期" value-format="yyyy-MM-dd" style="width: 100%"/>
            </el-form-item>
        <el-form-item label="客户名称" prop="customerName">
          <el-select v-model="form.customerName" filterable placeholder="请选择" style="width: 100%">
            <el-option
              v-for="item in customerFororder"
              :key="item.socialUnifiedCreditCode"
              :label="item.corporateName"
              :value="[item.corporateName,item.socialUnifiedCreditCode]"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="需求人" prop="demander">
          <el-input v-model="form.demander" placeholder="请输入需求人" />
        </el-form-item>
        <el-form-item label="客户订单号" prop="customerOrderNo">
          <el-input v-model="form.customerOrderNo" placeholder="请输入客户订单号" />
        </el-form-item>
        <el-form-item label="客户料号" prop="customerItemNo">
          <el-input v-model="form.customerItemNo"  placeholder="请输入客户料号" />
        </el-form-item>
        <el-form-item label="类别" prop="category">
          <el-input v-model="form.category"  placeholder="请输入类别" />
        </el-form-item>
          </el-col>
          <el-col :span="12">
        <el-form-item label="类型" prop="type">
          <el-input v-model="form.type"  placeholder="请输入类型" />
        </el-form-item>

        <el-form-item label="机种" prop="typeOfMachine">
          <el-input v-model="form.typeOfMachine"  placeholder="请输入机种" />
        </el-form-item>
<!--        <el-form-item label="订单SAP料号ID(必填)" prop="id">-->
<!--          <el-input v-model="form.id"  placeholder="请输入订单SAP料号ID" />-->
<!--        </el-form-item>-->
        <el-form-item label="SAP料号" prop="sapItemNo">
          <el-input v-model="form.sapItemNo"  placeholder="请输入SAP料号" />
        </el-form-item>
        <el-form-item label="品名" prop="pinName">
          <el-input v-model="form.pinName"  placeholder="请输入品名" />
        </el-form-item>
        <el-form-item label="接单数量" prop="quantity">
          <el-input v-model="form.quantity"  placeholder="请输入接单数量" />
        </el-form-item>
        <el-form-item label="接单金额" prop="money">
          <el-input v-model="form.money"  placeholder="请输入接单数量" />
        </el-form-item>
            <el-form-item label="是否已被使用" prop="status">
<!--              <el-input v-model="form.status"  placeholder="请输入状态" />-->
              <el-select v-model="form.status" placeholder="请选择" style="width: 100%">
                <el-option
                  v-for="item in statusList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value + ''"
                ></el-option>
              </el-select>
            </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input type="textarea" v-model='form.remark'  placeholder="请输入备注"/>
        </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">保 存</el-button>
        <el-button @click="cancel2">取 消</el-button>
      </div>
    </el-dialog>

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
      //
      statusList:[
        {
          'value':0,
          'label':'否',
        },
        {
          'value':1,
          'label':'是',
        }
      ],
      //订单BOM表单校验
      rules: {
        // orderDate: [
        //   { required: true, message: "投单日期不能为空", trigger: "blur" },
        // ],
        // demandDate: [
        //   { required: true, message: "需求日期不能为空", trigger: "blur" },
        // ],
        // customerName: [
        //   { required: true, message: "客户名称不能为空", trigger: "blur" },
        // ],
        sapItemNo: [
          { required: true, message: "SAP料号不能为空", trigger: "blur" },
        ],
        money: [
          {
            pattern: /^[0-9]*$/,
            message: "请输入正确的金额",
            trigger: "blur"
          },
          { min: 0, max: 8, message: "金额长度不能大于8个字符", trigger: "blur"}
        ],
        demander: [
          {
            pattern: /^[a-zA-Z.\u4e00-\u9fa5]+$/,
            message: "请输入正确的需求人名称",
            trigger: "blur"
          }
        ],
        quantity: [
          {
            pattern: /^[0-9]*$/,
            message: "请输入正确的数量",
            trigger: "blur"
          },
          { min: 0, max: 10, message: "接单数量不能大于10个字符", trigger: "blur"}
        ],
      },
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
      // console.log(this.queryParams.sapItemNo)
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
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.single = selection.length!=1
      this.code = selection.map(item => item.customerOrderNo);
      this.multiple = !selection.length
      this.ids = selection.map(item => item.id)
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

    /** 导入SAP料号按钮操作 */
    handleImport() {
      this.upload.title = "SAP料号导入";
      this.upload.open = true;
    },

    /** 下载模板操作 */
    importTemplate() {
      exportSapItemNumber().then(response => {
        window.open(global.host+response.msg)
      });
    },
    // 文件上传中处理
    handleFileUploadProgress(event, file, fileList) {
      this.upload.isUploading = true;
    },
    // 文件上传成功处理
    handleFileSuccess(response, file, fileList) {
      this.upload.open = false;
      this.upload.isUploading = false;
      this.$refs.upload.clearFiles();
      this.$alert("<div style='overflow: auto;overflow-x: hidden;max-height: 70vh;padding: 10px 20px 0;'>" + response.msg + "</div>", "导入结果", { dangerouslyUseHTMLString: true });
      this.getListSap();
    },
    handlePreview(file,res) {
      this.queryParams.file = file.name
    },
    // 文件上传前
    beforeUpload(file){
      this.files = file;
    },
    // 提交上传文件
    submitFileForm(res) {
      this.$refs.upload.submit();
      this.getListSap()
    },

    /** 删除按钮操作 */
    handleDelete(row) {
      // 先获取复选框选中的ID
      const ids = row.id || this.ids // 数组[1,2,3]
      const customerCode = this.code;
      this.$modal.confirm('是否确认删除客户订单号为"' + customerCode + '"的数据项？').then(function() {
        return delBatchOrderBomSapItem({'ids':ids});
      }).then(() => {
        this.getListSap();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },

    // SAP料号表单重置
    reset() {
      this.form = {
        customerName: undefined,
        customerItemNo: undefined,
        customerOrderNo: undefined,
        originator: undefined,
      };
      // console.log(this.form)
      this.resetForm("form");
    },

    /** 新增SAP按钮 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "新增SAP料号";
    },

    /** 编辑SAP按钮 */
    handleUpdate(row) {
      let obj = {...row}
      let date = new Date(obj.demandDate)
      obj.demandDate = this.formatDate(date, 'yyyy-MM-dd')
      let date2 = new Date(obj.orderDate)
      obj.orderDate = this.formatDate(date2, 'yyyy-MM-dd')
      this.form = {...obj}
      console.log(this.form)
      if (this.form.orderDate == 'NaN-aN-aN'|| this.form.demandDate == null){
        this.form.orderDate = ''
      }
      if (this.form.demandDate == 'NaN-aN-aN' || this.form.demandDate == null){
        this.form.demandDate = ''
      }
      listCustomer({'corporateName':this.form.customerName}).then(response => {
        this.customerIdForm = response.data.records;
        this.form.customerCode = this.customerIdForm[0].socialUnifiedCreditCode
      });
      this.open2 = true;
    },

    /** 新增修改订单sap配置 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != undefined) {
            if (typeof this.form.customerName == 'object'){
              this.form.customerCode = this.form.customerName[1]
              this.form.customerName = this.form.customerName[0]
            }
            if (this.form.orderDate == 'NaN-aN-aN'|| this.form.demandDate == null){
              this.form.orderDate = ''
            }
            if (this.form.demandDate == 'NaN-aN-aN'|| this.form.demandDate == null){
              this.form.demandDate = ''
            }
            // console.log(this.form)
            saveOrUpdateOrderBomSapItem(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open2 = false;
              this.getListSap();
            });
          } else {
            // console.log(this.form.customerName)
            if (this.form.customerName !== undefined){
            this.form.customerCode = this.form.customerName[1]
            this.form.customerName = this.form.customerName[0]
            }
            // console.log(this.form)
            saveOrUpdateOrderBomSapItem(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getListSap();
            });
          }
        }
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
      this.getListSap()
    },
    // 取消按钮
    cancel2() {
      this.open2 = false;
      this.reset();
      this.getListSap()
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

