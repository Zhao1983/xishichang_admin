import request from '@/utils/myrequest'
import {
    getCookieData
} from '@/utils/auth' // 쿠키설정

// get delivery type
export function getDelivery() {
    return request({
        url: 'base/deliveryType',
        method: 'get'
    })
}

// get events data
export function getEvents(query) {
    return request({
        url: 'events',
        method: 'get',
        params: query
    })
}

// upload the main image
export function setUploadMainImage(data) {
    return request({
        url: 'upload/event/coverImg',
        method: 'post',
        data
    })
}

// upload the sub image
export function setUploadSubImage(data) {
    return request({
        url: 'upload/event/topImg',
        method: 'post',
        data
    })
}

// add event data
export function setRegisterEventData(data) {
    return request({
        url: 'events',
        method: 'post',
        data
    })
}

// update event status by id
export function setUpdateEventStatus(id, status) {
    return request({
        url: `events/${id}/${status}`,
        method: 'put'
    })
}

// get event data by event id
export function getEventDetail(id) {
    return request({
        url: `events/${id}`,
        method: 'get'
    })
}

// set update event data by event id
export function setUpdateEventData(id, query) {
    return request({
        url: `events/${id}`,
        method: 'put',
        data: query
    })
}

// get event product by event id
export function getEventProduct(id) {
    return request({
        url: `events/goods/${id}`,
        method: 'get'
    })
}

// get event product by event id
export function setUpdateEventProduct(id, data) {
    return request({
        url: `events/goods/${id}`,
        method: 'put',
        data: data
    })
}

// remove event product by event id
export function setDeleteEventProduct(id) {
    return request({
        url: `events/goods/${id}`,
        method: 'delete'
    })
}

// remove event product by event id
export function setAddProduct(id, data) {
    return request({
        url: `events/goods/${id}`,
        method: 'post',
        data
    })
}