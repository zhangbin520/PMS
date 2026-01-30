<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="24">
        <!--按工号/姓名/手机号查询搜索框-->
        <el-form :model="queryParams" ref="queryForm" v-show="showSearch">
          <el-row>
            <el-form-item>
              <el-input
                v-model="queryParams.keywords"
                placeholder="姓名/工号/手机号"
                clearable
                prefix-icon="el-icon-search"
                style="width: 80%"
                @keyup.enter.native="handleQuery"
              />
              <el-button type="primary" style="margin-left: 10px" icon="el-icon-search" size="mini" @click="handleQuery"></el-button>
            </el-form-item>
          </el-row>
        </el-form>
        <!--员工管理数据-->
        <el-table v-loading="loading" :data="personList" size="mini"  highlight-current-row
                  @current-change="handleCurrentChange" max-height="780px">
          <el-table-column label="工号" align="center" prop="jobNo" />
          <el-table-column label="照片" align="center" prop="avatar" >
            <template slot-scope="scope">　　　
              <img :src="call + scope.row.avatar" width="80" height="80" />
            </template>
          </el-table-column>
          <el-table-column label="姓名" align="center"  prop="name"/>
          <el-table-column label="籍贯" align="center"  >
            <template slot-scope="scope">
              <span>{{scope.row.nativePlace}}{{scope.row.homeAddress}}</span>
            </template>　
          </el-table-column>
          <el-table-column label="性别" align="center"  prop="gender_dictText"/>
          <el-table-column label="部门" align="center"  prop="deptName"/>
          <el-table-column label="职位" align="center"  prop="positionInfoName"/>
          <el-table-column label="入职日期" align="center" prop="firstOnboardingDate">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.firstOnboardingDate)| FormatDate('yyyy-MM-dd') }}</span>
            </template>
          </el-table-column>
          <el-table-column label="状态" align="center"  prop="status" >
            <template slot-scope="scope">
              <dict-tag :options="dict.type.person_status" :value="scope.row.status"/>
            </template>
          </el-table-column>
          <el-table-column label="主管" align="center"  prop="leaderName" />
          <el-table-column label="手机" align="center"  prop="phone" />
          <el-table-column label="邮箱" align="center"  prop="email" />
        </el-table>
        <!--员工管理分页组件-->
        <pagination
          v-show="totalPerson>0"
          :total="totalPerson"
          :page.sync="queryParams.pageNo"
          :limit.sync="queryParams.pageSize"
          @pagination="getListPerson"
        />
      </el-col>
    </el-row>
    <div align="center">
      <el-row style="margin-top: 20px">
        <el-button
          type="primary"
          size="small"
          round
          icon="el-icon-plus"
          @click="handleAddPerson"
        >录入新员工</el-button>
          <el-button
            type="info"
            size="small"
            round
            :disabled="isAble"
            icon="el-icon-edit-outline"
            @click="handleUpdatePerson"
          >修改基本信息</el-button>
          <el-button
            type="primary"
            size="small"
            round
            :disabled="isAble"
            icon="el-icon-s-opportunity"
            @click="upOrdown"
          >调动/晋升</el-button>
          <el-button
            type="info"
            size="small"
            round
            :disabled="isAble"
            icon="el-icon-refresh-left"
            @click="checkPerson"
          >查看岗位经历</el-button>
          <el-button
            size="small"
            round
            :disabled="isAble"
            icon="el-icon-unlock"
            @click="leavePosition"
          >离职</el-button>
          <el-button
            type="info"
            size="small"
            round
            :disabled="isCan"
            icon="el-icon-lock"
            @click="entryPosition"
          >再次入职</el-button>
          <el-button
            type="danger"
            size="small"
            round
            :disabled="isAble"
            icon="el-icon-remove"
            @click="stopPosition"
          >停岗</el-button>
          <el-button
            type="warning"
            size="small"
            round
            :disabled="isCan"
            icon="el-icon-refresh-right"
            @click="recoverPosition"
          >复岗</el-button>
          <el-button
            type="primary"
            size="small"
            round
            :disabled="isAble"
            icon="el-icon-sort-down"
            @click="checkSubordinates"
          >查看下级</el-button>
          <el-button
            type="info"
            size="small"
            round
            :disabled="isAble"
            icon="el-icon-sort-up"
            @click="checkSuperior"
          >查看上级</el-button>
      </el-row>
    </div>

    <!-- 录入新员工信息对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="700px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-row :gutter="10">
        <el-col :span="12">
          <el-row>
            <el-form-item label="姓名" prop="name">
              <el-input v-model="form.name" placeholder="请输入姓名" />
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="最高学历" prop="education">
              <el-select v-model="form.education" placeholder="请选择" style="width: 100%">
                <el-option
                  v-for="dict in dict.type.person_education"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="手机" prop="phone">
              <el-input v-model="form.phone" placeholder="请输入手机号"/>
            </el-form-item>
          </el-row>
        </el-col>
        <el-col :span="12">
          <el-row>
            <el-form-item label="工号" prop="jobNo">
              <el-input v-model="form.jobNo" placeholder="" />
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="性别" prop="gender">
              <el-select v-model="form.gender" placeholder="请选择" style="width: 100%">
                <el-option
                  v-for="dict in dict.type.sys_user_sex"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="电子邮件" prop="email">
              <el-input v-model="form.email" placeholder="" />
            </el-form-item>
        </el-row>
        </el-col>
        <!--        头像-->
        <el-col :span="15" >
          <el-form-item label="头像" prop="avatar">
          <avatarUpload v-model="form.avatar" />
          </el-form-item>
        </el-col>
        </el-row>
        <el-row><el-col :span="24"><i class="el-icon-s-order">入职信息</i></el-col></el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="部门" prop="deptId">
              <div class="father">
                <treeselect v-model="form.deptId" :options="deptOptions" :show-count="true" placeholder="请选择归属部门" />
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="职位" prop="positionCode">
              <el-select v-model="form.positionCode" placeholder="请选择" style="width: 100%">
                <el-option
                  v-for="item in personForpost"
                  :key="item.code"
                  :label="item.name"
                  :value="item.code"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="入职日期" prop="firstOnboardingDate">
              <el-date-picker v-model="form.firstOnboardingDate" type="date" placeholder="选择日期" value-format="yyyy-MM-dd"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="主管" prop="leaderNo">
              <el-select v-model="form.leaderNo" filterable placeholder="请选择" style="width: 100%">
                <el-option
                  v-for="item in superiorForperson"
                  :key="item.personNo"
                  :label="item.name"
                  :value="item.personNo"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="角色" prop="roleId">
              <el-select v-model="form.roleId" multiple placeholder="请选择" style="width: 100%">
                <el-option
                  v-for="item in roleForperson"
                  :key="item.roleId"
                  :label="item.roleName"
                  :value="item.roleId"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="CAM任务权限" prop="camTaskPermissions">
              <el-select v-model="form.camTaskPermissions" multiple placeholder="请选择" style="width: 100%">
                <el-option
                  v-for="dict in dict.type.programming_category"
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
            <el-form-item label="加工任务权限">
              <el-select v-model="form.processingTaskPermission" multiple placeholder="请选择" style="width: 100%">
                <el-option
                  v-for="item in taskForperson"
                  :key="item"
                  :label="item"
                  :value="item"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 修改新员工信息对话框 -->
    <el-dialog :title="update.title" :visible.sync="update.open" width="700px" append-to-body>
      <el-form ref="updateform" :model="updateform" :rules="rules" label-width="100px">
        <el-row :gutter="10">
          <el-col :span="9">
            <el-row>
              <el-form-item label="姓名" prop="name">
                <el-input v-model="updateform.name" oninput="value=value.replace(/[^\u4E00-\u9FA5]/g,'');" placeholder="" />
              </el-form-item>
            </el-row>
            <el-row>
              <el-form-item label="最高学历" prop="education">
                <el-select v-model="updateform.education" placeholder="请选择" style="width: 100%">
                  <el-option
                    v-for="dict in dict.type.person_education"
                    :key="dict.value"
                    :label="dict.label"
                    :value="dict.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-row>
            <el-row>
              <el-form-item label="手机" prop="phone">
                <el-input v-model="updateform.phone" oninput="value=value.replace(/^0|[^0-9]/g,'')" placeholder="" />
              </el-form-item>
            </el-row>
            <el-row>
              <el-form-item label="CAM任务权限" prop="camTaskPermissions">
                <el-select v-model="updateform.camTaskPermissions" multiple placeholder="请选择" style="width: 100%">
                  <el-option
                    v-for="dict in dict.type.programming_category"
                    :key="dict.value"
                    :label="dict.label"
                    :value="dict.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-row>
          </el-col>
          <el-col :span="9">
            <el-row>
              <el-form-item label="工号" prop="jobNo">
                <el-input v-model="updateform.jobNo" placeholder="" />
              </el-form-item>
            </el-row>
            <el-row>
              <el-form-item label="性别" prop="gender">
                <el-select v-model="updateform.gender" placeholder="请选择" style="width: 100%">
                  <el-option
                    v-for="dict in dict.type.sys_user_sex"
                    :key="dict.value"
                    :label="dict.label"
                    :value="dict.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-row>
            <el-row>
              <el-form-item label="电子邮件" prop="email">
                <el-input v-model="updateform.email" placeholder="" />
              </el-form-item>
            </el-row>
            <el-row>
              <el-form-item label="加工任务权限">
                <el-select v-model="updateform.processingTaskPermission" multiple placeholder="请选择" style="width: 100%">
                  <el-option
                    v-for="item in taskForperson"
                    :key="item"
                    :label="item"
                    :value="item"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-row>
          </el-col>
          <!--        头像-->
          <el-col :span="6" >
            <avatarUpload v-model="updateform.avatar" />
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFormUpdate">确 定</el-button>
        <el-button @click="update.open = false">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 调动或晋升对话框 -->
    <el-dialog :title="redeploy.title" :visible.sync="redeploy.open" width="740px" append-to-body>
      <el-form ref="formRedeploy" :model="formRedeploy" :rules="rules" label-width="100px">
     <el-row>
       <el-col :span="12">
         <el-form-item label="当前部门" >
          <span style="margin-left: 40px">{{Name}}</span>
         </el-form-item>
         <el-form-item label="当前职位">
           <span style="margin-left: 40px">{{Position}}</span>
         </el-form-item>
         <el-form-item label="当前主管">
           <span style="margin-left: 40px">{{Leader}}</span>
         </el-form-item>
         <el-form-item label="当前角色">
           <span style="margin-left: 40px">{{Role}}</span>
         </el-form-item>
       </el-col>
       <el-col :span="12">
         <el-form-item label="部门">
           <div class="father">
             <treeselect v-model="formRedeploy.deptId" :options="deptOptions" :show-count="true" placeholder="请选择新归属部门" />
           </div>
         </el-form-item>
         <el-form-item label="职位">
           <el-select v-model="formRedeploy.positionCode" filterable placeholder="未选择" style="width: 100%">
             <el-option
               v-for="item in personForpost"
               :key="item.code"
               :label="item.name"
               :value="item.code"
             ></el-option>
           </el-select>
         </el-form-item>
         <el-form-item label="主管">
           <el-select v-model="formRedeploy.leaderNo" filterable placeholder="请选择" style="width: 100%">
             <el-option
               v-for="item in superiorForperson"
               :key="item.personNo"
               :label="item.name"
               :value="item.personNo"
             ></el-option>
           </el-select>
         </el-form-item>
         <el-form-item label="角色">
           <el-select v-model="formRedeploy.roleId" multiple filterable placeholder="请选择" style="width: 100%">
             <el-option
               v-for="item in roleForperson"
               :key="item.roleId"
               :label="item.roleName"
               :value="item.roleId"
             ></el-option>
           </el-select>
         </el-form-item>
       </el-col>
     </el-row>
        <el-row>
          <el-form-item label="备注">
            <el-input v-model="formRedeploy.remark" type="textarea" placeholder="请输入内容"></el-input>
          </el-form-item>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFormRedeploy">确 定</el-button>
        <el-button @click="redeploy.open = false">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 查看岗位经历对话框 -->
    <el-drawer :title="title" :visible.sync="drawer" :direction="direction" style="width: 150%" close-on-press-escape>
<!--      <span>岗位经历</span>-->
      <el-table :data="experienceData">
<!--        <el-table-column prop="createBy" label="创建人"></el-table-column>-->
        <el-table-column prop="createTime" label="创建时间"></el-table-column>
        <el-table-column prop="id" label="员工历史ID"></el-table-column>
        <el-table-column prop="personNo" label="员工编号"></el-table-column>
        <el-table-column prop="status_dictText" label="状态"></el-table-column>
        <el-table-column prop="timeSlot" label="时间段"></el-table-column>
        <el-table-column prop="remark" label="备注"></el-table-column>
      </el-table>
    </el-drawer>
    <!-- 员工离职/二次入职对话框 -->
    <el-dialog :title="leave.title" :visible.sync="leave.open" width="400px" append-to-body>
      <el-form ref="formLeave" :model="formLeave" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="离职时间" prop="dateTime">
              <el-date-picker v-model="formLeave.dateTime" type="date" value-format="yyyy-MM-dd" style="width: 100%" placeholder="选择日期" />
            </el-form-item>
            <el-form-item label="状态" prop="status">
              <el-select v-model="formLeave.status" placeholder="请选择" style="width: 100%">
                <el-option
                  v-for="dict in dict.type.person_status"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                ></el-option>
              </el-select>
            </el-form-item>
          <el-form-item label="原因" prop="remark">
            <el-input v-model="formLeave.remark" type="textarea" placeholder="请输入内容"></el-input>
          </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFormLeave">确 定</el-button>
        <el-button @click="leave.open = false">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 员工停岗/复岗对话框 -->
    <el-dialog :title="stop.title" :visible.sync="stop.open" width="400px" append-to-body>
      <el-form ref="formStop" :model="formStop" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="状态" prop="status">
              <el-select v-model="formStop.status" placeholder="请选择" style="width: 100%">
                <el-option
                  v-for="dict in dict.type.person_status"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="原因" prop="remark">
              <el-input v-model="formStop.remark" type="textarea" placeholder="请输入内容"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFormStop">确 定</el-button>
        <el-button @click="stop.open = false">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 员工查看下级对话框 -->
    <el-dialog :title="viewSubordinates.title" :visible.sync="viewSubordinates.open" width="400px" append-to-body>
      <el-table :data="ViewSubordinatesData" v-loading="loading" :default-sort = "{order: 'descending'}">
        <el-table-column type="index" label="排序" width="50"></el-table-column>
        <el-table-column prop="personNo" label="工号" width="190px" sortable></el-table-column>
        <el-table-column prop="name" label="姓名"></el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="viewSubordinates.open = false" type="danger" style="margin-right: 40%">关 闭</el-button>
      </div>
    </el-dialog>
    <!-- 员工查看上级对话框 -->
    <el-dialog :title="viewSuperior.title" :visible.sync="viewSuperior.open" width="700px" append-to-body>
      <el-table :data="ViewSuperiorData" v-loading="loading" :default-sort = "{order: 'descending'}">
        <el-table-column type="index" label="排序" width="50" sortable></el-table-column>
        <el-table-column prop="avatar" label="头像" width="190px">
          <template slot-scope="scope">　　　
            <img :src="call + scope.row.avatar" width="80" height="80" />
          </template>
        </el-table-column>
        <el-table-column prop="name" label="姓名"></el-table-column>
        <el-table-column prop="positionName" label="职位"></el-table-column>
        <el-table-column prop="phone" label="电话"></el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="viewSuperior.open = false" type="danger" style="margin-right: 40%">关 闭</el-button>
      </div>
    </el-dialog>
     </div>
</template>

<script>
import {
  listPerson, addPerson, updatePerson, getPerson, upOrDownPerson, leavePerson, entryPerson, stopPerson, recoverPerson,
  viewPersonSub, viewPersonSup, RegionList, listTaskPermissionList, postExperience
} from '../../../api/system/person'
  import Treeselect from "@riophae/vue-treeselect";
  import "@riophae/vue-treeselect/dist/vue-treeselect.css";
  import {listDept, treeselect} from "../../../api/system/dept";
  import {getListPost, getListPostList} from "../../../api/system/post";
  import {listRole} from "../../../api/system/role";
  import global from '../../../store/global.js'


  export default {
    name: "Person",
    dicts: ['person_status', 'sys_user_sex','person_nationality','person_political_status',
            'person_marital_status','person_education','person_position','programming_category'],
    components: { Treeselect },
    data() {
      return {
        call: global.hostHead,
        // 遮罩层
        loading: true,
        //按钮禁用选中
        isAble: true,
        isCan: true,
        // 总条数
        totalPerson: 0,
        //搜素关键字
        searchName:'',
        // 用户表格数据
        personList: [],
        //职位选择
        personForpost: [],
        //主管选择
        superiorForperson: [],
        //领导选择
        leaderNos: [],
        //角色选择
        roleForperson:[],
        //主管选择
        taskForperson: [],
        // 显示搜索条件
        showSearch: true,
        // 弹出层标题
        title: "",
        //单元格点击事件
        currentRow: null,
        // 是否显示弹出层
        open: false,
        // 新增员工表单参数
        form: {},
        // 修改员工表单参数
        updateform: {},
        // 调动或晋升表单参数
        formRedeploy: {},
        // 查看岗位经历表单参数
        formcheckperson: {},
        // 离职表单参数
        formLeave: {},
        // 停岗表单参数
        formStop: {},
        // 查看下级表格参数
        ViewSubordinatesData: [],
        // 查看下级表格参数
        ViewSuperiorData: [],
        //选中数组
        status:[],
        deptId:undefined,
        //参数显示
        Name:'',
        Position:'',
        Leader:'',
        Role:[],
        personName:'',
        positionCode: '',
        camTaskPermissions:'',
        processingTaskPermission:[],
        experienceNo:'',
        //岗位经历抽屉
        drawer: false,
        direction: 'ltr',
        experienceData:[],
        // 部门树选项
        deptOptions: undefined,
        defaultProps: {
          children: "children",
          label: "label"
        },
        //修改员工表单参数
        update: {
          // 是否显示弹出层
          open: false,
          // 弹出层标题
          title: "",
        },
        //调动或晋升表单参数
        redeploy: {
          // 是否显示弹出层
          open: false,
          // 弹出层标题
          title: "",
        },
        //查看岗位经历表单参数
        checkperson: {
          // 是否显示弹出层
          open: false,
          // 弹出层标题
          title: "",
        },
        //员工离职/二次入职表单参数
        leave: {
          // 是否显示弹出层
          open: false,
          // 弹出层标题
          title: "",
        },
        //员工停岗/复岗表单参数
        stop: {
          // 是否显示弹出层
          open: false,
          // 弹出层标题
          title: "",
        },
        //员工查看下级表单参数
        viewSubordinates: {
          // 是否显示弹出层
          open: false,
          // 弹出层标题
          title: "",
        },
        //员工查看下级表单参数
        viewSuperior: {
          // 是否显示弹出层
          open: false,
          // 弹出层标题
          title: "",
        },
        // 员工管理表单查询参数
        queryParams: {
          pageNo: 1,
          pageSize: 10,
          jobNo: undefined,
          leaderName: undefined,
          leaderNo: undefined,
          rolesName: undefined,
          name: undefined,
          phone: undefined,
        },
        // 员工管理表单查询参数
        queryParamsRole: {
          pageNo: 1,
          pageSize: 100,
          jobNo: undefined,
          leaderName: undefined,
          leaderNo: undefined,
          rolesName: undefined,
          name: undefined,
          phone: undefined,
        },
        //部门表单查询参数
        queryParamsDept: {
          pageNo: 1,
          pageSize: 10,
          id: 0,
          isRootNode: 'N',
        },
        // 员工管理表单查询参数
        queryParamsUp: {
          pageNo: 1,
          pageSize: 1000,
        },
        // 员工管理表单查询参数
        queryParamsExperience: {
          pageNo: 1,
          pageSize: 1000,
        },
        //员工管理表单校验
        rules: {
          name: [
            { required: true, message: "姓名不能为空", trigger: "blur" },
            { min: 2, max: 10, message: '姓名长度必须介于 2 和 10 之间', trigger: 'blur' },
            {
              pattern: /^[\u4e00-\u9fa5]+$/,
              message: "请输入正确的姓名",
              trigger: "blur"
            }
          ],
          jobNo: [
            { required: true, message: "工号不能为空", trigger: "blur" },
            { min: 1, max: 10, message: '工号长度必须介于 1 和 10 之间', trigger: 'blur' }
          ],
          leaderNo: [
            { required: true, message: "主管不能为空", trigger: "blur" },
          ],
          firstOnboardingDate: [
            { required: true, message: "入职日期不能为空", trigger: "blur" },
          ],
          gender: [
            { required: true, message: "性别不能为空", trigger: "blur" },
          ],
          roleId: [
            { required: true, message: "角色不能为空", trigger: "blur" },
          ],
          deptId: [
            { required: true, message: "部门不能为空", trigger: "blur" },
          ],
          positionCode: [
            { required: true, message: "职位不能为空", trigger: "blur" },
          ],
          avatar: [
            { required: true, message: "头像不能为空", trigger: "blur" },
          ],
          status: [
            { required: true, message: "状态不能为空", trigger: "blur" },
          ],
          remark: [
            { required: true, message: "原因不能为空", trigger: "blur" },
          ],
          education: [
            { required: true, message: "学历不能为空", trigger: "blur" },
          ],
          email: [
            { required: true, message: "邮箱不能为空", trigger: "blur" },
            {
              type: "email",
              message: "'请输入正确的邮箱地址",
              trigger: ["blur", "change"]
            },
            {
              pattern: /^([a-zA-Z0-9]+[_|_|.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|_|.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/,
              message: "请输入正确的姓名",
              trigger: "blur"
            }
          ],
          phone: [
            { required: true, message: "手机不能为空", trigger: "blur" },
            {
              pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
              message: "请输入正确的联系号码",
              trigger: "blur"
            }
          ],
        },
      };
    },
    created() {
      this.getListPerson();
      this.getList();
      this.getTreeselect();
      this.getListPost();
      this.getListRole();
      this.getListTask();
    },
    methods: {
      /** 查询员工列表 */
      getListPerson() {
        this.loading = true;
        listPerson(this.queryParams).then(response => {
          this.personList = response.data.records;
          this.totalPerson = response.data.total;
          this.loading = false;
          });
      },
      /** 查询职位类别列表 */
      getListPost() {
        this.loading = true;
        getListPostList().then(response => {
          this.personForpost = response.data;
        });
      },
      /** 查询部门列表 */
      getList() {
        this.loading = true;
        listDept(this.queryParamsDept).then(response => {
          this.deptList = this.handleTree(response.data.records, this.queryParamsDept.deptId);
          this.loading = false;
        });
      },
      /** 查询角色列表 */
      getListRole() {
        this.loading = true;
        listRole(this.queryParamsRole).then(response => {
          this.roleForperson = response.rows;
        });
      },
      /** 查询角色列表 */
      getListTask() {
        listTaskPermissionList(this.queryParams).then(response => {
          this.taskForperson = response.data.CODE_LIST;
        });
      },
      // 新增员工表单重置
      reset() {
        this.form = {
          personNo: undefined,
          name: undefined,
          idCard: undefined,
          positionLevelName: undefined,
          status_dictText: undefined,
        };
        this.resetForm("form");
      },
      // 取消按钮
      cancel() {
        this.open = false;
        this.reset();
      },
      //工号姓名查询
      handleQuery() {
        this.queryParams.pageNo = 1;
        this.getListPerson();
      },
      //新增员工按钮
      handleAddPerson() {
        this.reset();
        this.open = true;
        this.title = "录入新员工";
        listPerson(this.queryParamsUp).then(response => {
          this.superiorForperson = response.data.records;
        });
      },
      //点击单元格选中
      handleCurrentChange(val) {
        this.currentRow = val;
        console.log('val.deptName:' + val.deptName)
        this.Name = val.deptName;
        this.Position = val.positionInfoName;
        this.Leader = val.leaderName;
        this.Role = val.rolesName.join(',');
        this.positionCode = val.positionCode;
        this.personName = val.name;
        this.experienceNo = val.personNo
        if (this.currentRow.status === '2' || this.currentRow.status === '1') {
          this.isCan = false;
          this.isAble =true;
        } else {
          this.isAble = false;
          this.isCan = true;
        }
      },
      //修改基本信息按钮
      handleUpdatePerson() {
        console.log('33')
        this.reset();
        const personNo = this.currentRow.personNo
        getPerson({'personNo':personNo}).then(response => {
          this.updateform = response.data;
          this.updateform.processingTaskPermission = this.convertStringToArray(response.data.processingTaskPermission);
          
          this.update.open = true;
          this.update.title = "修改员工信息";
        });
      },
      /** 查询部门下拉树结构 */
      getTreeselect() {
        treeselect().then(response => {
          this.deptOptions = response.data;
        });
      },
      /**调动或晋升按钮 */
      upOrdown() {
        this.redeploy.title = "岗位调动或晋升";
        this.redeploy.open = true;
        listPerson(this.queryParamsUp).then(response => {
          this.superiorForperson = response.data.records;
        });
      },
      /**查看岗位经历 */
      checkPerson() {
        this.drawer = true;
        this.title = this.personName+"的岗位经历";
        this.queryParamsExperience.personNo = this.experienceNo
        postExperience(this.queryParamsExperience).then(res => {
          this.experienceData = res.data
        });
      },
      /** 员工离职 */
      leavePosition() {
        this.leave.open = true;
        this.leave.title = "离职人："+this.personName;
      },
      /** 员工再次入职 */
      entryPosition() {
        this.leave.open = true;
        this.leave.title = "二次入职员工："+this.personName;
      },
      /** 员工停岗 */
      stopPosition() {
        this.stop.open = true;
        this.stop.title = "停岗员工："+this.personName;
      },
      /** 员工复岗 */
      recoverPosition() {
        this.stop.open = true;
        this.stop.title = "复岗员工："+this.personName;
      },
      /** 员工查看下级 */
      checkSubordinates() {
        this.viewSubordinates.open = true;
        this.viewSubordinates.title = "直接向"+this.personName+"汇报的员工";
        const personNo = this.currentRow.personNo
        viewPersonSub({'personNo':personNo}).then(response => {
          this.ViewSubordinatesData = response.data
        })
      },
      /** 员工查看上级 */
      checkSuperior() {
        this.viewSuperior.open = true;
        this.viewSuperior.title = this.personName+"的汇报链";
        const personNo = this.currentRow.personNo
        viewPersonSup({'personNo':personNo}).then(response => {
          this.ViewSuperiorData = response.data
        })
      },
      /** 新增员工信息提交按钮 */
      submitForm: function() {
        this.$refs["form"].validate(valid => {
          if (valid){
            addPerson(JSON.stringify(this.form)).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getListPerson();
            });
          }else {
            this.$modal.msgError("表单验证失,败请检查是否输入正确");
          }
        });
      },
      /** 修改员工信息提交按钮 */
      submitFormUpdate: function() {
        this.$refs["updateform"].validate(valid => {
          if (valid){
            updatePerson(JSON.stringify(this.updateform)).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.update.open = false;
              this.getListPerson();
            });
          }else{
            this.$modal.msgError("表单验证失败,请检查是否输入正确");
          }
        });
      },
      /** 调岗或晋升提交按钮 */
      submitFormRedeploy: function() {
        // console.log(this.formRedeploy)
        this.$refs["formRedeploy"].validate(valid => {
          this.formRedeploy.personNo = this.currentRow.personNo
          upOrDownPerson(this.formRedeploy).then(response => {
            this.$modal.msgSuccess("调岗或晋升成功");
            this.redeploy.open = false;
            this.getListPerson();
          });
        });
      },
      /** 员工离职/复职信息提交按钮 */
      submitFormLeave: function() {
        this.$refs["formLeave"].validate(valid => {
          if (valid) {
            const data ={
                "personNo":this.currentRow.personNo,
                "dateTime":this.formLeave.dateTime,
                "status":this.formLeave.status,
                "remark":this.formLeave.remark,
              }
              leavePerson(data).then(response => {
                this.$modal.msgSuccess("离职成功");
                this.leave.open = false;
                this.getListPerson();
              });
          }
        });
      },
      // 字符串转数组方法
    convertStringToArray(str) {
      if (!str) return [] // 处理 null、undefined、空字符串
      if (Array.isArray(str)) return str // 如果已经是数组，直接返回
      return str.split(',').map(item => item.trim()).filter(item => item)
    },
    
    // 数组转字符串方法
    convertArrayToString(arr) {
      if (!arr || !Array.isArray(arr) || arr.length === 0) return ''
      return arr.join(',')
    },
      /** 员工停岗/复岗信息提交按钮 */
      submitFormStop: function() {
        console.log('停岗复岗')
        this.$refs["formStop"].validate(valid => {
          if (valid) {
              const data ={
                "personNo":this.currentRow.personNo,
                "status":this.formStop.status,
                "remark":this.formStop.remark,
              }
              recoverPerson(JSON.stringify(data)).then(response => {
                this.$modal.msgSuccess("复岗成功");
                this.stop.open = false;
                this.getListPerson();
              });
            
          }
        });
      },
    }
  };
</script>


