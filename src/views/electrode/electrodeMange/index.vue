<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择状态" clearable size="small">
          <el-option label="报废" value="-1" />
          <el-option label="在库" value="0" />
          <el-option label="待出库" value="1" />
          <el-option label="已出库" value="2" />
          <el-option label="已解绑" value="5" />
        </el-select>
      </el-form-item>
      <el-form-item label="位置" prop="position">
        <el-input
          v-model="queryParams.position"
          placeholder="请输入位置"
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
      <el-form-item label="工件号" prop="pieceNo">
        <el-input
          v-model="queryParams.pieceNo"
          placeholder="请输入工件号"
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
      <el-form-item label="模号" prop="moduleNo">
        <el-input
          v-model="queryParams.moduleNo"
          placeholder="请输入模号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="电极生产单号" prop="eleDispatchNo">
        <el-input
          v-model="queryParams.eleDispatchNo"
          placeholder="请输入电极生产单号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="工件版本号" prop="versionNo">
        <el-input
          v-model="queryParams.versionNo"
          placeholder="请输入工件版本号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="数量" prop="quantity">
        <el-input
          v-model="queryParams.quantity"
          placeholder="请输入数量"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="材质" prop="material">
        <el-input
          v-model="queryParams.material"
          placeholder="请输入材质"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="电极长" prop="electrodeLength">
        <el-input
          v-model="queryParams.electrodeLength"
          placeholder="请输入电极长"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="电极宽" prop="electrodeWidth">
        <el-input
          v-model="queryParams.electrodeWidth"
          placeholder="请输入电极宽"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="电极高" prop="electrodeHeight">
        <el-input
          v-model="queryParams.electrodeHeight"
          placeholder="请输入电极高"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          size="mini"
          :disabled="single"
          @click="handleOutStock"
        >待出库</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          size="mini"
          :disabled="single"
          @click="handleInStock"
        >还库</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          size="mini"
          :disabled="single"
          @click="handleUnbound"
        >解绑</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          size="mini"
          :disabled="single"
          @click="handleAbuse"
        >报废</el-button>
      </el-col>

      <!-- <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['jy:electrodeMange:add']"
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
          v-hasPermi="['jy:electrodeMange:edit']"
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
          v-hasPermi="['jy:electrodeMange:remove']"
        >删除</el-button>
      </el-col> -->
      <!-- <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          :loading="exportLoading"
          @click="handleExport"
        >导出</el-button>
      </el-col> -->
      <el-col :span="1.5">
        <el-radio-group v-model="queryParams.status" @change="handleQuery">
          <el-radio :label="-1">报废</el-radio>
          <el-radio :label="0">在库</el-radio>
          <el-radio :label="1">待出库</el-radio>
          <el-radio :label="2">已出库</el-radio>
          <el-radio :label="5">已解绑</el-radio>
        </el-radio-group>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          size="mini"
          @click="handleStockScreen"
        >在库天数筛选</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>
    <el-row>
      <el-col :span="1.5">
        <el-input placeholder="请输入rfid" v-model="rfidSearch" class="input-with-select" clearable @keyup.enter.native="handleRfidSearch">
          <el-button slot="append" icon="el-icon-search" @click="handleRfidSearch"></el-button>
        </el-input>
      </el-col>
    </el-row>
    <el-table v-loading="loading" :data="electrodeMangeList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <!-- <el-table-column label="电极高" align="center" prop="id" /> -->
      <el-table-column label="状态" align="center" prop="status" >
        <template slot-scope="scope">
          <el-tag v-if='scope.row.status===-1' type="danger">报废</el-tag>
          <el-tag v-else-if="scope.row.status===0" type="success">在库</el-tag>
          <el-tag v-else-if="scope.row.status===1" type="warning">待出库</el-tag>
          <el-tag v-else-if="scope.row.status===2" >已出库</el-tag>
          <el-tag v-else-if="scope.row.status===5" >已解绑</el-tag>
          <el-tag v-else type="info"> 未知</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="位置" align="center" prop="position" />
      <el-table-column label="电极序号" align="center" prop="eleNo" />
      <el-table-column label="电极编号" align="center" prop="electrodeBno" />
      <el-table-column label="工件号" align="center" prop="pieceNo" />
      <el-table-column label="工件生产单号" align="center" prop="orderNo" />
      <el-table-column label="模号" align="center" prop="moduleNo" />
      <el-table-column label="电极生产单号" align="center" prop="eleDispatchNo" />
      <el-table-column label="工件版本号" align="center" prop="versionNo" />
      <el-table-column label="数量" align="center" prop="quantity" />
      <el-table-column label="材质" align="center" prop="material" />
      <el-table-column label="长-宽-高" align="center" >
        <template slot-scope="scope">
          {{scope.row.electrodeLength}}-{{scope.row.electrodeWidth}}-{{scope.row.electrodeHeight}}
        </template>
      </el-table-column>
      <el-table-column label="有效高度" align="center" prop="effectiveHeight" />
      <el-table-column label="重量" align="center" prop="weight" />
      <el-table-column label="使用者" align="center" prop="userName" />
      <el-table-column label="天数" align="center" prop="duration" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleNewOne(scope.row)"
          >重新生产</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleRefer(scope.row)"
          >引用记录</el-button>
          <!-- <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['jy:electrodeMange:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['jy:electrodeMange:remove']"
          >删除</el-button> -->
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

    <!-- 添加或修改电极管理对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="状态">
          <el-radio-group v-model="form.status">
            <el-radio label="1">请选择字典生成</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="位置" prop="position">
          <el-input v-model="form.position" placeholder="请输入位置" />
        </el-form-item>
        <el-form-item label="电极序号" prop="eleNo">
          <el-input v-model="form.eleNo" placeholder="请输入电极序号" />
        </el-form-item>
        <el-form-item label="工件号" prop="pieceNo">
          <el-input v-model="form.pieceNo" placeholder="请输入工件号" />
        </el-form-item>
        <el-form-item label="工件生产单号" prop="orderNo">
          <el-input v-model="form.orderNo" placeholder="请输入工件生产单号" />
        </el-form-item>
        <el-form-item label="模号" prop="moduleNo">
          <el-input v-model="form.moduleNo" placeholder="请输入模号" />
        </el-form-item>
        <el-form-item label="电极生产单号" prop="eleDispatchNo">
          <el-input v-model="form.eleDispatchNo" placeholder="请输入电极生产单号" />
        </el-form-item>
        <el-form-item label="工件版本号" prop="versionNo">
          <el-input v-model="form.versionNo" placeholder="请输入工件版本号" />
        </el-form-item>
        <el-form-item label="数量" prop="quantity">
          <el-input v-model="form.quantity" placeholder="请输入数量" />
        </el-form-item>
        <el-form-item label="材质" prop="material">
          <el-input v-model="form.material" placeholder="请输入材质" />
        </el-form-item>
        <el-form-item label="电极长" prop="electrodeLength">
          <el-input v-model="form.electrodeLength" placeholder="请输入电极长" />
        </el-form-item>
        <el-form-item label="电极宽" prop="electrodeWidth">
          <el-input v-model="form.electrodeWidth" placeholder="请输入电极宽" />
        </el-form-item>
        <el-form-item label="电极高" prop="electrodeHeight">
          <el-input v-model="form.electrodeHeight" placeholder="请输入电极高" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog title="待出库" :visible.sync="outStock.showMe" width="500px"  append-to-body>
      <el-form :model="outStock" ref="outStockForm" label-width="30%" class="demo-dynamic">
        <el-form-item label="电极序号">
          <div>{{eleNoTitle}}</div>
        </el-form-item>

        <el-form-item
            prop="val"
            label="设备号"
            :rules="[
              { required: true, message: '请输入内容', trigger: 'blur' }
            ]"
          >
          <el-input placeholder="请输入内容" v-model="outStock.val"> </el-input>
        </el-form-item>
        <el-form-item
            prop="userName"
            label="使用者"
            :rules="[
              { required: true, message: '请输入内容', trigger: 'blur' }
            ]"
          >
          <el-input placeholder="请输入内容" v-model="outStock.userName"> </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="doOutStock">出 库</el-button>
      </div>
    </el-dialog>
    <el-dialog title="还库" :visible.sync="inStock.showMe" width="500px" append-to-body>
      <div>电极序号：{{eleNoTitle}}</div>
      <el-select v-model="inStock.hVal " filterable placeholder="请选择仓库" @change="handleChange">
        <el-option
          v-for="item in inStock.house"
          :key="item.id"
          :label="item.name"
          :value="item">
        </el-option>
      </el-select>
      <el-select v-model="inStock.sVal " filterable placeholder="请选择库位">
        <el-option
          v-for="item in inStock.stock"
          :key="item.id"
          :label="item.name"
          :value="item.name">
        </el-option>
      </el-select>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="doInStock">还 库</el-button>
      </div>
    </el-dialog>
    <el-dialog title="重新生产" :visible.sync="newOne.showMe" width="500px" append-to-body>
      <div>
        <el-select v-model="newOne.data.pieceNo" filterable placeholder="请选择工件" @change="handleBomChange">
          <el-option
            v-for="item in newOne.bomList"
            :key="item.id"
            :label="item.workpiece"
            :value="item">
          </el-option>
        </el-select>
      </div>
      <div>
        <el-select v-model="newOne.data.processNo " filterable placeholder="请选择工序"  @change="handleProcessChange">
          <el-option
            v-for="item in newOne.processList"
            :key="item.id"
            :label="item.code"
            :value="item">
          </el-option>
        </el-select>
      </div>
      <el-input placeholder="请输入数量" v-model="newOne.id.quantity">
        <template slot="prepend">数量</template>
      </el-input>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="doNewOne">提交</el-button>
      </div>
    </el-dialog>

    <el-dialog title="引用记录" :visible.sync="referOne.showMe" width="500px" append-to-body>
      <el-table v-loading="loading" :data="referOne.list">
        <el-table-column label="工单号" align="center" prop="orderno" />
        <el-table-column label="工件号" align="center" prop="pieceno" />
        <el-table-column label="工序号" align="center" prop="processno" />
        <el-table-column label="创建时间" align="center" prop="createDate" >
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.createDate, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import { rfidElectrodeMange,reProduction,getCamElectrodeProcess,getCamElectrodeBom,optElectrode,listElectrodeMange, getElectrodeMange, delElectrodeMange, addElectrodeMange, updateElectrodeMange, exportElectrodeMange } from "@/api/jy/electrodeMange";
import { allStockHouse } from "@/api/jy/stockHouse";
import { allStock } from "@/api/jy/stock";
import { allElectrodeRefer } from "@/api/jy/electrodeRefer";
import moment from 'moment';
export default {
  name: "ElectrodeMange",
  data() {
    return {
      rfidSearch:null,
      referOne:{
        showMe:false,
        list:[]
      },
      newOne:{
        showMe:false,
        bomList:[],
        processList:[],
        id:{
          electrodeBomId:null,
          processId:null,
          quantity:null

        },
        data:{
          pid:null,
          orderNo:null,
          pieceNo:null,
          processNo:null,
        }
      },
      outStock:{
        showMe:false,
        userName:null,
        val:null
      },
      eleNoTitle:null,
      inStock:{
        showMe:false,
        house:[],
        stock:[],
        hVal:null,
        sVal:null,
      },
      // 遮罩层
      loading: true,
      // 导出遮罩层
      exportLoading: false,
      // 选中数组
      ids: [],
      eleNos: [],

      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: false,
      // 总条数
      total: 0,
      // 电极管理表格数据
      electrodeMangeList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        status: -1,
        position: null,
        eleNo: null,
        pieceNo: null,
        orderNo: null,
        moduleNo: null,
        eleDispatchNo: null,
        versionNo: null,
        quantity: null,
        material: null,
        electrodeLength: null,
        electrodeWidth: null,
        electrodeHeight: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      }
    };
  },
  created() {
    this.getList();
  },
  activated() {
    this.getList();
  },
  methods: {
    handleRfidSearch(){
      // console.log(this.rfidSearch);
      this.electrodeMangeList = [];
      if(this.rfidSearch===undefined||this.rfidSearch===null||this.rfidSearch==="") return
      this.loading = true;

     rfidElectrodeMange({"rfid":this.rfidSearch}).then(response => {

        this.total = 0;
        this.queryParams.pageNum = 1;

        let ret = response.data;
        if(ret !==undefined&&ret !== null){
          this.electrodeMangeList = [];
          this.electrodeMangeList.push(ret)
          this.total = 1;
        }
        this.loading = false;
      });
    },
    handleStockScreen(){

      this.$prompt('请输入在库天数', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /[0-9]+/,
          inputErrorMessage: '只能输入数字'
        }).then(({ value }) => {
          this.queryParams.status=0
          // this.queryParams.updateTime = moment().subtract(value, 'days')
          this.queryParams.duration = moment().subtract(value, 'days').format('YYYY-MM-DD')
          this.handleDurationQuery()
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消输入'
          });
        });
    },
    handleRefer(val){
      this.referOne.showMe = true;
      allElectrodeRefer({"pid":val.id}).then(resp=>{
        this.referOne.list = resp.data
      })
    },
    doNewOne(){
      if(this.newOne.data.pieceNo===null){
        this.msgError("请选择工件");
        return;
      }
      if(this.newOne.data.processNo===null){
        this.msgError("请选择工序");
        return;
      }
      if(this.newOne.id.quantity===null){
        this.msgError("请选择填写数量");
        return;
      }
      reProduction(this.newOne.id).then(resp=>{
        console.log(resp);
        if(resp.code===200){

        }
      })
    },
    handleProcessChange(val){
      this.newOne.id.processId = val.id
      this.newOne.data.processNo = val.code
    },
    handleBomChange(val){
      this.newOne.id.electrodeBomId = val.id
      this.newOne.data.pieceNo = val.workpiece
      getCamElectrodeProcess({"id":val.id}).then(resp=>{
        this.newOne.processList = resp.data
      })
    },
    handleNewOne(val){
      this.newOne.showMe=true
      this.newOne.data.pid = val.id
      this.newOne.data.orderNo = val.orderNo

      getCamElectrodeBom({"electrodeProdOrderNo":val.orderNo}).then(resp=>{
        this.newOne.bomList = resp.data
      })
    },
    handleUnbound(){
      const ids = this.ids;
      const eleNos = this.eleNos
      this.$confirm('是否确认解绑电极编号为"' + eleNos + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function() {
        return optElectrode({"opt":5,ids });
      }).then(() => {
        this.getList();
        this.msgSuccess("操作成功");
      }).catch(() => {
        this.msgError("操作失败");
      });
    },
    handleAbuse(){
      const ids = this.ids;
      const eleNos = this.eleNos
      this.$confirm('是否确认报废电极编号为"' + eleNos + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function() {
        return optElectrode({"opt":-1,ids });
      }).then(() => {
        this.getList();
        this.msgSuccess("操作成功");
      }).catch(() => {
        this.msgError("操作失败");
      });
    },
    doInStock(){
      
      if(this.inStock.sVal === null){
        this.msgError("请选择库位")
        return
      }
      const ids = this.ids;
      const eleNos = this.eleNos
      const position = this.inStock.hVal+':'+this.inStock.sVal
      this.$confirm('是否确认还库电极编号为"' + eleNos + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return optElectrode({"opt":2,ids,position });
        }).then(() => {
          this.getList();
          this.inStock.showMe = false;
          this.msgSuccess("操作成功");
        }).catch(() => {
          this.msgError("操作失败");
        });
    },
    handleInStock(){
      console.log("handleInStock");
      allStockHouse().then(resp=>{
        this.inStock.house = resp.data
      })
      
      this.eleNoTitle = ""
      this.inStock.stock = []
      this.inStock.sVal = null
      this.inStock.hVal = null
      for(let i =0;i < this.eleNos.length;i ++){
        this.eleNoTitle += this.eleNos[i] + ','
      }
      this.eleNoTitle = this.eleNoTitle.substring(0,this.eleNoTitle.length-1)
      this.inStock.showMe = true;
    },
    doOutStock() {

      this.$refs["outStockForm"].validate((valid) => {
        if (valid) {
          const ids = this.ids;
          const eleNos = this.eleNos
          const position = "设备:"+this.outStock.val
          const userName = this.outStock.userName
          this.$confirm('是否确认出库电极编号为"' + eleNos + '"的数据项?', "警告", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }).then(function() {
            return optElectrode({"opt":4,ids,position,userName });
          }).then(() => {
            this.getList();
            this.outStock.showMe = false;
            this.msgSuccess("操作成功");
          }).catch(() => {
            this.msgError("操作失败");
          });
          }
      });

    },
    handleOutStock(val){
      this.eleNoTitle = ''
      for(let i =0;i < this.eleNos.length;i ++){
        this.eleNoTitle += this.eleNos[i] + ','
      }
      this.eleNoTitle = this.eleNoTitle.substring(0,this.eleNoTitle.length-1)
      this.outStock.userName = val.userName;
      this.outStock.val = null;
      this.outStock.showMe = true;
    },
    handleChange(val){
      allStock({"pid":val.id}).then(resp=>{
        this.inStock.stock = resp.data
      })
      this.inStock.sVal = null
      this.inStock.hVal = val.name
    },
    /** 查询电极管理列表 */
    getList() {
      this.loading = true;
      listElectrodeMange(this.queryParams).then(response => {
        this.electrodeMangeList = response.rows.map(e=>{
          if(e.status===0){
            e.duration=moment().diff(moment(e.updateTime), 'days')
          }else{
            e.duration="/"
          }
          return e
        })

        this.total = response.total
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
        position: null,
        eleNo: null,
        pieceNo: null,
        orderNo: null,
        moduleNo: null,
        eleDispatchNo: null,
        versionNo: null,
        quantity: null,
        material: null,
        electrodeLength: null,
        electrodeWidth: null,
        electrodeHeight: null,
        updateTime: null
      };
      this.resetForm("form");
    },
    handleDurationQuery(){
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.duration =null
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
      this.eleNos = selection.map(item => item.eleNo)

      const flag = selection.length ;
      console.log("flag:"+flag)
      if(selection.length == 1){
        this.single =  false;
      }else{
        this.single = true;
      }
      //this.single = selection.length!==0
      //this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加电极管理";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getElectrodeMange(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改电极管理";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateElectrodeMange(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addElectrodeMange(this.form).then(response => {
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
      this.$confirm('是否确认删除电极管理编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delElectrodeMange(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有电极管理数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.exportLoading = true;
          return exportElectrodeMange(queryParams);
        }).then(response => {
          this.download(response.msg);
          this.exportLoading = false;
        }).catch(() => {});
    }
  }
};
</script>
