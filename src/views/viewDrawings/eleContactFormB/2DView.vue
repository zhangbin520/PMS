<template>
  <div class="app-container">
    <div class="publicMark-container" v-if="type === '0'" >
      <el-descriptions title="生产信息" v-show="showSearch">
        <el-descriptions-item label="派工单号">{{dispatchOrderNo}}</el-descriptions-item>
      </el-descriptions>
      <el-button icon="el-icon-magic-stick" circle @click="handleControl" style="float: right"></el-button>
    </div>
    <div class="privateMark-container" v-if="type === '1'" >
      <el-descriptions title="生产信息" v-show="showSearch">
        <el-descriptions-item label="派工单号">{{dispatchOrderNo}}</el-descriptions-item>
        <el-descriptions-item label="模号">{{moduleNo}}</el-descriptions-item>
        <el-descriptions-item label="件号">{{pieceNo}}</el-descriptions-item>
        <el-descriptions-item label="数量">{{quantity}}</el-descriptions-item>
        <el-descriptions-item label="打标">{{marking}}</el-descriptions-item>
        <el-descriptions-item label="生产单号">{{prodOrderNo}}</el-descriptions-item>
        <el-descriptions-item label="材质">{{material}}</el-descriptions-item>
      </el-descriptions>
      <el-button icon="el-icon-magic-stick" circle @click="handleControl" style="float: right"></el-button>
    </div>
    <iframe @load="loaded" ref="vueIframe" src="/static/2DView/test.html" frameborder="0" style="width: 100%;height:89vh"></iframe>
  </div>
</template>

<script>

  import {listBomDetail} from "../../../api/order/orderbom";

  export default {
    name: "alreadyCancel",
    dicts: ['sys_normal_disable'],
    data() {
      return {
        url:'',
        //生产信息参数
        dispatchOrderNo:'',
        type:'',
        prodOrderNo:'',
        bomId:'',
        //生产信息选中数据
        moduleNo:'',
        pieceNo:'',
        quantity:'',
        marking:'',
        material:'',
        // 显示
        showSearch: true,
        // 查询参数
        queryParams: {
          pageNo: 1,
          pageSize: 10,
        },
      };
    },
    created() {
      this.getListDetail()
    },
    mounted() {
      this.url = this.$route.query.url
      this.dispatchOrderNo = this.$route.query.dispatchOrderNo
      this.type = this.$route.query.type
      this.prodOrderNo = this.$route.query.prodOrderNo
      this.bomId = this.$route.query.bomId
      this.iframeWin = this.$refs.vueIframe.contentWindow;
      console.log(this.url)
    },
    methods: {
      /** 分页查询BOM明细列表 */
      getListDetail() {
        this.queryParams.prodOrderNo = this.$route.query.prodOrderNo
        this.queryParams.bomId = this.$route.query.bomId
        listBomDetail(this.queryParams).then(response => {
          this.moduleNo = response.data.records[0].moduleNo
          this.pieceNo = response.data.records[0].pieceNo
          this.quantity = response.data.records[0].quantity
          this.marking = response.data.records[0].marking
          this.material = response.data.records[0].material
        });
      },
      /** 获取图档路径 */
      loaded() {
        this.iframeWin.postMessage(this.url,'*');
      },
      /** 控制元素得显示和隐藏 */
      handleControl() {
        this.showSearch = !this.showSearch;
      }
    }
  };
</script>

