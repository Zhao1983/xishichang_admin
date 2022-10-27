import Pagination from '@/components/Pagination' // 페이징 콘퍼넨트 추가
import elDragDialog from '@/directive/el-drag-dialog'
import Sortable from 'sortablejs'

import {
    getShopInfo
} from '@/api/shop' // 점포 데이터 API 추가

import {
    getProduct,
    batchUpdateProduct,
    setUpdateStatus,
    getGoodsIcon
} from '@/api/product' // 상품 데이터 API 추가

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
    setClearOrderSearchField
} from '@/utils/auth' // 쿠키설정

import {
    showToast,
    setAddCommaTwo,
    setAddComma
} from '@/utils/' // 토스트 설정

export default {
    name: 'Batch_shop',
    components: {
        Pagination
    },
    created() {
        setClearGoodsSearchField()
        setClearGoodsBatchSearchField()
        setClearOrderSearchField()

        this.shopId = parseInt(this.$route.params && this.$route.params.id)

        this.getGoodsIconData()
        this.getShopInfoData()
        this.getCategoryData()
        this.getProductData()
    },
    mounted() {
        window.addEventListener('keyup', this.setFilterValue)
        window.addEventListener('focusout', this.setFocusValue)
    },
    filters: {
        addCommaTwo(data) { // 3자리수마다 콤마 추가
            return setAddCommaTwo(data)
        },
        addComma(value) {
            return setAddComma(value)
        }
    },
    directives: {
        elDragDialog
    },
    data() {
        return {
            listLoading: false,
            isShowStatusDialog: false, // 내림상태리유다이얼로그 로출 상태
            shopId: 0, // 점포아이디
            goodsName: '', // 상품명
            shopName: '', // 점포명
            typeId: undefined, // 대카티고리아이디
            subTypeId: undefined, // 소카테고리아이디
            status: '', // 상품상태(검색용)
            deliveryType: undefined, // 배송상태
            orderType: undefined, // 정렬형식
            page: parseInt(getCookieData('shop_batch_page')), // 테블페지수
            size: parseInt(getCookieData('shop_batch_size')), // 테블행수
            totalNumber: 0, // 상품총개수
            listCategory: [], // 대카테고리
            listSubCategory: [], // 소카테고리
            productList: [], // 상품배렬
            shopOwner: '', // 점포운영자명
            phoneNum: '', // 점포운영자폰번호
            newGoodsData: [],
            oldGoodsData: [],
            isClicked: false,
            addGoodsData: [],
            offCause: '', // 내림상태리유 내용
            prodId: 0, // 상품아이디
            prodStatus: '', // 상품상태
            goodsIcons: []
        }
    },
    methods: {
        setFilterValue(element) {
            this.productList.filter((res, idx) => {
                if (element.target.id === 'goodsName-' + idx) {
                    element.target.value = element.target.value.substr(0, 50)
                    this.productList[idx].goodsName = element.target.value

                    if (this.addGoodsData.length !== 0) {
                        this.addGoodsData.filter((val, iii) => {
                            if (val.id === res.id) {
                                this.addGoodsData[iii].goodsName = element.target.value
                            }
                        })
                    }
                }

                if (element.target.id === 'goodsShortName-' + idx) {
                    element.target.value = element.target.value.substr(0, 21)
                    this.productList[idx].goodsShortName = element.target.value

                    if (this.addGoodsData.length !== 0) {
                        this.addGoodsData.filter((val, iii) => {
                            if (val.id === res.id) {
                                this.addGoodsData[iii].goodsShortName = element.target.value
                            }
                        })
                    }
                }

                if (element.target.id === 'originalPrice-' + idx) {
                    element.target.value = element.target.value.replace(/[^0-9.]/g, '')

                    if (element.target.value.indexOf('.') !== -1) {
                        element.target.value = element.target.value.slice(0, element.target.value.indexOf('.') + 3)
                    }

                    this.productList[idx].originalPrice = element.target.value

                    if (this.addGoodsData.length !== 0) {
                        this.addGoodsData.filter((val, iii) => {
                            if (val.id === res.id) {
                                this.addGoodsData[iii].originalPrice = element.target.value !== '' ? parseFloat(element.target.value) : ''
                            }
                        })
                    }
                }

                if (element.target.id === 'costPrice-' + idx) {
                    element.target.value = element.target.value.replace(/[^0-9.]/g, '')

                    if (element.target.value.indexOf('.') !== -1) {
                        element.target.value = element.target.value.slice(0, element.target.value.indexOf('.') + 3)
                    }

                    this.productList[idx].costPrice = element.target.value
                    this.productList[idx].isVisibleCostPriceToolTip = parseFloat(this.productList[idx].costPrice) > parseFloat(this.productList[idx].salesPrice)

                    if (this.addGoodsData.length !== 0) {
                        this.addGoodsData.filter((val, iii) => {
                            if (val.id === res.id) {
                                this.addGoodsData[iii].costPrice = element.target.value !== '' ? parseFloat(element.target.value) : ''
                            }
                        })
                    }
                }

                if (element.target.id === 'goodsWeight-' + idx) {
                    element.target.value = element.target.value.replace(/[^0-9.]/g, '')

                    if (element.target.value.indexOf('.') !== -1) {
                        element.target.value = element.target.value.slice(0, element.target.value.indexOf('.') + 3)
                    }

                    this.productList[idx].goodsWeight = element.target.value

                    if (this.addGoodsData.length !== 0) {
                        this.addGoodsData.filter((val, iii) => {
                            if (val.id === res.id) {
                                this.addGoodsData[iii].goodsWeight = element.target.value !== '' ? parseFloat(element.target.value) : ''
                            }
                        })
                    }
                }

                if (element.target.id === 'rankingNum-' + idx) {
                    element.target.value = element.target.value.replace(/[^0-9]/g, '')
                    this.productList[idx].rankingNum = element.target.value

                    if (this.addGoodsData.length !== 0) {
                        this.addGoodsData.filter((val, iii) => {
                            if (val.id === res.id) {
                                this.addGoodsData[iii].rankingNum = element.target.value !== '' ? parseInt(element.target.value) : ''
                            }
                        })
                    }
                }
            })
        },
        setFocusValue(element) {
            this.productList.filter((res, idx) => {
                if (element.target.id === 'originalPrice-' + idx) {
                    this.productList[idx].originalPrice = this.productList[idx].originalPrice !== '' ? parseFloat(this.productList[idx].originalPrice).toFixed(2) : ''
                }

                if (element.target.id === 'costPrice-' + idx) {
                    this.productList[idx].costPrice = this.productList[idx].costPrice !== '' ? parseFloat(this.productList[idx].costPrice).toFixed(2) : ''
                }

                if (element.target.id === 'goodsWeight-' + idx) {
                    this.productList[idx].goodsWeight = this.productList[idx].goodsWeight !== '' ? parseFloat(this.productList[idx].goodsWeight).toFixed(2) : ''
                }
            })
        },
        setChangeGoodsIcon(index, value) {
            this.addGoodsData[index].goodsIconName = value
        },
        setChangeRecommended() {
            this.productList.filter(res => {
                if (this.addGoodsData.length !== 0) {
                    this.addGoodsData.filter((val, iii) => {
                        if (val.id === res.id) {
                            this.addGoodsData[iii].isRecommended = res.isRecommended === true ? '1' : '0'
                        }
                    })
                }
            })
        },
        getGoodsIconData() {
            getGoodsIcon().then(response => {
                if (response.code === 0) {
                    this.goodsIcons = response.data
                }
            })
        },
        getCategoryData() { // API에서 카테고리 얻기
            getCategories().then(response => {
                if (response.code === 0) {
                    this.listCategory = response.data.list
                }
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
        getShopInfoData() { // 점포정보 얻기
            getShopInfo(this.shopId).then(response => {
                if (response.code === 0) {
                    this.shopName = response.data.shopName
                    this.shopOwner = response.data.shopOwner
                    this.phoneNum = response.data.phoneNum
                }
            })
        },
        getProductData() { // 점포에 등록된 전체 상품 얻기
            const query = {
                goodsName: this.goodsName.trim(),
                shopId: this.shopId,
                shopName: this.shopName.trim(),
                typeId: this.typeId,
                subTypeId: this.subTypeId,
                status: this.status,
                deliveryType: this.deliveryType,
                orderType: this.orderType,
                page: parseInt(this.page),
                size: parseInt(this.size)
            }

            this.listLoading = true

            getProduct(query).then(response => {
                if (response.code === 0) {
                    this.totalNumber = response.data.totalNum
                    this.page = response.data.page
                    this.size = response.data.size
                    let tempProduct = []

                    setCookieData('shop_batch_page', this.page)
                    setCookieData('shop_batch_size', this.size)

                    if (response.data.list.length !== 0) {
                        response.data.list.filter(res => {
                            let value = {
                                id: res.id,
                                goodsName: res.goodsName,
                                goodsShortName: res.goodsShortName,
                                shopName: res.shopName,
                                goodsImg: res.goodsImg,
                                isRecommended: res.isRecommended === '1',
                                typeName: res.typeName,
                                subTypeName: res.subTypeName,
                                originalPrice: parseFloat(res.originalPrice).toFixed(2),
                                salesPrice: parseFloat(res.salesPrice).toFixed(2),
                                costPrice: parseFloat(res.costPrice).toFixed(2),
                                goodsWeight: parseFloat(res.goodsWeight).toFixed(2),
                                profitInfo: parseFloat(res.profitInfo).toFixed(2),
                                profitRate: parseFloat(res.profitRate).toFixed(),
                                visualSalesNum: res.visualSalesNum,
                                goodsStatus: res.goodsStatus,
                                clickNum: res.clickNum,
                                salesNum: res.salesNum,
                                rankingNum: res.rankingNum,
                                packageName: res.packageName,
                                deliveryType: res.deliveryType,
                                sizeStatus: res.sizeStatus,
                                isVisibleCostPriceToolTip: false,
                                goodsIconName: res.goodsIconName === null ? '' : res.goodsIconName
                            }

                            tempProduct.push(value)
                        })

                        this.productList = tempProduct
                    }

                    this.oldGoodsData = response.data.list.map(v => v.id)
                    this.newGoodsData = this.oldGoodsData.slice()
                }

                this.listLoading = false
            })
        },
        setSearchData() { // 상품검색
            this.page = 1
            this.getProductData()
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
        handleSelectionChange(row) { // 테블체크박스 선택
            this.addGoodsData = []

            row.filter(res => {
                let value = {
                    id: res.id,
                    goodsName: res.goodsName,
                    goodsShortName: res.goodsShortName,
                    originalPrice: res.originalPrice !== '' ? parseFloat(res.originalPrice) : '',
                    costPrice: res.costPrice !== '' ? parseFloat(res.costPrice) : '',
                    goodsWeight: res.goodsWeight !== '' ? parseFloat(res.goodsWeight) : '',
                    rankingNum: res.rankingNum !== '' ? parseInt(res.rankingNum) : '',
                    goodsIconName: res.goodsIconName,
                    isRecommended: res.isRecommended === true ? '1' : '0'
                }

                this.addGoodsData.push(value)
            })
        },
        setSortGoodsData() { // 상품순서 정렬
            const el = this.$refs.dragTable.$el.querySelectorAll('.el-table__body-wrapper > table > tbody')[0]
            this.sortable = Sortable.create(el, {
                ghostClass: 'sortable-ghost',
                setData: function(dataTransfer) {
                    dataTransfer.setData('Text', '')
                },
                onEnd: evt => {
                    const targetRow = this.productList.splice(evt.oldIndex, 1)[0]
                    this.productList.splice(evt.newIndex, 0, targetRow)

                    const tempIndex = this.newGoodsData.splice(evt.oldIndex, 1)[0]
                    this.newGoodsData.splice(evt.newIndex, 0, tempIndex)
                }
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
        async setBatchData() {
            let isEmpty = false

            if (this.isClicked) {
                return
            }

            if (this.addGoodsData.length === 0) {
                showToast(this, '请选择商品', 'warning')
                return
            }

            this.addGoodsData.filter(res => {
                this.productList.filter((val, idx) => {
                    if (res.id === val.id) {
                        if (val.goodsName === '') {
                            this.$refs['goodsName-' + idx].focus()
                            showToast(this, '请输入商品名称', 'warning')
                            isEmpty = true
                        }

                        if (val.goodsShortName === '') {
                            this.$refs['goodsShortName-' + idx].focus()
                            showToast(this, '请输入拣货名称', 'warning')
                            isEmpty = true
                        }

                        if (val.originalPrice === '') {
                            this.$refs['originalPrice-' + idx].focus()
                            showToast(this, '请输入原价', 'warning')
                            isEmpty = true
                        }

                        if (val.costPrice === '') {
                            this.$refs['costPrice-' + idx].focus()
                            showToast(this, '请输入供货价', 'warning')
                            isEmpty = true
                        }

                        if (val.goodsWeight === '') {
                            this.$refs['goodsWeight-' + idx].focus()
                            showToast(this, '请输入商品重量', 'warning')
                            isEmpty = true
                        }

                        if (val.rankingNum === '') {
                            this.$refs['rankingNum-' + idx].focus()
                            showToast(this, '请输入序号', 'warning')
                            isEmpty = true
                        }
                    }
                })
            })

            if (isEmpty) {
                return
            }

            const isSuccess = await this.openMessageBox()

            if (!isSuccess) {
                return
            }

            batchUpdateProduct(this.shopId, this.addGoodsData).then(response => {
                if (response === '') {
                    showToast(this, '操作成功', 'success')
                    this.getProductData()
                }
            })
        }
    }
}