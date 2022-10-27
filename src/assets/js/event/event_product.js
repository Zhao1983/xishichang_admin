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
    getProduct,
    getProductDetail
} from '@/api/product' // 상품데이터 API 추가

import {
    getEventProduct
} from '@/api/event' // 상품데이터 API 추가

export default {
    name: 'Event_product',
    components: {},
    created() {
        setClearGoodsSearchField()
        setClearGoodsBatchSearchField()
        setClearShopSearchField()
        setClearShopBatchField()
        setClearOrderSearchField()

        this.eventid = this.$route.params && this.$route.params.id // 해당 이벤트 아이디
    },
    mounted() {
        window.addEventListener('keyup', this.setFilterValue)
        window.addEventListener('focusout', this.setFocusValue)
    },
    data() {
        return {
            eventid: undefined, // 이벤트아이디
            listLoading: false,
            isClicked: false,
            isShowProductDlg: false, // 이벤트상품다이얼로그 로출상태
            searchProdName: '', // 검색용이벤트상품명
            dataProduct: [], // 상품배렬
            totalProd: 0, // 총상품수
            prodPage: 1, // 상품페지수
            prodSize: 10, // 한페지에 로출되는 상품수
            isCheckProd: false, // 상품선택상태
            listEventProduct: [],
            tempEventProduct: []
        }
    },
    methods: {
        setFocusValue(element) {
            for (let i = 0; i < this.listEventProduct.length; i++) {
                if (element.target.id === 'sale-price-' + i) { // 상품가격(소수점 두자리로 제한)
                    element.target.value = element.target.value !== '' ? parseFloat(element.target.value).toFixed(2) : ''
                    this.listEventProduct[i].salesPrice = element.target.value
                }
            }
        },
        setFilterValue(element) {
            for (let i = 0; i < this.listEventProduct.length; i++) {
                if (element.target.id === 'sale-price-' + i) { // 상품가격(소수점 두자리로 제한)
                    element.target.value = element.target.value.replace(/[^0-9.]/g, '')

                    if (element.target.value.indexOf('.') !== -1) {
                        element.target.value = element.target.value.slice(0, element.target.value.indexOf('.') + 3)
                    }

                    this.listEventProduct[i].salesPrice = element.target.value
                }

                if (element.target.id === 'rankNumber-' + i) { // 상품가격(소수점 두자리로 제한)
                    element.target.value = element.target.value.replace(/[^0-9]/g, '')
                    this.listEventProduct[i].rankingNum = element.target.value
                }
            }
        },
        getEventProductData() {
            this.listLoading = true

            getEventProduct(this.eventid).then(response => {
                if (response.code === 0) {
                    if (response.data.list.length !== 0) {
                        response.data.list.filter(res => {
                            let value = {}

                            this.listEventProduct.push(value)
                        })
                    }
                }

                this.listLoading = false
            })
        },
        setSearchProduct() { // 상품검색
            this.prodPage = 1
            this.getProductData()
        },
        setSelectProduct(row) { // 상품선택하기
            this.tempEventProduct = []

            getProductDetail(row.id).then(response => {
                if (response.code === 0) {
                    let value = {
                        goodsId: response.data.id,
                        uri: response.data.imgs[0].uri,
                        goodsName: response.data.goodsName,
                        originalPrice: response.data.originalPrice,
                        salesPrice: '',
                        rankingNum: ''
                    }

                    this.tempEventProduct.push(value)
                }
            })
        },
        getProductData() { // 상품들 얻기
            this.listLoading = true

            const query = {
                goodsName: this.searchProdName.trim(),
                page: this.prodPage,
                size: this.prodSize
            }

            getProduct(query).then(response => {
                if (response.code === 0) {
                    this.prodPage = response.data.page
                    this.prodSize = response.data.size
                    this.totalProd = response.data.totalNum
                    this.dataProduct = response.data.list
                }
            })

            this.listLoading = false
        },
        setShowProductDlg() { // 상품추가다이얼로그 로출
            this.searchProdName = ''
            this.isCheckProd = false
            this.isShowProductDlg = true
            this.getProductData()
        },
        setCancelDlg() { // 상품추가다이얼로그 닫기
            this.isShowProductDlg = false
            this.isCheckProd = false
        },
        setAddProduct() { // 이벤트상품추가
            this.isShowProductDlg = false
            let isExist = false

            if (this.tempEventProduct.length === 0) {
                return
            }

            this.listEventProduct.filter(res => {
                if (res.goodsId === this.tempEventProduct[0].goodsId) {
                    isExist = true
                }
            })

            if (!isExist) {
                this.listEventProduct.push(this.tempEventProduct[0])
            }
        },
        setDeleteProduct(index) { // 상품삭제
            this.listEventProduct.splice(index, 1)
        },
        setOpenMainImage() { // 이벤트 메인 이미지 파일브라우저 열기
            this.$refs.coverImgUri.click()
        },
        setPreviewMainImage(input) { // 이벤트 메인이미지 미리보기 설정
            // 파일이 존재한다면
            if (input.target.files && input.target.files[0]) {
                const files = input.target.files // 파일 얻기
                    // 파일 개수만큼 순환 진행
                for (let i = 0; i < files.length; i++) {
                    // 이미지 형식 조건 따지기
                    if (files[i].type !== 'image/jpeg' && files[i].type !== 'image/png' && files[i].type !== 'image/gif') {
                        showToast(this, '只允许上传 JPEG, PNG, GIF等格式', 'warning')
                        return
                    }

                    if (files[i].size > 204800) {
                        showToast(this, '图片大小不能大于200KB', 'warning')
                        return
                    }

                    this.dataForm.coverImgUri = URL.createObjectURL(files[0])
                    this.dataForm.coverImgFile = files[0] // 업로드용 이미지 파일 담기
                }
            }
        },
        setOpenSubImage() { // 이벤트 서브이미지 파일브라우저 열기
            this.$refs.topImgUri.click()
        },
        setPreviewSubImage(input) { // 이벤트 서브이미지 미리보기 설정
            // 파일이 존재한다면
            if (input.target.files && input.target.files[0]) {
                const files = input.target.files // 파일 얻기
                    // 파일 개수만큼 순환 진행
                for (let i = 0; i < files.length; i++) {
                    // 이미지 형식 조건 따지기
                    if (files[i].type !== 'image/jpeg' && files[i].type !== 'image/png' && files[i].type !== 'image/gif') {
                        showToast(this, '只允许上传 JPEG, PNG, GIF等格式', 'warning')
                        return
                    }

                    if (files[i].size > 204800) {
                        showToast(this, '图片大小不能大于200KB', 'warning')
                        return
                    }

                    this.dataForm.topImgUri = URL.createObjectURL(files[0])
                    this.dataForm.topImgFile = files[0] // 업로드용 이미지 파일 담기
                    this.isShowImageCancel = true
                }
            }
        },
        setCancelSubImage() { // 이벤트 서브이미지 삭제
            this.isShowImageCancel = false
            this.dataForm.topImgUri = imageBack
            this.dataForm.topImgFile = undefined
        },
        setUploadMainImageData(data) { // 메인이미지 업로드
            return new Promise((resolve, reject) => {
                setUploadMainImage(data).then(response => {
                    resolve(response)
                }).catch(error => {
                    reject(error)
                })
            })
        },
        setUploadSubImageData(data) { // 서브이미지 업로드
            return new Promise((resolve, reject) => {
                setUploadSubImage(data).then(response => {
                    resolve(response)
                }).catch(error => {
                    reject(error)
                })
            })
        },
        compareImageName(value) {
            return value.includes('data:image/png;base64')
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
        }
    }
}