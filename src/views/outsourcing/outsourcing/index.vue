<template>
  <div class="app-container">
     <!-- 搜索栏 -->
    <el-card>
        <el-form :inline="true">
          <el-form-item label="搜索:" prop="code">
            <el-input
              placeholder="派工单号/生产单号/模号/件号"
              clearable
              size="small"
              style="width: 220px"
            />
          </el-form-item>

          <el-form-item label="加工类型:" style="margin-left: 10px">
            <el-radio-group v-model="radio1">
              <el-radio :label="1" style="margin: 4px">自制-外发</el-radio>
              <el-radio :label="2" style="margin: 4px">外发</el-radio>
              <el-radio :label="3" style="margin: 4px">请购</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="工件类型:" style="margin-left: 10px">
            <el-radio-group v-model="radio2">
              <el-radio  style="margin: 4px"></el-radio>
              <el-radio :label="1" style="margin: 4px">电极</el-radio>
              <el-radio :label="2" style="margin: 4px">钢件</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="外发状态:" style="margin-left: 10px">
            <el-radio-group v-model="radio3">
              <el-radio :label="1" style="margin: 4px">待收货</el-radio>
              <el-radio :label="2" style="margin: 4px">待检验</el-radio>
              <el-radio :label="3" style="margin: 4px">待退货</el-radio>
              <el-radio :label="4" style="margin: 4px">待入库</el-radio>
              <el-radio :label="5" style="margin: 4px">已入库</el-radio>
              <el-radio :label="6" style="margin: 4px">已取消</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" style="margin-left: 10px">搜索</el-button>
          </el-form-item>
        </el-form>
    </el-card>

    <el-row :gutter="5">
      <el-col :span="17">
    <!-- 左边列表 -->
    <el-card>
        <el-button type="primary" size="small" @click="dialog1 = true">钢件外发<i style="margin-left: 5px" class="el-icon-circle-plus-outline"></i></el-button>
        <el-button type="danger" size="small">电极外发<i style="margin-left: 5px" class="el-icon-circle-plus-outline"></i></el-button>
      <el-table border style="margin-top: 10px">
        <el-table-column type="selection" :reserve-selection="true" width="50" align="center" />
        <el-table-column label="工件类型" prop="code" width="120" align="center"/>
        <el-table-column label="加工类型" prop="name" align="center"/>
        <el-table-column label="外发状态" prop="operationCategory" align="center"/>
        <el-table-column label="派工单号" prop="workpieceTypeName" align="center"/>
        <el-table-column label="模号" prop="unitPrice" align="center"/>
        <el-table-column label="件号" prop="groupDevicesNum" align="center"/>
        <el-table-column label="版次" prop="isWF" align="center"/>
        <el-table-column label="品名" prop="status_dictText" align="center"/>
        <el-table-column label="数量" prop="isWF" align="center"/>
        <el-table-column label="需求日期" prop="status_dictText" align="center"/>
        <el-table-column label="操作" align="center">
          <template>
            <el-button
              size="mini"
              type="warning"
              icon="el-icon-edit"
            >取消</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
      </el-col>

      <!-- 右边列表 -->
      <el-col :span="7">
        <el-card>
          <el-table border>
            <el-table-column label="工序名称" prop="code" width="120" align="center"/>
            <el-table-column label="工时" prop="code" width="120" align="center"/>
            <el-table-column label="操作" align="center">
              <template>
                <el-button
                  size="mini"
                  type="warning"
                  icon="el-icon-edit"
                >取消</el-button>
                <el-button
                  size="mini"
                  type="warning"
                  icon="el-icon-edit"
                >完整工序</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>


    <!-- 钢件外发页面 -->
    <el-dialog title="钢件外发" :visible.sync="dialog1" width="80%" v-el-drag-dialog>
      <el-card>
        // 搜索栏
        <el-input
          placeholder="派工单号/生产单号/模号/件号"
          clearable
          size="small"
          style="width: 520px"
        />
      </el-card>
      <el-row :gutter="5">
        <el-col :span="17">
          <el-card>
            <el-table border style="margin-top: 10px">
              <el-table-column type="selection" :reserve-selection="true" width="50" align="center" />
              <el-table-column label="工件类型" prop="code" width="120" align="center"/>
              <el-table-column label="加工类型" prop="name" align="center"/>
              <el-table-column label="外发状态" prop="operationCategory" align="center"/>
              <el-table-column label="派工单号" prop="workpieceTypeName" align="center"/>
              <el-table-column label="模号" prop="unitPrice" align="center"/>
              <el-table-column label="件号" prop="groupDevicesNum" align="center"/>
              <el-table-column label="版次" prop="isWF" align="center"/>
              <el-table-column label="品名" prop="status_dictText" align="center"/>
              <el-table-column label="数量" prop="isWF" align="center"/>
              <el-table-column label="需求日期" prop="status_dictText" align="center"/>
            </el-table>
          </el-card>
        </el-col>
        <el-col :span="7">
          <el-card>
            <el-table border>
              <el-table-column label="工序名称" prop="code" width="120" align="center"/>
              <el-table-column label="工时" prop="code" width="120" align="center"/>
              <el-table-column label="操作" align="center">
                <template>
                  <el-button
                    size="mini"
                    type="warning"
                    icon="el-icon-edit"
                  >选择外发</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </el-col>
      </el-row>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialog1 = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>
<script>
  export default {
    data() {
      return {
        radio1: 1,
        radio2: 1,
        radio3: 1,
        dialog1: false, //钢件外发
      }
    },
  }
</script>
