let base_url = 'http://127.0.0.1:866/'
const urls = {
    userLogin: "user/login", // 用户登录
    userLogout: "user/logout", // 退出登录
    getUserWorks: "work/user/list", //用户作业列表
    uploadImage: "work/image", //上传图片
    deleteImage: "work/image", //删除图片
    uploadVideo: "work/video", //上传视频
    deleteVideo: "work/video", //删除视频
    taskCount: "task/count", //学生列表
    userList: "user/list", //学生列表
    getUserWorksByTeacher: "work/user/list/",
}
// 遍历urls 对值进行操作 每个url前加上请求的地址
Object.keys(urls).forEach((key)=>{
    urls[key] = base_url + urls[key]
})
export default urls;