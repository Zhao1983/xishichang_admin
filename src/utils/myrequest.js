import axios from 'axios'
import {
    Message
} from 'element-ui'

import setting from '@/settings'
import {
    setCookieData,
    getCookieData,
    removeToken,
    removeCookieData
} from '@/utils/auth'

import {
    resetRouter
} from '@/router'

// axios 인스턴스 창조
const service = axios.create({
    baseURL: setting.BASE_API_URL, // url = base url + request url
    withCredentials: true, // send cookies when cross-domain requests
    timeout: 5000 // request timeout
})

// request interceptor
service.interceptors.request.use(
    config => {
        config.headers['Authorization'] = getCookieData('token') ? getCookieData('token') : ''
        return config
    },
    error => {
        console.log(error) // for debug
        return Promise.reject(error)
    }
)

// response interceptor
service.interceptors.response.use(
    response => {
        const res = response.data

        // 로그인페지에서 요청을 했다면 헤더에서 인증코드를 쿠키에 보관
        if (response.request.responseURL.search('login') !== -1) {
            if (response.status === 200) {
                setCookieData('token', response.headers.authorization)
            }
        }

        switch (response.status) {
            case 200:
            case 201:
            case 204:
                return res
            case 400:
            case 401:
            case 403:
            case 404:
            case 409:
            case 500:
                return res.msg
        }
    },
    error => {
        let messageData = ''

        if (error.response) {
            if (error.response.data.msg) {
                messageData = error.response.data.msg
            } else if (error.response.data.message) {
                messageData = error.response.data.message
            } else if (error.response.headers['error-msg']) {
                messageData = decodeURIComponent(error.response.headers['error-msg'])
            } else {
                messageData = error.response.statusText
            }

            // 인증실패이거나 접근권한실패인 경우 로그아웃처리를 하여 로그인페지로 리다이렉트
            if (error.response.status === 401) {
                // 로그인페지에서 요청이 된것이라면 라우터, 토큰, 인증코드를 모두 초기화하고 로그인페지로 이동(로그아웃처리를 진행)
                if (error.response.request.responseURL.search('login') !== -1) {
                    removeToken()
                    resetRouter()
                    removeCookieData('token')
                } else { // 로그인페지에서 요청이 된것이 아니라면 메세지를 띄우고 로그인페지로 리다이렉트(로그아웃처리를 진행)
                    setTimeout(() => {
                        removeToken()
                        resetRouter()
                        removeCookieData('token')
                        window.location.href = '/'
                    }, 3000)
                }
            }
        } else {
            messageData = '请确认网络状态。'
        }

        Message({
            message: messageData,
            type: 'error',
            duration: 5 * 1000
        })

        return messageData
    }
)

export default service