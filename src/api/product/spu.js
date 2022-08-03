import request from '@/utils/request';
// 获取商品Spu信息   /admin/product/{page}/{limit}        get    page,limit,category3Id
export const reqGetSpuList = (page, limit, category3Id) => request({ url: `/admin/product/${page}/${limit} `, method: 'get', params: { category3Id } });

// 获取Spu信息     /admin/product/getSpuById/{spuId}       get     spuId
export const reqGetSpuById = (spuId) => request({ url: `/admin/product/getSpuById/${spuId}`, method: 'get' });

// 获取品牌列表的数据    /admin/product/baseTrademark/getTrademarkList    get
export const reqGetTrademarkList = () => request({ url: '/admin/product/baseTrademark/getTrademarkList', method: 'get' });

// 获取Spu图片的数据    /admin/product/spuImageList/{spuId}       get    spuId
export const reqGetSpuImageList = (spuId) => request({ url: `/admin/product/spuImageList/${spuId}`, method: 'get' });

// 获取销售属性列表的数据  /admin/product/baseSaleAttrList  get
export const reqGetBaseSaleAttrList = () => request({ url: '/admin/product/baseSaleAttrList', method: 'get' });

// 添加或者修改Spu信息的接口
export const reqAddOrUpdateSpuInfo = (spuInfo) => {
    if (spuInfo.id) {
        // 修改Spu信息的接口   /admin/product/updateSpuInfo        post
        return request({ url: '/admin/product/updateSpuInfo', method: 'post', data: spuInfo })
    } else {
        // 添加Spu信息的接口   /admin/product/saveSpuInfo          post
        return request({ url: '/admin/product/saveSpuInfo', method: 'post', data: spuInfo })
    }
};

// 删除商品Spu一个信息       /admin/product/deleteSpu/{spuId}      delete
export const reqDeleteSpuById = (spuId) => request({ url: `/admin/product/deleteSpu/${spuId}`, method: 'delete' });

// 获取商品Spu销售属性信息  /admin/product/spuSaleAttrList/{spuId}   get
export const reqGetSpuSaleAttrList = (spuId) => request({ url: `/admin/product/spuSaleAttrList/${spuId}`, method: 'get' });

// 保存SkuForm的数据     /admin/product/saveSkuInfo    post
export const reqSaveSkuInfo = (data) => request({ url: '/admin/product/saveSkuInfo', method: 'post', data });

// 获取sku列表信息      /admin/product/findBySpuId/{spuId}      get
export const reqGetSkuBySpuId = (spuId) => request({ url: `/admin/product/findBySpuId/${spuId}`, method: 'get' });

