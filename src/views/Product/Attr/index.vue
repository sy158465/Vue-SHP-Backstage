<template>
  <div>
    <el-card style="margin-bottom:15px;">
      <CategorySelect @getCategoryId="getCategoryId" :show="!isShow"></CategorySelect>
    </el-card>
    <el-card>
      <div v-show="isShow">
        <el-button type="primary" icon="el-icon-plus" style="margin-bottom:10px;" @click="addAttr" :disabled="!category3Id">添加属性</el-button>
        <!-- 表格:展示平台属性 -->
        <el-table style="width: 100%" border :data="attrInfoList">
          <el-table-column type="index" label="序号" width="80" align="center">
          </el-table-column>
          <el-table-column prop="attrName" label="属性名称" width="150">
          </el-table-column>
          <el-table-column prop="prop" label="属性值列表" width="width">
            <template slot-scope="{ row }">
              <el-tag type="success" v-for="(attrValue) in row.attrValueList" :key="attrValue.id" style="margin: 0px 5px">{{ attrValue.valueName }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="150">
            <template slot-scope="{ row }">
              <el-button type="warning" icon="el-icon-edit" size="mini" @click="editAttr(row)"></el-button>
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteAttr(row)"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 添加属性|修改属性的结构 -->
      <div v-show="!isShow">
        <el-form :inline="true" ref="form" label-width="80px" :model="attrInfo">
          <el-form-item label="属性名">
            <el-input placeholder="请输入属性名" v-model="attrInfo.attrName"></el-input>
          </el-form-item>
        </el-form>

        <el-button type="primary" icon="el-icon-plus" :disabled="!attrInfo.attrName" @click="addAttrValue">添加属性值</el-button>
        <el-button @click="isShow = true">取消</el-button>

        <el-table style="width: 100%; margin: 20px 0px" border :data="attrInfo.attrValueList">
          <el-table-column align="center" type="index" label="序号" width="80">
          </el-table-column>
          <el-table-column width="width" prop="prop" label="属性值名称">
            <template slot-scope="{ row,$index }">
              <!-- 这里结构需要用到span与input进行来回的切换 -->
              <el-input v-model="row.valueName" placeholder="请输入属性值名称" size="mini" v-if="row.flag" @blur="toLook(row)" @keyup.native.enter="toLook(row)" :ref="$index"></el-input>
              <span v-else @click="toEdit(row,$index)" style="display:block;">{{row.valueName}}</span>
            </template>
          </el-table-column>
          <el-table-column width="width" prop="prop" label="操作">
            <template slot-scope="{ row, $index }">
              <!-- 气泡确认框 -->
              <el-popconfirm :title="`确定删除${row.valueName}?`" @confirm="deleteAttrValue($index)">
                <el-button type="danger" icon="el-icon-delete" size="mini" slot="reference"></el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>

        <el-button type="primary" @click="addOrUpdatAttrInfo" :disabled="attrInfo.attrValueList.length<1">保存</el-button>
        <el-button @click="isShow = true">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
//按需引入lodash当中的深拷贝
import cloneDeep from "lodash/cloneDeep";
export default {
  name: 'Attr',
  data () {
    return {
      category1Id: "",
      category2Id: "",
      category3Id: "",
      // 商品属性列表
      attrInfoList: [],
      // 是否展示添加或修改内容
      isShow: true,
      //收集新增属性|修改属性使用的
      attrInfo: {
        attrName: "", //属性名
        attrValueList: [], //属性值，因为属性值可以有多个因此用数组，每一个属性值都是一个对象需要attrId，valueName
        categoryId: 0, //三级分类的id
        categoryLevel: 3, //因为服务器也需要区分几级id
      },
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
        //发请求获取平台的属性数据
        this.getAttrList();
      }
    },
    // 给服务器发请求返回商品属性数据
    async getAttrList () {
      const { category1Id, category2Id, category3Id } = this;
      let res = await this.$API.attr.reqGetAttrInfoList(category1Id, category2Id, category3Id);
      // console.log(res);
      if (res.code == 200) {
        this.attrInfoList = res.data;
      }
    },
    // 点击添加属性按钮
    addAttr () {
      // 隐藏商品属性列表
      this.isShow = false;
      // 清除数据
      this.attrInfo = {
        attrName: "", //属性名
        attrValueList: [], //属性值，因为属性值可以有多个因此用数组，每一个属性值都是一个对象需要attrId，valueName
        categoryId: this.category3Id, //三级分类的id
        categoryLevel: 3, //因为服务器也需要区分几级id
      }
    },
    // 点击修改属性按钮
    editAttr (row) {
      this.isShow = false;
      this.attrInfo = cloneDeep(row);
      this.attrInfo.attrValueList.forEach(item => {
        this.$set(item, 'flag', false);
      })
    },
    // 点击删除属性按钮
    deleteAttr(row){
      this.$confirm(`此操作将永久删除商品属性${row.attrName}, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        // 向服务器发请求
        let res = await this.$API.attr.reqDeleteAttrInfo(row.id);
        if (res.code == 200) {
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          // 重新获取数据进行展示
         this.getAttrList();
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    // 点击添加属性值按钮
    addAttrValue () {
      this.attrInfo.attrValueList.push({
        attrId: this.attrInfo.id,
        valueName: "",
        flag: true
      });
      //flag属性：给每一个属性值添加一个标记flag，用户切换查看模式与编辑模式，好处，每一个属性值可以控制自己的模式切换
      //当前flag属性，响应式数据（数据变化视图跟着变化）
      this.$nextTick(() => {
        this.$refs[this.attrInfo.attrValueList.length - 1].focus();
      });
    },
    // 添加和修改属性值失去焦点和回车触发的事件
    toLook (row) {
      let isRepeat = this.attrInfo.attrValueList.some(item => {
        if (row != item) {
          return row.valueName == item.valueName;
        }
      });
      if (isRepeat) {
        this.$message({ message: '存在重复值！', type: 'warning' });
        return;
      }
      if (row.valueName.trim() == "") {
        this.$message({ message: '请输入值！', type: 'warning' });
        return;
      } else {
        row.flag = false;
      }
    },
    // 点击span切换编辑模式
    toEdit (row, index) {
      row.flag = true;
      this.$nextTick(() => {
        this.$refs[index].focus();
      })
    },
    // 点击删除属性值按钮
    deleteAttrValue (index) {
      this.attrInfo.attrValueList.splice(index, 1);
    },
    // 点击保存发送数据
    addOrUpdatAttrInfo () {
      this.attrInfo.attrValueList = this.attrInfo.attrValueList.filter((item) => {
        if (item.valueName != "") {
          delete item.flag;
          return true;
        }
      });
      try {
        let res = this.$API.attr.reqAddOrUpdateAttrInfo(this.attrInfo);
        this.isShow = true;
        this.$message({type:"success",message:"保存成功"});
        this.getAttrList();
      } catch (error) {

      }
    },

  }
}
</script>

<style lang='less' scoped>
</style>

