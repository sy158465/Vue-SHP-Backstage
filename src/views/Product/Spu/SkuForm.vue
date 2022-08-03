<template>
  <div>
    <el-form ref="form" label-width="80px" :model="skuForm">
      <el-form-item label="Spu名称">
        {{row.spuName}}
      </el-form-item>
      <el-form-item label="Sku名称">
        <el-input placeholder="Spu名称" v-model="skuForm.skuName"></el-input>
      </el-form-item>
      <el-form-item label="价格(元)">
        <el-input-number controls-position="right" :min="1" style="width:100%" v-model="skuForm.price"></el-input-number>
      </el-form-item>
      <el-form-item label="重量(Kg)">
        <el-input placeholder="重量(Kg)" v-model="skuForm.weight"></el-input>
      </el-form-item>
      <el-form-item label="规格描述">
        <el-input type="textarea" rows="4" placeholder="描述" v-model="skuForm.skuDesc"></el-input>
      </el-form-item>
      <el-form-item label="平台属性">
        <el-form :inline="true" ref="form" label-width="80px">
          <el-form-item :label="item.attrName" v-for="item in attrInfoList" :key="item.id">
            <el-select placeholder="请选择" v-model="item.attrIdAndValueId">
              <el-option v-for="value in item.attrValueList" :key="value.id" :label="value.valueName" :value="`${item.id}:${value.id}`"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-form :inline="true" ref="form" label-width="80px">
          <el-form-item :label="item.saleAttrName" v-for="item in spuSaleAttrList" :key="item.id">
            <el-select placeholder="请选择" v-model="item.attrIdAndValueId">
              <el-option v-for="value in item.spuSaleAttrValueList" :key="value.id" :label="value.saleAttrValueName" :value="`${item.id}:${value.id}`"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="图片列表">
        <!-- 表格 -->
        <!-- :data="SpuForm.spuSaleAttrList" -->
        <el-table style="margin:10px 0 0px 0px;width: 100%" border :data="spuImageList" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" align="center">
          </el-table-column>
          <el-table-column prop="imgUrl" label="图片" width="width">
            <template slot-scope="{row}">
              <img :src="row.imgUrl" style="width:100px;height:100px">
            </template>
          </el-table-column>
          <el-table-column prop="imgName" label="名称" width="width">
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="150" align="center">
            <template slot-scope="{row}">
              <el-button type="primary" v-if="row.isDefault==0" @click="changeDefault(row)">设置默认</el-button>
              <el-button v-else>默认</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="saveSkuForm">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'SkuForm',
  data () {
    return {
      skuForm: {
        //第一类收集的数据：父组件给的数据
        category3Id: 0,
        spuId: 0,
        tmId: 0,
        //第二类：需要通过数据双向绑定v-model收集
        skuName: "",
        price: 0,
        weight: "",
        skuDesc: "",
        //第三类：需要自己书写代码
        // 平台属性
        skuAttrValueList: [
          // {
          //   "attrId": 0,
          //   "attrName": "string",
          //   "id": 0,
          //   "skuId": 0,
          //   "valueId": 0,
          //   "valueName": "string"
          // }
        ],
        //销售属性
        skuSaleAttrValueList: [
          // {
          //   id: 0,
          //   saleAttrId: 0,
          //   saleAttrName: "string",
          //   saleAttrValueId: 0,
          //   saleAttrValueName: "string",
          //   skuId: 0,
          //   spuId: 0,
          // },
        ],
        //收集图片的字段
        skuImageList: [
          // {
          //   id: 0,
          //   imgName: "string",
          //   imgUrl: "string",
          //   isDefault: "string",
          //   skuId: 0,
          //   spuImgId: 0,
          // },
        ],
        // 表格默认图片
        skuDefaultImg: "",
      },
      // 父组件传过来的数据
      row: {},
      // 平台属性列表
      attrInfoList: [],
      // 销售属性列表
      spuSaleAttrList: [],
      // 表格图片列表
      spuImageList: [],
      //收集图片的数据字段:但是需要注意，收集的数据目前缺少isDefault字段，将来提交给服务器数据的时候，需要整理参数
      imageList: []
    }
  },
  methods: {
    // 获取添加的动态数据
    async addSkuData (category1Id, category2Id, row) {
      this.skuForm.category3Id = row.category3Id;
      this.skuForm.spuId = row.id;
      this.skuForm.tmId = row.tmId;
      this.row = row;
      //获取平台属性列表
      let res = await this.$API.attr.reqGetAttrInfoList(category1Id, category2Id, row.category3Id);
      // console.log(res);
      if (res.code == 200) {
        this.attrInfoList = res.data;
      };
      // 获取销售属性列表
      let res2 = await this.$API.spu.reqGetSpuSaleAttrList(row.id);
      // console.log(res2);
      if (res2.code == 200) {
        this.spuSaleAttrList = res2.data;
      };
      //  获取图片列表
      let res3 = await this.$API.spu.reqGetSpuImageList(row.id);
      if (res3.code == 200) {
        let list = res3.data;
        list.forEach(item => {
          item.isDefault = 0;
        });
        this.spuImageList = list;
      };
    },
    // 表格复选框
    handleSelectionChange (params) {
      //获取到用户选中图片的信息数据，但是需要注意，当前收集的数据当中，缺少isDefault字段
      this.imageList = params;
    },
    // 表格设置默认的排他操作
    changeDefault (row) {
      //图片列表的数据的isDefault字段变为 0
      this.spuImageList.forEach(item => {
        item.isDefault = 0;
      });
      //点击的那个图片的数据变为1
      row.isDefault = 1;
      //收集默认图片的地址
      this.skuForm.skuDefaultImg = row.imgUrl;
    },
    // 保存表单
    async saveSkuForm () {
      const { skuForm, attrInfoList, spuSaleAttrList, imageList } = this;
      //整理平台属性列表的数据
      skuForm.skuAttrValueList = attrInfoList.reduce((prev, item) => {
        if (item.attrIdAndValueId) {
          const [attrId, valueId] = item.attrIdAndValueId.split(':');
          prev.push({ attrId, valueId });
        }
        return prev;
      }, []);
      //整理销售属性列表的数据
      skuForm.skuSaleAttrValueList = spuSaleAttrList.reduce((prev, item) => {
        if (item.attrIdAndValueId) {
          const [saleAttrId, saleAttrValueId] = item.attrIdAndValueId.split(':');
          prev.push({ saleAttrId, saleAttrValueId });
        }
        return prev;
      }, []);
      //整理图片的数据
      skuForm.skuImageList = imageList.map(item => {
        return {
          imgName: item.imgName,
          imgUrl: item.imgUrl,
          isDefault: item.isDefault,
          spuImgId: item.id,
        }
      });

      let res = await this.$API.spu.reqSaveSkuInfo(this.skuForm);
      if (res.code == 200) {
        //提示
        this.$message({ type: "success", message: "保存成功" });
        //给父组件回到表格界面
        this.$emit("changeScene", { scene: 'list', flag: '修改' });
      }
      //清除数据
      Object.assign(this._data, this.$options.data());
    },
    // 点击取消按钮
    cancel () {
      //提示
      this.$message("用户取消");
      // 给父组件传值变化界面
      this.$emit('changeScene', { scene: 'list', flag: '修改' });
      //清除数据
      Object.assign(this._data, this.$options.data());
    }

  }
}
</script>

<style lang='less' scoped>
</style>
