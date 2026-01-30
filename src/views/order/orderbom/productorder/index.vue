<template>
  <div class="app-container" >
    <div slot="header">
      <el-form :model="queryParams" ref="queryForm" v-show="showSearch" :inline="true" label-width="90px">
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
        <el-form-item label="版本" prop="versionNo">
          <el-input
            v-model="queryParams.versionNo"
            placeholder="请输入版本"
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
        <el-form-item label="工艺制程" prop="process">
          <el-input
            v-model="queryParams.process"
            placeholder="请输入工艺制程"
            clearable
            size="small"
            style="width: 220px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="品名" prop="pinName">
          <el-input
            v-model="queryParams.pinName"
            placeholder="请输入品名"
            clearable
            size="small"
            style="width: 220px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item style="padding-left: 50px">
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
          <el-button v-if="checkOver === '0'" size="mini" plain type="primary" icon="el-icon-document-copy" @click="handleImport">导入明细</el-button>
          <el-button type="warning" plain icon="el-icon-download" size="mini" style="margin-bottom: 10px;background-color: #6B68CD;color: #ffffff" @click="handleExport">导出</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-row>
      <el-col :span="18"><h1 class="el-icon-timer" style="margin-bottom: 10px">BOM订单明细</h1></el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getListDetail"></right-toolbar>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-table v-loading="loading" :data="detailList" @selection-change="handleSelectionChange" max-height="700px"
                  highlight-current-row border :cell-style="cellStyle">
          <el-table-column type="index" width="50" align="center"/>
          <el-table-column  type="selection" width="50" align="center" :selectable="selected"/>
          <el-table-column label="操作" align="center" width="240px" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-tooltip class="item" effect="dark" content="编辑" placement="top-start">
              <el-button
                circle
                type="primary"
                icon="el-icon-edit"
                @click="handleUpdate(scope.row)"
                v-if="scope.row.status === '0'"
              ></el-button></el-tooltip>
              <el-tooltip class="item" effect="dark" content="转生产单" placement="top-start">
              <el-button
                circle
                type="success"
                icon="el-icon-set-up"
                v-preventReClick="2000"
                @click="handleTurn(scope.row)"
                v-if="scope.row.status === '0'"
              ></el-button></el-tooltip>
              <el-tooltip class="item" effect="dark" content="设置工艺" placement="top-start">
              <el-button
                circle
                type="primary"
                icon="el-icon-monitor"
                @click="setupProcess(scope.row)"
                v-if="scope.row.status === '0'"
              ></el-button></el-tooltip>
              <el-tooltip class="item" effect="dark" content="看图Key工艺" placement="top-start">
                <el-button
                  circle
                  type="primary"
                  icon="el-icon-picture-outline"
                  @click="handleJump(scope.row)"
                  v-if="scope.row.status === '0'"
                ></el-button></el-tooltip>
              <el-tooltip class="item" effect="dark" content="暂停" placement="top-start">
              <el-button
                  circle
                  size="mini"
                  type="danger"
                  icon="el-icon-folder-opened"
                  style="margin-left: 5px"
                  @click="handleStop(scope.row)"
                >暂停</el-button></el-tooltip>
              <el-tooltip class="item" effect="dark" content="查看图档" placement="top-start">
              <el-button
                circle
                type="info"
                icon="el-icon-folder-opened"
                @click="watchFiles(scope.row)"
                style="margin-left: 5px"
              ></el-button></el-tooltip>
            </template>
          </el-table-column>
          <el-table-column label="订单状态" align="center" prop="orderStatus"/>
          <el-table-column label="状态" align="center" key="status" prop="status" width="93">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.status === '1'" type="success">已转生产单</el-tag>
              <el-tag v-if="scope.row.status === '0'" type="danger">未转生产单</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="零件名称" align="center" key="pinName" prop="pinName"  />
          <el-table-column label="模号" align="center" key="moduleNo" prop="moduleNo" />
          <el-table-column label="件号" align="center" key="pieceNo" prop="pieceNo"  />
          <el-table-column label="版本" align="center" key="versionNo" prop="versionNo" />
          <el-table-column label="生产单号" align="center" key="prodOrderNo" prop="prodOrderNo" width="149px">
            <template slot-scope="scope">
              <p v-if="scope.row.status === '1'">{{scope.row.prodOrderNo}}</p>
              <p v-if="scope.row.status === '0'"></p>
            </template>
          </el-table-column>
          <el-table-column label="单位" align="center" key="unit" prop="unit" />
          <el-table-column label="数量" align="center" key="quantity" prop="quantity" />
          <el-table-column label="材质" align="center" key="material" prop="material" />
          <el-table-column label="硬度" align="center" key="hardness" prop="hardness" />
          <el-table-column label="重量" align="center" key="weight" prop="weight" />
          <el-table-column label="工艺制程" align="center" key="process" prop="process" width="160px" :show-overflow-tooltip="true"/>
          <el-table-column label="规格" align="center" >
            <template slot-scope="scope">
              <p>{{scope.row.length}}*{{scope.row.width}}*{{scope.row.height}}</p>
            </template>
          </el-table-column>
          <el-table-column label="发料大小" align="center" key="issueSize" prop="issueSize" />
          <el-table-column label="发料数量" align="center" key="issuedQuantity" prop="issuedQuantity" />
          <el-table-column label="厂内料号" align="center" key="inPlantItemNumber" prop="inPlantItemNumber" />
          <el-table-column label="品名" align="center" key="productName" prop="productName" />
          <el-table-column label="投单类型" align="center" key="processingContent" prop="processingContent" />
          <el-table-column label="投单性质" align="center" key="orderNature" prop="orderNature" />
          <el-table-column label="投单原因" align="center" key="orderReason" prop="orderReason" />
          <el-table-column label="打标" align="center" key="marking" prop="marking" />
          <el-table-column label="备注" align="center" key="remark" prop="remark"  />
        </el-table>
        <div align="center">
          <pagination
            v-show="total>0"
            :total="total"
            :page.sync="queryParams.pageNo"
            :limit.sync="queryParams.pageSize"
            @pagination="getListDetail"
          />
          <el-row style="margin-top: 30px">
            <el-button
              size="mini"
              round
              type="primary"
              icon="el-icon-check"
              v-if="checkOver === '0'"
              @click="handleAdd"
            >新增工件</el-button>
            <el-button
              size="mini"
              round
              type="primary"
              icon="el-icon-d-arrow-left"
              v-preventReClick="2000"
              :disabled="multiple"
              @click="handleTurnMany"
            >批量转生产单</el-button>
            <el-button
              size="mini"
              round
              type="warning"
              icon="el-icon-delete"
              :disabled="multiple"
              @click="handleDelete"
            >删除</el-button>
            <el-button
              size="mini"
              round
              type="primary"
              icon="el-icon-refresh-left"
              @click="handleReturn"
            >返回</el-button>
            <el-button
              size="mini"
              round
              type="primary"
              @click="handleCheckOrder"
            >查看已转生产单</el-button>
          </el-row>
        </div>
      </el-col>
    </el-row>

    <!-- 新增订单BOM明细对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="700px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="生产单号" prop="prodOrderNo">
              <el-input v-model="form.prodOrderNo" placeholder="" :disabled="true" />
            </el-form-item>
            <el-form-item label="工件号" prop="pieceNo">
              <el-input v-model="form.pieceNo" placeholder="" />
            </el-form-item>
            <el-form-item label="产品" prop="pinName">
              <el-input v-model="form.pinName" placeholder="" />
            </el-form-item>
            <el-form-item label="数量" prop="quantity">
              <el-input v-model="form.quantity" placeholder="" />
            </el-form-item>
            <el-form-item label="硬度" prop="hardness">
              <el-input v-model="form.hardness" placeholder="" />
            </el-form-item>
            <el-form-item label="重量" prop="weight">
              <el-input v-model="form.weight" placeholder="" disabled/>
            </el-form-item>
            <el-form-item label="厂内料号" prop="inPlantItemNumber">
              <el-input v-model="form.inPlantItemNumber" placeholder="" />
            </el-form-item>
            <el-form-item label="投单原因" prop="orderReason">
              <el-input v-model="form.orderReason" placeholder=""/>
            </el-form-item>
            <el-form-item label="投单类型" prop="processingContent">
              <el-input v-model="form.processingContent" placeholder=""/>
            </el-form-item>
            <el-form-item label="发料大小" prop="issueSize">
              <el-input v-model="form.issueSize" placeholder=""/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="模号" prop="moduleNo">
              <el-input v-model="form.moduleNo" placeholder="" disabled/>
            </el-form-item>
            <el-form-item label="版本" prop="versionNo">
              <el-input v-model="form.versionNo" placeholder="" />
            </el-form-item>
            <el-form-item label="长" prop="length">
              <el-input v-model="form.length" placeholder="" />
            </el-form-item>
            <el-form-item label="宽" prop="width">
              <el-input v-model="form.width" placeholder="" />
            </el-form-item>
            <el-form-item label="高" prop="height">
              <el-input v-model="form.height" placeholder="" />
            </el-form-item>
            <el-form-item label="材质" prop="material">
              <el-select v-model="form.material" filterable placeholder="请选择" style="width: 100%">
                <el-option
                  v-for="item in orderForquality"
                  :key="item.code"
                  :label="item.name"
                  :value="item.code"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="单位" prop="unit">
              <el-input v-model="form.unit" placeholder="" />
            </el-form-item>
            <el-form-item label="品名" prop="productName">
              <el-input v-model="form.productName" placeholder="" />
            </el-form-item>
            <el-form-item label="投单性质" prop="orderNature">
              <el-input v-model="form.orderNature" placeholder=""/>
            </el-form-item>
            <el-form-item label="发料数量" prop="issuedQuantity">
              <el-input v-model="form.issuedQuantity" placeholder=""/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item label="备注" prop="remark">
            <el-input v-model="form.remark" type="textarea" placeholder=""/>
          </el-form-item>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="open = false">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 订单导入对话框 -->
    <el-dialog :title="upload.title" :visible.sync="upload.open" width="400px" append-to-body>
      <el-upload
        ref="upload"
        :limit="1"
        accept=".xlsx, .xls"
        :headers="upload.headers"
        :action="upload.url + '?bizType=2&bomId='+customerId"
        :disabled="upload.isUploading"
        :on-progress="handleFileUploadProgress"
        :on-success="handleFileSuccess"
        :auto-upload="false"
        drag
       >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip text-center" slot="tip">
          <span>仅允许导入xls、xlsx格式文件。</span>
          <el-link type="primary" :underline="false" style="font-size:12px;vertical-align: baseline;" @click="importTemplate">下载模板</el-link>
        </div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFileForm">确 定</el-button>
        <el-button @click="upload.open = false">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 打印内容 -->
    <el-dialog :title="print.title" :visible.sync="print.open" width="600px" append-to-body>
      <div id="printTable1">
        <div class="printBox" style="border-width: 1px;border-style: solid;page-break-after: always;width: 400px;height: 240px" v-for="item in Arr" :key="item.id">
          <h2 style="text-align: center;font-weight: bold;font-size: 12px;">RiD Tooling Centre 生产标签</h2>
          <span style="font-size: 2px">派工单号：{{ExecutionOrderNo}}</span>
          <span style="font-size: 2px;margin-left:20%">数量：{{item.quantity}}</span><br>
          <span style="font-size: 2px">模号：{{item.moduleNo}}</span>
          <span style="font-size: 2px;margin-left: 8%">材质：{{item.material}}</span><br>
          <span style="font-size: 2px">件号：{{item.pieceNo}}</span>
          <span style="font-size: 2px;margin-left: 20%">大小：{{item.length +'*'+item.width+'*'+item.height}}</span><br>
          <span style="font-size: 2px">版次：{{item.versionNo}}</span>
          <span style="font-size: 2px;margin-left: 20%">交期：{{DemandDate}}</span><br>
          <span style="font-size: 2px">工艺制程：{{item.process}}</span>
          <barcode v-bind:value="'*' + item.prodOrderNo + '*'" style="text-align: center" margin-top="30px" font-size="10px" height="10mm" width="1mm" text-align="center">
          </barcode>
        </div>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="bindPrint">确 定</el-button>
        <el-button @click="print.open = false">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 客户图档对话框 -->
    <el-dialog :title="files.title" :visible.sync="files.open" width="1200px">
      <el-row :gutter="24">
        <el-col :span="12">
          <span>工件图档</span>
          <el-button
            type="success"
            circle
            style="float: right"
            v-if="isDrawing"
            icon="el-icon-upload2"
            @click="handleAddDrawing"
          ></el-button>
          <el-table :data="filesData" border max-height="600px">
            <el-table-column property="pieceNo" label="件号" width="80px">
              <template ><!-- slot-scope="scope" -->
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
                <el-tooltip class="item" effect="dark" content="删除客户图档" placement="top-start" v-if="status !== '1'">
                  <el-button
                    type="danger"
                    circle
                    icon="el-icon-delete"
                    @click="handleDeleteDrawing(scope.row)"
                  ></el-button>
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>
          <pagination
            v-show="totalFile>0"
            :total="totalFile"
            :page.sync="queryParamsDraw.pageNo"
            :limit.sync="queryParamsDraw.pageSize"
            @pagination="getFile"
          />
        </el-col>
        <el-col :span="12">
          <span>公共图档</span>
          <el-table :data="publicFilesData" border max-height="600px">
            <el-table-column property="name" label="图纸名称" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-tooltip class="item" effect="dark" content="查看客户图档" placement="top-start">
                  <el-button
                    type="primary"
                    circle
                    icon="el-icon-folder-opened"
                    @click="handleSeeDrawing(scope.row,0)"
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
                <el-tooltip class="item" effect="dark" content="删除客户图档" placement="top-start" v-if="status !== '1'">
                  <el-button
                    type="danger"
                    circle
                    icon="el-icon-delete"
                    @click="handleDeleteDrawing(scope.row)"
                  ></el-button>
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>
          <pagination
            v-show="totalPublicFile>0"
            :total="totalPublicFile"
            :page.sync="queryParamsDraw.pageNo"
            :limit.sync="queryParamsDraw.pageSize"
            @pagination="getPublicFile"
          />
        </el-col>
      </el-row>

    </el-dialog>
    <!-- 查看已转生产单打印对话框 -->
    <el-dialog :title="order.title" :visible.sync="order.open" width="1000px" center>
      <el-table :data="orderData" v-loading="loading" border @selection-change="handleSelectionChangeAlready">
        <el-table-column type="index" width="50" align="center"/>
        <el-table-column  type="selection" width="50" align="center"/>
        <el-table-column label="状态" align="center" key="status" prop="status" width="93">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status === '1'" type="success">已转生产单</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="零件名称" align="center" key="pinName" prop="pinName"  />
        <el-table-column label="投单人" align="center" key="investor" prop="investor"  />
        <el-table-column label="模号" align="center" key="moduleNo" prop="moduleNo" />
        <el-table-column label="件号" align="center" key="pieceNo" prop="pieceNo"  />
        <el-table-column label="版本" align="center" key="versionNo" prop="versionNo" />
        <el-table-column label="生产单号" align="center" key="prodOrderNo" prop="prodOrderNo" width="149px">
          <template slot-scope="scope">
            <p v-if="scope.row.status === '1'">{{scope.row.prodOrderNo}}</p>
            <p v-if="scope.row.status === '0'"></p>
          </template>
        </el-table-column>
        <el-table-column label="单位" align="center" key="unit" prop="unit" />
        <el-table-column label="数量" align="center" key="quantity" prop="quantity" />
        <el-table-column label="材质" align="center" key="material" prop="material" />
        <el-table-column label="硬度" align="center" key="hardness" prop="hardness" />
        <el-table-column label="重量" align="center" key="weight" prop="weight" />
        <el-table-column label="工艺制程" align="center" key="process" prop="process" width="160px" :show-overflow-tooltip="true"/>
        <el-table-column label="规格" align="center" >
          <template slot-scope="scope">
            <p>{{scope.row.length}}*{{scope.row.width}}*{{scope.row.height}}</p>
          </template>
        </el-table-column>
        <el-table-column label="厂内料号" align="center" key="inPlantItemNumber" prop="inPlantItemNumber" />
        <el-table-column label="品名" align="center" key="productName" prop="productName" />
        <el-table-column label="投单类型" align="center" key="processingContent" prop="processingContent" />
        <el-table-column label="投单性质" align="center" key="orderNature" prop="orderNature" />
        <el-table-column label="投单原因" align="center" key="orderReason" prop="orderReason" />
        <el-table-column label="备注" align="center" key="remark" prop="remark"  />
      </el-table>
      <pagination
        v-show="totalOrder>0"
        :total="totalOrder"
        :page.sync="queryParamsAlready.pageNo"
        :limit.sync="queryParamsAlready.pageSize"
        @pagination="getListDetailAlready"
      />
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="bindPrint" :disabled="multiple">打印</el-button>
        <el-button @click="order.open = false">取 消</el-button>
      </div>
    </el-dialog>
    <div id="printTable" style="display: none">
      <div class="printBox" style="page-break-after:always;" v-for="item in Arr" :key="item.id">
        <table id="stTable" >
          <thead>
          <tr>
            <th colspan="2" style="align-content: center">RiD Tooling Centre 生产标签</th>
          </tr>
          </thead>
          <tbody>
          <tr>
            <td style="font-size: 8px">派工单号：{{ExecutionOrderNo}}</td>
            <td style="font-size: 8px">数量：{{item.quantity}}</td>
          </tr>
          <tr>
            <td style="font-size: 8px">模号：{{item.moduleNo}}</td>
            <td style="font-size: 8px">材质：{{item.material}}</td>
          </tr>
          <tr>
            <td style="font-size: 8px">件号：{{item.pieceNo}}</td>
            <td style="font-size: 8px">大小：{{item.length +'*'+item.width+'*'+item.height}}</td>
          </tr>
          <tr>
            <td style="font-size: 8px">版次：{{item.versionNo}}</td>
            <td style="font-size: 8px">交期：{{DemandDate}}</td>
          </tr>
          <tr>
            <td style="font-size: 8px" >投单人：{{item.investor}}</td>
            <td style="font-size: 8px">打标内容：{{item.marking}}</td>
          </tr>
          <tr>
            <td style="font-size: 8px" colspan="2">工艺制程：{{item.process}}</td>
          </tr>
          </tbody>
          <tfoot>
<!--          <div id="barcodeBox" style="display: none">-->
<!--            {{item.prodOrderNo}}-->
<!--          </div>-->
          </tfoot>
        </table>
        <div style="margin-top: 8px">
          <barcode v-bind:value="item.prodOrderNo" style="margin-left: 30px" font-size="15px" height="16mm" width="1mm" text-align="center">
          </barcode>
        </div>
      </div>
    </div>
    <!-- 导出 -->
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
    <!-- 上传图档对话框 -->
    <el-dialog :title="filesChange.title" :visible.sync="filesChange.open" width="400px" append-to-body>
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
      <div slot="footer" class="dialog-footer">
        <el-button @click="filesChange.open = false" type="danger" style="margin-right: 40%">关 闭</el-button>
      </div>
    </el-dialog>
  </div>

</template>


<script>
  import {
    listBomDetail,
    addBomDetail,
    updateBomDetail,
    getBomDetail,
    turnManyProduction,
    deleteBomDetail,
    importTemplateB,
    getDrawingFile,
    getPublicDrawingFile,
    delDrawingFile,
    exportBomDetail,
    checkDispatchOrderIsOver, isDraw, uploadFormFile, uploadDrawingFile
  } from "../../../../api/order/orderbom"
  import {getToken} from "../../../../utils/auth";
  import {listQuality} from "../../../../api/system/quality";
  import {processCancel} from "../../../../api/order/change";
  import global from '../../../../store/global.js';
  import printJS from "print-js";
  import VueBarcode from 'vue-barcode';
  import { getLodop } from '../../../../utils/lodop/LodopFuncs'
  import { Base64  } from 'js-base64';
  import axios from "axios";
  import {urlDownload} from "../../../../api/tool/gen";
  import { ElMapExportTable } from 'table-excel'
  import { getUserProfile } from '@/api/system/user'
  import downloadGlobal from '@/store/downloadGlobal'
  import { MessageBox } from 'element-ui'


  export default {
    name: "Productorder",
    dicts: ['sys_normal_disable','order_Reason'],
    components: {
      'barcode': VueBarcode
    },
    data() {
      return {
        barcodeValue: '',
        // 导入订单
        fileList: [],
        // 遮罩层
        loading: true,
        // 总条数
        total: 0,
        totalOrder:0,
        totalFile:0,
        totalPublicFile:0,
        // 非多个禁用
        multiple: true,
        // 表格树数据
        detailList: [],
        //材质数据
        orderForquality:[],
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        openExport: false,
        // 显示搜索条件
        showSearch: true,
        // 订单BOM表单参数
        form: {
          weight:null
        },
        //打印表单内容
        formPrint:{},
        //导出表单数据
        formExport:{},
        //选中数组
        customerId:[],
        Id:[],
        code:[],
        //材质信息
        materialCode:'',
        density:'',
        //工件图档表格数据
        filesData:[],
        detailId:'',
        pieceNo:'',
        status:'',
        prodOrderNoDraw:'',
        //公共图档表格数据
        publicFilesData:[],
        //上传图档按钮是否可见
        isDrawing:true,
        //导出列表
        sheduleList:[],
        //工件图档参数
        files:{
          // 是否显示弹出层
          open: false,
          // 弹出层标题
          title: "工件图档",
        },
        //已转生产单表格参数
        order:{
          // 是否显示弹出层
          open: false,
          // 弹出层标题
          title: "工件已转生产单",
        },
        //已转生产单表格数据
        orderData:[],
        //判断派工单是否完结
        checkOver:'',
        //变更图档参数
        filesChange:{
          // 是否显示弹出层
          open: false,
          // 弹出层标题
          title: "工件图档",
        },
        // 查询参数
        queryParams: {
          pageNo: 1,
          pageSize: 10,
        },
        // 查询参数
        queryParamsDraw: {
          pageNo: 1,
          pageSize: 10,
        },
        // 查询参数
        queryParamsAlready: {
          pageNo: 1,
          pageSize: 10,
        },
        //打印参数
        print:{
          // 是否显示弹出层
          open: false,
          // 弹出层标题
          title: "打印标签",
        },
        //打印数据
        Arr:[],
        ExecutionOrderNo:[],
        DemandDate:[],
        prodOrderNo:'',
        investor:'',
        //登录用户信息
        userName:[],
        personNo:[],
        deptName:[],
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
          url: process.env.VUE_APP_BASE_API + "/order/detail/importOrderBomDetail",
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
        },

      };
    },
    created(){
      this.getListDetail();
      this.getListUser()
    },
    mounted() {
      this.customerId = this.$route.query.customerId
      this.ExecutionOrderNo = this.$route.query.executionOrderNo
      this.DemandDate = this.$route.query.demandDate
      this.getListMaterial();
      this.getOrderStatus();
    },

    methods: {
      /** 查询登录用户信息*/
      getListUser() {
        getUserProfile().then(response => {
          this.userName = response.data.nickName
          this.personNo = response.data.userName
          this.deptName = response.data.dept.name
          // console.log(response.data.userName)
        });
      },
      /** 分页查询BOM明细列表 */
      getListDetail() {
        this.loading = true;
        this.queryParams.bomId = this.$route.query.customerId
        listBomDetail(this.queryParams).then(response => {
          this.detailList = response.data.records;
          this.sheduleList = response.data.records;
          this.total = response.data.total;
          this.loading = false;
        });
      },
      /** 分页查询BOM明细已转生产单列表 */
      getListDetailAlready() {
        this.queryParamsAlready.bomId = this.$route.query.customerId
        this.queryParamsAlready.status = '1'
        listBomDetail(this.queryParamsAlready).then(response => {
          this.orderData = response.data.records;
          for (let i = 0;i < this.orderData.length;i++){
            this.orderData[i].process = this.orderData[i].process.replace(/-/g, "-").replace(/\([^\)]*\)/g, "")
          }
          this.totalOrder = response.data.total;
        });
      },
      /** 查询材质配置列表 */
      getListMaterial() {
        this.loading = true;
        listQuality(this.queryParams).then(response => {
          let arr = response.data.records.filter(item => {
            return item.type === '0'
          })
          this.orderForquality = arr
        });
      },
      /** 检查派工单是否已完结 */
      getOrderStatus() {
        const bomId = this.customerId
        checkDispatchOrderIsOver({'bomId':bomId}).then(res =>{
           this.checkOver = res.data
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
      // BOM明细表单重置
      reset() {
        this.form = {
          prodOrderNo: undefined,
          pieceNo: undefined,
          moduleNo: undefined,
        };
        this.resetForm("form");
      },
      // 多选框选中数据
      handleSelectionChange(selection) {
        this.Id = selection.map(item => item.id);
        this.code = selection.map(item => item.moduleNo);
        this.prodOrderNo = selection.map(item => item.prodOrderNo);
        this.multiple = !selection.length;
      },
      // 已转生产单多选框选中数据
      handleSelectionChangeAlready(selection) {
        this.multiple = !selection.length;
        for (let i = 0;i < selection.length;i++){
          selection[i].process = selection[i].process.replace(/-/g, "-").replace(/\([^\)]*\)/g, "")
        }
        this.Arr = selection
        // console.log(this.Arr)
      },
      /** 搜索按钮操作 */
      handleQuery() {
        this.queryParams.pageNo = 1;
        this.getListDetail();
      },
      /** 转生产单按钮 */
      handleTurn(row) {
        const ids = row.id
        turnManyProduction({'ids':[ids],'bizType':'2','dataSource':0}).then(response => {
          
          this.$modal.msgSuccess("转生产单成功");
          this.getListDetail();
        })
      },
      /** 批量转生产单 */
      handleTurnMany() {
        const ids = this.Id
        turnManyProduction({'ids':ids,'bizType':'2','dataSource':0}).then(response => {
          
          if(response == undefined || response.data == undefined){
            
            return;
          }
          
          this.$modal.msgSuccess("批量转生产单成功");
          this.getListDetail();
        })
      },
      /** 新增工件按钮 */
      handleAdd() {
        this.reset();
        this.open = true;
        this.title = "新增工件";
        this.form.moduleNo = this.$route.query.moduleNo
        this.form.orderNature = this.$route.query.orderNature
        this.form.orderReason = this.$route.query.orderReason
        this.form.processingContent = this.$route.query.processingContent
      },
      /** 编辑BOM明细按钮 */
      handleUpdate(row) {
        this.reset();
        const id = row.id
        getBomDetail({'detailId':id}).then(response => {
          this.form = response.data;
          this.open = true;
          this.title = "编辑工件";
        });
      },
      /** 删除BOM明细按钮 */
      handleDelete() {
        const Id = this.Id;
        const moduleNo = this.code;
        this.$modal.confirm('是否确认删除模号为"' + moduleNo + '"的数据项？').then(function() {
          return deleteBomDetail({'ids':Id,'type':1});
        }).then(() => {
          this.getListDetail();
          this.$modal.msgSuccess("删除成功");
        }).catch(() => {});
      },
      /** 设置工艺 */
      setupProcess(row) {
        this.$router.push({
          path:'/order/orderbom-edit/productorder/process',
          query:{
            orderNo: row.prodOrderNo,
            DetailId: row.id,
            moduleNo: row.moduleNo,
            pieceNo: row.pieceNo,
            bomId:row.bomId,
            quantity:row.quantity,
            workType: '0'
          },
        });
      },
      //看图Key跳转
      handleJump(row) {
        this.$router.push({
          path:'/order/orderbom-edit/productorder/kkfileKeyProcess',
          query:{
            orderNo: row.prodOrderNo,
            DetailId: row.id,
            status: row.status,
            moduleNo: row.moduleNo,
            pieceNo: row.pieceNo,
            bomId:row.bomId,
            quantity:row.quantity,
            workType: '0'
          },
        });
      },
      /** 暂停按钮 */
      handleStop(row) {

        MessageBox.confirm('您确定订单BOM现在暂停', '系统提示', {
            confirmButtonText: '确定暂停',
            cancelButtonText: '取消',
            type: 'warning'
          }
        ).then(() => {
          const ids = row.id
          processCancel({'ids':[ids],'type':2}).then(response =>{
            this.$modal.msgSuccess("暂停订单成功");
            this.getListDetail();
          })
        }).catch(() => {});
        
      },
      /** 返回按钮 */
      handleReturn() {
        this.$router.push({
          path:'/order/orderbom',
        });
      },
      /** 多选框禁选 */
      selected(row,index){
        if (row.status === '1') {
          return false //不可勾选
        } else {
          return true; //可勾选
        }
      },
      /** 新增工件提交按钮 */
      submitForm: function() {
        this.$refs["form"].validate(valid => {
          if (valid) {
            if (this.form.id != undefined) {
              this.form.bizType = '2'
              updateBomDetail(this.form).then(response => {
                this.$modal.msgSuccess("修改成功");
                this.open = false;
                this.getListDetail();
              });
            } else {
              this.form.bomId = this.customerId
              this.form.status = '0'
              this.form.bizType = '2'
              addBomDetail(this.form).then(response => {
                this.$modal.msgSuccess("新增成功");
                this.open = false;
                this.getListDetail();
              });
            }
          }
        });
      },
      /** 导入订单BOM按钮操作 */
      handleImport() {
        this.upload.title = "BOM明细导入";
        this.upload.open = true;
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
        this.getListDetail();
      },
      // 提交上传文件
      submitFileForm() {
        this.$refs.upload.submit();
      },
      /** 已转生产单弹窗 */
      handleCheckOrder() {
        this.order.open = true
        this.order.title = "订单BOM已转生产单"
        this.getListDetailAlready()
      },
      /** 打印窗口 */
      handlePrint() {
        this.print.open = true
      },
      /** 打印 */
      bindPrint() {
        let LODOP = getLodop(); //调用getLodop获取LODOP对象
        LODOP.PRINT_INIT('')
        LODOP.ADD_PRINT_HTM(24, 18, '100%', '100%',document.getElementById('printTable').innerHTML)
        // LODOP.ADD_PRINT_BARCODE(150, 55, 160, 24, "128Auto", document.getElementById('barcodeBox').innerHTML);
        // LODOP.PRINT_DESIGN();

        LODOP.PREVIEW(); //预览(预览打印无脚标)
        // LODOP.PRINT();  //打印

      },

      /** 查看客户图档 */
     getFile() {
       this.queryParamsDraw.detailId = this.detailId
       this.queryParamsDraw.prodOrderNo = this.prodOrderNoDraw
       getDrawingFile(this.queryParamsDraw).then(res =>{
         this.filesData = res.data.records
         this.totalFile = res.data.total
       });
     },
      getPublicFile() {
        this.queryParamsDraw.id = this.customerId
        getPublicDrawingFile(this.queryParamsDraw).then(res =>{
          this.publicFilesData = res.data.records
          this.totalPublicFile = res.data.total
        })
      },
     watchFiles(row) {
       this.detailId = row.id
       this.pieceNo = row.pieceNo
       this.status = row.status
       this.prodOrderNoDraw = row.prodOrderNo
       this.files.open = true
       this.checkIsDrawing()
       this.getFile();
       this.getPublicFile();
     },
      /** 下载客户图档 */
      handleDownloadDrawing(row) {
        // let downName = row.name.substring(0,row.name.indexOf('.'))
        // let url = global.hostHead + row.url
        // urlDownload({'fileName':downName,'urlStr':url}).then(res =>{
        //   const blob = new Blob([res]);
        //   const fileName = row.name;
        //   if ("download" in document.createElement("a")) {
        //     // 非IE下载
        //     const elink = document.createElement("a");
        //     elink.download = fileName;
        //     elink.style.display = "none";
        //     elink.href = URL.createObjectURL(blob);
        //     document.body.appendChild(elink);
        //     elink.click();
        //     URL.revokeObjectURL(elink.href); // 释放URL 对象
        //     document.body.removeChild(elink);
        //   } else {
        //     // IE10+下载
        //     navigator.msSaveBlob(blob, fileName);
        //   }
        // })
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
      /** 删除客户图档 */
      handleDeleteDrawing(row) {
        const id = row.id
        const prodOrderNo = row.prodOrderNo
        const dispatchOrderNo = row.dispatchOrderNo
        if(prodOrderNo == undefined) {
          delDrawingFile({'id':id,'orderNo':dispatchOrderNo}).then(res =>{
            this.$modal.msgSuccess("删除公共图档成功");
            this.getFile();
            this.getPublicFile();
          })
        }else {
          delDrawingFile({'id':id,'orderNo':prodOrderNo}).then(res =>{
            this.$modal.msgSuccess("删除工件图档成功");
            this.getFile();
            this.getPublicFile();
          })
        }
      },
      // 提取文件后缀名
      getSuffix(str) {
        const fileExtension = str.substring(str.lastIndexOf(".") + 1);
        return fileExtension;
      },
      /** 查看客户图档 */
      handleSeeDrawing(row,i) {
        console.log(row)
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
          const url = downloadGlobal.hostUpload + row.url
          // const url = global.hostUpload + row.url
          //alert('http://127.0.0.1:8012/onlinePreview?url='+encodeURIComponent(Base64.encode(url)))
          // window.open('http://127.0.0.1:8012/onlinePreview?url='+encodeURIComponent(Base64.encode(url)));
          // window.open('http://127.0.0.1:8012/onlinePreview?url='+encodeURIComponent(Base64.encode(url)));
          window.open(downloadGlobal.hostWatch + '/onlinePreview?url='+encodeURIComponent(Base64.encode(url)));
          // window.open(global.hostWatch + '/onlinePreview?url='+encodeURIComponent(Base64.encode(url)));
        }
      },
      // /** 导出按钮操作 */
      // handleExport() {
      //   this.openExport = true;
      // },
      // submitFormExport() {
      //   this.queryParams.beginTime = this.formExport.beginTime
      //   this.queryParams.endTime = this.formExport.endTime
      //   exportBomDetail(this.queryParams).then(response => {
      //     window.open(global.host+response.msg)
      //   });
      // },
      /** 导出按钮操作 */
      handleExport() {
        this.openExport = true;
        var data = this.sheduleList; // 这里面是数据列表
        const column = [
          { title: "状态 (1已转生产单 0未转生产单)", dataIndex: "status" },
          { title: "零件名称", dataIndex: "pinName" },
          { title: "模号", dataIndex: "moduleNo" },
          { title: "件号", dataIndex: "pieceNo" },
          { title: "版本", dataIndex: "versionNo" },
          { title: "生产单号", dataIndex: "prodOrderNo" },
          { title: "单位", dataIndex: "unit" },
          { title: "数量", dataIndex: "quantity" },
          { title: "材质", dataIndex: "material" },
          { title: "硬度", dataIndex: "hardness" },
          { title: "重量", dataIndex: "weight" },
          { title: "工艺制程", dataIndex: "process" },
          { title: "规格（长）", dataIndex: "length" },
          { title: "规格（宽）", dataIndex: "width" },
          { title: "规格（高）", dataIndex: "height" },
          { title: "发料大小", dataIndex: "issueSize" },
          { title: "发料数量", dataIndex: "issuedQuantity" },
          { title: "厂内料号", dataIndex: "inPlantItemNumber" },
          { title: "品名", dataIndex: "productName" },
          { title: "投单类型", dataIndex: "processingContent" },
          { title: "投单性质", dataIndex: "orderNature" },
          { title: "投单原因", dataIndex: "orderReason" },
          { title: "打标", dataIndex: "marking" },
          { title: "备注", dataIndex: "remark" },
        ];
        const instance = new ElMapExportTable(
          { column, data },
          { progress: progress => this.percentage = progress },// 进度条回调
        );
        instance.download("BOM订单明细").then((data) => {
          this.openExport = false
        }); // 导出的文件名
      },
      /** 表格列样式 */
      cellStyle({row, column, rowIndex, columnIndex}) {
        if (columnIndex === 16 || columnIndex === 17) {
          return "background:#FFC1C1"
        }
      },
      /** 新增工件图档 */
      handleAddDrawing() {
        this.fileStatus = '0'
        this.filesChange.open = true
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
        formData.append('bomId', this.customerId)
        formData.append('detailId', this.detailId)
        formData.append('unlimited', '1')
        formData.append('userName',this.personNo)

        //自定义的接口也可以用ajax或者自己封装的接口
        uploadDrawingFile(formData).then(res => {
          if (res.code === 200) {
            this.$message.success('上传成功');
            this.filesChange.open = false;
            this.getFile();
            this.getPublicFile();
          } else {
            this.$message.error('上传失败');
          }
          //清空fileList
          this.fileList = []
        })
      },
    }
  };

</script>

<style>
  .printBox {
    font-size: 12px;
    transform:scale(0.5);
  }
</style>


