//这个事原来的articleMan
<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="标题" v-model="listQuery.title">
      </el-input>

      <el-select clearable class="filter-item" style="width: 130px" v-model="listQuery.type" placeholder="类型">
        <el-option v-for="item in  calendarTypeOptions" :key="item.key" :label="item.display_name+'('+item.key+')'" :value="item.key">
        </el-option>
      </el-select>

      <el-select @change='handleFilter' style="width: 120px" class="filter-item" v-model="listQuery.sort" placeholder="排序">
        <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key">
        </el-option>
      </el-select>

      <el-button class="filter-item" type="primary" v-waves icon="search" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="edit">发布文章</el-button>
      <el-button class="filter-item" type="primary" icon="document" @click="handleDownload">导出</el-button>
      <el-checkbox class="filter-item" @change='tableKey=tableKey+1' v-model="showAuditor">显示审核人</el-checkbox>
    </div>

    <el-table :key='tableKey' :data="list" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%;margin-top:20px;">

      <el-table-column align="center" label="序号" width="65">
        <template scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>

      <el-table-column width="180px" align="center" label="时间">
        <template scope="scope">
          <span>{{scope.row.timestamp | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="300px" label="标题">
        <template scope="scope">
          <span class="link-type" @click="handleUpdate(scope.row)">{{scope.row.title}}</span>
          <el-tag>{{scope.row.type | typeFilter}}</el-tag>
        </template>
      </el-table-column>

      <el-table-column width="110px" align="center" label="作者">
        <template scope="scope">
          <span>{{scope.row.author}}</span>
        </template>
      </el-table-column>

      <el-table-column width="110px" v-if='showAuditor' align="center" label="审核人">
        <template scope="scope">
          <span style='color:red;'>{{scope.row.auditor}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="阅读数" width="95">
        <template scope="scope">
          <span class="link-type" @click='handleFetchPv(scope.row.pageviews)'>{{scope.row.pageviews}}</span>
        </template>
      </el-table-column>

      <el-table-column class-name="status-col" label="状态" width="90">
        <template scope="scope">
          <el-tag :type="scope.row.status | statusFilter">{{scope.row.status}}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="150">
        <template scope="scope">
          <el-button v-if="scope.row.status!='published'" size="small" type="success" @click="handleModifyStatus(scope.row,'published')">发布
          </el-button>
          <el-button v-if="scope.row.status!='draft'" size="small" @click="handleModifyStatus(scope.row,'draft')">草稿
          </el-button>
          <el-button v-if="scope.row.status!='deleted'" size="small" type="danger" @click="handleModifyStatus(scope.row,'deleted')">删除
          </el-button>
        </template>
      </el-table-column>

    </el-table>

    <div v-show="!listLoading" class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page"
        :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form class="small-space" :model="temp" label-position="left" label-width="70px" style='width: 400px; margin-left:50px;'>
        <el-form-item label="类型">
          <el-select class="filter-item" v-model="temp.type" placeholder="请选择">
            <el-option v-for="item in  calendarTypeOptions" :key="item.key" :label="item.display_name" :value="item.key">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="状态">
          <el-select class="filter-item" v-model="temp.status" placeholder="请选择">
            <el-option v-for="item in  statusOptions" :key="item" :label="item" :value="item">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="时间">
          <el-date-picker v-model="temp.timestamp" type="datetime" placeholder="选择日期时间">
          </el-date-picker>
        </el-form-item>

        <el-form-item label="标题">
          <el-input v-model="temp.title"></el-input>
        </el-form-item>

        <el-form-item label="点评">
          <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入内容" v-model="temp.remark">
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="create">确 定</el-button>
        <el-button v-else type="primary" @click="update">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="阅读数统计" :visible.sync="dialogPvVisible" size="small">
      <el-table :data="pvData" border fit highlight-current-row style="width: 100%">
        <el-table-column prop="key" label="渠道"> </el-table-column>
        <el-table-column prop="pv" label="pv"> </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible = false">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
  const calendarTypeOptions = [
      { key: 'CN', display_name: '中国' },
      { key: 'US', display_name: '美国' },
      { key: 'JP', display_name: '日本' },
      { key: 'EU', display_name: '欧元区' }
  ];

  // arr to obj
  const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
    acc[cur.key] = cur.display_name;
    return acc
  }, {});

  export default {
    name: 'table_demo',
    data() {
      return {
        list: null,
        total: null,
        listLoading: true,
        listQuery: {
          page: 1,
          limit: 20,
          importance: undefined,
          title: undefined,
          type: undefined,
          sort: '+id'
        },
        temp: {
          id: undefined,
          importance: 0,
          remark: '',
          timestamp: 0,
          title: '',
          type: '',
          status: 'published'
        },
        importanceOptions: [1, 2, 3],
        calendarTypeOptions,
        sortOptions: [{ label: '按ID升序列', key: '+id' }, { label: '按ID降序', key: '-id' }],
        statusOptions: ['published', 'draft', 'deleted'],
        dialogFormVisible: false,
        dialogStatus: '',
        textMap: {
          update: '编辑',
          create: '创建'
        },
        dialogPvVisible: false,
        pvData: [],
        showAuditor: false,
        tableKey: 0
      }
    },
    created() {
      this.getList();
    },
    filters: {
      statusFilter(status) {
        const statusMap = {
          published: 'success',
          draft: 'gray',
          deleted: 'danger'
        };
        return statusMap[status]
      },
      typeFilter(type) {
        return calendarTypeKeyValue[type]
      }
    },
    methods: {
      getList() {
        this.listLoading = true;
          this.list = [
                          {
                              "id": 1,
                              "timestamp": 987620903291,
                              "author": "卢敏",
                              "auditor": "萧艳",
                              "title": "又层装好则社精知算张但明人",
                              "forecast": 49.12,
                              "importance": 3,
                              "type": "US",
                              "status": "published",
                              "pageviews": 4975
                          },
                          {
                              "id": 2,
                              "timestamp": 520318010302,
                              "author": "马洋",
                              "auditor": "毛静",
                              "title": "信众看为话六除飞什压些界",
                              "forecast": 13.25,
                              "importance": 3,
                              "type": "US",
                              "status": "draft",
                              "pageviews": 3920
                          },
                          {
                              "id": 3,
                              "timestamp": 1124653022657,
                              "author": "阎敏",
                              "auditor": "钱超",
                              "title": "就规议图了这五参深经文观何得",
                              "forecast": 63.72,
                              "importance": 3,
                              "type": "JP",
                              "status": "published",
                              "pageviews": 4323
                          },
                          {
                              "id": 4,
                              "timestamp": 694372012080,
                              "author": "朱平",
                              "auditor": "董杰",
                              "title": "们求是点而明打查从是管",
                              "forecast": 26.42,
                              "importance": 3,
                              "type": "CN",
                              "status": "draft",
                              "pageviews": 1737
                          },
                          {
                              "id": 5,
                              "timestamp": 467615048537,
                              "author": "苏秀兰",
                              "auditor": "江芳",
                              "title": "形难说感事什北放支习究维六只",
                              "forecast": 13.68,
                              "importance": 1,
                              "type": "CN",
                              "status": "draft",
                              "pageviews": 959
                          },
                          {
                              "id": 6,
                              "timestamp": 951548610601,
                              "author": "贺桂英",
                              "auditor": "董娟",
                              "title": "来所候资最油专年于约步学京",
                              "forecast": 24.46,
                              "importance": 2,
                              "type": "JP",
                              "status": "draft",
                              "pageviews": 2778
                          },
                          {
                              "id": 7,
                              "timestamp": 153419491643,
                              "author": "阎娜",
                              "auditor": "任霞",
                              "title": "眼毛文只转四育格说少素最广金保重系变",
                              "forecast": 49.11,
                              "importance": 1,
                              "type": "US",
                              "status": "published",
                              "pageviews": 3680
                          },
                          {
                              "id": 8,
                              "timestamp": 858447596364,
                              "author": "黄平",
                              "auditor": "范涛",
                              "title": "办里安类委术速况总织义动元出安然",
                              "forecast": 34.86,
                              "importance": 2,
                              "type": "US",
                              "status": "draft",
                              "pageviews": 2458
                          },
                          {
                              "id": 9,
                              "timestamp": 1442957479138,
                              "author": "李勇",
                              "auditor": "袁秀兰",
                              "title": "代新团打却界度然西活",
                              "forecast": 18.45,
                              "importance": 2,
                              "type": "US",
                              "status": "published",
                              "pageviews": 561
                          },
                          {
                              "id": 10,
                              "timestamp": 109711730766,
                              "author": "曾丽",
                              "auditor": "苏超",
                              "title": "照年活经任交布酸张满特达律",
                              "forecast": 7.15,
                              "importance": 2,
                              "type": "US",
                              "status": "draft",
                              "pageviews": 2195
                          },
                          {
                              "id": 11,
                              "timestamp": 1160836272918,
                              "author": "江秀兰",
                              "auditor": "赵秀兰",
                              "title": "教知达他太就建七问红却发",
                              "forecast": 88.36,
                              "importance": 2,
                              "type": "CN",
                              "status": "published",
                              "pageviews": 457
                          },
                          {
                              "id": 12,
                              "timestamp": 1076012546956,
                              "author": "张敏",
                              "auditor": "郑磊",
                              "title": "管斗道个将制速么先二作单族确际",
                              "forecast": 54.62,
                              "importance": 2,
                              "type": "US",
                              "status": "deleted",
                              "pageviews": 4036
                          },
                          {
                              "id": 13,
                              "timestamp": 520541833591,
                              "author": "徐军",
                              "auditor": "方杰",
                              "title": "那到原省指严九过委料还质道走史",
                              "forecast": 95.85,
                              "importance": 2,
                              "type": "US",
                              "status": "draft",
                              "pageviews": 1357
                          },
                          {
                              "id": 14,
                              "timestamp": 478410641716,
                              "author": "郑涛",
                              "auditor": "董磊",
                              "title": "住连结极务管下速又走",
                              "forecast": 20.42,
                              "importance": 2,
                              "type": "CN",
                              "status": "draft",
                              "pageviews": 696
                          }
                      ];
          this.total = 14;
          this.listLoading = false;
      },
      handleFilter() {
        this.getList();
      },
      handleSizeChange(val) {
        this.listQuery.limit = val;
        this.getList();
      },
      handleCurrentChange(val) {
        this.listQuery.page = val;
        this.getList();
      },
      timeFilter(time) {
        if (!time[0]) {
          this.listQuery.start = undefined;
          this.listQuery.end = undefined;
          return;
        }
        this.listQuery.start = parseInt(+time[0] / 1000);
        this.listQuery.end = parseInt((+time[1] + 3600 * 1000 * 24) / 1000);
      },
      handleModifyStatus(row, status) {
        this.$message({
          message: '操作成功',
          type: 'success'
        });
        row.status = status;
      },
      handleCreate() {
        this.$router.push({name: 'articlesAdd'})
      },
      handleUpdate(row) {
        this.temp = Object.assign({}, row);
        this.dialogStatus = 'update';
        this.dialogFormVisible = true;
      },
      handleDelete(row) {
        this.$notify({
          title: '成功',
          message: '删除成功',
          type: 'success',
          duration: 2000
        });
        const index = this.list.indexOf(row);
        this.list.splice(index, 1);
      },
      create() {
        this.temp.id = parseInt(Math.random() * 100) + 1024;
        this.temp.timestamp = +new Date();
        this.temp.author = '原创作者';
        this.list.unshift(this.temp);
        this.dialogFormVisible = false;
        this.$notify({
          title: '成功',
          message: '创建成功',
          type: 'success',
          duration: 2000
        });
      },
      update() {
        this.temp.timestamp = +this.temp.timestamp;
        for (const v of this.list) {
          if (v.id === this.temp.id) {
            const index = this.list.indexOf(v);
            this.list.splice(index, 1, this.temp);
            break;
          }
        }
        this.dialogFormVisible = false;
        this.$notify({
          title: '成功',
          message: '更新成功',
          type: 'success',
          duration: 2000
        });
      },
      resetTemp() {
        this.temp = {
          id: undefined,
          importance: 0,
          remark: '',
          timestamp: 0,
          title: '',
          status: 'published',
          type: ''
        };
      },
      handleFetchPv(pv) {
        fetchPv(pv).then(response => {
          this.pvData = response.data.pvData;
          this.dialogPvVisible = true;
        })
      },
      handleDownload() {
        require.ensure([], () => {
          const { export_json_to_excel } = require('vendor/Export2Excel');
          const tHeader = ['时间', '地区', '类型', '标题'];
          const filterVal = ['timestamp', 'province', 'type', 'title'];
          const data = this.formatJson(filterVal, this.list);
          export_json_to_excel(tHeader, data, 'table数据');
        })
      },
      formatJson(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => {
          if (j === 'timestamp') {
            var timeFomat = new Date(v[j])
            return timeFomat.toLocaleString()
          } else {
            return v[j]
          }
        }))
      }
    }
  }
</script>
<style scoped>
.filter-container {
 margin-top:20px;
}
</style>
