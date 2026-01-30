<template>
  <div class="app-container">
    <el-card>
      <el-form :model="queryParamsEquipment" ref="queryForm" :inline="true">
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
            <el-button style="margin-left: 10px;margin-right: 10px" type="primary" icon="el-icon-search" size="mini"
                       @click="handleQuery"
            >查询
            </el-button>
          </el-form-item>
          <el-form-item label="" prop="deviceNo">
            <el-input
              v-model="queryParamsEquipment.deviceNo"
              placeholder="输入设备编号"
              clearable
              size="small"
              style="width: 200px"
              @keyup.enter.native="handleQueryAdd"
            />
          </el-form-item>
          <el-form-item>
            <el-button style="margin-left: 10px" type="primary" icon="el-icon-plus" size="mini"
                       @click="handleQueryAdd"
            >查询添加
            </el-button>
          </el-form-item>
          <div style="float: right">
            <el-form-item label="姓名：">
              <el-tag>{{ userName }}</el-tag>
            </el-form-item>
            <el-form-item label="工号：">
              <el-tag>{{ personNo }}</el-tag>
            </el-form-item>
            <el-form-item label="部门：">
              <el-tag>{{ deptName }}</el-tag>
            </el-form-item>
          </div>
        </el-row>
      </el-form>
    </el-card>
    <el-card>
      <el-row>
        <el-col :span="24">
          <el-table v-loading="loading" :data="productionList" border @header-click="clickFunPre"
                    :row-class-name="tableRowClassName" max-height="600px"
          >
            <el-table-column type="index" label="序号" width="50" align="center"/>
            <!-- <el-table-column label="操作" width="320" align="center" class-name="small-padding fixed-width">
            </el-table-column> -->
            <el-table-column label="机床治具RFID" align="center" key="rfid" prop="rfid" width="120px">
              <template slot-scope="scope">
                <el-input v-model="scope.row.rfid" @change="selectEquement(scope.row)" autofocus="true"
                          ref="input0" @keyup.enter.native="handelTab(scope.row.index,$event)"
                >{{ scope.row.rfid }}
                </el-input>
              </template>
            </el-table-column>
            <el-table-column label="电极状态" align="center" key="eleStatus" prop="eleStatus">
                 <template slot-scope="scope">
                <el-tag v-if="scope.row.eleStatus === '0'" type="success">正常</el-tag>
                <el-tag v-if="scope.row.eleStatus === '1'" type="danger">电极取消</el-tag>
                <el-button type="primary" size="mini" @click="deleteThis(scope.row)">删除</el-button>
              </template>
            </el-table-column>
            <el-table-column label="程式名称" align="center" key="filePath" prop="filePath"/>
            <el-table-column label="刀具名称" align="center" key="toolName" prop="toolName"/>
            <el-table-column label="批次号" align="center" key="batchNumber" prop="batchNumber"/>
            <el-table-column label="设备编号" align="center" key="deviceNo" prop="deviceNo"/>
            <el-table-column label="设备名称" align="center" key="name" prop="name" :show-overflow-tooltip="true"/>
            <el-table-column label="分类" align="center" key="type" prop="type">
              <template slot-scope="scope">
                <el-tag v-if="scope.row.type === '0'" type="success">钢件</el-tag>
                <el-tag v-if="scope.row.type === '1'" type="danger">电极</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="使用群组" align="center" key="deptName" prop="deptName"/>
            <el-table-column label="使用工艺" align="center" key="craftsName" prop="craftsName"/>
            <el-table-column label="控制器" align="center" key="controller" prop="controller"
                             :show-overflow-tooltip="true"
            />
            <el-table-column label="IP" align="center" key="networkAddress" prop="networkAddress"/>
            <el-table-column label="坐标系" align="center" key="coordinate" prop="coordinate"
                             :show-overflow-tooltip="true"
            />
            <el-table-column label="工件/电极RFID" align="center" key="workpieceEleRfid" prop="workpieceEleRfid"
                             width="120px"
            >
              <template slot-scope="scope">
                <el-input v-model="scope.row.workpieceEleRfid" @change="selectProduction(scope.row)"
                          ref="input1" @keyup.enter.native="handelTab(scope.row.index,$event)"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column label="派工单号" align="center" key="dispatchOrderNo" prop="dispatchOrderNo"
                             :show-overflow-tooltip="true"
            />
            <el-table-column label="模号" align="center" key="moduleNo" prop="moduleNo" :show-overflow-tooltip="true"/>
            <el-table-column label="件号" align="center" key="pieceNo" prop="pieceNo" :show-overflow-tooltip="true"/>
            <el-table-column label="生产单号" align="center" key="prodOrderNo" prop="prodOrderNo"
                             :show-overflow-tooltip="true"
            >
              <template slot-scope="scope">
                <span>{{ scope.row.prodOrderNo }} - {{ scope.row.electrodeSerialNo }}</span>
              </template>
            </el-table-column>
            <el-table-column label="当前工序" align="center" key="currentProcess" prop="currentProcess"/>
            <el-table-column label="当前工艺" align="center" key="currentSection" prop="currentSection"/>
            <el-table-column label="制程" align="center" key="process" prop="process" :show-overflow-tooltip="true"/>
            <el-table-column label="工艺工时" align="center" key="processManHours" prop="processManHours" v-if="false"/>
            <el-table-column label="理论加工时间" align="center" key="theoreticalProcessingTime"
                             prop="theoreticalProcessingTime"
            />
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
                 :disabled="status === '0' || status === '1' || status === '3' || multipleBegain"
      >开始
      </el-button>
      <el-button size="small" type="warning" icon="el-icon-video-pause" @click="handleUnfinishedWork" v-if="status !== '1'"
                 :disabled="multiple"
      >未完报工
      </el-button>
      <el-button size="small" type="info" icon="el-icon-video-play" @click="handleRecover" v-if="status === '1'"
                 :disabled="multiple"
      >恢复
      </el-button>
      <el-button size="small" type="success" icon="el-icon-check" v-preventReClick="2000" @click="handleReport"
                 v-if="status !== '1'" :disabled="multiple"
      >完工
      </el-button>
      <el-button size="small" type="primary" icon="el-icon-download" style="margin-left: 70px"
                 @click="handleDownloadProgramme" :disabled="multiple"
      >程式下载
      </el-button>
      <el-button size="small" type="primary" icon="el-icon-bell" @click="handleStartDevice" v-if="false" :disabled="true">
        获取机床文件列表
      </el-button>
      <el-button size="small" type="primary" icon="el-icon-bell" @click="deleteFile" :disabled="multiple || limit">
        下载文件到机床
      </el-button>
      <el-button size="small" type="primary" icon="el-icon-success" @click="handelStart" :disabled="multiple">启动机床
      </el-button>
      <el-button size="small" type="info" icon="el-icon-info" @click="processDoFTPShortTime" :disabled="multiple || limit">
        程式下发
      </el-button>
      <el-button size="small" type="info" icon="el-icon-info" @click="startDevice" :disabled="multiple || limit">
        发送机床启动命令
      </el-button>
    </el-card>
    <!--    <template>-->
    <!--      <div>-->
    <!--        <div>测试数据:{{ msg }}</div>-->
    <!--      </div>-->
    <!--    </template>-->

    <!-- 未完报工弹窗对话框 -->
    <el-dialog v-loading="loading" :title="stop.title" :visible.sync="stop.open" width="480px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="130px">
        <el-row v-for="(item,index) in reportList" :key="index" :gutter="24">
          <el-form-item
            :label="'工单' + (index+1)"
          >
            <el-col :span="12">
              <el-input placeholder="已完成比例" v-model="item.completed" disabled><i slot="suffix">%</i></el-input>
            </el-col>
            <el-col :span="12">
              <el-input placeholder="当前报工比例" v-model="item.thisCompleted"
                        :disabled="item.completed == '100'? true:false"
              ><i slot="suffix">%</i></el-input>
            </el-col>
          </el-form-item>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="unfinishedWorkSubmitForm" v-preventReClick="2000">确 定</el-button>
        <el-button @click="stop.open = false">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 程式下载弹窗对话框 -->
    <el-dialog v-loading="loading" :title="programme.title" :visible.sync="programme.open" width="480px" append-to-body>
      <el-form ref="formProgramme" :model="formProgramme" :rules="rules" label-width="130px">
        <div align="center">
          <el-row :gutter="10" style="margin-left: 80px">
            <el-col :span="10"><input type="radio" name="radios" value="ElecNC_Sep" v-model="formProgramme.fileType"
                                      :disabled="true"
            ><label>单条NC</label></el-col>
            <el-col :span="6"><input type="radio" name="radios" value="ElecNC_All" v-model="formProgramme.fileType"
            ><label>总NC</label></el-col>
          </el-row>
          <el-row :gutter="10" style="margin-left: 80px">
            <el-col :span="10">

          </el-col>
            
          </el-row>
          
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFormProgramme">确 定</el-button>
        <el-button @click="programme.open = false">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 程式下载d到FTP弹窗对话框 -->
    <el-dialog v-loading="loading" :title="programmeFtp.title" :visible.sync="programmeFtp.open" width="800px"  append-to-body>
      <el-form ref="formProgramme" :model="formProgramme" :rules="rules" label-width="230px">
        <div align="center">
          <el-row :gutter="10" style="margin-left: 80px">
            <el-col :span="10"><input type="radio" name="radios" value="ElecNC_Sep" v-model="formProgramme.fileType"
                                      :disabled="true"
            ><label>单条NC</label></el-col>
            <el-col :span="6"><input type="radio" name="radios" value="ElecNC_All" v-model="formProgramme.fileType"
            ><label>总NC</label></el-col>
          </el-row>

           <!-- 刀具检查结果显示区域 -->
          <div style="margin-top: 20px; max-height: 300px; overflow-y: auto; border: 1px solid #e6e6e6; padding: 10px;">
                <div style="font-weight: bold; margin-bottom: 10px; color: #333;">刀具检查结果:</div>
                <div 
                  v-for="(result, index) in toolCheckResults" 
                  :key="index"
                  :style="{
                    color: result.status === '存在' ? '#67c23a' : '#f56c6c',
                    fontSize: '16px',
                    lineHeight: '1.5',
                    marginBottom: '8px',
                    padding: '5px'
                  }"
                >
                  {{ result.message }}
                </div>
          </div>
      
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFormProgrammeFtp">确 定</el-button>
        <el-button @click="closeDialog">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 获取文件列表对话框 -->
    <el-dialog v-loading="loading" :title="confirmprogramme.title" :visible.sync="confirmprogramme.open" width="600px"
               append-to-body
    >
      <el-card>
        <el-row>
          <el-col :span="24">
            <el-table v-loading="loading" :data="iotFileList2" border max-height="400px">
              <el-table-column type="index" label="序号" width="50" align="center"/>
              <el-table-column label="名称" align="center" key="name" prop="name" :show-overflow-tooltip="true"/>
              <el-table-column label="类型" width="80px" prop="type">
                <template slot-scope="scope">
                  <el-tag v-if="scope.row.type === 0">文件夹</el-tag>
                  <el-tag v-if="scope.row.type === 1">文件</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button style="margin-left: 50px" type="primary" @click="deleteFile(scope.row)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
      </el-card>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="confirmhandleIotFile" :disabled="iotFileMultiple">确 定</el-button>
        <el-button @click="confirmprogramme.open = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getToken } from '../../../utils/auth'
import global from '../../../store/global.js'
import {
  dlFile, downloadFTP, downloadLathe,downloadlFileToMachine,startDeviceCommand,
  electrodeIot, finishProduct, firing, getBaseCncEleSemiAutomaticPage,
  getBaseElectrodeByWorkpieceOrEleRfid, getBaseEquipmentRfidPage,
  getBaseEqUseByEqRfid,deleteTheCanceledElectrodes,
   incompleteWorkReport, operationFolder, recoveryProduct, startProduct, workOrderCompletionRatio
} from '../../../api/production/semiAutomation'
import { getUserProfile } from '../../../api/system/user'
import downloadGlobal from '@/store/downloadGlobal'
import mqtt from 'mqtt'
import { MQTT_SERVICE, MQTT_USERNAME, MQTT_PASSWORD } from '@/utils/mqtt.js'
import Log from '@/views/monitor/job/log'
import {
    getOrderToolCostList,
  } from "../../../api/system/toolManagement";

export default {
  name: 'SemiAutomation',
  dicts: ['sys_normal_disable', 'quality_type'],
  data() {
    return {
      // 遮罩层
      loading: true,
      // 总条数
      total: 0,
      //mqtt
      client: '',
      // 非多个禁用
      multiple: true,
      limit: false,
      multipleBegain: true,
      iotFileMultiple: true,
      ftpStatus: false,
      // 表格数据
      productionList: [],
      batchProgramlist: [],
      //未完报工弹窗数据
      stop: {
        // 弹出层标题
        title: '',
        // 是否显示弹出层
        open: false
      },
       toolCheckResults: [] ,// 存储刀具检查结果用于模态框显示
      //程式下载弹窗数据
      programme: {
        // 弹出层标题
        title: '',
        // 是否显示弹出层
        open: false
      },
      //程式下载弹窗数据
      programmeFtp: {
        // 弹出层标题
        title: '程式下载到FTP',
        // 是否显示弹出层
        open: false
      },
      //程式下载到机床弹窗数据
      confirmprogramme: {
        // 弹出层标题
        title: '',
        // 是否显示弹出层
        open: false
      },
      // 表单参数
      form: {},
      formProgramme: {},
      //用户信息
      userName: '',
      personNo: '',
      deptName: '',
      //输入rfid选择数据
      baseEqRfid: '',
      index: '',
      middleList: [],
      //未完报工表单数据
      reportList: [],
      //状态参数
      status: '',
      // 查询参数
      queryParams: {
        pageNo: 1,
        pageSize: 10
      },
      // 查询参数
      queryParamsEquipment: {
        pageNo: 1,
        pageSize: 10
      },
      //增加单数
      obj: {
        baseEqRfid: '',
        workpieceEleRfid: ''
      },
      //文件格式表单校验
      rules: {
        code: [
          { required: true, message: '材质编码不能为空', trigger: 'blur' },
          { min: 2, max: 10, message: '材质编码长度必须介于 2 和 10 之间', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '名称不能为空', trigger: 'blur' },
          { min: 2, max: 10, message: '名称长度必须介于 2 和 10 之间', trigger: 'blur' }
        ]
      },
      //获取文件列表接口返回id
      iotFileCmdId: '',
      //删除文件列表接口返回id
      iotDeleteFileCmdId: '',
      //下载文件到机床接口返回id
      iotFileDownloadId: '',
      //iot获取文件列表(mqtt)
      iotFileList: '',
      iotFileList2: [],
      orderToolCostlist: [],
      //mqtt
      websock: null,
      msgReceive: '',
      wsurl: 'ws://m0jkvncgumac.guyubao.com/',
      startRightNow: '',
      programType: '',
    }
  },

  created() {
    this.getListUser()
    this.getConfigKey("cnc.start.right.now").then(response => {
      this.startRightNow = response.msg;
    });
    this.getConfigKey("sys.program.type").then(response => {
      this.programType = response.msg;
    });
  },
  beforeMount() {

  },
  mounted() {
    //   this.wsurl = MQTT_SERVICE + this.personNo;
    //   console.log(this.personNo)
    //   console.log(this.wsurl)
    // this.initWebSocket()
      this.getOrderToolCostlist();
  },
  destroyed() {
    // if (this.client) {
    //   this.client.end() //离开页面的时候  关闭mqtt连接
    //   this.client = null
    // }
    //离开路由之后断开 websocket 连接
    this.websock.close()
  },
  watch: {
    msgReceive() {
      // handler(newVal){
      //
      //         // console.log(this.dataList);
      //         // this.refreshData(newVal.fourteenDays)
      // console.log(this.msgReceive)
      if (this.msgReceive.response_name == 'FileListGet') {
        this.iotFileList = this.msgReceive
        this.iotFileList2 = this.msgReceive.paras.result_content
        // console.log(this.iotFileList2)
        this.iotFileMultiple = false
      } else if (this.msgReceive.response_name == 'FileControl') {
        if (this.iotDeleteFileCmdId == this.msgReceive.paras.cmd_id && this.msgReceive.paras.result_code == '0' && this.msgReceive.paras.errorCode == '3000') {
          this.$modal.msgSuccess('删除文件成功,等待下载主程序')
          this.handelDownload()
          // this.handleStartDevice()
        } else if (this.iotDeleteFileCmdId == this.msgReceive.paras.cmd_id && this.msgReceive.paras.result_code == '1') {
          this.$modal.msgError('删除文件失败或没有文件可以删除，等待下载主程式')
          this.handelDownload()
        } else if (this.iotDeleteFileCmdId == '-1') {
          this.$modal.msgError('IOT调接口返回错误，等待下载主程式')
          this.handelDownload()
        } else {
          this.$modal.msgError('无法删除文件，请等待下载主程式')
          this.handelDownload()
        }
      } else if (this.msgReceive.response_name == 'FileTransfer') {
        if (this.iotFileDownloadId == this.msgReceive.paras.cmd_ID && this.msgReceive.paras.state == '0' && this.msgReceive.paras.errorCode == '3000') {
          this.loading = false
          this.limit = false
          if(this.ftpStatus){
            this.$modal.msgSuccess('子文件下载到机床成功')
          }else {
            this.$modal.msgSuccess('总文件下载到机床成功，等待请求子文件下载到机床')
            this.handelFTP()
          }
        } else if (this.iotFileDownloadId == '-1') {
          this.$modal.msgError('文件下载到机床失败')
        } else {
          this.$modal.msgError('无法将文件下载到机床，请重试')
        }
      } else if (this.msgReceive.response_name == 'CNCControl') {
        if (this.msgReceive.result_code == '0') {
          this.$modal.msgSuccess('启动机床成功')
        } else if(this.msgReceive.result_code == '1'){
          this.$modal.msgError('启动机床失败')
        }
      }
      // console.log(this.iotFileList)
      // },
      //        deep: true,
      //        immediate: true
      // }
    },
    personNo() {
      this.queryParams.createBy = this.personNo
      // console.log(this.queryParams)
      this.getList()
      // console.log(this.personNo)
      //this.wsurl = MQTT_SERVICE + this.personNo
      // console.log(this.wsurl)
     // this.initWebSocket()
    }
  },
  methods: {
    getOrderToolCostlist(){

      getOrderToolCostList(this.queryParams).then(response => {
        this.orderToolCostlist = response.data
      })
    },
    /** 分页查询电极半自动化列表 */
    getList() {
      this.loading = true
      getBaseCncEleSemiAutomaticPage(this.queryParams).then(response => {
        this.productionList = response.data.records
        // console.log(this.productionList)
        this.total = response.data.total
        this.loading = false
        if (this.productionList.length > 0) {
          this.multiple = false
        } else {
          this.multiple = true
          this.multipleBegain = true
        }
        const arr = []
        this.productionList.forEach(item => {
          arr.push(item.status)
        })
        this.status = arr[0]
      })
    },

    /** 分页查询设备信息列表 */
    getEquipmentList(b) {
      const baseEqRfid = b
      getBaseEqUseByEqRfid({ 'keyWords': baseEqRfid }).then(response => {
        this.productionList.splice(this.index, 1, response.data)
      })
    },

    /** 分页查询电极信息 */
    getProductionList(c) {
      const workpieceEleRfid = c
      getBaseElectrodeByWorkpieceOrEleRfid({ 'keyWords': workpieceEleRfid }).then(response => {
        this.middleList = response.data
        this.productionList.splice(this.index, 1, Object.assign(this.productionList[this.index], this.middleList))
        if (this.productionList.length > 0) {
          this.multipleBegain = false
        } else {
          this.multipleBegain = true
        }
      })
    },

    /** 查询登录用户信息*/
    getListUser() {
      getUserProfile().then(response => {
        this.userName = response.data.nickName
        this.personNo = response.data.userName
        this.deptName = response.data.dept.name
      })
      // console.log(this.personNo)
    },

    /** 分页查询治具列表 */
    getListBaseEquipmentRfid() {
      this.status = ''
      getBaseEquipmentRfidPage(this.queryParamsEquipment).then(response => {
        const arr = []
        for (let i = 0; i < response.data.records.length; i++) {
          arr.splice(i, 0, response.data.records[i])
        }
        this.productionList = arr
      })
    },

    // CNC刀库刀具表单重置
    reset() {
      this.form = {
        code: undefined,
        name: undefined
      }
      this.resetForm('form')
    },

    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNo = 1
      if (this.queryParams.deviceNo == '') {
        delete this.queryParams.deviceNo
      }
      delete this.queryParams.createBy
      this.getList()
    },

    /** 搜索添加按钮操作 */
    handleQueryAdd() {
      this.queryParamsEquipment.pageNo = 1
      this.getListBaseEquipmentRfid()
    },

    /** 表头点击 */
    clickFunPre(column, event) {
      if (column.label === '+') {
        this.productionList.push(JSON.parse(JSON.stringify(this.obj)))
      }
      if (column.label === '-') {
        this.productionList = []
        this.status = ''
      }
    },

    /** 增加数据行 */
    handleAddData() {
      this.productionList.push(JSON.parse(JSON.stringify(this.obj)))
    },

    /** 删除数据行 */
    handleDeleteData(row, index) {
      this.productionList.splice(index, 1)
      if (this.productionList.length == '0') {
        this.status = ''
      }
    },

    /** 根据设备编号获取设备信息 */
    selectEquement(row) {
      this.index = row.index
      this.getEquipmentList(row.rfid)
    },

    /** 根据RFID获取工件/电极信息 */
    selectProduction(row) {
      
      this.index = row.index
      this.getProductionList(row.workpieceEleRfid)
    },

    /** 表格数据增加index */
    tableRowClassName({ row, rowIndex }) {
      //把每一行的索引放进row
      row.index = rowIndex
    },

    /** 开始按钮操作 */
    handleStart() {
      // console.log(this.productionList)
      this.loading = true
      setTimeout(() => {
        this.loading = false   //点击一次时隔五秒后才能再次点击
      }, 3000)
      let prod = this.productionList.map(item => item['workpieceEleRfid'])
      let prodset = new Set(prod)
      if (prodset.size == prod.length) {
        startProduct(this.productionList).then(res => {
          this.$modal.msgSuccess('开始加工')
          this.$set(this.queryParams, 'deviceNo', this.productionList[0].deviceNo)
          this.getList()
          this.loading = false
        })
        // console.log("没有重复值");
      } else {
        this.$modal.msgError('有重复数据，请排查后重新开工')
        // console.log("有重复值");
      }
    },

    /** 查看图档 */
    handleViewFile(row) {
      this.$router.push({
        path: '/eleContact/eleContactFormC',
        query: {
          prodOrderNo: row.prodOrderNo,
          electrodeNo: row.electrodeSerialNo
        }
      })
    },

    /** 未完报工 */
    handleUnfinishedWork() {
      this.loading = true
      setTimeout(() => {
        this.loading = false   //点击一次时隔五秒后才能再次点击
      }, 5000)
      this.stop.title = '未完报工'
      this.stop.open = true
      const a = []
      this.productionList.forEach(v => {
        a.push({
          'batchNumber': v.batchNumber
        })
      })
      const map = new Map()
      const qc = a.filter(key => !map.has(key.batchNumber) && map.set(key.batchNumber, 1))
      const batchNumber = qc[0]
      workOrderCompletionRatio(batchNumber).then(res => {
        this.reportList = res.data
        this.loading = false
      })
    },

    /** 未完报工确认按钮 */
    unfinishedWorkSubmitForm: function() {
      this.loading = true
      setTimeout(() => {
        this.loading = false   //点击一次时隔五秒后才能再次点击
      }, 5000)
      this.$refs['form'].validate(valid => {
        if (valid) {
          const arr = this.reportList
          incompleteWorkReport({ 'dtoList': arr }).then(res => {
            this.$modal.msgSuccess('未完报工成功')
            this.stop.open = false
            this.loading = false
            this.getList()
          })
        }
      })
    },

    /**完工按钮*/
    handleReport() {
      
      this.loading = true
      setTimeout(() => {
        this.loading = false   //点击一次时隔五秒后才能再次点击
      }, 5000)
      const a = []
      this.productionList.forEach(v => {
        a.push({
          'batchNumber': v.batchNumber,
          'eleStatus': v.eleStatus,
        })
      })
      const array = [] ;
      for(var i=0;i<a.length;i++){
        if(a[i].eleStatus == '0'){
          array.push(a[i]);
        }
      }
      var batchNumber   ;
      if(a.length>0){
        batchNumber = array[0]  ;
      }else{
        alert('没有需要完工的数据')
        return;
      }
      finishProduct(batchNumber).then(res => {
        this.$modal.msgSuccess('完工成功')
        this.loading = false
        this.getList()
      })
    },

    /** 恢复按钮操作 */
    handleRecover() {
      const a = []
      this.productionList.forEach(v => {
        a.push({
          'batchNumber': v.batchNumber
        })
      })
      const map = new Map()
      const qc = a.filter(key => !map.has(key.batchNumber) && map.set(key.batchNumber, 1))
      const batchNumber = qc[0]
      recoveryProduct(batchNumber).then(res => {
        this.$modal.msgSuccess('恢复加工成功')
        this.getList()
      })
    },

    /** 程式下载 */
    handleDownloadProgramme() {
      this.programme.title = '程式下载'
      this.programme.open = true
    },
    closeDialog(){
      this.programmeFtp.open = false;
      // 清空检查结果
      this.toolCheckResults = [];
    },
    processDoFTPShortTime() {// 程式下载到FTP临时
      this.programmeFtp.title = '程式下载'
      this.programmeFtp.open = true
      const loading = this.$queryLoading();
      //  查询所有刀具名
      this.checkToolsInLibrary();
      setTimeout(function() {
        loading.close()
      }, 200);
     
    },
   
    /** 检查程序刀具 */
    checkToolsInLibrary() {
           // 获取第一个元素的 batchNumber
           const firstBatchNumber = this.productionList[0].batchNumber;

            // 筛选出所有 batchNumber 与第一个元素相同的对象
           var sameBatchList = this.productionList.filter(item => item.batchNumber === firstBatchNumber);
       
                // 检查是否有数据
              if (!sameBatchList ||sameBatchList.length === 0) {
                this.$modal.msgWarning('没有找到批次程序数据');
                return;
              }

              if (!this.orderToolCostlist || this.orderToolCostlist.length === 0) {
                that.$modal.msgWarning('没有找到刀具成本列表数据');
                return;
              }

               // 创建刀具名映射，便于快速查找
              const toolCostMap = new Map();
              
              var lista = this.orderToolCostlist;
              lista.forEach(tool => {
                if (tool.name) {
                  toolCostMap.set(tool.name, {
                    costType: tool.costType,
                    itemNo: tool.itemNo
                  });
                }
              });

                // 检查结果数组
              const checkResults = [];
              sameBatchList.forEach(program => {

                const prodOrderNo = program.prodOrderNo;
                const toolNames = program.toolName; // 假设这是逗号分隔的字符串

                if (!toolNames) {
                  this.toolCheckResults.push({
                    prodOrderNo,
                    status: '无刀具信息',
                    message: `生产单 ${prodOrderNo} 没有刀具信息`
                  });
                  return;
                }
                // 将逗号分隔的字符串拆分成数组，并去除空格
                const toolNameArray = toolNames.split(',').map(name => name.trim()).filter(name => name);
                
                if (toolNameArray.length === 0) {
                  this.toolCheckResults.push({
                    prodOrderNo,
                    status: '无有效刀具',
                    message: `生产单 ${prodOrderNo} 没有有效的刀具名称`
                  });
                  return;
                }
                
                // 检查每个刀具名
                toolNameArray.forEach(toolName => {
                  if (toolCostMap.has(toolName)) {
                    const toolInfo = toolCostMap.get(toolName);
                    const costTypeText = toolInfo.costType === '1' ? '标准' : 
                                      toolInfo.costType === '2' ? '非标准' : '未知类型';
                    
                    this.toolCheckResults.push({
                      prodOrderNo,
                      toolName,
                      status: '存在',
                      costType: toolInfo.costType,
                      costTypeText,
                      message: `生产单 ${prodOrderNo} 的刀具 "${toolName}" 在刀库中，刀具类型: ${costTypeText}`
                    });
                  } else {
                    this.toolCheckResults.push({
                      prodOrderNo,
                      toolName,
                      status: '不存在',
                      message: `生产单 ${prodOrderNo} 的刀具 "${toolName}" 不在刀库中`
                    });
                  }
                });
              });
              // 输出检查结果
             // this.displayCheckResults(checkResults);

      
    },

    /** 发送机床命令  */
    async startDevice () {
      const arr = []
      this.loading = true
      setTimeout(() => {
        this.loading = false   //点击一次时隔五秒后才能再次点击
      }, 5000)
      const nc = this.formProgramme.fileType === 'ElecNC_Sep' ? '0' : '1';
      const controller = this.productionList[0].controller;
      this.productionList.forEach(item => {
        arr.push({
          prodOrderNo: item.prodOrderNo,
          type: 'CNC',
          fileType: this.formProgramme.fileType,
          nc,
          deviceNo: item.deviceNo,
          coordinate: item.coordinate,
          eleInformation: item.moduleNo + '-' + item.pieceNo + '-' + item.versionNo + '-' + item.electrodeNumber
        });
      });
      const param = {
        'dtoList': arr
      }
      this.$confirm('确定注销并退出系统吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        startDeviceCommand(param).then(res => {

          setTimeout(() => {
            this.$modal.msgSuccess('启动机床命令发送成功！')
          }, 1700)
          this.getList()

        })
      }).catch(() => {});
    },
    /** 程式下载到机床FTP临时  */
    submitFormProgrammeFtp () {
      
      this.d = []
      this.e = []
      const arr = []
      //  0 单条   1 总条
      const nc = this.formProgramme.fileType === 'ElecNC_Sep' ? '0' : '1';
      const controller = this.productionList[0].controller;
      this.productionList.forEach(item => {
        arr.push({
          prodOrderNo: item.prodOrderNo,
          type: 'CNC',
          fileType: this.formProgramme.fileType,
          nc,
          deviceNo: item.deviceNo,
          coordinate: item.coordinate,
          eleInformation: item.moduleNo + '-' + item.pieceNo + '-' + item.versionNo + '-' + item.electrodeNumber
        });
      });
      console.log('productionList', this.productionList)
      for (let i = 0; i < arr.length; i++) {
        let c = arr[i].coordinate.slice(1)
        this.d += '(-----------PROBE ' + arr[i].coordinate + '------------)\n' + 'G65P10' + c + '\n'
      }
      for (let i = 0; i < arr.length; i++) {
        let c = arr[i].coordinate.slice(1)
        this.e += '(----------MILLING ' + arr[i].coordinate + ' ' + arr[i].eleInformation + '-------------)\n' + 'M252\n'
          + arr[i].coordinate + '\nM198P01' + c + '\n'
      }
      const g = '%\nO0199(MAIN)\n' + this.d.slice(0) + this.e.slice(0) + 'M99\n%'
      const e = this.personNo
      const param = {
        'dtoList': arr,
        'm': g,
        'userName': e,
        'controller': controller,
        'startRightNow': this.startRightNow,
        'programType': this.programType
      }
      downloadlFileToMachine(param).then(res => {
        console.log(res)
        if(res.code == 200){
          this.$modal.msgSuccess('程式下发成功')
          this.programmeFtp.open = false
          this.getList()
          this.toolCheckResults = [];
          return;

        }else if(res === undefined || res.data === undefined) {
          this.$modal.msgError('程式下发失败，请看错误提示');
          this.programmeFtp.open = false ;
          this.toolCheckResults = [];
          return
        }
        
      })
    },

    /** 程式下载确认按钮 */
    submitFormProgramme() {
      this.d = []
      this.e = []
      const arr = []
      //  0 单条   1 总条
      const nc = this.formProgramme.fileType === 'ElecNC_Sep' ? '0' : '1';
      this.productionList.forEach(item => {
        arr.push({
          prodOrderNo: item.prodOrderNo,
          type: 'CNC',
          fileType: this.formProgramme.fileType,
          nc,
          deviceNo: item.deviceNo,
          coordinate: item.coordinate,
          eleInformation: item.moduleNo + '-' + item.pieceNo + '-' + item.versionNo + '-' + item.electrodeNumber
        });
      });
      // "%\rO0199(MAIN)\r(-----------PROBE G54------------)\rG65P1054\r" +
      // "(----------MILLING G54 884-190905N5-M11A-X2-CM-A-E001-------------)\rM198P0154\rM30\r%"
      for (let i = 0; i < arr.length; i++) {
        let c = arr[i].coordinate.slice(1)
        this.d += '(-----------PROBE ' + arr[i].coordinate + '------------)\n' + 'G65P10' + c + '\n'
      }
      for (let i = 0; i < arr.length; i++) {
        let c = arr[i].coordinate.slice(1)
        this.e += '(----------MILLING ' + arr[i].coordinate + ' ' + arr[i].eleInformation + '-------------)\n' + 'M252\n'
          + arr[i].coordinate + '\nM198P01' + c + '\n'
      }
      const g = '%\nO0199(MAIN)\n' + this.d.slice(0) + this.e.slice(0) + 'M99\n%'
      // console.log(this.d.slice(0))
      // console.log(this.e.slice(0))
      const e = this.personNo
      // console.log(this.personNo)
      dlFile({ 'dtoList': arr, 'm': g, 'userName': e }).then(res => {
        for (let i = 0; i < res.data.length; i++) {
          let downName = res.data[i].reName + '.nc'
          let url = downloadGlobal.hostHead + res.data[i].dataFile
          // let url = global.hostHead + res.data[i].dataFile
          // console.log(url)
          this.getBlob(url, (blob) => {
            this.saveAs(blob, downName)
          })
        }
        this.$modal.msgSuccess('程式下载成功')
        this.programme.open = false
        this.getList()
      })
    },
    getBlob(url, cb) {
      var xhr = new window.XMLHttpRequest()
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
      } else {
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

    /** 回车事件 */
    handelTab(i, e) {
      
      let indexKey = i + 1
      
      if (this.productionList.length === indexKey) {
        this.$nextTick(() => {
          this.$refs['input1'].focus()
          e.target.blur()
          this.handleAddData()
        })
      } else {
        this.$nextTick(() => {
          this.$refs['input0'].focus()
        })
      }
    },
    deleteThis(row) {
   
       this.$confirm('确定要删除该电极吗？', '提示', {
           confirmButtonText: '确定',
           cancelButtonText: '取消',
           type: 'warning'
       }).then(() => {
           this.loading = true
           deleteTheCanceledElectrodes(row).then(res => {
           this.loading = false;
           this.getList();
         })
      }).catch(() => {});
    },
    /** 获取机床文件列表 */
    handleStartDevice() {
      this.confirmprogramme.title = '获取机床文件列表'
      this.confirmprogramme.open = true
      this.loading = true
      setTimeout(() => {
          this.loading = false
        }, 3000
      )

      // const options = {
      //   connectTimeout: 40000,
      //   clientId: 'emqx_OTg4Nj',
      //   username: MQTT_USERNAME,
      //   password: MQTT_PASSWORD,
      //   clean: true
      // }
      // this.client = mqtt.connect(MQTT_SERVICE, options)
      // // mqtt连接
      // this.client.on('connect', (e) => {
      //   // console.log('连接成功:')
      //   this.client.subscribe('iot_response', { qos: 0 }, (error) => {
      //     if (!error) {
      //       // console.log('订阅成功')
      //     } else {
      //       // console.log('订阅失败')
      //     }
      //   })
      // })
      // // 断开发起重连
      // this.client.on('reconnect', (error) => {
      //   // console.log('正在重连:', error)
      // })
      // // 链接异常处理
      // this.client.on('error', (error) => {
      //   // console.log('连接失败:', error)
      // })

      electrodeIot({ 'deviceNo': this.productionList[0].deviceNo }).then(res => {
        this.iotFileCmdId = res.data
        this.loading = false
        // 接收消息处理
        // if(this.iotFileList !== ''){
        //   this.loading = false
        //   console.log(this.iotFileCmdId)
        //   console.log(this.iotFileList)
        // }
      })

    },
    // confirmIotFile(){
    //   this.client.on('message', (topic, message) => {
    //     // console.log('收到来自', topic, '的消息', message.toString())
    //     this.iotFileList = JSON.parse(message.toString())
    //   })
    //   if(this.iotFileList !== ''){
    //     this.iotFileMultiple = false
    //     this.$modal.msgSuccess("获取文件列表成功")
    //   }else{
    //     this.iotFileMultiple = true
    //     this.$modal.msgError("获取文件列表失败，请重新点击按钮")
    //   }
    //   // console.log(this.iotFileCmdId)
    //   // console.log(this.iotFileList.cmd_ID)
    //   // console.log(this.iotFileList.paras.result_code)
    //   // console.log(this.iotFileList.response_name)
    // },

    /**获取文件列表确定点击事件*/
    confirmhandleIotFile() {
      this.loading = true
      setTimeout(() => {
        this.loading = false
      }, 3000)
      // this.client.on('message', (topic, message) => {
      //   // console.log('收到来自', topic, '的消息', message.toString())
      //   this.iotFileList = message.toString()
      // })
      // setTimeout(()=>{
      //   console.log(this.iotFileCmdId)
      //   console.log(this.iotFileList)
      // },1000)
      if (this.iotFileCmdId == this.iotFileList.cmd_ID && this.iotFileList.paras.result_code == '0' && this.iotFileList.response_name == 'FileListGet') {
        this.$modal.msgSuccess('获取文件列表成功')
        this.confirmprogramme.open = false
        this.loading = false
      } else if (this.iotFileCmdId == '-1') {
        this.$modal.msgError('获取文件列表失败')
        this.confirmprogramme.open = false
        this.loading = false
      } else {
        this.$modal.msgError('无法获取文件列表，请重试')
        this.confirmprogramme.open = false
        this.loading = false
      }
    },

    /** 删除机床文件夹文件 */
    deleteFile(row) {
      // console.log(row)
      this.loading = true
      setTimeout(() => {
        this.loading = false
      }, 3000)
      operationFolder({ 'cmd': '1', 'deviceNo': this.productionList[0].deviceNo, 'file': 'O0199' }).then(res => {
        this.iotDeleteFileCmdId = res.data
        this.loading = false
      })
    },

    /** 下载文件到机床 */
    handelDownload() {
      this.loading = true
      setTimeout(() => {
        this.loading = false
      }, 15000)
      this.ftpStatus = false
      this.d = []
      this.e = []
      const arr = []
      this.productionList.forEach(item => {
        arr.push({
          'prodOrderNo': item.prodOrderNo,
          'type': 'CNC',
          'fileType': 'ElecNC_All',
          'nc': '1',
          'deviceNo': item.deviceNo,
          'coordinate': item.coordinate,
          'eleInformation': item.moduleNo + '-' + item.pieceNo + '-' + item.versionNo + '-' + item.electrodeNumber
        })
      })
      // "%\rO0199(MAIN)\r(-----------PROBE G54------------)\rG65P1054\r" +
      // "(----------MILLING G54 884-190905N5-M11A-X2-CM-A-E001-------------)\rM198P0154\rM30\r%"
      for (let i = 0; i < arr.length; i++) {
        let c = arr[i].coordinate.slice(1)
        this.d += '(-----------PROBE ' + arr[i].coordinate + '------------)\n' + 'G65P10' + c + '\n'
      }
      for (let i = 0; i < arr.length; i++) {
        let c = arr[i].coordinate.slice(1)
        this.e += '(----------MILLING ' + arr[i].coordinate + ' ' + arr[i].eleInformation + '-------------)\n' + 'M252\n'
          + arr[i].coordinate + '\nM198P01' + c + '\n'
      }
      const g = '%\nO0199(MAIN)\n' + this.d.slice(0) + this.e.slice(0) + 'M99\n%'
      // console.log(this.d.slice(0))
      // console.log(this.e.slice(0))
      const e = this.personNo
      downloadLathe({ 'dtoList': arr, 'm': g, 'userName': e }).then(res => {
        this.limit = true
        this.iotFileDownloadId = res.data
        // this.loading = false
      })
    },

    /** 下载文件到机床FTP */
    handelFTP() {
      this.d = []
      this.e = []
      const arr = []
      this.productionList.forEach(item => {
        arr.push({
          'prodOrderNo': item.prodOrderNo,
          'type': 'CNC',
          'fileType': 'ElecNC_All',
          'nc': '1',
          'deviceNo': item.deviceNo,
          'coordinate': item.coordinate,
          'eleInformation': item.moduleNo + '-' + item.pieceNo + '-' + item.versionNo + '-' + item.electrodeNumber
        })
      })
      // "%\rO0199(MAIN)\r(-----------PROBE G54------------)\rG65P1054\r" +
      // "(----------MILLING G54 884-190905N5-M11A-X2-CM-A-E001-------------)\rM198P0154\rM30\r%"
      for (let i = 0; i < arr.length; i++) {
        let c = arr[i].coordinate.slice(1)
        this.d += '(-----------PROBE ' + arr[i].coordinate + '------------)\n' + 'G65P10' + c + '\n'
      }
      for (let i = 0; i < arr.length; i++) {
        let c = arr[i].coordinate.slice(1)
        this.e += '(----------MILLING ' + arr[i].coordinate + ' ' + arr[i].eleInformation + '-------------)\n' + 'M252\n'
          + arr[i].coordinate + '\nM198P01' + c + '\n'
      }
      const g = '%\nO0199(MAIN)\n' + this.d.slice(0) + this.e.slice(0) + 'M99\n%'
      // console.log(this.d.slice(0))
      // console.log(this.e.slice(0))
      const e = this.personNo
      downloadFTP({ 'dtoList': arr, 'm': g, 'userName': e }).then(res => {
        this.iotFileDownloadId = res.data
        this.ftpStatus = true
        // this.loading = false
      })
    },

    /** 启动机床 */
    handelStart() {
      this.loading = true
      setTimeout(() => {
        this.loading = false
      }, 15000)
      firing({ 'deviceNo': this.productionList[0].deviceNo }).then(res => {
        if (res.code === 200) {
          this.loading = false
          this.$modal.msgSuccess('请求启动机床成功')
        } else {
          this.$modal.msgError('请求启动机床失败，请重试')
        }
      })
    },

    /** websocket */
    // 初始化weosocket
    initWebSocket() {
      if (typeof (WebSocket) === 'undefined') {
        // console.log("您的浏览器不支持WebSocket")
      } else {
        // const x = this.personNo
        // 实例化 WebSocket
        this.websock = new WebSocket(this.wsurl)
        // 监听 WebSocket 连接
        this.websock.onopen = this.websocketonopen
        // 监听 WebSocket 错误信息
        this.websock.onerror = this.websocketonerror
        // 监听 WebSocket 消息
        this.websock.onmessage = this.websocketonmessage

        this.websock.onclose = this.websocketclose
      }
    },
    // 连接建立之后执行send方法发送数据
    websocketonopen() {
      console.log('socket连接成功')
      // let actions = {"test":"12345"};
      // this.websocketsend(JSON.stringify(actions));
    },
    // 连接建立失败重连
    websocketonerror() {
      console.log('连接错误')
      //this.initWebSocket()
    },
    // 数据接收
    websocketonmessage(e) {
      this.msgReceive = JSON.parse(e.data)
      console.log(this.msgReceive);
    },
    // 数据发送
    websocketsend(Data) {
      this.websock.send(Data)
    },
    // 关闭
    websocketclose(e) {
      // console.log('WebSocket 断开连接',e);
    }
  }
}
</script>

