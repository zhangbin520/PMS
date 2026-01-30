<template>
  <div class="app-container">
    <el-card>
      <el-form :model="queryParamsEquipment" ref="queryForm" :inline="true">
        <el-row>
          <el-form-item label="生产单号" prop="workpieceProdOrderNo">
            <el-input
              v-model="queryParams.workpieceProdOrderNo"
              placeholder="输入生产单号"
              clearable
              size="small"
              style="width: 200px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="模号" prop="moduleNo">
            <el-input
              v-model="queryParams.moduleNo"
              placeholder="输入模号"
              clearable
              size="small"
              style="width: 200px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="件号" prop="pieceNo">
            <el-input
              v-model="queryParams.pieceNo"
              placeholder="输入件号"
              clearable
              size="small"
              style="width: 200px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="绑定状态" prop="steelStatus">
            <el-select v-model="queryParams.steelStatus"  placeholder="请选择" style="width: 100%">
              <el-option
                v-for="item in dict.type.bind_status"
                :key="item.value"
                :label="item.label"
                :value="Number(item.value)"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button style="margin-left: 10px;margin-right: 10px" type="primary" icon="el-icon-search" size="mini"
                       @click="handleQuery"
            >查询
            </el-button>
          </el-form-item>
         
        
        </el-row>
      </el-form>
    </el-card>
    <el-card>
      <el-row>
        <el-col :span="24">
          <el-table v-loading="loading" :data="workpieceList" border @header-click="clickFunPre"
                    :row-class-name="tableRowClassName" max-height="600px"
          >
            <el-table-column type="index" label="序号" width="50" align="center"/>
            <!-- <el-table-column label="操作" width="320" align="center" class-name="small-padding fixed-width"></el-table-column> -->
            <el-table-column label="操作" align="center" width="190" class-name="small-padding fixed-width" >
            <template slot-scope="scope">
                <el-button
                  type="primary"
                  @click="doUnBind(scope.row)"
                  :disabled="scope.row.steelStatus == 2 || scope.row.steelStatus == 0|| scope.row.steelStatus == '' || scope.row.steelStatus == null"
                >解绑</el-button>
                <el-button
                  type="primary"
                  @click="doBind(scope.row)"
                  :disabled="scope.row.steelStatus == 1"
                >绑定</el-button>
            </template>
          </el-table-column>
            
            <el-table-column label="订单详情id" align="center" v-if="false" prop="bomDetailId"/>
            <el-table-column label="工件/电极RFID" align="center" key="workpieceRfid" prop="workpieceRfid" width="130px" >
              <!-- <template slot-scope="scope">
                <el-input v-model="scope.row.workpieceRfid" :disabled="scope.row.steelStatus === '1'" @change="checkTheStatusOfTheWorkpiece(scope.row)"
                          ref="input1" @keyup.enter.native="handelTab(scope.row.index,$event)"
                ></el-input>
              </template> -->
            </el-table-column>
            <el-table-column label="钢件类型" align="center" key="steelType" prop="steelType" width="80px" >
               <template slot-scope="scope">
                <el-tag v-if="scope.row.steelType === '1'" type="danger">未加工</el-tag>
                <el-tag v-if="scope.row.steelType === '2'" type="info">已加工</el-tag>
               </template>
            </el-table-column>

            <!-- <el-table-column label="选择钢件类型" align="center" key="workpieceRfid" prop="workpieceRfid" width="130px" >
              <template slot-scope="scope">
                <el-input v-model="scope.row.workpieceRfid" :disabled="scope.row.steelStatus === '1'" @change="checkTheStatusOfTheWorkpiece(scope.row)"
                          ref="input1" @keyup.enter.native="handelTab(scope.row.index,$event)"
                ></el-input>
              </template>
            </el-table-column> -->
            <el-table-column label="生产单号" align="center" key="workpieceProdOrderNo" prop="workpieceProdOrderNo" width="130px" :show-overflow-tooltip="true" />
            <el-table-column label="模号" align="center" key="moduleNo" prop="moduleNo" :show-overflow-tooltip="true"  width="140px" />
            <el-table-column label="件号" align="center" key="pieceNo" prop="pieceNo" :show-overflow-tooltip="true"  width="90px" />
            <el-table-column label="订单状态" align="center" key="orderStatus" prop="orderStatus"  width="90px" >
               <template slot-scope="scope">
                <el-tag v-if="scope.row.orderStatus === '0'" type="danger">暂停</el-tag>
                <el-tag v-if="scope.row.orderStatus === '1'" type="danger">已取消</el-tag>
                <el-tag v-if="scope.row.orderStatus === '2'" type="info">已恢复</el-tag>
                <el-tag v-if="scope.row.orderStatus === 'N'" type="info">正常</el-tag>
               </template>
            </el-table-column>
            <el-table-column label="rfid类型" align="center" key="rfidType" prop="rfidType"  width="90px" >
               <template slot-scope="scope">
                <el-tag v-if="scope.row.rfidType === '1'" type="danger">EROWA</el-tag>
                <el-tag v-if="scope.row.rfidType === '2'" type="info">3R</el-tag>
               </template>
            </el-table-column>
            <el-table-column label="绑定状态" align="center" prop="steelStatus"  width="90px"  >
            <template slot-scope="scope">
              <el-tag v-if="scope.row.steelStatus =='0' || scope.row.steelStatus == ''  || scope.row.steelStatus == null">未绑定</el-tag>
              <el-tag v-if="scope.row.steelStatus =='1'">已绑定</el-tag>
              <el-tag v-if="scope.row.steelStatus =='2'">已解绑</el-tag>
            </template>
            </el-table-column>
            <el-table-column label="工艺" align="center" key="process" prop="process" width="660" />
            <el-table-column label="绑定时间" prop="createTime" align="center" width="100"/>
            <el-table-column label="版本号" align="center" key="versionNo" prop="versionNo"  width="80px" />
            <!-- <el-table-column label="档案查看" align="center" width="100px">
              <template slot-scope="scope">
                <el-button type="primary" size="mini" @click="handleViewFile(scope.row)">查看档案</el-button>
              </template>
            </el-table-column> -->
            
          </el-table>
          <pagination
            v-show="total>0"
            :total="total"
            :page.sync="queryParams.pageNo"
            :limit.sync="queryParams.pageSize"
            @pagination="getList"
          />
        </el-col>

         <!-- 新增属性  -->
    <el-dialog :title="magazine.title" :visible.sync="magazine.open" width="1200px" append-to-body>
      <el-form ref="form" :model="bindParamsForm"    :rules="rules" label-width="100px">
        <!-- <el-row :gutter="24">
          <el-col :span="8">
            <el-form-item label="工件类型" prop="steelType">
              <el-radio-group v-model="bindParams.steelType">
                <el-radio label="1">未加工</el-radio>
                <el-radio label="2">已加工</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="RFID类型" prop="rfidType">
              <el-radio-group v-model="bindParams.rfidType">
                <el-radio label="1">EROWA</el-radio>
                <el-radio label="2">3R</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="RFID" prop="workpieceRfid">
              <el-input v-model="bindParams.workpieceRfid"  ></el-input>
            </el-form-item>
          </el-col>
        </el-row>  -->    

        <el-row
          v-for="(item, i) in bindParamsForm.list"
          :key="i"
          :gutter="24"
          style="margin-bottom: 8px;"
        >
          <el-col :span="8">
            <el-form-item
              label="工件类型"
              :prop="'list.' + i + '.steelType'"
              :rules="[{ required: true, message: '请选择工件类型', trigger: 'change' }]"
            >
              <el-radio-group v-model="item.steelType">
                <el-radio label="1">未加工</el-radio>
                <el-radio label="2">已加工</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item
              label="RFID类型"
              :prop="'list.' + i + '.rfidType'"
              :rules="[{ required: true, message: '请选择RFID类型', trigger: 'change' }]"
            >
              <el-radio-group v-model="item.rfidType">
                <el-radio label="1">EROWA</el-radio>
                <el-radio label="2">3R</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item
              label="RFID"
              :prop="'list.' + i + '.workpieceRfid'"
              :rules="[{ required: true, message: '请输入RFID', trigger: 'blur' }]"
            >
              <div style="display:flex; align-items:center;">
                <el-input v-model="item.workpieceRfid"    @change="handleBindRfidChange(item, i)" ></el-input>

                <!-- ✅ “+”按钮：只显示在最后一行，避免一屏全是 + -->
                <el-button
                  v-if="i === bindParamsForm.list.length - 1"
                  icon="el-icon-plus"
                  type="primary"
                  plain
                  style="margin-left:8px;"
                  @click="addRow"
                  title="新增一行"
                />

                <!-- 可选：给你一个 “-” 删除行按钮 -->
                <el-button
                  v-if="bindParamsForm.list.length > 1"
                  icon="el-icon-minus"
                  type="danger"
                  plain
                  style="margin-left:8px;"
                  @click="removeRow(i)"
                  title="删除本行"
                />
              </div>
            </el-form-item>
          </el-col>
        </el-row>
      
      
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitAddForm">确 定</el-button>
        <el-button @click="magazine.open = false">取 消</el-button>
      </div>
      </el-dialog>

      <el-dialog :title="unbindDialog.title" :visible.sync="unbindDialog.open" width="900px" append-to-body>
          <el-table :data="unbindDialog.list" border max-height="360px">
            <el-table-column type="index" label="序号" width="60" align="center"/>
            <el-table-column label="工件/电极RFID" align="center" prop="workpieceRfid" />
            <el-table-column label="工件类型" align="center" prop="steelType">
              <template slot-scope="scope">
                <el-tag v-if="scope.row.steelType === '1'" type="danger">未加工</el-tag>
                <el-tag v-if="scope.row.steelType === '2'" type="info">已加工</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="rfid类型" align="center" prop="rfidType">
              <template slot-scope="scope">
                <el-tag v-if="scope.row.rfidType === '1'" type="danger">EROWA</el-tag>
                <el-tag v-if="scope.row.rfidType === '2'" type="info">3R</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="绑定时间" align="center" prop="createTime" width="160" />
          </el-table>
          <div slot="footer" class="dialog-footer">
            <el-button type="danger" @click="submitUnbind">解绑</el-button>
            <el-button @click="unbindDialog.open = false">取 消</el-button>
          </div>
      </el-dialog>



      </el-row>
    </el-card>

    <!-- 获取文件列表对话框 -->
    <!-- <el-dialog v-loading="loading" :title="confirmprogramme.title" :visible.sync="confirmprogramme.open" width="600px"
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
    </el-dialog> -->
  </div>
</template>

<script>
import {
   checkTheStatusOfTheWorkpiece,startDeviceCommand, getSteelBindRfidPage, completeBinding,
  getBaseEqUseByEqRfid,doUnBinding} from '../../../api/production/semiAutomation'
import Log from '@/views/monitor/job/log'

export default {
  name: 'SteelRfidBind',
  dicts: ['order_status', 'bind_status'],
  data() {
    return {
      // 遮罩层
      loading: false,
      // 总条数
      total: 0,
      //mqtt
      client: '',
      bindParams: {
        steelType: '',
        rfidType: ''
      },
      // ✅ 关键：form model 用对象包一层 list，方便 ElementUI 的 prop 校验
      bindParamsForm: {
        list: []
      },
      // 非多个禁用
      multiple: true,
      multipleBegain: true,
      // 钢件表格数据
      workpieceList: [],
      //未完报工弹窗数据
      stop: {
        // 弹出层标题
        title: '',
        // 是否显示弹出层
        open: false
      },
      magazine: {
          // 是否显示弹出层
          open: false,
          // 弹出层标题
          title: "选择钢件类型",
          currentIndex: -1, 
          form: {}
      },
      unbindDialog: {
        open: false,
        title: '已绑定数据',
        list: []
      },
      //程式下载弹窗数据
      programme: {
        // 弹出层标题
        title: '',
        // 是否显示弹出层
        open: false
      },
      
      
      // 表单参数
      form: {},
      formProgramme: {},
      //用户信息
      //输入rfid选择数据
      baseEqRfid: '',
      index: '',
      middleList: [],
      
      //状态参数
      status: '',
      // 查询参数
      queryParams: {
        pageNo: 1,
        pageSize: 10,
        steelStatus: 0
      },
      // 查询参数
      queryParamsEquipment: {
        pageNo: 1,
        pageSize: 10
      },
      //增加单数
      obj: {
        baseEqRfid: '',
        workpieceRfid: ''
      },
      //文件格式表单校验
      rules: {
        steelType: [
          { required: true, message: '钢件类型不能为空', trigger: 'change' },
        ],
        rfidType: [
          { required: true, message: 'rfidType不能为空', trigger: 'change' }
        ],
        workpieceRfid: [
          { required: true,  trigger: 'change', pattern: /^[0-9]{10}$/,min: 10, max: 10, message: '请输入10位数字的RFID' }
        ],
        
      },
      
    }
  },

  created() {
    this.getList();
    /* this.getConfigKey( "cnc.start.right.now").then(response => {
      this.startRightNow = response.msg;
    });
    this.getConfigKey("sys.program.type").then(response => {
      this.programType = response.msg;
    }); */
  },
  beforeMount() {

  },
  mounted() {
   
  },
  destroyed() {
    // if (this.client) {
    //   this.client.end() //离开页面的时候  关闭mqtt连接
    //   this.client = null
    // }
    //离开路由之后断开 websocket 连接
  },
  watch: {
    
  },
  methods: {

    submitAddForm(){//  保存模态框
      this.$refs["form"].validate(valid => {
        if(valid){
          
           const list = this.bindParamsForm.list.map(x => ({ ...x }));
        /*   this.$set(this.workpieceList[this.magazine.currentIndex], 'steelType', this.bindParams.steelType);
          this.$set(this.workpieceList[this.magazine.currentIndex], 'rfidType', this.bindParams.rfidType); */
         
          this.magazine.open = false;

          const row = this.workpieceList[this.magazine.currentIndex];
          row.list = list;
          row.operationType = '1';
          this.$modal.loading("正在绑定数据，请稍候！");
          completeBinding(row).then(res => {
              if (res.data == '1') {
                  this.$modal.closeLoading();
                  this.$modal.msgSuccess('绑定成功！');
                  this.getList()
              } else {
                this.$modal.msgError(res.msg)
              }
            }).catch(() => {
              this.$modal.closeLoading();
              this.$modal.msgSuccess('绑定成功！');
            });
        }
        
      });
      
    },
    /** 分页查询电极半自动化列表 */
    getList() {
      this.loading = true;
      
      /* if(this.queryParams.steelStatus!==''&&this.queryParams.steelStatus!==null){
        this.queryParams.steelStatus = String(this.queryParams.steelStatus).trim();
      } */
      getSteelBindRfidPage(this.queryParams).then(response => {
        
        this.workpieceList = response.data.records
        this.total = response.data.total
        this.loading = false
        /* if (this.workpieceList.length > 0) {
          this.multiple = false
        } else {
          this.multiple = true
          this.multipleBegain = true
        }
        const arr = []
        this.workpieceList.forEach(item => {
          arr.push(item.status)
        })
        this.status = arr[0] */
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

    /** 表头点击 */
    clickFunPre(column, event) {
      if (column.label === '+') {
        this.workpieceList.push(JSON.parse(JSON.stringify(this.obj)))
      }
      if (column.label === '-') {
        this.workpieceList = []
        this.status = ''
      }
    },
//  解绑
    /* doUnBind(row){
      const that = this;
          this.$modal.confirm('确认解绑？').then(function() {
            row.operationType = '2';
            completeBinding(row).then(res => {
               
                if (res.data == '1') {
                  that.$modal.msgSuccess('解绑成功')
                  that.getList()
                } else {
                  that.$modal.msgError(res.msg)
                }
            })
          
          }).catch(() => {}); 
    } */
    //  打开解绑窗口 
    doUnBind(row) {
      this.openUnbindDialog(row)
    },
     openUnbindDialog(row) {
      this.unbindDialog.open = true
      this.unbindDialog.title = '已绑定数据'
      this.unbindDialog.list = [
        {
          workpieceRfid: row.workpieceRfid,
          id: row.id,
          steelType: row.steelType,
          steelStatus: row.steelStatus,
          rfidType: row.rfidType,
          createTime: row.createTime,
          workpieceProdOrderNo: row.workpieceProdOrderNo,
          moduleNo: row.moduleNo,
          pieceNo: row.pieceNo,
          versionNo: row.versionNo
        }
      ]
    },
//  解绑 
    submitUnbind() {
      if (!this.unbindDialog.list.length) {
        this.$modal.msgError('暂无可解绑的数据')
        return
      }
      this.$modal.confirm('确认解绑？').then(() => {
        
        const payload = this.unbindDialog.list[0];
        payload.operationType = '2';
        const requests =   [doUnBinding(payload)];

        Promise.all(requests).then(responses => {
          const success = responses.every(res => res.data == '1')
          if (success) {
            this.$modal.msgSuccess('解绑成功')
          } else {
            const failed = responses.find(res => res.data != '1')
            this.$modal.msgError(failed ? failed.msg : '解绑失败')
          }
          this.unbindDialog.open = false
          this.getList()
        })
      }).catch(() => {})
    },
    //  绑定
    doBind(row){
      const that = this;
            /** 根据RFID获取工件/电极信息 */
      this.openDialog(row,row.index)
    },

    openDialog(row,index,type){

      
      this.magazine.open = true;
      this.magazine.title = "绑定钢件RFID";
      this.magazine.currentIndex = index;
      this.magazine.form = JSON.parse(JSON.stringify(row));

       // ✅ 初始化一行（把 row 里的值带进去）
      this.bindParamsForm.list = [{
        steelType: row.steelType || '',
        rfidType: row.rfidType || '',
        workpieceRfid: row.workpieceRfid || ''
      }];

      this.$nextTick(() => {
        this.$refs.form && this.$refs.form.clearValidate();
      });

    },

    addRow() {
      this.bindParamsForm.list.push({
        steelType: '',
        rfidType: '',
        workpieceRfid: ''
      });
    },

    removeRow(i) {
      this.bindParamsForm.list.splice(i, 1);
    },

    /** 根据RFID获取工件/电极信息 */
    checkTheStatusOfTheWorkpiece(row) {
      const rfid = row.workpieceRfid;
      // 校验是否为 10 位数字
      const isValidRfid = /^\d{10}$/.test(rfid);

      if (!isValidRfid) {
        this.$modal.msgError('请输入有效的RFID！');
        row.workpieceRfid = ''; // 清空无效输入
        return;
      }
      const that = this
      checkTheStatusOfTheWorkpiece({ 'workpieceRfid': row.workpieceRfid }).then(res => {
        if(res!=null&&res!=undefined){
          if (res.msg == '1') {
            this.$modal.msgError('该RFID 已存在绑定关系')
            row.workpieceRfid = '';
            return ;
          }else if (res.msg == '0') {
            this.openDialog(row,row.index);

          
          } 
        }
          
        })
    },

    /** 表格数据增加index */
    tableRowClassName({ row, rowIndex }) {
      //把每一行的索引放进row
      row.index = rowIndex
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

    

    /** 未完报工确认按钮 */
    submitForm: function() {
      this.loading = true
      setTimeout(() => {
        this.loading = false   //点击一次时隔五秒后才能再次点击
      }, 5000)
      this.$refs['form'].validate(valid => {
        if (valid) {
          const arr = this.reportList
          
        }
      })
    },

    
    closeDialog(){
      this.programmeFtp.open = false;
    },
    
    /** 发送机床命令  */
    async startDevice () {
      const arr = []
      this.loading = true
      setTimeout(() => {
        this.loading = false   //点击一次时隔五秒后才能再次点击
      }, 5000)
      const nc = this.formProgramme.fileType === 'ElecNC_Sep' ? '0' : '1';
      const controller = this.workpieceList[0].controller;
      this.workpieceList.forEach(item => {
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
   handleBindRfidChange(item, index) {
      if (!item.workpieceRfid) {
        return;
      }

      const rfid = item.workpieceRfid.trim();
      const isValidRfid = /^\d{10}$/.test(rfid);
      if (!isValidRfid) {
        this.$modal.msgError('请输入10位数字的RFID！');
        item.workpieceRfid = '';
        return;
      }

      const hasDuplicate = this.bindParamsForm.list.some((entry, entryIndex) => {
        if (entryIndex === index) {
          return false;
        }
        return entry && entry.workpieceRfid === rfid;
      });
      if (hasDuplicate) {
        this.$modal.msgError('RFID 不能重复！');
        item.workpieceRfid = '';
        return;
      }

      checkTheStatusOfTheWorkpiece({ 'workpieceRfid': rfid }).then(res => {
        if (res != null && res != undefined) {
          if (res.msg == '1') {
            this.$modal.msgError('该RFID 已存在绑定关系')
            item.workpieceRfid = '';
          }
        }
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

  
  }
}
</script>

