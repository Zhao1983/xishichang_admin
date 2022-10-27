import Pagination from '@/components/Pagination'
import Thumbnail from '@/components/ImageItem/single_image' // 이미지 컴포넨트 추가
import elDragDialog from '@/directive/el-drag-dialog'

import imageBack from '@/assets/images/review_image_back.png' // 썸네일 백그라운드 이미지 추가
import { MessageBox } from 'element-ui' // 메세지다이얼로그 추가
import { getAdvertDetailData, getAdvertKind, setUpdateAdvert, setUploadImage } from '@/api/advert' // 광고용 API 추가(광고이미지, 관련링크, 광고추가)
import { getProduct } from '@/api/product' // 상품데이터 API
import { getShopData } from '@/api/shop' // 점포데이터 API
import { getEvents } from '@/api/event' // 이벤트데이터 API
import { getTopics } from '@/api/topic' // 주제데이터 API
import { getTagData, setRegisterTag } from '@/api/tag' // 검색키워드 API
import { setClearGoodsBatchSearchField, setClearGoodsSearchField, setClearOrderSearchField, setClearShopBatchField, setClearShopSearchField } from '@/utils/auth' // 쿠키설정
import { showToast } from '@/utils/' // 토스트 설정

export default {
    name: 'Advert_detail',
    components: {
        Thumbnail,
        Pagination
    },
    created() {
        setClearGoodsSearchField()
        setClearGoodsBatchSearchField()
        setClearShopSearchField()
        setClearShopBatchField()
        setClearOrderSearchField()

        this.advertid = this.$route.params && this.$route.params.id // 해당 광고 아이디
        this.getKeywordData()
        this.getAdvertData()
        this.getAdvertKind()
    },
    mounted() {
        window.addEventListener('keyup', this.setFilterValue)
    },
    directives: {
        elDragDialog
    },
    data() {
        return {
            advertid: undefined, // 광고아이디
            listLoading: false,
            isClicked: false,
            styles: { // 썸네일이미지 CSS 스타일
                width: '150px',
                height: '150px',
                cursor: 'pointer'
            },
            listKind: [], // 관련링크값 배렬
            isShowProductDlg: false, // 상품다이얼로그 로출상태
            isShowShopDlg: false, // 점포다이얼로그 로출상태
            isShowTopicDlg: false, // 점포다이얼로그 로출상태
            isShowKeywordDialog: false, // 검색키워드추가다이얼로그 로출상태
            searchProdName: '', // 검색용상품명
            prodName: '', // 상품명
            listProduct: [], // 상품 배렬
            totalProduct: 0, // 총상품수
            prodPage: 1, // 상품페지수
            prodSize: 10, // 페지당 상품수
            searchShopName: '', // 검색용점포명
            prodId: undefined, // 상품아이디
            listShop: [], // 점포배렬
            shopName: '', // 점포명
            shopId: undefined, // 림시점포아이디
            totalShop: 0, // 점포총개수
            shopPage: 1,
            shopSize: 10,
            searchTopicName: '', // 검색용주제명
            listTopic: [], // 주제배렬
            topicName: '', // 주제명
            topicId: undefined, // 주제아이디
            totalTopic: 0, // 총주제수
            pageTopic: 1, // 주제페지수
            sizeTopic: 10, // 페지당 주제수
            eventStatus: '',
            dataForm: {
                adName: '', // 광고명
                imgUri: imageBack, // 광고이미지
                imgFile: undefined, // 광고이미지파일
                adStatus: '0', // 광고상태
                rankingNum: '', // 광고랭킹번호
                adType: undefined, // 광고형태
                entityId: undefined, // 광고형태에 때르는 아이디
                beginDt: '', // 광고시작날자
                endDt: '', // 광고마감날자
                linkName: '', // 관련링크명
                entityName: '' // 검색키워드
            },
            isShowKeywordSelect: false,
            searchKeyword: '',
            keywordData: [],
            rules: {
                adName: [{
                    required: true,
                    message: '广告名称是必填项',
                    trigger: 'blur'
                }],
                adType: [{
                    required: true,
                    message: '链接类型是必填项',
                    trigger: 'change'
                }],
                entityName: [{
                    required: true,
                    message: '关键字是必填项',
                    trigger: 'change'
                }],
                rankingNum: [{
                    required: true,
                    message: '序号是必填项',
                    trigger: 'blur'
                }],
                beginDt: [{
                    required: true,
                    message: '日期是必填项',
                    trigger: 'blur'
                }],
                endDt: [{
                    required: true,
                    message: '日期是必填项',
                    trigger: 'blur'
                }]
            }
        }
    },
    methods: {
        setFilterValue(element) { // 음수 체크
            if (element.target.id === 'adName') {
                element.target.value = element.target.value.trim().substr(0, 20)
                this.dataForm.adName = element.target.value
            }

            if (element.target.id === 'rankingNum') { // 랭킹번호 수자만 허용
                element.target.value = element.target.value.trim().replace(/[^0-9]/g, '')
                this.dataForm.rankingNum = element.target.value
            }
        },
        setChangeDate() { // 마감날자가 시작날자보다 작은 경우 마감날자를 시작날자로 대체
            const startdate = this.$moment(this.dataForm.beginDt).format('YYYY-MM-DD').split('-')
            const lastdate = this.$moment(this.dataForm.endDt).format('YYYY-MM-DD').split('-')
            const start = new Date(startdate[0], parseInt(startdate[1]) - 1, startdate[2])
            const last = new Date(lastdate[0], parseInt(lastdate[1]) - 1, lastdate[2])

            if (start > last) {
                this.dataForm.endDt = this.dataForm.beginDt
            }
        },
        getKeywordData() {
            getTagData().then(response => {
                if (response.code === 0) {
                    this.keywordData = response.data
                }
            })
        },
        getAdvertData() {
            getAdvertDetailData(this.advertid).then(response => {
                if (response.code === 0) {
                    this.dataForm.adName = response.data.adName
                    this.dataForm.imgUri = response.data.imgUri === null || response.data.imgUri === '' ? imageBack : response.data.imgUri
                    this.dataForm.adStatus = response.data.adStatus
                    this.dataForm.rankingNum = response.data.rankingNum
                    this.dataForm.adType = response.data.adType
                    this.dataForm.entityId = response.data.entityId
                    this.dataForm.beginDt = response.data.entityId === '' ? '' : this.$moment(response.data.beginDt).format('YYYY-MM-DD')
                    this.dataForm.endDt = response.data.endDt === '' ? '' : this.$moment(response.data.endDt).format('YYYY-MM-DD')

                    if (response.data.adType === 6) {
                        this.dataForm.entityName = response.data.entityName
                        this.isShowKeywordSelect = true
                    } else {
                        this.dataForm.linkName = response.data.entityName
                    }
                }
            })
        },
        getAdvertKind() { // 광고 관련링크 API 호출
            getAdvertKind().then(response => {
                if (response.code === 0) {
                    this.listKind = response.data
                }
            })
        },
        setKind() { // 관련링크를 선택할 때 해당 항목에 따르는 처리 진행
            this.dataForm.linkName = ''
            this.dataForm.entityId = 0 // 다이얼로그를 닫을 때 이미전에 링크한 내용 초기화
            this.isShowKeywordSelect = false

            switch (this.dataForm.adType) {
                case 1: // 링크없음
                    this.dataForm.entityId = 0
                    break
                case 2: // 상품
                    this.isShowProductDlg = true
                    this.searchProdName = ''
                    this.getProductData()
                    break
                case 3: // 점포
                    this.isShowShopDlg = true
                    this.searchShopName = ''
                    this.getShopData()
                    break
                case 4: // 이벤트
                    this.getEventData()
                    break
                case 5: // 주제
                    this.isShowTopicDlg = true
                    this.searchTopicName = ''
                    this.getTopicData()
                    break
                case 6: // 검색어
                    this.isShowKeywordSelect = true
                    this.searchKeyword = ''
                    break
            }
        },
        setShowKeywordDialog() { // 검색키워드추가다이얼로그 노출
            this.isShowKeywordDialog = true
        },
        setAddSearchKeyword() { // 검색키워드추가하기
            let isExist = false

            if (this.searchKeyword.trim() === '') {
                showToast(this, '请输入关键字', 'warning')
                return
            }

            this.keywordData.filter(res => {
                if (res.tagInfo.trim() === this.searchKeyword.trim()) {
                    isExist = true
                }
            })

            if (isExist) {
                showToast(this, '已存在的关键字', 'warning')
                return
            }

            const query = {
                name: this.searchKeyword
            }

            setRegisterTag(query).then(response => {
                if (response.code === 0) {
                    const value = {
                        id: response.data.id,
                        tagInfo: response.data.name
                    }

                    this.keywordData.push(value)
                    showToast(this, '操作成功', 'success')
                    this.setCancelDlg()
                }
            })
        },
        setPriviewImage() { // 이미지 업로드를 위한 파일 브라우저 열기
            this.$refs.advertimage.click()
        },
        setChangeImage(input) { // 이미지 미리보기 설정
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

                    this.dataForm.imgUri = URL.createObjectURL(files[0])
                    this.dataForm.imgFile = files[0] // 업로드용 이미지 파일 담기
                }
            }
        },
        getProductData() { // 상품 데이터 API 호출
            this.listLoading = true

            const query = {
                goodsName: this.searchProdName,
                page: this.prodPage,
                size: this.prodSize
            }

            getProduct(query).then(response => {
                if (response.code === 0) {
                    // 해당 글로벌 변수에 얻은 상품 데이터들 추가
                    this.totalProduct = response.data.totalNum
                    this.prodSize = response.data.size
                    this.prodPage = response.data.page

                    let tempData = []

                    if (response.data.list !== null) {
                        response.data.list.filter(res => {
                            let value = {
                                id: res.id,
                                goodsName: res.goodsName,
                                checked: this.dataForm.entityId === res.id ? res.id : 0
                            }

                            tempData.push(value)
                        })
                    }

                    this.listProduct = tempData
                }

                this.listLoading = false
            })
        },
        setClickKind() { // 광고형태 클릭
            switch (this.dataForm.adType) {
                case 1: // 링크없음
                    this.dataForm.entityId = 0
                    break
                case 2: // 상품
                    this.isShowProductDlg = true
                    this.getProductData()
                    break
                case 3: // 점포
                    this.isShowShopDlg = true
                    this.getShopData()
                    break
                case 4: // 이벤트
                    this.getEventData()
                    break
                case 5: // 주제
                    this.isShowTopicDlg = true
                    this.getTopicData()
                    break
            }
        },
        setSearchProduct() { // 광고용상품검색
            this.prodPage = 1
            this.getProductData()
        },
        setSelectProduct(row) { // 광고용상품 선택
            this.prodId = row.id
            this.prodName = row.goodsName

            this.listProduct.filter(res => {
                res.checked = res.id === row.id ? 1 : 0
            })
        },
        setAddProduct() { // 광고용상품 추가
            this.isShowProductDlg = false
            this.dataForm.entityId = this.prodId
            this.dataForm.linkName = this.prodName
        },
        getShopData() { // 점포데이터 API 호출
            this.listLoading = true
            const query = {
                shopName: this.searchShopName,
                page: this.shopPage,
                size: this.shopSize
            }
            getShopData(query).then(response => {
                if (response.code === 0) {
                    this.totalShop = response.data.totalNum
                    this.shopSize = response.data.size
                    this.shopPage = response.data.page

                    let tempData = []

                    if (response.data.list !== null) {
                        response.data.list.filter(res => {
                            let value = {
                                id: res.id,
                                shopName: res.shopName,
                                checked: this.dataForm.entityId === res.id ? res.id : 0
                            }

                            tempData.push(value)
                        })
                    }

                    this.listShop = tempData
                }

                this.listLoading = false
            })
        },
        setSearchShop() { // 광고용상품이 포함된 점포검색
            this.shopPage = 1
            this.getShopData()
        },
        setSelectShop(row) { // 점포선택
            this.shopId = row.id
            this.shopName = row.shopName

            this.listShop.filter(res => {
                res.checked = res.id === row.id ? row.id : 0
            })
        },
        setAddShop() { // 점포추가
            this.isShowShopDlg = false
            this.dataForm.entityId = this.shopId
            this.dataForm.linkName = this.shopName
        },
        getTopicData() { // 주제데이터 API호출
            this.listLoading = true

            const query = {
                topicName: this.searchTopicName,
                eventStatus: this.eventStatus,
                page: this.pageTopic,
                size: this.sizeTopic
            }

            getTopics(query).then(response => {
                if (response.code === 0) {
                    this.totalTopic = response.data.totalNum
                    this.sizeTopic = response.data.size
                    this.pageTopic = response.data.page

                    let tempData = []

                    if (response.data.list !== null) {
                        response.data.list.filter(res => {
                            let value = {
                                id: res.id,
                                topicName: res.topicName,
                                checked: this.dataForm.entityId === res.id ? res.id : 0
                            }

                            tempData.push(value)
                        })
                    }

                    this.listTopic = tempData
                }

                this.listLoading = false
            })
        },
        setSearchTopic() { // 주제검색
            this.pageTopic = 1
            this.getTopicData()
        },
        setSelectTopic(row) { // 주제선택
            this.topicId = row.id
            this.topicName = row.topicName

            this.listTopic.filter(res => {
                res.checked = res.id === row.id ? row.id : 0
            })
        },
        setAddTopic() { // 주제추가
            this.isShowTopicDlg = false
            this.dataForm.entityId = this.topicId
            this.dataForm.linkName = this.topicName
        },
        getEventData() { // 이벤트데이터 API호출
            const query = {
                eventStatus: this.eventStatus
            }
            getEvents(query).then(response => {
                if (response.code === 0) {
                    if (response.data.list.length === 0) {
                        showToast(this, '没有活动', 'warning')
                        return
                    }

                    this.dataForm.linkName = response.data.list[0].eventName
                    this.dataForm.entityId = response.data.list[0].id
                }
            })
        },
        setCancelDlg() { // 다이얼로그 닫기
            this.isShowProductDlg = false
            this.isShowShopDlg = false
            this.isShowTopicDlg = false
            this.isShowKeywordDialog = false
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
        setUploadImageData(data) { // 이미지용 랜덤키 얻기
            return new Promise((resolve, reject) => {
                setUploadImage(data).then(response => {
                    resolve(response)
                }).catch(error => {
                    reject(error)
                })
            })
        },
        async setUpdate() { // 광고 등록
            if (this.isClicked) {
                return
            }

            // 상품명이 없으면 경고 메세지
            if (this.dataForm.adName.trim() === '') {
                this.$refs.adName.focus()
                showToast(this, '请输入广告名称', 'warning')
                return
            }

            // 관련링크가 링크없음이 아니고 광고링크내용이 없다면 경고메세지
            if (this.dataForm.adType !== 1 && this.dataForm.adType !== 6) {
                if (this.dataForm.entityId === 0) {
                    showToast(this, '请选择广告链接', 'warning')
                    return
                }
            } else if (this.dataForm.adType === 6 && this.dataForm.entityName === '') { // 관련링크없음이면 광고링크내용을 초기화
                showToast(this, '请选择关键字', 'warning')
                return
            } else {
                this.dataForm.entityId = 0
                this.dataForm.linkName = ''
            }

            if (this.dataForm.rankingNum === '') {
                this.$refs.rankingNum.focus()
                showToast(this, '请输入序号', 'warning')
                return
            }

            if (this.dataForm.beginDt === '') {
                this.$refs.beginDt.focus()
                showToast(this, '请输入开始日期', 'warning')
                return
            }

            if (this.dataForm.endDt === '') {
                this.$refs.endDt.focus()
                showToast(this, '请输入结束日期', 'warning')
                return
            }

            const isSuccess = await this.openMessageBox()

            if (!isSuccess) {
                return
            }

            this.isClicked = true

            let imageUri = ''

            if (this.dataForm.imgFile !== undefined) {
                let imageForm = new FormData()
                imageForm.append('file', this.dataForm.imgFile)

                const imgData = await this.setUploadImageData(imageForm)

                if (imgData.code === 0) {
                    imageUri = imgData.data.uri
                } else {
                    this.isClicked = false
                    return
                }
            } else {
                imageUri = this.dataForm.imgUri.split('/')[4]
            }

            const query = {
                adName: this.dataForm.adName,
                imgUri: imageUri,
                adStatus: this.dataForm.adStatus,
                rankingNum: parseInt(this.dataForm.rankingNum),
                adType: this.dataForm.adType,
                entityId: this.dataForm.entityId,
                entityName: this.dataForm.adType === 6 ? this.dataForm.entityName : '',
                beginDt: this.$moment(this.dataForm.beginDt).format('YYYY-MM-DD'),
                endDt: this.$moment(this.dataForm.endDt).format('YYYY-MM-DD')
            }

            setUpdateAdvert(this.advertid, query).then(response => {
                if (response === '') {
                    showToast(this, '操作成功', 'success')

                    this.$router.push({
                        path: '/advert/advert_list'
                    })
                }

                this.isClicked = false
            })
        }
    }
}