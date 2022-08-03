<template>
  <div>
    <el-table :data="list" border style="width: 100%">
      <el-table-column type="index" label="序号" width="50" align="center">
      </el-table-column>
      <el-table-column prop="skuName" label="名称" width="width">
      </el-table-column>
      <el-table-column prop="skuDesc" label="描述" width="width">
      </el-table-column>
      <el-table-column prop="skuDefaultImg" label="默认图片" width="150">
        <template slot-scope="{row}">
          <img :src="row.skuDefaultImg" style="width:100px;height:100px">
        </template>
      </el-table-column>
      <el-table-column prop="weight" label="重量" width="100">
      </el-table-column>
      <el-table-column prop="price" label="价格" width="100">
      </el-table-column>
      <el-table-column prop="prop" label="操作" width="width">
        <template slot-scope="{row}">
          <el-button type="success" icon="el-icon-sort-down" size="mini" v-if="row.isSale == 0" @click="sale(row)"></el-button>
          <el-button type="success" icon="el-icon-sort-up" size="mini" v-else @click="cancel(row)"></el-button>
          <el-button type="info" size="mini" icon="el-icon-info" @click="getSkuInfo(row)"></el-button>
          <el-button type="danger" size="mini" icon="el-icon-delete"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <el-pagination background style="margin-top: 20px; text-align: center" :current-page="page" :total="total" :page-size="limit" :pager-count="7" :page-sizes="[3, 5, 10]" @size-change="changeLimit" @current-change="getSkuList" layout="prev, pager, next, jumper,->,sizes,total">
    </el-pagination>
    <!-- 弹出抽屉 -->
    <el-drawer :visible.sync="show" :show-close="false" size="50%">
      <el-row>
        <el-col :span="5">名称</el-col>
        <el-col :span="16">{{skuInfo.skuName}}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">描述</el-col>
        <el-col :span="16">{{skuInfo.skuDesc}}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">价格</el-col>
        <el-col :span="16">{{skuInfo.price}}元</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">平台属性</el-col>
        <el-col :span="16">
          <template>
            <el-tag type="success" v-for="(attr,index) in skuInfo.skuAttrValueList" :key="attr.id" style="margin-right:10px">{{attr.attrId}}-{{attr.valueId}}</el-tag>
          </template>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="5">商品图片</el-col>
        <el-col :span="16">
          <el-carousel height="500px">
            <el-carousel-item v-for="item in skuInfo.skuImageList" :key="item.id">
              <img :src="item.imgUrl" style="height:500px;width:500px;">
            </el-carousel-item>
          </el-carousel>
        </el-col>
      </el-row>
    </el-drawer>
  </div>
</template>

<script>
export default {
  name: 'Sku',
  data () {
    return {
      page: 1,  //当前页码
      limit: 5, //每页记录数
      total: 0, //总条数
      list: [],
      skuInfo: {},
      show: false
    }
  },
  mounted () {
    this.getSkuList();
  },
  methods: {
    async getSkuList (pager = 1) {
      this.page = pager;
      const { page, limit } = this;
      let res = await this.$API.sku.reqGetSkuList(page, limit);
      // console.log(res);
      if (res.code == 200) {
        this.total = res.data.total;
        this.list = res.data.records;
      }
    },
    // 改变每页展示的数据条数
    changeLimit (val) {
      this.limit = val;
      this.getSkuList();
    },
    //上架
    async sale (row) {
      let result = await this.$API.sku.reqOnSale(row.id);
      if (result.code == 200) {
        row.isSale = 1;
        this.$message({ type: "success", message: "上架成功" });
      }
    },
    //下架
    async cancel (row) {
      let result = await this.$API.sku.reqCancelSale(row.id);
      if (result.code == 200) {
        row.isSale = 0;
        this.$message({ type: "success", message: "下架成功" });
      }
    },
    //获取SKU详情的方法
    async getSkuInfo (row) {
      //展示抽屉
      this.show = true;
      //获取SKU数据
      let result = await this.$API.sku.reqGetSkuBySpuId(row.id);
      if (result.code == 200) {
        this.skuInfo = result.data;
      }
    }
  }
}
</script>
<style>
.el-carousel__item h3 {
  color: #c3d1e4;
  font-size: 14px;
  opacity: 0.75;
  line-height: 200px;
  margin: 0;
}

.el-carousel__item:nth-child(2n) {
  background-color: #e9edf3;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #e9edf3;
}
</style>

<style scoped>
.el-row .el-col-5 {
  font-size: 18px;
  text-align: right;
}
.el-col {
  margin: 10px;
}
</style>

