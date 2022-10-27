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

// get duty data
export function getDutyData(year, month) {
    return request({
        url: `duties/${year}/${month}`,
        method: 'get'
    })
}

// get remark detail
export function getRemarkDetail(id) {
    return request({
        url: `duties/remark/${id}`,
        method: 'get'
    })
}

// add duty remark
export function setAddDutyRemark(id, data) {
    return request({
        url: `duties/remark/${id}`,
        method: 'post',
        data
    })
}

// add duty member
export function setAddDutyMember(data) {
    return request({
        url: 'duties',
        method: 'post',
        data
    })
}