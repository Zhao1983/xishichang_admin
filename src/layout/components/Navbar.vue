<template>
<div class="navbar">
    <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

    <breadcrumb class="breadcrumb-container" />

    <div class="right-menu" style="line-height: 0;">
        <template>
            <div class="right-menu-item" style="font-size: 22px; padding-right: 20px; vertical-align: middle;">
                <router-link :to="'/order/order_pay'" style="position: relative; width: 22px; height: 22px;">
                    <svg-icon icon-class="bell" />
                    <div v-show="orderCount !== 0" class="order_count">{{ orderCount }}</div>
                </router-link>
            </div>
        </template>
        <el-dropdown class="avatar-container" trigger="click">
            <div class="avatar-wrapper">
                <img :src="avatar+'?imageView2/1/w/80/h/80'" class="user-avatar" alt="">
                <i class="el-icon-caret-bottom" />
            </div>
            <el-dropdown-menu slot="dropdown" class="user-dropdown">
                <el-dropdown-item @click.native="showDialog">修改个人信息</el-dropdown-item>
                <el-dropdown-item divided @click.native="logout">
                    <span style="display:block;">退出登录</span>
                </el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown>
    </div>

    <el-dialog v-el-drag-dialog title="个人信息修改" :visible.sync="isShowDialog" :close-on-click-modal="false">
        <el-form ref="addForm" :model="addForm" :rules="rules" class="form-container">
            <el-row>
                <el-col :span="24">
                    <el-form-item label-width="20%" label="登陆账号: " class="postInfo-container-item">
                        <el-input ref="adminName" size="small" id="adminName" v-model="addForm.adminName" placeholder="请输入管理员名称" style="width: 70%;" :readonly="true" />
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item prop="trueName" label-width="20%" label="帐号昵称: " class="postInfo-container-item">
                        <el-input id="trueName" size="small" ref="trueName" v-model="addForm.trueName" type="text" placeholder="请输入管理员昵称" value="" style="width: 70%;" />
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item prop="adminPhone" label-width="20%" label="电话: " class="postInfo-container-item">
                        <el-input id="adminPhone" size="small" ref="adminPhone" v-model="addForm.adminPhone" placeholder="请输入管理员电话" style="width: 70%;" />
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label-width="20%" label="密码: " class="postInfo-container-item">
                        <el-button type="primary" size="small" @click="setViewPwd">修改密码</el-button>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item v-if="isPwd" prop="oldPwd" label-width="20%" label="原密码: " class="postInfo-container-item">
                        <el-input :type="passwordOldType" size="small" id="oldPwd" ref="oldPwd" v-model="addForm.oldPwd" placeholder="请输入原密码" style="width: 70%;" />
                        <span class="show-pwd" @click="setShowPwd('old')">
                            <svg-icon :icon-class="passwordOldType === 'password' ? 'eye' : 'eye-open'" />
                        </span>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item v-if="isPwd" prop="newPwd" label-width="20%" label="新密码: " class="postInfo-container-item">
                        <el-input :type="passwordNewType" size="small" id="newPwd" ref="newPwd" v-model="addForm.newPwd" placeholder="请输入新密码" style="width: 70%;" />
                        <span class="show-pwd" @click="setShowPwd('new')">
                            <svg-icon :icon-class="passwordNewType === 'password' ? 'eye' : 'eye-open'" />
                        </span>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item v-if="isPwd" prop="confirmPwd" label-width="20%" label="确认新密码: " class="postInfo-container-item">
                        <el-input :type="passwordConfirmType" size="small" id="confirmPwd" ref="confirmPwd" v-model="addForm.confirmPwd" placeholder="请输入确认新密码" style="width: 70%;" />
                        <span class="show-pwd" @click="setShowPwd('confirm')">
                            <svg-icon :icon-class="passwordConfirmType === 'password' ? 'eye' : 'eye-open'" />
                        </span>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label-width="20%" label="性别: " class="postInfo-container-item">
                        <el-radio-group v-model="addForm.gender">
                            <el-radio :label="'男'">男</el-radio>
                            <el-radio :label="'女'">女</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="cancelDialog">取消</el-button>
            <el-button type="primary" @click="setProfile">提交</el-button>
        </div>
    </el-dialog>
</div>
</template>

<script>
import {
    mapGetters
} from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import elDragDialog from '@/directive/el-drag-dialog'
import soundFile from '@/assets/sound.mp3'

import {
    MessageBox
} from 'element-ui' // 메세지다이얼로그 추가

import {
    showToast
} from '@/utils/'

import {
    getMenus,
    getOwnerAdmin,
    setUpdateAdminProfile
} from '@/api/admin'

import {
    getOrderNumberByPayed
} from '@/api/order'

export default {
    components: {
        Breadcrumb,
        Hamburger
    },
    computed: {
        ...mapGetters([
            'sidebar',
            'avatar'
        ])
    },
    created() {
        this.getOwnerData()
        this.getMenuData()
    },
    directives: {
        elDragDialog
    },
    mounted() {
        window.addEventListener('keyup', this.inputValue)
    },
    data() {
        return {
            isShowDialog: false,
            isPwd: false,
            passwordOldType: 'password',
            passwordNewType: 'password',
            passwordConfirmType: 'password',
            orderCount: 0,
            soundFile: soundFile,
            addForm: {
                adminName: '',
                trueName: '',
                adminPhone: '',
                gender: '',
                oldPwd: '',
                newPwd: '',
                confirmPwd: ''
            },
            rules: { // validation 체크
                trueName: [{
                    required: true,
                    message: '管理员昵称是必填项',
                    trigger: 'blur'
                }],
                adminPhone: [{
                    required: true,
                    message: '管理员电话是必填项',
                    trigger: 'blur'
                }],
                oldPwd: [{
                    required: true,
                    message: '原密码是必填项',
                    trigger: 'blur'
                }],
                newPwd: [{
                    required: true,
                    message: '新密码是必填项',
                    trigger: 'blur'
                }],
                confirmPwd: [{
                    required: true,
                    message: '确认新密码是必填项',
                    trigger: 'blur'
                }]
            }
        }
    },
    methods: {
        inputValue() {
            this.addForm.adminPhone = this.addForm.adminPhone.trim().replace(/[^0-9]/g, '').substr(0, 11)
        },
        setViewPwd() {
            this.isPwd = !this.isPwd
            this.addForm.oldPwd = ''
            this.addForm.newPwd = ''
            this.addForm.confirmPwd = ''
        },
        setShowPwd(index) {
            if (index === 'old') {
                if (this.passwordOldType === 'password') {
                    this.passwordOldType = ''
                } else {
                    this.passwordOldType = 'password'
                }
                this.$nextTick(() => {
                    this.$refs.oldPwd.focus()
                })
            }

            if (index === 'new') {
                if (this.passwordNewType === 'password') {
                    this.passwordNewType = ''
                } else {
                    this.passwordNewType = 'password'
                }
                this.$nextTick(() => {
                    this.$refs.newPwd.focus()
                })
            }

            if (index === 'confirm') {
                if (this.passwordConfirmType === 'password') {
                    this.passwordConfirmType = ''
                } else {
                    this.passwordConfirmType = 'password'
                }
                this.$nextTick(() => {
                    this.$refs.confirmPwd.focus()
                })
            }
        },
        getOwnerData() {
            getOwnerAdmin().then(respose => {
                if (respose.code === 0) {
                    this.addForm.adminName = respose.data.adminName
                    this.addForm.adminPhone = respose.data.adminPhone
                    this.addForm.trueName = respose.data.trueName
                    this.addForm.gender = respose.data.gender
                }
            })
        },
        getMenuData() {
            getMenus().then(respose => {
                if (respose.code === 0) {
                    respose.data.filter(res => {
                        if (res.subs.length !== 0) {
                            res.subs.filter(val => {
                                if (val.uri === 'order_pay') {
                                    this.setIntervalTime()
                                    this.intervalTime = setInterval(this.setIntervalTime, 60000) // 1분마다 주기적으로 타이머 실행
                                }
                            })
                        }
                    })
                }
            })
        },
        async openMessageBox(message) { // 메시지다이얼로그 async/await 처리
            try {
                await MessageBox.confirm(message, '信息', {
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    type: 'warning'
                })

                return true
            } catch (e) {
                return false
            }
        },
        async setProfile() {
            if (this.addForm.trueName.trim() === '') {
                this.$refs.trueName.focus()
                showToast(this, '请输入帐号昵称', 'warning')
                return
            }

            if (this.addForm.adminPhone.trim() === '') {
                this.$refs.adminPhone.focus()
                showToast(this, '请输入电话', 'warning')
                return
            }

            if (this.isPwd) {
                if (this.addForm.oldPwd.trim() === '') {
                    this.$refs.oldPwd.focus()
                    showToast(this, '请输入原密码', 'warning')
                    return
                }

                if (this.addForm.newPwd.trim() === '') {
                    this.$refs.newPwd.focus()
                    showToast(this, '请输入新密码', 'warning')
                    return
                }

                if (this.addForm.confirmPwd.trim() === '') {
                    this.$refs.confirmPwd.focus()
                    showToast(this, '请输入确认新密码', 'warning')
                    return
                }

                if (this.addForm.newPwd !== this.addForm.confirmPwd) {
                    this.$refs.confirmPwd.focus()
                    showToast(this, '请准确输入密码。', 'warning')
                    return
                }
            }

            const isSuccess = await this.openMessageBox('确认要保存吗？')

            if (isSuccess) {
                const query = {
                    trueName: this.addForm.trueName,
                    adminPhone: this.addForm.adminPhone,
                    oldPwd: this.addForm.oldPwd,
                    newPwd: this.addForm.newPwd,
                    gender: this.addForm.adminGender === '男' ? '1' : '2'
                }

                setUpdateAdminProfile(query).then(() => {
                    this.isShowDialog = false
                })
            }
        },
        showDialog() {
            this.isShowDialog = true
            this.isPwd = false
        },
        cancelDialog() {
            this.isShowDialog = false
        },
        toggleSideBar() {
            this.$store.dispatch('app/toggleSideBar')
        },
        setPlayer() { // 알림음 설정
            const sound = new Audio(this.soundFile)
            const promise = sound.play()

            if (promise !== undefined) {
                promise.then(() => {
                    sound.play()
                }).catch(() => {

                })
            }
        },
        setIntervalTime() { // 지불한 주문데이터 얻기
            getOrderNumberByPayed().then(response => {
                if (response.code === 0) {
                    this.orderCount = response.data.deliveryNum + response.data.runnerNum

                    if (response.data.runnerNum > 0) {
                        this.setPlayer()
                    }
                }
            })
        },
        async logout() {
            window.location.href = '/'
            await this.$store.dispatch('user/logout')
            this.$router.push(`/login?redirect=${this.$route.fullPath}`)
        }
    }
}
</script>

<style lang="scss" scoped>
.order_count {
    position: absolute;
    font-size: 11px;
    top: -10px;
    width: 20px;
    height: 20px;
    background: red;
    padding-top: 10px;
    text-align: center;
    color: #fff;
    border-radius: 50px;
    right: -7px;
}

.navbar {
    height: 50px;
    overflow: hidden;
    position: relative;
    background: #fff;
    box-shadow: 0 1px 4px rgba(0, 21, 41, .08);

    .hamburger-container {
        line-height: 46px;
        height: 100%;
        float: left;
        cursor: pointer;
        transition: background 0.3s;
        -webkit-tap-highlight-color: transparent;

        &:hover {
            background: rgba(0, 0, 0, .025);
        }
    }

    .breadcrumb-container {
        float: left;
    }

    .right-menu {
        float: right;
        height: 100%;
        line-height: 50px;

        &:focus {
            outline: none;
        }

        .right-menu-item {
            display: inline-block;
            padding: 0 8px;
            height: 100%;
            font-size: 18px;
            color: #5a5e66;
            vertical-align: text-bottom;

            &.hover-effect {
                cursor: pointer;
                transition: background 0.3s;

                &:hover {
                    background: rgba(0, 0, 0, .025);
                }
            }
        }

        .avatar-container {
            margin-right: 30px;

            .avatar-wrapper {
                margin-top: 5px;
                position: relative;

                .user-avatar {
                    cursor: pointer;
                    width: 40px;
                    height: 40px;
                    border-radius: 10px;
                }

                .el-icon-caret-bottom {
                    cursor: pointer;
                    position: absolute;
                    right: -20px;
                    top: 25px;
                    font-size: 12px;
                }
            }
        }
    }

    .show-pwd {
        cursor: pointer;
        margin-left: 10px;
        user-select: none;
    }
}
</style>
