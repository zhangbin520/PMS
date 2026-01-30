<template>
  <div class="app-container">
    <el-card>
      <el-form :model="queryParams" ref="queryForm" :inline="true">
        <el-row>
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
          <el-form-item label="关注人：" prop="followerName">
            <!-- <el-input
              v-model="queryParams.followerName"
              placeholder="请输入关注人姓名"
              clearable
              size="small"
              style="width: 220px"
              @keyup.enter.native="handleQuery"
            /> -->
             <el-select v-model="queryParams.followerName" placeholder="请选择" style="width: 100%">
               <el-option
                 v-for="item in nameList"
                 :key="item.followerName"
                 :label="item.followerName"
                 :value="item.followerName"
               ></el-option>
             </el-select>
          </el-form-item>
          <el-form-item label="当前工段：" prop="currentSection">
            <el-select v-model="queryParams.currentSection" filterable placeholder="请选择" clearable>
              <el-option
                v-for="item in processFortask"
                :key="item.code"
                :label="item.code"
                :value="item.code">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button style="margin-left: 10px" type="primary" icon="el-icon-search" size="mini" @click="handleQuery"></el-button>
          </el-form-item>
         
        </el-row>
        <el-row>
        <el-form-item label="电极总数：" prop="electrodeTotal">
            <el-tag>{{ electrodeTotal }}</el-tag>
          </el-form-item>
        </el-row>
      </el-form>
    </el-card>
    <div>
      <el-table v-if="refreshTable" v-loading="loading" :data="sheduleList" border max-height="800px"
                @selection-change="handleSelectionChange" highlight-current-row>
        <el-table-column type="index" width="50" fixed/>
        <el-table-column type="selection" align="center" fixed :selectable="selected"/>
        <el-table-column label="操作" align="center" width="160" class-name="small-padding fixed-width" fixed>
          <template slot-scope="scope">
            <el-button
              size="mini"
              round
              type="primary"
              icon="el-icon-folder-opened"
              @click="handleViewFile(scope.row)"
            >查看图档</el-button>
          </template>
        </el-table-column>
        <el-table-column label="关注人" align="center" prop="followerName" width="110px" fixed/>
        <el-table-column label="派工单号" align="center" prop="dispatchOrderNo" width="110px" fixed/>
        <el-table-column label="模号" align="center" prop="moduleNo" width="130px" fixed/>
        <el-table-column label="件号" align="center" prop="pieceNo" fixed/>
        <el-table-column label="总质量" align="center" prop="quantitys" fixed/>
        <el-table-column label="电极号" align="center" prop="suffixs" fixed/>
        <el-table-column label="版次" align="center" prop="versionNo"  fixed/>
        <el-table-column label="品名" align="center" prop="pinName" :show-overflow-tooltip="true" fixed/>
        <el-table-column label="生产单号" align="center" prop="prodOrderNo" width="125px" fixed/>
        <el-table-column label="订单数量" align="center" prop="quantity" fixed/>
        <el-table-column label="产出数量" align="center" prop="outputQuantity"/>
        <el-table-column label="异常数量" align="center" prop="exceptionsQuantity" />
        <el-table-column label="需求日期" align="center" prop="demandDate" :show-overflow-tooltip="true"/>
        <el-table-column label="材质" align="center" prop="material" />
        <el-table-column label="完成比例" align="center" prop="completionRatio" width="200px">
          <template slot-scope="scope">
            <el-progress :text-inside="true" :stroke-width="20" :percentage="Number(scope.row.completionRatio)" :color="customColorMethod"></el-progress>
          </template>
        </el-table-column>
        <el-table-column label="总工时" align="center" prop="totalManHours"/>
        <el-table-column label="剩余工时" align="center" prop="remainWork"/>
        <af-table-column label="工艺进程(工段|设备|状态|订单数量/产出数量|实际工时-----绿色代表已完成，红色代表已领取，灰色代表待领取)" prop="process">
          <template slot-scope="scope">
            <el-tag v-for="(item,index) in ((scope.row.process || '').split(';')).slice(0,-1)" :key="index" :class="[item.indexOf('已完成') !== -1? 'green-color':'',item.indexOf('已领取') !== -1? 'red-color':'',
            item.indexOf('待领取') !== -1? 'gray-color':'',item.indexOf('加工中') !== -1? 'red-color':'',]" @click="handleSearch(item,index,scope.row)">{{item}}</el-tag>
          </template>
        </af-table-column>
        <af-table-column label="EDM设计" align="center" prop="edmDesign">
          <template slot-scope="scope">
            <el-tag v-for="(item,index) in ((scope.row.edmDesign || '').split(';'))" :key="index" :class="[item.indexOf('已完成') !== -1? 'green-color':'',item.indexOf('已领取') !== -1? 'red-color':'',
           item.indexOf('待领取') !== -1? 'gray-color':'',]">{{item}}</el-tag>
          </template>
        </af-table-column>
        <af-table-column label="钢件CNC编程" align="center" prop="steelCncProgram">
          <template slot-scope="scope">
            <el-tag v-for="(item,index) in ((scope.row.steelCncProgram || '').split(';'))" :key="index" :class="[item.indexOf('已完成') !== -1? 'green-color':'',item.indexOf('已领取') !== -1? 'red-color':'',
            item.indexOf('待领取') !== -1? 'gray-color':'',]">{{item}}</el-tag>
          </template>
        </af-table-column>
        <af-table-column label="电极CNC编程" align="center" prop="eleCncProgram">
          <template slot-scope="scope">
            <el-tag v-for="(item,index) in ((scope.row.eleCncProgram || '').split(';'))" :key="index" :class="[item.indexOf('已完成') !== -1? 'green-color':'',item.indexOf('已领取') !== -1? 'red-color':'',
            item.indexOf('待领取') !== -1? 'gray-color':'',]">{{item}}</el-tag>
          </template>
        </af-table-column>
        <af-table-column label="WE编程" align="center" prop="weProgram">
          <template slot-scope="scope">
            <el-tag v-for="(item,index) in ((scope.row.weProgram || '').split(';'))" :key="index" :class="[item.indexOf('已完成') !== -1? 'green-color':'',item.indexOf('已领取') !== -1? 'red-color':'',
            item.indexOf('待领取') !== -1? 'gray-color':'',]">{{item}}</el-tag>
          </template>
        </af-table-column>
        <el-table-column label="当前工段" align="center" prop="currentSection"/>
        <el-table-column label="当前工序" align="center" prop="currentProcess"/>
        <el-table-column label="当前状态" align="center" prop="currentState"/>
        <el-table-column label="完整工艺制程" align="center" prop="completeProcess" :show-overflow-tooltip="true"/>
        <el-table-column label="剩余工艺制程" align="center" prop="remainingProcess" :show-overflow-tooltip="true"/>
        <el-table-column label="订单状态" align="center" prop="orderState">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.orderState === '0'">进行中</el-tag>
            <el-tag v-if="scope.row.orderState === '1'" type="success">已终检</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="备注" align="center" prop="remark" width="100px"/>
      </el-table>
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="queryParams.pageNo"
        :limit.sync="queryParams.pageSize"
        :page-sizes="[10, 100, 200, 300, 500]"
        :page-size="10"
        @pagination="getList"
      />
      <div align="center">
        <el-button size="small" type="danger" icon="el-icon-star-on" @click="handleSpecialAttention">取消关注</el-button>
      </div>
    </div>
    <!--操作历史对话框-->
    <el-dialog :title="title" :visible.sync="openDetail" width="700px" append-to-body>
      <el-table v-loading="loading" :data="detailList" border>
        <el-table-column label="任务状态" prop="operationStatus">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.operationStatus === 0">接收</el-tag>
            <el-tag v-if="scope.row.operationStatus === 1">领取</el-tag>
            <el-tag v-if="scope.row.operationStatus === 2">开工</el-tag>
            <el-tag v-if="scope.row.operationStatus === 3" type="success">恢复</el-tag>
            <el-tag v-if="scope.row.operationStatus === 4" type="info">暂停</el-tag>
            <el-tag v-if="scope.row.operationStatus === 5" type="danger">异常</el-tag>
            <el-tag v-if="scope.row.operationStatus === 6" type="success">完成</el-tag>
            <el-tag v-if="scope.row.operationStatus === 7" type="danger">退回</el-tag>
            <el-tag v-if="scope.row.operationStatus === 8" type="warning">部分出货</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作人" prop="createBy"/>
        <el-table-column label="操作时间" prop="createTime"/>
        <el-table-column label="业务工时" prop="workHour"/>
        <el-table-column label="备注" prop="remark"/>
      </el-table>
      <pagination
        v-show="totalHistory>0"
        :total="totalHistory"
        :page.sync="queryParamsHistory.pageNo"
        :limit.sync="queryParamsHistory.pageSize"
        @pagination="getProdWorkOperationHisPage"
      />
      <div slot="footer" class="dialog-footer">
        <el-button @click="openDetail = false" type="danger" style="margin-right: 40%">关 闭</el-button>
      </div>
    </el-dialog>
    <!--导出-->
    <el-dialog :title="title" :visible.sync="openExport" width="400px" append-to-body>
      <div align="center">
        <el-progress :percentage="percentage" type="circle"></el-progress>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {
    delProdScheduleFollow,
    exportProdSchedule, getProdScheduleFollowPage,
    getProdSchedulePage,getProdScheduleFollowNameList,
    saveProdScheduleFollow
  } from "../../../api/follow/recording";
  import {getProdWorkOperationHisPage} from "../../../api/production/taskStation";
  import global from '../../../store/global.js';
  import { ElMapExportTable } from "table-excel";
  import {listProcess,getProcessManHourList} from "../../../api/system/process";

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
        totalHistory: 0,
        electrodeTotal: 0,
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        openDetail:false,
        openExport: false,
        //操作历史弹框数据
        detailList:[],
        //关注人list
        nameList:[],
        // 显示搜索条件
        showSearch: true,
        // 生产进度表格数据
        sheduleList: [],
        //导出进度显示
        percentage:0,
        //操作历史选中数据
        code:'',
        prodOrderNo:'',
        sort:'',
        //选中数组
        jumpProdOrderNo:'',
        attentionIds:'',
        //工段搜索数据
        processFortask:[],
        // 查询参数
        queryParams: {
          pageNo: 1,
          pageSize: 10,
        },
        queryParamsHistory: {
          pageNo: 1,
          pageSize: 10,
        },
        // 查询参数
        queryParamsExport: {
          pageNo: 1,
          pageSize: 10,
        },
        // 工段查询参数
        queryParamsProcess: {
          pageNo: 1,
          pageSize: 1000,
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
      this.selectNameList();
    },
    methods: {
      /** nameList 查询 */
      selectNameList(val) {
        this.wareId = val
        getProdScheduleFollowNameList({'infoId':val}).then(response => {
          this.nameList = response.data;
        });
      },
      /** 分页查询生产进度列表 */
      getList() {
        this.loading = true;
        getProdScheduleFollowPage(this.queryParams).then(response => {
          this.sheduleList = response.data.records;
          this.total = response.data.total;
          this.loading = false;
          if(this.sheduleList.length>0){
            this.electrodeTotal = this.sheduleList[0].electrodeTotal;
          }
        });
      },
      /** 分页操作历史记录 */
      getProdWorkOperationHisPage() {
        this.loading = true;
        this.queryParamsHistory.code = this.code
        this.queryParamsHistory.prodOrderNo = this.prodOrderNo
        this.queryParamsHistory.sort = this.sort
        getProdWorkOperationHisPage(this.queryParamsHistory).then(response => {
          this.detailList = response.data.records;
          this.totalHistory = Number(response.data.total);
          this.loading = false;
        })
      },
      /** 查询工段列表 */
      getListProcess() {
        /* listProcess(this.queryParamsProcess).then(response => {
          this.processFortask = response.data.records;
        }); */
        getProcessManHourList(this.queryParamsProcess).then(response => {
           this.processFortask = response.data;
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
      /** 进度条颜色 */
      customColorMethod(percentage) {
        if (percentage < 30) {
          return '#F56C6C';
        } else if (percentage < 70) {
          return '#409EFF';
        } else {
          return '#67c23a';
        }
      },
      /** 点击标签事件 */
      handleSearch(item,index,row) {
        this.openDetail = true
        this.title = "工段操作历史"
        this.code = item.split('|')[0]
        this.prodOrderNo = row.prodOrderNo
        this.sort = index+1
        this.getProdWorkOperationHisPage();
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
      /** 取消特别关注按钮 */
      handleSpecialAttention() {
        this.loading = true;
        this.queryParamsSpecial.ids = this.attentionIds
        delProdScheduleFollow(this.queryParamsSpecial).then(res => {
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
