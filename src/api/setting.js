import request from '@/utils/myrequest'
import {
    getCookieData
} from '@/utils/auth' // 쿠키설정

// get setting data
export function getSettingData() {
    return request({
        url: 'settings',
        method: 'get'
    })
}

// set upload site logo image
export function setUploadSiteLogoImage(data) {
    return request({
        url: 'upload/siteLogo',
        method: 'post',
        data
    })
}

// set upload shop image
export function setUploadShopImage(data) {
    return request({
        url: 'upload/shopIcon',
        method: 'post',
        data
    })
}

// set update data
export function setUpdateData(query) {
    return request({
        url: 'settings',
        method: 'put',
        data: query
    })
}

// set goods icon
export function setUploadGoodsIcon(iconName, data) {
    return request({
        url: `upload/goodsIcon/iconName`,
        method: 'post',
        data
    })
}

// set goods mark icon
export function setUploadGoodsImageIcon(data) {
    return request({
        url: 'upload/watermarkPic',
        method: 'post',
        data
    })
}

// set goods mark icon
export function setUploadGoodsWordImage(data) {
    return request({
        url: 'upload/watermarkWord',
        method: 'post',
        data
    })
}