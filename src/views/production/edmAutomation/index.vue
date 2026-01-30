<template>
  <div class="app-container">
    <el-card>
    <el-row :gutter="10">

      <el-col :span="8" align="center" >
       <el-card>
        <el-row style="text-align: left;margin: 15px 15px;font-size: 18px">
          任务单号:
          <el-input  v-model="queryParams.taskNo" placeholder="" style="width: 200px" @change="getNcList"></el-input>
          <el-button style="margin-left: 10px;margin-right: 10px;margin-top: 3px" type="primary" icon="el-icon-search"
                     size="mini" @click="handleQuery"
          ></el-button>
        </el-row>

        <el-row>
          <el-col :span="12" style="font-size: 18px;text-align: left"><i class="el-icon-info">跑位列表</i></el-col>
        </el-row>
        <el-table v-loading="loading" :data="positioningList"  highlight-current-row height="595px" style="overflow: auto">
          <el-table-column label="跑位列表" align="center" prop="data"/>
        </el-table>
       </el-card>
      </el-col>

      <!--刀库列表数据-->
      <el-col :span="8" align="center">
        <el-card>

        <el-row style="text-align: left;font-size: 18px;margin-top: 7px">
          <el-form :model="queryParamsDevice" ref="queryForm" :inline="true">
          <el-form-item  style="margin-left: 20px" prop="keywords">
            <span style="text-align: center;font-size: 18px;margin-right: 12px">设备:</span>
            <el-select v-model="queryParamsDevice.deviceNo" filterable placeholder="请选择" clearable style="width: 150px">
              <el-option
                v-for="item in deviceList"
                :key="item.id"
                :label="item.deviceNo"
                :value="item.deviceNo"
              >
              </el-option>
            </el-select>
          </el-form-item>
            </el-form>
        </el-row>

        <el-row>
          <el-col :span="12" style="font-size: 18px;text-align: left"><i class="el-icon-info">刀库列表</i></el-col>
        </el-row>
        <el-table v-loading="loading" :data="warehouseEleList" highlight-current-row height="595px" :row-class-name="tableRowClassName" style="overflow: auto" @header-click="clickFunPre">
          <el-table-column type="index" label="序号" width="50" align="center"/>
          <el-table-column label="刀库RFID" align="center" prop="toolMagazineRfid">
            <template slot-scope="scope">
              <el-input v-model="scope.row.toolMagazineRfid" autofocus="true" @change="getCamElectrodeKnife(scope.row)">
                {{ scope.row.toolMagazineRfid }}
              </el-input>
            </template>
          </el-table-column>
          <el-table-column label="电极RFID" align="center" prop="rfid">
            <template slot-scope="scope">
              <el-input v-model="scope.row.rfid" autofocus="true" @change="electrodeSearch(scope.row)">
                {{ scope.row.rfid }}
              </el-input>
            </template>
          </el-table-column>
          <el-table-column label="刀库号" align="center" prop="toolMagazineNumber" />
          <el-table-column label="电极编号" align="center" prop="code" />
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

          </el-card>
      </el-col>
      <!--职位级别数据-->
      <el-col :span="8">
        <el-card>
<!--        <el-row style="text-align: left;margin: 20px 10px;font-size: 18px" v-show="false">-->
<!--          电极芯片:-->
<!--          <el-input  v-model="ok" placeholder="" style="width: 120px"></el-input>-->
<!--        </el-row>-->

        <el-row>
          <el-col :span="12" style="font-size: 18px"><i class="el-icon-info">跑位信息</i></el-col>
        </el-row>
        <el-form ref="form" :model="form" :rules="rules" label-width="80px" size="mini" style="border: 2px solid #c2c2c2; padding: 10px">

          <el-row style="margin-top: 16px">

            <el-col :span="8">
            <el-form-item label="电极跑位X" prop="posX">
              <el-input v-model="form.posX" placeholder="" />
            </el-form-item>
          </el-col>

            <el-col :span="8" style="margin-left: 62px">
              <el-form-item label="电极跑位Y" prop="posY">
                <el-input v-model="form.posY" placeholder="" />
              </el-form-item>
            </el-col>

            <el-col :span="8" style="margin-top: 16px">
              <el-form-item label="电极跑位Z" prop="posZ">
                <el-input v-model="form.posZ" placeholder="" />
              </el-form-item>
            </el-col>

            <el-col :span="8" style="margin-left: 62px;margin-top: 16px">
              <el-form-item label="电极跑位C" prop="posC">
                <el-input v-model="form.posC" placeholder="" />
              </el-form-item>
            </el-col>

          </el-row>

        </el-form>

        <el-row style="margin-top: 36px">
          <el-col :span="12" style="font-size: 18px"><i class="el-icon-info">钢料信息</i></el-col>
        </el-row>

        <el-form ref="form" :model="form" :rules="rules" label-width="80px" size="mini" style="border: 2px solid #c7c7c7; padding: 10px">

          <el-row style="margin-top: 16px">

            <el-col :span="8">
              <el-form-item label="零件坐标" prop="position" >
                <el-input v-model="form.position" placeholder="" :disabled="true"/>
              </el-form-item>
            </el-col>

            <el-col :span="8" style="margin-left: 62px">
              <el-form-item label="零件材质" prop="material" >
                <el-input v-model="form.material" placeholder="" :disabled="true"/>
              </el-form-item>
            </el-col>


          </el-row>

        </el-form>

        <el-row style="margin-top: 36px">
          <el-col :span="12" style="font-size: 18px"><i class="el-icon-info">电极信息</i></el-col>
        </el-row>

        <el-form ref="form" :model="form" :rules="rules" label-width="100px" size="mini" style="border: 2px solid #c4c4c4; padding: 10px">

          <el-row style="margin-top: 16px">

            <el-col :span="8" style="margin-top: 16px;">
              <el-form-item label="电极火花位" prop="sparkGap">
                <el-input v-model="form.sparkGap" placeholder="" />
              </el-form-item>
            </el-col>

            <el-col :span="8" style="margin-top: 16px">
              <el-form-item label="电极材质" prop="electrode_material">
                <el-input v-model="form.electrode_material" placeholder="" :disabled="true"/>
              </el-form-item>
            </el-col>

            <el-col :span="8" style="margin-top: 16px">
              <el-form-item label="电极放电面积" prop="edmFace">
                <el-input v-model="form.edmFace" placeholder="" />
              </el-form-item>
            </el-col>

            <el-col :span="8" style="margin-top: 16px">
              <el-form-item label="电极VDI" prop="vdi_floor">
                <el-input v-model="form.vdiFloor" placeholder="" />
              </el-form-item>
            </el-col>

            <el-col :span="8" style="margin-top: 16px">
              <el-form-item label="电极偏差X" prop="x">
                <el-input v-model="form.x" placeholder="" />
              </el-form-item>
            </el-col>
            <el-col :span="8" style="margin-top: 16px">
              <el-form-item label="电极偏差Y" prop="y">
                <el-input v-model="form.y" placeholder="" />
              </el-form-item>
            </el-col>

            <el-col :span="8" style="margin-top: 16px">
              <el-form-item label="电极偏差Z" prop="z">
                <el-input v-model="form.z" placeholder="" />
              </el-form-item>
            </el-col>

            <el-col :span="8" style="margin-top: 16px">
              <el-form-item label="电极偏差C" prop="c">
                <el-input v-model="form.c" placeholder="" />
              </el-form-item>
            </el-col>

            <el-col :span="8" style="margin-top: 16px">
              <el-form-item label="电极修正火花位" prop="spark">
                <el-input v-model="form.spark" placeholder="" :disabled="true"/>
              </el-form-item>
            </el-col>

          </el-row>

        </el-form>

        <el-row style="text-align: right;margin-right: 32px;margin-top: 24px">
          <el-button style="text-align: center;margin-right: 24px" size="small" type="success" @click="uploadCamElectrodeKnifeLibrary">生成程式</el-button>
          <el-button style="text-align: center;margin-right: 24px" size="small" type="success" @click="download">下载程式到机床</el-button>
          <el-button style="text-align: center" size="small" type="success" @click="handelStart">启动设备</el-button>
        </el-row>

        </el-card>
      </el-col>

    </el-row>
    </el-card>
  </div>
</template>

<script>
import {
  listProgramme,
} from "../../../api/camdesign/programm"
import { getCamElectricSparkList } from '@/api/production/taskStation'
import { listEquipment } from '@/api/system/equipment'
import { DownloadEDMIn, getCmmSparkPointPage, uploadCamElectrodeKnifeLibrary } from '@/api/production/edmAutomation'
import { getCamElectrodeKnifeLibraryPage } from '@/api/system/warehouseRfid'
import amrRequest from '@/utils/amrRequest'
import request from '@/utils/request'
import { listElectrodeBom } from '@/api/camdesign/electrode'
import { firing } from '@/api/production/semiAutomation'

export default {
  name: "Post",
  dicts: ['sys_normal_disable'],
  data() {
    return {
      // 遮罩层
      loading: false,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      //职位类别数据
      typeList:[],
      //电极库位绑定列表
      electrodeList:[],
      //设备列表
      deviceList:[],
      //电火花跑位列表（拼接）
      positioningList:[
        {
          "data":"X10.00_Y20.00_Z30.00_C90.00_LUXCASEICTTEST-M001-E001"
        },
        {
          "data":"X10.00_Y20.00_Z30.00_C90.00_LUXCASEICTTEST-M001-E002"
        },
        {
          "data":"X10.00_Y20.00_Z30.00_C90.00_LUXCASEICTTEST-M001-E003"
        },
        {
          "data":"X10.00_Y20.00_Z30.00_C90.00_LUXCASEICTTEST-M001-E004"
        },
        {
          "data":"X10.00_Y20.00_Z30.00_C90.00_LUXCASEICTTEST-M001-E005"
        }
      ],
      //NC列表
      ncList:[],
      //url地址
      url:[],
      // 职位select
      typeListForPost:[],
      // 职位级别select
      typeLevelForPost:[],
      //表格index
      index:'',
      // 岗位表格数据
      postList: [],
      // 级别表格数据
      levelList:[],
      //刀库列表
      warehouseEleList:[
          // {
          //   "rfid":"4139710059",
          //   "toolMagazineRfid":"333"
          // },
          // {
          //   "rfid":"3123722191",
          //   "toolMagazineRfid":"444"
          // },
          // {
          //   "rfid":"4139690083",
          //   "toolMagazineRfid":"555"
          // }
        // {
        //   "toolMagazineRfid":"4139689803",
        //   "rfid":"4139690982",
        //   "toolMagazineNumber":"1",
        //   "code":"LUXCASEICTTEST-M001-E002"
        // },
        // {
        //   "toolMagazineRfid":"4139690979",
        //   "rfid":"4139689914",
        //   "toolMagazineNumber":"2",
        //   "code":"LUXCASEICTTEST-M001-E002"
        // },
        // {
        //   "toolMagazineRfid":"4139711584",
        //   "rfid":"4139712436",
        //   "toolMagazineNumber":"3",
        //   "code":"LUXCASEICTTEST-M001-E003"
        // },
        // {
        //   "toolMagazineRfid":"3123722492",
        //   "rfid":"3123754384",
        //   "toolMagazineNumber":"4",
        //   "code":"LUXCASEICTTEST-M001-E004"
        // },
        // {
        //   "toolMagazineRfid":"3123722493",
        //   "rfid":"4139711410",
        //   "toolMagazineNumber":"5",
        //   "code":"LUXCASEICTTEST-M001-E005"
        // }
      ],
      // 弹出层标题
      title: "",
      // 是否显示职位类别弹出层
      open: false,
      // 是否显示职位信息弹出层
      openPost: false,
      // 是否显示职位级别弹出层
      openLevel: false,
      // 是否显示导出框弹出层
      openExport: false,
      // 多选框
      checkList1: true,
      // 单选框
      radio: '1',
      //职位类别ID
      categoryId:[],
      //
      //增加单数
      obj: {
        rfid: '',
        toolMagazineRfid:''
      },
      //职位类别名称
      categoryName:[],
      //电火花列表
      sparkList:[],
      //获取NC编程列表
      queryParams: {
        pageNo: 1,
        pageSize: 10,
        taskNo: 'WD2301030007-1-CNC'
      },
      queryParamsDevice: {},
      deviceQueryParams: {
        pageNo: 1,
        pageSize: 1000,
      },
      //rfid对应单号
      electrodeNo:'',
      //获取电火花跑位列表
      queryParamsSpark: {
        pageNo: 1,
        pageSize: 10,
      },
      queryParamsKnifeLibrary: {
        pageNo: 1,
        pageSize: 10,
      },
      // 职位类别查询参数
      queryParamsElectricSpark: {
        pageNo: 1,
        pageSize: 10,
      },
      //
      queryParamsCmmSparkPoint: {
        pageNo: 1,
        pageSize: 10,
      },
      queryParamsElectrodeBomPage: {
        pageNo: 1,
        pageSize: 10,
      },
      // 职位类别表单参数
      form: {
            // "posX":"10.00",
            // "posY":"20.00",
            // "posZ":"30.00",
            // "posC":"90.00",
            "position":"55",
            "material":"ST",
            // "spark_gap":"0.05",
            // "electrode_material":"ST",
            // "size":"100",
            // "vdi_floor":"21",
            // "x":"0.011",
            // "y":"0.022",
            // "z":"88.88",
            // "c":"0.002",
            // "spark":"0.005"
      },
      // 职位类别表单校验
      rules: {
        name: [
          { required: true, message: "职位类别不能为空", trigger: "blur" },
          { min: 2, max: 10, message: '职位类别长度必须介于 2 和 10 之间', trigger: 'blur' }
        ],
      },
    };
  },
  created() {
    this.getEquipment()

  },

  watch:{
    msgReceive() {
      if (this.msgReceive.response_name == 'FileListGet') {

      } else if (this.msgReceive.response_name == 'FileControl') {

      } else if (this.msgReceive.response_name == 'FileTransfer') {
        if (this.iotFileDownloadId == this.msgReceive.paras.cmd_ID && this.msgReceive.paras.state == '0' && this.msgReceive.paras.errorCode == '3000') {
            this.$modal.msgSuccess('文件下载到机床成功')
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
    }
  },

  methods: {
    /** 获取NC列表 */
    getNcList(){
      // this.loading = true;
      // setTimeout(() => {
      //   this.loading = false
      // }, 3000)
      // listProgramme(this.queryParams).then(response => {
      //   this.ncList = response.data.records;
      //   this.queryParamsSpark.orderNo = this.ncList[0].prodOrderNo
      //   // this.positioningList =
      // });
      // this.getPositioningList()
    },

    /** 任务单号搜索 */
    handleQuery(){
      // this.queryParams.pageNo = 1
      // this.getNcList()
    },

    /** 获取电火花跑位列表 */
    getPositioningList(){
      this.loading = true;
      setTimeout(() => {
        this.loading = false
      }, 3000)
      getCamElectricSparkList(this.queryParamsSpark).then(response => {
        this.sparkList = response.data.records;
      });
    },

    /** 分页查询电极刀库号列表 */
    getCamElectrodeKnife(row){
      this.index = row.index
      this.queryParamsKnifeLibrary.toolMagazineRfid = row.toolMagazineRfid
      this.KnifeLibraryPage()
      // getCamElectrodeKnifeLibraryPage(this.queryParamsKnifeLibrary).then(response => {
      //   this.warehouseEleList[this.index].toolMagazineNumber = response.data.records[0].toolMagazineNumber
      // });
    },

    /** 分页查询电极刀库号列表 */
    KnifeLibraryPage(){
      getCamElectrodeKnifeLibraryPage(this.queryParamsKnifeLibrary).then(response => {
        // this.warehouseEleList = response.data.records
        this.middleList = response.data.records[0]
        this.warehouseEleList.splice(this.index, 1,Object.assign(this.warehouseEleList[this.index], this.middleList))
        // this.warehouseEleList.splice(this.index, 1,response.data.records[0].toolMagazineNumber)
        // this.warehouseEleList[this.index].toolMagazineNumber = response.data.records[0].toolMagazineNumber
      });
    },

    /** 分页查询设备信息列表 */
    getEquipment(){
      listEquipment(this.deviceQueryParams).then(response => {
        this.deviceList = response.data.records
      });
    },

    /** 通过rfid查询电极生产单号，同时获取对应信息 */
    electrodeSearch(row){
      this.index = row.index
      this.electrodeNo = ''
      return request({
        url: '/jy/electrodeSearch/list?pageNum=1&pageSize=10&'+ 'rfid='+row.rfid,
        method: 'get',
      }).then(response => {
        this.middleList = response.rows[0]
        this.middleList.code = response.rows[0].electrodeBno + '-' + response.rows[0].eleNo
        this.electrodeNo = response.rows[0].eleDispatchNo;
        this.warehouseEleList.splice(this.index, 1,Object.assign(this.warehouseEleList[this.index], this.middleList))
        // this.warehouseEleList[this.index].code = response.rows[0].electrodeBno + '-' + response.rows[0].toolMagazineNumber
        this.queryParamsElectricSpark.orderNo = this.electrodeNo
        this.queryParamsCmmSparkPoint.keywords = this.electrodeNo
        this.queryParamsElectrodeBomPage.electrodeProdOrderNo = this.electrodeNo
        this.queryParamsCmmSparkPoint.rfid = row.rfid
        // this.warehouseEleList.splice(this.index, 1, Object.assign(this.semiAutoList[i], this.middleList))
        this.getCamElectricSparkList()
        }
      )
    },

    /** 通过电极生产单号查询电极信息，同时获取对应信息 */
    getCamElectricSparkList(){
      this.form = {
        // "posX":"10.00",
        // "posY":"20.00",
        // "posZ":"30.00",
        // "posC":"90.00",
        "position":"55",
        "material":"ST",
        // "spark_gap":"0.05",
        "electrode_material":"ST",
        // "size":"100",
        // "vdi_floor":"21",
        // "x":"0.011",
        // "y":"0.022",
        // "z":"88.88",
        // "c":"0.002",
        "spark":"0.005"
      }
      getCamElectricSparkList(this.queryParamsElectricSpark).then(response => {
        // this.form.splice(1,0,Object.assign(this.form,response.data.records[0]))
        // this.form = response.data.records[0]
        // console.log(response.data.records)
        this.$set(this.form,"posX",response.data.records[0].posX)
        this.$set(this.form,"posY",response.data.records[0].posY)
        this.$set(this.form,"posZ",response.data.records[0].posZ)
        this.$set(this.form,"posC",response.data.records[0].posC)
        // this.form.posX = response.data.records[0].posX
        // this.form.posY = response.data.records[0].posY
        // this.form.posZ = response.data.records[0].posZ
        // this.form.posC = response.data.records[0].posC
      });
      getCmmSparkPointPage(this.queryParamsCmmSparkPoint).then(response => {
        // this.form.splice(1,0,Object.assign(this.form,response.data.records[0]))
        // this.form.push(response.data.records[0])
        this.$set(this.form,"x",response.data.records[0].x)
        this.$set(this.form,"y",response.data.records[0].y)
        this.$set(this.form,"z",response.data.records[0].z)
        this.$set(this.form,"c",response.data.records[0].c)
        this.$set(this.form,"sparkGap",response.data.records[0].sparkGap)
        // this.form.x = response.data.records[0].x
        // this.form.y = response.data.records[0].y
        // this.form.z = response.data.records[0].z
        // this.form.c = response.data.records[0].c
      });
      listElectrodeBom(this.queryParamsElectrodeBomPage).then(response => {

        this.$set(this.form,"vdiFloor", /\d+/.exec(response.data.records[0].vdiFloor)?.[0])
        // this.$set(this.form,"vdiFloor",response.data.records[0].vdiFloor)
        this.$set(this.form,"edmFace",response.data.records[0].edmFace)
      });

    },

    /** 生成程式 */
    uploadCamElectrodeKnifeLibrary(){
      this.changeList = this.warehouseEleList.map(item => {
        return {
          rfid: item.rfid,
          toolMagazineRfid: item.toolMagazineRfid
        };
      });
      // console.log(this.changeList)
      uploadCamElectrodeKnifeLibrary(this.changeList).then(response => {
        if(response.code == 200){
          this.$modal.msgSuccess("生成成功, "+"地址为"+response.data);
        }
        this.url = response.data
      });
    },

    /** 下载文件到机床 */
    download(){
      DownloadEDMIn({ 'deviceNo': this.queryParamsDevice.deviceNo,'nc': this.url} ).then(response => {
        if(response.code == 200){
          this.$modal.msgSuccess("文件下载到机床成功");
        }
      });
    },

    /** 启动机床 */
    handelStart() {
      this.loading = true
      setTimeout(() => {
        this.loading = false
      }, 15000)
      firing({ 'deviceNo': this.queryParamsDevice.deviceNo }).then(res => {
        if (res.code === 200) {
          this.loading = false
          this.$modal.msgSuccess('请求启动机床成功')
        } else {
          this.$modal.msgError('请求启动机床失败，请重试')
        }
      })
    },

    /** 表格数据增加index */
    tableRowClassName({ row, rowIndex }) {
      //把每一行的索引放进row
      row.index = rowIndex
    },

    /** 增加数据行 */
    handleAddData() {
      this.begin = false
      this.warehouseEleList.push(JSON.parse(JSON.stringify(this.obj)))
    },

    /** 删除数据行 */
    handleDeleteData(row, index) {
      this.warehouseEleList.splice(index, 1)
      if (this.warehouseEleList.length == 0) {
        this.begin = true
      }
    },

    /** 表头点击 */
    clickFunPre(column, event) {
      if (column.label === '+') {
        this.begin = false
        this.warehouseEleList.push(JSON.parse(JSON.stringify(this.obj)))
      }
      if (column.label === '-') {
        this.warehouseEleList = []
        this.begin = true
      }
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
      this.initWebSocket()
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
};
</script>
