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
          {{scope.row.email}}
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
         <span>{{ scope.row.type | typeFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150" align="center">
        <template slot-scope="scope">
          <el-button @click='openEditBox(scope.row)' plain type='primary' size="mini">编辑</el-button>
          <el-button @click="openDeleteBox(scope.row.userId)" plain type='danger' size="mini">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 编辑窗 -->
    <el-dialog
      title="编辑用户"
      :visible.sync="editStatus"
      width="30%"
      >
      <el-form  status-icon  label-width="70px" class="demo-ruleForm">
        <el-form-item label="用户名">
          <el-input v-model="theUserName"></el-input>
        </el-form-item>
        <el-form-item label="权限">
          <el-input v-model="theType" type='number'></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size='small' @click="editStatus = false">取 消</el-button>
        <el-button size='small' type="primary" @click="editUser">确 定</el-button>
      </span>
    </el-dialog>
  </div>

  
</template>

<script>
// import '@/utils/index.js'

import {mapGetters} from 'vuex'
export default {
   computed:{
    ...mapGetters(['userType'])
  },
 filters:{
   typeFilter(type){
     const typeMap = {
       0:'管理员',
       1:'用户'
     }
     return typeMap[type]
   }
 },
  data() {
    return {
      list: null,
      listLoading: true,
      editStatus:false,
      theUserId:'',
      theUserName:'',
      theType:'',
    }
  },
  created() {
    this.getUserList()
   
  },
  methods: {
     //编辑用户
    editUser(){
       if(this.userType != 0){
        this.$message.warning('需要管理员权限！')
        return
      }
      this.$api.user.updateUser({
        userId:this.theUserId,
        userName:this.theUserName,
        type:this.theType
      })
      .then((data)=>{
        if(data.code == 1){
          this.editStatus = false;
          this.$message.success("修改成功!")
          this.getUserList()
        }else if(data.code == 300){
          this.$message.error("用户名重复!")
        }else{
          this.$message.error("server error!")
        }
      })
    },
    //打开编辑弹窗
    openEditBox(theUserInfo){
      this.editStatus = true;
      this.theUserId = theUserInfo.userId
      this.theUserName = theUserInfo.userName
      this.theType = theUserInfo.type
    },
    //确认删除框
     openDeleteBox(userId) {
        this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.deleteUser(userId)
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
      },
    //删除
    deleteUser(userId){
       if(this.userType != 0){
        this.$message.warning('需要管理员权限！')
        return
      }
        this.$api.user.deleteUser({userId})
        .then((data)=>{
            if(data.code===1){
                this.$message({
                  message:"删除成功！",
                  type:'success',
                  duration:1500
                })
                this.getUserList()
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
