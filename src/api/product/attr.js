import request from '@/utils/request';
// 获取一级商品分类   /admin/product/getCategory1        get
export const reqGetCategory1 = () => request({ url: '/admin/product/getCategory1', method: 'get' });
// 获取二级商品分类   /admin/product/getCategory2/{category1Id}  get
export const reqGetCategory2 = (category1Id) => request({ url: `/admin/product/getCategory2/${category1Id}`, method: 'get' });
// 获取二级商品分类   /admin/product/getCategory3/{category2Id}   get
export const reqGetCategory3 = (category2Id) => request({ url: `/admin/product/getCategory3/${category2Id}`, method: 'get' });

// 获取商品属性接口  /admin/product/attrInfoList/{category1Id}/{category2Id}/{category3Id}  get
export const reqGetAttrInfoList = (category1Id, category2Id, category3Id) => request({ url: `/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`, method: 'get' });

// 添加商品属性名和属性值接口  /admin/product/saveAttrInfo     post
export const reqAddOrUpdateAttrInfo = (data) => request({ url: '/admin/product/saveAttrInfo', method: 'post', data });

// 删除商品属性接口   /admin/product/deleteAttr/{attrId}     delete
export const reqDeleteAttrInfo = (attrId) => request({ url: `/admin/product/deleteAttr/${attrId}`, method: "delete" })

