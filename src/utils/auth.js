import Cookies from 'js-cookie'

const TokenKey = 'vue_admin_template_token'

export function getToken() {
    return Cookies.get(TokenKey)
}

export function setToken(token) {
    return Cookies.set(TokenKey, token)
}

export function removeToken() {
    return Cookies.remove(TokenKey)
}

export function getCookieData(key) {
    return Cookies.get(key)
}

export function setCookieData(key, value) {
    return Cookies.set(key, value)
}

export function removeCookieData(key) {
    return Cookies.remove(key)
}

// 상품검색필드 초기화
export function setClearGoodsSearchField() {
    setCookieData('product_typeid', undefined)
    setCookieData('product_subtypeid', undefined)
    setCookieData('product_goodsname', '')
    setCookieData('product_shopname', '')
    setCookieData('product_status', '')
    setCookieData('delivery_event_status', '')
    setCookieData('product_deliverytype', undefined)
    setCookieData('product_list_page', 1)
    setCookieData('product_list_size', 10)
}

// 상품일괄편집검색필드 초기화
export function setClearGoodsBatchSearchField() {
    setCookieData('product_batch_typeid', undefined)
    setCookieData('product_batch_subtypeid', undefined)
    setCookieData('product_batch_goodsname', '')
    setCookieData('product_batch_shopname', '')
    setCookieData('product_batch_status', '')
    setCookieData('product_batch_deliverytype', undefined)
    setCookieData('product_batch_list_page', 1)
    setCookieData('product_batch_list_size', 10)
}

// 점포검색필드 초기화
export function setClearShopSearchField() {
    setCookieData('shop_typeid', undefined)
    setCookieData('shop_subtypeid', undefined)
    setCookieData('shop_status', '')
    setCookieData('shop_name', '')
    setCookieData('shop_owner', '')
    setCookieData('shop_page', 1)
    setCookieData('shop_size', 10)
}

// 점포상품필드 초기화
export function setClearShopBatchField() {
    setCookieData('shop_batch_page', 1)
    setCookieData('shop_batch_size', 10)
}

// 주문리스트검색필드 초기화
export function setClearOrderSearchField() {
    setCookieData('order_orderno', '')
    setCookieData('order_deliveryno', '')
    setCookieData('order_username', '')
    setCookieData('order_address', '')
    setCookieData('order_sdate', '')
    setCookieData('order_edate', '')
    setCookieData('delivery_sdate', '')
    setCookieData('delivery_edate', '')
    setCookieData('order_phone', '')
    setCookieData('order_goodsname', '')
    setCookieData('order_paystatus', 0)
    setCookieData('order_deliverytype', 0)
    setCookieData('order_orderstatus', '')
    setCookieData('order_page', 1)
    setCookieData('order_size', 10)
}

// 검색필드쿠키 삭제
export function setRemoveSearchField() {
    removeCookieData('product_typeid')
    removeCookieData('product_subtypeid')
    removeCookieData('product_goodsname')
    removeCookieData('product_shopname')
    removeCookieData('product_status')
    removeCookieData('product_deliverytype')
    removeCookieData('product_list_page')
    removeCookieData('product_list_size')
    removeCookieData('product_batch_typeid')
    removeCookieData('product_batch_subtypeid')
    removeCookieData('product_batch_goodsname')
    removeCookieData('product_batch_shopname')
    removeCookieData('product_batch_status')
    removeCookieData('product_batch_deliverytype')
    removeCookieData('product_batch_list_page')
    removeCookieData('product_batch_list_size')
    removeCookieData('shop_typeid')
    removeCookieData('shop_subtypeid')
    removeCookieData('shop_status')
    removeCookieData('shop_name')
    removeCookieData('shop_owner')
    removeCookieData('shop_page')
    removeCookieData('shop_size')
    removeCookieData('shop_batch_page')
    removeCookieData('shop_batch_size')
    removeCookieData('order_orderno')
    removeCookieData('order_address')
    removeCookieData('order_sdate')
    removeCookieData('order_edate')
    removeCookieData('delivery_sdate')
    removeCookieData('delivery_edate')
    removeCookieData('order_phone')
    removeCookieData('order_goodsname')
    removeCookieData('order_paystatus')
    removeCookieData('order_deliverytype')
    removeCookieData('order_orderstatus')
    removeCookieData('order_page')
    removeCookieData('order_size')
}