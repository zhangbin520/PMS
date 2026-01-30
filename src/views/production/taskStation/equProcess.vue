<template>
  <div class="app-container">
    <el-card>
      <el-form :model="queryParams" ref="queryForm" :inline="true">
        <el-row>
          <el-form-item label="生产单号" prop="keywords">
            <el-input
              v-model="queryParams.prodOrderNo"
              placeholder="输入生产单号"
              clearable
              size="small"
              style="width: 200px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="RFID" prop="keywords">
            <el-input
              v-model="queryParams.rfid"
              placeholder="输入RFID"
              clearable
              size="small"
              style="width: 200px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="设备：" prop="keywords">
            <el-select v-model="queryParams.equipmentSectionId" filterable placeholder="请选择" clearable @change="handleQuery">
              <el-option
                v-for="item in equipmentFortask"
                :key="item.id"
                :label="item.deviceNo"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          
          <el-form-item>
            <el-button style="margin-left: 10px" type="primary" icon="el-icon-search" size="mini" @click="handleQuery"></el-button>
          </el-form-item>
          </el-row>
        <el-row>
             <div style="float: left">
                <el-form-item label="报工权限：" >  <!-- allPermissionList -->
                  <el-checkbox-group v-model="allPermissionList">
                    <el-checkbox disabled v-for="item in permissionOptionsList" :key="item.status" :label="item.status">{{ item.name }}</el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
            </div>
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
      <el-button
        size="mini"
        type="primary"
        round
        icon="el-icon-s-promotion"
        @click="handleWaitprocess"
      >待接收工件任务列表</el-button>
      <el-button
        size="mini"
        type="info"
        round
        icon="el-icon-s-promotion"
        disabled
      >设备待加工任务列表</el-button>
      <el-button
        size="mini"
        type="success"
        round
        icon="el-icon-s-promotion"
        @click="handleAlreadyAccept"
      >已领取的加工任务</el-button>
      <el-button
        size="mini"
        type="danger"
        round
        icon="el-icon-s-promotion"
        @click="handleAlreadyFinish"
      >我完成的加工任务</el-button>
    </el-card>
<!--     任务列表-->
    <el-card>
      <el-table v-loading="loading" :data="taskStationList" @selection-change="handleSelectionChange"  max-height="680px"
                border highlight-current-row>
        <el-table-column type="index" align="center" />
        <el-table-column type="selection" width="50" align="center" :selectable="selected"/>
        <el-table-column label="当前工序设备" align="center" prop="equipmentSectionCode"/>
        <el-table-column label="生产单号" align="center" prop="prodOrderNo" width="150" :show-overflow-tooltip="true"/>
        <el-table-column label="周转筐编号" align="center" prop="turnoverBasketNo"/>
        <el-table-column label="订单数量" align="center" prop="quantity"/>
        <el-table-column label="已收数量" align="center" prop="receivedQuantity"/>
        <el-table-column label="产出数量" align="center" prop="outputQuantity"/>
        <el-table-column label="工序名称" align="center" prop="code"/>
        <el-table-column label="计划工时" align="center" prop="workHour" />
        <el-table-column label="计划开工时间" align="center" prop="plannedCommencementTime" :show-overflow-tooltip="true"/>
        <el-table-column label="计划完工时间" align="center" prop="plannedCompletionTime" :show-overflow-tooltip="true"/>
        <el-table-column label="模号" align="center" prop="moduleNo" :show-overflow-tooltip="true"/>
        <el-table-column label="件号" align="center" prop="pieceNo"/>
        <el-table-column label="版本" align="center" prop="versionNo"/>
        <el-table-column label="品名" align="center" prop="pinName" />
        <el-table-column label="工艺制程" align="center" prop="process" :show-overflow-tooltip="true"/>
        <el-table-column label="下道工序设备" align="center" prop="nextProcessEquipmentCode"/>
      </el-table>
    </el-card>
    <el-card>
      <div align="center">
        <el-button type="info" icon="el-icon-guide" size="small" @click="logout" >切换用户</el-button>
        <el-button type="primary" icon="el-icon-check" size="small" :disabled="multiple || orderStatus ==='1'" @click="handleAcceptWork">领取加工任务</el-button>
        <el-popconfirm title="确定退回工件吗？" @confirm="handleReturn" style="margin-left: 10px">
          <el-button size="mini" slot="reference" type="danger" icon="el-icon-refresh-left" :disabled="multiple">退回</el-button>
        </el-popconfirm>
      </div>
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="queryParams.pageNo"
        :limit.sync="queryParams.pageSize"
        @pagination="getListTask"
      />
    </el-card>
  </div>
</template>

<script>
  import {
    listEquipmentWaitPage,
    listTaskStation,
    receiveProcessingTask,
    returnWorkpiece
  } from "../../../api/production/taskStation";
  import {listEquipment} from "../../../api/system/equipment";
  import {getUserProfile} from "../../../api/system/user";
  import {listProcess} from "../../../api/system/process";

  export default {
    name: "ViewEquprocess",
    filters: {
      keepTwoNum(value) {
        value = Number(value);
        return value.toFixed(0)
      }
    },
    data() {
      return {
        // 遮罩层
        loading: false,
        // 非多个禁用
        multiple: true,
        // 总条数
        total: 0,
        // 设备加工任务表格数据
        taskStationList: [],
        //设备搜索数据
        equipmentFortask:[],
        //周转筐编码
        BasketCodeFortask:[],
        selectCode:'',
        //工段搜索数据
        processFortask:[],
        //所有权限
        allPermissionList:[],
        permissionOptionsList:[],
        //任务ID
        Id:[],
        //用户信息
        userName:'',
        personNo:'',
        deptName:'',
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        //选中数组
        ids:[],
        taskId:'',
        orderStatus:'',
        equipmentSectionId:'',
        // 查询参数
        queryParams: {
          pageNo: 1,
          pageSize: 10,
          taskStatusList:[],
        },
        // 工段查询参数
        queryParamsProcess: {
          pageNo: 1,
          pageSize: 1000,
        },
        taskStatusOptions: [{
          status: 0,
          name: "待接收"
        },{
          status: 1,
          name: "已领取"
        },{
          status: 2,
          name: "加工中"
        },{
          status: 3,
          name: "已暂停"
        },{
          status: 4,
          name: "任务异常"
        },{
          status: 5,
          name: "已完成"
        },],
        //多选框全选
        checkAll: false,
        isIndeterminate: true,
        //接收表单校验
        rules: {
          receivedQuantity: [
            { required: true, message: "接收数量不能为空", trigger: "blur" },
          ],
        },
      }
    },
    created() {
      // this.getListTask();
      this.getListEquipment();
      this.getListUser();
      this.getListTask();
    },
    methods: {
      /** 查询设备待加工任务列表 */
      getListTask() {
        this.loading = true;
        listEquipmentWaitPage(this.queryParams).then(response => {
          this.taskStationList = response.data.records;
          this.total = response.data.total;
          this.loading = false;
        })
      },
      /** 查询设备列表 */
      getListEquipment() {
        listEquipment(this.queryParamsProcess).then(response => {
          this.equipmentFortask = response.data.records
        });
      },
      /** 查询登录用户信息*/
      getListUser() {
        getUserProfile().then(response => {
          console.log('response:'+response)
          this.permissionOptionsList = response.list;
          if(this.permissionOptionsList!=null&&this.permissionOptionsList.length>0){
            for(var i=0;i<this.permissionOptionsList.length;i++){
              this.allPermissionList.push(this.permissionOptionsList[i].status);
            }
          }
          this.userName = response.data.nickName
          this.personNo = response.data.userName
          this.deptName = response.data.dept.name
        });
      },
      /** 搜索按钮操作 */
      handleQuery() {
        this.queryParams.pageNo= 1;
        this.getListTask();
      },

      // 多选框选中数据
      handleSelectionChange(selection) {
        this.ids = selection.map(item => item.id)
        this.taskId = selection.map(item => item.taskId)
        
        this.selectCode = selection.map(item => item.code) 
        console.log('debugger:'+this.selectCode)
        this.orderStatus = selection.map(item => item.orderStatus).join('')
        this.equipmentSectionId = selection.map(item => item.equipmentSectionId).join('')
        this.multiple = !selection.length
      },
      /** 多选框全选 */
      handleCheckAllChange(val) {
        if (this.checkAll){
          this.queryParams.taskStatusList = [0,1,2,3,4,5];
          this.isIndeterminate = false;
        }else {
          this.queryParams.taskStatusList = []
        }
      },
      /**领取加工任务按钮*/
      handleAcceptWork() {
        var obj = {} ;
        obj.ids = this.ids
        obj.equipmentSectionId = this.equipmentSectionId
        if (Array.isArray(this.selectCode)) {
            obj.code = this.selectCode.length > 0 ? this.selectCode[0] : '';
        } else {
            obj.code = this.selectCode;
        }
        receiveProcessingTask(obj).then(response =>{
          if(response!=undefined){
              this.$modal.msgSuccess("领取任务成功");
            
          }
          this.getListTask();
        })
      },
      /** 未接收数量为空显示0 */
      quantityFormat(row) {
        return row.quantityNotReceived == null?"0":row.quantityNotReceived;
      },
      /** 工件待接收任务列表 */
      handleWaitprocess() {
        this.$router.push({
          path:'/production/taskStation',
        });
      },
      /** 已领取的加工任务 */
      handleAlreadyAccept() {
        this.$router.push({
          path:'/production/taskStation-edit/myTask',
        });
      },
      /** 我完成的加工任务 */
      handleAlreadyFinish() {
        this.$router.push({
          path:'/production/taskStation-edit/finishTask',
        });
      },
      /** 切换用户 */
      async logout() {
        this.$confirm('确定注销并切换用户吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$store.dispatch('LogOut').then(() => {
            location.href = '/index';
          })
        }).catch(() => {});
      },
      /**退回按钮*/
      handleReturn() {
        const taskId = this.taskId.join('')
        var code = '' ;
        if (Array.isArray(this.selectCode)) {
            code = this.selectCode.length > 0 ? this.selectCode[0] : '';
        } else {
            code = this.selectCode;
        }
        returnWorkpiece({'taskId':taskId,'code':code}).then(response =>{
          if(response != undefined){
            this.$modal.msgSuccess("退回工件成功");
          }
          
          this.getListTask();
        })
      },
      /** 多选框禁选 */
      selected(row,index){
        
        if (row.receivedQuantity === 0 || row.receivedQuantity === row.outputQuantity || row.frozen === '1') {
          return false //不可勾选
        } else {
          return true; //可勾选
        }
      },
    }
  }
</script>
