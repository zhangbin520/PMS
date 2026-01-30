<template>
  <div class="app-container">
      <div slot="header">
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
              <el-button type="primary" size="small" round style="margin-left: 10px" icon="el-icon-search" @click="handleQuery">搜索</el-button>
            </el-form>
            <right-toolbar :showSearch.sync="showSearch" @queryTable="getListDocumentation"></right-toolbar>
          </el-col>
        </el-row>
      </div>
        <el-table ref="multipleTable" v-loading="loading" :data="documentationList" border highlight-current-row>
          <el-table-column label="" align="center" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="primary"
                round
                icon="el-icon-edit"
                @click="handleProcess(scope.row)"
              >查看工艺</el-button>
            </template>
          </el-table-column>
          <el-table-column label="生产单号" align="center" prop="prodOrderNo"/>
          <el-table-column label="模号" prop="moduleNo" align="center" />
          <el-table-column label="件号" prop="pieceNo" align="center" />
          <el-table-column label="版次" prop="versionNo" align="center" />
          <el-table-column label="品名" prop="pinName" align="center" />
          <el-table-column label="规格"align="center">
            <template slot-scope="scope">
              <p>{{scope.row.length}}*{{scope.row.width}}*{{scope.row.height}}</p>
            </template>
          </el-table-column>
          <el-table-column label="数量" prop="quantity" align="center" />
          <el-table-column label="材质" prop="material" align="center" />
          <el-table-column label="硬度" prop="hardness" align="center" />
          <el-table-column label="投单类型" prop="processingContent" align="center"/>
          <el-table-column label="投单原因" prop="orderReason" align="center" />
        </el-table>
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="queryParams.pageNo"
        :limit.sync="queryParams.pageSize"
        @pagination="getListDocumentation"
      />

    <!-- 查看工艺对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body>
      <el-table :data="processList" v-loading="loading" border>
        <el-table-column label="" align="center" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="handleDesign(scope.row)"
            >查看设计文档</el-button>
          </template>
        </el-table-column>
        <el-table-column label="工序名称" prop="code"/>
        <el-table-column label="业务工时" prop="businessHours" v-if="false"/>
        <el-table-column label="设计人" prop="operatorName" />
        <el-table-column label="开始时间" prop="beginTime" />
        <el-table-column label="结束时间" prop="endTime" />
      </el-table>
      <pagination
        v-show="totalProcess>0"
        :total="totalProcess"
        :page.sync="queryParams.pageNo"
        :limit.sync="queryParams.pageSize"
        @pagination="getListProcess"
      />
    </el-dialog>

    <!-- 查看设计文档对话框 -->
    <el-dialog :title="title" :visible.sync="openDraw" width="800px" append-to-body>
    <el-card>
      <span>按文件类型筛选</span>
      <el-select v-model="queryParams.camFileId" clearable multiple filterable placeholder="请选择" style="margin-left: 10px;width: 400px"  @change="handleQueryDesign">
        <el-option
          v-for="item in optionsFileName"
          :key="item.id"
          :label="item.fileType"
          :value="item.id"
         >
        </el-option>
      </el-select>
    </el-card>
      <el-table :data="designList" v-loading="loading" border>
        <el-table-column label="生产单号" prop="prodOrderNo" align="center"/>
        <el-table-column label="文件类型" prop="camFileName" align="center"/>
        <el-table-column label="文件名" prop="fileName" align="center"/>
        <el-table-column label="控制器类型" prop="brand" align="center"/>
        <el-table-column label="上传人姓名" prop="createByName" align="center"/>
        <el-table-column label="工号" prop="createBy" align="center"/>
        <el-table-column label="上传时间" prop="createTime" align="center"/>
      </el-table>
      <pagination
        v-show="totalDesign>0"
        :total="totalDesign"
        :page.sync="queryParams.pageNo"
        :limit.sync="queryParams.pageSize"
        @pagination="getListDesignDoc"
      />
    </el-dialog>
  </div>
</template>

<script>
  import {getFileTypePage, listProgramme} from "../../../api/camdesign/programm"
  import {listProcessPage, listProgramDocPage, viewDesignDoc} from "../../../api/camdesign/documentation";

  export default {
    name: "Documentation",
    dicts: ['sys_normal_disable'],
    data() {
      return {
        // 遮罩层
        loading: true,
        // 显示搜索条件
        showSearch: true,
        // 总条数
        total: 0,
        totalProcess:0,
        totalDesign:0,
        // 弹出层标题
        title: "",
        titleDraw:'',
        // 是否显示弹出层
        open: false,
        openDraw: false,
        //程序文档表格数据
        documentationList:[],
        //工件列表数据
        designList:[],
        //工序列表数据
        processList:[],
        //查看工艺选中数据
        prodOrderNo:'',
        code:'',
        //文件类型名
        optionsFileName:[],
        //查看设计图档参数
        designSort:'',
        // 查询参数
        queryParams: {
          pageNo: 1,
          pageSize: 10,
        },
        // 文件类型查询参数
        queryParamsFiles: {
          pageNo: 1,
          pageSize: 100,
        },
      };
    },
    created() {
      this.getListDocumentation();
      this.getListFiles();
    },
    methods: {
      /** 分页查询编程列表 */
      getListDocumentation() {
        this.loading = true;
        listProgramDocPage(this.queryParams).then(response => {
          this.documentationList = response.data.records;
          this.total = Number(response.data.total);
          this.loading = false;
        });
      },
      /** 分页查询工艺列表*/
      getListProcess() {
        this.loading = true;
        this.queryParams.prodOrderNo = this.prodOrderNo
        listProcessPage(this.queryParams).then(response => {
          this.processList = response.data.records;
          this.totalProcess = Number(response.data.total);
          this.loading = false;
        });
      },
      /** 分页查询设计图档*/
      getListDesignDoc() {
        this.queryParams.code = this.code
        this.queryParams.prodOrderNo = this.prodOrderNo
        this.queryParams.sort = this.designSort
        viewDesignDoc(this.queryParams).then(response => {
          this.designList = response.data.records;
          this.totalDesign = Number(response.data.total);
        });
      },
      /** 分页查询文件类型 */
      getListFiles() {
        getFileTypePage(this.queryParamsFiles).then(res =>{
          this.optionsFileName = res.data.records;
        })
      },
      /** 查看工艺按钮 */
      handleProcess(row) {
        this.open = true;
        this.prodOrderNo = row.prodOrderNo
        this.title = "生产单号"+ this.prodOrderNo + "的工件工艺列表"
        this.getListProcess();
      },
      /** 查看设计文档按钮 */
      handleDesign(row) {
        this.code = row.code
        this.designSort = row.sort
        this.openDraw = true;
        this.title = "工序" + this.code +"相关文件"
        this.getListDesignDoc();
      },
      /** 搜索按钮操作 */
      handleQuery() {
        this.queryParams.pageNo = 1;
        this.getListDocumentation();
      },
      /** 设计图档搜索按钮操作 */
      handleQueryDesign() {
        this.queryParamsFiles.pageNo = 1;
        this.getListDesignDoc();
      },
    }
  };
</script>

