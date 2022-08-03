<template>
  <div>
    <el-form :inline="true" class="demo-form-inline" :model="categoryForm">
      <el-form-item label="一级分类">
        <el-select placeholder="请选择" v-model="categoryForm.category1Id" @change="getCategory2()" :disabled="show">
          <el-option :label="c1.name" :value="c1.id" v-for="c1 in list1" :key="c1.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select placeholder="请选择" v-model="categoryForm.category2Id" @change="getCategory3()" :disabled="show">
          <el-option :label="c2.name" :value="c2.id" v-for="c2 in list2" :key="c2.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select placeholder="请选择" v-model="categoryForm.category3Id" @change="handle()" :disabled="show">
          <el-option :label="c3.name" :value="c3.id" v-for="c3 in list3" :key="c3.id"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'CategorySelect',
  props:['show'],
  data () {
    return {
      list1: [],
      list2: [],
      list3: [],
      categoryForm: {
        category1Id: '',
        category2Id: '',
        category3Id: ''
      }
    }
  },
  mounted () {
    this.getCategory1();
  },
  methods: {
    // 从服务器获取一级分类数据
    async getCategory1 () {
      let res = await this.$API.attr.reqGetCategory1();
      if (res.code == 200) {
        this.list1 = res.data;
      }
    },
    // 点击一级分类触发的函数
    async getCategory2 () {
      // 清除数据
      this.list2 = [];
      this.list3 = [];
      this.categoryForm.category2Id = '';
      this.categoryForm.category3Id = '';

      const { category1Id } = this.categoryForm;
      //传一级分类ID传给父组件
      this.$emit("getCategoryId", { categoryId: category1Id, level: 1 })
      let res = await this.$API.attr.reqGetCategory2(category1Id);
      if (res.code == 200) {
        this.list2 = res.data;
      }
    },
    // 点击二级分类触发的函数
    async getCategory3 () {
      // 清除数据
      this.list3 = [];
      this.categoryForm.category3Id = '';

      const { category2Id } = this.categoryForm;
      //传一级分类ID传给父组件
      this.$emit("getCategoryId", { categoryId: category2Id, level: 2 });

      let res = await this.$API.attr.reqGetCategory3(category2Id);
      if (res.code == 200) {
        this.list3 = res.data;
      }
    },
    // 点击三级分类触发的函数
    handle () {
      const { category3Id } = this.categoryForm;
      //传一级分类ID传给父组件
      this.$emit("getCategoryId", { categoryId: category3Id, level: 3 })
    }
  },
}
</script>

<style>
</style>