<template>
  <div class="dashboard-container">
    <div class="dashboard-text">用户: {{ name }}</div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
// import { mapGetters } from 'vuex'

export default {
  name: 'home',
  computed: {
    ...mapState('user',[
      'name'
    ])
    // ...mapGetters([
    //   'name'
    // ])
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 24px;
    line-height: 30px;
  }
}
</style>
