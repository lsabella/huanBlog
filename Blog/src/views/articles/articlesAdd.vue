<template>
 <div>
     <el-row type="flex" class="" justify="center">
       <el-col :span="11"><div class="row-bg title-center"><hr class="title-line"/></div></el-col>
       <el-col :span="3"><div class="grid-content title-center center">添加文章</div></el-col>
       <el-col :span="11"><div class="row-bg title-center"><hr class="title-line"/></div></el-col>
     </el-row>
    <div class="createPost-container">
      <el-form class="form-container" :model="postForm" :rules="rules" ref="postForm">
        <div class="createPost-main-container">
          <el-row type="flex" justify="center">
            <el-col :span="20">
              <el-form-item style="margin-bottom: 30px;" prop="title">
                <MDinput name="name" v-model="postForm.title" required :maxlength="100">
                  标题
                </MDinput>
                <span v-show="postForm.title.length>=26" class='title-prompt'>app可能会显示不全</span>
              </el-form-item>

              <div class="postInfo-container">
                <el-row type="flex" justify="center">
                  <el-col :span="12">
                    <el-form-item label-width="45px" label="作者:" class="postInfo-container-item">
                      <el-input v-model="postForm.author" :options="userLIstOptions" @search-change="getRemoteUserList" placeholder="搜索用户" selectLabel="选择"
                        deselectLabel="删除" track-by="key" :internalSearch="false" label="key">
                        <span slot='noResult'>无结果</span>
                      </el-input >
                    </el-form-item>
                  </el-col>

                  <el-col :span="12">
                    <el-tooltip class="item" effect="dark" content="将替换作者" placement="top">
                      <el-form-item label-width="45px" label="来源:" class="postInfo-container-item">
                        <el-input placeholder="将替换作者" style='min-width:150px;' v-model="postForm.source_name">
                        </el-input>
                      </el-form-item>
                    </el-tooltip>
                  </el-col>

                  <el-col :span="12">
                    <el-form-item label-width="80px" label="发布时间:" class="postInfo-container-item">
                      <el-date-picker v-model="postForm.display_time" type="datetime" format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期时间">
                      </el-date-picker>
                    </el-form-item>
                  </el-col>
                </el-row>
              </div>
            </el-col>
          </el-row>

        <el-row type="flex" justify="center">
           <el-col :span="20">
              <el-form-item style="margin-bottom: 30px;" label-width="45px" label="摘要:">
                <el-input class="article-textarea" :rows="1" autosize placeholder="请输入内容" v-model="postForm.content_short">
                </el-input>
                <span class="word-counter" v-show="contentShortLength">{{contentShortLength}}字</span>
              </el-form-item>
           </el-col>
        </el-row>


         <el-row type="flex" class="" justify="center">
            <el-col :span="20">
              <el-form-item style="margin-bottom: 30px;" label-width="45px" label="分类:">
                <el-select clearable class="filter-item" v-model="postForm.content_short" placeholder="类型">
                  <el-option v-for="item in  calendarTypeOptions" :key="item.key" :label="item.display_name+'('+item.key+')'" :value="item.key">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
         </el-row>


         <el-row type="flex" class="" justify="center">
          <el-col :span="2"><span style="float:right;padding-right:20px;padding-top:10px;color:#48576a;">文本域</span></el-col>
          <el-col :span="19" class="components-container">
            <div class="editor-container">
              <Tinymce ref="editor" v-model="postForm.content"></Tinymce>
            </div>
            <el-button @click.native="submitArticle">立即提交</el-button>
            <el-button type="primary" @click.native="goArticlelists">返回列表</el-button>
            <div class='editor-content' v-html='postForm.content'></div>
          </el-col>
          <el-col :span="1"></el-col>
         </el-row>

        </div>
      </el-form>

    </div>
 </div>
</template>

<script>
  import Tinymce from '@/components/Tinymce'
  import MDinput from '@/components/MDinput'
  import { validateURL } from '@/utils/validate'

  const calendarTypeOptions = [
      { key: 'CN', display_name: '中国' },
      { key: 'US', display_name: '美国' },
      { key: 'JP', display_name: '日本' },
      { key: 'EU', display_name: '欧元区' }
  ];

  export default {
    name: 'articleDetail',
    components: { Tinymce, MDinput },
    data() {
      const validateRequire = (rule, value, callback) => {
        if (value === '') {
          this.$message({
            message: rule.field + '为必传项',
            type: 'error'
          });
          callback(null)
        } else {
          callback()
        }
      };
      const validateSourceUri = (rule, value, callback) => {
        if (value) {
          if (validateURL(value)) {
            callback()
          } else {
            this.$message({
              message: '外链url填写不正确',
              type: 'error'
            });
            callback(null)
          }
        } else {
          callback()
        }
      };
      return {
        postForm: {
          title: '', // 文章题目
          content: '', // 文章内容
          content_short: '', // 文章摘要
          source_uri: '', // 文章外链
          image_uri: '', // 文章图片
          source_name: '', // 文章外部作者
          display_time: undefined, // 前台展示时间
          id: undefined,
          platforms: ['a-platform']
        },
        fetchSuccess: true,
        loading: false,
        calendarTypeOptions,
        userLIstOptions: [],
        platformsOptions: [
            { key: 'a-platform', name: 'a-platform' },
            { key: 'b-platform', name: 'b-platform' },
            { key: 'c-platform', name: 'c-platform' }
        ],
        rules: {
          image_uri: [{ validator: validateRequire }],
          title: [{ validator: validateRequire }],
          content: [{ validator: validateRequire }],
          source_uri: [{ validator: validateSourceUri, trigger: 'blur' }]
        }
      }
    },
    computed: {
      contentShortLength() {
        return this.postForm.content_short.length
      },
      isEdit() {
        return this.$route.meta.isEdit // 根据meta判断
          // return this.$route.path.indexOf('edit') !== -1 // 根据路由判断
      }
    },
    created() {
      if (this.isEdit) {
        this.fetchData();
      }
    },
    methods: {
      submitArticle () {
       console.log('提交待发布文章')
      },
      goArticlelists () {
       this.$router.push({path: '/articlesManage'})
      },
      fetchData() {
          this.fetchSuccess = false
      },
      submitForm() {
        this.postForm.display_time = parseInt(this.display_time / 1000);
        console.log(this.postForm)
        this.$refs.postForm.validate(valid => {
          if (valid) {
            this.loading = true;
            this.$notify({
              title: '成功',
              message: '发布文章成功',
              type: 'success',
              duration: 2000
            });
            this.postForm.status = 'published';
            this.loading = false;
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      draftForm() {
        if (this.postForm.content.length === 0 || this.postForm.title.length === 0) {
          this.$message({
            message: '请填写必要的标题和内容',
            type: 'warning'
          });
          return;
        }
        this.$message({
          message: '保存成功',
          type: 'success',
          showClose: true,
          duration: 1000
        });
        this.postForm.status = 'draft';
      },
      getRemoteUserList(query) {
        userSearch(query).then(response => {
          if (!response.data.items) return;
          console.log(response)
          this.userLIstOptions = response.data.items.map(v => ({
            key: v.name
          }));
        })
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  @import "src/styles/mixin.scss";
  .title-prompt{
    position: absolute;
    right: 0px;
    font-size: 12px;
    top:10px;
    color:#ff4949;
  }
  .createPost-container {
    position: relative;
    .createPost-main-container {
      padding: 5px 45px 20px 50px;
      .postInfo-container {
        position: relative;
        @include clearfix;
        margin-bottom: 10px;
        .postInfo-container-item {
          float: left;
        }
      }
      .editor-container {
        min-height: 500px;
        margin: 0 0 30px;
        .editor-upload-btn-container {
            text-align: right;
            margin-right: 10px;
            .editor-upload-btn {
                display: inline-block;
            }
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
      .title-line {
        margin:0px;
        height:1px;
        border:0px;
        background-color:#e2e2e2;
      }
    .filter-item {
      width: 100%;
    }
</style>
