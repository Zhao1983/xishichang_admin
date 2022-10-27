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
    getDelivery,
    getEventDetail,
    setUploadMainImage,
    setUploadSubImage,
    setUpdateEventData
} from '@/api/event' // 이벤트 데이터 API 추가

export default {
    name: 'Event_detail',
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

        this.eventid = this.$route.params && this.$route.params.id // 해당 광고 아이디
        this.getDeliveryData()
        this.getEventData()
    },
    mounted() {
        window.addEventListener('keyup', this.setFilterValue)
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
            eventid: undefined,
            isClicked: false,
            listLoading: false,
            listDelivery: [], // 배송방식 배렬
            styles: { // 썸네일 사이즈 스타일
                width: '150px',
                height: '150px',
                cursor: 'pointer'
            },
            isShowImageCancel: false,
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
                eventStatus: '0' // 이벤트상태
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
        setFilterValue(element) {
            if (element.target.id === 'eventName') {
                element.target.value = element.target.value.trim().substr(0, 20)
                this.dataForm.eventName = element.target.value
            }

            if (element.target.id === 'rankingNum') {
                element.target.value = element.target.value.replace(/[^0-9]/g, '')
                this.dataForm.rankingNum = element.target.value
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
        getEventData() {
            getEventDetail(this.eventid).then(response => {
                if (response.code === 0) {
                    this.dataForm.eventName = response.data.eventName
                    this.dataForm.rankingNum = response.data.rankingNum
                    this.dataForm.beginDt = response.data.beginDt
                    this.dataForm.endDt = response.data.endDt
                    this.dataForm.deliveryType = response.data.deliveryType
                    this.dataForm.coverImgUri = response.data.coverImgUri
                    this.dataForm.topImgUri = response.data.topImgUri === '' || response.data.topImgUri === null ? imageBack : response.data.topImgUri
                    this.isShowImageCancel = !(response.data.topImgUri === '' || response.data.topImgUri === null)
                    this.dataForm.eventStatus = response.data.eventStatus
                }
            })
        },
        getDeliveryData() { // 배송방식 얻기
            getDelivery().then(response => {
                if (response.code === 0) {
                    this.listDelivery = response.data
                }
            })
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
        async setUpdate() {
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

            const isSuccess = await this.openMessageBox()

            if (!isSuccess) {
                return
            }

            this.isClicked = true

            let mainForm = new FormData()
            let subForm = new FormData()
            let mainUri = ''
            let subUri = ''

            if (this.dataForm.coverImgFile !== undefined) {
                mainForm.append('file', this.dataForm.coverImgFile)
                const main = await this.setUploadMainImageData(mainForm)

                if (main.code === 0) {
                    mainUri = main.data.uri
                } else {
                    this.isClicked = false
                    return
                }
            } else {
                mainUri = this.dataForm.coverImgUri.split('/')[4]
            }

            if (this.dataForm.topImgFile !== undefined) {
                subForm.append('file', this.dataForm.topImgFile)

                const sub = await this.setUploadSubImageData(subForm)

                if (sub.code === 0) {
                    subUri = sub.data.uri
                } else {
                    this.isClicked = false
                    return
                }
            } else {
                const compare = await this.compareImageName(this.dataForm.topImgUri)

                if (!compare) {
                    subUri = this.dataForm.topImgUri.split('/')[4]
                }
            }

            const query = {
                eventName: this.dataForm.eventName,
                coverImgUri: mainUri,
                topImgUri: subUri,
                rankingNum: parseInt(this.dataForm.rankingNum),
                beginDt: this.dataForm.beginDt === '' ? '' : this.$moment(this.dataForm.beginDt).format('YYYY-MM-DD'),
                endDt: this.dataForm.endDt === '' ? '' : this.$moment(this.dataForm.endDt).format('YYYY-MM-DD'),
                deliveryType: this.dataForm.deliveryType,
                eventStatus: this.dataForm.eventStatus
            }

            setUpdateEventData(this.eventid, query).then(response => {
                if (response === '') {
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