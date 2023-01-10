import Pagination from "@/components/Pagination" // 페이징 콘퍼넨트 추가
import elDragDialog from "@/directive/el-drag-dialog"
import printJS from "print-js"

import { MessageBox } from "element-ui" // 메세지다이얼로그 추가
import {
    setClearGoodsBatchSearchField,
    setClearGoodsSearchField,
    setClearOrderSearchField,
    setClearShopBatchField,
    setClearShopSearchField
} from "@/utils/auth" // 쿠키설정
import { setAddComma, setAddCommaTwo, showToast } from "@/utils/" // 토스트 설정
import {
    getDeliveryStatus,
    getOrderPayed,
    getOrderStatus,
    getOrderWarningInfo,
    setAddWarningInfo,
    setAutoSendShipping,
    setCancelOrder,
    setFinishOrder,
    setOrderBatchRead,
    setOrderSingleRead,
    setRefundOrder,
    setRefundSingleOrder,
    setSendDelivery,
    setSendShipping,
    setOrderReadyDeliveryStatus,
    getOrderPrintInfo,
    setMultiPrintInfo,
    setConfirmFutureDelivery,
    setConfirmWarningDelivery,
    setConfirmWarningDeliveryFromFuture,
    setExportOrderGoods,
    getDeliveryStatusNum,
    setConfirmWarningOrderReady,
    exportOrderDeliveryControll
} from "@/api/order" // 주문데이터 API 추가
import { getAllDeliveryCompany } from "@/api/shipping"

export default {
    name: "Order_pay",
    components: {
        Pagination
    },
    created() {
        setClearGoodsSearchField()
        setClearGoodsBatchSearchField()
        setClearShopSearchField()
        setClearShopBatchField()
        setClearOrderSearchField()

        this.getDeliveryCompany()
        this.getOrderStatusData()
        this.getOrderData("", 0)
    },
    mounted() {
        const menuData = localStorage.getItem('menus') ? JSON.parse(localStorage.getItem('menus')) : []
        this.permissionRefund = menuData.find((rs) => {
            if (rs.name === '订单管理') {
                return rs.subs.find((r) => r.name === '订单退款按钮')
            }
        })
    },
    directives: {
        elDragDialog
    },
    filters: {
        addCommaTwo(data) {
            // 3자리수마다 콤마 추가
            return setAddCommaTwo(data)
        },
        addComma(value) {
            return setAddComma(value)
        }
    },
    watch: {
        activeTabOption(val) {
            this.page = 1
            setClearOrderSearchField()
            this.activeTabOption = val
            this.getOrderData("", val)
        }
    },
    data() {
        return {
            listLoading: false,
            searchDeliveryType: 0, // 배송방식
            searchOrderStatus: 0, // 주문상태
            searchOrderNo: "", // 감색용주문번호
            searchPayStatus: 0, // 결제상태
            searchAddress: "", // 수화주소
            searchUserPhone: "", // 수화인전화번호
            searchUserName: "", // 검색용수화인명
            searchGoodsName: "", // 상품명
            searchClientType: 0, // 주문종류(공증호, 미니앱)
            beginDt: "", // 주문창조날자
            endDt: "", // 주문완료날자
            page: 1, // 테블페지수
            size: 10, // 테블에 보여지는 주문수
            totalNum: 0, // 주문총개수
            orderData: [], // 주문정보 배렬
            subOrderData: [], // 서브주문정보 배렬
            orderStatusData: [], // 배송상태 배렬
            expandKeys: [],
            subDeliveryGoods: [],
            subOrderCnt: [],
            isShowOrderDialog: false,
            isShowReceiverDialog: false,
            isShowDeliveryStatusDialog: false,
            isShowCancelDialog: false,
            isShowSendDialog: false,
            isShowRefundDialog: false,
            isShowPrintDialog: false,
            userName: "", // 수화인명
            userPhone: "", // 수화인폰번호,
            province: "", // 수화성시명
            deliveryAddress: "", // 상세주소
            deliveryNo: "", // 배송번호
            deliveryName: "", // 배송회사명
            deliveryType: "", // 배송형태
            orderNo: "", // 주문번호
            address: "", // 수화주소
            tracks: [], // 배송진행상태 배렬
            cancelReason: "", // 취소리유
            orderId: 0, // 주문아이디
            isClicked: false,
            tempOrderInfo: [],
            refundReason: "", // 환불리유
            deliveryWeight: 0,
            todayDate: "",
            printData: [], // 인쇄자료배렬(유료배송)
            freePrintData: [], // 인쇄자료배렬(무료배송)
            createDt: "", // 주문날자
            orderPrice: 0, // 주문금액
            deliveryPrice: 0, // 배송비
            packagePrice: 0, // 포장비
            deliveryWeight: 0, // 배송무게
            orderRemark: "",
            kind: "", // 택배일 때 자동/수동 상태값
            batchIds: [], // 일괄용배렬
            batchOrderData: [], // 일괄용프린트주문데이터
            deliveryCompany: [], // 배송회사배렬
            isShowDialogDuty: false, // 주문이상다이얼로그 로출상태
            warningData: [], // 주문이상정보배렬
            warningInfo: "", // 주문이상메모내용
            dutyAdmin: "", // 직발인원
            isDutyStatus: false,
            refundGoodsId: 0, // 개별적인 주문상품환불용 상품아이디
            refundKind: "", // 환불종류(전체/개별)
            pickerOptions: {
                disabledDate(time) {
                    return time.getTime() > Date.now()
                }
            },
            listKind: "",
            activeTabOption: "0",
            tabOption: [{
                label: "未准备发货",
                key: "0",
                label_en: "notReady",
                count: 0
            },
            {
                label: "已准备发货",
                key: "1",
                label_en: "ready",
                count: 0
            },
            {
                label: "明日发货",
                key: "3",
                label_en: "future",
                count: 0
            },
            {
                label: "订单异常",
                key: "4",
                label_en: "warning",
                count: 0
            }
            ],
            notReadyNum: 0,
            readyNum: 0,
            futureNum: 0,
            warningNum: 0,
            permissionRefund: false // 환불권한상태값
        }
    },
    methods: {
        async openMessageBox(message) {
            // 메시지다이얼로그 async/await 처리
            try {
                await MessageBox.confirm(message, "信息", {
                    confirmButtonText: "确认",
                    cancelButtonText: "取消",
                    type: "warning"
                })

                return true
            } catch (e) {
                return false
            }
        },
        setInputValue(element) {
            this.tempOrderInfo.filter((res, index) => {
                if (element.target.id === "deliveryNo-" + index) {
                    element.target.value = element.target.value
                        .replace(/[^A-Za-z0-9]/g, "")
                        .substr(0, 18)
                    res.deliveryNum = element.target.value
                }
            })
        },
        getDeliveryCompany() {
            getAllDeliveryCompany().then(response => {
                if (response.code === 0) {
                    this.deliveryCompany = response.data
                }
            })
        },
        getOrderStatusData() {
            // 주문상태 얻기
            getOrderStatus().then(response => {
                if (response.code === 0) {
                    this.orderStatusData = response.data
                }
            })
        },
        setChangeDate() {
            // 마감날자가 시작날자보다 작은 경우 처리하기
            const startdate = this.$moment(this.beginDt)
                .format("YYYY-MM-DD")
                .split("-")
            const lastdate = this.$moment(this.endDt)
                .format("YYYY-MM-DD")
                .split("-")
            const start = new Date(
                startdate[0],
                parseInt(startdate[1]) - 1,
                startdate[2]
            )
            const last = new Date(
                lastdate[0],
                parseInt(lastdate[1]) - 1,
                lastdate[2]
            )
            if (start > last) {
                this.endDt = this.beginDt
            }

            this.beginDt =
                this.beginDt === "" || this.beginDt === null ?
                    "" :
                    this.$moment(this.beginDt).format("YYYY-MM-DD")
            this.endDt =
                this.endDt === "" || this.endDt === null ?
                    "" :
                    this.$moment(this.endDt).format("YYYY-MM-DD")
        },
        getOrderData(kind, tabOption) {
            // 주문정보 얻기
            const query = {
                deliveryType: this.searchDeliveryType,
                userName: this.searchUserName,
                userPhone: this.searchUserPhone.trim(),
                goodsName: this.searchGoodsName.trim(),
                orderNo: this.searchOrderNo.trim(),
                orderStatus: this.searchOrderStatus,
                payStatus: this.searchPayStatus,
                address: this.searchAddress.trim(),
                beginDt: this.beginDt,
                endDt: this.endDt,
                clientType: parseInt(this.searchClientType),
                deliveryStatus: tabOption,
                page: this.page,
                size: this.size
            }

            this.listLoading = true

            getOrderPayed(query).then(response => {
                if (response.code === 0) {
                    this.totalNum = response.data.totalNum
                    this.size = response.data.size
                    this.page = response.data.page
                    this.orderData = response.data.list
                    this.listKind = kind
                    this.getDeliveryStatusNum()

                    if (kind === "refund") {
                        let refundDateByOrder = ""

                        this.orderData.filter(res => {
                            if (res.id === this.orderId) {
                                res.deliveries.filter(v => {
                                    v.packages.filter(vv => {
                                        vv.shops.filter(vvv => {
                                            vvv.goods.filter(vvvv => {
                                                if (vvvv.goodsId === this.refundGoodsId) {
                                                    refundDateByOrder = vvvv.refundDt
                                                }
                                            })
                                        })
                                    })
                                })
                            }
                        })

                        this.subOrderData.filter(res => {
                            if (res.goodsId === this.refundGoodsId) {
                                res.refundStatus = "1"
                                res.refundDt = refundDateByOrder
                            }
                        })
                    }
                }

                this.listLoading = false
            })
        },
        setSearchData() {
            // 주문검색
            this.page = 1
            this.getOrderData("", this.activeTabOption)
        },
        tableRowClassName({ row, rowIndex }) {
            let isFree = false

            row.deliveries.filter(res => {
                if (res.postageFreeStatus === '1' || res.postageFreeStatus === '2') {
                    isFree = true
                }
            })

            if (isFree) {
                return "warning-row"
            }
        },
        getRowKeys(row) {
            return row.id
        },
        expandChange(row, expandedRows) {
            this.subOrderData = []
            this.subOrderCnt = []
            this.subDeliveryGoods = []
            this.expandKeys = []

            if (expandedRows.length !== 0) {
                this.expandKeys.push(row.id)

                row.deliveries.filter(res => {
                    res.packages.filter(val => {
                        val.shops.filter(v => {
                            v.goods.filter(vv => {
                                let value = {
                                    parentId: row.id,
                                    id: res.id,
                                    deliveryNo: res.deliveryNo,
                                    parentNo: row.orderNo,
                                    orderNo: res.orderNo,
                                    deliveryStatus: res.deliveryStatus,
                                    deliveryName: res.deliveryName,
                                    payDt: row.payDt,
                                    orderStatus: row.orderStatus,
                                    deliveryTypeName: res.deliveryTypeName,
                                    deliveryType: res.deliveryType,
                                    deliveryPrice: res.deliveryPrice,
                                    typeId: val.typeId,
                                    typeName: val.typeName,
                                    shopName: v.shopName,
                                    shopPhone: v.shopPhone,
                                    shopOwner: v.shopOwner,
                                    goodsName: vv.goodsName,
                                    sizeName: vv.sizeName,
                                    goodsShortName: vv.goodsShortName,
                                    goodsImg: vv.goodsImg,
                                    packageType: vv.packageType,
                                    packagePrice: vv.packagePrice,
                                    goodsPrice: vv.goodsPrice,
                                    goodsWeight: vv.goodsWeight,
                                    goodsNum: vv.goodsNum,
                                    dutyAdmin: row.dutyAdmin,
                                    postageFreeStatus: res.postageFreeStatus,
                                    refundStatus: vv.refundStatus,
                                    goodsId: vv.goodsId,
                                    refundDt: vv.refundDt
                                }

                                this.subOrderData.push(value)
                            })
                        })
                    })
                })

                // 주문번호, 배송분류, 점포명을 기준으로 상품정렬
                this.subOrderData.sort((a, b) => {
                    if (a.orderNo < b.orderNo) {
                        return -1
                    }

                    if (a.orderNo > b.orderNo) {
                        return 1
                    }

                    if (a.typeName < b.typeName) {
                        return -1
                    }

                    if (a.typeName > b.typeName) {
                        return 1
                    }

                    if (a.shopName < b.shopName) {
                        return -1
                    }

                    if (a.shopName > b.shopName) {
                        return 1
                    }

                    return 0
                })

                // 상품, 점포정보, 배송분류를 제외한 기타 정보
                this.subOrderData.filter((res, idx) => {
                    if (this.subOrderCnt[res.orderNo]) {
                        this.subOrderCnt[res.orderNo].count =
                            this.subOrderCnt[res.orderNo].count + 1
                    } else {
                        this.subOrderCnt[res.orderNo] = {
                            count: 1,
                            orderNo: res.orderNo,
                            index: idx
                        }
                    }
                })

                // 주문번호, 배송분류 정보
                this.subOrderData.filter((res, idx) => {
                    if (this.subDeliveryGoods[res.orderNo]) {
                        this.subDeliveryGoods[res.orderNo].count =
                            this.subDeliveryGoods[res.orderNo].count + 1
                    } else {
                        this.subDeliveryGoods[res.orderNo] = {
                            count: 1,
                            orderNo: res.orderNo,
                            typeName: [],
                            shop: [],
                            index: idx
                        }
                    }
                })

                this.subOrderData.filter((res, idx) => {
                    if (this.subDeliveryGoods[res.orderNo].typeName[res.typeName]) {
                        this.subDeliveryGoods[res.orderNo].typeName[res.typeName].count =
                            this.subDeliveryGoods[res.orderNo].typeName[res.typeName].count +
                            1
                    } else {
                        this.subDeliveryGoods[res.orderNo].typeName[res.typeName] = {
                            count: 1,
                            orderNo: res.orderNo,
                            typeName: res.typeName,
                            shop: [],
                            index: idx
                        }
                    }
                })

                // 주문번호, 배송분류와 점포정보
                this.subOrderData.filter((res, idx) => {
                    if (
                        this.subDeliveryGoods[res.orderNo].typeName[res.typeName].shop[
                        res.shopName
                        ]
                    ) {
                        this.subDeliveryGoods[res.orderNo].typeName[res.typeName].shop[
                            res.shopName
                        ].count =
                            this.subDeliveryGoods[res.orderNo].typeName[res.typeName].shop[
                                res.shopName
                            ].count + 1
                    } else {
                        this.subDeliveryGoods[res.orderNo].typeName[res.typeName].shop[
                            res.shopName
                        ] = {
                            shopName: res.shopName,
                            typeName: res.typeName,
                            count: 1,
                            index: idx
                        }
                    }
                })
            }
        },
        objectSpanMethod({ row, rowIndex, columnIndex }) {
            // 점포, 상품을 제외한 기타 정보정렬
            if (
                columnIndex === 0 ||
                columnIndex === 1 ||
                columnIndex === 2 ||
                columnIndex === 3 ||
                columnIndex === 4 ||
                columnIndex === 5
            ) {
                if (rowIndex === this.subOrderCnt[row.orderNo].index) {
                    return {
                        rowspan: this.subOrderCnt[row.orderNo].count,
                        colspan: 1
                    }
                } else {
                    return {
                        rowspan: 0,
                        colspan: 0
                    }
                }
            }

            // 점포정렬
            if (
                columnIndex === 6 ||
                columnIndex === 7 ||
                columnIndex === 8 ||
                columnIndex === 9
            ) {
                if (
                    rowIndex ===
                    this.subDeliveryGoods[row.orderNo].typeName[row.typeName].shop[
                        row.shopName
                    ].index
                ) {
                    return {
                        rowspan: this.subDeliveryGoods[row.orderNo].typeName[row.typeName]
                            .shop[row.shopName].count,
                        colspan: 1
                    }
                } else {
                    return {
                        rowspan: 0,
                        colspan: 0
                    }
                }
            }
        },
        setCancelOrder() {
            // 주문취소하기
            if (this.isClicked) {
                return
            }

            if (this.cancelReason.trim() === "") {
                showToast(this, "请输入理由", "warning")
                return
            }

            const query = {
                info: this.cancelReason
            }
            this.isClicked = true

            setCancelOrder(this.orderId, query).then(response => {
                this.setCancelDialog()
                this.isClicked = false

                if (response === "") {
                    showToast(this, "操作成功", "success")
                    this.getOrderData("", this.activeTabOption)
                }
            })
        },
        setRefundOrder() {
            // 주문환불하기
            if (this.isClicked) {
                return
            }

            if (this.refundReason.trim() === "") {
                showToast(this, "请输入理由", "warning")
                return
            }

            const query = {
                info: this.refundReason
            }
            this.isClicked = true

            if (this.refundKind === "all") {
                setRefundOrder(this.orderId, query).then(response => {
                    this.setCancelDialog()
                    this.isClicked = false

                    if (response === "") {
                        showToast(this, "操作成功", "success")
                        this.getOrderData("", this.activeTabOption)
                    }
                })
            } else {
                setRefundSingleOrder(this.orderId, this.refundGoodsId, query).then(
                    response => {
                        this.setCancelDialog()
                        this.isClicked = false

                        if (response === "") {
                            showToast(this, "操作成功", "success")
                            this.getOrderData("refund", this.activeTabOption)
                        }
                    }
                )
            }
        },
        async setOrderFinish(orderid, dutyAdmin) {
            // 수화확인
            if (dutyAdmin === "" || dutyAdmin === null) {
                showToast(this, "请填写当天值班人员", "warning")
                return
            }

            if (this.isClicked) {
                return
            }

            const isSuccess = await this.openMessageBox("是否确认？")

            if (!isSuccess) {
                return
            }

            this.orderId = orderid
            this.isClicked = true

            setFinishOrder(orderid).then(response => {
                if (response === "") {
                    showToast(this, "操作成功", "success")
                    this.getOrderData("", this.activeTabOption)
                }

                this.isClicked = false
            })
        },
        async setSendDelivery(orderid, dutyAdmin) {
            // 수화발송하기(배달)
            if (dutyAdmin === "" || dutyAdmin === null) {
                showToast(this, "请填写当天值班人员", "warning")
                return
            }

            if (this.isClicked) {
                return
            }

            const isSuccess = await this.openMessageBox("是否确认？")

            if (!isSuccess) {
                return
            }

            this.isClicked = true

            setSendDelivery(parseInt(orderid)).then(response => {
                if (response === "") {
                    showToast(this, "操作成功", "success")
                    this.getOrderData("", this.activeTabOption)
                }

                this.isClicked = false
            })
        },
        setSendShipping(orderid, deliveryNo, companyCode) {
            // 수화발송하기
            if (this.isClicked) {
                return
            }

            if (deliveryNo === "") {
                showToast(this, "请输入运单号", "warning")
                return
            }

            if (companyCode === "") {
                showToast(this, "请选择配送公司", "warning")
                return
            }

            this.isClicked = true
            const value = {
                deliveryCompanyCode: companyCode,
                deliveryNo: deliveryNo
            }
            let values = []
            values.push(value)
            const query = {
                orderId: orderid,
                orderDeliveryInfoDtos: values
            }

            setSendShipping(parseInt(this.orderId), query).then(response => {
                if (response === "") {
                    showToast(this, "操作成功", "success")
                    this.getOrderData("", this.activeTabOption)

                    this.tempOrderInfo.filter(res => {
                        if (res.deliveryNum === deliveryNo) {
                            res.deliveryNo = deliveryNo
                            res.deliveryCompanyCode = companyCode

                            this.deliveryCompany.filter(val => {
                                if (val.code === companyCode) {
                                    res.deliveryName = val.name
                                }
                            })

                            this.subOrderData.filter(value => {
                                if (value.id === res.id) {
                                    value.deliveryNo = deliveryNo

                                    this.deliveryCompany.filter(val => {
                                        if (val.code === companyCode) {
                                            value.deliveryName = val.name
                                        }
                                    })
                                }
                            })
                        }
                    })
                }

                this.isClicked = false
            })
        },
        setShowOrderDialog(row, parentId, payDt, orderStatus, parentNo, dutyAdmin) {
            // 주문번호 클릭할 때 주문번호에 다르는 주문정보 로출
            this.isShowOrderDialog = true
            this.subOrderData = []
            this.subOrderCnt = []
            this.subDeliveryGoods = []

            row.filter(res => {
                res.packages.filter(val => {
                    val.shops.filter(v => {
                        v.goods.filter(vv => {
                            let value = {
                                parentId: parentId,
                                id: res.id,
                                deliveryNo: res.deliveryNo,
                                parentNo: parentNo,
                                orderNo: res.orderNo,
                                deliveryName: res.deliveryName,
                                deliveryStatus: res.deliveryStatus,
                                payDt: payDt,
                                orderStatus: orderStatus,
                                deliveryTypeName: res.deliveryTypeName,
                                deliveryType: res.deliveryType,
                                deliveryPrice: res.deliveryPrice,
                                typeId: val.typeId,
                                typeName: val.typeName,
                                shopName: v.shopName,
                                shopPhone: v.shopPhone,
                                shopOwner: v.shopOwner,
                                goodsName: vv.goodsName,
                                goodsShortName: vv.goodsShortName,
                                sizeName: vv.sizeName,
                                goodsImg: vv.goodsImg,
                                packageType: vv.packageType,
                                packagePrice: vv.packagePrice,
                                goodsPrice: vv.goodsPrice,
                                goodsWeight: vv.goodsWeight,
                                goodsNum: vv.goodsNum,
                                dutyAdmin: dutyAdmin,
                                postageFreeStatus: res.postageFreeStatus,
                                refundStatus: vv.refundStatus,
                                goodsId: vv.goodsId,
                                refundDt: vv.refundDt
                            }

                            this.subOrderData.push(value)
                        })
                    })
                })
            })

            // 주문번호, 배송분류, 점포명을 기준으로 상품정렬
            this.subOrderData.sort((a, b) => {
                if (a.orderNo < b.orderNo) {
                    return -1
                }

                if (a.orderNo > b.orderNo) {
                    return 1
                }

                if (a.typeName < b.typeName) {
                    return -1
                }

                if (a.typeName > b.typeName) {
                    return 1
                }

                if (a.shopName < b.shopName) {
                    return -1
                }

                if (a.shopName > b.shopName) {
                    return 1
                }

                return 0
            })

            // 상품, 점포정보, 배송분류를 제외한 기타 정보
            this.subOrderData.filter((res, idx) => {
                if (this.subOrderCnt[res.orderNo]) {
                    this.subOrderCnt[res.orderNo].count =
                        this.subOrderCnt[res.orderNo].count + 1
                } else {
                    this.subOrderCnt[res.orderNo] = {
                        count: 1,
                        orderNo: res.orderNo,
                        index: idx
                    }
                }
            })

            // 주문번호, 배송분류 정보
            this.subOrderData.filter((res, idx) => {
                if (this.subDeliveryGoods[res.orderNo]) {
                    this.subDeliveryGoods[res.orderNo].count =
                        this.subDeliveryGoods[res.orderNo].count + 1
                } else {
                    this.subDeliveryGoods[res.orderNo] = {
                        count: 1,
                        orderNo: res.orderNo,
                        typeName: [],
                        shop: [],
                        index: idx
                    }
                }
            })

            this.subOrderData.filter((res, idx) => {
                if (this.subDeliveryGoods[res.orderNo].typeName[res.typeName]) {
                    this.subDeliveryGoods[res.orderNo].typeName[res.typeName].count =
                        this.subDeliveryGoods[res.orderNo].typeName[res.typeName].count + 1
                } else {
                    this.subDeliveryGoods[res.orderNo].typeName[res.typeName] = {
                        count: 1,
                        orderNo: res.orderNo,
                        typeName: res.typeName,
                        shop: [],
                        index: idx
                    }
                }
            })

            // 주문번호, 배송분류와 점포정보
            this.subOrderData.filter((res, idx) => {
                if (
                    this.subDeliveryGoods[res.orderNo].typeName[res.typeName].shop[
                    res.shopName
                    ]
                ) {
                    this.subDeliveryGoods[res.orderNo].typeName[res.typeName].shop[
                        res.shopName
                    ].count =
                        this.subDeliveryGoods[res.orderNo].typeName[res.typeName].shop[
                            res.shopName
                        ].count + 1
                } else {
                    this.subDeliveryGoods[res.orderNo].typeName[res.typeName].shop[
                        res.shopName
                    ] = {
                        shopName: res.shopName,
                        typeName: res.typeName,
                        count: 1,
                        index: idx
                    }
                }
            })
        },
        setShowReceiverInfoDialog(userName, userPhone, deliveryAddress) {
            // 수화인배송주소다이얼로그 로출
            this.isShowReceiverDialog = true

            this.userName = userName
            this.userPhone = userPhone
            this.deliveryAddress = deliveryAddress
        },
        setShowDeliveryStatusDialog(orderid, suborderid, deliveryNo) {
            // 배송진행상태 확인 다이얼로그 로출
            this.isShowDeliveryStatusDialog = true

            getDeliveryStatus(orderid, suborderid, deliveryNo).then(response => {
                if (response.code === 0) {
                    this.deliveryNo = response.data.deliveryNo
                    this.deliveryName = response.data.deliveryName
                    this.orderNo = response.data.orderNo
                    this.address = response.data.address
                    this.tracks = response.data.tracks
                }
            })
        },
        setShowCancelDialog(orderid, dutyAdmin) {
            // 주문취소다이얼로그 로출
            if (dutyAdmin === "" || dutyAdmin === null) {
                showToast(this, "请填写当天值班人员", "warning")
                return
            }

            this.isShowCancelDialog = true
            this.cancelReason = ""
            this.orderId = orderid
        },
        setShowSendDialog(data, orderNo, orderid, dutyAdmin, index, kind) {
            // 수화발송다이얼로그 로출
            if (dutyAdmin === "" || dutyAdmin === null) {
                showToast(this, "请填写当天值班人员", "warning")
                return
            }

            this.kind = kind
            this.tempOrderInfo = []
            this.isShowSendDialog = true
            let temp = []

            if (index === "all") {
                data.filter(res => {
                    let value = {
                        deliveryName: res.deliveryName,
                        deliveryNo: res.deliveryNo,
                        deliveryNum: res.deliveryNo,
                        deliveryPrice: res.deliveryPrice,
                        deliveryStatus: res.deliveryStatus,
                        deliveryType: res.deliveryType,
                        deliveryTypeName: res.deliveryTypeName,
                        id: res.id,
                        parentNo: orderNo,
                        orderNo: res.orderNo,
                        packageTypeName: res.packageTypeName,
                        deliveryWeight: 0
                    }

                    res.packages.filter(val => {
                        val.shops.filter(v => {
                            v.goods.filter(vv => {
                                value.deliveryWeight += vv.goodsWeight * vv.goodsNum
                            })
                        })
                    })

                    let isExist = false

                    this.deliveryCompany.filter(val => {
                        if (val.name === res.deliveryName) {
                            value.deliveryCompanyCode = val.code
                            isExist = true
                        }
                    })

                    if (!isExist) {
                        value.deliveryCompanyCode = ""
                    }

                    temp.push(value)
                })

                this.orderId = orderid
            }

            if (index === "sub") {
                let values = {}
                let exist = ""

                data.filter(res => {
                    if (
                        res.id === orderid &&
                        this.tempOrderInfo.length === 0 &&
                        exist.search(orderid) === -1
                    ) {
                        values = {
                            deliveryName: res.deliveryName,
                            deliveryNo: res.deliveryNo,
                            deliveryNum: res.deliveryNo,
                            deliveryPrice: res.deliveryPrice,
                            deliveryStatus: res.deliveryStatus,
                            deliveryType: res.deliveryType,
                            deliveryTypeName: res.deliveryTypeName,
                            id: res.id,
                            parentNo: res.parentNo,
                            orderNo: res.orderNo,
                            deliveryWeight: 0
                        }

                        values.deliveryWeight += res.goodsWeight * res.goodsNum

                        let isExist = false

                        this.deliveryCompany.filter(val => {
                            if (val.name === res.deliveryName) {
                                values.deliveryCompanyCode = val.code
                                isExist = true
                            }
                        })

                        if (!isExist) {
                            values.deliveryCompanyCode = ""
                        }

                        temp.push(values)
                        exist += res.id + ","
                    }
                })

                this.orderId = data[0].parentId
            }

            this.tempOrderInfo = temp
            this.orderNo = orderNo
        },
        setShowRefundDialog(orderid, dutyAdmin, goodsId, kind) {
            // 환불다이얼로그 로출
            if (dutyAdmin === "" || dutyAdmin === null || dutyAdmin === undefined) {
                showToast(this, "请填写当天值班人员", "warning")
                return
            }

            this.isShowRefundDialog = true
            this.refundReason = ""
            this.orderId = orderid
            this.refundGoodsId = goodsId
            this.refundKind = kind
        },
        setShowDutyDialog(orderid, dutyAdmin, index) {
            if (dutyAdmin === "" || dutyAdmin === null) {
                showToast(this, "请填写当天值班人员", "warning")
                return
            }

            this.isShowDialogDuty = true
            this.warningInfo = ""
            this.orderId = orderid
            this.dutyAdmin = dutyAdmin
            this.isDutyStatus = index === "warning"

            getOrderWarningInfo(orderid).then(response => {
                if (response.code === 0) {
                    this.warningData = response.data
                }
            })
        },
        setCancelDialog() {
            this.isShowOrderDialog = false
            this.isShowReceiverDialog = false
            this.isShowDeliveryStatusDialog = false
            this.isShowCancelDialog = false
            this.isShowRefundDialog = false
            this.isShowPrintDialog = false
            this.isShowDialogDuty = false
        },
        setCancelSendDialog() {
            this.isShowSendDialog = false
        },
        setNormalBatchPrint() {
            if (this.isClicked) {
                return
            }

            if (this.batchOrderData.length === 0) {
                showToast(this, "请选择要打印的订单", "warning")
                return
            }

            this.isClicked = true
            const query = {
                ids: this.batchIds
            }

            getOrderPrintInfo(query).then(response => {
                if (response.code === 0) {
                    setTimeout(() => {
                        printJS({
                            printable: this.$refs.print_normal_batch.id,
                            type: "html",
                            targetStyles: ["*"]
                        })

                        this.isClicked = false
                    }, 1000)
                }
            })
        },
        setPrint(row) {
            if (this.isClicked) {
                return
            }

            this.todayDate = this.$moment(new Date()).format("MM-DD HH:mm:ss")
            this.printData = []
            this.freePrintData = []
            this.isClicked = true
            const query = {
                ids: [row.id]
            }

            // 인쇄한 개수를 증가하기 위해 해당 API 호출. 그외에는 다른 역할 없음
            getOrderPrintInfo(query).then(response => {
                if (response.code === 0) {
                    this.orderData.filter(res => {
                        if (parseInt(res.id) === parseInt(row.id)) {
                            res.printNum = parseInt(res.printNum) + 1
                        }
                    })

                    if (row.deliveryAddress.search("北京城区") !== -1) {
                        this.province = row.deliveryAddress.replace("北京城区", " ")
                    } else if (row.deliveryAddress.search("上海城区") !== -1) {
                        this.province = row.deliveryAddress.replace("上海城区", " ")
                    } else if (row.deliveryAddress.search("天津城区") !== -1) {
                        this.province = row.deliveryAddress.replace("天津城区", " ")
                    } else {
                        this.province = row.deliveryAddress
                    }

                    this.orderNo = row.orderNo
                    this.createDt = row.createDt
                    this.userName = row.userName
                    this.userPhone = row.phoneNum
                    this.orderPrice = row.orderPrice
                    this.deliveryPrice = row.deliveryPrice
                    this.packagePrice = row.packagePrice
                    this.orderRemark = row.orderRemark
                    this.deliveryType = row.deliveryTypeName
                    this.deliveryWeight = row.deliveryWeight

                    let tmpPrint = []
                    let tmpShop = []

                    row.deliveries.filter((res, idx) => {
                        tmpPrint = []
                        let kkk = {
                            deliveryType: res.deliveryTypeName,
                            deliveryName: res.deliveryName,
                            postageFreeStatus: res.postageFreeStatus,
                            lastDt: response.data[0].deliveryDtos[idx].lastDt,
                            lastDuration: response.data[0].deliveryDtos[idx].lastDuration,
                            shops: []
                        }

                        res.packages.filter(r => {
                            r.shops.filter(val => {
                                tmpShop = []
                                let vvv = {
                                    shopName: val.shopName,
                                    goods: []
                                }

                                val.goods.filter(v => {
                                    if (v.refundStatus === '0') {
                                        let zzz = {
                                            goodsName: v.goodsName,
                                            goodsShortName: v.goodsShortName,
                                            goodsNum: v.goodsNum,
                                            goodsPrice: v.goodsPrice,
                                            totalPrice: v.goodsPrice * v.goodsNum,
                                            sizeName: v.sizeName,
                                            goodsUnit: v.goodsUnit
                                        }

                                        tmpShop.push(zzz)
                                    }
                                })

                                vvv.goods = tmpShop
                                tmpPrint.push(vvv)
                            })
                        })

                        kkk.shops = tmpPrint
                        this.printData.push(kkk)
                    })

                    setTimeout(() => {
                        printJS({
                            printable: this.$refs.print.id,
                            type: "html",
                            targetStyles: ["*"]
                        })

                        this.isClicked = false
                    }, 1000)
                }
            })
        },
        setAutoSendShipping(orderNo, subOrderNo) {
            if (this.isClicked) {
                return
            }

            this.isClicked = true

            setAutoSendShipping(orderNo, subOrderNo).then(response => {
                if (response === "") {
                    showToast(this, "操作成功", "success")
                    this.getOrderData("", this.activeTabOption)
                }

                this.isClicked = false
            })
        },
        handleSelectionChange(row) {
            // 테블 체크박스 선택
            this.batchIds = []
            this.batchOrderData = []

            row.filter(res => {
                let tmpPrint = []
                let tmpShop = []
                let printData = []

                res.deliveries.filter(rs => {
                    tmpPrint = []
                    let kkk = {
                        deliveryType: rs.deliveryTypeName,
                        deliveryName: rs.deliveryName,
                        postageFreeStatus: rs.postageFreeStatus,
                        shops: []
                    }

                    rs.packages.filter(r => {
                        r.shops.filter(val => {
                            tmpShop = []
                            let vvv = {
                                shopName: val.shopName,
                                goods: []
                            }

                            val.goods.filter(v => {
                                if (v.refundStatus === '0') {
                                    let zzz = {
                                        goodsName: v.goodsName,
                                        goodsShortName: v.goodsShortName,
                                        goodsNum: v.goodsNum,
                                        goodsPrice: v.goodsPrice,
                                        totalPrice: v.goodsPrice * v.goodsNum,
                                        sizeName: v.sizeName,
                                        goodsUnit: v.goodsUnit
                                    }

                                    tmpShop.push(zzz)
                                }
                            })

                            vvv.goods = tmpShop
                            tmpPrint.push(vvv)
                        })
                    })

                    kkk.shops = tmpPrint
                    printData.push(kkk)
                })

                res.printData = printData
                res.todayDate = this.$moment(new Date()).format("MM-DD HH:mm:ss")
            })

            row.filter(res => {
                this.batchIds.push(parseInt(res.id))
            })

            this.batchOrderData = row
        },
        setBatchPrint() {
            // 일괄프린트 설정
            this.printData = []
            this.freePrintData = []
            this.todayDate = this.$moment(new Date()).format("YYYY年MM月DD日 HH:mm")

            if (this.isClicked) {
                return
            }

            if (this.batchIds.length === 0) {
                showToast(this, "请选择要打印的订单", "warning")
                return
            }

            const query = {
                ids: this.batchIds
            }

            setMultiPrintInfo(query).then(response => {
                if (response.code === 0) {
                    this.getOrderData("", this.activeTabOption)
                    this.printData = response.data.list
                    this.freePrintData = response.data.postageFreeList

                    setTimeout(() => {
                        this.isClicked = false
                        printJS({
                            printable: this.$refs.batch_print.id,
                            type: "html",
                            targetStyles: ["*"]
                        },
                            1000
                        )
                    })
                }
            })
        },
        async setOrderBatchRead() {
            if (this.isClicked) {
                return
            }

            const isSuccess = await this.openMessageBox("是否确认？")

            if (!isSuccess) {
                return
            }

            if (this.batchIds.length === 0) {
                showToast(this, "请勾选需要未读拣货清单的订单", "warning")
                return
            }

            const query = {
                ids: this.batchIds
            }

            setOrderBatchRead(query).then(response => {
                if (response === "") {
                    showToast(this, "操作成功", "success")
                    this.getOrderData("", this.activeTabOption)
                }

                this.isClicked = false
            })
        },
        async setReadyDeliveryStatus() {
            if (this.isClicked) {
                return
            }

            if (this.batchIds.length === 0) {
                showToast(this, "请选择未准备发货的订单", "warning")
                return
            }

            const isSuccess = await this.openMessageBox("是否确认？")

            if (!isSuccess) {
                return
            }

            const query = {
                ids: this.batchIds
            }

            setOrderReadyDeliveryStatus(query).then(response => {
                if (response === "") {
                    showToast(this, "操作成功", "success")
                    this.getOrderData("", this.activeTabOption)
                }

                this.isClicked = false
            })
        },
        async setOrderSingleRead(orderId) {
            if (this.isClicked) {
                return
            }

            const isSuccess = await this.openMessageBox("是否确认？")

            if (!isSuccess) {
                return
            }

            setOrderSingleRead(orderId).then(response => {
                if (response === "") {
                    showToast(this, "操作成功", "success")
                    this.getOrderData("", this.activeTabOption)

                    this.tempOrderInfo.filter(res => {
                        if (res.orderNo === subOrderNo) {
                            res.deliveryNo = "1"
                        }
                    })
                }

                this.isClicked = false
            })
        },
        setAddWarningInfo() {
            if (this.warningInfo.trim() === "") {
                showToast(this, "请输入异常信息", "warning")
                return
            }

            const query = {
                warningInfo: this.warningInfo
            }

            setAddWarningInfo(this.orderId, query).then(response => {
                if (response.code === 0) {
                    showToast(this, "操作成功", "success")
                    this.setCancelDialog()
                    this.getOrderData("", this.activeTabOption)
                }
            })
        },
        async setConfirmFutureDelivery() {
            if (this.isClicked) {
                return
            }

            const isSuccess = await this.openMessageBox("是否确认？")

            if (!isSuccess) {
                return
            }

            if (this.batchIds.length === 0) {
                showToast(this, "请勾选需要未读拣货清单的订单", "warning")
                return
            }

            const query = {
                ids: this.batchIds
            }

            setConfirmFutureDelivery(query).then(response => {
                if (response === "") {
                    showToast(this, "操作成功", "success")
                    this.getOrderData("", this.activeTabOption)
                }

                this.isClicked = false
            })
        },
        async setConfirmWarningDelivery() {
            if (this.isClicked) {
                return
            }

            const isSuccess = await this.openMessageBox("是否确认？")

            if (!isSuccess) {
                return
            }

            if (this.batchIds.length === 0) {
                showToast(this, "请勾选需要未读拣货清单的订单", "warning")
                return
            }

            const query = {
                ids: this.batchIds
            }

            setConfirmWarningDelivery(query).then(response => {
                if (response === "") {
                    showToast(this, "操作成功", "success")
                    this.getOrderData("", this.activeTabOption)
                }

                this.isClicked = false
            })
        },
        async setConfirmWarningDeliveryFromFuture() {
            if (this.isClicked) {
                return
            }

            const isSuccess = await this.openMessageBox("是否确认？")

            if (!isSuccess) {
                return
            }

            if (this.batchIds.length === 0) {
                showToast(this, "请勾选需要未读拣货清单的订单", "warning")
                return
            }

            const query = {
                ids: this.batchIds
            }

            setConfirmWarningDeliveryFromFuture(query).then(response => {
                if (response === "") {
                    showToast(this, "操作成功", "success")
                    this.getOrderData("", this.activeTabOption)
                }

                this.isClicked = false
            })
        },
        async setConfirmWarningOrderReady() {
            if (this.isClicked) {
                return
            }

            const isSuccess = await this.openMessageBox("是否确认？")

            if (!isSuccess) {
                return
            }

            if (this.batchIds.length === 0) {
                showToast(this, "请转入已准备发货清单的订单", "warning")
                return
            }

            const query = {
                ids: this.batchIds
            }

            setConfirmWarningOrderReady(query).then(response => {
                if (response === "") {
                    showToast(this, "操作成功", "success")
                    this.getOrderData("", this.activeTabOption)
                }

                this.isClicked = false
            })
        },
        setExportOrderGoods() {
            setExportOrderGoods().then(response => {
                if (response.code === 0) {
                    if (response.data.uri !== "") {
                        window.location.href = response.data.uri
                    }
                }
            })
        },
        getDeliveryStatusNum() {
            getDeliveryStatusNum().then(response => {
                if (response.code === 0) {
                    this.notReadyNum = response.data.notReadyNum
                    this.readyNum = response.data.readyNum
                    this.futureNum = response.data.futureNum
                    this.warningNum = response.data.warningNum
                }
            })
        },
        setExportOrderDeliveryControll() {
            const label = this.tabOption.find((rs) => rs.key === this.activeTabOption)
            
            exportOrderDeliveryControll(label.label_en).then(response => {
                if (response.code === 0) {
                    if (response.data.uri !== "") {
                        window.location.href = response.data.uri
                    }
                }
            })
        }
    }
}