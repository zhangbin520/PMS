<template>
  <div class="app-container">
    <el-row>
      <el-col :span="24"><h2 class="el-icon-s-order">文件转换记录</h2></el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-table v-loading="loading" :data="filesList">
          <el-table-column type="index" width="50"/>
          <el-table-column label="文件名" align="center" key="fileName" prop="fileName" />
          <el-table-column label="图档格式" align="center" key="fileFormat" prop="fileFormat" />
          <el-table-column label="创建时间" align="center" key="createTime" prop="createTime" />
          <el-table-column align="center" width="160" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-tooltip class="item" effect="dark" content="上传转换" placement="top-start">
                <el-button
                  type="primary"
                  circle
                  icon="el-icon-upload2"
                  @click="handleUploadChange(scope.row)"
                ></el-button>
              </el-tooltip>
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
    </el-row>
  </div>
</template>

<script>
  import { listQuality,addQuality,deleteQuality,getListQuality,updateQuality } from "../../../api/system/quality"
  import {addFiles, delFiles, listFiles, updateFiles} from "../../../api/system/files";
  import {fileConvert, getCamFileConvertPage} from "../../../api/camdesign/fileConversion";

  export default {
    name: "Quality",
    dicts: ['sys_normal_disable','quality_type'],
    data() {
      return {
        // 遮罩层
        loading: true,
        // 总条数
        total: 0,
        // 表格树数据
        filesList: [],
        // 查询参数
        queryParams: {
          pageNo: 1,
          pageSize: 10,
        },
      };
    },
    created() {
      this.getList();
    },
    methods: {
      /** 查询文件格式列表 */
      getList() {
        this.loading = true;
        getCamFileConvertPage(this.queryParams).then(response => {
          this.filesList = response.data.records;
          this.total = response.data.total;
          this.loading = false;
        });
      },
      /** 文件转换按钮 */
      handleUploadChange(row) {
        this.queryParams.id = row.id
        fileConvert(this.queryParams).then(res => {
          this.$modal.msgSuccess("上传转换成功")
          this.getList()
        })
      },

    }
  };
</script>

