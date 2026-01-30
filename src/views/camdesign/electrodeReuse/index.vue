<template>
  <div class="app-container">
    <div slot="header">
    </div>
    <el-row >
      <el-col :span="24" v-show="showPage">
        <div class="link-type">
          <div class="dv-content" style="height: 55px;">
            <div class="order-info">
              <div class="info-row">
                <span class="label">选择的工单:</span>
                <span class="value">{{selectProdOrderNo}}</span>
              </div>
              <div class="info-row">
                <span class="label">工序:</span>
                <span class="value">{{selectSort}}</span>
                <span class="label">工段:</span>
                <span class="value">{{selectCode}}</span>
              </div>
            </div>

            <div class="order-info-button-container">
              <div class="order-info">
                <div class="info-row">
                  <span class="label">要复制的工单:</span>
                  <span class="value">{{copyProdOrderNo}}</span>
                </div>
                <div class="info-row">
                  <span class="label">工序:</span>
                  <span class="value">{{copySort}}</span>
                  <span class="label">工序:</span>
                  <span class="value">{{copyCode}}</span>
                </div>
              </div>
              <div class="dv-button">
                <el-button type="primary" icon="el-icon-s-tools" size="mini" @click="copyUsed">确定复用</el-button>
              </div>
            </div>
          </div>
        </div>


      </el-col>
      <el-col :span="12">
        <el-form :model="queryParams" ref="queryForm" v-show="showSearch" :inline="true" label-width="100px">
        <el-form-item label="工件生产单号" prop="prodOrderNo">
          <el-input
            v-model="queryParams.prodOrderNo"
            placeholder="请输入工件生产单号"
            clearable
            size="small"
            style="width: 220px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>

        <el-form-item style="padding-left: 55px">
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        </el-form-item>
      </el-form>

        <el-table v-loading="loading" :data="changeOrderList" :row-class-name="tableRowClassName"  @selection-change="handleSelectionChange" border
                  max-height="850px" highlight-current-row>
          <!-- <el-table-column  type="selection" align="center" :selectable="selected"  /> -->
          <el-table-column type="index" width="50" align="center" />
          <el-table-column label="生产单号" prop="prodOrderNo" align="center" width="150" :selectable="selected"/>
          <el-table-column label="工序" prop="sort"  width="60" align="center" />
          <el-table-column label="工序名称" prop="name" align="center" width="100" />
          <el-table-column label="工段" prop="code"  width="60" align="center" />
          <el-table-column label="电极" prop="electrodes" width="190" align="center" />
          <el-table-column label="操作" align="center" width="100px" >
            <template slot-scope="scope">
              <!-- <el-tooltip class="item" effect="dark" placement="top-start" ></el-tooltip> -->
                <el-button circle type="primary"  @click="handleWatchOld(scope.row)">选择</el-button>
              
            </template>
          </el-table-column>
        </el-table>

      </el-col>
      <el-col :span="12">
      <el-form :model="querySecondParams" ref="querySecondForm" v-show="showSearch" :inline="true" label-width="100px">
        <el-form-item label="工件生产单号" prop="workpieceProdOrderNo">
          <el-input
            v-model="querySecondParams.workpieceProdOrderNo"
            placeholder="请输入工件生产单号"
            clearable
            size="small"
            style="width: 220px"
          />
        </el-form-item>

        <el-form-item style="padding-left: 55px">
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQueryTwo">搜索</el-button>
        </el-form-item>
      </el-form>

        <el-table v-loading="newloading" :data="newChangeOrderList" @selection-change="handleSelectionChange" border
                  max-height="850px" highlight-current-row>
          <el-table-column type="index" width="50" align="center" />
          <el-table-column label="生产单号" prop="prodOrderNo" align="center" width="150" :selectable="selected"/>
          <el-table-column label="工序" prop="sort"  width="60" align="center" />
          <el-table-column label="工序名称" prop="name" align="center" width="100" />
          <el-table-column label="工段" prop="code"  width="60" align="center" />
          <el-table-column label="电极" prop="electrodes" width="190" align="center" />
          <el-table-column label="操作" align="center" width="100px" >
            <template slot-scope="scope">
              <!-- <el-tooltip class="item" effect="dark" placement="top-start" ></el-tooltip> icon="el-icon-view"  -->
                <el-button circle type="primary" @click="handleWatchNew(scope.row)">选择</el-button>
              
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>

    <!-- 复用工序对话框 -->
    <el-dialog :title="craftTitle" :visible.sync="craftOpen" width="1400px"  append-to-body>
      <el-form ref="form" :model="craftForm"  :inline="true" >
        <el-row :span="18">
          <el-col :span="6">
              <el-form-item label="原生产单：" prop="selectProdOrderNo">
                  {{ queryDataParams.selectProdOrderNo }} 
              </el-form-item>
          </el-col>
          <el-col :span="6">
              <el-form-item label="工序：" prop="selectSort">
                 {{ queryDataParams.selectSort }}
              </el-form-item>
              
          </el-col>
          <el-col :span="6">
              <el-form-item label="工段：" prop="selectCode">
                 {{ queryDataParams.selectCode }}
              </el-form-item>
              
          </el-col>
        </el-row>
        <el-row :span="18">
          <el-col :span="6">
              <el-form-item label="复用生产单：" prop="copyProdOrderNo">
                {{ queryDataParams.copyProdOrderNo }}
              </el-form-item>
          </el-col>
          <el-col :span="6">
              <el-form-item label="工序：" prop="copySort">
                {{ queryDataParams.copySort }}
              </el-form-item>
          </el-col>
          <el-col :span="6">
              <el-form-item label="工段：" prop="copyCode">
                {{ queryDataParams.copyCode }}
              </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <!-- <el-table   :data="reuseElctrodeBomList" @selection-change="handleSelectionChange" border
                  max-height="850px" highlight-current-row>
          <el-table-column type="index" width="50" align="center" />
          <el-table-column label="电极生产单号" prop="electrodeProdOrderNo" align="center" width="150" />
          <el-table-column label="电极序号" prop="electrodeNo"  width="60" align="center" />
          <el-table-column label="RFID" prop="rfid" align="center" width="100" />
      </el-table> -->
      <div class="add-group-member" style="display: none;" v-show="groupMember" >
			<div class="left-box">
        <div class="tip" style="height: 40px;line-height: 40px;"> </div>
				<!-- <div class="search">
					<el-input placeholder="搜索好友" v-model="searchText" size="small">
						<i class="el-icon-search el-input__icon" slot="suffix"> </i>
					</el-input>
				</div> -->
				<el-scrollbar style="height:400px;">
          <!-- <el-table   :data="reuseElctrodeBomList" @selection-change="handleSelectionChange" border
                  max-height="250px" highlight-current-row>
          <el-table-column type="index" width="50" align="center" />
          <el-table-column label="电极生产单号" prop="electrodeProdOrderNo" align="center" width="150" />
          <el-table-column label="电极序号" prop="electrodeNo"  width="60" align="center" />
          <el-table-column label="RFID" prop="rfid" align="center" width="100" />
        </el-table>  -->
					<div v-for="friend in friends" :key="friend.id">
						<friend-item v-show="friend.electrodeProdOrderNo.includes(searchText)" :showDelete="false"
							 :menu="false" :friend="friend" :active="false">
							<el-checkbox :disabled="friend.disabled" @click.native.stop="" class="checkbox"
								v-model="friend.isCheck" size="medium"></el-checkbox>
						</friend-item>
					</div>
				</el-scrollbar>
			</div>
			<div class="arrow el-icon-d-arrow-right"></div>
			<div class="right-box">
				<div class="tip"> 已勾选{{ checkCount }}个电极</div>
				<el-scrollbar style="height:400px;">
					<div v-for="friend in friends" :key="friend.id">
						<friend-item v-if="friend.isCheck && !friend.disabled" :friend="friend" :active="false"
							@del="onRemoveFriend(friend)" :menu="false">
						</friend-item>
					</div>
				</el-scrollbar>
			</div>
		</div>
		<span slot="footer" class="dialog-footer">
			<el-button @click="cancel()">取 消</el-button>
			<el-button type="primary" @click="onOk()">确 定</el-button>
		</span>
    </el-dialog>

  </div>
</template>

<script>
  import {reuseElectrodeData, selectChangeOrderList, getElectrodeBomlist, deleteElectrodeBom,
    checkAllMultiplexedElectrodeData,alreadyCancel} from "../../../api/camdesign/electrode"
  import {getToken} from "../../../utils/auth";

'@/views/monitor/job/log'
  import FriendItem from '@/views/camdesign/electrodeReuse/FriendItem.vue';
  export default {
    name: "ElectrodeReuse",
    dicts: ['sys_normal_disable','electrode_type'],
    components: {
      FriendItem
    },
    filters: {
      keepTwoNum(value) {
        value = Number(value);
        return value.toFixed(2)
      },
    },
    data() {
      return {
        // 遮罩层
        loading: false,
        newloading: false,
        orderTask: false,
        // 总条数
        total: 0,
        totalProcess:0,
        // 是否显示
        showPage: false,
        groupMember: false,
        // 显示搜索条件
        showSearch: true,
        // 变更单数据
        changeOrderList: [],
        newChangeOrderList: [],
        // 弹出层标题
        craftTitle: "",
        // 是否显示弹出层
        craftOpen: false,
        // 订单BOM表单参数
        form: {},
        querySecondForm: {},
        //电极bom材质数据
        eleorderForquality:[],
        //选中数组
        ProcessManHourId:[],
        code:[],
        BizType:[],
        ProcessManName:[],
        queryDataParams:{},
        Ids:[],
        //编辑表格传参
        Id:[],
        ElectrodeProdOrderNo:[],
        reuseElctrodeBomList:[],
        //工艺列表数据
        process:{
          title:'',
          open:false,
        },
        selectTaskNo: '',
        selectProdOrderNo:'',
        selectCode:'',
        selectSort:'',
        copyTaskNo:'',
        copyProdOrderNo:'',
        copyCode:'',
        copySort:'',
        dispatchOrderNo:'',
        prodHisOrderNo:'',
        //电极3D图档表单数据
        formElectrode:{},
        processData:[],
        //工件工艺列表选择数据
        prodOrderNo:'',
        processSort:'',
        //电极3D图档弹窗
        electrode:{
          title:'',
          open:false,
        },
        // 文件上传
        searchText: "",
        //上传文件类型名数据
        friends:[],
        //上传下载新ip增加参数
        personNo: '',
        craftForm: {},
        // 查询参数
        queryParams: {
          pageNo: 1,
          pageSize: 10,
        },
        // 工艺列表查询参数
        querySecondParams: {
          pageNo: 1,
          pageSize: 10,
          prodOrderNo:'',
        },

        // 查询参数
        queryParamsUse: {
          pageNo: 1,
          pageSize: 100000,
        },

        //电极BOM表单校验
        rules: {
          electrodeMaterial: [
            { required: true, message: "电极材质不能为空", trigger: "blur" },
            { min: 2, max: 10, message: '电极材质长度必须介于 2 和 10 之间', trigger: 'blur' }
          ],
         
        },
      };
    },
    created(){
    },
    computed: {
      checkCount() {
        return this.friends.filter((f) => f.isCheck && !f.disabled).length;
      }
	  },
    props: {
      groupId: {
        type: Number
      },
      members: {
          type: Array
        }
    },
    methods: {
      /** 分页查询BOM明细列表 */
      getChangeOrderList() {
        this.loading = true;
        selectChangeOrderList(this.queryParams).then(response => {
          const list = response.data;
          this.changeOrderList = list;
        })
        this.loading = false;
      },

      getChangeOrderListTwo() {
        this.newloading = true;
        this.queryParams.isBg = '1';
        selectChangeOrderList(this.querySecondParams).then(response => {
          const list = response.data;
          this.newChangeOrderList = list;
          this.newloading = false;
        })
      },

     onSwitchCheck(friend) {
			 if (!friend.disabled) {
				  friend.isCheck = !friend.isCheck
			 }
		 },
      // 多选框选中数据
      handleSelectionChange(selection) {
        this.Ids = selection.map(item => item.id);
        this.code = selection.map(item => item.electrodeNo);
        this.multiple = !selection.length;
      },
      // 工艺列表多选框选中数据
      onOk() {
          this.$modal.loading("正在复用，后台正在处理，请稍后...！");
          let inviteVO = {
            groupId: this.groupId,
            bomlist: [],
            fromProdOrderNo:this.selectProdOrderNo,
            toProdOrderNo:this.copyProdOrderNo,
            fromTaskNo:this.selectTaskNo,
            toTaskNo:this.copyTaskNo,
            fromSort:this.selectSort,
            fromCode:this.selectCode,
            toSort:this.copySort,
            toCode:this.copyCode,
            dispatchOrderNo:this.dispatchOrderNo ,
            prodHisOrderNo:this.prodHisOrderNo,
          }
          this.friends.forEach((f) => {
            if (f.isCheck && !f.disabled) {
              inviteVO.bomlist.push(f);
            }
          })
          
          if(this.selectCode === 'EDM'){
            if(inviteVO.bomlist.length<=0){
              this.$modal.msgSuccess("没有可以复用的电极 ！");
              return ;

            }
          }
          
            //this.chackElctrodeNoStatus(inviteVO) ;
         
          reuseElectrodeData(inviteVO ).then(res => {
            
            this.loading = false;
            this.$modal.closeLoading()
            
            if(res.data === 'SUCCESS'){
               setTimeout(()=>{
                  this.$modal.msgSuccess("复用成功");
              },500)

              setTimeout(()=>{
                  // 刷新路由
                this.$router.replace({ path: '/redirect' + this.$route.fullPath }).then(() => {
                  this.$router.replace(this.$route.fullPath);
                });
              },900)
              

            }
          })
		  },
      chackElctrodeNoStatus(inviteVO) {
        
        checkAllMultiplexedElectrodeData(inviteVO ).then(res => {
          
        })
      },
      /** 搜索按钮操作 */
      handleQuery() {
        this.queryParams.pageNo = 1;
        this.getChangeOrderList();
      },
      handleQueryTwo() {
        
        this.querySecondParams.pageNo = 1;
        this.querySecondParams.prodOrderNo = this.querySecondParams.workpieceProdOrderNo;
        this.getChangeOrderListTwo();
      },
      copyUsed() {
        debugger
        if (this.selectProdOrderNo == null || this.selectProdOrderNo == '') {
          this.$message.warning('请选择要复制的工艺')
          return;
        }
        if (this.copyProdOrderNo == null || this.copyProdOrderNo == '') {
          this.$message.warning('请选择被复制的工艺')
          return;
        }
        if (this.selectCode == null || this.selectCode == '') {
                this.$message.warning('请选择要复制的工艺')
                return;
        }
        if (this.copyCode == null || this.copyCode == '') {
          this.$message.warning('请选择被复制的工艺')
          return;
        }
        if(!this.checkCodeType(this.selectProdOrderNo,this.copyProdOrderNo,this.selectCode,this.copyCode,this.selectSort,this.copySort)){
          return ;
        }
        this.queryDataParams.selectProdOrderNo = this.selectProdOrderNo;
        this.queryDataParams.copyProdOrderNo = this.copyProdOrderNo;
        this.queryDataParams.selectCode = this.selectCode;
        this.queryDataParams.copyCode = this.copyCode;
        this.queryDataParams.selectSort = this.selectSort;
        this.queryDataParams.copySort = this.copySort;
        
        if(this.selectCode === 'EDM'){
            this.groupMember = true ;
            this.getEletrodeBomlist();
        }else{
          
        }
        
      },
      checkCodeType(selectProdOrderNo,copyProdOrderNo,selectCode,copyCode,selectSort,copySort){
        
        if(selectProdOrderNo===copyProdOrderNo){
          alert("选择的生产单号不能相同 ！");
          return false;
        }
        if(copyCode!==copyCode){
          alert("选择的工段必须一样 ！");
          return false;
        }
        return true
      },
      getEletrodeBomlist() {
        getElectrodeBomlist(this.queryDataParams).then(response => {
          if(response.data.length > 0){
            const list = response.data;
            this.reuseElctrodeBomList = list;
            this.friends  = list;
            this.craftOpen = true;
            this.craftTitle = "复用工序";   
          }else{
            this.$message.warning('没有可以复用的电极 !')
             setTimeout(()=>{
                 this.$message.warning('没有可以复用的电极 !')
              },1500)
          }
          
        })
      },
      
  // 取消按钮
      cancel() {
        this.craftOpen = false;
        this.queryDataParams.selectProdOrderNo = null ;
        this.queryDataParams.selectSort = null ;
        this.queryDataParams.selectCode = null ;
        this.queryDataParams.copyProdOrderNo = null ;
        this.queryDataParams.copySort = null ;
        this.queryDataParams.copyCode = null ;
        
      },
   
      /** 取消按钮 */
      handleCancel(row) {
        const ids = row.id
        alreadyCancel({'flag':'2','ids':[ids]}).then(response =>{
          this.$modal.msgSuccess("取消成功");
          this.getListEledetail();
        })
      },
      /** 多选框禁选 */
      selected(row,index){
        if (row.status == 1) {
          return false //不可勾选
        } else {
          return true; //可勾选
        }
      },
      /** 工艺列表多选框禁选 */
      selectedProcess(row,index){
        if (row.operationCategory === 'EDM') {
          return true //不可勾选
        } else {
          return false; //可勾选
        }
      },
      /** 选择工艺中得EDM工序 */
      checkEdmNo() {
        if(this.prodOrderNo === '') {
          this.process.open = false
          this.$modal.msgError("请填写工件生产单号")
        } else {
          this.process.title = "选择工艺中的EDM工序"
          this.process.open = true
          this.getListProcess();
        }
      },
      /** 根据生产单号选择EDM所在工序 */
      selectContactProcess(val) {
        this.prodOrderNo = val
      },
      /** 新增工件提交按钮 */
      submitForm: function () {



      },
       /** 表格数据增加index */
      tableRowClassName({ row, rowIndex }) {
      //把每一行的索引放进row
      row.index = rowIndex;
      },
      handleWatchOld(row) {
        this.queryParams.oldCode = row.code;
        this.selectProdOrderNo  = row.prodOrderNo;
        this.selectCode = row.code;
        this.selectSort = row.sort;
        this.selectTaskNo = row.taskNo;
        this.orderTask = true;
        this.showPage = true;
      },
      handleWatchNew(row) {
        this.queryParams.oldCode = row.code
        this.copyProdOrderNo  = row.prodOrderNo;
        this.copyTaskNo  = row.taskNo;
        this.copySort =  row.sort;
        this.copyCode =  row.code;
        this.dispatchOrderNo =  row.dispatchOrderNo;
        this.prodHisOrderNo =  row.prodHisOrderNo;
      },

    }
  };
</script>

<style scoped>
/* 整体布局样式 */
.link-type {
  display: flex;
  align-items: center;
  padding: 15px;
  border: 1px solid #eaeaea;
  border-radius: 6px;
  background-color: #f9f9f9;
  font-family: "黑体", "Microsoft YaHei", sans-serif;
  font-size: 17px;
  margin-bottom: 10px;
}

/* 内容区域样式 */
.dv-content {
  display: flex;
  gap: 40px; /* 两组信息之间的间距 */
  align-items: flex-start;
  flex-grow: 1;
  height: 50px; /* 保持高度 */
}

/* 每个工单信息块样式 */
.order-info {
  display: flex;
  flex-direction: column;
  gap: 12px; /* 行与行之间的间距 */
  margin-left: 100px;
}

/* 每行信息样式 */
.info-row {
  display: flex;
  align-items: center;
  min-height: 24px; /* 确保每行高度一致 */
}

/* 标签样式 - 确保冒号对齐 */
.label {
  font-weight: bold;
  color: #333;
  min-width: 110px; /* 固定宽度确保冒号对齐 */
  text-align: right; /* 右对齐使冒号对齐 */
  box-sizing: border-box;
  flex-shrink: 0; /* 防止标签被压缩 */
}

/* 值样式 */
.value {
  color: #666;
  font-weight: normal;
  padding-left: 4px;
  word-break: break-all; /* 防止长文本溢出 */
}

/* 新的容器：将第二个工单信息和按钮组合在一起 */
.order-info-button-container {
  display: flex;
  align-items: center; /* 垂直居中对齐 */
  gap: 80px; /* 工单信息和按钮之间的距离 */

}

/* 按钮样式 */
.dv-button {
  flex-shrink: 0; /* 防止按钮被压缩 */
  margin-top: 0; /* 确保按钮没有上边距 */
}

</style>

<style lang="scss" scoped>
.add-group-member {
	display: flex;

	.left-box {
		flex: 1;
		overflow: hidden;
		border: var(--im-border);

		.search {
			height: 40px;
			display: flex;
			align-items: center;

			.el-input__inner {
				border: unset;
				border-bottom: var(--im-border);
			}
		}

		.checkbox {
			margin-right: 20px;
		}
	}

	.arrow {
		display: flex;
		align-items: center;
		font-size: 18px;
		padding: 10px;
		font-weight: 600;
		color: var(--im-color-primary);
	}
  .right-box {
		flex: 1;
		border: var(--im-border);

		.tip {
			text-align: left;
			height: 40px;
			line-height: 40px;
			text-indent: 10px;
			color: var(--im-text-color-light)
		}
	}
}
</style>
