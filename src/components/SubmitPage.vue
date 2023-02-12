<template>
  <el-container>
    <el-main class="main-container">
      <el-table
          border
          :data="tableData"
          class="submit-table"
      >
        <el-table-column
            label="温度"
            align="center"
        >
          <template slot-scope="scope">
              <div slot="reference" class="name-wrapper">
                {{ scope.row.temp }} ℃
              </div>
          </template>
        </el-table-column>
        <el-table-column label="图片" align="center">
          <template slot-scope="scope">
            <el-upload
                class="upload-demo"
                action=""
                :data={tuid:scope.row.tuid,}
                :on-preview="handlePreview"
                :http-request="(params)=>handleUploadFile(params, imageType)"
                :on-remove="(file) => handleRemove(file, scope.row.tuid, imageType)"
                :before-remove="(file) => beforeRemove(file, imageType)"
                :limit="1"
                :on-exceed="handleExceed"
                :before-upload="(file) =>handleBeforeUpload(file, imageType)"
                accept=".jpg,.png"
                :file-list="scope.row.imageList">
              <el-button size="small" type="warning" :disabled="scope.row.imageUrl != null">上传照片</el-button>
              <div slot="tip" class="el-upload__tip" v-show="scope.row.imageUrl == null">只能上传jpg/png文件，且不超过2MB</div>
            </el-upload>
          </template>
        </el-table-column>
        <el-table-column label="视频" align="center">
          <template slot-scope="scope">
            <el-upload
                class="upload-demo"
                action=""
                :data={tuid:scope.row.tuid,}
                :on-preview="handleVideoPreview"
                :http-request="(params)=>handleUploadFile(params, videoType)"
                :on-remove="(file) => handleRemove(file, scope.row.tuid, videoType)"
                :before-remove="(file) => beforeRemove(file, videoType)"
                :limit="1"
                :on-exceed="handleExceed"
                :before-upload="(file) =>handleBeforeUpload(file, videoType)"
                accept=".mp4"
                :file-list="scope.row.videoList"
            >
              <el-button size="small" type="danger" :disabled="scope.row.videoUrl != null">上传视频</el-button>
              <div slot="tip" class="el-upload__tip" v-show="scope.row.videoUrl == null">只能上传mp4文件，且不超过50MB</div>
            </el-upload>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog :visible.sync="dialogVisibleImg">
        <img width="100%" height="100%" :src="dialogImageUrl" style="display: block"/>
      </el-dialog>
      <el-dialog :visible.sync="dialogVisibleVideo">
        <video-player
            class="vjs-custom-skin videoPlayer"
            :options="playerOptions"
            ref="videoPlayer"
            :playsinline="true"
        ></video-player>
      </el-dialog>
    </el-main>
  </el-container>
</template>

<script>
import urls from "@/urls";

export default {
  name: "SubmitPage",
    data() {
      return {
        tableData: [{
          temp: '',
          imageUrl: '',
          videoUrl: '',
          tuid: null,
          id:null
        }],
        dialogVisibleImg: false,
        dialogVisibleVideo: false,
        dialogImageUrl:null,
        videoType: 'video',
        imageType: 'image',

        playerOptions: {
       playbackRates: [0.7, 1.0, 1.5, 2.0], //播放速度
          autoplay: false, //如果true,浏览器准备好时开始回放。
          muted: false, // 默认情况下将会消除任何音频。
          loop: false, // 导致视频一结束就重新开始。
          preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
          language: 'zh-CN',
          aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
          fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
          sources: [{
            type: "video/mp4",
            src: "" //你的视频地址（必填）
          }],
          poster: "", //你的封面地址
          width: 800,
          notSupportedMessage: '此视频暂无法播放，请稍后再试', //允许覆盖Video.js无法播放媒体源时显示的默认信息。
        }
      }
    },
    methods: {
      handleRemove(file, tuid, type_) {
        if (file && file.status === 'success'){
          let url = type_ === "image" ? urls.deleteImage: urls.deleteVideo;
          this.$axios.delete(url,{params:{tuid:tuid}}).then(res=>{
            if (res.data.code){
              this.$message.success(res.data.msg)
              this.handleRefreshTable()
            }else{
              this.$message.error(res.data.msg)
            }
          })
        }
      },
      handlePreview(file) {
        console.log(file);
        this.dialogImageUrl = file.url;
        this.dialogVisibleImg = true
      },
      handleExceed() {
        this.$message.warning(`只能上传 1 个图片文件`);
      },
      beforeRemove(file, type_) {
        if (type_ === this.imageType){
          if (!this.handleImageFormatJudge(file)) return true;
        }else{
          if (!this.handleVideoFormatJudge(file)) return true;
        }
        return this.$confirm(`确定移除 ${ file.name }？`,'提示', {
          confirmButtonText:'确定',
          cancelButtonText: '取消',
          type:"warning"
        });

      },
      // 上传图片回调
      handleUploadFile(params, type_){
        let url = type_ === "image" ? urls.deleteImage: urls.deleteVideo;
        let formData = new FormData();
      formData.append("tuid", params.data.tuid)
        formData.append("file", params.file)
        this.$axios.post(url, formData).then(res=>{
          console.log('res11:', res)
          if (res.data.code === 200){
            this.$message.success(res.data.msg);
            this.handleRefreshTable()
          }else{
            this.$message.warning(res.data.msg)
          }
        })
      },
      // 刷新表格
      handleRefreshTable(){
        this.$axios.get(urls.getUserWorks, {}).then(res=>{
          console.log("res:", res)
          if (res.data.code === 200){
            this.tableData = res.data.data;
            this.tableData.forEach(item=>{
              if (item.imageUrl !=null){
                item.imageList = []
                let imgName = item.imageUrl.substring(item.imageUrl.lastIndexOf("/")+1, item.imageUrl.length);
                item.imageList.push({name: imgName, url: item.imageUrl});
              }
              if (item.videoUrl != null){
                item.videoList = []
                let videoName = item.videoUrl.substring(item.videoUrl.lastIndexOf("/")+1, item.videoUrl.length);
                item.videoList.push({name: videoName, url: item.videoUrl});
              }
            })
          }
        })
      },
      // 上传图片预处理
      handleBeforeUpload(file, type_){
        let ret;
        if (type_ === this.imageType){
          ret = this.handleImageFormatJudge(file);
        }else{
          ret = this.handleVideoFormatJudge(file);
        }

        if (!ret){
          if (type_ === this.imageType){
            this.$message.error("上传图片只能是jpg、png格式，且大小小于2MB")
          }else if (type_ === this.videoType){
            this.$message.error("上传视频只能是mp4格式，且大小小于50MB")
          }
        }
        return ret;
      },
      // 图片格式校验
      handleImageFormatJudge(file){
        const fileSuffix = file.name.substring(file.name.lastIndexOf(".") + 1);
        const whiteList = ["jpg", "png"];

        if (whiteList.indexOf(fileSuffix) === -1) {
          return false;
        }
        return file.size / 1024 / 1024 < 2;
      },

      // 视频格式校验
      handleVideoFormatJudge(file){
        const fileSuffix = file.name.substring(file.name.lastIndexOf(".") + 1);
        const whiteList = ["mp4"];

        if (whiteList.indexOf(fileSuffix) === -1) {
          return false;
        }
        return file.size / 1024 / 1024 < 50;
      },
      //视频预览
      handleVideoPreview(file){
        this.playerOptions.sources[0].src = file.url;
        this.dialogVisibleVideo =true
      }
    },
  mounted() {
    this.handleRefreshTable();
  },
}
</script>

<style scoped>
  .main-container{
    display: flex;
    align-items: center;
    justify-content: center;
    width: 60%;
    top:60px;
  }
  .submit-table{
    align-items: center;
    position: absolute;
    width: 800px;
  }
  .text-center{
    align-items: center;
  }
  .image-format{
    max-width: 100px;
    max-height: 100px;
  }
</style>