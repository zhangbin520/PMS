<template>
  <div class="screen-container">
    <header class="screen-header">
      <div>
        <img src="/static/img/header_border_dark.png" alt="">
      </div>
      <span class="title">RiD模具中心</span>
      <div class="title-right">
        <span class="datetime">{{ time }}</span>
      </div>
    </header>
    <div class="screen-body">
      <el-carousel class="carousel" :interval="changeTime" height="1200px">
        <el-carousel-item v-for="(item,index) of imges" :key="index" >
          <img id="img" :src="urlConnect(item)" @click="deletepic(index)" width="100%" height="100%">
        </el-carousel-item>
      </el-carousel>
      <div class="button">
      <el-button class="button1" size="medium" @click="uploadpic">
        上传图片
      </el-button>
        轮播间隔（ms）:
      <el-input class="inputdisplay" v-model="changeTime" placeholder="轮播间隔时间"></el-input>
      </div>
    </div>
    <!-- 上传图片对话框 -->
    <el-dialog class="uploadpic" v-dialog-drag :title="files.title" :visible.sync="files.open" width="400px" append-to-body>
      <el-row >
        <el-col>
          <el-upload
            class="pop-upload"
            ref="upload"
            action=""
            :file-list="fileList"
            :auto-upload="false"
            :multiple="true"
            :on-change="handleChange"
            :on-remove="handleRemove"
            multiple
            :limit="5"
            accept="image/jpeg,image/jpg,image/gif,image/png"
          >
            <el-button style="margin-left:80px;margin-right: 30px" slot="trigger" size="small" type="primary">选取文件</el-button>
            <el-button style="text-align: center;margin: 0 auto" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
          </el-upload>
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button @click="files.open = false" type="danger" style="margin-right: 40%">关 闭</el-button>
      </div>
    </el-dialog>
    <!-- 删除图片对话框 -->
    <el-dialog class="delPic" v-dialog-drag :title="delfiles.title" :visible.sync="delfiles.open" width="400px" append-to-body>
      <div >
        <el-button @click="deletePic" type="success" style="margin-left: 32%;">确认删除图片</el-button>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="delfiles.open = false" type="danger" style="margin-right: 40%">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import moment from 'moment'
import { delSysBanner, getSysBannerList, uploadSysBanner } from '@/api/banner/banner'
import global from "../../../store/global";

export default {
  name: 'index',
  data(){
    return {
      time: null,
      imges: [],
      //图片表单参数
      files: {
        // 是否显示弹出层
        open: false,
        // 弹出层标题
        title: "",
      },
      //删除图片表单
      delfiles: {
        // 是否显示弹出层
        open: false,
        // 弹出层标题
        title: "",
      },
      fileList: [],
      bannerIds:[],
      bannerId:'',
      changeTime:3000,
      relativePath:[],
      hostUploading:''
    }
  },
  created() {
    this.getBannerList()
    this.hostUploading = global.hostUpload
  },
  mounted() {
    this.getDate();

  },
  methods:{
    getDate () {
      setInterval(() => {
        this.time = moment().format('yyyy-MM-DD HH:mm:ss')
      }, 1000)
    },
    /**查看Banner列表*/
    getBannerList(){
      getSysBannerList().then(res=>{
         // this.imges = res.data.map(o=>{return[o.url].toString()})
        this.imges = res.data.map(o=>{return[o.relativePath].toString()})
        this.bannerIds = res.data.map(o=>{return[o.id].toString()})
       // console.log(res.data.map(o=>{return[o.url].toString()}))
        }
      )
    },
    uploadpic(){
      this.files.title = "上传图片 ";
      this.files.open = true;
    },
    submitUpload(){
      //判断是否有文件再上传
      if (this.fileList.length === 0) {
        return this.$message.warning('请选取文件后再上传')
      }
      // 下面的代码将创建一个空的FormData对象:
      const formData = new FormData()
      // 你可以使用FormData.append来添加键/值对到表单里面；
      this.fileList.forEach((file) => {
        formData.append('fileList', file.raw)
      })

      //自定义的接口也可以用ajax或者自己封装的接口
      uploadSysBanner(formData).then(res => {
        if (res.code === 200) {
          this.$message.success('上传成功');
          this.files.open = false;
          this.getBannerList();
        } else {
          this.$message.error('上传失败');
        }
        //清空fileList
        this.fileList = []
      })
    },
    /** 图片上传 */
    // 文件状态改变时的钩子，添加文件、上传成功和上传失败时都会被调用,function(file, fileList)
    handleChange(file, fileList) {
      this.fileList = fileList
    },
    // 删除文件之前的钩子，参数为上传的文件和文件列表，若返回 false 或者返回 Promise 且被 reject，则停止删除。function(file, fileList)
    handleRemove(file, fileList) {
      this.fileList = fileList
    },
    /**删除图片*/
    deletepic(index){
      this.bannerId = this.bannerIds[index]
      console.log(this.bannerId)
      this.delfiles.title = "删除图片"
      this.delfiles.open = true
    },
    deletePic(){
      const a = this.bannerId
      delSysBanner({'id':a}).then(
      )
      setTimeout(()=>{
        location.reload()
      },1000)
    },
    urlConnect(item){
      console.log(this.hostUploading)
      return this.hostUploading + item
    }
  },
}
</script>

<style lang="scss" scoped>
/*全屏样式的定义*/
.fullscreen {
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  width: 100% !important;
  height: 100% !important;
  margin: 0 !important;
  z-index: 100;
}

.screen-container {
  width: 100%;
  padding: 0 20px;
  background-color: rgba(3, 60, 118);
  color: #fff;
  box-sizing: border-box;
}

.screen-header {
  width: 100%;
  height: 64px;
  font-size: 20px;
  position: relative;

  > div {
    img {
      width: 100%;
    }
  }

  .title {
    position: absolute;
    left: 50%;
    top: 50%;
    font-size: 20px;
    transform: translate(-50%, -50%);
  }

  .title-right {
    display: flex;
    align-items: center;
    position: absolute;
    right: 0px;
    top: 50%;
    transform: translateY(-80%);
  }

  .datetime {
    font-size: 15px;
    margin-left: 10px;
  }
}
.screen-body{
  margin-top: 50px;
}
#img {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  /* 项目在主轴对齐方式为居中 */
  justify-content: center;
  /* 项目在交叉轴对齐方式为居中 */
  align-items: center;
  align-content: center;
}
.button{
  text-align: center;
  font-size: 20px;
  margin-top: 50px;
}
.inputdisplay{

  display: inline-flex;
  font-size: 18px;
  width: 80px;
  height: 80px;
}
.uploadpic,.delPic{
  /* 使用 flex 布局 */
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  /* 项目在主轴对齐方式为居中 */
  justify-content: center;
  /* 项目在交叉轴对齐方式为居中 */
  align-items: center;
  align-content: center;
}
.el-carousel__item:nth-child(2n) {
  background-color: #fff;
}

.el-carousel__item:nth-child(2n+1) {
  background-color:rgba(255,255,255,0);

}
.button1{
  width: 120px;
  height: 40px;
  font-size: 18px;
  margin-right: 20px;
}
</style>
