import request from '@/utils/myrequest'
import {
    getCookieData
} from '@/utils/auth' // 쿠키설정

// get all dvertising data
export function getAdvertData(query) {
    return request({
        url: 'ads',
        method: 'get',
        params: query
    })
}

// update advert status
export function setUpdateStatus(id, status) {
    return request({
        url: `ads/${id}/${status}`,
        method: 'put'
    })
}

// upload advert image
export function setUploadImage(data) {
    return request({
        url: 'upload/adImg',
        method: 'post',
        data
    })
}

// get advert link kind
export function getAdvertKind() {
    return request({
        url: 'base/business',
        method: 'get'
    })
}

// add advert data
export function setAddAdvert(data) {
    return request({
        url: 'ads',
        method: 'post',
        data
    })
}

// get advert data by advert id
export function getAdvertDetailData(id) {
    return request({
        url: `ads/${id}`,
        method: 'get'
    })
}

// update advert data by id
export function setUpdateAdvert(id, query) {
    return request({
        url: `ads/${id}`,
        method: 'put',
        data: query
    })
}