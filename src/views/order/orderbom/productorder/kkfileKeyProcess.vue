<template>
  <div>
    <!--  变更工艺页面-->
    <el-row :gutter="20">
      <el-col>
        <el-row :gutter=4>
          <el-col :span="6" style="margin-top: 16px" >
            <span style="font-size: 16px;margin-left: 16px">工件图档</span>
            <el-button
              type="success"
              circle
              style="float: right"
              v-if="isDrawing"
              icon="el-icon-upload2"
              @click="handleAddDrawing"
            ></el-button>
            <el-table :data="filesData" border max-height="220px">
              <el-table-column property="pieceNo" label="件号" width="80px">
                <template >
                  <span>{{PieceNo}}</span>
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
          <el-col :span="6" style="margin-top: 16px">
            <span style="font-size: 16px;margin-left: 16px">公共图档</span>
            <el-table :data="publicFilesData" max-height="220px">
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
          <el-col :span="6">
          <el-form ref="formCost" :model="formCost" :rules="rules" label-width="100px">
                <el-form-item label="电极成本/元">
                  <el-input v-model="formCost.electrodeCost" type="number" oninput ="value=value.replace(/\-(\-?\d+(\.\d{0,2})?)/)"></el-input>
                </el-form-item>
                <el-form-item label="加工成本">
                  <el-input v-model="formCost.processingCost" type="number"></el-input>
                </el-form-item>
                <el-form-item label="发料数量">
                  <el-input v-model="formCost.issuedQuantity"></el-input>
                </el-form-item>
                <el-form-item label="刀具成本">
                  <el-input v-model="formCost.toolCost" type="number" oninput ="value=value.replace(/\-(\-?\d+(\.\d{0,2})?)/)"></el-input>
                </el-form-item>
                <el-form-item label="总成本">
                  <el-input v-model="totalCost" type="number"></el-input>
                </el-form-item>
          </el-form>
           </el-col>
          <el-col :span="6">
            <el-form ref="formCost" :model="formCost" :rules="rules" label-width="100px">
                <el-form-item label="发料大小">
                  <el-input v-model="formCost.issueSize"></el-input>
                </el-form-item>
                <el-form-item label="材料成本">
                  <el-input v-model="materialCost" oninput ="value=value.replace(/\-(\-?\d+(\.\d{0,2})?)/)"></el-input>
                </el-form-item>
                <el-form-item label="管理成本">
                  <el-input v-model="managementCost" type="number"></el-input>
                </el-form-item>
                <el-form-item label="管理成本比例">
                  <el-input  v-model="formCost.proportion" type="number">
                    <i slot="suffix" style="font-style:normal;margin-right: 10px; line-height: 30px;">%</i>
                  </el-input>
                </el-form-item>
              <el-form-item label="工件选择类型">
                <el-select v-model="queryParams.workpieceTypeId" placeholder="请选择" clearable>
                  <el-option
                    v-for="item in processFortype"
                    :key="item.id"
                    :label="item.typeName"
                    :value="item.id"
                  ></el-option>
                </el-select>
                <el-button
                  size="small"
                  type="primary"
                  round
                  style="margin-left: 20px"
                  icon="el-icon-search"
                  @click="handleQuery"
                ></el-button>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="13">
            <iframe @load="loaded" ref="vueIframe" src="/static/3DView/demo.html" frameborder="0" style="width: 100%;height:62.5vh " v-if="threedView"></iframe>
            <iframe @load="loaded" ref="vueIframe" src="/static/2DView/test.html" frameborder="0" style="width: 100%;height:62.5vh" v-if="twodView"></iframe>
            <iframe @load="loaded" :src=url frameborder="0" style="width: 100%;height:62.5vh" v-if="officeView"></iframe>
          </el-col>
          <el-col :span="11">
            <el-row>
              <el-col :span="24"><span>设置模号 <el-tag>{{ModuleNo}}</el-tag>，工件号 <el-tag>{{PieceNo}}</el-tag> 的工艺制程 (方向键⬆ ⬇可上下选中某工艺) 快捷键F2为增加工艺，F4为删除高亮选中工艺</span></el-col>
            </el-row>
            <el-row>
              <elx-editable v-loading="loading" ref="editableList" stripe :data.sync="processList" :highlight-current-row="true"
                            @keydown.up.native.prevent="moveHighlight(-1)"
                            @keydown.down.native.prevent="moveHighlight(1)"
                            tabindex="0"
                            @keyup.native="handleAdd2"
                            @click.native="selectRow"
                            :edit-config="{trigger: 'click', mode: 'cell',autoClearActive:'true',isDelKey:'true',activeMethod:editEvent}"
                            :edit-rules="{name: [{required: true, message: '单元格不能为空', trigger: 'blur'}]}" show-summary :summary-method="getSummaries"
                            :row-class-name="tableRowClassName" max-height="600px">
                <elx-editable-column align="center" width="65">
                  <template slot-scope="scope">
                    {{scope.row.index+1}}
                  </template>
                </elx-editable-column>
                <elx-editable-column prop="code" ref="refColumn" align="center" label="工段代码">
                  <template slot-scope="{ row, $index }">
                    <el-input @keyup.enter.native="goToInput2('code_' + $index)" :ref="'code_' + $index" v-model="row.code" @change.native="editCode(row)"></el-input>
                  </template>
                  <!--          <template slot-scope="scope">-->
                  <!--            <el-input v-model="processList.code" placeholder="" />-->
                  <!--        </template>-->
                </elx-editable-column>
                <elx-editable-column class="titleClick" prop="name" align="center" label="工序名称"></elx-editable-column>
                <elx-editable-column prop="workHour" ref="refColumn2" align="center" label="工时" type="default">
                  <template slot-scope="{ row, $index }">
                    <el-input @keyup.enter.native="goToInput2('workHour_' + $index)" :ref="'workHour_' + $index" v-model="row.workHour" type="number"></el-input>
                  </template>
                </elx-editable-column>
                <elx-editable-column prop="unitPrice" align="center" label="单价"></elx-editable-column>
                <elx-editable-column prop="totalPrice" align="center" label="总价">
                  <template slot-scope="scope">
                    {{ (scope.row.totalPrice = scope.row.workHour *scope.row.unitPrice) | keepTwoNum}}
                  </template>
                </elx-editable-column>
                <elx-editable-column prop="remark" ref="refColumn3" align="center" label="备注">
                  <template slot-scope="{ row,  $index }">
                    <el-input @keyup.enter.native="goToInput2('remark_' + $index)" :ref="'remark_' + $index" v-model="row.remark"></el-input>
                  </template>
                </elx-editable-column>
                <elx-editable-column prop="outGoing" align="center" label="是否外发"  :edit-render="{name: 'ElSwitch', type: 'visible'}"></elx-editable-column>
                <elx-editable-column label="操作" align="center" width="110" :edit-render="{name: 'ElInput'}">
                  <template slot-scope="scope">
                    <el-button
                      size="mini"
                      type="text"
                      icon="el-icon-plus"
                      @click="handleAdd(scope.row)"
                      @keyup.113="handleAdd(scope.row)"
                      v-if="scope.row.currentSection === 'N' || scope.row.currentSection == null"
                    ></el-button>
                    <el-button
                      size="mini"
                      type="text"
                      icon="el-icon-minus"
                      @click="handleDelete(scope.row)"
                      v-if="scope.row.currentSection === 'N' || scope.row.currentSection == null"
                    ></el-button>
                    <el-button
                      size="mini"
                      type="text"
                      icon="el-icon-top"
                      @click="handleAdjustUp(scope.row, scope.$index)"
                      v-if="scope.row.currentSection === 'N' || scope.row.currentSection == null"
                    ></el-button>
                    <el-button
                      size="mini"
                      type="text"
                      icon="el-icon-bottom"
                      @click="handleAdjustDown(scope.row, scope.$index)"
                      v-if="scope.row.currentSection === 'N' || scope.row.currentSection == null"
                    ></el-button>
                  </template>
                </elx-editable-column>
              </elx-editable>
            </el-row>
            <el-row style="margin-top: 10px;margin-left: 100px">
              <el-button
                size="small"
                plain
                type="primary"
                icon="el-icon-check"
                :disabled="isDisabled"
                @click="handleSave"
              >保存</el-button>
              <el-button
                size="small"
                plain
                type="warning"
                icon="el-icon-close"
                @click="handleCancel"
              >取消</el-button>
              <el-button
                size="small"
                plain
                type="warning"
                icon="el-icon-check"
                @click="handleCopy"
              >复制其他工件工艺</el-button>
              <el-button
                size="small"
                plain
                type="primary"
                icon="el-icon-upload2"
                @click="routerPrevPart"
              >上一个零件</el-button>
              <el-button
                size="small"
                plain
                type="primary"
                icon="el-icon-download"
                @click="routerNextPart"
              >下一个零件</el-button>
            </el-row>
          </el-col>
        </el-row>
      </el-col>
    </el-row>

    <!-- 复制其他工件工艺对话框 -->
    <el-dialog :label="label" :visible.sync="open" width="1000px" append-to-body>
      <el-form :model="copyQueryParams" ref="queryForm" :inline="true" >
        <el-row>
          <el-form-item label="生产单号：" prop="prodOrderNo">
            <el-input
              v-model="copyQueryParams.prodOrderNo"
              placeholder="请输入生产单号"
              clearable
              size="small"
              style="width: 220px"
            />
          </el-form-item>
          <el-form-item>
            <el-button style="margin-left: 10px" type="primary" icon="el-icon-search" size="mini" @click="handleCopy"></el-button>
          </el-form-item>
        </el-row>
      </el-form>
      <el-row :gutter="24">
        <el-col :span="14">
          <el-table :data="copyData" v-loading="loading" :default-sort = "{order: 'descending'}" @cell-dblclick="copyClick">
            <el-table-column prop="prodOrderNo" label="生产单号" sortable></el-table-column>
            <el-table-column prop="moduleNo" label="模号"></el-table-column>
            <el-table-column prop="pieceNo" label="工件号"></el-table-column>
            <el-table-column prop="versionNo" label="版本"></el-table-column>
            <el-table-column prop="pinName" label="产品"></el-table-column>
          </el-table>
          <div style="margin-top: 20px;margin-left: 40%">
            <el-button @click="open = false" type="danger" style="margin-right: 40%">取 消</el-button>
          </div>
        </el-col>
        <el-col :span="10">
          <el-table :data="copyProcessData" v-loading="loading" :default-sort = "{order: 'descending'}">
            <el-table-column prop="name" label="工序名称" sortable></el-table-column>
            <el-table-column prop="workHour" label="工时"></el-table-column>
            <el-table-column prop="unitPrice" label="单价"></el-table-column>
            <el-table-column prop="totalPrice" label="总价"></el-table-column>
          </el-table>
          <div style="margin-top: 20px;margin-left: 40%">
            <el-button @click="handleCopyProcess" type="primary" style="margin-right: 40%">复制工艺</el-button>
          </div>
        </el-col>
      </el-row>
      <pagination
        v-show="copyTotal>0"
        :total="copyTotal"
        :page.sync="copyQueryParams.pageNo"
        :limit.sync="copyQueryParams.pageSize"
        @pagination="handleCopy"
      />
    </el-dialog>
    <!-- 工时是否相乘 -->
    <el-dialog v-loading="loading" :label="label2" :visible.sync="openSave" width="380px" tabindex="0" append-to-body>
      <div style="margin-left: 5%">
        修改工艺成功，继续下个零件的编辑，请继续Enter
      </div>
      <div style="margin-top: 10px">
        手动保存，点击下方按钮，并点击跳转下一个零件
      </div>
      <div style="margin-top: 10px;margin-bottom: 10px;margin-left: 40%">
        <el-button type="primary" @click="routerNextPart">保存</el-button>
      </div>
      <div style="margin-left: 8%">
        如果不保存，则点击取消(ESC)，并新增工艺(F2)
      </div>
      <div style="margin-top: 10px;margin-bottom: 10px;margin-left: 40%">
        <el-button type="danger" @click="cancelSave">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 查看工艺群组详细对话框 -->
    <el-dialog :label="label" :visible.sync="openGroup" width="400px" append-to-body>
      <el-table :data="groupData" v-loading="loading">
        <el-table-column label="工序代码" prop="code"/>
        <el-table-column label="工序名称" prop="name"/>
        <el-table-column label="工时" prop="workHour"/>
        <el-table-column label="单价" prop="unitPrice"/>
      </el-table>
      <div style="margin-top: 20px;margin-left: 40%">
        <el-button @click="openGroup = false" type="danger" style="margin-right: 40%">取 消</el-button>
      </div>
    </el-dialog>
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
import {delOrderBomProcess,listEquipmentCrafts,queryCost,saveEquipmentCrafts} from "../../../../api/order/process"
import {listWorktime} from "../../../../api/order/timecost";
import {getOrderBomDetailById, listChangeBom, processRecovery} from "../../../../api/order/change";
import {getGroupAllProcess,getGroupPage,getGroupProcessPage,getProcessWorkpieceType} from "../../../../api/system/process";
import elTableInfiniteScroll from 'el-table-infinite-scroll';
import {listQuality} from "../../../../api/system/quality";
import {
  delDrawingFile,
  getDrawingFile,
  getPublicDrawingFile,
  isDraw,
  listBomDetail,
  uploadDrawingFile
} from '@/api/order/orderbom'
import downloadGlobal from '@/store/downloadGlobal'
import { Base64 } from 'js-base64'
import { getUserProfile } from '@/api/system/user'

export default {
  name: "kkfileKeyProcess",
  dicts: ['sys_normal_disable'],
  filters: {
    keepTwoNum(value){
      value = Number(value);
      return value.toFixed(2)
    },
    directives: {
      'el-table-infinite-scroll': elTableInfiniteScroll
    }
  },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 总条数
      total: 0,
      copyTotal:0,
      totalFile:0,
      totalPublicFile:0,
      // 非多个禁用
      multiple: true,
      //
      currentRowIndex: -1,
      currentColumnIndex: -1,
      //
      prodOrderNoDraw:'',
      //工件总价
      totalPrice:null,
      //搜索条件
      searchName:'',
      // 导入订单
      fileList: [],
      // 工艺制程表格数据
      processList: [{
        code:'',
        workHour: '',
        unitPrice:'',
        totalPrice:'',
      }],
      // 工序表格数据
      procedureList: [],
      routeQuery:{},
      // 工艺成本表单参数
      formCost: {
        processingCost:null,
        materialCost:null,
        managementCost:null,
        toolCost:null,
        electrodeCost:null,
        totalCost:null,
        proportion:null
      },
      //总成本数据
      sums:[],
      //公共图档表格数据
      publicFilesData:[],
      //工件图档表格数据
      filesData:[],
      //复制工件工艺表格数据
      copyData:[],
      copyProcessData:[],
      //Bom工艺Id，排序
      BomProcessId:[],
      BomProcessSort:[],
      // 弹出层标题
      label: "",
      labelGroup:'工艺群组详细信息',
      label2:'是否保存工艺？如果是，则继续Enter，否则点击取消',
      //工件图档参数
      files:{
        // 是否显示弹出层
        open: false,
        // 弹出层标题
        title: "工件图档",
      },
      // 是否显示弹出层
      open: false,
      openGroup: false,
      openWorkHour:false,
      openSave:false,
      //选中工艺列表数据
      currentRowData: null,
      //上一页面信息
      ModuleNo:{},
      PieceNo:{},
      bomId:'',
      DetailId:'',
      //查询数据
      processFortype:[],
      //工序列表滚动框
      disabled:false,
      //材料成本计算参数
      height:'',
      length:'',
      width:'',
      material:'',
      density:'',
      price:'',
      quantity:'',
      //
      url:"",
      //工艺群组抽屉打开
      table: false,
      //
      inputTimer: null,
      //工艺群组表格数据
      groupProcessData:[],
      //工艺群组详细数据
      groupData:[],
      //工艺群组编号集合
      groupCodeList:[],
      //操作类型
      type:'',
      //
      routerList:[],
      //保存工艺禁止按钮
      isDisabled:false,
      // 查询参数
      queryParams: {
        pageNo: 1,
        pageSize: 40,
      },
      queryParamsBom: {
        pageNo: 1,
        pageSize: 10,
      },
      //上传图档按钮是否可见
      isDrawing:true,
      // 查询参数
      queryParamsEdit: {
        pageNo: 1,
        pageSize: 40,
      },
      // 查询参数
      copyQueryParams: {
        pageNo: 1,
        pageSize: 10,
      },
      // 查询参数
      queryParamsProcess: {
        pageNo: 1,
        pageSize: 100,
      },
      // 查询参数
      queryParamsDraw: {
        pageNo: 1,
        pageSize: 10,
      },
      //
      flag: false,
      percentage:'',
      signal2: false,
      flag2: false,
      //增加单数
      obj:{
        name:'',
        workHour:'',
        unitPrice:'',
        totalPrice:'',
        currentSection: "N",
      },
      //变更图档参数
      filesChange:{
        // 是否显示弹出层
        open: false,
        // 弹出层标题
        title: "工件图档",
      },
      //跳转判断参数
      workType:'',
      //
      threedView: false,
      twodView: false,
      officeView: false,
      //
      status:'',
      //订单BOM表单校验
      rules: {
        managementCost: [
          { required: true, message: "管理成本不能为空", trigger: "blur" },
        ],
        totalCost: [
          { required: true, message: "总成本不能为空", trigger: "blur" },
        ],
      },
    };
  },
  computed: {
    managementCost: function () {
      if (isNaN(parseFloat(this.formCost.processingCost) + parseFloat(this.materialCost)
        + parseFloat(this.formCost.toolCost) + parseFloat(this.formCost.electrodeCost))) {
        return ''
      } else {
        const he = parseFloat(this.formCost.processingCost) + parseFloat(this.materialCost)
          + parseFloat(this.formCost.toolCost) + parseFloat(this.formCost.electrodeCost);
        let str = Number(this.formCost.proportion/100).toFixed(2)
        return (he * str).toFixed(2);
      }
    },
    totalCost: function () {
      if (isNaN(parseFloat(this.formCost.processingCost) + parseFloat(this.materialCost) + parseFloat(this.managementCost)
        + parseFloat(this.formCost.toolCost) + parseFloat(this.formCost.electrodeCost))) {
        return ''
      } else {
        const total = parseFloat(this.formCost.processingCost) + parseFloat(this.materialCost) + parseFloat(this.managementCost)
          + parseFloat(this.formCost.toolCost) + parseFloat(this.formCost.electrodeCost);
        return total.toFixed(2);
      }
    },
    materialCost:function () {
      if (isNaN(parseFloat(this.weight)*parseFloat(this.price))){
        return ''
      } else{
        const material = parseFloat(this.weight)*parseFloat(this.price)*parseFloat(this.quantity)
        return material.toFixed(2);
      }
    },
  },
  created(){
    this.getListEquipmentCrafts();
    this.getList();
    this.getListTime();
    this.getSetting();
    this.getListGroup();
    this.getListUser()
    // window.addEventListener('keydown',this.handleKeyDown,true)
    //开启键盘监听模式
  },
  watch:{
    $route() {
    this.ModuleNo = this.$route.query.moduleNo
    this.PieceNo = this.$route.query.pieceNo
    this.quantity = this.$route.query.quantity
    this.workType = this.$route.query.workType
    this.bomId = this.$route.query.bomId
    this.DetailId = this.$route.query.DetailId
    // this.getListEquipmentCrafts();
    // this.getList();
    // this.getListTime();
    // this.getSetting();
    // this.getListGroup();
    this.prodOrderNoDraw = this.$route.query.orderNo
    },
    url(){
      this.loaded()
      // this.loaded2()
    },
    filesData(){
      this.handleSeeDrawing(this.filesData[0],1)
    },
    prodOrderNoDraw(){
      this.checkIsDrawing()
      this.getFile();
    },
    bomId(){
      this.getPublicFile();
    },
  },
  mounted() {
    this.prodOrderNoDraw = this.$route.query.orderNo
    this.ModuleNo = this.$route.query.moduleNo
    this.PieceNo = this.$route.query.pieceNo
    this.quantity = this.$route.query.quantity
    this.workType = this.$route.query.workType
    this.bomId = this.$route.query.bomId
    this.status = this.$route.query.status
    this.DetailId = this.$route.query.DetailId
    this.$nextTick(() => {
      this.iframeWin = this.$refs.vueIframe.contentWindow;
    });
    if(this.$route.query.type === undefined){
      this.type = '0'
    }else {
      this.type = this.$route.query.type
    }
    this.checkIsDrawing()
    this.getFile();
    this.getPublicFile();
    // this.$nextTick(() => {
    //   const editableElement = this.$refs.editableList.$el;
    //   if (editableElement) {
    //     const headerElement = editableElement.querySelector('.el-table__header-wrapper');
    //     if (headerElement) {
    //       // 创建一个点击事件
    //       const clickEvent = new MouseEvent('click', {
    //         bubbles: true,
    //         cancelable: true,
    //         view: window
    //       });
    //       // 触发点击事件
    //       console.log(headerElement);
    //       headerElement.dispatchEvent(clickEvent);
    //     }
    //   }
    // });
    // this.$nextTick(() => {
    //   const editableElement = this.$refs.editableList;
    //   if (editableElement) {
    //     editableElement.focus();
    //   }
    // });
    // this.$nextTick(() => {
    //   const editableElement = this.$refs.editableList.$el;
    //   if (editableElement) {
    //     // 模拟点击第一个可点击的元素
    //     const clickableElement = editableElement.querySelector('.el-table__header-wrapper');
    //     if (clickableElement) {
    //       clickableElement.click();
    //     }
    //   }
    // });
    // this.$nextTick(() => {
    //   setTimeout(()=>{
    //     // 获取elx-editable组件的DOM元素
    //     const editableElement = this.$refs.editableList.$el;
    //     if (editableElement) {
    //       // 获取标题栏的DOM元素
    //       const headerElement = editableElement.querySelector('.el-table__header-wrapper');
    //       if (headerElement) {
    //         // 模拟点击标题栏
    //         headerElement.click();
    //       }
    //     }
    //   },1000)
    // });
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
    /** 分页查询工艺列表 */
    getListEquipmentCrafts() {
      this.loading = true;
      this.queryParams.type = '0'
      listEquipmentCrafts(this.queryParams).then(response => {
        this.procedureList = response.data.records;
        this.total = Number(response.data.total);
        this.loading = false;
      });
    },
    /** 分页查询工时成本列表 */
    getList() {
      this.loading = true;
      let detailId = this.$route.query.DetailId
      if (this.$route.query.DetailId === undefined){
        detailId = this.DetailId
      }
      getOrderBomDetailById({'detailId':detailId}).then(response => {
        this.formCost = response.data
        this.weight = response.data.weight
        this.material = response.data.material
        this.price = response.data.price
        this.PieceNo = response.data.pieceNo
        this.ModuleNo = response.data.moduleNo
        this.loading = false;
      });
    },
    /** 查看工时 */
    getListTime() {
      this.queryParamsProcess.detailId = this.$route.query.DetailId
      if (this.$route.query.DetailId === undefined){
        this.queryParamsProcess.detailId = this.DetailId
      }
      listWorktime(this.queryParamsProcess).then(response =>{
        this.processList = response.data.records;
        if(this.processList.length === 0){
          this.processList.splice(0,0,JSON.parse(JSON.stringify(this.obj)))
        }
      })
    },
    /** 查询工件类型 */
    getSetting() {
      getProcessWorkpieceType(this.queryParams).then(response => {
        this.processFortype = response.data.records;
      });
    },
    /** 查询工艺群组列表 */
    getListGroup() {
      this.loading = true;
      getGroupPage(this.queryParams).then(response => {
        this.groupProcessData = response.data.records
      });
    },

    //编辑工艺
    editCode(row){
      // console.log(row)
      this.queryParamsEdit.code = row.code.toUpperCase().replace(/\s/g, '');
      // 使用 $nextTick 来确保 DOM 更新后再执行
      // this.$nextTick(() => {
      listEquipmentCrafts(this.queryParamsEdit).then(response => {
        this.currentRowData = response.data.records;
        this.middleList = this.currentRowData.filter(item => item.code === this.queryParamsEdit.code);
        this.currentRowData = this.middleList[0]
        if (JSON.stringify(this.processList).indexOf(JSON.stringify(this.currentRowData)) == -1) {
          const o = {
            name: this.currentRowData.name,
            code: this.currentRowData.code,
            unitPrice: this.currentRowData.unitPrice,
            processManHourId: this.currentRowData.id,
            currentSection: "N",
          };
          this.processList.splice(row.index, 1, o);
        }
      });
      // });
      // clearTimeout(this.inputTimer);
      //
      // // 设置一个新的定时器，延时500毫秒执行请求
      // this.inputTimer = setTimeout(() => {
      //   this.queryParamsEdit.code = row.code;
      //
      //   listEquipmentCrafts(this.queryParamsEdit).then(response => {
      //     this.currentRowData = response.data.records[0];
      //     if (JSON.stringify(this.processList).indexOf(JSON.stringify(this.currentRowData)) == -1) {
      //       const o = {
      //         name: this.currentRowData.name,
      //         code: this.currentRowData.code,
      //         unitPrice: this.currentRowData.unitPrice,
      //         processManHourId: this.currentRowData.id,
      //         currentSection: "N",
      //       };
      //       this.processList.splice(row.index, 1, o);
      //     }
      //   });
      // }, 500); // 设置延时时间，您可以根据需要调整
    },

    //选中一行
    lineClick(val) {
      this.currentRowData = val;
      this.Id = this.currentRowData.id
      const  arr = []
      let flag = true
      if (JSON.stringify(this.processList).indexOf(JSON.stringify(this.currentRowData)) == -1) {
        const o = {
          name:this.currentRowData.name,
          code:this.currentRowData.code,
          unitPrice:this.currentRowData.unitPrice,
          processManHourId:this.currentRowData.id,
          currentSection:"N",
        }
        for (let i = 0; i < this.processList.length; i++){
          if(this.processList[i].code == null){
            this.processList.splice(i,1,o)
            flag = false
            break
          }else{
            flag = true
          }
        }
        if(flag){
          this.processList.push(o)
        }
      }
    },
    //选中之后设置颜色
    setColor({row, rowIndex}) {
      if (JSON.stringify(this.processList).indexOf(JSON.stringify(row)) != -1) {
        return {
          color: 'red',
        }
      }
    },

    //增加
    handleAdd(row) {
      // console.log(row)
      this.processList.splice(row.index+1,0,JSON.parse(JSON.stringify(this.obj)))
      // this.processList.push(JSON.parse(JSON.stringify(this.obj)))
    },
    handleAdd2(row) {
      // console.log(this.currentColumnIndex)
      // 处理 F2 键被按下的逻辑
      if (event.key === "F2") {
        if(this.processList[this.currentRowIndex].currentSection === 'N' || this.processList[this.currentRowIndex].currentSection === null){
          this.processList.splice(this.currentRowIndex + 1,0,JSON.parse(JSON.stringify(this.obj)))
        } else {
          this.$modal.msgError("当前工艺不可操作");
        }
      }
      if (event.key === "F4") {
        // 处理 F4 键被按下的逻辑
        // this.processList.splice(this.currentRowIndex, 1)
        if(this.processList[this.currentRowIndex].currentSection === 'N' || this.processList[this.currentRowIndex].currentSection === null){
          if (this.processList.length > 0) {
            if (this.processList[this.currentRowIndex].id === undefined) {
              this.processList.splice(this.currentRowIndex, 1)
            } else {
              delOrderBomProcess({ 'id': this.processList[this.currentRowIndex].id }).then(response => {
                this.$modal.msgSuccess("删除成功，请及时保存！！！");
                this.getListTime();
              })
            }
            // 这里可以调用你需要的方法或执行你的逻辑
          }
        } else {
          this.$modal.msgError("当前工艺不可操作");
        }
      }
      if (event.key === "Enter") {
        event.preventDefault();
        // console.log(this.processList[this.processList.length - 1].name)
        // this.$nextTick(() => {
        //   if (this.currentColumnIndex === 1) { // 第yi列编辑完成后回车，移动到第er列
        //     this.$refs.refColumn2.focus();
        //   } else if (this.currentColumnIndex === 3){
        //     this.$refs.refColumn3.focus();
        //   } else if (this.currentColumnIndex === 6) { // 其他情况移动到第一列（不编辑）
        //     this.$refs.refColumn.focus();
        //   }
        // });
        let signal = false
        if (this.openSave === true){
          this.signal2 = true
        } else {
          this.signal2 = false
        }
        // let signal2 = false
        if (this.processList[this.processList.length - 1].code == "QC" || this.processList[this.processList.length - 1].code == "CK"){
          if(this.processList[this.processList.length - 1].name !== '' && this.processList[this.processList.length - 1].workHour !== null && this.processList[this.processList.length - 1].workHour !== ''){
            for (let i = 0;i < this.processList.length;i++){
              if(this.processList[i].workHour == null || this.processList[i].code == null || this.processList[i].name == null){
                this.$modal.msgError("工序或工序工时输入有误，请重试");
                this.loading = false
                signal =false
                break
              } else {
                signal =true
              }
            }
          }
        }

        if (this.flag2){
          this.$router.go(-1);
        }
        if(signal && this.signal2 === false){
          this.flag = true
          this.openSave = true
        } else {
          this.flag = false
        }
        if(this.flag && this.signal2 === false && this.flag2 === false){
          this.loading = true
          const orderBomProcessEditIns = [];
          let detailId = this.DetailId
          this.processList.forEach(function(item){
            orderBomProcessEditIns.push(
              {
                code:item.code,
                name:item.name,
                totalPrice:item.totalPrice + '',
                unitPrice:item.unitPrice,
                workHour:item.workHour + '',
                processManHourId:item.processManHourId,
                detailId: detailId,
                id:item.id,
                sort:item.index+1,
                remark:item.remark
              })
          });
          const data ={
            'type': this.type,
            'bizType':'2',
            'cost':{
              "detailId": detailId,
              "electrodeCost": this.formCost.electrodeCost,
              "managementCost": this.managementCost+'',
              "materialCost": this.materialCost,
              "processingCost": this.formCost.processingCost,
              "toolCost": this.formCost.toolCost,
              "totalCost": this.totalCost+'',
              "issueSize": this.formCost.issueSize,
              "issuedQuantity": this.formCost.issuedQuantity,
            },
            'orderBomProcessEditIns':orderBomProcessEditIns,
          }
          if(this.processList.length>0){
            if(this.processList[0].id===undefined){
              saveEquipmentCrafts(data).then(response => {
                this.$modal.msgSuccess("新增工艺成功！如果需要继续下个零件的编辑，请继续Enter");
                this.signal2 = true
                // this.routerPage()
                this.loading = false
              })
            }else{
              saveEquipmentCrafts(data).then(response => {
                this.$modal.msgSuccess("修改工艺成功，请及时转生产单！如果需要继续下个零件的编辑，请继续Enter");
                this.signal2 = true
                // this.routerPage()
                this.loading = false
              })
            }
          }
          // this.handleConfirmProfile()
        }
        if(this.signal2 && this.flag2 === false && this.openSave === true){
          this.routerPage()
        }
      }
    },


    routerPage(){
      this.queryParamsBom.bomID = this.$route.query.bomId
      let flag = false
      listBomDetail(this.queryParamsBom).then(response => {
        let List2 = []
        this.middleList = response.data.records.filter(item => item.status !== "1")
        console.log(this.middleList)
        for (let i = 0; i < this.middleList.length; i++) {
          // console.log(this.middleList[i].DetailId)
          // console.log(this.DetailId)
          if(i + 1 < this.middleList.length){
            if (this.middleList[i].id === this.DetailId) {
              List2 = this.middleList[i + 1];
              this.DetailId = this.middleList[i + 1].id
              this.routerList = List2
              this.routerNext()
              break
            }
            this.flag2 = false
            flag =true
          } else {
            this.$modal.msgError("没有下个零件可编辑, 请及时转生产单, 继续回车或手动返回上个页面");
            this.flag2 = true
            this.openSave = false
            flag = false
            break
          }
        }
        // this.routerList = List2
        console.log(List2)
        if(flag) {
          // this.$router.push({
          //   path: '/order/orderbom-edit/productorder/process',
          //   query: {
          //     orderNo: List2.prodOrderNo,
          //     DetailId: List2.id,
          //     moduleNo: List2.moduleNo,
          //     pieceNo: List2.pieceNo,
          //     bomId: this.queryParamsBom.bomID,
          //     quantity: List2.quantity,
          //     workType: '0'
          //   },
          // });
          // this.openSave = false
        }
      });
      // this.$router.push({
      //   path:'/order/orderbom-edit/productorder/process',
      //   query:{
      //     orderNo: row.prodOrderNo,
      //     DetailId: row.id,
      //     moduleNo: row.moduleNo,
      //     pieceNo: row.pieceNo,
      //     bomId:row.bomId,
      //     quantity:row.quantity,
      //     workType: '0'
      //   },
      // });
    },
    /** 跳转页面 */
    routerNext(){
      this.$router.push({
        path: '/order/orderbom-edit/productorder/kkfileKeyProcess',
        query: {
          orderNo: this.routerList.prodOrderNo,
          DetailId: this.routerList.id,
          moduleNo: this.routerList.moduleNo,
          pieceNo: this.routerList.pieceNo,
          bomId: this.queryParamsBom.bomID,
          quantity: this.routerList.quantity,
          status: this.routerList.status,
          workType: '0'
        },
      });
      this.refreshPage()
      this.signal2 = false
      this.openSave = false
    },

    refreshPage(){
      this.getListEquipmentCrafts();
      this.getList();
      this.getListTime();
      this.getSetting();
      this.getListGroup();
      // this.checkIsDrawing()
      // this.getFile();
      // this.getPublicFile();
    },

    /** 跳转到下个零件 */
    routerNextPart(){
      this.queryParamsBom.bomID = this.$route.query.bomId
      listBomDetail(this.queryParamsBom).then(response => {
        let List2 = []
        this.middleList = response.data.records.filter(item => item.status !== "1")
        console.log(this.middleList)
        for (let i = 0; i < this.middleList.length; i++) {
          // console.log(this.middleList[i].DetailId)
          // console.log(this.DetailId)
          if(i + 1 < this.middleList.length){
            if (this.middleList[i].id === this.DetailId) {
              List2 = this.middleList[i + 1];
              this.DetailId = this.middleList[i + 1].id
              this.routerList = List2
              console.log(List2)
              this.routerNext()
              break
            }
          } else {
            this.$modal.msgError("没有下个零件可编辑, 请及时转生产单");
            break
          }
        }
        // this.routerList = List2
        console.log(List2)
      });
    },

    // routerPrevPart() {
    //   this.queryParamsBom.bomID = this.$route.query.bomId;
    //   listBomDetail(this.queryParamsBom).then(response => {
    //     let List2 = [];
    //     this.middleList = response.data.records.filter(item => item.status !== "1");
    //     console.log(this.middleList);
    //     for (let i = 0; i < this.middleList.length; i++) {
    //       if (i > 0) {
    //         if (this.middleList[i].id === this.DetailId) {
    //           console.log(i)
    //           List2 = this.middleList[i - 1];
    //           this.DetailId = this.middleList[i - 1].id;
    //           this.routerList = List2;
    //           console.log(List2);
    //           this.routerNext(); // 假设你有一个routerPrev方法来处理上一个元素
    //           break;
    //         }
    //       } else {
    //         this.$modal.msgError("没有上个零件可编辑");
    //         break;
    //       }
    //     }
    //     console.log(List2);
    //   });
    // },

    /** 跳转到上个零件 */
    routerPrevPart() {
      this.queryParamsBom.bomID = this.$route.query.bomId;
      listBomDetail(this.queryParamsBom).then(response => {
        let List2 = [];
        this.middleList = response.data.records.filter(item => item.status !== "1");
        console.log(this.middleList);

        // 检查DetailId是否与数组中第一个元素的id相匹配
        if (this.middleList.length > 0 && this.middleList[0].id === this.DetailId) {
          this.$modal.msgError("没有上个零件可编辑");
          return; // 直接返回，不再执行后面的循环
        }

        for (let i = 0; i < this.middleList.length; i++) {
          if (this.middleList[i].id === this.DetailId) {
            if (i > 0) {
              // 获取上一个元素
              List2 = this.middleList[i - 1];
              this.DetailId = this.middleList[i - 1].id;
              this.routerList = List2;
              console.log(List2);
              this.routerNext(); // 假设你有一个routerPrev方法来处理上一个元素
            }
            break;
          }
        }
        console.log(List2);
      });
    },


    // 删除
    handleDelete(row) {
      const index = row.index
      const id = row.id
      if(this.processList.length>0){
        if(this.processList[index].id===undefined){
          if (JSON.stringify(this.processList).indexOf(JSON.stringify(row)) !== -1) {
            const index = this.processList.indexOf(row);
            this.processList.splice(index, 1)
          }
        }else{
          delOrderBomProcess({'id':id}).then(response =>{
            this.$modal.msgSuccess("删除成功，请及时保存！！！");
            this.getListTime();
          })
        }
      }
    },
    // 上移
    handleAdjustUp(row,index) {
      console.log(index)
      if (index > 0 && this.processList[index-1].currentSection === 'N') {
        const here = this.processList[index].sort;
        const there =this.processList[index-1].sort;
        this.processList[index].sort =  there;
        this.processList[index-1].sort = here;
        let upDate = this.processList[index - 1];
        this.processList.splice(index - 1, 1);
        this.processList.splice(index, 0, upDate);
      } else if(index > 0 && this.processList[index-1].currentSection !== 'N'){
        this.$modal.msgError("上面工段已完成，不允许向上移动")
      } else{
        this.$message.warning("已经是第一条了！");
        return false;
      }
    },
    // 下移
    handleAdjustDown(item,index) {
      if (index + 1 === this.processList.length) {
        this.$message.warning("已经是最后一条了！");
        return false;
      } else {
        const here = this.processList[index].sort;
        const there =this.processList[index+1].sort;
        this.processList[index].sort =  there;
        this.processList[index+1].sort = here;
        let downDate = this.processList[index + 1];
        this.processList.splice(index + 1, 1);
        this.processList.splice(index, 0, downDate)
      }
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.processManHourIds = selection.map(item => item.id)
      this.multiple = !selection.length
    },
    tableRowClassName({row, rowIndex}) {
      //把每一行的索引放进row
      row.index = rowIndex;
    },
    /** 保存工件工艺按钮 */
    handleSave() {
      this.isDisabled = true
      setTimeout(()=>{
        //点击一次时隔两秒后才能再次点击
        this.isDisabled = false
      },6000)
      const detailId = this.$route.query.DetailId;
      const orderBomProcessEditIns = [];
      let flag = true
      for (let i = 0; i < this.processList.length; i++){
        if (this.processList[i].workHour == null || this.processList[i].code == null){
          flag = false
          this.$modal.msgError("工序或工序工时输入有误，请重试")
          break
        }else{
          flag = true
        }
      }
      this.processList.forEach(function(item){
        orderBomProcessEditIns.push(
          {
            code:item.code,
            name:item.name,
            totalPrice:item.totalPrice + '',
            unitPrice:item.unitPrice,
            workHour:item.workHour + '',
            processManHourId:item.processManHourId,
            detailId: detailId,
            id:item.id,
            sort:item.index+1,
            remark:item.remark
          })
      });
      const data ={
        'type': this.type,
        'bizType':'2',
        'cost':{
          "detailId": detailId,
          "electrodeCost": this.formCost.electrodeCost,
          "managementCost": this.managementCost+'',
          "materialCost": this.materialCost,
          "processingCost": this.formCost.processingCost,
          "toolCost": this.formCost.toolCost,
          "totalCost": this.totalCost+'',
          "issueSize": this.formCost.issueSize,
          "issuedQuantity": this.formCost.issuedQuantity,
        },
        'orderBomProcessEditIns':orderBomProcessEditIns,
      }
      if(flag){
        if(this.processList.length>0){
          if(this.processList[0].id===undefined){
            saveEquipmentCrafts(data).then(response => {
              this.$modal.msgSuccess("新增工艺成功");
              this.$router.go(-1);
              this.openSave = false
            })
          }else{
            saveEquipmentCrafts(data).then(response => {
              this.$modal.msgSuccess("修改工艺成功，请及时转生产单！！");
              this.openSave = false
              this.$router.go(-1);
            })
          }
        }
      }
    },
    /** 保存工件工艺按钮 */
    handleConfirmProfile() {
      this.isDisabled = true
      setTimeout(()=>{
        //点击一次时隔两秒后才能再次点击
        this.isDisabled = false
      },6000)
      const detailId = this.$route.query.DetailId;
      const orderBomProcessEditIns = [];
      this.processList.forEach(function(item){
        orderBomProcessEditIns.push(
          {
            code:item.code,
            name:item.name,
            totalPrice:item.totalPrice + '',
            unitPrice:item.unitPrice,
            workHour:item.workHour + '',
            processManHourId:item.processManHourId,
            detailId: detailId,
            id:item.id,
            sort:item.index+1,
            remark:item.remark
          })
      });
      const data ={
        'type': this.type,
        'bizType':'2',
        'cost':{
          "detailId": detailId,
          "electrodeCost": this.formCost.electrodeCost,
          "managementCost": this.managementCost+'',
          "materialCost": this.materialCost,
          "processingCost": this.formCost.processingCost,
          "toolCost": this.formCost.toolCost,
          "totalCost": this.totalCost+'',
          "issueSize": this.formCost.issueSize,
          "issuedQuantity": this.formCost.issuedQuantity,
        },
        'orderBomProcessEditIns':orderBomProcessEditIns,
      }
      if(this.processList.length>0){
        saveEquipmentCrafts(data).then(response => {
          processRecovery({'orderStatus':'2','ids':[detailId]}).then(res =>{
            this.$modal.msgSuccess("修改工时成功");
            this.$router.go(-1);
          })
        })
      }
    },
    /** 取消按钮 */
    handleCancel() {
      this.$router.go(-1);
    },

    /** 复制其他工件工艺 */
    handleCopy() {
      this.copyData = []
      this.open = true;
      this.label = "选择要复制工艺的工件";
      listChangeBom(this.copyQueryParams).then(response => {
        for (let i = 0;i < response.data.records.length;i++){
          for (let j = 0 ; j <response.data.records[i].bomDetailDtoList.length ; j++){
            this.copyData.push(response.data.records[i].bomDetailDtoList[j])
          }
        }
        // console.log(response.data.records.length)
        this.copyTotal = Number(response.data.total);
      });
    },
    /** 复制工艺按钮 */
    handleCopyProcess() {
      this.processList = this.copyProcessData
      this.open = false
    },
    /** 点击表格行 */
    copyClick(row) {
      const detailId = row.detailId
      listWorktime({'detailId':detailId}).then(response =>{
        this.copyProcessData = response.data.records;
      });
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNo = 1;
      this.getListEquipmentCrafts();
    },
    /** 工时表格合计行 */
    getSummaries(param) {
      const { columns, data } = param;//这里可以看出，自定义函数会传入每一列，以及数据
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '总成本';
          return;
        }else if (index == 5) { //index=5的列进行求和
          //页面分别统计 处理
          const values = data.map(item => Number(item[column.property]));
          if (!values.every(value => isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return prev + curr ;
              } else {
                return prev;
              }
            }, 0);
            //此处结合了方式一的判断处理，实现多种条件处理
            //此处的column.property获取的值对应<el-table-column>中prop对应的字段
            switch(column.property) {
              case "totalPrice":
                this.sums = sums[index].toFixed(2);
                this.formCost.processingCost = this.sums
                return sums[index] = sums[index].toFixed(2)  ;
                break;
            }
          } else {
            sums[index] = ''; //如果列的值有一项不是数字，就显示这个自定义内容
          }
        }else {
          sums[index] = ''
        }
      });
      return sums;//最后返回合计行的数据
    },

    // /** 键盘事件 */
    //  handleKeyDown(e){
    //    let key = null;
    //    if(window.event === undefined){
    //      key = e.keyCode;
    //    } else {
    //      key = window.event.keyCode;
    //    }
    //    if (key === 13 && this.flag === true) {
    //      let flag = true
    //      for (let i = 0; i < this.processList.length; i++){
    //        if (this.processList[i].workHour == null || this.processList[i].code == null){
    //          flag = false
    //          this.$modal.msgError("工序或工序工时输入有误，请重试")
    //          break
    //        }else{
    //          flag = true
    //        }
    //      }
    //      if(flag){
    //        this.handleConfirmProfile()
    //      }
    //    }
    //  },

    /** 变更工艺工段完成单元格禁止编辑 */
    editEvent({ row, rowIndex, column, columnIndex }) {
      if(row.currentSection === 'Y'){
        return false
      }else {
        return true
      }
    },
    /** 变更工时工段完成单元格禁止编辑 */
    editEventTime({ row, rowIndex, column, columnIndex }) {
      if(row.currentSection === 'Y' || row.isCurrentSection === 'Y'){
        return false
      }else {
        return true
      }
    },

    selectRow(event) {
      if (event && event.target) {
        // 获取点击的元素
        const target = event.target;

        // 获取点击的元素所在的单元格
        const clickedCell = target.closest('td');

        if (clickedCell) {
          // 获取点击的列索引
          const columnIndex = Array.from(clickedCell.parentNode.children).indexOf(clickedCell);

          // 获取点击的行索引
          const rowIndex = Array.from(clickedCell.parentNode.parentNode.children).indexOf(clickedCell.parentNode);

          this.currentRowIndex = rowIndex;
          this.currentColumnIndex = columnIndex;

          // 在这里处理选中行和列的逻辑
          // console.log('选中的行索引:', rowIndex);
          // console.log('选中的列索引:', columnIndex);
        }
      }
    },

    // handleEnterKey(){
    //   if (event.key === 'Enter') {
    //     console.log(1)
    //   }
    // },

    moveHighlight(direction) {
      if (this.currentRowIndex === -1) {
        // 如果没有选中行，则默认选中第一行
        this.currentRowIndex = 0;
      } else {
        // 移动选中行的索引，确保在有效范围内
        this.currentRowIndex += direction;
        if (this.currentRowIndex < 0) {
          this.currentRowIndex = 0;
        } else if (this.currentRowIndex >= this.processList.length) {
          this.currentRowIndex = this.processList.length - 1;
        }
      }
      // 手动设置当前选中行
      this.$refs.editableList.setCurrentRow(this.processList[this.currentRowIndex]);
    },

    // 提取文件后缀名
    getSuffix(str) {
      const fileExtension = str.substring(str.lastIndexOf(".") + 1);
      return fileExtension;
    },

    /** 查看客户图档 */
    handleSeeDrawing(row,i) {
      this.threedView = false
      this.twodView = false
      this.officeView = false
      console.log(row)
      let suffix = this.getSuffix(row.url)
      if(suffix === 'prt' || suffix === 'dwg' || suffix === 'svlx' || suffix === 'vsf'){
        if(suffix === 'prt'){
          this.threedView = true
          const url = downloadGlobal.hostUpload + row.url + '.svlx'
          this.url = url
          // const url = global.hostUpload + row.url + '.svlx'
          // this.$router.push({
          //   path:'/camdesign/programme-edit/alreadyCancel',
          //   query:{
          //     url: url,
          //     dispatchOrderNo: row.dispatchOrderNo,
          //     prodOrderNo: row.prodOrderNo,
          //     bomId:row.bomId,
          //     type: i
          //   },
          // });
        }else if(suffix === 'dwg'){
          this.twodView = true
          const url = downloadGlobal.hostUpload + row.url + '.vsf'
          this.url = url
          // const url = global.hostUpload + row.url + '.vsf'
          // this.$router.push({
          //   path:'/camdesign/programme-edit/alreadyStop',
          //   query:{
          //     url: url,
          //     dispatchOrderNo: row.dispatchOrderNo,
          //     prodOrderNo: row.prodOrderNo,
          //     bomId:row.bomId,
          //     type: i
          //   },
          // });
        }
      }else if(suffix === 'stp' || suffix === 'step'){
        const url = downloadGlobal.hostUpload + row.url
        // const url = downloadGlobal.hostUpload + "/draw/H719888/123/123.stp"
        // window.open('http://127.0.0.1:8012/onlinePreview?url='+encodeURIComponent(Base64.encode(url)))
        window.open(downloadGlobal.hostWatch + '/onlinePreview?url='+encodeURIComponent(Base64.encode(url)))
      } else {
        const url = downloadGlobal.hostUpload + row.url
        this.officeView = true
        this.url = downloadGlobal.hostWatch + '/onlinePreview?url='+ encodeURIComponent(Base64.encode(url))
        // const url = global.hostUpload + row.url
        //alert('http://127.0.0.1:8012/onlinePreview?url='+encodeURIComponent(Base64.encode(url)))
        // window.open('http://127.0.0.1:8012/onlinePreview?url='+encodeURIComponent(Base64.encode(url)));
        // window.open('http://127.0.0.1:8012/onlinePreview?url='+encodeURIComponent(Base64.encode(url)));
        // window.open(downloadGlobal.hostWatch + '/onlinePreview?url='+encodeURIComponent(Base64.encode(url)));
        // window.open(global.hostWatch + '/onlinePreview?url='+encodeURIComponent(Base64.encode(url)));
      }
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
    /** 查看客户图档 */
    getFile() {
      this.queryParamsDraw.detailId = this.DetailId
      this.queryParamsDraw.prodOrderNo = this.prodOrderNoDraw
      getDrawingFile(this.queryParamsDraw).then(res =>{
        this.filesData = res.data.records
        this.totalFile = res.data.total
      });
    },
    /** 新增工件图档 */
    handleAddDrawing() {
      this.fileStatus = '0'
      this.filesChange.open = true
    },
    getPublicFile() {
      this.queryParamsDraw.id = this.bomId
      getPublicDrawingFile(this.queryParamsDraw).then(res =>{
        this.publicFilesData = res.data.records
        this.totalPublicFile = res.data.total
      })
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
      formData.append('bomId', this.bomId)
      formData.append('detailId', this.DetailId)
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
    /** 获取图档路径 */
    loaded() {
      if (this.$refs.vueIframe) {
        this.iframeWin = this.$refs.vueIframe.contentWindow;
        // 进行其他操作...
      }
      this.iframeWin.postMessage(this.url,'*');
    },
    // /** 获取图档路径 */
    // loaded2() {
    //   this.iframeWin.postMessage(this.url,'*');
    // },
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

    /** 工艺取消保存按钮 */
    cancelSave(){
      this.openSave = false
      this.flag = false
      this.processList.splice(this.processList.length,0,JSON.parse(JSON.stringify(this.obj)))
    },

    goToInput2(index) {
      let val = index
      let a = index.indexOf('_')
      let c = index.substring(a +1 ,index.length)
      let flag = true
      this.currentRowIndex = index.substring(a+1,index.length)
      this.$refs.editableList.setCurrentRow(this.processList[this.currentRowIndex]);
      index = index.substring(a,index.length)
      // console.log(index)
      // return
      // if(val.indexOf('code') != -1 && this.processList[c].code !== null && this.processList[c].name !== '' && this.processList[c].name !== null){
      if(val.indexOf('code') != -1 && this.processList[c].code !== null){
        // if (this.processListClear.includes(this.processList[c].code)){
        index = 'workHour' + index
        // } else {
        //   index = 'code' + index
        // }

      }else if(val.indexOf('workHour') != -1){
        if(this.processList[c].workHour !== null && this.processList[c].workHour !== '' && this.processList[c].name !== ''){
          if(this.processList[this.processList.length - 1].code !== "QC" && this.processList[this.processList.length - 1].code !== "CK"){
            if(this.processList[this.processList.length - 1].name !== ''){
              this.processList.splice(this.processList.length,0,JSON.parse(JSON.stringify(this.obj)))
            }
          }
          index = 'remark' + index
        } else if(this.processList[c].name == ''){
          index = 'code' + index

          const inputRef = this.$refs[index];
          // 添加高亮效果
          if (inputRef) {
            inputRef.$el.classList.add('highlight');

            // 然后聚焦
            inputRef.focus();

            // 一定时间后取消高亮
            setTimeout(() => {
              inputRef.$el.classList.remove('highlight');
            }, 3000); // 这里的1000表示1秒后取消高亮，可以根据需要调整时间
          }

        }
        // index = 'remark' + index
      }else if(val.indexOf('remark') != -1){
        var b = val.indexOf('_')
        b = val.substring(b + 1, val.length)
        // console.log(b)
        // console.log(this.processList.length-1)
        if((this.processList.length-1) == b){
          // b = 0
          // index = 'code_'+b
          if(this.processList[this.processList.length - 1].code == "QC" || this.processList[this.processList.length - 1].code == "CK"){
            flag = false
            if(this.processList[this.processList.length - 1].name !== ''){
              for (let i = 0;i < this.processList.length;i++){
                // console.log(this.processList[i].workHour)
                if(this.processList[i].workHour == null){
                  this.$modal.msgError("工序或工序工时输入有误，请重试");
                  break
                }
              }
            }
          }
        } else {
          b++
          index = 'code_'+b
        }
      }
      // console.log(index)
      // return
      if (flag){
        this.$refs[index].focus();
      }
      //
      // this.$nextTick(() => {
      // this.$refs['input' + (index + 1)].focus();
      // })
    },
  },
};
</script>

<style>
.highlight {
  border: 2px solid red; /* 自定义高亮样式 */
}
</style>
