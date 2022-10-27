import request from '@/utils/myrequest'
import {
    getCookieData
} from '@/utils/auth' // 쿠키설정

// get search product keyword
export function getTagData() {
    return request({
        url: 'tags',
        method: 'get'
    })
}

// add new search keyword
export function setRegisterTag(data) {
    return request({
        url: 'tags',
        method: 'post',
        data
    })
}