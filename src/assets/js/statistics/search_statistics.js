import Pagination from '@/components/Pagination'

import {
    setClearGoodsSearchField,
    setClearGoodsBatchSearchField,
    setClearShopSearchField,
    setClearShopBatchField,
    setClearOrderSearchField
} from '@/utils/auth'

import {
    setAddComma
} from '@/utils/'

import {
    getSearchStatistics
} from '@/api/statistics' // 회원관리 API 추가

export default {
    name: 'Search_statistics',
    components: {
        Pagination
    },
    created() {
        setClearGoodsSearchField()
        setClearGoodsBatchSearchField()
        setClearShopSearchField()
        setClearShopBatchField()
        setClearOrderSearchField()

        if (this.switchDate === 0) {
            this.date = this.$moment(new Date()).subtract(1, 'days').format('YYYY-MM-DD')
        }

        this.getData()
    },
    mounted() {},
    filters: {
        addComma(value) {
            return setAddComma(value)
        }
    },
    data() {
        return {
            listLoading: false,
            switchDate: 0,
            date: '',
            page: 1, // 테블페지수
            size: 10, // 테블행수
            totalNumber: 0, // 상품총개수
            listData: []
        }
    },
    methods: {
        setChangeDate(e) {
            if (e === '0') {
                this.date = this.$moment(new Date()).subtract(1, 'days').format('YYYY-MM-DD')
            }

            if (e === '1') {
                this.date = this.$moment(new Date()).subtract(7, 'days').format('YYYY-MM-DD')
            }

            if (e === '2') {
                this.date = this.$moment(new Date()).subtract(1, 'month').format('YYYY-MM-DD')
            }

            if (e === '3') {
                this.date = this.$moment(new Date()).subtract(3, 'month').format('YYYY-MM-DD')
            }

            if (e === '4') {
                this.date = this.$moment(new Date()).subtract(6, 'month').format('YYYY-MM-DD')
            }

            if (e === '5') {
                this.date = this.$moment(new Date()).subtract(1, 'years').format('YYYY-MM-DD')
            }

            this.getData()
        },
        getData() {
            const query = {
                beginDt: this.date,
                endDt: this.$moment(new Date()).format('YYYY-MM-DD'),
                page: parseInt(this.page),
                size: parseInt(this.size)
            }

            getSearchStatistics(query).then(response => {
                this.listData = response.list
                this.totalNumber = response.totalNum
                this.page = response.page
                this.size = response.size
            })
        }
    }
}