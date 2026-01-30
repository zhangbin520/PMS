<template>
  <div class="app-container">
    <!-- 搜索栏 -->
    <el-card>
      <el-form :model="queryParams" ref="queryForm" v-show="showSearch" :inline="true">
        <el-form-item label="搜索" prop="deptName" >
          <el-select v-model="queryParams.deptCode" @visible-change="focusVal" filterable placeholder="请选择部门" clearable size="small">
            <el-option
              v-for="item in deptOptions"
              :key="item.deptCode"
              :label="item.name"
              :value="item.deptCode"
            />
          </el-select>
        </el-form-item>
<!--        <el-form-item label="搜索" prop="deptCode">-->
<!--          <el-select v-model="queryParams.deptCode" placeholder="请选择" @change="changeVal($event)">-->
<!--            <el-option-->
<!--              v-for="item in options"-->
<!--              :key="item.value"-->
<!--              :label="item.label"-->
<!--              :value="item.value">-->
<!--            </el-option>-->
<!--          </el-select>-->
<!--        </el-form-item>-->

        <el-form-item label="选择日期" prop="time" style="margin-left: 100px">
          <el-date-picker
            v-model="queryParams.beginTime"
            type="date"
            placeholder="开始时间"
            value-format="yyyy-MM-dd">
          </el-date-picker>

          <el-date-picker
            v-model="queryParams.endTime"
            type="date"
            style="margin-left: 10px"
            placeholder="结束时间"
            value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>


        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" style="margin-left: 10px" @click="handleQuery">搜索</el-button>
        </el-form-item>
      </el-form>
    </el-card>

        <el-card>

          <!-- 按钮 -->
          <el-button type="primary" size="small" @click="add">新增检验数据<i style="margin-left: 5px" class="el-icon-circle-plus-outline"></i></el-button>
          <el-button type="primary" size="small" @click="handleImport">导入数据<i style="margin-left: 5px" class="el-icon-upload2"></i></el-button>
          <el-button type="primary" plain icon="el-icon-download" size="small" @click="handleExport">导出</el-button>
          <el-button type="danger" :disabled="multiple" size="small" @click="handleDelete">删除数据<i style="margin-left: 5px" class="el-icon-delete"></i></el-button>
          <el-button type="success" size="small" @click="goTarget" style="float: right">稼动看板<i style="margin-left: 5px" class="el-icon-view"></i></el-button>

          <!-- 表格 -->
          <el-table :row-key="getRowKeys" :data="yieldList" border style="margin-top: 10px" @selection-change="handleSelectionChange">
            <el-table-column type="selection" :reserve-selection="true" width="50" align="center" />
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="text"
                  icon="el-icon-edit"
                  @click="handleUpdate(scope.row)"
                >编辑</el-button>
              </template>
            </el-table-column>
            <el-table-column label="部门" prop="deptName" width="120" align="center"/>
            <el-table-column label="时间" prop="time" align="center"/>
            <el-table-column label="加工数量" prop="processingQuantity" align="center"/>
            <el-table-column label="异常数量" prop="exceptionsQuantity" align="center"/>
            <el-table-column label="良品率" prop="yield" align="center" :formatter="yieldformatter"/>
            <el-table-column label="备注" prop="remark" align="center"/>
          </el-table>

          <pagination
            v-show="total>0"
            :total="total"
            :page.sync="queryParams.pageNo"
            :limit.sync="queryParams.pageSize"
            @pagination="getList"
          />
        </el-card>


    <!-- 新增页面 -->
    <el-dialog title="新增" :visible.sync="open" width="550px" append-to-body>
      <el-form ref="form" :model="form" label-width="120px">
        <el-form-item label="部门" prop="deptCode">
          <el-select v-model="form.deptCode" filterable placeholder="请选择部门" clearable size="small">
            <el-option
              v-for="item in deptOptions"
              :key="item.deptCode"
              :label="item.name"
              :value="item.deptCode"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="日期" prop="time">
          <el-date-picker
            v-model="form.time"
            type="date"
            placeholder="选择日期"
            value-format="yyyy-MM-dd"/>
        </el-form-item>
        <el-form-item label="异常数量" prop="exceptionsQuantity">
          <el-input v-model='form.exceptionsQuantity' placeholder="请输入异常数量"/>
        </el-form-item>
        <el-form-item label="检验数量" prop="processingQuantity">
          <el-input v-model='form.processingQuantity' placeholder="请输入检验数量"/>
        </el-form-item>
        <el-form-item label="良品率" prop="yield">
          <el-input v-model='form.yield' :disabled="true"><i slot="suffix">%</i></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input type="textarea" v-model='form.remark'  placeholder="请输入备注"/>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">保 存</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 修改页面 -->
    <el-dialog title="修改" :visible.sync="open2" width="550px" append-to-body>
      <el-form ref="form" :model="form" label-width="120px">
        <el-form-item label="部门" prop="deptCode">
          <el-select v-model="form.deptCode" filterable placeholder="请选择部门" clearable size="small" disabled>
            <el-option
              v-for="item in deptOptions"
              :key="item.deptCode"
              :label="item.name"
              :value="item.deptCode"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="日期" prop="time">
          <el-date-picker
            v-model="form.time"
            type="date"
            placeholder="选择日期"
            value-format="yyyy-MM-dd"
            disabled/>
        </el-form-item>
        <el-form-item label="异常数量" prop="exceptionsQuantity">
          <el-input v-model='form.exceptionsQuantity' placeholder="请输入异常数量"/>
        </el-form-item>
        <el-form-item label="检验数量" prop="processingQuantity">
          <el-input v-model='form.processingQuantity' placeholder="请输入检验数量"/>
        </el-form-item>
        <el-form-item label="良品率" prop="yield">
          <el-tag type="warning">{{form.yield}}%<i slot="suffix">%</i></el-tag>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input type="textarea" v-model='form.remark'  placeholder="请输入备注"/>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">保 存</el-button>
        <el-button @click="cancel2">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 导入对话框 -->
    <el-dialog :title="upload.title" :visible.sync="upload.open" width="400px" append-to-body>
      <el-upload
        ref="upload"
        :on-change="handlePreview"
        :limit="1"
        accept=".xlsx, .xls"
        :headers="upload.headers"
        :action="upload.url + '?bizType=1'"
        :disabled="upload.isUploading"
        :on-progress="handleFileUploadProgress"
        :on-success="handleFileSuccess"
        :auto-upload="false"
        :file-list="fileList"
        drag
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip text-center" slot="tip">
          <span>仅允许导入xls、xlsx格式文件。</span>
          <el-link type="primary" :underline="false" style="font-size:12px;vertical-align: baseline;" @click="importTemplate">下载模板</el-link>
        </div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFileForm">确 定</el-button>
        <el-button @click="upload.open = false">取 消</el-button>
      </div>
    </el-dialog>

    <!--导出-->
    <el-dialog title="导出" :visible.sync="open3" width="400px" append-to-body>
      <div align="center">
        <el-progress :percentage="percentage" type="circle"></el-progress>
      </div>
    </el-dialog>

  </div>
</template>
<script>
  import {
    getProdYieldPage,
    importProdYield,
    saveProdYield,
    updateProdYield,
    delProdYield,
    exportProdYield,
    getSysDeptByCodeList
  } from "../../../api/production/yield"

  import {getToken} from "../../../utils/auth";

  import global from '../../../store/global.js'

  import { ElMapExportTable } from "table-excel";

  import {
    listDept
  } from "../../../api/system/dept"

  export default {
    components:{ElMapExportTable},
    data() {
      return {
        // 总条数
        total: 0,
        // 显示搜索条件
        showSearch: true,
        // 导入
        fileList: [],
        //上传参数
        upload: {
          // 是否显示弹出层
          open: false,
          // 弹出层标题
          title: "",
          // 是否禁用上传
          isUploading: false,
          // 是否更新已经存在的用户数据
          updateSupport: 0,
          // 设置上传的请求头部
          headers: { Authorization: "Bearer " + getToken() },
          // 上传的地址
          url: process.env.VUE_APP_BASE_API + "/prod/yield/importProdYield",
        },
        // 非单个禁用
        single: true,
        // 非多个禁用
        multiple: true,
        getRowKeys(row) {
          return row.id;
        },
        options: [{
          value: 'D157421',
          label: '品管课'
        }, {
          value: 'D157491',
          label: '铣磨课'
        }, {
          value: 'D157501',
          label: 'CNC加工课'
        }, {
          value: 'D157511',
          label: '线割课'
        }, {
          value: 'D157521',
          label: '放电课'
        }],
        //导出进度显示
        percentage:0,
        value: '',
        yieldList: [],
        open: false,
        open2: false,
        open3: false,
        deptOptions: [],
        // 表单参数
        form: {},
        pickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
        value1: '',
        // 查询参数
        queryParams: {
          pageNo: 1,
          pageSize: 10,
        },
      }
    },
    created() {
      this.getList();
    },
    methods: {
      //良品率-百分号
      yieldformatter(row)
      {
        return row.yield + "%";
      },
      /** 搜索按钮操作 */
      handleQuery() {
        this.queryParams.pageNo = 1;
        this.getList();
      },
      // 多选框选中数据
      handleSelectionChange(selection) {
        this.single = selection.length!=1
        this.multiple = !selection.length
        this.ids = selection.map(item => item.id)
      },
      // 表单重置
      reset() {
        this.form = {
          deptName: undefined,
          time: undefined,
          exceptionsQuantity: undefined,
          processingQuantity: undefined,
          yield: undefined,
          remark: undefined,
        };
        this.resetForm("form");
      },
      /** 分页查询良品率 */
      getList() {
        this.loading = true;
        getProdYieldPage(this.queryParams).then(response => {
          this.yieldList = response.data.records;
          this.total = response.data.total;
          this.loading = false;
        });
      },
      goTarget () {
        this.$router.push('/RidPage')
      },
      /** 新增按钮操作 */
      add() {
        this.reset();
        this.open = true;
        this.queryParams.pageNo = 1;
        getSysDeptByCodeList(this.queryParams).then(response => {
          this.deptOptions = response.data
        })
        this.getList();
      },
      /** 编辑按钮 */
      handleUpdate(row) {
        this.form = row
        this.open2 = true;
        getSysDeptByCodeList(this.queryParams).then(response => {
          this.deptOptions = response.data
        })
      },
      // 取消按钮
      cancel() {
        this.open = false;
        this.reset();
      },
      // 取消按钮
      cancel2() {
        this.open2 = false;
      },
      /** 提交按钮 */
      submitForm: function() {
        this.$refs["form"].validate(valid => {
          if (valid) {
            if (this.form.id != undefined) {
              updateProdYield(this.form).then(response => {
                this.$modal.msgSuccess("修改成功");
                this.open2 = false;
                this.getList();
              });
            } else {
              saveProdYield(this.form).then(response => {
                this.$modal.msgSuccess("新增成功");
                this.open = false;
                this.getList();
              });
            }
          }
        });
      },
      /** 删除按钮操作 */
      handleDelete(row) {
        // 先获取复选框选中的ID
        const ids = row.id || this.ids // 数组[1,2,3]
        this.$modal.confirm('是否确认删除').then(function() {
          return delProdYield({'ids':ids});
        }).then(() => {
          this.getList();
          this.$modal.msgSuccess("删除成功");
        }).catch(() => {});
      },
      /** 导入订单BOM按钮操作 */
      handleImport() {
        this.upload.title = "良品率导入";
        this.upload.open = true;
      },
      /** 下载模板操作 */
      importTemplate() {
        const data = this.queryManHourParams
        exportProdYield(data).then(response => {
          window.open(global.host+response.msg)
        });

      },
      // 文件上传中处理
      handleFileUploadProgress(event, file, fileList) {
        this.upload.isUploading = true;
      },
      // 文件上传成功处理
      handleFileSuccess(response, file, fileList) {
        this.upload.open = false;
        this.upload.isUploading = false;
        this.$refs.upload.clearFiles();
        this.$alert("<div style='overflow: auto;overflow-x: hidden;max-height: 70vh;padding: 10px 20px 0;'>" + response.msg + "</div>", "导入结果", { dangerouslyUseHTMLString: true });
        this.getListOrder();
      },
      handlePreview(file,res) {
        this.queryParams.file = file.name
      },
      // 文件上传前
      beforeUpload(file){
        this.files = file;
      },
      // 提交上传文件
      submitFileForm(res) {
        this.$refs.upload.submit();
        this.getList()
      },

      /** 导出按钮操作 */
      handleExport() {
        this.open3 = true;
        var data = this.yieldList; // 这里面是数据列表
        const column = [
          { title: "部门", dataIndex: "deptName" },
          { title: "时间", dataIndex: "time" },
          { title: "加工数量", dataIndex: "processingQuantity" },
          { title: "异常数量", dataIndex: "exceptionsQuantity" },
          { title: "良品率", dataIndex: "yield" },
          { title: "备注", dataIndex: "remark" },
        ];
        const instance = new ElMapExportTable(
          { column, data },
          { progress: progress => this.percentage = progress },// 进度条回调
        );
        instance.download("良品率").then((data) => {
          this.open3 = false
        }); // 导出的文件名
      },

      changeVal(event){
        console.log(event)
      },

      focusVal() {
        getSysDeptByCodeList(this.queryParams).then(response => {
          this.deptOptions = response.data
        })
      },
    }
  }
</script>
