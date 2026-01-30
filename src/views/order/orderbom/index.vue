<template>
  <div class="app-container">
    <div slot="header">
      <el-form :model="queryParams" ref="queryForm" v-show="showSearch" :inline="true" :label-position="labelPosition" label-width="90px">
        <el-form-item label="客户名称" prop="customerName">
          <el-input
            v-model="queryParams.customerName"
            placeholder="请输入客户名称"
            clearable
            size="small"
            style="width: 220px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="客户订单号" prop="customerOrderNo">
          <el-input
            v-model="queryParams.customerOrderNo"
            placeholder="请输入客户订单号"
            clearable
            size="small"
            style="width: 220px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="派工单号" prop="executionOrderNo">
          <el-input
            v-model="queryParams.executionOrderNo"
            placeholder="请输入派工单号"
            clearable
            size="small"
            style="width: 220px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="投单人" prop="investor">
          <el-input
            v-model="queryParams.investor"
            placeholder="请输入投单人工号"
            clearable
            size="small"
            style="width: 220px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="客户料号" prop="customerItemNo">
          <el-input
            v-model="queryParams.customerItemNo"
            placeholder="请输入客户料号"
            clearable
            size="small"
            style="width: 220px"
            @keyup.enter.native="handleQuery"
          />
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
        <el-form-item label="投单日期" prop="orderDate">
          <el-input
            v-model="queryParams.orderDate"
            placeholder="请输入投单日期"
            clearable
            size="small"
            style="width: 220px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item v-loading="loading" style="padding-left: 35px">
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
          <el-button size="mini" type="primary" icon="el-icon-folder-add" @click="handleImport">导入订单</el-button>
          <el-button size="mini" type="primary" icon="el-icon-folder-add" @click="handleImportCheck">订单导入校验提交</el-button>
          <el-button plain icon="el-icon-download" size="mini" style="margin-bottom: 10px;background-color: #6B68CD;color: #ffffff" @click="handleExport">导出</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-row>
      <el-col :span="22"><i class="el-icon-s-order" style="margin-bottom: 10px">订单（提示：双击查看BOM明细）</i></el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getListOrder"></right-toolbar>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-table ref="multipleTable" v-loading="loading" :data="orderList" @selection-change="handleSelectionChange"
                  @row-dblclick="handleJump" max-height="750px" border highlight-current-row :row-class-name="tableRowClassName">
          <el-table-column type="selection" width="50" align="center" />
          <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
            <template slot-scope="scope" v-if="scope.row.userId !== 1">
              <el-button
                size="mini"
                round
                type="primary"
                icon="el-icon-edit"
                @click="handleUpdate(scope.row)"
              >编辑订单</el-button>
              <el-button
                size="mini"
                round
                type="info"
                icon="el-icon-folder-opened"
                @click="handleImportFiles(scope.row)"
              >客户图档</el-button>
              <el-button
                size="mini"
                round
                type="danger"
                icon="el-icon-s-tool"
                v-if="role === '超级管理员'"
                @click="changeStatus(scope.row)"
              >修改状态</el-button>
            </template>
          </el-table-column>
          <el-table-column label="客户名称" align="center" prop="customerName" :show-overflow-tooltip="true" />
          <el-table-column label="客户订单号" align="center" prop="customerOrderNo"  />
          <el-table-column label="模号" align="center" prop="customerItemNo" />
          <el-table-column label="SAP料号id" align="center" prop="customerItemNoId" v-if="false"/>
          <el-table-column label="投单人" align="center" prop="investor" />
          <el-table-column label="部门代码" align="center" prop="codingRulesDeptCode" />
          <el-table-column label="机种" align="center" prop="typeOfMachine"/>
          <el-table-column label="零件名称" align="center" prop="pinName"  />
          <el-table-column label="投单日期" align="center" prop="orderDate" width="95"/>
          <el-table-column label="需求日期" align="center" prop="demandDate" width="95"/>
          <el-table-column label="开发案号" align="center" prop="devCaseNo" />
          <el-table-column label="派工单号" align="center" prop="executionOrderNo" width="120" />
          <el-table-column label="AUC号" align="center" prop="auc"  />
          <el-table-column label="WBS元素" align="center" prop="wbs"  />
          <el-table-column label="投单类型" align="center" prop="processingContent" />
          <el-table-column label="投单性质" align="center" prop="orderNature" />
          <el-table-column label="投单原因" align="center" prop="orderReason"  />
          <el-table-column label="交货等级" align="center" prop="deliveryLevel">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.deliveryLevel =='0'" type="danger">特急件</el-tag>
              <el-tag v-if="scope.row.deliveryLevel =='1'" type="warning">急件</el-tag>
              <el-tag v-if="scope.row.deliveryLevel =='2'">一般</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="联系人" align="center" prop="contactName"  />
          <el-table-column label="收货地址" align="center" prop="receivingAddress" :show-overflow-tooltip="true" />
          <el-table-column label="联系电话" align="center" prop="contactNumber" :show-overflow-tooltip="true" />
          <el-table-column label="整套交货" align="center" prop="completeDelivery"  />
          <el-table-column label="工件类型" align="center" prop="workpieceTypeName"  />
          <el-table-column label="派工单状态" align="center" prop="orderState">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.orderState === '0'">未完结</el-tag>
              <el-tag v-if="scope.row.orderState === '1'" type="success">已完结</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="图档上传进度" align="center" prop="completionRatio" width="200px">
            <template slot-scope="scope">
              <el-progress :text-inside="true" :stroke-width="20" :percentage="Number(((scope.row.drawFinish/scope.row.totalCount)*100).toFixed(2))" :color="customColorMethod"></el-progress>
            </template>
          </el-table-column>
        </el-table>
        <div align="center">
          <pagination
            v-show="total>0"
            :total="total"
            :page.sync="queryParams.pageNo"
            :limit.sync="queryParams.pageSize"
            @pagination="getListOrder"
          />
          <el-row style="margin-top: 30px">
            <el-button
              size="mini"
              round
              type="primary"
              icon="el-icon-check"
              @click="handleAdd"
            >新增订单</el-button>
            <el-button
              size="mini"
              round
              style="background-color: #FF8294;color: #ffffff"
              icon="el-icon-delete"
              :disabled="multiple"
              @click="handleDelete"
            >删除</el-button>
            <el-button
              size="mini"
              round
              type="primary"
              icon="el-icon-document-copy"
              :disabled="multiple"
              @click="handleCopy"
            >翻单</el-button>
          </el-row>
        </div>
      </el-col>
    </el-row>

    <!-- 新增订单BOM对话框 -->
    <el-dialog v-dialog-drag :title="title" :visible.sync="open" width="700px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="机种" prop="typeOfMachine">
              <el-input v-model="form.typeOfMachine" placeholder="" />
            </el-form-item>
            <el-form-item label="品名" prop="pinName">
              <el-input v-model="form.pinName" placeholder="" />
            </el-form-item>
            <el-form-item label="投单日期" prop="orderDate">
              <el-date-picker v-model="form.orderDate" type="date" placeholder="选择日期" value-format="yyyy-MM-dd" style="width: 100%" disabled/>
            </el-form-item>
            <el-form-item label="需求日期" prop="demandDate">
              <el-date-picker v-model="form.demandDate" type="date" placeholder="选择日期" value-format="yyyy-MM-dd" style="width: 100%"/>
            </el-form-item>
            <el-form-item label="开发案号" prop="devCaseNo">
              <el-input v-model="form.devCaseNo"  placeholder="" />
            </el-form-item>
            <el-form-item label="派工单号" prop="executionOrderNo">
              <el-input v-model="form.executionOrderNo" placeholder="" disabled/>
            </el-form-item>
            <el-form-item label="投单原因" prop="orderReason">
              <el-select v-model="form.orderReason" filterable placeholder="请选择" style="width: 100%">
                <el-option
                  v-for="dict in dict.type.order_Reason"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.label"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="投单性质" prop="orderNature">
              <el-select v-model="form.orderNature" filterable placeholder="请选择" style="width: 100%">
                <el-option
                  v-for="dict in dict.type.order_nature"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.label"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="投单类型" prop="processingContent">
              <el-select v-model="form.processingContent" filterable placeholder="请选择" style="width: 100%">
                <el-option
                  v-for="dict in dict.type.order_type"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.label"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="工件类型" prop="workpieceTypeId">
              <el-select v-model="form.workpieceTypeId" filterable placeholder="请选择工件类型" style="width: 100%">
                <el-option
                  v-for="item in workpieceFororder"
                  :key="item.id"
                  :label="item.typeName"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="联系电话" prop="contactNumber">
              <el-input v-model="form.contactNumber" placeholder="" disabled>
                <p>{{contactNumber}}</p>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="WBS元素" prop="wbs">
              <el-input v-model="form.wbs" placeholder="" />
            </el-form-item>
            <el-form-item label="部门代码" prop="codingRulesDeptId">
              <el-select v-model="form.codingRulesDeptId" filterable placeholder="请选择部门" style="width: 100%">
                <el-option
                  v-for="item in codeFororder"
                  :key="item.deptId"
                  :label="item.deptCode"
                  :value="item.deptId"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="AUC号" prop="auc">
              <el-input v-model="form.auc" placeholder="" />
            </el-form-item>
            <el-form-item label="客户名称" prop="customerName">
              <el-select v-model="form.customerCode" filterable placeholder="请选择" style="width: 100%" @change="selectContact">
                <el-option
                  v-for="item in customerFororder"
                  :key="item.socialUnifiedCreditCode"
                  :label="item.corporateName"
                  :value="item.socialUnifiedCreditCode"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="客户订单号" prop="customerOrderNo">
              <el-input v-model="form.customerOrderNo" placeholder="" />
            </el-form-item>
            <el-form-item label="客户料号" prop="customerItemNo">
<!--              <el-input v-model="form.customerItemNo"  placeholder="" />-->
              <el-select v-model="form.customerItemNo" filterable placeholder="请选择" style="width: 100%" @change="selectSapNo">
                <el-option
                  v-for="item in sapNoList"
                  :key="item.sapItemNo"
                  :label="item.sapItemNo"
                  :value="item.sapItemNo"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="客户料号ID" prop="customerItemNoId">
              <!--              <el-input v-model="form.customerItemNo"  placeholder="" />-->
              <el-select v-model="form.customerItemNoId" filterable placeholder="请选择" style="width: 100%">
                <el-option
                  v-for="item in sapNoListId"
                  :key="item.id"
                  :label="item.id"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="交货等级" prop="deliveryLevel">
              <el-select v-model="form.deliveryLevel" filterable placeholder="请选择" style="width: 100%">
                <el-option
                  v-for="dict in dict.type.deliveryLevel"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="投单人" prop="investor">
              <el-input v-model="form.investor"  placeholder="" disabled/>
            </el-form-item>
            <el-form-item label="整套交货" prop="completeDelivery">
<!--              <el-radio-group v-model="form.completeDelivery">-->
<!--                <el-radio-->
<!--                  v-for="dict in dict.type.complete_delivery"-->
<!--                  :key="dict.value"-->
<!--                  :label="dict.value"-->
<!--                >{{dict.label}}</el-radio>-->
<!--              </el-radio-group>-->
              <input type="radio" name="radios" value="Y" v-model="form.completeDelivery"><label>Y</label>
              <input type="radio" name="radios" value="N" v-model="form.completeDelivery"><label>N</label>
            </el-form-item>
            <el-form-item label="联系人" prop="contactName">
              <el-select v-model="form.contactName" filterable placeholder="请选择联系人" style="width: 100%" @change="selectContactNumber">
                <el-option
                  v-for="item in contactFororder"
                  :key="item.id"
                  :label="item.name"
                  :value="item.name"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="收货地址" prop="receivingAddress">
              <el-input v-model="form.receivingAddress" type="textarea"  placeholder=""/>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="open = false">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 订单导入对话框 -->
    <!-- 订单导入对话框 -->
    <el-dialog v-dialog-drag :title="upload.title" :visible.sync="upload.open" width="400px" append-to-body>
      <el-upload
        ref="upload"
        :on-change="handlePreview"
        :limit="1"
        accept=".xlsx, .xls"
        :headers="upload.headers"
        :action="upload.url + '?bizType=1' + '&codingRulesDeptId='+call"
        :disabled="upload.isUploading"
        :on-progress="handleFileUploadProgress"
        :on-success="handleFileSuccess"
        :auto-upload="false"
        :file-list="fileList"
        drag
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip text-center" slot="tip">
          <span>仅允许导入xls、xlsx格式文件。</span>
          <el-link type="primary" :underline="false" style="font-size:12px;vertical-align: baseline;" @click="importTemplate">下载模板</el-link>
        </div>
      </el-upload>
      <el-form ref="form" :model="form" :rules="rules" label-position="left" label-width="100px" style="padding-top: 20px">
        <el-form-item label="部门代码" prop="deptId">
          <el-select v-model="form.codingRulesDeptId" placeholder="请选择部门" style="width: 100%" @change="handleSelect">
            <el-option
              v-for="item in codeFororder"
              :key="item.deptId"
              :label="item.deptCode"
              :value="item.deptId"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFileForm">确 定</el-button>
        <el-button @click="upload.open = false">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 客户图档对话框 -->
    <el-dialog v-dialog-drag :title="files.title" :visible.sync="files.open" width="1200px" append-to-body>
      <el-row :gutter="24">
        <el-col :span="12">
          <el-upload
            class="pop-upload"
            ref="upload"
            action=""
            :file-list="fileList"
            :auto-upload="false"
            :multiple="true"
            :on-change="handleChange"
            :on-remove="handleRemove"
          >
            <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
            <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
          </el-upload>
          <!--      <WebUploader-->
          <!--        :fileNumLimit="fileNumLimit"-->
          <!--        :fileSize="fileSize"-->
          <!--        :chunkSize="chunkSize"-->
          <!--        :uploadSuffixUrl="uploadSuffixUrl"-->
          <!--        :options="options"-->
          <!--        :fileListData="tableData"-->
          <!--      > </WebUploader>-->
          <!--      <div>-->
          <!--        <iframe src="/static/webuploader/bigFileUpload.html" frameborder="0" style="width: 100%;height: 50vh"></iframe>-->
          <!--      </div>-->
        </el-col>
        <el-col :span="12">
          <el-table :data="bomData" v-loading="loading">
            <el-table-column type="index" label="" width="50"></el-table-column>
            <el-table-column prop="prodOrderNo" label="生产单号" align="center"></el-table-column>
            <el-table-column prop="moduleNo" label="模号" align="center"></el-table-column>
            <el-table-column prop="pieceNo" label="件号" align="center"></el-table-column>
            <el-table-column prop="versionNo" label="版次" align="center"></el-table-column>
            <el-table-column prop="status" label="状态" align="center">
              <template slot-scope="scope">
                <el-tag v-if="scope.row.status === '1'" type="success">已转生产单</el-tag>
                <el-tag v-if="scope.row.status === '0'" type="danger">未转生产单</el-tag>
              </template>
            </el-table-column>
          </el-table>
          <pagination
            v-show="total>0"
            :total="total"
            :page.sync="queryParamsOrder.pageNo"
            :limit.sync="queryParamsOrder.pageSize"
            @pagination="getListDetail"
          />
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button @click="files.open = false" type="danger" style="margin-right: 40%">关 闭</el-button>
      </div>
    </el-dialog>
    <!-- 产能预估对话框 -->
    <el-dialog :title="capacity.title" :visible.sync="capacity.open" width="400px" append-to-body>
      <el-table :data="capacityData" v-loading="loading" :default-sort = "{order: 'descending'}">
        <el-table-column type="index" label="排序" width="50"></el-table-column>
        <el-table-column prop="personNo" label="工号" width="190px" sortable></el-table-column>
        <el-table-column prop="name" label="姓名"></el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="capacity.open = false" type="danger" style="margin-right: 40%">关 闭</el-button>
      </div>
    </el-dialog>
    <!--导出-->
<!--    <el-dialog :title="title" :visible.sync="openExport" width="400px" append-to-body>-->
<!--      <el-form ref="formExport" :model="formExport" :rules="rules" label-width="100px">-->
<!--        <el-form-item label="开始时间" prop="beginTime">-->
<!--          <el-date-picker-->
<!--            v-model="formExport.beginTime"-->
<!--            type="date"-->
<!--            placeholder="选择日期时间"-->
<!--            value-format="yyyy-MM-dd">-->
<!--          </el-date-picker>-->
<!--        </el-form-item>-->
<!--        <el-form-item label="结束时间" prop="endTime">-->
<!--          <el-date-picker-->
<!--            v-model="formExport.endTime"-->
<!--            type="date"-->
<!--            placeholder="选择日期时间"-->
<!--            value-format="yyyy-MM-dd">-->
<!--          </el-date-picker>-->
<!--        </el-form-item>-->
<!--      </el-form>-->
<!--      <div slot="footer" class="dialog-footer">-->
<!--        <el-button type="primary" @click="submitFormExport" icon="el-icon-download">导出</el-button>-->
<!--        <el-button @click="openExport = false">取 消</el-button>-->
<!--      </div>-->
<!--    </el-dialog>-->
    <!-- 修改状态 -->
    <el-dialog :title="status.title" :visible.sync="status.open" width="400px" append-to-body>
      <el-form ref="formStatus" :model="formStatus" :rules="rules" label-width="100px">
        <el-form-item label="状态：" prop="orderState">
          <el-radio-group v-model="formStatus.orderState">
            <el-radio :label="0">未完结</el-radio>
            <el-radio :label="1">已完结</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFormStatus">确 定</el-button>
        <el-button @click="status.open = false" type="danger">关 闭</el-button>
      </div>
    </el-dialog>
    <!-- 翻单 -->
    <el-dialog :title="order.title" :visible.sync="order.open" width="400px" append-to-body>
      <div>确定对{{orderNo}}翻单吗</div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="confirmCopy">确 定</el-button>
        <el-button @click="order.open = false" type="danger">关 闭</el-button>
      </div>
    </el-dialog>

    <!-- 订单导入校验提交对话框 -->
    <el-dialog
      v-dialog-drag
      title="订单导入校验提交"
      :visible.sync="excelEditorVisible"
      width="95%"
      top="5vh"
      append-to-body
      :close-on-click-modal="false"
      custom-class="excel-editor-dialog">
      <div v-if="excelEditorVisible" class="dialog-content-wrapper">
        <agrid-config
          ref="excelEditor"
          :dept-options="codeFororder"
          @submit-success="handleExcelSubmitSuccess">
        </agrid-config>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="excelEditorVisible = false">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {
    listOrderBom,
    addOrderBom,
    updateOrderBom,
    deleteOrderBom,
    copyOrderBom,
    getOrderBom,
    checkCustomerOrderNo,
    importTemplate,
    importOrderBom,
    uploadFormFile,
    exportBom, listBomDetail, editOrderState
  } from "../../../api/order/orderbom"
  import {getToken} from "../../../utils/auth";
  import {listContact, listCustomer, selectCustomerContacts} from "../../../api/system/customer";
  import {listPerson} from "../../../api/system/person";
  import {listCode} from "../../../api/system/code";
  import global from '../../../store/global.js'
  import {treeselect} from "../../../api/system/dept";
  import Treeselect from "@riophae/vue-treeselect";
  import "@riophae/vue-treeselect/dist/vue-treeselect.css";
  import {getUserProfile} from "../../../api/system/user";
  import {getProcessWorkpieceType} from "../../../api/system/process";
  import WebUploader from "../../../components/WebUploader"
  import { ElMapExportTable } from 'table-excel'
  import { getOrderBomSapItemPage } from '@/api/order/sapItemNumber'
  import AgridConfig from '@/views/order/orderbom/agirdCheckBom/index.vue' // 注意这里加了 .vue 扩展名


  export default {
    name: "Orderbom",
    dicts: ['sys_normal_disable','deliveryLevel','order_Reason','order_nature','order_type','complete_delivery'],
    components: { Treeselect, WebUploader,AgridConfig },
    data() {
      return {
        labelPosition: 'right',
        call: "",
        // 部门树选项
        deptOptions: undefined,
        // 导入订单
        fileList: [],
        // 遮罩层
        loading: true,
        // 总条数
        total: 0,
        // 非单个禁用
        single: true,
        // 非多个禁用
        multiple: true,
        // 显示搜索条件
        showSearch: true,
        // 订单BOM表格数据
        orderList: [],
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        openExport: false,
        // 订单BOM表单参数
        form: {},
        // 客户图档表单参数
        formFile: {},
        //导出表单数据
        formExport:{},
        //订单状态表单参数
        formStatus:{},
        // 产能预估表格参数
        capacityData: [],
        //选中数组
        Ids:[],
        code:[],
        orderNo:[],
        Name:[],
        caseNO:[],
        //客户资料数据
        customerFororder:[],
        //SAP料号数据
        sapNoList:[],
        //SAP料号id数据
        sapNoListId:[],
        //投单人数据
        investorForperson:'',
        // 部门代码数据
        codeFororder: [],
        //工件类型
        workpieceFororder:'',
        //客户代码
        customerCode:[],
        socialUnifiedCreditCode:'',
        selectCode:'',
        //联系人数据
        contactFororder:[],
        contact:[],
        //联系电话
        contactNumber:'',
        contactId:'',
        //客户图档数据
        BomId:'',
        //图档状态数据
        bomData:[],
        //角色信息
        role:'',
        //修改状态bomId
        statusId:'',
        //导出列表
        sheduleList:[],
        // 查询参数
        queryParams: {
          pageNo: 1,
          pageSize: 10,
          bizType:"1",
          file:'',
          files:[],
          codingRulesDeptId:'',
        },
        // 查询参数
        queryParamsOrder: {
          pageNo: 1,
          pageSize: 10,
          bizType:"1",
        },
        // 查询参数
        queryParamsCustomer: {
          pageNo: 1,
          pageSize: 100000,
        },
        // 查询参数
        queryParamsSap: {
          pageNo: 1,
          pageSize: 100000,
        },
        // 查询参数
        queryParamsSapId: {
          pageNo: 1,
          pageSize: 100000,
        },
        //客户图档表单参数
        files: {
          // 是否显示弹出层
          open: false,
          // 弹出层标题
          title: "",
        },
        //产能预估表单参数
        capacity: {
          // 是否显示弹出层
          open: false,
          // 弹出层标题
          title: "",
        },
        //修改订单状态表单参数
        status: {
          // 是否显示弹出层
          open: false,
          // 弹出层标题
          title: "",
        },
        //修改订单状态表单参数
        order: {
          // 是否显示弹出层
          open: false,
          // 弹出层标题
          title: "",
        },
        //上传参数
        upload: {
          // 是否显示弹出层
          open: false,
          // 弹出层标题
          title: "",
          // 是否禁用上传
          isUploading: false,
          // 是否更新已经存在的用户数据
          updateSupport: 0,
          // 设置上传的请求头部
          headers: { Authorization: "Bearer " + getToken() },
          // 上传的地址
          url: process.env.VUE_APP_BASE_API + "/order/bom/importOrderBomAndDetail",
        },
        //订单BOM表单校验
        rules: {
          code: [
            { required: true, message: "材质编码不能为空", trigger: "blur" },
            { min: 2, max: 10, message: '材质编码长度必须介于 2 和 10 之间', trigger: 'blur' }
          ],
          name: [
            { required: true, message: "名称不能为空", trigger: "blur" },
            { min: 2, max: 10, message: '名称长度必须介于 2 和 10 之间', trigger: 'blur' }
          ],
          deptId: [
            { required: true, message: "部门代码不能为空", trigger: "blur" },
          ],
          typeOfMachine: [
            { required: true, message: "机种不能为空", trigger: "blur" },
          ],
          pinName: [
            { required: true, message: "品名不能为空", trigger: "blur" },
          ],
          demandDate: [
            { required: true, message: "需求日期不能为空", trigger: "blur" },
          ],
          devCaseNo: [
            { required: true, message: "开发案号不能为空", trigger: "blur" },
          ],
          orderReason: [
            { required: true, message: "投单原因不能为空", trigger: "blur" },
          ],
          processingContent: [
            { required: true, message: "投单类型不能为空", trigger: "blur" },
          ],
          orderNature: [
            { required: true, message: "投单性质不能为空", trigger: "blur" },
          ],
          workpieceTypeId: [
            { required: true, message: "工件类型不能为空", trigger: "blur" },
          ],
          contactNumber: [
            { required: true, message: "联系电话不能为空", trigger: "blur" },
          ],
          wbs: [
            { required: true, message: "WBS元素不能为空", trigger: "blur" },
          ],
          codingRulesDeptId: [
            { required: true, message: "部门代码不能为空", trigger: "blur" },
          ],
          auc: [
            { required: true, message: "AUC号不能为空", trigger: "blur" },
          ],
          customerOrderNo: [
            { required: true, message: "客户订单号不能为空", trigger: "blur" },
          ],
          customerItemNo: [
            { required: true, message: "客户料号不能为空", trigger: "blur" },
          ],
          customerItemNoId: [
            { required: true, message: "客户料号ID不能为空", trigger: "blur" },
          ],
          deliveryLevel: [
            { required: true, message: "交货等级不能为空", trigger: "blur" },
          ],
          completeDelivery: [
            { required: true, message: "整套交货不能为空", trigger: "blur" },
          ],
          receivingAddress: [
            { required: true, message: "收货地址不能为空", trigger: "blur" },
          ],
          contactName: [
            { required: true, message: "联系人不能为空", trigger: "blur" },
          ],
        },
        options: {
          // 可通过 https://github.com/simple-uploader/Uploader/tree/develop/samples/Node.js 示例启动服务
          target: '//localhost:3000/upload',
          autoStart: false,
          testChunks: false,
          //允许上传的文件
          fileType:"doc,docx,pdf,xls,xlsx,ppt,pptx,gif,jpg,jpeg,bmp,png,rar,zip,mp4,avi",
          fileUploadUrl:"/upload/fileRecord/zone/upload",//上传地址
          fileCheckUrl:"/upload/fileRecord/zone/upload/md5Check",//检测文件是否存在url
          checkChunkUrl:"/upload/fileRecord/zone/upload/md5Check",//检测分片url
          mergeChunksUrl:"/upload/fileRecord/zone/upload/merge/",//合并文件请求地址
          headers:{}
        },
        attrs: {
          accept: 'image/*'
        },
        uploader:{},
        uploadBtnDisabled:false,
        uploadStaus:"el-icon-upload",
        tableData:[],//显示集合
        fileNumLimit:2,//文件总数
        fileSize:100*1024*1024*1024,//默认上传文件大小
        chunkSize:5*1024*1024,//默认文件片段
        uploadSuffixUrl:"http://localhost:8081/",
        excelEditorVisible: false, // Excel编辑器弹窗显示状态
        uploadForm: {
          codingRulesDeptId: ''
        },//新增上传id
        uploadRules: {
          codingRulesDeptId: [
            { required: true, message: "部门代码不能为空", trigger: "blur" },
          ]
        },
      };
    },
    created() {
      this.getListOrder();
      this.getListCustomer();
      this.getListCode();
      this.getTreeselect();
      this.getSetting();
      this.getListUser();
      this.getListSap();
    },
    methods: {
      /** 查询部门下拉树结构 */
      getTreeselect() {
        treeselect().then(response => {
          this.deptOptions = response.data;
        });
      },
      /** 部门树自定义标签 */
      normalizer(node) {
        return {
          id: node.id,
          label: node.deptCode,
          children: node.children
        }
      },
      /** 分页查询订单BOM列表 */
      getListOrder() {
        this.loading = true;
        listOrderBom(this.queryParams).then(response => {
          this.orderList = response.data.records;
          this.sheduleList = response.data.records;
          this.total = response.data.total;
          this.loading = false;
        });
      },
      /** 分页查询BOM明细列表 */
      getListDetail() {
        this.queryParamsOrder.bomId = this.BomId
        const arr = []
        listBomDetail(this.queryParamsOrder).then(response => {
          response.data.records.forEach(function (item) {
            arr.push({
              prodOrderNo:item.prodOrderNo,
              moduleNo:item.moduleNo,
              pieceNo:item.pieceNo,
              versionNo:item.versionNo,
              status:item.status
            })
          })
          this.bomData = arr
          this.total = response.data.total;
          this.loading = false;
        });
      },

      /** 查询客户信息列表 */
      getListCustomer() {
        this.loading = true;
        listCustomer(this.queryParamsCustomer).then(response => {
            this.customerFororder = response.data.records;
          });
      },

      /** 查询SAP料号 */
      getListSap() {
        getOrderBomSapItemPage(this.queryParamsSap).then(res => {
          const map = new Map()
          let arr = res.data.records
          const qc = arr.filter(key => !map.has(key.sapItemNo) && map.set(key.sapItemNo, 1))
          this.sapNoList = qc
        })
      },

      /** 联系人查询 */
      selectContact(val) {
        this.socialUnifiedCreditCode = val
        listCustomer(this.queryParams).then(response => {
          const he = response.data.records.filter(item => item.socialUnifiedCreditCode === this.socialUnifiedCreditCode)
          this.selectCode = he[0].id
        }).then(() => {
          listContact({'customerId':this.selectCode}).then(response => {
            this.contactFororder = response.data;
          });
        });
      },
      /** 联系电话查询 */
      selectContactNumber(val) {
        this.contactName = val
        selectCustomerContacts({'name':this.contactName}).then(res =>{
          this.contactId = res.data.id
          this.form.contactId = this.contactId
        })
        listContact({'customerId':this.selectCode}).then(response => {
          const arr = response.data.find(item => item.id = this.contactId)
          this.contactNumber = arr.phone
          this.form.contactNumber = this.contactNumber
          this.form.contactName = arr.name
        });
      },
      /** 查询编码规则列表 */
      getListCode() {
        listCode(this.queryParams).then(response => {
          const map = new Map()
          const qc = response.data.records.filter(key => !map.has(key.deptCode) && map.set(key.deptCode, 1)) // 这里对deptCode属性进行去重
          this.codeFororder = qc;
        });
      },
      /** 查询登录用户信息*/
      getListUser() {
        getUserProfile().then(response => {
          this.role = response.roleGroup
          this.investorForperson = response.data.userName
        });
      },
      /** 查询工件类型 */
      getSetting() {
        getProcessWorkpieceType(this.queryParams).then(response => {
          this.workpieceFororder = response.data.records;
        });
      },
      // 订单BOM表单重置
      reset() {
        this.form = {
          customerCode: undefined,
          customerName: undefined,
          customerOrderNo: undefined,
          executionOrderNo: undefined,
        };
        this.resetForm("form");
      },
      handleSelectionChange(selection) {
        this.Ids = selection.map(item => item.id);
        this.code = selection.map(item => item.customerOrderNo);
        this.orderNo = selection.map(item => item.executionOrderNo);
        this.codingRulesDeptId = selection.map(item => item.codingRulesDeptId);
        this.single = selection.length != 1;
        this.multiple = !selection.length;
      },
      //双击单元格跳转
      handleJump(row) {
        this.$router.push({
          path:'/order/orderbom-edit/productorder/index',
          query:{
            customerId: row.id,
            moduleNo:row.customerItemNo,
            orderReason:row.orderReason,
            processingContent:row.processingContent,
            orderNature:row.orderNature,
            executionOrderNo:row.executionOrderNo,
            demandDate:row.demandDate
          },
        });
      },
      /** 搜索按钮操作 */
      handleQuery() {
        this.queryParams.pageNo = 1;
        this.getListOrder();
      },
      /** 翻单按钮 */
      handleCopy() {
        // this.$alert('确定对'+this.orderNo+'翻单吗', '提示', {
        //   confirmButtonText: '确定',
        //   callback: action => {
        this.order.open = true
        this.order.title = '翻单'

          // }
        // });
      },

      /** 翻单确认按钮 */
      confirmCopy(){
        this.reset();
        const id = this.Ids;
        copyOrderBom({'ids':id}).then(response => {
          this.orderList = response.data;
          this.getListOrder();
        });
      },
      /** 新增订单BOM按钮 */
      handleAdd() {
        this.reset();
        this.open = true;
        this.title = "新增订单";
        this.form.investor = this.investorForperson
      },
      /** 编辑订单BOM按钮 */
      handleUpdate(row) {
        this.reset();
        const id = row.id
        this.form.contactName = row.contactName
        getOrderBom({'id':id}).then(response => {
          this.form = response.data;
          this.open = true;
          this.title = "编辑订单";
        });
      },
      /** 删除订单BOM按钮 */
      handleDelete() {
        const Id = this.Ids ;
        const customerCode = this.code;
        this.$modal.confirm('是否确认删除客户订单号为"' + customerCode + '"的数据项？').then(function() {
          return deleteOrderBom({'ids':Id});
        }).then(() => {
          this.getListOrder();
          this.$modal.msgSuccess("删除成功");
        }).catch(() => {});
      },
      /** 产能预估按钮 */
      handleEstimate() {
      },
      /** 客户图档 */
      handleImportFiles(row) {
        this.fileList = []
        const name = row.customerName;
        const caseNo = row.devCaseNo;
        this.BomId = row.id
        this.files.title = "客户 "+name+' 开发案号 '+caseNo+' 的文档信息';
        this.files.open = true;
        this.getListDetail()
      },
      /** 新增订单BOM提交按钮 */
      submitForm: function() {
        this.$refs["form"].validate(valid => {
          if (valid) {
            if (this.form.id != undefined) {
              this.form.bizType = '1'
              updateOrderBom(this.form).then(response => {
                this.$modal.msgSuccess("修改成功");
                this.open = false;
                this.getListOrder();
              });
            } else {
              checkCustomerOrderNo(this.form).then(response =>{
                if(response.data == true){
                  this.$message.error("客户订单号已存在");
                }else{
                  this.form.bizType = '1'
                  addOrderBom(this.form).then(response => {
                    this.$modal.msgSuccess("新增成功");
                    this.open = false;
                    this.getListOrder();
                  });
                }
              })
            }
          }else{
            this.$modal.msgError("表单验证失败,请检查是否输入正确");
          }
        });
      },
      /** 导入订单BOM按钮操作 */
      handleImport() {
        this.upload.title = "订单导入";
        this.upload.open = true;
      },
      handleEditOrder() {
        this.uploadOrde.title = "订单编辑";
        this.uploadOrde.open = true;
      },
      /** 下载模板操作 */
      importTemplate() {
        window.open(global.host+"订单Bom模板.xlsx")
      },
      // 文件上传中处理
      handleFileUploadProgress(event, file, fileList) {
        this.upload.isUploading = true;
      },
      // 文件上传成功处理
      handleFileSuccess(response, file, fileList) {
        this.upload.open = false;
        this.upload.isUploading = false;
        this.$refs.upload.clearFiles();
        this.$alert("<div style='overflow: auto;overflow-x: hidden;max-height: 70vh;padding: 10px 20px 0;'>" + response.msg + "</div>", "导入结果", { dangerouslyUseHTMLString: true });
        this.getListOrder();
      },
      handlePreview(file,res) {
        this.queryParams.file = file.name
      },
      // 文件上传前
      beforeUpload(file){
        this.files = file;
        //this.fileName = file.name;
      },
      // 提交上传文件
      submitFileForm(res) {
        //const formData = new FormData();
        //formData.append('files', this.file);
        /*importOrderBom(this.queryParams).then(response => {
        });*/
        this.$refs.upload.submit();
      },

      // 树形选择框选择事件
      handleSelect(data) {
        this.call = data
      },
      /** 客户图档上传 */
      // 文件状态改变时的钩子，添加文件、上传成功和上传失败时都会被调用,function(file, fileList)
      handleChange(file, fileList) {
        this.fileList = fileList
      },
      // 删除文件之前的钩子，参数为上传的文件和文件列表，若返回 false 或者返回 Promise 且被 reject，则停止删除。function(file, fileList)
      handleRemove(file, fileList) {
        this.fileList = fileList
      },
      //上传服务器
      submitUpload() {
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
        // 添加自定义参数，不传可删除
        formData.append('bomId', this.BomId)
        formData.append('userName', this.investorForperson)

        //自定义的接口也可以用ajax或者自己封装的接口
        uploadFormFile(formData).then(res => {
          if (res.code === 200) {
            this.$message.success('上传成功');
            this.files.open = false;
            this.getFile();
            this.getPublicFile();
          } else {
            this.$message.error('上传失败');
          }
          //清空fileList
          this.fileList = []
        })
      },
      // /** 导出按钮操作 */
      // handleExport() {
      //   this.openExport = true;
      // },
      // submitFormExport() {
      //   this.queryParams.beginTime = this.formExport.beginTime
      //   this.queryParams.endTime = this.formExport.endTime
      //   exportBom(this.queryParams).then(response => {
      //     window.open(global.host+response.msg)
      //   });
      // },
      /** 导出按钮操作 */
      handleExport() {
        this.loading = true
        setTimeout(()=>{
          this.loading=false   //点击一次时隔五秒后才能再次点击
        },3000)
        var data = this.sheduleList; // 这里面是数据列表
        console.log('data', data)
        const column = [
          { title: "客户名称", dataIndex: "customerName" },
          { title: "客户订单号", dataIndex: "customerOrderNo" },
          { title: "模号", dataIndex: "customerItemNo" },
          { title: "SAP料号id", dataIndex: "customerItemNoId" },
          { title: "投单人", dataIndex: "investor" },
          { title: "部门代码", dataIndex: "codingRulesDeptCode" },
          { title: "机种", dataIndex: "typeOfMachine" },
          { title: "零件名称", dataIndex: "pinName" },
          { title: "投单日期", dataIndex: "orderDate" },
          { title: "需求日期", dataIndex: "demandDate" },
          { title: "开发案号", dataIndex: "devCaseNo" },
          { title: "派工单号", dataIndex: "executionOrderNo" },
          { title: "AUC号", dataIndex: "auc" },
          { title: "WBS元素", dataIndex: "wbs" },
          { title: "投单类型", dataIndex: "processingContent" },
          { title: "投单性质", dataIndex: "orderNature" },
          { title: "投单原因", dataIndex: "orderReason" },
          { title: "交货等级", dataIndex: "deliveryLevel" },
          { title: "联系人", dataIndex: "contactName" },
          { title: "收货地址", dataIndex: "receivingAddress" },
          { title: "联系电话", dataIndex: "contactNumber" },
          { title: "整套交货", dataIndex: "completeDelivery" },
          { title: "工件类型", dataIndex: "workpieceTypeName" },
          { title: "派工单状态 (0未完结 1已完结)", dataIndex: "orderState" },
          { title: "已完成图档上传的订单数量", dataIndex: "drawFinish" },
          { title: "订单总数量", dataIndex: "totalCount" },
        ];
        const instance = new ElMapExportTable(
          { column, data },
          { progress: progress => this.percentage = progress },// 进度条回调
        );
        instance.download("订单BOM").then((data) => {
          this.loading = false
        }); // 导出的文件名
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
      /** 行高亮 */
      tableRowClassName({row, rowIndex}) {
        // alert(row.receivedQuantity < row.quantity)
        if (row.drawFinish === row.totalCount) {
          return 'success-row';
        } else if (row.drawFinish < row.totalCount) {
          return 'warning-row';
        }
        return '';
      },
      /** 修改状态 */
      changeStatus(row) {
        this.statusId = row.id
        this.status.title = '改变订单状态'
        this.status.open = true
      },
      submitFormStatus() {
        const bomId = this.statusId
        const orderState = this.formStatus.orderState
        editOrderState({'bomId':bomId,'orderState':orderState}).then(res =>{
          this.$modal.msgSuccess("修改派工单状态成功")
          this.status.open = false
          this.getListOrder()
        })
      },
      /** sap料号查询 */
      selectSapNo(val){
        this.queryParamsSapId.sapItemNo = val
        getOrderBomSapItemPage(this.queryParamsSapId).then(res => {
          this.sapNoListId = res.data.records.filter(item => item.status =='0')
          console.log(this.sapNoListId)
        })
      },
      /** 订单导入校验提交按钮操作 */
      handleImportCheck() {
        this.excelEditorVisible = true;
        // 确保组件加载完成后进行初始化
        this.$nextTick(() => {
          if (this.$refs.excelEditor) {
            this.resetUploadForm();
          }
        });
      },


      // 重置上传表单
      resetUploadForm() {
        this.uploadForm = {
          codingRulesDeptId: ''
        };
      }
    }
  };
</script>
<style lang="scss">
  .el-table .warning-row {
    background: #FFDDDD;
  }

  .el-table .success-row {
    background: #E4FFDD;
  }
</style>

