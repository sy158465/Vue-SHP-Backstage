<template>
  <div>
    <!-- 按钮 -->
    <el-button type="primary" icon="el-icon-plus" style="margin: 10px 0px" @click="addTradeMark">添加</el-button>
    <!--
         表格组件
         data:表格组件将来需要展示的数据------数组类型
         border：是给表格添加边框
         column属性
         label：显示标题
         width：对应列的宽度
         align：标题的对齐方式
         prop:对应列内容的字段名
         注意1：elmentUI当中的table组件，展示的数据是以一列一列进行展示数据
       -->
    <el-table style="width: 100%" border :data="list">
      <el-table-column type="index" label="序号" width="80px" align="center">
      </el-table-column>
      <el-table-column prop="tmName" label="品牌名称" width="width">
      </el-table-column>
      <el-table-column prop="logoUrl" label="品牌LOGO" width="width">
        <template slot-scope="{row}">
          <img :src="row.logoUrl" alt="" style="width: 50px; height: 50px" />
        </template>
      </el-table-column>
      <el-table-column prop="prop" label="操作" width="width">
        <template slot-scope="{row}">
          <el-button type="warning" icon="el-icon-edit" size="mini" @click="updateTradeMark(row)">修改</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteTradeMark(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--
      分页器
      当前第几页、数据总条数、每一页展示条数、连续页码数
      @size-change="handleSizeChange"  点击显示每页条数
      @current-change="handleCurrentChange"  点击显示当前页

      current-page:代表的是当前第几页
      total：代表分页器一共需要展示数据条数
      page-size：代表的是每一页需要展示多少条数据
      page-sizes：代表可以设置每一页展示多少条数据
      layout：可以实现分页器布局
      pager-count:按钮的数量  如果 9  连续页码是7

    -->
    <el-pagination background style="margin-top: 20px; text-align: center" :current-page="page" :total="total" :page-size="limit" :pager-count="7" :page-sizes="[3, 5, 10]" @size-change="changeLimit" @current-change="getTradeMarkList" layout="prev, pager, next, jumper,->,sizes,total">
    </el-pagination>
    <!--
      对话框
      :visible.sync:控制对话框显示与隐藏用的
      Form 组件提供了表单验证的功能，只需要通过 rules 属性传入约定的验证规则，并将 Form-Item 的 prop 属性设置为需校验的字段名即可
    -->
    <el-dialog :title="tmForm.id?'修改品牌':'添加品牌'" :visible.sync="dialogFormVisible">
      <!-- form表单 :model属性，这个属性的作用是,把表单的数据收集到那个对象的身上 ，将来表单验证，也需要这个属性-->
      <el-form style="width: 80%" :model="tmForm" :rules="rules" ref="ruleForm">
        <el-form-item label="品牌名称" label-width="100px" prop="tmName">
          <el-input autocomplete="off" v-model="tmForm.tmName"></el-input>
        </el-form-item>
        <el-form-item label="品牌LOGO" label-width="100px" prop="logoUrl">
          <el-upload class="avatar-uploader" action="/dev-api/admin/product/fileUpload" :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
            <img v-if="tmForm.logoUrl" :src="tmForm.logoUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div slot="tip" class="el-upload__tip">
              只能上传jpg/png文件，且不超过2Mb
            </div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addOrUpdateTradeMark">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'tradeMark',
  data () {
    return {
      page: 1,  //当前页码
      limit: 5, //每页记录数
      total: 0, //总条数
      list: [],  //服务器返回的数据
      dialogFormVisible: false, //对话框显示与隐藏
      //添加或者修改填写的品牌信息
      tmForm: {
        tmName: "",
        logoUrl: "",
      },
      //表单验证规则
      rules: {
        //品牌名称的验证规则
        //require:必须要校验字段（前面五角星有关系）  message 提示信息    trigger:用户行为设置（事件的设置:blur、change）
        tmName: [
          { required: true, message: "请输入品牌名称", trigger: "blur" },
          { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'change' },
          //自定义校验规则
          // { validator: validateTmName, trigger: "change" },
        ],
        //品牌的logo验证规则
        logoUrl: [{ required: true, message: "请选择品牌的图片" }],
      },
    }
  },
  mounted () {
    this.getTradeMarkList();
  },
  methods: {
    // 获取品牌列表数据
    async getTradeMarkList (pager = 1) {
      this.page = pager;
      const { page, limit } = this;
      let res = await this.$API.trademark.reqTradeMarkList(page, limit);
      if (res.code == 200) {
        this.total = res.data.total;
        this.list = res.data.records;
      }
    },
    // 改变每页展示的数据条数
    changeLimit (val) {
      this.limit = val;
      this.getTradeMarkList();
    },
    //添加品牌
    addTradeMark () {
      //显示对话框
      this.dialogFormVisible = true;
      //清除数据
      this.tmForm = { tmName: "", logoUrl: "" };
    },
    //修改品牌
    updateTradeMark (row) {
      //row：当前用户选中这个品牌信息
      //显示对话框
      this.dialogFormVisible = true;
      //将已有的品牌信息赋值给tmForm进行展示
      //将服务器返回品牌的信息，直接赋值给了tmForm进行展示。
      //也就是tmForm存储即为服务器返回品牌信息
      this.tmForm = { ...row };
    },
    //图片上传成功
    handleAvatarSuccess (res, file) {
      //res：上传成功之后返回前端数据
      //file:上传成功之后服务器返回前端数据
      //收集品牌图片数据，因为将来需要带给服务器
      this.tmForm.logoUrl = res.data;
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
    // 对话框添加或者修改品牌数据的业务
    addOrUpdateTradeMark () {
      //检验全部验证字段
      this.$refs.ruleForm.validate(async (valid) => {
        // 检验通过才能提交
        if (valid) {
          this.dialogFormVisible = false;
          let res = await this.$API.trademark.reqAddOrUpdateTradeMark(this.tmForm);
          // console.log(res);
          if (res.code == 200) {
            this.$message({
              type: 'success',
              message: this.tmForm.id ? "修改品牌成功" : "添加品牌成功"
            })
            this.getTradeMarkList(this.tmForm.id ? this.page : 1);
          } else {
            console.log("提交失败！！");
            return false;
          }
        }
      })
    },
    // 删除品牌业务
    deleteTradeMark (row) {
      this.$confirm(`此操作将永久删除品牌${row.tmName}, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        // 向服务器发请求
        let res = await this.$API.trademark.reqDeleteTradeMark(row.id);
        if (res.code == 200) {
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          // 重新获取数据进行展示
          this.getTradeMarkList(this.list.length > 1 ? this.page : this.page - 1);
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    }
  }
}
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>