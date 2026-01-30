<template>
  <div class="app-container">
    <el-row :gutter="24">
      <el-form :model="queryParams" ref="queryForm" :inline="true">
        <el-row>
          <el-form-item label="查找：" prop="keywords">
            <el-input
              v-model="queryParams.code"
              placeholder="输入周转筐编码"
              clearable
              size="small"
              style="width: 200px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item>
            <el-button style="margin-left: 10px" type="primary" icon="el-icon-search" size="mini" @click="handleQuery"></el-button>
          </el-form-item>
        </el-row>
        <el-row style="margin-top: -10px;margin-bottom: 10px">
          <el-button
            size="mini"
            round
            type="primary"
            icon="el-icon-plus"
            @click="handleAdd"
          >新增周转筐</el-button>
          <el-button
            size="mini"
            round
            type="info"
            icon="el-icon-edit"
            @click="handleUpdate"
            :disabled="single"
          >修改周转筐</el-button>
          <el-button
            size="mini"
            round
            type="danger"
            :disabled="multiple"
            icon="el-icon-delete"
            @click="handleDelete"
          >删除</el-button>
        </el-row>
      </el-form>
      <el-col :span="12">
        <el-table v-loading="loading" :data="rfidList"  @selection-change="handleSelectionChange" @cell-click="cellHandleClick" highlight-current-row>
          <el-table-column type="selection"  width="50" align="center" />
          <el-table-column label="周转筐编码" align="center"  prop="code" />
          <el-table-column label="是否占用" align="center" prop="status_dictText"  />
        </el-table>
        <pagination
          v-show="total>0"
          :total="total"
          :page.sync="queryParams.pageNo"
          :limit.sync="queryParams.pageSize"
          @pagination="getList"
        />
        
      </el-col>
      <el-col :span="12">
        <el-table v-loading="loading" :data="tagList" @header-click="clickFun">
          <el-table-column type="index" width="50"/>
          <el-table-column label="RFID标签" align="center" prop="rfidCode" />
          <el-table-column align="center" label="+" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button
                size="small"
                circle
                type="primary"
                icon="el-icon-plus"
                @click="handleAddRfid(scope.row)"
              ></el-button>
              <el-button
                size="small"
                circle
                type="warning"
                icon="el-icon-minus"
                @click="handleDeleteRfid(scope.row)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>

    <!-- 新增周转筐对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="400px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="周转筐编码" prop="code">
          <el-input v-model="form.code" placeholder="" />
        </el-form-item>
        <el-form-item label="是否占用" prop="status">
          <el-select v-model="form.status" placeholder="请选择" style="width: 100%">
            <el-option
              v-for="dict in dict.type.rfid_turnover_basket_status"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="des">
          <el-input v-model="form.des" type="textarea" placeholder="" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="open = false">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 新增RFID标签对话框 -->
    <el-dialog :title="titleRfid" :visible.sync="openRfid" width="400px" append-to-body>
      <el-form ref="formRfid" :model="formRfid" :rules="rulesRfid" label-width="100px">
        <el-form-item label="RFID标签" prop="rfidCode">
          <el-input v-model="formRfid.rfidCode" placeholder="" v-focus v-if="openRfid"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFormRfid">确 定</el-button>
        <el-button @click="openRfid = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { listBasketRfid,addBasketRfid,updateBasketRfid,deleteBasketRfid,listRfid,addListRfid,deleteListRfid } from "../../../api/system/rfid"


  export default {
    name: "rfid",
    dicts: ['rfid_turnover_basket_status'],
    directives: {
      // 注册一个局部的自定义指令 v-focus
      focus: {
        // 指令的定义
        inserted(el) {
          // 聚焦元素
          el.querySelector('input').focus()
        }
      }
    },
    data() {
      return {
        // 遮罩层
        loading: true,
        // 总条数
        total: 0,
        // 周转筐数据
        rfidList: [],
        //RFID数据
        tagList:[],
        // 非多个禁用
        multiple: true,
        // 非单个禁用
        single: true,
        // 弹出层标题
        title: "",
        titleRfid:'',
        // 是否显示弹出层
        open: false,
        openRfid:false,
        // 表单参数
        form: {},
        formRfid: {},
        //选中数组
        Id:[],
        code:[],
        basketId: [],
        basketData:{},
        // 查询参数
        queryParams: {
          pageNo: 1,
          pageSize: 10,
        },
        // 查询参数
        queryParamsRfid: {
          pageNo: 1,
          pageSize: 10000,
        },
        //增加单数
        obj:{
          rfidCode:'',
        },
        //周转筐表单校验
        rules: {
          code: [
            { required: true, message: "周转筐编码不能为空", trigger: "blur" },
            { min: 2, max: 15, message: '周转筐编码长度必须介于 2 和 15 之间', trigger: 'blur' },
            {
              pattern: /^[A-Za-z0-9-_]{1,30}$/,
              message: "请输入正确的周转筐编码",
              trigger: "blur"
            }
          ],
          status: [
            { required: true, message: "状态不能为空", trigger: "blur" },
          ],
        },
        //RFID表单校验
        rulesRfid: {
          rfidCode: [
            { required: true, message: "RFID标签不能为空", trigger: "blur" },
            { min: 2, max: 20, message: 'RFID标签长度必须介于 2 和 20 之间', trigger: 'blur' },
            {
              pattern: /^[A-Za-z0-9-_]{2,20}$/,
              message: "请输入正确的rfid编码",
              trigger: "blur"
            }
          ],
        },
      };
    },
    created() {
      this.getList();
    },
    methods: {
      /** 查询周转筐列表 */
      getList() {
        this.loading = true;
        listBasketRfid(this.queryParams).then(response => {
          if(null!=response&&undefined !=response){
            this.rfidList = response.data.records;
            this.total = Number(response.data.total);
          }
          
          this.loading = false;
        });
      },
      /** 查询RFID标签列表 */
      getListRfid() {
        this.loading = true;
        this.queryParamsRfid.basketId = this.basketId
        listRfid(this.queryParamsRfid).then(response => {
          this.tagList = response.data.records;
          this.loading = false;
        });
      },
      // 周转筐表单重置
      reset() {
        this.form = {
          code: undefined,
          name: undefined,
          status: undefined,
        };
        this.resetForm("form");
      },
      // RFID表单重置
      resetRfid() {
        this.formRfid = {
          rfidCode: undefined,
        };
        this.resetForm("formRfid");
      },
      /** 新增周转筐按钮 */
      handleAdd() {
        this.reset();
        this.open = true;
        this.title = "新增周转筐";
      },
      /** 修改周转筐按钮 */
      handleUpdate() {
        this.reset();
        this.open = true;
        this.title = "修改周转筐";
        this.form = this.basketData
      },
      // 多选框选中数据
      handleSelectionChange(selection) {
        this.Id = selection.map(item => item.id);
        this.code = selection.map(item => item.code);
        this.multiple = !selection.length;
        this.single = selection.length != 1;
        this.basketData = selection[0]
      },
      /** 表格点击获取RFID操作 */
      cellHandleClick(row) {
        this.reset()
        this.basketId = row.id
        this.getListRfid()
      },
      /** 报废周转筐按钮 */
      handleDelete() {
        const code = this.code ;
        const ids = this.Id
        this.$modal.confirm('是否确认删除周转筐编号为"' + code + '"的数据项？').then(function() {
          return deleteBasketRfid({'ids':ids});
        }).then(() => {
          this.getList();
          this.$modal.msgSuccess("删除成功");
        }).catch(() => {});
      },
      /** 表头点击 */
      clickFun() {
        this.tagList.push(JSON.parse(JSON.stringify(this.obj)))
      },
      /** 新增RFID标签 */
      handleAddRfid() {
        this.resetRfid();
        this.openRfid = true;
        this.titleRfid = "新增RFID标签";
      },
      /** 删除RFID标签 */
      handleDeleteRfid(row) {
        const Id = row.id ;
        const rfidCode = row.rfidCode ;
        this.$modal.confirm('是否确认删除RFID标签为"' + rfidCode + '"的数据项？').then(function() {
          return deleteListRfid({'id':Id});
        }).then(() => {
          this.$modal.msgSuccess("删除成功");
          this.getListRfid(this.basketId);
        }).catch(() => {});
      },
      /** 新增周转筐提交按钮 */
      submitForm: function() {
        this.$refs["form"].validate(valid => {
          if (valid) {
            if (this.form.id != undefined) {
              updateBasketRfid(this.form).then(response => {
                this.$modal.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              });
            } else {
              addBasketRfid(this.form).then(response => {
                this.$modal.msgSuccess("新增成功");
                this.open = false;
                this.getList();
              });
            }
          }else{
            this.$modal.msgError("表单验证失败,请检查是否输入正确");
          }
        });
      },
      /** 新增RFID提交按钮 */
      submitFormRfid: function() {
        this.$refs["formRfid"].validate(valid => {
          if (valid) {
            const data = {
              'basketId': this.basketId,
              'rfidCode': this.formRfid.rfidCode
            }
              addListRfid(data).then(response => {
                this.$modal.msgSuccess("新增成功");
                this.openRfid = false;
                this.getListRfid(this.basketId);
            });
          }
        });
      },
      /** 周转筐查询 */
      handleQuery() {
        this.queryParams.pageNo= 1;
        this.getList();
      }
    }
  };
</script>


