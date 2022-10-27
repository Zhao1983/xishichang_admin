<template>
<div class="login-container">
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on" label-position="left">
        <div class="title-container">
            <h3 class="title">登录</h3>
        </div>
        <el-form-item prop="username">
            <span class="svg-container">
                <svg-icon icon-class="user" />
            </span>
            <el-input ref="username" v-model="loginForm.username" placeholder="用户名" name="username" type="text" tabindex="1" auto-complete="on" />
        </el-form-item>
        <el-form-item prop="password">
            <span class="svg-container">
                <svg-icon icon-class="password" />
            </span>
            <el-input :key="passwordType" ref="password" v-model="loginForm.password" :type="passwordType" placeholder="密码" name="password" tabindex="2" auto-complete="on" @keyup.enter.native="handleLogin" />
            <span class="show-pwd" @click="showPwd">
                <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
            </span>
        </el-form-item>
        <div v-if="testUrl === 'http://manager.yjxishi.com/'">
            <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:10px;" @click.native.prevent="handleLogin">登录</el-button>
        </div>
        <div v-else>
            <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:10px;" @click.native.prevent="handleLogin">后台登录</el-button>
            <el-button :loading="loading" type="secondary" style="width:100%;margin-bottom:30px; margin-left: 0;" @click.native.prevent="setRedirectPage">前台登录</el-button>
        </div>
    </el-form>
</div>
</template>

<script>
import {
    getWechatToken
} from '@/api/admin'

import {
    setClearGoodsSearchField,
    setClearGoodsBatchSearchField,
    setClearShopSearchField,
    setClearShopBatchField,
    setClearOrderSearchField
} from '@/utils/auth'

import {
    showToast
} from '@/utils/'

export default {
    name: 'Login',
    data() {
        const validateUsername = (rule, value, callback) => {
            if (value.trim() === '') {
                callback(new Error('请输入正确的用户名'))
            } else {
                callback()
            }
        }
        const validatePassword = (rule, value, callback) => {
            if (value.length < 6) {
                callback(new Error('密码是6位以上'))
            } else {
                callback()
            }
        }
        return {
            loginForm: {
                username: '',
                password: ''
            },
            loginRules: {
                username: [{
                    required: true,
                    trigger: 'blur',
                    validator: validateUsername
                }],
                password: [{
                    required: true,
                    trigger: 'blur',
                    validator: validatePassword
                }]
            },
            loading: false,
            passwordType: 'password',
            redirect: undefined,
            testUrl: ''
        }
    },
    created() {
        this.testUrl = this.$router.app.$el.baseURI.split('#')[0]
    },
    watch: {
        $route: {
            handler: function (route) {
                this.redirect = route.query && route.query.redirect
            },
            immediate: true
        }
    },
    methods: {
        showPwd() {
            if (this.passwordType === 'password') {
                this.passwordType = ''
            } else {
                this.passwordType = 'password'
            }
            this.$nextTick(() => {
                this.$refs.password.focus()
            })
        },
        handleLogin() {
            this.$refs.loginForm.validate(valid => {
                if (valid) {
                    this.loading = true
                    this.$store.dispatch('user/login', this.loginForm).then(response => {
                        if (response.code === 200) {
                            setClearGoodsSearchField()
                            setClearGoodsBatchSearchField()
                            setClearShopSearchField()
                            setClearShopBatchField()
                            setClearOrderSearchField()

                            this.$router.push({
                                path: this.redirect || '/'
                            })
                        }

                        this.loading = false
                    }).catch(() => {
                        this.loading = false
                    })
                } else {
                    console.log('error submit!!')
                    return false
                }
            })
        },
        setRedirectPage() {
            const query = {
                userName: this.loginForm.username,
                userPwd: this.loginForm.password
            }

            this.$refs.loginForm.validate(valid => {
                if (valid) {
                    this.loading = true
                    getWechatToken(query).then(response => {
                        this.loading = false

                        if (response.code === 0) {
                            if (this.$router.app.$el.baseURI.split('#')[0].search('http://192.168.1.132') !== -1) {
                                window.location.href = 'http://192.168.1.132:8085/intro?key=' + response.data
                            }

                            if (this.$router.app.$el.baseURI.split('#')[0].search('http://192.168.1.216') !== -1) {
                                window.location.href = 'http://192.168.1.216:9801/intro?key=' + response.data
                            }

                            if (this.$router.app.$el.baseURI.split('#')[0].search('http://192.168.1.240') !== -1) {
                                window.location.href = 'http://192.168.1.240:9801/intro?key=' + response.data
                            }

                            if (this.$router.app.$el.baseURI.split('#')[0].search('http://192.168.1.139') !== -1) {
                                window.location.href = 'http://192.168.1.139:9801/intro?key=' + response.data
                            }

                            if (this.$router.app.$el.baseURI.split('#')[0].search('https://tm.yjxishi.com') !== -1) {
                                window.location.href = 'https://ts.yjxishi.com/intro?key=' + response.data
                            }
                        }
                    })
                } else {
                    console.log('error submit!!')
                    return false
                }
            })
        }
    }
}
</script>

<style lang="scss">
$bg: #283443;
$light_gray: #fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
    .login-container .el-input input {
        color: $cursor;
    }
}

/* reset element-ui css */
.login-container {
    .el-input {
        display: inline-block;
        height: 47px;
        width: 85%;

        input {
            background: transparent;
            border: 0;
            -webkit-appearance: none;
            border-radius: 0;
            padding: 12px 5px 12px 15px;
            color: $light_gray;
            height: 47px;
            caret-color: $cursor;

            &:-webkit-autofill {
                box-shadow: 0 0 0 1000px $bg inset !important;
                -webkit-text-fill-color: $cursor !important;
            }
        }
    }

    .el-form-item {
        border: 1px solid rgba(255, 255, 255, 0.1);
        background: rgba(0, 0, 0, 0.1);
        border-radius: 5px;
        color: #454545;
    }
}
</style>

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
    min-height: 100%;
    width: 100%;
    background-color: $bg;
    overflow: hidden;

    .login-form {
        position: relative;
        width: 520px;
        max-width: 100%;
        padding: 160px 35px 0;
        margin: 0 auto;
        overflow: hidden;
    }

    .tips {
        font-size: 14px;
        color: #fff;
        margin-bottom: 10px;

        span {
            &:first-of-type {
                margin-right: 16px;
            }
        }
    }

    .svg-container {
        padding: 6px 5px 6px 15px;
        color: $dark_gray;
        vertical-align: middle;
        width: 30px;
        display: inline-block;
    }

    .title-container {
        position: relative;

        .title {
            font-size: 26px;
            color: $light_gray;
            margin: 0 auto 40px;
            text-align: center;
            font-weight: bold;
        }
    }

    .show-pwd {
        position: absolute;
        right: 10px;
        top: 7px;
        font-size: 16px;
        color: $dark_gray;
        cursor: pointer;
        user-select: none;
    }
}
</style>
