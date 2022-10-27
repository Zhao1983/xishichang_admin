import Pagination from '@/components/Pagination' // 페이징 콘퍼넨트 추가
import elDragDialog from '@/directive/el-drag-dialog'
import Thumbnail from '@/components/ImageItem/single_image' // 이미지 컴포넨트 추가
import imageBack from '@/assets/images/review_image_back.png' // 썸네일 백그라운드 이미지 추가

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
    getAllAdminInfo,
    getBeforeSettlementData,
    getBeforeSettlementDataByShop,
    setChangeDifferencePrice,
    setSettlementData,
    setExportBeforeSettlement,
    setExportAfterSettlement,
    getAfterSettlementData,
    getAfterSettlementDataByShop,
    getAfterSettlementByOrder
} from '@/api/settlement'

export default {
    name: 'Settlement_list',
    components: {
        Pagination,
        Thumbnail
    },
    created() {
        setClearGoodsSearchField()
        setClearGoodsBatchSearchField()
        setClearShopSearchField()
        setClearShopBatchField()
        setClearOrderSearchField()

        this.getAdminInfo()
        this.getSettlement()
    },
    directives: {
        elDragDialog
    },
    filters: {
        addCommaTwo(data) { // 3자리수마다 콤마 추가
            return setAddCommaTwo(data)
        },
        addComma(value) {
            return setAddComma(value)
        }
    },
    watch: {
        activeOption(val) {
            this.activeOption = val
            this.page = 1
            this.size = 10
            this.subPage = 1
            this.subSize = val === 'before' ? 200 : 10
            this.exportIds = ''
            this.exportShopIds = ''
            this.getSettlement()
        }
    },
    mounted() {
        window.addEventListener('keyup', this.setFilterValue)
    },
    data() {
        return {
            listLoading: false,
            searchOrderNo: '',
            searchGoodsShortName: '',
            searchShopName: '',
            searchManagerId: 0,
            searchOrderStatus: 1,
            searchsettlementNo: '',
            searchBeginDate: '',
            searchEndDate: '',
            page: 1,
            size: 10,
            totalNum: 0,
            subPage: 1,
            subSize: 200,
            subTotalNum: 0,
            adminInfo: [],
            settlementData: [],
            subSettlementData: [],
            activeOption: 'before',
            tabOption: [{
                    label: '待结算',
                    key: 'before'
                },
                {
                    label: '已结算',
                    key: 'after'
                }
            ],
            expandKeys: [],
            isShowPriceDialog: false,
            priceInfo: [],
            shopId: 0,
            isShowSettlementDialog: false,
            styles: { // 썸네일이미지 CSS 스타일
                width: '200px',
                height: '275px',
                cursor: 'pointer'
            },
            settleShopName: '',
            settleItem: 0,
            settleTotalPrice: 0,
            settleNo: '',
            settleRemark: '',
            settleQrCode: imageBack,
            settleInfo: [],
            exportIds: '',
            exportShopIds: '',
            pickerOptionBegin: {},
            pickerOptionEnd: {
                disabledDate(time) {
                    return time.getTime() > Date.now()
                }
            },
            checkShopIds: [],
            checkIds: [],
            isExpand: false,
            tmpShopId: 0,
            isSubCheck: false,
            sumPrice: 0,
            sumPrice_1: 0
        }
    },
    methods: {
        setFilterValue(element) {
            this.priceInfo.filter((res, idx) => {
                if (element.target.id === 'differencePrice-' + idx) {
                    element.target.value = element.target.value.replace(/[^0-9.]/g, '')

                    if (element.target.value.indexOf('.') !== -1) {
                        element.target.value = element.target.value.slice(0, element.target.value.indexOf('.') + 3)
                    }

                    this.priceInfo[idx].differencePrice = element.target.value
                }
            })
        },
        getAdminInfo() {
            getAllAdminInfo().then(response => {
                if (response.code === 0) {
                    this.adminInfo = response.data
                }
            })
        },
        setChangeDate() { // 마감날자가 시작날자보다 작은 경우 처리하기
            const startdate = this.$moment(this.searchBeginDate).format('YYYY-MM-DD').split('-')
            const lastdate = this.$moment(this.searchEndDate).format('YYYY-MM-DD').split('-')
            const start = new Date(startdate[0], parseInt(startdate[1]) - 1, startdate[2])
            const last = new Date(lastdate[0], parseInt(lastdate[1]) - 1, lastdate[2])

            if (start > last) {
                this.searchEndDate = this.searchBeginDate
            }

            if (last > new Date()) {
                this.searchEndDate = this.$moment(new Date()).format('YYYY-MM-DD')
            }

            this.searchBeginDate = this.searchBeginDate === '' || this.searchBeginDate === null ? '' : this.$moment(this.searchBeginDate).format('YYYY-MM-DD')
            this.searchEndDate = this.searchEndDate === '' || this.searchEndDate === null ? '' : this.$moment(this.searchEndDate).format('YYYY-MM-DD')
        },
        getSettlement() {
            this.expandKeys = []
            this.subSettlementData = []
            const query = {
                shopName: this.searchShopName.trim(),
                orderNo: this.searchOrderNo.trim(),
                goodsShortName: this.searchGoodsShortName.trim(),
                managerId: this.searchManagerId,
                payStartDt: this.searchBeginDate,
                payEndDt: this.searchEndDate,
                page: this.page,
                size: this.size
            }

            this.listLoading = true

            if (this.activeOption === 'before') {
                query.orderStatus = this.searchOrderStatus

                getBeforeSettlementData(query).then(response => {
                    if (response.code === 0) {
                        this.settlementData = response.data.list
                        this.page = response.data.page
                        this.size = response.data.size
                        this.totalNum = response.data.totalNum
                    }

                    this.listLoading = false
                })
            }

            if (this.activeOption === 'after') {
                query.settlementNo = this.searchsettlementNo

                getAfterSettlementData(query).then(response => {
                    if (response.code === 0) {
                        this.settlementData = response.data.list
                        this.page = response.data.page
                        this.size = response.data.size
                        this.totalNum = response.data.totalNum
                    }

                    this.listLoading = false
                })
            }
        },
        setSearchData() {
            this.page = 1
            this.subPage = 1
            this.expandKeys = []
            this.getSettlement()
        },
        getBeforeSubSettlement() {
            let data = []
            const query = {
                shopName: this.searchShopName,
                orderNo: this.searchOrderNo,
                goodsShortName: this.searchGoodsShortName,
                managerId: this.searchManagerId,
                orderStatus: this.searchOrderStatus,
                payStartDt: this.searchBeginDate,
                payEndDt: this.searchEndDate,
                page: this.subPage,
                size: this.subSize
            }

            getBeforeSettlementDataByShop(this.shopId, query).then(response => {
                if (response.code === 0) {
                    this.subPage = response.data.page
                    this.subSize = response.data.size
                    this.subTotalNum = response.data.totalNum

                    response.data.list.filter(res => {
                        const value = {
                            shopId: this.shopId,
                            id: res.id,
                            orderNo: res.orderNo,
                            payDt: res.payDt,
                            deliveryDt: res.deliveryDt,
                            deliveryStatus: res.deliveryStatus,
                            goodsShortName: res.goodsShortName,
                            salesPrice: res.salesPrice,
                            costPrice: res.costPrice,
                            goodsNum: res.goodsNum,
                            totalSalesPrice: res.totalSalesPrice,
                            totalCostPrice: res.totalCostPrice,
                            profitInfo: res.profitInfo,
                            profitRate: res.profitRate,
                            differencePrice: res.differencePrice,
                            settlementNo: res.settlementNo,
                            differencePriceRemark: res.differencePriceRemark,
                            checked: false
                        }

                        data.push(value)
                    })

                    this.subSettlementData[this.shopId] = data

                    if (this.checkShopIds.length !== 0) {
                        this.expandKeys.filter(id => {
                            this.subSettlementData[id].filter(res => {
                                this.checkShopIds.filter(val => {
                                    if (val.shopId === id) {
                                        this.$nextTick(() => {
                                            this.$refs['subTableData_' + id][0].toggleRowSelection(res, true)
                                            res.checked = true
                                        })
                                    }
                                })
                            })
                        })
                    }
                }
            })
        },
        getAfterSubSettlement() {
            let data = []
            const query = {
                shopName: this.searchShopName,
                orderNo: this.searchOrderNo,
                goodsShortName: this.searchGoodsShortName,
                managerId: this.searchManagerId,
                settlementNo: this.searchsettlementNo,
                payStartDt: this.searchBeginDate,
                payEndDt: this.searchEndDate,
                page: this.subPage,
                size: this.subSize
            }

            getAfterSettlementDataByShop(this.shopId, query).then(response => {
                if (response.code === 0) {
                    this.subPage = response.data.page
                    this.subSize = response.data.size
                    this.subTotalNum = response.data.totalNum

                    response.data.list.filter(res => {
                        const value = {
                            shopId: this.shopId,
                            id: res.id,
                            orderNo: res.orderNo,
                            payDt: res.payDt,
                            deliveryDt: res.deliveryDt,
                            deliveryStatus: res.deliveryStatus,
                            goodsShortName: res.goodsShortName,
                            salesPrice: res.salesPrice,
                            costPrice: res.costPrice,
                            goodsNum: res.goodsNum,
                            totalSalesPrice: res.totalSalesPrice,
                            totalCostPrice: res.totalCostPrice,
                            profitInfo: res.profitInfo,
                            profitRate: res.profitRate,
                            differencePrice: res.differencePrice,
                            differencePriceRemark: res.differencePriceRemark,
                            settlementNo: res.settlementNo,
                            settlementRemark: res.settlementRemark,
                            isAfterRemark: res.settlementRemark !== ''
                        }

                        data.push(value)
                    })

                    this.subSettlementData.splice(0, 1)
                    this.subSettlementData[this.shopId] = data
                }
            })
        },
        getRowKeys(row) {
            return row.shopId
        },
        expandChange(row, expandedRows) {
            this.subIndex = 0
            this.expandKeys = []
            this.shopId = row.shopId
            this.subTotalNum = 0
            this.isExpand = true

            if (expandedRows.length !== 0) {
                if (this.activeOption === 'before') {
                    expandedRows.filter(res => {
                        this.expandKeys.push(res.shopId)
                    })

                    this.subPage = 1
                    this.subSize = 200
                    this.getBeforeSubSettlement()
                }

                if (this.activeOption === 'after') {
                    this.expandKeys.push(row.shopId)
                    this.subSettlementData = []
                    this.subPage = 1
                    this.subSize = 10
                    this.getAfterSubSettlement()
                }
            } else {
                this.expandKeys = []
            }
        },
        handleSelectionChange(row) {
            this.sumPrice = 0
            this.sumPrice_1 = 0
            this.exportShopIds = ''
            this.checkShopIds = row

            row.filter((res, idx) => {
                if (idx === row.length - 1) {
                    this.exportShopIds += res.shopId
                } else {
                    this.exportShopIds += res.shopId + ','
                }

                this.sumPrice += res.settlementPrice
                this.sumPrice_1 += res.profitInfo
            })

            setTimeout(() => {
                if (this.isExpand) {
                    if (row.length !== 0) {
                        this.expandKeys.filter(id => {
                            if (this.tmpShopId === 0) {
                                this.subSettlementData[id].filter(res => {
                                    res.checked = false

                                    this.$nextTick(() => {
                                        this.$refs['subTableData_' + id][0].toggleRowSelection(res, false)
                                    })

                                    row.filter(val => {
                                        if (val.shopId === id) {
                                            res.checked = true

                                            this.$nextTick(() => {
                                                this.$refs['subTableData_' + id][0].toggleRowSelection(res, true)
                                            })
                                        }
                                    })
                                })
                            } else {
                                if (this.subSettlementData[this.tmpShopId]) {
                                    this.subSettlementData[this.tmpShopId].filter(res => {
                                        if (!this.isSubCheck) {
                                            res.checked = false

                                            this.$nextTick(() => {
                                                this.$refs['subTableData_' + this.tmpShopId][0].toggleRowSelection(res, false)
                                            })
                                        }

                                        row.filter(val => {
                                            if (this.tmpShopId === val.shopId) {
                                                res.checked = true

                                                this.$nextTick(() => {
                                                    this.$refs['subTableData_' + this.tmpShopId][0].toggleRowSelection(res, true)
                                                })
                                            }
                                        })
                                    })
                                }
                            }
                        })
                    } else {
                        this.expandKeys.filter(id => {
                            if (this.tmpShopId === 0) {
                                this.subSettlementData[id].filter(res => {
                                    res.checked = false

                                    this.$nextTick(() => {
                                        this.$refs['subTableData_' + id][0].toggleRowSelection(res, false)
                                    })
                                })
                            } else {
                                if (!this.isSubCheck) {
                                    this.subSettlementData[this.tmpShopId].filter(res => {
                                        res.checked = false

                                        this.$nextTick(() => {
                                            this.$refs['subTableData_' + this.tmpShopId][0].toggleRowSelection(res, false)
                                        })
                                    })
                                }
                            }
                        })
                    }
                }

                this.isSubCheck = false
            }, 150)
        },
        handleSubSelectionChange(row) {
            this.exportIds = ''
            this.checkIds = row

            if (this.activeOption === 'after') {
                row.filter((res, idx) => {
                    if (idx === row.length - 1) {
                        this.exportIds += res.id
                    } else {
                        this.exportIds += res.id + ','
                    }
                })
            }

            setTimeout(() => {
                if (!this.isExpand) {
                    if (row.length !== 0) {
                        this.subSettlementData[this.tmpShopId].filter(res => {
                            res.checked = false
                        })

                        row.filter(val => {
                            this.subSettlementData[this.tmpShopId].filter(res => {
                                if (res.id === val.id) {
                                    res.checked = true
                                }
                            })
                        })

                        row.filter(val => {
                            this.subSettlementData[this.tmpShopId].filter(res => {
                                if (res.id === val.id) {
                                    if (this.subSettlementData[this.tmpShopId].length !== row.length) {
                                        this.settlementData.filter(value => {
                                            if (value.shopId === this.tmpShopId) {
                                                this.$refs.tableData[0].toggleRowSelection(value, false)
                                            }
                                        })
                                    } else {
                                        this.settlementData.filter(value => {
                                            if (value.shopId === this.tmpShopId) {
                                                this.$refs.tableData[0].toggleRowSelection(value, true)
                                            }
                                        })
                                    }
                                }
                            })
                        })
                    } else {
                        this.subSettlementData[this.tmpShopId].filter(res => {
                            res.checked = false
                        })

                        this.settlementData.filter(value => {
                            if (value.shopId === this.tmpShopId) {
                                this.$refs.tableData[0].toggleRowSelection(value, false)
                            }
                        })
                    }
                }

                this.isExpand = true
            }, 100)
        },
        rowSelectChange(rows, row) {
            this.tmpShopId = row.shopId
            this.isSubCheck = false
        },
        rowAllSelectChange() {
            this.tmpShopId = 0
        },
        subRowSelectChange(shopid) {
            this.tmpShopId = shopid
            this.isExpand = false
            this.isSubCheck = true
        },
        subRowAllSelectChange(shopid) {
            this.tmpShopId = shopid
            this.isExpand = false
        },
        setShowPriceDialog(row) {
            this.priceInfo = []
            this.isShowPriceDialog = true
            this.shopId = row.shopId
            const value = {
                id: row.id,
                goodsShortName: row.goodsShortName,
                differencePrice: row.differencePrice,
                differencePriceRemark: row.differencePriceRemark
            }

            this.priceInfo.push(value)
        },
        setChangePrice() {
            const query = {
                differencePrice: this.priceInfo[0].differencePrice,
                differencePriceRemark: this.priceInfo[0].differencePriceRemark
            }

            setChangeDifferencePrice(this.priceInfo[0].id, query).then(response => {
                this.isShowPriceDialog = false

                if (response === '') {
                    showToast(this, '操作成功', 'success')
                    this.subSettlementData[this.shopId].filter((res, idx) => {
                        if (this.priceInfo[0].id === res.id) {
                            this.subSettlementData[this.shopId][idx].differencePrice = this.priceInfo[0].differencePrice
                            this.subSettlementData[this.shopId][idx].differencePriceRemark = this.priceInfo[0].differencePriceRemark
                        }
                    })
                }
            })
        },
        setShowSettlementDialog(data, index) {
            let tmpData = []
            let temp = []

            this.expandKeys.filter(id => {
                this.subSettlementData[id].filter(res => {
                    if (res.checked) {
                        temp[id] = 'aaa'
                        tmpData.push(res)
                        this.shopId = id
                    }
                })
            })

            this.settlementData.filter(res => {
                if (this.shopId === res.shopId) {
                    this.settleQrCode = res.payCode
                    this.settleShopName = res.shopName
                }
            })

            const keys = Object.keys(temp)

            if (keys.length === 0 && index === 'multi') {
                showToast(this, '请至少指定一个订单', 'warning')
                return
            }

            if (keys.length > 1 && index === 'multi') {
                showToast(this, '批量结算只能单个商户结算', 'warning')
                return
            }

            this.isShowSettlementDialog = true
            this.settleRemark = ''

            if (index === 'single') {
                this.settleInfo = []

                const value = {
                    id: data.id,
                    goodsShortName: data.goodsShortName,
                    costPrice: data.costPrice,
                    goodsNum: data.goodsNum,
                    totalCostPrice: data.totalCostPrice
                }

                this.settleInfo.push(value)
                this.settleItem = this.settleInfo.length
                this.settleTotalPrice = data.totalCostPrice
                this.settleNo = this.$moment(new Date()).format('YYYYMMDDHHmmss')
            }

            if (index === 'multi') {
                this.settleInfo = []
                this.settleTotalPrice = 0

                tmpData.filter(res => {
                    const value = {
                        id: res.id,
                        goodsShortName: res.goodsShortName,
                        costPrice: res.costPrice,
                        goodsNum: res.goodsNum,
                        totalCostPrice: res.totalCostPrice
                    }

                    this.settleInfo.push(value)
                })

                this.settleItem = this.settleInfo.length
                this.settleNo = this.$moment(new Date()).format('YYYYMMDDHHmmss')

                this.settleInfo.filter(res => {
                    this.settleTotalPrice += res.totalCostPrice
                })
            }

            if (index === 'detail') {
                getAfterSettlementByOrder(data.settlementNo).then(response => {
                    if (response.code === 0) {
                        this.settleRemark = response.data.settlementRemark
                        this.settleItem = response.data.settlementList.length
                        this.settleNo = response.data.settlementNo
                        this.settleInfo = []
                        this.settleTotalPrice = 0

                        response.data.settlementList.filter(val => {
                            const value = {
                                goodsShortName: val.goodsShortName,
                                costPrice: val.costPrice,
                                goodsNum: val.goodsNum,
                                totalCostPrice: val.totalPrice,
                                differencePrice: val.differencePrice
                            }

                            this.settleTotalPrice += parseInt(val.totalPrice)
                            this.settleInfo.push(value)
                        })
                    }
                })
            }
        },
        setCancelDialog(index) {
            if (index === 'price') {
                this.isShowPriceDialog = false
            }

            if (index === 'settlement') {
                this.isShowSettlementDialog = false
            }
        },
        setSettlement() {
            let ids = []

            this.settleInfo.filter(res => {
                ids.push(res.id)
            })

            if (ids.length === 0) {
                showToast(this, '请至少指定一个订单', 'warning')
                return
            }

            const query = {
                ids: ids,
                settlementNo: this.settleNo,
                remark: this.settleRemark
            }

            setSettlementData(this.shopId, query).then(response => {
                this.isShowSettlementDialog = false

                if (response === '') {
                    showToast(this, '操作成功', 'success')
                    this.getSettlement()
                }
            })
        },
        setExport(index) {
            if (this.activeOption === 'before') {
                this.expandKeys.filter(id => {
                    this.subSettlementData[id].filter(res => {
                        if (res.checked) {
                            this.exportIds += res.id + ','
                        }
                    })
                })
            }

            if (this.exportIds === '' && this.exportShopIds === '' && index === '') {
                showToast(this, '请选择要导出的数据.', 'warning')
                return
            }

            const query = {
                shopIds: this.exportShopIds,
                shopName: this.searchShopName,
                orderNo: this.searchOrderNo,
                goodsShortName: this.searchGoodsShortName,
                managerId: this.searchManagerId,
                settlementNo: this.searchsettlementNo,
                payStartDt: this.searchBeginDate,
                payEndDt: this.searchEndDate
            }

            if (this.activeOption === 'before') {
                query.ids = this.exportIds.slice(0, this.exportIds.length - 1)

                setExportBeforeSettlement(query).then(response => {
                    if (response.code === 0) {
                        if (response.data.uri !== '') {
                            window.location.href = response.data.uri
                        }
                    }
                })
            }

            if (this.activeOption === 'after') {
                setExportAfterSettlement(query).then(response => {
                    if (response.code === 0) {
                        if (response.data.uri !== '') {
                            window.location.href = response.data.uri
                        }
                    }
                })
            }
        }
    }
}