import elDragDialog from '@/directive/el-drag-dialog'

import { setClearGoodsBatchSearchField, setClearGoodsSearchField, setClearOrderSearchField, setClearShopBatchField, setClearShopSearchField } from '@/utils/auth' // 쿠키설정
import { getAllAdminInfo, getDutyData, getRemarkDetail, setAddDutyMember, setAddDutyRemark } from '@/api/duty'

import { numberPad, showToast } from '@/utils/' // 토스트 설정

export default {
    name: 'Duty_status',
    components: {},
    created() {
        setClearGoodsSearchField()
        setClearGoodsBatchSearchField()
        setClearShopSearchField()
        setClearShopBatchField()
        setClearOrderSearchField()

        this.beforeDate = this.$moment(new Date(this.currentYear, parseInt(this.currentMonth) - 1, 0)).format('YYYY-MM') // 현재의 날자의 이전 달 얻기
        this.beforeDay = new Date(this.currentYear, parseInt(this.currentMonth) - 1, 0).getDate()
        this.getDutyData()
    },
    mounted() {

    },
    directives: {
        elDragDialog
    },
    data() {
        return {
            today: new Date(), // 오늘 날자
            beforeDate: '', // 현재 월의 이전 달 얻기
            beforeDay: '',
            currentDate: this.$moment(new Date()).format('YYYY-MM'),
            currentYear: this.$moment(new Date()).format('YYYY'), // 현재의 년도
            currentMonth: this.$moment(new Date()).format('MM'), // 현재의 월
            calendarData: [], // 달력배렬
            dutyData: [], // 직발상태배렬
            isShowDialogMemo: false, // 기록다이얼로그 로출상태
            isShowDialogMember: false, // 직발인원다이얼로그 로출상태
            remarkInfo: '', // 메모정보
            adminInfo: [], // 관리원배렬
            memberData: undefined, // 직발인원배렬
            isStatus: false, // 보기/등록 노출상태
            dutyId: 0, // 직발정보아이디
            remarkData: [], // 직발메모배렬
            pickerOptions: {
                disabledDate(time) {
                    return time.getTime() > Date.now()
                }
            }
        }
    },
    methods: {
        getDutyData() { // 직발정보 얻기
            getDutyData(parseInt(this.currentYear), parseInt(this.currentMonth)).then(response => {
                if (response.code === 0) {
                    this.dutyData = response.data
                    this.setCalendar()
                }
            })
        },
        getAdminData() { // 관리원정보 얻기
            getAllAdminInfo().then(response => {
                if (response.code === 0) {
                    this.adminInfo = response.data
                }
            })
        },
        setCalendar() { // 달력 설정
            this.calendarData = []
            const firstDay = this.currentYear + '-' + parseInt(this.currentMonth) + '-' + '01' // 이번달의 첫일
            const firstDayOfWeek = new Date(firstDay).getDay() === 0 ? 7 : new Date(firstDay).getDay() // 이번달의 첫요일
            const totalDay = new Date(this.currentYear, parseInt(this.currentMonth), 0).getDate() // 이번달의 총일수
            const totalWeek = Math.ceil((totalDay + firstDayOfWeek) / 7) // 이번달의 총 주
            let day = 1 // 일
            let befDay = firstDayOfWeek === 1 ? 0 : parseInt(this.beforeDay - (firstDayOfWeek - 2))

            for (let i = 0; i < totalWeek; i++) {
                let temp = []

                for (let j = 1; j < 8; j++) {
                    if ((day > 1 || j >= firstDayOfWeek) && (totalDay >= day)) {
                        const value = {
                            id: 0,
                            day: day,
                            adminNames: '',
                            remarkStatus: '0',
                            isActive: false,
                            date: this.currentDate + '-' + numberPad(day, 2)
                        }

                        if (j === 6 || j === 7) {
                            value.isActive = true
                        }

                        this.dutyData.filter(res => {
                            const dutyDay = res.dutyDt.split('-')[2] // 일수
                            const dutyDate = res.dutyDt.split('-')[0] + '-' + res.dutyDt.split('-')[1]

                            // 월에 따르는 일과 서버에서 내려온 일수와 같다면 해당일에 직발상태값 넣기
                            if (parseInt(day) === parseInt(dutyDay) && this.beforeDate !== dutyDate) {
                                value.id = res.id
                                value.adminNames = res.adminNames === null ? '' : res.adminNames
                                value.remarkStatus = res.remarkStatus
                            }
                        })
                        temp.push(value)
                        day++
                    } else {
                        const value = {
                            id: 0,
                            day: '',
                            adminNames: '',
                            remarkStatus: '0',
                            isActive: false,
                            date: ''
                        }

                        if (day <= 1) {
                            value.day = befDay
                            value.date = this.beforeDate + '-' + numberPad(befDay, 2)
                            if (j === 6) {
                                value.isActive = true
                            }
                        }

                        this.dutyData.filter(res => {
                            if (res.dutyDt === this.beforeDate + '-' + befDay) {
                                value.id = res.id
                                value.adminNames = res.adminNames === null ? '' : res.adminNames
                                value.remarkStatus = res.remarkStatus
                            }
                        })

                        temp.push(value)
                        befDay++
                    }
                }

                this.calendarData.push(temp)
            }
        },
        isToday(date, id) {
            if (date === this.$moment(this.today).format('YYYY-MM-DD')) {
                this.dutyId = id
            }

            return date === this.$moment(this.today).format('YYYY-MM-DD')
        },
        setChangeDate(val) {
            this.currentYear = this.$moment(val).format('YYYY')
            this.currentMonth = this.$moment(val).format('MM')
            this.currentDate = this.$moment(val).format('YYYY-MM')
            this.beforeDay = new Date(this.currentYear, parseInt(this.currentMonth) - 1, 0).getDate()
            this.beforeDate = this.$moment(new Date(val.setMonth(val.getMonth() - 1))).format('YYYY-MM')
            this.getDutyData()
        },
        showDialogMemo(id) {
            if (this.dutyId === 0 && id === '0') {
                showToast(this, '请选择值班人员后再填写备注!', 'warning')
                return
            }

            this.isShowDialogMemo = true
            this.remarkInfo = ''
            this.remarkData = []

            if (id === '0') { // 당일 직발정보를 확인하려고 할 때
                this.isStatus = true

                if (this.dutyId !== 0) {
                    this.getRemarkDetail(this.dutyId)
                }
            } else { // 기타 다른 날의 직발정보를 확인하려고 할 때
                this.isStatus = false
                this.getRemarkDetail(id)
            }
        },
        getRemarkDetail(id) {
            this.remarkData = []

            getRemarkDetail(id).then(response => {
                if (response.code === 0) {
                    this.remarkData = response.data.remarkInfos
                }
            })
        },
        showDialogMember() {
            this.isShowDialogMember = true
            this.getAdminData()
        },
        setCancelDialog(index) {
            if (index === 'memo') {
                this.isShowDialogMemo = false
            }

            if (index === 'member') {
                this.isShowDialogMember = false
            }
        },
        handleSelectionChange(row) {
            let tmpMember = []
            this.memberData = undefined

            row.filter(res => {
                tmpMember.push(res.name)
            })

            if (row.length !== 0) {
                this.memberData = {
                    adminNames: tmpMember,
                    dutyDt: this.$moment(this.today).format('YYYY-MM-DD')
                }
            }
        },
        setDutyMember() {
            if (this.memberData === undefined) {
                showToast(this, '请选择填写值班人员', 'warning')
                return
            }

            setAddDutyMember(this.memberData).then(response => {
                if (response.code === 0) {
                    this.setCancelDialog('member')
                    showToast(this, '操作成功', 'success')
                    this.getDutyData()
                }
            })
        },
        setDutyRemark() {
            if (this.remarkInfo.trim() === '') {
                showToast(this, '请输入填写备注', 'warning')
                return
            }

            const query = {
                remarkInfo: this.remarkInfo
            }

            setAddDutyRemark(this.dutyId, query).then(response => {
                if (response.code === 0) {
                    this.setCancelDialog('memo')
                    showToast(this, '操作成功', 'success')
                    this.getDutyData()
                }
            })
        }
    }
}