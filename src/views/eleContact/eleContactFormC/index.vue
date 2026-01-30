<template>
  <div>
    <el-card>
      <el-form :model="queryParamsSearch" ref="queryForm" :inline="true">
        <el-row>
          <el-form-item label="生产单号：" prop="prodOrderNo">
            <el-input
              v-model="queryParamsSearch.prodOrderNo"
              placeholder="请输入生产单号"
              clearable
              size="small"
              style="width: 220px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item>
            <el-button style="margin-left: 10px" type="primary" icon="el-icon-search" size="mini" @click="handleQuery"
            ></el-button>
          </el-form-item>
        </el-row>
      </el-form>
    </el-card>
    <el-card>
      <div align="center">
        <h1 style="font-weight: bold;font-size: 30px">RiD Tooling Centre</h1>
        <h2 style="font-weight: bolder;font-size: 20px">电极生产联络单</h2>
      </div>
      <div style="border:1px solid #000;width: 55%;margin-left: 25%">
        <el-row :gutter="24">
          <el-col :span="16">
            <el-row :gutter="24">
              <el-col :span="8" style="font-size: 15px"><span>客户代号：{{ customerCode }}</span></el-col>
              <el-col :span="8" style="font-size: 15px"><span>派工号：{{ dispatchOrderNo }}</span></el-col>
              <el-col :span="8"></el-col>
            </el-row>
            <el-row :gutter="24" style="margin-top: 10px">
              <el-col :span="8" style="font-size: 15px"><span>模号：{{ moduleNo }}</span></el-col>
              <el-col :span="8" style="font-size: 15px"><span>版本：{{ versionNo }}</span></el-col>
            </el-row>
          </el-col>
          <el-col :span="6">
            <div style="margin-top: 5px;" align="center">
              <barcode v-bind:value="prodOrderNo" style="margin-left: 10px" font-size="20px" height="26mm" width="2mm"
                       text-align="center"
              >
              </barcode>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="24" style="margin-top: 8px">
          <el-col :span="6" style="font-size: 15px"><span>工件号：{{ pieceNo }}</span></el-col>
          <el-col :span="6" style="font-size: 15px"><span>名称：{{ name }}</span></el-col>
          <el-col :span="6" style="font-size: 15px"><span>数量：{{ quantity }}</span></el-col>
          <el-col :span="6" style="font-size: 15px"><span>尺寸：{{ length }}*{{ width }}*{{ height }}</span></el-col>
        </el-row>
        <el-row :gutter="24" style="margin-top: 10px">
          <el-col :span="6" style="font-size: 15px"><span>材质：{{ material }}</span></el-col>
          <el-col :span="6" style="font-size: 15px"><span>开单日期：{{ orderDate }}</span></el-col>
          <el-col :span="6" style="font-size: 15px"><span>交期：{{ demandDate }}</span></el-col>
          <el-col :span="6" style="font-size: 15px"><span>交期等级：{{ deliveryLevel }}</span></el-col>
        </el-row>
        <el-row :gutter="24" style="margin-top: 10px">
          <el-col :span="6" style="font-size: 15px"><span>责任人：{{ investor }}</span></el-col>
          <el-col :span="6" style="font-size: 15px"><span>订单类型：{{ processingContent }}</span></el-col>
          <el-col :span="6" style="font-size: 15px"><span>客户订单号：{{ customerOrderNo }}</span></el-col>
          <el-col :span="6"></el-col>
        </el-row>
        <el-row :gutter="24" style="margin-top: 10px">
          <el-col :span="24" style="font-size: 15px"><span>历史生产单号：{{ hisProdOrderNo }}</span></el-col>
        </el-row>
      </div>
      <div style="margin-top: 10px" align="center">
        <el-table v-loading="loading" :data="filesList" style="width: 80%" max-height="420px">
          <el-table-column type="index" label="序号" width="50"/>
          <el-table-column label="工段" align="center" key="code" prop="code"/>
          <el-table-column label="估工" align="center" key="workHour" prop="workHour"/>
          <el-table-column label="加工数量" align="center" key="quantity" prop="quantity"/>
          <el-table-column label="客户图档" align="center">
            <template slot-scope="scope">
              <el-button
                type="primary"
                circle
                @click="handleWatchCustomer(scope.row)"
              >查看
              </el-button>
            </template>
          </el-table-column>
          <el-table-column label="设计图档" align="center">
            <template slot-scope="scope">
              <el-button
                type="primary"
                circle
                @click="handleWatchDesign(scope.row)"
              >查看
              </el-button>
            </template>
          </el-table-column>
          <el-table-column label="程式参数" align="center">
            <template slot-scope="scope">
              <el-button
                type="primary"
                circle
                @click="handleOpenProgram(scope.row)"
                v-if="scope.row.code === 'CNC' || scope.row.code === 'EDM' || scope.row.code === 'WE' || scope.row.code === 'EP'"
              >查看
              </el-button>
            </template>
          </el-table-column>
          <el-table-column label="程式下载" align="center">
            <template slot-scope="scope">
              <el-button
                type="primary"
                circle
                @click="handleDownloadProgram(scope.row)"
              >查看
              </el-button>
            </template>
          </el-table-column>
          <el-table-column label="辅助量测" align="center">
            <template slot-scope="scope">
              <el-button
                type="primary"
                circle
                @click="handleViewFiles(scope.row)"
                :disabled="elecMultiple"
              >查看
              </el-button>
            </template>
          </el-table-column>
          <el-table-column label="加工备注" align="center" key="remark" prop="remark"/>
          <el-table-column label="操作" align="center" width="160" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-tooltip class="item" effect="dark" content="上传档案" placement="top-start">
                <el-button
                  type="primary"
                  circle
                  icon="el-icon-upload2"
                  @click="handleUpload(scope.row)"
                  :disabled="elecMultiple"
                ></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div style="margin-top: 10px" align="center">
        <el-row>
          <h2 style="font-weight: bold">各工段交接事宜</h2>
          <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAddThings">新增事宜</el-button>
        </el-row>
        <el-row style="margin-top: 10px">
          <el-table v-loading="loading" :data="exchangeList" style="width: 80%" max-height="320px">
            <el-table-column type="index" label="序号" width="50"/>
            <el-table-column label="交接人员" align="center" prop="name"/>
            <el-table-column label="交接时间" align="center" prop="handoverTime"/>
            <el-table-column label="查看工段" align="center" prop="codeList">
              <template slot-scope="scope">
                <el-tag v-for="item in scope.row.codeList" :key="item">{{ item }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="交接说明" align="center" prop="handoverInstructions"/>
            <!--            <el-table-column label="" align="center">-->
            <!--              <template slot-scope="scope">-->
            <!--                <el-button-->
            <!--                  type="primary"-->
            <!--                  circle-->
            <!--                  @click="handleUpdate(scope.row)"-->
            <!--                >修改</el-button>-->
            <!--              </template>-->
            <!--            </el-table-column>-->
          </el-table>
        </el-row>
      </div>
    </el-card>

    <!-- 客户图档对话框-->
    <el-dialog :title="files.title" :visible.sync="files.open" width="1200px">
      <el-row :gutter="24">
        <el-col :span="12">
          <span>工件图档</span>
          <el-table :data="filesData" border max-height="600px">
            <el-table-column property="pieceNo" label="件号">
              <template slot-scope="scope">
                <span>{{ pieceNo }}</span>
              </template>
            </el-table-column>
            <el-table-column property="name" label="图纸名称" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-tooltip class="item" effect="dark" content="查看客户图档" placement="top-start">
                  <el-button
                    type="primary"
                    circle
                    icon="el-icon-folder-opened"
                    @click="handleSeeDrawing(scope.row,1)"
                  ></el-button>
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>
          <pagination
            v-show="totalFile>0"
            :total="totalFile"
            :page.sync="queryParams.pageNo"
            :limit.sync="queryParams.pageSize"
            @pagination="getFile"
          />
        </el-col>
        <el-col :span="12">
          <span>公共图档</span>
          <el-table :data="publicFilesData" border max-height="600px">
            <el-table-column property="name" label="图纸名称" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-tooltip class="item" effect="dark" content="查看客户图档" placement="top-start">
                  <el-button
                    type="primary"
                    circle
                    icon="el-icon-folder-opened"
                    @click="handleSeeDrawing(scope.row,0)"
                  ></el-button>
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>
          <pagination
            v-show="totalPublicFile>0"
            :total="totalPublicFile"
            :page.sync="queryParams.pageNo"
            :limit.sync="queryParams.pageSize"
            @pagination="getPublicFile"
          />
        </el-col>
      </el-row>

    </el-dialog>
    <!-- 查看设计文档对话框 -->
    <el-dialog :title="title" :visible.sync="openDraw" width="800px" append-to-body>
      <el-button
        type="primary"
        icon="el-icon-folder-opened"
        style="margin-bottom: 20px"
        @click="luck"
      >文件类型</el-button>
      <el-button
        type="primary"
        @click="suffixPdf"
      >pdf</el-button>
      <el-button
        type="primary"
        @click="suffixPrt"
      >prt</el-button>
      <el-button
        type="primary"
        @click="suffixNc"
      >nc</el-button>
      <el-button
        type="primary"
        @click="suffixAll"
      >全部</el-button>
      <el-table :data="designList" v-loading="loading" border max-height="600px">
        <el-table-column label="文件类型" prop="camFileName" align="center"/>
        <el-table-column label="文件名" prop="fileName" align="center"/>
        <el-table-column label="控制器类型" prop="brand" align="center"/>
        <el-table-column label="上传人姓名" prop="createByName" align="center"/>
        <el-table-column label="工号" prop="createBy" align="center"/>
        <el-table-column label="上传时间" prop="createTime" align="center"/>
        <el-table-column label="操作" prop="createTime" align="center">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="查看设计图档" placement="top-start">
              <el-button
                type="primary"
                circle
                icon="el-icon-folder-opened"
                @click="handleSeeDrawing(scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="totalDesign>0"
        :total="totalDesign"
        :page.sync="queryParams.pageNo"
        :limit.sync="queryParams.pageSize"
        @pagination="getListDesignDoc"
      />
    </el-dialog>
    <!-- 交接事宜对话框 -->
    <el-dialog :title="handover.title" :visible.sync="handover.open" width="600px" append-to-body>
      <el-form ref="handoverForm" :model="handoverForm" label-width="100px" :rules="rules">
        <el-form-item label="交接人员" prop="name">
          <el-tag>{{ userName }}</el-tag>
        </el-form-item>
        <el-form-item label="工号" prop="jobNo">
          <el-tag>{{ personNo }}</el-tag>
        </el-form-item>
        <el-form-item label="工段" prop="code">
          <el-select v-model="handoverForm.stationIdList" multiple placeholder="请选择">
            <el-option
              v-for="item in codeOption"
              :key="item.code"
              :label="item.code"
              :value="item.stationId"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="交接说明" prop="handoverInstructions">
          <el-input v-model="handoverForm.handoverInstructions" style="width: 300px" type="textarea" placeholder=""/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="handover.open = false">取 消</el-button>
    <el-button type="primary" @click="submitForm">确 定</el-button>
  </span>
    </el-dialog>
    <!--程式参数对话框-->
    <el-dialog :title="titleProgram" :visible.sync="openProgram" width="1200px" append-to-body>
      <el-row :gutter="20">
        <el-col :span="10">
          <h2>程式单</h2>
          <el-form ref="formProgram" :model="formProgram" :rules="rules" label-width="180px">
            <el-form-item label="加工数量" prop="qty">
              <el-input v-model="formProgram.qty"></el-input>
            </el-form-item>
            <el-form-item label="装夹方式" prop="fixType">
              <el-input v-model="formProgram.fixType"></el-input>
            </el-form-item>
            <el-form-item label="程序单总时间" prop="totalTime">
              <el-input v-model="formProgram.totalTime"></el-input>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="14">
          <h2>分条程序列表</h2>
          <el-table :data="ProgramData" border>
            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  circle
                  icon="el-icon-edit-outline"
                  @click="handleViewDetail(scope.row)"
                >详细
                </el-button>
              </template>
            </el-table-column>
            <el-table-column label="程序序号" align="center" prop="programSeq"></el-table-column>
            <el-table-column label="程序名" align="center" prop="programName"></el-table-column>
            <el-table-column label="程序刀具名" align="center" prop="toolName"></el-table-column>
            <el-table-column label="程序刀号" align="center" prop="toolNumber"></el-table-column>
            <el-table-column label="程序刀长" align="center" prop="toolLength"></el-table-column>
          </el-table>
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button @click="openProgram = false" type="danger">取 消</el-button>
      </div>
    </el-dialog>
    <!--钢件分条程式单详细对话框-->
    <el-dialog :title="titleProgramDetail" :visible.sync="openProgramDetail" width="1000px" append-to-body>
      <el-form ref="formProgram" :model="formProgramDetail" :rules="rules" label-width="180px">
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="程序名" prop="programName">
              <el-input v-model="formProgramDetail.programName"></el-input>
            </el-form-item>
            <el-form-item label="程序刀具名" prop="toolName">
              <el-input v-model="formProgramDetail.toolName"></el-input>
            </el-form-item>
            <el-form-item label="程序刀号" prop="toolNumber">
              <el-input v-model="formProgramDetail.toolNumber"></el-input>
            </el-form-item>
            <el-form-item label="程序刀长" prop="toolLength">
              <el-input v-model="formProgramDetail.toolLength"></el-input>
            </el-form-item>
            <el-form-item label="程序避空刀长" prop="shortestToolLength">
              <el-input v-model="formProgramDetail.shortestToolLength"></el-input>
            </el-form-item>
            <el-form-item label="程序最短刀长" prop="calcToolLength">
              <el-input v-model="formProgramDetail.calcToolLength"></el-input>
            </el-form-item>
            <el-form-item label="程序侧余量" prop="partStock">
              <el-input v-model="formProgramDetail.partStock"></el-input>
            </el-form-item>
            <el-form-item label="程序底余量" prop="floorStock">
              <el-input v-model="formProgramDetail.floorStock"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="程序粗精度分类" prop="roughness">
              <el-input v-model="formProgramDetail.roughness"></el-input>
            </el-form-item>
            <el-form-item label="程序主轴转速" prop="spindleSpeed">
              <el-input v-model="formProgramDetail.spindleSpeed"></el-input>
            </el-form-item>
            <el-form-item label="程序切削进给" prop="cutFeedrate">
              <el-input v-model="formProgramDetail.cutFeedrate"></el-input>
            </el-form-item>
            <el-form-item label="程序步距" prop="stepOver">
              <el-input v-model="formProgramDetail.stepOver"></el-input>
            </el-form-item>
            <el-form-item label="程序加工时间" prop="time">
              <el-input v-model="formProgramDetail.time"></el-input>
            </el-form-item>
            <el-form-item label="程序切削刀轨长度" prop="cutPathLength">
              <el-input v-model="formProgramDetail.cutPathLength"></el-input>
            </el-form-item>
            <el-form-item label="程序Z最深" prop="zdepth">
              <el-input v-model="formProgramDetail.zdepth"></el-input>
            </el-form-item>
            <el-form-item label="程序夹持器" prop="holderName">
              <el-input v-model="formProgramDetail.holderName"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="程序备注说明" prop="remark">
          <el-input v-model="formProgramDetail.remark" type="textarea"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="openProgramDetail = false" type="danger">取 消</el-button>
      </div>
    </el-dialog>
    <!--电极分条程式单详细对话框-->
    <el-dialog :title="eleProgramDetail.title" :visible.sync="eleProgramDetail.open" width="1000px" append-to-body>
      <el-form ref="formProgram" :model="eleFormProgramDetail" :rules="rules" label-width="180px">
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="程序名" prop="programName">
              <el-input v-model="eleFormProgramDetail.programName"></el-input>
            </el-form-item>
            <el-form-item label="程序刀具名" prop="toolName">
              <el-input v-model="eleFormProgramDetail.toolName"></el-input>
            </el-form-item>
            <el-form-item label="程序刀号" prop="toolNumber">
              <el-input v-model="eleFormProgramDetail.toolNumber"></el-input>
            </el-form-item>
            <el-form-item label="程序刀长" prop="toolLength">
              <el-input v-model="eleFormProgramDetail.toolLength"></el-input>
            </el-form-item>
            <el-form-item label="程序避空刀长" prop="shortestToolLength">
              <el-input v-model="eleFormProgramDetail.shortestToolLength"></el-input>
            </el-form-item>
            <el-form-item label="程序最短刀长" prop="calcToolLength">
              <el-input v-model="eleFormProgramDetail.calcToolLength"></el-input>
            </el-form-item>
            <el-form-item label="程序侧余量" prop="partStock">
              <el-input v-model="eleFormProgramDetail.partStock"></el-input>
            </el-form-item>
            <el-form-item label="程序底余量" prop="floorStock">
              <el-input v-model="eleFormProgramDetail.floorStock"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="程序粗精度分类" prop="roughness">
              <el-input v-model="eleFormProgramDetail.roughness"></el-input>
            </el-form-item>
            <el-form-item label="程序主轴转速" prop="spindleSpeed">
              <el-input v-model="eleFormProgramDetail.spindleSpeed"></el-input>
            </el-form-item>
            <el-form-item label="程序切削进给" prop="cutFeedrate">
              <el-input v-model="eleFormProgramDetail.cutFeedrate"></el-input>
            </el-form-item>
            <el-form-item label="程序步距" prop="stepOver">
              <el-input v-model="eleFormProgramDetail.stepOver"></el-input>
            </el-form-item>
            <el-form-item label="程序加工时间" prop="time">
              <el-input v-model="eleFormProgramDetail.time"></el-input>
            </el-form-item>
            <el-form-item label="程序切削刀轨长度" prop="cutPathLength">
              <el-input v-model="eleFormProgramDetail.cutPathLength"></el-input>
            </el-form-item>
            <el-form-item label="程序Z最深" prop="zdepth">
              <el-input v-model="eleFormProgramDetail.zdepth"></el-input>
            </el-form-item>
            <el-form-item label="程序夹持器" prop="holderName">
              <el-input v-model="eleFormProgramDetail.holderName"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="程序备注说明" prop="remark">
          <el-input v-model="eleFormProgramDetail.remark" type="textarea"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="eleProgramDetail.open = false" type="danger">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 加工程式下载对话框-->
    <el-dialog :title="programDownload.title" :visible.sync="programDownload.open" width="1200px">
      <el-row :gutter="24">
        <el-col :span="12">
          <span>NC总文件</span>
          <el-table :data="downloadDataTotal" border max-height="600px">
            <el-table-column property="fileName" label="名称" :show-overflow-tooltip="true"  width="260px" align="center"/>
            <el-table-column property="brand" label="机型" :show-overflow-tooltip="true" width="160px" align="center"/>
            <el-table-column label="操作" width="110px" align="center">
              <template slot-scope="scope">
                <el-tooltip class="item" effect="dark" content="查看客户图档" placement="top-start">
                  <el-button
                    type="primary"
                    circle
                    icon="el-icon-download"
                    @click="handleDownload(scope.row)"
                  ></el-button>
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>
          <pagination
            v-show="totalDownloadData>0"
            :total="totalDownloadData"
            :page.sync="queryParamsDownloadTotal.pageNo"
            :limit.sync="queryParamsDownloadTotal.pageSize"
            @pagination="getListProgramDowndloadTotal"
          />
        </el-col>
        <el-col :span="12">
          <span>单条NC文件</span>
          <el-table :data="downloadData" border max-height="600px">
            <el-table-column property="fileName" label="图纸名称" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column property="brand" label="控制器类型" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-tooltip class="item" effect="dark" content="查看客户图档" placement="top-start">
                  <el-button
                    type="primary"
                    circle
                    icon="el-icon-download"
                    @click="handleDownload(scope.row)"
                  ></el-button>
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>
          <pagination
            v-show="totalDownload>0"
            :total="totalDownload"
            :page.sync="queryParamsDownload.pageNo"
            :limit.sync="queryParamsDownload.pageSize"
            @pagination="getListProgramDowndload"
          />
        </el-col>
      </el-row>

    </el-dialog>
    <!--放电参数对话框-->
    <el-dialog :title="Discharge.title" :visible.sync="Discharge.open" width="1600px" append-to-body>
      <el-row :gutter="20">
        <el-row style="margin-left: 20px">
          <span style="font-size: large">查询</span>
          <el-select v-model="searchProdOrderNo" style="margin-left: 20px" placeholder="请选择" @change="getDischarge">
            <el-option
              v-for="item in eleProdoptions"
              :key="item.electrodeProdOrderNo"
              :label="item.electrodeProdOrderNo"
              :value="item.electrodeProdOrderNo"
            >
            </el-option>
          </el-select>
          <el-tag style="margin-left: 20px">电极编号：{{ electrodeBno }}</el-tag>
        </el-row>
        <el-col :span="11">
          <h2>电火花放电参数</h2>
          <el-form ref="formDischarge" :model="formDischarge" :rules="rules" label-width="120px">
            <el-row>
              <el-col :span="12">
                <el-form-item label="VDI底面纹，第一个程式" prop="vdiFloor">
                  <el-input v-model="formDischarge.vdiFloor"></el-input>
                </el-form-item>
                <el-form-item label="放电间隙（火花位）" prop="sparkGap">
                  <el-input v-model="formDischarge.sparkGap"></el-input>
                </el-form-item>
                <el-form-item label="摇动方式" prop="orbitType">
                  <el-input v-model="formDischarge.orbitType"></el-input>
                </el-form-item>
                <el-form-item label="电极上公差" prop="elecUpTol">
                  <el-input v-model="formDischarge.elecUpTol"></el-input>
                </el-form-item>
                <el-form-item label="加工面积，投影面积" prop="edmFace">
                  <el-input v-model="formDischarge.edmFace"></el-input>
                </el-form-item>
                <el-form-item label="工位精度" prop="edmAreaPrecision">
                  <el-input v-model="formDischarge.edmAreaPrecision"></el-input>
                </el-form-item>
                <el-form-item label="X方向平移次数" prop="xjump">
                  <el-input v-model="formDischarge.xjump"></el-input>
                </el-form-item>
                <el-form-item label="Y方向平移次数" prop="yjump">
                  <el-input v-model="formDischarge.yjump"></el-input>
                </el-form-item>
                <el-form-item label="固定方式" prop="elecFixture">
                  <el-input v-model="formDischarge.elecFixture"></el-input>
                </el-form-item>
                <el-form-item label="放电方式" prop="sparkType">
                  <el-input v-model="formDischarge.sparkType"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="VDI侧面纹，第二个程式" prop="vdiSide">
                  <el-input v-model="formDischarge.vdiSide"></el-input>
                </el-form-item>
                <el-form-item label="实体是否已缩放电间隙（火花位）" prop="bodyScaled">
                  <el-input v-model="formDischarge.bodyScaled"></el-input>
                </el-form-item>
                <el-form-item label="电极作用" prop="elecUse">
                  <el-input v-model="formDischarge.elecUse"></el-input>
                </el-form-item>
                <el-form-item label="电极下公差" prop="elecDownTol">
                  <el-input v-model="formDischarge.elecDownTol"></el-input>
                </el-form-item>
                <el-form-item label="放电模型能量面积" prop="edmArea">
                  <el-input v-model="formDischarge.edmArea"></el-input>
                </el-form-item>
                <el-form-item label="X方向平移距离" prop="xpitch">
                  <el-input v-model="formDischarge.xpitch"></el-input>
                </el-form-item>
                <el-form-item label="Y方向平移距离" prop="ypitch">
                  <el-input v-model="formDischarge.ypitch"></el-input>
                </el-form-item>
                <el-form-item label="电极火花加工粗精分类" prop="electrodeType">
                  <el-input v-model="formDischarge.electrodeType"></el-input>
                </el-form-item>
                <el-form-item label="夹具型号" prop="fixtureNumber">
                  <el-input v-model="formDischarge.fixtureNumber"></el-input>
                </el-form-item>
                <el-form-item label="电极备注" prop="remark">
                  <el-input v-model="formDischarge.remark"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-col>
        <el-col :span="13">
          <h2>电极火花加工位置列表</h2>
          <el-table :data="DischargeData" border>
            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  circle
                  icon="el-icon-edit-outline"
                  @click="handleDischargeDetail(scope.row)"
                >详细
                </el-button>
              </template>
            </el-table-column>
            <el-table-column label="posX0" align="center" prop="posX0"></el-table-column>
            <el-table-column label="posY0" align="center" prop="posY0"></el-table-column>
            <el-table-column label="posZ0" align="center" prop="posZ0"></el-table-column>
            <el-table-column label="posRev0" align="center" prop="posRev0"></el-table-column>
            <el-table-column label="posX" align="center" prop="posX"></el-table-column>
            <el-table-column label="posY" align="center" prop="posY"></el-table-column>
            <el-table-column label="posZ" align="center" prop="posZ"></el-table-column>
            <el-table-column label="posRev" align="center" prop="posRev"></el-table-column>
          </el-table>
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button @click="Discharge.open = false" type="danger">取 消</el-button>
      </div>
    </el-dialog>
    <!--电火花加工位置详细对话框-->
    <el-dialog :title="DischargeDetail.title" :visible.sync="DischargeDetail.open" width="600px" append-to-body>
      <el-form ref="formDischargeDetail" :model="formDischargeDetail" :rules="rules" label-width="280px">
        <el-form-item label="第一个位置X起始值PosX0" prop="posX0">
          <el-input v-model="formDischargeDetail.posX0"></el-input>
        </el-form-item>
        <el-form-item label="第一个位置Y起始值PosY0" prop="posY0">
          <el-input v-model="formDischargeDetail.posY0"></el-input>
        </el-form-item>
        <el-form-item label="第一个位置Z起始值PosZ0" prop="posZ0">
          <el-input v-model="formDischargeDetail.posZ0"></el-input>
        </el-form-item>
        <el-form-item label="第一个位置起始选转角度PosRev0" prop="posRev0">
          <el-input v-model="formDischargeDetail.posRev0"></el-input>
        </el-form-item>
        <el-form-item label="第一个位置X终止值PosX" prop="posX">
          <el-input v-model="formDischargeDetail.posX"></el-input>
        </el-form-item>
        <el-form-item label="第一个位置Y终止值PosY" prop="posY">
          <el-input v-model="formDischargeDetail.posY"></el-input>
        </el-form-item>
        <el-form-item label="第一个位置Z终止值PosZ" prop="posZ">
          <el-input v-model="formDischargeDetail.posZ"></el-input>
        </el-form-item>
        <el-form-item label="第一个位置终止选转角度PosRev" prop="posRev">
          <el-input v-model="formDischargeDetail.posRev"></el-input>
        </el-form-item>
        <el-form-item label="第一个位置电极装夹旋转角度PosRot" prop="posRot">
          <el-input v-model="formDischargeDetail.posRot"></el-input>
        </el-form-item>
        <el-form-item label="第一个位置电极放电朝向SparkVect" prop="sparkVect">
          <el-input v-model="formDischargeDetail.sparkVect"></el-input>
        </el-form-item>
        <el-form-item label="第一个位置电极基准Z最高点位置PosTopZ" prop="posTopZ">
          <el-input v-model="formDischargeDetail.posTopZ"></el-input>
        </el-form-item>
        <el-form-item label="第一个位置电极侧放电动量PosSideSpark" prop="posSideSpark">
          <el-input v-model="formDischargeDetail.posSideSpark"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="DischargeDetail.open = false" type="danger">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 电极上传辅助量测报告-->
    <el-dialog :title="MeasurementFile.title" :visible.sync="MeasurementFile.open" width="500px" append-to-body>
      <el-upload
        class="pop-upload"
        ref="upload"
        action=""
        :file-list="uploadFileList"
        :auto-upload="false"
        :multiple="false"
        :limit="1"
        :on-change="handleChange"
        :on-remove="handleRemove"
      >
        <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
        <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button @click="MeasurementFile.open = false" type="danger" style="margin-right: 40%">关 闭</el-button>
      </div>
    </el-dialog>
    <!-- 钢件上传辅助量测报告-->
    <el-dialog :title="steelMeasurementFile.title" :visible.sync="steelMeasurementFile.open" width="500px"
               append-to-body
    >
      <el-upload
        class="pop-upload"
        ref="upload"
        action=""
        :file-list="uploadFileList"
        :auto-upload="false"
        :multiple="true"
        :on-change="handleChange"
        :on-remove="handleRemove"
      >
        <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
        <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button @click="steelMeasurementFile.open = false" type="danger" style="margin-right: 40%">关 闭</el-button>
      </div>
    </el-dialog>
    <!-- 查看电极辅助量测报告 -->
    <el-dialog :title="measure.title" :visible.sync="measure.open" width="800px" append-to-body>
      <el-table :data="measureList" v-loading="loading" border max-height="600px">
        <el-table-column label="序号" type="index" align="center"/>
        <el-table-column label="生产单号-电极序号" align="center">
          <template slot-scope="scope">
            <p>{{ scope.row.prodOrderNo }}-{{ scope.row.electrodeNo }}</p>
          </template>
        </el-table-column>
        <el-table-column label="文件名" prop="fileName" align="center"/>
        <el-table-column label="上传时间" prop="createTime" align="center"/>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="查看设计图档" placement="top-start">
              <el-button
                type="primary"
                circle
                icon="el-icon-folder-opened"
                @click="handleSeeDrawing(scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="totalMeasure>0"
        :total="totalMeasure"
        :page.sync="queryParamsMeasure.pageNo"
        :limit.sync="queryParamsMeasure.pageSize"
        @pagination="getListMeasure"
      />
    </el-dialog>
    <!-- 查看钢件辅助量测报告 -->
    <el-dialog :title="steelMeasure.title" :visible.sync="steelMeasure.open" width="800px" append-to-body>
      <el-table :data="measureList" v-loading="loading" border max-height="600px">
        <el-table-column label="序号" type="index" align="center"/>
        <el-table-column label="生产单号" align="center">
          <template slot-scope="scope">
            <p>{{ scope.row.prodOrderNo }}</p>
          </template>
        </el-table-column>
        <el-table-column label="文件名" prop="name" align="center"/>
        <el-table-column label="上传时间" prop="createTime" align="center"/>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="查看设计图档" placement="top-start">
              <el-button
                type="primary"
                circle
                icon="el-icon-folder-opened"
                @click="handleSeeDrawing(scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="totalMeasure>0"
        :total="totalMeasure"
        :page.sync="queryParamsMeasure.pageNo"
        :limit.sync="queryParamsMeasure.pageSize"
        @pagination="getListMeasure"
      />
    </el-dialog>
  </div>

</template>

<script>
import {
  editCamEleContactListRemark,
  electronicContactList,
  getCamElectrodeProdOrderNo,
  getMeasurementFilePage, getOrderBomMeasurementFilePage,
  uploadMeasurementFile,
  uploadOrderBomMeasurementFile,
  upMeasurementFile
} from '../../../api/eleContact/eleContactForm'
import { getDrawingFile, getPublicDrawingFile, listBomDetail, listOrderBom } from '../../../api/order/orderbom'
import { viewDesignDoc } from '../../../api/camdesign/documentation'
import { Base64 } from 'js-base64'
import global from '../../../store/global.js'
import { listPerson } from '../../../api/system/person'
import {
  dischargeParameters, getCamElectricSparkList,
  getCamEleProgramSheet,
  getCamEleProgramSheetList,
  getCamProgramSheet,
  getCamProgramSheetList
} from '../../../api/production/taskStation'
import { getUserProfile } from '../../../api/system/user'
import VueBarcode from 'vue-barcode'
import { listElectrodeBom } from '../../../api/camdesign/electrode'
import { removeToken } from '../../../utils/auth'
import downloadGlobal from '@/store/downloadGlobal'

export default {
  name: 'EleContactFormC',
  components: {
    'barcode': VueBarcode
  },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 总条数
      total: 0,
      totalFile: 0,
      totalPublicFile: 0,
      totalDesign: 0,
      totalDownloadData: 0,
      totalDownload: 0,
      totalMeasure: 0,
      // 非多个禁用
      multiple: true,
      //判断电极序号是否存在
      elecMultiple: false,
      // 表格数据
      filesList: [],
      fileList: [],
      exchangeList: [],
      // 弹出层标题
      title: '',
      titleProgram: '',
      titleProgramDetail: '',
      // 是否显示弹出层
      open: false,
      openDraw: false,
      openProgram: false,
      openProgramDetail: false,
      //跳转数据
      OrderNo: '',
      electrodeNo: '',
      // 联络单参数
      customerCode: '',
      customerOrderNo: '',
      orderDate: '',
      demandDate: '',
      dispatchOrderNo: '',
      height: '',
      investor: '',
      length: '',
      material: '',
      pieceNo: '',
      processingContent: '',
      prodOrderNo: '',
      quantity: '',
      versionNo: '',
      width: '',
      moduleNo: '',
      name: '',
      deliveryLevel: '',
      hisProdOrderNo: '',
      datasource: '',
      //客户图档参数
      bomId: '',
      detailId: '',
      //工件图档参数
      files: {
        // 是否显示弹出层
        open: false,
        // 弹出层标题
        title: '工件图档'
      },
      //钢件程式单详细
      eleProgramDetail: {
        title: '',
        open: false
      },
      //程式单下载详细
      programDownload: {
        title: '',
        open: false
      },
      //程式单下载数据
      downloadData: [],
      downloadDataTotal: [],
      //工件图档表格数据
      filesData: [],
      //公共图档表格数据
      publicFilesData: [],
      //设计图档参数
      code: '',
      sort: '',
      fileOrderNo: '',
      //工件列表数据
      designList: [],
      //交接事宜表单
      handover: {
        // 是否显示弹出层
        open: false,
        // 弹出层标题
        title: '新增交接事宜'
      },
      //交接事宜表单数据
      handoverForm: {},
      userName: '',
      personNo: '',
      //工段选择参数
      codeOption: [],
      //程式单表单参数
      formProgram: {},
      ProgramData: [],
      //分条程式单详细
      formProgramDetail: {},
      eleFormProgramDetail: {},
      //程式单选中参数
      programOrderNo: '',
      //放电参数
      Discharge: {
        // 是否显示弹出层
        open: false,
        // 弹出层标题
        title: ''
      },
      //放电参数表单
      formDischarge: {},
      DischargeData: [],
      //放电参数选中数据
      dischargeProdOrderNo: '',
      eleProdoptions: [],
      searchProdOrderNo: '',
      electrodeBno: '',
      //电火花加工详细信息
      DischargeDetail: {
        // 是否显示弹出层
        open: false,
        // 弹出层标题
        title: ''
      },
      //电火花位置详细表单参数
      formDischargeDetail: {},
      MeasurementFile: {
        title: '电极上传辅助量测报告',
        open: false
      },
      steelMeasurementFile: {
        title: '钢件上传辅助量测报告',
        open: false
      },
      // 上传报告
      uploadFileList: [],
      //上传选中数据
      uploadSort: '',
      uploadCode: '',
      //辅助量测弹窗
      measure: {
        title: '',
        open: false
      },
      //钢件辅助量测弹窗
      steelMeasure: {
        title: '',
        open: false
      },
      //辅助量测表单数据
      measureList: [],
      //辅助量测选中数据
      measureCode: '',
      measureSort: '',
      // 查询参数
      queryParams: {
        pageNo: 1,
        pageSize: 10
      },
      // 查询参数
      queryParamsSearch: {
        pageNo: 1,
        pageSize: 10
      },
      // 查询参数
      queryParamsAlready: {
        pageNo: 1,
        pageSize: 10
      },
      // 查询参数
      queryParamsPrograme: {
        pageNo: 1,
        pageSize: 10
      },
      // 查询参数
      queryParamsDownloadTotal: {
        pageNo: 1,
        pageSize: 10
      },
      // 查询参数
      queryParamsDownload: {
        pageNo: 1,
        pageSize: 10
      },
      // 查询参数
      queryParamsDischarge: {
        pageNo: 1,
        pageSize: 10
      },
      // 查询参数
      queryParamsDischargeBom: {
        pageNo: 1,
        pageSize: 10
      },
      // 查询参数
      queryParamsMeasure: {
        pageNo: 1,
        pageSize: 10
      },
      //交接事宜表单验证
      rules: {
        stationIdList: [
          { required: true, message: '工段不能为空', trigger: 'blur' }
        ],
        handoverInstructions: [
          { required: true, message: '交接说明不能为空', trigger: 'blur' }
        ]
      },
      //设计图档后缀名
      suffix:'',
    }
  },
  watch: {
    $route: {
      handler: function(route) {
         this.OrderNo = route.query.prodOrderNo
         this.electrodeNo = route.query.electrodeNo
         this.getList()
      },
      immediate: true
    }
  },
  created() {
    this.getListUser()
  },
  mounted() {
    this.OrderNo = this.$route.query.prodOrderNo
    this.electrodeNo = this.$route.query.electrodeNo
    this.$route.query.prodOrderNo = '';
    this.$route.query.electrodeNo = '';
    this.getList()
  },
  methods: {
    /** 查询电子联络单列表 */
    getList() {
      
      if (this.OrderNo == null) {

      } else {
        this.queryParams.prodOrderNo = this.OrderNo
        this.queryParams.electrodeNo = this.electrodeNo
      }
      // if(this.electrodeNo == undefined || this.electrodeNo == 0){
      //   this.elecMultiple = true
      // }else{
      //   this.elecMultiple = false
      // }
      this.loading = true
      electronicContactList(this.queryParams).then(res => {
        this.customerCode = res.data.customerCode
        this.customerOrderNo = res.data.customerOrderNo
        this.orderDate = res.data.orderDate
        this.dispatchOrderNo = res.data.dispatchOrderNo
        this.height = res.data.height
        this.length = res.data.length
        this.width = res.data.width
        this.investor = res.data.investor
        this.material = res.data.material
        this.pieceNo = res.data.pieceNo
        this.processingContent = res.data.processingContent
        this.prodOrderNo = res.data.prodOrderNo
        this.quantity = res.data.quantity
        this.versionNo = res.data.versionNo
        this.moduleNo = res.data.moduleNo
        this.name = res.data.name
        this.demandDate = res.data.demandDate
        this.deliveryLevel = res.data.deliveryLevel
        this.filesList = res.data.wList
        this.bomId = res.data.bomId
        this.detailId = res.data.detailId
        this.hisProdOrderNo = res.data.hisProdOrderNo
        this.codeOption = res.data.wList
        this.exchangeList = res.data.rList
        this.datasource = res.data.datasource
        this.loading = false
      })
    },
    /** 查询电子联络单列表 */
    getListSearch() {
      electronicContactList(this.queryParamsSearch).then(res => {
        this.customerCode = res.data.customerCode
        this.customerOrderNo = res.data.customerOrderNo
        this.orderDate = res.data.orderDate
        this.dispatchOrderNo = res.data.dispatchOrderNo
        this.height = res.data.height
        this.length = res.data.length
        this.width = res.data.width
        this.investor = res.data.investor
        this.material = res.data.material
        this.pieceNo = res.data.pieceNo
        this.processingContent = res.data.processingContent
        this.prodOrderNo = res.data.prodOrderNo
        this.quantity = res.data.quantity
        this.versionNo = res.data.versionNo
        this.moduleNo = res.data.moduleNo
        this.name = res.data.name
        this.demandDate = res.data.demandDate
        this.deliveryLevel = res.data.deliveryLevel
        this.filesList = res.data.wList
        this.bomId = res.data.bomId
        this.detailId = res.data.detailId
        this.hisProdOrderNo = res.data.hisProdOrderNo
        this.codeOption = res.data.wList
        this.exchangeList = res.data.rList
        this.datasource = res.data.datasource
      })
      // if(this.electrodeNo == undefined || this.electrodeNo == 0){
      //   this.elecMultiple = true
      // }else{
      //   this.elecMultiple = false
      // }
    },
    // 订单BOM表单重置
    reset() {
      this.handoverForm = {
        name: undefined,
        code: undefined,
        handoverTime: undefined,
        handoverInstructions: undefined
      }
      this.resetForm('handoverForm')
    },
    /** 搜索按钮操作 */
    handleQuery() {
      // console.log(this.queryParamsSearch.prodOrderNo.substring(0,2))
      if(this.queryParamsSearch.prodOrderNo!=""&&this.queryParamsSearch.prodOrderNo!=null){

        if (this.queryParamsSearch.prodOrderNo.substring(0,2).toUpperCase() == 'EL'){
          this.queryParams.pageNo = 1;
          // console.log(this.queryParamsSearch)
          this.getListSearch();
        }else if(this.queryParamsSearch.prodOrderNo.substring(0,2).toUpperCase() == 'GD'|| this.queryParamsSearch.prodOrderNo.substring(0,2).toUpperCase() == 'BD'){
          this.$modal.msgError("请输入电极生产单号")
        }
      }
      
    },
    /** 查看客户图档 */
    getFile() {
      this.queryParams.prodOrderNo = this.fileOrderNo
      getDrawingFile(this.queryParams).then(res => {
        this.filesData = res.data.records
        this.totalFile = res.data.total
      })
    },
    getPublicFile() {
      this.queryParams.prodOrderNo = this.fileOrderNo
      this.queryParams.id = this.bomId
      getPublicDrawingFile(this.queryParams).then(res => {
        this.publicFilesData = res.data.records
        this.totalPublicFile = res.data.total
      })
    },
    /** 分页查询设计图档*/
    getListDesignDoc() {
      this.queryParams.code = this.code
      this.queryParams.prodOrderNo = this.prodOrderNo
      this.queryParams.sort = this.sort
      this.queryParams.suffix = this.suffix
      viewDesignDoc(this.queryParams).then(response => {
        this.designList = response.data.records
        this.totalDesign = Number(response.data.total)
      })
    },
    /** 设计图档pdf筛选*/
    suffixPdf(){
      this.suffix = 'pdf'
      this.getListDesignDoc()
    },
    /** 设计图档prt筛选*/
    suffixPrt(){
      this.suffix = 'prt'
      this.getListDesignDoc()
    },
    /** 设计图档nc筛选*/
    suffixNc(){
      this.suffix = 'nc'
      this.getListDesignDoc()
    },
    /** 设计图档全部筛选*/
    suffixAll(){
      this.suffix = ''
      this.getListDesignDoc()
    },
    /** 查询程式单 */
    getCamProgramSheet() {
      if (this.datasource === '0') {
        this.queryParamsPrograme.orderNo = this.prodOrderNo
        getCamProgramSheet(this.queryParamsPrograme).then(res => {
          if (res.data == null) {
            this.formProgram = {}
          } else {
            this.formProgram = res.data
          }
        })
      } else {
        this.queryParamsPrograme.orderNo = this.prodOrderNo
        getCamEleProgramSheet(this.queryParamsPrograme).then(res => {
          if (res.data == null) {
            this.formProgram = {}
          } else {
            this.formProgram = res.data
          }
        })
      }
    },
    /** 查询分条程序列表 */
    getCamProgramSheetList() {
      if (this.datasource === '0') {
        this.queryParamsPrograme.orderNo = this.prodOrderNo
        getCamProgramSheetList(this.queryParamsPrograme).then(response => {
          this.ProgramData = response.data.records
        })
      } else {
        this.queryParamsPrograme.orderNo = this.prodOrderNo
        getCamEleProgramSheetList(this.queryParamsPrograme).then(response => {
          this.ProgramData = response.data.records
        })
      }
    },
    /** 查询分条程序详细列表 */
    getCamProgramSheetDetailList() {
      if (this.datasource === '0') {
        this.queryParamsPrograme.orderNo = this.programOrderNo
        getCamProgramSheetList(this.queryParamsPrograme).then(response => {
          this.formProgramDetail = response.data.records[0]
        })
      } else {
        this.queryParamsPrograme.orderNo = this.programOrderNo
        getCamEleProgramSheetList(this.queryParamsPrograme).then(response => {
          this.eleFormProgramDetail = response.data.records[0]
        })
      }
    },
    /** 分页查询总加工程式 */
    getListProgramDowndloadTotal() {
      if (this.name === '钢件') {
        this.queryParamsDownloadTotal.code = this.code
        this.queryParamsDownloadTotal.prodOrderNo = this.prodOrderNo
        this.queryParamsDownloadTotal.sort = this.sort
        this.queryParamsDownloadTotal.camFileId = ['3']
        viewDesignDoc(this.queryParamsDownloadTotal).then(response => {
          this.downloadDataTotal = response.data.records
          this.totalDownloadData = Number(response.data.total)
        })
      } else {
        this.queryParamsDownloadTotal.code = this.code
        this.queryParamsDownloadTotal.prodOrderNo = this.prodOrderNo
        this.queryParamsDownloadTotal.sort = this.sort
        this.queryParamsDownloadTotal.camFileId = ['12']
        viewDesignDoc(this.queryParamsDownloadTotal).then(response => {
          this.downloadDataTotal = response.data.records
          this.totalDownloadData = Number(response.data.total)
        })
      }
    },
    /** 分页查询加工程式 */
    getListProgramDowndload() {
      if (this.name === '钢件') {
        this.queryParamsDownload.code = this.code
        this.queryParamsDownload.prodOrderNo = this.prodOrderNo
        this.queryParamsDownload.sort = this.sort
        this.queryParamsDownload.camFileId = ['4']
        viewDesignDoc(this.queryParamsDownload).then(response => {
          this.downloadData = response.data.records
          this.totalDownload = Number(response.data.total)
        })
      } else {
        this.queryParamsDownload.code = this.code
        this.queryParamsDownload.prodOrderNo = this.prodOrderNo
        this.queryParamsDownload.sort = this.sort
        this.queryParamsDownload.camFileId = ['13']
        viewDesignDoc(this.queryParamsDownload).then(response => {
          this.downloadData = response.data.records
          this.totalDownload = Number(response.data.total)
        })
      }

    },
    /** 根据工件生产单号查询电极生产单号 */
    getElectrodeProdOrderNo() {
      const prodOrderNo = this.dischargeProdOrderNo
      getCamElectrodeProdOrderNo({ 'prodOrderNo': prodOrderNo }).then(res => {
        this.eleProdoptions = res.data
      })
    },
    /** 分页查询BOM明细列表 */
    getListEledetail() {
      this.queryParamsDischargeBom.electrodeProdOrderNo = this.searchProdOrderNo
      listElectrodeBom(this.queryParamsDischargeBom).then(response => {
        this.electrodeBno = response.data.records[0].electrodeBno
      })
    },
    /** 分页查询放电参数 */
    getListDischargeParameters() {
      this.queryParamsDischarge.orderNo = this.searchProdOrderNo
      dischargeParameters(this.queryParamsDischarge).then(res => {
        this.formDischarge = res.data
      })
    },
    /** 查询电火花加工位置 */
    getCamElectricSparkList() {
      this.queryParamsDischarge.orderNo = this.searchProdOrderNo
      getCamElectricSparkList(this.queryParamsDischarge).then(response => {
        this.DischargeData = response.data.records
      })
    },
    /** 分页查询辅助量测报告 */
    getListMeasure() {
      this.queryParamsMeasure.prodOrderNo = this.hisProdOrderNo
      this.queryParamsMeasure.electrodeNo = this.electrodeNo
      this.queryParamsMeasure.code = this.measureCode
      this.queryParamsMeasure.sort = this.measureSort
      this.queryParamsMeasure.hisProdOrderNo = this.hisProdOrderNo
      
      if (this.datasource == '1') {
        getMeasurementFilePage(this.queryParamsMeasure).then(res => {
          this.measureList = res.data.records
          this.totalMeasure = res.data.total
        })
      } else if (this.datasource == '0') {
        getOrderBomMeasurementFilePage(this.queryParamsMeasure).then(res => {
          this.measureList = res.data.records
          this.totalMeasure = res.data.total
        })
      }
    },
    /** 查询登录用户信息*/
    getListUser() {
      getUserProfile().then(response => {
        this.userName = response.data.nickName
        this.personNo = response.data.userName
        this.deptName = response.data.dept.name
      })
      // if(this.electrodeNo == undefined || this.electrodeNo == 0){
      //   this.elecMultiple = true
      // }else{
      //   this.elecMultiple = false
      // }
    },
    /** 查看客户图档 */
    handleWatchCustomer(row) {
      this.files.open = true
      this.fileOrderNo = row.prodOrderNo
      this.getFile()
      this.getPublicFile()
    },
    /** 查看设计图档 */
    handleWatchDesign(row) {
      this.code = row.code
      this.sort = row.sort
      this.openDraw = true
      this.suffix = ''
      this.getListDesignDoc()
    },
    // 提取文件后缀名
    getSuffix(str) {
      const fileExtension = str.substring(str.lastIndexOf('.') + 1)
      return fileExtension
    },
    /** 查看客户图档 */
    handleSeeDrawing(row, i) {
      // listElectrodeSearch()
      
      this.files.open = false
      let suffix = this.getSuffix(row.url)
      if (suffix === 'prt' || suffix === 'dwg' || suffix === 'svlx' || suffix === 'vsf') {
        if (suffix === 'prt') {
          const url = downloadGlobal.hostUpload + row.url + '.svlx'
          // const url = global.hostUpload + row.url + '.svlx'
          const { href } = this.$router.resolve({
            path: '/eleContactFormC/3DView',
            query: {
              url: url,
              dispatchOrderNo: row.dispatchOrderNo,
              prodOrderNo: row.prodOrderNo,
              bomId: row.bomId,
              type: i
            }
          })
          window.open(href, '_blank')
        } else if (suffix === 'dwg') {
          const url = downloadGlobal.hostUpload + row.url + '.vsf'
          // const url = global.hostUpload + row.url + '.vsf'
          const { href } = this.$router.resolve({
            path: '/eleContactFormC/2DView',
            query: {
              url: url,
              dispatchOrderNo: row.dispatchOrderNo,
              prodOrderNo: row.prodOrderNo,
              bomId: row.bomId,
              type: i
            }
          })
          window.open(href, '_blank')
        }
      } else if(suffix === 'stp' || suffix === 'step'){
        const url = downloadGlobal.hostUpload + row.url
        // const url = downloadGlobal.hostUpload + "/draw/H719888/123/123.stp"
        // window.open('http://127.0.0.1:8012/onlinePreview?url='+encodeURIComponent(Base64.encode(url)))
        window.open(downloadGlobal.hostWatch + '/onlinePreview?url='+encodeURIComponent(Base64.encode(url)))
      } else if(suffix === 'pdf' || suffix === 'xlsx' || suffix === 'xls' ){
        const changeurl = row.url.split('.')[0] + '.pdf'
        const url = downloadGlobal.hostUpload + changeurl
        // const url = global.hostUpload + changeurl
        //alert('http://127.0.0.1:8012/onlinePreview?url='+encodeURIComponent(Base64.encode(url)))
        // window.open('http://127.0.0.1:8012/onlinePreview?url='+encodeURIComponent(Base64.encode(url)));
        // window.open('http://127.0.0.1:8012/onlinePreview?url='+encodeURIComponent(Base64.encode(url)));
        window.open(downloadGlobal.hostWatch + '/onlinePreview?url=' + encodeURIComponent(Base64.encode(url)) + '&officePreviewType=pdf')
        // window.open(global.hostWatch + '/onlinePreview?url=' + encodeURIComponent(Base64.encode(url)) + '&officePreviewType=pdf')
      }else if(suffix === 'html' ){

            const path = row.filePath
            // 如果 path 里含有子目录，按段编码
            const httpUrl = downloadGlobal.hostHead + `/cmm/cmm/view?path=${encodeURIComponent(path)}`;
            window.open(httpUrl, '_blank', 'noopener');

      }else{
            this.$modal.msgError("该文件格式暂不支持在线预览，请下载后查看")
      }
    },
    /** 新增交接事宜按钮 */
    handleAddThings() {
      this.reset()
      this.handover.open = true
    },
    /** 保存交接事宜 */
    submitForm: function() {
      this.$refs['handoverForm'].validate(valid => {
        if (valid) {
          if (this.handoverForm.id != undefined) {
            this.handoverForm.prodOrderNo = this.prodOrderNo
            this.handoverForm.name = this.userName
            this.handoverForm.jobNo = this.personNo
            editCamEleContactListRemark(this.handoverForm).then(res => {
              this.$modal.msgSuccess('修改交接事宜成功')
              this.handover.open = false
              this.getList()
            })
          } else {
            this.handoverForm.prodOrderNo = this.prodOrderNo
            this.handoverForm.name = this.userName
            this.handoverForm.jobNo = this.personNo
            editCamEleContactListRemark(this.handoverForm).then(res => {
              this.$modal.msgSuccess('新增交接事宜成功')
              this.handover.open = false
              this.getList()
            })
          }
        }
      })
    },
    /** 修改交接事宜 */
    handleUpdate(row) {
      this.handover.open = true
      this.handoverForm = row
    },
    /** 程式参数按钮 */
    handleOpenProgram(row) {
      if (row.code === 'CNC') {
        this.titleProgram = ''
        this.openProgram = true
        this.getCamProgramSheet()
        this.getCamProgramSheetList()
      } else if (row.code === 'EDM') {
        this.dischargeProdOrderNo = row.prodOrderNo
        this.Discharge.title = ''
        this.Discharge.open = true
        this.getElectrodeProdOrderNo()
      } else if (row.code === 'WE') {

      } else {

      }
    },
    /** 根据电极生产单号查询放电参数 */
    getDischarge() {
      this.getListDischargeParameters()
      this.getCamElectricSparkList()
      this.getListEledetail()
    },
    /** 电火花加工位置详细 */
    handleDischargeDetail(row) {
      this.DischargeDetail.open = true
      this.DischargeDetail.title = '电极火花加工位置列表'
      this.formDischargeDetail = row
    },
    /** 程式单查看详细 */
    handleViewDetail(row) {
      if (this.datasource === '0') {
        this.titleProgramDetail = '分条程式单详情'
        this.openProgramDetail = true
        this.programOrderNo = row.manufactureNo
        this.getCamProgramSheetDetailList()
      } else {
        this.eleProgramDetail.title = '分条程式单详情'
        this.eleProgramDetail.open = true
        this.programOrderNo = row.manufactureNo
        this.getCamProgramSheetDetailList()
      }
    },
    /** 程式下载 */
    handleDownloadProgram(row) {
      this.code = row.code
      this.sort = row.sort
      this.programDownload.open = true
      this.programDownload.title = '加工程式下载'
      this.getListProgramDowndload()
      this.getListProgramDowndloadTotal()
    },
    /** 下载按钮 */
    handleDownload(row) {
      let downName = row.fileName
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
    /** 上传档案按钮 */
    handleUpload(row) {
      this.uploadSort = row.sort
      this.uploadCode = row.code
      if (this.datasource == '1') {
        this.MeasurementFile.open = true
      } else if (this.datasource == '0') {
        this.steelMeasurementFile.open = true
      }

    },
    /** 报告上传 */
    // 文件状态改变时的钩子，添加文件、上传成功和上传失败时都会被调用,function(file, fileList)
    handleChange(file, fileList) {
      this.uploadFileList = fileList
    },
    // 删除文件之前的钩子，参数为上传的文件和文件列表，若返回 false 或者返回 Promise 且被 reject，则停止删除。function(file, fileList)
    handleRemove(file, fileList) {
      this.uploadFileList = fileList
    },
    luck(){},
    //上传服务器
    submitUpload() {
      //判断是否有文件再上传
      if (this.uploadFileList.length === 0) {
        return this.$message.warning('请选取文件后再上传')
      }
      // 下面的代码将创建一个空的FormData对象:
      const formData = new FormData()
      const steelFormData = new FormData()
      // 你可以使用FormData.append来添加键/值对到表单里面；
      this.uploadFileList.forEach((file) => {
        formData.append('file', file.raw)
        steelFormData.append('file', file.raw)
      })
      // 添加自定义参数，不传可删除(电极)
      formData.append('prodOrderNo', this.prodOrderNo)
      formData.append('electrodeNo', this.electrodeNo)
      formData.append('userName', this.personNo)
      // 添加自定义参数，不传可删除(钢件)
      steelFormData.append('prodOrderNo', this.prodOrderNo)
      steelFormData.append('userName', this.personNo)
      steelFormData.append('sort', this.uploadSort)
      steelFormData.append('code', this.uploadCode)
      if (this.datasource == '1') {
        //自定义的接口也可以用ajax或者自己封装的接口
        upMeasurementFile(formData).then(res => {
          if (res.Result === 'PASS') {
            this.$message.success(res.Msg)
            this.MeasurementFile.open = false
          } else {
            this.$message.error('上传失败')
          }
          //清空fileList
          this.uploadFileList = []
        })
      } else if (this.datasource == '0') {
        uploadOrderBomMeasurementFile(steelFormData).then(res => {
          if (res.code === 200) {
            this.$message.success(res.msg)
            this.steelMeasurementFile.open = false
          } else {
            this.$message.error('上传失败')
          }
          //清空fileList
          this.uploadFileList = []
        })
      }

    },
    /** 查看量测报告 */
    handleViewFiles(row) {
      this.measureCode = row.code
      this.measureSort = row.sort
      if (this.datasource == '1') {
        this.measure.open = true
        this.measure.title = '电极辅助量测报告'
        this.getListMeasure()
      } else if (this.datasource == '0') {
        this.steelMeasure.open = true
        this.steelMeasure.title = '钢件辅助量测报告'
        this.getListMeasure()
      }
    }
  }
}
</script>

<style scoped>

</style>
