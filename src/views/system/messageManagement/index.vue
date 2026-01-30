<template>
  <div class="app-container">
    <div slot="header">
      <el-form :model="queryParams" ref="queryForm" v-show="true" :inline="true"  label-width="120px">
        <el-form-item label="id编号" prop="number">
          <el-input
            v-model="id"
            placeholder="请输入编号"
            clearable
            size="small"
            style="width: 160px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="系统问题点" prop="content">
          <el-input
            v-model="problemPoint"
            placeholder="请输入系统问题点"
            clearable
            size="small"
            style="width: 160px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="程度" prop="degree">
          <el-select v-model="degree" filterable placeholder="请选择" clearable style="width: 150px" @change="handleQuery">
            <el-option
              v-for="dict in degreeList"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="status" filterable placeholder="请选择" clearable style="width: 150px" @change="handleQuery">
            <el-option
              v-for="dict in statusList2"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-loading="loading" style="padding-left: 35px">
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-row>
      <el-col :span="24">
        <el-table ref="multipleTable" v-loading="loading" :data="systemProblemList" @selection-change="handleSelectionChange"
                  max-height="750px" border highlight-current-row>
          <el-table-column type="selection" width="50" align="center" />
          <el-table-column type="index" label="序号" width="50" align="center"/>
          <el-table-column prop="id" label="id编号" align="center" width="80"></el-table-column>
          <el-table-column label="问题点" align="center" sortable prop="problemPoint"/>
          <el-table-column label="责任单位" align="center" sortable prop="responsibilityUnit"/>
          <el-table-column label="责任人" align="center" sortable prop="personResponsible"/>
          <el-table-column label="程度" align="center" sortable prop="degree">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.degree =='1'" type="primary">一般</el-tag>
            <el-tag v-if="scope.row.degree =='2'" type="warning">中等</el-tag>
            <el-tag v-if="scope.row.degree =='0'" type="danger">重要</el-tag>
          </template>
          </el-table-column>
          <el-table-column label="录入人员" align="center" sortable prop="createBy"/>
          <el-table-column label="录入时间" align="center" sortable prop="inputTime"/>
          <el-table-column label="改善措施" align="center" sortable prop="improvementMeasures"/>
          <el-table-column label="状态" align="center" sortable prop="status">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.status =='0'" type="danger">未结案</el-tag>
              <el-tag v-if="scope.row.status =='1'" type="primary">结案</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="完成时间" align="center" width="150" sortable prop="finishTime"/>
          <el-table-column label="操作" align="center" width="200" class-name="small-padding">
            <template slot-scope="scope">
              <el-button
                size="mini"
                round
                type="primary"
                icon="el-icon-edit"
                @click="handleUpdate(scope.row)"
              >编辑</el-button>
              <el-popconfirm
                confirm-button-text='确定'
                cancel-button-text='我再想想'
                icon="el-icon-info"
                icon-color="red"
                title="您确定修改状态吗？"
                @confirm="handleDeleteOne(scope.row)"
              >
                <el-button
                  size="mini"
                  round
                  type="danger"
                  icon="el-icon-refresh-left"
                  slot="reference"
                >修改状态</el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <div align="center">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :page-sizes="[5, 10, 15, 20]"
            :page-size="pageSize"
            :current-page="pageNum"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
          </el-pagination>
          <el-row style="margin-top: 30px">
            <el-button
              size="mini"
              round
              type="primary"
              icon="el-icon-check"
              @click="handleAdd"
            >新增问题点记录</el-button>
            <el-popconfirm
              confirm-button-text='确定'
              cancel-button-text='我再想想'
              icon="el-icon-info"
              icon-color="red"
              title="您确定批量修改状态吗？"
              @confirm="handleDelete"
            >
              <el-button
                size="mini"
                round
                style="background-color: #FF8294;color: #ffffff"
                icon="el-icon-delete"
                :disabled="multiple"
                slot="reference"
              >批量修改状态</el-button>
            </el-popconfirm>
          </el-row>
        </div>
      </el-col>
    </el-row>

    <el-dialog title="系统问题点" :visible.sync="dialogFormVisible" width="30%">
      <el-form label-width="110px" size="small">
        <el-form-item label="问题点: ">
          <el-input v-model="form.problemPoint" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="责任单位: ">
          <template slot-scope="scope">
            <el-select v-model="form.responsibilityUnit" filterable placeholder="请选择" style="width: 100%" @change="personDept">
              <el-option
                v-for="dict in deptList"
                :key="dict.id"
                :label="dict.name"
                :value="dict.name"
              ></el-option>
            </el-select>
          </template>
        </el-form-item>
        <el-form-item label="程度: ">
          <el-select v-model="form.degree" filterable placeholder="请选择" style="width: 100%">
            <el-option
              v-for="dict in degreeList"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="责任人: " >
          <el-input v-model="form.personResponsible" autocomplete="off" disabled></el-input>
        </el-form-item>
        <el-form-item label="改善措施: ">
          <el-input v-model="form.improvementMeasures" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="状态: ">
          <el-select v-model="form.status" filterable placeholder="请选择" style="width: 100%">
            <el-option
              v-for="dict in statusList"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="完成时间: ">
          <el-date-picker v-model="form.finishTime" type="date" placeholder="选择日期" value-format="yyyy-MM-dd" style="width: 100%"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveAndUpdate">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { getUserProfile } from '@/api/system/user'
//import messageRequest from '@/utils/messageRequest'
//import { systemPage } from '@/api/system/messageManagement'
import { systemPage,saveContent} from '@/api/third/third'
import { getDept } from '@/api/system/dept'
import { getPerson } from '@/api/system/person'

export default {
  name: 'index',
  data(){
    return{
      // 遮罩层
      loading: true,
      //开始状态
      begin: true,
      //非单个禁用
      single: true,
      //非多个禁用
      multiple: true,
      //总条数
      total: 0,
      //
      dialogFormVisible: false,
      //
      problemPoint: '',
      number: '',
      degree: '',
      createBy: '',
      status: '',
      // 查询参数
      queryParams: {
        pageNo: 1,
        pageSize: 10,
      },
      pageNum: 1,
      pageSize: 10,
      username: '',
      //
      selectionList: [],
      //
      statusList: [
        {
          value: '0',
          label: '未结案'
        },
        {
          value: '1',
          label: '已结案'
        }
      ],
      statusList2: [
        {
          value: '0',
          label: '未结案'
        },
        {
          value: '1',
          label: '已结案'
        }
      ],
      degreeList: [
        {
          value: '0',
          label: '重要'
        },
        {
          value: '2',
          label: '中等'
        },
        {
          value: '1',
          label: '一般'
        }
      ],
      //知识列表
      systemProblemList: [
      ],
      //
      content: '',
      updateTime: '',
      //用户信息
      userName: '',
      personNo: '',
      deptName: '',
      //
      deptList: [],
      //
      id: '',
      //
      Ids: [],
      form:{

      },
    }
  },

  created() {
    this.getList();
    this.getListUser()
    this.getSysDept()
  },

  methods:{
    /** 查询系统问题点列表 */
    getList(){
      let queryParas = {}
      this.loading = true
      setTimeout(()=>{
        this.loading = false
      },3000)

      if (this.id !== ''){
        queryParas = {
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          problemPoint: this.problemPoint,
          id: this.id,
          degree: this.degree,
          status: this.status
        }
      } else if (this.id === ''){
        queryParas = {
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          problemPoint: this.problemPoint,
          degree: this.degree,
          status: this.status
        }
      }
      systemPage(queryParas).then(res => {
        this.loading = false
        this.total = res.total
        this.systemProblemList = res.records
        // for (let i = 0;i < res.records.length;i++){
        //
        // }
      })
    },

    getSysDept(){
      getDept().then(res =>{
        this.deptList = res.data.map(value => ({name: value.name, personCode: value.personCode, id: value.id}));
      })
    },

    personDept(){
      let value = ''
      for (let i = 0;i < this.deptList.length;i++){
        console.log(this.deptList[i].name)
        console.log(this.form.responsibilityUnit)
        if (this.deptList[i].name === this.form.responsibilityUnit){
          value = this.deptList[i].personCode
          break
        }
      }
      if(value === ''){
        this.$set(this.form,"personResponsible",'')
      } else {
        getPerson({'personNo': value}).then(res => {
          this.$set(this.form,"personResponsible",res.data.name)
        })
      }
    },

    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNo = 1;
      this.getList()
    },

    /** 增加修改系统问题点 */
    handleAdd(){
      this.dialogFormVisible = true
      this.form = {
        createBy: this.personNo
      }
    },

    /** 批量修改系统问题点内容状态 */
    handleDelete(){
      let flag = false

      for (let i = 0;i < this.selectionList.length; i++){
        if (flag === true){
          break
        }
        this.form = this.selectionList[i]
        this.form.status = 1
        saveContent(this.form).then(
          res => {
            if (res){
              flag = false
            } else {
              flag = true
            }
          }
        )
        /* messageRequest.post("/system/saveContent",this.form).then(
          res => {
            if (res){
              flag = false
            } else {
              flag = true
            }
          }
        ) */
      }

      if(flag === true){
        this.$message.error("批量修改状态失败")
      } else if (flag === false) {
        this.$message.success("批量修改状态成功")
      }

      this.getList()
      // messageRequest.post("/system/del/batch",this.Ids).then(
      //   res => {
      //     if (res){
      //       this.$message.success("批量删除成功")
      //       this.getList()
      //     } else {
      //       this.$message.error("批量删除失败")
      //     }
      //   }
      // )
    },

    /** 更新系统问题点内容 */
    handleUpdate(row){
      this.form = {...row}
      this.dialogFormVisible = true
    },

    handleDeleteOne(row){
      this.form = {...row}
      this.form.status = '1'
      console.log(this.form)
      messageRequest.post("/system/saveContent",this.form).then(
        res => {
          if (res){
            this.$message.success("保存成功")
            this.dialogFormVisible = false
            this.getList()
          } else {
            this.$message.error("保存失败")
          }
        }
      )
      // messageRequest.delete("/system/" + id).then(
      //   res => {
      //     if (res){
      //       this.$message.success("删除成功")
      //       this.getList()
      //     } else {
      //       this.$message.error("删除失败")
      //     }
      //   }
      // )
    },

    saveAndUpdate(){
      messageRequest.post("/system/saveContent",this.form).then(
        res => {
          if (res){
            this.$message.success("保存成功")
            this.dialogFormVisible = false
            this.getList()
          } else {
            this.$message.error("保存失败")
          }
        }
      )
    },

    handleSizeChange(pageSize){
      this.pageSize = pageSize
      this.getList()
    },

    handleCurrentChange(pageNum){
      this.pageNum = pageNum
      this.getList()
    },

    // 多选框选中数据
    handleSelectionChange(selection) {
      this.selectionList = selection
      this.Ids = selection.map(value => value.id)
      this.multiple = !selection.length;
    },

    /** 查询登录用户信息*/
    getListUser() {
      getUserProfile().then(response => {
        this.userName = response.data.nickName
        this.personNo = response.data.userName
        this.deptName = response.data.dept.name
      })
    },

    /** 表格数据增加index */
    tableRowClassName({ row, rowIndex }) {
      //把每一行的索引放进row
      row.index = rowIndex
    },

  }
}
</script>

<style scoped>

</style>
