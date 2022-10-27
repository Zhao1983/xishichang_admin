import request from '@/utils/myrequest'
import {
    getCookieData
} from '@/utils/auth' // 쿠키설정

// get free shipping info
export function getFreeShipping() {
    return request({
        url: 'base/freeShipping',
        method: 'get'
    })
}

// get rand key for product
export function getRandKey() {
    return request({
        url: 'base/randKey',
        method: 'get'
    })
}

// get product data
export function getProduct(query) {
    return request({
        url: 'goods',
        method: 'get',
        params: query
    })
}

// get package name data
export function getPackageNameData() {
    return request({
        url: 'base/package',
        method: 'get'
    })
}

// get package type data
export function getPackageTypeData() {
    return request({
        url: 'base/packageType',
        method: 'get'
    })
}

// get good unit data
export function getUnitData() {
    return request({
        url: 'base/goodsUnit',
        method: 'get'
    })
}

// upload the images
export function setUploadImage(key, data) {
    return request({
        url: `upload/goodsImg/${key}`,
        method: 'post',
        data
    })
}

// upload the video file
export function setUploadVideo(data) {
    return request({
        url: `upload/goodsVideo`,
        method: 'post',
        data
    })
}

// check exist product
export function existProduct(prodname, shopId, id) {
    return request({
        url: `goods/checkName?goodsName=${prodname}&shopId=${shopId}&id=${id}`,
        method: 'get'
    })
}

// add product data
export function setRegisterProduct(data) {
    return request({
        url: 'goods',
        method: 'post',
        data
    })
}

// get product data by productid
export function getProductDetail(id) {
    return request({
        url: `goods/${id}`,
        method: 'get'
    })
}

// update product data by id
export function setUpdateProduct(id, query) {
    return request({
        url: `goods/${id}`,
        method: 'put',
        data: query
    })
}

// update product status by id
export function setUpdateStatus(id, query) {
    return request({
        url: `goods/status/${id}`,
        method: 'put',
        data: query
    })
}

// upload the excel template file
export function setUploadExcelFile(data) {
    return request({
        url: 'upload/goods',
        method: 'post',
        data
    })
}

// batch update product data
export function batchUpdateProduct(id, query) {
    return request({
        url: `goods/items/${id}`,
        method: 'put',
        data: query
    })
}

// get goods icon
export function getGoodsIcon() {
    return request({
        url: 'base/goodsIcon',
        method: 'get'
    })
}