<template>
  <div class="app-container">
    <el-table v-loading="loading" :data="electrodeMaterialList">
    <el-table-column type="index"  width="50"/> 
      <!-- <el-table-column label="材质编码" align="center" prop="id" /> -->
      <el-table-column label="物料编码" align="center" prop="materialCode" />
      <el-table-column label="物料名称" align="center" prop="materialName" />
      <el-table-column label="长-宽-高" align="center" >
        <template slot-scope="scope">
          {{scope.row.materialLength}}-{{scope.row.materialWidth}}-{{scope.row.materialHeight}}
        </template>
      </el-table-column>
      <el-table-column label="单位" align="center" prop="materialUnit" />
      <el-table-column label="材质" align="center" prop="texture" />
      <el-table-column label="材质编码" align="center" prop="textureCode" />
      <el-table-column label="密度" align="center" prop="textureDensity" />
      <el-table-column label="重量" align="center" prop="materialWeight" />
      <el-table-column label="数量" align="center" prop="materialNumber" />

      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" fixed="right">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleSelect(scope.row)"
            
          >选择</el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

  </div>
</template>

<script>
import {listElectrodeMaterial} from "@/api/jy/electrodeMaterial";

export default {
  name: "ElectrodeMaterial",
  props:{
    textureCode:String
  },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 总条数
      total: 0,
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        materialCode: null,
        materialName: null,
        materialUnit: null,
        texture: null,
        textureCode: null,
      },
      electrodeMaterialList:[]

    };
  },
  created() {
    this.getList();

  },
  methods: {
    handleSelect(val){
      this.$emit("doSelectMaterial",val)
    },
    /** 查询电极物料列表 */
    getList() {
      this.loading = true;
      listElectrodeMaterial(this.queryParams).then(response => {
        this.electrodeMaterialList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
  },
  watch:{
    textureCode:{
      handler(newVal, oldVal) {
        console.log('oldVal:', oldVal)
        console.log('newVal:', newVal)
        this.getList();
      },
      // 立即处理 进入页面就触发
      // immediate: true,

    }
  }
  
};
</script>
