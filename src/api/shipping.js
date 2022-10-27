import request from '@/utils/myrequest'
import {
    getCookieData
} from '@/utils/auth' // 쿠키설정

// get shipping all data
export function getShipping() {
    return request({
        url: 'deliveries',
        method: 'get'
    })
}

// get delivery companies
export function getDeliveryCompany() {
    return request({
        url: 'deliveries/company',
        method: 'get'
    })
}

// get all data provincies
export function getProvice() {
    return request({
        url: 'base/province',
        method: 'get'
    })
}

// get special delivery company
export function getCompanyInfo(id) {
    return request({
        url: `deliveries/price/${id}`,
        method: 'get'
    })
}

// update delivery info
export function updateDeliveryInfo(id, query) {
    return request({
        url: `deliveries/price/${id}`,
        method: 'put',
        data: query
    })
}

// get all delivery company
export function getAllDeliveryCompany() {
    return request({
        url: 'base/deliveryCompany',
        method: 'get'
    })
}

// get runner company
export function getRunnerCompany() {
    return request({
        url: 'base/runner',
        method: 'get'
    })
}

// add delivery info
export function addDeliverInfo(data) {
    return request({
        url: 'deliveries/price',
        method: 'post',
        data
    })
}

// update shipping data
export function updateShippingData(query) {
    return request({
        url: 'deliveries',
        method: 'put',
        data: query
    })
}

// get runner price info
export function getRunnerPrice(id) {
    return request({
        url: `runners/price/${id}`,
        method: 'get'
    })
}

// update runner price info
export function updateRunnerPrice(id, query) {
    return request({
        url: `runners/price/${id}`,
        method: 'post',
        data: query
    })
}