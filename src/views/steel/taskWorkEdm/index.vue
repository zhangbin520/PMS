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
              style="text-align: center; font-size: 18px; margin-right: 12px; font-weight: 548 !important"
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


        <el-row>
        <el-form-item label="工件RFID" prop="workPieceRfid">
          <el-input
            v-model="querySteelParams.workPieceRfid"
            placeholder="请输入工件RFID"
            clearable
            size="small"
            style="width: 200px"
            @change="selectSteelWorkPieceRfid(querySteelParams.workPieceRfid)" 
          />
        </el-form-item>
          
        </el-row>
      </el-form>
    </el-card>


    <!-- el-card>
      <el-form :model="querySteelParams"  :inline="true">
        <el-row>
        <el-form-item label="工件RFID" prop="workPieceRfid">
          <el-input
            v-model="querySteelParams.workPieceRfid"
            placeholder="请输入工件RFID"
            clearable
            size="small"
            style="width: 220px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        </el-row>
      </el-form>
    </el-card> -->

    <el-card>
      <el-form :model="queryDaoParams"  :inline="true">
        <el-row>

          <el-form-item label="">
            <el-checkbox v-model="eleEnabled"></el-checkbox>
          </el-form-item>
          <el-form-item label="加工前自动校正电极" prop="keywords">
          </el-form-item>
          <el-form-item label="">
            <el-checkbox v-model="steelEnabled"></el-checkbox>
          </el-form-item>
          <el-form-item label="加工前自动校正工件" prop="keywords">
          </el-form-item>
          <el-form-item label="">
            <el-checkbox v-model="configTeeEnabled"></el-checkbox>
          </el-form-item>
          <el-form-item label="精加工前自动确认余量" prop="keywords">
          </el-form-item>
        </el-row>

        <el-row>
          <el-form-item label="">
            <el-checkbox v-model="reserveEnabled"></el-checkbox>
          </el-form-item>
          <el-form-item label="加工预留量：" prop="keywords">
            <div style="float: right">
              <el-form-item label="R预留">
                <el-input-number
                  v-model="reserveR"
                  :min="0"
                  :step="0.001"
                  :precision="3"
                  :step-strictly="false"
                  :controls="true"
                  style="width: 130px"
                />
              
              </el-form-item>
              <el-form-item label="Z预留：">
                <el-input-number
                  v-model="reserveZ"
                  :min="0"
                  :step="0.001"
                  :precision="3"
                  style="width: 130px"
                />
              </el-form-item>
              <el-form-item label="油槽高度：">
                <el-input-number
                  v-model="oilTankHeight"
                  :min="0"
                  :step="1"
                  :precision="1"
                  style="width: 120px"
                />
              </el-form-item>
            </div>
          </el-form-item>
        </el-row>

        
      </el-form>
    </el-card>

    <!--任务列表-->
    <el-col :span="24">
      <el-card>
        <el-card v-loading="loading" style="margin-top: 5px" align="center">
          <el-button size="small" type="danger" @click="checking" icon="el-icon-s-check"  v-preventReClick="2000" :disabled="multiple" >
            检查数据
          </el-button>
          
          <el-button size="small" type="primary" @click="sendAutoData" icon="el-icon-s-release" v-preventReClick="2000" :disabled="multiple">
            发送数据
          </el-button>

          <el-button size="small" type="warning" @click="addSemiAutoData" icon="el-icon-plus" v-preventReClick="1500" :disabled="addButtonStatus">
            新增
          </el-button>

          
        </el-card>

        <el-table v-loading="loading"  ref="editableList" :row-key="row => row.pid" :data="semiAutoList"
          max-height="680px"  @selection-change="handleSelectionChange"  :row-class-name="tableRowClassName"  :disabled="selectionList.length === 0 || multiple"
          @row-click="handleRowClick" border highlight-current-row >
          <el-table-column type="index" label="序号" width="50" align="center" fixed="left"/>
          <!-- 新增拖拽手柄列 -->
          <el-table-column width="50" align="center" label="自由拖拽" >
            <template slot-scope="scope">
              <!-- 此处使用 Element UI 的图标作为拖拽手柄 -->
              <i class="el-icon-rank drag-handle" style="cursor: move"></i>
            </template>
          </el-table-column>
          <el-table-column  type="selection" align="center" :selectable="selected" fixed />
          <el-table-column  label="库位ID" prop="toolMagazineNumber" align="center" width="50" />
          <!-- <el-table-column  label="P ID" prop="pid" align="center" width="50" /> -->
          <el-table-column label="设备编号" prop="deviceNo" align="center" fixed="left"/>
          <el-table-column label="设备品牌" prop="machineType" align="center" />
<el-table-column label="刀库RFID"  align="center" key="toolMagazineRfid" prop="toolMagazineRfid"  width="122px">
            <template slot-scope="scope">
              <el-input v-model="scope.row.toolMagazineRfid" autofocus="true"
                @change="selectToolMagazineRfid(scope.row,scope.$index)" ref="input0"
                @keyup.enter.native="handelTab(scope.row.index,$event)" >
                {{ scope.row.toolMagazineRfid }}
              </el-input>
            </template>
</el-table-column>
<el-table-column label="工件/电极RFID"  align="center" key="workpieceEleRfid" prop="workpieceEleRfid"  width="122px">
            <template slot-scope="scope">
              <el-input  v-model="scope.row.workpieceEleRfid"  autofocus="true" ref="input1"
                @keyup.enter.native="handelTab(scope.row.index,$event)"
                @change="selectProduction(scope.row)" >
                {{ scope.row.workpieceEleRfid }}
              </el-input>
            </template>
</el-table-column>
          <el-table-column label="R预留" prop="machiningAllowanceR" align="center"  width="90px" >
            <template slot-scope="scope">
              <el-input v-model="scope.row.machiningAllowanceR"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="Z预留" prop="machiningAllowanceZ"  align="center"  width="90px" >
            <template slot-scope="scope">
              <el-input v-model="scope.row.machiningAllowanceZ"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="油槽高度" prop="oilTankHeight" align="center"  width="80px" >
            <template slot-scope="scope">
              <el-input v-model="scope.row.oilTankHeight"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="X方向平移次数" prop="xjump"  align="center"  width="75px" >
            <template slot-scope="scope">
              <el-input v-model="scope.row.xjump" @blur="validateXjump(scope.row, scope.$index)"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="Y方向平移次数" prop="yjump" align="center"  width="75px" >
            <template slot-scope="scope">
              <el-input v-model="scope.row.yjump" @blur="validateYjump(scope.row, scope.$index)"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="放电模型能量面积" prop="edmArea" align="center"  width="100px" >
            <template slot-scope="scope">
              <el-input v-model="scope.row.edmArea" @blur="validateNumber(scope.row, scope.$index)"></el-input>
            </template>
          </el-table-column>
          edm_area
          <!-- <el-table-column label="G132辅助选择" prop="g132Select" width="140px"  align="center"  />
          <el-table-column label="加工条件选择" prop="conditionSelect" align="center" width="140px"  /> -->
          <el-table-column label="生产单号" v-if="false"  prop="workpieceProdOrderNo" align="center"  />
          <el-table-column label="设备品牌" v-if="false"  prop="machineType" align="center"  />
          <el-table-column label="任务单号"   prop="taskNo" align="center"  />
          <el-table-column label="电极生产单号"   prop="electrodeProdOrderNo" align="center"  />
          <el-table-column label="电极序号"   prop="electrodeNo" align="center"  />
          <el-table-column label="模号" prop="moduleNo" align="center" />
          <el-table-column label="件号" prop="pieceNo" align="center" />
          <el-table-column label="电极号" prop="suffix" align="center" />
          <el-table-column label="电极间隙" prop="sparkGap" align="center" />
          <el-table-column label="量测结果" prop="currentProcess" align="center" width="50" />
          <el-table-column label="基准台X" prop="xpitch" align="center" />
          <el-table-column label="基准台Y" prop="ypitch" align="center" />
          <el-table-column label="基准台Z" prop="zpitch" align="center" />
          <el-table-column label="C角度" prop="num" align="center" width="50" />
          <el-table-column label="XY平均间隙" prop="bodyScaled" align="center" />
          <el-table-column label="操作" align="center" width="160px" fixed="right">
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
              <!-- <el-tooltip class="item" effect="dark" content="修改" placement="top-start" >
                <el-button type="success" circle icon="el-icon-edit" @click="addNewAtribute(scope.row, scope.$index,'2')"></el-button>
              </el-tooltip> -->
            </template>
          </el-table-column>
        </el-table>
    </el-card>
    </el-col>

    <!--电火花放电参数对话框-->
    <el-dialog :title="titleProgram" :visible.sync="openProgram" width="1300px" :modal-append-to-body="false" >
      <el-row :gutter="20">
        <el-col :span="24">
          <h2>电火花放电参数列表</h2>
          <el-table :data="camElectrodList" border>
            <el-table-column label="X方向平移距离" align="center" prop="xpitch" />
            <el-table-column label="X方向平移次数" align="center" prop="xjump" />
            <el-table-column label="Y方向平移次数" align="center" prop="yjump" />
            <el-table-column label="Y方向平移距离" align="center" prop="ypitch" />
            <el-table-column label="VDI底面纹，第一个程式" align="center" prop="vdiFloor" />
            <el-table-column label="VDI侧面纹，第二个程式" align="center" prop="vdiSide" />
            <el-table-column label="放电间隙（火花位）" align="center" prop="sparkGap" />
            <el-table-column label="实体是否已缩放电间隙" align="center" prop="bodyScaled" />
            <el-table-column label="摇动方式（圆摇、方摇、球摇）" align="center" prop="orbitType" />
            <el-table-column label="电极作用" align="center" prop="elecUse" />
            <el-table-column label="电极上公差" align="center" prop="elecUpTol" />
            <el-table-column label="电极下公差" align="center" prop="elecDownTol" />
            <el-table-column label="加工面积，投影面积" align="center" prop="edmFace" />
            <el-table-column label="放电模型能量面积" align="center" prop="edmArea" />
            <el-table-column label="实体是否已缩放电间隙" align="center" prop="bodyScaled" />
            <el-table-column label="工位精度" align="center" prop="edmAreaPrecision"  />
            <el-table-column label="夹具型号" align="center" prop="fixtureNumber" />
            <el-table-column label="固定方式" align="center" prop="elecFixture" />
            <el-table-column label="有效高度" align="center" prop="effectiveHeight" />
          </el-table>
        </el-col>
      </el-row>
    </el-dialog>

    <!-- 查看电极量测结果数据 -->
    <el-dialog :title="measureResult.title"  :visible.sync="measureResult.open"  width="1600px" >
      <el-table :data="measureResultList" v-loading="loading" border max-height="900px" :modal-append-to-body="false">
        <el-table-column label="序号" type="index" align="center" />
        <el-table-column label="工件生产单号" prop="workpieceProdOrderNo"  align="center" />
        <el-table-column label="电极生产单号" prop="electrodeProdOrderNo"  align="center" />
        <el-table-column label="EDM工序序号" prop="edmNo" align="center" />
        <el-table-column label="模号" prop="moduleNo" align="center" />
        <el-table-column label="件号" prop="pieceNo" align="center" />
        <el-table-column label="版本" prop="versionNo" align="center" />
        <el-table-column label="电极RFID" prop="rfid" align="center" />
        <el-table-column label="最大间隙" prop="maxGap" align="center" />
        <el-table-column label="平均间隙" prop="avgGap" align="center" />
        <el-table-column label="x偏差" prop="x" align="center" />
        <el-table-column label="y偏差" prop="y" align="center" />
        <el-table-column label="c偏差" prop="c" align="center" />
        <el-table-column label="z偏差" prop="z" align="center" />
        <el-table-column label="量测结果" prop="testResult" align="center" />
        <el-table-column label="量测NG需要原因" prop="reason" align="center" />
        <el-table-column label="同大同小规格"  prop="uniformOversize" align="center"/>
        <el-table-column label="同大同小上公差" prop="uoUpTolerance" align="center" />
        <el-table-column label="同大同小下公差"  prop="uoLowTolerance"  align="center" />
        <el-table-column label="XY最大值" prop="xyMaxGap" align="center" />
        <el-table-column label="XY最小值" prop="xyMinGap" align="center" />
        <el-table-column label="XY差值" prop="xyDifferential" align="center" />
        <el-table-column label="XY平均值" prop="xyAvgGap" align="center" />
        <el-table-column label="XY是否同大同小" prop="xyUO" align="center" />
        <el-table-column label="Z最大值" prop="zMaxGap" align="center" />
        <el-table-column label="Z最小值" prop="zMinGap" align="center" />
        <el-table-column label="Z差值" prop="zDifferential" align="center" />
        <el-table-column label="Z平均值" prop="zAvgGap" align="center" />
        <el-table-column label="Z是否同大同小" prop="zUO" align="center" />
        <el-table-column label="c偏差角度" prop="angle" align="center" />
        <el-table-column label="创建时间" prop="createTime" align="center" />
        <el-table-column label="修改时间" prop="updateTime" align="center" />
      </el-table>
    </el-dialog>

    <!-- 新增属性  -->
    <el-dialog :title="magazine.title" :visible.sync="magazine.open" width="1200px" :modal-append-to-body="false">
      <el-form ref="form" :model="queryKuParams"    :rules="rules" label-width="100px">
        <el-row :gutter="24">
          <el-col :span="24">
            <el-form-item label="">
            <div class="assist-row">
              <el-checkbox v-model="assistEnabled"></el-checkbox>
              <span class="assist-label">G132辅助选择</span>
              <span class="assist-label">G132D60Q</span>

              <el-select v-model="queryKuParams.workG" placeholder="请选择" style="width: 90px" clearable >
                <el-option :key="1" :value="1"></el-option>
                <el-option :key="2" :value="2"></el-option>
                <el-option :key="3" :value="3"></el-option>
              </el-select>
              A
              <el-select v-model="queryKuParams.workA" placeholder="请选择" style="width: 90px" clearable>
                <el-option :key="2" :value="2"></el-option>
                <el-option :key="3" :value="3"></el-option>
                <el-option :key="4" :value="4"></el-option>
                <el-option :key="5" :value="5"></el-option>
                <el-option :key="6" :value="6"></el-option>
                <el-option :key="7" :value="7"></el-option>
                <el-option :key="8" :value="8"></el-option>
                <el-option :key="9" :value="9"></el-option>
                <el-option :key="10" :value="10"></el-option>
              </el-select>
              M
              <el-select v-model="queryKuParams.workM" placeholder="请选择" style="width: 90px" clearable >
                <el-option :key="1" :value="1"></el-option>
                <el-option :key="2" :value="2"></el-option>
              </el-select>
              R
              <el-select v-model="queryKuParams.workR" placeholder="请选择" style="width: 90px" clearable >
                <el-option :key="10" :value="10"></el-option>
                <el-option :key="11" :value="11"></el-option>
                <el-option :key="12" :value="12"></el-option>
                <el-option :key="13" :value="13"></el-option>
                <el-option :key="14" :value="14"></el-option>
                <el-option :key="15" :value="15"></el-option>
                <el-option :key="16" :value="16"></el-option>
                <el-option :key="17" :value="17"></el-option>
                <el-option :key="18" :value="18"></el-option>
              </el-select>
              U
              <el-select v-model="queryKuParams.workU" placeholder="请选择" style="width: 90px" clearable >
                <el-option :key="1" :value="1"></el-option>
                <el-option :key="2" :value="2"></el-option>
                <el-option :key="3" :value="3"></el-option>
              </el-select>
              W
              <el-select v-model="queryKuParams.workW" placeholder="请选择" style="width: 90px" clearable >
                <el-option :key="1" :value="1"></el-option>
                <el-option :key="2" :value="2"></el-option>
                <el-option :key="3" :value="3"></el-option>
              </el-select>
            </div>
          </el-form-item>
          </el-col>
          </el-row>
        <el-row>
          <el-col :span="24">
          <el-form-item label="">
            <div class="assist-row">
              <el-checkbox v-model="conditionEnabled"></el-checkbox>
              <span class="assist-label">加工条件选择</span>
              E
              <el-select v-model="queryKuParams.workE" placeholder="请选择" style="width: 90px" clearable >
                <el-option :key="1" :value="1"></el-option>
                <el-option :key="2" :value="2"></el-option>
                <el-option :key="3" :value="3"></el-option>
              </el-select>
              I
              <el-select v-model="queryKuParams.workI" placeholder="请选择" style="width: 90px" clearable >
                <el-option :key="2" :value="2"></el-option>
                <el-option :key="3" :value="3"></el-option>
                <el-option :key="4" :value="4"></el-option>
                <el-option :key="5" :value="5"></el-option>
                <el-option :key="6" :value="6"></el-option>
                <el-option :key="7" :value="7"></el-option>
                <el-option :key="8" :value="8"></el-option>
                <el-option :key="9" :value="9"></el-option>
                <el-option :key="10" :value="10"></el-option>
              </el-select>
              J
              <el-select v-model="queryKuParams.workJ" placeholder="请选择" style="width: 90px" clearable >
                <el-option :key="1" :value="1"></el-option>
                <el-option :key="2" :value="2"></el-option>
              </el-select>
              O
              <el-select v-model="queryKuParams.workO" placeholder="请选择" style="width: 90px" clearable >
                <el-option :key="10" :value="10"></el-option>
                <el-option :key="11" :value="11"></el-option>
                <el-option :key="12" :value="12"></el-option>
                <el-option :key="13" :value="13"></el-option>
                <el-option :key="14" :value="14"></el-option>
                <el-option :key="15" :value="15"></el-option>
                <el-option :key="16" :value="16"></el-option>
                <el-option :key="17" :value="17"></el-option>
                <el-option :key="18" :value="18"></el-option>
              </el-select>
            </div>
          </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
             <el-form-item label="">
            <!-- <el-form-item label="">
              <el-checkbox v-model="reserveEnabled"></el-checkbox>
            </el-form-item> -->
            <div class="assist-row">
              <el-checkbox v-model="reserveEnabled"></el-checkbox>
              <span class="assist-label">加工预留量</span>
              <el-form-item label="R预留">
                <el-input-number v-model="queryKuParams.reserveR" :min="0" :step="0.001" :precision="3" :step-strictly="false" :controls="true" style="width: 130px" />
              </el-form-item>
              <el-form-item label="Z预留：">
                <el-input-number v-model="queryKuParams.reserveZ" :min="0" :step="0.001" :precision="3" style="width: 130px" />
              </el-form-item>
              <el-form-item label="油槽高度：">
                <el-input-number v-model="queryKuParams.oilTankHeight" :min="0" :step="1" :precision="1" style="width: 130px" />
              </el-form-item> 
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

    <!-- 打开工件RFID  模态框  -->
    <el-dialog :title="workpieceModel.title" :visible.sync="workpieceModel.open" width="900px" :modal-append-to-body="false">
      <el-form ref="form" :model="workpieceModelParams"    :rules="rules" label-width="100px">
        <el-row :gutter="24">
          <el-col :span="8">
            <el-form-item label="工件RFID">
             <div > 204154566</div>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="工件生产单号">
             <div > GB204154566</div>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="EDM任务单号">
             <div > GB204154566</div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="加工面">
            <div class="face-selection">
              <div v-for="face in faceOptions" :key="face.value" class="face-item">
                <el-radio v-model="workpieceModelParams.processFace" :label="face.value">
                  {{ face.label }}
                </el-radio>
                <img :src="face.image" :alt="face.label" class="face-image" />
              </div>
            </div>
          </el-form-item>
          </el-col>
        </el-row>
        
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitWorkpieceForm">确 定</el-button>
        <el-button @click="workpieceModel.open = false">取 消</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { getUserProfile } from "../../../api/system/user";
import Sortable from "sortablejs";
import request from "@/utils/request";
import { getCamElectrodeBom, getCamSparkList } from "@/api/jy/electrodeMange";
import { getCmmSparkPointList } from "@/api/production/edmAutomation";
import {
  getBaseElectrodeByRfid,
} from "@/api/production/semiAutomation";
import { sendEdmDataToAuto} from "../../../api/production/eleprocess/poleprocess";
import { v4 as uuidv4 } from 'uuid'; // 或其他 UUID 生成方式

export default {
  name: "TaskWorkEdm",
  data() {
    return {
      // 遮罩层
      isSending: false,
      loading: true,
      validationRules: [
        { key: 'toolMagazineRfid', label: '刀库RFID' },
        { key: 'workpieceEleRfid', label: '工件电极RFID' },
        { key: 'currentProcess', label: '量测结果' },
        { key: 'suffix', label: '后缀' }
      ],     
      magazine: {
          // 是否显示弹出层
          open: false,
          // 弹出层标题
          title: "新增刀库",
          currentIndex: null, 
        },
      resultG132 : '',
      conditionSelect : '',
      //开始状态
      begin: false,
      //非单个禁用
      single: true,
      //非多个禁用
      multiple: false,
      //多选状态
      selectStatue: false,
      addButtonStatus: true,
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
      reserveR: 0.005,
      reserveZ: 0.005,
      oilTankHeight: 200,
      index: "",
      //多选后的自动化列表
      selectionList: [],
      camSparkList: [],
      camElectrodList: [],
      measureResultList: [],
      
      //接受弹框数据
      form: {},
      queryDaoParams: {},
      querySteelParams: {},
      openProgram: false,
      titleProgram: "",
      //设备列表
      deviceList: [],
      semiAutoList: [],
      middleList: [],
      queryParamsCam: {
        pageNo: 1,
        pageSize: 10,
      },
      knifeRfidList: [],
      selectedknifeLibraryList: [],// 选中的设备绑定的刀库列表
      autoAbj:{
        pid:1,
        workpieceEleRfid: null,
        toolMagazineRfid: null,
        toolMagazineNumber: null,
        moduleNo: null,
        pieceNo: null,
        suffix: null,
        sparkGap: null,
        xpitch: null,
        ypitch: null,
        zpitch: null,
        taskNo: null,
        num: null,
        sparkGap: null,
        currentProcess: null,
        machiningAllowanceR: null,
        machiningAllowanceZ: null,
        oilTankHeight: null,
        deviceNo: null,
        machineType: null,
        edmArea: null,
        xjump: null,
        yjump: null,
      },
      queryParamsCamSpark: {
        pageNo: 1,
        pageSize: 10,
      },
      queryParamsMeasureResult: {},
      measureResult: {
        // 是否显示弹出层
        open: false,
        // 弹出层标题
        title: "电极量测结果",
      },
      workpieceModel:{
        // 是否显示弹出层
        open: false,
        // 弹出层标题
        title: "选择工件信息",
        currentIndex: null, 
      },
      workpieceModelParams: {
        workpieceEleRfid: "",
      },
      //用户信息
      userName: "",
      personNo: "",
      deptName: "",
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      openPosition: false,
      //选中数组
      ids: [],
      receivedQuantity: "",
      id: "",
      //待选设备列表
      equipmentSelection: {},
      faceOptions: [
        { value: "front", label: "前面", image: "path/to/front.jpg" },
        { value: "back", label: "后面", image: "path/to/back.jpg" },
        { value: "left", label: "左面", image: "path/to/left.jpg" },
        { value: "right", label: "右面", image: "path/to/right.jpg" },
        { value: "top", label: "上面", image: "path/to/top.jpg" },
        { value: "bottom", label: "下面", image: "path/to/bottom.jpg" },
      ],
      //接收按钮禁止状态
      acceptDisabled: false,
      // 查询参数
      queryParams: {
        pageNo: 1,
        pageSize: 10,
      },
      queryKuParams: { 
        workA: 4 ,
        workM: 1 ,
        workR: 10 ,
        workU: 1 ,
        workW: 1 ,
        workE: 1 ,
        workI: 3 ,
        workJ: 1 ,
        workO: 10 ,
        workG: 1 ,
        reserveR: 0.005,
        reserveZ: 0.005,
        oilTankHeight: 200,
      },
      queryOriginalParams: { 
        workA: 4 ,
        workM: 1 ,
        workR: 10 ,
        workU: 1 ,
        workW: 1 ,
        workE: 1 ,
        workI: 3 ,
        workJ: 1 ,
        workO: 10 ,
        workG: 1 ,
      },
     
      //增加单数
      obj: {
        workpieceEleRfid: "",
      },
  
      //多选框全选
      checkAll: false,
      isIndeterminate: true,
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
  watch: {
    // 监听设备列表变化，更新查询参数
    
    /* reserveR(newVal) {
      this.semiAutoList.forEach((item) => {
        item.reserveR = newVal;
        if (item.id != null && item.id !== undefined) { item.reserveR = newVal; } }); },
    reserveZ(newVal) {
      this.semiAutoList.forEach((item) => {
        if (item.id != null && item.id !== undefined) { item.reserveZ = newVal; } });
    },
    oilTankHeight(newVal) {
      this.semiAutoList.forEach((item) => {
        if (item.id != null && item.id !== undefined) { item.oilTankHeight = newVal; } });
    }, */
  },
  created() {
    this.getListUser();
    this.getEquipment();

  },

  mounted() {
    // 等待组件渲染完成后初始化拖拽功能
    this.$nextTick(() => {
      // 根据实际 DOM 结构查找 tbody 元素（请根据实际情况调整选择器）
      const tableBody = this.$refs.editableList.$el.querySelector("tbody");
      if (tableBody) {
        Sortable.create(tableBody, {
          // 只有拖拽手柄生效
          handle: ".drag-handle",
          animation: 150,
          onEnd: (evt) => {
            // 拖拽结束后，更新 semiAutoList 的顺序
            // evt.oldIndex 和 evt.newIndex 为拖拽前后在 DOM 中的索引
            if (evt.oldIndex !== evt.newIndex) {
              if (
                evt.oldIndex < 0 ||
                evt.oldIndex >= this.semiAutoList.length ||
                evt.newIndex < 0 ||
                evt.newIndex >= this.semiAutoList.length
              ) {
                throw new Error("Index out of bounds");
              }
              // 克隆数组（可选，根据业务是否需要避免原数组直接修改）
              const newList = [...this.semiAutoList];
              // 从旧位置移除被拖拽的元素，返回数组中被删除的项数组（取第一个，即被拖拽的那一项）
              const movedItem = newList.splice(evt.oldIndex, 1)[0];
              // 将被拖拽的元素插入到新位置，splice 的第二个参数为0表示不删除其他项
              newList.splice(evt.newIndex, 0, movedItem);

              /* newList.forEach((row, index) => {
                   this.$set(row, 'index', index); // 使用 Vue.set 确保响应式
                }); */
              // 更新整个数组的 sort 字段，确保每个元素的排序号都正确
              newList.forEach((item, index) => {
                // 如果需要从1开始，可以使用 index+1；如果从0开始，则直接使用 index
                item.sort = index + 1;
              });
              // 将新顺序赋值回 semiAutoList
              this.semiAutoList = newList;
              // 强制刷新表格
              this.$nextTick(() => {
                this.$refs.editableList.doLayout();
              });
            }
          },
        });
      }
    });
    
    this.semiAutoList = [];
    /* this.loading = true;
    for (var i = 0; i < 8; i++) {

      var obj = {};
      obj.reserveR = null;
      obj.reserveZ = null;
      obj.oilTankHeight = null;
      obj.workpieceEleRfid = null;

      obj.toolMagazineRfid = null;
      obj.moduleNo = null;
      obj.pieceNo = null;
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
    this.loading = false; */

  },
  methods: {
    handleSpark() {},
    handleCmm() {},
    validateXjump(row, index) {
      // 手动触发表单验证
      const value = row.xjump;
      
      // 检查是否为空
      if (value === '' || value === null || value === undefined) {
        this.$message.error('X方向平移次数不能为空');
        this.$set(this.semiAutoList[index], 'xjump', '');
        return false;
      }
      
      // 使用正则表达式验证0-10的数字（包括整数和小数）
      if (!/^(10(\.0+)?|[0-9](\.\d+)?)$/.test(value)) {
        this.$message.error('X方向平移次数必须是0-10之间的数字');
        this.$set(this.semiAutoList[index], 'xjump', '');
        return false;
      }
      
      // 转换为数字验证范围
      const numValue = parseFloat(value);
      if (numValue < 0 || numValue > 10) {
        this.$message.error('X方向平移次数必须在0-10之间');
        this.$set(this.semiAutoList[index], 'xjump', '');
        return false;
      }
      
      return true;
    },
// Y方向验证触发
     validateYjump(row, index) {
       const value = row.yjump;
    
        // 检查是否为空
        if (value === '' || value === null || value === undefined) {
          this.$message.error('Y方向平移次数不能为空');
          this.$set(this.semiAutoList[index], 'yjump', '');
          return false;
        }
        
        // 使用正则表达式验证0-10的数字（包括整数和小数）
        if (!/^(10(\.0+)?|[0-9](\.\d+)?)$/.test(value)) {
          this.$message.error('Y方向平移次数必须是0-10之间的数字');
          this.$set(this.semiAutoList[index], 'yjump', '');
          return false;
        }
        
        // 转换为数字验证范围
        const numValue = parseFloat(value);
        if (numValue < 0 || numValue > 10) {
          this.$message.error('Y方向平移次数必须在0-10之间');
          this.$set(this.semiAutoList[index], 'yjump', '');
          return false;
        }
        this.$set(this.semiAutoList[index], 'yjump', value);
        return true;
  },
   validateNumber( row, index) {
      var value = row.edmArea;
      if (value === '' || value === null || value === undefined) {
        this.$message.error('放电模型能量面积不能为空');
        this.$set(this.semiAutoList[index], 'edmArea', '');
        return false;
      } 
      this.$set(this.semiAutoList[index], 'edmArea', value);
      return true;
    },

    // 选择工件电极rfid 模态框
    selectSteelWorkPieceRfid() {
      this.workpieceModel = {
        // 是否显示弹出层
        open: true,
        // 弹出层标题
        title: "选择工件RFID",
        currentIndex: null, 
      };
      this.$refs.steelWorkPieceRfid.open();
    },
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

      if (!Array.isArray(deviceList) || deviceList.length === 0) {
        this.semiAutoList = [];
        return;
      }
      
      this.loading = true;
       this.semiAutoList = [this.createEmptyRow(1)];
      this.loading = false;
    },

    /** 多选框禁选 */
    selected(row, index) {
      if (row.pid !== null && row.pid !== undefined && row.pid !== "") {
        return true; //可勾选
      } else {
        return false; //不可勾选
      }
    },

    beginNing() {},
    // 发送数据到后台
    async sendAutoData() {
      const selectionList = this.selectionList;
      if (!selectionList || selectionList.length === 0){this.$modal.msgError("请选择数据！"); return ;} 
      
      if (this.isSending) {
        // 已在发送中，直接返回（可选提示）
        this.$modal.msgSuccess("正在发送，请稍后...");
        return;
      }
      this.$modal.loading("正在发送数据，请稍候！");
      const checkResult = this.validateRequiredFields(this.semiAutoList);
    
      if (!checkResult.isValid) {
        // 显示错误提示
        this.$message.error(checkResult.message);
        return false;
      }
      
      // 构造你需要的 payload，这里示例直接发送选中项的浅拷贝  conditionSelect: r.conditionSelect , g132Select: r.g132Select ,
        const selectArray = this.semiAutoList.map(r => ({
          pid: r.pid,
          toolMagazineNumber: r.toolMagazineNumber,
          currentProcess: r.currentProcess,
          num: r.num,
          deviceNo: r.deviceNo,
          deviceId: r.deviceId,
          machineType: r.machineType,
          toolMagazineRfid: r.toolMagazineRfid,
          workpieceProdOrderNo: r.workpieceProdOrderNo,
          electrodeProdOrderNo: r.electrodeProdOrderNo,
          electrodeNo: r.electrodeNo,
          rfid: r.rfid,
          taskNo: r.taskNo,
          workpieceEleRfid: r.workpieceEleRfid,
          workpiece: r.workpiece,
          moduleNo: r.moduleNo,
          machiningAllowanceR: r.machiningAllowanceR,
          machiningAllowanceZ: r.machiningAllowanceZ,
          oilTankHeight: r.oilTankHeight,
          xjump: r.xjump, 
          yjump: r.yjump,
          edmArea: r.edmArea 
        }));
        
        selectArray.forEach((item,index,originalArray) => {
          this.$set(item, 'autocorrectionWorkpiece', this.steelEnabled ? true : false);
          this.$set(item, 'autocorrectionElectrode', this.eleEnabled ? true : false);
          this.$set(item, 'confirmRemainBeforeProcess', !!item.configTeeEnabled);
          this.$set(item, 'seqNo', index+1);
        });
        if (!this.checking()) return;
      
        console.log("选中的数据:", JSON.stringify(selectArray, null, 2));
        const idempotencyKey = uuidv4(); // 前端生成唯一请求 ID（可选，但推荐）
        this.isSending = true;
      // 防重复点击
        this.multiple = true;
        // 提交选中的数据到后台

        try {
          // 如果 sendEdmDataToAuto 支持传 config / headers

          /* const response = await sendEdmDataToAuto(selectArray, {
              headers: { 'Idempotency-Key': idempotencyKey }
          }); */

          const sendRequest = async () => {
              const response = await sendEdmDataToAuto(selectArray, {
                  headers: { 'Idempotency-Key': idempotencyKey }
              });
              return response;
          };

          sendRequest().then(response => {
            // 假设 response 是 { code: 200, data: 'SUCCESS', msg: '操作成功' }
            if(response.data === 'SUCCESS'){
                  this.$modal.msgSuccess("发送成功！");
                  // 添加时间戳确保路径不同，避免重复导航报错
                  const timestamp = new Date().getTime();
                  const redirectPath = `/redirect${this.$route.path}?t=${timestamp}`;
                  this.$router.replace(redirectPath).catch(err => {
                    if (err && err.name !== 'NavigationDuplicated') {
                      console.error(err);
                    }
                  });
            }else{
                alert(response.data)
                return ;
               
            }

          }).catch(error => {
              // 异常处理...
              this.$modal.msgError("发送失败，请重试！");
          });
     
          
        } catch (err) {
            this.$modal.msgError("发送失败，请重试！");
            
        } finally {
            // 在刷新前不解除锁，可调整逻辑
           
             setInterval(() => {
                this.$modal.closeLoading();
                this.isSending = false;
                this.multiple = false ;
            }, 1800)
        }
      
    },

    ending() {},

    doCheckingAddAtri() {
      this.conditionSelect = '';
      this.resultG132 = '';
      
      if (this.assistEnabled) {
        // 获取各项选择的值
        const A = this.queryKuParams.workA || "";
        const M = this.queryKuParams.workM || "";
        const R = this.queryKuParams.workR || "";
        const U = this.queryKuParams.workU || "";
        const W = this.queryKuParams.workW || "";
        const G = this.queryKuParams.workG || "";
            
        // 判断是否有未选择的项
        if (
          A === null || A === "" ||  A === undefined ||
          M === null || M === "" ||  M === undefined ||
          R === null || R === "" ||  R === undefined ||
          U === null || U === "" ||  U === undefined ||
          W === null || W === "" ||  W === undefined ||
          G === null || G === "" ||  G === undefined
        ) {
          this.$modal.msgError("你已经勾选 G132辅助选择 ，请选择值 ！");
          return;
        }
        this.resultG132 = `G132D60Q${G}A${A}M${M}R${R}U${U}W${W}`;
      }else{
        this.resultG132 = '';
      }

      if (this.conditionEnabled) {
        // 获取各项选择的值
        const E = this.queryKuParams.workE || "";
        const I = this.queryKuParams.workI || "";
        const J = this.queryKuParams.workJ || "";
        const O = this.queryKuParams.workO || "";
        // 判断是否有未选择的项
        if (
          E === null || E === "" || E === undefined ||
          I === null || I === "" || I === undefined ||
          J === null || J === "" || J === undefined ||
          O === null || O === "" || O === undefined
        ) {
          this.$modal.msgError("你已经勾选 加工条件选择选择 ，请选择值 ！");
          return;
        }
        this.conditionSelect = `E${E}I${I}J${J}O${O}`;
      }else{
        this.conditionSelect = '';
      }
      //  加工预留量
      this.reserveR = this.queryKuParams.reserveR || 0;
      this.reserveZ = this.queryKuParams.reserveZ || 0;
      this.oilTankHeight = this.queryKuParams.oilTankHeight || 0;

      return true;
    },

    /** 数据校验 */
     /** 数据校验 */
    checking() {
     
      if (this.selectedDevice === null) {
        this.$modal.msgError("请选择设备 ！");
        return;
      }
       // 2. 遍历 data 中的每一行数据
      for (let i = 0; i < this.semiAutoList.length; i++) {
        const item = this.semiAutoList[i];
        const rowNumber = i + 1; // 给用户看的行号，从 1 开始

        if(item.workpieceEleRfid == ''||item.workpieceEleRfid ==null||item.workpieceEleRfid == undefined){
          this.$modal.msgError(`请扫码工件RFID`);
          return ;
        }
        if(item.toolMagazineRfid == ''||item.toolMagazineRfid ==null||item.toolMagazineRfid == undefined){
          this.$modal.msgError(`请扫码刀库RFID`);
          return ;
        }
        // 3. 遍历该行的每一个需要验证的字段
        for (const rule of this.validationRules) {
          const value = item[rule.key];

          // 4. 执行验证：检查是否为 null, undefined, 空字符串, 或仅包含空格的字符串
          // (value == null) 可以同时判断 null 和 undefined
          if (value == null || String(value).trim() === '') {
            // 如果验证失败，弹出具体的错误提示
            // this.$modal.msgError 是您自己的封装，如果没有，可以用 Element UI 的 this.$message.error
            this.$modal.msgError(`第 ${rowNumber} 行的 "${rule.label}" 不能为空，请输入正确的值。`);
            // 中断验证并返回 false
            return false; 
          }
        }
      }
      setTimeout(()=>{

        this.$modal.msgSuccess("数据完整性验证通过！");
      },1000)
      
      // 1. 访问 ref 数组
      return true;
    },

    handleWatchCustomer(row) {
      if (row.electrodeProdOrderNo === "" || row.electrodeProdOrderNo == null) {
        this.$modal.msgError("请扫描RFID");
        return;
      }
      this.openProgram = true;
      this.titleProgram = "电极程式参数";
      this.getListCamElectrod(row);
      this.getListCamSpark(row);
    },
    getListCamElectrod(row) {
      this.camSparkList = [];
      this.camElectrodList = [];
      this.queryParamsCam.electrodeProdOrderNo = row.electrodeProdOrderNo;

      getCamElectrodeBom({
        electrodeProdOrderNo: row.electrodeProdOrderNo,
      }).then((resp) => {
        this.camElectrodList = resp.data;
      });
    },
    getListCamSpark(row) {
      this.queryParamsCamSpark.prodOrderNo = row.electrodeProdOrderNo;
      getCamSparkList({ prodOrderNo: row.electrodeProdOrderNo }).then(
        (resp) => {
          this.camSparkList = resp.data;
        }
      );
    },

    watchCmmResult(row) {
      if (row.electrodeProdOrderNo === "" || row.electrodeProdOrderNo == null) {
        this.$modal.msgError("请扫描RFID");
        return;
      }
      this.queryParamsMeasureResult.workpieceProdOrderNo = row.workpieceProdOrderNo;
      this.queryParamsMeasureResult.electrodeProdOrderNo = row.electrodeProdOrderNo;
      this.queryParamsMeasureResult.electrodeNo = row.electrodeNo;
      this.queryParamsMeasureResult.RFID = row.workpieceEleRfid;
      this.queryParamsMeasureResult.sort = row.sort;
      this.measureResult.open = true;
      this.measureResult.title = "查看量测数据";
      this.getListMeasureResult();
    },
    getListMeasureResult() {
      getCmmSparkPointList(this.queryParamsMeasureResult).then((res) => {
        this.measureResultList = res;
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
        this.addButtonStatus = false ;
        // 获取 key、id、deviceNo
        const key = selectedItem.id;
        const id = selectedItem.id;
        const deviceNo = selectedItem.deviceNo;
        const machineType = this.deviceList[0].knifeLibraryList[0].machineType;
        // 你可以在这里使用 key、id、deviceNo
        console.log("选中设备:", { key, id, deviceNo });
        // 例如赋值到 data
        this.selectedDevice = { key, id, deviceNo,machineType };
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
    
    selectToolMagazineRfid(row,index){/** 输入刀库列表事件 */
      const rfidValue = row.toolMagazineRfid.trim();
      // 空输入直接清空并返回
      if (!rfidValue) {
        this.$set(this.semiAutoList[index], 'toolMagazineRfid', '');
        this.$set(this.semiAutoList[index], 'toolMagazineNumber', '');
        return;
      }

      /* if (this.knifeRfidList.some(item => item.toolMagazineRfid === rfidValue)) {
        this.$modal.msgError("不需要重复输入相同的刀库RFID");
        // 清空當前無效的輸入
        this.$set(this.semiAutoList[index], 'toolMagazineRfid', '');
        return;
      } */

      // 1.重复校验：只有当相同 RFID 在不同行存在时才算重复 ;this.knifeRfidList 是您用來臨時存儲本次輸入的RFID列表
      const duplicateInOtherRow = this.knifeRfidList.some(item =>
        item.toolMagazineRfid === rfidValue && item.index !== index
      );
      if (duplicateInOtherRow) {
        this.$modal.msgError("不需要重复输入相同的刀库RFID");
        this.$set(this.semiAutoList[index], 'toolMagazineRfid', '');
        return;
      }

      // 查找toolMagazineRfid等于7的对象
      const foundItem = this.selectedknifeLibraryList.find(
        item => item && item.toolMagazineRfid == row.toolMagazineRfid 
      );

       // 如果该行之前已经有记录（在 knifeRfidList 中），并且与本次输入不同，则移除旧记录
      const prevEntryIndex = this.knifeRfidList.findIndex(item => item.index === index);
      if (prevEntryIndex !== -1) {
        const prevRfid = this.knifeRfidList[prevEntryIndex].toolMagazineRfid;
        if (prevRfid !== foundItem.toolMagazineRfid) {
          // 从 knifeRfidList 中移除旧项
          this.knifeRfidList.splice(prevEntryIndex, 1);

          // 清理 semiAutoList 中除当前行之外仍引用该旧 RFID 的行（避免残留）
          this.semiAutoList.forEach((r, i) => {
            if (i !== index && r && r.toolMagazineRfid === prevRfid) {
              this.$set(this.semiAutoList[i], 'toolMagazineRfid', '');
              this.$set(this.semiAutoList[i], 'toolMagazineNumber', '');
            }
          });
        } else {
          // 如果旧值和本次相同，仅确保编号同步并返回（不重复插入 knifeRfidList）
          this.$set(this.semiAutoList[index], 'toolMagazineNumber', foundItem.toolMagazineNumber);
          this.$set(this.semiAutoList[index], 'toolMagazineRfid', foundItem.toolMagazineRfid);
          return;
        }
      }

      // 使用示例
      if (foundItem) {
        // 找到了匹配项，使用 this.$set 更新 semiAutoList 中的数据以确保响应式更新
        console.log('找到匹配的刀库对象:', foundItem);

        // 更新刀库编号
        this.$set(this.semiAutoList[index], 'toolMagazineNumber', foundItem.toolMagazineNumber);
        // 更新刀库RFID (使用找到的值，可以校正用户输入的大小写或前后空格)
        this.$set(this.semiAutoList[index], 'toolMagazineRfid', foundItem.toolMagazineRfid);

        // 将有效的RFID添加到临时列表中，用于后续的重复校验
        this.knifeRfidList.push({
          index: index,
          toolMagazineRfid: foundItem.toolMagazineRfid
        });

        this.tryAutoAppendRow(index);
      } else {
        // 未找到匹配項
        this.$modal.msgError("您输入的刀库RFID无效，请检查！");
        // 清空当前无效的输入
        this.$set(this.semiAutoList[index], 'toolMagazineRfid', '');
      }
    },
    /** 多选框禁选 */
    selected(row, index) {
      return true;
    },
    onWorkpieceEnter(row,index){this.selectProduction(row,index)},
    onToolEnter(row,index){this.selectToolMagazineRfid(row,index)},
    /** 根据RFID获取工件/电极信息 */
    selectProduction(row) {
      if(!row.workpieceEleRfid || row.workpieceEleRfid.length !== 10 ){
        this.$modal.msgError("请扫描或输入正确的工件电极RFID");
        return;

      }
      this.index = row.index;
      let flag = true;
      for (let i = 0; i < this.semiAutoList.length; i++) {
        if (row.index !== i) {
          if (row.workpieceEleRfid === this.semiAutoList[i].workpieceEleRfid) {
            this.$modal.msgError("请勿重复添加相同数据，请检查后重新添加");
            this.repeat = true;
            flag = false;
            break;
          } else {
            flag = true;
          }
        }
      }
      if (flag) {
        this.repeat = false;
        this.getProductionList(row.workpieceEleRfid);
        //this.addNewAtribute(row,row.index,'1');

        if(this.reserveEnabled){
            this.$set(this.semiAutoList[row.index], 'machiningAllowanceR', this.reserveR);
            this.$set(this.semiAutoList[row.index], 'machiningAllowanceZ', this.reserveZ);
            this.$set(this.semiAutoList[row.index], 'oilTankHeight', this.oilTankHeight);
        }
        this.tryAutoAppendRow(row.index);
      }
      //  这里发送时要加个状态，如果重复了状态为否，不能发送
    },
    submitWorkpieceForm() {
      this.workpieceModel.open = false;
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
    //  打开模态框
    addNewAtribute(row,index,type){
      this.magazine.open = true;
      this.magazine.title = "新增属性";
      this.magazine.currentIndex = index;
     
      if (type === '2') {
          //this.queryKuParams = {};
          // 先把现有 row 中的 conditionSelect/g132Select 取出来
          const g132 = (row.g132Select || '').toString().trim();
          const cond = (row.conditionSelect || '').toString().trim();
          const reserveR = (row.machiningAllowanceR || '').toString().trim();
          const reserveZ = (row.machiningAllowanceZ || '').toString().trim();
          const oilTankHeight = (row.oilTankHeight || '').toString().trim();

          // 解析
          const parsedG = this._parseG132(g132);            // { workG, workA, workM, workR, workU, workW }
          const parsedCond = this._parseConditionSelect(cond); // { workE, workI, workJ, workO }
           // 合并两部分
          const parsed = Object.assign({}, parsedG, parsedCond,reserveR,reserveZ,oilTankHeight);

          // 把解析数据写回 queryKuParams（使用 $set 保证响应式）
          Object.keys(parsed).forEach(key => {
            // 仅写入允许的字段，避免注入未知字段
            if (this.queryKuParams.hasOwnProperty(key)) {
              this.$set(this.queryKuParams, key, parsed[key] === undefined || parsed[key] === null ? '' : parsed[key]);
            } else {
              // 如果你确实希望新增字段也响应式，可放开这一行
              // this.$set(this.queryKuParams, key, parsed[key]);
            }
          });

      // 如果 row 里有其它直接字段也写入（可选）
      // e.g. this.$set(this.queryKuParams, 'someField', row.someField);

          // 等 DOM 更新，清除验证并 normalize select 值类型
        this.$nextTick(() => {
          if (this.$refs.form) this.$refs.form.clearValidate();
          // keys 需和你的 select v-model 字段一致
          this._normalizeSelectValues(['workG','workR','workU','workW','workA','workM']);
        });
      }
    },
    // 把 model 的值校正为 options 中的实际 value（处理 '1' 与 1 的差异）
    _normalizeSelectValues(keys) {
      keys.forEach(key => {
        const val = this.queryOriginalParams[key];
        const opts = this[`${key}Options`] || [];
        if (val === null || val === undefined || val === '') return;

        // 尝试找到与之匹配的 option（宽松等于，允许 '1' == 1）
        const match = opts.find(o => o.value == val);
        if (match) {
          // 强制使用 option 的 value（保证类型一致）
          this.$set(this.queryKuParams, key, match.value);
        } else {
          // 如果没有匹配项，考虑清空或保留原值；这里暂且保留并可做日志提示
          // this.$set(this.queryKuParams, key, '');
        }
      });
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
      // 在您的请求或方法中

      getBaseElectrodeByRfid({ keyWords: workpieceEleRfid }).then(
        (response) => {
          this.$modal.closeLoading();
          if(response == undefined){
            this.magazine.open = false;
             this.$modal.msgError("该RFID工件没有数据 ，请核实！");
             return 
          }
          if(response.data!=null&&response.data!=undefined||response.data!=''){
             this.middleList = response.data;
             this.semiAutoList.splice(
                this.index,
                1,
                Object.assign(this.semiAutoList[this.index], this.middleList)
             );
          }else{
            this.$modal.msgError("该RFID工件没有 EDM 任务，是否属于变更废弃请核实！");
          }
        }
      );
    },

    /** 查询登录用户信息*/
    getListUser() {
      getUserProfile().then((response) => {
        this.userName = response.data.nickName;
        this.personNo = response.data.userName;
        this.deptName = response.data.dept.name;
      });
    },

    /** 搜索按钮操作 */
    handleQuery() {},

    //双击选中一行
    lineClick(val) {
      for (let i = 0; i < this.semiAutoList.length; i++) {
        if (this.semiAutoList[i].workpieceEleRfid === val.rfid) {
          this.$modal.msgError("请勿重复添加相同数据，请检查后重新添加");
          break;
        } else {
          if (this.semiAutoList[i].workpieceEleRfid == undefined) {
            getBaseElectrodeByRfid({ keyWords: val.rfid }).then((response) => {
              this.middleList = response.data;
              this.semiAutoList.splice(
                i,
                1,
                Object.assign(this.semiAutoList[i], this.middleList)
              );
            });
            // this.semiAutoList[i].workpieceEleRfid = val.rfid
            this.semiAutoList[i].electrodePositionNumber =
              val.electrodePositionNumber;
            break;
          }
        }
      }
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
      this.selectionList = selection.slice();

    },
    // 点击行时自动勾选当前行
    handleRowClick(row) {
      this.$refs.editableList.clearSelection();
      this.$refs.editableList.toggleRowSelection(row, true);
    },
  
    /** 表格数据增加index */
    tableRowClassName({ row, rowIndex }) {
      //把每一行的索引放进row
      row.index = rowIndex;
    },

  validateRequiredFields(list, customFields = null) {
    // 默认检查的字段
    const defaultFields = [
      'toolMagazineNumber',
      'deviceNo', 
      'machineType',
      'toolMagazineRfid',
      'workpieceProdOrderNo',
      'electrodeProdOrderNo',
      'electrodeNo',
      'moduleNo',
      'pieceNo'
    ];
    
    // 使用自定义字段或默认字段
    const fieldsToCheck = customFields || defaultFields;
    
    // 如果列表为空
    if (!list || list.length === 0) {
      return {
        isValid: false,
        message: '数据列表为空，请先选择数据'
      };
    }
    
    // 遍历列表检查每个对象
    for (let i = 0; i < list.length; i++) {
      const item = list[i];
      const index = i + 1; // 用户看到的行号从1开始
      
      // 检查每个必填字段
      for (const field of fieldsToCheck) {
        const value = item[field];
        
        // 检查是否为null、undefined或空字符串
        if (value === null || value === undefined || value === '') {
          return {
            isValid: false,
            message: `第 ${index} 行的 ${this.getFieldDisplayName(field)} 不能为空`
          };
        }
        
        // 如果是字符串，检查是否只包含空白字符
        if (typeof value === 'string' && value.trim() === '') {
          return {
            isValid: false,
            message: `第 ${index} 行的 ${this.getFieldDisplayName(field)} 不能为空`
          };
        }
      }
     }

     // 所有检查通过
    return {
      isValid: true,
      message: '所有必填字段检查通过'
    };
   },
    /**
   * 获取字段的显示名称（用于友好的错误提示）
   * @param {string} field - 字段名
   * @returns {string} 显示名称
   */
  getFieldDisplayName(field) {
    const fieldNames = {
      toolMagazineNumber: '刀库编号',
      deviceNo: '设备编号',
      machineType: '设备类型',
      toolMagazineRfid: '刀库RFID',
      workpieceProdOrderNo: '钢件生产单号',
      electrodeProdOrderNo: '电极生产单号',
      electrodeNo: '电极编号',
      moduleNo: '模号',
      pieceNo: '件号'
    };
  },
   createEmptyRow(pid) {
      return {
        ...JSON.parse(JSON.stringify(this.autoAbj)),
        pid,
        deviceNo: this.selectedDevice ? this.selectedDevice.deviceNo : null,
        machineType: this.selectedDevice ? this.selectedDevice.machineType : null,
      };
    },
    focusToolInput(index) {
      this.$nextTick(() => {
        const refs = this.$refs.input0;
        if (Array.isArray(refs) && refs[index]) {
          refs[index].focus();
          return;
        }
        if (refs && refs.focus) {
          refs.focus();
        }
      });
    },
    tryAutoAppendRow(index) {
      const row = this.semiAutoList[index];
      if (!row || !row.toolMagazineRfid || !row.workpieceEleRfid) {
        return;
      }
      if (index !== this.semiAutoList.length - 1) {
        return;
      }
      if (this.semiAutoList.length >= this.selectedknifeLibraryList.length) {
        return;
      }
      const nextIndex = this.semiAutoList.length;
      this.semiAutoList.push(this.createEmptyRow(nextIndex + 1));
      this.focusToolInput(nextIndex);
    },
    /** 增加数据行 */
    addSemiAutoData() {
      if(this.selectedDevice ===undefined ||this.selectedDevice ===null ){
              this.$modal.msgError("请选择设备！");
              return;
      }
      if (this.semiAutoList.length >= this.selectedknifeLibraryList.length) {
        this.$modal.msgError("新增行数不能超过刀库数量！");
        return;
      }
      this.autoAbj.deviceNo = this.selectedDevice.deviceNo;
      this.autoAbj.machineType = this.selectedDevice.machineType;
      this.autoAbj.pid = this.semiAutoList.length+1;
      this.semiAutoList.push(JSON.parse(JSON.stringify(this.autoAbj))); 

    },

    /** 删除数据行 */
    handleDeleteData(row, index) {
      const pid = row.pid;
      // 从数据源删除
      const idx = this.semiAutoList.findIndex(r => r.pid === pid);
      if (idx !== -1) this.semiAutoList.splice(idx, 1);

      // 从 selectionList 删除（防止残留）
      this.selectionList = this.selectionList.filter(r => r.pid !== pid);

      // 同步 el-table 内部 selection：先清空再重新选中剩余的 selectionList 项
      this.$nextTick(() => {
        if (this.$refs.editableList && this.$refs.editableList.clearSelection) {
          this.$refs.editableList.clearSelection();
          this.selectionList.forEach(r => {
            // toggleRowSelection 会把对应行标记为选中（如果行还存在）
            if (this.semiAutoList.find(item => item.pid === r.pid)) {
              this.$refs.editableList.toggleRowSelection(r, true);
            }
          });

        }

        // pID 重新排 
         if (this.semiAutoList.length > 0){
              for(var i=0;i<this.semiAutoList.length;i++){
                  this.$set(this.semiAutoList[i], 'pid', i);
              }
          }
        // 如果表空了，设置 begin 标志（和你原逻辑保持一致）
        
        if (this.semiAutoList.length === 0) {
          this.begin = true;
        }
      });
    },

    /* 解析字段  */

     // 解析 g132 字符串，返回字段对象（尽量容错）
    // 预期格式: G132D60Q${G}A${A}M${M}R${R}U${U}W${W}
    _parseG132(str) {
      if (!str) return {};
      // 参考正则：注意用 * 以允许某些字段为空；[^A-Z] 作为分隔符防止吞掉字母部分
      const re = /^G132D60Q([^A]*)A([^M]*)M([^R]*)R([^U]*)U([^W]*)W(.*)$/;
      const m = str.match(re);
      if (m) {
        return {
          workG: (m[1] || '').trim(),
          workA: (m[2] || '').trim(),
          workM: (m[3] || '').trim(),
          workR: (m[4] || '').trim(),
          workU: (m[5] || '').trim(),
          workW: (m[6] || '').trim()
        };
      }

      // 如果没有完全匹配，再用更宽松的按前缀抓取（逐项）
      const keys = ['G','A','M','R','U','W'];
      const out = {};
      keys.forEach(k => {
        const reg = new RegExp(k + '([^GAMRUW]*)'); // 宽松：抓到下一个大写字母前的内容
        const mm = str.match(new RegExp(k + '([^GAMRUW]*)'));
        // 但上面可能不稳定，改用通用方法：寻找 k 后到下一个字母标志之前
      });

      // 最后兜底：尝试按字母边界分割
      // 找到所有字母开头的段落 e.g. ['G132D60Q1','A4','M1',...]
      const parts = str.split(/(?=[A-Z])/);
      const map = {};
      parts.forEach(p => {
        const key = p[0];
        const val = p.slice(1).replace(/^132D60Q/, '').trim(); // 去掉前缀 G132D60Q
        if (key === 'G') map.workG = val;
        if (key === 'A') map.workA = val;
        if (key === 'M') map.workM = val;
        if (key === 'R') map.workR = val;
        if (key === 'U') map.workU = val;
        if (key === 'W') map.workW = val;
      });
      return map;
    },

     // 解析 conditionSelect 字符串，返回 { workE, workI, workJ, workO }
    // 预期格式: E${E}I${I}J${J}O${O}
    _parseConditionSelect(str) {
      if (!str) return {};
      const re = /^E([^I]*)I([^J]*)J([^O]*)O(.*)$/;
      const m = str.match(re);
      if (m) {
        return {
          workE: (m[1] || '').trim(),
          workI: (m[2] || '').trim(),
          workJ: (m[3] || '').trim(),
          workO: (m[4] || '').trim()
        };
      }
      // 兜底：按大写字母边界分段
      const parts = str.split(/(?=[A-Z])/);
      const out = {};
      parts.forEach(p => {
        const key = p[0];
        const val = p.slice(1).trim();
        if (key === 'E') out.workE = val;
        if (key === 'I') out.workI = val;
        if (key === 'J') out.workJ = val;
        if (key === 'O') out.workO = val;
      });
      return out;
    },

    // 把 select 的 model 值规范为 options 中的真实 value（避免类型不一致）
    _normalizeSelectValues(keys) {
      keys.forEach(key => {
        const val = this.queryKuParams[key];
        if (val === null || val === undefined || val === '') return;

        // 约定：options 命名为 workGOptions、workROptions... 如果不同请修改
        const opts = this[`${key}Options`];
        if (!Array.isArray(opts)) return;

        // 允许宽松匹配（'1' == 1），但最终强制使用 options 中的 value
        const match = opts.find(o => o.value == val);
        if (match) {
          this.$set(this.queryKuParams, key, match.value);
        } else {
          // 没找到匹配 option，可以选择清空或保留（这里保留）
          // this.$set(this.queryKuParams, key, '');
        }
      });
    }

    /* 解析字段 end */

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

.face-selection {
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* 每行显示 3 个面 */
  gap: 20px; /* 每个面之间的间距 */
  justify-items: center; /* 水平居中 */
}

.face-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100px;
}

.face-image-container {
  position: relative;
}

.face-image {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-top: 8px;
  transition: transform 0.3s ease, box-shadow 0.3s ease; /* 添加动画效果 */
}

.face-image:hover {
  transform: scale(6.5); /* 鼠标悬停时放大 1.5 倍 */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* 添加阴影效果 */
  z-index: 10; /* 确保放大的图片在最上层 */
}


</style>