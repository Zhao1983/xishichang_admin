import elDragDialog from '@/directive/el-drag-dialog'

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
    showToast
} from '@/utils/' // 토스트 설정

import {
    getTopicDataById,
    setUpdateTopic
} from '@/api/topic' // 주제관리 API 추가

import {
    getCategories
} from '@/api/category' // 상품카테고리 API 추가

import {
    getTagData
} from '@/api/tag' // 상품용 검색키워드 API 추가

export default {
    name: 'Topic_detail',
    components: {},
    created() {
        setClearGoodsSearchField()
        setClearGoodsBatchSearchField()
        setClearShopSearchField()
        setClearShopBatchField()
        setClearOrderSearchField()

        this.topicid = this.$route.params && this.$route.params.id // 해당 주제 아이디
        this.getTag()
        this.getTopicData()
    },
    mounted() {

    },
    directives: {
        elDragDialog
    },
    data() {
        return {
            topicid: undefined, // 주제아이디
            listLoading: false,
            isClicked: false,
            listTag: [], // 키워드배렬
            typeName: '', // 분류명
            typeId: undefined, // 대분류아이디
            subTypeId: undefined, // 소분류아이디
            listType: [], // 대분류 배렬
            listSubType: [], // 소분류 배렬
            isShowTypeDialog: false, // 분류추가다이얼로그 로출여부
            tempTypeId: undefined,
            tempSubTypeId: undefined,
            dataForm: {
                topicName: '', // 주제명
                topicAlias: '', // 주제
                topicStatus: '0', // 주제상태
                rankingNum: '', // 주제랭킹번호
                topicType: '', // 주제형식
                entityId: undefined, // 형식별 아이디
                entityName: '' // 형식별명
            },
            rules: {
                topicName: [{
                    required: true,
                    message: '专题名称是必填项',
                    trigger: 'blur'
                }],
                rankingNum: [{
                    required: true,
                    message: '序号是必填项',
                    trigger: 'blur'
                }],
                topicType: [{
                    required: true,
                    message: '专题分类是必填项',
                    trigger: 'blur'
                }],
                entityId: [{
                    required: true,
                    message: '该项是必填项',
                    trigger: 'blur'
                }]
            }
        }
    },
    methods: {
        getTopicData() {
            getTopicDataById(this.topicid).then(response => {
                if (response.code === 0) {
                    this.dataForm.topicName = response.data.topicName
                    this.dataForm.topicAlias = response.data.topicAlias
                    this.dataForm.topicType = response.data.topicType.toString()
                    this.dataForm.entityId = response.data.entityId
                    this.dataForm.entityName = response.data.entityName
                    this.dataForm.topicStatus = response.data.topicStatus
                    this.dataForm.rankingNum = response.data.rankingNum
                }
            })
        },
        getTypeData() { // 분류얻기
            getCategories().then(response => {
                if (response.code === 0) {
                    this.listType = response.data.list
                }
            })
        },
        setChangeCategory() { // 대분류에 따르는 소분류 얻기
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
        setShowTypeDialog() { // 분류추가다이얼로그 로출
            this.isShowTypeDialog = true
            this.getTypeData()
        },
        setAddType() { // 분류추가
            if (this.typeId === undefined || this.typeId === '') {
                showToast(this, '请选择大类别', 'warning')
                return
            }

            if (this.subTypeId === undefined || this.subTypeId === '') {
                showToast(this, '请选择小类别', 'warning')
                return
            }

            this.listSubType.filter(res => {
                if (this.subTypeId === res.id) {
                    this.dataForm.entityName = res.typeName
                }
            })

            this.tempTypeId = this.typeId
            this.tempSubTypeId = this.subTypeId

            this.dataForm.entityId = this.subTypeId

            this.isShowTypeDialog = false
        },
        setCanceTypeDialog() { // 분류추가다이얼로그 닫기
            this.isShowTypeDialog = false

            this.typeId = this.tempTypeId
            this.subTypeId = this.tempSubTypeId
        },
        getTag() { // 키워드 얻기
            getTagData().then(response => {
                if (response.code === 0) {
                    this.listTag = response.data
                }
            })
        },
        setChangeTopicType() { // 주제형태 변경
            this.dataForm.entityId = undefined
            this.dataForm.entityName = ''
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

            // 주제명이 없으면
            if (this.dataForm.topicName.trim() === '') {
                this.$refs.topicName.focus()
                showToast(this, '请输入专题名称', 'warning')
                return
            }

            // 랭킹번호가 없으면
            if (this.dataForm.rankingNum === '') {
                this.$refs.rankingNum.focus()
                showToast(this, '请输入序号', 'warning')
                return
            }

            // 주제종류를 선택하지 않았으면
            if (this.dataForm.topicType === '') {
                this.$refs.topicType.focus()
                showToast(this, '请选择专题绑定项', 'warning')
                return
            }

            // 카테고리를 선택하지 않았으면
            if (this.dataForm.topicType === '1' && this.dataForm.entityId === undefined) {
                this.$refs.entityName.focus()
                showToast(this, '选择分类', 'warning')
                return
            }

            // 키워드를 선택하지 않았으면
            if (this.dataForm.topicType === '2' && this.dataForm.entityId === undefined) {
                this.$refs.tag.focus()
                showToast(this, '选择标签', 'warning')
                return
            }

            const isSuccess = await this.openMessageBox()

            if (!isSuccess) {
                return
            }

            this.isClicked = true

            const query = {
                topicName: this.dataForm.topicName,
                topicAlias: this.dataForm.topicAlias,
                topicStatus: this.dataForm.topicStatus,
                rankingNum: parseInt(this.dataForm.rankingNum),
                topicType: parseInt(this.dataForm.topicType),
                entityId: parseInt(this.dataForm.entityId)
            }

            setUpdateTopic(this.topicid, query).then(response => {
                if (response === '') {
                    showToast(this, '操作成功', 'success')
                    this.$router.push({
                        path: '/topic/topic_list'
                    })
                }

                this.isClicked = false
            })
        }
    }
}