import Tinymce from '@/components/Tinymce' // 편집기 컴포넨트 추가
import Pagination from '@/components/Pagination' // 페이징 콘퍼넨트 추가
import elDragDialog from '@/directive/el-drag-dialog'
import Thumbnail from '@/components/ImageItem/single_image' // 상품썸네일용 컴포넨트 추가
import imageBack from '@/assets/images/review_image_back.png' // 썸네일 백그라운드 이미지 추가
import settings from '@/settings'

import {
    MessageBox
} from 'element-ui' // 메세지다이얼로그 추가

import {
    setClearGoodsSearchField,
    setClearGoodsBatchSearchField,
    setClearShopSearchField,
    setClearShopBatchField,
    setClearOrderSearchField
} from '@/utils/auth' // 쿠키설정

import {
    showToast,
    setAddCommaTwo,
    setAddComma
} from '@/utils/' // 토스트 설정

import {
    getFloor,
    setAddFloors,
    setUploadLicense,
    setUploadAvatar,
    setUploadBanner,
    setUploadShopBackground,
    setRegisterShop,
    existShop,
    existOwner,
    setUploadPayCode
} from '@/api/shop' // 점포 데이터 API 추가

import {
    getTagData,
    setRegisterTag
} from '@/api/tag' // 키워드 API 추가

import {
    getCategories
} from '@/api/category' // 상품카테고리 API 추가

import {
    getWechatInfo
} from '@/api/member' // 위챗에 바운딩된 사용자정보 API

export default {
    name: 'Product_register',
    components: {
        Tinymce,
        Pagination,
        Thumbnail
    },
    created() {
        setClearGoodsSearchField()
        setClearGoodsBatchSearchField()
        setClearShopSearchField()
        setClearShopBatchField()
        setClearOrderSearchField()

        // 점포위치정보 얻기
        this.getFloorData()
    },
    mounted() {
        window.addEventListener('keyup', this.setFilterValue)
    },
    directives: {
        elDragDialog
    },
    data() {
        return {
            baseURL: settings.BASE_API_URL, // 편집기에서 이미지업로드용 API BASE URL
            isClicked: false,
            listLoading: false,
            imageBack: imageBack,
            listFloor: [], // 점포층배렬
            listZone: [], // 점포구역배렬
            listPosition: [], // 점포위치배렬
            listPositionData: [], // 점포위치정보배렬
            isShowPositionDialog: false, // 점포위치추가다이얼로그 로출상태
            dlgFloorNum: '', // 점포추가다이얼로그에서의 점포 층
            dlgZoneNum: '', // 점포추가다이얼로그에서의 점포 구역
            dlgPositionNum: '', // 점포추가다이얼로그에서의 점포 위치
            isShowTagDialog: false, // 키워드추가다이얼로그 로출상태
            isShowTypeDialog: false, // 분류추가다이얼로그 로출상태
            isShowUserDialog: false, // 운영자위챗정보다이얼로그 로출상태
            searchTagName: '', // 검색용키워드명
            searchWehchatName: '', // 운영자위챗명
            searchWehchatPhone: '', // 운영자위챗폰번호
            tempWechatName: '', // 템프위챗명
            listUserData: [], // 위챗사용자정보 배렬
            pageUser: 1,
            totalUserNum: 0,
            sizeUser: 10,
            isTagChecked: false,
            dataTag: [], // 키워드 배렬
            listType: [], // 대분류 배렬
            listSubType: [], // 소분류 배렬
            tempTypeId: undefined,
            tempSubTypeId: undefined,
            busnessStyle: {
                width: '100%',
                height: '100%'
            },
            isShowBannerImg: false,
            isShowShopBackgroundImg: false,
            isShowOwnerImg: false,
            isShowLicenseImg: false,
            isShowPayCodeImg: false,
            dataForm: {
                shopName: '', // 점포명
                shopOwner: '', // 점포운영자명
                phoneNum: '', // 점포운영자폰번호
                idCard: '', // 점포운영자카드번호
                rankingNum: undefined, // 점포랭킹번호
                shopWechatId: 0, // 점포운영자위챗아이디
                shopWechatName: '', // 점포운영자위챗명
                typeName: '', // 분류명
                typeId: undefined, // 대분류아이디
                subTypeId: undefined, // 소분류아이디
                isSelf: false, // 점포운영가능여부
                isRecommend: false, // 점포추천여부
                shopStatus: '', // 점포상태(올림/내림)
                tags: [], // 점포키워드배렬
                tagName: '', // 키워드명
                floorNum: '', // 점포 층
                zoneNum: '', // 점포구역
                positionNum: '', // 점포위치
                locationRemark: '', // 점포위치주석
                shopBanner: imageBack, // 점포배너URL
                shopBannerFile: undefined, // 점포배너파일
                shopBackround: imageBack, // 점포백그라운드이미지
                shopBackroundFile: undefined, // 점포백그라운드이미지파일
                openDt: '', // 점포오픈날자
                shopLicense: imageBack, // 점포등록증이미지URL
                shopLicenseFile: undefined, // 점포등록증이미지파일
                ownerAvatar: imageBack, // 점포운영자프로필이미지URL
                ownerAvatarFile: undefined, // 점포운영자프로필이미지파일
                payCode: imageBack, // 결제수금번호이미지URL
                payCodeFile: undefined, // 결제수금번호이미지파일
                bankCard: '', // 은행카드
                shopIntro: '' // 점포소개
            },
            rules: {
                shopName: [{
                    required: true,
                    message: '商户名称是必填项',
                    trigger: 'blur'
                }],
                shopOwner: [{
                    required: true,
                    message: '运营者姓名是必填项',
                    trigger: 'blur'
                }],
                phoneNum: [{
                    required: true,
                    message: '电话号是必填项',
                    trigger: 'blur'
                }],
                idCard: [{
                    required: true,
                    message: '身份证号是必填项',
                    trigger: 'blur'
                }],
                rankingNum: [{
                    required: true,
                    message: '序号是必填项',
                    trigger: 'blur'
                }],
                shopWechatName: [{
                    required: true,
                    message: '商户微信证号是必填项',
                    trigger: 'blur'
                }],
                typeName: [{
                    required: true,
                    message: '所属分类是必填项',
                    trigger: 'blur'
                }]
            }
        }
    },
    methods: {
        setFilterValue(element) {
            // 점포명
            if (element.target.id === 'shopName') {
                element.target.value = element.target.value.trim().substr(0, 20)
                this.dataForm.shopName = element.target.value
            }

            // 점포위치주석
            if (element.target.id === 'locationRemark') {
                element.target.value = element.target.value.trim().substr(0, 20)
                this.dataForm.locationRemark = element.target.value
            }

            // 키워드 길이 20자로 제한
            if (element.target.id === 'searchTagName') {
                element.target.value = element.target.value.trim().substr(0, 20)
                this.searchTagName = element.target.value
            }

            // 점포 층
            if (element.target.id === 'dlgFloorNum') {
                element.target.value = element.target.value.trim().substr(0, 10)
                this.dlgFloorNum = element.target.value
            }

            // 점포구역
            if (element.target.id === 'dlgZoneNum') {
                element.target.value = element.target.value.trim().substr(0, 10)
                this.dlgZoneNum = element.target.value
            }

            // 점포위치
            if (element.target.id === 'dlgPositionNum') {
                element.target.value = element.target.value.trim().substr(0, 10)
                this.dlgPositionNum = element.target.value
            }

            // 점포운영자명
            if (element.target.id === 'shopOwner') {
                element.target.value = element.target.value.trim().substr(0, 20)
                this.dataForm.shopOwner = element.target.value
            }

            // 운영자주민등록번호
            if (element.target.id === 'idCard') {
                element.target.value = element.target.value.trim().substr(0, 18)
                this.dataForm.idCard = element.target.value
            }

            // 점포운영자은행정보
            if (element.target.id === 'bankCard') {
                element.target.value = element.target.value.trim().substr(0, 30)
                this.dataForm.bankCard = element.target.value
            }

            // 점포랭킹번호
            if (element.target.id === 'rankingNum') { // 랭킹번호 수자만 허용
                element.target.value = element.target.value.replace(/[^0-9]/g, '')
                this.dataForm.rankingNum = element.target.value
            }

            // 폰번호 수자만 허용, 11자리로 제한
            if (element.target.id === 'phoneNum') {
                element.target.value = element.target.value.replace(/[^0-9]/g, '').substr(0, 11)
                this.dataForm.phoneNum = element.target.value
            }

            // 폰번호 수자만 허용, 11자리로 제한
            if (element.target.id === 'searchWehchatPhone') {
                element.target.value = element.target.value.replace(/[^0-9]/g, '').substr(0, 11)
                this.searchWehchatPhone = element.target.value
            }
        },
        setUploadBannerImageData(data) { // 점포배너이미지 업로드 API 호출
            return new Promise((resolve, reject) => {
                setUploadBanner(data).then(response => {
                    resolve(response)
                }).catch(error => {
                    reject(error)
                })
            })
        },
        setUploadShopBackgroundImageData(data) { // 점포백그라운드이미지 업로드 API 호출
            return new Promise((resolve, reject) => {
                setUploadShopBackground(data).then(response => {
                    resolve(response)
                }).catch(error => {
                    reject(error)
                })
            })
        },
        setUploadLicenseImageData(data) { // 점포등로증이미지 업로드 API 호출
            return new Promise((resolve, reject) => {
                setUploadLicense(data).then(response => {
                    resolve(response)
                }).catch(error => {
                    reject(error)
                })
            })
        },
        setUploadPayCodeImageData(data) { // 결제수금번호이미지 업로드 API 호출
            return new Promise((resolve, reject) => {
                setUploadPayCode(data).then(response => {
                    resolve(response)
                }).catch(error => {
                    reject(error)
                })
            })
        },
        setUploadOwnerImageData(data) { // 점포운영자이미지 업로드 API 호출
            return new Promise((resolve, reject) => {
                setUploadAvatar(data).then(response => {
                    resolve(response)
                }).catch(error => {
                    reject(error)
                })
            })
        },
        setExistShop(query) { // 점포명 중복 체크 API 호출
            return new Promise((resolve, reject) => {
                existShop(query).then(response => {
                    resolve(response)
                }).catch(error => {
                    reject(error)
                })
            })
        },
        setExistOwner(shopName, phoneNum, shopid) { // 점포운영자명 중복 체크 API 호출
            return new Promise((resolve, reject) => {
                existOwner(shopName, phoneNum, shopid).then(response => {
                    resolve(response)
                }).catch(error => {
                    reject(error)
                })
            })
        },
        async openMessageBox() { // 메시지다이얼로그 async/await 처리
            try {
                await MessageBox.confirm('确认要保存吗？', '信息', {
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    type: 'warning'
                })

                return true
            } catch (e) {
                return false
            }
        },
        getFloorData() { // 점포위치정보 API 호출
            getFloor().then(response => {
                if (response.code === 0) {
                    this.listPositionData = response.data

                    if (response.data !== null) {
                        response.data.filter(res => {
                            this.listFloor.push(res.name)
                        })
                    }
                }
            })
        },
        setChangeFloor() { // 점포층에 따르는 점포구역 얻기
            this.listZone = []
            this.listPosition = []
            this.dataForm.zoneNum = ''
            this.dataForm.positionNum = ''
            this.dlgFloorNum = this.dataForm.floorNum

            this.listPositionData.filter(res => {
                if (res.name === this.dataForm.floorNum) {
                    res.subs.filter(val => {
                        this.listZone.push(val.name)
                    })
                }
            })
        },
        setChangeZone() { // 점포구역에 따르는 점포위치 얻기
            this.listPosition = []
            this.dataForm.positionNum = ''
            this.dlgZoneNum = this.dataForm.zoneNum

            this.listPositionData.filter(res => {
                if (res.name === this.dataForm.floorNum) {
                    res.subs.filter(val => {
                        if (val.name === this.dataForm.zoneNum) {
                            val.subs.filter(vvv => {
                                this.listPosition.push(vvv.name)
                            })
                        }
                    })
                }
            })
        },
        setShowPositionDialog() {
            this.isShowPositionDialog = true
        },
        setCancelDialog() {
            this.isShowPositionDialog = false
            this.isShowTagDialog = false
            this.isShowUserDialog = false
        },
        setAddPosition() {
            if (this.isClicked) {
                return
            }

            if (this.$refs.dlgFloorNum.value === '') {
                this.$refs.dlgFloorNum.focus()
                showToast(this, '请输入楼层', 'warning')
                return
            }

            if (this.$refs.dlgZoneNum.value === '') {
                this.$refs.dlgZoneNum.focus()
                showToast(this, '请输入区', 'warning')
                return
            }

            if (this.$refs.dlgPositionNum.value === '') {
                this.$refs.dlgPositionNum.focus()
                showToast(this, '请输入位号', 'warning')
                return
            }

            this.isClicked = true

            const query = {
                floorNum: this.dlgFloorNum,
                zoneNum: this.dlgZoneNum,
                positionNum: this.dlgPositionNum
            }

            setAddFloors(query).then(response => {
                if (response.code === 0) {
                    if (this.dataForm.floorNum === '' && this.dataForm.zoneNum === '' && this.dataForm.positionNum === '') {
                        this.listFloor = []
                        this.listZone = []
                        this.listPosition = []

                        getFloor().then(resp => {
                            if (resp.code === 0) {
                                this.listPositionData = resp.data

                                this.listPositionData.filter(res => {
                                    this.listFloor.push(res.name)
                                })

                                this.listPositionData.filter(res => {
                                    if (res.name === this.dlgFloorNum) {
                                        res.subs.filter(val => {
                                            this.listZone.push(val.name)
                                        })
                                    }
                                })

                                this.listPositionData.filter(res => {
                                    if (res.name === this.dlgFloorNum) {
                                        res.subs.filter(val => {
                                            if (val.name === this.dlgZoneNum) {
                                                val.subs.filter(vvv => {
                                                    this.listPosition.push(vvv.name)
                                                })
                                            }
                                        })
                                    }
                                })

                                this.dataForm.floorNum = this.dlgFloorNum
                                this.dataForm.zoneNum = this.dlgZoneNum
                                this.dataForm.positionNum = this.dlgPositionNum
                            }
                        })
                    }

                    if (this.dataForm.floorNum !== '' && this.dataForm.zoneNum === '' && this.dataForm.positionNum === '') {
                        this.listZone = []
                        this.listPosition = []

                        getFloor().then(resp => {
                            if (resp.code === 0) {
                                this.listPositionData = resp.data

                                this.listPositionData.filter(res => {
                                    if (res.name === this.dlgFloorNum) {
                                        res.subs.filter(val => {
                                            this.listZone.push(val.name)
                                        })
                                    }
                                })

                                this.listPositionData.filter(res => {
                                    if (res.name === this.dlgFloorNum) {
                                        res.subs.filter(val => {
                                            if (val.name === this.dlgZoneNum) {
                                                val.subs.filter(vvv => {
                                                    this.listPosition.push(vvv.name)
                                                })
                                            }
                                        })
                                    }
                                })

                                this.dataForm.zoneNum = this.dlgZoneNum
                                this.dataForm.positionNum = this.dlgPositionNum
                            }
                        })
                    }

                    if (this.dataForm.floorNum !== '' && this.dataForm.zoneNum !== '' && this.dataForm.positionNum === '') {
                        this.listPosition = []

                        getFloor().then(resp => {
                            if (resp.code === 0) {
                                this.listPositionData = resp.data

                                this.listPositionData.filter(res => {
                                    if (res.name === this.dlgFloorNum) {
                                        res.subs.filter(val => {
                                            if (val.name === this.dlgZoneNum) {
                                                val.subs.filter(vvv => {
                                                    this.listPosition.push(vvv.name)
                                                })
                                            }
                                        })
                                    }
                                })

                                this.dataForm.positionNum = this.dlgPositionNum
                            }
                        })
                    }
                }

                this.isClicked = false
            })

            this.isShowPositionDialog = false
        },
        setShowTagDialog() { // 키워드다이얼로그 로출
            this.isTagChecked = false
            this.isShowTagDialog = true
            this.searchTagName = ''
            this.dataTag = []

            this.getTag()
        },
        getTag() { // 키워드 얻기
            this.listLoading = true

            getTagData().then(response => {
                if (response.code === 0) {
                    if (response.data.length !== 0) {
                        response.data.filter(res => {
                            let val = {
                                checked: false,
                                id: res.id,
                                tagInfo: res.tagInfo
                            }

                            if (this.searchTagName.trim() !== '') {
                                if (res.tagInfo.search(this.searchTagName.trim()) !== -1) {
                                    this.dataTag.push(val)
                                }
                            } else {
                                this.dataForm.tags.filter(value => {
                                    if (value === res.id) {
                                        val.checked = true
                                    }
                                })
                                this.dataTag.push(val)
                            }
                        })
                    }
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

                        that.dataTag.filter(res => {
                            res.checked = val
                        })
                    }
                }
            }), ''])
        },
        setTableTagSelect() { // 테블 행 클릭
            this.isTagChecked = this.dataTag.every(item => item.checked)
        },
        setSearchTag() { // 키워드 검색
            this.dataTag = []
            this.getTag()
        },
        async setRegisterTag() { // 키워드 등록
            if (this.isClicked) {
                return
            }

            if (this.searchTagName.trim() === '') {
                this.$refs.searchTagName.focus()
                showToast(this, '请输入标签名称', 'warning')
                return
            }

            const isSuccess = await this.openMessageBox()

            if (!isSuccess) {
                return
            }

            this.isClicked = true

            const query = {
                name: this.searchTagName.trim()
            }

            setRegisterTag(query).then(response => {
                if (response.code === 0) {
                    const res = {
                        checked: false,
                        id: response.data.id,
                        tagInfo: response.data.name
                    }

                    this.dataTag.push(res)
                    this.searchTagName = ''
                }

                this.isClicked = false
            })
        },
        setAddTag() { // 키워드 추가
            let name = ''
            let isChecked = false
            this.dataForm.tags = []

            this.dataTag.filter(res => {
                if (res.checked) {
                    isChecked = true
                    this.dataForm.tags.push(res.id)
                    name += res.tagInfo + ','
                }
            })

            if (!isChecked) {
                showToast(this, '请选择新增标签', 'warning')
                return
            }

            this.dataForm.tagName = name.slice(0, name.length - 1)
            this.isShowTagDialog = false
        },
        setCanceTypeDialog() { // 분류추가다이얼로그 닫기
            this.isShowTypeDialog = false

            this.dataForm.typeId = this.tempTypeId
            this.dataForm.subTypeId = this.tempSubTypeId
        },
        getCategoryData() {
            getCategories().then(response => {
                if (response.code === 0) {
                    this.listType = response.data.list
                }
            })
        },
        setChangeCategory() { // 대카테고리에 따르는 소카테고리 얻기
            this.listSubType = []
            this.dataForm.subTypeId = undefined

            this.listType.filter(res => {
                if (res.id === this.dataForm.typeId) {
                    this.listSubType = res.subs
                }

                if (this.dataForm.typeId === '') {
                    this.listSubType = []
                }
            })
        },
        setShowTypeDialog() {
            this.isShowTypeDialog = true

            this.getCategoryData()
        },
        setAddType() { // 분류추가
            if (this.dataForm.typeId === undefined || this.dataForm.typeId === '') {
                showToast(this, '请选择商品大类别', 'warning')
                return
            }

            if (this.dataForm.subTypeId === undefined || this.dataForm.subTypeId === '') {
                showToast(this, '请选择商品小类别', 'warning')
                return
            }

            this.listSubType.filter(res => {
                if (this.dataForm.subTypeId === res.id) {
                    this.dataForm.typeName = res.typeName
                }
            })

            this.tempTypeId = this.dataForm.typeId
            this.tempSubTypeId = this.dataForm.subTypeId

            this.isShowTypeDialog = false
        },
        setOpenBannerBrowser() { // 점포배너이미지파일브라우저 열기
            this.$refs.shopBanner.click()
        },
        setOpenShopBackroundBrowser() {
            this.$refs.shopBackround.click()
        },
        setChangeBannerImage(input) { // 점포배너이미지 미리보기
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

                    this.dataForm.shopBanner = URL.createObjectURL(files[0])
                    this.dataForm.shopBannerFile = files[0]
                    this.isShowBannerImg = true
                }
            }
        },
        setChangeShopBackroundImage(input) {
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

                    this.dataForm.shopBackround = URL.createObjectURL(files[0])
                    this.dataForm.shopBackroundFile = files[0]
                    this.isShowShopBackgroundImg = true
                }
            }
        },
        setCancelBannerImage() { // 점포배너이미지 닫기
            this.isShowBannerImg = false
            this.dataForm.shopBanner = imageBack
            this.dataForm.shopBannerFile = undefined
        },
        setCancelShopBackroundImage() { // 점포백그라운드이미지 닫기
            this.isShowShopBackgroundImg = false
            this.dataForm.shopBackround = imageBack
            this.dataForm.shopBackroundFile = undefined
        },
        setOpenOwnerBrowser() { // 점포운영자이미지파일브라우저 열기
            this.$refs.ownerAvatar.click()
        },
        setChangeOwnerImage(input) { // 점포운영자이미지 미리보기
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

                    this.dataForm.ownerAvatar = URL.createObjectURL(files[0])
                    this.dataForm.ownerAvatarFile = files[0]
                    this.isShowOwnerImg = true
                }
            }
        },
        setCancelOwnerImage() { // 점포운영자이미지 닫기
            this.isShowOwnerImg = false
            this.dataForm.ownerAvatar = imageBack
            this.dataForm.ownerAvatarFile = undefined
        },
        setOpenLicenseBrowser() { // 점포운영자이미지파일브라우저 열기
            this.$refs.shopLicense.click()
        },
        setChangeLicenseImage(input) { // 점포운영자이미지 미리보기
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

                    this.dataForm.shopLicense = URL.createObjectURL(files[0])
                    this.dataForm.shopLicenseFile = files[0]
                    this.isShowLicenseImg = true
                }
            }
        },
        setCancelLicenseImage() { // 점포운영자이미지 닫기
            this.isShowLicenseImg = false
            this.dataForm.shopLicense = imageBack
            this.dataForm.shopLicenseFile = undefined
        },
        setOpenPayCodeBrowser() { // 점포운영자이미지파일브라우저 열기
            this.$refs.payCode.click()
        },
        setChangePayCodeImage(input) { // 점포운영자이미지 미리보기
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

                    this.dataForm.payCode = URL.createObjectURL(files[0])
                    this.dataForm.payCodeFile = files[0]
                    this.isShowPayCodeImg = true
                }
            }
        },
        setCancelPayCodeImage() { // 점포운영자이미지 닫기
            this.isShowPayCodeImg = false
            this.dataForm.payCode = imageBack
            this.dataForm.payCodeFile = undefined
        },
        getOwnerInfoData() { // 운영자위챗정보 얻기
            let temp = []
            this.listLoading = true
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
                                checked: this.dataForm.shopWechatId === res.id ? this.dataForm.shopWechatId : 0,
                                userRole: res.userRole,
                                userNick: res.userNick,
                                userName: res.userName,
                                phoneNum: res.phoneNum,
                                userStatus: res.userStatus
                            }

                            if (res.userStatus === '1') {
                                temp.push(val)
                                this.listUserData = temp
                            }
                        })
                    }
                }

                this.listLoading = false
            })
        },
        setSearchUserInfo() { // 운영자위챗정보 검색
            this.pageUser = 1
            this.getOwnerInfoData()
        },
        setOwnerInfo(row) {
            this.tempWechatName = row.userNick
            this.dataForm.shopWechatId = row.id

            this.listUserData.filter(res => {
                res.checked = res.id === row.id ? 1 : 0
            })
        },
        setAddOwnerInfo() { // 운영자위챗정보 추가
            this.dataForm.shopWechatName = this.tempWechatName
            this.tempWechatName = ''
            this.isShowUserDialog = false
        },
        setShowUserDialog() { // 운영자위챗정보 다이얼로그 로출
            this.isShowUserDialog = true
            this.searchWehchatPhone = ''
            this.searchWehchatName = ''

            this.getOwnerInfoData()
        },
        async setRegister() { // 점포등록
            if (this.Clicked) {
                return
            }

            // 점포명이 없으면
            if (this.dataForm.shopName.trim() === '') {
                this.$refs.shopName.focus()
                showToast(this, '请输入商户名称', 'warning')
                return
            }

            // 랭킹번호가 없으면
            if (this.dataForm.rankingNum === '') {
                this.$refs.rankingNum.focus()
                showToast(this, '请输入序号', 'warning')
                return
            }

            // 카테고리를 추가하지 않았다면
            if (this.dataForm.typeName === '') {
                this.$refs.typeName.focus()
                showToast(this, '请选择分类', 'warning')
                return
            }

            // 운영자명을 입력하지 않았다면
            if (this.dataForm.shopOwner.trim() === '') {
                this.$refs.shopOwner.focus()
                showToast(this, '请输入运营者姓名', 'warning')
                return
            }

            // 운영자신분증번호를 입력하지 않았다면
            if (this.dataForm.idCard.trim() === '') {
                this.$refs.idCard.focus()
                showToast(this, '请输入身份证号', 'warning')
                return
            }

            // 운영자전화번호를 입력하지 않았다면
            if (this.dataForm.phoneNum.trim() === '') {
                this.$refs.phoneNum.focus()
                showToast(this, '请输入电话号', 'warning')
                return
            }

            // 운영자위챗번호를 입력하지 않았다면
            if (this.dataForm.shopWechatId === undefined) {
                this.$refs.phoneNum.focus()
                showToast(this, '请输入商户微信证号', 'warning')
                return
            }

            const isSuccess = await this.openMessageBox()

            if (!isSuccess) {
                return
            }

            // 점포 중복 체크
            const queryExist = {
                shopName: this.dataForm.shopName,
                id: 0
            }
            const exist = await this.setExistShop(queryExist)

            if (exist.code !== 200) { // 점포중복이면 등록 불가
                return
            }

            this.isClicked = true

            let bannerForm = new FormData()
            let backgroundForm = new FormData()
            let licenseForm = new FormData()
            let ownerForm = new FormData()
            let payCodeForm = new FormData()
            let bannerUri = ''
            let shopBackroundUri = ''
            let licenseUri = ''
            let ownerUri = ''
            let payCodeUri = ''

            // 점포배너이미지 업로드
            if (this.dataForm.shopBannerFile !== undefined) {
                bannerForm.append('file', this.dataForm.shopBannerFile)
                const res = await this.setUploadBannerImageData(bannerForm)

                if (res.code === 0) {
                    bannerUri = res.data.uri
                } else {
                    this.isClicked = false
                    return
                }
            }

            // 점포백그라운드이미지 업로드
            if (this.dataForm.shopBackroundFile !== undefined) {
                backgroundForm.append('file', this.dataForm.shopBackroundFile)
                const res = await this.setUploadShopBackgroundImageData(backgroundForm)

                if (res.code === 0) {
                    shopBackroundUri = res.data.uri
                } else {
                    this.isClicked = false
                    return
                }
            }

            // 점포등록증이미지 업로드
            if (this.dataForm.shopLicenseFile !== undefined) {
                licenseForm.append('file', this.dataForm.shopLicenseFile)

                const res = await this.setUploadLicenseImageData(licenseForm)

                if (res.code === 0) {
                    licenseUri = res.data.uri
                } else {
                    this.isClicked = false
                    return
                }
            }

            // 결제수금번호이미지 업로드
            if (this.dataForm.payCodeFile !== undefined) {
                payCodeForm.append('file', this.dataForm.payCodeFile)

                const res = await this.setUploadPayCodeImageData(payCodeForm)

                if (res.code === 0) {
                    payCodeUri = res.data.uri
                } else {
                    this.isClicked = false
                    return
                }
            }

            // 점포운영자이미지 업로드
            if (this.dataForm.ownerAvatarFile !== undefined) {
                ownerForm.append('file', this.dataForm.ownerAvatarFile)

                const res = await this.setUploadOwnerImageData(ownerForm)

                if (res.code === 0) {
                    ownerUri = res.data.uri
                } else {
                    this.isClicked = false
                    return
                }
            }

            const query = {
                shopName: this.dataForm.shopName,
                shopOwner: this.dataForm.shopOwner,
                phoneNum: this.dataForm.phoneNum,
                idCard: this.dataForm.idCard,
                rankingNum: this.dataForm.rankingNum,
                shopWechatId: this.dataForm.shopWechatId,
                typeId: this.dataForm.typeId,
                subTypeId: this.dataForm.subTypeId,
                isSelf: this.dataForm.isSelf === true ? '1' : '0',
                isRecommend: this.dataForm.isRecommend === true ? '1' : '0',
                shopStatus: '0',
                tags: this.dataForm.tags,
                floorNum: this.dataForm.floorNum,
                zoneNum: this.dataForm.zoneNum,
                positionNum: this.dataForm.positionNum,
                locationRemark: this.dataForm.locationRemark,
                shopBanner: bannerUri,
                bgImg: shopBackroundUri,
                openDt: this.dataForm.openDt === null || this.dataForm.openDt === '' ? '' : this.$moment(this.dataForm.openDt).format('YYYY-MM-DD'),
                shopLicense: licenseUri,
                ownerAvatar: ownerUri,
                payCode: payCodeUri,
                bankCard: this.dataForm.bankCard,
                shopIntro: this.dataForm.shopIntro
            }

            setRegisterShop(query).then(response => {
                if (response.code === 0) {
                    showToast(this, '操作成功', 'success')
                    this.$router.push({
                        path: '/shop/shop_list'
                    })
                }

                this.isClicked = false
            })
        }
    }
}