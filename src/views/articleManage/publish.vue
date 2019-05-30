<template>
  <div class="createPost-container">
    <el-form class="form-container">
      <div class="createPost-main-container">
            <el-button v-if='!articleId' style="display: flex;margin-left: auto;" type="primary" size='small' @click='publish'>发布</el-button>
            <el-button v-else style="display: flex;margin-left: auto;" type="primary" size='small' @click='updateArticle'>更新</el-button>
            <el-form-item style="margin-bottom: 40px;" prop="title">
              <MDinput v-model="title" :maxlength="100" name="name" required>标题</MDinput>
            </el-form-item>

            <div class="postInfo-container">
              <el-row>
                <el-col :span="12">
                  <el-form-item label-width="45px" label="作者:" class="postInfo-container-item">
                     <el-select style="width:300px;"
                                v-model="authorId"
                                default-first-option
                                placeholder="选择用户">
                                <el-option
                                        v-for="item in userList"
                                        :key="item.userName"
                                        :label="item.userName"
                                        :value="item.userId">
                                </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>

                <el-col :span="12">
                  <el-form-item label-width="80px" label="发布时间:" class="postInfo-container-item">
                    <el-date-picker style="width:300px;" v-model="created_time" type="datetime" format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期时间" />
                  </el-form-item>
                </el-col>
              </el-row>

               <el-row>
                <el-col :span="12">
                  <el-form-item label-width="45px" label="分类:" class="postInfo-container-item">
                    <el-select style="width:300px;"
                                v-model="categoryValue"
                                filterable
                                allow-create
                                default-first-option
                                placeholder="请选择分类">
                                <el-option
                                        v-for="item in categoryOption"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>

                <el-col :span="12">
                  <el-form-item label-width="80px" label="标签:" class="postInfo-container-item">
                    <el-select
                      style="width:300px;"
                      v-model="tagValue"
                      multiple
                      filterable
                      allow-create
                      default-first-option
                      placeholder="请选择文章标签">
                      <el-option
                        v-for="item in tagOption"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>

        <el-form-item label-width="45px" label="封面:" class="postInfo-container-item">
          <div class="coverImg">
              <el-upload
                class="avatar-uploader"
                :action="`${baseUrl}/article/uploadCover`"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload">
                <img v-if="imageUrl" :src="imageUrl" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
          </div>
        </el-form-item>

        <el-form-item class="postInfo-container-item">
            <markdown-editor v-model="mdCode" height="800px"/>
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<script>

// import Upload from '@/components/Upload/SingleImage3'
import MDinput from '@/components/MDinput'
import { validURL } from '@/utils/validate'
import base from '@/api/base.js'
import MarkdownEditor from '@/components/MarkdownEditor'
import {mapGetters} from 'vuex'
export default {
   computed:{
    ...mapGetters(['userType'])
  },
  name: 'publish',
  components: {  MDinput,MarkdownEditor },
  // props: {
  //   isEdit: {
  //     type: Boolean,
  //     default: false
  //   }
  // },
  data() {
    return {
      loading: false,
      userList: [],
      tempRoute: {},
      tagOption:[
        {
          value: 'VUE',
          label: 'VUE'
        },
        {
          value: 'HTML',
          label: 'HTML'
        },
        {
          value: 'JS',
          label: 'JS'
        }
      ],
      categoryOption:[
        {
          value: '框架',
          label: '框架'
        },
        {
          value: '数据库',
          label: '数据库'
        },
        {
          value: '服务器',
          label: '服务器'
        },
        {
          value: 'HTML',
          label: 'HTML'
        },
        {
          value: 'JS',
          label: 'JS'
        }
      ],
      baseUrl:base.dev,
      id: "",

      imageUrl: '',
      pictureUrl: '',
      title: '', // 文章题目
      authorId:'',
      created_time: "", // 前台展示时间
      categoryValue: "",
      tagValue: [],
      mdCode: "",

      articleType:'',
      articleId:'',

    }
  },
  created() {
    this.getAllUser()
    const {id,type} = this.$route.query
    this.articleType = type
    this.articleId = id
    if(this.articleId){
      this.getArticleDel(id,type)
    }
    // Why need to make a copy of this.$route here?
    // Because if you enter this page and quickly switch tag, may be in the execution of the setTagsViewTitle function, this.$route is no longer pointing to the current page
    // https://github.com/PanJiaChen/vue-element-admin/issues/1221
    this.tempRoute = Object.assign({}, this.$route)
  },
  methods: {
    //获取所有用户
      getAllUser(query) {
        this.$api.user.getAllUser().then(data => {
          if (data.code==1){
            this.userList = data.data
          }
        })
      },
      //文章发布
      publish(){
         if(this.userType != 0){
        this.$message.warning('需要管理员权限！')
        return
      }
        if(this.tagValue.length<1||this.categoryValu == ""||this.mdCode == ""||this.title==""||this.authorId==""){
          this.$message({type:'info',message:'请输入完整信息',duration:1500})
          return
        }
        this.$api.article.publish({
              value:this.mdCode,
              title:this.title,
              pictureUrl:this.pictureUrl,
              tags:this.tagValue,
              category:this.categoryValue,
              authorId: this.authorId
            }).then((data)=>{
              if(data.code===1){
                const{ articleId , title }  = data.data
                const content = `发布了新文章《${title}》，快来围观！`
                this.noticeAllUser(this.authorId,content,articleId)
                this.$message({
                  type:"success",
                  duration:1500,
                  message:"发布成功！"
                  })
                this.$router.push({path:'/articleManage/article'})
              }
            })
       },
       //通知全体
       noticeAllUser(userId,content,articleId){
         this.$api.notice.noticeAllUser({
           userId,content,articleId
         }).then((data)=>{
           if(data.code === 1){}
         })
       },
      //文章更新
      updateArticle(){
         if(this.userType != 0){
        this.$message.warning('需要管理员权限！')
        return
      }
        if(this.tagValue.length<1||this.categoryValu == ""||this.mdCode == ""||this.title==""||this.authorId==""){
          this.$message({type:'info',message:'请输入完整信息',duration:1500})
          return
        }
        this.$api.article.updateArticle(
          {
            articleId:this.articleId,
            value:this.mdCode,
            title:this.title,
            pictureUrl:this.pictureUrl,
            //
          })
        .then((data)=>{
          if(data.code===1){
             this.$message({
                  type:"success",
                  duration:1500,
                  message:"更新成功！"
                  })
            this.$router.push({path:'/articleManage/article'})
          }
        })
      },
      //保存为草稿
      saveDraft(){
         this.$api.article.articleDraft({
              articleId:this.articleId,
              value:this.mdCode,
              title:this.title,
              pictureUrl:this.pictureUrl,
            }).then((data)=>{
              console.log(data,'draft')
              if(data.code === 1){
                this.$message({
                    type:"success",
                    duration:1500,
                    message:"保存成功!"
                  })
              }
            })
      },
      //获取文章详情
      getArticleDel(articleId,type){
        this.$api.article.articleDel({
            articleId,
            type,
          })
        .then((data)=>{
          if(data.code===1){
            let article = data.data
            this.title = article.title
            this.imageUrl = article.pictureUrl
            this.pictureUrl = article.pictureUrl
            this.mdCode = article.value
            this.created_time = article.created_time
            this.authorId = article.author.userId
            this.categoryValue = article.category
            this.tagValue = article.tags

          }
        })
      },
     //图片上传
       handleAvatarSuccess(res, file) {
          if(this.userType != 0){
        this.$message.warning('需要管理员权限！')
        return
      }
         this.imageUrl = URL.createObjectURL(file.raw);
         this.pictureUrl = res.pictureUrl;
      },
      beforeAvatarUpload(file) {
        const isLt2M = file.size / 1024 / 1024 < 1;
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 1MB!');
        }
        return  isLt2M;
      },




  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
.createPost-container {
  position: relative;
  .createPost-main-container {
    padding: 10px 45px 20px 50px;
    .postInfo-container {
      position: relative;
      @include clearfix;
      margin-bottom: 10px;
      .postInfo-container-item {
        float: left;
      }
    }
  }
  .word-counter {
    width: 40px;
    position: absolute;
    right: -10px;
    top: 0px;
  }
}

  .coverImg{
    border: 1px solid #ddd;
    background: #fff;
    display: inline-block;
  }
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
