<template>
  <div class="block">
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    :current-page="currentPage"
      :page-sizes="[5, 10, 15, 20]"
      :page-size="currentPagSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="totalList.totalElements">
    </el-pagination>
  </div>
</template>
<script type="text/ecmascript-6">
import {mapActions, mapState} from 'vuex'
export default {
  name: 'pagination',
  data () {
    return {
      orgid: '',
      currentPage: 1,
      currentPagSize: 10
    }
  },
  methods: {
    ...mapActions(
      [
        'getUserinfoDetail'
      ]
    ),
    handleSizeChange (val) {
      this.currentPagSize = val
      this.currentPage = 1
      this.$emit('refresh', {'orgid': this.userinfoOrgid, 'page': 0, 'size': this.currentPagSize})
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.$emit('loadagain', {'orgid': this.userinfoOrgid, 'page': (this.currentPage - 1), 'size': this.currentPagSize})
    }
  },
  props: {
    totalList: {
      totalElements: {
        type: Number
      },
      datas: {
      }
    }
  },
  computed: {
    ...mapState({
      userinfoOrgid: state => state.app.userinfoDetail
    })
  },
  created () {
  }
}
</script>
<style lang="scss" scoped>
  .pre-next{
    display: flex;
    align-items: flex-start;
  }
  .item{
    cursor: pointer;
    margin-right: 1rem;
  }
  .item:HOVER{
    color: #66c8fa
  }
  .number {
    border-radius: 0;
  }
</style>
