import request from '@/utils/request';
// 获取sku列表   /admin/product/list/{page}/{limit}   get
export const reqGetSkuList = (page, limit) => request({ url: `/admin/product/list/${page}/${limit}`, method: 'get' });

// 下架请求    /admin/product/cancelSale/{skuId}  get
export const reqCancelSale = (skuId) => request({ url: `/admin/product/cancelSale/${skuId}`, method: 'get' });
// 上架请求   /admin/product/onSale/{skuId}    get
export const reqOnSale = (skuId) => request({ url: `/admin/product/onSale/${skuId}`, method: 'get' });
// 获取sku列表信息      /admin/product/getSkuById/{skuId}     get
export const reqGetSkuBySpuId = (skuId) => request({ url: `/admin/product/getSkuById/${skuId}`, method: 'get' });

// 删除sku     /admin/product/deleteSku/{skuId}    delete
export const reqDeleteSku = (skuId) => request({ url: `/admin/product/deleteSku/${skuId}`, method: 'delete' });
