<template>
  <div class="app-container">
    <el-card>
      <el-form :model="queryParams" ref="queryForm" :inline="true">
        <el-row>
          <el-form-item label="整套出货：" prop="followerName">
            <el-select v-model="queryParams.completeDelivery" clearable placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
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
          <el-form-item>
            <el-button style="margin-left: 10px" type="primary" icon="el-icon-search" size="mini" @click="handleQuery"></el-button>
            <el-button style="margin-left: 10px" type="danger" size="mini" @click="handleSave" :disabled="queryDisabled">保存</el-button>
          </el-form-item>
        </el-row>
      </el-form>
    </el-card>
    <div>
      <el-table v-if="refreshTable" v-loading="loading" :data="queryList" border max-height="800px"
                @selection-change="handleSelectionChange"  highlight-current-row>
        <el-table-column type="selection" align="center"/>
        <el-table-column type="index" width="50"/>
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
        <el-table-column label="出货数量" align="center" prop="shipmentQuantity">
          <template slot-scope="scope">
            <el-input type="text" v-model="scope.row.shipmentQuantity" v-show="isEditor" @change="handleEditShip(scope.row)"/>
            <span v-show="!isEditor">{{scope.row.shipmentQuantityTwo}}</span>
          </template>
        </el-table-column>
        <el-table-column label="是否整套" align="center" prop="completeDelivery"/>
        <el-table-column label="出货类型" align="center" prop="shipmentType"/>
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
  </div>
</template>

<script>
  import global from '../../../store/global.js';
  import { ElMapExportTable } from "table-excel";
  import {bookEntry, getOrderBomShipmentPage, saveShipment, updateShipmentQuantity} from "../../../api/output/shipment";

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
        isEditor:true,
        //是否整套交货
        options:[{
          value:'Y',
          label:'Y',
        },{
          value:'N',
          label:'N',
        }],
        //保存选中数据
        detailId:[],
        shipmentQuantity:[],
        //出货保存按钮禁止
        queryDisabled:false,
        //出货查询缓存数组
        cacheQuery:[],
        // 查询参数
        queryParams: {
          pageNo: 1,
          pageSize: 10,
        },
        // 查询参数
        queryParamsQuery: {
          pageNo: 1,
          pageSize: 10,
        },
        //进度查询表单校验
        rules: {}
      };
    },
    created() {

    },
    methods: {
      /** 分页查询生产进度列表 */
      getList() {
        this.cacheQuery = []
        getOrderBomShipmentPage(this.queryParams).then(response => {
          for (var i=0;i<response.data.records.length;i++){
            this.cacheQuery.push(response.data.records[i])
          }
          this.queryList = this.cacheQuery;
          this.total = response.data.total;
        });
      },
      // 多选框选中数据
      handleSelectionChange(selection) {
        this.detailId = selection.map(item => item.detailId)
        this.single = selection.length!=1
        this.multiple = !selection.length
      },
      /** 搜索按钮操作 */
      handleQuery() {
        this.queryParams.pageNo = 1;
        this.getList()
      },
      /** 保存 */
      handleSave() {
        this.queryDisabled = true
        setTimeout(() =>{
          this.queryDisabled = false
        },2000)
        if (this.detailId.length !== 0){
          const ids = this.detailId
          saveShipment({'ids':ids}).then(res =>{
            this.$modal.msgSuccess("出货成功")
            this.queryList = []
          })
        }else if (this.detailId.length == 0){
          this.$modal.msgError("请选择要出货的生产单号")
        }
      },
      /** 修改出货数量 */
      handleEditShip(row) {
        const id = row.detailId
        const shipmentQuantity = row.shipmentQuantity
        updateShipmentQuantity({'id':id,'shipmentQuantity':shipmentQuantity}).then(res => {
           if(res.code === 200){
             this.isEditor = false
             this.$modal.msgSuccess("修改出货数量成功")
             this.getList()
           }else {
             this.$modal.msgError("修改出货数量失败")
             this.getList()
           }
        })
      },

    }
  };
</script>
