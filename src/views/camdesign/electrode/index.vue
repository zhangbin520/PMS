<template>
  <div class="app-container">
    <div slot="header">
      <el-form :model="queryParams" ref="queryForm" v-show="showSearch" :inline="true" label-width="100px">
        <el-form-item label="工件生产单号" prop="workpieceProdOrderNo">
          <el-input
            v-model="queryParams.workpieceProdOrderNo"
            placeholder="请输入工件生产单号"
            clearable
            size="small"
            style="width: 220px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="电极生产单号" prop="electrodeProdOrderNo">
          <el-input
            v-model="queryParams.electrodeProdOrderNo"
            placeholder="请输入电极生产单号"
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
        <el-form-item label="件号" prop="workpiece">
          <el-input
            v-model="queryParams.workpiece"
            placeholder="请输入件号"
            clearable
            size="small"
            style="width: 220px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="工件版本" prop="versionNo">
          <el-input
            v-model="queryParams.versionNo"
            placeholder="请输入工件版本"
            clearable
            size="small"
            style="width: 220px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item style="padding-left: 55px">
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
          <el-button size="mini" type="primary" icon="el-icon-folder-add" @click="handleImport">导入电极明细</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-row>
      <el-col :span="18"><i class="el-icon-timer" style="margin-bottom: 10px">电极BOM明细</i></el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getListEledetail"></right-toolbar>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-table v-loading="loading" :data="eleDetailList" @selection-change="handleSelectionChange" border :row-class-name="tableRowClassName"
                  max-height="850px" highlight-current-row>
          <el-table-column type="index" width="50" align="center" />
          <el-table-column type="selection" width="50" align="center" :selectable="selected"/>
          <el-table-column label="操作" align="center" width="190px" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-tooltip class="item" effect="dark" content="复用" placement="top-start" >
              <el-button
                circle
                type="primary"
                icon="el-icon-printer"
                @click="reuse(scope.row)"
              ></el-button></el-tooltip>
              <el-tooltip class="item" effect="dark" content="编辑" placement="top-start"  v-if="scope.row.status == 0">
              <el-button
                circle
                type="primary"
                icon="el-icon-edit"
                @click="handleUpdate(scope.row)"
              ></el-button></el-tooltip>
              <el-tooltip class="item" effect="dark" content="转生产单" placement="top-start" v-if="scope.row.status == 0">
              <el-button
                circle
                type="success"
                icon="el-icon-set-up"
                @click="handleTurn(scope.row)"
              ></el-button></el-tooltip>
              <el-tooltip class="item" effect="dark" content="设置工艺" placement="top-start"  v-if="scope.row.status == 0">
              <el-button
                circle
                type="primary"
                icon="el-icon-monitor"
                @click="setupProcess(scope.row)"
              ></el-button></el-tooltip>
              <el-tooltip class="item" effect="dark" content="上传3D图档" placement="top-start">
                <el-button
                  circle
                  type="primary"
                  icon="el-icon-upload2"
                  @click="uploadFile(scope.row)"
                ></el-button></el-tooltip>
              <el-tooltip class="item" effect="dark" content="取消" placement="top-start"  v-if="scope.row.status == 1">
              <el-button
                circle
                type="danger"
                icon="el-icon-close"
                @click="handleCancel(scope.row)"
              ></el-button></el-tooltip>
            </template>
          </el-table-column>
          <el-table-column label="状态" align="center" key="status" prop="status" width="93">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.status == '1'" type="success">已转生产单</el-tag>
              <el-tag v-if="scope.row.status == '0'" type="danger">未转生产单</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="工件生产单号" align="center" key="workpieceProdOrderNo" prop="workpieceProdOrderNo" width="110px" :show-overflow-tooltip="true"/>
          <el-table-column label="电极生产单号" align="center" key="electrodeProdOrderNo" prop="electrodeProdOrderNo" width="149px" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <p v-if="scope.row.status == '1'">{{scope.row.electrodeProdOrderNo}}</p>
              <p v-if="scope.row.status == '0'"></p>
            </template>
          </el-table-column>
          <el-table-column label="电极编号" align="center" key="electrodeBno" prop="electrodeBno" />
          <el-table-column label="电极序号" align="center" key="electrodeNo" prop="electrodeNo" />
          <el-table-column label="模号" align="center" key="moduleNo" prop="moduleNo" width="100px" />
          <el-table-column label="件号" align="center" key="workpiece" prop="workpiece"  width="100px"/>
          <el-table-column label="工件版本" align="center" key="versionNo" prop="versionNo" />
          <el-table-column label="需求日期" align="center" key="demandDate" prop="demandDate" width="100px" />
          <el-table-column label="需求原因" align="center" key="demandReasons" prop="demandReasons" />
          <el-table-column label="电极材质" align="center" key="electrodeMaterial" prop="electrodeMaterial"  />
          <el-table-column label="电极长度" align="center" key="electrodeLength" prop="electrodeLength" />
          <el-table-column label="电极宽度" align="center" key="electrodeWidth" prop="electrodeWidth"  />
          <el-table-column label="电极高度" align="center" key="electrodeHeight" prop="electrodeHeight"  />
          <el-table-column label="电极有效高度" align="center" key="effectiveHeight" prop="effectiveHeight"  />
          <el-table-column label="发包数量" align="center" key="quantity" prop="quantity" />
          <el-table-column label="电极最小备料尺寸" align="center" key="minStockSize" prop="minStockSize"  />
          <el-table-column label="电极类型" align="center" key="electrodeType" prop="electrodeType" />
          <el-table-column label="工件类型" align="center" key="workpieceTypeName" prop="workpieceTypeName" />
          <el-table-column label="加工者确认" align="center" key="processor" prop="processor" />
          <el-table-column label="拆电极人员" align="center" key="removeTheElectrode" prop="removeTheElectrode" />
          <el-table-column label="备注" align="center" key="remark" prop="remark"  />
        </el-table>
        <pagination
          v-show="total>0"
          :total="total"
          :page.sync="queryParams.pageNo"
          :limit.sync="queryParams.pageSize"
          @pagination="getListEledetail"
        />
        <div align="center" style="margin-top: 10px">
          <el-row>
            <el-button
              size="mini"
              round
              type="primary"
              icon="el-icon-check"
              @click="handleAdd"
            >新增工件</el-button>
            <el-button
              size="mini"
              round
              type="primary"
              icon="el-icon-d-arrow-left"
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
              type="info"
              icon="el-icon-document-copy"
              @click="handleImport"
            >导入电火花加工信息</el-button>
          </el-row>
        </div>
      </el-col>
    </el-row>

    <!-- 新增电极BOM对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="125px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="工件生产单号" prop="workpieceProdOrderNo">
              <el-input v-model="form.workpieceProdOrderNo" placeholder="" @change="selectContactProcess"/>
            </el-form-item>
            <el-form-item label="工件号" prop="workpiece">
              <el-input v-model="form.workpiece" placeholder="" />
            </el-form-item>
            <el-form-item label="EDM所在工序" prop="edmNo">
              <el-button type="text" @click="checkEdmNo">选择工艺中的EDM工序</el-button>
            </el-form-item>
            <el-form-item label="电极数量" prop="quantity">
              <el-input v-model="form.quantity" placeholder="" />
            </el-form-item>
            <el-form-item label="电极长度" prop="electrodeLength">
              <el-input v-model="form.electrodeLength" placeholder="" />
            </el-form-item>
            <el-form-item label="电极宽度" prop="electrodeWidth">
              <el-input v-model="form.electrodeWidth" placeholder="" />
            </el-form-item>
            <el-form-item label="电极高度" prop="electrodeHeight">
              <el-input v-model="form.electrodeHeight" placeholder="" />
            </el-form-item>
            <el-form-item label="电极类型" prop="electrodeType" >
              <el-select v-model="form.electrodeType" placeholder="请选择电极精度" style="width: 100%">
                <el-option
                  v-for="dict in dict.type.electrode_type"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="拆电极人员" prop="removeTheElectrode">
              <el-input v-model="form.removeTheElectrode"  placeholder="" disabled/>
            </el-form-item>
            <el-form-item label="加工者确认" prop="processor">
              <el-input v-model="form.processor"  placeholder="" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="工件模号" prop="moduleNo">
              <el-input v-model="form.moduleNo" placeholder="" />
            </el-form-item>
            <el-form-item label="电极编号" prop="electrodeBno">
              <el-input v-model="form.electrodeBno" placeholder="" :disabled="true" />
            </el-form-item>
            <el-form-item label="版本" prop="versionNo">
              <el-input v-model="form.versionNo" placeholder="" />
            </el-form-item>
            <el-form-item label="电极材质" prop="electrodeMaterial">
              <el-select v-model="form.electrodeMaterial" placeholder="请选择" style="width: 100%">
                <el-option
                  v-for="item in eleorderForquality"
                  :key="item.code"
                  :label="item.code"
                  :value="item.code"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="电极有效高度" prop="effectiveHeight">
              <el-input v-model="form.effectiveHeight"  placeholder="" />
            </el-form-item>
            <el-form-item label="电极最小备料尺寸" prop="minStockSize">
              <el-input v-model="form.minStockSize" placeholder="" />
            </el-form-item>
            <el-form-item label="工件类型" prop="workpieceTypeId">
              <el-select v-model="form.workpieceTypeId" placeholder="请选择工件类型" style="width: 100%">
                <el-option
                  v-for="item in workpieceFororder"
                  :key="item.id"
                  :label="item.typeName"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="需求日期" prop="demandDate">
              <el-date-picker v-model="form.demandDate" type="date" placeholder="选择日期" value-format="yyyy-MM-dd" style="width: 100%"/>
            </el-form-item>
            <el-form-item label="需求原因" prop="demandReasons">
              <el-input v-model="form.demandReasons" placeholder="" />
            </el-form-item>
            <el-form-item label="备注" prop="remark">
              <el-input v-model="form.remark" type="textarea" placeholder="" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="open = false">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 电极明细导入对话框 -->
    <el-dialog :title="upload.title" :visible.sync="upload.open" width="400px" append-to-body>
      <el-upload
        ref="upload"
        :limit="1"
        accept=".xlsx, .xls"
        :headers="upload.headers"
        :action="upload.url + '?bizType=3'"
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
    <!-- 选择工艺中EDM工序对话框 -->
    <el-dialog :title="process.title" :visible.sync="process.open" width="800px" append-to-body>
      <el-table :data="processData" v-loading="loading" border @selection-change="handleSelectionChangeProcess">
        <el-table-column type="selection" width="50" :selectable="selectedProcess"></el-table-column>
        <el-table-column prop="code" align="center" label="工序名称"></el-table-column>
        <el-table-column prop="workHour" align="center" label="工时"></el-table-column>
        <el-table-column prop="unitPrice" align="center" label="单价"></el-table-column>
        <el-table-column prop="totalPrice" align="center" label="总价">
          <template slot-scope="scope">
            {{ (scope.row.totalPrice = scope.row.workHour *scope.row.unitPrice) | keepTwoNum}}
          </template>
        </el-table-column>
        <el-table-column prop="remark" align="center" label="备注"></el-table-column>
      </el-table>
      <pagination
        v-show="totalProcess>0"
        :total="totalProcess"
        style="text-align: center"
        :page.sync="queryParamsProcess.pageNo"
        :limit.sync="queryParamsProcess.pageSize"
        @pagination="getListProcess"
      />
      <div slot="footer" class="dialog-footer">
        <el-button @click="process.open = false">取 消</el-button>
      </div>
    </el-dialog>
    <!--上传电极3D图档对话框-->
    <el-dialog v-el-drag-dialog :title="electrode.title" :visible.sync="electrode.open" width="400px" append-to-body>
      <el-form ref="formElectrode" :model="formElectrode"  label-width="100px">
        <el-form-item label="文件类型" prop="code">
          <el-select v-model="formElectrode.camFileId" filterable placeholder="请选择">
            <el-option
              v-for="item in optionsFileName"
              :key="item.id"
              :label="item.fileType"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="上传文件">
          <template slot-scope="scope">
            <el-upload
              class="pop-upload"
              ref="upload"
              action=""
              :file-list="fileList"
              :auto-upload="false"
              :multiple="true"
              :on-change="handleChange"
              :on-remove="handleRemove"
              :show-file-list="true"
            >
              <i class="el-icon-upload" slot="trigger">上传</i>
              <el-button style="margin-left: 10px;" size="medium" type="text" @click="submitUpload(scope.row)">确认上传</el-button>
            </el-upload>
          </template>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitElectrode">保 存</el-button>
        <el-button @click="electrode.open = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {listElectrodeBom, addElectrodeBom, updateElectrodeBom, deleteElectrodeBom, electrodeBomTurn, alreadyCancel, importTemplate, getOrderBomProcessByProdOrderNoPage} from "../../../api/camdesign/electrode"
  import {getToken} from "../../../utils/auth";
  import {getUserProfile} from "../../../api/system/user";
  import {listQuality} from "../../../api/system/quality";
  import {getProcessWorkpieceType} from "../../../api/system/process";
  import global from '../../../store/global.js'
  import {editProcessFile, getFileTypePage, getProcess3DFile, uploadFile,reUseElectrodeTake} from "../../../api/camdesign/programm";

  export default {
    name: "electrode",
    dicts: ['sys_normal_disable','electrode_type'],
    filters: {
      keepTwoNum(value) {
        value = Number(value);
        return value.toFixed(2)
      },
    },
    data() {
      return {
        // 遮罩层
        loading: true,
        // 总条数
        total: 0,
        totalProcess:0,
        // 非多个禁用
        multiple: true,
        // 显示搜索条件
        showSearch: true,
        // 表格树数据
        eleDetailList: [],
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        // 订单BOM表单参数
        form: {},
        //电极bom材质数据
        eleorderForquality:[],
        //选中数组
        ProcessManHourId:[],
        code:[],
        BizType:[],
        ProcessManName:[],
        Ids:[],
        //编辑表格传参
        Id:[],
        ElectrodeProdOrderNo:[],
        //加工者数据
        investorForperson:'',
        //工件类型
        workpieceFororder:'',
        //工艺列表数据
        process:{
          title:'',
          open:false,
        },
        //电极3D图档表单数据
        formElectrode:{},
        processData:[],
        //工件工艺列表选择数据
        prodOrderNo:'',
        processSort:'',
        //电极3D图档弹窗
        electrode:{
          title:'',
          open:false,
        },
        // 文件上传
        fileList: [],
        //3D上传选中参数
        uploadProdOrderNo:'',
        uploadEleProdOrderNo:'',
        uploadSort:'',
        uploadCode:'',
        uploadId:'',
        fileSort:'',
        camNcDrawIds:'',
        fileName:'',
        fileUrl:'',
        fileFullPath:'',
        //上传文件类型名数据
        optionsFileName:[],
        //上传下载新ip增加参数
        personNo:'',
        // 查询参数
        queryParams: {
          pageNo: 1,
          pageSize: 10,
        },
        // 工艺列表查询参数
        queryParamsProcess: {
          pageNo: 1,
          pageSize: 10,
          prodOrderNo:'',
        },
        // 工艺列表查询参数
        queryParamsFiles: {
          pageNo: 1,
          pageSize: 50,
        },
        // 查询参数
        queryParamsUse: {
          pageNo: 1,
          pageSize: 100000,
        },
        //上传参数
        upload: {
          // 是否显示弹出层（用户导入）
          open: false,
          // 弹出层标题（用户导入）
          title: "",
          // 是否禁用上传
          isUploading: false,
          // 是否更新已经存在的用户数据
          updateSupport: 0,
          // 设置上传的请求头部
          headers: { Authorization: "Bearer " + getToken() },
          // 上传的地址
          url: process.env.VUE_APP_BASE_API +  "/cam/electrodeBom/importElectrodeBom",
        },
        //电极BOM表单校验
        rules: {
          electrodeMaterial: [
            { required: true, message: "电极材质不能为空", trigger: "blur" },
            { min: 2, max: 10, message: '电极材质长度必须介于 2 和 10 之间', trigger: 'blur' }
          ],
          workpieceProdOrderNo: [
            { required: true, message: "工件生产单号不能为空", trigger: "blur" },
          ],
          workpiece: [
            { required: true, message: "工件号不能为空", trigger: "blur" },
          ],
          edmNo: [
            { required: true, message: "EDM工序不能为空", trigger: "blur" },
          ],
          quantity: [
            { required: true, message: "电极数量不能为空", trigger: "blur" },
          ],
          electrodeLength: [
            { required: true, message: "电极长度不能为空", trigger: "blur" },
          ],
          electrodeWidth: [
            { required: true, message: "电极宽度不能为空", trigger: "blur" },
          ],
          electrodeHeight: [
            { required: true, message: "电极高度不能为空", trigger: "blur" },
          ],
          electrodeType: [
            { required: true, message: "电极类型不能为空", trigger: "blur" },
          ],
          processor: [
            { required: true, message: "加工者不能为空", trigger: "blur" },
          ],
          versionNo: [
            { required: true, message: "版本不能为空", trigger: "blur" },
          ],
          effectiveHeight: [
            { required: true, message: "电极有效高度不能为空", trigger: "blur" },
          ],
          minStockSize: [
            { required: true, message: "电极最小备料尺寸不能为空", trigger: "blur" },
          ],
          moduleNo: [
            { required: true, message: "工件模号不能为空", trigger: "blur" },
          ],
          demandDate: [
            { required: true, message: "需求日期不能为空", trigger: "blur" },
          ],
          demandReasons: [
            { required: true, message: "需求原因不能为空", trigger: "blur" },
          ],
          workpieceTypeId: [
            { required: true, message: "工件类型不能为空", trigger: "blur" },
          ],
        },
      };
    },
    created(){
      this.getListEledetail();
      this.getListMaterial();
      this.getListUser();
      this.getSetting();
    },
    methods: {
/**  复用 */
      reuse(row){
         
      this.$confirm('确定要复用该电极吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        reUseElectrodeTake(row).then(response => {
          const uu  = response.data;
        });
        this.$store.dispatch('LogOut').then(() => {
          location.href = '/index';
        })
      }).catch(() => {});
        


      },
      /** 分页查询BOM明细列表 */
      getListEledetail() {
        this.loading = true;
        listElectrodeBom(this.queryParams).then(response => {
          this.eleDetailList = response.data.records;
          this.total = Number(response.data.total);
          this.loading = false;
        });
      },
      /** 查询材质配置列表 */
      getListMaterial() {
        this.loading = true;
        listQuality(this.queryParamsUse).then(response => {
          let arr = response.data.records.filter(item => {
            return item.type === '1'
          })
          this.eleorderForquality = arr
        });
      },
      /** 查询加工者信息 */
      getListUser() {
        getUserProfile().then(response => {
          this.investorForperson = response.data.userName
        });
      },
      /** 查询工件类型 */
      getSetting() {
        getProcessWorkpieceType(this.queryParamsUse).then(response => {
          this.workpieceFororder = response.data.records;
        });
      },
      /** 查看工艺列表 */
      getListProcess() {
        this.queryParamsProcess.prodOrderNo = this.prodOrderNo
        getOrderBomProcessByProdOrderNoPage(JSON.stringify(this.queryParamsProcess)).then(response =>{
          this.processData = response.data.records;
          this.totalProcess = Number(response.data.total)
        })
      },
      /** 分页查询文件类型 */
      getListFiles() {
        getFileTypePage(this.queryParamsFiles).then(res =>{
          let arr = res.data.records.filter((item,index) => {
            return item.fileCode === 'Elec3D'
          })
          this.optionsFileName = arr;
        })
      },
      /** 分页查询电极3D文档 */
      getListProcess3DFile() {
        this.queryParams.code = this.uploadCode
        this.queryParams.prodOrderNo = this.uploadEleProdOrderNo
        this.queryParams.sort = this.uploadSort
        getProcess3DFile(this.queryParams).then(res =>{
          this.uploadId = res.data.id
        })
      },
      // 电极BOM明细表单重置
      reset() {
        this.form = {
          workpieceProdOrderNo: undefined,
          workpiece: undefined,
          moduleNo: undefined,
        };
        this.resetForm("form");
      },
      // 多选框选中数据
      handleSelectionChange(selection) {
        this.Ids = selection.map(item => item.id);
        this.code = selection.map(item => item.electrodeNo);
        this.multiple = !selection.length;
      },
      // 工艺列表多选框选中数据
      handleSelectionChangeProcess(selection) {
        this.processSort = selection.map(item => item.sort).join('');
        this.form.edmNo = this.processSort;
        this.form.code = selection.map(item => item.code).join('');
        this.multiple = !selection.length;
      },
      /** 搜索按钮操作 */
      handleQuery() {
        this.queryParams.pageNo = 1;
        this.getListEledetail();
      },
      /** 转生产单按钮 */
      handleTurn(row) {
        const ids = row.id
        electrodeBomTurn({'ids':[ids],'flag':'0'}).then(response => {
          this.$modal.msgSuccess("转生产单成功");
          this.getListEledetail();
        })
      },
      /** 批量转生产单 */
      handleTurnMany() {
        const ids = this.Ids
        electrodeBomTurn({'ids':ids,'flag':'0'}).then(response => {
          this.$modal.msgSuccess("批量转生产单成功");
          this.getListEledetail();
        })
      },
      /** 新增工件按钮 */
      handleAdd() {
        this.reset();
        this.open = true;
        this.title = "新增工件";
        this.form.removeTheElectrode = this.investorForperson;
      },
      /** 编辑BOM明细按钮 */
      handleUpdate(row) {
        this.reset();
        const arr = []
        listElectrodeBom({'status':'0'}).then(response => {
          response.data.records.forEach(function (item) {
            arr.push({
              workpieceProdOrderNo:item.workpieceProdOrderNo,
              workpiece:item.workpiece,
              quantity:item.quantity,
              electrodeLength:item.electrodeLength,
              electrodeHeight:item.electrodeHeight,
              electrodeType:item.electrodeType,
              moduleNo:item.moduleNo,
              electrodeNo:item.electrodeNo,
              versionNo:item.versionNo,
              electrodeMaterial:item.electrodeMaterial,
              electrodeWidth:item.electrodeWidth,
              minStockSize:item.minStockSize,
              id:item.id,
              electrodeProdOrderNo:item.electrodeProdOrderNo,
              effectiveHeight:item.effectiveHeight,
              removeTheElectrode:item.removeTheElectrode,
              processor:item.processor,
              demandReasons:item.demandReasons,
              demandDate:item.demandDate,
              remark:item.remark
            })
          })
          this.form = arr[0];
          this.open = true;
          this.title = "编辑工件";
        });
      },
      /** 删除电极BOM明细按钮 */
      handleDelete() {
        const ids = this.Ids ;
        const electrodeNo = this.code;
        this.$modal.confirm('是否确认删除电极序号为"' +electrodeNo + '"的数据项？').then(function() {
          return deleteElectrodeBom({'ids':ids,'flag':'1'});
        }).then(() => {
          this.getListEledetail();
          this.$modal.msgSuccess("删除成功");
        }).catch(() => {});
      },
      /** 设置工艺 */
      setupProcess(row) {
        this.$router.push({
          path:'/camdesign/electrode-edit/eleProcess',
          query:{
            eleBomId: row.id,
            electrodeProdOrderNo: row.electrodeProdOrderNo,
            electrodeNo: row.electrodeBno,
          },
        });
      },
      /** 取消按钮 */
      handleCancel(row) {
        const ids = row.id
        alreadyCancel({'flag':'2','ids':[ids]}).then(response =>{
          this.$modal.msgSuccess("取消成功");
          this.getListEledetail();
        })
      },
      /** 多选框禁选 */
      selected(row,index){
        if (row.status == 1) {
          return false //不可勾选
        } else {
          return true; //可勾选
        }
      },
      /** 工艺列表多选框禁选 */
      selectedProcess(row,index){
        if (row.operationCategory === 'EDM') {
          return true //不可勾选
        } else {
          return false; //可勾选
        }
      },
      /** 选择工艺中得EDM工序 */
      checkEdmNo() {
        if(this.prodOrderNo === '') {
          this.process.open = false
          this.$modal.msgError("请填写工件生产单号")
        } else {
          this.process.title = "选择工艺中的EDM工序"
          this.process.open = true
          this.getListProcess();
        }
      },
      /** 根据生产单号选择EDM所在工序 */
      selectContactProcess(val) {
        this.prodOrderNo = val
      },
      /** 新增工件提交按钮 */
      submitForm: function() {
        this.$refs["form"].validate(valid => {
          if (valid) {
            if (this.form.id != undefined) {
              this.form.bizType = '3'
              this.form.processManHourId = this.ProcessManHourId
              this.form.processManName = this.ProcessManName
              updateElectrodeBom(this.form).then(response => {
                this.$modal.msgSuccess("修改成功");
                this.open = false;
                this.getListEledetail();
              });
            } else {
              this.form.bizType = '3'
              addElectrodeBom(this.form).then(response => {
                this.$modal.msgSuccess("新增成功");
                this.open = false;
                this.getListEledetail();
              });
            }
          }else{
            this.$modal.msgError("表单验证失败,请检查是否输入正确");
          }
        });
      },
      /** 导入订单BOM按钮操作 */
      handleImport() {
        this.upload.title = "电极明细导入";
        this.upload.open = true;
      },
      /** 下载模板操作 */
      importTemplate() {
        window.open(global.host+"电极人工导入.xlsx")
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
        this.getListEledetail();
      },
      // 提交上传文件
      submitFileForm() {
        this.$refs.upload.submit();
      },
      /** 上传电极3D图档 */
      uploadFile(row) {
        this.electrode.title = "上传电极3D图档"
        this.electrode.open = true
        this.uploadEleProdOrderNo = row.electrodeProdOrderNo
        this.uploadProdOrderNo = row.workpieceProdOrderNo
        this.uploadSort = row.edmNo
        this.uploadCode = row.code
        this.fileSort = row.index+1
        this.getListFiles()
        this.getListProcess3DFile()
      },
      tableRowClassName({row, rowIndex}) {
        //把每一行的索引放进row
        row.index = rowIndex;
      },
      /** 电极3D上传 */
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
        formData.append('code', 'EDM')
        formData.append('prodOrderNo', this.uploadProdOrderNo)
        formData.append('sort', this.uploadSort)
        formData.append('fileSort',this.fileSort)
        formData.append('userName',this.investorForperson)
        //自定义的接口也可以用ajax或者自己封装的接口
        uploadFile(formData).then(res => {
          if (res.code === 200) {
            this.$message.success('上传成功');
            this.camNcDrawIds = res.camNcDrawIds
            this.fileName = res.fileName
            this.fileUrl = res.fileUrl
            this.fileFullPath = res.fileFullPath
          } else {
            this.$message.error('上传失败');
          }
          //清空fileList
          this.fileList = []
        })
      },
      /** 上传电极3D图档保存按钮 */
      submitElectrode: function() {
        this.$refs["formElectrode"].validate(valid => {
          this.formElectrode.prodOrderNo = this.uploadProdOrderNo
          this.formElectrode.eleProdOrderNo = this.uploadEleProdOrderNo
          this.formElectrode.Sort = this.uploadSort
          this.formElectrode.code = this.uploadCode
          this.formElectrode.camNcDrawIds = this.camNcDrawIds
          this.formElectrode.fileName = this.fileName
          this.formElectrode.fileUrl = this.fileUrl
          this.formElectrode.fileFullPath = this.fileFullPath
          if(this.formElectrode.camNcDrawIds === '' || this.formElectrode.camNcDrawIds === undefined) {
            this.$modal.msgError('选择文件未确认上传');
          }else {
            if(this.formElectrode.id === ''){
              editProcessFile([this.formElectrode]).then(response =>{
                this.$modal.msgSuccess("电极3D图档保存成功");
                this.electrode.open = false;
                this.getListEledetail();
              })
            }else{
              this.formElectrode.id = this.uploadId
              editProcessFile([this.formElectrode]).then(response =>{
                this.$modal.msgSuccess("电极3D图档修改成功");
                this.electrode.open = false;
                this.getListEledetail();
              })
            }
          }
        });
      },
    }
  };
</script>

