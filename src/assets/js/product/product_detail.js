import { getCategories } from '@/api/category' // 상품카테고리 API 추가
import {
    existProduct,
    getGoodsIcon,
    getPackageNameData,
    getPackageTypeData,
    getProductDetail,
    getRandKey,
    getUnitData,
    setUpdateProduct,
    setUploadImage,
    setUploadVideo,
    getFreeShipping
} from '@/api/product' // 상품 API 추가
import { getAllDeliveryCompany } from '@/api/shipping'
import { getShopData } from '@/api/shop' // 점포 API 추가
import { getTagData, setRegisterTag } from '@/api/tag' // 키워드 API 추가
import imageBack from '@/assets/images/review_image_back.png' // 썸네일 백그라운드 이미지 추가
import Thumbnails from '@/components/ImageItem/multi_image' // 메인상품이미지용 컴포넨트 추가
import Thumbnail from '@/components/ImageItem/single_image' // 상품썸네일용 컴포넨트 추가
import Pagination from '@/components/Pagination' // 페이징 콘퍼넨트 추가
import Tinymce from '@/components/Tinymce' // 편집기 컴포넨트 추가
import elDragDialog from '@/directive/el-drag-dialog'
import settings from '@/settings'
import {
    setAddComma,
    setAddCommaTwo,
    showToast
} from '@/utils/' // 토스트 설정
import {
    setClearOrderSearchField,
    setClearShopBatchField,
    setClearShopSearchField
} from '@/utils/auth' // 쿠키설정
import { MessageBox } from 'element-ui' // 메세지다이얼로그 추가
import Sortable from 'sortablejs' // 상품메인이미지 위치 바꾸기 추가


export default {
    name: 'Product_detail',
    components: {
        Tinymce,
        Pagination,
        Thumbnail,
        Thumbnails
    },
    async created() {
        setClearShopSearchField()
        setClearShopBatchField()
        setClearOrderSearchField()

        // 포장종류 얻기
        const response = await this.getPackageName()
        this.productid = this.$route.params && this.$route.params.id // 해당 상품 아이디
        this.getProductData(response)

        if (response.code === 0) {
            this.dataForm.listPackage = response.data
        }

        this.getFreeShipping()
        this.getDeliveryCompany()
        this.getDeliveryType()
        this.getUnit()
    },
    mounted() {
        window.addEventListener('keyup', this.setFilterValue)
        window.addEventListener('focusout', this.setFocusValue)
        this.setSort()
    },
    directives: {
        elDragDialog
    },
    filters: {
        addCommaTwo(data) { // 3자리수마다 콤마 추가
            return setAddCommaTwo(data)
        },
        addComma(value) {
            return setAddComma(value)
        }
    },
    data() {
        return {
            baseURL: settings.BASE_API_URL, // 편집기에서 이미지업로드용 API BASE URL
            imageBack: imageBack,
            listLoading: false,
            productid: undefined, // 상품아이디
            recommendStatus: false,
            isVisiblePriceToolTip: false,
            dataForm: {
                goodsName: '', // 상품명
                goodsSearchName: '', // 검색명
                goodsShortName: '', // 선택명
                rankingNum: '', // 랭킹순위
                shopName: '', // 점포명
                shopId: undefined, // 점포아이디
                tagName: '', // 키워드
                goodsWeight: '', // 상품무게
                typeName: '', // 분류명
                typeId: undefined, // 대분류아이디
                subTypeId: undefined, // 소분류아이디
                originalPrice: '', // 원가
                salesPrice: '', // 판매가
                discountPercent: '', // 판매가 할인률
                isPercent: false, // 판매가 할인률 사용여부
                costPrice: '', // 공급가
                visualSalesNum: '', // 가상판매량
                profitRate: '', // 리윤률
                deliveryType: 1, // 상품배송종류(정상배송 표준)
                packageDto: { // 포장가격 설정
                    num: '',
                    name: '',
                    status: '0'
                },
                isPackage: false, // 포장가격 설정여부
                listPackage: [], // 포장종류 배렬
                adWords: '', // 광고타이틀1
                adWords2: '', // 광고타이틀2
                goodsUnit: '', // 계량단위
                goodsDesc: '', // 상품소개
                goodsStatus: '0', // 상품내림상태
                isRecommended: false, // 추천상품여부
                offCause: '', // 상품내린 리유
                goodsIconName: '',
                goodsIconUri: imageBack,
                goodsVideo: '', // 상품동영상
                smsStatus: false, // sms전송여부
                isSetDeliveryCompany: false, // 택배회사 설정여부
                deliveryCompany: [], // 배송회사배렬
                deliveryId: '', // 배송회사아이디
                deliveryCode: '', // 배송회사코드
                postageFreeStatus: false, // 무료배송상태값(false:무료배송아님, true:무료배송)
                profitRateFreeStatus: '0', // 무료배송이벤트설정여부
                isProfitRateFreeStatus: false
            },
            rules: {
                goodsName: [{
                    required: true,
                    message: '商品名称是必填项',
                    trigger: 'blur'
                }],
                goodsShortName: [{
                    required: true,
                    message: '拣货名称是必填项',
                    trigger: 'blur'
                }],
                goodsSearchName: [{
                    required: true,
                    message: '商品搜索名称是必填项',
                    trigger: 'blur'
                }],
                rankingNum: [{
                    required: true,
                    message: '序号是必填项',
                    trigger: 'blur'
                }],
                shopName: [{
                    required: true,
                    message: '所属商户是必填项',
                    trigger: 'change'
                }],
                goodsWeight: [{
                    required: true,
                    message: '商品重量是必填项',
                    trigger: 'blur'
                }],
                typeName: [{
                    required: true,
                    message: '所属分类是必填项',
                    trigger: 'change'
                }],
                salesPrice: [{
                    required: true,
                    message: '销售价是必填项',
                    trigger: 'blur'
                }],
                costPrice: [{
                    required: true,
                    message: '供货价是必填项',
                    trigger: 'blur'
                }],
                goodsUnit: [{
                    required: true,
                    message: '计量单位是必填项',
                    trigger: 'change'
                }]
            },
            isShowShopDialog: false, // 점포추가다이얼로그 로출상태
            isShowTagDialog: false, // 키워드추가다이얼로그 로출상태
            isShowTypeDialog: false, // 분류추가다이얼로그 로출상태
            searchShopName: '', // 검색용점포명
            searchTagName: '', // 검색용키워드명
            dataShop: [], // 점포 배렬
            shopPage: 1, // 점포페지수
            shopSize: 10, // 점포로출개수
            totalShop: 0, // 점포총개수
            tempShopName: '',
            dataTag: [], // 키워드 배렬
            tagId: [], // 키워드아이디 배렬
            isTagChecked: false,
            isClicked: false,
            listType: [], // 대분류 배렬
            listSubType: [], // 소분류 배렬
            isOption: 0, // 옵션사용여부
            dataOption: [{ // 옵션상품배렬
                id: undefined, // 상품옵션아이디
                sizeName: '', // 옵션상품명
                originalPrice: '', // 옵션상품원가
                discountPercent: '', // 옵션상품할인률
                isPercent: false, // 옵션상품할인률 사용여부
                salesPrice: '', // 옵션상품판매가
                costPrice: '', // 옵션상품공급가
                sizeWeight: '', // 옵션상품무게
                imgId: undefined, // 옵션상품이미지인덱스
                imgUri: imageBack, // 옵션상품이미지
                imgFile: undefined, // 옵션상품이이지파일
                visualSalesNum: '', // 옵션상품가상판매량
                packageInfo: { // 옵션상품포장정보
                    num: '',
                    name: '',
                    status: '0'
                },
                isPackage: false,
                sizeStatus: '', // 옵션상품상태값
                listPackage: [], // 포장종류 배렬
                visible: true,
                isVisiblePriceToolTip: false
            }],
            optionThumb: { // 썸네일 CSS 정보
                width: '60px',
                height: '60px',
                cursor: 'pointer'
            },
            listDeliveryType: [], // 배송종류배렬
            listUnit: [], // 계량단위 배렬
            goodsProp: [{ // 상품속성내용
                keys: '',
                value: '',
                status: '0',
                visible: true,
                isStatus: false
            }],
            listMainImage: [], // 상품이미지배렬
            delImgs: [], // 삭제된 상품이미지 배렬
            tempTypeId: undefined,
            tempSubTypeId: undefined,
            optionDelData: [], // 삭제된 옵션상품 아이디 배렬
            goodsIcons: [],
            goodsVideoFile: undefined, // 상품동영상파일
            freeShippingRate: 0,
            isFreeShippingStatus: '0',
            isEnableShippingRate: true,
            styles: { // 썸네일 사이즈 스타일
                width: '70px',
                height: '70px',
                cursor: 'pointer'
            }
        }
    },
    methods: {
        setFocusValue(element) {
            if (element.target.id === 'originalPrice') {
                this.dataForm.originalPrice = this.dataForm.originalPrice !== '' ? parseFloat(this.dataForm.originalPrice).toFixed(2) : ''
            }

            if (element.target.id === 'salesPrice') {
                this.dataForm.salesPrice = this.dataForm.salesPrice !== '' ? parseFloat(this.dataForm.salesPrice).toFixed(2) : ''
            }

            if (element.target.id === 'costPrice') {
                this.dataForm.costPrice = this.dataForm.costPrice !== '' ? parseFloat(this.dataForm.costPrice).toFixed(2) : ''
            }

            this.dataOption.filter((res, idx) => {
                if (element.target.id === 'originalPrice-' + idx) {
                    this.dataOption[idx].originalPrice = this.dataOption[idx].originalPrice !== '' ? parseFloat(this.dataOption[idx].originalPrice).toFixed(2) : ''
                }

                if (element.target.id === 'salesPrice-' + idx) {
                    this.dataOption[idx].salesPrice = this.dataOption[idx].salesPrice !== '' ? parseFloat(this.dataOption[idx].salesPrice).toFixed(2) : ''
                }

                if (element.target.id === 'costPrice-' + idx) {
                    this.dataOption[idx].costPrice = this.dataOption[idx].costPrice !== '' ? parseFloat(this.dataOption[idx].costPrice).toFixed(2) : ''
                }
            })
        },
        setFilterValue(element) {
            if (element.target.id === 'goodsName') { // 상품명 길이 50자로 제한
                element.target.value = element.target.value.substr(0, 50)
                this.dataForm.goodsName = element.target.value
            }

            if (element.target.id === 'goodsShortName') { // 선택명 길이 16자로 제한
                element.target.value = element.target.value.substr(0, 21)
                this.dataForm.goodsShortName = element.target.value
            }

            if (element.target.id === 'goodsSearchName') { // 상품검색명 길이 50자로 제한
                element.target.value = element.target.value.substr(0, 50)
                this.dataForm.goodsSearchName = element.target.value
            }

            if (element.target.id === 'searchTagName') { // 키워드 길이 50자로 제한
                element.target.value = element.target.value.substr(0, 20)
                this.searchTagName = element.target.value
            }

            if (element.target.id === 'adWords2') { // 키워드 길이 20자로 제한
                element.target.value = element.target.value.substr(0, 10)
                this.dataForm.adWords2 = element.target.value
            }

            if (element.target.id === 'rankingNum') { // 랭킹번호 수자만 허용
                element.target.value = element.target.value.replace(/[^0-9]/g, '')
                this.dataForm.rankingNum = element.target.value
            }

            if (element.target.id === 'goodsWeight') { // 상품무게(소수점 두자리 제한)
                element.target.value = element.target.value.replace(/[^0-9.]/g, '')
                if (element.target.value.indexOf('.') !== -1) {
                    element.target.value = element.target.value.slice(0, element.target.value.indexOf('.') + 3)
                }

                this.dataForm.goodsWeight = element.target.value
            }

            if (element.target.id === 'originalPrice') { // 원가
                element.target.value = element.target.value.replace(/[^0-9.]/g, '')
                if (element.target.value.indexOf('.') !== -1) {
                    element.target.value = element.target.value.slice(0, element.target.value.indexOf('.') + 3)
                }

                this.dataForm.originalPrice = element.target.value
            }

            if (element.target.id === 'salesPrice') { // 판매가
                element.target.value = element.target.value.replace(/[^0-9.]/g, '')

                if (element.target.value.indexOf('.') !== -1) {
                    element.target.value = element.target.value.slice(0, element.target.value.indexOf('.') + 3)
                }

                this.dataForm.salesPrice = element.target.value
                this.isVisiblePriceToolTip = parseFloat(this.dataForm.costPrice) > parseFloat(this.dataForm.salesPrice)

                if (parseFloat(this.dataForm.costPrice) > parseFloat(this.dataForm.salesPrice) || this.dataForm.costPrice === 0 || this.dataForm.costPrice === '' || this.dataForm.salesPrice === 0 || this.dataForm.salesPrice === '') {
                    this.dataForm.profitRate = 0 + '%'

                    if (this.isFreeShippingStatus === '1') {
                        this.isEnableShippingRate = true
                        this.dataForm.isProfitRateFreeStatus = false
                        this.dataForm.profitRateFreeStatus = '0'
                    }
                } else {
                    this.dataForm.profitRate = ((parseFloat(this.dataForm.salesPrice) - parseFloat(this.dataForm.costPrice)) / parseFloat(this.dataForm.salesPrice) * 100).toFixed(2) + '%'
                    const rate = (parseFloat(this.dataForm.salesPrice) - parseFloat(this.dataForm.costPrice)) / parseFloat(this.dataForm.salesPrice) * 100

                    if (this.isFreeShippingStatus === '1' && parseFloat(this.freeShippingRate) <= rate) {
                        this.isEnableShippingRate = false
                    } else {
                        this.isEnableShippingRate = true
                        this.dataForm.isProfitRateFreeStatus = false
                        this.dataForm.profitRateFreeStatus = '0'
                    }
                }
            }

            if (element.target.id === 'discountPercent') { // 할인률
                element.target.value = element.target.value.replace(/[^0-9.]/g, '')

                if (element.target.value.indexOf('.') !== -1) {
                    element.target.value = element.target.value.slice(0, element.target.value.indexOf('.') + 2)
                }

                this.dataForm.discountPercent = element.target.value

                if (this.dataForm.isPercent) {
                    if (this.dataForm.originalPrice === '') {
                        this.$refs.originalPrice.focus()
                        showToast(this, '请输入原价', 'warning')
                        this.dataForm.discountPercent = ''

                        return
                    }

                    if (this.dataForm.discountPercent !== '') {
                        this.dataForm.salesPrice = parseFloat((this.dataForm.originalPrice * this.dataForm.discountPercent * 10) / 100).toFixed(2)
                    } else {
                        this.dataForm.salesPrice = ''
                    }
                }

                if (this.dataForm.salesPrice !== '') {
                    this.isVisiblePriceToolTip = parseFloat(this.dataForm.costPrice) > parseFloat(this.dataForm.salesPrice)
                }
            }

            if (element.target.id === 'costPrice') { // 공급가
                element.target.value = element.target.value.replace(/[^0-9.]/g, '')

                if (element.target.value.indexOf('.') !== -1) {
                    element.target.value = element.target.value.slice(0, element.target.value.indexOf('.') + 3)
                }

                this.dataForm.costPrice = element.target.value
                this.isVisiblePriceToolTip = parseFloat(this.dataForm.costPrice) > parseFloat(this.dataForm.salesPrice)

                if (parseFloat(this.dataForm.costPrice) > parseFloat(this.dataForm.salesPrice) || this.dataForm.costPrice === 0 || this.dataForm.costPrice === '' || this.dataForm.salesPrice === 0 || this.dataForm.salesPrice === '') {
                    this.dataForm.profitRate = 0 + '%'

                    if (this.isFreeShippingStatus === '1') {
                        this.isEnableShippingRate = true
                        this.dataForm.isProfitRateFreeStatus = false
                        this.dataForm.profitRateFreeStatus = '0'
                    }
                } else {
                    this.dataForm.profitRate = ((parseFloat(this.dataForm.salesPrice) - parseFloat(this.dataForm.costPrice)) / parseFloat(this.dataForm.salesPrice) * 100).toFixed(2) + '%'
                    const rate = (parseFloat(this.dataForm.salesPrice) - parseFloat(this.dataForm.costPrice)) / parseFloat(this.dataForm.salesPrice) * 100

                    if (this.isFreeShippingStatus === '1' && parseFloat(this.freeShippingRate) <= rate) {
                        this.isEnableShippingRate = false
                    } else {
                        this.isEnableShippingRate = true
                        this.dataForm.isProfitRateFreeStatus = false
                        this.dataForm.profitRateFreeStatus = '0'
                    }
                }
            }

            if (element.target.id === 'visualSalesNum') { // 가상판매량
                element.target.value = element.target.value.replace(/[^0-9]/g, '')
                this.dataForm.visualSalesNum = element.target.value
            }

            // 옵션상품 필터링
            this.dataOption.filter((res, idx) => {
                if (element.target.id === 'sizeName-' + idx) {
                    element.target.value = element.target.value.substr(0, 20)
                    this.dataOption[idx].sizeName = element.target.value
                }

                if (element.target.id === 'originalPrice-' + idx) {
                    element.target.value = element.target.value.replace(/[^0-9.]/g, '')
                    if (element.target.value.indexOf('.') !== -1) {
                        element.target.value = element.target.value.slice(0, element.target.value.indexOf('.') + 3)
                    }

                    this.dataOption[idx].originalPrice = element.target.value
                }

                if (element.target.id === 'salesPrice-' + idx) {
                    element.target.value = element.target.value.replace(/[^0-9.]/g, '')
                    if (element.target.value.indexOf('.') !== -1) {
                        element.target.value = element.target.value.slice(0, element.target.value.indexOf('.') + 3)
                    }

                    this.dataOption[idx].salesPrice = element.target.value
                    this.dataOption[idx].isVisiblePriceToolTip = parseFloat(this.dataOption[idx].costPrice) > parseFloat(this.dataOption[idx].salesPrice)
                }

                if (element.target.id === 'discountPercent-' + idx) {
                    element.target.value = element.target.value.replace(/[^0-9.]/g, '')
                    if (element.target.value.indexOf('.') !== -1) {
                        element.target.value = element.target.value.slice(0, element.target.value.indexOf('.') + 2)
                    }

                    this.dataOption[idx].discountPercent = element.target.value

                    if (this.dataOption[idx].isPercent) {
                        if (this.dataOption[idx].originalPrice === '') {
                            this.$refs['originalPrice-' + idx].focus()
                            showToast(this, '请输入原价', 'warning')
                            this.dataOption[idx].discountPercent = ''

                            return
                        }

                        if (this.dataOption[idx].discountPercent !== '') {
                            this.dataOption[idx].salesPrice = parseFloat((this.dataOption[idx].originalPrice * this.dataOption[idx].discountPercent * 10) / 100).toFixed(2)
                        } else {
                            this.dataOption[idx].salesPrice = ''
                        }
                    }

                    if (this.dataOption[idx].salesPrice !== '') {
                        this.dataOption[idx].isVisiblePriceToolTip = parseFloat(this.dataOption[idx].costPrice) > parseFloat(this.dataOption[idx].salesPrice)
                    }
                }

                if (element.target.id === 'costPrice-' + idx) {
                    element.target.value = element.target.value.replace(/[^0-9.]/g, '')
                    if (element.target.value.indexOf('.') !== -1) {
                        element.target.value = element.target.value.slice(0, element.target.value.indexOf('.') + 3)
                    }

                    this.dataOption[idx].costPrice = element.target.value
                    this.dataOption[idx].isVisiblePriceToolTip = parseFloat(this.dataOption[idx].costPrice) > parseFloat(this.dataOption[idx].salesPrice)
                }

                if (element.target.id === 'sizeWeight-' + idx) {
                    element.target.value = element.target.value.replace(/[^0-9.]/g, '')
                    if (element.target.value.indexOf('.') !== -1) {
                        element.target.value = element.target.value.slice(0, element.target.value.indexOf('.') + 3)
                    }

                    this.dataOption[idx].sizeWeight = element.target.value
                }

                if (element.target.id === 'packageNum-' + idx) {
                    element.target.value = element.target.value.replace(/[^0-9]/g, '')
                    this.dataOption[idx].packageInfo.num = element.target.value
                }

                if (element.target.id === 'visualSalesNum-' + idx) {
                    element.target.value = element.target.value.replace(/[^0-9]/g, '')
                    this.dataOption[idx].visualSalesNum = element.target.value
                }
            })

            if (element.target.id === 'packageNumber') {
                element.target.value = element.target.value.replace(/[^0-9]/g, '')
                this.dataForm.packageDto.num = element.target.value
            }
        },
        getFreeShipping() {
            getFreeShipping().then(response => {
                if (response.code === 0) {
                    this.freeShippingRate = response.data.status === '1' ? response.data.profitRate ? response.data.profitRate : 0 : 0
                    this.isFreeShippingStatus = response.data.status
                }
            })
        },
        getGoodsIconData() {
            getGoodsIcon().then(response => {
                if (response.code === 0) {
                    this.goodsIcons = response.data

                    response.data.filter(res => {
                        if (res.code === this.dataForm.goodsIconName) {
                            this.dataForm.goodsIconUri = res.name
                        }
                    })
                }
            })
        },
        setChangeGoodsIcon(element) {
            if (element === '') {
                this.dataForm.goodsIconUri = imageBack
            }

            this.goodsIcons.filter(res => {
                if (element === res.code) {
                    this.dataForm.goodsIconUri = res.name
                }
            })
        },
        getProductData(packages) {
            getProductDetail(this.productid).then(response => {
                if (response.code === 0) {
                    const res = response.data

                    this.dataForm.smsStatus = res.smsStatus === '1'
                    this.dataForm.goodsName = res.goodsName // 상품명
                    this.dataForm.goodsShortName = res.goodsShortName // 선택명
                    this.dataForm.goodsSearchName = res.goodsSearchName // 상품검색명
                    this.dataForm.originalPrice = parseFloat(res.originalPrice).toFixed(2) // 원가
                    this.dataForm.discountPercent = res.discountPercent === 0.0 ? '' : res.discountPercent // 할인률
                    this.dataForm.isPercent = res.discountPercent !== 0.0 // 할인률 사용여부
                    this.dataForm.salesPrice = parseFloat(res.salesPrice).toFixed(2) // 판매가
                    this.dataForm.costPrice = parseFloat(res.costPrice).toFixed(2) // 공급가
                    this.dataForm.profitRate = ((parseFloat(res.salesPrice) - parseFloat(res.costPrice)) / parseFloat(res.salesPrice) * 100).toFixed((2)) + '%'
                    this.dataForm.goodsWeight = parseFloat(res.goodsWeight).toFixed(2) // 상품무게
                    this.dataForm.rankingNum = res.rankingNum // 랭킹번호
                    this.dataForm.goodsUnit = res.goodsUnit // 계량단위
                    this.dataForm.visualSalesNum = res.visualSalesNum === 0 ? '' : res.visualSalesNum // 가상판매량
                    this.dataForm.goodsStatus = res.goodsStatus // 상품내림상태
                    this.dataForm.typeId = res.typeId // 대분류아이디
                    this.dataForm.subTypeId = res.subTypeId // 소분류아이디
                    this.tempTypeId = res.typeId
                    this.tempSubTypeId = res.subTypeId
                    this.dataForm.typeName = res.subTypeName // 분류명
                    this.recommendStatus = res.isRecommended !== '0'
                    this.dataForm.isRecommended = res.isRecommended !== '0'
                    this.dataForm.shopId = res.shopId // 점포아이디
                    this.dataForm.shopName = res.shopName // 점포명
                    this.dataForm.adWords = res.goodsAd // 광고타이틀1
                    this.dataForm.adWords2 = res.goodsAd2 // 광고타이틀2
                    this.dataForm.offCause = res.offCause // 상품내림리유
                    this.dataForm.deliveryType = res.deliveryType // 배송형태
                    this.dataForm.goodsDesc = res.goodsDesc // 상품소개
                    this.dataForm.goodsIconName = res.goodsIconName === null ? '' : res.goodsIconName
                    this.dataForm.goodsVideo = res.goodsVideo === null ? '' : res.goodsVideo
                    this.dataForm.deliveryId = res.deliveryId === 0 ? '' : res.deliveryId
                    this.dataForm.isSetDeliveryCompany = res.deliveryId !== 0
                    this.dataForm.profitRateFreeStatus = res.profitRateFreeStatus ? res.profitRateFreeStatus : '0'
                    this.dataForm.isProfitRateFreeStatus = res.profitRateFreeStatus === '1' ? true : false

                    const rate = (parseFloat(res.salesPrice) - parseFloat(res.costPrice)) / parseFloat(res.salesPrice) * 100

                    if (this.freeShippingRate <= rate) {
                        this.isEnableShippingRate = false
                    } else {
                        this.isEnableShippingRate = true
                    }

                    if (res.postageFreeStatus !== null) {
                        this.dataForm.postageFreeStatus = res.postageFreeStatus === '1'
                    }

                    this.getGoodsIconData()

                    if (res.packageDto !== null) {
                        this.dataForm.packageDto = {
                            num: res.packageDto.num,
                            name: res.packageDto.name,
                            status: res.packageDto.status
                        }
                        this.dataForm.isPackage = res.packageDto.name !== ''
                    }

                    // 메인이미지
                    res.imgs.filter(val => {
                        let value = {
                            id: val.id,
                            imgUri: val.uri,
                            imgFile: undefined,
                            rankingNum: val.rankingNum
                        }

                        this.listMainImage.push(value)
                    })

                    // 키워드
                    if (res.tags !== null) {
                        let value = ''

                        res.tags.filter(val => {
                            this.tagId.push(val.id)
                            value += val.name + ','
                        })
                        this.dataForm.tagName = value.slice(0, value.length - 1)
                    }

                    // 옵션상품
                    if (res.sizes.length !== 0) {
                        this.isOption = 1
                        this.dataOption = []

                        res.sizes.filter((val, index) => {
                            let value = {
                                id: val.id, // 상품옵션아이디
                                sizeName: val.sizeName, // 옵션상품명
                                originalPrice: parseFloat(val.originalPrice).toFixed(2), // 옵션상품원가
                                discountPercent: val.discountPercent === 0.0 || val.discountPercent === 0 ? '' : val.discountPercent, // 옵션상품할인률
                                isPercent: val.discountPercent !== 0.0, // 옵션상품할인률 사용여부
                                salesPrice: parseFloat(val.salesPrice).toFixed(2), // 옵션상품판매가
                                costPrice: parseFloat(val.costPrice).toFixed(2), // 옵션상품공급가
                                sizeWeight: parseFloat(val.sizeWeight).toFixed(2), // 옵션상품무게
                                imgId: undefined, // 옵션상품이미지인덱스
                                imgUri: val.imgUri, // 옵션상품이미지
                                imgFile: undefined, // 옵션상품이이지파일
                                visualSalesNum: val.visualSalesNum === 0 ? '' : val.visualSalesNum, // 옵션상품가상판매량
                                packageInfo: { // 옵션상품포장정보
                                    num: '',
                                    name: '',
                                    status: ''
                                },
                                isPackage: false,
                                sizeStatus: val.sizeStatus, // 옵션상품상태값
                                listPackage: [], // 포장종류 배렬
                                visible: index === res.sizes.length - 1
                            }

                            if (val.packageInfo !== null) {
                                value.packageInfo = {
                                    num: val.packageInfo.num === 0 ? '' : val.packageInfo.num,
                                    name: val.packageInfo.name,
                                    status: val.packageInfo.status
                                }
                                value.isPackage = val.packageInfo.name !== ''
                            }

                            if (packages.code === 0) {
                                if (value.isPackage) {
                                    value.listPackage = packages.data
                                }
                            }

                            this.dataOption.push(value)
                        })
                    }

                    // 상품속성내용
                    if (res.props.length !== 0) {
                        this.goodsProp = []

                        res.props.filter((val, index) => {
                            let value = {
                                keys: val.key,
                                value: val.value,
                                status: val.status,
                                visible: index === res.props.length - 1,
                                isStatus: val.status !== '0'
                            }

                            this.goodsProp.push(value)
                        })
                    }
                }
            })
        },
        getPackageName() { // 포장데이터 얻기
            return new Promise((resolve, reject) => {
                getPackageNameData().then(response => {
                    resolve(response)
                }).catch(error => {
                    reject(error)
                })
            })
        },
        getRandKeyData() { // 이미지용 랜덤키 얻기
            return new Promise((resolve, reject) => {
                getRandKey().then(response => {
                    resolve(response)
                }).catch(error => {
                    reject(error)
                })
            })
        },
        setUploadImageData(key, data) { // 이미지업로드
            return new Promise((resolve, reject) => {
                setUploadImage(key, data).then(response => {
                    resolve(response)
                }).catch(error => {
                    reject(error)
                })
            })
        },
        setUploadVideoData(data) { // 동영상업로드
            return new Promise((resolve, reject) => {
                setUploadVideo(data).then(response => {
                    resolve(response)
                }).catch(error => {
                    reject(error)
                })
            })
        },
        checkExist() { // 상품중복여부 얻기
            return new Promise((resolve, reject) => {
                existProduct(encodeURIComponent(this.dataForm.goodsName), this.dataForm.shopId, this.productid).then(response => {
                    resolve(response)
                }).catch(error => {
                    reject(error)
                })
            })
        },
        async openMessageBox(msg) { // 메시지다이얼로그 async/await 처리
            try {
                await MessageBox.confirm(msg, '信息', {
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    type: 'warning'
                })

                return true
            } catch (e) {
                return false
            }
        },
        async setChangeEnableSetDeliveryCompany(e) {
            if (e && this.dataForm.postageFreeStatus) {
                const isSuccess = await this.openMessageBox('选择该项,需要取消免运费属性。')

                if (!isSuccess) {
                    this.dataForm.isSetDeliveryCompany = false
                    return
                }

                this.dataForm.postageFreeStatus = false
            }

            this.dataForm.deliveryId = ''
        },
        async setChangeFreeStatus(e) {
            if (e && this.dataForm.isSetDeliveryCompany) {
                const isSuccess = await this.openMessageBox('选择该项,需要取消指定快递属性。')

                if (!isSuccess) {
                    this.dataForm.postageFreeStatus = false
                    return
                }

                this.dataForm.isSetDeliveryCompany = false
                this.dataForm.deliveryId = ''
            }

            this.dataForm.isPackage = false
            this.dataForm.packageDto.num = ''
            this.dataForm.packageDto.name = ''
        },
        getDeliveryCompany() {
            getAllDeliveryCompany().then(response => {
                if (response.code === 0) {
                    this.dataForm.deliveryCompany = response.data
                }
            })
        },
        getDeliveryType() { // 배송종류 얻기
            getPackageTypeData().then(response => {
                if (response.code === 0) {
                    this.listDeliveryType = response.data
                }
            })
        },
        getUnit() { // 계량단위 얻기
            getUnitData().then(response => {
                if (response.code === 0) {
                    this.listUnit = response.data
                }
            })
        },
        getShop() { // 점포 얻기
            let temp = []
            this.listLoading = true
            const query = {
                shopName: this.searchShopName.trim(),
                page: this.shopPage,
                size: this.shopSize
            }

            getShopData(query).then(response => {
                if (response.code === 0) {
                    if (response.data.list.length !== 0) {
                        this.shopPage = response.data.page
                        this.shopSize = response.data.size
                        this.totalShop = response.data.totalNum

                        response.data.list.filter(value => {
                            let val = {
                                checked: this.dataForm.shopId === value.id ? value.id : 0,
                                id: value.id,
                                shopStatus: value.shopStatus,
                                shopName: value.shopName,
                                shopType: value.shopType,
                                shopSubType: value.shopSubType
                            }

                            temp.push(val)
                        })
                    }

                    this.dataShop = temp
                }

                this.listLoading = false
            })
        },
        setSearchShop() { // 점포검색
            this.shopPage = 1
            this.getShop()
        },
        setShopRow(row) { // 점포선택
            this.dataForm.shopId = row.id
            this.tempShopName = row.shopName

            this.dataShop.filter(res => {
                res.checked = res.id === row.id ? 1 : 0
            })
        },
        setAddShop() { // 점포 추가
            let isChecked = false
            this.dataShop.filter(res => {
                if (res.checked !== 0) {
                    isChecked = true
                }
            })

            if (!isChecked) {
                showToast(this, '请选择新增商户', 'warning')
                return
            }

            this.dataForm.shopName = this.tempShopName
            this.tempShopName = ''
            this.isShowShopDialog = false
        },
        setShowShopDialog() { // 점포다이얼로그 로출
            this.isShowShopDialog = true
            this.searchShopName = ''
            this.getShop()
        },
        setCancelDialog() { // 다이얼로그 닫기
            this.isShowShopDialog = false
            this.isShowTagDialog = false
        },
        setCanceTypeDialog() { // 분류추가다이얼로그 닫기
            this.isShowTypeDialog = false

            this.dataForm.typeId = this.tempTypeId
            this.dataForm.subTypeId = this.tempSubTypeId
            this.dataForm.isRecommended = this.recommendStatus
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

                            if (this.searchTagName !== '') {
                                if (res.tagInfo.search(this.searchTagName) !== -1) {
                                    this.dataTag.push(val)
                                }
                            } else {
                                this.tagId.filter(value => {
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

            const isSuccess = await this.openMessageBox('确认要保存吗?')

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
            this.tagId = []

            this.dataTag.filter(res => {
                if (res.checked) {
                    isChecked = true
                    this.tagId.push(res.id)
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
        getCategoryData() {
            this.listType = []
            this.listSubType = []

            getCategories().then(response => {
                if (response.code === 0) {
                    if (response.data.list.length !== 0) {
                        response.data.list.filter(res => {
                            if (res.isShow === '1') {
                                this.listType.push(res)
                            }
                        })
                    }

                    if (this.listType.length !== 0) {
                        this.listType.filter(res => {
                            if (res.id === this.dataForm.typeId) {
                                this.listSubType = res.subs
                            }

                            if (this.dataForm.typeId === '') {
                                this.listSubType = []
                            }
                        })
                    }
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
        setAddType() {
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
            this.recommendStatus = this.dataForm.isRecommended

            this.isShowTypeDialog = false
        },
        setChangePercent() { // 할인률 사용/미사용
            this.dataForm.salesPrice = ''
            this.dataForm.discountPercent = ''
        },
        setChangeOptionPercent(row) { // 옵션상품 할인률 사용/미사용
            row.salesPrice = ''
            row.discountPercent = ''
        },
        async setChangeOptionPackage(row) { // 옵션상품 포장값 사용/미사용
            row.packageInfo.name = ''
            row.packageInfo.num = ''

            if (row.isPackage) {
                const response = await this.getPackageName()

                if (response.code === 0) {
                    row.listPackage = response.data
                }
            }
        },
        setPriviewOptionImage(index) { // 옵션상품 이미지를 위한 파일 브라우저 열기
            this.$refs['imageInput-' + index].click()
        },
        setChangeOptionImage(row, index) { // 옵션상품 이미지 미리보기
            if (this.$refs['imageInput-' + index].files && this.$refs['imageInput-' + index].files[0]) {
                let files = this.$refs['imageInput-' + index].files
                if (files[0].type !== 'image/jpeg') {
                    showToast(this, '只允许上传 JPEG等格式', 'warning')
                    return
                }

                if (files[0].size > 204800) {
                    showToast(this, '图片大小不能大于200KB', 'warning')
                    return
                }

                row.imgUri = URL.createObjectURL(files[0])
                row.imgId = index + 1
                row.imgFile = files[0]
            }
        },
        setAddOptionProduct(row, index) { // 옵션상품추가
            if (row.imgId === undefined && row.imgUri.search('data:image/png;base64') !== -1) { // 옵션상품이미지가 없으면 경고
                showToast(this, '请上传规格商品图片', 'warning')
                return
            }

            if (row.sizeName.trim() === '') { // 옵션상품명이 없으면 경고
                this.$refs['sizeName-' + index].focus()
                showToast(this, '请输入规格商品名称', 'warning')
                return
            }

            if (row.salesPrice === '') { // 옵션상품원가가 없으면 경고
                this.$refs['salesPrice-' + index].focus()
                showToast(this, '请输入规格商品销售价', 'warning')
                return
            }

            if (row.costPrice === '') { // 옵션상품원가가 없으면 경고
                this.$refs['costPrice-' + index].focus()
                showToast(this, '请输入规格商品供货价', 'warning')
                return
            }

            if (row.sizeWeight === '') { // 옵션상품원가가 없으면 경고
                this.$refs['sizeWeight-' + index].focus()
                showToast(this, '请输入规格商品重量', 'warning')
                return
            }

            if (row.isPackage) { // 옵션상품원가가 없으면 경고
                if (row.packageInfo.num === '') {
                    this.$refs['packageNum-' + index].focus()
                    showToast(this, '请输入规格商品包装个', 'warning')
                    return
                }

                if (row.packageInfo.name === '') {
                    showToast(this, '请选择规格商品包装类', 'warning')
                    return
                }
            }

            const option = {
                id: undefined,
                sizeName: '', // 옵션상품명
                originalPrice: '', // 옵션상품원가
                discountPercent: '', // 옵션상품할인률
                isPercent: false, // 옵션상품할인률 사용여부
                salesPrice: '', // 옵션상품판매가
                costPrice: '', // 옵션상품공급가
                sizeWeight: '', // 옵션상품무게
                imgId: undefined, // 옵션상품이미지인덱스
                imgUri: imageBack, // 옵션상품이미지
                imgFile: undefined, // 옵션상품이이지파일
                visualSalesNum: '', // 옵션상품가상판매량
                packageInfo: { // 옵션상품포장정보
                    num: '',
                    name: '',
                    status: '0'
                },
                isPackage: false,
                sizeStatus: '', // 옵션상품상태값
                listPackage: [], // 포장종류 배렬
                visible: true
            }

            row.visible = false
            this.dataOption.push(option)
        },
        setDeleteOptionProduct(row, index) { // 옵션상품삭제
            this.dataOption.splice(index, 1)

            if (row.id !== undefined) {
                this.optionDelData.push(row.id)
            }

            let idx = 0
            if (index > 0) {
                if (index === this.dataOption.length) {
                    idx = index - 1
                    this.dataOption[idx].visible = true
                }
            }

            if (index === 0 && this.dataOption.length === 0) {
                const option = {
                    id: undefined,
                    sizeName: '', // 옵션상품명
                    originalPrice: '', // 옵션상품원가
                    discountPercent: '', // 옵션상품할인률
                    isPercent: false, // 옵션상품할인률 사용여부
                    salesPrice: '', // 옵션상품판매가
                    costPrice: '', // 옵션상품공급가
                    sizeWeight: '', // 옵션상품무게
                    imgId: undefined, // 옵션상품이미지인덱스
                    imgUri: imageBack, // 옵션상품이미지
                    imgFile: undefined, // 옵션상품이이지파일
                    visualSalesNum: '', // 옵션상품가상판매량
                    packageInfo: { // 옵션상품포장정보
                        num: '',
                        name: '',
                        status: '0'
                    },
                    isPackage: false,
                    sizeStatus: '', // 옵션상품상태값
                    listPackage: [], // 포장종류 배렬
                    visible: true
                }

                this.dataOption.push(option)
            }
        },
        async setChangeProductPackage() {
            this.dataForm.packageDto.num = ''
            this.dataForm.packageDto.name = ''
        },
        setAddGoodsProp(item, index) { // 상품속성내용 추가
            if (item.keys.trim() === '') {
                this.$refs['key-' + index][0].focus()
                showToast(this, '请输入属性名称', 'warning')
                return
            }

            if (item.value.trim() === '') {
                this.$refs['value-' + index][0].focus()
                showToast(this, '请输入属性值', 'warning')
                return
            }

            const val = {
                keys: '',
                value: '',
                status: '0',
                visible: true,
                isStatus: false
            }
            item.visible = false

            this.goodsProp.push(val)
        },
        setDeleteGoodsProp(item, index) { // 상품속성내용 삭제
            this.goodsProp.splice(index, 1)

            let idx = 0
            if (index > 0) {
                if (index === this.goodsProp.length) {
                    idx = index - 1
                    this.goodsProp[idx].visible = true
                }
            }

            if (index === 0 && this.goodsProp.length === 0) {
                const val = {
                    keys: '',
                    value: '',
                    status: '0',
                    visible: true,
                    isStatus: false
                }
                this.goodsProp.push(val)
            }
        },
        setPriviewMainVideo() { // 메인동영상 추가를 위한 파일브라우저 열기
            this.$refs.mainvideo.click()
        },
        setPriviewMainImage() { // 메인이미지 추가를 위한 파일브라우저 열기
            this.$refs.mainimage.click()
        },
        setChangeMainVideo(input) {
            if (input.target.files && input.target.files[0]) {
                const files = input.target.files

                for (let i = 0; i < files.length; i++) {
                    if (files[i].type !== 'video/mp4') {
                        showToast(this, '只允许上传 MP4等格式', 'warning')
                        return
                    }

                    // if (files[i].size > 1024000) {
                    //   showToast(this, '图片大小不能大于1M', 'warning')
                    //   return
                    // }

                    this.dataForm.goodsVideo = URL.createObjectURL(files[0])
                    this.goodsVideoFile = files[0]
                }
            }
        },
        setChangeMainImage(input) {
            if (input.target.files && input.target.files[0]) {
                const files = input.target.files

                if (files.length > 5) {
                    showToast(this, '图片最多上传5张', 'warning')
                    return
                }

                for (let i = 0; i < files.length; i++) {
                    if (files[i].type !== 'image/jpeg') {
                        showToast(this, '只允许上传 JPEG等格式', 'warning')
                        break
                    }

                    if (files[i].size > 204800) {
                        showToast(this, '图片大小不能大于200KB', 'warning')
                        return
                    }

                    if (this.listMainImage.length === 5) {
                        showToast(this, '图片最多上传5张', 'warning')
                        return
                    }

                    const value = {
                        id: undefined,
                        imgUri: URL.createObjectURL(files[i]),
                        imgFile: files[i],
                        rankingNum: undefined
                    }
                    this.listMainImage.push(value)
                }
            }
        },
        setSort() { // 메인이미지 위치 바꾸기
            const el = this.$refs.dragElement
            this.sortable = Sortable.create(el, {
                onEnd: evt => {
                    // 메인이미지 변경된 위치로 배렬을 다시 정리
                    const oldimage = this.listMainImage.splice(evt.oldIndex, 1)[0] // 이전 위치의 이미지 배렬값
                    this.listMainImage.splice(evt.newIndex, 0, oldimage) // 새로 배치된 이미지 위치 배렬
                }
            })
        },
        async setUpdate() { // 상품 수정하기
            if (this.isClicked) {
                return
            }

            // 상품명이 없으면
            if (this.dataForm.goodsName.trim() === '') {
                this.$refs.goodsName.focus()
                showToast(this, '请输入商品名称', 'warning')
                return
            }

            // 선택명이 없으면
            if (this.dataForm.goodsShortName.trim() === '') {
                this.$refs.goodsShortName.focus()
                showToast(this, '请输入拣货名称', 'warning')
                return
            }

            // 상품검색명이 없으면
            if (this.dataForm.goodsSearchName.trim() === '') {
                this.$refs.goodsSearchName.focus()
                showToast(this, '请输入商品搜索名称', 'warning')
                return
            }

            // 랭킹번호가 없으면
            if (this.dataForm.rankingNum === '') {
                this.$refs.rankingNum.focus()
                showToast(this, '请输入序号', 'warning')
                return
            }

            // 점포를 추가하지 않았다면
            if (this.dataForm.shopId === undefined) {
                this.$refs.shopName.focus()
                showToast(this, '请选择新增商户', 'warning')
                return
            }

            // 카테고리를 추가하지 않았다면
            if (this.dataForm.typeName === '') {
                this.$refs.typeName.focus()
                showToast(this, '请选择绑定分类', 'warning')
                return
            }

            // 상품무게가 없다면
            if (this.dataForm.goodsWeight === '' || this.dataForm.goodsWeight === '0' || this.dataForm.goodsWeight === '0.0' || this.dataForm.goodsWeight === '0.00') {
                this.$refs.goodsWeight.focus()
                showToast(this, '请输入商品重量', 'warning')
                return
            }

            // 할인률이 존재하면
            if (this.dataForm.discountPercent !== '') {
                if (parseFloat(this.dataForm.discountPercent) < 0.1 || parseFloat(this.dataForm.discountPercent) > 9.9) {
                    this.$refs.discountPercent.focus()
                    showToast(this, '请输入准确折扣比例', 'warning')
                    return
                }
            }

            // 판매가가 없다면
            if (this.dataForm.salesPrice === '') {
                this.$refs.salesPrice.focus()
                showToast(this, '请输入销售价', 'warning')
                return
            }

            // 공급가가 없다면
            if (this.dataForm.costPrice === '') {
                this.$refs.costPrice.focus()
                showToast(this, '请输入供货价', 'warning')
                return
            }

            // 원가가 판매가와 공급가보다 작으면
            if (this.dataForm.originalPrice !== '' && this.dataForm.originalPrice !== '0.00') {
                if (parseFloat(this.dataForm.originalPrice) <= parseFloat(this.dataForm.salesPrice) || parseFloat(this.dataForm.originalPrice) <= parseFloat(this.dataForm.costPrice)) {
                    this.$refs.originalPrice.focus()
                    showToast(this, '原价不能低于销售价', 'warning')
                    return
                }
            }

            // 택배회사지정이면
            if (this.dataForm.isSetDeliveryCompany && this.dataForm.deliveryId === '') {
                showToast(this, '请选择快递公司', 'warning')
                return
            }

            // 옵션상품 체크
            let optionAddData = [] // 옵션상품추가배렬
            let optionUpdateData = [] // 이미있는 옵션상품수정배렬
            let optionAddForm = new FormData()
            let optionUpdateForm = new FormData()
            let updateImageId = [] // 이미 있는 옵션상품의 이미지 수졍을 위해 옵션상품아이디 보관배렬

            if (this.isOption === 1) { // 옵션상품사용이면
                for (let i = 0; i < this.dataOption.length; i++) {
                    if (this.dataOption[i].imgFile === undefined && this.dataOption[i].imgUri.search('data:image/png;base64') !== -1) {
                        showToast(this, '请上传规格商品图片', 'warning')
                        return
                    }

                    if (this.dataOption[i].sizeName.trim() === '') {
                        this.$refs['sizeName-' + i].focus()
                        showToast(this, '请输入规格商品名称', 'warning')
                        return
                    }

                    if (this.dataOption[i].salesPrice === '') {
                        this.$refs['salesPrice-' + i].focus()
                        showToast(this, '请输入规格销售价', 'warning')
                        return
                    }

                    if (this.dataOption[i].costPrice === '') {
                        this.$refs['costPrice-' + i].focus()
                        showToast(this, '请输入规格供货价', 'warning')
                        return
                    }

                    if (this.dataOption[i].originalPrice !== '' && this.dataOption[i].originalPrice !== '0.00') {
                        if (parseFloat(this.dataOption[i].originalPrice) <= parseFloat(this.dataOption[i].salesPrice) || parseFloat(this.dataOption[i].originalPrice) <= parseFloat(this.dataOption[i].costPrice)) {
                            this.$refs['originalPrice-' + i].focus()
                            showToast(this, '原价不能低于销售价', 'warning')
                            return
                        }
                    }

                    if (this.dataOption[i].sizeWeight === '' || this.dataOption[i].sizeWeight === '0' || this.dataOption[i].sizeWeight === '0.0' || this.dataOption[i].sizeWeight === '0.00') {
                        this.$refs['sizeWeight-' + i].focus()
                        showToast(this, '请输入规格重量', 'warning')
                        return
                    }

                    if (this.dataOption[i].isPackage) {
                        if (this.dataOption[i].packageInfo.num === '') {
                            this.$refs['packageNum-' + i].focus()
                            showToast(this, '请输入规格包装个', 'warning')
                            return
                        }

                        if (this.dataOption[i].packageInfo.name === '') {
                            showToast(this, '请选择规格包装类别', 'warning')
                            return
                        }
                    }
                }

                this.dataOption.filter((res, index) => {
                    if (res.discountPercent !== '') {
                        if (parseFloat(res.discountPercent) < 0.1 || parseFloat(res.discountPercent) > 9.9) {
                            this.$refs['discountPercent-' + index].focus()
                            showToast(this, '请输入准确折扣比例', 'warning')
                            return
                        }
                    }

                    let value = {
                        id: res.id,
                        sizeName: res.sizeName,
                        originalPrice: res.originalPrice !== '' ? parseFloat(res.originalPrice) : 0,
                        discountPercent: res.discountPercent === '' ? 0 : parseFloat(res.discountPercent),
                        salesPrice: parseFloat(res.salesPrice),
                        costPrice: parseFloat(res.costPrice),
                        sizeWeight: parseFloat(res.sizeWeight),
                        imgId: undefined,
                        visualSalesNum: res.visualSalesNum === '' ? 0 : res.visualSalesNum,
                        packageInfo: {
                            num: res.packageInfo.num === '' ? 0 : parseInt(res.packageInfo.num),
                            name: res.packageInfo.name,
                            status: res.isPackage === true ? '1' : '0'
                        },
                        sizeStatus: '1'
                    }

                    if (res.id === undefined) { // 옵션상품 새로 추가
                        optionAddData.push(value)
                        optionAddForm.append('file', res.imgFile)
                    } else { // 이전에 등록된 옵션상품 수정
                        if (res.imgFile !== undefined) {
                            optionUpdateForm.append('file', res.imgFile)
                            updateImageId.push(res.id)
                        }

                        optionUpdateData.push(value)
                    }
                })
            }

            if (this.isOption === 0) { // 옵션상품 미사용이면
                this.optionDelData = []

                this.dataOption.filter(res => {
                    if (res.id !== undefined) {
                        this.optionDelData.push(parseInt(res.id))
                    }
                })
            }

            // 포장비 허용이면
            if (this.dataForm.isPackage) {
                if (this.dataForm.packageDto.num === '') {
                    this.$refs.packageNumber.focus()
                    showToast(this, '请输入包装个', 'warning')
                    return
                }

                if (this.dataForm.packageDto.name === '') {
                    showToast(this, '请选择包装类别', 'warning')
                    return
                }
            }

            // 계량단위가 없다면
            if (this.dataForm.goodsUnit === '') {
                showToast(this, '请选择计量单位', 'warning')
                return
            }

            // 상품속성설명 체크
            let goodsProps = []

            for (let i = 0; i < this.goodsProp.length; i++) {
                if (this.goodsProp[i].isStatus) {
                    if (this.goodsProp[i].keys === '') {
                        this.$refs['key-' + i][0].focus()
                        showToast(this, '请输入属性名称', 'warning')
                        return
                    }

                    if (this.goodsProp[i].value === '') {
                        this.$refs['value-' + i][0].focus()
                        showToast(this, '请输入属性值', 'warning')
                        return
                    }
                }
            }

            this.goodsProp.filter(res => {
                let value = {
                    key: res.keys,
                    value: res.value,
                    status: res.isStatus === true ? '1' : '0'
                }

                goodsProps.push(value)
            })

            // 상품메인이미지 없다면
            if (this.listMainImage.length === 0) {
                showToast(this, '请上传商品图片', 'warning')
                return
            }

            const isSuccess = await this.openMessageBox('确认要保存吗?')

            if (!isSuccess) {
                return
            }

            // 등록상품 중복 체크
            const exist = await this.checkExist()

            if (exist.code !== 200) { // 중복상품이면 수정 불가
                return
            }

            // 이미지용 랜덤키 얻기
            const randKeys = await this.getRandKeyData()
            let randKey = ''

            if (randKeys.code === 0) {
                randKey = randKeys.data.name
            } else {
                return
            }

            const query = {
                smsStatus: this.dataForm.smsStatus === true ? '1' : '0',
                goodsName: this.dataForm.goodsName,
                goodsShortName: this.dataForm.goodsShortName,
                goodsSearchName: this.dataForm.goodsSearchName,
                rankingNum: this.dataForm.rankingNum,
                shopId: this.dataForm.shopId,
                tags: this.tagId,
                originalPrice: this.dataForm.originalPrice !== '' ? parseFloat(this.dataForm.originalPrice) : 0,
                discountPercent: this.dataForm.discountPercent === '' ? 0 : parseFloat(this.dataForm.discountPercent),
                salesPrice: parseFloat(this.dataForm.salesPrice),
                costPrice: parseFloat(this.dataForm.costPrice),
                goodsWeight: parseFloat(this.dataForm.goodsWeight),
                typeId: parseInt(this.dataForm.typeId),
                subTypeId: parseInt(this.dataForm.subTypeId),
                isRecommended: this.dataForm.isRecommended === true ? '1' : '0',
                visualSalesNum: this.dataForm.visualSalesNum === '' ? 0 : parseInt(this.dataForm.visualSalesNum),
                goodsUnit: this.dataForm.goodsUnit,
                adWords: this.dataForm.adWords,
                adWords2: this.dataForm.adWords2,
                goodsDesc: this.dataForm.goodsDesc,
                deliveryType: parseInt(this.dataForm.deliveryType),
                addImgs: [],
                delImgs: this.delImgs,
                rankingImgs: [],
                props: goodsProps,
                addSizes: optionAddData,
                updateSizes: optionUpdateData,
                delSizes: this.optionDelData,
                packageDto: {
                    num: this.dataForm.packageDto.num === '' ? 0 : parseInt(this.dataForm.packageDto.num),
                    name: this.dataForm.packageDto.name,
                    status: this.dataForm.isPackage === true ? '1' : '0'
                },
                randKey: randKey,
                goodsIconName: this.dataForm.goodsIconName,
                goodsVideo: '',
                deliveryId: parseInt(this.dataForm.deliveryId),
                postageFreeStatus: this.dataForm.postageFreeStatus ? '1' : '0',
                profitRateFreeStatus: this.dataForm.isProfitRateFreeStatus ? '1' : '0'
            }

            this.isClicked = true

            if (this.goodsVideoFile !== undefined) {
                let videoForm = new FormData()
                videoForm.append('file', this.goodsVideoFile)
                const videoUrl = await setUploadVideo(videoForm)

                if (videoUrl.code === 0) {
                    query.goodsVideo = videoUrl.data.uri
                }
            } else {
                query.goodsVideo = this.dataForm.goodsVideo
            }

            if (optionAddForm.get('file') !== null) { // 옵션상품이미지 추가가 있다면
                const optionAddImage = await this.setUploadImageData(randKey, optionAddForm)

                if (optionAddImage.code === 0) {
                    optionAddImage.data.filter((res, index) => {
                        optionAddData[index].imgId = res
                    })

                    query.addSizes = optionAddData
                } else {
                    this.isClicked = false
                    return
                }
            }

            if (optionUpdateForm.get('file') !== null) { // 옵션상품이미지 수정이 있다면
                const optionUpdateImage = await this.setUploadImageData(randKey, optionUpdateForm)

                if (optionUpdateImage.code === 0) {
                    optionUpdateImage.data.filter((res, index) => {
                        optionUpdateData.filter((val, idx) => {
                            if (val.id === updateImageId[index]) {
                                optionUpdateData[idx].imgId = res
                            }
                        })
                    })

                    query.updateSizes = optionUpdateData
                } else {
                    this.isClicked = false
                    return
                }
            }

            let rankImages = []
            let addImages = []
            let mainForm = new FormData()

            this.listMainImage.filter((res, index) => {
                rankImages[index] = {
                    id: res.id,
                    rankingNum: index + 1
                }

                if (res.imgFile !== undefined) {
                    mainForm.append('file', res.imgFile)
                    let val = {
                        id: index,
                        rankingNum: index + 1
                    }
                    addImages.push(val)
                }
            })

            if (mainForm.get('file') !== null) {
                const mainImage = await this.setUploadImageData(randKey, mainForm)

                if (mainImage.code === 0) {
                    let images = []
                    mainImage.data.filter((res, index) => {
                        images[index] = {
                            id: res,
                            rankingNum: addImages[index].rankingNum
                        }

                        rankImages[addImages[index].id].id = res
                    })

                    query.addImgs = images
                } else {
                    this.isClicked = false
                    return
                }
            }

            query.rankingImgs = rankImages

            setUpdateProduct(this.productid, query).then(response => {
                if (response === '') {
                    showToast(this, '操作成功', 'success')
                    this.$router.push({
                        path: '/product/product_list'
                    })
                }

                this.isClicked = false
            })
        }
    }
}