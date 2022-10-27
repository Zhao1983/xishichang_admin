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
	getOrderTimeout,
	getDeliveryStatus,
	setRefundSingleOrder,
	getOrderWarningInfo,
	setAddWarningInfo
} from "@/api/order" // 주문데이터 API 추가
import { getAllDeliveryCompany } from "@/api/shipping"

export default {
	name: 'Order_warning',
	components: {
		Pagination
	},
	created() {
		setClearGoodsSearchField()
		setClearGoodsBatchSearchField()
		setClearShopSearchField()
		setClearShopBatchField()

		this.getOrderData("")
	},
	mounted() {

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
			page: 1, // 테블페지수
			size: 10, // 테블에 보여지는 주문수
			totalNum: 0, // 주문총개수
			orderData: [], // 주문정보 배렬
			subOrderData: [], // 서브주문정보 배렬
			expandKeys: [],
			subOrderCnt: [],
			isShowRefundDialog: false,
			isShowDeliveryStatusDialog: false,
			isShowOrderDialog: false,
			isShowReceiverDialog: false,
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
			orderId: 0, // 주문아이디
			isClicked: false,
			tempOrderInfo: [],
			refundReason: "", // 환불리유
			deliveryWeight: 0,
			deliveryPrice: 0,
			orderStatusData: [], // 배송상태 배렬
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
			}
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
		getOrderData(kind) {
			// 주문정보 얻기
			const query = {
				page: this.page,
				size: this.size
			}

			this.listLoading = true

			getOrderTimeout(query).then(response => {
				if (response.code === 0) {
					this.totalNum = response.data.totalNum
					this.size = response.data.size
					this.page = response.data.page

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
		tableRowClassName({ row, rowIndex }) {
			let isFree = false

			row.deliveries.filter(res => {
				if (res.postageFreeStatus === "1") {
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
		setCancelDialog() {
			this.isShowOrderDialog = false
			this.isShowDeliveryStatusDialog = false
			this.isShowRefundDialog = false
			this.isShowReceiverDialog = false
			this.isShowDialogDuty = false
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