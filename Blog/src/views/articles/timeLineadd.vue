<template>
  <div class="components-container">
    <el-row type="flex" class="row-bg" justify="center">
      <el-col :span="6"><div class="grid-content title-center center">添加时光轴</div></el-col>
    </el-row>
    <div class="editor-container">
      <md-editor id='contentEditor' ref="contentEditor" v-model='content' :height="180" :zIndex='0'></md-editor>
    </div>
    <el-button @click='markdown2Html' style="margin-top:80px;" type="primary">预览<i class="el-icon-document el-icon--right"></i></el-button>
    <el-button @click='submitLine' style="margin-top:80px;float:right;" type="primary">立即提交</el-button>
    <el-button @click='goLinelists' style="margin-top:80px;float:right;" type="primary">返回列表</el-button>
    <div v-html="html"></div>
  </div>
</template>

<script>
  import MdEditor from '@/components/MdEditor';
  export default {
    components: { MdEditor },
    data() {
      return {
        content: '## Simplemde',
        html: ''
      }
    },
    methods: {
      markdown2Html() {
        import('showdown').then(showdown => {
          const converter = new showdown.Converter();
          this.html = converter.makeHtml(this.content)
        })
      },
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
    padding: 10px 0;
    background-color: #f9fafc;
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
</style>

