import Pagination from '@/components/Pagination'
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
    memberList,
    setUpdateStatus
} from '@/api/member' // 회원관리 API 추가

export default {
    name: 'Member_list',
    components: {
        Pagination
    },
    created() {
        setClearGoodsSearchField()
        setClearGoodsBatchSearchField()
        setClearShopSearchField()
        setClearShopBatchField()
        setClearOrderSearchField()

        this.getMemberInfo('all')
    },
    mounted() {

    },
    watch: {
        activeOption(val) {
            this.listUserInfo = []
            this.getMemberInfo(val)
            this.activeOption = val
            this.kind = 'tab'
        }
    },
    directives: {
        elDragDialog
    },
    data() {
        return {
            listLoading: false,
            phoneNum: '', // 사용자폰번호
            userNick: '', // 사용자닉네임
            address: '', // 사용자주소
            beginDt: '', // 날자검색
            endDt: '', // 날자검색
            page: 1, // 페지수
            size: 10, // 자료개수
            totalNum: 0, // 총페지수
            status: '', // 사용자상태
            userStatus: '', // 검색용사용자상태
            listUserInfo: [], // 사용자정보배렬
            activeOption: 'all', // 옵션
            tabOption: [{
                    label: '全选',
                    key: 'all'
                },
                {
                    label: '禁用',
                    key: 'disable'
                },
                {
                    label: '启用',
                    key: 'enable'
                }
            ],
            kind: '', // 사용자정보 로출형태(검색/탭)
            isShowStatusDlg: false, // 사용자상태변경 다이얼로그 로출여부
            offCause: '', // 리유
            memberid: 0, // 사용자아이디
            isShowReceiveAddress: false, // 배송주소
            receiver: '', // 수거인
            receiverPhone: '', // 수거인폰번호
            provinceName: '', // 성
            cityName: '', // 시
            countryName: '', // 구
            addressInfo: '', // 배송상세주소
            pickerOptions: {
                disabledDate(time) {
                    return time.getTime() > Date.now()
                }
            }
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
        getMemberInfo(tab) {
            this.listLoading = true

            if (tab === 'all') {
                tab = ''
            }

            if (tab === 'disable') {
                tab = '0'
            }

            if (tab === 'enable') {
                tab = '1'
            }

            let query = {
                userNick: this.userNick.trim(),
                address: this.address.trim(),
                phoneNum: this.phoneNum.trim(),
                beginDt: this.beginDt,
                endDt: this.endDt,
                status: this.kind === 'search' ? this.userStatus : tab,
                page: this.page,
                size: this.size
            }

            memberList(query).then(response => {
                if (response.code === 0) {
                    this.listUserInfo = response.data.list
                    this.totalNum = response.data.totalNum
                    this.size = response.data.size
                    this.page = response.data.page
                }

                this.listLoading = false
            })
        },
        getSearchData() { // 검색
            this.page = 1
            this.beginDt = this.beginDt === null || this.beginDt === '' ? '' : this.$moment(this.beginDt).format('YYYY-MM-DD')
            this.endDt = this.endDt === null || this.endDt === '' ? '' : this.$moment(this.endDt).format('YYYY-MM-DD')
            this.kind = 'search'
            this.activeOption = 'all'

            this.getMemberInfo(this.activeOption)
        },
        setShowStatusDialog() {
            this.isShowStatusDlg = true
        },
        cancelDialog() {
            this.isShowStatusDlg = false
            this.isShowReceiveAddress = false
        },
        updateStatus() {
            if (this.status === '0') {
                // 리유가 없으면
                if (this.offCause === '') {
                    this.$refs.offCause.focus()
                    showToast(this, '请输入理由', 'warning')
                    return
                }
                this.isShowStatusDlg = false
            }

            const query = {
                status: this.status,
                offCause: this.offCause
            }

            setUpdateStatus(this.memberid, query).then(response => {
                if (response === '') {
                    this.getMemberInfo(this.activeOption)
                    showToast(this, '操作成功', 'success')
                }
            })
        },
        setUpdateMemberStatus(memberid, status, nickname) {
            this.offCause = ''
            this.memberid = memberid
            this.status = status

            if (status === '0') {
                MessageBox.confirm(nickname + '确定要退出会员吗？', '信息', {
                    confirmButtonText: '是',
                    cancelButtonText: '否',
                    type: 'warning'
                }).then(() => {
                    this.setShowStatusDialog()
                }).catch(() => {

                })
            } else {
                this.updateStatus()
            }
        }
    }
}