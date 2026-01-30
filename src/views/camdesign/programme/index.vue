<template>
  <div class="app-container">
    <el-row>
      <el-col :span="24">
        <el-form :model="queryParams" ref="queryForm" v-show="showSearch" :inline="true"  label-width="100px">
          <el-form-item label="工序时间范围" prop="dispatchOrderNo" style="margin-left: 20px">
            <el-date-picker
              v-model="queryParams.beginTime"
              type="datetime"
              placeholder="选择工序开始时间"
              value-format="yyyy-MM-dd">
            </el-date-picker>
            <el-date-picker
              v-model="queryParams.endTime"
              type="datetime"
              placeholder="选择工序结束时间"
              style="margin-left: 10px"
              value-format="yyyy-MM-dd">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="工序类别">
            <el-radio v-model="queryParams.type">全部</el-radio>
            <el-radio v-model="queryParams.type" label="CNC">CNC编程列表</el-radio>
            <el-radio v-model="queryParams.type" label="WE">WE编程列表</el-radio>
            <el-radio v-model="queryParams.type" label="EDM">EDM编程列表</el-radio>
          </el-form-item>
          <el-form-item label="派工单号" prop="dispatchOrderNo" style="margin-left: 20px">
            <el-input
              v-model="queryParams.dispatchOrderNo"
              placeholder="请输入派工单号"
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
              placeholder="请输入件号"
              clearable
              size="small"
              style="width: 220px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="设计状态" prop="designStatus">
            <el-select v-model="queryParams.designStatusList" multiple placeholder="请选择" style="width: 100%">
              <el-option
                v-for="item in dict.type.design_Status"
                :key="item.value"
                :label="item.label"
                :value="Number(item.value)"
              ></el-option>
            </el-select>
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
          <el-form-item label="交货等级" prop="deliveryLevel">
            <el-input
              v-model="queryParams.deliveryLevel"
              placeholder="请输入交货等级"
              clearable
              size="small"
              style="width: 220px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="人员工号" prop="jobNo">
            <el-input
              v-model="queryParams.jobNo"
              placeholder="请输入人员工号"
              clearable
              size="small"
              style="width: 220px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-button type="primary" size="small" round style="margin-left: 10px" icon="el-icon-search" @click="handleQuery">搜索</el-button>
          <el-button type="warning" plain icon="el-icon-download" size="mini" style="margin-bottom: 10px" @click="handleExport">导出</el-button>
        </el-form>
        <right-toolbar :showSearch.sync="showSearch" @queryTable="getListProgramme"></right-toolbar>
      </el-col>
    </el-row>
    <el-row style="margin-bottom: 10px">
      <el-col :span="24">
        <el-button
          type="primary"
          size="small"
          round
          icon="el-icon-plus"
          disabled
        >NC编程列表</el-button>
        <el-button
          type="success"
          size="small"
          round
          icon="el-icon-plus"
          @click="handleAlreadyAccept"
        >NC编程已领取列表</el-button>
        <el-button
          size="small"
          round
          icon="el-icon-plus"
          @click="handleAlreadyFinish"
        >NC编程已完成列表</el-button>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-table ref="multipleTable" v-loading="loading" :data="programmeList" max-height="690px" @selection-change="handleSelectionChange" border highlight-current-row>
          <el-table-column type="index" width="50" align="center" fixed/>
          <el-table-column type="selection" align="center" :selectable="selected" fixed/>
          <el-table-column label="工序序号" align="center" prop="sort" fixed/>
          <el-table-column label="操作" align="center" width="160" class-name="small-padding fixed-width" fixed>
            <template slot-scope="scope">
              <el-tooltip class="item" effect="dark" content="领取任务" placement="top-start">
                <el-button
                  type="primary"
                  circle
                  icon="el-icon-check"
                  @click="handleAccept(scope.row)"
                  :disabled="scope.row.designStatus !== 0"
                ></el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="查看操作记录" placement="top-start">
                <el-button
                  type="info"
                  circle
                  icon="el-icon-view"
                  @click="handleQueryWork(scope.row)"
                ></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column label="工序名称" align="center" prop="code" fixed/>
          <el-table-column label="设计状态" align="center" prop="designStatus" fixed>
            <template slot-scope="scope">
              <el-tag v-if="scope.row.designStatus === 0" type="info">待领取</el-tag>
              <el-tag v-if="scope.row.designStatus === 1">已领取</el-tag>
              <el-tag v-if="scope.row.designStatus === 2">已开始</el-tag>
              <el-tag v-if="scope.row.designStatus === 3" type="danger">已暂停</el-tag>
              <el-tag v-if="scope.row.designStatus === 4" type="success">已完成</el-tag>
              <el-tag v-if="scope.row.designStatus === 6" type="warning">订单已暂停</el-tag>
              <el-tag v-if="scope.row.designStatus === 7" type="danger">订单已取消</el-tag>
              <el-tag v-if="scope.row.designStatus === 8" >换图待确认</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="类型" align="center" prop="datasource" fixed>
            <template slot-scope="scope">
              <el-tag v-if="scope.row.datasource === '0'" type="success">钢件</el-tag>
              <el-tag v-if="scope.row.datasource === '1'" type="danger">电极</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="业务工时" align="center" prop="businessHours" fixed v-if="false"/>
          <el-table-column label="需求日期" align="center" prop="demandDate" width="95px" fixed/>
          <el-table-column label="本工序加工日期" align="center" prop="processingDate" width="95px" fixed/>
          <el-table-column label="任务编号" align="center" prop="taskNo" :show-overflow-tooltip="true" fixed/>
          <el-table-column label="生产单号" align="center" prop="prodOrderNo" :show-overflow-tooltip="true" fixed/>
          <el-table-column label="模号" align="center" prop="moduleNo" fixed/>
          <el-table-column label="件号" align="center" prop="pieceNo"  fixed/>
          <el-table-column label="版本" align="center" prop="versionNo"  fixed/>
          <el-table-column label="电极编号" align="center" prop="bBno"/>
          <el-table-column label="类型" align="center" prop="bType"/>
          <el-table-column label="操作员" align="center" prop="operatorName">
            <template slot-scope="scope">
              <span>{{scope.row.operatorName}}-{{scope.row.operator}}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作时间" align="center" prop="operatorTime" :show-overflow-tooltip="true"/>
          <el-table-column label="推荐人" align="center" prop="recommender"/>
          <el-table-column label="工件当前工序" align="center" prop="currentOperation"/>
          <el-table-column label="工艺简述" align="center" prop="routeDescription"/>
          <el-table-column label="工艺工序列表" align="center" prop="routeList" :show-overflow-tooltip="true"/>
          <el-table-column label="工艺员" align="center" prop="createBy"/>
          <el-table-column label="创建时间" align="center" prop="createTime" :show-overflow-tooltip="true"/>
          <el-table-column label="制作类型" align="center" prop="processingType"/>
          <el-table-column label="加工类型" align="center" prop="workingType"/>
          <el-table-column label="派工单号" align="center" prop="dispatchOrderNo" width="150px" />
          <el-table-column label="数量" align="center" prop="quantity" />
          <el-table-column label="材质" align="center" prop="material"  />
          <el-table-column label="硬度" align="center" prop="hardness"  />
          <el-table-column label="交货等级" align="center" prop="deliveryLevel" >
            <template slot-scope="scope">
              <p v-if="scope.row.deliveryLevel =='0'">特急件</p>
              <p v-if="scope.row.deliveryLevel =='1'">急件</p>
              <p v-if="scope.row.deliveryLevel =='2'">一般</p>
            </template>
          </el-table-column>
          <el-table-column label="品名" align="center" prop="pinName" />
          <el-table-column label="规格" align="center" >
            <template slot-scope="scope">
              <p>{{scope.row.length}}*{{scope.row.width}}*{{scope.row.height}}</p>
            </template>
          </el-table-column>
        </el-table>
        <pagination
          v-show="total>0"
          :total="total"
          :page.sync="queryParams.pageNo"
          :limit.sync="queryParams.pageSize"
          @pagination="getListProgramme"
        />
        <div align="center" style="padding-top: 19px;">
          <el-button type="primary" icon="el-icon-check" size="small" @click="handleAcceptMany" >批量领取任务</el-button>
          <el-button type="primary" icon="el-icon-check" size="small" @click="handleSetFileType" >设置文件类型</el-button>
        </div>
      </el-col>
    </el-row>

    <!-- 设置文件类型对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="900px" append-to-body>
      <el-table :data="fileData" v-loading="loading" border>
        <el-table-column type="index" label="" width="50"></el-table-column>
        <el-table-column prop="fileType" label="文件类型"></el-table-column>
        <el-table-column prop="fileCode" label="文件类型代码"></el-table-column>
        <el-table-column prop="type" label="编程类型"></el-table-column>
        <el-table-column prop="datasource" label="来源">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.datasource === '0'" type="success">钢件</el-tag>
            <el-tag v-if="scope.row.datasource === '1'">电极</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="required" label="是否必须上传图档">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.required === '1'" type="success">是</el-tag>
            <el-tag v-if="scope.row.required === '0'">否</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="controller" label="控制器类别" width="200px"></el-table-column>
        <el-table-column prop="fileUpdateRules" label="文件更新规则"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="primary"
              circle
              icon="el-icon-edit"
              @click="handleEditFile(scope.row)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="totalFileType>0"
        :total="totalFileType"
        :page.sync="queryParams.pageNo"
        :limit.sync="queryParams.pageSize"
        @pagination="getListFiles"
      />
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleAddFile">新 增</el-button>
        <el-button @click="open = false">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 新增文件类型对话框 -->
    <el-dialog :title="addFile.title" :visible.sync="addFile.open" width="480px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="130px">
        <el-form-item label="文件类型">
          <el-input v-model="form.fileType" placeholder="请输入文件类型"></el-input>
        </el-form-item>
        <el-form-item label="文件类型代码">
          <el-input v-model="form.fileCode" placeholder="请输入文件类型代码"></el-input>
        </el-form-item>
        <el-form-item label="编程类型">
          <el-select v-model="form.type" filterable placeholder="请选择" style="width: 100%">
            <el-option
              v-for="dict in dict.type.programming_category"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="来源">
          <el-select v-model="form.datasource" filterable placeholder="请选择" style="width: 100%">
            <el-option
              v-for="item in datasourceOption"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="控制器类别">
          <el-select v-model="form.controller" multiple filterable placeholder="请选择" style="width: 100%">
            <el-option
              v-for="item in controllerOption"
              :key="item"
              :label="item"
              :value="item"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="文件更新规则">
          <el-input v-model="form.fileUpdateRules" placeholder="请输入文件更新规则"></el-input>
        </el-form-item>
        <el-form-item label="是否必须上传图档">
          <input type="radio" name="radios" value="0" v-model="form.required"><label>否</label>
          <input type="radio" name="radios" value="1" v-model="form.required" style="margin-left: 10px"><label>是</label>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="addFile.open = false">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 查询操作记录对话框 -->
    <el-dialog :title="work.title" :visible.sync="work.open" width="800px" append-to-body>
      <el-table :data="workData" v-loading="loading" border>
        <el-table-column type="index" label="" width="50"></el-table-column>
        <el-table-column prop="createBy" align="center" label="操作人"></el-table-column>
        <el-table-column prop="createTime" align="center" label="创建时间" width="155px"></el-table-column>
        <el-table-column prop="bizType" align="center" label="任务状态">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.bizType === '1'">领取</el-tag>
            <el-tag v-if="scope.row.bizType === '2'">开始</el-tag>
            <el-tag v-if="scope.row.bizType === '3'">暂停</el-tag>
            <el-tag v-if="scope.row.bizType === '4'">恢复</el-tag>
            <el-tag v-if="scope.row.bizType === '5'">放弃</el-tag>
            <el-tag v-if="scope.row.bizType === '6'">完成</el-tag>
            <el-tag v-if="scope.row.bizType === '7'">重新设计</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="reason" align="center" label="原因">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.reason === '0'">无</el-tag>
            <el-tag v-if="scope.row.reason === '1'">客户换图</el-tag>
            <el-tag v-if="scope.row.reason === '2'">赶插单任务</el-tag>
            <el-tag v-if="scope.row.reason === '3'">业务暂停订单</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="remark" align="center" label="备注"></el-table-column>
      </el-table>
      <pagination
        v-show="total>0"
        :total="total"
        style="text-align: center"
        :page.sync="queryParams.pageNo"
        :limit.sync="queryParams.pageSize"
        @pagination="getListWork"
      />
      <div slot="footer" class="dialog-footer">
        <el-button @click="work.open = false">取 消</el-button>
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
  listProgramme,
  actionProgramme,
  getFileTypePage,
  setFileType,
  camNcOperatorHisPage, updFileType, getBrandInformation
} from "../../../api/camdesign/programm"
import {ElMapExportTable} from "table-excel";

export default {
  name: "Programme",
  dicts: ['sys_normal_disable','programming_category','design_Status'],
  data() {
    return {
      // 遮罩层
      loading: true,
      // 总条数
      total: 0,
      totalFileType:0,
      // 显示搜索条件
      showSearch: true,
      // 订单BOM表格数据
      programmeList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      //单选框查询
      radio: 4,
      //选中数组
      Id:[],
      Ids:[],
      //设置文件类型表格数据
      fileData:[],
      //操作记录表格数据
      workData:[],
      //新增文件类型表单数据
      form:{},
      //新增文件类型弹窗
      addFile: {
        title:'',
        open:false,
      },
      //新增文件类型弹窗
      work: {
        title:'',
        open:false,
      },
      //新增文件类型来源数组
      datasourceOption:[{
        value: '0',
        label: '钢件'
      },{
        value: '1',
        label: '电极'
      }],
      //控制器类别数组
      controllerOption:[],
      // 查询参数
      queryParams: {
        pageNo: 1,
        pageSize: 10,
      },
      // 文件类型查询参数
      queryParamsFiles: {
        pageNo: 1,
        pageSize: 50,
      },
      // 文件类型查询参数
      queryParamsBrand: {
        pageNo: 1,
        pageSize: 5000,
      },
      // 表单校验
      rules: {
        typeName: [
          {required: true, message: "分类名称不能为空", trigger: "blur"},
          {min: 2, max: 20, message: '分类名称长度必须介于 2 和 20 之间', trigger: 'blur'}
        ],
      },
      // 生产进度表格数据
      sheduleList: [],
      //
      middleList: [],
      //导出进度显示
      percentage:0,
      // 是否显示弹出层
      openExport: false,
    };
  },
  created() {
    this.getListProgramme();
    this.getListBrand();
  },
  methods: {
    /** 分页查询编程列表 */
    getListProgramme() {
      this.loading = true;
      listProgramme(this.queryParams).then(response => {
        this.middleList = response.data.records;
        for (let i = 0;i < this.middleList.length;i++){
          this.middleList[i].routeList = this.middleList[i].routeList.replace(/-/g, "-").replace(/\([^\)]*\)/g, "")
        }
        this.programmeList = this.middleList;
        this.total = Number(response.data.total);
        this.loading = false;
      });
    },
    /** 分页查询文件类型 */
    getListFiles() {
      getFileTypePage(this.queryParams).then(res =>{
        this.fileData = res.data.records;
        this.totalFileType = Number(res.data.total)
      })
    },
    /** 分页查询操作记录 */
    getListWork() {
      this.queryParams.ncId = this.Id
      camNcOperatorHisPage(this.queryParams).then(res =>{
        this.workData = res.data.records
        this.total = Number(res.data.total)
      })
    },
    /** 分页查询控制器类别 */
    getListBrand() {
      getBrandInformation(this.queryParamsBrand).then(res =>{
        this.controllerOption = res.data.BRAND_LIST;
      })
    },
    //多选框选中
    handleSelectionChange(selection) {
      this.Ids = selection.map(item => item.id);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    // 表单重置
    reset() {
      this.form = {

      };
      this.resetForm("form");
    },
    /** 领取任务 */
    handleAccept(row) {
      const ncId = [row.id]
      actionProgramme({'ncId':ncId}).then(response =>{
        this.$modal.msgSuccess("领取任务成功");
        this.getListProgramme();
      })
    },
    /** 批量领取任务 */
    handleAcceptMany() {
      const ncId = this.Ids
      actionProgramme({'ncId':ncId}).then(response =>{
        this.$modal.msgSuccess("领取任务成功");
        this.getListProgramme();
      })
    },
    /** 查看操作记录 */
    handleQueryWork(row) {
      this.work.open = true;
      this.work.title = "操作记录"
      this.Id = row.id
      this.getListWork()
    },
    /** 设置文件类型 */
    handleSetFileType() {
      this.open = true;
      this.title = "文件类型设置"
      this.getListFiles();
    },
    /** 新增文件类型 */
    handleAddFile() {
      this.addFile.open = true;
      this.reset();
      this.addFile.title = "新增文件类型";
    },
    /** 新增文件类型提交按钮 */
    submitForm: function() {
      if (this.form.controller.length == 0){
        delete this.form.controller
      }
      this.$refs["form"].validate(valid => {
        if (valid){
          if(this.form.id === undefined) {
            setFileType(JSON.stringify(this.form)).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.addFile.open = false;
              this.getListFiles();
            });
          }else {
            this.form.controller = this.form.controller.toString()
            updFileType(JSON.stringify(this.form)).then(res =>{
              this.$modal.msgSuccess("编辑成功");
              this.addFile.open = false;
              this.getListFiles();
            })
          }
        }else{
          this.$modal.msgError("表单验证失败,请检查是否输入正确");
        }
      });
    },
    /** NC编程已领取跳转按钮 */
    handleAlreadyAccept() {
      this.$router.push({
        path:'/camdesign/programme-edit/alreadyAccept',
      });
    },
    /** NC编程已完成跳转按钮 */
    handleAlreadyFinish() {
      this.$router.push({
        path:'/camdesign/programme-edit/alreadyFinish',
      });
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNo = 1;
      this.getListProgramme();
    },
    /** 多选框禁选 */
    selected(row,index){
      if (row.designStatus !== 0) {
        return false //不可勾选
      } else {
        return true; //可勾选
      }
    },
    /** 编辑文件类型 */
    handleEditFile(row) {
      if (row.controller === ''||row.controller===undefined) {
        row.controller = []
      } else {
        row.controller = row.controller.split(',')
      }
      this.addFile.open = true
      this.addFile.title = '编辑文件类型'
      this.form = row
    },
    /** 导出按钮操作 */
    handleExport() {
      this.openExport = true;
      var data = this.sheduleList; // 这里面是数据列表
      const column = [
        { title: "工序序号", dataIndex: "sort" },
        { title: "工序名称", dataIndex: "code" },
        { title: "设计状态( 0 待领取 1 已领取 2 已开始 3 已暂停 4 已完成 5 已放弃)", dataIndex: "designStatus" },
        { title: "类型", dataIndex: "datasource" },
        // { title: "业务工时", dataIndex: "businessHours" },
        { title: "需求日期", dataIndex: "demandDate" },
        { title: "本工序加工日期", dataIndex: "processingDate" },
        { title: "任务编号", dataIndex: "taskNo" },
        { title: "生产单号", dataIndex: "prodOrderNo" },
        { title: "模号", dataIndex: "moduleNo" },
        { title: "件号", dataIndex: "pieceNo" },
        { title: "版本", dataIndex: "versionNo" },
        { title: "电极编号", dataIndex: "bBno" },
        { title: "类型", dataIndex: "bType" },
        { title: "操作员", dataIndex: "operatorName" },
        { title: "操作时间", dataIndex: "operatorTime" },
        { title: "推荐人", dataIndex: "recommender" },
        { title: "工件当前工序", dataIndex: "currentOperation" },
        { title: "工艺简述", dataIndex: "routeDescription" },
        { title: "工艺工序列表", dataIndex: "routeList" },
        { title: "工艺员", dataIndex: "createBy" },
        { title: "创建时间", dataIndex: "createTime" },
        { title: "制作类型", dataIndex: "processingType" },
        { title: "加工类型", dataIndex: "workingType" },
        { title: "派工单号", dataIndex: "dispatchOrderNo" },
        { title: "数量", dataIndex: "quantity" },
        { title: "材质", dataIndex: "material" },
        { title: "硬度", dataIndex: "hardness" },
        { title: "交货等级", dataIndex: "deliveryLevel" },
        { title: "品名", dataIndex: "pinName" },
        { title: "规格(长)", dataIndex: "length"},
        { title: "规格(宽)", dataIndex: "width"},
        { title: "规格(高)", dataIndex: "height"},
      ];
      const instance = new ElMapExportTable(
        { column, data },
        { progress: progress => this.percentage = progress },// 进度条回调
      );
      instance.download("NC编程列表").then((data) => {
        this.openExport = false
      }); // 导出的文件名
    },
  }
};
</script>

