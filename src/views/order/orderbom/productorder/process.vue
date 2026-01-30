<template>
<div>
<!--  变更工艺页面-->
<el-row :gutter="20" v-if="workType === '0'">
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
       <el-form-item label="发料数量">
         <el-input v-model="formCost.issuedQuantity"></el-input>
       </el-form-item>
     </el-col>
       <el-col :span="6">
         <el-form-item label="刀具成本">
           <el-input v-model="formCost.toolCost" type="number" oninput ="value=value.replace(/\-(\-?\d+(\.\d{0,2})?)/)"></el-input>
         </el-form-item>
         <el-form-item label="总成本">
           <el-input v-model="totalCost" type="number"></el-input>
         </el-form-item>
         <el-form-item label="发料大小">
           <el-input v-model="formCost.issueSize"></el-input>
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
           <el-input  v-model="formCost.proportion" type="number">
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
      <el-col :span="24"><span>设置模号 <el-tag>{{ModuleNo}}</el-tag>，工件号 <el-tag>{{PieceNo}}</el-tag> 的工艺制程 (方向键⬆ ⬇可上下选中某工艺) 快捷键F2为增加工艺，F4为删除高亮选中工艺</span></el-col>
    </el-row>
    <el-row>
      
      <elx-editable id="editable" v-loading="loading" ref="editableList" :row-key="(row)=>row.id"
      stripe :data.sync="processList" :highlight-current-row="true"
                    @keydown.up.native.prevent="moveHighlight(-1)"
                    @keydown.down.native.prevent="moveHighlight(1)"
                    tabindex="0"
                    @keyup.native="handleAdd2"
                    @click.native="selectRow"
                    :edit-config="{trigger: 'click', mode: 'cell',autoClearActive:'true',isDelKey:'true',activeMethod:editEvent}"
                    :edit-rules="{name: [{required: true, message: '单元格不能为空', trigger: 'blur'}]}" show-summary :summary-method="getSummaries"
                    :row-class-name="tableRowClassName" max-height="600px">
         <!-- 拖拽手柄选择器  handle=".drag-handle"-->
        
          <!-- 每一行数据 -->
        <elx-editable-column align="center" width="65">
          <template slot-scope="scope">
            {{scope.$index+1}}
          </template>
        </elx-editable-column> 
       
        <elx-editable-column ref="refColumn" prop="code" align="center" label="工段代码" >
          <template slot-scope="{ row, $index }">
<!--            <el-input v-model="row.code" @change.native="editCode(row)" @keyup.native.enter="nextFocus($event,row)"></el-input>-->
            <el-input @keyup.enter.native="goToInput2('code_' + $index)" :ref="'code_' + $index" v-model="row.code" @change.native="editCode(row)"></el-input>
          </template>
<!--          <template slot-scope="scope">-->
<!--            <el-input v-model="processList.code" placeholder="" />-->
<!--        </template>-->
        </elx-editable-column>
      
        <elx-editable-column class="titleClick" prop="name" align="center" label="工序名称"></elx-editable-column>
        <elx-editable-column prop="workHour" ref="refColumn2" align="center" label="工时" type="default">
          <template slot-scope="{ row,  $index }">
<!--            <el-input v-model="row.workHour" type="number" @keyup.native.enter="nextFocus($event,row)"></el-input>-->
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
<!--            <el-input v-model="row.remark" @keyup.native.enter="nextFocus($event,row)"></el-input>-->
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
        
        <!-- 新增拖拽手柄列 -->
        <elx-editable-column width="50" align="center">
          <template slot-scope="scope" >
            <!-- 此处使用 Element UI 的图标作为拖拽手柄 -->
            <i class="el-icon-rank drag-handle" style="cursor: move;" v-if="scope.row.currentSection === 'N' || scope.row.currentSection == null"></i>
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
  <el-col :span="8">
    <el-col :span="24">
      <span style="font-size: medium">工序列表</span>
      <el-button type="text" @click="table = true" style="margin-left: 10px">设置工艺群组</el-button>
    </el-col>
    <el-divider></el-divider>
    <el-row>
      <!--按工号/姓名/手机号查询搜索框-->
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
              v-el-table-infinite-scroll>
      <el-table-column type="index" width="50" align="center"/>
      <el-table-column label="名称" align="center" prop="name"/>
      <el-table-column label="代码" align="center" prop="code"/>
      <el-table-column label="单价" align="center" prop="unitPrice"/>
    </el-table>
  </el-col>
</el-row>

<!--  变更工时页面-->
<el-row :gutter="20" v-if="workType === '1'">
  <el-col :span="24">
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
            <el-form-item label="发料数量">
              <el-input v-model="formCost.issuedQuantity"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="刀具成本">
              <el-input v-model="formCost.toolCost" type="number" oninput ="value=value.replace(/\-(\-?\d+(\.\d{0,2})?)/)"></el-input>
            </el-form-item>
            <el-form-item label="总成本">
              <el-input v-model="totalCost" type="number"></el-input>
            </el-form-item>
            <el-form-item label="发料大小">
              <el-input v-model="formCost.issueSize"></el-input>
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
              <el-input  v-model="formCost.proportion" type="number">
                <i slot="suffix" style="font-style:normal;margin-right: 10px; line-height: 30px;">%</i>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-row>
    <el-row>
      <el-col :span="24"><span>设置模号 <el-tag>{{ModuleNo}}</el-tag>，工件号 <el-tag>{{PieceNo}}</el-tag> 的工艺制程</span></el-col>
    </el-row>
    <el-row>
      <elx-editable ref="editable" stripe :data.sync="processList"
                    :edit-config="{trigger: 'click', mode: 'cell',autoClearActive:'true',
                    isTabKey:'true',tabToActive:'true',activeMethod:editEventTime}"
                    :edit-rules="{name: [{required: true, message: '单元格不能为空', trigger: 'blur'}]}" show-summary :summary-method="getSummaries"
                    :row-class-name="tableRowClassName" max-height="600px">
        <elx-editable-column align="center" width="65">
          <template slot-scope="scope">
            {{scope.row.index+1}}
          </template>
        </elx-editable-column>
        <elx-editable-column prop="code" align="center" label="工段代码" :edit-render="{name: 'ElInput'}">
          <template slot-scope="{ row }">
            <el-input v-model="row.code" @input="editCode(row)"></el-input>
          </template>
        </elx-editable-column>
        <elx-editable-column prop="name" align="center" label="工序名称"></elx-editable-column>
        <elx-editable-column prop="workHour" align="center" label="工时" type="default" :edit-render="{name: 'ElInputNumber'}"></elx-editable-column>
        <elx-editable-column prop="unitPrice" align="center" label="单价"></elx-editable-column>
        <elx-editable-column prop="totalPrice" align="center" label="总价">
          <template slot-scope="scope">
            {{ (scope.row.totalPrice = scope.row.workHour *scope.row.unitPrice) | keepTwoNum}}
          </template>
        </elx-editable-column>
        <elx-editable-column prop="remark" align="center" label="备注"></elx-editable-column>
        <elx-editable-column prop="outGoing" align="center" label="是否外发"  :edit-render="{name: 'ElSwitch', type: 'visible'}"></elx-editable-column>
      </elx-editable>
    </el-row>
    <el-row style="margin-top: 10px;margin-left: 100px">
      <el-button
        size="small"
        plain
        type="primary"
        icon="el-icon-check"
        :disabled="isDisabled"
        v-preventReClick="2000"
        @click="handleConfirmProfile"
      >保存</el-button>
      <el-button
        size="small"
        plain
        type="warning"
        icon="el-icon-close"
        @click="handleCancel"
      >取消</el-button>
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
      <el-table-column label="工时" prop="workHour"/>
      <el-table-column label="单价" prop="unitPrice"/>
    </el-table>
    <div style="margin-top: 20px;margin-left: 40%">
      <el-button @click="openGroup = false" type="danger" style="margin-right: 40%">取 消</el-button>
    </div>
  </el-dialog>
  <!-- 工时是否相乘 -->
  <el-dialog :label="label" :visible.sync="openWorkHour" width="400px" append-to-body>
    <div>
      发料数量大于1，是否将发料数量×工时×
      <el-input v-model="percentage" type="number" oninput="if(!/^[0-9]+$/.test(value)) value=value.replace(/\D/g,'');if(value>100)value=100;if(value<0)value=null" style="width: 80px"></el-input>%
    </div>
    <div style="margin-top: 20px;margin-left: 30%">
      <el-button type="danger" @click="confirmWorkHour">确 认</el-button>
      <el-button type="danger" @click="unConfirmWorkHour" >取 消</el-button>
    </div>
  </el-dialog>

  <!-- 工时是否相乘 -->
  <el-dialog v-loading="loading" :label="label2" :visible.sync="openSave" width="380px" tabindex="0" append-to-body>
    <div style="margin-left: 5%">
      修改工艺成功，继续下个零件的编辑，请继续Enter
    </div>
    <div style="margin-top: 10px">
     手动保存，点击下方按钮，并手动点击跳转下一个零件
    </div>
    <div style="margin-top: 10px;margin-bottom: 10px;margin-left: 40%">
      <el-button type="primary" @click="routerNextPart">保存</el-button>
    </div>
    <div style=";margin-left: 8%">
      如果不保存，则点击取消(ESC)，并新增工艺(F2)
    </div>
    <div style="margin-top: 10px;margin-bottom: 10px;margin-left: 40%">
      <el-button type="danger" @click="cancelSave">取 消</el-button>
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
  import { listBomDetail } from '@/api/order/orderbom'
  import { downloadFTP } from '@/api/production/semiAutomation'
  import Sortable from 'sortablejs';


  export default {
    name: "Process",
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
    components: {
    },
    data() {
      return {
        // 遮罩层
        loading: true,
        // 总条数
        total: 0,
        copyTotal:0,
        // 非多个禁用
        multiple: true,
        //
        currentRowIndex: -1,
        currentColumnIndex: -1,
        //工件总价
        totalPrice:null,
        //搜索条件
        searchName:'',
        // 工艺制程表格数据
        processList: [{
          id: '',
          code:'',
          workHour: '',
          unitPrice:'',
          totalPrice:'',
        }],
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
          proportion:null
        },
        //总成本数据
        sums:[],
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
        processListClear:[],
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
        //跳转判断参数
        workType:'',
        //
        // inputDoms: "",
        // tableIndex: 0,
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
       // 表格 body 属性（保持与组件内部结构兼容）
    tbodyProps() {
      return {
        attrs: {
          class: 'elx-editable__body' // 匹配组件内部表格样式
        }
      };
    },
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
       //开启键盘监听模式
      // window.addEventListener('keydown',this.handleKeyDown,true)
       // this.$nextTick(() => {
       //   this.initInputDOM();
       // });
    },
    watch:{
      // $route() {
        // this.ModuleNo = this.$route.query.moduleNo
        // this.PieceNo = this.$route.query.pieceNo
        // this.quantity = this.$route.query.quantity
        // this.workType = this.$route.query.workType
        // this.bomId = this.$route.query.bomId
        // this.DetailId = this.$route.query.DetailId
        // this.getListEquipmentCrafts();
        // this.getList();
        // this.getListTime();
        // this.getSetting();
        // this.getListGroup();
      // },
    },
    mounted() {
      // 等待组件渲染完成后初始化拖拽功能
      this.$nextTick(() => {
         // 根据实际 DOM 结构查找 tbody 元素（请根据实际情况调整选择器）
         if (this.$refs.editableList && this.$refs.editableList.$el) {
           const tableBody = this.$refs.editableList.$el.querySelector('tbody');
           if (tableBody) {
             Sortable.create(tableBody, {
               // 只有拖拽手柄生效
               handle: '.drag-handle',
               animation: 150,
                // 拖拽前判断是否允许拖拽
               onMove: (evt) => {
                  // 通过 DOM 获取索引
                  const getIndex = (el) => {
                    // el 是 <tr>，找它在 tbody 下的索引
                    return Array.from(tableBody.children).indexOf(el);
                  };
                  const fromIndex = getIndex(evt.dragged);
                  const toIndex = getIndex(evt.related);
                  // 获取对应的数据
                  const fromRow = this.processList[fromIndex];
                  const toRow = this.processList[toIndex];
                  // 只有 currentSection === 'N' 或 null 的行允许拖拽
                  if (
                    (fromRow.currentSection !== 'N' && fromRow.currentSection !== null) ||
                    (toRow.currentSection !== 'N' && toRow.currentSection !== null)
                  ) {
                    return false; // 禁止拖拽
                  }
                  return true;
                },
               onEnd: evt => {
                // 拖拽结束后，更新 processList 的顺序
               // evt.oldIndex 和 evt.newIndex 为拖拽前后在 DOM 中的索引
               if (evt.oldIndex !== evt.newIndex) {
                      console.log(evt.oldIndex+" code:"+this.processList[evt.oldIndex].code, evt.newIndex+" code:"+this.processList[evt.newIndex].code);
                      /* if (evt.oldIndex < 0 || evt.oldIndex >= this.processList.length || evt.newIndex < 0 || evt.newIndex >= this.processList.length) {
                        throw new Error('Index out of bounds');
                      } */
    
                      // 克隆数组（可选，根据业务是否需要避免原数组直接修改）
                      const newList = [...this.processList];
                      // 从旧位置移除被拖拽的元素，返回数组中被删除的项数组（取第一个，即被拖拽的那一项）
                      const movedItem = newList.splice(evt.oldIndex, 1)[0];
                      // 将被拖拽的元素插入到新位置，splice 的第二个参数为0表示不删除其他项
                      newList.splice(evt.newIndex, 0, movedItem);
                      
                      newList.forEach((row, index) => {
                        this.$set(row, 'index', index); // 使用 Vue.set 确保响应式
                      });
                      // 更新整个数组的 sort 字段，确保每个元素的排序号都正确
                      newList.forEach((item, index) => {
                        // 如果需要从1开始，可以使用 index+1；如果从0开始，则直接使用 index
                        item.sort = index + 1;
                      });
                      // 将新顺序赋值回 processList
                      this.processList = newList;
                      // 强制刷新表格
                      this.$nextTick(() => {
                        this.$refs.editableList.doLayout();
                      });
                      
              }
            }
          });
          }
        }
      });
      this.ModuleNo = this.$route.query.moduleNo
      this.PieceNo = this.$route.query.pieceNo
      this.quantity = this.$route.query.quantity
      this.workType = this.$route.query.workType
      this.bomId = this.$route.query.bomId
      this.DetailId = this.$route.query.DetailId
      if(this.$route.query.type === undefined){
        this.type = '0'
      }else {
        this.type = this.$route.query.type
      }
     
    },
    methods: {
     
      // initInputDOM() {
      //   //获取id为table-form下的所有input 框
      //   const inputDoms = document.querySelectorAll(
      //     "#editable .el-input__inner"
      //   );
      //   console.log(inputDoms)
      //   //遍历这个input框给他们一个标识
      //   inputDoms.forEach((item, index) => {
      //     item.setAttribute("data-index", index);
      //   });
      //   this.inputDoms = inputDoms;
      // },
      // nextFocus(event, row) {
      //   const index = event.target.getAttribute("data-index");
      //   const nextIndex = parseInt(index) + 1;
      //   const length = this.inputDoms.length;
      //   if (nextIndex < length) {
      //     this.inputDoms[nextIndex].focus();
      //   } else {
      //     this.inputDoms[0].focus();
      //   }
      // },
      /** 分页查询工艺列表 */
      getListEquipmentCrafts() {
        this.loading = true;
        this.queryParams.type = '0'
        listEquipmentCrafts(this.queryParams).then(response => {
          this.procedureList = response.data.records;
          let codes = this.procedureList.map(item => item.code);
          this.processListClear = [...new Set(codes)];
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
                    this.loading = false
                    signal =false
                    break
                  }else if(this.processList[i].code === '' || this.processList[i].name === ''){
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
              this.$modal.msgError("没有下个零件可编辑，请及时转生产单,继续回车返回上个页面");
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
          path: '/order/orderbom-edit/productorder/process',
          query: {
            orderNo: this.routerList.prodOrderNo,
            DetailId: this.routerList.id,
            moduleNo: this.routerList.moduleNo,
            pieceNo: this.routerList.pieceNo,
            bomId: this.queryParamsBom.bomID,
            quantity: this.routerList.quantity,
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
      // 工艺群组多选框选中数据
      handleSelection(selection) {
        this.groupCodeList = selection.map(item => item.groupCode)
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
                this.openSave = false
                this.$router.go(-1);
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
        // console.log(this.formCost.issuedQuantity)
        this.percentage = ''
        const groupCodeList = this.groupCodeList
        const arr = []
        if(this.formCost.issuedQuantity == 1){
        getGroupAllProcess({'groupCodeList':groupCodeList}).then(response =>{
          this.processList = response.data
          this.$modal.msgSuccess("应用工艺群组成功");
          this.table = false
        })
        }else if (this.formCost.issuedQuantity > 1 ){
          this.table = false
          this.openWorkHour = true
        }
      },
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
      /** 工时确认修改按钮 */
      confirmWorkHour(){
        // console.log(this.groupCodeList)
        // console.log(this.percentage)
        if (this.percentage == ''){
          this.percentage = 100
        }
        getGroupAllProcess({'groupCodeList':this.groupCodeList}).then(response =>{
          // console.log(this.percentage)
          // console.log(response.data[0].workHour)
          this.processList = response.data
          for (let i = 0 ; i <= this.processList.length ; i++){
            // console.log(this.processList[i].workHour)
            if (this.processList[i].workHour == 'NaN' || this.processList[i].workHour == undefined){
              this.processList[i].workHour = 0
            }else if(this.processList[i].workHour !== 'NaN' && this.processList[i].workHour !== undefined){
              this.processList[i].workHour = this.processList[i].workHour * this.formCost.issuedQuantity * this.percentage * 0.01
            }
          }
          this.$modal.msgSuccess("应用工艺群组成功");
        })
        this.openWorkHour = false
      },
      /** 工时取消修改按钮 */
      unConfirmWorkHour(){
        getGroupAllProcess({'groupCodeList':this.groupCodeList}).then(response =>{
          this.processList = response.data
          this.$modal.msgSuccess("应用工艺群组成功");
          this.openWorkHour = false
        })
      },

      /** 工艺取消保存按钮 */
      cancelSave(){
        this.openSave = false
        this.flag = false
        this.processList.splice(this.processList.length,0,JSON.parse(JSON.stringify(this.obj)))
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
      }
    },
  };
</script>

<style>
.highlight {
  border: 2px solid red; /* 自定义高亮样式 */
}
.drag-handle {
  cursor: move; /* 设置鼠标样式为移动 */
  display: inline-block; /* 设置为行内块元素 */
  width: 20px; /* 设置宽度 */
  height: 20px; /* 设置高度 */
  background-color: #409EFF; /* 设置背景颜色 */
  color: #fff; /* 设置文字颜色 */
  text-align: center; /* 设置文字居中 */
  line-height: 20px; /* 设置行高 */
  border-radius: 50%; /* 设置圆角 */
  margin-right: 10px; /* 设置右边距 */
}
/* 可根据需要自定义拖拽手柄样式 */



</style>

