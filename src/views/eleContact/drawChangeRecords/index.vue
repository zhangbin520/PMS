<template>
  <div class="app-container">
    <!-- 搜索栏 -->
    <el-card>
      <el-form :model="queryParams" ref="queryForm" v-show="showSearch" :inline="true">
        <el-form-item label="生产单号：" prop="prodOrderNo">
          <el-input
            v-model="queryParams.orderNo"
            placeholder="请输入生产单号"
            clearable
            size="small"
            style="width: 220px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" style="margin-left: 10px" @click="handleQuery">搜索</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card>

      <!-- 表格 -->
      <el-table :data="drawChangeData" border style="margin-top: 10px">
        <el-table-column type="index" width="50" align="center"/>
        <el-table-column label="生产单号" prop="orderNo" align="center"></el-table-column>
        <el-table-column label="文件名" prop="fileName" width="120" align="center"/>
        <el-table-column label="操作行为" prop="opStatus" align="center">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.opStatus === '0'" type="success">上传</el-tag>
            <el-tag v-if="scope.row.opStatus === '1'" type="danger">删除</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作人" prop="createBy" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.createBy}} - {{scope.row.createName}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作时间" prop="createTime" align="center"/>
        <el-table-column label="" align="center">
          <template slot-scope="scope">
            <el-button
              type="primary"
              circle
              icon="el-icon-folder-opened"
              @click="handleSeeDrawing(scope.row)"
            />
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
    </el-card>
  </div>
</template>
<script>
  import {getOrderBomDrawHisPage} from "../../../api/eleContact/drawChangeRecords";
  import { Base64  } from 'js-base64';
  import global from '../../../store/global.js';
  import downloadGlobal from '@/store/downloadGlobal'

  export default {
    name: "DrawChangeRecords",
    data() {
      return {
        // 总条数
        total: 0,
        // 显示搜索条件
        showSearch: true,
        // 图档变更记录表格数据
        drawChangeData: [],
        // 非单个禁用
        single: true,
        // 非多个禁用
        multiple: true,
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
      /** 分页查询图档变更记录 */
      getList() {
        this.loading = true;
        getOrderBomDrawHisPage(this.queryParams).then(response => {
          this.drawChangeData = response.data.records;
          this.total = response.data.total;
          this.loading = false;
        });
      },
      /** 搜索按钮操作 */
      handleQuery() {
        this.queryParams.pageNo = 1;
        this.getList();
      },
      // 提取文件后缀名
      getSuffix(str) {
        const fileExtension = str.substring(str.lastIndexOf(".") + 1);
        return fileExtension;
      },
      /** 查看图档 */
      handleSeeDrawing(row,i) {
        let suffix = this.getSuffix(row.url)
        if(suffix === 'prt' || suffix === 'dwg' || suffix === 'svlx' || suffix === 'vsf'){
          if(suffix === 'prt'){
            const url = downloadGlobal.hostUpload + row.url + '.svlx'
            // const url = global.hostUpload + row.url + '.svlx'
            this.$router.push({
              path:'/camdesign/programme-edit/alreadyCancel',
              query:{
                url: url,
                dispatchOrderNo: row.dispatchOrderNo,
                prodOrderNo: row.prodOrderNo,
                bomId:row.bomId,
                type: i
              },
            });
          }else if(suffix === 'dwg'){
            const url = downloadGlobal.hostUpload + row.url + '.vsf'
            // const url = global.hostUpload + row.url + '.vsf'
            this.$router.push({
              path:'/camdesign/programme-edit/alreadyStop',
              query:{
                url: url,
                dispatchOrderNo: row.dispatchOrderNo,
                prodOrderNo: row.prodOrderNo,
                bomId:row.bomId,
                type: i
              },
            });
          }
        }else if(suffix === 'stp' || suffix === 'step'){
          const url = downloadGlobal.hostUpload + row.url
          // const url = downloadGlobal.hostUpload + "/draw/H719888/123/123.stp"
          // window.open('http://127.0.0.1:8012/onlinePreview?url='+encodeURIComponent(Base64.encode(url)))
          window.open(downloadGlobal.hostWatch + '/onlinePreview?url='+encodeURIComponent(Base64.encode(url)))
        } else {
          const url = downloadGlobal.hostUpload + row.url
          // const url = global.hostUpload + row.url
          //alert('http://127.0.0.1:8012/onlinePreview?url='+encodeURIComponent(Base64.encode(url)))
          // window.open('http://127.0.0.1:8012/onlinePreview?url='+encodeURIComponent(Base64.encode(url)));
          // window.open('http://127.0.0.1:8012/onlinePreview?url='+encodeURIComponent(Base64.encode(url)));
          window.open(downloadGlobal.hostWatch + '/onlinePreview?url='+encodeURIComponent(Base64.encode(url)));
          // window.open(global.hostWatch + '/onlinePreview?url='+encodeURIComponent(Base64.encode(url)));
        }
      },
    }
  }
</script>
