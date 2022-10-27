import Pagination from '@/components/Pagination'

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
    getTopics,
    setUpdateTopicStatus
} from '@/api/topic' // 주제관리 API 추가

export default {
    name: 'Topic_list',
    components: {
        Pagination
    },
    created() {
        setClearGoodsSearchField()
        setClearGoodsBatchSearchField()
        setClearShopSearchField()
        setClearShopBatchField()
        setClearOrderSearchField()

        this.getTopicData()
    },
    mounted() {

    },
    data() {
        return {
            listLoading: false,
            isClicked: false,
            topicName: '', // 검색용주제명
            topicStatus: '', // 검색용주제상태
            page: 1, // 페지수
            size: 10, // 주제개수
            totalNum: 0, // 총주제수
            dataTopic: [] // 주제배렬
        }
    },
    methods: {
        getTopicData() {
            const query = {
                topicName: this.topicName.trim(),
                topicStatus: this.topicStatus,
                page: this.page,
                size: this.size
            }

            getTopics(query).then(response => {
                if (response.code === 0) {
                    this.dataTopic = response.data.list

                    this.page = response.data.page
                    this.totalNum = response.data.totalNum
                    this.size = response.data.size
                }
            })
        },
        async openMessageBox(name) { // 메시지다이얼로그 async/await 처리
            try {
                await MessageBox.confirm(name + '是否要是否启用？', '信息', {
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    type: 'warning'
                })

                return true
            } catch (e) {
                return false
            }
        },
        setSearchData() {
            this.page = 1
            this.getTopicData()
        },
        async setUpdateStatus(name, id, status) {
            const isSuccess = await this.openMessageBox(name)

            if (!isSuccess) {
                return
            }

            setUpdateTopicStatus(id, status).then(response => {
                if (response === '') {
                    showToast(this, '操作成功', 'success')
                    this.getTopicData()
                }
            })
        }
    }
}