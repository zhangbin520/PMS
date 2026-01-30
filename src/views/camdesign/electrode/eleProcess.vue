<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="16">
        <el-row>
          <el-form ref="formCost" :model="formCost" :rules="rules" label-width="100px">
            <el-row style="margin-top: 10px">
              <el-col :span="6">
                <el-form-item label="电极成本/元">
                  <el-input v-model="formCost.electrodeCost" type="number" oninput ="value=value.replace(/\-(\-?\d+(\.\d{0,2})?)/)"></el-input>
                </el-form-item>
                <el-form-item label="加工成本">
                  <el-input v-model="formCost.processingCost" type="number"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="刀具成本">
                  <el-input v-model="formCost.toolCost" type="number" oninput ="value=value.replace(/\-(\-?\d+(\.\d{0,2})?)/)"></el-input>
                </el-form-item>
                <el-form-item label="总成本">
                  <el-input v-model="totalCost" type="number"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="材料成本">
                  <el-input v-model="materialCost" oninput ="value=value.replace(/\-(\-?\d+(\.\d{0,2})?)/)"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="管理成本">
                  <el-input v-model="managementCost" type="number"></el-input>
                </el-form-item>
                <el-form-item label="管理成本比例">
                  <el-input v-model="formCost.proportion" type="number" >
                    <i slot="suffix" style="font-style:normal;margin-right: 10px; line-height: 30px;">%</i>
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-form-item label="工件选择类型">
                <el-select v-model="queryParams.workpieceTypeId" placeholder="请选择" style="width: 30%" clearable>
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
            </el-row>
          </el-form>
        </el-row>
        <el-row>
          <el-col :span="24"><span>设置生产单号 <el-tag>{{electrodeProdOrderNo}}</el-tag>，电极编号 <el-tag>{{electrodeNo}}</el-tag> 的工艺制程</span></el-col>
        </el-row>
        <el-row>
          <elx-editable ref="editable" stripe :data.sync="processList"  :edit-config="{trigger: 'click', mode: 'cell',isTabKey:'true',tabToActive:'true'}"
                        :edit-rules="{name: [{required: true, message: '单元格不能为空', trigger: 'blur'}]}" show-summary :summary-method="getSummaries">
            <elx-editable-column type="index" align="center" width="70"></elx-editable-column>
            <elx-editable-column prop="code" align="center" label="代码" :edit-render="{name: 'ElInput'}"></elx-editable-column>
            <elx-editable-column prop="name" align="center" label="工序名称" :edit-render="{name: 'ElInput'}" ref="mobile"></elx-editable-column>
            <elx-editable-column prop="workHour" align="center" label="工时"  :edit-render="{name: 'ElInputNumber'}"></elx-editable-column>
            <elx-editable-column prop="unitPrice" align="center" label="单价"  :edit-render="{name: 'ElInputNumber'}"></elx-editable-column>
            <elx-editable-column prop="totalPrice" align="center" label="总价">
              <template slot-scope="scope">
                {{ (scope.row.totalPrice = scope.row.workHour *scope.row.unitPrice) | keepTwoNum}}
              </template>
            </elx-editable-column>
            <elx-editable-column prop="remark" align="center" label="备注"  :edit-render="{name: 'ElInput'}"></elx-editable-column>
            <elx-editable-column label="操作" align="center" width="110" :edit-render="{name: 'ElInput'}">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="text"
                  icon="el-icon-plus"
                  @click="handleAdd(scope.row)"
                ></el-button>
                <el-button
                  size="mini"
                  type="text"
                  icon="el-icon-minus"
                  @click="handleDelete(scope.row)"
                ></el-button>
                <el-button
                  size="mini"
                  type="text"
                  icon="el-icon-top"
                  @click="handleAdjustUp(scope.row, scope.$index)"
                ></el-button>
                <el-button
                  size="mini"
                  type="text"
                  icon="el-icon-bottom"
                  @click="handleAdjustDown(scope.row, scope.$index)"
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
        </el-row>
      </el-col>
      <el-col :span="8">
        <el-col :span="24">
          <span>工序列表</span>
          <el-button type="text" @click="table = true" style="margin-left: 10px">设置工艺群组</el-button>
        </el-col>
        <el-divider></el-divider>
        <el-row>
          <!--工序列表查询搜索框-->
          <el-form :model="queryParams" ref="queryForm">
            <el-form-item>
              <el-input
                v-model="searchName"
                placeholder="名称/代码/单价"
                clearable
                prefix-icon="el-icon-search"
                style="width: 100%"
              />
            </el-form-item>
          </el-form>
        </el-row>
        <el-table ref="multipleTable" @row-dblclick="lineClick" :row-style="setColor" v-loading="loading"
                  :data="procedureList.filter(data => !searchName || data.name.toLowerCase().includes(searchName.toLowerCase())
                  || data.code.toLowerCase().includes(searchName.toLowerCase())|| data.unitPrice.toLowerCase().includes(searchName.toLowerCase()))"
                  v-el-table-infinite-scroll infinite-scroll-disabled="disabled">
          <el-table-column type="index" width="50" align="center"/>
          <el-table-column label="名称" align="center" prop="name"/>
          <el-table-column label="代码" align="center" prop="code"/>
          <el-table-column label="单价" align="center" prop="unitPrice"/>
        </el-table>
      </el-col>
    </el-row>
    <!-- 复制其他工件工艺对话框 -->
    <el-dialog :label="label" :visible.sync="open" width="1000px" append-to-body>
      <el-row :gutter="24">
        <el-col :span="14">
          <el-table :data="copyData" v-loading="loading" :default-sort = "{order: 'descending'}" @cell-dblclick="copyClick">
            <el-table-column prop="prodOrderNo" label="生产单号" sortable></el-table-column>
            <el-table-column prop="moduleNo" label="模号"></el-table-column>
            <el-table-column prop="electrodeNo" label="工件号"></el-table-column>
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
    </el-dialog>
    <!--   工艺群组设置-->
    <el-drawer title="设置工艺群组" :visible.sync="table" direction="rtl" size="40%">
      <el-table :data="groupProcessData" @selection-change="handleSelection">
        <el-table-column type="selection" :reserve-selection="true" align="center" />
        <el-table-column row-key="groupName" property="groupName" label="工艺名称"></el-table-column>
        <el-table-column row-key="workpieceTypeName" property="workpieceTypeName" label="工件类型"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-search"
              @click="handleCheck(scope.row)"
            >查看群组详细</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="demo-drawer__footer" style="margin-top: 20px">
        <el-button @click="table = false">取 消</el-button>
        <el-button type="primary" @click="setGroupAddProcess">确定</el-button>
      </div>
    </el-drawer>
    <!-- 查看工艺群组详细对话框 -->
    <el-dialog :label="label" :visible.sync="openGroup" width="400px" append-to-body>
      <el-table :data="groupData" v-loading="loading">
        <el-table-column label="工序代码" prop="code"/>
        <el-table-column label="工序名称" prop="name"/>
        <el-table-column label="单价" prop="unitPrice"/>
      </el-table>
      <div style="margin-top: 20px;margin-left: 40%">
        <el-button @click="openGroup = false" type="danger" style="margin-right: 40%">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {listElectrodeBom, listElectrodeCrafts, saveElectrodeCrafts,listElectrode,delCamElectrodeProcess} from "../../../api/camdesign/electrode"
  import {listWorktime} from "../../../api/order/timecost";
  import {listChangeBom} from "../../../api/order/change";
  import {listQuality} from "../../../api/system/quality";
  import elTableInfiniteScroll from 'el-table-infinite-scroll';
  import {
    getGroupAllProcess,
    getGroupPage,
    getGroupProcessPage,
    getProcessWorkpieceType
  } from "../../../api/system/process";

  export default {
    name: "eleProcess",
    dicts: ['sys_normal_disable'],
    filters: {
      keepTwoNum(value){
        value = Number(value);
        return value.toFixed(2)
      }
    },
    directives: {
      'el-table-infinite-scroll': elTableInfiniteScroll
    },
    data() {
      return {
        // 遮罩层
        loading: true,
        // 总条数
        total: 0,
        // 非多个禁用
        multiple: true,
        //工件总价
        totalPrice:null,
        //搜索条件
        searchName:'',
        // 工艺制程表格数据
        processList: [{
          workHour: '',
          unitPrice:'',
          totalPrice:'',
        }],
        //加工成本数据
        sums:[],
        // 工序表格数据
        procedureList: [],
        // 工艺成本表单参数
        formCost: {
          processingCost:null,
          materialCost:null,
          managementCost:null,
          toolCost:null,
          electrodeCost:null,
          totalCost:null,
        },
        //复制工件工艺表格数据
        copyData:[],
        copyProcessData:[],
        // 弹出层标题
        label: "",
        labelGroup:'工艺群组详细信息',
        // 是否显示弹出层
        open: false,
        openGroup: false,
        //选中工艺列表数据
        currentRowData: null,
        //上一页面信息
        electrodeProdOrderNo:{},
        electrodeNo:{},
        //工序列表滚动框
        disabled:false,
        //材料成本计算参数
        height:'',
        length:'',
        width:'',
        material:'',
        density:'',
        price:'',
        //查询数据
        processFortype:[],
        //工艺群组抽屉打开
        table: false,
        //工艺群组表格数据
        groupProcessData:[],
        //工艺群组详细数据
        groupData:[],
        //工艺群组编号集合
        groupCodeList:[],
        // 查询参数
        queryParams: {
          pageNo: 1,
          pageSize: 40,
        },
        //增加单数
        obj:{
          name:'',
          workHour:'',
          unitPrice:'',
          totalPrice:'',
        },
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
    created(){
      this.getListEquipmentCrafts();
      this.getListEledetail();
      this.getListElectrode();
      this.getListGroup();
      this.getSetting();
      window.addEventListener('keydown',this.handleKeyDown,true)
      //开启键盘监听模式
    },
    mounted() {
      this.electrodeProdOrderNo = this.$route.query.electrodeProdOrderNo
      this.electrodeNo = this.$route.query.electrodeNo
      this.getListMaterial();
    },
    computed: {
      managementCost: function () {
        if (isNaN(parseFloat(this.formCost.processingCost) + parseFloat(this.formCost.materialCost)
          + parseFloat(this.formCost.toolCost) + parseFloat(this.formCost.electrodeCost))) {
          return ''
        } else {
          const he = parseFloat(this.formCost.processingCost) + parseFloat(this.formCost.materialCost)
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
        if (isNaN((parseFloat(this.height)*parseFloat(this.length)*parseFloat(this.width)*parseFloat(this.density)*parseFloat(this.price))/1000000)){
          return ''
        } else{
          const material = (parseFloat(this.height)*parseFloat(this.length)*parseFloat(this.width)*parseFloat(this.density)*parseFloat(this.price))/1000000
          return material.toFixed(2);
        }
      }
    },
    methods: {
      /** 分页查询工艺列表 */
      getListEquipmentCrafts() {
        this.loading = true;
        this.queryParams.workpieceTypeId = '1527498592041537537'
        this.queryParams.eleBomId = this.$route.query.eleBomId
        this.queryParams.status = '0'
        this.queryParams.type = '1'
        listElectrodeCrafts(this.queryParams).then(response => {
          this.procedureList = response.data.records;
          this.total = Number(response.data.total);
          this.loading = false;
        });
      },
      /** 分页查询BOM明细列表 */
      getListEledetail() {
        this.loading = true;
        const arr = [];
        listElectrodeBom(this.queryParams).then(response => {
         response.data.records.forEach(function (item) {
           arr.push({
             electrodeCost: item.electrodeCost,
             materialCost:item.materialCost,
             toolCost:item.toolCost,
             managementCost:item.managementCost,
             processingCost:item.processingCost,
             totalCost:item.totalCost,
             proportion:item.proportion,
             issueSize:item.issueSize,
             issuedQuantity:item.issuedQuantity
           })
         })
          this.formCost = arr[0]
          this.length = response.data.records[0].electrodeLength
          this.height = response.data.records[0].electrodeHeight
          this.width = response.data.records[0].electrodeWidth
          this.material = response.data.records[0].electrodeMaterial
        });
      },
      /** 查询电极工艺详情 */
      getListElectrode() {
        this.queryParams.eleBomId = this.$route.query.eleBomId
        listElectrode(this.queryParams).then(response => {
          this.processList = response.data.records;
        });
      },
      /** 查询材质配置列表 */
      getListMaterial() {
        listQuality(this.queryParams).then(response => {
          let he = response.data.records.find(item => item.code == this.material)
          this.price = he.price
          this.density = he.density
        });
      },
      /** 查询工艺群组列表 */
      getListGroup() {
        this.loading = true;
        getGroupPage(this.queryParams).then(response => {
          this.groupProcessData = response.data.records
        });
      },
      /** 查询工件类型 */
      getSetting() {
        getProcessWorkpieceType(this.queryParams).then(response => {
          this.processFortype = response.data.records;
        });
      },
      //选中一行
      lineClick(val) {
        this.currentRowData = val;
        this.Id = this.currentRowData.id
        if (JSON.stringify(this.processList).indexOf(JSON.stringify(this.currentRowData)) == -1) {
          const o = {
            name:this.currentRowData.name,
            code:this.currentRowData.code,
            unitPrice:this.currentRowData.unitPrice,
            processManHourId:this.currentRowData.id,
          }
          this.processList.push(o);
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
      handleAdd() {
        this.processList.push(JSON.parse(JSON.stringify(this.obj)))
      },
      // 删除
      handleDelete(row) {
        const id = row.id
        if(this.processList.length>0){
          if(this.processList[0].id===undefined){
            if (JSON.stringify(this.processList).indexOf(JSON.stringify(row)) !== -1) {
              var index = this.processList.indexOf(row)
              this.processList.splice(index, 1)
            }
          }else{
            delCamElectrodeProcess({'id':id}).then(response =>{
              this.$modal.msgSuccess("删除成功");
              this.getListElectrode();
            })
          }
        }
      },
      // 上移
      handleAdjustUp(row,index) {
        if (index > 0) {
          const here = this.processList[index].sort;
          const there =this.processList[index-1].sort;
          this.processList[index].sort =  there;
          this.processList[index-1].sort = here;
          let upDate = this.processList[index - 1];
          this.processList.splice(index - 1, 1);
          this.processList.splice(index, 0, upDate);
        } else {
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
      // 工艺群组多选框选中数据
      handleSelection(selection) {
        this.groupCodeList = selection.map(item => item.groupCode)
        this.multiple = !selection.length
      },
      /** 保存工件工艺按钮 */
      handleSave() {
        const  electrodeBomId = this.$route.query.eleBomId;
        const camElectrodeProcessEditIn = [];
        this.processList.forEach(function(item){
          camElectrodeProcessEditIn.push(
            {
              code:item.code,
              name:item.name,
              totalPrice:item.totalPrice + '',
              unitPrice:item.unitPrice + '',
              workHour:item.workHour + '',
              processManHourId:item.processManHourId,
              electrodeBomId: electrodeBomId,
              id:item.id,
              sort:item.sort,
            })
        });
        const data ={
          'bizType':'3',
          'cost':{
            "detailId": electrodeBomId,
            "electrodeCost": this.formCost.electrodeCost,
            "managementCost": this.managementCost+'',
            "materialCost": this.materialCost,
            "processingCost": this.formCost.processingCost,
            "toolCost": this.formCost.toolCost,
            "totalCost": this.totalCost+'',
            "issueSize": this.formCost.issueSize,
            "issuedQuantity": this.formCost.issuedQuantity,
          },
          'camElectrodeProcessEditIn':camElectrodeProcessEditIn,
        }
        if(this.processList.length>0){
          if(this.processList[0].id===undefined){
            saveElectrodeCrafts(data).then(response => {
              this.$modal.msgSuccess("新增工艺成功");
              this.$router.go(-1);
            })
          }else{
            saveElectrodeCrafts(data).then(response => {
              this.$modal.msgSuccess("修改工艺成功");
              this.$router.go(-1);
            })
          }
        }
      },
      /** 取消按钮 */
      handleCancel() {
        this.$router.go(-1);
      },
      /** 复制其他工件工艺 */
      handleCopy() {
        this.open = true;
        this.label = "选择要复制工艺的工件";
        listChangeBom(this.queryParams).then(response => {
          this.copyData = response.data.records;
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
      /** 键盘事件 */
      handleKeyDown(e){
        let key = null;
        if(window.event === undefined){
          key = e.keyCode;
        } else {
          key = window.event.keyCode;
        }
        if (key === 13) {
          this.handleAdd();
        }
      },
      /** 查看工艺群组详细信息  */
      handleCheck(row) {
        this.openGroup = true
        const groupCode = row.groupCode
        getGroupProcessPage({'groupCode':groupCode}).then(res =>{
          this.groupData = res.data.records
        })
      },
      /** 工艺群组选择确定按钮  */
      setGroupAddProcess() {
        const groupCodeList = this.groupCodeList
        getGroupAllProcess({'groupCodeList':groupCodeList}).then(response =>{
          this.processList = response.data
          this.$modal.msgSuccess("应用工艺群组成功");
          this.table = false
        })
      }

    },
  };
</script>
