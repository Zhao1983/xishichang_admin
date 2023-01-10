import elDragDialog from '@/directive/el-drag-dialog'
import printJS from 'print-js'

import { MessageBox } from 'element-ui' // 메세지다이얼로그 추가
import {
    setClearGoodsBatchSearchField,
    setClearGoodsSearchField,
    setClearShopBatchField,
    setClearShopSearchField
} from '@/utils/auth' // 쿠키설정
import {
    setAddComma,
    setAddCommaTwo,
    showToast
} from '@/utils/' // 토스트 설정
import {
    getDeliveryStatus,
    getOrderDetail,
    setAddDeliveryCompany,
    setAutoSendShipping,
    setCancelOrder,
    setFinishOrder,
    setRefundOrder,
    setSendDelivery,
    setSendShipping,
    setOrderDeliveryAddress,
    setOrderForceInit
} from '@/api/order' // 주문데이터 API 추가
import { getAllDeliveryCompany } from '@/api/shipping'
import locationData from '@/assets/location.json'

export default {
    name: 'Order_detail',
    components: {},
    created() {
        setClearGoodsSearchField()
        setClearGoodsBatchSearchField()
        setClearShopSearchField()
        setClearShopBatchField()

        this.getDeliveryCompany()
        this.orderId = parseInt(this.$route.params && this.$route.params.id)
        this.getOrderData()
    },
    mounted() {
        window.addEventListener('keyup', this.setInputValue)
        const menuData = localStorage.getItem('menus') ? JSON.parse(localStorage.getItem('menus')) : []
        this.permissionForce = menuData.find((rs) => {
            if (rs.name === '订单管理') {
                return rs.subs.find((r) => r.name === '订单初始化按钮')
            }
        })
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
    data() {
        return {
            listLoading: false,
            orderId: 0, // 주문아이디
            subOrderId: 0, // 자식주문아이디
            orderNo: '', // 주문번호
            userNick: '', // 사용자닉네임
            createDt: '', // 주문날자
            payDt: '', // 지불날자
            deliveryDt: '', // 수화날자
            doneDt: '', // 주문완료날자
            refundDt: '', // 환불날자
            cancelDt: '', // 취소날자
            orderStatus: 0, // 주문상태값
            orderStatusName: '', // 주문상태명
            orderRemark: '', // 주문설명
            userName: '', // 수화인명
            userPhone: '', // 수화인폰번호
            addressInfo: '', // 수화상세주소
            houseNo: '', // 주소상세
            deliveryType: '', // 배송형태
            payNo: '', // 지불번호
            payType: '', // 지불형태
            payStatus: '', // 지불상태
            orderPrice: 0, // 주문금액
            goodsPrice: 0, // 판매금액
            deliveryPrice: 0, // 배송비
            deliveryWeight: 0, // 배송무게
            packagePrice: 0, // 포장비
            deliveries: [], // 배송정보 배렬
            orderData: [],
            subOrderData: [],
            orderGoods: [],
            tableOrderData: [],
            isShowOrderHistory: false,
            isShowDeliveryStatusDialog: false,
            isShowCancelDialog: false,
            isShowSendDialog: false,
            isShowRefundDialog: false,
            cancelReason: '', // 취소리유
            refundReason: '', // 환불리유
            deliveryNo: '', // 배송번호
            deliveryName: '', // 배송회사명
            tracks: [], // 배송진행상태 배렬
            tempOrderInfo: [],
            todayDate: '',
            printData: [],
            kind: '', // 택배일 때 자동/수동 상태값
            deliveryCompany: [], // 배송회사배렬
            deliveryCompanyByType: [], // 배송형태에 따르는 배송회사배렬
            isDeliveryStatus: false,
            packageWeight: 0,
            foamCount: 0,
            cartonCount: 0,
            prodWeight: 0,
            dutyAdmin: '', // 직발인원
            isShowDeliveryNumberDialog: false, // 택배번호추가다이얼로그 로출상태
            tmpSubOrderInfo: [],
            spanOrderCnt: [],
            dlgSpanOrderCnt: [],
            provinceData: locationData, // 전국의 성,시,지역정보
            cityData: [], // 시배렬
            countryData: [], // 지역배렬
            deliveryProvinceName: '', // 수화성시명
            deliveryCityName: '', // 수화시명
            deliveryCountryName: '', // 수화지역명
            isShowAddressDialog: false,
            deliveryUserName: '',
            deliveryUserPhone: '',
            provinceName: '', // 수화성시명
            cityName: '', // 수화시명
            countryName: '', // 수화지역명
            deliveryAddressInfo: '', // 수화상세주소
            deliveryHouseNo: '', // 주소상세
            permissionForce: false // 버튼권한상태값
        }
    },
    methods: {
        async openMessageBox(message) { // 메시지다이얼로그 async/await 처리
            try {
                await MessageBox.confirm(message, '信息', {
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    type: 'warning'
                })

                return true
            } catch (e) {
                return false
            }
        },
        setInputValue(element) {
            this.tempOrderInfo.filter((res, index) => {
                if (element.target.id === 'deliveryNo-' + index) {
                    element.target.value = element.target.value.replace(/[^A-Za-z0-9]/g, '').substr(0, 18)
                    res.deliveryNum = element.target.value
                }
            })

            if (element.target.id === 'deliveryUserPhone') {
                element.target.value = element.target.value.replace(/[^0-9]/g, '').substr(0, 11)
                this.deliveryUserPhone = element.target.value
            }
        },
        getDeliveryCompany() {
            getAllDeliveryCompany().then(response => {
                if (response.code === 0) {
                    this.deliveryCompany = response.data
                    let temp = []

                    response.data.sort((a, b) => {
                        if (a.type > b.type) {
                            return -1
                        }

                        return 0
                    })

                    response.data.filter(res => {
                        if (!this.deliveryCompanyByType[res.type]) {
                            temp = []
                        }

                        temp.push(res)
                        this.deliveryCompanyByType[res.type] = temp
                    })
                }
            })
        },
        getOrderData() { // 해당 주문아이디에 따르는 주문정보 얻기
            this.orderData = []
            this.printData = []

            getOrderDetail(this.orderId).then(response => {
                if (response.code === 0) {
                    this.orderRemark = response.data.orderRemark
                    this.orderData.push(response.data)
                    this.subOrderData = response.data.deliveries
                    this.dutyAdmin = response.data.dutyAdmin
                    let tempProdWeight = 0

                    this.subOrderData.filter(res => {
                        let temp = []

                        if (res.boxes.length !== 0) {
                            res.boxes.filter(v => {
                                if (v.name === '三号泡沫箱') {
                                    this.foamCount += v.num
                                }

                                if (v.name === '纸箱') {
                                    this.cartonCount += v.num
                                }

                                this.packageWeight += v.weight
                            })
                        }

                        res.packages.filter(v => {
                            v.shops.filter(vv => {
                                vv.goods.filter(vvv => {
                                    tempProdWeight += (vvv.goodsWeight * vvv.goodsNum)
                                })
                            })
                        })

                        this.prodWeight += tempProdWeight
                        let tempDeliveryNo = res.deliveryNo !== null ? res.deliveryNo.split(',') : ['']

                        tempDeliveryNo.filter((resp, idx) => {
                            let val = {
                                deliveryName: res.deliveryName.split(',')[idx].trim(),
                                deliveryNo: resp.trim(),
                                deliveryPrice: res.deliveryPrice,
                                deliveryStatus: res.deliveryStatus,
                                deliveryStatusName: res.deliveryStatusName,
                                deliveryType: res.deliveryType,
                                deliveryTypeName: res.deliveryTypeName,
                                deliveryWeight: res.deliveryWeight,
                                goodsPrice: res.goodsPrice,
                                id: res.id,
                                orderNo: res.orderNo,
                                orderPrice: res.orderPrice,
                                packagePrice: res.packagePrice,
                                packageTypeName: res.packageTypeName,
                                foamWeight: 0,
                                foamCount: 0,
                                cartonWeight: 0,
                                cartonCount: 0,
                                prodWeight: 0
                            }

                            if (res.boxes.length !== 0) {
                                res.boxes.filter(v => {
                                    if (v.name === '三号泡沫箱') {
                                        val.foamWeight = v.weight
                                        val.foamCount = v.num
                                    }

                                    if (v.name === '纸箱') {
                                        val.cartonWeight = v.weight
                                        val.cartonCount = v.num
                                    }
                                })
                            }

                            res.packages.filter(v => {
                                v.shops.filter(vv => {
                                    vv.goods.filter(vvv => {
                                        val.prodWeight += (vvv.goodsWeight * vvv.goodsNum)
                                    })
                                })
                            })

                            temp.push(val)
                            this.tableOrderData[res.orderNo] = temp
                        })

                        if (res.deliveryStatus === '0') {
                            this.isDeliveryStatus = true
                        }
                    })

                    response.data.deliveries.filter(res => {
                        this.tableOrderData[res.orderNo].sort((a, b) => {
                            if (a.deliveryTypeName > b.deliveryTypeName) {
                                return 1
                            }

                            if (a.deliveryTypeName < b.deliveryTypeName) {
                                return -1
                            }

                            return 0
                        })
                    })

                    response.data.deliveries.filter(res => {
                        this.tableOrderData[res.orderNo].filter((resp, idx) => {
                            if (this.spanOrderCnt[resp.deliveryTypeName]) {
                                this.spanOrderCnt[resp.deliveryTypeName].count = this.spanOrderCnt[resp.deliveryTypeName].count + 1
                            } else {
                                this.spanOrderCnt[resp.deliveryTypeName] = {
                                    count: 1,
                                    deliveryTypeName: resp.deliveryTypeName,
                                    index: idx
                                }
                            }
                        })
                    })

                    let tmp = []
                    let tmpShop = []
                    let tmpPrint = []

                    response.data.deliveries.filter(res => {
                        tmp = []
                        tmpPrint = []

                        let deliName = ''

                        if (res.deliveryType === 1) {
                            deliName = '陆运'
                        }

                        if (res.deliveryType === 2) {
                            deliName = '空运'
                        }

                        if (res.deliveryType === 3) {
                            deliName = '跑腿'
                        }

                        if (res.deliveryType === 4) {
                            deliName = '自取'
                        }

                        if (res.deliveryType === 5) {
                            deliName = '陆运+空运'
                        }

                        let kkk = {
                            deliveryType: deliName,
                            deliveryName: res.deliveryName,
                            postageFreeStatus: res.postageFreeStatus,
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
                                        let value = {
                                            typeId: r.typeId,
                                            typeName: r.typeName,
                                            shopName: val.shopName,
                                            shopPhone: val.shopPhone,
                                            shopOwner: val.shopOwner,
                                            goodsName: v.goodsName,
                                            goodsShortName: v.goodsShortName,
                                            sizeName: v.sizeName,
                                            goodsImg: v.goodsImg,
                                            packageType: v.packageType,
                                            packagePrice: v.packagePrice,
                                            goodsPrice: v.goodsPrice,
                                            goodsWeight: v.goodsWeight,
                                            goodsNum: v.goodsNum,
                                            boxInfo: v.boxInfo
                                        }

                                        let zzz = {
                                            goodsName: v.goodsName,
                                            goodsNum: v.goodsNum,
                                            goodsPrice: v.goodsPrice,
                                            goodsShortName: v.goodsShortName,
                                            totalPrice: v.goodsPrice * v.goodsNum,
                                            sizeName: v.sizeName,
                                            goodsUnit: v.goodsUnit
                                        }

                                        tmp.push(value)
                                        tmpShop.push(zzz)
                                    }
                                })

                                vvv.goods = tmpShop
                                tmpPrint.push(vvv)
                            })
                        })

                        kkk.shops = tmpPrint
                        this.printData.push(kkk)
                        this.orderGoods[res.orderNo] = tmp
                    })

                    this.orderNo = response.data.orderNo
                    this.userNick = response.data.userNick
                    this.createDt = response.data.createDt
                    this.payDt = response.data.payDt
                    this.deliveryDt = response.data.deliveryDt
                    this.doneDt = response.data.doneDt
                    this.refundDt = response.data.refundDt
                    this.cancelDt = response.data.cancelDt
                    this.orderStatusName = response.data.orderStatusName
                    this.orderStatus = response.data.orderStatus
                    this.orderRemark = response.data.orderRemark
                    this.userName = response.data.userName
                    this.userPhone = response.data.userPhone
                    this.deliveryUserName = response.data.userName
                    this.deliveryUserPhone = response.data.userPhone
                    this.provinceName = response.data.provinceName

                    if (response.data.cityName.search('北京城区') !== -1) {
                        this.cityName = response.data.cityName.replace('北京城区', ' ')
                    } else if (response.data.cityName.search('上海城区') !== -1) {
                        this.cityName = response.data.cityName.replace('上海城区', ' ')
                    } else if (response.data.cityName.search('天津城区') !== -1) {
                        this.cityName = response.data.cityName.replace('天津城区', ' ')
                    } else {
                        this.cityName = response.data.cityName
                    }

                    this.countryName = response.data.countryName
                    this.deliveryProvinceName = response.data.provinceName
                    this.deliveryCityName = response.data.cityName
                    this.delveryCountryName = response.data.countryName
                    this.addressInfo = response.data.addressInfo
                    this.houseNo = response.data.houseNo
                    this.deliveryAddressInfo = response.data.addressInfo
                    this.deliveryHouseNo = response.data.houseNo
                    this.deliveryProvinceName = response.data.provinceName
                    this.deliveryCityName = response.data.cityName
                    this.deliveryCountryName = response.data.countryName
                    this.deliveryType = response.data.deliveryType
                    this.payNo = response.data.payNo
                    this.payType = response.data.payType
                    this.payStatus = response.data.payStatus
                    this.orderPrice = response.data.orderPrice
                    this.goodsPrice = response.data.goodsPrice
                    this.deliveryPrice = response.data.deliveryPrice
                    this.deliveryWeight = response.data.deliveryWeight
                    this.packagePrice = response.data.packagePrice
                    this.deliveries = response.data.deliveries

                    if (response.data.deliveryType === '跑腿') {
                        this.deliveryNo = response.data.deliveries[0].deliveryNo !== null ? response.data.deliveries[0].deliveryNo : ''
                    }

                    this.provinceData.filter(prov => {
                        if (prov.name === this.deliveryProvinceName) {
                            this.cityData = prov.districts

                            prov.districts.filter(city => {
                                if (city.name === this.deliveryCityName) {
                                    this.countryData = city.districts
                                }
                            })
                        }
                    })
                }
            })
        },
        setCancelOrder() { // 주문취소하기
            if (this.isClicked) {
                return
            }

            if (this.cancelReason.trim() === '') {
                showToast(this, '请输入理由', 'warning')
                return
            }

            const query = {
                info: this.cancelReason
            }
            this.isClicked = true

            setCancelOrder(this.orderId, query).then(response => {
                this.setCancelDialog()
                this.isClicked = false

                if (response === '') {
                    showToast(this, '操作成功', 'success')
                    this.getOrderData()
                }
            })
        },
        setRefundOrder() { // 주문취소하기
            if (this.isClicked) {
                return
            }

            if (this.refundReason.trim() === '') {
                showToast(this, '请输入理由', 'warning')
                return
            }

            const query = {
                info: this.refundReason
            }
            this.isClicked = true

            setRefundOrder(this.orderId, query).then(response => {
                this.setCancelDialog()
                this.isClicked = false

                if (response === '') {
                    showToast(this, '操作成功', 'success')
                    this.getOrderData()
                }
            })
        },
        async setSendDelivery() { // 수화발송하기(배달)
            if (this.isClicked) {
                return
            }

            const isSuccess = await this.openMessageBox('是否确认？')

            if (!isSuccess) {
                return
            }

            this.isClicked = true

            setSendDelivery(parseInt(this.orderId)).then(response => {
                if (response === '') {
                    showToast(this, '操作成功', 'success')
                    this.$router.push({
                        path: '/order/order_list'
                    })
                }

                this.isClicked = false
            })
        },
        setSendShipping(orderid, deliveryNo, companyCode) { // 수화발송
            if (this.isClicked) {
                return
            }

            if (deliveryNo === '') {
                showToast(this, '请输入运单号', 'warning')
                return
            }

            if (companyCode === '') {
                showToast(this, '请选择配送公司', 'warning')
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
                if (response === '') {
                    showToast(this, '操作成功', 'success')
                    this.getOrderData()

                    this.tempOrderInfo.filter(res => {
                        if (res.deliveryNum === deliveryNo) {
                            res.deliveryNo = deliveryNo
                        }
                    })
                }

                this.isClicked = false
            })
        },
        setPrint() {
            if (this.isClicked) {
                return
            }

            this.isClicked = true
            this.todayDate = this.$moment(new Date()).format('MM-DD HH:mm:ss')

            setTimeout(() => {
                this.isClicked = false

                printJS({
                    printable: this.$refs.print.id,
                    type: 'html',
                    targetStyles: ['*']
                })
            }, 1000)
        },
        async setOrderFinish() { // 수화확인
            if (this.dutyAdmin === '' || this.dutyAdmin === null) {
                showToast(this, '请填写当天值班人员', 'warning')
                return
            }

            if (this.isClicked) {
                return
            }

            const isSuccess = await this.openMessageBox('是否确认？')

            if (!isSuccess) {
                return
            }

            this.isClicked = true

            setFinishOrder(this.orderId).then(response => {
                if (response === '') {
                    showToast(this, '操作成功', 'success')
                    this.getOrderData()
                }

                this.isClicked = false
            })
        },
        setShowOrderHistoryDialog() { // 주문상태기록 다이얼로그 로출
            this.isShowOrderHistory = true
        },
        setShowDeliveryStatusDialog(orderid, suborderid) { // 배송진행상태 확인 다이얼로그 로출
            this.isShowDeliveryStatusDialog = true

            getDeliveryStatus(orderid, suborderid).then(response => {
                if (response.code === 0) {
                    this.deliveryNo = response.data.deliveryNo
                    this.deliveryName = response.data.deliveryName
                    this.tracks = response.data.tracks
                }
            })
        },
        setShowCancelDialog() { // 주문취소다이얼로그 로출
            if (this.dutyAdmin === '' || this.dutyAdmin === null) {
                showToast(this, '请填写当天值班人员', 'warning')
                return
            }

            this.isShowCancelDialog = true
            this.cancelReason = ''
        },
        setShowSendDialog(data, index, kind) { // 수화발송다이얼로그 로출
            if (this.dutyAdmin === '' || this.dutyAdmin === null) {
                showToast(this, '请填写当天值班人员', 'warning')
                return
            }

            this.kind = kind
            this.tempOrderInfo = []
            this.isShowSendDialog = true
            let temp = []

            if (index === 'all') {
                this.subOrderData.filter(res => {
                    let value = {
                        deliveryName: res.deliveryName,
                        deliveryNo: res.deliveryNo,
                        deliveryNum: res.deliveryNo,
                        deliveryPrice: res.deliveryPrice,
                        deliveryStatus: res.deliveryStatus,
                        deliveryType: res.deliveryType,
                        deliveryTypeName: res.deliveryTypeName,
                        id: res.id,
                        orderNo: res.orderNo,
                        packageTypeName: res.packageTypeName,
                        deliveryWeight: 0,
                        deliveryCompanyCode: ''
                    }

                    res.packages.filter(val => {
                        val.shops.filter(v => {
                            v.goods.filter(vv => {
                                value.deliveryWeight += (vv.goodsWeight * vv.goodsNum)
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
            }

            if (index === 'sub') {
                let value = {
                    deliveryName: data.deliveryName,
                    deliveryNo: data.deliveryNo,
                    deliveryNum: data.deliveryNo,
                    deliveryPrice: data.deliveryPrice,
                    deliveryStatus: data.deliveryStatus,
                    deliveryType: data.deliveryType,
                    deliveryTypeName: data.deliveryTypeName,
                    id: data.id,
                    orderNo: data.orderNo,
                    packageTypeName: data.packageTypeName,
                    deliveryWeight: 0,
                    deliveryCompanyCode: ''
                }

                data.packages.filter(val => {
                    val.shops.filter(v => {
                        v.goods.filter(vv => {
                            value.deliveryWeight += (vv.goodsWeight * vv.goodsNum)
                        })
                    })
                })

                this.deliveryCompany.filter(val => {
                    if (val.name === data.deliveryName) {
                        value.deliveryCompanyCode = val.code
                    }
                })

                temp.push(value)
            }

            this.tempOrderInfo = temp
        },
        setShowDeliveryNumberDialog(data) { // 택배배송번호추가 다이얼로그 로출
            this.subOrderId = data.id
            this.tmpSubOrderInfo = []
            this.isShowDeliveryNumberDialog = true
            this.dlgSpanOrderCnt = []
            let temp = []
            let tempDeliveryNo = data.deliveryNo.split(',')

            tempDeliveryNo.filter((res, idx) => {
                let value = {
                    deliveryName: data.deliveryName.split(',')[idx].trim(),
                    deliveryNum: res.trim(),
                    deliveryTypeName: data.deliveryTypeName,
                    id: data.id,
                    orderNo: data.orderNo,
                    deliveryCompanyCode: '',
                    isAdd: false,
                    isRemove: false
                }

                if (idx === 0 && tempDeliveryNo.length === 1) {
                    value.isAdd = true
                    value.isRemove = false
                } else if (idx === 0) {
                    value.isAdd = false
                    value.isRemove = false
                } else if (idx === tempDeliveryNo.length - 1) {
                    value.isAdd = true
                    value.isRemove = true
                } else {
                    value.isAdd = false
                    value.isRemove = true
                }

                this.deliveryCompanyByType[data.deliveryTypeName].filter(val => {
                    if (val.name === data.deliveryName.split(',')[idx]) {
                        value.deliveryCompanyCode = val.code
                    }
                })

                temp.push(value)
                this.tmpSubOrderInfo = temp
            })

            // 주문번호에 의한 정렬
            this.tmpSubOrderInfo.sort((a, b) => {
                if (a.orderNo < b.orderNo) {
                    return -1
                }

                return 0
            })

            this.tmpSubOrderInfo.filter((res, idx) => {
                if (this.dlgSpanOrderCnt[res.orderNo]) {
                    this.dlgSpanOrderCnt[res.orderNo].count = this.dlgSpanOrderCnt[res.orderNo].count + 1
                } else {
                    this.dlgSpanOrderCnt[res.orderNo] = {
                        count: 1,
                        orderNo: res.orderNo,
                        index: idx
                    }
                }
            })
        },
        setShowRefundDialog() { // 환불다이얼로그 로출
            if (this.dutyAdmin === '' || this.dutyAdmin === null) {
                showToast(this, '请填写当天值班人员', 'warning')
                return
            }

            this.isShowRefundDialog = true
            this.refundReason = ''
        },
        setCancelDialog() {
            this.isShowOrderHistory = false
            this.isShowDeliveryStatusDialog = false
            this.isShowCancelDialog = false
            this.isShowSendDialog = false
            this.isShowRefundDialog = false
            this.isShowDeliveryNumberDialog = false
            this.isShowAddressDialog = false
        },
        setAutoSendShipping(orderNo, subOrderNo) {
            if (this.isClicked) {
                return
            }

            this.isClicked = true

            setAutoSendShipping(orderNo, subOrderNo).then(response => {
                if (response === '') {
                    showToast(this, '操作成功', 'success')
                    this.getOrderData()

                    this.tempOrderInfo.filter(res => {
                        if (res.orderNo === subOrderNo) {
                            res.deliveryNo = '1'
                        }
                    })
                }

                this.isClicked = false
            })
        },
        setAddDeliveryNumber(data) { // 택배배송번호 추가
            let isEmpty = false
            let isExist = false
            let index = 0
            let arrExist = []

            this.tmpSubOrderInfo.filter((res, idx) => {
                if (res.deliveryNum === '') {
                    index = idx
                    isEmpty = true
                }
            })

            if (isEmpty) {
                this.$refs['deliveryNo-' + index].focus()
                showToast(this, '请输入运单号', 'warning')
                return
            }

            this.tmpSubOrderInfo.filter((res, idx) => {
                if (arrExist[res.deliveryNum]) {
                    index = idx
                    isExist = true
                } else {
                    arrExist[res.deliveryNum] = res.deliveryNum
                }
            })

            if (isExist) {
                this.$refs['deliveryNo-' + index].focus()
                showToast(this, '该快递单号已录入', 'warning')
                return
            }

            this.dlgSpanOrderCnt = []

            let value = {
                deliveryName: data.deliveryName,
                deliveryNum: '',
                deliveryTypeName: data.deliveryTypeName,
                id: data.id,
                orderNo: data.orderNo,
                deliveryCompanyCode: '',
                isAdd: true,
                isRemove: true
            }

            this.deliveryCompany.filter(val => {
                if (val.name === data.deliveryName) {
                    value.deliveryCompanyCode = val.code
                }
            })

            this.tmpSubOrderInfo.push(value)

            if (this.tmpSubOrderInfo[this.tmpSubOrderInfo.length - 2]) {
                this.tmpSubOrderInfo[this.tmpSubOrderInfo.length - 2].isAdd = false
            }

            // 주문번호에 의한 정렬
            this.tmpSubOrderInfo.sort((a, b) => {
                if (a.orderNo < b.orderNo) {
                    return -1
                }

                return 0
            })

            this.tmpSubOrderInfo.filter((res, idx) => {
                if (this.dlgSpanOrderCnt[res.orderNo]) {
                    this.dlgSpanOrderCnt[res.orderNo].count = this.dlgSpanOrderCnt[res.orderNo].count + 1
                } else {
                    this.dlgSpanOrderCnt[res.orderNo] = {
                        count: 1,
                        orderNo: res.orderNo,
                        index: idx
                    }
                }
            })
        },
        setRemoveDeliveryNumber(data, index) { // 택배배송번호 삭제
            if (this.tmpSubOrderInfo.length === 1) {
                return
            }

            this.tmpSubOrderInfo.splice(index, 1)
            this.dlgSpanOrderCnt.splice(index, 1)

            if (this.tmpSubOrderInfo.length === 1) {
                this.tmpSubOrderInfo[0].isAdd = true
                this.tmpSubOrderInfo[0].isRemove = false
            }
        },
        setDialogSpanOrder({
            row,
            rowIndex,
            columnIndex
        }) { // 택배배송번호 추가다이얼로그에서 테블스팬설정
            if (columnIndex === 0 || columnIndex === 1) {
                if (rowIndex === this.dlgSpanOrderCnt[row.orderNo].index) {
                    return {
                        rowspan: this.dlgSpanOrderCnt[row.orderNo].count,
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
        setSpanOrder({
            row,
            rowIndex,
            columnIndex
        }) { // 주문테블에서 스팬설정
            if (columnIndex !== 3 && columnIndex !== 4) {
                if (rowIndex === this.spanOrderCnt[row.deliveryTypeName].index) {
                    return {
                        rowspan: this.spanOrderCnt[row.deliveryTypeName].count,
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
        setAddDeliveryNumberData() {
            let isEmptyNum = false
            let isEmptyCode = false
            let index = 0

            this.tmpSubOrderInfo.filter((res, idx) => {
                if (res.deliveryNum === '') {
                    index = idx
                    isEmptyNum = true
                }

                if (res.deliveryCompanyCode === '') {
                    index = idx
                    isEmptyCode = true
                }
            })

            if (isEmptyNum) {
                this.$refs['deliveryNo-' + index].focus()
                showToast(this, '请输入运单号', 'warning')
                return
            }

            if (isEmptyCode) {
                showToast(this, '请选择配送公司', 'warning')
                return
            }

            let temp = []

            this.tmpSubOrderInfo.filter(res => {
                let value = {
                    deliveryCompanyCode: res.deliveryCompanyCode,
                    deliveryNo: res.deliveryNum
                }

                temp.push(value)
            })

            setAddDeliveryCompany(this.subOrderId, temp).then(response => {
                if (response === '') {
                    this.setCancelDialog()
                    showToast(this, '操作成功', 'success')
                    this.getOrderData()
                }
            })
        },
        setShowDeliveryInfoDialog() {
            this.isShowAddressDialog = true
        },
        setChangeProvince(e) {
            this.cityData = []
            this.countryData = []
            this.deliveryCityName = ''
            this.deliveryCountryName = ''

            this.provinceData.filter(prov => {
                if (prov.name === e) {
                    this.cityData = prov.districts
                }
            })
        },
        setChangeCity(e) {
            this.countryData = []
            this.deliveryCountryName = ''

            this.cityData.filter(city => {
                if (city.name === e) {
                    this.countryData = city.districts
                }
            })
        },
        setUpateDeliveryAddress() {
            if (this.deliveryUserName.trim() === '') {
                showToast(this, '请输入收件人姓名!', 'warning')
                return
            }

            if (this.deliveryUserPhone.trim() === '') {
                showToast(this, '请输入收件人电话!', 'warning')
                return
            }

            if (this.deliveryProvinceName.trim() === '' || this.deliveryCityName.trim() === '' || this.deliveryCountryName.trim() === '') {
                showToast(this, '请选择城市或地区!', 'warning')
                return
            }

            if (this.deliveryAddressInfo.trim() === '') {
                showToast(this, '请输入详细地址!', 'warning')
                return
            }

            const query = {
                userName: this.deliveryUserName,
                userPhone: this.deliveryUserPhone,
                province: this.deliveryProvinceName,
                city: this.deliveryCityName,
                country: this.deliveryCountryName,
                address: this.deliveryAddressInfo,
                houseNo: this.deliveryHouseNo
            }

            setOrderDeliveryAddress(this.orderNo, query).then(response => {
                if (response === '') {
                    this.setCancelDialog()
                    showToast(this, '操作成功', 'success')
                    this.getOrderData()
                }
            })
        },
        async setForceInit() {
            if (this.isClicked) {
                return
            }

            const isSuccess = await this.openMessageBox('是否确认？')

            if (!isSuccess) {
                return
            }

            this.isClicked = true
            setOrderForceInit(this.orderNo).then(response => {
                this.isClicked = false
                showToast(this, '操作成功', 'success')
                this.getOrderData()
            })
        }
    }
}