import Pagination from '@/components/Pagination'

import { MessageBox } from 'element-ui' // 메세지다이얼로그 추가
import { setClearGoodsBatchSearchField, setClearGoodsSearchField, setClearOrderSearchField, setClearShopBatchField, setClearShopSearchField } from '@/utils/auth' // 쿠키설정
import { showToast } from '@/utils/' // 토스트 설정
import { getAdvertData, setUpdateStatus } from '@/api/advert' // 광고 API 추가

export default {
    name: 'Advert_list',
    components: {
        Pagination
    },
    created() {
        setClearGoodsSearchField()
        setClearGoodsBatchSearchField()
        setClearShopSearchField()
        setClearShopBatchField()
        setClearOrderSearchField()

        this.getAdvertData()
    },
    mounted() {

    },
    data() {
        return {
            listLoading: false,
            adName: '', // 광고명
            adStatus: '', // 광고상태
            beginDt: '', // 시작날자
            endDt: '', // 마감날자
            page: 1,
            size: 10,
            listAdvert: [], // 광고리스트 배렬
            totalNumber: 0
        }
    },
    methods: {
        getAdvertData() { // 광고 데이터 API 호출
            this.listLoading = true
            const query = {
                adName: this.adName,
                adStatus: this.adStatus,
                beginDt: this.beginDt,
                endDt: this.endDt,
                page: this.page,
                size: this.size
            }

            getAdvertData(query).then(response => {
                if (response.code === 0) {
                    this.totalNumber = response.data.totalNum
                    this.listAdvert = response.data.list
                    this.page = response.data.page
                    this.totalNumber = response.data.totalNum
                }

                this.listLoading = false
            })
        },
        setChangeDate() { // 마감날자가 시작날자보다 작게 선택하지 않게 하기
            const startdate = this.$moment(this.beginDt).format('YYYY-MM-DD').split('-')
            const lastdate = this.$moment(this.endDt).format('YYYY-MM-DD').split('-')
            const start = new Date(startdate[0], parseInt(startdate[1]) - 1, startdate[2])
            const last = new Date(lastdate[0], parseInt(lastdate[1]) - 1, lastdate[2])

            if (start > last) {
                this.endDt = this.beginDt
            }
        },
        getSearchData() { // 검색
            this.page = 1
            this.beginDt = this.beginDt === null || this.beginDt === '' ? '' : this.$moment(this.beginDt).format('YYYY-MM-DD')
            this.endDt = this.endDt === null || this.endDt === '' ? '' : this.$moment(this.endDt).format('YYYY-MM-DD')

            this.getAdvertData()
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
        async setUpdateStatus(adevername, row, status) { // 광고상태 변경
            const isSuccess = await this.openMessageBox(adevername)

            if (!isSuccess) {
                return
            }

            setUpdateStatus(row.id, status).then(response => {
                if (response === '') {
                    showToast(this, '操作成功', 'success')
                    this.getAdvertData()
                }
            })
        }
    }
}