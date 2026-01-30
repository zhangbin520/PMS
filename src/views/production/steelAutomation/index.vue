<template>
  <div class="app-container">
    <el-card>
      <el-form :model="queryParams" ref="queryForm" :inline="true">
        <el-row>
          <el-form-item label="设备编号" prop="deviceNo">
            <el-input
              v-model="queryParams.deviceNo"
              placeholder="输入设备编号"
              clearable
              size="small"
              style="width: 200px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item>
            <el-button style="margin-left: 10px;margin-right: 10px" type="primary" icon="el-icon-search" size="mini" @click="handleQuery">查询</el-button>
          </el-form-item>
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
      <el-row>
        <el-col :span="24">
          <el-table v-loading="loading" :data="productionList" border @header-click="clickFunPre"
                    :row-class-name="tableRowClassName"  max-height="600px">
            <el-table-column type="index" label="序号" width="50" align="center" />
            <el-table-column label="设备编号" align="center" key="deviceNo" prop="deviceNo" width="120px">
              <template slot-scope="scope">
                <el-input v-model="scope.row.deviceNo" @change="selectEquement(scope.row)" autofocus="true"
                          ref="input0" @keyup.enter.native="handelTab(scope.row.index,$event)">{{scope.row.deviceNo}}</el-input>
              </template>
            </el-table-column>
            <el-table-column label="设备名称" align="center" key="name" prop="name" :show-overflow-tooltip="true"/>
            <el-table-column label="分类" align="center" key="type" prop="type">
              <template slot-scope="scope">
                <el-tag v-if="scope.row.type === '0'" type="success">钢件</el-tag>
                <el-tag v-if="scope.row.type === '1'" type="danger">电极</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="使用群组" align="center" key="deptName" prop="deptName"/>
            <el-table-column label="使用工艺" align="center" key="craftsName" prop="craftsName"/>
            <el-table-column label="控制器" align="center" key="controller" prop="controller" :show-overflow-tooltip="true"/>
            <el-table-column label="生产单号" align="center" key="prodOrderNo" prop="prodOrderNo" width="120px" :show-overflow-tooltip="true">
              <template slot-scope="scope">
                <el-input v-model="scope.row.prodOrderNo" @change="selectProduction(scope.row)"  ref="input1" @keyup.enter.native="handelTab(scope.row.index,$event)"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="派工单号" align="center" key="dispatchOrderNo" prop="dispatchOrderNo" :show-overflow-tooltip="true"/>
            <el-table-column label="模号" align="center" key="moduleNo" prop="moduleNo" :show-overflow-tooltip="true"/>
            <el-table-column label="件号" align="center" key="pieceNo" prop="pieceNo" :show-overflow-tooltip="true"/>
            <el-table-column label="当前工序" align="center" key="currentProcess" prop="currentProcess"/>
            <el-table-column label="当前工艺" align="center" key="currentSection" prop="currentSection"/>
            <el-table-column label="制程" align="center" key="process" prop="process" :show-overflow-tooltip="true"/>
            <el-table-column label="工艺工时" align="center" key="processManHours" prop="processManHours" v-if="false"/>
            <el-table-column label="理论加工时间" align="center" key="theoreticalProcessingTime" prop="theoreticalProcessingTime"/>
            <el-table-column label="投入工时" align="center" key="inputManHours" prop="inputManHours"/>
            <el-table-column label="档案查看" align="center" width="100px">
              <template slot-scope="scope">
                <el-button type="primary" size="mini" @click="handleViewFile(scope.row)">查看档案</el-button>
              </template>
            </el-table-column>
            <el-table-column label="+" align="center" width="100px">
              <template slot-scope="scope">
                <el-button
                  size="small"
                  circle
                  type="primary"
                  icon="el-icon-plus"
                  @click="handleAddData(scope.row)"
                ></el-button>
              </template>
            </el-table-column>
            <el-table-column label="-" align="center" width="100px">
              <template slot-scope="scope">
                <el-button
                  size="small"
                  circle
                  type="warning"
                  icon="el-icon-minus"
                  @click="handleDeleteData(scope.row,scope.$index)"
                ></el-button>
              </template>
            </el-table-column>
          </el-table>
          <pagination
            v-show="total>0"
            :total="total"
            :page.sync="queryParams.pageNo"
            :limit.sync="queryParams.pageSize"
            @pagination="getList"
          />
        </el-col>
      </el-row>
    </el-card>

    <el-card v-loading="loading" style="margin-top: 5px" align="center">
      <el-button size="small" type="primary" icon="el-icon-video-play" v-preventReClick="2000" @click="handleStart"
                 :disabled="status === '0' || status === '1' || status === '3' || multipleBegain">开始</el-button>
      <el-button size="small" type="warning" icon="el-icon-video-pause" @click="handleStop" v-if="status !== '1'" :disabled="multiple"
      >未完报工</el-button>
      <el-button size="small" type="info" icon="el-icon-video-play" @click="handleRecover" v-if="status === '1'" :disabled="multiple">恢复</el-button>
      <el-button size="small" type="success" icon="el-icon-check" v-preventReClick="2000" @click="handleReport" :disabled="multiple"
                 v-if="status !== '1'">完工</el-button>
    </el-card>
    <!-- 未完报工弹窗对话框 -->
    <el-dialog v-loading="loading" :title="stop.title" :visible.sync="stop.open" width="480px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="130px">
        <el-row v-for="(item,index) in reportList" :key="index" :gutter="24">
          <el-form-item
            :label="wholeProductionList[index].prodOrderNo"
          >
            <el-col :span="12"><el-input  placeholder="已完成比例" v-model="item.completed" disabled><i slot="suffix">%</i></el-input></el-col>
            <el-col :span="12"><el-input  placeholder="当前报工比例" v-model="item.thisCompleted" :disabled="item.completed == '100'? true:false"><i slot="suffix">%</i></el-input></el-col>
          </el-form-item>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm" v-preventReClick="2000">确 定</el-button>
        <el-button @click="stop.open = false">取 消</el-button>
      </div>
    </el-dialog>
    <!--完工周转筐对话框-->
    <el-dialog v-loading="loading" :title="titleShipment" :visible.sync="openShipment" width="800px" append-to-body>
      <el-table :data="ShipmentData" border  :row-class-name="tableRowClassName2">
        <el-table-column label="RFID卡号" align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.rfid" placeholder="请输入内容" @change="searchTurnoverBasket(scope.row)"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="周转筐编号" align="center" prop="code"/>
        <el-table-column label="生产单号" align="center" prop="prodOrderNo">
<!--          <template slot-scope="scope">-->
<!--            <el-select v-model="scope.row.prodOrderNo" placeholder="请选择" style="width: 100%" @change="searchProdOrderNo(scope.row)" clearable="">-->
<!--              <el-option-->
<!--                v-for="item in wholeProductionList"-->
<!--                :label="item.prodOrderNo"-->
<!--                :value="item.prodOrderNo"-->
<!--                :key="item.index"-->
<!--              ></el-option>-->
<!--            </el-select>-->
<!--          </template>-->
        </el-table-column>
<!--        <el-table-column label="+" align="center">-->
<!--          <template slot-scope="scope">-->
<!--            <el-button-->
<!--              size="small"-->
<!--              circle-->
<!--              type="primary"-->
<!--              icon="el-icon-plus"-->
<!--              @click="handleAddRfid(scope.row)"-->
<!--            ></el-button>-->
<!--            <el-button-->
<!--              size="small"-->
<!--              circle-->
<!--              type="warning"-->
<!--              icon="el-icon-minus"-->
<!--              @click="handleDeleteRfid(scope.row,scope.$index)"-->
<!--            ></el-button>-->
<!--          </template>-->
<!--        </el-table-column>-->
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" icon="el-icon-check" @click="saveShipment" :disabled="disabledShip">保 存</el-button>
        <el-button @click="cancelButton" type="danger">取 消</el-button>
      </div>
    </el-dialog>
    <!--未完报工完成周转筐对话框-->
    <el-dialog v-loading="loading" :title="titleShipment2" :visible.sync="unfinishedOpenShipment" width="800px" append-to-body>
      <el-table :data="ShipmentData" border :row-class-name="tableRowClassName2">
        <el-table-column label="RFID卡号" align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.rfid" placeholder="请输入内容" @change="searchTurnoverBasket(scope.row)"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="周转筐编号" align="center" prop="code"/>
        <el-table-column label="生产单号" align="center" prop="prodOrderNo">
<!--          <template slot-scope="scope">-->
<!--            <el-select v-model="scope.row.prodOrderNo" placeholder="请选择" style="width: 100%" @change="searchProdOrderNo(scope.row)" clearable="">-->
<!--              <el-option-->
<!--                v-for="item in wholeProductionList"-->
<!--                :label="item.prodOrderNo"-->
<!--                :value="item.prodOrderNo"-->
<!--                :key="item.index"-->
<!--              ></el-option>-->
<!--            </el-select>-->
<!--          </template>-->
        </el-table-column>
<!--        <el-table-column label="+" align="center">-->
<!--          <template slot-scope="scope">-->
<!--            <el-button-->
<!--              size="small"-->
<!--              circle-->
<!--              type="primary"-->
<!--              icon="el-icon-plus"-->
<!--              @click="handleAddRfid(scope.row)"-->
<!--            ></el-button>-->
<!--            <el-button-->
<!--              size="small"-->
<!--              circle-->
<!--              type="warning"-->
<!--              icon="el-icon-minus"-->
<!--              @click="handleDeleteRfid(scope.row,scope.$index)"-->
<!--            ></el-button>-->
<!--          </template>-->
<!--        </el-table-column>-->
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" icon="el-icon-check" @click="saveShipment2" :disabled="disabledShipUnfinish">保 存</el-button>
        <el-button @click="cancelButton2" type="danger">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getBaseSteelPartsSemiAutomaticPage,
  getEqByDeviceNoAndType,
  getOrderBomDetailByOrderNo,
  steelPartsFinish,
  steelPartsIncompleteWorkReport,
  steelPartsRecovery,
  steelPartsStart,
  steelPartsWorkOrderCompletionRatio
} from '@/api/production/steelAutomation'
import { getUserProfile } from '@/api/system/user'
import { prodWorkOperation, rfidTurnoverBasket } from '@/api/production/taskStation'
import { listBasketRfid } from '@/api/system/rfid'

export default {
  name: 'index',
  dicts:'',
  data(){
    return{
      // 遮罩层
      loading: true,
      // 总条数
      total: 0,
      // 非多个禁用
      multiple: true,
      multipleBegain: true,
      // 表格数据
      productionList: [],
      // 设备
      productionList2:[],
      // 完工设备列表(全部)
      wholeProductionList:[],
      //未完报工弹窗数据
      stop:{
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
      },
      // 表单参数
      form: {},
      //用户信息
      userName:'',
      personNo:'',
      deptName:'',
      // 查询参数
      queryParamsEquipment: {
        pageNo: 1,
        pageSize: 10,
      },
      // 查询参数
      queryParams: {
        pageNo: 1,
        pageSize: 10,
      },
      queryParams2: {
        pageNo: 1,
        pageSize: 100,
      },
      //文件格式表单校验
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
      //未完报工表单数据
      reportList:[],
      //状态参数
      status:'',
      multipleStatus: true,
      unCompleteStatue:'',
      shipmentStatus: true,
      //
      index:'',
      middleList:[],
      deviceNo:'',
      //增加单数
      obj:{
        deviceNo:'',
        prodOrderNo:'',
      },
      //完工周转筐弹窗
      titleShipment:'',
      openShipment:false,
      ShipmentData:[],
      //未完工周转筐弹窗
      titleShipment2:'',
      unfinishedOpenShipment:false,
      //查询参数
      queryParamsRfid: {
        pageNo: 1,
        pageSize: 10,
      },
      disabledShip:false,
      disabledShipUnfinish:false,
      formReport:{},
      batchNumber:'',
      conFirmprodOrderNo:'',
      //选择生产单号
      prodIndex:'',
      //未完报工窗口数组
      dataList:[]
    }
  },
  created() {
    this.getListUser();
    this.getListBasket()
  },
  watch:{
    personNo(){
      this.queryParams.createBy = this.personNo
      this.getList();
    },
  },
  methods:{
    /** 分页查询钢件半自动化列表 */
    getList() {
      this.loading = true;
      getBaseSteelPartsSemiAutomaticPage(this.queryParams).then(response => {
        this.productionList = response.data.records;
        if(this.productionList.length > 0) {
          this.batchNumber = this.productionList[0].batchNumber
          this.multiple = false
          // console.log(this.batchNumber)
        }else {
          this.multiple = true
          this.multipleBegain = true
        }
        this.total = response.data.total;
        this.loading = false;
        const arr = []
        this.productionList.forEach(item =>{
          arr.push(item.status)
        })
        this.status = arr[0]
      });
      getBaseSteelPartsSemiAutomaticPage(this.queryParams2).then(response => {
        this.wholeProductionList = response.data.records;
        // if(this.wholeProductionList.length > 0) {
        //   this.batchNumber = this.wholeProductionList[0].batchNumber
        //   this.multiple = false
        // }else {
        //   this.multiple = true
        //   this.multipleBegain = true
        // }
        this.total = response.data.total;
        this.loading = false;
        const arr = []
        this.wholeProductionList.forEach(item =>{
          arr.push(item.status)
        })
        this.status = arr[0]
        // console.log(this.wholeProductionList)
      });
    },
    /** 搜索按钮操作 */
    handleQuery() {
      delete this.queryParams.createBy
      this.queryParams.pageNo = 1
      this.queryParams2.deviceNo = this.queryParams.deviceNo
       if (this.queryParams2.deviceNo == ''){
         this.queryParams = {
           pageNo: 1,
           pageSize: 10,
         }
       }
       if(this.queryParams2.deviceNo !== ''){
         getBaseSteelPartsSemiAutomaticPage(this.queryParams2).then(response => {
           this.wholeProductionList = response.data.records;
           if(this.wholeProductionList.length > 0) {
             this.batchNumber = this.wholeProductionList[0].batchNumber
             this.multiple = false
           }else {
             this.multiple = true
             this.multipleBegain = true
           }
           this.total = response.data.total;
           const arr = []
           this.wholeProductionList.forEach(item =>{
             arr.push(item.status)
           })
           this.status = arr[0]
           // console.log(this.wholeProductionList)
         });
         // console.log(this.queryParams)
       }
      getBaseSteelPartsSemiAutomaticPage(this.queryParams).then(response => {
        this.productionList = response.data.records;
        if(this.productionList.length > 0) {
          this.batchNumber = this.productionList[0].batchNumber
          this.multiple = false
        }else {
          this.multiple = true
          this.multipleBegain = true
        }
        this.total = response.data.total;
        this.loading = false;
        const arr = []
        this.productionList.forEach(item =>{
          arr.push(item.status)
        })
        this.status = arr[0]
      });
    },
    /** 查询登录用户信息*/
    getListUser() {
      getUserProfile().then(response => {
        this.userName = response.data.nickName
        this.personNo = response.data.userName
        this.deptName = response.data.dept.name
      });
    },
    /** 表格数据增加index */
    tableRowClassName({row, rowIndex}) {
      //把每一行的索引放进row
      row.index = rowIndex;
    },
    /** 根据设备编号获取设备信息 */
    selectEquement(row) {
      this.index = row.index
      this.queryParamsEquipment.deviceNo = row.deviceNo
      this.queryParamsEquipment.type ='0'
      getEqByDeviceNoAndType(this.queryParamsEquipment).then(response => {
        this.productionList.splice(this.index,1,response.data)
      });
    },
    // /** 根据设备编号获取设备信息 */
    // selectEquement(row) {
    //   this.index = row.index
    //   this.getEquementList(row.deviceNo);
    // },
    // getEquementList(c,) {
    //   const specificInfo = c
    //   getEqByDeviceNoAndType({ 'deviceNo': specificInfo }).then(response => {
    //     this.productionList.splice(this.index, 1, response.data)
    //   });
    // },
    /** 根据生产单号获取详情 */
    selectProduction(row) {
      this.index = row.index
      this.getProductionList(row.prodOrderNo);
    },
    /** 根据生产单号获取详情 */
    getProductionList(b){
      const specificInformation = b
      getOrderBomDetailByOrderNo({'prodOrderNo':specificInformation}).then(response => {
        this.middleList = response.data
        this.middleList.process = this.middleList.process.replace(/-/g, "-").replace(/\([^\)]*\)/g, "")
        this.productionList.splice(this.index,1,Object.assign(this.productionList[this.index],this.middleList))
        if(this.productionList.length > 0){
          this.multipleBegain = false
        }else{
          this.multipleBegain =true
        }
      });

    },
    /** 查看图档 */
    handleViewFile(row) {
      this.$router.push({
        path:'/eleContact/eleContactForm',
        query:{
          prodOrderNo: row.prodOrderNo,
          electrodeNo: row.electrodeSerialNo,
        },
      });
    },
    /** 表头点击 */
    clickFunPre(column,event) {
      if (column.label === '+') {
        this.productionList.push(JSON.parse(JSON.stringify(this.obj)))
      }
      if (column.label === '-') {
        this.productionList = []
          this.status = ''
      }
    },
    /** 增加数据行 */
    handleAddData(){
      this.productionList.push(JSON.parse(JSON.stringify(this.obj)))
    },
    /** 删除数据行 */
    handleDeleteData(row,index){
      this.productionList.splice(index,1)
      if (this.productionList.length == '0'){
        this.status = ''
      }
    },
    /** 开始按钮操作 */
    handleStart() {
      this.loading = true
      setTimeout(()=>{
        this.loading=false   //点击一次时隔五秒后才能再次点击
      },3000)
      let prod = this.productionList.map(item => item["prodOrderNo"]);
      let prodset = new Set(prod);
      if (prodset.size == prod.length) {
        steelPartsStart(this.productionList).then(res =>{
          this.$modal.msgSuccess("开始加工")
          this.loading = false
          this.$set(this.queryParams, 'deviceNo', this.productionList[0].deviceNo)
          this.$set(this.queryParams2, 'deviceNo', this.productionList[0].deviceNo)
          this.getList()
        })
        // console.log("没有重复值");
      } else {
        this.$modal.msgError("有重复数据，请排查后重新开工")
        // console.log("有重复值");
      }
    },
    /**完工按钮*/
    handleReport() {
      this.multipleStatus = true
      // console.log(this.productionList)
      for (let i = 0 ; i < this.wholeProductionList.length ; i++){
        if (this.wholeProductionList[i].deviceNo !== this.wholeProductionList[0].deviceNo){
          this.$modal.msgError("不允许多个设备同时完工，请检查后重试");
        this.multipleStatus = false
          break
        }
      }
      if(this.multipleStatus) {
        this.ShipmentData = []
        this.wholeProductionList.forEach(v => {
          this.ShipmentData.push({
            'prodOrderNo': v.prodOrderNo
          })
        })
        this.disabledShip = true
        this.openShipment = true
      }
      },
          // this.ShipmentData = []
          // this.wholeProductionList.forEach(v =>{
          //   this.ShipmentData.push({
          //     'prodOrderNo': v.prodOrderNo
          //   })
          // })
          // this.disabledShip = true
          // this.openShipment = true
      // this.openShipment = true
      // getBaseSteelPartsSemiAutomaticPage(this.queryParams2).then(response => {
      //   this.wholeProductionList = response.data.records;
      // });
      // this.ShipmentData = []
      // this.wholeProductionList.forEach(v =>{
      //   this.ShipmentData.push({
      //     'prodOrderNo': v.prodOrderNo
      //   })
      // })
      // this.disabledShip = true
      // console.log(this.ShipmentData)
    /** 未完报工 */
    handleStop() {
      this.ShipmentData = []
      this.loading = true
      setTimeout(()=>{
        this.loading=false   //点击一次时隔五秒后才能再次点击
      },3000)
      this.stop.title = "未完报工"
      this.stop.open = true
      const a = []
      this.wholeProductionList.forEach(v =>{
        a.push({
          'batchNumber': v.batchNumber
        })
      })
      const map = new Map()
      const qc = a.filter(key => !map.has(key.batchNumber) && map.set(key.batchNumber,1))
      const batchNumber = qc[0]
      steelPartsWorkOrderCompletionRatio(batchNumber).then(res =>{
        this.reportList = res.data
        this.loading = false
      })
    },
    /** 恢复按钮操作 */
    handleRecover() {
      const a = []
      this.wholeProductionList.forEach(v =>{
        a.push({
          'batchNumber': v.batchNumber
        })
      })
      const map = new Map()
      const qc = a.filter(key => !map.has(key.batchNumber) && map.set(key.batchNumber,1))
      const batchNumber = qc[0]
      steelPartsRecovery(batchNumber).then(res =>{
        this.$modal.msgSuccess("恢复加工成功")
        this.getList()
      })
    },

    /** 未完报工确认按钮 */
    submitForm: function() {
      this.loading = true
      setTimeout(()=>{
        this.loading=false   //点击一次时隔三秒后才能再次点击
      },3000)
      this.$refs["form"].validate(valid => {
        if (valid) {
          const arr = this.reportList
          for(let i =0;i < arr.length;i++){
            if(Number(isNaN(arr[i].completed) ? 0 : arr[i].completed) + Number(arr[i].thisCompleted) === 100){
              this.unCompleteStatue = true
            }else{
              this.unCompleteStatue = false
            }
          }
          if(this.unCompleteStatue){
            this.unfinishedOpenShipment = true
            this.wholeProductionList.forEach(v =>{
              this.ShipmentData.push({
                'prodOrderNo': v.prodOrderNo
              })
            })
            this.stop.open = false
            this.getList()
          }else{
          steelPartsIncompleteWorkReport({'dtoList':arr}).then(res =>{
            this.$modal.msgSuccess("未完报工成功")
            this.loading = false
            this.stop.open = false
            this.getList()
          })
        }
        }
      });
    },
    /** 回车事件 */
    handelTab(i,e) {
      let indexKey = i + 1
      if(this.productionList.length === indexKey) {
        this.$nextTick(() => {
          this.$refs['input1'].focus()
          e.target.blur()
          this.handleAddData()
        })
      }else {
        this.$nextTick(() => {
          this.$refs['input0'].focus()
        })
      }
    },
    // /** 完工周转框表头点击 */
    // clickFun() {
    //   this.ShipmentData.push(JSON.parse(JSON.stringify(this.obj)))
    // },
    tableRowClassName2({row, rowIndex}) {
      //把每一行的索引放进row
      row.index = rowIndex;
    },
    /** 根据RFID标签搜索周转框编码 */
    searchTurnoverBasket(row) {
      // this.rfid = row.rfid
      const index = row.index
      this.queryParamsRfid.rfidCode = row.rfid
      rfidTurnoverBasket(this.queryParamsRfid).then(res => {
        const arr = {
          rfid:res.data.rfid,
          code:res.data.code,
          status:res.data.status,
          prodOrderNo:row.prodOrderNo
        }
        // this.ShipmentData.splice(index,1,this.conFirmprodOrderNo)
        this.ShipmentData.splice(index,1,arr)
        const a = []
        this.ShipmentData.forEach(function (item) {
          a.push(item.code)
        })
        this.turnoverBasketNoList = a
        if(this.ShipmentData.filter(d => d.code !== undefined).length !== this.ShipmentData.length){
          this.disabledShip = true
        }else {
          this.disabledShip = false
        }
        // console.log(this.disabledShip)
        // console.log(this.ShipmentData.filter(d => d.code !== undefined).length)
        // console.log(this.ShipmentData)
      })
      // console.log(this.turnoverBasketNoList)
      // if(this.ShipmentData.filter(d => d.code !== undefined).length !== this.ShipmentData.length){
      //   this.disabledShip = true
      // }else {
      //   this.disabledShip = false
      // }
      // console.log(this.disabledShip)
      // console.log(this.ShipmentData.filter(d => d.code !== undefined).length)
      // console.log(this.ShipmentData)
    },
    /** 判断生产单号是否存在*/
    searchProdOrderNo(row){
      this.conFirmprodOrderNo = row.prodOrderNo
    },
    /** 查询周转筐列表 */
    getListBasket() {
      listBasketRfid(this.queryParams).then(response => {
        this.BasketFortask = response.data.records
      });
    },
    // /** 增加RFID标签 */
    // handleAddRfid(){
    //   this.ShipmentData.push(JSON.parse(JSON.stringify(this.obj)))
    // },
    // /** 按数量删除RFID标签 */
    // handleDeleteRfid(row,index){
    //   this.ShipmentData.splice(index,1)
    // },
    /** 周转筐保存按钮 */
    saveShipment() {
      // console.log(this.ShipmentData.filter(d => d.code !== undefined).length)
      if(this.ShipmentData.filter(d => d.code !== undefined).length !== this.ShipmentData.length){
        this.$modal.msgError("还未全部绑定周转筐编码")
      }else {
        for(let i = 0;i < this.ShipmentData.length;i++){
          if(this.ShipmentData[i].code == '' || this.ShipmentData[i].prodOrderNo == ''){
            this.shipmentStatus = false
            break
          }
        }
        if(this.shipmentStatus){
          this.loading = true
          setTimeout(()=>{
            this.loading=false   //点击一次时隔五秒后才能再次点击
          },5000)
          this.disabledShip = false
          steelPartsFinish({
            "batchNumber": this.batchNumber,
            "turnoverBasketNoList": this.ShipmentData
          }).then(response =>{
            this.$modal.msgSuccess("操作成功");
            this.openShipment = false
            this.loading = false
            this.getList()
            this.ShipmentData = []
          })
        }else{
          this.$modal.msgError("周转筐生产单号信息不完整")
          this.shipmentStatus = true
        }
      }
    },
    /** 未完工周转筐保存按钮 */
    saveShipment2() {
      if(this.ShipmentData.length === 0){
        this.$modal.msgError("还未绑定周转筐编码")
      }else {
        for(let i = 0;i < this.ShipmentData.length;i++){
          if(this.ShipmentData[i].code == '' || this.ShipmentData[i].prodOrderNo == ''){
            this.shipmentStatus = false
            break
          }
        }
        if(this.shipmentStatus){
          this.loading = true
          setTimeout(()=>{
            this.loading=false   //点击一次时隔五秒后才能再次点击
          },5000)
          this.disabledShipUnfinish = false
          steelPartsIncompleteWorkReport({
            "dtolist": this.reportList,
            "turnoverBasketNoList": this.ShipmentData
          }).then(response =>{
            this.$modal.msgSuccess("操作成功");
            this.unfinishedOpenShipment = false
            this.loading = false
            this.getList()
            this.ShipmentData = []
            setTimeout(() => {
              this.getList()
            }, 1000);
          })
        }else{
          this.$modal.msgError("周转筐生产单号信息不完整")
          this.shipmentStatus = true
        }
      }

    },
    /**完成周转筐取消按钮*/
    cancelButton(){
      this.openShipment = false
      this.ShipmentData = []
    },
    /**未完成周转筐取消按钮*/
    cancelButton2(){
      this.unfinishedOpenShipment = false
      this.ShipmentData = []
    }
    }
  };
       // document.getElementById(presentcomple)
</script>

