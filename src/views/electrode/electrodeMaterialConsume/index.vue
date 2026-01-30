<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="180px">
      <!-- <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择状态" clearable size="small">
          <el-option label="待出" value="0" />
          <el-option label="已出" value="1" />
          <el-option label="料损" value="2" />
        </el-select>
      </el-form-item> -->
      <el-form-item label="电极生产单号" prop="eleDispatchNo">
        <el-input
          v-model="queryParams.eleDispatchNo"
          placeholder="请输入电极生产单号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="电极序号" prop="eleNo">
        <el-input
          v-model="queryParams.eleNo"
          placeholder="请输入电极序号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="模号" prop="moduleNo">
        <el-input
          v-model="queryParams.moduleNo"
          placeholder="请输入模号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item> 
      <el-form-item label="件号" prop="pieceNo">
        <el-input
          v-model="queryParams.pieceNo"
          placeholder="请输入件号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item> 
     <el-form-item label="工件生产单号" prop="orderNo">
        <el-input
          v-model="queryParams.orderNo"
          placeholder="请输入工件生产单号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item> 

      <!-- <el-form-item label="工件版本号" prop="versionNo">
        <el-input
          v-model="queryParams.versionNo"
          placeholder="请输入工件版本号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        /> 
      </el-form-item> -->
      
       <el-form-item label="物料名称" prop="materialName">
        <el-input
          v-model="queryParams.materialName"
          placeholder="请输入物料名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="材质" prop="texture">
        <el-input
          v-model="queryParams.texture"
          placeholder="请输入材质"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <!-- <el-form-item label="材质编码" prop="textureCode">
        <el-input
          v-model="queryParams.textureCode"
          placeholder="请输入材质编码"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item> -->
      <!-- <el-form-item label="rfid" prop="rfid">
        <el-input
          v-model="queryParams.rfid"
          placeholder="请输入rfid"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item> -->
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <!-- <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['jy:electrodeMaterialConsume:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['jy:electrodeMaterialConsume:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['jy:electrodeMaterialConsume:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          :loading="exportLoading"
          @click="handleExport"
          v-hasPermi="['jy:electrodeMaterialConsume:export']"
        >导出</el-button>
      </el-col> -->
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="electrodeMaterialConsumeList" @selection-change="handleSelectionChange">
      <!-- <el-table-column type="selection" width="55" align="center" /> -->
      <!-- <el-table-column label="材质编码" align="center" prop="id" /> -->
      <el-table-column label="状态" align="center" prop="status" >
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status ===0">待出</el-tag>
          <el-tag v-else-if="scope.row.status ===1"  type="warning">已出</el-tag>
          <el-tag v-else-if="scope.row.status ===2" type="success" >料损</el-tag>
          <el-tag v-else type="info">未知</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="电极生产单号" align="center" prop="eleDispatchNo" />
      <el-table-column label="电极序号" align="center" prop="eleNo" />
      <el-table-column label="电极编号" align="center" prop="electrodeBno" />
      <el-table-column label="工件号" align="center" prop="pieceNo" />
      <el-table-column label="模号" align="center" prop="moduleNo" />
      <el-table-column label="工件生产单号" align="center" prop="orderNo" />
      <el-table-column label="工件版本号" align="center" prop="versionNo" />
      <el-table-column label="物料编码" align="center" prop="materialCode" />
      <el-table-column label="物料名称" align="center" prop="materialName" />
      <el-table-column label="长-宽-高" align="center" >
        <template slot-scope="scope">
          {{scope.row.materialLength}}-{{scope.row.materialWidth}}-{{scope.row.materialHeight}}
        </template>
      </el-table-column>
      <el-table-column label="有效高度" align="center" prop="effectiveHeight" />
      <el-table-column label="单位" align="center" prop="materialUnit" />
      <el-table-column label="材质" align="center" prop="texture" />
      <el-table-column label="材质编码" align="center" prop="textureCode" />
      <el-table-column label="密度" align="center" prop="textureDensity" />
      <el-table-column label="出货重量" align="center" prop="outWeight" />
      <el-table-column label="实际用量" align="center" prop="actulWeight" />
      <el-table-column label="损耗重量" align="center" prop="lossWeight" />
      <el-table-column label="损耗率" align="center" prop="lossCent" >
        <template slot-scope="scope">
          {{Number(scope.row.lossCent)}}
        </template>
      </el-table-column>
      <el-table-column label="rfid" align="center" prop="rfid" />

      <el-table-column label="操作" fixed="right"  align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.status===0"
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleOutcome(scope.row)"
          >发料</el-button>
          <!-- <el-button
            v-if="scope.row.status===1"
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleActualcome(scope.row)"
          >实用</el-button> -->
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />
    <!-- 添加或修改电极用料对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="状态">
          <el-radio-group v-model="form.status">
            <el-radio label="1">请选择字典生成</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="物料编码" prop="materialCode">
          <el-input v-model="form.materialCode" placeholder="请输入物料编码" />
        </el-form-item>
        <el-form-item label="物料名称" prop="materialName">
          <el-input v-model="form.materialName" placeholder="请输入物料名称" />
        </el-form-item>
        <el-form-item label="长" prop="materialLength">
          <el-input v-model="form.materialLength" placeholder="请输入长" />
        </el-form-item>
        <el-form-item label="宽" prop="materialWidth">
          <el-input v-model="form.materialWidth" placeholder="请输入宽" />
        </el-form-item>
        <el-form-item label="高" prop="materialHeight">
          <el-input v-model="form.materialHeight" placeholder="请输入高" />
        </el-form-item>
        <el-form-item label="单位" prop="materialUnit">
          <el-input v-model="form.materialUnit" placeholder="请输入单位" />
        </el-form-item>
        <el-form-item label="材质" prop="texture">
          <el-input v-model="form.texture" placeholder="请输入材质" />
        </el-form-item>
        <el-form-item label="材质编码" prop="textureCode">
          <el-input v-model="form.textureCode" placeholder="请输入材质编码" />
        </el-form-item>
        <el-form-item label="密度" prop="textureDensity">
          <el-input v-model="form.textureDensity" placeholder="请输入密度" />
        </el-form-item>
        <el-form-item label="出货重量" prop="outWeight">
          <el-input v-model="form.outWeight" placeholder="请输入出货重量" />
        </el-form-item>
        <el-form-item label="实际用量" prop="actulWeight">
          <el-input v-model="form.actulWeight" placeholder="请输入实际用量" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 发料对话框 -->
    <el-dialog title="发料" :visible.sync="outcome.showMe" width="500px" append-to-body>
      <el-dialog title="选择物料" :visible.sync="outcome.innerShow" width="800px" append-to-body>
        <electrode-materia :textureCode="outcome.textureCode" @doSelectMaterial='doSelectMaterial'></electrode-materia>
      </el-dialog>
      <el-button @click="outcome.innerShow = true" :disabled="outcome.checked.mode === 1">选择物料</el-button>
      <el-form :model="outcome" ref="outcomeFrom" label-width="30%">
        <el-form-item label="物料编码">{{outcome.material.materialCode}}</el-form-item>
        <el-form-item label="工件号">{{outcome.data.pieceNo}}</el-form-item>
        <el-form-item prop="rfid" label="RFID"
          :rules="[ { required: true, message: '请输入RFID', trigger: 'change' },{ pattern: /^\d{10}$/, message: '字段长度必须为10位数字', trigger: ['blur' , 'change']} ]" >
        <el-row>
          <!-- <el-col :span="16"> -->
          <el-input ref="rfidInput" @keyup.enter.native="handleNextInput('materialWeightInput')" v-model="outcome.rfid" @blur="handleRfidInputChange"></el-input>
          <!-- </el-col>
          <el-col :span="8">
          <el-button type="primary" icon="el-icon-edit" circle @click="handlerfidFill"></el-button>
          </el-col> -->
        </el-row>
        </el-form-item>
        <el-form-item
            prop="materialWeight"
            label="发料重量"
            :rules="[
              { required: true, message: '请输入重量', trigger: 'change' }
            ]"
          >
          <el-input ref="materialWeightInput" @keyup.enter.native="handleNextInput('issuingHeightInput')"  v-model="outcome.materialWeight"><template slot="append">{{outcome.data.materialUnit}}</template></el-input>
        </el-form-item>
        <el-form-item label="发料高度" prop="issuingHeight"
          :rules="[
            { required: true, message: '请输入发料高度', trigger: 'change' },
          ]"
        >
          <el-input ref="issuingHeightInput" @keyup.enter.native="handleNextInput('fixtureHeightInput')" v-model="outcome.issuingHeight"></el-input>
        </el-form-item>
        <el-form-item label="治具高度" prop="material.fixtureHeight">
          <el-input ref="fixtureHeightInput"  v-model="outcome.fixtureHeight"></el-input>
        </el-form-item>
        <el-form-item label="有效高度">{{outcome.data.effectiveHeight}}</el-form-item>
      <el-form-item label="RFID类型" prop="rfidType"
      :rules="[
            { required: true, message: '选择RFID类型', trigger: 'change' },
          ]"
        >
          <el-radio-group v-model="outcome.rfidType">
            <el-radio
              v-for="dict in dict.type.rfid_type"
              :key="dict.value"
              :label="dict.value"
               @keyup.enter.native="handleNextInput('rfidType')"
            >{{dict.label}}</el-radio>
          </el-radio-group>
           
      </el-form-item>
        <el-form-item label="图片" >
          <img  src="/static/img/erowa.png" width="110" height="70"  alt="dark"  />
          <img  src="/static/img/3r.png" width="100" height="70"  alt="light" />
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handlePrint">打印</el-button>
        <el-button type="primary" @click="doOutcome" :loading="outcomeLoading">确 定</el-button>
      </div>
    </el-dialog>
    <!--    打印内容-->
    <el-dialog :title="print.title" :visible.sync="print.open" width="640px" append-to-body>
      <div id="printTable" ref="vueDomSaveToImage">
        <div style="display: flex;flex-direction: row;border-width: 1px;border-style: solid;text-align: center;font-size: 1cm;font-weight: bold;font-family: 黑体;color: #0f0f0f">
          <div style="flex: 1;margin: auto">
            <vue-qr
              :text="eleDispatchNo"
              :size="200"
              :logoScale="0.2">
            </vue-qr>
          </div>
          <div style="align-items: center;justify-content:center;padding:10px 0;flex: 1.5;display: flex;flex-direction: column">
            <div style="flex: 1;display:flex; justify-content: center; align-items: center">
              <el-row>
                <span>{{moduleNo}}</span>
              </el-row>
            </div>
            <div style="flex: 1;display:flex; justify-content: center; align-items: center">
              <el-row>
                <span>{{eleNo}}-{{versionNo}}-{{pieceNo}}</span>
              </el-row>
            </div>
            <div style="flex: 1;display:flex; justify-content: center; align-items: center">
              <el-row>
                <span>{{eleDispatchNo}}-{{ suffix }}</span>
              </el-row>
            </div>
          </div>
<!--          <barcode v-bind:value="eleDispatchNo" style="text-align: center" font-size="20px" height="36px" text-align="center">-->
<!--          </barcode>-->
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="bindPrint">确 定</el-button>
        <el-button @click="print.open = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {
    actualElectrodeMaterialConsume,
    outcomeElectrodeMaterialConsume,
    listElectrodeMaterialConsume,
    getElectrodeMaterialConsume,
    delElectrodeMaterialConsume,
    addElectrodeMaterialConsume,
    updateElectrodeMaterialConsume,
    exportElectrodeMaterialConsume,
    getCamElectrodeByProdOrderNoEleNo, outcomeElectrodeConsume
  } from "../../../api/jy/electrodeMaterialConsume";
import electrodeMateria from '../components/electrodeMateria.vue';
import printJS from "print-js";
import VueBarcode from "vue-barcode";
  import VueQr from 'vue-qr'
import {rfidElectrodeUse } from "../../../api/jy/electrodeUse";
  import html2canvas from 'html2canvas';
  import JsPDF from 'jspdf';


  export default {
  components: { electrodeMateria ,'barcode': VueBarcode, VueQr},
  name: "ElectrodeMaterialConsume",
  dicts: ['rfid_type'],
  data() {
    return {
      outcomeLoading:false,
      outcome:{
        checked:{
          flag:false,
          mode:-1,
          rfid:null
        },
        showMe:false,
        innerShow:false,
        textureCode:"",
        data:{
          materialCode:"",
          pieceNo:""
        },
        material:{
          materialCode:""
        },
        materialWeight:"",
        issuingHeight:"",
        rfid:"",
        fixtureHeight:'55',
        rfidType:""
      },
      val:null,
      // 遮罩层
      loading: true,
      // 导出遮罩层
      exportLoading: false,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 电极用料表格数据
      electrodeMaterialConsumeList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      //打印数据
      moduleNo:'',
      pieceNo:'',
      eleNo:'',
      versionNo:'',
      eleDispatchNo:'',
      suffix:'',
      //打印参数
      print:{
        // 是否显示弹出层
        open: false,
        // 弹出层标题
        title: "打印标签",
      },
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        status: null,
        eleNo: null,
        pieceNo: null,
        moduleNo: null,
        orderNo: null,
        eleDispatchNo: null,
        versionNo: null,
        materialCode: null,
        materialName: null,
        materialLength: null,
        materialWidth: null,
        materialHeight: null,
        materialUnit: null,
        texture: null,
        textureCode: null,
        textureDensity: null,
        outWeight: null,
        actulWeight: null,
        lossWeight: null,
        lossCent: null,
        rfid: null,
        issuingHeight:null,
        fixtureHeight:null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      },
      //查询电极编号选中参数
      electrodeNo:'',
      electrodeProdOrderNo:'',
      // 查询参数
      queryParamsEle: {
        pageNo: 1,
        pageSize: 10,
      },
    };
  },
  activated() {
    this.getList();
  },
  created() {
    this.getList();
  },
  methods: {
    /** 通过电极生产单号电极序号查询电极编号，火花位 */
    getEleNo() {
      this.queryParamsEle.electrodeNo = this.electrodeNo
      this.queryParamsEle.electrodeProdOrderNo = this.electrodeProdOrderNo
      getCamElectrodeByProdOrderNoEleNo(this.queryParamsEle).then(res =>{
        this.outcome.data.electrodeBno = res.data.electrodeBno
        this.outcome.data.sparkGap = res.data.sparkGap
      })
    },
    handlerfidFill(){
      let _self = this
      this.$prompt('请输入rfid', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(({ value }) => {
        this.outcome.rfid=value
        this.handleRfidInputChange()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消输入'
        });
      });
    },
    handleRfidInputChange(){
      // this.outcome.material={ materialCode:""}
      this.outcome.checked.flag = false
      if(this.outcome.rfid===null||this.outcome.rfid===""){
        return
      }
      rfidElectrodeUse(this.outcome.rfid).then(resp=>{
        
        this.outcome.checked.rfid = this.outcome.rfid;
        this.outcome.checked.flag = false
        let data = resp.data

        if(data.status==10 ){
          this.outcome.checked.mode = 0
          this.outcome.checked.flag = true
          // this.$nextTick(()=>{   //正确写法
          //     this.$refs.materialWeightInput.focus();
          // })
          return;
        }
        if(data.status==1){
          this.msgError("该携带rfid的物料正在被使用");
          this.outcome.checked.flag = false;
          return;
        }
       /*  
        this.outcome.checked.flag = true
        this.outcome.checked.mode = 1
        this.outcome.material = data */
        // this.$nextTick(()=>{   //正确写法
        //   this.$refs.materialWeightInput.focus();
        // })
      })
    },
    handleNextInput(val){
      this.$nextTick(()=>{
          this.$refs[val].focus();
      })
    },
    doMaterialCheck(val){
      // console.log(val);
      console.log(this.outcome);
      if(Number(this.outcome.issuingHeight - this.outcome.fixtureHeight)<=Number(this.outcome.data.effectiveHeight)){
        this.msgError("发料高度与治具高度之差小于有效高度，无法提交");
        return
      }
    },
    doSelectMaterial(val){
      // this.doMaterialCheck(val);
      if(this.outcome.checked.mode === 1){
        this.msgError("选择物料无效，已复用物料");
        return;
      }
      this.outcome.material = val
      this.outcome.innerShow = false
    },
    handleActualcome(val){

        this.$prompt(`请输入实用数量\(${val.materialUnit}\)`, `${val.materialCode}`, {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /[0-9.]/,
          inputErrorMessage: '请输入数字'
        }).then(({ value }) => {
          val.actulWeight = value
          actualElectrodeMaterialConsume(val).then(resp=>{
            this.$message({
              type: 'success',
              message: '操作成功'
            });
            this.outcome.showMe = false
            this.getList();
          })

        }).catch(() => {
        });
    },
    isEmpty(val){
      if(val===null||val===''||val===undefined){
        return true;
      }
      return false;
    },
    actulOutcome(){

        this.outcome.data.rfid = this.outcome.rfid
        this.outcome.data.materialWeight = this.outcome.materialWeight
        this.outcome.data.materialName = this.outcome.material.materialName
        this.outcome.data.materialCode = this.outcome.material.materialCode
        this.outcome.data.fixtureHeight = this.outcome.fixtureHeight
        this.outcome.data.issuingHeight = this.outcome.issuingHeight
        this.outcome.data.rfidType = this.outcome.rfidType

        outcomeElectrodeMaterialConsume(this.outcome.data).then(resp=>{
          this.$message({
            type: 'success',
            message: '出库成功'
          });
          this.outcome.showMe = false;
          this.getList();
            this.outcomeLoading = false

        }).catch(err=>{
          this.outcomeLoading = false
        })
      
    },
    doOutcome() {

      if(this.outcomeLoading) return
      this.outcomeLoading = true
      this.$refs["outcomeFrom"].validate(valid => {
        if (valid) {
          if(this.outcome.material.materialCode===undefined||this.outcome.material.materialCode===null||this.outcome.material.materialCode===""){
            this.msgError("请选择物料，无法提交");
            this.outcomeLoading = false
            return;
          }
          if(Number(this.outcome.issuingHeight - this.outcome.fixtureHeight)<Number(this.outcome.data.effectiveHeight)){
            this.msgError("发料高度与治具高度之差小于有效高度，无法提交");
            this.outcomeLoading = false

            return
          }
          if(Number(this.outcome.material.materialLength - this.val.materialLength)<2){
            this.msgError("长度之差小于有效值，无法提交");
            this.outcomeLoading = false
            return
          }
          if(Number( this.outcome.material.materialWidth - this.val.materialWidth)<2){
            this.msgError("宽度之差小于有效值，无法提交");
            this.outcomeLoading = false

            return
          }  
          if(this.outcome.checked.flag===false){
            this.msgError("请稍等5s，重新提交");
            this.handleRfidInputChange()
            this.outcomeLoading = false

            return
          }
          this.actulOutcome();
        }else{
          this.outcomeLoading = false
        }
      })
    },
    handleOutcome(val){
      console.log(val)
      this.outcomeLoading = false
      this.outcome.rfid = ''
      this.outcome.materialWeight = ''
      this.outcome.issuingHeight = ''
      this.outcome.material = {"materialCode":''}
      this.outcome.textureCode = val.textureCode
      this.outcome.data = val
      this.outcome.showMe = true
      this.moduleNo = val.moduleNo
      this.pieceNo = val.pieceNo
      this.eleNo = val.eleNo
      this.versionNo = val.versionNo
      this.eleDispatchNo = val.eleDispatchNo
      this.val = val
      this.electrodeNo = val.eleNo
      this.suffix = val.suffix
      
      this.electrodeProdOrderNo = val.eleDispatchNo
      this.getEleNo()
      // this.$refs.rfidInput.focus();
      this.$nextTick(()=>{   //正确写法
          this.$refs.rfidInput.focus();
      })
    },
    /** 查询电极用料列表 */
    getList() {
      this.loading = true;
      this.queryParams.status = 0
      listElectrodeMaterialConsume(this.queryParams).then(response => {
        this.electrodeMaterialConsumeList = response.rows;
        
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        status: 0,
        eleNo: null,
        pieceNo: null,
        moduleNo: null,
        orderNo: null,
        eleDispatchNo: null,
        versionNo: null,
        materialCode: null,
        materialName: null,
        materialLength: null,
        materialWidth: null,
        materialHeight: null,
        materialUnit: null,
        texture: null,
        textureCode: null,
        textureDensity: null,
        outWeight: null,
        actulWeight: null,
        lossWeight: null,
        lossCent: null,
        rfid: null,
        updateTime: null
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加电极用料";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getElectrodeMaterialConsume(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改电极用料";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateElectrodeMaterialConsume(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addElectrodeMaterialConsume(this.form).then(response => {
              this.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$confirm('是否确认删除电极用料编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delElectrodeMaterialConsume(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有电极用料数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.exportLoading = true;
          return exportElectrodeMaterialConsume(queryParams);
        }).then(response => {
          this.download(response.msg);
          this.exportLoading = false;
        }).catch(() => {});
    },
    /** 打印 */
    handlePrint() {
      this.print.open = true

    },
    bindPrint() {
      // this.$nextTick(()=>{
      //   html2canvas(this.$refs.vueDomSaveToImage).then(res=>{
      //     let imgUrl = res.toDataURL('image/png')
      //     // console.log('图片临时地址',imgUrl)
      //     let aLink = document.createElement('a');
      //     aLink.href = imgUrl;
      //     aLink.download = new Date().toLocaleString() + '.png';	//导出文件名，这里以时间命名
      //     document.body.appendChild(aLink);
      //     // 模拟a标签点击事件
      //     aLink.click()
      //     // 事件已经执行，删除本次操作创建的a标签对象
      //     document.body.removeChild(aLink)
      //     // // 以服务的方式调用的 Loading 需要异步关闭
      //   })
      // })

        html2canvas(this.$refs.vueDomSaveToImage, {
          // allowTaint: true
          useCORS:true, //看情况选用上面还是下面的，
        }).then(function (canvas) {
          let url = canvas.toDataURL()
          let contentWidth = canvas.width
          let contentHeight = canvas.height
          let pageHeight = contentWidth / 592.28 * 841.89
          let leftHeight = contentHeight
          let position = 0
          let imgWidth = 595.28
          let imgHeight = 592.28 / contentWidth * contentHeight
          let pageData = canvas.toDataURL('image/jpeg', 1.0)
          let PDF = new JsPDF('', 'pt', 'a4')
          if (leftHeight < pageHeight) {
            PDF.addImage(pageData, 'JPEG', 0, 0, imgWidth, imgHeight)
          } else {
            while (leftHeight > 0) {
              PDF.addImage(pageData, 'JPEG', 0, position, imgWidth, imgHeight)
              leftHeight -= pageHeight
              position -= 841.89
              if (leftHeight > 0) {
                PDF.addPage()
              }
            }
          }
          // window.print(PDF)
          // PDF.save( '标签'+ '.pdf')
          // const style = '@page {margin:0 10mm};' //可选-打印时去掉眉页眉尾
          printJS({
            printable: url, // 标签元素id
            type: 'image',
            header: '',
            targetStyles: ['*'],
          })
        })
    },
  }
};
</script>
