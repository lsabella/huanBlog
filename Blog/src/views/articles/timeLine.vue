<template>
  <div>
    <el-row type="flex" class="" justify="center">
      <el-col :span="11"><div class="row-bg title-center"><hr class="title-line"/></div></el-col>
      <el-col :span="2"><div class="grid-content title-center center">控制台</div></el-col>
      <el-col :span="11"><div class="row-bg title-center"><hr class="title-line"/></div></el-col>
    </el-row>
    <el-row type="flex" justify="center">
      <el-col :span="6"><div class="title-center center"><el-button type="primary" @click="addTimeline">添加时光轴</el-button></div></el-col>
    </el-row>

    <el-row type="flex" class="" justify="center">
      <el-col :span="11"><div class="row-bg title-center"><hr class="title-line"/></div></el-col>
      <el-col :span="3"><div class="grid-content title-center center">时光轴列表</div></el-col>
      <el-col :span="11"><div class="row-bg title-center"><hr class="title-line"/></div></el-col>
    </el-row>
    <el-table :data="tableData" stripe border style="width: 100%">
      <el-table-column align="center" label="发表时间" width="180">
        <template scope="scope">
          <el-icon name="time"></el-icon>
          <span style="margin-left: 10px">{{ scope.row.date }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="内容">
        <template scope="scope">
          <el-popover trigger="hover" placement="top">
            <p>姓名: {{ scope.row.name }}</p>
            <p>住址: {{ scope.row.address }}</p>
            <div slot="reference" class="name-wrapper">
              <span>{{ scope.row.name }}</span>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="180">
        <template scope="scope">
          <el-button type="primary" icon="edit" @click="handleEdit(scope.$index, scope.row)"></el-button>
          <el-button type="danger" icon="delete" @click="handleDelete(scope.$index, scope.row)"></el-button>
        </template>
      </el-table-column>
    </el-table>
        <pagination :totalList="listTotal" style="margin-top:20px;text-align:center;"></pagination>
  </div>
</template>

<script>
import pagination from '@/components/Pagination'
export default {
  name: 'manageArticles',
  data () {
    return {
             listTotal: {
               totalElements: 12,
               content: []
             },
     options: [{
       value: '选项1',
       label: '前端开发'
     }, {
       value: '选项2',
       label: '数据结构'
     }, {
       value: '选项3',
       label: '数据库'
     }, {
       value: '选项4',
       label: 'javascript'
     }, {
       value: '选项5',
       label: 'ES6'
     }],
     value4: '',
     options4: [],
     value9: [],
     list: [],
     loading: false,
     states: ["Alabama", "Alaska", "Arizona",
     "Arkansas", "California", "Colorado",
     "Connecticut", "Delaware", "Florida",
     "Georgia", "Hawaii", "Idaho", "Illinois",
     "Indiana", "Iowa", "Kansas", "Kentucky",
     "Louisiana", "Maine", "Maryland",
     "Massachusetts", "Michigan", "Minnesota",
     "Mississippi", "Missouri", "Montana",
     "Nebraska", "Nevada", "New Hampshire",
     "New Jersey", "New Mexico", "New York",
     "North Carolina", "North Dakota", "Ohio",
     "Oklahoma", "Oregon", "Pennsylvania",
     "Rhode Island", "South Carolina",
     "South Dakota", "Tennessee", "Texas",
     "Utah", "Vermont", "Virginia",
     "Washington", "West Virginia", "Wisconsin",
     "Wyoming"],
      tableData:[{
              date: '2016-05-02',
              name: 'array.splice(0, array.length) 清空数组',
              address: '上海市普陀区金沙江路 1518 弄'
            }, {
              date: '2016-05-04',
              name: '7月 冒个泡。等Layui2.0出来再搞研发。',
              address: '上海市普陀区金沙江路 1517 弄'
            }, {
              date: '2016-05-01',
              name: '严重拖延症。什么都不想做。',
              address: '上海市普陀区金沙江路 1519 弄'
            }, {
              date: '2016-05-03',
              name: '不做笔记是个坏习惯！',
              address: '上海市普陀区金沙江路 1516 弄'
            }, {
              date: '2016-05-03',
              name: '不做笔记是个坏习惯！',
              address: '上海市普陀区金沙江路 1516 弄'
            }, {
              date: '2016-05-03',
              name: '不做笔记是个坏习惯！',
              address: '上海市普陀区金沙江路 1516 弄'
            }, {
              date: '2016-05-03',
              name: '不做笔记是个坏习惯！',
              address: '上海市普陀区金沙江路 1516 弄'
            }]
             }
  },
  mounted() {
    this.list = this.states.map(item => {
      return { value: item, label: item };
    });
  },
  components: {
      pagination
    },
  methods: {
    remoteMethod(query) {
      if (query !== '') {
        this.loading = true;
        setTimeout(() => {
          this.loading = false;
          this.options4 = this.list.filter(item => {
            return item.label.toLowerCase()
              .indexOf(query.toLowerCase()) > -1;
          });
        }, 200);
      } else {
        this.options4 = [];
      }
    },
    handleEdit(index, row) {
      this.$router.push({path: '/timeLineadd'})
      console.log(index, row);
    },
    handleDelete(index, row) {
      console.log(index, row);
    },
    addTimeline () {
      this.$router.push({path: '/timeLineadd'})
    }
  }
}
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
  .title-line {
    margin:0px;
    height:1px;
    border:0px;
    background-color:#e2e2e2;
  }
</style>
