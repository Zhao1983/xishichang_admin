import request from '@/utils/myrequest'
import {
    getCookieData
} from '@/utils/auth' // 쿠키설정

// get topic data
export function getTopics(query) {
    return request({
        url: 'topics',
        method: 'get',
        params: query
    })
}

export function getTopicOthers() {
    return request({
        url: 'base/topics',
        method: 'get'
    })
}

// get topic data by id
export function getTopicDataById(id) {
    return request({
        url: `topics/${id}`,
        method: 'get'
    })
}

// add topic
export function setRegisterTopic(data) {
    return request({
        url: 'topics',
        method: 'post',
        data
    })
}

// update topic data by id
export function setUpdateTopic(id, query) {
    return request({
        url: `topics/${id}`,
        method: 'put',
        data: query
    })
}

// update topic status by id
export function setUpdateTopicStatus(id, status) {
    return request({
        url: `topics/${id}/${status}`,
        method: 'put'
    })
}