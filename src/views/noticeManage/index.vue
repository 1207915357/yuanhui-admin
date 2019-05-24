<template>
  <div class="app-container">
    <el-form label-width="120px">
      <el-form-item label="通知用户">
        <el-select style="width:300px;"
                    v-model="authorId"
                    default-first-option
                    multiple 
                    @change="selectChange"
                    placeholder="选择用户">
                    <el-option
                            v-for="item in userList"
                            :key="item.userName"
                            :disabled="item.disabled"
                            :label="item.userName"
                            :value="item.userId">
                    </el-option>
          </el-select>
      </el-form-item>
      <el-form-item label="通知内容">
        <el-input v-model.trim="content"  type="textarea" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit" size="small" style="float:right;">发布</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      content:"",
      userList: [],
      authorId:[],
      userId:"950dac10-3fc1-11e9-bed4-1134d355bff7" // yh
    }
  },
  methods: {
    //发布
    onSubmit() {
      if(this.authorId==""||this.content==""){
        this.$message.info('请添加完整信息！')
        return
      }
      let type 
      if(this.authorId[0]=="0"){
        type='all'
      }else if(this.authorId[0] !="0"&&this.authorId.length==1){
        type='one'
      }else{
        type='more'
      }
      this.$api.notice.noticeAllUser(
        {
          userId:this.userId,
          content:this.content,
          toUserId:this.authorId,
          type
        }
      ).then(data=>{
        if (data.code==1){
           this.$message.success('发布成功！')
           this.content = ''
          }else{
           this.$message.error(data.msg)
          }
      }).catch((data)=>{
            console.log(data,'err')
      })
    },
    //
    selectChange(valArr){
      // console.log(valArr)
      if(valArr[0]=="0"){
        for(let [i,ele] of this.userList.entries()){
          if(i !=0 ){
            // this.$set(ele, disabled ,true);
            ele.disabled = true;
          }
        }
      }else if(valArr.length==0){
        for(let ele of this.userList){
            ele.disabled = false;
          }
      }else if(valArr[0]!="0"){
        this.userList[0].disabled = true;
      }
    },
     //获取所有用户
      getAllUser(query) {
        this.$api.user.getAllUser().then(data => {
          if (data.code==1){
            this.userList = data.data
            this.userList.unshift({userName:'全部',userId:'0'})
          }
        })
      },
  
  },
  mounted(){
    this.getAllUser()
  },
}
</script>

<style scoped>

</style>

