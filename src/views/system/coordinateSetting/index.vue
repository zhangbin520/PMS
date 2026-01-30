<template>
  <div class="app-container">
    <el-card>
      <el-form :model="queryParams" ref="queryForm" :inline="true">
        <el-row>
          <el-form-item label="控制器" prop="keywords">
            <el-input
              v-model="queryParams.controller"
              placeholder="输入控制器名称"
              clearable
              size="small"
              style="width: 200px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="工艺" prop="keywords">
            <el-input
              v-model="queryParams.craftsName"
              placeholder="输入工艺"
              clearable
              size="small"
              style="width: 200px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="坐标系" prop="keywords">
            <el-input
              v-model="queryParams.coordinate"
              placeholder="输入坐标系"
              clearable
              size="small"
              style="width: 200px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item>
            <el-button style="margin-left: 10px" type="primary" icon="el-icon-search" size="mini" @click="handleQuery"></el-button>
            <el-button size="mini" type="primary" icon="el-icon-plus" @click="handleAdd">新增</el-button>
            <el-button size="mini" round type="danger" icon="el-icon-delete" @click="handleDelete">删除</el-button>
          </el-form-item>
        </el-row>
      </el-form>
    </el-card>
    <el-card>
      <el-row>
        <el-col :span="24">
          <el-table v-loading="loading" :data="coordinateList" border @selection-change="handleSelectionChange">
            <el-table-column type="index" width="50" align="center" />
            <el-table-column type="selection" width="50" align="center" />
            <el-table-column align="center">
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
            <el-table-column label="控制器" align="center" key="controller" prop="controller" />
            <el-table-column label="工艺" align="center" key="craftsName" prop="craftsName"/>
            <el-table-column label="坐标系信息" align="center" key="coordinate" prop="coordinate"/>
            <el-table-column label="测高调用程式" align="center" key="heightMeasuringCaller" prop="heightMeasuringCaller"/>
            <el-table-column label="主程式调用子程式" align="center" key="mainSubroutine" prop="mainSubroutine"/>
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

    <!-- 新增坐标系对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="480px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="130px">
        <el-form-item label="控制器" prop="controller">
<!--          <el-input v-model="form.controller" placeholder="" @change="selectCraftsName"/>-->
          <el-select v-model="form.controller" placeholder="请选择" style="width: 100%" @change="selectCraftsName">
            <el-option
              v-for="item in optionsBrand"
              :key="item"
              :label="item"
              :value="item"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="工艺" prop="craftsName">
          <el-select v-model="form.craftsName" multiple placeholder="请选择" style="width: 100%">
            <el-option
              v-for="item in codeOption"
              :key="item"
              :label="item"
              :value="item"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="坐标系" prop="coordinate">
          <el-input v-model="form.coordinate" placeholder="" />
        </el-form-item>
        <el-form-item label="测高调用程式" prop="heightMeasuringCaller">
          <el-input v-model="form.heightMeasuringCaller" placeholder="" />
        </el-form-item>
        <el-form-item label="主程式调用子程式" prop="mainSubroutine">
          <el-input v-model="form.mainSubroutine" placeholder="" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="open = false">取 消</el-button>
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
  import {editBaseCoordinate, getBaseCoordinatePage, getCodeByController} from "../../../api/production/semiAutomation";
  import { getBrandInformation } from '@/api/camdesign/programm'

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
        coordinateList: [],
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        // 表单参数
        form: {},
        //根据控制器选择工艺
        codeOption:[],
        //选中数组
        Ids:[],
        coordinate:[],
        // 查询参数
        queryParams: {
          pageNo: 1,
          pageSize: 10,
        },
        // 文件类型查询参数
        queryParamsBrand: {
          pageNo: 1,
          pageSize: 50,
        },
        //控制器数据
        optionsBrand:[],
        //文件格式表单校验
        rules: {
          controller: [
            { required: true, message: "控制器不能为空", trigger: "blur" },
          ],
          craftsName: [
            { required: true, message: "工艺不能为空", trigger: "blur" },
          ],
          coordinate : [
            {
              pattern: /^[A-Za-z0-9]+$/,
              message: "请输入正确的坐标系",
              trigger: "blur"
            }
          ],
          heightMeasuringCaller : [
            {
              pattern: /^[A-Za-z0-9]+$/,
              message: "请输入正确的测高调用程式",
              trigger: "blur"
            }
          ],
          mainSubroutine: [
            {
              pattern: /^[A-Za-z0-9]+$/,
              message: "请输入正确的主程式调用子程式",
              trigger: "blur"
            }
          ],
        },
      };
    },
    created() {
      this.getList();
      this.getListBrand();
    },
    methods: {
      /** 分页查询坐标系列表 */
      getList() {
        this.loading = true;
        getBaseCoordinatePage(this.queryParams).then(response => {
          this.coordinateList = response.data.records;
          this.total = response.data.total;
          this.loading = false;
        });
      },
      /** 根据控制器查控制器绑定得工艺 */
      getCodeList() {
        const controller = this.form.controller
        getCodeByController({'keyWords':controller}).then(response => {
          this.codeOption = response.data.split(',');
        });
      },
      // 多选框选中数据
      handleSelectionChange(selection) {
        this.Ids = selection.map(item => item.id);
        this.coordinate = selection.map(item => item.coordinate);
        this.multiple = !selection.length;
      },
      // 坐标系表单重置
      reset() {
        this.form = {
          code: undefined,
          name: undefined,
        };
        this.resetForm("form");
      },
      /** 搜索按钮操作 */
      handleQuery() {
        this.getList();
        this.queryParams = {
          pageNo: 1,
          pageSize: 10,
        };
      },
      /** 选择工艺 */
      selectCraftsName() {
        this.getCodeList()
      },
      /** 编辑坐标系按钮 */
      handleUpdate(row) {
        this.open = true
        this.title = "修改坐标系信息"
        this.form = row
        this.form.craftsName = this.form.craftsName.split(',')
        this.getCodeList()
      },
      /** 新增坐标系按钮 */
      handleAdd() {
        this.reset();
        this.open = true;
        this.title = "新增坐标信息";
      },
      /** 删除坐标系按钮 */
      handleDelete() {
        const ids = this.Ids
        const delFlag = '1'
        const coordinate = this.coordinate
        this.$modal.confirm('是否确认删除坐标系名称为"' + coordinate + '"的数据项？').then(function() {
          return editBaseCoordinate({'ids':ids,'delFlag':delFlag});
        }).then(() => {
          this.getList();
          this.$modal.msgSuccess("删除成功");
        }).catch(() => {});
      },
      /** 分页查询控制器类别 */
      getListBrand() {
        getBrandInformation(this.queryParamsBrand).then(res =>{
          this.optionsBrand = res.data.BRAND_LIST;
        })
      },
      /** 新增坐标系提交按钮 */
      submitForm: function() {
        this.$refs["form"].validate(valid => {
          if (valid) {
            if (this.form.id != undefined) {
              this.form.craftsName = this.form.craftsName.join(',')
              editBaseCoordinate(this.form).then(response => {
                this.$modal.msgSuccess("修改坐标系成功");
                this.open = false;
                this.getList();
              });
            } else {
              this.form.craftsName = this.form.craftsName.join(',')
              editBaseCoordinate(this.form).then(response => {
                this.$modal.msgSuccess("新增坐标系成功");
                this.open = false;
                this.getList();
              });
            }
          }else{
            this.$modal.msgError("表单验证失败,请检查是否输入正确");
          }
        });
      },
    }
  };
</script>

