<template>
  <div class="app-container">
    <el-card>
      <el-form :model="queryParams" ref="queryForm" :inline="true">
        <el-row>
          <el-form-item label="刀具名称" prop="name">
            <el-input
              v-model="queryParams.name"
              placeholder="输入刀具名称"
              clearable
              size="small"
              style="width: 200px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="料号" prop="itemNo">
            <el-input
              v-model="queryParams.itemNo"
              placeholder="输入料号"
              clearable
              size="small"
              style="width: 200px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="工件类型" prop="datasource">
            <el-input
              v-model="queryParams.datasource"
              placeholder="输入工件类型"
              clearable
              size="small"
              style="width: 200px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item>
            <el-button style="margin-left: 10px" type="primary" icon="el-icon-search" size="mini" @click="handleQuery"></el-button>
            <el-button size="mini" type="primary" icon="el-icon-folder-add" @click="handleImport">导入刀具</el-button>
          </el-form-item>
        </el-row>
      </el-form>
    </el-card>
    <el-card>
      <el-row style="margin-top: 0px;margin-bottom: 10px;">
            <el-button
              size="mini"
              round
              type="primary"
              icon="el-icon-plus"
              @click="handleAdd"
            >新增</el-button>
            <el-button
              size="mini"
              round
              type="danger"
              icon="el-icon-delete"
              :disabled="Ids.length === 0"
              @click="handleDelete"
            >删除</el-button>
          </el-row>
      <el-row>
        <el-col :span="24">
          <el-table v-loading="loading" :data="toolsList" border @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="50" align="center" />
            <el-table-column align="center" label="操作" >
              <template slot-scope="scope">

                <el-button
                  size="mini"
                  round
                  type="primary"
                  icon="el-icon-edit"
                  @click="handleUpdate(scope.row)"
                >编辑</el-button>
              </template>
            </el-table-column>
            <el-table-column label="料号" align="center" key="itemNo" prop="itemNo" />
            <el-table-column label="品名规格" align="center" key="pinNameAndSpecification" prop="pinNameAndSpecification"/>
            <el-table-column label="材质" align="center" key="material" prop="material"/>
            <el-table-column label="工件类型" align="center"  prop="datasource">
                <template slot-scope="scope">
                    <el-tag v-if="scope.row.datasource === '0'" type="primary">钢件</el-tag>
                    <el-tag v-if="scope.row.datasource === '1'" type="primary">电极</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="刀具名称" align="center" key="name" prop="name"/>
            <el-table-column label="刀具类型" align="center" key="costType" prop="costType">
            <template slot-scope="scope">
                <el-tag v-if="scope.row.costType === '1'" type="primary">标准刀</el-tag>
                <el-tag v-if="scope.row.costType === '2'" type="primary">非标刀</el-tag>
             </template>
             </el-table-column>
            <el-table-column label="刀具品牌" align="center" key="bandName" prop="bandName"/>
            <el-table-column label="刀具长度" align="center" key="length" prop="length"/>
            <el-table-column label="单价" align="center" key="price" prop="price"/>
            <el-table-column label="粗-加工精度" align="center" key="rough" prop="rough"/>
            <el-table-column label="中-加工精度" align="center" key="camce" prop="camce"/>
            <el-table-column label="精-加工精度" align="center" key="seiko" prop="seiko"/>
            <el-table-column label="备注" align="center" key="remark" prop="remark"/>
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

    <!-- 新增刀具对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body>
      <el-form ref="importForm" :model="importForm" :rules="rules"  label-width="130px">

        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="料号" prop="itemNo">
              <el-input v-model="importForm.itemNo" placeholder="" />
            </el-form-item>
            <el-form-item label="材质" prop="material">
              <el-input v-model="importForm.material" placeholder="" />
            </el-form-item>
            <el-form-item label="刀具名称" prop="name">
              <el-input v-model="importForm.name" placeholder="" />
            </el-form-item>
            <el-form-item label="刀具品牌" prop="bandId">
              <el-select v-model="importForm.bandId" filterable multiple placeholder="请选择刀具品牌" style="width: 100%">
                <el-option
                  v-for="item in brandList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="单价" prop="price">
              <el-input v-model="importForm.price" placeholder="" />
            </el-form-item>
            <el-form-item label="中-加工精度" prop="camce">
              <el-input v-model="importForm.camce" placeholder="" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="品名规格" prop="pinNameAndSpecification">
              <el-input v-model="importForm.pinNameAndSpecification" placeholder="" />
            </el-form-item>
            <el-form-item label="工件类型" prop="datasource">
              <el-radio-group v-model="importForm.datasource">
                <el-radio label="0" value="0">钢件</el-radio>
                <el-radio label="1" value="1">电极</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="刀具长度" prop="length">
              <el-input v-model="importForm.length" placeholder="" />
            </el-form-item>
            <el-form-item label="粗-加工精度" prop="rough">
              <el-input v-model="importForm.rough" placeholder="" />
            </el-form-item>
            <el-form-item label="精-加工精度" prop="seiko">
              <el-input v-model="importForm.seiko" placeholder="" />
            </el-form-item>
            <el-form-item label="刀具类型" prop="costType">
              <el-radio-group v-model="importForm.costType">
                <el-radio label="1" value="1">标准刀</el-radio>
                <el-radio label="2" value="2">非标刀</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item label="备注" prop="remark">
            <el-input v-model="importForm.remark" type="textarea" placeholder="" />
          </el-form-item>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="open = false">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 刀具导入对话框 -->
    <el-dialog :title="upload.title" :visible.sync="upload.open" width="400px" append-to-body>
      <el-upload
        ref="upload"
        :on-change="handlePreview"
        :limit="1"
        accept=".xlsx, .xls"
        :headers="upload.headers"
        :action="upload.url"
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
  </div>
</template>

<script>
  import { listQuality,addQuality,deleteQuality,getListQuality,updateQuality } from "../../../api/system/quality"
  import {addFiles, delFiles, listFiles, updateFiles} from "../../../api/system/files";
  import {
    delOrderToolCost,
    exportOrderToolCost,
    getOrderToolCostPage,
    saveOrUpdateOrderToolCost
  } from "../../../api/system/toolManagement";
  import {getToken} from "../../../utils/auth";
  import global from '../../../store/global.js';
  import { getOrderToolCostBrandPage } from '@/api/cncTool/toolBrand'

  export default {
    name: "Quality",
    dicts: ['sys_normal_disable','quality_type'],
    data() {
      return {
        // 遮罩层
        loading: true,
        // 总条数
        total: 0,
        // 非多个禁用
        multiple: true,
        // 表格树数据
        toolsList: [],
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        // 表单参数
        importForm: {
          itemNo: '',
          material: '',
          name: '',
          bandId: [],
          price: '',
          camce: '',
          pinNameAndSpecification: '',
          datasource: '1',
          length: '',
          rough: '',
          seiko: '',
          costType: '1', // 默认选中标准刀
          remark: ''
        },
        //选中数组
        Ids:[],
        toolNames:[],
        // 查询参数
        queryParams: {
          pageNo: 1,
          pageSize: 10,
          name:'',
          itemNo:'',
          datasource:'',
        },
        queryParamsTool: {
          pageNo: 1,
          pageSize: 1000,
        },
        // 导入刀具
        fileList: [],
        // 刀具品牌
        brandList: [],
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
          url: process.env.VUE_APP_BASE_API + "/order/cost/importOrderToolCost",
        },
        //文件格式表单校验
        rules: {
          itemNo: [
            { required: true, message: '料号不能为空', trigger: 'blur' },
            { min: 1, max: 50, message: '料号长度在 1 到 50 个字符', trigger: 'blur' }
          ],
          material: [
            { required: true, message: '材质不能为空', trigger: 'blur' },
            { min: 1, max: 100, message: '材质长度在 1 到 100 个字符', trigger: 'blur' }
          ],
          code: [
            { required: true, message: "材质编码不能为空", trigger: "blur" },
            { min: 2, max: 10, message: '材质编码长度必须介于 2 和 10 之间', trigger: 'blur' }
          ],
          name: [
            { required: true, message: "名称不能为空", trigger: "blur" },
            { min: 2, max: 20, message: '名称长度必须介于 2 和 20 之间', trigger: 'blur' }
          ],
          costType: [
            { required: true, message: "刀具类型不能为空", trigger: "blur" },
          ],
        },
      };
    },
    created() {
      this.importForm.costType = '1';
      this.getList();
      this.queryToolBrand();
    },
    methods: {
      /** 查询文件格式列表 */
      getList() {
        this.loading = true;
        const  param = this.queryParams ;
        
        getOrderToolCostPage(param).then(response => {
          this.toolsList = response.data.records;
          this.total = response.data.total;
          this.loading = false;
        });
      },
      // 文件格式表单重置
      reset() {
        this.form = {
          code: undefined,
          name: undefined,
        };
        this.resetForm("form");
      },
      // 多选框选中数据
      handleSelectionChange(selection) {
        this.Ids = selection.map(item => item.id);
        this.toolNames = selection.map(item => item.name);
        this.multiple = !selection.length;
      },
      /** 搜索按钮操作 */
      handleQuery() {
        this.queryParams.pageNo= 1;
        this.getList();
      },
      /** 编辑刀具成本按钮 */
      handleUpdate(row) {
        this.open = true
        this.title = "修改刀具信息"
        if(row.bandId != null&&row.bandId !=''){
          row.bandId = row.bandId.split(",")
          for(let i=0;i< row.bandId.length;i++){
            row.bandId[i] = parseInt(row.bandId[i])
          }
        }
        
        // row.bandId = Array.from(row.bandId)
        this.importForm = row
        console.log(row)
      },
      /** 新增文件格式按钮 */
      handleAdd() {
        this.reset();
        this.open = true;
        this.title = "新增文件格式";
      },
      /** 删除文件格式按钮 */
      handleDelete() {
        const ids = this.Ids
        const names = this.toolNames
        this.$modal.confirm('是否确认删除刀具名称为"' + names + '"的数据项？').then(function() {
          return delOrderToolCost({'ids':ids});
        }).then(() => {
          this.getList();
          this.$modal.msgSuccess("删除成功");
        }).catch(() => {});
      },
      /** 新增文件格式提交按钮 */
      submitForm: function() {
        this.$refs["importForm"].validate(valid => {
          if (valid) {
            this.importForm.bandId = this.importForm.bandId.toString()
            const uiui =this.importForm;
            
            if (this.importForm.id != undefined) {
              saveOrUpdateOrderToolCost(this.importForm).then(response => {
                this.$modal.msgSuccess("修改刀具成功");
                this.open = false;
                this.getList();
              });
            } else {
              saveOrUpdateOrderToolCost(this.importForm).then(response => {
                this.$modal.msgSuccess("新增刀具成功");
                this.open = false;
                this.getList();
              });
            }
          }
        });
      },
      /** 导入刀具按钮操作 */
      handleImport() {
        this.upload.title = "刀具导入";
        this.upload.open = true;
      },

      /** 刀具品牌信息 */
      queryToolBrand() {
        getOrderToolCostBrandPage(this.queryParamsTool).then(response => {
          this.brandList = response.data.records;
        });
      },

      /** 下载模板操作 */
      importTemplate() {
        exportOrderToolCost().then(res => {
          window.open(global.host+ res.msg)
        })

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
        this.getList();
      },
      handlePreview(file,res) {
        this.queryParams.file = file.name
      },
      // 文件上传前
      beforeUpload(file){
        this.files = file;
        //this.fileName = file.name;
      },
      // 提交上传文件
      submitFileForm(res) {
        //const formData = new FormData();
        //formData.append('files', this.file);
        /*importOrderBom(this.queryParams).then(response => {
        });*/
        this.$refs.upload.submit();
      },
    }
  };
</script>

