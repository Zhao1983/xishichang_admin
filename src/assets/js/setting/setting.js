import Tinymce from '@/components/Tinymce' // 편집기 컴포넨트 추가
import Pagination from '@/components/Pagination' // 페이징 콘퍼넨트 추가
import Thumbnail from '@/components/ImageItem/single_image' // 이미지 컴포넨트 추가
import Map from '@/components/Map'
import elDragDialog from '@/directive/el-drag-dialog'
import imageBack from '@/assets/images/review_image_back.png' // 썸네일 백그라운드 이미지 추가
import settings from '@/settings'

import {
    MessageBox
} from 'element-ui' // 메세지다이얼로그 추가

import {
    getSettingData,
    setUploadSiteLogoImage,
    setUploadShopImage,
    setUpdateData,
    setUploadGoodsIcon,
    setUploadGoodsImageIcon,
    setUploadGoodsWordImage
} from '@/api/setting' // 설정 API 추가

import {
    getWechatInfo
} from '@/api/member' // 위챗에 바운딩된 사용자정보 API

import {
    setClearGoodsSearchField,
    setClearGoodsBatchSearchField,
    setClearShopSearchField,
    setClearShopBatchField,
    setClearOrderSearchField
} from '@/utils/auth' // 쿠키설정

import {
    showToast,
    validateEmail
} from '@/utils/'

export default {
    name: 'Setting',
    components: {
        Tinymce,
        Pagination,
        Thumbnail,
        Map
    },
    created() {
        setClearGoodsSearchField()
        setClearGoodsBatchSearchField()
        setClearShopSearchField()
        setClearShopBatchField()
        setClearOrderSearchField()

        this.getSetting()
    },
    mounted() {
        window.addEventListener('keyup', this.setIntegerValue)
        window.addEventListener('focusout', this.setFocusValue)
    },
    directives: {
        elDragDialog
    },
    data() {
        return {
            listLoading: false,
            imageBack: imageBack,
            baseURL: settings.BASE_API_URL, // 편집기에서 이미지업로드용 API BASE URL
            dataForm: {
                siteName: '', // 사이트명
                siteLogo: imageBack, // 사이트이미지
                tempPhone: '', // 고객센터전화
                serviceWechat: [], // 고객위챗배렬
                tempWechat: [], // 템프고객위챗배렬
                tempWechatName: '', // 고객위챗명
                tempMail: '', // 이메일
                gps: '', // 쇼핑몰 운영기업 위치
                icp: '', // ICP증서 번호
                tempStartWorking: '', // 근무시작시간
                tempEndWorking: '', // 근무마감시간
                orderLimit: 0, // 영업시간마감전 주문허용시간
                domain: '', // 사이트도메인
                salesStatus: '', // 판매수
                readme: '', // 쇼핑몰소개
                orderInvalidDuration: '', // 지불대기시간
                orderDeliveryDuration: '', // 배송설정일
                tempKeyword: '', // 추천검색어
                siteStatus: '1', // 쇼핑몰 on/off
                shopIcon: imageBack, // 점포이미지
                shopLevel_min_1: undefined, // 점포판매최소량1
                shopLevel_min_2: undefined, // 점포판매최소량2
                shopLevel_min_3: undefined, // 점포판매최소량3
                shopLevel_min_4: undefined, // 점포판매최소량4
                shopLevel_min_5: undefined, // 점포판매최소량5
                shopLevel_max_1: undefined, // 점포판매최대량1
                shopLevel_max_2: undefined, // 점포판매최대량2
                shopLevel_max_3: undefined, // 점포판매최대량3
                shopLevel_max_4: undefined, // 점포판매최대량4
                shopLevel_max_5: undefined, // 점포판매최대량5
                unit: '', // 계량단위
                salesNotice: '', // 푸터내용
                closedNotice: '', // 쇼핑몰 off 리유
                watermarkPic: imageBack,
                watermarkWord: imageBack,
                goodsIconBeans: [],
                iconName: '',
                iconUrl: imageBack,
                orderSmsStatus: false,
                orderSmsMsg: '',
                orderLimitNum: 0, // 하루 주문할 개수
                orderLimitMsg: '' // 하루 주문할 개수가 넘어났을 때 메세지내용
            },
            rules: {
                siteName: [{
                    required: true,
                    message: '商城名称是必填项',
                    trigger: 'blur'
                }],
                tempPhone: [{
                    required: true,
                    message: '客服电话是必填项',
                    trigger: 'blur'
                }],
                gps: [{
                    required: true,
                    message: '商城位置是必填项',
                    trigger: 'blur'
                }],
                icp: [{
                    required: true,
                    message: 'ICP证书号是必填项',
                    trigger: 'blur'
                }],
                tempStartWorking: [{
                    required: true,
                    message: '工作时间是必填项',
                    trigger: 'blur'
                }],
                orderLimit: [{
                    required: true,
                    message: '营业结束前限制时间是必填项',
                    trigger: 'blur'
                }],
                orderLimitNum: [{
                    required: true,
                    message: '每天订单的上限数量是必填项',
                    trigger: 'blur'
                }],
                orderLimitMsg: [{
                    required: true,
                    message: '每天订单上限数量的提示语是必填项',
                    trigger: 'blur'
                }],
                domain: [{
                    required: true,
                    message: '网站域名是必填项',
                    trigger: 'blur'
                }],
                orderInvalidDuration: [{
                    required: true,
                    message: '下单付款失效是必填项',
                    trigger: 'blur'
                }],
                orderDeliveryDuration: [{
                    required: true,
                    message: '超时快递设置是必填项',
                    trigger: 'blur'
                }],
                shopLevel_min_1: [{
                    required: true,
                    message: '商户销量等级算法是必填项',
                    trigger: 'blur'
                }]
            },
            siteLogoFile: undefined,
            shopIconFile: undefined,
            tempUnit: [], // 계량단위배렬
            isShowMapDialog: false, // 지도현시다이얼로그 로출상태값
            isShowKeywordDialog: false, // 추천검색어추가 다이얼로그 로출 상태값
            keyword: '',
            isShowUnitDialog: false, // 계량단위추가 다이얼로그 로출 상태값
            isShowWechatDialog: false, // 위챗정보다이얼로그
            isShowGoodsIconDialog: false,
            dlgUnit: '',
            searchWehchatPhone: '',
            searchWehchatName: '',
            totalUserNum: 0,
            pageUser: 1,
            sizeUser: 10,
            listUserData: [],
            isTagChecked: false,
            dlgIconName: '',
            dlgIconUrl: imageBack,
            dlgIconFile: undefined,
            watermarkWordFile: undefined,
            watermarkPicFile: undefined,
            styles: { // 썸네일 사이즈 스타일
                width: '70px',
                height: '70px',
                cursor: 'pointer'
            },
            shopStyle: { // 썸네일 사이즈 스타일
                width: '130px',
                height: '70px',
                cursor: 'pointer'
            }
        }
    },
    methods: {
        setIntegerValue(element) {
            if (element.target.id === 'siteName') {
                this.dataForm.siteName = this.dataForm.siteName.substr(0, 50)
            }

            if (element.target.id === 'tempSmsMsg') {
                this.dataForm.orderSmsMsg = this.dataForm.orderSmsMsg.substr(0, 100)
            }

            if (element.target.id === 'orderLimit') {
                if (this.dataForm.orderLimit !== undefined) {
                    this.dataForm.orderLimit = this.dataForm.orderLimit.replace(/[^0-9]/g, '')
                }
            }

            if (element.target.id === 'orderLimitNum') {
                if (this.dataForm.orderLimitNum !== undefined) {
                    this.dataForm.orderLimitNum = this.dataForm.orderLimitNum.replace(/[^0-9]/g, '')
                }
            }

            if (element.target.id === 'orderInvalidDuration') {
                if (this.dataForm.orderInvalidDuration !== undefined) {
                    this.dataForm.orderInvalidDuration = this.dataForm.orderInvalidDuration.replace(/[^0-9]/g, '')
                }
            }

            if (element.target.id === 'orderDeliveryDuration') {
                if (this.dataForm.orderDeliveryDuration !== undefined) {
                    this.dataForm.orderDeliveryDuration = this.dataForm.orderDeliveryDuration.replace(/[^0-9]/g, '')
                }
            }

            if (element.target.id === 'shopLevel_min_1') {
                if (this.dataForm.shopLevel_min_1 !== undefined) {
                    this.dataForm.shopLevel_min_1 = this.dataForm.shopLevel_min_1.replace(/[^0-9]/g, '')
                }
            }

            if (element.target.id === 'shopLevel_min_2') {
                if (this.dataForm.shopLevel_min_2 !== undefined) {
                    this.dataForm.shopLevel_min_2 = this.dataForm.shopLevel_min_2.replace(/[^0-9]/g, '')
                }
            }

            if (element.target.id === 'shopLevel_min_3') {
                if (this.dataForm.shopLevel_min_3 !== undefined) {
                    this.dataForm.shopLevel_min_3 = this.dataForm.shopLevel_min_3.replace(/[^0-9]/g, '')
                }
            }

            if (element.target.id === 'shopLevel_min_4') {
                if (this.dataForm.shopLevel_min_4 !== undefined) {
                    this.dataForm.shopLevel_min_4 = this.dataForm.shopLevel_min_4.replace(/[^0-9]/g, '')
                }
            }

            if (element.target.id === 'shopLevel_min_5') {
                if (this.dataForm.shopLevel_min_5 !== undefined) {
                    this.dataForm.shopLevel_min_5 = this.dataForm.shopLevel_min_5.replace(/[^0-9]/g, '')
                }
            }

            if (element.target.id === 'shopLevel_max_1') {
                if (this.dataForm.shopLevel_max_1 !== undefined) {
                    this.dataForm.shopLevel_max_1 = this.dataForm.shopLevel_max_1.replace(/[^0-9]/g, '')
                }
            }

            if (element.target.id === 'shopLevel_max_2') {
                if (this.dataForm.shopLevel_max_2 !== undefined) {
                    this.dataForm.shopLevel_max_2 = this.dataForm.shopLevel_max_2.replace(/[^0-9]/g, '')
                }
            }

            if (element.target.id === 'shopLevel_max_3') {
                if (this.dataForm.shopLevel_max_3 !== undefined) {
                    this.dataForm.shopLevel_max_3 = this.dataForm.shopLevel_max_3.replace(/[^0-9]/g, '')
                }
            }

            if (element.target.id === 'shopLevel_max_4') {
                if (this.dataForm.shopLevel_max_4 !== undefined) {
                    this.dataForm.shopLevel_max_4 = this.dataForm.shopLevel_max_4.replace(/[^0-9]/g, '')
                }
            }

            if (element.target.id === 'shopLevel_max_5') {
                if (this.dataForm.shopLevel_max_5 !== undefined) {
                    this.dataForm.shopLevel_max_5 = this.dataForm.shopLevel_max_5.replace(/[^0-9]/g, '')
                }
            }
        },
        setUploadSiteLogo(data) {
            return new Promise((resolve, reject) => {
                setUploadSiteLogoImage(data).then(response => {
                    resolve(response)
                }).catch(error => {
                    reject(error)
                })
            })
        },
        setUploadGoodsIcon(iconName, data) {
            return new Promise((resolve, reject) => {
                setUploadGoodsIcon(iconName, data).then(response => {
                    resolve(response)
                }).catch(error => {
                    reject(error)
                })
            })
        },
        setUploadShopIcon(data) {
            return new Promise((resolve, reject) => {
                setUploadShopImage(data).then(response => {
                    resolve(response)
                }).catch(error => {
                    reject(error)
                })
            })
        },
        setUploadGoodsImageIcon(data) {
            return new Promise((resolve, reject) => {
                setUploadGoodsImageIcon(data).then(response => {
                    resolve(response)
                }).catch(error => {
                    reject(error)
                })
            })
        },
        setUploadGoodsWordImage(data) {
            return new Promise((resolve, reject) => {
                setUploadGoodsWordImage(data).then(response => {
                    resolve(response)
                }).catch(error => {
                    reject(error)
                })
            })
        },
        async openMessageBox() { // 메시지다이얼로그 async/await 처리
            try {
                await MessageBox.confirm('确认要保存吗?', '信息', {
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    type: 'warning'
                })

                return true
            } catch (e) {
                return false
            }
        },
        getSetting() {
            getSettingData().then(response => {
                if (response.code === 0) {
                    this.dataForm.siteName = response.data.siteName // 쇼핑몰명
                    this.dataForm.siteLogo = response.data.siteLogo === null || response.data.siteLogo === '' ? imageBack : response.data.siteLogo // 쇼핑몰이미지
                    this.dataForm.shopIcon = response.data.shopIcon === null || response.data.shopIcon === '' ? imageBack : response.data.shopIcon // 점포이미지

                    if (response.data.servicePhone.length !== 0) { // 고객센터전화
                        response.data.servicePhone.filter(res => {
                            this.dataForm.tempPhone += res + ','
                        })
                        this.dataForm.tempPhone = this.dataForm.tempPhone.slice(0, this.dataForm.tempPhone.length - 1)
                    }

                    this.dataForm.serviceWechat = response.data.serviceWechat

                    if (response.data.serviceWechat.length !== 0) { // 웨신번호
                        response.data.serviceWechat.filter(res => {
                            this.dataForm.tempWechatName += res.name + ','
                        })
                        this.dataForm.tempWechatName = this.dataForm.tempWechatName.slice(0, this.dataForm.tempWechatName.length - 1)
                    }

                    if (response.data.serviceMail.length !== 0) { // 쇼핑몰메일
                        response.data.serviceMail.filter(res => {
                            this.dataForm.tempMail += res + ','
                        })
                        this.dataForm.tempMail = this.dataForm.tempMail.slice(0, this.dataForm.tempMail.length - 1)
                    }

                    this.dataForm.gps = response.data.gps // 쇼핑몰위치
                    this.dataForm.icp = response.data.icp // ICP

                    if (response.data.workingTime !== null) { // 근무시간
                        this.dataForm.tempStartWorking = response.data.workingTime.beginTime // 근무시작시간
                        this.dataForm.tempEndWorking = response.data.workingTime.endTime // 근무마감시간
                        this.dataForm.orderLimit = response.data.workingTime.timeLimit // 영업마감전 주문지불허용시간
                    }

                    this.dataForm.domain = response.data.domain // 쇼핑몰도메인
                    this.dataForm.salesStatus = response.data.salesStatus // 판매수
                    this.dataForm.orderInvalidDuration = response.data.orderInvalidDuration // 지불대기시간
                    this.dataForm.orderDeliveryDuration = response.data.orderDeliveryDuration // 배송설정시간
                    this.dataForm.tempKeyword = response.data.tags // 추천검색어
                    this.dataForm.siteStatus = response.data.siteStatus // 쇼핑몰 on/off
                    this.dataForm.closedNotice = response.data.closedNotice // 쇼핑몰 off 리유
                    this.dataForm.orderLimitNum = response.data.orderLimitNum ? response.data.orderLimitNum : 0
                    this.dataForm.orderLimitMsg = response.data.orderLimitMsg ? response.data.orderLimitMsg : ''

                    // 점포등급
                    const tempLevel = response.data.shopLevels

                    if (tempLevel !== null) {
                        if (tempLevel[0]) {
                            this.dataForm.shopLevel_min_1 = tempLevel[0].min
                            this.dataForm.shopLevel_max_1 = tempLevel[0].max
                        }

                        if (tempLevel[1]) {
                            this.dataForm.shopLevel_min_2 = tempLevel[1].min
                            this.dataForm.shopLevel_max_2 = tempLevel[1].max
                        }

                        if (tempLevel[2]) {
                            this.dataForm.shopLevel_min_3 = tempLevel[2].min
                            this.dataForm.shopLevel_max_3 = tempLevel[2].max
                        }

                        if (tempLevel[3]) {
                            this.dataForm.shopLevel_min_4 = tempLevel[3].min
                            this.dataForm.shopLevel_max_4 = tempLevel[3].max
                        }

                        if (tempLevel[4]) {
                            this.dataForm.shopLevel_min_5 = tempLevel[4].min
                            this.dataForm.shopLevel_max_5 = tempLevel[4].max
                        }
                    }

                    this.tempUnit = response.data.units
                    this.dataForm.readme = response.data.readme // 쇼핑몰소개
                    this.dataForm.salesNotice = response.data.salesNotice // 푸터

                    if (response.data.goodsIconBeans !== null) {
                        response.data.goodsIconBeans.filter(res => {
                            const value = {
                                iconName: res.iconName,
                                iconUri: res.iconUri,
                                iconPreview: ''
                            }

                            this.dataForm.goodsIconBeans.push(value)
                        })
                    }

                    this.dataForm.watermarkPic = response.data.watermarkPic === null || response.data.watermarkPic === '' ? imageBack : response.data.watermarkPic
                    this.dataForm.watermarkWord = response.data.watermarkWord === null || response.data.watermarkWord === '' ? imageBack : response.data.watermarkWord
                }
            })
        },
        setShowMapDialog() { // 지도다이얼로그 로출
            this.isShowMapDialog = true
        },
        setMapLocation(location) { // 위치 추가
            this.dataForm.gps = location
            this.isShowMapDialog = false
        },
        setPreviewSiteLogoImage() { // 쇼핑몰로고이미지 추가 클릭
            this.$refs.siteLogo.click()
        },
        setChangeSiteLogoImage(input) { // 쇼핑몰로고이미지 미리보기
            if (input.target.files && input.target.files[0]) {
                const files = input.target.files
                for (let i = 0; i < files.length; i++) {
                    if (files[i].type !== 'image/jpeg' && files[i].type !== 'image/png' && files[i].type !== 'image/gif') {
                        showToast(this, '只允许上传 JPEG, PNG, GIF等格式', 'warning')
                        return
                    }

                    if (files[i].size > 204800) {
                        showToast(this, '图片大小不能大于200KB', 'warning')
                        return
                    }

                    this.dataForm.siteLogo = URL.createObjectURL(files[0])
                    this.siteLogoFile = files[0]
                }
            }
        },
        setPreviewShopIconImage() { // 쇼핑몰로고이미지 추가 클릭
            this.$refs.shopIcon.click()
        },
        setChangeShopIconImage(input) { // 쇼핑몰로고이미지 미리보기
            if (input.target.files && input.target.files[0]) {
                const files = input.target.files
                for (let i = 0; i < files.length; i++) {
                    if (files[i].type !== 'image/jpeg' && files[i].type !== 'image/png' && files[i].type !== 'image/gif') {
                        showToast(this, '只允许上传 JPEG, PNG, GIF等格式', 'warning')
                        return
                    }

                    if (files[i].size > 204800) {
                        showToast(this, '图片大小不能大于200KB', 'warning')
                        return
                    }

                    this.dataForm.shopIcon = URL.createObjectURL(files[0])
                    this.shopIconFile = files[0]
                }
            }
        },
        setShowKeywordDialog() { // 추천검색어 추가 다이얼로그 로출
            this.isShowKeywordDialog = true
            this.keyword = ''
        },
        setAddKeyword() { // 추천검색어 추가
            if (this.keyword.trim() === '') {
                showToast(this, '请输入热搜标签', 'warning')
                return
            }

            if (this.dataForm.tempKeyword.search(this.keyword) !== -1) {
                showToast(this, '是已经存在的热搜标签', 'warning')
                return
            }

            this.dataForm.tempKeyword = this.dataForm.tempKeyword + ',' + this.keyword
            this.isShowKeywordDialog = false
        },
        setShowUnitDialog() {
            this.isShowUnitDialog = true
            this.dlgUnit = ''
        },
        setAddUnit() {
            if (this.dlgUnit.trim() === '') {
                showToast(this, '请输入计量单位', 'warning')
                return
            }

            let exist = false

            if (this.tempUnit.length !== 0) {
                this.tempUnit.filter(res => {
                    if (res === this.dlgUnit) {
                        exist = true
                    }
                })
            }

            if (exist) {
                showToast(this, '是已经存在的计量单位', 'warning')
                return
            }

            this.tempUnit.push(this.dlgUnit)
            this.isShowUnitDialog = false
        },
        getOwnerInfoData() { // 운영자위챗정보 얻기
            let temp = []
            this.listLoading = true
            const query = {
                userNick: this.searchWehchatName.trim(),
                phoneNum: this.searchWehchatPhone.trim(),
                role: '2',
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
                                checked: false,
                                userRole: res.userRole,
                                userNick: res.userNick,
                                userName: res.userName,
                                phoneNum: res.phoneNum,
                                userStatus: res.userStatus
                            }

                            // 사용자상태가 관리원인 경우에만
                            if (this.dataForm.serviceWechat.length !== 0) {
                                this.dataForm.serviceWechat.filter(value => {
                                    if (value.id === res.id) {
                                        val.checked = true
                                    }
                                })
                            }

                            temp.push(val)
                        })
                    }

                    this.listUserData = temp
                }

                this.listLoading = false
            })
        },
        renderTagHeader(h) { // 헤더에 체크박스 렌더링
            const that = this

            return h('label', [h('input', {
                domProps: {
                    type: 'checkbox',
                    checked: that.isTagChecked
                },
                on: {
                    change(event) {
                        const val = event.target.checked
                        that.isTagChecked = val

                        that.listUserData.filter(res => {
                            res.checked = val
                        })
                    }
                }
            }), ''])
        },
        setTableTagSelect() { // 테블 행 클릭
            this.isTagChecked = this.listUserData.every(item => item.checked)
        },
        setAddOwnerInfo() {
            let name = ''
            let isChecked = false
            this.dataForm.serviceWechat = []
            this.dataForm.tempWechatName = ''

            this.listUserData.filter(res => {
                if (res.checked) {
                    isChecked = true
                    let val = {
                        id: res.id,
                        name: res.userNick
                    }

                    this.dataForm.serviceWechat.push(val)
                    name += res.userNick + ','
                }
            })

            if (!isChecked) {
                showToast(this, '还未绑定，无法保存', 'warning')
                return
            }

            this.dataForm.tempWechatName = name.slice(0, name.length - 1)
            this.isShowWechatDialog = false
        },
        setSearchUserInfo() { // 운영자위챗정보 검색
            this.pageUser = 1
            this.getOwnerInfoData()
        },
        setShowWechatInfo() {
            this.isShowWechatDialog = true
            this.searchWehchatPhone = ''
            this.searchWehchatName = ''

            this.getOwnerInfoData()
        },
        setShowGoodsIconDialog() {
            this.isShowGoodsIconDialog = true
            this.dlgIconName = ''
            this.dlgIconUrl = imageBack
        },
        setChangeGoodsIcon(input) { // 쇼핑몰로고이미지 미리보기
            if (input.target.files && input.target.files[0]) {
                const files = input.target.files
                for (let i = 0; i < files.length; i++) {
                    if (files[i].type !== 'image/jpeg' && files[i].type !== 'image/png' && files[i].type !== 'image/gif') {
                        showToast(this, '只允许上传 JPEG, PNG, GIF等格式', 'warning')
                        return
                    }

                    if (files[i].size > 204800) {
                        showToast(this, '图片大小不能大于200KB', 'warning')
                        return
                    }

                    this.dlgIconUrl = URL.createObjectURL(files[0])
                    this.dlgIconFile = files[0]
                }
            }
        },
        setPreviewGoodsIcon() { // 쇼핑몰로고이미지 추가 클릭
            this.$refs.goodsIconFile.click()
        },
        setChangeGoodsImageIcon(input) { // 쇼핑몰로고이미지 미리보기
            if (input.target.files && input.target.files[0]) {
                const files = input.target.files
                for (let i = 0; i < files.length; i++) {
                    if (files[i].type !== 'image/jpeg' && files[i].type !== 'image/png' && files[i].type !== 'image/gif') {
                        showToast(this, '只允许上传 JPEG, PNG, GIF等格式', 'warning')
                        return
                    }

                    if (files[i].size > 204800) {
                        showToast(this, '图片大小不能大于200KB', 'warning')
                        return
                    }

                    this.dataForm.watermarkPic = URL.createObjectURL(files[0])
                    this.watermarkPicFile = files[0]
                }
            }
        },
        setPreviewGoodsImageIcon() { // 쇼핑몰로고이미지 추가 클릭
            this.$refs.watermarkPicFile.click()
        },
        setChangeGoodsWordImage(input) { // 쇼핑몰로고이미지 미리보기
            if (input.target.files && input.target.files[0]) {
                const files = input.target.files
                for (let i = 0; i < files.length; i++) {
                    if (files[i].type !== 'image/jpeg' && files[i].type !== 'image/png' && files[i].type !== 'image/gif') {
                        showToast(this, '只允许上传 JPEG, PNG, GIF等格式', 'warning')
                        return
                    }

                    if (files[i].size > 204800) {
                        showToast(this, '图片大小不能大于200KB', 'warning')
                        return
                    }

                    this.dataForm.watermarkWord = URL.createObjectURL(files[0])
                    this.watermarkWordFile = files[0]
                }
            }
        },
        setPreviewGoodsWordImage() { // 쇼핑몰로고이미지 추가 클릭
            this.$refs.watermarkWordFile.click()
        },
        async setAddGoodsIconInfo() {
            if (this.dlgIconName === '') {
                this.$refs.dlgIconName.focus()
                showToast(this, '请输入商品招牌名称', 'warning')
                return
            }

            if (this.dlgIconUrl.includes('data:image/png;base64')) {
                showToast(this, '请添加商品招牌图片', 'warning')
                return
            }

            const isSuccess = await this.openMessageBox()

            if (!isSuccess) {
                return
            }

            let iconUrl = ''

            if (this.dlgIconFile !== undefined) {
                let data = new FormData()
                data.append('file', this.dlgIconFile)

                const url = await this.setUploadGoodsIcon(this.dlgIconName, data)

                if (url.code === 0) {
                    iconUrl = url.data.uri
                }
            }

            if (iconUrl.search('jpeg') === -1 && iconUrl.search('jpg') === -1 && iconUrl.search('png') === -1 && iconUrl.search('gif') === -1) {
                return
            }

            const query = {
                iconName: this.dlgIconName,
                iconUri: iconUrl,
                iconPreview: this.dlgIconUrl
            }

            this.dataForm.goodsIconBeans.push(query)
            this.dataForm.iconName = this.dlgIconName
            this.dataForm.iconUrl = this.dlgIconUrl
            this.isShowGoodsIconDialog = false
        },
        setChangeGoodsIconData(element) {
            this.dataForm.goodsIconBeans.filter(res => {
                if (element === res.iconName) {
                    this.dataForm.iconUrl = res.iconPreview === '' ? res.iconUri : res.iconPreview
                }
            })
        },
        setCancelDialog() { // 다이얼로그 닫기
            this.isShowKeywordDialog = false
            this.isShowUnitDialog = false
            this.isShowWechatDialog = false
            this.isShowGoodsIconDialog = false
        },
        async setUpdate() {
            if (this.dataForm.siteName.trim() === '') {
                this.$refs.siteName.focus()
                showToast(this, '请输入商城名称', 'warning')
                return
            }

            if (this.dataForm.siteLogo.includes('data:image/png;base64')) {
                showToast(this, '请添加商城LOGO图片', 'warning')
                return
            }

            if (this.dataForm.shopIcon.includes('data:image/png;base64')) {
                showToast(this, '请添加商户标签图片', 'warning')
                return
            }

            if (this.dataForm.tempPhone.trim() === '') {
                this.$refs.tempPhone.focus()
                showToast(this, '请输入客服电话号', 'warning')
                return
            }

            if (this.dataForm.tempWechatName.trim() === '') {
                this.$refs.tempWechatName.focus()
                showToast(this, '请输入微信号', 'warning')
                return
            }

            if (this.dataForm.orderSmsStatus) {
                if (this.dataForm.orderSmsMsg.trim() === '') {
                    this.$refs.tempSmsMsg.focus()
                    showToast(this, '请输入短信通知', 'warning')
                    return
                }
            }

            if (this.dataForm.tempMail.trim() === '') {
                this.$refs.tempMail.focus()
                showToast(this, '请输入邮箱', 'warning')
                return
            } else {
                this.dataForm.tempMail.split(',').filter(res => {
                    if (!validateEmail(res)) {
                        this.$refs.tempMail.focus()
                        showToast(this, '请以邮箱形式输入', 'warning')
                        return
                    }
                })
            }

            if (this.dataForm.gps.trim() === '') {
                this.$refs.gps.focus()
                showToast(this, '请输入商城位置', 'warning')
                return
            }

            if (this.dataForm.icp.trim() === '') {
                this.$refs.icp.focus()
                showToast(this, '请输入ICP证书号', 'warning')
                return
            }

            if (this.dataForm.tempStartWorking.trim() === '') {
                this.$refs.tempStartWorking.focus()
                showToast(this, '请输入工作时间', 'warning')
                return
            }

            if (this.dataForm.tempEndWorking.trim() === '') {
                this.$refs.tempEndWorking.focus()
                showToast(this, '请输入工作时间', 'warning')
                return
            }

            if (this.dataForm.orderLimit === 0) {
                this.$refs.orderLimit.focus()
                showToast(this, '请输入营业结束前限制时间', 'warning')
                return
            }

            if (this.dataForm.orderLimitNum === 0) {
                this.$refs.orderLimitNum.focus()
                showToast(this, '请输入日最多可接受订单数（要大于或等于1）！', 'warning')
                return
            }

            if (this.dataForm.orderLimitMsg.trim() === '') {
                this.$refs.orderLimitMsg.focus()
                showToast(this, '请输入每天订单上限数量的提示语', 'warning')
                return
            }

            if (this.dataForm.domain.trim() === '') {
                this.$refs.domain.focus()
                showToast(this, '请输入网站域名', 'warning')
                return
            }

            if (this.dataForm.orderInvalidDuration.trim() === '') {
                this.$refs.orderInvalidDuration.focus()
                showToast(this, '请输入下单付款失效', 'warning')
                return
            }

            if (this.dataForm.orderDeliveryDuration?.trim() === '') {
                this.$refs.orderDeliveryDuration.focus()
                showToast(this, '请输入超时快递设置', 'warning')
                return
            }

            if (this.dataForm.tempKeyword.trim() === '') {
                this.$refs.tempKeyword.focus()
                showToast(this, '请输入热搜标签', 'warning')
                return
            }

            if (this.dataForm.siteStatus === '0' && this.dataForm.closedNotice.trim() === '') {
                this.$refs.closedNotice.focus()
                showToast(this, '请输入理由', 'warning')
                return
            }

            if (this.dataForm.shopLevel_min_1 === undefined || this.dataForm.shopLevel_min_2 === undefined || this.dataForm.shopLevel_min_3 === undefined || this.dataForm.shopLevel_min_4 === undefined ||
                this.dataForm.shopLevel_min_5 === undefined || this.dataForm.shopLevel_max_1 === undefined || this.dataForm.shopLevel_max_2 === undefined || this.dataForm.shopLevel_max_3 === undefined ||
                this.dataForm.shopLevel_max_4 === undefined || this.dataForm.shopLevel_max_5 === undefined) {
                showToast(this, '请输入商户销量等级算法', 'warning')
                return
            }

            if (this.tempUnit.length === 0) {
                showToast(this, '请输入计量单位', 'warning')
                return
            }

            const isSuccess = await this.openMessageBox()

            if (!isSuccess) {
                return
            }

            let logoSiteUrl = ''
            let shopIconUrl = ''
            let goodsImageUrl = ''
            let goodsWordImageUrl = ''

            if (this.siteLogoFile !== undefined) {
                let dataSite = new FormData()
                dataSite.append('file', this.siteLogoFile)
                const urlSite = await this.setUploadSiteLogo(dataSite)

                if (urlSite.code === 0) {
                    logoSiteUrl = urlSite.data.uri
                }
            } else {
                logoSiteUrl = this.dataForm.siteLogo.split('/')[4]
            }

            if (this.shopIconFile !== undefined) {
                let dataShop = new FormData()
                dataShop.append('file', this.shopIconFile)
                const urlShop = await this.setUploadShopIcon(dataShop)

                if (urlShop.code === 0) {
                    shopIconUrl = urlShop.data.uri
                }
            } else {
                shopIconUrl = this.dataForm.shopIcon.split('/')[4]
            }

            if (this.watermarkPicFile !== undefined) {
                let dataPick = new FormData()
                dataPick.append('file', this.watermarkPicFile)
                const urlPick = await this.setUploadShopIcon(dataPick)

                if (urlPick.code === 0) {
                    goodsImageUrl = urlPick.data.uri
                }
            } else {
                goodsImageUrl = this.dataForm.watermarkPic.split('/')[4]
            }

            if (this.watermarkWordFile !== undefined) {
                let dataWord = new FormData()
                dataWord.append('file', this.watermarkWordFile)
                const urlWord = await this.setUploadShopIcon(dataWord)

                if (urlWord.code === 0) {
                    goodsWordImageUrl = urlWord.data.uri
                }
            } else {
                goodsWordImageUrl = this.dataForm.watermarkWord.split('/')[4]
            }

            if (logoSiteUrl.search('jpeg') === -1 && logoSiteUrl.search('jpg') === -1 && logoSiteUrl.search('png') === -1 && logoSiteUrl.search('gif') === -1) {
                return
            }

            if (shopIconUrl.search('jpeg') === -1 && shopIconUrl.search('jpg') === -1 && shopIconUrl.search('png') === -1 && shopIconUrl.search('gif') === -1) {
                return
            }

            let shopLevels = []
            const level_1 = {
                min: parseInt(this.dataForm.shopLevel_min_1),
                max: parseInt(this.dataForm.shopLevel_max_1)
            }
            const level_2 = {
                min: parseInt(this.dataForm.shopLevel_min_2),
                max: parseInt(this.dataForm.shopLevel_max_2)
            }
            const level_3 = {
                min: parseInt(this.dataForm.shopLevel_min_3),
                max: parseInt(this.dataForm.shopLevel_max_3)
            }
            const level_4 = {
                min: parseInt(this.dataForm.shopLevel_min_4),
                max: parseInt(this.dataForm.shopLevel_max_4)
            }
            const level_5 = {
                min: parseInt(this.dataForm.shopLevel_min_5),
                max: parseInt(this.dataForm.shopLevel_max_5)
            }

            shopLevels.push(level_1)
            shopLevels.push(level_2)
            shopLevels.push(level_3)
            shopLevels.push(level_4)
            shopLevels.push(level_5)

            const startTimeHour = this.dataForm.tempStartWorking.split(':')[0]
            const startTimeMinute = this.dataForm.tempStartWorking.split(':')[1]
            const endTimeHour = this.dataForm.tempEndWorking.split(':')[0]
            const endTimeMinute = this.dataForm.tempEndWorking.split(':')[1]

            let goodsIcons = []

            this.dataForm.goodsIconBeans.filter(res => {
                let tmp

                if (res.iconUri.search('http') !== -1) {
                    tmp = res.iconUri.split('/')[4]
                } else {
                    tmp = res.iconUri
                }

                const value = {
                    iconName: res.iconName,
                    iconUri: tmp
                }

                goodsIcons.push(value)
            })

            const query = {
                siteName: this.dataForm.siteName,
                siteLogo: logoSiteUrl,
                shopIcon: shopIconUrl,
                servicePhone: this.dataForm.tempPhone.split(','),
                serviceWechat: this.dataForm.serviceWechat,
                orderSmsStatus: this.dataForm.orderSmsStatus === true ? '1' : '0',
                orderSmsMsg: this.dataForm.orderSmsMsg,
                serviceMail: this.dataForm.tempMail.split(','),
                gps: this.dataForm.gps,
                icp: this.dataForm.icp,
                domain: this.dataForm.domain,
                workingTime: {
                    beginTime: startTimeHour + ':' + startTimeMinute + ':' + '00',
                    endTime: endTimeHour + ':' + endTimeMinute + ':' + '00',
                    timeLimit: this.dataForm.orderLimit
                },
                salesStatus: this.dataForm.salesStatus,
                orderInvalidDuration: this.dataForm.orderInvalidDuration,
                orderDeliveryDuration: this.dataForm.orderDeliveryDuration,
                readme: this.dataForm.readme,
                tags: this.dataForm.tempKeyword,
                siteStatus: this.dataForm.siteStatus,
                closedNotice: this.dataForm.closedNotice,
                salesNotice: this.dataForm.salesNotice,
                shopLevels: shopLevels,
                units: this.tempUnit,
                watermarkPic: goodsImageUrl,
                watermarkWord: goodsWordImageUrl,
                goodsIconBeans: goodsIcons,
                orderLimitNum: this.dataForm.orderLimitNum,
                orderLimitMsg: this.dataForm.orderLimitMsg
            }

            setUpdateData(query).then(response => {
                if (response === '') {
                    showToast(this, '操作成功', 'success')
                }
            })
        }
    }
}