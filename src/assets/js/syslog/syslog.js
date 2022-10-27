import Pagination from '@/components/Pagination' // 페이징 콘퍼넨트 추가

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
    getSysLogData
} from '@/api/admin'

export default {
    name: 'Syslog',
    components: {
        Pagination
    },
    created() {
        setClearGoodsSearchField()
        setClearGoodsBatchSearchField()
        setClearShopSearchField()
        setClearShopBatchField()
        setClearOrderSearchField()

        this.getLog()
    },
    mounted() {

    },
    data() {
        return {
            listLoading: false,
            listLog: [],
            page: 1,
            size: 50,
            totalNumber: 0
        }
    },
    methods: {
        getLog() {
            this.listLoading = true

            getSysLogData(this.page, this.size).then(response => {
                if (response.code === 0) {
                    this.listLog = response.data.list
                    this.totalNumber = response.data.totalNum
                    this.page = response.data.page
                    this.size = response.data.size
                }

                this.listLoading = false
            })
        }
    }
}