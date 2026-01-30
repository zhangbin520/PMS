<template>
  <div class="app-container">
    <el-card>
      <el-form :model="queryParams" ref="queryForm" :inline="true">
        <el-row>
          <el-form-item label="开始时间：" prop="keywords">
            <el-date-picker
              v-model="queryParams.beginTime"
              type="date"
              placeholder="选择日期时间"
              value-format="yyyy-MM-dd">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="结束时间：" prop="keywords">
            <el-date-picker
              v-model="queryParams.endTime"
              type="date"
              placeholder="选择日期时间"
              value-format="yyyy-MM-dd">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="派工单号：" prop="keywords">
            <el-input
              v-model="queryParams.dispatchOrderNo"
              placeholder="请输入派工单号"
              clearable
              size="small"
              style="width: 200px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="生产单号：" prop="keywords">
            <el-input
              v-model="queryParams.prodOrderNo"
              placeholder="请输入生产单号"
              clearable
              size="small"
              style="width: 220px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="模号：" prop="keywords">
            <el-input
              v-model="queryParams.moduleNo"
              placeholder="请输入模号"
              clearable
              size="small"
              style="width: 220px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="件号：" prop="keywords">
            <el-input
              v-model="queryParams.pieceNo"
              placeholder="请输入件号"
              clearable
              size="small"
              style="width: 220px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="订单状态：" prop="orderState">
            <el-select v-model="queryParams.orderState" placeholder="请选择" clearable>
              <el-option
                v-for="item in order_state"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button style="margin-left: 10px" type="primary" icon="el-icon-search" size="mini" @click="handleQuery"></el-button>
            <el-button type="warning" plain icon="el-icon-download" size="mini" style="margin-bottom: 10px" @click="handleExport">导出</el-button>
          </el-form-item>
        </el-row>
      </el-form>
    </el-card>
    <div>
      <el-table v-loading="loading" :data="sheduleList" border max-height="800px" @selection-change="handleSelectionChange" highlight-current-row>
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
        <el-table-column label="派工单号" align="center" prop="dispatchOrderNo" width="110px" fixed/>
        <el-table-column label="模号" align="center" prop="moduleNo" width="130px" fixed/>
        <el-table-column label="打标" align="center" prop="marking" fixed/>
        <el-table-column label="件号" align="center" prop="pieceNo" fixed/>
        <el-table-column label="版次" align="center" prop="versionNo"  fixed/>
        <el-table-column label="品名" align="center" prop="pinName" :show-overflow-tooltip="true" fixed/>
        <el-table-column label="生产单号" align="center" prop="prodOrderNo" width="125px" fixed>
          <template slot-scope="scope">
            <span v-if="scope.row.electrodeNo !== '0'">{{scope.row.prodOrderNo}}-{{scope.row.electrodeNo}}</span>
            <span v-if="scope.row.electrodeNo === '0'">{{scope.row.prodOrderNo}}</span>
          </template>
        </el-table-column>
        <el-table-column label="订单数量" align="center" prop="quantity" fixed/>
        <el-table-column label="当前状态" align="center" prop="currentState"/>
        <el-table-column label="剩余工艺制程" align="center" prop="remainingProcess" :show-overflow-tooltip="true"/>
        <el-table-column label="产出数量" align="center" prop="outputQuantity"/>
        <el-table-column label="异常数量" align="center" prop="exceptionsQuantity" />
        <el-table-column label="需求日期" align="center" prop="demandDate" :show-overflow-tooltip="true"/>
        <el-table-column label="材质" align="center" prop="material" />
        <el-table-column label="工时完成比例" align="center" prop="completionRatio" width="200px">
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

        <el-table-column label="完整工艺制程" align="center" prop="completeProcess" :show-overflow-tooltip="true"/>
        <el-table-column label="剩余工艺制程" align="center" prop="remainingProcess" :show-overflow-tooltip="true"/>
        <el-table-column label="订单状态" align="center" prop="orderState">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.orderState === '0'">进行中</el-tag>
            <el-tag v-if="scope.row.orderState === '1'" type="success">已终检</el-tag>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="queryParams.pageNo"
        :limit.sync="queryParams.pageSize"
        :page-sizes="[10, 100, 200, 300, 500]"
        :page-size="200"
        @pagination="getList"
      />
      <div align="center">
        <el-button size="small" type="danger" icon="el-icon-star-off" @click="handleSpecialAttention">特别关注</el-button>
      </div>
    </div>
    <!--操作历史对话框-->
    <el-dialog v-el-drag-dialog :title="title" :visible.sync="openDetail" width="700px" append-to-body>
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
        <el-table-column label="业务工时" prop="workHour" v-if="false"/>
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
    <!--特别关注弹窗-->
    <el-dialog :title="specialAttention.title" :visible.sync="specialAttention.open" width="400px" append-to-body>
      <el-form :model="formSpecialAttention">
        <el-form-item label="备注" prop="remark">
          <el-input v-model="formSpecialAttention.remark" type="textarea"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="saveSpecialAttention" type="primary" style="margin-right: 40%">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {exportProdSchedule, getProdSchedulePage, saveProdScheduleFollow} from "../../../api/follow/recording";
  import {getProdWorkOperationHisPage} from "../../../api/production/taskStation";
  import global from '../../../store/global.js';
  import { ElMapExportTable } from "table-excel";

  export default {
    name: "Recording",
    dicts: ['sys_normal_disable'],
    components:{ElMapExportTable},
    data() {
      var myDate = new Date ();
      return {
        // 遮罩层
        loading: true,
        // 总条数
        total: 0,
        // 总条数
        totalHistory: 0,
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        openDetail:false,
        openExport: false,
        //操作历史弹框数据
        detailList:[],
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
        attentionProdOrderNo:[],
        searchDispatchOrderNo:'',
        electrodeNo:'',
        //特别关注数据
        specialAttention:{
          title:"",
          open:false,
        },
        formSpecialAttention:{},
        // 查询参数
        queryParams: {
          pageNo: 1,
          pageSize: 10,
          beginTime: new Date(myDate - 1000 * 60 * 60* 24 * 30),
          endTime:new Date(),
        },
        // 查询参数
        queryParamsHistory: {
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
        // 查询参数
        queryParamsSearch: {
          pageNo: 1,
          pageSize: 10,
        },
        //进度查询表单校验
        rules: {},
        //订单状态数组
        order_state:[{
          "value": 0,
          "label": '进行中'
        },{
          "value": 1,
          "label": '已终检'
        }],
      };
    },
    created() {

    },
    mounted(){
      
      this.searchDispatchOrderNo = this.$route.query.dispatchOrderNo
      if(this.searchDispatchOrderNo === undefined){
        this.getList();
      }else{
        this.queryParams = {
          pageNo: 1,
          pageSize: 10,
          dispatchOrderNo: this.searchDispatchOrderNo
        }
        this.getList();
      }
    },
    watch:{
      $route() {
        
        this.searchDispatchOrderNo = this.$route.query.dispatchOrderNo
        if(this.searchDispatchOrderNo !== undefined){
          this.queryParams = {
            pageNo: 1,
            pageSize: 10,
            dispatchOrderNo: this.searchDispatchOrderNo
          }
          // console.log(this.rfid)
          //监听到对象后调用请求方法
          this.getList();
        }
      }
    },
    methods: {
      /** 分页查询生产进度列表 */
      getList() {
        // if(this.searchDispatchOrderNo === undefined || this.queryParams.dispatchOrderNo === ''){
        //
        // }else {
        //   this.queryParams.dispatchOrderNo = this.searchDispatchOrderNo
        // }
        this.loading = true;
        getProdSchedulePage(this.queryParams).then(response => {
          this.sheduleList = response.data.records;
          for (let i = 0;i < this.sheduleList.length;i++){
            this.sheduleList[i].completeProcess = this.sheduleList[i].completeProcess.replace(/-/g, "-").replace(/\([^\)]*\)/g, "")
            this.sheduleList[i].remainingProcess = this.sheduleList[i].remainingProcess.replace(/-/g, "-").replace(/\([^\)]*\)/g, "")
          }
          this.total = response.data.total;
          this.loading = false;
        });
      },
      /** 分页操作历史记录 */
      getProdWorkOperationHisPage() {
        this.queryParamsHistory.code = this.code
        this.queryParamsHistory.prodOrderNo = this.prodOrderNo
        this.queryParamsHistory.sort = this.sort
        this.queryParamsHistory.electrodeNo = this.electrodeNo
        getProdWorkOperationHisPage(this.queryParamsHistory).then(response => {
          this.detailList = response.data.records;
          this.totalHistory = Number(response.data.total);
        })
      },
      // 多选框选中数据
      handleSelectionChange(selection) {
        this.attentionProdOrderNo = selection.map(item => item.prodOrderNo)
        this.single = selection.length!=1
        this.multiple = !selection.length
      },
      /** 搜索按钮操作 */
      handleQuery() {
        this.queryParams.pageNo = 1;
        // console.log(this.queryParams.orderState)
        if(this.queryParams.orderState === undefined || this.queryParams.orderState === ''){
          delete this.queryParams.orderState
        }
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
        this.electrodeNo = row.electrodeNo
        this.sort = index+1
        this.getProdWorkOperationHisPage();
      },
      /** 查看图档 */
      handleViewFile(row) {
        this.$router.push({
          path:'/eleContact/eleContactForm',
          query:{
            prodOrderNo: row.prodOrderNo,
            electrodeNo: row.electrodeNo,
          },
        });
      },
      /** 导出按钮操作 */
      handleExport() {
        this.openExport = true;
        var data = this.sheduleList; // 这里面是数据列表
        const column = [
          { title: "派工单号", dataIndex: "dispatchOrderNo" },
          { title: "模号", dataIndex: "moduleNo" },
          { title: "打标", dataIndex: "marking" },
          { title: "件号", dataIndex: "pieceNo" },
          { title: "版次", dataIndex: "versionNo" },
          { title: "品名", dataIndex: "pinName" },
          { title: "订单数量", dataIndex: "quantity" },
          { title: "产出数量", dataIndex: "outputQuantity" },
          { title: "异常数量", dataIndex: "exceptionsQuantity" },
          { title: "需求日期", dataIndex: "demandDate" },
          { title: "生产单号", dataIndex: "prodOrderNo" },
          { title: "电极序号", dataIndex: "electrodeNo" },
          { title: "材质", dataIndex: "material" },
          { title: "完成比例", dataIndex: "completionRatio" },
          { title: "总工时", dataIndex: "totalManHours" },
          { title: "剩余工时", dataIndex: "remainWork" },
          { title: "工艺进程", dataIndex: "process" },
          { title: "EDM设计", dataIndex: "edmDesign" },
          { title: "钢件CNC编程", dataIndex: "steelCncProgram" },
          { title: "电极CNC编程", dataIndex: "eleCncProgram" },
          { title: "WE编程", dataIndex: "weProgram" },
          { title: "当前工段", dataIndex: "currentSection" },
          { title: "当前工序", dataIndex: "currentProcess" },
          { title: "当前状态", dataIndex: "currentState" },
          { title: "完整工艺制程", dataIndex: "completeProcess" },
          { title: "剩余工艺制程", dataIndex: "remainingProcess" },
          { title: "订单状态 0 进行中 1 已完结", dataIndex: "orderState" },
        ];
        const instance = new ElMapExportTable(
          { column, data },
          { progress: progress => this.percentage = progress },// 进度条回调
        );
        instance.download("进度查询").then((data) => {
          this.openExport = false
        }); // 导出的文件名
      },
      /** 特别关注按钮 */
      handleSpecialAttention() {
        this.specialAttention.open = true
        this.specialAttention.title = "特别关注任务备注"
      },
      /** 特别关注确定按钮 */
      saveSpecialAttention() {
        this.queryParamsSpecial.prodOrderNo = this.attentionProdOrderNo
        this.queryParamsSpecial.remark = this.formSpecialAttention.remark
        saveProdScheduleFollow(this.queryParamsSpecial).then(res => {
          this.$modal.msgSuccess("特别关注成功")
          this.specialAttention.open = false
          this.getList()
        })
      },
      /** 多选框禁选 */
      selected(row,index){
        if (row.state === '1') {
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
