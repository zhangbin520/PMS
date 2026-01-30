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
        <el-form-item label="任务类别" prop="datasource">
           <el-radio v-model="queryParams.datasource" label="1">电极</el-radio>
           <el-radio v-model="queryParams.datasource" label="0">钢件</el-radio>
         </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery"></el-button>
        </el-form-item>
      </el-form>
      </div>

    <div>

<!--      <el-table v-loading="loading" :data="scheduleArtificialListOut" style="width: 100%" border>-->
<!--        <el-table-column type="expand">-->
<!--          <template slot-scope="props">-->

      <el-table v-loading="loading" :data="edmList" @selection-change="handleSelectionChange"  max-height="800px" border>
        <el-table-column type="selection" align="center" />
        <el-table-column label="序号"  type="index" width="50"/>
        <!-- <el-table-column label="类型" prop="type" >
          <template scope="scope">
            <el-tag v-if="scope.row.type =='0'" type="success">钢件</el-tag>
            <el-tag v-if="scope.row.type=='1'">电极</el-tag>
          </template>
        </el-table-column> -->
        <el-table-column label="派工单号" prop="dispatchOrderNo" />
        <el-table-column label="模号" prop="moduleNo" :show-overflow-tooltip="true"/>
        <el-table-column label="件号" prop="pieceNo" />
        <el-table-column label="生产单号" prop="workpieceProdOrderNo" :show-overflow-tooltip="true"/>
        <el-table-column label="电极生产单号" prop="electrodeProdOrderNo" :show-overflow-tooltip="true"/>
        <el-table-column label="材质" prop="electrodeMaterial" />
        <el-table-column label="数量" prop="quantity" />
        <el-table-column label="RFID" prop="rfid" />
        <el-table-column label="工序" prop="currentSection" :show-overflow-tooltip="true"/>
        <el-table-column label="工段" prop="currentProcess" />
        <el-table-column label="加工状态" prop="currentState" />
        
        <el-table-column label="钢件程序单" prop="issueSize" >
          <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="查看钢件程序单" placement="top-start">
              <el-button
                circle
                type="info"
                icon="el-icon-folder-opened"
                @click="getSheetData(scope.row)"
                style="margin-left: 5px"
              ></el-button>
          </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="电极程序单" prop="issueSize" >
          <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="查看电极程序单" placement="top-start">
              <el-button
                circle
                type="info"
                icon="el-icon-folder-opened"
                @click="openElectrodeCutData(scope.row)"
                style="margin-left: 5px"
              ></el-button>
          </el-tooltip>
          </template>
        </el-table-column>
       
        <el-table-column label="刀具参数" prop="electrodeFile">
          <!-- <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="查看图档" placement="top-start">
              <el-button
                circle
                type="info"
                icon="el-icon-folder-opened"
                @click="watchElctrodeFiles(scope.row)"
                style="margin-left: 5px"
              ></el-button>
          </el-tooltip>
        </template> -->
        </el-table-column>

      </el-table>
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="queryParams.pageNo"
        :limit.sync="queryParams.pageSize"
        @pagination="getCNCList"
      />
    </div>
    </el-card>
    </el-col>
    </el-row>

   <!-- 客户图档对话框 -->
   <el-dialog :title="files.title" :visible.sync="files.open" width="900px">
      <el-row :gutter="24">
        <el-col :span="24">
          <span>电极图档</span>
          
          <el-table :data="filesData" border max-height="600px">
            <el-table-column property="prodOrderNo" label="生产单号" ></el-table-column>
            <el-table-column property="code" label="工序" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column property="fileName" label="图纸名称" :show-overflow-tooltip="true"></el-table-column>
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
                <!-- <el-tooltip class="item" effect="dark" content="删除客户图档" placement="top-start" v-if="status !== '1'">
                  <el-button
                    type="danger"
                    circle
                    icon="el-icon-delete"
                    @click="handleDeleteDrawing(scope.row)"
                  ></el-button>
                </el-tooltip> -->
              </template>
            </el-table-column>
          </el-table>
          <pagination
            v-show="totalFile>0"
            :total="totalFile"
            :page.sync="queryParamsDraw.pageNo"
            :limit.sync="queryParamsDraw.pageSize"
            @pagination="getProcedureSheetFiles"
          />
        </el-col>
      </el-row>
    </el-dialog>


    <!-- 钢件刀具参数对话框 -->
   <el-dialog :title="sheet.title" :visible.sync="sheet.open" width="1100px">
      <el-row :gutter="24">
        <el-col :span="24">
          <span>钢件程序单列表</span>
          <el-table :data="sheetData" border max-height="600px">
            <el-table-column label="序号"  type="index" width="50"/>
            <el-table-column property="manufactureNo" label="生产单号" ></el-table-column>
            <el-table-column property="toolName" label="第一条程序刀具名" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column property="toolNumber" label="第一条程序刀号" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column property="toolLength" label="第一条程序刀长(默认Z最深+2)" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column property="shortestToolLength" label="第一条程序刀长" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column property="calcToolLength" label="第一条程序最短刀长-NX报告后计算得来" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column property="spindleSpeed" label="第一条程序主轴转速" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column property="cutFeedrate" label="第一条程序切削进给" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column property="time" label="切屑时间" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column property="cutPathLength" label="第切屑长度" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column property="toolDiameter" label="第一条程序刀具直径" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column property="toolLowerRadius" label="第一条程序刀具底R" :show-overflow-tooltip="true"></el-table-column>
          </el-table>
          <pagination
            v-show="totalSheet>0"
            :total="totalSheet"
            :page.sync="queryParamsSheet.pageNo"
            :limit.sync="queryParamsSheet.pageSize"
            @pagination="getSheetData"
          />
        </el-col>
      </el-row>
    </el-dialog>

     <!-- 电极刀具参数对话框 -->
   <el-dialog :title="electrodeCut.title" :visible.sync="electrodeCut.open" width="1100px">
      <el-row :gutter="24">
        <el-col :span="24">
          <span>电极程序单列表</span>
          <el-table :data="electrodeData" border max-height="600px">
            <el-table-column label="序号"  type="index" width="50"/>
            <el-table-column property="manufactureNo" label="生产单号" ></el-table-column>
            <el-table-column property="toolName" label="第一条程序刀具名" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column property="toolNumber" label="第一条程序刀号" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column property="toolLength" label="第一条程序刀长(默认Z最深+2)" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column property="shortestToolLength" label="第一条程序刀长" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column property="calcToolLength" label="第一条程序最短刀长-NX报告后计算得来" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column property="spindleSpeed" label="第一条程序主轴转速" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column property="cutFeedrate" label="第一条程序切削进给" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column property="time" label="切屑时间" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column property="cutPathLength" label="切屑长度" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column property="toolDiameter" label="第一条程序刀具直径" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column property="toolLowerRadius" label="第一条程序刀具底R" :show-overflow-tooltip="true"></el-table-column>
            
          </el-table>
          <pagination
            v-show="totalElectrode>0"
            :total="totalElectrode"
            :page.sync="queryParamsElectrode.pageNo"
            :limit.sync="queryParamsElectrode.pageSize"
            @pagination="openElectrodeCutData"
          />
        </el-col>
      </el-row>
    </el-dialog>
   

  </div>
</template>

<script>
  import { listScheduleArtificial, getDispatch, confirmProduction, oneButtonDispatch, process } from "../../../api/production/steeling/scheduleArtificial";
  import { listEquipment } from "../../../api/system/equipment"
  import { listArchiveQueryCnc,selectSteelFile,listSheetData,listElectrodeCutData,getProcedureSheet} from "../../../api/production/eleprocess/poleprocess";
  import {
    getDrawingFile,
    getPublicDrawingFile,
     isDraw
  } from "../../../api/order/orderbom"
  import { Base64 } from 'js-base64'
  import downloadGlobal from '@/store/downloadGlobal'

  export default {
    name: "ArchiveQueryCnc",
    // inject: ['reload'],
    data() {
      return {
        // 刷新标识
        isReloadData: true,
        pieceNo:{},
        name: {},
        equipmentName: '',
        workpiece: "",
        designer: "",
        //
        equipmentSectionId: [],
        //
        equipmentSectionOptions: [],
        //
        wareId: [],
        // 设置表单左对齐
        labelPosition: 'left',
        // 日期选择器
        value1: '',
        // 时间选择器
        value2: '',
        //派工单号
        PgNo:{},
        // 字典{设备id: 设备名}
        dict: {},
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
        // 删除传参
        Id:'',
        // 总条数
        total: 0,
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
        pieceNo:'',
        prodOrderNo:'',
        sheet:{
          // 是否显示弹出层
          open: false,
          // 弹出层标题
          title: "程序单列表",
        },
        sheetData:[],
        totalSheet:0,
        // 查询参数
        queryParamsSheet: {
          pageNo: 1,
          pageSize: 10,
        },

        electrodeCut:{
          // 是否显示弹出层
          open: false,
          // 弹出层标题
          title: "刀具参数列表",
        },
        electrodeData:[],
        totalElectrode:0,
        // 查询参数
        queryParamsElectrode: {
          pageNo: 1,
          pageSize: 10,
        },
      }
    },
    created() {
      this.getCNCList();
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

      getCNCList(){
        listArchiveQueryCnc(this.queryParams).then(response => {
          console.log('www',response)
          this.edmList = response.data.records;
          
          this.total = response.data.total;
          this.loading = false;
        });
      },

      /** 查询人工排产任务列表 */
      getList() {
        this.loading = true;
        const scheduleArtificialList = [];
        const scheduleArtificialListOut = [];
        listScheduleArtificial(this.queryParams).then(response => {
          response.data.records.forEach(function(item){
            item.prodScheduleArtificialList.forEach(function(d) {
              scheduleArtificialList.push(
                {
                  id:d.id,
                  schedulingStatus:d.schedulingStatus,
                  moduleNo:d.moduleNo,
                  pieceNo:d.pieceNo,
                  versionNo:d.versionNo,
                  pinName:d.pinName,
                  quantity:d.quantity,
                  prodOrderNo:d.prodOrderNo,
                  demandDate:d.demandDate,
                  deliveryLevel:d.deliveryLevel,
                  designStatus:d.designStatus,
                  detailId:d.detailId,
                  equipmentSectionId:d.equipmentSectionId,
                  electrodeNo:d.electrodeNo,
                  type:d.type,
                  process:d.process,
                })
            })
            scheduleArtificialListOut.push(item.pNo)
          })
          this.scheduleArtificialList = scheduleArtificialList
          /*this.scheduleArtificialListOut = scheduleArtificialListOut
          this.PgNo = scheduleArtificialListOut.join('')*/
          this.total = response.data.total;
          this.loading = false;
          /*this.reload()*/
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
        this.getCNCList();
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
      // 提取文件后缀名 使用 split 方法按 '.' 分割字符串，并取最后一个部分
      getSuffix(str) {
          const fileExtension = str.split('.').pop();
          // 如果没有找到后缀名，返回空字符串
          if (fileExtension === str) {
            return '';
          }
          // 返回后缀名
          return fileExtension;
        },
        /** 下载客户图档 */
      handleDownloadDrawing(row) {
        let downName = row.fileName
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
      /** 查看客户图档 */
      handleSeeDrawing(row,i) {
        console.log(this.token)
        this.files.open = false
        let suffix = this.getSuffix(row.url)
        if(suffix === 'prt' || suffix === 'dwg' || suffix === 'svlx' || suffix === 'vsf'){
          if(suffix === 'prt'){
            const url = row.url.substring(5) + '.svlx';
            this.$router.push({
              path:'/camdesign/programme-edit/alreadyCancel',
              query:{
                url: url,
                dispatchOrderNo: row.dispatchOrderNo,
                prodOrderNo: row.prodOrderNo,
                bomId:row.bomId,
                type: i
              },
            });
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
        }else{
            const url = downloadGlobal.hostUpload + row.url
            // const url = global.hostUpload + row.url
            //alert('http://127.0.0.1:8012/onlinePreview?url='+encodeURIComponent(Base64.encode(url)))
            // window.open('http://127.0.0.1:8012/onlinePreview?url='+encodeURIComponent(Base64.encode(url)));
            // window.open('http://127.0.0.1:8012/onlinePreview?url='+encodeURIComponent(Base64.encode(url)));
            window.open(downloadGlobal.hostWatch + '/onlinePreview?url='+encodeURIComponent(Base64.encode(url)));
            // window.open(global.hostWatch + '/onlinePreview?url='+encodeURIComponent(Base64.encode(url)));
          }
        },

      /** 确认生产按钮 */
      handleConfirm(row) {
        const id = [row.id]
        this.isDisabled = true
        setTimeout(()=>{
          this.isDisabled=false   //点击一次时隔两秒后才能再次点击
        },6000)
        this.$modal.confirm('确定确认生产吗？').then(function() {
          return confirmProduction({'ids':id});
        }).then(() => {
          this.$modal.msgSuccess("确认生产成功");
          this.getList();
        }).catch(() => {});
      },
      watchSteelFiles(row) {
       this.detailId = row.id
       this.pieceNo = row.pieceNo
       this.status = row.status
       this.prodOrderNoDraw = row.prodOrderNo
       this.files.open = true
       this.checkIsDrawing()
       this.prodOrderNo = row.workpieceProdOrderNo ;
       this.getSteelFile();
     },
     watchElctrodeFiles(row) {
       this.detailId = row.id
       this.status = row.status
       this.prodOrderNoDraw = row.prodOrderNo
       this.files.open = true
       
       //this.checkIsDrawing()
       this.getProcedureSheetFiles(row);
     },
     getProcedureSheetFiles(row){
      this.queryParamsSheet.prodOrderNo = row.workpieceProdOrderNo;
      getProcedureSheet(this.queryParamsSheet).then(res =>{
         this.filesData = res.data.records
         this.totalFile = res.data.total
       });
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
      getSheetData(row){
        const workpieceProdOrderNo = row.workpieceProdOrderNo
        this.sheet.open = true
        listSheetData({'workpieceProdOrderNo':workpieceProdOrderNo}).then(response =>{
          
          this.sheetData = response.data.records
          this.totalSheet = response.data.total
        });
      },
      openElectrodeCutData(row){
        const electrodeProdOrderNo = row.electrodeProdOrderNo
        this.electrodeCut.open = true
        listElectrodeCutData({'electrodeProdOrderNo':electrodeProdOrderNo}).then(response =>{
          this.electrodeData = response.data.records
          this.totalElectrode = response.data.total
        });
      },
      /** 表格单击显示 */
      handleDisplay (row) {
        this.queryParamsProcess.detailId = row.detailId
        this.queryParamsProcess.pieceNo = row.pieceNo
        this.pieceNo = row.pieceNo
        this.loading = true;
        process(this.queryParamsProcess).then(response => {
          this.processList = response.data;
          this.loading = false;
        });
      },

      /** 新增工件图档 */
      handleAddDrawing() {
        this.fileStatus = '0'
        this.filesChange.open = true
      },
     
     
    }
  }
</script>


