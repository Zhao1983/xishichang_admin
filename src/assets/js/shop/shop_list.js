import Pagination from '@/components/Pagination' // 페이징 콘퍼넨트 추가
import elDragDialog from '@/directive/el-drag-dialog'

import {
    getShopData,
    setShopStatus
} from '@/api/shop' // 점포 데이터 API 추가

import {
    getCategories
} from '@/api/category' // 상품카테고리 API 추가

import {
    MessageBox
} from 'element-ui' // 메세지다이얼로그 추가

import {
    getCookieData,
    setCookieData,
    setClearGoodsSearchField,
    setClearGoodsBatchSearchField,
    setClearShopBatchField,
    setClearOrderSearchField
} from '@/utils/auth' // 쿠키설정

import {
    showToast,
    setAddCommaTwo,
    setAddComma
} from '@/utils/' // 토스트 설정

export default {
    name: 'Shop_list',
    components: {
        Pagination
    },
    created() {
        setClearGoodsSearchField()
        setClearGoodsBatchSearchField()
        setClearShopBatchField()
        setClearOrderSearchField()

        this.getCategoryData()
        this.getShop()
    },
    mounted() {

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
            listLoading: false,
            shopName: getCookieData('shop_name'), // 점포명
            shopOwner: getCookieData('shop_owner'), // 점포운영자명
            shopStatus: getCookieData('shop_status'), // 점포상태(검색용 올림/내림)
            typeId: getCookieData('shop_typeid') === 'undefined' ? undefined : parseInt(getCookieData('shop_typeid')), // 대분류아이디
            subTypeId: getCookieData('shop_subtypeid') === 'undefined' ? undefined : parseInt(getCookieData('shop_subtypeid')), // 소분류아이디
            orderType: undefined, // 정렬형식
            page: parseInt(getCookieData('shop_page')), // 테블페지수
            size: parseInt(getCookieData('shop_size')), // 테블행수
            totalNumber: 0, // 점포총개수
            shopData: [], // 점포배렬
            listType: [], // 대분류배렬
            listSubType: [], //소분류배렬
            offCause: '', // 내림상태리유 내용
            statusShop: undefined, // 점포상태
            isShowStatusDialog: false, // 내림상태리유다이얼로그 로출 상태
            shopId: undefined // 점포아이디
        }
    },
    methods: {
        getCategoryData() { // API에서 카테고리 얻기
            getCategories().then(response => {
                if (response.code === 0) {
                    this.listType = response.data.list
                }
            })
        },
        setChangeCategory() { // 대카테고리에 따르는 소카테고리 얻기
            this.listSubType = []
            this.subTypeId = undefined

            this.listType.filter(res => {
                if (res.id === this.typeId) {
                    this.listSubType = res.subs
                }

                if (this.typeId === '') {
                    this.listSubType = []
                }
            })
        },
        getShop() {
            const query = {
                shopName: this.shopName.trim(),
                shopOwner: this.shopOwner.trim(),
                shopStatus: this.shopStatus,
                typeId: this.typeId,
                subTypeId: this.subTypeId,
                orderType: this.orderType,
                page: parseInt(this.page),
                size: parseInt(this.size)
            }

            getShopData(query).then(response => {
                this.listLoading = true

                if (response.code === 0) {
                    this.shopData = response.data.list
                    this.totalNumber = response.data.totalNum
                    this.page = response.data.page
                    this.size = response.data.size
                    setCookieData('shop_page', this.page)
                }

                this.listLoading = false
            })
        },
        setSearchData() { // 상품검색
            this.page = 1
            this.getShop()

            setCookieData('shop_typeid', this.typeId)
            setCookieData('shop_subtypeid', this.subTypeId)
            setCookieData('shop_status', this.shopStatus)
            setCookieData('shop_name', this.shopName.trim())
            setCookieData('shop_owner', this.shopOwner.trim())
            setCookieData('shop_size', this.size)
        },
        setSortChange(data) { // 테블 정렬할 때 호출되는 함수
            if (data.order === 'ascending') { // 올림차순
                if (data.prop === 'goodsTotalNum') { // 점포에 포함되여있는 상품총수
                    this.orderType = 1
                }

                if (data.prop === 'shopType') { // 대분류/소분류
                    this.orderType = 3
                }

                if (data.prop === 'salesNum') { // 점포상품판매수
                    this.orderType = 5
                }

                if (data.prop === 'rankingNum') { // 점포랭킹번호
                    this.orderType = 7
                }

                if (data.prop === 'clickNum') { // 점포조회수
                    this.orderType = 9
                }
            }

            if (data.order === 'descending') { // 내림차순
                if (data.prop === 'goodsTotalNum') { // 점포에 포함되여있는 상품총수
                    this.orderType = 2
                }

                if (data.prop === 'shopType') { // 대분류/소분류
                    this.orderType = 4
                }

                if (data.prop === 'salesNum') { // 점포상품판매수
                    this.orderType = 6
                }

                if (data.prop === 'rankingNum') { // 점포랭킹번호
                    this.orderType = 8
                }

                if (data.prop === 'clickNum') { // 점포조회수
                    this.orderType = 10
                }
            }

            if (data.order !== null) {
                this.getShop()
            }
        },
        setStatusShop(shopid, status, shopName) { // 점포상태다이얼로그 로출
            this.offCause = ''
            this.shopId = shopid
            this.statusShop = status

            if (status === '0') {
                MessageBox.confirm(shopName + '商户是否要下架?', '信息', {
                    confirmButtonText: '是',
                    cancelButtonText: '否',
                    type: 'warning'
                }).then(() => {
                    this.setShowStatusDialog()
                }).catch(() => {

                })
            } else {
                this.setUpdateShopStatus()
            }
        },
        setCancelDialog() { // 점포상태다이얼로그 닫기
            this.isShowStatusDialog = false
        },
        setShowStatusDialog() { // 점포상태다이얼로그 로출
            this.isShowStatusDialog = true
        },
        setUpdateShopStatus() { // 점포상태 업데이트
            if (this.statusShop === '0') {
                // 리유가 없으면
                if (this.offCause === '') {
                    this.$refs.offCause.focus()
                    showToast(this, '请输入理由', 'warning')
                    return
                }

                this.isShowStatusDialog = false
            }

            const query = {
                status: this.statusShop,
                offCause: this.offCause
            }

            setShopStatus(this.shopId, query).then(response => {
                if (response === '') {
                    showToast(this, '操作成功', 'success')
                    this.getShop()
                }
            })
        }
    }
}