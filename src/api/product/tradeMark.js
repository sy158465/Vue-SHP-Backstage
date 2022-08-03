//这个模块主要获取的是品牌管理的数据的模块
import request from '@/utils/request';
//获取品牌列表接口     /admin/product/baseTrademark/{page}/{limit}   get
export const reqTradeMarkList = (page, limit) => request({ url: `/admin/product/baseTrademark/${page}/${limit}`, method: 'get' });
// 添加或者修改品牌的接口
export const reqAddOrUpdateTradeMark = (trademark) => {
    if (trademark.id) {
        // 修改品牌的接口 /admin/product/baseTrademark/update   put  id,logoUrl,tmName
        return request({ url: '/admin/product/baseTrademark/update', method: 'put',data:trademark })
    }else{
        // 添加品牌的接口 /admin/product/baseTrademark/save   post  logoUrl,tmName
        return request({ url: '/admin/product/baseTrademark/save', method: 'post',data:trademark })
    }
};
// 删除品牌接口    /admin/product/baseTrademark/remove/{id}     delete
export const reqDeleteTradeMark = (id) => request({ url: `/admin/product/baseTrademark/remove/${id}`, method: 'delete' });
