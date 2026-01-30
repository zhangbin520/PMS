<template>
  <div class="app-container">
    <div slot="header">
      <el-form :model="queryParams" ref="queryForm" v-show="true" :inline="true"  label-width="120px">
        <el-form-item label="看板名称" prop="orderDate">
          <el-input
            v-model="content"
            placeholder="请输入看板名称"
            clearable
            size="small"
            style="width: 220px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item v-loading="loading" style="padding-left: 35px">
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-row>
      <el-col :span="24">
        <el-table ref="multipleTable" v-loading="loading" :data="bannerList" @selection-change="handleSelectionChange"
                  max-height="750px" border highlight-current-row>
          <el-table-column type="selection" width="50" align="center" />
          <el-table-column type="index" label="序号" width="50" align="center"/>
          <el-table-column prop="id" label="id" align="center" width="80" v-if="false"></el-table-column>
          <el-table-column label="看板名称" align="center" sortable prop="content"/>
          <el-table-column label="url" align="center" sortable prop="url"/>
          <el-table-column label="操作" align="center" width="300" class-name="small-padding">
            <template slot-scope="scope">
              <el-button
                size="mini"
                round
                type="primary"
                icon="el-icon-view"
                @click="goTarget(scope.row.url)"
              >跳转</el-button>
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
                title="您确定删除吗？"
                @confirm="handleDeleteOne(scope.row.id)"
              >
                <el-button
                  size="mini"
                  round
                  type="danger"
                  icon="el-icon-delete"
                  slot="reference"
                >删除</el-button>
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
            >新增看板</el-button>
            <el-popconfirm
              confirm-button-text='确定'
              cancel-button-text='我再想想'
              icon="el-icon-info"
              icon-color="red"
              title="您确定删除吗？"
              @confirm="handleDelete"
            >
              <el-button
                size="mini"
                round
                style="background-color: #FF8294;color: #ffffff"
                icon="el-icon-delete"
                :disabled="multiple"
                slot="reference"
              >批量删除</el-button>
            </el-popconfirm>
          </el-row>
        </div>
      </el-col>
    </el-row>


    <el-dialog title="看板" :visible.sync="dialogFormVisible" width="30%">
      <el-form label-width="110px" size="small">
        <el-form-item label="看板名称: ">
          <el-input v-model="form.content" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="看板url: ">
          <el-input v-model="form.url" autocomplete="off"></el-input>
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
import { delSysBanner,saveContent,bannerPage } from '@/api/banner/banner'

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
      // 查询参数
      queryParams: {
        pageNo: 1,
        pageSize: 10,
      },
      pageNum: 1,
      pageSize: 10,
      username: '',
      //知识列表
      bannerList: [
      ],
      //
      content: '',
      updateTime: '',
      //用户信息
      userName: '',
      personNo: '',
      deptName: '',
      //
      Ids: [],
      form:{

      },
    }
  },

  created() {
    this.getList();
    this.getListUser()
  },

  methods:{
    /** 查询看板列表 */
    getList(){
      this.loading = true
      setTimeout(()=>{
        this.loading = false
      },3000)
      bannerPage({
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        content: this.content
      }).then(res => {
        this.loading = false
        this.total = res.total
        this.bannerList = res.records
      })
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNo = 1;
      this.getList()
    },

    /** 增加修改看板 */
    handleAdd(){
      this.dialogFormVisible = true
      this.form = {
        createBy: this.personNo
      }
    },

    /** 批量删除看板 */
    handleDelete(){
      // deleteVersionRecord()
      bannerJs("/banner/del/batch",this.Ids).then(
        res => {
          if (res){
            this.$message.success("批量删除成功")
            this.getList()
          } else {
            this.$message.error("批量删除失败")
          }
        }
      )
    },

    /** 更新看板内容 */
    handleUpdate(row){
      this.form = {...row}
      console.log(this.form)
      this.dialogFormVisible = true
    },

    handleDeleteOne(id){
      delSysBanner( id).then(
        res => {
          if (res){
            this.$message.success("删除成功")
            this.getList()
          } else {
            this.$message.error("删除失败")
          }
        }
      )
    },

    saveAndUpdate(){
      saveContent(this.form).then(
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
      // saveVersion(this.form).then(res => {
      //     if (res){
      //       this.$message.success("保存成功")
      //       this.dialogFormVisible = false
      //       this.getList()
      //     } else {
      //       this.$message.error("保存失败")
      //     }
      //   }
      // )
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
      this.Ids = selection.map(value => value.id) // [{},{}]  =>  [1, 2]
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

    goTarget(href) {
      window.open(href, "_blank");
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
