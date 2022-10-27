import request from '@/utils/myrequest'
import {
    getCookieData
} from '@/utils/auth' // 쿠키설정

// get all member data
export function memberList(query) {
    return request({
        url: 'users',
        method: 'get',
        params: query
    })
}

// set update member status
export function setUpdateStatus(id, query) {
    return request({
        url: `users/status/${id}`,
        method: 'put',
        data: query
    })
}

// get receive address by member id
export function getReceiverAddress(id) {
    return request({
        url: `users/detail/${id}`,
        method: 'get'
    })
}

// get user data
export function getWechatInfo(data) {
    return request({
        url: 'base/users',
        method: 'get',
        params: data
    })
}