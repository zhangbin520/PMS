<template>
  <div class="app-container">
    <el-card height="50px">
      <el-form :model="queryParams" ref="queryForm" :inline="true">
        <el-row>
          <!-- <el-button style="margin-left: 10px;margin-right: 10px;margin-top: 3px" type="primary" icon="el-icon-search"
                     size="mini" @click="handleQuery"
          ></el-button> -->
          <el-form-item style="margin-left: 20px" prop="keywords">
            <span
              style="text-align: center; font-size: 18px; margin-right: 12px"
              >设备:</span
            >
            <el-select
              v-model="queryParams.deviceNo"
              filterable
              placeholder="请选择"
              @change="getDischange"
              clearable
              style="width: 200px"
            >
              <el-option
                v-for="item in deviceList"
                :key="item.id"
                :label="item.deviceNo"
                :value="item.deviceNo"
              >
              </el-option>
            </el-select>
          </el-form-item>

           <el-form-item label="生产单号" prop="workpieceProdOrderNo">
          <el-input
            v-model="queryParams.workpieceProdOrderNo"
            placeholder="请输入生产单号"
            clearable
            size="small"
            style="width: 220px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="电极生产单号" prop="electrodeProdOrderNo">
          <el-input
            v-model="queryParams.electrodeProdOrderNo"
            placeholder="请输入电极生产单号"
            clearable
            size="small"
            style="width: 220px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="RFID" prop="rfid">
          <el-input
            v-model="queryParams.rfid"
            placeholder="请输入RFID"
            clearable
            size="small"
            style="width: 220px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="任务状态" prop="gender">
              <el-select v-model="queryParams.autoStatus" placeholder="请选择" style="width: 100%">
                <el-option
                  v-for="dict in dict.type.edm_task_status"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                ></el-option>
              </el-select>
            </el-form-item>
        <el-form-item v-loading="loading" style="padding-left: 35px">
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">查询</el-button>
        </el-form-item>
          
        </el-row>
      </el-form>
    </el-card>


    <!--任务列表-->
    <el-col :span="24">
      <el-card>
        <el-card v-loading="loading" style="margin-top: 5px" align="center">
          <el-button size="small" type="primary" @click="beginNing" icon="el-icon-s-order" v-preventReClick="2000"  :disabled="selectionList.length === 0" >
            开工
          </el-button>
         
          <el-button  size="small"  type="success" @click="ending" icon="el-icon-success"  v-preventReClick="2000" :disabled="selectionList.length === 0" >
            完工
          </el-button>
        </el-card>
        <el-table v-loading="loading"  ref="editableList" :row-key="row => row.pid" :data="edmSemiAutoList" style="width: 100%; margin-top: 5px"  
          max-height="550px"  @selection-change="handleSelectionChange"   border highlight-current-row >
          <el-table-column type="index" label="序号" width="50" align="center" />
          
          <el-table-column  type="selection" align="center" :selectable="select" fixed />
          <el-table-column  label="批次号" prop="batchNo" align="center" width="50" />
          <el-table-column  label="库位ID" prop="toolMagazineNumber" align="center" width="50" />
          <el-table-column  label="刀库RFID" prop="toolMagazineRfid" align="center" width="100" />
          <el-table-column label="设备编号" prop="deviceNo" align="center" />
        <el-table-column label="工件/电极RFID"  align="center"  prop="rfid"  width="120px"/>          
          <el-table-column label="生产单号"   prop="workpieceProdOrderNo" align="center"  />
          <el-table-column label="电极生产单号"   prop="electrodeProdOrderNo" align="center"  />
          <el-table-column label="模号" prop="moduleNo" align="center" />
          <el-table-column label="件号" prop="pieceNo" align="center" />
          <el-table-column label="电极序号" prop="electrodeNo" align="center" />
          <el-table-column label="自动化任务状态" prop="autoStatus" align="center" >
             <template slot-scope="scope">
                <el-tag v-if="scope.row.autoStatus === '1'" type="primary">已发送</el-tag>
                <el-tag v-if="scope.row.autoStatus === '2'" type="info">已完成</el-tag>
                <el-tag v-if="scope.row.autoStatus === '3'" type="danger">删除报废</el-tag>
             </template>
          </el-table-column>
          <el-table-column label="创建时间" prop="createTime" align="center" width="100"/>
          <!-- <el-table-column label="操作" align="center" width="200px">
            <template slot-scope="scope">
              <el-tooltip class="item" effect="dark" content="跑位数据" placement="top-start" >
                <el-button circle type="primary" icon="el-icon-picture-outline" @click="handleWatchCustomer(scope.row)"></el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="量测结果" placement="top-start" >
                <el-button circle type="primary" icon="el-icon-bank-card" @click="watchCmmResult(scope.row)"></el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="删除" placement="top-start" >
                <el-button type="danger" circle icon="el-icon-delete" @click="handleDeleteData(scope.row, scope.$index)"></el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="修改" placement="top-start" >
                <el-button type="success" circle icon="el-icon-edit" @click="addNewAtribute(scope.row, scope.$index,'2')"></el-button>
              </el-tooltip>
            </template>
          </el-table-column> -->
        </el-table>
         <div align="center">
          <pagination
            v-show="total>0"
            :total="total"
            :page.sync="queryParams.pageNo"
            :limit.sync="queryParams.pageSize"
            @pagination="getListEdmTaskList"
          />
          </div>
      </el-card>
    </el-col>
    

  </div>
</template>

<script>
import Sortable from "sortablejs";
import request from "@/utils/request";
import { getCamElectrodeBom, getCamSparkList } from "@/api/jy/electrodeMange";
import { getCmmSparkPointList } from "@/api/production/edmAutomation";
import { getBaseElectrodeByRfid } from "@/api/production/semiAutomation";
import {
  getEdmAutoList,
  autoDataStartOrComplete,
} from "../../../api/production/eleprocess/poleprocess";

export default {
  name: "EdmWorkList",
  dicts: ['edm_task_status'],
  data() {
    return {
      // 遮罩层
      loading: true,
      
      magazine: {
          // 是否显示弹出层
          open: false,
          // 弹出层标题
          title: "新增刀库",
          currentIndex: null, 
        },
      //开始状态
      begin: true,
      //非单个禁用
      single: true,
      //非多个禁用
      multiple: true,
      //多选状态
      selectStatue: false,
      //选中状态
      reserveEnabled: true,
      steelEnabled: true,
      eleEnabled: true,
      assistEnabled: true,
      conditionEnabled: true,
      configTeeEnabled: true,

      selectedDevice: null,
      // 总条数
      total: 0,
   
      index: "",
      //多选后的自动化列表
      selectionList: [],
      
      //接受弹框数据
      form: {},
      queryDaoParams: {},
      openProgram: false,
      titleProgram: "",
      //设备列表
      deviceList: [],
      edmSemiAutoList: [],
      middleList: [],
      queryParamsCam: {
        pageNo: 1,
        pageSize: 10,
      },
      knifeRfidList: [],
      selectedknifeLibraryList: [],// 选中的设备绑定的刀库列表
     
      measureResult: {
        // 是否显示弹出层
        open: false,
        // 弹出层标题
        title: "电极量测结果",
      },
      //用户信息
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      openPosition: false,
      //选中数组
      ids: [],

      id: "",
      //待选设备列表
      equipmentSelection: {},
  
      // 查询参数
      queryParams: {
        pageNo: 1,
        pageSize: 10,
      },
      
     
      

      //多选框全选
      checkAll: false,
      isIndeterminate: true,
      //解绑rfid集合
      rfids: {},
      //接收表单校验
      rules: {
        point: [
          { required: true, message: "点位位置不能为空", trigger: "blur" },
        ],
      },
    };
  },
  computed: {
    // 计算属性，返回一个包含所有设备编号的数组
    deviceNos() {
      return this.deviceList.map((item) => item.deviceNo);
    },
  },
 
  created() {
    this.getEquipment();
    this.getListEdmTaskList()
  },

  mounted() {
    
  },
  methods: {
    handleSpark() {},
    handleCmm() {},
    /** 分页查询设备信息列表 */
    getEquipment() {
      const id = "thisid";
      /** 查询DEVICE LIST*/
      this.loading = true;
      return request({
        url: "/equipment/section/getEquipmentSectionList/" + id,
        method: "get",
      }).then((response) => {
        this.deviceList = response.data;
        this.loading = false;
      });
    },
//  选中设备
    getIncreaseList(deviceList) {
      if (deviceList === null) {
        deviceList.length = 8;
      }
      this.semiAutoList = [];
      this.loading = true;
      
      for (var i = 0; i < deviceList.length; i++) {
        var obj = {};
        obj.reserveR = this.reserveR;
        obj.reserveZ = this.reserveZ;
        obj.oilTankHeight = this.oilTankHeight;
        obj.deviceNo = deviceList[i].deviceNo;
        obj.machineType = deviceList[i].machineType;

        obj.workpieceEleRfid = null;
        obj.toolMagazineRfid = null;
        obj.moduleNo = null;
        obj.workpieceNo = null;
        obj.suffix = null;
        obj.sparkGap = null;
        obj.xpitch = null;
        obj.ypitch = null;
        obj.zpitch = null;
        obj.num = null;
        obj.sparkGap = null;
        obj.currentProcess = null;
        obj.pid = i + 1; 
        this.semiAutoList[i] = obj;
      }
      this.loading = false;
    },

    /** 多选框禁选 */
    select(row, index) {
      if (row.id !== null && row.id !== undefined && row.id !== "") {
        return true; //可勾选
      } else {
        return false; //不可勾选
      }
    },

    beginNing() {
      this.$modal
        .confirm("是否确认将选中数据开工？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }).then(() => {
          this.loading = true;
          autoDataStartOrComplete(this.selectionList)
            .then((response) => {
              this.loading = false;
              this.$message.success("操作成功");
              this.getListEdmTaskList();
            })
            .catch(() => {
              this.loading = false;
            });
        }).catch(() => {
          this.loading = false;
          this.$message.info("已取消操作");
        });

    },
     ending() {
      this.$modal
        .confirm("是否确认将选中数据完工？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
        .then(() => {
          this.loading = true;
          autoDataStartOrComplete(this.selectionList)
            .then((response) => {
              this.loading = false;
              this.$message.success("操作成功");
              this.getListEdmTaskList();
            })
            .catch(() => {
              this.loading = false;
            });
        })
        .catch(() => {
          this.loading = false;
          this.$message.info("已取消操作");
        });
     },
    // 发送数据到后台
    sendAutoData() {
      const selectArray = this.selectionList;
      if (selectArray.length > 0) {
        selectArray.forEach((item) => {
          this.$set(item, 'autocorrectionWorkpiece', this.steelEnabled ? true : false);
          this.$set(item, 'autocorrectionElectrode', this.eleEnabled ? true : false);
          this.$set(item, 'confirmRemainBeforeProcess', !!item.configTeeEnabled);
        });
      } else {
        return;
      }
    },
   

    /** 搜索按钮操作 */
      handleQuery() {
        this.queryParams.pageNo = 1;
        this.getListEdmTaskList();
      },

    getListEdmTaskList() {
      
      this.loading = true;
      getEdmAutoList(this.queryParams)
        .then((response) => {
          this.edmSemiAutoList = response.data.records;
          this.total = response.data.total;
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },


    /** 设备选中事件 */
    getDischange(value) {
      this.knifeRfidList = [];
      // value 是选中的 deviceNo
      const selectedItem = this.deviceList.find(
        (item) => item.deviceNo === value
      );
      if (selectedItem) {
        // 获取 key、id、deviceNo
        const key = selectedItem.id;
        const id = selectedItem.id;
        const deviceNo = selectedItem.deviceNo;
        // 你可以在这里使用 key、id、deviceNo
        console.log("选中设备:", { key, id, deviceNo });
        // 例如赋值到 data
        this.selectedDevice = { key, id, deviceNo };
        this.selectedknifeLibraryList = selectedItem.knifeLibraryList;
        this.knifeLibraryList= selectedItem.knifeLibraryList;
        this.getIncreaseList(selectedItem.knifeLibraryList);
      }
    },
    /** 回车事件 */
    handelTab(i, e) {
      let indexKey = i + 1
      
      if (this.semiAutoList.length === indexKey) {
        this.$nextTick(() => {
          this.$refs['input1'].focus()
          e.target.blur()
        })
      } else {
        this.$nextTick(() => {
          this.$refs['input0'].focus()
        })
      }
    },
    
    
    submitAddForm(){//  保存模态框
      if(this.doCheckingAddAtri()){
          // 更新刀库编号
        this.$set(this.semiAutoList[this.magazine.currentIndex], 'conditionSelect', this.conditionSelect);
        // 更新刀库RFID (使用找到的值，可以校正用户输入的大小写或前后空格)
        this.$set(this.semiAutoList[this.magazine.currentIndex], 'g132Select', this.resultG132);
        this.$set(this.semiAutoList[this.magazine.currentIndex], 'machiningAllowanceR', this.reserveR);
        this.$set(this.semiAutoList[this.magazine.currentIndex], 'machiningAllowanceZ', this.reserveZ);
        this.$set(this.semiAutoList[this.magazine.currentIndex], 'oilTankHeight', this.oilTankHeight);
        this.magazine.open = false;
      }
    },
   
    // 取消按钮
    cancel() {
      this.magazine.open = false;
      this.reset();
      this.magazine.currentIndex = null;
    },
    /** 分页EDM自动化电极信息 */
    getProductionList(c) {
      const workpieceEleRfid = c;
      this.$modal.loading("正在查询数据，请稍候！");
      getBaseElectrodeByRfid({ keyWords: workpieceEleRfid }).then(
        (response) => {
          this.$modal.closeLoading();
          this.middleList = response.data;
          this.semiAutoList.splice(
            this.index,
            1,
            Object.assign(this.semiAutoList[this.index], this.middleList)
          );
        }
      );
    },

    /** 多选框全选 */
    handleCheckAllChange(val) {
      if (this.checkAll) {
        this.queryParams.taskStatusList = [0, 1, 2, 3, 4, 5];
        this.isIndeterminate = false;
      } else {
        this.queryParams.taskStatusList = [];
      }
    },

    // 多选框选中数据
    handleSelectionChange(selection) {
      /* if (selection.length > 1) {
      // 只保留最后一个
      const last = selection[selection.length - 1];
      this.$refs.editableList.clearSelection();
      this.$refs.editableList.toggleRowSelection(last, true);
     }
     */ this.selectionList = selection;
      this.multiple = false;
    },
    // 点击行时自动勾选当前行
    handleRowClick(row) {
      this.$refs.editableList.clearSelection();
      this.$refs.editableList.toggleRowSelection(row, true);
    },
    // 可选行判断
    selected(row, index) {
      return true; // 所有行都可选
    },





    /* 解析字段  */

  },
};
</script>
<style lang="scss">
.assist-row {
  display: flex;
  align-items: center;
  gap: 12px;
}
.assist-label,
.assist-row .el-select {
  font-size: 14px;
  color: #333;
  line-height: 40px;
  text-align: right;
  padding: 0 12px 0 0;
}
.assist-row .el-select {
  width: 80px;
}

.assist-label {
  font-size: 14px;
  color: #606266;
  font-weight: 700;
  line-height: 40px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}
.highlight {
  border: 2px solid red; /* 自定义高亮样式 */
}
.drag-handle {
  cursor: move; /* 设置鼠标样式为移动 */
  display: inline-block; /* 设置为行内块元素 */
  width: 20px; /* 设置宽度 */
  height: 20px; /* 设置高度 */
  background-color: #409eff; /* 设置背景颜色 */
  color: #fff; /* 设置文字颜色 */
  text-align: center; /* 设置文字居中 */
  line-height: 20px; /* 设置行高 */
  border-radius: 50%; /* 设置圆角 */
  margin-right: 10px; /* 设置右边距 */
}
/* 可根据需要自定义拖拽手柄样式 */
</style>
