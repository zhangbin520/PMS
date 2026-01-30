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
        <right-toolbar :showSearch.sync="showSearch" @queryTable="getListAlready"></right-toolbar>
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
          disabled
        >NC编程已领取列表</el-button>
        <el-button
          size="small"
          round
          icon="el-icon-plus"
          @click="handleAlreadyFinish"
        >NC编程已完成列表</el-button>
      </el-col>
      <el-col :span="24"><i class="el-icon-s-order" style="margin-bottom: 10px;margin-top: 10px">NC编程已领取列表</i></el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-table ref="multipleTable" v-loading="loading" :data="alreadyAcceptList" max-height="600px" border
                  @selection-change="handleSelectionChange" highlight-current-row>
          <el-table-column type="index" width="50" align="center" fixed/>
          <el-table-column type="selection" width="50" align="center" fixed/>
          <el-table-column label="操3作" align="center" width="300" class-name="small-padding fixed-width" fixed>
            <template slot-scope="scope">
              <el-tooltip class="item" effect="dark" content="开始" placement="top-start">
                <el-button
                  circle
                  type="primary"
                  icon="el-icon-switch-button"
                  :disabled="scope.row.designStatus !== 1"
                  @click="handleStart(scope.row)"
                ></el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="暂停" placement="top-start" v-if="scope.row.designStatus === 2
              || scope.row.designStatus === '1'">
                <el-button
                  circle
                  icon="el-icon-video-pause"
                  @click="handleStop(scope.row)"
                ></el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="恢复" placement="top-start" v-if="scope.row.designStatus === 3">
                <el-button
                  circle
                  type="danger"
                  icon="el-icon-video-play"
                  @click="handleRecover(scope.row)"
                ></el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="放弃" placement="top-start">
                <el-button
                  circle
                  type="warning"
                  icon="el-icon-refresh-right"
                  @click="handleAbandon(scope.row)"
                ></el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="上传文件" placement="top-start"
                          v-if="scope.row.designStatus === 2 || scope.row.designStatus === 8">
                <el-button
                  circle
                  type="info"
                  icon="el-icon-upload"
                  @click="handleUpload(scope.row)"
                ></el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="完成" placement="top-start">
                <el-button
                  circle
                  type="success"
                  icon="el-icon-check"
                  :disabled="scope.row.designStatus === 3 || scope.row.designStatus === 1 "
                  v-preventReClick="2000"
                  @click="handleFinish(scope.row)"
                ></el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="复用" placement="top-start"
                          v-if="scope.row.designStatus !== 8 && scope.row.designStatus !== 1">
                <el-button
                  circle
                  type="primary"
                  icon="el-icon-document-copy"
                  :disabled="scope.row.designStatus === 3"
                  @click="handleCopy(scope.row)"
                ></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column label="工序序号" align="center" prop="sort" fixed/>
          <el-table-column label="工序名称" align="center" prop="code" fixed/>
          <el-table-column label="设计状态" align="center" prop="designStatus" fixed>
            <template slot-scope="scope">
              <el-tag v-if="scope.row.designStatus =='1'">已领取</el-tag>
              <el-tag v-if="scope.row.designStatus =='2'">已开始</el-tag>
              <el-tag v-if="scope.row.designStatus =='3'">已暂停</el-tag>
              <el-tag v-if="scope.row.designStatus =='4'">已完成</el-tag>
              <el-tag v-if="scope.row.designStatus =='8'">换图待确认</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="类型" align="center" prop="datasource" fixed>
            <template slot-scope="scope">
              <el-tag v-if="scope.row.datasource === '0'" type="success">钢件</el-tag>
              <el-tag v-if="scope.row.datasource === '1'" type="danger">电极</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="业务工时" align="center" prop="businessHours" fixed v-if="false"/>
          <el-table-column label="需求日期" align="center" prop="demandDate" fixed/>
          <el-table-column label="本工序加工日期" align="center" prop="processingDate" width="95px" fixed/>
          <el-table-column label="任务编号" align="center" prop="taskNo" :show-overflow-tooltip="true" fixed/>
          <el-table-column label="生产单号" align="center" prop="prodOrderNo" :show-overflow-tooltip="true" />
          <el-table-column label="模号" align="center" prop="moduleNo" />
          <el-table-column label="件号" align="center" prop="pieceNo"  />
          <el-table-column label="版本" align="center" prop="versionNo"  />
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
          <el-table-column label="规格" align="center">
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
          @pagination="getListAlready"
        />
      </el-col>
    </el-row>
    <div align="center" style="margin-top: 20px">
      <el-row>
        <el-button size="mini" round type="info" icon="el-icon-download" @click="handleDownload" :disabled="single">下载客户资料</el-button>
        <el-button size="mini" round type="info" icon="el-icon-download" @click="handleDownload3D" :disabled="single">下载电极3D图档</el-button>
        <el-button size="mini" round type="primary" icon="el-icon-upload">上传钢件程式单JSON格式</el-button>
        <el-button size="mini" round type="primary" icon="el-icon-upload">上传电极程式单JSON格式</el-button>
      </el-row>
    </div>
    <!--导出-->
    <el-dialog :title="title" :visible.sync="openExport" width="400px" append-to-body>
      <div align="center">
        <el-progress :percentage="percentage" type="circle"></el-progress>
      </div>
    </el-dialog>
    <!-- 暂停对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="680px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="暂停原因">
          <el-radio-group v-model="form.reason">
            <el-radio :label="0">正常下班</el-radio>
            <el-radio :label="1">客户换图(ug专用)</el-radio>
            <el-radio :label="2">临时中断</el-radio>
            <el-radio :label="3">业务暂停订单(客户换图)</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="详细说明">
          <el-input type="textarea" :rows="3" placeholder="请输入内容" v-model="form.remark"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFormStop">确 定</el-button>
        <el-button @click="open = false">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 上传文件对话框-->
    <el-dialog :title="upload.title" :visible.sync="upload.open" width="900px" center>
      <el-table :data="uploadData" v-loading="loading" border  @header-click="clickFun" :row-class-name="tableRowClassName">
        <el-table-column type="index" label="" width="50"></el-table-column>
        <el-table-column prop="camFileName" align="center" label="文件类型">
          <template slot-scope="scope">
            <el-select v-model="scope.row.camFileName" @change="handleSelectFileId(scope.row,scope.row.camFileName)" filterable clearable placeholder="请选择">
              <el-option
                v-for="item in optionsFileName"
                :key="item.id"
                :label="item.fileType"
                :value="item.fileType">
              </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column prop="brand" align="center" label="控制器类别">
          <template slot-scope="scope">
            <el-select v-model="scope.row.brand" filterable clearable placeholder="请选择">
              <el-option
                v-for="item in optionsBrand"
                :key="item"
                :label="item"
                :value="item">
              </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column align="center" label="加工长度(WE)(非必填)" prop="workingLength">
          <template slot-scope="scope">
          <el-input v-model="scope.row.workingLength" clearable placeholder="请输入加工长度"/>
          </template>
        </el-table-column>
        <el-table-column prop="fileName" align="center" label="文件名">
          <template slot-scope="scope">
            <span>{{scope.row.fileName}}</span>
            <el-upload
              class="pop-upload"
              ref="upload"
              action=""
              :file-list="fileList"
              :auto-upload="false"
              :multiple="true"
              :on-change="handleChange"
              :on-remove="handleRemove"
              :on-success="handleSuccess"
              :show-file-list="false"
            >
              <i class="el-icon-upload" slot="trigger">上传</i>
              <el-button style="margin-left: 10px;" size="medium" type="text" @click="submitUpload(scope.row)">确认上传</el-button>
              <el-button type="text" icon="el-icon-delete" @click="deleteUploadFiles(scope.row)"></el-button>
            </el-upload>
          </template>
        </el-table-column>
        <el-table-column align="center" label="+">
          <template slot-scope="scope">
            <el-button
              size="small"
              circle
              type="primary"
              icon="el-icon-plus"
              @click="handleAddFile(scope.row)"
            ></el-button>
            <el-button
              size="small"
              circle
              type="warning"
              icon="el-icon-minus"
              @click="handleDeleteFile(scope.row,scope.$index)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="totalFile>0"
        :total="totalFile"
        :page.sync="queryParams.pageNo"
        :limit.sync="queryParams.pageSize"
        @pagination="getListUploadProcessFiles"
      />
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">保 存</el-button>
        <el-button @click="upload.open = false">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 客户资料下载对话框-->
    <el-dialog :title="download.title" :visible.sync="download.open" width="900px" center>
      <el-row :gutter="24">
        <el-col :span="12">
          <span>工件图档</span>
          <el-table :data="filesData">
            <el-table-column property="pieceNo" label="件号">
              <template slot-scope="scope">
                <span>{{pieceNo}}</span>
              </template>
            </el-table-column>
            <el-table-column property="name" label="图纸名称"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="text"
                  circle
                  @click="handleViewDrawing(scope.row,1)"
                >查看</el-button>
                <el-button
                  type="text"
                  circle
                  @click="handleDownloadDrawing(scope.row)"
                >下载</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
        <el-col :span="12">
          <span>公共图档</span>
          <el-table :data="publicFilesData">
            <el-table-column property="name" label="图纸名称"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="text"
                  circle
                  @click="handleViewDrawing(scope.row,0)"
                >查看</el-button>
                <el-button
                  type="text"
                  circle
                  @click="handleDownloadDrawing(scope.row)"
                >下载</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button @click="download.open = false">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 电极3D图档下载对话框-->
    <el-dialog :title="downloadEle.title" :visible.sync="downloadEle.open" width="650px" center>
      <el-table :data="downloadEledData" v-loading="loading" border  @header-click="clickFun" :row-class-name="tableRowClassName">
        <el-table-column type="index" label="" width="50"></el-table-column>
        <el-table-column prop="fileName" align="center" label="文件名称"></el-table-column>
        <el-table-column label="操作" width="120px">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="查看电极3D图档" placement="top-start">
              <el-button
                type="warning"
                circle
                icon="el-icon-folder-opened"
                @click="handleViewEle(scope.row)"
              ></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="下载电极3D图档" placement="top-start">
              <el-button
                type="primary"
                circle
                icon="el-icon-download"
                @click="handleDownloadEle(scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="totalEle>0"
        :total="totalEle"
        :page.sync="queryParams.pageNo"
        :limit.sync="queryParams.pageSize"
        @pagination="getListProcess3DFile"
      />
      <div slot="footer" class="dialog-footer">
        <el-button @click="downloadEle.open = false">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 客户图档预览对话框-->
    <el-dialog :title="viewPublic.title" :visible.sync="viewPublic.open" width="650px" :fullscreen=true>
      <!-- word查看详情 -->
      <div id="wordView" v-html="wordText" v-if="fileType === 1"/>
      <!-- excel查看详情 -->
      <div id="table" v-if="fileType === 2">
        <el-table :data="excelData" style="width: 100%">
          <el-table-column
            v-for="(value, key, index) in excelData[2]"
            :key="index"
            :prop="key"
            :label="key"
          ></el-table-column>
        </el-table>
      </div>
      <!-- pdf查看详情 -->
      <div id="pdfView" v-if="fileType === 3">
        <el-button-group>
          <el-button type="primary" icon="el-icon-arrow-left" size="mini" @click="prePage">上一页</el-button>
          <el-button type="primary" size="mini" @click="nextPage">下一页<i class="el-icon-arrow-right el-icon--right"></i></el-button>
        </el-button-group>
        <div style="marginTop: 10px; color: #409EFF">{{ pageNum }} / {{ pageTotalNum }}</div>
        <pdf :page="pageNum" :src="pdfUrl" @progress="loadedRatio = $event" @num-pages="pageTotalNum=$event"></pdf>
      </div>
      <!-- ppt预览-->
      <div id="pptView" v-if="fileType === 4" style="height: 100vh">
        <iframe frameborder="0"
                :src="'https://view.officeapps.live.com/op/view.aspx?src='+pptUrl"
                width='100%' height="100%">
        </iframe>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="viewPublic.open = false">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 复用对话框-->
    <el-dialog :title="copy.title" :visible.sync="copy.open" width="650px" center>
      <el-card style="margin-bottom: 10px">
        <el-input v-model="copySearchNo" placeholder="请输入生产单号" clearable size="small" style="width: 220px"
                  @keyup.enter.native="handleQueryCopy"/>
        <el-button size="mini" type="primary" icon="el-icon-search" @click="handleQueryCopy" style="margin-left: 10px"></el-button>
      </el-card>
      <el-table :data="copyData" v-loading="loading" border @selection-change="handleSelectionCopy">
        <el-table-column type="index" label="" width="50"></el-table-column>
        <el-table-column type="selection" label="" width="50"></el-table-column>
        <el-table-column prop="prodOrderNo" align="center" label="历史生产单号"></el-table-column>
        <el-table-column prop="sort" align="center" label="历史工序"></el-table-column>
        <el-table-column prop="code" align="center" label="历史工段"></el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitCopy" :disabled="copySingle">确 定</el-button>
        <el-button @click="copy.open = false">取 消</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import {
  getCamNcReceivedPage,
  camNcChangeState,
  getFileTypePage,
  getBrandInformation,
  getProcessFilePage,
  getUploadFile,
  editProcessFile,
  uploadFile,
  delProcessFile,
  delFile,
  getProcess3DFile,
  getReusable, confirmReuse
} from "../../../api/camdesign/programm"
import {listPerson} from "../../../api/system/person";
import {getDrawingFile, getPublicDrawingFile} from "../../../api/order/orderbom";
import global from "../../../store/global";
import mammoth from "mammoth";
import * as XLSX from 'xlsx';
import pdf from 'vue-pdf';
import { Base64  } from 'js-base64';
import {ElMapExportTable} from "table-excel";
import { getUserProfile } from '@/api/system/user'
import downloadGlobal from '@/store/downloadGlobal'


export default {
  name: "alreadyAccept",
  dicts: ['sys_normal_disable','design_Status'],
  components:{
    pdf
  },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 非单个禁用
      single: true,
      copySingle: true,
      // 非多个禁用
      multiple: true,
      // 总条数
      total: 0,
      totalFile:0,
      totalEle:0,
      // 显示搜索条件
      showSearch: true,
      // 订单BOM表格数据
      alreadyAcceptList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      //单选框查询
      radio: 4,
      //协助表单参数
      form:{},
      //用户选择
      personForprogramme: [],
      //选中数组
      Id:[],
      stopId:[],
      processName:'',
      //上传文件对话框
      upload:{
        title:'',
        open:false,
      },
      //上传文件表格数据
      uploadData:[],
      //上传文件类型名数据
      optionsFileName:[],
      //上传文件控制器数据
      optionsBrand:[],
      // 文件上传
      fileList: [],
      //上传参数
      uploadCode:'',
      uploadProdOrderNo:'',
      uploadEleProdOrderNo:'',
      uploadSort:'',
      uploadEleSort:'',
      datasource:'',
      uploadIndex:'',
      uploadProcessId:'',
      uploadBrand:'',
      uploadCamFileId:'',
      uploadFileSort:'',
      fileName:[],
      fileId:[],
      fileNameList:[],
      uploadFileId:'',
      //下载客户资料弹框
      download:{
        title:'',
        open:false,
      },
      //下载客户资料数据
      filesData:[],
      //客户资料公共图档表格数据
      publicFilesData:[],
      //下载客户资料选中数据
      pieceNo:'',
      bomId:'',
      //下载电极3D图档弹框
      downloadEle:{
        title:'',
        open:false,
      },
      //电极图档表格数据
      downloadEledData:[],
      //电极选中参数
      eleCode:'',
      eleProdOrderNo:'',
      eleSort:'',
      sort:'',
      type:'',
      //查看公共图档对话框
      viewPublic:{
        title:'',
        open:false,
      },
      //word预览
      wordText: "",
      wordURL:'', //文件地址，看你对应怎末获取、赋值
      isWord: "",
      fileType:'',
      //excel预览
      excelData: [],
      workbook: {},
      //pdf预览
      pdfUrl:"",
      pageNum: 1,
      pageTotalNum: 1, // 总页数
      loadedRatio: 0, //当前页面的加载进度，范围是0-1 ，等于1的时候代表当前页已经完全加载完成了
      //ppt预览
      pptUrl:'',
      //复用弹窗数据
      copy:{
        title:'',
        open:false,
      },
      //复用表格数据
      copyData:[],
      //复用查询数据
      copySearchCode:'',
      copySearchNo:'',
      copySearchId:'',
      targetProdOrderNo:'',
      //复用选中数据
      copyCode:'',
      copyProdOrderNo:'',
      copySort:'',
      ncReceivedId:'',
      copyDatasource:'',
      //删除文件传参 人员工号
      userName:'',
      personNo:'',
      deptName:'',
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
      queryParamsSortFiles: {
        pageNo: 1,
        pageSize: 10,
      },
      // 文件类型查询参数
      queryParamsBrand: {
        pageNo: 1,
        pageSize: 50,
      },
      //协助表单校验
      rules: {
        name: [
          { required: true, message: "姓名不能为空", trigger: "blur" },
          { min: 2, max: 10, message: '姓名长度必须介于 2 和 10 之间', trigger: 'blur' }
        ],
      },
      //增加单数
      obj:{
        camFileName:'',
        fileName:'',
        brand:'',
      },
      // 生产进度表格数据
      sheduleList: [],
      //导出进度显示
      percentage:0,
      // 是否显示弹出层
      openExport: false,
    };
  },
  created() {
    this.getListAlready();
    this.getListPerson();
    this.getListUser()
  },
  methods: {
    /** 查询登录用户信息*/
    getListUser() {
      getUserProfile().then(response => {
        this.userName = response.data.nickName
        this.personNo = response.data.userName
        this.deptName = response.data.dept.name
      });
    },
    /** 分页查询已领取列表 */
    getListAlready() {
      this.loading = true;
      getCamNcReceivedPage(this.queryParams).then(response => {
        this.sheduleList = response.data.records;
        this.alreadyAcceptList = response.data.records;
        for (let i = 0;i < this.alreadyAcceptList.length;i++){
          this.alreadyAcceptList[i].routeList = this.alreadyAcceptList[i].routeList.replace(/-/g, "-").replace(/\([^\)]*\)/g, "")
        }
        this.total = response.data.total;
        this.loading = false;
      });
    },
    /** 查询员工列表 */
    getListPerson() {
      this.loading = true;
      listPerson(this.queryParams).then(response => {
          this.personForprogramme = response.data.records;
          // this.userName = this.personForprogramme.jobNo;
        }
      );
    },
    /** 分页查询文件类型 */
    getListFiles() {
      this.queryParamsFiles.datasource = this.datasource
      this.queryParamsFiles.type = this.processName
      getFileTypePage(this.queryParamsFiles).then(res =>{
        this.optionsFileName = res.data.records
      })
    },
    /** 分页查询控制器类别 */
    getListBrand() {
      this.queryParamsBrand.processManHourId = this.uploadProcessId
      getBrandInformation(this.queryParamsBrand).then(res =>{
        this.optionsBrand = res.data.BRAND_LIST;
      })
    },
    /** 分页查询工序文件列表 */
    getListUploadProcessFiles() {
      if(this.datasource === '1') {
        this.queryParamsSortFiles.code = this.uploadCode
        this.queryParamsSortFiles.prodOrderNo = this.uploadEleProdOrderNo
        this.queryParamsSortFiles.sort = this.uploadEleSort
        this.queryParamsSortFiles.eleSort = this.uploadSort
        this.queryParamsSortFiles.datasource = this.datasource
        this.queryParamsSortFiles.type = this.processName
        getProcessFilePage(this.queryParamsSortFiles).then(res =>{
          this.uploadData = res.data.records;
          this.totalFile = Number(res.data.total);
        })
      }else {
        this.queryParamsSortFiles.code = this.uploadCode
        this.queryParamsSortFiles.prodOrderNo = this.uploadProdOrderNo
        this.queryParamsSortFiles.sort = this.uploadSort
        this.queryParamsSortFiles.datasource = this.datasource
        this.queryParamsSortFiles.type = this.processName
        getProcessFilePage(this.queryParamsSortFiles).then(res =>{
          this.uploadData = res.data.records;
          this.totalFile = Number(res.data.total);
        })
      }
    },
    /** 分页查询电极3D文档 */
    getListProcess3DFile() {
      this.queryParams.code = this.eleCode
      this.queryParams.prodOrderNo = this.eleProdOrderNo
      this.queryParams.sort = this.eleSort
      getProcess3DFile(this.queryParams).then(res =>{
        this.downloadEledData = res.data;
      })
    },
    /** 查看客户图档 */
    getFile() {
      this.queryParams.prodOrderNo = this.eleProdOrderNo
      getDrawingFile(this.queryParams).then(res =>{
        this.filesData = res.data.records
      });
    },
    getPublicFile() {
      this.queryParams.id = this.bomId
      getPublicDrawingFile(this.queryParams).then(res =>{
        this.publicFilesData = res.data.records
      })
    },
    /** 分页查询复用历史图档 */
    getHistoryFile(a,b,c,d) {
      console.log(a)
      console.log(b)
      console.log(c)
      console.log(d)
      getReusable({'code':a,'prodOrderNo':b,'datasource':d}).then(res =>{
        if(res.data.length !== 0) {
          const arr = []
          res.data.forEach(function (item) {
            arr.push({
              'ncReceivedId': c,
              'prodOrderNo': item.prodOrderNo,
              'sort': item.sort,
              'code': item.code
            })
          })
          this.copyData = arr
        }else {
          this.$modal.msgError("未找到已完成设计的生产单！")
        }
      })
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.eleCode = selection.map(item => item.code).join('');
      this.eleProdOrderNo = selection.map(item => item.prodOrderNo).join('');
      this.eleSort = selection.map(item => item.edmNo).join('');
      this.Sort = selection.map(item => item.sort).join('');
      this.pieceNo = selection.map(item => item.pieceNo).join('');
      this.bomId = selection.map(item => item.bomId).join('');
      this.type = selection.map(item => item.datasource).join('');
      this.multiple = !selection.length;
      this.single = selection.length != 1;
    },
    // 多选框选中数据
    handleSelectionCopy(selection) {
      this.copyCode = selection.map(item => item.code).join('');
      this.copySort = selection.map(item => item.sort).join('');
      this.copyProdOrderNo = selection.map(item => item.prodOrderNo).join('');
      this.ncReceivedId = selection.map(item => item.ncReceivedId).join('');
      this.copySingle = selection.length != 1;
    },
    /** 编程任务列表 */
    handleProgramme() {
      this.$router.push({
        path:'/camdesign/programme/index',
      });
    },
    /** 编程已完成列表 */
    handleAlreadyFinish() {
      this.$router.push({
        path:'/camdesign/programme-edit/alreadyFinish',
      });
    },
    /** 开始任务 */
    handleStart(row) {
      const ncReceivedId = row.id;
      camNcChangeState({'ncReceivedId':ncReceivedId,'state':'0'}).then(response =>{
        this.$modal.msgSuccess("开始成功");
        this.getListAlready();
      })
    },
    /** 恢复任务 */
    handleRecover(row) {
      const ncReceivedId = row.id;
      camNcChangeState({'ncReceivedId':ncReceivedId,'state':'2'}).then(response =>{
        this.$modal.msgSuccess("恢复成功");
        this.getListAlready();
      })
    },
    /** 暂停任务 */
    handleStop(row) {
      this.open = true;
      this.title = "暂停原因"
      this.stopId = row.id
    },
    /** 放弃任务 */
    handleAbandon(row) {
      const ncReceivedId = row.id;
      this.$modal.confirm('是否确认放弃任务？').then(function() {
        return camNcChangeState({'ncReceivedId':ncReceivedId,'state':'3'})
      }).then(() => {
        this.getListAlready();
        this.$modal.msgSuccess("放弃成功");
      }).catch(() => {});
    },
    tableRowClassName({row, rowIndex}) {
      //把每一行的索引放进row
      row.index = rowIndex;
    },
    /** 上传文件 */
    handleUpload(row) {
      this.uploadProcessId = row.processManHourId
      this.processName = row.type
      this.uploadCode = row.code
      this.uploadProdOrderNo = row.workpieceProdOrderNo
      this.uploadEleProdOrderNo = row.prodOrderNo
      this.uploadSort = row.sort
      this.uploadEleSort = row.edmNo
      this.datasource = row.datasource
      this.uploadFileSort = row.index
      this.upload.title = "上传" +this.uploadCode+ "的相关文件"
      this.upload.open = true;
      this.getListUploadProcessFiles()
      this.getListFiles()
      this.getListBrand()
    },
    // 文件状态改变时的钩子，添加文件、上传成功和上传失败时都会被调用,function(file, fileList)
    handleChange(file, fileList) {
      this.fileList = fileList
    },
    // 删除文件之前的钩子，参数为上传的文件和文件列表，若返回 false 或者返回 Promise 且被 reject，则停止删除。function(file, fileList)
    handleRemove(file, fileList) {
      this.fileList = fileList
    },
    handleSuccess(res, file) {
      this.$refs.upload.clearFiles(); //上传成功之后清除历史记录
    },
    //上传文件确认上传
    submitUpload(row) {
      const index = row.index
      this.uploadBrand = row.brand
      this.uploadCamFileId = row.camFileId
      //判断是否有文件再上传
      if (this.fileList.length === 0) {
        return this.$message.warning('请选取文件后再上传')
      }
      // 下面的代码将创建一个空的FormData对象:
      const formData = new FormData()
      // 你可以使用FormData.append来添加键/值对到表单里面；
      this.fileList.forEach((file) => {
        formData.append('file', file.raw)
      })
      const fileSort = row.index+1
      // 添加自定义参数，不传可删除
      if(this.datasource === '1'){
        formData.append('code', this.uploadCode)
        formData.append('prodOrderNo', this.uploadProdOrderNo)
        formData.append('sort', this.uploadEleSort)
        formData.append('fileSort', fileSort)
        formData.append('brand', this.uploadBrand)
        formData.append('camFileId', this.uploadCamFileId)
      }else {
        formData.append('code', this.uploadCode)
        formData.append('prodOrderNo', this.uploadProdOrderNo)
        formData.append('sort', this.uploadSort)
        formData.append('fileSort', fileSort)
        formData.append('brand', this.uploadBrand)
        formData.append('camFileId', this.uploadCamFileId)
      }
      //文件上传接口
      uploadFile(formData).then(res => {
        if (res.code === 200) {
          this.$message.success('上传成功');
          const fileName = res.fileName
          const fileUrl = res.fileUrl
          const camNcDrawIds = res.camNcDrawIds
          const brand = res.brand
          const camFileId = res.camFileId
          const camFileName = res.camFileName
          let newList = {
            brand:brand,
            camFileId:camFileId,
            index:index,
            fileName:fileName,
            fileUrl:fileUrl,
            camNcDrawIds:camNcDrawIds,
            camFileName:camFileName,
            id:row.id,
          }
          this.uploadData.splice(index,1,newList)
          // this.uploadData.push(newList)
        } else {
          this.$message.error('上传失败');
        }
        //清空fileList
        this.fileList = []
      })
    },
    /** 增加工序相关文件 */
    handleAddFile() {
      this.uploadData.push(JSON.parse(JSON.stringify(this.obj)))
    },
    /** 删除工序相关文件 */
    handleDeleteFile(row,index) {
      if(row.camFileName === '' || row.fileName === '' || row.id === undefined) {
        this.uploadData.splice(index,1)
      }else {
        const id = row.id
        delProcessFile({'id':id}).then(res =>{
          this.$modal.msgSuccess("删除成功")
          this.getListUploadProcessFiles()
        })

      }
    },
    /** 表头点击 */
    clickFun() {
      this.uploadData.push(JSON.parse(JSON.stringify(this.obj)))
    },
    /** 完成任务 */
    handleFinish(row) {
      const ncReceivedId = row.id;
      this.$modal.confirm('确定已经设计完成了吗？').then(function() {
        return camNcChangeState({'ncReceivedId':ncReceivedId,'state':'4'})
      }).then((res) => {
        if(res === undefined) {
          
        }else {
          this.$modal.msgSuccess("设计完成成功");
          this.getListAlready();
        }
      }).catch(() => {});
    },
    /** 暂停提交按钮 */
    submitFormStop: function() {
      this.$refs["form"].validate(valid => {
        this.form.ncReceivedId = this.stopId
        this.form.state = 1
        camNcChangeState(this.form).then(response =>{
          this.$modal.msgSuccess("暂停任务成功");
          this.getListAlready();
          this.open = false;
        })
      });
    },
    /** 根据文件名称查找id */
    handleSelectFileId(row,camFileName) {
      this.queryParamsFiles.datasource = this.datasource
      this.queryParamsFiles.type = this.processName
      getFileTypePage(this.queryParamsFiles).then(res =>{
        let arr = res.data.records.filter(item =>{
          return item.fileType === camFileName
        })
        this.uploadFileId = arr[0].id
        row.camFileId = this.uploadFileId
      })

    },
    /** 工件工序文件保存提交按钮 */
    submitForm: function() {
      const arr = []
      const code = this.uploadCode;
      const workpieceProdOrderNo = this.uploadProdOrderNo;
      const prodOrderNo = this.uploadEleProdOrderNo;
      const sort = this.uploadSort;
      const eleSort = this.uploadEleSort;
      const dataSource = this.datasource;
      this.uploadData.forEach(function (item) {
        if(dataSource === '1'){
          arr.push({
            code: code,
            prodOrderNo:workpieceProdOrderNo,
            eleProdOrderNo:prodOrderNo,
            sort:eleSort,
            eleSort: sort,
            brand:item.brand,
            workingLength:item.workingLength,
            camFileId:item.camFileId,
            camNcDrawIds:item.camNcDrawIds,
            fileName:item.fileName,
            fileUrl: item.fileUrl,
            id:item.id,
          })
        }else {
          arr.push({
            code: code,
            prodOrderNo:workpieceProdOrderNo,
            eleProdOrderNo:prodOrderNo,
            sort:sort,
            brand:item.brand,
            workingLength:item.workingLength,
            camFileId:item.camFileId,
            camNcDrawIds:item.camNcDrawIds,
            fileName:item.fileName,
            fileUrl: item.fileUrl,
            id:item.id,
          })
        }
      })
      // console.log(arr.filter(f => f.camNcDrawIds === '' || f.camNcDrawIds===undefined))
      // for (let i in arr) {
      //    if(arr[i].camNcDrawIds==='' || arr[i].camNcDrawIds===undefined){
      //      this.$modal.msgError('选择文件未确认上传');
      //    }
      //  }
      editProcessFile(JSON.stringify(arr)).then(response =>{
        this.$modal.msgSuccess("工序相关文件保存成功");
        this.upload.open = false;
        // this.getListAlready();
      })
    },
    /** 已上传文件删除按钮 */
    deleteUploadFiles(row) {
      if(row.camNcDrawIds === ''){
        this.$modal.msgError("无可删除文件")
      }else {
        if(this.fileList.length === 0) {
          const idList = row.camNcDrawIds
          const e = this.personNo
          delFile({'idList':idList,'userName':e}).then(res =>{
            this.$modal.msgSuccess("删除成功")
            this.getListUploadProcessFiles();
          })
        }else {
          this.fileList = []
          this.$modal.msgSuccess("删除待上传文件成功")
        }
      }
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNo = 1;
      // console.log(this.userName)
      this.getListAlready();
    },
    /** 客户文档下载按钮 */
    handleDownload() {
      if(this.type === '1'){
        this.$modal.msgError("请选择钢件查看客户资料图档")
      }else {
        this.download.title = "生产单号对应的订单下所有客户文件资料列表"
        this.download.open = true
        this.getFile();
        this.getPublicFile();
      }
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
    /** 下载电极3D图档 */
    handleDownloadEle(row) {
      const url = row.fileUrl.split(';')
      for(var i=0;i<url.length;i++){
        window.open(downloadGlobal.hostUpload + url[i])
        // window.open(global.hostUpload + url[i])
      }
    },
    /** 电极3D图档下载按钮 */
    handleDownload3D() {
      if(this.type === '0') {
        this.$modal.msgError("请选择电极查看电极3D图档")
      }else {
        this.downloadEle.title = "生产单号对应的订单下所有客户文件资料列表"
        this.downloadEle.open = true
        this.getListProcess3DFile();
      }
    },
    // 提取文件后缀名
    getSuffix(str) {
      const fileExtension = str.substring(str.lastIndexOf(".") + 1);
      return fileExtension;
    },
    /** 查看公共图档 */
    handleViewDrawing(row,i) {
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
    /** 查看电极3D图档 */
    handleViewEle(row) {
      this.$router.push({
        path:'/eleContact/eleContactForm',
        query:{
          prodOrderNo: row.eleProdOrderNo,
          electrodeNo: row.electrodeNo,
        },
      });
    },
    /** 复用查询 */
    handleQueryCopy() {
      this.getHistoryFile(this.copySearchCode,this.copySearchNo,this.copySearchId,this.copyDatasource)
    },
    /** 复用按钮点击事件 */
    handleCopy(row) {
      this.copySearchNo = ''
      this.copy.title = "设计图档复用"
      this.copy.open = true
      this.copySearchCode = row.code
      this.copySearchId = row.id
      this.copyDatasource = row.datasource
      this.targetProdOrderNo = row.prodOrderNo
    },
    /** 复用确定按钮 */
    submitCopy() {
      const code = this.copyCode
      const sort = this.copySort
      const prodOrderNo = this.copyProdOrderNo
      const ncReceivedId = this.ncReceivedId
      const targetProdOrderNo = this.targetProdOrderNo
      confirmReuse({'targetProdOrderNo':targetProdOrderNo,'code':code,'sort':sort,'prodOrderNo':prodOrderNo,'ncReceivedId':ncReceivedId}).then(res =>{
        this.$modal.msgSuccess("复用历史图档成功")
        this.copy.open = false
        this.getListAlready()
      })
    },
    /** 导出按钮操作 */
    handleExport() {
      this.openExport = true;
      var data = this.sheduleList; // 这里面是数据列表
      const column = [
        { title: "工序序号", dataIndex: "sort" },
        { title: "工序名称", dataIndex: "code" },
        { title: "设计状态(1 已领取 2 已开始 3 已暂停)", dataIndex: "designStatus" },
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
      instance.download("NC编程已领取列表").then((data) => {
        this.openExport = false
      }); // 导出的文件名
    },
  }
};
</script>

