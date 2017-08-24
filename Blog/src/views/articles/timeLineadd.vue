<template>
  <div>
     <el-row type="flex" class="" justify="center">
       <el-col :span="11"><div class="row-bg title-center"><hr class="title-line"/></div></el-col>
       <el-col :span="3"><div class="grid-content title-center center">添加时光轴</div></el-col>
       <el-col :span="11"><div class="row-bg title-center"><hr class="title-line"/></div></el-col>
     </el-row>
     <el-row type="flex" class="" justify="center">
      <el-col :span="2"><span style="float:right;padding-right:20px;padding-top:10px;">内容</span></el-col>
      <el-col :span="18" class="components-container">
         <div style="margin-bottom:20px;">
           <Tinymce :height=200 ref="editor" v-model="content"></Tinymce>
         </div>
         <el-button @click.native="submitLine">立即提交</el-button>
         <el-button type="primary" @click.native="goLinelists">返回列表</el-button>
         <div class='editor-content' style="margin-top:20px;" v-html='content'></div>
       </el-col>
       <el-col :span="1"></el-col>
     </el-row>
  </div>
</template>

<script>
  import Tinymce from '@/components/Tinymce';
  export default {
    components: { Tinymce },
    data() {
      return {
        content: 'Tinymce'
      }
    },
    methods: {
      goLinelists () {
       this.$router.push({path: '/timeLine'})
      },
      submitLine () {
       console.log('提交时光轴')
      }
    }
  };
</script>

<style scoped lang="scss">
.el-row {
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0;
    }
  }
  .el-col {
    border-radius: 4px;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
    .center {
     text-align: center;
    }
    .display {
     display: block;
    }
  }
  .row-bg {
    padding: 15px 0;
  }
  .title-center {
    font-size: 20px;
    line-height: 36px;
  }
  .el-row {
      margin-bottom: 20px;
      &:last-child {
        margin-bottom: 0;
      }
    }
  .el-col {
    border-radius: 4px;
  }
  .title-line {
    margin:0px;
    height:1px;
    border:0px;
    background-color:#e2e2e2;
  }
</style>

