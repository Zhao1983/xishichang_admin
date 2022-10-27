import Pagination from '@/components/Pagination'

import {
    setClearGoodsSearchField,
    setClearGoodsBatchSearchField,
    setClearShopSearchField,
    setClearShopBatchField,
    setClearOrderSearchField
} from '@/utils/auth'

import {
    getDayStatistics
} from '@/api/statistics'

import {
    setAddComma,
    setAddCommaTwo
} from '@/utils/'

export default {
    name: 'Statistics',
    components: {
        Pagination
    },
    created() {
        setClearGoodsSearchField()
        setClearGoodsBatchSearchField()
        setClearShopSearchField()
        setClearShopBatchField()
        setClearOrderSearchField()

        this.getData()
    },
    filters: {
        addCommaTwo(data) { // 3자리수마다 콤마 추가
            return setAddCommaTwo(data)
        },
        addComma(value) {
            return setAddComma(value)
        }
    },
    mounted() {

    },
    data() {
        return {
            listLoading: false,
            page: 1, // 테블페지수
            size: 10, // 테블행수
            totalNum: 0,
            beginDt: '',
            endDt: '',
            days: [{
                    day: 0,
                    value: '星期天'
                },
                {
                    day: 1,
                    value: '星期一'
                },
                {
                    day: 2,
                    value: '星期二'
                },
                {
                    day: 3,
                    value: '星期三'
                },
                {
                    day: 4,
                    value: '星期四'
                },
                {
                    day: 5,
                    value: '星期五'
                },
                {
                    day: 6,
                    value: '星期六'
                }
            ],
            pickerOptions: {
                disabledDate(time) {
                    return time.getTime() > Date.now()
                }
            },
            listData: []
        }
    },
    methods: {
        getData() {
            const query = {
                beginDt: this.beginDt,
                endDt: this.endDt,
                page: parseInt(this.page),
                size: parseInt(this.size)
            }

            this.listLoading = true

            getDayStatistics(query).then(response => {
                if (response.list.length !== 0) {
                    response.list.filter((res, idx) => {
                        response.list[idx].day = this.days[this.$moment(res.statDate).day()].value
                    })

                    this.listData = response.list
                    this.totalNum = response.totalNum
                    this.page = response.page
                    this.size = response.size
                }

                this.listLoading = false
            })
        },
        setChangeDate() { // 마감날자가 시작날자보다 작은 경우 처리하기
            const startdate = this.$moment(this.beginDt).format('YYYY-MM-DD').split('-')
            const lastdate = this.$moment(this.endDt).format('YYYY-MM-DD').split('-')
            const start = new Date(startdate[0], parseInt(startdate[1]) - 1, startdate[2])
            const last = new Date(lastdate[0], parseInt(lastdate[1]) - 1, lastdate[2])

            if (start > last) {
                this.endDt = this.beginDt
            }

            this.beginDt = this.beginDt === '' || this.beginDt === null ? '' : this.$moment(this.beginDt).format('YYYY-MM-DD')
            this.endDt = this.endDt === '' || this.endDt === null ? '' : this.$moment(this.endDt).format('YYYY-MM-DD')
        },
        setSearchData() {
            this.page = 1
            this.getData()
        }
    }
}