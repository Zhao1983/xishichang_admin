import request from '@/utils/myrequest'
import {
    getCookieData
} from '@/utils/auth' // 쿠키설정

// for test
export function getWechatToken(data) {
    return request({
        url: 'login/shop',
        method: 'post',
        data
    })
}

// admin login
export function setLogin(data) {
    return request({
        url: 'login',
        method: 'post',
        data
    })
}

// left menu data in the admin page
export function getMenus() {
    return request({
        url: 'menus',
        method: 'get'
    })
}

// get admin data
export function getAdmin(query) {
    return request({
        url: 'admins',
        method: 'get',
        params: query
    })
}

// get admin permission data
export function getAdminPermission(id) {
    return request({
        url: `adminPermission/${id}`,
        method: 'get'
    })
}

// set update admin data
export function setUpdateAdmin(id, query) {
    return request({
        url: `admins/${id}`,
        method: 'put',
        data: query
    })
}

// set add admin data
export function setAddAdmin(data) {
    return request({
        url: 'admins',
        method: 'post',
        data
    })
}

// set update admin permission
export function setUpdateAdminPermission(id, query) {
    return request({
        url: `adminPermission/${id}`,
        method: 'put',
        data: query
    })
}

// get admin system log data
export function getSysLogData(page, size) {
    return request({
        url: `sysLog?page=${page}&size=${size}`,
        method: 'get'
    })
}

// set delete admin
export function setDeleteAdmin(id) {
    return request({
        url: `admins/${id}`,
        method: 'delete'
    })
}

// get owner admin data
export function getOwnerAdmin() {
    return request({
        url: 'profile',
        method: 'get'
    })
}

// set update owner admin data
export function setUpdateAdminProfile(query) {
    return request({
        url: 'profile',
        method: 'put',
        data: query
    })
}