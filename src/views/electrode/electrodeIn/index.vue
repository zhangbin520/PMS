<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
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
      <!-- <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['jy:electrodeIn:add']"
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
          v-hasPermi="['jy:electrodeIn:edit']"
        >修改</el-button>
      </el-col> -->
      <el-col :span="1.5">
        <el-button
          type="primary"
          size="mini"
          :disabled="single"
          @click="handleAdd"
        >入库</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          size="mini"
          :disabled="multiple"
          @click="handleImm"
        >即入即出</el-button>
      </el-col>
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

        <el-input placeholder="请输入rfid" v-model="queryParams.rfid" class="input-with-select" clearable @keyup.enter.native="getList">
          <el-button slot="append" icon="el-icon-search" @click="getList"></el-button>
        </el-input>
      </el-col>

      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="electrodeInList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <!-- <el-table-column label="电极高" align="center" prop="id" /> -->
      <el-table-column label="电极序号" align="center" prop="eleNo" />
      <el-table-column label="电极编号" align="center" prop="electrodeBno" />
      <el-table-column label="工件号" align="center" prop="pieceNo" />
      <el-table-column label="工件生产单号" align="center" prop="orderNo" />
      <el-table-column label="模号" align="center" prop="moduleNo" />
      <el-table-column label="电极生产单号" align="center" prop="eleDispatchNo" />
      <el-table-column label="RFID" align="center" prop="rfid" />
      <el-table-column label="工件版本号" align="center" prop="versionNo" />
      <el-table-column label="数量" align="center" prop="quantity" />
      <el-table-column label="材质" align="center" prop="material" />
      <el-table-column label="长-宽-高" align="center" >
        <template slot-scope="scope">
          {{scope.row.electrodeLength}}-{{scope.row.electrodeWidth}}-{{scope.row.electrodeHeight}}
        </template>
      </el-table-column>
      <el-table-column label="有效高度" align="center" prop="effectiveHeight" />

      <!-- <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['jy:electrodeIn:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['jy:electrodeIn:remove']"
          >删除</el-button>
        </template>
      </el-table-column> -->
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改电极待入库对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form :model="options" ref="dynamicValidateForm" label-width="30%" class="demo-dynamic">
        <el-form-item label="电极序号">
          <div>{{eleNoTitle}}</div>

        </el-form-item>
        <el-form-item
            prop="stock"
            label="库位"
            :rules="[
              { required: true, message: '请选择库位', trigger: 'blur' }
            ]"
          >
          <el-select v-model="options.hVal " filterable placeholder="请选择仓库" @change="handleChange">
            <el-option
              v-for="item in options.house"
              :key="item.id"
              :label="item.name"
              :value="item">
            </el-option>
          </el-select>
          <el-select v-model="options.sVal " filterable placeholder="请选择库位" @change="handleStockChange">
            <el-option
              v-for="item in options.stock"
              :key="item.id"
              :label="item.name"
              :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
            prop="weight"
            label="重量"
            :rules="[
              { required: true, message: '请输入重量', trigger: 'blur' },
              { type: 'number', message: '重量必须为数字值'}
            ]"
          >
          <el-input-number
          v-model="options.weight"
          :step="0.1"
          :style="{'width': '100%'}" ></el-input-number>
          <!-- <el-input placeholder="请输入内容" v-model.number="options.weight">
          </el-input> -->
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm" :loading="submitLoading">入 库</el-button>
      </div>
    </el-dialog>
    <el-dialog title="即入即出" :visible.sync="imm.showMe" width="500px" append-to-body>
      <el-form :model="imm" ref="immForm" label-width="30%" class="demo-dynamic">
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
          <el-input placeholder="请输入内容" v-model="imm.val">
          </el-input>
        </el-form-item>
        <el-form-item
            prop="weight"
            label="重量"
            :rules="[
              { required: true, message: '请输入重量', trigger: 'blur' },
              { type: 'number', message: '重量必须为数字值'}
            ]"
          >
          <el-input-number
          v-model="imm.weight"
          :step="0.1"
          :style="{'width': '100%'}" ></el-input-number>
          <!-- <el-input placeholder="请输入内容" v-model.number="options.weight">
          </el-input> -->
        </el-form-item>
        <el-form-item
            prop="userName"
            label="使用者"
            :rules="[
              { required: true, message: '请输入内容', trigger: 'blur' }
            ]"
          >
          <el-input placeholder="请输入内容" v-model="imm.userName">
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="doImm" :loading="submitLoading">即入即出</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { optElectrode,listElectrodeMange} from "@/api/jy/electrodeMange";

import { rfidElectrodeIn,listElectrodeIn, getElectrodeIn, delElectrodeIn, addElectrodeIn, updateElectrodeIn, exportElectrodeIn } from "@/api/jy/electrodeIn";
import { allStockHouse } from "@/api/jy/stockHouse";
import { allStock } from "@/api/jy/stock";
import {checkProdWorkFinish} from "../../../api/jy/electrodeIn";

export default {
  name: "ElectrodeIn",
  data() {
    return {
      submitLoading: false,
      rfidSearch:null,
      imm:{
        showMe:false,
        weight:null,
        userName:null,
        val:null
      },
      eleNoTitle:null,
      options:{
        house:[],
        stock:[],
        hVal:null,
        sVal:null,
        weight:null,
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
      // 电极待入库表格数据
      electrodeInList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      //选中数据
      eleDispatchNo:'',
      eleNo:'',
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
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
    this.init();
  },
  activated() {
    this.init();
  },
  methods: {
    handleRfidSearch(){
      // console.log(this.rfidSearch);
      this.electrodeInList = [];
      if(this.rfidSearch===undefined||this.rfidSearch===null||this.rfidSearch==="") return
      this.loading = true;

      rfidElectrodeIn(this.rfidSearch).then(response => {
        this.total = 0;
        this.queryParams.pageNum = 1;

        let ret = response.data;
        if(ret !==undefined&&ret !== null){
          this.electrodeInList.push(ret)
          this.total = 1;
        }
        this.loading = false;
      });
    },
    init(){
      this.queryParams.status = 0
      this.getList();
    },
    handleChange(val){
      allStock({"pid":val.id}).then(resp=>{
        this.options.stock = resp.data
      })
      
      this.options.sVal = null
      this.options.hVal = val.name
      this.options.houseId = val.id;
      console.log(val.id)
    },
    handleStockChange(val){
      this.options.sVal = val.name;
      this.options.stockId = val.id;
      console.log(val.id)
    },
    /** 查询电极待入库列表 */
    getList() {
      this.rfidSearch = null

      this.loading = true;
      /* listElectrodeIn(this.queryParams).then(response => {
        this.electrodeInList = response.rows;
        this.total = response.total;
        this.loading = false;
      }); */


      listElectrodeMange(this.queryParams).then(response => {
        this.electrodeInList = response.rows;
        this.total = response.total;
        this.loading = false;
      }) 
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
        createTime: null
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
      this.eleNos = selection.map(item => item.eleNo)
      this.eleDispatchNo = selection.map(item => item.eleDispatchNo).join('')
      this.eleNo = selection.map(item => item.eleNo).join('')
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.submitLoading = false

      this.queryParams.prodOrderNo = this.eleDispatchNo
      this.queryParams.electrodeNo = this.eleNo

      allStockHouse().then(resp=>{
        this.options.house = resp.data
      })
      this.eleNoTitle = ""
      this.options.stock = []
      this.options.sVal = null
      this.options.hVal = null
      for(let i =0;i < this.eleNos.length;i ++){
        this.eleNoTitle += this.eleNos[i] + ','
      }
      this.eleNoTitle = this.eleNoTitle.substring(0,this.eleNoTitle.length-1)
      this.open = true;
      this.title = "入库";

      // checkProdWorkFinish(this.queryParams).then(res => {
      //   if(res.data === false) {
      //     this.$modal.msgError("该电极还未加工完成")
      //   }else {
      //     allStockHouse().then(resp=>{
      //       this.options.house = resp.data
      //     })
      //     this.eleNoTitle = ""
      //     this.options.stock = []
      //     this.options.sVal = null
      //     this.options.hVal = null
      //     for(let i =0;i < this.eleNos.length;i ++){
      //       this.eleNoTitle += this.eleNos[i] + ','
      //     }
      //     this.eleNoTitle = this.eleNoTitle.substring(0,this.eleNoTitle.length-1)
      //     this.open = true;
      //     this.title = "入库";
      //   }
      // })
    },
    handleImm() {
      this.queryParams.prodOrderNo = this.eleDispatchNo
      this.queryParams.electrodeNo = this.eleNo
      this.submitLoading = false

      this.imm.val = null
      this.imm.weight = null
      this.imm.userName = null
      this.eleNoTitle = ''
      for(let i =0;i < this.eleNos.length;i ++){
        this.eleNoTitle += this.eleNos[i] + ','
      }
      this.eleNoTitle = this.eleNoTitle.substring(0,this.eleNoTitle.length-1)
      this.imm.showMe = true;

      // checkProdWorkFinish(this.queryParams).then(res => {
      //   if (res.data === false) {
      //     this.$modal.msgError("该电极还未加工完成")
      //   } else {
      //     this.eleNoTitle = ''
      //     for(let i =0;i < this.eleNos.length;i ++){
      //       this.eleNoTitle += this.eleNos[i] + ','
      //     }
      //     this.eleNoTitle = this.eleNoTitle.substring(0,this.eleNoTitle.length-1)
      //     this.imm.showMe = true;
      //   }
      // })
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getElectrodeIn(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改电极待入库";
      });
    },
    /** 提交按钮 */
    submitForm() {
      // if(this.options.sVal === null){
      //   this.msgError("请选择库位")
      //   return
      // }
      if(this.submitLoading) return
      this.submitLoading = true
      this.$refs["dynamicValidateForm"].validate((valid) => {
        if (valid) {
          this.handleIn();
        }else{
          this.submitLoading = false
        }
      });

    },
    handleIn() {
      
      const ids = this.ids;
      const eleNos = this.eleNos
      const weight = this.options.weight
      const position = this.options.hVal+':'+this.options.sVal
      var obj = {
        "opt": 0,
        "ids": ids,
        "position": position,
        "weight": weight,
        "houseId": this.options.houseId,
        "stockId": this.options.stockId
      }

      optElectrode(obj).then(() => {
        this.getList();
        this.open = false;
        this.msgSuccess("操作成功");
        this.submitLoading = false
      }).catch(err=>{
        this.submitLoading = false
      })

      // this.$confirm('是否确认入库电极编号为"' + eleNos + '"的数据项?', "警告", {
      //     confirmButtonText: "确定",
      //     cancelButtonText: "取消",
      //     type: "warning"
      //   }).then(function() {
      //     return optElectrode({"opt":0,ids,position,weight});
      //   }).then(() => {
      //     this.getList();
      //     this.open = false;
      //     this.msgSuccess("操作成功");
      //   }).catch(() => {
      //     this.msgError("操作失败");
      //   });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$confirm('是否确认删除电极待入库编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delElectrodeIn(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(() => {});
    },
    doImm() {
      if(this.submitLoading) return
      this.submitLoading = true

      this.$refs["immForm"].validate((valid) => {
        if (valid) {
          this.doImmActul();
        }else{
          this.submitLoading = false
        }
      });
    },
    doImmActul() {
      if(this.imm.val === null){
        this.msgError("请填写信息")
        return
      }
      const ids = this.ids;
      const eleNos = this.eleNos
      const userName = this.imm.userName
      const weight = this.imm.weight
      const position = "设备:"+this.imm.val

      optElectrode({"opt":3,ids,position,weight,userName }).then(() => {
        this.getList();
        this.imm.showMe = false;
        this.msgSuccess("操作成功");
        this.submitLoading = false

      }).catch(() => {
        this.submitLoading = false
        this.msgError("操作失败");
      });
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有电极待入库数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.exportLoading = true;
          return exportElectrodeIn(queryParams);
        }).then(response => {
          this.download(response.msg);
          this.exportLoading = false;
        }).catch(() => {});
    }
  }
};
</script>
