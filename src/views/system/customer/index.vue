<template>
  <div class="app-container">
    <el-row :gutter="20">
    <!--      客户信息表格-->
      <el-col :span="10" :xs="24">
        <el-row>
        <el-col :span="20"><i class="el-icon-s-order">客户资料</i></el-col>
        <el-col :span="4">
          <el-button
            type="primary"
            size="small"
            round
            icon="el-icon-plus"
            @click="handleAddList"
            style="margin-bottom: 10px"
          >新增</el-button>
        </el-col>
        </el-row>
        <el-table v-loading="loading" :data="customerList" @cell-click="cellHandleClick" highlight-current-row>
          <el-table-column align="center" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button
                type="danger"
                size="small"
                circle
                icon="el-icon-delete"
                @click="handleDeleteList(scope.row)"
              ></el-button>
            </template>
          </el-table-column>
          <el-table-column label="客户代码" align="center" prop="socialUnifiedCreditCode" width="150px" />
          <el-table-column label="名称" align="center" prop="corporateName"  width="180px"/>
          <el-table-column label="创建时间" align="center" prop="createTime">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.createTime)| FormatDate('yyyy-MM-dd') }}</span>
            </template>
          </el-table-column>
        </el-table>
        <pagination
          v-show="total>0"
          :total="total"
          :page.sync="queryParams.pageNo"
          :limit.sync="queryParams.pageSize"
          @pagination="getList"
        />
      </el-col>
    <!--      基础信息表单-->
      <el-col :span="14" :xs="24">
        <el-row>
          <el-col :span="20"><i class="el-icon-info">基本信息</i></el-col>
          <el-col :span="4">
            <el-button
              type="primary"
              size="small"
              round
              icon="el-icon-s-claim"
              @click="handleUpdateList"
              style="margin-bottom: 10px"
            >保存修改</el-button>
          </el-col>
          <el-col>
          <el-form ref="form" :model="form" :rules="rules" label-width="80px" size="mini">
            <el-row>
              <el-col :span="12">
                <el-form-item label="公司名称" prop="corporateName">
                  <el-input v-model="form.corporateName" placeholder="" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="社会统一信用代码" prop="socialUnifiedCreditCode">
                  <el-input v-model="form.socialUnifiedCreditCode" placeholder="" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="开户银行" prop="bankOfDeposit">
                  <el-input v-model="form.bankOfDeposit" placeholder="" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="银行账号" prop="bankAccount">
                  <el-input v-model="form.bankAccount" oninput="value=value.replace(/^0|[^0-9]/g,'')" placeholder="" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="联系电话" prop="contactNumber">
                  <el-input v-model="form.contactNumber" oninput="value=value.replace(/^0|[^0-9]/g,'')" placeholder="" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="地址" prop="address">
                  <el-input v-model="form.address" placeholder="" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="官网" prop="os">
                  <el-input v-model="form.os" placeholder="" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="公司规模">
                  <el-select v-model="form.companySize" placeholder="请选择" style="width: 100%">
                    <el-option
                      v-for="dict in dict.type.customer_company_size"
                      :key="dict.value"
                      :label="dict.label"
                      :value="dict.label"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="注册资本" prop="registeredCapital">
                  <el-input v-model="form.registeredCapital" placeholder="" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="成立时间" prop="establishmentTime">
                  <el-date-picker v-model="form.establishmentTime" type="date" format="yyyy-MM-dd" :picker-options="setDateRange" placeholder="选择日期" style="width: 100%" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="经营业务" prop="businessOperation">
                  <el-input v-model="form.businessOperation" placeholder="" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="备注" prop="remark">
                  <el-input v-model="form.remark" type="textarea" placeholder="" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          </el-col>
        </el-row>
       <!--        联系人-->
        <el-col>
        <el-row>
          <el-col :span="20"><i class="el-icon-info">联系人</i></el-col>
          <el-col :span="4">
            <el-button
              type="primary"
              size="small"
              round
              icon="el-icon-plus"
              @click="handleAddContact"
              style="margin-bottom: 10px"
            >添加联系人</el-button>
          </el-col>
          <el-table v-loading="loading" :data="contactList">
            <el-table-column align="center" class-name="small-padding fixed-width">
              <template slot-scope="scope">
                <el-button
                  type="danger"
                  size="small"
                  circle
                  icon="el-icon-delete"
                  @click="handleDeleteContact(scope.row)"
                ></el-button>
                <el-button
                  size="small"
                  circle
                  type="primary"
                  icon="el-icon-edit"
                  @click="handleUpdateContact(scope.row)"
                ></el-button>
              </template>
            </el-table-column>
            <el-table-column label="姓名" align="center" prop="name"  />
            <el-table-column label="性别" align="center" prop="gender">
              <template slot-scope="scope">
                <p v-if="scope.row.gender =='0'">男</p>
                <p v-if="scope.row.gender =='1'">女</p>
              </template>
            </el-table-column>
            <el-table-column label="手机" align="center" prop="phone"  />
            <el-table-column label="邮箱" align="center" prop="email"  />
            <el-table-column label="职位" align="center" prop="position"  />
            <el-table-column label="部门名称" align="center" prop="email"  />
            <el-table-column label="代码" align="center" prop="customerCode"  />
          </el-table>
        </el-row>
        </el-col>
      </el-col>
    </el-row>

    <!-- 添加或修改客户信息对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="700px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="12">
              <el-form-item label="公司名称" prop="corporateName">
                <el-input v-model="form.corporateName" placeholder="" />
              </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="社会统一信用代码" prop="socialUnifiedCreditCode">
              <el-input v-model="form.socialUnifiedCreditCode" placeholder="" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="开户银行" prop="bankOfDeposit">
              <el-input v-model="form.bankOfDeposit" placeholder="" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="银行账号" prop="bankAccount">
              <el-input v-model="form.bankAccount" oninput="value=value.replace(/^0|[^0-9]/g,'')" placeholder="" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="联系电话" prop="contactNumber">
              <el-input v-model="form.contactNumber" oninput="value=value.replace(/^0|[^0-9]/g,'')" placeholder="" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="地址" prop="address">
              <el-input v-model="form.address" placeholder="" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="官网" prop="os">
              <el-input v-model="form.os" placeholder="" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="公司规模">
              <el-select v-model="form.companySize" placeholder="请选择" style="width: 100%">
                <el-option
                  v-for="dict in dict.type.customer_company_size"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.label"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="注册资本" prop="registeredCapital">
              <el-input v-model="form.registeredCapital" placeholder="" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="成立时间" prop="establishmentTime">
            <el-date-picker v-model="form.establishmentTime" format="yyyy-MM-dd" type="date" :picker-options="setDateRange" placeholder="选择日期" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="经营业务" prop="businessOperation">
              <el-input v-model="form.businessOperation" placeholder="" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="备注" prop="remark">
              <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 添加联系人信息对话框 -->
    <el-dialog :title="title" :visible.sync="openContact" width="700px" append-to-body>
      <el-form ref="formContact" :model="formContact" :rules="rulesContact" label-width="100px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="姓名" prop="name">
              <el-input v-model="formContact.name" placeholder="" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="性别">
              <el-select v-model="formContact.gender" placeholder="请选择" style="width: 100%">
                <el-option
                  v-for="dict in dict.type.sys_user_sex"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="手机" prop="phone">
              <el-input v-model="formContact.phone" placeholder="" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="formContact.email" placeholder="" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="职位" prop="position">
              <el-input v-model="formContact.position" placeholder="" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="部门名称" prop="deptName">
              <el-input v-model="formContact.deptName" placeholder="" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="上级" prop="superior">
              <el-input v-model="formContact.superior" placeholder="" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="下级" prop="subordinate">
              <el-input v-model="formContact.subordinate" placeholder="" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="代码" prop="code">
              <el-input v-model="formContact.code" placeholder="" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系地址" prop="contactAddress">
              <el-input v-model="formContact.contactAddress" type="textarea" placeholder="" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFormContact">确 定</el-button>
        <el-button @click="cancelContact">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {listCustomer,addCustomer,updateCustomer,delCustomer,getCustomer,listContact,
          addContact,updateContact,delContact,getContact} from "../../../api/system/customer";

  export default {
    name: "Customer",
    dicts: ['customer_company_size','sys_user_sex'],
    data() {
      return {
        // 遮罩层
        loading: true,
        // 总条数
        total: 0,
        // 用户表格数据
        customerList: null,
        //联系人表格数据
        contactList: [],
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        openContact: false,
        // 查询参数
        queryParams: {
          pageSize: 10,
          pageNo: 1,
          corporateName: undefined,
          code:undefined,
        },
        // 表单参数
        form: {},
        formContact: {},
        //选中参数
        Id:[],
        customerId:[],
        customerID:[],
        //成立时间限制
        setDateRange: {
          disabledDate: time => {
            // 禁用今天之后的日期【当前天可选】
            return time.getTime() > Date.now() - 5;
          }
        },
        // 客户信息表单校验
        rules: {
          corporateName: [
            { required: true, message: "公司名称不能为空", trigger: "blur" },
            { min: 2, max: 20, message: '公司名称长度必须介于 2 和 20 之间', trigger: 'blur' }
          ],
          establishmentTime: [
            { required: true, message: "成立时间不能为空", trigger: "blur" },
          ],
          bankOfDeposit: [
            { required: true, message: "开户银行不能为空", trigger: "blur" },
            {
              pattern: /^[\u4e00-\u9fa5]+$/,
              message: "请输入正确的开户银行",
              trigger: "blur"
            }
          ],
          contactNumber: [
            {
              pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
              message: "请输入正确的联系号码",
              trigger: "blur"
            }
          ]
        },
        rulesContact: {
          name: [
            { required: true, message: "姓名不能为空", trigger: "blur" },
            {
              pattern: /^[\u4e00-\u9fa5]+$/,
              message: "请输入正确的姓名",
              trigger: "blur"
            }
          ],
          email: [
            {
              pattern: /^([a-zA-Z0-9]+[_|_|.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|_|.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/,
              message: "请输入正确的邮箱",
              trigger: "blur"
            }
          ],
          phone: [
            { required: true, message: "手机不能为空", trigger: "blur" },
            {
              pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
              message: "请输入正确的手机号码",
              trigger: "blur"
            }
          ],
          corporateName: [
            { required: true, message: "公司名称不能为空", trigger: "blur" },
            { min: 2, max: 10, message: '公司名称长度必须介于 2 和 10 之间', trigger: 'blur' }
          ],
          establishmentTime: [
            { required: true, message: "成立时间不能为空", trigger: "blur" },
          ],
          bankOfDeposit: [
            { required: true, message: "开户银行不能为空", trigger: "blur" },
            {
              pattern: /^[\u4e00-\u9fa5]+$/,
              message: "请输入正确的开户银行",
              trigger: "blur"
            }
          ],
          contactNumber: [
            {
              pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
              message: "请输入正确的联系号码",
              trigger: "blur"
            }
          ]
        },
      };
    },
    created() {
      this.getList();
    },
    methods: {
      /** 查询客户信息列表 */
      getList() {
        this.loading = true;
        listCustomer(this.queryParams).then(response => {
            this.customerList = response.data.records;
            this.total = Number(response.data.total);
            this.loading = false;
          }
        );
      },
      /** 查询联系人信息列表 */
      getListContact(result) {
        const Id = result
        listContact({'customerId':Id}).then(response => {
          this.contactList = response.data;
        });
      },
      /** 查询客户信息列表 */
      getListCustomer(result) {
        const Id = result
        getCustomer({'id':Id}).then(response => {
          this.form = response.data;
        });
      },
      // 客户资料新增取消按钮
      cancel() {
        this.open = false;
        this.reset();
      },
      //联系人列表新增取消按钮
      cancelContact() {
        this.openContact = false;
        this.resetContact();
      },
      // 客户资料表单重置
      reset() {
        this.form = {
          id: undefined,
          corporateName: undefined,
          socialUnifiedCreditCode: undefined,
          bankOfDeposit: undefined,
          bankAccount: undefined,
          contactNumber: undefined,
          registeredCapital: undefined,
          establishmentTime: undefined,
          businessOperation: undefined,
          code: undefined,
        };
        this.resetForm("form");
      },
      //联系人表单重置
      resetContact() {
        this.formContact = {
          name: undefined,
          phone: undefined,
          email: undefined,
          gender_dictText: undefined,
        };
        this.resetForm("formContact");
      },
      /** 客户信息新增按钮 */
      handleAddList() {
        this.reset();
        this.open = true;
        this.title = "新增客户";
      },
      /** 联系人新增按钮 */
      handleAddContact() {
        this.resetContact();
        this.openContact = true;
        this.title = "新增联系人";
      },
      /** 表格点击获取基础信息操作 */
      cellHandleClick(row) {
        this.reset()
        const Id = row.id
        this.Id = row.id
        this.customerID = row.customerId
        getCustomer({'id':Id}).then(response => {
          this.form = response.data;
        });
        //联系人获取
        listContact({'customerId':Id}).then(response => {
          this.contactList = response.data;
        });
      },
      /** 客户信息修改按钮操作 */
      handleUpdateList() {
        this.$refs["form"].validate(valid => {
          if (valid){
            updateCustomer(this.form).then(response => {
              this.form = response.data;
              this.$modal.msgSuccess("修改成功");
              this.getListCustomer(this.Id)
            });
          }else{
            this.$modal.msgError("表单验证失败,请检查是否输入正确");
          }
        })
      },
      /** 联系人修改按钮操作 */
      handleUpdateContact(row) {
        this.openContact = true;
        this.title = "修改联系人信息";
        this.resetContact();
        const id = row.id
        this.customerId = row.customerId
        getContact({'id':id}).then(response => {
          this.formContact = response.data;
        });
      },
      /** 客户信息删除按钮操作 */
      handleDeleteList(row) {
        this.reset();
        const Name = row.corporateName
        const Id = row.id
        this.$modal.confirm('是否确认删除客户名称为"' + Name + '"的数据项？').then(function() {
          return delCustomer({'id':Id});
        }).then(() => {
          this.getList();
          this.$modal.msgSuccess("删除成功");
        }).catch(() => {});
      },
      /** 联系人删除按钮操作 */
      handleDeleteContact(row) {
        this.resetContact();
        const id = row.id
        const Name = row.name
        const customerId = row.customerId
        this.$modal.confirm('是否确认删除姓名为"' + Name + '"的数据项？').then(function() {
          return delContact({'id':id});
        }).then(() => {
          listContact({'customerId':customerId}).then(response => {
            this.contactList = response.data;
          });
          this.$modal.msgSuccess("删除成功");
        }).catch(() => {});
      },
      /** 客户信息提交按钮 */
      submitForm: function() {
        this.$refs["form"].validate(valid => {
          if (valid) {
            if (this.form.id != undefined) {
              this.form.id = this.Id
              updateCustomer(this.form).then(response => {
                this.$modal.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              });
            } else {
              addCustomer(this.form).then(response => {
                this.$modal.msgSuccess("新增成功");
                this.open = false;
                this.getList();
              });
            }
          }
        });
      },
      /** 联系人信息提交按钮 */
      submitFormContact: function() {
        this.$refs["formContact"].validate(valid => {
          if (valid) {
            if (this.formContact.id != undefined) {
              updateContact(this.formContact).then(response => {
                this.$modal.msgSuccess("修改成功");
                this.openContact = false;
                this.getListContact(this.Id);
                this.getList();
              });
            } else {
              this.formContact.customerId = this.Id
              addContact(this.formContact).then(response => {
                this.$modal.msgSuccess("新增成功");
                this.openContact = false;
                this.getListContact(this.Id);
                this.getList();
              });
            }
          }
        });
      },
    }
  };
</script>
