import request from '@/utils/myrequest'
import {
    getCookieData
} from '@/utils/auth' // 쿠키설정

// get categories data
export function getCategories() {
    return request({
        url: 'types',
        method: 'get'
    })
}

// upload category icon
export function setUploadIcon(data) {
    return request({
        url: 'upload/typeIcon',
        method: 'post',
        data
    })
}

// update ranking number
export function setUpdateRankingNum(query) {
    return request({
        url: 'types/ranking',
        method: 'put',
        data: query
    })
}

// add category
export function setRegisterCategory(data) {
    return request({
        url: 'types',
        method: 'post',
        data
    })
}

// update category data by id
export function setUpdateCategory(id, query) {
    return request({
        url: `types/${id}`,
        method: 'put',
        data: query
    })
}

// get product data in the categories
export function getGoodsDataByType(id, query) {
    return request({
        url: `types/goodsRanking/${id}`,
        method: 'get',
        params: query
    })
}

// update product ranking number in the categories
export function updateGoodsRankingNumberByType(id, query) {
    return request({
        url: `types/goodsRanking/${id}`,
        method: 'put',
        data: query
    })
}