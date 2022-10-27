import {
    setLogin
} from '@/api/admin'

import {
    getToken,
    setToken,
    removeToken,
    removeCookieData
} from '@/utils/auth'

import {
    resetRouter
} from '@/router'

import avatar from '@/assets/images/admin_avatar.gif'

const getDefaultState = () => {
    return {
        token: getToken(),
        name: '',
        avatar: ''
    }
}

const state = getDefaultState()

const mutations = {
    RESET_STATE: (state) => {
        Object.assign(state, getDefaultState())
    },
    SET_TOKEN: (state, token) => {
        state.token = token
    },
    SET_NAME: (state, name) => {
        state.name = name
    },
    SET_AVATAR: (state, avatar) => {
        state.avatar = avatar
    }
}

const actions = {
    // user login
    login({
        commit
    }, userInfo) {
        const {
            username,
            password
        } = userInfo
        return new Promise((resolve, reject) => {
            setLogin({
                userName: username.trim(),
                userPwd: password
            }).then(response => {
                if (response.code !== undefined) {
                    commit('SET_TOKEN', 'admin-token')
                    setToken('admin-token')
                    resolve(response)
                } else {
                    resolve(response)
                }
            }).catch(error => {
                reject(error)
            })
        })
    },

    // get user info
    getInfo({
        commit,
        state
    }) {
        return new Promise((resolve, reject) => {
            const users = {
                roles: ['admin'],
                introduction: 'I am a super administrator',
                avatar: avatar,
                name: 'Super Admin'
            }

            commit('SET_NAME', 'admin-token')
            commit('SET_AVATAR', avatar)
            resolve(users)
        })
    },

    // user logout
    logout({
        commit,
        state
    }) {
        return new Promise((resolve, reject) => {
            removeToken() // must remove  token  first
            removeCookieData('token')
                // localStorage.removeItem('token')
            resetRouter()
            commit('RESET_STATE')
            resolve()
        })
    },

    // remove token
    resetToken({
        commit
    }) {
        return new Promise(resolve => {
            removeToken() // must remove  token  first
            removeCookieData('token')
                // localStorage.removeItem('token')
            commit('RESET_STATE')
            resolve()
        })
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}