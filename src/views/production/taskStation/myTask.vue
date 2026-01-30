<template>
  <div class="app-container">
    <el-card>
      <el-form :model="queryParams" ref="queryForm" :inline="true">
        <el-form-item label="生产单号" prop="keywords">
          <el-input
            v-model="queryParams.prodOrderNo"
            placeholder="输入生产单号"
            clearable
            size="small"
            style="width: 200px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="RFID" prop="keywords">
          <el-input
            v-model="queryParams.rfid"
            placeholder="输入RFID"
            clearable
            size="small"
            style="width: 200px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="设备：" prop="keywords">
          <el-select v-model="queryParams.equipmentSectionId" filterable multiple placeholder="请选择" clearable @change="handleQuery">
            <el-option
              v-for="item in equipmentFortask"
              :key="item.id"
              :label="item.deviceNo"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="工段：" prop="keywords">
          <el-input
            v-model="queryParams.codeList"
            placeholder="请输入工段名"
            clearable
            size="small"
            style="width: 220px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="加工人员：" prop="keywords">
          <el-input
            v-model="queryParams.op"
            placeholder="请输入加工人员名或工号"
            clearable
            size="small"
            style="width: 220px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="领取人员：" prop="keywords">
          <el-input
            v-model="queryParams.received"
            placeholder="请输入领取人员名或工号"
            clearable
            size="small"
            style="width: 220px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item>
           <el-button style="margin-left: 10px" type="primary" icon="el-icon-search" size="mini" @click="handleQuery"></el-button>
        </el-form-item>
          <el-row>
             <div style="float: left">
                <el-form-item label="报工权限：" >  <!-- allPermissionList -->
                  <el-checkbox-group v-model="allPermissionList">
                    <el-checkbox disabled v-for="(item, index) in permissionOptionsList" :key="item.status + '-' + index" :label="item.status">{{ item.name }}</el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
            </div>
            <div style="float: right">
            <el-form-item label="姓名：">
              <el-tag>{{userName}}</el-tag>
            </el-form-item>
            <el-form-item label="工号：">
              <el-tag>{{personNo}}</el-tag>
            </el-form-item>
            <el-form-item label="部门：">
              <el-tag>{{deptName}}</el-tag>
            </el-form-item>
            </div>
        </el-row>
      </el-form>
    </el-card>
    <el-card>
      <el-button
        size="mini"
        type="primary"
        round
        icon="el-icon-s-promotion"
        @click="handleWaitprocess"
      >待接收工件任务列表</el-button>
      <el-button
        size="mini"
        type="info"
        round
        icon="el-icon-s-promotion"
        @click="handleWaitEquprocess"
      >设备待加工任务列表</el-button>
      <el-button
        size="mini"
        type="success"
        round
        icon="el-icon-s-promotion"
        disabled
      >已领取的加工任务</el-button>
      <el-button
        size="mini"
        type="danger"
        round
        icon="el-icon-s-promotion"
        @click="handleAlreadyFinish"
      >我完成的加工任务</el-button>
    </el-card>
    <el-card>
      <el-table v-loading="loading" :data="taskStationList" @selection-change="handleSelectionChange" max-height="600px"
                border highlight-current-row>
        <el-table-column type="selection" align="center" :selectable="selected"/>
        <el-table-column label="操作" width="320" align="center" class-name="small-padding fixed-width">
          <template slot-scope="scope" v-if="scope.row.frozen === '0'">
            <el-tooltip class="item" effect="dark" content="开工" placement="top-start"   v-if="scope.row.taskStatus === 0 || scope.row.taskStatus === 4">
              <el-button
                type="primary"
                circle
                icon="el-icon-check"
                @click="handleStartwork(scope.row)"
                :disabled="scope.row.orderStatus === '1'"
              ></el-button>
            </el-tooltip>
              <el-tooltip class="item" effect="dark" content="暂停" placement="top-start"  v-if="scope.row.taskStatus !== 2">
                <el-button
                  type="danger"
                  circle
                  icon="el-icon-video-pause"
                  @click="handleStop(scope.row)"
                  :disabled="scope.row.taskStatus === 0 || scope.row.orderStatus === '1' || scope.row.taskStatus === 4"
                ></el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="恢复" placement="top-start" v-if="scope.row.taskStatus === 2">
                <el-button
                  type="success"
                  circle
                  icon="el-icon-refresh-left"
                  @click="handleRecover(scope.row)"
                ></el-button>
              </el-tooltip>
            <el-tooltip class="item" effect="dark" content="完工" placement="top-start">
              <el-button
                type="success"
                circle
                icon="el-icon-phone-outline"
                @click="handleReport(scope.row)"
                :disabled="scope.row.taskStatus === 2 || scope.row.taskStatus === 0 || scope.row.orderStatus === '1' || scope.row.taskStatus === 4"
              ></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="电极图档" placement="top-start" v-if="scope.row.datasource === '1'">
              <el-button
                type="warning"
                circle
                icon="el-icon-s-order"
                @click="handleOpenSheetDraw(scope.row)"
              ></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="程式单" placement="top-start">
              <el-button
                type="warning"
                circle
                icon="el-icon-share"
                @click="handleOpenProgram(scope.row)"
              ></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="放电参数" placement="top-start" v-if="scope.row.datasource === '1'">
              <el-button
                type="warning"
                circle
                icon="el-icon-paperclip"
                @click="handleOpenDischarge(scope.row)"
              ></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="钢件图档" placement="top-start"  v-if="scope.row.datasource === '0'">
              <el-button
                type="info"
                circle
                icon="el-icon-s-order"
                @click="handleOpenSheetDraw(scope.row)"
              ></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="查看客户图档" placement="top-start">
              <el-button
                circle
                type="info"
                icon="el-icon-folder-opened"
                @click="watchFiles(scope.row)"
                style="margin-left: 5px"
              ></el-button></el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="任务类型" align="center" prop="datasource">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.datasource == 0" type="success">钢件</el-tag>
            <el-tag v-if="scope.row.datasource == 1" type="danger">电极</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="生产单号" align="center" prop="prodOrderNo" width="150px"/>
        <el-table-column label="编码" align="center" prop="turnoverBasketNo" width="120px"/>
        <el-table-column label="已收数量" align="center" prop="receivedQuantity"/>
        <el-table-column label="产出数量" align="center" prop="outputQuantity"/>
        <el-table-column label="未出货数量" align="center" prop="completed"/>
        <el-table-column label="工序名称" align="center" prop="code"/>
        <el-table-column label="计划工时" align="center" prop="workHour" />
        <el-table-column label="计划开工时间" align="center" prop="plannedCommencementTime" :show-overflow-tooltip="true"/>
        <el-table-column label="计划完工时间" align="center" prop="plannedCompletionTime" :show-overflow-tooltip="true"/>
        <el-table-column label="模号" align="center" prop="moduleNo" :show-overflow-tooltip="true"/>
        <el-table-column label="件号" align="center" prop="pieceNo"/>
        <el-table-column label="版本" align="center" prop="versionNo"/>
        <el-table-column label="品名" align="center" prop="pinName" />
        <el-table-column label="订单数量" align="center" prop="quantity"/>
        <el-table-column label="加工人员" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.opBy}}-{{scope.row.opName}}</span>
          </template>
        </el-table-column>
        <el-table-column label="领取人员" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.receivedBy}}-{{scope.row.receivedName}}</span>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-card v-loading="loading">
      <div align="center">
        <el-button type="primary" icon="el-icon-check" size="small" :disabled="multiple || frozen == 1 " @click="handleBatchStart" >批量开工</el-button>
        <el-button type="primary" icon="el-icon-odometer" size="small" :disabled="multiple || frozen == 1 " @click="handleAbnormal">异常工件</el-button>
        <el-button type="danger" icon="el-icon-bottom" size="small" :disabled="single || frozen == 1 " @click="handleReportFinish">报工下机</el-button>
        <el-button type="warning" icon="el-icon-top" size="small" :disabled="single || frozen == 1 " @click="handleShipment">出货</el-button>
        <el-button type="success" icon="el-icon-thumb" size="small" :disabled="single || frozen == 1 " @click="eleApplication">申请电极</el-button>
        <el-button type="primary" icon="el-icon-printer" size="small" :disabled="single || frozen == 1 " @click="handlePrint">打印</el-button>
      </div>
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="queryParams.pageNo"
        :limit.sync="queryParams.pageSize"
        :page-sizes="pageSize"
        @pagination="getListTask"
      />
    </el-card>

    <!--报工方式对话框-->
    <el-dialog v-loading="loading" :title="titleReportWay" :visible.sync="openReportWay" width="400px" append-to-body>
      <div align="center" style="margin-top: 30px">
<!--        <el-row>-->
<!--          <el-button type="primary" icon="el-icon-check" @click="amountReport" >按工件数量报工</el-button>-->
<!--        </el-row>-->
        <el-row style="margin-top: 40px">
          <el-button type="primary" icon="el-icon-check" @click="percentageReport" >按工件百分比报工</el-button>
        </el-row>
      </div>
    </el-dialog>
    <!--按工件数量报工对话框-->
    <el-dialog :title="titleReport" :visible.sync="openReport" width="950px" append-to-body>
      <el-form ref="formReport" :model="formReport" :rules="rules" label-width="180px">
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="生产单号" prop="prodOrderNo">
              <el-input v-model="formReport.prodOrderNo"></el-input>
            </el-form-item>
            <el-form-item label="订单数量" prop="quantity">
              <el-input v-model="formReport.quantity"></el-input>
            </el-form-item>
            <el-form-item label="当前工位接收数量" prop="receivedQuantity">
              <el-input v-model="formReport.receivedQuantity"></el-input>
            </el-form-item>
            <el-form-item label="模号" prop="moduleNo">
              <el-input v-model="formReport.moduleNo"></el-input>
            </el-form-item>
            <el-form-item label="件号" prop="pieceNo">
              <el-input v-model="formReport.pieceNo"></el-input>
            </el-form-item>
            <el-form-item label="版次" prop="versionNo">
              <el-input v-model="formReport.versionNo"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="未出货数量" prop="completed">
              <el-input v-model="formReport.completed" disabled></el-input>
            </el-form-item>
            <el-form-item label="已出货数量" prop="outputQuantity">
              <el-input v-model="formReport.outputQuantity" disabled></el-input>
            </el-form-item>
            <el-form-item label="输入本次完成数量" prop="completedThis">
              <el-input v-model="formReport.completedThis" oninput ="value=value.replace(/[^\d]/g, '')" @input="calculation"></el-input>
            </el-form-item>
            <el-form-item label="系统工时" prop="systemHour">
              <el-input v-model="formReport.systemHour" disabled></el-input>
            </el-form-item>
            <el-form-item label="比例分配业务工时" prop="proRataBusinessHours">
              <el-input v-model="formReport.proRataBusinessHours" disabled></el-input>
            </el-form-item>
            <el-form-item label="当前操作员">
              <el-tag>{{userName}}</el-tag>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" icon="el-icon-check" @click="finishWorking" :disabled="disabled">完 工</el-button>
        <el-button @click="openReport = false" type="danger">取 消</el-button>
      </div>
    </el-dialog>
    <!--按工件百分比报工对话框-->
    <el-dialog v-loading="loading" :title="titleReportWork" @close="onDialogClose" :visible.sync="openReportWork" width="950px" append-to-body >
      <el-form ref="formReportWork" :model="formReportWork" :rules="rules" label-width="180px">
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="生产单号" prop="prodOrderNo">
              <el-input v-model="formReportWork.prodOrderNo"></el-input>
            </el-form-item>
            <el-form-item label="订单数量" prop="quantity">
              <el-input v-model="formReportWork.quantity"></el-input>
            </el-form-item>
            <el-form-item label="当前工位接收数量" prop="receivedQuantity">
              <el-input v-model="formReportWork.receivedQuantity"></el-input>
            </el-form-item>
            <el-form-item label="模号" prop="moduleNo">
              <el-input v-model="formReportWork.moduleNo"></el-input>
            </el-form-item>
            <el-form-item label="件号" prop="pieceNo">
              <el-input v-model="formReportWork.pieceNo"></el-input>
            </el-form-item>
            <el-form-item label="版次" prop="versionNo">
              <el-input v-model="formReportWork.versionNo"></el-input>
            </el-form-item>
            <!-- <el-form-item label="RFID" prop="rfid" v-if="disabledOneClick">
              <el-input v-model="formReportWork.rfid" ></el-input>
            </el-form-item>
            <el-form-item label="周转筐编号" prop="turnoverBasketNo"  v-if="disabledOneClick">
              <el-input v-model="formReportWork.turnoverBasketNo" ></el-input>
            </el-form-item> -->

          </el-col>
          <el-col :span="12">
            <el-form-item label="工件已经完成的总百分比" prop="completed">
              <el-input v-model="formReportWork.totalPercentage" oninput ="value=value.replace(/[^0-9.]/g,'')" disabled></el-input>
            </el-form-item>
            <el-form-item label="输入本次加工完成工件的百分比" prop="completedThis">
              <el-input v-model="formReportWork.percentageThis" oninput ="value = value.replace(/[^\d]/g,'')" @input="calculationPercentage">
                <i slot="suffix">%</i>
              </el-input>
            </el-form-item>
            <el-form-item label="未出货数量" prop="completed">
              <el-input v-model="formReportWork.completed" disabled></el-input>
            </el-form-item>
            <el-form-item label="已出货数量" prop="outputQuantity">
              <el-input v-model="formReportWork.outputQuantity" disabled></el-input>
            </el-form-item>
            <el-form-item label="输入本次完成数量" prop="completedThis">
              <el-input v-model="formReportWork.completedThis" oninput ="value=value.replace(/^(\-)*(\d+)\.(\d).*$/, '$1$2.$3')"
                        placeholder="百分比报工数量可以输入小数如：0.5" disabled></el-input>
            </el-form-item>
            <el-form-item label="系统工时" prop="systemHour">
              <el-input v-model="formReportWork.systemHour" disabled></el-input>
            </el-form-item>
            <el-form-item label="比例分配业务工时" prop="proRataBusinessHours">
              <el-input v-model="formReportWork.proRataBusinessHours" oninput ="value=value.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3')" disabled></el-input>
            </el-form-item>
            <el-form-item label="当前操作员">
              <el-tag>{{userName}}</el-tag>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" icon="el-icon-check" @click="finishWorkingPre" :disabled="disabled">完工</el-button>
        <el-button @click="openReportWork = false" type="danger">取 消</el-button>
      </div>
    </el-dialog>
    <!--按数量报工选择出货对话框-->
    <el-dialog :title="titleOutput" :visible.sync="openOutput" width="400px" append-to-body>
      <div align="center" style="margin-top: 30px">
        <el-row>
          <el-button type="primary" icon="el-icon-check" @click="stayStation" >留在工位</el-button>
        </el-row>
        <el-row style="margin-top: 40px">
          <el-button type="primary" icon="el-icon-check" @click="shipmentNextStation">出货到下一工位</el-button>
        </el-row>
      </div>
    </el-dialog>
    <!--按百分比报工选择出货对话框-->
    <el-dialog v-loading="loading" :title="titleOutputPre" :visible.sync="openOutputPre" width="400px" append-to-body>
      <div align="center" style="margin-top: 30px">
        <el-row>
          <el-button type="primary" icon="el-icon-check" @click="stayStationPre" >留在工位</el-button>
        </el-row>
        <el-row style="margin-top: 40px">
          <el-button type="primary" icon="el-icon-check" @click="shipmentNextStationPre" v-show="outPutDes">出货到下一工位</el-button>
        </el-row>
      </div>
    </el-dialog>
    <!--按数量出货对话框-->
    <el-dialog :title="titleShipment" :visible.sync="openShipment" width="800px" append-to-body>
      <el-table :data="ShipmentData" border @header-click="clickFun" :row-class-name="tableRowClassName">
        <el-table-column label="RFID卡号" align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.rfid" placeholder="请输入内容" @change="searchTurnoverBasket(scope.row)"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="周转筐编号" align="center" prop="code"/>
        <el-table-column label="+" align="center">
          <template slot-scope="scope">
            <el-button
              size="small"
              circle
              type="primary"
              icon="el-icon-plus"
              @click="handleAddRfid(scope.row)"
            ></el-button>
            <el-button
              size="small"
              circle
              type="warning"
              icon="el-icon-minus"
              @click="handleDeleteRfid(scope.row,scope.$index)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" icon="el-icon-check" @click="saveShipment" :disabled="disabledShip">保 存</el-button>
        <el-button @click="openShipment = false" type="danger">取 消</el-button>
      </div>
    </el-dialog>
    <!--按百分比出货对话框-->
    <el-dialog :title="titleShipmentPre" :visible.sync="openShipmentPre" width="800px" append-to-body>
      <el-table :data="ShipmentDataPre" border @header-click="clickFunPre" :row-class-name="tableRowClassName">
        <el-table-column label="RFID卡号" align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.rfid" placeholder="请输入内容" @change="searchTurnoverBasketPre(scope.row)"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="周转筐编号" align="center" prop="code"/>
        <el-table-column label="+" align="center">
          <template slot-scope="scope">
            <el-button
              size="small"
              circle
              type="primary"
              icon="el-icon-plus"
              @click="handleAddRfidPre(scope.row)"
            ></el-button>
            <el-button
              size="small"
              circle
              type="warning"
              icon="el-icon-minus"
              @click="handleDeleteRfidPre(scope.row,scope.$index)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
<!--        <el-button @click="handleUpdate" type="danger">刷新</el-button>  @click="oneClickAddRfid"-->
        <el-button type="primary" icon="el-icon-check" @click="saveShipmentPre" :disabled="disabledShip">保 存</el-button>
        <el-button @click="openShipmentPre = false" type="danger">取 消</el-button>
      </div>
    </el-dialog>
    <!--多选框出货对话框-->
    <el-dialog :title="titleShipmentSe" :visible.sync="openShipmentSe" width="800px" append-to-body>
      <el-table :data="ShipmentDataSe" border @header-click="clickFunSe" :row-class-name="tableRowClassName">
        <el-table-column label="RFID卡号" align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.rfid" placeholder="请输入内容" @change="searchTurnoverBasketSe(scope.row)"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="周转筐编号" align="center" prop="code"/>
        <el-table-column label="+" align="center">
          <template slot-scope="scope">
            <el-button
              size="small"
              circle
              type="primary"
              icon="el-icon-plus"
              @click="handleAddRfidSe(scope.row)"
            ></el-button>
            <el-button
              size="small"
              circle
              type="warning"
              icon="el-icon-minus"
              @click="handleDeleteRfidSe(scope.row,scope.$index)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" icon="el-icon-check" @click="saveShipmentSe" :disabled="disabledShip">保 存</el-button>
        <el-button @click="openShipmentSe = false" type="danger">取 消</el-button>
      </div>
    </el-dialog>
    <!--程式单对话框-->
    <el-dialog :title="titleProgram" :visible.sync="openProgram" width="1200px" append-to-body>
      <el-row :gutter="20">
        <el-col :span="10">
          <h2>程式单</h2>
          <el-form ref="formProgram" :model="formProgram" :rules="rules" label-width="180px">
            <el-form-item label="加工数量" prop="qty">
              <el-input v-model="formProgram.qty"></el-input>
            </el-form-item>
            <el-form-item label="装夹方式" prop="fixType">
              <el-input v-model="formProgram.fixType"></el-input>
            </el-form-item>
            <el-form-item label="程序单总时间" prop="totalTime">
              <el-input v-model="formProgram.totalTime"></el-input>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="14">
          <h2>分条程序列表</h2>
          <el-table :data="ProgramData" border>
            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  circle
                  icon="el-icon-edit-outline"
                  @click="handleViewDetail(scope.row)"
                >详细</el-button>
              </template>
            </el-table-column>
            <el-table-column label="程序序号" align="center" prop="programSeq"></el-table-column>
            <el-table-column label="程序名" align="center" prop="programName"></el-table-column>
            <el-table-column label="程序刀具名" align="center" prop="toolName"></el-table-column>
            <el-table-column label="程序刀号" align="center" prop="toolNumber"></el-table-column>
            <el-table-column label="程序刀长" align="center" prop="toolLength"></el-table-column>
          </el-table>
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button @click="openProgram = false" type="danger">取 消</el-button>
      </div>
    </el-dialog>
    <!--钢件分条程式单详细对话框-->
    <el-dialog :title="titleProgramDetail" :visible.sync="openProgramDetail" width="1000px" append-to-body>
      <el-form ref="formProgram" :model="formProgramDetail" :rules="rules" label-width="180px">
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="程序名" prop="programName">
              <el-input v-model="formProgramDetail.programName"></el-input>
            </el-form-item>
            <el-form-item label="程序刀具名" prop="toolName">
              <el-input v-model="formProgramDetail.toolName"></el-input>
            </el-form-item>
            <el-form-item label="程序刀号" prop="toolNumber">
              <el-input v-model="formProgramDetail.toolNumber"></el-input>
            </el-form-item>
            <el-form-item label="程序刀长" prop="toolLength">
              <el-input v-model="formProgramDetail.toolLength"></el-input>
            </el-form-item>
            <el-form-item label="程序避空刀长" prop="shortestToolLength">
              <el-input v-model="formProgramDetail.shortestToolLength"></el-input>
            </el-form-item>
            <el-form-item label="程序最短刀长" prop="calcToolLength">
              <el-input v-model="formProgramDetail.calcToolLength"></el-input>
            </el-form-item>
            <el-form-item label="程序侧余量" prop="partStock">
              <el-input v-model="formProgramDetail.partStock"></el-input>
            </el-form-item>
            <el-form-item label="程序底余量" prop="floorStock">
              <el-input v-model="formProgramDetail.floorStock"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="程序粗精度分类" prop="roughness">
              <el-input v-model="formProgramDetail.roughness"></el-input>
            </el-form-item>
            <el-form-item label="程序主轴转速" prop="spindleSpeed">
              <el-input v-model="formProgramDetail.spindleSpeed"></el-input>
            </el-form-item>
            <el-form-item label="程序切削进给" prop="cutFeedrate">
              <el-input v-model="formProgramDetail.cutFeedrate"></el-input>
            </el-form-item>
            <el-form-item label="程序步距" prop="stepOver">
              <el-input v-model="formProgramDetail.stepOver"></el-input>
            </el-form-item>
            <el-form-item label="程序加工时间" prop="time">
              <el-input v-model="formProgramDetail.time"></el-input>
            </el-form-item>
            <el-form-item label="程序切削刀轨长度" prop="cutPathLength">
              <el-input v-model="formProgramDetail.cutPathLength"></el-input>
            </el-form-item>
            <el-form-item label="程序Z最深" prop="zdepth">
              <el-input v-model="formProgramDetail.zdepth"></el-input>
            </el-form-item>
            <el-form-item label="程序夹持器" prop="holderName">
              <el-input v-model="formProgramDetail.holderName"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="程序备注说明" prop="remark">
          <el-input v-model="formProgramDetail.remark" type="textarea"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="openProgramDetail = false" type="danger">取 消</el-button>
      </div>
    </el-dialog>
    <!--电极分条程式单详细对话框-->
    <el-dialog :title="eleProgramDetail.title" :visible.sync="eleProgramDetail.open" width="1000px" append-to-body>
      <el-form ref="formProgram" :model="eleFormProgramDetail" :rules="rules" label-width="180px">
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="程序名" prop="programName">
              <el-input v-model="eleFormProgramDetail.programName"></el-input>
            </el-form-item>
            <el-form-item label="程序刀具名" prop="toolName">
              <el-input v-model="eleFormProgramDetail.toolName"></el-input>
            </el-form-item>
            <el-form-item label="程序刀号" prop="toolNumber">
              <el-input v-model="eleFormProgramDetail.toolNumber"></el-input>
            </el-form-item>
            <el-form-item label="程序刀长" prop="toolLength">
              <el-input v-model="eleFormProgramDetail.toolLength"></el-input>
            </el-form-item>
            <el-form-item label="程序避空刀长" prop="shortestToolLength">
              <el-input v-model="eleFormProgramDetail.shortestToolLength"></el-input>
            </el-form-item>
            <el-form-item label="程序最短刀长" prop="calcToolLength">
              <el-input v-model="eleFormProgramDetail.calcToolLength"></el-input>
            </el-form-item>
            <el-form-item label="程序侧余量" prop="partStock">
              <el-input v-model="eleFormProgramDetail.partStock"></el-input>
            </el-form-item>
            <el-form-item label="程序底余量" prop="floorStock">
              <el-input v-model="eleFormProgramDetail.floorStock"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="程序粗精度分类" prop="roughness">
              <el-input v-model="eleFormProgramDetail.roughness"></el-input>
            </el-form-item>
            <el-form-item label="程序主轴转速" prop="spindleSpeed">
              <el-input v-model="eleFormProgramDetail.spindleSpeed"></el-input>
            </el-form-item>
            <el-form-item label="程序切削进给" prop="cutFeedrate">
              <el-input v-model="eleFormProgramDetail.cutFeedrate"></el-input>
            </el-form-item>
            <el-form-item label="程序步距" prop="stepOver">
              <el-input v-model="eleFormProgramDetail.stepOver"></el-input>
            </el-form-item>
            <el-form-item label="程序加工时间" prop="time">
              <el-input v-model="eleFormProgramDetail.time"></el-input>
            </el-form-item>
            <el-form-item label="程序切削刀轨长度" prop="cutPathLength">
              <el-input v-model="eleFormProgramDetail.cutPathLength"></el-input>
            </el-form-item>
            <el-form-item label="程序Z最深" prop="zdepth">
              <el-input v-model="eleFormProgramDetail.zdepth"></el-input>
            </el-form-item>
            <el-form-item label="程序夹持器" prop="holderName">
              <el-input v-model="eleFormProgramDetail.holderName"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="程序备注说明" prop="remark">
          <el-input v-model="eleFormProgramDetail.remark" type="textarea"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="eleProgramDetail.open = false" type="danger">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 查看设计文档对话框 -->
    <el-dialog :title="titleDraw" :visible.sync="openDraw" width="800px" append-to-body>
      <el-table :data="steelDrawData" v-loading="loading" border>
        <el-table-column label="文件类型" prop="camFileName" align="center"/>
        <el-table-column label="文件名" prop="fileName" align="center"/>
        <el-table-column label="控制器类型" prop="brand" align="center"/>
        <el-table-column label="上传人姓名" prop="createByName" align="center"/>
        <el-table-column label="工号" prop="createBy" align="center"/>
        <el-table-column label="上传时间" prop="createTime" align="center"/>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              type="warning"
              size="small"
              icon="el-icon-folder-opened"
              @click="handleOpenDraw(scope.row)"
            >查看</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="totalSteelDraw>0"
        :total="totalSteelDraw"
        :page.sync="queryParams.pageNo"
        :limit.sync="queryParams.pageSize"
        @pagination="getListDesignDoc"
      />
    </el-dialog>
    <!--放电参数对话框-->
    <el-dialog :title="titleDischarge" :visible.sync="openDischarge" width="1600px" append-to-body>
      <el-row :gutter="20">
        <el-col :span="11">
          <h2>电火花放电参数</h2>
          <el-form ref="formDischarge" :model="formDischarge" :rules="rules" label-width="120px">
            <el-row>
              <el-col :span="12">
                <el-form-item label="VDI底面纹，第一个程式" prop="vdiFloor">
                  <el-input v-model="formDischarge.vdiFloor"></el-input>
                </el-form-item>
                <el-form-item label="放电间隙（火花位）" prop="sparkGap">
                  <el-input v-model="formDischarge.sparkGap"></el-input>
                </el-form-item>
                <el-form-item label="摇动方式" prop="orbitType">
                  <el-input v-model="formDischarge.orbitType"></el-input>
                </el-form-item>
                <el-form-item label="电极上公差" prop="elecUpTol">
                  <el-input v-model="formDischarge.elecUpTol"></el-input>
                </el-form-item>
                <el-form-item label="加工面积，投影面积" prop="edmFace">
                  <el-input v-model="formDischarge.edmFace"></el-input>
                </el-form-item>
                <el-form-item label="工位精度" prop="edmAreaPrecision">
                  <el-input v-model="formDischarge.edmAreaPrecision"></el-input>
                </el-form-item>
                <el-form-item label="X方向平移次数" prop="xjump">
                  <el-input v-model="formDischarge.xjump"></el-input>
                </el-form-item>
                <el-form-item label="Y方向平移次数" prop="yjump">
                  <el-input v-model="formDischarge.yjump"></el-input>
                </el-form-item>
                <el-form-item label="固定方式" prop="elecFixture">
                  <el-input v-model="formDischarge.elecFixture"></el-input>
                </el-form-item>
                <el-form-item label="放电方式" prop="sparkType">
                  <el-input v-model="formDischarge.sparkType"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="VDI侧面纹，第二个程式" prop="vdiSide">
                  <el-input v-model="formDischarge.vdiSide"></el-input>
                </el-form-item>
                <el-form-item label="实体是否已缩放电间隙（火花位）" prop="bodyScaled">
                  <el-input v-model="formDischarge.bodyScaled"></el-input>
                </el-form-item>
                <el-form-item label="电极作用" prop="elecUse">
                  <el-input v-model="formDischarge.elecUse"></el-input>
                </el-form-item>
                <el-form-item label="电极下公差" prop="elecDownTol">
                  <el-input v-model="formDischarge.elecDownTol"></el-input>
                </el-form-item>
                <el-form-item label="放电模型能量面积" prop="edmArea">
                  <el-input v-model="formDischarge.edmArea"></el-input>
                </el-form-item>
                <el-form-item label="X方向平移距离" prop="xpitch">
                  <el-input v-model="formDischarge.xpitch"></el-input>
                </el-form-item>
                <el-form-item label="Y方向平移距离" prop="ypitch">
                  <el-input v-model="formDischarge.ypitch"></el-input>
                </el-form-item>
                <el-form-item label="电极火花加工粗精分类" prop="electrodeType">
                  <el-input v-model="formDischarge.electrodeType"></el-input>
                </el-form-item>
                <el-form-item label="夹具型号" prop="fixtureNumber">
                  <el-input v-model="formDischarge.fixtureNumber"></el-input>
                </el-form-item>
                <el-form-item label="电极备注" prop="remark">
                  <el-input v-model="formDischarge.remark"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-col>
        <el-col :span="13">
          <h2>电极火花加工位置列表</h2>
          <el-table :data="DischargeData" border>
            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  circle
                  icon="el-icon-edit-outline"
                  @click="handleDischargeDetail(scope.row)"
                >详细</el-button>
              </template>
            </el-table-column>
            <el-table-column label="posX0" align="center" prop="prodOrderNo"></el-table-column>
            <el-table-column label="posY0" align="center" prop="prodOrderNo"></el-table-column>
            <el-table-column label="posZ0" align="center" prop="prodOrderNo"></el-table-column>
            <el-table-column label="posRev0" align="center" prop="prodOrderNo"></el-table-column>
            <el-table-column label="posX" align="center" prop="prodOrderNo"></el-table-column>
            <el-table-column label="posY" align="center" prop="prodOrderNo"></el-table-column>
            <el-table-column label="posZ" align="center" prop="prodOrderNo"></el-table-column>
            <el-table-column label="posRev" align="center" prop="prodOrderNo"></el-table-column>
          </el-table>
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button @click="openDischarge = false" type="danger">取 消</el-button>
      </div>
    </el-dialog>
    <!--电火花加工位置详细对话框-->
    <el-dialog :title="DischargeDetail.title" :visible.sync="DischargeDetail.open" width="600px" append-to-body>
      <el-form ref="formDischargeDetail" :model="formDischargeDetail" :rules="rules" label-width="280px">
        <el-form-item label="第一个位置X起始值PosX0" prop="posX0">
          <el-input v-model="formDischargeDetail.posX0"></el-input>
        </el-form-item>
        <el-form-item label="第一个位置Y起始值PosY0" prop="posY0">
          <el-input v-model="formDischargeDetail.posY0"></el-input>
        </el-form-item>
        <el-form-item label="第一个位置Z起始值PosZ0" prop="posZ0">
          <el-input v-model="formDischargeDetail.posZ0"></el-input>
        </el-form-item>
        <el-form-item label="第一个位置起始选转角度PosRev0" prop="posRev0">
          <el-input v-model="formDischargeDetail.posRev0"></el-input>
        </el-form-item>
        <el-form-item label="第一个位置X终止值PosX" prop="posX">
          <el-input v-model="formDischargeDetail.posX"></el-input>
        </el-form-item>
        <el-form-item label="第一个位置Y终止值PosY" prop="posY">
          <el-input v-model="formDischargeDetail.posY"></el-input>
        </el-form-item>
        <el-form-item label="第一个位置Z终止值PosZ" prop="posZ">
          <el-input v-model="formDischargeDetail.posZ"></el-input>
        </el-form-item>
        <el-form-item label="第一个位置终止选转角度PosRev" prop="posRev">
          <el-input v-model="formDischargeDetail.posRev"></el-input>
        </el-form-item>
        <el-form-item label="第一个位置电极装夹旋转角度PosRot" prop="posRot">
          <el-input v-model="formDischargeDetail.posRot"></el-input>
        </el-form-item>
        <el-form-item label="第一个位置电极放电朝向SparkVect" prop="sparkVect">
          <el-input v-model="formDischargeDetail.sparkVect"></el-input>
        </el-form-item>
        <el-form-item label="第一个位置电极基准Z最高点位置PosTopZ" prop="posTopZ">
          <el-input v-model="formDischargeDetail.posTopZ"></el-input>
        </el-form-item>
        <el-form-item label="第一个位置电极侧放电动量PosSideSpark" prop="posSideSpark">
          <el-input v-model="formDischargeDetail.posSideSpark"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="DischargeDetail.open = false" type="danger">取 消</el-button>
      </div>
    </el-dialog>
    <!--异常工件对话框-->
    <el-dialog :title="titleAbnormal" :visible.sync="openAbnormal" width="600px" append-to-body>
      <el-form ref="formAbnormal" :model="formAbnormal" :rules="rules" label-width="180px">
        <el-form-item label="异常数量" prop="num">
          <el-input v-model="formAbnormal.num"></el-input>
        </el-form-item>
        <el-form-item label="异常原因" prop="sparkGap">
          <el-input v-model="formAbnormal.remark" type="textarea"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFormAbnormal">保 存</el-button>
        <el-button @click="openAbnormal = false" type="danger">取 消</el-button>
      </div>
    </el-dialog>
    <!--客户图档对话框-->
    <el-dialog :title="files.title" :visible.sync="files.open" width="1200px">
      <el-row :gutter="24">
        <el-col :span="12">
          <span>工件图档</span>
          <el-table :data="filesData" border max-height="600px">
            <el-table-column property="name" label="图纸名称" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-tooltip class="item" effect="dark" content="查看客户图档" placement="top-start">
                  <el-button
                    type="primary"
                    circle
                    icon="el-icon-folder-opened"
                    @click="handleOpenDraw(scope.row,1)"
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
                    @click="handleOpenDraw(scope.row,0)"
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
        </el-col>
      </el-row>

    </el-dialog>
    <!-- 查看已转生产单打印对话框-->
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
        <el-table-column label="品名" align="center" key="pinName" prop="pinName" />
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
        <table id="stTable">
          <thead>
          <tr>
            <th colspan="2" style="align-content: center">RiD Tooling Centre</th>
          </tr>
          <tr>
            <th colspan="2" style="align-content: center">模具零件成品标签</th>
          </tr>
          </thead>
          <tbody>
          <tr>
            <td style="font-size: xx-small">客户订单号：{{customerOrderNo}}</td>
            <td style="font-size: xx-small">派工单号：{{executionOrderNo}}</td>
          </tr>
          <tr>
            <td style="font-size: xx-small">模号：{{item.moduleNo}}</td>
            <td style="font-size: xx-small">件号：{{item.pieceNo}}</td>
          </tr>
          <tr>
            <td style="font-size: xx-small">版次：{{item.versionNo}}</td>
            <td style="font-size: xx-small">数量：{{item.quantity}}</td>
          </tr>
          <tr>
            <td style="font-size: xx-small">打标内容：{{item.marking}}</td>
            <td style="font-size: xx-small">生产单号：{{item.prodOrderNo}}</td>
          </tr>
          <tr></tr>
          <tr>
            <td style="font-size: xx-small">客户代码：{{customerCode}}</td>
            <td style="font-size: xx-small">品名：{{item.pinName}}</td>
          </tr>
          <tr>
            <td style="font-size: xx-small">收货人员：{{contactName}}</td>
            <td style="font-size: xx-small">单位：{{customerName}}</td>
          </tr>
          <tr>
            <td style="font-size: xx-small">收货地址：{{receivingAddress}}</td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
    <!--异常工件对话框-->
    <el-dialog :title="application.title" :visible.sync="application.open" width="600px" append-to-body>
      <el-form ref="formApplication" :model="formApplication" :rules="rules" label-width="180px">
        <el-form-item label="申请电极" prop="num">
          <el-select v-model="formApplication.ids" multiple placeholder="请选择">
            <el-option
              v-for="item in eleOptions"
              :key="item.id"
              :label="item.id"
              :value="item.id">
              <span style="float: left">{{ item.eleDispatchNo }} - {{item.eleNo}}</span>
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFormElectrode">保 存</el-button>
        <el-button @click="application.open = false" type="danger">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {
    changeWorkReportingMethod,
    consolidatedShipment,
    dischargeParameters, electrodeMange, getAbnormalWorkpiece,
    getCamElectricSparkList,
    getCamEleProgramSheet, getCamEleProgramSheetList,
    getCamProgramSheet,
    getCamProgramSheetList, getProdWorkOperationHisPage,
    getProdWorkReceivedPage,
    listTaskStation,
    prodWorkOperation,
    recovery, rfidTurnoverBasket, saveElectrodeMange, shipment,gerRfidTurnoverBasket,
    startMachining,
    stopMachining
  } from "../../../api/production/taskStation";
  import {listEquipment} from "../../../api/system/equipment";
  import {getUserProfile} from "../../../api/system/user";
  import {listProcess} from "../../../api/system/process";
  import {listBasketRfid} from "../../../api/system/rfid";
  import {viewDesignDoc} from "../../../api/camdesign/documentation";
  import { Base64  } from 'js-base64';
  import global from "../../../store/global";
  import {
    getDrawingFile,
    getOrderBom,
    getPublicDrawingFile,
    listBomDetail,
    listOrderBom
  } from "../../../api/order/orderbom";
  import { getLodop } from '../../../utils/lodop/LodopFuncs';
  import {listCustomer} from "../../../api/system/customer";
  import {listElectrodeMange} from "../../../api/jy/electrodeMange";
  import * as math from "mathjs";
  import taskStation from '@/views/production/taskStation/index'
  import downloadGlobal from '@/store/downloadGlobal'

  export default {
    name: "viewMyTask",
    filters: {
      keepTwoNum(value) {
        value = Number(value);
        return value.toFixed(2)
      }
    },
    data() {
      return {
        // 遮罩层
        loading: true,
        // 非多个禁用
        multiple: true,
        // 非单个禁用
        single: true,
        //禁用
        disabled:false,
        disabledShip:false,
        disabledOneClick:false,
        //百分比完工周转筐状态
        statusFinish:true,
        // 总条数
        total: 0,
        totalSteelDraw: 0,
        totalOrder:0,
        // 电极加工待排产表格数据
        taskStationList: [],
        //工艺表格数据
        processList:[],
        //设备搜索数据
        equipmentFortask:[],
        //周转筐编码数据
        BasketFortask:[],
        //工段搜索数据
        processFortask:[],
        //报工表单数据
        formData:{},
        formReport:{},
        formReportWork:{},
        formMerge:{},
        formFinish:{},
        formProgramDetail:{},
        eleFormProgramDetail:{},
        formApplication:{
          ids:[]
        },
        //程式单数据
        formProgram:{},
        ProgramData:[],
        programDataSource:'',
        //程式单选中数据
        programOrderNo:'',
        eleProgramDetail:{
          title: '',
          open: false,
        },
        //钢件图档数据
        steelDrawData:[],
        //所有权限
        allPermissionList:[],
        permissionOptionsList:[],
        selectCode:'',
        //钢件图档选中数据
        code:'',
        prodOrderNo:'',
        designSort:'',
        //放电参数数据
        formDischarge:{},
        DischargeData:[],
        titleDischarge:'',
        //报工方式弹窗
        openReportWay:false,
        titleReportWay:'',
        //异常工件弹窗
        openAbnormal:false,
        titleAbnormal:'',
        formAbnormal:{},
        //按数量报工选择出货弹窗
        titleOutput:'',
        openOutput:false,
        //按百分比报工选择出货弹窗
        titleOutputPre:'',
        openOutputPre:false,
        //按数量出货弹窗
        titleShipment:'',
        openShipment:false,
        ShipmentData:[],
        //按百分比出货弹窗
        titleShipmentPre:'',
        openShipmentPre:false,
        ShipmentDataPre:[],
        //多选框出货弹窗
        titleShipmentSe:'',
        openShipmentSe:false,
        ShipmentDataSe:[],
        //暂停弹窗打开
        openReport: false,
        //报工弹窗打开
        openReportWork: false,
        //合并出货弹窗打开
        openMerge: false,
        //报工下机弹窗打开
        openFinish: false,
        //钢件程式单弹窗打开
        openProgram: false,
        openProgramDetail:false,
        //钢件图档弹窗打开
        openDraw:false,
        //放电参数弹窗打开
        openDischarge:false,
        //暂停按钮选中ID
        stopId:null,
        //系统工时
        systemHour:'',
        // 弹出层标题
        titleReport: "",
        titleReportWork: "",
        titleMerge:'',
        titleFinish:'',
        titleProgram:'',
        titleDraw:'',
        titleProgramDetail:'',
        //用户信息
        userName:'',
        personNo:'',
        deptName:'',
        userId:'',
        // 是否显示弹出层
        open: false,
        //选中数组
        ids:[],
        datasource:'',
        actionStatus:'',
        workReportingMethod:'',
        receivedQuantity:'',
        completed:'',
        //按数量报工数据
        workHour:'',
        quantity:'',
        //暂停报工选中数据
        taskId:'',
        operationStatus:'',
        workId:'',
        turnoverBasketNoList:[],
        turnoverBasketNoListPre:[],
        turnoverBasketNoListSe:[],
        rfid:'',
        //操作时间数据
        beginTime:'',
        stopTime:'',
        recoverTime:'',
        //客户图档参数
        files:{
          // 是否显示弹出层
          open: false,
          // 弹出层标题
          title: "工件图档",
        },
        //客户图档选中参数
        detailId:'',
        customerId:'',
        //客户图档数据
        filesData:[],
        publicFilesData:[],
        //成品标签打印
        prodOrderNo:'',
        bomId:'',
        customerOrderNo:'',
        executionOrderNo:'',
        socialUnifiedCreditCode:'',
        customerCode:'',
        customerName:'',
        receivingAddress:'',
        contactName:'',
        moduleNo:'',
        //打印数据
        Arr:[],
        //已转生产单表格参数
        order:{
          // 是否显示弹出层
          open: false,
          // 弹出层标题
          title: "工件已转生产单",
        },
        //已转生产单表格数据
        orderData:[],
        //申请电极参数
        application:{
          // 是否显示弹出层
          open: false,
          // 弹出层标题
          title: "申请电极",
        },
        eleOptions:[],
        //电火花加工详细信息
        DischargeDetail: {
          // 是否显示弹出层
          open: false,
          // 弹出层标题
          title: "",
        },
        //电火花位置详细表单参数
        formDischargeDetail:{},
        //出货方式数据存储
        outPutFrom:{},
        //出货按钮显示隐藏
        outPutDes: false,
        // 查询参数
        queryParams: {
          pageNo: 1,
          pageSize: 10,
        },
        // 工段查询参数
        queryParamsProcess: {
          pageNo: 1,
          pageSize: 100,
        },
        // 查询参数
        queryParamsRfid: {
          pageNo: 1,
          pageSize: 10,
        },
        // 查询参数
        queryParamsRfidPre: {
          pageNo: 1,
          pageSize: 10,
        },
        // 查询参数
        queryParamsRfidSe: {
          pageNo: 1,
          pageSize: 10,
        },
        // 查询参数
        queryParamsAlready: {
          pageNo: 1,
          pageSize: 10,
        },
        // 查询参数
        queryParamsBom: {
          pageNo: 1,
          pageSize: 10,
        },
        // 查询参数
        queryParamsProgram: {
          pageNo: 1,
          pageSize: 10,
        },
        // 查询参数
        queryParamsElectrode: {
          pageNo: 1,
          pageSize: 10,
        },
        //增加单数
        obj:{
          rfid:'',
          code:'',
        },
        rules: {
          name: [
            {required: true, message: "姓名不能为空", trigger: "blur"},
            {min: 2, max: 10, message: '姓名长度必须介于 2 和 10 之间', trigger: 'blur'}
          ],
        },
        //操作QC电极状态
        frozen:'',
        //分页每页显示数据
        pageSize:[10,20,50,100]
      }
    },
    created() {
      this.getListTask();
      this.getListEquipment();
      this.getListUser();
      this.getListBasket();
       // 任务组名字典翻译
      this.getConfigKey("sys.rfid.bind").then(response => {
        console.log(response)
        if(response.msg === '2'){
          this.disabledOneClick = false;
        }
      });
    },
    methods: {
    
      /** 查询报工终端我的任务列表 */
      getListTask() {
        this.loading = true;
        getProdWorkReceivedPage(this.queryParams).then(response => {
          this.taskStationList = response.data.records;
          this.total = response.data.total;
          this.frozen = this.taskStationList.frozen;
          this.pageSize.splice(4,1,this.total)
          this.loading = false;
        })
      },
      /** 查询设备列表 */
      getListEquipment() {
        listEquipment(this.queryParamsProcess).then(response => {
          this.equipmentFortask = response.data.records
        });
      },
      /** 查询登录用户信息*/
      getListUser() {
        getUserProfile().then(response => {
          console.log('response:'+response)
          this.permissionOptionsList = response.list;
          if(this.permissionOptionsList!=null&&this.permissionOptionsList.length>0){
            for(var i=0;i<this.permissionOptionsList.length;i++){
              this.allPermissionList.push(this.permissionOptionsList[i].status);
            }
          }
          this.userName = response.data.nickName
          this.personNo = response.data.userName
          this.deptName = response.data.dept.name
          this.userId = response.data.userId
        });
      },
      /** 查询周转筐列表 */
      getListBasket() {
        listBasketRfid(this.queryParams).then(response => {
          this.BasketFortask = response.data.records
        });
      },
      /** 查询加工图档 */
      getListDesignDoc() {
        this.queryParams.code = this.code
        this.queryParams.prodOrderNo = this.prodOrderNo
        this.queryParams.sort = this.designSort
        viewDesignDoc(this.queryParams).then(response => {
          this.steelDrawData = response.data.records;
          this.totalDesign = Number(response.data.total);
        });
      },
      /** 查询放电参数 */
      getListDischargeParameters() {
        this.queryParams.orderNo = this.prodOrderNo
        dischargeParameters(this.queryParams).then(response => {
           this.formDischarge = response.data
        });
      },
      /** 查询电火花加工位置 */
      getCamElectricSparkList() {
        this.queryParams.orderNo = this.prodOrderNo
        getCamElectricSparkList(this.queryParams).then(response => {
          this.DischargeData = response.data.records
        });
      },
      /** 查询程式单 */
      getCamProgramSheet() {
        if(this.programDataSource === '0'){
          this.queryParamsProgram.orderNo = this.prodOrderNo
          getCamProgramSheet(this.queryParamsProgram).then(res => {
            if(res.data == null) {
              this.formProgram = {}
            }else {
              this.formProgram = res.data
            }
          })
        }else{
          this.queryParamsProgram.orderNo = this.prodOrderNo
          getCamEleProgramSheet(this.queryParamsProgram).then(res => {
            if(res.data == null) {
              this.formProgram = {}
            }else {
              this.formProgram = res.data
            }
          })
        }
      },
      /** 查询分条程序列表 */
      getCamProgramSheetList() {
        if(this.programDataSource === '0'){
          this.queryParamsProgram.orderNo = this.prodOrderNo
          getCamProgramSheetList(this.queryParamsProgram).then(res => {
            this.ProgramData = res.data.records
          })
        }else{
          this.queryParamsProgram.orderNo = this.prodOrderNo
          getCamEleProgramSheetList(this.queryParamsProgram).then(res => {
            this.ProgramData = res.data.records
          })
        }
      },
      /** 查询分条程序详细列表 */
      getCamProgramDetailList() {
        if(this.programDataSource === '0'){
          const OrderNo = this.programOrderNo
          getCamProgramSheetList({'orderNo': OrderNo,'pageNo':1,'pageSize':10}).then(response => {
            this.formProgramDetail = response.data.records[0]
          });
        }else {
          const OrderNo = this.programOrderNo
          getCamEleProgramSheetList({'orderNo': OrderNo,'pageNo':1,'pageSize':10}).then(response => {
            this.eleFormProgramDetail = response.data.records[0]
          });
        }
      },
      /** 查看客户图档 */
      getFile() {
        this.queryParams.detailId = this.detailId
        getDrawingFile(this.queryParams).then(res =>{
          this.filesData = res.data.records
        });
      },
      getPublicFile() {
        this.queryParams.id = this.customerId
        getPublicDrawingFile(this.queryParams).then(res =>{
          this.publicFilesData = res.data.records
        })
      },
      /** 分页查询BOM明细已转生产单列表 */
      getListDetailAlready() {
        this.queryParamsBom.bomId = this.bomId
        this.queryParamsBom.status = '1'
        this.queryParamsBom.prodOrderNo = this.prodOrderNo.join('')
        listBomDetail(this.queryParamsBom).then(response => {
          this.orderData = response.data.records;
          this.totalOrder = response.data.total;
        });
      },
      /** 分页查询订单BOM列表 */
      getListOrder() {
        this.queryParamsBom.id = this.bomId
        getOrderBom(this.queryParamsBom).then(response => {
          this.customerOrderNo = response.data.customerOrderNo
          this.executionOrderNo = response.data.executionOrderNo
          this.customerCode = response.data.customerCode
          this.customerName = response.data.customerName
          this.receivingAddress = response.data.receivingAddress
          this.contactName = response.data.contactName
        });
      },
      /** 分页查询电极在库列表 */
      getListElectrode() {
        this.queryParamsElectrode.status = '0'
        listElectrodeMange(this.queryParamsElectrode).then(response => {
          this.eleOptions = response.rows
        });
      },
      /** 搜索按钮操作 */
      handleQuery() {
        this.queryParams.pageNo= 1;
        this.getListTask();
      },
      // 表单重置
      reset() {
        this.formReport = {
          proRataBusinessHours: undefined,
          completed: undefined,
          completedThis: undefined,
        };
        this.resetForm("formReport");
      },
      // 多选框选中数据
      handleSelectionChange(selection) {
        this.ids = selection.map(item => item.id)
        this.formData = selection
        this.workHour = selection.map(item => item.workHour)
        this.workId = selection.map(item => item.id).join('')
        this.taskId = selection.map(item => item.taskId).join('')
        this.workReportingMethod = selection.map(item => item.workReportingMethod).join('')
        this.completed = selection.map(item => item.completed).join('')
        this.multiple = !selection.length
        this.single = selection.length!=1
        var disCode= selection.map(item => item.code) ;
        if (Array.isArray(disCode)) {
            this.selectCode = disCode.length > 0 ? disCode[0] : '';
        } else {
            this.selectCode = disCode;
        }
        let newList = {
          prodOrderNo:selection.map(item => item.prodOrderNo).join(''),
          quantity:selection.map(item => item.quantity).join(''),
          receivedQuantity:selection.map(item => item.receivedQuantity).join(''),
          moduleNo:selection.map(item => item.moduleNo).join(''),
          pieceNo:selection.map(item => item.pieceNo).join(''),
          versionNo:selection.map(item => item.versionNo).join(''),
        }
        this.formData = newList
        this.prodOrderNo = selection.map(item => item.prodOrderNo)
        this.bomId = selection.map(item => item.bomId).join('')
        this.moduleNo = selection.map(item => item.moduleNo).join('')
        this.frozen = selection.map(item => item.frozen)
      },
      // 已转生产单多选框选中数据
      handleSelectionChangeAlready(selection) {
        this.multiple = !selection.length;
        this.Arr =selection
      },
      /**开工按钮*/
      handleStartwork(row) {
        this.loading = true;
        const ids = row.id
        var code = row.code;
        startMachining({'ids':[ids],'code':code}).then(response =>{
          if(response!=undefined){
            this.$modal.msgSuccess("开工成功");
          }
          
          this.loading = false;
          this.getListTask();
        })
        setTimeout(()=>{
          this.loading=false   //点击一次时隔五秒后才能再次点击
        },3000)
      },
      /**批量开工按钮*/
      handleBatchStart() {
        this.loading = true
        const ids = this.ids
        startMachining({'ids':ids,'code':this.selectCode}).then(response =>{
          if(response!=undefined){
             this.$modal.msgSuccess("批量开工成功");
          }
         
          this.getListTask();
          this.loading = false;
        })
      },
      /**暂停按钮*/
      handleStop(row) {
        this.formData = row
        this.workHour = row.workHour
        this.workId = row.id
        this.taskId = row.taskId
        this.datasource = '0'
        this.actionStatus = '0'
        this.selectCode = row.code;
        this.percentageReport()
      },
      /**恢复按钮*/
      handleRecover(row) {
        this.queryParams.workId = row.id
        var obj = {} ;
        obj.code = row.code ;
        obj.workId = this.queryParams.workId;
        recovery(obj).then(res =>{
          if(res!=undefined){
            this.$modal.msgSuccess("恢复成功");
          }
          this.getListTask();
        })
      },
      /** 按工件数量报工 */
      amountReport() {
        this.titleReport = "按工件数量报工"
        this.openReport = true
        let newList = {
          prodOrderNo: this.formData.prodOrderNo,
          quantity:this.formData.quantity,
          receivedQuantity:this.formData.receivedQuantity,
          moduleNo:this.formData.moduleNo,
          pieceNo:this.formData.pieceNo,
          versionNo:this.formData.versionNo,
          workHour:this.workHour,
          code:this.formData.code,
          processSequence:this.formData.processSequence,
          datasourceType:this.formData.datasource
        }
        this.queryParams.workId = this.workId
        this.queryParams.mode = '0'
        this.queryParams.taskId = this.taskId
        changeWorkReportingMethod(this.queryParams).then(response => {
          if(response!=undefined){
            if(response.data.id == null){
              this.formReport = newList
              if(this.formReport.completedThis == null){
                this.disabled = true
              }
            }else {
              this.formReport = response.data
              this.formReport.workHour = this.workHour
              if(this.formReport.outputQuantity === null){
                this.formReport.outputQuantity = 0
              }
              if(this.formReport.completedThis === 0){
                this.disabled = true
              }
            }

          }
          this.loading = false;
          
        });

      },
      /** 按工件百分比报工 */
      percentageReport() {
        console.log('33')
        this.loading = true
        this.titleReportWork = "按工件百分比报工"
        this.openReportWork = true
        const processStr = this.formData.process || ''
        const arr = processStr ? processStr.split('-') : []
        const a = arr.map(item => {
           const idx = item.indexOf('(')
          return idx === -1 ? item : item.substring(0, idx)
        })
        const b = a.lastIndexOf('QC')
        let newList = {
          prodOrderNo: this.formData.prodOrderNo,
          quantity:this.formData.quantity,
          receivedQuantity:this.formData.receivedQuantity,
          moduleNo:this.formData.moduleNo,
          pieceNo:this.formData.pieceNo,
          versionNo:this.formData.versionNo,
          workHour:this.workHour,
          totalPercentage:0,
          code:this.formData.code,
          processSequence:this.formData.processSequence,
          datasourceType:this.formData.datasource,
          process:b,
          sort:this.formData.sort,
          outputQuantity: 0,
        }
        this.queryParams.workId = this.workId
        this.queryParams.mode = '1'
        this.queryParams.taskId = this.taskId
        this.queryParams.code = this.selectCode;
        changeWorkReportingMethod(this.queryParams).then(response => {
          if(response!=undefined){
             if(response.data.id == null){
                this.formReportWork = newList
                this.formReportWork.rfid = response.data.rfid
                this.formReportWork.turnoverBasketNo = response.data.turnoverBasketNo
                if(this.formReportWork.percentageThis == null){
                  this.disabled = true
                }
              }else {
                this.formReportWork = response.data
                this.formReportWork.workHour = this.workHour
                if(this.formReportWork.outputQuantity === null){
                  this.formReportWork.outputQuantity = 0
                }
                if(this.formReportWork.percentageThis == ''){
                  this.disabled = true
                }
              }
              if(this.formReportWork.totalPercentage===100){
                  this.disabled = false;
              }
          }
          this.loading = false;
        });

        this.selectCode = null;
      },
      /** 数量报工本次完成数量改变事件 */
      calculation(){
        if(this.formReport.outputQuantity == null || this.formReport.completed == null){
          if(parseFloat(this.formReport.completedThis) > parseFloat(this.formReport.receivedQuantity)){
            this.$modal.msgError("本次完成数量输入错误")
            this.disabled = true
          }else {
            this.disabled = false
            if ( isNaN(this.formReport.proRataBusinessHours = this.formReport.workHour*(this.formReport.completedThis / this.formReport.quantity))) {
              this.formReport.proRataBusinessHours = '0'
            }else {
              this.formReport.proRataBusinessHours = this.formReport.workHour*(this.formReport.completedThis / this.formReport.quantity)
            }
          }
        }else {
          if(parseFloat(this.formReport.completedThis) > parseFloat(this.formReport.receivedQuantity) || parseFloat(this.formReport.completedThis) + parseFloat(this.formReport.completed) > parseFloat(this.formReport.receivedQuantity) || parseFloat(this.formReport.completedThis) + parseFloat(this.formReport.outputQuantity) + parseFloat(this.formReport.completed) > parseFloat(this.formReport.quantity)){
            this.$modal.msgError("本次完成数量输入错误")
            this.disabled = true
          }else {
            this.disabled = false
            if ( isNaN(this.formReport.proRataBusinessHours = this.formReport.workHour*(this.formReport.completedThis / this.formReport.quantity))) {
              this.formReport.proRataBusinessHours = '0'
            }else {
              this.formReport.proRataBusinessHours = this.formReport.workHour*(this.formReport.completedThis / this.formReport.quantity)
            }
          }
        }
        if(this.formReport.completedThis == '' || this.formReport.completedThis ==='0'){
          this.disabled = true
        }
      },
      /** 百分比报工完成百分比改变事件 */
      calculationPercentage(){
        
        if ( isNaN(this.formReportWork.proRataBusinessHours = this.formReportWork.workHour*(this.formReportWork.percentageThis/100))) {
          this.formReportWork.proRataBusinessHours = '0'
        }else {
          const conResult = Number((this.formReportWork.percentageThis * 0.01) * this.formReportWork.receivedQuantity)
          this.formReportWork.completedThis = math.round(conResult,3)
          const contResult = Number(this.formReportWork.workHour*(this.formReportWork.completedThis/this.formReportWork.quantity))
          this.formReportWork.proRataBusinessHours = math.round(contResult,3)
        }
        const num = math.round(((this.formReportWork.completedThis / this.formReportWork.quantity) * 100),2)
        // const num = parseFloat(((this.formReportWork.completedThis / this.formReportWork.quantity) * 100).toPrecision(12))
        const b = math.round((((this.formReportWork.thisOutput + this.formReportWork.completedThis) / this.formReportWork.quantity) * 100),2)
        // const b = parseFloat((((this.formReportWork.thisOutput + this.formReportWork.completedThis) / this.formReportWork.quantity) * 100).toPrecision(12))
        const c = math.round(((this.formReportWork.receivedQuantity / this.formReportWork.quantity)*100),2)
        // const c = parseFloat(((this.formReportWork.receivedQuantity / this.formReportWork.quantity)*100).toPrecision(12))
        if(parseFloat(this.formReportWork.totalPercentage) + num > 100.1 || parseFloat(this.formReportWork.completedThis) + parseFloat(this.formReportWork.completed) + parseFloat(this.formReportWork.outputQuantity) > parseFloat(this.formReportWork.totalReceivedQuantity) || parseFloat(this.formReportWork.totalPercentage) > 100 || parseFloat(this.formReportWork.percentageThis) > 100
        || b>c){
          this.$modal.msgError("本次加工完成百分比输入错误")
          this.disabled = true
        }else{
          this.disabled = false
        }
        if(this.formReportWork.percentageThis == '' || this.formReportWork.percentageThis ==='0'){
          this.disabled = true
        }
        this.handleRfidBind();
      },
      /** 按数量报工留在工位 */
      stayStation() {
        this.formReport.datasource = this.datasource
        this.formReport.mode = '0'
        this.formReport.type = '0'
        this.formReport.currentOperator = this.userName
        this.formReport.workId = this.workId
        if(this.actionStatus == '0'){
          prodWorkOperation(this.formReport).then(response =>{
            this.$modal.msgSuccess("完工成功");
            this.openReport = false
            this.openOutput = false
            this.openReportWay = false
            this.getListTask()
          })
        }else {
          prodWorkOperation(this.formReport).then(response =>{
            this.$modal.msgSuccess("完工成功");
            this.openReport = false
            this.openOutput = false
            this.openReportWay = false
            this.logout()
          })
        }
      },
      /** 按百分比报工留在工位 */
      stayStationPre() {
        this.loading = true
        this.formReportWork.datasource = this.datasource
        this.formReportWork.mode = '1'
        this.formReportWork.type = '0'
        this.formReportWork.currentOperator = this.userName
        this.formReportWork.workId = this.workId
        this.formReportWork.percentageThis = ((this.formReportWork.completedThis / this.formReportWork.quantity) * 100).toString()
        // if((parseFloat(this.formReportWork.totalPercentage) + parseFloat(this.formReportWork.percentageThis)) >= 99){
        //   this.formReportWork.percentageThis = (100 - this.formReportWork.totalPercentage).toString()
        // }
        console.log(this.formReportWork)
        if(this.actionStatus == '0'){
          prodWorkOperation(this.formReportWork).then(response =>{
            this.$modal.msgSuccess("完工成功");
            this.openReportWork = false
            this.openOutputPre = false
            this.openReportWay = false
            this.getListTask()
            this.loading = false
          })
        }else {
          prodWorkOperation(this.formReportWork).then(response =>{
            this.$modal.msgSuccess("完工成功");
            this.openReportWork = false
            this.openOutputPre = false
            this.openReportWay = false
            this.logout()
            this.loading = false
          })
        }

      },
      /** 按数量出货到下一工位 */
      shipmentNextStation() {
        this.openShipment = true
      },
      /** 按百分比出货到下一工位 */
      shipmentNextStationPre() {
        this.openShipmentPre = true
      },
       
      /** 按数量报工出货保存按钮 */
      saveShipment() {
        this.formReport.datasource = this.datasource
        this.formReport.mode = '0'
        this.formReport.type = '1'
        this.formReport.currentOperator = this.userName
        this.formReport.workId = this.workId
        this.formReport.turnoverBasketNoList = this.turnoverBasketNoList
        if(this.turnoverBasketNoList == ''){
          this.$modal.msgError("还未绑定周转筐编码")
          this.disabledShip = true
        }else {
          this.disabledShip = false
          if(this.actionStatus == '0'){
            prodWorkOperation(this.formReport).then(response =>{
              this.taskStationList = [response.data]
              this.$modal.msgSuccess("出货成功");
              this.openReport = false
              this.openShipment = false
              this.openReportWay = false
              this.openOutput = false
              this.getListTask()
            })
          }else {
            prodWorkOperation(this.formReport).then(response =>{
              this.taskStationList = [response.data]
              this.$modal.msgSuccess("出货成功");
              this.openReport = false
              this.openShipment = false
              this.openReportWay = false
              this.logout()
            })
          }
        }
      },
      /** 多选框出货 */
      handleShipment(){
        if(this.completed < 1){
          this.titleShipmentSe = ""
          this.openShipmentSe = false
          this.$modal.msgError("未出货数量小于1的不允许出货")
        }else {
          this.titleShipmentSe = ""
          this.openShipmentSe = true
        }
      },
      /** 多选框出货保存按钮 */
      saveShipmentSe() {
        if(this.workReportingMethod == '0'){
          this.queryParamsRfidSe.mode = '0'
          this.queryParamsRfidSe.workId = this.workId
          this.queryParamsRfidSe.turnoverBasketNoList = this.turnoverBasketNoListSe
          if(this.queryParamsRfidSe.turnoverBasketNoList === ''){
            this.$modal.msgError("还未绑定周转筐编码")
            this.disabledShip = true
          }else {
            this.disabledShip = false
            shipment(this.queryParamsRfidSe).then(res =>{
              this.$modal.msgSuccess("出货成功");
              this.openShipmentSe = false
              this.getListTask()
            })
          }
        }else {
          this.queryParamsRfidSe.mode = '1'
          this.queryParamsRfidSe.workId = this.workId
          this.queryParamsRfidSe.turnoverBasketNoList = this.turnoverBasketNoListSe
          if(this.queryParamsRfidSe.turnoverBasketNoList === ''){
            this.$modal.msgError("还未绑定周转筐编码")
            this.disabledShip = true
          }else {
            this.disabledShip = false
            shipment(this.queryParamsRfidSe).then(res =>{
              this.$modal.msgSuccess("出货成功");
              this.openShipmentSe = false
              this.getListTask()
            })
          }
        }
      },
      /** 按百分比报工出货保存按钮 */
      saveShipmentPre() {
        this.formReportWork.datasource = this.datasource
        this.formReportWork.mode = '1'
        this.formReportWork.type = '1'
        this.formReportWork.currentOperator = this.userName
        this.formReportWork.workId = this.workId
        this.formReportWork.turnoverBasketNoList = this.turnoverBasketNoListPre
        this.formReportWork.percentageThis = ((this.formReportWork.completedThis / this.formReportWork.quantity) * 100).toString()
        
          if(this.statusFinish){
            this.disabledShip = false
            if(this.actionStatus == '0'){
              prodWorkOperation(this.formReportWork).then(response =>{
                this.taskStationList = [response.data]
                this.$modal.msgSuccess("出货成功");
                this.openReportWork = false
                this.openShipmentPre = false
                this.openReportWay = false
                this.openOutputPre = false
                this.getListTask()
              })
            }else {
              prodWorkOperation(this.formReportWork).then(response =>{
                this.taskStationList = [response.data]
                this.$modal.msgSuccess("出货成功");
                this.openReportWork = false
                this.openShipmentPre = false
                this.openReportWay = false
                this.logout()
              })
            }
          }else{
            this.$modal.msgError("周转筐生产单号信息不完整")
            this.statusFinish = true
          }
      },
      /** 按数量报工完工按钮 */
      finishWorking() {
        if(this.formReport.code === 'QC' && this.formReport.processSequence === '1'){
          this.formReport.datasource = this.datasource
          this.formReport.mode = '0'
          this.formReport.type = '1'
          this.formReport.currentOperator = this.userName
          this.formReport.workId = this.workId
          this.formReport.turnoverBasketNoList = []
          prodWorkOperation(this.formReport).then(response =>{
            this.openReport = false
            this.openReportWay = false
            this.openOutput = false
            this.getListTask()
          })
        }else if(this.formReport.datasourceType === '1'){
          this.formReport.datasource = this.datasource
          this.formReport.mode = '0'
          this.formReport.type = '1'
          this.formReport.currentOperator = this.userName
          this.formReport.workId = this.workId
          this.formReport.turnoverBasketNoList = []
          prodWorkOperation(this.formReport).then(response =>{
            this.openReport = false
            this.openReportWay = false
            this.openOutput = false
            this.getListTask()
          })
        }else {
          if(this.formReport.receivedQuantity == this.formReport.completedThis ||
            this.formReport.totalReceivedQuantity == parseFloat(this.formReport.completedThis) + parseFloat(this.formReport.completed)
            + parseFloat(this.formReport.outputQuantity)) {
            this.openShipment = true
          }else {
            this.openOutput = true
          }
        }
      },
      //  判断是否需要绑定rfid
      handleRfidBind() {
        var tdata = this.formReportWork;
        console.log('数据1：'+JSON.stringify(tdata))
        if (this.formReportWork.code === 'QC' && Number(this.formReportWork.sort) === Number(this.formReportWork.process)+1){
          this.disabledOneClick = false ;
        }else if (this.formReportWork.datasourceType === '1'){
          this.disabledOneClick = false ;
        }else{
          
            if(this.formReportWork.receivedQuantity === this.formReportWork.completedThis ||
              Number(this.formReportWork.totalReceivedQuantity) === Number((parseFloat(this.formReportWork.completedThis) + parseFloat(this.formReportWork.completed)+ parseFloat(this.formReportWork.outputQuantity)))
            ) {
                this.disabledOneClick = true ;

                const arr = {
                  rfid:this.formReportWork.rfid,
                  code:this.formReportWork.turnoverBasketNo,
                }
                this.ShipmentDataPre.push(arr);
                const a = []
                this.ShipmentDataPre.forEach(function (item) {
                  a.push(item.code)
                })
                this.turnoverBasketNoListPre = a; 
                console.log('周转筐编码：'+(JSON.stringify(this.formReportWork)))
                if(this.turnoverBasketNoListPre.length === 0){
                  this.$modal.msgError("还未绑定周转筐编码")
                  this.disabledOneClick = true ;
                }
            }else{
              this.disabledOneClick = false ;
            }
        }
      },
      /** 按百分比报工完工按钮 */
        finishWorkingPre() {
          var tdata = this.formReportWork;
          
          if (this.formReportWork.code === 'QC' && Number(this.formReportWork.sort) === Number(this.formReportWork.process)+1){
            this.formReportWork.datasource = this.datasource
            this.formReportWork.mode = '1'
            this.formReportWork.type = '1'
            this.formReportWork.currentOperator = this.userName
            this.formReportWork.workId = this.workId
            this.formReportWork.turnoverBasketNoList = []
            this.formReportWork.percentageThis = ((this.formReportWork.completedThis / this.formReportWork.quantity) * 100).toString()
            // if (parseFloat(this.formReportWork.percentageThis) + parseFloat(this.formReportWork.totalPercentage) >= 99){
            //   this.formReportWork.percentageThis = (100 - parseFloat(this.formReportWork.totalPercentage)).toString()
            // }
            console.log(this.formReportWork)
            prodWorkOperation(this.formReportWork).then(response =>{
              this.openReportWork = false
              this.openReportWay = false
              this.openOutputPre = false
              this.getListTask()
            })
          }else if (this.formReportWork.datasourceType === '1'){
            this.formReportWork.datasource = this.datasource
            this.formReportWork.mode = '1'
            this.formReportWork.type = '1'
            this.formReportWork.currentOperator = this.userName
            this.formReportWork.workId = this.workId
            this.formReportWork.turnoverBasketNoList = []
            console.log(this.formReportWork)
            prodWorkOperation(this.formReportWork).then(response =>{
              this.openReportWork = false
              this.openReportWay = false
              this.openOutputPre = false
              this.getListTask()
            })
          }else{
            
              if(this.formReportWork.receivedQuantity === this.formReportWork.completedThis ||
                // Number(this.formReportWork.totalReceivedQuantity) === Number((parseFloat(this.formReportWork.completedThis) + parseFloat(this.formReportWork.completed)+ parseFloat(this.formReportWork.outputQuantity)).toFixed(1))
                Number(this.formReportWork.totalReceivedQuantity) === Number((parseFloat(this.formReportWork.completedThis) + parseFloat(this.formReportWork.completed)+ parseFloat(this.formReportWork.outputQuantity)))
              ) {
                if(this.disabledOneClick){
                  this.saveShipmentPre()
                }else{
                  this.openShipmentPre = true;
                }
                
              }else {
                this.outPutDes = false
                this.openOutputPre = true
                if(Number(this.formReportWork.completedThis) >= 1){
                  this.outPutDes = true
                }else if ((Number(this.formReportWork.completedThis)+ Number(this.formReportWork.completed)) <1){
                  this.outPutDes = false
                }else if(Number(this.formReportWork.completed) >= 1){
                  this.outPutDes = true
                }
              }
          }
      },
      /** 按数量增加RFID标签 */
      handleAddRfid(){
        this.ShipmentData.push(JSON.parse(JSON.stringify(this.obj)))
      },
      /** 按百分比增加RFID标签 */
      handleAddRfidPre(){
        this.ShipmentDataPre.push(JSON.parse(JSON.stringify(this.obj)))
      },
      /** 多选框增加RFID标签 */
      handleAddRfidSe(){
        this.ShipmentDataSe.push(JSON.parse(JSON.stringify(this.obj)))
      },
      /** 按数量删除RFID标签 */
      handleDeleteRfid(row,index){
        this.ShipmentData.splice(index,1)
      },
      /** 按百分比删除RFID标签 */
      handleDeleteRfidPre(row,index){
        this.ShipmentDataPre.splice(index,1)
      },
      /** 多选框删除RFID标签 */
      handleDeleteRfidSe(row,index){
        this.ShipmentDataSe.splice(index,1)
      },
      tableRowClassName({row, rowIndex}) {
        //把每一行的索引放进row
        row.index = rowIndex;
      },
      /** 按数量报工根据RFID标签搜索周转框编码 */
      searchTurnoverBasket(row) {
        // this.rfid = row.rfid
        const index = row.index
        this.queryParamsRfid.rfidCode = row.rfid
        rfidTurnoverBasket(this.queryParamsRfid).then(res => {
          const arr = {
            rfid:res.data.rfid,
            code:res.data.code,
            status:res.data.status
          }
          this.ShipmentData.splice(index,1,arr)
          const a = []
          this.ShipmentData.forEach(function (item) {
            a.push(item.code)
          })
          this.turnoverBasketNoList = a
        })
      },
      /** 按百分比报工根据RFID标签搜索周转框编码 */
      searchTurnoverBasketPre(row) {
        // this.rfid = row.rfid
        
        const index = row.index
        this.queryParamsRfidPre.rfidCode = row.rfid
        rfidTurnoverBasket(this.queryParamsRfidPre).then(response => {
          const arr = {
            rfid:response.data.rfid,
            code:response.data.code,
            status:response.data.status
          }
          this.ShipmentDataPre.splice(index,1,arr)
          const a = []
          this.ShipmentDataPre.forEach(function (item) {
            a.push(item.code)
          })
          this.turnoverBasketNoListPre = a
          // this.turnoverBasketNoListPre.splice(1,response.data.code)
        })
      },
      /** 多选框根据RFID标签搜索周转框编码 */
      searchTurnoverBasketSe(row) {
        // this.rfid = row.rfid
        const index = row.index
        this.queryParamsRfid.rfidCode = row.rfid
        rfidTurnoverBasket(this.queryParamsRfid).then(res => {
          const arr = {
            rfid:res.data.rfid,
            code:res.data.code,
            status:res.data.status
          }
          this.ShipmentDataSe.splice(index,1,arr)
          const a = []
          this.ShipmentDataSe.forEach(function (item) {
            a.push(item.code)
          })
          this.turnoverBasketNoListSe = a
        })
      },
      /**报工按钮*/
      handleReport(row) {
        this.selectCode = row.code ;
        // if(row.workReportingMethod == null){
        //   this.openReportWay = true;
        //   this.titleReportWay = '请选择报工方式'
        //   this.formData = row
        //   this.workHour = row.workHour
        //   this.workId = row.id
        //   this.taskId = row.taskId
        //   this.actionStatus = '0'
        //   this.datasource = '1'
        // }else if(row.workReportingMethod == '0'){
        //   this.formData = row
        //   this.workHour = row.workHour
        //   this.workId = row.id
        //   this.taskId = row.taskId
        //   this.actionStatus = '0'
        //   this.datasource = '1'
        //   this.amountReport()
        // }else {
        //
        // }
        this.formData = row
        this.workHour = row.workHour
        this.workId = row.id
        this.taskId = row.taskId
        this.actionStatus = '0'
        this.datasource = '1'
        this.percentageReport();
        
      },
      /** 程式单 */
      handleOpenProgram(row) {
        this.titleProgram = ""
        this.openProgram = true
        this.prodOrderNo = row.prodOrderNo
        this.programDataSource = row.datasource
        this.getCamProgramSheet()
        this.getCamProgramSheetList()
      },
      /** 程式单查看详细 */
      handleViewDetail(row) {
        if(this.programDataSource === '0') {
          this.titleProgramDetail = "分条程式单详情"
          this.openProgramDetail = true
          this.programOrderNo = row.manufactureNo
          this.getCamProgramDetailList()
        }else{
          this.eleProgramDetail.title = "分条程式单详情"
          this.eleProgramDetail.open = true
          this.programOrderNo = row.manufactureNo
          this.getCamProgramDetailList()
        }
      },
      /** 查看钢件图档 */
      handleOpenSheetDraw(row) {
        this.titleDraw = "加工图档"
        this.openDraw = true
        this.code = row.code
        this.prodOrderNo = row.prodOrderNo
        this.designSort = row.sort
        this.getListDesignDoc()
      },
      /** 放电参数弹窗 */
      handleOpenDischarge(row) {
        this.openDischarge = true
        this.prodOrderNo = row.prodOrderNo
        this.getListDischargeParameters()
        this.getCamElectricSparkList()
      },
      /** 电火花加工位置详细 */
      handleDischargeDetail(row) {
        this.DischargeDetail.open = true
        this.DischargeDetail.title = "电极火花加工位置列表"
        this.formDischargeDetail = row
      },
      /** 工件待接收任务列表 */
      handleWaitprocess() {
        this.$router.push({
          path:'/production/taskStation',
        });
      },
      /** 设备待加工任务列表 */
      handleWaitEquprocess() {
        this.$router.push({
          path:'/production/taskStation-edit/equProcess',
        });
      },
      /** 我完成的加工任务 */
      handleAlreadyFinish() {
        this.$router.push({
          path:'/production/taskStation-edit/finishTask',
        });
      },
      /**报工下机按钮*/
      handleReportFinish() {
        if(this.workReportingMethod == null){
          this.openReportWay = true;
          this.titleReportWay = '请选择报工方式'
          this.datasource = '1'
          this.actionStatus = '1'
        }else if(this.workReportingMethod == '0'){
          this.datasource = '1'
          this.actionStatus = '1'
          this.amountReport()
        }else {
          this.datasource = '1'
          this.actionStatus = '1'
          this.percentageReport()
        }
      },
      /**异常工件按钮*/
      handleAbnormal() {
        this.titleAbnormal = "报废"
        this.openAbnormal = true
      },
      /**异常工件提交按钮*/
      submitFormAbnormal:function () {
        this.$refs["formAbnormal"].validate(valid => {
          this.formAbnormal.idList = this.ids
          this.formAbnormal.code = this.selectCode;
          getAbnormalWorkpiece(this.formAbnormal).then(res => {
            if(res!=undefined){
              this.$modal.msgSuccess("工件报异常成功")
            }
            
            this.openAbnormal =false
            this.getListTask()
          })
        })
      },
      /** 退出登录 */
      logout() {
        this.$confirm('确定下机吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$store.dispatch('LogOut').then(() => {
            location.href = '/index';
          })
        }).catch(() => {});
      },
      /** 多选框禁选 */
      selected(row,index){
        if (row.orderStatus == '2') {
          return false //不可勾选
        } else {
          return true; //可勾选
        }
      },
      /** 按数量报工表头点击 */
      clickFun() {
        this.ShipmentData.push(JSON.parse(JSON.stringify(this.obj)))
      },
      /** 按百分比报工表头点击 */
      clickFunPre(column,event) {
        if(column.label === '+') {
          this.ShipmentDataPre.push(JSON.parse(JSON.stringify(this.obj)))
        }
      },
      onDialogClose(){
          this.disabledOneClick = false;
      },
      /** 多选框表头点击 */
      clickFunSe() {
        this.ShipmentDataSe.push(JSON.parse(JSON.stringify(this.obj)))
      },
      // 提取文件后缀名
      getSuffix(str) {
        const fileExtension = str.substring(str.lastIndexOf(".") + 1);
        return fileExtension;
      },
      /** 查看图档 */
      handleOpenDraw(row,i) {
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
          // alert('http://127.0.0.1:8012/onlinePreview?url='+encodeURIComponent(Base64.encode(url)))
          // window.open('http://127.0.0.1:8012/onlinePreview?url='+encodeURIComponent(Base64.encode(url)));
          // window.open('http://127.0.0.1:8012/onlinePreview?url='+encodeURIComponent(Base64.encode(url)));
          window.open(downloadGlobal.hostWatch + '/onlinePreview?url='+encodeURIComponent(Base64.encode(url)));
          // window.open(global.hostWatch + '/onlinePreview?url='+encodeURIComponent(Base64.encode(url)));
        }
      },
      /** 出货绑筐刷新按钮 */
      handleUpdate(){

      },
      /** 查看客户图档 */
      watchFiles(row) {
        this.detailId = row.detailId
        this.pieceNo = row.pieceNo
        this.customerId = row.bomId
        this.files.open = true
        this.getFile();
        this.getPublicFile();
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
      /** 打印成品标签 */
      handlePrint() {
        this.order.open = true
        this.order.title = "订单BOM已转生产单"
        this.getListDetailAlready()
        this.getListOrder()
        this.getListCustomer()
      },
      /** 打印 */
      bindPrint() {
        let LODOP = getLodop(); //调用getLodop获取LODOP对象
        LODOP.PRINT_INIT('')
        LODOP.ADD_PRINT_HTM(20, 15, '90%', '100%',document.getElementById('printTable').innerHTML)
        // LODOP.ADD_PRINT_BARCODE(150, 55, 160, 24, "128Auto", document.getElementById('barcodeBox').innerHTML);
        // LODOP.PRINT_DESIGN();

        LODOP.PREVIEW(); //预览(预览打印无脚标)
        // LODOP.PRINT();  //打印
      },
      /** 申请电极 */
      eleApplication() {
        this.application.open = true
        this.getListElectrode()
      },
      /** 申请电极保存按钮 */
      submitFormElectrode() {
        const data = {
          ids: this.formApplication.ids,
          userName: this.userName + '-' + this.personNo,
          opt: '4',
        }
        saveElectrodeMange(data).then(res => {
          this.$modal.msgSuccess("申请电极出库成功")
          this.application.open = false
        })
      }
    }
  }
</script>