<template>
  <div class="app-container">
    <el-card>
      <el-form :model="queryParams" ref="queryForm" :inline="true">
        <el-row>
          <el-form-item label="派工单号：" prop="prodOrderNo">
            <el-input
              v-model="queryParams.dispatchOrderNo"
              placeholder="请输入派工单号"
              clearable
              size="small"
              style="width: 220px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="关注人：" prop="followerName">
            <el-input
              v-model="queryParams.followerName"
              placeholder="请输入关注人姓名"
              clearable
              size="small"
              style="width: 220px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item>
            <el-button style="margin-left: 10px" type="primary" icon="el-icon-search" size="mini" @click="handleQuery"></el-button>
          </el-form-item>
        </el-row>
      </el-form>
    </el-card>
    <div>
      <el-table v-if="refreshTable" v-loading="loading" :data="sheduleList" border max-height="800px"
                @selection-change="handleSelectionChange" highlight-current-row>
        <el-table-column type="index" width="50" fixed/>
        <el-table-column type="selection" align="center" fixed :selectable="selected"/>
        <el-table-column label="派工单号" align="center" prop="dispatchOrderNo" fixed/>
        <el-table-column label="模号" align="center" prop="moduleNo" fixed/>
        <el-table-column label="客户代码" align="center" prop="customerCode" fixed/>
        <el-table-column label="客户名称" align="center" prop="customerName"  fixed/>
        <el-table-column label="客户订单号" align="center" prop="customerOrderNo" :show-overflow-tooltip="true" fixed/>
        <el-table-column label="投单人员" align="center" prop="investor" fixed/>
        <el-table-column label="投单类型" align="center" prop="processingContent" fixed/>
        <el-table-column label="投单性质" align="center" prop="orderNature"/>
        <el-table-column label="投单日期" align="center" prop="orderDate" />
        <el-table-column label="需求日期" align="center" prop="demandDate" :show-overflow-tooltip="true"/>
        <el-table-column label="工件类型" align="center" prop="workpieceTypeName" />
        <el-table-column label="工时完成比例" align="center" prop="processingProgress" width="200px">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="黄色代表交期异常，红色代表进度缓慢，绿色代表进度正常" placement="top-start">
              <div v-if="Number(scope.row.theoreticalProgress) < 0">
                <el-progress status="warning" :text-inside="true" :stroke-width="20" :percentage="Number(scope.row.processingProgress)"></el-progress>
              </div>
              <div v-if="Number(scope.row.theoreticalProgress) > scope.row.processingProgress && scope.row.processingProgress !== 100">
                <el-progress status="exception" :text-inside="true" :stroke-width="20" :percentage="Number(scope.row.processingProgress)"></el-progress>
              </div>
              <div v-if="(Number(scope.row.theoreticalProgress) <= scope.row.processingProgress && Number(scope.row.theoreticalProgress)>0) || scope.row.processingProgress === 100">
                <el-progress status="success" :text-inside="true" :stroke-width="20" :percentage="Number(scope.row.processingProgress)"></el-progress>
              </div>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="总工时" align="center" prop="totalManHours"/>
        <el-table-column label="剩余工时" align="center" prop="remainingWork"/>
        <el-table-column label="工时分布" align="center">
          <el-table-column label="G" align="center" prop="g"/>
          <el-table-column label="EDM" align="center" prop="edm"/>
          <el-table-column label="WE" align="center" prop="we"/>
          <el-table-column label="CNC" align="center" prop="cnc"/>
          <el-table-column label="HNC" align="center" prop="hnc"/>
          <el-table-column label="M" align="center" prop="m"/>
        </el-table-column>
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
      <div align="center">
        <el-button size="small" type="danger" icon="el-icon-star-on" @click="handleSpecialAttention">取消关注</el-button>
      </div>
    </div>
  </div>
</template>

<script>
  import {
    delProdScheduleFollow,
    exportProdSchedule, getProdScheduleFollowPage,
    getProdSchedulePage,
    saveProdScheduleFollow
  } from "../../../api/follow/recording";
  import {getProdWorkOperationHisPage} from "../../../api/production/taskStation";
  import global from '../../../store/global.js';
  import { ElMapExportTable } from "table-excel";
  import {listProcess} from "../../../api/system/process";
  import {delProdDispatchFollow, getProdDispatchFollowPage} from "../../../api/follow/orderRecord";

  export default {
    name: "SpecialAttention",
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
        // 生产进度表格数据
        sheduleList: [],
        //选中数组
        attentionIds:'',
        // 查询参数
        queryParams: {
          pageNo: 1,
          pageSize: 10,
        },
        // 查询参数
        queryParamsExport: {
          pageNo: 1,
          pageSize: 10,
        },
        // 查询参数
        queryParamsSpecial: {
          pageNo: 1,
          pageSize: 10,
        },
        //进度查询表单校验
        rules: {}
      };
    },
    created() {
      this.getList();
      this.getListProcess();
    },
    methods: {
      /** 分页查询特别关注列表 */
      getList() {
        this.loading = true;
        getProdDispatchFollowPage(this.queryParams).then(response => {
          this.sheduleList = response.data.records;
          this.total = response.data.total;
          this.loading = false;
        });
      },
      // 多选框选中数据
      handleSelectionChange(selection) {
        this.attentionIds = selection.map(item => item.followId)
        this.single = selection.length!=1
        this.multiple = !selection.length
      },
      /** 搜索按钮操作 */
      handleQuery() {
        this.queryParams.pageNo = 1;
        this.getList();
      },
      /** 取消特别关注按钮 */
      handleSpecialAttention() {
        this.loading = true;
        this.queryParamsSpecial.ids = this.attentionIds
        delProdDispatchFollow(this.queryParamsSpecial).then(res => {
          this.$modal.msgSuccess("取消特别关注成功")
          this.getList()
          this.loading = false;
        })
        setTimeout(()=>{
          this.loading=false   //点击一次时隔五秒后才能再次点击
        },3000)
      },
      /** 多选框禁选 */
      selected(row,index){
        if (row.state === '0') {
          return false //不可勾选
        } else {
          return true; //可勾选
        }
      },
    }
  };
</script>

<style scoped>
  .green-color{
    background: #98FB98;
  }
  .red-color{
    background: #F08080;
    color: #FFFFFF;
  }
  .gray-color{
    background: #B8B8B8;
    color: #FFFFFF;
  }
</style>
