<template>
  <div class="container">
    <div class="filterArticle">
       <el-form label-width="80px">
      <el-form-item label="选择文章">
        <el-select style="width:300px;"
                    v-model="articleId"
                    @change="getCommentList"
                    placeholder="选择文章评论">
                    <el-option
                            v-for="(item,index) in articleList"
                            :key="index"
                            :label="item.title"
                            :value="item.articleId">
                    </el-option>
          </el-select>
      </el-form-item>
       </el-form>
    </div>
    <el-table
    :data="commentList"
    style="width: 100%"
    row-key="created_time"
    border
    >
    <el-table-column align="center" label="#" width="70">
        <template slot-scope="scope">
          {{ scope.$index+1 }}
        </template>
      </el-table-column>
    <el-table-column
      prop="created_time"
      :formatter="formatTableTime"
      label="时间"
      width="180">
    </el-table-column>
     <el-table-column
      prop="user.userName"
      label="用户"
      width="120">
    </el-table-column>
     <el-table-column
      label="评论文章/用户"
      >
      <template slot-scope="scope">
        <span v-if="scope.row.type=='parent'">《{{scope.row.articleTitle}}》</span>
        <span v-else>@{{scope.row.toUser.userName}}</span>
      </template>
    </el-table-column>
    <el-table-column
      prop="content"
      label="评论内容"
      >
    </el-table-column>
    <el-table-column
    width="260"
      prop="checkStatus"
      label="审核状态">
      <template slot-scope="scope">
          <!-- <el-select placeholder="默认通过" v-model="checkStatus[scope.$index]">
            <el-option label="折叠" value="折叠"></el-option>
            <el-option label="删除" value="删除"></el-option>
          </el-select> -->
            <el-radio-group v-model="scope.row.status" @change="checkComment($event,scope.row)">
              <el-radio :label="0">通过</el-radio>
              <el-radio :label="1">违规</el-radio>
              <el-radio :label="2">折叠</el-radio>
            </el-radio-group>
      </template>
    </el-table-column>
    <el-table-column
      prop="action"
      width="150"
      label="操作">
      <template slot-scope="scope">
         <el-button plain size='mini' type="primary" @click="openReplyBox(scope.row)">回复</el-button>
         <el-button plain size='mini' type='danger'  @click="openDeleteBox(scope.row)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
  <el-pagination
    style="text-align:center;margin-top:10px;"
    background
    @current-change="nextPage"
    layout="prev, pager, next"
    :total="total">
  </el-pagination>

   <!-- 回复窗 -->
    <el-dialog
      :title="`回复(${replyUser})`"
      :visible.sync="replyBox"
      width="30%"
      >
        <div style="background:#f1f1f1;padding:6px">{{toContent}}</div>
        <p style="font-weight:700;">@{{replyUser}}</p>
        <el-input type='textarea' v-model="replyContent"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button size='small' @click="replyBox = false">取 消</el-button>
        <el-button size='small' type="primary" @click="subComment">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Dashboard',
  computed: {
    ...mapGetters([
      'name','userId'
    ])
  },
  data() {
      return {
        actionStatus:[],
        checkStatus:[],
        commentList:[],
        articleList:[],
        articleId:'',
        total:0,
        replyBox:false,

        commentId:'',
        articleTitle:'',
        replyContent:'',
        replyUser:'',
        toUserId:'',
        toContent:'',
      }
    },
    methods: {
      //格式化时间
      formatTableTime(row){
       return this.parseTime(row.created_time)
      },
      //审核评论
      checkComment(status,row){
        this.$api.comment.checkComment(
          {
            status,
            commentId:row.commentId,
            type:row.type,
            id:row._id,
            // articleId:row.articleId
          }
        )
        .then((data)=>{
          if(data.code==1){
            this.$message.success('审核成功!')
          }else{
            this.$message.error('操作失败!')
          }
        }).catch((error)=>{
          console.log(error)
        })
      },
      //翻页
      nextPage(page){
        let start = (page-1)*10
        this.getCommentList(start)
      },
      //获取所有评论列表
      getCommentList(start=0){
        this.$api.comment.getCommentList(
          {
            start,
            row:10,
            articleId:this.articleId
          }
        ).then(data=>{
          if(data.code==1){
            this.commentList = data.data
            this.total = data.total
            for(let ele of this.commentList){
              ele.children = ele.sub_comment
            }
          }
        })
      },
      //文章列表
      getArticleList() {
        this.$api.article.articleList({
            type:"article",
            rows:100,
            start: 0
          })
        .then(data => {
          data.data.unshift({
            title:'全部评论',
            articleId:''
          })
          this.articleList = data.data
        })
      },
      //回复窗
      openReplyBox(row){
        this.replyBox = true
        this.articleId=row.articleId
        this.commentId = row.commentId
        this.articleTitle = row.articleTitle || ""
        this.replyUser = row.user.userName
        this.toUserId = row.user.userId
        this.toContent = row.content
      },
      //回复
      subComment(){
             if(!this.userId){
                this.$message.info('请先登录!')
                return
            }
            this.$api.comment.subCommentArticle({
                userId:this.userId,
                toUserId:this.toUserId,
                articleId:this.articleId,
                commentId:this.commentId,
                content:this.replyContent,
            }).then(data=>{
                 if(data.code===1){
                    //通知用户
                    let option = { 
                        type:'answer',
                        userId:this.userId,
                        toUserId:this.toUserId,
                        content:this.replyContent,
                        toContent:this.toContent,
                        articleId:this.articleId,
                    }
                    this.publishNotice(option)
                    this.getCommentList()
                    this.replyBox = false
                    this.replyContent = ""
                }else{
                    this.$message.error('服务器错误')
                }
            })
        },
        //通知
        //option:{ type,userId,toUserId,content,toContent,articleId}
        publishNotice(option){ 
            this.$api.notice.publishNotice(
                option
            ).then((data)=>{
                if(data.code === 1){
                    
                }else{
                    this.$message.error('服务器错误')
                }
            })
        },
      //删除
      handleDelete(row) {
       this.$api.comment.deleteComment(
          {
            commentId:row.commentId,
            type:row.type,
            id:row._id,
            articleId:row.articleId
          }
        )
        .then((data)=>{
          if(data.code==1){
            this.$message.success('删除成功!')
            this.getCommentList()
          }else{
            this.$message.error('操作失败!')
          }
        }).catch((error)=>{
          console.log(error)
        })
      },
       //确认删除框
     openDeleteBox(row) {
       let msg
       row.type=="parent"?msg="此操作将永久删除该评论和子评论, 是否继续?":msg="此操作将永久删除该评论, 是否继续?"
        this.$confirm(msg, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.handleDelete(row)
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
      },

    },
    mounted() {
      this.getCommentList()
      this.getArticleList()
    },
}
</script>

<style lang="scss" scoped>
// .dashboard {
//   &-container {
//     margin: 30px;
//   }
//   &-text {
//     font-size: 30px;
//     line-height: 46px;
//   }
// }
.container{padding: 20px;}
.container /deep/ .el-table__indent{
  padding-left: 0px!important;
}
.container /deep/ .el-table__row--level-1{
  background:#dce0e4;
}
.container /deep/ .hover-row>td{
  background:none!important;
}

.filterArticle{
  // padding-top: 20px;
}
.container /deep/ .el-dialog__body{
  padding: 0px 20px 10px 20px;
}
</style>
