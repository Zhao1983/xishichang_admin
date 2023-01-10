import Pagination from "@/components/Pagination" // 페이징 콘퍼넨트 추가
import elDragDialog from "@/directive/el-drag-dialog"

import { MessageBox } from "element-ui" // 메세지다이얼로그 추가
import {
    getCookieData,
    setClearGoodsBatchSearchField,
    setClearGoodsSearchField,
    setClearShopBatchField,
    setClearShopSearchField,
    setCookieData
} from "@/utils/auth" // 쿠키설정
import { setAddComma, setAddCommaTwo, showToast } from "@/utils/" // 토스트 설정
import {
    getDeliveryStatus,
    getOrders,
    getOrderStatus,
    getOrderTotalPrice,
    getOrderWarningInfo,
    setAddWarningInfo,
    setAutoSendShipping,
    setCancelOrder,
    setExportOrderData,
    setFinishOrder,
    setRefundOrder,
    setRefundSingleOrder,
    setSendDelivery,
    setSendShipping
} from "@/api/order" // 주문데이터 API 추가
import { getAllDeliveryCompany } from "@/api/shipping"

export default {
    name: "Order_list",
    components: {
        Pagination
    },
    created() {
        setClearGoodsSearchField()
        setClearGoodsBatchSearchField()
        setClearShopSearchField()
        setClearShopBatchField()

        this.getDeliveryCompany()
        this.getOrderStatusData()
        this.getOrderData("")
        this.getOrderTotalPrice()
    },
    mounted() {
        window.addEventListener("keyup", this.setInputValue)

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
    data() {
        return {
            listLoading: false,
            searchDeliveryType: parseInt(getCookieData("order_deliverytype")), // 배송방식
            searchOrderNo: getCookieData("order_orderno"), // 주문번호
            receiverInfo: "", // 수화인정보
            searchOrderStatus: getCookieData("order_orderstatus") ? getCookieData("order_orderstatus") : "", // 주문상태
            searchPayStatus: parseInt(getCookieData("order_paystatus")), // 결제상태
            searchAddress: getCookieData("order_address"), // 수화주소
            searchUserPhone: getCookieData("order_phone"), // 수화인전화번호
            searchUserName: getCookieData("order_username"), // 수화인명
            searchGoodsName: getCookieData("order_goodsname"), // 상품명
            searchWarningStatus: 0, // 직발상태
            searchClientType: 0, // 주문종류(공증호, 미니앱)
            searchDeliveryNo: getCookieData("order_deliveryno"), // 배송번호
            beginDt: getCookieData("order_sdate"), // 주문창조날자
            endDt: getCookieData("order_edate"), // 주문완료날자
            deliveryBeginDt: getCookieData("delivery_sdate"),
            deliveryEndDt: getCookieData("delivery_edate"),
            page: parseInt(getCookieData("order_page")), // 테블페지수
            size: parseInt(getCookieData("order_size")), // 테블에 보여지는 주문수
            totalDeliveryPrice: 0,
            totalPackagePrice: 0,
            totalDeliveryWeight: 0,
            totalOrderPrice: 0,
            totalGoodsPrice: 0,
            totalNum: 0, // 주문총개수
            orderData: [], // 주문정보 배렬
            subOrderData: [], // 서브주문정보 배렬
            expandKeys: [],
            subOrderCnt: [],
            subDeliveryGoods: [],
            isShowOrderDialog: false,
            isShowReceiverDialog: false,
            isShowDeliveryStatusDialog: false,
            isShowCancelDialog: false,
            isShowSendDialog: false,
            isShowRefundDialog: false,
            userName: "", // 수화인명
            userPhone: "", // 수화인폰번호
            provinceName: "", // 수화성시명
            cityName: "", // 수화시명
            countryName: "", // 수화지역명
            deliveryAddress: "", // 주소상세
            houseNo: "",
            addressInfo: "", // 수화상세주소
            deliveryNo: "", // 배송번호
            deliveryName: "", // 배송회사명
            orderNo: "", // 주문번호
            address: "", // 수화주소
            tracks: [], // 배송진행상태 배렬
            cancelReason: "", // 취소리유
            orderId: 0, // 주문아이디
            isClicked: false,
            tempOrderInfo: [],
            refundReason: "", // 환불리유
            deliveryWeight: 0,
            deliveryPrice: 0,
            orderStatusData: [], // 배송상태 배렬
            kind: "", // 택배일 때 자동/수동 상태값
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
            permissionRefund: false // 환불권한상태값
        }
    },
    methods: {
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
        getDeliveryCompany() {
            getAllDeliveryCompany().then(response => {
                if (response.code === 0) {
                    this.deliveryCompany = response.data
                }
            })
        },
        setChangeDate(index) {
            // 마감날자가 시작날자보다 작은 경우 처리하기
            const startdate =
                index === "order" ?
                    this.$moment(this.beginDt)
                        .format("YYYY-MM-DD")
                        .split("-") :
                    this.$moment(this.deliveryBeginDt)
                        .format("YYYY-MM-DD")
                        .split("-")
            const lastdate =
                index === "order" ?
                    this.$moment(this.endDt)
                        .format("YYYY-MM-DD")
                        .split("-") :
                    this.$moment(this.deliveryEndDt)
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
                if (index === "order") {
                    this.endDt = this.beginDt
                }

                if (index === "delivery") {
                    this.deliveryEndDt = this.deliveryBeginDt
                }
            }

            if (index === "order") {
                this.beginDt =
                    this.beginDt === "" || this.beginDt === null ?
                        "" :
                        this.$moment(this.beginDt).format("YYYY-MM-DD")
                this.endDt =
                    this.endDt === "" || this.endDt === null ?
                        "" :
                        this.$moment(this.endDt).format("YYYY-MM-DD")
            }

            if (index === "delivery") {
                this.deliveryBeginDt =
                    this.deliveryBeginDt === "" || this.deliveryBeginDt === null ?
                        "" :
                        this.$moment(this.deliveryBeginDt).format("YYYY-MM-DD")
                this.deliveryEndDt =
                    this.deliveryEndDt === "" || this.deliveryEndDt === null ?
                        "" :
                        this.$moment(this.deliveryEndDt).format("YYYY-MM-DD")
            }
        },
        getOrderStatusData() {
            getOrderStatus().then(response => {
                if (response.code === 0) {
                    this.orderStatusData = response.data
                }
            })
        },
        getOrderTotalPrice() {
            const query = {
                deliveryType: this.searchDeliveryType,
                userName: this.searchUserName.trim(),
                userPhone: this.searchUserPhone.trim(),
                goodsName: this.searchGoodsName.trim(),
                orderNo: this.searchOrderNo.trim(),
                deliveryNo: this.searchDeliveryNo.trim(),
                orderStatus: this.searchOrderStatus,
                payStatus: this.searchPayStatus,
                address: this.searchAddress.trim(),
                beginDt: this.beginDt,
                endDt: this.endDt,
                deliveryBeginDt: this.deliveryBeginDt,
                deliveryEndDt: this.deliveryEndDt,
                warningStatus: this.searchWarningStatus === 0 ? "" : "1",
                page: this.page,
                size: this.size
            }

            getOrderTotalPrice(query).then(response => {
                if (response.code === 0) {
                    this.totalDeliveryPrice = response.data.deliveryPrice
                    this.totalPackagePrice = response.data.packagePrice
                    this.totalDeliveryWeight = response.data.deliveryWeight
                    this.totalOrderPrice = response.data.orderPrice
                    this.totalGoodsPrice = response.data.goodsPrice
                }
            })
        },
        getOrderData(kind) {
            // 주문정보 얻기
            const query = {
                deliveryType: this.searchDeliveryType,
                userName: this.searchUserName.trim(),
                userPhone: this.searchUserPhone.trim(),
                goodsName: this.searchGoodsName.trim(),
                orderNo: this.searchOrderNo.trim(),
                deliveryNo: this.searchDeliveryNo.trim(),
                orderStatus: this.searchOrderStatus,
                payStatus: this.searchPayStatus,
                address: this.searchAddress.trim(),
                beginDt: this.beginDt,
                endDt: this.endDt,
                deliveryBeginDt: this.deliveryBeginDt,
                deliveryEndDt: this.deliveryEndDt,
                warningStatus: this.searchWarningStatus === 0 ? "" : "1",
                clientType: parseInt(this.searchClientType),
                page: this.page,
                size: this.size
            }

            this.listLoading = true

            getOrders(query).then(response => {
                if (response.code === 0) {
                    this.totalNum = response.data.totalNum
                    this.size = response.data.size
                    this.page = response.data.page
                    setCookieData("order_page", this.page)

                    response.data.list.filter(res => {
                        res.deliveries.filter(rs => {
                            rs.deliveryNo = rs.deliveryNo ? rs.deliveryNo : ""
                        })
                    })

                    this.orderData = response.data.list

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
            this.getOrderData("")
            this.getOrderTotalPrice()

            setCookieData("order_orderno", this.searchOrderNo.trim())
            setCookieData("order_deliveryno", this.searchDeliveryNo.trim())
            setCookieData("order_username", this.searchUserName.trim())
            setCookieData("order_address", this.searchAddress.trim())
            setCookieData("order_sdate", this.beginDt)
            setCookieData("order_edate", this.endDt)
            setCookieData("delivery_sdate", this.deliveryBeginDt)
            setCookieData("delivery_edate", this.deliveryEndDt)
            setCookieData("order_phone", this.searchUserPhone.trim())
            setCookieData("order_goodsname", this.searchGoodsName.trim())
            setCookieData("order_paystatus", this.searchPayStatus)
            setCookieData("order_deliverytype", this.searchDeliveryType)
            setCookieData("order_orderstatus", this.searchOrderStatus)
            setCookieData("order_size", this.size)
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

            if (expandedRows.length !== 0) {
                this.expandKeys = []
                this.expandKeys.push(row.id)

                // 상품정렬용 상품정보
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
                                    goodsShortName: vv.goodsShortName,
                                    sizeName: vv.sizeName,
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
            } else {
                this.expandKeys = []
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
                    this.getOrderData("")
                }
            })
        },
        setRefundOrder() {
            // 주문환불
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
                        this.getOrderData("")
                    }
                })
            } else {
                setRefundSingleOrder(this.orderId, this.refundGoodsId, query).then(
                    response => {
                        this.setCancelDialog()
                        this.isClicked = false

                        if (response === "") {
                            showToast(this, "操作成功", "success")
                            this.getOrderData("refund")
                        }
                    }
                )
            }
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
                    this.getOrderData("")
                }

                this.isClicked = false
            })
        },
        setSendShipping(orderid, deliveryNo, companyCode) {
            // 수화발송하기(택배)
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
                    this.getOrderData("")

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
                    this.getOrderData("")
                }

                this.isClicked = false
            })
        },
        setShowOrderDialog(row, parentId, payDt, orderStatus, parentNo, dutyAdmin) {
            // 주문번호 클릭할 때 주문번호에 다르는 주문정보 로출
            this.isShowOrderDialog = true
            this.spanDeliveryNoCnt = []
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
            getDeliveryStatus(orderid, suborderid, deliveryNo).then(response => {
                if (response.code === 0) {
                    this.isShowDeliveryStatusDialog = true
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
                        deliveryWeight: 0,
                        deliveryCompanyCode: ""
                    }

                    res.packages.filter(val => {
                        val.shops.filter(v => {
                            v.goods.filter(vv => {
                                value.deliveryWeight += vv.goodsWeight * vv.goodsNum
                            })
                        })
                    })

                    this.deliveryCompany.filter(val => {
                        if (val.name === res.deliveryName) {
                            value.deliveryCompanyCode = val.code
                        }
                    })

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
                            deliveryWeight: 0,
                            deliveryCompanyCode: ""
                        }

                        values.deliveryWeight += res.goodsWeight * res.goodsNum

                        this.deliveryCompany.filter(val => {
                            if (val.name === res.deliveryName) {
                                values.deliveryCompanyCode = val.code
                            }
                        })

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
            this.isShowDialogDuty = false
        },
        setCancelSendDialog() {
            this.isShowSendDialog = false
        },
        setAutoSendShipping(orderNo, subOrderNo) {
            if (this.isClicked) {
                return
            }

            this.isClicked = true

            setAutoSendShipping(orderNo, subOrderNo).then(response => {
                if (response === "") {
                    showToast(this, "操作成功", "success")
                    this.getOrderData("")

                    this.tempOrderInfo.filter(res => {
                        if (res.orderNo === subOrderNo) {
                            res.deliveryNo = "1"
                        }
                    })
                }

                this.isClicked = false
            })
        },
        setExportOrderData() {
            const query = {
                deliveryType: this.searchDeliveryType,
                userName: this.searchUserName.trim(),
                userPhone: this.searchUserPhone.trim(),
                orderNo: this.searchOrderNo.trim(),
                deliveryNo: this.searchDeliveryNo.trim(),
                orderStatus: this.searchOrderStatus,
                payStatus: this.searchPayStatus,
                address: this.searchAddress.trim(),
                houseNo: this.houseNo.trim(),
                goodsName: this.searchGoodsName.trim(),
                clientType: parseInt(this.searchClientType),
                beginDt: this.beginDt,
                endDt: this.endDt,
                deliveryBeginDt: this.deliveryBeginDt,
                deliveryEndDt: this.deliveryEndDt
            }

            setExportOrderData(query).then(response => {
                if (response.code === 0) {
                    if (response.data.uri !== "") {
                        window.location.href = response.data.uri
                    }
                }
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
                    this.getOrderData("")
                }
            })
        }
    }
}