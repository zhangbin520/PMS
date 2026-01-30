<template>
  <div class="app-container">
    <div slot="header">
      <el-form :model="queryParams" ref="queryForm" v-show="true" :inline="true"  label-width="90px">
        <el-form-item label="派工单号" prop="dispatchOrderNo">
          <el-input
            v-model="queryParams.dispatchOrderNo"
            placeholder="请输入派工单号"
            clearable
            size="small"
            style="width: 220px"
            @clear="() => { queryParams.dispatchOrderNo = null }"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="模号" prop="moduleNo">
          <el-input
            v-model="queryParams.moduleNo"
            placeholder="请输入模号"
            clearable
            size="small"
            style="width: 220px"
            @clear="() => { queryParams.moduleNo = null }"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="件号" prop="pieceNo">
          <el-input
            v-model="queryParams.pieceNo"
            placeholder="请输入件号"
            clearable
            size="small"
            style="width: 220px"
            @clear="() => { queryParams.pieceNo = null }"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="生产单号 " prop="prodOrderNo">
          <el-input
            v-model="queryParams.prodOrderNo"
            placeholder="请输入生产单号 "
            clearable
            size="small"
            style="width: 220px"
            @clear="() => { queryParams.prodOrderNo = null }"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="原始单号" prop="originalProdOrderNo">
          <el-input
            v-model="queryParams.originalProdOrderNo"
            placeholder="请输入原始单号"
            clearable
            size="small"
            style="width: 220px"
            @clear="() => { queryParams.originalProdOrderNo = null }"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="任务单号" prop="taskNumber">
          <el-input
            v-model="queryParams.taskNumber"
            placeholder="请输入任务单号"
            clearable
            size="small"
            style="width: 220px"
            @clear="() => { queryParams.taskNumber = null }"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="工序" prop="sort">
          <el-input
            v-model="queryParams.sort"
            placeholder="请输入工序"
            clearable
            size="small"
            style="width: 220px"
            @clear="() => { queryParams.sort = null }"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="材质" prop="material">
          <el-input
            v-model="queryParams.material"
            placeholder="请输入材质"
            clearable
            size="small"
            style="width: 220px"
            @clear="() => { queryParams.material = null }"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="刀具型号" prop="toolName">
          <el-input
            v-model="queryParams.toolName"
            placeholder="请输入刀具型号"
            clearable
            size="small"
            style="width: 220px"
            @clear="() => { queryParams.toolName = null }"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="刀具品牌" prop="bands">
          <el-input
            v-model="queryParams.bands"
            placeholder="请输入刀具品牌"
            clearable
            size="small"
            style="width: 220px"
            @clear="() => { queryParams.bands = null }"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="是否发送" prop="sendStatus">
          <el-select v-model="queryParams.sendStatus" filterable placeholder="请选择" clearable style="width: 150px" @clear="() => { queryParams.sendStatus = null }" @change="handleQuery">
            <el-option
              v-for="item in statusTask"
              :key="item.status"
              :label="item.name"
              :value="item.status">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-loading="loading" style="padding-left: 35px">
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-row>
      <el-col :span="24">
        <el-table ref="multipleTable" v-loading="loading" :data="toolOrderList" @selection-change="handleSelectionChange" max-height="750px" border highlight-current-row>
          <el-table-column type="selection" width="50" align="center" />
          <el-table-column label="派工单号" align="center" sortable prop="dispatchOrderNo"  />
          <el-table-column label="来源" align="center" width="70" sortable prop="datasource">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.datasource === '0'">钢件</el-tag>
              <el-tag v-if="scope.row.datasource === '1'" type="danger">电极</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="模号" align="center" sortable prop="moduleNo" />
          <el-table-column label="件号" align="center" width="70" sortable prop="pieceNo" />
          <el-table-column label="生产单号" align="center" sortable prop="prodOrderNo" :show-overflow-tooltip="true" />
          <el-table-column label="原始单号" align="center" sortable prop="originalProdOrderNo"  />
          <el-table-column label="任务单号" align="center" sortable prop="taskNumber"  />
          <el-table-column label="工序" align="center" width="50" sortable prop="sort" />
          <el-table-column label="工段" align="center" width="70" sortable prop="code" />
          <el-table-column label="工序完成状态" align="center" sortable prop="designStatus">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.designStatus === 0">待领取</el-tag>
            <el-tag v-if="scope.row.designStatus === 1">已领取</el-tag>
            <el-tag v-if="scope.row.designStatus === 2">已开始</el-tag>
            <el-tag v-if="scope.row.designStatus === 3">已暂停</el-tag>
            <el-tag v-if="scope.row.designStatus === 4">已完成</el-tag>
            <el-tag v-if="scope.row.designStatus === 5">已放弃</el-tag>
            <el-tag v-if="scope.row.designStatus === 6">订单已暂停</el-tag>
            <el-tag v-if="scope.row.designStatus === 7">订单已放弃</el-tag>
          </template>
          </el-table-column>
          <el-table-column label="数量" align="center" width="50" sortable prop="quantity"/>
          <el-table-column label="材质" align="center" width="50" prop="material"/>
          <el-table-column label="刀具料号" align="center" sortable prop="itemNo"/>
          <el-table-column label="使用频率" align="center" sortable prop="pinName" v-if="false"/>
          <el-table-column label="刀具型号" align="center" sortable prop="toolName"/>
          <el-table-column label="刀具品牌" align="center" sortable prop="bands"/>
          <el-table-column label="发送日期" align="center" sortable prop="sendTime"/>
          <el-table-column label="是否发送" prop="sendStatus" sortable align="center" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.sendStatus === '0'" type="danger">否</el-tag>
              <el-tag v-if="scope.row.sendStatus === '1'">是</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="禁止发送" prop="isSend" sortable align="center" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.isSend === '0'" type="danger">否</el-tag>
              <el-tag v-if="scope.row.isSend === '1'">是</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="创建日期" align="center" sortable prop="createTime"/>
          <el-table-column label="状态" align="center" sortable prop="status">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.status === '0'" type="danger">未发送</el-tag>
              <el-tag v-if="scope.row.status === '1'">已发送</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作人员" align="center" sortable prop="opUser"/>
          <el-table-column label="操作" align="center" class-name="small-padding">
            <template slot-scope="scope">
              <el-tooltip class="item" effect="dark" content="发送/重新发送" placement="top-start">
                <el-button
                  type="success"
                  circle
                  icon="el-icon-s-promotion"
                  @click="toolsend(scope.row)"
                ></el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="禁止发送" placement="top-start">
                <el-button
                  type="danger"
                  circle
                  icon="el-icon-minus"
                  @click="prohibitTool(scope.row)"
                ></el-button>
              </el-tooltip>
              </template>
          </el-table-column>
        </el-table>
        <div align="center">
          <pagination
            v-show="total>0"
            :total="total"
            :page.sync="queryParams.pageNo"
            :limit.sync="queryParams.pageSize"
            :page-sizes=[10,20,30,50,this.total]
            @pagination="getOrderTool"
          />
          <el-row style="margin-top: 30px">
            <el-button
              size="mini"
              round
              type="primary"
              icon="el-icon-check"
              :disabled="multiple"
              @click="handleSend"
            >批量发送</el-button>
            <el-button
              size="mini"
              round
              style="background-color: #FF8294;color: #ffffff"
              icon="el-icon-delete"
              :disabled="multiple"
              @click="handleDelete"
            >批量禁止发送</el-button>
          </el-row>
        </div>
      </el-col>
    </el-row>

  </div>
</template>

<script>
import { ElMapExportTable } from 'table-excel'
import { cncToolsend, getOrderToolCostReordPage, prohibit } from '@/api/cncTool/queryTools'
import { delOrderToolCostBrand } from '@/api/cncTool/toolBrand'



export default {
  name: 'queryTools',
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
      // 刀具管理表格数据
      toolOrderList: [],
      // 表单参数
      form: {},
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
      //首末工序查询
      statusTask:[{
        status: '0',
        name: "否"
      },{
        status: '1',
        name: "是"
      }],
    }
  },
  created() {
    this.getOrderTool();
  },

  methods:{
    /** 分页查看刀具管理 */
    getOrderTool(){
      this.loading = true
      setTimeout(()=>{
        this.loading = false
      },3000)
      getOrderToolCostReordPage(this.queryParams).then(response => {
        this.toolOrderList = response.data.records;
        this.total = response.data.total;
        this.loading = false;
      });
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNo = 1;
      this.getOrderTool()
    },

    /** 发送按钮操作 */
    toolsend(row) {
      const array =[]
      array[0] = row.id
      cncToolsend({'ids': array}).then(response => {
        if (response.data == true)
        this.$modal.msgSuccess("发送成功");
        this.loading = false;
      });
      this.getOrderTool()
    },

    /** 禁止按钮操作 */
    prohibitTool(row){
      const array =[]
      array[0] = row.id
      prohibit({'ids': array}).then(response => {
        if (response.data == true)
          this.$modal.msgSuccess("禁止发送成功");
        this.loading = false;
      });
      this.getOrderTool()
    },

    /** 批量发送按钮操作 */
    handleSend(row) {
      // 先获取复选框选中的ID
      const ids = row.id || this.ids // 数组[1,2,3]
      const customerCode = this.bands;
      this.$modal.confirm('是否确认发送刀具品牌为"' + customerCode + '"的数据项？').then(function() {
        return cncToolsend({'ids':ids});
      }).then(() => {
        this.getOrderTool();
        this.$modal.msgSuccess("发送成功");
      }).catch(() => {});
    },

    /** 批量发送按钮操作 */
    handleDelete(row) {
      // 先获取复选框选中的ID
      const ids = row.id || this.ids // 数组[1,2,3]
      const customerCode = this.bands;
      this.$modal.confirm('是否确认禁止发送刀具品牌为"' + customerCode + '"的数据项？').then(function() {
        return prohibit({'ids':ids});
      }).then(() => {
        this.getOrderTool();
        this.$modal.msgSuccess("禁止发送成功");
      }).catch(() => {});
    },

    // 多选框选中数据
    handleSelectionChange(selection) {
      this.single = selection.length!=1
      this.bands = selection.map(item => item.bands);
      this.multiple = !selection.length
      this.ids = selection.map(item => item.id)
    },
  }
}
</script>

