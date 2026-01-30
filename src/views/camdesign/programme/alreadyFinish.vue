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
        <right-toolbar :showSearch.sync="showSearch" @queryTable="getListAlreadyFinish"></right-toolbar>
      </el-col>
    </el-row>
    <el-row style="margin-bottom: 10px">
      <el-col :span="24">
        <el-button
          type="primary"
          size="small"
          round
          icon="el-icon-plus"
          @click="handleProgramme"
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
          disabled
        >NC编程已完成列表</el-button>
      </el-col>
      <el-col :span="24"><i class="el-icon-s-order" style="margin-bottom: 10px;margin-top: 10px">NC编程已完成列表</i></el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-table ref="multipleTable" v-loading="loading" :data="alreadyFinishList" max-height="700px" border>
          <el-table-column label="操作" align="center" width="160" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-tooltip class="item" effect="dark" content="重新设计" placement="top-start">
                <el-button
                  circle
                  type="primary"
                  icon="el-icon-refresh"
                  @click="handleRedesign(scope.row)"
                ></el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="查看档案" placement="top-start">
                <el-button
                type="primary"
                circle
                @click="handleWatchCustomer(scope.row)"
              >查看</el-button>
              </el-tooltip>
            </template>
            
          </el-table-column>
          <el-table-column label="工序序号" align="center" prop="sort" />
          <el-table-column label="工序名称" align="center" prop="code" />
          <el-table-column label="类型" align="center" prop="datasource">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.datasource === '0'" tyoe="success">钢件</el-tag>
              <el-tag v-if="scope.row.datasource === '1'" type="danger">电极</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="业务工时" align="center" prop="businessHours" v-if="false"/>
          <el-table-column label="需求日期" align="center" prop="demandDate" />
          <el-table-column label="本工序加工日期" align="center" prop="processingDate" width="95px"/>
          <el-table-column label="任务编号" align="center" prop="taskNo" :show-overflow-tooltip="true"/>
          <el-table-column label="生产单号" align="center" prop="prodOrderNo" :show-overflow-tooltip="true"/>
          <el-table-column label="模号" align="center" prop="moduleNo" />
          <el-table-column label="件号" align="center" prop="pieceNo"  />
          <el-table-column label="版本" align="center" prop="versionNo"  />
          <el-table-column label="电极编号" align="center" prop="bBno"/>
          <el-table-column label="电极类型" align="center" prop="bType"/>
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
          @pagination="getListAlreadyFinish"
        />
      </el-col>
    </el-row>
    <!-- 查看CAM 设计文档对话框 -->
   <el-dialog :title="dialogCam.title" :visible.sync="dialogCam.open" width="1270px">
      <el-row :gutter="24">
        <el-col :span="24">
          <span>完成设计的NC图档</span>
          <el-table :data="completeList" border max-height="700px">
            <el-table-column label="序号"  type="index" width="50"/>
            <el-table-column property="taskNumber" label="任务单号" > </el-table-column>
            <el-table-column property="fileName" label="文件名称" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column property="fileType" label="文件类型" > </el-table-column>
            <el-table-column property="nickName" label="上传人" :show-overflow-tooltip="true" width="120"></el-table-column>
            <el-table-column property="createTime" label="上传时间" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column label="操作" width="120">
              <template slot-scope="scope">
                <el-tooltip class="item" effect="dark" content="查看客户图档" placement="top-start">
                  <el-button
                    type="primary"
                    circle
                    icon="el-icon-folder-opened"
                    @click="handleSeeDrawing(scope.row,1)"
                  ></el-button>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="删除当前文件" placement="top-start">
                  <el-button
                    type="primary"
                    circle
                    icon="el-icon-delete"
                    @click="handleDeleteDrawing(scope.row)"
                  ></el-button>
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>
          <!-- <pagination
            v-show="totalComplete>0"
            :total="totalComplete"
            :page.sync="queryParamsComplete.pageNo"
            :limit.sync="queryParamsComplete.pageSize"
            @pagination="getcompleteListDoc"
          /> -->
          </el-col>
        </el-row>
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
  getCamNcFinishPage,
  reDesign,getCamFileList,delCamFile
} from "../../../api/camdesign/programm"
import downloadGlobal from '@/store/downloadGlobal'
import {ElMapExportTable} from "table-excel";

export default {
  name: "viewAlreadyFinish",
  dicts: ['sys_normal_disable','design_Status'],
  data() {
    return {
      // 遮罩层
      loading: true,
      // 总条数
      total: 0,
      // 显示搜索条件
      showSearch: true,
      // 订单BOM表格数据
      alreadyFinishList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      //单选框查询
      radio: 4,
      // 查询参数
      queryParams: {
        pageNo: 1,
        pageSize: 10,
      },
      queryParamsMeasureResult: {},
      // 生产进度表格数据
      sheduleList: [],
      //导出进度显示
      percentage:0,
      // 是否显示弹出层
      openExport: false,
      // 已完成的电极程式列表
      completeList: [],
      queryParamsComplete: {
        pageNo: 1,
        pageSize: 10,
      },
      totalComplete: 0,
      dialogCam: {
        open: false,
        title: "",
        data: null
      },
    };
  },
  created() {
    this.getListAlreadyFinish();
  },
  methods: {
    getcompleteListDoc() {
      this.loading = true;
    },
    handleWatchCustomer(row) {
      console.log('水电费第三方的')
      
      this.$modal.loading("正在查询文件列表，请稍后...！");
      this.dialogCam.open = true;
      this.dialogCam.title = "查看图档";
      this.dialogCam.data = row;
      this.queryParamsMeasureResult.taskNumber = row.taskNo
      this.queryParamsMeasureResult.prodOrderNo = row.prodOrderNo
      this.queryParamsMeasureResult.code = row.code
      this.completeList = [];
      getCamFileList(this.queryParamsMeasureResult).then(res => {
          this.$modal.closeLoading()
          this.completeList = res;
      })
    },
    handleDeleteDrawing(row){
// 先获取复选框选中的ID
      var obj = {
        'id' : row.id,
        'ncUploadId' : row.ncUploadId,
        'taskNo' : row.taskNo,
        'fileName' :row.fileName,
        'filePath' :row.filePath,
        'datasource' :row.datasource,
      }
      this.$modal.confirm('确认删除该文件？删除文件将记入操作记录！').then(() => {
        this.$modal.loading("正在删除选中文件，请稍候！");
  // 这里的 this 就是 Vue 实例
        delCamFile(obj).then(resp => {
           this.$modal.closeLoading()
           this.$modal.loading("删除文件成功，正在更新文件列表！");
           getCamFileList(this.queryParamsMeasureResult).then(res => {
               this.completeList = res;
               this.loading = false;
               this.$modal.closeLoading();
           });
        });
      }).catch(() => {});

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
    /** 分页查询编程列表 */
    getListAlreadyFinish() {
      this.loading = true;
      setTimeout(()=>{
        this.loading = false;
      },3000)
      getCamNcFinishPage(this.queryParams).then(response => {
        this.sheduleList = response.data.records;
        this.alreadyFinishList = response.data.records;
        for (let i = 0;i < this.alreadyFinishList.length;i++){
          this.alreadyFinishList[i].routeList = this.alreadyFinishList[i].routeList.replace(/-/g, "-").replace(/\([^\)]*\)/g, "")
        }
        this.total = response.data.total;
        this.loading = false;
      });
    },
    /** 编程任务列表 */
    handleProgramme() {
      this.$router.push({
        path:'/camdesign/programme/index',
      });
    },
    /** 编程已领取列表 */
    handleAlreadyAccept() {
      this.$router.push({
        path:'/camdesign/programme-edit/alreadyAccept',
      });
    },
    /** 重新设计 */
    handleRedesign(row) {
      const ncFinishId = row.id;
      this.$modal.confirm('确定要重新设计吗？').then(function() {
        return reDesign({'ncFinishId':ncFinishId})
      }).then(() => {
        this.getListAlreadyFinish();
        this.$modal.msgSuccess("重新设计成功");
      }).catch(() => {});
    },
    // 提取文件后缀名
    getSuffix(str) {
        const fileExtension = str.substring(str.lastIndexOf(".") + 1);
        return fileExtension;
      },
    /** 查看客户图档 */
        handleSeeDrawing(row,i) {
          
          let suffix = this.getSuffix(row.filePath)
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
          } else {
            const changeurl = row.url.split('.')[0]+'.pdf'
            const url = downloadGlobal.hostUpload + changeurl
            // const url = global.hostUpload + changeurl
            //alert('http://127.0.0.1:8012/onlinePreview?url='+encodeURIComponent(Base64.encode(url)))
            // window.open('http://127.0.0.1:8012/onlinePreview?url='+encodeURIComponent(Base64.encode(url)));
            window.open(downloadGlobal.hostWatch + '/onlinePreview?url='+encodeURIComponent(Base64.encode(url))+ '&officePreviewType=pdf');
            // window.open(global.hostWatch + '/onlinePreview?url='+encodeURIComponent(Base64.encode(url))+ '&officePreviewType=pdf');
            // window.open('http://10.47.71.26:8012/onlinePreview?url='+encodeURIComponent(Base64.encode(url)));
          }
        },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNo = 1;
      this.getListAlreadyFinish();
    },
    /** 导出按钮操作 */
    handleExport() {
      this.openExport = true;
      var data = this.sheduleList; // 这里面是数据列表
      const column = [
        { title: "工序序号", dataIndex: "sort" },
        { title: "工序名称", dataIndex: "code" },
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
        { title: "电极类型", dataIndex: "bType" },
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
      instance.download("NC编程已完成列表").then((data) => {
        this.openExport = false
      }); // 导出的文件名
    },
  }
};
</script>

