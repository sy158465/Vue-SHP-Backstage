<template>
  <div>
    <!-- 第一个卡片 -->
    <el-card style="margin-bottom:15px;">
      <!-- 三级列表 -->
      <CategorySelect @getCategoryId="getCategoryId" :show="scene!='list'"></CategorySelect>
    </el-card>
    <!-- 第二个卡片 -->
    <el-card>
      <div v-show="scene=='list'">
        <!-- 按钮 -->
        <el-button type="primary" icon="el-icon-plus" style="margin-bottom:10px;" @click="addSpu" :disabled="!category3Id">
          添加Spu
        </el-button>

        <!-- 表格 -->
        <el-table style="width: 100%" border :data="list">
          <el-table-column type="index" label="序号" width="80" align="center">
          </el-table-column>
          <el-table-column prop="spuName" label="Spu名称" width="width">
          </el-table-column>
          <el-table-column prop="description" label="Spu描述" width="width">

          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{ row }">
              <hint-button type="success" icon="el-icon-plus" size="mini" title="添加Sku" @click="addSku(row)"></hint-button>
              <hint-button type="warning" icon="el-icon-edit" size="mini" title="修改Spu" @click="editSpu(row)"></hint-button>
              <hint-button type="info" icon="el-icon-info" size="mini" title="查看当前Spu全部Sku列表" @click="findSku(row)"></hint-button>
              <hint-button type="danger" icon="el-icon-delete" size="mini" title="删除SPu" @click="deleteSpu(row)"></hint-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页器 -->
        <el-pagination background style="margin-top: 20px; text-align: center" :current-page="page" :total="total" :page-size="limit" :pager-count="7" :page-sizes="[3, 5, 10]" @size-change="changeLimit" @current-change="getSpuList" layout="prev, pager, next, jumper,->,sizes,total">
        </el-pagination>
      </div>
      <SpuForm v-show="scene=='spu'" @changeScene="changeScene" ref="spu"></SpuForm>
      <SkuForm v-show="scene=='sku'" @changeScene="changeScene" ref="sku"></SkuForm>
    </el-card>
    <el-dialog :title="`${row.spuName}的sku列表`" :visible.sync="dialogTableVisible" :before-close="close">
      <el-table :data="skuTable" v-loading="loading">
        <el-table-column property="skuName" label="名称" width="width"></el-table-column>
        <el-table-column property="price" label="价格" width="width"></el-table-column>
        <el-table-column property="weight" label="重量" width="width"></el-table-column>
        <el-table-column property="skuDefaultImg" label="默认图片" width="width">
          <template slot-scope="{row}">
            <img :src="row.skuDefaultImg" style="width:100px;height:100px">
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import SkuForm from './SkuForm.vue'
import SpuForm from './SpuForm.vue'
export default {
  name: 'Spu',
  components: { SkuForm, SpuForm },
  data () {
    return {
      category1Id: "",
      category2Id: "",
      category3Id: "",
      page: 1,  //当前页码
      limit: 5, //每页记录数
      total: 0, //总条数
      // 是否展示添加或修改内容
      scene: 'list',
      list: [],
      row: {},               //弹出框需要用到的行的数据
      dialogTableVisible: false, //弹出框显示与隐藏
      skuTable: [],   //弹出框中的数据
      loading: true   //弹出框loading效果的显示与隐藏
    }
  },
  methods: {
    //自定义事件的回调
    getCategoryId ({ categoryId, level }) {
      //区分三级分类相应的id，以及父组件进行存储
      if (level == 1) {
        this.category1Id = categoryId;
        this.category2Id = "";
        this.category3Id = "";
      } else if (level == 2) {
        this.category2Id = categoryId;
        this.category3Id = "";
      } else {
        //代表三级分类的id有了
        this.category3Id = categoryId;
        this.getSpuList();
      }
    },
    // 给服务器发请求返回商品Spu数据
    async getSpuList (pager = 1) {
      this.page = pager;
      const { category3Id, page, limit } = this;
      let res = await this.$API.spu.reqGetSpuList(page, limit, category3Id);
      // console.log(res);
      if (res.code == 200) {
        this.total = res.data.total;
        this.list = res.data.records;
      }
    },
    // 改变每页展示的数据条数
    changeLimit (val) {
      this.limit = val;
      this.getSpuList();
    },
    // 点击添加Spu按钮
    addSpu () {
      this.scene = 'spu';
      this.$refs.spu.addSpuData(this.category3Id);
    },
    // 点击添加Sku按钮
    addSku (row) {
      this.scene = 'sku';
      this.$refs.sku.addSkuData(this.category1Id, this.category2Id, row);
    },
    // 点击修改Spu按钮
    editSpu (row) {
      this.scene = 'spu';
      // 通过ref给Spu表单子组件传递当前行的数据，需在Spu子组件创建initSpuData方法
      this.$refs.spu.initSpuData(row);
    },
    // 点击查看全部Sku列表按钮
    async findSku (row) {
      this.dialogTableVisible = true;
      this.row = row;
      let res = await this.$API.spu.reqGetSkuBySpuId(row.id);
      if (res.code == 200) {
        this.skuTable = res.data;
        //loading隐藏
        this.loading = false;
      }
    },
    //关闭对话框的回调
    close (done) {
      //loading属性再次变为真
      this.loading = true;
      //清除sku列表的数据
      this.skuList = [];
      //管理对话框
      done();
    },
    // 点击删除Spu红色按钮
    async deleteSpu (row) {
      this.$confirm(`此操作将永久删除Spu${row.spuName}, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        // 向服务器发请求
        let res = await this.$API.spu.reqDeleteSpuById(row.id);
        if (res.code == 200) {
          this.$message({ type: "success", message: "删除成功！" });
          this.getSpuList(this.records.length > 1 ? this.page : this.page - 1);
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    // 切换组件的事件
    changeScene ({ scene, flag }) {
      this.scene = scene;
      if (flag == '修改') {
        this.getSpuList(this.page);
      } else {
        this.getSpuList();
      }
    },
  }
}
</script>


