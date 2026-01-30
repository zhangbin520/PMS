<template>
  <div class="app-container">
    <el-card>
      <el-form :model="queryParams" ref="queryForm" :inline="true">
        <el-row>
          <el-form-item label="客户：" prop="customerName">
            <el-select v-model="queryParams.customerName" filterable clearable placeholder="请选择">
              <el-option
                v-for="item in optionsCustomer"
                :key="item.socialUnifiedCreditCode"
                :label="item.corporateName"
                :value="item.corporateName">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="派工单号：" prop="dispatchOrderNo">
            <el-input
              v-model="queryParams.dispatchOrderNo"
              placeholder="请输入生产单号"
              clearable
              size="small"
              style="width: 220px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="模号：" prop="customerItemNo">
            <el-input
              v-model="queryParams.customerItemNo"
              placeholder="请输入生产单号"
              clearable
              size="small"
              style="width: 220px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="件号：" prop="pieceNo">
            <el-input
              v-model="queryParams.pieceNo"
              placeholder="请输入生产单号"
              clearable
              size="small"
              style="width: 220px"
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
          <el-form-item label="发送OA：" prop="oa">
            <el-select v-model="queryParams.oa" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="立账日期：" prop="accountEstablishmentDates">
            <el-date-picker
              v-model="queryParams.accountEstablishmentDates"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="出货类型：" prop="shipmentType">
            <el-select v-model="queryParams.shipmentType" clearable placeholder="请选择">
              <el-option
                v-for="item in outOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="整套出货：" prop="completeDelivery">
            <el-select v-model="queryParams.completeDelivery" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="添加人员：" prop="createName">
            <el-select v-model="queryParams.createName" filterable clearable placeholder="请选择">
              <el-option
                v-for="item in optionsPerson"
                :key="item.jobNo"
                :label="item.name"
                :value="item.name">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="对接SAP：" prop="sap">
            <el-select v-model="queryParams.sap" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button style="margin-left: 10px" type="primary" icon="el-icon-search" size="mini" @click="handleQuery"></el-button>
            <el-button style="margin-left: 10px;background-color: #02C39A;color: white" size="mini" @click="handleOpenAccount">定账</el-button>
          </el-form-item>
        </el-row>
      </el-form>
    </el-card>
    <div>
      <el-table v-if="refreshTable" v-loading="loading" :data="queryList" border max-height="800px"
                @selection-change="handleSelectionChange" highlight-current-row>
        <el-table-column type="selection" align="center"/>
        <el-table-column type="index" width="50"/>
        <el-table-column label="操作" align="center" width="320px">
          <template slot-scope="scope">
            <el-button
              size="mini"
              round
              style="background-color: #6633cc;color: #ffffff"
              @click="handleEdit(scope.row)"
            >编辑</el-button>
            <el-button
              size="mini"
              round
              style="background-color: #ff3366;color: #ffffff"
              @click="handleQuit(scope.row)"
            >取消</el-button>
            <el-button
              size="mini"
              round
              style="background-color: #66ccff;color: #ffffff"
              @click="handleSendOa(scope.row)"
            >发送OA</el-button>
            <el-button
              size="mini"
              round
              style="background-color: #D15FEE;color: #ffffff"
            >发送SAP</el-button>
          </template>
        </el-table-column>
        <el-table-column label="出货单号" align="center" prop="shipmentOrderNo" width="110px"/>
        <el-table-column label="客户订单号" align="center" prop="customerOrderNo" width="110px"/>
        <el-table-column label="客户代码" align="center" prop="customerCode" width="130px"/>
        <el-table-column label="客户" align="center" prop="customerName"/>
        <el-table-column label="派工单号" align="center" prop="dispatchOrderNo"/>
        <el-table-column label="SAP料号" align="center" prop="customerItemNo" :show-overflow-tooltip="true"/>
        <el-table-column label="件号" align="center" prop="pieceNo" width="125px"/>
        <el-table-column label="生产单号" align="center" prop="prodOrderNo" width="125px"/>
        <el-table-column label="版次" align="center" prop="versionNo"/>
        <el-table-column label="打标" align="center" prop="marking" :show-overflow-tooltip="true"/>
        <el-table-column label="品名" align="center" prop="pinName" :show-overflow-tooltip="true"/>
        <el-table-column label="订单数量" align="center" prop="quantity" />
        <el-table-column label="出货数量" align="center" prop="shipmentQuantity"/>
        <el-table-column label="是否整套" align="center" prop="completeDelivery"/>
        <el-table-column label="出货类型" align="center" prop="shipmentType">
          <template slot-scope="scope">
            <span v-if="scope.row.shipmentType === '0'">全部出货</span>
            <span v-if="scope.row.shipmentType === '1'">部分出货</span>
          </template>
        </el-table-column>
        <el-table-column label="添加日期" align="center" prop="createTime" width="155px"/>
        <el-table-column label="立账日期" align="center" prop="accountEstablishmentDate" width="100px"/>
        <el-table-column label="添加人员" align="center" prop="createName"/>
        <el-table-column label="OA对接" align="center" prop="oa"/>
        <af-table-column label="计划/实际工时（每个工段得汇总）" align="center" prop="workHourSummary"/>
        <el-table-column label="备注" align="center" prop="remark" width="100px"/>
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
    </div>

    <!--    编辑弹窗-->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="出货数量" prop="shipmentQuantity">
          <el-input v-model="form.shipmentQuantity" placeholder="出货数量"/>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" placeholder="备注" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="open = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import global from '../../../store/global.js';
  import { ElMapExportTable } from "table-excel";
  import {bookEntry, getShipmentPage, shipmentCancel, shipmentEdit} from "../../../api/output/shipment";
  import {listCustomer} from "../../../api/system/customer";
  import {listPerson} from "../../../api/system/person";

  export default {
    name: "shipmentQuery",
    dicts: ['sys_normal_disable'],
    components:{ElMapExportTable},
    data() {
      return {
        // 遮罩层
        loading: false,
        // 重新渲染表格状态
        refreshTable: true,
        // 总条数
        total: 0,
        // 弹出层标题
        title: "",
        // 显示搜索条件
        showSearch: true,
        // 出货查询表格数据
        queryList: [],
        //编辑弹窗表单数据
        form:{},
        open:false,
        editId:'',
        //是否整套交货
        options:[{
          value:'Y',
          label:'Y',
        },{
          value:'N',
          label:'N',
        }],
        //出货类型
        outOptions:[{
          value:'0',
          label:'全部出货',
        },{
          value:'1',
          label:'部分出货',
        }],
        //客户信息数据
        optionsCustomer:[],
        //员工信息数据
        optionsPerson:[],
        //定账选中ID
        ids:[],
        // 查询参数
        queryParams: {
          pageNo: 1,
          pageSize: 10,
        },
        // 查询参数
        queryParamsSearch: {
          pageNo: 1,
          pageSize: 10000,
        },
        //进度查询表单校验
        rules: {}
      };
    },
    created() {
      this.getList();
      this.getListCustomer();
      this.getListPerson();
    },
    methods: {
      /** 分页查询出货列表 */
      getList() {
        this.loading = true;
        getShipmentPage(this.queryParams).then(response => {
          this.queryList = response.data.records;
          this.total = response.data.total;
          this.loading = false;
        });
      },
      /** 分页查询客户信息列表 */
      getListCustomer() {
        listCustomer(this.queryParamsSearch).then(response => {
          this.optionsCustomer = response.data.records;
        });
      },
      /** 分页查询员工信息列表 */
      getListPerson() {
        listPerson(this.queryParamsSearch).then(response => {
          this.optionsPerson = response.data.records;
        });
      },
      // 多选框选中数据
      handleSelectionChange(selection) {
        this.ids = selection.map(item => item.id)
        this.single = selection.length!=1
        this.multiple = !selection.length
      },
      /** 搜索按钮操作 */
      handleQuery() {
        this.queryParams.pageNo = 1;
        this.getList();
      },
      /** 编辑出货 */
      handleEdit(row) {
        this.open = true
        this.title = "编辑"
        this.editId = row.id
        this.form = row
      },
      submitForm() {
        const data = {
          id:this.editId,
          shipmentQuantity:this.form.shipmentQuantity,
          remark:this.form.remark
        }
        shipmentEdit(data).then(res =>{
          this.$modal.msgSuccess("编辑成功")
          this.open = false
          this.getList()
        })
      },
      /** 取消出货 */
      handleQuit(row) {
        const id = row.id
        shipmentCancel({'id':id}).then(res =>{
          this.$modal.msgSuccess("取消出货成功")
          this.getList()
        })
      },
      /** 发送OA */
      handleSendOa() {

      },
      /** 立账 */
      handleOpenAccount() {
        const ids = this.ids
        bookEntry({'ids':ids}).then(res =>{
          this.$modal.msgSuccess("定账成功")
          this.getList()
        })
      }
    }
  };
</script>
