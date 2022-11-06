import elDragDialog from '@/directive/el-drag-dialog'

import {
    getShipping,
    getProvice,
    getDeliveryCompany,
    updateShippingData,
    getRunnerCompany
} from '@/api/shipping' // 배송 데이터 API 추가

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
    removeComma
} from '@/utils/'

export default {
    name: 'Shipping_detail',
    components: {},
    async created() {
        setClearGoodsSearchField()
        setClearGoodsBatchSearchField()
        setClearShopSearchField()
        setClearShopBatchField()
        setClearOrderSearchField()

        const province = await this.getProviceData()
        this.getCompanyRunnerData()

        if (province.code === 0) {
            province.data.filter(res => {
                let val = {
                    code: res.code,
                    province: res.name,
                    checked: false
                }

                this.listProvince.push(val)
            })
        }

        this.getDeliveryCompanyData()
        this.getShippingData()
    },
    mounted() {
        window.addEventListener('keyup', this.setFilterValue)
        window.addEventListener('focusout', this.setFocusValue)
    },
    directives: {
        elDragDialog
    },
    data() {
        return {
            listLoading: false,
            dataForm: {
                freeStatus: '0', // 배송상태(0: 유료, 1: 무료)
                winterBeginMonth: undefined, // 겨울기간 시작월
                winterEndMonth: undefined, // 겨울기간 마감월
                summerBeginMonth: undefined, // 봄~가을 시작월
                summerEndMonth: undefined, // 봄~가을 마감월
                packageStatus: true, // 포장비수령여부(0: 포장비 받지 않음, 1: 포장비 받음)
                cityName: '', // 쇼핑몰동일 성시명
                initWeight: 0, // 최소무게
                initPrice: 0, // 최소배송비
                addWeight: 0, // 최대무게
                addPrice: 0, // 최대배송비
                weightLimit: 0, // 최대허용무게
                initDistance: 0, // 최소거리
                initDistancePrice: 0, // 최소거리배송비
                addDistance: 0, // 최대거리
                addDistancePrice: 0, // 최대거리배송비
                autoCommitDay: 0, // 자동수화일수
                companyRunnerId: undefined, // 배달회사아이디
                companyFresh: '', // 랭동물품배송회사명
                freshDay: 0, // 랭동물품자동수화일수
                companyLiving: '', // 생선물품배송회사명
                livingDay: 0, // 생선물품자동수화일수
                companyPackage: '', // 륙로배송회사명
                packageDay: 0, // 륙로배송자동수화일수
                minuteBegin: '', // 시장에서 직접주문시작구간시간
                minuteInterval: '', // 시장에서 직접주문시간구간
                endTime: '', // 시장에서 직접주문마감시간
                freeShippingStatus: '0', // 무료, 유료배송상태값
                freeShippingPrice: '', // 무료, 유료배송가격
                freeShippingRate: '', // 무료, 유료배송비률
                freePackageStatus: '0', // 무료, 유료패키지상태값
                freePackagePrice: '' // 무료, 유료파키지가격
            },
            rules: {
                winterBeginMonth: [{
                    required: true,
                    message: '冬天开始月是必填项',
                    trigger: 'blur'
                }],
                winterEndMonth: [{
                    required: true,
                    message: '冬天结束月是必填项',
                    trigger: 'blur'
                }],
                summerBeginMonth: [{
                    required: true,
                    message: '春夏秋开始月是必填项',
                    trigger: 'blur'
                }],
                summerEndMonth: [{
                    required: true,
                    message: '春夏秋结束月是必填项',
                    trigger: 'blur'
                }],
                initWeight: [{
                    required: true,
                    message: '该项是必填项',
                    trigger: 'blur'
                }],
                initPrice: [{
                    required: true,
                    message: '该项是必填项',
                    trigger: 'blur'
                }],
                addWeight: [{
                    required: true,
                    message: '该项是必填项',
                    trigger: 'blur'
                }],
                addPrice: [{
                    required: true,
                    message: '该项是必填项',
                    trigger: 'blur'
                }],
                weightLimit: [{
                    required: true,
                    message: '该项是必填项',
                    trigger: 'blur'
                }],
                initDistance: [{
                    required: true,
                    message: '该项是必填项',
                    trigger: 'blur'
                }],
                initDistancePrice: [{
                    required: true,
                    message: '该项是必填项',
                    trigger: 'blur'
                }],
                addDistance: [{
                    required: true,
                    message: '该项是必填项',
                    trigger: 'blur'
                }],
                addDistancePrice: [{
                    required: true,
                    message: '该项是必填项',
                    trigger: 'blur'
                }],
                autoCommitDay: [{
                    required: true,
                    message: '该项是必填项',
                    trigger: 'blur'
                }],
                freshDay: [{
                    required: true,
                    message: '自动收货天数是必填项',
                    trigger: 'blur'
                }],
                livingDay: [{
                    required: true,
                    message: '自动收货天数是必填项',
                    trigger: 'blur'
                }],
                packageDay: [{
                    required: true,
                    message: '自动收货天数是必填项',
                    trigger: 'blur'
                }]
            },
            sameCity: [], // 도시이름 배렬
            companyRunnerList: [], // 배달회사기초정보
            companyFreshList: [], // 배송회사(랭동용)
            companyLivingList: [], // 배송회사(생선용)
            companyPackageList: [], // 배송회사(운송)
            freshWinterLocal: [], // 겨울용지역배렬(랭동물품배송)
            freshSummerLocal: [], // 여름용지역배렬(랭동물품배송)
            livingWinterLocal: [], // 겨울용지역배렬(생선물품배송)
            livingSummerLocal: [], // 여름용지역배렬(생선물품배송)
            listProvince: [], // 성, 시 배렬
            isShowProvinceDialog: false, // 성, 시 추가다이얼로그
            isCheckAllRow: false, // 테블 전체선택 상태값
            deliveryKind: '', // 배송방식
            packageData: [] // 포장정보배렬
        }
    },
    methods: {
        setFocusValue(element) {
            if (element.target.id === 'freeShippingPrice') {
                this.dataForm.freeShippingPrice = this.dataForm.freeShippingPrice !== '' ? parseFloat(this.dataForm.freeShippingPrice).toFixed(2) : ''
            }

            if (element.target.id === 'freeShippingRate') {
                this.dataForm.freeShippingRate = this.dataForm.freeShippingRate !== '' ? parseFloat(this.dataForm.freeShippingRate) : ''
            }

            if (element.target.id === 'freePackagePrice') {
                this.dataForm.freePackagePrice = this.dataForm.freePackagePrice !== '' ? parseFloat(this.dataForm.freePackagePrice).toFixed(2) : ''
            }

            if (element.target.id === 'initPrice') {
                this.dataForm.initPrice = this.dataForm.initPrice !== '' ? parseFloat(this.dataForm.initPrice).toFixed(2) : ''
            }

            if (element.target.id === 'addPrice') {
                this.dataForm.addPrice = this.dataForm.addPrice !== '' ? parseFloat(this.dataForm.addPrice).toFixed(2) : ''
            }

            if (element.target.id === 'initDistancePrice') {
                this.dataForm.initDistancePrice = this.dataForm.initDistancePrice !== '' ? parseFloat(this.dataForm.initDistancePrice).toFixed(2) : ''
            }

            if (element.target.id === 'addDistancePrice') {
                this.dataForm.addDistancePrice = this.dataForm.addDistancePrice !== '' ? parseFloat(this.dataForm.addDistancePrice).toFixed(2) : ''
            }

            this.packageData.filter((res, index) => {
                if (element.target.id === 'price_' + index) {
                    this.packageData[index].price = this.packageData[index].price !== '' ? parseFloat(this.packageData[index].price).toFixed(2) : ''
                }
            })
        },
        setFilterValue(element) {
            if (element.target.id === 'freeShippingPrice') {
                if (element.target.value) {
                    element.target.value = element.target.value.replace(/[^0-9.]/g, '')
                    this.dataForm.freeShippingPrice = element.target.value

                    if (this.dataForm.freeShippingPrice.indexOf('.') !== -1) {
                        this.dataForm.freeShippingPrice = this.dataForm.freeShippingPrice.slice(0, this.dataForm.freeShippingPrice.indexOf('.') + 3)
                    }
                }
            }

            if (element.target.id === 'freeShippingRate') {
                if (element.target.value) {
                    element.target.value = element.target.value.replace(/[^0-9.]/g, '')
                    this.dataForm.freeShippingRate = element.target.value

                    if (this.dataForm.freeShippingRate.indexOf('.') !== -1) {
                        this.dataForm.freeShippingRate = this.dataForm.freeShippingRate.slice(0, this.dataForm.freeShippingRate.indexOf('.') + 3)
                    }
                }
            }

            if (element.target.id === 'freePackagePrice') {
                if (element.target.value) {
                    element.target.value = element.target.value.replace(/[^0-9.]/g, '')
                    this.dataForm.freePackagePrice = element.target.value

                    if (this.dataForm.freePackagePrice.indexOf('.') !== -1) {
                        this.dataForm.freePackagePrice = this.dataForm.freePackagePrice.slice(0, this.dataForm.freePackagePrice.indexOf('.') + 3)
                    }
                }
            }

            if (element.target.id === 'winterBeginMonth') {
                if (element.target.value !== undefined) {
                    element.target.value = element.target.value.substr(0, 2).replace(/[^0-9]/g, '')
                    this.dataForm.winterBeginMonth = element.target.value
                }
            }

            if (element.target.id === 'winterEndMonth') {
                if (element.target.value !== undefined) {
                    element.target.value = element.target.value.substr(0, 2).replace(/[^0-9]/g, '')
                    this.dataForm.winterEndMonth = element.target.value
                }
            }

            if (element.target.id === 'summerBeginMonth') {
                if (element.target.value !== undefined) {
                    element.target.value = element.target.value.substr(0, 2).replace(/[^0-9]/g, '')
                    this.dataForm.summerBeginMonth = element.target.value
                }
            }

            if (element.target.id === 'summerEndMonth') {
                if (element.target.value !== undefined) {
                    element.target.value = element.target.value.substr(0, 2).replace(/[^0-9]/g, '')
                    this.dataForm.summerEndMonth = element.target.value
                }
            }

            this.packageData.filter((res, index) => {
                if (element.target.id === 'price_' + index) {
                    this.packageData[index].price = this.packageData[index].price.replace(/[^0-9.]/g, '')

                    if (this.packageData[index].price.indexOf('.') !== -1) {
                        this.packageData[index].price = this.packageData[index].price.slice(0, this.packageData[index].price.indexOf('.') + 3)
                    }
                }

                if (element.target.id === 'winterWeight_' + index) {
                    this.packageData[index].winterWeight = this.packageData[index].winterWeight.replace(/[^0-9.]/g, '')

                    if (this.packageData[index].winterWeight.indexOf('.') !== -1) {
                        this.packageData[index].winterWeight = this.packageData[index].winterWeight.slice(0, this.packageData[index].winterWeight.indexOf('.') + 3)
                    }
                }

                if (element.target.id === 'summerWeight_' + index) {
                    this.packageData[index].summerWeight = this.packageData[index].summerWeight.replace(/[^0-9.]/g, '')

                    if (this.packageData[index].summerWeight.indexOf('.') !== -1) {
                        this.packageData[index].summerWeight = this.packageData[index].summerWeight.slice(0, this.packageData[index].summerWeight.indexOf('.') + 3)
                    }
                }
            })

            if (element.target.id === 'minuteBegin') {
                if (element.target.value !== undefined) {
                    element.target.value = element.target.value.replace(/[^0-9]/g, '')
                    this.dataForm.minuteBegin = element.target.value
                }
            }

            if (element.target.id === 'initWeight') {
                if (element.target.value !== undefined) {
                    element.target.value = element.target.value.replace(/[^0-9.]/g, '')

                    if (element.target.value.indexOf('.') !== -1) {
                        element.target.value = element.target.value.slice(0, element.target.value.indexOf('.') + 3)
                    }

                    this.dataForm.initWeight = element.target.value
                }
            }

            if (element.target.id === 'initPrice') {
                if (this.dataForm.initPrice !== undefined) {
                    this.dataForm.initPrice = this.dataForm.initPrice.replace(/[^0-9.]/g, '')

                    if (this.dataForm.initPrice.indexOf('.') !== -1) {
                        this.dataForm.initPrice = this.dataForm.initPrice.slice(0, this.dataForm.initPrice.indexOf('.') + 3)
                    }
                }
            }

            if (element.target.id === 'addWeight') {
                if (element.target.value !== undefined) {
                    element.target.value = element.target.value.replace(/[^0-9.]/g, '')

                    if (element.target.value.indexOf('.') !== -1) {
                        element.target.value = element.target.value.slice(0, element.target.value.indexOf('.') + 3)
                    }

                    this.dataForm.addWeight = element.target.value
                }
            }

            if (element.target.id === 'addPrice') {
                if (element.target.value !== undefined) {
                    element.target.value = element.target.value.replace(/[^0-9.]/g, '')

                    if (element.target.value.indexOf('.') !== -1) {
                        element.target.value = element.target.value.slice(0, element.target.value.indexOf('.') + 3)
                    }

                    this.dataForm.addPrice = element.target.value
                }
            }

            if (element.target.id === 'weightLimit') {
                if (element.target.value !== undefined) {
                    element.target.value = element.target.value.replace(/[^0-9.]/g, '')

                    if (element.target.value.indexOf('.') !== -1) {
                        element.target.value = element.target.value.slice(0, element.target.value.indexOf('.') + 3)
                    }

                    this.dataForm.weightLimit = element.target.value
                }
            }

            if (element.target.id === 'initDistance') {
                if (element.target.value !== undefined) {
                    element.target.value = element.target.value.replace(/[^0-9.]/g, '')

                    if (element.target.value.indexOf('.') !== -1) {
                        element.target.value = element.target.value.slice(0, element.target.value.indexOf('.') + 3)
                    }

                    this.dataForm.initDistance = element.target.value
                }
            }

            if (element.target.id === 'initDistancePrice') {
                if (element.target.value !== undefined) {
                    element.target.value = element.target.value.replace(/[^0-9.]/g, '')

                    if (element.target.value.indexOf('.') !== -1) {
                        element.target.value = element.target.value.slice(0, element.target.value.indexOf('.') + 3)
                    }

                    this.dataForm.initDistancePrice = element.target.value
                }
            }

            if (element.target.id === 'addDistance') {
                if (element.target.value !== undefined) {
                    element.target.value = element.target.value.replace(/[^0-9.]/g, '')

                    if (element.target.value.indexOf('.') !== -1) {
                        element.target.value = element.target.value.slice(0, element.target.value.indexOf('.') + 3)
                    }

                    this.dataForm.addDistance = element.target.value
                }
            }

            if (element.target.id === 'addDistancePrice') {
                if (element.target.value !== undefined) {
                    element.target.value = element.target.value.replace(/[^0-9.]/g, '')

                    if (element.target.value.indexOf('.') !== -1) {
                        element.target.value = element.target.value.slice(0, element.target.value.indexOf('.') + 3)
                    }

                    this.dataForm.addDistancePrice = element.target.value
                }
            }

            if (element.target.id === 'autoCommitDay') {
                if (element.target.value !== undefined) {
                    element.target.value = element.target.value.replace(/[^0-9]/g, '')
                    this.dataForm.autoCommitDay = element.target.value
                }
            }

            if (element.target.id === 'freshDay') {
                if (element.target.value !== undefined) {
                    element.target.value = element.target.value.replace(/[^0-9]/g, '')
                    this.dataForm.freshDay = element.target.value
                }
            }

            if (element.target.id === 'livingDay') {
                if (element.target.value !== undefined) {
                    element.target.value = element.target.value.replace(/[^0-9]/g, '')
                    this.dataForm.livingDay = element.target.value
                }
            }

            if (element.target.id === 'packageDay') {
                if (element.target.value !== undefined) {
                    element.target.value = element.target.value.replace(/[^0-9]/g, '')
                    this.dataForm.packageDay = element.target.value
                }
            }
        },
        getCompanyData() { // 배송회사정보 얻기
            return new Promise((resolve, reject) => {
                getDeliveryCompany().then(response => {
                    resolve(response)
                }).catch(error => {
                    reject(error)
                })
            })
        },
        getProviceData(data) {
            return new Promise((resolve, reject) => {
                getProvice(data).then(response => {
                    resolve(response)
                }).catch(error => {
                    reject(error)
                })
            })
        },
        getCompanyRunnerData() {
            getRunnerCompany().then(response => {
                if (response.code === 0) {
                    this.companyRunnerList = response.data
                }
            })
        },
        getDeliveryCompanyData() {
            getDeliveryCompany().then(response => {
                if (response.code === 0) {
                    if (response.data.length !== 0) {
                        response.data.filter(res => {
                            if (res.type === 1) { // 정상배송
                                this.companyPackageList = res.companies
                            }

                            if (res.type === 2) { // 생선배송
                                this.companyLivingList = res.companies
                            }

                            if (res.type === 3) { // 랭동배송
                                this.companyFreshList = res.companies
                            }
                        })
                    }
                }
            })
        },
        getShippingData() { // 배송설정정보 얻기
            getShipping().then(response => {
                if (response.code === 0) {
                    this.dataForm.freeStatus = response.data.freeStatus // 배송방식
                    this.dataForm.winterBeginMonth = response.data.winterBeginMonth
                    this.dataForm.winterEndMonth = response.data.winterEndMonth
                    this.dataForm.summerBeginMonth = response.data.summerBeginMonth
                    this.dataForm.summerEndMonth = response.data.summerEndMonth
                    this.dataForm.packageStatus = response.data.runnerDto.packageStatus === '1'
                    this.dataForm.cityName = response.data.runnerDto.cityName
                    this.dataForm.initWeight = response.data.runnerDto.initWeight
                    this.dataForm.initPrice = response.data.runnerDto.initPrice
                    this.dataForm.addWeight = response.data.runnerDto.addWeight
                    this.dataForm.addPrice = response.data.runnerDto.addPrice
                    this.dataForm.weightLimit = response.data.runnerDto.weightLimit
                    this.dataForm.initDistance = response.data.runnerDto.initDistance
                    this.dataForm.initDistancePrice = response.data.runnerDto.initDistancePrice
                    this.dataForm.addDistance = response.data.runnerDto.addDistance
                    this.dataForm.addDistancePrice = response.data.runnerDto.addDistancePrice
                    this.dataForm.autoCommitDay = response.data.runnerDto.autoCommitDay
                    this.packageData = response.data.packageDto
                    this.dataForm.minuteBegin = response.data.selfDto.minuteBegin
                    this.dataForm.minuteInterval = response.data.selfDto.minuteInterval
                    this.dataForm.endTime = response.data.selfDto.endTime
                    this.dataForm.freeShippingStatus = response.data.freeShippingDto ? response.data.freeShippingDto.status ? response.data.freeShippingDto.status : '0' : '0'
                    this.dataForm.freeShippingPrice = response.data.freeShippingDto ? response.data.freeShippingDto.price ? parseFloat(response.data.freeShippingDto.price).toFixed(2) : '' : ''
                    this.dataForm.freePackageStatus = response.data.freePackageDto ? response.data.freePackageDto.status ? response.data.freePackageDto.status : '0' : '0'
                    this.dataForm.freePackagePrice = response.data.freePackageDto ? response.data.freePackageDto.price ? parseFloat(response.data.freePackageDto.price).toFixed(2) : '' : ''
                    this.dataForm.freeShippingRate = response.data.freeShippingDto ? response.data.freeShippingDto.profitRate ? parseFloat(response.data.freeShippingDto.profitRate) : '' : ''

                    if (response.data.freshDto.winter.length !== 0) {
                        this.freshWinterLocal = []

                        this.listProvince.filter(res => {
                            response.data.freshDto.winter.filter(value => {
                                if (res.code === value) {
                                    let val = {
                                        code: res.code,
                                        province: res.province
                                    }

                                    this.freshWinterLocal.push(val)
                                }
                            })
                        })
                    }

                    if (response.data.freshDto.summer.length !== 0) {
                        this.freshSummerLocal = []

                        this.listProvince.filter(res => {
                            response.data.freshDto.summer.filter(value => {
                                if (res.code === value) {
                                    let val = {
                                        code: res.code,
                                        province: res.province
                                    }

                                    this.freshSummerLocal.push(val)
                                }
                            })
                        })
                    }

                    if (response.data.livingDto.winter.length !== 0) {
                        this.livingWinterLocal = []

                        this.listProvince.filter(res => {
                            response.data.livingDto.winter.filter(value => {
                                if (res.code === value) {
                                    let val = {
                                        code: res.code,
                                        province: res.province
                                    }

                                    this.livingWinterLocal.push(val)
                                }
                            })
                        })
                    }

                    if (response.data.livingDto.summer.length !== 0) {
                        this.livingSummerLocal = []

                        this.listProvince.filter(res => {
                            response.data.livingDto.summer.filter(value => {
                                if (res.code === value) {
                                    let val = {
                                        code: res.code,
                                        province: res.province
                                    }

                                    this.livingSummerLocal.push(val)
                                }
                            })
                        })
                    }

                    this.dataForm.freshDay = response.data.freshDto.autoCommitDay
                    this.dataForm.livingDay = response.data.livingDto.autoCommitDay
                    this.dataForm.packageDay = response.data.landDto.autoCommitDay
                }
            })
        },
        setShippingStatus(e) {
            if (e === '0') {
                this.dataForm.freePackageStatus = '0'
                this.dataForm.freeShippingPrice = ''
                this.dataForm.freeShippingRate = ''
                this.dataForm.freePackagePrice = ''
            }
        },
        setShowProvinceDialog(kind) { // 성, 시 추가 다이얼로그 로출
            this.deliveryKind = kind
            this.isShowProvinceDialog = true

            this.listProvince.filter((res, index) => {
                this.listProvince[index].checked = false
            })

            if (kind === 'fresh_winter') { // 랭동용품 전지역(여름지역)
                this.freshWinterLocal.filter(result => {
                    this.listProvince.filter((res, index) => {
                        if (res.code === result.code) {
                            this.listProvince[index].checked = true
                        }
                    })
                })
            }

            if (kind === 'fresh_summer') { // 랭동용품 전지역(겨울지역)
                this.freshSummerLocal.filter(result => {
                    this.listProvince.filter((res, index) => {
                        if (res.code === result.code) {
                            this.listProvince[index].checked = true
                        }
                    })
                })
            }

            if (kind === 'living_winter') { // 신선용품 전지역(여름지역)
                this.livingWinterLocal.filter(result => {
                    this.listProvince.filter((res, index) => {
                        if (res.code === result.code) {
                            this.listProvince[index].checked = true
                        }
                    })
                })
            }

            if (kind === 'living_summer') { // 신선용품 전지역(겨울지역)
                this.livingSummerLocal.filter(result => {
                    this.listProvince.filter((res, index) => {
                        if (res.code === result.code) {
                            this.listProvince[index].checked = true
                        }
                    })
                })
            }

            // 모든 지역이 선택되여있다면 전체선택 체크박스 체크상태로, 아니면 체크해제
            this.isCheckAllRow = this.listProvince.every(item => item.checked)
        },
        setAddProvince() { // 성, 시 추가
            let isChecked = false

            this.listProvince.filter(res => {
                if (res.checked) {
                    isChecked = true
                }
            })

            if (!isChecked) {
                showToast(this, '请选择新增省', 'warning')
                return
            }

            if (this.deliveryKind === 'fresh_winter') {
                this.freshWinterLocal = []

                this.listProvince.filter(result => {
                    if (result.checked) {
                        let val = {
                            code: result.code,
                            province: result.province
                        }

                        this.freshWinterLocal.push(val)
                    }
                })
            }

            if (this.deliveryKind === 'fresh_summer') { // 랭동용품 전지역(겨울지역)
                this.freshSummerLocal = []

                this.listProvince.filter(result => {
                    if (result.checked) {
                        let val = {
                            code: result.code,
                            province: result.province
                        }

                        this.freshSummerLocal.push(val)
                    }
                })
            }

            if (this.deliveryKind === 'living_winter') { // 신선용품 전지역(여름지역)
                this.livingWinterLocal = []

                this.listProvince.filter(result => {
                    if (result.checked) {
                        let val = {
                            code: result.code,
                            province: result.province
                        }

                        this.livingWinterLocal.push(val)
                    }
                })
            }

            if (this.deliveryKind === 'living_summer') { // 신선용품 전지역(겨울지역)
                this.livingSummerLocal = []

                this.listProvince.filter(result => {
                    if (result.checked) {
                        let val = {
                            code: result.code,
                            province: result.province
                        }

                        this.livingSummerLocal.push(val)
                    }
                })
            }

            this.isShowProvinceDialog = false
        },
        setCancelDialog() { // 다이얼로그 닫기
            this.isShowProvinceDialog = false
            this.isCheckAllRow = false
        },
        renderHeader(h) { // 헤더에 체크박스 렌더링
            const that = this
            return h('label', [h('input', {
                domProps: {
                    type: 'checkbox',
                    checked: that.isCheckAllRow
                },
                on: {
                    change(event) {
                        const val = event.target.checked
                        that.isCheckAllRow = val

                        that.listProvince.filter(res => {
                            res.checked = val
                        })
                    }
                }
            }), ''])
        },
        setTableRowSelect() { // 키워드 테블 행 클릭
            // 모든 지역이 선택되여있다면 전체선택 체크박스 체크상태로, 아니면 체크해제
            this.isCheckAllRow = this.listProvince.every(item => item.checked)
        },
        setDeleteProvince(index, kind) { // 성, 시 선택 삭제
            if (kind === 'fresh_winter') { // 랭동용품 전지역(여름지역)
                this.freshWinterLocal.splice(index, 1)
            }

            if (kind === 'fresh_summer') { // 랭동용품 전지역(겨울지역)
                this.freshSummerLocal.splice(index, 1)
            }

            if (kind === 'living_winter') { // 신선용품 전지역(여름지역)
                this.livingWinterLocal.splice(index, 1)
            }

            if (kind === 'living_summer') { // 신선용품 전지역(겨울지역)
                this.livingSummerLocal.splice(index, 1)
            }
        },
        setUpdateDeliveryInfo(kind) {
            const month = this.$moment(new Date()).format('MM').replace(/(^0+)/, '')
            let query = ''

            // 랭동배송
            if (kind === 'fresh') {
                if (this.dataForm.companyFresh === '') {
                    showToast(this, '请选择配送公司', 'warning')
                    return
                }

                // 겨울
                if (Number(month) >= Number(this.dataForm.winterBeginMonth) || Number(month) <= Number(this.dataForm.winterEndMonth)) {
                    this.freshWinterLocal.filter(res => {
                        query += res.province + '-'
                    })
                }

                // 봄, 여름, 가을
                if (Number(month) >= Number(this.dataForm.summerBeginMonth) && Number(month) <= Number(this.dataForm.summerEndMonth)) {
                    this.freshSummerLocal.filter(res => {
                        query += res.province + '-'
                    })
                }

                this.$router.push({
                    path: '/shipping/company_update?id=' + this.dataForm.companyFresh + '&province=' + query.slice(0, query.length - 1)
                })
            }

            // 생선배송
            if (kind === 'living') {
                if (this.dataForm.companyLiving === '') {
                    showToast(this, '请选择配送公司', 'warning')
                    return
                }

                // 겨울
                if (Number(month) >= Number(this.dataForm.winterBeginMonth) || Number(month) <= Number(this.dataForm.winterEndMonth)) {
                    this.livingWinterLocal.filter(res => {
                        query += res.province + '-'
                    })
                }

                // 봄, 여름, 가을
                if (Number(month) >= Number(this.dataForm.summerBeginMonth) && Number(month) <= Number(this.dataForm.summerEndMonth)) {
                    this.livingSummerLocal.filter(res => {
                        query += res.province + '-'
                    })
                }

                this.$router.push({
                    path: '/shipping/company_update?id=' + this.dataForm.companyLiving + '&province=' + query.slice(0, query.length - 1)
                })
            }

            // 일반배송
            if (kind === 'package') {
                if (this.dataForm.companyPackage === '') {
                    showToast(this, '请选择配送公司', 'warning')
                    return
                }

                this.$router.push({
                    path: '/shipping/company_update?id=' + this.dataForm.companyPackage + '&province=' + query.slice(0, query.length - 1)
                })
            }
        },
        setAddDeliveryInfo(kind) {
            const month = this.$moment(new Date()).format('MM').replace(/(^0+)/, '')
            let query = ''

            // 랭동배송
            if (kind === 'fresh') {
                // 겨울
                if (Number(month) >= Number(this.dataForm.winterBeginMonth) || Number(month) <= Number(this.dataForm.winterEndMonth)) {
                    this.freshWinterLocal.filter(res => {
                        query += res.province + '-'
                    })
                }

                // 봄, 여름, 가을
                if (Number(month) >= Number(this.dataForm.summerBeginMonth) && Number(month) <= Number(this.dataForm.summerEndMonth)) {
                    this.freshSummerLocal.filter(res => {
                        query += res.province + '-'
                    })
                }

                this.$router.push({
                    path: '/shipping/company_add?kind=冷鲜&province=' + query.slice(0, query.length - 1)
                })
            }

            // 생선배송
            if (kind === 'living') {
                // 겨울
                if (Number(month) >= Number(this.dataForm.winterBeginMonth) || Number(month) <= Number(this.dataForm.winterEndMonth)) {
                    this.livingWinterLocal.filter(res => {
                        query += res.province + '-'
                    })
                }

                // 봄, 여름, 가을
                if (Number(month) >= Number(this.dataForm.summerBeginMonth) && Number(month) <= Number(this.dataForm.summerEndMonth)) {
                    this.livingSummerLocal.filter(res => {
                        query += res.province + '-'
                    })
                }

                this.$router.push({
                    path: '/shipping/company_add?kind=活体&province=' + query.slice(0, query.length - 1)
                })
            }

            // 일반배송
            if (kind === 'package') {
                this.$router.push({
                    path: '/shipping/company_add?kind=陆运&province=' + query.slice(0, query.length - 1)
                })
            }
        },
        setUpdateRunnerPrice() {
            if (this.dataForm.companyRunnerId === undefined) {
                showToast(this, '请选择跑腿公司', 'warning')
                return
            }

            this.$router.push({
                path: '/shipping/running_setting?id=' + this.dataForm.companyRunnerId
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
        async setUpdate() {
            if (this.dataForm.freeShippingStatus === '1' && this.dataForm.freeShippingPrice === '') {
                this.$refs.freeShippingPrice.focus()
                showToast(this, '请输入免邮满减', 'warning')
                return
            }

            if (this.dataForm.freeShippingStatus === '1' && this.dataForm.freeShippingRate === '') {
                this.$refs.freeShippingRate.focus()
                showToast(this, '请输入毛利率高于', 'warning')
                return
            }

            if (this.dataForm.freePackageStatus === '1' && this.dataForm.freePackagePrice === '') {
                this.$refs.freePackagePrice.focus()
                showToast(this, '请输入免包装费满减', 'warning')
                return
            }

            if (this.dataForm.winterBeginMonth === undefined || this.dataForm.winterBeginMonth === '') {
                this.$refs.winterBeginMonth.focus()
                showToast(this, '请输入冬天开始月', 'warning')
                return
            }

            if (this.dataForm.winterEndMonth === undefined || this.dataForm.winterEndMonth === '') {
                this.$refs.winterEndMonth.focus()
                showToast(this, '请输入冬天结束月', 'warning')
                return
            }

            if (this.dataForm.summerBeginMonth === undefined || this.dataForm.summerBeginMonth === '') {
                this.$refs.summerBeginMonth.focus()
                showToast(this, '请输入春夏秋开始月', 'warning')
                return
            }

            if (this.dataForm.summerEndMonth === undefined || this.dataForm.summerEndMonth === '') {
                this.$refs.summerEndMonth.focus()
                showToast(this, '请输入春夏秋结束月', 'warning')
                return
            }

            for (let i = 0; i < this.packageData.length; i++) {
                if (this.packageData[i].name === '') {
                    this.$refs['name_' + i][0].focus()
                    showToast(this, '请输入包装类别', 'warning')
                    return
                }

                if (this.packageData[i].price === '') {
                    this.$refs['price_' + i][0].focus()
                    showToast(this, '请输入包装费', 'warning')
                    return
                }

                if (this.packageData[i].winterWeight === '') {
                    this.$refs['winterWeight_' + i][0].focus()
                    showToast(this, '请输入冬天设置重量', 'warning')
                    return
                }

                if (this.packageData[i].summerWeight === '') {
                    this.$refs['summerWeight_' + i][0].focus()
                    showToast(this, '请输入冬天设置重量', 'warning')
                    return
                }
            }

            if (this.dataForm.minuteBegin === '') {
                this.$refs.minuteBegin.focus()
                showToast(this, '请输入起始自取时间', 'warning')
                return
            }

            if (this.dataForm.minuteInterval === '') {
                this.$refs.minuteInterval.focus()
                showToast(this, '请输入间隔时间', 'warning')
                return
            }

            if (this.dataForm.endTime === '') {
                this.$refs.endTime.focus()
                showToast(this, '请输入截至时间', 'warning')
                return
            }

            if (this.dataForm.initWeight === '') {
                this.$refs.initWeight.focus()
                showToast(this, '请输入首重', 'warning')
                return
            }

            if (this.dataForm.initPrice === '') {
                this.$refs.initPrice.focus()
                showToast(this, '请输入首费', 'warning')
                return
            }

            if (this.dataForm.addWeight === '') {
                this.$refs.addWeight.focus()
                showToast(this, '请输入续重', 'warning')
                return
            }

            if (this.dataForm.addPrice === '') {
                this.$refs.addPrice.focus()
                showToast(this, '请输入续费', 'warning')
                return
            }

            if (this.dataForm.weightLimit === '') {
                this.$refs.weightLimit.focus()
                showToast(this, '请输入最大重量', 'warning')
                return
            }

            if (this.dataForm.initDistance === '') {
                this.$refs.initDistance.focus()
                showToast(this, '请输入起始距离', 'warning')
                return
            }

            if (this.dataForm.initDistancePrice === '') {
                this.$refs.initDistancePrice.focus()
                showToast(this, '请输入以内费用为', 'warning')
                return
            }

            if (this.dataForm.addDistance === '') {
                this.$refs.addDistance.focus()
                showToast(this, '请输入每超过', 'warning')
                return
            }

            if (this.dataForm.addDistancePrice === '') {
                this.$refs.addDistancePrice.focus()
                showToast(this, '请输入续费', 'warning')
                return
            }

            if (this.dataForm.autoCommitDay === '') {
                this.$refs.autoCommitDay.focus()
                showToast(this, '请输入自动收货天数', 'warning')
                return
            }

            if (this.dataForm.freshDay === '') {
                this.$refs.freshDay.focus()
                showToast(this, '请输入自动收货天数', 'warning')
                return
            }

            if (this.dataForm.livingDay === '') {
                this.$refs.livingDay.focus()
                showToast(this, '请输入自动收货天数', 'warning')
                return
            }

            if (this.dataForm.packageDay === '') {
                this.$refs.packageDay.focus()
                showToast(this, '请输入自动收货天数', 'warning')
                return
            }

            const isSuccess = await this.openMessageBox()

            if (!isSuccess) {
                return
            }

            let winterFresh = []
            let summerFresh = []
            let winterLiving = []
            let summerLiving = []

            this.freshWinterLocal.filter(res => {
                winterFresh.push(res.code)
            })

            this.freshSummerLocal.filter(res => {
                summerFresh.push(res.code)
            })

            this.livingWinterLocal.filter(res => {
                winterLiving.push(res.code)
            })

            this.livingSummerLocal.filter(res => {
                summerLiving.push(res.code)
            })

            const query = {
                freeStatus: this.dataForm.freeStatus,
                winterBeginMonth: parseInt(this.dataForm.winterBeginMonth),
                winterEndMonth: parseInt(this.dataForm.winterEndMonth),
                summerBeginMonth: parseInt(this.dataForm.summerBeginMonth),
                summerEndMonth: parseInt(this.dataForm.summerEndMonth),
                packageDto: this.packageData,
                runnerDto: {
                    packageStatus: this.dataForm.packageStatus === true ? '1' : '0',
                    cityName: '延吉市',
                    initWeight: parseFloat(this.dataForm.initWeight),
                    initPrice: parseFloat(this.dataForm.initPrice),
                    addWeight: parseFloat(this.dataForm.addWeight),
                    addPrice: parseFloat(this.dataForm.addPrice),
                    weightLimit: parseFloat(this.dataForm.weightLimit),
                    initDistance: parseFloat(this.dataForm.initDistance),
                    initDistancePrice: parseFloat(this.dataForm.initDistancePrice),
                    addDistance: parseFloat(this.dataForm.addDistance),
                    addDistancePrice: parseFloat(this.dataForm.addDistancePrice),
                    autoCommitDay: parseFloat(this.dataForm.autoCommitDay)
                },
                freshDto: {
                    winter: winterFresh,
                    summer: summerFresh,
                    autoCommitDay: parseInt(this.dataForm.freshDay)
                },
                livingDto: {
                    winter: winterLiving,
                    summer: summerLiving,
                    autoCommitDay: parseInt(this.dataForm.livingDay)
                },
                landDto: {
                    autoCommitDay: parseInt(this.dataForm.packageDay)
                },
                selfDto: {
                    minuteBegin: this.dataForm.minuteBegin,
                    minuteInterval: parseInt(this.dataForm.minuteInterval),
                    endTime: this.dataForm.endTime
                },
                freeShippingDto: {
                    status: this.dataForm.freeShippingStatus,
                    price: this.dataForm.freeShippingStatus === '1' ? this.dataForm.freeShippingPrice : '0',
                    profitRate: this.dataForm.freeShippingStatus === '1' ? this.dataForm.freeShippingRate : '0'
                },
                freePackageDto: {
                    status: this.dataForm.freePackageStatus,
                    price: this.dataForm.freePackageStatus === '1' ? this.dataForm.freePackagePrice : '0'
                }
            }

            updateShippingData(query).then(response => {
                if (response === '') {
                    showToast(this, '操作成功', 'success')
                    this.getShippingData()
                }
            })
        }
    }
}