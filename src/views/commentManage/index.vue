<template>
  <div class="container">
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
      width="180">
    </el-table-column>
     <el-table-column
      label="评论对象"
      width="180">
      <template slot-scope="scope">
        <span v-if="scope.row.articleId">{{scope.row.articleTitle}}</span>
        <span v-else>@{{scope.row.toUser.userName}}</span>
      </template>
    </el-table-column>
    <el-table-column
      prop="content"
      label="评论内容"
      width="180">
    </el-table-column>
    <el-table-column
      prop="checkStatus"
      label="审核状态">
      <template slot-scope="scope">
          <el-select placeholder="默认通过" v-model="checkStatus[scope.$index]">
            <el-option label="折叠" value="折叠"></el-option>
            <el-option label="删除" value="删除"></el-option>
          </el-select>
      </template>
    </el-table-column>
    <el-table-column
      prop="action"
      label="操作">
      <template slot-scope="scope">
         <el-button plain size='mini' type="primary" @click="handleReply(scope.$index, scope.row)">回复</el-button>
         <el-button plain size='mini' type='danger'  @click="handleDelete(scope.$index, scope.row)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
  <el-pagination
    style="text-align:center;margin-top:10px;"
    background
    layout="prev, pager, next"
    :total="1000">
  </el-pagination>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Dashboard',
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  data() {
      return {
        actionStatus:[],
        checkStatus:[],
        commentList:[],
      }
    },
    methods: {
      //格式化时间
      formatTableTime(row){
       return this.parseTime(row.created_time)
      },
      //获取所有评论列表
      getCommentList(){
        this.$api.article.getCommentList(
          {start:0,row:10}
        ).then(data=>{
          if(data.code==1){
            this.commentList = data.data
            for(let ele of this.commentList){
              ele.children = ele.sub_comment
            }
          }
        })
      },
      //回复
      handleReply(index, row) {
        console.log(index, row);
      },
      //删除
      handleDelete(index, row) {
        console.log(index, row);
      }
    },
    mounted() {
      this.getCommentList()
    },
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
.container /deep/ .el-table__indent{
  padding-left: 0px!important;
}
.container /deep/ .el-table__row--level-1{
  background:#dce0e4;
}
.container /deep/ .hover-row>td{
  background:none!important;
}
</style>
