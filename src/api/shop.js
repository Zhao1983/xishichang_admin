import request from '@/utils/myrequest'
import {
    getCookieData
} from '@/utils/auth' // 쿠키설정

// get rand key for product
export function getRandKey() {
    return request({
        url: 'base/randKey',
        method: 'get'
    })
}

// get shop data
export function getShopData(query) {
    return request({
        url: 'shops',
        method: 'get',
        params: query
    })
}

// update shop status by id
export function setShopStatus(id, query) {
    return request({
        url: `shops/status/${id}`,
        method: 'put',
        data: query
    })
}

// get floors info
export function getFloor() {
    return request({
        url: 'base/floors',
        method: 'get'
    })
}

// add floors info
export function setAddFloors(data) {
    return request({
        url: 'floors',
        method: 'post',
        data
    })
}

// upload the image and get url parameter
export function setUploadLicense(data) {
    return request({
        url: 'upload/shopLicence',
        method: 'post',
        data
    })
}

// upload the image and get url parameter
export function setUploadPayCode(data) {
    return request({
        url: 'upload/shopPayCode',
        method: 'post',
        data
    })
}

// upload the image and get url parameter
export function setUploadAvatar(data) {
    return request({
        url: 'upload/shopOwnerAvatar',
        method: 'post',
        data
    })
}

// upload the image and get url parameter
export function setUploadBanner(data) {
    return request({
        url: 'upload/shopBanner',
        method: 'post',
        data
    })
}

// upload the image and get url parameter
export function setUploadShopBackground(data) {
    return request({
        url: 'upload/shopBgImg',
        method: 'post',
        data
    })
}

// add shop data
export function setRegisterShop(data) {
    return request({
        url: 'shops',
        method: 'post',
        data
    })
}

// check exist shop
export function existShop(data) {
    return request({
        url: 'shops/checkName',
        method: 'get',
        params: data
    })
}

// check exist shop owner
export function existOwner(shopName, phoneNum, id) {
    return request({
        url: 'shops/checkOwner?shopName=' + shopName + '&phoneNum=' + phoneNum + '&id=' + id,
        method: 'get'
    })
}

// update advert data by id
export function setUpdateShop(id, query) {
    return request({
        url: `shops/${id}`,
        method: 'put',
        data: query
    })
}

// get shop data by shopid
export function getShopDetail(id) {
    return request({
        url: `shops/${id}`,
        method: 'get'
    })
}

// get products in the shop
export function getShopInfo(id) {
    return request({
        url: `shops/names/${id}`,
        method: 'get'
    })
}

// set hidden the shop
export function setShopHidden(id) {
    return request({
        url: `shops/hidden/${id}`,
        method: 'put'
    })
}