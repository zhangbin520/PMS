<template>
  <div class="app-container">
  <el-row :gutter="20">
    <el-col><span></span></el-col>
    <el-col :span="24">
      <el-form :model="queryParams" ref="queryForm" v-show="showSearch" :inline="true" label-width="90px">
        <el-form-item label="派工单号" prop="customerName">
          <el-input
            v-model="queryParams.pno"
            placeholder="派工单号"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="模号" prop="moduleNo">
          <el-input
            v-model="queryParams.moduleNo"
            placeholder="模号"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="件号" prop="pieceNo">
          <el-input
            v-model="queryParams.pieceNo"
            placeholder="件号"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="版本" prop="versionNo">
          <el-input
            v-model="queryParams.versionNo"
            placeholder="请输入版本"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="生产单号" prop="prodOrderNo">
          <el-input
            v-model="queryParams.prodOrderNo"
            placeholder="请输入工单号"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="需求日期" prop="demandDate">
          <el-input
            v-model="queryParams.demandDate"
            placeholder="请输入需求日期"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="交货等级" prop="deliveryLevel">
          <el-input
            v-model="queryParams.deliveryLevel"
            placeholder="请输入交货等级"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="订单状态" prop="orderStatus">
          <el-select v-model="queryParams.orderStatus" placeholder="请选择" clearable  @change="handleQuery">
            <el-option
              v-for="item in orderStatusChange"
              :key="item.status"
              :label="item.name"
              :value="item.status">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="padding-left: 50px">
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
          <el-button
            size="mini"
            round
            style="background-color: #FF6B6B;color: #ffffff"
            icon="el-icon-close"
            :disabled="multiple"
            @click="handleCancel"
          >批量取消</el-button>
          <el-button
            size="mini"
            round
            style="background-color: rgb(30 52 187);color: #ffffff"
            icon="el-icon-refresh-left"
            :disabled="multiple"
            @click="handleRestore"
          >批量恢复</el-button>
        </el-form-item>
      </el-form>
<!--        <el-table v-loading="loading" :data="orderListOut" style="width: 100%" border>-->
<!--          <el-table-column type="expand">-->
<!--            <template slot-scope="props">-->
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
              <el-table v-loading="loading" :data="orderList" @selection-change="handleSelectionChange" max-height="750px" border>
              <el-table-column type="selection" width="50" align="center" :selectable="selected" />
              <el-table-column label="操作" align="center" width="250" class-name="small-padding fixed-width">
                <template slot-scope="scope">
                  <el-button
                    slot="reference"
                    type="primary"
                    size="mini"
                    @click="handleChangeProcess(scope.row)"
                    v-if="scope.row.orderStatus !== '1'"
                  >变更工艺</el-button>
                  <el-button
                    type="warning"
                    style="margin-left: 5px"
                    size="mini"
                    @click="handleChangeFiles(scope.row)"
                    v-if="scope.row.orderStatus !== '1'"
                  >变更图档</el-button>
                  <el-button
                    type="danger"
                    style="margin-left: 5px"
                    size="mini"
                    @click="handleChangeVersionNo(scope.row)"
                    v-if="scope.row.orderStatus !== '1'"
                  >变更版次</el-button>
                  <el-button
                    type="info"
                    style="margin-left: 5px"
                    size="mini"
                    @click="handleChangeWorkHour(scope.row)"
                    v-if="scope.row.orderStatus !== '1' && role.includes('生管') || scope.row.orderStatus !== '1' && role.includes('超级管理员')"
                  >变更工时</el-button>
                  <el-button
                    type="success"
                    style="margin-left: 5px"
                    size="mini"
                    @click="handleTurn(scope.row)"
                    v-preventReClick="2000"
                    v-if="scope.row.orderStatus !== '1' && scope.row.bgDetailId != null"
                  >转生产单</el-button>
                </template>
              </el-table-column>
                <el-table-column label="派工单号" align="center" prop="pNo" width="110"/>
                <el-table-column label="操作人" align="center" prop="updateBy" />
              <el-table-column label="订单状态" align="center" prop="orderStatus">
                <template slot-scope="scope">
                  <el-tag v-if="scope.row.orderStatus =='0'">待恢复</el-tag>
                  <el-tag v-if="scope.row.orderStatus =='1'" type="danger">已取消</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="模号" align="center" prop="moduleNo"/>
              <el-table-column label="工件号" align="center" prop="pieceNo"/>
              <el-table-column label="版本" align="center" prop="versionNo"/>
              <el-table-column label="品名" align="center" prop="pinName" />
              <el-table-column label="生产单号" align="center" prop="prodOrderNo" width="150"/>
              <el-table-column label="工艺制程" align="center" prop="process" width="150" :show-overflow-tooltip="true"/>
              <el-table-column label="数量" align="center" prop="quantity" />
              <el-table-column label="需求日期" align="center" prop="demandDate" width="110"/>
              <el-table-column label="交货等级" align="center" prop="deliveryLevel">
                <template slot-scope="scope">
                  <el-tag v-if="scope.row.deliveryLevel =='0'" type="danger">特急件</el-tag>
                  <el-tag v-if="scope.row.deliveryLevel =='1'" type="warning">急件</el-tag>
                  <el-tag v-if="scope.row.deliveryLevel =='2'">一般</el-tag>
                </template>
              </el-table-column>

        </el-table>
      <div align="center">
        <!--变更管理分页组件-->
        <pagination
          v-show="total>0"
          :total="total"
          :page.sync="queryParams.pageNo"
          :limit.sync="queryParams.pageSize"
          @pagination="getList"
        />
        <el-row style="margin-top: 30px">
          <el-button
            size="mini"
            round
            style="background-color: #F0F3BD;color: #011627"
            icon="el-icon-refresh-left"
            :disabled="multiple"
            @click="handleRecover"
          >放弃变更</el-button>
          <el-button
            size="mini"
            round
            style="background-color: #6D6875;color: #ffffff"
            icon="el-icon-check"
            :disabled="multiple"
            v-preventReClick="2000"
            @click="handleTurnMany"
          >批量转生产单</el-button>
          <el-button
            size="mini"
            round
            style="background-color: #4ECDC4;color: #ffffff"
            icon="el-icon-check"
            :disabled="multiple"
            @click="handlePicture"
          >确认换图</el-button>
        </el-row>
      </div>
      </el-col>
    </el-row>

    <!--    客户图档对话框-->
    <el-dialog v-dialog-drag :title="files.title" :visible.sync="files.open" width="1000px">
      <el-row :gutter="24">
        <el-col :span="12">
          <span>工件图档</span>
          <el-button
            type="success"
            circle
            icon="el-icon-upload2"
            style="float: right"
            @click="handleAddDrawing"
          ></el-button>
          <el-table :data="filesData">
            <el-table-column property="name" label="图纸名称"></el-table-column>
            <el-table-column label="操33作">
              <template slot-scope="scope">
                <el-tooltip class="item" effect="dark" content="变更客户图档" placement="top-start">
                  <el-button
                    type="warning"
                    circle
                    icon="el-icon-refresh"
                    @click="handleChangeDrawing(scope.row)"
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
                <el-tooltip class="item" effect="dark" content="删除客户图档" placement="top-start">
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
            v-show="totalDrawing>0"
            :total="totalDrawing"
            :page.sync="queryParamsDrawing.pageNo"
            :limit.sync="queryParamsDrawing.pageSize"
            @pagination="getListFile"
          />
        </el-col>
        <el-col :span="12">
          <span>公共图档</span>
          <el-button
            type="success"
            circle
            icon="el-icon-upload2"
            style="float: right"
            @click="handleAddPublicDrawing"
          ></el-button>
          <el-table :data="publicFilesData">
            <el-table-column property="name" label="图纸名称"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-tooltip class="item" effect="dark" content="变更客户图档" placement="top-start">
                  <el-button
                    type="warning"
                    circle
                    icon="el-icon-refresh"
                    @click="handleChangePublicDrawing(scope.row)"
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
                <el-tooltip class="item" effect="dark" content="删除客户图档" placement="top-start">
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
            v-show="totalPublicDrawing>0"
            :total="totalPublicDrawing"
            :page.sync="queryParamsPublicDrawing.pageNo"
            :limit.sync="queryParamsPublicDrawing.pageSize"
            @pagination="getListPublicFile"
          />
        </el-col>
      </el-row>
    </el-dialog>
    <!-- 变更图档对话框 -->
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
    <!-- 修改版次对话框 -->
    <el-dialog :title="version.title" :visible.sync="version.open" width="400px" append-to-body>
      <el-form ref="form" :model="form" label-width="100px">
       <el-form-item label="版次" prop="versionNo">
         <el-input v-model="form.versionNo" placeholder=""></el-input>
       </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="version.open = false" type="danger">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {
    changeTransferToProductionOrder, editVersionNo,
    listChangeBom,
    listExperence,
    processRecovery,
    updateDrawingFile,
    wordChange
  } from "../../../api/order/change"
  import {
    delDrawingFile,
    getDrawingFile,
    getPublicDrawingFile, listBomDetail,
    listOrderBom,
    turnManyProduction, uploadDrawingFile, uploadFormFile
  } from "../../../api/order/orderbom";
  import global from "../../../store/global";
  import {getUserProfile} from "../../../api/system/user";
  import downloadGlobal from '@/store/downloadGlobal'

  export default {
    name: "Change",
    dicts: ['sys_normal_disable'],
    inject:['reload'],
    data() {
      return {
        // 遮罩层
        loading: true,
        // 总条数
        total: 0,
        totalDrawing:0,
        totalPublicDrawing:0,
        // 显示搜索条件
        showSearch: true,
        // 非多个禁用
        multiple: true,
        // 表格数据
        orderList: [],
        orderListOut:[],
        //派工单号
        PgNo:{},
        //订单BOM
        BomId:[],
        // 加工履历数据
        experenceList: [],
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        //选中数组
        orderNo:[],
        Ids:[],
        ids:[],
        role:'',
        //工件号
        PieceNo:'',
        //工件图档表格数据
        filesData:[],
        prodOrderNoFile:'',
        bomId:[],
        filesId:'',
        //公共图档表格数据
        publicFilesData:[],
        //变更明细ID
        bgDetailId:'',
        bgType:'',
        //新接口工号
        personNo:'',
        //工件图档参数
        files:{
          // 是否显示弹出层
          open: false,
          // 弹出层标题
          title: "工件图档",
        },
        //变更图档参数
        filesChange:{
          // 是否显示弹出层
          open: false,
          // 弹出层标题
          title: "工件图档",
        },
        fileList:[],
        changeStatus:'',
        updateStyle:'',
        fileStatus:'',
        //变更图档参数
        filesUpdate:{
          // 是否显示弹出层
          open: false,
          // 弹出层标题
          title: "工件图档",
        },
        //变更版次参数
        version:{
          // 是否显示弹出层
          open: false,
          // 弹出层标题
          title: "工件图档",
        },
       //变更版次表单数据
        form:{},
        versionDetailId:'',
        //根据订单状态查询
        orderStatusChange:[{
          "name": "待恢复",
          "status":"0"
        },{
          "name": "已取消",
          "status":"1"
        }],
        // 查询参数
        queryParams: {
          pageNo: 1,
          pageSize: 10,
          orderStatus:"0"
        },
        // 查询参数
        queryParamsDrawing: {
          pageNo: 1,
          pageSize: 10,
        },
        queryParamsPublicDrawing:{
          pageNo: 1,
          pageSize: 10,
        }
      };
    },
    created() {
      this.getList();
      this.getListOrder();
      this.getListUser();
    },
    watch: {
      '$route' () {
        this.getList();
        this.getListOrder();
      }
    },
    methods: {
      /** 分页查询变更管理 */
      getList() {
        this.loading = true;
        const orderList = [];
        const orderListOut = [];
        listChangeBom(this.queryParams).then(response => {
          response.data.records.forEach(function(item){
            item.bomDetailDtoList.forEach(function(d) {
                orderList.push(
                {
                  orderStatus:d.orderStatus,
                  moduleNo:d.moduleNo,
                  pieceNo:d.pieceNo,
                  versionNo:d.versionNo,
                  pinName:d.pinName,
                  quantity:d.quantity,
                  prodOrderNo:d.prodOrderNo,
                  demandDate:d.demandDate,
                  deliveryLevel:d.deliveryLevel,
                  detailId:d.detailId,
                  pNo:d.pNo,
                  process:d.process,
                  bomId:d.bomId,
                  bgDetailId:d.bgDetailId,
                  updateBy:d.updateBy,
                })

            })
            orderListOut.push(item.pNo)
          })
          this.orderList = orderList
          // this.orderListOut = orderListOut
          // this.PgNo = orderListOut.join('')
          this.total = response.data.total;
          this.loading = false;
        });
      },
      /** 分页查询订单BOM列表 */
      getListOrder() {
        this.loading = true;
        listOrderBom(this.queryParams).then(response => {
         this.BomId = response.data.records[0].id;
          this.loading = false;
        });
      },
      /** 分页查询公共图档列表 */
      getListPublicDrawings() {
        this.queryParamsPublicDrawing.id = this.bomId
        getPublicDrawingFile(this.queryParamsPublicDrawing).then(res =>{
          this.publicFilesData = res.data.records
          this.totalPublicDrawing = res.data.total
        })
      },
      /** 分页查询工件图档列表 */
      getListDrawings() {
        this.queryParamsDrawing.prodOrderNo = this.prodOrderNoFile
        getDrawingFile(this.queryParamsDrawing).then(res =>{
          this.filesData = res.data.records
          this.totalDrawing = res.data.total
        })
      },
      /** 查询登录用户信息*/
      getListUser() {
        getUserProfile().then(response => {
          this.role = response.roleGroup
          this.personNo = response.data.userName
        });
      },
      // 订单BOM表单重置
      reset() {
        this.form = {
          versionNo: undefined,
        };
        this.resetForm("form");
      },
      // 多选框选中数据
      handleSelectionChange(selection) {
        
        const arr = selection.filter(item => {
          return item.bgDetailId != null
        })
        this.Ids = arr.map(item => item.detailId);
        this.ids = selection.map(item => item.detailId);
        this.multiple = !selection.length;
      },
      /** 批量取消 */
      handleCancel() {
        const ids = this.ids
        processRecovery({'ids':ids,'orderStatus':1}).then(response => {
          this.$modal.msgSuccess("批量取消成功");
          this.getList();
        })
      },
       /** 批量恢复 */
      handleRestore(){
        this.$confirm('是否确认恢复?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const ids = this.ids
          processRecovery({'ids':ids,'orderStatus':2}).then(response => {
            this.$modal.msgSuccess("批量恢复成功");
            this.getList();
          })  
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消恢复'
          });
        });
      },
      /** 搜索按钮操作 */
      handleQuery() {
        this.queryParams.pageNo = 1;
        this.getList();
      },
      /** 变更工艺 */
      handleChangeProcess(row) {
        if(row.bgDetailId === undefined){
          this.bgDetailId = row.detailId
          this.bgType = '1'
        }else {
          this.bgDetailId = row.bgDetailId
          this.bgType = '0'
        }
        this.$router.push({
          path:'/order/orderbom-edit/productorder/process',
          query:{
            DetailId: this.bgDetailId,
            moduleNo: row.moduleNo,
            pieceNo: row.pieceNo,
            type: this.bgType,
            quantity:row.quantity,
            workType: '0'
          },
        })
      },
      /** 变更工时 */
      handleChangeWorkHour(row) {
        this.$router.push({
          path:'/order/orderbom-edit/productorder/process',
          query:{
            DetailId: row.detailId,
            moduleNo: row.moduleNo,
            pieceNo: row.pieceNo,
            type: '0',
            quantity:row.quantity,
            workType: '1'
          },
        })
      },
      /** 变更图档 */
      getListPublicFile() {
        this.queryParamsPublicDrawing.id = this.bomId
        getPublicDrawingFile(this.queryParamsPublicDrawing).then(res =>{
          this.publicFilesData = res.data.records
          this.totalPublicDrawing = res.data.total
        })
      },
      getListFile() {
        this.queryParamsDrawing.prodOrderNo = this.prodOrderNoFile
        getDrawingFile(this.queryParamsDrawing).then(res =>{
          this.filesData = res.data.records
          this.totalDrawing = res.data.total
        })
      },
      handleChangeFiles(row) {
        this.prodOrderNoFile = row.prodOrderNo
        this.bomId = row.bomId
        this.detailId = row.detailId
        this.files.open = true
        this.getListFile();
        this.getListPublicFile();
      },
      /** 新增工件图档 */
      handleAddDrawing() {
        this.fileStatus = '0'
        this.filesChange.open = true
      },
      /** 新增公共图档 */
      handleAddPublicDrawing() {
        this.fileStatus = '1'
        this.filesChange.open = true
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
      /** 删除客户图档 */
      handleDeleteDrawing(row) {
        const id = row.id
        const prodOrderNo = row.prodOrderNo
        const dispatchOrderNo = row.dispatchOrderNo
        const changeNo = this.prodOrderNoFile
        if(prodOrderNo == undefined) {
          delDrawingFile({'id':id,'orderNo':dispatchOrderNo,'changeNo':changeNo}).then(res =>{
            this.$modal.msgSuccess("删除公共图档成功");
            this.getListDrawings();
            this.getListPublicDrawings();
          })
        }else {
          delDrawingFile({'id':id,'orderNo':prodOrderNo,'changeNo':changeNo}).then(res =>{
            this.$modal.msgSuccess("删除工件图档成功");
            this.getListDrawings();
            this.getListPublicDrawings();
          })
        }
      },
      /** 更换工件图档 */
      handleChangeDrawing(row) {
        this.updateStyle = '0'
        this.fileStatus = '2'
        this.filesId = row.id
        this.filesChange.open = true
      },
      /** 更换公共图档 */
      handleChangePublicDrawing(row) {
        this.updateStyle = '0'
        this.fileStatus = '3'
        this.filesId = row.id
        this.filesChange.open = true
      },
      /** 放弃变更 */
      handleRecover() {
        const ids = this.ids
        processRecovery({'ids':ids,'orderStatus':0}).then(response => {
          this.$modal.msgSuccess("放弃变更成功");
          this.getList();
        })
      },
      /** 确认换图 */
      handlePicture() {
        const ids = this.ids
        processRecovery({'ids':ids,'orderStatus':0}).then(response => {
          this.$modal.msgSuccess("换图成功");
          this.getList();
        })
      },
      
      /** 转生产单按钮 */
      handleTurn(row){
        const ids = row.detailId
        changeTransferToProductionOrder({'ids':[ids]}).then(response => {
          this.$modal.msgSuccess("转生产单成功");
          this.getList();
        })
      },
      /** 批量转生产单 */
      handleTurnMany() {
        const ids = this.Ids
        changeTransferToProductionOrder({'ids':ids}).then(response => {
          this.$modal.msgSuccess("批量转生产单成功");
          this.getList();
        })
      },
      /** 客户图档变更 */
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
        if(this.fileStatus === '0') {
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
          formData.append('detailId', this.detailId)
          formData.append('userName',this.personNo)
          //自定义的接口也可以用ajax或者自己封装的接口
          uploadDrawingFile(formData).then(res => {
            if (res.code === 200) {
              this.$message.success('上传成功');
              this.filesChange.open = false;
              this.getListDrawings();
              this.getListPublicDrawings();
            } else {
              this.$message.error('上传失败');
            }
            //清空fileList
            this.fileList = []
          })
        }else if(this.fileStatus === '2') {
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
          formData.append('detailId', this.detailId)
          formData.append('drawId', this.filesId)
          formData.append('changeNo',this.prodOrderNoFile)
          formData.append('userName',this.personNo)
          //自定义的接口也可以用ajax或者自己封装的接口
          updateDrawingFile(formData).then(res => {
            if (res.code === 200) {
              this.$message.success('上传成功');
              this.filesChange.open = false;
              this.getListDrawings();
              this.getListPublicDrawings();
            } else {
              this.$message.error('上传失败');
            }
            //清空fileList
            this.fileList = []
          })
        }else if(this.fileStatus === '1'){
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
          formData.append('changeNo',this.prodOrderNoFile)
          formData.append('userName',this.personNo)
          //自定义的接口也可以用ajax或者自己封装的接口
          updateDrawingFile(formData).then(res => {
            if (res.code === 200) {
              this.$message.success('上传成功');
              this.filesChange.open = false;
              this.getListDrawings();
              this.getListPublicDrawings();
            } else {
              this.$message.error('上传失败');
            }
            //清空fileList
            this.fileList = []
          })
        }else if(this.fileStatus === '3'){
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
          formData.append('drawId', this.filesId)
          formData.append('changeNo',this.prodOrderNoFile)
          formData.append('userName',this.personNo)
          //自定义的接口也可以用ajax或者自己封装的接口
          updateDrawingFile(formData).then(res => {
            if (res.code === 200) {
              this.$message.success('上传成功');
              this.filesChange.open = false;
              this.getListDrawings();
              this.getListPublicDrawings();
            } else {
              this.$message.error('上传失败');
            }
            //清空fileList
            this.fileList = []
          })
        }
      },
      /** 多选框禁选 */
      selected(row,index){
        if (row.orderStatus === '1') {
          return false //不可勾选
        } else {
          return true; //可勾选
        }
      },
      /** 修改版次按钮 */
      handleChangeVersionNo(row) {
        this.version.title = "修改版次"
        this.version.open = true
        this.reset()
        this.versionDetailId = row.prodOrderNo
      },
      submitForm() {
        const data = {
          prodOrderNo:this.versionDetailId,
          versionNo: this.form.versionNo
        }
        editVersionNo(data).then(res =>{
          this.$modal.msgSuccess("修改版次成功")
          this.version.open = false
          this.getList()
        })
      },
    }
  };
</script>


