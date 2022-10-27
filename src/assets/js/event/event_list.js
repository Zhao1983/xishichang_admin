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
    showToast,
    setAddCommaTwo,
    setAddComma
} from '@/utils/' // 토스트 설정

import {
    getEvents,
    setUpdateEventStatus
} from '@/api/event' // 이벤트 API 추가

export default {
    name: 'Event_list',
    components: {
        Pagination
    },
    created() {
        setClearGoodsSearchField()
        setClearGoodsBatchSearchField()
        setClearShopSearchField()
        setClearShopBatchField()
        setClearOrderSearchField()

        this.getEventData()
    },
    mounted() {

    },
    filters: {
        addComma(value) {
            return setAddComma(value)
        }
    },
    data() {
        return {
            listLoading: false,
            eventName: '', // 이벤트명
            eventStatus: '', // 이벤트상태
            beginDt: '', // 이벤트시작날자
            endDt: '', // 이벤트마감날자
            page: 1, // 페지수
            size: 10, // 한 페지당 자료수
            dataEvent: [], // 이벤트 배렬
            totalNum: 0 // 이벤트 총개수
        }
    },
    methods: {
        setChangeDate() { // 마감날자가 시작날자보다 작게 선택하지 않게 하기
            const startdate = this.$moment(this.beginDt).format('YYYY-MM-DD').split('-')
            const lastdate = this.$moment(this.endDt).format('YYYY-MM-DD').split('-')
            const start = new Date(startdate[0], parseInt(startdate[1]) - 1, startdate[2])
            const last = new Date(lastdate[0], parseInt(lastdate[1]) - 1, lastdate[2])
            if (start > last) {
                this.endDt = this.beginDt
            }
        },
        getEventData() {
            this.listLoading = true

            const query = {
                eventName: this.eventName.trim(),
                eventStatus: this.eventStatus,
                beginDt: this.beginDt,
                endDt: this.endDt,
                page: this.page,
                size: this.size
            }

            getEvents(query).then(response => {
                if (response.code === 0) {
                    this.page = response.data.page
                    this.size = response.data.size
                    this.totalNum = response.data.totalNum
                    this.dataEvent = response.data.list
                }

                this.listLoading = false
            })
        },
        setSearchData() {
            this.page = 1
            this.beginDt = this.beginDt === null || this.beginDt === '' ? '' : this.$moment(this.beginDt).format('YYYY-MM-DD')
            this.endDt = this.endDt === null || this.endDt === '' ? '' : this.$moment(this.endDt).format('YYYY-MM-DD')

            this.getEventData()
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
        async setUpdateStatus(eventname, id, status) {
            const isSuccess = await this.openMessageBox(eventname)

            if (!isSuccess) {
                return
            }

            setUpdateEventStatus(id, status).then(response => {
                if (response === '') {
                    showToast(this, '操作成功', 'success')
                    this.getEventData()
                }
            })
        }
    }
}