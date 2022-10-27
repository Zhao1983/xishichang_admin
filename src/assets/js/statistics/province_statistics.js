import {
    getProvinceStatistics
} from '@/api/statistics'

import {
    setAddComma,
    setAddCommaTwo
} from '@/utils/'

import {
    setClearGoodsSearchField,
    setClearGoodsBatchSearchField,
    setClearShopSearchField,
    setClearShopBatchField,
    setClearOrderSearchField
} from '@/utils/auth'

export default {
    name: 'Province_statistics',
    components: {

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
            beginDt: '',
            endDt: '',
            pickerOptions: {
                disabledDate(time) {
                    return time.getTime() > Date.now()
                }
            },
            listData: [],
            orderType: 0
        }
    },
    methods: {
        getData() {
            const query = {
                beginDt: this.beginDt,
                endDt: this.endDt,
                orderType: this.orderType
            }

            this.listLoading = true

            getProvinceStatistics(query).then(response => {
                if (response.length !== 0) {
                    this.listData = response
                }

                this.listLoading = false
            })
        },
        setSortChange(data) { // 테블 정렬할 때 호출되는 함수
            if (data.order === 'ascending') { // 올림차순
                if (data.prop === 'orderNum') {
                    this.orderType = 1
                }

                if (data.prop === 'orderRate') {
                    this.orderType = 3
                }

                if (data.prop === 'salesPrice') {
                    this.orderType = 5
                }

                if (data.prop === 'salesPriceAvg') {
                    this.orderType = 7
                }

                if (data.prop === 'profitInfo') {
                    this.orderType = 9
                }

                if (data.prop === 'profitRate') {
                    this.orderType = 11
                }
            }

            if (data.order === 'descending') { // 내림차순
                if (data.prop === 'orderNum') {
                    this.orderType = 2
                }

                if (data.prop === 'orderRate') {
                    this.orderType = 4
                }

                if (data.prop === 'salesPrice') {
                    this.orderType = 6
                }

                if (data.prop === 'salesPriceAvg') {
                    this.orderType = 8
                }

                if (data.prop === 'profitInfo') {
                    this.orderType = 10
                }

                if (data.prop === 'profitRate') {
                    this.orderType = 12
                }
            }

            if (data.order !== null) {
                this.getData()
            }
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