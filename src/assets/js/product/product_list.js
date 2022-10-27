import Pagination from '@/components/Pagination' // 페이징 콘퍼넨트 추가
import elDragDialog from '@/directive/el-drag-dialog'
import settings from '@/settings'

import {
    MessageBox
} from 'element-ui' // 메세지다이얼로그 추가

import {
    getProduct,
    setUpdateStatus,
    setUploadExcelFile
} from '@/api/product' // 상품카테고리 API 추가

import {
    getCategories
} from '@/api/category' // 상품카테고리 API 추가

import {
    getCookieData,
    setCookieData,
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

export default {
    name: 'Product_list',
    components: {
        Pagination
    },
    created() {
        setClearGoodsBatchSearchField()
        setClearShopSearchField()
        setClearShopBatchField()
        setClearOrderSearchField()

        this.getCategoryData()
        this.getProductData()
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
            isShowStatusDialog: false, // 내림상태리유다이얼로그 로출 상태
            listCategory: [], // 대카테고리
            listSubCategory: [], // 소카테고리
            typeId: getCookieData('product_typeid') === 'undefined' ? undefined : parseInt(getCookieData('product_typeid')), // 대카티고리아이디
            subTypeId: getCookieData('product_subtypeid') === 'undefined' ? undefined : parseInt(getCookieData('product_subtypeid')), // 소카테고리아이디
            goodsName: getCookieData('product_goodsname'), // 상품명
            shopName: getCookieData('product_shopname'), // 점포명
            shopId: '', // 점포아이디
            status: getCookieData('product_status'), // 상품상태(검색용)
            deliveryType: getCookieData('product_deliverytype') === 'undefined' ? undefined : parseInt(getCookieData('product_deliverytype')), // 배송상태
            orderType: undefined, // 정렬형식
            page: parseInt(getCookieData('product_list_page')), // 테블페지수
            size: parseInt(getCookieData('product_list_size')), // 테블행수
            totalNumber: 0, // 상품총개수
            productList: [], // 상품배렬
            offCause: '', // 내림상태리유 내용
            prodId: undefined, // 상품아이디
            prodStatus: '', // 상품상태
            profitRateFreeStatus: getCookieData('delivery_event_status')
        }
    },
    methods: {
        getCategoryData() { // API에서 카테고리 얻기
            getCategories().then(response => {
                if (response.code === 0) {
                    this.listCategory = response.data.list
                }
            })
        },
        getProductData() { // 등록된 전체 상품 얻기
            const query = {
                goodsName: this.goodsName.trim(),
                shopId: this.shopId,
                shopName: this.shopName.trim(),
                typeId: this.typeId,
                subTypeId: this.subTypeId,
                status: this.status,
                deliveryType: this.deliveryType,
                orderType: this.orderType,
                profitRateFreeStatus: this.profitRateFreeStatus,
                page: parseInt(this.page),
                size: parseInt(this.size)
            }

            this.listLoading = true

            getProduct(query).then(response => {
                if (response.code === 0) {
                    this.productList = response.data.list
                    this.totalNumber = response.data.totalNum
                    this.page = response.data.page
                    this.size = response.data.size

                    setCookieData('product_list_page', this.page)
                }

                this.listLoading = false
            })
        },
        setChangeCategory() { // 대카테고리에 따르는 소카테고리 얻기
            this.listSubCategory = []
            this.subTypeId = undefined

            this.listCategory.filter(res => {
                if (res.id === this.typeId) {
                    this.listSubCategory = res.subs
                }

                if (this.typeId === '') {
                    this.listSubCategory = []
                }
            })
        },
        setSortChange(data) { // 테블 정렬할 때 호출되는 함수
            if (data.order === 'ascending') { // 올림차순
                if (data.prop === 'shopName') { // 점포명
                    this.orderType = 1
                }

                if (data.prop === 'typeName') { // 분류명
                    this.orderType = 3
                }

                if (data.prop === 'originalPrice') { // 원가
                    this.orderType = 5
                }

                if (data.prop === 'salesPrice') { // 판매가
                    this.orderType = 7
                }

                if (data.prop === 'costPrice') { // 이전판매가
                    this.orderType = 9
                }

                if (data.prop === 'deliveryType') { // 배송형태
                    this.orderType = 11
                }

                if (data.prop === 'clickNum') { // 조회순
                    this.orderType = 13
                }

                if (data.prop === 'salesNum') { // 판매수
                    this.orderType = 15
                }

                if (data.prop === 'goodsStatus') { // 상품상태
                    this.orderType = 17
                }

                if (data.prop === 'profitInfo') { // 리윤가격
                    this.orderType = 19
                }

                if (data.prop === 'profitRate') { // 리윤률
                    this.orderType = 21
                }
            }

            if (data.order === 'descending') { // 내림차순
                if (data.prop === 'shopName') {
                    this.orderType = 2
                }

                if (data.prop === 'typeName') { // 점포명
                    this.orderType = 4
                }

                if (data.prop === 'originalPrice') { // 원가
                    this.orderType = 6
                }

                if (data.prop === 'salesPrice') { // 판매가
                    this.orderType = 8
                }

                if (data.prop === 'costPrice') { // 이전판매가
                    this.orderType = 10
                }

                if (data.prop === 'deliveryType') { // 배송형태
                    this.orderType = 12
                }

                if (data.prop === 'clickNum') { // 조회순
                    this.orderType = 14
                }

                if (data.prop === 'salesNum') { // 판매수
                    this.orderType = 16
                }

                if (data.prop === 'goodsStatus') { // 상품상태
                    this.orderType = 18
                }

                if (data.prop === 'profitInfo') { // 리윤가격
                    this.orderType = 20
                }

                if (data.prop === 'profitRate') { // 리윤률
                    this.orderType = 22
                }
            }

            if (data.order !== null) {
                this.getProductData()
            }
        },
        setSearchData() { // 상품검색
            this.page = 1
            this.getProductData()

            setCookieData('product_typeid', this.typeId)
            setCookieData('product_subtypeid', this.subTypeId)
            setCookieData('product_goodsname', this.goodsName.trim())
            setCookieData('product_shopname', this.shopName.trim())
            setCookieData('product_status', this.status)
            setCookieData('delivery_event_status', this.profitRateFreeStatus)
            setCookieData('product_deliverytype', this.deliveryType)
            setCookieData('product_list_size', this.size)
        },
        setStatusProduct(productid, status, prodname) { // 상품상태 설정(올림/내림)
            this.offCause = ''
            this.prodId = productid
            this.prodStatus = status

            if (status === '0') {
                MessageBox.confirm(prodname + '商品是否要下架?', '信息', {
                    confirmButtonText: '是',
                    cancelButtonText: '否',
                    type: 'warning'
                }).then(() => {
                    this.setShowStatusDialog()
                }).catch(() => {

                })
            } else {
                this.setUpdateProductStatus()
            }
        },
        setCancelDialog() { // 상품상태다이얼로그 닫기
            this.isShowStatusDialog = false
        },
        setShowStatusDialog() { // 상품상태다이얼로그 로출
            this.isShowStatusDialog = true
        },
        setUpdateProductStatus() { // 상품상태 업데이트
            if (this.prodStatus === '0') {
                // 리유가 없으면
                if (this.offCause === '') {
                    this.$refs.offCause.focus()
                    showToast(this, '请输入理由', 'warning')
                    return
                }

                this.isShowStatusDialog = false
            }

            const query = {
                status: this.prodStatus,
                offCause: this.offCause
            }

            setUpdateStatus(this.prodId, query).then(response => {
                if (response === '') {
                    showToast(this, '操作成功', 'success')
                    this.getProductData()
                }
            })
        },
        setClickExcelFile() {
            this.$refs.excel.click()
        },
        setAddUploadFile(input) { // 엑셀템플릿파일 추가
            // 파일이 존재한다면
            if (input.target.files && input.target.files[0]) {
                const files = input.target.files // 파일 얻기
                for (let i = 0; i < files.length; i++) {
                    if (!files[i].name.includes('goods_template')) {
                        showToast(this, '上传失败', 'error')
                        return
                    }

                    let data = new FormData()
                    data.append('file', files[0])

                    setUploadExcelFile(data).then(response => {
                        if (response.code === 0) {
                            showToast(this, '操作成功', 'success')
                        }
                    })
                }
            }
        },
        setDownloadExcelFile() { // 엑셀템플릿파일 다운로드
            let link = document.createElement('a')
            link.href = settings.DOWNLOAD_URL + 'goods_template.xlsx'
            link.setAttribute('download', 'goods_template.xlsx')

            document.body.appendChild(link)
            link.click()
        }
    }
}