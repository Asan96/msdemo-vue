<template>
  <el-container>
    <el-main class="main-container">
  <el-table
      class="manage-table"
  :data="tableData"
  border>
  <el-table-column
      prop="name"
      label="姓名"
      align="center"
  >
  </el-table-column>
    <el-table-column
        prop="imageCount"
        label="照片作业进度"
    >
      <template slot-scope="scope">
        <div slot="reference" class="name-wrapper">
          <el-progress :percentage="scope.row.imageCount >0 ? Math.ceil((scope.row.imageCount / taskCount)*100):0" :color="customColors"></el-progress>
        </div>
      </template>
    </el-table-column>
    <el-table-column
        prop="videoCount"
        label="视频作业进度"
    >
      <template slot-scope="scope">
        <div slot="reference" class="name-wrapper">
          <el-progress :percentage="scope.row.videoCount>0 ? Math.ceil((scope.row.videoCount / taskCount)*100):0" :color="customColors"></el-progress>
        </div>
      </template>
    </el-table-column>
  <el-table-column
      label="操作"
      align="center"
      width="100">
    <template slot-scope="scope">
      <el-button type="text" size="small" @click="handleViewWork(scope.row.id, scope.row.name)">查看作业详情</el-button>
    </template>
  </el-table-column>
  </el-table>
        <el-pagination
            class="pagination"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="currentPage"
            :page-size="pageSize"
            layout="total, prev, pager, next"
            :total="totalCount">
        </el-pagination>
      <el-dialog style="align-items: center; justify-content: center" :visible.sync="dialogVisible">
        <h2>{{currentUsername}}作业详情</h2>
        <el-table
            border
            :data="userTableData"
            class="submit-table"
        >
          <el-table-column
              label="温度"
              align="center"
              width="200"
          >
            <template slot-scope="scope">
              <div slot="reference" class="name-wrapper">
                {{ scope.row.temp }} ℃
              </div>
            </template>
          </el-table-column>
          <el-table-column label="图片" align="center">
            <template slot-scope="scope">
              <div slot="tip" v-if="scope.row.imageUrl == null" class="el-upload__tip">暂无提交</div>
              <el-link type="success" slot="tip" v-else class="el-upload__tip"
                       :href = "scope.row.imageUrl" target="_blank">{{scope.row.imageName}}</el-link>
            </template>
          </el-table-column>
          <el-table-column label="视频" align="center">
            <template slot-scope="scope">
              <div slot="tip" v-if="scope.row.videoUrl == null" class="el-upload__tip">暂无提交</div>
              <el-link type="primary" slot="tip" v-else class="el-upload__tip"
                       @click="handleViewVideo(scope.row.videoUrl)">{{scope.row.videoName}}</el-link>
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>
      <DialogVideo :video-url="videoUrl" :video-dialog-visible="videoDialogVisible" @handleVideoDialog="handleVideoDialog"></DialogVideo>
    </el-main>
  </el-container>
</template>

<script>
import urls from "@/urls";
import DialogVideo from "@/components/DialogVideo";

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "Manage",
  components: {DialogVideo},
  data() {
    return {
      forbid: false,
      taskCount: 7,
      tableData: [
        {
          id: null,
          name: null,
        },
      ],
      customColor: '#409eff',
      customColors: [
        {color: '#f56c6c', percentage: 20},
        {color: '#e6a23c', percentage: 40},
        {color: '#5cb87a', percentage: 60},
        {color: '#1989fa', percentage: 80},
        {color: '#6f7ad3', percentage: 100}
      ],
      userTableData : [],
      dialogVisible: false,
      videoUrl: null,
      videoDialogVisible: false,
      currentUsername: null,
      currentPage: 1,
      pageSize: 10,
      totalCount: 0
    };
  },
  mounted() {
    this.getTaskCount()
    this.getTableData()
    this.timer = window.setInterval(() => {
      setTimeout(() => {
        this.getTableData()
        console.log('刷新页面 -------------------')
      },0)
    },5000)
  },
  destroyed() {
    window.clearInterval(this.timer)
  },
  methods: {
    getTableData(){
      let params = {
        pageNum:this.currentPage,
        pageSize: this.pageSize
      }
      this.$axios.get(urls.userList, {params:params}).then(res=>{
        if (res.data.code === 200){
          console.log('res.data.data:', res.data.data)
          this.tableData = res.data.data.records
          this.totalCount = res.data.data.total
        }
      })
    },
    getTaskCount(){
      this.$axios.get(urls.taskCount,{}).then(res=>{
        if (res.data.code === 200){
          this.taskCount = res.data.data
        }
      })
    },
    handleViewWork(userId, username){
      this.currentUsername = username;
      this.$axios.get(urls.getUserWorksByTeacher+userId,{}).then(res=>{
        if (res.data.code === 200){
          this.userTableData = res.data.data
          this.userTableData.forEach(item=>{
            if (item.imageUrl !=null){
              item.imageName = item.imageUrl.substring(item.imageUrl.lastIndexOf("/")+1, item.imageUrl.length);
            }
            if (item.videoUrl != null){
              item.videoList = []
              item.videoName = item.videoUrl.substring(item.videoUrl.lastIndexOf("/")+1, item.videoUrl.length);
            }
          })
          this.dialogVisible = true
        }
      })
    },
    handleViewVideo(url){
      this.videoUrl=url
      this.videoDialogVisible = true
    },
    handleVideoDialog(openStatus){
      this.videoDialogVisible = openStatus
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.pageSize = val;
      this.getTableData()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.getTableData()
      console.log(`当前页: ${val}`);
    }
  },
}
</script>

<style scoped>
.main-container{
  position: relative;
  align-items: center;
  justify-content: center;
  width: 60%;
  top:60px;
}
.manage-table{
  margin: auto;
  align-items: center;
  justify-content: center;
  width: 1000px;
}
.submit-table{
  align-items: center;
  text-align: center;
  width: 100%;
}
.pagination{
  margin-top: 20px;
}
</style>