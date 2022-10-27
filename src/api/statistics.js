import request from '@/utils/myrequest'
import {
    getCookieData
} from '@/utils/auth' // 쿠키설정

export function getSearchStatistics(query) {
    return request({
        url: 'stat/keyword',
        method: 'get',
        params: query
    })
}

export function getDayStatistics(query) {
    return request({
        url: 'stat/day',
        method: 'get',
        params: query
    })
}

export function getProvinceStatistics(query) {
    return request({
        url: 'stat/orders/province',
        method: 'get',
        params: query
    })
}

export function getDeliveriesTime(query) {
    return request({
        url: 'orders/delivery/aging',
        method: 'get',
        params: query
    })
}