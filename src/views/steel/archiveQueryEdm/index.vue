<template>
  <div class="app-container">
    <el-row :gutter="24">
      <el-col :span="24">
        <!-- @keyup.enter.native="handleQuery" -->
    <el-card>
      <div slot="header">
      <el-form :model="queryParams" ref="queryForm" v-show="showSearch" :inline="true">
        <el-form-item label="模号" prop="moduleNo">
            <el-input
              v-model="queryParams.moduleNo"
              placeholder="输入模号"
              clearable
              size="small"
              style="width: 200px"
            />
        </el-form-item>

        <el-form-item label="件号" prop="pieceNo">
            <el-input
              v-model="queryParams.pieceNo"
              placeholder="输入件号"
              clearable
              size="small"
              style="width: 200px"
            />
        </el-form-item>

        <el-form-item label="生产单号" prop="workpieceProdOrderNo">
            <el-input
              v-model="queryParams.workpieceProdOrderNo"
              placeholder="输入生产单号"
              clearable
              size="small"
              style="width: 200px"
            />
        </el-form-item>

        <el-form-item label="电极生产单号" prop="electrodeProdOrderNo">
            <el-input
              v-model="queryParams.electrodeProdOrderNo"
              placeholder="输入电极生产单号"
              clearable
              size="small"
              style="width: 200px"
            />
        </el-form-item>

        <el-form-item label="电极RFID" prop="rfid">
            <el-input
              v-model="queryParams.rfid"
              placeholder="输入电极RFID"
              clearable
              size="small"
              style="width: 200px"
            />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery"></el-button>
          <el-button plain icon="el-icon-download" size="mini" style="margin-bottom: 10px;background-color: #6B68CD;color: #ffffff" @click="handleExport">导出</el-button>
        </el-form-item>
      </el-form>
      </div>

    <div>

<!--      <el-table v-loading="loading" :data="scheduleArtificialListOut" style="width: 100%" border>-->
<!--        <el-table-column type="expand">-->
<!--          <template slot-scope="props">-->

      <el-table v-loading="loading" :data="edmList" @selection-change="handleSelectionChange" 
       max-height="800px" border highlight-current-row>
        <el-table-column type="selection" align="center" />
        <el-table-column label="序号"  type="index" width="30"/>
        <!-- <el-table-column label="操作" align="center" class-name="small-padding fixed-width"  width="200">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="修改顺位" placement="top-start">
              <el-button
                size="primary"
                circle
                icon="el-icon-edit"
                @click="handleConfirm(scope.row,'修改顺位')"
              ></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="电极特采" placement="top-start">
            <el-button
              size="primary"
              circle
              icon="el-icon-edit"
              :disabled="isDisabled"
              v-preventReClick="2000"
              @click="handleConfirm(scope.row,'电极特采')"
            ></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="电极OK" placement="top-start">
            <el-button
              size="primary"
              circle
              icon="el-icon-edit"
              :disabled="isDisabled"
              v-preventReClick="2000"
              @click="handleConfirm(scope.row,'电极OK')"
            ></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="电极NG" placement="top-start">
            <el-button
              size="primary"
              circle
              icon="el-icon-edit"
              :disabled="isDisabled"
              v-preventReClick="2000"
              @click="handleConfirm(scope.row,'电极NG')"
            ></el-button>
          </el-tooltip>
          </template>
        </el-table-column> -->
        <el-table-column label="派工单号" prop="dispatchOrderNo" width="110"/>
        <el-table-column label="模号" prop="moduleNo" :show-overflow-tooltip="true"/>

        <el-table-column label="件号" prop="pieceNo" />
        <el-table-column label="生产单号" prop="workpieceProdOrderNo" :show-overflow-tooltip="true" width="130"/>
        <el-table-column label="电极生产单号" prop="electrodeProdOrderNo" :show-overflow-tooltip="true" width="130"/>
        <el-table-column label="材质" prop="electrodeMaterial" />
        <el-table-column label="数量" prop="quantity" width="50"/>
        <el-table-column label="电极号" prop="electrodeBno" width="130"/>
        <el-table-column label="使用顺位" prop="processPosition" :show-overflow-tooltip="true"/>
        <el-table-column label="电极序号" prop="electrodeNo" />
        <el-table-column label="RFID" prop="rfid" />
        <el-table-column label="加工状态" prop="currentTask" />
        <el-table-column label="量测结果" prop="measureResult" width="100" align="center">
            <template slot-scope="scope">
             <div style="display: flex; align-items: center; justify-content: space-between;">
              <!-- 显示量测结果 -->
<el-tag v-if="scope.row.measureResult === 'OK'" type="primary">
<span style="flex: 1; text-align: left;font-weight: 800;color:green;">{{ scope.row.measureResult }}</span>
          </el-tag>
<el-tag v-if="scope.row.measureResult === 'TC'" type="primary">
<span style="flex: 1; text-align: left;font-weight: 800;color:burlywood;">{{ scope.row.measureResult }}</span>
          </el-tag>
<el-tag v-if="scope.row.measureResult === 'NG'" type="primary">
<span style="flex: 1; text-align: left;font-weight: 800;color:red;">{{ scope.row.measureResult }}</span>
          </el-tag>
              
             </div>
            </template>
        </el-table-column>
        <el-table-column label="量测文档" prop="measureResult" align="center" >
            
            <template slot-scope="scope">
              <el-button
                type="primary"
                circle
                @click="watchCmmFiles(scope.row)"
                :disabled = "elecMultiple"
              >查看</el-button>
            </template>
        </el-table-column>
        <el-table-column label="工件图档" prop="steelFile" >
          <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="查看图档" placement="top-start">
              <el-button
                circle
                type="info"
                icon="el-icon-folder-opened"
                @click="watchSteelFiles(scope.row)"
                style="margin-left: 5px"
              ></el-button>
          </el-tooltip>
        </template>
        </el-table-column>
        <el-table-column label="电极图档" prop="electrodeFile">
          <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="查看图档" placement="top-start">
              <el-button
                circle
                type="info"
                icon="el-icon-folder-opened"
                @click="watchElctrodeFiles(scope.row)"
                style="margin-left: 5px"
              ></el-button>
          </el-tooltip>
        </template>
        </el-table-column>
        <el-table-column label="电极参数" >
             <template slot-scope="scope">
              <el-button
                type="primary"
                circle
                @click="handleWatchCustomer(scope.row)"
              >查看</el-button>
            </template>
        </el-table-column>
      
      </el-table>
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="queryParams.pageNo"
        :limit.sync="queryParams.pageSize"
        @pagination="getEDMList"
      />
    </div>
    </el-card>
    </el-col>
    </el-row>

    <!-- 查看电极量测结果数据 -->
    <el-dialog :title="measureResult.title" :visible.sync="measureResult.open" width="1600px" append-to-body>
      <el-table :data="measureResultList" v-loading="loading" border max-height="900px">
        <el-table-column label="序号" type="index" align="center"/>
        <el-table-column label="工件生产单号" prop="workpieceProdOrderNo" align="center"/>
        <el-table-column label="电极生产单号" prop="electrodeProdOrderNo" align="center"/>
        <el-table-column label="EDM工序序号" prop="edmNo" align="center"/>
        <el-table-column label="模号" prop="moduleNo" align="center"/>
        <el-table-column label="件号" prop="pieceNo" align="center"/>
        <el-table-column label="版本" prop="versionNo" align="center"/>
        <el-table-column label="电极RFID" prop="rfid" align="center"/>
        <el-table-column label="最大间隙" prop="maxGap" align="center"/>
        <el-table-column label="平均间隙" prop="avgGap" align="center"/>
        <el-table-column label="x偏差" prop="x" align="center"/>
        <el-table-column label="y偏差" prop="y" align="center"/>
        <el-table-column label="c偏差" prop="c" align="center"/>
        <el-table-column label="z偏差" prop="z" align="center"/>
        <el-table-column label="量测结果" prop="testResult" align="center"/>
        <el-table-column label="量测NG需要原因" prop="reason" align="center"/>

        <el-table-column label="同大同小规格" prop="uniformOversize" align="center"/>
        <el-table-column label="同大同小上公差" prop="uoUpTolerance" align="center"/>
        <el-table-column label="同大同小下公差" prop="uoLowTolerance" align="center"/>
        <el-table-column label="XY最大值" prop="xyMaxGap" align="center"/>
        <el-table-column label="XY最小值" prop="xyMinGap" align="center"/>
        <el-table-column label="XY差值" prop="xyDifferential" align="center"/>
        <el-table-column label="XY平均值" prop="xyAvgGap" align="center"/>
        <el-table-column label="XY是否同大同小" prop="xyUO" align="center"/>
        <el-table-column label="Z最大值" prop="zMaxGap" align="center"/>
        <el-table-column label="Z最小值" prop="zMinGap" align="center"/>
        <el-table-column label="Z差值" prop="zDifferential" align="center"/>
        <el-table-column label="Z平均值" prop="zAvgGap" align="center"/>
        <el-table-column label="Z是否同大同小" prop="zUO" align="center"/>

        <el-table-column label="c偏差角度" prop="angle" align="center"/>
        <el-table-column label="创建时间" prop="createTime" align="center"/>
        <el-table-column label="修改时间" prop="updateTime" align="center"/>
        
      </el-table>
      <!-- <pagination
        v-show="totalMeasureResult>0"
        :total="totalMeasureResult"
        :page.sync="queryParamsMeasureResult.pageNo"
        :limit.sync="queryParamsMeasureResult.pageSize"
        @pagination="getListMeasure"
      /> -->
    </el-dialog>

    <!-- 查看电极辅助量测报告 -->
    <el-dialog :title="measure.title" :visible.sync="measure.open" width="800px" append-to-body>
      <el-table :data="measureList" v-loading="loading" border max-height="600px">
        <el-table-column label="序号" type="index" align="center"/>
        <el-table-column label="生产单号-电极序号" align="center">
          <template slot-scope="scope">
            <p>{{scope.row.prodOrderNo}}-{{scope.row.electrodeNo}}</p>
          </template>
        </el-table-column>
        <el-table-column label="文件名" prop="fileName" align="center"/>
        <el-table-column label="上传时间" prop="createTime" align="center"/>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="查看设计图档" placement="top-start">
              <el-button
                type="primary"
                circle
                icon="el-icon-folder-opened"
                @click="handleSeeDrawing(scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="totalMeasure>0"
        :total="totalMeasure"
        :page.sync="queryParamsMeasure.pageNo"
        :limit.sync="queryParamsMeasure.pageSize"
        @pagination="getListMeasure"
      />
    </el-dialog>

   <!-- 工件图档对话框 -->
   <el-dialog :title="files.title" :visible.sync="files.open" width="900px">
      <el-row :gutter="24">
        <el-col :span="24">
          <span>工件图档</span>
          
          <el-table :data="filesData" border max-height="600px">
            <el-table-column property="pieceNo" label="件号" >
              <template slot-scope="scope">
                <span>{{pieceNo}}</span>
              </template>
            </el-table-column>
            <el-table-column property="name" label="图纸名称" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-tooltip class="item" effect="dark" content="查看客户图档" placement="top-start">
                  <el-button
                    type="primary"
                    circle
                    icon="el-icon-folder-opened"
                    @click="handleSeeDrawing(scope.row,1)"
                  ></el-button>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="下载客户图档" placement="top-start">
                  <el-button
                    type="primary"
                    circle
                    icon="el-icon-download"
                    @click="handleDownloadDrawing(scope.row)"
                  ></el-button>
                </el-tooltip>
              </template>

              </el-table-column>
          </el-table>
          <pagination
            v-show="totalFile>0"
            :total="totalFile"
            :page.sync="queryParams.pageNo"
            :limit.sync="queryParams.pageSize"
            @pagination="getFile()"
          />
          </el-col>
        
      </el-row>
    </el-dialog>

    <!-- 查看设计文档对话框 -->
    <el-dialog :title="title" :visible.sync="openDraw" width="800px" append-to-body>
      <el-button
        type="primary"
        icon="el-icon-folder-opened"
        style="margin-bottom: 20px"
      >文件类型</el-button>
      <el-button
        type="primary"
        @click="suffixPdf"
      >pdf</el-button>
      <el-button
        type="primary"
        @click="suffixPrt"
      >prt</el-button>
      <el-button
        type="primary"
        @click="suffixNc"
      >nc</el-button>
      <el-button
        type="primary"
        @click="suffixAll"
      >全部</el-button>
      <el-table :data="designList" v-loading="loading" border max-height="600px">
        <el-table-column label="文件类型" prop="camFileName" align="center"/>
        <el-table-column label="文件名" prop="fileName" align="center"/>
        <el-table-column label="控制器类型" prop="brand" align="center"/>
        <el-table-column label="上传人姓名" prop="createByName" align="center"/>
        <el-table-column label="工号" prop="createBy" align="center"/>
        <el-table-column label="上传时间" prop="createTime" align="center"/>
        <el-table-column label="操作" prop="createTime" align="center">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="查看设计图档" placement="top-start">
              <el-button
                type="primary"
                circle
                icon="el-icon-folder-opened"
                @click="handleSeeDrawing(scope.row)"
              ></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="下载设计图档" placement="top-start">
                  <el-button
                    type="primary"
                    circle
                    icon="el-icon-download"
                    @click="handleDownloadDrawing(scope.row)"
                  ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="totalDesign>0"
        :total="totalDesign"
        :page.sync="queryParamsDraw.pageNo"
        :limit.sync="queryParamsDraw.pageSize"
        @pagination="getListDesignDoc"
      />
    </el-dialog>

    <!--程式参数对话框-->
    <el-dialog :title="titleProgram" :visible.sync="openProgram" width="1300px" append-to-body>
      <el-row :gutter="20">
         <el-col :span="24">
          <h2>电火花放电参数列表</h2>
          <el-table :data="camElectrodList" border>
            <el-table-column label="X方向平移距离" align="center" prop="xpitch"></el-table-column>
            <el-table-column label="X方向平移次数" align="center" prop="xjump"></el-table-column>
            <el-table-column label="Y方向平移次数" align="center" prop="yjump"></el-table-column>
            <el-table-column label="Y方向平移距离" align="center" prop="ypitch"></el-table-column>
            <el-table-column label="VDI底面纹，第一个程式" align="center" prop="vdiFloor"></el-table-column>
            <el-table-column label="VDI侧面纹，第二个程式" align="center" prop="vdiSide"></el-table-column>
            <el-table-column label="放电间隙（火花位）" align="center" prop="sparkGap"></el-table-column>
            <el-table-column label="实体是否已缩放电间隙" align="center" prop="bodyScaled"></el-table-column>
            <el-table-column label="摇动方式（圆摇、方摇、球摇）" align="center" prop="orbitType"></el-table-column>
            <el-table-column label="电极作用" align="center" prop="elecUse"></el-table-column>
            <el-table-column label="电极上公差" align="center" prop="elecUpTol"></el-table-column>
            <el-table-column label="电极下公差" align="center" prop="elecDownTol"></el-table-column>
            <el-table-column label="加工面积，投影面积" align="center" prop="edmFace"></el-table-column>
            <el-table-column label="放电模型能量面积" align="center" prop="edmArea"></el-table-column>
            <el-table-column label="实体是否已缩放电间隙" align="center" prop="bodyScaled"></el-table-column>
            <el-table-column label="工位精度" align="center" prop="edmAreaPrecision"></el-table-column>
            <el-table-column label="夹具型号" align="center" prop="fixtureNumber"></el-table-column>
            <el-table-column label="固定方式" align="center" prop="elecFixture"></el-table-column>
            <el-table-column label="有效高度" align="center" prop="effectiveHeight"></el-table-column>
          </el-table>
          <!-- <pagination
            v-show="totalCamElectrod>0"
            :total="totalCamElectrod"
            :page.sync="queryParamsCam.pageNo"
            :limit.sync="queryParamsCam.pageSize"
            @pagination="getListCamElectrod"
          /> -->
        </el-col>

      </el-row>
      <el-row :gutter="20">
         <el-col :span="24">
          <h2>电极火花加工位置列表</h2>
          <el-table :data="camSparkList" border>
            <el-table-column label="第一个位置X起始值" align="center" prop="posX0"></el-table-column>
            <el-table-column label="第一个位置Y起始值" align="center" prop="posY0"></el-table-column>
            <el-table-column label="第一个位置Z起始值" align="center" prop="posZ0"></el-table-column>
            <el-table-column label="第一个位置起始选转角度" align="center" prop="posRev0"></el-table-column>
            <el-table-column label="第一个位置X终止值" align="center" prop="posX"></el-table-column>
            <el-table-column label="第一个位置Y终止值" align="center" prop="posY"></el-table-column>
            <el-table-column label="第一个位置Z终止值" align="center" prop="posZ"></el-table-column>
            <el-table-column label="第一个位置终止选转角度" align="center" prop="posRev"></el-table-column>
            <el-table-column label="第一个位置电极装夹旋转角度" align="center" prop="posRot"></el-table-column>
            <el-table-column label="第一个位置电极放电朝向" align="center" prop="sparkVect"></el-table-column>
            <el-table-column label="第一个位置电极基准Z最高点位置" align="center" prop="posTopZ"></el-table-column>
            <el-table-column label="第一个位置电极侧放电动量" align="center" prop="posSideSpark"></el-table-column>
          </el-table>
          <!-- <pagination
            v-show="totalCamSpark>0"
            :total="totalCamSpark"
            :page.sync="queryParamsCamSpark.pageNo"
            :limit.sync="queryParamsCamSpark.pageSize"
            @pagination="getListCamSpark"
          /> -->
        </el-col>

      </el-row>
    </el-dialog>

  </div>
</template>

<script>
  import { getDispatch } from "../../../api/production/steeling/scheduleArtificial";
  import { listArchiveQueryEdm,getEdmProcessList } from "../../../api/production/eleprocess/poleprocess";
  import {
    getDrawingFile,
    getPublicDrawingFile,
     isDraw
  } from "../../../api/order/orderbom"
  import { Base64 } from 'js-base64'
  import downloadGlobal from '@/store/downloadGlobal'
  import {viewDesignDoc} from "../../../api/camdesign/documentation";
  import { getCamElectrodeBom,getCamSparkList } from '@/api/jy/electrodeMange'
  import { getMeasurementFilePage} from '../../../api/eleContact/eleContactForm'
  import { getCmmSparkPointList,updateCmmMeasureResult  } from '@/api/production/edmAutomation'
  import { ElMapExportTable } from 'table-excel'

  export default {
    name: "ArchiveQueryEdm",
    // inject: ['reload'],
    data() {
      return {
        // 刷新标识
        isReloadData: true,
        pieceNo:{},
        name: {},
        workpiece: "",
        equipmentSectionId: [],
        //工件列表数据
        designList:[],
        // 设置表单左对齐
        labelPosition: 'left',
        // 时间选择器
        //派工单号
        PgNo:{},
        // 遮罩层
        loading: true,
        // 选中数组
        ids: [],
        // 工件类型删除id
        id: [],
        // 选中数组代码
        codes: [],
        // 选中数组设备状态
        status: [],
        // 非单个禁用
        single: true,
        // 非多个禁用
        multiple: true,
        multipled: true,
        // 显示搜索条件
        showSearch: true,
        //上传图档按钮是否可见
        isDrawing:true,
        openDraw: false,
        openProgram: false,
        // 删除传参
        Id:'',
        // 总条数
        total: 0,
        totalDesign:0,
        totalCamElectrod:0,
        hisProdOrderNo: '',
        queryParamsCam: {
          pageNo: 1,
          pageSize: 10,
        },
        titleProgram: "",
        totalCamSpark:0,
        camSparkList: [],
        camElectrodList: [],
        queryParamsCamSpark: {
          pageNo: 1,
          pageSize: 10,
        },
        //按钮禁用
        isDisabled:false,
        isDisable:false,
        // 人工排产表格数据
        scheduleArtificialList: [],
        scheduleArtificialListOut: [],

        // edm电极list
        edmList: [],
        processList: [],
        dispatchList: [],
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        openDispatch: false,
        openAppoint: false,
        // 日期范围
        dateRange: [],
        //类型
        type: [],
        // 查询参数
        queryParams: {
          pageNo: 1,
          pageSize: 10,
        },
        // 查询参数
        queryParamsProcess: {
          pageNo: 1,
          pageSize: 50,
        },
        // 表单参数
        form: {},
        formSetting: {},
        measureResultList: [],
        measureResult: {
          // 是否显示弹出层
          open: false,
          // 弹出层标题
          title: "电极量测结果",
        },
        files:{
          // 是否显示弹出层
          open: false,
          // 弹出层标题
          title: "工件图档",
        },
        //变更图档参数
        filesChange:{
          // 是否显示弹出层
          open: false,
          // 弹出层标题
          title: "工件图档",
        },
        //判断电极序号是否存在
        elecMultiple:false,
        totalMeasure:0,
        totalMeasureResult:0,
        // 查询参数
        queryParamsMeasure: {
          pageNo: 1,
          pageSize: 10,
        },
        queryParamsMeasureResult: {
         
        },
        //辅助量测弹窗
        measure:{
          title:"",
          open:false,
        },
      
        //辅助量测表单数据
        measureList:[],
        //辅助量测选中数据
        measureCode:'',
        measureSort:'',
        //工件图档表格数据
        filesData:[],
         // 总条数
        total: 0,
        totalOrder:0,
        totalFile:0,
        totalPublicFile:0,
         // 查询参数
         queryParamsDraw: {
          pageNo: 1,
          pageSize: 10,
        },
        //公共图档表格数据
        publicFilesData:[],
        detailId:'',
        prodOrderNo:'',

      }
    },
    created() {
      this.getEDMList();
    },
    mounted() {
      // this.PieceNo = this.$route.query.pieceNo
      // this.name = this.$route.query.name
      // console.log(1111)
    },
    methods: {
      // 刷新当前页面，在修改数据之后 this.reload 一下就可以完成刷新当前这个指定标签的刷新
      /*reload() {
        this.isReloadData = false;
        this.$nextTick(() => {
          this.isReloadData = true;
        })
      },*/
/** 分页查询辅助量测报告 */
      /** 查看客户图档 */
     watchCmmFiles(row) {
      this.queryParamsMeasure.prodOrderNo = row.electrodeProdOrderNo
      this.queryParamsMeasure.electrodeNo = row.electrodeNo
      this.queryParamsMeasure.code = row.code
      this.queryParamsMeasure.sort = row.sort
      this.measure.open = true
      this.measure.title = "辅助量测报告"
      this.getListMeasure()
     
    },
    getListMeasure() {
        
        getMeasurementFilePage(this.queryParamsMeasure).then(res => {
          this.measureList = res.data.records
          this.totalMeasure = res.data.total
        })
        
    },
    tecai(row){
      updateCmmMeasureResult(row).then(res => {
          this.$message.success("特采成功！");
          this.getEDMList();
      })

      // 修改   。。  特采

    },
    watchCmmResult(row){
      
      this.queryParamsMeasureResult.workpieceProdOrderNo = row.workpieceProdOrderNo
      this.queryParamsMeasureResult.electrodeProdOrderNo = row.electrodeProdOrderNo
      this.queryParamsMeasureResult.electrodeNo = row.electrodeNo
      this.queryParamsMeasureResult.RFID = row.rfid
      this.queryParamsMeasureResult.sort = row.sort
      this.measureResult.open = true
      this.measureResult.title = "查看量测数据"
      this.getListMeasureResult()
    },
    getListMeasureResult() {
        getCmmSparkPointList(this.queryParamsMeasureResult).then(res => {
          
          this.measureResultList = res;
        })
    },
    getEDMList(){
      listArchiveQueryEdm(this.queryParams).then(response => {
        console.log('www',response)
        this.edmList = response.data.records;
        this.pieceNo = response.data.pieceNo
        this.total = response.data.total;
        this.loading = false;
      });
    },

    /** 查询派工列表 */
    getDispatchList() {
      this.loading = true;
      getDispatch(this.queryParams).then(response => {
        this.dispatchList = response.data;
        this.loading = false;
      });
    },

      // 取消按钮
      cancel() {
        this.open = false;
        this.reset();
      },
      cancelDispatch() {
        this.openDispatch = false;
        this.reset();
      },
      cancelAppoint() {
        this.openAppoint = false;
        this.reset();
      },
      /** 搜索按钮操作 */
      handleQuery() {
        this.queryParams.pageNo = 1;
        this.getEDMList();
      },
      // 表单重置
      reset() {
        this.form = {
          unitPrice: undefined,
          code: undefined,
          name: undefined,
          createBy: undefined,
          createTime: undefined,
          typeName: undefined,
          operationCategory: undefined,
          groupDevicesNum: undefined,
          id: undefined,
          updateBy: undefined,
          updateTime: undefined,
          status: "0",
          workpieceTypeId: undefined
        };
        this.resetForm("form");
      },
      // 多选框选中数据
      handleSelectionChange(selection) {
        this.ids = selection.map(item => item.id)
        this.status = selection.map(item => item.status)
        this.detailIds = selection.map(item => item.detailId)
        this.single = selection.length!=1
        this.multiple = !selection.length
        this.multipled = !selection.length
      },
      /** 搜索按钮操作 */
      handleSearch() {
        this.reset();
        this.open = true;
        this.title = "搜索";
      },
      handleWatchCustomer(row) {
        this.openProgram = true;
        this.titleProgram = "电极程式参数";
        this.getListCamElectrod(row);
        this.getListCamSpark(row);
      },
      getListCamElectrod(row) {
       this.camSparkList = [];
       this.camElectrodList = [];
       this.queryParamsCam.electrodeProdOrderNo = row.electrodeProdOrderNo

        getCamElectrodeBom({"electrodeProdOrderNo":row.electrodeProdOrderNo}).then(resp=>{
            this.camElectrodList = resp.data
            
            //this.totalCamElectrod = resp.data.total
          })
       
      },
      getListCamSpark(row) {
        
        this.queryParamsCamSpark.prodOrderNo = row.electrodeProdOrderNo
        getCamSparkList({"prodOrderNo":row.electrodeProdOrderNo}).then(resp=>{
            this.camSparkList = resp.data
            
            //this.totalCamElectrod = resp.data.total
          })
      },
      // 提取文件后缀名
      getSuffix(str) {
          const fileExtension = str.substring(str.lastIndexOf(".") + 1);
          return fileExtension;
        },
      /** 查看客户图档 */
        handleSeeDrawing(row,i) {
          console.log(this.token)
          this.files.open = false
          let suffix = this.getSuffix(row.url)
          if(suffix === 'prt' || suffix === 'dwg' || suffix === 'svlx' || suffix === 'vsf'){
            if(suffix === 'prt'){
              const url = downloadGlobal.hostUpload + row.url + '.svlx'
              // const url = global.hostUpload + row.url + '.svlx'
              this.$router.push({
                path:'/camdesign/programme-edit/alreadyCancel',
                query:{
                  url: url,
                  dispatchOrderNo: row.dispatchOrderNo,
                  prodOrderNo: row.prodOrderNo,
                  rfid:this.rfid,
                  token:this.token,
                  bomId:row.bomId,
                  type: i
                },
              });
              this.openDraw = false;
            }else if(suffix === 'dwg'){
              const url = downloadGlobal.hostUpload + row.url + '.vsf'
              // const url = global.hostUpload + row.url + '.vsf'
              this.$router.push({
                path:'/camdesign/programme-edit/alreadyStop',
                query:{
                  url: url,
                  dispatchOrderNo: row.dispatchOrderNo,
                  prodOrderNo: row.prodOrderNo,
                  bomId:row.bomId,
                  type: i
                },
              });
            }
          }else if(suffix === 'stp' || suffix === 'step'){
            const url = downloadGlobal.hostUpload + row.url
            // const url = downloadGlobal.hostUpload + "/draw/H719888/123/123.stp"
            // window.open('http://127.0.0.1:8012/onlinePreview?url='+encodeURIComponent(Base64.encode(url)))
            window.open(downloadGlobal.hostWatch + '/onlinePreview?url='+encodeURIComponent(Base64.encode(url)))
          } else if(suffix === 'pdf' || suffix === 'xlsx' || suffix === 'xls' ) {
            const changeurl = row.url.split('.')[0]+'.pdf'
            const url = downloadGlobal.hostUpload + changeurl
            // const url = global.hostUpload + changeurl
            //alert('http://127.0.0.1:8012/onlinePreview?url='+encodeURIComponent(Base64.encode(url)))
            // window.open('http://127.0.0.1:8012/onlinePreview?url='+encodeURIComponent(Base64.encode(url)));
            window.open(downloadGlobal.hostWatch + '/onlinePreview?url='+encodeURIComponent(Base64.encode(url))+ '&officePreviewType=pdf');
            // window.open(global.hostWatch + '/onlinePreview?url='+encodeURIComponent(Base64.encode(url))+ '&officePreviewType=pdf');
            // window.open('http://10.47.71.26:8012/onlinePreview?url='+encodeURIComponent(Base64.encode(url)));
          }else if(suffix === 'html' ){

            const path = row.filePath
            // 如果 path 里含有子目录，按段编码
            const httpUrl = downloadGlobal.hostHead + `/cmm/cmm/view?path=${encodeURIComponent(path)}`;
            window.open(httpUrl, '_blank', 'noopener');

          }else{
            this.$modal.msgError("该文件格式暂不支持在线预览，请下载后查看")
          }
        },
    
    watchSteelFiles(row) {
       this.detailId = row.id
       this.pieceNo = row.pieceNo
       this.status = row.status
       this.prodOrderNoDraw = row.prodOrderNo
       this.files.open = true
       this.files.title = "工件图档"
       this.queryParams.prodOrderNo  = row.workpieceProdOrderNo ;
       
       this.getSteelFile();
     },
     watchElctrodeFiles(row) {
      
       this.queryParamsDraw.prodOrderNo  = row.workpieceProdOrderNo
       this.queryParamsDraw.code = row.code;
       this.queryParamsDraw.sort = row.sort;
       this.queryParamsDraw.suffix = '';
       this.openDraw = true;
       this.title = "电极图档"
       this.getListDesignDoc();
     },
     /** 分页查询设计图档*/
    getListDesignDoc() {
      this.queryParamsDraw.suffix = this.suffix
      this.designList = [];
          viewDesignDoc(this.queryParamsDraw).then(response => {
            this.designList = response.data.records;
            this.totalDesign = Number(response.data.total);
          });
    },
     getSteelFile(status) {
       this.queryParams.datasource = status;
       this.filesData = [] ;
       this.getFile();
       //this.getPublicFile();
       
       /* selectSteelFile(this.queryParamsDraw).then(response =>{
         this.filesData = response.data.records
         this.totalFile = response.data.total
       }); */
     },
     /** 导出按钮操作 */
      handleExport() {
        this.loading = true
        setTimeout(()=>{
          this.loading=false   //点击一次时隔五秒后才能再次点击
        },3000)
        
        getEdmProcessList(this.queryParams).then(response => {
             const edmdata = response ;
             console.log('edmdata', edmdata)
             const column = [
            { title: "派工单号", dataIndex: "dispatchOrderNo" },
            { title: "模号", dataIndex: "moduleNo" },
            { title: "件号", dataIndex: "pieceNo" },
            { title: "生产单号", dataIndex: "workpieceProdOrderNo" },
            { title: "电极生产单号", dataIndex: "electrodeProdOrderNo" },
            { title: "材质", dataIndex: "electrodeMaterial" },
            { title: "数量", dataIndex: "quantity" },
            { title: "电极号", dataIndex: "electrodeBno" },
            { title: "使用顺位", dataIndex: "processPosition" },
            { title: "电极序号", dataIndex: "electrodeNo" },
            { title: "RFID", dataIndex: "rfid" },
            { title: "治具类型", dataIndex: "rfidType" },
            { title: "加工状态", dataIndex: "currentTask" },
            
            { title: "X方向平移距离", dataIndex: "xpitch" },
            { title: "X方向平移次数", dataIndex: "xjump" },
            { title: "Y方向平移次数", dataIndex: "yjump" },
            { title: "Y方向平移距离", dataIndex: "ypitch" },
            { title: "VDI底面纹，第一个程式", dataIndex: "vdiFloor" },
            { title: "VDI侧面纹，第二个程式", dataIndex: "vdiSide" },
            { title: "放电间隙（火花位）", dataIndex: "sparkGap" },
            { title: "实体是否已缩放电间隙", dataIndex: "bodyScaled" },
            { title: "摇动方式（圆摇、方摇、球摇）", dataIndex: "orbitType" },
            { title: "电极作用", dataIndex: "elecUse" },
            { title: "电极上公差", dataIndex: "elecUpTol" },
            { title: "电极下公差", dataIndex: "elecDownTol" },
            { title: "加工面积，投影面积", dataIndex: "edmFace" },
            { title: "放电模型能量面积", dataIndex: "edmArea" },
            { title: "工位精度", dataIndex: "edmAreaPrecision" },
            { title: "夹具型号", dataIndex: "fixtureNumber" },
            { title: "固定方式", dataIndex: "elecFixture" },
            { title: "有效高度", dataIndex: "effectiveHeight" },

            { title: "第一个位置X起始值", dataIndex: "posX0" }, 
            { title: "第一个位置Y起始值", dataIndex: "posY0" }, 
            { title: "第一个位置Z起始值", dataIndex: "posZ0" }, 
            { title: "第一个位置起始选转角度", dataIndex: "posRev0" }, 
            { title: "第一个位置X终止值", dataIndex: "posX" }, 
            { title: "第一个位置Y终止值", dataIndex: "posY" }, 
            { title: "第一个位置Y起始值", dataIndex: "posY0" }, 
            { title: "第一个位置Z终止值", dataIndex: "posZ" }, 
            { title: "第一个位置终止选转角度", dataIndex: "posRev" }, 
            { title: "第一个位置电极装夹旋转角度", dataIndex: "posRot" }, 
            { title: "第一个位置电极放电朝向", dataIndex: "sparkVect" }, 
            { title: "第一个位置电极基准Z最高点位置", dataIndex: "posTopZ" }, 
            { title: "第一个位置电极侧放电动量", dataIndex: "posSideSpark" }, 

            { title: "EDM工序序号", dataIndex: "edmNo" },
            { title: "版本", dataIndex: "versionNo" },
            { title: "最大间隙", dataIndex: "maxGap" },
            { title: "平均间隙", dataIndex: "avgGap" },
            { title: "x偏差", dataIndex: "x" },
            { title: "y偏差", dataIndex: "y" },
            { title: "c偏差", dataIndex: "c" },
            { title: "z偏差", dataIndex: "z" },
            { title: "量测结果", dataIndex: "testResult" },
            { title: "量测NG需要原因", dataIndex: "reason" },
            { title: "c偏差角度", dataIndex: "angle" },
            { title: "更新时间", dataIndex: "updateTime" },
            
            
          ];
          const instance = new ElMapExportTable(
            { column,
             data: edmdata   // 这里必须是 data},
            }
          );
          // 导出的文件名
          instance.download("EDM档案数据").then((edmdata) => {
            this.loading = false
          }); 
          
        });

           /* const edmdata = response.data.records;
           */

        
      },
     /** 查看客户图档 */
      getFile() {
        // this.queryParams.prodOrderNo = this.fileOrderNo
        getDrawingFile(this.queryParams).then(res =>{
          this.filesData = res.data.records
          this.totalFile = res.data.total
        });
      },
      getPublicFile() {
        this.queryParams.id = this.bomId
        getPublicDrawingFile(this.queryParams).then(res =>{
          this.publicFilesData = res.data.records
          this.totalPublicFile = res.data.total
        })
      },
      /** 检查生产单是否存在图档 */
      checkIsDrawing() {
        const prodOrderNo = this.prodOrderNoDraw
        isDraw({'prodOrderNo':prodOrderNo}).then(res =>{
          if(res.data === true){
            this.isDrawing = false
          }else {
            this.isDrawing = true
          }
        })
      },
/** 设计图档pdf筛选*/
        suffixPdf(){
          this.suffix = 'pdf'
          this.getListDesignDoc()
        },
        /** 设计图档prt筛选*/
        suffixPrt(){
          this.suffix = 'prt'
          this.getListDesignDoc()
        },
        /** 设计图档nc筛选*/
        suffixNc(){
          this.suffix = 'nc'
          this.getListDesignDoc()
        },
        /** 设计图档全部筛选*/
        suffixAll(){
          this.suffix = ''
          this.getListDesignDoc()
        },
      
      /** 下载客户图档 */
      handleDownloadDrawing(row) {
        let downName = row.name
        let url = downloadGlobal.hostHead + row.url
        // let url = global.hostHead + row.url
        this.getBlob(url, (blob) => {
          this.saveAs(blob, downName)
        })
      },
      getBlob(url, cb) {
        var xhr = new XMLHttpRequest()
        xhr.open('GET', url, true)
        xhr.responseType = 'blob'
        xhr.onload = function() {
          if (xhr.status === 200) {
            cb(xhr.response)
          }
        }
        xhr.send()
      },
      saveAs(blob, filename) {
        if (window.navigator.msSaveOrOpenBlob) {
          navigator.msSaveBlob(blob, filename)
        }
        else {
          var link = document.createElement('a')
          var body = document.querySelector('body')

          link.href = window.URL.createObjectURL(blob)
          link.download = filename

          link.style.display = 'none'
          body.appendChild(link)

          link.click()
          body.removeChild(link)
          window.URL.revokeObjectURL(link.href)
        }
      },
      
    }
  }
</script>


