import Pagination from '@/components/Pagination'
import Thumbnail from '@/components/ImageItem/single_image' // 이벤트메인이미지 컴포넨트 추가
import elDragDialog from '@/directive/el-drag-dialog'

import imageBack from '@/assets/images/review_image_back.png' // 썸네일 백그라운드 이미지 추가

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
    getDelivery,
    setUploadMainImage,
    setUploadSubImage,
    setRegisterEventData
} from '@/api/event' // 이벤트 데이터 API 추가

export default {
    name: 'Event_register',
    components: {
        Pagination,
        Thumbnail
    },
    created() {
        setClearGoodsSearchField()
        setClearGoodsBatchSearchField()
        setClearShopSearchField()
        setClearShopBatchField()
        setClearOrderSearchField()

        this.getDeliveryData()
    },
    mounted() {
        window.addEventListener('keyup', this.setFilterValue)
        window.addEventListener('focusout', this.setFocusValue)
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
            isClicked: false,
            listLoading: false,
            listDelivery: [], // 배송방식 배렬
            styles: { // 썸네일 사이즈 스타일
                width: '150px',
                height: '150px',
                cursor: 'pointer'
            },
            isShowImageCancel: false,
            isShowProductDlg: false, // 이벤트상품다이얼로그 로출상태
            searchProdName: '', // 검색용이벤트상품명
            dataProduct: [], // 상품배렬
            isCheckProd: false, // 상품선택상태
            totalProd: 0, // 총상품수
            prodPage: 1, // 상품페지수
            prodSize: 10, // 한페지에 로출되는 상품수
            listEventProduct: [],
            tempEventProduct: [],
            dataForm: {
                eventName: '', // 이벤트명
                coverImgUri: imageBack, // 이벤트 메인이미지
                topImgUri: imageBack, // 이벤트 서브이미지
                coverImgFile: undefined, // 이벤트 메인이미지파일
                topImgFile: undefined, // 이벤트 서브이미지파일
                rankingNum: undefined, // 이벤트 랭킹번호
                beginDt: '', // 이벤트 시작날자
                endDt: '', // 이벤트 마감날자
                deliveryType: undefined, // 이벤트상품배송방식
                eventStatus: '0', // 이벤트상태
                eventGoods: [] // 이벤트상품배렬
            },
            rules: {
                eventName: [{
                    required: true,
                    message: '活动名称是必填项',
                    trigger: 'blur'
                }],
                rankingNum: [{
                    required: true,
                    message: '序号是必填项',
                    trigger: 'blur'
                }],
                coverImgUri: [{
                    required: true,
                    message: '活动首页图片是必填项',
                    trigger: 'blur'
                }]
            }
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
            if (element.target.id === 'eventName') {
                element.target.value = element.target.value.trim().substr(0, 20)
                this.dataForm.eventName = element.target.value
            }

            if (element.target.id === 'rankingNum') {
                element.target.value = element.target.value.replace(/[^0-9]/g, '')
                this.dataForm.rankingNum = element.target.value
            }

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
        setChangeDate() {
            const startdate = this.$moment(this.dataForm.beginDt).format('YYYY-MM-DD').split('-')
            const lastdate = this.$moment(this.dataForm.endDt).format('YYYY-MM-DD').split('-')
            const start = new Date(startdate[0], parseInt(startdate[1]) - 1, startdate[2])
            const last = new Date(lastdate[0], parseInt(lastdate[1]) - 1, lastdate[2])
            if (start > last) {
                this.dataForm.endDt = this.dataForm.beginDt
            }
        },
        getDeliveryData() { // 배송방식 얻기
            getDelivery().then(response => {
                if (response.code === 0) {
                    this.listDelivery = response.data
                }
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
        },
        async setRegister() {
            if (this.isClicked) {
                return
            }

            // 이벤트명이 없으면
            if (this.dataForm.eventName.trim() === '') {
                this.$refs.eventName.focus()
                showToast(this, '请输入活动名称', 'warning')
                return
            }

            // 랭킹번호가 없으면
            if (this.dataForm.rankingNum === '') {
                this.$refs.rankingNum.focus()
                showToast(this, '请输入序号', 'warning')
                return
            }

            // 이벤트이미지가 없으면
            if (this.dataForm.coverImgFile === undefined) {
                showToast(this, '请上传活动首页图片', 'warning')
                return
            }

            // 이벤트상품을 추가할 때 속성값들이 다 있는지 체크
            let validate = false
            this.listEventProduct.filter(value => {
                if (value.rankingNum === '' || value.salesPrice === '') {
                    validate = true
                }
            })

            if (validate) {
                showToast(this, '请输入活动价格或序号', 'warning')
                return
            }

            let validate_compare = false
            this.listEventProduct.filter(value => {
                if (parseFloat(value.originalPrice < parseFloat(value.salesPrice))) {
                    validate_compare = true
                }
            })

            if (validate_compare) {
                showToast(this, '活动价格必须小于商品原价', 'warning')
                return
            }

            const isSuccess = await this.openMessageBox()

            if (!isSuccess) {
                return
            }

            this.isClicked = true

            let eventGoods = []

            this.listEventProduct.filter(res => {
                let value = {
                    goodsId: res.goodsId,
                    salesPrice: parseFloat(res.salesPrice),
                    rankingNum: parseInt(res.rankingNum)
                }

                eventGoods.push(value)
            })

            let mainForm = new FormData()
            let subForm = new FormData()

            mainForm.append('file', this.dataForm.coverImgFile)
            const main = await this.setUploadMainImageData(mainForm)

            let mainUri = ''

            if (main.code === 0) {
                mainUri = main.data.uri
            } else {
                this.isClicked = false
                return
            }

            let subUri = ''
            if (this.dataForm.topImgFile !== undefined) {
                subForm.append('file', this.dataForm.topImgFile)

                const sub = await this.setUploadSubImageData(subForm)

                if (sub.code === 0) {
                    subUri = sub.data.uri
                } else {
                    this.isClicked = false
                    return
                }
            }

            const query = {
                eventName: this.dataForm.eventName,
                coverImgUri: mainUri,
                topImgUri: subUri,
                rankingNum: parseInt(this.dataForm.rankingNum),
                beginDt: this.dataForm.beginDt === '' ? '' : this.$moment(this.dataForm.beginDt).format('YYYY-MM-DD'),
                endDt: this.dataForm.endDt === '' ? '' : this.$moment(this.dataForm.endDt).format('YYYY-MM-DD'),
                deliveryType: this.dataForm.deliveryType === undefined ? 0 : this.dataForm.deliveryType,
                eventStatus: this.dataForm.eventStatus,
                eventGoods: eventGoods
            }

            setRegisterEventData(query).then(response => {
                if (response.code === 0) {
                    showToast(this, '操作成功', 'success')
                    this.$router.push({
                        path: '/event/event_list'
                    })
                }

                this.isClicked = false
            })
        }
    }
}