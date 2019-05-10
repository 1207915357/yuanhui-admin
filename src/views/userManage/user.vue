<template>
  <div class="app-container">
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
      size="small"
    >
      <el-table-column align="center" label="#" width="70">
        <template slot-scope="scope">
          {{ scope.$index+1 }}
        </template>
      </el-table-column>
      <el-table-column label="用户名" min-width='160'>
        <template slot-scope="scope">
          {{ scope.row.userName }}
        </template>
      </el-table-column>
      <el-table-column label="邮箱" min-width="200" align="center">
        <template slot-scope="scope">
          <!-- <span>{{ scope.row.userName }}</span> -->
        </template>
      </el-table-column>
      <!-- <el-table-column label="查看/点赞/评论" width="130" align="center">
        <template slot-scope="scope">
          {{ scope.row.eye }} / {{ scope.row.like }} / {{ scope.row.comments }}
        </template>
      </el-table-column> -->
      <el-table-column align="center" prop="created_at" label="创建时间" min-width="200">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ parseTime(scope.row.created_time) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="权限等级" min-width="200" align="center">
        <template slot-scope="scope">
         <span>{{ scope.row.type }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150" align="center">
        <template slot-scope="scope">
          <el-button @click='turnTo(scope.row.articleId)' plain type='primary' size="mini">编辑</el-button>
          <el-button @click="openDeleteBox(scope.row.articleId)" plain type='danger' size="mini">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
// import '@/utils/index.js'

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      list: null,
      listLoading: true,
    }
  },
  created() {
    this.getUserList()
   
  },
  methods: {
     //编辑
    turnTo(id){
        this.$router.push({path:'/articleManage/publish',query:{id:id,type:this.articleType}})  // type: draft/article
    },
    //确认删除框
     openDeleteBox(articleId) {
        this.$confirm('此操作将永久删除该文章, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.deleteArticle(articleId)
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
      },
    //删除
    deleteArticle(articleId){
        this.$api.article.deleteArticle({articleId,type:this.articleType})
        .then((data)=>{
            if(data.code===1){
                this.$message({
                  message:"删除成功！",
                  type:'success',
                  duration:1500
                })
                this.getArticleList()
            }
        })
    },
    getUserList() {
      this.listLoading = true
      this.$api.user.getAllUser()
      .then(data => {
        this.listLoading = false
        this.list = data.data
      })
    }
  }
}
</script>
