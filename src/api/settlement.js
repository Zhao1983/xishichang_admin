import request from '@/utils/myrequest'
import {
    getCookieData
} from '@/utils/auth' // 쿠키설정

// get all admin data
export function getAllAdminInfo() {
    return request({
        url: 'base/admins',
        method: 'get'
    })
}

// get all before settlement data
export function getBeforeSettlementData(data) {
    return request({
        url: 'shop/settlement/unclosed',
        method: 'get',
        params: data
    })
}

// get all after settlement data
export function getAfterSettlementData(data) {
    return request({
        url: 'shop/settlement/closed',
        method: 'get',
        params: data
    })
}

// get before settlement data by shop
export function getBeforeSettlementDataByShop(shopid, data) {
    return request({
        url: `shop/settlement/unclosed/${shopid}`,
        method: 'get',
        params: data
    })
}

// get after settlement data by shop
export function getAfterSettlementDataByShop(shopid, data) {
    return request({
        url: `shop/settlement/closed/${shopid}`,
        method: 'get',
        params: data
    })
}

// set change price by order goodsid
export function setChangeDifferencePrice(id, data) {
    return request({
        url: `shop/settlement/difference/${id}`,
        method: 'put',
        data
    })
}

// set settlement
export function setSettlementData(id, data) {
    return request({
        url: `shop/settlement/${id}`,
        method: 'put',
        data
    })
}

// get after settlement info by orders
export function getAfterSettlementByOrder(settlemnetno) {
    return request({
        url: `shop/settlement/info/${settlemnetno}`,
        method: 'get'
    })
}

// set export before settlement data
export function setExportBeforeSettlement(data) {
    return request({
        url: 'shop/settlement/unclosed/export',
        method: 'get',
        params: data
    })
}

// set export before settlement data
export function setExportAfterSettlement(data) {
    return request({
        url: 'shop/settlement/closed/export',
        method: 'get',
        params: data
    })
}