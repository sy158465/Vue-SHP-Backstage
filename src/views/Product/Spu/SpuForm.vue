<template>
  <div>
    <el-form ref="form" label-width="80px" :model="SpuForm">
      <el-form-item label="Spu名称">
        <el-input placeholder="Spu名称" v-model="SpuForm.spuName"></el-input>
      </el-form-item>
      <el-form-item label="品牌">
        <el-select placeholder="请选择品牌" v-model="SpuForm.tmId">
          <el-option :label="trademark.tmName" :value="trademark.id" v-for="trademark in TrademarkList" :key="trademark.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="Spu描述">
        <el-input type="textarea" rows="4" placeholder="描述" v-model="SpuForm.description"></el-input>
      </el-form-item>
      <el-form-item label="Spu图片">
        <el-upload action="/dev-api/admin/product/fileUpload" list-type="picture-card" :file-list="SpuImageList" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload" :on-preview="handlePictureCardPreview" :on-remove="handleRemove">
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-select :placeholder="`还有${unSelectSaleAttr.length}未选择`" v-model="attrIdAndattrName">
          <el-option :label="unSelect.name" :value="`${unSelect.id}:${unSelect.name}`" v-for="unSelect in unSelectSaleAttr" :key="unSelect.id"></el-option>
        </el-select>
        <el-button type="primary" icon="el-icon-plus" style="margin-left:10px;" :disabled="!attrIdAndattrName" @click="addSaleAttr">添加销售属性</el-button>
        <!-- 表格 -->
        <el-table style="margin:10px 0 0px 0px;width: 100%" border :data="SpuForm.spuSaleAttrList">
          <el-table-column type="index" label="序号" width="80" align="center">
          </el-table-column>
          <el-table-column prop="saleAttrName" label="属性名" width="width">
          </el-table-column>
          <el-table-column prop="prop" label="属性值名称列表" width="width">
            <template slot-scope="{ row,$index }">
              <!-- el-tag:用户展示已有属性值列表的数据的 -->
              <el-tag :key="tag.id" v-for="(tag, index) in row.spuSaleAttrValueList" closable :disable-transitions="false" @close="row.spuSaleAttrValueList.splice(index, 1)">{{ tag.saleAttrValueName }}</el-tag>
              <el-input class="input-new-tag" v-if="row.inputVisible" v-model="row.inputValue" ref="tag" size="small" @blur="handleInputConfirm(row)" @keyup.enter.native="handleInputConfirm(row)">
              </el-input>
              <el-button v-else class="button-new-tag" size="small" @click="addSaleAttrValue(row,$index)">添加</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="85" align="center">
            <template slot-scope="{ row,$index }">
              <hint-button type="danger" icon="el-icon-delete" size="mini" title="删除Spu" @click="deleteSaleAttr(row,$index)"></hint-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="addOrUpdateSpuInfo">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'SpuForm',
  data () {
    return {
      // 预览图片
      dialogImageUrl: '',
      dialogVisible: false,
      //表单信息
      SpuForm: {
        category3Id: 0,
        spuName: '',
        tmId: '',
        description: '',
        spuImageList: [],
        spuSaleAttrList: []
      },
      TrademarkList: [],//品牌列表
      SpuImageList: [],//Spu图片列表
      SpuSaleAttrList: [],//销售属性列表
      attrIdAndattrName: ''
    }
  },
  methods: {
    // 获取修改的动态数据
    async initSpuData (data) {
      // 表单信息
      let res = await this.$API.spu.reqGetSpuById(data.id);
      if (res.code == 200) {
        this.SpuForm = res.data;
      };
      //   品牌列表
      let res1 = await this.$API.spu.reqGetTrademarkList();
      if (res1.code == 200) {
        this.TrademarkList = res1.data;
      };
      //   Spu图片列表
      let res2 = await this.$API.spu.reqGetSpuImageList(data.id);
      if (res2.code == 200) {
        let GetSpuImageList = res2.data;
        // 转换成:file-list所需要的格式
        GetSpuImageList.forEach(item => {
          item.name = item.imgName;
          item.url = item.imgUrl;
        });
        this.SpuImageList = GetSpuImageList;
      };
      //   销售属性列表
      let res3 = await this.$API.spu.reqGetBaseSaleAttrList();
      if (res3.code == 200) {
        this.SpuSaleAttrList = res3.data;
      };
    },
    // 获取添加的动态数据
    async addSpuData (category3Id) {
      this.SpuForm.category3Id = category3Id;
      //   品牌列表
      let res1 = await this.$API.spu.reqGetTrademarkList();
      if (res1.code == 200) {
        this.TrademarkList = res1.data;
      };
      //   销售属性列表
      let res3 = await this.$API.spu.reqGetBaseSaleAttrList();
      if (res3.code == 200) {
        this.SpuSaleAttrList = res3.data;
      };
    },
    //图片上传之前
    beforeAvatarUpload (file) {
      const suffix = file.type === 'image/jpg' || file.type === 'image/png' || file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!suffix) {
        this.$message.error('只能上传图片！')
        return reject(false)
      }
      if (!isLt2M) {
        this.$message.error("上传图片大小不能超过 2MB!");
      }
      return suffix && isLt2M;
    },
    //图片上传成功
    handleAvatarSuccess (res, file, fileList) {
      //res：上传成功之后返回前端数据
      //file:上传成功之后服务器返回前端数据
      //收集品牌图片数据，因为将来需要带给服务器
      this.SpuImageList = fileList;
    },
    // 图片预览
    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    // 图片删除
    handleRemove (file, fileList) {
      // fileList：删除后剩下的图片数据
      this.SpuImageList = fileList;
    },
    // 添加表格属性
    addSaleAttr () {
      // 从收集到的数据中结构出要传给服务器的数据
      let [baseSaleAttrId, saleAttrName] = this.attrIdAndattrName.split(':');
      // 拼凑新的要传给服务器的数据格式
      let newSaleAttr = { baseSaleAttrId, saleAttrName, spuSaleAttrValueList: [] };
      this.SpuForm.spuSaleAttrList.push(newSaleAttr);
      // 清空收集的数据
      this.attrIdAndattrName = ''
    },
    // 点击添加属性值的按钮
    addSaleAttrValue (row) {
      // 显示编辑框
      this.$set(row, 'inputVisible', true);
      // 置空编辑框的值
      this.$set(row, 'inputValue', '');
      // 自动获取焦点
      this.$nextTick(() => {
        this.$refs.tag.$refs.input.focus();
      });
    },
    // 表格属性值编辑
    handleInputConfirm (row) {
      // 隐藏添加按钮
      row.inputVisible = false;
      // 结构出需要的数据
      const { baseSaleAttrId, inputValue } = row;
      // 验证不能为空
      if (inputValue.trim() == '') {
        this.$message({ type: 'warning', message: '请输入值！' });
        return;
      };
      // 验证不能存在重复值
      let isRepeat = row.spuSaleAttrValueList.every(item => item.saleAttrValueName == inputValue);
      if (!isRepeat) {
        this.$message({ message: '存在重复值！', type: 'warning' });
        return;
      }
      // 满足条件添加数据
      let newSpuSaleAttrValue = { baseSaleAttrId, saleAttrValueName: inputValue }
      if (row.inputValue) {
        row.spuSaleAttrValueList.push(newSpuSaleAttrValue);
      }
    },
    // 删除表格属性
    deleteSaleAttr (index) {
      this.SpuForm.spuSaleAttrList.splice(index, 1);
    },
    // 点击保存按钮，保存或者更新Spu信息
    async addOrUpdateSpuInfo () {
      //整理照片墙的数据，需要携带imageName与imageUrl字段
      this.SpuForm.spuImageList = this.SpuImageList.map((item) => {
        return {
          imageName: item.name,
          imageUrl: item.response ? item.response.data : item.url,
        };
      });
      //发请求
      let result = await this.$API.spu.reqAddOrUpdateSpuInfo(this.SpuForm);
      if (result.code == 200) {
        //提示
        this.$message({ type: "success", message: "保存成功" });
        //给父组件回到表格界面
        this.$emit("changeScene", { scene: 'list', flag: this.SpuForm.id ? '修改' : "添加" });
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
  },
  computed: {
    //计算出还未选择的销售属性
    unSelectSaleAttr () {
      //数组的过滤方法，可以从已有的数组当中过滤出用户需要的元素，并未返回一个新的数据
      return this.SpuSaleAttrList.filter((item) => {
        //every数组的方法，会返回一个布尔值【真，假的】
        return this.SpuForm.spuSaleAttrList.every((item1) => {
          // 对比每个属性的名字
          return item.name != item1.saleAttrName;
        });
      });
    },
  },

}
</script>

<style>
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>