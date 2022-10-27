import Pagination from '@/components/Pagination' // 페이징 콘퍼넨트 추가

import {
    getAdmin,
    getAdminPermission,
    setUpdateAdmin,
    setAddAdmin,
    setUpdateAdminPermission,
    setDeleteAdmin
} from '@/api/admin'

import {
    getWechatInfo
} from '@/api/member' // 상품카테고리 API 추가

import {
    setClearGoodsSearchField,
    setClearGoodsBatchSearchField,
    setClearShopSearchField,
    setClearShopBatchField,
    setClearOrderSearchField
} from '@/utils/auth'

import elDragDialog from '@/directive/el-drag-dialog'

import {
    MessageBox
} from 'element-ui' // 메세지다이얼로그 추가

import {
    showToast
} from '@/utils/'

export default {
    name: 'Admin_permission',
    components: {
        Pagination
    },
    computed: {
        menus() {
            return this.menuData
        }
    },
    created() {
        setClearGoodsSearchField()
        setClearGoodsBatchSearchField()
        setClearShopSearchField()
        setClearShopBatchField()
        setClearOrderSearchField()

        this.getAdminData()
    },
    mounted() {
        window.addEventListener('keyup', this.inputValue)
    },
    directives: {
        elDragDialog
    },
    data() {
        return {
            listLoading: false,
            listLoadingUser: false,
            adminData: [], // 관리자 배렬
            page: 1,
            size: 10,
            totalNum: 0,
            isShowAdmin: false, // 관리자정보수정다이얼로그 로출여부
            isShowPermission: false, // 관리자에 따르는 권한설정다이얼로그 로출 여부
            menuData: [], // 메뉴배렬
            checkStrictly: false, // 관리자권한설정에시 리용되는 나무구조에서 어미가 변해도 자식쪽에 영향을 주지 않기
            adminId: 0, // 관리자아이디
            kind: '', // 관리자등록종류(추가/수정)
            isPwd: false,
            passwordType: 'password',
            defaultProps: { // 나무구조에서 보여줘야 할 부분 설정변수
                children: 'children', // 자식부분
                label: 'name' // 메뉴제목
            },
            searchWehchatName: '',
            searchWehchatPhone: '',
            listUserData: [],
            totalUserNum: 0,
            pageUser: 1,
            sizeUser: 10,
            addForm: { // 폼데이터
                adminName: '', // 카테고리명
                trueName: '', // 랭킹번호
                adminPhone: '', // 관리자폰번호
                adminPwd: '', // 관리자 비밀번호
                gender: '1', // 관리자 성별
                adminStatus: '0', // 관리자 활성/비활성
                wechatId: 0, // 바운딩된 위챗사용자아이디,
                wechatName: '' // 바운딩된 위챗사용자명
            },
            rules: { // validation 체크
                adminName: [{
                    required: true,
                    message: '管理员名称是必填项',
                    trigger: 'blur'
                }],
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
                adminPwd: [{
                    required: true,
                    message: '密码是必填项',
                    trigger: 'blur'
                }]
            }
        }
    },
    methods: {
        inputValue() {
            this.addForm.adminPhone = this.addForm.adminPhone.trim().replace(/[^0-9]/g, '').substr(0, 11)
            this.searchWehchatPhone = this.searchWehchatPhone.trim().replace(/[^0-9]/g, '').substr(0, 11)
        },
        getAdminData() {
            this.listLoading = true
            const query = {
                page: this.page,
                size: this.size
            }

            getAdmin(query).then(response => {
                if (response.code === 0) {
                    this.adminData = response.data.list
                    this.page = response.data.page
                    this.size = response.data.size
                    this.totalNum = response.data.totalNum
                }

                this.listLoading = false
            })
        },
        getAdminPermissionData() {
            getAdminPermission(this.adminId).then(respose => {
                if (respose.code === 0) {
                    this.menuData = this.generateMenus(respose.data.dtoList, 'all')

                    this.$nextTick(() => {
                        const routes = this.generateMenus(respose.data.dtoList, 'permission')
                        this.$refs.menu.setCheckedNodes(this.generateArr(routes))

                        this.checkStrictly = false
                    })
                }
            })
        },
        async setAdmin() {
            if (this.addForm.adminName.trim() === '') {
                this.$refs.adminName.focus()
                showToast(this, '请输入管理员名称', 'warning')
                return
            }

            if (this.addForm.trueName.trim() === '') {
                this.$refs.trueName.focus()
                showToast(this, '请输入管理员昵称', 'warning')
                return
            }

            if (this.addForm.adminPhone.trim() === '') {
                this.$refs.adminPhone.focus()
                showToast(this, '请输入管理员电话', 'warning')
                return
            }

            if (this.isPwd) {
                if (this.addForm.adminPwd.trim() === '') {
                    this.$refs.adminPwd.focus()
                    showToast(this, '请输入密码', 'warning')
                    return
                }
            }

            if (this.addForm.wechatId === 0) {
                showToast(this, '还未绑定，无法保存', 'warning')
                return
            }

            const isSuccess = await this.openMessageBox('确认要保存吗？')

            if (!isSuccess) {
                return
            }

            const query = {
                adminName: this.addForm.adminName,
                trueName: this.addForm.trueName,
                adminPhone: this.addForm.adminPhone,
                adminPwd: this.addForm.adminPwd,
                adminGender: this.addForm.gender,
                adminStatus: this.addForm.adminStatus,
                wechatId: this.addForm.wechatId
            }

            if (this.kind === 'add') {
                setAddAdmin(query).then(response => {
                    if (response.code === 0) {
                        showToast(this, '操作成功', 'success')
                        this.setCancelDialog()
                        this.getAdminData()
                    }
                })
            } else {
                setUpdateAdmin(this.adminId, query).then(response => {
                    if (response === '') {
                        showToast(this, '操作成功', 'success')
                        this.setCancelDialog()
                        this.getAdminData()
                    }
                })
            }
        },
        async setAdminPermission() {
            const isSuccess = await this.openMessageBox('确认要保存吗？')

            if (!isSuccess) {
                return
            }

            let ids = []
            const temps = this.$refs.menu.getCheckedKeys()
            temps.filter(res => {
                let val = res.split('-')
                if (!ids.includes(val[0])) {
                    ids.push(val[0])
                }
                if (val[1] !== '') {
                    ids.push(val[1])
                }
            })

            let status = []

            ids.filter(() => {
                status.push('1')
            })
            const query = {
                ids: ids,
                status: status
            }

            setUpdateAdminPermission(this.adminId, query).then(response => {
                if (response === '') {
                    this.setCancelDialog()
                    showToast(this, '操作成功', 'success')
                }
            })
        },
        async setRemoveAdmin(id) {
            const isSuccess = await this.openMessageBox('确定要删除吗？')

            if (!isSuccess) {
                return
            }

            setDeleteAdmin(id).then(response => {
                if (response === '') {
                    showToast(this, '操作成功', 'success')
                    this.getAdminData()
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
        generateMenus(menus, index) { // 해당 메뉴값을 나무구조에 맞게 새로 생성하기(메뉴원본과 권한에 따르는 메뉴를 분리하여 권한에 따르는 메뉴가 선택되게 하기 위함)
            const res = []
            let data = {}

            for (let menu of menus) {
                if (index === 'all') { // 메뉴전체 생성하기
                    data = {
                        id: menu.id + '-',
                        name: menu.name
                    }

                    if (menu.dtoList.length !== 0) {
                        data.children = []
                        menu.dtoList.filter(res => {
                            let val = {
                                id: menu.id + '-' + res.id,
                                name: res.name
                            }
                            data.children.push(val)
                        })
                    }
                } else { // 관리자권한에 따르는 메뉴 생성하기
                    if (menu.status === '1') {
                        data = {
                            id: menu.id + '-',
                            name: menu.name
                        }

                        if (menu.dtoList.length !== 0) {
                            data.children = []
                            menu.dtoList.filter(res => {
                                if (res.status === '1') {
                                    let val = {
                                        id: menu.id + '-' + res.id,
                                        name: res.name
                                    }
                                    data.children.push(val)
                                }
                            })
                        }
                    }
                }

                res.push(data)
            }

            return res
        },
        generateArr(menus) { // 배렬형태를 string으로 변환하기
            let data = []
            menus.forEach(route => {
                data.push(route)
                if (route.children) {
                    const temp = this.generateArr(route.children)
                    if (temp.length > 0) {
                        data = [...data, ...temp]
                    }
                }
            })
            return data
        },
        setViewPwd() {
            this.isPwd = !this.isPwd
            this.addForm.adminPwd = ''
        },
        showPwd() {
            if (this.passwordType === 'password') {
                this.passwordType = ''
            } else {
                this.passwordType = 'password'
            }
            this.$nextTick(() => {
                this.$refs.adminPwd.focus()
            })
        },
        setShowAdminDialog(index, id) {
            this.kind = index
            this.isShowAdmin = true
            this.adminId = id
            this.searchWehchatName = ''
            this.searchWehchatPhone = ''

            if (index === 'add') {
                this.addForm.adminName = ''
                this.addForm.trueName = ''
                this.addForm.adminPhone = ''
                this.addForm.adminPwd = ''
                this.addForm.gender = '1'
                this.addForm.adminStatus = '0'
                this.isPwd = true
                this.addForm.wechatId = 0
                this.addForm.wechatName = ''
            }

            if (index === 'update') {
                this.isPwd = false

                this.adminData.filter(res => {
                    if (res.id === id) {
                        this.addForm.adminName = res.adminName
                        this.addForm.trueName = res.trueName
                        this.addForm.adminPhone = res.adminPhone
                        this.addForm.adminPwd = res.adminPwd
                        this.addForm.gender = res.gender === '男' ? '1' : '2'
                        this.addForm.adminStatus = res.adminStatus
                        this.addForm.wechatId = res.wechatId
                        this.addForm.wechatName = res.wechatName === null ? '' : res.wechatName
                    }
                })
            }

            this.getOwnerInfoData()
        },
        setShowPermissionDialog(id) {
            this.isShowPermission = true
            this.checkStrictly = true
            this.adminId = id
            this.getAdminPermissionData()
        },
        setCancelDialog() {
            this.isShowAdmin = false
            this.isShowPermission = false
        },
        setSearchUserInfo() {
            this.pageUser = 1
            this.getOwnerInfoData()
        },
        getOwnerInfoData() {
            let temp = []
            this.listLoadingUser = true
            const query = {
                userNick: this.searchWehchatName.trim(),
                phoneNum: this.searchWehchatPhone.trim(),
                role: '',
                page: this.pageUser,
                size: this.sizeUser
            }

            getWechatInfo(query).then(response => {
                if (response.code === 0) {
                    this.totalUserNum = response.data.totalNum
                    this.pageUser = response.data.page
                    this.sizeUser = response.data.size

                    if (response.data.list.length !== 0) {
                        response.data.list.filter(res => {
                            let val = {
                                id: res.id,
                                checked: this.addForm.wechatId === res.id ? this.addForm.wechatId : 0,
                                userRole: res.userRole,
                                userNick: res.userNick,
                                userName: res.userName,
                                phoneNum: res.phoneNum,
                                userStatus: res.userStatus
                            }

                            temp.push(val)
                        })
                    }

                    this.listUserData = temp
                }

                this.listLoadingUser = false
            })
        },
        setOwnerInfo(row) {
            this.addForm.wechatId = row.id

            this.listUserData.filter(res => {
                res.checked = res.id === row.id ? 1 : 0
            })
        }
    }
}