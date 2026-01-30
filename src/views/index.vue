<template>
  <div class="app-container home">
    <el-row :gutter="20">
      <el-col :span="24">
        <el-carousel :interval="4000" type="card" height="320px">
          <el-carousel-item v-for="item in imges" :key="item.id">
            <img  width="100%" height="100%" :src="item.url">
          </el-carousel-item>
        </el-carousel>
      </el-col>
<!--      <el-col :span="9">-->
<!--        <el-button-->
<!--          size="mini"-->
<!--          icon="el-icon-s-home"-->
<!--          plain-->
<!--          @click="goTarget('https://www.luxshare-ict.com/')"-->
<!--        >立讯官网</el-button>-->
<!--        <el-button-->
<!--          size="mini"-->
<!--          icon="el-icon-view"-->
<!--          plain-->
<!--          @click="goTarget('/screen')"-->
<!--        >产出看板</el-button>-->
<!--        <el-button-->
<!--          size="mini"-->
<!--          icon="el-icon-view"-->
<!--          plain-->
<!--          @click="goTarget('/RidPage')"-->
<!--        >稼动率看板</el-button>-->
<!--        <el-button-->
<!--          size="mini"-->
<!--          icon="el-icon-view"-->
<!--          plain-->
<!--          @click="goTarget('/recordOrder')"-->
<!--        >整套模具进度看板</el-button>-->
<!--        <el-button-->
<!--          size="mini"-->
<!--          icon="el-icon-view"-->
<!--          plain-->
<!--          @click="goTarget('/show')"-->
<!--        >展示看板</el-button>-->
<!--        <el-button-->
<!--          size="mini"-->
<!--          icon="el-icon-view"-->
<!--          plain-->
<!--          @click="goTarget('/screen3')"-->
<!--        >堆叠图</el-button>-->
<!--        <el-button-->
<!--          size="mini"-->
<!--          icon="el-icon-view"-->
<!--          plain-->
<!--          @click="goTarget('/starlogin')"-->
<!--        >星空登录界面</el-button>-->
<!--      </el-col>-->
    </el-row>
    <el-row :gutter="20">
      <el-col :sm="8" :lg="8" style="padding-left: 20px">
        <h2>模具知识</h2>
        <el-card>
          <el-table
            v-loading="loading"
            :data="tableData"
            :max-height="300"
            ref="scrollTable"
            @mouseenter.native="autoScroll(true)"
            @mouseleave.native="autoScroll(false)"
          >
            <el-table-column label="知识内容" align="center" sortable prop="content"/>
          </el-table>
        </el-card>
      </el-col>

      <el-col :sm="16" :lg="16" style="padding-left: 20px">
        <el-row>
          <el-col :span="24">
            <h2>系统消息</h2>
            <el-card>
              <el-table
                v-loading="loading"
                :data="systemProblemList"
                :max-height="300"
                ref="scrollTable2"
                @mouseenter.native="autoScroll2(true)"
                @mouseleave.native="autoScroll2(false)"
              >
                <el-table-column type="index" label="序号" width="50" align="center"/>
                <el-table-column prop="id" label="id编号" align="center" width="80" v-if="false"></el-table-column>
                <el-table-column label="问题点" align="center" sortable width="200" prop="problemPoint"/>
                <el-table-column label="责任单位" align="center" sortable prop="responsibilityUnit"/>
                <el-table-column label="责任人" align="center" sortable width="70" prop="personResponsible"/>
                <el-table-column label="程度" align="center" sortable width="70" prop="degree">
                  <template slot-scope="scope">
                    <el-tag v-if="scope.row.degree =='0'" type="danger">重要</el-tag>
                    <el-tag v-if="scope.row.degree =='1'" type="primary">一般</el-tag>
                    <el-tag v-if="scope.row.degree =='2'" type="warning">中等</el-tag>
                  </template>
                </el-table-column>
                <el-table-column label="录入人员" align="center" sortable prop="createBy"/>
                <el-table-column label="录入时间" align="center" sortable prop="inputTime"/>
                <el-table-column label="改善措施" align="center" sortable width="200" prop="improvementMeasures"/>
                <el-table-column label="状态" align="center" sortable prop="status">
                  <template slot-scope="scope">
                    <el-tag v-if="scope.row.status =='0'" type="danger">未结案</el-tag>
                    <el-tag v-if="scope.row.status =='1'" type="primary">结案</el-tag>
                  </template>
                </el-table-column>
                <el-table-column label="完成时间" align="center" width="80" sortable prop="finishTime"/>
              </el-table>
            </el-card>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <el-divider />

    <el-col>
      <el-row>
        <el-col>
          <h2>更新日志</h2>
          <div class="radio" style="margin-top: 24px;margin-left: 24px">
            排序：
            <el-radio-group v-model="reverse">
              <el-radio :label="true">倒序</el-radio>
              <el-radio :label="false">正序</el-radio>
            </el-radio-group>
          </div>
          <el-timeline :data="data" :reverse="reverse">
            <el-timeline-item style="margin-top: 24px;margin-right: 60px" :timestamp="activity.updateTime" :color="activity.color" v-for="(activity, index) in data" :key="index" placement="top">
              <el-card>
                <h4>{{ activity.content }}</h4>
                <p style="float: right">{{activity.createBy}} 提交于 {{ activity.updateTime }}</p>
              </el-card>
            </el-timeline-item>
          </el-timeline>
        </el-col>
      </el-row>
    </el-col>
  </div>
</template>

<script>
//import { versionPage } from '@/api/system/versionManagement'
import { knowledgePage ,systemPage,versionPage} from '@/api/third/third'
//import { systemPage } from '@/api/system/messageManagement'

export default {
  name: "Index",
  data() {
    return {
      loading: false,
      tableData: [],
      systemProblemList: [],
      scrolltimer: '', // 自动滚动的定时任务
      scrolltimer2: '', // 自动滚动的定时任务
      //走马灯图片
      imges: [
        {url: require("../assets/zoumaimages/1.jpg")},
        {url: require("../assets/zoumaimages/2.jpg")},
        {url: require("../assets/zoumaimages/3.jpg")},
      ],
      // 版本号
      version: "3.8.0",
      reverse: true,
      pageNum: 1,
      pageNumKnowledge: 1,
      pageSize: 1000,
      pageSizeKnowledge: 1000,
      data:[]
    };
  },
  created() {
    this.getList()
    this.getListKnowledge()
    this.getListSystem()
  },
  mounted() {
    this.autoScroll()
    this.autoScroll2()
  },
  beforeDestroy() {
    this.autoScroll(true)
    this.autoScroll2(true)
  },
  methods: {
    goTarget(href) {
      window.open(href, "_blank");
    },
    /** 查询版本内容列表 */
    getList(){
      versionPage({
        pageNum: this.pageNum,
        pageSize: this.pageSize,
      }).then(res => {
        this.data = res.records
      })
    },
    /** 查询知识内容列表 */
    getListKnowledge(){
      knowledgePage({
        pageNum: this.pageNumKnowledge,
        pageSize: this.pageSizeKnowledge,
      }).then(res => {
        this.tableData = res.records
      })
    },
    /** 查询系统问题点列表 */
    getListSystem(){
      let queryParas = {}
      if (this.id !== ''){
        queryParas = {
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          id: this.id,
        }
      } else if (this.id === '') {
        queryParas = {
          pageNum: this.pageNum,
          pageSize: this.pageSize,
        }
      }
      systemPage(queryParas).then(res => {
        this.systemProblemList = res.records
      })
    },
    // 设置自动滚动
    autoScroll(stop) {
      const table = this.$refs.scrollTable
      // 拿到表格中承载数据的div元素
      const divData = table.$refs.bodyWrapper
      // 拿到元素后，对元素进行定时增加距离顶部距离，实现滚动效果(此配置为每100毫秒移动1像素)
      if (stop) {
        //再通过事件监听，监听到 组件销毁 后，再执行关闭计时器。
        window.clearInterval(this.scrolltimer)
      } else {
        this.scrolltimer = window.setInterval(() => {
          // 元素自增距离顶部1像素
          divData.scrollTop += 1
          // 判断元素是否滚动到底部(可视高度+距离顶部=整个高度)
          if (divData.clientHeight + divData.scrollTop + 2 >= divData.scrollHeight) {
            // 重置table距离顶部距离
            divData.scrollTop = 0
            // 重置table距离顶部距离。值=(滚动到底部时，距离顶部的大小) - 整个高度/2
            // divData.scrollTop = divData.scrollTop - divData.scrollHeight / 2
          }
        }, 30) // 滚动速度
      }
    },
    // 设置自动滚动
    autoScroll2(stop) {
      const table = this.$refs.scrollTable2
      // 拿到表格中承载数据的div元素
      const divData = table.$refs.bodyWrapper
      // 拿到元素后，对元素进行定时增加距离顶部距离，实现滚动效果(此配置为每100毫秒移动1像素)
      if (stop) {
        //再通过事件监听，监听到 组件销毁 后，再执行关闭计时器。
        window.clearInterval(this.scrolltimer2)
      } else {
        this.scrolltimer2 = window.setInterval(() => {
          // 元素自增距离顶部1像素
          divData.scrollTop += 1
          // 判断元素是否滚动到底部(可视高度+距离顶部=整个高度)
          if (divData.clientHeight + divData.scrollTop + 2 >= divData.scrollHeight) {
            // 重置table距离顶部距离
            divData.scrollTop = 0
            // 重置table距离顶部距离。值=(滚动到底部时，距离顶部的大小) - 整个高度/2
            // divData.scrollTop = divData.scrollTop - divData.scrollHeight / 2
          }
        }, 30) // 滚动速度
      }
    },
  },
};
</script>

<style scoped lang="scss">
.home {
  blockquote {
    padding: 10px 20px;
    margin: 0 0 20px;
    font-size: 17.5px;
    border-left: 5px solid #eee;
  }
  hr {
    margin-top: 20px;
    margin-bottom: 20px;
    border: 0;
    border-top: 1px solid #eee;
  }
  .col-item {
    margin-bottom: 20px;
  }

  ul {
    padding: 0;
    margin: 0;
  }

  font-family: "open sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 13px;
  color: #676a6c;
  overflow-x: hidden;

  ul {
    list-style-type: none;
  }

  h4 {
    margin-top: 0px;
  }

  h2 {
    margin-top: 10px;
    font-size: 26px;
    font-weight: 100;
  }

  p {
    margin-top: 10px;

    b {
      font-weight: 700;
    }
  }

  .update-log {
    ol {
      display: block;
      list-style-type: decimal;
      margin-block-start: 1em;
      margin-block-end: 1em;
      margin-inline-start: 0;
      margin-inline-end: 0;
      padding-inline-start: 40px;
    }
  }
}
.el-carousel__item h3 {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  line-height: 200px;
  margin: 0;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n+1) {
  background-color: #d3dce6;
}
.el-carousel__indicator--vertical{
  color: #ff0007;
}
.el-carousel__button{
  background-color: rgb(255, 0, 0);
}
</style>

